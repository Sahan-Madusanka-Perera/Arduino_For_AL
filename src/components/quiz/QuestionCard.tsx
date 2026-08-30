import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Level, Question } from '@/types/content'
import { LEVEL_NAMES } from '@/types/content'
import { lessonById } from '@/content'
import { useProgress } from '@/store/progress'
import { Button, Chip, Icon, Silk, LiveRegion, cx } from '@/components/ui'
import { Inline, Markdown } from '@/components/learning/Markdown'

/* ============================================================================
   One question, every type.

   The rule this file follows: a wrong answer is never just "wrong". The
   student is told what they chose, what the answer is, why, and where the
   confusion probably came from. Feedback is the teaching, not the scoring.
   ========================================================================== */

export interface AnswerResult {
  correct: boolean
  /** 0..1 for partially-correct types. */
  partial?: number
}

export function QuestionCard({
  question,
  onAnswered,
  showLevel = true,
  autoFocus,
}: {
  question: Question
  onAnswered?: (r: AnswerResult) => void
  showLevel?: boolean
  autoFocus?: boolean
}) {
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<AnswerResult | null>(null)
  const [payload, setPayload] = useState<unknown>(null)
  const record = useProgress((s) => s.answer)
  const saved = useProgress((s) => s.savedQuestions.includes(question.id))
  const toggleSaved = useProgress((s) => s.toggleSavedQuestion)
  const feedbackRef = useRef<HTMLDivElement>(null)
  const lesson = lessonById.get(question.lessonId)

  // A fresh question resets everything, so the same card can be reused in a
  // practice run without stale state leaking between questions.
  useEffect(() => {
    setSubmitted(false)
    setResult(null)
    setPayload(null)
  }, [question.id])

  function submit(r: AnswerResult) {
    if (submitted) return
    setSubmitted(true)
    setResult(r)
    record({
      questionId: question.id,
      conceptId: question.conceptId,
      level: question.level,
      correct: r.correct,
      partial: r.partial,
    })
    onAnswered?.(r)
    requestAnimationFrame(() => feedbackRef.current?.focus())
  }

  return (
    <div
      className={cx(
        'rounded-lg border bg-plastic-raised overflow-hidden transition-colors',
        submitted && result?.correct && 'border-ok-edge',
        submitted && !result?.correct && 'border-no-edge',
        !submitted && 'border-plastic-edge',
      )}
      style={{ boxShadow: 'var(--lift-1)' }}
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-plastic-edge bg-plastic">
        {showLevel && (
          <>
            <LevelPips level={question.level} />
            <Silk>{LEVEL_NAMES[question.level]}</Silk>
          </>
        )}
        <span className="silk text-ink-faint">{TYPE_LABEL[question.type]}</span>
        <button
          onClick={() => toggleSaved(question.id)}
          aria-pressed={saved}
          className="ml-auto w-9 h-9 -my-1 grid place-items-center rounded-sm text-ink-faint hover:text-ink hover:bg-plastic-sunk transition-colors"
          aria-label={saved ? 'Remove from saved questions' : 'Save this question for later'}
          title={saved ? 'Saved' : 'Save for later'}
        >
          <Icon name="bookmark" size={15} className={saved ? 'text-signal-high' : undefined} />
        </button>
      </div>

      <div className="p-4 sm:p-5">
        <div className="text-lead leading-relaxed font-medium mb-4">
          <Markdown text={question.prompt} />
        </div>

        <Input
          question={question}
          submitted={submitted}
          onChange={setPayload}
          onSubmit={submit}
          autoFocus={autoFocus}
        />

        {!submitted && (
          <div className="mt-4">
            <SubmitButton question={question} payload={payload} onSubmit={submit} />
          </div>
        )}

        {submitted && result && (
          <div
            ref={feedbackRef}
            tabIndex={-1}
            className={cx(
              'mt-4 rounded-md border p-4 outline-none seat-in',
              result.correct ? 'border-ok-edge bg-ok-field' : 'border-no-edge bg-no-field',
            )}
          >
            <div className="flex items-center gap-2 mb-2.5">
              <span
                aria-hidden
                className="w-6 h-6 grid place-items-center rounded-full shrink-0"
                style={{ background: result.correct ? 'var(--ok)' : 'var(--no)', color: '#fff' }}
              >
                <Icon name={result.correct ? 'check' : 'cross'} size={13} strokeWidth={2.6} />
              </span>
              <span
                className="silk-lg"
                style={{ color: result.correct ? 'var(--ok)' : 'var(--no)' }}
              >
                {result.correct
                  ? 'Correct'
                  : result.partial && result.partial > 0
                    ? 'Partly right'
                    : 'Not quite'}
              </span>
            </div>

            <WrongChoice question={question} payload={payload} correct={result.correct} />

            <div className="text-body text-ink-2 leading-relaxed">
              <Markdown text={question.explanation} />
            </div>

            {!result.correct && lesson && (
              <p className="mt-3 pt-3 border-t border-plastic-edge text-small">
                <Link
                  to={`/lesson/${lesson.id}`}
                  className="inline-flex items-center min-h-6 font-semibold underline decoration-ink-faint underline-offset-2 hover:decoration-ink"
                >
                  Go back to: {lesson.title}
                </Link>
                <span className="text-ink-3"> — we will bring this concept back later too.</span>
              </p>
            )}
          </div>
        )}
      </div>

      <LiveRegion
        message={
          submitted && result
            ? `${result.correct ? 'Correct.' : 'Not quite.'} ${question.explanation.replace(/\*\*/g, '')}`
            : ''
        }
      />
    </div>
  )
}

const TYPE_LABEL: Record<Question['type'], string> = {
  mcq: 'Choose one',
  multi: 'Choose all that apply',
  truefalse: 'True or false',
  blank: 'Fill the blank',
  match: 'Match the pairs',
  order: 'Put in order',
  hotspot: 'Identify on the diagram',
  numeric: 'Give a number',
  structured: 'Written answer',
}

function LevelPips({ level }: { level: Level }) {
  return (
    <span className="flex gap-[3px]" role="img" aria-label={`Difficulty ${level} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="w-[5px] h-[5px] rounded-[1px]"
          style={{
            background: i <= level ? 'var(--ink-2)' : 'var(--hole-empty)',
          }}
        />
      ))}
    </span>
  )
}

/* -------------------------------------------------------- the inputs --- */

function Input({
  question,
  submitted,
  onChange,
  onSubmit,
  autoFocus,
}: {
  question: Question
  submitted: boolean
  onChange: (v: unknown) => void
  onSubmit: (r: AnswerResult) => void
  autoFocus?: boolean
}) {
  switch (question.type) {
    case 'mcq':
      return <McqInput q={question} submitted={submitted} onChange={onChange} />
    case 'multi':
      return <MultiInput q={question} submitted={submitted} onChange={onChange} />
    case 'truefalse':
      return <TrueFalseInput q={question} submitted={submitted} onChange={onChange} />
    case 'blank':
      return <BlankInput q={question} submitted={submitted} onChange={onChange} autoFocus={autoFocus} />
    case 'numeric':
      return <NumericInput q={question} submitted={submitted} onChange={onChange} autoFocus={autoFocus} />
    case 'match':
      return <MatchInput q={question} submitted={submitted} onChange={onChange} />
    case 'order':
      return <OrderInput q={question} submitted={submitted} onChange={onChange} />
    case 'structured':
      return <StructuredInput q={question} submitted={submitted} onSubmit={onSubmit} />
    default:
      return null
  }
}

function SubmitButton({
  question,
  payload,
  onSubmit,
}: {
  question: Question
  payload: unknown
  onSubmit: (r: AnswerResult) => void
}) {
  if (question.type === 'structured') return null

  const ready = isReady(question, payload)

  return (
    <Button
      variant="primary"
      disabled={!ready}
      onClick={() => onSubmit(grade(question, payload))}
    >
      Check answer
      <Icon name="arrowRight" size={15} />
    </Button>
  )
}

function isReady(q: Question, p: unknown): boolean {
  switch (q.type) {
    case 'mcq':
      return typeof p === 'string' && p.length > 0
    case 'multi':
      return Array.isArray(p) && p.length > 0
    case 'truefalse':
      return typeof p === 'boolean'
    case 'blank':
      return typeof p === 'string' && p.trim().length > 0
    case 'numeric':
      return typeof p === 'string' && p.trim().length > 0 && !Number.isNaN(Number(p))
    case 'match':
      return !!p && Object.keys(p as object).length === q.left.length
    case 'order':
      return Array.isArray(p) && p.length === q.items.length
    default:
      return false
  }
}

function grade(q: Question, p: unknown): AnswerResult {
  switch (q.type) {
    case 'mcq':
      return { correct: p === q.correct }
    case 'multi': {
      const chosen = new Set(p as string[])
      const right = new Set(q.correct)
      const hits = [...right].filter((x) => chosen.has(x)).length
      const wrong = [...chosen].filter((x) => !right.has(x)).length
      const score = Math.max(0, (hits - wrong) / right.size)
      return { correct: score === 1, partial: score }
    }
    case 'truefalse':
      return { correct: p === q.correct }
    case 'blank': {
      const norm = String(p).trim().toLowerCase().replace(/\s+/g, ' ')
      return { correct: q.accept.some((a) => a.toLowerCase() === norm) }
    }
    case 'numeric': {
      const n = Number(p)
      const tol = q.tolerance ?? 0
      return { correct: Math.abs(n - q.correct) <= tol }
    }
    case 'match': {
      const map = p as Record<string, string>
      const total = Object.keys(q.correct).length
      const hits = Object.entries(q.correct).filter(([k, v]) => map[k] === v).length
      return { correct: hits === total, partial: hits / total }
    }
    case 'order': {
      const order = p as string[]
      const hits = order.filter((id, i) => id === q.correct[i]).length
      return { correct: hits === q.correct.length, partial: hits / q.correct.length }
    }
    default:
      return { correct: false }
  }
}

/** Shows the student exactly what they picked and, where the content provides
 *  one, why that choice is tempting. This is where most of the learning from a
 *  wrong answer actually happens. */
function WrongChoice({
  question,
  payload,
  correct,
}: {
  question: Question
  payload: unknown
  correct: boolean
}) {
  if (correct) return null

  if (question.type === 'mcq') {
    const chosen = question.options.find((o) => o.id === payload)
    const right = question.options.find((o) => o.id === question.correct)
    const why = question.distractors?.[String(payload)]
    return (
      <div className="mb-3 space-y-1.5 text-body">
        {chosen && (
          <p>
            <span className="silk mr-2">You chose</span>
            <span className="text-ink-2">{chosen.text}</span>
          </p>
        )}
        {right && (
          <p>
            <span className="silk mr-2">Answer</span>
            <span className="font-semibold">{right.text}</span>
          </p>
        )}
        {why && (
          <p className="text-small text-ink-3 leading-snug pt-1">
            <Inline text={why} />
          </p>
        )}
      </div>
    )
  }

  if (question.type === 'truefalse') {
    return (
      <div className="mb-3 text-body">
        <p>
          <span className="silk mr-2">Answer</span>
          <span className="font-semibold">{question.correct ? 'True' : 'False'}</span>
        </p>
        {question.probes && (
          <p className="text-small text-ink-3 leading-snug mt-1.5">
            This one is testing whether you have mixed up: <Inline text={question.probes} />
          </p>
        )}
      </div>
    )
  }

  if (question.type === 'blank') {
    return (
      <p className="mb-3 text-body">
        <span className="silk mr-2">Answer</span>
        <span className="font-semibold">{question.accept[0]}</span>
      </p>
    )
  }

  if (question.type === 'numeric') {
    return (
      <p className="mb-3 text-body">
        <span className="silk mr-2">Answer</span>
        <span className="num font-semibold">
          {question.correct}
          {question.unit ? ` ${question.unit}` : ''}
        </span>
      </p>
    )
  }

  return null
}

/* --------------------------------------------------------------- MCQ --- */

function McqInput({
  q,
  submitted,
  onChange,
}: {
  q: Extract<Question, { type: 'mcq' }>
  submitted: boolean
  onChange: (v: unknown) => void
}) {
  const [sel, setSel] = useState<string | null>(null)
  const name = useId()

  useEffect(() => {
    setSel(null)
  }, [q.id])

  return (
    <fieldset disabled={submitted} className="space-y-2 border-0 p-0 m-0">
      <legend className="sr-only">Select one answer</legend>
      {q.options.map((o) => {
        const chosen = sel === o.id
        const isRight = submitted && o.id === q.correct
        const isWrongPick = submitted && chosen && o.id !== q.correct
        return (
          <label
            key={o.id}
            className={cx(
              'flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors min-h-[44px]',
              submitted && 'cursor-default',
              isRight
                ? 'border-ok bg-ok-field'
                : isWrongPick
                  ? 'border-no bg-no-field'
                  : chosen
                    ? 'border-ink bg-plastic-sunk'
                    : 'border-plastic-edge hover:border-ink-faint hover:bg-plastic-sunk',
            )}
          >
            <input
              type="radio"
              name={name}
              value={o.id}
              checked={chosen}
              onChange={() => {
                setSel(o.id)
                onChange(o.id)
              }}
              className="sr-only"
            />
            <span
              aria-hidden
              className={cx(
                'shrink-0 w-6 h-6 mt-px rounded-sm border-2 grid place-items-center text-silk font-bold num',
              )}
              style={{
                borderColor: isRight
                  ? 'var(--ok)'
                  : isWrongPick
                    ? 'var(--no)'
                    : chosen
                      ? 'var(--ink)'
                      : 'var(--plastic-edge)',
                background: isRight
                  ? 'var(--ok)'
                  : isWrongPick
                    ? 'var(--no)'
                    : chosen
                      ? 'var(--ink)'
                      : 'transparent',
                color: isRight || isWrongPick || chosen ? '#fff' : 'var(--ink-3)',
              }}
            >
              {o.id.toUpperCase()}
            </span>
            <span className="text-body leading-snug pt-0.5 flex-1">{o.text}</span>
            {submitted && (isRight || isWrongPick) && (
              <span
                aria-hidden
                className="shrink-0 mt-0.5"
                style={{ color: isRight ? 'var(--ok)' : 'var(--no)' }}
              >
                <Icon name={isRight ? 'check' : 'cross'} size={16} strokeWidth={2.6} />
              </span>
            )}
          </label>
        )
      })}
    </fieldset>
  )
}

/* ------------------------------------------------------------- multi --- */

function MultiInput({
  q,
  submitted,
  onChange,
}: {
  q: Extract<Question, { type: 'multi' }>
  submitted: boolean
  onChange: (v: unknown) => void
}) {
  const [sel, setSel] = useState<string[]>([])

  useEffect(() => {
    setSel([])
  }, [q.id])

  function toggle(id: string) {
    const next = sel.includes(id) ? sel.filter((s) => s !== id) : [...sel, id]
    setSel(next)
    onChange(next)
  }

  return (
    <fieldset disabled={submitted} className="space-y-2 border-0 p-0 m-0">
      <legend className="silk mb-2">Select every correct option</legend>
      {q.options.map((o) => {
        const chosen = sel.includes(o.id)
        const isRight = submitted && q.correct.includes(o.id)
        const isWrongPick = submitted && chosen && !q.correct.includes(o.id)
        return (
          <label
            key={o.id}
            className={cx(
              'flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors min-h-[44px]',
              submitted && 'cursor-default',
              isRight
                ? 'border-ok bg-ok-field'
                : isWrongPick
                  ? 'border-no bg-no-field'
                  : chosen
                    ? 'border-ink bg-plastic-sunk'
                    : 'border-plastic-edge hover:border-ink-faint',
            )}
          >
            <input type="checkbox" checked={chosen} onChange={() => toggle(o.id)} className="sr-only" />
            <span
              aria-hidden
              className="shrink-0 w-6 h-6 mt-px rounded-hair border-2 grid place-items-center text-silk font-bold"
              style={{
                borderColor: isRight
                  ? 'var(--ok)'
                  : isWrongPick
                    ? 'var(--no)'
                    : chosen
                      ? 'var(--ink)'
                      : 'var(--plastic-edge)',
                background: isRight
                  ? 'var(--ok)'
                  : isWrongPick
                    ? 'var(--no)'
                    : chosen
                      ? 'var(--ink)'
                      : 'transparent',
                color: '#fff',
              }}
            >
              {(isRight || chosen) && !isWrongPick && <Icon name="check" size={12} strokeWidth={3} />}
              {isWrongPick && <Icon name="cross" size={12} strokeWidth={3} />}
            </span>
            <span className="text-body leading-snug pt-0.5">{o.text}</span>
          </label>
        )
      })}
    </fieldset>
  )
}

/* -------------------------------------------------------- true/false --- */

function TrueFalseInput({
  q,
  submitted,
  onChange,
}: {
  q: Extract<Question, { type: 'truefalse' }>
  submitted: boolean
  onChange: (v: unknown) => void
}) {
  const [sel, setSel] = useState<boolean | null>(null)

  useEffect(() => {
    setSel(null)
  }, [q.id])

  return (
    <div className="grid grid-cols-2 gap-2">
      {[true, false].map((v) => {
        const chosen = sel === v
        const isRight = submitted && v === q.correct
        const isWrongPick = submitted && chosen && v !== q.correct
        return (
          <button
            key={String(v)}
            disabled={submitted}
            onClick={() => {
              setSel(v)
              onChange(v)
            }}
            aria-pressed={chosen}
            className={cx(
              'h-14 rounded-md border-2 font-semibold text-body transition-colors',
              isRight
                ? 'border-ok bg-ok-field text-ok'
                : isWrongPick
                  ? 'border-no bg-no-field text-no'
                  : chosen
                    ? 'border-ink bg-plastic-sunk'
                    : 'border-plastic-edge hover:border-ink-faint',
            )}
          >
            {v ? 'True' : 'False'}
            {isRight && (
              <span className="ml-2" aria-hidden>
                <Icon name="check" size={15} strokeWidth={2.6} />
              </span>
            )}
            {isWrongPick && (
              <span className="ml-2" aria-hidden>
                <Icon name="cross" size={15} strokeWidth={2.6} />
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------- blank --- */

function BlankInput({
  q,
  submitted,
  onChange,
  autoFocus,
}: {
  q: Extract<Question, { type: 'blank' }>
  submitted: boolean
  onChange: (v: unknown) => void
  autoFocus?: boolean
}) {
  const [value, setValue] = useState('')
  const id = useId()

  useEffect(() => {
    setValue('')
  }, [q.id])

  return (
    <div>
      <label htmlFor={id} className="silk block mb-2">
        Your answer
      </label>
      <input
        id={id}
        value={value}
        disabled={submitted}
        autoFocus={autoFocus}
        onChange={(e) => {
          setValue(e.target.value)
          onChange(e.target.value)
        }}
        placeholder={q.placeholder}
        autoComplete="off"
        className="num w-full h-12 px-3 rounded-md border border-plastic-edge bg-plastic-sunk text-body disabled:opacity-70"
      />
    </div>
  )
}

/* ----------------------------------------------------------- numeric --- */

function NumericInput({
  q,
  submitted,
  onChange,
  autoFocus,
}: {
  q: Extract<Question, { type: 'numeric' }>
  submitted: boolean
  onChange: (v: unknown) => void
  autoFocus?: boolean
}) {
  const [value, setValue] = useState('')
  const id = useId()

  useEffect(() => {
    setValue('')
  }, [q.id])

  return (
    <div>
      <label htmlFor={id} className="silk block mb-2">
        Your answer{q.unit ? ` (${q.unit})` : ''}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={value}
          disabled={submitted}
          autoFocus={autoFocus}
          onChange={(e) => {
            setValue(e.target.value)
            onChange(e.target.value)
          }}
          autoComplete="off"
          className="num w-40 h-12 px-3 rounded-md border border-plastic-edge bg-plastic-sunk text-lead font-semibold disabled:opacity-70"
        />
        {q.unit && <span className="num text-ink-3">{q.unit}</span>}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------- match --- */

function MatchInput({
  q,
  submitted,
  onChange,
}: {
  q: Extract<Question, { type: 'match' }>
  submitted: boolean
  onChange: (v: unknown) => void
}) {
  const [map, setMap] = useState<Record<string, string>>({})

  useEffect(() => {
    setMap({})
  }, [q.id])

  function set(left: string, right: string) {
    const next = { ...map, [left]: right }
    setMap(next)
    onChange(next)
  }

  return (
    <div className="space-y-2">
      <p className="silk">Choose the matching item for each</p>
      {q.left.map((l) => {
        const chosen = map[l.id]
        const isRight = submitted && chosen === q.correct[l.id]
        return (
          <div
            key={l.id}
            className={cx(
              'grid sm:grid-cols-[1fr_auto] gap-2 sm:items-center p-3 rounded-md border',
              isRight
                ? 'border-ok bg-ok-field'
                : submitted
                  ? 'border-no bg-no-field'
                  : 'border-plastic-edge',
            )}
          >
            <span className="text-body leading-snug">{l.text}</span>
            <div className="flex items-center gap-2">
              <select
                value={chosen ?? ''}
                disabled={submitted}
                onChange={(e) => set(l.id, e.target.value)}
                aria-label={`Match for: ${l.text}`}
                className="h-11 min-w-[180px] max-w-full px-2.5 rounded-sm border border-plastic-edge bg-plastic-sunk text-small"
              >
                <option value="">Choose…</option>
                {q.right.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.text}
                  </option>
                ))}
              </select>
              {submitted && (
                <span aria-hidden style={{ color: isRight ? 'var(--ok)' : 'var(--no)' }}>
                  <Icon name={isRight ? 'check' : 'cross'} size={15} strokeWidth={2.6} />
                </span>
              )}
            </div>
            {submitted && !isRight && (
              <p className="sm:col-span-2 text-fine text-ink-3">
                Correct match: {q.right.find((r) => r.id === q.correct[l.id])?.text}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------- order --- */

/** Ordering without dragging. Up and down buttons work with a mouse, a
 *  fingertip, a keyboard and a screen reader equally, which drag-and-drop
 *  does not. */
function OrderInput({
  q,
  submitted,
  onChange,
}: {
  q: Extract<Question, { type: 'order' }>
  submitted: boolean
  onChange: (v: unknown) => void
}) {
  const shuffled = useMemo(() => {
    // Deterministic shuffle from the question id, so the same question always
    // presents in the same order and a student can compare attempts.
    const seed = [...q.id].reduce((a, c) => a + c.charCodeAt(0), 0)
    const arr = [...q.items]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (seed * (i + 7)) % (i + 1)
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr.map((i) => i.id)
  }, [q.id, q.items])

  const [order, setOrder] = useState<string[]>(shuffled)
  const [announce, setAnnounce] = useState('')

  useEffect(() => {
    setOrder(shuffled)
    onChange(shuffled)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.id])

  function move(i: number, dir: -1 | 1) {
    const j = i + dir
    if (j < 0 || j >= order.length) return
    const next = [...order]
    ;[next[i], next[j]] = [next[j], next[i]]
    setOrder(next)
    onChange(next)
    const label = q.items.find((x) => x.id === next[j])?.text ?? ''
    setAnnounce(`${label} moved to position ${j + 1} of ${next.length}`)
  }

  return (
    <div>
      <p className="silk mb-2">Put these in the correct order, top to bottom</p>
      <ol className="space-y-2">
        {order.map((id, i) => {
          const item = q.items.find((x) => x.id === id)!
          const isRight = submitted && q.correct[i] === id
          return (
            <li
              key={id}
              className={cx(
                'flex items-center gap-2 p-2 pl-3 rounded-md border',
                isRight
                  ? 'border-ok bg-ok-field'
                  : submitted
                    ? 'border-no bg-no-field'
                    : 'border-plastic-edge bg-plastic-sunk',
              )}
            >
              <span className="num text-fine font-bold text-ink-faint w-5 shrink-0">
                {i + 1}
              </span>
              <span className="flex-1 text-body leading-snug">{item.text}</span>
              {submitted ? (
                <span aria-hidden className="shrink-0" style={{ color: isRight ? 'var(--ok)' : 'var(--no)' }}>
                  <Icon name={isRight ? 'check' : 'cross'} size={15} strokeWidth={2.6} />
                </span>
              ) : (
                <span className="flex gap-1 shrink-0">
                  <button
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label={`Move "${item.text}" up`}
                    className="w-9 h-9 grid place-items-center rounded-sm border border-plastic-edge bg-plastic-raised disabled:opacity-35 hover:border-ink-faint"
                  >
                    <Icon name="arrowUp" size={14} />
                  </button>
                  <button
                    onClick={() => move(i, 1)}
                    disabled={i === order.length - 1}
                    aria-label={`Move "${item.text}" down`}
                    className="w-9 h-9 grid place-items-center rounded-sm border border-plastic-edge bg-plastic-raised disabled:opacity-35 hover:border-ink-faint"
                  >
                    <Icon name="arrowDown" size={14} />
                  </button>
                </span>
              )}
            </li>
          )
        })}
      </ol>
      {submitted && (
        <div className="mt-3 p-3 rounded-md bg-plastic-sunk border border-plastic-edge">
          <Silk className="block mb-1.5">Correct order</Silk>
          <ol className="space-y-0.5">
            {q.correct.map((id, i) => (
              <li key={id} className="text-small text-ink-2">
                <span className="num text-ink-faint mr-2">{i + 1}.</span>
                {q.items.find((x) => x.id === id)?.text}
              </li>
            ))}
          </ol>
        </div>
      )}
      <LiveRegion message={announce} />
    </div>
  )
}

/* -------------------------------------------------------- structured --- */

/** A written answer, self-marked against the mark scheme.
 *
 *  There is deliberately no AI grading here. A rubric the student applies
 *  themselves is free, works offline, and forces them to actually read a mark
 *  scheme, which is the skill the written paper rewards. */
function StructuredInput({
  q,
  submitted,
  onSubmit,
}: {
  q: Extract<Question, { type: 'structured' }>
  submitted: boolean
  onSubmit: (r: AnswerResult) => void
}) {
  const [answer, setAnswer] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [ticks, setTicks] = useState<boolean[]>(() => q.markScheme.map(() => false))
  const id = useId()

  useEffect(() => {
    setAnswer('')
    setRevealed(false)
    setTicks(q.markScheme.map(() => false))
  }, [q.id, q.markScheme])

  const awarded = q.markScheme.reduce((sum, m, i) => sum + (ticks[i] ? m.marks : 0), 0)

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={id} className="silk block mb-2">
          Your answer · {q.marks} marks
        </label>
        <textarea
          id={id}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={7}
          disabled={submitted}
          placeholder="Write your full answer here, as you would in the exam. Use the mark allocation to judge how much to write."
          className="w-full p-3 rounded-md border border-plastic-edge bg-plastic-sunk text-body leading-relaxed resize-y disabled:opacity-80"
        />
        <p className="text-meta text-ink-3 mt-1.5">
          {q.marks} marks usually means {q.marks} separate points. Nothing you write leaves this
          device.
        </p>
      </div>

      {!revealed ? (
        <Button
          variant="primary"
          disabled={answer.trim().length < 10}
          onClick={() => setRevealed(true)}
        >
          Reveal the mark scheme
          <Icon name="arrowRight" size={15} />
        </Button>
      ) : (
        <div className="rounded-md border border-plastic-edge bg-plastic-sunk p-4">
          <div className="flex items-baseline justify-between gap-3 mb-3">
            <Silk>Mark scheme · tick every point you made</Silk>
            <span className="num text-plain font-bold" aria-live="polite">
              {awarded}/{q.marks}
            </span>
          </div>
          <ul className="space-y-2 mb-4">
            {q.markScheme.map((m, i) => (
              <li key={m.point}>
                <label className="flex items-start gap-3 cursor-pointer min-h-[44px] py-1">
                  <input
                    type="checkbox"
                    checked={ticks[i]}
                    disabled={submitted}
                    onChange={() =>
                      setTicks((t) => t.map((v, j) => (i === j ? !v : v)))
                    }
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    className="shrink-0 w-6 h-6 mt-0.5 rounded-hair border-2 grid place-items-center text-silk font-bold"
                    style={{
                      borderColor: ticks[i] ? 'var(--ok)' : 'var(--plastic-edge)',
                      background: ticks[i] ? 'var(--ok)' : 'transparent',
                      color: '#fff',
                    }}
                  >
                    {ticks[i] && <Icon name="check" size={12} strokeWidth={3} />}
                  </span>
                  <span className="text-body leading-snug flex-1">
                    {m.point}
                    <span className="num text-ink-faint ml-2">[{m.marks}]</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
          {!submitted && (
            <Button
              variant="primary"
              onClick={() =>
                onSubmit({
                  correct: awarded / q.marks >= 0.8,
                  partial: awarded / q.marks,
                })
              }
            >
              Record {awarded} of {q.marks}
            </Button>
          )}
          {submitted && (
            <Chip tone={awarded / q.marks >= 0.8 ? 'ok' : awarded / q.marks >= 0.5 ? 'warn' : 'no'}>
              Recorded {awarded}/{q.marks}
            </Chip>
          )}
        </div>
      )}
    </div>
  )
}
