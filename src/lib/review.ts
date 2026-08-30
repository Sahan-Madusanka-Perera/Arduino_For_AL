import type { ConceptRecord } from '@/types/progress'
import type { Question } from '@/types/content'
import { conceptById, lessonForConcept, questionsByConcept } from '@/content'
import { decayedStrength, masteryOf } from './mastery'

/* The review queue.

   Kept deliberately small. What matters pedagogically is only that material a
   student got wrong comes back soon, that solid material comes back rarely,
   and that the queue is short enough to actually finish. A queue of forty
   items is a queue nobody opens. */

export interface ReviewItem {
  conceptId: string
  title: string
  lessonId: string
  lessonTitle: string
  /** Why this is in the queue, in words a student can act on. */
  reason: string
  /** Lower is more urgent. */
  priority: number
  strength: number
  question?: Question
}

const DAY = 86_400_000

export function buildReviewQueue(
  records: Record<string, ConceptRecord>,
  now = Date.now(),
  max = 8,
): ReviewItem[] {
  const items: ReviewItem[] = []

  for (const [conceptId, rec] of Object.entries(records)) {
    const concept = conceptById.get(conceptId)
    const lesson = lessonForConcept.get(conceptId)
    if (!concept || !lesson) continue
    if (rec.attempts === 0) continue

    const strength = decayedStrength(rec, now)
    const state = masteryOf(rec, now)
    const overdueDays = (now - rec.dueAt) / DAY

    let reason: string | null = null
    let priority = 100

    if (rec.streak === 0 && rec.attempts > 0 && strength < 0.5) {
      reason = 'You got this wrong recently'
      priority = 0
    } else if (rec.dueAt > 0 && now >= rec.dueAt) {
      reason =
        overdueDays > 7
          ? 'It has been a while since you looked at this'
          : 'Due for review today'
      priority = 10 - Math.min(9, overdueDays)
    } else if (strength < 0.4) {
      reason = 'Still shaky'
      priority = 20
    } else if (state === 'familiar' && rec.bestLevel < 4) {
      reason = 'Close to proficient. One harder question would do it'
      priority = 40
    }

    if (!reason) continue

    // Pick a question the student is most likely to learn from: one level above
    // what they have already managed, so review is a step forward rather than a
    // repeat of something already easy.
    const pool = questionsByConcept.get(conceptId) ?? []
    const target = Math.min(5, Math.max(1, rec.bestLevel + (strength > 0.6 ? 1 : 0)))
    const question =
      pool.find((q) => q.level === target) ??
      pool.find((q) => q.level <= target) ??
      pool[0]

    items.push({
      conceptId,
      title: concept.title,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      reason,
      priority,
      strength,
      question,
    })
  }

  return items.sort((a, b) => a.priority - b.priority || a.strength - b.strength).slice(0, max)
}

/** How many items are waiting, without building the whole queue. Used for the
 *  badge in the navigation. */
export function reviewCount(records: Record<string, ConceptRecord>, now = Date.now()): number {
  return buildReviewQueue(records, now, 99).length
}

/** Concepts the student is weakest on, for the dashboard and results screens. */
export function weakestConcepts(
  records: Record<string, ConceptRecord>,
  now = Date.now(),
  max = 4,
): { conceptId: string; title: string; lessonId: string; strength: number }[] {
  return Object.entries(records)
    .filter(([, r]) => r.attempts > 0)
    .map(([id, r]) => ({
      conceptId: id,
      title: conceptById.get(id)?.title ?? id,
      lessonId: lessonForConcept.get(id)?.id ?? '',
      strength: decayedStrength(r, now),
    }))
    .filter((c) => c.lessonId && c.strength < 0.7)
    .sort((a, b) => a.strength - b.strength)
    .slice(0, max)
}

export function strongestConcepts(
  records: Record<string, ConceptRecord>,
  now = Date.now(),
  max = 4,
): { conceptId: string; title: string; strength: number }[] {
  return Object.entries(records)
    .filter(([, r]) => r.attempts > 1)
    .map(([id, r]) => ({
      conceptId: id,
      title: conceptById.get(id)?.title ?? id,
      strength: decayedStrength(r, now),
    }))
    .filter((c) => c.strength >= 0.75)
    .sort((a, b) => b.strength - a.strength)
    .slice(0, max)
}

/** Consecutive days of study, counted forwards from the most recent. Presented
 *  as an encouraging fact, never as something the student can lose: a streak
 *  used as a threat is a manipulation, not a teaching tool. */
export function daysPractised(activeDays: string[]): { total: number; run: number } {
  if (activeDays.length === 0) return { total: 0, run: 0 }
  const sorted = [...new Set(activeDays)].sort()
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - DAY).toISOString().slice(0, 10)

  let run = 0
  const last = sorted[sorted.length - 1]
  if (last === today || last === yesterday) {
    run = 1
    for (let i = sorted.length - 2; i >= 0; i--) {
      const expected = new Date(new Date(sorted[i + 1]).getTime() - DAY)
        .toISOString()
        .slice(0, 10)
      if (sorted[i] === expected) run++
      else break
    }
  }
  return { total: sorted.length, run }
}
