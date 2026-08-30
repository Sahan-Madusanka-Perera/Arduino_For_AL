import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Runtime, type RuntimeSnapshot } from '@/lib/arduino/runtime'
import { checkCircuit, type CircuitPreset, type ComponentState } from '@/lib/arduino/circuit'
import { getPreset } from '@/lib/arduino/presets'
import { A0, pinLabel } from '@/lib/arduino/board'
import { Button, Chip, Icon, Silk, LiveRegion, cx } from '@/components/ui'
import { VizSlider, VizToggle } from '@/components/viz'

/* ============================================================================
   The live bench: a real interpreter, a behavioural circuit model and an
   editor, side by side. This is the component the whole product is built
   around, because it is what turns a printed program into something a student
   can break, fix and understand.
   ========================================================================== */

const EMPTY_SNAP: RuntimeSnapshot = {
  status: 'idle',
  line: 0,
  board: undefined as never,
  states: {},
  clock: 0,
  loops: 0,
  serial: [],
}

export function Bench({
  presetId,
  title,
  brief,
  onEngage,
  compact,
}: {
  presetId: string
  title?: string
  brief?: string
  onEngage?: () => void
  compact?: boolean
}) {
  const preset = getPreset(presetId)
  if (!preset) {
    return (
      <div className="my-6 rounded-lg border border-no-edge bg-no-field p-4" role="alert">
        <p className="text-body text-ink-2">
          This bench could not be loaded. The rest of the lesson still works, so carry on and
          come back to it.
        </p>
      </div>
    )
  }
  return (
    <BenchInner
      key={presetId}
      preset={preset}
      title={title}
      brief={brief}
      onEngage={onEngage}
      compact={compact}
    />
  )
}

function BenchInner({
  preset,
  title,
  brief,
  onEngage,
  compact,
}: {
  preset: CircuitPreset
  title?: string
  brief?: string
  onEngage?: () => void
  compact?: boolean
}) {
  const [code, setCode] = useState(preset.sketch)
  const [snap, setSnap] = useState<RuntimeSnapshot>(EMPTY_SNAP)
  const [speed, setSpeed] = useState(1)
  const [env, setEnv] = useState<Record<string, number>>(() =>
    Object.fromEntries(preset.env.map((e) => [e.id, e.value])),
  )
  const [announce, setAnnounce] = useState('')
  const engaged = useRef(false)
  const runtimeRef = useRef<Runtime | null>(null)
  const editorRef = useRef<HTMLTextAreaElement>(null)

  const warnings = useMemo(() => checkCircuit(preset.components), [preset.components])

  useEffect(() => {
    const rt = new Runtime({ speed: 1, onUpdate: setSnap })
    runtimeRef.current = rt
    rt.setComponents(preset.components)
    rt.setEnv(env)
    return () => {
      rt.dispose()
      runtimeRef.current = null
    }
    // preset.components is stable for the life of this component (keyed above).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset])

  useEffect(() => {
    runtimeRef.current?.setEnv(env)
  }, [env])

  useEffect(() => {
    runtimeRef.current?.setSpeed(speed)
  }, [speed])

  const markEngaged = useCallback(() => {
    if (engaged.current) return
    engaged.current = true
    onEngage?.()
  }, [onEngage])

  const run = useCallback(() => {
    markEngaged()
    const ok = runtimeRef.current?.start(code)
    setAnnounce(ok ? 'Sketch compiled and running.' : 'The sketch did not compile. See the error below the code.')
  }, [code, markEngaged])

  const running = snap.status === 'running'
  const paused = snap.status === 'paused'
  const errored = snap.status === 'error'

  const lines = code.split('\n')

  return (
    <div
      className={cx(
        'my-6 rounded-lg border border-plastic-edge bg-plastic-sunk overflow-hidden',
        errored && 'border-no-edge',
      )}
      style={{ boxShadow: 'var(--sink)' }}
    >
      {/* header. The title and the provenance chip share one row at every
          width; the brief takes the full width beneath, because it is the
          instruction telling the student what to do and must never be
          squeezed into a ragged column or truncated. */}
      <div className="px-4 py-3 border-b border-plastic-edge bg-plastic">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="w-2 h-2 rounded-full shrink-0"
            style={{
              background: errored
                ? 'var(--no)'
                : running
                  ? 'var(--signal-high)'
                  : 'var(--ink-faint)',
            }}
          />
          <p className="text-body font-semibold leading-tight flex-1 min-w-0">
            {title ?? preset.title}
          </p>
          <Chip tone={preset.source === 'syllabus' ? 'info' : 'neutral'} className="shrink-0">
            {preset.source === 'syllabus' ? 'From the syllabus' : 'Course bench'}
          </Chip>
        </div>
        {(brief ?? preset.brief) && !compact && (
          <p className="text-fine text-ink-3 leading-snug mt-1 pl-5">
            {brief ?? preset.brief}
          </p>
        )}
      </div>

      {/* Below lg the columns stack, and the board is placed FIRST: a student
          on a phone otherwise presses Run at the top of a tall editor and the
          circuit that answers is off-screen, which makes the whole point of
          the bench unobservable on the device most of them use. */}
      <div className={cx('grid gap-0', compact ? '' : 'lg:grid-cols-2')}>
        {/* ------------------------------------------------ code column */}
        <div className="order-2 lg:order-1 border-t lg:border-t-0 lg:border-r border-plastic-edge">
          <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 border-b border-plastic-edge bg-plastic">
            <Button size="sm" variant="primary" onClick={run} aria-label="Compile and run the sketch">
              <Icon name="play" size={13} />
              Run
            </Button>
            <Button
              size="sm"
              onClick={() => (paused ? runtimeRef.current?.resume() : runtimeRef.current?.pause())}
              disabled={!running && !paused}
            >
              <Icon name={paused ? 'play' : 'pause'} size={13} />
              {paused ? 'Resume' : 'Pause'}
            </Button>
            <Button
              size="sm"
              onClick={() => {
                markEngaged()
                runtimeRef.current?.step()
              }}
              disabled={snap.status === 'idle'}
              aria-label="Run one line and stop"
            >
              <Icon name="step" size={13} />
              Step
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                runtimeRef.current?.reset()
                setCode(preset.sketch)
                setAnnounce('Sketch reset to the original.')
              }}
              aria-label="Reset the sketch and the board"
            >
              <Icon name="reset" size={13} />
            </Button>

            <label className="ml-auto flex items-center gap-1.5 text-meta text-ink-3 shrink-0">
              Speed
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="h-8 w-[68px] px-1.5 rounded-sm border border-plastic-edge bg-plastic-raised text-meta"
                aria-label="Playback speed"
              >
                <option value={0.25}>0.25×</option>
                <option value={0.5}>0.5×</option>
                <option value={1}>1×</option>
                <option value={4}>4×</option>
              </select>
            </label>
          </div>

          {/* The editor does not soft-wrap, so one logical line is always one
              visual row and the gutter can never drift out of step with the
              code. The Arduino IDE behaves the same way. */}
          <div className="relative">
            {/* line gutter with the execution marker */}
            <div
              aria-hidden
              className="absolute inset-y-0 left-0 z-10 w-[54px] bg-plastic border-r border-plastic-edge pointer-events-none"
            >
              {lines.map((_, i) => {
                const on = snap.line === i + 1 && (running || paused)
                const bad = errored && snap.error?.line === i + 1
                return (
                  <div
                    key={i}
                    className="num text-meta leading-[1.55rem] pr-2 flex items-center justify-end gap-1 transition-colors"
                    style={{
                      color: bad ? 'var(--no)' : on ? 'var(--signal-high)' : 'var(--ink-faint)',
                      fontWeight: on || bad ? 700 : 400,
                      background: on
                        ? 'color-mix(in srgb, var(--signal-high) 12%, transparent)'
                        : bad
                          ? 'var(--no-field)'
                          : undefined,
                    }}
                  >
                    {/* The marker has its own lane. Replacing the digit would
                        hide the number of the one line the student is being
                        told about, which is the number the error message and
                        the lesson both refer to. */}
                    <span className="w-3 shrink-0 text-center">
                      {on ? '\u25B8' : bad ? '\u00D7' : ''}
                    </span>
                    <span>{i + 1}</span>
                  </div>
                )
              })}
            </div>

            <textarea
              ref={editorRef}
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                markEngaged()
              }}
              onKeyDown={(e) => {
                // Tab inserts two spaces rather than leaving the editor, but
                // Escape then Tab still gets a keyboard user out.
                if (e.key === 'Tab' && !e.shiftKey) {
                  e.preventDefault()
                  const el = e.currentTarget
                  const s = el.selectionStart
                  const next = `${code.slice(0, s)}  ${code.slice(el.selectionEnd)}`
                  setCode(next)
                  requestAnimationFrame(() => {
                    el.selectionStart = el.selectionEnd = s + 2
                  })
                }
              }}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              aria-label="Arduino sketch. Press Escape then Tab to leave the editor."
              wrap="off"
              className="num w-full block resize-y bg-plastic-sunk text-ink pl-[62px] pr-4 py-0 text-fine leading-[1.55rem] outline-none focus-visible:outline-3 focus-visible:-outline-offset-2 whitespace-pre overflow-x-auto"
              style={{
                minHeight: `${Math.max(11, lines.length + 1) * 1.55}rem`,
                tabSize: 2,
                // The gutter is sticky over a horizontally scrolling editor, so
                // the numbers stay put when a long line is scrolled sideways.
                scrollbarWidth: 'thin',
              }}
            />
          </div>

          {/* message window, exactly like the IDE's */}
          <div className="border-t border-plastic-edge bg-plastic px-3 py-2.5 min-h-[64px]">
            <Silk className="block mb-1.5">Message window</Silk>
            {errored && snap.error ? (
              <div role="alert">
                <p className="text-fine font-semibold text-no mb-1">
                  Line {snap.error.line}: {snap.error.message}
                </p>
                {snap.error.hint && (
                  <p className="text-fine text-ink-2 leading-snug">{snap.error.hint}</p>
                )}
              </div>
            ) : snap.status === 'idle' ? (
              <p className="text-fine text-ink-3">
                Press Run to compile and upload this sketch to the board.
              </p>
            ) : (
              <p className="text-fine text-ink-3">
                Compiled successfully.{' '}
                <span className="num">
                  loop() has run {snap.loops}×, {(snap.clock / 1000).toFixed(1)}s on the board clock.
                </span>
              </p>
            )}
          </div>
        </div>

        {/* ------------------------------------------------ board column */}
        <div className="order-1 lg:order-2 bg-plastic">
          <div className="p-4">
            <BoardView preset={preset} snap={snap} running={running} />
          </div>

          {preset.env.length > 0 && (
            <div className="px-4 pb-4 space-y-3 border-t border-plastic-edge pt-4">
              <Silk className="block">The physical world</Silk>
              {preset.env.map((c) => {
                const value = env[c.id] ?? c.value
                if (c.max === 1 && c.step === 1) {
                  return (
                    <VizToggle
                      key={c.id}
                      label={c.label}
                      on={value > 0.5}
                      onChange={(v) => {
                        setEnv((e) => ({ ...e, [c.id]: v ? 1 : 0 }))
                        markEngaged()
                      }}
                      onLabel="Closed"
                      offLabel="Open"
                      hint={c.explain(value)}
                    />
                  )
                }
                return (
                  <VizSlider
                    key={c.id}
                    label={c.label}
                    value={value}
                    min={c.min}
                    max={c.max}
                    step={c.step}
                    unit={c.unit}
                    onChange={(v) => {
                      setEnv((e) => ({ ...e, [c.id]: v }))
                      markEngaged()
                    }}
                    hint={c.explain(value)}
                  />
                )
              })}
            </div>
          )}

          {snap.serial.length > 0 && (
            <div className="px-4 pb-4">
              <Silk className="block mb-1.5">Serial monitor</Silk>
              <pre
                className="num text-meta leading-relaxed bg-plastic-sunk border border-plastic-edge rounded-sm p-2.5 max-h-32 overflow-y-auto whitespace-pre-wrap"
                aria-live="polite"
                aria-label="Serial monitor output"
              >
                {snap.serial.slice(-12).join('')}
              </pre>
            </div>
          )}

          {warnings.length > 0 && (
            <div className="px-4 pb-4">
              {warnings.map((w) => (
                <p
                  key={w}
                  className="text-fine text-warn bg-warn-field border border-warn-edge rounded-sm px-3 py-2 leading-snug"
                >
                  {w}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {preset.watchFor && !compact && (
        <div className="px-4 py-3 border-t border-plastic-edge bg-plastic-sunk">
          <Silk className="block mb-1">What to watch for</Silk>
          <p className="text-small text-ink-2 leading-relaxed">{preset.watchFor}</p>
        </div>
      )}

      <LiveRegion message={announce} />
    </div>
  )
}

/* ------------------------------------------------------ the drawing ---- */

function BoardView({
  preset,
  snap,
  running,
}: {
  preset: CircuitPreset
  snap: RuntimeSnapshot
  running: boolean
}) {
  const states = snap.states

  return (
    <div>
      <svg viewBox="0 0 300 200" className="w-full" role="img" aria-label="The wired circuit">
        {/* the board edge */}
        <rect x="4" y="40" width="66" height="130" rx="5" fill="var(--pcb)" />
        <text
          x="37"
          y="32"
          textAnchor="middle"
          fontSize="8"
          fontWeight="700"
          fill="var(--ink-3)"
          style={{ letterSpacing: '0.1em' }}
        >
          UNO
        </text>
        {/* pin stubs, lit when driven */}
        {[13, 9, 8, 7, 2, A0, A0 + 1].map((pin, i) => {
          const p = snap.board?.pins?.[pin]
          const live = !!p && p.voltage >= 2.5
          return (
            <g key={pin}>
              <rect x="60" y={50 + i * 17} width="14" height="9" rx="1.5" fill="var(--pcb-pad)" />
              <text
                x="52"
                y={57 + i * 17}
                textAnchor="end"
                fontSize="7"
                fontWeight="700"
                fill={live ? 'var(--signal-high)' : 'rgba(255,255,255,0.75)'}
                className="num"
              >
                {pinLabel(pin)}
              </text>
              {live && <circle cx="67" cy={54 + i * 17} r="6" fill="var(--signal-high)" opacity="0.28" />}
            </g>
          )
        })}

        {/* breadboard */}
        <rect x="92" y="30" width="204" height="150" rx="4" fill="var(--plastic-raised)" stroke="var(--plastic-edge)" />
        <line x1="98" y1="40" x2="290" y2="40" stroke="var(--rail-pos)" strokeWidth="1.2" opacity="0.6" />
        <line x1="98" y1="170" x2="290" y2="170" stroke="var(--rail-neg)" strokeWidth="1.2" opacity="0.6" />
        {Array.from({ length: 12 }, (_, c) =>
          Array.from({ length: 6 }, (_, r) => (
            <rect
              key={`${c}-${r}`}
              x={102 + c * 16}
              y={54 + r * 17}
              width="5"
              height="5"
              rx="1"
              fill="var(--hole)"
            />
          )),
        )}

        {/* the components */}
        {preset.components.map((c) => {
          const st = states[c.id]
          const x = 100 + c.x * 16
          const y = 50 + c.y * 17
          return <Part key={c.id} kind={c.kind} x={x} y={y} state={st} colour={c.colour} running={running} />
        })}

        {/* signal wires from pins to components */}
        {preset.components
          .filter((c) => c.pin !== undefined)
          .map((c) => {
            const pinRow = [13, 9, 8, 7, 2, A0, A0 + 1].indexOf(c.pin!)
            if (pinRow < 0) return null
            const y0 = 54 + pinRow * 17
            const x1 = 100 + c.x * 16
            const y1 = 50 + c.y * 17 + 6
            const p = snap.board?.pins?.[c.pin!]
            const live = !!p && p.voltage >= 2.5
            const colour = c.wire ? `var(--wire-${c.wire})` : 'var(--ink-faint)'
            return (
              <path
                key={`w-${c.id}`}
                d={`M74 ${y0} C 86 ${y0}, ${x1 - 14} ${y1}, ${x1} ${y1}`}
                fill="none"
                stroke={colour}
                strokeWidth="2"
                strokeLinecap="round"
                className={live && running ? 'current-flow' : undefined}
                opacity={live ? 1 : 0.55}
              />
            )
          })}
      </svg>

      {/* readouts */}
      <dl className="mt-3 grid gap-1.5">
        {preset.components
          .filter((c) => states[c.id]?.readout)
          .map((c) => {
            const st = states[c.id]
            return (
              <div
                key={c.id}
                className="flex items-center justify-between gap-3 px-2.5 py-1.5 rounded-sm bg-plastic-sunk border border-plastic-edge"
              >
                <dt className="text-fine text-ink-2 flex items-center gap-2 min-w-0">
                  <span
                    aria-hidden
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: st.active ? 'var(--signal-high)' : 'var(--signal-low)' }}
                  />
                  <span className="truncate">{c.label}</span>
                </dt>
                <dd className="num text-fine font-semibold shrink-0" aria-live="polite">
                  {st.readout}
                </dd>
              </div>
            )
          })}
      </dl>
    </div>
  )
}

function Part({
  kind,
  x,
  y,
  state,
  colour,
  running,
}: {
  kind: string
  x: number
  y: number
  state?: ComponentState
  colour?: string
  running: boolean
}) {
  const on = !!state?.active
  const drive = state?.drive ?? 0

  switch (kind) {
    case 'led': {
      const lens =
        colour === 'green'
          ? 'var(--wire-green)'
          : colour === 'yellow'
            ? 'var(--wire-yellow)'
            : colour === 'blue'
              ? 'var(--wire-blue)'
              : 'var(--led-lens)'
      return (
        <g>
          {on && (
            <circle
              cx={x}
              cy={y + 6}
              r={10 + drive * 8}
              fill={lens}
              opacity={0.18 + drive * 0.22}
              style={{ transition: 'r var(--bloom), opacity var(--bloom)' }}
            />
          )}
          <path
            d={`M${x} ${y - 3}a7 7 0 0 1 0 18z`}
            fill={on ? lens : `color-mix(in srgb, ${lens} 28%, var(--plastic-edge))`}
            style={{ transition: 'fill var(--bloom)' }}
          />
          <rect
            x={x - 2}
            y={y - 3}
            width="3"
            height="18"
            fill={on ? lens : `color-mix(in srgb, ${lens} 28%, var(--plastic-edge))`}
          />
          <path d={`M${x - 1} ${y + 15}v6M${x + 5} ${y + 15}v6`} stroke="var(--ink-faint)" strokeWidth="1.5" />
        </g>
      )
    }
    case 'resistor':
      return (
        <g>
          <path d={`M${x - 10} ${y + 6}h8M${x + 20} ${y + 6}h8`} stroke="var(--ink-faint)" strokeWidth="1.5" />
          <rect x={x - 2} y={y} width="22" height="12" rx="5" fill="var(--resistor-body)" />
          <rect x={x + 2} y={y} width="2.5" height="12" fill="#6b4423" />
          <rect x={x + 6} y={y} width="2.5" height="12" fill="#1d2329" />
          <rect x={x + 10} y={y} width="2.5" height="12" fill="#8b2b20" />
        </g>
      )
    case 'ldr':
      return (
        <g>
          <circle cx={x + 6} cy={y + 6} r="9" fill="#d8cfa8" stroke="var(--ink-faint)" strokeWidth="1.2" />
          <path d={`M${x} ${y + 4}q6-4 12 0M${x} ${y + 9}q6-4 12 0`} fill="none" stroke="#8b6f2b" strokeWidth="1.4" />
          <g opacity={drive}>
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M${x - 10 - i * 3} ${y - 4 + i * 4}l6 3`}
                stroke="var(--wire-yellow)"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            ))}
          </g>
        </g>
      )
    case 'lm35':
      return (
        <g>
          <rect x={x} y={y} width="16" height="14" rx="7" fill="var(--dip-body)" />
          <rect x={x} y={y} width="16" height="8" rx="4" fill="var(--dip-body)" />
          <path d={`M${x + 3} ${y + 14}v6M${x + 8} ${y + 14}v6M${x + 13} ${y + 14}v6`} stroke="var(--ink-faint)" strokeWidth="1.4" />
          <rect
            x={x + 20}
            y={y - 2}
            width="4"
            height="18"
            rx="2"
            fill="var(--plastic-sunk)"
            stroke="var(--ink-faint)"
            strokeWidth="0.8"
          />
          <rect
            x={x + 21}
            y={y + 14 - Math.max(1, drive * 15)}
            width="2"
            height={Math.max(1, drive * 15)}
            fill="var(--signal-high)"
          />
        </g>
      )
    case 'motor':
      return (
        <g>
          <circle cx={x + 9} cy={y + 7} r="11" fill="var(--dip-body)" />
          <g
            style={{
              transformOrigin: `${x + 9}px ${y + 7}px`,
              animation: on && running ? 'spin 620ms linear infinite' : undefined,
            }}
          >
            <path d={`M${x + 9} ${y - 2}v18M${x} ${y + 7}h18`} stroke="var(--pcb-pad)" strokeWidth="2.2" />
          </g>
          <circle cx={x + 9} cy={y + 7} r="3" fill="var(--plastic-edge)" />
        </g>
      )
    case 'buzzer':
      return (
        <g>
          <circle cx={x + 8} cy={y + 7} r="10" fill="#1b1f24" />
          <circle cx={x + 8} cy={y + 7} r="2.5" fill="#4c565e" />
          {on &&
            [0, 1].map((i) => (
              <path
                key={i}
                d={`M${x + 20 + i * 5} ${y}a${8 + i * 4} ${8 + i * 4} 0 0 1 0 ${14 + i * 5}`}
                fill="none"
                stroke="var(--signal-high)"
                strokeWidth="1.6"
                opacity={0.9 - i * 0.3}
              />
            ))}
        </g>
      )
    case 'reed':
    case 'button':
      return (
        <g>
          <rect
            x={x - 2}
            y={y}
            width="26"
            height="13"
            rx="6"
            fill="none"
            stroke="var(--ink-faint)"
            strokeWidth="1.3"
          />
          <path d={`M${x + 2} ${y + 6.5}h8`} stroke="var(--ink-2)" strokeWidth="1.6" />
          <path
            d={on ? `M${x + 12} ${y + 6.5}h8` : `M${x + 12} ${y + 3}l8 3`}
            stroke={on ? 'var(--signal-high)' : 'var(--ink-2)'}
            strokeWidth="1.6"
            style={{ transition: 'all var(--seat)' }}
          />
        </g>
      )
    case 'servo':
      return (
        <g>
          <rect x={x} y={y} width="22" height="16" rx="2" fill="#2b3138" />
          <circle cx={x + 11} cy={y - 3} r="6" fill="#1b1f24" />
          <g
            transform={`rotate(${drive * 180 - 90} ${x + 11} ${y - 3})`}
            style={{ transition: 'transform 220ms cubic-bezier(.25,1,.5,1)' }}
          >
            <rect x={x + 9} y={y - 16} width="4" height="14" rx="2" fill="var(--wire-white)" />
          </g>
        </g>
      )
    default:
      return null
  }
}
