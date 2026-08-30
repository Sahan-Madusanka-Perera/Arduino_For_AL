/* Exam preparation material, distilled from the syllabus.
   Nothing here is new content: every fact is stated somewhere in the modules.
   Its job is to put the most-tested facts in one place, in the form a student
   revising the night before actually needs. */

export interface KeyFact {
  id: string
  fact: string
  detail: string
  lessonId: string
}

export const KEY_FACTS: KeyFact[] = [
  {
    id: 'kf-high-low',
    fact: 'HIGH = 5V, LOW = 0V',
    detail: 'The two states of a digital pin on an Arduino Uno. There is nothing in between.',
    lessonId: 'l3-2',
  },
  {
    id: 'kf-analogread',
    fact: 'analogRead() returns 0 to 1023',
    detail:
      '0 is dark or 0 volts; 1023 is bright or 5 volts. The ADC is 10-bit, so 2¹⁰ = 1024 values numbered from 0.',
    lessonId: 'l3-2',
  },
  {
    id: 'kf-analog-range',
    fact: 'Analog pins read 0 to 5 volts',
    detail: 'Converted into digital values by the built-in ADC.',
    lessonId: 'l3-2',
  },
  {
    id: 'kf-barrel',
    fact: 'The DC barrel jack takes 7 to 12 volts',
    detail: 'USB supplies 5V. Both are regulated onboard to the levels the chip needs.',
    lessonId: 'l3-3',
  },
  {
    id: 'kf-lm35',
    fact: 'The LM35 gives 10 mV per °C',
    detail:
      'Output voltage is linearly proportional to Celsius temperature. Multiply volts by 100 to get degrees.',
    lessonId: 'l7-3',
  },
  {
    id: 'kf-delay',
    fact: 'delay(1000) is one second',
    detail: 'delay() works in milliseconds. 1000 ms = 1 s.',
    lessonId: 'l7-1',
  },
  {
    id: 'kf-ultrasonic',
    fact: 'Ultrasonic sound is above 20 kHz',
    detail: 'Above the range of human hearing, which is what "ultra" sonic means.',
    lessonId: 'l5-2',
  },
  {
    id: 'kf-hex',
    fact: 'A successful compile produces a .hex file',
    detail:
      'It contains the machine code, the binary instructions specific to the Arduino microcontroller.',
    lessonId: 'l6-1',
  },
  {
    id: 'kf-setup',
    fact: 'setup() runs once; loop() runs forever',
    detail: 'setup() runs when the board is powered on or reset. loop() repeats until power off or reset.',
    lessonId: 'l6-2',
  },
  {
    id: 'kf-semicolon',
    fact: 'Arduino is case sensitive and uses semicolons, not indentation',
    detail: 'digitalWrite and digitalwrite are different names. Every instruction ends with a semicolon.',
    lessonId: 'l6-3',
  },
  {
    id: 'kf-byte',
    fact: 'A byte holds 0 to 255',
    detail: 'One of the six variable types, alongside int, float, char, String and boolean.',
    lessonId: 'l6-4',
  },
  {
    id: 'kf-const',
    fact: 'const type CONSTANT_NAME = value;',
    detail: 'The format for a constant. Example: const float temp = 25.0;',
    lessonId: 'l6-4',
  },
  {
    id: 'kf-dowhile',
    fact: 'do-while always runs at least once',
    detail: 'It tests the condition after the body. A while loop tests first, so it may run zero times.',
    lessonId: 'l6-6',
  },
  {
    id: 'kf-pullup',
    fact: 'INPUT_PULLUP makes an unconnected pin read HIGH',
    detail: 'Closing a switch to ground then makes it read LOW. The logic is inverted.',
    lessonId: 'l7-4',
  },
  {
    id: 'kf-servo',
    fact: 'Servo: brown to GND, red to 5V, orange to a PWM pin',
    detail: 'Only the orange control wire carries the angle instruction.',
    lessonId: 'l4-4',
  },
  {
    id: 'kf-mcu',
    fact: 'A microcontroller has CPU, memory and I/O on one chip',
    detail: 'This single fact is what every row of the comparison table follows from.',
    lessonId: 'l2-4',
  },
  {
    id: 'kf-resistors',
    fact: 'The LED gets ~100 Ω; the LDR divider gets ~10 kΩ',
    detail:
      'Different jobs: the first limits current to protect the LED, the second controls the sensitivity of the LDR.',
    lessonId: 'l7-2',
  },
  {
    id: 'kf-cnc',
    fact: 'CNC stands for Computer Numerical Control',
    detail: 'The machine\'s movements are controlled by a computer program.',
    lessonId: 'l7-5',
  },
  {
    id: 'kf-rfid',
    fact: 'RFID = Radio Frequency Identification',
    detail: 'Two components: a reader that emits radio waves, and a passive tag holding a unique identifier.',
    lessonId: 'l5-4',
  },
  {
    id: 'kf-accel',
    fact: 'An accelerometer measures three axes: X, Y and Z',
    detail: 'Used to determine changes in velocity and orientation.',
    lessonId: 'l5-4',
  },
]

export interface ConfusedPair {
  id: string
  a: string
  b: string
  difference: string
  test: string
  lessonId: string
}

export const CONFUSED_PAIRS: ConfusedPair[] = [
  {
    id: 'cp-mcu-mpu',
    a: 'Microcontroller',
    b: 'Microprocessor',
    difference:
      'A microcontroller has CPU, memory and I/O built into one chip. In a microprocessor the CPU is separate from memory and peripherals.',
    test: 'Ask: is the memory on the chip? If yes, microcontroller.',
    lessonId: 'l2-4',
  },
  {
    id: 'cp-sensor-actuator',
    a: 'Sensor',
    b: 'Actuator',
    difference:
      'A sensor collects data from the physical world. An actuator acts on that data to change something.',
    test: 'Sense = in. Act = out. An LED is an actuator, not a sensor.',
    lessonId: 'l1-3',
  },
  {
    id: 'cp-cloud-edge',
    a: 'Cloud computing',
    b: 'Edge computing',
    difference:
      'Cloud gives scalable storage and advanced analytics on remote servers. Edge processes locally for real-time decisions with lower latency and bandwidth.',
    test: 'Does it need an answer in milliseconds? Edge. Does it need a year of data? Cloud.',
    lessonId: 'l1-3',
  },
  {
    id: 'cp-ir-ultra',
    a: 'IR sensor',
    b: 'Ultrasonic sensor',
    difference:
      'IR emits infrared light and detects its reflection. Ultrasonic emits sound above 20 kHz and times the echo, which is what lets it give an actual distance.',
    test: 'Line following car uses IR. Obstacle avoiding car uses ultrasonic. The syllabus states both.',
    lessonId: 'l5-2',
  },
  {
    id: 'cp-devsys-devboard',
    a: 'Development system',
    b: 'Development board',
    difference:
      'The system includes both hardware and software tools. The board is mainly the hardware platform.',
    test: 'Does it include the IDE? Then it is the system.',
    lessonId: 'l3-1',
  },
  {
    id: 'cp-while-dowhile',
    a: 'while loop',
    b: 'do-while loop',
    difference:
      'while tests the condition before the body, so it may run zero times. do-while tests after, so it always runs at least once.',
    test: 'If the condition is false at the start, how many times does the body run? 0 vs 1.',
    lessonId: 'l6-6',
  },
  {
    id: 'cp-eq',
    a: '= (assignment)',
    b: '== (comparison)',
    difference: 'One equals sign puts a value into a variable. Two equals signs ask whether two values are equal.',
    test: 'Inside an if(...) condition it is almost always ==.',
    lessonId: 'l6-5',
  },
  {
    id: 'cp-int-float',
    a: 'int',
    b: 'float',
    difference:
      'int holds whole numbers only and silently discards anything after the decimal point. float holds decimals.',
    test: 'Is the value ever a fraction? Voltage and temperature always are, so use float.',
    lessonId: 'l6-4',
  },
  {
    id: 'cp-aref-ioref',
    a: 'AREF pin',
    b: 'IOREF pin',
    difference:
      'AREF supplies an external reference voltage for the ADC, improving analog reading accuracy. IOREF reports the operating voltage of the I/O pins, usually 5V or 3.3V.',
    test: 'AREF is about Analog accuracy. IOREF is about I/O voltage.',
    lessonId: 'l3-2',
  },
  {
    id: 'cp-tx-rx',
    a: 'TX',
    b: 'RX',
    difference: 'TX transmits from the Arduino. RX receives into it.',
    test: 'Always described from the board\'s own point of view.',
    lessonId: 'l3-2',
  },
  {
    id: 'cp-humidity-soil',
    a: 'Humidity sensor',
    b: 'Soil sensor',
    difference: 'Humidity measures moisture in the air. Soil measures moisture in the ground.',
    test: 'Weather station or greenhouse: humidity. Irrigation: soil.',
    lessonId: 'l5-3',
  },
  {
    id: 'cp-ipo-fde',
    a: 'IPO model',
    b: 'Fetch-decode-execute',
    difference:
      'IPO describes a whole system: input, process, output. Fetch-decode-execute describes what a processor does with a single instruction.',
    test: 'IPO is the building; fetch-decode-execute is one brick.',
    lessonId: 'l2-1',
  },
]

export interface Mistake {
  id: string
  mistake: string
  fix: string
  lessonId: string
}

export const COMMON_MISTAKES: Mistake[] = [
  {
    id: 'cm-pinmode',
    mistake: 'Writing a sketch with no pinMode() in setup()',
    fix: 'Every pin you write to must be set as an OUTPUT first. A sketch without it is incomplete and loses marks even if the rest is perfect.',
    lessonId: 'l7-1',
  },
  {
    id: 'cm-semicolon',
    mistake: 'Forgetting a semicolon and looking at the wrong line',
    fix: 'The error is usually reported on the line after the mistake, because the compiler keeps reading looking for the end of your instruction.',
    lessonId: 'l6-3',
  },
  {
    id: 'cm-int-voltage',
    mistake: 'Using int for a voltage or a temperature',
    fix: 'An int discards the decimal part with no warning. In the temperature practical this makes every reading come out as 0 and the motor never switches on.',
    lessonId: 'l7-3',
  },
  {
    id: 'cm-list-short',
    mistake: 'Naming four enabling technologies when the syllabus gives six',
    fix: 'Wireless connectivity, sensors and actuators, cloud computing, edge computing, data analytics and machine learning, and security and privacy. Learn them as three pairs.',
    lessonId: 'l1-3',
  },
  {
    id: 'cm-app-name-only',
    mistake: 'Naming an application area without giving a device',
    fix: '"Healthcare" is half an answer. "Healthcare: a smartwatch that tracks vital signs and sends them to a doctor" is a full one.',
    lessonId: 'l1-2',
  },
  {
    id: 'cm-compare-one-side',
    mistake: 'Describing only one side of a comparison question',
    fix: 'A "compare" question needs both sides in every row. An answer that only describes microcontrollers scores nothing, however accurate it is.',
    lessonId: 'l2-4',
  },
  {
    id: 'cm-resistor-reason',
    mistake: 'Saying "a resistor is used" without saying why',
    fix: 'Give the reason and the value: about 100 Ω to reduce the 5V from the Arduino and protect the LED, or about 10 kΩ to control the sensitivity of the LDR.',
    lessonId: 'l7-2',
  },
  {
    id: 'cm-pullup-logic',
    mistake: 'Testing for HIGH when using INPUT_PULLUP',
    fix: 'A pull-up inverts the logic. Switch open reads HIGH; switch closed reads LOW. The reed switch practical tests for == LOW.',
    lessonId: 'l7-4',
  },
  {
    id: 'cm-marks',
    mistake: 'Ignoring the mark allocation',
    fix: 'A 5-mark "describe how" question wants five separate stages. One sentence answering a five-mark question scores one mark at most.',
    lessonId: 'l5-2',
  },
  {
    id: 'cm-swap-cars',
    mistake: 'Swapping the sensors on the two car projects',
    fix: 'Line following uses IR sensors to identify the path. Obstacle avoiding uses ultrasonic sensors to detect obstacles.',
    lessonId: 'l7-5',
  },
  {
    id: 'cm-abbrev',
    mistake: 'Not expanding abbreviations',
    fix: 'LED is Light Emitting Diode. CNC is Computer Numerical Control. RFID is Radio Frequency Identification. LDR is Light Dependent Resistor. Each expansion is often a mark on its own.',
    lessonId: 'l4-3',
  },
  {
    id: 'cm-loop-setup',
    mistake: 'Putting repeating code in setup()',
    fix: 'setup() runs exactly once. If something needs to keep happening, it belongs in loop().',
    lessonId: 'l6-2',
  },
]
