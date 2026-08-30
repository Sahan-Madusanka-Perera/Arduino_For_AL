import { useState } from 'react'
import { FigureFrame, VizSlider, VizStepper, VizToggle } from './Frame'
import { Icon, Silk, cx } from '@/components/ui'

/* Figures for module 6: the upload pipeline, setup/loop, variables, if, loops. */

/* ------------------------------------------------- upload pipeline ----- */

const PIPELINE_OK = [
  { label: 'You write code', body: 'High-level code in the Arduino IDE, based on C/C++ but simplified.', ok: true },
  {
    label: 'The IDE compiles it',
    body: 'The IDE acts as a compiler: it translates the high-level code into machine code. This happens before the program runs.',
    ok: true,
  },
  {
    label: 'A .hex file is produced',
    body: 'A binary file with a .hex extension containing the machine code, the binary instructions specific to the Arduino microcontroller.',
    ok: true,
  },
  {
    label: 'It travels over USB',
    body: 'Clicking Upload transfers the compiled binary file to the Arduino board via the USB cable.',
    ok: true,
  },
  { label: 'The board runs it', body: 'The Arduino board then executes the machine code directly.', ok: true },
]

const PIPELINE_ERR = [
  { label: 'You write code', body: 'This time there is a missing semicolon on line 6.', ok: true },
  {
    label: 'The IDE compiles it',
    body: 'The compiler reaches the faulty line and cannot make sense of it.',
    ok: false,
  },
  {
    label: 'Errors are displayed',
    body: 'The errors appear in the message window at the bottom of the IDE. No .hex file is produced.',
    ok: false,
  },
  { label: 'Nothing is uploaded', body: 'The USB cable carries nothing. The board is untouched.', ok: false },
  {
    label: 'The board keeps running the old sketch',
    body: 'Whatever was uploaded last is still in Flash memory and continues running.',
    ok: false,
  },
]

export function UploadPipelineFigure({ description }: { description: string }) {
  const [ok, setOk] = useState(true)
  const stages = ok ? PIPELINE_OK : PIPELINE_ERR

  return (
    <FigureFrame
      legend="What happens when you press Upload"
      description={description}
      controls={
        <VizToggle
          label="Your sketch"
          on={ok}
          onChange={setOk}
          onLabel="Compiles cleanly"
          offLabel="Has an error"
          hint="Compilation happens on your computer, before anything is sent. A typo can never reach or damage the board."
        />
      }
    >
      <ol className="space-y-2">
        {stages.map((s, i) => (
          <li
            key={s.label}
            className="flex gap-3 items-start rounded-md border p-3 transition-colors"
            style={{
              borderColor: s.ok ? 'var(--plastic-edge)' : 'var(--no-edge)',
              background: s.ok ? 'var(--plastic-raised)' : 'var(--no-field)',
            }}
          >
            <span
              aria-hidden
              className="num shrink-0 w-6 h-6 grid place-items-center rounded-sm text-silk font-bold"
              style={{
                background: s.ok ? 'var(--plastic-sunk)' : 'var(--no)',
                color: s.ok ? 'var(--ink-2)' : '#fff',
              }}
            >
              {i + 1}
            </span>
            {!s.ok && (
              <span aria-hidden className="shrink-0 mt-0.5 -ml-1 text-no">
                <Icon name="cross" size={13} strokeWidth={3} />
              </span>
            )}
            <div>
              <p className="text-body font-semibold leading-tight mb-0.5">{s.label}</p>
              <p className="text-small text-ink-3 leading-snug">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </FigureFrame>
  )
}

/* ---------------------------------------------------- setup and loop --- */

export function SetupLoopFigure({ description }: { description: string }) {
  const [tick, setTick] = useState(0)
  const phase = tick === 0 ? 'power' : tick === 1 ? 'setup' : 'loop'
  const passes = tick >= 2 ? tick - 1 : 0

  return (
    <FigureFrame
      legend="Power on, then run"
      description={description}
      controls={
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setTick((t) => t + 1)}
            className="h-11 px-4 rounded-md bg-ink text-plastic font-semibold text-small"
          >
            {tick === 0 ? 'Power on' : 'Next'}
          </button>
          <button
            onClick={() => setTick(0)}
            className="h-11 px-4 rounded-md border border-plastic-edge bg-plastic-raised font-semibold text-small"
          >
            Reset the board
          </button>
          <p className="text-fine text-ink-3 ml-auto" aria-live="polite">
            {phase === 'power' && 'The board is off. Nothing has run yet.'}
            {phase === 'setup' && 'setup() is running. It will run exactly once.'}
            {phase === 'loop' && `loop() has completed ${passes} ${passes === 1 ? 'pass' : 'passes'}. It never stops.`}
          </p>
        </div>
      }
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr]">
        <Box
          title="void setup()"
          sub="Runs once, when the board is powered on or reset"
          code={'pinMode(13, OUTPUT);'}
          active={phase === 'setup'}
          done={tick >= 2}
          runs={tick >= 1 ? 1 : 0}
        />
        <Box
          title="void loop()"
          sub="Runs repeatedly, forever, until power off or reset"
          code={'digitalWrite(13, HIGH);\ndelay(1000);\ndigitalWrite(13, LOW);\ndelay(1000);'}
          active={phase === 'loop'}
          done={false}
          runs={passes}
          looping
        />
      </div>
    </FigureFrame>
  )
}

function Box({
  title,
  sub,
  code,
  active,
  done,
  runs,
  looping,
}: {
  title: string
  sub: string
  code: string
  active: boolean
  done: boolean
  runs: number
  looping?: boolean
}) {
  return (
    <div
      className="rounded-md border p-3.5 transition-all"
      style={{
        borderColor: active ? 'var(--signal-analog)' : 'var(--plastic-edge)',
        background: active ? 'var(--plastic-raised)' : 'var(--plastic)',
        boxShadow: active ? 'var(--lift-2)' : undefined,
        opacity: done ? 0.6 : 1,
      }}
    >
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <code className="num text-body font-bold">{title}</code>
        <span
          className="num text-meta font-semibold"
          style={{ color: active ? 'var(--signal-analog)' : 'var(--ink-faint)' }}
        >
          ran {runs}×{looping && runs > 0 ? ' so far' : ''}
        </span>
      </div>
      <Silk className="block mb-2.5">{sub}</Silk>
      <pre className="num text-meta leading-relaxed text-ink-2 whitespace-pre-wrap bg-plastic-sunk rounded-sm p-2.5 border border-plastic-edge">
        {code}
      </pre>
      {looping && (
        <div className="flex items-center gap-1.5 mt-2 text-meta text-ink-3">
          <Icon name="refresh" size={13} /> back to the top
        </div>
      )}
    </div>
  )
}

/* --------------------------------------------------------- variable ---- */

const VAR_PARTS = [
  { id: 'type', text: 'int', label: 'Type', body: 'What kind of value this box can hold. Here, a whole number.' },
  { id: 'name', text: 'count', label: 'Name', body: 'What you will call it everywhere else in the sketch. Case sensitive.' },
  { id: 'eq', text: '=', label: 'Assignment', body: 'A single equals sign puts the value on the right into the box on the left. Two of them (==) would compare instead.' },
  { id: 'val', text: '0', label: 'Initial value', body: 'What goes in the box to start with.' },
  { id: 'semi', text: ';', label: 'Semicolon', body: 'Arduino does not use indentation. A semicolon marks the end of each instruction.' },
]

export function VariableFigure({ description }: { description: string }) {
  const [active, setActive] = useState('type')
  const part = VAR_PARTS.find((p) => p.id === active)!

  return (
    <FigureFrame legend="Anatomy of a declaration" description={description}>
      <div className="flex flex-wrap items-center gap-1.5 justify-center mb-5">
        {VAR_PARTS.map((p) => {
          const on = p.id === active
          return (
            <button
              key={p.id}
              onClick={() => setActive(p.id)}
              aria-pressed={on}
              className={cx(
                'num px-3 py-2 rounded-sm border-2 text-plain font-bold transition-all',
                on
                  ? 'border-signal-analog bg-plastic-raised text-ink'
                  : 'border-transparent bg-plastic text-ink-3 hover:border-plastic-edge',
              )}
            >
              {p.text}
            </button>
          )
        })}
      </div>
      <div
        className="rounded-md border border-plastic-edge bg-plastic-raised p-4 text-center"
        aria-live="polite"
      >
        <Silk className="block mb-1.5">{part.label}</Silk>
        <p className="text-body text-ink-2 leading-relaxed max-w-md mx-auto">{part.body}</p>
      </div>
    </FigureFrame>
  )
}

/* --------------------------------------------------------- if flow ----- */

export function IfFlowFigure({ description }: { description: string }) {
  const [count, setCount] = useState(7)
  const branch = count > 10 ? 'a' : count === 10 ? 'b' : 'c'

  const branches = [
    { id: 'a', test: 'count > 10', body: 'Code to execute if count is greater than 10' },
    { id: 'b', test: 'count == 10', body: 'Code to execute if count is exactly 10' },
    { id: 'c', test: 'else', body: 'Code to execute if count is less than 10' },
  ]

  return (
    <FigureFrame
      legend="if / else if / else"
      description={description}
      controls={
        <VizSlider
          label="count"
          value={count}
          min={0}
          max={20}
          onChange={setCount}
          hint="Conditions are tested in order, from the top. The moment one is true, its block runs and the rest are skipped entirely."
        />
      }
    >
      <ol className="space-y-2">
        {branches.map((b, i) => {
          const on = b.id === branch
          const skipped = branches.findIndex((x) => x.id === branch) < i
          return (
            <li
              key={b.id}
              className="rounded-md border p-3 transition-all"
              style={{
                borderColor: on ? 'var(--ok)' : 'var(--plastic-edge)',
                background: on ? 'var(--ok-field)' : 'var(--plastic-raised)',
                opacity: skipped ? 0.42 : 1,
              }}
            >
              <div className="flex items-center justify-between gap-3 mb-1">
                <code className="num text-small font-semibold">
                  {b.id === 'c' ? 'else' : `${i === 0 ? 'if' : 'else if'} (${b.test})`}
                </code>
                <span
                  className="silk shrink-0"
                  style={{ color: on ? 'var(--ok)' : 'var(--ink-faint)' }}
                >
                  {on && (
                    <span
                      aria-hidden
                      className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
                      style={{ background: 'var(--ok)' }}
                    />
                  )}
                  {on ? 'runs' : skipped ? 'skipped' : 'not reached'}
                </span>
              </div>
              <p className="text-fine text-ink-3">{b.body}</p>
            </li>
          )
        })}
      </ol>
      <p className="mt-3 text-small text-ink-2" aria-live="polite">
        With <code className="num font-semibold">count = {count}</code>, the{' '}
        <strong>{branch === 'a' ? 'first' : branch === 'b' ? 'second' : 'else'}</strong> branch runs.
      </p>
    </FigureFrame>
  )
}

/* -------------------------------------------------------- for loop ----- */

export function ForLoopFigure({ description }: { description: string }) {
  const [step, setStep] = useState(0)
  // Trace of a for (int i = 0; i < 10; i++) loop, first four passes shown.
  const trace: { part: string; note: string; i: number; runs: number }[] = [
    { part: 'int i = 0', note: 'Initialisation. Runs once, before anything else.', i: 0, runs: 0 },
    { part: 'i < 10', note: '0 is less than 10, so the condition is true. The body runs.', i: 0, runs: 0 },
    { part: 'body', note: 'The block inside the braces runs for the first time.', i: 0, runs: 1 },
    { part: 'i++', note: 'The update runs at the end of the pass. i becomes 1.', i: 1, runs: 1 },
    { part: 'i < 10', note: '1 is less than 10, so it goes round again.', i: 1, runs: 1 },
    { part: 'body', note: 'Second pass.', i: 1, runs: 2 },
    { part: 'i++', note: 'i becomes 2.', i: 2, runs: 2 },
    { part: '…', note: 'This continues, i climbing by one each pass.', i: 9, runs: 9 },
    { part: 'body', note: 'Tenth pass, with i = 9.', i: 9, runs: 10 },
    { part: 'i++', note: 'i becomes 10.', i: 10, runs: 10 },
    { part: 'i < 10', note: '10 is not less than 10. The condition is false, so the loop stops.', i: 10, runs: 10 },
  ]
  const s = trace[step]

  return (
    <FigureFrame
      legend="for (int i = 0; i < 10; i++)"
      description={description}
      controls={<VizStepper step={step} total={trace.length} onStep={setStep} labels={trace.map((t) => t.note)} />}
    >
      <div className="flex flex-wrap items-center gap-1.5 justify-center mb-5 num text-plain font-bold">
        <span className="text-ink-3">for (</span>
        <Part on={s.part === 'int i = 0'}>int i = 0</Part>
        <span className="text-ink-3">;</span>
        <Part on={s.part === 'i < 10'}>i &lt; 10</Part>
        <span className="text-ink-3">;</span>
        <Part on={s.part === 'i++'}>i++</Part>
        <span className="text-ink-3">) &#123;</span>
        <Part on={s.part === 'body'}>body</Part>
        <span className="text-ink-3">&#125;</span>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
        <div className="rounded-md border border-plastic-edge bg-plastic-raised p-3 text-center">
          <Silk className="block mb-1">i is now</Silk>
          <span className="num text-h4 font-bold" aria-live="polite">
            {s.i}
          </span>
        </div>
        <div className="rounded-md border border-plastic-edge bg-plastic-raised p-3 text-center">
          <Silk className="block mb-1">Body has run</Silk>
          <span className="num text-h4 font-bold" aria-live="polite">
            {s.runs}×
          </span>
        </div>
      </div>
    </FigureFrame>
  )
}

function Part({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <span
      className="px-2 py-1 rounded-sm border-2 transition-all"
      style={{
        borderColor: on ? 'var(--signal-analog)' : 'transparent',
        background: on ? 'color-mix(in srgb, var(--signal-analog) 12%, transparent)' : 'transparent',
        color: on ? 'var(--ink)' : 'var(--ink-3)',
      }}
    >
      {children}
    </span>
  )
}

/* --------------------------------------------- while vs do-while ------- */

export function WhileVsDoFigure({ description }: { description: string }) {
  const [start, setStart] = useState(0)
  const conditionTrue = start < 10

  return (
    <FigureFrame
      legend="while vs do-while"
      description={description}
      controls={
        <VizSlider
          label="Starting value of count"
          value={start}
          min={0}
          max={20}
          onChange={setStart}
          hint={
            conditionTrue
              ? 'The condition (count < 10) is true at the start, so both loops behave the same way.'
              : 'The condition (count < 10) is FALSE at the start. This is where the two loops differ.'
          }
        />
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <LoopCard
          title="while (count < 10)"
          order={['Test the condition', 'If true, run the body', 'Go back and test again']}
          result={conditionTrue ? 'The body runs.' : 'The body never runs at all.'}
          runs={conditionTrue ? 'at least once' : '0 times'}
          good={conditionTrue}
        />
        <LoopCard
          title="do { … } while (count < 10)"
          order={['Run the body', 'Then test the condition', 'If true, go back to the body']}
          result={conditionTrue ? 'The body runs.' : 'The body still runs once, then stops.'}
          runs={conditionTrue ? 'at least once' : 'exactly 1 time'}
          good
        />
      </div>
      <p className="mt-3 text-small text-ink-2 leading-relaxed" aria-live="polite">
        {conditionTrue
          ? 'While the condition is true at the start, the two loops look identical. Push the slider to 10 or more to see the difference.'
          : 'This is the whole difference. A while loop can run zero times; a do-while loop always runs at least once, because it does not test the condition until the body has already run.'}
      </p>
    </FigureFrame>
  )
}

function LoopCard({
  title,
  order,
  result,
  runs,
  good,
}: {
  title: string
  order: string[]
  result: string
  runs: string
  good: boolean
}) {
  return (
    <div
      className="rounded-md border p-3.5"
      style={{
        borderColor: good ? 'var(--ok-edge)' : 'var(--warn-edge)',
        background: good ? 'var(--plastic-raised)' : 'var(--warn-field)',
      }}
    >
      <code className="num block text-small font-bold mb-2.5">{title}</code>
      <ol className="space-y-1 mb-3">
        {order.map((o, i) => (
          <li key={o} className="flex gap-2 text-fine text-ink-2">
            <span className="num text-ink-faint shrink-0">{i + 1}.</span>
            {o}
          </li>
        ))}
      </ol>
      <div className="pt-2.5 border-t border-plastic-edge">
        <Silk className="block mb-1">Body runs</Silk>
        <p className="num text-body font-bold mb-1" style={{ color: good ? 'var(--ok)' : 'var(--warn)' }}>
          {runs}
        </p>
        <p className="text-fine text-ink-3 leading-snug">{result}</p>
      </div>
    </div>
  )
}
