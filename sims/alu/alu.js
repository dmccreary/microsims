// ALU MicroSim - Redesigned with sliders and bit visualization
let canvasWidth = 400;
let canvasHeight = 350;
let containerWidth;

// Layout constants
let sliderLeftMargin = 140;
let margin = 20;
let bitBoxSize = 28;
let bitSpacing = 4;

// UI elements
let sliderA, sliderB;
let operationSelect;

// Current values
let valueA = 100;
let valueB = 50;
let result = 0;
let currentOperation = "ADD";

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');

  describe('Arithmetic Logic Unit simulator with sliders for two 8-bit registers, operation selector, and bit visualization showing binary representations', LABEL);

  // Register A slider (0-255 for 8-bit)
  sliderA = createSlider(0, 255, valueA);
  sliderA.parent('canvas-container');
  sliderA.style('width', (canvasWidth - sliderLeftMargin - margin) + 'px');
  sliderA.input(updateValues);

  // Register B slider
  sliderB = createSlider(0, 255, valueB);
  sliderB.parent('canvas-container');
  sliderB.style('width', (canvasWidth - sliderLeftMargin - margin) + 'px');
  sliderB.input(updateValues);

  // Operation selector
  operationSelect = createSelect();
  operationSelect.parent('canvas-container');
  operationSelect.option('ADD');
  operationSelect.option('SUBTRACT');
  operationSelect.option('AND');
  operationSelect.option('OR');
  operationSelect.option('XOR');
  operationSelect.selected('ADD');
  operationSelect.changed(updateValues);
  operationSelect.style('font-size', '14px');
  operationSelect.style('padding', '4px 8px');

  positionElements();
  updateValues();
}

function draw() {
  background('aliceblue');

  // Title
  fill('black');
  noStroke();
  textSize(20);
  textAlign(CENTER, TOP);
  text("8-Bit Arithmetic Logic Unit (ALU)", canvasWidth / 2, 12);

  // Decimal column header
  textSize(12);
  textAlign(RIGHT, TOP);
  fill('#666');
  text("Decimal", canvasWidth - margin, 38);

  // Register A section
  drawRegisterSection("Register A", valueA, 50, false);

  // Register B section
  drawRegisterSection("Register B", valueB, 140, false);

  // Operation label
  textSize(14);
  textAlign(RIGHT, CENTER);
  fill('black');
  text("Operation:", sliderLeftMargin - 10, 233);

  // Result section
  drawResultSection();
}

function drawRegisterSection(label, value, yPos, isResult) {
  textSize(14);
  textAlign(RIGHT, CENTER);
  fill('black');

  // Label
  text(label + ":", sliderLeftMargin - 10, yPos + 12);

  // Decimal value (right-aligned after slider)
  textAlign(RIGHT, CENTER);
  textSize(16);
  fill('#333');
  text(value, canvasWidth - margin, yPos + 12);

  // Bit visualization
  let bitsY = yPos + 35;
  drawBits(value, sliderLeftMargin, bitsY, null);
}

function drawResultSection() {
  let yPos = 230;

  // Result label and value
  textSize(14);
  textAlign(RIGHT, CENTER);
  fill('black');
  text("Result:", sliderLeftMargin - 10, yPos + 60);

  // Handle overflow indication
  let displayResult = result;
  let overflowText = "";

  if (result > 255) {
    overflowText = " (overflow)";
  } else if (result < 0) {
    overflowText = " (underflow)";
  }

  // Decimal value
  textAlign(RIGHT, CENTER);
  textSize(18);
  fill('blue');
  fontWeight = 'bold';
  text(displayResult + overflowText, canvasWidth - margin, yPos + 62);

  // Bit visualization with color coding for bitwise ops
  let bitsY = yPos + 40;
  let compareValues = null;

  if (currentOperation === "AND" || currentOperation === "OR" || currentOperation === "XOR") {
    compareValues = { a: valueA, b: valueB, op: currentOperation };
  }

  // For display, clamp to 8-bit range or show modulo
  let displayBits = result >= 0 ? result & 0xFF : ((result % 256) + 256) % 256;
  drawBits(displayBits, sliderLeftMargin, bitsY, compareValues);

  // Operation explanation
  textSize(12);
  textAlign(LEFT, TOP);
  fill('#555');
  let explanation = getOperationExplanation();
  text(explanation, margin, yPos + 90);
}

function drawBits(value, x, y, compareValues) {
  let binaryStr = value.toString(2).padStart(8, '0');

  for (let i = 0; i < 8; i++) {
    let bitX = x + i * (bitBoxSize + bitSpacing);
    let bit = binaryStr[i];

    // Determine box color
    let boxColor;
    if (bit === '1') {
      boxColor = color(50, 150, 50); // Green for 1
    } else {
      boxColor = color(220, 220, 220); // Light gray for 0
    }

    // Color coding for bitwise operations
    if (compareValues) {
      let bitIndex = 7 - i;
      let bitA = (compareValues.a >> bitIndex) & 1;
      let bitB = (compareValues.b >> bitIndex) & 1;
      let resultBit = parseInt(bit);

      // Highlight bits that changed or are significant
      if (compareValues.op === "AND" && bitA === 1 && bitB === 1) {
        boxColor = color(50, 180, 50); // Bright green - both inputs were 1
      } else if (compareValues.op === "OR" && (bitA === 1 || bitB === 1)) {
        boxColor = resultBit === 1 ? color(50, 150, 200) : color(220, 220, 220); // Blue for OR result
      } else if (compareValues.op === "XOR" && bitA !== bitB) {
        boxColor = color(200, 100, 50); // Orange for XOR difference
      }
    }

    // Draw box
    fill(boxColor);
    stroke(100);
    strokeWeight(1);
    rect(bitX, y, bitBoxSize, bitBoxSize, 4);

    // Draw bit value
    fill(bit === '1' ? 255 : 80);
    noStroke();
    textSize(14);
    textAlign(CENTER, CENTER);
    text(bit, bitX + bitBoxSize / 2, y + bitBoxSize / 2);
  }

  // Bit position labels
  fill('#999');
  textSize(9);
  textAlign(CENTER, TOP);
  for (let i = 0; i < 8; i++) {
    let bitX = x + i * (bitBoxSize + bitSpacing);
    text(7 - i, bitX + bitBoxSize / 2, y + bitBoxSize + 2);
  }
}

function getOperationExplanation() {
  switch (currentOperation) {
    case "ADD":
      return valueA + " + " + valueB + " = " + result;
    case "SUBTRACT":
      return valueA + " - " + valueB + " = " + result;
    case "AND":
      return "Bits are 1 only where BOTH inputs are 1 (green)";
    case "OR":
      return "Bits are 1 where EITHER input is 1 (blue)";
    case "XOR":
      return "Bits are 1 where inputs DIFFER (orange)";
  }
}

function updateValues() {
  valueA = sliderA.value();
  valueB = sliderB.value();
  currentOperation = operationSelect.value();

  switch (currentOperation) {
    case "ADD":
      result = valueA + valueB;
      break;
    case "SUBTRACT":
      result = valueA - valueB;
      break;
    case "AND":
      result = valueA & valueB;
      break;
    case "OR":
      result = valueA | valueB;
      break;
    case "XOR":
      result = valueA ^ valueB;
      break;
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionElements();
}

function updateCanvasSize() {
  const container = document.getElementById('canvas-container');
  if (container) {
    containerWidth = container.offsetWidth;
    canvasWidth = containerWidth;
  }
}

function positionElements() {
  // Update slider widths
  let sliderWidth = canvasWidth - sliderLeftMargin - margin - 50;
  sliderA.style('width', sliderWidth + 'px');
  sliderB.style('width', sliderWidth + 'px');

  // Position sliders
  sliderA.position(sliderLeftMargin, 48);
  sliderB.position(sliderLeftMargin, 138);

  // Position operation selector
  operationSelect.position(sliderLeftMargin, 223);
}
