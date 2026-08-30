import { useState } from 'react'
import { FigureFrame, VizSlider, VizToggle } from './Frame'
import { Silk, cx } from '@/components/ui'

/* Figures for module 2: the IPO model, the chip, and the comparison. */

/* ---------------------------------------------------------- IPO live --- */

export function IpoFigure({ description }: { description: string }) {
  const [temp, setTemp] = useState(21)
  const threshold = 25
  const on = temp >= threshold

  return (
    <FigureFrame
      legend="Input · Process · Output"
      description={description}
      controls={
        <VizSlider
          label="Room temperature"
          value={temp}
          min={10}
          max={40}
          step={0.5}
          unit="°C"
          onChange={setTemp}
          hint={
            on
              ? `${temp.toFixed(1)} is at or above the threshold of ${threshold}, so the process takes the true branch.`
              : `${temp.toFixed(1)} is below the threshold of ${threshold}, so the process takes the false branch.`
          }
        />
      }
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch">
        <Stage
          kind="in"
          label="Input"
          title="Temperature sensor"
          value={`${temp.toFixed(1)} °C`}
          note="A sensor captures the state of the physical world."
        />
        <Arrow />
        <Stage
          kind="proc"
          label="Process"
          title="The program"
          value={`temperatureC >= ${threshold}`}
          note={on ? 'This is true.' : 'This is false.'}
          state={on}
        />
        <Arrow />
        <Stage
          kind="out"
          label="Output"
          title="Fan motor"
          value={on ? 'RUNNING' : 'STOPPED'}
          note="An actuator changes something in the world."
          state={on}
          live
        />
      </div>
    </FigureFrame>
  )
}

function Stage({
  kind,
  label,
  title,
  value,
  note,
  state,
  live,
}: {
  kind: 'in' | 'proc' | 'out'
  label: string
  title: string
  value: string
  note: string
  state?: boolean
  live?: boolean
}) {
  const tint =
    kind === 'in' ? 'var(--wire-violet)' : kind === 'proc' ? 'var(--wire-blue)' : 'var(--signal-high)'
  return (
    <div
      className="rounded-md border bg-plastic-raised p-3.5 flex flex-col"
      style={{
        borderColor: live && state ? tint : 'var(--plastic-edge)',
        borderTopWidth: 3,
        borderTopColor: tint,
      }}
    >
      <Silk className="block mb-1">{label}</Silk>
      <p className="text-body font-semibold leading-tight mb-2">{title}</p>
      <p
        className="num text-body font-semibold mb-2 tabular-nums"
        style={{ color: live && state ? tint : 'var(--ink)' }}
        aria-live={live ? 'polite' : undefined}
      >
        {value}
      </p>
      <p className="text-meta text-ink-3 leading-snug mt-auto">{note}</p>
    </div>
  )
}

function Arrow() {
  return (
    <div className="hidden sm:flex items-center justify-center px-1" aria-hidden>
      <svg width="22" height="14" viewBox="0 0 22 14">
        <path
          d="M0 7h16m-4-5l5 5-5 5"
          fill="none"
          stroke="var(--ink-faint)"
          strokeWidth="1.6"
          strokeLinecap="square"
        />
      </svg>
    </div>
  )
}

/* ------------------------------------------------- inside a chip ------- */

const CHIP_BLOCKS = [
  {
    id: 'cpu',
    name: 'Processor (CPU)',
    body: 'Executes the program instructions, one after another. This is the part that actually does the work.',
    without: 'Without it there is nothing to run the program at all.',
    x: 20,
    y: 26,
    w: 78,
    h: 48,
  },
  {
    id: 'mem',
    name: 'Memory',
    body: 'Flash or ROM holds your uploaded program even when the power is off. RAM holds the values the program is working with right now.',
    without: 'Without built-in memory you would have to add external memory chips, which is exactly what a microprocessor needs.',
    x: 112,
    y: 26,
    w: 78,
    h: 48,
  },
  {
    id: 'io',
    name: 'Input/output ports',
    body: 'The pins that connect the chip to the outside world, so it can read sensors and drive components.',
    without: 'Without them the chip could compute but could never affect or observe anything.',
    x: 66,
    y: 88,
    w: 78,
    h: 44,
  },
]

export function McuChipFigure({ description }: { description: string }) {
  const [active, setActive] = useState('cpu')
  const block = CHIP_BLOCKS.find((b) => b.id === active)!

  return (
    <FigureFrame legend="Inside a microcontroller" description={description}>
      <div className="grid gap-4 md:grid-cols-[1fr_1fr] md:items-center">
        <svg viewBox="0 0 210 158" className="w-full max-w-[380px] mx-auto" role="presentation">
          {/* chip body */}
          <rect x="8" y="12" width="194" height="134" rx="6" fill="var(--dip-body)" />
          <rect
            x="8"
            y="12"
            width="194"
            height="134"
            rx="6"
            fill="none"
            stroke="var(--plastic-edge)"
          />
          {/* pin 1 dimple */}
          <circle cx="22" cy="26" r="4" fill="none" stroke="var(--ink-faint)" strokeWidth="1.2" />
          {/* legs */}
          {Array.from({ length: 7 }, (_, i) => (
            <g key={i}>
              <rect x={22 + i * 26} y="4" width="9" height="9" fill="var(--pcb-pad)" rx="1" />
              <rect x={22 + i * 26} y="145" width="9" height="9" fill="var(--pcb-pad)" rx="1" />
            </g>
          ))}

          {CHIP_BLOCKS.map((b) => {
            const on = b.id === active
            return (
              <g
                key={b.id}
                role="button"
                tabIndex={0}
                aria-pressed={on}
                aria-label={b.name}
                onClick={() => setActive(b.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setActive(b.id)
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={b.x}
                  y={b.y}
                  width={b.w}
                  height={b.h}
                  rx="3"
                  fill={on ? 'var(--signal-analog)' : 'rgba(255,255,255,0.08)'}
                  stroke={on ? 'var(--signal-analog)' : 'rgba(255,255,255,0.22)'}
                  strokeWidth="1.5"
                  className="transition-all duration-150"
                />
                <text
                  x={b.x + b.w / 2}
                  y={b.y + b.h / 2 + 4}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill={on ? '#fff' : 'rgba(255,255,255,0.85)'}
                  style={{ pointerEvents: 'none', letterSpacing: '0.06em' }}
                >
                  {b.id.toUpperCase()}
                </text>
              </g>
            )
          })}
          {/* internal buses */}
          <path
            d="M98 50h14M105 50v38M59 74v14h47M151 74v14h-46"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.4"
            fill="none"
          />
          <text
            x="105"
            y="140"
            textAnchor="middle"
            fontSize="8"
            fill="rgba(255,255,255,0.45)"
            style={{ letterSpacing: '0.16em' }}
          >
            ONE SINGLE CHIP
          </text>
        </svg>

        <div
          className="rounded-md border border-plastic-edge bg-plastic-raised p-4"
          aria-live="polite"
        >
          <h3 className="text-body font-semibold mb-2">{block.name}</h3>
          <p className="text-body text-ink-2 leading-relaxed mb-3">{block.body}</p>
          <p className="text-fine text-ink-3 border-l-2 border-warn pl-3">
            {block.without}
          </p>
        </div>
      </div>
    </FigureFrame>
  )
}

/* -------------------------------------------- MCU vs MPU arrangement --- */

export function MpuVsMcuFigure({ description }: { description: string }) {
  const [mcu, setMcu] = useState(true)

  return (
    <FigureFrame
      legend="Two ways to arrange the same three functions"
      description={description}
      controls={
        <VizToggle
          label="Show"
          on={mcu}
          onChange={setMcu}
          onLabel="Microcontroller"
          offLabel="Microprocessor"
          hint={
            mcu
              ? 'Everything on one chip. Nothing external is needed to run a program and reach the outside world.'
              : 'The CPU alone. Memory and peripherals must be added around it and connected by a bus.'
          }
        />
      }
    >
      <svg viewBox="0 0 320 150" className="w-full max-w-[460px] mx-auto" role="presentation">
        {mcu ? (
          <g>
            <rect
              x="70"
              y="20"
              width="180"
              height="110"
              rx="6"
              fill="var(--dip-body)"
              stroke="var(--plastic-edge)"
            />
            {['CPU', 'MEMORY', 'I/O'].map((label, i) => (
              <g key={label}>
                <rect
                  x={86}
                  y={34 + i * 30}
                  width={148}
                  height={24}
                  rx="3"
                  fill="rgba(255,255,255,0.1)"
                  stroke="rgba(255,255,255,0.25)"
                />
                <text
                  x={160}
                  y={50 + i * 30}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill="#fff"
                  style={{ letterSpacing: '0.1em' }}
                >
                  {label}
                </text>
              </g>
            ))}
            <text
              x="160"
              y="144"
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              fill="var(--ink-3)"
              style={{ letterSpacing: '0.14em' }}
            >
              ONE CHIP · CPU + MEMORY + I/O
            </text>
          </g>
        ) : (
          <g>
            <rect x="126" y="46" width="68" height="52" rx="5" fill="var(--dip-body)" stroke="var(--plastic-edge)" />
            <text x="160" y="76" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" style={{ letterSpacing: '0.08em' }}>
              CPU
            </text>
            {[
              { x: 16, y: 30, label: 'RAM' },
              { x: 16, y: 88, label: 'STORAGE' },
              { x: 236, y: 30, label: 'I/O CTRL' },
              { x: 236, y: 88, label: 'TIMERS' },
            ].map((b) => (
              <g key={b.label}>
                <rect
                  x={b.x}
                  y={b.y}
                  width="68"
                  height="34"
                  rx="4"
                  fill="var(--plastic-raised)"
                  stroke="var(--plastic-edge)"
                  strokeWidth="1.5"
                />
                <text
                  x={b.x + 34}
                  y={b.y + 21}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="700"
                  fill="var(--ink-2)"
                  style={{ letterSpacing: '0.08em' }}
                >
                  {b.label}
                </text>
              </g>
            ))}
            <path
              d="M84 47h42M84 105h42M236 47h-42M236 105h-42M126 72H108M212 72h-18"
              stroke="var(--ink-faint)"
              strokeWidth="1.6"
              fill="none"
              strokeDasharray="3 3"
            />
            <text
              x="160"
              y="144"
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              fill="var(--ink-3)"
              style={{ letterSpacing: '0.14em' }}
            >
              CPU SEPARATE FROM MEMORY AND PERIPHERALS
            </text>
          </g>
        )}
      </svg>
    </FigureFrame>
  )
}

/* --------------------------------------------- the comparison slider --- */

const SIDES = {
  mcu: {
    name: 'Microcontroller',
    rows: [
      ['Purpose', 'Specific control tasks in embedded systems'],
      ['Integration', 'CPU, memory and I/O built into one chip'],
      ['Memory', 'Built-in Flash/ROM and RAM'],
      ['I/O peripherals', 'Built-in I/O ports, ADC, DAC, timers'],
      ['Power use', 'Low power consumption'],
      ['Cost', 'Low cost'],
      ['Complexity', 'Simple and task-specific'],
      ['Examples', 'Arduino, ESP32, AVR'],
    ],
  },
  mpu: {
    name: 'Microprocessor',
    rows: [
      ['Purpose', 'General-purpose computing'],
      ['Integration', 'CPU separate from memory and peripherals'],
      ['Memory', 'Needs external memory'],
      ['I/O peripherals', 'Needs external components for I/O'],
      ['Power use', 'Higher power consumption'],
      ['Cost', 'High cost'],
      ['Complexity', 'Complex and powerful'],
      ['Examples', 'Intel Core, AMD Ryzen'],
    ],
  },
}

export function ComparisonScaleFigure({ description }: { description: string }) {
  const [pos, setPos] = useState(0)
  const side = pos < 50 ? 'mcu' : 'mpu'
  const data = SIDES[side]

  return (
    <FigureFrame
      legend="Slide between the two"
      description={description}
      controls={
        <VizSlider
          label="Microcontroller  ←→  Microprocessor"
          value={pos}
          min={0}
          max={100}
          onChange={setPos}
          colour={side === 'mcu' ? 'var(--wire-green)' : 'var(--wire-orange)'}
          hint={
            side === 'mcu'
              ? 'Everything integrated on one chip. Every property below follows from that.'
              : 'The CPU on its own. Every property below follows from needing external parts.'
          }
        />
      }
    >
      <div aria-live="polite">
        <h3
          className="text-plain font-semibold mb-3"
          style={{ color: side === 'mcu' ? 'var(--wire-green)' : 'var(--wire-orange)' }}
        >
          {data.name}
        </h3>
        <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-0">
          {data.rows.map(([aspect, value]) => (
            <div
              key={aspect}
              className="flex gap-3 py-2 border-b border-plastic-edge last:border-0 sm:[&:nth-last-child(2)]:border-0"
            >
              <dt className="silk w-[92px] shrink-0 pt-0.5">{aspect}</dt>
              <dd className="text-small text-ink-2 leading-snug">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </FigureFrame>
  )
}

/* ------------------------------------------------------ HIGH and LOW --- */

export function HighLowFigure({ description }: { description: string }) {
  const [high, setHigh] = useState(false)

  return (
    <FigureFrame
      legend="A digital pin has two states"
      description={description}
      controls={
        <VizToggle
          label="Pin 13"
          on={high}
          onChange={setHigh}
          onLabel="HIGH · 5V"
          offLabel="LOW · 0V"
          hint="There is nothing in between. digitalWrite() can only choose one of these two."
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="flex gap-3">
          {[
            { label: 'HIGH', v: '5V', on: high, colour: 'var(--signal-high)' },
            { label: 'LOW', v: '0V', on: !high, colour: 'var(--signal-low)' },
          ].map((s) => (
            <div
              key={s.label}
              className={cx(
                'flex-1 sm:w-[104px] rounded-md border-2 p-3 text-center transition-all duration-150',
              )}
              style={{
                borderColor: s.on ? s.colour : 'var(--plastic-edge)',
                background: s.on
                  ? `color-mix(in srgb, ${s.colour} 12%, var(--plastic-raised))`
                  : 'var(--plastic)',
              }}
            >
              <div
                className="silk-lg mb-1"
                style={{ color: s.on ? s.colour : 'var(--ink-faint)' }}
              >
                {s.label}
              </div>
              <div
                className="num text-h4 font-bold"
                style={{ color: s.on ? s.colour : 'var(--ink-faint)' }}
              >
                {s.v}
              </div>
              {s.on && (
                <div className="silk mt-1 flex items-center justify-center gap-1.5" style={{ color: s.colour }}>
                  <span
                    aria-hidden
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ background: s.colour }}
                  />
                  now
                </div>
              )}
            </div>
          ))}
        </div>

        <svg viewBox="0 0 300 90" className="w-full" role="presentation">
          <line x1="26" y1="70" x2="292" y2="70" stroke="var(--plastic-edge)" strokeWidth="1.5" />
          <line x1="26" y1="22" x2="292" y2="22" stroke="var(--plastic-edge)" strokeWidth="1.5" strokeDasharray="3 4" />
          <text x="20" y="26" textAnchor="end" fontSize="10" fontWeight="700" fill="var(--signal-high)" className="num">
            5V
          </text>
          <text x="20" y="74" textAnchor="end" fontSize="10" fontWeight="700" fill="var(--signal-low)" className="num">
            0V
          </text>
          {/* a square wave that ends in the current state */}
          <path
            d={`M26 70 L70 70 L70 22 L114 22 L114 70 L158 70 L158 22 L202 22 L202 70 L246 70 L246 ${
              high ? 22 : 70
            } L292 ${high ? 22 : 70}`}
            fill="none"
            stroke={high ? 'var(--signal-high)' : 'var(--signal-low)'}
            strokeWidth="2.5"
            strokeLinejoin="miter"
            className="transition-all duration-150"
          />
          <circle cx="292" cy={high ? 22 : 70} r="4" fill={high ? 'var(--signal-high)' : 'var(--signal-low)'} />
        </svg>
      </div>
    </FigureFrame>
  )
}
