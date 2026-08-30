import { Link } from 'react-router-dom'
import type { Module } from '@/types/content'
import { aggregate, masteryOf, MASTERY_LABEL, MASTERY_FILL } from '@/lib/mastery'
import { conceptsByModule } from '@/content'
import { useProgress } from '@/store/progress'
import { HoleStrip, Icon, ProgressBar, Silk, cx } from '@/components/ui'
import type { ConceptRecord, MasteryState } from '@/types/progress'

export function wireColour(wire: Module['wire']): string {
  return `var(--wire-${wire})`
}

/** The course's single continuous physical axis: one hole per concept, filled
 *  as it is mastered. Readable without colour, and it never rounds a real
 *  achievement down to a percentage. */
export function MasteryField({
  records,
  total,
  className,
}: {
  records: Record<string, ConceptRecord>
  total: number
  className?: string
}) {
  const states = Object.values(records).map((r) => masteryOf(r))
  const counts: Record<MasteryState, number> = {
    untouched: 0,
    learning: 0,
    practising: 0,
    familiar: 0,
    proficient: 0,
    mastered: 0,
  }
  for (const s of states) counts[s]++
  counts.untouched = total - states.length

  const filled = states.filter((s) => s === 'mastered' || s === 'proficient').length

  return (
    <div className={className}>
      {/* One continuous axis, not a wrapped grid: the strip is a single row of
          equal columns that always spans the panel, so a ragged short last row
          can never read as data. Fill is carried by brightness AND by a raised
          cap on solid holes, so it survives being read at 9px. */}
      <div
        className="grid w-full rounded-hair overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))`,
          gap: 2,
        }}
        role="img"
        aria-label={`${filled} of ${total} concepts at proficient or better. ${counts.familiar} familiar, ${counts.practising} practising, ${counts.learning} started, ${counts.untouched} not started.`}
      >
        {Array.from({ length: total }, (_, i) => {
          const state = states[i] ?? 'untouched'
          const level = MASTERY_FILL[state]
          return (
            <span
              key={i}
              aria-hidden
              className="h-4 rounded-[1px] transition-colors"
              style={{
                background:
                  level === 0
                    ? 'var(--hole-empty)'
                    : level >= 5
                      ? 'var(--ok)'
                      : level >= 4
                        ? 'color-mix(in srgb, var(--ok) 78%, var(--hole-empty))'
                        : level >= 3
                          ? 'color-mix(in srgb, var(--ok) 52%, var(--hole-empty))'
                          : 'color-mix(in srgb, var(--ok) 28%, var(--hole-empty))',
                boxShadow:
                  level === 0
                    ? 'inset 0 1px 1px rgb(0 0 0 / 0.18)'
                    : 'inset 0 1px 0 rgb(255 255 255 / 0.35)',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

export function MasteryLegend() {
  const items: { state: MasteryState; note: string }[] = [
    { state: 'untouched', note: 'not started' },
    { state: 'learning', note: 'started' },
    { state: 'practising', note: 'practising' },
    { state: 'familiar', note: 'familiar' },
    { state: 'proficient', note: 'proficient' },
    { state: 'mastered', note: 'mastered' },
  ]
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
      {items.map((i) => (
        <li key={i.state} className="flex items-center gap-1.5">
          <HoleStrip
            filled={MASTERY_FILL[i.state]}
            total={5}
            size={5}
            label={MASTERY_LABEL[i.state]}
            colour="var(--ok)"
          />
          <span className="text-meta text-ink-3">{i.note}</span>
        </li>
      ))}
    </ul>
  )
}

/** A module rendered as a DIP component straddling the centre channel. */
export function ModuleCard({ module: mod, compact }: { module: Module; compact?: boolean }) {
  const concepts = useProgress((s) => s.concepts)
  const lessonRecords = useProgress((s) => s.lessons)
  const ids = conceptsByModule.get(mod.id) ?? []
  const strength = aggregate(ids, concepts)
  const done = mod.lessons.filter((l) => lessonRecords[l.id]?.completedAt).length
  const started = mod.lessons.filter((l) => lessonRecords[l.id]?.openedAt).length
  const colour = wireColour(mod.wire)

  const firstUnfinished =
    mod.lessons.find((l) => !lessonRecords[l.id]?.completedAt) ?? mod.lessons[0]

  return (
    <Link
      to={`/lesson/${firstUnfinished.id}`}
      className="group block rounded-lg border border-plastic-edge bg-plastic-raised overflow-hidden transition-all hover:border-ink-faint hover:shadow-[var(--lift-2)] focus-visible:outline-3"
      style={{ boxShadow: 'var(--lift-1)' }}
    >
      <div className="flex items-stretch">
        {/* the wire spine identifying the module */}
        <span aria-hidden className="w-1 shrink-0" style={{ background: colour }} />

        <div className="flex-1 min-w-0 p-4">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="num text-meta font-bold" style={{ color: colour }}>
              {String(mod.number).padStart(2, '0')}
            </span>
            <h3 className="text-lead font-semibold truncate">{mod.title}</h3>
          </div>

          {!compact && (
            <p className="text-small text-ink-3 leading-snug mb-3">{mod.blurb}</p>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <HoleStrip
              filled={Math.round(strength * 10)}
              total={10}
              label={`${mod.title} mastery`}
              colour={colour}
              size={7}
            />
            <span className="num text-meta text-ink-3">
              {done > 0 ? `${done}/${mod.lessons.length} done` : started > 0 ? 'in progress' : 'not begun'}
            </span>
            <span
              aria-hidden
              className="ml-auto text-ink-faint transition-transform group-hover:translate-x-0.5"
            >
              <Icon name="arrowRight" size={15} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function ModuleProgressRow({ module: mod }: { module: Module }) {
  const concepts = useProgress((s) => s.concepts)
  const ids = conceptsByModule.get(mod.id) ?? []
  const strength = aggregate(ids, concepts)
  const colour = wireColour(mod.wire)

  return (
    <div className="flex items-center gap-3 py-2.5">
      <span aria-hidden className="w-2 h-2 rounded-full shrink-0" style={{ background: colour }} />
      <span className="text-small flex-1 min-w-0 truncate">{mod.title}</span>
      <ProgressBar value={strength} label={`${mod.title} mastery`} colour={colour} className="w-24 shrink-0" />
      <span className="num text-meta text-ink-3 w-9 text-right shrink-0">
        {Math.round(strength * 100)}%
      </span>
    </div>
  )
}

export function StatTile({
  label,
  value,
  note,
  colour,
  className,
}: {
  label: string
  value: string | number
  note?: string
  colour?: string
  className?: string
}) {
  return (
    <div
      className={cx(
        'rounded-lg border border-plastic-edge bg-plastic-raised p-4',
        className,
      )}
      style={{ boxShadow: 'var(--lift-1)' }}
    >
      <Silk className="block mb-1.5">{label}</Silk>
      <p className="num text-h4 font-bold leading-none" style={colour ? { color: colour } : undefined}>
        {value}
      </p>
      {note && <p className="text-meta text-ink-3 mt-1.5 leading-snug">{note}</p>}
    </div>
  )
}
