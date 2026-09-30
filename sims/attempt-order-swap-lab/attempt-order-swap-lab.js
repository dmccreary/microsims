// Attempt Order Swap Lab - p5.js MicroSim
// CANVAS_HEIGHT: 600
// Compares the Bayesian knowledge tracing (BKT) mastery estimate produced by two
// orderings of the same answers. Drag the tiles to reorder a row; every estimate is
// recomputed live from the two-step BKT update of Chapter 18 (condition, then learn).
// A success-count-only model is shown for contrast: it ignores order completely.
// Colors follow the Okabe-Ito color-blind-safe palette, and each tile also carries a
// check or cross glyph so correctness never depends on color alone.

// ---------- canvas layout (drawHeight is recomputed when the controls wrap) ----------
let canvasWidth = 400;
let canvasHeight = 600;          // must equal the CANVAS_HEIGHT comment above
let controlHeight = 146;         // recomputed by layoutControls()
let drawHeight = canvasHeight - controlHeight;
let margin = 25;
let sliderLeftMargin = 150;      // width reserved for each slider label + value
let defaultTextSize = 16;
let rowStep = 34;                // vertical spacing of control rows

// ---------- colors (Okabe-Ito) ----------
const CORRECT_COLOR = [0, 158, 115];     // bluish green
const INCORRECT_COLOR = [213, 94, 0];    // vermillion
const COUNT_COLOR = [204, 121, 167];     // reddish purple: success-count model
const LINE_COLOR = [0, 114, 178];        // blue: BKT trajectory

// ---------- model state ----------
// true = correct answer, false = incorrect answer
let rows = { A: [], B: [] };
let presetText = '';

// ---------- controls ----------
let successesFirstButton, failuresFirstButton, bruteForceButton, resetButton;
let countCheckbox;
let initSlider, learnSlider, guessSlider, slipSlider;
let flowItems = [];
let sliderItems = [];

// ---------- interaction state ----------
let dragging = null;             // { row, index }
let lastTooltip = '';
let geometry = null;             // tile and chart positions for this frame

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  successesFirstButton = createButton('Preset: successes first');
  successesFirstButton.mousePressed(() => applyPreset('successes'));
  failuresFirstButton = createButton('Preset: failures first');
  failuresFirstButton.mousePressed(() => applyPreset('failures'));
  bruteForceButton = createButton('Preset: brute force (five wrong, then right)');
  bruteForceButton.mousePressed(() => applyPreset('brute'));
  resetButton = createButton('Reset');
  resetButton.mousePressed(resetAll);
  countCheckbox = createCheckbox(' Show a success-count-only model', false);

  // BKT parameters (Chapter 18 illustrative defaults)
  initSlider = createSlider(0, 1, 0.30, 0.01);
  learnSlider = createSlider(0, 1, 0.15, 0.01);
  guessSlider = createSlider(0, 0.5, 0.20, 0.01);
  slipSlider = createSlider(0, 0.5, 0.10, 0.01);

  flowItems = [successesFirstButton, failuresFirstButton, bruteForceButton, resetButton, countCheckbox];
  sliderItems = [
    { slider: initSlider, label: 'Initial P(L0)' },
    { slider: learnSlider, label: 'Learning pt' },
    { slider: guessSlider, label: 'Guess pg' },
    { slider: slipSlider, label: 'Slip ps' }
  ];
  for (const el of flowItems) el.parent(document.querySelector('main'));
  countCheckbox.style('display', 'inline-block');   // p5 wraps checkboxes in a full-width div
  for (const s of sliderItems) s.slider.parent(document.querySelector('main'));

  applyPreset('successes');
  layoutControls();

  describe('Two stacked line charts of Bayesian knowledge tracing mastery estimates, from 0 to 1, ' +
    'for two orderings of the same answers. Above each chart is a row of draggable answer tiles, ' +
    'green with a check mark for correct and orange-red with a cross for incorrect. A summary strip ' +
    'between the charts gives the success count and the final estimate of each order. With the default ' +
    'parameters, two successes then two failures end at 0.33, and two failures then two successes end at 0.88.');
}

// ---------- BKT model ----------
function getParams() {
  return {
    L0: initSlider.value(),
    pt: learnSlider.value(),
    pg: guessSlider.value(),
    ps: slipSlider.value()
  };
}

// Two-step BKT update for one answer: condition on the observation, then apply learning.
function bktStep(L, correct, p) {
  let num, den;
  if (correct) {
    num = L * (1 - p.ps);
    den = L * (1 - p.ps) + (1 - L) * p.pg;
  } else {
    num = L * p.ps;
    den = L * p.ps + (1 - L) * (1 - p.pg);
  }
  const conditioned = den > 1e-12 ? num / den : L;   // guard the degenerate 0/0 case
  const learned = conditioned + (1 - conditioned) * p.pt;
  return { conditioned: conditioned, after: learned };
}

// Returns [L0, estimate after attempt 1, ..., estimate after attempt n]
function trace(sequence, p) {
  const values = [p.L0];
  let L = p.L0;
  for (const correct of sequence) {
    L = bktStep(L, correct, p).after;
    values.push(L);
  }
  return values;
}

function successCount(sequence) {
  return sequence.filter(c => c).length;
}

// ---------- presets ----------
function parseSequence(s) {
  return s.split('').map(ch => ch === 'C');
}

function applyPreset(name) {
  if (name === 'successes') {
    rows.A = parseSequence('CCII');
    rows.B = parseSequence('IICC');
    presetText = 'A: successes first     B: failures first';
  } else if (name === 'failures') {
    rows.A = parseSequence('IICC');
    rows.B = parseSequence('CCII');
    presetText = 'A: failures first     B: successes first';
  } else if (name === 'brute') {
    rows.A = parseSequence('IIIIIC');
    rows.B = parseSequence('C');
    presetText = 'A: five wrong, then right (every attempt emitted)     B: only the final success emitted';
  }
  dragging = null;
  logEvent('preset ' + name + ' -> A=' + seqString(rows.A) + ' B=' + seqString(rows.B));
}

function resetAll() {
  initSlider.value(0.30);
  learnSlider.value(0.15);
  guessSlider.value(0.20);
  slipSlider.value(0.10);
  countCheckbox.checked(false);
  applyPreset('successes');
}

function seqString(seq) {
  return seq.map(c => (c ? 'C' : 'I')).join('');
}

function logEvent(msg) {
  console.log('[attempt-order-swap-lab] ' + msg);
}

// ---------- geometry ----------
function computeGeometry() {
  const titleH = 34;
  const stripH = 50;
  const bottomPad = 8;
  const narrow = canvasWidth < 500;
  const block = (drawHeight - titleH - stripH - bottomPad) / 2;
  const tileH = constrain(block * 0.24, 24, narrow ? 30 : 38);
  const chartH = block - tileH - 10;
  const chartLeft = narrow ? 48 : 64;
  const chartRight = canvasWidth - (narrow ? 44 : 60);
  const nMax = Math.max(rows.A.length, rows.B.length, 1);
  const inner = 22;
  const spacing = (chartRight - chartLeft - 2 * inner) / nMax;
  const tileSize = Math.min(tileH, spacing * 0.78);
  const g = {
    chartLeft, chartRight, nMax, spacing, tileSize, tileH, chartH, narrow,
    xOf: k => chartLeft + inner + k * spacing,
    blocks: {}
  };
  const topA = titleH;
  const topB = titleH + block + stripH;
  g.blocks.A = { tileTop: topA, chartTop: topA + tileH + 6, chartBottom: topA + tileH + 6 + chartH };
  g.blocks.B = { tileTop: topB, chartTop: topB + tileH + 6, chartBottom: topB + tileH + 6 + chartH };
  g.stripTop = topA + block + 2;
  g.stripH = stripH - 6;
  return g;
}

function tileCenter(g, rowName, index) {
  const b = g.blocks[rowName];
  return { x: g.xOf(index + 1), y: b.tileTop + g.tileH / 2 };
}

function tileAt(g, mx, my) {
  for (const rowName of ['A', 'B']) {
    for (let i = 0; i < rows[rowName].length; i++) {
      const c = tileCenter(g, rowName, i);
      if (Math.abs(mx - c.x) <= g.tileSize / 2 && Math.abs(my - c.y) <= g.tileSize / 2) {
        return { row: rowName, index: i };
      }
    }
  }
  return null;
}

// ---------- drawing ----------
function draw() {
  updateCanvasSize();

  // drawing region and control region backgrounds (MicroSim standard)
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const p = getParams();
  const g = computeGeometry();
  geometry = g;

  // title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(g.narrow ? 18 : 22);
  text('Attempt Order Swap Lab', canvasWidth / 2, 7);

  const traces = { A: trace(rows.A, p), B: trace(rows.B, p) };
  for (const rowName of ['A', 'B']) {
    drawChart(g, rowName, traces[rowName]);
    drawTiles(g, rowName, traces[rowName]);
  }
  drawSummaryStrip(g, traces);
  drawDraggedTile(g);
  drawTooltip(g, traces);
  drawControlLabels(p);
}

function drawChart(g, rowName, values) {
  const b = g.blocks[rowName];
  const seq = rows[rowName];
  const yOf = v => map(v, 0, 1, b.chartBottom, b.chartTop);

  // plot area
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(g.chartLeft, b.chartTop, g.chartRight - g.chartLeft, b.chartBottom - b.chartTop);

  // horizontal grid and shared 0-1 vertical axis labels
  for (const v of [0, 0.25, 0.5, 0.75, 1]) {
    stroke(v === 0.5 ? 200 : 228);
    line(g.chartLeft, yOf(v), g.chartRight, yOf(v));
  }
  noStroke();
  fill(70);
  textSize(12);
  textAlign(RIGHT, CENTER);
  for (const v of [0, 0.5, 1]) text(v === 0.5 ? '0.5' : String(v), g.chartLeft - 4, yOf(v));

  // row badge
  const badgeX = g.narrow ? 18 : 26;
  const badgeY = b.tileTop + g.tileH / 2;
  fill(LINE_COLOR);
  noStroke();
  circle(badgeX, badgeY, g.narrow ? 24 : 28);
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(g.narrow ? 14 : 16);
  textStyle(BOLD);
  text(rowName, badgeX, badgeY + 1);
  textStyle(NORMAL);

  // y-axis caption
  push();
  translate(g.narrow ? 10 : 14, (b.chartTop + b.chartBottom) / 2);
  rotate(-HALF_PI);
  noStroke();
  fill(90);
  textSize(11);
  textAlign(CENTER, CENTER);
  text('P(mastered)', 0, 0);
  pop();

  // success-count-only overlay: a flat line at the success rate
  if (countCheckbox.checked() && seq.length > 0) {
    const rate = successCount(seq) / seq.length;
    stroke(COUNT_COLOR);
    strokeWeight(2.5);
    drawingContext.setLineDash([7, 5]);
    line(g.chartLeft, yOf(rate), g.chartRight, yOf(rate));
    drawingContext.setLineDash([]);
    // label in the right margin, outside the plot, so it never covers the trajectory
    noStroke();
    fill(150, 60, 120);
    textSize(11);
    textAlign(LEFT, CENTER);
    text('count', g.chartRight + 4, yOf(rate) - 7);
    textSize(12);
    textStyle(BOLD);
    text(rate.toFixed(2), g.chartRight + 4, yOf(rate) + 7);
    textStyle(NORMAL);
  }

  // BKT trajectory
  stroke(LINE_COLOR);
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (let k = 0; k < values.length; k++) vertex(g.xOf(k), yOf(values[k]));
  endShape();

  // points and value labels
  const showLabels = g.spacing >= 34;
  for (let k = 0; k < values.length; k++) {
    const x = g.xOf(k), y = yOf(values[k]);
    strokeWeight(1.5);
    if (k === 0) {
      stroke(90);
      fill('white');
      circle(x, y, 9);
    } else {
      stroke('white');
      fill(seq[k - 1] ? CORRECT_COLOR : INCORRECT_COLOR);
      circle(x, y, 11);
    }
    const isLast = k === values.length - 1;
    if (showLabels || isLast || k === 0) {
      noStroke();
      fill(isLast ? 0 : 60);
      textSize(isLast ? 14 : 12);
      textStyle(isLast ? BOLD : NORMAL);
      const above = values[k] < 0.8;
      textAlign(CENTER, above ? BOTTOM : TOP);
      const label = k === 0 ? 'start ' + values[k].toFixed(2) : values[k].toFixed(2);
      text(label, x, y + (above ? -7 : 7));
      textStyle(NORMAL);
    }
  }
}

function drawTiles(g, rowName, values) {
  const seq = rows[rowName];
  for (let i = 0; i < seq.length; i++) {
    if (dragging && dragging.row === rowName && dragging.index === i) {
      // leave a ghost slot where the dragged tile came from
      const c = tileCenter(g, rowName, i);
      stroke(170);
      strokeWeight(1);
      drawingContext.setLineDash([4, 3]);
      noFill();
      rectMode(CENTER);
      rect(c.x, c.y, g.tileSize, g.tileSize, 6);
      rectMode(CORNER);
      drawingContext.setLineDash([]);
      continue;
    }
    const c = tileCenter(g, rowName, i);
    drawTile(c.x, c.y, g.tileSize, seq[i]);
  }
  // insertion marker while dragging within this row
  if (dragging && dragging.row === rowName) {
    const target = targetIndex(g, rowName, mouseX);
    if (target !== dragging.index) {
      const x = g.xOf(target + 1);
      stroke(LINE_COLOR);
      strokeWeight(3);
      const top = g.blocks[rowName].tileTop;
      line(x, top - 2, x, top + g.tileH + 2);
    }
  }
}

function drawTile(x, y, size, correct) {
  rectMode(CENTER);
  stroke(255);
  strokeWeight(1.5);
  fill(correct ? CORRECT_COLOR : INCORRECT_COLOR);
  rect(x, y, size, size, 6);
  rectMode(CORNER);
  noStroke();
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(size * 0.55);
  textStyle(BOLD);
  text(correct ? '✓' : '✗', x, y + 1);
  textStyle(NORMAL);
}

function drawDraggedTile(g) {
  if (!dragging) return;
  const correct = rows[dragging.row][dragging.index];
  const b = g.blocks[dragging.row];
  const x = constrain(mouseX, g.xOf(1) - g.spacing / 2, g.xOf(rows[dragging.row].length) + g.spacing / 2);
  drawingContext.shadowColor = 'rgba(0,0,0,0.35)';
  drawingContext.shadowBlur = 8;
  drawTile(x, b.tileTop + g.tileH / 2, g.tileSize * 1.08, correct);
  drawingContext.shadowBlur = 0;
}

function drawSummaryStrip(g, traces) {
  const top = g.stripTop;
  const h = g.stripH;
  stroke(200);
  strokeWeight(1);
  fill(255, 255, 255, 235);
  rect(8, top, canvasWidth - 16, h, 8);

  const sA = successCount(rows.A), sB = successCount(rows.B);
  const nA = rows.A.length, nB = rows.B.length;
  const finalA = traces.A[traces.A.length - 1];
  const finalB = traces.B[traces.B.length - 1];
  let line1;
  if (sA === sB && nA === nB) {
    line1 = 'Successes: ' + sA + ' of ' + nA + ' in both orders';
  } else {
    line1 = 'Successes: A ' + sA + ' of ' + nA + ',  B ' + sB + ' of ' + nB;
  }
  let line2 = 'Final estimate  A: ' + finalA.toFixed(2) + '   B: ' + finalB.toFixed(2) +
    '   gap: ' + Math.abs(finalA - finalB).toFixed(2);
  if (countCheckbox.checked()) {
    const rA = nA ? sA / nA : 0, rB = nB ? sB / nB : 0;
    line2 += g.narrow ? '' : '   |   count-only: A ' + rA.toFixed(2) + ', B ' + rB.toFixed(2);
  }
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(g.narrow ? 13 : 15);
  textStyle(BOLD);
  text(line1, 18, top + h * 0.3);
  textStyle(NORMAL);
  text(line2, 18, top + h * 0.72);
  // preset caption on the right of the first line when there is room
  if (!g.narrow) {
    fill(80);
    textSize(12);
    textAlign(RIGHT, CENTER);
    const cap = presetText.length > 60 && canvasWidth < 760 ? '' : presetText;
    text(cap, canvasWidth - 18, top + h * 0.3);
  }
}

function tooltipText(g, hit, traces) {
  const seq = rows[hit.row];
  const obs = seq[hit.index] ? 'correct' : 'incorrect';
  const est = traces[hit.row][hit.index + 1];
  return 'Order ' + hit.row + ', attempt ' + (hit.index + 1) + ' of ' + seq.length + ': ' +
    obs + ', estimate after it ' + est.toFixed(2);
}

function drawTooltip(g, traces) {
  if (dragging) return;
  const hit = tileAt(g, mouseX, mouseY);
  if (!hit) {
    lastTooltip = '';
    cursor(ARROW);
    return;
  }
  cursor('grab');
  const t = tooltipText(g, hit, traces);
  if (t !== lastTooltip) {
    lastTooltip = t;
    logEvent('tooltip: ' + t);
  }
  textSize(13);
  const w = textWidth(t) + 16;
  const h = 24;
  let x = constrain(mouseX + 12, 4, canvasWidth - w - 4);
  let y = mouseY + 16;
  if (y + h > drawHeight - 4) y = mouseY - h - 10;
  stroke(120);
  strokeWeight(1);
  fill(255, 255, 240);
  rect(x, y, w, h, 5);
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  text(t, x + 8, y + h / 2);
}

function drawControlLabels(p) {
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, CENTER);
  const values = [p.L0, p.pt, p.pg, p.ps];
  sliderItems.forEach((s, i) => {
    if (!s.pos) return;
    text(s.label + ': ' + values[i].toFixed(2), s.pos.labelX, s.pos.y + 10);
  });
}

// ---------- dragging ----------
function targetIndex(g, rowName, mx) {
  const n = rows[rowName].length;
  const idx = Math.round((mx - g.xOf(1)) / g.spacing);
  return constrain(idx, 0, n - 1);
}

function mousePressed() {
  if (!geometry || mouseY > drawHeight) return;
  const hit = tileAt(geometry, mouseX, mouseY);
  if (hit && rows[hit.row].length > 1) {
    dragging = hit;
    cursor('grabbing');
  }
}

function mouseReleased() {
  if (!dragging || !geometry) return;
  const rowName = dragging.row;
  const target = targetIndex(geometry, rowName, mouseX);
  if (target !== dragging.index) {
    const seq = rows[rowName];
    const [tile] = seq.splice(dragging.index, 1);
    seq.splice(target, 0, tile);
    presetText = 'custom order';
    logEvent('reorder: order ' + rowName + ' moved attempt ' + (dragging.index + 1) +
      ' to position ' + (target + 1) + ' -> ' + seqString(seq));
  }
  dragging = null;
  cursor(ARROW);
}

// ---------- responsive layout ----------
// Flow the buttons and checkbox left to right, wrapping when a row is full, then place
// the four parameter sliders two per row (one per row on narrow screens). The control
// region grows when rows wrap and the drawing region shrinks by the same amount, so
// drawHeight + controlHeight always equals CANVAS_HEIGHT.
function layoutControls() {
  const gap = 8;
  const positions = [];
  let x = 10, row = 0;
  for (const el of flowItems) {
    const w = el.elt.offsetWidth || 120;
    if (x + w > canvasWidth - 10 && x > 10) {
      row++;
      x = 10;
    }
    positions.push({ el, x, row });
    x += w + gap;
  }
  const flowRows = row + 1;
  const cols = canvasWidth >= 560 ? 2 : 1;
  const sliderRows = Math.ceil(sliderItems.length / cols);
  controlHeight = (flowRows + sliderRows) * rowStep + 12;
  drawHeight = canvasHeight - controlHeight;

  for (const pos of positions) pos.el.position(pos.x, drawHeight + 8 + pos.row * rowStep);

  const colW = (canvasWidth - 10) / cols;
  sliderItems.forEach((s, i) => {
    const c = i % cols, r = Math.floor(i / cols);
    const colX = 5 + c * colW;
    const y = drawHeight + 8 + (flowRows + r) * rowStep;
    const labelX = colX + 8;
    const sliderX = colX + sliderLeftMargin;
    const w = Math.max(60, colW - sliderLeftMargin - 16);
    s.slider.position(sliderX, y);
    s.slider.size(w);
    s.pos = { labelX, y };
  });
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  layoutControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    const w = Math.floor(container.getBoundingClientRect().width);
    if (w > 0) canvasWidth = w;
  }
}
