# Simulation of an Arithmetic Logic Unit (ALU)

Prompt:

```linenums="0"
Create a single file ps.js sketch on a 400x400 canvas.
The sketch is a simulation of an Arithmetic Logic Unit (ALU).
Place a title "Arithmetic Logic Unit" on the top center of the canvas of text size 16.
The inputs are two registers: A and B.
Place the labels for the registers to the left of text inputs.
Place the input registers so the align vertically.
Place buttons for the operations below the registers.
The operation are: ADD, SUBTRACT, AND, OR, XOR.
Display the value of the output below the operations.
Label the output value "Output" in blue text.
Create an input toggle button to display all values in either binary or decimal.
Make the default value be decimal.
```

[Demo](alu.html)

```js
let inputA;
let inputB;
let outputP;
let binDecToggle;
let isBinary = false;

function setup() {
  createCanvas(400, 400);
  background(220);
  textAlign(CENTER, CENTER);

  // Title
  textSize(16);
  text("Arithmetic Logic Unit", width/2, 20);

  // Register A
  text("Register A:", 60, 60);
  inputA = createInput('201');
  inputA.position(110, 50);

  // Register B
  text("Register B:", 60, 100);
  inputB = createInput('100');
  inputB.position(110, 90);

  // Operations
  let addBtn = createButton('ADD');
  addBtn.position(20, 140);
  addBtn.mousePressed(() => performOperation("ADD"));

  let subBtn = createButton('SUBTRACT');
  subBtn.position(70, 140);
  subBtn.mousePressed(() => performOperation("SUBTRACT"));

  let andBtn = createButton('AND');
  andBtn.position(165, 140);
  andBtn.mousePressed(() => performOperation("AND"));

  let orBtn = createButton('OR');
  orBtn.position(220, 140);
  orBtn.mousePressed(() => performOperation("OR"));

  let xorBtn = createButton('XOR');
  xorBtn.position(265, 140);
  xorBtn.mousePressed(() => performOperation("XOR"));

  // Output label
  fill('blue');
  text("Output:", 60, 200);

  // Output display
  outputP = createP("0");
  outputP.position(110, 175);

  // Binary/Decimal toggle button
  binDecToggle = createButton('Toggle Binary/Decimal');
  binDecToggle.position(100, 220);
  binDecToggle.mousePressed(toggleBinDec);
}

function draw() {
  // nothing
}

function performOperation(operation) {
  let a = int(inputA.value());
  let b = int(inputB.value());

  let result;

  switch (operation) {
    case "ADD":
      result = a + b;
      break;
    case "SUBTRACT":
      result = a - b;
      break;
    case "AND":
      result = a & b;
      break;
    case "OR":
      result = a | b;
      break;
    case "XOR":
      result = a ^ b;
      break;
  }

// Convert decimal number to binary
function dec_bin(decNum) {
  if (decNum === 0) return "0";

  let binary = "";
  while (decNum > 0) {
    binary = (decNum % 2) + binary;
    decNum = Math.floor(decNum / 2);
  }
  return binary;
}

  if (isBinary) {
    outputP.html(dec_bin(result));
  } else {
    outputP.html(result.toString());
  }
}

function toggleBinDec() {
  isBinary = !isBinary;

  performOperation("ADD"); // Refresh the value on toggle
}
```

## Challenges

Real ALUs also keep track of several bits if information about the
result of the arithmetic such as if there were overflows.

!!! Challenges
    1. Add a bit to indicate the result is non-zero.
    2. Add a sign flag to indicate the number is non-negative
    3. Add a carry flag to indicate that the result fits in 16 bits
    4. Add an overflow flag to indicate that the sum of two numbers is also positive

## References

I love this small simulator from CircuitVerse:

[Four Bit ALU on CircuitVerse](https://circuitverse.org/simulator/51702) - This
shows the process of using an OpCode which is a number for an operation. The carry
bit does not work in this example.

A much better example is here:

[University of New Brunswick EE3221 Course](http://www.ee.unb.ca/cgi-bin/tervo/alu.pl)

That version is a binary only but it includes the following flags:

Flags
The Zero flag (Z) is 0 because the result is non-zero

The Sign flag (N) is 0 because the result appears non-negative (the MSB is 0)

The Carry flag (C) is 0 (good) because the addition result did not exceed 16-bits.
This would be of interest if (RA,RB) represent unsigned integers (0..65535).

The Overflow flag (V) is 0 (good) because adding two positive numbers gave a positive result.
This would be of interest if (RA,RB) represent signed integers (-32768..+32767).