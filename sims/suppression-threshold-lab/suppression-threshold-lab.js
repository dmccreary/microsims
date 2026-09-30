// Suppression Threshold Lab - small-cell suppression and complementary suppression
// CANVAS_HEIGHT: 560
// Learning objective (Apply / apply): the learner applies a suppression threshold and
// complementary suppression to a small table and predicts which cells must be hidden so that no
// hidden count can be recovered by subtraction (Chapter 21, "The Suppression Threshold").
// Rules used (the chapter's): a count from 1 to threshold - 1 is hidden (red); a zero stays
// visible, as in the chapter's worked example. If a row with a published Row Total has exactly
// one hidden cell, the total gives it away by subtraction, so complementary suppression hides a
// second cell in the same row (amber): the smallest non-zero visible count. With two or more
// hidden cells the total reveals only their sum.
// Each cell starts unrevealed: click it and predict "Hidden" or "Shown" before the answer appears.

// ---------- Canvas dimensions ----------
// Fixed total height; the drawing/control split is recomputed when the control rows wrap.
let canvasWidth = 800;
let canvasHeight = 560;
let controlHeight = 114;
let drawHeight = canvasHeight - controlHeight;
let margin = 12;
let defaultTextSize = 16;

// ---------- Data ----------
const BANDS = ['Beginning', 'Developing', 'Proficient', 'Advanced'];
const BANDS_SHORT = ['Begin.', 'Devel.', 'Profic.', 'Adv.'];
const SCENARIOS = {
  'All cells safe': [
    { name: 'Lakeside', counts: [14, 18, 22, 11] },
    { name: 'Hillcrest', counts: [12, 20, 17, 13] }
  ],
  'One small cell': [
    { name: 'Lakeside', counts: [14, 9, 22, 0] },      // the chapter's worked example: 45 - 36 = 9
    { name: 'Hillcrest', counts: [12, 20, 17, 13] }
  ],
  'Complementary suppression needed': [
    { name: 'Lakeside', counts: [0, 7, 30, 12] },      // the complement must not be the zero
    { name: 'Hillcrest', counts: [6, 4, 25, 18] }      // two small cells: no complement needed
  ]
};

// Okabe-Ito based fills (color-blind safe), always paired with a text tag and a lock
const RED = [213, 94, 0], RED_FILL = [248, 203, 185];
const AMBER = [230, 159, 0], AMBER_FILL = [255, 231, 170];
const BLUE = [0, 114, 178];

// ---------- State ----------
let rows = [];
let revealed = [];     // revealed[r][c]
let pending = null;    // {r, c} awaiting a prediction
let feedback = '';
let feedbackOk = null;
let predictions = 0, correct = 0;
let cellBoxes = [];

let thresholdSlider, scenarioSelect, complementBox, subtractionBox, resetButton, revealButton, hiddenButton, shownButton;
let layoutItems = [], labelSpots = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('sans-serif');
  const main = document.querySelector('main');

  thresholdSlider = createSlider(5, 20, 10, 1);
  thresholdSlider.attribute('aria-label', 'Threshold');
  thresholdSlider.input(() => { pending = null; updateButtons(); });
  scenarioSelect = createSelect();
  for (const k of Object.keys(SCENARIOS)) scenarioSelect.option(k);
  scenarioSelect.selected('One small cell');
  scenarioSelect.changed(loadScenario);
  scenarioSelect.attribute('aria-label', 'Scenario');
  complementBox = createCheckbox('Apply complementary suppression', false);
  complementBox.changed(() => { pending = null; updateButtons(); });
  subtractionBox = createCheckbox('Show the subtraction', true);
  resetButton = createButton('Reset');
  resetButton.mousePressed(resetLab);
  revealButton = createButton('Reveal all');
  revealButton.mousePressed(revealAll);
  hiddenButton = createButton('Hidden');
  hiddenButton.mousePressed(() => predict(true));
  shownButton = createButton('Shown');
  shownButton.mousePressed(() => predict(false));
  for (const el of [thresholdSlider, scenarioSelect, complementBox, subtractionBox, resetButton, revealButton, hiddenButton, shownButton]) {
    el.parent(main);
    el.style('white-space', 'nowrap');
  }
  layoutItems = [
    { el: thresholdSlider, label: 'Threshold: 20', w: 150 },
    { el: scenarioSelect, label: 'Scenario:' },
    { el: complementBox, br: true },
    { el: subtractionBox },
    { el: resetButton, br: true }, { el: revealButton },
    { el: hiddenButton, label: 'Prediction:' }, { el: shownButton }
  ];
  layoutControls();
  loadScenario();

  describe('Suppression Threshold Lab. A table shows student counts in four mastery bands, Beginning, ' +
    'Developing, Proficient and Advanced, with a Row Total, for two schools. Counts below the threshold are ' +
    'hidden and shown in red with a lock; a second cell hidden by complementary suppression is amber with a ' +
    'lock. The learner clicks each cell and predicts whether it will be hidden. A line under the table says ' +
    'whether any hidden value can still be recovered by subtracting the visible cells from the row total, ' +
    'and can draw that subtraction.');
}

// ---------- Rules ----------
function statusOf(r, c) {
  const T = thresholdSlider.value();
  const counts = rows[r].counts;
  const v = counts[c];
  if (v > 0 && v < T) return 'small';
  if (!complementBox.checked()) return 'shown';
  const small = counts.map((x, i) => (x > 0 && x < T) ? i : -1).filter(i => i >= 0);
  if (small.length !== 1) return 'shown';
  return complementIndex(r) === c ? 'complement' : 'shown';
}

function complementIndex(r) {
  // the smallest non-zero count that is not already hidden (leftmost on a tie)
  const T = thresholdSlider.value();
  const counts = rows[r].counts;
  let best = -1;
  counts.forEach((x, i) => {
    if (x > 0 && x >= T && (best < 0 || x < counts[best])) best = i;
  });
  return best;
}

function rowTotal(r) { return rows[r].counts.reduce((a, b) => a + b, 0); }

function rowLeak(r) {
  const hidden = [], visible = [];
  rows[r].counts.forEach((v, c) => (statusOf(r, c) === 'shown' ? visible : hidden).push(c));
  return { hidden, visible };
}

function reason(r, c) {
  const T = thresholdSlider.value();
  const v = rows[r].counts[c];
  const st = statusOf(r, c);
  const band = BANDS[c];
  if (st === 'small') return v + ' ' + band + ' students is below the threshold of ' + T + ', so the cell is suppressed.';
  if (st === 'complement') {
    const lk = rows[r].counts.findIndex((x, i) => x > 0 && x < T);
    return v + ' is at or above ' + T + ', but ' + rows[r].name + ' has one small cell (' + rows[r].counts[lk] + ') and a visible total, so complementary suppression hides the smallest non-zero cell as well.';
  }
  if (v === 0) return 'A zero stays visible, as in the chapter\'s example; the rule hides counts from 1 to ' + (T - 1) + '.';
  const small = rows[r].counts.filter(x => x > 0 && x < T).length;
  if (small === 1 && !complementBox.checked()) return v + ' is at or above ' + T + ' and complementary suppression is off, so it is shown (and the row leaks).';
  if (small === 1) return v + ' is at or above ' + T + ' and is not the smallest non-zero cell, so it stays visible.';
  if (small >= 2) return v + ' is at or above ' + T + '; the row already has ' + small + ' hidden cells, so no complement is needed.';
  return v + ' is at or above the threshold of ' + T + ', so it is shown.';
}

// ---------- Actions ----------
function loadScenario() {
  rows = SCENARIOS[scenarioSelect.value()].map(r => ({ name: r.name, counts: r.counts.slice() }));
  resetLab();
}

function resetLab() {
  revealed = rows.map(r => r.counts.map(() => false));
  pending = null;
  predictions = 0;
  correct = 0;
  feedback = 'Click any count and predict whether it will be hidden in the published table.';
  feedbackOk = null;
  updateButtons();
}

function revealAll() {
  revealed = rows.map(r => r.counts.map(() => true));
  pending = null;
  feedback = 'All cells revealed. Change the threshold or the checkboxes and watch the table update.';
  feedbackOk = null;
  updateButtons();
}

function predict(saysHidden) {
  if (!pending) return;
  const { r, c } = pending;
  const hidden = statusOf(r, c) !== 'shown';
  const ok = hidden === saysHidden;
  predictions++;
  if (ok) correct++;
  revealed[r][c] = true;
  feedback = (ok ? 'Correct. ' : 'Not quite. ') + reason(r, c);
  feedbackOk = ok;
  pending = null;
  updateButtons();
}

function updateButtons() {
  for (const b of [hiddenButton, shownButton]) {
    if (pending) b.removeAttribute('disabled'); else b.attribute('disabled', '');
  }
}

function allRevealed() { return revealed.every(r => r.every(Boolean)); }

// ---------- Layout ----------
function narrow() { return canvasWidth < 500; }

function layoutControls() {
  const rowH = 34, x0 = 10, gap = 12;
  textSize(14);
  for (const it of layoutItems) it.el.position(0, 0);
  thresholdSlider.size(narrow() ? max(120, canvasWidth - 150) : 150);
  let x = x0, row = 0;
  const placed = [];
  for (const it of layoutItems) {
    textStyle(BOLD);
    const lw = it.label ? textWidth(it.label) + 8 : 0;
    textStyle(NORMAL);
    const w = lw + (it.el.elt.offsetWidth || 100);
    if (x > x0 && ((it.br && !narrow()) || x + w > canvasWidth - margin)) { row++; x = x0; }
    placed.push({ it, x, row, lw });
    x += w + gap;
  }
  controlHeight = (row + 1) * rowH + 12;
  drawHeight = canvasHeight - controlHeight;
  labelSpots = [];
  for (const p of placed) {
    const y = drawHeight + 8 + p.row * rowH;
    if (p.it.label) labelSpots.push({ el: p.it.el, text: p.it.label, x: p.x, y: y + 12 });
    const dy = (p.it.el === complementBox || p.it.el === subtractionBox) ? 3 : (p.it.el === thresholdSlider ? 2 : 0);
    p.it.el.position(p.x + p.lw, y + dy);
  }
}

// ---------- Drawing ----------
function draw() {
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(narrow() ? 17 : 20);
  text('Suppression Threshold Lab', margin, 8);
  textStyle(NORMAL);
  textSize(12);
  fill(70);
  textAlign(RIGHT, TOP);
  if (!narrow()) text('students per mastery band, cross-school view', canvasWidth - margin, 13);

  const tableBottom = drawTable(margin, 40, canvasWidth - 2 * margin);
  let y = drawRecoveryLines(margin, tableBottom + 8, canvasWidth - 2 * margin);
  y = drawLegend(margin, y + 4);
  const fbTop = drawHeight - (narrow() ? 64 : 52) - 8;
  if (subtractionBox.checked() && allRevealed() && fbTop - y > 58) drawSubtractionGraphic(margin, y + 8, canvasWidth - 2 * margin, fbTop - y - 12);
  else if (!allRevealed() && fbTop - y > 58) drawRules(margin, y + 8, canvasWidth - 2 * margin);
  drawFeedback(margin, drawHeight - (narrow() ? 64 : 52) - 8, canvasWidth - 2 * margin, narrow() ? 64 : 52);
  drawControlLabels();
}

function drawLock(cx, cy, s, col) {
  stroke(col);
  strokeWeight(max(1.5, s / 6));
  noFill();
  arc(cx, cy - s * 0.25, s * 0.7, s * 0.8, PI, TWO_PI);
  line(cx - s * 0.35, cy - s * 0.25, cx - s * 0.35, cy);
  line(cx + s * 0.35, cy - s * 0.25, cx + s * 0.35, cy);
  noStroke();
  fill(col);
  rect(cx - s * 0.5, cy - s * 0.05, s, s * 0.65, 2);
}

function drawTable(x, y, w) {
  cellBoxes = [];
  const firstW = narrow() ? 74 : 110;
  const colW = (w - firstW) / 5;
  const headH = 32;
  const rowH = narrow() ? 56 : 64;
  const T = thresholdSlider.value();
  // header
  noStroke();
  fill(225, 235, 245);
  rect(x, y, w, headH, 6, 6, 0, 0);
  fill(0);
  textStyle(BOLD);
  textSize(narrow() ? 12 : 14);
  textAlign(LEFT, CENTER);
  text('School', x + 8, y + headH / 2);
  textAlign(CENTER, CENTER);
  const names = colW < 80 ? BANDS_SHORT : BANDS;
  names.forEach((b, c) => text(b, x + firstW + c * colW + colW / 2, y + headH / 2));
  text(colW < 80 ? 'Total' : 'Row Total', x + firstW + 4 * colW + colW / 2, y + headH / 2);
  textStyle(NORMAL);
  // rows
  rows.forEach((row, r) => {
    const ry = y + headH + r * rowH;
    stroke(200);
    strokeWeight(1);
    fill(255);
    rect(x, ry, firstW, rowH);
    noStroke();
    fill(0);
    textAlign(LEFT, CENTER);
    textSize(narrow() ? 13 : 15);
    text(row.name, x + 8, ry + rowH / 2);
    const leak = rowLeak(r);
    const rowRevealed = revealed[r].every(Boolean);
    const leaks = rowRevealed && leak.hidden.length === 1;
    row.counts.forEach((v, c) => {
      const cx = x + firstW + c * colW;
      const st = statusOf(r, c);
      const isRev = revealed[r][c];
      const isPending = pending && pending.r === r && pending.c === c;
      let f = color(255), s = color(200);
      if (isRev && st === 'small') { f = color(RED_FILL); s = color(RED); }
      if (isRev && st === 'complement') { f = color(AMBER_FILL); s = color(AMBER); }
      if (!isRev) f = color(247, 247, 247);
      stroke(s);
      strokeWeight(isRev && st !== 'shown' ? 2 : 1);
      fill(f);
      rect(cx, ry, colW, rowH);
      if (isPending) {
        noFill();
        stroke(BLUE);
        strokeWeight(3);
        rect(cx + 2, ry + 2, colW - 4, rowH - 4);
      }
      if (leaks && leak.hidden[0] === c) {
        noFill();
        stroke(150, 0, 0);
        strokeWeight(3);
        drawingContext.setLineDash([6, 4]);
        rect(cx + 3, ry + 3, colW - 6, rowH - 6);
        drawingContext.setLineDash([]);
      }
      noStroke();
      textAlign(CENTER, CENTER);
      if (!isRev) {
        fill(60);
        textSize(narrow() ? 17 : 20);
        text(v, cx + colW / 2, ry + rowH / 2 - 6);
        fill(BLUE);
        textSize(colW < 110 ? 13 : 12);
        const hint = colW < 110 ? (isPending ? 'predict' : '?') : (isPending ? 'hidden or shown?' : '? click to predict');
        text(hint, cx + colW / 2, ry + rowH - 11);
      } else if (st === 'shown') {
        fill(0);
        textSize(narrow() ? 17 : 20);
        text(v, cx + colW / 2, ry + rowH / 2);
      } else {
        const col = st === 'small' ? color(RED) : color(150, 95, 0);
        drawLock(cx + colW / 2, ry + rowH / 2 - 8, narrow() ? 14 : 16, col);
        fill(col);
        textSize(colW < 90 ? 11 : 12);
        textStyle(BOLD);
        const tag = colW < 90 ? (st === 'small' ? '<' + T : 'compl.') : (st === 'small' ? 'below ' + T : 'complement');
        text(tag + ' (' + v + ')', cx + colW / 2, ry + rowH - 11);
        textStyle(NORMAL);
      }
      cellBoxes.push({ r, c, x: cx, y: ry, w: colW, h: rowH });
    });
    // row total, always published
    const tx = x + firstW + 4 * colW;
    stroke(200);
    strokeWeight(1);
    fill(235, 242, 250);
    rect(tx, ry, colW, rowH);
    noStroke();
    fill(0);
    textStyle(BOLD);
    textSize(narrow() ? 17 : 20);
    textAlign(CENTER, CENTER);
    text(rowTotal(r), tx + colW / 2, ry + rowH / 2);
    textStyle(NORMAL);
  });
  return y + headH + rows.length * rowH;
}

function drawRecoveryLines(x, y, w) {
  noStroke();
  textAlign(LEFT, TOP);
  const small = narrow();
  const lh = small ? 15 : 17;
  if (!allRevealed()) {
    fill(40);
    textSize(small ? 13 : 14);
    textStyle(BOLD);
    y = drawWrapped('Can any hidden value still be recovered? Predict every cell (or press Reveal all) to find out.', x, y, w, lh);
    textStyle(NORMAL);
    fill(80);
    textSize(small ? 12 : 13);
    const done = revealed.flat().filter(Boolean).length;
    y = drawWrapped('Predicted ' + done + ' of ' + revealed.flat().length + ' cells' +
      (predictions ? ', ' + correct + ' correct.' : '.') + ' Threshold ' + thresholdSlider.value() +
      ', complementary suppression ' + (complementBox.checked() ? 'on.' : 'off.'), x, y + 2, w, lh);
    return y;
  }
  let anyLeak = false;
  const lines = [];
  rows.forEach((row, r) => {
    const { hidden, visible } = rowLeak(r);
    const total = rowTotal(r);
    const visSum = visible.reduce((a, c) => a + row.counts[c], 0);
    const parts = '(' + visible.map(c => row.counts[c]).join(' + ') + ')';
    if (hidden.length === 0) lines.push({ c: color(60), t: row.name + ': nothing hidden.' });
    else if (hidden.length === 1) {
      anyLeak = true;
      lines.push({ c: color(150, 0, 0), t: row.name + ': one hidden cell and a visible total, so ' + BANDS[hidden[0]] + ' is recoverable' +
        (subtractionBox.checked() ? ': ' + total + ' − ' + parts + ' = ' + (total - visSum) + '.' : '.') });
    } else {
      lines.push({ c: color(0, 110, 70), t: row.name + ': ' + hidden.length + ' hidden cells' +
        (subtractionBox.checked() ? '; ' + total + ' − ' + (visible.length ? parts : '0') + ' = ' + (total - visSum) + ' is only their sum, so neither can be found.' : ', so the total gives only their sum.') });
    }
  });
  textSize(small ? 13 : 15);
  textStyle(BOLD);
  fill(anyLeak ? color(150, 0, 0) : color(0, 110, 70));
  y = drawWrapped(anyLeak ? 'Yes: a hidden value can still be recovered by subtraction.' : 'No hidden value can be recovered from the published table.', x, y, w, lh + 1);
  textStyle(NORMAL);
  textSize(small ? 12 : 13);
  for (const l of lines) { fill(l.c); y = drawWrapped(l.t, x, y + 2, w, lh); }
  return y;
}

// The subtraction drawn as boxes: total - visible cells = the hidden value (or the hidden sum)
function drawSubtractionGraphic(x, y, w, h) {
  // pick the first row that hides anything: a leaking row first
  let pick = -1;
  rows.forEach((row, r) => { if (pick < 0 && rowLeak(r).hidden.length === 1) pick = r; });
  rows.forEach((row, r) => { if (pick < 0 && rowLeak(r).hidden.length > 1) pick = r; });
  if (pick < 0) return;
  const row = rows[pick];
  const { hidden, visible } = rowLeak(pick);
  const total = rowTotal(pick);
  const res = total - visible.reduce((a, c) => a + row.counts[c], 0);
  const leak = hidden.length === 1;
  const items = [{ v: total, kind: 'total', cap: 'Row Total' }];
  visible.forEach(c => items.push({ op: '\u2212' }, { v: row.counts[c], kind: 'vis', cap: BANDS[c] }));
  items.push({ op: '=' }, { v: res, kind: leak ? 'leak' : 'sum', cap: leak ? BANDS[hidden[0]] + ' recovered' : 'sum of ' + hidden.length + ' hidden' });
  const bw = min(84, (w - 30) / (items.length * 0.72)), bh = min(40, h - 20), opW = 22;
  let xx = x + 6;
  noStroke();
  fill(40);
  textAlign(LEFT, TOP);
  textSize(12);
  textStyle(BOLD);
  text(row.name + (leak ? ': the published numbers give the hidden cell away' : ': the published numbers give only a sum'), x + 6, y);
  textStyle(NORMAL);
  const by = y + 18;
  for (const it of items) {
    if (it.op) {
      fill(40);
      textSize(20);
      textAlign(CENTER, CENTER);
      text(it.op, xx + opW / 2, by + bh / 2);
      xx += opW;
      continue;
    }
    let f = color(255), st = color(160);
    if (it.kind === 'total') { f = color(235, 242, 250); st = color(BLUE); }
    if (it.kind === 'leak') { f = color(RED_FILL); st = color(150, 0, 0); }
    if (it.kind === 'sum') { f = color(215, 240, 228); st = color(0, 110, 70); }
    stroke(st);
    strokeWeight(it.kind === 'leak' ? 2.5 : 1.5);
    if (it.kind === 'leak') drawingContext.setLineDash([5, 3]);
    fill(f);
    rect(xx, by, bw, bh, 6);
    drawingContext.setLineDash([]);
    noStroke();
    fill(0);
    textSize(18);
    textStyle(it.kind === 'leak' || it.kind === 'total' ? BOLD : NORMAL);
    textAlign(CENTER, CENTER);
    text(it.v, xx + bw / 2, by + bh / 2);
    textStyle(NORMAL);
    textSize(10);
    fill(70);
    textAlign(CENTER, TOP);
    text(it.cap, xx + bw / 2, by + bh + 2);
    xx += bw;
  }
}

// The rules to apply, shown while the learner is still predicting (when there is room)
function drawRules(x, y, w) {
  const T = thresholdSlider.value();
  noStroke();
  textAlign(LEFT, TOP);
  textSize(12);
  textStyle(BOLD);
  fill(40);
  text('The rules to apply', x + 6, y);
  textStyle(NORMAL);
  fill(60);
  let yy = y + 17;
  yy = drawWrapped('1. Hide any count from 1 to ' + (T - 1) + ' (below the threshold of ' + T + '). A zero stays visible.', x + 6, yy, w - 12, 15);
  yy = drawWrapped('2. Complementary suppression (when checked): if a row with a published total has exactly one hidden cell, ' +
    'also hide that row\'s smallest non-zero visible count.', x + 6, yy + 1, w - 12, 15);
}

function drawLegend(x, y) {
  if (y > drawHeight - 90) return y;
  textSize(12);
  textAlign(LEFT, CENTER);
  const items = [
    { f: color(255), s: color(200), t: 'shown' },
    { f: color(RED_FILL), s: color(RED), t: 'below threshold (lock)' },
    { f: color(AMBER_FILL), s: color(AMBER), t: 'complementary (lock)' }
  ];
  let xx = x;
  for (const it of items) {
    stroke(it.s);
    strokeWeight(1.5);
    fill(it.f);
    rect(xx, y + 2, 14, 12, 2);
    noStroke();
    fill(40);
    text(it.t, xx + 19, y + 8);
    xx += 19 + textWidth(it.t) + 16;
    if (xx > canvasWidth - 120) { xx = x; y += 18; }
  }
  return y + 18;
}

function drawFeedback(x, y, w, h) {
  stroke(200);
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(x, y, w, h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(narrow() ? 12 : 13);
  fill(feedbackOk === true ? color(0, 110, 70) : feedbackOk === false ? color(160, 60, 0) : color(40));
  let msg = feedback;
  if (pending) msg = 'Will ' + rows[pending.r].name + '\'s ' + BANDS[pending.c] + ' count of ' + rows[pending.r].counts[pending.c] +
    ' be hidden in the published table? Choose Hidden or Shown below.';
  if (pending) fill(BLUE);
  drawWrapped(msg, x + 10, y + 7, w - 20, narrow() ? 14 : 16);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(14);
  for (const l of labelSpots) {
    textStyle(BOLD);
    const t = l.el === thresholdSlider ? 'Threshold: ' : l.text;
    text(t, l.x, l.y);
    const tw = textWidth(t);
    textStyle(NORMAL);
    if (l.el === thresholdSlider) text(thresholdSlider.value(), l.x + tw, l.y);
  }
}

// ---------- Interaction ----------
function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight) return;
  for (const b of cellBoxes) {
    if (mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h) {
      if (revealed[b.r][b.c]) {
        feedback = reason(b.r, b.c);
        feedbackOk = null;
        pending = null;
      } else {
        pending = { r: b.r, c: b.c };
      }
      updateButtons();
      return;
    }
  }
}

function mouseMoved() {
  let over = false;
  for (const b of cellBoxes) if (mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h) over = true;
  cursor(over ? HAND : ARROW);
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
