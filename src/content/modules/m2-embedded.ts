import type { Module } from '@/types/content'

/* Module 2 — Embedded systems, microcontrollers and microprocessors.
   Source: syllabus pages 7–8, including the eight-row comparison table which is
   reproduced exactly. */

export const m2: Module = {
  id: 'm2',
  number: 2,
  title: 'Embedded Systems',
  wire: 'green',
  blurb:
    'The small computers hidden inside ordinary objects. What an embedded system is, what a microcontroller is, and the comparison table examiners keep asking for.',
  outcomes: [
    'Define an embedded system and describe the IPO model it follows',
    'Define a microcontroller and a microprocessor',
    'Reproduce the eight-row microcontroller vs microprocessor comparison',
    'Decide which of the two suits a given job',
  ],
  lessons: [
    /* ------------------------------------------------------------ 2.1 -- */
    {
      id: 'l2-1',
      moduleId: 'm2',
      number: 1,
      title: 'What an embedded system is',
      blurb: 'A computer that does one job, inside something that is not a computer.',
      minutes: 12,
      why: 'Every Arduino project you will build for the rest of this course is an embedded system. Getting the definition and the IPO model right now means the practical work later has a name you can attach it to.',
      objectives: [
        'Define an embedded system',
        'Explain that it consists of both hardware and software',
        'Describe the Input, Process, Output model with an example',
      ],
      concepts: [
        { id: 'c-embedded-def', title: 'Definition of an embedded system' },
        { id: 'c-ipo', title: 'The IPO model' },
      ],
      keyTerms: ['t-embedded', 't-ipo', 't-realtime'],
      blocks: [
        {
          id: 'b1',
          kind: 'prose',
          tone: 'lead',
          text: 'A washing machine has a computer in it. So does a microwave, a digital watch, a traffic light, a printer, a car and a rice cooker. None of them look like computers, and none of them can do anything except their one job. That is exactly the point.',
        },
        {
          id: 'b2',
          kind: 'definition',
          term: 'Embedded system',
          simple: 'A small computer built into a machine to do one specific job.',
          technical:
            'A computer system designed to perform a specific task within a larger system. It consists of both hardware and software components that work together to carry out dedicated operations in real time.',
          provenance: 'syllabus',
          example:
            'The controller inside a washing machine: it reads the dial and the water level, decides what to do, and drives the motor and the valve. It cannot browse the internet, and it never needs to.',
        },
        {
          id: 'b3',
          kind: 'callout',
          variant: 'exam',
          title: 'Three things must be in your definition',
          text: 'A full answer names all three: it is a **computer system**, it performs a **specific task within a larger system**, and it uses **both hardware and software** working together **in real time**. Students routinely lose the "within a larger system" mark, which is the phrase that distinguishes an embedded system from an ordinary computer.',
        },
        {
          id: 'b4',
          kind: 'analogy',
          title: 'The bus conductor',
          analogy:
            'A bus conductor has one job on one bus: take fares, give tickets, ring the bell. He is very good at it and needs no training in anything else. He is part of the bus operation, not a separate business. Now compare him to a general manager at the depot, who can be asked to do anything at all.',
          mapping: [
            { from: 'The conductor', to: 'The embedded system' },
            { from: 'The bus', to: 'The larger system it sits inside' },
            { from: 'One job, done immediately, every time', to: 'A dedicated operation in real time' },
            { from: 'The general manager', to: 'A general-purpose computer' },
          ],
          limits:
            'A conductor could learn another job. An embedded system usually cannot: its program is fixed when the product is made.',
        },
        {
          id: 'b5',
          kind: 'prose',
          heading: 'The IPO model',
          text: 'Every [[t-embedded|embedded system]] follows the same three-stage shape, and the syllabus states it directly: an embedded system **follows the Input, Process and Output (IPO) model**.\n\nSensors capture the state of the physical world, such as heat, speed and light, as **inputs**. The processor **processes** them according to a program. That produces **outputs**.',
        },
        {
          id: 'b6',
          kind: 'figure',
          figure: 'IpoFigure',
          caption:
            'The IPO model, running live. Change the input and watch the process rule decide the output.',
          altSummary:
            'Three stages connected by arrows: Input, where a sensor reads a temperature; Process, where the program compares that reading against a threshold; and Output, where a fan is switched on or off. Changing the input temperature changes which branch the process takes and therefore the output.',
        },
        {
          id: 'b7',
          kind: 'callout',
          variant: 'misconception',
          title: 'IPO is not the same as fetch-decode-execute',
          text: 'They sound similar and they are not. **IPO** describes the shape of a whole system: information comes in, gets worked on, and something comes out. **Fetch-decode-execute** describes what a processor does with a single instruction, thousands of times a second. IPO is the building; fetch-decode-execute is one brick being laid.',
        },
        {
          id: 'b8',
          kind: 'sort',
          prompt: 'Sort each item into the stage of the IPO model it belongs to.',
          buckets: [
            { id: 'in', label: 'Input' },
            { id: 'proc', label: 'Process' },
            { id: 'out', label: 'Output' },
          ],
          items: [
            {
              id: 'i1',
              label: 'A temperature sensor reads 31°C',
              bucket: 'in',
              why: 'A sensor capturing the state of the physical world is the classic input stage.',
            },
            {
              id: 'i2',
              label: 'The program checks whether 31 is greater than 25',
              bucket: 'proc',
              why: 'The processor working on the reading according to the program is the process stage.',
            },
            {
              id: 'i3',
              label: 'The fan motor switches on',
              bucket: 'out',
              why: 'Something changes in the physical world. That is the output stage, driven by an actuator.',
            },
            {
              id: 'i4',
              label: 'A button is pressed',
              bucket: 'in',
              why: 'A button is an input device: it tells the system something about the world.',
            },
            {
              id: 'i5',
              label: 'An LED lights up',
              bucket: 'out',
              why: 'The LED is an output. The system is telling the world something.',
            },
            {
              id: 'i6',
              label: 'The reading is converted from volts to degrees Celsius',
              bucket: 'proc',
              why: 'Arithmetic on the reading happens in the processor. This exact conversion appears in practical 4.',
            },
          ],
        },
        {
          id: 'b9',
          kind: 'recall',
          prompt: 'Write out the definition of an embedded system from memory.',
          answer:
            'A computer system designed to perform a specific task within a larger system. It consists of both hardware and software components that work together to carry out dedicated operations in real time. It follows the Input, Process and Output (IPO) model.',
          hint: 'Specific task · larger system · hardware and software · real time.',
        },
        {
          id: 'b10',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q2-1-a', 'q2-1-b', 'q2-1-c'],
        },
      ],
      summary: [
        'An embedded system is a computer system designed to perform a specific task within a larger system.',
        'It consists of both hardware and software working together to carry out dedicated operations in real time.',
        'It follows the Input, Process, Output (IPO) model.',
        'Sensors capture the state of the physical world as inputs; the processor processes them according to a program and produces outputs.',
      ],
      examTip:
        'If a question gives you a device and asks you to identify the IPO stages, answer with the actual components, not the words. "Input: the LDR. Process: the Arduino comparing the reading to 200. Output: the LED." That earns the marks; "input, process, output" does not.',
      confused: {
        simpler:
          'An embedded system is just a tiny computer that lives inside a machine and only knows how to do that machine\'s job. Your rice cooker has one. It knows about rice and nothing else.',
        analogy:
          'A calculator watch. It is a computer, but it lives inside a watch and does watch things. It is embedded in the watch.',
      },
    },

    /* ------------------------------------------------------------ 2.2 -- */
    {
      id: 'l2-2',
      moduleId: 'm2',
      number: 2,
      title: 'Microcontrollers',
      blurb: 'A whole computer on a single chip. The part that runs every Arduino.',
      minutes: 12,
      why: 'The chip on the Arduino Uno you will use for the rest of this course is a microcontroller called the ATmega328P. Knowing what that phrase means turns the board from a mystery into something you can reason about.',
      prerequisites: ['l2-1'],
      objectives: [
        'Define a microcontroller',
        'Name the three things built into a microcontroller',
        'Name the widely used microcontrollers the syllabus lists',
      ],
      concepts: [
        { id: 'c-mcu-def', title: 'Definition of a microcontroller' },
        { id: 'c-mcu-examples', title: 'Common microcontrollers' },
      ],
      keyTerms: ['t-microcontroller', 't-atmega328p', 't-flash', 't-io-port'],
      blocks: [
        {
          id: 'b1',
          kind: 'prose',
          tone: 'lead',
          text: 'A desktop computer needs a processor, some memory sticks, a hard drive, and a motherboard to connect them all. A [[t-microcontroller|microcontroller]] puts the whole lot on one chip the size of your thumbnail, and sells for a few hundred rupees.',
        },
        {
          id: 'b2',
          kind: 'definition',
          term: 'Microcontroller',
          simple: 'A tiny complete computer on one chip, made to control one machine.',
          technical:
            'A small computer on a single circuit that includes a processor, memory, and input/output ports, designed to control specific electronic devices or systems.',
          provenance: 'syllabus',
          example:
            'The ATmega328P on an Arduino Uno. The syllabus calls it the heart of the board: it handles all the processing, input/output control and program execution.',
        },
        {
          id: 'b3',
          kind: 'callout',
          variant: 'remember',
          title: 'Three things on one chip',
          text: 'Whenever you write the definition, make sure all three appear: a **processor**, **memory**, and **input/output ports**. That triple is what makes it a *controller* rather than just a processor, and it is the whole basis of the comparison table in lesson 4.',
        },
        {
          id: 'b4',
          kind: 'figure',
          figure: 'McuChipFigure',
          caption:
            'Inside a microcontroller. Tap each block to see what it does and what would happen without it.',
          altSummary:
            'A single chip outline containing three labelled blocks: a processor (CPU) that executes instructions, memory (Flash/ROM for the program and RAM for working values), and input/output ports that connect to the outside world. Arrows show the CPU reading from and writing to both memory and the I/O ports.',
        },
        {
          id: 'b5',
          kind: 'analogy',
          title: 'A one-room workshop',
          analogy:
            'A microcontroller is a workshop where the worker, the tool rack and the door to the street are all in one small room. Everything needed is within arm\'s reach, so the work is fast and nothing else has to be bought. A microprocessor is a worker with no room at all: you must supply him with a building, a tool rack and a door before he can start.',
          mapping: [
            { from: 'The worker', to: 'The processor (CPU)' },
            { from: 'The tool rack in the room', to: 'Built-in memory' },
            { from: 'The door to the street', to: 'Built-in input/output ports' },
            { from: 'One small room', to: 'A single chip' },
          ],
        },
        {
          id: 'b6',
          kind: 'prose',
          heading: 'The chips you should be able to name',
          text: 'The syllabus names three microcontrollers as widely used for development boards. Learn all three, because a question can ask for examples.',
        },
        {
          id: 'b7',
          kind: 'gallery',
          title: 'Widely used microcontrollers',
          items: [
            {
              id: 'mcu-328',
              name: 'ATmega328P',
              art: 'chip-dip',
              what: 'The microcontroller at the heart of the Arduino Uno and the Arduino Nano.',
              used: 'The syllabus describes it as the heart of the Arduino Uno, handling all the processing, input/output control and program execution.',
              tags: ['Arduino Uno', 'Arduino Nano', 'AVR'],
            },
            {
              id: 'mcu-2560',
              name: 'ATmega2560',
              art: 'chip-dip',
              what: 'A larger, more capable microcontroller from the same family.',
              used: 'Used on the Arduino Mega, giving significantly more digital and analog I/O pins and more memory than the Uno.',
              tags: ['Arduino Mega', 'AVR'],
            },
            {
              id: 'mcu-8266',
              name: 'ESP8266',
              art: 'chip-module',
              what: 'A microcontroller with Wi-Fi connectivity built in.',
              used: 'One of the first platforms to combine a microcontroller with integrated Wi-Fi, which made it highly popular for IoT and Wi-Fi-enabled projects.',
              tags: ['Wi-Fi', 'IoT'],
            },
          ],
        },
        {
          id: 'b8',
          kind: 'callout',
          variant: 'misconception',
          title: 'The chip is not the board',
          text: 'An **ATmega328P** is a microcontroller: a black chip with legs. An **Arduino Uno** is a development board: a whole circuit board with that chip on it, plus a USB socket, a voltage regulator, an oscillator, pin headers and a power light. Saying "the Arduino is a microcontroller" is imprecise; the Arduino *contains* one. Module 3 makes this distinction properly.',
        },
        {
          id: 'b9',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q2-2-a', 'q2-2-b'],
        },
      ],
      summary: [
        'A microcontroller is a small computer on a single circuit that includes a processor, memory and input/output ports.',
        'It is designed to control specific electronic devices or systems.',
        'ATMEGA328P, ATMEGA2560 and ESP8266 are widely used microcontrollers for development boards.',
        'The ATmega328P is the heart of the Arduino Uno, handling processing, I/O control and program execution.',
      ],
      examTip:
        'Spell the chip names exactly: ATmega328P, ATmega2560, ESP8266. A question asking for "examples of microcontrollers used in development boards" is testing precisely these three.',
      confused: {
        simpler:
          'Take a desktop computer. Shrink the processor, the memory and the sockets until they all fit on one fingernail-sized chip. That chip is a microcontroller. It cannot run games, but it can control a fan perfectly.',
        reviewLessonId: 'l2-1',
      },
    },

    /* ------------------------------------------------------------ 2.3 -- */
    {
      id: 'l2-3',
      moduleId: 'm2',
      number: 3,
      title: 'Microprocessors',
      blurb: 'The other kind of chip. The one in your laptop.',
      minutes: 8,
      why: 'You cannot answer the comparison question in the next lesson without knowing what sits on the other side of the table.',
      prerequisites: ['l2-2'],
      objectives: [
        'Define a microprocessor',
        'Explain why it is called the brain of a computer',
        'Name examples of microprocessors',
      ],
      concepts: [{ id: 'c-mpu-def', title: 'Definition of a microprocessor' }],
      keyTerms: ['t-microprocessor', 't-ic'],
      blocks: [
        {
          id: 'b1',
          kind: 'definition',
          term: 'Microprocessor',
          simple:
            'The main chip in a computer that does the actual thinking. It needs memory and other parts added around it.',
          technical:
            'A programmable integrated circuit (IC) that processes all the instructions and tasks involved in computing. It serves as the brain of a computer or any digital device by executing instructions from a program.',
          provenance: 'syllabus',
          example: 'Intel Core, AMD Ryzen.',
        },
        {
          id: 'b2',
          kind: 'prose',
          text: 'Notice what the definition does **not** mention: memory, and input/output ports. That absence is the entire difference between this and a [[t-microcontroller|microcontroller]], and it is the reason the comparison table looks the way it does.\n\nA [[t-microprocessor|microprocessor]] on its own can compute, but it has nowhere to keep anything and no way to reach the outside world. To build a working computer around it you must add RAM, storage, and controllers for every port. That is what a motherboard is for.',
        },
        {
          id: 'b3',
          kind: 'figure',
          figure: 'MpuVsMcuFigure',
          caption:
            'The same three functions, arranged two ways. Toggle between them.',
          altSummary:
            'Two diagrams side by side. On the left, a microcontroller: one chip outline containing CPU, memory and I/O together. On the right, a microprocessor: a CPU chip alone, with separate external memory chips and separate peripheral controllers connected to it by a bus.',
        },
        {
          id: 'b4',
          kind: 'recall',
          prompt:
            'What single word appears in the microprocessor definition that tells you it is a physical chip rather than a program?',
          answer:
            '"Integrated circuit" (IC). The full phrase is "a programmable integrated circuit (IC) that processes all the instructions and tasks involved in computing".',
          hint: 'It is in brackets in the syllabus definition.',
        },
        {
          id: 'b5',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q2-3-a', 'q2-3-b'],
        },
      ],
      summary: [
        'A microprocessor is a programmable integrated circuit (IC) that processes all the instructions and tasks involved in computing.',
        'It serves as the brain of a computer or any digital device by executing instructions from a program.',
        'It does not include memory or I/O on the chip: those must be supplied externally.',
        'Examples: Intel Core, AMD Ryzen.',
      ],
      examTip:
        'The phrase "serves as the brain" is the syllabus\'s own. It is a safe phrase to use, but always follow it with "by executing instructions from a program", or the answer reads as a slogan rather than a definition.',
      confused: {
        simpler:
          'A microprocessor is just the thinking part, sold on its own. Like buying an engine with no car around it. You still need to add wheels, a fuel tank and a steering wheel before you can drive anywhere.',
        reviewLessonId: 'l2-2',
      },
    },

    /* ------------------------------------------------------------ 2.4 -- */
    {
      id: 'l2-4',
      moduleId: 'm2',
      number: 4,
      title: 'Microcontroller vs microprocessor',
      blurb: 'The eight-row comparison table, and how to remember it without memorising it.',
      minutes: 15,
      why: 'This is one of the most predictable questions in the whole unit. It is also one you can get completely right, because every row follows from a single idea.',
      prerequisites: ['l2-2', 'l2-3'],
      objectives: [
        'Reproduce all eight rows of the comparison table',
        'Explain why each difference follows from the integration difference',
        'Choose the right chip for a described job and justify it',
      ],
      concepts: [{ id: 'c-mcu-vs-mpu', title: 'Microcontroller vs microprocessor' }],
      keyTerms: ['t-microcontroller', 't-microprocessor', 't-peripheral'],
      blocks: [
        {
          id: 'b1',
          kind: 'prose',
          tone: 'lead',
          text: 'There are eight rows in this table and you could memorise all eight. Do not. Learn **one** idea, and the other seven fall out of it by themselves.\n\nThe one idea: **a microcontroller has everything on one chip; a microprocessor does not.**',
        },
        {
          id: 'b2',
          kind: 'compare',
          title: 'Microcontroller vs Microprocessor',
          columns: ['Microcontroller', 'Microprocessor'],
          rows: [
            {
              aspect: 'Purpose',
              left: 'Used for specific control tasks in embedded systems.',
              right: 'Used for general-purpose computing.',
            },
            {
              aspect: 'Integration',
              left: 'CPU, memory and I/O built into one chip.',
              right: 'CPU is separate from memory and peripherals.',
            },
            {
              aspect: 'Memory',
              left: 'Has built-in Flash/ROM and RAM.',
              right: 'Needs external memory.',
            },
            {
              aspect: 'I/O peripherals',
              left: 'Includes built-in I/O ports, ADC, DAC, timers, etc.',
              right: 'Needs external components for I/O.',
            },
            { aspect: 'Power use', left: 'Low power consumption.', right: 'Higher power consumption.' },
            { aspect: 'Cost', left: 'Low cost.', right: 'High cost.' },
            {
              aspect: 'Complexity',
              left: 'Simple and task-specific.',
              right: 'Complex and powerful.',
            },
            { aspect: 'Examples', left: 'Arduino, ESP32, AVR.', right: 'Intel Core, AMD Ryzen.' },
          ],
        },
        {
          id: 'b3',
          kind: 'callout',
          variant: 'remember',
          title: 'Why the other seven rows follow from row two',
          text: 'Everything on one chip means: you do not buy separate memory (**memory** row), you do not buy separate I/O chips (**peripherals** row), there are fewer chips drawing power (**power** row), you buy one part instead of five (**cost** row), and the whole thing is built for one job rather than any job (**purpose** and **complexity** rows). Get "integration" right and you can derive the rest in the exam hall.',
        },
        {
          id: 'b4',
          kind: 'figure',
          figure: 'ComparisonScaleFigure',
          caption:
            'Drag the slider from one side to the other and watch which properties come with each choice.',
          altSummary:
            'An interactive slider between two poles. At the microcontroller end, the properties shown are: one chip, built-in memory, built-in I/O, low power, low cost, simple and task-specific. At the microprocessor end: separate CPU, external memory, external I/O, higher power, high cost, complex and powerful.',
        },
        {
          id: 'b5',
          kind: 'callout',
          variant: 'misconception',
          title: '"Powerful" does not mean "better"',
          text: 'A microprocessor is more powerful, and that is the wrong reason to choose one. Putting an Intel Core processor inside a washing machine would make it cost twenty times more, consume far more power, need external memory and I/O chips, and take seconds to boot before it could start the wash. The microcontroller is the **better engineering choice** for that job precisely because it is simpler. In an exam, "which would you use and why" is asking about fit, not about power.',
        },
        {
          id: 'b6',
          kind: 'sort',
          prompt: 'Which chip suits each job better?',
          buckets: [
            { id: 'mcu', label: 'Microcontroller' },
            { id: 'mpu', label: 'Microprocessor' },
          ],
          items: [
            {
              id: 'j1',
              label: 'A digital thermometer that must run for a year on one battery',
              bucket: 'mcu',
              why: 'Low power consumption and a single specific control task. Exactly what a microcontroller is for.',
            },
            {
              id: 'j2',
              label: 'A laptop that must run a browser, a compiler and a video call at once',
              bucket: 'mpu',
              why: 'General-purpose computing with many different programs. That is a microprocessor with external RAM and storage.',
            },
            {
              id: 'j3',
              label: 'A traffic light controller at a junction',
              bucket: 'mcu',
              why: 'One fixed control task in an embedded system, running the same sequence forever.',
            },
            {
              id: 'j4',
              label: 'A machine that edits 4K video',
              bucket: 'mpu',
              why: 'Needs to be complex and powerful, with large external memory. Cost and power are acceptable trade-offs here.',
            },
            {
              id: 'j5',
              label: 'A wireless soil moisture probe buried in a field',
              bucket: 'mcu',
              why: 'Low cost matters because there will be hundreds, and low power matters because nobody can change the battery easily.',
            },
          ],
        },
        {
          id: 'b7',
          kind: 'explain',
          prompt:
            'A student says: "A microcontroller is just a small, weak microprocessor." Explain what is wrong with that.',
          rubric: [
            'Says the difference is integration, not just size or strength',
            'States that a microcontroller has CPU, memory and I/O on one chip',
            'States that a microprocessor has the CPU separate from memory and peripherals',
            'Notes that a microcontroller is designed for specific control tasks, not general-purpose computing',
          ],
          modelAnswer:
            'The difference is not strength, it is what is on the chip. A microcontroller has the CPU, the memory and the input/output ports all built into one chip, so it is a complete small computer by itself. A microprocessor is only the CPU: memory and peripherals have to be added around it externally. They are also built for different purposes. A microcontroller is designed for specific control tasks inside an embedded system, while a microprocessor is designed for general-purpose computing. Calling one a weak version of the other misses that they are different kinds of part, not different sizes of the same part.',
        },
        {
          id: 'b8',
          kind: 'recall',
          prompt: 'List all eight aspects the comparison table compares.',
          answer:
            'Purpose · Integration · Memory · I/O peripherals · Power use · Cost · Complexity · Examples.',
          hint: 'Start with what it is for, then what is on the chip, then the three consequences, then how hard it is, then examples.',
        },
        {
          id: 'b9',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q2-4-a', 'q2-4-b', 'q2-4-c', 'q2-4-d'],
        },
      ],
      summary: [
        'Microcontroller: specific control tasks in embedded systems. Microprocessor: general-purpose computing.',
        'Microcontroller: CPU, memory and I/O on one chip. Microprocessor: CPU separate from memory and peripherals.',
        'Microcontroller: built-in Flash/ROM and RAM, built-in I/O ports, ADC, DAC and timers. Microprocessor: needs external memory and external components for I/O.',
        'Microcontroller: low power, low cost, simple and task-specific. Microprocessor: higher power, high cost, complex and powerful.',
        'Examples: Arduino, ESP32, AVR versus Intel Core, AMD Ryzen.',
      ],
      examTip:
        'If the question gives you a table with the aspect column already filled in, answer every row even if you are unsure: there is no penalty, and the rows are worth a mark each. If you have to draw the table yourself, put "Aspect" in the first column and use the exact eight aspects above.',
      confused: {
        simpler:
          'One chip that has everything = microcontroller. One chip that has only the brain and needs friends = microprocessor. Everything else in the table is just a consequence of that.',
        analogy:
          'A microcontroller is a packed lunch: box, food, spoon, all in one. A microprocessor is a chef: brilliant, but you still have to supply the kitchen.',
        reviewLessonId: 'l2-2',
      },
    },
  ],
}
