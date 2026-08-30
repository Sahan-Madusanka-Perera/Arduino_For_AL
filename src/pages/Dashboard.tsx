import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { course, lessonById, totalConcepts, nextLesson } from '@/content'
import { useProgress, storageAvailable } from '@/store/progress'
import { aggregate, masteryOf } from '@/lib/mastery'
import { buildReviewQueue, daysPractised, weakestConcepts, strongestConcepts } from '@/lib/review'
import { Button, Card, Chip, HoleStrip, Icon, Silk } from '@/components/ui'
import {
  MasteryField,
  MasteryLegend,
  ModuleCard,
  ModuleProgressRow,
  wireColour,
} from '@/components/progress'

/* The bench: the first screen. It answers, in order and without scrolling on a
   laptop: where was I, how am I doing, what should I do next. */

export function Dashboard() {
  const concepts = useProgress((s) => s.concepts)
  const lessonRecords = useProgress((s) => s.lessons)
  const lastLessonId = useProgress((s) => s.lastLessonId)
  const activeDays = useProgress((s) => s.activeDays)
  const assessments = useProgress((s) => s.assessments)
  const name = useProgress((s) => s.name)

  const attempted = Object.keys(concepts).length
  const overall = useMemo(
    () => aggregate(course.modules.flatMap((m) => m.lessons.flatMap((l) => l.concepts.map((c) => c.id))), concepts),
    [concepts],
  )
  const review = useMemo(() => buildReviewQueue(concepts), [concepts])
  const weak = useMemo(() => weakestConcepts(concepts), [concepts])
  const strong = useMemo(() => strongestConcepts(concepts), [concepts])
  const days = useMemo(() => daysPractised(activeDays), [activeDays])

  const lessonsDone = Object.values(lessonRecords).filter((r) => r.completedAt).length
  // "Solid" is proficient or better: the two states the mastery field fills in.
  const startedCount = Object.keys(concepts).length
  const masteredCount = useMemo(
    () =>
      Object.values(concepts).filter((r) => {
        const m = masteryOf(r)
        return m === 'mastered' || m === 'proficient'
      }).length,
    [concepts],
  )

  // Where to continue: the lesson they last opened if unfinished, else the one
  // after it, else the very first lesson.
  const firstLesson = course.modules[0].lessons[0]
  const continueLesson = useMemo(() => {
    if (lastLessonId) {
      const rec = lessonRecords[lastLessonId]
      const current = lessonById.get(lastLessonId)
      if (current && !rec?.completedAt) return current
      const next = nextLesson(lastLessonId)
      if (next) return next
    }
    for (const m of course.modules) {
      for (const l of m.lessons) {
        if (!lessonRecords[l.id]?.completedAt) return l
      }
    }
    // Everything is complete: send them back to the very first lesson.
    return firstLesson
  }, [lastLessonId, lessonRecords, firstLesson])

  const continueModule = course.modules.find((m) => m.id === continueLesson.moduleId) ?? course.modules[0]
  const fresh = attempted === 0 && lessonsDone === 0
  const latest = assessments[0]

  return (
    <div className="space-y-8">
      {!storageAvailable() && (
        <div
          role="alert"
          className="rounded-lg border border-warn-edge bg-warn-field p-4"
        >
          <p className="text-body text-ink-2 leading-relaxed">
            <strong className="font-semibold">Your progress will not be saved.</strong> This browser
            is blocking site storage, probably because you are in a private window. Everything on
            the course still works, but when you close this tab your answers and mastery will be
            lost.
          </p>
        </div>
      )}

      {/* ------------------------------------------------------- header */}
      <header>
        <h1 className="text-h1 sm:text-display font-bold tracking-tight leading-tight mb-2">
          {fresh ? (
            <>Learn {course.title.replace('IoT, ', 'IoT, ')} by building it</>
          ) : (
            <>Welcome back{name ? `, ${name}` : ''}</>
          )}
        </h1>
        <p className="text-lead text-ink-3 leading-relaxed max-w-2xl">
          {fresh
            ? 'The whole G.C.E. Advanced Level ICT unit, taught from nothing. Every circuit is wired and every program actually runs, so you can change a number and watch what happens.'
            : `${lessonsDone} of ${course.modules.reduce((n, m) => n + m.lessons.length, 0)} lessons complete, ${Object.keys(concepts).length} of ${totalConcepts} concepts touched, and ${review.length > 0 ? `${review.length} ready for review` : 'nothing waiting for review'}.`}
        </p>
      </header>

      {/* ------------------------------------------------ continue card */}
      <Card seated className="overflow-hidden">
        <div className="grid md:grid-cols-[1.4fr_1fr]">
          <div className="p-5 sm:p-6">
            <div className="flex items-baseline gap-2 mb-1.5">
              <span
                className="num text-fine font-bold"
                style={{ color: wireColour(continueModule.wire) }}
              >
                {String(continueModule.number).padStart(2, '0')}.
                {String(continueLesson.number).padStart(2, '0')}
              </span>
              <span className="text-fine text-ink-3">
                {continueModule.title} · {fresh ? 'start here' : 'continue'}
              </span>
            </div>
            <h2 className="text-h3 sm:text-h2 font-semibold mb-2.5 leading-tight">
              {continueLesson.title}
            </h2>
            <p className="text-plain text-ink-2 leading-relaxed mb-5 max-w-lg">
              {continueLesson.blurb}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="lg" to={`/lesson/${continueLesson.id}`}>
                {/* The label follows the destination, not the overall state: a
                    student who browsed to lesson 7 and came back should not be
                    told "Begin the course" over a link to practical 4. */}
                {lessonRecords[continueLesson.id]?.openedAt
                  ? 'Pick up where you left off'
                  : continueLesson.id === firstLesson.id
                    ? 'Begin the course'
                    : 'Start this lesson'}
                <Icon name="arrowRight" size={16} />
              </Button>
              <span className="num text-fine text-ink-3">
                about {continueLesson.minutes} min
              </span>
            </div>
          </div>

          {/* the energised component: the only saturated field on the page */}
          <div
            className="relative border-t md:border-t-0 md:border-l border-plastic-edge p-5 sm:p-6 flex flex-col justify-center overflow-hidden"
            style={{ backgroundColor: 'var(--plastic-sunk)' }}
          >
            {/* The hole field is the material this panel is made of, so it sits
                behind the content at reduced strength rather than competing
                with the words for attention. */}
            <span aria-hidden className="absolute inset-0 holes opacity-45 pointer-events-none" />
            <Silk className="relative block mb-3">Course mastery</Silk>
            <MasteryField records={concepts} total={totalConcepts} className="relative mb-3" />
            {/* The label has to describe what the strip actually shows, or a
                student sees 18 tinted holes beside the words "0 solid" and
                distrusts both. */}
            <p className="relative text-body font-semibold mb-1">
              <span className="num">{startedCount}</span> of{' '}
              <span className="num">{totalConcepts}</span> concepts started
              <span className="font-normal text-ink-3">
                , <span className="num">{masteredCount}</span> solid
              </span>
            </p>
            <p className="relative text-fine text-ink-3 leading-snug">
              {fresh
                ? 'Nothing measured yet. Mastery is calculated from questions you answer, never from pages you scroll past.'
                : overall > 0.85
                  ? 'Strong across the whole unit. Keep the review queue clear and it will stay that way.'
                  : overall > 0.5
                    ? 'Solid progress. The review queue is where the remaining gaps are.'
                    : 'Early days. Every question you answer moves this.'}
            </p>
          </div>
        </div>
      </Card>

      {/* One quiet line, not a grid of hero metrics: the lesson and concept
          counts already appear in the header sentence above, and the module
          field below is what should own this position. */}
      {!fresh && (
        <p className="flex flex-wrap items-center gap-x-5 gap-y-1 text-small text-ink-3">
          <span>
            Practised on <span className="num font-semibold text-ink">{days.total}</span>{' '}
            {days.total === 1 ? 'day' : 'days'}
            {days.run > 1 && <>, the last <span className="num font-semibold text-ink">{days.run}</span> in a row</>}
          </span>
          <span>
            Last assessment{' '}
            <span className="num font-semibold text-ink">
              {latest ? `${Math.round(latest.score * 100)}%` : 'not attempted'}
            </span>
          </span>
        </p>
      )}

      {/* ------------------------------------------------------ modules */}
      <section aria-labelledby="modules-heading">
        <div className="flex items-baseline gap-3 mb-3">
          <h2 id="modules-heading" className="text-plain font-semibold">
            The seven modules
          </h2>
          <Link
            to="/path"
            className="text-small text-ink-3 hover:text-ink underline underline-offset-2 ml-auto inline-flex items-center min-h-6"
          >
            See the full path
          </Link>
        </div>

        {/* The DIP straddling the channel: modules on both sides of a real gap */}
        <div className="relative">
          {/* The DIP ravine. On a phone the columns become one, so the channel
              runs down the left edge with the modules straddling it, rather
              than disappearing and taking the world's geometry with it. */}
          <span
            aria-hidden
            className="absolute inset-y-0 left-3 sm:left-1/2 sm:-translate-x-1/2 w-4 sm:w-6 rounded-full bg-plastic-sunk border-x border-plastic-edge"
            style={{ boxShadow: 'var(--sink)' }}
          />
          <div className="relative grid sm:grid-cols-2 gap-3 sm:gap-x-8 lg:gap-x-10 pl-8 sm:pl-0">
            {course.modules.map((m) => (
              <ModuleCard key={m.id} module={m} />
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------- next action + review */}
      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-4">
        <section aria-labelledby="review-heading">
          <div className="flex items-center gap-3 mb-3">
            <h2 id="review-heading" className="text-plain font-semibold">
              Today&rsquo;s review
            </h2>
            {review.length > 0 && <Chip tone="live">{review.length}</Chip>}
          </div>

          {review.length === 0 ? (
            <Card className="p-5">
              <p className="text-body text-ink-2 leading-relaxed">
                {fresh
                  ? 'Nothing to review yet. Once you answer questions, anything you struggle with comes back here at the point you are most likely to be forgetting it.'
                  : 'Nothing is due. Everything you have practised is still fresh, so this is a good moment to learn something new instead.'}
              </p>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <ul>
                {review.slice(0, 5).map((item) => (
                  <li key={item.conceptId} className="border-b border-plastic-edge last:border-0">
                    <Link
                      to={`/lesson/${item.lessonId}`}
                      className="flex items-center gap-3 p-3.5 hover:bg-plastic-sunk transition-colors"
                    >
                      <HoleStrip
                        filled={Math.round(item.strength * 5)}
                        total={5}
                        size={6}
                        label={`${item.title} strength`}
                        colour="var(--signal-high)"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-body font-medium truncate">
                          {item.title}
                        </span>
                        <span className="block text-fine text-ink-3 truncate">
                          {item.reason}
                        </span>
                      </span>
                      <span aria-hidden className="text-ink-faint shrink-0">
                        <Icon name="arrowRight" size={15} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="p-3 bg-plastic-sunk border-t border-plastic-edge">
                <Button to="/review" full variant="primary">
                  Start review · {review.length} {review.length === 1 ? 'concept' : 'concepts'}
                </Button>
              </div>
            </Card>
          )}
        </section>

        <section aria-labelledby="areas-heading">
          <h2 id="areas-heading" className="text-plain font-semibold mb-3">
            Where you stand
          </h2>
          <Card className="p-4 space-y-4">
            {strong.length > 0 && (
              <div>
                <Silk className="block mb-2" style={{ color: 'var(--ok)' }}>
                  Strong
                </Silk>
                <ul className="space-y-1">
                  {strong.map((c) => (
                    <li key={c.conceptId} className="flex items-center gap-2 text-small">
                      <Icon name="check" size={13} className="text-ok shrink-0" strokeWidth={2.4} />
                      <span className="truncate">{c.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {weak.length > 0 && (
              <div className={strong.length > 0 ? 'pt-4 border-t border-plastic-edge' : ''}>
                <Silk className="block mb-2" style={{ color: 'var(--warn)' }}>
                  Needs another look
                </Silk>
                <ul className="space-y-1">
                  {weak.map((c) => (
                    <li key={c.conceptId}>
                      <Link
                        to={`/lesson/${c.lessonId}`}
                        className="flex items-center gap-2 text-small hover:underline underline-offset-2 min-h-6"
                      >
                        <span aria-hidden className="text-warn shrink-0 font-bold">
                          !
                        </span>
                        <span className="truncate">{c.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {strong.length === 0 && weak.length === 0 && (
              <p className="text-body text-ink-3 leading-relaxed">
                Once you have answered a few questions, this fills in with what you are strong on
                and what needs another look.
              </p>
            )}

            <div className="pt-4 border-t border-plastic-edge">
              <Silk className="block mb-2">Reading the mastery field</Silk>
              <MasteryLegend />
            </div>
          </Card>
        </section>
      </div>

      {/* ------------------------------------------- module breakdown */}
      {!fresh && (
        <section aria-labelledby="breakdown-heading">
          <h2 id="breakdown-heading" className="text-plain font-semibold mb-3">
            Mastery by module
          </h2>
          <Card className="px-4 py-2">
            {course.modules.map((m) => (
              <ModuleProgressRow key={m.id} module={m} />
            ))}
          </Card>
        </section>
      )}

      {/* ------------------------------------------------- next steps */}
      <section aria-labelledby="next-heading" className="grid sm:grid-cols-3 gap-3">
        <h2 id="next-heading" className="sr-only">
          Other things to do
        </h2>
        {[
          {
            to: '/lab',
            icon: 'flask',
            title: 'Open the free bench',
            body: 'Every component wired up, nothing graded. Write whatever you like and see what happens.',
          },
          {
            to: '/practice',
            icon: 'target',
            title: 'Practice questions',
            body: 'Filter by module and difficulty, from simple recall up to full A/L-style questions.',
          },
          {
            to: '/exam',
            icon: 'paper',
            title: 'Exam preparation',
            body: 'Key facts, commonly confused pairs, common mistakes, timed practice and the final assessment.',
          },
        ].map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="group rounded-lg border border-plastic-edge bg-plastic-raised p-4 transition-all hover:border-ink-faint hover:shadow-[var(--lift-2)]"
            style={{ boxShadow: 'var(--lift-1)' }}
          >
            <span className="inline-grid place-items-center w-9 h-9 rounded-sm bg-plastic-sunk border border-plastic-edge text-ink-2 mb-3">
              <Icon name={c.icon} size={17} />
            </span>
            <h3 className="text-body font-semibold mb-1.5 flex items-center gap-1.5">
              {c.title}
              <span
                aria-hidden
                className="text-ink-faint transition-transform group-hover:translate-x-0.5"
              >
                <Icon name="arrowRight" size={15} />
              </span>
            </h3>
            <p className="text-small text-ink-3 leading-snug">{c.body}</p>
          </Link>
        ))}
      </section>
    </div>
  )
}
