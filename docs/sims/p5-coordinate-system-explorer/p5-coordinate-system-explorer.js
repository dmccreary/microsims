// Coordinate System Explorer
// CANVAS_HEIGHT: 515
// Learners read mouseX and mouseY on a labeled pixel grid, place markers, and
// solve challenges that need the y flip used when plotting a value:
//   y = map(heightMeters, 0, scaleMax, drawHeight, 0)
// After each answer the sim draws the correct point and shows the map() call
// with the numbers filled in. drawHeight is 400 so the arithmetic stays clean.

// ---------- layout globals ----------
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 115;             // three rows of controls
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 190;
let defaultTextSize = 16;
let gridStep = 50;                   // grid spacing in pixels

// ---------- model state ----------
let markers = [];                    // placed markers {x, y}
let challenge = null;                // {x, h, answered, clickX, clickY}
let tolerance = 12;                  // pixels counted as correct
let challengesDone = 0;
let challengesCorrect = 0;
let pointerInside = false;           // true while the pointer is over the canvas

// ---------- controls ----------
let challengeButton, clearButton, axesCheckbox, scaleSlider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  canvas.mouseOver(() => { pointerInside = true; });
  canvas.mouseOut(() => { pointerInside = false; });
  textSize(defaultTextSize);

  challengeButton = createButton('Challenge');
  challengeButton.parent(document.querySelector('main'));
  challengeButton.mousePressed(newChallenge);

  clearButton = createButton('Clear markers');
  clearButton.parent(document.querySelector('main'));
  clearButton.mousePressed(clearMarkers);

  axesCheckbox = createCheckbox('Show origin and axes directions', true);
  axesCheckbox.parent(document.querySelector('main'));
  axesCheckbox.style('white-space', 'nowrap');

  scaleSlider = createSlider(5, 20, 10, 1);
  scaleSlider.parent(document.querySelector('main'));

  positionControls();

  describe('An aliceblue drawing region with a light grid every 50 pixels, labeled with pixel coordinates ' +
    'from the top-left origin. A readout next to the pointer shows mouseX and mouseY. Clicking places a ' +
    'marker. The Challenge button asks for a point at a given height on a meter scale; after the click the ' +
    'correct point and the map() call that computes it are shown.', LABEL);
}

function draw() {
  updateCanvasSize();

  // Drawing and control regions
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawGrid();
  if (axesCheckbox.checked()) drawAxesDirections();
  if (challenge) drawChallengeGuides();
  drawMarkers();
  drawInfoPanel();
  drawPointerReadout();
  drawControlLabels();
}

// Light grid every 50 pixels with pixel labels along the top and left edges
function drawGrid() {
  stroke('lightsteelblue');
  strokeWeight(1);
  for (let x = gridStep; x < canvasWidth; x += gridStep) line(x, 0, x, drawHeight);
  for (let y = gridStep; y < drawHeight; y += gridStep) line(0, y, canvasWidth, y);
  noStroke();
  fill('slategray');
  textSize(13);
  textAlign(LEFT, TOP);
  for (let x = gridStep; x < canvasWidth - 20; x += gridStep) text(x, x + 3, 3);
  for (let y = gridStep; y < drawHeight; y += gridStep) text(y, 3, y + 3);
  text('0', 3, 3);
}

// Arrows from the top-left origin
function drawAxesDirections() {
  const ox = 8, oy = 8;
  stroke('darkorange');
  strokeWeight(3);
  fill('darkorange');
  arrow(ox, oy, ox + 140, oy + 0);
  arrow(ox, oy, ox, oy + 140);
  noStroke();
  fill('darkorange');
  circle(ox, oy, 10);
  textSize(15);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  // Labels on small white boxes so the grid numbers do not show through
  const labels = [['x grows right', ox + 56, oy + 10], ['y grows down', ox + 10, oy + 112],
    ['origin (0, 0)', ox + 12, oy + 34]];
  for (const [t, lx, ly] of labels) {
    fill(255, 255, 255, 220);
    rect(lx - 3, ly - 2, fontWidth(t) + 6, 20, 3);
    fill('darkorange');
    text(t, lx, ly);
  }
  textStyle(NORMAL);
}

function arrow(x1, y1, x2, y2) {
  line(x1, y1, x2, y2);
  const a = atan2(y2 - y1, x2 - x1);
  push();
  translate(x2, y2);
  rotate(a);
  noStroke();
  triangle(0, 0, -12, -6, -12, 6);
  pop();
}

// Dashed target line, and after an answer the correct point and meter ruler
function drawChallengeGuides() {
  const cx = challengeX();
  stroke('mediumpurple');
  strokeWeight(2);
  drawingContext.setLineDash([6, 5]);
  line(cx, 0, cx, drawHeight);
  drawingContext.setLineDash([]);
  noStroke();
  fill('mediumpurple');
  textSize(14);
  textAlign(LEFT, BOTTOM);
  text('x = ' + cx, cx + 4, drawHeight - 4);

  if (challenge.answered) {
    const ty = targetY();
    const maxM = scaleSlider.value();
    // Meter ruler along the dashed line
    stroke('seagreen');
    strokeWeight(1);
    const every = maxM <= 10 ? 1 : 2;
    for (let m = 0; m <= maxM; m += every) {
      const y = map(m, 0, maxM, drawHeight, 0);
      line(cx - 6, y, cx + 6, y);
    }
    noStroke();
    fill('seagreen');
    textSize(13);
    textAlign(RIGHT, CENTER);
    text('0 m', cx - 8, drawHeight - 8);
    text(maxM + ' m', cx - 8, 26);
    // Correct point
    stroke('seagreen');
    strokeWeight(2);
    noFill();
    circle(cx, ty, 22);
    line(cx - 14, ty, cx + 14, ty);
    noStroke();
    fill('seagreen');
    circle(cx, ty, 8);
    textAlign(RIGHT, CENTER);
    textStyle(BOLD);
    textSize(14);
    text(challenge.h + ' m', cx - 16, ty - 14);
    textStyle(NORMAL);
    // The learner's click
    stroke('firebrick');
    strokeWeight(2);
    line(challenge.clickX - 7, challenge.clickY - 7, challenge.clickX + 7, challenge.clickY + 7);
    line(challenge.clickX - 7, challenge.clickY + 7, challenge.clickX + 7, challenge.clickY - 7);
  }
}

function drawMarkers() {
  for (let i = 0; i < markers.length; i++) {
    const m = markers[i];
    stroke('white');
    strokeWeight(1);
    fill('steelblue');
    circle(m.x, m.y, 10);
    noStroke();
    fill('steelblue');
    textSize(13);
    textAlign(LEFT, BOTTOM);
    text('(' + m.x + ', ' + m.y + ')', m.x + 7, m.y - 3);
  }
}

// Instructions, the challenge, or the result with the filled-in map() call
function drawInfoPanel() {
  const narrow = canvasWidth < 560;
  const w = narrow ? canvasWidth - 20 : min(360, floor(canvasWidth * 0.46));
  let lines = [];                    // {t, color, bold, mono}
  lines.push({ t: 'Coordinate System Explorer', bold: true, size: 17 });
  const maxM = scaleSlider.value();
  if (challenge && !challenge.answered) {
    lines.push({ t: 'Challenge: click the point on the dashed line x = ' + challengeX() + ' that is ' +
      challenge.h + ' meters high on a 0 to ' + maxM + ' meter scale.', color: 'black' });
    lines.push({ t: 'The scale runs from 0 m at the bottom of the drawing region (y = ' + drawHeight +
      ') to ' + maxM + ' m at the top (y = 0). Calculate y first, then click.', color: 'dimgray' });
  } else if (challenge && challenge.answered) {
    const ty = targetY();
    const err = round(dist(challenge.clickX, challenge.clickY, challengeX(), ty));
    const ok = err <= tolerance;
    lines.push({ t: 'Target (' + challengeX() + ', ' + round(ty) + '); you clicked (' + challenge.clickX + ', ' +
      challenge.clickY + ').', color: 'black' });
    lines.push({ t: ok ? 'Off by ' + err + ' px: correct!' : 'Off by ' + err + ' px: not quite.',
      color: ok ? 'seagreen' : 'firebrick', bold: true });
    lines.push({ t: 'y = map(' + challenge.h + ', 0, ' + maxM + ', ' + drawHeight + ', 0)', mono: true });
    lines.push({ t: '  = ' + drawHeight + ' - ' + challenge.h + '/' + maxM + ' * ' + drawHeight + ' = ' +
      nf(ty, 0, ty % 1 === 0 ? 0 : 1), mono: true });
    const flipped = map(challenge.h, 0, maxM, 0, drawHeight);
    if (!ok && abs(challenge.clickY - flipped) <= tolerance) {
      lines.push({ t: 'Your click matches map(' + challenge.h + ', 0, ' + maxM + ', 0, ' + drawHeight + ') = ' +
        round(flipped) + ': the y flip is missing, so ' + challenge.h + ' m landed near the top.', color: 'firebrick' });
    } else if (!ok) {
      lines.push({ t: 'Larger y is lower on the screen, so 0 m is at y = ' + drawHeight + '.', color: 'dimgray' });
    }
  } else {
    lines.push({ t: 'Move the pointer to read mouseX and mouseY. Click to place a marker. Press Challenge to ' +
      'practice the y flip.', color: 'dimgray' });
    if (markers.length > 0) {
      const recent = markers.slice(-4).map(m => '(' + m.x + ', ' + m.y + ')').join('  ');
      lines.push({ t: 'Markers: ' + recent, color: 'steelblue' });
    }
  }
  if (narrow && challengesDone > 0) {
    lines.push({ t: 'Challenges correct: ' + challengesCorrect + ' of ' + challengesDone, color: 'dimgray' });
  }

  // Measure the wrapped lines to size the panel
  const rows = [];
  for (const ln of lines) {
    textSize(ln.size || 15);
    textStyle(ln.bold ? BOLD : NORMAL);
    if (ln.mono) textFont('monospace');
    const pieces = ln.mono ? [ln.t] : wrapLines(ln.t, w - 20);
    for (const p of pieces) rows.push({ t: p, color: ln.color || 'black', bold: ln.bold, mono: ln.mono, size: ln.size || 15 });
    textFont('sans-serif');
  }
  textStyle(NORMAL);
  const h = rows.reduce((s, r) => s + r.size + 5, 0) + 14;

  // Place the panel away from the target
  let x, y;
  if (!narrow) {
    const cx = challenge ? challengeX() : 0;
    x = (challenge && cx > canvasWidth / 2) ? 36 : canvasWidth - w - 12;
    y = 24;
    // Keep clear of the origin arrows when they are shown
    if (x < canvasWidth / 2 && axesCheckbox.checked()) y = drawHeight - h - 12;
  } else {
    x = 10;
    y = (challenge && challenge.answered === false && challenge.h / scaleSlider.value() > 0.5) ||
        (challenge && challenge.answered && targetY() < drawHeight / 2) ? drawHeight - h - 10 : 24;
  }
  fill(255, 255, 255, 235);
  stroke(200);
  rect(x, y, w, h, 10);
  noStroke();
  let ty = y + 8;
  textAlign(LEFT, TOP);
  for (const r of rows) {
    textSize(r.size);
    textStyle(r.bold ? BOLD : NORMAL);
    if (r.mono) textFont('monospace');
    fill(r.color);
    text(r.t, x + 10, ty);
    textFont('sans-serif');
    ty += r.size + 5;
  }
  textStyle(NORMAL);
}

// Readout of mouseX and mouseY next to the pointer
function drawPointerReadout() {
  if (!pointerInside) return;
  if (mouseX < 0 || mouseX > canvasWidth || mouseY < 0 || mouseY > drawHeight) return;
  const mx = round(mouseX), my = round(mouseY);
  stroke('black');
  strokeWeight(1);
  line(mx - 6, my, mx + 6, my);
  line(mx, my - 6, mx, my + 6);
  const label = 'mouseX: ' + mx + ', mouseY: ' + my;
  textSize(14);
  const w = fontWidth(label) + 12;
  let bx = mx + 12, by = my + 10;
  if (bx + w > canvasWidth - 4) bx = mx - w - 12;
  if (by + 24 > drawHeight - 2) by = my - 32;
  noStroke();
  fill(255, 255, 224, 240);
  rect(bx, by, w, 22, 4);
  fill('black');
  textAlign(LEFT, CENTER);
  text(label, bx + 6, by + 11);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Scale maximum (m): ' + scaleSlider.value(), 10, drawHeight + 58);
  if (canvasWidth >= 560 && challengesDone > 0) {
    fill('dimgray');
    textSize(15);
    text('Challenges correct: ' + challengesCorrect + ' of ' + challengesDone, 10, drawHeight + 94);
  }
}

// ---------- challenge helpers ----------
function challengeX() {
  // Keep the target line on the grid and inside the current width
  const maxX = floor((canvasWidth - 60) / gridStep) * gridStep;
  return constrain(challenge.x, 100, max(100, maxX));
}

function targetY() {
  return map(challenge.h, 0, scaleSlider.value(), drawHeight, 0);
}

function newChallenge() {
  const maxM = scaleSlider.value();
  const maxX = floor((canvasWidth - 60) / gridStep) * gridStep;
  let h;
  do {
    h = floor(random(1, maxM));      // whole meters, 1 to max - 1
  } while (challenge && h === challenge.h && maxM > 2);
  challenge = { x: gridStep * floor(random(2, maxX / gridStep + 1)), h: h, answered: false };
}

function clearMarkers() {
  markers = [];
  challenge = null;
}

// ---------- helpers ----------
function wrapLines(str, maxW) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (fontWidth(test) <= maxW || !line) {
      line = test;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// ---------- events ----------
function mousePressed() {
  // Only clicks inside the drawing region count
  if (mouseX < 0 || mouseX > canvasWidth || mouseY < 0 || mouseY > drawHeight) return;
  const p = { x: round(mouseX), y: round(mouseY) };
  markers.push(p);
  if (markers.length > 20) markers.shift();
  if (challenge && !challenge.answered) {
    challenge.answered = true;
    challenge.clickX = p.x;
    challenge.clickY = p.y;
    challengesDone++;
    if (dist(p.x, p.y, challengeX(), targetY()) <= tolerance) challengesCorrect++;
  }
}

function positionControls() {
  challengeButton.position(10, drawHeight + 8);
  clearButton.position(10 + challengeButton.elt.offsetWidth + 10, drawHeight + 8);
  const cbX = 10 + challengeButton.elt.offsetWidth + clearButton.elt.offsetWidth + 30;
  axesCheckbox.position(cbX, drawHeight + 10);
  if (cbX + axesCheckbox.elt.offsetWidth > canvasWidth - 10) {
    axesCheckbox.position(10, drawHeight + 82);   // third row on narrow screens
  }
  scaleSlider.position(sliderLeftMargin, drawHeight + 48);
  scaleSlider.size(canvasWidth - sliderLeftMargin - margin);
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
