import { useId, type ReactNode } from 'react'
import { Icon, Silk, cx } from '@/components/ui'

/* Every figure sits in the same frame: a recessed plate on the board with a
   silkscreen legend, an accessible description, and an optional control strip
   below it. Consistency here is what lets a student learn the interaction once
   and reuse it across 26 different diagrams. */

export function FigureFrame({
  legend,
  description,
  controls,
  children,
  className,
  padded = true,
}: {
  legend: string
  /** Read by screen readers instead of the drawing. Required. */
  description: string
  controls?: ReactNode
  children: ReactNode
  className?: string
  padded?: boolean
}) {
  const descId = useId()
  return (
    <figure
      className={cx(
        'my-6 rounded-lg border border-plastic-edge bg-plastic-sunk overflow-hidden',
        className,
      )}
      style={{ boxShadow: 'var(--sink)' }}
    >
      <div className="flex items-center gap-2 px-4 h-9 border-b border-plastic-edge bg-plastic">
        <span className="w-1.5 h-1.5 rounded-full bg-ink-faint" aria-hidden />
        {/* The legend is this figure's heading, not decoration: a lesson that
            opens with a figure would otherwise jump from h1 straight to h3. */}
        <Silk as="h2">{legend}</Silk>
      </div>

      <div className={cx('relative', padded && 'p-4 sm:p-6')} aria-describedby={descId}>
        {children}
      </div>

      <p id={descId} className="sr-only">
        {description}
      </p>

      {controls && (
        <div className="px-4 py-3 border-t border-plastic-edge bg-plastic">{controls}</div>
      )}
    </figure>
  )
}

/* --------------------------------------------------------- slider ------ */

export function VizSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
  hint,
  colour = 'var(--signal-analog)',
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (v: number) => void
  hint?: string
  colour?: string
}) {
  const id = useId()
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <label htmlFor={id} className="text-fine font-medium text-ink-2">
          {label}
        </label>
        <span className="num text-small font-semibold shrink-0" style={{ color: colour }}>
          {Number.isInteger(step) ? Math.round(value) : value.toFixed(1)}
          {unit && <span className="text-ink-3 ml-0.5">{unit}</span>}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-11 bg-transparent cursor-pointer appearance-none focus-ring"
        style={
          {
            // A slider drawn as a wire with a seated bead on it.
            background: `linear-gradient(to right, ${colour} 0 ${pct}%, var(--plastic-edge) ${pct}% 100%)`,
            backgroundSize: '100% 4px',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: 4,
          } as React.CSSProperties
        }
      />
      {hint && <p className="text-meta text-ink-3 mt-1 leading-snug">{hint}</p>}
    </div>
  )
}

/* --------------------------------------------------------- toggle ------ */

export function VizToggle({
  label,
  on,
  onChange,
  onLabel = 'On',
  offLabel = 'Off',
  hint,
}: {
  label: string
  on: boolean
  onChange: (v: boolean) => void
  onLabel?: string
  offLabel?: string
  hint?: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-fine font-medium text-ink-2">{label}</span>
        <button
          role="switch"
          aria-checked={on}
          onClick={() => onChange(!on)}
          className={cx(
            'relative inline-flex items-center gap-2 h-11 px-1 pr-3 rounded-md border font-semibold text-fine transition-colors',
            on
              ? 'bg-signal-high border-signal-high text-white'
              : 'bg-plastic-sunk border-plastic-edge text-ink-3',
          )}
        >
          <span
            aria-hidden
            className="w-8 h-8 rounded-sm bg-plastic-raised shadow-[var(--lift-1)] grid place-items-center text-ink"
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: on ? 'var(--signal-high)' : 'var(--signal-low)' }}
            />
          </span>
          {on ? onLabel : offLabel}
        </button>
      </div>
      {hint && <p className="text-meta text-ink-3 mt-1.5 leading-snug">{hint}</p>}
    </div>
  )
}

/* ------------------------------------------------------ step control --- */

export function VizStepper({
  step,
  total,
  onStep,
  labels,
}: {
  step: number
  total: number
  onStep: (n: number) => void
  labels: string[]
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-1">
        <button
          onClick={() => onStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="w-11 h-11 grid place-items-center rounded-sm border border-plastic-edge bg-plastic-raised disabled:opacity-40 hover:border-ink-faint transition-colors"
          aria-label="Previous step"
        >
          <Icon name="arrowLeft" size={15} />
        </button>
        <button
          onClick={() => onStep(Math.min(total - 1, step + 1))}
          disabled={step === total - 1}
          className="w-11 h-11 grid place-items-center rounded-sm border border-plastic-edge bg-plastic-raised disabled:opacity-40 hover:border-ink-faint transition-colors"
          aria-label="Next step"
        >
          <Icon name="arrowRight" size={15} />
        </button>
      </div>
      <div className="flex-1 min-w-[140px]">
        <p className="text-fine font-medium" aria-live="polite">
          <span className="num text-ink-3 mr-1.5">
            {step + 1}/{total}
          </span>
          {labels[step]}
        </p>
      </div>
    </div>
  )
}
