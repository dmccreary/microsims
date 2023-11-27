
// Global canvas dimensions
let canvasWidth = 400;
let canvasHeight = 300;

// Binary bits and decimal value
let bits = [0, 0, 0, 0];
let decimalValue = 0;

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');
  textSize(16);
  background(245);

  // Create toggle buttons for each bit with correct labeling
  for (let i = 0; i < 4; i++) {
    let btn = createButton('Bit ' + i);
    btn.position(20 + (3 - i) * 80, 150); // Placing buttons with Bit 3 on the left and Bit 0 on the right
    btn.mousePressed(() => toggleBit(i));
  }
}

function draw() {
  // Clear the previous frame
  clear();
  background(245);

  // Draw binary bits
  for (let i = 0; i < bits.length; i++) {
    text(bits[i], 40 + (3 - i) * 80, 100); // Displaying bits with Bit 3 on the left and Bit 0 on the right
  }

  // Calculate and draw the decimal value
  decimalValue = binaryToDecimal(bits);
  text('Decimal: ' + decimalValue, 20, 200);
}

// Toggle bit value
function toggleBit(index) {
  bits[index] = bits[index] === 0 ? 1 : 0;
}

// Convert binary array to decimal
function binaryToDecimal(binaryArray) {
  let decimal = 0;
  for (let i = 0; i < binaryArray.length; i++) {
    decimal += binaryArray[i] * Math.pow(2, i);
  }
  return decimal;
}
