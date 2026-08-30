/* Small drawings for the gallery cards: boards, chips, sensors, components and
   project types. Drawn in the same grammar as the rest of the product (flat
   fills, 1.5px strokes, theme tokens) so a sensor card and a board card sit
   together without one looking borrowed. No photographs and no icon library. */

const V = 'var'

function Board({
  w,
  h,
  children,
  colour = `${V}(--pcb)`,
}: {
  w: number
  h: number
  children?: React.ReactNode
  colour?: string
}) {
  return (
    <>
      <rect x={(120 - w) / 2} y={(80 - h) / 2} width={w} height={h} rx="4" fill={colour} />
      {children}
    </>
  )
}

function Pins({ x, y, n, horizontal = true, gap = 6 }: { x: number; y: number; n: number; horizontal?: boolean; gap?: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <rect
          key={i}
          x={horizontal ? x + i * gap : x}
          y={horizontal ? y : y + i * gap}
          width="3"
          height="4"
          rx="0.5"
          fill="var(--pcb-pad)"
        />
      ))}
    </>
  )
}

const ART: Record<string, React.ReactNode> = {
  /* ------------------------------------------------------------ boards */
  uno: (
    <Board w={92} h={58}>
      <rect x="14" y="16" width="16" height="14" rx="1.5" fill="#8f979f" />
      <rect x="14" y="52" width="16" height="12" rx="2" fill="#1b1f24" />
      <rect x="48" y="34" width="34" height="14" rx="1.5" fill="var(--dip-body)" />
      <Pins x={20} y={13} n={11} />
      <Pins x={44} y={63} n={10} />
      <circle cx="86" cy="24" r="2.5" fill="var(--signal-high)" />
    </Board>
  ),
  nano: (
    <Board w={62} h={30}>
      <rect x="30" y="26" width="10" height="10" rx="1.5" fill="#8f979f" />
      <rect x="54" y="34" width="18" height="10" rx="1.5" fill="var(--dip-body)" />
      <Pins x={32} y={22} n={9} gap={5} />
      <Pins x={32} y={54} n={9} gap={5} />
    </Board>
  ),
  promini: (
    <Board w={44} h={22}>
      <rect x="48" y="34" width="16" height="10" rx="1.5" fill="var(--dip-body)" />
      <Pins x={40} y={26} n={7} gap={5} />
      <Pins x={40} y={54} n={7} gap={5} />
    </Board>
  ),
  mega: (
    <Board w={106} h={52}>
      <rect x="9" y="20" width="14" height="12" rx="1.5" fill="#8f979f" />
      <rect x="9" y="50" width="14" height="10" rx="2" fill="#1b1f24" />
      <rect x="52" y="32" width="30" height="16" rx="1.5" fill="var(--dip-body)" />
      <Pins x={16} y={11} n={16} gap={5.5} />
      <Pins x={16} y={65} n={16} gap={5.5} />
      <Pins x={92} y={22} n={5} horizontal={false} gap={6} />
    </Board>
  ),
  due: (
    <Board w={106} h={52} colour="#0d5a63">
      <rect x="9" y="24" width="12" height="10" rx="1.5" fill="#8f979f" />
      <rect x="52" y="30" width="32" height="20" rx="2" fill="var(--dip-body)" />
      <Pins x={16} y={11} n={16} gap={5.5} />
      <Pins x={16} y={65} n={16} gap={5.5} />
      <text x="68" y="44" textAnchor="middle" fontSize="6" fontWeight="700" fill="#fff">
        ARM
      </text>
    </Board>
  ),
  esp8266: (
    <Board w={54} h={40} colour="#1f4d6b">
      <rect x="38" y="24" width="26" height="20" rx="1" fill="#b8bfc5" />
      <path d="M40 48h4v6h-4zM48 48h4v6h-4zM56 48h4v6h-4z" fill="var(--pcb-pad)" />
      <path
        d="M74 26q7 6 0 12M78 22q11 10 0 20"
        fill="none"
        stroke="var(--wire-yellow)"
        strokeWidth="2"
      />
    </Board>
  ),
  esp32: (
    <Board w={62} h={44} colour="#17303d">
      <rect x="36" y="22" width="30" height="22" rx="1" fill="#b8bfc5" />
      <Pins x={32} y={16} n={9} gap={6} />
      <Pins x={32} y={62} n={9} gap={6} />
      <path
        d="M76 26q8 7 0 14M81 21q13 12 0 24"
        fill="none"
        stroke="var(--wire-yellow)"
        strokeWidth="2"
      />
    </Board>
  ),
  microbit: (
    <Board w={70} h={54} colour="#1f7a45">
      {Array.from({ length: 5 }, (_, r) =>
        Array.from({ length: 5 }, (_, c) => (
          <rect
            key={`${r}-${c}`}
            x={38 + c * 9}
            y={22 + r * 8}
            width="5"
            height="5"
            rx="1"
            fill={(r + c) % 3 === 0 ? 'var(--signal-high)' : 'rgba(255,255,255,0.22)'}
          />
        )),
      )}
      <path d="M30 62h60" stroke="var(--pcb-pad)" strokeWidth="6" />
    </Board>
  ),
  pi: (
    <Board w={94} h={56} colour="#1f7a45">
      <rect x="18" y="16" width="20" height="14" rx="1.5" fill="#8f979f" />
      <rect x="18" y="36" width="20" height="14" rx="1.5" fill="#8f979f" />
      <rect x="52" y="30" width="26" height="20" rx="2" fill="var(--dip-body)" />
      <Pins x={18} y={13} n={18} gap={4.4} />
    </Board>
  ),
  magicbit: (
    <Board w={68} h={48} colour="#5a1f6b">
      <rect x="40" y="24" width="24" height="18" rx="2" fill="#b8bfc5" />
      <circle cx="76" cy="30" r="4" fill="var(--wire-yellow)" />
      <circle cx="76" cy="44" r="4" fill="var(--wire-green)" />
      <Pins x={30} y={18} n={10} gap={6} />
    </Board>
  ),
  gavesha: (
    <Board w={68} h={48} colour="#1a4fa0">
      <rect x="40" y="26" width="26" height="18" rx="2" fill="var(--dip-body)" />
      <Pins x={30} y={18} n={10} gap={6} />
      <Pins x={30} y={58} n={10} gap={6} />
    </Board>
  ),

  /* ------------------------------------------------------------- chips */
  'chip-dip': (
    <>
      <rect x="32" y="26" width="56" height="30" rx="2" fill="var(--dip-body)" />
      <circle cx="40" cy="34" r="2.5" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i}>
          <rect x={36 + i * 8} y="20" width="4" height="6" fill="var(--pcb-pad)" />
          <rect x={36 + i * 8} y="56" width="4" height="6" fill="var(--pcb-pad)" />
        </g>
      ))}
    </>
  ),
  'chip-module': (
    <>
      <rect x="30" y="24" width="60" height="34" rx="2" fill="#1f4d6b" />
      <rect x="40" y="30" width="40" height="22" rx="1" fill="#b8bfc5" />
      <path d="M94 32q7 5 0 10" fill="none" stroke="var(--wire-yellow)" strokeWidth="2" />
    </>
  ),

  /* -------------------------------------------------------- components */
  'resistor-fixed': (
    <>
      <path d="M12 40h22M86 40h22" stroke="var(--ink-faint)" strokeWidth="2.5" />
      <rect x="34" y="30" width="52" height="20" rx="9" fill="var(--resistor-body)" />
      <rect x="42" y="30" width="5" height="20" fill="#6b4423" />
      <rect x="51" y="30" width="5" height="20" fill="#1d2329" />
      <rect x="60" y="30" width="5" height="20" fill="#8b2b20" />
      <rect x="76" y="30" width="4" height="20" fill="#c8a02e" />
    </>
  ),
  'resistor-var': (
    <>
      <rect x="36" y="30" width="48" height="26" rx="3" fill="#1f4d6b" />
      <circle cx="60" cy="30" r="12" fill="#c8ccd0" />
      <path d="M60 30l7-8" stroke="#1d2329" strokeWidth="2.5" strokeLinecap="round" />
      <Pins x={44} y={56} n={3} gap={12} />
    </>
  ),
  ldr: (
    <>
      <circle cx="60" cy="38" r="17" fill="#d8cfa8" stroke="var(--ink-faint)" strokeWidth="1.5" />
      <path
        d="M48 34q6-7 12 0t12 0M48 42q6-7 12 0t12 0"
        fill="none"
        stroke="#8b6f2b"
        strokeWidth="2"
      />
      <path d="M54 55v12M66 55v12" stroke="var(--ink-faint)" strokeWidth="2.5" />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${26 + i * 4} ${16 + i * 7}l9 5`}
          stroke="var(--wire-yellow)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
    </>
  ),

  /* ------------------------------------------------------------ sensors */
  reed: (
    <>
      <rect x="26" y="32" width="42" height="16" rx="8" fill="none" stroke="var(--ink-faint)" strokeWidth="1.5" />
      <path d="M32 40h14M52 38h10" stroke="var(--ink-2)" strokeWidth="2" />
      <path d="M12 40h14M68 40h14" stroke="var(--ink-faint)" strokeWidth="2.5" />
      <rect x="86" y="28" width="20" height="24" rx="2" fill="var(--wire-blue)" />
      <rect x="86" y="28" width="20" height="12" rx="2" fill="var(--wire-red)" />
      <text x="96" y="62" textAnchor="middle" fontSize="6" fontWeight="700" fill="var(--ink-3)">
        magnet
      </text>
    </>
  ),
  touch: (
    <>
      <rect x="34" y="24" width="52" height="34" rx="3" fill="var(--pcb)" />
      <circle cx="60" cy="41" r="11" fill="var(--pcb-pad)" />
      <path d="M60 12v10M52 16l4 7M68 16l-4 7" stroke="var(--ink-faint)" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  shock: (
    <>
      <rect x="36" y="28" width="48" height="26" rx="3" fill="var(--pcb)" />
      <path d="M62 32l-8 10h7l-3 10 10-12h-7z" fill="var(--wire-yellow)" />
      <path d="M22 30q6 11 0 22M98 30q-6 11 0 22" fill="none" stroke="var(--ink-faint)" strokeWidth="2" />
    </>
  ),
  tilt: (
    <>
      <g transform="rotate(-18 60 40)">
        <rect x="38" y="30" width="44" height="20" rx="10" fill="none" stroke="var(--ink-faint)" strokeWidth="1.5" />
        <circle cx="70" cy="40" r="6" fill="var(--ink-2)" />
      </g>
      <path d="M20 62h80" stroke="var(--plastic-edge)" strokeWidth="1.5" strokeDasharray="3 3" />
    </>
  ),
  temp: (
    <>
      <rect x="46" y="18" width="28" height="30" rx="14" fill="var(--dip-body)" />
      <rect x="46" y="18" width="28" height="18" rx="9" fill="var(--dip-body)" />
      <Pins x={52} y={48} n={3} gap={8} />
      <path d="M54 52v14M60 52v14M66 52v14" stroke="var(--ink-faint)" strokeWidth="2" />
      <path d="M86 22v28M82 50h8" stroke="var(--signal-high)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="86" cy="54" r="5" fill="var(--signal-high)" />
    </>
  ),
  humidity: (
    <>
      <rect x="34" y="20" width="42" height="42" rx="3" fill="#4f9de0" />
      {Array.from({ length: 4 }, (_, r) =>
        Array.from({ length: 4 }, (_, c) => (
          <circle key={`${r}-${c}`} cx={42 + c * 9} cy={28 + r * 9} r="2.5" fill="rgba(0,0,0,0.35)" />
        )),
      )}
      <path d="M92 26c5 7 8 11 8 15a8 8 0 0 1-16 0c0-4 3-8 8-15z" fill="var(--wire-blue)" />
    </>
  ),
  gas: (
    <>
      <rect x="40" y="26" width="40" height="30" rx="3" fill="#8f979f" />
      {Array.from({ length: 3 }, (_, r) =>
        Array.from({ length: 5 }, (_, c) => (
          <circle key={`${r}-${c}`} cx={46 + c * 7} cy={33 + r * 8} r="2" fill="#4c565e" />
        )),
      )}
      <path d="M22 40q6-6 0-12M30 44q7-8 0-16" fill="none" stroke="var(--wire-green)" strokeWidth="2" opacity="0.8" />
    </>
  ),
  flame: (
    <>
      <path
        d="M60 14c10 12 16 18 16 26a16 16 0 0 1-32 0c0-8 6-14 16-26z"
        fill="var(--wire-orange)"
      />
      <path d="M60 30c4 6 7 9 7 13a7 7 0 0 1-14 0c0-4 3-7 7-13z" fill="var(--wire-yellow)" />
      <rect x="44" y="56" width="32" height="12" rx="2" fill="var(--pcb)" />
    </>
  ),
  soil: (
    <>
      <rect x="20" y="46" width="80" height="24" fill="#6b4423" opacity="0.55" />
      <rect x="52" y="14" width="16" height="46" rx="2" fill="#c8ccd0" />
      <rect x="54" y="34" width="4" height="26" fill="var(--pcb-pad)" />
      <rect x="62" y="34" width="4" height="26" fill="var(--pcb-pad)" />
      <path d="M20 46h80" stroke="#4b3018" strokeWidth="1.5" />
    </>
  ),
  rain: (
    <>
      <rect x="34" y="34" width="52" height="30" rx="2" fill="var(--pcb)" />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={38 + i * 8} y="38" width="3" height="22" fill="var(--pcb-pad)" />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M${40 + i * 14} 12l-3 10`}
          stroke="var(--wire-blue)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ))}
    </>
  ),
  noise: (
    <>
      <circle cx="46" cy="40" r="14" fill="#4c565e" />
      <circle cx="46" cy="40" r="8" fill="#2b3138" />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${68 + i * 9} ${30 - i * 4}a${12 + i * 6} ${12 + i * 6} 0 0 1 0 ${20 + i * 8}`}
          fill="none"
          stroke="var(--wire-green)"
          strokeWidth="2"
          opacity={0.9 - i * 0.22}
        />
      ))}
    </>
  ),
  colour: (
    <>
      <rect x="38" y="26" width="44" height="30" rx="3" fill="var(--pcb)" />
      <circle cx="60" cy="41" r="9" fill="#e9edf0" />
      {['#d7342a', '#1f8a4c', '#1a4fa0'].map((c, i) => (
        <circle key={c} cx={50 + i * 10} cy="16" r="5" fill={c} />
      ))}
      <path d="M60 22v6" stroke="var(--ink-faint)" strokeWidth="1.5" />
    </>
  ),
  barometer: (
    <>
      <circle cx="60" cy="40" r="22" fill="var(--plastic-raised)" stroke="var(--ink-faint)" strokeWidth="2" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2
        return (
          <line
            key={i}
            x1={60 + Math.cos(a) * 16}
            y1={40 + Math.sin(a) * 16}
            x2={60 + Math.cos(a) * 19}
            y2={40 + Math.sin(a) * 19}
            stroke="var(--ink-faint)"
            strokeWidth="1.5"
          />
        )
      })}
      <path d="M60 40l10-8" stroke="var(--signal-high)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="60" cy="40" r="3" fill="var(--ink)" />
    </>
  ),
  fingerprint: (
    <>
      {[6, 11, 16, 21].map((r, i) => (
        <path
          key={r}
          d={`M${60 - r} 40a${r} ${r + 4} 0 0 1 ${r * 2} 0`}
          fill="none"
          stroke="var(--ink-2)"
          strokeWidth="2"
          opacity={0.9 - i * 0.12}
        />
      ))}
      <rect x="34" y="52" width="52" height="14" rx="3" fill="var(--pcb)" />
    </>
  ),
  pulse: (
    <>
      <path
        d="M60 62s-20-13-20-25a11 11 0 0 1 20-6 11 11 0 0 1 20 6c0 12-20 25-20 25z"
        fill="var(--signal-high)"
      />
      <path
        d="M18 44h14l5-11 7 22 5-11h12"
        fill="none"
        stroke="var(--ink-2)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
  accel: (
    <>
      <rect x="42" y="26" width="36" height="30" rx="3" fill="var(--dip-body)" />
      <path d="M60 41h26M60 41V16M60 41L38 58" stroke="var(--wire-yellow)" strokeWidth="2" />
      <text x="90" y="44" fontSize="8" fontWeight="700" fill="var(--ink-3)">
        X
      </text>
      <text x="57" y="13" fontSize="8" fontWeight="700" fill="var(--ink-3)">
        Y
      </text>
      <text x="30" y="64" fontSize="8" fontWeight="700" fill="var(--ink-3)">
        Z
      </text>
    </>
  ),
  rfid: (
    <>
      <rect x="20" y="24" width="34" height="34" rx="4" fill="var(--pcb)" />
      <rect x="26" y="30" width="22" height="22" rx="2" fill="none" stroke="var(--pcb-pad)" strokeWidth="2" />
      <rect x="78" y="28" width="30" height="24" rx="3" fill="var(--plastic-raised)" stroke="var(--ink-faint)" strokeWidth="1.5" />
      <rect x="84" y="34" width="18" height="12" rx="1" fill="none" stroke="var(--pcb-pad)" strokeWidth="1.5" />
      {[0, 1].map((i) => (
        <path
          key={i}
          d={`M${58 + i * 7} ${32 - i * 3}a${10 + i * 5} ${10 + i * 5} 0 0 1 0 ${16 + i * 6}`}
          fill="none"
          stroke="var(--wire-violet)"
          strokeWidth="2"
          opacity={0.9 - i * 0.3}
        />
      ))}
    </>
  ),

  /* ------------------------------------------------------- app areas */
  home: (
    <>
      <path d="M28 42L60 18l32 24v26a3 3 0 0 1-3 3H31a3 3 0 0 1-3-3z" fill="var(--pcb)" />
      <rect x="52" y="50" width="16" height="21" fill="var(--pcb-pad)" />
      <path d="M22 44L60 14l38 30" fill="none" stroke="var(--ink-faint)" strokeWidth="2" />
      <circle cx="82" cy="30" r="3" fill="var(--signal-high)" />
    </>
  ),
  health: (
    <>
      <rect x="42" y="18" width="36" height="44" rx="8" fill="var(--dip-body)" />
      <rect x="47" y="24" width="26" height="30" rx="3" fill="#4f9de0" />
      <path d="M50 40h6l3-7 5 14 3-7h6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <path d="M42 24h-8M78 24h8M42 56h-8M78 56h8" stroke="var(--ink-faint)" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  industry: (
    <>
      <path d="M22 66V38l16 10V38l16 10V38l16 10V28l18 10v28z" fill="var(--pcb)" />
      <rect x="30" y="54" width="8" height="12" fill="var(--pcb-pad)" />
      <rect x="52" y="54" width="8" height="12" fill="var(--pcb-pad)" />
      <circle cx="90" cy="20" r="4" fill="var(--wire-orange)" />
      <path d="M84 26q6-8 12 0" fill="none" stroke="var(--wire-orange)" strokeWidth="1.5" />
    </>
  ),
  city: (
    <>
      <rect x="20" y="34" width="20" height="34" fill="var(--pcb)" />
      <rect x="46" y="20" width="22" height="48" fill="var(--pcb)" />
      <rect x="74" y="42" width="20" height="26" fill="var(--pcb)" />
      {[0, 1, 2].map((r) =>
        [0, 1].map((c) => (
          <rect key={`${r}-${c}`} x={51 + c * 9} y={26 + r * 11} width="5" height="6" fill="var(--pcb-pad)" />
        )),
      )}
      <path d="M100 20v20" stroke="var(--ink-faint)" strokeWidth="2" />
      <circle cx="100" cy="18" r="4" fill="var(--wire-yellow)" />
    </>
  ),
  agri: (
    <>
      <path d="M14 60h92" stroke="#6b4423" strokeWidth="8" />
      {[30, 52, 74].map((x) => (
        <g key={x}>
          <path d={`M${x} 56V34`} stroke="var(--wire-green)" strokeWidth="3" />
          <path d={`M${x} 40q-9-6-10-14 10 1 10 10M${x} 46q9-6 10-14-10 1-10 10`} fill="var(--wire-green)" />
        </g>
      ))}
      <rect x="90" y="30" width="14" height="26" rx="2" fill="var(--pcb)" />
      <circle cx="97" cy="24" r="3" fill="var(--signal-high)" />
    </>
  ),
  retail: (
    <>
      <path d="M24 30h72l-6 38H30z" fill="var(--pcb)" />
      <path d="M44 30V22a16 16 0 0 1 32 0v8" fill="none" stroke="var(--ink-faint)" strokeWidth="2.5" />
      <rect x="38" y="44" width="44" height="4" fill="var(--pcb-pad)" />
      <rect x="38" y="54" width="30" height="4" fill="var(--pcb-pad)" />
    </>
  ),
  energy: (
    <>
      <rect x="30" y="18" width="60" height="44" rx="4" fill="var(--pcb)" />
      <circle cx="60" cy="40" r="15" fill="var(--plastic-raised)" />
      <path d="M62 30l-8 12h7l-3 12 10-14h-7z" fill="var(--wire-yellow)" />
      <rect x="44" y="62" width="32" height="6" rx="2" fill="var(--dip-body)" />
    </>
  ),
  transport: (
    <>
      <path d="M18 50V34h40v16zM58 50V26h26l14 12v12z" fill="var(--pcb)" />
      <circle cx="34" cy="56" r="8" fill="var(--dip-body)" />
      <circle cx="82" cy="56" r="8" fill="var(--dip-body)" />
      <circle cx="34" cy="56" r="3" fill="var(--pcb-pad)" />
      <circle cx="82" cy="56" r="3" fill="var(--pcb-pad)" />
      <circle cx="92" cy="20" r="3" fill="var(--signal-high)" />
    </>
  ),

  /* -------------------------------------------------------- projects */
  'proj-line': (
    <>
      <path d="M10 62h100" stroke="var(--ink)" strokeWidth="7" />
      <rect x="40" y="30" width="40" height="22" rx="3" fill="var(--pcb)" />
      <circle cx="48" cy="56" r="7" fill="var(--dip-body)" />
      <circle cx="72" cy="56" r="7" fill="var(--dip-body)" />
      <path d="M54 52v6M66 52v6" stroke="var(--wire-red)" strokeWidth="2" />
    </>
  ),
  'proj-maze': (
    <>
      <path
        d="M18 16h84v52H18zM18 34h24M42 34v20M60 16v22M60 52h28M78 34v-8"
        fill="none"
        stroke="var(--ink-faint)"
        strokeWidth="3"
      />
      <rect x="24" y="56" width="12" height="8" rx="2" fill="var(--signal-high)" />
    </>
  ),
  'proj-cnc': (
    <>
      <rect x="18" y="52" width="84" height="14" rx="2" fill="var(--plastic-edge)" />
      <rect x="18" y="16" width="84" height="8" rx="2" fill="var(--plastic-edge)" />
      <rect x="52" y="16" width="16" height="34" rx="2" fill="var(--pcb)" />
      <path d="M60 50v8" stroke="var(--ink)" strokeWidth="3" />
      <path d="M30 62q14-10 28 0t28-6" fill="none" stroke="var(--wire-blue)" strokeWidth="2" />
    </>
  ),
  'proj-balance': (
    <>
      <rect x="50" y="14" width="20" height="34" rx="3" fill="var(--pcb)" />
      <circle cx="38" cy="56" r="12" fill="var(--dip-body)" />
      <circle cx="82" cy="56" r="12" fill="var(--dip-body)" />
      <path d="M50 48h20" stroke="var(--ink-faint)" strokeWidth="3" />
      <path d="M60 14v-6" stroke="var(--wire-yellow)" strokeWidth="2" />
    </>
  ),
  'proj-3d': (
    <>
      <rect x="20" y="14" width="80" height="54" rx="3" fill="none" stroke="var(--ink-faint)" strokeWidth="2.5" />
      <rect x="50" y="20" width="20" height="12" rx="2" fill="var(--pcb)" />
      <path d="M60 32v8" stroke="var(--ink-faint)" strokeWidth="2" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={46 + i} y={56 - i * 5} width={28 - i * 2} height="5" fill="var(--wire-orange)" opacity={0.5 + i * 0.2} />
      ))}
    </>
  ),
  'proj-solar': (
    <>
      <circle cx="94" cy="20" r="9" fill="var(--wire-yellow)" />
      <g transform="rotate(-22 60 44)">
        <rect x="32" y="26" width="56" height="26" rx="2" fill="#1a4fa0" />
        <path d="M46 26v26M60 26v26M74 26v26" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
      </g>
      <path d="M60 50v18M48 68h24" stroke="var(--ink-faint)" strokeWidth="3" />
    </>
  ),
  'proj-cube': (
    <>
      {[0, 1, 2].map((z) =>
        [0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => (
            <circle
              key={`${z}-${r}-${c}`}
              cx={36 + c * 18 + z * 6}
              cy={58 - r * 15 - z * 5}
              r="3"
              fill={(r + c + z) % 3 === 0 ? 'var(--signal-high)' : 'var(--plastic-edge)'}
            />
          )),
        ),
      )}
    </>
  ),
  'proj-obstacle': (
    <>
      <rect x="26" y="32" width="44" height="22" rx="3" fill="var(--pcb)" />
      <circle cx="36" cy="58" r="7" fill="var(--dip-body)" />
      <circle cx="60" cy="58" r="7" fill="var(--dip-body)" />
      <circle cx="66" cy="38" r="4" fill="#2b3138" />
      <circle cx="66" cy="48" r="4" fill="#2b3138" />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${76 + i * 6} ${34 - i * 2}a${10 + i * 4} ${10 + i * 4} 0 0 1 0 ${18 + i * 4}`}
          fill="none"
          stroke="var(--signal-high)"
          strokeWidth="2"
          opacity={0.9 - i * 0.25}
        />
      ))}
      <rect x="104" y="26" width="10" height="34" rx="2" fill="var(--plastic-edge)" />
    </>
  ),
}

export function PartArt({ name, className }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden focusable="false">
      {ART[name] ?? ART['chip-dip']}
    </svg>
  )
}
