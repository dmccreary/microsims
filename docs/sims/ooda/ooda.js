// OODA Loop MicroSim
// Demonstrates the Observe-Orient-Decide-Act decision-making cycle
// Created by: Claude and Dan McCreary
// Concept developed by: Colonel John Boyd, USAF

// Canvas dimensions - REQUIRED structure
let canvasWidth = 800;              // Initial width (responsive)
let drawHeight = 500;               // Drawing/simulation area height
let controlHeight = 120;            // Controls area height
let canvasHeight = drawHeight + controlHeight;
let margin = 25;                    // Margin for visual elements
let sliderLeftMargin = 150;         // Left margin for slider positioning
let defaultTextSize = 16;           // Base text size

// Simulation state
let isRunning = false;
let agent1Speed = 1.0;
let agent2Speed = 0.6;
let agent1Angle = 0;  // Current position in loop (0 to 2*PI)
let agent2Angle = 0;
let agent1Cycles = 0; // Number of completed cycles
let agent2Cycles = 0;

// UI Controls
let agent1SpeedSlider;
let agent2SpeedSlider;
let startButton;
let resetButton;

// OODA Loop phases
const phases = ['Observe', 'Orient', 'Decide', 'Act'];
const phaseColors = ['#4A90E2', '#50C878', '#FFD700', '#FF6B6B'];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Create controls
  agent1SpeedSlider = createSlider(0.2, 3.0, agent1Speed, 0.1);
  agent1SpeedSlider.position(sliderLeftMargin, drawHeight + 15);
  agent1SpeedSlider.size(canvasWidth - sliderLeftMargin - margin);

  agent2SpeedSlider = createSlider(0.2, 3.0, agent2Speed, 0.1);
  agent2SpeedSlider.position(sliderLeftMargin, drawHeight + 45);
  agent2SpeedSlider.size(canvasWidth - sliderLeftMargin - margin);

  startButton = createButton('Start');
  startButton.position(sliderLeftMargin, drawHeight + 80);
  startButton.mousePressed(toggleSimulation);

  resetButton = createButton('Reset');
  resetButton.position(sliderLeftMargin + 80, drawHeight + 80);
  resetButton.mousePressed(resetSimulation);

  describe('Interactive simulation of the OODA Loop (Observe, Orient, Decide, Act) showing two agents progressing through decision cycles at different speeds.', LABEL);
}

function draw() {
  updateCanvasSize();

  // Drawing area (light blue background)
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);

  // Control area (white background)
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  textSize(28);
  textAlign(CENTER, TOP);
  noStroke();
  text('OODA Loop Decision Cycle', canvasWidth/2, 10);

  textSize(14);
  text('Developed by Colonel John Boyd, USAF', canvasWidth/2, 42);

  // Reset defaults
  stroke(0);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);

  // Update speeds from sliders
  agent1Speed = agent1SpeedSlider.value();
  agent2Speed = agent2SpeedSlider.value();

  // Update simulation
  if (isRunning) {
    // Progress through the loop (speed determines how fast)
    agent1Angle += agent1Speed * 0.02;
    agent2Angle += agent2Speed * 0.02;

    // Count completed cycles
    if (agent1Angle >= TWO_PI) {
      agent1Angle = agent1Angle % TWO_PI;
      agent1Cycles++;
    }
    if (agent2Angle >= TWO_PI) {
      agent2Angle = agent2Angle % TWO_PI;
      agent2Cycles++;
    }
  }

  // Draw the two OODA loops
  let loop1CenterX = canvasWidth * 0.3;
  let loop2CenterX = canvasWidth * 0.7;
  let loopCenterY = drawHeight * 0.55;
  let loopRadius = min(canvasWidth * 0.18, drawHeight * 0.28);

  // Agent 1 Loop (Blue Agent)
  drawOODALoop(loop1CenterX, loopCenterY, loopRadius, agent1Angle, '#2874A6', 'Agent 1 (Blue)', agent1Cycles);

  // Agent 2 Loop (Red Agent)
  drawOODALoop(loop2CenterX, loopCenterY, loopRadius, agent2Angle, '#C0392B', 'Agent 2 (Red)', agent2Cycles);

  // Draw control labels and values
  drawControls();
}

function drawOODALoop(centerX, centerY, radius, currentAngle, agentColor, agentLabel, cycles) {
  push();
  translate(centerX, centerY);

  // Draw the four phases as circle segments
  let angleStep = TWO_PI / 4;
  for (let i = 0; i < 4; i++) {
    let startAngle = i * angleStep - HALF_PI;  // Start from top
    let endAngle = startAngle + angleStep;

    // Fill with phase color
    fill(phaseColors[i]);
    stroke(0);
    strokeWeight(2);
    arc(0, 0, radius * 2, radius * 2, startAngle, endAngle, PIE);

    // Add phase labels
    let labelAngle = startAngle + angleStep / 2;
    let labelRadius = radius * 0.65;
    let labelX = cos(labelAngle) * labelRadius;
    let labelY = sin(labelAngle) * labelRadius;

    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(14);
    text(phases[i], labelX, labelY);
  }

  // Draw current position marker
  let markerAngle = currentAngle - HALF_PI;
  let markerRadius = radius * 0.9;
  let markerX = cos(markerAngle) * markerRadius;
  let markerY = sin(markerAngle) * markerRadius;

  fill(agentColor);
  stroke(0);
  strokeWeight(2);
  circle(markerX, markerY, 20);

  // Draw agent label
  textAlign(CENTER, CENTER);
  textSize(18);
  fill(0);
  noStroke();
  text(agentLabel, 0, -radius - 35);

  // Draw cycle counter
  textSize(16);
  text('Cycles: ' + cycles, 0, radius + 30);

  pop();
}

function drawControls() {
  fill('black');
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);

  // Agent 1 Speed label
  text('Agent 1 Speed:', 10, drawHeight + 25);
  text(agent1Speed.toFixed(1), sliderLeftMargin + canvasWidth - sliderLeftMargin - margin + 10, drawHeight + 25);

  // Agent 2 Speed label
  text('Agent 2 Speed:', 10, drawHeight + 55);
  text(agent2Speed.toFixed(1), sliderLeftMargin + canvasWidth - sliderLeftMargin - margin + 10, drawHeight + 55);

  // Instructions
  textSize(12);
  text('Adjust speeds to see competitive advantage of faster decision cycles', 10, drawHeight + 105);
}

function toggleSimulation() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}

function resetSimulation() {
  isRunning = false;
  startButton.html('Start');
  agent1Angle = 0;
  agent2Angle = 0;
  agent1Cycles = 0;
  agent2Cycles = 0;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
    // Reposition all controls to match new width
    if (typeof agent1SpeedSlider !== 'undefined') {
      agent1SpeedSlider.size(canvasWidth - sliderLeftMargin - margin);
      agent2SpeedSlider.size(canvasWidth - sliderLeftMargin - margin);
    }
  }
}
