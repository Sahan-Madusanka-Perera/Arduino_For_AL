# The Bench

An interactive course for the Sri Lankan G.C.E. Advanced Level ICT unit on
**Internet of Things, embedded systems and Arduino**.

It is built for a student who has never seen a development board, has no lab
access, and is studying alone from a phone. Every circuit in the syllabus is
wired and running in the browser, and every program actually executes: change a
number, press Run, and watch the LED respond.

---

## Running it

```bash
npm install
npm run dev          # http://localhost:5173 (or the next free port)
```

```bash
npm run build        # static site in dist/
npm run preview      # serve the built site
npm test             # interpreter, mastery model, content and contrast checks
npm run typecheck
```

Node 20 or newer. There is no backend, no database and no account: the whole
course is a static site, and all progress lives in the student's browser.

**Deploying**: `dist/` is plain static files, but the app uses real URLs
(`/lesson/l3-2`, `/glossary`), so the host must serve `index.html` for any path
it does not recognise. On Netlify that is a `_redirects` line reading
`/* /index.html 200`; on Vercel a rewrite of `/(.*)` to `/index.html`; on
GitHub Pages, copy `index.html` to `404.html`. Without it the home page works
and every deep link 404s.

> **Note about this folder's name.** The directory contains a colon
> (`ArduinoForA:L`), and a colon is the `PATH` separator, so two things break
> that have nothing to do with this project:
>
> 1. **`vite: command not found`.** npm puts `node_modules/.bin` on `PATH` when
>    it runs a script, but the colon splits that entry in two and the shim is
>    never found. The scripts in `package.json` therefore call the binaries
>    through node directly (`node ./node_modules/vite/bin/vite.js`) instead of
>    relying on `PATH`.
> 2. **A 403 on every dev-server request.** Vite's filesystem allow-list does
>    not match the path either, so `vite.config.ts` names the project root
>    explicitly.
>
> Both workarounds are harmless in a normally-named folder. If you rename the
> directory to something without a colon, you can revert the scripts to the
> plain `vite` / `tsc` form and drop the `server.fs` block, but there is no
> need to.

---

## What is in it

Seven modules, 31 lessons (about 7 hours), 127 questions, 26 interactive
figures, 8 runnable circuit benches and a 102-term glossary, all derived from
the supplied syllabus.

| # | Module | Covers |
|---|---|---|
| 1 | The Internet of Things | Definition, 8 application areas, 6 enabling technologies, 6 challenges |
| 2 | Embedded Systems | Embedded systems and the IPO model, microcontrollers, microprocessors, the 8-row comparison |
| 3 | Development Boards | Development systems vs boards, the Uno part by part, powering it, the whole board family |
| 4 | Components and Accessories | Breadboards, jumper wires, LEDs, the three resistor types, buzzers, servos |
| 5 | Sensors | All 20 sensors, grouped by what they detect |
| 6 | Arduino Programming | The IDE and upload pipeline, `setup()`/`loop()`, syntax rules, variables, decisions, loops |
| 7 | Practical Applications | The four worked circuits, wired and running, plus the 8 popular project types |

Plus a course path, a practice bank, a spaced-repetition review queue, a free
lab, a searchable glossary, exam preparation and a final assessment.

Key terms are linked inline in the lesson prose. Clicking one opens its plain
definition, its exam wording and its related terms in place, without leaving
the page or losing your position. The link text is always the exact words it
replaces, so a link never bends the grammar of its sentence.

### Fidelity to the syllabus

The syllabus is the source of truth. Definitions are reproduced in the
syllabus's own words and labelled **Syllabus wording**; the explanations,
analogies, misconceptions and questions around them were written for this
course to make that content learnable.

Two things are disclosed in the product rather than papered over:

- **Practical application 2 is missing from the supplied PDF.** Its printed
  pages are absent from the file and the numbering jumps from example 1 to
  example 3. The course keeps the syllabus's own numbering and says so, so a
  student comparing against their printed notes is never confused.
- **No past-paper material was supplied.** Every structured question is written
  for this course and labelled **A/L-style**. None is presented as an official
  past-paper question.

---

## The technology, and why

| Choice | Reason |
|---|---|
| **Vite + React + TypeScript** | The course is a static site with rich client state. Vite gives a fast dev loop and a small static build; React suits the many small stateful widgets; TypeScript makes the content model enforceable rather than aspirational. |
| **Tailwind CSS v4** | Design tokens live in one CSS file and are exposed to utilities through `@theme`, so a theme change is a token change. No component library, because none of the shelf components look like a breadboard. |
| **Zustand + `localStorage`** | Progress is per-device and private. Zustand's persist middleware is a few lines; anything larger would be scaffolding for a backend that does not exist. |
| **No animation library** | All motion is CSS. Every animation carries information (current flowing, a component seating), so there was nothing an animation runtime would have added except bundle size. |
| **No chart or icon library** | Every diagram and icon is hand-drawn SVG in the product's own grammar, which is also what keeps the whole app under 120 kB gzipped. |
| **No AI grading** | Written answers are self-marked against a real mark scheme. It is free, works offline, and forces the student to read a mark scheme, which is the skill the written paper actually rewards. |

### The Arduino interpreter

`src/lib/arduino/` contains a real lexer, parser and tree-walking interpreter
for the subset of the Arduino language the syllabus teaches, plus a behavioural
circuit model and a frame-driven runtime.

- The parser reports errors in plain language with a repair hint, at the line
  they occurred: *"Pin 99 does not exist on an Arduino Uno. The Uno has digital
  pins 0 to 13 and analog pins A0 to A5."*
- The interpreter is a generator, so `delay()` can suspend execution and hand
  control back to the browser. That is what lets a one-second blink be watched
  in a page that stays responsive, and what makes single-stepping possible.
- The board models 14 digital pins, 6 analog inputs, a 10-bit ADC over 0–5V,
  PWM, and the serial monitor.
- The circuit model is deliberately behavioural, not SPICE. What a student has
  to understand at A/L is which pin does what and how a sensor reading becomes
  a number, and the model is honest about modelling exactly that.

It is accurate enough to reproduce the syllabus's own quirks. At exactly 25.0 °C
the temperature practical does **not** switch the motor on, because 0.25 V
quantises to ADC step 51, which converts back to 24.93 °C. Real hardware does
this too, so the course explains it rather than hiding it.

---

## How learning is modelled

**Mastery is never awarded for visiting a page.** Strength only moves when a
question is answered. Six states, each carrying a next action:

```
Not started → Learning → Practising → Familiar → Proficient → Mastered
```

- Harder questions are worth more; a level-5 exam question moves the needle
  further than a level-1 recall.
- A miss costs more than a hit gains, but never wipes the record.
- Strength decays with time, with a half-life that grows the better something
  was learnt, so "mastered in April" does not still read as mastered in
  September.
- A single lucky guess cannot reach *proficient*: the thresholds require a
  minimum number of attempts and a minimum difficulty reached.

**Review** is lightweight spaced repetition on a 1 / 3 / 7 / 16 / 35 / 70-day
ladder. A miss returns it to tomorrow and resets the ladder. The queue is capped
at eight items, because a queue you can finish is a queue you open.

**Nothing is loss-framed.** There is no streak to break and no penalty for a
gap: days practised is reported as an encouraging fact, never as something that
can be lost.

### Question types

Multiple choice, multiple response, true/false, fill-in-the-blank, matching,
ordering, numeric, and A/L-style structured questions with a tickable mark
scheme. Ordering uses up/down buttons rather than drag-and-drop, so it works
identically with a mouse, a fingertip, a keyboard and a screen reader.

Feedback never stops at "correct". A wrong answer shows what was chosen, what
the answer is, why the chosen option was tempting, and a link back to the lesson
that teaches it.

---

## Accessibility

WCAG 2.2 AA is treated as the floor.

- **Contrast**: every foreground/background pairing in the palette is checked
  against AA in both themes by `npm test`, which fails the build on a
  regression.
- **One type ramp**: fourteen named steps registered as design tokens, named
  for what the text is rather than how big it looks. There are no ad-hoc font
  sizes anywhere in the app, so a new screen reaches for a role instead of
  inventing a number.
- **Colour is never the only channel**: mastery is a count of filled holes,
  answer state carries an icon and a label, and every module has a name beside
  its wire colour.
- **Headings**: one `h1` per page and no skipped levels, verified across all 40
  routes.
- **Targets**: every standalone control clears 24×24 CSS pixels; primary
  actions are 44px tall.
- **Keyboard**: everything is reachable, focus rings are 3px at 3:1 or better,
  and the only focus trap is inside a modal dialog, which closes on Escape and
  returns focus to its trigger.
- **Screen readers**: semantic landmarks, live regions for answer feedback and
  simulator state, and a text description on every figure that carries the same
  information as the drawing.
- **Reduced motion**: `prefers-reduced-motion` collapses motion to an instant
  state change rather than removing the information it carried.

---

## Structure

```
src/
  content/          the whole course as data: modules, questions, glossary, exam
  types/            the content and progress models
  lib/
    arduino/        lexer, parser, interpreter, board, circuit model, runtime
    mastery.ts      strength, decay and the six mastery states
    review.ts       the spaced-repetition queue
    search.ts       course-wide search index
    i18n.ts         translation seam (see below)
  store/            persisted progress
  components/
    ui/             the design system
    layout/         the app shell: the board and its power rails
    learning/       lesson blocks, the live bench, the inline renderer
    quiz/           every question type
    viz/            26 interactive figures and the part drawings
    progress/       mastery readouts
  pages/            one file per route
scripts/            headless test suites
```

Content and presentation are separate. Adding a lesson means adding an object to
a module file; adding a figure means adding one line to the figure registry.
Nothing in `components/` knows what the syllabus says, and nothing in `content/`
knows how it will be drawn.

---

## Language

The interface is in clear English, aimed at a student for whom English is
usually a second or third language: short sentences, jargon defined at first
use, and every technical term reachable as a glossary chip without leaving the
page.

Sinhala is not shipped. The supplied syllabus is bilingual, but its Sinhala is
stored in a legacy FM-Abhaya font encoding that does not extract as Unicode, and
auto-converting it would risk showing students misspelt Sinhala, which is worse
than showing none. `src/lib/i18n.ts` is the seam: every UI string already goes
through `t()`, so adding a Sinhala dictionary later means adding one file and a
language toggle rather than editing every component.

---

## Known limitations

- **Sinhala is not included**, for the reason above. The seam exists; the
  translation does not.
- **The circuit model is behavioural, not electrical.** It will not tell you
  about current, heat, timing or capacitance. For circuit-level simulation the
  syllabus recommends [Tinkercad](https://www.tinkercad.com/dashboard), and the
  lab page says so.
- **The Arduino language subset is the syllabus's subset.** Arrays, `switch`,
  user-defined functions and the maths library work, but `#include`d third-party
  libraries, interrupts and pointers do not.
- **Progress is per-browser.** There is no sync between devices, and clearing
  site data clears progress. The app says so on the dashboard when storage is
  unavailable, and the progress page explains it.
- **The missing practical 2** cannot be restored from the supplied PDF. If the
  full document becomes available, it drops into `m7-practicals.ts` as one more
  lesson object and a preset.
- **Photographs**: there are none. Every board, sensor and component is a drawn
  SVG. They are accurate as diagrams but a student should still look at a real
  photograph of a board before an exam.
- **The final assessment draws 20 questions from a 127-question bank**, so a
  student who retakes it many times will start to see repeats.

---

## Content provenance

Course content follows the supplied syllabus unit
(`syllabus/50002_2026-06-07_23-14-56.pdf`, 40 pages, watermarked
`ictfromabc.com`). Syllabus definitions are reproduced and marked as such.
Explanations, analogies, misconceptions, questions and figures were written for
this course. Practice questions are labelled "A/L-style" and are not past-paper
questions.
