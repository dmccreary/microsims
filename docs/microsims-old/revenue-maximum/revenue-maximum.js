// Revenue Maximum MicroSim - find the price that gives the most total revenue
// CANVAS_HEIGHT: 475
// Use CANVAS_HEIGHT + 2 for every iframe that embeds this MicroSim.
// Learning objective (Analyze / identify and explain): the learner identifies the price that
// gives the largest total revenue on a straight-line demand curve and explains why revenue
// falls at prices above and below that price.
//
// Model:
//   quantity = 200 - price          (a straight-line demand curve)
//   revenue  = price * quantity     (the area of the rectangle under the demand point)
// Revenue is a parabola in price. It is $0 at a price of $0 (nothing is charged) and at a
// price of $200 (nothing is sold), and it peaks at $10,000 when the price is $100.
//
// Left panel: the demand curve. The shaded rectangle has a height equal to the price and a
// width equal to the quantity, so its area is the revenue.
// Right panel: revenue plotted against price. The curve is NOT drawn at the start. The learner
// traces it by changing the price (slider, dragging on either chart, arrow keys or the
// Sweep Price button), so the peak is something they find, not something they are shown.
// The Show Maximum checkbox reveals the whole curve, the peak and the largest rectangle.

// ---------- Canvas dimensions (standard MicroSim layout) ----------
let canvasWidth = 800;               // replaced by the container width
let drawHeight = 405;                // drawing region (aliceblue), sized to its content
let controlHeight = 70;              // control region (white): 2 rows of controls
let canvasHeight = drawHeight + controlHeight;   // 475
let margin = 25;
let sliderLeftMargin = 105;          // room for "Price: $200" to the left of the slider
let defaultTextSize = 16;

// ---------- Model constants ----------
const maxPrice = 200;                // the price at which nobody buys
const maxQuantity = 200;             // the quantity sold when the price is $0
const revenueAxisMax = 12000;        // top of the revenue axis (the peak is $10,000)
const peakPrice = maxPrice / 2;      // $100
const peakRevenue = peakPrice * (maxQuantity - peakPrice);   // $10,000
const initialPrice = 50;             // start away from the peak so there is something to find
const sweepSeconds = 6;              // time the Sweep Price animation takes to go from $0 to $200

// ---------- Colors ----------
const demandColor = 'crimson';       // the demand curve
const revenueColor = 'royalblue';    // revenue: the rectangle, the revenue curve and their points
const maximumColor = 'darkorange';   // the maximum and the best revenue found so far

// ---------- State ----------
let price = initialPrice;
let visited = [];                    // visited[p] is true once the price has been set to p
let visitedCount = 0;
let bestFoundPrice = initialPrice;   // the price with the highest revenue among the visited prices
let bestFoundRevenue = -1;
let showMaximum = false;
let hasInteracted = false;           // hints and the pulsing halo show until the first interaction
let dragTarget = null;               // 'demand' or 'revenue' while the mouse drags on a chart

// The sweep animation only advances while the MicroSim has the reader's attention
let isSweeping = false;
let sweepCanResume = false;          // true while a sweep is paused part way
let sweepPosition = 0;               // the price reached by the sweep (not rounded)
let mouseOverSim = false;
let pulsePhase = 0;                  // drives the halo around the draggable point

// ---------- Controls ----------
let sweepButton, resetButton, maxCheckbox, priceSlider;

// ---------- Layout (recomputed every frame from the canvas width) ----------
const plotTop = 58;
const plotBottom = 308;
let isWide = true;                   // false on a narrow canvas: smaller text and shorter labels
let tickSize = 16;
let axisTitleStrip = 22;             // width of the strip that holds a rotated axis title
let demandPlot = { left: 70, right: 370 };
let revenuePlot = { left: 470, right: 770 };

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);

  // pause the sweep animation while the mouse is away from the MicroSim
  mainElement.addEventListener('mouseenter', () => mouseOverSim = true);
  mainElement.addEventListener('mouseleave', () => mouseOverSim = false);
  mainElement.addEventListener('pointerdown', () => mouseOverSim = true);

  // Row 1: Sweep Price / Pause / Resume, Reset and the Show Maximum checkbox
  sweepButton = createButton('Sweep Price');
  sweepButton.parent(mainElement);
  sweepButton.position(10, drawHeight + 6);
  sweepButton.size(100, 26);
  sweepButton.mouseClicked(toggleSweep);

  resetButton = createButton('Reset');
  resetButton.parent(mainElement);
  resetButton.position(116, drawHeight + 6);
  resetButton.size(56, 26);
  resetButton.mouseClicked(resetSim);

  maxCheckbox = createCheckbox(' Show Maximum', false);
  maxCheckbox.parent(mainElement);
  maxCheckbox.position(182, drawHeight + 8);
  maxCheckbox.style('font-size', defaultTextSize + 'px');
  maxCheckbox.style('white-space', 'nowrap');   // keep the label on one line on a narrow canvas
  maxCheckbox.changed(() => hasInteracted = true);

  // Row 2: price slider
  priceSlider = createSlider(0, maxPrice, initialPrice, 1);
  priceSlider.parent(mainElement);
  priceSlider.position(sliderLeftMargin, drawHeight + 41);
  priceSlider.size(canvasWidth - sliderLeftMargin - margin);
  priceSlider.attribute('aria-label', 'Price in dollars');
  priceSlider.input(() => {
    hasInteracted = true;
    cancelSweep();
    setPrice(priceSlider.value(), true);
  });

  resetSim();

  describe('Two linked charts about pricing. The left chart is a straight demand curve with ' +
    'price on the vertical axis and quantity sold on the horizontal axis. A shaded rectangle ' +
    'under the current point has a height equal to the price and a width equal to the quantity, ' +
    'so its area is the revenue. The right chart plots revenue against price. The revenue curve ' +
    'is traced as the price changes and forms a hill that peaks at 10,000 dollars when the ' +
    'price is 100 dollars. A slider sets the price from 0 to 200 dollars. The price can also be ' +
    'changed by dragging on either chart or with the left and right arrow keys. The Sweep Price ' +
    'button, or the S key, moves the price from 0 to 200 dollars. The Show Maximum checkbox, or ' +
    'the M key, marks the price with the most revenue. The Reset button, or the R key, starts over.',
    LABEL);
}

function draw() {
  updateCanvasSize();
  if (width !== canvasWidth) {
    resizeCanvas(canvasWidth, canvasHeight);
    positionControls();
  }

  // Drawing region and control region backgrounds (required MicroSim standard)
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  showMaximum = maxCheckbox.checked();
  advanceAnimation();
  computeLayout();

  drawDemandPanel();
  drawRevenuePanel();
  drawTitle();
  drawReadout();
  drawControlLabels();

  // show that the charts can be dragged
  if (dragTarget) cursor('grabbing');
  else if (mouseOverSim && plotUnderMouse()) cursor('grab');
  else cursor(ARROW);
}

// ---------- Model ----------
function quantityAt(p) {
  return maxQuantity - p;
}

function revenueAt(p) {
  return p * quantityAt(p);
}

// Change the price. When tracePath is true every price between the old and the new price
// counts as visited, so a fast drag still traces an unbroken revenue curve.
function setPrice(newPrice, tracePath) {
  newPrice = constrain(round(newPrice), 0, maxPrice);
  if (tracePath) {
    for (let p = min(price, newPrice); p <= max(price, newPrice); p++) markVisited(p);
  } else {
    markVisited(newPrice);
  }
  price = newPrice;
  priceSlider.value(price);
}

function markVisited(p) {
  if (!visited[p]) visitedCount++;
  visited[p] = true;
  if (revenueAt(p) > bestFoundRevenue) {
    bestFoundRevenue = revenueAt(p);
    bestFoundPrice = p;
  }
}

function clearTrace() {
  visited = new Array(maxPrice + 1).fill(false);
  visitedCount = 0;
  bestFoundRevenue = -1;
  bestFoundPrice = 0;
}

// The learner has evidence of the peak once the trace covers the prices on both sides of it
function hasFoundMaximum() {
  return visited[peakPrice - 1] && visited[peakPrice] && visited[peakPrice + 1];
}

// ---------- Animation ----------
// The sweep and the halo only advance while the mouse is over the MicroSim or a control
// has keyboard focus, so the page stays calm while the reader is reading the text around it.
function advanceAnimation() {
  const keyboardFocusInside = document.querySelector('main :focus-visible') !== null;
  const simActive = mouseOverSim || keyboardFocusInside;
  if (!simActive) return;

  if (!hasInteracted) pulsePhase += 0.08;

  if (isSweeping) {
    sweepPosition += maxPrice * min(deltaTime, 50) / (sweepSeconds * 1000);
    if (sweepPosition >= maxPrice) {
      sweepPosition = maxPrice;
      isSweeping = false;
      sweepCanResume = false;
      updateSweepLabel();
    }
    setPrice(floor(sweepPosition), true);
  }
}

// ---------- Layout ----------
function computeLayout() {
  isWide = canvasWidth >= 600;
  tickSize = isWide ? 16 : 12;
  axisTitleStrip = isWide ? 22 : 18;
  textSize(tickSize);

  // Each chart needs room on its left for the tick labels and for the widest value pill
  textStyle(NORMAL);
  const priceTickWidth = fontWidth(money(maxPrice));
  const revenueTickWidth = fontWidth(revenueLabel(revenueAxisMax));
  textStyle(BOLD);
  const pricePillWidth = fontWidth(money(maxPrice)) + 10;
  const revenuePillWidth = fontWidth(revenueLabel(peakRevenue - 100)) + 10;   // "$9,900" or "$9.9k"
  textStyle(NORMAL);
  const priceRoom = max(priceTickWidth + 6, pricePillWidth + 4) + 2;
  const revenueRoom = max(revenueTickWidth + 6, revenuePillWidth + 4) + 2;

  const demandGutter = (isWide ? 6 : 3) + axisTitleStrip + priceRoom;
  const revenueGutter = (isWide ? 12 : 6) + axisTitleStrip + revenueRoom;
  const rightMargin = priceTickWidth / 2 + (isWide ? 8 : 4);
  const plotWidth = (canvasWidth - demandGutter - revenueGutter - rightMargin) / 2;

  demandPlot = { left: demandGutter, right: demandGutter + plotWidth, labelRoom: priceRoom };
  revenuePlot = { left: demandPlot.right + revenueGutter, labelRoom: revenueRoom };
  revenuePlot.right = revenuePlot.left + plotWidth;
}

function money(value) {
  return '$' + value.toLocaleString('en-US');
}

// A revenue amount for the revenue axis: "$7,500" on a wide canvas, "$7.5k" on a narrow one.
// The readout under the charts always shows the exact amount.
function revenueLabel(value) {
  if (isWide || value < 1000) return money(value);
  return '$' + parseFloat((value / 1000).toFixed(1)) + 'k';
}

// ---------- Drawing: shared chart parts ----------
// White plot area, grid lines, tick labels, axis titles and the panel title.
// formatX and formatY turn a tick value into its label. mark holds the position of the
// current value on each axis (x, y) and the text of its x-axis pill (xLabel); a tick label
// that the pill would partly cover is left out.
function drawPlotFrame(plot, xMax, xStep, yMax, yStep, formatX, formatY, xTitle, yTitle, title, mark) {
  const midX = (plot.left + plot.right) / 2;
  const midY = (plotTop + plotBottom) / 2;

  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(plot.left, plotTop, plot.right - plot.left, plotBottom - plotTop);

  // grid lines and tick labels
  textStyle(NORMAL);
  textSize(tickSize);
  for (let v = 0; v <= xMax; v += xStep) {
    const x = map(v, 0, xMax, plot.left, plot.right);
    stroke('gainsboro');
    line(x, plotTop, x, plotBottom);
    const reach = (fontWidth(String(formatX(v))) + fontWidth(mark.xLabel) + 16) / 2;
    if (abs(x - mark.x) < reach) continue;
    noStroke();
    fill('black');
    textAlign(CENTER, TOP);
    text(formatX(v), x, plotBottom + 7);
  }
  for (let v = 0; v <= yMax; v += yStep) {
    const y = map(v, 0, yMax, plotBottom, plotTop);
    stroke('gainsboro');
    line(plot.left, y, plot.right, y);
    if (abs(y - mark.y) < tickSize + 4) continue;
    noStroke();
    fill('black');
    textAlign(RIGHT, CENTER);
    text(formatY(v), plot.left - 6, y);
  }

  // axis lines
  stroke('black');
  strokeWeight(2);
  line(plot.left, plotTop, plot.left, plotBottom);
  line(plot.left, plotBottom, plot.right, plotBottom);

  // axis titles: the vertical one is rotated to save width
  noStroke();
  fill('black');
  textSize(isWide ? 16 : 13);
  textAlign(CENTER, TOP);
  text(xTitle, midX, plotBottom + tickSize + 11);
  push();
  translate(plot.left - plot.labelRoom - axisTitleStrip / 2, midY);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text(yTitle, 0, 0);
  pop();

  // panel title
  textStyle(BOLD);
  textSize(isWide ? 18 : 15);
  textAlign(CENTER, BOTTOM);
  text(title, midX, plotTop - 6);
  textStyle(NORMAL);
}

// A filled label that sits on an axis at the current value, like the crosshair labels on a
// stock chart. alignment 'right' ends the pill at x (a pill on a vertical axis);
// 'center' centers it on x (a pill under a horizontal axis).
function drawAxisPill(label, x, y, alignment, pillColor) {
  textStyle(BOLD);
  textSize(tickSize);
  const pillWidth = fontWidth(label) + 10;
  const pillHeight = tickSize + 8;
  let pillLeft = alignment === 'right' ? x - pillWidth : x - pillWidth / 2;
  pillLeft = constrain(pillLeft, 1, canvasWidth - pillWidth - 1);
  // a pill on the vertical axis stays above the labels of the horizontal axis
  if (alignment === 'right') y = min(y, plotBottom + 2 - pillHeight / 2);
  noStroke();
  fill(pillColor);
  rect(pillLeft, y - pillHeight / 2, pillWidth, pillHeight, 5);
  fill('white');
  textAlign(CENTER, CENTER);
  text(label, pillLeft + pillWidth / 2, y);
  textStyle(NORMAL);
}

function setDashed(isDashed) {
  drawingContext.setLineDash(isDashed ? [6, 5] : []);
}

// The draggable point. It pulses until the learner first interacts with the MicroSim.
function drawHandle(x, y, isHot) {
  if (!hasInteracted) {
    const halo = color(revenueColor);
    halo.setAlpha(110);
    noFill();
    stroke(halo);
    strokeWeight(3);
    circle(x, y, 28 + 8 * sin(pulsePhase));
  }
  if (isHot) {
    const glow = color(revenueColor);
    glow.setAlpha(60);
    noStroke();
    fill(glow);
    circle(x, y, 34);
  }
  stroke('white');
  strokeWeight(2);
  fill(revenueColor);
  circle(x, y, 16);
}

// ---------- Drawing: left panel ----------
function drawDemandPanel() {
  const plot = demandPlot;
  const quantity = quantityAt(price);
  const revenue = revenueAt(price);
  const x = map(quantity, 0, maxQuantity, plot.left, plot.right);
  const y = map(price, 0, maxPrice, plotBottom, plotTop);

  drawPlotFrame(plot, maxQuantity, 50, maxPrice, 50, (v) => v, money,
    isWide ? 'Quantity Sold' : 'Quantity', 'Price', 'Demand Curve',
    { x: x, y: y, xLabel: String(quantity) });

  // revenue rectangle: height = price, width = quantity, area = revenue
  const rectFill = color(revenueColor);
  rectFill.setAlpha(70);
  noStroke();
  fill(rectFill);
  rect(plot.left, y, x - plot.left, plotBottom - y);
  stroke(revenueColor);
  strokeWeight(2);
  line(plot.left, y, x, y);
  line(x, y, x, plotBottom);

  // the largest rectangle that fits under the demand curve
  if (showMaximum) {
    const peakX = map(quantityAt(peakPrice), 0, maxQuantity, plot.left, plot.right);
    const peakY = map(peakPrice, 0, maxPrice, plotBottom, plotTop);
    noFill();
    stroke(maximumColor);
    strokeWeight(2);
    setDashed(true);
    line(plot.left, peakY, peakX, peakY);
    line(peakX, peakY, peakX, plotBottom);
    setDashed(false);
    strokeWeight(3);
    circle(peakX, peakY, 20);
  }

  // demand curve
  stroke(demandColor);
  strokeWeight(3);
  line(plot.left, plotTop, plot.right, plotBottom);

  // equation of the demand curve in the corner that is always empty
  noStroke();
  fill(demandColor);
  textSize(tickSize);
  textAlign(RIGHT, TOP);
  text(isWide ? 'Quantity = 200 − Price' : 'Q = 200 − P', plot.right - 8, plotTop + 8);

  // area label inside the rectangle, when the rectangle is large enough to hold it
  const rectWidth = x - plot.left;
  const rectHeight = plotBottom - y;
  const centerX = plot.left + rectWidth / 2;
  const centerY = y + rectHeight / 2;
  fill('midnightblue');
  textAlign(CENTER, CENTER);
  textSize(tickSize);
  textStyle(BOLD);
  const amountWidth = textWidth(money(revenue));
  if (rectWidth >= 90 && rectHeight >= 3 * tickSize) {
    textStyle(NORMAL);
    text('Revenue', centerX, centerY - tickSize * 0.65);
    textStyle(BOLD);
    text(money(revenue), centerX, centerY + tickSize * 0.65);
  } else if (rectWidth >= amountWidth + 12 && rectHeight >= tickSize + 8) {
    text(money(revenue), centerX, centerY);
  }
  textStyle(NORMAL);

  // hint that goes away after the first interaction
  if (!hasInteracted) {
    fill('black');
    textAlign(LEFT, BOTTOM);
    text('Drag me', x - 10, y - 26);
  }

  drawHandle(x, y, dragTarget === 'demand' || (!dragTarget && plotUnderMouse() === 'demand'));

  // current price and quantity on the axes
  drawAxisPill(money(price), plot.left - 4, y, 'right', 'black');
  drawAxisPill(String(quantity), x, plotBottom + 7 + tickSize / 2, 'center', 'black');
}

// ---------- Drawing: right panel ----------
function drawRevenuePanel() {
  const plot = revenuePlot;
  const priceToX = (p) => map(p, 0, maxPrice, plot.left, plot.right);
  const revenueToY = (r) => map(r, 0, revenueAxisMax, plotBottom, plotTop);
  const revenue = revenueAt(price);
  const x = priceToX(price);
  const y = revenueToY(revenue);

  drawPlotFrame(plot, maxPrice, 50, revenueAxisMax, 2000, money, revenueLabel,
    'Price', 'Revenue', 'Revenue Curve', { x: x, y: y, xLabel: money(price) });
  const peakX = priceToX(peakPrice);
  const peakY = revenueToY(peakRevenue);

  if (showMaximum) {
    // the whole revenue curve, drawn faintly under the part the learner has traced
    noFill();
    stroke('lightsteelblue');
    strokeWeight(2);
    beginShape();
    for (let p = 0; p <= maxPrice; p += 2) vertex(priceToX(p), revenueToY(revenueAt(p)));
    endShape();

    stroke(maximumColor);
    setDashed(true);
    line(peakX, plotBottom, peakX, peakY);
    setDashed(false);
  }

  // the part of the revenue curve that the learner has traced
  noFill();
  stroke(revenueColor);
  strokeWeight(3);
  let shapeOpen = false;
  for (let p = 0; p <= maxPrice; p++) {
    if (visited[p]) {
      if (!shapeOpen) {
        beginShape();
        shapeOpen = true;
      }
      vertex(priceToX(p), revenueToY(revenueAt(p)));
    } else if (shapeOpen) {
      endShape();
      shapeOpen = false;
    }
  }
  if (shapeOpen) endShape();

  // guide lines from the current point to both axes
  stroke('gray');
  strokeWeight(1);
  setDashed(true);
  line(plot.left, y, x, y);
  line(x, y, x, plotBottom);
  setDashed(false);

  // ring around the maximum, or around the best revenue found so far
  noFill();
  stroke(maximumColor);
  strokeWeight(3);
  if (showMaximum) {
    circle(peakX, peakY, 22);
  } else if (visitedCount > 1) {
    circle(priceToX(bestFoundPrice), revenueToY(bestFoundRevenue), 22);
  }

  noStroke();
  fill('black');
  textSize(tickSize);
  if (showMaximum) {
    // the longest label that fits inside the plot
    const labels = ['Maximum: ' + money(peakRevenue) + ' at ' + money(peakPrice),
      'Max: ' + money(peakRevenue), 'Max'];
    const room = plot.right - plot.left - 8;
    const label = labels.find((s) => textWidth(s) <= room) || 'Max';
    textAlign(CENTER, BOTTOM);
    text(label, peakX, peakY - 15);
  } else if (!hasInteracted && isWide) {
    textAlign(CENTER, TOP);
    text('Change the price to', (plot.left + plot.right) / 2, plotTop + 10);
    text('trace the revenue curve', (plot.left + plot.right) / 2, plotTop + 30);
  }

  drawHandle(x, y, dragTarget === 'revenue' || (!dragTarget && plotUnderMouse() === 'revenue'));

  // current price and revenue on the axes
  drawAxisPill(revenueLabel(revenue), plot.left - 4, y, 'right', revenueColor);
  drawAxisPill(money(price), x, plotBottom + 7 + tickSize / 2, 'center', 'black');
}

// ---------- Drawing: title, readout and control labels ----------
function drawTitle() {
  const title = 'What Price Gives the Most Revenue?';
  noStroke();
  fill('black');
  textStyle(NORMAL);
  textAlign(CENTER, TOP);
  textSize(24);
  // shrink the title on a narrow canvas
  const fit = min(1, (canvasWidth - 20) / fontWidth(title));
  textSize(floor(24 * fit));
  text(title, canvasWidth / 2, 6);
}

// The revenue calculation with the current numbers, and the best revenue found so far
function drawReadout() {
  const quantity = quantityAt(price);
  const lead = (isWide ? 'Revenue = Price × Quantity = ' : 'Revenue = ') +
    money(price) + ' × ' + quantity + ' = ';
  const result = money(revenueAt(price));
  const lineY = drawHeight - 38;

  noStroke();
  textSize(isWide ? 20 : 16);
  textAlign(LEFT, CENTER);
  textStyle(NORMAL);
  const leadWidth = fontWidth(lead);
  textStyle(BOLD);
  const resultWidth = fontWidth(result);
  const startX = (canvasWidth - leadWidth - resultWidth) / 2;
  fill('mediumblue');
  text(result, startX + leadWidth, lineY);
  textStyle(NORMAL);
  fill('black');
  text(lead, startX, lineY);

  let message;
  if (showMaximum || hasFoundMaximum()) {
    message = (isWide ? 'Maximum revenue: ' : 'Maximum: ') + money(peakRevenue) +
      (isWide ? ' at a price of ' : ' at ') + money(peakPrice);
  } else {
    message = (isWide ? 'Highest revenue found so far: ' : 'Best so far: ') +
      money(bestFoundRevenue) + (isWide ? ' at a price of ' : ' at ') + money(bestFoundPrice);
  }
  textSize(isWide ? 16 : 14);
  textAlign(CENTER, CENTER);
  text(message, canvasWidth / 2, drawHeight - 15);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textStyle(NORMAL);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Price: ' + money(price), 10, drawHeight + 52);
}

// ---------- Button handlers ----------
function toggleSweep() {
  hasInteracted = true;
  if (isSweeping) {
    isSweeping = false;
    sweepCanResume = true;
  } else if (sweepCanResume) {
    isSweeping = true;
  } else {
    // a new sweep clears the trace and draws the whole curve from $0 to $200
    clearTrace();
    sweepPosition = 0;
    setPrice(0, false);
    isSweeping = true;
  }
  updateSweepLabel();
}

// Any manual price change ends the sweep
function cancelSweep() {
  isSweeping = false;
  sweepCanResume = false;
  updateSweepLabel();
}

function updateSweepLabel() {
  sweepButton.html(isSweeping ? 'Pause' : (sweepCanResume ? 'Resume' : 'Sweep Price'));
}

function resetSim() {
  cancelSweep();
  maxCheckbox.checked(false);
  showMaximum = false;
  clearTrace();
  price = initialPrice;
  setPrice(initialPrice, false);
  hasInteracted = false;
  pulsePhase = 0;
  dragTarget = null;
}

// ---------- Mouse and keyboard ----------
// Returns 'demand' or 'revenue' when the mouse is on (or just outside) that plot
function plotUnderMouse() {
  const pad = 12;
  if (mouseY < plotTop - pad || mouseY > plotBottom + pad) return null;
  if (mouseX >= demandPlot.left - pad && mouseX <= demandPlot.right + pad) return 'demand';
  if (mouseX >= revenuePlot.left - pad && mouseX <= revenuePlot.right + pad) return 'revenue';
  return null;
}

function followMouse() {
  if (dragTarget === 'demand') {
    // project the mouse onto the demand curve so the point can be dragged in any direction
    const lineX = demandPlot.right - demandPlot.left;
    const lineY = plotBottom - plotTop;
    const along = ((mouseX - demandPlot.left) * lineX + (mouseY - plotTop) * lineY) /
      (lineX * lineX + lineY * lineY);
    setPrice(maxPrice * (1 - constrain(along, 0, 1)), true);
  } else if (dragTarget === 'revenue') {
    setPrice(map(mouseX, revenuePlot.left, revenuePlot.right, 0, maxPrice), true);
  }
}

function mousePressed() {
  dragTarget = plotUnderMouse();
  if (dragTarget) {
    hasInteracted = true;
    cancelSweep();
    followMouse();
  }
}

function mouseDragged() {
  if (dragTarget) {
    followMouse();
    return false;
  }
}

function mouseReleased() {
  dragTarget = null;
}

// Left and right arrows change the price by $1 (by $10 with Shift). S, M and R work the controls.
function keyPressed(event) {
  if (key === 'ArrowLeft' || key === 'ArrowRight') {
    if (document.activeElement === priceSlider.elt) return;   // the slider moves itself
    const amount = (event && event.shiftKey ? 10 : 1) * (key === 'ArrowRight' ? 1 : -1);
    hasInteracted = true;
    cancelSweep();
    setPrice(price + amount, true);
    return false;
  }
  if (key === 's' || key === 'S') {
    toggleSweep();
    return false;
  }
  if (key === 'm' || key === 'M') {
    maxCheckbox.checked(!maxCheckbox.checked());
    hasInteracted = true;
    return false;
  }
  if (key === 'r' || key === 'R') {
    resetSim();
    return false;
  }
}

// ---------- Responsive design ----------
function positionControls() {
  priceSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.max(320, Math.floor(container.getBoundingClientRect().width));
  }
}
