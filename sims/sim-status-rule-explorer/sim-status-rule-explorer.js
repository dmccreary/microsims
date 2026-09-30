// Sim Status Rule Explorer
// CANVAS_HEIGHT: 705
// Set the state of a MicroSim's files with the controls and watch the rules of
// extract-sim-specs.py assign its status: specified, scaffolded, implemented,
// validated, deployed, or reused. "Predict first" hides the result until the
// learner commits to a prediction, then reveals the status and the rule that fired.
// Width responsive: the strip wraps and the two panels stack below 600 px.

// ---------- canvas layout ----------
let canvasWidth = 400;
let drawHeight = 530;
let controlHeight = 175;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let sliderLeftMargin = 205;
let defaultTextSize = 16;

// ---------- controls ----------
let dirCheckbox, htmlCheckbox, iframeCheckbox, reusedCheckbox;
let linesSlider, scoreSlider;
let predictButton, predictSelect;

// ---------- state ----------
const STATUSES = ['specified', 'scaffolded', 'implemented', 'validated', 'deployed', 'reused'];
const SIM_ID = 'bouncing-ball-gravity-lab';   // the chapter's worked example
let mode = 'live';        // 'live' | 'predict' | 'revealed'
let prediction = null;
let predictionsMade = 0;
let predictionsRight = 0;
let result = null;        // { status, trace, explanation }
let stripBoxes = [];
let lastSignature = '';

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  const mainEl = document.querySelector('main');

  dirCheckbox = createCheckbox(' Sim directory exists', false);
  htmlCheckbox = createCheckbox(' main.html exists', false);
  iframeCheckbox = createCheckbox(' Chapter has an iframe', false);
  reusedCheckbox = createCheckbox(' Spec says Status: Reused', false);
  for (const cb of [dirCheckbox, htmlCheckbox, iframeCheckbox, reusedCheckbox]) {
    cb.parent(mainEl);
    cb.changed(onFilesChanged);
  }
  // main.html cannot exist without its directory, and vice versa
  htmlCheckbox.changed(() => { if (htmlCheckbox.checked()) dirCheckbox.checked(true); onFilesChanged(); });
  dirCheckbox.changed(() => { if (!dirCheckbox.checked()) htmlCheckbox.checked(false); onFilesChanged(); });

  linesSlider = createSlider(0, 300, 0, 10);
  linesSlider.parent(mainEl);
  linesSlider.input(onFilesChanged);
  scoreSlider = createSlider(0, 100, 0, 1);
  scoreSlider.parent(mainEl);
  scoreSlider.input(onFilesChanged);

  predictButton = createButton('Predict first');
  predictButton.parent(mainEl);
  predictButton.mousePressed(togglePredict);

  predictSelect = createSelect();
  predictSelect.parent(mainEl);
  predictSelect.option('Choose a status...');
  for (const s of STATUSES) predictSelect.option(s);
  predictSelect.changed(() => {
    const v = predictSelect.value();
    if (STATUSES.includes(v)) makePrediction(v);
  });
  predictSelect.hide();

  positionControls();
  result = computeStatus();

  describe('A rule explorer for MicroSim build status. Checkboxes and sliders below the drawing set ' +
    'whether the sim directory, main.html and a chapter iframe exist, how many lines the .js file ' +
    'has, the quality score, and whether the spec says Reused. A strip of status boxes shows the ' +
    'status the extraction script would assign, a files panel mirrors the settings, and a rules ' +
    'panel lists each check in order with the one that decided the result. Predict first hides ' +
    'the result until you choose a status.');
}

function positionControls() {
  const y0 = drawHeight + 8;
  const col2 = max(200, floor(canvasWidth / 2));
  const fs = canvasWidth < 480 ? '14px' : '16px';
  for (const cb of [dirCheckbox, htmlCheckbox, iframeCheckbox, reusedCheckbox]) cb.style('font-size', fs);
  dirCheckbox.position(10, y0);
  htmlCheckbox.position(col2, y0);
  iframeCheckbox.position(10, y0 + 32);
  reusedCheckbox.position(col2, y0 + 32);
  linesSlider.position(sliderLeftMargin, y0 + 66);
  linesSlider.size(canvasWidth - sliderLeftMargin - 20);
  scoreSlider.position(sliderLeftMargin, y0 + 100);
  scoreSlider.size(canvasWidth - sliderLeftMargin - 20);
  predictButton.position(10, y0 + 132);
  predictSelect.position(118, y0 + 133);
}

// ---------- the extraction rules (same order as extract-sim-specs.py) ----------
function fileState() {
  return {
    dir: dirCheckbox.checked(),
    html: htmlCheckbox.checked(),
    lines: linesSlider.value(),
    score: scoreSlider.value(),
    iframe: iframeCheckbox.checked(),
    reused: reusedCheckbox.checked()
  };
}

// Returns the status plus a trace: one entry per rule with
// state 'pass' (rule met, keep going), 'stop' (rule decided the result) or 'skip' (never reached)
function computeStatus() {
  const f = fileState();
  const trace = [];
  let status = 'specified';
  let explanation = '';
  let stopped = false;
  const add = (q, fact, outcome, st) => trace.push({ q, fact, outcome, state: st });
  const skip = (q) => trace.push({ q, fact: '', outcome: 'not reached', state: 'skip' });

  // Rule 1: Reused overrides everything
  if (f.reused) {
    add('Spec says Status: Reused?', 'yes', 'reused', 'stop');
    status = 'reused';
    explanation = 'The spec\'s Status line says Reused, which overrides every file check.';
    stopped = true;
  } else add('Spec says Status: Reused?', 'no', 'check the files', 'pass');

  // Rule 2: directory
  if (stopped) skip('Sim directory exists?');
  else if (!f.dir) {
    add('Sim directory exists?', 'no', 'specified', 'stop');
    explanation = 'There is no docs/sims/' + SIM_ID + '/ directory, so the sim is only specified.';
    stopped = true;
  } else add('Sim directory exists?', 'yes', 'keep checking', 'pass');

  // Rule 3: main.html
  if (stopped) skip('main.html exists?');
  else if (!f.html) {
    add('main.html exists?', 'no', 'stays specified', 'stop');
    explanation = 'The directory exists but has no main.html, so the status stays specified.';
    stopped = true;
  } else { add('main.html exists?', 'yes', 'scaffolded', 'pass'); status = 'scaffolded'; }

  // Rule 4: substantive JavaScript (more than 50 lines)
  if (stopped) skip('.js file has more than 50 lines?');
  else if (f.lines <= 50) {
    add('.js file has more than 50 lines?', f.lines + ' lines: no', 'stays scaffolded', 'stop');
    explanation = (f.lines === 0 ? 'There is no .js file with code yet' : 'A ' + f.lines + '-line .js file is not more than 50 lines') +
      ', so the status stays scaffolded.';
    stopped = true;
  } else { add('.js file has more than 50 lines?', f.lines + ' lines: yes', 'implemented', 'pass'); status = 'implemented'; }

  // Rule 5: quality score of 70 or higher
  if (stopped) skip('quality_score is 70 or higher?');
  else if (f.score < 70) {
    add('quality_score is 70 or higher?', f.score + ': no', 'stays implemented', 'stop');
    explanation = 'Score ' + f.score + ' is below 70, so not validated' +
      (f.iframe ? '; deployed needs validated, so the iframe does not help.' : '; the status stays implemented.');
    stopped = true;
  } else { add('quality_score is 70 or higher?', f.score + ': yes', 'validated', 'pass'); status = 'validated'; }

  // Rule 6: iframe in the chapter
  if (stopped) skip('Chapter has an iframe?');
  else if (!f.iframe) {
    add('Chapter has an iframe?', 'no', 'stays validated', 'stop');
    explanation = 'Score ' + f.score + ' reaches 70, so validated, but no chapter iframe embeds it yet, so not deployed.';
  } else {
    add('Chapter has an iframe?', 'yes', 'deployed', 'stop');
    status = 'deployed';
    explanation = 'Validated and embedded by a chapter iframe, so deployed.';
  }
  return { status, trace, explanation };
}

// ---------- prediction flow ----------
function onFilesChanged() {
  result = computeStatus();
  if (mode === 'revealed') mode = 'live';
}

function togglePredict() {
  if (mode === 'predict') {
    mode = 'live';
    predictSelect.hide();
    predictButton.html('Predict first');
  } else {
    mode = 'predict';
    prediction = null;
    predictSelect.selected('Choose a status...');
    predictSelect.show();
    predictButton.html('Cancel');
  }
}

function makePrediction(s) {
  if (mode !== 'predict') return;
  prediction = s;
  result = computeStatus();
  predictionsMade++;
  if (s === result.status) predictionsRight++;
  mode = 'revealed';
  predictSelect.hide();
  predictButton.html('Predict first');
}

// ---------- drawing ----------
function isWide() { return canvasWidth >= 600; }

function draw() {
  updateCanvasSize();
  // keep the result current even if a control changed without an event
  const sig = JSON.stringify(fileState());
  if (sig !== lastSignature) { lastSignature = sig; result = computeStatus(); }

  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(isWide() ? 22 : 20);
  text('Sim Status Rule Explorer', canvasWidth / 2, 8);

  const hidden = (mode === 'predict');
  const stripBottom = drawStrip(hidden);

  const top = stripBottom + 10;
  textSize(isWide() ? 15 : 14);
  const explLines = max(2, wrapCount(explanationText(), canvasWidth - 2 * margin - 20));
  const explH = explLines * 19 + 14;
  const bottom = drawHeight - explH - 14;
  if (isWide()) {
    const half = (canvasWidth - 3 * margin) / 2;
    drawFilesPanel(margin, top, half, bottom - top);
    drawRulesPanel(2 * margin + half, top, half, bottom - top, hidden);
  } else {
    const w = canvasWidth - 2 * margin;
    const filesH = 142;
    drawFilesPanel(margin, top, w, filesH);
    drawRulesPanel(margin, top + filesH + 8, w, bottom - top - filesH - 8, hidden);
  }
  drawExplanation(margin, drawHeight - explH - 8, canvasWidth - 2 * margin, explH);
  drawControlLabels();
  cursor(mode === 'predict' && stripIndexAt(mouseX, mouseY) >= 0 ? HAND : ARROW);
}

// Lifecycle strip: five boxes in sequence plus a separate reused box
function drawStrip(hidden) {
  stripBoxes = [];
  const wide = isWide();
  const gap = 18;
  const bh = 36;
  const y1 = 42;
  if (wide) {
    const bw = (canvasWidth - 2 * margin - 4 * gap) / 5;
    for (let i = 0; i < 5; i++) stripBoxes.push({ x: margin + i * (bw + gap), y: y1, w: bw, h: bh });
    stripBoxes.push({ x: canvasWidth - margin - bw, y: y1 + bh + 12, w: bw, h: bh });
  } else {
    const bw = (canvasWidth - 2 * margin - 2 * gap) / 3;
    for (let i = 0; i < 3; i++) stripBoxes.push({ x: margin + i * (bw + gap), y: y1, w: bw, h: bh });
    for (let i = 0; i < 2; i++) stripBoxes.push({ x: margin + i * (bw + gap), y: y1 + bh + 12, w: bw, h: bh });
    stripBoxes.push({ x: margin + 2 * (bw + gap), y: y1 + bh + 12, w: bw, h: bh });
  }
  // arrows between the sequential states
  stroke('gray');
  strokeWeight(2);
  fill('gray');
  for (let i = 0; i < 4; i++) {
    const a = stripBoxes[i], b = stripBoxes[i + 1];
    if (abs(a.y - b.y) < 1) {
      const ax = a.x + a.w + 3, bx = b.x - 3, y = a.y + a.h / 2;
      line(ax, y, bx - 5, y);
      noStroke();
      triangle(bx, y, bx - 7, y - 4, bx - 7, y + 4);
      stroke('gray');
    } else {
      // wrap from the end of row 1 to the start of row 2
      const ax = a.x + a.w / 2, ay = a.y + a.h, by = b.y, bx = b.x + b.w / 2;
      noFill();
      bezier(ax, ay, ax, ay + 8, bx, by - 8, bx, by - 5);
      fill('gray');
      noStroke();
      triangle(bx, by, bx - 4, by - 7, bx + 4, by - 7);
      stroke('gray');
    }
  }
  // label for the reused box
  noStroke();
  fill('dimgray');
  textSize(13);
  const r = stripBoxes[5];
  if (wide) {
    textAlign(RIGHT, CENTER);
    text('outside the sequence: embedded from another book →', r.x - 8, r.y + r.h / 2);
  }
  // boxes
  for (let i = 0; i < 6; i++) {
    const b = stripBoxes[i];
    const isCurrent = !hidden && result.status === STATUSES[i];
    const isPred = (mode === 'revealed' && prediction === STATUSES[i]);
    stroke(isCurrent ? 'navy' : (i === 5 ? 'purple' : 'steelblue'));
    strokeWeight(isCurrent ? 3 : 1.5);
    if (i === 5) drawingContext.setLineDash([5, 4]);
    fill(isCurrent ? 'steelblue' : 'white');
    rect(b.x, b.y, b.w, b.h, 8);
    drawingContext.setLineDash([]);
    noStroke();
    fill(isCurrent ? 'white' : 'black');
    textSize(b.w < 95 ? 13 : 15);
    textStyle(isCurrent ? BOLD : NORMAL);
    textAlign(CENTER, CENTER);
    text(STATUSES[i], b.x + b.w / 2, b.y + b.h / 2);
    textStyle(NORMAL);
    if (isPred) {
      // mark the learner's prediction with a tick or a cross badge
      const ok = prediction === result.status;
      fill(ok ? 'green' : 'firebrick');
      circle(b.x + 6, b.y + 2, 18);
      fill('white');
      textSize(13);
      textStyle(BOLD);
      text(ok ? '✓' : '✗', b.x + 6, b.y + 3);
      textStyle(NORMAL);
    }
    if (hidden) {
      // in predict mode, the boxes become answer targets
      noFill();
      stroke('darkorange');
      strokeWeight(stripIndexAt(mouseX, mouseY) === i ? 3 : 0);
      rect(b.x - 2, b.y - 2, b.w + 4, b.h + 4, 9);
    }
  }
  return stripBoxes[5].y + stripBoxes[5].h;
}

function stripIndexAt(mx, my) {
  for (let i = 0; i < stripBoxes.length; i++) {
    const b = stripBoxes[i];
    if (mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h) return i;
  }
  return -1;
}

// A small panel with a title
function panel(x, y, w, h, title) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textStyle(BOLD);
  textSize(15);
  textAlign(LEFT, TOP);
  text(title, x + 10, y + 7);
  textStyle(NORMAL);
}

// Mirror of the controls as a file listing
function drawFilesPanel(x, y, w, h) {
  const f = fileState();
  panel(x, y, w, h, 'What is on disk');
  const lead = isWide() ? 23 : 19;
  let ty = y + 30;
  textSize(isWide() ? 14 : 13);
  const rows = [
    { indent: 0, icon: 'folder', name: 'docs/sims/' + SIM_ID + '/', ok: f.dir, note: f.dir ? '' : 'missing' },
    { indent: 1, icon: 'doc', name: 'main.html', ok: f.html, note: f.html ? '' : 'missing' },
    { indent: 1, icon: 'doc', name: SIM_ID + '.js', ok: f.dir && f.lines > 0, note: f.dir ? f.lines + ' lines' : 'missing' },
    { indent: 1, icon: 'doc', name: 'index.md', ok: f.dir, note: f.dir ? 'quality_score: ' + f.score : 'missing' },
    { indent: 0, icon: 'doc', name: 'chapter iframe', ok: f.iframe, note: f.iframe ? 'present' : 'none' },
    { indent: 0, icon: 'doc', name: 'spec Status line', ok: true, note: f.reused ? 'Reused' : 'Specified' }
  ];
  for (const r of rows) {
    const ix = x + 12 + r.indent * 18;
    drawIcon(r.icon, ix, ty, r.ok);
    noStroke();
    fill(r.ok ? 'black' : 'gray');
    textAlign(LEFT, TOP);
    const nameMax = w - (ix - x) - 22 - 10;
    let name = r.name;
    while (textWidth(name + '  ' + r.note) > nameMax && name.length > 8) name = name.slice(0, -4) + '…';
    text(name, ix + 20, ty);
    fill(r.ok ? 'dimgray' : 'firebrick');
    text(r.note, ix + 20 + textWidth(name) + 8, ty);
    ty += lead;
  }
}

function drawIcon(kind, x, y, ok) {
  stroke(ok ? 'dimgray' : 'silver');
  strokeWeight(1);
  if (kind === 'folder') {
    fill(ok ? 'khaki' : 'white');
    rect(x, y + 3, 15, 12, 2);
    rect(x, y + 1, 7, 4, 1);
  } else {
    fill(ok ? 'lightskyblue' : 'white');
    beginShape();
    vertex(x + 1, y);
    vertex(x + 9, y);
    vertex(x + 13, y + 4);
    vertex(x + 13, y + 16);
    vertex(x + 1, y + 16);
    endShape(CLOSE);
  }
}

// The rules in order, with the one that decided the result
function drawRulesPanel(x, y, w, h, hidden) {
  panel(x, y, w, h, 'Rules, checked in order');
  const wide = isWide();
  if (hidden) {
    fill('dimgray');
    textSize(14);
    textAlign(LEFT, TOP);
    wrapText('Hidden until you predict. Change the files if you like, then choose a status ' +
      'in the strip above or in the list below.', x + 12, y + 34, w - 24, 19);
    return;
  }
  let ty = y + 30;
  const rowH = wide ? 38 : 20;
  for (let i = 0; i < result.trace.length; i++) {
    const t = result.trace[i];
    const col = t.state === 'stop' ? 'darkorange' : (t.state === 'pass' ? 'seagreen' : 'silver');
    // number badge
    noStroke();
    fill(col);
    circle(x + 20, ty + 8, 18);
    fill('white');
    textSize(12);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(String(i + 1), x + 20, ty + 8);
    textStyle(NORMAL);
    textAlign(LEFT, TOP);
    textSize(wide ? 14 : 13);
    fill(t.state === 'skip' ? 'gray' : 'black');
    const qx = x + 34;
    if (wide) {
      text(t.q, qx, ty);
      fill(t.state === 'stop' ? 'darkorange' : (t.state === 'pass' ? 'seagreen' : 'gray'));
      const out = t.state === 'skip' ? 'not reached' : t.fact + ' → ' + t.outcome + (t.state === 'stop' ? '  (decides)' : '');
      text(out, qx + 12, ty + 17);
    } else {
      const shortQ = t.q.replace('.js file has more than 50 lines?', 'More than 50 .js lines?')
        .replace('quality_score is 70 or higher?', 'quality_score ≥ 70?')
        .replace('Spec says Status: Reused?', 'Spec says Reused?');
      text(shortQ, qx, ty + 1);
      fill(t.state === 'stop' ? 'darkorange' : (t.state === 'pass' ? 'seagreen' : 'gray'));
      textAlign(RIGHT, TOP);
      const out = t.state === 'skip' ? 'not reached' : (t.state === 'stop' ? '→ ' + t.outcome : t.fact.replace(/ lines/, ''));
      text(out, x + w - 10, ty + 1);
      textAlign(LEFT, TOP);
    }
    ty += rowH;
  }
}

function explanationText() {
  let msg;
  if (mode === 'predict') {
    msg = 'Predict: which status will extract-sim-specs.py assign? Click a box in the strip or pick from the list.';
  } else if (mode === 'revealed') {
    const ok = prediction === result.status;
    msg = (ok ? 'Correct: ' : 'Not quite: you predicted ' + prediction + ', the script says ') +
      result.status + '. ' + result.explanation;
  } else {
    msg = 'Status: ' + result.status + '. ' + result.explanation;
  }
  return msg;
}

function drawExplanation(x, y, w, h) {
  stroke(mode === 'predict' ? 'darkorange' : 'steelblue');
  strokeWeight(2);
  fill(mode === 'predict' ? 'oldlace' : 'white');
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textSize(isWide() ? 15 : 14);
  textAlign(LEFT, TOP);
  wrapText(explanationText(), x + 10, y + 7, w - 20, 19);
}

// Number of wrapped lines a string needs at the current text size
function wrapCount(str, w) {
  const words = str.split(' ');
  let line = '';
  let n = 1;
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (textWidth(test) > w && line) { n++; line = word; }
    else line = test;
  }
  return n;
}

function wrapText(str, x, y, w, lead) {
  const words = str.split(' ');
  let line = '';
  let yy = y;
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (textWidth(test) > w && line) { text(line, x, yy); yy += lead; line = word; }
    else line = test;
  }
  if (line) text(line, x, yy);
  return yy + lead - y;
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  const y0 = drawHeight + 8;
  text('Lines in the .js file: ' + linesSlider.value(), 10, y0 + 76);
  text('Quality score: ' + scoreSlider.value(), 10, y0 + 110);
  textAlign(RIGHT, CENTER);
  textSize(14);
  if (predictionsMade > 0 && mode !== 'predict') {
    text('Predictions: ' + predictionsRight + ' of ' + predictionsMade + ' correct', canvasWidth - 12, y0 + 144);
  }
}

// ---------- events ----------
function mousePressed() {
  if (mode !== 'predict') return;
  const i = stripIndexAt(mouseX, mouseY);
  if (i >= 0) makePrediction(STATUSES[i]);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
}
