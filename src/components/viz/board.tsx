import { useState } from 'react'
import { FigureFrame, VizSlider } from './Frame'
import { Silk, cx } from '@/components/ui'

/* The Arduino Uno, drawn to the proportions of the real board so that a
   student who later picks one up recognises it. Every labelled part is a real
   button: clickable, tabbable, and announced. */

interface Part {
  id: string
  name: string
  body: string
  detail?: string
  /** Hit region on the 420 x 300 board drawing. */
  box: [number, number, number, number]
}

const PARTS: Part[] = [
  {
    id: 'mcu',
    name: 'Microcontroller (ATmega328P)',
    body: 'The brain of the development board. It executes the program instructions and controls the behaviour of the system.',
    detail:
      'On the Uno this is the ATmega328P, an AVR chip. It handles all the processing, input/output control and program execution.',
    box: [168, 150, 108, 46],
  },
  {
    id: 'digital',
    name: 'Digital I/O pins (0–13)',
    body: 'Used to read digital signals such as ON/OFF from sensors, or to send digital signals to devices like LEDs, motors or relays.',
    detail:
      'HIGH = 5V, LOW = 0V. Controlled with pinMode(), digitalRead() and digitalWrite(). Pins marked ~ can also do PWM.',
    box: [96, 24, 300, 22],
  },
  {
    id: 'txrx',
    name: 'TX and RX (pins 1 and 0)',
    body: 'The transmitter and receiver, used for serial communication, meaning they send and receive data one bit at a time.',
    detail:
      'A phone sending an ON command over Bluetooth reaches the Arduino through RX; the confirmation goes back through TX.',
    box: [352, 24, 44, 22],
  },
  {
    id: 'analog',
    name: 'Analog pins (A0–A5)',
    body: 'Used to read varying analog signals from sensors, such as temperature or light, and convert them into digital values using the built-in ADC.',
    detail:
      'These pins read analog voltage levels from 0 to 5 volts. analogRead() returns a value from 0 to 1023.',
    box: [268, 254, 128, 22],
  },
  {
    id: 'usb',
    name: 'Communication port (USB socket)',
    body: 'Established through the USB-to-Serial converter chip present on the Arduino board. Usually USB type B or USB mini.',
    detail: 'It carries your compiled program to the board, and supplies 5V of power while connected.',
    box: [4, 52, 62, 56],
  },
  {
    id: 'barrel',
    name: 'DC barrel jack',
    body: 'An external power supply, usually 7 to 12 volts, can be connected here to power the Arduino.',
    detail:
      'The board has an onboard voltage regulator that regulates the input voltage to the required levels.',
    box: [4, 196, 62, 54],
  },
  {
    id: 'power',
    name: 'Power header (Vin, GND, 5V, 3.3V, IOREF)',
    body: 'Vin accepts an external source as the positive, with GND as the negative. IOREF provides the operating voltage reference, usually 5V or 3.3V, for the input and output pins.',
    detail:
      'GND pins act as the 0V reference point in a circuit. They complete the electrical path for current to flow and connect the negative side of components. There are several so devices can share a ground.',
    box: [120, 254, 132, 22],
  },
  {
    id: 'reset',
    name: 'Reset button',
    body: 'Used to restart the microcontroller and run the uploaded program from the beginning.',
    detail: 'It does not erase your program: the sketch stays in Flash memory and simply starts again from setup().',
    box: [88, 60, 32, 32],
  },
  {
    id: 'osc',
    name: 'Oscillator',
    body: 'Provides a clock signal that helps the microcontroller run programs at a steady speed.',
    detail:
      'It ensures the microcontroller executes instructions, communicates with peripherals and manages timing functions accurately.',
    box: [136, 168, 24, 34],
  },
  {
    id: 'onled',
    name: 'Power indicator',
    body: 'A small LED labelled ON that lights up when the board is receiving power.',
    detail: 'If you plug the board in and this stays dark, the problem is power, not your code.',
    box: [300, 106, 26, 22],
  },
  {
    id: 'aref',
    name: 'AREF pin',
    body: 'Used to provide an external reference voltage for the analog-to-digital converter (ADC).',
    detail: 'This helps improve the accuracy of analog readings from sensors.',
    box: [104, 24, 30, 22],
  },
]

export function UnoBoardFigure({ description }: { description: string }) {
  const [active, setActive] = useState<string | null>('mcu')
  const part = PARTS.find((p) => p.id === active)

  return (
    <FigureFrame legend="Arduino Uno" description={description} padded={false}>
      <div className="p-4 sm:p-6 overflow-x-auto">
        <svg
          viewBox="0 0 420 300"
          className="w-full min-w-[420px]"
          role="group"
          aria-label="Arduino Uno board diagram. Select a part to read about it."
        >
          {/* PCB */}
          <rect x="66" y="14" width="336" height="272" rx="10" fill="var(--pcb)" />
          <rect
            x="66"
            y="14"
            width="336"
            height="272"
            rx="10"
            fill="none"
            stroke="rgba(0,0,0,0.35)"
            strokeWidth="1.5"
          />
          {/* mounting holes */}
          {[
            [84, 32],
            [384, 32],
            [84, 268],
            [384, 268],
          ].map(([cx0, cy0]) => (
            <circle key={`${cx0}-${cy0}`} cx={cx0} cy={cy0} r="5" fill="var(--plastic-sunk)" />
          ))}

          {/* USB socket */}
          <rect x="4" y="52" width="62" height="56" rx="3" fill="#9aa3aa" stroke="rgba(0,0,0,0.35)" />
          <rect x="14" y="62" width="42" height="36" rx="2" fill="#4c565e" />
          {/* barrel jack */}
          <rect x="4" y="196" width="62" height="54" rx="6" fill="#1b1f24" stroke="rgba(0,0,0,0.4)" />
          <circle cx="24" cy="223" r="12" fill="#0a0d10" />
          <circle cx="24" cy="223" r="4" fill="#6d757c" />

          {/* pin headers */}
          <PinHeader x={96} y={24} count={12} label="DIGITAL (PWM ~)" />
          <PinHeader x={352} y={24} count={2} label="" />
          <PinHeader x={268} y={254} count={6} label="ANALOG IN" below />
          <PinHeader x={120} y={254} count={6} label="POWER" below />

          {/* silkscreen pin numbers */}
          {['13', '12', '~11', '~10', '~9', '8', '7', '~6', '~5', '4', '~3', '2'].map((n, i) => (
            <text
              key={n}
              x={102 + i * 24}
              y={58}
              textAnchor="middle"
              fontSize="8"
              fontWeight="700"
              fill="rgba(255,255,255,0.8)"
              className="num"
            >
              {n}
            </text>
          ))}
          {['1 TX', '0 RX'].map((n, i) => (
            <text
              key={n}
              x={358 + i * 24}
              y={58}
              textAnchor="middle"
              fontSize="7"
              fontWeight="700"
              fill="rgba(255,255,255,0.8)"
            >
              {n}
            </text>
          ))}
          {['A0', 'A1', 'A2', 'A3', 'A4', 'A5'].map((n, i) => (
            <text
              key={n}
              x={274 + i * 24}
              y={248}
              textAnchor="middle"
              fontSize="8"
              fontWeight="700"
              fill="rgba(255,255,255,0.8)"
            >
              {n}
            </text>
          ))}
          {['IOREF', 'RST', '3V3', '5V', 'GND', 'VIN'].map((n, i) => (
            <text
              key={n}
              x={126 + i * 22}
              y={248}
              textAnchor="middle"
              fontSize="6.5"
              fontWeight="700"
              fill="rgba(255,255,255,0.8)"
            >
              {n}
            </text>
          ))}
          <text x="110" y="42" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="rgba(255,255,255,0.75)">
            AREF
          </text>

          {/* the chip */}
          <rect x="168" y="150" width="108" height="46" rx="3" fill="var(--dip-body)" />
          <circle cx="178" cy="160" r="3" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          <text
            x="222"
            y="177"
            textAnchor="middle"
            fontSize="9"
            fontWeight="700"
            fill="rgba(255,255,255,0.85)"
            style={{ letterSpacing: '0.06em' }}
          >
            ATmega328P
          </text>
          {Array.from({ length: 14 }, (_, i) => (
            <g key={i}>
              <rect x={172 + i * 7.4} y={145} width="4" height="6" fill="var(--pcb-pad)" />
              <rect x={172 + i * 7.4} y={195} width="4" height="6" fill="var(--pcb-pad)" />
            </g>
          ))}

          {/* oscillator */}
          <rect x="136" y="168" width="24" height="34" rx="7" fill="#a8adb2" stroke="rgba(0,0,0,0.3)" />
          <text x="148" y="189" textAnchor="middle" fontSize="6" fontWeight="700" fill="#1b1f24">
            16
          </text>

          {/* reset button */}
          <rect x="88" y="60" width="32" height="32" rx="3" fill="#2a3138" />
          <circle cx="104" cy="76" r="9" fill="#c8ccd0" />
          <text x="104" y="104" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="rgba(255,255,255,0.75)">
            RESET
          </text>

          {/* voltage regulator */}
          <rect x="106" y="196" width="24" height="30" rx="2" fill="#2a3138" />

          {/* indicator LEDs */}
          <rect x="300" y="106" width="26" height="22" rx="2" fill="rgba(0,0,0,0.2)" />
          <circle cx="313" cy="113" r="4" fill="var(--signal-high)" />
          <text x="313" y="126" textAnchor="middle" fontSize="6" fontWeight="700" fill="rgba(255,255,255,0.8)">
            ON
          </text>
          <circle cx="313" cy="146" r="4" fill="var(--wire-yellow)" />
          <text x="313" y="158" textAnchor="middle" fontSize="6" fontWeight="700" fill="rgba(255,255,255,0.8)">
            L
          </text>

          {/* USB-to-serial chip */}
          <rect x="88" y="112" width="34" height="24" rx="2" fill="var(--dip-body)" />
          <text x="105" y="146" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="rgba(255,255,255,0.7)">
            USB→SERIAL
          </text>

          {/* hotspots on top of everything */}
          {PARTS.map((p) => {
            const on = p.id === active
            const [x, y, w, h] = p.box
            return (
              <g
                key={p.id}
                role="button"
                tabIndex={0}
                aria-pressed={on}
                aria-label={p.name}
                onClick={() => setActive(p.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setActive(p.id)
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  rx="4"
                  fill={on ? 'color-mix(in srgb, var(--pcb-select) 26%, transparent)' : 'transparent'}
                  stroke={on ? 'var(--pcb-select)' : 'rgba(255,255,255,0.28)'}
                  strokeWidth={on ? 2.5 : 1}
                  strokeDasharray={on ? undefined : '3 4'}
                  className="transition-all duration-150"
                  pointerEvents="all"
                />
              </g>
            )
          })}
        </svg>
      </div>

      <div
        className="mx-4 mb-4 sm:mx-6 sm:mb-6 rounded-md border border-plastic-edge bg-plastic-raised p-4"
        aria-live="polite"
      >
        {part ? (
          <>
            <Silk className="block mb-1.5">Selected part</Silk>
            <h3 className="text-lead font-semibold mb-2">{part.name}</h3>
            <p className="text-body text-ink-2 leading-relaxed">{part.body}</p>
            {part.detail && (
              <p className="text-small text-ink-3 leading-relaxed mt-2.5 border-l-2 border-plastic-edge pl-3">
                {part.detail}
              </p>
            )}
          </>
        ) : (
          <p className="text-body text-ink-3">
            Select a highlighted region on the board to read what it does.
          </p>
        )}
      </div>

      <div className="px-4 pb-4 sm:px-6 sm:pb-6">
        <Silk className="block mb-2">All parts</Silk>
        <div className="flex flex-wrap gap-1.5">
          {PARTS.map((p) => (
            <button
              key={p.id}
              onClick={() => setActive(p.id)}
              aria-pressed={p.id === active}
              className={cx(
                'px-2.5 h-9 rounded-sm border text-fine font-medium transition-colors',
                p.id === active
                  ? 'bg-ink text-plastic border-ink'
                  : 'bg-plastic border-plastic-edge text-ink-2 hover:border-ink-faint',
              )}
            >
              {p.name.split('(')[0].trim()}
            </button>
          ))}
        </div>
      </div>
    </FigureFrame>
  )
}

function PinHeader({
  x,
  y,
  count,
  label,
  below,
}: {
  x: number
  y: number
  count: number
  label: string
  below?: boolean
}) {
  return (
    <g>
      <rect x={x} y={y} width={count * 24} height="22" rx="2" fill="#1b1f24" />
      {Array.from({ length: count }, (_, i) => (
        <rect key={i} x={x + 8 + i * 24} y={y + 6} width="8" height="10" rx="1" fill="var(--pcb-pad)" />
      ))}
      {label && (
        <text
          x={x + (count * 24) / 2}
          y={below ? y + 34 : y - 5}
          textAnchor="middle"
          fontSize="7"
          fontWeight="700"
          fill="rgba(255,255,255,0.7)"
          style={{ letterSpacing: '0.1em' }}
        >
          {label}
        </text>
      )}
    </g>
  )
}

/* ------------------------------------------------------------- ADC ----- */

export function AdcFigure({ description }: { description: string }) {
  const [volts, setVolts] = useState(2.5)
  const reading = Math.round((volts / 5) * 1023)

  return (
    <FigureFrame
      legend="Analog-to-Digital Converter"
      description={description}
      controls={
        <VizSlider
          label="Voltage on the analog pin"
          value={volts}
          min={0}
          max={5}
          step={0.01}
          unit="V"
          onChange={setVolts}
          hint="0V reads as 0. 5V reads as 1023. Everything in between is scaled evenly across those 1024 steps."
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div className="rounded-md border border-plastic-edge bg-plastic-raised p-4 text-center">
          <Silk className="block mb-2">The real world</Silk>
          <div className="num text-3xl font-bold" style={{ color: 'var(--signal-analog)' }}>
            {volts.toFixed(2)}
            <span className="text-plain text-ink-3 ml-1">V</span>
          </div>
          <div className="mt-3 h-3 rounded-full bg-plastic-sunk overflow-hidden" style={{ boxShadow: 'var(--sink)' }}>
            <div
              className="h-full rounded-full transition-[width] duration-100"
              style={{ width: `${(volts / 5) * 100}%`, background: 'var(--signal-analog)' }}
            />
          </div>
          <p className="text-meta text-ink-3 mt-2">A smooth, continuous voltage</p>
        </div>

        <div className="flex sm:flex-col items-center justify-center gap-1.5 py-2" aria-hidden>
          <svg width="46" height="30" viewBox="0 0 46 30" className="sm:rotate-0">
            <rect x="8" y="4" width="30" height="22" rx="3" fill="var(--dip-body)" />
            <text x="23" y="19" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">
              ADC
            </text>
          </svg>
          <svg width="28" height="14" viewBox="0 0 28 14">
            <path d="M0 7h20m-4-5l5 5-5 5" fill="none" stroke="var(--ink-faint)" strokeWidth="1.6" />
          </svg>
        </div>

        <div className="rounded-md border border-plastic-edge bg-plastic-raised p-4 text-center">
          <Silk className="block mb-2">What your program gets</Silk>
          <div className="num text-3xl font-bold" aria-live="polite">
            {reading}
          </div>
          <p className="num text-meta text-ink-faint mt-1">of 1023</p>
          <div className="mt-3 flex gap-[2px] justify-center" aria-hidden>
            {Array.from({ length: 10 }, (_, i) => (
              <span
                key={i}
                className="w-2.5 h-4 rounded-[1px]"
                style={{
                  background: (reading >> (9 - i)) & 1 ? 'var(--ink)' : 'var(--plastic-sunk)',
                  boxShadow: (reading >> (9 - i)) & 1 ? undefined : 'inset 0 1px 1px rgb(0 0 0 / .3)',
                }}
              />
            ))}
          </div>
          <p className="text-meta text-ink-3 mt-2">A whole number, in 10 bits</p>
        </div>
      </div>
    </FigureFrame>
  )
}

/* ------------------------------------------------------------ power ---- */

const SOURCES = [
  {
    id: 'usb',
    name: 'USB power',
    volts: '5V',
    body: 'The most common way to power an Arduino board is through its USB port. This provides 5 volts of power to the board, which is regulated to the required voltage levels for the microcontroller and other components.',
    regulated: true,
  },
  {
    id: 'barrel',
    name: 'DC barrel jack',
    volts: '7–12V',
    body: 'You can connect an external power supply, usually 7 to 12 volts, to the barrel jack to power the Arduino. The board has an onboard voltage regulator that regulates the input voltage to the required levels.',
    regulated: true,
  },
  {
    id: 'vin',
    name: 'Vin pin',
    volts: 'within range',
    body: 'You can connect an external power source, within the specified voltage range, directly to the Vin pin as the positive and the GND pin as the negative. The onboard voltage regulator regulates the input voltage to the required levels.',
    regulated: true,
  },
]

export function PowerFigure({ description }: { description: string }) {
  const [active, setActive] = useState('usb')
  const source = SOURCES.find((s) => s.id === active)!

  return (
    <FigureFrame legend="Three ways to power the board" description={description}>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {SOURCES.map((s) => {
            const on = s.id === active
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                aria-pressed={on}
                className={cx(
                  'p-3 rounded-md border text-left transition-all min-h-[72px]',
                  on
                    ? 'bg-plastic-raised border-rail-pos shadow-[var(--lift-2)]'
                    : 'bg-plastic border-plastic-edge hover:border-ink-faint',
                )}
              >
                <span className="block text-fine font-semibold leading-tight mb-1">{s.name}</span>
                <span
                  className="num text-small font-bold"
                  style={{ color: on ? 'var(--rail-pos)' : 'var(--ink-3)' }}
                >
                  {s.volts}
                </span>
              </button>
            )
          })}
        </div>

        <svg viewBox="0 0 340 84" className="w-full" role="presentation">
          <rect x="4" y="26" width="76" height="32" rx="4" fill="var(--plastic-raised)" stroke="var(--rail-pos)" strokeWidth="2" />
          <text x="42" y="46" textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--ink)">
            {source.volts}
          </text>
          <path
            d="M80 42h44"
            stroke="var(--rail-pos)"
            strokeWidth="3"
            className="current-flow"
            strokeLinecap="round"
          />
          <rect x="124" y="20" width="86" height="44" rx="4" fill="var(--dip-body)" />
          <text x="167" y="39" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">
            VOLTAGE
          </text>
          <text x="167" y="52" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">
            REGULATOR
          </text>
          <path
            d="M210 42h44"
            stroke="var(--rail-pos)"
            strokeWidth="3"
            className="current-flow"
            strokeLinecap="round"
          />
          <rect x="254" y="26" width="82" height="32" rx="4" fill="var(--plastic-raised)" stroke="var(--plastic-edge)" strokeWidth="2" />
          <text x="295" y="40" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--ink)">
            5V steady
          </text>
          <text x="295" y="52" textAnchor="middle" fontSize="7.5" fill="var(--ink-3)">
            to the chip
          </text>
          <text x="42" y="76" textAnchor="middle" fontSize="8" fontWeight="700" fill="var(--ink-faint)" style={{ letterSpacing: '0.1em' }}>
            IN
          </text>
          <text x="295" y="76" textAnchor="middle" fontSize="8" fontWeight="700" fill="var(--ink-faint)" style={{ letterSpacing: '0.1em' }}>
            OUT
          </text>
        </svg>

        <p className="text-body text-ink-2 leading-relaxed" aria-live="polite">
          {source.body}
        </p>
      </div>
    </FigureFrame>
  )
}
