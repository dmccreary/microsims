// Sketch Lifecycle Explorer
// CANVAS_HEIGHT: 555
// A slowed, steppable model of the p5.js sketch lifecycle. A small "sketch"
// (a falling ball) is drawn into its own buffer, one draw() statement at a
// time, while a panel counts setup() and draw() calls and highlights the
// statement that is executing. Two checkboxes change the statements inside
// draw(): skipping background() leaves a streak, and drawing the ball before
// background() makes it vanish.

// ---------- layout globals ----------
let canvasWidth = 400;
let drawHeight = 440;
let controlHeight = 115;             // three rows of controls
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let sliderLeftMargin = 330;          // recomputed from the button widths
let defaultTextSize = 16;
let narrowBreakpoint = 500;          // below this the counter panel moves under the ball

// ---------- the simulated sketch ----------
let sk = null;                       // p5.Graphics buffer = the sketch's canvas
let skW = 0, skH = 0;
let ballY = 30;                      // global variable of the simulated sketch
const ballSpeed = 8;                 // pixels per draw() call
const ballD = 30;
let setupCalls = 1;                  // setup() ran once, when the page loaded
let drawCalls = 0;                   // also the sketch's frameCount

// The five statements inside draw(), in their normal order
const STEPS = [
  { id: 'bg', code: "background('aliceblue');", what: 'paint the background' },
  { id: 'grid', code: 'drawGrid();', what: 'draw the grid' },
  { id: 'title', code: "text('Falling ball', 10, 8);", what: 'draw the title' },
  { id: 'ball', code: 'ballY += 8; circle(x, ballY, 30);', what: 'update the model, draw the ball' },
  { id: 'label', code: "text('ballY = ' + ballY, 10, h - 22);", what: 'draw the label' }
];

// ---------- lifecycle state ----------
let isRunning = false;               // MicroSim standard: start paused
let pendingSteps = [];               // statements still to run in the current draw() call
let currentStep = null;              // id of the statement executing now
let lastStepTime = 0;
let nextFrameTime = 0;

// ---------- controls ----------
let startButton, stepButton, rateSlider, clearCheckbox, ballFirstCheckbox;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  startButton = createButton('Start');
  startButton.parent(document.querySelector('main'));
  startButton.mousePressed(toggleRunning);

  stepButton = createButton('Step one frame');
  stepButton.parent(document.querySelector('main'));
  stepButton.mousePressed(stepOneFrame);

  rateSlider = createSlider(1, 60, 5, 1);
  rateSlider.parent(document.querySelector('main'));

  clearCheckbox = createCheckbox('Clear background each frame', true);
  clearCheckbox.parent(document.querySelector('main'));
  clearCheckbox.style('white-space', 'nowrap');

  ballFirstCheckbox = createCheckbox('Draw ball before background', false);
  ballFirstCheckbox.parent(document.querySelector('main'));
  ballFirstCheckbox.style('white-space', 'nowrap');

  positionControls();
  makeSketchBuffer();

  describe('A model of the p5.js sketch lifecycle. On the left, a small sketch canvas where a ball falls ' +
    'one draw() call at a time. On the right, counters show setup() calls: 1, draw() calls and frameCount, ' +
    'and a numbered list of the five statements inside draw() highlights the one executing. Checkboxes ' +
    'skip the background statement or move the ball before it, and a caption explains the result.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(22);
  text('Sketch Lifecycle Explorer', margin, 10);
  textStyle(NORMAL);

  advanceLifecycle();

  const narrow = canvasWidth < narrowBreakpoint;
  const captionH = 50;
  let sx, sy, panelX, panelY, panelW, panelH;
  if (!narrow) {
    sx = margin; sy = 44;
    panelX = floor(canvasWidth / 2) + 6; panelY = 44;
    panelW = canvasWidth - panelX - margin;
    panelH = drawHeight - 44 - captionH - 14;
  } else {
    sx = margin; sy = 42;
    panelX = margin;
    panelW = canvasWidth - 2 * margin;
  }
  makeSketchBuffer();

  // The sketch's canvas on a white card
  fill('white');
  stroke('slategray');
  strokeWeight(2);
  rect(sx - 3, sy - 3, skW + 6, skH + 6, 4);
  strokeWeight(1);
  image(sk, sx, sy);
  if (drawCalls === 0 && pendingSteps.length === 0 && currentStep === null) {
    noStroke();
    fill('gray');
    textSize(15);
    textAlign(CENTER, CENTER);
    text('setup() created this canvas.\ndraw() has not run yet.', sx + skW / 2, sy + skH / 2);
    textAlign(LEFT, TOP);
  }

  if (narrow) {
    panelY = sy + skH + 10;
    panelH = drawHeight - panelY - captionH - 12;
  }
  drawCounterPanel(panelX, panelY, panelW, panelH, narrow);
  drawCaption(margin, drawHeight - captionH - 6, canvasWidth - 2 * margin, captionH);
  drawControlLabels();
}

// ---------- the simulated lifecycle ----------

// The order of statements inside draw(), given the two checkboxes
function currentOrder() {
  let order = ['bg', 'grid', 'title', 'ball', 'label'];
  if (ballFirstCheckbox.checked()) order = ['ball', 'bg', 'grid', 'title', 'label'];
  return order;
}

// Start one draw() call: count it and queue its statements
function beginDrawCall() {
  flushPending();
  drawCalls++;
  pendingSteps = currentOrder().slice();
  currentStep = null;
  lastStepTime = millis() - stepDelay();
}

// Run any statements still queued (used when a new frame starts early)
function flushPending() {
  while (pendingSteps.length > 0) runStatement(pendingSteps.shift());
  currentStep = null;
}

function stepDelay() {
  // A single step sweeps the highlight slowly (180 ms per statement);
  // while running, the five statements share one frame's time
  if (!isRunning) return 180;
  return min(150, 1000 / rateSlider.value() / 6);
}

function advanceLifecycle() {
  const now = millis();
  // Start a new draw() call when running and its time has come
  if (isRunning && now >= nextFrameTime) {
    beginDrawCall();
    nextFrameTime = now + 1000 / rateSlider.value();
  }
  // Execute queued statements one at a time so the highlight can be seen
  while (pendingSteps.length > 0 && now - lastStepTime >= stepDelay()) {
    currentStep = pendingSteps.shift();
    runStatement(currentStep);
    lastStepTime += stepDelay();
    if (stepDelay() > 20) break;     // at slow rates, one statement per real frame
  }
  if (pendingSteps.length === 0 && currentStep !== null && now - lastStepTime >= stepDelay()) {
    currentStep = null;              // the draw() call has finished
  }
}

// One statement of the simulated draw(), drawn into the sketch buffer
function runStatement(id) {
  const skipBg = !clearCheckbox.checked();
  if (id === 'bg') {
    if (!skipBg) sk.background('aliceblue');
  } else if (id === 'grid') {
    sk.stroke('lightsteelblue');
    sk.strokeWeight(1);
    for (let gx = 40; gx < skW; gx += 40) sk.line(gx, 0, gx, skH);
    for (let gy = 40; gy < skH; gy += 40) sk.line(0, gy, skW, gy);
  } else if (id === 'title') {
    sk.noStroke();
    sk.fill('black');
    sk.textSize(16);
    sk.textAlign(LEFT, TOP);
    sk.text('Falling ball', 10, 8);
  } else if (id === 'ball') {
    ballY += ballSpeed;
    if (ballY > skH - ballD / 2) ballY = ballD / 2 + 30;   // wrap to the top
    sk.noStroke();
    sk.fill('orangered');
    sk.circle(skW / 2, ballY, ballD);
  } else if (id === 'label') {
    sk.noStroke();
    sk.fill('black');
    sk.textSize(15);
    sk.textAlign(LEFT, TOP);
    sk.text('ballY = ' + ballY, 10, skH - 22);
  }
}

// ---------- panels ----------
function drawCounterPanel(x, y, w, h, narrow) {
  fill(255, 255, 255, 235);
  stroke(200);
  rect(x, y, w, h, 10);
  noStroke();
  const pad = 10;
  let ty = y + (narrow ? 6 : pad);
  const lh = narrow ? 19 : 24;

  // Counters
  textFont('monospace');
  textSize(narrow ? 14 : 16);
  fill('black');
  text('setup() calls: ' + setupCalls, x + pad, ty);
  ty += lh;
  fill('steelblue');
  text('draw() calls:  ' + drawCalls, x + pad, ty);
  ty += lh;
  fill('dimgray');
  text('frameCount:    ' + drawCalls, x + pad, ty);
  ty += lh + (narrow ? 2 : 8);
  textFont('sans-serif');

  // The statements inside draw()
  fill('black');
  textStyle(BOLD);
  textSize(15);
  text(narrow ? 'Inside draw(), in order:' : 'Each draw() call runs, in order:', x + pad, ty);
  textStyle(NORMAL);
  ty += narrow ? 19 : 24;

  const order = currentOrder();
  const skipBg = !clearCheckbox.checked();
  const rowH = narrow ? 21 : 32;
  for (let i = 0; i < order.length; i++) {
    const st = STEPS.find(s => s.id === order[i]);
    const skipped = (st.id === 'bg' && skipBg);
    if (currentStep === st.id) {
      fill('gold');
      rect(x + 6, ty - 3, w - 12, rowH - 2, 5);
    }
    fill(skipped ? 'darkgray' : 'black');
    textFont('monospace');
    textSize(narrow ? 13 : 14);
    const codeText = (i + 1) + '. ' + (skipped ? '// ' : '') + st.code;
    text(codeText, x + pad, ty);
    if (skipped) {
      stroke('darkgray');
      line(x + pad + 24, ty + 8, x + pad + textWidth(codeText), ty + 8);
      noStroke();
    }
    textFont('sans-serif');
    if (!narrow) {
      fill(skipped ? 'darkgray' : 'dimgray');
      textSize(13);
      text('    ' + (skipped ? 'skipped: ' : '') + st.what, x + pad, ty + 15);
    }
    ty += rowH;
  }
  // Waiting state between draw() calls
  if (!narrow && currentStep === null) {
    fill('dimgray');
    textSize(14);
    textStyle(ITALIC);
    text(isRunning ? 'Waiting for the next draw() call...' : 'Paused: press Step one frame.', x + pad, ty + 2);
    textStyle(NORMAL);
  }
}

// One-sentence caption explaining the current result
function drawCaption(x, y, w, h) {
  const skipBg = !clearCheckbox.checked();
  const ballFirst = ballFirstCheckbox.checked();
  let msg;
  if (drawCalls === 0) {
    msg = 'setup() has run once and created the canvas; press Step one frame to call draw() once and predict what appears.';
  } else if (skipBg && ballFirst) {
    msg = 'background() is skipped, so nothing covers the ball: it is drawn first and still leaves a streak.';
  } else if (skipBg) {
    msg = 'Without background() nothing erases the earlier frames, so every old ball stays on screen as a streak and the label smears.';
  } else if (ballFirst) {
    msg = 'circle() now runs before background(), so the background paints over the ball and the ball vanishes.';
  } else {
    msg = 'Each draw() call repaints the background first, so only the ball\'s newest position is visible.';
  }
  fill(255, 255, 255, 235);
  stroke(200);
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textSize(canvasWidth < narrowBreakpoint ? 14 : 15);
  textAlign(LEFT, TOP);
  const lines = wrapLines(msg, w - 20);
  const lh = canvasWidth < narrowBreakpoint ? 17 : 19;
  let ty = y + (h - lines.length * lh) / 2;
  for (const ln of lines) { text(ln, x + 10, ty); ty += lh; }
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Frame rate: ' + rateSlider.value(), sliderLeftMargin - 118, drawHeight + 18);
  if (canvasWidth >= 560) {
    fill('dimgray');
    textSize(15);
    text('Tip: at 1 or 2 frames per second you can read each statement as it runs.', 10, drawHeight + 93);
  }
}

// ---------- actions ----------
function toggleRunning() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
  if (isRunning) nextFrameTime = millis();
}

function stepOneFrame() {
  if (isRunning) toggleRunning();
  beginDrawCall();
}

// ---------- helpers ----------
function makeSketchBuffer() {
  const narrow = canvasWidth < narrowBreakpoint;
  const w = narrow ? canvasWidth - 2 * margin : floor(canvasWidth / 2) - margin - 6;
  const h = narrow ? 140 : drawHeight - 44 - 50 - 20;
  if (sk && w === skW && h === skH) return;
  if (sk) sk.remove();
  skW = w; skH = h;
  sk = createGraphics(skW, skH);
  if (ballY > skH - ballD / 2) ballY = ballD / 2 + 30;
}

function wrapLines(str, maxW) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (textWidth(test) <= maxW || !line) {
      line = test;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function positionControls() {
  startButton.position(10, drawHeight + 6);
  stepButton.position(10 + 64, drawHeight + 6);
  sliderLeftMargin = 74 + stepButton.elt.offsetWidth + 10 + 118;
  rateSlider.position(sliderLeftMargin, drawHeight + 8);
  rateSlider.size(max(60, canvasWidth - sliderLeftMargin - margin));
  // Checkboxes side by side when they fit, otherwise one per row
  // (measure widths after position(), which makes the checkbox divs shrink to fit)
  clearCheckbox.position(10, drawHeight + 44);
  const cw = clearCheckbox.elt.offsetWidth;
  ballFirstCheckbox.position(10 + cw + 20, drawHeight + 44);
  if (10 + cw + 20 + ballFirstCheckbox.elt.offsetWidth > canvasWidth - 10) {
    ballFirstCheckbox.position(10, drawHeight + 78);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.floor(container.getBoundingClientRect().width);
  }
}
