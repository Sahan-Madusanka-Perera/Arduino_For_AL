import type { Term } from '@/types/content'

/* The glossary. Every term a student meets in the course, with a plain-language
   sentence first and the exam-usable wording second. Terms are referenced from
   lesson prose as [[term-id]] and render as clickable chips. */

export const glossary: Term[] = [
  /* ---------------------------------------------------------- IoT ---- */
  {
    id: 't-iot',
    term: 'Internet of Things (IoT)',
    group: 'IoT',
    simple:
      'Everyday objects connected to the internet so they can send information and be controlled from far away.',
    technical:
      'A system of interconnected devices that communicate and exchange data over the internet.',
    example: 'A smart door lock you can open from your phone while you are at school.',
    related: ['t-sensor', 't-actuator', 't-cloud'],
    lessonId: 'l1-1',
  },
  {
    id: 't-sensor',
    term: 'Sensor',
    group: 'IoT',
    simple: 'A part that measures something about the world and turns it into a signal.',
    technical:
      'A device that collects data from the physical world, measuring parameters like temperature, humidity and pressure.',
    example: 'An LDR measuring how bright a room is.',
    related: ['t-actuator', 't-adc'],
    lessonId: 'l1-3',
  },
  {
    id: 't-actuator',
    term: 'Actuator',
    group: 'IoT',
    simple: 'A part that changes something in the world when the system tells it to.',
    technical:
      'A device that acts upon data, performing actions such as controlling lights or adjusting environmental conditions.',
    example: 'A relay switching a fan on when the temperature rises.',
    related: ['t-sensor'],
    lessonId: 'l1-3',
  },
  {
    id: 't-wifi',
    term: 'Wireless connectivity',
    group: 'IoT',
    simple: 'The ways devices talk to each other without wires.',
    technical:
      'Wireless communication technologies such as Wi-Fi, Bluetooth, Zigbee, Z-Wave, LoRa and NB-IoT, used by IoT devices to connect to the internet and to each other.',
    related: ['t-iot'],
    lessonId: 'l1-3',
  },
  {
    id: 't-cloud',
    term: 'Cloud computing',
    group: 'IoT',
    simple: 'Powerful computers elsewhere that store and process all the data your devices send.',
    technical:
      'Cloud platforms providing scalable infrastructure and services for storing, processing and analysing large volumes of IoT data, enabling centralised management, data aggregation and advanced analytics.',
    example: 'Amazon Web Services, Microsoft Azure.',
    related: ['t-edge', 't-latency'],
    lessonId: 'l1-3',
  },
  {
    id: 't-edge',
    term: 'Edge computing',
    group: 'IoT',
    simple: 'Doing the thinking on or near the device instead of sending everything far away.',
    technical:
      'Bringing computational power closer to the data source, enabling real-time analysis and decision-making by processing data locally on IoT devices or at the edge of the network, reducing latency and bandwidth usage.',
    example: 'Raspberry Pi, NVIDIA Jetson.',
    related: ['t-cloud', 't-latency', 't-raspberrypi'],
    lessonId: 'l1-3',
  },
  {
    id: 't-latency',
    term: 'Latency',
    group: 'IoT',
    simple: 'The delay between asking for something and getting an answer.',
    technical:
      'The time taken for data to travel and a response to return. Edge computing reduces latency by processing data locally rather than sending it to a remote server.',
    related: ['t-edge', 't-cloud'],
    lessonId: 'l1-3',
  },
  {
    id: 't-encryption',
    term: 'Encryption',
    group: 'IoT',
    simple: 'Scrambling data so only the right person can read it.',
    technical:
      'A security measure that, along with authentication and access control, protects IoT devices, data and networks from cyber threats and unauthorised access, ensuring integrity, confidentiality and availability.',
    example: 'AES encryption.',
    lessonId: 'l1-3',
  },
  {
    id: 't-industry40',
    term: 'Industry 4.0',
    group: 'IoT',
    simple: 'Factories where the machines report on themselves over the internet.',
    technical:
      'Another name for the industrial internet: IoT applied to manufacturing and industrial processes, enabling predictive maintenance, asset tracking, and real-time monitoring of equipment and production lines.',
    related: ['t-iot'],
    lessonId: 'l1-2',
  },
  {
    id: 't-smart-city',
    term: 'Smart city',
    group: 'IoT',
    simple: 'A city that uses connected sensors to run its services better.',
    technical:
      'Urban initiatives using IoT technologies to improve infrastructure and services, including smart traffic management, waste management, environmental monitoring sensors and adaptive streetlights.',
    lessonId: 'l1-2',
  },
  {
    id: 't-precision-farming',
    term: 'Precision farming',
    group: 'IoT',
    simple: 'Farming where sensors tell you exactly what each part of the field needs.',
    technical:
      'Agricultural techniques using IoT, such as soil monitoring, crop monitoring and automated irrigation systems, helping farmers optimise resource usage, increase yields and minimise environmental impact.',
    lessonId: 'l1-2',
  },
  {
    id: 't-calibration',
    term: 'Calibration',
    group: 'IoT',
    simple: 'Adjusting a sensor so its readings are actually correct.',
    technical:
      'The process of ensuring a sensor reports accurate values. Poor calibration produces inaccurate data, which affects decision-making and automation reliability.',
    lessonId: 'l1-4',
  },

  /* ------------------------------------------------------- embedded ---- */
  {
    id: 't-embedded',
    term: 'Embedded system',
    group: 'Embedded systems',
    simple: 'A small computer built into a machine to do one specific job.',
    technical:
      'A computer system designed to perform a specific task within a larger system, consisting of both hardware and software components that work together to carry out dedicated operations in real time.',
    example: 'The controller inside a washing machine.',
    related: ['t-ipo', 't-microcontroller'],
    lessonId: 'l2-1',
  },
  {
    id: 't-ipo',
    term: 'IPO model',
    group: 'Embedded systems',
    simple: 'Information comes in, gets worked on, and something comes out.',
    technical:
      'The Input, Process, Output model that embedded systems follow. Sensors capture the state of the physical world as inputs; the processor processes them according to a program and produces outputs.',
    related: ['t-embedded', 't-sensor', 't-actuator'],
    lessonId: 'l2-1',
  },
  {
    id: 't-realtime',
    term: 'Real time',
    group: 'Embedded systems',
    simple: 'Responding immediately, while it still matters.',
    technical:
      'Carrying out dedicated operations as events occur, rather than at some later point. Named in the definition of an embedded system.',
    lessonId: 'l2-1',
  },
  {
    id: 't-microcontroller',
    term: 'Microcontroller',
    group: 'Embedded systems',
    simple: 'A tiny complete computer on one chip, made to control one machine.',
    technical:
      'A small computer on a single circuit that includes a processor, memory and input/output ports, designed to control specific electronic devices or systems.',
    example: 'ATmega328P, ATmega2560, ESP8266.',
    related: ['t-microprocessor', 't-atmega328p', 't-flash'],
    lessonId: 'l2-2',
  },
  {
    id: 't-microprocessor',
    term: 'Microprocessor',
    group: 'Embedded systems',
    simple: 'The main thinking chip in a computer. Needs memory and other parts added around it.',
    technical:
      'A programmable integrated circuit (IC) that processes all the instructions and tasks involved in computing, serving as the brain of a computer or digital device by executing instructions from a program.',
    example: 'Intel Core, AMD Ryzen.',
    related: ['t-microcontroller', 't-ic'],
    lessonId: 'l2-3',
  },
  {
    id: 't-ic',
    term: 'Integrated circuit (IC)',
    group: 'Embedded systems',
    simple: 'A whole electronic circuit shrunk onto one small chip.',
    technical:
      'A circuit whose components are fabricated together on a single piece of semiconductor material. A microprocessor is described as a programmable integrated circuit.',
    lessonId: 'l2-3',
  },
  {
    id: 't-atmega328p',
    term: 'ATmega328P',
    group: 'Embedded systems',
    simple: 'The chip that runs the Arduino Uno.',
    technical:
      'The microcontroller at the heart of the Arduino Uno, handling all the processing, input/output control and program execution. It is an AVR chip.',
    related: ['t-microcontroller'],
    lessonId: 'l2-2',
  },
  {
    id: 't-flash',
    term: 'Flash / ROM',
    group: 'Embedded systems',
    simple: 'Memory that keeps your program even when the power is off.',
    technical:
      'Non-volatile memory built into a microcontroller, holding the uploaded program. The comparison table gives "has built-in Flash/ROM and RAM" as a property of microcontrollers.',
    lessonId: 'l2-4',
  },
  {
    id: 't-io-port',
    term: 'Input/output port',
    group: 'Embedded systems',
    simple: 'The chip’s connections to the outside world.',
    technical:
      'The pins through which a microcontroller reads inputs and drives outputs. Built into the chip in a microcontroller; supplied externally for a microprocessor.',
    lessonId: 'l2-2',
  },
  {
    id: 't-peripheral',
    term: 'Peripheral',
    group: 'Embedded systems',
    simple: 'An extra part connected to the processor.',
    technical:
      'A component outside the CPU such as memory, an ADC, a DAC or a timer. Microcontrollers include built-in I/O ports, ADC, DAC and timers; microprocessors need external components for I/O.',
    lessonId: 'l2-4',
  },

  /* ---------------------------------------------------------- boards ---- */
  {
    id: 't-devboard',
    term: 'Development board',
    group: 'Boards',
    simple: 'The physical board with the chip and everything it needs to run.',
    technical:
      'A circuit board that contains a microcontroller along with essential components such as a power supply, input/output interfaces, clock circuits, and sometimes communication ports or sensors.',
    related: ['t-devsystem'],
    lessonId: 'l3-1',
  },
  {
    id: 't-devsystem',
    term: 'Development system',
    group: 'Boards',
    simple: 'The board plus the software you need to program it.',
    technical:
      'A combination of hardware and software tools that help design, program and test microcontroller applications easily.',
    related: ['t-devboard', 't-ide'],
    lessonId: 'l3-1',
  },
  {
    id: 't-digital-pin',
    term: 'Digital I/O pin',
    group: 'Boards',
    simple: 'A pin that is only ever fully on or fully off.',
    technical:
      'A pin used to read digital signals such as ON/OFF from sensors, or to send digital signals to devices like LEDs, motors or relays. HIGH = 5V, LOW = 0V. Controlled with pinMode(), digitalRead() and digitalWrite().',
    related: ['t-high-low', 't-analog-pin'],
    lessonId: 'l3-2',
  },
  {
    id: 't-analog-pin',
    term: 'Analog pin',
    group: 'Boards',
    simple: 'A pin that can measure how much, not just yes or no.',
    technical:
      'A pin used to read varying analog signals from sensors and convert them into digital values using the built-in ADC. Reads voltage levels from 0 to 5 volts. Read with analogRead().',
    related: ['t-adc', 't-digital-pin'],
    lessonId: 'l3-2',
  },
  {
    id: 't-adc',
    term: 'ADC (Analog-to-Digital Converter)',
    group: 'Boards',
    simple: 'The part that turns a voltage into a number the program can use.',
    technical:
      'The Arduino’s built-in converter that turns an analog voltage between 0 and 5 volts into a whole number. On the Uno it is 10-bit, so analogRead() returns a value from 0 to 1023.',
    example: 'analogRead(A0) returning 0 in the dark and 1023 in bright light.',
    related: ['t-analog-pin', 't-aref'],
    lessonId: 'l3-2',
  },
  {
    id: 't-high-low',
    term: 'HIGH and LOW',
    group: 'Boards',
    simple: 'The only two states a digital pin can be in: on or off.',
    technical: 'The two states of a digital signal. HIGH = 5V. LOW = 0V.',
    related: ['t-digital-pin', 't-digitalwrite'],
    lessonId: 'l3-2',
  },
  {
    id: 't-oscillator',
    term: 'Oscillator',
    group: 'Boards',
    simple: 'The part that keeps the chip in time, like a metronome.',
    technical:
      'Provides a clock signal that helps the microcontroller run programs at a steady speed, ensuring it executes instructions, communicates with peripherals and manages timing functions accurately.',
    lessonId: 'l3-2',
  },
  {
    id: 't-gnd',
    term: 'GND (Ground)',
    group: 'Boards',
    simple: 'The 0 volt point that everything else is measured against.',
    technical:
      'Ground connections that act as the 0V reference point in a circuit. They complete the electrical path for current to flow and are used to connect the negative side of components. A board has several so multiple devices can share the same ground.',
    lessonId: 'l3-2',
  },
  {
    id: 't-ioref',
    term: 'IOREF pin',
    group: 'Boards',
    simple: 'A pin that tells add-on boards what voltage this Arduino uses.',
    technical:
      'Provides the operating voltage reference, usually 5V or 3.3V, for the input and output pins.',
    related: ['t-aref'],
    lessonId: 'l3-2',
  },
  {
    id: 't-aref',
    term: 'AREF (Analog Reference) pin',
    group: 'Boards',
    simple: 'A pin for feeding in a different top voltage for the ADC, to make readings more accurate.',
    technical:
      'Used to provide an external reference voltage for the analog-to-digital converter (ADC), which helps improve the accuracy of analog readings from sensors.',
    related: ['t-adc', 't-ioref'],
    lessonId: 'l3-2',
  },
  {
    id: 't-serial',
    term: 'Serial communication',
    group: 'Boards',
    simple: 'Sending data one bit at a time down a single wire.',
    technical:
      'Communication in which data is sent and received one bit at a time. On an Arduino the TX pin transmits and the RX pin receives.',
    example:
      'A phone sends an ON command over Bluetooth; the Arduino receives it through RX and replies through TX.',
    lessonId: 'l3-2',
  },
  {
    id: 't-vin',
    term: 'Vin pin',
    group: 'Boards',
    simple: 'A pin you can feed power into directly.',
    technical:
      'A pin to which an external power source within the specified voltage range can be connected as the positive, with GND as the negative, to power the board. The onboard voltage regulator regulates the input voltage to the required levels.',
    related: ['t-regulator'],
    lessonId: 'l3-3',
  },
  {
    id: 't-regulator',
    term: 'Voltage regulator',
    group: 'Boards',
    simple: 'A part that turns a varying input voltage into a steady output voltage.',
    technical:
      'An onboard component that regulates the input voltage to the levels required by the microcontroller and the other components on the board.',
    related: ['t-vin', 't-barrel-jack'],
    lessonId: 'l3-3',
  },
  {
    id: 't-barrel-jack',
    term: 'DC barrel jack',
    group: 'Boards',
    simple: 'The round socket you plug a power adapter into.',
    technical:
      'A socket accepting an external power supply, usually 7 to 12 volts, which the onboard voltage regulator brings down to the required levels.',
    related: ['t-regulator'],
    lessonId: 'l3-3',
  },
  {
    id: 't-esp32',
    term: 'ESP32',
    group: 'Boards',
    simple: 'A board with Wi-Fi built in, better than the ESP8266.',
    technical:
      'A board that builds upon the success of the ESP8266 by adding more features and capabilities, making it suitable for a wider range of applications.',
    lessonId: 'l3-4',
  },
  {
    id: 't-microbit',
    term: 'micro:bit',
    group: 'Boards',
    simple: 'A small board made for teaching children to code.',
    technical:
      'A board specifically designed for educational purposes, to introduce children to programming and electronics. Equipped with various sensors and components, and featuring a 5×5 LED matrix display for simple graphics, text and animations.',
    lessonId: 'l3-4',
  },
  {
    id: 't-raspberrypi',
    term: 'Raspberry Pi',
    group: 'Boards',
    simple: 'A small full computer, often used in projects that need more power.',
    technical:
      'Not strictly a microcontroller-based board, but widely used for embedded projects due to its versatility and power. Suitable for projects requiring more computational power or interfacing with complex peripherals. Also the syllabus example of edge computing.',
    related: ['t-edge', 't-microprocessor'],
    lessonId: 'l3-4',
  },
  {
    id: 't-magicbit',
    term: 'Magic Bit',
    group: 'Boards',
    simple: 'A Sri Lankan development board.',
    technical:
      'A Sri Lankan microcontroller-based development board that can be programmed using software like the Arduino IDE, MicroPython or MagicCode.',
    related: ['t-gavesha'],
    lessonId: 'l3-4',
  },
  {
    id: 't-gavesha',
    term: 'Gavesha platform',
    group: 'Boards',
    simple: 'A Sri Lankan development platform.',
    technical:
      'A Sri Lankan development platform, named in the syllabus alongside Magic Bit as evidence that Sri Lanka is creating development boards based on microcontrollers.',
    related: ['t-magicbit'],
    lessonId: 'l3-4',
  },

  /* ------------------------------------------------------ components ---- */
  {
    id: 't-breadboard',
    term: 'Breadboard',
    group: 'Components',
    simple: 'A board full of holes for building circuits without soldering.',
    technical:
      'A rectangular board with a grid of holes into which electronic components can be inserted and connected together without the need for soldering.',
    related: ['t-power-rail', 't-jumper'],
    lessonId: 'l4-1',
  },
  {
    id: 't-power-rail',
    term: 'Power rail',
    group: 'Components',
    simple: 'The long red and blue lines down each side of a breadboard.',
    technical:
      'The two long rows of connected holes on either side of a breadboard, often coloured red and blue, used to distribute power and ground across the circuit.',
    related: ['t-breadboard'],
    lessonId: 'l4-1',
  },
  {
    id: 't-soldering',
    term: 'Soldering',
    group: 'Components',
    simple: 'Joining electronic parts permanently with melted metal.',
    technical:
      'A permanent method of joining electronic components. A breadboard exists specifically so that circuits can be built and changed without it.',
    lessonId: 'l4-1',
  },
  {
    id: 't-jumper',
    term: 'Jumper wire',
    group: 'Components',
    simple: 'A short wire with a plug on each end.',
    technical:
      'Wires with connectors at each end, used to make connections between different locations on the breadboard, between the breadboard and other components, or between two components. Three main types exist.',
    related: ['t-breadboard'],
    lessonId: 'l4-2',
  },
  {
    id: 't-led',
    term: 'LED',
    group: 'Components',
    simple: 'A small light that only works one way round.',
    technical:
      'Light Emitting Diode. A semiconductor light source that emits light when current flows through it.',
    related: ['t-resistor', 't-anode-cathode'],
    lessonId: 'l4-3',
  },
  {
    id: 't-anode-cathode',
    term: 'Anode and cathode',
    group: 'Components',
    simple: 'The positive leg and the negative leg of an LED.',
    technical:
      'The positive and negative terminals of a diode. The positive terminal of an LED connects to a digital pin through a resistor, and the negative terminal to a GND pin.',
    related: ['t-led'],
    lessonId: 'l4-3',
  },
  {
    id: 't-resistor',
    term: 'Resistor',
    group: 'Components',
    simple: 'A part that slows the flow of electricity down.',
    technical:
      'A component designed to resist the flow of electric current, thereby controlling the voltage and current within the circuit.',
    example: 'The ~100 Ω resistor that protects an LED from the 5V pin.',
    related: ['t-led', 't-ldr', 't-variable-resistor'],
    lessonId: 'l4-3',
  },
  {
    id: 't-variable-resistor',
    term: 'Variable resistor',
    group: 'Components',
    simple: 'A resistor you can turn to change its value.',
    technical:
      'A resistor that allows resistance to be adjusted manually, used to control electrical characteristics such as volume, brightness or speed.',
    related: ['t-resistor'],
    lessonId: 'l4-3',
  },
  {
    id: 't-ldr',
    term: 'LDR (Light Dependent Resistor)',
    group: 'Components',
    simple: 'A resistor whose value changes when light falls on it.',
    technical:
      'A resistor whose resistance varies significantly with the intensity of light falling on it. Also known as a photoresistor.',
    example: 'Practical application 3: sensing ambient light to switch an LED.',
    related: ['t-resistor', 't-analogread'],
    lessonId: 'l4-3',
  },
  {
    id: 't-buzzer',
    term: 'Buzzer',
    group: 'Components',
    simple: 'A part that makes a sound when told to.',
    technical: 'A component used to get an audio signal as an output in Arduino projects.',
    related: ['t-actuator'],
    lessonId: 'l4-4',
  },
  {
    id: 't-servo',
    term: 'Servo motor',
    group: 'Components',
    simple: 'A motor that turns to an exact angle and stays there.',
    technical:
      'A motor used in applications where precise angular movement is required, such as robotics, RC vehicles and camera gimbals. It has three wires: brown to GND, red to 5V, and orange as the control wire to a PWM-enabled digital pin.',
    related: ['t-pwm', 't-actuator'],
    lessonId: 'l4-4',
  },
  {
    id: 't-pwm',
    term: 'PWM',
    group: 'Components',
    simple: 'Switching a pin on and off very fast so it behaves as if it were partly on.',
    technical:
      'Pulse Width Modulation. Available on certain digital pins, marked on the board, and used to control a servo motor or to vary the apparent brightness of an LED with analogWrite().',
    related: ['t-servo'],
    lessonId: 'l4-4',
  },
  {
    id: 't-relay',
    term: 'Relay',
    group: 'Components',
    simple: 'An electrically operated switch that lets a small signal control a big circuit.',
    technical:
      'A switch operated by a low-voltage signal, used so that an Arduino can control a high-voltage circuit. The syllabus notes a 230V fan can be operated by connecting a relay instead of the motor.',
    lessonId: 'l7-3',
  },

  /* --------------------------------------------------------- sensors ---- */
  {
    id: 't-ir-sensor',
    term: 'IR sensor',
    group: 'Sensors',
    simple: 'A sensor that shines invisible light and looks for the reflection.',
    technical:
      'Detects objects or measures distance using infrared light. Has two main parts: an IR LED (transmitter) and a photodiode (receiver). Works without physical contact and is low-cost and energy-efficient. Used for obstacle detection, line-following robots and proximity sensing.',
    related: ['t-photodiode', 't-ultrasonic'],
    lessonId: 'l5-2',
  },
  {
    id: 't-photodiode',
    term: 'Photodiode',
    group: 'Sensors',
    simple: 'A part that detects light and turns it into a signal.',
    technical: 'The receiver component of an IR sensor, which detects the reflected infrared light.',
    related: ['t-ir-sensor'],
    lessonId: 'l5-2',
  },
  {
    id: 't-ultrasonic',
    term: 'Ultrasonic sensor',
    group: 'Sensors',
    simple: 'A sensor that measures distance by timing an echo.',
    technical:
      'Uses sound waves to measure distance. A transmitter emits a burst of ultrasonic waves above 20 kHz, which reflect off an object and return to a receiver. The sensor measures the round-trip time and uses the speed of sound in air to calculate the distance.',
    related: ['t-ir-sensor'],
    lessonId: 'l5-2',
  },
  {
    id: 't-pir',
    term: 'PIR motion sensor',
    group: 'Sensors',
    simple: 'A sensor that notices when something warm moves in front of it.',
    technical:
      'Detects motion by sensing the infrared radiation (heat) emitted by objects in its field of view. All objects emit IR radiation, which increases with temperature; the sensor detects the change in IR levels when a warm object moves in front of it.',
    lessonId: 'l5-2',
  },
  {
    id: 't-reed',
    term: 'Reed sensor / magnetic sensor',
    group: 'Sensors',
    simple: 'A switch that closes when a magnet comes near.',
    technical:
      'Used to detect the presence or absence of a magnetic field. Commonly used in door and window sensors in security systems, proximity sensing and automation projects.',
    example: 'Practical application 5: detecting a door opening and closing.',
    related: ['t-pullup'],
    lessonId: 'l5-2',
  },
  {
    id: 't-temp-sensor',
    term: 'Temperature sensor',
    group: 'Sensors',
    simple: 'A sensor that measures how hot it is.',
    technical:
      'Used to monitor and log temperature data, control heating or cooling systems, and more.',
    related: ['t-lm35'],
    lessonId: 'l5-3',
  },
  {
    id: 't-lm35',
    term: 'LM35',
    group: 'Sensors',
    simple: 'A common temperature sensor that gives out a voltage.',
    technical:
      'A temperature sensor whose output voltage is linearly proportional to the Celsius temperature, with a scale factor of 10 mV per °C. Multiplying the voltage by 100 gives the temperature in Celsius.',
    example: 'Practical application 4: switching a motor on above 25 °C.',
    related: ['t-temp-sensor', 't-adc'],
    lessonId: 'l7-3',
  },
  {
    id: 't-humidity',
    term: 'Humidity sensor',
    group: 'Sensors',
    simple: 'A sensor that measures how damp the air is.',
    technical:
      'Measures the moisture level in the air. Used for weather stations, greenhouse monitoring and home automation systems.',
    lessonId: 'l5-3',
  },
  {
    id: 't-gas-sensor',
    term: 'Gas sensor',
    group: 'Sensors',
    simple: 'A sensor that detects gases in the air.',
    technical:
      'Detects the presence of gases in an environment. Works based on a chemical reaction when the target gas contacts the sensor’s surface, causing a change in electrical properties such as resistance or voltage, which a microcontroller can measure. Can detect CO, methane, propane, alcohol and more.',
    lessonId: 'l5-3',
  },
  {
    id: 't-flame-sensor',
    term: 'Flame sensor',
    group: 'Sensors',
    simple: 'A sensor that detects fire.',
    technical:
      'Detects the presence of fire or flame, typically by detecting the infrared light emitted by a flame within a specific wavelength range. Used to trigger alarms, activate sprinklers or shut down equipment.',
    lessonId: 'l5-3',
  },
  {
    id: 't-fingerprint',
    term: 'Fingerprint sensor',
    group: 'Sensors',
    simple: 'A sensor that reads your fingerprint.',
    technical:
      'Captures and recognises the unique patterns of ridges and valleys on a person’s fingertip. Optical, capacitive and ultrasonic types all serve the purpose of scanning and comparing fingerprints.',
    lessonId: 'l5-4',
  },
  {
    id: 't-pulse',
    term: 'Pulse sensor',
    group: 'Sensors',
    simple: 'A sensor that measures your heart rate.',
    technical:
      'Measures the heart rate of a person, typically using optical methods to detect blood flow changes in the veins. Often uses a technique called photoplethysmography (PPG). Used in health monitoring systems, fitness trackers and biomedical applications.',
    lessonId: 'l5-4',
  },
  {
    id: 't-accelerometer',
    term: 'Accelerometer',
    group: 'Sensors',
    simple: 'A sensor that detects movement and which way up something is.',
    technical:
      'Measures the acceleration forces acting on it along three axes, X, Y and Z, which can be used to determine changes in velocity and orientation. Used in motion detection, gesture recognition and vibration monitoring.',
    lessonId: 'l5-4',
  },
  {
    id: 't-rfid',
    term: 'RFID',
    group: 'Sensors',
    simple: 'A system that reads a card or tag without touching it.',
    technical:
      'Radio Frequency Identification. Allows wireless communication between a tag and a reader. The reader emits radio waves and receives signals back; the tag is a small, passive device containing a unique identifier. Used for access control, inventory tracking and identification systems.',
    lessonId: 'l5-4',
  },

  /* ----------------------------------------------------- programming ---- */
  {
    id: 't-ide',
    term: 'Arduino IDE',
    group: 'Programming',
    simple: 'The program on your computer for writing and sending Arduino code.',
    technical:
      'The Arduino Integrated Development Environment: a software application that provides a platform for writing, compiling and uploading code to Arduino-compatible microcontroller boards.',
    related: ['t-compiler', 't-hex'],
    lessonId: 'l6-1',
  },
  {
    id: 't-compiler',
    term: 'Compiler',
    group: 'Programming',
    simple: 'Software that translates your code into what the chip understands.',
    technical:
      'The Arduino IDE acts as a compiler because it translates the high-level code into machine code that runs directly on the microcontroller hardware. Compilation happens before the program runs.',
    related: ['t-machine-code', 't-hex'],
    lessonId: 'l6-1',
  },
  {
    id: 't-machine-code',
    term: 'Machine code',
    group: 'Programming',
    simple: 'The binary instructions the chip actually runs.',
    technical:
      'The binary instructions specific to the Arduino microcontroller, produced by the compiler and contained in the .hex file.',
    related: ['t-compiler', 't-hex'],
    lessonId: 'l6-1',
  },
  {
    id: 't-hex',
    term: '.hex file',
    group: 'Programming',
    simple: 'The translated file that gets sent to the board.',
    technical:
      'The binary file produced by a successful compile, containing the machine code specific to the Arduino microcontroller. It is transferred to the board over the USB cable.',
    related: ['t-compiler', 't-machine-code'],
    lessonId: 'l6-1',
  },
  {
    id: 't-setup',
    term: 'void setup()',
    group: 'Programming',
    simple: 'The part of the program that runs once at the start.',
    technical:
      'Used to initialise variables, pin modes and libraries. Run once when the Arduino board is powered on or reset.',
    related: ['t-loop', 't-pinmode'],
    lessonId: 'l6-2',
  },
  {
    id: 't-loop',
    term: 'void loop()',
    group: 'Programming',
    simple: 'The part of the program that runs over and over forever.',
    technical:
      'Runs repeatedly after void setup() has finished, reading inputs and triggering outputs in an endless loop until the board is powered off or reset.',
    related: ['t-setup'],
    lessonId: 'l6-2',
  },
  {
    id: 't-function',
    term: 'Function',
    group: 'Programming',
    simple: 'A named block of instructions you can run.',
    technical:
      'A named group of statements. setup() and loop() are the two fundamental functions of an Arduino sketch; pinMode(), digitalWrite() and analogRead() are built-in functions you call.',
    lessonId: 'l6-2',
  },
  {
    id: 't-case-sensitive',
    term: 'Case sensitive',
    group: 'Programming',
    simple: 'Capital letters and small letters count as different letters.',
    technical:
      'Arduino is a case sensitive language: digitalWrite and digitalwrite are different names, and only one of them exists.',
    lessonId: 'l6-3',
  },
  {
    id: 't-semicolon',
    term: 'Semicolon',
    group: 'Programming',
    simple: 'The mark that ends every instruction.',
    technical:
      'Arduino does not use indentation. Instead, a semicolon ( ; ) is used at the end of each instruction.',
    lessonId: 'l6-3',
  },
  {
    id: 't-comment',
    term: 'Comment',
    group: 'Programming',
    simple: 'A note in the code that the computer ignores.',
    technical:
      'Single-line comments start with //. Multi-line comments are enclosed in /* */.',
    lessonId: 'l6-3',
  },
  {
    id: 't-brace',
    term: 'Braces { }',
    group: 'Programming',
    simple: 'The curly brackets that mark where a block starts and ends.',
    technical:
      'Braces are used to define the beginning and end of function bodies and control structures.',
    lessonId: 'l6-3',
  },
  {
    id: 't-variable',
    term: 'Variable',
    group: 'Programming',
    simple: 'A named box that holds a value while the program runs.',
    technical:
      'In Arduino, when creating a variable, both its type and the name of the variable must be declared.',
    related: ['t-constant', 't-int', 't-float'],
    lessonId: 'l6-4',
  },
  {
    id: 't-constant',
    term: 'Constant',
    group: 'Programming',
    simple: 'A value that is fixed and can never change while the program runs.',
    technical: 'Declared as: const type CONSTANT_NAME = value;',
    example: 'const float temp = 25.0;  — the temperature threshold in practical 4.',
    related: ['t-variable'],
    lessonId: 'l6-4',
  },
  {
    id: 't-int',
    term: 'int',
    group: 'Programming',
    simple: 'A whole number. No decimal point.',
    technical:
      'An integer variable type. Anything after the decimal point is discarded, so 7 / 2 stored in an int gives 3.',
    related: ['t-float'],
    lessonId: 'l6-4',
  },
  {
    id: 't-float',
    term: 'float',
    group: 'Programming',
    simple: 'A number with a decimal point.',
    technical:
      'A floating-point variable type, needed for values such as voltages and temperatures that are not whole numbers.',
    example: 'float temperature = 24.5;',
    related: ['t-int'],
    lessonId: 'l6-4',
  },
  {
    id: 't-boolean',
    term: 'boolean',
    group: 'Programming',
    simple: 'A value that is either true or false.',
    technical: 'A variable type holding only true or false.',
    example: 'boolean ledState = true;',
    lessonId: 'l6-4',
  },
  {
    id: 't-byte',
    term: 'byte',
    group: 'Programming',
    simple: 'A small whole number from 0 to 255.',
    technical: 'A variable type holding a whole number in the range 0 to 255.',
    example: 'byte pin = 13;',
    lessonId: 'l6-4',
  },
  {
    id: 't-if',
    term: 'if / else if / else',
    group: 'Programming',
    simple: 'How a program chooses between different paths.',
    technical:
      'Arduino language uses if, else if and else to make decisions. Only one branch of the structure ever runs.',
    related: ['t-condition', 't-operator'],
    lessonId: 'l6-5',
  },
  {
    id: 't-condition',
    term: 'Condition',
    group: 'Programming',
    simple: 'A question with a true or false answer.',
    technical:
      'The expression inside the brackets of an if, while or for statement, which is evaluated as true or false.',
    lessonId: 'l6-5',
  },
  {
    id: 't-operator',
    term: 'Comparison operator',
    group: 'Programming',
    simple: 'A symbol that compares two values.',
    technical:
      'The operators >, <, >=, <=, == and !=. A single = assigns a value; a double == compares two values.',
    lessonId: 'l6-5',
  },
  {
    id: 't-for',
    term: 'for loop',
    group: 'Programming',
    simple: 'A loop that repeats a known number of times.',
    technical:
      'Has three parts separated by semicolons: initialisation, condition and update. for (int i = 0; i < 10; i++) runs its block ten times.',
    related: ['t-while', 't-iteration'],
    lessonId: 'l6-6',
  },
  {
    id: 't-while',
    term: 'while loop',
    group: 'Programming',
    simple: 'A loop that keeps going while something is true, checking first.',
    technical:
      'Tests its condition before running the block, so the block may run zero times if the condition is false at the start.',
    related: ['t-dowhile'],
    lessonId: 'l6-6',
  },
  {
    id: 't-dowhile',
    term: 'do-while loop',
    group: 'Programming',
    simple: 'A loop that runs once first, then keeps going while something is true.',
    technical:
      'Runs its block first and tests the condition afterwards, so the block always runs at least once.',
    related: ['t-while'],
    lessonId: 'l6-6',
  },
  {
    id: 't-iteration',
    term: 'Iteration',
    group: 'Programming',
    simple: 'Repeating something.',
    technical:
      'Repeated execution of a block of code. Arduino uses for, while and do...while loops for iteration.',
    lessonId: 'l6-6',
  },
  {
    id: 't-pinmode',
    term: 'pinMode()',
    group: 'Programming',
    simple: 'Tells the board whether a pin is an input or an output.',
    technical:
      'Configures the specified pin to behave either as an input or an output. OUTPUT means it can provide voltage to an external component like an LED.',
    example: 'pinMode(13, OUTPUT);',
    related: ['t-digitalwrite', 't-pullup'],
    lessonId: 'l7-1',
  },
  {
    id: 't-digitalwrite',
    term: 'digitalWrite()',
    group: 'Programming',
    simple: 'Turns a pin on or off.',
    technical:
      'Sets the specified digital pin to either HIGH or LOW. HIGH sets it to a high voltage level (5V on most Arduino boards); LOW sets it to 0V.',
    example: 'digitalWrite(13, HIGH);',
    related: ['t-high-low', 't-digitalread'],
    lessonId: 'l7-1',
  },
  {
    id: 't-digitalread',
    term: 'digitalRead()',
    group: 'Programming',
    simple: 'Checks whether a pin is on or off.',
    technical: 'Reads the state of a digital pin, returning HIGH or LOW.',
    example: 'if (digitalRead(2) == LOW) { ... }',
    related: ['t-digitalwrite', 't-pullup'],
    lessonId: 'l7-4',
  },
  {
    id: 't-analogread',
    term: 'analogRead()',
    group: 'Programming',
    simple: 'Measures how much voltage is on an analog pin, as a number.',
    technical:
      'Reads the analog voltage level on an analog pin and returns a value between 0 and 1023, using the built-in ADC.',
    example: 'int ldrValue = analogRead(A0);',
    related: ['t-adc', 't-analog-pin'],
    lessonId: 'l7-2',
  },
  {
    id: 't-delay',
    term: 'delay()',
    group: 'Programming',
    simple: 'Makes the program wait.',
    technical:
      'Pauses the program for the amount of time specified in milliseconds. 1000 milliseconds is equal to 1 second.',
    example: 'delay(1000);',
    lessonId: 'l7-1',
  },
  {
    id: 't-pullup',
    term: 'INPUT_PULLUP',
    group: 'Programming',
    simple: 'Holds a pin at 5V so it reads HIGH when nothing is connected.',
    technical:
      'A pin mode in which an internal pull-up resistor ensures the pin reads HIGH when it is not connected to anything. When connected to ground, through a switch closing, it reads LOW.',
    related: ['t-floating', 't-reed', 't-digitalread'],
    lessonId: 'l7-4',
  },
  {
    id: 't-floating',
    term: 'Floating pin',
    group: 'Programming',
    simple: 'An input pin connected to nothing, which reads random values.',
    technical:
      'An input pin that is neither at 0V nor at 5V, picking up electrical noise so that digitalRead returns unpredictable values. Pull-up resistors exist to prevent this.',
    related: ['t-pullup'],
    lessonId: 'l7-4',
  },
  {
    id: 't-threshold',
    term: 'Threshold',
    group: 'Programming',
    simple: 'The value at which the program decides to do something different.',
    technical:
      'The value a reading is compared against in a decision. The syllabus notes that the threshold of 200 in the LDR practical can be adjusted to suit specific lighting conditions.',
    lessonId: 'l7-2',
  },
  {
    id: 't-tinkercad',
    term: 'Tinkercad',
    group: 'Programming',
    simple: 'A free website where you can build Arduino circuits without owning one.',
    technical:
      'A web platform the syllabus recommends: if you do not have a physical Arduino board, you can create the required circuit, write the corresponding code and observe the performance.',
    lessonId: 'l7-5',
  },
  {
    id: 't-cnc',
    term: 'CNC',
    group: 'Programming',
    simple: 'A machine whose movements are controlled by a computer program.',
    technical:
      'Computer Numerical Control. A CNC plotter is a machine that can draw or engrave on various surfaces using a pen or a cutting tool.',
    lessonId: 'l7-5',
  },
]

export const glossaryById = new Map(glossary.map((t) => [t.id, t]))
