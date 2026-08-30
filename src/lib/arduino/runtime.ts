/* ============================================================================
   The driver. Turns the interpreter's generator into something that runs
   against wall-clock time inside a browser frame, and which can be paused,
   stepped one line at a time, or slowed down so a beginner can watch.
   ========================================================================== */

import { Board } from './board'
import { Interpreter, type Yielded } from './interpreter'
import { ArduinoError } from './parser'
import { applyEnvironment, readComponents, type Component, type ComponentState } from './circuit'

export type RunStatus = 'idle' | 'compiling' | 'running' | 'paused' | 'error' | 'stopped'

export interface RuntimeSnapshot {
  status: RunStatus
  /** Line the interpreter is currently on, 1-indexed. */
  line: number
  board: Board
  states: Record<string, ComponentState>
  error?: { message: string; line: number; hint?: string }
  /** Virtual milliseconds elapsed inside the sketch. */
  clock: number
  /** How many times loop() has completed. */
  loops: number
  serial: string[]
}

export interface RuntimeOptions {
  /** 1 = real time. 0.25 = quarter speed, for watching a blink slowly. */
  speed?: number
  onUpdate(snap: RuntimeSnapshot): void
}

export class Runtime {
  private board = new Board()
  private interp: Interpreter | null = null
  private gen: Generator<Yielded, void, void> | null = null
  private phase: 'setup' | 'loop' = 'setup'
  private raf = 0
  private lastTick = 0
  /** Virtual ms still to be served on the delay() the sketch is sitting in. */
  private waitRemaining = 0
  private status: RunStatus = 'idle'
  private line = 0
  private loops = 0
  private error: RuntimeSnapshot['error']
  private speed: number
  private components: Component[] = []
  private env: Record<string, number> = {}
  /** Set while single-stepping so the loop runs exactly one line. */
  private stepRequest = false

  constructor(private opts: RuntimeOptions) {
    this.speed = opts.speed ?? 1
  }

  setSpeed(speed: number) {
    this.speed = speed
  }

  setComponents(components: Component[]) {
    this.components = components
    this.emit()
  }

  setEnv(env: Record<string, number>) {
    this.env = env
    applyEnvironment(this.board, this.components, this.env)
    this.emit()
  }

  /** Compile and start. Returns false if the sketch would not compile, which
   *  is the moment the student most needs a clear message. */
  start(source: string): boolean {
    this.stop()
    this.status = 'compiling'
    this.error = undefined
    this.board.reset()
    this.loops = 0
    this.line = 0
    try {
      this.interp = new Interpreter(source, this.board, {
        onPinChange: () => {
          /* state is read on the next frame */
        },
      })
    } catch (e) {
      this.fail(e)
      return false
    }
    this.gen = this.interp.runSetup()
    this.phase = 'setup'
    this.status = 'running'
    this.waitRemaining = 0
    this.lastTick = performance.now()
    this.raf = requestAnimationFrame(this.tick)
    this.emit()
    return true
  }

  pause() {
    if (this.status !== 'running') return
    this.status = 'paused'
    cancelAnimationFrame(this.raf)
    this.emit()
  }

  resume() {
    if (this.status !== 'paused') return
    this.status = 'running'
    this.lastTick = performance.now()
    this.raf = requestAnimationFrame(this.tick)
    this.emit()
  }

  /** Advance exactly one statement, for the step-through walkthrough. */
  step() {
    if (!this.gen) return
    if (this.status === 'running') this.pause()
    this.stepRequest = true
    this.advance(0)
    this.stepRequest = false
    this.emit()
  }

  stop() {
    cancelAnimationFrame(this.raf)
    this.gen = null
    this.interp = null
    if (this.status !== 'error') this.status = 'stopped'
    this.emit()
  }

  reset() {
    this.stop()
    this.board.reset()
    this.status = 'idle'
    this.line = 0
    this.loops = 0
    this.error = undefined
    this.emit()
  }

  private tick = (now: number) => {
    if (this.status !== 'running') return
    const realDelta = Math.min(64, now - this.lastTick)
    this.lastTick = now
    this.advance(realDelta * this.speed)
    if (this.status === 'running') this.raf = requestAnimationFrame(this.tick)
    this.emit()
  }

  /** Run the generator forward by `virtualMs` of sketch time.
   *
   *  Time and work are budgeted separately, which matters: a sketch that is
   *  sitting in delay(1000) must consume wall time without executing, and a
   *  sketch with no delay at all must execute without consuming wall time.
   *  The statement budget is what stops a `while(true){}` blocking the frame. */
  private advance(virtualMs: number) {
    if (!this.gen || !this.interp) return
    // Stepping ignores delays: waiting a virtual second while single-stepping
    // helps nobody, so the whole outstanding delay is served at once.
    let remaining = this.stepRequest ? Number.POSITIVE_INFINITY : virtualMs
    let budget = this.stepRequest ? 1 : 20_000

    try {
      while (budget > 0) {
        // Serve any outstanding delay before executing anything else.
        if (this.waitRemaining > 0) {
          const spend = Math.min(this.waitRemaining, remaining)
          this.board.clock += spend
          this.waitRemaining -= spend
          remaining -= spend
          // Still waiting: this frame's time is spent.
          if (this.waitRemaining > 0) return
        }

        applyEnvironment(this.board, this.components, this.env)
        const next = this.gen.next()
        budget--

        if (next.done) {
          if (this.phase === 'setup') {
            this.phase = 'loop'
            if (!this.interp.hasLoop()) {
              this.status = 'stopped'
              return
            }
          } else {
            this.loops++
          }
          this.gen = this.interp.runLoopOnce()
          continue
        }

        const y = next.value
        this.line = y.line
        if (y.type === 'delay') this.waitRemaining = y.ms
        if (this.stepRequest) return
      }
    } catch (e) {
      this.fail(e)
    }
  }

  private fail(e: unknown) {
    cancelAnimationFrame(this.raf)
    this.status = 'error'
    if (e instanceof ArduinoError) {
      this.error = { message: e.message, line: e.line, hint: e.hint }
      this.line = e.line
    } else {
      this.error = {
        message: e instanceof Error ? e.message : 'Something went wrong while running the sketch.',
        line: this.line,
      }
    }
    this.emit()
  }

  private emit() {
    this.opts.onUpdate({
      status: this.status,
      line: this.line,
      board: this.board,
      states: readComponents(this.board, this.components, this.env),
      error: this.error,
      clock: this.board.clock,
      loops: this.loops,
      serial: this.board.serial.map((s) => s.text),
    })
  }

  dispose() {
    cancelAnimationFrame(this.raf)
  }
}
