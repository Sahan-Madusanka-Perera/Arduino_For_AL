import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { lessonById, questionById } from '@/content'
import { useProgress } from '@/store/progress'
import { Button, Card, EmptyState, Icon } from '@/components/ui'

/* Notes, bookmarks and saved questions in one place. Everything a student
   deliberately kept. */

export function NotesPage() {
  const notes = useProgress((s) => s.notes)
  const removeNote = useProgress((s) => s.removeNote)
  const bookmarks = useProgress((s) => s.bookmarks)
  const toggleBookmark = useProgress((s) => s.toggleBookmark)
  const savedQuestions = useProgress((s) => s.savedQuestions)
  const toggleSaved = useProgress((s) => s.toggleSavedQuestion)

  const grouped = useMemo(() => {
    const map = new Map<string, typeof notes>()
    for (const n of notes) {
      const list = map.get(n.lessonId) ?? []
      list.push(n)
      map.set(n.lessonId, list)
    }
    return [...map.entries()]
  }, [notes])

  const empty = notes.length === 0 && bookmarks.length === 0 && savedQuestions.length === 0

  if (empty) {
    return (
      <div className="max-w-[680px] mx-auto">
        <header className="mb-2 text-center">
          <h1 className="text-h1 sm:text-display font-bold tracking-tight">
            Nothing saved yet
          </h1>
        </header>
        <EmptyState
          title="Bookmarks, saved questions and notes live here"
          body="Bookmark a lesson, save a question you want to come back to, or write a note inside any lesson. Everything you keep shows up here."
          icon="note"
          action={
            <Button variant="primary" to="/path">
              Go to the course
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="max-w-[780px] mx-auto space-y-7">
      <header>
        <h1 className="text-h1 sm:text-display font-bold tracking-tight mb-3">
          Everything you kept
        </h1>
        <p className="text-lead text-ink-3 leading-relaxed max-w-2xl">
          Stored in this browser only. Nothing here has been sent anywhere.
        </p>
      </header>

      {bookmarks.length > 0 && (
        <section aria-labelledby="bm-heading">
          <h2 id="bm-heading" className="text-plain font-semibold mb-3">
            Bookmarked lessons
          </h2>
          <Card className="overflow-hidden">
            <ul>
              {bookmarks.map((id) => {
                const l = lessonById.get(id)
                if (!l) return null
                return (
                  <li key={id} className="flex items-center gap-2 border-b border-plastic-edge last:border-0">
                    <Link
                      to={`/lesson/${id}`}
                      className="flex-1 min-w-0 p-3.5 hover:bg-plastic-sunk transition-colors"
                    >
                      <span className="block text-body font-medium truncate">{l.title}</span>
                      <span className="block text-fine text-ink-3 truncate">{l.blurb}</span>
                    </Link>
                    <button
                      onClick={() => toggleBookmark(id)}
                      className="shrink-0 w-11 h-11 mr-2 grid place-items-center rounded-sm text-ink-faint hover:text-no hover:bg-plastic-sunk"
                      aria-label={`Remove bookmark from ${l.title}`}
                    >
                      <Icon name="trash" size={15} />
                    </button>
                  </li>
                )
              })}
            </ul>
          </Card>
        </section>
      )}

      {savedQuestions.length > 0 && (
        <section aria-labelledby="sq-heading">
          <div className="flex items-center gap-3 mb-3">
            <h2 id="sq-heading" className="text-plain font-semibold">
              Saved questions
            </h2>
            <Button size="sm" to="/practice" className="ml-auto">
              Practise them
            </Button>
          </div>
          <Card className="overflow-hidden">
            <ul>
              {savedQuestions.map((id) => {
                const q = questionById.get(id)
                if (!q) return null
                const lesson = lessonById.get(q.lessonId)
                return (
                  <li key={id} className="flex items-start gap-2 border-b border-plastic-edge last:border-0">
                    <Link
                      to={`/practice?q=${id}`}
                      className="flex-1 min-w-0 p-3.5 hover:bg-plastic-sunk transition-colors"
                    >
                      <span className="block text-body leading-snug mb-1 line-clamp-2">
                        {q.prompt.replace(/\*\*/g, '')}
                      </span>
                      <span className="block text-meta text-ink-3">
                        {lesson?.title} · level {q.level}
                      </span>
                    </Link>
                    <button
                      onClick={() => toggleSaved(id)}
                      className="shrink-0 w-11 h-11 mt-1 mr-2 grid place-items-center rounded-sm text-ink-faint hover:text-no hover:bg-plastic-sunk"
                      aria-label="Remove saved question"
                    >
                      <Icon name="trash" size={15} />
                    </button>
                  </li>
                )
              })}
            </ul>
          </Card>
        </section>
      )}

      {grouped.length > 0 && (
        <section aria-labelledby="notes-heading">
          <h2 id="notes-heading" className="text-plain font-semibold mb-3">
            Your notes
          </h2>
          <div className="space-y-4">
            {grouped.map(([lessonId, items]) => {
              const l = lessonById.get(lessonId)
              return (
                <div key={lessonId}>
                  <Link
                    to={`/lesson/${lessonId}`}
                    className="silk inline-flex items-center min-h-6 mb-2 hover:text-ink"
                  >
                    {l?.title ?? 'Unknown lesson'}
                  </Link>
                  <ul className="space-y-2">
                    {items.map((n) => (
                      <li key={n.id}>
                        <Card className="p-3.5 flex items-start gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-body leading-relaxed whitespace-pre-wrap">
                              {n.text}
                            </p>
                            <p className="num text-meta text-ink-faint mt-2">
                              {new Date(n.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => removeNote(n.id)}
                            className="shrink-0 w-9 h-9 grid place-items-center rounded-sm text-ink-faint hover:text-no hover:bg-plastic-sunk"
                            aria-label="Delete this note"
                          >
                            <Icon name="trash" size={15} />
                          </button>
                        </Card>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
