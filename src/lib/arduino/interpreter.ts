/* ============================================================================
   A tree-walking interpreter for the parsed sketch.

   It is written as a generator so that `delay()` can suspend execution and
   hand control back to the browser. That is what lets a student watch an LED
   blink at one-second intervals inside a page that stays responsive, and it is
   what lets the step-through debugger pause on a line.
   ========================================================================== */

import { ArduinoError, parse, type Expr, type FunctionDecl, type Program, type Stmt } from './parser'
import { A0, ANALOG_PINS, Board, DIGITAL_PINS, type PinMode } from './board'

export type Value = number | string | boolean | Value[]

/** What the interpreter hands back to its driver each time it pauses. */
export type Yielded =
  | { type: 'delay'; ms: number; line: number }
  | { type: 'line'; line: number }

interface Scope {
  vars: Map<string, { value: Value; type: string; isConst: boolean }>
  parent?: Scope
}

class BreakSignal {}
class ContinueSignal {}
class ReturnSignal {
  constructor(public value: Value) {}
}

const NAMED: Record<string, number> = {
  HIGH: 1,
  LOW: 0,
  INPUT: 0,
  OUTPUT: 1,
  INPUT_PULLUP: 2,
  LED_BUILTIN: 13,
  true: 1,
  false: 0,
  PI: Math.PI,
}
for (let i = 0; i < ANALOG_PINS; i++) NAMED[`A${i}`] = A0 + i

const PIN_MODE_BY_CODE: Record<number, PinMode> = {
  0: 'INPUT',
  1: 'OUTPUT',
  2: 'INPUT_PULLUP',
}

export interface RunOptions {
  /** Called whenever the sketch writes to a pin, so the circuit can react. */
  onPinChange?: () => void
  /** Ceiling on statements executed between yields, so an accidental
   *  `while(true){}` cannot lock the tab. */
  budget?: number
}

export class Interpreter {
  private program: Program
  private functions = new Map<string, FunctionDecl>()
  private globals: Scope = { vars: new Map() }
  private steps = 0
  /** Set when the sketch loops forever without a delay, so the driver can
   *  warn instead of freezing. */
  runawayGuard = 0

  constructor(
    source: string,
    public board: Board,
    private opts: RunOptions = {},
  ) {
    this.program = parse(source)
    for (const fn of this.program.functions) this.functions.set(fn.name, fn)
    if (!this.functions.has('setup') && !this.functions.has('loop')) {
      throw new ArduinoError(
        'This sketch has no setup() and no loop().',
        1,
        'Every Arduino sketch needs void setup() { } and void loop() { }.',
      )
    }
  }

  hasLoop(): boolean {
    return this.functions.has('loop')
  }

  /** Run the global declarations and setup(). Yields on delay. */
  *runSetup(): Generator<Yielded, void, void> {
    this.globals = { vars: new Map() }
    for (const stmt of this.program.globals) {
      yield* this.execStatement(stmt, this.globals)
    }
    const setup = this.functions.get('setup')
    if (setup) yield* this.callFunction(setup, [])
  }

  /** Run one pass of loop(). Yields on delay. */
  *runLoopOnce(): Generator<Yielded, void, void> {
    const loop = this.functions.get('loop')
    if (!loop) return
    this.runawayGuard = 0
    yield* this.callFunction(loop, [])
  }

  /* ----------------------------------------------------- statements -- */

  private *callFunction(fn: FunctionDecl, args: Value[]): Generator<Yielded, Value, void> {
    const scope: Scope = { vars: new Map(), parent: this.globals }
    fn.params.forEach((p, i) => {
      scope.vars.set(p.name, { value: args[i] ?? 0, type: p.type, isConst: false })
    })
    try {
      yield* this.execStatement(fn.body, scope)
    } catch (e) {
      if (e instanceof ReturnSignal) return e.value
      throw e
    }
    return 0
  }

  private *execStatement(stmt: Stmt, scope: Scope): Generator<Yielded, void, void> {
    this.steps++
    this.runawayGuard++
    if (this.runawayGuard > 400_000) {
      throw new ArduinoError(
        'This sketch is looping without ever finishing.',
        stmt.line,
        'A while or for loop here never becomes false. Check that the value in the condition actually changes inside the loop.',
      )
    }
    // Advance the virtual clock a little per statement so millis() moves even
    // in a sketch with no delay() at all.
    this.board.clock += 0.05

    switch (stmt.kind) {
      case 'empty':
        return

      case 'expr':
        yield { type: 'line', line: stmt.line }
        yield* this.evaluate(stmt.expr, scope)
        return

      case 'declare': {
        yield { type: 'line', line: stmt.line }
        for (const d of stmt.declarations) {
          let value: Value = defaultFor(stmt.type)
          if (d.init) value = yield* this.evaluate(d.init, scope)
          if (d.arraySize && !Array.isArray(value)) {
            const size = Number(yield* this.evaluate(d.arraySize, scope))
            value = Array.from({ length: size }, () => defaultFor(stmt.type))
          }
          scope.vars.set(d.name, {
            value: coerce(value, stmt.type),
            type: stmt.type,
            isConst: stmt.isConst,
          })
        }
        return
      }

      case 'block': {
        const inner: Scope = { vars: new Map(), parent: scope }
        for (const s of stmt.body) yield* this.execStatement(s, inner)
        return
      }

      case 'if': {
        yield { type: 'line', line: stmt.line }
        if (truthy(yield* this.evaluate(stmt.test, scope))) {
          yield* this.execStatement(stmt.then, scope)
        } else if (stmt.else) {
          yield* this.execStatement(stmt.else, scope)
        }
        return
      }

      case 'while': {
        for (;;) {
          yield { type: 'line', line: stmt.line }
          if (!truthy(yield* this.evaluate(stmt.test, scope))) break
          try {
            yield* this.execStatement(stmt.body, scope)
          } catch (e) {
            if (e instanceof BreakSignal) break
            if (!(e instanceof ContinueSignal)) throw e
          }
        }
        return
      }

      case 'do': {
        for (;;) {
          try {
            yield* this.execStatement(stmt.body, scope)
          } catch (e) {
            if (e instanceof BreakSignal) break
            if (!(e instanceof ContinueSignal)) throw e
          }
          yield { type: 'line', line: stmt.line }
          if (!truthy(yield* this.evaluate(stmt.test, scope))) break
        }
        return
      }

      case 'for': {
        const forScope: Scope = { vars: new Map(), parent: scope }
        if (stmt.init) yield* this.execStatement(stmt.init, forScope)
        for (;;) {
          yield { type: 'line', line: stmt.line }
          if (stmt.test && !truthy(yield* this.evaluate(stmt.test, forScope))) break
          try {
            yield* this.execStatement(stmt.body, forScope)
          } catch (e) {
            if (e instanceof BreakSignal) break
            if (!(e instanceof ContinueSignal)) throw e
          }
          if (stmt.update) yield* this.evaluate(stmt.update, forScope)
        }
        return
      }

      case 'return': {
        yield { type: 'line', line: stmt.line }
        const value = stmt.value ? yield* this.evaluate(stmt.value, scope) : 0
        throw new ReturnSignal(value)
      }

      case 'break':
        throw new BreakSignal()
      case 'continue':
        throw new ContinueSignal()
    }
  }

  /* ---------------------------------------------------- expressions -- */

  private lookup(scope: Scope, name: string) {
    let s: Scope | undefined = scope
    while (s) {
      const found = s.vars.get(name)
      if (found) return found
      s = s.parent
    }
    return undefined
  }

  private *evaluate(expr: Expr, scope: Scope): Generator<Yielded, Value, void> {
    switch (expr.kind) {
      case 'num':
        return expr.value
      case 'str':
        return expr.value
      case 'char':
        return expr.value.charCodeAt(0)
      case 'bool':
        return expr.value ? 1 : 0

      case 'ident': {
        const v = this.lookup(scope, expr.name)
        if (v) return v.value
        if (expr.name in NAMED) return NAMED[expr.name]
        throw new ArduinoError(
          `"${expr.name}" has not been declared.`,
          expr.line,
          'Declare it first, for example: int ' +
            expr.name +
            ' = 0;  — and remember Arduino is case sensitive, so ledPin and LedPin are different names.',
        )
      }

      case 'unary': {
        const v = yield* this.evaluate(expr.arg, scope)
        switch (expr.op) {
          case '-':
            return -Number(v)
          case '+':
            return Number(v)
          case '!':
            return truthy(v) ? 0 : 1
          case '~':
            return ~Number(v)
        }
        return 0
      }

      case 'update': {
        if (expr.arg.kind !== 'ident') {
          throw new ArduinoError('++ and -- only work on a variable.', expr.line)
        }
        const slot = this.lookup(scope, expr.arg.name)
        if (!slot) {
          throw new ArduinoError(`"${expr.arg.name}" has not been declared.`, expr.line)
        }
        if (slot.isConst) {
          throw new ArduinoError(
            `"${expr.arg.name}" was declared const, so it cannot change.`,
            expr.line,
            'A const value is fixed for the whole sketch. Drop const if it needs to change.',
          )
        }
        const before = Number(slot.value)
        const after = expr.op === '++' ? before + 1 : before - 1
        slot.value = coerce(after, slot.type)
        return expr.prefix ? slot.value : before
      }

      case 'binary': {
        const l = yield* this.evaluate(expr.left, scope)
        const r = yield* this.evaluate(expr.right, scope)
        return binary(expr.op, l, r, expr.line)
      }

      case 'logical': {
        const l = yield* this.evaluate(expr.left, scope)
        if (expr.op === '&&') {
          if (!truthy(l)) return 0
          return truthy(yield* this.evaluate(expr.right, scope)) ? 1 : 0
        }
        if (truthy(l)) return 1
        return truthy(yield* this.evaluate(expr.right, scope)) ? 1 : 0
      }

      case 'ternary':
        return truthy(yield* this.evaluate(expr.test, scope))
          ? yield* this.evaluate(expr.then, scope)
          : yield* this.evaluate(expr.else, scope)

      case 'assign': {
        const value = yield* this.evaluate(expr.value, scope)
        if (expr.target.kind === 'index') {
          const arr = yield* this.evaluate(expr.target.object, scope)
          const idx = Number(yield* this.evaluate(expr.target.index, scope))
          if (!Array.isArray(arr)) {
            throw new ArduinoError('That is not an array.', expr.line)
          }
          arr[idx] = value
          return value
        }
        if (expr.target.kind !== 'ident') {
          throw new ArduinoError('You can only assign to a variable.', expr.line)
        }
        const slot = this.lookup(scope, expr.target.name)
        if (!slot) {
          throw new ArduinoError(
            `"${expr.target.name}" has not been declared.`,
            expr.line,
            `Give it a type first, for example: int ${expr.target.name} = 0;`,
          )
        }
        if (slot.isConst) {
          throw new ArduinoError(
            `"${expr.target.name}" was declared const, so it cannot be changed.`,
            expr.line,
            'const means the value is fixed. Remove const if this needs to change while the sketch runs.',
          )
        }
        const next =
          expr.op === '='
            ? value
            : binary(expr.op.slice(0, -1), slot.value, value, expr.line)
        slot.value = coerce(next, slot.type)
        return slot.value
      }

      case 'index': {
        const arr = yield* this.evaluate(expr.object, scope)
        const idx = Number(yield* this.evaluate(expr.index, scope))
        if (Array.isArray(arr)) return arr[idx] ?? 0
        if (typeof arr === 'string') return arr.charCodeAt(idx)
        throw new ArduinoError('That is not an array.', expr.line)
      }

      case 'member':
        // Only reached for something like `Serial.foo` used as a value.
        return 0

      case 'call':
        return yield* this.call(expr, scope)
    }
  }

  private *call(expr: Extract<Expr, { kind: 'call' }>, scope: Scope): Generator<Yielded, Value, void> {
    const line = expr.line

    // Serial.x(...)
    if (expr.callee.kind === 'member') {
      const obj = expr.callee.object
      const method = expr.callee.property
      if (obj.kind === 'ident' && obj.name === 'Serial') {
        const args: Value[] = []
        for (const a of expr.args) args.push(yield* this.evaluate(a, scope))
        switch (method) {
          case 'begin':
            this.board.serialOpen = true
            return 0
          case 'print':
            this.board.print(fmt(args[0], args[1]))
            return 0
          case 'println':
            this.board.print(fmt(args[0], args[1]) + '\n')
            return 0
          case 'available':
            return 0
          default:
            return 0
        }
      }
      throw new ArduinoError(`I do not know how to call ${method}() on that.`, line)
    }

    if (expr.callee.kind !== 'ident') {
      throw new ArduinoError('That is not something I can call.', line)
    }
    const name = expr.callee.name

    if (name === '__array') {
      const items: Value[] = []
      for (const a of expr.args) items.push(yield* this.evaluate(a, scope))
      return items
    }
    if (name.startsWith('__cast_')) {
      const to = name.slice(7)
      const v = yield* this.evaluate(expr.args[0], scope)
      return coerce(v, to)
    }

    // User-defined function.
    const user = this.functions.get(name)
    if (user) {
      const args: Value[] = []
      for (const a of expr.args) args.push(yield* this.evaluate(a, scope))
      return yield* this.callFunction(user, args)
    }

    const args: Value[] = []
    for (const a of expr.args) args.push(yield* this.evaluate(a, scope))

    switch (name) {
      case 'pinMode': {
        const pin = this.checkPin(args[0], line)
        const mode = PIN_MODE_BY_CODE[Number(args[1])]
        if (!mode) {
          throw new ArduinoError(
            'The second value of pinMode() must be INPUT, OUTPUT or INPUT_PULLUP.',
            line,
          )
        }
        this.board.pinMode(pin, mode)
        this.opts.onPinChange?.()
        return 0
      }
      case 'digitalWrite': {
        const pin = this.checkPin(args[0], line)
        if (this.board.pins[pin].mode !== 'OUTPUT') {
          throw new ArduinoError(
            `Pin ${pin} was never set to OUTPUT, so digitalWrite() has nothing to drive.`,
            line,
            `Add pinMode(${pin}, OUTPUT); inside setup() before writing to this pin.`,
          )
        }
        this.board.digitalWrite(pin, Number(args[1]))
        this.opts.onPinChange?.()
        return 0
      }
      case 'analogWrite': {
        const pin = this.checkPin(args[0], line)
        this.board.analogWrite(pin, Number(args[1]))
        this.opts.onPinChange?.()
        return 0
      }
      case 'digitalRead':
        return this.board.digitalRead(this.checkPin(args[0], line))
      case 'analogRead': {
        const pin = this.checkPin(args[0], line)
        if (pin < A0) {
          throw new ArduinoError(
            `analogRead() needs an analog pin such as A0, not pin ${pin}.`,
            line,
            'The analog inputs are labelled A0 to A5 along one edge of the board.',
          )
        }
        return this.board.analogRead(pin)
      }
      case 'delay': {
        const ms = Math.max(0, Number(args[0]))
        yield { type: 'delay', ms, line }
        return 0
      }
      case 'delayMicroseconds': {
        yield { type: 'delay', ms: Number(args[0]) / 1000, line }
        return 0
      }
      case 'millis':
        return Math.floor(this.board.clock)
      case 'micros':
        return Math.floor(this.board.clock * 1000)
      case 'map': {
        const [v, inMin, inMax, outMin, outMax] = args.map(Number)
        if (inMax === inMin) return outMin
        return Math.round(((v - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin)
      }
      case 'constrain': {
        const [v, lo, hi] = args.map(Number)
        return Math.min(hi, Math.max(lo, v))
      }
      case 'min':
        return Math.min(...args.map(Number))
      case 'max':
        return Math.max(...args.map(Number))
      case 'abs':
        return Math.abs(Number(args[0]))
      case 'pow':
        return Math.pow(Number(args[0]), Number(args[1]))
      case 'sqrt':
        return Math.sqrt(Number(args[0]))
      case 'round':
        return Math.round(Number(args[0]))
      case 'floor':
        return Math.floor(Number(args[0]))
      case 'ceil':
        return Math.ceil(Number(args[0]))
      case 'random':
        return args.length > 1
          ? Math.floor(Math.random() * (Number(args[1]) - Number(args[0]))) + Number(args[0])
          : Math.floor(Math.random() * Number(args[0]))
      case 'randomSeed':
        return 0
      case 'tone':
      case 'noTone': {
        const pin = this.checkPin(args[0], line)
        this.board.analogWrite(pin, name === 'tone' ? 255 : 0)
        this.opts.onPinChange?.()
        return 0
      }
      default:
        throw new ArduinoError(
          `I do not know a function called ${name}().`,
          line,
          'Check the spelling and the capital letters. Arduino is case sensitive, so digitalwrite() is not digitalWrite().',
        )
    }
  }

  private checkPin(value: Value, line: number): number {
    const pin = Number(value)
    if (!Number.isFinite(pin) || pin < 0 || pin >= A0 + ANALOG_PINS) {
      throw new ArduinoError(
        `Pin ${value} does not exist on an Arduino Uno.`,
        line,
        `The Uno has digital pins 0 to ${DIGITAL_PINS - 1} and analog pins A0 to A5.`,
      )
    }
    return pin
  }
}

/* ------------------------------------------------------------ helpers -- */

function truthy(v: Value): boolean {
  if (typeof v === 'boolean') return v
  if (typeof v === 'number') return v !== 0
  if (typeof v === 'string') return v.length > 0
  return true
}

function binary(op: string, l: Value, r: Value, line: number): Value {
  if (op === '+' && (typeof l === 'string' || typeof r === 'string')) {
    return String(numToStr(l)) + String(numToStr(r))
  }
  const a = Number(l)
  const b = Number(r)
  switch (op) {
    case '+': return a + b
    case '-': return a - b
    case '*': return a * b
    case '/':
      if (b === 0) {
        throw new ArduinoError(
          'Division by zero.',
          line,
          'Check the value on the right of the / before dividing by it.',
        )
      }
      return a / b
    case '%':
      if (b === 0) throw new ArduinoError('Cannot take a remainder by zero.', line)
      return a % b
    case '==': return a === b ? 1 : 0
    case '!=': return a !== b ? 1 : 0
    case '<': return a < b ? 1 : 0
    case '>': return a > b ? 1 : 0
    case '<=': return a <= b ? 1 : 0
    case '>=': return a >= b ? 1 : 0
    case '&': return a & b
    case '|': return a | b
    case '^': return a ^ b
    case '<<': return a << b
    case '>>': return a >> b
    default:
      throw new ArduinoError(`I do not understand the operator "${op}".`, line)
  }
}

function numToStr(v: Value): string {
  if (typeof v === 'number') return Number.isInteger(v) ? String(v) : v.toFixed(2)
  return String(v)
}

function fmt(v: Value, digits?: Value): string {
  if (typeof v === 'number' && digits !== undefined) return v.toFixed(Number(digits))
  return numToStr(v ?? '')
}

function defaultFor(type: string): Value {
  if (type.includes('String')) return ''
  return 0
}

/** Integer types truncate. This is the single most common surprise for a
 *  beginner (`int x = 5/2;` giving 2), so the interpreter models it exactly. */
export function coerce(v: Value, type: string): Value {
  if (Array.isArray(v)) return v
  if (type.includes('String')) return typeof v === 'string' ? v : numToStr(v)
  if (typeof v === 'string') return v
  const n = Number(v)
  if (type.includes('float') || type.includes('double')) return n
  if (type.includes('boolean') || type.includes('bool')) return n ? 1 : 0
  if (type.includes('byte')) return ((Math.trunc(n) % 256) + 256) % 256
  if (type.includes('char')) return Math.trunc(n)
  if (type.includes('int') || type.includes('long') || type.includes('short')) {
    return Math.trunc(n)
  }
  return n
}

export { ArduinoError }
