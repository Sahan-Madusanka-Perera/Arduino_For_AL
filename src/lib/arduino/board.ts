/* ============================================================================
   The virtual Arduino Uno.

   Only what the syllabus names: 14 digital pins (0-13), 6 analog inputs
   (A0-A5), HIGH = 5V, LOW = 0V, a 10-bit ADC reading 0-1023 over 0-5V, and
   PWM on the pins the real board marks with a tilde.
   ========================================================================== */

export type PinMode = 'unset' | 'INPUT' | 'OUTPUT' | 'INPUT_PULLUP'

export const DIGITAL_PINS = 14
export const ANALOG_PINS = 6
/** Analog pin n is addressed as A0 + n, matching the real numbering. */
export const A0 = 14
export const PWM_PINS = [3, 5, 6, 9, 10, 11]

export interface PinState {
  mode: PinMode
  /** What the sketch wrote. 0..255 for PWM, 0 or 255 for plain digital. */
  output: number
  /** Volts actually present at the pin, set by whatever is wired to it. */
  voltage: number
}

export interface SerialLine {
  text: string
  at: number
}

export class Board {
  pins: PinState[] = []
  serial: SerialLine[] = []
  serialOpen = false
  /** Virtual milliseconds since the sketch started. Advances by delay() and
   *  by the interpreter's own step cost, so millis() behaves. */
  clock = 0

  constructor() {
    this.reset()
  }

  reset() {
    this.pins = Array.from({ length: A0 + ANALOG_PINS }, () => ({
      mode: 'unset' as PinMode,
      output: 0,
      voltage: 0,
    }))
    this.serial = []
    this.serialOpen = false
    this.clock = 0
  }

  pinMode(pin: number, mode: PinMode) {
    const p = this.pins[pin]
    if (!p) throw new Error(`There is no pin ${pin} on an Arduino Uno.`)
    p.mode = mode
    // A pull-up resistor holds an unconnected input at 5V. This is exactly why
    // the reed-switch practical reads LOW when the door closes.
    if (mode === 'INPUT_PULLUP') p.voltage = 5
    if (mode === 'OUTPUT') {
      p.output = 0
      p.voltage = 0
    }
  }

  digitalWrite(pin: number, value: number) {
    const p = this.pins[pin]
    if (!p) throw new Error(`There is no pin ${pin} on an Arduino Uno.`)
    p.output = value ? 255 : 0
    p.voltage = value ? 5 : 0
  }

  analogWrite(pin: number, value: number) {
    const p = this.pins[pin]
    if (!p) throw new Error(`There is no pin ${pin} on an Arduino Uno.`)
    const duty = Math.max(0, Math.min(255, Math.round(value)))
    p.output = duty
    p.voltage = (duty / 255) * 5
  }

  digitalRead(pin: number): number {
    const p = this.pins[pin]
    if (!p) throw new Error(`There is no pin ${pin} on an Arduino Uno.`)
    // The real threshold on a 5V board is about 2.5V.
    return p.voltage >= 2.5 ? 1 : 0
  }

  /** 10-bit ADC. 0V reads 0, 5V reads 1023, exactly as the syllabus states. */
  analogRead(pin: number): number {
    const p = this.pins[pin]
    if (!p) throw new Error(`There is no analog pin ${pin}.`)
    return Math.max(0, Math.min(1023, Math.round((p.voltage / 5) * 1023)))
  }

  print(text: string) {
    if (!this.serialOpen) return
    const last = this.serial[this.serial.length - 1]
    if (last && !last.text.endsWith('\n')) {
      last.text += text
    } else {
      this.serial.push({ text, at: this.clock })
    }
    if (this.serial.length > 200) this.serial.shift()
  }
}

export function pinLabel(pin: number): string {
  return pin >= A0 ? `A${pin - A0}` : String(pin)
}

export function isPwm(pin: number): boolean {
  return PWM_PINS.includes(pin)
}
