import type { Module } from '@/types/content'

/* Module 3 — Development boards.
   Source: syllabus pages 9–16. The twelve named parts of the Arduino Uno, the
   three ways of powering it, and the whole board family including the two Sri
   Lankan platforms. */

export const m3: Module = {
  id: 'm3',
  number: 3,
  title: 'Development Boards',
  wire: 'orange',
  blurb:
    'The Arduino Uno, part by part, and the family of boards around it. This is the hardware you will program for the rest of the course.',
  outcomes: [
    'Distinguish a development system from a development board',
    'Name and explain every labelled part of an Arduino Uno',
    'Describe the three ways of powering an Arduino board',
    'Identify the other boards in the syllabus and say what each is for',
  ],
  lessons: [
    /* ------------------------------------------------------------ 3.1 -- */
    {
      id: 'l3-1',
      moduleId: 'm3',
      number: 1,
      title: 'Development systems and development boards',
      blurb: 'Two terms that sound identical and are not. The syllabus flags the difference itself.',
      minutes: 8,
      why: 'The syllabus prints a NOTE specifically to separate these two terms. When a syllabus stops to say "note the difference", that difference tends to appear in a paper.',
      objectives: [
        'Define a microcontroller-based development system',
        'Define a development board',
        'State the difference between them in one sentence',
      ],
      concepts: [{ id: 'c-devboard', title: 'Development systems and boards' }],
      keyTerms: ['t-devboard', 't-devsystem', 't-ide'],
      blocks: [
        {
          id: 'b1',
          kind: 'definition',
          term: 'Microcontroller-based development system',
          simple:
            'Everything you need to build a microcontroller project: the board *and* the software.',
          technical:
            'A combination of hardware and software tools that help design, program and test microcontroller applications easily.',
          provenance: 'syllabus',
        },
        {
          id: 'b2',
          kind: 'definition',
          term: 'Development board',
          simple: 'Just the physical board itself, with the chip and the parts it needs to run.',
          technical:
            'A circuit board that contains a microcontroller along with essential components such as a power supply, input/output interfaces, clock circuits, and sometimes communication ports or sensors.',
          provenance: 'syllabus',
        },
        {
          id: 'b3',
          kind: 'callout',
          variant: 'source',
          title: 'The syllabus states the difference directly',
          text: 'A development **system** includes both hardware and software tools for designing and programming applications, while a development **board** is mainly the hardware platform used to build and test circuits.',
        },
        {
          id: 'b4',
          kind: 'analogy',
          title: 'The board is the guitar; the system is guitar plus lessons plus tuner',
          analogy:
            'A guitar on its own is an object. You cannot get anywhere with it unless you also have a tuner, a book of chords and somewhere to practise. The guitar is the board. The guitar plus everything you need to actually make music is the system.',
          mapping: [
            { from: 'The guitar', to: 'The development board: hardware only' },
            { from: 'The tuner and chord book', to: 'The software tools: the IDE, the compiler, the libraries' },
            { from: 'All of it together', to: 'The development system' },
          ],
        },
        {
          id: 'b5',
          kind: 'recall',
          prompt:
            'In one sentence: what is the difference between a development system and a development board?',
          answer:
            'A development system includes both the hardware and the software tools for designing and programming applications, while a development board is mainly just the hardware platform used to build and test circuits.',
          hint: 'One of the two includes software. Which?',
        },
        {
          id: 'b6',
          kind: 'callout',
          variant: 'note',
          title: 'One board mentioned but not examinable',
          text: 'The syllabus shows an 8051 microcontroller development board and marks it explicitly as **not in the syllabus**. It is there for context only. You will not be asked about it, and this course does not teach it.',
        },
        {
          id: 'b7',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q3-1-a', 'q3-1-b'],
        },
      ],
      summary: [
        'A development system is a combination of hardware and software tools that help design, program and test microcontroller applications easily.',
        'A development board is a circuit board containing a microcontroller plus essential components such as a power supply, I/O interfaces, clock circuits and sometimes communication ports or sensors.',
        'The system includes software; the board is mainly hardware.',
      ],
      examTip:
        'When a question asks you to "distinguish between" two things, write both definitions and then one sentence naming the difference. Three sentences, three marks.',
      confused: {
        simpler:
          'Board = the thing you can hold. System = the thing you can hold plus the programs on your computer that let you use it.',
      },
    },

    /* ------------------------------------------------------------ 3.2 -- */
    {
      id: 'l3-2',
      moduleId: 'm3',
      number: 2,
      title: 'The Arduino Uno, part by part',
      blurb:
        'Twelve named parts. Click any of them on the board and find out what it does.',
      minutes: 22,
      why: 'A labelled-diagram question on the Uno is close to guaranteed. More importantly, you cannot wire a circuit safely without knowing which pins are which, and every practical in module 7 depends on it.',
      prerequisites: ['l3-1', 'l2-2'],
      objectives: [
        'Identify every labelled part of an Arduino Uno board',
        'Explain what the digital I/O pins and analog pins do, and their voltage ranges',
        'Explain what TX, RX, the oscillator, the reset button, GND, IOREF and AREF are for',
        'Name the three functions used to control digital pins',
      ],
      concepts: [
        { id: 'c-uno-parts', title: 'Parts of an Arduino Uno' },
        { id: 'c-digital-pins', title: 'Digital I/O pins' },
        { id: 'c-analog-pins', title: 'Analog pins and the ADC' },
        { id: 'c-uno-support', title: 'Oscillator, reset, GND, IOREF and AREF' },
      ],
      keyTerms: [
        't-digital-pin',
        't-analog-pin',
        't-adc',
        't-high-low',
        't-oscillator',
        't-gnd',
        't-ioref',
        't-aref',
        't-serial',
      ],
      blocks: [
        {
          id: 'b1',
          kind: 'prose',
          tone: 'lead',
          text: 'The syllabus calls the Uno one of the most popular Arduino boards, and the ATmega328P chip **the heart of the Arduino Uno**, handling all the processing, input/output control and program execution.\n\nHere is the whole board. Take your time with it: everything else in this course happens on top of this diagram.',
        },
        {
          id: 'b2',
          kind: 'figure',
          figure: 'UnoBoardFigure',
          caption:
            'The Arduino Uno. Select any part to read what it does. Use Tab and Enter if you prefer the keyboard.',
          altSummary:
            'A labelled diagram of an Arduino Uno board. Along the top edge are digital pins 0 to 13, with pin 0 marked RX and pin 1 marked TX. Along the bottom right are analog pins A0 to A5. Along the bottom left is the power header with the Vin pin, GND pins, 5V, 3.3V and IOREF. On the left edge are the USB type B socket and the DC barrel jack. In the centre is the ATmega328P microcontroller. Also marked are the reset button, the 16 MHz oscillator, the power indicator LED and the AREF pin.',
          props: { interactive: true },
        },
        {
          id: 'b3',
          kind: 'prose',
          heading: 'The microcontroller',
          text: 'The syllabus is direct about this one: **the microcontroller is the brain of the development board. It executes the program instructions and controls the behaviour of the system.**\n\nOn the Uno that chip is the ATmega328P. Different Arduino boards use different chips: the Uno uses an AVR chip, while the Arduino Due uses an ARM chip.',
        },
        {
          id: 'b4',
          kind: 'prose',
          heading: 'Digital I/O pins',
          text: 'These are used to read digital signals (like ON/OFF) from [[t-sensor|sensors]], or to send digital signals to devices such as LEDs, motors or relays.\n\nA digital signal has only two states, and the syllabus gives them as voltages:',
        },
        {
          id: 'b5',
          kind: 'figure',
          figure: 'HighLowFigure',
          caption: 'The only two states a digital pin can be in. Toggle it.',
          altSummary:
            'Two states shown as voltage levels: HIGH is 5 volts and LOW is 0 volts. A square wave beneath shows a pin switching between the two over time, with no values in between.',
        },
        {
          id: 'b6',
          kind: 'callout',
          variant: 'remember',
          title: 'HIGH = 5V, LOW = 0V',
          text: 'Memorise these two lines exactly as written. They appear in the syllabus as a pair and they are the foundation of every digitalWrite() you will write. There is nothing in between: a digital pin is either at 5 volts or at 0 volts.',
        },
        {
          id: 'b7',
          kind: 'prose',
          text: 'Three functions control the [[t-digital-pin|digital pins]], and you will use all three in module 6:\n\n- `pinMode()` sets whether a pin is an input or an output\n- `digitalRead()` reads whether a pin is HIGH or LOW\n- `digitalWrite()` sets a pin to HIGH or LOW\n\nThe syllabus states these can be used to control the digital pins according to your project\'s requirements.',
        },
        {
          id: 'b8',
          kind: 'prose',
          heading: 'Analog pins (A0 to A5)',
          text: 'Not everything in the world is on or off. A temperature is not on or off. The brightness of a room is not on or off. For those you need the [[t-analog-pin|analog pins]].\n\nThey are used to read varying analog signals from sensors (like temperature or light) and convert them into digital values using the Arduino\'s built-in **ADC (Analog-to-Digital Converter)**. These pins can read analog voltage levels ranging from **0 to 5 volts**, and `analogRead()` is the function that reads them.',
        },
        {
          id: 'b9',
          kind: 'figure',
          figure: 'AdcFigure',
          caption:
            'The ADC turning a voltage into a number. Drag the voltage and watch the reading.',
          altSummary:
            'An interactive converter. A voltage slider from 0 to 5 volts feeds an analog-to-digital converter, which outputs a whole number from 0 to 1023. At 0 volts the output is 0; at 2.5 volts it is about 511; at 5 volts it is 1023. The relationship is linear.',
        },
        {
          id: 'b10',
          kind: 'callout',
          variant: 'exam',
          title: 'Where 1023 comes from',
          text: 'The syllabus states that `analogRead()` returns a value between **0 (dark) and 1023 (bright)** when used with an LDR. That range is not arbitrary: the Uno\'s ADC has 10 bits, and 2¹⁰ = 1024 possible values, numbered 0 to 1023. If a question asks for the range of an analogRead, the answer is **0 to 1023**.',
        },
        {
          id: 'b11',
          kind: 'compare',
          title: 'Digital pins vs analog pins',
          columns: ['Digital I/O pins', 'Analog pins'],
          rows: [
            {
              aspect: 'What they handle',
              left: 'Signals with two states only: ON/OFF',
              right: 'Varying signals across a range',
            },
            { aspect: 'Voltage', left: 'HIGH = 5V, LOW = 0V', right: 'Anything from 0V to 5V' },
            {
              aspect: 'Value you get',
              left: 'HIGH or LOW',
              right: 'A whole number from 0 to 1023',
            },
            {
              aspect: 'Functions',
              left: 'pinMode(), digitalRead(), digitalWrite()',
              right: 'analogRead()',
            },
            {
              aspect: 'Typical devices',
              left: 'LEDs, motors, relays, buttons, reed switches',
              right: 'Temperature sensors, LDRs, potentiometers',
            },
          ],
        },
        {
          id: 'b12',
          kind: 'prose',
          heading: 'TX and RX',
          text: 'These two pins (digital 1 and digital 0) are the transmitter and the receiver. They are used for **serial communication**, meaning they send and receive data one bit at a time.\n\nThe syllabus gives a good example. When you use your phone to send an ON command over Bluetooth, the Arduino receives it through the **RX** pin and turns on the light. When the light turns on, the Arduino sends a confirmation message back to your phone through the **TX** pin.',
        },
        {
          id: 'b13',
          kind: 'callout',
          variant: 'remember',
          title: 'TX transmits, RX receives',
          text: 'T for **T**ransmit and out. R for **R**eceive and in. The board is always described from its own point of view: TX is what the *Arduino* sends.',
        },
        {
          id: 'b14',
          kind: 'prose',
          heading: 'Communication port (USB socket)',
          text: 'This communication port is established through the **USB-to-Serial converter chip** present on the Arduino board. Most of the time this port is either USB type B or USB mini.\n\nIt does two jobs at once: it carries your program down to the board, and it supplies power while it is connected.',
        },
        {
          id: 'b15',
          kind: 'prose',
          heading: 'Oscillator',
          text: 'The [[t-oscillator|oscillator]] provides a **clock signal** that helps the [[t-microcontroller|microcontroller]] run programs at a steady speed. It ensures that the microcontroller executes instructions, communicates with peripherals, and manages timing functions accurately.',
        },
        {
          id: 'b16',
          kind: 'analogy',
          title: 'The oscillator is the metronome',
          analogy:
            'A group of musicians who each play at their own speed produce noise, not music. Give them a metronome ticking steadily and they play together. The oscillator is the metronome for everything on the chip.',
          mapping: [
            { from: 'The metronome tick', to: 'The clock signal' },
            { from: 'Everyone playing in time', to: 'Instructions executing at a steady speed' },
            { from: 'The band staying together', to: 'Accurate timing and communication with peripherals' },
          ],
          limits:
            'A metronome only sets tempo. A clock signal also drives the sequencing of every single operation inside the chip, so it is doing considerably more work.',
        },
        {
          id: 'b17',
          kind: 'prose',
          heading: 'Reset button',
          text: 'Used to restart the microcontroller and run the uploaded program from the beginning.\n\nNote what it does **not** do: it does not erase your program. The sketch stays in Flash memory. Reset simply starts it again from the first line of `setup()`.',
        },
        {
          id: 'b18',
          kind: 'prose',
          heading: 'Power indicator',
          text: 'A small [[t-led|LED]] labelled **ON** that lights up when the board is receiving power. If you plug a board in and this LED stays dark, the problem is power, not your code.',
        },
        {
          id: 'b19',
          kind: 'prose',
          heading: 'GND pins',
          text: 'Ground connections that act as the **0 V reference point** in a circuit. They complete the electrical path for current to flow and are used to connect the negative side of components.\n\nThe board has several [[t-gnd|GND]] pins so multiple devices can share the same ground.',
        },
        {
          id: 'b20',
          kind: 'callout',
          variant: 'misconception',
          title: 'Ground is not "nothing"',
          text: 'Students often treat GND as the pin you connect leftover wires to. It is the **0 V reference point**: every voltage on the board is measured relative to it. Without a shared ground between the Arduino and a component, "5 volts" has no meaning, because there is nothing to be 5 volts *above*. This is why almost every circuit in this course connects something to GND.',
        },
        {
          id: 'b21',
          kind: 'prose',
          heading: 'IOREF pin',
          text: 'Provides the operating voltage reference (usually **5V or 3.3V**) for the input and output pins. It exists so that a shield or add-on board can find out what voltage this particular Arduino runs at, and adjust itself accordingly.',
        },
        {
          id: 'b22',
          kind: 'prose',
          heading: 'Analog Reference pin (AREF)',
          text: 'Used to provide an **external reference voltage** for the analog-to-digital converter ([[t-adc|ADC]]). This helps improve the accuracy of analog readings from sensors.\n\nIf your sensor only ever outputs between 0 and 1.1 volts, then using the full 0 to 5 volt scale wastes most of your 1024 steps. Feeding a lower reference into AREF stretches those steps across the range you actually use.',
        },
        {
          id: 'b23',
          kind: 'recall',
          prompt:
            'Name as many labelled parts of the Arduino Uno as you can before you reveal the list.',
          answer:
            'Microcontroller · Digital I/O pins · Analog pins (A0–A5) · TX and RX · Communication port (USB socket) · Power supply (USB, DC barrel jack, Vin pin) · Reset button · Oscillator · Power indicator · GND pins · IOREF pin · Analog Reference (AREF) pin.',
          hint: 'Work around the board: top edge, bottom edge, left edge, then the parts in the middle.',
        },
        {
          id: 'b24',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q3-2-a', 'q3-2-b', 'q3-2-c', 'q3-2-d', 'q3-2-e'],
        },
      ],
      summary: [
        'The microcontroller is the brain of the board: it executes program instructions and controls the behaviour of the system.',
        'Digital I/O pins read or send two-state signals. HIGH = 5V, LOW = 0V. Controlled with pinMode(), digitalRead() and digitalWrite().',
        'Analog pins read varying voltages from 0 to 5V and convert them with the built-in ADC. analogRead() returns 0 to 1023.',
        'TX transmits and RX receives, one bit at a time, for serial communication.',
        'The USB port works through a USB-to-Serial converter chip, and is usually USB type B or USB mini.',
        'The oscillator supplies a clock signal so instructions run at a steady speed with accurate timing.',
        'Reset restarts the microcontroller and runs the uploaded program from the beginning.',
        'GND pins are the 0V reference point and complete the electrical path; there are several so devices can share a ground.',
        'IOREF gives the operating voltage reference (usually 5V or 3.3V) for the I/O pins.',
        'AREF provides an external reference voltage for the ADC to improve accuracy.',
      ],
      examTip:
        'For a labelled-diagram question, do not just write the name of a part: add its function in four or five words. "Oscillator — provides the clock signal" scores where "Oscillator" alone may not.',
      confused: {
        simpler:
          'You only need four parts to build anything in this course. **The chip** does the thinking. **Digital pins** handle on/off things like LEDs and buttons. **Analog pins** handle in-between things like temperature and light. **GND** is where every circuit comes back to. Learn those four properly and add the rest afterwards.',
        analogy:
          'The board is a desk. The chip is you. The digital pins are light switches on the wall: up or down, nothing else. The analog pins are windows: you can see how much light there is. GND is the floor everything stands on.',
        reviewLessonId: 'l2-2',
      },
    },

    /* ------------------------------------------------------------ 3.3 -- */
    {
      id: 'l3-3',
      moduleId: 'm3',
      number: 3,
      title: 'Powering the board',
      blurb: 'Three ways in, and the one component that protects all of them.',
      minutes: 10,
      why: 'Power is the most common reason a project does not work, and the voltage regulator is a favourite short-answer question.',
      prerequisites: ['l3-2'],
      objectives: [
        'Describe the three ways an Arduino board can be powered',
        'State the voltage each one supplies',
        'Explain what the onboard voltage regulator does',
      ],
      concepts: [{ id: 'c-power', title: 'Powering an Arduino board' }],
      keyTerms: ['t-vin', 't-regulator', 't-barrel-jack'],
      blocks: [
        {
          id: 'b1',
          kind: 'prose',
          tone: 'lead',
          text: 'Arduino boards can be powered in several ways, depending on the specific model and the requirements of your project. The syllabus names three.',
        },
        {
          id: 'b2',
          kind: 'figure',
          figure: 'PowerFigure',
          caption:
            'Three ways in, one regulator, one 5V rail. Pick a source and follow the path.',
          altSummary:
            'Three power inputs feed an Arduino board. USB supplies 5 volts directly. The DC barrel jack accepts 7 to 12 volts. The Vin pin accepts an external supply within the specified range with GND as the negative. The barrel jack and Vin both pass through an onboard voltage regulator which brings the voltage down to the levels the microcontroller and other components need.',
        },
        {
          id: 'b3',
          kind: 'steps',
          title: 'The three power sources',
          steps: [
            {
              label: 'a) USB power',
              text: 'The most common way to power an Arduino board is through its USB port. This provides 5 volts (V) of power to the board, which is regulated to the required voltage levels for the microcontroller and other components on the board.',
            },
            {
              label: 'b) DC barrel jack',
              text: 'You can connect an external power supply, usually 7 to 12 volts, to the barrel jack to power the Arduino. The board has an onboard voltage regulator that regulates the input voltage to the required levels.',
            },
            {
              label: 'c) Vin pin',
              text: 'You can connect an external power source, within the specified voltage range, directly to this pin as the positive (+) and the GND pin as the negative (−) to power the board. The onboard voltage regulator regulates the input voltage to the required levels.',
            },
          ],
        },
        {
          id: 'b4',
          kind: 'callout',
          variant: 'remember',
          title: 'The number to remember is 7–12',
          text: 'USB gives **5V**. The barrel jack takes **7 to 12V**. Those two numbers are the ones worth memorising, and they are the ones most likely to be asked for.',
        },
        {
          id: 'b5',
          kind: 'analogy',
          title: 'What a voltage regulator actually does',
          analogy:
            'Think of the tap on a water tank on a roof. The pressure coming down the pipe varies with how full the tank is, but the tap gives you a steady flow whatever the pressure above it. Feed the Arduino 9V or 12V and the regulator hands the chip a steady 5V either way.',
          mapping: [
            { from: 'Varying pressure in the pipe', to: 'Input voltage from 7 to 12V' },
            { from: 'The tap', to: 'The onboard voltage regulator' },
            { from: 'Steady flow at the sink', to: 'The regulated voltage the microcontroller needs' },
          ],
          limits:
            'A tap can be turned. A voltage regulator is fixed: it always outputs the same voltage, and the excess is given off as heat.',
        },
        {
          id: 'b6',
          kind: 'recall',
          prompt: 'What voltage range does the DC barrel jack usually accept?',
          answer:
            'Usually 7 to 12 volts. An onboard voltage regulator then brings that down to the levels the microcontroller and the other components on the board need.',
          hint: 'Two numbers, both single digits or low double digits.',
        },
        {
          id: 'b7',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q3-3-a', 'q3-3-b', 'q3-3-c'],
        },
      ],
      summary: [
        'USB power: the most common method, supplies 5V, which is then regulated to the required levels.',
        'DC barrel jack: an external supply of usually 7 to 12V, regulated onboard.',
        'Vin pin: an external source connected to Vin (+) and GND (−), regulated onboard.',
        'The onboard voltage regulator regulates the input voltage to the levels required by the microcontroller and other components.',
      ],
      examTip:
        'A question asking "how can an Arduino board be powered?" expects all three methods. Name each one and give its voltage. Three methods, three marks.',
      confused: {
        simpler:
          'There are three holes you can put power into: the USB socket, the round black socket, and a pin called Vin. The USB one gives 5V. The other two want 7 to 12V and the board turns that into 5V by itself.',
        reviewLessonId: 'l3-2',
      },
    },

    /* ------------------------------------------------------------ 3.4 -- */
    {
      id: 'l3-4',
      moduleId: 'm3',
      number: 4,
      title: 'The rest of the board family',
      blurb:
        'Nano, Pro Mini, Mega, Due, the ESP boards, micro:bit, Raspberry Pi, and the two Sri Lankan platforms.',
      minutes: 18,
      why: 'Questions in this area usually ask you to pick the right board for a described project. That is easy once you know what each one is *for*, and impossible if you only know their names.',
      prerequisites: ['l3-2'],
      objectives: [
        'Name each board in the syllabus and its distinguishing feature',
        'Choose an appropriate board for a described project and justify the choice',
        'Name the two Sri Lankan development platforms',
      ],
      concepts: [
        { id: 'c-arduino-family', title: 'The Arduino board family' },
        { id: 'c-other-boards', title: 'ESP, micro:bit and Raspberry Pi' },
        { id: 'c-sl-boards', title: 'Sri Lankan development boards' },
      ],
      keyTerms: ['t-esp32', 't-microbit', 't-raspberrypi', 't-magicbit', 't-gavesha'],
      blocks: [
        {
          id: 'b1',
          kind: 'prose',
          tone: 'lead',
          text: 'The syllabus defines Arduino as **an open-source microcontroller-based development platform used to design and build IoT projects easily**. Boards come in different types, each using a different [[t-microcontroller|microcontroller]]: the Arduino Uno uses an AVR chip, while the Arduino Due uses an ARM chip.\n\nThe syllabus also notes why Arduino became so popular: **the boards are known for their simplicity and ease of use, with a large community providing libraries.**',
        },
        {
          id: 'b2',
          kind: 'gallery',
          title: 'The Arduino family',
          intro: 'Five boards. Tap each one to see what makes it different.',
          items: [
            {
              id: 'b-uno',
              name: 'Arduino Uno',
              art: 'uno',
              what: 'One of the most popular Arduino boards, and the one this course uses throughout.',
              how: 'The ATmega328P chip is the heart of the Uno, handling all the processing, input/output control and program execution.',
              used: 'The default choice for learning and for most small projects.',
              tags: ['ATmega328P', 'AVR'],
            },
            {
              id: 'b-nano',
              name: 'Arduino Nano',
              art: 'nano',
              what: 'A compact board based on the ATmega328 microcontroller, similar to the Uno but in a smaller form factor.',
              used: 'Commonly used in projects where space is limited or a smaller footprint is desired.',
              tags: ['ATmega328', 'compact'],
            },
            {
              id: 'b-mini',
              name: 'Arduino Pro Mini',
              art: 'promini',
              what: 'The smallest version of the Arduino family.',
              used: 'Designed for applications where space is at a premium.',
              tags: ['smallest'],
            },
            {
              id: 'b-mega',
              name: 'Arduino Mega',
              art: 'mega',
              what: 'A more powerful board compared to the Uno, featuring the ATmega2560 microcontroller.',
              how: 'Has significantly more digital and analog I/O pins, more memory, and additional features.',
              used: 'Projects that simply run out of pins on an Uno.',
              tags: ['ATmega2560', 'more pins'],
            },
            {
              id: 'b-due',
              name: 'Arduino Due',
              art: 'due',
              what: 'A board based on the Atmel SAM3X8E ARM Cortex-M3 CPU.',
              how: 'Offers more processing power and memory compared to traditional Arduino boards based on AVR microcontrollers.',
              used: 'Projects requiring higher computational power, such as advanced robotics, 3D printers, and more complex applications.',
              tags: ['ARM Cortex-M3', 'high power'],
            },
          ],
        },
        {
          id: 'b3',
          kind: 'callout',
          variant: 'remember',
          title: 'Three Arduinos, three reasons',
          text: 'If you can only remember three: **Uno** is the standard one. **Nano and Pro Mini** are the small ones, for when space is limited. **Mega and Due** are the big ones, for when you need more pins or more power. Every Arduino question about board choice is really asking about space, pins or power.',
        },
        {
          id: 'b4',
          kind: 'gallery',
          title: 'ESP boards, micro:bit and Raspberry Pi',
          intro:
            'Not Arduinos, but all four appear in the syllabus and all four get asked about.',
          items: [
            {
              id: 'b-8266',
              name: 'ESP8266',
              art: 'esp8266',
              what: 'One of the first platforms to combine a microcontroller with integrated Wi-Fi connectivity.',
              used: 'Made it highly popular for IoT and Wi-Fi-enabled projects.',
              tags: ['Wi-Fi built in', 'IoT'],
            },
            {
              id: 'b-32',
              name: 'ESP32',
              art: 'esp32',
              what: 'Builds upon the success of the ESP8266 by adding more features and capabilities.',
              used: 'Suitable for a wider range of applications than the ESP8266.',
              tags: ['Wi-Fi', 'more features'],
            },
            {
              id: 'b-microbit',
              name: 'micro:bit',
              art: 'microbit',
              what: 'Specifically designed for educational purposes, to introduce children to programming and electronics.',
              how: 'Despite its small size it is equipped with various sensors and components, making it versatile for a wide range of projects. It features a 5×5 LED matrix display that can be used to display simple graphics, text and animations.',
              tags: ['education', '5×5 LED matrix'],
            },
            {
              id: 'b-pi',
              name: 'Raspberry Pi',
              art: 'pi',
              what: 'Not strictly a microcontroller-based board, but widely used for embedded projects due to its versatility and power.',
              used: 'Suitable for projects requiring more computational power or interfacing with complex peripherals.',
              tags: ['not a microcontroller board', 'high power'],
            },
          ],
        },
        {
          id: 'b5',
          kind: 'callout',
          variant: 'exam',
          title: 'The Raspberry Pi is the odd one out, and the syllabus says so',
          text: 'The syllabus is careful here: the Pi is **not strictly a microcontroller-based board**. It is a small computer with a microprocessor, an operating system and external storage. It appears in this unit because it is widely used for embedded projects, and it is the example the syllabus gives for **edge computing** back in module 1. If a question asks which of a list is not a microcontroller-based development board, this is the answer.',
        },
        {
          id: 'b6',
          kind: 'prose',
          heading: 'Sri Lankan development boards',
          text: 'The syllabus notes that **presently, Sri Lanka is also creating development boards based on such microcontrollers**, and names two.',
        },
        {
          id: 'b7',
          kind: 'gallery',
          title: 'Made in Sri Lanka',
          items: [
            {
              id: 'b-magic',
              name: 'Magic Bit',
              art: 'magicbit',
              what: 'A Sri Lankan development board built on a microcontroller.',
              how: 'It can be programmed using software like the Arduino IDE, MicroPython, or MagicCode.',
              tags: ['Sri Lanka', 'Arduino IDE', 'MicroPython'],
            },
            {
              id: 'b-gavesha',
              name: 'Gavesha platform',
              art: 'gavesha',
              what: 'A Sri Lankan development platform, named in the syllabus alongside Magic Bit.',
              tags: ['Sri Lanka'],
            },
          ],
        },
        {
          id: 'b8',
          kind: 'sort',
          prompt: 'Choose the most suitable board for each project.',
          buckets: [
            { id: 'uno', label: 'Arduino Uno' },
            { id: 'mini', label: 'Nano or Pro Mini' },
            { id: 'mega', label: 'Mega or Due' },
            { id: 'esp', label: 'ESP8266 or ESP32' },
          ],
          items: [
            {
              id: 'p1',
              label: 'A wearable badge that must fit inside a shirt pocket',
              bucket: 'mini',
              why: 'The Nano and Pro Mini exist for exactly this: projects where space is limited or at a premium.',
            },
            {
              id: 'p2',
              label: 'A weather station that uploads readings to a website by itself',
              bucket: 'esp',
              why: 'It needs Wi-Fi. The ESP8266 was the first platform to combine a microcontroller with integrated Wi-Fi, which is why it became popular for IoT projects.',
            },
            {
              id: 'p3',
              label: 'A 3D printer needing many motors, many sensors and heavy computation',
              bucket: 'mega',
              why: 'The Due is named in the syllabus for projects requiring higher computational power such as 3D printers; the Mega gives significantly more I/O pins.',
            },
            {
              id: 'p4',
              label: 'Your first LED blinking project at school',
              bucket: 'uno',
              why: 'The Uno is one of the most popular boards and is known for simplicity and ease of use.',
            },
          ],
        },
        {
          id: 'b9',
          kind: 'explain',
          prompt:
            'A friend wants to build a device that measures soil moisture in a field and sends the reading to their phone from across the village. Which board would you suggest and why?',
          rubric: [
            'Chooses an ESP8266 or ESP32',
            'Gives the reason: it has Wi-Fi connectivity built in',
            'Notes that a plain Arduino Uno has no wireless connectivity of its own',
            'Mentions that this is an IoT application, which is what the ESP boards became popular for',
          ],
          modelAnswer:
            'An ESP8266 or ESP32. The device has to send data over a network by itself, and these are the boards that combine a microcontroller with integrated Wi-Fi connectivity, which is exactly why they became popular for IoT projects. An Arduino Uno could read the soil sensor perfectly well, but it has no wireless connectivity built in, so it would need an extra module added before it could send anything anywhere.',
        },
        {
          id: 'b10',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q3-4-a', 'q3-4-b', 'q3-4-c', 'q3-4-d'],
        },
      ],
      summary: [
        'Arduino is an open-source microcontroller-based development platform for designing and building IoT projects easily; boards are known for simplicity, ease of use and a large community providing libraries.',
        'Uno: the most popular board, ATmega328P. Nano: compact, ATmega328, for limited space. Pro Mini: the smallest. Mega: ATmega2560, many more I/O pins and memory. Due: ARM Cortex-M3, more processing power, for robotics and 3D printers.',
        'ESP8266: one of the first to combine a microcontroller with integrated Wi-Fi. ESP32: builds on it with more features and capabilities.',
        'micro:bit: designed for education, with a 5×5 LED matrix display.',
        'Raspberry Pi: not strictly a microcontroller-based board, but widely used for embedded projects needing more computational power or complex peripherals.',
        'Magic Bit and the Gavesha platform are Sri Lankan development boards. Magic Bit can be programmed with the Arduino IDE, MicroPython or MagicCode.',
      ],
      examTip:
        'For a "which board would you choose" question, always give the reason in the same sentence. The mark is for the justification, not the name.',
      confused: {
        simpler:
          'Every board in this list is the same idea as the Uno, changed in one way. Smaller (Nano, Pro Mini). Bigger (Mega, Due). With Wi-Fi (ESP8266, ESP32). For children (micro:bit). A real computer instead (Raspberry Pi). Made here (Magic Bit, Gavesha).',
        reviewLessonId: 'l3-2',
      },
    },
  ],
}
