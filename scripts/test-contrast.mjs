/* Contrast audit of the token palette against WCAG 2.2 AA. */
import { readFileSync } from 'node:fs'
const css = readFileSync('src/styles/theme.css', 'utf8')

function palette(block) {
  const out = {}
  for (const m of block.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)) out[m[1]] = m[2]
  return out
}
const lightBlock = css.slice(css.indexOf(':root {'), css.indexOf("[data-theme='dark']"))
const darkBlock = css.slice(css.indexOf("[data-theme='dark']"))
const L = palette(lightBlock), D = palette(darkBlock)
// dark inherits anything it does not override
for (const k in L) if (!(k in D)) D[k] = L[k]

const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 }
const lum = hex => {
  const n = parseInt(hex.slice(1), 16)
  return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255)
}
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }

// fg, bg, minimum, what it is
const CHECKS = [
  ['ink', 'plastic', 4.5, 'body text on the board'],
  ['ink', 'plastic-raised', 4.5, 'body text on a card'],
  ['ink', 'plastic-sunk', 4.5, 'body text on a recess'],
  ['ink-2', 'plastic-raised', 4.5, 'secondary text on a card'],
  ['ink-2', 'plastic-sunk', 4.5, 'secondary text on a recess'],
  ['ink-3', 'plastic', 4.5, 'muted text on the board'],
  ['ink-3', 'plastic-raised', 4.5, 'muted text on a card'],
  ['ink-3', 'plastic-sunk', 4.5, 'muted text on a recess'],
  ['ink-faint', 'plastic-raised', 3.0, 'faint marks (non-text)'],
  ['ok', 'ok-field', 4.5, 'correct feedback'],
  ['no', 'no-field', 4.5, 'incorrect feedback'],
  ['warn', 'warn-field', 4.5, 'warning callout'],
  ['ink-2', 'info-field', 4.5, 'exam tip callout'],
  ['signal-high', 'plastic', 3.0, 'live signal marker'],
  ['signal-analog', 'plastic', 3.0, 'focus ring on the board'],
  ['signal-analog', 'plastic-raised', 3.0, 'focus ring on a card'],
  ['rail-pos', 'plastic', 3.0, 'positive rail legend'],
  ['rail-neg', 'plastic', 3.0, 'negative rail legend'],
  ['plastic', 'ink', 4.5, 'primary button label'],
  ['hole-empty', 'plastic-raised', 1.3, 'empty progress slot'],
  ['hole-empty', 'plastic-sunk', 1.3, 'empty slot on a recess'],
  ...['red','orange','yellow','green','blue','violet','brown'].map(w => [`wire-${w}`, 'plastic-raised', 3.0, `${w} module marker`]),
]

let fail = 0
for (const [themeName, P] of [['light', L], ['dark', D]]) {
  console.log(`\n${themeName} board`)
  for (const [fg, bg, min, what] of CHECKS) {
    if (!P[fg] || !P[bg]) { console.log(`  ?     ${fg} / ${bg} missing`); continue }
    const r = ratio(P[fg], P[bg])
    const ok = r >= min
    if (!ok) fail++
    console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${r.toFixed(2).padStart(5)} (need ${min})  ${what}`)
  }
}
console.log(`\n${fail} contrast failures\n`)
process.exit(fail ? 1 : 0)
