import type { Module } from '@/types/content'

/* Module 6 — Arduino programming.
   Source: syllabus pages 27–30. The IDE and the compile/upload pipeline,
   setup() and loop(), the language rules, comments, braces, variables,
   constants, control structures and loops. Every code sample here runs. */

export const m6: Module = {
  id: 'm6',
  number: 6,
  title: 'Arduino Programming',
  wire: 'yellow',
  blurb:
    'Writing the code. The IDE, what happens when you press Upload, setup() and loop(), variables, decisions and loops. Every example on this page actually runs.',
  outcomes: [
    'Describe the Arduino IDE and the compile and upload process',
    'Explain what setup() and loop() do and when each runs',
    'State the syntax rules of the Arduino language',
    'Declare variables and constants of the correct type',
    'Write if / else if / else decisions and for, while and do-while loops',
  ],
  lessons: [
    /* ------------------------------------------------------------ 6.1 -- */
    {
      id: 'l6-1',
      moduleId: 'm6',
      number: 1,
      title: 'The IDE, and what happens when you press Upload',
      blurb: 'From the code you type to the machine code the chip runs.',
      minutes: 12,
      why: 'The compile and upload process is a short-answer question in its own right, and understanding it explains why an error message appears before anything reaches the board.',
      prerequisites: ['l3-2'],
      objectives: [
        'Define the Arduino IDE',
        'Explain why the IDE acts as a compiler',
        'Describe what happens step by step when Upload is pressed',
        'State what language Arduino is based on',
      ],
      concepts: [
        { id: 'c-ide', title: 'The Arduino IDE' },
        { id: 'c-compile-upload', title: 'Compiling and uploading' },
      ],
      keyTerms: ['t-ide', 't-compiler', 't-hex', 't-machine-code'],
      blocks: [
        {
          id: 'b1',
          kind: 'definition',
          term: 'Arduino IDE',
          simple:
            'The program on your computer where you write Arduino code and send it to the board.',
          technical:
            'The Arduino Integrated Development Environment (IDE) is a software application that provides a platform for writing, compiling and uploading code to Arduino-compatible microcontroller boards.',
          provenance: 'syllabus',
          example: 'Downloadable from https://www.arduino.cc/',
        },
        {
          id: 'b2',
          kind: 'prose',
          text: 'The syllabus notes it is **designed to be user-friendly and accessible, even for those who are new to programming and electronics**, and that **the Arduino language is based on C/C++, but simplified to make it more accessible for beginners in electronics and programming.**',
        },
        {
          id: 'b3',
          kind: 'callout',
          variant: 'exam',
          title: 'Three verbs define the IDE',
          text: 'Writing, compiling and uploading. If a question asks what the Arduino IDE is for, all three belong in the answer. Many students give only "writing code", which is a third of the definition.',
        },
        {
          id: 'b4',
          kind: 'prose',
          heading: 'Why the IDE is a compiler',
          text: 'The syllabus is explicit: **the Arduino IDE acts as a compiler because it translates the high-level code into machine code that runs directly on the microcontroller hardware.**\n\nThe compiling process happens **before the program runs**, and the output is a standalone executable file. If it finds any errors, it will display them in the message window at the bottom of the IDE.\n\nIf the code compiles successfully, the [[t-ide|Arduino IDE]] produces a **binary file with a .hex extension** that contains the machine code, meaning the binary instructions, specific to the Arduino [[t-microcontroller|microcontroller]].',
        },
        {
          id: 'b5',
          kind: 'figure',
          figure: 'UploadPipelineFigure',
          caption:
            'Press Upload and follow what happens. Try it with correct code, then with an error.',
          altSummary:
            'A pipeline in four stages. Source code written in the Arduino IDE is compiled. If compilation fails, errors appear in the message window at the bottom of the IDE and nothing is sent to the board. If compilation succeeds, a binary .hex file containing machine code is produced, which is transferred to the Arduino board over the USB cable, and the board then executes the machine code directly.',
        },
        {
          id: 'b6',
          kind: 'steps',
          title: 'What happens when you click Upload',
          steps: [
            {
              label: 'You click the right arrow icon',
              text: 'When you click the Upload button, the right arrow icon in the Arduino IDE, the process begins.',
            },
            {
              label: 'The code is compiled',
              text: 'The IDE translates your high-level code into machine code. This happens before the program runs.',
            },
            {
              label: 'Errors stop everything',
              text: 'If it finds any errors, it displays them in the message window at the bottom of the IDE. Nothing is sent to the board.',
            },
            {
              label: 'A .hex file is produced',
              text: 'If the code compiles successfully, a binary file with a .hex extension is produced, containing the machine code specific to the Arduino microcontroller.',
            },
            {
              label: 'It travels over USB',
              text: 'The IDE transfers this compiled binary file to the Arduino board via the USB cable.',
            },
            {
              label: 'The board runs it',
              text: 'The Arduino board then executes the machine code directly.',
            },
          ],
        },
        {
          id: 'b7',
          kind: 'analogy',
          title: 'Translating a letter before posting it',
          analogy:
            'You write a letter in Sinhala to someone who only reads Japanese. A translator converts the whole letter first, checking as they go. If a sentence makes no sense, they stop and tell you, and nothing is posted. Only once the translation is complete and correct does the letter go into the postbox.',
          mapping: [
            { from: 'Your Sinhala letter', to: 'The high-level code you wrote' },
            { from: 'The translator', to: 'The compiler inside the IDE' },
            { from: 'Stopping to tell you a sentence makes no sense', to: 'Errors shown in the message window' },
            { from: 'The finished Japanese letter', to: 'The .hex file of machine code' },
            { from: 'The postbox', to: 'The USB cable' },
            { from: 'The reader reading it', to: 'The microcontroller executing it' },
          ],
        },
        {
          id: 'b8',
          kind: 'callout',
          variant: 'misconception',
          title: 'The board never sees the code you typed',
          text: 'The Arduino has no idea what `digitalWrite` means. It only ever receives machine code: binary instructions in a .hex file. Everything readable happens on your computer, before the upload. This is why a syntax error is caught instantly and why the board is never damaged by a typo.',
        },
        {
          id: 'b9',
          kind: 'recall',
          prompt: 'What is the file extension of the file the Arduino IDE produces after a successful compile, and what does it contain?',
          answer:
            'A .hex file. It is a binary file containing the machine code, meaning the binary instructions, specific to the Arduino microcontroller.',
          hint: 'Three letters, and it holds instructions the chip understands directly.',
        },
        {
          id: 'b10',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q6-1-a', 'q6-1-b', 'q6-1-c'],
        },
      ],
      summary: [
        'The Arduino IDE is a software application providing a platform for writing, compiling and uploading code to Arduino-compatible microcontroller boards.',
        'The Arduino language is based on C/C++, simplified for beginners.',
        'The IDE acts as a compiler because it translates high-level code into machine code that runs directly on the microcontroller hardware.',
        'Compilation happens before the program runs, and the output is a standalone executable file.',
        'Errors are displayed in the message window at the bottom of the IDE.',
        'A successful compile produces a binary .hex file, which is transferred to the board over the USB cable and executed directly.',
      ],
      examTip:
        'A question about the upload process wants the sequence, not a description. Compile → errors or a .hex file → transfer over USB → the board executes the machine code. Four stages, four marks.',
      confused: {
        simpler:
          'You write code in English-like words. The chip only understands numbers. The IDE does the translating, checks for mistakes first, and only sends the translated version down the USB cable.',
      },
    },

    /* ------------------------------------------------------------ 6.2 -- */
    {
      id: 'l6-2',
      moduleId: 'm6',
      number: 2,
      title: 'setup() and loop()',
      blurb:
        'The two functions every Arduino sketch has. Write your first working program here.',
      minutes: 16,
      why: 'These two functions are the skeleton of every sketch in this course. Once you know which one runs once and which one runs forever, you can read any Arduino program.',
      prerequisites: ['l6-1'],
      objectives: [
        'State what void setup() is used for and when it runs',
        'State what void loop() is used for and when it runs',
        'Write the syntax of both from memory',
        'Predict what a given sketch will do',
      ],
      concepts: [
        { id: 'c-setup', title: 'void setup()' },
        { id: 'c-loop', title: 'void loop()' },
      ],
      keyTerms: ['t-setup', 't-loop', 't-function', 't-pinmode'],
      blocks: [
        {
          id: 'b1',
          kind: 'prose',
          tone: 'lead',
          text: 'The syllabus states it plainly: **in Arduino programming, the `void setup()` and `void loop()` functions are fundamental parts of the code structure.** Every sketch has both. Nothing else is required.',
        },
        {
          id: 'b2',
          kind: 'definition',
          term: 'void setup()',
          simple: 'The part that runs once at the start, to get things ready.',
          technical:
            'Used to initialise variables, pin modes, start using libraries and so on. It is run once when the Arduino board is powered on or reset.',
          provenance: 'syllabus',
        },
        {
          id: 'b3',
          kind: 'code',
          caption: 'The syntax of setup()',
          code: `void setup() {
   // initialization code here
}`,
        },
        {
          id: 'b4',
          kind: 'definition',
          term: 'void loop()',
          simple: 'The part that runs over and over, forever, after setup has finished.',
          technical:
            'Runs repeatedly after the void setup() function has finished. Used to actively control the Arduino board by reading inputs, triggering outputs and so on, in an endless loop until the board is powered off or reset.',
          provenance: 'syllabus',
        },
        {
          id: 'b5',
          kind: 'code',
          caption: 'The syntax of loop()',
          code: `void loop() {
   // repeated code here
}`,
        },
        {
          id: 'b6',
          kind: 'figure',
          figure: 'SetupLoopFigure',
          caption:
            'Power on, and watch the flow. setup() runs once; loop() runs forever after it.',
          altSummary:
            'A flow diagram. Power on or reset leads into setup, which runs exactly once. From setup, an arrow leads into loop. Loop runs, and an arrow returns from the end of loop to its beginning, repeating endlessly until the board is powered off or reset, at which point control returns to setup.',
        },
        {
          id: 'b7',
          kind: 'callout',
          variant: 'remember',
          title: 'Getting ready, then working',
          text: '**setup()** is putting your shoes on. You do it once before you leave the house. **loop()** is walking. You keep doing it until you stop. Anything you only need to arrange once, such as telling the board which pins are outputs, belongs in setup. Anything you need to keep doing, such as checking a sensor, belongs in loop.',
        },
        {
          id: 'b8',
          kind: 'bench',
          preset: 'first-light',
          title: 'Your first program',
          brief:
            'Three lines. Press Run and watch the LED come on. Then try deleting the pinMode line and running it again, and read the error.',
        },
        {
          id: 'b9',
          kind: 'callout',
          variant: 'misconception',
          title: 'Code in setup() does not repeat',
          text: 'A very common first mistake is to put the blink code inside `setup()` and wonder why the LED flashes once and stops. It stops because setup is **run once when the board is powered on or reset**. If you want something to keep happening, it has to be in `loop()`.',
        },
        {
          id: 'b10',
          kind: 'bench',
          preset: 'blink',
          title: 'Now make it blink',
          brief:
            'The same LED, but the instructions moved into loop() with delays between them. Watch the highlighted line move.',
        },
        {
          id: 'b11',
          kind: 'order',
          prompt:
            'Put these events in the order they happen when you power on an Arduino.',
          items: [
            { id: 'z1', label: 'The board receives power' },
            { id: 'z2', label: 'setup() runs, once' },
            { id: 'z3', label: 'loop() runs from top to bottom' },
            { id: 'z4', label: 'loop() starts again from the top' },
          ],
          correct: ['z1', 'z2', 'z3', 'z4'],
          why: 'setup() is run once when the board is powered on or reset. loop() then runs repeatedly, in an endless loop, until the board is powered off or reset.',
        },
        {
          id: 'b12',
          kind: 'explain',
          prompt:
            'Explain to someone who has never programmed why an Arduino sketch needs two separate functions instead of just one list of instructions.',
          rubric: [
            'Says some instructions only need to happen once',
            'Gives an example of a setup task, such as setting pin modes',
            'Says other instructions need to repeat continuously',
            'Gives an example of a loop task, such as reading a sensor or switching an output',
            'Notes that loop repeats until the board is powered off or reset',
          ],
          modelAnswer:
            'Because two different kinds of instruction exist. Some only need to happen once, like telling the board that pin 13 is going to be an output. Doing that repeatedly would be pointless. Other instructions need to happen over and over, like checking whether the light level has dropped or switching an LED on and off. Splitting them into setup() and loop() means you write the one-time instructions once, and the board handles repeating the rest by itself, endlessly, until it is powered off or reset.',
        },
        {
          id: 'b13',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q6-2-a', 'q6-2-b', 'q6-2-c'],
        },
      ],
      summary: [
        'void setup() is used to initialise variables, pin modes and libraries. It runs once when the board is powered on or reset.',
        'void loop() runs repeatedly after setup() has finished, reading inputs and triggering outputs in an endless loop until the board is powered off or reset.',
        'Both are written as: void setup() { } and void loop() { }.',
      ],
      examTip:
        'If you are asked to write a sketch, always include both functions even when one is empty. A sketch with no loop() is not a complete Arduino program.',
      confused: {
        simpler:
          'Two boxes. Whatever you write in the first box happens once. Whatever you write in the second box happens again and again forever. That is the whole idea.',
        reviewLessonId: 'l6-1',
      },
    },

    /* ------------------------------------------------------------ 6.3 -- */
    {
      id: 'l6-3',
      moduleId: 'm6',
      number: 3,
      title: 'The rules of the language',
      blurb:
        'Case sensitivity, semicolons, braces and comments. Small rules that break everything.',
      minutes: 12,
      why: 'Nearly every error a beginner hits is one of these four rules. The syllabus lists them as a NOTE, which usually means they are examinable.',
      prerequisites: ['l6-2'],
      objectives: [
        'State that Arduino is case sensitive and give an example',
        'State the role of the semicolon',
        'Explain why indentation is not required',
        'Write both kinds of comment',
        'Explain what braces are used for',
      ],
      concepts: [
        { id: 'c-syntax-rules', title: 'Arduino syntax rules' },
        { id: 'c-comments', title: 'Comments' },
        { id: 'c-braces', title: 'Braces' },
      ],
      keyTerms: ['t-case-sensitive', 't-semicolon', 't-comment', 't-brace'],
      blocks: [
        {
          id: 'b1',
          kind: 'prose',
          tone: 'lead',
          text: 'The syllabus prints a NOTE with three rules. All three cause errors that look mysterious the first time you meet them, so it is worth spending ten minutes here rather than an hour later.',
        },
        {
          id: 'b2',
          kind: 'steps',
          title: 'The three rules in the syllabus NOTE',
          steps: [
            {
              label: 'Arduino is a case sensitive language',
              text: 'Capital and small letters are different letters. digitalWrite and digitalwrite are two different names, and only one of them exists.',
            },
            {
              label: 'Arduino does not use indentation',
              text: 'Unlike some languages, indenting a line does not change what the program does. Indentation is for humans reading the code, not for the compiler.',
            },
            {
              label: 'A semicolon ends each instruction',
              text: 'Instead of indentation, a semicolon ( ; ) is used at the end of each instruction.',
            },
          ],
        },
        {
          id: 'b3',
          kind: 'callout',
          variant: 'misconception',
          title: 'The most common beginner error, and why the message is confusing',
          text: 'A missing semicolon is usually reported on the **next** line, not the line you forgot it on. The compiler reads on, looking for the end of your instruction, and only realises something is wrong when it hits something that cannot possibly belong. So when an error points at line 8, look at line 7 first.',
        },
        {
          id: 'b4',
          kind: 'bench',
          preset: 'blink',
          title: 'Break it on purpose',
          brief:
            'Delete a semicolon, or change digitalWrite to digitalwrite, and press Run. Read the error, then put it back. Deliberately causing an error you understand is far more useful than avoiding errors you do not.',
        },
        {
          id: 'b5',
          kind: 'prose',
          heading: 'Comments',
          text: 'A comment is a note to yourself that the [[t-compiler|compiler]] ignores completely. There are two kinds.\n\n**Single-line comments start with `//`.** Everything after the two slashes to the end of that line is ignored.\n\n**Multi-line comments are enclosed in `/* */`.** Everything between the opening and closing markers is ignored, however many lines it spans.',
        },
        {
          id: 'b6',
          kind: 'code',
          caption: 'Both kinds of comment, exactly as the syllabus writes them',
          code: `// This is a single-line comment

/*
This is a multi-line comment
It spans multiple lines
*/`,
        },
        {
          id: 'b7',
          kind: 'prose',
          heading: 'Braces { }',
          text: 'Braces are used to **define the beginning and end of function bodies and control structures.**\n\nEvery `{` must eventually be matched by a `}`. When they are not, the compiler reads to the end of your file still waiting for the closing brace, and reports an error there rather than where the mistake was.',
        },
        {
          id: 'b8',
          kind: 'code',
          caption: 'Braces nesting inside braces, as the syllabus shows',
          code: `void loop() {
       if (true) {
              //code block if true
       } else {
              // code block if false
       }
}`,
        },
        {
          id: 'b9',
          kind: 'callout',
          variant: 'remember',
          title: 'Indentation is a kindness, not a rule',
          text: 'The syllabus says Arduino does not use indentation, and that is technically true: the program runs identically without it. But indenting still matters enormously, because it is how *you* see which brace closes which block. Write badly indented code and you will spend your evening hunting a missing `}`.',
        },
        {
          id: 'b10',
          kind: 'sort',
          prompt: 'Would each of these compile, or produce an error?',
          buckets: [
            { id: 'ok', label: 'Compiles fine' },
            { id: 'err', label: 'Produces an error' },
          ],
          items: [
            {
              id: 'y1',
              label: 'digitalWrite(13, HIGH);',
              bucket: 'ok',
              why: 'Correct capitalisation, correct arguments, and a semicolon at the end.',
            },
            {
              id: 'y2',
              label: 'digitalwrite(13, HIGH);',
              bucket: 'err',
              why: 'Arduino is case sensitive. The function is digitalWrite with a capital W; digitalwrite does not exist.',
            },
            {
              id: 'y3',
              label: 'pinMode(13, OUTPUT)',
              bucket: 'err',
              why: 'No semicolon. A semicolon is used at the end of each instruction.',
            },
            {
              id: 'y4',
              label: 'int count = 0;   // start counting at zero',
              bucket: 'ok',
              why: 'A valid declaration with a semicolon, followed by a single-line comment which the compiler ignores.',
            },
            {
              id: 'y5',
              label: 'Delay(1000);',
              bucket: 'err',
              why: 'Case sensitivity again. The function is delay with a small d.',
            },
          ],
        },
        {
          id: 'b11',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q6-3-a', 'q6-3-b', 'q6-3-c'],
        },
      ],
      summary: [
        'Arduino is a case sensitive language: digitalWrite and digitalwrite are not the same.',
        'Arduino does not use indentation. A semicolon ( ; ) is used at the end of each instruction instead.',
        'Single-line comments start with //. Multi-line comments are enclosed in /* */.',
        'Braces { } define the beginning and end of function bodies and control structures.',
      ],
      examTip:
        'If a question shows you code and asks you to find the error, check in this order: semicolons, capital letters, matching braces. Those three account for most planted errors.',
      confused: {
        simpler:
          'Four rules. Capitals matter. Every instruction ends in a semicolon. Spaces at the start of a line do not matter to the computer. Anything after // is a note to yourself.',
        reviewLessonId: 'l6-2',
      },
    },

    /* ------------------------------------------------------------ 6.4 -- */
    {
      id: 'l6-4',
      moduleId: 'm6',
      number: 4,
      title: 'Variables and constants',
      blurb: 'Six types, one format for constants, and why the type you choose matters.',
      minutes: 15,
      why: 'Every practical program in this syllabus declares variables, and practical 4 declares a constant. Choosing the wrong type is a silent error that produces wrong answers rather than error messages.',
      prerequisites: ['l6-3'],
      objectives: [
        'Declare a variable with the correct type and name',
        'Name the six variable types the syllabus gives, with an example of each',
        'Write a constant in the correct format',
        'Explain when to use a constant instead of a variable',
      ],
      concepts: [
        { id: 'c-variables', title: 'Variables' },
        { id: 'c-var-types', title: 'Variable types' },
        { id: 'c-constants', title: 'Constants' },
      ],
      keyTerms: ['t-variable', 't-constant', 't-int', 't-float', 't-boolean', 't-byte'],
      blocks: [
        {
          id: 'b1',
          kind: 'prose',
          tone: 'lead',
          text: 'A [[t-variable|variable]] is a named box that holds a value while your program runs. The syllabus states the rule directly: **in Arduino, when creating a variable, both its type and the name of the variable must be declared.**\n\nThat is two pieces of information every time: what kind of thing it is, and what you want to call it.',
        },
        {
          id: 'b2',
          kind: 'figure',
          figure: 'VariableFigure',
          caption:
            'Anatomy of a declaration. Hover or tap each part to see what it is called.',
          altSummary:
            'A variable declaration broken into four labelled parts: the type, which is int; the name, which is count; the assignment operator, an equals sign; and the initial value, which is zero. A semicolon ends the instruction.',
        },
        {
          id: 'b3',
          kind: 'code',
          caption: 'The six variable types, exactly as the syllabus gives them',
          code: `int count = 0;
// Integer variable

float temperature = 24.5;
//Floating-point variable

char letter = 'A';
// Character variable

String name = "Arduino";
// String variable

byte pin = 13;
// Byte variable (0-255)

boolean ledState = true;
// Boolean variable (true/false)`,
        },
        {
          id: 'b4',
          kind: 'compare',
          title: 'Which type holds what',
          columns: ['Type', 'Holds'],
          rows: [
            { aspect: 'int', left: 'Integer', right: 'Whole numbers, positive or negative. The default choice for counting things and for pin numbers.' },
            { aspect: 'float', left: 'Floating point', right: 'Numbers with a decimal point, such as 24.5. Needed for a temperature or a voltage.' },
            { aspect: 'char', left: 'Character', right: "A single character in single quotes, such as 'A'." },
            { aspect: 'String', left: 'String', right: 'Text in double quotes, such as "Arduino". Note the capital S.' },
            { aspect: 'byte', left: 'Byte', right: 'A whole number from 0 to 255. Uses less memory than an int.' },
            { aspect: 'boolean', left: 'Boolean', right: 'true or false. Nothing else.' },
          ],
        },
        {
          id: 'b5',
          kind: 'callout',
          variant: 'misconception',
          title: 'int throws away the decimal part, silently',
          text: 'Write `int half = 5 / 2;` and `half` will hold **2**, not 2.5. No error, no warning. An `int` cannot store a fraction, so the fractional part is simply discarded.\n\nThis is exactly why practical 4 declares `float voltage` and `float temperatureC`. If those were `int`, every temperature would be rounded down and the motor would switch at the wrong moment.',
        },
        {
          id: 'b6',
          kind: 'bench',
          preset: 'serial',
          title: 'See the types behave',
          brief:
            'Change `int reading` to `float reading` and run it. Then try dividing the reading by 3 and printing the result with each type. Watch what int does to the answer.',
        },
        {
          id: 'b7',
          kind: 'callout',
          variant: 'remember',
          title: 'Capital S in String',
          text: '`String` is the only one of the six types that starts with a capital letter. Since Arduino is case sensitive, `string name = "x";` will not compile. This trips people up constantly.',
        },
        {
          id: 'b8',
          kind: 'prose',
          heading: 'Constants',
          text: 'A [[t-constant|constant]] is a value that must never change while the program runs. The syllabus gives the format:',
        },
        {
          id: 'b9',
          kind: 'code',
          caption: 'The constant format and the syllabus examples',
          code: `const type CONSTANT_NAME = value;

const int ledPin1 = 10;

const float distance = 70.5;

const String msg = "Hello";`,
        },
        {
          id: 'b10',
          kind: 'analogy',
          title: 'Why bother with const at all',
          analogy:
            'Writing a pin number as a constant at the top of your sketch is like writing your phone number once on the first page of a notebook instead of on every page. When you change the wiring and the LED moves from pin 13 to pin 8, you change one line rather than hunting through twenty.',
          mapping: [
            { from: 'Writing it once at the top', to: 'const int ledPin = 13;' },
            { from: 'Referring back to that page', to: 'Using ledPin everywhere instead of the number' },
            { from: 'Changing one line when it changes', to: 'Rewiring without breaking the sketch' },
            { from: 'Nobody being able to scribble over it', to: 'const preventing accidental reassignment' },
          ],
        },
        {
          id: 'b11',
          kind: 'callout',
          variant: 'exam',
          title: 'Practical 4 uses a constant, and explains why',
          text: 'The temperature practical opens with `const float temp = 25.0;` and the syllabus explains: **this line declares a constant temp which is set to 25.0°C. This is the temperature threshold.** A threshold is exactly the right use of a constant: it is a decision you made once, and nothing in the program should ever change it.',
        },
        {
          id: 'b12',
          kind: 'sort',
          prompt: 'Which type should hold each value?',
          buckets: [
            { id: 't-int', label: 'int' },
            { id: 't-float', label: 'float' },
            { id: 't-bool', label: 'boolean' },
            { id: 't-str', label: 'String' },
          ],
          items: [
            {
              id: 'v1',
              label: 'The reading from analogRead(A0)',
              bucket: 't-int',
              why: 'analogRead returns a whole number from 0 to 1023, so an int is right. Practical 3 uses exactly int ldrValue.',
            },
            {
              id: 'v2',
              label: 'A temperature of 27.4 °C',
              bucket: 't-float',
              why: 'It has a decimal part, so it needs a float. An int would store 27 and lose the 0.4.',
            },
            {
              id: 'v3',
              label: 'Whether the LED is currently on',
              bucket: 't-bool',
              why: 'Only two possible answers, true or false, which is exactly what a boolean is for.',
            },
            {
              id: 'v4',
              label: 'The message "Door opened"',
              bucket: 't-str',
              why: 'Text in double quotes is a String, with a capital S.',
            },
            {
              id: 'v5',
              label: 'The number of times the loop has run',
              bucket: 't-int',
              why: 'A count is always a whole number.',
            },
          ],
        },
        {
          id: 'b13',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q6-4-a', 'q6-4-b', 'q6-4-c', 'q6-4-d'],
        },
      ],
      summary: [
        'When creating a variable, both its type and its name must be declared.',
        'The six types are int, float, char, String, byte (0–255) and boolean (true/false).',
        'A constant is written as: const type CONSTANT_NAME = value;',
        'Examples: const int ledPin1 = 10; const float distance = 70.5; const String msg = "Hello";',
      ],
      examTip:
        'If you are asked to write a program that measures a temperature or a voltage, use float. Using int for those values is a real mistake that changes the behaviour, and examiners look for it.',
      confused: {
        simpler:
          'A variable is a labelled box. You have to say what kind of thing goes in it (a whole number, a decimal number, a letter, some text, true/false) and what the box is called. A constant is the same, but glued shut so nothing can change it.',
        reviewLessonId: 'l6-3',
      },
    },

    /* ------------------------------------------------------------ 6.5 -- */
    {
      id: 'l6-5',
      moduleId: 'm6',
      number: 5,
      title: 'Making decisions: if, else if, else',
      blurb: 'How a program chooses between two paths. Three of the four practicals depend on this.',
      minutes: 14,
      why: 'The LDR practical, the temperature practical and the reed switch practical are all built on a single if/else. Understanding this one structure unlocks all three.',
      prerequisites: ['l6-4'],
      objectives: [
        'Write an if / else if / else structure with correct syntax',
        'Predict which branch runs for a given value',
        'Use the comparison operators correctly',
        'Explain the difference between = and ==',
      ],
      concepts: [
        { id: 'c-if', title: 'if / else if / else' },
        { id: 'c-comparison', title: 'Comparison operators' },
      ],
      keyTerms: ['t-if', 't-condition', 't-operator'],
      blocks: [
        {
          id: 'b1',
          kind: 'prose',
          tone: 'lead',
          text: 'The syllabus states it in one line: **Arduino language uses `if`, `else if`, `else` to make decisions.**\n\nA decision needs a **condition**: a question with a yes-or-no answer. If the answer is yes, one block of code runs. If it is no, a different block runs, or none at all.',
        },
        {
          id: 'b2',
          kind: 'code',
          caption: 'The structure, exactly as the syllabus prints it',
          code: `if (count > 10) {
       /* Code to execute if count
       is greater than 10 */
} else if (count == 10) {
       /* Code to execute if count
       is exactly 10 */
} else {
       /* Code to execute if count
       is less than 10 */
}`,
        },
        {
          id: 'b3',
          kind: 'figure',
          figure: 'IfFlowFigure',
          caption:
            'Change the value of count and watch which branch lights up.',
          altSummary:
            'A decision flow diagram. The value of count enters the first test, whether count is greater than 10. If true, the first block runs. If false, the second test runs, whether count is exactly equal to 10. If true, the second block runs. If false, the else block runs. Only one block ever runs.',
        },
        {
          id: 'b4',
          kind: 'callout',
          variant: 'remember',
          title: 'Only one branch ever runs',
          text: 'Once a condition is true, its block runs and the whole structure is finished. The remaining `else if` and `else` branches are skipped entirely, even if they would also have been true. This is why the order of your conditions matters.',
        },
        {
          id: 'b5',
          kind: 'compare',
          title: 'The comparison operators you need',
          columns: ['Operator', 'Means'],
          rows: [
            { aspect: '>', left: 'greater than', right: 'count > 10 is true when count is 11 or more' },
            { aspect: '<', left: 'less than', right: 'ldrValue < 200 is true when the reading is 199 or less' },
            { aspect: '>=', left: 'greater than or equal to', right: 'temperatureC >= 25.0 includes exactly 25.0' },
            { aspect: '<=', left: 'less than or equal to', right: 'includes the boundary value' },
            { aspect: '==', left: 'is equal to', right: 'digitalRead(2) == LOW tests whether the pin reads LOW' },
            { aspect: '!=', left: 'is not equal to', right: 'true when the two sides differ' },
          ],
        },
        {
          id: 'b6',
          kind: 'callout',
          variant: 'misconception',
          title: 'One equals sign is not two',
          text: 'A single `=` **assigns** a value. A double `==` **compares** two values.\n\n`x = 5` means "put 5 into x".\n`x == 5` means "is x equal to 5?"\n\nWriting `if (x = 5)` compiles, does something you did not intend, and is one of the hardest bugs for a beginner to spot. Practical 5 uses `if (digitalRead(2) == LOW)` with two signs, and that is why.',
        },
        {
          id: 'b7',
          kind: 'bench',
          preset: 'ldr',
          title: 'The decision, running',
          brief:
            'Practical 3 from the syllabus. Drag the light slider across the 200 threshold and watch which branch of the if runs. Then change 200 to a different number and run it again.',
        },
        {
          id: 'b8',
          kind: 'recall',
          prompt:
            'In practical 3, the condition is `if (ldrValue < 200)`. If the LDR reading is exactly 200, does the LED turn on?',
          answer:
            'No. The operator is `<`, meaning strictly less than, so 200 is not less than 200 and the condition is false. The else branch runs and the LED stays off. It would only turn on at 199 or below. If the threshold needed to include 200, the operator would have to be `<=`.',
          hint: 'Look carefully at whether the operator includes the boundary value.',
        },
        {
          id: 'b9',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q6-5-a', 'q6-5-b', 'q6-5-c'],
        },
      ],
      summary: [
        'Arduino uses if, else if and else to make decisions.',
        'The condition goes in round brackets; the code to run goes in braces.',
        'Only one branch ever runs. Once a condition is true, the rest are skipped.',
        'Comparison operators: >, <, >=, <=, == and !=.',
        'A single = assigns a value; a double == compares two values.',
      ],
      examTip:
        'When tracing code by hand in an exam, write the value of each variable in the margin and test each condition one at a time, in order. Stop at the first true one.',
      confused: {
        simpler:
          'It is just: **if** this is true, do that. **Otherwise if** that other thing is true, do this instead. **Otherwise**, do this last thing. Like deciding what to wear: if it is raining take an umbrella, otherwise if it is sunny take a cap, otherwise take nothing.',
        reviewLessonId: 'l6-4',
      },
    },

    /* ------------------------------------------------------------ 6.6 -- */
    {
      id: 'l6-6',
      moduleId: 'm6',
      number: 6,
      title: 'Repeating: for, while and do-while',
      blurb: 'Three loops, and the one difference that separates the last two.',
      minutes: 14,
      why: 'The difference between while and do-while is a classic exam question, and it has a clean answer once you see it.',
      prerequisites: ['l6-5'],
      objectives: [
        'Write a for loop with correct syntax',
        'Write a while loop and a do-while loop',
        'State the key difference between while and do-while',
        'Choose the right loop for a given task',
      ],
      concepts: [
        { id: 'c-for', title: 'The for loop' },
        { id: 'c-while', title: 'while and do-while' },
      ],
      keyTerms: ['t-for', 't-while', 't-dowhile', 't-iteration'],
      blocks: [
        {
          id: 'b1',
          kind: 'prose',
          tone: 'lead',
          text: 'The syllabus states: **Arduino language uses `for`, `while`, `do...while` loops for iteration.** All three repeat a block of code. They differ in how they decide when to stop.',
        },
        {
          id: 'b2',
          kind: 'code',
          caption: 'The for loop, as the syllabus prints it',
          code: `for (int i = 0; i < 10; i++) {
       // Code to execute 10 times
}`,
        },
        {
          id: 'b3',
          kind: 'figure',
          figure: 'ForLoopFigure',
          caption:
            'The three parts of a for loop, stepping one at a time. Press step and watch i change.',
          altSummary:
            'A for loop broken into three parts inside its brackets, separated by semicolons: the initialisation, int i equals 0, which runs once at the start; the condition, i less than 10, which is tested before each pass; and the update, i plus plus, which runs after each pass. The body runs whenever the condition is true, and the loop ends when it becomes false.',
        },
        {
          id: 'b4',
          kind: 'callout',
          variant: 'remember',
          title: 'Three parts, two semicolons',
          text: '`for (start ; keep going while ; do after each pass)`. The first part runs once. The second is checked before every pass. The third runs at the end of every pass. `i++` simply means "add one to i".',
        },
        {
          id: 'b5',
          kind: 'code',
          caption: 'while and do-while, as the syllabus prints them',
          code: `count = 0
while (count < 10) {
       /* Code to execute while
       count is less than 10 */
       count++;
}

count = 10
do {
       /* Code to execute at least
       once and then while the
       condition is true */
       count--;
} while (count > 0);`,
        },
        {
          id: 'b6',
          kind: 'callout',
          variant: 'exam',
          title: 'The one difference that matters',
          text: 'A **while** loop tests the condition **before** running the block. If the condition is false at the start, the block never runs at all, not even once.\n\nA **do-while** loop runs the block **first** and tests afterwards. So the block always runs **at least once**, whatever the condition says.\n\nThe syllabus comment says this outright: "Code to execute **at least once** and then while the condition is true." That phrase is the answer to the exam question.',
        },
        {
          id: 'b7',
          kind: 'figure',
          figure: 'WhileVsDoFigure',
          caption:
            'Set a condition that is false from the start and run both. Count how many times each body runs.',
          altSummary:
            'Two flow diagrams side by side. The while loop tests the condition first, and only enters the body if it is true, so with a false condition the body runs zero times. The do-while loop enters the body first and tests afterwards, so even with a false condition the body runs exactly once.',
        },
        {
          id: 'b8',
          kind: 'bench',
          preset: 'analog-out',
          title: 'A for loop driving real hardware',
          brief:
            'Two for loops counting 0 to 255 and back. Watch the LED brightness follow the counter. Try changing the delay from 6 to 30 and running it again.',
        },
        {
          id: 'b9',
          kind: 'callout',
          variant: 'misconception',
          title: 'A loop with no way out never ends',
          text: 'If the condition of a while loop never becomes false, the program stops there forever and nothing else in `loop()` ever runs again. That is why the syllabus example includes `count++` inside the block: without it, `count` stays 0 and the loop runs endlessly. Whenever you write a while loop, check that something inside it changes the value the condition is testing.',
        },
        {
          id: 'b10',
          kind: 'sort',
          prompt: 'Which loop suits each job best?',
          buckets: [
            { id: 'for', label: 'for' },
            { id: 'while', label: 'while' },
            { id: 'do', label: 'do-while' },
          ],
          items: [
            {
              id: 'l1',
              label: 'Flash an LED exactly 5 times',
              bucket: 'for',
              why: 'You know the number of repetitions in advance, which is exactly what a for loop is for.',
            },
            {
              id: 'l2',
              label: 'Keep reading a sensor until the value drops below 100',
              bucket: 'while',
              why: 'You do not know how many passes it will take, and if the value is already below 100 you should not read at all.',
            },
            {
              id: 'l3',
              label: 'Ask for a reading, then keep asking until it is valid',
              bucket: 'do',
              why: 'You must take at least one reading before you can judge whether it is valid, which is exactly the do-while shape.',
            },
            {
              id: 'l4',
              label: 'Fade a light through all 256 brightness levels',
              bucket: 'for',
              why: 'A known count from 0 to 255, so a for loop with a counter is the natural fit.',
            },
          ],
        },
        {
          id: 'b11',
          kind: 'explain',
          prompt:
            'Explain the difference between a while loop and a do-while loop, and give a situation where the difference actually matters.',
          rubric: [
            'Says while tests the condition before the block runs',
            'Says do-while runs the block first and tests afterwards',
            'States that do-while always runs at least once',
            'States that while may run zero times if the condition is false at the start',
            'Gives a situation where running at least once is needed',
          ],
          modelAnswer:
            'A while loop checks its condition before running the block, so if the condition is already false at the start the block never runs at all. A do-while loop runs the block first and only checks the condition afterwards, so the block always runs at least once no matter what. The difference matters whenever you need to do something before you can decide whether to keep doing it. For example, asking a user to enter a value: you have to ask once before you can check whether the value is valid, so do-while is correct and while would never ask at all.',
        },
        {
          id: 'b12',
          kind: 'checkpoint',
          title: 'Quick check',
          questionIds: ['q6-6-a', 'q6-6-b', 'q6-6-c'],
        },
      ],
      summary: [
        'Arduino uses for, while and do...while loops for iteration.',
        'A for loop has three parts: initialisation, condition and update, separated by semicolons.',
        'A while loop tests its condition before running the block, so it may run zero times.',
        'A do-while loop runs the block first and tests afterwards, so it always runs at least once.',
        'Something inside the loop must change the value the condition tests, or the loop never ends.',
      ],
      examTip:
        'A "state the difference between while and do-while" question is answered fully by one sentence about when the condition is tested plus one sentence about the minimum number of times the body runs. Both halves are needed.',
      confused: {
        simpler:
          '**for** = repeat a known number of times. **while** = keep going as long as something is true, checking first. **do-while** = do it once, then keep going as long as something is true. The only difference between the last two is whether you check before or after.',
        analogy:
          'while: check whether there is rice in the pot before serving. do-while: serve one plate, then check whether there is rice left. If the pot was empty, the first serves nothing and the second serves one empty plate.',
        reviewLessonId: 'l6-5',
      },
    },
  ],
}
