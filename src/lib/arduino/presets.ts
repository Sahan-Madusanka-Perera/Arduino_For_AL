/* ============================================================================
   Circuit presets.

   The four marked `source: 'syllabus'` are the worked practical applications
   from the supplied PDF, wired and coded exactly as it prints them, down to
   the pin numbers and the 100 ohm and 10k resistor values it names.

   The rest are marked `source: 'course'`: extra benches written for this
   product so a student has something to practise on between the worked
   examples. They never contradict the syllabus, they extend it.
   ========================================================================== */

import { A0 } from './board'
import type { CircuitPreset } from './circuit'

const light = (value = 70) => ({
  id: 'light',
  label: 'Light falling on the LDR',
  unit: '%',
  min: 0,
  max: 100,
  step: 1,
  value,
  explain: (v: number) =>
    v < 20
      ? 'Almost dark. The LDR resistance is high, so the analog pin sits near 0V.'
      : v > 80
        ? 'Bright. The LDR resistance is low, so the analog pin sits near 5V.'
        : 'Ordinary room light.',
})

const temperature = (value = 22) => ({
  id: 'temp',
  label: 'Room temperature',
  unit: '°C',
  min: 0,
  max: 60,
  step: 0.5,
  value,
  explain: (v: number) =>
    `The LM35 puts out 10mV for every °C, so at ${v.toFixed(1)}°C its output pin is at ${((v * 10) / 1000).toFixed(2)}V.`,
})

const door = (value = 0) => ({
  id: 'door',
  label: 'Door',
  unit: '',
  min: 0,
  max: 1,
  step: 1,
  value,
  explain: (v: number) =>
    v > 0.5
      ? 'Closed. The magnet is beside the reed switch, so the switch is closed and pin 2 is pulled down to 0V.'
      : 'Open. The magnet has moved away, the switch is open, and the internal pull-up holds pin 2 at 5V.',
})

export const PRESETS: CircuitPreset[] = [
  /* ------------------------------------------------ syllabus example 1 -- */
  {
    id: 'blink',
    title: 'Blinking an LED',
    brief:
      'Practical application 1 from the syllabus. An LED on pin 13 turns on for one second, then off for one second, forever.',
    source: 'syllabus',
    watchFor:
      'Watch the line highlight move down the sketch. It pauses on each delay(1000) for a full second, which is what makes the blink visible.',
    components: [
      { id: 'led1', kind: 'led', label: 'LED', pin: 13, x: 6, y: 2, colour: 'red', wire: 'orange' },
      {
        id: 'r1',
        kind: 'resistor',
        label: '100 Ω resistor',
        ohms: 100,
        x: 4,
        y: 2,
        note: 'Limits the current from the 5V pin so the LED survives.',
      },
    ],
    env: [],
    sketch: `void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}`,
  },

  /* ------------------------------------------------ syllabus example 3 -- */
  {
    id: 'ldr',
    title: 'Light sensing with an LDR',
    brief:
      'Practical application 3 from the syllabus. An LDR reads the light level on A0; when it falls below 200 the LED on pin 13 switches on.',
    source: 'syllabus',
    watchFor:
      'Drag the light slider down. Watch the number from analogRead() fall, and the LED come on the moment it crosses below 200.',
    components: [
      {
        id: 'ldr1',
        kind: 'ldr',
        label: 'LDR',
        pin: A0,
        senses: 'light',
        x: 3,
        y: 1,
        wire: 'violet',
      },
      {
        id: 'r2',
        kind: 'resistor',
        label: '10 kΩ resistor',
        ohms: 10000,
        x: 3,
        y: 3,
        note: 'Sets how sensitive the divider is. The syllabus specifies about 10 kΩ.',
      },
      { id: 'led2', kind: 'led', label: 'LED', pin: 13, x: 7, y: 2, colour: 'yellow', wire: 'orange' },
      { id: 'r3', kind: 'resistor', label: '100 Ω resistor', ohms: 100, x: 5, y: 2 },
    ],
    env: [light(70)],
    sketch: `void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  int ldrValue = analogRead(A0);
  if (ldrValue < 200) {
    digitalWrite(13, HIGH);
  } else {
    digitalWrite(13, LOW);
  }
  delay(100);
}`,
  },

  /* ------------------------------------------------ syllabus example 4 -- */
  {
    id: 'thermostat',
    title: 'Temperature-controlled motor',
    brief:
      'Practical application 4 from the syllabus. An LM35 on A0 measures room temperature; at 25°C or above, the motor on pin 7 switches on.',
    source: 'syllabus',
    watchFor:
      'Push the temperature past 25. Follow the three conversion lines: raw reading, then volts, then °C. That arithmetic is exam material.',
    components: [
      {
        id: 'lm35',
        kind: 'lm35',
        label: 'LM35 temperature sensor',
        pin: A0,
        senses: 'temp',
        x: 3,
        y: 1,
        wire: 'violet',
      },
      { id: 'motor1', kind: 'motor', label: 'Motor', pin: 7, x: 7, y: 2, wire: 'blue' },
    ],
    env: [temperature(22)],
    sketch: `const float temp = 25.0;

void setup() {
  pinMode(A0, INPUT);
  pinMode(7, OUTPUT);
  digitalWrite(7, LOW);
}

void loop() {
  int tempRead = analogRead(A0);
  float voltage = tempRead * (5.0 / 1023.0);
  float temperatureC = voltage * 100;

  if (temperatureC >= temp) {
    digitalWrite(7, HIGH);
  } else {
    digitalWrite(7, LOW);
  }
}`,
  },

  /* ------------------------------------------------ syllabus example 5 -- */
  {
    id: 'reed',
    title: 'Door open / closed with a reed switch',
    brief:
      'Practical application 5 from the syllabus. A reed switch on pin 2 uses INPUT_PULLUP; closing the door pulls the pin LOW and lights the LED on pin 13.',
    source: 'syllabus',
    watchFor:
      'Toggle the door. INPUT_PULLUP is the reason an open switch reads HIGH rather than floating at some random value.',
    components: [
      {
        id: 'reed1',
        kind: 'reed',
        label: 'Reed switch',
        pin: 2,
        senses: 'door',
        x: 3,
        y: 2,
        wire: 'green',
      },
      { id: 'led3', kind: 'led', label: 'LED', pin: 13, x: 7, y: 2, colour: 'red', wire: 'orange' },
      { id: 'r4', kind: 'resistor', label: '100 Ω resistor', ohms: 100, x: 5, y: 2 },
    ],
    env: [door(0)],
    sketch: `void setup() {
  pinMode(2, INPUT_PULLUP);
  pinMode(13, OUTPUT);
}

void loop() {
  if (digitalRead(2) == LOW) {
    digitalWrite(13, HIGH);
  } else {
    digitalWrite(13, LOW);
  }
}`,
  },

  /* --------------------------------------------------- course benches -- */
  {
    id: 'first-light',
    title: 'Your first line of code',
    brief:
      'One LED, one instruction. Written for this course as the gentlest possible start: no loop, no timing, nothing to get wrong.',
    source: 'course',
    watchFor:
      'setup() runs once and stops. There is no loop() here at all, so the LED simply stays on.',
    components: [
      { id: 'led0', kind: 'led', label: 'LED', pin: 13, x: 6, y: 2, colour: 'green', wire: 'orange' },
      { id: 'r0', kind: 'resistor', label: '220 Ω resistor', ohms: 220, x: 4, y: 2 },
    ],
    env: [],
    sketch: `void setup() {
  pinMode(13, OUTPUT);
  digitalWrite(13, HIGH);
}

void loop() {
}`,
  },

  {
    id: 'analog-out',
    title: 'Dimming with analogWrite',
    brief:
      'A course bench showing the difference between a digital pin that is only ever fully on or fully off, and a PWM pin that can sit in between.',
    source: 'course',
    watchFor:
      'The for loop counts 0 to 255 and writes each value. digitalWrite could never do this: it only knows HIGH and LOW.',
    components: [
      { id: 'led4', kind: 'led', label: 'LED on pin 9 (PWM)', pin: 9, x: 6, y: 2, colour: 'blue', wire: 'blue' },
      { id: 'r5', kind: 'resistor', label: '220 Ω resistor', ohms: 220, x: 4, y: 2 },
    ],
    env: [],
    sketch: `void setup() {
  pinMode(9, OUTPUT);
}

void loop() {
  for (int level = 0; level <= 255; level++) {
    analogWrite(9, level);
    delay(6);
  }
  for (int level = 255; level >= 0; level--) {
    analogWrite(9, level);
    delay(6);
  }
}`,
  },

  {
    id: 'serial',
    title: 'Printing values to the serial monitor',
    brief:
      'A course bench for reading what a sensor is actually giving you, which is how every real Arduino problem gets debugged.',
    source: 'course',
    watchFor:
      'The serial monitor is the closest thing an Arduino has to a print statement. Change the light and watch the printed number follow it.',
    components: [
      { id: 'ldr2', kind: 'ldr', label: 'LDR', pin: A0, senses: 'light', x: 3, y: 2, wire: 'violet' },
      { id: 'r6', kind: 'resistor', label: '10 kΩ resistor', ohms: 10000, x: 3, y: 4 },
    ],
    env: [light(55)],
    sketch: `void setup() {
  Serial.begin(9600);
}

void loop() {
  int reading = analogRead(A0);
  Serial.print("Light reading: ");
  Serial.println(reading);
  delay(500);
}`,
  },

  {
    id: 'sandbox',
    title: 'Free bench',
    brief: 'Everything wired up. Change the code however you like and see what happens.',
    source: 'course',
    watchFor: 'Nothing is graded here. Break it on purpose and read the error message.',
    components: [
      { id: 'sled1', kind: 'led', label: 'Red LED', pin: 13, x: 7, y: 1, colour: 'red', wire: 'red' },
      { id: 'sled2', kind: 'led', label: 'Green LED', pin: 9, x: 7, y: 3, colour: 'green', wire: 'green' },
      { id: 'sr1', kind: 'resistor', label: '220 Ω', ohms: 220, x: 5, y: 1 },
      { id: 'sr2', kind: 'resistor', label: '220 Ω', ohms: 220, x: 5, y: 3 },
      { id: 'sldr', kind: 'ldr', label: 'LDR', pin: A0, senses: 'light', x: 2, y: 1, wire: 'violet' },
      { id: 'slm35', kind: 'lm35', label: 'LM35', pin: A0 + 1, senses: 'temp', x: 2, y: 3, wire: 'violet' },
      { id: 'sbtn', kind: 'button', label: 'Push button', pin: 2, senses: 'button', x: 2, y: 5, wire: 'yellow' },
      { id: 'sbuz', kind: 'buzzer', label: 'Buzzer', pin: 8, x: 7, y: 5, wire: 'brown' },
    ],
    env: [
      light(60),
      temperature(24),
      {
        id: 'button',
        label: 'Push button',
        unit: '',
        min: 0,
        max: 1,
        step: 1,
        value: 0,
        explain: (v: number) =>
          v > 0.5
            ? 'Held down. With INPUT_PULLUP the pin reads LOW while pressed.'
            : 'Released. With INPUT_PULLUP the pin reads HIGH.',
      },
    ],
    sketch: `// Anything goes here. Try changing a number and pressing Run.

void setup() {
  pinMode(13, OUTPUT);
  pinMode(9, OUTPUT);
  pinMode(2, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
  int lightLevel = analogRead(A0);
  Serial.println(lightLevel);

  if (lightLevel < 400) {
    digitalWrite(13, HIGH);
  } else {
    digitalWrite(13, LOW);
  }

  if (digitalRead(2) == LOW) {
    digitalWrite(9, HIGH);
  } else {
    digitalWrite(9, LOW);
  }

  delay(200);
}`,
  },
]

export function getPreset(id: string): CircuitPreset | undefined {
  return PRESETS.find((p) => p.id === id)
}
