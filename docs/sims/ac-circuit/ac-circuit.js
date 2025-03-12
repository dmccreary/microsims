// AC circuit and current chart

let canvasWidth;
let drawHeight = 250;
let controlHeight = 50;
let canvasHeight;
let running = false;
let time = 0;
let currentValues = [];
let margin;
let circuitWidth;
let circuitHeight;
let chartWidth;
let chartHeight;
let defaultTextSize = 16;
let sliderLeftMargin = 105;

function updateDimensions() {
  // Get the container width from main element
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
  canvasHeight = drawHeight + controlHeight;
  
  // Responsive dimensions
  margin = canvasWidth * 0.05;
  circuitWidth = canvasWidth * 0.3;
  circuitHeight = drawHeight * 0.6;
  chartWidth = canvasWidth * 0.5;
  chartHeight = drawHeight * 0.8;
}

function setup() {
  updateDimensions();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Make text size responsive
  let responsiveTextSize = max(12, min(16, canvasWidth * 0.02));
  textSize(responsiveTextSize);

  const startButton = createButton('Start');
  startButton.position(10, drawHeight + 10);
  startButton.mousePressed(() => {
    running = true;
    startButton.attribute('disabled', '');
    stopButton.removeAttribute('disabled');
  });

  const stopButton = createButton('Stop');
  stopButton.position(70, drawHeight + 10);
  stopButton.mousePressed(() => {
    running = false;
    stopButton.attribute('disabled', '');
    startButton.removeAttribute('disabled');
  });
  stopButton.attribute('disabled', '');

  const resetButton = createButton('Reset');
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
  
  // Update button positions
  const buttons = document.querySelectorAll('button');
  if (buttons.length >= 3) {
    buttons[0].position(10, drawHeight + 10);
    buttons[1].position(70, drawHeight + 10);
    buttons[2].position(130, drawHeight + 10);
  }
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
  text("AC Circuit Simulation", canvasWidth/2, margin/2);
  
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
  rect(margin, margin * 2, circuitWidth, circuitHeight);
  
  // AC source circle
  fill('gray');
  let circleSize = min(40, circuitWidth * 0.2);
  circle(margin, circuitHeight/2 + margin * 2, circleSize);
  
  // Circuit lines
  line(margin, margin * 2, margin + circuitWidth, margin * 2);
  
  // Resistor
  strokeWeight(min(10, circuitWidth * 0.05));
  line(margin + circuitWidth, margin * 3, margin + circuitWidth, margin * 2 + circuitHeight - margin);
  strokeWeight(1);
  
  fill(0);
  let labelSize = max(12, min(16, circuitWidth * 0.08));
  textSize(labelSize);
  text("1 kHz", margin + circuitWidth * 0.1, circuitHeight/2 + margin * 2);
  text("1K Ohm", margin + circuitWidth * 0.7, circuitHeight/2 + margin * 2);
}

function drawChart() {
  const xOffset = canvasWidth * 0.45;
  const yOffset = margin * 2;

  // Axes
  stroke(0);
  line(xOffset, yOffset + chartHeight, xOffset + chartWidth, yOffset + chartHeight);
  line(xOffset, yOffset + 10, xOffset, yOffset + chartHeight);
  
  // Axis Labels
  let labelSize = max(12, min(16, chartWidth * 0.05));
  textSize(labelSize);
  text('Current', xOffset, yOffset);
  text('Time', xOffset + chartWidth - 40, yOffset + chartHeight + 20);

  // Plot current values
  noFill();
  stroke(0);
  beginShape();
  for (let i = 0; i < currentValues.length; i++) {
    let x = map(i, 0, currentValues.length - 1, xOffset, xOffset + chartWidth);
    let y = map(currentValues[i], -5, 5, yOffset + chartHeight, yOffset);
    vertex(x, y);
  }
  endShape();
}

function resetSimulation() {
  currentValues = [];
  time = 0;
  running = false;
}
