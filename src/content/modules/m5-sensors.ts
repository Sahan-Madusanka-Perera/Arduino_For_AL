import type { Module } from '@/types/content'

/* Module 5 — Sensors.
   Source: syllabus pages 20–26. All twenty sensors, grouped here into four
   lessons so a student meets them in themes rather than as an alphabet of
   twenty unrelated modules. */

export const m5: Module = {
  id: 'm5',
  number: 5,
  title: 'Sensors',
  wire: 'violet',
  blurb:
    'Twenty sensors from the syllabus, grouped by what they detect. How each one works, and which pin type it needs.',
  outcomes: [
    'Explain what a sensor is and how a sensor reading reaches the Arduino',
    'Describe all twenty sensors in the syllabus and what each detects',
    'Explain in detail how the IR, ultrasonic and PIR sensors work',
    'Choose the right sensor for a described problem and justify it',
  ],
  lessons: [
    /* ------------------------------------------------------------ 5.1 -- */
    {
      id: 'l5-1',
      moduleId: 'm5',
      number: 1,
      title: 'How a sensor reading becomes a number',
      blurb:
        'Before the twenty sensors: the one idea that all of them share.',
      minutes: 12,
      why: 'Twenty sensors is a lot to memorise as separate facts. They are much easier once you see that every one of them does the same thing: turn something physical into a voltage the Arduino can read.',
      prerequisites: ['l3-2'],
      objectives: [
        'Explain the general principle every sensor works on',
        'Distinguish a digital sensor output from an analog one',
        'Trace a reading from the physical world to a number in a variable',
      ],
      concepts: [
        { id: 'c-sensor-principle', title: 'How sensors work' },
        { id: 'c-digital-analog-sensor', title: 'Digital vs analog sensor outputs' },
      ],
      keyTerms: ['t-sensor', 't-actuator', 't-adc', 't-analog-pin', 't-digital-pin'],
      blocks: [
        {
          id: 'b1',
          kind: 'prose',
          tone: 'lead',
          text: 'An Arduino cannot feel heat. It cannot see light. It cannot hear. All it can do is measure a **voltage** on one of its pins.\n\nSo every sensor, without exception, does the same job: it takes something physical and turns it into a voltage. Heat becomes volts. Light becomes volts. A magnet nearby becomes volts. Once you have seen this, the twenty [[t-sensor|sensors]] stop being twenty things to memorise and become twenty examples of one thing.',
        },
        {
          id: 'b2',
          kind: 'figure',
          figure: 'SensorChainFigure',
          caption:
            'The chain every sensor reading travels. Change the physical quantity at the left and follow it through.',
          altSummary:
            'A four-stage chain. A physical quantity such as temperature causes a change in the sensor, which produces a voltage on a pin, which the Arduino reads as either HIGH or LOW on a digital pin, or as a number from 0 to 1023 on an analog pin through the ADC, and which is finally stored in a variable in the program.',
        },
        {
          id: 'b3',
          kind: 'prose',
          heading: 'Two kinds of answer',
          text: 'Sensors give their answer in one of two shapes, and this decides which pin you wire them to.\n\nSome questions only have two answers. *Is there motion? Is the door closed? Is there a flame?* These sensors output a **digital** signal, HIGH or LOW, and you read them with `digitalRead()`.\n\nOther questions have a whole range of answers. *How bright is it? How hot is it? How wet is the soil?* These output an **analog** voltage somewhere between 0 and 5 volts, and you read them with `analogRead()`, which gives you a number from 0 to 1023.',
        },
        {
          id: 'b4',
          kind: 'callout',
          variant: 'remember',
          title: 'Yes-or-no goes to a digital pin, how-much goes to an analog pin',
          text: 'This one rule tells you where to wire almost any sensor. A reed switch answers yes or no, so it goes to a digital pin. An LM35 answers "how hot", so it goes to an analog pin. Some sensors, like the noise sensor, can give **either**, which is why the syllabus says it provides "an analog or digital signal".',
        },
        {
          id: 'b5',
          kind: 'sort',
          prompt: 'Would you wire each of these to a digital pin or an analog pin?',
          buckets: [
            { id: 'dig', label: 'Digital pin' },
            { id: 'ana', label: 'Analog pin' },
          ],
          items: [
            {
              id: 'sp1',
              label: 'A reed switch detecting whether a door is closed',
              bucket: 'dig',
              why: 'Closed or open. Two states only, so digitalRead() on a digital pin. This is practical 5 in the syllabus.',
            },
            {
              id: 'sp2',
              label: 'An LDR measuring how bright the room is',
              bucket: 'ana',
              why: 'Brightness is a range, so analogRead() on an analog pin, giving 0 (dark) to 1023 (bright).',
            },
            {
              id: 'sp3',
              label: 'An LM35 measuring room temperature',
              bucket: 'ana',
              why: 'Temperature is a range. The LM35 gives 10mV per °C, read as an analog voltage.',
            },
            {
              id: 'sp4',
              label: 'A PIR sensor detecting whether someone walked past',
              bucket: 'dig',
              why: 'Motion or no motion. Two states, so a digital pin.',
            },
            {
              id: 'sp5',
              label: 'A soil sensor measuring moisture content',
              bucket: 'ana',
              why: 'Moisture is a range: the whole point is knowing how dry the soil is, not just whether it is dry.',
            },
          ],
        },
        {
          id: 'b6',
          kind: 'callout',
          variant: 'misconception',
          title: 'A sensor is not an actuator',
          text: 'Module 1 introduced this pair and it matters again here. A **sensor** measures the world (input). An **actuator** changes the world (output). An LED, a buzzer, a servo and a motor are all actuators, not sensors, even though they appear in the same projects. If a question asks you to list sensors in a project and you include the LED, you lose the mark.',
        },
        {
          id: 'b7',
          kind: 'recall',
          prompt:
            'What does analogRead() return for a sensor sitting at 0 volts, and what does it return at 5 volts?',
          answer:
            '0 volts gives 0. 5 volts gives 1023. Everything in between is scaled linearly across that range, because the Arduino Uno has a 10-bit ADC with 1024 possible values.',
          hint: 'One end is zero. The other is one less than 1024.',
        },
        {
          id: 'b8',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q5-1-a', 'q5-1-b', 'q5-1-c'],
        },
      ],
      summary: [
        'Every sensor turns a physical quantity into a voltage the Arduino can read.',
        'Sensors that answer yes or no give a digital output, read with digitalRead() on a digital pin.',
        'Sensors that answer how much give an analog voltage between 0 and 5V, read with analogRead() on an analog pin, returning 0 to 1023.',
        'Sensors are inputs; actuators such as LEDs, buzzers, motors and servos are outputs.',
      ],
      examTip:
        'When a question describes a project, identify the sensors and actuators separately. "Input: ultrasonic sensor. Output: buzzer." That framing earns marks on almost any scenario question.',
      confused: {
        simpler:
          'The Arduino is blind, deaf and numb. It can only measure voltage on its pins. A sensor is anything that turns heat, light, sound or movement into a voltage so the Arduino can notice it.',
        reviewLessonId: 'l3-2',
      },
    },

    /* ------------------------------------------------------------ 5.2 -- */
    {
      id: 'l5-2',
      moduleId: 'm5',
      number: 2,
      title: 'Detecting things nearby',
      blurb: 'IR, ultrasonic, PIR, reed, touch, shock and tilt. Seven sensors that answer "is something there?"',
      minutes: 20,
      why: 'The IR and ultrasonic sensors are the two whose working principle the syllabus explains in most detail, which makes them the two most likely to be asked about in full.',
      prerequisites: ['l5-1'],
      objectives: [
        'Explain in full how an ultrasonic sensor measures distance',
        'Explain how an IR sensor detects objects',
        'Explain how a PIR sensor detects motion',
        'Describe the reed, touch, shock and tilt sensors',
      ],
      concepts: [
        { id: 'c-ir', title: 'IR sensor' },
        { id: 'c-ultrasonic', title: 'Ultrasonic sensor' },
        { id: 'c-pir', title: 'PIR motion sensor' },
        { id: 'c-reed', title: 'Magnetic / reed sensor' },
        { id: 'c-contact-sensors', title: 'Touch, shock and tilt sensors' },
      ],
      keyTerms: ['t-ir-sensor', 't-ultrasonic', 't-pir', 't-reed', 't-photodiode'],
      blocks: [
        {
          id: 'b1',
          kind: 'prose',
          heading: 'The ultrasonic sensor, in full',
          tone: 'lead',
          text: 'This one deserves the most attention, because the syllabus explains its working step by step, and a "describe how an [[t-ultrasonic|ultrasonic sensor]] measures distance" question wants every step.',
        },
        {
          id: 'b2',
          kind: 'figure',
          figure: 'UltrasonicFigure',
          caption:
            'An ultrasonic sensor measuring distance. Move the object and watch the pulse travel out and back.',
          altSummary:
            'An ultrasonic sensor with two openings, a transmitter and a receiver, faces an object. A burst of sound waves leaves the transmitter, travels through the air to the object, reflects off it, and returns to the receiver. The time taken for the round trip, combined with the speed of sound in air, gives the distance to the object.',
        },
        {
          id: 'b3',
          kind: 'steps',
          title: 'How an ultrasonic sensor works',
          steps: [
            {
              label: 'Two components',
              text: 'The sensor consists of two main components: a transmitter (emitter) and a receiver.',
            },
            {
              label: 'The burst goes out',
              text: 'The transmitter emits a burst of ultrasonic sound waves, typically at a frequency above the range of human hearing, above 20 kHz.',
            },
            {
              label: 'It travels and reflects',
              text: 'These sound waves travel through the air until they encounter an object and are reflected back to the sensor.',
            },
            {
              label: 'The receiver catches it',
              text: 'The receiver then picks up the reflected sound waves.',
            },
            {
              label: 'The time is measured',
              text: 'The sensor measures the time it takes for the sound waves to travel to the object and back.',
            },
            {
              label: 'Distance is calculated',
              text: 'Using the speed of sound in air, the sensor can calculate the distance to the object.',
            },
          ],
        },
        {
          id: 'b4',
          kind: 'analogy',
          title: 'A bat, or a shout across a valley',
          analogy:
            'Shout across a valley and count the seconds until the echo comes back. The longer you wait, the further away the far hillside is. You are doing arithmetic with the speed of sound and a stopwatch, and so is the sensor. Bats have been doing this for millions of years.',
          mapping: [
            { from: 'Your shout', to: 'The burst from the transmitter' },
            { from: 'The far hillside', to: 'The object' },
            { from: 'The echo you hear', to: 'The reflected waves reaching the receiver' },
            { from: 'Counting seconds', to: 'Measuring the round-trip time' },
            { from: 'Knowing sound travels ~340 m/s', to: 'Using the speed of sound in air' },
          ],
          limits:
            'One important difference: the sound has to travel *there and back*, so the distance to the object is half the total journey. Forgetting to halve it is the classic mistake.',
        },
        {
          id: 'b5',
          kind: 'callout',
          variant: 'exam',
          title: 'Above 20 kHz is the number to quote',
          text: 'The syllabus specifies the frequency as **above the range of human hearing (above 20 kHz)**. That is a precise, quotable fact and worth including whenever you describe this sensor. It is also why it is called *ultra*sonic: beyond sound we can hear.',
        },
        {
          id: 'b6',
          kind: 'prose',
          heading: 'The IR sensor',
          text: 'The infrared [[t-sensor|sensor]] **detects objects or measures distance by using infrared light.** The syllabus gives four points about it.',
        },
        {
          id: 'b6a',
          kind: 'figure',
          figure: 'IrFigure',
          caption:
            'An IR sensor over a floor. Move it closer and further away, and switch the surface underneath it.',
          altSummary:
            'An infrared sensor module carries two parts side by side: an IR LED, which is the transmitter, and a photodiode, which is the receiver. The IR LED shines infrared light down onto the surface below it. A pale floor reflects most of that light back up into the photodiode, so the sensor reports that something is in front of it. A black line absorbs the infrared instead of reflecting it, so almost nothing returns and the sensor reports nothing there. The reflection also weakens as the surface gets further away, because the light spreads out over the longer round trip.',
        },
        {
          id: 'b7',
          kind: 'steps',
          title: 'How an IR sensor works',
          steps: [
            {
              label: 'It emits and detects',
              text: 'Emits infrared light and detects its reflection from nearby objects.',
            },
            {
              label: 'It has two parts',
              text: 'Has two main parts: an IR LED, which is the transmitter, and a photodiode, which is the receiver.',
            },
            {
              label: 'It works without touching',
              text: 'Works without physical contact and is low-cost and energy-efficient.',
            },
            {
              label: 'Where it is used',
              text: 'Commonly used for obstacle detection, line-following robots, and proximity sensing.',
            },
          ],
        },
        {
          id: 'b8',
          kind: 'compare',
          title: 'IR sensor vs ultrasonic sensor',
          columns: ['IR sensor', 'Ultrasonic sensor'],
          rows: [
            { aspect: 'What it sends out', left: 'Infrared light', right: 'Ultrasonic sound waves above 20 kHz' },
            {
              aspect: 'The two parts',
              left: 'IR LED (transmitter) and photodiode (receiver)',
              right: 'Transmitter (emitter) and receiver',
            },
            {
              aspect: 'How it decides',
              left: 'Detects the reflection of the light it emitted',
              right: 'Measures the time for the sound to return, then uses the speed of sound',
            },
            {
              aspect: 'Typical use',
              left: 'Obstacle detection, line-following robots, proximity sensing',
              right: 'Measuring distance, obstacle-avoiding cars',
            },
          ],
        },
        {
          id: 'b9',
          kind: 'callout',
          variant: 'misconception',
          title: 'IR tells you something is there; ultrasonic tells you how far',
          text: 'Both detect obstacles, so students treat them as interchangeable. They are not. The IR sensor is mainly a **presence** detector: it sees a reflection or it does not. The ultrasonic sensor **measures time**, so it can give you an actual distance in centimetres. That is why line-following robots use IR and obstacle-avoiding cars use ultrasonic.',
        },
        {
          id: 'b10',
          kind: 'prose',
          heading: 'The PIR motion sensor',
          text: 'Used to detect motion, primarily by sensing the **infrared radiation (heat)** emitted by objects in its field of view. Widely used in security systems, automatic lighting, and various other applications where motion detection is required.\n\nThe explanation the syllabus gives is worth reading carefully: **all objects emit some level of IR radiation, which increases with temperature. The PIR sensor detects the change in IR levels when a warm object, such as a human or animal, moves in front of it.**',
        },
        {
          id: 'b10a',
          kind: 'figure',
          figure: 'PirFigure',
          caption:
            'A PIR watching a room. Walk the person across the field of view, then stop dragging and watch the output pin.',
          altSummary:
            'A PIR sensor mounted on a ceiling looks down over a cone-shaped field of view. Every object emits infrared radiation, and a warm body such as a person emits far more of it than the room behind them. As the person moves through the cone, the level of infrared reaching the sensor changes, and it is that change, not the presence of the person, that drives the output pin HIGH. When the person stops moving, the level becomes steady again and the pin falls back to LOW. A room-temperature object such as a cardboard box barely stands out from the background level, so moving it changes the reading far too little to trigger anything.',
        },
        {
          id: 'b11',
          kind: 'callout',
          variant: 'exam',
          title: 'PIR detects a change, not a presence',
          text: 'The word "change" is doing the work. A PIR sensor does not see that a person is there; it notices that the infrared level in front of it **changed**. This is why sitting perfectly still in a room can make an automatic light switch itself off: nothing changed, so as far as the sensor is concerned nothing is there.',
        },
        {
          id: 'b12',
          kind: 'prose',
          heading: 'Reed, touch, shock and tilt',
          text: 'Four more sensors that answer a yes-or-no question about the immediate surroundings.',
        },
        {
          id: 'b13',
          kind: 'gallery',
          title: 'Contact and position sensors',
          items: [
            {
              id: 'sn-reed',
              name: 'Magnetic / Reed sensor',
              art: 'reed',
              what: 'Used to detect the presence or absence of a magnetic field.',
              used: 'Commonly used in door and window sensors in security systems, proximity sensing, and various automation projects.',
              tags: ['magnet', 'security', 'practical 5'],
            },
            {
              id: 'sn-touch',
              name: 'Touch sensor',
              art: 'touch',
              what: 'Detects touch or proximity, allowing for a range of interactions with electronic devices.',
              used: 'Creating touch-sensitive buttons, interactive projects, or controlling devices through touch.',
              tags: ['touch', 'buttons'],
            },
            {
              id: 'sn-shock',
              name: 'Shock sensor',
              art: 'shock',
              what: 'Detects sudden impacts or vibrations.',
              used: 'Helps automate responses to impacts or vibrations, such as triggering alarms, recording data, or shutting down equipment.',
              tags: ['impact', 'vibration'],
            },
            {
              id: 'sn-tilt',
              name: 'Tilt sensor',
              art: 'tilt',
              what: 'Detects the orientation or tilt of an object.',
              used: 'Used to determine if an object is level, tilted, or has been moved.',
              tags: ['orientation'],
            },
          ],
        },
        {
          id: 'b14',
          kind: 'callout',
          variant: 'note',
          title: 'The reed sensor is the one you will actually build',
          text: 'Practical application 5 in this syllabus uses a reed switch to detect a door opening and closing. You will wire and program it in module 7, so it is worth remembering that it detects **the presence or absence of a magnetic field**: a magnet on the door, the switch on the frame.',
        },
        {
          id: 'b15',
          kind: 'explain',
          prompt:
            'Describe, step by step, how an ultrasonic sensor measures the distance to an object.',
          rubric: [
            'Names the two components: a transmitter (emitter) and a receiver',
            'Says the transmitter emits a burst of ultrasonic sound waves above 20 kHz',
            'Says the waves travel through air, hit the object and reflect back',
            'Says the receiver picks up the reflected waves',
            'Says the sensor measures the time taken for the round trip',
            'Says the distance is calculated using the speed of sound in air',
          ],
          modelAnswer:
            'The sensor has two main parts, a transmitter and a receiver. The transmitter emits a burst of ultrasonic sound waves, typically above 20 kHz, which is above the range of human hearing. These waves travel through the air until they meet an object, and are reflected back towards the sensor. The receiver picks up the reflected waves. The sensor measures the time taken for the sound to travel to the object and back again, and using the known speed of sound in air it calculates the distance to the object.',
        },
        {
          id: 'b16',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q5-2-a', 'q5-2-b', 'q5-2-c', 'q5-2-d'],
        },
      ],
      summary: [
        'Ultrasonic: a transmitter emits sound above 20 kHz, it reflects off an object, the receiver catches it, and the round-trip time plus the speed of sound gives the distance.',
        'IR: emits infrared light and detects its reflection. Two parts: IR LED (transmitter) and photodiode (receiver). Used for obstacle detection, line-following robots and proximity sensing.',
        'PIR: detects motion by sensing changes in the infrared radiation (heat) emitted by warm objects moving in its field of view.',
        'Reed: detects the presence or absence of a magnetic field. Used in door and window sensors.',
        'Touch: detects touch or proximity. Shock: detects sudden impacts or vibrations. Tilt: detects orientation or tilt.',
      ],
      examTip:
        'The ultrasonic sensor is worth learning as six numbered steps. Six steps means six potential marks in a "describe how" question, and the syllabus lays them out in exactly that order.',
      confused: {
        simpler:
          'All seven of these answer "is something near me?". The IR one shines invisible light and looks for the bounce. The ultrasonic one shouts and times the echo. The PIR one feels body heat moving. The other four detect a magnet, a finger, a bang and a tilt.',
        reviewLessonId: 'l5-1',
      },
    },

    /* ------------------------------------------------------------ 5.3 -- */
    {
      id: 'l5-3',
      moduleId: 'm5',
      number: 3,
      title: 'Measuring the environment',
      blurb:
        'Temperature, humidity, gas, soil, rain, flame, noise, colour and barometer. Nine sensors that answer "how much?"',
      minutes: 18,
      why: 'These are the sensors behind the agriculture, smart home and smart city applications from module 1, and the temperature sensor is the one you will program in practical 4.',
      prerequisites: ['l5-1'],
      objectives: [
        'Describe each of the nine environmental sensors and what it measures',
        'Explain how a gas sensor produces an electrical change',
        'Explain how a noise sensor gets from sound to a usable signal',
        'Match an environmental sensor to a real application',
      ],
      concepts: [
        { id: 'c-temp-sensor', title: 'Temperature and humidity sensors' },
        { id: 'c-gas-flame', title: 'Gas and flame sensors' },
        { id: 'c-soil-rain', title: 'Soil and rain sensors' },
        { id: 'c-noise-colour', title: 'Noise, colour and barometer sensors' },
      ],
      keyTerms: ['t-temp-sensor', 't-lm35', 't-humidity', 't-gas-sensor', 't-flame-sensor'],
      blocks: [
        {
          id: 'b1',
          kind: 'gallery',
          title: 'The nine environmental sensors',
          intro:
            'Each one turns something about the surroundings into a voltage. Tap any card for the detail.',
          items: [
            {
              id: 'sn-temp',
              name: 'Temperature sensor',
              art: 'temp',
              what: 'Used to monitor and log temperature data, control heating or cooling systems, and more.',
              how: 'The LM35 used in practical 4 gives an output voltage linearly proportional to Celsius temperature, at 10 mV per °C.',
              used: 'Practical application 4: switching a motor on and off depending on room temperature.',
              tags: ['analog', 'LM35', 'practical 4'],
            },
            {
              id: 'sn-hum',
              name: 'Humidity sensor',
              art: 'humidity',
              what: 'Measures the moisture level in the air.',
              used: 'Weather stations, greenhouse monitoring, and home automation systems.',
              tags: ['moisture in air'],
            },
            {
              id: 'sn-gas',
              name: 'Gas sensor',
              art: 'gas',
              what: 'Used to detect the presence of gases in an environment.',
              how: 'Works based on a chemical reaction that occurs when the target gas comes into contact with the sensor’s surface. This reaction causes a change in electrical properties, such as resistance or voltage, which can be measured and interpreted by a microcontroller like an Arduino.',
              used: 'Environmental monitoring, industrial safety and home security. Can detect carbon monoxide (CO), methane (CH₄), propane (C₃H₈), alcohol and more.',
              tags: ['chemical reaction', 'safety'],
            },
            {
              id: 'sn-flame',
              name: 'Flame sensor',
              art: 'flame',
              what: 'Detects the presence of fire or flame.',
              how: 'Typically detects the infrared (IR) light emitted by a flame. Usually sensitive to a specific wavelength range corresponding to the light flames emit, making them effective for fire detection.',
              used: 'Automates responses to fire, such as triggering alarms, activating sprinklers or shutting down equipment.',
              tags: ['infrared', 'fire'],
            },
            {
              id: 'sn-soil',
              name: 'Soil sensor',
              art: 'soil',
              what: 'Used to measure the moisture content of soil.',
              how: 'Can provide real-time data and automate watering processes based on soil moisture levels.',
              used: 'Gardening, agriculture and automated irrigation systems, ensuring plants receive the right amount of water.',
              tags: ['agriculture', 'irrigation'],
            },
            {
              id: 'sn-rain',
              name: 'Rain sensor',
              art: 'rain',
              what: 'Used to detect rainfall.',
              used: 'Automatically closing windows, activating windshield wipers, or controlling irrigation systems to conserve water.',
              tags: ['weather'],
            },
            {
              id: 'sn-noise',
              name: 'Noise sensor',
              art: 'noise',
              what: 'Detects sound levels and provides an analog or digital signal to an Arduino board.',
              how: 'A microphone captures sound waves, which are variations in air pressure, and converts them into electrical signals. Those signals are weak, so an onboard amplifier raises them to a usable level.',
              tags: ['microphone', 'amplifier'],
            },
            {
              id: 'sn-colour',
              name: 'Colour sensor',
              art: 'colour',
              what: 'Can detect and measure the colour of an object.',
              how: 'Typically works by shining light on the object and then measuring the reflected light.',
              tags: ['reflected light'],
            },
            {
              id: 'sn-baro',
              name: 'Barometer sensor',
              art: 'barometer',
              what: 'Measures atmospheric pressure.',
              tags: ['pressure', 'weather'],
            },
          ],
        },
        {
          id: 'b1a',
          kind: 'figure',
          figure: 'GasFigure',
          caption:
            'The gas sensor, one stage at a time. Raise the amount of gas in the air and follow it through to the reading.',
          altSummary:
            'A gas sensor has a heated sensing surface behind a steel mesh cap. When the target gas in the air reaches that surface, a chemical reaction takes place on it. The reaction changes an electrical property of the surface: its resistance falls as the concentration of gas rises. The sensor sits in a divider with a fixed resistor, so a falling resistance means a rising voltage, and the microcontroller reads that rising voltage on an analog pin as a number from 0 to 1023. Above a chosen threshold the program sounds a buzzer.',
        },
        {
          id: 'b2',
          kind: 'callout',
          variant: 'exam',
          title: 'The gas sensor answer has three stages',
          text: 'This one is asked as a "how does it work" question, and the syllabus gives a clean three-part chain: **the target gas contacts the sensor surface → a chemical reaction occurs → the reaction changes an electrical property such as resistance or voltage → the microcontroller measures that change**. Give all three stages and the mark is yours.',
        },
        {
          id: 'b3',
          kind: 'callout',
          variant: 'misconception',
          title: 'Humidity and soil moisture are different things',
          text: 'The **humidity sensor** measures moisture in the **air**. The **soil sensor** measures moisture in the **soil**. They sound similar and they answer different questions: one is about the weather, one is about whether the plants need water. A question about a greenhouse might need both.',
        },
        {
          id: 'b4',
          kind: 'figure',
          figure: 'Lm35Figure',
          caption:
            'The LM35 conversion from practical 4, one stage at a time. Drag the temperature.',
          altSummary:
            'A three-stage conversion. A temperature in degrees Celsius produces an output voltage at 10 millivolts per degree. The Arduino ADC turns that voltage into a reading from 0 to 1023. The program then multiplies the reading by 5.0 divided by 1023.0 to get volts, and multiplies by 100 to recover the temperature in Celsius.',
        },
        {
          id: 'b5',
          kind: 'callout',
          variant: 'remember',
          title: '10 mV per °C',
          text: 'This single number is the whole LM35. At 25 °C it outputs 250 mV, which is 0.25 V. Multiply volts by 100 and you have degrees back again, which is exactly what the line `float temperatureC = voltage * 100;` does in practical 4.',
        },
        {
          id: 'b6',
          kind: 'sort',
          prompt: 'Which sensor would each project need?',
          buckets: [
            { id: 'soil', label: 'Soil sensor' },
            { id: 'gas', label: 'Gas sensor' },
            { id: 'flame', label: 'Flame sensor' },
            { id: 'rain', label: 'Rain sensor' },
          ],
          items: [
            {
              id: 'e1',
              label: 'Watering a home garden only when the ground is actually dry',
              bucket: 'soil',
              why: 'Measures the moisture content of soil, and is used in automated irrigation systems for exactly this.',
            },
            {
              id: 'e2',
              label: 'An alarm in a kitchen if the gas cylinder leaks',
              bucket: 'gas',
              why: 'Detects the presence of gases such as methane and propane, and is used for home security and safety.',
            },
            {
              id: 'e3',
              label: 'Shutting down machinery automatically if a fire starts',
              bucket: 'flame',
              why: 'Detects the presence of fire or flame, and the syllabus names shutting down equipment as one of its uses.',
            },
            {
              id: 'e4',
              label: 'Closing a window by itself when the weather turns',
              bucket: 'rain',
              why: 'Detects rainfall. Automatically closing windows is the first use the syllabus lists for it.',
            },
          ],
        },
        {
          id: 'b7',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q5-3-a', 'q5-3-b', 'q5-3-c'],
        },
      ],
      summary: [
        'Temperature: monitors and logs temperature, controls heating or cooling. The LM35 gives 10 mV per °C.',
        'Humidity: measures moisture in the air, for weather stations, greenhouses and home automation.',
        'Gas: a chemical reaction with the target gas changes an electrical property such as resistance or voltage, which the microcontroller measures.',
        'Flame: detects the infrared light emitted by a flame, within a specific wavelength range.',
        'Soil: measures soil moisture content for gardening, agriculture and automated irrigation.',
        'Rain: detects rainfall, for closing windows, wipers and irrigation control.',
        'Noise: a microphone converts sound waves into electrical signals, amplified onboard to a usable level.',
        'Colour: shines light on an object and measures the reflected light.',
        'Barometer: measures atmospheric pressure.',
      ],
      examTip:
        'For any sensor question, the safest structure is: what it detects, how it detects it, and one application. Three sentences covers almost every mark scheme in this section.',
      confused: {
        simpler:
          'These nine all measure how much of something there is around you: how hot, how damp the air, what gas, is there fire, how damp the soil, is it raining, how loud, what colour, and what air pressure.',
        reviewLessonId: 'l5-1',
      },
    },

    /* ------------------------------------------------------------ 5.4 -- */
    {
      id: 'l5-4',
      moduleId: 'm5',
      number: 4,
      title: 'People, identity and movement',
      blurb: 'Fingerprint, pulse, accelerometer and RFID. Four sensors that identify or track.',
      minutes: 14,
      why: 'RFID has two named components and a clear working principle, which makes it a favourite question. The pulse sensor connects straight back to the healthcare application from module 1.',
      prerequisites: ['l5-1'],
      objectives: [
        'Describe the fingerprint and pulse sensors',
        'Explain what an accelerometer measures and along how many axes',
        'Name and describe the two components of an RFID system',
      ],
      concepts: [
        { id: 'c-biometric', title: 'Fingerprint and pulse sensors' },
        { id: 'c-accelerometer', title: 'Accelerometer' },
        { id: 'c-rfid', title: 'RFID' },
      ],
      keyTerms: ['t-fingerprint', 't-pulse', 't-accelerometer', 't-rfid'],
      blocks: [
        {
          id: 'b1',
          kind: 'gallery',
          title: 'Identity and movement sensors',
          items: [
            {
              id: 'sn-finger',
              name: 'Fingerprint sensor',
              art: 'fingerprint',
              what: 'Used to capture and recognise the unique patterns of a person’s fingerprint.',
              how: 'Works by capturing the unique patterns of ridges and valleys on a person’s fingertip. There are different types, such as optical, capacitive and ultrasonic, but they all serve the same purpose of scanning and comparing fingerprints.',
              tags: ['biometric', 'optical / capacitive / ultrasonic'],
            },
            {
              id: 'sn-pulse',
              name: 'Pulse sensor',
              art: 'pulse',
              what: 'Used to measure the heart rate of a person.',
              how: 'Typically uses optical methods to detect blood flow changes in the veins. Heartbeat sensors often use a technique called photoplethysmography (PPG).',
              used: 'Health monitoring systems, fitness trackers and various biomedical applications.',
              tags: ['heart rate', 'PPG', 'healthcare'],
            },
            {
              id: 'sn-accel',
              name: 'Accelerometer sensor',
              art: 'accel',
              what: 'Measures the acceleration forces acting on it, which can be used to determine changes in velocity and orientation.',
              how: 'Measures acceleration forces along three axes: X, Y and Z.',
              used: 'Motion detection, gesture recognition and vibration monitoring.',
              tags: ['three axes', 'X Y Z'],
            },
            {
              id: 'sn-rfid',
              name: 'RFID sensor',
              art: 'rfid',
              what: 'Radio Frequency Identification. Allows wireless communication between a tag and a reader.',
              used: 'Access control, inventory tracking and identification systems.',
              tags: ['reader + tag', 'wireless'],
            },
          ],
        },
        {
          id: 'b2',
          kind: 'prose',
          heading: 'RFID has exactly two components',
          text: 'The syllabus states that [[t-rfid|RFID]] systems consist of two main components, and names both.',
        },
        {
          id: 'b2a',
          kind: 'figure',
          figure: 'RfidFigure',
          caption:
            'A reader and a passive tag. Move the tag away and watch what a device with no battery can and cannot do.',
          altSummary:
            'An RFID system has exactly two components. The reader emits radio waves and receives signals back. The tag is a small passive device that contains a unique identifier and carries no battery of its own. Held close to the reader, the tag draws its power from the reader\u2019s radio waves, wakes up, and returns its unique identifier, which the reader displays. Moved out of range, the field is too weak to power it, so the tag stays silent and the reader gets nothing back.',
        },
        {
          id: 'b3',
          kind: 'steps',
          title: 'The two parts of an RFID system',
          steps: [
            {
              label: '1. RFID Reader',
              text: 'A device that emits radio waves and receives signals back from the RFID tags.',
            },
            {
              label: '2. RFID Tag',
              text: 'A small, passive device that contains a unique identifier.',
            },
          ],
        },
        {
          id: 'b4',
          kind: 'callout',
          variant: 'exam',
          title: 'The word "passive" is worth a mark',
          text: 'The syllabus describes the tag as **a small, passive device that contains a unique identifier**. Passive means it has no battery of its own: it is powered by the radio waves the reader sends out. That is why a bus card or a library book tag works forever and never needs charging.',
        },
        {
          id: 'b5',
          kind: 'analogy',
          title: 'RFID is a shout and an answer',
          analogy:
            'The reader shouts into the dark: "Anyone there?" Any tag close enough is woken up by the sound of the shout itself, and shouts back its own name. The reader hears the name and knows who it is.',
          mapping: [
            { from: 'The shout', to: 'Radio waves emitted by the reader' },
            { from: 'Being woken by the shout', to: 'The passive tag drawing its power from those waves' },
            { from: 'Shouting back a name', to: 'The tag returning its unique identifier' },
            { from: 'Recognising the name', to: 'Access control or inventory identification' },
          ],
        },
        {
          id: 'b5a',
          kind: 'prose',
          heading: 'The accelerometer',
          text: 'The accelerometer **measures the acceleration forces acting on it, which can be used to determine changes in velocity and orientation.** It does that **along three axes: X, Y and Z.**\n\nThree axes is what lets one small part answer several different questions. Held still, the only force acting on it is gravity, so the three readings tell you which way up it is. Moved suddenly, the three readings jump, and that is motion.',
        },
        {
          id: 'b5b',
          kind: 'figure',
          figure: 'AccelFigure',
          caption:
            'Tilt the board on either axis and watch gravity redistribute itself across X, Y and Z.',
          altSummary:
            'An accelerometer measures acceleration along three axes at right angles to each other, labelled X, Y and Z. Lying flat and at rest, the whole of gravity, one g, acts along the Z axis, and X and Y read close to zero. Rolling the board onto its side moves that force onto the X axis; tipping it end over end moves it onto the Y axis. At any angle the three readings together always resolve to the same single g, which is what lets the three numbers describe the orientation of the object.',
        },
        {
          id: 'b6',
          kind: 'callout',
          variant: 'remember',
          title: 'X, Y and Z',
          text: 'The accelerometer measures acceleration along **three** axes. If a question asks how many axes, the answer is three, and naming them X, Y and Z costs nothing extra.',
        },
        {
          id: 'b7',
          kind: 'recall',
          prompt: 'What are the two main components of an RFID system, and what does each do?',
          answer:
            'The RFID reader, a device that emits radio waves and receives signals back from the tags. And the RFID tag, a small passive device that contains a unique identifier.',
          hint: 'One does the asking, one does the answering.',
        },
        {
          id: 'b8',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q5-4-a', 'q5-4-b', 'q5-4-c'],
        },
      ],
      summary: [
        'Fingerprint sensor: captures and recognises the unique ridge and valley patterns of a fingertip. Types include optical, capacitive and ultrasonic.',
        'Pulse sensor: measures heart rate using optical methods to detect blood flow changes, often photoplethysmography (PPG). Used in health monitoring and fitness trackers.',
        'Accelerometer: measures acceleration forces along three axes, X, Y and Z, to determine changes in velocity and orientation. Used in motion detection, gesture recognition and vibration monitoring.',
        'RFID: wireless communication between a tag and a reader. The reader emits radio waves and receives signals back; the tag is a small passive device containing a unique identifier. Used for access control, inventory tracking and identification systems.',
      ],
      examTip:
        'RFID stands for Radio Frequency Identification. Writing the words out in full is often the first mark in the question.',
      confused: {
        simpler:
          'These four are about people and things. One reads your finger, one counts your heartbeat, one notices movement in three directions, and one reads a card without touching it.',
        reviewLessonId: 'l5-1',
      },
    },
  ],
}
