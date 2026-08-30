import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { Link } from 'react-router-dom'

/* ============================================================================
   The design system.

   Every primitive is drawn in the breadboard's own vocabulary: moulded plastic
   with a hard short shadow, small radii, silkscreen legends in condensed caps,
   and monospaced tabular numerals for anything a student reads as a value.
   Nothing here is a generic card with a soft shadow.
   ========================================================================== */

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ')
}

/* ------------------------------------------------------------- button --- */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Renders a react-router Link that looks identical. */
  to?: string
  full?: boolean
}

const BUTTON_BASE =
  'relative inline-flex items-center justify-center gap-2 font-semibold rounded-md ' +
  'transition-[transform,background-color,border-color,box-shadow] duration-150 ' +
  'active:translate-y-px disabled:opacity-45 disabled:cursor-not-allowed disabled:active:translate-y-0 ' +
  'focus-visible:outline-3 focus-visible:outline-offset-3 select-none'

const BUTTON_SIZE: Record<ButtonSize, string> = {
  // 44px minimum touch target on md and lg; sm is only used inside dense
  // toolbars where every control sits in a group with 8px+ spacing.
  sm: 'text-fine px-3 h-9 min-h-9',
  md: 'text-body px-5 h-11 min-h-11',
  lg: 'text-body px-6 h-13 min-h-13',
}

const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  primary:
    'bg-ink text-plastic border border-ink hover:bg-ink-2 hover:border-ink-2 shadow-[0_1px_2px_var(--plastic-shadow)]',
  secondary:
    'bg-plastic-raised text-ink border border-plastic-edge hover:border-ink-faint shadow-[var(--lift-1)]',
  ghost: 'bg-transparent text-ink-2 border border-transparent hover:bg-plastic-raised hover:text-ink',
  danger:
    'bg-no-field text-no border border-no-edge hover:border-no',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', size = 'md', to, full, className, children, ...rest },
  ref,
) {
  const cls = cx(BUTTON_BASE, BUTTON_SIZE[size], BUTTON_VARIANT[variant], full && 'w-full', className)
  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <button ref={ref} className={cls} {...rest}>
      {children}
    </button>
  )
})

/* --------------------------------------------------------------- card --- */

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** A card seated on the board sits slightly proud of it. */
  seated?: boolean
  /** Wire colour along the left edge, identifying which module it belongs to. */
  wire?: string
}

export function Card({ seated, wire, className, style, children, ...rest }: CardProps) {
  return (
    <div
      className={cx(
        'relative bg-plastic-raised border border-plastic-edge rounded-lg',
        seated ? 'shadow-[var(--lift-2)]' : 'shadow-[var(--lift-1)]',
        wire && 'pl-[calc(var(--s-5)+3px)]',
        className,
      )}
      style={style}
      {...rest}
    >
      {wire && (
        <span
          aria-hidden
          className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
          style={{ background: wire }}
        />
      )}
      {children}
    </div>
  )
}

/* -------------------------------------------------------------- silk ---- */

/** A silkscreen legend. Always uppercase, always tracked, never a heading. */
export function Silk({
  children,
  className,
  as: As = 'span',
  ...rest
}: HTMLAttributes<HTMLElement> & { as?: 'span' | 'div' | 'p' | 'h2' | 'h3' }) {
  return (
    <As className={cx('silk', className)} {...rest}>
      {children}
    </As>
  )
}

/* --------------------------------------------------------- hole strip --- */

/** The product's single continuous mastery axis: occupied holes, not a
 *  percentage. Readable without colour, because the count of filled holes
 *  carries the whole meaning. */
export function HoleStrip({
  filled,
  total,
  label,
  colour = 'var(--ink)',
  size = 8,
  className,
}: {
  filled: number
  total: number
  label: string
  colour?: string
  size?: number
  className?: string
}) {
  const gap = Math.max(3, Math.round(size * 0.5))
  return (
    <div
      className={cx('flex items-center', className)}
      style={{ gap }}
      role="img"
      aria-label={`${label}: ${filled} of ${total}`}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          aria-hidden
          className="rounded-[1px] shrink-0"
          style={{
            width: size,
            height: size,
            background: i < filled ? colour : 'var(--hole-empty)',
            boxShadow:
              i < filled
                ? `0 0 0 1px color-mix(in srgb, ${colour} 40%, transparent)`
                : 'inset 0 1px 1px rgb(0 0 0 / 0.2)',
            transition: 'background var(--seat)',
          }}
        />
      ))}
    </div>
  )
}

/* ---------------------------------------------------------- progress --- */

export function ProgressBar({
  value,
  label,
  colour = 'var(--ink)',
  className,
}: {
  /** 0..1 */
  value: number
  label: string
  colour?: string
  className?: string
}) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100)
  return (
    <div
      className={cx('relative h-2 rounded-full bg-plastic-sunk overflow-hidden', className)}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      style={{ boxShadow: 'var(--sink)' }}
    >
      <span
        className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%`, background: colour }}
      />
    </div>
  )
}

/* ------------------------------------------------------------- chip ----- */

export function Chip({
  children,
  tone = 'neutral',
  className,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: 'neutral' | 'ok' | 'no' | 'warn' | 'info' | 'live'
}) {
  const tones: Record<string, string> = {
    neutral: 'bg-plastic-sunk text-ink-2 border-plastic-edge',
    ok: 'bg-ok-field text-ok border-ok-edge',
    no: 'bg-no-field text-no border-no-edge',
    warn: 'bg-warn-field text-warn border-warn-edge',
    info: 'bg-info-field text-ink-2 border-info-edge',
    live: 'bg-signal-high text-white border-signal-high',
  }
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border text-silk font-semibold tracking-[0.08em] uppercase',
        tones[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}

/* ------------------------------------------------------------ dialog ---- */

export function Modal({
  open,
  onClose,
  title,
  children,
  labelledBy,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  labelledBy?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const headingId = useId()

  useEffect(() => {
    if (!open) return
    returnFocus.current = document.activeElement as HTMLElement
    const node = ref.current
    node?.focus()

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !node) return
      // The only place in this product where focus is deliberately trapped.
      const focusables = node.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])',
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      returnFocus.current?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ background: 'rgb(10 14 18 / 0.55)' }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy ?? headingId}
        tabIndex={-1}
        className="w-full sm:max-w-2xl max-h-[88vh] overflow-y-auto bg-plastic-raised border border-plastic-edge rounded-t-lg sm:rounded-lg shadow-[var(--lift-3)] outline-none seat-in"
      >
        <div className="sticky top-0 flex items-center justify-between gap-4 px-5 py-4 bg-plastic-raised border-b border-plastic-edge">
          <h2 id={headingId} className="text-plain font-semibold">
            {title}
          </h2>
          <Button size="sm" variant="ghost" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </Button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------- tabs ----- */

export function Tabs({
  tabs,
  active,
  onChange,
  label,
}: {
  tabs: { id: string; label: string; count?: number }[]
  active: string
  onChange: (id: string) => void
  label: string
}) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})

  function onKeyDown(e: React.KeyboardEvent) {
    const i = tabs.findIndex((t) => t.id === active)
    let next = -1
    if (e.key === 'ArrowRight') next = (i + 1) % tabs.length
    if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = tabs.length - 1
    if (next >= 0) {
      e.preventDefault()
      onChange(tabs[next].id)
      refs.current[tabs[next].id]?.focus()
    }
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className="flex gap-1 overflow-x-auto p-1 bg-plastic-sunk rounded-md border border-plastic-edge"
      style={{ boxShadow: 'var(--sink)', scrollbarWidth: 'thin' }}
    >
      {tabs.map((tab) => {
        const selected = tab.id === active
        return (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[tab.id] = el
            }}
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={cx(
              'shrink-0 px-3 h-9 rounded-sm text-fine font-semibold transition-colors',
              selected
                ? 'bg-plastic-raised text-ink shadow-[var(--lift-1)]'
                : 'text-ink-3 hover:text-ink',
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="num ml-1.5 text-meta opacity-70">{tab.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------ states ---- */

export function EmptyState({
  title,
  body,
  action,
  icon = 'holes',
}: {
  title: string
  body: string
  action?: ReactNode
  icon?: 'holes' | 'search' | 'check' | 'note'
}) {
  return (
    <div className="text-center py-12 px-6 max-w-md mx-auto">
      <div
        aria-hidden
        className="mx-auto mb-5 w-16 h-16 rounded-lg border border-plastic-edge bg-plastic-sunk flex items-center justify-center text-ink-faint"
        style={{ boxShadow: 'var(--sink)' }}
      >
        <Icon name={icon === 'holes' ? 'grid' : icon} size={26} />
      </div>
      <h2 className="text-body font-semibold mb-2">{title}</h2>
      <p className="text-body text-ink-3 leading-relaxed mb-5">{body}</p>
      {action}
    </div>
  )
}

export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12" role="status" aria-live="polite">
      <div className="flex gap-1.5" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-[1px] bg-ink-faint"
            style={{
              animation: `bloom-in 900ms ease-in-out ${i * 110}ms infinite alternate`,
            }}
          />
        ))}
      </div>
      <span className="silk">{label}</span>
    </div>
  )
}

/* ------------------------------------------------------------- icons ---- */
/* Drawn in the world's own grammar: 1.5px strokes, square caps, on a 24 grid,
   the same line weight as a schematic. No icon library. */

const PATHS: Record<string, ReactNode> = {
  grid: (
    <>
      <circle cx="7" cy="7" r="1.4" />
      <circle cx="12" cy="7" r="1.4" />
      <circle cx="17" cy="7" r="1.4" />
      <circle cx="7" cy="12" r="1.4" />
      <circle cx="12" cy="12" r="1.4" />
      <circle cx="17" cy="12" r="1.4" />
      <circle cx="7" cy="17" r="1.4" />
      <circle cx="12" cy="17" r="1.4" />
      <circle cx="17" cy="17" r="1.4" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" />,
  check: <path d="M4 12.5l5.2 5.2L20 7" />,
  cross: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  arrowRight: <path d="M4 12h15m-5.5-6L19.5 12l-6 6" />,
  arrowUp: <path d="M12 20V5m-6 5.5L12 4.5l6 6" />,
  arrowDown: <path d="M12 4v15m-6-5.5L12 19.5l6-6" />,
  arrowLeft: <path d="M20 12H5m5.5-6L4.5 12l6 6" />,
  play: <path d="M7 4.5v15l13-7.5z" />,
  pause: <path d="M8.5 5v14M15.5 5v14" />,
  step: <path d="M6 5v14M10 12h9m-4-4l4 4-4 4" />,
  reset: <path d="M4 12a8 8 0 1 0 2.6-5.9M4 4v4h4" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </>
  ),
  book: <path d="M4 5.5h6.5A2.5 2.5 0 0 1 13 8v11a2 2 0 0 0-2-2H4zM20 5.5h-6.5A2.5 2.5 0 0 0 11 8v11a2 2 0 0 1 2-2h7z" />,
  chip: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="1" />
      <path d="M10 4v3M14 4v3M10 17v3M14 17v3M4 10h3M4 14h3M17 10h3M17 14h3" />
    </>
  ),
  bolt: <path d="M13.5 3L5 13.5h5.5L10 21l8.5-10.5H13z" />,
  note: <path d="M5 4h10l4 4v12H5zM15 4v4h4" />,
  bookmark: <path d="M6.5 3.5h11v17l-5.5-4-5.5 4z" />,
  refresh: <path d="M20 12a8 8 0 1 1-2.6-5.9M20 4v4h-4" />,
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.4" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
    </>
  ),
  moon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />,
  question: <path d="M9.2 9a2.9 2.9 0 1 1 3.8 2.8c-.7.3-1 .9-1 1.6v.6M12 17.5v.01" />,
  flask: <path d="M9.5 3v6L4.8 17.4A2 2 0 0 0 6.5 20.5h11a2 2 0 0 0 1.7-3.1L14.5 9V3M8 3h8M7.6 14h8.8" />,
  paper: <path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9.5 8h5M9.5 12h5" />,
  chevron: <path d="M9 5l7 7-7 7" />,
  external: <path d="M14 4h6v6M20 4l-8.5 8.5M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
  trash: <path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10.5 11v5M13.5 11v5" />,
  plus: <path d="M12 5v14M5 12h14" />,
}

export function Icon({
  name,
  size = 18,
  className,
  strokeWidth = 1.6,
}: {
  name: string
  size?: number
  className?: string
  strokeWidth?: number
}) {
  const filled = name === 'play' || name === 'bookmark'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name] ?? PATHS.grid}
    </svg>
  )
}

/* ------------------------------------------------------- live region ---- */

/** Announces feedback to screen readers. Polite by default: an answer result
 *  should not interrupt what the student is already hearing. */
export function LiveRegion({ message, assertive }: { message: string; assertive?: boolean }) {
  return (
    <div
      className="sr-only"
      role="status"
      aria-live={assertive ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      {message}
    </div>
  )
}
