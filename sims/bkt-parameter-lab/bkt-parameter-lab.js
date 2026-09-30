// BKT Parameter Lab - calculate the mastery estimate after each answer with Bayesian knowledge tracing
// CANVAS_HEIGHT: 770
// Learning objective (Apply / calculate): the learner calculates the mastery estimate after each
// answer in a sequence by choosing the four BKT parameters, and judges when the estimate first
// reaches a chosen mastery threshold (Chapter 18, "Bayesian Knowledge Tracing").
// Standard BKT, computed live for every attempt (nothing is pre-baked):
//   conditioning  P(L|correct)   = P(L)(1-p_s) / (P(L)(1-p_s) + (1-P(L)) p_g)
//                 P(L|incorrect) = P(L) p_s     / (P(L) p_s + (1-P(L))(1-p_g))
//   learning      P(L_next)      = P(L|obs) + (1 - P(L|obs)) p_t
// Default sequence correct, incorrect, correct, correct gives 0.71, 0.35, 0.75, 0.94 (the chapter's table).

// ---------- Canvas dimensions ----------
// Fixed total height; the drawing/control split is recomputed when the control rows wrap.
let canvasWidth = 800;
let canvasHeight = 770;
let controlHeight = 150;
let drawHeight = canvasHeight - controlHeight;
let margin = 12;
let sliderLeftMargin = 215;
let defaultTextSize = 16;

// Okabe-Ito color-blind-safe colors (RGB)
const C_LINE = [0, 114, 178];          // blue: the estimate
const C_RIGHT = [0, 158, 115];         // bluish green: correct tile
const C_WRONG = [213, 94, 0];          // vermillion: incorrect tile
const C_THRESH = [204, 121, 167];      // reddish purple: threshold line
const C_COND = [230, 159, 0];          // orange: after-conditioning value

const DEFAULTS = { pL0: 0.30, pT: 0.15, pG: 0.20, pS: 0.10, thr: 0.95 };
const DEFAULT_SEQ = [true, false, true, true];
const MAX_ATTEMPTS = 20;

// ---------- State ----------
let seq = DEFAULT_SEQ.slice();
let selected = DEFAULT_SEQ.length;     // attempt shown in the intermediate-numbers panel (1-based)
let trace = [];                        // computed each frame
let pointRects = [];
let tileRects = [];
let hoverPoint = -1;
let lastTip = '';

// controls
let l0Slider, tSlider, gSlider, sSlider, thrSlider;
let addRightButton, addWrongButton, resetButton, showBox;
let sliders = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('sans-serif');
  const main = document.querySelector('main');

  l0Slider = createSlider(0, 1, DEFAULTS.pL0, 0.01);
  tSlider = createSlider(0, 1, DEFAULTS.pT, 0.01);
  gSlider = createSlider(0, 1, DEFAULTS.pG, 0.01);
  sSlider = createSlider(0, 1, DEFAULTS.pS, 0.01);
  thrSlider = createSlider(0, 1, DEFAULTS.thr, 0.01);
  sliders = [
    { el: l0Slider, label: 'Initial knowledge P(L0)' },
    { el: tSlider, label: 'Learning rate p_t' },
    { el: gSlider, label: 'Guess p_g' },
    { el: sSlider, label: 'Slip p_s' },
    { el: thrSlider, label: 'Mastery threshold' }
  ];
  addRightButton = createButton('Add correct');
  addRightButton.mousePressed(() => addAttempt(true));
  addWrongButton = createButton('Add incorrect');
  addWrongButton.mousePressed(() => addAttempt(false));
  resetButton = createButton('Reset');
  resetButton.mousePressed(resetAll);
  showBox = createCheckbox('Show intermediate numbers', false);
  for (const c of [l0Slider, tSlider, gSlider, sSlider, thrSlider, addRightButton, addWrongButton, resetButton, showBox]) c.parent(main);
  layoutControls();

  describe('BKT Parameter Lab. A line chart shows the Bayesian knowledge tracing estimate P(L) from 0 to 1 ' +
    'after each attempt, with a dashed mastery-threshold line. Below it, one tile per attempt shows correct ' +
    'or incorrect; clicking a tile flips it. Sliders set initial knowledge, learning rate, guess, slip and the ' +
    'threshold. The default sequence correct, incorrect, correct, correct gives 0.71, 0.35, 0.75 and 0.94. ' +
    'A panel states when the estimate first reaches the threshold and can show the conditioning and learning-step numbers.');
}

// ---------- BKT ----------
function bktTrace() {
  const p = { pL0: l0Slider.value(), pT: tSlider.value(), pG: gSlider.value(), pS: sSlider.value() };
  const out = [{ n: 0, value: p.pL0 }];
  let pl = p.pL0;
  seq.forEach((correct, i) => {
    const num = correct ? pl * (1 - p.pS) : pl * p.pS;
    const den = correct ? pl * (1 - p.pS) + (1 - pl) * p.pG : pl * p.pS + (1 - pl) * (1 - p.pG);
    const impossible = den < 1e-12;              // the observation cannot happen under these parameters
    const cond = impossible ? pl : num / den;
    const after = cond + (1 - cond) * p.pT;
    out.push({ n: i + 1, correct, before: pl, num, den, cond, value: after, impossible });
    pl = after;
  });
  return { params: p, points: out };
}

// ---------- Actions ----------
function addAttempt(correct) {
  if (seq.length >= MAX_ATTEMPTS) return;
  seq.push(correct);
  selected = seq.length;
  updateButtons();
}

function flipTile(k) {
  seq[k - 1] = !seq[k - 1];
  selected = k;
}

function resetAll() {
  seq = DEFAULT_SEQ.slice();
  selected = seq.length;
  l0Slider.value(DEFAULTS.pL0);
  tSlider.value(DEFAULTS.pT);
  gSlider.value(DEFAULTS.pG);
  sSlider.value(DEFAULTS.pS);
  thrSlider.value(DEFAULTS.thr);
  showBox.checked(false);
  updateButtons();
}

function updateButtons() {
  for (const b of [addRightButton, addWrongButton]) {
    if (seq.length >= MAX_ATTEMPTS) b.attribute('disabled', ''); else b.removeAttribute('disabled');
  }
}

// ---------- Layout ----------
function narrow() { return canvasWidth < 560; }

function layoutControls() {
  const rowH = 32;
  for (const c of [addRightButton, addWrongButton, resetButton, showBox]) if (c.elt.style.position !== 'absolute') c.position(0, drawHeight);
  const twoCol = !narrow();
  const sliderRows = twoCol ? 3 : 5;
  // button row(s)
  const btns = [addRightButton, addWrongButton, resetButton, showBox];
  let x = 10, row = 0;
  const bpos = [];
  for (const b of btns) {
    const w = b.elt.offsetWidth || 100;
    if (x > 10 && x + w > canvasWidth - 10) { row++; x = 10; }
    bpos.push([x, row]);
    x += w + 10;
  }
  const btnRows = row + 1;
  controlHeight = sliderRows * rowH + btnRows * 36 + 16;
  drawHeight = canvasHeight - controlHeight;
  const colW = twoCol ? (canvasWidth - 20) / 2 : canvasWidth - 20;
  sliders.forEach((s, i) => {
    const col = twoCol ? (i < 3 ? 0 : 1) : 0;
    const r = twoCol ? (i < 3 ? i : i - 3) : i;
    s.x = 10 + col * colW;
    s.y = drawHeight + 10 + r * rowH;
    const sx = s.x + (twoCol ? 200 : sliderLeftMargin - 10);
    s.el.position(sx, s.y);
    s.el.size(max(60, s.x + colW - sx - 12));
  });
  const by = drawHeight + 12 + sliderRows * rowH;
  btns.forEach((b, i) => b.position(bpos[i][0], by + bpos[i][1] * 36 + (b === showBox ? 3 : 0)));
}

// ---------- Drawing ----------
function draw() {
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  trace = bktTrace();
  selected = constrain(selected, 1, max(1, seq.length));

  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(narrow() ? 19 : 22);
  text('BKT Parameter Lab', margin, 9);
  textStyle(NORMAL);

  const infoH = narrow() ? 196 : 164;
  const tilesPerRow = narrow() ? max(1, floor((canvasWidth - 2 * margin - 70) / 32)) : MAX_ATTEMPTS;
  const tileRows = max(1, ceil(max(seq.length, 1) / tilesPerRow));
  const tilesH = tileRows * 32 + 8;
  const chart = { x: margin, y: 40, w: canvasWidth - 2 * margin, h: drawHeight - 40 - 8 - infoH - 8 - tilesH - 6 };
  drawChart(chart);
  drawTiles({ x: margin, y: chart.y + chart.h + 6, w: canvasWidth - 2 * margin, h: tilesH }, tilesPerRow);
  drawInfo({ x: margin, y: drawHeight - 8 - infoH, w: canvasWidth - 2 * margin, h: infoH });
  drawSliderLabels();
  drawTooltip();
}

function drawChart(r) {
  stroke('silver');
  fill('white');
  rect(r.x, r.y, r.w, r.h, 8);
  const L = r.x + 46, R = r.x + r.w - 18, T = r.y + 22, B = r.y + r.h - 30;
  const maxN = max(seq.length, 6);
  const X = n => L + n / maxN * (R - L);
  const Y = v => B - v * (B - T);
  // grid and axes
  textSize(11);
  for (let v = 0; v <= 1.0001; v += 0.25) {
    stroke('gainsboro');
    line(L, Y(v), R, Y(v));
    noStroke();
    fill('dimgray');
    textAlign(RIGHT, CENTER);
    text(nf(v, 1, 2), L - 6, Y(v));
  }
  textAlign(CENTER, TOP);
  for (let n = 0; n <= maxN; n++) {
    noStroke();
    fill('dimgray');
    text(n, X(n), B + 4);
  }
  text('attempt number', (L + R) / 2, B + 16);
  push();
  translate(r.x + 12, (T + B) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  fill('dimgray');
  text('estimate P(L)', 0, 0);
  pop();
  stroke('gray');
  line(L, B, R, B);
  line(L, T, L, B);

  // threshold
  const thr = thrSlider.value();
  stroke(C_THRESH);
  strokeWeight(2);
  drawingContext.setLineDash([7, 5]);
  line(L, Y(thr), R, Y(thr));
  drawingContext.setLineDash([]);
  strokeWeight(1);
  noStroke();
  fill([150, 60, 110]);
  textAlign(LEFT, thr > 0.9 ? TOP : BOTTOM);
  textSize(11.5);
  text('threshold ' + nf(thr, 1, 2), L + 18, thr > 0.9 ? Y(thr) + 3 : Y(thr) - 2);

  const pts = trace.points;
  // conditioning points and learning-step segments
  if (showBox.checked()) {
    for (const p of pts.slice(1)) {
      stroke(C_COND);
      strokeWeight(2);
      line(X(p.n), Y(p.cond), X(p.n), Y(p.value));
      strokeWeight(1);
      noStroke();
      fill('white');
      stroke(C_COND);
      circle(X(p.n), Y(p.cond), 8);
    }
  }
  // estimate line
  stroke(C_LINE);
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (const p of pts) vertex(X(p.n), Y(p.value));
  endShape();
  strokeWeight(1);

  // first attempt at or above the threshold
  const first = pts.slice(1).find(p => p.value >= thr);
  if (first) {
    stroke([150, 60, 110]);
    drawingContext.setLineDash([3, 4]);
    line(X(first.n), Y(first.value), X(first.n), B);
    drawingContext.setLineDash([]);
    noFill();
    strokeWeight(2);
    circle(X(first.n), Y(first.value), 18);
    strokeWeight(1);
  }

  // points and value labels
  pointRects = [];
  hoverPoint = -1;
  pts.forEach((p, i) => {
    const px = X(p.n), py = Y(p.value);
    const over = dist(mouseX, mouseY, px, py) < 9;
    if (over) hoverPoint = i;
    stroke('white');
    fill(i === 0 ? 'gray' : C_LINE);
    circle(px, py, over || p.n === selected ? 13 : 10);
    if (p.n === selected && i > 0) { noFill(); stroke('black'); circle(px, py, 16); }
    noStroke();
    if (maxN <= 14 || i === pts.length - 1) {
      fill('black');
      textSize(11.5);
      textAlign(i === 0 ? LEFT : CENTER, BOTTOM);
      text(nf(p.value, 1, 2), px + (i === 0 ? 7 : 0), py - 8);
    }
    pointRects.push({ n: p.n, x: px, y: py });
  });
  textAlign(LEFT, TOP);
}

function drawTiles(r, perRow) {
  tileRects = [];
  noStroke();
  fill('black');
  textSize(12.5);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text('Answers:', r.x, r.y + 16);
  textStyle(NORMAL);
  const x0 = r.x + 66;
  seq.forEach((c, i) => {
    const row = floor(i / perRow), col = i % perRow;
    const x = x0 + col * 32, y = r.y + 4 + row * 32;
    stroke(i + 1 === selected ? 'black' : 'white');
    strokeWeight(i + 1 === selected ? 2.5 : 1);
    fill(c ? C_RIGHT : C_WRONG);
    rect(x, y, 26, 26, 4);
    strokeWeight(1);
    noStroke();
    fill('white');
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(13);
    text(c ? '✓' : '✗', x + 13, y + 11);
    textSize(8.5);
    textStyle(NORMAL);
    text(i + 1, x + 13, y + 22);
    tileRects.push({ n: i + 1, x, y, w: 26, h: 26 });
  });
  textAlign(LEFT, TOP);
  if (!narrow()) {
    fill('dimgray');
    textSize(11.5);
    const tx = x0 + min(seq.length, perRow) * 32 + 8;
    text('click a tile to flip it; click a point to select it', tx, r.y + 11);
  }
}

function drawInfo(r) {
  stroke('silver');
  fill(255, 255, 255, 240);
  rect(r.x, r.y, r.w, r.h, 10);
  noStroke();
  const tx = r.x + 12, tw = r.w - 24;
  const fs = narrow() ? 12.5 : 14.5, lh = narrow() ? 16 : 19;
  let y = r.y + 9;
  textAlign(LEFT, TOP);
  const pts = trace.points;
  const thr = thrSlider.value();
  const first = pts.slice(1).find(p => p.value >= thr);
  textSize(fs);
  textStyle(BOLD);
  fill([150, 60, 110]);
  y = drawWrapped(first
    ? 'Threshold ' + nf(thr, 1, 2) + ': first reached after attempt ' + first.n + ' (P(L) = ' + nf(first.value, 1, 3) + ').'
    : 'Threshold ' + nf(thr, 1, 2) + ': not reached in ' + seq.length + ' attempt' + (seq.length === 1 ? '' : 's') +
      (seq.length ? ' (last P(L) = ' + nf(pts[pts.length - 1].value, 1, 3) + ').' : '.'), tx, y, tw, lh) + 2;
  textStyle(NORMAL);
  fill('black');
  const est = pts.slice(1).map(p => nf(p.value, 1, 2)).join(', ');
  y = drawWrapped('Estimates after each attempt: ' + (est || 'none yet'), tx, y, tw, lh) + 4;
  const { pG, pS } = trace.params;
  if (pG + pS >= 1) {
    fill(C_WRONG);
    y = drawWrapped('Warning: guess + slip >= 1, so conditioning on a correct answer no longer raises the estimate (only the learning step does). BKT assumes p_g + p_s < 1.', tx, y, tw, lh) + 4;
  }
  if (!seq.length) return;
  const p = pts[selected];
  fill('black');
  if (!showBox.checked()) {
    fill('dimgray');
    drawWrapped('Check "Show intermediate numbers" to see the conditioning and learning-step values for attempt ' + selected +
      ' (select another attempt by clicking its point, or with the arrow keys).', tx, y, tw, lh);
    return;
  }
  textStyle(BOLD);
  y = drawWrapped('Attempt ' + p.n + ' (' + (p.correct ? 'correct' : 'incorrect') + '), starting from P(L' + (p.n - 1) + ') = ' + nf(p.before, 1, 3), tx, y, tw, lh);
  textStyle(NORMAL);
  const b = p.before;
  const condTxt = p.impossible
    ? 'Conditioning: undefined (this answer is impossible under these parameters), so the estimate is left at ' + nf(b, 1, 3)
    : p.correct
      ? 'Conditioning: ' + nf(b, 1, 3) + ' x ' + nf(1 - pS, 1, 2) + ' / (' + nf(b, 1, 3) + ' x ' + nf(1 - pS, 1, 2) + ' + ' + nf(1 - b, 1, 3) + ' x ' + nf(pG, 1, 2) + ') = ' + nf(p.num, 1, 3) + ' / ' + nf(p.den, 1, 3) + ' = ' + nf(p.cond, 1, 3)
      : 'Conditioning: ' + nf(b, 1, 3) + ' x ' + nf(pS, 1, 2) + ' / (' + nf(b, 1, 3) + ' x ' + nf(pS, 1, 2) + ' + ' + nf(1 - b, 1, 3) + ' x ' + nf(1 - pG, 1, 2) + ') = ' + nf(p.num, 1, 3) + ' / ' + nf(p.den, 1, 3) + ' = ' + nf(p.cond, 1, 3);
  fill([150, 100, 0]);
  y = drawWrapped(condTxt, tx, y, tw, lh);
  fill(C_LINE);
  drawWrapped('Learning step: ' + nf(p.cond, 1, 3) + ' + (1 - ' + nf(p.cond, 1, 3) + ') x ' + nf(trace.params.pT, 1, 2) + ' = ' + nf(p.value, 1, 3), tx, y, tw, lh);
}

function drawSliderLabels() {
  const vals = [l0Slider.value(), tSlider.value(), gSlider.value(), sSlider.value(), thrSlider.value()];
  const defs = [DEFAULTS.pL0, DEFAULTS.pT, DEFAULTS.pG, DEFAULTS.pS, DEFAULTS.thr];
  noStroke();
  textAlign(LEFT, CENTER);
  sliders.forEach((s, i) => {
    textSize(narrow() ? 13 : 14);
    textStyle(BOLD);
    fill('black');
    const lab = s.label + ': ';
    text(lab, s.x, s.y + 10);
    fill(abs(vals[i] - defs[i]) < 1e-9 ? 'black' : [185, 70, 0]);
    text(nf(vals[i], 1, 2), s.x + textWidth(lab), s.y + 10);
    textStyle(NORMAL);
  });
  textAlign(LEFT, TOP);
}

function drawTooltip() {
  if (hoverPoint < 0) { lastTip = ''; return; }
  const p = trace.points[hoverPoint];
  const tip = p.n === 0
    ? 'Start: P(L0) = ' + nf(p.value, 1, 2) + ', before any evidence'
    : 'Attempt ' + p.n + ': ' + (p.correct ? 'correct' : 'incorrect') + ', P(L' + p.n + ') = ' + nf(p.value, 1, 2);
  if (tip !== lastTip) { console.log('[bkt-parameter-lab] tooltip: ' + tip); lastTip = tip; }
  textSize(13);
  const w = textWidth(tip) + 16;
  const pr = pointRects[hoverPoint];
  const x = constrain(pr.x - w / 2, margin, canvasWidth - margin - w);
  const y = pr.y + 14;
  stroke('dimgray');
  fill(255, 255, 240, 250);
  rect(x, y, w, 24, 5);
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  text(tip, x + 8, y + 12);
  textAlign(LEFT, TOP);
}

// ---------- Text helpers ----------
function wrapWords(s, w) {
  const words = String(s).split(' ');
  const lines = [];
  let line = '';
  for (const wd of words) {
    const test = line ? line + ' ' + wd : wd;
    if (textWidth(test) > w && line) { lines.push(line); line = wd; } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function drawWrapped(s, x, y, w, lh) {
  for (const l of wrapWords(s, w)) { text(l, x, y); y += lh; }
  return y;
}

// ---------- Mouse and keyboard ----------
function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight) return;
  for (const t of tileRects) {
    if (mouseX >= t.x && mouseX <= t.x + t.w && mouseY >= t.y && mouseY <= t.y + t.h) { flipTile(t.n); return; }
  }
  for (const p of pointRects) {
    if (p.n > 0 && dist(mouseX, mouseY, p.x, p.y) < 10) { selected = p.n; return; }
  }
}

function keyPressed() {
  const tag = document.activeElement ? document.activeElement.tagName : '';
  if (tag === 'INPUT' || tag === 'SELECT') return;
  if (key === 'ArrowLeft') selected = max(1, selected - 1);
  else if (key === 'ArrowRight') selected = min(seq.length, selected + 1);
  else if (key === 'f' || key === 'F') { if (seq.length) flipTile(selected); }
}

// ---------- Responsive ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  layoutControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = max(320, container.offsetWidth);
}
