// Seven-Segment Display MicroSim
// Canvas dimensions
let canvasWidth = 500;
let drawHeight = 400;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 100;
let defaultTextSize = 16;

// UI elements
let digitSlider, sizeSlider;

// Segment labels
let segmentLabels = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

// Segment mapping for digits 0-9 [a, b, c, d, e, f, g]
let segmentMapping = [
  [1, 1, 1, 1, 1, 1, 0], // 0
  [0, 1, 1, 0, 0, 0, 0], // 1
  [1, 1, 0, 1, 1, 0, 1], // 2
  [1, 1, 1, 1, 0, 0, 1], // 3
  [0, 1, 1, 0, 0, 1, 1], // 4
  [1, 0, 1, 1, 0, 1, 1], // 5
  [1, 0, 1, 1, 1, 1, 1], // 6
  [1, 1, 1, 0, 0, 0, 0], // 7
  [1, 1, 1, 1, 1, 1, 1], // 8
  [1, 1, 1, 1, 0, 1, 1]  // 9
];

// Segment colors
let segmentColors = [
  [255, 0, 0],      // a - top (red)
  [255, 170, 0],    // b - upper right (orange)
  [255, 255, 0],    // c - lower right (yellow)
  [0, 255, 0],      // d - bottom (green)
  [0, 0, 255],      // e - lower left (blue)
  [200, 0, 200],    // f - upper left (purple)
  [245, 180, 200]   // g - middle (pink)
];

// Segment descriptions
let segmentDescriptions = [
  'top',
  'upper right',
  'lower right',
  'bottom',
  'lower left',
  'upper left',
  'middle'
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Digit slider (0-9)
  digitSlider = createSlider(0, 9, 8, 1);
  digitSlider.position(sliderLeftMargin, drawHeight + 15);
  digitSlider.size(canvasWidth - sliderLeftMargin - margin);

  // Size slider
  sizeSlider = createSlider(10, 150, 80, 1);
  sizeSlider.position(sliderLeftMargin, drawHeight + 40);
  sizeSlider.size(canvasWidth - sliderLeftMargin - margin);

  describe('Interactive 7-segment display showing digits 0-9 with colored segments and segment status list', LABEL);
}

function draw() {
  // Draw area background
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Get slider values
  let digit = digitSlider.value();
  let sz = sizeSlider.value();

  // Draw slider labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  text('Digit: ' + digit, margin, drawHeight + 25);
  text('Size: ' + sz, margin, drawHeight + 50);

  // Draw segment status list on the left
  drawSegmentList(digit, margin, 60);

  // Draw the 7-segment display (offset right to make room for list)
  let displayX = canvasWidth / 2 + 60;
  let displayY = drawHeight / 2;
  drawDigit(digit, displayX, displayY, sz);
  drawSegmentLabels(displayX, displayY, sz);
}

// Draw the segment status list on the left side
function drawSegmentList(digit, x, y) {
  let segmentOn = segmentMapping[digit];

  // Header
  fill('black');
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  text('Segment Status:', x, y);
  textStyle(NORMAL);

  let lineHeight = 22;
  let startY = y + 30;

  for (let i = 0; i < 7; i++) {
    let yPos = startY + i * lineHeight;

    // Draw colored indicator circle
    if (segmentOn[i]) {
      fill(segmentColors[i][0], segmentColors[i][1], segmentColors[i][2]);
    } else {
      fill(200); // gray for off
    }
    noStroke();
    ellipse(x + 10, yPos + 8, 12, 12);

    // Draw segment label and status
    fill('black');
    textAlign(LEFT, TOP);
    let status = segmentOn[i] ? 'ON' : 'OFF';
    let statusColor = segmentOn[i] ? color(0, 128, 0) : color(150);

    // Segment letter in bold
    textStyle(BOLD);
    text(segmentLabels[i] + ':', x + 22, yPos);

    // Description
    textStyle(NORMAL);
    fill(80);
    text(segmentDescriptions[i], x + 38, yPos);

    // Status (ON/OFF)
    fill(statusColor);
    textStyle(BOLD);
    text(status, x + 110, yPos);
    textStyle(NORMAL);
  }

  // Reset text size
  textSize(defaultTextSize);
}

// Draw a digit at position (x, y) with given size
function drawDigit(digit, x, y, size) {
  let segmentOn = segmentMapping[digit];
  let segmentWidth = size / 4;
  let segmentLength = size * 0.6;

  // Horizontal segments (a=0, d=3, g=6)
  let horizontal = [0, 3, 6];
  for (let i of horizontal) {
    let yOffset;
    if (i == 0) yOffset = -size;      // top
    if (i == 3) yOffset = size;       // bottom
    if (i == 6) yOffset = 0;          // middle

    if (segmentOn[i]) {
      // Draw filled segment
      noStroke();
      fill(segmentColors[i][0], segmentColors[i][1], segmentColors[i][2]);
      rect(x - segmentLength, y + yOffset - segmentWidth/2, segmentLength * 2, segmentWidth, 3);
    } else {
      // Draw thin outline only
      noFill();
      stroke(200);
      strokeWeight(1);
      rect(x - segmentLength, y + yOffset - segmentWidth/2, segmentLength * 2, segmentWidth, 3);
    }
  }

  // Vertical segments (b=1, c=2, e=4, f=5)
  let vertical = [1, 2, 4, 5];
  for (let i of vertical) {
    let startY, xOffset;

    if (i == 1 || i == 5) { startY = y - size; }      // upper
    if (i == 2 || i == 4) { startY = y; }              // lower
    if (i == 4 || i == 5) { xOffset = -size * 0.7; }  // left
    if (i == 1 || i == 2) { xOffset = size * 0.7; }   // right

    if (segmentOn[i]) {
      // Draw filled segment
      noStroke();
      fill(segmentColors[i][0], segmentColors[i][1], segmentColors[i][2]);
      rect(x + xOffset - segmentWidth/2, startY, segmentWidth, size, 3);
    } else {
      // Draw thin outline only
      noFill();
      stroke(200);
      strokeWeight(1);
      rect(x + xOffset - segmentWidth/2, startY, segmentWidth, size, 3);
    }
  }
}

// Draw segment labels (a-g) over each segment
function drawSegmentLabels(x, y, size) {
  noStroke();
  fill(120); // light gray for labels
  textAlign(CENTER, CENTER);
  textSize(14);
  textStyle(BOLD);

  // a - top horizontal
  text('a', x, y - size - 15);

  // b - upper right vertical
  text('b', x + size * 0.7 + 15, y - size / 2);

  // c - lower right vertical
  text('c', x + size * 0.7 + 15, y + size / 2);

  // d - bottom horizontal
  text('d', x, y + size + 15);

  // e - lower left vertical
  text('e', x - size * 0.7 - 15, y + size / 2);

  // f - upper left vertical
  text('f', x - size * 0.7 - 15, y - size / 2);

  // g - middle horizontal (centered on segment)
  text('g', x, y);

  textStyle(NORMAL);
  textSize(defaultTextSize);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);

  // Reposition sliders
  digitSlider.position(sliderLeftMargin, drawHeight + 15);
  digitSlider.size(canvasWidth - sliderLeftMargin - margin);
  sizeSlider.position(sliderLeftMargin, drawHeight + 45);
  sizeSlider.size(canvasWidth - sliderLeftMargin - margin);

  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
  }
}
