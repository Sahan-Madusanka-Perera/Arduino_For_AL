import { Link } from 'react-router-dom'
import { course, conceptsByModule } from '@/content'
import { useProgress } from '@/store/progress'
import { aggregate, masteryOf, MASTERY_LABEL } from '@/lib/mastery'
import { Card, Chip, HoleStrip, Icon, Silk } from '@/components/ui'
import { wireColour } from '@/components/progress'

/* The course path: the whole journey, in order, as a tab rail down the page.
   The point of this screen is orientation, so it answers "where am I in the
   whole thing" at a glance and nothing else competes with that. */

export function PathPage() {
  const lessonRecords = useProgress((s) => s.lessons)
  const concepts = useProgress((s) => s.concepts)

  const allLessons = course.modules.flatMap((m) => m.lessons)
  const doneCount = allLessons.filter((l) => lessonRecords[l.id]?.completedAt).length

  return (
    <div className="max-w-[880px] mx-auto">
      <header className="mb-8">
        <h1 className="text-h1 sm:text-display font-bold tracking-tight mb-3">
          Seven modules, {allLessons.length} lessons
        </h1>
        <p className="text-lead text-ink-3 leading-relaxed max-w-2xl mb-4">
          Work through them in order. Each module builds on the one before it, and the last one is
          the four practical circuits, which need everything that came earlier.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <HoleStrip
            filled={doneCount}
            total={allLessons.length}
            label="Lessons completed"
            colour="var(--ok)"
            size={10}
          />
          <span className="num text-small text-ink-3">
            {doneCount}/{allLessons.length} complete
          </span>
        </div>
      </header>

      <ol className="relative">
        {/* the spine every module hangs off */}
        <span
          aria-hidden
          className="absolute left-[15px] sm:left-[19px] top-4 bottom-4 w-[2px] bg-plastic-edge"
        />

        {course.modules.map((mod) => {
          const ids = conceptsByModule.get(mod.id) ?? []
          const strength = aggregate(ids, concepts)
          const colour = wireColour(mod.wire)
          const modDone = mod.lessons.every((l) => lessonRecords[l.id]?.completedAt)
          const modStarted = mod.lessons.some((l) => lessonRecords[l.id]?.openedAt)

          return (
            <li key={mod.id} id={mod.id} className="relative pl-11 sm:pl-14 pb-6 scroll-mt-24">
              {/* the node on the spine */}
              <span
                aria-hidden
                className="absolute left-0 top-4 w-8 h-8 sm:w-10 sm:h-10 rounded-md grid place-items-center num text-fine font-bold border-2 transition-colors"
                style={{
                  background: modDone ? colour : 'var(--plastic-raised)',
                  borderColor: modDone || modStarted ? colour : 'var(--plastic-edge)',
                  color: modDone ? '#fff' : modStarted ? colour : 'var(--ink-faint)',
                }}
              >
                {String(mod.number).padStart(2, '0')}
              </span>

              <Card className="overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-plastic-edge">
                  <div className="flex items-start gap-3 mb-2">
                    <h2 className="text-h4 font-semibold flex-1">{mod.title}</h2>
                    {modDone && <Chip tone="ok">Complete</Chip>}
                  </div>
                  <p className="text-body text-ink-3 leading-relaxed mb-4">{mod.blurb}</p>

                  <Silk className="block mb-2">You will be able to</Silk>
                  <ul className="space-y-1 mb-4">
                    {mod.outcomes.map((o) => (
                      <li key={o} className="flex gap-2.5 text-small text-ink-2">
                        <span
                          aria-hidden
                          className="mt-[0.55em] w-1.5 h-1.5 rounded-[1px] shrink-0"
                          style={{ background: colour }}
                        />
                        {o}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-3 flex-wrap">
                    <HoleStrip
                      filled={Math.round(strength * 12)}
                      total={12}
                      label={`${mod.title} mastery`}
                      colour={colour}
                      size={7}
                    />
                    <span className="num text-meta text-ink-3">
                      {Math.round(strength * 100)}% mastery
                    </span>
                  </div>
                </div>

                <ul>
                  {mod.lessons.map((lesson) => {
                    const rec = lessonRecords[lesson.id]
                    const state = lesson.concepts.length
                      ? masteryOf(concepts[lesson.concepts[0].id])
                      : 'untouched'
                    return (
                      <li key={lesson.id} className="border-b border-plastic-edge last:border-0">
                        <Link
                          to={`/lesson/${lesson.id}`}
                          className="flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-plastic-sunk transition-colors group"
                        >
                          <span
                            aria-hidden
                            className="shrink-0 w-6 h-6 rounded-sm grid place-items-center num text-silk font-bold"
                            style={{
                              background: rec?.completedAt ? colour : 'var(--plastic-sunk)',
                              color: rec?.completedAt ? '#fff' : 'var(--ink-3)',
                              border: rec?.completedAt ? 'none' : '1px solid var(--plastic-edge)',
                            }}
                          >
                            {lesson.number}
                          </span>

                          {rec?.completedAt && (
                            <span
                              aria-hidden
                              className="shrink-0 -ml-1.5"
                              style={{ color: colour }}
                              title="Completed"
                            >
                              <Icon name="check" size={14} strokeWidth={2.8} />
                            </span>
                          )}

                          <span className="min-w-0 flex-1">
                            <span className="block text-body font-medium">{lesson.title}</span>
                            <span className="block text-fine text-ink-3 truncate">
                              {lesson.blurb}
                            </span>
                          </span>

                          <span className="shrink-0 flex items-center gap-2.5">
                            {state !== 'untouched' && (
                              <span className="hidden sm:inline silk">{MASTERY_LABEL[state]}</span>
                            )}
                            <span className="num text-meta text-ink-faint">
                              {lesson.minutes}m
                            </span>
                            <span
                              aria-hidden
                              className="text-ink-faint transition-transform group-hover:translate-x-0.5"
                            >
                              <Icon name="arrowRight" size={15} />
                            </span>
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </Card>
            </li>
          )
        })}

        {/* the end of the path */}
        <li className="relative pl-11 sm:pl-14">
          <span
            aria-hidden
            className="absolute left-0 top-4 w-8 h-8 sm:w-10 sm:h-10 rounded-md grid place-items-center border-2 border-ink bg-ink text-plastic"
          >
            <Icon name="target" size={16} strokeWidth={2} />
          </span>
          <Card className="p-4 sm:p-5">
            <h2 className="text-h4 font-semibold mb-2">Exam preparation</h2>
            <p className="text-body text-ink-3 leading-relaxed mb-4">
              Once the seven modules are done: key facts, the pairs students confuse, common
              mistakes, timed practice and the final assessment.
            </p>
            <Link
              to="/exam"
              className="inline-flex items-center gap-2 text-body font-semibold underline underline-offset-2 decoration-ink-faint hover:decoration-ink"
            >
              Open exam preparation
              <Icon name="arrowRight" size={15} />
            </Link>
          </Card>
        </li>
      </ol>
    </div>
  )
}
