// Bathtub Stock and Flow MicroSim - a tub fills from a source and empties through a drain
// CANVAS_HEIGHT: 550
// Learning objective (Understand / explain): the learner explains how the difference between
// the source flow rate and the drain flow rate changes the water height over time.
//
// Model (one step per animation frame):
//   waterHeight = waterHeight + sourceFlowRate - drainFlow
//   waterHeight is kept between 0 (empty) and tubHeight (full)
// The checkbox picks one of two drain models:
//   unchecked (default):  drainFlow = drainFlowRate                                 (constant)
//   checked:              drainFlow = drainFlowRate * sqrt(waterHeight / tubHeight)  (Torricelli's law)
// With a constant drain the chart lines are straight. With the Torricelli drain a fuller tub
// drains faster, so the lines curve and the tub can settle at a level between empty and full.
// The water height is the stock. The source and the drain are the flows.
// The tub and the chart share the same vertical scale, so the water surface in the tub
// always lines up with the newest point on the chart.

// ---------- Canvas dimensions (standard MicroSim layout) ----------
let canvasWidth = 400;               // updated from the container width
let drawHeight = 400;                // drawing region (aliceblue)
let controlHeight = 150;             // control region (white): 4 rows of controls
let canvasHeight = drawHeight + controlHeight;  // 550
let margin = 25;
let sliderLeftMargin = 205;          // room for "Max Drain Flow Rate: 0.0" to the left of the slider
let defaultTextSize = 16;

// ---------- Simulation constants ----------
const tubHeight = 200;               // height of the tub and the largest water height
const tubTop = 100;                  // screen y of the tub rim and the top of the chart
const tubBottom = tubTop + tubHeight;
const initialWaterHeight = tubHeight * 0.75;   // 75% full
const initialSourceFlowRate = 0;
const initialDrainFlowRate = 0.2;
const maxFlowRate = 2;
const chartWindow = 900;             // frames that fit across the chart before the time axis compresses
const maxHistory = 1800;             // history is thinned when it grows past this many samples

// ---------- Simulation state ----------
let waterHeight = initialWaterHeight;
let sourceFlowRate = initialSourceFlowRate;
let drainFlowRate = initialDrainFlowRate;
let drainDependsOnHeight = false;    // false: constant drain, true: Torricelli drain
let waterHeightHistory = [];
let sampleInterval = 1;              // frames between the samples kept in the history
let elapsedFrames = 0;
let isRunning = false;               // MicroSim standard: start paused

// ---------- Controls ----------
let startButton, resetButton;
let sourceSlider, drainSlider;
let heightCheckbox;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Row 1: Start / Pause and Reset
  startButton = createButton('Start');
  startButton.parent(document.querySelector('main'));
  startButton.position(10, drawHeight + 8);
  startButton.size(64, 26);
  startButton.mousePressed(toggleSimulation);

  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.position(80, drawHeight + 8);
  resetButton.size(64, 26);
  resetButton.mousePressed(resetSimulation);

  // Row 2 and 3: flow rate sliders
  sourceSlider = createSlider(0, maxFlowRate, initialSourceFlowRate, 0.1);
  sourceSlider.parent(document.querySelector('main'));
  sourceSlider.position(sliderLeftMargin, drawHeight + 40);
  sourceSlider.size(canvasWidth - sliderLeftMargin - margin);

  drainSlider = createSlider(0, maxFlowRate, initialDrainFlowRate, 0.1);
  drainSlider.parent(document.querySelector('main'));
  drainSlider.position(sliderLeftMargin, drawHeight + 75);
  drainSlider.size(canvasWidth - sliderLeftMargin - margin);

  // Row 4: switch between the constant drain and the Torricelli drain
  heightCheckbox = createCheckbox(' Drain depends on water height', false);
  heightCheckbox.parent(document.querySelector('main'));
  heightCheckbox.position(10, drawHeight + 109);
  heightCheckbox.style('font-size', defaultTextSize + 'px');

  // make sure we start with the default values
  resetSimulation();

  describe('A bathtub stock and flow simulation. On the left, a bathtub holds blue water. ' +
    'A source pipe at the top left adds water and a drain pipe at the bottom right removes it. ' +
    'On the right, a line chart plots the water height over time. Start, Pause and Reset ' +
    'buttons control the simulation, and two sliders set the source flow rate and the drain ' +
    'flow rate. The water rises when the source is larger than the drain and falls when the ' +
    'drain is larger than the source. A checkbox makes the drain depend on the water height, ' +
    'so a fuller tub drains faster and the line on the chart becomes a curve.', LABEL);
}

function draw() {
  updateCanvasSize();

  // Drawing region and control region backgrounds (required MicroSim standard)
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // get updates from the sliders and the checkbox
  sourceFlowRate = sourceSlider.value();
  drainFlowRate = drainSlider.value();
  drainDependsOnHeight = heightCheckbox.checked();

  updateWaterHeight();

  // The left column holds the bathtub; the right column holds the chart
  const columnWidth = floor(canvasWidth * 0.45);
  drawChart(columnWidth + 45, canvasWidth - margin);

  // Title (drawn after the chart grid and axes)
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Bathtub Stock and Flow', canvasWidth / 2, 10);

  drawBathtub(columnWidth);
  drawControlLabels();
}

// ---------- Model ----------
// The amount of water that leaves through the drain on one frame.
// Constant drain: the drain flow rate, whatever the water height.
// Torricelli drain: deeper water pushes harder on the drain, so the flow is proportional to
// the square root of the water height. The slider then sets the drain flow of a full tub.
function getDrainFlow() {
  if (!drainDependsOnHeight) return drainFlowRate;
  return drainFlowRate * sqrt(waterHeight / tubHeight);
}

function updateWaterHeight() {
  if (!isRunning) return;
  waterHeight += sourceFlowRate - getDrainFlow();
  waterHeight = constrain(waterHeight, 0, tubHeight);
  elapsedFrames++;
  if (elapsedFrames % sampleInterval === 0) {
    waterHeightHistory.push(waterHeight);
  }
  // Thin a long history to every other sample so a long run stays fast
  if (waterHeightHistory.length > maxHistory) {
    waterHeightHistory = waterHeightHistory.filter((h, i) => i % 2 === 0);
    sampleInterval *= 2;
  }
}

// ---------- Drawing helpers ----------
function drawBathtub(columnWidth) {
  // Leave room for the source pipe on the left and the drain pipe on the right
  const leftSpace = 45;
  const rightSpace = 50;
  const room = columnWidth - leftSpace - rightSpace;
  const tubWidth = constrain(room, 90, 240);
  const tubX = leftSpace + max(0, floor((room - tubWidth) / 2));
  const tubRight = tubX + tubWidth;
  const surfaceY = tubBottom - waterHeight;
  const drainFlow = getDrainFlow();

  // Tub interior and water
  noStroke();
  fill('white');
  rect(tubX, tubTop, tubWidth, tubHeight);
  fill('deepskyblue');
  rect(tubX, surfaceY, tubWidth, waterHeight);

  // Source stream: out of the pipe and down to the water surface
  drawStream(tubX + 6, tubTop - 25, surfaceY, sourceFlowRate);

  // Drain stream: only what the tub can supply when it is empty
  const outFlow = waterHeight > 0 ? drainFlow : min(drainFlow, sourceFlowRate);
  drawStream(tubRight + 22, tubBottom - 11, tubBottom + 20, outFlow);

  // Tub walls (open at the top)
  stroke('black');
  strokeWeight(3);
  line(tubX, tubTop, tubX, tubBottom);
  line(tubX, tubBottom, tubRight, tubBottom);
  line(tubRight, tubTop, tubRight, tubBottom);

  // Source and drain pipes
  strokeWeight(1);
  fill('steelblue');
  rect(tubX - 30, tubTop - 32, 36, 14);
  rect(tubRight, tubBottom - 18, 22, 14);

  // Labels
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, BOTTOM);
  text('Source', tubX - 30, tubTop - 36);
  text('Drain', tubRight + 6, tubBottom - 22);

  // Readouts under the tub. The Torricelli drain flow changes a little on every frame,
  // so it gets its own line and one more decimal place.
  textAlign(CENTER, CENTER);
  const centerX = tubX + tubWidth / 2;
  const digits = drainDependsOnHeight ? 2 : 1;
  const rounding = pow(10, digits);
  let readoutY = tubBottom + 34;
  text('Water Height: ' + waterHeight.toFixed(0), centerX, readoutY);
  if (drainDependsOnHeight) {
    readoutY += 23;
    text('Drain Flow: ' + drainFlow.toFixed(digits), centerX, readoutY);
  }
  const netFlow = Math.round((sourceFlowRate - drainFlow) * rounding) / rounding;
  let netText = 'Net Flow: ' + (netFlow > 0 ? '+' : '') + netFlow.toFixed(digits);
  if (waterHeight <= 0 && netFlow <= 0) netText = 'The tub is empty';
  if (waterHeight >= tubHeight && netFlow >= 0) netText = 'The tub is full';
  text(netText, centerX, readoutY + 23);
}

// Water leaves the end of a pipe at (x, y), curves down and falls to bottomY.
// The stream gets wider as the flow rate goes up.
function drawStream(x, y, bottomY, flowRate) {
  if (flowRate <= 0) return;
  const r = 12;
  noFill();
  stroke('deepskyblue');
  strokeWeight(2 + 8 * flowRate / maxFlowRate);
  strokeCap(SQUARE);
  arc(x, y + r, 2 * r, 2 * r, -HALF_PI, 0);
  if (bottomY > y + r) {
    line(x + r, y + r, x + r, bottomY);
  }
  strokeCap(ROUND);
}

function drawChart(plotLeft, plotRight) {
  const plotWidth = plotRight - plotLeft;

  // Plot area
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(plotLeft, tubTop, plotWidth, tubHeight);

  // Horizontal grid lines and water height labels
  textSize(defaultTextSize);
  textAlign(RIGHT, CENTER);
  for (let h = 0; h <= tubHeight; h += 50) {
    const y = tubBottom - h;
    stroke('gainsboro');
    line(plotLeft, y, plotRight, y);
    noStroke();
    fill('black');
    text(h, plotLeft - 6, y);
  }

  // Axis lines
  stroke('black');
  strokeWeight(2);
  line(plotLeft, tubBottom, plotRight, tubBottom);   // horizontal time axis
  line(plotLeft, tubBottom, plotLeft, tubTop);       // vertical water height axis

  // Chart title and axis label
  noStroke();
  fill('black');
  textAlign(CENTER, BOTTOM);
  text('Water Height vs. Time', plotLeft + plotWidth / 2, tubTop - 12);
  textAlign(CENTER, TOP);
  text('Time', plotLeft + plotWidth / 2, tubBottom + 8);

  // Plot the water height vs time. A short run is drawn left to right.
  // A long run is compressed so the whole history always fits.
  const framesShown = max(chartWindow, elapsedFrames);
  let x = plotLeft;
  let y = tubBottom - waterHeight;
  noFill();
  stroke('green');
  strokeWeight(2);
  beginShape();
  for (let i = 0; i < waterHeightHistory.length; i++) {
    x = map(i * sampleInterval, 0, framesShown, plotLeft, plotRight);
    y = tubBottom - waterHeightHistory[i];
    vertex(x, y);
  }
  endShape();

  // Mark the newest point
  noStroke();
  fill('green');
  circle(x, y, 8);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Source Flow Rate: ' + sourceFlowRate.toFixed(1), 10, drawHeight + 50);
  // With the Torricelli drain the slider sets the largest drain flow: the flow of a full tub
  const drainLabel = drainDependsOnHeight ? 'Max Drain Flow Rate: ' : 'Drain Flow Rate: ';
  text(drainLabel + drainFlowRate.toFixed(1), 10, drawHeight + 85);
}

// ---------- Button handlers ----------
function toggleSimulation() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}

function resetSimulation() {
  sourceSlider.value(initialSourceFlowRate);
  drainSlider.value(initialDrainFlowRate);
  heightCheckbox.checked(false);
  drainDependsOnHeight = false;
  waterHeight = initialWaterHeight;
  waterHeightHistory = [waterHeight];
  sampleInterval = 1;
  elapsedFrames = 0;
  isRunning = false;
  startButton.html('Start');
}

// ---------- Responsive design ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  sourceSlider.size(canvasWidth - sliderLeftMargin - margin);
  drainSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.max(300, Math.floor(container.getBoundingClientRect().width));
  }
}
