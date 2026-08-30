import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Question } from '@/types/content'
import { allQuestions, lessonById, conceptById } from '@/content'
import { KEY_FACTS, CONFUSED_PAIRS, COMMON_MISTAKES } from '@/content/exam'
import { useProgress } from '@/store/progress'
import { Button, Card, Icon, Silk, Tabs, LiveRegion } from '@/components/ui'
import { QuestionCard } from '@/components/quiz/QuestionCard'

/* Exam preparation. Four tabs, each answering a different question a student
   has in the last week before a paper. */

const TABS = [
  { id: 'facts', label: 'Key facts' },
  { id: 'confused', label: 'Easily confused' },
  { id: 'mistakes', label: 'Common mistakes' },
  { id: 'assessment', label: 'Final assessment' },
]

export function ExamPage() {
  const [tab, setTab] = useState('facts')

  return (
    <div className="max-w-[880px] mx-auto space-y-5">
      <header>
        <h1 className="text-h1 sm:text-display font-bold tracking-tight mb-3">
          What to know, what gets confused, what goes wrong
        </h1>
        <p className="text-lead text-ink-3 leading-relaxed max-w-2xl">
          Nothing new here: everything on this page is already taught in the modules. It is
          gathered in the shape you actually need in the last week before a paper.
        </p>
      </header>

      <div className="rounded-lg border border-warn-edge bg-warn-field p-4">
        <p className="text-body text-ink-2 leading-relaxed">
          <strong className="font-semibold">About the questions here.</strong> No past-paper
          material was supplied with this syllabus, so every structured question in this course is
          written for it and labelled &ldquo;A/L-style&rdquo;. They follow the format and the mark
          allocation of the real paper, but they are not official past-paper questions and are not
          presented as any.
        </p>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} label="Exam preparation sections" />

      {tab === 'facts' && <KeyFactsTab />}
      {tab === 'confused' && <ConfusedTab />}
      {tab === 'mistakes' && <MistakesTab />}
      {tab === 'assessment' && <AssessmentTab />}
    </div>
  )
}

/* ------------------------------------------------------- key facts ----- */

function KeyFactsTab() {
  const [hidden, setHidden] = useState<Set<string>>(new Set())

  return (
    <section aria-labelledby="facts-heading" className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <h2 id="facts-heading" className="text-plain font-semibold">
          {KEY_FACTS.length} facts worth knowing cold
        </h2>
        <Button
          size="sm"
          className="ml-auto"
          onClick={() =>
            setHidden(hidden.size > 0 ? new Set() : new Set(KEY_FACTS.map((f) => f.id)))
          }
        >
          {hidden.size > 0 ? 'Show all answers' : 'Hide all, test myself'}
        </Button>
      </div>

      <p className="text-body text-ink-3 leading-relaxed">
        Hide the details and see whether you can produce each one from the heading alone. Recalling
        beats re-reading by a wide margin, and it takes less time.
      </p>

      <ul className="grid sm:grid-cols-2 gap-2.5">
        {KEY_FACTS.map((f) => {
          const isHidden = hidden.has(f.id)
          return (
            <li key={f.id}>
              <Card className="p-4 h-full flex flex-col">
                <p className="num text-body font-bold mb-2 leading-snug">{f.fact}</p>
                {isHidden ? (
                  <button
                    onClick={() =>
                      setHidden((h) => {
                        const n = new Set(h)
                        n.delete(f.id)
                        return n
                      })
                    }
                    className="text-left text-small text-signal-analog font-semibold underline underline-offset-2 mt-auto"
                  >
                    Reveal
                  </button>
                ) : (
                  <>
                    <p className="text-small text-ink-2 leading-relaxed mb-2 flex-1">
                      {f.detail}
                    </p>
                    <Link
                      to={`/lesson/${f.lessonId}`}
                      className="inline-flex items-center min-h-6 text-meta text-ink-3 hover:text-ink underline underline-offset-2 mt-auto"
                    >
                      {lessonById.get(f.lessonId)?.title}
                    </Link>
                  </>
                )}
              </Card>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/* -------------------------------------------------------- confused ----- */

function ConfusedTab() {
  return (
    <section aria-labelledby="confused-heading" className="space-y-4">
      <h2 id="confused-heading" className="text-plain font-semibold">
        The {CONFUSED_PAIRS.length} pairs that get mixed up
      </h2>
      <p className="text-body text-ink-3 leading-relaxed">
        Each of these is a pair of terms that sound similar and mean different things. The test
        column is the quickest way to tell them apart under pressure.
      </p>

      <ul className="space-y-2.5">
        {CONFUSED_PAIRS.map((p) => (
          <li key={p.id}>
            <Card className="overflow-hidden">
              <div className="grid sm:grid-cols-2">
                <div className="p-3.5 border-b sm:border-b-0 sm:border-r border-plastic-edge">
                  <p className="text-body font-semibold" style={{ color: 'var(--wire-green)' }}>
                    {p.a}
                  </p>
                </div>
                <div className="p-3.5">
                  <p className="text-body font-semibold" style={{ color: 'var(--wire-orange)' }}>
                    {p.b}
                  </p>
                </div>
              </div>
              <div className="p-3.5 border-t border-plastic-edge bg-plastic-sunk space-y-2.5">
                <div>
                  <Silk className="block mb-1">The difference</Silk>
                  <p className="text-body text-ink-2 leading-relaxed">{p.difference}</p>
                </div>
                <div>
                  <Silk className="block mb-1">Quick test</Silk>
                  <p className="text-body text-ink-2 leading-relaxed">{p.test}</p>
                </div>
                <Link
                  to={`/lesson/${p.lessonId}`}
                  className="inline-flex items-center min-h-6 text-meta text-ink-3 hover:text-ink underline underline-offset-2"
                >
                  {lessonById.get(p.lessonId)?.title}
                </Link>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* -------------------------------------------------------- mistakes ----- */

function MistakesTab() {
  return (
    <section aria-labelledby="mistakes-heading" className="space-y-4">
      <h2 id="mistakes-heading" className="text-plain font-semibold">
        {COMMON_MISTAKES.length} mistakes that cost marks
      </h2>
      <p className="text-body text-ink-3 leading-relaxed">
        Most of these are not knowledge problems. They are answer-shape problems: knowing the
        content and losing the mark anyway.
      </p>

      <ul className="space-y-2.5">
        {COMMON_MISTAKES.map((m) => (
          <li key={m.id}>
            <Card
              className="p-4"
              style={{ borderLeftWidth: 3, borderLeftColor: 'var(--warn)' }}
            >
              <div className="flex items-start gap-2.5 mb-2">
                <span className="text-warn mt-0.5 shrink-0">
                  <Icon name="cross" size={14} strokeWidth={2.4} />
                </span>
                <p className="text-body font-semibold leading-snug">{m.mistake}</p>
              </div>
              <div className="flex items-start gap-2.5 pl-[26px]">
                <p className="text-body text-ink-2 leading-relaxed">{m.fix}</p>
              </div>
              <Link
                to={`/lesson/${m.lessonId}`}
                className="inline-flex items-center min-h-6 mt-2 ml-[26px] text-meta text-ink-3 hover:text-ink underline underline-offset-2"
              >
                {lessonById.get(m.lessonId)?.title}
              </Link>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ------------------------------------------------------ assessment ----- */

const ASSESSMENT_MINUTES = 30

function AssessmentTab() {
  const [phase, setPhase] = useState<'intro' | 'running' | 'done'>('intro')
  const [questions, setQuestions] = useState<Question[]>([])
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState<{ ok: boolean; partial: number }[]>([])
  const [started, setStarted] = useState(0)
  const [remaining, setRemaining] = useState(ASSESSMENT_MINUTES * 60)
  const [timed, setTimed] = useState(true)
  const recordAssessment = useProgress((s) => s.recordAssessment)
  const assessments = useProgress((s) => s.assessments)
  const headingRef = useRef<HTMLHeadingElement>(null)

  // A balanced paper: a spread across every module and every level, rather
  // than whatever happens to be first in the array.
  function build(): Question[] {
    const byLevel = new Map<number, Question[]>()
    for (const q of allQuestions) {
      const list = byLevel.get(q.level) ?? []
      list.push(q)
      byLevel.set(q.level, list)
    }
    const want: Record<number, number> = { 1: 4, 2: 5, 3: 5, 4: 3, 5: 3 }
    const out: Question[] = []
    for (const [level, count] of Object.entries(want)) {
      const pool = [...(byLevel.get(Number(level)) ?? [])]
      // Spread across lessons so one module cannot dominate.
      const seen = new Set<string>()
      const picked: Question[] = []
      for (const q of pool.sort(() => Math.random() - 0.5)) {
        if (picked.length >= count) break
        if (seen.has(q.lessonId) && picked.length < count - 1) continue
        seen.add(q.lessonId)
        picked.push(q)
      }
      out.push(...picked.slice(0, count))
    }
    return out.sort((a, b) => a.level - b.level)
  }

  useEffect(() => {
    if (phase !== 'running' || !timed) return
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(t)
          setPhase('done')
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [phase, timed])

  function finish(final: { ok: boolean; partial: number }[]) {
    const byLevel: Record<number, { correct: number; total: number }> = {}
    const weak: string[] = []
    const strong: string[] = []
    questions.forEach((q, i) => {
      const r = final[i]
      byLevel[q.level] ??= { correct: 0, total: 0 }
      byLevel[q.level].total++
      if (r?.ok) {
        byLevel[q.level].correct++
        strong.push(q.conceptId)
      } else {
        weak.push(q.conceptId)
      }
    })
    const correct = final.filter((r) => r.ok).length
    recordAssessment({
      score: questions.length ? correct / questions.length : 0,
      total: questions.length,
      correct,
      byLevel,
      weakConcepts: [...new Set(weak)],
      strongConcepts: [...new Set(strong)].filter((c) => !weak.includes(c)),
      duration: Math.round((Date.now() - started) / 1000),
      kind: 'final',
    })
    setPhase('done')
  }

  if (phase === 'intro') {
    const last = assessments[0]
    return (
      <section aria-labelledby="assess-heading" className="space-y-4">
        <h2 id="assess-heading" className="text-plain font-semibold">
          Final assessment
        </h2>

        <Card className="p-5 space-y-4">
          <p className="text-plain text-ink-2 leading-relaxed">
            Twenty questions across all seven modules, from simple recall up to full A/L-style
            structured questions with mark schemes. It reports back by difficulty, so you find out
            not just what you scored but what kind of question you are losing marks on.
          </p>

          <div className="grid sm:grid-cols-3 gap-2.5">
            {[
              { label: 'Questions', value: '20' },
              { label: 'Suggested time', value: `${ASSESSMENT_MINUTES} min` },
              { label: 'Covers', value: 'All 7 modules' },
            ].map((s) => (
              <div key={s.label} className="rounded-md border border-plastic-edge bg-plastic-sunk p-3">
                <Silk className="block mb-1">{s.label}</Silk>
                <p className="num text-plain font-bold">{s.value}</p>
              </div>
            ))}
          </div>

          <label className="flex items-center gap-3 p-3 rounded-md border border-plastic-edge cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={timed}
              onChange={(e) => setTimed(e.target.checked)}
              className="sr-only"
            />
            <span
              aria-hidden
              className="w-6 h-6 rounded-hair border-2 grid place-items-center text-white text-silk font-bold shrink-0"
              style={{
                borderColor: timed ? 'var(--ink)' : 'var(--plastic-edge)',
                background: timed ? 'var(--ink)' : 'transparent',
              }}
            >
              {timed && <Icon name="check" size={12} strokeWidth={3} />}
            </span>
            <span>
              <span className="block text-body font-medium">
                Run it against the clock
              </span>
              <span className="block text-fine text-ink-3">
                {ASSESSMENT_MINUTES} minutes. Turn this off if you would rather take your time.
              </span>
            </span>
          </label>

          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              const qs = build()
              setQuestions(qs)
              setIndex(0)
              setResults([])
              setRemaining(ASSESSMENT_MINUTES * 60)
              setStarted(Date.now())
              setPhase('running')
            }}
          >
            Start the assessment
            <Icon name="arrowRight" size={16} />
          </Button>
        </Card>

        {assessments.length > 0 && (
          <div>
            <h3 className="text-body font-semibold mb-2.5">Your previous attempts</h3>
            <Card className="overflow-hidden">
              <ul>
                {assessments.slice(0, 5).map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center gap-3 p-3.5 border-b border-plastic-edge last:border-0"
                  >
                    <span
                      className="num text-plain font-bold w-14 shrink-0"
                      style={{
                        color:
                          a.score >= 0.75 ? 'var(--ok)' : a.score >= 0.5 ? 'var(--warn)' : 'var(--no)',
                      }}
                    >
                      {Math.round(a.score * 100)}%
                    </span>
                    <span className="text-small text-ink-3 flex-1 min-w-0">
                      {a.correct} of {a.total} correct
                    </span>
                    <span className="num text-meta text-ink-faint shrink-0">
                      {new Date(a.at).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
            {last && last.score >= 0.75 && (
              <MasteredBanner score={last.score} />
            )}
          </div>
        )}
      </section>
    )
  }

  if (phase === 'running') {
    const q = questions[index]
    const answered = results.length > index
    const mins = Math.floor(remaining / 60)
    const secs = remaining % 60

    return (
      <div className="max-w-[680px] mx-auto">
        <div className="sticky top-16 z-10 -mx-4 px-4 py-2.5 bg-[color-mix(in_srgb,var(--plastic)_92%,transparent)] backdrop-blur-md mb-4">
          <div className="flex items-center gap-3">
            <span className="num text-fine text-ink-3 shrink-0">
              {index + 1}/{questions.length}
            </span>
            <div className="flex-1 flex gap-0.5" role="img" aria-label={`Question ${index + 1} of ${questions.length}`}>
              {questions.map((_, i) => (
                <span
                  key={i}
                  className="flex-1 h-1.5 rounded-full"
                  style={{
                    background:
                      i < results.length
                        ? results[i].ok
                          ? 'var(--ok)'
                          : 'var(--no)'
                        : i === index
                          ? 'var(--ink)'
                          : 'var(--plastic-edge)',
                  }}
                />
              ))}
            </div>
            {timed && (
              <span
                className="num text-small font-bold shrink-0 tabular-nums"
                style={{ color: remaining < 300 ? 'var(--signal-high)' : 'var(--ink-2)' }}
                aria-label={`${mins} minutes ${secs} seconds remaining`}
              >
                {mins}:{String(secs).padStart(2, '0')}
              </span>
            )}
          </div>
        </div>

        <h2 ref={headingRef} tabIndex={-1} className="sr-only">
          Question {index + 1}
        </h2>

        <QuestionCard
          key={q.id}
          question={q}
          onAnswered={(r) => setResults((prev) => [...prev, { ok: r.correct, partial: r.partial ?? (r.correct ? 1 : 0) }])}
          autoFocus
        />

        {answered && (
          <div className="mt-4">
            <Button
              variant="primary"
              size="lg"
              full
              onClick={() => {
                if (index + 1 < questions.length) {
                  setIndex((i) => i + 1)
                  requestAnimationFrame(() => headingRef.current?.focus())
                } else {
                  finish(results)
                }
              }}
            >
              {index + 1 < questions.length ? 'Next question' : 'Finish and see results'}
              <Icon name="arrowRight" size={16} />
            </Button>
          </div>
        )}

        {timed && remaining < 120 && (
          <LiveRegion message={`${Math.ceil(remaining / 60)} minutes remaining`} />
        )}
      </div>
    )
  }

  /* ------------------------------------------------------- results ----- */

  const correct = results.filter((r) => r.ok).length
  const score = questions.length ? correct / questions.length : 0
  const byLevel = new Map<number, { correct: number; total: number }>()
  questions.forEach((q, i) => {
    const cur = byLevel.get(q.level) ?? { correct: 0, total: 0 }
    cur.total++
    if (results[i]?.ok) cur.correct++
    byLevel.set(q.level, cur)
  })

  const recallScore = pct(byLevel, [1, 2])
  const applyScore = pct(byLevel, [3, 4])
  const examScore = pct(byLevel, [5])

  const weakLessons = [
    ...new Set(questions.filter((_, i) => !results[i]?.ok).map((q) => q.lessonId)),
  ].slice(0, 5)
  const strongConcepts = [
    ...new Set(questions.filter((_, i) => results[i]?.ok).map((q) => q.conceptId)),
  ].slice(0, 5)

  return (
    <section aria-labelledby="results-heading" className="max-w-[680px] mx-auto space-y-4">
      <Card seated className="overflow-hidden">
        <div className="p-6 sm:p-8 text-center border-b border-plastic-edge">
          <Silk className="block mb-3">Final assessment</Silk>
          <p
            className="num text-6xl font-bold mb-2 leading-none"
            style={{
              color: score >= 0.75 ? 'var(--ok)' : score >= 0.5 ? 'var(--warn)' : 'var(--no)',
            }}
          >
            {Math.round(score * 100)}%
          </p>
          <h2 id="results-heading" className="text-lead font-semibold mb-2">
            {correct} of {questions.length} correct
          </h2>
          <p className="text-body text-ink-2 leading-relaxed max-w-md mx-auto">
            {score >= 0.85
              ? 'Exam ready. Keep the review queue clear and this will hold.'
              : score >= 0.7
                ? 'Close. The breakdown below shows which kind of question is costing you marks.'
                : score >= 0.5
                  ? 'A reasonable foundation with real gaps. Work through the lessons listed below rather than re-reading everything.'
                  : 'Worth going back through the modules properly. This score is information, not a verdict: it tells you exactly where to spend your time.'}
          </p>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <Silk className="block mb-2.5">How you did by kind of question</Silk>
            <div className="space-y-2.5">
              <ScoreBar label="Recall and understanding" value={recallScore} note="Levels 1–2" />
              <ScoreBar label="Application and reasoning" value={applyScore} note="Levels 3–4" />
              <ScoreBar label="Exam-style structured" value={examScore} note="Level 5" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-plastic-edge">
            {strongConcepts.length > 0 && (
              <div>
                <Silk className="block mb-2" style={{ color: 'var(--ok)' }}>
                  Strong
                </Silk>
                <ul className="space-y-1">
                  {strongConcepts.map((c) => (
                    <li key={c} className="flex items-center gap-2 text-small">
                      <Icon name="check" size={13} className="text-ok shrink-0" strokeWidth={2.4} />
                      <span className="truncate">{conceptById.get(c)?.title ?? c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {weakLessons.length > 0 && (
              <div>
                <Silk className="block mb-2" style={{ color: 'var(--warn)' }}>
                  Go back to these
                </Silk>
                <ul className="space-y-1">
                  {weakLessons.map((id) => (
                    <li key={id}>
                      <Link
                        to={`/lesson/${id}`}
                        className="flex items-center gap-2 text-small hover:underline underline-offset-2"
                      >
                        <span aria-hidden className="text-warn font-bold shrink-0">
                          !
                        </span>
                        <span className="truncate">{lessonById.get(id)?.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-plastic-edge flex flex-wrap gap-2">
            <Button variant="primary" onClick={() => setPhase('intro')}>
              <Icon name="refresh" size={15} />
              Try again
            </Button>
            <Button to="/review">Go to review queue</Button>
            <Button variant="ghost" to="/path">
              Back to the course
            </Button>
          </div>
        </div>
      </Card>

      {score >= 0.75 && <MasteredBanner score={score} />}
    </section>
  )
}

function pct(map: Map<number, { correct: number; total: number }>, levels: number[]): number {
  let c = 0
  let t = 0
  for (const lv of levels) {
    const e = map.get(lv)
    if (e) {
      c += e.correct
      t += e.total
    }
  }
  return t ? c / t : 0
}

function ScoreBar({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <span className="text-small">{label}</span>
        <span className="num text-small font-semibold">{Math.round(value * 100)}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-plastic-sunk overflow-hidden" style={{ boxShadow: 'var(--sink)' }}>
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{
            width: `${value * 100}%`,
            background: value >= 0.75 ? 'var(--ok)' : value >= 0.5 ? 'var(--warn)' : 'var(--no)',
          }}
        />
      </div>
      <p className="text-meta text-ink-faint mt-1">{note}</p>
    </div>
  )
}

/** The mastered state. Rewarding, and deliberately not childish: no confetti,
 *  no badge, just a clear statement of what was achieved and what is next. */
function MasteredBanner({ score }: { score: number }) {
  return (
    <Card
      seated
      className="overflow-hidden"
      style={{ borderColor: 'var(--ok)' }}
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2.5 mb-3">
          <span
            aria-hidden
            className="w-8 h-8 rounded-full grid place-items-center text-white shrink-0"
            style={{ background: 'var(--ok)' }}
          >
            <Icon name="check" size={17} strokeWidth={2.6} />
          </span>
          <Silk style={{ color: 'var(--ok)' }}>Unit mastered</Silk>
        </div>
        <h3 className="text-h3 font-semibold mb-2">
          You have covered this unit end to end
        </h3>
        <p className="text-body text-ink-2 leading-relaxed mb-4">
          Scoring {Math.round(score * 100)}% across all five levels means you can recall the
          definitions, explain the mechanisms, apply them to unfamiliar situations, and answer a
          full structured question. That is what being ready for this unit looks like.
        </p>
        <ul className="space-y-1.5 mb-5">
          {[
            'IoT, its applications, enabling technologies and challenges',
            'Embedded systems, microcontrollers and microprocessors',
            'The Arduino Uno part by part, and the wider board family',
            'Components, accessories and all twenty sensors',
            'Arduino programming and the four practical circuits',
          ].map((s) => (
            <li key={s} className="flex gap-2.5 text-body text-ink-2">
              <Icon name="check" size={14} className="mt-1 shrink-0 text-ok" strokeWidth={2.2} />
              {s}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">
          <Button to="/review" variant="primary">
            Keep it fresh with review
          </Button>
          <Button to="/lab">Build something in the lab</Button>
        </div>
      </div>
    </Card>
  )
}
