// Bouncing Ball Gravity Lab - predict, then test, how gravity and bounciness change a bounce
// CANVAS_HEIGHT: 500
// Learning objective (Understand / explain): the learner explains how changing gravity and
// bounciness changes the motion of a falling ball by predicting an outcome and then testing it.
//
// Model (one step per animation frame, dt = 1 frame):
//   speed = speed + gravity          (gravity adds to the downward speed every frame)
//   height = height - speed          (the speed moves the ball)
//   at the floor: speed = -speed * bounciness   (keep a fraction of the speed)
// The step is integrated exactly for constant acceleration, so the first bounce peak equals
// bounciness^2 x drop height no matter what gravity is - the key idea the prediction targets.

// ---------- Canvas dimensions (standard MicroSim layout) ----------
let canvasWidth = 400;               // updated from the container width
let drawHeight = 400;                // drawing region (aliceblue)
let controlHeight = 100;             // control region (white): 3 rows of controls
let canvasHeight = drawHeight + controlHeight;  // 500
let margin = 25;
let sliderLeftMargin = 150;          // room for "Bounciness: 0.80" to the left of the slider
let defaultTextSize = 16;

// ---------- Simulation constants ----------
const ballRadius = 20;
const startY = 62;                   // ball center at the top of a drop (below the title)
const trailLength = 40;              // faint trail of the last 40 positions
const restSpeed = 0.6;               // bounce stops when the rebound speed drops below this
let floorY;                          // top of the floor band (screen y)
let dropHeight;                      // height of the ball bottom above the floor at the start

// ---------- Simulation state ----------
let ballX;                           // horizontal position (fixed column)
let ballHeight = 0;                  // ball bottom above floor, pixels
let velocity = 0;                    // upward velocity, pixels per frame (negative = falling)
let bounces = 0;
let atRest = false;
let firstPeak = null;                // first bounce peak of the current drop (px)
let pendingPeak = null;              // peak computed at the bounce, shown when the ball gets there
let trail = [];
let isRunning = false;               // MicroSim standard: start paused
let dropGravity, dropBounce;         // settings in effect when the current drop started

// ---------- Prediction state ----------
let predictionPending = false;       // waiting for the learner to choose Higher/Lower/Same
let refGravity, refBounce;           // settings of the drop we compare against
let prediction = null;               // 'higher' | 'lower' | 'same'
let awaitingReveal = false;          // prediction made; reveal at the next first-bounce peak
let resultMessage = null;            // {title, detail, correct}

// ---------- Controls ----------
let startButton, dropButton, predictCheckbox;
let higherButton, lowerButton, sameButton;
let gravitySlider, bounceSlider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  floorY = drawHeight - 30;
  dropHeight = (floorY - ballRadius) - startY;

  // Row 1: Start / Pause, Drop Again, Predict first
  startButton = createButton('Start');
  startButton.parent(document.querySelector('main'));
  startButton.position(10, drawHeight + 6);
  startButton.size(64, 26);
  startButton.mousePressed(toggleRunning);

  dropButton = createButton('Drop Again');
  dropButton.parent(document.querySelector('main'));
  dropButton.position(80, drawHeight + 6);
  dropButton.size(92, 26);
  dropButton.mousePressed(dropAgain);

  predictCheckbox = createCheckbox(' Predict first', true);
  predictCheckbox.parent(document.querySelector('main'));
  predictCheckbox.position(186, drawHeight + 9);
  predictCheckbox.changed(onPredictToggle);

  // Row 1 while a prediction is pending: three answer buttons replace Start / Drop Again
  higherButton = createButton('Higher');
  lowerButton = createButton('Lower');
  sameButton = createButton('Same');
  [higherButton, lowerButton, sameButton].forEach((b, i) => {
    b.parent(document.querySelector('main'));
    b.position(10 + i * 58, drawHeight + 6);
    b.size(54, 26);
    b.hide();
  });
  higherButton.mousePressed(() => answerPrediction('higher'));
  lowerButton.mousePressed(() => answerPrediction('lower'));
  sameButton.mousePressed(() => answerPrediction('same'));

  // Row 2 and 3: sliders
  gravitySlider = createSlider(0.1, 2.0, 0.8, 0.1);
  gravitySlider.parent(document.querySelector('main'));
  gravitySlider.position(sliderLeftMargin, drawHeight + 40);
  gravitySlider.size(canvasWidth - sliderLeftMargin - margin);
  gravitySlider.changed(onSliderChanged);

  bounceSlider = createSlider(0.3, 0.95, 0.8, 0.05);
  bounceSlider.parent(document.querySelector('main'));
  bounceSlider.position(sliderLeftMargin, drawHeight + 70);
  bounceSlider.size(canvasWidth - sliderLeftMargin - margin);
  bounceSlider.changed(onSliderChanged);

  resetBall();

  describe('A bouncing ball lab. An orange-red ball falls from the top of a light blue ' +
    'drawing region and bounces on a white floor, leaving a faint dotted trail. A panel shows ' +
    'the height, speed, number of bounces and the first bounce peak. Gravity and Bounciness ' +
    'sliders change the motion. With Predict first on, changing a slider pauses the lab and ' +
    'asks whether the next bounce will be higher, lower or the same, then reveals the answer ' +
    'after the next drop.', LABEL);
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

  const g = gravitySlider.value();
  const b = bounceSlider.value();

  // Left column holds the ball; the right column holds the readout and prediction panel
  const panelX = floor(canvasWidth * (canvasWidth < 560 ? 0.42 : 0.46));
  ballX = floor(panelX * 0.62);

  // Advance the model only while running and not waiting for a prediction
  if (isRunning && !predictionPending && !atRest) {
    stepPhysics(g, b);
  }

  drawFloor(panelX);
  drawHeightMarkers(panelX);
  drawTrail();
  drawBall();

  // Title (drawn after the background elements)
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(22);
  text('Bouncing Ball Gravity Lab', canvasWidth / 2, 8);

  drawPanel(panelX, g, b);
  drawControlLabels(g, b);
}

// ---------- Physics ----------
function stepPhysics(g, b) {
  let t = 1; // one frame
  // Exact constant-acceleration step: h(t) = h + v t - g t^2 / 2
  let newHeight = ballHeight + velocity * t - 0.5 * g * t * t;
  if (newHeight <= 0) {
    // Time within this frame when the ball reaches the floor
    const tc = (velocity + Math.sqrt(velocity * velocity + 2 * g * ballHeight)) / g;
    const impactVelocity = velocity - g * tc;      // negative (downward)
    let rebound = -impactVelocity * b;             // upward speed after the bounce
    bounces++;
    if (rebound < restSpeed) {
      ballHeight = 0;
      velocity = 0;
      atRest = true;
      isRunning = false;
      startButton.html('Start');
    } else {
      const peak = (rebound * rebound) / (2 * g);  // exact height of this rebound
      if (bounces === 1) pendingPeak = peak;
      const tr = Math.max(0, t - tc);
      ballHeight = Math.max(0, rebound * tr - 0.5 * g * tr * tr);
      velocity = rebound - g * tr;
    }
  } else {
    const oldVelocity = velocity;
    ballHeight = newHeight;
    velocity = velocity - g * t;
    // The ball passed the top of its first rebound in this frame
    if (bounces === 1 && oldVelocity > 0 && velocity <= 0 && pendingPeak !== null) {
      firstPeak = pendingPeak;
      pendingPeak = null;
      if (awaitingReveal) revealPrediction();
    }
  }
  // Record the trail
  trail.push({ x: ballX, y: screenY() });
  if (trail.length > trailLength) trail.shift();
}

function screenY() {
  return (floorY - ballRadius) - ballHeight;
}

function resetBall() {
  ballHeight = dropHeight;
  velocity = 0;
  bounces = 0;
  atRest = false;
  firstPeak = null;
  pendingPeak = null;
  trail = [];
  dropGravity = gravitySlider.value();
  dropBounce = bounceSlider.value();
}

// ---------- Drawing helpers ----------
function drawFloor(panelX) {
  // A white floor line (a thin band with a silver outline) near the bottom of the drawing region
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(1, floorY, canvasWidth - 2, 9);
  noStroke();
  fill('dimgray');
  textAlign(CENTER, CENTER);
  textSize(13);
  text('floor', ballX, floorY + 19);
}

function drawHeightMarkers(panelX) {
  const left = 8;
  const right = panelX - 12;
  const roomForLabel = ballX - ballRadius - left - 6;   // keep labels clear of the ball
  textSize(13);
  // Drop height line
  drawDashedLine(left, startY + ballRadius, right, 'gray');
  noStroke();
  fill('dimgray');
  textAlign(LEFT, BOTTOM);
  text(fitLabel('drop height', 'drop', roomForLabel), left, startY + ballRadius - 3);

  // Reference peak (before the slider change) while predicting or revealing
  if ((predictionPending || awaitingReveal || resultMessage) && refBounce !== undefined) {
    const refPeak = refBounce * refBounce * dropHeight;
    const y = floorY - refPeak;
    drawDashedLine(left, y, right, 'mediumpurple');
    noStroke();
    fill('rebeccapurple');
    textAlign(LEFT, BOTTOM);
    text(fitLabel('before: ' + nf(refPeak, 0, 0) + ' px', 'before ' + nf(refPeak, 0, 0),
      roomForLabel), left, y - 3);
  }
  // First bounce peak of the current drop
  if (firstPeak !== null) {
    const y = floorY - firstPeak;
    drawDashedLine(left, y, right, 'orangered');
    noStroke();
    fill('firebrick');
    textAlign(LEFT, TOP);
    text(fitLabel('1st bounce: ' + nf(firstPeak, 0, 0) + ' px', '1st ' + nf(firstPeak, 0, 0),
      roomForLabel), left, y + 3);
  }
}

// Use the long label when it fits, otherwise the short one
function fitLabel(longText, shortText, room) {
  return textWidth(longText) <= room ? longText : shortText;
}

// Split text into lines that fit maxW at the current text size and style
function wrapLines(str, maxW) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (textWidth(test) > maxW && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Draw wrapped text starting at (x, y); returns the y below the last line
function drawWrapped(str, x, y, maxW, lineH) {
  textAlign(LEFT, TOP);
  for (const line of wrapLines(str, maxW)) {
    text(line, x, y);
    y += lineH;
  }
  return y;
}

function drawDashedLine(x1, y, x2, col) {
  stroke(col);
  strokeWeight(1.5);
  for (let x = x1; x < x2; x += 10) {
    line(x, y, Math.min(x + 5, x2), y);
  }
  strokeWeight(1);
}

function drawTrail() {
  noStroke();
  for (let i = 0; i < trail.length; i++) {
    const c = color('orangered');
    c.setAlpha(25 + 90 * (i / trail.length));
    fill(c);
    circle(trail[i].x, trail[i].y, 6);
  }
}

function drawBall() {
  stroke('darkred');
  strokeWeight(1);
  fill('orangered');
  circle(ballX, screenY(), ballRadius * 2);
  noStroke();
}

function drawPanel(panelX, g, b) {
  const x = panelX;
  const w = canvasWidth - panelX - 10;
  const innerW = w - 20;
  let y = 42;

  // Readout box
  stroke('silver');
  fill(255, 255, 255, 235);
  rect(x, y, w, 90, 10);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(15);
  const speed = Math.abs(velocity);
  text('Height: ' + nf(ballHeight, 0, 0) + ' px', x + 10, y + 7);
  text('Speed: ' + (atRest ? '0.0' : nf(speed, 0, 1)) + ' px/frame', x + 10, y + 27);
  text('Bounces: ' + bounces + (atRest ? '  (at rest)' : ''), x + 10, y + 47);
  const peakText = firstPeak === null ? '—' :
    nf(firstPeak, 0, 0) + ' px (' + nf(100 * firstPeak / dropHeight, 0, 0) + '%)';
  text('1st bounce: ' + peakText, x + 10, y + 67);

  // Prediction / result / instructions box
  y += 98;
  const boxH = floorY - 8 - y;
  let title, body, titleColor = 'black', borderColor = 'silver';
  if (predictionPending) {
    title = 'Predict first!';
    titleColor = 'rebeccapurple';
    borderColor = 'mediumpurple';
    body = describeChange() + ' Will the ball bounce higher, lower, or the same? ' +
      'Choose Higher, Lower or Same below.';
  } else if (awaitingReveal) {
    title = 'Your prediction: ' + prediction;
    titleColor = 'rebeccapurple';
    borderColor = 'mediumpurple';
    body = 'Press Start or Drop Again and watch the first bounce. ' +
      'The purple line marks the bounce before your change.';
  } else if (resultMessage) {
    title = resultMessage.title;
    titleColor = resultMessage.correct ? 'darkgreen' : 'firebrick';
    borderColor = resultMessage.correct ? 'seagreen' : 'indianred';
    body = resultMessage.detail;
  } else {
    title = 'How to use';
    body = predictCheckbox.checked() ?
      'Press Start to drop the ball. Then move a slider: you will be asked to predict ' +
      'the next bounce before you test it.' :
      'Press Start to drop the ball. Move the sliders at any time and watch how the ' +
      'fall and the bounces change.';
  }
  stroke(borderColor);
  strokeWeight(predictionPending ? 2 : 1);
  fill(255, 255, 255, 235);
  rect(x, y, w, boxH, 10);
  strokeWeight(1);
  noStroke();
  fill(titleColor);
  textStyle(BOLD);
  textSize(15);
  let ty = drawWrapped(title, x + 10, y + 8, innerW, 18);
  textStyle(NORMAL);
  fill('black');
  textSize(14);
  const bodyEnd = drawWrapped(body, x + 10, ty + 4, innerW, 17);

  // The model's two rules with the current slider values (shown when there is room)
  const ruleY = y + boxH - 58;
  if (bodyEnd > ruleY - 8) return;
  stroke('gainsboro');
  line(x + 10, ruleY - 6, x + w - 10, ruleY - 6);
  noStroke();
  fill('dimgray');
  textStyle(BOLD);
  textSize(13);
  textAlign(LEFT, TOP);
  text('The model', x + 10, ruleY);
  textStyle(NORMAL);
  fill('black');
  textSize(14);
  text('Every frame: speed + ' + nf(g, 0, 1), x + 10, ruleY + 18);
  text('At the floor: speed × ' + nf(b, 0, 2), x + 10, ruleY + 36);
}

function drawControlLabels(g, b) {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Gravity: ' + nf(g, 0, 1), 10, drawHeight + 50);
  text('Bounciness: ' + nf(b, 0, 2), 10, drawHeight + 80);
}

// ---------- Prediction logic ----------
function describeChange() {
  const g = gravitySlider.value();
  const b = bounceSlider.value();
  const parts = [];
  if (Math.abs(g - refGravity) > 1e-6) {
    parts.push('Gravity from ' + nf(refGravity, 0, 1) + ' to ' + nf(g, 0, 1));
  }
  if (Math.abs(b - refBounce) > 1e-6) {
    parts.push('Bounciness from ' + nf(refBounce, 0, 2) + ' to ' + nf(b, 0, 2));
  }
  if (parts.length === 0) return 'The sliders are back where they were.';
  return 'You changed ' + parts.join(' and ') + '.';
}

function onSliderChanged() {
  if (!predictCheckbox.checked()) return;     // free exploration: apply immediately
  if (!predictionPending) {
    // Compare the next drop with the settings of the current (or last) drop
    refGravity = dropGravity;
    refBounce = dropBounce;
    const g = gravitySlider.value();
    const b = bounceSlider.value();
    if (Math.abs(g - refGravity) < 1e-6 && Math.abs(b - refBounce) < 1e-6) return;
    predictionPending = true;
    awaitingReveal = false;
    resultMessage = null;
    isRunning = false;
    startButton.html('Start');
    showAnswerButtons(true);
  }
}

function answerPrediction(choice) {
  prediction = choice;
  predictionPending = false;
  awaitingReveal = true;
  showAnswerButtons(false);
  resetBall();                 // the next drop uses the new settings
}

function revealPrediction() {
  awaitingReveal = false;
  const before = refBounce * refBounce * dropHeight;
  const after = firstPeak;
  let actual = 'same';
  if (after > before * 1.03) actual = 'higher';
  else if (after < before * 0.97) actual = 'lower';
  const correct = (actual === prediction);
  const gChanged = Math.abs(dropGravity - refGravity) > 1e-6;
  const bChanged = Math.abs(dropBounce - refBounce) > 1e-6;

  let why = '';
  if (bChanged) {
    why += 'Bounciness is the fraction of speed kept at the floor, so the bounce reaches ' +
      nf(dropBounce, 0, 2) + '² = ' + nf(dropBounce * dropBounce, 0, 2) + ' of the drop ' +
      '(before ' + nf(refBounce * refBounce, 0, 2) + '). ';
  }
  if (gChanged) {
    why += (dropGravity > refGravity ? 'Stronger' : 'Weaker') +
      ' gravity changes how fast the ball falls and rebounds, not how high it bounces.';
  }
  resultMessage = {
    correct: correct,
    title: (correct ? 'Correct! ' : 'Not quite. ') + 'It bounced ' +
      (actual === 'same' ? 'the same.' : actual + '.'),
    detail: 'First bounce: ' + nf(after, 0, 0) + ' px (before: ' + nf(before, 0, 0) +
      ' px). ' + why
  };
}

function showAnswerButtons(show) {
  if (show) {
    startButton.hide();
    dropButton.hide();
    higherButton.show();
    lowerButton.show();
    sameButton.show();
  } else {
    higherButton.hide();
    lowerButton.hide();
    sameButton.hide();
    startButton.show();
    dropButton.show();
  }
}

function onPredictToggle() {
  if (!predictCheckbox.checked() && predictionPending) {
    // Turning prediction off cancels a pending question
    predictionPending = false;
    showAnswerButtons(false);
  }
  if (!predictCheckbox.checked()) {
    awaitingReveal = false;
    resultMessage = null;
  }
}

// ---------- Button handlers ----------
function toggleRunning() {
  if (atRest) {
    dropAgain();
    return;
  }
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}

function dropAgain() {
  if (!awaitingReveal) resultMessage = null;
  resetBall();
  isRunning = true;
  startButton.html('Pause');
}

// ---------- Responsive design ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  gravitySlider.size(canvasWidth - sliderLeftMargin - margin);
  bounceSlider.size(canvasWidth - sliderLeftMargin - margin);
  // keep the trail aligned with the (moved) ball column
  trail = [];
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.max(300, Math.floor(container.getBoundingClientRect().width));
  }
}
