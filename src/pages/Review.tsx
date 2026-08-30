import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '@/store/progress'
import { buildReviewQueue, daysPractised, reviewCount } from '@/lib/review'
import { masteryOf, MASTERY_ACTION, MASTERY_LABEL } from '@/lib/mastery'
import { Button, Card, Chip, EmptyState, HoleStrip, Icon, Silk } from '@/components/ui'
import { QuestionCard } from '@/components/quiz/QuestionCard'

/* The review queue.

   Two design choices worth naming. The queue is capped at eight, because a
   queue you can finish is a queue you open. And nothing here is loss-framed:
   there is no streak to break and no penalty for a gap, only a note about what
   is ready to come back. */

export function ReviewPage() {
  const concepts = useProgress((s) => s.concepts)
  const activeDays = useProgress((s) => s.activeDays)
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState<boolean[]>([])
  const [running, setRunning] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)

  const queue = useMemo(() => buildReviewQueue(concepts), [concepts])
  // The queue is capped so it can be finished in one sitting, but the count in
  // the navigation is the true number due. Saying so keeps the two honest.
  const totalDue = useMemo(() => reviewCount(concepts), [concepts])
  const days = useMemo(() => daysPractised(activeDays), [activeDays])
  const withQuestions = queue.filter((q) => q.question)

  if (queue.length === 0) {
    const touched = Object.keys(concepts).length
    return (
      <div className="max-w-[680px] mx-auto">
        <header className="mb-6">
          <h1 className="text-h1 sm:text-display font-bold tracking-tight">
            Nothing is due
          </h1>
        </header>
        <EmptyState
          title={touched === 0 ? 'Your review queue is empty' : 'Everything is still fresh'}
          body={
            touched === 0
              ? 'Once you start answering questions, anything you find hard comes back here at the point you are most likely to be forgetting it. Nothing needs setting up.'
              : 'Every concept you have practised is still strong enough that reviewing it now would teach you very little. Come back in a day or two, or learn something new in the meantime.'
          }
          icon="check"
          action={
            <div className="flex gap-2 justify-center flex-wrap">
              <Button variant="primary" to="/path">
                Go to the course
              </Button>
              <Button to="/practice">Practise anyway</Button>
            </div>
          }
        />
        {days.total > 0 && (
          <Card className="p-4 mt-6 text-center">
            <p className="text-body text-ink-2">
              You have studied on <span className="num font-semibold">{days.total}</span>{' '}
              {days.total === 1 ? 'day' : 'different days'}
              {days.run > 1 && (
                <>
                  , including the last <span className="num font-semibold">{days.run}</span> in a row
                </>
              )}
              .
            </p>
          </Card>
        )}
      </div>
    )
  }

  if (running && withQuestions.length > 0) {
    const finished = results.length === withQuestions.length
    const right = results.filter(Boolean).length

    if (finished) {
      return (
        <div className="max-w-[680px] mx-auto">
          <Card seated className="p-6 sm:p-8 text-center">
            <Silk className="block mb-3">Review done</Silk>
            <p className="num text-5xl font-bold mb-3">
              {right}
              <span className="text-h4 text-ink-3">/{withQuestions.length}</span>
            </p>
            <p className="text-plain text-ink-2 leading-relaxed max-w-md mx-auto mb-6">
              {right === withQuestions.length
                ? 'All correct. Each of these has been pushed further out, so they will not come back for a while.'
                : 'The ones you missed have been scheduled to come back tomorrow, which is roughly when you would otherwise start forgetting them again.'}
            </p>
            <div className="flex gap-2 justify-center flex-wrap">
              <Button
                variant="primary"
                onClick={() => {
                  setRunning(false)
                  setIndex(0)
                  setResults([])
                }}
              >
                Back to the queue
              </Button>
              <Button to="/">Go to the bench</Button>
            </div>
          </Card>
        </div>
      )
    }

    const item = withQuestions[index]
    const answered = results.length > index

    return (
      <div className="max-w-[680px] mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => setRunning(false)}
            className="text-small text-ink-3 hover:text-ink flex items-center gap-1.5"
          >
            <Icon name="arrowLeft" size={14} />
            Exit
          </button>
          <div className="flex-1 flex gap-1" role="img" aria-label={`Item ${index + 1} of ${withQuestions.length}`}>
            {withQuestions.map((_, i) => (
              <span
                key={i}
                className="flex-1 h-1.5 rounded-full"
                style={{
                  background:
                    i < results.length
                      ? results[i]
                        ? 'var(--ok)'
                        : 'var(--no)'
                      : i === index
                        ? 'var(--ink)'
                        : 'var(--plastic-edge)',
                }}
              />
            ))}
          </div>
          <span className="num text-fine text-ink-3 shrink-0">
            {index + 1}/{withQuestions.length}
          </span>
        </div>

        <h1 ref={headingRef} tabIndex={-1} className="sr-only">
          Reviewing {item.title}
        </h1>

        <div className="mb-3 flex items-center gap-2 flex-wrap">
          <Chip tone="info">{item.title}</Chip>
          <span className="text-fine text-ink-3">{item.reason}</span>
        </div>

        <QuestionCard
          key={item.question!.id}
          question={item.question!}
          onAnswered={(r) => setResults((prev) => [...prev, r.correct])}
          autoFocus
        />

        {answered && (
          <div className="mt-4">
            <Button
              variant="primary"
              size="lg"
              full
              onClick={() => {
                setIndex((i) => i + 1)
                requestAnimationFrame(() => headingRef.current?.focus())
              }}
            >
              {index + 1 < withQuestions.length ? 'Next' : 'Finish review'}
              <Icon name="arrowRight" size={16} />
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-[760px] mx-auto space-y-6">
      <header>
        <h1 className="text-h1 sm:text-display font-bold tracking-tight mb-3">
          {queue.length} {queue.length === 1 ? 'concept' : 'concepts'} ready to come back
        </h1>
        <p className="text-lead text-ink-3 leading-relaxed max-w-2xl">
          These are scheduled by how well you knew them and how long ago that was. Reviewing
          something just before you would have forgotten it is far more efficient than re-reading
          it while it is still fresh.
        </p>
        {totalDue > queue.length && (
          <p className="text-body text-ink-3 leading-relaxed max-w-2xl mt-3">
            <span className="num font-semibold text-ink">{totalDue}</span> concepts are due
            altogether. This page shows the {queue.length} most urgent, because a queue you can
            finish in one sitting is a queue you will actually open. Clear these and the next
            ones move up.
          </p>
        )}
      </header>

      {withQuestions.length > 0 && (
        <Button
          variant="primary"
          size="lg"
          onClick={() => {
            setRunning(true)
            setIndex(0)
            setResults([])
          }}
        >
          Start review · {withQuestions.length} {withQuestions.length === 1 ? 'question' : 'questions'}
          <Icon name="arrowRight" size={16} />
        </Button>
      )}

      <Card className="overflow-hidden">
        <ul>
          {queue.map((item) => {
            const state = masteryOf(concepts[item.conceptId])
            return (
              <li key={item.conceptId} className="border-b border-plastic-edge last:border-0">
                <div className="p-4 flex items-start gap-3.5">
                  <HoleStrip
                    filled={Math.round(item.strength * 5)}
                    total={5}
                    size={7}
                    label={`${item.title} strength`}
                    colour="var(--signal-high)"
                    className="mt-1 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2 mb-0.5 flex-wrap">
                      <h2 className="text-body font-semibold">{item.title}</h2>
                      <Silk>{MASTERY_LABEL[state]}</Silk>
                    </div>
                    <p className="text-fine text-ink-3 mb-1.5">{item.reason}</p>
                    <p className="text-fine text-ink-2">{MASTERY_ACTION[state]}</p>
                  </div>
                  <Link
                    to={`/lesson/${item.lessonId}`}
                    className="shrink-0 inline-flex items-center min-h-6 px-1 -mx-1 text-fine font-medium underline underline-offset-2 decoration-ink-faint hover:decoration-ink whitespace-nowrap"
                  >
                    Re-read
                  </Link>
                </div>
              </li>
            )
          })}
        </ul>
      </Card>

      <Card className="p-4">
        <Silk className="block mb-2">How this works</Silk>
        <p className="text-body text-ink-2 leading-relaxed">
          A concept you answer correctly comes back after 1 day, then 3, then 7, then 16, and so on.
          A concept you get wrong comes back tomorrow and starts the ladder again. That is the whole
          system: nothing to configure, and no penalty for taking a day off.
        </p>
      </Card>
    </div>
  )
}
