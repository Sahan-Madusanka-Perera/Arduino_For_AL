import { useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Level, Question } from '@/types/content'
import { LEVEL_NAMES } from '@/types/content'
import { course, allQuestions, questionById, lessonById } from '@/content'
import { useProgress } from '@/store/progress'
import { Button, Card, Chip, Icon, Silk, Tabs, cx } from '@/components/ui'
import { QuestionCard } from '@/components/quiz/QuestionCard'

/* Practice: pick a module and a difficulty, get a run of questions, one at a
   time, with a result at the end that says what to do next. */

type Filter = { moduleId: string; level: 'all' | Level }

export function PracticePage() {
  const [params, setParams] = useSearchParams()
  const [filter, setFilter] = useState<Filter>({ moduleId: 'all', level: 'all' })
  const [session, setSession] = useState<Question[] | null>(null)
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState<boolean[]>([])
  const headingRef = useRef<HTMLHeadingElement>(null)
  const savedIds = useProgress((s) => s.savedQuestions)

  // A direct link from search opens that one question.
  const direct = params.get('q') ? questionById.get(params.get('q')!) : undefined

  const pool = useMemo(() => {
    const lessonsIn =
      filter.moduleId === 'all'
        ? null
        : new Set(
            course.modules
              .find((m) => m.id === filter.moduleId)
              ?.lessons.map((l) => l.id) ?? [],
          )
    return allQuestions.filter(
      (q) =>
        (!lessonsIn || lessonsIn.has(q.lessonId)) &&
        (filter.level === 'all' || q.level === filter.level),
    )
  }, [filter])

  const saved = useMemo(
    () => savedIds.map((id) => questionById.get(id)).filter((q): q is Question => !!q),
    [savedIds],
  )

  function start(questions: Question[]) {
    // Easiest first, so a run always warms up rather than opening with a
    // level-5 structured question.
    const ordered = [...questions].sort((a, b) => a.level - b.level).slice(0, 10)
    setSession(ordered)
    setIndex(0)
    setResults([])
    requestAnimationFrame(() => headingRef.current?.focus())
  }

  if (direct) {
    return (
      <div className="max-w-[720px] mx-auto">
        <button
          onClick={() => setParams({})}
          className="mb-4 text-small text-ink-3 hover:text-ink flex items-center gap-1.5 min-h-6"
        >
          <Icon name="arrowLeft" size={14} />
          All practice
        </button>
        <QuestionCard question={direct} />
      </div>
    )
  }

  if (session) {
    return (
      <PracticeRun
        questions={session}
        index={index}
        results={results}
        headingRef={headingRef}
        onAnswered={(ok) => setResults((r) => [...r, ok])}
        onNext={() => {
          setIndex((i) => i + 1)
          requestAnimationFrame(() => headingRef.current?.focus())
        }}
        onExit={() => setSession(null)}
        onRestart={() => start(session)}
      />
    )
  }

  return (
    <div className="max-w-[880px] mx-auto space-y-6">
      <header>
        <h1 className="text-h1 sm:text-display font-bold tracking-tight mb-3">
          Answer questions until it sticks
        </h1>
        <p className="text-lead text-ink-3 leading-relaxed max-w-2xl">
          Every question here explains why the answer is what it is, and why the tempting wrong one
          is tempting. Getting things wrong on purpose is a perfectly good way to use this page.
        </p>
      </header>

      <Card className="p-4 sm:p-5 space-y-4">
        <div>
          <Silk className="block mb-2">Module</Silk>
          <Tabs
            label="Filter by module"
            active={filter.moduleId}
            onChange={(moduleId) => setFilter((f) => ({ ...f, moduleId }))}
            tabs={[
              { id: 'all', label: 'All', count: allQuestions.length },
              ...course.modules.map((m) => ({
                id: m.id,
                label: `${m.number}. ${m.title}`,
                count: allQuestions.filter((q) =>
                  m.lessons.some((l) => l.id === q.lessonId),
                ).length,
              })),
            ]}
          />
        </div>

        <div>
          <Silk className="block mb-2">Difficulty</Silk>
          <div className="flex flex-wrap gap-1.5">
            {(['all', 1, 2, 3, 4, 5] as const).map((lv) => {
              const on = filter.level === lv
              return (
                <button
                  key={String(lv)}
                  onClick={() => setFilter((f) => ({ ...f, level: lv }))}
                  aria-pressed={on}
                  className={cx(
                    'px-3 h-10 rounded-sm border text-fine font-medium transition-colors',
                    on
                      ? 'bg-ink text-plastic border-ink'
                      : 'bg-plastic border-plastic-edge text-ink-2 hover:border-ink-faint',
                  )}
                >
                  {lv === 'all' ? 'Any level' : `${lv}. ${LEVEL_NAMES[lv]}`}
                  <span className={cx('num ml-1.5 text-meta', on ? 'opacity-70' : 'text-ink-faint')}>
                    {lv === 'all'
                      ? allQuestions.length
                      : allQuestions.filter((q) => q.level === lv).length}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Button
            variant="primary"
            size="lg"
            disabled={pool.length === 0}
            onClick={() => start(pool)}
          >
            Start practice
            <Icon name="arrowRight" size={16} />
          </Button>
          <span className="text-small text-ink-3">
            {pool.length === 0
              ? 'No questions match those filters.'
              : `${Math.min(10, pool.length)} questions, easiest first.`}
          </span>
        </div>
      </Card>

      {saved.length > 0 && (
        <section aria-labelledby="saved-heading">
          <div className="flex items-center gap-3 mb-3">
            <h2 id="saved-heading" className="text-plain font-semibold">
              Questions you saved
            </h2>
            <Chip tone="neutral">{saved.length}</Chip>
            <Button size="sm" className="ml-auto" onClick={() => start(saved)}>
              Practise these
            </Button>
          </div>
          <Card className="overflow-hidden">
            <ul>
              {saved.slice(0, 6).map((q) => {
                const lesson = lessonById.get(q.lessonId)
                return (
                  <li key={q.id} className="border-b border-plastic-edge last:border-0 p-3.5">
                    <p className="text-body leading-snug mb-1 line-clamp-2">
                      {q.prompt.replace(/\*\*/g, '')}
                    </p>
                    <p className="text-meta text-ink-3">
                      {lesson?.title} · level {q.level}
                    </p>
                  </li>
                )
              })}
            </ul>
          </Card>
        </section>
      )}

      <section aria-labelledby="levels-heading">
        <h2 id="levels-heading" className="text-plain font-semibold mb-3">
          What the five levels mean
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {(
            [
              [1, 'Can you spot the right answer when you see it? Definitions and names.'],
              [2, 'Can you say what something does, not just what it is called?'],
              [3, 'Given a situation, can you pick the right component or function?'],
              [4, 'Can you explain why something behaves the way it does, or predict a failure?'],
              [5, 'A full A/L-style structured question with its own mark scheme.'],
            ] as [Level, string][]
          ).map(([lv, body]) => (
            <Card key={lv} className="p-3.5">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="flex gap-[3px]" aria-hidden>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      className="w-[5px] h-[5px] rounded-[1px]"
                      style={{ background: i <= lv ? 'var(--ink-2)' : 'var(--hole-empty)' }}
                    />
                  ))}
                </span>
                <Silk>{LEVEL_NAMES[lv]}</Silk>
              </div>
              <p className="text-small text-ink-2 leading-snug">{body}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

/* -------------------------------------------------------- the run ------ */

function PracticeRun({
  questions,
  index,
  results,
  headingRef,
  onAnswered,
  onNext,
  onExit,
  onRestart,
}: {
  questions: Question[]
  index: number
  results: boolean[]
  headingRef: React.RefObject<HTMLHeadingElement>
  onAnswered: (ok: boolean) => void
  onNext: () => void
  onExit: () => void
  onRestart: () => void
}) {
  const finished = results.length === questions.length
  const right = results.filter(Boolean).length

  if (finished) {
    const byLevel = new Map<number, { correct: number; total: number }>()
    questions.forEach((q, i) => {
      const cur = byLevel.get(q.level) ?? { correct: 0, total: 0 }
      cur.total++
      if (results[i]) cur.correct++
      byLevel.set(q.level, cur)
    })

    const weakLessons = [
      ...new Set(
        questions.filter((_, i) => !results[i]).map((q) => q.lessonId),
      ),
    ]

    return (
      <div className="max-w-[680px] mx-auto">
        <Card seated className="overflow-hidden">
          <div className="p-6 sm:p-8 text-center border-b border-plastic-edge">
            <Silk className="block mb-3">Practice complete</Silk>
            <p className="num text-5xl font-bold mb-2">
              {right}
              <span className="text-h4 text-ink-3">/{questions.length}</span>
            </p>
            <div className="flex justify-center gap-1.5 mb-4" role="img" aria-label={`${right} of ${questions.length} correct`}>
              {results.map((ok, i) => (
                <span
                  key={i}
                  className="w-6 h-6 rounded-hair grid place-items-center text-white text-silk"
                  style={{ background: ok ? 'var(--ok)' : 'var(--no)' }}
                >
                  <Icon name={ok ? 'check' : 'cross'} size={13} strokeWidth={3} />
                </span>
              ))}
            </div>
            <p className="text-plain text-ink-2 leading-relaxed max-w-md mx-auto">
              {right === questions.length
                ? 'Every one right. Try a harder level, or move on to the next module.'
                : right >= questions.length * 0.7
                  ? 'A good run. The ones you missed are in your review queue now and will come back at the right time.'
                  : 'Worth going back to the lessons below before trying this level again. Nothing here is wasted: every miss sharpened your review queue.'}
            </p>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <Silk className="block mb-2">By difficulty</Silk>
              <ul className="space-y-1.5">
                {[...byLevel.entries()]
                  .sort((a, b) => a[0] - b[0])
                  .map(([lv, s]) => (
                    <li key={lv} className="flex items-center gap-3 text-small">
                      <span className="w-24 shrink-0 text-ink-3">{LEVEL_NAMES[lv as Level]}</span>
                      <span className="flex-1 h-2 rounded-full bg-plastic-sunk overflow-hidden">
                        <span
                          className="block h-full rounded-full"
                          style={{
                            width: `${(s.correct / s.total) * 100}%`,
                            background: s.correct === s.total ? 'var(--ok)' : 'var(--warn)',
                          }}
                        />
                      </span>
                      <span className="num text-ink-3 w-10 text-right shrink-0">
                        {s.correct}/{s.total}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>

            {weakLessons.length > 0 && (
              <div className="pt-4 border-t border-plastic-edge">
                <Silk className="block mb-2">Worth re-reading</Silk>
                <div className="flex flex-wrap gap-2">
                  {weakLessons.map((id) => {
                    const l = lessonById.get(id)
                    if (!l) return null
                    return (
                      <Button key={id} size="sm" to={`/lesson/${id}`}>
                        {l.title}
                      </Button>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-plastic-edge flex flex-wrap gap-2">
              <Button variant="primary" onClick={onRestart}>
                <Icon name="refresh" size={15} />
                Same questions again
              </Button>
              <Button onClick={onExit}>Choose different questions</Button>
              <Button variant="ghost" to="/review">
                Go to review
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  const q = questions[index]
  const answeredThis = results.length > index

  return (
    <div className="max-w-[680px] mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={onExit}
          className="text-small text-ink-3 hover:text-ink flex items-center gap-1.5 min-h-6"
        >
          <Icon name="arrowLeft" size={14} />
          Exit
        </button>
        <div className="flex-1 flex gap-1" role="img" aria-label={`Question ${index + 1} of ${questions.length}`}>
          {questions.map((_, i) => (
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
          {index + 1}/{questions.length}
        </span>
      </div>

      <h1 ref={headingRef} tabIndex={-1} className="sr-only">
        Question {index + 1} of {questions.length}
      </h1>

      <QuestionCard
        key={q.id}
        question={q}
        onAnswered={(r) => onAnswered(r.correct)}
        autoFocus
      />

      {answeredThis && (
        <div className="mt-4">
          <Button variant="primary" size="lg" full onClick={onNext}>
            {index + 1 < questions.length ? 'Next question' : 'See your results'}
            <Icon name="arrowRight" size={16} />
          </Button>
        </div>
      )}
    </div>
  )
}
