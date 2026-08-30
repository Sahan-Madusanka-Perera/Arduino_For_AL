/* ============================================================================
   A lexer and parser for the subset of the Arduino language the syllabus
   teaches: setup/loop, the six variable types it names, const, if / else if /
   else, for / while / do-while, and the pin and timing functions used in the
   four worked practicals.

   It is a real parser, not a pattern matcher. That matters, because a beginner
   learns as much from a precise error on line 7 as from a program that runs.
   ========================================================================== */

export type TokenType =
  | 'num'
  | 'str'
  | 'char'
  | 'ident'
  | 'keyword'
  | 'punct'
  | 'eof'

export interface Token {
  type: TokenType
  value: string
  line: number
  col: number
}

export class ArduinoError extends Error {
  constructor(
    message: string,
    public line: number,
    /** Plain-language repair advice for a beginner. */
    public hint?: string,
  ) {
    super(message)
    this.name = 'ArduinoError'
  }
}

const KEYWORDS = new Set([
  'void', 'int', 'float', 'double', 'char', 'boolean', 'bool', 'byte', 'long',
  'short', 'unsigned', 'String', 'const', 'static', 'if', 'else', 'for',
  'while', 'do', 'return', 'break', 'continue', 'true', 'false', 'switch',
  'case', 'default',
])

const PUNCT = [
  '<<=', '>>=', '...',
  '==', '!=', '<=', '>=', '&&', '||', '++', '--', '+=', '-=', '*=', '/=',
  '%=', '&=', '|=', '^=', '<<', '>>', '->',
  '{', '}', '(', ')', '[', ']', ';', ',', '.', '+', '-', '*', '/', '%',
  '=', '<', '>', '!', '&', '|', '^', '~', '?', ':',
]

export function tokenize(src: string): Token[] {
  const out: Token[] = []
  let i = 0
  let line = 1
  let lineStart = 0

  const push = (type: TokenType, value: string, at: number) =>
    out.push({ type, value, line, col: at - lineStart + 1 })

  while (i < src.length) {
    const c = src[i]

    if (c === '\n') {
      i++
      line++
      lineStart = i
      continue
    }
    if (c === ' ' || c === '\t' || c === '\r') {
      i++
      continue
    }

    // Comments — both forms the syllabus teaches.
    if (c === '/' && src[i + 1] === '/') {
      while (i < src.length && src[i] !== '\n') i++
      continue
    }
    if (c === '/' && src[i + 1] === '*') {
      const startLine = line
      i += 2
      let closed = false
      while (i < src.length) {
        if (src[i] === '\n') {
          line++
          lineStart = i + 1
        }
        if (src[i] === '*' && src[i + 1] === '/') {
          i += 2
          closed = true
          break
        }
        i++
      }
      if (!closed) {
        throw new ArduinoError(
          'This multi-line comment was never closed.',
          startLine,
          'A comment opened with /* has to be closed with */ somewhere below it.',
        )
      }
      continue
    }

    // Preprocessor lines are skipped rather than failed, so a sketch copied
    // from elsewhere with an #include still runs the parts we support.
    if (c === '#') {
      while (i < src.length && src[i] !== '\n') i++
      continue
    }

    const start = i

    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1] ?? ''))) {
      while (i < src.length && /[0-9a-fA-FxXbB._]/.test(src[i])) i++
      push('num', src.slice(start, i), start)
      continue
    }

    if (/[A-Za-z_]/.test(c)) {
      while (i < src.length && /[A-Za-z0-9_]/.test(src[i])) i++
      const word = src.slice(start, i)
      push(KEYWORDS.has(word) ? 'keyword' : 'ident', word, start)
      continue
    }

    if (c === '"') {
      i++
      let value = ''
      while (i < src.length && src[i] !== '"') {
        if (src[i] === '\\') {
          value += unescape(src[i + 1])
          i += 2
        } else {
          if (src[i] === '\n') line++
          value += src[i++]
        }
      }
      if (src[i] !== '"') {
        throw new ArduinoError('This text was never closed with a " mark.', line)
      }
      i++
      push('str', value, start)
      continue
    }

    if (c === "'") {
      i++
      let value = ''
      if (src[i] === '\\') {
        value = unescape(src[i + 1])
        i += 2
      } else {
        value = src[i++]
      }
      if (src[i] !== "'") {
        throw new ArduinoError("This character was never closed with a ' mark.", line)
      }
      i++
      push('char', value, start)
      continue
    }

    const p = PUNCT.find((sym) => src.startsWith(sym, i))
    if (p) {
      i += p.length
      push('punct', p, start)
      continue
    }

    throw new ArduinoError(
      `I do not recognise the character "${c}".`,
      line,
      'Check for a stray symbol or a character pasted from a word processor.',
    )
  }

  out.push({ type: 'eof', value: '', line, col: 1 })
  return out
}

function unescape(ch: string): string {
  switch (ch) {
    case 'n': return '\n'
    case 't': return '\t'
    case 'r': return '\r'
    case '0': return '\0'
    case '\\': return '\\'
    case "'": return "'"
    case '"': return '"'
    default: return ch
  }
}

/* --------------------------------------------------------------- AST -- */

export type Expr =
  | { kind: 'num'; value: number; line: number }
  | { kind: 'str'; value: string; line: number }
  | { kind: 'char'; value: string; line: number }
  | { kind: 'bool'; value: boolean; line: number }
  | { kind: 'ident'; name: string; line: number }
  | { kind: 'unary'; op: string; arg: Expr; line: number }
  | { kind: 'update'; op: '++' | '--'; arg: Expr; prefix: boolean; line: number }
  | { kind: 'binary'; op: string; left: Expr; right: Expr; line: number }
  | { kind: 'logical'; op: '&&' | '||'; left: Expr; right: Expr; line: number }
  | { kind: 'assign'; op: string; target: Expr; value: Expr; line: number }
  | { kind: 'ternary'; test: Expr; then: Expr; else: Expr; line: number }
  | { kind: 'call'; callee: Expr; args: Expr[]; line: number }
  | { kind: 'member'; object: Expr; property: string; line: number }
  | { kind: 'index'; object: Expr; index: Expr; line: number }

export type Stmt =
  | { kind: 'expr'; expr: Expr; line: number }
  | {
      kind: 'declare'
      type: string
      isConst: boolean
      declarations: { name: string; init?: Expr; arraySize?: Expr }[]
      line: number
    }
  | { kind: 'block'; body: Stmt[]; line: number }
  | { kind: 'if'; test: Expr; then: Stmt; else?: Stmt; line: number }
  | { kind: 'while'; test: Expr; body: Stmt; line: number }
  | { kind: 'do'; body: Stmt; test: Expr; line: number }
  | { kind: 'for'; init?: Stmt; test?: Expr; update?: Expr; body: Stmt; line: number }
  | { kind: 'return'; value?: Expr; line: number }
  | { kind: 'break'; line: number }
  | { kind: 'continue'; line: number }
  | { kind: 'empty'; line: number }

export interface FunctionDecl {
  name: string
  returnType: string
  params: { type: string; name: string }[]
  body: Stmt
  line: number
}

export interface Program {
  functions: FunctionDecl[]
  globals: Stmt[]
}

const TYPE_WORDS = new Set([
  'void', 'int', 'float', 'double', 'char', 'boolean', 'bool', 'byte', 'long',
  'short', 'unsigned', 'String',
])

class Parser {
  private pos = 0
  constructor(private tokens: Token[]) {}

  private peek(offset = 0): Token {
    return this.tokens[Math.min(this.pos + offset, this.tokens.length - 1)]
  }
  private get line(): number {
    return this.peek().line
  }
  private at(value: string): boolean {
    const t = this.peek()
    return (t.type === 'punct' || t.type === 'keyword') && t.value === value
  }
  private eat(value: string): boolean {
    if (this.at(value)) {
      this.pos++
      return true
    }
    return false
  }
  private expect(value: string, hint?: string): Token {
    if (this.at(value)) return this.tokens[this.pos++]
    const got = this.peek()
    throw new ArduinoError(
      `I expected "${value}" here but found ${got.type === 'eof' ? 'the end of the sketch' : `"${got.value}"`}.`,
      got.line,
      hint ??
        (value === ';'
          ? 'Every instruction in Arduino ends with a semicolon.'
          : value === '}'
            ? 'Every { needs a matching }.'
            : undefined),
    )
  }

  parseProgram(): Program {
    const functions: FunctionDecl[] = []
    const globals: Stmt[] = []
    while (this.peek().type !== 'eof') {
      if (this.looksLikeFunction()) {
        functions.push(this.parseFunction())
      } else {
        globals.push(this.parseStatement())
      }
    }
    return { functions, globals }
  }

  /** A function is `type name (` at the top level. Everything else is a
   *  global declaration or statement. */
  private looksLikeFunction(): boolean {
    let k = 0
    if (this.peek(k).value === 'const' || this.peek(k).value === 'static') k++
    if (this.peek(k).value === 'unsigned') k++
    if (!(this.peek(k).type === 'keyword' && TYPE_WORDS.has(this.peek(k).value))) return false
    k++
    if (this.peek(k).value === '*') k++
    if (this.peek(k).type !== 'ident') return false
    k++
    return this.peek(k).value === '('
  }

  private parseTypeName(): string {
    const parts: string[] = []
    if (this.at('const') || this.at('static')) parts.push(this.tokens[this.pos++].value)
    if (this.at('unsigned')) parts.push(this.tokens[this.pos++].value)
    const t = this.peek()
    if (!(t.type === 'keyword' && TYPE_WORDS.has(t.value))) {
      throw new ArduinoError(
        `"${t.value}" is not a type I know.`,
        t.line,
        'The syllabus uses int, float, char, String, byte and boolean.',
      )
    }
    parts.push(this.tokens[this.pos++].value)
    if (this.at('long')) parts.push(this.tokens[this.pos++].value)
    this.eat('*')
    return parts.join(' ')
  }

  private parseFunction(): FunctionDecl {
    const line = this.line
    const returnType = this.parseTypeName()
    const nameTok = this.tokens[this.pos++]
    this.expect('(')
    const params: { type: string; name: string }[] = []
    if (!this.at(')')) {
      do {
        if (this.at('void') && this.peek(1).value === ')') {
          this.pos++
          break
        }
        const type = this.parseTypeName()
        const pname = this.tokens[this.pos++]
        if (pname.type !== 'ident') {
          throw new ArduinoError('I expected a parameter name here.', pname.line)
        }
        params.push({ type, name: pname.value })
      } while (this.eat(','))
    }
    this.expect(')')
    const body = this.parseBlock()
    return { name: nameTok.value, returnType, params, body, line }
  }

  private parseBlock(): Stmt {
    const line = this.line
    this.expect('{')
    const body: Stmt[] = []
    while (!this.at('}')) {
      if (this.peek().type === 'eof') {
        throw new ArduinoError(
          'The sketch ended while a { was still open.',
          line,
          'Count your braces: every { needs a } to close it.',
        )
      }
      body.push(this.parseStatement())
    }
    this.expect('}')
    return { kind: 'block', body, line }
  }

  private isDeclarationStart(): boolean {
    const t = this.peek()
    if (t.type !== 'keyword') return false
    return t.value === 'const' || t.value === 'static' || TYPE_WORDS.has(t.value)
  }

  private parseStatement(): Stmt {
    const line = this.line

    if (this.at('{')) return this.parseBlock()
    if (this.eat(';')) return { kind: 'empty', line }

    if (this.isDeclarationStart()) return this.parseDeclaration()

    if (this.eat('if')) {
      this.expect('(')
      const test = this.parseExpression()
      this.expect(')')
      const then = this.parseStatement()
      let alt: Stmt | undefined
      if (this.eat('else')) alt = this.parseStatement()
      return { kind: 'if', test, then, else: alt, line }
    }

    if (this.eat('while')) {
      this.expect('(')
      const test = this.parseExpression()
      this.expect(')')
      return { kind: 'while', test, body: this.parseStatement(), line }
    }

    if (this.eat('do')) {
      const body = this.parseStatement()
      this.expect('while', 'A do block must be followed by while (condition);')
      this.expect('(')
      const test = this.parseExpression()
      this.expect(')')
      this.expect(';')
      return { kind: 'do', body, test, line }
    }

    if (this.eat('for')) {
      this.expect('(')
      let init: Stmt | undefined
      if (!this.at(';')) {
        init = this.isDeclarationStart()
          ? this.parseDeclaration()
          : { kind: 'expr', expr: this.parseExpression(), line: this.line }
        if (init.kind === 'expr') this.expect(';')
      } else {
        this.expect(';')
      }
      const test = this.at(';') ? undefined : this.parseExpression()
      this.expect(';')
      const update = this.at(')') ? undefined : this.parseExpression()
      this.expect(')')
      return { kind: 'for', init, test, update, body: this.parseStatement(), line }
    }

    if (this.eat('return')) {
      const value = this.at(';') ? undefined : this.parseExpression()
      this.expect(';')
      return { kind: 'return', value, line }
    }
    if (this.eat('break')) {
      this.expect(';')
      return { kind: 'break', line }
    }
    if (this.eat('continue')) {
      this.expect(';')
      return { kind: 'continue', line }
    }

    const expr = this.parseExpression()
    this.expect(';')
    return { kind: 'expr', expr, line }
  }

  private parseDeclaration(): Stmt {
    const line = this.line
    const isConst = this.at('const')
    const type = this.parseTypeName()
    const declarations: { name: string; init?: Expr; arraySize?: Expr }[] = []
    do {
      const nameTok = this.tokens[this.pos++]
      if (nameTok.type !== 'ident') {
        throw new ArduinoError(
          `"${nameTok.value}" cannot be used as a variable name.`,
          nameTok.line,
          'Variable names start with a letter and contain only letters, digits and _.',
        )
      }
      let arraySize: Expr | undefined
      if (this.eat('[')) {
        if (!this.at(']')) arraySize = this.parseExpression()
        this.expect(']')
      }
      let init: Expr | undefined
      if (this.eat('=')) {
        if (this.at('{')) {
          // Array initialiser list.
          this.expect('{')
          const items: Expr[] = []
          if (!this.at('}')) {
            do {
              items.push(this.parseAssignment())
            } while (this.eat(','))
          }
          this.expect('}')
          init = { kind: 'call', callee: { kind: 'ident', name: '__array', line }, args: items, line }
        } else {
          init = this.parseAssignment()
        }
      }
      declarations.push({ name: nameTok.value, init, arraySize })
    } while (this.eat(','))
    this.expect(';')
    return { kind: 'declare', type, isConst, declarations, line }
  }

  /* ------------------------------------------------------ expressions -- */

  parseExpression(): Expr {
    let expr = this.parseAssignment()
    while (this.at(',')) {
      this.pos++
      expr = this.parseAssignment()
    }
    return expr
  }

  private parseAssignment(): Expr {
    const left = this.parseTernary()
    const t = this.peek()
    const ops = ['=', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<=', '>>=']
    if (t.type === 'punct' && ops.includes(t.value)) {
      this.pos++
      const value = this.parseAssignment()
      if (left.kind !== 'ident' && left.kind !== 'index') {
        throw new ArduinoError('You can only assign to a variable.', t.line)
      }
      return { kind: 'assign', op: t.value, target: left, value, line: t.line }
    }
    return left
  }

  private parseTernary(): Expr {
    const test = this.parseBinary(0)
    if (this.at('?')) {
      const line = this.line
      this.pos++
      const then = this.parseAssignment()
      this.expect(':')
      const alt = this.parseAssignment()
      return { kind: 'ternary', test, then, else: alt, line }
    }
    return test
  }

  // Precedence climbing, lowest first.
  private static readonly LEVELS: string[][] = [
    ['||'],
    ['&&'],
    ['|'],
    ['^'],
    ['&'],
    ['==', '!='],
    ['<', '>', '<=', '>='],
    ['<<', '>>'],
    ['+', '-'],
    ['*', '/', '%'],
  ]

  private parseBinary(level: number): Expr {
    if (level >= Parser.LEVELS.length) return this.parseUnary()
    let left = this.parseBinary(level + 1)
    for (;;) {
      const t = this.peek()
      if (t.type !== 'punct' || !Parser.LEVELS[level].includes(t.value)) break
      this.pos++
      const right = this.parseBinary(level + 1)
      left =
        t.value === '&&' || t.value === '||'
          ? { kind: 'logical', op: t.value, left, right, line: t.line }
          : { kind: 'binary', op: t.value, left, right, line: t.line }
    }
    return left
  }

  private parseUnary(): Expr {
    const t = this.peek()
    if (t.type === 'punct' && (t.value === '!' || t.value === '-' || t.value === '+' || t.value === '~')) {
      this.pos++
      return { kind: 'unary', op: t.value, arg: this.parseUnary(), line: t.line }
    }
    if (t.type === 'punct' && (t.value === '++' || t.value === '--')) {
      this.pos++
      return {
        kind: 'update',
        op: t.value as '++' | '--',
        arg: this.parseUnary(),
        prefix: true,
        line: t.line,
      }
    }
    return this.parsePostfix()
  }

  private parsePostfix(): Expr {
    let expr = this.parsePrimary()
    for (;;) {
      const t = this.peek()
      if (t.type === 'punct' && t.value === '(') {
        this.pos++
        const args: Expr[] = []
        if (!this.at(')')) {
          do {
            args.push(this.parseAssignment())
          } while (this.eat(','))
        }
        this.expect(')', 'Every ( in a function call needs a matching ).')
        expr = { kind: 'call', callee: expr, args, line: t.line }
      } else if (t.type === 'punct' && t.value === '.') {
        this.pos++
        const prop = this.tokens[this.pos++]
        expr = { kind: 'member', object: expr, property: prop.value, line: t.line }
      } else if (t.type === 'punct' && t.value === '[') {
        this.pos++
        const index = this.parseExpression()
        this.expect(']')
        expr = { kind: 'index', object: expr, index, line: t.line }
      } else if (t.type === 'punct' && (t.value === '++' || t.value === '--')) {
        this.pos++
        expr = {
          kind: 'update',
          op: t.value as '++' | '--',
          arg: expr,
          prefix: false,
          line: t.line,
        }
      } else {
        break
      }
    }
    return expr
  }

  private parsePrimary(): Expr {
    const t = this.peek()
    if (t.type === 'num') {
      this.pos++
      const raw = t.value.replace(/_/g, '')
      const value = /^0[bB]/.test(raw)
        ? parseInt(raw.slice(2), 2)
        : /^0[xX]/.test(raw)
          ? parseInt(raw, 16)
          : parseFloat(raw)
      if (Number.isNaN(value)) {
        throw new ArduinoError(`"${t.value}" is not a valid number.`, t.line)
      }
      return { kind: 'num', value, line: t.line }
    }
    if (t.type === 'str') {
      this.pos++
      return { kind: 'str', value: t.value, line: t.line }
    }
    if (t.type === 'char') {
      this.pos++
      return { kind: 'char', value: t.value, line: t.line }
    }
    if (t.value === 'true' || t.value === 'false') {
      this.pos++
      return { kind: 'bool', value: t.value === 'true', line: t.line }
    }
    if (t.type === 'ident') {
      this.pos++
      return { kind: 'ident', name: t.value, line: t.line }
    }
    // A cast such as (float) or (int) in front of an expression.
    if (t.value === '(') {
      const next = this.peek(1)
      if (next.type === 'keyword' && TYPE_WORDS.has(next.value) && this.peek(2).value === ')') {
        this.pos += 3
        const arg = this.parseUnary()
        return {
          kind: 'call',
          callee: { kind: 'ident', name: `__cast_${next.value}`, line: t.line },
          args: [arg],
          line: t.line,
        }
      }
      this.pos++
      const expr = this.parseExpression()
      this.expect(')')
      return expr
    }
    throw new ArduinoError(
      t.type === 'eof'
        ? 'The sketch ended in the middle of an instruction.'
        : `I did not expect "${t.value}" here.`,
      t.line,
      t.value === '{'
        ? 'A { usually follows setup(), loop(), if, for or while.'
        : 'Check the line above for a missing semicolon or bracket.',
    )
  }
}

export function parse(src: string): Program {
  return new Parser(tokenize(src)).parseProgram()
}
