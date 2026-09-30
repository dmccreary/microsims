// Held-Out Split Explorer - p5.js MicroSim
// CANVAS_HEIGHT: 540
// One synthetic learner's xAPI timeline: practice answers, exposure events and one held-out
// assessment answer (a transfer item). Drag the forecast cutoff; the model may use only the
// statements before it. Statements produced at or after the held-out assessment, or used even
// though they come after the cutoff, are leakage and get a vermillion ring.
// The forecast is the Chapter 18 BKT update (L0 0.30, pt 0.15, pg 0.20, ps 0.10) converted to
// the chance of a correct next answer. The "mock cohort accuracy" values come from the
// chapter 19 synthetic cohort (200 learners, seed 19), recomputed offline in Python:
//   BKT accuracy on the held-out item using the first k practice answers, k = 0..4:
//   0.365, 0.530, 0.660, 0.685, 0.705 (base rate 0.635);
//   the same model when it also sees the held-out answer itself: 0.910.

// ---------- canvas layout ----------
let canvasWidth = 400;
let canvasHeight = 540;          // must equal CANVAS_HEIGHT above
let controlHeight = 46;          // recomputed by layoutControls()
let drawHeight = canvasHeight - controlHeight;
let margin = 25;
let defaultTextSize = 16;
let rowStep = 34;

// ---------- colors (Okabe-Ito) ----------
const TYPE_STYLE = {
  practice: { color: [0, 114, 178], lane: 'Practice answers', short: 'practice' },
  exposure: { color: [230, 159, 0], lane: 'Exposure events', short: 'exposure' },
  heldout: { color: [204, 121, 167], lane: 'Held-out assessment', short: 'held-out' }
};
const LEAK_COLOR = [213, 94, 0];     // vermillion
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

// ---------- the learner's fixed, hand-written timeline ----------
const STATEMENTS = [
  { id: 1, day: 0, time: '09:00', type: 'exposure', text: 'experienced page "Ratios"' },
  { id: 2, day: 0, time: '09:06', type: 'exposure', text: 'interacted: ratio-table MicroSim slider' },
  { id: 3, day: 0, time: '09:10', type: 'practice', text: 'answered practice item 1', correct: true },
  { id: 4, day: 0, time: '09:14', type: 'practice', text: 'answered practice item 2', correct: false },
  { id: 5, day: 1, time: '13:30', type: 'exposure', text: 'experienced worked example' },
  { id: 6, day: 1, time: '13:41', type: 'practice', text: 'answered practice item 3', correct: true },
  { id: 7, day: 2, time: '10:02', type: 'exposure', text: 'interacted: ratio-table MicroSim' },
  { id: 8, day: 2, time: '10:09', type: 'practice', text: 'answered practice item 4', correct: true },
  { id: 9, day: 3, time: '09:00', type: 'heldout', text: 'answered held-out transfer item', correct: true },
  { id: 10, day: 3, time: '09:05', type: 'exposure', text: 'experienced assessment feedback' },
  { id: 11, day: 3, time: '09:12', type: 'practice', text: 'answered practice item 1 (retry)', correct: true },
  { id: 12, day: 4, time: '11:20', type: 'exposure', text: 'experienced review page' }
];
const ASSESSMENT_INDEX = 8;          // position of the first held-out answer in STATEMENTS
const ACC_BY_PRACTICE = [0.365, 0.530, 0.660, 0.685, 0.705];
const ACC_LEAKED = 0.910;
const BASE_RATE = 0.635;
const BKT = { L0: 0.30, pt: 0.15, pg: 0.20, ps: 0.10 };

// ---------- state ----------
let cutoffUnit;                      // cutoff position in timeline units
let leakCheckbox, resetButton;
let draggingCutoff = false;
let L = null;                        // layout regions for this frame
let units = [];                      // x position of each statement in timeline units
let unitMax = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // evenly spaced markers with an extra gap between days
  for (let i = 0; i < STATEMENTS.length; i++) units.push(i + STATEMENTS[i].day * 0.9);
  unitMax = units[units.length - 1];

  leakCheckbox = createCheckbox(' Allow the model to see assessment answers', false);
  leakCheckbox.parent(document.querySelector('main'));
  leakCheckbox.style('display', 'inline-block');     // p5 wraps checkboxes in a full-width div
  leakCheckbox.changed(() => logEvent('leakage checkbox ' + (leakCheckbox.checked() ? 'on' : 'off')));
  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(resetAll);

  resetAll();
  layoutControls();

  describe('A timeline of twelve xAPI statements from one synthetic learner over five days, in three lanes: ' +
    'practice answers, exposure events and one held-out assessment answer on Thursday. A dashed vertical ' +
    'forecast cutoff can be dragged along the timeline. A side panel lists the statements the model may use, ' +
    'and a readout shows the forecast and a mock cohort accuracy. Statements used at or after the held-out ' +
    'assessment are ringed as leakage.');
}

function resetAll() {
  // default cutoff: in the gap between Wednesday and Thursday, before the held-out assessment
  cutoffUnit = (units[ASSESSMENT_INDEX - 1] + units[ASSESSMENT_INDEX]) / 2;
  if (leakCheckbox) leakCheckbox.checked(false);
}

function logEvent(msg) {
  console.log('[fidelity-held-out-split-explorer] ' + msg);
}

// ---------- model ----------
function isBeforeCutoff(i) { return units[i] < cutoffUnit; }
function isUsed(i) {
  return isBeforeCutoff(i) || (leakCheckbox.checked() && STATEMENTS[i].type === 'heldout');
}
// Leakage: in use although it is a held-out answer, was produced after the held-out
// assessment, or lies after the forecast cutoff.
function isLeak(i) {
  return isUsed(i) && (STATEMENTS[i].type === 'heldout' || i > ASSESSMENT_INDEX || !isBeforeCutoff(i));
}

function bktForecast(answers) {
  let p = BKT.L0;
  for (const correct of answers) {
    let c;
    if (correct) c = p * (1 - BKT.ps) / (p * (1 - BKT.ps) + (1 - p) * BKT.pg);
    else c = p * BKT.ps / (p * BKT.ps + (1 - p) * (1 - BKT.pg));
    p = c + (1 - c) * BKT.pt;
  }
  return p * (1 - BKT.ps) + (1 - p) * BKT.pg;     // chance of a correct next answer
}

function evaluate() {
  const used = [], answers = [];
  let practiceUsed = 0, leaks = 0, exposures = 0;
  STATEMENTS.forEach((s, i) => {
    if (!isUsed(i)) return;
    used.push(i);
    if (isLeak(i)) leaks++;
    if (s.type === 'exposure') exposures++;
    else {
      answers.push(s.correct);
      if (s.type === 'practice' && i < ASSESSMENT_INDEX) practiceUsed++;
    }
  });
  const leaked = leaks > 0;
  return {
    used, answers, leaks, leaked, exposures,
    forecast: bktForecast(answers),
    accuracy: leaked ? ACC_LEAKED : ACC_BY_PRACTICE[Math.min(4, practiceUsed)],
    practiceUsed
  };
}

// ---------- layout ----------
function computeLayout() {
  const narrow = canvasWidth < 620;
  const top = 36;
  const g = { narrow };
  if (!narrow) {
    const leftW = Math.floor(canvasWidth * 0.6);
    const tlH = Math.max(200, Math.min(250, drawHeight - top - 200));
    g.timeline = { x: 8, y: top, w: leftW - 12, h: tlH };
    g.readout = { x: 8, y: top + tlH + 8, w: leftW - 12, h: drawHeight - top - tlH - 16 };
    g.panel = { x: leftW + 2, y: top, w: canvasWidth - leftW - 10, h: drawHeight - top - 8 };
  } else {
    g.timeline = { x: 6, y: top, w: canvasWidth - 12, h: 156 };
    const panelH = 136;
    g.readout = { x: 6, y: top + 162, w: canvasWidth - 12, h: drawHeight - top - 162 - panelH - 12 };
    g.panel = { x: 6, y: drawHeight - panelH - 6, w: canvasWidth - 12, h: panelH };
  }
  const t = g.timeline;
  g.labelW = narrow ? 70 : 92;
  g.x0 = t.x + g.labelW + 14;
  g.x1 = t.x + t.w - 14;
  g.dayY = t.y + 16;
  const laneTop = t.y + 34, laneBottom = t.y + t.h - 22;
  const laneH = (laneBottom - laneTop) / 3;
  g.laneY = { practice: laneTop + laneH * 0.5, exposure: laneTop + laneH * 1.5, heldout: laneTop + laneH * 2.5 };
  g.laneH = laneH;
  g.xOfUnit = u => map(u, -0.6, unitMax + 0.6, g.x0, g.x1);
  g.unitOfX = x => map(x, g.x0, g.x1, -0.6, unitMax + 0.6);
  g.marker = narrow ? 13 : 16;
  return g;
}

// ---------- drawing ----------
function draw() {
  updateCanvasSize();
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  L = computeLayout();
  const ev = evaluate();

  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(L.narrow ? 18 : 21);
  text('Held-Out Split Explorer', canvasWidth / 2, 7);

  drawTimeline(ev);
  drawReadout(ev);
  drawPanel(ev);
  drawHover();
}

function drawTimeline(ev) {
  const t = L.timeline;
  stroke(205);
  strokeWeight(1);
  fill('white');
  rect(t.x, t.y, t.w, t.h, 8);

  // day bands and labels
  for (let d = 0; d < DAYS.length; d++) {
    const idx = STATEMENTS.map((s, i) => (s.day === d ? i : -1)).filter(i => i >= 0);
    const xa = L.xOfUnit(units[idx[0]] - 0.45), xb = L.xOfUnit(units[idx[idx.length - 1]] + 0.45);
    noStroke();
    fill(d % 2 === 0 ? 244 : 236, d % 2 === 0 ? 247 : 242, 252);
    rect(xa, t.y + 26, xb - xa, t.h - 44, 4);
    fill(60);
    textSize(L.narrow ? 11 : 13);
    textAlign(CENTER, CENTER);
    text(DAYS[d], (xa + xb) / 2, L.dayY);
  }

  // lane labels with the lane's marker shape
  for (const type of ['practice', 'exposure', 'heldout']) {
    const y = L.laneY[type];
    stroke(225);
    line(L.x0 - 6, y, L.x1, y);
    noStroke();
    fill(40);
    textSize(L.narrow ? 11 : 13);
    textAlign(LEFT, CENTER);
    const words = TYPE_STYLE[type].lane.split(' ');
    text(words[0], t.x + 8, y - 7);
    text(words.slice(1).join(' '), t.x + 8, y + 8);
  }

  // cutoff shading: statements to the right are out of the forecast window
  const cx = L.xOfUnit(cutoffUnit);
  noStroke();
  fill(120, 120, 120, 28);
  rect(cx, t.y + 26, L.x1 + 10 - cx, t.h - 44);

  // markers
  STATEMENTS.forEach((s, i) => drawMarker(s, i));

  // cutoff line and handle
  stroke(30);
  strokeWeight(2);
  drawingContext.setLineDash([6, 4]);
  line(cx, t.y + 24, cx, t.y + t.h - 16);
  drawingContext.setLineDash([]);
  fill(draggingCutoff ? 'black' : 'white');
  stroke(30);
  strokeWeight(2);
  triangle(cx - 7, t.y + t.h - 6, cx + 7, t.y + t.h - 6, cx, t.y + t.h - 16);
  noStroke();
  fill(30);
  textSize(11);
  textAlign(cx > L.x1 - 80 ? RIGHT : LEFT, CENTER);
  text('forecast cutoff (drag)', cx + (cx > L.x1 - 80 ? -9 : 9), t.y + t.h - 9);
}

function drawMarker(s, i) {
  const x = L.xOfUnit(units[i]);
  const y = L.laneY[s.type];
  const m = L.marker;
  const used = isUsed(i);
  const leak = isLeak(i);
  const c = TYPE_STYLE[s.type].color;
  if (leak) {
    noFill();
    stroke(LEAK_COLOR);
    strokeWeight(3.5);
    circle(x, y, m + 14);
  }
  stroke(used ? 40 : 170);
  strokeWeight(1.2);
  fill(used ? color(c[0], c[1], c[2]) : color(c[0], c[1], c[2], 70));
  if (s.type === 'practice') circle(x, y, m + 2);
  else if (s.type === 'exposure') { rectMode(CENTER); rect(x, y, m - 2, m - 2); rectMode(CORNER); }
  else quad(x, y - m * 0.8, x + m * 0.8, y, x, y + m * 0.8, x - m * 0.8, y);
  // correct / incorrect glyph inside answer markers
  noStroke();
  if (s.correct !== undefined) {
    fill(255, 255, 255, used ? 255 : 170);
    textSize(m * 0.7);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(s.correct ? '✓' : '✗', x, y + 1);
    textStyle(NORMAL);
  }
  // statement number below each marker
  fill(used ? 30 : 150);
  textSize(L.narrow ? 10 : 11);
  textAlign(CENTER, TOP);
  text('#' + s.id, x, y + m * 0.8 + 2);
}

function drawReadout(ev) {
  const r = L.readout;
  stroke(205);
  strokeWeight(1);
  fill('white');
  rect(r.x, r.y, r.w, r.h, 8);
  const pad = 10;
  let y = r.y + 14;
  const fs = L.narrow ? 13 : 15;
  noStroke();
  textAlign(LEFT, CENTER);

  const before = cutoffNeighbors();
  fill(50);
  textSize(fs - 2);
  text('Cutoff: ' + before, r.x + pad, y);
  y += fs + 6;

  fill('black');
  textSize(fs);
  textStyle(BOLD);
  text('Forecast of a correct held-out answer: ' + ev.forecast.toFixed(2), r.x + pad, y);
  textStyle(NORMAL);
  y += fs + 5;
  if (!L.narrow) {
    // (on narrow screens the panel list below already shows what is in use)
    textSize(fs - 1);
    const answersText = ev.answers.length + ' answer' + (ev.answers.length === 1 ? '' : 's') +
      ' (' + ev.answers.filter(a => a).length + ' correct), ' + ev.exposures + ' exposure event' +
      (ev.exposures === 1 ? '' : 's') + ' in use';
    text(answersText, r.x + pad, y);
    y += fs + 6;
  } else {
    y += 2;
  }

  textSize(fs - 1);
  textStyle(BOLD);
  if (ev.leaked) fill(LEAK_COLOR);
  text('Mock cohort accuracy: ' + ev.accuracy.toFixed(3), r.x + pad, y);
  textStyle(NORMAL);
  fill(60);
  textSize(fs - 3);
  const accX = r.x + pad + (textWidthAt(fs - 1, 'Mock cohort accuracy: 0.000', true)) + 8;
  if (accX < r.x + r.w - 110) text('(baseline ' + BASE_RATE.toFixed(3) + ')', accX, y + 1);
  y += fs + 8;

  // verdict banner
  const bannerH = Math.max(24, r.y + r.h - y - 6);
  if (ev.leaked) {
    fill(LEAK_COLOR[0], LEAK_COLOR[1], LEAK_COLOR[2], 30);
    stroke(LEAK_COLOR);
  } else {
    fill(0, 158, 115, 25);
    stroke(0, 158, 115);
  }
  strokeWeight(1.5);
  rect(r.x + 6, y - 4, r.w - 12, Math.min(bannerH, 46), 6);
  noStroke();
  fill(ev.leaked ? color(150, 50, 0) : color(0, 100, 70));
  textSize(fs - 1);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  const msg = ev.leaked
    ? 'Score is inflated: the forecast saw its own answer key.'
    : 'Clean split: every statement in use comes before the held-out assessment.';
  text(msg, r.x + 14, y + 2, r.w - 28, 40);
  textStyle(NORMAL);
}

function textWidthAt(size, s, bold) {
  push();
  textSize(size);
  textStyle(bold ? BOLD : NORMAL);
  const w = textWidth(s);
  pop();
  return w;
}

function cutoffNeighbors() {
  let before = -1;
  for (let i = 0; i < STATEMENTS.length; i++) if (units[i] < cutoffUnit) before = i;
  const stamp = i => DAYS[STATEMENTS[i].day] + ' ' + STATEMENTS[i].time;
  if (before < 0) return 'before the first statement (' + stamp(0) + ')';
  if (before === STATEMENTS.length - 1) return 'after the last statement (' + stamp(before) + ')';
  return 'after #' + STATEMENTS[before].id + ' (' + stamp(before) + '), before #' +
    STATEMENTS[before + 1].id + ' (' + stamp(before + 1) + ')';
}

function drawPanel(ev) {
  const p = L.panel;
  stroke(205);
  strokeWeight(1);
  fill('white');
  rect(p.x, p.y, p.w, p.h, 8);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(L.narrow ? 14 : 15);
  textStyle(BOLD);
  text('Statements the model may use (' + ev.used.length + ')', p.x + 10, p.y + 8);
  textStyle(NORMAL);

  const cols = L.narrow ? 2 : 1;
  const lineH = L.narrow ? 15 : 21;
  const fs = L.narrow ? 11 : 13;
  const colW = (p.w - 16) / cols;
  const listTop = p.y + 32;
  const perCol = Math.ceil(Math.max(ev.used.length, 1) / cols);
  if (ev.used.length === 0) {
    fill(90);
    textSize(fs);
    text('None: the cutoff is before the first statement.', p.x + 10, listTop, p.w - 20, 40);
  }
  ev.used.forEach((i, k) => {
    const s = STATEMENTS[i];
    const c = Math.floor(k / perCol), r = k % perCol;
    const x = p.x + 8 + c * colW, y = listTop + r * lineH;
    const leak = isLeak(i);
    if (leak) {
      noFill();
      stroke(LEAK_COLOR);
      strokeWeight(2);
      rect(x - 2, y - 2, colW - 4, lineH - 2, 4);
    }
    // small type swatch
    const col = TYPE_STYLE[s.type].color;
    noStroke();
    fill(col[0], col[1], col[2]);
    circle(x + 6, y + lineH / 2 - 1, 8);
    fill(leak ? color(150, 50, 0) : color(20));
    textSize(fs);
    textAlign(LEFT, CENTER);
    let label = '#' + s.id + ' ' + DAYS[s.day] + ' ' + s.time + ' ' + TYPE_STYLE[s.type].short;
    if (s.correct !== undefined) label += s.correct ? ' ✓' : ' ✗';
    if (leak) label += L.narrow ? ' !' : '  LEAK';
    text(label, x + 14, y + lineH / 2 - 1);
  });

  // footnote (skipped on narrow screens when the two-column list needs the room)
  const noteY = p.y + p.h - (L.narrow ? 16 : 40);
  if (listTop + perCol * lineH > noteY - 2) return;
  fill(80);
  textSize(L.narrow ? 10 : 12);
  textAlign(LEFT, TOP);
  const note = L.narrow
    ? 'Exposure events carry no right or wrong, so BKT uses only answers.'
    : 'Exposure events carry no right or wrong answer, so the BKT forecast uses only the answers.';
  text(note, p.x + 10, noteY, p.w - 20, 40);
}

function markerAt(mx, my) {
  if (!L) return -1;
  for (let i = 0; i < STATEMENTS.length; i++) {
    const x = L.xOfUnit(units[i]), y = L.laneY[STATEMENTS[i].type];
    if (dist(mx, my, x, y) <= L.marker * 0.8 + 3) return i;
  }
  return -1;
}

function drawHover() {
  if (draggingCutoff) { cursor('ew-resize'); return; }
  const i = markerAt(mouseX, mouseY);
  if (i < 0) {
    const nearCutoff = L && Math.abs(mouseX - L.xOfUnit(cutoffUnit)) < 10 &&
      mouseY > L.timeline.y && mouseY < L.timeline.y + L.timeline.h;
    cursor(nearCutoff ? 'ew-resize' : ARROW);
    return;
  }
  cursor(ARROW);
  const s = STATEMENTS[i];
  const typeName = { practice: 'Practice answer', exposure: 'Exposure event', heldout: 'Held-out assessment answer' };
  const lines = [
    '#' + s.id + '  ' + typeName[s.type] + ', ' + DAYS[s.day] + ' ' + s.time,
    s.text + (s.correct !== undefined ? (s.correct ? ' (correct)' : ' (incorrect)') : ''),
    isLeak(i) ? 'In use, but this is leakage' : (isUsed(i) ? 'In use for the forecast' : 'Not used (after the cutoff)')
  ];
  textSize(13);
  const w = Math.max(...lines.map(l => textWidth(l))) + 16;
  const h = lines.length * 17 + 8;
  const x = constrain(mouseX + 12, 4, canvasWidth - w - 4);
  let y = mouseY + 14;
  if (y + h > drawHeight - 4) y = mouseY - h - 10;
  stroke(120);
  strokeWeight(1);
  fill(255, 255, 240);
  rect(x, y, w, h, 5);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  lines.forEach((l, k) => text(l, x + 8, y + 5 + k * 17));
}

// ---------- interaction ----------
function mousePressed() {
  if (!L || mouseY > drawHeight) return;
  const t = L.timeline;
  if (mouseX >= L.x0 - 12 && mouseX <= L.x1 + 12 && mouseY >= t.y && mouseY <= t.y + t.h) {
    draggingCutoff = true;
    setCutoffFromX(mouseX);
  }
}

function mouseDragged() {
  if (draggingCutoff) setCutoffFromX(mouseX);
}

function mouseReleased() {
  if (draggingCutoff) {
    draggingCutoff = false;
    const ev = evaluate();
    logEvent('cutoff ' + cutoffNeighbors() + '; statements in use ' + ev.used.length + '; leaks ' + ev.leaks);
  }
}

function setCutoffFromX(x) {
  cutoffUnit = constrain(L.unitOfX(x), -0.6, unitMax + 0.6);
}

// Arrow keys move the cutoff to the next gap between statements (keyboard alternative to dragging)
function keyPressed() {
  const gaps = [-0.5];
  for (let i = 0; i < units.length - 1; i++) gaps.push((units[i] + units[i + 1]) / 2);
  gaps.push(unitMax + 0.5);
  let k = 0;
  for (let j = 0; j < gaps.length; j++) if (Math.abs(gaps[j] - cutoffUnit) < Math.abs(gaps[k] - cutoffUnit)) k = j;
  if (key === 'ArrowLeft') cutoffUnit = gaps[Math.max(0, k - 1)];
  else if (key === 'ArrowRight') cutoffUnit = gaps[Math.min(gaps.length - 1, k + 1)];
}

// ---------- responsive layout ----------
function layoutControls() {
  const items = [leakCheckbox, resetButton];
  let x = 10, row = 0;
  const pos = [];
  for (const el of items) {
    const w = el.elt.offsetWidth || 100;
    if (x + w > canvasWidth - 10 && x > 10) { row++; x = 10; }
    pos.push({ el, x, row });
    x += w + 16;
  }
  controlHeight = (row + 1) * rowStep + 12;
  drawHeight = canvasHeight - controlHeight;
  for (const p of pos) p.el.position(p.x, drawHeight + 10 + p.row * rowStep);
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
