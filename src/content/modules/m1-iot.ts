import type { Module } from '@/types/content'

/* Module 1 — Internet of Things.
   Source: syllabus pages 1–6. Definitions and key points are the syllabus's
   own; the analogies, misconceptions and questions are written for this
   course to make them learnable. */

export const m1: Module = {
  id: 'm1',
  number: 1,
  title: 'The Internet of Things',
  wire: 'blue',
  blurb:
    'Everyday objects that talk to each other over the internet. What that actually means, where it is already used, what makes it possible, and what still goes wrong.',
  outcomes: [
    'Define the Internet of Things in the exact words an examiner will accept',
    'Give examples of IoT in eight different fields',
    'Name the six technologies that make IoT possible and say what each one does',
    'Explain the six challenges IoT still faces',
  ],
  lessons: [
    /* ------------------------------------------------------------ 1.1 -- */
    {
      id: 'l1-1',
      moduleId: 'm1',
      number: 1,
      title: 'What the Internet of Things actually is',
      blurb: 'Start here. No prior knowledge needed at all.',
      minutes: 12,
      why: 'Everything else in this unit sits on top of this one idea. The boards, the sensors and the code you will meet later are the parts an IoT system is built from, so it pays to know what you are building towards.',
      objectives: [
        'Say what the Internet of Things is in one sentence',
        'Recognise an IoT device when you see one',
        'List the key points the syllabus gives about how IoT devices work',
      ],
      concepts: [
        { id: 'c-iot-def', title: 'Definition of IoT' },
        { id: 'c-iot-keypoints', title: 'How IoT devices work' },
      ],
      keyTerms: ['t-iot', 't-sensor', 't-wifi'],
      blocks: [
        {
          id: 'b1',
          kind: 'prose',
          tone: 'lead',
          text: 'Think about the objects around you right now. A light switch. A fan. A door lock. A water tank. On their own, each one just sits there. You have to walk over and operate it yourself, and if you are not in the room, you have no idea what it is doing.',
        },
        {
          id: 'b2',
          kind: 'prose',
          text: 'Now imagine each of those objects had two extra abilities: it could **measure** something about the world, and it could **send that measurement over the internet**. The light switch could report whether it is on. The water tank could report how full it is. And you could send an instruction back from your phone, from anywhere.\n\nThat is the whole idea. Ordinary objects, connected to the internet, sending and receiving data. We call it the Internet of Things.',
        },
        {
          id: 'b3',
          kind: 'definition',
          term: 'Internet of Things (IoT)',
          simple:
            'Everyday objects that are connected to the internet so they can send information and be controlled from far away.',
          technical:
            'A system of interconnected devices that communicate and exchange data over the internet.',
          provenance: 'syllabus',
          example:
            'A smart water tank sensor that measures the water level every minute and sends the reading to an app on your phone.',
        },
        {
          id: 'b4',
          kind: 'callout',
          variant: 'exam',
          title: 'Learn this sentence',
          text: 'The technical definition above is the wording the syllabus uses. If a question asks "What is IoT?", write that sentence. Two things must appear in your answer: **interconnected devices** and **exchange data over the internet**. An answer that only says "devices connected to the internet" is missing half the idea, because the point is that they talk to each other and to you.',
        },
        {
          id: 'b5',
          kind: 'analogy',
          title: 'A school with a phone in every classroom',
          analogy:
            'Picture a school where no classroom has a phone. To find out whether Class 12B needs more chairs, someone has to physically walk there and look. Now give every classroom a phone and a person who reports in. Suddenly the office knows the state of every room without leaving the office, and can send an instruction to any room instantly.',
          mapping: [
            { from: 'Each classroom', to: 'Each IoT device' },
            { from: 'The person who reports in', to: 'The sensor, which measures something' },
            { from: 'The phone line', to: 'Wi-Fi, Bluetooth or another network' },
            { from: 'The office', to: 'The cloud, where all the data is collected' },
            { from: 'Sending an instruction back', to: 'Controlling the device remotely' },
          ],
          limits:
            'The analogy breaks down in one way: classrooms only talk to the office. In a real IoT system, devices often talk directly to each other too, with no office in the middle.',
        },
        {
          id: 'b6',
          kind: 'figure',
          figure: 'IotLoopFigure',
          caption: 'The loop every IoT system runs. Click any stage to see what happens there.',
          altSummary:
            'A four-stage cycle: a sensor measures the physical world, the device sends the data over a network, software analyses it, and an instruction is sent back to control something. The cycle then repeats.',
        },
        {
          id: 'b7',
          kind: 'prose',
          heading: 'The six key points',
          text: 'The syllabus lists six things that are true of IoT systems. Read them once, then try to recall them before you look again.',
        },
        {
          id: 'b8',
          kind: 'steps',
          title: 'What the syllabus says about IoT devices',
          steps: [
            {
              label: 'They connect smoothly',
              text: 'Devices connect through Wi-Fi, Bluetooth or other networks so data can be exchanged continuously, without interruption.',
            },
            {
              label: 'They work together',
              text: 'Different devices and different systems are made to work together efficiently, even when they were built by different companies.',
            },
            {
              label: 'The data is analysed',
              text: 'Sensor data that has been collected is analysed using algorithms, so it turns into useful insight rather than a pile of numbers.',
            },
            {
              label: 'Sensors watch the environment',
              text: 'Sensors detect environmental factors such as temperature, motion and humidity.',
            },
            {
              label: 'They need strong protection',
              text: 'Strong security is required to prevent data breaches and cyberattacks.',
            },
            {
              label: 'They are easy to control',
              text: 'Control through apps or voice commands keeps the user experience smooth.',
            },
          ],
        },
        {
          id: 'b9',
          kind: 'recall',
          prompt:
            'Without scrolling up: name three of the six key points the syllabus gives about IoT devices.',
          answer:
            'Any three of: they connect smoothly through Wi-Fi, Bluetooth or other networks for continuous data exchange · different devices and systems work together efficiently · collected sensor data is analysed using algorithms to produce useful insights · sensors detect environmental factors like temperature, motion and humidity · strong protection is required against data breaches and cyberattacks · easy control through apps or voice commands.',
          hint: 'Two are about connecting, one is about the data, one is about sensors, one is about safety, one is about you.',
        },
        {
          id: 'b10',
          kind: 'callout',
          variant: 'misconception',
          title: 'A phone is not an IoT device',
          text: 'Your smartphone connects to the internet, so it is tempting to call it IoT. It is not. A phone is a general-purpose computer that a person operates directly. An IoT device is a **thing** whose main job is something else entirely (locking a door, watering a field, measuring a heartbeat) that has been given the ability to connect. The phone is usually the thing you *control* IoT devices with, not one of them.',
        },
        {
          id: 'b11',
          kind: 'sort',
          prompt: 'Which of these are IoT devices, and which are not?',
          buckets: [
            { id: 'iot', label: 'IoT device' },
            { id: 'not', label: 'Not IoT' },
          ],
          items: [
            {
              id: 's1',
              label: 'A door lock you can open from your phone',
              bucket: 'iot',
              why: 'Its job is locking a door. Connecting it to the internet is the extra ability that makes it IoT.',
            },
            {
              id: 's2',
              label: 'A desktop computer',
              bucket: 'not',
              why: 'A general-purpose computer that a person operates directly. It is a computer, not a connected thing.',
            },
            {
              id: 's3',
              label: 'A fitness band that uploads your heart rate',
              bucket: 'iot',
              why: 'A wearable whose job is measuring your body, sending that data onward. The syllabus lists exactly this under healthcare.',
            },
            {
              id: 's4',
              label: 'A calculator',
              bucket: 'not',
              why: 'It has no sensors and no network connection. Nothing about it is interconnected.',
            },
            {
              id: 's5',
              label: 'A soil moisture sensor that waters a field automatically',
              bucket: 'iot',
              why: 'It senses the environment, sends the data, and an action is taken as a result. The full IoT loop.',
            },
            {
              id: 's6',
              label: 'A television remote control',
              bucket: 'not',
              why: 'It sends infrared to a TV a metre away. There is no internet and no data exchange, so it is not IoT.',
            },
          ],
        },
        {
          id: 'b12',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q1-1-a', 'q1-1-b', 'q1-1-c'],
        },
      ],
      summary: [
        'IoT is a system of interconnected devices that communicate and exchange data over the internet.',
        'Devices connect over Wi-Fi, Bluetooth or other networks and exchange data continuously.',
        'Sensors detect environmental factors such as temperature, motion and humidity.',
        'Collected data is analysed by algorithms to produce useful insights.',
        'Strong security is needed, and control usually happens through an app or voice.',
      ],
      examTip:
        'The word "interconnected" is doing real work in the definition. Devices in an IoT system do not just each have an internet connection; they exchange data with each other and with a central system. Say so.',
      confused: {
        simpler:
          'Forget the word "internet" for a second. IoT just means: give an ordinary object a way to measure something, and a way to send that measurement somewhere. That is it. A thermometer that writes its readings into an app instead of onto paper is IoT.',
        analogy:
          'A normal fan has no idea how hot the room is. An IoT fan has a thermometer inside, checks the temperature every minute, sends the number to the internet, and switches itself on when the room gets hot. Same fan. It just gained a sense and a voice.',
      },
    },

    /* ------------------------------------------------------------ 1.2 -- */
    {
      id: 'l1-2',
      moduleId: 'm1',
      number: 2,
      title: 'Where IoT is already being used',
      blurb: 'Eight fields, straight from the syllabus, with what IoT actually does in each.',
      minutes: 15,
      why: 'Application questions are common, and they are easy marks if you can name the field and give a concrete example. This lesson turns eight abstract headings into eight things you can picture.',
      prerequisites: ['l1-1'],
      objectives: [
        'Name the eight IoT application areas in the syllabus',
        'Give a concrete example of IoT in each one',
        'Match an unfamiliar scenario to the right application area',
      ],
      concepts: [
        { id: 'c-iot-apps', title: 'IoT application areas' },
        { id: 'c-industry40', title: 'Industry 4.0' },
      ],
      keyTerms: ['t-industry40', 't-smart-city', 't-precision-farming'],
      blocks: [
        {
          id: 'b1',
          kind: 'prose',
          tone: 'lead',
          text: 'The syllabus names eight fields where IoT is already in use. You do not need to memorise every sentence. You need to be able to name the field, say what IoT does there, and give one example.',
        },
        {
          id: 'b2',
          kind: 'gallery',
          title: 'The eight application areas',
          intro:
            'Tap any card to open it. Each one gives you the field, what IoT does there, and an example you could write in an answer.',
          items: [
            {
              id: 'a-home',
              name: 'Smart Homes',
              art: 'home',
              what: 'IoT devices are used in smart homes to enhance convenience, safety and energy efficiency.',
              used: 'Smart thermostats, lighting systems, security cameras, door locks, and appliances controlled remotely by smartphone app or voice command.',
              tags: ['convenience', 'safety', 'energy'],
            },
            {
              id: 'a-health',
              name: 'Healthcare',
              art: 'health',
              what: 'Used for remote patient monitoring, medication management, and improving the efficiency of healthcare delivery.',
              used: 'Wearables such as smartwatches and fitness trackers track vital signs, activity levels and sleep patterns, giving valuable data to both patients and healthcare providers.',
              tags: ['monitoring', 'wearables'],
            },
            {
              id: 'a-industry',
              name: 'Industrial Internet',
              art: 'industry',
              what: 'Also known as Industry 4.0. IoT is revolutionising manufacturing by enabling predictive maintenance, asset tracking, and real-time monitoring of equipment and production lines.',
              used: 'A factory motor that reports its own vibration, so it is repaired before it fails rather than after.',
              how: 'This improves efficiency, reduces downtime, and enhances overall productivity.',
              tags: ['Industry 4.0', 'predictive maintenance'],
            },
            {
              id: 'a-city',
              name: 'Smart Cities',
              art: 'city',
              what: 'IoT technologies are used in smart city initiatives to improve urban infrastructure and services.',
              used: 'Smart traffic management systems, waste management solutions, environmental monitoring sensors, and smart streetlights that adjust brightness based on usage patterns and natural light levels.',
              tags: ['infrastructure', 'public services'],
            },
            {
              id: 'a-agri',
              name: 'Agriculture',
              art: 'agri',
              what: 'IoT is transforming agriculture through precision farming techniques such as soil monitoring, crop monitoring and automated irrigation systems.',
              used: 'A soil moisture sensor in a paddy field that opens a valve only when the soil is actually dry.',
              how: 'Helps farmers optimise resource usage, increase crop yields, and minimise environmental impact.',
              tags: ['precision farming', 'irrigation'],
            },
            {
              id: 'a-retail',
              name: 'Retail',
              art: 'retail',
              what: 'Used to enhance the customer experience, streamline operations, and gather valuable insights into consumer behaviour.',
              used: 'Smart shelves that automatically track inventory levels, beacons that send personalised offers to shoppers’ smartphones, and cashier-less checkout systems.',
              tags: ['inventory', 'customer experience'],
            },
            {
              id: 'a-energy',
              name: 'Energy Management',
              art: 'energy',
              what: 'IoT devices monitor and control energy usage in buildings, factories and utilities.',
              used: 'Smart meters, energy management systems and grid optimisation technologies that optimise consumption, reduce costs and minimise environmental impact.',
              tags: ['smart meters', 'grid'],
            },
            {
              id: 'a-transport',
              name: 'Transportation and Logistics',
              art: 'transport',
              what: 'Used in logistics for fleet management, vehicle tracking, route optimisation and predictive maintenance.',
              used: 'A delivery company tracking every lorry to reduce fuel consumption, improve safety and optimise supply chain operations.',
              tags: ['fleet', 'tracking'],
            },
          ],
        },
        {
          id: 'b3',
          kind: 'callout',
          variant: 'remember',
          title: 'A memory hook for all eight',
          text: 'Walk through a day. You wake in a **home**, check your **health** band, travel by **transport**, past **city** streetlights, to a **factory** (industry). Food came from **agriculture**, was sold in **retail**, and every building on the way is watched by **energy** management. Eight fields, one day.',
        },
        {
          id: 'b4',
          kind: 'recall',
          prompt: 'Name as many of the eight IoT application areas as you can before revealing.',
          answer:
            'Smart homes · Healthcare · Industrial internet (Industry 4.0) · Smart cities · Agriculture · Retail · Energy management · Transportation and logistics.',
          hint: 'Use the day-walk: home, health, transport, city, industry, agriculture, retail, energy.',
        },
        {
          id: 'b5',
          kind: 'prose',
          heading: 'Industry 4.0 deserves its own paragraph',
          text: 'Of the eight, this is the one most likely to appear as a named term. **Industry 4.0** is another name for the industrial internet: applying IoT to manufacturing so that machines report their own condition. The three things the syllabus names it for are **predictive maintenance**, **asset tracking**, and **real-time monitoring** of equipment and production lines.',
        },
        {
          id: 'b6',
          kind: 'analogy',
          title: 'Predictive maintenance, in one sentence',
          analogy:
            'It is the difference between waiting for your bicycle chain to snap on the way to school, and noticing last week that it had started making a noise.',
          mapping: [
            { from: 'The noise you noticed', to: 'Sensor data from the machine' },
            { from: 'Deciding it will snap soon', to: 'The algorithm predicting failure' },
            { from: 'Fixing it on Sunday', to: 'Scheduled maintenance before breakdown' },
            { from: 'Not being stranded', to: 'Reduced downtime' },
          ],
        },
        {
          id: 'b7',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q1-2-a', 'q1-2-b', 'q1-2-c'],
        },
      ],
      summary: [
        'The eight areas are: smart homes, healthcare, industrial internet, smart cities, agriculture, retail, energy management, and transportation and logistics.',
        'Industry 4.0 is another name for the industrial internet, known for predictive maintenance, asset tracking and real-time monitoring.',
        'Agriculture uses precision farming: soil monitoring, crop monitoring and automated irrigation.',
        'Smart cities use traffic management, waste management, environmental sensors and adaptive streetlights.',
      ],
      examTip:
        'When a question asks for an application, do not just name the field. Name the field, then give a device. "Healthcare: a smartwatch that tracks vital signs and sends them to a doctor" is a complete answer. "Healthcare" alone usually is not.',
      confused: {
        simpler:
          'These eight are just eight places where people found it useful to put sensors on things. Pick the two you find easiest to picture (probably smart homes and healthcare) and learn those properly first. The others will stick more easily once two are solid.',
        reviewLessonId: 'l1-1',
      },
    },

    /* ------------------------------------------------------------ 1.3 -- */
    {
      id: 'l1-3',
      moduleId: 'm1',
      number: 3,
      title: 'The technologies that make IoT possible',
      blurb: 'Six enabling technologies, and why an IoT system needs every one of them.',
      minutes: 16,
      why: 'This is where the unit starts to connect. Two of the six, sensors and actuators, are what the rest of the course is about. Meeting them here in context makes the later modules land properly.',
      prerequisites: ['l1-1'],
      objectives: [
        'Name the six enabling technologies',
        'Say what each one contributes to an IoT system',
        'Explain the difference between cloud computing and edge computing',
        'Explain the difference between a sensor and an actuator',
      ],
      concepts: [
        { id: 'c-iot-enablers', title: 'IoT enabling technologies' },
        { id: 'c-sensor-actuator', title: 'Sensors versus actuators' },
        { id: 'c-cloud-edge', title: 'Cloud versus edge computing' },
      ],
      keyTerms: ['t-sensor', 't-actuator', 't-cloud', 't-edge', 't-encryption'],
      blocks: [
        {
          id: 'b1',
          kind: 'prose',
          tone: 'lead',
          text: 'An IoT system needs six things to work. Take any one away and it stops. Here they are, in the order the data travels: something to **measure**, something to **carry** the measurement, somewhere to **process** it, somewhere **nearer** to process the urgent parts, something to **make sense** of it, and something to **protect** all of it.',
        },
        {
          id: 'b2',
          kind: 'figure',
          figure: 'EnablersFigure',
          caption: 'The six enabling technologies, arranged along the path the data takes.',
          altSummary:
            'Six enabling technologies shown left to right along the data path: sensors and actuators at the physical world, wireless connectivity carrying data, edge computing processing near the device, cloud computing storing and processing centrally, data analytics and machine learning producing insight, with security and privacy wrapping around all of it.',
        },
        {
          id: 'b3',
          kind: 'definition',
          term: 'Sensors and Actuators',
          simple:
            'A sensor measures something about the world. An actuator changes something about the world.',
          technical:
            'Sensors collect data from the physical world, measuring parameters like temperature, humidity, pressure and so on. Actuators act upon this data, performing actions such as controlling lights or adjusting environmental conditions.',
          provenance: 'syllabus',
          example:
            'A temperature sensor measures that the room is 31°C. An actuator (a relay driving a fan) switches the fan on.',
        },
        {
          id: 'b4',
          kind: 'callout',
          variant: 'remember',
          title: 'Sensor in, actuator out',
          text: 'A **sensor** is an input: the world tells the system something. An **actuator** is an output: the system tells the world something. If you can remember "sense = in, act = out", you will never mix them up.',
        },
        {
          id: 'b5',
          kind: 'definition',
          term: 'Wireless Connectivity',
          simple: 'The way IoT devices talk without wires.',
          technical:
            'IoT devices rely on wireless communication technologies like Wi-Fi, Bluetooth, Zigbee, Z-Wave, LoRa and NB-IoT to connect to the internet and to each other.',
          provenance: 'syllabus',
          example:
            'A smart bulb in your room joins the house Wi-Fi. A fitness band pairs to your phone over Bluetooth.',
        },
        {
          id: 'b6',
          kind: 'definition',
          term: 'Cloud Computing',
          simple:
            'Powerful computers somewhere else that store and process all the data your devices send.',
          technical:
            'Cloud platforms provide scalable infrastructure and services for storing, processing and analysing large volumes of IoT data, enabling centralised management, data aggregation and advanced analytics.',
          provenance: 'syllabus',
          example: 'Amazon Web Services, Microsoft Azure.',
        },
        {
          id: 'b7',
          kind: 'definition',
          term: 'Edge Computing',
          simple:
            'Doing some of the thinking on the device itself, or close to it, instead of sending everything far away.',
          technical:
            'Edge computing brings computational power closer to the data source, enabling real-time analysis and decision-making by processing data locally on IoT devices or at the edge of the network, reducing latency and bandwidth usage.',
          provenance: 'syllabus',
          example: 'Raspberry Pi, NVIDIA Jetson.',
        },
        {
          id: 'b8',
          kind: 'analogy',
          title: 'Why you need both cloud and edge',
          analogy:
            'Imagine a self-driving car that sees a child step into the road. If it had to send that image to a data centre in Singapore and wait for the reply, the child would already have been hit. So the car decides to brake by itself, on the spot. But at the end of the day, every journey it made is uploaded so the company can study a million journeys at once and improve the driving software. Braking is edge. Studying a million journeys is cloud.',
          mapping: [
            { from: 'Braking right now', to: 'Edge computing: fast, local, low latency' },
            { from: 'Studying a million journeys', to: 'Cloud computing: huge storage, heavy analysis' },
            { from: 'Not waiting for Singapore', to: 'Reduced latency' },
            { from: 'Not uploading every frame', to: 'Reduced bandwidth usage' },
          ],
          limits:
            'Edge and cloud are not rivals. Nearly every real IoT system uses both, each for what it is good at.',
        },
        {
          id: 'b9',
          kind: 'compare',
          title: 'Cloud computing vs edge computing',
          columns: ['Cloud computing', 'Edge computing'],
          rows: [
            {
              aspect: 'Where processing happens',
              left: 'On remote servers, centrally',
              right: 'On the IoT device itself or at the edge of the network',
            },
            {
              aspect: 'Main strength',
              left: 'Scalable storage and advanced analytics on huge volumes of data',
              right: 'Real-time analysis and decision-making',
            },
            {
              aspect: 'Latency',
              left: 'Higher: the data has to travel',
              right: 'Lower: the data barely moves',
            },
            {
              aspect: 'Bandwidth used',
              left: 'High: everything is uploaded',
              right: 'Reduced: only what matters is sent on',
            },
            { aspect: 'Examples given', left: 'Amazon Web Services, Microsoft Azure', right: 'Raspberry Pi, NVIDIA Jetson' },
          ],
        },
        {
          id: 'b10',
          kind: 'definition',
          term: 'Data Analytics and Machine Learning',
          simple:
            'The software that turns a pile of sensor readings into something worth knowing.',
          technical:
            'Analytics techniques, including machine learning and artificial intelligence, derive actionable insights from IoT data, facilitating applications such as predictive maintenance, anomaly detection and optimisation.',
          provenance: 'syllabus',
          example: 'An anomaly detection model that spots a machine behaving unusually.',
        },
        {
          id: 'b11',
          kind: 'definition',
          term: 'Security and Privacy',
          simple: 'Keeping the devices, the data and the network safe from attackers.',
          technical:
            'Security measures like encryption, authentication and access control protect IoT devices, data and networks from cyber threats and unauthorised access, ensuring integrity, confidentiality and availability.',
          provenance: 'syllabus',
          example: 'AES encryption, two-factor authentication.',
        },
        {
          id: 'b12',
          kind: 'callout',
          variant: 'exam',
          title: 'Integrity, confidentiality, availability',
          text: 'The syllabus names these three together. **Confidentiality**: only the right people can read the data. **Integrity**: nobody has secretly changed it. **Availability**: it is there when you need it. Naming all three in a security answer is worth doing.',
        },
        {
          id: 'b13',
          kind: 'order',
          prompt:
            'Put the six enabling technologies in the order data passes through them, from the physical world to the insight.',
          items: [
            { id: 'o1', label: 'Sensors and actuators' },
            { id: 'o2', label: 'Wireless connectivity' },
            { id: 'o3', label: 'Edge computing' },
            { id: 'o4', label: 'Cloud computing' },
            { id: 'o5', label: 'Data analytics and machine learning' },
            { id: 'o6', label: 'Security and privacy' },
          ],
          correct: ['o1', 'o2', 'o3', 'o4', 'o5', 'o6'],
          why: 'Sensors measure, wireless carries, edge handles what is urgent, cloud stores the rest, analytics finds the meaning. Security is last in the list only because it wraps around all five: it is not a stage, it is a requirement at every stage.',
        },
        {
          id: 'b14',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q1-3-a', 'q1-3-b', 'q1-3-c', 'q1-3-d'],
        },
      ],
      summary: [
        'Six enabling technologies: wireless connectivity, sensors and actuators, cloud computing, edge computing, data analytics and machine learning, and security and privacy.',
        'Sensors collect data from the physical world; actuators act on that data to change something.',
        'Cloud computing gives scalable storage and advanced analytics; edge computing gives real-time decisions with lower latency and bandwidth use.',
        'Security uses encryption, authentication and access control to ensure integrity, confidentiality and availability.',
      ],
      examTip:
        'If asked to "name technologies that enable IoT", six is the full list. Writing four will usually lose marks. Learn them as three pairs: sense/connect, cloud/edge, analyse/protect.',
      confused: {
        simpler:
          'Follow one temperature reading on its journey. A sensor measures 31°C. Wi-Fi carries the number away. The device itself decides straight away to switch the fan on (edge). The number is also stored in a data centre (cloud). Later, software notices your room is always hot at 2pm (analytics). And all along, the number is encrypted so nobody else can read it (security). Six technologies, one reading.',
          analogy:
            'Six workers on a relay team: one measures, one runs the data over, one makes the urgent call, one files it away, one studies the files, and one guards the whole track.',
        reviewLessonId: 'l1-1',
      },
    },

    /* ------------------------------------------------------------ 1.4 -- */
    {
      id: 'l1-4',
      moduleId: 'm1',
      number: 4,
      title: 'What still goes wrong: the challenges of IoT',
      blurb: 'Six real problems the syllabus names, and why each one is hard to solve.',
      minutes: 12,
      why: 'Challenge questions are among the most predictable in this unit, and they reward a student who can explain *why* something is a problem rather than just list it.',
      prerequisites: ['l1-3'],
      objectives: [
        'List the six challenges of IoT',
        'Explain why each one is difficult, not just that it exists',
        'Connect each challenge back to the technology that causes it',
      ],
      concepts: [{ id: 'c-iot-challenges', title: 'Challenges of IoT' }],
      keyTerms: ['t-latency', 't-calibration', 't-encryption'],
      blocks: [
        {
          id: 'b1',
          kind: 'prose',
          tone: 'lead',
          text: 'IoT is not a solved problem. The syllabus names six challenges. Notice that each one is the shadow of something good: connecting everything creates security risk, collecting everything creates a storage problem, and depending on the network creates a failure point.',
        },
        {
          id: 'b2',
          kind: 'steps',
          title: 'The six challenges',
          steps: [
            {
              label: 'Security and privacy',
              text: 'IoT devices often collect sensitive data such as personal, health or location information. Weak security measures make them vulnerable to hacking, data breaches and unauthorised access.',
            },
            {
              label: 'Handling massive data',
              text: 'Storing, processing and analysing the enormous amount of data generated by millions of connected devices is a major challenge.',
            },
            {
              label: 'Dependence on connectivity',
              text: 'Since IoT devices rely on continuous and reliable internet connections, their performance can degrade or fail in areas with poor network coverage.',
            },
            {
              label: 'Scaling up',
              text: 'As IoT networks grow, maintaining performance, security and device management across thousands or millions of devices becomes complex.',
            },
            {
              label: 'Inaccurate data',
              text: 'Faulty sensors or poor calibration can produce inaccurate data, affecting decision-making and automation reliability.',
            },
            {
              label: 'High setup cost',
              text: 'The initial setup cost for IoT infrastructure (devices, sensors, gateways and software) can be high.',
            },
          ],
        },
        {
          id: 'b3',
          kind: 'callout',
          variant: 'misconception',
          title: '"Garbage in, garbage out" is the one students underrate',
          text: 'Challenge five sounds mild next to hacking, but it is the one that quietly ruins systems. If a soil sensor is badly calibrated and reports the field is wet when it is dry, an automated irrigation system will confidently do exactly the wrong thing, and nobody will notice until the crop fails. **A wrong reading is worse than no reading**, because a system with no reading knows it does not know.',
        },
        {
          id: 'b4',
          kind: 'analogy',
          title: 'Why scale is genuinely hard',
          analogy:
            'Updating the software on one phone is easy. Updating the software on ten thousand water meters buried under ten thousand roads, half of which are currently offline and some of which are three versions behind, is a different kind of problem entirely.',
          mapping: [
            { from: 'Ten thousand meters', to: 'Millions of connected devices' },
            { from: 'Half of them offline', to: 'Unreliable connectivity' },
            { from: 'Three versions behind', to: 'Device management complexity' },
            { from: 'Buried under roads', to: 'Physical access cost' },
          ],
        },
        {
          id: 'b5',
          kind: 'sort',
          prompt: 'Which challenge does each situation describe?',
          buckets: [
            { id: 'sec', label: 'Security and privacy' },
            { id: 'data', label: 'Handling massive data' },
            { id: 'conn', label: 'Dependence on connectivity' },
            { id: 'acc', label: 'Inaccurate data' },
          ],
          items: [
            {
              id: 'c1',
              label: 'A smart doorbell camera is hacked and strangers watch the footage.',
              bucket: 'sec',
              why: 'The device collects sensitive personal data and weak security left it exposed to unauthorised access.',
            },
            {
              id: 'c2',
              label: 'A weather station in a hill village stops reporting whenever the mobile signal drops.',
              bucket: 'conn',
              why: 'The device relies on a continuous, reliable connection, so poor network coverage degrades its performance.',
            },
            {
              id: 'c3',
              label: 'A city collects 4 billion sensor readings a day and cannot analyse them fast enough.',
              bucket: 'data',
              why: 'Storing, processing and analysing massive volumes generated by many devices is the second challenge.',
            },
            {
              id: 'c4',
              label: 'A hospital thermometer drifts by 3°C and patients are wrongly flagged as feverish.',
              bucket: 'acc',
              why: 'Poor calibration produces inaccurate data, which then damages the reliability of every decision made from it.',
            },
          ],
        },
        {
          id: 'b6',
          kind: 'explain',
          prompt:
            'In your own words, explain to a classmate why connecting more devices to the internet makes security harder, not just more important.',
          rubric: [
            'Mentions that each device is another way in for an attacker',
            'Mentions that IoT devices often hold sensitive data (personal, health or location)',
            'Mentions that many IoT devices have weak security to begin with',
            'Mentions that managing security across thousands or millions of devices is complex',
          ],
          modelAnswer:
            'Every device you connect is another door into the system, and IoT devices are usually cheap, small and built with weak security, so those doors are badly locked. They also hold exactly the data an attacker wants: where someone is, what their heart rate is, when their house is empty. And because there may be millions of them, you cannot simply check each one by hand. So the problem is not only that security matters more, it is that the number of things to secure grows faster than your ability to secure them.',
        },
        {
          id: 'b7',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q1-4-a', 'q1-4-b', 'q1-4-c'],
        },
      ],
      summary: [
        'Sensitive data plus weak security makes IoT devices vulnerable to hacking, breaches and unauthorised access.',
        'The sheer volume of data from millions of devices is hard to store, process and analyse.',
        'Devices depend on continuous, reliable internet, so poor coverage degrades or breaks them.',
        'Growing the network makes performance, security and device management complex.',
        'Faulty sensors or poor calibration produce inaccurate data and unreliable automation.',
        'The initial cost of devices, sensors, gateways and software is high.',
      ],
      examTip:
        'A "state the challenges" question wants the list. A "discuss the challenges" question wants the list plus a reason for each. Practise adding "because…" to every one of the six.',
      confused: {
        simpler:
          'Group them into three pairs and it gets much easier. **Too exposed**: security, and bad data. **Too much**: data volume, and scale. **Too fragile or expensive**: network dependence, and cost.',
        reviewLessonId: 'l1-3',
      },
    },
  ],
}
