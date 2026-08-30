import type { Module } from '@/types/content'

/* Module 7 — Practical applications.
   Source: syllabus pages 30–44.

   IMPORTANT PROVENANCE NOTE: the supplied PDF is missing practical application
   number 2. Its printed pages 33–36 are absent from the file and the numbering
   jumps straight from example 1 to example 3. This module keeps the syllabus's
   own numbering (1, 3, 4, 5) rather than silently renumbering, and says so, so
   that a student comparing this course against the printed notes is never
   confused about which example is which. */

export const m7: Module = {
  id: 'm7',
  number: 7,
  title: 'Practical Applications',
  wire: 'brown',
  blurb:
    'The four worked circuits from the syllabus, wired and running. Change the code, move the sensors, and watch what happens.',
  outcomes: [
    'Build and explain each of the four practical circuits in the syllabus',
    'Explain every line of each program in your own words',
    'Predict what a change to the code will do before you make it',
    'Name the popular Arduino project types and the sensors each uses',
  ],
  lessons: [
    /* ------------------------------------------------------------ 7.1 -- */
    {
      id: 'l7-1',
      moduleId: 'm7',
      number: 1,
      title: 'Practical 1: Blinking an LED',
      blurb: 'The first program everyone writes. Four instructions, and you will understand all four.',
      minutes: 16,
      why: 'This is the "Hello World" of hardware. Every later practical is this one with a sensor added, so the four lines here are worth knowing completely.',
      prerequisites: ['l6-2', 'l4-3'],
      objectives: [
        'Describe the circuit, including why the resistor is needed',
        'Explain pinMode(), digitalWrite() and delay() line by line',
        'Predict the effect of changing the delay values',
      ],
      concepts: [
        { id: 'c-blink-circuit', title: 'The blink circuit' },
        { id: 'c-blink-code', title: 'The blink program' },
        { id: 'c-delay', title: 'delay()' },
      ],
      keyTerms: ['t-pinmode', 't-digitalwrite', 't-delay', 't-high-low'],
      blocks: [
        {
          id: 'b1',
          kind: 'prose',
          heading: 'The circuit',
          tone: 'lead',
          text: 'The syllabus describes the wiring in one sentence: **the positive terminal of the LED should be connected to a digital pin of the Arduino board through a resistor, and the negative terminal to a GND pin.**\n\nAnd it explains the [[t-resistor|resistor]]: **a resistor of about 100 ohms is used to reduce the 5V voltage coming from the Arduino board.**',
        },
        {
          id: 'b2',
          kind: 'bench',
          preset: 'blink',
          title: 'Practical 1, running',
          brief:
            'Press Run. The highlighted line shows exactly where the program is. Watch it pause on each delay.',
        },
        {
          id: 'b3',
          kind: 'prose',
          heading: 'Line by line',
          text: 'The syllabus explains each line, and so does the course. Read the explanation, then go back to the bench above and change the numbers.',
        },
        {
          id: 'b4',
          kind: 'code',
          caption: 'The complete program',
          language: 'arduino',
          code: `void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}`,
          lines: [
            { line: 2, text: 'pinMode() configures the specified pin to behave either as an input or an output. 13 is the pin number where the LED is connected. OUTPUT sets the pin as an output, meaning it can provide voltage to an external component like an LED.' },
            { line: 6, text: 'digitalWrite() sets the specified digital pin to either HIGH or LOW. HIGH sets pin 13 to a high voltage level, 5V on most Arduino boards, which turns the LED on.' },
            { line: 7, text: 'delay() pauses the program for the amount of time specified in milliseconds. 1000 milliseconds is equal to 1 second, so the program waits one second before continuing to the next line.' },
            { line: 8, text: 'This sets pin 13 to a low voltage level (0V), turning the LED off.' },
            { line: 9, text: 'This pauses the program for another 1 second, keeping the LED off during this time. Then loop() starts again from the top, so the process repeats.' },
          ],
        },
        {
          id: 'b5',
          kind: 'callout',
          variant: 'exam',
          title: '1000 milliseconds is 1 second',
          text: 'The unit of `delay()` is **milliseconds**, and the syllabus states the conversion explicitly. `delay(1000)` is one second. `delay(500)` is half a second. A question asking how long a given sketch takes for one full blink cycle is asking you to add the delays: 1000 + 1000 = 2000 ms = 2 seconds.',
        },
        {
          id: 'b6',
          kind: 'callout',
          variant: 'misconception',
          title: 'Without the delays you would see nothing',
          text: 'Remove both `delay()` lines and the LED does not stop blinking. It blinks hundreds of thousands of times per second, far too fast for your eye, so it simply looks dimly lit and constant. The delays are not there to slow the board down; they are there to slow it to **human speed**.',
        },
        {
          id: 'b7',
          kind: 'recall',
          prompt: 'What are the three arguments and settings you must get right for the LED to light?',
          answer:
            'The pin must be set as an OUTPUT with pinMode(). The digitalWrite() must send HIGH, not LOW. And physically, the LED\'s positive terminal must go to that pin through a resistor, with the negative terminal to GND.',
          hint: 'One in setup, one in loop, and one in the wiring.',
        },
        {
          id: 'b8',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q7-1-a', 'q7-1-b', 'q7-1-c'],
        },
      ],
      summary: [
        'The LED\'s positive terminal connects to a digital pin through a resistor; the negative terminal connects to GND.',
        'A resistor of about 100 ohms reduces the 5V coming from the Arduino board.',
        'pinMode(13, OUTPUT) configures pin 13 as an output.',
        'digitalWrite(13, HIGH) sets the pin to 5V and turns the LED on; LOW sets it to 0V and turns it off.',
        'delay(1000) pauses the program for 1000 milliseconds, which is 1 second.',
      ],
      examTip:
        'If asked to write this program, do not forget pinMode() in setup(). A sketch with only the loop is incomplete and loses a mark, even though the rest is perfect.',
      confused: {
        simpler:
          'Four instructions on repeat: turn it on, wait a second, turn it off, wait a second. The only setup needed is telling the board that pin 13 is an output.',
        reviewLessonId: 'l6-2',
      },
    },

    /* ------------------------------------------------------------ 7.2 -- */
    {
      id: 'l7-2',
      moduleId: 'm7',
      number: 2,
      title: 'Practical 3: Light sensing with an LDR',
      blurb:
        'Adding a sensor. The LED now decides for itself when to switch on.',
      minutes: 18,
      why: 'This is the first program that reacts to the world. It combines the LDR from module 4, the analog pin from module 3, and the if statement from module 6 into one working system.',
      prerequisites: ['l7-1', 'l6-5', 'l4-3'],
      objectives: [
        'Describe the LDR circuit, including both resistors and where each goes',
        'Explain analogRead() and the 0 to 1023 range',
        'Explain why the threshold value can be adjusted',
        'Explain why delay(100) is there',
      ],
      concepts: [
        { id: 'c-ldr-circuit', title: 'The LDR circuit' },
        { id: 'c-analogread', title: 'analogRead()' },
        { id: 'c-threshold', title: 'Thresholds' },
      ],
      keyTerms: ['t-ldr', 't-analogread', 't-adc', 't-threshold'],
      blocks: [
        {
          id: 'b1',
          kind: 'callout',
          variant: 'source',
          title: 'About the numbering',
          text: 'The syllabus calls this **practical application 3**. Practical 2 is missing from the supplied PDF: its printed pages are not in the file, and the numbering jumps from example 1 straight to example 3. This course keeps the syllabus\'s own numbers so that nothing here contradicts your printed notes.',
        },
        {
          id: 'b2',
          kind: 'prose',
          heading: 'The circuit',
          text: 'The syllabus gives four wiring instructions for this one:\n\n- The positive terminal of the [[t-led|LED]] connects to a [[t-digital-pin|digital pin]] through a [[t-resistor|resistor]], and the negative terminal to [[t-gnd|GND]].\n- **One end of the LDR connects to the 5V pin of the Arduino, and the other end to an analog pin.**\n- **The same LDR pin should also be connected to a GND pin through a resistor.**\n- **A resistor of about 10 kilo ohms is applied to control the sensitivity of the LDR.**',
        },
        {
          id: 'b3',
          kind: 'figure',
          figure: 'DividerFigure',
          caption:
            'Why the LDR needs a second resistor: the voltage divider. Drag the light level.',
          altSummary:
            'A voltage divider circuit. Five volts feeds the top of the LDR. The bottom of the LDR joins both the analog pin and a fixed ten kilo ohm resistor which continues to ground. As light increases the LDR resistance falls and the voltage at the analog pin rises towards five volts. As it gets dark the LDR resistance rises and the voltage at the analog pin falls towards zero.',
        },
        {
          id: 'b4',
          kind: 'callout',
          variant: 'exam',
          title: 'The second resistor is not for protection',
          text: 'Students assume the 10 kΩ resistor is protecting something, like the 100 Ω one protects the LED. It is not. It forms a **voltage divider** with the LDR, and that is what turns a changing resistance into a changing voltage the analog pin can actually read. The syllabus says its job precisely: **to control the sensitivity of the LDR.**',
        },
        {
          id: 'b5',
          kind: 'bench',
          preset: 'ldr',
          title: 'Practical 3, running',
          brief:
            'Drag the light slider. Watch the analogRead value change, and the LED switch at the 200 threshold. Then change 200 in the code and run it again.',
        },
        {
          id: 'b6',
          kind: 'code',
          caption: 'The complete program',
          language: 'arduino',
          code: `void setup() {
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
          lines: [
            { line: 2, text: 'Sets pin 13 as an output.' },
            { line: 6, text: 'Reads the analog value from the LDR connected to A0. The LDR\'s resistance varies with light intensity, and this function returns a value between 0 (dark) and 1023 (bright).' },
            { line: 7, text: 'Checks if the light intensity is low, meaning a dark environment. The threshold value of 200 can be adjusted to suit your specific lighting conditions.' },
            { line: 8, text: 'If the condition is true, the bulb lights up.' },
            { line: 10, text: 'Otherwise the bulb will not light.' },
            { line: 12, text: 'This delay is used for stability, ensuring that the Arduino does not read the LDR value too quickly, and provides time for the LED state to be visible.' },
          ],
        },
        {
          id: 'b7',
          kind: 'callout',
          variant: 'remember',
          title: '0 is dark, 1023 is bright',
          text: 'This mapping is stated directly in the syllabus and is easy to get backwards. Less light means a higher LDR resistance, which pulls the analog pin voltage **down**, which gives a **lower** number. So dark = low number = LED on.',
        },
        {
          id: 'b8',
          kind: 'explain',
          prompt:
            'Why does the program compare the reading against 200 rather than against a fixed brightness in lux?',
          rubric: [
            'Says analogRead returns a number from 0 to 1023, not a real-world unit',
            'Says the number depends on the particular LDR and the resistor used',
            'Notes the syllabus says the threshold can be adjusted to suit specific lighting conditions',
            'Notes that you would find the right value by testing in the actual room',
          ],
          modelAnswer:
            'Because analogRead() gives back a number from 0 to 1023, not a measurement in any real unit. What that number means depends on the particular LDR, the resistor chosen and the room, so there is no universal brightness value to compare against. The syllabus says the threshold value of 200 can be adjusted to suit your specific lighting conditions, which means you find the right number by testing: read the value in a bright room and in a dark one, and pick a threshold in between.',
        },
        {
          id: 'b9',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q7-2-a', 'q7-2-b', 'q7-2-c', 'q7-2-d'],
        },
      ],
      summary: [
        'One end of the LDR connects to 5V, the other to an analog pin; that same point also connects to GND through a resistor of about 10 kΩ, which controls sensitivity.',
        'analogRead(A0) returns a value between 0 (dark) and 1023 (bright).',
        'if (ldrValue < 200) checks whether the light intensity is low; the threshold can be adjusted for the actual lighting conditions.',
        'delay(100) is used for stability, so the Arduino does not read the LDR too quickly, and gives time for the LED state to be visible.',
      ],
      examTip:
        'When explaining this circuit, mention both resistors and give each one a different reason: the ~100 Ω one protects the LED, the ~10 kΩ one controls the LDR\'s sensitivity. Naming both reasons distinguishes a full answer from a half one.',
      confused: {
        simpler:
          'The LDR is a resistor that changes with light. The Arduino reads how much voltage that leaves on pin A0 and gives you a number from 0 to 1023. If that number is small, it is dark, so switch the light on.',
        reviewLessonId: 'l7-1',
      },
    },

    /* ------------------------------------------------------------ 7.3 -- */
    {
      id: 'l7-3',
      moduleId: 'm7',
      number: 3,
      title: 'Practical 4: Temperature-controlled motor',
      blurb:
        'The one with real arithmetic in it. Converting a reading into degrees Celsius.',
      minutes: 20,
      why: 'The three-line conversion in this program is the most examinable piece of code in the whole syllabus, because it tests whether you actually understand what analogRead gives you.',
      prerequisites: ['l7-2', 'l6-4', 'l5-3'],
      objectives: [
        'Describe the LM35 wiring: VIN, VOUT and GND',
        'Explain the conversion from reading to voltage to degrees Celsius',
        'Explain why a constant is used for the threshold',
        'Explain why a relay would be needed for a mains fan',
      ],
      concepts: [
        { id: 'c-lm35-circuit', title: 'The LM35 circuit' },
        { id: 'c-temp-conversion', title: 'Converting a reading to degrees Celsius' },
        { id: 'c-relay', title: 'Relays' },
      ],
      keyTerms: ['t-lm35', 't-constant', 't-relay', 't-float'],
      blocks: [
        {
          id: 'b1',
          kind: 'prose',
          heading: 'The circuit',
          tone: 'lead',
          text: 'The syllabus specifies the LM35 wiring exactly:\n\n- **The VIN terminal should be connected to the 5V pin of the Arduino board.**\n- **The VOUT terminal should be connected to an analog pin.**\n- **The GND terminal should be connected to a GND pin of the Arduino board.**\n\nAnd for the motor: **one end of the motor should be connected to the negative end and the other to a digital pin on the Arduino board.**',
        },
        {
          id: 'b2',
          kind: 'bench',
          preset: 'thermostat',
          title: 'Practical 4, running',
          brief:
            'Drag the temperature across 25 °C. Watch all three conversion lines update, then the motor switch.',
        },
        {
          id: 'b3',
          kind: 'code',
          caption: 'The complete program',
          language: 'arduino',
          code: `const float temp = 25.0;

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
          lines: [
            { line: 1, text: 'This line declares a constant temp which is set to 25.0°C. This is the temperature threshold. When the measured temperature exceeds this value, the fan will be turned on.' },
            { line: 4, text: 'Configures pin A0 as an input.' },
            { line: 5, text: 'Configures pin 7 as an output.' },
            { line: 6, text: 'Sets pin 7 to LOW, ensuring that the motor is off initially.' },
            { line: 10, text: 'Reads the analog value from pin A0 where the LM35 sensor is connected. The analog value ranges from 0 to 1023.' },
            { line: 11, text: 'Converts the analog reading to a voltage. The formula 5.0 / 1023.0 scales the reading from a range of 0-1023 to a range of 0-5V.' },
            { line: 12, text: 'Converts the voltage to temperature in Celsius. For the LM35 sensor, the output voltage is linearly proportional to the Celsius temperature, with a scale factor of 10mV per °C. Therefore, multiplying the voltage by 100 gives the temperature in Celsius.' },
            { line: 14, text: 'Compares the measured temperature (temperatureC) to the threshold (temp).' },
            { line: 15, text: 'If the temperature is equal to or greater than 25°C, turns on the motor.' },
            { line: 17, text: 'If the temperature is below 25°C, turns off the motor.' },
          ],
        },
        {
          id: 'b4',
          kind: 'figure',
          figure: 'Lm35Figure',
          caption:
            'The three conversion stages. Drag the temperature and watch each number follow.',
          altSummary:
            'A three-stage conversion. Temperature in Celsius produces a voltage at ten millivolts per degree. The ADC converts that voltage to a reading from 0 to 1023. The program multiplies the reading by 5.0 divided by 1023.0 to get volts back, then multiplies by 100 to recover degrees Celsius.',
        },
        {
          id: 'b5',
          kind: 'callout',
          variant: 'exam',
          title: 'Be able to explain both multiplications',
          text: '`* (5.0 / 1023.0)` undoes the ADC: it turns a number from 0–1023 back into a voltage from 0–5V.\n\n`* 100` undoes the sensor: the LM35 gives 10 mV per °C, and there are 100 lots of 10 mV in a volt, so one volt means 100 °C.\n\nAn answer that says "it converts it to Celsius" without saying *why 100* is only half an answer.',
        },
        {
          id: 'b6',
          kind: 'callout',
          variant: 'misconception',
          title: 'Why both variables must be float',
          text: 'If `voltage` were declared `int`, then a reading of 51 would give `51 * 0.00488 = 0.249`, which an int would store as **0**. Every temperature would come out as 0 °C and the motor would never switch on.\n\nThis is not a stylistic choice. `float` is the reason the program works at all, which is exactly why the syllabus declares both as `float`.',
        },
        {
          id: 'b6b',
          kind: 'callout',
          variant: 'note',
          title: 'Why exactly 25.0 °C does not switch the motor on',
          text: 'Set the bench to exactly 25.0 and the motor stays off. That is not a fault, and it is worth understanding.\n\nAt 25 °C the LM35 outputs 0.25V. The ADC has only 1024 steps across 0–5V, so 0.25V becomes the whole number **51**. Converting 51 back gives 51 × (5.0 ÷ 1023) × 100 = **24.93 °C**, which is not greater than or equal to 25.\n\nThe reading has been rounded to the nearest step and a little precision was lost on the way. Real hardware behaves exactly like this, which is why a threshold in a real system is always approximate. Nudge the slider to 25.5 and the motor comes on.',
        },
        {
          id: 'b7',
          kind: 'prose',
          heading: 'One more thing the syllabus adds',
          text: 'At the end of the explanation the syllabus notes: **a 230V fan can be operated by connecting a relay instead of the motor.**\n\nThis matters because an Arduino pin supplies 5V and a very small current. It cannot drive a mains fan directly, and attempting it would destroy the board. A **relay** is an electrically operated switch: the small 5V signal from the Arduino operates the [[t-relay|relay]], and the relay switches the separate 230V circuit. The two circuits stay entirely separate.',
        },
        {
          id: 'b8',
          kind: 'analogy',
          title: 'A relay is a doorman',
          analogy:
            'You cannot lift the gate yourself, but you can call out to the doorman, and he can. Your voice is tiny; the gate is heavy. The doorman is what connects the two without you ever touching the gate.',
          mapping: [
            { from: 'Your voice', to: 'The 5V signal from an Arduino pin' },
            { from: 'The doorman', to: 'The relay' },
            { from: 'The heavy gate', to: 'The 230V mains circuit' },
            { from: 'Never touching the gate yourself', to: 'The two circuits staying electrically separate' },
          ],
        },
        {
          id: 'b9',
          kind: 'recall',
          prompt:
            'The LM35 outputs 0.31 V. What temperature is that, and what would analogRead return?',
          answer:
            '0.31 V at 10 mV per °C is 31 °C. analogRead would return about 63, because 0.31 ÷ 5.0 × 1023 ≈ 63. Since 31 is greater than the 25 °C threshold, the motor would switch on.',
          hint: 'Multiply the voltage by 100 for the temperature. For the reading, work out what fraction of 5V it is, then take that fraction of 1023.',
        },
        {
          id: 'b10',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q7-3-a', 'q7-3-b', 'q7-3-c', 'q7-3-d'],
        },
      ],
      summary: [
        'LM35 wiring: VIN to 5V, VOUT to an analog pin, GND to a GND pin.',
        'const float temp = 25.0; declares the temperature threshold.',
        'digitalWrite(7, LOW) in setup ensures the motor is off initially.',
        'voltage = tempRead * (5.0 / 1023.0) scales the 0–1023 reading back to 0–5V.',
        'temperatureC = voltage * 100 converts volts to Celsius, because the LM35 outputs 10 mV per °C.',
        'A 230V fan can be operated by connecting a relay instead of the motor.',
      ],
      examTip:
        'This program is the most likely one to appear as a "explain what this line does" question. Learn the two conversion lines well enough to explain both the formula and the reason behind it.',
      confused: {
        simpler:
          'The sensor gives a tiny voltage: 10 thousandths of a volt for every degree. The Arduino turns that voltage into a number between 0 and 1023. The program undoes both steps: first back to volts, then back to degrees. Then it compares that to 25 and switches the motor.',
        reviewLessonId: 'l7-2',
      },
    },

    /* ------------------------------------------------------------ 7.4 -- */
    {
      id: 'l7-4',
      moduleId: 'm7',
      number: 4,
      title: 'Practical 5: Door detection with a reed switch',
      blurb: 'The one that introduces INPUT_PULLUP, and why an unconnected pin is a problem.',
      minutes: 15,
      why: 'INPUT_PULLUP is the only pin mode besides INPUT and OUTPUT in this syllabus, and the reason it exists is a genuinely interesting piece of electronics that examiners like.',
      prerequisites: ['l7-3', 'l5-2'],
      objectives: [
        'Describe the reed switch circuit',
        'Explain what INPUT_PULLUP does and why it is needed',
        'Explain why a closed switch reads LOW rather than HIGH',
      ],
      concepts: [
        { id: 'c-reed-circuit', title: 'The reed switch circuit' },
        { id: 'c-pullup', title: 'INPUT_PULLUP' },
      ],
      keyTerms: ['t-reed', 't-pullup', 't-digitalread', 't-floating'],
      blocks: [
        {
          id: 'b1',
          kind: 'prose',
          heading: 'The circuit',
          tone: 'lead',
          text: 'The wiring instruction is the same one as practical 1: **the positive terminal of the LED should be connected to a digital pin of the Arduino board through a resistor, and the negative terminal to a GND pin.**\n\nThe reed switch itself connects pin 2 to [[t-gnd|GND]]. When a magnet comes near, the switch closes and pin 2 is connected to ground.',
        },
        {
          id: 'b2',
          kind: 'bench',
          preset: 'reed',
          title: 'Practical 5, running',
          brief:
            'Toggle the door. Watch what digitalRead(2) returns in each position, and follow which branch of the if runs.',
        },
        {
          id: 'b3',
          kind: 'code',
          caption: 'The complete program',
          language: 'arduino',
          code: `void setup() {
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
          lines: [
            { line: 2, text: 'The pull-up resistor ensures that the pin reads HIGH when it is not connected to anything. When connected to ground, through a button press for instance, it will read LOW.' },
            { line: 3, text: 'Also sets pin 13 as an output.' },
            { line: 7, text: 'Reads the state of pin 2. If the state of pin 2 is LOW, meaning the switch connected to pin 2 is closed and connecting the pin to ground, the following block of code is executed.' },
            { line: 8, text: 'Then pin 13 outputs as HIGH.' },
            { line: 10, text: 'Otherwise pin 13 is output as LOW.' },
          ],
        },
        {
          id: 'b4',
          kind: 'prose',
          heading: 'Why INPUT_PULLUP exists',
          text: 'Here is the problem it solves. An input pin with nothing connected to it is not at 0V and not at 5V. It is **floating**: it picks up electrical noise from the air and from nearby wires, and `digitalRead()` returns HIGH and LOW at random.\n\nA pull-up [[t-resistor|resistor]] fixes that. It gently connects the pin to 5V through a resistor inside the chip, so with nothing else attached the pin sits firmly at **HIGH**. When the switch closes and connects the pin directly to ground, ground wins and the pin goes **LOW**.',
        },
        {
          id: 'b5',
          kind: 'figure',
          figure: 'PullupFigure',
          caption:
            'The pin with the switch open and closed. Toggle it and watch what the pin reads.',
          altSummary:
            'A digital pin with an internal pull-up resistor connecting it to five volts, and a switch connecting it to ground. With the switch open, the pull-up holds the pin at five volts, so it reads HIGH. With the switch closed, the pin is connected directly to ground and reads LOW, because the direct connection to ground overrides the weak pull-up.',
        },
        {
          id: 'b6',
          kind: 'callout',
          variant: 'exam',
          title: 'Closed switch reads LOW: the logic is inverted',
          text: 'This is the part students get wrong. With INPUT_PULLUP:\n\n**Switch open (door open) → pin reads HIGH**\n**Switch closed (door closed) → pin reads LOW**\n\nSo the code tests for `== LOW` to detect that the switch is *closed*. It feels backwards, and it is: that is exactly what a pull-up does, and it is why the syllabus explains both cases in its note.',
        },
        {
          id: 'b7',
          kind: 'analogy',
          title: 'A weak string and a strong hand',
          analogy:
            'Imagine a light switch hanging from the ceiling on a weak elastic string that always pulls it up. Left alone it stays up. But if someone grabs it and holds it down, it goes down, because a hand is stronger than the string. Let go and it springs back up.',
          mapping: [
            { from: 'The weak elastic string pulling up', to: 'The internal pull-up resistor holding the pin at 5V' },
            { from: 'Left alone, it stays up', to: 'Switch open, pin reads HIGH' },
            { from: 'A hand pulling it down', to: 'The switch connecting the pin directly to ground' },
            { from: 'It goes down because the hand is stronger', to: 'Switch closed, pin reads LOW' },
          ],
        },
        {
          id: 'b8',
          kind: 'explain',
          prompt:
            'A student wires a reed switch but uses pinMode(2, INPUT) instead of INPUT_PULLUP. The LED flickers on and off randomly even when nobody touches the door. Explain why.',
          rubric: [
            'Says that with plain INPUT and the switch open, the pin is not connected to anything',
            'Uses the idea that the pin is floating',
            'Says it picks up electrical noise, so digitalRead returns random values',
            'Says INPUT_PULLUP fixes it by holding the pin at HIGH when nothing else is connected',
          ],
          modelAnswer:
            'With plain INPUT, when the reed switch is open the pin is connected to nothing at all. It is left floating, so it picks up stray electrical noise from the surroundings and digitalRead() returns HIGH or LOW more or less at random. Since the program switches the LED based on that reading, the LED flickers. INPUT_PULLUP fixes it by connecting the pin to 5V through a resistor inside the chip, so with the switch open the pin is held firmly at HIGH, and only goes LOW when the switch actually closes and connects it to ground.',
        },
        {
          id: 'b9',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q7-4-a', 'q7-4-b', 'q7-4-c'],
        },
      ],
      summary: [
        'pinMode(2, INPUT_PULLUP) ensures the pin reads HIGH when it is not connected to anything.',
        'When the pin is connected to ground, through a switch closing, it reads LOW.',
        'if (digitalRead(2) == LOW) therefore detects that the switch is closed.',
        'Without a pull-up, an unconnected input pin floats and returns random readings.',
      ],
      examTip:
        'If a question asks why INPUT_PULLUP is used rather than INPUT, the answer has two halves: it prevents the pin from floating, and it gives a known state (HIGH) when the switch is open.',
      confused: {
        simpler:
          'A pin with nothing attached does not read 0. It reads random rubbish. INPUT_PULLUP quietly holds it at 5V so it reads HIGH when nothing is happening, and the switch pulls it to 0V (LOW) when it closes. So closed = LOW.',
        reviewLessonId: 'l7-1',
      },
    },

    /* ------------------------------------------------------------ 7.5 -- */
    {
      id: 'l7-5',
      moduleId: 'm7',
      number: 5,
      title: 'What people build with Arduino',
      blurb: 'Eight popular project types, and which sensors each one needs.',
      minutes: 12,
      why: 'These eight are named in the syllabus, and they are the natural place for a scenario question: "which sensor would this project use, and why?"',
      prerequisites: ['l5-2'],
      objectives: [
        'Name the eight popular Arduino projects in the syllabus',
        'Say what each one does',
        'Identify which sensor each project relies on',
      ],
      concepts: [{ id: 'c-projects', title: 'Popular Arduino projects' }],
      keyTerms: ['t-ir-sensor', 't-ultrasonic', 't-cnc', 't-tinkercad'],
      blocks: [
        {
          id: 'b1',
          kind: 'callout',
          variant: 'note',
          title: 'If you do not have a board',
          text: 'The syllabus points students at Tinkercad: **if you don\'t have a physical Arduino board, you can create the required circuit from the website Tinkercad, write the corresponding code and observe the performance.** It is at tinkercad.com/dashboard.\n\nThe benches in this course do the same thing offline, so you can practise without a connection. Tinkercad is worth using too, because it simulates the actual electronics rather than the behaviour.',
        },
        {
          id: 'b2',
          kind: 'gallery',
          title: 'Eight popular Arduino projects',
          items: [
            {
              id: 'pj-line',
              name: 'Line following car',
              art: 'proj-line',
              what: 'A robot designed to follow a predefined path, usually a black line on a white surface or a white line on a dark surface.',
              how: 'It uses IR sensors to identify the path.',
              tags: ['IR sensors'],
            },
            {
              id: 'pj-maze',
              name: 'Maze solver',
              art: 'proj-maze',
              what: 'A more advanced type of autonomous robot designed to navigate through a maze.',
              how: 'Uses sensors and algorithms to find its way from the start to the end point.',
              tags: ['sensors', 'algorithms'],
            },
            {
              id: 'pj-cnc',
              name: 'CNC plotter',
              art: 'proj-cnc',
              what: 'A machine that can draw or engrave on various surfaces using a pen or a cutting tool.',
              how: 'CNC stands for Computer Numerical Control, meaning the machine\'s movements are controlled by a computer program.',
              tags: ['CNC', 'motors'],
            },
            {
              id: 'pj-balance',
              name: 'Self-balancing robot',
              art: 'proj-balance',
              what: 'A two-wheeled robot that can maintain its balance automatically.',
              how: 'Uses sensors to detect its orientation and a control system to adjust the motors, keeping it upright. Involves a combination of electronics, mechanics and programming.',
              tags: ['orientation sensors', 'motors'],
            },
            {
              id: 'pj-3d',
              name: '3D printer',
              art: 'proj-3d',
              what: 'A device that can fabricate three-dimensional objects by depositing material layer by layer according to a digital model.',
              tags: ['layer by layer'],
            },
            {
              id: 'pj-solar',
              name: 'Solar tracker',
              art: 'proj-solar',
              what: 'A device that orients solar panels toward the sun to maximise the amount of sunlight they capture, improving the efficiency of solar energy systems.',
              how: 'It adjusts the position of the solar panels throughout the day to follow the sun\'s path.',
              tags: ['light sensing', 'efficiency'],
            },
            {
              id: 'pj-cube',
              name: 'LED cube',
              art: 'proj-cube',
              what: 'A 3D matrix of LEDs that can display light patterns and animations in three dimensions.',
              tags: ['LEDs', '3D matrix'],
            },
            {
              id: 'pj-obstacle',
              name: 'Obstacle avoiding car',
              art: 'proj-obstacle',
              what: 'A robotic vehicle designed to navigate around obstacles without human intervention.',
              how: 'Using ultrasonic sensors to detect obstacles, the car can change its direction to avoid collisions. An excellent project for learning about robotics, sensors and programming with Arduino.',
              tags: ['ultrasonic sensors'],
            },
          ],
        },
        {
          id: 'b3',
          kind: 'callout',
          variant: 'exam',
          title: 'Two projects, two different sensors, and the syllabus says which',
          text: 'The **line following car** uses **IR sensors** to identify the path. The **obstacle avoiding car** uses **ultrasonic sensors** to detect obstacles. These are the two sensor attributions the syllabus states outright, so they are the two most likely to be asked. Do not swap them.',
        },
        {
          id: 'b4',
          kind: 'sort',
          prompt: 'Which sensor does each project depend on most?',
          buckets: [
            { id: 'ir', label: 'IR sensor' },
            { id: 'ultra', label: 'Ultrasonic sensor' },
            { id: 'accel', label: 'Orientation / accelerometer' },
            { id: 'ldr', label: 'Light sensing' },
          ],
          items: [
            {
              id: 'g1',
              label: 'Line following car',
              bucket: 'ir',
              why: 'The syllabus states it directly: it uses IR sensors to identify the path.',
            },
            {
              id: 'g2',
              label: 'Obstacle avoiding car',
              bucket: 'ultra',
              why: 'The syllabus states it uses ultrasonic sensors to detect obstacles so it can change direction and avoid collisions.',
            },
            {
              id: 'g3',
              label: 'Self-balancing robot',
              bucket: 'accel',
              why: 'It uses sensors to detect its orientation, then adjusts the motors to stay upright.',
            },
            {
              id: 'g4',
              label: 'Solar tracker',
              bucket: 'ldr',
              why: 'It has to find where the sun is in order to orient the panels toward it and follow its path through the day.',
            },
          ],
        },
        {
          id: 'b5',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q7-5-a', 'q7-5-b'],
        },
      ],
      summary: [
        'The eight projects are: line following car, maze solver, CNC plotter, self-balancing robot, 3D printer, solar tracker, LED cube and obstacle avoiding car.',
        'The line following car uses IR sensors to identify the path.',
        'The obstacle avoiding car uses ultrasonic sensors to detect obstacles.',
        'The self-balancing robot uses sensors to detect orientation and a control system to adjust the motors.',
        'CNC stands for Computer Numerical Control.',
        'Tinkercad can be used to build and test circuits without physical hardware.',
      ],
      examTip:
        'CNC stands for Computer Numerical Control. Expanding an abbreviation is almost always worth a mark on its own.',
      confused: {
        simpler:
          'Eight things people build. Two of them are cars: one follows a line using IR, one avoids obstacles using ultrasonic. The rest are a drawing machine, a balancing robot, a 3D printer, a sun-following solar panel, and a cube of LEDs.',
      },
    },
  ],
}
