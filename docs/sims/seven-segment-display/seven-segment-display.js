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

// Segment colors (darker shades)
let segmentColors = [
  [180, 0, 0],      // a - top (dark red)
  [180, 100, 0],    // b - upper right (dark orange)
  [160, 140, 0],    // c - lower right (dark yellow/gold)
  [0, 140, 0],      // d - bottom (dark green)
  [0, 0, 180],      // e - lower left (dark blue)
  [140, 0, 140],    // f - upper left (dark purple)
  [180, 80, 120]    // g - middle (dark pink)
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

// Draw a horizontal hexagonal segment (pointed ends left and right)
function drawHorizontalSegment(cx, cy, length, width, isOn, colorArr) {
  let halfW = width / 2;
  let pointOffset = width / 2; // How far the point extends

  if (isOn) {
    noStroke();
    fill(colorArr[0], colorArr[1], colorArr[2]);
  } else {
    noFill();
    stroke(200);
    strokeWeight(1);
  }

  beginShape();
  vertex(cx - length - pointOffset, cy);           // Left point
  vertex(cx - length, cy - halfW);                 // Upper-left
  vertex(cx + length, cy - halfW);                 // Upper-right
  vertex(cx + length + pointOffset, cy);           // Right point
  vertex(cx + length, cy + halfW);                 // Lower-right
  vertex(cx - length, cy + halfW);                 // Lower-left
  endShape(CLOSE);
}

// Draw a vertical hexagonal segment (pointed ends top and bottom)
function drawVerticalSegment(cx, cy, length, width, isOn, colorArr) {
  let halfW = width / 2;
  let halfL = length / 2;
  let pointOffset = width / 2; // How far the point extends

  if (isOn) {
    noStroke();
    fill(colorArr[0], colorArr[1], colorArr[2]);
  } else {
    noFill();
    stroke(200);
    strokeWeight(1);
  }

  beginShape();
  vertex(cx, cy - halfL - pointOffset);            // Top point
  vertex(cx + halfW, cy - halfL);                  // Upper-right
  vertex(cx + halfW, cy + halfL);                  // Lower-right
  vertex(cx, cy + halfL + pointOffset);            // Bottom point
  vertex(cx - halfW, cy + halfL);                  // Lower-left
  vertex(cx - halfW, cy - halfL);                  // Upper-left
  endShape(CLOSE);
}

// Draw a digit at position (x, y) with given size
function drawDigit(digit, x, y, size) {
  let segmentOn = segmentMapping[digit];
  let segmentWidth = size / 5;
  let hSegmentLength = size * 0.5;  // Half-length for horizontal segments
  let vSegmentLength = size * 0.85; // Length for vertical segments

  // Horizontal segments (a=0, d=3, g=6)
  let horizontal = [0, 3, 6];
  for (let i of horizontal) {
    let yOffset;
    if (i == 0) yOffset = -size;      // top
    if (i == 3) yOffset = size;       // bottom
    if (i == 6) yOffset = 0;          // middle

    drawHorizontalSegment(x, y + yOffset, hSegmentLength, segmentWidth,
                          segmentOn[i], segmentColors[i]);
  }

  // Vertical segments (b=1, c=2, e=4, f=5)
  let vertical = [1, 2, 4, 5];
  for (let i of vertical) {
    let centerY, xOffset;

    if (i == 1 || i == 5) { centerY = y - size / 2; }  // upper
    if (i == 2 || i == 4) { centerY = y + size / 2; }  // lower
    if (i == 4 || i == 5) { xOffset = -size * 0.65; }  // left
    if (i == 1 || i == 2) { xOffset = size * 0.65; }   // right

    drawVerticalSegment(x + xOffset, centerY, vSegmentLength, segmentWidth,
                        segmentOn[i], segmentColors[i]);
  }
}

// Draw segment labels (a-g) centered on each segment
function drawSegmentLabels(x, y, size) {
  noStroke();
  fill(255); // white text
  textAlign(CENTER, CENTER);
  let labelSize = max(10, size / 6); // Scale font with segment size, minimum 10
  textSize(labelSize);
  textStyle(BOLD);

  // a - top horizontal (centered on segment)
  text('a', x, y - size);

  // b - upper right vertical (centered on segment)
  text('b', x + size * 0.65, y - size / 2);

  // c - lower right vertical (centered on segment)
  text('c', x + size * 0.65, y + size / 2);

  // d - bottom horizontal (centered on segment)
  text('d', x, y + size);

  // e - lower left vertical (centered on segment)
  text('e', x - size * 0.65, y + size / 2);

  // f - upper left vertical (centered on segment)
  text('f', x - size * 0.65, y - size / 2);

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
