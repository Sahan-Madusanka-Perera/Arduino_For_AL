import { useState } from 'react'
import { FigureFrame, VizSlider, VizToggle } from './Frame'
import { Silk, cx } from '@/components/ui'

/* Figures for module 4: breadboard, jumpers, LED, resistor bands, servo. */

/* ------------------------------------------------------ breadboard ----- */

const COLS = 20
const ROWS = 5

export function BreadboardFigure({ description }: { description: string }) {
  /** Selected hole as "band:col:row", or a rail id. */
  const [sel, setSel] = useState<string | null>(null)

  function connected(id: string): boolean {
    if (!sel) return false
    if (sel.startsWith('rail')) return id.startsWith(sel.slice(0, 6))
    const [band, col] = sel.split(':')
    const [b2, c2] = id.split(':')
    // Holes in the same column of the same band share a clip.
    return band === b2 && col === c2
  }

  const explain = !sel
    ? 'Select any hole to light up every other hole it is electrically joined to underneath.'
    : sel.startsWith('rail')
      ? 'Every hole along a power rail is joined together for the whole length of the board. That is why you can take 5V or GND from anywhere along it.'
      : 'These five holes share one metal clip underneath. Anything pushed into any of them is connected to everything in the other four. The channel down the middle breaks the connection, which is what lets a chip straddle it.'

  return (
    <FigureFrame legend="Which holes are joined underneath" description={description}>
      <div className="overflow-x-auto -mx-2 px-2">
        <svg viewBox="0 0 460 210" className="w-full min-w-[420px]" role="presentation">
          <rect x="0" y="0" width="460" height="210" rx="8" fill="var(--plastic)" stroke="var(--plastic-edge)" />

          {/* top power rails */}
          <Rail y={16} sign="+" colour="var(--rail-pos)" id="rail-tp" sel={sel} setSel={setSel} connected={connected} />
          <Rail y={30} sign="−" colour="var(--rail-neg)" id="rail-tn" sel={sel} setSel={setSel} connected={connected} />

          {/* upper band */}
          {Array.from({ length: COLS }, (_, c) =>
            Array.from({ length: ROWS }, (_, r) => {
              const id = `a:${c}:${r}`
              return (
                <Hole
                  key={id}
                  id={id}
                  x={26 + c * 21}
                  y={58 + r * 13}
                  on={sel === id}
                  lit={connected(id)}
                  setSel={setSel}
                  label={`Upper band, column ${c + 1}, row ${String.fromCharCode(65 + r)}`}
                />
              )
            }),
          )}

          {/* channel */}
          <rect x="18" y="122" width="428" height="14" rx="2" fill="var(--plastic-sunk)" />
          <text
            x="232"
            y="132"
            textAnchor="middle"
            fontSize="7"
            fontWeight="700"
            fill="var(--ink-faint)"
            style={{ letterSpacing: '0.16em' }}
          >
            CENTRE CHANNEL · THE TWO HALVES ARE NOT JOINED
          </text>

          {/* lower band */}
          {Array.from({ length: COLS }, (_, c) =>
            Array.from({ length: ROWS }, (_, r) => {
              const id = `b:${c}:${r}`
              return (
                <Hole
                  key={id}
                  id={id}
                  x={26 + c * 21}
                  y={144 + r * 13}
                  on={sel === id}
                  lit={connected(id)}
                  setSel={setSel}
                  label={`Lower band, column ${c + 1}, row ${String.fromCharCode(70 + r)}`}
                />
              )
            }),
          )}

          {/* bottom power rails */}
          <Rail y={196} sign="−" colour="var(--rail-neg)" id="rail-bn" sel={sel} setSel={setSel} connected={connected} />
          <Rail y={182} sign="+" colour="var(--rail-pos)" id="rail-bp" sel={sel} setSel={setSel} connected={connected} />
        </svg>
      </div>

      <p className="mt-4 text-body text-ink-2 leading-relaxed" aria-live="polite">
        {explain}
      </p>
    </FigureFrame>
  )
}

function Hole({
  id,
  x,
  y,
  on,
  lit,
  setSel,
  label,
}: {
  id: string
  x: number
  y: number
  on: boolean
  lit: boolean
  setSel: (v: string) => void
  label: string
}) {
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={on}
      onClick={() => setSel(id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setSel(id)
        }
      }}
      style={{ cursor: 'pointer' }}
    >
      <rect
        x={x - 4}
        y={y - 4}
        width="8"
        height="8"
        rx="1.5"
        fill={lit ? 'var(--signal-analog)' : 'var(--hole)'}
        stroke={on ? 'var(--ink)' : 'transparent'}
        strokeWidth="1.5"
        className="transition-colors duration-150"
      />
      <rect x={x - 9} y={y - 6} width="18" height="12" fill="transparent" pointerEvents="all" />
    </g>
  )
}

function Rail({
  y,
  sign,
  colour,
  id,
  sel,
  setSel,
  connected,
}: {
  y: number
  sign: string
  colour: string
  id: string
  sel: string | null
  setSel: (v: string) => void
  connected: (id: string) => boolean
}) {
  const lit = connected(`${id}:0`)
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${sign === '+' ? 'Positive' : 'Negative'} power rail`}
      aria-pressed={sel?.startsWith(id) ?? false}
      onClick={() => setSel(`${id}:0`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setSel(`${id}:0`)
        }
      }}
      style={{ cursor: 'pointer' }}
    >
      <line x1="20" y1={y} x2="444" y2={y} stroke={colour} strokeWidth="1.5" opacity="0.6" />
      <text x="12" y={y + 3} textAnchor="middle" fontSize="9" fontWeight="700" fill={colour}>
        {sign}
      </text>
      {Array.from({ length: COLS }, (_, c) => (
        <rect
          key={c}
          x={26 + c * 21 - 3.5}
          y={y - 3.5}
          width="7"
          height="7"
          rx="1.5"
          fill={lit ? 'var(--signal-analog)' : 'var(--hole)'}
          className="transition-colors duration-150"
        />
      ))}
      <rect x="18" y={y - 6} width="428" height="12" fill="transparent" pointerEvents="all" />
    </g>
  )
}

/* --------------------------------------------------------- jumpers ----- */

const JUMPERS = [
  {
    id: 'mm',
    name: 'Male to male',
    ends: ['pin', 'pin'] as const,
    body: 'A pin at each end. This is the one you use most, because breadboard holes are sockets.',
    use: 'Breadboard hole → breadboard hole.',
  },
  {
    id: 'mf',
    name: 'Male to female',
    ends: ['pin', 'socket'] as const,
    body: 'A pin at one end and a socket at the other.',
    use: 'Breadboard hole → a pin sticking out of a sensor module.',
  },
  {
    id: 'ff',
    name: 'Female to female',
    ends: ['socket', 'socket'] as const,
    body: 'A socket at each end.',
    use: 'Module pin → module pin, with no breadboard involved.',
  },
]

export function JumperFigure({ description }: { description: string }) {
  const [active, setActive] = useState('mm')
  const j = JUMPERS.find((x) => x.id === active)!

  return (
    <FigureFrame legend="Three types of jumper wire" description={description}>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {JUMPERS.map((x, i) => {
            const on = x.id === active
            const colour = ['var(--wire-red)', 'var(--wire-green)', 'var(--wire-blue)'][i]
            return (
              <button
                key={x.id}
                onClick={() => setActive(x.id)}
                aria-pressed={on}
                className={cx(
                  'p-3 rounded-md border transition-all',
                  on
                    ? 'bg-plastic-raised border-ink-faint shadow-[var(--lift-2)]'
                    : 'bg-plastic border-plastic-edge hover:border-ink-faint',
                )}
              >
                <svg viewBox="0 0 120 34" className="w-full mb-2" aria-hidden>
                  <path d="M22 17h76" stroke={colour} strokeWidth="4" strokeLinecap="round" fill="none" />
                  <End x={16} kind={x.ends[0]} colour={colour} flip />
                  <End x={104} kind={x.ends[1]} colour={colour} />
                </svg>
                <span className="block text-meta font-semibold leading-tight">{x.name}</span>
              </button>
            )
          })}
        </div>
        <div
          className="rounded-md border border-plastic-edge bg-plastic-raised p-4"
          aria-live="polite"
        >
          <h3 className="text-body font-semibold mb-1.5">{j.name}</h3>
          <p className="text-body text-ink-2 leading-relaxed mb-2">{j.body}</p>
          <p className="text-fine text-ink-3">
            <span className="silk mr-2">Connects</span>
            {j.use}
          </p>
        </div>
      </div>
    </FigureFrame>
  )
}

function End({
  x,
  kind,
  colour,
  flip,
}: {
  x: number
  kind: 'pin' | 'socket'
  colour: string
  flip?: boolean
}) {
  const dir = flip ? -1 : 1
  return (
    <g>
      <rect x={x - 5} y={9} width="12" height="16" rx="2" fill={colour} />
      {kind === 'pin' ? (
        <rect x={flip ? x - 13 : x + 7} y={15} width="8" height="4" rx="1" fill="var(--ink-faint)" />
      ) : (
        <rect
          x={flip ? x - 12 : x + 6}
          y={12}
          width="7"
          height="10"
          rx="1.5"
          fill="none"
          stroke="var(--ink-faint)"
          strokeWidth="1.5"
        />
      )}
      <rect x={x - 5 + dir * 0} y={9} width="0" height="0" fill="none" />
    </g>
  )
}

/* ------------------------------------------------------------- LED ----- */

export function LedFigure({ description }: { description: string }) {
  const [forward, setForward] = useState(true)

  return (
    <FigureFrame
      legend="An LED only works one way round"
      description={description}
      controls={
        <VizToggle
          label="LED orientation"
          on={forward}
          onChange={setForward}
          onLabel="Correct way"
          offLabel="Reversed"
          hint={
            forward
              ? 'Long leg (anode, positive) to the pin through a resistor; short leg (cathode, negative) to GND. Current flows and the LED lights.'
              : 'Reversed. A diode only lets current pass in one direction, so nothing flows and the LED simply stays dark. It is not damaged, it just does nothing.'
          }
        />
      }
    >
      <svg viewBox="0 0 340 130" className="w-full max-w-[460px] mx-auto" role="presentation">
        {/* pin */}
        <rect x="4" y="52" width="52" height="26" rx="3" fill="var(--dip-body)" />
        <text x="30" y="69" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">
          PIN 13
        </text>

        {/* wire to resistor */}
        <path
          d="M56 65h30"
          stroke={forward ? 'var(--signal-high)' : 'var(--ink-faint)'}
          strokeWidth="3"
          className={forward ? 'current-flow' : undefined}
          strokeLinecap="round"
        />

        {/* resistor */}
        <rect x="86" y="55" width="52" height="20" rx="4" fill="var(--resistor-body)" />
        {[96, 104, 112, 128].map((x, i) => (
          <rect
            key={x}
            x={x}
            y="55"
            width={i === 3 ? 5 : 4}
            height="20"
            fill={['#6b4423', '#1d2329', '#8b2b20', '#c8a02e'][i]}
          />
        ))}
        <text x="112" y="48" textAnchor="middle" fontSize="8" fontWeight="700" fill="var(--ink-3)">
          100 Ω
        </text>

        <path
          d="M138 65h28"
          stroke={forward ? 'var(--signal-high)' : 'var(--ink-faint)'}
          strokeWidth="3"
          className={forward ? 'current-flow' : undefined}
          strokeLinecap="round"
        />

        {/* the LED, flipped when reversed */}
        <g transform={forward ? 'translate(0 0)' : 'translate(248 0) scale(-1 1)'}>
          {/* long leg (anode) */}
          <path d="M166 65h14" stroke="var(--ink-faint)" strokeWidth="2.5" />
          {/* lens */}
          <path
            d="M180 46a19 19 0 0 1 0 38z"
            fill={forward ? 'var(--led-lens)' : 'color-mix(in srgb, var(--led-lens) 25%, var(--plastic-edge))'}
            className="transition-all duration-150"
          />
          <rect
            x="180"
            y="46"
            width="4"
            height="38"
            fill={forward ? 'var(--led-lens)' : 'color-mix(in srgb, var(--led-lens) 25%, var(--plastic-edge))'}
          />
          {/* flat spot beside the short leg */}
          <path d="M199 50v30" stroke="var(--ink)" strokeWidth="2" opacity="0.35" />
          <path d="M199 65h14" stroke="var(--ink-faint)" strokeWidth="2.5" />
          {forward && (
            <g opacity="0.9">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                <line
                  key={a}
                  x1={190 + Math.cos((a * Math.PI) / 180) * 26}
                  y1={65 + Math.sin((a * Math.PI) / 180) * 26}
                  x2={190 + Math.cos((a * Math.PI) / 180) * 34}
                  y2={65 + Math.sin((a * Math.PI) / 180) * 34}
                  stroke="var(--led-lens)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              ))}
            </g>
          )}
        </g>

        <path
          d="M213 65h35"
          stroke={forward ? 'var(--signal-high)' : 'var(--ink-faint)'}
          strokeWidth="3"
          className={forward ? 'current-flow' : undefined}
          strokeLinecap="round"
        />

        {/* GND */}
        <path d="M248 65h20M258 78h20M262 88h12M266 97h4" stroke="var(--rail-neg)" strokeWidth="2.5" fill="none" />
        <path d="M268 55v20" stroke="var(--rail-neg)" strokeWidth="2.5" />
        <path d="M258 78h20" stroke="var(--rail-neg)" strokeWidth="2.5" />
        <text x="296" y="72" fontSize="9" fontWeight="700" fill="var(--rail-neg)">
          GND
        </text>

        <text x="172" y="118" textAnchor="middle" fontSize="8" fontWeight="700" fill="var(--ink-faint)">
          {forward ? 'ANODE (LONG LEG, +)' : 'CATHODE (SHORT LEG, −)'}
        </text>
        <text x="206" y="118" textAnchor="start" fontSize="8" fontWeight="700" fill="var(--ink-faint)">
          {forward ? '  CATHODE (−)' : '  ANODE (+)'}
        </text>
      </svg>
    </FigureFrame>
  )
}

/* ------------------------------------------------ resistor bands ------- */

const BAND_COLOURS = [
  { name: 'Black', hex: '#1d2329', digit: 0 },
  { name: 'Brown', hex: '#6b4423', digit: 1 },
  { name: 'Red', hex: '#8b2b20', digit: 2 },
  { name: 'Orange', hex: '#c86a1c', digit: 3 },
  { name: 'Yellow', hex: '#cfa310', digit: 4 },
  { name: 'Green', hex: '#1f7a45', digit: 5 },
  { name: 'Blue', hex: '#1a4fa0', digit: 6 },
  { name: 'Violet', hex: '#6c3fa8', digit: 7 },
  { name: 'Grey', hex: '#8d949b', digit: 8 },
  { name: 'White', hex: '#e8ebee', digit: 9 },
]

function formatOhms(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(v % 1_000_000 ? 1 : 0)} MΩ`
  if (v >= 1000) return `${(v / 1000).toFixed(v % 1000 ? 1 : 0)} kΩ`
  return `${v} Ω`
}

export function ResistorBandsFigure({ description }: { description: string }) {
  const [b1, setB1] = useState(1) // brown
  const [b2, setB2] = useState(0) // black
  const [mult, setMult] = useState(2) // red = ×100

  const value = (b1 * 10 + b2) * Math.pow(10, mult)

  return (
    <FigureFrame
      legend="Reading the colour bands"
      description={description}
      controls={
        <div className="grid gap-3 sm:grid-cols-3">
          <BandPicker label="Band 1 · first digit" value={b1} onChange={setB1} />
          <BandPicker label="Band 2 · second digit" value={b2} onChange={setB2} />
          <BandPicker label="Band 3 · multiplier" value={mult} onChange={setMult} multiplier />
        </div>
      }
    >
      <div className="flex flex-col items-center gap-4">
        <svg viewBox="0 0 260 74" className="w-full max-w-[340px]" role="presentation">
          <path d="M4 37h44M212 37h44" stroke="var(--ink-faint)" strokeWidth="2.5" />
          <rect x="48" y="18" width="164" height="38" rx="16" fill="var(--resistor-body)" />
          <rect x="72" y="18" width="15" height="38" fill={BAND_COLOURS[b1].hex} />
          <rect x="100" y="18" width="15" height="38" fill={BAND_COLOURS[b2].hex} />
          <rect x="128" y="18" width="15" height="38" fill={BAND_COLOURS[mult].hex} />
          <rect x="188" y="18" width="12" height="38" fill="#c8a02e" />
          <text x="194" y="68" textAnchor="middle" fontSize="7" fill="var(--ink-faint)">
            tol.
          </text>
        </svg>

        <div className="text-center" aria-live="polite">
          <div className="num text-3xl font-bold">{formatOhms(value)}</div>
          <p className="text-fine text-ink-3 mt-1.5">
            {BAND_COLOURS[b1].name} ({b1}) · {BAND_COLOURS[b2].name} ({b2}) · ×10
            <sup>{mult}</sup> = {b1}
            {b2} × {Math.pow(10, mult).toLocaleString()}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {[
            { label: 'The LED resistor', v: [1, 0, 2] as const, note: 'about 100 Ω' },
            { label: 'The LDR resistor', v: [1, 0, 3] as const, note: 'about 10 kΩ' },
            { label: 'Common LED value', v: [2, 2, 1] as const, note: '220 Ω' },
          ].map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setB1(p.v[0])
                setB2(p.v[1])
                setMult(p.v[2])
              }}
              className="px-3 h-9 rounded-sm border border-plastic-edge bg-plastic text-fine hover:border-ink-faint transition-colors"
            >
              {p.label}
              <span className="num text-ink-3 ml-1.5">{p.note}</span>
            </button>
          ))}
        </div>
      </div>
    </FigureFrame>
  )
}

function BandPicker({
  label,
  value,
  onChange,
  multiplier,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  multiplier?: boolean
}) {
  return (
    <div>
      <Silk className="block mb-1.5">{label}</Silk>
      <div className="flex flex-wrap gap-1">
        {BAND_COLOURS.map((c, i) => (
          <button
            key={c.name}
            onClick={() => onChange(i)}
            aria-pressed={value === i}
            aria-label={`${c.name}${multiplier ? `, multiply by 10 to the power ${i}` : `, digit ${i}`}`}
            title={c.name}
            className={cx(
              'w-8 h-8 rounded-sm border-2 transition-transform',
              value === i ? 'border-ink scale-110' : 'border-plastic-edge',
            )}
            style={{ background: c.hex }}
          />
        ))}
      </div>
    </div>
  )
}

/* ----------------------------------------------------------- servo ----- */

export function ServoFigure({ description }: { description: string }) {
  const [angle, setAngle] = useState(90)

  return (
    <FigureFrame
      legend="Servo motor wiring"
      description={description}
      controls={
        <VizSlider
          label="Commanded angle"
          value={angle}
          min={0}
          max={180}
          unit="°"
          onChange={setAngle}
          colour="var(--wire-orange)"
          hint="Only the orange control wire carries this instruction. The other two just supply power."
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-[1.2fr_1fr] sm:items-center">
        <svg viewBox="0 0 260 150" className="w-full" role="presentation">
          {/* servo body */}
          <rect x="130" y="46" width="86" height="58" rx="4" fill="#2b3138" />
          <rect x="118" y="58" width="12" height="34" rx="2" fill="#2b3138" />
          <circle cx="173" cy="40" r="17" fill="#1b1f24" />
          {/* horn */}
          <g transform={`rotate(${angle - 90} 173 40)`} style={{ transition: 'transform 220ms cubic-bezier(.25,1,.5,1)' }}>
            <rect x="169" y="6" width="8" height="36" rx="3" fill="var(--wire-white)" />
            <circle cx="173" cy="10" r="4" fill="var(--plastic-sunk)" />
          </g>
          <circle cx="173" cy="40" r="5" fill="var(--plastic-edge)" />

          {/* the three wires */}
          {[
            { y: 62, colour: 'var(--wire-brown)', label: 'GND' },
            { y: 75, colour: 'var(--wire-red)', label: '5V' },
            { y: 88, colour: 'var(--wire-orange)', label: 'D9 (PWM)' },
          ].map((w) => (
            <g key={w.label}>
              <path
                d={`M118 ${w.y}H56`}
                stroke={w.colour}
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
                className={w.label.includes('PWM') ? 'current-flow' : undefined}
              />
              <rect x="14" y={w.y - 9} width="42" height="18" rx="3" fill="var(--dip-body)" />
              <text x="35" y={w.y + 4} textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff">
                {w.label}
              </text>
            </g>
          ))}
          <text x="173" y="126" textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--ink-2)" className="num">
            {angle}°
          </text>
        </svg>

        <ul className="space-y-2">
          {[
            { colour: 'var(--wire-brown)', wire: 'Brown', to: 'A ground (GND) pin on the Arduino' },
            { colour: 'var(--wire-red)', wire: 'Red', to: 'The 5V pin, for power' },
            {
              colour: 'var(--wire-orange)',
              wire: 'Orange',
              to: 'The control wire. A PWM-enabled digital pin such as D6 or D9',
            },
          ].map((w) => (
            <li
              key={w.wire}
              className="flex gap-3 items-start p-3 rounded-md border border-plastic-edge bg-plastic-raised"
            >
              <span
                aria-hidden
                className="w-3 h-3 rounded-full mt-1 shrink-0"
                style={{ background: w.colour }}
              />
              <div>
                <span className="block text-small font-semibold">{w.wire} wire</span>
                <span className="block text-fine text-ink-3 leading-snug">{w.to}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </FigureFrame>
  )
}
