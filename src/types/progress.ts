import type { ConceptId, LessonId, QuestionId } from './content'

/** Mastery is a state, not a percentage, because "72%" tells a student nothing
 *  about what to do next. Each state has a required action attached to it. */
export type MasteryState =
  | 'untouched'
  | 'learning'
  | 'practising'
  | 'familiar'
  | 'proficient'
  | 'mastered'

export const MASTERY_ORDER: MasteryState[] = [
  'untouched',
  'learning',
  'practising',
  'familiar',
  'proficient',
  'mastered',
]

export interface ConceptRecord {
  /** 0..1. Weighted by question difficulty, recency and streak. */
  strength: number
  /** Total attempts ever. */
  attempts: number
  correct: number
  /** Consecutive correct answers. Resets to 0 on a miss. */
  streak: number
  /** Highest question level answered correctly. */
  bestLevel: number
  /** ms epoch. */
  lastSeen: number
  /** Spaced repetition. ms epoch of when this should come back. */
  dueAt: number
  /** Current interval in days. */
  intervalDays: number
  /** SM-2 style ease. Clamped to [1.3, 2.8]. */
  ease: number
}

export interface LessonRecord {
  /** Block ids the student has actually interacted with (revealed, answered,
   *  ran, sorted). Scrolling past does not count. */
  engaged: string[]
  /** Set when every checkpoint in the lesson has been passed. */
  completedAt?: number
  openedAt?: number
}

export interface AttemptRecord {
  questionId: QuestionId
  conceptId: ConceptId
  correct: boolean
  at: number
  /** For structured questions: marks the student awarded themselves. */
  selfMarks?: number
}

export interface Note {
  id: string
  lessonId: LessonId
  text: string
  createdAt: number
}

export interface AssessmentResult {
  id: string
  at: number
  /** 0..1 */
  score: number
  total: number
  correct: number
  byLevel: Record<number, { correct: number; total: number }>
  weakConcepts: ConceptId[]
  strongConcepts: ConceptId[]
  /** seconds */
  duration: number
  kind: 'final' | 'mock' | 'module'
  moduleId?: string
}

export interface ProgressState {
  version: number
  concepts: Record<ConceptId, ConceptRecord>
  lessons: Record<LessonId, LessonRecord>
  attempts: AttemptRecord[]
  bookmarks: LessonId[]
  savedQuestions: QuestionId[]
  notes: Note[]
  assessments: AssessmentResult[]
  /** ISO yyyy-mm-dd strings of days with any study activity. Used for a
   *  non-punitive "days practised" count, never a loss-framed streak. */
  activeDays: string[]
  /** null = follow the OS. */
  theme: 'light' | 'dark' | null
  /** Student's own name, if they gave one. Optional, local only. */
  name: string | null
  onboarded: boolean
  lastLessonId: LessonId | null
}
