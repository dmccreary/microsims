// Least Squares MicroSim - fit a line to four data points by shrinking the squares of the errors
// CANVAS_HEIGHT: 555
// Use CANVAS_HEIGHT + 2 for every iframe that embeds this MicroSim.
// Learning objective (Apply / adjust): the learner adjusts the slope and the intercept of a
// line to make the squares of the errors as small as possible.
//
// Model:
//   predicted y = slope * x + intercept
//   error       = actual y - predicted y
// Each data point gets a square whose side is the size of its error, so the area of the
// square is the error squared. The least squares line is the line that makes the total
// area of the four squares as small as possible.
// The plot runs from 0 to 500 on both axes with (0, 0) in the lower left corner.

// ---------- Canvas dimensions (standard MicroSim layout) ----------
let canvasWidth = 500;               // updated from the container width
let drawHeight = 500;                // drawing region (aliceblue)
let controlHeight = 55;              // control region (white): 2 rows of sliders
let canvasHeight = drawHeight + controlHeight;  // 555
let margin = 25;
let sliderLeftMargin = 120;          // room for "Intercept: -100" to the left of the slider
let defaultTextSize = 16;

// ---------- Plot constants ----------
const plotMax = 500;                 // largest x and y value shown on the plot
const gridCount = 10;                // grid lines are 50 plot units apart
const pointDiameter = 10;

// The four data points as [x, y] in plot units
const dataPoints = [[100, 220], [200, 180], [300, 300], [400, 290]];

// Square colors for each data point: [point is above the line, point is below the line]
const squareColors = [
  ['red', 'orange'],
  ['yellow', 'pink'],
  ['cyan', 'blue'],
  ['lightgreen', 'olive']
];

// ---------- Controls ----------
let slopeSlider, interceptSlider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Row 1: slope of the line
  slopeSlider = createSlider(-2, 3, 0.5, 0.01);
  slopeSlider.parent(document.querySelector('main'));
  slopeSlider.position(sliderLeftMargin, drawHeight + 10);
  slopeSlider.size(canvasWidth - sliderLeftMargin - 20);

  // Row 2: y-intercept of the line
  interceptSlider = createSlider(-100, 170, 0, 1);
  interceptSlider.parent(document.querySelector('main'));
  interceptSlider.position(sliderLeftMargin, drawHeight + 30);
  interceptSlider.size(canvasWidth - sliderLeftMargin - 20);

  describe('A least squares simulation. Four green data points sit on a grid with a blue line. ' +
    'A purple point on the line marks the predicted value for each data point. ' +
    'A colored square between each data point and its purple point shows the squared error. ' +
    'A slope slider and an intercept slider move the line, and the squares grow or shrink as the line moves.', LABEL);
}

function draw() {
  updateCanvasSize();

  // drawing region
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);

  let slope = slopeSlider.value();
  let intercept = interceptSlider.value();

  // the squares are drawn first so they never hide the line or the points
  drawGridLines();
  drawSquares(slope, intercept);
  drawLine(slope, intercept);
  drawPoints();
  drawPredictedPoints(slope, intercept);

  // control region - drawn after the plot so a line or a square that
  // runs below the plot does not show behind the sliders
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawLabelValues(slope, intercept);
}

// Convert an x value in plot units to a screen x
function toScreenX(x) {
  return x * canvasWidth / plotMax;
}

// Convert a y value in plot units to a screen y - positive y is up
function toScreenY(y) {
  return drawHeight - y * drawHeight / plotMax;
}

// The actual data points
function drawPoints() {
  fill('green');
  noStroke();
  for (let dataPoint of dataPoints) {
    circle(toScreenX(dataPoint[0]), toScreenY(dataPoint[1]), pointDiameter);
  }
}

// The predicted points - where the line says each data point should be
function drawPredictedPoints(slope, intercept) {
  fill('purple');
  noStroke();
  for (let dataPoint of dataPoints) {
    circle(toScreenX(dataPoint[0]), toScreenY(slope * dataPoint[0] + intercept), pointDiameter);
  }
}

// One square for each data point
function drawSquares(slope, intercept) {
  noStroke();
  for (let i = 0; i < dataPoints.length; i++) {
    drawSquareForPoint(dataPoints[i], slope, intercept, squareColors[i][0], squareColors[i][1]);
  }
}

// The side of the square is the distance from the data point to the line
function drawSquareForPoint(dataPoint, slope, intercept, colorAbove, colorBelow) {
  let x = toScreenX(dataPoint[0]);
  let actualY = toScreenY(dataPoint[1]);
  let predictedY = toScreenY(slope * dataPoint[0] + intercept);
  let side = abs(actualY - predictedY);

  if (predictedY > actualY) {
    // the data point is above the line
    fill(colorAbove);
    rect(x, actualY, side, side);
  } else {
    // the data point is below the line
    fill(colorBelow);
    rect(x, predictedY, side, side);
  }
}

function drawGridLines() {
  stroke('silver');
  const hSpacing = canvasWidth / gridCount;
  const vSpacing = drawHeight / gridCount;

  // horizontal lines - every other line is heavier
  for (let i = 0; i <= gridCount; i++) {
    strokeWeight(i % 2 ? 1 : 2);
    line(0, i * vSpacing, canvasWidth, i * vSpacing);
  }

  // vertical lines
  for (let i = 0; i <= gridCount; i++) {
    strokeWeight(i % 2 ? 1 : 2);
    line(i * hSpacing, 0, i * hSpacing, drawHeight);
  }
}

function drawLabelValues(slope, intercept) {
  fill('black');
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Slope: ' + slope.toFixed(2), 10, drawHeight + 20);
  text('Intercept: ' + intercept, 10, drawHeight + 40);
}

// The line y = slope * x + intercept from the left edge to the right edge of the plot
function drawLine(slope, intercept) {
  stroke('blue');
  strokeWeight(2);
  line(toScreenX(0), toScreenY(intercept), toScreenX(plotMax), toScreenY(slope * plotMax + intercept));
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  slopeSlider.size(canvasWidth - sliderLeftMargin - 20);
  interceptSlider.size(canvasWidth - sliderLeftMargin - 20);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.max(300, Math.floor(container.getBoundingClientRect().width));
  }
}
