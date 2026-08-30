import type { Module } from '@/types/content'

/* Module 4 — Accessories used with Arduino boards.
   Source: syllabus pages 17–19: breadboards, jumper wires, LEDs, resistors
   (fixed, variable, LDR), buzzer, servo motor. */

export const m4: Module = {
  id: 'm4',
  number: 4,
  title: 'Components and Accessories',
  wire: 'red',
  blurb:
    'The parts you plug into the board. Breadboards, jumper wires, LEDs, resistors, buzzers and servo motors, and how each one behaves.',
  outcomes: [
    'Explain what a breadboard is and how its power rails and holes are arranged',
    'Name the three types of jumper wire',
    'Explain what an LED is and why it always needs a resistor',
    'Distinguish fixed resistors, variable resistors and LDRs',
    'Describe a buzzer and the three wires of a servo motor',
  ],
  lessons: [
    /* ------------------------------------------------------------ 4.1 -- */
    {
      id: 'l4-1',
      moduleId: 'm4',
      number: 1,
      title: 'The breadboard',
      blurb: 'Building circuits without soldering anything.',
      minutes: 12,
      why: 'Every practical circuit in this course is built on a breadboard. Understanding how the holes connect underneath is the difference between a circuit that works and one that mysteriously does not.',
      objectives: [
        'Define a breadboard',
        'Identify the power rails and explain what they are for',
        'Say what can be inserted into the middle holes',
      ],
      concepts: [{ id: 'c-breadboard', title: 'The breadboard' }],
      keyTerms: ['t-breadboard', 't-power-rail', 't-soldering'],
      blocks: [
        {
          id: 'b1',
          kind: 'definition',
          term: 'Breadboard',
          simple:
            'A plastic board full of holes where you can push components in and connect them together without any soldering.',
          technical:
            'A rectangular board with a grid of holes into which electronic components can be inserted and connected together without the need for soldering.',
          provenance: 'syllabus',
        },
        {
          id: 'b2',
          kind: 'prose',
          text: 'Underneath each row of holes is a metal clip. Push a wire into a hole and the clip grips it. Push a second wire into another hole on **the same clip**, and the two wires are now connected. That is the entire trick.\n\nThe hard part for a beginner is knowing which holes share a clip. The diagram below shows it.',
        },
        {
          id: 'b3',
          kind: 'figure',
          figure: 'BreadboardFigure',
          caption:
            'Hover or tap any hole to light up every other hole it is electrically connected to.',
          altSummary:
            'A breadboard diagram. Down each long side runs a pair of power rails, one marked with a red plus and one with a blue minus; all holes along a single rail are connected together lengthwise. In the middle are two blocks of holes separated by a channel; within each block, holes are connected in short columns of five that run across the board, and the channel breaks the connection between the two blocks.',
        },
        {
          id: 'b4',
          kind: 'prose',
          heading: 'Power rails',
          text: 'Breadboards typically have **two long rows of connected holes on either side**, often coloured red and blue, called **power rails**.\n\nThey exist because almost every component in a circuit needs 5V and [[t-gnd|GND]]. Rather than running a separate wire back to the Arduino for each one, you run 5V to the red rail once and GND to the blue rail once, and every component takes what it needs from the rail beside it.',
        },
        {
          id: 'b5',
          kind: 'prose',
          heading: 'The middle holes',
          text: 'Electronic components such as **resistors, capacitors, integrated circuits (ICs), LEDs and wires** can be inserted into the [[t-breadboard|breadboard]]\'s middle holes.',
        },
        {
          id: 'b6',
          kind: 'callout',
          variant: 'misconception',
          title: 'The channel down the middle is not decoration',
          text: 'That gap splits the board electrically into two halves. It exists so that a chip with legs down both sides (a DIP package, like the ATmega328P) can straddle it with each leg landing on its own separate column. If the two halves were connected, every leg of the chip would be shorted to the leg opposite it and nothing would work.',
        },
        {
          id: 'b7',
          kind: 'analogy',
          title: 'Rows of desks in a hall',
          analogy:
            'Picture a hall of five-seat benches. Anyone sitting on the same bench can pass a note to anyone else on that bench without getting up. To reach a different bench, someone has to physically carry the note across. The aisle down the middle is wide enough that nobody can reach across it.',
          mapping: [
            { from: 'One five-seat bench', to: 'One column of five connected holes' },
            { from: 'Passing a note along the bench', to: 'Two components sharing a connection' },
            { from: 'Carrying a note to another bench', to: 'A jumper wire' },
            { from: 'The aisle', to: 'The centre channel, which breaks the connection' },
            { from: 'The long side wall everyone can reach', to: 'The power rails' },
          ],
        },
        {
          id: 'b8',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q4-1-a', 'q4-1-b'],
        },
      ],
      summary: [
        'A breadboard is a rectangular board with a grid of holes into which components can be inserted and connected without soldering.',
        'It typically has two long rows of connected holes on either side, often coloured red and blue, called power rails.',
        'Resistors, capacitors, integrated circuits (ICs), LEDs and wires can be inserted into the middle holes.',
      ],
      examTip:
        'The phrase "without the need for soldering" is the part of the definition students leave out. It is the whole reason a breadboard exists, so include it.',
      confused: {
        simpler:
          'A breadboard is a plastic block with holes. Holes that are in the same short line are secretly joined together underneath. Push two wire ends into the same line and they are connected. That is all it does.',
      },
    },

    /* ------------------------------------------------------------ 4.2 -- */
    {
      id: 'l4-2',
      moduleId: 'm4',
      number: 2,
      title: 'Jumper wires',
      blurb: 'Three types, and why the difference matters when you are wiring.',
      minutes: 6,
      why: 'A short, easy set of marks, and knowing the three types stops you buying the wrong ones for a project.',
      prerequisites: ['l4-1'],
      objectives: [
        'Define a jumper wire',
        'State the three main types',
        'Say what each type is used to connect',
      ],
      concepts: [{ id: 'c-jumpers', title: 'Jumper wires' }],
      keyTerms: ['t-jumper'],
      blocks: [
        {
          id: 'b1',
          kind: 'definition',
          term: 'Jumper wire',
          simple: 'A short wire with a plug on each end, used to connect things on a breadboard.',
          technical: 'Wires with connectors at each end.',
          provenance: 'syllabus',
        },
        {
          id: 'b2',
          kind: 'prose',
          text: 'The syllabus states they are used to make connections **between different locations on the breadboard**, **between the breadboard and other components**, or **between two components**.\n\nThere are three main types, and the difference is simply which end has a pin and which end has a socket.',
        },
        {
          id: 'b3',
          kind: 'figure',
          figure: 'JumperFigure',
          caption: 'The three types. Tap each to see what it connects.',
          altSummary:
            'Three jumper wire types shown side by side. Male-to-male has a pin at both ends and connects breadboard hole to breadboard hole. Male-to-female has a pin at one end and a socket at the other, connecting a breadboard hole to a module pin. Female-to-female has a socket at both ends and connects two module pins together.',
        },
        {
          id: 'b4',
          kind: 'callout',
          variant: 'remember',
          title: 'Pin or socket',
          text: 'A **male** end is a pin that goes *into* something. A **female** end is a socket that something goes *into*. Male-to-male is what you use most on a breadboard, because breadboard holes are sockets.',
        },
        {
          id: 'b5',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q4-2-a'],
        },
      ],
      summary: [
        'Jumper wires are wires with connectors at each end.',
        'They connect different locations on the breadboard, the breadboard to other components, or two components together.',
        'There are three main types: male-to-male, male-to-female and female-to-female.',
      ],
      confused: {
        simpler: 'They are just wires with plugs on the ends. Three kinds, depending on whether each end is a pin or a hole.',
      },
    },

    /* ------------------------------------------------------------ 4.3 -- */
    {
      id: 'l4-3',
      moduleId: 'm4',
      number: 3,
      title: 'LEDs and resistors',
      blurb:
        'The two components in almost every circuit you will build, and why one is useless without the other.',
      minutes: 16,
      why: 'Three of the four practical applications in this syllabus use an LED with a resistor. Understanding *why* the resistor is there is worth more than memorising that it is.',
      prerequisites: ['l4-1'],
      objectives: [
        'Say what LED stands for and how it works',
        'Define a resistor and say what it controls',
        'Distinguish fixed resistors, variable resistors and LDRs',
        'Explain how the colour bands on a resistor are used',
      ],
      concepts: [
        { id: 'c-led', title: 'LEDs' },
        { id: 'c-resistor', title: 'Resistors' },
        { id: 'c-resistor-types', title: 'Types of resistor' },
        { id: 'c-ldr', title: 'The LDR' },
      ],
      keyTerms: ['t-led', 't-resistor', 't-ldr', 't-variable-resistor', 't-anode-cathode'],
      blocks: [
        {
          id: 'b1',
          kind: 'definition',
          term: 'LED',
          simple: 'A small light that only works one way round.',
          technical:
            'LED stands for Light Emitting Diode. It is a semiconductor light source that emits light when current flows through it.',
          provenance: 'syllabus',
        },
        {
          id: 'b2',
          kind: 'callout',
          variant: 'exam',
          title: 'Write out what the letters stand for',
          text: 'A question asking "what does LED stand for?" is asking for **Light Emitting Diode**, not "a small light". The word **diode** is the important one: a diode only lets current pass in one direction, which is why an LED connected backwards simply does nothing.',
        },
        {
          id: 'b3',
          kind: 'prose',
          text: 'That one-way behaviour is why every circuit description in this syllabus is careful about which leg goes where. The instruction repeated across all the practicals is:\n\n> the positive terminal of the [[t-led|LED]] should be connected to a [[t-digital-pin|digital pin]] of the Arduino board **through a resistor**, and the negative terminal to a [[t-gnd|GND]] pin.',
        },
        {
          id: 'b4',
          kind: 'figure',
          figure: 'LedFigure',
          caption:
            'An LED, its two legs, and what happens when you turn it around. Try both directions.',
          altSummary:
            'An LED drawing showing a long leg marked as the anode or positive terminal and a short leg marked as the cathode or negative terminal, with a flat spot on the rim of the lens beside the short leg. When wired with the long leg towards the positive supply through a resistor and the short leg to ground, current flows and the LED lights. When reversed, no current flows and the LED stays dark.',
        },
        {
          id: 'b5',
          kind: 'definition',
          term: 'Resistor',
          simple: 'A component that slows the flow of electricity down.',
          technical:
            'Designed to resist the flow of electric current, thereby controlling the voltage and current within the circuit.',
          provenance: 'syllabus',
        },
        {
          id: 'b6',
          kind: 'callout',
          variant: 'misconception',
          title: 'Why the LED needs the resistor',
          text: 'An LED has almost no resistance of its own. Connect it straight from a 5V pin to GND and it will try to draw far more current than it can survive, and it will be destroyed, sometimes instantly.\n\nThe syllabus is explicit in practical 1: **a resistor of about 100 ohms is used to reduce the 5V voltage coming from the Arduino board.** The resistor is not optional and it is not there to be tidy. It is what keeps the LED alive.',
        },
        {
          id: 'b7',
          kind: 'analogy',
          title: 'A narrow section in a pipe',
          analogy:
            'Water rushing straight from a high tank into a thin plastic tube will burst it. Put a narrow section of pipe in the way first and the flow is throttled to something the tube can handle. The narrow section wastes some pressure, and that is exactly the point.',
          mapping: [
            { from: 'Water pressure', to: 'Voltage' },
            { from: 'Rate of water flow', to: 'Current' },
            { from: 'The narrow section', to: 'The resistor' },
            { from: 'The thin tube that would burst', to: 'The LED' },
          ],
        },
        {
          id: 'b8',
          kind: 'prose',
          heading: 'Three types of resistor',
          text: 'The syllabus gives three, and the third one is a [[t-sensor|sensor]] in its own right.',
        },
        {
          id: 'b9',
          kind: 'gallery',
          title: 'Types of resistor',
          items: [
            {
              id: 'r-fixed',
              name: 'Fixed resistor',
              art: 'resistor-fixed',
              what: 'The resistance value does not change.',
              how: 'The colour bands marked on the resistor are used to calculate its value.',
              used: 'The 100 Ω resistor protecting an LED, or the 10 kΩ resistor in the LDR circuit.',
              tags: ['fixed value', 'colour bands'],
            },
            {
              id: 'r-var',
              name: 'Variable resistor',
              art: 'resistor-var',
              what: 'Allows resistance to be adjusted manually.',
              used: 'Used to control electrical characteristics such as volume, brightness or speed in various applications.',
              tags: ['adjustable'],
            },
            {
              id: 'r-ldr',
              name: 'LDR (Light Dependent Resistor)',
              art: 'ldr',
              what: 'Resistance varies significantly with the intensity of light falling on it.',
              how: 'Also known as a photoresistor.',
              used: 'Practical application 3 in this syllabus: sensing ambient light and switching an LED accordingly.',
              tags: ['light sensor', 'photoresistor'],
            },
          ],
        },
        {
          id: 'b10',
          kind: 'figure',
          figure: 'ResistorBandsFigure',
          caption:
            'The colour band system. Change the bands and watch the value change.',
          altSummary:
            'A resistor with four colour bands. The first two bands give the first two digits of the value, the third band gives the multiplier as a power of ten, and the fourth band gives the tolerance. Changing any band updates the calculated resistance in ohms.',
        },
        {
          id: 'b11',
          kind: 'callout',
          variant: 'remember',
          title: 'The LDR is a resistor that is also a sensor',
          text: 'This catches people out. The LDR sits in the *resistor* section of the syllabus, not the sensor section, but it behaves as a light sensor. Both are true: it is a resistor whose value depends on light, which is exactly what makes it usable as a sensor. Expect it in either kind of question.',
        },
        {
          id: 'b12',
          kind: 'sort',
          prompt: 'Which type of resistor would you use?',
          buckets: [
            { id: 'fixed', label: 'Fixed resistor' },
            { id: 'var', label: 'Variable resistor' },
            { id: 'ldr', label: 'LDR' },
          ],
          items: [
            {
              id: 'x1',
              label: 'Protecting an LED on a digital pin',
              bucket: 'fixed',
              why: 'The protection needed never changes, so a fixed value is right. The syllabus specifies about 100 Ω for this.',
            },
            {
              id: 'x2',
              label: 'A knob that changes the brightness of a lamp',
              bucket: 'var',
              why: 'A variable resistor allows resistance to be adjusted manually, and brightness is one of the uses the syllabus names.',
            },
            {
              id: 'x3',
              label: 'Making a streetlight switch itself on at dusk',
              bucket: 'ldr',
              why: 'Its resistance varies significantly with the intensity of light falling on it, so it can detect when it gets dark.',
            },
            {
              id: 'x4',
              label: 'Setting the sensitivity in an LDR divider circuit',
              bucket: 'fixed',
              why: 'The syllabus specifies about a 10 kΩ fixed resistor here, to control the sensitivity of the LDR.',
            },
          ],
        },
        {
          id: 'b13',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q4-3-a', 'q4-3-b', 'q4-3-c', 'q4-3-d'],
        },
      ],
      summary: [
        'LED stands for Light Emitting Diode: a semiconductor light source that emits light when current flows through it.',
        'The positive terminal connects to a digital pin through a resistor; the negative terminal connects to GND.',
        'A resistor resists the flow of electric current, thereby controlling voltage and current within the circuit.',
        'Fixed resistors have an unchanging value, read from their colour bands.',
        'Variable resistors can be adjusted manually, and are used to control volume, brightness or speed.',
        'An LDR, or photoresistor, has a resistance that varies significantly with the intensity of light falling on it.',
      ],
      examTip:
        'If you are asked to draw or describe an LED circuit, always mention the resistor and say why it is there. "Through a 100 Ω resistor to limit the current from the 5V supply" is a complete, marks-earning phrase.',
      confused: {
        simpler:
          'An LED is a light that only works one way round and burns out without help. A resistor is the help: it slows the electricity down. Three kinds of resistor: one that never changes, one you can turn, and one that changes by itself when the light changes.',
        reviewLessonId: 'l4-1',
      },
    },

    /* ------------------------------------------------------------ 4.4 -- */
    {
      id: 'l4-4',
      moduleId: 'm4',
      number: 4,
      title: 'Buzzers and servo motors',
      blurb: 'Two output devices: one that makes noise, one that moves to an exact angle.',
      minutes: 10,
      why: 'These are the two outputs besides the LED that the syllabus names, and the servo\'s three wires are a favourite short question.',
      prerequisites: ['l3-2'],
      objectives: [
        'Say what a buzzer is used for',
        'Say what a servo motor is used for',
        'Name the three servo wires and where each one connects',
      ],
      concepts: [
        { id: 'c-buzzer', title: 'Buzzers' },
        { id: 'c-servo', title: 'Servo motors' },
      ],
      keyTerms: ['t-buzzer', 't-servo', 't-pwm'],
      blocks: [
        {
          id: 'b1',
          kind: 'definition',
          term: 'Buzzer',
          simple: 'A small part that makes a sound when the Arduino tells it to.',
          technical:
            'A buzzer is used to get an audio signal as an output in Arduino projects.',
          provenance: 'syllabus',
          example:
            'An alarm that sounds when a flame sensor detects fire, or when a door is opened.',
        },
        {
          id: 'b2',
          kind: 'definition',
          term: 'Servo motor',
          simple:
            'A motor that turns to an exact angle you ask for and stays there, instead of just spinning.',
          technical:
            'Used in applications where precise angular movement is required, such as robotics, RC vehicles and camera gimbals.',
          provenance: 'syllabus',
        },
        {
          id: 'b3',
          kind: 'callout',
          variant: 'misconception',
          title: 'A servo is not an ordinary motor',
          text: 'An ordinary DC motor spins as long as you give it power, and you have no idea where it has got to. A servo takes an **angle** as an instruction, turns to that angle, and holds it. That is why the syllabus lists it under **precise angular movement**. If a project needs "turn 90 degrees and stop", that is a servo. If it needs "spin the wheel", that is a plain motor.',
        },
        {
          id: 'b4',
          kind: 'prose',
          heading: 'The three wires',
          text: 'The syllabus states there are three wires in a [[t-servo|servo motor]], and gives the connection for each.',
        },
        {
          id: 'b5',
          kind: 'figure',
          figure: 'ServoFigure',
          caption:
            'The three servo wires and where each goes. Drag the angle control to see it move.',
          altSummary:
            'A servo motor with three wires leaving it. The brown wire connects to a GND pin on the Arduino. The red wire connects to the 5V pin for power. The orange wire is the control wire and connects to a PWM-enabled digital pin such as D6 or D9. An arm on the servo rotates to the commanded angle.',
        },
        {
          id: 'b6',
          kind: 'steps',
          title: 'Wiring a servo motor',
          steps: [
            {
              label: 'Brown wire',
              text: 'Connect this to a ground (GND) pin on the Arduino.',
            },
            {
              label: 'Red wire',
              text: 'Connect this to the 5V pin on the Arduino for power.',
            },
            {
              label: 'Orange wire',
              text: 'This is the control wire. Connect it to a PWM-enabled digital pin on the Arduino, for example D6 or D9.',
            },
          ],
        },
        {
          id: 'b7',
          kind: 'callout',
          variant: 'remember',
          title: 'Brown, red, orange',
          text: 'Brown goes to ground, red goes to power, orange carries the instruction. The order on the connector is the same order as that sentence: **ground, power, signal**. Two of the three are just power; only the orange wire carries information.',
        },
        {
          id: 'b8',
          kind: 'order',
          prompt: 'Match each servo wire to its connection by putting them in this order: GND, 5V, control pin.',
          items: [
            { id: 'w1', label: 'Brown wire' },
            { id: 'w2', label: 'Red wire' },
            { id: 'w3', label: 'Orange wire' },
          ],
          correct: ['w1', 'w2', 'w3'],
          why: 'Brown to GND, red to 5V for power, orange to a PWM-enabled digital pin such as D6 or D9 as the control wire.',
        },
        {
          id: 'b9',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q4-4-a', 'q4-4-b'],
        },
      ],
      summary: [
        'A buzzer is used to get an audio signal as an output in Arduino projects.',
        'A servo motor is used where precise angular movement is required, such as robotics, RC vehicles and camera gimbals.',
        'A servo has three wires: brown to GND, red to 5V, and orange as the control wire to a PWM-enabled digital pin such as D6 or D9.',
      ],
      examTip:
        'The three servo wires are worth three marks and are easy to lose by giving the colours without the connections. Always write both: "brown → GND".',
      confused: {
        simpler:
          'A buzzer makes a noise. A servo is a motor that goes to an exact angle. The servo has three wires: two for power (brown to ground, red to 5V) and one to tell it the angle (orange).',
      },
    },
  ],
}
