import type { Course, Lesson, Module, Question, Concept } from '@/types/content'
import { m1 } from './modules/m1-iot'
import { m2 } from './modules/m2-embedded'
import { m3 } from './modules/m3-boards'
import { m4 } from './modules/m4-components'
import { m5 } from './modules/m5-sensors'
import { m6 } from './modules/m6-programming'
import { m7 } from './modules/m7-practicals'
import { checkpointQuestions } from './questions/checkpoints'
import { practice } from './questions/practice'

export const course: Course = {
  id: 'al-ict-iot-arduino',
  title: 'IoT, Embedded Systems & Arduino',
  subtitle: 'G.C.E. Advanced Level ICT · Sri Lanka',
  source: 'Built from the supplied 40-page syllabus unit (ictfromabc.com).',
  modules: [m1, m2, m3, m4, m5, m6, m7],
}

export const allQuestions: Question[] = [...checkpointQuestions, ...practice]

/* -------------------------------------------------------------- indexes -- */
/* Built once at module load. The course is a few hundred kilobytes of static
   data, so a handful of Maps is far cheaper than searching arrays on every
   render, and it keeps every lookup in the app O(1). */

export const lessons: Lesson[] = course.modules.flatMap((m) => m.lessons)
export const lessonById = new Map(lessons.map((l) => [l.id, l]))
export const moduleById = new Map(course.modules.map((m) => [m.id, m]))
export const questionById = new Map(allQuestions.map((q) => [q.id, q]))

export const concepts: Concept[] = lessons.flatMap((l) => l.concepts)
export const conceptById = new Map(concepts.map((c) => [c.id, c]))

/** conceptId -> the lesson that teaches it. */
export const lessonForConcept = new Map<string, Lesson>()
for (const lesson of lessons) {
  for (const concept of lesson.concepts) lessonForConcept.set(concept.id, lesson)
}

/** conceptId -> every question that tests it. */
export const questionsByConcept = new Map<string, Question[]>()
for (const q of allQuestions) {
  const list = questionsByConcept.get(q.conceptId)
  if (list) list.push(q)
  else questionsByConcept.set(q.conceptId, [q])
}

/** moduleId -> every conceptId in it. */
export const conceptsByModule = new Map<string, string[]>(
  course.modules.map((m) => [m.id, m.lessons.flatMap((l) => l.concepts.map((c) => c.id))]),
)

export const totalConcepts = concepts.length
export const totalLessons = lessons.length

export function moduleOfLesson(lessonId: string): Module | undefined {
  const lesson = lessonById.get(lessonId)
  return lesson ? moduleById.get(lesson.moduleId) : undefined
}

/** The course as a flat, ordered list, for "next" and "previous" navigation. */
export const lessonOrder: string[] = lessons.map((l) => l.id)

export function nextLesson(lessonId: string): Lesson | undefined {
  const i = lessonOrder.indexOf(lessonId)
  return i >= 0 && i < lessonOrder.length - 1 ? lessonById.get(lessonOrder[i + 1]) : undefined
}

export function prevLesson(lessonId: string): Lesson | undefined {
  const i = lessonOrder.indexOf(lessonId)
  return i > 0 ? lessonById.get(lessonOrder[i - 1]) : undefined
}

/** Questions for a lesson, ordered easiest first. */
export function questionsForLesson(lessonId: string): Question[] {
  return allQuestions
    .filter((q) => q.lessonId === lessonId)
    .sort((a, b) => a.level - b.level)
}

export { glossary, glossaryById } from './glossary'
