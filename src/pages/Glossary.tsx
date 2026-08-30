import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { glossary, glossaryById, lessonById } from '@/content'
import { Card, Chip, EmptyState, Icon, Silk, Tabs } from '@/components/ui'

/* The glossary. Grouped by area, searchable, and every entry gives the plain
   sentence before the exam wording, in that order, every time. */

export function GlossaryPage() {
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState('all')
  const location = useLocation()

  const groups = useMemo(() => [...new Set(glossary.map((t) => t.group))], [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return glossary
      .filter((t) => group === 'all' || t.group === group)
      .filter(
        (t) =>
          !q ||
          t.term.toLowerCase().includes(q) ||
          t.simple.toLowerCase().includes(q) ||
          t.technical.toLowerCase().includes(q),
      )
      .sort((a, b) => a.term.localeCompare(b.term))
  }, [query, group])

  // Deep links from a lesson chip land on the right entry.
  useEffect(() => {
    const id = location.hash.slice(1)
    if (!id) return
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ block: 'center' })
      el.focus()
    }
  }, [location.hash])

  return (
    <div className="max-w-[880px] mx-auto space-y-5">
      <header>
        <h1 className="text-h1 sm:text-display font-bold tracking-tight mb-3">
          Every term in the course
        </h1>
        <p className="text-lead text-ink-3 leading-relaxed max-w-2xl">
          <span className="num font-semibold">{glossary.length}</span> terms, each with a plain
          sentence first and the wording you can write in an exam second. Any bold dotted word in a
          lesson opens the same entry without losing your place.
        </p>
      </header>

      <div className="sticky top-16 z-10 -mx-4 px-4 py-3 bg-[color-mix(in_srgb,var(--plastic)_92%,transparent)] backdrop-blur-md space-y-3">
        <div className="relative">
          <Icon
            name="search"
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search terms…"
            aria-label="Search the glossary"
            autoComplete="off"
            className="w-full h-12 pl-10 pr-3 rounded-md border border-plastic-edge bg-plastic-raised text-body"
          />
        </div>
        <Tabs
          label="Filter by area"
          active={group}
          onChange={setGroup}
          tabs={[
            { id: 'all', label: 'All', count: glossary.length },
            ...groups.map((g) => ({
              id: g,
              label: g,
              count: glossary.filter((t) => t.group === g).length,
            })),
          ]}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No terms match that"
          body={`Nothing in the glossary matches "${query}". Try a shorter word, or clear the area filter.`}
          icon="search"
        />
      ) : (
        <ul className="space-y-2.5">
          {filtered.map((term) => (
            <li key={term.id}>
              <Card
                id={term.id}
                tabIndex={-1}
                className="p-4 sm:p-5 scroll-mt-40 outline-none focus-visible:outline-3"
              >
                <div className="flex items-baseline gap-2.5 mb-3 flex-wrap">
                  <h2 className="text-intro font-semibold">{term.term}</h2>
                  <Chip tone="neutral">{term.group}</Chip>
                </div>

                <div className="space-y-3">
                  <div>
                    <Silk className="block mb-1">In plain words</Silk>
                    <p className="text-plain leading-relaxed">{term.simple}</p>
                  </div>

                  <div>
                    <Silk className="block mb-1">Exam wording</Silk>
                    <p className="text-body leading-relaxed text-ink-2 p-3 rounded-md bg-plastic-sunk border border-plastic-edge">
                      {term.technical}
                    </p>
                  </div>

                  {term.example && (
                    <div>
                      <Silk className="block mb-1">Example</Silk>
                      <p className="text-body leading-relaxed text-ink-2">
                        {term.example}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-plastic-edge flex items-center gap-3 flex-wrap">
                  {term.related && term.related.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Silk>See also</Silk>
                      {term.related.map((r) => {
                        const rel = glossaryById.get(r)
                        if (!rel) return null
                        return (
                          <a
                            key={r}
                            href={`#${r}`}
                            className="inline-flex items-center justify-center min-h-6 min-w-6 px-1 text-fine underline underline-offset-2 decoration-ink-faint hover:decoration-ink"
                          >
                            {rel.term}
                          </a>
                        )
                      })}
                    </div>
                  )}
                  {term.lessonId && lessonById.get(term.lessonId) && (
                    <Link
                      to={`/lesson/${term.lessonId}`}
                      className="ml-auto text-fine font-medium flex items-center gap-1.5 min-h-6 hover:underline underline-offset-2"
                    >
                      Where it is taught
                      <Icon name="arrowRight" size={13} />
                    </Link>
                  )}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
