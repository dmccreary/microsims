// Reinforcing and Balancing Behavior Lab - compare the time behavior of two feedback loops
// CANVAS_HEIGHT: 650
// Learning objective (Understand / compare): the learner compares the time behavior of a
// reinforcing loop and a balancing loop by changing the loop rate and the goal and observing
// the resulting curves.
//
// Model (the two update rules from Chapter 8, one time step at a time):
//   reinforcing:  x = x + rate * x            (change is proportional to the current value)
//   balancing:    x = x + rate * (goal - x)   (change is proportional to the distance to the goal)
// "Rise" in the prediction questions means the increase over the first 10 steps: x[10] - x[0].

// ---------- Canvas dimensions (standard MicroSim layout) ----------
let canvasWidth = 400;                 // updated from the container width
let drawHeight = 430;                  // drawing region (aliceblue): chart + caption
let controlHeight = 220;               // control region (white): 6 rows x 35 + 10
let canvasHeight = drawHeight + controlHeight;   // 650
let margin = 25;
let sliderLeftMargin = 150;            // room for "Start value: 50" left of the slider
let defaultTextSize = 16;

// ---------- Model constants ----------
const TOTAL_STEPS = 50;                // steps shown on the horizontal axis
const RISE_STEP = 10;                  // "rise" = value at step 10 minus the start value
const FRAMES_PER_STEP = 4;             // animation speed: one model step every 4 frames

// ---------- Chart geometry (recomputed when the width changes) ----------
let plotLeft = 62, plotRight, plotTop = 44, plotBottom = 300;

// ---------- Simulation state ----------
let rate = 0.1, goal = 100, startValue = 10;
let rValues = [];                      // reinforcing stock, one value per completed step
let bValues = [];                      // balancing stock
let isRunning = false;                 // MicroSim standard: start paused
let frameCounter = 0;
let ghost = null;                      // full curves of the previous settings {r, b, rate, goal, start}
let baseline = null;                   // settings the next prediction is compared with

// ---------- Prediction state ----------
let predictPending = false;            // waiting for both predictions
let predR = null, predB = null;        // 'faster' | 'slower' | 'same'
let predictionMade = false;            // predictions locked in for the current run
let feedback = null;                   // [{loop, said, actual, oldRise, newRise}]
let predictionsCorrect = 0, predictionsTotal = 0;

// ---------- Controls ----------
let startButton, resetButton, predictCheckbox;
let rateSlider, goalSlider, startSlider;
let rButtons = [], bButtons = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Row 0: Start / Pause, Reset, Predict first
  startButton = createButton('Start');
  startButton.position(10, drawHeight + 6);
  startButton.mousePressed(toggleRun);

  resetButton = createButton('Reset');
  resetButton.position(78, drawHeight + 6);
  resetButton.mousePressed(resetRun);

  predictCheckbox = createCheckbox(' Predict first', true);
  predictCheckbox.position(150, drawHeight + 7);
  predictCheckbox.style('font-size', '16px');
  predictCheckbox.changed(onPredictToggle);

  // Rows 1-3: the three model parameters
  rateSlider = createSlider(0.01, 0.3, rate, 0.01);
  rateSlider.position(sliderLeftMargin, drawHeight + 44);
  rateSlider.input(onSliderInput);
  rateSlider.changed(onSliderChanged);

  goalSlider = createSlider(50, 200, goal, 1);
  goalSlider.position(sliderLeftMargin, drawHeight + 79);
  goalSlider.input(onSliderInput);
  goalSlider.changed(onSliderChanged);

  startSlider = createSlider(1, 50, startValue, 1);
  startSlider.position(sliderLeftMargin, drawHeight + 114);
  startSlider.input(onSliderInput);
  startSlider.changed(onSliderChanged);

  // Rows 4-5: prediction buttons (shown only while a prediction is pending)
  const choices = ['faster', 'slower', 'same'];
  const labels = ['Faster', 'Slower', 'Same'];
  for (let i = 0; i < 3; i++) {
    const rb = createButton(labels[i]);
    rb.position(150 + i * 74, drawHeight + 146);
    rb.mousePressed(() => choosePrediction('R', choices[i]));
    rButtons.push(rb);
    const bb = createButton(labels[i]);
    bb.position(150 + i * 74, drawHeight + 181);
    bb.mousePressed(() => choosePrediction('B', choices[i]));
    bButtons.push(bb);
  }
  for (const b of rButtons.concat(bButtons)) {
    b.style('font-size', '15px');
    b.style('width', '68px');
  }

  resizeSliders();
  resetRun();
  showPredictionButtons(false);

  describe('Line graph of a reinforcing loop and a balancing loop over 50 time steps. ' +
    'Sliders set the rate, the goal and the start value. The reinforcing curve grows faster ' +
    'and faster; the balancing curve rises quickly and then levels off at the dashed goal line.', LABEL);
}

function draw() {
  updateCanvasSize();

  // Drawing region and control region backgrounds (MicroSim standard)
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Advance the model while running
  if (isRunning) {
    frameCounter++;
    if (frameCounter % FRAMES_PER_STEP === 0) stepModel();
  }

  drawAxes();

  // Title (drawn after the axes)
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(canvasWidth < 520 ? 18 : 22);
  text('Reinforcing vs Balancing Loop Behavior', canvasWidth / 2, 10);

  drawGoalLine();
  if (ghost) drawGhost();
  drawCurve(rValues, 'firebrick', 'R');
  drawCurve(bValues, 'forestgreen', 'B');
  drawLegend();
  drawExitLabel();
  drawPanel();
  drawCaption();
  drawHover();
  drawControlLabels();
}

// ---------- Model ----------

function simulate(r, g, s, steps) {
  const R = [s], B = [s];
  for (let i = 0; i < steps; i++) {
    const x = R[R.length - 1];
    R.push(x + r * x);
    const y = B[B.length - 1];
    B.push(y + r * (g - y));
  }
  return { r: R, b: B };
}

function stepModel() {
  const n = rValues.length - 1;
  if (n >= TOTAL_STEPS) {
    isRunning = false;
    startButton.html('Start');
    return;
  }
  const x = rValues[n];
  rValues.push(x + rate * x);                 // reinforcing rule
  const y = bValues[n];
  bValues.push(y + rate * (goal - y));        // balancing rule
  if (rValues.length - 1 === RISE_STEP && predictionMade) revealPredictions();
  if (rValues.length - 1 >= TOTAL_STEPS) {
    isRunning = false;
    startButton.html('Start');
  }
}

function rise(values) {
  return values[RISE_STEP] - values[0];
}

// ---------- Chart ----------

function yMax() { return 2 * goal; }          // goal line always sits at mid-height

function toX(step) {
  return map(step, 0, TOTAL_STEPS, plotLeft, plotRight);
}

function toY(v) {
  return map(v, 0, yMax(), plotBottom, plotTop);
}

function drawAxes() {
  // plot background
  noStroke();
  fill('white');
  rect(plotLeft, plotTop, plotRight - plotLeft, plotBottom - plotTop);

  // grid lines and tick labels
  textSize(14);
  for (let i = 0; i <= 4; i++) {
    const v = yMax() * i / 4;
    const y = toY(v);
    stroke('gainsboro');
    strokeWeight(1);
    line(plotLeft, y, plotRight, y);
    noStroke();
    fill('black');
    textAlign(RIGHT, CENTER);
    text(nf(v, 0, 0), plotLeft - 6, y);
  }
  for (let s = 0; s <= TOTAL_STEPS; s += 10) {
    const x = toX(s);
    stroke('gainsboro');
    line(x, plotTop, x, plotBottom);
    noStroke();
    fill('black');
    textAlign(CENTER, TOP);
    text(s, x, plotBottom + 4);
  }
  // axes
  stroke('dimgray');
  strokeWeight(1.5);
  line(plotLeft, plotBottom, plotRight, plotBottom);
  line(plotLeft, plotTop, plotLeft, plotBottom);

  // axis titles
  noStroke();
  fill('black');
  textSize(15);
  textAlign(CENTER, TOP);
  text('Time step', (plotLeft + plotRight) / 2, plotBottom + 21);
  push();
  translate(14, (plotTop + plotBottom) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text('Stock value (x)', 0, 0);
  pop();
}

function drawGoalLine() {
  const y = toY(goal);
  stroke('dimgray');
  strokeWeight(1.5);
  drawingContext.setLineDash([8, 6]);
  line(plotLeft, y, plotRight, y);
  drawingContext.setLineDash([]);
  noStroke();
  fill('dimgray');
  textSize(14);
  textAlign(RIGHT, BOTTOM);
  text('Goal = ' + goal, plotRight - 4, y - 2);
}

function drawGhost() {
  // previous settings, faint and dashed, so the learner can compare runs
  drawingContext.setLineDash([4, 4]);
  drawPolyline(ghost.r, color(178, 34, 34, 90), 1.5, true);
  drawPolyline(ghost.b, color(34, 139, 34, 90), 1.5, true);
  drawingContext.setLineDash([]);
}

function drawPolyline(values, c, w, clipTop) {
  stroke(c);
  strokeWeight(w);
  noFill();
  beginShape();
  for (let i = 0; i < values.length; i++) {
    if (clipTop && values[i] > yMax()) {
      // stop where the curve leaves the top of the chart
      const prev = values[i - 1];
      const t = (yMax() - prev) / (values[i] - prev);
      vertex(toX(i - 1 + t), plotTop);
      break;
    }
    vertex(toX(i), toY(values[i]));
  }
  endShape();
}

function drawCurve(values, c, tag) {
  drawPolyline(values, color(c), 3, true);
  // point markers: circles for R, squares for B (shape as well as color)
  let exitStep = -1;
  for (let i = 0; i < values.length; i++) {
    if (values[i] > yMax()) { exitStep = i; break; }
    const px = toX(i), py = toY(values[i]);
    noStroke();
    fill(c);
    if (tag === 'R') circle(px, py, 6);
    else rect(px - 3, py - 3, 6, 6);
  }
  // end label
  noStroke();
  fill(c);
  textSize(16);
  textStyle(BOLD);
  if (exitStep < 0 && values.length > 1) {
    const last = values.length - 1;
    textAlign(LEFT, CENTER);
    const ly = toY(values[last]) + (tag === 'R' ? -12 : 12);
    text(tag, min(toX(last) + 6, plotRight - 14), constrain(ly, plotTop + 8, plotBottom - 8));
  }
  textStyle(NORMAL);
}

function drawLegend() {
  // top-left corner of the plot: B never rises above the goal and R is still low
  // at early steps; narrow screens get a compact legend without formulas
  const wide = plotRight - plotLeft >= 420;
  const labels = wide
    ? ['Reinforcing (R): x + rate\u00b7x', 'Balancing (B): x + rate\u00b7(goal\u2212x)', 'Previous settings']
    : ['Reinforcing (R)', 'Balancing (B)', 'Previous settings'];
  textSize(14);
  let w = 0;
  for (const l of labels) w = max(w, fontWidth(l));
  w += 52;
  const x = plotLeft + 10, y = plotTop + 8;
  fill(255, 255, 255, 235);
  stroke('silver');
  strokeWeight(1);
  rect(x, y, w, 66, 8);
  textAlign(LEFT, CENTER);
  // reinforcing
  stroke('firebrick'); strokeWeight(3);
  line(x + 8, y + 14, x + 34, y + 14);
  noStroke(); fill('firebrick'); circle(x + 21, y + 14, 7);
  fill('black');
  text(labels[0], x + 42, y + 14);
  // balancing
  stroke('forestgreen'); strokeWeight(3);
  line(x + 8, y + 34, x + 34, y + 34);
  noStroke(); fill('forestgreen'); rect(x + 18, y + 31, 7, 7);
  fill('black');
  text(labels[1], x + 42, y + 34);
  // ghost
  stroke(120); strokeWeight(1.5);
  drawingContext.setLineDash([4, 4]);
  line(x + 8, y + 54, x + 34, y + 54);
  drawingContext.setLineDash([]);
  noStroke(); fill('dimgray');
  text(labels[2], x + 42, y + 54);
}

// "R leaves the chart" marker, drawn after the legend so it is never hidden
function drawExitLabel() {
  const exitStep = rValues.findIndex(v => v > yMax());
  if (exitStep < 0) return;
  const ex = toX(exitStep - 0.5);
  noStroke();
  fill('firebrick');
  textSize(16);
  textStyle(BOLD);
  const label = 'R \u2191 off chart';
  if (ex + 8 + fontWidth(label) < plotRight - 4) {
    textAlign(LEFT, TOP);
    text(label, ex + 8, plotTop + 4);
  } else {
    textAlign(RIGHT, TOP);
    text(label, ex - 8, plotTop + 4);
  }
  textStyle(NORMAL);
}

// Right-hand panel inside the plot: prediction question, feedback or rise readout
function drawPanel() {
  const w = min(250, (plotRight - plotLeft) * 0.55);
  const x = plotRight - w - 8;
  const y = plotBottom - 96;
  if (plotRight - plotLeft < 420) return;     // narrow screens: the caption carries this text
  let lines = panelLines();
  if (!lines) return;
  const h = (predictPending || feedback) ? 88 : 50;
  stroke('silver');
  fill(255, 255, 255, 240);
  rect(x, y + 88 - h, w, h, 8);
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, TOP);
  text(lines, x + 8, y + 88 - h + 6, w - 16, h - 8);
}

function panelLines() {
  if (predictPending) {
    return 'Predict: over the first 10 steps, will each curve rise faster, slower or the same as with the previous settings? Choose below.';
  }
  if (feedback) {
    const parts = feedback.map(f =>
      (f.loop === 'R' ? 'R' : 'B') + ': you said ' + f.said + ', it was ' + f.actual +
      (f.said === f.actual ? ' ✓' : ' ✗') +
      ' (rise ' + nf(f.oldRise, 0, 1) + ' → ' + nf(f.newRise, 0, 1) + ')');
    return parts.join('\n') + '\nCorrect so far: ' + predictionsCorrect + ' of ' + predictionsTotal;
  }
  if (rValues.length - 1 >= RISE_STEP) {
    return 'Rise over the first 10 steps\nR: +' + nf(rise(rValues), 0, 1) +
      '   B: +' + nf(rise(bValues), 0, 1);
  }
  return null;
}

// Caption below the chart that explains the shape seen so far
function drawCaption() {
  const y = plotBottom + 44;
  noStroke();
  fill('black');
  textSize(15);
  textAlign(LEFT, TOP);
  let msg = captionText();
  if (plotRight - plotLeft < 420 && (predictPending || feedback)) {
    msg = panelLines().replace(/\n/g, '  ');
  }
  text(msg, 12, y, canvasWidth - 24, drawHeight - y - 4);
}

function captionText() {
  const n = rValues.length - 1;
  if (n === 0) {
    if (predictPending) {
      return 'Both curves will start at ' + startValue + '. Choose Faster, Slower or Same for each ' +
        'curve below; the run starts when both predictions are in.';
    }
    return 'Both curves start at ' + startValue + '. Press Start. Watch which curve speeds up ' +
      'and which one slows down as it nears the goal.';
  }
  const x = rValues[n], y = bValues[n];
  const rStep = rate * x, bStep = rate * (goal - y);
  let rPart, bPart;
  if (x > yMax()) {
    const exit = rValues.findIndex(v => v > yMax());
    rPart = 'R left the chart at step ' + exit + ': each step adds rate × x, so growth keeps accelerating (+' + nf(rStep, 0, 0) + ' now).';
  } else {
    rPart = 'R is accelerating: next step adds ' + nf(rate, 0, 2) + ' × ' + nf(x, 0, 1) + ' = +' + nf(rStep, 0, 1) + ', more than the last.';
  }
  const gap = goal - y;
  if (abs(gap) < 0.01 * goal) {
    bPart = 'B has leveled off at the goal: the gap is ' + nf(gap, 0, 1) + ', so there is almost nothing left to correct.';
  } else {
    bPart = 'B is slowing: next step adds ' + nf(rate, 0, 2) + ' × gap ' + nf(gap, 0, 1) + ' = +' + nf(bStep, 0, 1) + ', less as the gap shrinks.';
  }
  return 'Step ' + n + '. ' + rPart + ' ' + bPart;
}

// Hover a point to see its step number and value
function drawHover() {
  if (mouseY < plotTop - 5 || mouseY > plotBottom + 5 || mouseX < plotLeft - 5 || mouseX > plotRight + 5) return;
  let best = null, bestD = 12;
  const sets = [[rValues, 'Reinforcing', 'firebrick'], [bValues, 'Balancing', 'forestgreen']];
  for (const [vals, name, c] of sets) {
    for (let i = 0; i < vals.length; i++) {
      if (vals[i] > yMax()) break;
      const d = dist(mouseX, mouseY, toX(i), toY(vals[i]));
      if (d < bestD) { bestD = d; best = { name, c, i, v: vals[i] }; }
    }
  }
  if (!best) return;
  const px = toX(best.i), py = toY(best.v);
  noFill();
  stroke(best.c);
  strokeWeight(2);
  circle(px, py, 14);
  const label = best.name + ', step ' + best.i + ': ' + nf(best.v, 0, 2);
  textSize(14);
  const tw = fontWidth(label) + 16;
  let bx = px + 12, by = py - 34;
  if (bx + tw > canvasWidth - 4) bx = px - tw - 12;
  if (by < 4) by = py + 12;
  stroke('dimgray');
  strokeWeight(1);
  fill('white');
  rect(bx, by, tw, 24, 6);
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  text(label, bx + 8, by + 12);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Rate: ' + nf(rate, 0, 2), 10, drawHeight + 54);
  text('Goal: ' + goal, 10, drawHeight + 89);
  text('Start value: ' + startValue, 10, drawHeight + 124);
  if (predictPending) {
    text('R will rise:', 10, drawHeight + 158);
    text('B will rise:', 10, drawHeight + 193);
    // mark the chosen buttons
    highlightChoice(rButtons, predR);
    highlightChoice(bButtons, predB);
  } else {
    fill('dimgray');
    textSize(14);
    textAlign(LEFT, TOP);
    const hint = predictCheckbox.checked()
      ? 'Change a slider: the lab pauses here and asks for your prediction.'
      : 'Predict first is off: slider changes restart the curves at once.';
    text(hint, 10, drawHeight + 150, canvasWidth - 20, 60);
  }
}

function highlightChoice(buttons, choice) {
  const keys = ['faster', 'slower', 'same'];
  for (let i = 0; i < 3; i++) {
    const on = keys[i] === choice;
    buttons[i].style('background-color', on ? 'gold' : '');
    buttons[i].style('font-weight', on ? 'bold' : 'normal');
  }
}

// ---------- Controls ----------

function toggleRun() {
  if (predictPending) return;                 // answer the prediction first
  if (rValues.length - 1 >= TOTAL_STEPS) {    // finished: start the same settings again
    startCurves();
  }
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}

function resetRun() {
  isRunning = false;
  startButton.html('Start');
  predictPending = false;
  predictionMade = false;
  predR = predB = null;
  feedback = null;
  showPredictionButtons(false);
  readSliders();
  startCurves();
  baseline = { rate, goal, start: startValue };
}

function startCurves() {
  rValues = [startValue];
  bValues = [startValue];
  frameCounter = 0;
}

function readSliders() {
  rate = rateSlider.value();
  goal = goalSlider.value();
  startValue = startSlider.value();
}

function onSliderInput() {
  // keep a faint copy of the curves for the settings in effect before this change
  if (!ghost || ghost.rate !== baseline.rate || ghost.goal !== baseline.goal || ghost.start !== baseline.start) {
    const g = simulate(baseline.rate, baseline.goal, baseline.start, TOTAL_STEPS);
    ghost = { r: g.r, b: g.b, rate: baseline.rate, goal: baseline.goal, start: baseline.start };
  }
  readSliders();
  startCurves();
  feedback = null;
  if (predictCheckbox.checked()) {
    isRunning = false;
    startButton.html('Start');
  }
}

function onSliderChanged() {
  readSliders();
  const same = rate === baseline.rate && goal === baseline.goal && startValue === baseline.start;
  if (predictCheckbox.checked() && !same) {
    predictPending = true;
    predictionMade = false;
    predR = predB = null;
    isRunning = false;
    startButton.html('Start');
    showPredictionButtons(true);
  } else if (!predictCheckbox.checked()) {
    baseline = { rate, goal, start: startValue };
  }
}

function onPredictToggle() {
  if (!predictCheckbox.checked()) {
    predictPending = false;
    showPredictionButtons(false);
    baseline = { rate, goal, start: startValue };
  }
}

function choosePrediction(loop, choice) {
  if (loop === 'R') predR = choice; else predB = choice;
  if (predR && predB) {
    // both answers in: lock them and run the new settings
    predictPending = false;
    predictionMade = true;
    showPredictionButtons(false);
    startCurves();
    isRunning = true;
    startButton.html('Pause');
  }
}

function classify(oldRise, newRise) {
  const tol = 0.02 * abs(oldRise) + 0.05;
  if (newRise > oldRise + tol) return 'faster';
  if (newRise < oldRise - tol) return 'slower';
  return 'same';
}

function revealPredictions() {
  const old = simulate(baseline.rate, baseline.goal, baseline.start, RISE_STEP);
  const oR = rise(old.r), oB = rise(old.b);
  const nR = rise(rValues), nB = rise(bValues);
  const aR = classify(oR, nR), aB = classify(oB, nB);
  feedback = [
    { loop: 'R', said: predR, actual: aR, oldRise: oR, newRise: nR },
    { loop: 'B', said: predB, actual: aB, oldRise: oB, newRise: nB }
  ];
  predictionsTotal += 2;
  if (predR === aR) predictionsCorrect++;
  if (predB === aB) predictionsCorrect++;
  predictionMade = false;
  baseline = { rate, goal, start: startValue };
}

function showPredictionButtons(show) {
  for (const b of rButtons.concat(bButtons)) {
    if (show) b.show(); else b.hide();
    b.style('background-color', '');
    b.style('font-weight', 'normal');
  }
}

function resizeSliders() {
  const w = canvasWidth - sliderLeftMargin - margin;
  rateSlider.size(w);
  goalSlider.size(w);
  startSlider.size(w);
}

// ---------- Responsive design ----------

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  resizeSliders();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
  plotRight = canvasWidth - 24;
}
