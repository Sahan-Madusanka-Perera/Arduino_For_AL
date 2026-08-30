/* ============================================================================
   A deliberately small translation layer.

   The syllabus this course is built from is bilingual, but its Sinhala is
   stored in a legacy FM-Abhaya font encoding that does not extract as Unicode.
   Auto-converting it would risk showing students misspelt Sinhala, which is
   worse than showing none, so this ships English only.

   What it does provide is the seam: every UI string in the product goes
   through t(), so adding a Sinhala dictionary later means adding one file and
   a language toggle, not editing every component. Lesson content is separate
   and lives under content/, where a `si` field can be added per block.
   ========================================================================== */

export type Lang = 'en' | 'si'

type Dict = Record<string, string>

const en: Dict = {
  'app.name': 'The Bench',
  'app.tagline': 'IoT, Embedded Systems & Arduino',

  'nav.dashboard': 'Bench',
  'nav.path': 'Course',
  'nav.practice': 'Practice',
  'nav.review': 'Review',
  'nav.lab': 'Lab',
  'nav.glossary': 'Glossary',
  'nav.exam': 'Exam prep',
  'nav.search': 'Search',
  'nav.notes': 'Notes',
  'nav.skip': 'Skip to main content',

  'action.continue': 'Continue learning',
  'action.start': 'Start',
  'action.next': 'Next',
  'action.back': 'Back',
  'action.reveal': 'Reveal',
  'action.check': 'Check answer',
  'action.retry': 'Try again',
  'action.confused': "I'm confused",
  'action.run': 'Run',
  'action.stop': 'Stop',
  'action.step': 'Step',
  'action.reset': 'Reset',

  'mastery.notStarted': 'Not started',
  'mastery.learning': 'Learning',
  'mastery.practising': 'Practising',
  'mastery.familiar': 'Familiar',
  'mastery.proficient': 'Proficient',
  'mastery.mastered': 'Mastered',
}

const dictionaries: Record<Lang, Dict> = {
  en,
  // Sinhala is intentionally empty. Keys fall back to English, so adding
  // translations here is purely additive and can be done a screen at a time.
  si: {},
}

let current: Lang = 'en'

export function setLang(lang: Lang) {
  current = lang
  document.documentElement.lang = lang
}

export function getLang(): Lang {
  return current
}

/** Translate a key. Falls back to English, then to the key itself, so a
 *  missing string is always visible in development rather than blank. */
export function t(key: string, fallback?: string): string {
  return dictionaries[current][key] ?? en[key] ?? fallback ?? key
}
