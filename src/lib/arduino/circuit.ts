/* ============================================================================
   The circuit model.

   Deliberately behavioural, not a SPICE simulator. What a student has to
   understand at A/L is which pin does what and how a sensor reading becomes a
   number, so components here are modelled as either a *source* that puts a
   voltage on a pin, or a *load* that reacts to the voltage on one. That is
   exactly the mental model the syllabus builds, and it stays honest: nothing
   here claims to model current, capacitance or timing.
   ========================================================================== */

import { A0, Board } from './board'

export type ComponentKind =
  | 'led'
  | 'resistor'
  | 'ldr'
  | 'lm35'
  | 'reed'
  | 'button'
  | 'motor'
  | 'buzzer'
  | 'servo'
  | 'pir'
  | 'pot'

/** Something the student can change about the physical world, which the
 *  sensors then read. This is how a simulated bench becomes teachable: the
 *  student turns the light down and watches the number fall. */
export interface EnvControl {
  id: string
  label: string
  unit: string
  min: number
  max: number
  step: number
  value: number
  /** Shown under the slider so the reading is never a mystery number. */
  explain: (v: number) => string
}

export interface Component {
  id: string
  kind: ComponentKind
  label: string
  /** Digital or analog pin index this component is wired to. */
  pin?: number
  /** Env control id this component senses, if it is a sensor. */
  senses?: string
  /** Layout position on the bench, in hole coordinates. */
  x: number
  y: number
  /** For an LED: which colour lens. */
  colour?: 'red' | 'green' | 'yellow' | 'blue'
  /** For a resistor: ohms, shown as colour bands. */
  ohms?: number
  /** Wire colour to draw the signal lead in. */
  wire?: 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'violet' | 'brown' | 'black'
  /** Note printed beside the part on the bench. */
  note?: string
}

export interface CircuitPreset {
  id: string
  title: string
  /** One line on what this circuit is for. */
  brief: string
  components: Component[]
  env: EnvControl[]
  sketch: string
  /** What the student should watch for. */
  watchFor: string
  /** Which line numbers to point at while explaining. */
  source: 'syllabus' | 'course'
}

/* ------------------------------------------------------ live state -- */

export interface ComponentState {
  /** 0..1 how strongly this output component is driven. */
  drive: number
  /** Human-readable readout, e.g. "742" or "27.3 °C". */
  readout?: string
  /** True when the component is doing its visible thing. */
  active: boolean
}

/** Push the environment into the board's input pins. Called before every
 *  interpreter step so a sensor read always sees the current slider value. */
export function applyEnvironment(
  board: Board,
  components: Component[],
  env: Record<string, number>,
) {
  for (const c of components) {
    if (c.pin === undefined) continue
    const pin = board.pins[c.pin]
    if (!pin) continue

    switch (c.kind) {
      case 'ldr': {
        // A light-dependent resistor in a divider with a fixed resistor to GND.
        // Bright light => low LDR resistance => the analog pin sits near 5V.
        // Dark => high resistance => near 0V. The syllabus states the resulting
        // analogRead range is 0 (dark) to 1023 (bright).
        const lux = env[c.senses ?? 'light'] ?? 50
        pin.voltage = clamp((lux / 100) * 5, 0, 5)
        break
      }
      case 'lm35': {
        // The syllabus gives the LM35's scale factor exactly: 10mV per °C.
        const tempC = env[c.senses ?? 'temp'] ?? 25
        pin.voltage = clamp((tempC * 10) / 1000, 0, 5)
        break
      }
      case 'pot': {
        const turn = env[c.senses ?? 'pot'] ?? 50
        pin.voltage = clamp((turn / 100) * 5, 0, 5)
        break
      }
      case 'reed':
      case 'button': {
        // Wired pin-to-ground and used with INPUT_PULLUP, exactly as the
        // syllabus reed-switch practical does. Open => pulled up to 5V (HIGH).
        // Closed => shorted to ground (LOW).
        const closed = (env[c.senses ?? c.id] ?? 0) > 0.5
        if (pin.mode === 'INPUT_PULLUP') pin.voltage = closed ? 0 : 5
        else if (pin.mode === 'INPUT') pin.voltage = closed ? 5 : 0
        break
      }
      case 'pir': {
        const motion = (env[c.senses ?? 'motion'] ?? 0) > 0.5
        if (pin.mode === 'INPUT' || pin.mode === 'unset') pin.voltage = motion ? 5 : 0
        break
      }
      default:
        break
    }
  }
}

/** Read the board back out into something the drawing can render. */
export function readComponents(
  board: Board,
  components: Component[],
  env: Record<string, number>,
): Record<string, ComponentState> {
  const out: Record<string, ComponentState> = {}
  for (const c of components) {
    const pin = c.pin !== undefined ? board.pins[c.pin] : undefined
    switch (c.kind) {
      case 'led': {
        const drive = pin ? pin.output / 255 : 0
        out[c.id] = {
          drive,
          active: drive > 0.02,
          readout: pin ? (pin.voltage >= 2.5 ? 'HIGH · 5V' : 'LOW · 0V') : undefined,
        }
        break
      }
      case 'motor':
      case 'buzzer': {
        const drive = pin ? pin.output / 255 : 0
        out[c.id] = {
          drive,
          active: drive > 0.02,
          readout: drive > 0.02 ? 'running' : 'stopped',
        }
        break
      }
      case 'servo': {
        const drive = pin ? pin.output / 255 : 0
        out[c.id] = { drive, active: drive > 0.02, readout: `${Math.round(drive * 180)}°` }
        break
      }
      case 'ldr': {
        const raw = pin ? Math.round((pin.voltage / 5) * 1023) : 0
        out[c.id] = { drive: raw / 1023, active: true, readout: `${raw}` }
        break
      }
      case 'lm35': {
        const t = env[c.senses ?? 'temp'] ?? 25
        const raw = pin ? Math.round((pin.voltage / 5) * 1023) : 0
        out[c.id] = { drive: t / 60, active: true, readout: `${t.toFixed(1)} °C · reads ${raw}` }
        break
      }
      case 'pot': {
        const raw = pin ? Math.round((pin.voltage / 5) * 1023) : 0
        out[c.id] = { drive: raw / 1023, active: true, readout: `${raw}` }
        break
      }
      case 'reed':
      case 'button': {
        const closed = (env[c.senses ?? c.id] ?? 0) > 0.5
        out[c.id] = {
          drive: closed ? 1 : 0,
          active: closed,
          readout: closed ? 'closed · reads LOW' : 'open · reads HIGH',
        }
        break
      }
      case 'pir': {
        const motion = (env[c.senses ?? 'motion'] ?? 0) > 0.5
        out[c.id] = {
          drive: motion ? 1 : 0,
          active: motion,
          readout: motion ? 'motion · HIGH' : 'still · LOW',
        }
        break
      }
      default:
        out[c.id] = { drive: 0, active: false }
    }
  }
  return out
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n))
}

/** Static checks a real board would punish you for, reported as advice rather
 *  than as failure. An LED with no series resistor is the classic one. */
export function checkCircuit(components: Component[]): string[] {
  const warnings: string[] = []
  const hasResistor = components.some((c) => c.kind === 'resistor')
  const hasLed = components.some((c) => c.kind === 'led')
  if (hasLed && !hasResistor) {
    warnings.push(
      'There is an LED here with no resistor in series with it. On a real board the 5V pin would push far too much current through the LED and destroy it.',
    )
  }
  const pins = new Map<number, string[]>()
  for (const c of components) {
    if (c.pin === undefined) continue
    pins.set(c.pin, [...(pins.get(c.pin) ?? []), c.label])
  }
  for (const [pin, labels] of pins) {
    if (labels.length > 1) {
      warnings.push(
        `${labels.join(' and ')} are both wired to pin ${pin >= A0 ? `A${pin - A0}` : pin}. Give each part its own pin.`,
      )
    }
  }
  return warnings
}
