import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import {
  lessonById,
  moduleById,
  nextLesson,
  prevLesson,
  glossaryById,
} from '@/content'
import { useProgress } from '@/store/progress'
import { masteryOf, MASTERY_LABEL } from '@/lib/mastery'
import { Button, Card, Chip, Icon, Modal, Silk, EmptyState } from '@/components/ui'
import { BlockRenderer } from '@/components/learning/Blocks'
import { Inline, Markdown, TermModal } from '@/components/learning/Markdown'
import { wireColour } from '@/components/progress'

export function LessonPage() {
  const { id } = useParams<{ id: string }>()
  const lesson = id ? lessonById.get(id) : undefined
  const mod = lesson ? moduleById.get(lesson.moduleId) : undefined
  const { hash } = useLocation()

  const openLesson = useProgress((s) => s.openLesson)
  const engage = useProgress((s) => s.engage)
  const completeLesson = useProgress((s) => s.completeLesson)
  const bookmarks = useProgress((s) => s.bookmarks)
  const toggleBookmark = useProgress((s) => s.toggleBookmark)
  const concepts = useProgress((s) => s.concepts)
  const lessonRecords = useProgress((s) => s.lessons)
  const notes = useProgress((s) => s.notes)
  const addNote = useProgress((s) => s.addNote)

  const [confused, setConfused] = useState(false)
  const [noteOpen, setNoteOpen] = useState(false)
  const [term, setTerm] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!lesson) return
    openLesson(lesson.id)
    // A search result links straight to a block, so honour the hash rather
    // than yanking the student back to the top of a long lesson.
    const target = hash ? document.getElementById(hash.slice(1)) : null
    if (target) {
      target.scrollIntoView({ block: 'start', behavior: 'instant' as ScrollBehavior })
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
      headingRef.current?.focus()
    }
  }, [lesson, openLesson, hash])

  // Reading progress, purely as orientation. It is never used for mastery.
  useEffect(() => {
    function onScroll() {
      const h = document.documentElement.scrollHeight - window.innerHeight
      setProgress(h > 0 ? Math.min(1, window.scrollY / h) : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [lesson])

  const onEngage = useCallback(
    (blockId: string) => {
      if (lesson) engage(lesson.id, blockId)
    },
    [lesson, engage],
  )

  const next = lesson ? nextLesson(lesson.id) : undefined
  const prev = lesson ? prevLesson(lesson.id) : undefined
  const record = lesson ? lessonRecords[lesson.id] : undefined
  const lessonNotes = useMemo(
    () => (lesson ? notes.filter((n) => n.lessonId === lesson.id) : []),
    [notes, lesson],
  )

  if (!lesson || !mod) {
    return (
      <EmptyState
        title="That lesson does not exist"
        body="The link may be out of date, or the address may have a typo in it. The course path lists every lesson."
        icon="search"
        action={<Button to="/path" variant="primary">See the course path</Button>}
      />
    )
  }

  const colour = wireColour(mod.wire)
  const bookmarked = bookmarks.includes(lesson.id)
  const done = !!record?.completedAt

  // Prerequisite check: only shown when something genuinely is not ready.
  const unmetPrereqs = (lesson.prerequisites ?? [])
    .map((p) => lessonById.get(p))
    .filter((p): p is NonNullable<typeof p> => !!p && !lessonRecords[p.id]?.completedAt)

  return (
    <article className="max-w-[760px] mx-auto">
      {/* reading progress, pinned under the header */}
      <div
        aria-hidden
        className="fixed top-16 left-0 right-0 h-[2px] z-20 no-print"
        style={{ background: 'transparent' }}
      >
        <div
          className="h-full transition-[width] duration-150"
          style={{ width: `${progress * 100}%`, background: colour }}
        />
      </div>

      {/* ------------------------------------------------------ breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-5">
        <ol className="flex items-center gap-2 text-fine text-ink-3 flex-wrap">
          <li>
            <Link
              to="/path"
              className="inline-flex items-center min-h-6 hover:text-ink underline underline-offset-2"
            >
              Course
            </Link>
          </li>
          <li aria-hidden>·</li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden className="w-2 h-2 rounded-full" style={{ background: colour }} />
            {mod.title}
          </li>
          <li aria-hidden>·</li>
          <li className="num">Lesson {lesson.number}</li>
        </ol>
      </nav>

      {/* ------------------------------------------------------- header */}
      <header className="mb-8">
        <div className="flex items-start gap-3 mb-3">
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-h1 sm:text-display font-bold tracking-tight leading-tight outline-none flex-1"
          >
            {lesson.title}
          </h1>
          <button
            onClick={() => toggleBookmark(lesson.id)}
            aria-pressed={bookmarked}
            className="shrink-0 w-11 h-11 grid place-items-center rounded-md border border-plastic-edge bg-plastic-raised hover:border-ink-faint transition-colors no-print"
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this lesson'}
            title={bookmarked ? 'Bookmarked' : 'Bookmark'}
          >
            <Icon
              name="bookmark"
              size={17}
              className={bookmarked ? 'text-signal-high' : 'text-ink-faint'}
            />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-5">
          <Chip tone="neutral">
            <span className="num">{lesson.minutes} min</span>
          </Chip>
          {done && <Chip tone="ok">Completed</Chip>}
          {lesson.concepts.map((c) => {
            const state = masteryOf(concepts[c.id])
            if (state === 'untouched') return null
            return (
              <Chip key={c.id} tone={state === 'mastered' || state === 'proficient' ? 'ok' : 'warn'}>
                {c.title}: {MASTERY_LABEL[state]}
              </Chip>
            )
          })}
        </div>

        {/* Why this matters, before anything else. */}
        <Card
          className="p-4 sm:p-5 mb-5"
          style={{ borderLeftWidth: 3, borderLeftColor: colour }}
        >
          <Silk className="block mb-2">Why this matters</Silk>
          <p className="text-lead leading-relaxed text-ink-2">
            <Inline text={lesson.why} />
          </p>
        </Card>

        <section aria-labelledby="objectives">
          <Silk as="p" id="objectives" className="mb-2.5">
            By the end you will be able to
          </Silk>
          <ul className="space-y-1.5">
            {lesson.objectives.map((o) => (
              <li key={o} className="flex gap-2.5 text-body text-ink-2">
                <span
                  aria-hidden
                  className="mt-[0.55em] w-1.5 h-1.5 rounded-[1px] shrink-0"
                  style={{ background: colour }}
                />
                {o}
              </li>
            ))}
          </ul>
        </section>

        {unmetPrereqs.length > 0 && (
          <div className="mt-5 rounded-lg border border-info-edge bg-info-field p-4">
            <Silk className="block mb-2">Before this one</Silk>
            <p className="text-body text-ink-2 leading-relaxed mb-3">
              This lesson builds on {unmetPrereqs.length === 1 ? 'a lesson' : 'lessons'} you have
              not finished. You can carry on regardless, but it will make more sense afterwards.
            </p>
            <div className="flex flex-wrap gap-2">
              {unmetPrereqs.map((p) => (
                <Button key={p.id} size="sm" to={`/lesson/${p.id}`}>
                  {p.title}
                </Button>
              ))}
            </div>
          </div>
        )}
      </header>

      <hr className="border-0 border-t border-plastic-edge my-8" />

      {/* -------------------------------------------------------- blocks */}
      <div className="space-y-1">
        {lesson.blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} lessonId={lesson.id} onEngage={onEngage} />
        ))}
      </div>

      {/* -------------------------------------------------- confused CTA */}
      <div className="my-8 no-print">
        <button
          onClick={() => setConfused(true)}
          className="w-full flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-plastic-edge hover:border-signal-analog hover:bg-plastic-raised transition-colors text-left"
        >
          <span className="shrink-0 w-10 h-10 grid place-items-center rounded-full bg-plastic-sunk border border-plastic-edge text-signal-analog">
            <Icon name="question" size={20} strokeWidth={2} />
          </span>
          <span>
            <span className="block text-body font-semibold">Still confused?</span>
            <span className="block text-small text-ink-3">
              Get a simpler explanation, and a way back to what this depends on.
            </span>
          </span>
          <span aria-hidden className="ml-auto text-ink-faint">
            <Icon name="arrowRight" size={15} />
          </span>
        </button>
      </div>

      {/* ------------------------------------------------------- summary */}
      <section
        aria-labelledby="summary-heading"
        className="my-8 rounded-lg border border-plastic-edge overflow-hidden"
      >
        <div className="px-4 sm:px-5 py-3 bg-plastic-sunk border-b border-plastic-edge">
          <h2 id="summary-heading" className="text-lead font-semibold">
            What this lesson said
          </h2>
        </div>
        <ul className="p-4 sm:p-5 space-y-2.5">
          {lesson.summary.map((s) => (
            <li key={s} className="flex gap-3 text-body leading-relaxed text-ink-2">
              <span className="mt-1 shrink-0" style={{ color: colour }}>
                <Icon name="check" size={15} strokeWidth={2.2} />
              </span>
              <span>
                <Inline text={s} />
              </span>
            </li>
          ))}
        </ul>

        {lesson.keyTerms.length > 0 && (
          <div className="px-4 sm:px-5 pb-5">
            <Silk className="block mb-2">Key terms</Silk>
            <div className="flex flex-wrap gap-1.5">
              {lesson.keyTerms.map((t) => {
                const g = glossaryById.get(t)
                if (!g) return null
                return (
                  <button
                    key={t}
                    onClick={() => setTerm(t)}
                    className="px-2.5 h-9 rounded-sm border border-plastic-edge bg-plastic-sunk text-fine hover:border-ink-faint transition-colors"
                  >
                    {g.term}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {lesson.examTip && (
          <div className="px-4 sm:px-5 py-4 border-t border-plastic-edge bg-info-field">
            <div className="flex items-center gap-2 mb-1.5">
              <Icon name="target" size={15} className="text-ink-2" />
              <Silk>Exam tip</Silk>
            </div>
            <Markdown text={lesson.examTip} className="text-body leading-relaxed text-ink-2" />
          </div>
        )}
      </section>

      {/* --------------------------------------------------- your notes */}
      <section className="my-8 no-print" aria-labelledby="notes-heading">
        <div className="flex items-center gap-3 mb-3">
          <h2 id="notes-heading" className="text-lead font-semibold">
            Your notes
          </h2>
          <Button size="sm" className="ml-auto" onClick={() => setNoteOpen(true)}>
            <Icon name="plus" size={14} />
            Add a note
          </Button>
        </div>
        {lessonNotes.length === 0 ? (
          <p className="text-body text-ink-3">
            Nothing yet. Notes are saved on this device only.
          </p>
        ) : (
          <ul className="space-y-2">
            {lessonNotes.map((n) => (
              <li
                key={n.id}
                className="p-3.5 rounded-md border border-plastic-edge bg-plastic-raised"
              >
                <p className="text-body leading-relaxed whitespace-pre-wrap">{n.text}</p>
                <p className="text-meta text-ink-faint mt-2 num">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ------------------------------------------------------ nav feet */}
      <nav
        aria-label="Lesson navigation"
        className="mt-10 pt-6 border-t border-plastic-edge flex flex-col sm:flex-row gap-3 no-print"
      >
        {prev ? (
          <Button to={`/lesson/${prev.id}`} className="sm:flex-1 justify-start text-left">
            <Icon name="arrowLeft" size={15} />
            <span className="min-w-0">
              <span className="silk block">Previous</span>
              <span className="block truncate text-small">{prev.title}</span>
            </span>
          </Button>
        ) : (
          <span className="sm:flex-1" />
        )}

        {next ? (
          <Button
            to={`/lesson/${next.id}`}
            variant="primary"
            className="sm:flex-1 justify-end text-right"
            onClick={() => completeLesson(lesson.id)}
          >
            <span className="min-w-0">
              <span className="silk block" style={{ color: 'inherit', opacity: 0.7 }}>
                Next
              </span>
              <span className="block truncate text-small">{next.title}</span>
            </span>
            <Icon name="arrowRight" size={15} />
          </Button>
        ) : (
          <Button to="/exam" variant="primary" className="sm:flex-1">
            You have reached the end of the course. Go to exam prep
            <Icon name="arrowRight" size={15} />
          </Button>
        )}
      </nav>

      {/* ------------------------------------------------------- modals */}
      <ConfusedModal open={confused} onClose={() => setConfused(false)} lesson={lesson} />
      <NoteModal
        open={noteOpen}
        onClose={() => setNoteOpen(false)}
        onSave={(text) => {
          addNote(lesson.id, text)
          setNoteOpen(false)
        }}
      />
      <TermModal id={term} onClose={() => setTerm(null)} />
    </article>
  )
}

/* -------------------------------------------------------- confused ----- */

function ConfusedModal({
  open,
  onClose,
  lesson,
}: {
  open: boolean
  onClose: () => void
  lesson: NonNullable<ReturnType<typeof lessonById.get>>
}) {
  const [depth, setDepth] = useState(0)
  const review = lesson.confused?.reviewLessonId
    ? lessonById.get(lesson.confused.reviewLessonId)
    : undefined

  useEffect(() => {
    if (open) setDepth(0)
  }, [open])

  return (
    <Modal open={open} onClose={onClose} title="Let's make this simpler">
      <div className="space-y-5">
        <p className="text-body text-ink-3 leading-relaxed">
          Being confused here is completely normal, and it is not a sign you are behind. Here is the
          same idea said in an easier way.
        </p>

        {lesson.confused?.simpler ? (
          <div className="rounded-md border border-plastic-edge bg-plastic-sunk p-4">
            <Silk className="block mb-2">The simplest version</Silk>
            <p className="text-lead leading-relaxed">
              <Inline text={lesson.confused.simpler} />
            </p>
          </div>
        ) : (
          <div className="rounded-md border border-plastic-edge bg-plastic-sunk p-4">
            <p className="text-lead leading-relaxed">
              Read the summary at the bottom of this lesson first. It has the same content in five
              short lines, without the explanation around it. If those five lines make sense, the
              lesson will too on a second read.
            </p>
          </div>
        )}

        {depth >= 1 && lesson.confused?.analogy && (
          <div className="rounded-md border border-plastic-edge bg-plastic-sunk p-4 seat-in">
            <Silk className="block mb-2">Another way to picture it</Silk>
            <p className="text-lead leading-relaxed">
              <Inline text={lesson.confused.analogy} />
            </p>
          </div>
        )}

        {depth >= 2 && (
          <div className="rounded-md border border-plastic-edge bg-plastic-sunk p-4 seat-in">
            <Silk className="block mb-2">Try this instead of re-reading</Silk>
            <ul className="space-y-2 text-body text-ink-2 leading-relaxed">
              <li>
                Scroll to the interactive figure in this lesson and change something. Watching a
                number move usually explains more than a paragraph does.
              </li>
              <li>
                Do the quick check even though you feel unready. Getting one wrong tells you exactly
                which sentence to re-read, which beats re-reading all of them.
              </li>
              <li>Come back tomorrow. Sleep genuinely helps with this, and nothing is lost.</li>
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {depth < 2 && (
            <Button variant="primary" onClick={() => setDepth((d) => d + 1)}>
              Still unsure
            </Button>
          )}
          {review && (
            <Button to={`/lesson/${review.id}`} onClick={onClose}>
              Go back to: {review.title}
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            I&rsquo;m alright now
          </Button>
        </div>
      </div>
    </Modal>
  )
}

/* ----------------------------------------------------------- note ------ */

function NoteModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean
  onClose: () => void
  onSave: (text: string) => void
}) {
  const [text, setText] = useState('')

  useEffect(() => {
    if (open) setText('')
  }, [open])

  return (
    <Modal open={open} onClose={onClose} title="Add a note">
      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          autoFocus
          placeholder="Anything you want to remember about this lesson…"
          aria-label="Note text"
          className="w-full p-3 rounded-md border border-plastic-edge bg-plastic-sunk text-body leading-relaxed resize-y"
        />
        <p className="text-fine text-ink-3">
          Saved in this browser only. Nothing is sent anywhere.
        </p>
        <div className="flex gap-2">
          <Button variant="primary" disabled={!text.trim()} onClick={() => onSave(text.trim())}>
            Save note
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  )
}
