import type { ConceptRecord, MasteryState } from '@/types/progress'
import type { Level } from '@/types/content'

/* ============================================================================
   The mastery engine.

   Two rules shaped this file:

   1. Visiting a page is not learning. Strength only moves on an *answer*.
   2. A hard question answered right is worth more than an easy one, and a
      question answered right today is worth more than one answered right last
      month. Both fall out of the weighting below.
   ========================================================================== */

const DAY = 86_400_000

/** How much each difficulty level contributes when answered correctly. A
 *  level-5 exam question moves the needle more than a level-1 recall. */
const LEVEL_WEIGHT: Record<Level, number> = {
  1: 0.10,
  2: 0.14,
  3: 0.18,
  4: 0.22,
  5: 0.26,
}

/** A miss costs more than a hit gains, but never wipes the record: a student
 *  who got it right five times and slipped once has not forgotten it. */
const MISS_PENALTY = 0.22

export function emptyConcept(): ConceptRecord {
  return {
    strength: 0,
    attempts: 0,
    correct: 0,
    streak: 0,
    bestLevel: 0,
    lastSeen: 0,
    dueAt: 0,
    intervalDays: 0,
    ease: 2.3,
  }
}

/** Strength decays with time so "mastered in April" does not read as mastered
 *  in September. Half-life scales with how well it was learnt: something
 *  answered right at level 5 four times over decays far slower than something
 *  scraped through once. */
export function decayedStrength(rec: ConceptRecord, now = Date.now()): number {
  if (rec.strength <= 0 || !rec.lastSeen) return rec.strength
  const days = (now - rec.lastSeen) / DAY
  if (days < 1) return rec.strength
  // Half-life in days: 4 days for a shaky concept, up to ~60 for a solid one.
  const halfLife = 4 + rec.streak * 6 + rec.bestLevel * 4
  const decayed = rec.strength * Math.pow(0.5, days / halfLife)
  // Never decay below a floor proportional to lifetime accuracy: you do not
  // forget everything.
  const floor = rec.attempts > 0 ? (rec.correct / rec.attempts) * 0.3 : 0
  return Math.max(floor, decayed)
}

export interface GradeInput {
  correct: boolean
  level: Level
  /** For structured self-marked questions: fraction of marks awarded. */
  partial?: number
}

/** Apply one answer to a concept record and return the new record. Pure. */
export function grade(
  rec: ConceptRecord,
  input: GradeInput,
  now = Date.now(),
): ConceptRecord {
  const base = decayedStrength(rec, now)
  const next: ConceptRecord = { ...rec, attempts: rec.attempts + 1, lastSeen: now }

  const credit = input.partial ?? (input.correct ? 1 : 0)
  const scored = credit >= 0.5

  if (scored) {
    const gain = LEVEL_WEIGHT[input.level] * credit
    // Diminishing returns: the last 20% of strength is the hardest to earn.
    next.strength = Math.min(1, base + gain * (1 - base * 0.55))
    next.correct = rec.correct + 1
    next.streak = rec.streak + 1
    next.bestLevel = Math.max(rec.bestLevel, input.level)
    next.ease = clamp(rec.ease + 0.08, 1.3, 2.8)
  } else {
    next.strength = Math.max(0, base - MISS_PENALTY * (0.4 + base * 0.6))
    next.streak = 0
    next.ease = clamp(rec.ease - 0.2, 1.3, 2.8)
  }

  return scheduleReview(next, scored, now)
}

/* ------------------------------------------------- spaced repetition -- */
/* Deliberately small. A full SM-2 implementation would add parameters no
   student will ever tune. What matters pedagogically is only that missed
   material returns soon and solid material returns rarely. */

const STEPS = [1, 3, 7, 16, 35, 70]

function scheduleReview(rec: ConceptRecord, scored: boolean, now: number): ConceptRecord {
  let intervalDays: number
  if (!scored) {
    // Bring it back tomorrow, and reset the ladder.
    intervalDays = 1
  } else if (rec.intervalDays === 0) {
    intervalDays = STEPS[0]
  } else {
    const idx = STEPS.findIndex((s) => s >= rec.intervalDays)
    const nextStep = idx >= 0 && idx < STEPS.length - 1 ? STEPS[idx + 1] : undefined
    intervalDays = nextStep ?? Math.round(rec.intervalDays * rec.ease)
  }
  return { ...rec, intervalDays, dueAt: now + intervalDays * DAY }
}

/* ------------------------------------------------------------ states -- */

/** Turn a record into a state a student can act on. The thresholds are joined
 *  by an `attempts` requirement so a single lucky guess cannot read as
 *  "proficient". */
export function masteryOf(rec: ConceptRecord | undefined, now = Date.now()): MasteryState {
  if (!rec || rec.attempts === 0) return rec && rec.lastSeen ? 'learning' : 'untouched'
  const s = decayedStrength(rec, now)
  if (s >= 0.9 && rec.attempts >= 4 && rec.bestLevel >= 4) return 'mastered'
  if (s >= 0.75 && rec.attempts >= 3) return 'proficient'
  if (s >= 0.55 && rec.attempts >= 2) return 'familiar'
  if (s >= 0.25) return 'practising'
  return 'learning'
}

export const MASTERY_LABEL: Record<MasteryState, string> = {
  untouched: 'Not started',
  learning: 'Learning',
  practising: 'Practising',
  familiar: 'Familiar',
  proficient: 'Proficient',
  mastered: 'Mastered',
}

/** What to actually do next, per state. A state with no next action is a
 *  dead end, and dead ends are the thing this product exists to remove. */
export const MASTERY_ACTION: Record<MasteryState, string> = {
  untouched: 'Start the lesson',
  learning: 'Read it through, then try the quick check',
  practising: 'Answer a few more questions to lock it in',
  familiar: 'Try a harder question on this',
  proficient: 'One exam-style question would finish it',
  mastered: 'Nothing needed. It will come back for review later',
}

/** Colour is never the only signal, so every state also carries a fill level
 *  (holes occupied out of 5) and a distinct mark. */
export const MASTERY_FILL: Record<MasteryState, number> = {
  untouched: 0,
  learning: 1,
  practising: 2,
  familiar: 3,
  proficient: 4,
  mastered: 5,
}

export function masteryPercent(rec: ConceptRecord | undefined, now = Date.now()): number {
  if (!rec) return 0
  return Math.round(decayedStrength(rec, now) * 100)
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n))
}

/** Aggregate strength across a set of concepts. Used for module and course
 *  level readouts. Returns 0..1. */
export function aggregate(
  ids: string[],
  records: Record<string, ConceptRecord>,
  now = Date.now(),
): number {
  if (ids.length === 0) return 0
  const total = ids.reduce((sum, id) => sum + decayedStrength(records[id] ?? emptyConcept(), now), 0)
  return total / ids.length
}
