import { useEffect, useId, useRef, useState } from 'react'
import { FigureFrame, VizSlider, VizToggle } from './Frame'
import { Silk } from '@/components/ui'

/* Figures for module 5 and the sensor-based practicals. */

/* ------------------------------------------------- the sensor chain --- */

export function SensorChainFigure({ description }: { description: string }) {
  const [temp, setTemp] = useState(28)
  const volts = (temp * 10) / 1000
  const reading = Math.round((volts / 5) * 1023)

  const stages = [
    { label: 'Physical world', value: `${temp} °C`, note: 'The thing you actually care about.' },
    { label: 'The sensor', value: `${volts.toFixed(2)} V`, note: 'Turns it into a voltage. 10 mV per °C.' },
    { label: 'The ADC', value: `${reading}`, note: 'Turns the voltage into a whole number, 0 to 1023.' },
    {
      label: 'Your variable',
      value: `int reading = ${reading};`,
      note: 'Now the program can compare it, add to it, or decide with it.',
    },
  ]

  return (
    <FigureFrame
      legend="From the world to a variable"
      description={description}
      controls={
        <VizSlider
          label="Temperature in the room"
          value={temp}
          min={0}
          max={60}
          unit="°C"
          onChange={setTemp}
          hint="Every sensor works this way. Only the first two stages differ from one sensor to the next."
        />
      }
    >
      <ol className="grid gap-2 sm:grid-cols-4">
        {stages.map((s, i) => (
          <li
            key={s.label}
            className="relative rounded-md border border-plastic-edge bg-plastic-raised p-3"
            style={{ borderTopWidth: 3, borderTopColor: 'var(--signal-analog)' }}
          >
            <Silk className="block mb-1">
              {i + 1} · {s.label}
            </Silk>
            <p className="num text-body font-semibold mb-1.5 break-words" aria-live="polite">
              {s.value}
            </p>
            <p className="text-meta text-ink-3 leading-snug">{s.note}</p>
            {i < stages.length - 1 && (
              <span
                aria-hidden
                className="hidden sm:block absolute top-1/2 -right-[13px] text-ink-faint text-small"
              >
                →
              </span>
            )}
          </li>
        ))}
      </ol>
    </FigureFrame>
  )
}

/* --------------------------------------------------- ultrasonic ------- */

export function UltrasonicFigure({ description }: { description: string }) {
  const [distance, setDistance] = useState(120)
  // Speed of sound ~343 m/s. Round trip time in microseconds.
  const timeUs = Math.round((distance / 100 / 343) * 2 * 1_000_000)

  const objX = 70 + (distance / 300) * 200

  return (
    <FigureFrame
      legend="Measuring distance with sound"
      description={description}
      controls={
        <VizSlider
          label="Distance to the object"
          value={distance}
          min={10}
          max={300}
          unit="cm"
          onChange={setDistance}
          hint={`The sound must travel there and back, so the round trip is ${(distance * 2)} cm. At about 343 m/s that takes ${timeUs} microseconds.`}
        />
      }
    >
      <svg viewBox="0 0 320 130" className="w-full" role="presentation">
        {/* sensor */}
        <rect x="6" y="38" width="56" height="52" rx="4" fill="var(--pcb)" />
        <circle cx="22" cy="54" r="11" fill="#2b3138" />
        <circle cx="22" cy="54" r="7" fill="#4c565e" />
        <circle cx="46" cy="54" r="11" fill="#2b3138" />
        <circle cx="46" cy="54" r="7" fill="#4c565e" />
        <text x="22" y="82" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#fff">
          TRIG
        </text>
        <text x="46" y="82" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#fff">
          ECHO
        </text>

        {/* outgoing wavefronts */}
        {[0, 1, 2].map((i) => (
          <path
            key={`out${i}`}
            d={`M${72 + i * 16} 38 Q${80 + i * 16} 54 ${72 + i * 16} 70`}
            fill="none"
            stroke="var(--signal-high)"
            strokeWidth="2"
            opacity={0.85 - i * 0.2}
          />
        ))}
        {/* returning wavefronts */}
        {[0, 1, 2].map((i) => (
          <path
            key={`in${i}`}
            d={`M${objX - 18 - i * 16} 86 Q${objX - 26 - i * 16} 100 ${objX - 18 - i * 16} 114`}
            fill="none"
            stroke="var(--wire-blue)"
            strokeWidth="2"
            opacity={0.85 - i * 0.2}
            transform={`scale(-1 1) translate(${-2 * (objX - 18)} 0)`}
          />
        ))}

        {/* travel lines */}
        <path
          d={`M64 50H${objX - 10}`}
          stroke="var(--signal-high)"
          strokeWidth="2.5"
          className="current-flow"
          fill="none"
        />
        <path
          d={`M${objX - 10} 78H64`}
          stroke="var(--wire-blue)"
          strokeWidth="2.5"
          className="current-flow"
          fill="none"
        />

        {/* object */}
        <rect
          x={objX - 10}
          y="26"
          width="18"
          height="78"
          rx="3"
          fill="var(--plastic-edge)"
          stroke="var(--ink-faint)"
          className="transition-all duration-150"
        />

        {/* dimension */}
        <path
          d={`M64 118H${objX - 10}`}
          stroke="var(--ink-faint)"
          strokeWidth="1"
          markerStart="url(#arrL)"
          markerEnd="url(#arrR)"
        />
        <text
          x={(64 + objX) / 2}
          y="114"
          textAnchor="middle"
          fontSize="9"
          fontWeight="700"
          fill="var(--ink-2)"
          className="num"
        >
          {distance} cm
        </text>
        <text x="150" y="20" fontSize="8" fontWeight="700" fill="var(--signal-high)">
          OUT · above 20 kHz
        </text>
        <text x="150" y="128" fontSize="8" fontWeight="700" fill="var(--wire-blue)">
          BACK · reflected
        </text>
        <defs>
          <marker id="arrL" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M6 0L0 3l6 3" fill="var(--ink-faint)" />
          </marker>
          <marker id="arrR" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0 0l6 3-6 3" fill="var(--ink-faint)" />
          </marker>
        </defs>
      </svg>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        {[
          { label: 'Distance', value: `${distance} cm` },
          { label: 'There and back', value: `${distance * 2} cm` },
          { label: 'Time measured', value: `${timeUs} µs` },
        ].map((s) => (
          <div key={s.label} className="rounded-sm border border-plastic-edge bg-plastic-raised py-2">
            <Silk className="block mb-0.5">{s.label}</Silk>
            <span className="num text-body font-semibold" aria-live="polite">
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </FigureFrame>
  )
}

/* ------------------------------------------------------- LM35 ---------- */

export function Lm35Figure({ description }: { description: string }) {
  const [temp, setTemp] = useState(22)
  const volts = (temp * 10) / 1000
  const reading = Math.round((volts / 5) * 1023)
  const recovered = reading * (5 / 1023) * 100

  return (
    <FigureFrame
      legend="LM35 · reading → volts → degrees"
      description={description}
      controls={
        <VizSlider
          label="Actual room temperature"
          value={temp}
          min={0}
          max={60}
          step={0.5}
          unit="°C"
          onChange={setTemp}
          hint={
            temp >= 25
              ? 'At or above the 25 °C threshold, so digitalWrite(7, HIGH) runs and the motor turns on.'
              : 'Below the 25 °C threshold, so digitalWrite(7, LOW) runs and the motor stays off.'
          }
        />
      }
    >
      <ol className="grid gap-2 sm:grid-cols-3">
        <Step
          n={1}
          code="int tempRead = analogRead(A0);"
          value={`${reading}`}
          note={`The sensor puts out ${volts.toFixed(3)} V (10 mV per °C). The ADC turns that into a number from 0 to 1023.`}
        />
        <Step
          n={2}
          code="float voltage = tempRead * (5.0 / 1023.0);"
          value={`${(reading * (5 / 1023)).toFixed(3)} V`}
          note="Undoes the ADC: scales the 0–1023 reading back to the 0–5 V range."
        />
        <Step
          n={3}
          code="float temperatureC = voltage * 100;"
          value={`${recovered.toFixed(1)} °C`}
          note="Undoes the sensor: 10 mV per °C means 1 V is 100 °C, so multiply by 100."
        />
      </ol>

      <div
        className="mt-3 rounded-md border p-3 flex items-center justify-between gap-3"
        style={{
          borderColor: temp >= 25 ? 'var(--signal-high)' : 'var(--plastic-edge)',
          background: temp >= 25 ? 'var(--no-field)' : 'var(--plastic-raised)',
        }}
        aria-live="polite"
      >
        <code className="num text-fine font-semibold">
          if (temperatureC &gt;= temp) &#123; digitalWrite(7, HIGH); &#125;
        </code>
        <span
          className="silk-lg shrink-0"
          style={{ color: temp >= 25 ? 'var(--signal-high)' : 'var(--ink-3)' }}
        >
          Motor {temp >= 25 ? 'ON' : 'OFF'}
        </span>
      </div>
    </FigureFrame>
  )
}

function Step({ n, code, value, note }: { n: number; code: string; value: string; note: string }) {
  return (
    <li className="rounded-md border border-plastic-edge bg-plastic-raised p-3">
      <Silk className="block mb-1.5">Step {n}</Silk>
      <code className="block num text-meta text-ink-2 mb-2 leading-snug break-words">{code}</code>
      <p className="num text-h4 font-bold mb-1.5" aria-live="polite">
        {value}
      </p>
      <p className="text-meta text-ink-3 leading-snug">{note}</p>
    </li>
  )
}

/* -------------------------------------------------- voltage divider --- */

export function DividerFigure({ description }: { description: string }) {
  const [lux, setLux] = useState(70)
  // Simplified but honest: LDR resistance falls as light rises.
  const ldrK = Math.max(0.2, 200 / (lux + 2))
  const fixedK = 10
  const volts = (fixedK / (ldrK + fixedK)) * 5
  const reading = Math.round((volts / 5) * 1023)

  return (
    <FigureFrame
      legend="Why the LDR needs a second resistor"
      description={description}
      controls={
        <VizSlider
          label="Light falling on the LDR"
          value={lux}
          min={0}
          max={100}
          unit="%"
          onChange={setLux}
          hint={
            reading < 200
              ? `Reading is ${reading}, which is below the threshold of 200, so the LED switches on.`
              : `Reading is ${reading}, which is 200 or above, so the LED stays off.`
          }
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
        <svg viewBox="0 0 150 190" className="w-full max-w-[170px] mx-auto" role="presentation">
          {/* 5V rail */}
          <path d="M20 16h110" stroke="var(--rail-pos)" strokeWidth="2.5" />
          <text x="136" y="20" fontSize="9" fontWeight="700" fill="var(--rail-pos)" className="num">
            5V
          </text>
          <path d="M75 16v22" stroke="var(--ink-faint)" strokeWidth="2" />

          {/* LDR */}
          <rect x="56" y="38" width="38" height="44" rx="4" fill="var(--plastic-raised)" stroke="var(--ink-faint)" strokeWidth="2" />
          <path d="M60 60q7-9 14 0t14 0" fill="none" stroke="var(--wire-yellow)" strokeWidth="2" />
          <g opacity={lux / 100}>
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M${34 - i * 5} ${46 + i * 8}l12 6`}
                stroke="var(--wire-yellow)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ))}
          </g>
          <text x="104" y="56" fontSize="8" fontWeight="700" fill="var(--ink-2)">
            LDR
          </text>
          <text x="104" y="68" fontSize="8" fill="var(--ink-3)" className="num">
            {ldrK.toFixed(1)}k
          </text>

          {/* junction to analog pin */}
          <path d="M75 82v18" stroke="var(--ink-faint)" strokeWidth="2" />
          <circle cx="75" cy="100" r="3.5" fill="var(--signal-analog)" />
          <path d="M75 100h44" stroke="var(--signal-analog)" strokeWidth="2.5" className="current-flow" />
          <text x="122" y="97" fontSize="8" fontWeight="700" fill="var(--signal-analog)">
            A0
          </text>

          {/* fixed resistor */}
          <path d="M75 100v14" stroke="var(--ink-faint)" strokeWidth="2" />
          <rect x="58" y="114" width="34" height="38" rx="4" fill="var(--resistor-body)" />
          {[122, 130, 138].map((y, i) => (
            <rect key={y} x="58" y={y} width="34" height="4" fill={['#6b4423', '#1d2329', '#c86a1c'][i]} />
          ))}
          <text x="100" y="136" fontSize="8" fontWeight="700" fill="var(--ink-2)" className="num">
            10k
          </text>

          {/* GND */}
          <path d="M75 152v14" stroke="var(--rail-neg)" strokeWidth="2" />
          <path d="M62 166h26M66 172h18M70 178h10" stroke="var(--rail-neg)" strokeWidth="2" />
        </svg>

        <div className="space-y-3">
          <div className="rounded-md border border-plastic-edge bg-plastic-raised p-3">
            <Silk className="block mb-1">Voltage at pin A0</Silk>
            <p className="num text-h4 font-bold" style={{ color: 'var(--signal-analog)' }} aria-live="polite">
              {volts.toFixed(2)} V
            </p>
            <div className="mt-2 h-2 rounded-full bg-plastic-sunk overflow-hidden">
              <div
                className="h-full transition-[width] duration-150"
                style={{ width: `${(volts / 5) * 100}%`, background: 'var(--signal-analog)' }}
              />
            </div>
          </div>
          <div className="rounded-md border border-plastic-edge bg-plastic-raised p-3">
            <Silk className="block mb-1">analogRead(A0)</Silk>
            <p className="num text-h4 font-bold" aria-live="polite">
              {reading}
            </p>
            <p className="text-meta text-ink-3 mt-1">0 is dark, 1023 is bright.</p>
          </div>
          <p className="text-fine text-ink-3 leading-relaxed">
            Without the 10 kΩ resistor there is no path to ground, so the pin has no defined voltage
            and the reading means nothing. The pair together form a divider, and that is what turns
            a changing resistance into a changing voltage.
          </p>
        </div>
      </div>
    </FigureFrame>
  )
}

/* ------------------------------------------------------- pull-up ------- */

export function PullupFigure({ description }: { description: string }) {
  const [closed, setClosed] = useState(false)

  return (
    <FigureFrame
      legend="INPUT_PULLUP with a switch"
      description={description}
      controls={
        <VizToggle
          label="Reed switch"
          on={closed}
          onChange={setClosed}
          onLabel="Closed (magnet near)"
          offLabel="Open (magnet away)"
          hint={
            closed
              ? 'The switch connects the pin straight to ground. A direct connection beats the weak pull-up, so the pin reads LOW.'
              : 'Nothing else is connected, so the internal pull-up holds the pin at 5V and it reads HIGH.'
          }
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
        <svg viewBox="0 0 170 190" className="w-full max-w-[190px] mx-auto" role="presentation">
          {/* inside the chip */}
          <rect
            x="8"
            y="8"
            width="110"
            height="86"
            rx="5"
            fill="none"
            stroke="var(--plastic-edge)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text x="14" y="22" fontSize="7" fontWeight="700" fill="var(--ink-faint)" style={{ letterSpacing: '0.1em' }}>
            INSIDE THE CHIP
          </text>

          {/* 5V */}
          <path d="M30 32h76" stroke="var(--rail-pos)" strokeWidth="2.5" />
          <text x="112" y="36" fontSize="9" fontWeight="700" fill="var(--rail-pos)" className="num">
            5V
          </text>
          <path d="M68 32v14" stroke="var(--ink-faint)" strokeWidth="2" />

          {/* pull-up resistor */}
          <rect x="53" y="46" width="30" height="34" rx="4" fill="var(--resistor-body)" />
          <text x="68" y="68" textAnchor="middle" fontSize="7" fontWeight="700" fill="#3a2f1c">
            20k
          </text>

          <path d="M68 80v22" stroke={closed ? 'var(--signal-low)' : 'var(--signal-high)'} strokeWidth="2.5" />

          {/* the pin */}
          <circle cx="68" cy="106" r="6" fill={closed ? 'var(--signal-low)' : 'var(--signal-high)'} className="transition-colors" />
          <path d="M74 106h50" stroke="var(--ink-faint)" strokeWidth="2" />
          <text x="128" y="103" fontSize="9" fontWeight="700" fill="var(--ink-2)">
            PIN 2
          </text>
          <text
            x="128"
            y="115"
            fontSize="9"
            fontWeight="700"
            fill={closed ? 'var(--signal-low)' : 'var(--signal-high)'}
            className="num"
          >
            {closed ? 'LOW' : 'HIGH'}
          </text>

          {/* switch to ground */}
          <path d="M68 112v18" stroke="var(--ink-faint)" strokeWidth="2" />
          <circle cx="68" cy="132" r="3" fill="var(--ink-faint)" />
          <path
            d={closed ? 'M68 132L68 152' : 'M68 132L86 146'}
            stroke={closed ? 'var(--signal-low)' : 'var(--ink-faint)'}
            strokeWidth="2.5"
            strokeLinecap="round"
            className="transition-all duration-150"
          />
          <circle cx="68" cy="152" r="3" fill="var(--ink-faint)" />
          <text x="94" y="145" fontSize="7.5" fill="var(--ink-3)">
            reed switch
          </text>

          {/* GND */}
          <path d="M68 155v10M56 165h24M60 171h16M64 177h8" stroke="var(--rail-neg)" strokeWidth="2" />
        </svg>

        <div className="space-y-2">
          {[
            {
              state: 'Switch open',
              read: 'HIGH',
              why: 'Nothing pulls the pin down, so the internal pull-up holds it at 5V.',
              active: !closed,
              colour: 'var(--signal-high)',
            },
            {
              state: 'Switch closed',
              read: 'LOW',
              why: 'The pin is connected straight to ground, which overrides the weak pull-up.',
              active: closed,
              colour: 'var(--signal-low)',
            },
          ].map((r) => (
            <div
              key={r.state}
              className="rounded-md border p-3 transition-all"
              style={{
                borderColor: r.active ? r.colour : 'var(--plastic-edge)',
                background: r.active ? 'var(--plastic-raised)' : 'var(--plastic)',
                opacity: r.active ? 1 : 0.62,
              }}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-small font-semibold">{r.state}</span>
                <span className="num text-small font-bold" style={{ color: r.colour }}>
                  reads {r.read}
                </span>
              </div>
              <p className="text-fine text-ink-3 leading-snug">{r.why}</p>
            </div>
          ))}
          <p className="text-fine text-ink-2 leading-relaxed pt-1">
            This is why practical 5 tests <code className="num">== LOW</code> to detect a{' '}
            <em>closed</em> door. The logic looks inverted because a pull-up inverts it.
          </p>
        </div>
      </div>
    </FigureFrame>
  )
}

/* ----------------------------------------------------------- PIR ------- */

/* The syllabus sentence this figure has to make physical: "all objects emit
   some level of IR radiation, which increases with temperature. The PIR
   sensor detects the change in IR levels when a warm object moves in front
   of it." So the interaction *is* the argument — stop dragging and the pin
   falls back to LOW, which is precisely why an automatic light gives up on
   somebody sitting still at a desk. */

const PIR_APEX = { x: 60, y: 40 }
const PIR_FLOOR = 132
const PIR_CONE = { left: 28, right: 250 }
/** The room is never at absolute zero; the sensor always sees this much. */
const PIR_BACKGROUND = 8
/** How far an object must stand out from that background to count as a body. */
const PIR_THRESHOLD = 18

/** Where the object stands, and how far its radiation rises above the room. */
function pirScene(pos: number, warm: boolean) {
  const px = 16 + (pos / 100) * 288
  if (px < PIR_CONE.left || px > PIR_CONE.right) return { px, inField: false, contrast: 0 }
  const dy = PIR_FLOOR - PIR_APEX.y
  const dist = Math.hypot(px - PIR_APEX.x, dy)
  // Warmer object, more radiation. Further away, less of it lands on the element.
  const emission = warm ? 92 : 10
  return { px, inField: true, contrast: Math.round(emission * Math.min(1, (dy / dist) ** 2)) }
}

export function PirFigure({ description }: { description: string }) {
  const [pos, setPos] = useState(50)
  const [warm, setWarm] = useState(true)
  const [moving, setMoving] = useState(false)
  const settle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(settle.current), [])

  /* Any change to the scene counts as movement for about as long as a real
     PIR holds its output. Nothing re-stirs it, so it lapses on its own. */
  function stir() {
    setMoving(true)
    clearTimeout(settle.current)
    settle.current = setTimeout(() => setMoving(false), 700)
  }

  const { px, inField, contrast } = pirScene(pos, warm)
  const level = PIR_BACKGROUND + contrast
  const detected = moving && contrast >= PIR_THRESHOLD
  const body = warm ? 'var(--wire-orange)' : 'var(--ink-faint)'

  const verdict = !inField
    ? 'Outside the cone. A PIR only sees the field of view in front of its lens — walk back into it.'
    : contrast < PIR_THRESHOLD
      ? 'A room-temperature object barely stands out from the background, so moving it changes the IR level far too little to trigger anything. Only a warm body does.'
      : moving
        ? 'A warm body is moving in view, so the IR level is changing. That change is what the sensor fires on.'
        : 'Standing still. The level is high but steady, and steady is invisible to a PIR — so the pin falls back to LOW. This is why an automatic light switches off on somebody sitting still.'

  return (
    <FigureFrame
      legend="PIR · it fires on change, not on presence"
      description={description}
      controls={
        <div className="grid gap-3 sm:grid-cols-2 sm:items-end">
          <VizSlider
            label="Walk the object across the room"
            value={pos}
            min={0}
            max={100}
            unit="%"
            onChange={(v) => {
              setPos(v)
              stir()
            }}
            colour="var(--wire-orange)"
            hint="Keep dragging and the pin stays HIGH. Let go, and watch what happens a moment later."
          />
          <VizToggle
            label="What is moving"
            on={warm}
            onChange={(v) => {
              setWarm(v)
              stir()
            }}
            onLabel="A warm body"
            offLabel="A room-temperature box"
            hint={
              warm
                ? 'A person is much warmer than the room, so they radiate far more IR than everything behind them.'
                : 'A box sits at room temperature, so it radiates almost exactly what the wall behind it does.'
            }
          />
        </div>
      }
    >
      <svg viewBox="0 0 320 152" className="w-full" role="presentation">
        {/* the ceiling it is mounted on */}
        <path d="M6 6h308" stroke="var(--plastic-edge)" strokeWidth="5" strokeLinecap="round" />
        <path d="M60 9v7" stroke="var(--ink-faint)" strokeWidth="2" />

        {/* field of view */}
        <path
          d={`M${PIR_APEX.x} ${PIR_APEX.y}L${PIR_CONE.right} ${PIR_FLOOR}H${PIR_CONE.left}Z`}
          fill="var(--wire-orange)"
          opacity="0.08"
        />
        <path
          d={`M${PIR_APEX.x} ${PIR_APEX.y}L${PIR_CONE.right} ${PIR_FLOOR}M${PIR_APEX.x} ${PIR_APEX.y}L${PIR_CONE.left} ${PIR_FLOOR}`}
          fill="none"
          stroke="var(--ink-faint)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <text x="196" y="72" fontSize="7.5" fill="var(--ink-3)">
          field of view
        </text>

        {/* the module: board, then the faceted white lens under it */}
        <rect x="40" y="16" width="40" height="10" rx="1.5" fill="var(--pcb)" />
        <text x="60" y="24" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#fff">
          PIR
        </text>
        <path d="M43 26Q60 46 77 26Z" fill="#eef0f2" stroke="var(--ink-faint)" strokeWidth="1.2" />
        <path
          d="M47 27Q60 40 73 27M52 27Q60 35 68 27M60 26v13"
          fill="none"
          stroke="var(--ink-faint)"
          strokeWidth="0.7"
          opacity="0.8"
        />

        {/* the output pin, so the state is readable from the drawing alone */}
        <path
          d="M80 21h34"
          stroke={detected ? 'var(--signal-high)' : 'var(--ink-faint)'}
          strokeWidth="2.5"
          className="transition-colors"
        />
        <text x="118" y="18" fontSize="7.5" fontWeight="700" fill="var(--ink-3)">
          OUT
        </text>
        <text
          x="118"
          y="28"
          fontSize="9.5"
          fontWeight="700"
          className="num transition-colors"
          fill={detected ? 'var(--signal-high)' : 'var(--signal-low)'}
        >
          {detected ? 'HIGH' : 'LOW'}
        </text>

        {/* radiation travelling from the object to the lens: a faint continuous
            path so the geometry is always legible, and a dashed one on top so
            it reads as radiation rather than a rod between the two */}
        {inField && (
          <>
            <path
              d={`M${px} 102L63 45`}
              stroke="var(--wire-orange)"
              strokeWidth="1.5"
              fill="none"
              opacity={Math.min(0.4, 0.06 + contrast / 260)}
            />
            <path
              d={`M${px} 102L63 45`}
              stroke="var(--wire-orange)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity={Math.min(0.9, 0.2 + contrast / 130)}
              strokeDasharray={detected ? undefined : '2 6'}
              className={detected ? 'current-flow' : undefined}
            />
          </>
        )}

        {/* floor */}
        <path d={`M6 ${PIR_FLOOR}h308`} stroke="var(--ink-faint)" strokeWidth="1.5" />

        {/* the object itself */}
        <g className="transition-all duration-150">
          {warm ? (
            <>
              <circle cx={px} cy="100" r="6" fill={body} />
              <path
                d={`M${px} 107v13M${px - 7} 113h14M${px} 120l-6 12M${px} 120l6 12`}
                stroke={body}
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : (
            <>
              <rect
                x={px - 11}
                y="108"
                width="22"
                height="24"
                rx="1.5"
                fill="var(--plastic-edge)"
                stroke="var(--ink-faint)"
                strokeWidth="1.5"
              />
              <path d={`M${px - 11} 117h22`} stroke="var(--ink-faint)" strokeWidth="1.2" />
            </>
          )}
        </g>

        {/* the IR it gives off, rising off it — kept to the far side so it
            never tangles with the path to the sensor */}
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M${px + 13} ${112 - i * 9}q4-5 8 0t8 0`}
            fill="none"
            stroke="var(--wire-orange)"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity={warm ? 0.66 - i * 0.16 : 0.14}
          />
        ))}
      </svg>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <div className="rounded-sm border border-plastic-edge bg-plastic-raised p-2.5">
          <Silk className="block mb-1">IR level at the sensor</Silk>
          <p className="num text-body font-semibold" aria-live="polite">
            {level}
            <span className="text-ink-3 text-meta ml-1">of 100</span>
          </p>
          <div className="mt-1.5 h-1.5 rounded-full bg-plastic-sunk overflow-hidden">
            <div
              className="h-full transition-[width] duration-150"
              style={{ width: `${level}%`, background: 'var(--wire-orange)' }}
            />
          </div>
        </div>
        <div className="rounded-sm border border-plastic-edge bg-plastic-raised p-2.5">
          <Silk className="block mb-1">Is that level changing?</Silk>
          <p className="text-body font-semibold" aria-live="polite">
            {moving ? 'Changing' : 'Steady'}
          </p>
          <p className="text-meta text-ink-3 mt-1 leading-snug">
            {moving ? 'Something moved just now.' : 'Nothing has moved.'}
          </p>
        </div>
        <div
          className="rounded-sm border p-2.5 transition-colors"
          style={{
            borderColor: detected ? 'var(--signal-high)' : 'var(--plastic-edge)',
            background: detected ? 'var(--no-field)' : 'var(--plastic-raised)',
          }}
        >
          <Silk className="block mb-1">Output pin</Silk>
          <p
            className="num text-body font-bold"
            style={{ color: detected ? 'var(--signal-high)' : 'var(--signal-low)' }}
            aria-live="polite"
          >
            {detected ? 'HIGH' : 'LOW'}
          </p>
          <p className="text-meta text-ink-3 mt-1 leading-snug">
            {detected ? 'Motion detected.' : 'No motion reported.'}
          </p>
        </div>
      </div>

      <p className="mt-3 text-fine text-ink-2 leading-relaxed" aria-live="polite">
        {verdict}
      </p>
    </FigureFrame>
  )
}

/* ------------------------------------------------------------ IR ------- */

/* Two parts the syllabus names outright — an IR LED to transmit and a
   photodiode to receive — and the one application it names outright, the
   line-following robot. The black line is the whole trick: it swallows the
   light instead of bouncing it back, and that absence is the reading. */

/** Enough reflection to call it a detection. */
const IR_THRESHOLD = 25

export function IrFigure({ description }: { description: string }) {
  const [cm, setCm] = useState(6)
  const [white, setWhite] = useState(true)

  // Light spreads as it travels, so the return falls off with distance; a
  // black surface absorbs most of what reaches it either way.
  const reflectivity = white ? 1 : 0.12
  const strength = Math.round((reflectivity * 100) / (1 + (cm / 8) ** 2))
  const detected = strength >= IR_THRESHOLD

  // A real module's emitter and receiver sit millimetres apart while the
  // surface is centimetres away, so the light path is a narrow V, not a wide
  // one. Drawing it wide would teach the wrong shape.
  const surfaceY = 68 + (cm / 20) * 58
  const groundTop = surfaceY + 8
  const groundH = Math.max(0, 138 - groundTop)
  const hitX = 160

  const verdict = !white
    ? 'The black line absorbs the infrared instead of bouncing it back, so almost nothing returns. That absence is exactly how a line-following robot knows it is still on the line.'
    : detected
      ? 'The pale floor bounces the infrared straight back into the photodiode, so the sensor reports something in front of it. On a line-following robot, this is the wheel that has drifted off the line.'
      : 'The surface reflects well, but it is too far away — the light has spread out so much on the round trip that too little comes back to cross the threshold.'

  return (
    <FigureFrame
      legend="IR · shine invisible light, watch for the bounce"
      description={description}
      controls={
        <div className="grid gap-3 sm:grid-cols-2 sm:items-end">
          <VizSlider
            label="Distance to the surface"
            value={cm}
            min={1}
            max={20}
            unit="cm"
            onChange={setCm}
            colour="var(--wire-orange)"
            hint="The further away it is, the more the reflected light has spread out before it gets back."
          />
          <VizToggle
            label="What is under the sensor"
            on={white}
            onChange={setWhite}
            onLabel="Pale floor"
            offLabel="Black line"
            hint={
              white
                ? 'A pale surface reflects most of the infrared that lands on it.'
                : 'Black paint absorbs infrared just as it absorbs visible light, so barely any returns.'
            }
          />
        </div>
      }
    >
      <svg viewBox="0 0 320 138" className="w-full" role="presentation">
        {/* the module */}
        <rect x="118" y="12" width="84" height="30" rx="3" fill="var(--pcb)" />
        <text x="160" y="26" textAnchor="middle" fontSize="7" fontWeight="700" fill="#fff">
          IR SENSOR
        </text>
        <text x="160" y="36" textAnchor="middle" fontSize="6" fill="#cfe3e3">
          obstacle / line
        </text>

        {/* IR LED — the transmitter */}
        <path d="M140 42h12v5a6 6 0 0 1-12 0Z" fill="#9fb4d0" stroke="var(--ink-faint)" strokeWidth="1" />
        <text x="134" y="50" textAnchor="end" fontSize="7.5" fontWeight="700" fill="var(--ink-2)">
          IR LED
        </text>
        <text x="134" y="59" textAnchor="end" fontSize="7" fill="var(--ink-3)">
          transmitter
        </text>

        {/* photodiode — the receiver */}
        <path d="M168 42h12v5a6 6 0 0 1-12 0Z" fill="#1b1f24" stroke="var(--ink-faint)" strokeWidth="1" />
        <text x="186" y="50" fontSize="7.5" fontWeight="700" fill="var(--ink-2)">
          photodiode
        </text>
        <text x="186" y="59" fontSize="7" fill="var(--ink-3)">
          receiver
        </text>

        {/* out, and back. The faint continuous pair keeps the V readable at
            any distance; the dashes on top are the light actually travelling. */}
        <path
          d={`M146 53L${hitX} ${surfaceY}L174 53`}
          stroke="var(--wire-orange)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.22"
        />
        <path
          d={`M146 53L${hitX} ${surfaceY}`}
          stroke="var(--wire-orange)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          className="current-flow"
        />
        <path
          d={`M${hitX} ${surfaceY}L174 53`}
          stroke="var(--wire-yellow)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity={Math.max(0.22, strength / 100)}
          strokeDasharray={detected ? undefined : '2 6'}
          className={detected ? 'current-flow' : undefined}
        />
        {/* kept up by the board: the floor rises towards the sensor as the
            distance shrinks and would bury these at close range */}
        <text x="212" y="22" fontSize="7.5" fontWeight="700" fill="var(--wire-orange)">
          OUT · infrared
        </text>
        <text x="212" y="34" fontSize="7.5" fontWeight="700" fill="var(--wire-yellow)">
          BACK · reflected
        </text>

        {/* the surface, the line painted on it, and the ground carrying both —
            drawn edge to edge so a close-up reading leaves no hole in the frame */}
        <rect
          x="0"
          y={groundTop}
          width="320"
          height={groundH}
          fill="var(--plastic)"
          className="transition-all duration-150"
        />
        {Array.from({ length: Math.min(3, Math.floor(groundH / 15)) }, (_, row) =>
          Array.from({ length: 11 }, (_, i) => (
            <path
              key={`${row}-${i}`}
              d={`M${(row % 2 ? 20 : 6) + i * 30} ${groundTop + 4 + row * 15}l8 8`}
              stroke="var(--ink-faint)"
              strokeWidth="1"
              opacity="0.2"
            />
          )),
        )}
        <rect
          x="0"
          y={surfaceY}
          width="320"
          height="8"
          fill="#cfd4d9"
          className="transition-all duration-150"
        />
        {!white && (
          <rect
            x="128"
            y={surfaceY}
            width="64"
            height="8"
            fill="#14181c"
            className="transition-all duration-150"
          />
        )}
        <path
          d={`M0 ${surfaceY}h320`}
          stroke="var(--ink-faint)"
          strokeWidth="1"
          className="transition-all duration-150"
        />
        <text
          x="10"
          y={surfaceY + 6}
          fontSize="7.5"
          fontWeight="600"
          fill="#46535f"
          className="transition-all duration-150"
        >
          floor
        </text>

        {/* how far down it is */}
        <path
          d={`M56 53h8M56 ${surfaceY}h8M60 53V${surfaceY}`}
          stroke="var(--ink-faint)"
          strokeWidth="1"
          className="transition-all duration-150"
        />
        <text
          x="52"
          y={(53 + surfaceY) / 2 + 3}
          textAnchor="end"
          fontSize="8.5"
          fontWeight="700"
          fill="var(--ink-2)"
          className="num"
        >
          {cm} cm
        </text>
      </svg>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <div className="rounded-sm border border-plastic-edge bg-plastic-raised p-2.5">
          <Silk className="block mb-1">Sent out by the IR LED</Silk>
          <p className="num text-body font-semibold">100</p>
          <p className="text-meta text-ink-3 mt-1 leading-snug">Always the same. Only the return varies.</p>
        </div>
        <div className="rounded-sm border border-plastic-edge bg-plastic-raised p-2.5">
          <Silk className="block mb-1">Back at the photodiode</Silk>
          <p className="num text-body font-semibold" aria-live="polite">
            {strength}
            <span className="text-ink-3 text-meta ml-1">needs {IR_THRESHOLD}</span>
          </p>
          <div className="mt-1.5 h-1.5 rounded-full bg-plastic-sunk overflow-hidden relative">
            <div
              className="h-full transition-[width] duration-150"
              style={{ width: `${strength}%`, background: 'var(--wire-orange)' }}
            />
            <span
              aria-hidden
              className="absolute inset-y-0 w-px bg-ink-faint"
              style={{ left: `${IR_THRESHOLD}%` }}
            />
          </div>
        </div>
        <div
          className="rounded-sm border p-2.5 transition-colors"
          style={{
            borderColor: detected ? 'var(--signal-high)' : 'var(--plastic-edge)',
            background: detected ? 'var(--no-field)' : 'var(--plastic-raised)',
          }}
        >
          <Silk className="block mb-1">What the sensor reports</Silk>
          <p
            className="text-body font-bold"
            style={{ color: detected ? 'var(--signal-high)' : 'var(--signal-low)' }}
            aria-live="polite"
          >
            {detected ? 'Object there' : 'Nothing there'}
          </p>
          <p className="text-meta text-ink-3 mt-1 leading-snug">
            {detected ? 'Enough came back.' : 'Too little came back.'}
          </p>
        </div>
      </div>

      <p className="mt-3 text-fine text-ink-2 leading-relaxed" aria-live="polite">
        {verdict}
      </p>
    </FigureFrame>
  )
}

/* ------------------------------------------------------------ gas ------ */

/* The syllabus asks for this one as a chain: the target gas contacts the
   sensor's surface, a chemical reaction occurs, that reaction changes an
   electrical property such as resistance, and the microcontroller measures
   the change. Four stages, four things to see moving. */

/** Fixed scatter, so molecules do not jump about every time the slider moves. */
const GAS_MOTES: [number, number][] = [
  [28, 32], [54, 50], [76, 24], [98, 44], [120, 34], [146, 52],
  [168, 26], [190, 46], [212, 32], [238, 52], [262, 28], [286, 44],
  [40, 56], [66, 38], [88, 54], [110, 22], [134, 42], [158, 56],
  [180, 36], [204, 52], [228, 24], [250, 42], [274, 54], [298, 34],
]

const GAS_ALARM = 500

export function GasFigure({ description }: { description: string }) {
  const [ppm, setPpm] = useState(60)
  const capId = useId().replace(/:/g, '')

  // A metal-oxide surface loses resistance as more gas reacts on it. The
  // sensor sits in a divider with a fixed 10 kΩ load, so falling resistance
  // means a rising voltage on the pin.
  const rs = 20 / (1 + (ppm / 220) ** 0.85)
  const volts = (5 * 10) / (rs + 10)
  const reading = Math.round((volts / 5) * 1023)
  const alarm = reading >= GAS_ALARM
  const motes = Math.round((ppm / 1000) * GAS_MOTES.length)

  return (
    <FigureFrame
      legend="Gas · a reaction the Arduino can measure"
      description={description}
      controls={
        <VizSlider
          label="Target gas in the air"
          value={ppm}
          min={0}
          max={1000}
          step={10}
          unit=" ppm"
          onChange={setPpm}
          colour="var(--wire-green)"
          hint={
            alarm
              ? `Reading is ${reading}, at or above the alarm threshold of ${GAS_ALARM}, so the buzzer sounds.`
              : `Reading is ${reading}, below the alarm threshold of ${GAS_ALARM}, so nothing happens yet.`
          }
        />
      }
    >
      <svg viewBox="0 0 320 158" className="w-full" role="presentation">
        <defs>
          <clipPath id={`${capId}-cap`}>
            <path d="M124 104V84a36 22 0 0 1 72 0v20Z" />
          </clipPath>
        </defs>

        {/* the gas in the room */}
        <text x="8" y="14" fontSize="7.5" fontWeight="700" fill="var(--wire-green)">
          THE GAS · CO, CH₄, propane, alcohol
        </text>
        {GAS_MOTES.slice(0, motes).map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="3.2" fill="var(--wire-green)" opacity="0.75" />
            <circle cx={x + 4} cy={y + 3} r="2" fill="var(--wire-green)" opacity="0.45" />
          </g>
        ))}

        {/* the steel mesh cap, with its mesh held inside its own outline */}
        <path
          d="M124 104V84a36 22 0 0 1 72 0v20Z"
          fill="var(--plastic-sunk)"
          stroke="var(--ink-faint)"
          strokeWidth="1.5"
        />
        <g clipPath={`url(#${capId}-cap)`}>
          {[132, 142, 152, 162, 172, 182, 192].map((x) => (
            <path key={x} d={`M${x} 104V58`} stroke="var(--ink-faint)" strokeWidth="0.7" opacity="0.6" />
          ))}
          {[70, 78, 86, 94, 102].map((y) => (
            <path key={y} d={`M120 ${y}h80`} stroke="var(--ink-faint)" strokeWidth="0.7" opacity="0.6" />
          ))}
        </g>

        {/* the heated sensing surface, and the reaction happening on it */}
        <rect x="142" y="84" width="36" height="7" rx="1" fill="var(--wire-orange)" opacity="0.9" />
        <path
          d="M142 96q4-5 8 0t8 0t8 0t8 0"
          fill="none"
          stroke="var(--wire-orange)"
          strokeWidth="1.4"
          opacity="0.7"
        />
        {Array.from({ length: Math.min(6, Math.ceil(motes / 2)) }, (_, i) => (
          <circle key={i} cx={146 + i * 6} cy="82" r="1.8" fill="var(--signal-high)" opacity="0.9" />
        ))}
        <text x="204" y="84" fontSize="7" fontWeight="700" fill="var(--ink-2)">
          heated surface
        </text>
        <text x="204" y="93" fontSize="7" fill="var(--ink-3)">
          the reaction happens here
        </text>

        {/* gas working its way in through the mesh — drawn last so the cap
            does not hide the one thing this stage is about */}
        {motes > 0 &&
          [136, 160, 184].map((x) => (
            <path
              key={x}
              d={`M${x} 62v20`}
              stroke="var(--wire-green)"
              strokeWidth="2"
              strokeLinecap="round"
              className="current-flow"
              fill="none"
            />
          ))}

        {/* the board, and the changed resistance leaving it */}
        <rect x="112" y="104" width="96" height="14" rx="2" fill="var(--pcb)" />
        <text x="160" y="114" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#fff">
          GAS SENSOR
        </text>
        {[128, 152, 176, 192].map((x) => (
          <rect key={x} x={x} y="118" width="3" height="7" rx="0.5" fill="var(--pcb-pad)" />
        ))}

        <path
          d="M160 125v10h84"
          fill="none"
          stroke="var(--signal-analog)"
          strokeWidth="2.5"
          className="current-flow"
        />
        <text x="248" y="132" fontSize="8" fontWeight="700" fill="var(--signal-analog)">
          A0
        </text>
        <text x="248" y="143" fontSize="9" fontWeight="700" fill="var(--ink-2)" className="num">
          {reading}
        </text>

        {/* resistance, the electrical property that actually changed */}
        <text x="16" y="118" fontSize="7.5" fontWeight="700" fill="var(--ink-3)">
          RESISTANCE
        </text>
        <text x="16" y="134" fontSize="13" fontWeight="700" fill="var(--ink)" className="num">
          {rs.toFixed(1)} kΩ
        </text>
        <rect x="16" y="140" width="80" height="5" rx="2.5" fill="var(--plastic-sunk)" />
        <rect
          x="16"
          y="140"
          width={Math.max(2, (rs / 20) * 80)}
          height="5"
          rx="2.5"
          fill="var(--wire-orange)"
          className="transition-all duration-150"
        />
      </svg>

      <ol className="mt-3 grid gap-2 sm:grid-cols-3">
        {[
          {
            n: 1,
            label: 'The gas reaches the surface',
            value: `${ppm} ppm`,
            note: 'The target gas comes into contact with the sensor’s surface.',
          },
          {
            n: 2,
            label: 'A chemical reaction occurs',
            value: ppm > 0 ? 'Reacting' : 'Nothing to react with',
            note: 'That contact is a reaction, not just a measurement.',
          },
          {
            n: 3,
            label: 'An electrical property changes',
            value: `${rs.toFixed(1)} kΩ → ${reading}`,
            note: 'Resistance falls, so the voltage rises, and the microcontroller reads the change.',
          },
        ].map((s) => (
          <li key={s.n} className="rounded-sm border border-plastic-edge bg-plastic-raised p-2.5">
            <Silk className="block mb-1">
              Stage {s.n} · {s.label}
            </Silk>
            <p className="num text-body font-semibold mb-1 break-words" aria-live="polite">
              {s.value}
            </p>
            <p className="text-meta text-ink-3 leading-snug">{s.note}</p>
          </li>
        ))}
      </ol>

      <div
        className="mt-3 rounded-md border p-3 flex items-center justify-between gap-3 transition-colors"
        style={{
          borderColor: alarm ? 'var(--signal-high)' : 'var(--plastic-edge)',
          background: alarm ? 'var(--no-field)' : 'var(--plastic-raised)',
        }}
        aria-live="polite"
      >
        <code className="num text-fine font-semibold">
          if (analogRead(A0) &gt;= {GAS_ALARM}) &#123; digitalWrite(buzzer, HIGH); &#125;
        </code>
        <span
          className="silk-lg shrink-0"
          style={{ color: alarm ? 'var(--signal-high)' : 'var(--ink-3)' }}
        >
          Buzzer {alarm ? 'ON' : 'OFF'}
        </span>
      </div>
    </FigureFrame>
  )
}

/* ----------------------------------------------------------- RFID ------ */

/* Two components, and one word worth a mark: *passive*. The tag has no
   battery, so the reader's own radio waves have to wake it before it can
   answer. Move the tag away and it simply goes quiet — which is the whole
   idea made visible. */

/** Enough of the reader's field to wake a tag that carries no battery. */
const RFID_WAKE = 15
const RFID_UID = '4A 9C 2F 08'

export function RfidFigure({ description }: { description: string }) {
  const [cm, setCm] = useState(3)

  // The reader's field falls away quickly with distance, which is why a card
  // has to be presented rather than merely carried past.
  const power = Math.round(100 / (1 + (cm / 3) ** 2))
  const awake = power >= RFID_WAKE

  const tagX = 150 + (cm / 15) * 140
  // Where the field gives out. Drawing the waves stopping short of a distant
  // tag says "out of range" better than any label could.
  const reachCm = 3 * Math.sqrt(100 / RFID_WAKE - 1)
  const reachX = Math.min(tagX - 6, 150 + (reachCm / 15) * 140)

  return (
    <FigureFrame
      legend="RFID · the reader shouts, the tag answers"
      description={description}
      controls={
        <VizSlider
          label="How far the tag is held from the reader"
          value={cm}
          min={1}
          max={15}
          unit="cm"
          onChange={setCm}
          colour="var(--wire-blue)"
          hint={
            awake
              ? 'Close enough. The tag draws its power from the reader’s radio waves and answers with its identifier.'
              : 'Too far. The waves are too weak to power the tag, and a passive tag has no battery of its own to fall back on.'
          }
        />
      }
    >
      <svg viewBox="0 0 320 150" className="w-full" role="presentation">
        {/* the reader */}
        <rect x="12" y="34" width="66" height="82" rx="5" fill="var(--pcb)" />
        <text x="45" y="47" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#fff">
          RFID READER
        </text>
        {/* its antenna coil */}
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x={22 + i * 5}
            y={54 + i * 5}
            width={46 - i * 10}
            height={34 - i * 10}
            rx="3"
            fill="none"
            stroke="var(--pcb-pad)"
            strokeWidth="1.6"
          />
        ))}
        {/* what it managed to read */}
        <rect
          x="18"
          y="94"
          width="54"
          height="16"
          rx="2"
          fill="#0d1418"
          stroke={awake ? 'var(--wire-green)' : 'var(--ink-faint)'}
          strokeWidth="1.2"
          className="transition-colors"
        />
        <text
          x="45"
          y="105"
          textAnchor="middle"
          fontSize="7"
          fontWeight="700"
          className="num transition-colors"
          fill={awake ? 'var(--wire-green)' : 'var(--ink-faint)'}
        >
          {awake ? RFID_UID : '— — — —'}
        </text>

        {/* radio waves going out */}
        {[0, 1, 2, 3].map((i) => (
          <path
            key={`w${i}`}
            d={`M${86 + i * 17} 46Q${98 + i * 17} 75 ${86 + i * 17} 104`}
            fill="none"
            stroke="var(--wire-blue)"
            strokeWidth="2"
            opacity={Math.max(0.12, (0.85 - i * 0.16) * (power / 100 + 0.35))}
            className="transition-opacity"
          />
        ))}
        <path
          d={`M80 62H${reachX}`}
          fill="none"
          stroke="var(--wire-blue)"
          strokeWidth="2.5"
          className="current-flow"
        />

        {/* the identifier coming back */}
        {awake && (
          <path
            d={`M${tagX - 6} 90H80`}
            fill="none"
            stroke="var(--wire-green)"
            strokeWidth="2.5"
            className="current-flow"
          />
        )}

        <text x="96" y="30" fontSize="7.5" fontWeight="700" fill="var(--wire-blue)">
          OUT · radio waves
        </text>
        <text
          x="96"
          y="126"
          fontSize="7.5"
          fontWeight="700"
          fill={awake ? 'var(--wire-green)' : 'var(--ink-faint)'}
          className="transition-colors"
        >
          {awake ? 'BACK · its unique identifier' : 'nothing comes back'}
        </text>

        {/* the tag */}
        <g className="transition-all duration-150">
          <rect
            x={tagX - 6}
            y="52"
            width="46"
            height="44"
            rx="4"
            fill="var(--plastic-raised)"
            stroke={awake ? 'var(--wire-green)' : 'var(--ink-faint)'}
            strokeWidth="1.5"
          />
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={tagX + i * 4}
              y={60 + i * 4}
              width={34 - i * 8}
              height={28 - i * 8}
              rx="2"
              fill="none"
              stroke={awake ? 'var(--wire-green)' : 'var(--ink-faint)'}
              strokeWidth="1.4"
              opacity={awake ? 1 : 0.55}
              className="transition-colors"
            />
          ))}
          <rect x={tagX + 14} y="70" width="10" height="8" rx="1" fill="var(--dip-body)" />
        </g>
        <text x={tagX + 17} y="110" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="var(--ink-2)">
          RFID TAG
        </text>
        <text x={tagX + 17} y="119" textAnchor="middle" fontSize="7" fill="var(--ink-3)">
          passive · no battery
        </text>

        {/* the gap between them */}
        <path
          d={`M80 138H${tagX - 6}M80 133v10M${tagX - 6} 133v10`}
          stroke="var(--ink-faint)"
          strokeWidth="1"
        />
        <text
          x={(80 + tagX) / 2}
          y="135"
          textAnchor="middle"
          fontSize="8.5"
          fontWeight="700"
          fill="var(--ink-2)"
          className="num"
        >
          {cm} cm
        </text>
      </svg>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <div className="rounded-sm border border-plastic-edge bg-plastic-raised p-2.5">
          <Silk className="block mb-1">Power reaching the tag</Silk>
          <p className="num text-body font-semibold" aria-live="polite">
            {power}
            <span className="text-ink-3 text-meta ml-1">needs {RFID_WAKE}</span>
          </p>
          <div className="mt-1.5 h-1.5 rounded-full bg-plastic-sunk overflow-hidden relative">
            <div
              className="h-full transition-[width] duration-150"
              style={{ width: `${power}%`, background: 'var(--wire-blue)' }}
            />
            <span
              aria-hidden
              className="absolute inset-y-0 w-px bg-ink-faint"
              style={{ left: `${RFID_WAKE}%` }}
            />
          </div>
        </div>
        <div className="rounded-sm border border-plastic-edge bg-plastic-raised p-2.5">
          <Silk className="block mb-1">The tag</Silk>
          <p className="text-body font-semibold" aria-live="polite">
            {awake ? 'Powered up' : 'Dead quiet'}
          </p>
          <p className="text-meta text-ink-3 mt-1 leading-snug">
            {awake ? 'Running on the reader’s waves.' : 'No battery, no power, no answer.'}
          </p>
        </div>
        <div
          className="rounded-sm border p-2.5 transition-colors"
          style={{
            borderColor: awake ? 'var(--wire-green)' : 'var(--plastic-edge)',
            background: awake ? 'var(--ok-field)' : 'var(--plastic-raised)',
          }}
        >
          <Silk className="block mb-1">What the reader gets</Silk>
          <p
            className="num text-body font-bold"
            style={{ color: awake ? 'var(--ok)' : 'var(--ink-3)' }}
            aria-live="polite"
          >
            {awake ? RFID_UID : '—'}
          </p>
          <p className="text-meta text-ink-3 mt-1 leading-snug">
            {awake ? 'A unique identifier.' : 'Nothing to identify.'}
          </p>
        </div>
      </div>

      <p className="mt-3 text-fine text-ink-2 leading-relaxed" aria-live="polite">
        {awake
          ? 'The reader emits radio waves; the tag is close enough to be powered by them, so it answers with the unique identifier it carries. Those two devices are the whole system.'
          : 'The reader is still emitting, but the tag is out of reach of its field. A passive tag carries no battery, so out of range it cannot answer at all — which is why a card has to be presented rather than merely carried past.'}
      </p>
    </FigureFrame>
  )
}

/* --------------------------------------------------- accelerometer ----- */

/* "Measures acceleration forces along three axes: X, Y and Z." Three is the
   number the exam wants, so the figure gives a student three numbers they can
   move independently and watch never stop summing to a single g. */

const ACC = { cx: 160, cy: 72, w: 52, h: 32 }
/* Camera. The yaw matters as much as the tilt: looking square-on, the in-plane
   Y axis and the out-of-plane Z axis both project to the same vertical line,
   and a figure whose whole point is *three* axes would show two. */
const ACC_VIEW = (58 * Math.PI) / 180
const ACC_YAW = (32 * Math.PI) / 180

/** Standard tilt equations: at rest the three axes always resolve to one g. */
function accelAt(pitch: number, roll: number) {
  const [p, r] = [(pitch * Math.PI) / 180, (roll * Math.PI) / 180]
  return {
    x: Math.cos(p) * Math.sin(r),
    y: Math.sin(p),
    z: Math.cos(p) * Math.cos(r),
  }
}

/** Rotate a point on the board, then flatten it onto the screen. */
function accelProject([x, y, z]: [number, number, number], pitch: number, roll: number) {
  const [p, r] = [(pitch * Math.PI) / 180, (roll * Math.PI) / 180]
  const [cp, sp, cr, sr] = [Math.cos(p), Math.sin(p), Math.cos(r), Math.sin(r)]
  const wx = cr * x - sr * z
  const wy = -sp * sr * x + cp * y - sp * cr * z
  const wz = cp * sr * x + sp * y + cp * cr * z
  // Swing the scene round, then tip the camera down over it.
  const vx = wx * Math.cos(ACC_YAW) - wy * Math.sin(ACC_YAW)
  const vy = wx * Math.sin(ACC_YAW) + wy * Math.cos(ACC_YAW)
  return [
    ACC.cx + vx,
    ACC.cy - (vy * Math.cos(ACC_VIEW) + wz * Math.sin(ACC_VIEW)),
  ] as [number, number]
}

function arrowHead(from: [number, number], to: [number, number], size = 5) {
  const a = Math.atan2(to[1] - from[1], to[0] - from[0])
  const wing = (t: number) => `${to[0] - size * Math.cos(a - t)},${to[1] - size * Math.sin(a - t)}`
  return `${to[0]},${to[1]} ${wing(0.45)} ${wing(-0.45)}`
}

export function AccelFigure({ description }: { description: string }) {
  const [pitch, setPitch] = useState(0)
  const [roll, setRoll] = useState(0)

  const g = accelAt(pitch, roll)
  const centre = accelProject([0, 0, 0], pitch, roll)
  const corners = (
    [
      [-ACC.w, -ACC.h, 0],
      [ACC.w, -ACC.h, 0],
      [ACC.w, ACC.h, 0],
      [-ACC.w, ACC.h, 0],
    ] as [number, number, number][]
  ).map((c) => accelProject(c, pitch, roll))

  const axes = [
    { key: 'X', end: accelProject([74, 0, 0], pitch, roll), colour: 'var(--wire-red)', value: g.x },
    { key: 'Y', end: accelProject([0, 58, 0], pitch, roll), colour: 'var(--wire-green)', value: g.y },
    { key: 'Z', end: accelProject([0, 0, 50], pitch, roll), colour: 'var(--wire-blue)', value: g.z },
  ]

  const dominant = Math.abs(g.z) > 0.95
    ? 'Lying flat. Almost the whole 1 g sits on Z, and X and Y read close to nothing.'
    : Math.abs(g.x) > 0.95
      ? 'Rolled onto its side. Gravity has moved almost entirely onto X.'
      : Math.abs(g.y) > 0.95
        ? 'Standing on end. Gravity has moved almost entirely onto Y.'
        : 'Tilted. Gravity is now split across all three axes at once — and however you turn it, the three always resolve to the same single g.'

  return (
    <FigureFrame
      legend="Accelerometer · three axes, X, Y and Z"
      description={description}
      controls={
        <div className="grid gap-3 sm:grid-cols-2 sm:items-end">
          <VizSlider
            label="Tilt it forward and back"
            value={pitch}
            min={-90}
            max={90}
            step={5}
            unit="°"
            onChange={setPitch}
            colour="var(--wire-green)"
            hint="Tipping it end over end moves gravity onto the Y axis."
          />
          <VizSlider
            label="Tilt it left and right"
            value={roll}
            min={-90}
            max={90}
            step={5}
            unit="°"
            onChange={setRoll}
            colour="var(--wire-red)"
            hint="Rolling it onto its side moves gravity onto the X axis."
          />
        </div>
      }
    >
      <svg viewBox="0 0 320 142" className="w-full" role="presentation">
        {/* the ground it is being held above, for a sense of which way is down */}
        <ellipse cx="160" cy="130" rx="96" ry="8" fill="var(--ink-faint)" opacity="0.14" />

        {/* the board: an underside first, so it reads as a solid at any angle */}
        <polygon
          points={corners.map(([x, y]) => `${x},${y + 5}`).join(' ')}
          fill="var(--dip-body)"
          className="transition-all duration-150"
        />
        <polygon
          points={corners.map((c) => c.join(',')).join(' ')}
          fill="var(--pcb)"
          stroke="var(--ink-faint)"
          strokeWidth="1.2"
          className="transition-all duration-150"
        />
        <circle cx={centre[0]} cy={centre[1]} r="3" fill="var(--pcb-pad)" />

        {/* the three axes it measures along */}
        {axes.map((a) => (
          <g key={a.key} className="transition-all duration-150">
            <path
              d={`M${centre[0]} ${centre[1]}L${a.end[0]} ${a.end[1]}`}
              stroke={a.colour}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <polygon points={arrowHead(centre, a.end)} fill={a.colour} />
            <text
              x={a.end[0] + (a.end[0] > centre[0] ? 7 : -7)}
              y={a.end[1] + (a.end[1] > centre[1] ? 9 : -4)}
              textAnchor={a.end[0] > centre[0] ? 'start' : 'end'}
              fontSize="10"
              fontWeight="700"
              fill={a.colour}
              className="num"
            >
              {a.key}
            </text>
          </g>
        ))}

        {/* gravity, which is the thing being shared out between them */}
        <path
          d={`M${centre[0]} ${centre[1]}v40`}
          stroke="var(--ink-2)"
          strokeWidth="2"
          strokeDasharray="3 3"
        />
        <polygon
          points={arrowHead(centre, [centre[0], centre[1] + 40])}
          fill="var(--ink-2)"
        />
        <text
          x={centre[0] + 7}
          y={centre[1] + 38}
          fontSize="8"
          fontWeight="700"
          fill="var(--ink-2)"
          className="num"
        >
          gravity · 1 g
        </text>
      </svg>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {axes.map((a) => (
          <div key={a.key} className="rounded-sm border border-plastic-edge bg-plastic-raised p-2.5">
            <Silk className="block mb-1">Axis {a.key}</Silk>
            <p
              className="num text-h4 font-bold"
              style={{ color: a.colour }}
              aria-live="polite"
            >
              {a.value >= 0 ? '+' : '−'}
              {Math.abs(a.value).toFixed(2)} g
            </p>
            {/* signed, so a reading is read off the centre rather than the end */}
            <div className="mt-1.5 h-1.5 rounded-full bg-plastic-sunk relative overflow-hidden">
              <span
                className="absolute inset-y-0 transition-all duration-150"
                style={{
                  background: a.colour,
                  left: a.value >= 0 ? '50%' : `${50 - Math.abs(a.value) * 50}%`,
                  width: `${Math.abs(a.value) * 50}%`,
                }}
              />
              <span aria-hidden className="absolute inset-y-0 left-1/2 w-px bg-ink-faint" />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-fine text-ink-2 leading-relaxed" aria-live="polite">
        {dominant} Shake it instead of tilting it and these same three numbers jump about — which is
        how one sensor covers motion detection, gesture recognition and vibration monitoring alike.
      </p>
    </FigureFrame>
  )
}
