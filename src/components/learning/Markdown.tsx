import { Fragment, useState, type ReactNode } from 'react'
import { glossaryById } from '@/content'
import { Modal, Silk } from '@/components/ui'
import { Link } from 'react-router-dom'

/* A minimal inline renderer for the small subset of markup the content uses:
   **bold**, `code`, [[glossary-term]] and > blockquote. Deliberately not a
   markdown library: the content is ours, the grammar is fixed, and shipping a
   parser to a student on a slow connection to render four constructs would be
   a poor trade. */

export function Markdown({ text, className }: { text: string; className?: string }) {
  const [term, setTerm] = useState<string | null>(null)
  const blocks = text.split('\n\n')

  return (
    <>
      <div className={className}>
        {blocks.map((block, i) => {
          if (block.startsWith('- ')) {
            const items = block.split('\n').filter((l) => l.startsWith('- '))
            return (
              <ul key={i} className="my-3 space-y-1.5 pl-1">
                {items.map((item, j) => (
                  <li key={j} className="flex gap-2.5">
                    <span
                      aria-hidden
                      className="mt-[0.6em] w-1.5 h-1.5 rounded-[1px] bg-ink-faint shrink-0"
                    />
                    <span>{inline(item.slice(2), setTerm)}</span>
                  </li>
                ))}
              </ul>
            )
          }
          if (block.startsWith('> ')) {
            return (
              <blockquote
                key={i}
                className="my-4 pl-4 border-l-2 border-ink-faint text-ink-2 italic"
              >
                {inline(block.slice(2), setTerm)}
              </blockquote>
            )
          }
          return (
            <p key={i} className={i > 0 ? 'mt-3.5' : undefined}>
              {inline(block, setTerm)}
            </p>
          )
        })}
      </div>

      <TermModal id={term} onClose={() => setTerm(null)} />
    </>
  )
}

function inline(text: string, onTerm: (id: string) => void): ReactNode[] {
  const out: ReactNode[] = []
  // Code first, so a literal `/* */` is never mistaken for emphasis. Bold
  // before italic, and italic refuses to start on a `**`. Bold and italic
  // recurse, so `**a `b` c**` renders the code span inside the bold.
  const re =
    /(`[^`]+`)|(\[\[[^\]]+\]\])|(\*\*(?:(?!\*\*)[\s\S])+?\*\*)|(\*(?!\*)[^*\n]+\*)|(\n)/g
  let last = 0
  let m: RegExpExecArray | null
  let key = 0

  while ((m = re.exec(text))) {
    if (m.index > last) out.push(<Fragment key={key++}>{text.slice(last, m.index)}</Fragment>)
    const token = m[0]

    if (token === '\n') {
      out.push(<br key={key++} />)
    } else if (token.startsWith('`')) {
      out.push(
        <code
          key={key++}
          className="num text-[0.875em] px-1 py-0.5 rounded-[2px] bg-plastic-sunk border border-plastic-edge"
        >
          {token.slice(1, -1)}
        </code>,
      )
    } else if (token.startsWith('[[')) {
      // [[id]] shows the term's canonical name; [[id|label]] shows the label,
      // which is what keeps "an embedded system" from becoming "an Embedded
      // system" in the middle of a sentence.
      const raw = token.slice(2, -2)
      const bar = raw.indexOf('|')
      const id = bar >= 0 ? raw.slice(0, bar) : raw
      const label = bar >= 0 ? raw.slice(bar + 1) : null
      const term = glossaryById.get(id)
      out.push(
        term ? (
          <button
            key={key++}
            onClick={() => onTerm(id)}
            className="font-semibold underline decoration-dotted decoration-signal-analog underline-offset-[3px] hover:decoration-solid focus-visible:outline-3 rounded-[2px]"
          >
            {label ?? term.term}
          </button>
        ) : (
          <Fragment key={key++}>{label ?? id}</Fragment>
        ),
      )
    } else if (token.startsWith('**')) {
      out.push(
        <strong key={key++} className="font-semibold text-ink">
          {inline(token.slice(2, -2), onTerm)}
        </strong>,
      )
    } else {
      out.push(<em key={key++}>{inline(token.slice(1, -1), onTerm)}</em>)
    }
    last = m.index + token.length
  }
  if (last < text.length) out.push(<Fragment key={key++}>{text.slice(last)}</Fragment>)
  return out
}

/** Author prose rendered inline, with no block wrapper. Same grammar as
 *  Markdown, for the many places a sentence sits inside an existing element. */
export function Inline({ text, className }: { text: string; className?: string }) {
  const [term, setTerm] = useState<string | null>(null)
  return (
    <>
      <span className={className}>{inline(text, setTerm)}</span>
      <TermModal id={term} onClose={() => setTerm(null)} />
    </>
  )
}

/** The contextual glossary panel. Opening a term never navigates away, so a
 *  student can check a word mid-sentence and carry straight on reading. */
export function TermModal({ id, onClose }: { id: string | null; onClose: () => void }) {
  const term = id ? glossaryById.get(id) : undefined
  if (!term) return null

  return (
    <Modal open onClose={onClose} title={term.term}>
      <div className="space-y-4">
        <section>
          <Silk className="block mb-1.5">In plain words</Silk>
          <p className="text-lead leading-relaxed">{term.simple}</p>
        </section>

        <section>
          <Silk className="block mb-1.5">Exam wording</Silk>
          <p className="text-body leading-relaxed text-ink-2 p-3 rounded-md bg-plastic-sunk border border-plastic-edge">
            {term.technical}
          </p>
        </section>

        {term.example && (
          <section>
            <Silk className="block mb-1.5">Example</Silk>
            <p className="text-body leading-relaxed text-ink-2">{term.example}</p>
          </section>
        )}

        {term.related && term.related.length > 0 && (
          <section>
            <Silk className="block mb-2">Related</Silk>
            <div className="flex flex-wrap gap-1.5">
              {term.related.map((r) => {
                const rel = glossaryById.get(r)
                if (!rel) return null
                return (
                  <Link
                    key={r}
                    to={`/glossary#${r}`}
                    onClick={onClose}
                    className="px-2.5 h-8 inline-flex items-center rounded-sm border border-plastic-edge bg-plastic-sunk text-fine hover:border-ink-faint"
                  >
                    {rel.term}
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {term.lessonId && (
          <p className="pt-2 border-t border-plastic-edge text-small">
            <Link
              to={`/lesson/${term.lessonId}`}
              onClick={onClose}
              className="font-semibold underline decoration-ink-faint underline-offset-2"
            >
              Where this is taught
            </Link>
          </p>
        )}
      </div>
    </Modal>
  )
}
