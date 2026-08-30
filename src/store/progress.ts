import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  AssessmentResult,
  ConceptRecord,
  Note,
  ProgressState,
} from '@/types/progress'
import type { ConceptId, Level, LessonId, QuestionId } from '@/types/content'
import { emptyConcept, grade } from '@/lib/mastery'

const VERSION = 1

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

const initial: ProgressState = {
  version: VERSION,
  concepts: {},
  lessons: {},
  attempts: [],
  bookmarks: [],
  savedQuestions: [],
  notes: [],
  assessments: [],
  activeDays: [],
  theme: null,
  name: null,
  onboarded: false,
  lastLessonId: null,
}

interface Actions {
  answer(input: {
    questionId: QuestionId
    conceptId: ConceptId
    level: Level
    correct: boolean
    partial?: number
  }): void
  engage(lessonId: LessonId, blockId: string): void
  openLesson(lessonId: LessonId): void
  completeLesson(lessonId: LessonId): void
  toggleBookmark(lessonId: LessonId): void
  toggleSavedQuestion(id: QuestionId): void
  addNote(lessonId: LessonId, text: string): void
  removeNote(id: string): void
  recordAssessment(result: Omit<AssessmentResult, 'id' | 'at'>): void
  setTheme(theme: 'light' | 'dark' | null): void
  setName(name: string | null): void
  setOnboarded(v: boolean): void
  resetAll(): void
  conceptRecord(id: ConceptId): ConceptRecord
}

export type ProgressStore = ProgressState & Actions

/** Note the writes are all shallow-merged copies: the store is small enough
 *  that immutability costs nothing and makes the selectors trivially correct. */
export const useProgress = create<ProgressStore>()(
  persist(
    (set, get) => ({
      ...initial,

      conceptRecord(id) {
        return get().concepts[id] ?? emptyConcept()
      },

      answer({ questionId, conceptId, level, correct, partial }) {
        const now = Date.now()
        set((s) => {
          const rec = s.concepts[conceptId] ?? emptyConcept()
          const day = today()
          return {
            concepts: { ...s.concepts, [conceptId]: grade(rec, { correct, level, partial }, now) },
            attempts: [
              ...s.attempts.slice(-499),
              { questionId, conceptId, correct, at: now, selfMarks: partial },
            ],
            activeDays: s.activeDays.includes(day) ? s.activeDays : [...s.activeDays, day],
          }
        })
      },

      engage(lessonId, blockId) {
        set((s) => {
          const rec = s.lessons[lessonId] ?? { engaged: [] }
          if (rec.engaged.includes(blockId)) return s
          const day = today()
          return {
            lessons: {
              ...s.lessons,
              [lessonId]: { ...rec, engaged: [...rec.engaged, blockId] },
            },
            activeDays: s.activeDays.includes(day) ? s.activeDays : [...s.activeDays, day],
          }
        })
      },

      openLesson(lessonId) {
        set((s) => {
          const rec = s.lessons[lessonId] ?? { engaged: [] }
          const day = today()
          return {
            lessons: { ...s.lessons, [lessonId]: { ...rec, openedAt: rec.openedAt ?? Date.now() } },
            lastLessonId: lessonId,
            activeDays: s.activeDays.includes(day) ? s.activeDays : [...s.activeDays, day],
          }
        })
      },

      completeLesson(lessonId) {
        set((s) => {
          const rec = s.lessons[lessonId] ?? { engaged: [] }
          if (rec.completedAt) return s
          return {
            lessons: { ...s.lessons, [lessonId]: { ...rec, completedAt: Date.now() } },
          }
        })
      },

      toggleBookmark(lessonId) {
        set((s) => ({
          bookmarks: s.bookmarks.includes(lessonId)
            ? s.bookmarks.filter((b) => b !== lessonId)
            : [...s.bookmarks, lessonId],
        }))
      },

      toggleSavedQuestion(id) {
        set((s) => ({
          savedQuestions: s.savedQuestions.includes(id)
            ? s.savedQuestions.filter((q) => q !== id)
            : [...s.savedQuestions, id],
        }))
      },

      addNote(lessonId, text) {
        const note: Note = {
          id: `n${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
          lessonId,
          text,
          createdAt: Date.now(),
        }
        set((s) => ({ notes: [note, ...s.notes] }))
      },

      removeNote(id) {
        set((s) => ({ notes: s.notes.filter((n) => n.id !== id) }))
      },

      recordAssessment(result) {
        set((s) => ({
          assessments: [
            {
              ...result,
              id: `a${Date.now().toString(36)}`,
              at: Date.now(),
            },
            ...s.assessments,
          ].slice(0, 40),
        }))
      },

      setTheme(theme) {
        set({ theme })
      },
      setName(name) {
        set({ name })
      },
      setOnboarded(v) {
        set({ onboarded: v })
      },
      resetAll() {
        set({ ...initial, theme: get().theme })
      },
    }),
    {
      name: 'the-bench:progress',
      version: VERSION,
      storage: createJSONStorage(() => {
        // A student in a private window or with site data blocked must still be
        // able to use the whole course; they just lose persistence. Falling back
        // to an in-memory shim keeps every screen working instead of throwing on
        // first write.
        try {
          const probe = '__bench_probe__'
          window.localStorage.setItem(probe, '1')
          window.localStorage.removeItem(probe)
          return window.localStorage
        } catch {
          const mem = new Map<string, string>()
          return {
            getItem: (k: string) => mem.get(k) ?? null,
            setItem: (k: string, v: string) => void mem.set(k, v),
            removeItem: (k: string) => void mem.delete(k),
          }
        }
      }),
      partialize: (s) => ({
        version: s.version,
        concepts: s.concepts,
        lessons: s.lessons,
        attempts: s.attempts,
        bookmarks: s.bookmarks,
        savedQuestions: s.savedQuestions,
        notes: s.notes,
        assessments: s.assessments,
        activeDays: s.activeDays,
        theme: s.theme,
        name: s.name,
        onboarded: s.onboarded,
        lastLessonId: s.lastLessonId,
      }),
    },
  ),
)

/** True if persistence is actually working, so the UI can say so honestly
 *  rather than silently losing a student's work. */
export function storageAvailable(): boolean {
  try {
    const probe = '__bench_probe__'
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
}
