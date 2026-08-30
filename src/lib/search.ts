import { course, glossary, allQuestions, lessonById } from '@/content'

/* Course-wide search. Everything is static and fits comfortably in memory, so
   the index is built once at load and queried synchronously: no debounce
   needed, no network, and it works offline. */

export type ResultKind = 'lesson' | 'term' | 'question' | 'section' | 'module'

export interface SearchResult {
  kind: ResultKind
  id: string
  title: string
  /** Where this lives, shown under the title so the student knows the context. */
  context: string
  /** A snippet with the match, already trimmed. */
  snippet: string
  href: string
  score: number
}

interface Entry {
  kind: ResultKind
  id: string
  title: string
  context: string
  href: string
  /** Lowercased haystack. */
  text: string
  /** Original text, for building the snippet. */
  raw: string
  /** Weight applied to matches in this entry. */
  weight: number
}

function strip(md: string): string {
  return md
    .replace(/\[\[(?:[a-z0-9-]+\|)?([^\]]+)\]\]/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/\n+/g, ' ')
    .trim()
}

const entries: Entry[] = []

for (const mod of course.modules) {
  entries.push({
    kind: 'module',
    id: mod.id,
    title: mod.title,
    context: `Module ${mod.number}`,
    href: `/path#${mod.id}`,
    text: `${mod.title} ${mod.blurb} ${mod.outcomes.join(' ')}`.toLowerCase(),
    raw: mod.blurb,
    weight: 2,
  })

  for (const lesson of mod.lessons) {
    entries.push({
      kind: 'lesson',
      id: lesson.id,
      title: lesson.title,
      context: `${mod.title} · Lesson ${lesson.number}`,
      href: `/lesson/${lesson.id}`,
      text: `${lesson.title} ${lesson.blurb} ${lesson.why} ${lesson.objectives.join(' ')} ${lesson.summary.join(' ')}`.toLowerCase(),
      raw: lesson.blurb,
      weight: 3,
    })

    for (const block of lesson.blocks) {
      let title = ''
      let raw = ''
      switch (block.kind) {
        case 'prose':
          title = block.heading ?? lesson.title
          raw = strip(block.text)
          break
        case 'definition':
          title = block.term
          raw = `${block.simple} ${block.technical}`
          break
        case 'analogy':
          title = block.title
          raw = block.analogy
          break
        case 'callout':
          title = block.title
          raw = strip(block.text)
          break
        case 'compare':
          title = block.title
          raw = block.rows.map((r) => `${r.aspect}: ${r.left} / ${r.right}`).join('. ')
          break
        case 'steps':
          title = block.title
          raw = block.steps.map((s) => `${s.label}: ${s.text}`).join('. ')
          break
        case 'gallery':
          title = block.title
          raw = block.items.map((i) => `${i.name}: ${i.what}`).join('. ')
          break
        case 'code':
          title = block.caption ?? 'Code'
          raw = block.code
          break
        case 'recall':
          title = 'Active recall'
          raw = block.prompt
          break
        default:
          continue
      }
      if (!raw) continue
      entries.push({
        kind: 'section',
        id: `${lesson.id}#${block.id}`,
        title,
        context: `${lesson.title}`,
        href: `/lesson/${lesson.id}#${block.id}`,
        text: `${title} ${raw}`.toLowerCase(),
        raw,
        weight: 1,
      })
    }
  }
}

for (const term of glossary) {
  entries.push({
    kind: 'term',
    id: term.id,
    title: term.term,
    context: `Glossary · ${term.group}`,
    href: `/glossary#${term.id}`,
    text: `${term.term} ${term.simple} ${term.technical} ${term.example ?? ''}`.toLowerCase(),
    raw: term.simple,
    weight: 3,
  })
}

for (const q of allQuestions) {
  const lesson = lessonById.get(q.lessonId)
  entries.push({
    kind: 'question',
    id: q.id,
    title: strip(q.prompt).slice(0, 90),
    context: lesson ? `Question · ${lesson.title}` : 'Question',
    href: `/practice?q=${q.id}`,
    text: `${q.prompt} ${q.explanation}`.toLowerCase(),
    raw: strip(q.explanation),
    weight: 1,
  })
}

function snippetFor(raw: string, needle: string): string {
  const lower = raw.toLowerCase()
  const at = lower.indexOf(needle)
  if (at < 0) return raw.slice(0, 140)
  const start = Math.max(0, at - 50)
  const end = Math.min(raw.length, at + needle.length + 90)
  return `${start > 0 ? '…' : ''}${raw.slice(start, end).trim()}${end < raw.length ? '…' : ''}`
}

export function search(query: string, limit = 24): SearchResult[] {
  const q = query.trim().toLowerCase()
  if (q.length < 2) return []
  const words = q.split(/\s+/).filter(Boolean)

  const hits: SearchResult[] = []
  for (const e of entries) {
    let score = 0
    for (const w of words) {
      const idx = e.text.indexOf(w)
      if (idx < 0) {
        // Every word must appear somewhere, so a two-word query does not match
        // an entry that only contains one of them.
        score = -1
        break
      }
      score += e.weight
      // A match in the title is worth much more than one buried in the body.
      if (e.title.toLowerCase().includes(w)) score += e.weight * 3
      // An exact word boundary beats a substring inside another word.
      if (new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(e.text)) score += 1
    }
    if (score > 0) {
      hits.push({
        kind: e.kind,
        id: e.id,
        title: e.title,
        context: e.context,
        snippet: snippetFor(e.raw, words[0]),
        href: e.href,
        score,
      })
    }
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, limit)
}

export const KIND_LABEL: Record<ResultKind, string> = {
  lesson: 'Lesson',
  module: 'Module',
  section: 'In a lesson',
  term: 'Glossary',
  question: 'Question',
}
