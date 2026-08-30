import { useState } from 'react'
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
