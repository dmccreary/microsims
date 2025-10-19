// Simulation of a simple AC circuit and current chart
// The left is a simple AC circuit with a resistor
// The right is a chart showing the current over time
let canvasWidth;
let drawHeight = 280;
let controlHeight = 40;
let canvasHeight;
let running = false;
let time = 0;
let currentValues = [];
let vmargin = 25;
let hmargin = 25;
let circuitWidth;
let circuitHeight;
let chartWidth;
let chartHeight;
let defaultTextSize = 16;
let sliderLeftMargin = 105;

// Button references
let startButton;
let stopButton;
let resetButton;

function updateDimensions() {
  // Get the container width from main element
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
  canvasHeight = drawHeight + controlHeight;
  
  // Responsive dimensions for horizontal only
  // hmargin = canvasWidth * 0.05;
  // fixed width is OK
  circuitWidth = 200;
  // circuit has a fixed height
  circuitHeight = 200;
  chartWidth = canvasWidth * 0.6;
  chartHeight = drawHeight * 0.8;
}

function setup() {
  updateDimensions();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Make text size responsive
  let responsiveTextSize = max(12, min(16, canvasWidth * 0.02));
  textSize(responsiveTextSize);

  startButton = createButton('Start');
  startButton.position(10, drawHeight + 10);
  startButton.mousePressed(() => {
    running = true;
    startButton.attribute('disabled', '');
    stopButton.removeAttribute('disabled');
  });

  stopButton = createButton('Stop');
  stopButton.position(70, drawHeight + 10);
  stopButton.mousePressed(() => {
    running = false;
    stopButton.attribute('disabled', '');
    startButton.removeAttribute('disabled');
  });
  stopButton.attribute('disabled', '');

  resetButton = createButton('Reset');
  resetButton.position(130, drawHeight + 10);
  resetButton.mousePressed(() => {
    resetSimulation();
    stopButton.attribute('disabled', '');
    startButton.removeAttribute('disabled');
  });

  describe('AC Circuit simulation showing current flow and waveform', LABEL);
}

function windowResized() {
  updateDimensions();
  resizeCanvas(canvasWidth, canvasHeight);
  
  // Update button positions using stored references
  startButton.position(10, drawHeight + 10);
  stopButton.position(70, drawHeight + 10);
  resetButton.position(130, drawHeight + 10);
}

function draw() {
  // Draw area background
  background(255);
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  
  // Controls area background
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textSize(24);
  textAlign(CENTER, TOP);
  text("AC Circuit Simulation", canvasWidth/2, vmargin/2);
  
  // Reset text properties
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  
  drawCircuit();
  drawChart();

  if (running) {
    time += deltaTime / 1000;
    let current = 5 * sin(TWO_PI * time);
    currentValues.push(current);
    if (currentValues.length > chartWidth) {
      currentValues.shift();
    }
  }
}

function drawCircuit() {
  stroke(0);
  fill(245);
  
  // Draw circuit square
  rect(hmargin, vmargin * 2, circuitWidth, circuitHeight);
  
  // AC source circle
  fill('gray');
  let circleSize = 40;
  // x, y, radius
  circle(hmargin, vmargin + 125, circleSize);
  
  // Circuit lines
  line(hmargin, vmargin * 2, hmargin + circuitWidth, vmargin * 2);
  
  // Resistor
  strokeWeight(10);
  // vertical line
  x_offset = hmargin + circuitWidth
  line(x_offset, vmargin * 5, x_offset, vmargin * 2 + circuitHeight - vmargin*3);
  strokeWeight(1);
  
  fill(0);
  let labelSize = max(12, min(16, circuitWidth * 0.08));
  noStroke();
  textSize(labelSize);
  text("1 kHz", hmargin + circuitWidth * 0.15, circuitHeight/2 + vmargin * 2);
  text("1K Ohm", hmargin + circuitWidth * 0.65, circuitHeight/2 + vmargin * 2);
}

// be responsive only in the width, not the height
function drawChart() {
  const xOffset = 280;
  const yOffset = vmargin * 2.5;

  // Axes
  stroke(0);
  // horizontal line
  hline_yOffest = drawHeight - 30;
  vline_xOffset = xOffset + 10;
  // horizontal line
  line(xOffset, hline_yOffest, canvasWidth - 10, hline_yOffest);
  // vertical line
  line(xOffset, vmargin * 2.5, xOffset, hline_yOffest);
  
  // Axis Labels
  let labelSize = 16;
  noStroke();
  textSize(labelSize);
  text('Current', xOffset, yOffset-10);
  text('Time', canvasWidth - 50, drawHeight - 15);

  // Plot current values
  noFill();
  stroke(0);
  // draw the waveform from the current values
  beginShape();
  for (let i = 0; i < currentValues.length; i++) {
    let x = map(i, 0, currentValues.length - 1, xOffset, canvasWidth - 10);
    let y = map(currentValues[i], -5, 5, yOffset + chartHeight - 40, yOffset);
    vertex(x, y);
  }
  endShape();
}

function resetSimulation() {
  currentValues = [];
  time = 0;
  running = false;
}
