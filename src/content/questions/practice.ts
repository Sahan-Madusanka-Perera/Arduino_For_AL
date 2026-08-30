import type { Question } from '@/types/content'

/* The practice bank: harder questions that do not appear inline in lessons.
   Levels 3 to 5, including structured A/L-style questions with mark schemes.

   IMPORTANT: no past-paper material was supplied with this syllabus, so every
   structured question here is written for this course and is labelled
   "A/L-style". None of them is presented as an official past paper. */

export const practice: Question[] = [
  /* ================================================ level 3: application */
  {
    id: 'p3-1',
    conceptId: 'c-cloud-edge',
    lessonId: 'l1-3',
    level: 3,
    type: 'mcq',
    prompt:
      'A hospital installs wearable monitors on 400 patients. The monitors must raise an alarm within a second if a heart rhythm becomes dangerous, and the hospital also wants to study a year of readings to find patterns. Which combination is correct?',
    options: [
      { id: 'a', text: 'Edge computing for the alarm, cloud computing for the yearly study' },
      { id: 'b', text: 'Cloud computing for the alarm, edge computing for the yearly study' },
      { id: 'c', text: 'Edge computing for both' },
      { id: 'd', text: 'Cloud computing for both' },
    ],
    correct: 'a',
    distractors: {
      b: 'Reversed. Sending the alarm decision to a remote server adds latency, and a year of data from 400 patients is far too much to hold on a wearable.',
      c: 'A wearable cannot store or analyse a year of data from 400 patients.',
      d: 'Cloud alone would add latency to a decision that must be made within a second.',
    },
    explanation:
      'Edge computing enables **real-time analysis and decision-making by processing data locally, reducing latency**. Cloud platforms provide **scalable infrastructure for storing, processing and analysing large volumes of data, enabling advanced analytics**. Each does the job it is designed for.',
  },
  {
    id: 'p3-2',
    conceptId: 'c-mcu-vs-mpu',
    lessonId: 'l2-4',
    level: 3,
    type: 'multi',
    prompt:
      'Which statements are true of a microcontroller but NOT of a microprocessor?',
    options: [
      { id: 'a', text: 'Has built-in Flash/ROM and RAM' },
      { id: 'b', text: 'Includes built-in I/O ports, ADC, DAC and timers' },
      { id: 'c', text: 'Is programmable' },
      { id: 'd', text: 'Has low power consumption' },
      { id: 'e', text: 'Can execute instructions' },
    ],
    correct: ['a', 'b', 'd'],
    explanation:
      'C and E are true of both: they are what makes each a processor at all. The distinguishing properties are integration (built-in memory and I/O) and the consequences of it (low power, low cost, task-specific simplicity).',
  },
  {
    id: 'p3-3',
    conceptId: 'c-analog-pins',
    lessonId: 'l3-2',
    level: 3,
    type: 'numeric',
    prompt:
      'An analog pin is sitting at 2.5 volts. Approximately what value will analogRead() return?',
    correct: 511,
    tolerance: 3,
    explanation:
      '2.5 V is half of 5 V, so the reading is about half of 1023, which is roughly 511 or 512. The relationship is linear across the whole 0–5V range.',
  },
  {
    id: 'p3-4',
    conceptId: 'c-var-types',
    lessonId: 'l6-4',
    level: 3,
    type: 'mcq',
    prompt:
      'Which declaration is wrong, and why?',
    options: [
      { id: 'a', text: 'string name = "Arduino";  — string should be String with a capital S' },
      { id: 'b', text: 'int count = 0;  — int cannot hold zero' },
      { id: 'c', text: "char letter = 'A';  — char cannot hold a letter" },
      { id: 'd', text: 'float temperature = 24.5;  — float cannot hold decimals' },
    ],
    correct: 'a',
    distractors: {
      b: 'int holds whole numbers including zero. That declaration is exactly the syllabus example.',
      c: 'char holds a single character in single quotes. Also a syllabus example.',
      d: 'float exists precisely to hold decimals. Also a syllabus example.',
    },
    explanation:
      'Arduino is case sensitive and the type is `String` with a capital S. Writing `string` produces a compile error, and the error message will not obviously say why.',
  },
  {
    id: 'p3-5',
    conceptId: 'c-ultrasonic',
    lessonId: 'l5-2',
    level: 3,
    type: 'mcq',
    prompt:
      'Why can an ultrasonic sensor give a distance in centimetres while an IR sensor generally cannot?',
    options: [
      { id: 'a', text: 'Because the ultrasonic sensor measures the time taken for sound to travel there and back, and time multiplied by the speed of sound gives distance' },
      { id: 'b', text: 'Because ultrasonic waves travel faster than infrared' },
      { id: 'c', text: 'Because the IR sensor has no receiver' },
      { id: 'd', text: 'Because ultrasonic sensors are more expensive' },
    ],
    correct: 'a',
    distractors: {
      b: 'Infrared is light and travels vastly faster than sound. That speed is part of why timing it is impractical for a cheap sensor.',
      c: 'The IR sensor does have a receiver: a photodiode.',
      d: 'Price has nothing to do with the physical principle.',
    },
    explanation:
      'The ultrasonic sensor works by timing: it measures how long the burst takes to travel to the object and back, then uses the speed of sound in air to calculate the distance. The IR sensor simply detects whether a reflection came back.',
  },
  {
    id: 'p3-6',
    conceptId: 'c-sensor-actuator',
    lessonId: 'l1-3',
    level: 3,
    type: 'multi',
    prompt:
      'In an automatic streetlight that switches on at dusk, which of these are the sensors and actuators?',
    options: [
      { id: 'a', text: 'LDR — sensor' },
      { id: 'b', text: 'Lamp — actuator' },
      { id: 'c', text: 'LDR — actuator' },
      { id: 'd', text: 'Lamp — sensor' },
      { id: 'e', text: 'The microcontroller — neither; it is the process stage' },
    ],
    correct: ['a', 'b', 'e'],
    explanation:
      'The LDR measures light (input, sensor). The lamp changes the world (output, actuator). The microcontroller sits between them as the Process stage of the IPO model.',
  },

  /* =================================================== level 4: reasoning */
  {
    id: 'p4-1',
    conceptId: 'c-temp-conversion',
    lessonId: 'l7-3',
    level: 4,
    type: 'mcq',
    prompt:
      'In practical 4, a student changes `float voltage` to `int voltage` and the motor never switches on, even in a hot room. Why?',
    options: [
      { id: 'a', text: 'The voltage is always less than 1, so an int truncates it to 0, making temperatureC always 0' },
      { id: 'b', text: 'int variables cannot be used with analogRead' },
      { id: 'c', text: 'The program will not compile' },
      { id: 'd', text: 'int is too slow for this calculation' },
    ],
    correct: 'a',
    distractors: {
      b: 'analogRead returns an int perfectly happily. The problem is the *next* line.',
      c: 'It compiles fine, which is what makes this bug hard to find.',
      d: 'Speed is irrelevant here.',
    },
    explanation:
      'At room temperature the LM35 output is well under one volt (0.25 V at 25 °C). An `int` discards everything after the decimal point, so voltage becomes 0, temperatureC becomes 0, and 0 is never greater than or equal to 25. The sketch compiles and runs, and is silently wrong. This is exactly why the syllabus declares both as `float`.',
  },
  {
    id: 'p4-2',
    conceptId: 'c-pullup',
    lessonId: 'l7-4',
    level: 4,
    type: 'mcq',
    prompt:
      'Practical 5 tests `if (digitalRead(2) == LOW)` to detect a closed door. If INPUT_PULLUP were replaced by an external pull-DOWN resistor to GND, with the switch wired to 5V, what would the test have to become?',
    options: [
      { id: 'a', text: 'if (digitalRead(2) == HIGH)' },
      { id: 'b', text: 'It would stay the same' },
      { id: 'c', text: 'if (analogRead(2) > 500)' },
      { id: 'd', text: 'The circuit could not work at all' },
    ],
    correct: 'a',
    distractors: {
      b: 'The whole logic inverts when the resting state inverts.',
      c: 'Pin 2 is a digital pin, not an analog one.',
      d: 'Pull-down arrangements work fine; they are simply the mirror image.',
    },
    explanation:
      'A pull-down holds the pin at 0V (LOW) at rest, and closing the switch connects it to 5V, so it reads HIGH. The logic inverts. This is why knowing *why* INPUT_PULLUP gives an inverted reading matters more than memorising that it does.',
  },
  {
    id: 'p4-3',
    conceptId: 'c-loop',
    lessonId: 'l6-2',
    level: 4,
    type: 'mcq',
    prompt:
      'A sketch has `Serial.begin(9600);` inside loop() instead of setup(). What is the practical consequence?',
    options: [
      { id: 'a', text: 'The serial port is re-initialised thousands of times a second, which is wasteful and can disrupt communication' },
      { id: 'b', text: 'The sketch will not compile' },
      { id: 'c', text: 'Serial output is impossible' },
      { id: 'd', text: 'There is no difference at all' },
    ],
    correct: 'a',
    distractors: {
      b: 'It compiles: it is valid code in the wrong place.',
      c: 'Output still appears, just unreliably.',
      d: 'There is a real difference, which is exactly why setup() exists.',
    },
    explanation:
      'setup() is for things that need doing **once**: initialising variables, pin modes and libraries. Starting serial communication is a one-time initialisation. Putting it in loop() means redoing it endlessly, which achieves nothing and can interfere with the communication it is meant to establish.',
  },
  {
    id: 'p4-4',
    conceptId: 'c-iot-challenges',
    lessonId: 'l1-4',
    level: 4,
    type: 'mcq',
    prompt:
      'An irrigation system waters a field automatically. One soil sensor has drifted and always reports the soil is wet. Which IoT challenge does this best illustrate, and why is it particularly dangerous?',
    options: [
      { id: 'a', text: 'Inaccurate data: the system acts confidently on a false reading, so the crop dies while everything appears normal' },
      { id: 'b', text: 'Dependence on connectivity: the sensor cannot reach the network' },
      { id: 'c', text: 'High setup cost: the sensor was too cheap' },
      { id: 'd', text: 'Security: someone has hacked the sensor' },
    ],
    correct: 'a',
    distractors: {
      b: 'The sensor is reporting fine; the problem is that what it reports is wrong.',
      c: 'Cost is a real challenge but not what has gone wrong here.',
      d: 'Nothing suggests unauthorised access.',
    },
    explanation:
      'The syllabus lists this as: **faulty sensors or poor calibration can produce inaccurate data, affecting decision-making and automation reliability.** It is dangerous precisely because nothing looks broken. A system with no data knows it does not know; a system with wrong data does not.',
  },
  {
    id: 'p4-5',
    conceptId: 'c-for',
    lessonId: 'l6-6',
    level: 4,
    type: 'numeric',
    prompt:
      'A for loop is written as `for (int i = 1; i <= 8; i = i + 2)`. How many times does its block run?',
    correct: 4,
    explanation:
      'i takes the values 1, 3, 5, 7. At i = 9 the condition 9 <= 8 is false and the loop stops. Four passes. The update step is +2, not +1, which halves the count.',
  },
  {
    id: 'p4-6',
    conceptId: 'c-mcu-def',
    lessonId: 'l2-2',
    level: 4,
    type: 'mcq',
    prompt:
      'Why is a Raspberry Pi described in the syllabus as "not strictly a microcontroller-based board", even though it is used for embedded projects?',
    options: [
      { id: 'a', text: 'It is built around a microprocessor with separate memory, rather than a single chip containing CPU, memory and I/O' },
      { id: 'b', text: 'It cannot be programmed' },
      { id: 'c', text: 'It has no input or output pins' },
      { id: 'd', text: 'It is too small to be a development board' },
    ],
    correct: 'a',
    distractors: {
      b: 'It is highly programmable; that is why it is used for embedded work.',
      c: 'It has plenty of GPIO pins.',
      d: 'Size is not the criterion, and the Pi is not the smallest board in the syllabus anyway.',
    },
    explanation:
      'The defining property of a microcontroller is that CPU, memory and I/O sit on one chip. The Pi separates them, which is why the syllabus is careful with the phrase, and also why the Pi is its example of **edge computing** rather than of a microcontroller board.',
  },

  /* ================================================ level 5: exam style */
  {
    id: 'p5-1',
    conceptId: 'c-mcu-vs-mpu',
    lessonId: 'l2-4',
    level: 5,
    type: 'structured',
    marks: 6,
    prompt:
      'A/L-style question.\n\nCompare a microcontroller with a microprocessor under the following headings: purpose, integration, memory, I/O peripherals, cost and complexity. (6 marks)',
    markScheme: [
      { point: 'Purpose: microcontroller is used for specific control tasks in embedded systems; microprocessor for general-purpose computing', marks: 1 },
      { point: 'Integration: microcontroller has CPU, memory and I/O built into one chip; in a microprocessor the CPU is separate from memory and peripherals', marks: 1 },
      { point: 'Memory: microcontroller has built-in Flash/ROM and RAM; microprocessor needs external memory', marks: 1 },
      { point: 'I/O peripherals: microcontroller includes built-in I/O ports, ADC, DAC and timers; microprocessor needs external components for I/O', marks: 1 },
      { point: 'Cost: microcontroller low cost; microprocessor high cost', marks: 1 },
      { point: 'Complexity: microcontroller simple and task-specific; microprocessor complex and powerful', marks: 1 },
    ],
    explanation:
      'Six headings, one mark each, and each mark requires **both** sides of the comparison. An answer that only describes microcontrollers scores nothing on a "compare" question, however accurate it is.',
  },
  {
    id: 'p5-2',
    conceptId: 'c-uno-parts',
    lessonId: 'l3-2',
    level: 5,
    type: 'structured',
    marks: 5,
    prompt:
      'A/L-style question.\n\n(a) State the function of the oscillator on an Arduino Uno. (1 mark)\n(b) State the function of the GND pins. (2 marks)\n(c) State the voltages that correspond to HIGH and LOW on a digital pin. (1 mark)\n(d) State the range of values returned by analogRead(). (1 mark)',
    markScheme: [
      { point: '(a) Provides a clock signal that helps the microcontroller run programs at a steady speed / ensures instructions execute and timing is managed accurately', marks: 1 },
      { point: '(b) Acts as the 0 V reference point in a circuit', marks: 1 },
      { point: '(b) Completes the electrical path for current to flow / used to connect the negative side of components', marks: 1 },
      { point: '(c) HIGH = 5 V and LOW = 0 V', marks: 1 },
      { point: '(d) 0 to 1023', marks: 1 },
    ],
    explanation:
      'Note that part (b) is worth two marks, which signals that two separate points are wanted. Always let the mark allocation tell you how many facts to give.',
  },
  {
    id: 'p5-3',
    conceptId: 'c-blink-code',
    lessonId: 'l7-1',
    level: 5,
    type: 'structured',
    marks: 6,
    prompt:
      'A/L-style question.\n\nWrite an Arduino program that switches an LED connected to pin 8 on for 2 seconds and off for half a second, repeatedly. Explain the purpose of each function you use. (6 marks)',
    markScheme: [
      { point: 'void setup() { ... } present with correct syntax', marks: 1 },
      { point: 'pinMode(8, OUTPUT); inside setup()', marks: 1 },
      { point: 'void loop() { ... } present with correct syntax', marks: 1 },
      { point: 'digitalWrite(8, HIGH); followed by delay(2000);', marks: 1 },
      { point: 'digitalWrite(8, LOW); followed by delay(500);', marks: 1 },
      { point: 'Explanation: pinMode configures the pin as an output; digitalWrite sets it HIGH (5V) or LOW (0V); delay pauses the program for the given number of milliseconds', marks: 1 },
    ],
    explanation:
      'The two numbers to get right are 2000 and 500, because delay() works in **milliseconds**. Two seconds is 2000 ms and half a second is 500 ms. Marks are also available for setup() and pinMode(), which are the parts students most often omit.',
  },
  {
    id: 'p5-4',
    conceptId: 'c-ultrasonic',
    lessonId: 'l5-2',
    level: 5,
    type: 'structured',
    marks: 5,
    prompt:
      'A/L-style question.\n\nDescribe how an ultrasonic sensor measures the distance to an object. (5 marks)',
    markScheme: [
      { point: 'It consists of two main components: a transmitter (emitter) and a receiver', marks: 1 },
      { point: 'The transmitter emits a burst of ultrasonic sound waves, typically above 20 kHz, which is above the range of human hearing', marks: 1 },
      { point: 'The waves travel through the air until they encounter an object and are reflected back to the sensor', marks: 1 },
      { point: 'The receiver picks up the reflected sound waves and the sensor measures the time taken for the round trip', marks: 1 },
      { point: 'Using the speed of sound in air, the sensor calculates the distance to the object', marks: 1 },
    ],
    explanation:
      'A five-mark "describe how" question almost always wants five separate stages. Writing "it uses sound waves to measure distance" is one sentence answering a five-mark question, and will score one mark at most.',
  },
  {
    id: 'p5-5',
    conceptId: 'c-iot-challenges',
    lessonId: 'l1-4',
    level: 5,
    type: 'structured',
    marks: 6,
    prompt:
      'A/L-style question.\n\nA city council plans to install 5,000 IoT sensors to monitor air quality across the city.\n\n(a) State three challenges the council is likely to face. (3 marks)\n(b) For each challenge, explain briefly why it arises in this particular project. (3 marks)',
    markScheme: [
      { point: '(a) Any three from: security and privacy · handling massive data volumes · dependence on continuous and reliable internet · scaling and device management · inaccurate data from faulty or poorly calibrated sensors · high initial setup cost', marks: 3 },
      { point: '(b) Data volume: 5,000 sensors reporting continuously generates an enormous amount of data to store, process and analyse', marks: 1 },
      { point: '(b) Scale / device management: maintaining performance, security and device management across thousands of devices becomes complex', marks: 1 },
      { point: '(b) Any other valid reason tied to the scenario, for example: setup cost for 5,000 devices, sensors, gateways and software is high; or poorly calibrated air quality sensors would produce inaccurate readings that misinform policy', marks: 1 },
    ],
    explanation:
      'Part (b) is where most marks are lost. The question says "in this particular project", so each explanation must refer to the 5,000 sensors or to air quality. A generic sentence copied from the notes will not earn the second set of marks.',
  },
  {
    id: 'p5-6',
    conceptId: 'c-temp-conversion',
    lessonId: 'l7-3',
    level: 5,
    type: 'structured',
    marks: 6,
    prompt:
      'A/L-style question.\n\nThe following lines appear in an Arduino program using an LM35 temperature sensor:\n\n```\nint tempRead = analogRead(A0);\nfloat voltage = tempRead * (5.0 / 1023.0);\nfloat temperatureC = voltage * 100;\n```\n\n(a) Explain what each of the three lines does. (3 marks)\n(b) Explain why the second and third variables are declared as float rather than int. (2 marks)\n(c) State where the VOUT terminal of the LM35 must be connected and why. (1 mark)',
    markScheme: [
      { point: '(a) Line 1 reads the analog value from pin A0, in the range 0 to 1023', marks: 1 },
      { point: '(a) Line 2 converts that reading to a voltage; 5.0/1023.0 scales from the 0–1023 range to the 0–5V range', marks: 1 },
      { point: '(a) Line 3 converts the voltage to Celsius; the LM35 gives 10 mV per °C so multiplying volts by 100 gives degrees', marks: 1 },
      { point: '(b) The voltage is a fraction of a volt (e.g. 0.25 V at 25 °C), and an int would discard the decimal part', marks: 1 },
      { point: '(b) The result would be 0, so temperatureC would always be 0 and the motor would never switch on', marks: 1 },
      { point: '(c) VOUT connects to an analog pin, because the sensor produces a varying voltage rather than an on/off signal', marks: 1 },
    ],
    explanation:
      'Part (b) is the discriminating question. Many students know that float holds decimals; far fewer can say what actually goes wrong if you use int here. Being able to name the consequence is what separates a full answer.',
  },
  {
    id: 'p5-7',
    conceptId: 'c-embedded-def',
    lessonId: 'l2-1',
    level: 5,
    type: 'structured',
    marks: 5,
    prompt:
      'A/L-style question.\n\n(a) Define an embedded system. (2 marks)\n(b) Name the model an embedded system follows and its three stages. (2 marks)\n(c) For an automatic hand dryer, identify the component at each stage. (1 mark)',
    markScheme: [
      { point: '(a) A computer system designed to perform a specific task within a larger system', marks: 1 },
      { point: '(a) Consists of both hardware and software components working together to carry out dedicated operations in real time', marks: 1 },
      { point: '(b) The Input, Process, Output (IPO) model', marks: 1 },
      { point: '(b) Input, Process, Output named as the three stages', marks: 1 },
      { point: '(c) Input: the IR sensor detecting a hand. Process: the microcontroller deciding to run the motor. Output: the motor blowing air', marks: 1 },
    ],
    explanation:
      'In part (c), name the actual components, not the stage words. "Input: sensor" is weaker than "Input: the IR sensor detecting a hand".',
  },
  {
    id: 'p5-8',
    conceptId: 'c-ldr-circuit',
    lessonId: 'l7-2',
    level: 5,
    type: 'structured',
    marks: 6,
    prompt:
      'A/L-style question.\n\nA student builds a circuit in which an LDR switches an LED on when a room becomes dark.\n\n(a) Describe how the LDR should be connected to the Arduino. (2 marks)\n(b) Two resistors are used in this circuit. State the purpose of each. (2 marks)\n(c) The program uses `if (ldrValue < 200)`. Explain what this line tests and why 200 might need to be changed. (2 marks)',
    markScheme: [
      { point: '(a) One end of the LDR connects to the 5V pin of the Arduino and the other end to an analog pin', marks: 1 },
      { point: '(a) That same LDR pin is also connected to a GND pin through a resistor', marks: 1 },
      { point: '(b) The resistor of about 100 Ω in series with the LED reduces the 5V from the Arduino so the LED is not damaged', marks: 1 },
      { point: '(b) The resistor of about 10 kΩ controls the sensitivity of the LDR', marks: 1 },
      { point: '(c) It tests whether the light intensity is low, meaning a dark environment; analogRead returns 0 for dark and 1023 for bright', marks: 1 },
      { point: '(c) The threshold can be adjusted to suit the specific lighting conditions, since the value depends on the LDR, the resistor and the room', marks: 1 },
    ],
    explanation:
      'Part (b) catches people out because both resistors are "resistors" but they have completely different jobs. Naming a different reason for each is what earns both marks.',
  },
  {
    id: 'p5-9',
    conceptId: 'c-compile-upload',
    lessonId: 'l6-1',
    level: 5,
    type: 'structured',
    marks: 5,
    prompt:
      'A/L-style question.\n\n(a) What is the Arduino IDE? (2 marks)\n(b) Explain why the Arduino IDE is described as acting as a compiler. (1 mark)\n(c) Describe what happens, step by step, when the Upload button is clicked and the code contains no errors. (2 marks)',
    markScheme: [
      { point: '(a) A software application that provides a platform for writing, compiling and uploading code', marks: 1 },
      { point: '(a) …to Arduino-compatible microcontroller boards', marks: 1 },
      { point: '(b) Because it translates the high-level code into machine code that runs directly on the microcontroller hardware', marks: 1 },
      { point: '(c) The code is compiled and a binary file with a .hex extension containing machine code is produced', marks: 1 },
      { point: '(c) The compiled binary file is transferred to the board via the USB cable, and the board executes the machine code directly', marks: 1 },
    ],
    explanation:
      'The .hex file is the detail that turns a vague answer into a precise one. If you can name the file extension and say what it contains, you have shown you understand that the board never receives your source code.',
  },
  {
    id: 'p5-10',
    conceptId: 'c-iot-def',
    lessonId: 'l1-1',
    level: 5,
    type: 'structured',
    marks: 6,
    prompt:
      'A/L-style question.\n\n(a) Define the Internet of Things. (1 mark)\n(b) Name four technologies that enable IoT and state what each contributes. (4 marks)\n(c) Give one example of IoT being used in agriculture. (1 mark)',
    markScheme: [
      { point: '(a) A system of interconnected devices that communicate and exchange data over the internet', marks: 1 },
      { point: '(b) Wireless connectivity: technologies such as Wi-Fi, Bluetooth, Zigbee, LoRa and NB-IoT connect devices to the internet and to each other', marks: 1 },
      { point: '(b) Sensors and actuators: sensors collect data from the physical world; actuators act upon that data to perform actions', marks: 1 },
      { point: '(b) Cloud computing: scalable infrastructure for storing, processing and analysing large volumes of IoT data', marks: 1 },
      { point: '(b) Any fourth from: edge computing (local real-time processing, reduced latency and bandwidth) · data analytics and machine learning (actionable insights) · security and privacy (encryption, authentication, access control)', marks: 1 },
      { point: '(c) Precision farming: soil monitoring, crop monitoring or automated irrigation systems', marks: 1 },
    ],
    explanation:
      'Part (b) gives one mark per technology, and each mark needs the name **plus** what it contributes. Four names alone would score at most half.',
  },
  {
    id: 'p5-11',
    conceptId: 'c-while',
    lessonId: 'l6-6',
    level: 5,
    type: 'structured',
    marks: 4,
    prompt:
      'A/L-style question.\n\n(a) Name the three loop structures used in the Arduino language. (1 mark)\n(b) State the key difference between a while loop and a do-while loop. (2 marks)\n(c) Give one situation where a do-while loop is the correct choice. (1 mark)',
    markScheme: [
      { point: '(a) for, while and do...while', marks: 1 },
      { point: '(b) A while loop tests its condition before the block runs, so the block may run zero times', marks: 1 },
      { point: '(b) A do-while loop runs the block first and tests afterwards, so the block always runs at least once', marks: 1 },
      { point: '(c) Any valid case where an action must happen before it can be judged, e.g. taking a sensor reading before checking whether it is valid, or prompting for input before checking whether it is acceptable', marks: 1 },
    ],
    explanation:
      'Part (b) is two marks, which means two statements: one about when the condition is tested, one about the minimum number of repetitions. Giving only one of the two halves loses a mark.',
  },
  {
    id: 'p5-12',
    conceptId: 'c-pullup',
    lessonId: 'l7-4',
    level: 5,
    type: 'structured',
    marks: 5,
    prompt:
      'A/L-style question.\n\nA reed switch is used to detect whether a door is open or closed. The program contains:\n\n```\npinMode(2, INPUT_PULLUP);\n...\nif (digitalRead(2) == LOW) { digitalWrite(13, HIGH); }\n```\n\n(a) Explain what INPUT_PULLUP does. (2 marks)\n(b) Explain why the test is for LOW rather than HIGH. (2 marks)\n(c) State what would go wrong if plain INPUT were used instead. (1 mark)',
    markScheme: [
      { point: '(a) It connects the pin to 5V through a resistor inside the chip', marks: 1 },
      { point: '(a) So the pin reads HIGH when nothing is connected to it', marks: 1 },
      { point: '(b) When the reed switch closes it connects the pin directly to ground', marks: 1 },
      { point: '(b) The direct connection to ground overrides the pull-up, so the pin reads LOW when the switch is closed', marks: 1 },
      { point: '(c) With plain INPUT the pin would be left floating when the switch is open, picking up electrical noise, so digitalRead would return random values', marks: 1 },
    ],
    explanation:
      'The word "floating" is the one the mark scheme is looking for in part (c). It names the exact problem that pull-up resistors exist to solve.',
  },
  {
    id: 'p5-13',
    conceptId: 'c-projects',
    lessonId: 'l7-5',
    level: 5,
    type: 'structured',
    marks: 4,
    prompt:
      'A/L-style question.\n\n(a) A line following car and an obstacle avoiding car both navigate by themselves. State which sensor each uses and why that sensor suits the task. (4 marks)',
    markScheme: [
      { point: 'Line following car uses IR sensors', marks: 1 },
      { point: 'Reason: IR sensors detect the reflection of infrared light, so they can distinguish a black line from a white surface directly beneath the car', marks: 1 },
      { point: 'Obstacle avoiding car uses ultrasonic sensors', marks: 1 },
      { point: 'Reason: ultrasonic sensors measure the time for sound to reflect back, giving the distance to an obstacle ahead so the car can change direction before colliding', marks: 1 },
      ],
    explanation:
      'These two are the pair most often swapped in exams. The syllabus states both attributions directly, so both are safe to quote.',
  },
  {
    id: 'p5-14',
    conceptId: 'c-power',
    lessonId: 'l3-3',
    level: 5,
    type: 'structured',
    marks: 4,
    prompt:
      'A/L-style question.\n\n(a) State three ways an Arduino board can be powered, giving the voltage for each where the syllabus specifies one. (3 marks)\n(b) State the purpose of the onboard voltage regulator. (1 mark)',
    markScheme: [
      { point: '(a) USB power through the USB port, supplying 5 volts', marks: 1 },
      { point: '(a) DC barrel jack, with an external supply of usually 7 to 12 volts', marks: 1 },
      { point: '(a) The Vin pin as the positive with the GND pin as the negative, with an external source within the specified voltage range', marks: 1 },
      { point: '(b) It regulates the input voltage to the levels required by the microcontroller and the other components on the board', marks: 1 },
    ],
    explanation:
      'The two numbers that earn marks here are 5V for USB and 7–12V for the barrel jack. Learn them as a pair.',
  },
]
