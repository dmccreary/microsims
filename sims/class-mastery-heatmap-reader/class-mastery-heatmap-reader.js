// Class Mastery Heatmap Reader - dark columns, dark rows and the at-risk roster
// CANVAS_HEIGHT: 640
// Learning objective (Analyze / distinguish): the learner distinguishes a concept that most of a
// class struggles with from a student who struggles broadly, by reading the dark columns and dark
// rows of a heatmap and by computing an at-risk score (Chapter 21, "The Teacher Dashboard").
// Data: a SYNTHETIC section of 12 students and 8 concepts, generated once from a fixed seed.
// Cells are model estimates of mastery (Chapter 18), not measured facts; darker = lower estimate,
// so a dark column is a concept the class struggles with and a dark row is a struggling student.
// Risk (the prototype teacher dashboard's formula; its weights are one demo's choices):
//   risk = wM x (1 - mean mastery) + wI x (days idle / max days idle) + wP x gap ratio
//   gap ratio = share of the 8 concepts whose prerequisites include one below 0.6 (the prototype's
//   pass line), computed from the heatmap itself.

// ---------- Canvas dimensions ----------
let canvasWidth = 800;
let canvasHeight = 640;
let controlHeight = 148;
let drawHeight = canvasHeight - controlHeight;
let margin = 12;
let sliderLeftMargin = 250;
let defaultTextSize = 16;

// ---------- Synthetic data ----------
const CONCEPTS = ['Unit circle', 'Radians', 'Sine function', 'Amplitude', 'Frequency', 'Period', 'Phase shift', 'Wave sum'];
const SHORT = ['Unit circ.', 'Radians', 'Sine', 'Amplitude', 'Frequency', 'Period', 'Phase sh.', 'Wave sum'];
const PREREQS = { 1: [0], 2: [0, 1], 3: [2], 4: [2], 5: [4], 6: [2, 5], 7: [3, 6] };
const OFFSET = [0.08, 0.02, 0, 0.05, -0.02, -0.03, -0.42, -0.08];
const WEAK_COL = 6;       // Phase shift: seeded low for most of the class
const WEAK_ROW = 7;       // Hal: seeded low for most concepts
const PASS = 0.6;
const MAX_IDLE = 10;
const STUDENTS = [
  { name: 'Ada', ability: 0.85, idle: 1 }, { name: 'Ben', ability: 0.72, idle: 3 },
  { name: 'Cam', ability: 0.78, idle: 0 }, { name: 'Dee', ability: 0.66, idle: 5 },
  { name: 'Eli', ability: 0.81, idle: 2 }, { name: 'Fay', ability: 0.70, idle: 4 },
  { name: 'Gus', ability: 0.75, idle: 1 }, { name: 'Hal', ability: 0.30, idle: 6 },
  { name: 'Ivy', ability: 0.88, idle: 0 }, { name: 'Jon', ability: 0.68, idle: 2 },
  { name: 'Kim', ability: 0.83, idle: 10 }, { name: 'Lee', ability: 0.73, idle: 3 }
];
let M = [];              // mastery[student][concept]

// ---------- State ----------
let wMastery, wIdle, wGap, patternButton, quizButton;
let showPattern = false;
let selected = -1;
let quiz = 0;            // 0 off, 1 ask concept, 2 ask student, 3 done
let quizMsg = '';
let quizOk = [false, false];
let hover = null;        // {s, c}
let geo = null;          // heatmap geometry
let rosterRows = [];     // click boxes {s, x, y, w, h}
let labelSpots = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('sans-serif');
  const main = document.querySelector('main');
  buildData();

  wMastery = createSlider(0, 1, 0.45, 0.05);
  wIdle = createSlider(0, 1, 0.30, 0.05);
  wGap = createSlider(0, 1, 0.25, 0.05);
  wMastery.attribute('aria-label', 'Weight on low mastery');
  wIdle.attribute('aria-label', 'Weight on inactivity');
  wGap.attribute('aria-label', 'Weight on prerequisite gaps');
  patternButton = createButton('Show the pattern');
  patternButton.mousePressed(() => { showPattern = !showPattern; patternButton.html(showPattern ? 'Hide the pattern' : 'Show the pattern'); });
  quizButton = createButton('Quiz me');
  quizButton.mousePressed(startQuiz);
  for (const el of [wMastery, wIdle, wGap, patternButton, quizButton]) el.parent(main);
  layoutControls();

  describe('Class Mastery Heatmap Reader. A heatmap of a synthetic section shows 12 students as rows and ' +
    '8 trigonometry concepts as columns; darker cells are lower model estimates of mastery. One column, Phase ' +
    'shift, is dark for most students, and one row, Hal, is dark for most concepts. A side panel ranks the ' +
    'students by an at-risk score that combines low mastery, days idle and prerequisite gaps with three weight ' +
    'sliders. Clicking a roster row highlights that student and shows the three signals behind the score.');
}

function mulberry32(a) {
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildData() {
  const r = mulberry32(2126);
  M = STUDENTS.map((s, si) => CONCEPTS.map((c, ci) => {
    let v = s.ability + OFFSET[ci] + (r() - 0.5) * 0.16;
    if (ci === WEAK_COL && (s.name === 'Ada' || s.name === 'Ivy')) v += 0.22;   // a few students did fine
    if (si === WEAK_ROW && ci === 0) v += 0.28;                                   // Hal is fine on one concept
    return round(constrain(v, 0.03, 0.98) * 100) / 100;
  }));
}

// ---------- Risk ----------
function signals(si) {
  const row = M[si];
  const mastery = row.reduce((a, b) => a + b, 0) / row.length;
  let gaps = 0;
  for (const c in PREREQS) if (PREREQS[c].some(p => row[p] < PASS)) gaps++;
  return { mastery, idle: STUDENTS[si].idle / MAX_IDLE, gap: gaps / CONCEPTS.length, gaps };
}

function risk(si) {
  const g = signals(si);
  return wMastery.value() * (1 - g.mastery) + wIdle.value() * g.idle + wGap.value() * g.gap;
}

function roster() {
  return STUDENTS.map((s, i) => ({ i, score: risk(i) })).sort((a, b) => b.score - a.score);
}

// ---------- Quiz ----------
function startQuiz() {
  quiz = 1;
  quizOk = [false, false];
  showPattern = false;
  patternButton.html('Show the pattern');
  quizMsg = 'Quiz 1 of 2: click the concept the class most needs re-taught (a column header or any of its cells).';
}

function answerConcept(ci, si) {
  if (ci === WEAK_COL) {
    quizOk[0] = true;
    quizMsg = 'Right: Phase shift is dark down most of its column, so the class as a whole struggles with it. ' +
      'That points at the content or the teaching. Quiz 2 of 2: click the student who struggles across most concepts.';
  } else if (si === WEAK_ROW) {
    quizMsg = 'Not quite: that dark patch belongs to Hal\'s row, one student struggling broadly, which points at the ' +
      'student. Quiz 2 of 2: click the student who struggles across most concepts.';
  } else {
    const col = STUDENTS.map((s, i) => M[i][ci]);
    const low = col.filter(v => v < PASS).length;
    quizMsg = 'Not quite: only ' + low + ' of 12 students score below 0.6 on ' + CONCEPTS[ci] + '. Look for the column ' +
      'that is dark for most rows. Quiz 2 of 2: click the student who struggles across most concepts.';
  }
  quiz = 2;
}

function answerStudent(si) {
  selected = si;
  if (si === WEAK_ROW) {
    quizOk[1] = true;
    quizMsg = 'Right: Hal\'s row is dark across most concepts, one student struggling broadly. ';
  } else {
    const low = M[si].filter(v => v < PASS).length;
    quizMsg = 'Not quite: ' + STUDENTS[si].name + ' scores below 0.6 on ' + low + ' of 8 concepts. The broad struggler is Hal. ';
  }
  const n = quizOk.filter(Boolean).length;
  quizMsg += 'Score: ' + n + ' of 2. A dark column points at the concept; a dark row points at the student.';
  quiz = 3;
  showPattern = true;
  patternButton.html('Hide the pattern');
}

// ---------- Layout ----------
function wide() { return canvasWidth >= 600; }

function layoutControls() {
  const rowH = 34;
  controlHeight = 4 * rowH + 12;
  drawHeight = canvasHeight - controlHeight;
  textSize(14);
  textStyle(BOLD);
  sliderLeftMargin = min(260, fontWidth('Weight on prerequisite gaps: 0.00') + 22);
  textStyle(NORMAL);
  labelSpots = [];
  [wMastery, wIdle, wGap].forEach((s, i) => {
    const y = drawHeight + 8 + i * rowH;
    s.position(sliderLeftMargin, y + 2);
    s.size(canvasWidth - sliderLeftMargin - margin - 6);
    labelSpots.push({ s, y: y + 12 });
  });
  const y4 = drawHeight + 8 + 3 * rowH;
  patternButton.position(10, y4);
  quizButton.position(10 + (patternButton.elt.offsetWidth || 130) + 10, y4);
}

// ---------- Colors: pale = high estimate, dark = low estimate ----------
function cellColor(v) {
  // sequential blue, darkest at the lowest estimate
  const pale = color(239, 246, 252), mid = color(107, 174, 214), dark = color(8, 48, 107);
  return v >= 0.5 ? lerpColor(mid, pale, (v - 0.5) / 0.5) : lerpColor(dark, mid, v / 0.5);
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
  textSize(wide() ? 20 : 16);
  text('Class Mastery Heatmap Reader', margin, 8);
  textStyle(NORMAL);
  textSize(12);
  fill(110, 70, 0);
  textAlign(RIGHT, TOP);
  text('synthetic section', canvasWidth - margin, wide() ? 13 : 11);

  const top = wide() ? 38 : 32;
  const detailH = wide() ? 74 : 72;
  if (wide()) {
    const hmW = canvasWidth * 0.6;
    drawHeatmap(margin, top, hmW - margin, drawHeight - top - detailH - 14);
    drawRoster(hmW + 10, top, canvasWidth - hmW - 10 - margin, drawHeight - top - detailH - 14, false);
  } else {
    const rosterH = 116;
    const hmH = drawHeight - top - detailH - rosterH - 20;
    drawHeatmap(margin, top, canvasWidth - 2 * margin, hmH);
    drawRoster(margin, top + hmH + 6, canvasWidth - 2 * margin, rosterH, true);
  }
  drawDetails(margin, drawHeight - detailH - 8, canvasWidth - 2 * margin, detailH);
  drawControlLabels();
  drawHoverTip();
}

function drawHeatmap(x, y, w, h) {
  const nameW = wide() ? 44 : 38;
  const headH = wide() ? 62 : 52;
  const legendH = 20;
  const cols = CONCEPTS.length, rows = STUDENTS.length;
  const cw = (w - nameW) / cols;
  const ch = min(24, (h - headH - legendH) / rows);
  const gx = x + nameW, gy = y + headH;
  geo = { gx, gy, cw, ch, headH, x, y };

  // column headers (rotated)
  textSize(wide() ? 12 : 11);
  for (let c = 0; c < cols; c++) {
    // labels slant up and to the left so the last one stays inside the heatmap
    push();
    translate(gx + c * cw + cw / 2 + 4, gy - 6);
    rotate(PI / 4);
    noStroke();
    const isQ = quiz === 1;
    fill(isQ ? color(0, 90, 150) : color(20));
    textStyle(c === WEAK_COL && showPattern ? BOLD : NORMAL);
    textAlign(RIGHT, CENTER);
    text(cw < 44 ? SHORT[c] : CONCEPTS[c], 0, 0);
    pop();
  }
  textStyle(NORMAL);
  // rows
  for (let s = 0; s < rows; s++) {
    const ry = gy + s * ch;
    noStroke();
    fill(s === selected ? color(0, 90, 150) : color(20));
    textStyle(s === selected || (s === WEAK_ROW && showPattern) ? BOLD : NORMAL);
    textAlign(RIGHT, CENTER);
    textSize(12);
    text(STUDENTS[s].name, gx - 5, ry + ch / 2);
    textStyle(NORMAL);
    for (let c = 0; c < cols; c++) {
      const v = M[s][c];
      stroke(255);
      strokeWeight(1);
      fill(cellColor(v));
      rect(gx + c * cw, ry, cw, ch);
      if (cw >= 30 && ch >= 15) {
        noStroke();
        fill(v < 0.5 ? 255 : 20);
        textAlign(CENTER, CENTER);
        textSize(10);
        text(nf(v, 1, 2).replace(/^0/, ''), gx + c * cw + cw / 2, ry + ch / 2);
      }
    }
  }
  // selected row outline
  if (selected >= 0) {
    noFill();
    stroke(0, 90, 150);
    strokeWeight(3);
    rect(gx - 1, gy + selected * ch - 1, cols * cw + 2, ch + 2);
  }
  // the pattern: weak column and weak row
  if (showPattern) {
    noFill();
    strokeWeight(3);
    stroke(230, 159, 0);
    drawingContext.setLineDash([7, 4]);
    rect(gx + WEAK_COL * cw, gy - 2, cw, rows * ch + 4);
    rect(gx - nameW + 2, gy + WEAK_ROW * ch, nameW - 2 + cols * cw + 2, ch);
    drawingContext.setLineDash([]);
  }
  // legend
  const ly = gy + rows * ch + 6;
  const lw = min(100, w * 0.3);
  noStroke();
  for (let i = 0; i < lw; i++) {
    fill(cellColor(i / lw));
    rect(x + nameW + i, ly, 1.2, 10);
  }
  fill(30);
  textSize(11);
  textAlign(LEFT, TOP);
  text('0', x + nameW - 8, ly - 1);
  text('1', x + nameW + lw + 3, ly - 1);
  fill(60);
  const room = x + w - (x + nameW + lw + 16);
  let legendText = 'darker = lower mastery estimate (a model output, not a measured fact)';
  if (fontWidth(legendText) > room) legendText = 'darker = lower estimate (model output)';
  if (fontWidth(legendText) > room) legendText = 'darker = lower estimate';
  text(legendText, x + nameW + lw + 16, ly - 1);
}

function drawRoster(x, y, w, h, compact) {
  stroke(200);
  strokeWeight(1);
  fill(255, 255, 255, 235);
  rect(x, y, w, h, 8);
  noStroke();
  fill(0);
  textAlign(LEFT, TOP);
  textSize(13);
  textStyle(BOLD);
  text('At-risk roster', x + 8, y + 6);
  textStyle(NORMAL);
  textSize(11);
  fill(80);
  text('highest risk first; click a row', x + 8 + 100, y + 8);
  rosterRows = [];
  const list = roster();
  const maxScore = max(0.001, list[0].score);
  if (!compact) {
    const rowH = min(22, (h - 34) / list.length);
    list.forEach((r, k) => {
      const ry = y + 28 + k * rowH;
      const sel = r.i === selected;
      if (sel) { fill(220, 235, 250); rect(x + 4, ry - 1, w - 8, rowH, 4); }
      noStroke();
      fill(40);
      textSize(12);
      textAlign(LEFT, CENTER);
      text((k + 1) + '.', x + 8, ry + rowH / 2);
      textStyle(sel ? BOLD : NORMAL);
      text(STUDENTS[r.i].name, x + 30, ry + rowH / 2);
      textStyle(NORMAL);
      const bx = x + 70, bw = w - 70 - 52;
      fill(230);
      rect(bx, ry + rowH / 2 - 5, bw, 10, 3);
      fill(213, 94, 0);
      rect(bx, ry + rowH / 2 - 5, bw * r.score / maxScore, 10, 3);
      fill(20);
      textAlign(RIGHT, CENTER);
      text(nf(r.score, 1, 3), x + w - 8, ry + rowH / 2);
      rosterRows.push({ s: r.i, x: x + 4, y: ry - 1, w: w - 8, h: rowH });
    });
  } else {
    // two columns of six
    const colW = (w - 12) / 2, rowH = (h - 30) / 6;
    list.forEach((r, k) => {
      const cx = x + 6 + floor(k / 6) * colW, ry = y + 24 + (k % 6) * rowH;
      const sel = r.i === selected;
      if (sel) { fill(220, 235, 250); rect(cx, ry, colW - 4, rowH, 4); }
      noStroke();
      fill(20);
      textSize(12);
      textAlign(LEFT, CENTER);
      textStyle(sel ? BOLD : NORMAL);
      text((k + 1) + '. ' + STUDENTS[r.i].name, cx + 4, ry + rowH / 2);
      textStyle(NORMAL);
      const bx = cx + 58, bw = colW - 58 - 44;
      if (bw > 20) {
        fill(230);
        rect(bx, ry + rowH / 2 - 4, bw, 8, 3);
        fill(213, 94, 0);
        rect(bx, ry + rowH / 2 - 4, bw * r.score / maxScore, 8, 3);
      }
      fill(20);
      textAlign(RIGHT, CENTER);
      text(nf(r.score, 1, 2), cx + colW - 8, ry + rowH / 2);
      rosterRows.push({ s: r.i, x: cx, y: ry, w: colW - 4, h: rowH });
    });
  }
}

function drawDetails(x, y, w, h) {
  stroke(200);
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(x, y, w, h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  const small = !wide();
  textSize(small ? 12 : 13);
  if (quiz > 0) {
    fill(quiz === 3 ? color(0, 110, 70) : color(0, 90, 150));
    textStyle(BOLD);
    drawWrapped(quizMsg, x + 10, y + 7, w - 20, small ? 14 : 16);
    textStyle(NORMAL);
    return;
  }
  if (selected >= 0) {
    const g = signals(selected);
    const a = wMastery.value(), b = wIdle.value(), c = wGap.value();
    const t1 = a * (1 - g.mastery), t2 = b * g.idle, t3 = c * g.gap;
    fill(0);
    textStyle(BOLD);
    text(STUDENTS[selected].name + ': mean mastery ' + nf(g.mastery, 1, 2) + ', idle ' + STUDENTS[selected].idle +
      ' of ' + MAX_IDLE + ' days, gaps on ' + g.gaps + ' of 8 concepts', x + 10, y + 7);
    textStyle(NORMAL);
    fill(40);
    const line = 'risk = ' + nf(a, 1, 2) + ' x (1 - ' + nf(g.mastery, 1, 2) + ') + ' + nf(b, 1, 2) + ' x ' + nf(g.idle, 1, 2) +
      ' + ' + nf(c, 1, 2) + ' x ' + nf(g.gap, 1, 3) + ' = ' + nf(t1, 1, 3) + ' + ' + nf(t2, 1, 3) + ' + ' + nf(t3, 1, 3) +
      ' = ' + nf(t1 + t2 + t3, 1, 3);
    drawWrapped(line, x + 10, y + (small ? 24 : 27), w - 20, small ? 14 : 16);
    return;
  }
  fill(0);
  textStyle(BOLD);
  text(showPattern ? 'The two patterns' : 'Read the heatmap', x + 10, y + 7);
  textStyle(NORMAL);
  fill(40);
  const msg = showPattern
    ? 'Dashed column: Phase shift is dark for most of the class, so look at the content or the teaching. Dashed row: Hal is dark across most concepts, so look at the student.'
    : 'Find a column that is dark for most students and a row that is dark across most concepts. Click a roster row to see the three signals behind a risk score.';
  drawWrapped(msg, x + 10, y + (small ? 24 : 27), w - 20, small ? 14 : 16);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(14);
  const names = ['Weight on low mastery: ', 'Weight on inactivity: ', 'Weight on prerequisite gaps: '];
  labelSpots.forEach((l, i) => {
    textStyle(BOLD);
    text(names[i], 10, l.y);
    const nw = fontWidth(names[i]);
    textStyle(NORMAL);
    text(nf(l.s.value(), 1, 2), 10 + nw, l.y);
  });
  // the weights are the prototype's demo choices
  const y4 = drawHeight + 8 + 3 * 34 + 12;
  const bx = 10 + (patternButton.elt.offsetWidth || 130) + 10 + (quizButton.elt.offsetWidth || 70) + 14;
  textSize(12);
  fill(90);
  if (canvasWidth - bx > 150) text(canvasWidth - bx > 330 ? 'Defaults 0.45 / 0.30 / 0.25: one prototype\'s choices, not a standard.' : 'Defaults: a prototype\'s choices.', bx, y4);
}

function drawHoverTip() {
  if (!hover) return;
  const { s, c } = hover;
  const lines = [STUDENTS[s].name + ' · ' + CONCEPTS[c], 'estimated mastery ' + nf(M[s][c], 1, 2) + ' (model estimate)'];
  textSize(12);
  const tw = max(lines.map(l => fontWidth(l))) + 16;
  let tx = constrain(mouseX + 12, 4, canvasWidth - tw - 4);
  let ty = mouseY + 16;
  if (ty + 44 > drawHeight) ty = mouseY - 50;
  stroke(120);
  strokeWeight(1);
  fill(255, 255, 240, 245);
  rect(tx, ty, tw, 40, 6);
  noStroke();
  fill(0);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  text(lines[0], tx + 8, ty + 5);
  textStyle(NORMAL);
  text(lines[1], tx + 8, ty + 21);
}

// ---------- Interaction ----------
function cellAt(mx, my) {
  if (!geo) return null;
  const { gx, gy, cw, ch } = geo;
  const c = floor((mx - gx) / cw), s = floor((my - gy) / ch);
  if (c >= 0 && c < CONCEPTS.length && s >= 0 && s < STUDENTS.length) return { s, c };
  // header band selects a column
  if (c >= 0 && c < CONCEPTS.length && my < gy && my > gy - geo.headH) return { s: -1, c };
  // name band selects a row
  if (mx < gx && mx > geo.x && s >= 0 && s < STUDENTS.length) return { s, c: -1 };
  return null;
}

function mouseMoved() {
  const h = cellAt(mouseX, mouseY);
  hover = h && h.s >= 0 && h.c >= 0 ? h : null;
  let pointer = !!h;
  for (const r of rosterRows) if (mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h) pointer = true;
  cursor(pointer ? HAND : ARROW);
}

function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight) return;
  const h = cellAt(mouseX, mouseY);
  if (quiz === 1 && h && h.c >= 0) { answerConcept(h.c, h.s); return; }
  if (quiz === 2 && h && h.s >= 0) { answerStudent(h.s); return; }
  for (const r of rosterRows) {
    if (mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h) {
      if (quiz === 2) { answerStudent(r.s); return; }
      if (quiz === 3) quiz = 0;
      selected = selected === r.s ? -1 : r.s;
      return;
    }
  }
  if (h && h.s >= 0 && quiz !== 1) {
    if (quiz === 3) quiz = 0;
    selected = selected === h.s ? -1 : h.s;
  }
}

// ---------- Text helpers ----------
function wrapWords(s, w) {
  const words = String(s).split(' ');
  const lines = [];
  let line = '';
  for (const wd of words) {
    const test = line ? line + ' ' + wd : wd;
    if (fontWidth(test) > w && line) { lines.push(line); line = wd; } else line = test;
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
