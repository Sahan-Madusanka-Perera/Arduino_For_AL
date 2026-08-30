/* ============================================================================
   Content model.
   The course is data. Nothing in here knows how it will be drawn, and nothing
   in `components/` knows what the syllabus says. Adding a new unit later means
   adding files under `content/`, not touching a single component.
   ========================================================================== */

/** Where a piece of content came from, so the UI can be honest about it. */
export type Provenance =
  /** Stated in the supplied syllabus PDF. */
  | 'syllabus'
  /** Written for this course to make the syllabus teachable. Never contradicts it. */
  | 'course'

export type BlockId = string
export type LessonId = string
export type ModuleId = string
export type ConceptId = string
export type QuestionId = string
export type TermId = string

/* ------------------------------------------------------------- blocks -- */

interface BaseBlock {
  id: BlockId
}

/** A short run of explanatory prose. Markdown-lite: `**bold**`, `` `code` ``,
 *  and `[[term-id]]` which renders as an inline glossary chip. */
export interface ProseBlock extends BaseBlock {
  kind: 'prose'
  text: string
  /** Optional heading that sits above the prose. */
  heading?: string
  /** 'plain' is the default; 'lead' is the opening paragraph of a lesson. */
  tone?: 'plain' | 'lead'
}

/** The scaffold: simple explanation, then analogy, then exact definition. */
export interface DefinitionBlock extends BaseBlock {
  kind: 'definition'
  term: string
  /** Beginner-first sentence. No jargon allowed here at all. */
  simple: string
  /** The technical wording a student can write in an exam. */
  technical: string
  /** Where the technical wording came from. */
  provenance: Provenance
  example?: string
}

/** A real-world comparison, always followed by what it maps onto. */
export interface AnalogyBlock extends BaseBlock {
  kind: 'analogy'
  title: string
  analogy: string
  /** The mapping back. An analogy that is never cashed out is a lie. */
  mapping: { from: string; to: string }[]
  /** Where the analogy stops being true. Beginners need this. */
  limits?: string
}

export type CalloutVariant = 'misconception' | 'exam' | 'note' | 'remember' | 'source'

export interface CalloutBlock extends BaseBlock {
  kind: 'callout'
  variant: CalloutVariant
  title: string
  text: string
}

/** An interactive figure. `figure` names a component in components/viz. */
export interface FigureBlock extends BaseBlock {
  kind: 'figure'
  figure: string
  caption: string
  /** What a screen-reader user gets instead of the picture. Required. */
  altSummary: string
  props?: Record<string, unknown>
}

/** A comparison table. Renders as a table on wide screens and as stacked
 *  aspect cards on a phone, because a 3-column table on 360px is unreadable. */
export interface CompareBlock extends BaseBlock {
  kind: 'compare'
  title: string
  columns: [string, string]
  rows: { aspect: string; left: string; right: string }[]
}

/** Active recall. The answer is hidden behind an explicit REVEAL and the
 *  student is asked to answer in their head first. */
export interface RecallBlock extends BaseBlock {
  kind: 'recall'
  prompt: string
  answer: string
  hint?: string
}

/** A run of Arduino code with a per-line explanation, steppable. */
export interface CodeBlock extends BaseBlock {
  kind: 'code'
  code: string
  language?: 'arduino' | 'text'
  /** 1-indexed line -> what that line does. Drives the walkthrough. */
  lines?: { line: number; text: string }[]
  caption?: string
}

/** The live bench. Loads a wired circuit and its sketch, runnable. */
export interface BenchBlock extends BaseBlock {
  kind: 'bench'
  preset: string
  title: string
  brief: string
}

/** Sort items into buckets. Keyboard-operable without dragging. */
export interface SortBlock extends BaseBlock {
  kind: 'sort'
  prompt: string
  buckets: { id: string; label: string }[]
  items: { id: string; label: string; bucket: string; why: string }[]
}

/** Put steps into the right order. */
export interface OrderBlock extends BaseBlock {
  kind: 'order'
  prompt: string
  items: { id: string; label: string }[]
  /** Item ids in the correct order. */
  correct: string[]
  why: string
}

/** Feynman mode: explain it yourself, then self-check against a rubric. */
export interface ExplainBlock extends BaseBlock {
  kind: 'explain'
  prompt: string
  /** The points a good answer contains. The student ticks the ones they hit. */
  rubric: string[]
  modelAnswer: string
}

/** An inline set of questions the student must pass to move on. */
export interface CheckpointBlock extends BaseBlock {
  kind: 'checkpoint'
  title: string
  questionIds: QuestionId[]
}

/** A gallery of items with a picture, a definition and a use. Used for the
 *  20 sensors and the board family, where a list would be a wall of text. */
export interface GalleryBlock extends BaseBlock {
  kind: 'gallery'
  title: string
  intro?: string
  items: GalleryItem[]
}

export interface GalleryItem {
  id: string
  name: string
  /** Names a drawing in components/viz/parts. */
  art: string
  what: string
  how?: string
  used?: string
  tags?: string[]
}

/** A stepper: numbered stages the student advances through one at a time. */
export interface StepsBlock extends BaseBlock {
  kind: 'steps'
  title: string
  steps: { label: string; text: string }[]
}

export type Block =
  | ProseBlock
  | DefinitionBlock
  | AnalogyBlock
  | CalloutBlock
  | FigureBlock
  | CompareBlock
  | RecallBlock
  | CodeBlock
  | BenchBlock
  | SortBlock
  | OrderBlock
  | ExplainBlock
  | CheckpointBlock
  | GalleryBlock
  | StepsBlock

/* ----------------------------------------------------------- lessons -- */

export interface Lesson {
  id: LessonId
  moduleId: ModuleId
  /** Position within the module, 1-indexed. */
  number: number
  title: string
  /** One sentence a student reads before deciding to open it. */
  blurb: string
  /** Honest estimate in minutes. */
  minutes: number
  /** Why this is worth learning, in the student's own terms. */
  why: string
  objectives: string[]
  /** Lessons that should be understood first. Drives the prerequisite check. */
  prerequisites?: LessonId[]
  /** Concepts this lesson teaches. Mastery is tracked per concept, not lesson. */
  concepts: Concept[]
  blocks: Block[]
  keyTerms: TermId[]
  summary: string[]
  examTip?: string
  /** Shown behind the "I'm confused" affordance. */
  confused?: {
    simpler: string
    analogy?: string
    /** Go back to this lesson if still stuck. */
    reviewLessonId?: LessonId
  }
}

export interface Concept {
  id: ConceptId
  title: string
}

export interface Module {
  id: ModuleId
  number: number
  title: string
  /** Wire colour that identifies this module throughout the product. */
  wire: 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'violet' | 'brown'
  blurb: string
  /** What the student will be able to do at the end. */
  outcomes: string[]
  lessons: Lesson[]
}

export interface Course {
  id: string
  title: string
  subtitle: string
  /** Cited exactly, never paraphrased into a claim. */
  source: string
  modules: Module[]
}

/* --------------------------------------------------------- questions -- */

/** Bloom-style ladder. Practice serves them in this order. */
export type Level = 1 | 2 | 3 | 4 | 5

export const LEVEL_NAMES: Record<Level, string> = {
  1: 'Recognise',
  2: 'Understand',
  3: 'Apply',
  4: 'Reason',
  5: 'Exam style',
}

interface BaseQuestion {
  id: QuestionId
  conceptId: ConceptId
  lessonId: LessonId
  level: Level
  prompt: string
  /** Shown after answering, whether right or wrong. Always explains *why*. */
  explanation: string
}

export interface McqQuestion extends BaseQuestion {
  type: 'mcq'
  options: { id: string; text: string }[]
  correct: string
  /** Why each wrong option is tempting, and what confusing it reveals. */
  distractors?: Record<string, string>
}

export interface MultiQuestion extends BaseQuestion {
  type: 'multi'
  options: { id: string; text: string }[]
  correct: string[]
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'truefalse'
  correct: boolean
  /** The exact misconception this statement is probing. */
  probes?: string
}

export interface BlankQuestion extends BaseQuestion {
  type: 'blank'
  /** Prompt contains `___` where the blank goes. */
  accept: string[]
  placeholder?: string
}

export interface MatchQuestion extends BaseQuestion {
  type: 'match'
  left: { id: string; text: string }[]
  right: { id: string; text: string }[]
  /** left id -> right id */
  correct: Record<string, string>
}

export interface OrderQuestion extends BaseQuestion {
  type: 'order'
  items: { id: string; text: string }[]
  correct: string[]
}

/** Click the right part of a diagram. */
export interface HotspotQuestion extends BaseQuestion {
  type: 'hotspot'
  figure: string
  /** Region id defined by the figure component. */
  correct: string
  regions: { id: string; label: string }[]
}

export interface NumericQuestion extends BaseQuestion {
  type: 'numeric'
  correct: number
  tolerance?: number
  unit?: string
}

/** A written A/L-style answer the student self-marks against a mark scheme.
 *  No AI grading: a rubric the student applies themselves is honest, free,
 *  works offline, and forces them to read the mark scheme, which is the skill
 *  the exam actually rewards. */
export interface StructuredQuestion extends BaseQuestion {
  type: 'structured'
  marks: number
  /** One tickable line per mark. */
  markScheme: { point: string; marks: number }[]
}

export type Question =
  | McqQuestion
  | MultiQuestion
  | TrueFalseQuestion
  | BlankQuestion
  | MatchQuestion
  | OrderQuestion
  | HotspotQuestion
  | NumericQuestion
  | StructuredQuestion

export type QuestionType = Question['type']

/* --------------------------------------------------------- glossary -- */

export interface Term {
  id: TermId
  term: string
  /** Plain-language, one sentence, no jargon. */
  simple: string
  /** Exam-usable wording. */
  technical: string
  example?: string
  related?: TermId[]
  lessonId?: LessonId
  /** Short label for the group it belongs to in the glossary index. */
  group: string
}
