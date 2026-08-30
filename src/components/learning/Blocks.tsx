import { useEffect, useMemo, useRef, useState } from 'react'
import type { Block, CalloutVariant } from '@/types/content'
import { questionById } from '@/content'
import { useProgress } from '@/store/progress'
import { Button, Card, Chip, Icon, Silk, LiveRegion, cx } from '@/components/ui'
import { FIGURES, PartArt } from '@/components/viz'
import { Inline, Markdown } from './Markdown'
import { Bench } from './Bench'
import { QuestionCard } from '@/components/quiz/QuestionCard'

/* Renders one content block. Every block that requires the student to *do*
   something reports back through onEngage, which is what feeds the "engaged"
   list in progress. Scrolling past a block never counts. */

export function BlockRenderer({
  block,
  lessonId,
  onEngage,
}: {
  block: Block
  lessonId: string
  onEngage: (blockId: string) => void
}) {
  const engage = () => onEngage(block.id)

  switch (block.kind) {
    case 'prose':
      return (
        <section id={block.id} className="scroll-mt-24">
          {block.heading && (
            <h2 className="text-h3 sm:text-h4 font-semibold mt-9 mb-3">{block.heading}</h2>
          )}
          <Markdown
            text={block.text}
            className={cx(
              'leading-relaxed text-ink-2',
              block.tone === 'lead' ? 'text-intro sm:text-intro' : 'text-lead',
            )}
          />
        </section>
      )

    case 'definition':
      return <DefinitionBlock key={block.id} block={block} />

    case 'analogy':
      return <AnalogyBlock key={block.id} block={block} />

    case 'callout':
      return <CalloutBlock key={block.id} block={block} />

    case 'figure':
      return <FigureBlock key={block.id} block={block} />

    case 'compare':
      return <CompareBlock key={block.id} block={block} />

    case 'recall':
      return <RecallBlock key={block.id} block={block} onEngage={engage} />

    case 'code':
      return <CodeBlock key={block.id} block={block} />

    case 'bench':
      return (
        <div id={block.id} className="scroll-mt-24">
          <Bench
            presetId={block.preset}
            title={block.title}
            brief={block.brief}
            onEngage={engage}
          />
        </div>
      )

    case 'sort':
      return <SortBlock key={block.id} block={block} onEngage={engage} />

    case 'order':
      return <OrderBlock key={block.id} block={block} onEngage={engage} />

    case 'explain':
      return <ExplainBlock key={block.id} block={block} onEngage={engage} />

    case 'checkpoint':
      return <CheckpointBlock key={block.id} block={block} lessonId={lessonId} onEngage={engage} />

    case 'gallery':
      return <GalleryBlock key={block.id} block={block} onEngage={engage} />

    case 'steps':
      return <StepsBlock key={block.id} block={block} />

    default:
      return null
  }
}

/* ------------------------------------------------------- definition ---- */

function DefinitionBlock({ block }: { block: Extract<Block, { kind: 'definition' }> }) {
  return (
    <Card id={block.id} seated className="my-6 scroll-mt-24 overflow-hidden">
      <div className="px-4 sm:px-5 py-3 border-b border-plastic-edge bg-plastic-sunk flex items-center gap-2 flex-wrap">
        <Silk>Definition</Silk>
        <h2 className="text-lead font-semibold">{block.term}</h2>
        {block.provenance === 'syllabus' && (
          <Chip tone="info" className="ml-auto">
            Syllabus wording
          </Chip>
        )}
      </div>
      <div className="p-4 sm:p-5 space-y-4">
        <div>
          <Silk className="block mb-1.5">In plain words</Silk>
          <p className="text-lead leading-relaxed">
            <Inline text={block.simple} />
          </p>
        </div>
        <div>
          <Silk className="block mb-1.5">Write this in the exam</Silk>
          <p className="text-plain leading-relaxed text-ink-2 p-3.5 rounded-md bg-plastic-sunk border border-plastic-edge">
            <Inline text={block.technical} />
          </p>
        </div>
        {block.example && (
          <div>
            <Silk className="block mb-1.5">Example</Silk>
            <p className="text-body leading-relaxed text-ink-2">
              <Inline text={block.example} />
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}

/* ---------------------------------------------------------- analogy ---- */

function AnalogyBlock({ block }: { block: Extract<Block, { kind: 'analogy' }> }) {
  return (
    <Card
      id={block.id}
      className="my-6 scroll-mt-24 overflow-hidden"
      style={{ borderLeftWidth: 3, borderLeftColor: 'var(--wire-yellow)' }}
    >
      <div className="p-4 sm:p-5">
        <Silk className="block mb-1.5">Think of it like this</Silk>
        <h2 className="text-lead font-semibold mb-2.5">{block.title}</h2>
        <p className="text-lead leading-relaxed text-ink-2 mb-4">
          <Inline text={block.analogy} />
        </p>

        <Silk className="block mb-2">Which maps onto</Silk>
        <dl className="space-y-1.5">
          {block.mapping.map((m) => (
            <div
              key={m.from}
              className="grid sm:grid-cols-[1fr_auto_1fr] gap-1 sm:gap-3 sm:items-baseline py-1.5 border-b border-plastic-edge last:border-0"
            >
              <dt className="text-body text-ink-3">
                <Inline text={m.from} />
              </dt>
              <span aria-hidden className="hidden sm:block text-ink-faint">
                <Icon name="arrowRight" size={15} />
              </span>
              <dd className="text-body font-medium">
                <Inline text={m.to} />
              </dd>
            </div>
          ))}
        </dl>

        {block.limits && (
          <p className="mt-4 pt-3 border-t border-plastic-edge text-small text-ink-3 leading-relaxed">
            <span className="silk mr-2">Where it breaks down</span>
            <Inline text={block.limits} />
          </p>
        )}
      </div>
    </Card>
  )
}

/* ---------------------------------------------------------- callout ---- */

const CALLOUT: Record<
  CalloutVariant,
  { label: string; icon: string; field: string; edge: string; ink: string }
> = {
  misconception: {
    label: 'Common mistake',
    icon: 'cross',
    field: 'var(--warn-field)',
    edge: 'var(--warn-edge)',
    ink: 'var(--warn)',
  },
  exam: {
    label: 'Exam tip',
    icon: 'target',
    field: 'var(--info-field)',
    edge: 'var(--info-edge)',
    ink: 'var(--ink-2)',
  },
  note: {
    label: 'Note',
    icon: 'note',
    field: 'var(--plastic-sunk)',
    edge: 'var(--plastic-edge)',
    ink: 'var(--ink-2)',
  },
  remember: {
    label: 'Worth remembering',
    icon: 'bolt',
    field: 'var(--ok-field)',
    edge: 'var(--ok-edge)',
    ink: 'var(--ok)',
  },
  source: {
    label: 'About the source',
    icon: 'book',
    field: 'var(--plastic-sunk)',
    edge: 'var(--plastic-edge)',
    ink: 'var(--ink-3)',
  },
}

function CalloutBlock({ block }: { block: Extract<Block, { kind: 'callout' }> }) {
  const style = CALLOUT[block.variant]
  return (
    <aside
      id={block.id}
      className="my-6 rounded-lg border p-4 sm:p-5 scroll-mt-24"
      style={{ background: style.field, borderColor: style.edge }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span style={{ color: style.ink }}>
          <Icon name={style.icon} size={15} strokeWidth={2} />
        </span>
        <Silk style={{ color: style.ink }}>{style.label}</Silk>
      </div>
      <h2 className="text-lead font-semibold mb-2">{block.title}</h2>
      <Markdown text={block.text} className="text-plain leading-relaxed text-ink-2" />
    </aside>
  )
}

/* ----------------------------------------------------------- figure ---- */

function FigureBlock({ block }: { block: Extract<Block, { kind: 'figure' }> }) {
  const Component = FIGURES[block.figure]
  if (!Component) {
    return (
      <div className="my-6 rounded-lg border border-plastic-edge bg-plastic-sunk p-4">
        <p className="text-body text-ink-2">{block.altSummary}</p>
      </div>
    )
  }
  return (
    <div id={block.id} className="scroll-mt-24">
      <Component description={block.altSummary} />
      <p className="-mt-4 mb-6 text-small text-ink-3 leading-snug">{block.caption}</p>
    </div>
  )
}

/* ---------------------------------------------------------- compare ---- */

function CompareBlock({ block }: { block: Extract<Block, { kind: 'compare' }> }) {
  return (
    <section id={block.id} className="my-6 scroll-mt-24">
      <h2 className="text-lead font-semibold mb-3">{block.title}</h2>

      {/* Wide screens get a real table. */}
      <div className="hidden sm:block overflow-x-auto rounded-lg border border-plastic-edge">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">{block.title}</caption>
          <thead>
            <tr className="bg-plastic-sunk">
              <th scope="col" className="silk px-4 py-2.5 w-[26%]">
                Aspect
              </th>
              <th scope="col" className="silk px-4 py-2.5">
                {block.columns[0]}
              </th>
              <th scope="col" className="silk px-4 py-2.5">
                {block.columns[1]}
              </th>
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, i) => (
              <tr
                key={row.aspect}
                className={cx('border-t border-plastic-edge', i % 2 ? 'bg-plastic-raised' : '')}
              >
                <th scope="row" className="px-4 py-3 text-small font-semibold align-top">
                  {row.aspect}
                </th>
                <td className="px-4 py-3 text-body text-ink-2 align-top leading-snug">
                  <Inline text={row.left} />
                </td>
                <td className="px-4 py-3 text-body text-ink-2 align-top leading-snug">
                  <Inline text={row.right} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* A three-column table on a 360px phone is unreadable, so on small
          screens each aspect becomes its own card with the two sides stacked. */}
      <div className="sm:hidden space-y-2">
        {block.rows.map((row) => (
          <div key={row.aspect} className="rounded-md border border-plastic-edge overflow-hidden">
            <div className="px-3 py-2 bg-plastic-sunk border-b border-plastic-edge">
              <Silk>{row.aspect}</Silk>
            </div>
            <div className="p-3 space-y-2.5">
              <div>
                <p className="text-silk font-bold uppercase tracking-wider text-wire-green mb-0.5">
                  {block.columns[0]}
                </p>
                <p className="text-body leading-snug">
                  <Inline text={row.left} />
                </p>
              </div>
              <div className="pt-2.5 border-t border-plastic-edge">
                <p className="text-silk font-bold uppercase tracking-wider text-wire-orange mb-0.5">
                  {block.columns[1]}
                </p>
                <p className="text-body leading-snug">
                  <Inline text={row.right} />
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ----------------------------------------------------------- recall ---- */

function RecallBlock({
  block,
  onEngage,
}: {
  block: Extract<Block, { kind: 'recall' }>
  onEngage: () => void
}) {
  const [revealed, setRevealed] = useState(false)
  const [hinted, setHinted] = useState(false)

  return (
    <Card
      id={block.id}
      seated
      className="my-6 scroll-mt-24 overflow-hidden"
      style={{ borderColor: 'var(--signal-analog)' }}
    >
      <div className="px-4 sm:px-5 py-3 border-b border-plastic-edge bg-plastic-sunk">
        <Silk style={{ color: 'var(--signal-analog)' }}>Before you read on</Silk>
      </div>
      <div className="p-4 sm:p-5">
        <p className="text-lead font-medium leading-relaxed mb-4">{block.prompt}</p>

        {!revealed ? (
          <div className="space-y-3">
            <p className="text-small text-ink-3">
              Answer it in your head first. Trying and failing to remember is what makes it stick;
              reading it again does not.
            </p>
            {block.hint && (
              <>
                {hinted ? (
                  <p className="text-body text-ink-2 p-3 rounded-md bg-plastic-sunk border border-plastic-edge">
                    <span className="silk mr-2">Hint</span>
                    {block.hint}
                  </p>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => setHinted(true)}>
                    Give me a hint
                  </Button>
                )}
              </>
            )}
            <div>
              <Button
                variant="primary"
                onClick={() => {
                  setRevealed(true)
                  onEngage()
                }}
              >
                Reveal the answer
              </Button>
            </div>
          </div>
        ) : (
          <div className="seat-in rounded-md border border-plastic-edge bg-plastic-sunk p-4">
            <Silk className="block mb-2">Answer</Silk>
            <Markdown text={block.answer} className="text-plain leading-relaxed text-ink-2" />
          </div>
        )}
      </div>
    </Card>
  )
}

/* ------------------------------------------------------------- code ---- */

function CodeBlock({ block }: { block: Extract<Block, { kind: 'code' }> }) {
  const [active, setActive] = useState<number | null>(null)
  const lines = block.code.split('\n')
  const explained = useMemo(
    () => new Map((block.lines ?? []).map((l) => [l.line, l.text])),
    [block.lines],
  )
  const note = active ? explained.get(active) : undefined

  return (
    <figure
      id={block.id}
      className="my-6 rounded-lg border border-plastic-edge overflow-hidden scroll-mt-24"
      style={{ boxShadow: 'var(--sink)' }}
    >
      {block.caption && (
        <figcaption className="px-4 py-2.5 border-b border-plastic-edge bg-plastic">
          <Silk>{block.caption}</Silk>
        </figcaption>
      )}
      <div className="bg-plastic-sunk overflow-x-auto">
        <pre className="num text-fine leading-[1.6rem] py-2">
          {lines.map((line, i) => {
            const n = i + 1
            const has = explained.has(n)
            const on = active === n
            return (
              <div
                key={i}
                className={cx('flex', has && 'cursor-pointer')}
                style={{
                  background: on ? 'color-mix(in srgb, var(--signal-analog) 12%, transparent)' : undefined,
                }}
                onClick={has ? () => setActive(on ? null : n) : undefined}
              >
                <span
                  aria-hidden
                  className="shrink-0 w-11 pr-3 text-right select-none"
                  style={{ color: has ? 'var(--signal-analog)' : 'var(--ink-faint)' }}
                >
                  {n}
                </span>
                <code className="pr-4 whitespace-pre">{line || ' '}</code>
                {has && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setActive(on ? null : n)
                    }}
                    aria-expanded={on}
                    className="ml-auto mr-3 shrink-0 self-center text-micro font-bold uppercase tracking-wider px-2 h-6 min-w-6 rounded-[2px] border border-plastic-edge text-ink-3 hover:text-ink"
                  >
                    {on ? 'hide' : 'what?'}
                  </button>
                )}
              </div>
            )
          })}
        </pre>
      </div>
      {note && (
        <div className="px-4 py-3 border-t border-plastic-edge bg-plastic" aria-live="polite">
          <Silk className="block mb-1">Line {active}</Silk>
          <p className="text-body text-ink-2 leading-relaxed">{note}</p>
        </div>
      )}
      {!note && (block.lines?.length ?? 0) > 0 && (
        <div className="px-4 py-2.5 border-t border-plastic-edge bg-plastic">
          <p className="text-fine text-ink-3">
            Tap any highlighted line number to read what it does.
          </p>
        </div>
      )}
    </figure>
  )
}

/* ------------------------------------------------------------- sort ---- */

function SortBlock({
  block,
  onEngage,
}: {
  block: Extract<Block, { kind: 'sort' }>
  onEngage: () => void
}) {
  const [placed, setPlaced] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)
  const done = Object.keys(placed).length === block.items.length
  const rightCount = block.items.filter((i) => placed[i.id] === i.bucket).length

  return (
    <Card id={block.id} seated className="my-6 scroll-mt-24 overflow-hidden">
      <div className="px-4 sm:px-5 py-3 border-b border-plastic-edge bg-plastic-sunk flex items-center gap-2">
        <Silk>Sort these</Silk>
        <span className="num ml-auto text-meta text-ink-3">
          {Object.keys(placed).length}/{block.items.length}
        </span>
      </div>
      <div className="p-4 sm:p-5">
        <p className="text-lead font-medium mb-4">{block.prompt}</p>

        <ul className="space-y-2">
          {block.items.map((item) => {
            const choice = placed[item.id]
            const isRight = checked && choice === item.bucket
            const isWrong = checked && choice !== item.bucket
            return (
              <li
                key={item.id}
                className={cx(
                  'rounded-md border p-3',
                  isRight
                    ? 'border-ok bg-ok-field'
                    : isWrong
                      ? 'border-no bg-no-field'
                      : 'border-plastic-edge bg-plastic-sunk',
                )}
              >
                <p className="text-body leading-snug mb-2.5">{item.label}</p>
                <div className="flex flex-wrap gap-1.5" role="group" aria-label={item.label}>
                  {block.buckets.map((b) => {
                    const on = choice === b.id
                    return (
                      <button
                        key={b.id}
                        disabled={checked}
                        onClick={() => setPlaced((p) => ({ ...p, [item.id]: b.id }))}
                        aria-pressed={on}
                        className={cx(
                          'px-3 h-10 rounded-sm border text-fine font-medium transition-colors',
                          on
                            ? 'bg-ink text-plastic border-ink'
                            : 'bg-plastic-raised border-plastic-edge text-ink-2 hover:border-ink-faint',
                        )}
                      >
                        {b.label}
                      </button>
                    )
                  })}
                </div>
                {checked && (
                  <p className="mt-2.5 pt-2.5 border-t border-plastic-edge text-small text-ink-2 leading-snug">
                    <span className="silk mr-2">
                      {block.buckets.find((b) => b.id === item.bucket)?.label}
                    </span>
                    <Inline text={item.why} />
                  </p>
                )}
              </li>
            )
          })}
        </ul>

        <div className="mt-4 flex items-center gap-3 flex-wrap">
          {!checked ? (
            <Button
              variant="primary"
              disabled={!done}
              onClick={() => {
                setChecked(true)
                onEngage()
              }}
            >
              Check my sorting
            </Button>
          ) : (
            <>
              <Chip tone={rightCount === block.items.length ? 'ok' : 'warn'}>
                {rightCount} of {block.items.length} right
              </Chip>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setChecked(false)
                  setPlaced({})
                }}
              >
                Try again
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  )
}

/* ------------------------------------------------------------ order ---- */

function OrderBlock({
  block,
  onEngage,
}: {
  block: Extract<Block, { kind: 'order' }>
  onEngage: () => void
}) {
  const shuffled = useMemo(() => {
    const seed = [...block.id].reduce((a, c) => a + c.charCodeAt(0), 0)
    const arr = block.items.map((i) => i.id)
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (seed * (i + 5)) % (i + 1)
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }, [block.id, block.items])

  const [order, setOrder] = useState(shuffled)
  const [checked, setChecked] = useState(false)
  const [announce, setAnnounce] = useState('')
  const right = order.filter((id, i) => id === block.correct[i]).length

  function move(i: number, dir: -1 | 1) {
    const j = i + dir
    if (j < 0 || j >= order.length) return
    const next = [...order]
    ;[next[i], next[j]] = [next[j], next[i]]
    setOrder(next)
    setAnnounce(
      `${block.items.find((x) => x.id === next[j])?.label} moved to position ${j + 1} of ${next.length}`,
    )
  }

  return (
    <Card id={block.id} seated className="my-6 scroll-mt-24 overflow-hidden">
      <div className="px-4 sm:px-5 py-3 border-b border-plastic-edge bg-plastic-sunk">
        <Silk>Put in order</Silk>
      </div>
      <div className="p-4 sm:p-5">
        <p className="text-lead font-medium mb-4">{block.prompt}</p>
        <ol className="space-y-2">
          {order.map((id, i) => {
            const item = block.items.find((x) => x.id === id)!
            const isRight = checked && block.correct[i] === id
            return (
              <li
                key={id}
                className={cx(
                  'flex items-center gap-2 p-2 pl-3 rounded-md border',
                  isRight
                    ? 'border-ok bg-ok-field'
                    : checked
                      ? 'border-no bg-no-field'
                      : 'border-plastic-edge bg-plastic-sunk',
                )}
              >
                <span className="num text-fine font-bold text-ink-faint w-5 shrink-0">
                  {i + 1}
                </span>
                <span className="flex-1 text-body leading-snug">{item.label}</span>
                {checked ? (
                  <span aria-hidden style={{ color: isRight ? 'var(--ok)' : 'var(--no)' }}>
                    <Icon name={isRight ? 'check' : 'cross'} size={15} strokeWidth={2.6} />
                  </span>
                ) : (
                  <span className="flex gap-1 shrink-0">
                    <button
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      aria-label={`Move "${item.label}" up`}
                      className="w-9 h-9 grid place-items-center rounded-sm border border-plastic-edge bg-plastic-raised disabled:opacity-35"
                    >
                      <Icon name="arrowUp" size={14} />
                    </button>
                    <button
                      onClick={() => move(i, 1)}
                      disabled={i === order.length - 1}
                      aria-label={`Move "${item.label}" down`}
                      className="w-9 h-9 grid place-items-center rounded-sm border border-plastic-edge bg-plastic-raised disabled:opacity-35"
                    >
                      <Icon name="arrowDown" size={14} />
                    </button>
                  </span>
                )}
              </li>
            )
          })}
        </ol>

        <div className="mt-4 flex items-center gap-3 flex-wrap">
          {!checked ? (
            <Button
              variant="primary"
              onClick={() => {
                setChecked(true)
                onEngage()
              }}
            >
              Check the order
            </Button>
          ) : (
            <>
              <Chip tone={right === order.length ? 'ok' : 'warn'}>
                {right} of {order.length} in the right place
              </Chip>
              <Button size="sm" variant="ghost" onClick={() => setChecked(false)}>
                Adjust
              </Button>
            </>
          )}
        </div>

        {checked && (
          <p className="mt-4 pt-3 border-t border-plastic-edge text-body text-ink-2 leading-relaxed">
            <Inline text={block.why} />
          </p>
        )}
      </div>
      <LiveRegion message={announce} />
    </Card>
  )
}

/* ---------------------------------------------------------- explain ---- */

function ExplainBlock({
  block,
  onEngage,
}: {
  block: Extract<Block, { kind: 'explain' }>
  onEngage: () => void
}) {
  const [text, setText] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [ticks, setTicks] = useState<boolean[]>(() => block.rubric.map(() => false))
  const hit = ticks.filter(Boolean).length

  return (
    <Card
      id={block.id}
      seated
      className="my-6 scroll-mt-24 overflow-hidden"
      style={{ borderLeftWidth: 3, borderLeftColor: 'var(--wire-green)' }}
    >
      <div className="px-4 sm:px-5 py-3 border-b border-plastic-edge bg-plastic-sunk">
        <Silk>Explain it yourself</Silk>
      </div>
      <div className="p-4 sm:p-5 space-y-4">
        <p className="text-lead font-medium leading-relaxed">{block.prompt}</p>
        <p className="text-small text-ink-3 leading-relaxed">
          If you can explain something in your own words, you understand it. If you can only repeat
          the sentence from the notes, you do not yet. Write your version first, then check it.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder="Write it as if you were explaining to a classmate who missed the lesson…"
          className="w-full p-3 rounded-md border border-plastic-edge bg-plastic-sunk text-body leading-relaxed resize-y"
          aria-label="Your explanation"
        />

        {!revealed ? (
          <Button
            variant="primary"
            disabled={text.trim().length < 20}
            onClick={() => {
              setRevealed(true)
              onEngage()
            }}
          >
            Compare with a good answer
          </Button>
        ) : (
          <div className="space-y-4 seat-in">
            <div>
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <Silk>Did your answer include these?</Silk>
                <span className="num text-small font-bold" aria-live="polite">
                  {hit}/{block.rubric.length}
                </span>
              </div>
              <ul className="space-y-1">
                {block.rubric.map((point, i) => (
                  <li key={point}>
                    <label className="flex items-start gap-3 cursor-pointer py-1.5 min-h-[44px]">
                      <input
                        type="checkbox"
                        checked={ticks[i]}
                        onChange={() => setTicks((t) => t.map((v, j) => (i === j ? !v : v)))}
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
                      <span className="text-body leading-snug">{point}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-md border border-plastic-edge bg-plastic-sunk p-4">
              <Silk className="block mb-2">A full answer looks like this</Silk>
              <p className="text-body leading-relaxed text-ink-2">
                <Inline text={block.modelAnswer} />
              </p>
            </div>

            {hit < block.rubric.length && (
              <p className="text-small text-ink-3">
                Missing points are not failure. Read the model answer, close it, and try writing
                yours again from scratch. That second attempt is where the learning happens.
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

/* ------------------------------------------------------- checkpoint ---- */

function CheckpointBlock({
  block,
  lessonId,
  onEngage,
}: {
  block: Extract<Block, { kind: 'checkpoint' }>
  lessonId: string
  onEngage: () => void
}) {
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState<boolean[]>([])
  const questions = block.questionIds.map((id) => questionById.get(id)).filter(Boolean)
  const complete = results.length === questions.length
  const right = results.filter(Boolean).length
  const completeLesson = useProgress((s) => s.completeLesson)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (complete) onEngage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complete])

  if (questions.length === 0) return null

  return (
    <section
      id={block.id}
      className="my-8 rounded-lg border-2 border-plastic-edge bg-plastic-sunk overflow-hidden scroll-mt-24"
    >
      <div className="px-4 sm:px-5 py-3 border-b border-plastic-edge bg-plastic flex items-center gap-3">
        <h2 ref={headingRef} tabIndex={-1} className="text-lead font-semibold outline-none">
          {block.title}
        </h2>
        <span className="num ml-auto text-fine text-ink-3">
          {Math.min(index + 1, questions.length)} of {questions.length}
        </span>
      </div>

      <div className="p-4 sm:p-5">
        {!complete ? (
          <>
            <QuestionCard
              key={questions[index]!.id}
              question={questions[index]!}
              onAnswered={(r) => setResults((prev) => [...prev, r.correct])}
            />
            {results.length > index && (
              <div className="mt-3">
                <Button
                  variant="primary"
                  onClick={() => {
                    setIndex((i) => i + 1)
                    requestAnimationFrame(() => headingRef.current?.focus())
                  }}
                >
                  {index + 1 < questions.length ? 'Next question' : 'See how you did'}
                  <Icon name="arrowRight" size={15} />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-4 seat-in">
            <div className="flex justify-center gap-1.5 mb-4" role="img" aria-label={`${right} of ${questions.length} correct`}>
              {results.map((ok, i) => (
                <span
                  key={i}
                  className="w-8 h-8 rounded-sm grid place-items-center text-white"
                  style={{ background: ok ? 'var(--ok)' : 'var(--no)' }}
                >
                  <Icon name={ok ? 'check' : 'cross'} size={15} strokeWidth={2.5} />
                </span>
              ))}
            </div>
            <p className="text-plain font-semibold mb-1.5">
              {right} out of {questions.length}
            </p>
            <p className="text-body text-ink-3 max-w-sm mx-auto leading-relaxed mb-4">
              {right === questions.length
                ? 'All correct. This concept is recorded as understood, and it will come back for a quick review later so it stays that way.'
                : right >= questions.length / 2
                  ? 'A good start. The ones you missed have been added to your review queue, so they will come back when you are most likely to be forgetting them.'
                  : 'Worth reading the lesson again before moving on. The questions you missed are in your review queue and nothing is lost.'}
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Button
                onClick={() => {
                  setResults([])
                  setIndex(0)
                }}
              >
                <Icon name="refresh" size={15} />
                Try again
              </Button>
              {right === questions.length && (
                <Button variant="primary" onClick={() => completeLesson(lessonId)}>
                  Mark this lesson done
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- gallery ---- */

function GalleryBlock({
  block,
  onEngage,
}: {
  block: Extract<Block, { kind: 'gallery' }>
  onEngage: () => void
}) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <section id={block.id} className="my-6 scroll-mt-24">
      <h2 className="text-lead font-semibold mb-1.5">{block.title}</h2>
      {block.intro && <p className="text-body text-ink-3 mb-4 leading-relaxed">{block.intro}</p>}

      <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {block.items.map((item) => {
          const isOpen = open === item.id
          return (
            <li key={item.id} className={cx(isOpen && 'sm:col-span-2 lg:col-span-3')}>
              <button
                onClick={() => {
                  setOpen(isOpen ? null : item.id)
                  onEngage()
                }}
                aria-expanded={isOpen}
                className={cx(
                  'w-full text-left rounded-lg border bg-plastic-raised overflow-hidden transition-all',
                  isOpen
                    ? 'border-ink-faint shadow-[var(--lift-2)]'
                    : 'border-plastic-edge hover:border-ink-faint hover:shadow-[var(--lift-1)]',
                )}
              >
                <div className={cx('flex gap-3', isOpen ? 'flex-col sm:flex-row' : 'flex-col')}>
                  <div
                    className={cx(
                      'bg-plastic-sunk flex items-center justify-center shrink-0 border-b border-plastic-edge',
                      isOpen ? 'sm:w-52 sm:border-b-0 sm:border-r py-4' : 'py-3',
                    )}
                  >
                    <PartArt name={item.art} className="w-full max-w-[150px] h-auto" />
                  </div>
                  <div className="p-3.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-body font-semibold">{item.name}</h3>
                      <span
                        aria-hidden
                        className="ml-auto text-ink-faint transition-transform"
                        style={{ transform: isOpen ? 'rotate(90deg)' : undefined }}
                      >
                        <Icon name="chevron" size={14} />
                      </span>
                    </div>
                    <p
                      className={cx(
                        'text-small text-ink-2 leading-snug',
                        !isOpen && 'line-clamp-2',
                      )}
                    >
                      <Inline text={item.what} />
                    </p>

                    {isOpen && (
                      <div className="mt-3 space-y-2.5 seat-in">
                        {item.how && (
                          <div>
                            <Silk className="block mb-1">How it works</Silk>
                            <p className="text-body text-ink-2 leading-relaxed">
                              <Inline text={item.how} />
                            </p>
                          </div>
                        )}
                        {item.used && (
                          <div>
                            <Silk className="block mb-1">Used for</Silk>
                            <p className="text-body text-ink-2 leading-relaxed">
                              <Inline text={item.used} />
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {item.tags.map((t) => (
                          <span
                            key={t}
                            className="px-1.5 py-0.5 rounded-[2px] bg-plastic-sunk border border-plastic-edge text-silk text-ink-3"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/* ------------------------------------------------------------ steps ---- */

function StepsBlock({ block }: { block: Extract<Block, { kind: 'steps' }> }) {
  return (
    <section id={block.id} className="my-6 scroll-mt-24">
      <h2 className="text-lead font-semibold mb-3">{block.title}</h2>
      <ol className="space-y-2">
        {block.steps.map((s, i) => (
          <li
            key={s.label}
            className="flex gap-3.5 p-3.5 rounded-md border border-plastic-edge bg-plastic-raised"
          >
            <span
              aria-hidden
              className="num shrink-0 w-7 h-7 grid place-items-center rounded-sm bg-plastic-sunk border border-plastic-edge text-meta font-bold text-ink-2"
            >
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="text-body font-semibold mb-0.5">{s.label}</p>
              <p className="text-body text-ink-2 leading-relaxed">
                <Inline text={s.text} />
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
