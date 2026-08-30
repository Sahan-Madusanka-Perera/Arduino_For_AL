/* A headless exercise of the parser, interpreter and circuit model.
 *
 * Run with:  npm test
 *
 * It runs every sketch the course ships, checks that each one actually does
 * what the lesson claims it does, and checks that the mistakes students make
 * most often produce the error message we promise them. If a syllabus program
 * ever stops behaving, this fails loudly rather than silently teaching the
 * wrong thing. */

import { Board, A0 } from '../src/lib/arduino/board.ts'
import { Interpreter } from '../src/lib/arduino/interpreter.ts'
import { ArduinoError } from '../src/lib/arduino/parser.ts'
import { applyEnvironment } from '../src/lib/arduino/circuit.ts'
import { PRESETS, getPreset } from '../src/lib/arduino/presets.ts'
import { grade, emptyConcept, masteryOf, decayedStrength } from '../src/lib/mastery.ts'
import { allQuestions, lessons, conceptById, questionsByConcept } from '../src/content/index.ts'
import { glossary } from '../src/content/glossary.ts'

let pass = 0
let fail = 0

function check(name: string, cond: boolean, detail = '') {
  if (cond) {
    pass++
  } else {
    fail++
    console.error(`  FAIL  ${name}${detail ? `\n        ${detail}` : ''}`)
  }
}

/** Run a sketch for a bounded number of statements, feeding the environment in
 *  the way the real Runtime does. Delays are served instantly. */
function run(
  source: string,
  opts: { components?: any[]; env?: Record<string, number>; steps?: number } = {},
) {
  const board = new Board()
  const interp = new Interpreter(source, board)
  const components = opts.components ?? []
  const env = opts.env ?? {}
  const limit = opts.steps ?? 4000

  let gen = interp.runSetup()
  let phase: 'setup' | 'loop' = 'setup'
  let loops = 0

  for (let i = 0; i < limit; i++) {
    applyEnvironment(board, components, env)
    const next = gen.next()
    if (next.done) {
      if (phase === 'setup') {
        phase = 'loop'
        if (!interp.hasLoop()) break
      } else {
        loops++
        if (loops > 40) break
      }
      gen = interp.runLoopOnce()
      continue
    }
    if (next.value.type === 'delay') board.clock += next.value.ms
    else board.clock += 0.05
  }
  return { board, loops }
}

/* ---------------------------------------------------- every preset runs -- */

console.log('\nEvery shipped sketch compiles and runs')
for (const preset of PRESETS) {
  try {
    const env = Object.fromEntries(preset.env.map((e) => [e.id, e.value]))
    const { board } = run(preset.sketch, { components: preset.components, env })
    check(`${preset.id} runs`, true)
    check(`${preset.id} clock advanced`, board.clock > 0, `clock = ${board.clock}`)
  } catch (e) {
    check(`${preset.id} runs`, false, e instanceof Error ? e.message : String(e))
  }
}

/* ------------------------------------------- syllabus practical 1: blink -- */

console.log('\nPractical 1 — blink')
{
  const src = getPreset('blink')!.sketch
  // Stop right after the first digitalWrite(13, HIGH).
  const board = new Board()
  const interp = new Interpreter(src, board)
  let gen = interp.runSetup()
  while (!gen.next().done) {}
  check('pin 13 is an OUTPUT after setup', board.pins[13].mode === 'OUTPUT')
  check('pin 13 starts LOW', board.pins[13].voltage === 0)

  gen = interp.runLoopOnce()
  let sawHigh = false
  let firstDelay = 0
  for (let i = 0; i < 50; i++) {
    const n = gen.next()
    if (n.done) break
    if (board.pins[13].voltage === 5) sawHigh = true
    if (n.value.type === 'delay' && !firstDelay) firstDelay = n.value.ms
  }
  check('digitalWrite(13, HIGH) raises the pin to 5V', sawHigh)
  check('delay is 1000 ms', firstDelay === 1000, `got ${firstDelay}`)
}

/* --------------------------------------------- syllabus practical 3: LDR -- */

console.log('\nPractical 3 — LDR threshold at 200')
{
  const preset = getPreset('ldr')!
  for (const [light, expectLit] of [
    [5, true],
    [15, true],
    [70, false],
    [100, false],
  ] as [number, boolean][]) {
    const { board } = run(preset.sketch, {
      components: preset.components,
      env: { light },
    })
    const reading = Math.round((board.pins[A0].voltage / 5) * 1023)
    const lit = board.pins[13].voltage === 5
    check(
      `light ${light}% → reading ${reading} → LED ${expectLit ? 'on' : 'off'}`,
      lit === expectLit,
      `reading=${reading} lit=${lit}`,
    )
  }
  // The syllabus states 0 = dark, 1023 = bright.
  const dark = run(preset.sketch, { components: preset.components, env: { light: 0 } })
  const bright = run(preset.sketch, { components: preset.components, env: { light: 100 } })
  check('0% light reads 0', Math.round((dark.board.pins[A0].voltage / 5) * 1023) === 0)
  check('100% light reads 1023', Math.round((bright.board.pins[A0].voltage / 5) * 1023) === 1023)
}

/* ------------------------------------------- syllabus practical 4: LM35 --- */

console.log('\nPractical 4 — LM35 conversion and 25 °C threshold')
{
  const preset = getPreset('thermostat')!
  // Note 25.0 itself: 0.25 V reads as ADC 51, which converts back to 24.93,
  // so the motor stays off at exactly the threshold. That is what real
  // hardware does, and the lesson says so.
  for (const [temp, expectOn] of [
    [10, false],
    [24.5, false],
    [25, false],
    [25.5, true],
    [40, true],
  ] as [number, boolean][]) {
    const { board } = run(preset.sketch, { components: preset.components, env: { temp } })
    const on = board.pins[7].voltage === 5
    check(`${temp} °C → motor ${expectOn ? 'on' : 'off'}`, on === expectOn, `motor on = ${on}`)
  }
  // 10 mV per °C: at 25 °C the sensor pin must sit at 0.25 V.
  const b = new Board()
  applyEnvironment(b, preset.components, { temp: 25 })
  check('LM35 gives 10 mV per °C', Math.abs(b.pins[A0].voltage - 0.25) < 1e-9, `${b.pins[A0].voltage} V`)
}

/* ------------------------------------------- syllabus practical 5: reed --- */

console.log('\nPractical 5 — reed switch with INPUT_PULLUP')
{
  const preset = getPreset('reed')!
  const open = run(preset.sketch, { components: preset.components, env: { door: 0 } })
  const closed = run(preset.sketch, { components: preset.components, env: { door: 1 } })
  check('switch open  → pin 2 reads HIGH', open.board.digitalRead(2) === 1)
  check('switch open  → LED off', open.board.pins[13].voltage === 0)
  check('switch closed → pin 2 reads LOW', closed.board.digitalRead(2) === 0)
  check('switch closed → LED on', closed.board.pins[13].voltage === 5)
}

/* ------------------------------------------------------- language rules -- */

console.log('\nLanguage rules the syllabus states')
{
  const err = (src: string) => {
    try {
      run(src)
      return null
    } catch (e) {
      return e instanceof ArduinoError ? e : (e as Error)
    }
  }

  const missingSemi = err('void setup() { pinMode(13, OUTPUT) }\nvoid loop() {}')
  check('a missing semicolon is an error', !!missingSemi)
  check(
    'and the message mentions the semicolon',
    !!missingSemi && /semicolon/i.test((missingSemi as ArduinoError).hint ?? ''),
    missingSemi?.message,
  )

  const wrongCase = err('void setup() { pinMode(13, OUTPUT); }\nvoid loop() { digitalwrite(13, HIGH); }')
  check('case sensitivity is enforced', !!wrongCase)
  check(
    'and the message explains why',
    !!wrongCase && /case sensitive/i.test((wrongCase as ArduinoError).hint ?? ''),
    wrongCase?.message,
  )

  const undeclared = err('void setup() {}\nvoid loop() { x = 5; }')
  check('an undeclared variable is an error', !!undeclared && /declared/i.test(undeclared.message))

  const noPinMode = err('void setup() {}\nvoid loop() { digitalWrite(13, HIGH); }')
  check(
    'writing to a pin that was never set OUTPUT is an error',
    !!noPinMode && /OUTPUT/.test(noPinMode.message),
    noPinMode?.message,
  )

  const badPin = err('void setup() { pinMode(99, OUTPUT); }\nvoid loop() {}')
  check('a pin that does not exist is an error', !!badPin && /99/.test(badPin.message))

  const constWrite = err('const int x = 5;\nvoid setup() { x = 6; }\nvoid loop() {}')
  check('assigning to a const is an error', !!constWrite && /const/.test(constWrite.message))

  const runaway = (() => {
    try {
      // The guard trips after a large number of statements, so this needs a
      // budget big enough to reach it.
      run('void setup() {}\nvoid loop() { while (1) { } }', { steps: 500_000 })
      return null
    } catch (e) {
      return e as Error
    }
  })()
  check('a loop that never ends is caught', !!runaway && /looping/i.test(runaway.message))

  check('an unclosed brace is an error', !!err('void setup() {'))
  check('an unclosed comment is an error', !!err('/* never closed\nvoid setup() {}'))
}

/* ------------------------------------------------------- the type rules -- */

console.log('\nTypes behave the way the lessons say they do')
{
  const src = (decl: string) => `${decl}
void setup() { Serial.begin(9600); Serial.println(v); }
void loop() {}`
  const intDiv = run(src('int v = 7 / 2;'))
  check('int 7/2 truncates to 3', intDiv.board.serial[0].text.trim() === '3', intDiv.board.serial[0]?.text)

  const floatDiv = run(src('float v = 7.0 / 2.0;'))
  check('float 7.0/2.0 keeps 3.50', floatDiv.board.serial[0].text.trim() === '3.50', floatDiv.board.serial[0]?.text)

  const byteWrap = run(src('byte v = 300;'))
  check('byte wraps at 256', byteWrap.board.serial[0].text.trim() === '44', byteWrap.board.serial[0]?.text)

  // The exact failure the practical-4 lesson warns about.
  const asInt = run(`void setup() { pinMode(A0, INPUT); pinMode(7, OUTPUT); Serial.begin(9600); }
void loop() {
  int tempRead = analogRead(A0);
  int voltage = tempRead * (5.0 / 1023.0);
  int temperatureC = voltage * 100;
  Serial.println(temperatureC);
}`, { components: getPreset('thermostat')!.components, env: { temp: 40 } })
  check(
    'int instead of float really does give 0 °C',
    asInt.board.serial[0].text.trim() === '0',
    asInt.board.serial[0]?.text,
  )
}

/* ------------------------------------------------- control structures ---- */

console.log('\nControl structures')
{
  const count = (src: string) => {
    const r = run(`int n = 0;
void setup() { Serial.begin(9600); ${src} Serial.println(n); }
void loop() {}`)
    return r.board.serial[0].text.trim()
  }
  check('for (i=0; i<10; i++) runs 10 times', count('for (int i = 0; i < 10; i++) { n++; }') === '10')
  check('for (i=1; i<=8; i+=2) runs 4 times', count('for (int i = 1; i <= 8; i = i + 2) { n++; }') === '4')
  check('while with a false condition runs 0 times', count('while (0) { n++; }') === '0')
  check('do-while with a false condition runs once', count('do { n++; } while (0);') === '1')
  check('if / else if / else picks exactly one branch',
    count('int c = 10; if (c > 10) { n = 1; } else if (c == 10) { n = 2; } else { n = 3; }') === '2')
}

/* ----------------------------------------------------- the mastery model -- */

console.log('\nMastery and scheduling')
{
  const DAY = 86_400_000
  let rec = emptyConcept()
  check('an untouched concept is "untouched"', masteryOf(rec) === 'untouched')

  rec = grade(rec, { correct: true, level: 1 })
  check('one correct answer does not make you proficient', masteryOf(rec) !== 'proficient' && masteryOf(rec) !== 'mastered')
  check('a correct answer schedules a review', rec.dueAt > 0 && rec.intervalDays === 1)

  let strong = emptyConcept()
  for (const level of [1, 2, 3, 4, 5] as const) strong = grade(strong, { correct: true, level })
  for (const level of [4, 5] as const) strong = grade(strong, { correct: true, level })
  check('sustained correct answers reach mastered', masteryOf(strong) === 'mastered', masteryOf(strong))
  check('and the review interval has grown', strong.intervalDays >= 7, `${strong.intervalDays} days`)

  const missed = grade(strong, { correct: false, level: 3 })
  check('a miss brings it back tomorrow', missed.intervalDays === 1)
  check('a miss resets the streak', missed.streak === 0)
  check('but does not wipe the record', decayedStrength(missed) > 0)

  const now = Date.now()
  const stale = { ...strong, lastSeen: now - 400 * DAY }
  check('strength decays over a year', decayedStrength(stale, now) < decayedStrength(strong, now))
  check('but never to zero once learnt', decayedStrength(stale, now) > 0)

  const guess = grade(emptyConcept(), { correct: true, level: 5 })
  check('a single lucky guess is not mastery', masteryOf(guess) !== 'mastered', masteryOf(guess))
}

/* -------------------------------------------------------- content wiring -- */

console.log('\nContent integrity')
{
  const questionIds = new Set(allQuestions.map((q) => q.id))
  check('no duplicate question ids', questionIds.size === allQuestions.length)

  const lessonIds = new Set(lessons.map((l) => l.id))
  const orphanQ = allQuestions.filter((q) => !lessonIds.has(q.lessonId))
  check('every question points at a real lesson', orphanQ.length === 0, orphanQ.map((q) => q.id).join(', '))

  const orphanC = allQuestions.filter((q) => !conceptById.has(q.conceptId))
  check('every question points at a real concept', orphanC.length === 0, orphanC.map((q) => q.id).join(', '))

  // Every checkpoint in a lesson must resolve, or a student hits a dead end.
  const missingCheckpoint: string[] = []
  for (const lesson of lessons) {
    for (const block of lesson.blocks) {
      if (block.kind === 'checkpoint') {
        for (const id of block.questionIds) {
          if (!questionIds.has(id)) missingCheckpoint.push(`${lesson.id}:${id}`)
        }
      }
      if (block.kind === 'bench' && !getPreset(block.preset)) {
        missingCheckpoint.push(`${lesson.id}: bench "${block.preset}"`)
      }
    }
  }
  check('every checkpoint question and bench exists', missingCheckpoint.length === 0, missingCheckpoint.join(', '))

  // A concept with no questions can never be mastered, so it would sit in the
  // review queue for ever.
  const unreachable = [...conceptById.keys()].filter((c) => !questionsByConcept.has(c))
  check(
    'every concept has at least one question',
    unreachable.length === 0,
    unreachable.map((c) => conceptById.get(c)?.title ?? c).join(', '),
  )

  const termIds = new Set(glossary.map((t) => t.id))
  const badTerms: string[] = []
  for (const lesson of lessons) {
    for (const t of lesson.keyTerms) if (!termIds.has(t)) badTerms.push(`${lesson.id}:${t}`)
  }
  check('every key term is in the glossary', badTerms.length === 0, badTerms.join(', '))

  // Every inline glossary chip must resolve, and its label must still read as
  // the words it replaced.
  const chipRe = /\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g
  const badChips: string[] = []
  let chipCount = 0
  for (const lesson of lessons) {
    for (const block of lesson.blocks) {
      const texts: string[] = []
      if (block.kind === 'prose' || block.kind === 'callout') texts.push(block.text)
      for (const t of texts) {
        for (const m of t.matchAll(chipRe)) {
          chipCount++
          if (!termIds.has(m[1])) badChips.push(`${lesson.id}: ${m[1]}`)
          if (!m[2]) badChips.push(`${lesson.id}: ${m[1]} has no label`)
        }
      }
    }
  }
  check('every inline glossary chip resolves and is labelled', badChips.length === 0, badChips.join(', '))
  check('inline glossary chips are actually used', chipCount >= 20, `${chipCount} chips`)

  const badRelated = glossary.flatMap((t) => (t.related ?? []).filter((r) => !termIds.has(r)).map((r) => `${t.id}→${r}`))
  check('every glossary cross-reference resolves', badRelated.length === 0, badRelated.join(', '))

  const badPrereq = lessons.flatMap((l) => (l.prerequisites ?? []).filter((p) => !lessonIds.has(p)).map((p) => `${l.id}→${p}`))
  check('every prerequisite resolves', badPrereq.length === 0, badPrereq.join(', '))

  // Structured questions must be worth what their mark scheme adds up to.
  const badMarks = allQuestions
    .filter((q) => q.type === 'structured')
    .filter((q: any) => q.markScheme.reduce((n: number, m: any) => n + m.marks, 0) !== q.marks)
    .map((q) => q.id)
  check('structured mark schemes add up', badMarks.length === 0, badMarks.join(', '))

  // MCQ answers must exist among the options.
  const badMcq = allQuestions
    .filter((q) => q.type === 'mcq')
    .filter((q: any) => !q.options.some((o: any) => o.id === q.correct))
    .map((q) => q.id)
  check('every MCQ answer is one of its options', badMcq.length === 0, badMcq.join(', '))
}

/* -------------------------------------------------------------- report --- */

console.log(`\n${pass} passed, ${fail} failed\n`)
process.exit(fail === 0 ? 0 : 1)
