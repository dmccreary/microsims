// Redelivery and Idempotency Lab - why "recompute absolutes, never increment" survives redelivery
// CANVAS_HEIGHT: 560
// Learning objective (Evaluate / justify): the learner justifies why writing absolute values, not
// increments, keeps a summary correct when statements are redelivered (Chapter 20, "Idempotent
// Ingest").
// A stream of twelve statements is read in batches of three. The processor writes each statement
// to the log, then commits the batch offset when it fetches the next batch. If it crashes before
// that commit, the whole batch is delivered again (at-least-once delivery). Writer A keeps its
// summary with count += 1 per delivery; Writer B sets count = the number of rows in the
// deduplicated log. A truth line marks the correct count of distinct statements.

// ---------- Canvas dimensions ----------
// Fixed total height; the drawing/control split is recomputed when the control rows wrap.
let canvasWidth = 800;
let canvasHeight = 560;
let controlHeight = 80;
let drawHeight = canvasHeight - controlHeight;
let margin = 12;
let defaultTextSize = 16;

// ---------- Model ----------
const N_STATEMENTS = 12;
const BATCH = 3;
const IDS = [];
for (let i = 1; i <= N_STATEMENTS; i++) IDS.push('st-' + (i < 10 ? '0' : '') + i);

// Okabe-Ito colors
const A_COLOR = [213, 94, 0];     // vermillion: Writer A
const B_COLOR = [0, 114, 178];    // blue: Writer B
const TRUTH = [0, 0, 0];
const OK_GREEN = [0, 130, 90];

let readPos = 0;          // next statement index to deliver
let committed = 0;        // committed offset: statements before this index will not be redelivered
let deliveries = [];      // every physical insert into the log {id, n (delivery number of this id)}
let deliveredCount = {};  // id -> times delivered
let writerA = 0;
let writerB = 0;
let message = '';
let messageKind = 'info';
let rng;

let deliverButton, crashButton, resetButton, redeliverySlider, dedupBox;
let sliderLabelSpot = null;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('sans-serif');
  const main = document.querySelector('main');

  deliverButton = createButton('Deliver next statement');
  deliverButton.mousePressed(deliverNext);
  crashButton = createButton('Crash before commit');
  crashButton.mousePressed(crashBeforeCommit);
  resetButton = createButton('Reset');
  resetButton.mousePressed(resetLab);
  redeliverySlider = createSlider(0, 50, 20, 5);
  redeliverySlider.attribute('aria-label', 'Redelivery chance (percent)');
  dedupBox = createCheckbox('Deduplicate log by statement id', true);
  dedupBox.changed(onDedupChanged);
  for (const el of [deliverButton, crashButton, resetButton, redeliverySlider, dedupBox]) {
    el.parent(main);
    el.style('white-space', 'nowrap');
  }
  layoutControls();
  resetLab();
  // Opening scene: one batch written, a crash before its commit, and the redelivery begins
  deliverNext(); deliverNext(); deliverNext();
  crashBeforeCommit();
  deliverNext(); deliverNext();

  describe('Redelivery and Idempotency Lab. A queue of twelve numbered statements in batches of three ' +
    'sits on the left, a processor in the middle, then a log table with a deduplication indicator, and two ' +
    'summary counters on the right: Writer A adds one on every delivery, Writer B recomputes its count from ' +
    'the log. A black truth line marks the correct count. When a batch is redelivered after a crash, ' +
    'Writer A drifts above the truth line while Writer B stays on it. With deduplication off, the log keeps ' +
    'duplicate rows and Writer B drifts too, and a message explains which layer failed.');
}

// ---------- Simulation ----------
function resetLab() {
  rng = mulberry32(42);
  readPos = 0;
  committed = 0;
  deliveries = [];
  deliveredCount = {};
  writerA = 0;
  writerB = 0;
  message = 'Press Deliver next statement. The processor writes each statement to the log and commits the ' +
    'offset for a batch of three when it fetches the next batch. A crash before that commit means the batch ' +
    'is delivered again.';
  messageKind = 'info';
}

function mulberry32(a) {
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function truthCount() { return Object.keys(deliveredCount).length; }

function logViewCount() {
  // With deduplication, the log view keeps one row per statement id (ReplacingMergeTree + FINAL view)
  return dedupBox.checked() ? truthCount() : deliveries.length;
}

function deliverNext() {
  let note = '';
  // At a batch boundary the processor commits the previous batch's offset before fetching the next
  if (readPos > committed && readPos % BATCH === 0) {
    if (rng() * 100 < redeliverySlider.value()) {
      const from = committed, to = readPos - 1;
      readPos = committed;
      note = 'The processor crashed before committing ' + IDS[from] + '-' + IDS[to] + ', so that batch is delivered again. ';
    } else {
      committed = readPos;
    }
  }
  if (readPos >= N_STATEMENTS) {
    message = 'All twelve statements are written and committed. Compare the writers with the truth line, or press Reset.';
    messageKind = 'info';
    return;
  }
  const id = IDS[readPos];
  readPos++;
  processStatement(id, note);
}

function processStatement(id, note) {
  const before = deliveredCount[id] || 0;
  deliveredCount[id] = before + 1;
  deliveries.push({ id, n: before + 1 });
  // Writer A: increment per delivery.  Writer B: absolute value recomputed from the log.
  writerA += 1;
  writerB = logViewCount();
  const truth = truthCount();
  if (before === 0) {
    message = note + id + ' delivered once: one new log row. Writer A adds 1 and Writer B recomputes ' + writerB +
      '; both match the truth of ' + truth + (writerA !== truth ? ', except Writer A still carries its earlier error.' : '.');
    messageKind = writerA === truth ? 'ok' : 'warn';
  } else if (dedupBox.checked()) {
    message = note + id + ' arrived again (delivery ' + (before + 1) + '). The log keeps one row per statement id, ' +
      'so Writer B recomputes ' + writerB + ' and stays on the truth line. Writer A adds 1 anyway and now reads ' +
      writerA + ', ' + (writerA - truth) + ' above the truth: an increment cannot tell a repeat from a new statement.';
    messageKind = 'warn';
  } else {
    message = note + id + ' arrived again and the log stored a second row. Writer B recomputed faithfully from the ' +
      'log, but the log was wrong: the deduplication layer failed, not the writer. Writer A is wrong for its own ' +
      'reason: it increments.';
    messageKind = 'bad';
  }
}

function crashBeforeCommit() {
  if (readPos === committed) {
    message = 'Nothing has been delivered since the last commit, so a crash now would redeliver nothing. ' +
      'Deliver a statement first.';
    messageKind = 'info';
    return;
  }
  const from = committed, to = readPos - 1;
  readPos = committed;
  message = 'Crash! The processor wrote ' + IDS[from] + (to > from ? '-' + IDS[to] : '') + ' but died before committing ' +
    'the offset. The stream will deliver ' + (to > from ? 'them' : 'it') + ' again: press Deliver next statement.';
  messageKind = 'warn';
}

function onDedupChanged() {
  // The summarizer recomputes Writer B from whatever the log view holds now
  const old = writerB;
  if (deliveries.length) writerB = logViewCount();
  if (dedupBox.checked()) {
    message = 'Deduplication is back on: the log view keeps one row per statement id. Writer B recomputes ' + writerB +
      (old !== writerB ? ' (it was ' + old + ') and heals, because it writes an absolute value.' : '.') +
      ' Writer A cannot heal: nothing records which of its increments were repeats.';
    messageKind = 'ok';
  } else {
    message = 'Deduplication is off: every delivery becomes a row, repeats included. Watch what that does to Writer B.';
    messageKind = 'warn';
  }
}

// ---------- Layout ----------
function narrow() { return canvasWidth < 500; }

function layoutControls() {
  const rowH = 34, x0 = 10, gap = 10;
  for (const el of [deliverButton, crashButton, resetButton, dedupBox]) el.position(0, 0);
  const wD = deliverButton.elt.offsetWidth, wC = crashButton.elt.offsetWidth, wR = resetButton.elt.offsetWidth;
  const wX = dedupBox.elt.offsetWidth;
  textSize(14);
  textStyle(BOLD);
  const labelW = textWidth('Redelivery chance: 50%') + 12;
  textStyle(NORMAL);
  let rows;
  if (x0 + wD + gap + wC + gap + wR <= canvasWidth - margin && x0 + labelW + 120 + gap + wX <= canvasWidth - margin) {
    rows = 2;
    controlHeight = rows * rowH + 12;
    drawHeight = canvasHeight - controlHeight;
    const y1 = drawHeight + 8, y2 = y1 + rowH;
    deliverButton.position(x0, y1);
    crashButton.position(x0 + wD + gap, y1);
    resetButton.position(x0 + wD + gap + wC + gap, y1);
    const sw = max(120, canvasWidth - margin - x0 - labelW - gap - wX - 16);
    redeliverySlider.position(x0 + labelW, y2 + 2);
    redeliverySlider.size(sw);
    dedupBox.position(x0 + labelW + sw + 16, y2 + 3);
    sliderLabelSpot = { x: x0, y: y2 + 12 };
  } else {
    rows = 3;
    controlHeight = rows * rowH + 12;
    drawHeight = canvasHeight - controlHeight;
    const y1 = drawHeight + 8, y2 = y1 + rowH, y3 = y2 + rowH;
    deliverButton.position(x0, y1);
    crashButton.position(x0 + wD + gap, y1);
    resetButton.position(x0, y2);
    dedupBox.position(x0 + wR + gap + 6, y2 + 3);
    redeliverySlider.position(x0 + labelW, y3 + 2);
    redeliverySlider.size(canvasWidth - x0 - labelW - margin - 6);
    sliderLabelSpot = { x: x0, y: y3 + 12 };
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
  text('Redelivery and Idempotency Lab', margin, 8);
  textStyle(NORMAL);

  const msgH = narrow() ? 96 : 82;
  const top = 40, bottom = drawHeight - msgH - 16;
  if (narrow()) {
    drawQueueStrip(margin, top, canvasWidth - 2 * margin, 44);
    const y2 = top + 54;
    const half = (canvasWidth - 2 * margin - 10) / 2;
    drawLog(margin, y2, half, bottom - y2);
    drawCountersStacked(margin + half + 10, y2, half, bottom - y2);
  } else {
    const qW = 96, pW = min(150, canvasWidth * 0.17);
    const rest = canvasWidth - 2 * margin - qW - pW - 3 * 14;
    const logW = rest * 0.52, cW = rest - logW;
    let x = margin;
    drawQueueColumn(x, top, qW, bottom - top);
    x += qW + 14;
    drawProcessor(x, top, pW, bottom - top);
    x += pW + 14;
    drawLog(x, top, logW, bottom - top);
    x += logW + 14;
    if (cW >= 190) drawCountersSideBySide(x, top, cW, bottom - top);
    else drawCountersStacked(x, top, cW, bottom - top);
  }
  drawMessage(margin, drawHeight - msgH - 8, canvasWidth - 2 * margin, msgH);
  drawControlLabels();
}

function statusOf(i) {
  if (i < committed) return 'committed';
  if (i < readPos) return 'written';
  return 'waiting';
}

function drawStatementBox(i, x, y, w, h, small) {
  const st = statusOf(i);
  const next = i === readPos;
  let f = color(255), s = color(170);
  if (st === 'committed') { f = color(228); s = color(190); }
  if (st === 'written') { f = color(255, 243, 205); s = color(200, 150, 0); }
  stroke(next ? color(0) : s);
  strokeWeight(next ? 2 : 1);
  fill(f);
  rect(x, y, w, h, 4);
  noStroke();
  fill(st === 'committed' ? 110 : 0);
  textAlign(CENTER, CENTER);
  textSize(small ? 10 : 12);
  text(small ? IDS[i].slice(3) : IDS[i], x + w / 2, y + h / 2);
  const times = deliveredCount[IDS[i]] || 0;
  if (times > 1 && !small) {
    fill(A_COLOR);
    textSize(10);
    textAlign(RIGHT, CENTER);
    text('x' + times, x + w - 3, y + h / 2);
  }
}

function drawQueueColumn(x, y, w, h) {
  noStroke();
  fill(60);
  textAlign(LEFT, TOP);
  textSize(12);
  textStyle(BOLD);
  text('Stream', x, y);
  textStyle(NORMAL);
  const boxH = min(22, (h - 18 - 3 * 8 - 34) / N_STATEMENTS);   // leave room for the two-line legend
  let yy = y + 18;
  for (let i = 0; i < N_STATEMENTS; i++) {
    if (i > 0 && i % BATCH === 0) yy += 8;
    drawStatementBox(i, x + 14, yy, w - 14, boxH - 2, false);
    if (i % BATCH === 0) {
      noStroke();
      fill(120);
      textSize(9);
      textAlign(LEFT, TOP);
      push();
      translate(x + 2, yy + 3 * boxH - 4);
      rotate(-HALF_PI);
      text('batch ' + (i / BATCH + 1), 0, 0);
      pop();
    }
    yy += boxH;
  }
  // legend
  noStroke();
  textSize(10);
  textAlign(LEFT, TOP);
  fill(110);
  text('gray = committed', x, yy + 4);
  fill(150, 110, 0);
  text('yellow = not yet', x, yy + 16);
}

function drawQueueStrip(x, y, w, h) {
  noStroke();
  fill(60);
  textAlign(LEFT, TOP);
  textSize(12);
  textStyle(BOLD);
  text('Stream (batches of 3)', x, y);
  textStyle(NORMAL);
  const gapB = 6;
  const bw = (w - 3 * gapB) / N_STATEMENTS;
  let xx = x;
  for (let i = 0; i < N_STATEMENTS; i++) {
    if (i > 0 && i % BATCH === 0) xx += gapB;
    drawStatementBox(i, xx, y + 16, bw - 2, 22, true);
    xx += bw;
  }
  // processor status beside the title
  textAlign(RIGHT, TOP);
  textSize(11);
  fill(60);
  text('committed offset: ' + committed + '  next: ' + (readPos < N_STATEMENTS ? IDS[readPos] : 'end'), x + w, y + 1);
}

function drawProcessor(x, y, w, h) {
  const bh = 150;
  const by = y + 18;
  stroke(120);
  strokeWeight(1);
  fill(255);
  rect(x, by, w, bh, 8);
  noStroke();
  fill(0);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  textSize(14);
  text('Processor', x + w / 2, by + 8);
  textStyle(NORMAL);
  textSize(12);
  fill(50);
  textAlign(LEFT, TOP);
  let ty = by + 30;
  ty = drawWrapped('1. write the batch to the log', x + 8, ty, w - 14, 15);
  ty = drawWrapped('2. commit the offset', x + 8, ty + 2, w - 14, 15);
  ty += 8;
  fill(0);
  text('committed: ' + committed, x + 8, ty);
  text('next: ' + (readPos < N_STATEMENTS ? IDS[readPos] : 'end'), x + 8, ty + 16);
  // arrows: stream -> processor -> log
  stroke(150);
  strokeWeight(2);
  const ay = by + bh / 2;
  line(x - 12, ay, x - 2, ay);
  line(x + w + 2, ay, x + w + 12, ay);
  noStroke();
  fill(150);
  triangle(x - 2, ay, x - 8, ay - 4, x - 8, ay + 4);
  triangle(x + w + 12, ay, x + w + 6, ay - 4, x + w + 6, ay + 4);
  // idempotency rules
  fill(70);
  textSize(11);
  drawWrapped('At-least-once: a crash between 1 and 2 means the batch is delivered again.', x, by + bh + 10, w, 14);
}

function drawLog(x, y, w, h) {
  const dedup = dedupBox.checked();
  noStroke();
  fill(60);
  textAlign(LEFT, TOP);
  textSize(12);
  textStyle(BOLD);
  text(w < 250 ? 'Log' : 'Log (lrs.statements)', x, y);
  textStyle(NORMAL);
  // deduplication indicator
  const badge = dedup ? 'dedup ON' : 'dedup OFF';
  textSize(11);
  const bw = textWidth(badge) + 12;
  fill(dedup ? color(OK_GREEN) : color(A_COLOR));
  rect(x + w - bw, y - 2, bw, 16, 8);
  fill(255);
  textAlign(CENTER, TOP);
  text(badge, x + w - bw / 2, y);
  // table
  stroke(180);
  strokeWeight(1);
  fill(255);
  rect(x, y + 18, w, h - 18, 6);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(11);
  fill(90);
  text('statement id', x + 8, y + 24);
  if (w > 170) text('delivery', x + w * 0.52, y + 24);
  const rowH = 17;
  const maxRows = floor((h - 18 - 44) / rowH);
  const start = max(0, deliveries.length - maxRows);
  let ry = y + 42;
  for (let k = start; k < deliveries.length; k++) {
    const d = deliveries[k];
    const dup = d.n > 1;
    if (dup && dedup) fill(150);
    else if (dup) fill(A_COLOR);
    else fill(0);
    textSize(12);
    text(d.id, x + 8, ry);
    textSize(11);
    let tag = '#' + d.n;
    if (dup) tag += dedup ? ' merged away' : ' kept';
    text(w > 170 ? tag : (dup ? (dedup ? 'merged' : 'dup') : ''), w > 170 ? x + w * 0.52 : x + 50, ry + 1);
    if (dup && dedup) {
      stroke(150);
      strokeWeight(1);
      line(x + 6, ry + 7, x + 8 + textWidth(d.id) + 4, ry + 7);
      noStroke();
    }
    ry += rowH;
  }
  if (start > 0) {
    fill(100);
    textSize(10);
    text('(' + start + ' earlier rows scrolled up)', x + 8, y + h - 16);
  } else if (deliveries.length === 0) {
    fill(120);
    textSize(12);
    text('empty', x + 8, ry);
  }
  // footer count
  fill(0);
  textSize(11);
  textAlign(RIGHT, TOP);
  text('rows in view: ' + logViewCount(), x + w - 8, y + h - 16);
  textAlign(LEFT, TOP);
}

function counterScale() { return max([N_STATEMENTS + 2, writerA + 2, writerB + 2]); }

function drawCountersSideBySide(x, y, w, h) {
  noStroke();
  fill(60);
  textAlign(LEFT, TOP);
  textSize(12);
  textStyle(BOLD);
  text('Counters', x, y);
  textStyle(NORMAL);
  const top = y + 64, base = y + h - 34;
  const scaleMax = counterScale();
  const colW = (w - 20) / 2;
  const bars = [
    { label: 'Writer A', rule: 'count += 1', v: writerA, c: A_COLOR },
    { label: 'Writer B', rule: 'count = recomputed from log', v: writerB, c: B_COLOR }
  ];
  bars.forEach((b, i) => {
    const bx = x + 10 + i * colW;
    const barW = min(60, colW - 20);
    const cx = bx + colW / 2;
    // header
    noStroke();
    fill(b.c);
    textAlign(CENTER, TOP);
    textSize(13);
    textStyle(BOLD);
    text(b.label, cx, y + 18);
    textStyle(NORMAL);
    textSize(11);
    fill(40);
    drawWrappedCenter(b.rule, cx, y + 34, colW - 6, 13);
    // bar
    fill(235);
    rect(cx - barW / 2, top, barW, base - top);
    const hh = (base - top) * b.v / scaleMax;
    fill(b.c);
    rect(cx - barW / 2, base - hh, barW, hh);
    fill(0);
    textSize(16);
    textStyle(BOLD);
    text(b.v, cx, base + 6);
    textStyle(NORMAL);
    const off = b.v - truthCount();
    if (off !== 0) {
      fill(A_COLOR);
      textSize(11);
      text((off > 0 ? '+' : '') + off + ' vs truth', cx, base - hh - 16 < top ? top + 2 : base - hh - 16);
    }
  });
  // truth line across both bars; its label sits under the column title
  const ty = base - (base - top) * truthCount() / scaleMax;
  stroke(TRUTH);
  strokeWeight(2);
  drawingContext.setLineDash([6, 4]);
  line(x + 4, ty, x + w - 4, ty);
  drawingContext.setLineDash([]);
  noStroke();
  fill(0);
  textSize(11);
  textAlign(RIGHT, TOP);
  text('dashed line = truth: ' + truthCount() + ' distinct', x + w, y + 1);
}

function drawCountersStacked(x, y, w, h) {
  noStroke();
  fill(60);
  textAlign(LEFT, TOP);
  textSize(12);
  textStyle(BOLD);
  text(narrow() ? 'Counters' : 'Summary counters', x, y);
  textStyle(NORMAL);
  const scaleMax = counterScale();
  const bars = [
    { label: 'Writer A: count += 1', v: writerA, c: A_COLOR },
    { label: 'Writer B: count = recomputed from log', v: writerB, c: B_COLOR }
  ];
  const slot = (h - 44) / 2;
  const bx = x, bw = w - 30;
  bars.forEach((b, i) => {
    const by = y + 20 + i * slot;
    noStroke();
    fill(b.c);
    textSize(12);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    const endY = drawWrapped(b.label, bx, by, w, 14);
    textStyle(NORMAL);
    const barY = endY + 4, barH = min(26, slot - (endY - by) - 26);
    fill(235);
    rect(bx, barY, bw, barH);
    fill(b.c);
    rect(bx, barY, bw * b.v / scaleMax, barH);
    fill(0);
    textSize(15);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text(b.v, bx + bw + 4, barY + barH / 2);
    textStyle(NORMAL);
    const off = b.v - truthCount();
    textSize(11);
    textAlign(LEFT, TOP);
    fill(off ? color(A_COLOR) : color(OK_GREEN));
    text(off ? (off > 0 ? '+' : '') + off + ' vs truth' : 'on the truth line', bx, barY + barH + 3);
    // truth line through this bar
    const tx = bx + bw * truthCount() / scaleMax;
    stroke(TRUTH);
    strokeWeight(2);
    drawingContext.setLineDash([4, 3]);
    line(tx, barY - 4, tx, barY + barH + 4);
    drawingContext.setLineDash([]);
  });
  noStroke();
  fill(0);
  textSize(11);
  textAlign(LEFT, TOP);
  let foot = 'dashed line = truth: ' + truthCount() + ' distinct';
  if (textWidth(foot) > w) foot = 'dashed = truth: ' + truthCount();
  text(foot, x, y + h - 14);
}

function drawMessage(x, y, w, h) {
  stroke(200);
  strokeWeight(1);
  fill(255, 255, 255, 235);
  rect(x, y, w, h, 10);
  noStroke();
  const c = messageKind === 'ok' ? color(OK_GREEN) : messageKind === 'warn' ? color(150, 80, 0)
    : messageKind === 'bad' ? color(A_COLOR) : color(40);
  fill(c);
  textAlign(LEFT, TOP);
  textSize(narrow() ? 12 : 13);
  drawWrapped(message, x + 10, y + 8, w - 20, narrow() ? 15 : 16);
}

function drawControlLabels() {
  if (!sliderLabelSpot) return;
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(14);
  textStyle(BOLD);
  const lab = 'Redelivery chance: ';
  text(lab, sliderLabelSpot.x, sliderLabelSpot.y);
  const lw = textWidth(lab);
  textStyle(NORMAL);
  text(redeliverySlider.value() + '%', sliderLabelSpot.x + lw, sliderLabelSpot.y);
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

function drawWrappedCenter(s, cx, y, w, lh) {
  for (const l of wrapWords(s, w)) { text(l, cx, y); y += lh; }
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
