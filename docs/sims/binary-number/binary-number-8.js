// Global canvas dimensions
let canvasWidth = 480;
let canvasHeight = 100;

// Binary bits and decimal value for 8 bits
let bits = [0, 0, 0, 0, 0, 0, 0, 0];
let decimalValue = 0;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  textSize(32);
  background(245);

  // Create toggle buttons for each of the 8 bits
  for (let i = 0; i < 8; i++) {
    // make the lable on the button reflect the value
    let btn = createButton(str(pow(2, i)));
    btn.position(20 + (7 - i) * 60, 40);  // Keeping buttons in the same order
    btn.mousePressed(() => toggleBit(i));
  }
}

function draw() {
  // Clear the previous frame
  clear();
  background(240);

  // Draw binary bits with the 128-bit (MSB) as the first one on the left
  for (let i = 0; i < bits.length; i++) {
    text(bits[7 - i], 25 + i * 60, 30);  // MSB on the left
  }

  // Calculate and draw the decimal value
  decimalValue = binaryToDecimal(bits);
  text('Decimal: ' + decimalValue, 20, 93);  // Position for decimal value display
}

// Toggle bit value
function toggleBit(index) {
  bits[index] = bits[index] === 0 ? 1 : 0;
}

// Convert binary array to decimal
function binaryToDecimal(binaryArray) {
  let decimal = 0;
  for (let i = 0; i < binaryArray.length; i++) {
    decimal += binaryArray[7-i] * Math.pow(2, binaryArray.length - 1 - i);
  }
  return decimal;
}
