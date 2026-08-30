import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { course, conceptById, lessonForConcept, totalConcepts, lessonById } from '@/content'
import { useProgress, storageAvailable } from '@/store/progress'
import { aggregate, decayedStrength, masteryOf, MASTERY_LABEL } from '@/lib/mastery'
import { daysPractised } from '@/lib/review'
import { Button, Card, EmptyState, HoleStrip, Icon, Modal, Silk } from '@/components/ui'
import { MasteryField, MasteryLegend, ModuleProgressRow, StatTile } from '@/components/progress'

/* The progress page: everything the product knows about the student, shown to
   the student. Including the ability to delete all of it. */

export function ProgressPage() {
  const concepts = useProgress((s) => s.concepts)
  const lessonRecords = useProgress((s) => s.lessons)
  const attempts = useProgress((s) => s.attempts)
  const activeDays = useProgress((s) => s.activeDays)
  const assessments = useProgress((s) => s.assessments)
  const bookmarks = useProgress((s) => s.bookmarks)
  const name = useProgress((s) => s.name)
  const setName = useProgress((s) => s.setName)
  const resetAll = useProgress((s) => s.resetAll)
  const [confirmReset, setConfirmReset] = useState(false)

  const overall = useMemo(
    () => aggregate(course.modules.flatMap((m) => m.lessons.flatMap((l) => l.concepts.map((c) => c.id))), concepts),
    [concepts],
  )
  const days = useMemo(() => daysPractised(activeDays), [activeDays])
  const allLessons = course.modules.flatMap((m) => m.lessons)
  const done = allLessons.filter((l) => lessonRecords[l.id]?.completedAt).length
  const correct = attempts.filter((a) => a.correct).length

  const byState = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const rec of Object.values(concepts)) {
      const s = masteryOf(rec)
      counts[s] = (counts[s] ?? 0) + 1
    }
    counts.untouched = totalConcepts - Object.keys(concepts).length
    return counts
  }, [concepts])

  const conceptRows = useMemo(
    () =>
      Object.entries(concepts)
        .map(([id, rec]) => ({
          id,
          title: conceptById.get(id)?.title ?? id,
          lessonId: lessonForConcept.get(id)?.id,
          strength: decayedStrength(rec),
          state: masteryOf(rec),
          attempts: rec.attempts,
          correct: rec.correct,
        }))
        .sort((a, b) => a.strength - b.strength),
    [concepts],
  )

  if (attempts.length === 0 && done === 0) {
    return (
      <div className="max-w-[680px] mx-auto">
        <header className="mb-2 text-center">
          <h1 className="text-h1 sm:text-display font-bold tracking-tight">
            Nothing recorded yet
          </h1>
        </header>
        <EmptyState
          title="Your progress will appear here"
          body="Once you start working through lessons and answering questions, this page shows exactly what you know, what is fading, and what to do about it."
          icon="holes"
          action={
            <Button variant="primary" to="/path">
              Start the course
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="max-w-[880px] mx-auto space-y-6">
      <header>
        <h1 className="text-h1 sm:text-display font-bold tracking-tight mb-3">
          Everything this course knows about you
        </h1>
        <p className="text-lead text-ink-3 leading-relaxed max-w-2xl">
          All of it lives in this browser and nothing is sent anywhere. You can delete the lot at
          the bottom of this page.
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile label="Course mastery" value={`${Math.round(overall * 100)}%`} />
        <StatTile label="Lessons done" value={`${done}/${allLessons.length}`} />
        <StatTile
          label="Questions answered"
          value={attempts.length}
          note={attempts.length > 0 ? `${Math.round((correct / attempts.length) * 100)}% correct` : undefined}
        />
        <StatTile
          label="Days practised"
          value={days.total}
          note={days.run > 1 ? `${days.run} in a row` : undefined}
        />
      </div>

      <Card className="p-5">
        <Silk className="block mb-3">Every concept in the course</Silk>
        <MasteryField records={concepts} total={totalConcepts} className="mb-4" />
        <MasteryLegend />
        <ul className="mt-4 pt-4 border-t border-plastic-edge grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1.5">
          {(['mastered', 'proficient', 'familiar', 'practising', 'learning', 'untouched'] as const).map(
            (s) => (
              <li key={s} className="flex items-baseline justify-between gap-2 text-small">
                <span className="text-ink-3">{MASTERY_LABEL[s]}</span>
                <span className="num font-semibold">{byState[s] ?? 0}</span>
              </li>
            ),
          )}
        </ul>
      </Card>

      <section aria-labelledby="modules-heading">
        <h2 id="modules-heading" className="text-plain font-semibold mb-3">
          By module
        </h2>
        <Card className="px-4 py-2">
          {course.modules.map((m) => (
            <ModuleProgressRow key={m.id} module={m} />
          ))}
        </Card>
      </section>

      <section aria-labelledby="concepts-heading">
        <h2 id="concepts-heading" className="text-plain font-semibold mb-3">
          Concept by concept, weakest first
        </h2>
        <Card className="overflow-hidden">
          <ul>
            {conceptRows.slice(0, 20).map((c) => (
              <li key={c.id} className="border-b border-plastic-edge last:border-0">
                <div className="flex items-center gap-3 p-3.5">
                  <HoleStrip
                    filled={Math.round(c.strength * 5)}
                    total={5}
                    size={6}
                    label={`${c.title} strength`}
                    colour={c.strength >= 0.75 ? 'var(--ok)' : c.strength >= 0.4 ? 'var(--warn)' : 'var(--no)'}
                    className="shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-body font-medium truncate">{c.title}</p>
                    <p className="text-meta text-ink-3">
                      {MASTERY_LABEL[c.state]} · <span className="num">{c.correct}/{c.attempts}</span>{' '}
                      correct
                    </p>
                  </div>
                  {c.lessonId && (
                    <Link
                      to={`/lesson/${c.lessonId}`}
                      className="shrink-0 inline-flex items-center min-h-6 px-1 -mx-1 text-fine font-medium underline underline-offset-2 decoration-ink-faint hover:decoration-ink"
                    >
                      Open
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {conceptRows.length > 20 && (
            <p className="p-3 text-fine text-ink-3 text-center bg-plastic-sunk border-t border-plastic-edge">
              Showing the 20 weakest of {conceptRows.length} concepts you have attempted.
            </p>
          )}
        </Card>
      </section>

      {bookmarks.length > 0 && (
        <section aria-labelledby="bookmarks-heading">
          <h2 id="bookmarks-heading" className="text-plain font-semibold mb-3">
            Bookmarked lessons
          </h2>
          <div className="flex flex-wrap gap-2">
            {bookmarks.map((id) => {
              const l = lessonById.get(id)
              if (!l) return null
              return (
                <Button key={id} size="sm" to={`/lesson/${id}`}>
                  <Icon name="bookmark" size={13} />
                  {l.title}
                </Button>
              )
            })}
          </div>
        </section>
      )}

      {assessments.length > 0 && (
        <section aria-labelledby="assess-heading">
          <h2 id="assess-heading" className="text-plain font-semibold mb-3">
            Assessment history
          </h2>
          <Card className="overflow-hidden">
            <ul>
              {assessments.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center gap-3 p-3.5 border-b border-plastic-edge last:border-0"
                >
                  <span
                    className="num text-plain font-bold w-14 shrink-0"
                    style={{
                      color: a.score >= 0.75 ? 'var(--ok)' : a.score >= 0.5 ? 'var(--warn)' : 'var(--no)',
                    }}
                  >
                    {Math.round(a.score * 100)}%
                  </span>
                  <span className="text-small text-ink-3 flex-1">
                    {a.correct}/{a.total} correct
                    {a.duration > 0 && (
                      <span className="num"> · {Math.round(a.duration / 60)} min</span>
                    )}
                  </span>
                  <span className="num text-meta text-ink-faint shrink-0">
                    {new Date(a.at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}

      <section aria-labelledby="settings-heading" className="pt-4 border-t border-plastic-edge">
        <h2 id="settings-heading" className="text-plain font-semibold mb-3">
          Settings
        </h2>
        <Card className="p-4 space-y-4">
          <div>
            <label htmlFor="name" className="silk block mb-2">
              Your name, if you want one on the dashboard
            </label>
            <input
              id="name"
              value={name ?? ''}
              onChange={(e) => setName(e.target.value || null)}
              placeholder="Optional"
              autoComplete="off"
              className="w-full sm:w-72 h-11 px-3 rounded-md border border-plastic-edge bg-plastic-sunk text-body"
            />
            <p className="text-meta text-ink-3 mt-1.5">
              Stored in this browser only. It never leaves this device.
            </p>
          </div>

          <div className="pt-4 border-t border-plastic-edge">
            <Silk className="block mb-2">Storage</Silk>
            <p className="text-small text-ink-2 leading-relaxed mb-3">
              {storageAvailable()
                ? 'Your progress is being saved in this browser. Clearing site data, or opening the course in a different browser or device, will start you from scratch.'
                : 'This browser is blocking site storage, so nothing is being saved. The course still works, but your progress will be lost when you close the tab.'}
            </p>
            <Button variant="danger" onClick={() => setConfirmReset(true)}>
              <Icon name="trash" size={15} />
              Delete all my progress
            </Button>
          </div>
        </Card>
      </section>

      <Modal open={confirmReset} onClose={() => setConfirmReset(false)} title="Delete all progress?">
        <div className="space-y-4">
          <p className="text-plain leading-relaxed">
            This removes every answer, every mastery score, your review queue, your notes and your
            bookmarks from this browser. It cannot be undone, and there is no copy anywhere else.
          </p>
          <p className="text-body text-ink-3">
            The course content itself is unaffected: you can start again from the beginning.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="danger"
              onClick={() => {
                resetAll()
                setConfirmReset(false)
              }}
            >
              Yes, delete everything
            </Button>
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>
              Keep my progress
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
