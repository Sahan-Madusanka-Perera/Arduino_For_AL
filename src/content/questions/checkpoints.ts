import type { Question } from '@/types/content'

/* Checkpoint questions: the low-stakes checks that appear inside lessons.
   Mostly levels 1 to 3. Every wrong option carries a note explaining what
   choosing it reveals, so a miss teaches something rather than just scoring
   zero. */

export const checkpointQuestions: Question[] = [
  /* ================================================================ M1 == */
  {
    id: 'q1-1-a',
    conceptId: 'c-iot-def',
    lessonId: 'l1-1',
    level: 1,
    type: 'mcq',
    prompt: 'Which of these is the syllabus definition of the Internet of Things?',
    options: [
      { id: 'a', text: 'A system of interconnected devices that communicate and exchange data over the internet.' },
      { id: 'b', text: 'A network of computers that share files with each other.' },
      { id: 'c', text: 'Any device that can be connected to a Wi-Fi network.' },
      { id: 'd', text: 'Software that controls electronic appliances in a house.' },
    ],
    correct: 'a',
    distractors: {
      b: 'That describes an ordinary computer network. IoT is specifically about *things*: objects whose main job is something other than computing.',
      c: 'Being able to join Wi-Fi is not enough. The definition requires devices that are interconnected and that exchange data.',
      d: 'That is one application of IoT (smart homes), not the definition of it.',
    },
    explanation:
      'The two ideas that must appear are **interconnected devices** and **exchange data over the internet**. Leaving either out makes the definition incomplete.',
  },
  {
    id: 'q1-1-b',
    conceptId: 'c-iot-keypoints',
    lessonId: 'l1-1',
    level: 2,
    type: 'multi',
    prompt: 'Select all the key points the syllabus gives about IoT devices.',
    options: [
      { id: 'a', text: 'Sensors detect environmental factors like temperature, motion and humidity' },
      { id: 'b', text: 'Strong protection is required to prevent data breaches and cyberattacks' },
      { id: 'c', text: 'Every IoT device must contain its own screen' },
      { id: 'd', text: 'Collected sensor data is analysed using algorithms to produce useful insights' },
      { id: 'e', text: 'IoT devices must be powered by mains electricity' },
    ],
    correct: ['a', 'b', 'd'],
    explanation:
      'A, B and D are three of the six key points. C and E are inventions: plenty of IoT devices have no screen at all, and many run for years on a small battery.',
  },
  {
    id: 'q1-1-c',
    conceptId: 'c-iot-def',
    lessonId: 'l1-1',
    level: 3,
    type: 'truefalse',
    prompt:
      'A television remote control that changes channels using infrared is an example of an IoT device.',
    correct: false,
    probes: 'Confusing "wireless" with "connected to the internet".',
    explanation:
      'It is wireless, but there is no internet and no data exchange with other devices or systems. IoT requires **interconnected devices communicating and exchanging data over the internet**, and a remote does neither.',
  },
  {
    id: 'q1-2-a',
    conceptId: 'c-iot-apps',
    lessonId: 'l1-2',
    level: 1,
    type: 'mcq',
    prompt:
      'Smart thermostats, security cameras and door locks controlled by a phone app belong to which application area?',
    options: [
      { id: 'a', text: 'Smart homes' },
      { id: 'b', text: 'Smart cities' },
      { id: 'c', text: 'Industrial internet' },
      { id: 'd', text: 'Retail' },
    ],
    correct: 'a',
    distractors: {
      b: 'Smart cities is about urban infrastructure: traffic management, waste management, streetlights. Not the inside of one house.',
      c: 'Industrial internet is about manufacturing and production lines.',
      d: 'Retail covers shops: smart shelves, beacons, cashier-less checkout.',
    },
    explanation:
      'These are the exact examples the syllabus gives for smart homes, where IoT enhances convenience, safety and energy efficiency.',
  },
  {
    id: 'q1-2-b',
    conceptId: 'c-industry40',
    lessonId: 'l1-2',
    level: 2,
    type: 'blank',
    prompt: 'The industrial internet is also known as Industry ___.',
    accept: ['4.0', '4', 'four point zero', '4·0'],
    placeholder: 'a number',
    explanation:
      'Industry 4.0. The syllabus names it for enabling predictive maintenance, asset tracking and real-time monitoring of equipment and production lines.',
  },
  {
    id: 'q1-2-c',
    conceptId: 'c-iot-apps',
    lessonId: 'l1-2',
    level: 3,
    type: 'mcq',
    prompt:
      'A farmer installs sensors that measure soil moisture and open an irrigation valve automatically. Which application area and which technique is this?',
    options: [
      { id: 'a', text: 'Agriculture, using precision farming' },
      { id: 'b', text: 'Energy management, using grid optimisation' },
      { id: 'c', text: 'Smart cities, using environmental monitoring' },
      { id: 'd', text: 'Industrial internet, using predictive maintenance' },
    ],
    correct: 'a',
    distractors: {
      b: 'Energy management is about monitoring and controlling energy usage in buildings, factories and utilities.',
      c: 'Smart cities do use environmental sensors, but this is a farm, not urban infrastructure.',
      d: 'Predictive maintenance is about repairing machines before they fail, not about watering crops.',
    },
    explanation:
      'The syllabus names soil monitoring, crop monitoring and automated irrigation systems as **precision farming** techniques under agriculture.',
  },
  {
    id: 'q1-3-a',
    conceptId: 'c-sensor-actuator',
    lessonId: 'l1-3',
    level: 1,
    type: 'mcq',
    prompt: 'Which of these is an actuator rather than a sensor?',
    options: [
      { id: 'a', text: 'A relay that switches a fan on' },
      { id: 'b', text: 'A thermometer measuring room temperature' },
      { id: 'c', text: 'An LDR measuring light level' },
      { id: 'd', text: 'A microphone detecting sound' },
    ],
    correct: 'a',
    distractors: {
      b: 'A thermometer measures. Measuring the world is what a sensor does.',
      c: 'An LDR measures light. That is a sensor.',
      d: 'A microphone measures sound pressure. Also a sensor.',
    },
    explanation:
      'Sensors **collect data from the physical world**. Actuators **act upon this data, performing actions such as controlling lights or adjusting environmental conditions**. Sense in, act out.',
  },
  {
    id: 'q1-3-b',
    conceptId: 'c-cloud-edge',
    lessonId: 'l1-3',
    level: 3,
    type: 'mcq',
    prompt:
      'A factory machine must stop within milliseconds if a worker\'s hand enters a danger zone. Which technology should make that decision, and why?',
    options: [
      { id: 'a', text: 'Edge computing, because it processes data locally with lower latency' },
      { id: 'b', text: 'Cloud computing, because it has more processing power available' },
      { id: 'c', text: 'Data analytics, because it can find patterns in the data' },
      { id: 'd', text: 'Wireless connectivity, because it carries the data quickly' },
    ],
    correct: 'a',
    distractors: {
      b: 'More power is useless if the answer arrives too late. Sending data to a remote server and waiting for a reply adds latency the situation cannot afford.',
      c: 'Analytics finds meaning in data over time. It is not what makes a split-second safety decision.',
      d: 'Connectivity carries data; it does not make decisions.',
    },
    explanation:
      'Edge computing **brings computational power closer to the data source, enabling real-time analysis and decision-making by processing data locally, reducing latency**. Safety-critical decisions are the textbook case for it.',
  },
  {
    id: 'q1-3-c',
    conceptId: 'c-iot-enablers',
    lessonId: 'l1-3',
    level: 2,
    type: 'multi',
    prompt: 'Which of these are named by the syllabus as technologies that enable IoT?',
    options: [
      { id: 'a', text: 'Wireless connectivity' },
      { id: 'b', text: 'Cloud computing' },
      { id: 'c', text: 'Blockchain' },
      { id: 'd', text: 'Edge computing' },
      { id: 'e', text: 'Security and privacy' },
      { id: 'f', text: 'Virtual reality' },
    ],
    correct: ['a', 'b', 'd', 'e'],
    explanation:
      'The six are wireless connectivity, sensors and actuators, cloud computing, edge computing, data analytics and machine learning, and security and privacy. Blockchain and virtual reality are not in this list.',
  },
  {
    id: 'q1-3-d',
    conceptId: 'c-iot-enablers',
    lessonId: 'l1-3',
    level: 2,
    type: 'multi',
    prompt: 'Security measures in IoT are there to ensure which three things?',
    options: [
      { id: 'a', text: 'Integrity' },
      { id: 'b', text: 'Confidentiality' },
      { id: 'c', text: 'Availability' },
      { id: 'd', text: 'Profitability' },
      { id: 'e', text: 'Portability' },
    ],
    correct: ['a', 'b', 'c'],
    explanation:
      'The syllabus states that encryption, authentication and access control protect devices, data and networks, **ensuring integrity, confidentiality and availability**.',
  },
  {
    id: 'q1-4-a',
    conceptId: 'c-iot-challenges',
    lessonId: 'l1-4',
    level: 1,
    type: 'truefalse',
    prompt:
      'One challenge of IoT is that faulty sensors or poor calibration can produce inaccurate data.',
    correct: true,
    explanation:
      'This is the fifth challenge in the syllabus. Inaccurate data affects decision-making and automation reliability, which is often worse than having no data, because the system acts confidently on something false.',
  },
  {
    id: 'q1-4-b',
    conceptId: 'c-iot-challenges',
    lessonId: 'l1-4',
    level: 3,
    type: 'mcq',
    prompt:
      'A weather monitoring device installed in a remote hill village works perfectly during testing in Colombo, but reports nothing for hours at a time once installed. Which challenge does this illustrate?',
    options: [
      { id: 'a', text: 'Dependence on continuous and reliable internet connections' },
      { id: 'b', text: 'High initial setup cost' },
      { id: 'c', text: 'Storing and processing massive amounts of data' },
      { id: 'd', text: 'Weak security measures' },
    ],
    correct: 'a',
    distractors: {
      b: 'Cost would have been a problem before installation, not a cause of intermittent reporting afterwards.',
      c: 'A single device reporting nothing is the opposite of a data volume problem.',
      d: 'Nothing here suggests an attack or unauthorised access.',
    },
    explanation:
      'The syllabus states that since IoT devices rely on continuous and reliable internet connections, **their performance can degrade or fail in areas with poor network coverage**.',
  },
  {
    id: 'q1-4-c',
    conceptId: 'c-iot-challenges',
    lessonId: 'l1-4',
    level: 2,
    type: 'blank',
    prompt:
      'IoT devices often collect ___ data, such as personal, health or location information, which makes weak security especially dangerous.',
    accept: ['sensitive'],
    placeholder: 'one word',
    explanation:
      'Sensitive. It is the combination of sensitive data and weak security measures that makes them vulnerable to hacking, data breaches and unauthorised access.',
  },

  /* ================================================================ M2 == */
  {
    id: 'q2-1-a',
    conceptId: 'c-embedded-def',
    lessonId: 'l2-1',
    level: 1,
    type: 'mcq',
    prompt: 'What is an embedded system?',
    options: [
      { id: 'a', text: 'A computer system designed to perform a specific task within a larger system' },
      { id: 'b', text: 'A computer that can run any program the user installs' },
      { id: 'c', text: 'Software that is built into a website' },
      { id: 'd', text: 'A network of connected devices sharing data' },
    ],
    correct: 'a',
    distractors: {
      b: 'That is a general-purpose computer, which is the opposite of an embedded system.',
      c: 'Embedded systems are hardware plus software in a physical device, not web software.',
      d: 'That is closer to the definition of IoT.',
    },
    explanation:
      'The full definition adds that it consists of both hardware and software components working together to carry out dedicated operations in real time.',
  },
  {
    id: 'q2-1-b',
    conceptId: 'c-ipo',
    lessonId: 'l2-1',
    level: 1,
    type: 'blank',
    prompt: 'An embedded system follows the ___, ___ and Output (IPO) model.',
    accept: ['input, process', 'input process', 'input and process', 'input,process'],
    placeholder: 'two words',
    explanation: 'Input, Process and Output. Sensors provide the input, the processor processes it according to a program, and outputs are produced.',
  },
  {
    id: 'q2-1-c',
    conceptId: 'c-ipo',
    lessonId: 'l2-1',
    level: 3,
    type: 'mcq',
    prompt:
      'In an automatic hand dryer, an IR sensor detects a hand, the controller decides to run the motor, and the motor blows air. Which is the Process stage?',
    options: [
      { id: 'a', text: 'The controller deciding to run the motor' },
      { id: 'b', text: 'The IR sensor detecting a hand' },
      { id: 'c', text: 'The motor blowing air' },
      { id: 'd', text: 'The hand being placed under the dryer' },
    ],
    correct: 'a',
    distractors: {
      b: 'A sensor capturing the state of the physical world is the Input stage.',
      c: 'The motor changing the world is the Output stage.',
      d: 'That is the event in the world, before the system is involved at all.',
    },
    explanation:
      'The processor **processes inputs according to a program and produces outputs**. Deciding what to do with the sensor reading is exactly the Process stage.',
  },
  {
    id: 'q2-2-a',
    conceptId: 'c-mcu-def',
    lessonId: 'l2-2',
    level: 1,
    type: 'multi',
    prompt: 'A microcontroller includes which of these on a single chip?',
    options: [
      { id: 'a', text: 'A processor' },
      { id: 'b', text: 'Memory' },
      { id: 'c', text: 'Input/output ports' },
      { id: 'd', text: 'A hard disk drive' },
      { id: 'e', text: 'A display screen' },
    ],
    correct: ['a', 'b', 'c'],
    explanation:
      'The definition is: **a small computer on a single circuit that includes a processor, memory, and input/output ports**. Those three, and nothing more, are what makes it a microcontroller.',
  },
  {
    id: 'q2-2-b',
    conceptId: 'c-mcu-examples',
    lessonId: 'l2-2',
    level: 1,
    type: 'mcq',
    prompt: 'Which microcontroller is described as the heart of the Arduino Uno?',
    options: [
      { id: 'a', text: 'ATmega328P' },
      { id: 'b', text: 'ATmega2560' },
      { id: 'c', text: 'ESP8266' },
      { id: 'd', text: 'Intel Core' },
    ],
    correct: 'a',
    distractors: {
      b: 'The ATmega2560 is on the Arduino Mega, which has significantly more I/O pins and memory.',
      c: 'The ESP8266 is a microcontroller with integrated Wi-Fi, popular for IoT projects.',
      d: 'Intel Core is a microprocessor, not a microcontroller.',
    },
    explanation:
      'The syllabus says the ATmega328P chip is the heart of the Arduino Uno, handling all the processing, input/output control and program execution.',
  },
  {
    id: 'q2-3-a',
    conceptId: 'c-mpu-def',
    lessonId: 'l2-3',
    level: 1,
    type: 'mcq',
    prompt: 'Which pair are microprocessors?',
    options: [
      { id: 'a', text: 'Intel Core and AMD Ryzen' },
      { id: 'b', text: 'Arduino and ESP32' },
      { id: 'c', text: 'ATmega328P and ATmega2560' },
      { id: 'd', text: 'Raspberry Pi and micro:bit' },
    ],
    correct: 'a',
    distractors: {
      b: 'Those are the microcontroller examples the comparison table gives, alongside AVR.',
      c: 'Both are microcontrollers, used on the Arduino Uno and Mega respectively.',
      d: 'These are development boards, not chips.',
    },
    explanation:
      'Intel Core and AMD Ryzen are the two microprocessor examples the syllabus gives in the comparison table.',
  },
  {
    id: 'q2-3-b',
    conceptId: 'c-mpu-def',
    lessonId: 'l2-3',
    level: 2,
    type: 'truefalse',
    prompt: 'A microprocessor has memory and input/output ports built into the same chip.',
    correct: false,
    probes: 'Mixing up the two definitions.',
    explanation:
      'That describes a **microcontroller**. In a microprocessor the CPU is separate from memory and peripherals: it needs external memory and external components for I/O.',
  },
  {
    id: 'q2-4-a',
    conceptId: 'c-mcu-vs-mpu',
    lessonId: 'l2-4',
    level: 1,
    type: 'mcq',
    prompt: 'According to the comparison table, which has lower power consumption and lower cost?',
    options: [
      { id: 'a', text: 'The microcontroller' },
      { id: 'b', text: 'The microprocessor' },
      { id: 'c', text: 'They are the same' },
      { id: 'd', text: 'It depends on the manufacturer' },
    ],
    correct: 'a',
    explanation:
      'The table gives the microcontroller low power consumption and low cost, against higher power consumption and high cost for the microprocessor. Both follow from having everything on one chip instead of several.',
  },
  {
    id: 'q2-4-b',
    conceptId: 'c-mcu-vs-mpu',
    lessonId: 'l2-4',
    level: 2,
    type: 'match',
    prompt: 'Match each aspect to the microcontroller side of the comparison table.',
    left: [
      { id: 'm1', text: 'Purpose' },
      { id: 'm2', text: 'Memory' },
      { id: 'm3', text: 'Complexity' },
      { id: 'm4', text: 'Examples' },
    ],
    right: [
      { id: 'r1', text: 'Specific control tasks in embedded systems' },
      { id: 'r2', text: 'Has built-in Flash/ROM and RAM' },
      { id: 'r3', text: 'Simple and task-specific' },
      { id: 'r4', text: 'Arduino, ESP32, AVR' },
    ],
    correct: { m1: 'r1', m2: 'r2', m3: 'r3', m4: 'r4' },
    explanation:
      'All four come straight from the table. Notice how each one is the consequence of everything being integrated on a single chip.',
  },
  {
    id: 'q2-4-c',
    conceptId: 'c-mcu-vs-mpu',
    lessonId: 'l2-4',
    level: 4,
    type: 'mcq',
    prompt:
      'An engineer designs a battery-powered smoke alarm that must run for ten years without a battery change and only ever does one job. Which chip, and what is the strongest reason?',
    options: [
      { id: 'a', text: 'A microcontroller, mainly because of its low power consumption' },
      { id: 'b', text: 'A microcontroller, mainly because it is more powerful' },
      { id: 'c', text: 'A microprocessor, because it is complex and powerful' },
      { id: 'd', text: 'A microprocessor, because it can be programmed' },
    ],
    correct: 'a',
    distractors: {
      b: 'A microcontroller is not the more powerful of the two. The table describes the microprocessor as complex and powerful.',
      c: 'Power is not what this design needs. A microprocessor would drain the battery in days and cost far more.',
      d: 'Both are programmable, so that is not a distinguishing reason.',
    },
    explanation:
      'Ten years on a battery makes power consumption the deciding property, and the table gives the microcontroller **low power consumption**. Its low cost and task-specific simplicity also fit a device that does one job.',
  },
  {
    id: 'q2-4-d',
    conceptId: 'c-mcu-vs-mpu',
    lessonId: 'l2-4',
    level: 2,
    type: 'blank',
    prompt:
      'In a microcontroller, the CPU, memory and I/O are built into ___ chip.',
    accept: ['one', 'a single', 'single', '1'],
    placeholder: 'one word',
    explanation:
      'One. That single fact of integration is what every other row of the comparison table follows from.',
  },

  /* ================================================================ M3 == */
  {
    id: 'q3-1-a',
    conceptId: 'c-devboard',
    lessonId: 'l3-1',
    level: 2,
    type: 'mcq',
    prompt: 'What is the difference between a development system and a development board?',
    options: [
      { id: 'a', text: 'The system includes both hardware and software tools; the board is mainly the hardware platform' },
      { id: 'b', text: 'The system is bigger than the board' },
      { id: 'c', text: 'The board includes software; the system is only hardware' },
      { id: 'd', text: 'They are two names for the same thing' },
    ],
    correct: 'a',
    distractors: {
      b: 'Physical size has nothing to do with it.',
      c: 'This is the right idea, backwards. The system is the one that includes software.',
      d: 'The syllabus prints a NOTE specifically to separate them.',
    },
    explanation:
      'A development system includes both hardware and software tools for designing and programming applications, while a development board is mainly the hardware platform used to build and test circuits.',
  },
  {
    id: 'q3-1-b',
    conceptId: 'c-devboard',
    lessonId: 'l3-1',
    level: 1,
    type: 'multi',
    prompt: 'A development board contains a microcontroller along with which essential components?',
    options: [
      { id: 'a', text: 'A power supply' },
      { id: 'b', text: 'Input/output interfaces' },
      { id: 'c', text: 'Clock circuits' },
      { id: 'd', text: 'A compiler' },
      { id: 'e', text: 'Sometimes communication ports or sensors' },
    ],
    correct: ['a', 'b', 'c', 'e'],
    explanation:
      'The compiler is software and lives on your computer as part of the development *system*, not on the board.',
  },
  {
    id: 'q3-2-a',
    conceptId: 'c-digital-pins',
    lessonId: 'l3-2',
    level: 1,
    type: 'mcq',
    prompt: 'On an Arduino Uno digital pin, HIGH and LOW correspond to which voltages?',
    options: [
      { id: 'a', text: 'HIGH = 5V, LOW = 0V' },
      { id: 'b', text: 'HIGH = 3.3V, LOW = 0V' },
      { id: 'c', text: 'HIGH = 12V, LOW = 5V' },
      { id: 'd', text: 'HIGH = 1V, LOW = 0V' },
    ],
    correct: 'a',
    distractors: {
      b: '3.3V is the logic level on some other boards, and the Uno does have a 3.3V power pin, but its digital HIGH is 5V.',
      c: '12V is the upper end of what the barrel jack accepts as an input, not a logic level.',
      d: 'HIGH and LOW are 5V and 0V; 1V would not be reliably read as either.',
    },
    explanation:
      'The syllabus states these two lines directly. Every digitalWrite() you write is choosing between exactly these two voltages.',
  },
  {
    id: 'q3-2-b',
    conceptId: 'c-analog-pins',
    lessonId: 'l3-2',
    level: 1,
    type: 'mcq',
    prompt: 'What range of values does analogRead() return on an Arduino Uno?',
    options: [
      { id: 'a', text: '0 to 1023' },
      { id: 'b', text: '0 to 255' },
      { id: 'c', text: '0 to 5' },
      { id: 'd', text: '0 to 1024' },
    ],
    correct: 'a',
    distractors: {
      b: '0 to 255 is the range for analogWrite (PWM), not analogRead.',
      c: '0 to 5 is the voltage range in volts, not the number returned.',
      d: 'There are 1024 possible values, but they are numbered 0 to 1023. The highest value is 1023.',
    },
    explanation:
      'The syllabus states that analogRead returns a value between 0 (dark) and 1023 (bright) when used with an LDR. The ADC is 10-bit, so 2¹⁰ = 1024 values, numbered from 0.',
  },
  {
    id: 'q3-2-c',
    conceptId: 'c-uno-support',
    lessonId: 'l3-2',
    level: 2,
    type: 'match',
    prompt: 'Match each part of the Arduino Uno to its function.',
    left: [
      { id: 'p1', text: 'Oscillator' },
      { id: 'p2', text: 'Reset button' },
      { id: 'p3', text: 'GND pin' },
      { id: 'p4', text: 'AREF pin' },
      { id: 'p5', text: 'IOREF pin' },
    ],
    right: [
      { id: 's1', text: 'Provides a clock signal so programs run at a steady speed' },
      { id: 's2', text: 'Restarts the microcontroller and runs the program from the beginning' },
      { id: 's3', text: 'Acts as the 0V reference point in a circuit' },
      { id: 's4', text: 'Provides an external reference voltage for the ADC' },
      { id: 's5', text: 'Provides the operating voltage reference for the input and output pins' },
    ],
    correct: { p1: 's1', p2: 's2', p3: 's3', p4: 's4', p5: 's5' },
    explanation:
      'AREF and IOREF are the pair students most often swap. AREF is for the **ADC**, improving analog reading accuracy. IOREF tells an add-on board what **voltage the I/O pins run at**.',
  },
  {
    id: 'q3-2-d',
    conceptId: 'c-uno-parts',
    lessonId: 'l3-2',
    level: 2,
    type: 'mcq',
    prompt: 'A message sent from the Arduino back to a phone over Bluetooth leaves the board through which pin?',
    options: [
      { id: 'a', text: 'TX' },
      { id: 'b', text: 'RX' },
      { id: 'c', text: 'AREF' },
      { id: 'd', text: 'IOREF' },
    ],
    correct: 'a',
    distractors: {
      b: 'RX is the receiver. The syllabus example uses RX for the ON command arriving *at* the Arduino.',
      c: 'AREF supplies a reference voltage for the ADC. It carries no data.',
      d: 'IOREF reports the operating voltage of the I/O pins. It carries no data.',
    },
    explanation:
      'TX transmits. The syllabus example: when the light turns on, the Arduino sends a confirmation message back to your phone through the TX pin.',
  },
  {
    id: 'q3-2-e',
    conceptId: 'c-digital-pins',
    lessonId: 'l3-2',
    level: 3,
    type: 'mcq',
    prompt:
      'You want to read how bright a room is, on a scale, rather than just whether the light is on. Which pin type and function?',
    options: [
      { id: 'a', text: 'An analog pin with analogRead()' },
      { id: 'b', text: 'A digital pin with digitalRead()' },
      { id: 'c', text: 'A digital pin with digitalWrite()' },
      { id: 'd', text: 'The IOREF pin' },
    ],
    correct: 'a',
    distractors: {
      b: 'digitalRead only ever returns HIGH or LOW. It cannot express a scale.',
      c: 'digitalWrite is an output function. You are reading, not writing.',
      d: 'IOREF is a reference voltage output, not an input you read sensors on.',
    },
    explanation:
      'A scale needs a range of values, so you need an analog pin and analogRead(), which converts the 0–5V input into a number from 0 to 1023 using the built-in ADC.',
  },
  {
    id: 'q3-3-a',
    conceptId: 'c-power',
    lessonId: 'l3-3',
    level: 1,
    type: 'mcq',
    prompt: 'What voltage range does the DC barrel jack usually accept?',
    options: [
      { id: 'a', text: '7 to 12 volts' },
      { id: 'b', text: '3 to 5 volts' },
      { id: 'c', text: '5 volts exactly' },
      { id: 'd', text: '12 to 24 volts' },
    ],
    correct: 'a',
    distractors: {
      c: '5V exactly is what the USB port supplies, not what the barrel jack expects.',
    },
    explanation:
      'The syllabus states usually 7 to 12 volts. The onboard voltage regulator then brings it down to the levels the microcontroller and other components need.',
  },
  {
    id: 'q3-3-b',
    conceptId: 'c-power',
    lessonId: 'l3-3',
    level: 2,
    type: 'multi',
    prompt: 'Which are valid ways to power an Arduino board according to the syllabus?',
    options: [
      { id: 'a', text: 'Through the USB port' },
      { id: 'b', text: 'Through the DC barrel jack' },
      { id: 'c', text: 'Through the Vin pin with GND as the negative' },
      { id: 'd', text: 'Through the AREF pin' },
      { id: 'e', text: 'Through a digital I/O pin' },
    ],
    correct: ['a', 'b', 'c'],
    explanation:
      'Three methods: USB, DC barrel jack and Vin. AREF is a reference input for the ADC, and digital pins are for signals, not for powering the board.',
  },
  {
    id: 'q3-3-c',
    conceptId: 'c-power',
    lessonId: 'l3-3',
    level: 2,
    type: 'blank',
    prompt:
      'The onboard voltage ___ regulates the input voltage to the levels required by the microcontroller.',
    accept: ['regulator'],
    placeholder: 'one word',
    explanation:
      'Regulator. It is what allows the same board to accept anything from 7 to 12 volts and still deliver a steady supply to the chip.',
  },
  {
    id: 'q3-4-a',
    conceptId: 'c-arduino-family',
    lessonId: 'l3-4',
    level: 1,
    type: 'mcq',
    prompt: 'Which Arduino board uses the ATmega2560 and has significantly more I/O pins and memory than the Uno?',
    options: [
      { id: 'a', text: 'Arduino Mega' },
      { id: 'b', text: 'Arduino Nano' },
      { id: 'c', text: 'Arduino Pro Mini' },
      { id: 'd', text: 'Arduino Due' },
    ],
    correct: 'a',
    distractors: {
      b: 'The Nano uses the ATmega328, is compact, and is for projects where space is limited.',
      c: 'The Pro Mini is the smallest board in the family.',
      d: 'The Due uses an Atmel SAM3X8E ARM Cortex-M3 CPU, not an ATmega2560.',
    },
    explanation:
      'The Mega is described as more powerful than the Uno, with the ATmega2560, significantly more digital and analog I/O pins, more memory and additional features.',
  },
  {
    id: 'q3-4-b',
    conceptId: 'c-other-boards',
    lessonId: 'l3-4',
    level: 3,
    type: 'mcq',
    prompt: 'Which of these is NOT strictly a microcontroller-based development board?',
    options: [
      { id: 'a', text: 'Raspberry Pi' },
      { id: 'b', text: 'Arduino Uno' },
      { id: 'c', text: 'ESP32' },
      { id: 'd', text: 'Magic Bit' },
    ],
    correct: 'a',
    distractors: {
      b: 'The Uno is built around the ATmega328P microcontroller.',
      c: 'The ESP32 is a microcontroller with integrated Wi-Fi.',
      d: 'Magic Bit is a Sri Lankan development board based on a microcontroller.',
    },
    explanation:
      'The syllabus says of the Raspberry Pi: "while not strictly a microcontroller-based board, Raspberry Pi boards are widely used for embedded projects due to their versatility and power". It is also the syllabus\'s example of edge computing.',
  },
  {
    id: 'q3-4-c',
    conceptId: 'c-sl-boards',
    lessonId: 'l3-4',
    level: 1,
    type: 'multi',
    prompt: 'Which development boards named in the syllabus are made in Sri Lanka?',
    options: [
      { id: 'a', text: 'Magic Bit' },
      { id: 'b', text: 'Gavesha platform' },
      { id: 'c', text: 'micro:bit' },
      { id: 'd', text: 'ESP8266' },
    ],
    correct: ['a', 'b'],
    explanation:
      'The syllabus notes that Sri Lanka is also creating development boards based on such microcontrollers, and names Magic Bit and the Gavesha platform. Magic Bit can be programmed using the Arduino IDE, MicroPython or MagicCode.',
  },
  {
    id: 'q3-4-d',
    conceptId: 'c-other-boards',
    lessonId: 'l3-4',
    level: 2,
    type: 'mcq',
    prompt: 'Which board is specifically designed for educational purposes and features a 5×5 LED matrix display?',
    options: [
      { id: 'a', text: 'micro:bit' },
      { id: 'b', text: 'Arduino Pro Mini' },
      { id: 'c', text: 'Raspberry Pi' },
      { id: 'd', text: 'ESP32' },
    ],
    correct: 'a',
    explanation:
      'The micro:bit is designed for educational purposes, to introduce children to programming and electronics, and its 5×5 LED matrix can display simple graphics, text and animations.',
  },

  /* ================================================================ M4 == */
  {
    id: 'q4-1-a',
    conceptId: 'c-breadboard',
    lessonId: 'l4-1',
    level: 1,
    type: 'mcq',
    prompt: 'What is the defining advantage of a breadboard?',
    options: [
      { id: 'a', text: 'Components can be connected without the need for soldering' },
      { id: 'b', text: 'It supplies power to the circuit' },
      { id: 'c', text: 'It stores the program' },
      { id: 'd', text: 'It converts analog signals to digital' },
    ],
    correct: 'a',
    distractors: {
      b: 'The power rails distribute power that comes from somewhere else. The breadboard generates nothing.',
      c: 'Programs are stored in the microcontroller\'s Flash memory.',
      d: 'That is the ADC, inside the microcontroller.',
    },
    explanation:
      'The definition is: a rectangular board with a grid of holes into which electronic components can be inserted and connected together **without the need for soldering**.',
  },
  {
    id: 'q4-1-b',
    conceptId: 'c-breadboard',
    lessonId: 'l4-1',
    level: 2,
    type: 'blank',
    prompt:
      'The two long rows of connected holes down each side of a breadboard, often coloured red and blue, are called the power ___.',
    accept: ['rails', 'rail'],
    placeholder: 'one word',
    explanation:
      'Rails. They exist so every component can take 5V and GND from beside it rather than running a separate wire back to the Arduino each time.',
  },
  {
    id: 'q4-2-a',
    conceptId: 'c-jumpers',
    lessonId: 'l4-2',
    level: 1,
    type: 'mcq',
    prompt: 'How many main types of jumper wire does the syllabus identify?',
    options: [
      { id: 'a', text: 'Three' },
      { id: 'b', text: 'Two' },
      { id: 'c', text: 'Four' },
      { id: 'd', text: 'Six' },
    ],
    correct: 'a',
    explanation:
      'Three: male-to-male, male-to-female and female-to-female. They are used to connect points on the breadboard, the breadboard to components, or two components together.',
  },
  {
    id: 'q4-3-a',
    conceptId: 'c-led',
    lessonId: 'l4-3',
    level: 1,
    type: 'blank',
    prompt: 'LED stands for Light ___ Diode.',
    accept: ['emitting'],
    placeholder: 'one word',
    explanation:
      'Light Emitting Diode. It is a semiconductor light source that emits light when current flows through it, and being a **diode** is why it only works one way round.',
  },
  {
    id: 'q4-3-b',
    conceptId: 'c-resistor',
    lessonId: 'l4-3',
    level: 2,
    type: 'mcq',
    prompt: 'Why does the blink circuit include a resistor of about 100 ohms?',
    options: [
      { id: 'a', text: 'To reduce the 5V voltage coming from the Arduino board so the LED is not damaged' },
      { id: 'b', text: 'To store energy for the LED' },
      { id: 'c', text: 'To convert the digital signal to analog' },
      { id: 'd', text: 'To make the LED brighter' },
    ],
    correct: 'a',
    distractors: {
      b: 'That is what a capacitor does, not a resistor.',
      c: 'Resistors do not convert signals.',
      d: 'It does the opposite. It limits the current, which limits the brightness. That is a price worth paying for an LED that survives.',
    },
    explanation:
      'The syllabus states: "a resistor of about 100 ohms is used to reduce the 5V voltage coming from the Arduino board". A resistor is designed to resist the flow of electric current, thereby controlling the voltage and current within the circuit.',
  },
  {
    id: 'q4-3-c',
    conceptId: 'c-resistor-types',
    lessonId: 'l4-3',
    level: 2,
    type: 'match',
    prompt: 'Match each type of resistor to its description.',
    left: [
      { id: 'k1', text: 'Fixed resistor' },
      { id: 'k2', text: 'Variable resistor' },
      { id: 'k3', text: 'LDR' },
    ],
    right: [
      { id: 'v1', text: 'The resistance value does not change' },
      { id: 'v2', text: 'Allows resistance to be adjusted manually' },
      { id: 'v3', text: 'Resistance varies significantly with the intensity of light falling on it' },
    ],
    correct: { k1: 'v1', k2: 'v2', k3: 'v3' },
    explanation:
      'The LDR is also known as a photoresistor, and it is used in practical application 3 to sense ambient light.',
  },
  {
    id: 'q4-3-d',
    conceptId: 'c-ldr',
    lessonId: 'l4-3',
    level: 2,
    type: 'blank',
    prompt: 'An LDR is also known as a ___.',
    accept: ['photoresistor', 'photo resistor', 'photo-resistor'],
    placeholder: 'one word',
    explanation:
      'Photoresistor. Both names describe the same thing: a resistor whose value depends on the light falling on it.',
  },
  {
    id: 'q4-4-a',
    conceptId: 'c-servo',
    lessonId: 'l4-4',
    level: 1,
    type: 'match',
    prompt: 'Match each servo motor wire to where it connects on the Arduino.',
    left: [
      { id: 'w1', text: 'Brown wire' },
      { id: 'w2', text: 'Red wire' },
      { id: 'w3', text: 'Orange wire' },
    ],
    right: [
      { id: 'c1', text: 'A ground (GND) pin' },
      { id: 'c2', text: 'The 5V pin, for power' },
      { id: 'c3', text: 'A PWM-enabled digital pin such as D6 or D9' },
    ],
    correct: { w1: 'c1', w2: 'c2', w3: 'c3' },
    explanation:
      'Two wires carry power (brown to ground, red to 5V) and only the orange control wire carries information: the angle you want.',
  },
  {
    id: 'q4-4-b',
    conceptId: 'c-buzzer',
    lessonId: 'l4-4',
    level: 1,
    type: 'mcq',
    prompt: 'What is a buzzer used for in an Arduino project?',
    options: [
      { id: 'a', text: 'To get an audio signal as an output' },
      { id: 'b', text: 'To detect sound as an input' },
      { id: 'c', text: 'To measure vibration' },
      { id: 'd', text: 'To provide precise angular movement' },
    ],
    correct: 'a',
    distractors: {
      b: 'Detecting sound is the noise sensor, which uses a microphone. A buzzer is an output.',
      c: 'That is the shock sensor.',
      d: 'That is the servo motor.',
    },
    explanation:
      'A buzzer is used to get an audio signal as an **output**. It is an actuator, not a sensor.',
  },

  /* ================================================================ M5 == */
  {
    id: 'q5-1-a',
    conceptId: 'c-digital-analog-sensor',
    lessonId: 'l5-1',
    level: 2,
    type: 'mcq',
    prompt:
      'A sensor answers a question that has only two possible answers. Which pin and function should you use?',
    options: [
      { id: 'a', text: 'A digital pin with digitalRead()' },
      { id: 'b', text: 'An analog pin with analogRead()' },
      { id: 'c', text: 'A digital pin with digitalWrite()' },
      { id: 'd', text: 'The AREF pin' },
    ],
    correct: 'a',
    distractors: {
      b: 'analogRead is for sensors giving a range of values, not a yes-or-no answer.',
      c: 'digitalWrite is an output. You are reading a sensor.',
      d: 'AREF supplies a reference voltage to the ADC; it is not a sensor input.',
    },
    explanation:
      'Two possible answers means two states, which is exactly what a digital pin and digitalRead() handle. HIGH or LOW, nothing in between.',
  },
  {
    id: 'q5-1-b',
    conceptId: 'c-sensor-principle',
    lessonId: 'l5-1',
    level: 2,
    type: 'truefalse',
    prompt: 'Every sensor ultimately works by producing a voltage the Arduino can measure.',
    correct: true,
    explanation:
      'The Arduino can only measure voltage on its pins. Whatever a sensor detects (heat, light, a magnet, sound), it must turn that into a voltage before the board can know anything about it.',
  },
  {
    id: 'q5-1-c',
    conceptId: 'c-sensor-principle',
    lessonId: 'l5-1',
    level: 1,
    type: 'multi',
    prompt: 'Which of these are actuators rather than sensors?',
    options: [
      { id: 'a', text: 'LED' },
      { id: 'b', text: 'Buzzer' },
      { id: 'c', text: 'Servo motor' },
      { id: 'd', text: 'LDR' },
      { id: 'e', text: 'PIR sensor' },
    ],
    correct: ['a', 'b', 'c'],
    explanation:
      'LEDs, buzzers and servos change the world, which makes them actuators (outputs). LDRs and PIR sensors measure the world, which makes them sensors (inputs).',
  },
  {
    id: 'q5-2-a',
    conceptId: 'c-ultrasonic',
    lessonId: 'l5-2',
    level: 2,
    type: 'order',
    prompt: 'Put the stages of an ultrasonic distance measurement in order.',
    items: [
      { id: 'u1', text: 'The transmitter emits a burst of ultrasonic sound waves' },
      { id: 'u2', text: 'The waves travel through the air until they meet an object' },
      { id: 'u3', text: 'The waves are reflected back to the sensor' },
      { id: 'u4', text: 'The receiver picks up the reflected waves' },
      { id: 'u5', text: 'The sensor measures the time taken for the round trip' },
      { id: 'u6', text: 'Using the speed of sound in air, the distance is calculated' },
    ],
    correct: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6'],
    explanation:
      'Six stages, exactly as the syllabus lays them out. Memorising this order gives you a complete "describe how it works" answer.',
  },
  {
    id: 'q5-2-b',
    conceptId: 'c-ultrasonic',
    lessonId: 'l5-2',
    level: 1,
    type: 'mcq',
    prompt: 'Ultrasonic sound is typically at a frequency above what value?',
    options: [
      { id: 'a', text: '20 kHz' },
      { id: 'b', text: '20 Hz' },
      { id: 'c', text: '200 kHz' },
      { id: 'd', text: '2 kHz' },
    ],
    correct: 'a',
    explanation:
      'Above 20 kHz, which is above the range of human hearing. That is what the "ultra" in ultrasonic means.',
  },
  {
    id: 'q5-2-c',
    conceptId: 'c-ir',
    lessonId: 'l5-2',
    level: 2,
    type: 'mcq',
    prompt: 'What are the two main parts of an IR sensor?',
    options: [
      { id: 'a', text: 'An IR LED as transmitter and a photodiode as receiver' },
      { id: 'b', text: 'A transmitter and a receiver of sound waves' },
      { id: 'c', text: 'A microphone and an amplifier' },
      { id: 'd', text: 'A reader and a tag' },
    ],
    correct: 'a',
    distractors: {
      b: 'That is the ultrasonic sensor, which uses sound rather than light.',
      c: 'That is the noise sensor.',
      d: 'That is the RFID system.',
    },
    explanation:
      'The IR sensor emits infrared light and detects its reflection from nearby objects, using an IR LED as the transmitter and a photodiode as the receiver.',
  },
  {
    id: 'q5-2-d',
    conceptId: 'c-pir',
    lessonId: 'l5-2',
    level: 3,
    type: 'mcq',
    prompt:
      'An automatic light using a PIR sensor switches off while someone is sitting very still at a desk. Why?',
    options: [
      { id: 'a', text: 'A PIR sensor detects the change in IR levels when a warm object moves, and a still person produces no change' },
      { id: 'b', text: 'The person is too far away for infrared to reach' },
      { id: 'c', text: 'PIR sensors only work in darkness' },
      { id: 'd', text: 'The sensor has run out of power' },
    ],
    correct: 'a',
    distractors: {
      b: 'Distance is not the issue here; the person is at a desk in the room.',
      c: 'PIR sensors work by sensing infrared radiation (heat), which is unrelated to visible light levels.',
      d: 'Nothing in the situation suggests a power problem, and the light was working a moment earlier.',
    },
    explanation:
      'The syllabus explains it exactly: **the PIR sensor detects the change in IR levels when a warm object, such as a human or animal, moves in front of it.** No movement means no change, so as far as the sensor is concerned, nobody is there.',
  },
  {
    id: 'q5-3-a',
    conceptId: 'c-gas-flame',
    lessonId: 'l5-3',
    level: 3,
    type: 'order',
    prompt: 'Put the stages of how a gas sensor works in the correct order.',
    items: [
      { id: 'g1', text: 'The target gas comes into contact with the sensor’s surface' },
      { id: 'g2', text: 'A chemical reaction occurs' },
      { id: 'g3', text: 'An electrical property such as resistance or voltage changes' },
      { id: 'g4', text: 'A microcontroller measures and interprets that change' },
    ],
    correct: ['g1', 'g2', 'g3', 'g4'],
    explanation:
      'Contact, reaction, electrical change, measurement. Naming all four stages gives a complete answer to "how does a gas sensor work".',
  },
  {
    id: 'q5-3-b',
    conceptId: 'c-temp-sensor',
    lessonId: 'l5-3',
    level: 2,
    type: 'mcq',
    prompt: 'What is the LM35 sensor\'s scale factor?',
    options: [
      { id: 'a', text: '10 mV per °C' },
      { id: 'b', text: '1 V per °C' },
      { id: 'c', text: '100 mV per °C' },
      { id: 'd', text: '5 mV per °C' },
    ],
    correct: 'a',
    distractors: {
      c: 'This is a tempting mix-up because the program multiplies by 100. That 100 is converting volts to degrees, which only works *because* the factor is 10 mV per degree.',
    },
    explanation:
      'For the LM35, the output voltage is linearly proportional to the Celsius temperature, with a scale factor of 10 mV per °C. Therefore multiplying the voltage by 100 gives the temperature in Celsius.',
  },
  {
    id: 'q5-3-c',
    conceptId: 'c-noise-colour',
    lessonId: 'l5-3',
    level: 2,
    type: 'mcq',
    prompt: 'Why does a noise sensor need an onboard amplifier?',
    options: [
      { id: 'a', text: 'The electrical signals from the microphone are weak and must be raised to a usable level' },
      { id: 'b', text: 'To make the sound louder for the user to hear' },
      { id: 'c', text: 'To convert the sound into a digital signal' },
      { id: 'd', text: 'To protect the Arduino from high voltage' },
    ],
    correct: 'a',
    distractors: {
      b: 'The amplifier works on the electrical signal inside the sensor, not on audible sound.',
      c: 'That conversion is done by the ADC in the Arduino, if an analog output is used.',
      d: 'A microphone signal is far too small to be a danger.',
    },
    explanation:
      'A microphone captures sound waves, which are variations in air pressure, and converts them into electrical signals. Those signals are weak and are amplified by an onboard amplifier to a usable level.',
  },
  {
    id: 'q5-4-a',
    conceptId: 'c-rfid',
    lessonId: 'l5-4',
    level: 1,
    type: 'mcq',
    prompt: 'What are the two main components of an RFID system?',
    options: [
      { id: 'a', text: 'An RFID reader and an RFID tag' },
      { id: 'b', text: 'A transmitter and a receiver of ultrasonic waves' },
      { id: 'c', text: 'An IR LED and a photodiode' },
      { id: 'd', text: 'A microphone and an amplifier' },
    ],
    correct: 'a',
    explanation:
      'The reader emits radio waves and receives signals back from the tags. The tag is a small, passive device that contains a unique identifier.',
  },
  {
    id: 'q5-4-b',
    conceptId: 'c-accelerometer',
    lessonId: 'l5-4',
    level: 1,
    type: 'mcq',
    prompt: 'Along how many axes does an accelerometer measure acceleration forces?',
    options: [
      { id: 'a', text: 'Three: X, Y and Z' },
      { id: 'b', text: 'Two: X and Y' },
      { id: 'c', text: 'One' },
      { id: 'd', text: 'Six' },
    ],
    correct: 'a',
    explanation:
      'Three axes, X, Y and Z. Measuring in three dimensions is what allows it to determine changes in both velocity and orientation.',
  },
  {
    id: 'q5-4-c',
    conceptId: 'c-biometric',
    lessonId: 'l5-4',
    level: 2,
    type: 'mcq',
    prompt: 'How does a fingerprint sensor work?',
    options: [
      { id: 'a', text: 'By capturing the unique patterns of ridges and valleys on a person’s fingertip' },
      { id: 'b', text: 'By measuring the temperature of the finger' },
      { id: 'c', text: 'By detecting the magnetic field of the finger' },
      { id: 'd', text: 'By measuring blood flow in the finger' },
    ],
    correct: 'a',
    distractors: {
      d: 'Measuring blood flow is how a pulse sensor works, using photoplethysmography (PPG).',
    },
    explanation:
      'It captures and recognises the unique patterns of ridges and valleys on a fingertip. Optical, capacitive and ultrasonic types all serve this same purpose of scanning and comparing fingerprints.',
  },

  /* ================================================================ M6 == */
  {
    id: 'q6-1-a',
    conceptId: 'c-compile-upload',
    lessonId: 'l6-1',
    level: 1,
    type: 'blank',
    prompt: 'A successful compile produces a binary file with a ___ extension.',
    accept: ['.hex', 'hex'],
    placeholder: 'a file extension',
    explanation:
      'A .hex file. It contains the machine code, meaning the binary instructions, specific to the Arduino microcontroller.',
  },
  {
    id: 'q6-1-b',
    conceptId: 'c-ide',
    lessonId: 'l6-1',
    level: 2,
    type: 'multi',
    prompt: 'The Arduino IDE provides a platform for which three activities?',
    options: [
      { id: 'a', text: 'Writing code' },
      { id: 'b', text: 'Compiling code' },
      { id: 'c', text: 'Uploading code to the board' },
      { id: 'd', text: 'Designing the circuit board layout' },
      { id: 'e', text: 'Manufacturing the microcontroller' },
    ],
    correct: ['a', 'b', 'c'],
    explanation:
      'Writing, compiling and uploading. All three belong in a definition of the Arduino IDE.',
  },
  {
    id: 'q6-1-c',
    conceptId: 'c-compile-upload',
    lessonId: 'l6-1',
    level: 3,
    type: 'truefalse',
    prompt: 'If your sketch has a syntax error, the faulty code is uploaded to the board and fails there.',
    correct: false,
    probes: 'Not realising that compilation happens entirely on the computer, before anything is sent.',
    explanation:
      'Compiling happens **before the program runs**, on your computer. If errors are found they are displayed in the message window at the bottom of the IDE, and nothing is sent to the board at all.',
  },
  {
    id: 'q6-2-a',
    conceptId: 'c-setup',
    lessonId: 'l6-2',
    level: 1,
    type: 'mcq',
    prompt: 'When does void setup() run?',
    options: [
      { id: 'a', text: 'Once, when the board is powered on or reset' },
      { id: 'b', text: 'Repeatedly, forever' },
      { id: 'c', text: 'Only when a sensor is triggered' },
      { id: 'd', text: 'After loop() has finished' },
    ],
    correct: 'a',
    distractors: {
      b: 'That is void loop().',
      d: 'loop() never finishes. It repeats until the board is powered off or reset.',
    },
    explanation:
      'setup() is used to initialise variables, pin modes and libraries, and is run once when the Arduino board is powered on or reset.',
  },
  {
    id: 'q6-2-b',
    conceptId: 'c-loop',
    lessonId: 'l6-2',
    level: 3,
    type: 'mcq',
    prompt:
      'A student puts digitalWrite(13, HIGH); delay(1000); digitalWrite(13, LOW); inside setup() and leaves loop() empty. What happens?',
    options: [
      { id: 'a', text: 'The LED comes on for one second, goes off, and stays off' },
      { id: 'b', text: 'The LED blinks on and off forever' },
      { id: 'c', text: 'The sketch does not compile' },
      { id: 'd', text: 'The LED stays on permanently' },
    ],
    correct: 'a',
    distractors: {
      b: 'Blinking forever would need the code in loop(), which is the part that repeats.',
      c: 'It compiles perfectly. It is valid code that simply does not do what was intended, which is the harder kind of mistake.',
      d: 'The final digitalWrite sets the pin LOW, so it ends up off.',
    },
    explanation:
      'setup() is **run once** when the board is powered on or reset. The sequence happens exactly one time, then loop() runs forever doing nothing. To repeat it, the code must be in loop().',
  },
  {
    id: 'q6-2-c',
    conceptId: 'c-loop',
    lessonId: 'l6-2',
    level: 2,
    type: 'blank',
    prompt: 'void loop() runs repeatedly until the board is powered off or ___.',
    accept: ['reset', 'restarted'],
    placeholder: 'one word',
    explanation:
      'Reset. The syllabus describes it as an endless loop until the board is powered off or reset.',
  },
  {
    id: 'q6-3-a',
    conceptId: 'c-syntax-rules',
    lessonId: 'l6-3',
    level: 1,
    type: 'truefalse',
    prompt: 'Arduino is a case sensitive language.',
    correct: true,
    explanation:
      'Yes, and it is stated directly in the syllabus NOTE. `digitalWrite` and `digitalwrite` are two different names, and only the first one exists.',
  },
  {
    id: 'q6-3-b',
    conceptId: 'c-syntax-rules',
    lessonId: 'l6-3',
    level: 2,
    type: 'mcq',
    prompt: 'Which of these lines contains an error?',
    options: [
      { id: 'a', text: 'pinMode(13, OUTPUT)' },
      { id: 'b', text: 'digitalWrite(13, HIGH);' },
      { id: 'c', text: 'int count = 0;' },
      { id: 'd', text: 'delay(1000);' },
    ],
    correct: 'a',
    distractors: {
      b: 'Correct capitalisation and a semicolon at the end.',
      c: 'A valid declaration: type, name, value, semicolon.',
      d: 'Correct.',
    },
    explanation:
      'The semicolon is missing. A semicolon is used at the end of each instruction. Note that the error would probably be reported on the *next* line, because the compiler keeps reading looking for the end of the instruction.',
  },
  {
    id: 'q6-3-c',
    conceptId: 'c-comments',
    lessonId: 'l6-3',
    level: 1,
    type: 'match',
    prompt: 'Match each comment style to its form.',
    left: [
      { id: 'cm1', text: 'Single-line comment' },
      { id: 'cm2', text: 'Multi-line comment' },
      { id: 'cm3', text: 'Braces' },
    ],
    right: [
      { id: 'cf1', text: 'Starts with //' },
      { id: 'cf2', text: 'Enclosed in /* */' },
      { id: 'cf3', text: 'Define the beginning and end of function bodies and control structures' },
    ],
    correct: { cm1: 'cf1', cm2: 'cf2', cm3: 'cf3' },
    explanation:
      'Comments are ignored entirely by the compiler. They exist to explain your code to whoever reads it next, including you in six months.',
  },
  {
    id: 'q6-4-a',
    conceptId: 'c-var-types',
    lessonId: 'l6-4',
    level: 2,
    type: 'match',
    prompt: 'Match each variable type to a value it can hold.',
    left: [
      { id: 'n1', text: 'int' },
      { id: 'n2', text: 'float' },
      { id: 'n3', text: 'char' },
      { id: 'n4', text: 'String' },
      { id: 'n5', text: 'boolean' },
    ],
    right: [
      { id: 'q1', text: '0' },
      { id: 'q2', text: '24.5' },
      { id: 'q3', text: "'A'" },
      { id: 'q4', text: '"Arduino"' },
      { id: 'q5', text: 'true' },
    ],
    correct: { n1: 'q1', n2: 'q2', n3: 'q3', n4: 'q4', n5: 'q5' },
    explanation:
      'These are exactly the five examples the syllabus gives, plus byte for whole numbers from 0 to 255. Note that char uses single quotes and String uses double quotes.',
  },
  {
    id: 'q6-4-b',
    conceptId: 'c-constants',
    lessonId: 'l6-4',
    level: 2,
    type: 'mcq',
    prompt: 'Which line correctly declares a constant?',
    options: [
      { id: 'a', text: 'const int ledPin1 = 10;' },
      { id: 'b', text: 'constant int ledPin1 = 10;' },
      { id: 'c', text: 'int const ledPin1 == 10;' },
      { id: 'd', text: 'const ledPin1 = 10;' },
    ],
    correct: 'a',
    distractors: {
      b: 'The keyword is `const`, not `constant`.',
      c: '`==` is a comparison, not an assignment. A declaration uses a single `=`.',
      d: 'The type is missing. The format is const type CONSTANT_NAME = value;',
    },
    explanation:
      'The syllabus gives the format as `const type CONSTANT_NAME = value;` with the examples `const int ledPin1 = 10;`, `const float distance = 70.5;` and `const String msg = "Hello";`.',
  },
  {
    id: 'q6-4-c',
    conceptId: 'c-var-types',
    lessonId: 'l6-4',
    level: 4,
    type: 'numeric',
    prompt: 'After the line `int result = 7 / 2;` runs, what value does result hold?',
    correct: 3,
    explanation:
      'An `int` cannot store a fractional part, so the .5 is discarded and result holds 3, not 3.5. This silent truncation is exactly why practical 4 declares `float voltage` and `float temperatureC`: with int, every temperature would come out wrong and no error would ever appear.',
  },
  {
    id: 'q6-4-d',
    conceptId: 'c-var-types',
    lessonId: 'l6-4',
    level: 1,
    type: 'mcq',
    prompt: 'What is the range of values a byte variable can hold?',
    options: [
      { id: 'a', text: '0 to 255' },
      { id: 'b', text: '0 to 1023' },
      { id: 'c', text: '−128 to 127' },
      { id: 'd', text: '0 to 100' },
    ],
    correct: 'a',
    distractors: {
      b: '0 to 1023 is the range analogRead() returns, not a byte.',
    },
    explanation:
      'The syllabus writes it beside the example: `byte pin = 13; // Byte variable (0-255)`.',
  },
  {
    id: 'q6-5-a',
    conceptId: 'c-comparison',
    lessonId: 'l6-5',
    level: 2,
    type: 'mcq',
    prompt: 'What is the difference between = and == in Arduino?',
    options: [
      { id: 'a', text: '= assigns a value; == compares two values' },
      { id: 'b', text: '= compares two values; == assigns a value' },
      { id: 'c', text: 'They mean the same thing' },
      { id: 'd', text: '== is only used with float variables' },
    ],
    correct: 'a',
    distractors: {
      b: 'This is the right idea, reversed. Remember: one sign puts something in, two signs ask a question.',
    },
    explanation:
      '`x = 5` means "put 5 into x". `x == 5` means "is x equal to 5?". Practical 5 uses `if (digitalRead(2) == LOW)` with two signs because it is asking a question.',
  },
  {
    id: 'q6-5-b',
    conceptId: 'c-if',
    lessonId: 'l6-5',
    level: 3,
    type: 'mcq',
    prompt:
      'Given `if (count > 10) { A } else if (count == 10) { B } else { C }`, which block runs when count is 10?',
    options: [
      { id: 'a', text: 'B only' },
      { id: 'b', text: 'A only' },
      { id: 'c', text: 'B and C' },
      { id: 'd', text: 'None of them' },
    ],
    correct: 'a',
    distractors: {
      b: '10 is not greater than 10, so the first condition is false.',
      c: 'Only one branch ever runs. Once B is chosen, the else is skipped entirely.',
      d: 'The else if is true, so B runs.',
    },
    explanation:
      '10 > 10 is false, so the first branch is skipped. 10 == 10 is true, so B runs, and the else is never reached. Only one branch of an if structure ever executes.',
  },
  {
    id: 'q6-5-c',
    conceptId: 'c-comparison',
    lessonId: 'l6-5',
    level: 3,
    type: 'truefalse',
    prompt:
      'In practical 3, `if (ldrValue < 200)`, an LDR reading of exactly 200 will switch the LED on.',
    correct: false,
    probes: 'Not reading boundary conditions carefully.',
    explanation:
      '`<` means strictly less than. 200 is not less than 200, so the condition is false and the else branch runs, leaving the LED off. It would need `<=` to include 200.',
  },
  {
    id: 'q6-6-a',
    conceptId: 'c-while',
    lessonId: 'l6-6',
    level: 2,
    type: 'mcq',
    prompt: 'What is the key difference between a while loop and a do-while loop?',
    options: [
      { id: 'a', text: 'A do-while loop always runs its block at least once; a while loop may run it zero times' },
      { id: 'b', text: 'A while loop is faster' },
      { id: 'c', text: 'A do-while loop can only count upwards' },
      { id: 'd', text: 'A while loop cannot use a counter' },
    ],
    correct: 'a',
    explanation:
      'A while loop tests its condition **before** the block runs, so a false condition means the block never runs. A do-while runs the block **first** and tests afterwards, so it always runs at least once.',
  },
  {
    id: 'q6-6-b',
    conceptId: 'c-for',
    lessonId: 'l6-6',
    level: 3,
    type: 'numeric',
    prompt: 'How many times does the block inside `for (int i = 0; i < 10; i++)` run?',
    correct: 10,
    explanation:
      'i starts at 0 and the loop continues while i is less than 10, so it runs for i = 0, 1, 2, 3, 4, 5, 6, 7, 8, 9. That is ten passes. Starting from 0 rather than 1 is why `< 10` gives ten repetitions and not nine.',
  },
  {
    id: 'q6-6-c',
    conceptId: 'c-for',
    lessonId: 'l6-6',
    level: 1,
    type: 'multi',
    prompt: 'Which loops does the Arduino language use for iteration, according to the syllabus?',
    options: [
      { id: 'a', text: 'for' },
      { id: 'b', text: 'while' },
      { id: 'c', text: 'do...while' },
      { id: 'd', text: 'repeat...until' },
      { id: 'e', text: 'foreach' },
    ],
    correct: ['a', 'b', 'c'],
    explanation:
      'Three loops: for, while and do...while. repeat...until and foreach belong to other languages.',
  },

  /* ================================================================ M7 == */
  {
    id: 'q7-1-a',
    conceptId: 'c-delay',
    lessonId: 'l7-1',
    level: 1,
    type: 'numeric',
    prompt: 'How many milliseconds are there in one second, as used by delay()?',
    correct: 1000,
    unit: 'ms',
    explanation:
      'delay() pauses the program for the amount of time specified in milliseconds, and 1000 milliseconds is equal to 1 second.',
  },
  {
    id: 'q7-1-b',
    conceptId: 'c-blink-code',
    lessonId: 'l7-1',
    level: 2,
    type: 'mcq',
    prompt: 'What does pinMode(13, OUTPUT) do?',
    options: [
      { id: 'a', text: 'Configures pin 13 to behave as an output, so it can provide voltage to a component like an LED' },
      { id: 'b', text: 'Sets pin 13 to 5 volts' },
      { id: 'c', text: 'Reads the current state of pin 13' },
      { id: 'd', text: 'Connects pin 13 to ground' },
    ],
    correct: 'a',
    distractors: {
      b: 'That is digitalWrite(13, HIGH). pinMode only decides the pin\'s *role*, not its voltage.',
      c: 'That is digitalRead(13).',
      d: 'pinMode makes no electrical connection to ground.',
    },
    explanation:
      'pinMode() configures the specified pin to behave either as an input or an output. OUTPUT means it can provide voltage to an external component such as an LED.',
  },
  {
    id: 'q7-1-c',
    conceptId: 'c-blink-code',
    lessonId: 'l7-1',
    level: 4,
    type: 'numeric',
    prompt:
      'In the blink sketch, both delays are changed to delay(250). How many complete on-off cycles will the LED make in one second?',
    correct: 2,
    explanation:
      'One full cycle is on for 250 ms plus off for 250 ms, which is 500 ms. In 1000 ms there is room for two complete cycles. Halving the delay doubles the blink rate.',
  },
  {
    id: 'q7-2-a',
    conceptId: 'c-analogread',
    lessonId: 'l7-2',
    level: 1,
    type: 'mcq',
    prompt: 'In the LDR practical, what does a low analogRead value indicate?',
    options: [
      { id: 'a', text: 'A dark environment' },
      { id: 'b', text: 'A bright environment' },
      { id: 'c', text: 'A broken sensor' },
      { id: 'd', text: 'A high temperature' },
    ],
    correct: 'a',
    distractors: {
      b: 'Bright gives a high value, up towards 1023.',
    },
    explanation:
      'The syllabus states the function returns a value between **0 (dark) and 1023 (bright)**. That is why the program switches the LED on when the reading is *below* the threshold.',
  },
  {
    id: 'q7-2-b',
    conceptId: 'c-ldr-circuit',
    lessonId: 'l7-2',
    level: 3,
    type: 'mcq',
    prompt: 'Why is a resistor of about 10 kilo ohms used in the LDR circuit?',
    options: [
      { id: 'a', text: 'To control the sensitivity of the LDR' },
      { id: 'b', text: 'To protect the LDR from burning out' },
      { id: 'c', text: 'To convert the analog signal to digital' },
      { id: 'd', text: 'To reduce the brightness of the LED' },
    ],
    correct: 'a',
    distractors: {
      b: 'That is what the ~100 Ω resistor does for the LED. The two resistors in this circuit have different jobs.',
      c: 'The ADC inside the Arduino does that conversion.',
      d: 'The LED has its own separate resistor.',
    },
    explanation:
      'The syllabus states it directly: "here a resistor (about 10 kilo ohm) is applied to control the sensitivity of the LDR". It forms a voltage divider with the LDR, which is what turns a changing resistance into a changing voltage.',
  },
  {
    id: 'q7-2-c',
    conceptId: 'c-threshold',
    lessonId: 'l7-2',
    level: 2,
    type: 'truefalse',
    prompt: 'The threshold value of 200 in the LDR practical can be adjusted to suit different lighting conditions.',
    correct: true,
    explanation:
      'The syllabus says exactly this. analogRead gives a number, not a real-world unit, so the right threshold depends on your LDR, your resistor and your room. You find it by testing.',
  },
  {
    id: 'q7-2-d',
    conceptId: 'c-ldr-circuit',
    lessonId: 'l7-2',
    level: 2,
    type: 'mcq',
    prompt: 'Why does the LDR sketch include delay(100)?',
    options: [
      { id: 'a', text: 'For stability, so the Arduino does not read the LDR too quickly, and to give time for the LED state to be visible' },
      { id: 'b', text: 'To make the LED blink' },
      { id: 'c', text: 'Because analogRead requires a delay before it works' },
      { id: 'd', text: 'To save battery power' },
    ],
    correct: 'a',
    distractors: {
      b: 'The LED here does not blink; it follows the light level.',
      c: 'analogRead needs no such delay to function.',
    },
    explanation:
      'The syllabus gives both reasons: it ensures the Arduino does not read the LDR value too quickly, and it provides time for the LED state to be visible.',
  },
  {
    id: 'q7-3-a',
    conceptId: 'c-temp-conversion',
    lessonId: 'l7-3',
    level: 3,
    type: 'mcq',
    prompt: 'What does the line `float voltage = tempRead * (5.0 / 1023.0);` do?',
    options: [
      { id: 'a', text: 'Converts the analog reading to a voltage, scaling from the 0–1023 range to the 0–5V range' },
      { id: 'b', text: 'Converts the voltage to degrees Celsius' },
      { id: 'c', text: 'Reads the value from the sensor' },
      { id: 'd', text: 'Compares the temperature to the threshold' },
    ],
    correct: 'a',
    distractors: {
      b: 'That is the next line: `float temperatureC = voltage * 100;`',
      c: 'That is `int tempRead = analogRead(A0);`',
      d: 'That is `if (temperatureC >= temp)`',
    },
    explanation:
      'The syllabus explains it as: the formula 5.0 / 1023.0 scales the reading from a range of 0–1023 to a range of 0–5V. It undoes what the ADC did.',
  },
  {
    id: 'q7-3-b',
    conceptId: 'c-temp-conversion',
    lessonId: 'l7-3',
    level: 4,
    type: 'numeric',
    prompt:
      'An LM35 outputs 0.28 V. What temperature is this in °C?',
    correct: 28,
    unit: '°C',
    tolerance: 0.5,
    explanation:
      'The LM35 gives 10 mV per °C, so multiply the voltage by 100: 0.28 × 100 = 28 °C. This is exactly what the line `float temperatureC = voltage * 100;` does.',
  },
  {
    id: 'q7-3-c',
    conceptId: 'c-relay',
    lessonId: 'l7-3',
    level: 3,
    type: 'mcq',
    prompt: 'The syllabus notes that a 230V fan can be operated in this circuit. How?',
    options: [
      { id: 'a', text: 'By connecting a relay instead of the motor' },
      { id: 'b', text: 'By connecting the fan directly to a digital pin' },
      { id: 'c', text: 'By using the Vin pin to supply 230V' },
      { id: 'd', text: 'By using analogWrite instead of digitalWrite' },
    ],
    correct: 'a',
    distractors: {
      b: 'A digital pin supplies 5V and a very small current. Connecting mains to it would destroy the board.',
      c: 'Vin is an input for 7–12V, not a way to supply mains voltage.',
      d: 'Changing the function does not change how much power the pin can deliver.',
    },
    explanation:
      'The syllabus says: "a 230V fan can be operated by connecting a relay instead of the motor". A relay is an electrically operated switch: the small 5V signal operates the relay, and the relay switches the separate 230V circuit.',
  },
  {
    id: 'q7-3-d',
    conceptId: 'c-lm35-circuit',
    lessonId: 'l7-3',
    level: 2,
    type: 'match',
    prompt: 'Match each LM35 terminal to where it connects.',
    left: [
      { id: 'h1', text: 'VIN' },
      { id: 'h2', text: 'VOUT' },
      { id: 'h3', text: 'GND' },
    ],
    right: [
      { id: 'j1', text: 'The 5V pin of the Arduino board' },
      { id: 'j2', text: 'An analog pin' },
      { id: 'j3', text: 'A GND pin of the Arduino board' },
    ],
    correct: { h1: 'j1', h2: 'j2', h3: 'j3' },
    explanation:
      'VOUT must go to an analog pin because the sensor produces a varying voltage, not an on/off signal.',
  },
  {
    id: 'q7-4-a',
    conceptId: 'c-pullup',
    lessonId: 'l7-4',
    level: 2,
    type: 'mcq',
    prompt: 'What does INPUT_PULLUP do?',
    options: [
      { id: 'a', text: 'Ensures the pin reads HIGH when it is not connected to anything' },
      { id: 'b', text: 'Ensures the pin reads LOW when it is not connected to anything' },
      { id: 'c', text: 'Makes the pin an output' },
      { id: 'd', text: 'Increases the voltage on the pin to 12V' },
    ],
    correct: 'a',
    distractors: {
      b: 'That would be a pull-*down*, which is the opposite arrangement.',
      c: 'It is a mode of INPUT, so the pin is being read, not driven.',
      d: 'Arduino pins never go above 5V.',
    },
    explanation:
      'The syllabus states: "the pull-up resistor ensures that the pin reads HIGH when it is not connected to anything. When connected to ground, through a button press for instance, it will read LOW."',
  },
  {
    id: 'q7-4-b',
    conceptId: 'c-reed-circuit',
    lessonId: 'l7-4',
    level: 3,
    type: 'mcq',
    prompt:
      'With INPUT_PULLUP and a reed switch wired between pin 2 and GND, what does digitalRead(2) return when the switch closes?',
    options: [
      { id: 'a', text: 'LOW' },
      { id: 'b', text: 'HIGH' },
      { id: 'c', text: 'A number between 0 and 1023' },
      { id: 'd', text: 'Nothing, the pin floats' },
    ],
    correct: 'a',
    distractors: {
      b: 'HIGH is what it reads when the switch is *open* and the pull-up is holding it up.',
      c: 'digitalRead only ever returns HIGH or LOW. Numbers 0–1023 come from analogRead.',
      d: 'The pull-up exists precisely to stop the pin floating.',
    },
    explanation:
      'Closing the switch connects the pin directly to ground, which overrides the weak internal pull-up. The pin goes to 0V and reads LOW. That is why the program tests `if (digitalRead(2) == LOW)`.',
  },
  {
    id: 'q7-4-c',
    conceptId: 'c-pullup',
    lessonId: 'l7-4',
    level: 4,
    type: 'mcq',
    prompt:
      'A student uses pinMode(2, INPUT) instead of INPUT_PULLUP and the LED flickers randomly. What is the cause?',
    options: [
      { id: 'a', text: 'With nothing connected, the pin floats and picks up electrical noise, so digitalRead returns random values' },
      { id: 'b', text: 'The LED resistor is the wrong value' },
      { id: 'c', text: 'The reed switch is faulty' },
      { id: 'd', text: 'The loop() function runs too fast' },
    ],
    correct: 'a',
    distractors: {
      b: 'A wrong resistor would change the brightness, not cause random switching.',
      c: 'The switch is fine; the problem is what the pin does when the switch is *open*.',
      d: 'Speed alone would not produce random values; the readings themselves are unreliable.',
    },
    explanation:
      'An input pin with nothing connected is neither at 0V nor 5V. It floats, picking up noise, so digitalRead returns HIGH and LOW unpredictably. INPUT_PULLUP holds it firmly at HIGH until the switch pulls it to ground.',
  },
  {
    id: 'q7-5-a',
    conceptId: 'c-projects',
    lessonId: 'l7-5',
    level: 2,
    type: 'match',
    prompt: 'Match each project to the sensor the syllabus says it uses.',
    left: [
      { id: 'pr1', text: 'Line following car' },
      { id: 'pr2', text: 'Obstacle avoiding car' },
      { id: 'pr3', text: 'Self-balancing robot' },
    ],
    right: [
      { id: 'se1', text: 'IR sensors, to identify the path' },
      { id: 'se2', text: 'Ultrasonic sensors, to detect obstacles' },
      { id: 'se3', text: 'Sensors to detect its orientation' },
    ],
    correct: { pr1: 'se1', pr2: 'se2', pr3: 'se3' },
    explanation:
      'The first two are the attributions the syllabus states outright, and they are the pair most often swapped. Line following uses IR; obstacle avoiding uses ultrasonic.',
  },
  {
    id: 'q7-5-b',
    conceptId: 'c-projects',
    lessonId: 'l7-5',
    level: 1,
    type: 'blank',
    prompt: 'CNC stands for Computer ___ Control.',
    accept: ['numerical', 'numeric'],
    placeholder: 'one word',
    explanation:
      'Computer Numerical Control, meaning the machine\'s movements are controlled by a computer program.',
  },

  /* ------------------------------------------- concepts added for cover -- */
  /* Every concept must have at least one question, or it can never leave the
     review queue: the queue would keep offering it with nothing to ask. */
  {
    id: 'q4-1-c',
    conceptId: 'c-blink-circuit',
    lessonId: 'l7-1',
    level: 2,
    type: 'mcq',
    prompt:
      'In the blink circuit, where does the negative terminal of the LED connect?',
    options: [
      { id: 'a', text: 'To a GND pin' },
      { id: 'b', text: 'To the 5V pin' },
      { id: 'c', text: 'To another digital pin' },
      { id: 'd', text: 'To the Vin pin' },
    ],
    correct: 'a',
    distractors: {
      b: 'That would put 5V on both sides of the LED, so no current would flow through it at all.',
      c: 'The circuit needs a return path to ground, not a second output.',
      d: 'Vin is a power input for the board, not a return path.',
    },
    explanation:
      'The syllabus states it for every practical: the positive terminal connects to a digital pin **through a resistor**, and the negative terminal to a **GND** pin. GND is the 0V reference that completes the electrical path.',
  },
  {
    id: 'q5-2-e',
    conceptId: 'c-reed',
    lessonId: 'l5-2',
    level: 1,
    type: 'mcq',
    prompt: 'What does a magnetic or reed sensor detect?',
    options: [
      { id: 'a', text: 'The presence or absence of a magnetic field' },
      { id: 'b', text: 'The presence of infrared light' },
      { id: 'c', text: 'Sudden impacts or vibrations' },
      { id: 'd', text: 'The orientation or tilt of an object' },
    ],
    correct: 'a',
    distractors: {
      b: 'That is the IR sensor, or the flame sensor.',
      c: 'That is the shock sensor.',
      d: 'That is the tilt sensor.',
    },
    explanation:
      'Reed sensors are commonly used for door and window sensors in security systems, proximity sensing and automation projects. Practical application 5 uses one to detect a door opening and closing.',
  },
  {
    id: 'q5-2-f',
    conceptId: 'c-contact-sensors',
    lessonId: 'l5-2',
    level: 2,
    type: 'match',
    prompt: 'Match each sensor to what it detects.',
    left: [
      { id: 'ct1', text: 'Touch sensor' },
      { id: 'ct2', text: 'Shock sensor' },
      { id: 'ct3', text: 'Tilt sensor' },
    ],
    right: [
      { id: 'cd1', text: 'Touch or proximity, for touch-sensitive buttons' },
      { id: 'cd2', text: 'Sudden impacts or vibrations' },
      { id: 'cd3', text: 'The orientation of an object: level, tilted or moved' },
    ],
    correct: { ct1: 'cd1', ct2: 'cd2', ct3: 'cd3' },
    explanation:
      'All three answer a yes-or-no question about the immediate surroundings, so all three go to a digital pin.',
  },
  {
    id: 'q5-3-d',
    conceptId: 'c-soil-rain',
    lessonId: 'l5-3',
    level: 3,
    type: 'mcq',
    prompt:
      'A greenhouse needs to know both whether the plants need watering and whether the air is too damp. Which two sensors does it need?',
    options: [
      { id: 'a', text: 'A soil sensor and a humidity sensor' },
      { id: 'b', text: 'A soil sensor and a rain sensor' },
      { id: 'c', text: 'A humidity sensor and a barometer sensor' },
      { id: 'd', text: 'A rain sensor and a temperature sensor' },
    ],
    correct: 'a',
    distractors: {
      b: 'A rain sensor detects rainfall, which is not much use inside a greenhouse.',
      c: 'A barometer measures atmospheric pressure, not soil moisture.',
      d: 'Neither of these answers the question about the soil.',
    },
    explanation:
      'The **soil sensor** measures moisture in the **soil**, so it answers "do the plants need water". The **humidity sensor** measures moisture in the **air**, and greenhouse monitoring is one of the uses the syllabus names for it.',
  },
  {
    id: 'q6-3-d',
    conceptId: 'c-braces',
    lessonId: 'l6-3',
    level: 2,
    type: 'mcq',
    prompt: 'What are braces { } used for in Arduino?',
    options: [
      { id: 'a', text: 'To define the beginning and end of function bodies and control structures' },
      { id: 'b', text: 'To mark the end of each instruction' },
      { id: 'c', text: 'To write a comment' },
      { id: 'd', text: 'To declare a variable' },
    ],
    correct: 'a',
    distractors: {
      b: 'That is the semicolon.',
      c: 'Comments use // or /* */.',
      d: 'A declaration needs a type and a name, not braces.',
    },
    explanation:
      'Every `{` must eventually be matched by a `}`. When one is missing, the compiler reads to the end of the file still waiting for it, and reports the error there rather than where the mistake actually is.',
  },
  {
    id: 'q6-4-e',
    conceptId: 'c-variables',
    lessonId: 'l6-4',
    level: 1,
    type: 'multi',
    prompt: 'When you create a variable in Arduino, what must be declared?',
    options: [
      { id: 'a', text: 'Its type' },
      { id: 'b', text: 'Its name' },
      { id: 'c', text: 'The pin it will be used with' },
      { id: 'd', text: 'How much memory it needs in bytes' },
    ],
    correct: ['a', 'b'],
    explanation:
      'The syllabus states it directly: when creating a variable, **both its type and the name of the variable must be declared**. The type is what tells the board how much memory to set aside, so you never state that yourself.',
  },
]
