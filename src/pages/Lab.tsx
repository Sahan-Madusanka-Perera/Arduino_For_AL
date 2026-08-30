import { useState } from 'react'
import { PRESETS } from '@/lib/arduino/presets'
import { Bench } from '@/components/learning/Bench'
import { Card, Silk, cx } from '@/components/ui'

/* The lab: every bench in one place, plus a free sandbox. This is where a
   student goes when they want to try something rather than be taught. */

export function LabPage() {
  const [active, setActive] = useState('sandbox')
  const preset = PRESETS.find((p) => p.id === active)!
  const syllabus = PRESETS.filter((p) => p.source === 'syllabus')
  const extra = PRESETS.filter((p) => p.source === 'course')

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      <header>
        <h1 className="text-h1 sm:text-display font-bold tracking-tight mb-3">
          Nothing here is graded
        </h1>
        <p className="text-lead text-ink-3 leading-relaxed max-w-2xl">
          Every circuit from the course, wired and ready. Change the code, move the sliders, and
          break things on purpose: the error messages are written to be read, and no physical board
          can be damaged from here.
        </p>
      </header>

      <div className="grid lg:grid-cols-[240px_1fr] gap-5 items-start">
        <nav aria-label="Benches" className="lg:sticky lg:top-24 space-y-4">
          <div>
            <Silk className="block mb-2">From the syllabus</Silk>
            <ul className="space-y-1">
              {syllabus.map((p) => (
                <li key={p.id}>
                  <BenchButton preset={p} active={active === p.id} onSelect={() => setActive(p.id)} />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Silk className="block mb-2">Extra benches</Silk>
            <ul className="space-y-1">
              {extra.map((p) => (
                <li key={p.id}>
                  <BenchButton preset={p} active={active === p.id} onSelect={() => setActive(p.id)} />
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="min-w-0">
          <Bench key={preset.id} presetId={preset.id} />

          <Card className="p-4 mt-2">
            <Silk className="block mb-2">Things worth trying</Silk>
            <ul className="space-y-2 text-body text-ink-2 leading-relaxed">
              <li className="flex gap-2.5">
                <span aria-hidden className="text-ink-faint shrink-0">
                  1.
                </span>
                Delete a semicolon and press Run. Read where the error is reported, and notice it is
                usually the line <em>after</em> the mistake.
              </li>
              <li className="flex gap-2.5">
                <span aria-hidden className="text-ink-faint shrink-0">
                  2.
                </span>
                Change <code className="num">digitalWrite</code> to{' '}
                <code className="num">digitalwrite</code>. Arduino is case sensitive, and this is
                what that actually means in practice.
              </li>
              <li className="flex gap-2.5">
                <span aria-hidden className="text-ink-faint shrink-0">
                  3.
                </span>
                Remove a <code className="num">pinMode</code> line from{' '}
                <code className="num">setup()</code> and see what the board says when you then try
                to drive that pin.
              </li>
              <li className="flex gap-2.5">
                <span aria-hidden className="text-ink-faint shrink-0">
                  4.
                </span>
                Put the blink code inside <code className="num">setup()</code> instead of{' '}
                <code className="num">loop()</code>, and watch it happen exactly once.
              </li>
              <li className="flex gap-2.5">
                <span aria-hidden className="text-ink-faint shrink-0">
                  5.
                </span>
                Change a <code className="num">float</code> to an <code className="num">int</code>{' '}
                in the temperature bench, and watch the motor stop working with no error at all.
              </li>
            </ul>
          </Card>

          <Card className="p-4 mt-3">
            <Silk className="block mb-2">On real hardware</Silk>
            <p className="text-body text-ink-2 leading-relaxed">
              This bench models behaviour, not electronics: it will not tell you about current,
              heat or timing. For circuit-level simulation the syllabus recommends{' '}
              <a
                href="https://www.tinkercad.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline underline-offset-2"
              >
                Tinkercad
              </a>
              , which is free and runs in a browser. Both are worth using: this one for
              understanding the program, that one for understanding the circuit.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

function BenchButton({
  preset,
  active,
  onSelect,
}: {
  preset: (typeof PRESETS)[number]
  active: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      aria-pressed={active}
      className={cx(
        'w-full text-left px-3 py-2.5 rounded-md border transition-colors min-h-[44px]',
        active
          ? 'bg-plastic-raised border-ink-faint shadow-[var(--lift-1)]'
          : 'bg-transparent border-transparent hover:bg-plastic-raised hover:border-plastic-edge',
      )}
    >
      <span className="flex items-center gap-2">
        <span
          aria-hidden
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: active ? 'var(--signal-high)' : 'var(--ink-faint)' }}
        />
        <span className="text-small font-medium leading-snug">{preset.title}</span>
      </span>
    </button>
  )
}
