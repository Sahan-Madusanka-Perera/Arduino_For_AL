import { useState } from 'react'
import { FigureFrame } from './Frame'
import { Silk, cx } from '@/components/ui'

/* Figures for module 1. */

/* ------------------------------------------------------ the IoT loop --- */

const LOOP_STAGES = [
  {
    id: 'sense',
    label: 'Sense',
    title: 'A sensor measures the physical world',
    body: 'Sensors detect environmental factors like temperature, motion and humidity. Nothing happens in an IoT system until something is measured.',
    example: 'A soil sensor reads that the moisture level has dropped.',
  },
  {
    id: 'send',
    label: 'Send',
    title: 'The reading travels over a network',
    body: 'Devices connect through Wi-Fi, Bluetooth or other networks so data can be exchanged continuously.',
    example: 'The reading is sent over Wi-Fi to a gateway, and on to the internet.',
  },
  {
    id: 'think',
    label: 'Analyse',
    title: 'Software makes sense of it',
    body: 'Collected sensor data is analysed using algorithms to produce useful insights. This can happen on the device itself (edge) or on a remote server (cloud).',
    example: 'The system compares the reading against the level this crop needs.',
  },
  {
    id: 'act',
    label: 'Act',
    title: 'Something changes in the world',
    body: 'An actuator acts on the data, performing an action such as controlling lights or adjusting environmental conditions. Then the loop begins again.',
    example: 'A valve opens and the field is watered.',
  },
]

export function IotLoopFigure({ description }: { description: string }) {
  const [active, setActive] = useState(0)
  const stage = LOOP_STAGES[active]

  return (
    <FigureFrame legend="The IoT loop" description={description}>
      <div className="grid gap-5 md:grid-cols-[1fr_1.1fr] md:items-center">
        <svg viewBox="0 0 260 260" className="w-full max-w-[280px] mx-auto" role="presentation">
          {/* the ring the data travels round */}
          <circle
            cx="130"
            cy="130"
            r="92"
            fill="none"
            stroke="var(--plastic-edge)"
            strokeWidth="2"
            strokeDasharray="4 6"
          />
          {LOOP_STAGES.map((s, i) => {
            const angle = (i / 4) * Math.PI * 2 - Math.PI / 2
            const cx0 = 130 + Math.cos(angle) * 92
            const cy0 = 130 + Math.sin(angle) * 92
            const on = i === active
            return (
              <g
                key={s.id}
                role="button"
                tabIndex={0}
                aria-pressed={on}
                aria-label={`${s.label}: ${s.title}`}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setActive(i)
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={cx0}
                  cy={cy0}
                  r="30"
                  fill={on ? 'var(--signal-analog)' : 'var(--plastic-raised)'}
                  stroke={on ? 'var(--signal-analog)' : 'var(--plastic-edge)'}
                  strokeWidth="2"
                  className="transition-all duration-200"
                />
                <text
                  x={cx0}
                  y={cy0 + 4}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="700"
                  fill={on ? 'white' : 'var(--ink-2)'}
                  style={{ pointerEvents: 'none', letterSpacing: '0.04em' }}
                >
                  {s.label}
                </text>
                <text
                  x={cx0}
                  y={cy0 - 11}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill={on ? 'rgba(255,255,255,0.7)' : 'var(--ink-faint)'}
                  style={{ pointerEvents: 'none' }}
                  className="num"
                >
                  {i + 1}
                </text>
              </g>
            )
          })}
          {/* direction arrows between the nodes */}
          {[0, 1, 2, 3].map((i) => {
            const a = ((i + 0.5) / 4) * Math.PI * 2 - Math.PI / 2
            const x = 130 + Math.cos(a) * 92
            const y = 130 + Math.sin(a) * 92
            return (
              <polygon
                key={i}
                points="-5,-4 5,0 -5,4"
                fill="var(--ink-faint)"
                transform={`translate(${x} ${y}) rotate(${(a * 180) / Math.PI + 90})`}
              />
            )
          })}
          <text
            x="130"
            y="126"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="var(--ink-faint)"
            style={{ letterSpacing: '0.14em' }}
          >
            REPEATS
          </text>
          <text x="130" y="142" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--ink-faint)" style={{ letterSpacing: '0.14em' }}>
            FOREVER
          </text>
        </svg>

        <div
          className="rounded-md border border-plastic-edge bg-plastic-raised p-4"
          aria-live="polite"
        >
          <Silk className="block mb-1.5">
            Stage {active + 1} · {stage.label}
          </Silk>
          <h3 className="text-lead font-semibold mb-2">{stage.title}</h3>
          <p className="text-body text-ink-2 leading-relaxed mb-3">{stage.body}</p>
          <p className="text-small text-ink-3 border-l-2 border-signal-analog pl-3">
            {stage.example}
          </p>
        </div>
      </div>
    </FigureFrame>
  )
}

/* ------------------------------------------- the six enablers ---------- */

const ENABLERS = [
  {
    id: 'sensors',
    name: 'Sensors and actuators',
    short: 'Measure and act',
    body: 'Sensors collect data from the physical world, measuring parameters like temperature, humidity and pressure. Actuators act upon this data, performing actions such as controlling lights or adjusting environmental conditions.',
    example: 'Temperature sensor, motion sensor',
    wire: 'var(--wire-violet)',
  },
  {
    id: 'wireless',
    name: 'Wireless connectivity',
    short: 'Carry the data',
    body: 'IoT devices rely on wireless communication technologies like Wi-Fi, Bluetooth, Zigbee, Z-Wave, LoRa and NB-IoT to connect to the internet and to each other.',
    example: 'Wi-Fi, Bluetooth, LoRa',
    wire: 'var(--wire-blue)',
  },
  {
    id: 'edge',
    name: 'Edge computing',
    short: 'Decide immediately',
    body: 'Brings computational power closer to the data source, enabling real-time analysis and decision-making by processing data locally on IoT devices or at the edge of the network, reducing latency and bandwidth usage.',
    example: 'Raspberry Pi, NVIDIA Jetson',
    wire: 'var(--wire-green)',
  },
  {
    id: 'cloud',
    name: 'Cloud computing',
    short: 'Store everything',
    body: 'Cloud platforms provide scalable infrastructure and services for storing, processing and analysing large volumes of IoT data, enabling centralised management, data aggregation and advanced analytics.',
    example: 'Amazon Web Services, Microsoft Azure',
    wire: 'var(--wire-orange)',
  },
  {
    id: 'analytics',
    name: 'Data analytics and ML',
    short: 'Find the meaning',
    body: 'Analytics techniques, including machine learning and artificial intelligence, derive actionable insights from IoT data, facilitating applications such as predictive maintenance, anomaly detection and optimisation.',
    example: 'Anomaly detection model',
    wire: 'var(--wire-yellow)',
  },
  {
    id: 'security',
    name: 'Security and privacy',
    short: 'Protect all of it',
    body: 'Security measures like encryption, authentication and access control protect IoT devices, data and networks from cyber threats and unauthorised access, ensuring integrity, confidentiality and availability.',
    example: 'AES encryption, 2-factor authentication',
    wire: 'var(--wire-red)',
  },
]

export function EnablersFigure({ description }: { description: string }) {
  const [active, setActive] = useState('sensors')
  const item = ENABLERS.find((e) => e.id === active)!

  return (
    <FigureFrame legend="Technologies that enable IoT" description={description}>
      <div className="space-y-4">
        <ol className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ENABLERS.map((e, i) => {
            const on = e.id === active
            return (
              <li key={e.id}>
                <button
                  onClick={() => setActive(e.id)}
                  aria-pressed={on}
                  className={cx(
                    'w-full text-left p-3 rounded-md border transition-all min-h-[76px]',
                    on
                      ? 'bg-plastic-raised border-ink-faint shadow-[var(--lift-2)]'
                      : 'bg-plastic border-plastic-edge hover:border-ink-faint',
                  )}
                >
                  <span className="flex items-center gap-1.5 mb-1">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: e.wire }}
                      aria-hidden
                    />
                    <span className="num text-silk text-ink-faint">{i + 1}</span>
                  </span>
                  <span className="block text-fine font-semibold leading-tight">{e.name}</span>
                  <span className="block text-meta text-ink-3 mt-0.5">{e.short}</span>
                </button>
              </li>
            )
          })}
        </ol>

        <div
          className="rounded-md border border-plastic-edge bg-plastic-raised p-4"
          aria-live="polite"
          style={{ borderLeftWidth: 3, borderLeftColor: item.wire }}
        >
          <h3 className="text-body font-semibold mb-2">{item.name}</h3>
          <p className="text-body text-ink-2 leading-relaxed mb-2">{item.body}</p>
          <p className="text-fine text-ink-3">
            <span className="silk mr-2">Example</span>
            {item.example}
          </p>
        </div>
      </div>
    </FigureFrame>
  )
}
