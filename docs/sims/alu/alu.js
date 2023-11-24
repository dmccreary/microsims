let inputA;
let inputB;
let outputP;
let binDecToggle;
let isBinary = false;

function setup() {
  const canvas = createCanvas(400, 400);
  canvas.parent('canvas-container');
  background(220);
  // textAlign(CENTER, CENTER);

  // Title
  textSize(16);
  text("Arithmetic Logic Unit", 100, 20);

  // Register A
  text("Register A:", 10, 60);
  inputA = createInput('201');
  inputA.position(110, 50);

  // Register B
  text("Register B:", 10, 100);
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
  text("Output:", 10, 200);

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
