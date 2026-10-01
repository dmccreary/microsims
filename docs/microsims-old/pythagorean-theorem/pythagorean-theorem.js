// Pythagorean Theorem MicroSim - a right triangle with a square on each of its three sides
// CANVAS_HEIGHT: 460
// Learning objective (Understand / explain): the learner explains why the areas of the squares
// on the two legs of a right triangle add up to the area of the square on the hypotenuse.
//
// Model:
//   c = sqrt(a*a + b*b)      a and b are the legs, c is the hypotenuse
//   a*a + b*b = c*c          the two smaller squares have the same total area as the large one
// The sliders set a and b. The Show Squares button reveals a square on each side
// (progressive disclosure). The readout panel lists each length and each area.
// The right-angle corner stays in one place, so a slider only moves the side it controls.
// The drawing region is only as tall as the largest figure: on a wide canvas the title and
// the readout panel sit beside the figure, so the figure uses the full height.

// ---------- Canvas dimensions (standard MicroSim layout) ----------
let canvasWidth = 400;               // updated from the container width
let drawHeight = 360;                // drawing region (aliceblue)
let controlHeight = 100;             // control region (white): 3 rows of controls
let canvasHeight = drawHeight + controlHeight;  // 460
let margin = 25;
let sliderLeftMargin = 105;          // room for "Side a: 130" to the left of the slider
let defaultTextSize = 16;

// ---------- Layout constants ----------
const titleHeight = 34;              // height of the title line, with the space below it
const edgeSpace = 10;                // space kept clear at the edges of the drawing region
const panelGap = 20;                 // space between the figure and the readout panel
const panelWidth = 250;              // width of the readout panel
const wideLayoutWidth = 500;         // at this canvas width the panel moves beside the figure

// ---------- Model constants ----------
const minSide = 50;                  // shortest length of side a or side b
const maxSide = 130;                 // longest length of side a or side b
const defaultA = 100;
const defaultB = 100;
const aColor = 'lightgreen';         // square on side a
const bColor = 'lightblue';          // square on side b
const cColor = 'pink';               // square on side c

// ---------- Model state ----------
let aLength = defaultA;              // side a (base)
let bLength = defaultB;              // side b (height)
let cLength;                         // side c (hypotenuse)
let showSquares = false;             // start with the squares hidden

// ---------- Controls ----------
let aSlider, bSlider;
let toggleButton, resetButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Row 1: Show / Hide Squares and Reset
  toggleButton = createButton('Show Squares');
  toggleButton.parent(document.querySelector('main'));
  toggleButton.position(10, drawHeight + 7);
  toggleButton.size(120, 26);
  toggleButton.mousePressed(toggleSquares);

  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.position(136, drawHeight + 7);
  resetButton.size(64, 26);
  resetButton.mousePressed(resetValues);

  // Row 2 and 3: side length sliders
  aSlider = createSlider(minSide, maxSide, defaultA, 1);   // min, max, default, step
  aSlider.parent(document.querySelector('main'));
  aSlider.position(sliderLeftMargin, drawHeight + 42);
  aSlider.size(canvasWidth - sliderLeftMargin - margin);

  bSlider = createSlider(minSide, maxSide, defaultB, 1);
  bSlider.parent(document.querySelector('main'));
  bSlider.position(sliderLeftMargin, drawHeight + 72);
  bSlider.size(canvasWidth - sliderLeftMargin - margin);

  describe('A right triangle with a horizontal side a, a vertical side b and a hypotenuse c. ' +
    'Two sliders set the lengths of side a and side b from 50 to 130. A Show Squares button ' +
    'draws a green square on side a, a blue square on side b and a pink square on side c. ' +
    'A readout panel lists the length of each side and the area of each square, and shows ' +
    'that the area of square a plus the area of square b always equals the area of square c. ' +
    'A Reset button returns both sides to 100.', LABEL);
}

function draw() {
  // Drawing region and control region backgrounds (required MicroSim standard)
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // get the updated slider values
  aLength = aSlider.value();
  bLength = bSlider.value();
  cLength = sqrt(aLength * aLength + bLength * bLength);

  // Wide canvas: the figure on the left uses the full height of the drawing region, and
  // the title and the readout panel sit in a column on the right.
  // Narrow canvas: the title, then the readout panel, then the figure below them.
  // The figure is always drawn in a square box.
  const isWide = canvasWidth >= wideLayoutWidth;
  const panelHeight = isWide ? 150 : 110;
  let figureX, figureY, figureSize, panelX, panelY, titleX, titleY;
  if (isWide) {
    const roomWidth = canvasWidth - 2 * edgeSpace - panelGap - panelWidth;
    const roomHeight = drawHeight - 2 * edgeSpace;
    figureSize = min(roomWidth, roomHeight);
    figureX = (canvasWidth - figureSize - panelGap - panelWidth) / 2;
    figureY = (drawHeight - figureSize) / 2;
    panelX = figureX + figureSize + panelGap;
    titleX = panelX + panelWidth / 2;
    titleY = (drawHeight - titleHeight - panelHeight) / 2;
    panelY = titleY + titleHeight;
  } else {
    titleX = canvasWidth / 2;
    titleY = 6;
    panelX = (canvasWidth - panelWidth) / 2;
    panelY = titleY + titleHeight - 2;
    const figureTop = panelY + panelHeight + 5;
    const roomWidth = canvasWidth - 2 * edgeSpace;
    const roomHeight = drawHeight - figureTop - edgeSpace;
    figureSize = min(roomWidth, roomHeight);
    figureX = (canvasWidth - figureSize) / 2;
    figureY = figureTop + (roomHeight - figureSize) / 2;
  }

  // Title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Pythagorean Theorem', titleX, titleY);

  drawFigure(figureX, figureY, figureSize);
  drawReadoutPanel(panelX, panelY, panelHeight, !isWide);
  drawControlLabels();
}

// ---------- Drawing helpers ----------
// Draw the triangle, and the three squares when they are shown, inside a square box.
// With the squares, the figure is (a + 2b) wide and (2a + b) tall, so the largest figure
// is 3 * maxSide in each direction. The box is scaled to hold that largest figure.
function drawFigure(boxX, boxY, boxSize) {
  const pixelsPerUnit = boxSize / (3 * maxSide);
  const a = aLength * pixelsPerUnit;
  const b = bLength * pixelsPerUnit;
  const c = cLength * pixelsPerUnit;

  // Right angle at (x0, y0). It does not move when the sliders change.
  const x0 = boxX + maxSide * pixelsPerUnit;
  const y0 = boxY + boxSize - maxSide * pixelsPerUnit;
  // Side a runs right to (x1, y1) and side b runs up to (x2, y2)
  const x1 = x0 + a;
  const y1 = y0;
  const x2 = x0;
  const y2 = y0 - b;

  stroke('black');
  strokeWeight(1);
  if (showSquares) {
    // Square on side a, below the triangle
    fill(aColor);
    quad(x0, y0, x1, y1, x1, y1 + a, x0, y0 + a);

    // Square on side b, to the left of the triangle
    fill(bColor);
    quad(x0, y0, x2, y2, x2 - b, y2, x0 - b, y0);

    // Square on side c. The hypotenuse runs from (x1, y1) to (x2, y2). A quarter turn of
    // that side gives (b, -a), which points away from the triangle and is as long as c.
    fill(cColor);
    quad(x1, y1, x2, y2, x2 + b, y2 - a, x1 + b, y1 - a);
  }

  // The right triangle
  strokeWeight(2);
  fill('lightgray');
  triangle(x0, y0, x1, y1, x2, y2);

  // The right-angle symbol, a little smaller on a small triangle
  const symbolSize = min(12, 0.3 * min(a, b));
  noFill();
  strokeWeight(1);
  rect(x0, y0 - symbolSize, symbolSize, symbolSize);

  // Labels. A side label sits just outside the triangle, which is inside that side's square.
  // On a small figure the smallest square has no room for two labels, so the squares then
  // carry only their own labels. The test uses minSide, not the slider values, so the
  // labels do not appear and disappear as a slider moves.
  const labelOffset = 11;
  const roomForSideLabels = !showSquares || minSide * pixelsPerUnit >= 40;
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(CENTER, CENTER);
  if (roomForSideLabels) {
    text('a', x0 + a / 2, y0 + labelOffset);
    text('b', x0 - labelOffset, y0 - b / 2);
    text('c', (x1 + x2) / 2 + labelOffset * b / c, (y1 + y2) / 2 - labelOffset * a / c);
  }
  if (showSquares) {
    // Next to a side label, the square's label moves a little past the center of the square
    const shift = roomForSideLabels ? 6 : 0;
    const aLabel = a / 2 + shift;
    const bLabel = b / 2 + shift;
    const cLabel = c / 2 + shift;
    text('a²', x0 + a / 2, y0 + aLabel);
    text('b²', x0 - bLabel, y0 - b / 2);
    text('c²', (x1 + x2) / 2 + cLabel * b / c, (y1 + y2) / 2 - cLabel * a / c);
  }
}

// The readout panel: the equation, one row for each side and the sum of the two smaller areas.
// The compact panel puts the rows closer together for a narrow canvas.
function drawReadoutPanel(x, y, panelHeight, compact) {
  const equationY = y + (compact ? 15 : 22);
  const firstRowY = y + (compact ? 36 : 50);
  const rowSpacing = compact ? 20 : 26;
  const lineY = firstRowY + 2 * rowSpacing + (compact ? 12 : 16);
  const sumY = lineY + (compact ? 11 : 16);

  const aSquared = aLength * aLength;
  const bSquared = bLength * bLength;
  const cSquared = aSquared + bSquared;
  // c is a whole number for a Pythagorean triple such as 60, 80, 100
  const cText = Number.isInteger(cLength) ? formatNumber(cLength) : formatNumber(cLength, 2);

  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, panelWidth, panelHeight, 8);

  // Equation
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(compact ? 18 : 20);
  text('a² + b² = c²', x + panelWidth / 2, equationY);
  textStyle(NORMAL);
  textSize(defaultTextSize);

  // One row per side: color swatch, length and area of the square
  const rows = [
    ['a', formatNumber(aLength), aSquared, aColor],
    ['b', formatNumber(bLength), bSquared, bColor],
    ['c', cText, cSquared, cColor]
  ];
  for (let i = 0; i < rows.length; i++) {
    const rowY = firstRowY + i * rowSpacing;
    // the swatches match the squares, so they only appear with the squares
    if (showSquares) {
      stroke('black');
      fill(rows[i][3]);
      rect(x + 12, rowY - 7, 14, 14);
    }
    noStroke();
    fill('black');
    textAlign(LEFT, CENTER);
    text(rows[i][0] + ' = ' + rows[i][1], x + 36, rowY);
    text(rows[i][0] + '² = ' + formatNumber(rows[i][2]), x + 130, rowY);
  }

  // The two smaller areas add up to the largest area
  stroke('silver');
  line(x + 12, lineY, x + panelWidth - 12, lineY);
  noStroke();
  textAlign(CENTER, CENTER);
  text(formatNumber(aSquared) + ' + ' + formatNumber(bSquared) + ' = ' + formatNumber(cSquared),
    x + panelWidth / 2, sumY);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Side a: ' + aLength, 10, drawHeight + 52);
  text('Side b: ' + bLength, 10, drawHeight + 82);
}

// Format a number with commas between the thousands: 16900 becomes "16,900"
function formatNumber(value, decimals = 0) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

// ---------- Button handlers ----------
function toggleSquares() {
  showSquares = !showSquares;
  toggleButton.html(showSquares ? 'Hide Squares' : 'Show Squares');
}

function resetValues() {
  aSlider.value(defaultA);
  bSlider.value(defaultB);
}

// ---------- Responsive design ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  aSlider.size(canvasWidth - sliderLeftMargin - margin);
  bSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.max(300, Math.floor(container.getBoundingClientRect().width));
  }
}
