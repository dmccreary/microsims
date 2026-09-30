// Generation Failure Mode Triage
// CANVAS_HEIGHT: 610
// Learners read the symptom of a defective MicroSim, optionally open a simulated
// browser console, pick one of six failure-mode cards and press Check. The sim
// answers with the cause and first repair and, for a wrong pick, the evidence
// that separates the two modes. Cases and modes live in data.json.
// Every interaction goes through logInteraction() so Chapter 17 can attach
// xAPI statements to it later.

// ---------- layout globals ----------
let canvasWidth = 400;
let drawHeight = 560;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let sliderLeftMargin = 10;           // no sliders; kept for the standard layout variables
let defaultTextSize = 16;
let narrowBreakpoint = 600;          // below this the cards move under the thumbnail

// ---------- data and state ----------
let data = null;
let loadError = null;
let caseIndex = 0;                   // position in caseOrder
let caseOrder = [];
let selectedMode = null;             // id of the card the learner clicked
let checked = false;                 // has Check been pressed with a correct answer
let attemptsThisCase = 0;
let feedback = null;                 // {correct, lines:[{text, color, bold}]}
let showConsole = false;
let firstTryCorrect = 0;
let casesScored = 0;

// ---------- controls ----------
let nextButton, consoleButton, checkButton;

// ---------- hover and hit boxes ----------
let cardRects = [];
let hoverMode = null;

// ---------- interaction log (Chapter 17 attaches xAPI statements here) ----------
let interactionLog = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  frameRate(30);

  nextButton = createButton('Next case');
  nextButton.parent(document.querySelector('main'));
  nextButton.mousePressed(nextCase);

  consoleButton = createButton('Show console');
  consoleButton.parent(document.querySelector('main'));
  consoleButton.mousePressed(toggleConsole);

  checkButton = createButton('Check');
  checkButton.parent(document.querySelector('main'));
  checkButton.mousePressed(checkAnswer);

  positionControls();

  describe('A triage exercise for generated MicroSim defects. On the left, a small picture of a defective ' +
    'MicroSim with a written symptom and an optional simulated browser console. On the right, six ' +
    'failure-mode cards: hallucinated API, library version drift, control in drawing area, non-responsive ' +
    'canvas, wrong iframe height, and text with an outline. The learner picks a card and presses Check to ' +
    'see the cause, the first repair and how to tell similar modes apart.', LABEL);

  fetch('data.json')
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(json => {
      data = json;
      caseOrder = data.cases.map((c, i) => i);
      loadCase(0);
      redraw();                      // draw the loaded data at once
    })
    .catch(err => {
      loadError = 'Could not load data.json (' + err.message + '). Open this page through a web server, ' +
        'for example mkdocs serve, rather than as a local file.';
    });
}

// ---------- the single logging function ----------
function logInteraction(verb, extra) {
  const entry = Object.assign({
    time: new Date().toISOString(),
    verb: verb,
    caseId: currentCase() ? currentCase().id : null
  }, extra || {});
  interactionLog.push(entry);
  window.dispatchEvent(new CustomEvent('microsim-interaction', { detail: entry }));
}

function currentCase() {
  return data ? data.cases[caseOrder[caseIndex]] : null;
}

function modeById(id) {
  return data.modes.find(m => m.id === id);
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
  textSize(canvasWidth < 440 ? 19 : 22);
  text('Generation Failure Mode Triage', margin, 10);
  textStyle(NORMAL);

  if (!data) {
    fill(loadError ? 'firebrick' : 'dimgray');
    textSize(defaultTextSize);
    text(loadError || 'Loading cases...', margin, 50, canvasWidth - 2 * margin, 120);
    return;
  }

  const c = currentCase();
  const narrow = canvasWidth < narrowBreakpoint;

  // Score line
  noStroke();
  fill('dimgray');
  textSize(15);
  text('Correct on first try: ' + firstTryCorrect + ' of ' + casesScored + ' cases checked', margin, 38);

  if (!narrow) {
    const leftW = floor((canvasWidth - 3 * margin) * 0.42);
    const rightX = 2 * margin + leftW;
    const rightW = canvasWidth - rightX - margin;
    let y = drawCaseText(c, margin, 64, leftW);
    const thumbH = min(210, floor(leftW * 0.7));
    drawThumb(c.visual, margin, y + 4, leftW, thumbH);
    y += thumbH + 12;
    if (showConsole) drawConsole(c, margin, y, leftW, drawHeight - y - 10);

    let ry = 64;
    noStroke();
    fill('black');
    textStyle(BOLD);
    textSize(16);
    text('Which failure mode is this?', rightX, ry);
    textStyle(NORMAL);
    fill('dimgray');
    textSize(15);
    text('Click a card, then press Check.', rightX, ry + 20);
    const cardsBottom = drawCards(rightX, ry + 44, rightW, false);
    if (feedback) {
      drawFeedback(rightX, cardsBottom + 10, rightW, drawHeight - cardsBottom - 20);
    } else {
      // Hint in the empty feedback area
      noStroke();
      fill('dimgray');
      textSize(15);
      textStyle(ITALIC);
      const hint = wrapLines('Not sure? Press Show console for more evidence. A clean console is ' +
        'evidence too: layout defects rarely throw errors.', rightW);
      let hy = cardsBottom + 14;
      for (const ln of hint) { text(ln, rightX, hy); hy += 19; }
      textStyle(NORMAL);
    }
  } else {
    const w = canvasWidth - 2 * margin;
    let y = drawCaseText(c, margin, 60, w);
    const thumbW = min(w, 300);
    const thumbH = 175;
    const thumbTop = y + 2;
    drawThumb(c.visual, margin, thumbTop, thumbW, thumbH);
    y = thumbTop + thumbH + 6;
    const consoleH = 62;
    if (showConsole) drawConsole(c, margin, y, w, consoleH);
    y += consoleH + 4;
    noStroke();
    fill('black');
    textStyle(BOLD);
    textSize(15);
    text('Which failure mode is this? Click a card.', margin, y);
    textStyle(NORMAL);
    drawCards(margin, y + 20, w, true);
    // In the narrow layout the feedback covers the picture until the next case
    if (feedback) drawFeedback(margin, thumbTop, w, y - thumbTop - 6);
  }

  drawTooltip();
}

// Case heading and symptom; returns the y below them
function drawCaseText(c, x, y, w) {
  noStroke();
  fill('black');
  textStyle(BOLD);
  textSize(16);
  const head = wrapLines('Case ' + (caseIndex + 1) + ' of ' + data.cases.length + ': ' + c.title, w);
  for (const ln of head) { text(ln, x, y); y += 19; }
  textStyle(NORMAL);
  textSize(15);
  const lines = wrapLines('Symptom: ' + c.symptom, w);
  for (const ln of lines) { text(ln, x, y); y += 18; }
  return y + 2;
}

// Six failure-mode cards in two columns; returns the bottom y
function drawCards(x, y, w, narrow) {
  cardRects = [];
  const cols = 2;
  const gap = 8;
  const cw = (w - gap) / cols;
  const ch = narrow ? 34 : 64;
  for (let i = 0; i < data.modes.length; i++) {
    const m = data.modes[i];
    const cx = x + (i % cols) * (cw + gap);
    const cy = y + floor(i / cols) * (ch + gap);
    const c = currentCase();

    // Card colors show selection and, after Check, right and wrong
    let fillColor = 'white', strokeColor = 'lightsteelblue', sw = 1;
    if (feedback && feedback.revealed && m.id === c.answer) {
      fillColor = 'honeydew'; strokeColor = 'seagreen'; sw = 3;
    } else if (feedback && feedback.wrongPick === m.id) {
      fillColor = 'mistyrose'; strokeColor = 'firebrick'; sw = 3;
    } else if (selectedMode === m.id) {
      fillColor = 'lightyellow'; strokeColor = 'steelblue'; sw = 3;
    } else if (hoverMode === m.id) {
      strokeColor = 'steelblue'; sw = 2;
    }
    fill(fillColor);
    stroke(strokeColor);
    strokeWeight(sw);
    rect(cx, cy, cw, ch, 6);
    strokeWeight(1);

    noStroke();
    fill('black');
    textStyle(BOLD);
    textSize(narrow ? 14 : 15);
    textAlign(LEFT, TOP);
    const nameLines = wrapLines(m.name, cw - 16);
    text(nameLines[0], cx + 8, cy + (narrow ? 9 : 7));
    textStyle(NORMAL);
    if (!narrow) {
      fill('dimgray');
      textSize(13);
      const sl = wrapLines(m.symptom, cw - 16).slice(0, 2);
      for (let k = 0; k < sl.length; k++) text(sl[k], cx + 8, cy + 28 + k * 16);
    }
    cardRects.push({ id: m.id, x: cx, y: cy, w: cw, h: ch });
  }
  return y + 3 * (ch + gap) - gap;
}

// Simulated browser console
function drawConsole(c, x, y, w, maxH) {
  const lines = c.console.length ? c.console : [{ level: 'info', text: 'No messages. The console is clean.' }];
  textSize(12);
  textFont('monospace');
  let wrapped = [];
  for (const ln of lines) {
    for (const piece of wrapLines(ln.text, w - 16)) wrapped.push({ level: ln.level, text: piece });
  }
  const h = min(maxH, wrapped.length * 15 + 26);
  fill(40);
  noStroke();
  rect(x, y, w, h, 6);
  fill('lightgray');
  text('Console', x + 8, y + 5);
  let ty = y + 21;
  for (const ln of wrapped) {
    if (ty + 14 > y + h) break;
    fill(ln.level === 'error' ? 'salmon' : 'lightgreen');
    text(ln.text, x + 8, ty);
    ty += 15;
  }
  textFont('sans-serif');
}

// Feedback panel after Check
function drawFeedback(x, y, w, h) {
  // Shrink the panel to its content when there is spare room
  const size = canvasWidth < narrowBreakpoint ? 14 : 15;
  const lh = size + 3;
  textSize(size);
  let nLines = 0;
  for (const part of feedback.parts) {
    textStyle(part.bold ? BOLD : NORMAL);
    nLines += wrapLines(part.text, w - 16).length;
  }
  textStyle(NORMAL);
  h = min(h, nLines * lh + 18);
  fill('white');
  stroke(feedback.correct ? 'seagreen' : (feedback.revealed ? 'firebrick' : 'darkorange'));
  strokeWeight(2);
  rect(x, y, w, h, 10);
  strokeWeight(1);
  noStroke();
  textAlign(LEFT, TOP);
  let ty = y + 8;
  for (const part of feedback.parts) {
    textSize(size);
    textStyle(part.bold ? BOLD : NORMAL);
    fill(part.color || 'black');
    for (const ln of wrapLines(part.text, w - 16)) {
      if (ty + lh > y + h - 4) break;
      text(ln, x + 8, ty);
      ty += lh;
    }
  }
  textStyle(NORMAL);
}

// Picture of the defective MicroSim, with the defect visible
function drawThumb(kind, x, y, w, h) {
  push();
  const dh = floor(h * 0.74);
  const ch = h - dh;
  const midC = y + dh + ch / 2;

  if (kind === 'blank') {
    fill('white');
    stroke('gray');
    rect(x, y, w, h);
    noStroke();
    fill('gray');
    textSize(13);
    textAlign(CENTER, CENTER);
    text('(empty canvas)', x + w / 2, y + h / 2);
    pop();
    return;
  }

  let simW = w;
  if (kind === 'narrow-canvas') {
    // The page is wider than the fixed canvas: an empty strip on the right
    simW = floor(w * 0.62);
    fill('whitesmoke');
    stroke('silver');
    rect(x, y, w, h);
    drawingContext.setLineDash([4, 3]);
    stroke('firebrick');
    noFill();
    rect(x + simW + 3, y + 3, w - simW - 6, h - 6);
    drawingContext.setLineDash([]);
    noStroke();
    fill('firebrick');
    textSize(12);
    textAlign(CENTER, CENTER);
    text('empty', x + simW + (w - simW) / 2, y + h / 2);
  }

  // Standard mini MicroSim: drawing region and control region
  stroke('silver');
  fill('aliceblue');
  rect(x, y, simW, dh);
  fill('white');
  rect(x, y + dh, simW, ch);

  const title = kind === 'missing-image' ? 'Breadboard' : (kind === 'jagged-curves' ? 'Workflow' : 'Bouncing Ball');
  textAlign(CENTER, TOP);
  textSize(13);
  if (kind === 'outlined-text') {
    stroke('black');
    strokeWeight(1.6);
    fill('black');
  } else {
    noStroke();
    fill('black');
  }
  text(title, x + simW / 2, y + 5);
  strokeWeight(1);

  // Main picture
  if (kind === 'missing-image') {
    drawingContext.setLineDash([4, 3]);
    stroke('gray');
    noFill();
    rect(x + simW * 0.2, y + 26, simW * 0.6, dh - 36);
    drawingContext.setLineDash([]);
    noStroke();
    fill('gray');
    textAlign(CENTER, CENTER);
    textSize(12);
    text('board.png ?', x + simW / 2, y + 26 + (dh - 36) / 2);
  } else if (kind === 'jagged-curves') {
    const bw = simW * 0.22, bh = 22, by = y + dh * 0.5;
    const xs = [x + simW * 0.06, x + simW * 0.39, x + simW * 0.72];
    const labels = ['Spec', 'Scaffold', 'Sketch'];
    for (let i = 0; i < 3; i++) {
      stroke('steelblue');
      fill('white');
      rect(xs[i], by - bh / 2, bw, bh, 4);
      noStroke();
      fill('black');
      textSize(12);
      textAlign(CENTER, CENTER);
      text(labels[i], xs[i] + bw / 2, by);
    }
    // Arrows that should be smooth arcs, drawn as straight spikes
    stroke('firebrick');
    strokeWeight(2);
    noFill();
    for (let i = 0; i < 2; i++) {
      const x1 = xs[i] + bw / 2, x2 = xs[i + 1] + bw / 2, top = by - bh / 2;
      beginShape();
      vertex(x1, top);
      vertex(x1 + (x2 - x1) * 0.2, top - 34);
      vertex(x1 + (x2 - x1) * 0.5, top - 8);
      vertex(x1 + (x2 - x1) * 0.8, top - 34);
      vertex(x2, top);
      endShape();
    }
    strokeWeight(1);
  } else {
    // A ball in its box
    const bx = x + simW * 0.62;
    const by = kind === 'control-in-drawing' ? y + dh - 30 : y + dh * 0.5;
    noStroke();
    fill('steelblue');
    circle(bx, by, h * 0.14);
  }

  // Control row picture: slider (and Reset button for the dead-button case)
  const drawSlider = (sx1, sx2, sy) => {
    stroke('gray');
    strokeWeight(3);
    line(sx1, sy, sx2, sy);
    strokeWeight(1);
    fill('white');
    stroke('gray');
    circle(sx1 + (sx2 - sx1) * 0.3, sy, 11);
  };
  const labelText = 'Speed: 3';
  textAlign(LEFT, CENTER);
  textSize(12);
  if (kind === 'control-in-drawing') {
    // The slider sits inside the drawing region, over the ball
    drawSlider(x + simW * 0.3, x + simW - 12, y + dh - 22);
  } else if (kind === 'dead-button') {
    fill('gainsboro');
    stroke('gray');
    rect(x + 6, midC - 9, 44, 18, 3);
    noStroke();
    fill('black');
    text('Reset', x + 11, midC);
    drawSlider(x + simW * 0.45, x + simW - 12, midC);
    // Pointer clicking the button
    fill('black');
    noStroke();
    triangle(x + 38, midC + 2, x + 38, midC + 16, x + 47, midC + 11);
    fill('firebrick');
    textSize(12);
    text('click: nothing', x + 58, y + dh - 10);
  } else if (kind !== 'jagged-curves') {
    if (kind === 'outlined-text') {
      stroke('black');
      strokeWeight(1.4);
    } else {
      noStroke();
    }
    fill('black');
    text(labelText, x + 8, midC);
    strokeWeight(1);
    drawSlider(x + simW * 0.4, x + simW - 12, midC);
  } else {
    fill('gainsboro');
    stroke('gray');
    rect(x + 6, midC - 9, 40, 18, 3);
    noStroke();
    fill('black');
    text('Next', x + 12, midC);
  }

  if (kind === 'clipped-bottom') {
    // The iframe ends half way through the control row; the chapter text continues below
    const cut = floor(y + dh + ch * 0.45);
    noStroke();
    fill('white');
    rect(x - 1, cut, w + 2, y + h - cut + 1);
    stroke('firebrick');
    strokeWeight(2);
    drawingContext.setLineDash([5, 3]);
    line(x, cut, x + w, cut);
    drawingContext.setLineDash([]);
    strokeWeight(1);
    noStroke();
    fill('firebrick');
    textSize(12);
    textAlign(RIGHT, TOP);
    text('iframe ends here', x + w - 4, cut + 3);
    fill('darkgray');
    rect(x + 6, cut + 8, w * 0.4, 4);
  }
  pop();
}

function drawTooltip() {
  if (!hoverMode) return;
  const m = modeById(hoverMode);
  const msg = m.name + ': ' + m.definition;
  textSize(14);
  const boxW = min(320, canvasWidth - 20);
  const lines = wrapLines(msg, boxW - 16);
  const boxH = lines.length * 18 + 12;
  let bx = mouseX + 14;
  let by = mouseY + 16;
  if (bx + boxW > canvasWidth - 6) bx = canvasWidth - boxW - 6;
  if (by + boxH > drawHeight - 6) by = mouseY - boxH - 10;
  fill(255, 255, 240, 245);
  stroke('goldenrod');
  rect(bx, by, boxW, boxH, 6);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  for (let k = 0; k < lines.length; k++) text(lines[k], bx + 8, by + 6 + k * 18);
}

// ---------- actions ----------
function loadCase(i) {
  caseIndex = i;
  selectedMode = null;
  checked = false;
  attemptsThisCase = 0;
  feedback = null;
  showConsole = false;
  consoleButton.html('Show console');
  logInteraction('viewed-case');
}

function nextCase() {
  if (!data) return;
  let i = caseIndex + 1;
  if (i >= data.cases.length) {
    // Start a new round in a shuffled order
    caseOrder = shuffle(caseOrder);
    i = 0;
  }
  loadCase(i);
}

function toggleConsole() {
  if (!data) return;
  showConsole = !showConsole;
  consoleButton.html(showConsole ? 'Hide console' : 'Show console');
  if (showConsole) logInteraction('opened-console');
}

function checkAnswer() {
  if (!data) return;
  const c = currentCase();
  if (!selectedMode) {
    feedback = { correct: false, revealed: false, parts: [
      { text: 'Click the failure-mode card you think fits this symptom, then press Check.', color: 'black' }] };
    return;
  }
  if (checked) return;
  attemptsThisCase++;
  const correct = selectedMode === c.answer;
  if (attemptsThisCase === 1) {
    casesScored++;
    if (correct) firstTryCorrect++;
  }
  logInteraction('answered', {
    response: selectedMode, correct: correct, attempt: attemptsThisCase, consoleOpened: showConsole
  });

  const ans = modeById(c.answer);
  if (correct) {
    checked = true;
    feedback = { correct: true, revealed: true, parts: [
      { text: 'Correct: ' + ans.name + '.', color: 'seagreen', bold: true },
      { text: 'Cause: ' + ans.cause },
      { text: 'First repair: ' + ans.repair },
      { text: 'Evidence: ' + c.evidence, color: 'dimgray' }
    ] };
  } else {
    const pick = modeById(selectedMode);
    const why = (c.confusions && c.confusions[selectedMode])
      ? c.confusions[selectedMode]
      : pick.name + ' would show ' + pick.tell + '. Here, ' + c.evidence;
    checked = true;
    feedback = { correct: false, revealed: true, wrongPick: selectedMode, parts: [
      { text: 'Not quite: this is ' + ans.name + ', not ' + pick.name + '.', color: 'firebrick', bold: true },
      { text: 'Cause: ' + ans.cause },
      { text: 'First repair: ' + ans.repair },
      { text: 'What tells them apart: ' + why, color: 'dimgray' }
    ] };
  }
}

// ---------- helpers ----------
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

// ---------- events ----------
function mouseMoved() {
  hoverMode = null;
  if (mouseY < 0 || mouseY > drawHeight) return;
  for (const r of cardRects) {
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) hoverMode = r.id;
  }
}

function mousePressed() {
  mouseMoved();
  if (!data || !hoverMode || checked) return;
  selectedMode = hoverMode;
  if (feedback && !feedback.revealed) feedback = null;
  logInteraction('selected', { response: selectedMode });
}

function positionControls() {
  nextButton.position(10, drawHeight + 12);
  consoleButton.position(10 + nextButton.elt.offsetWidth + 10, drawHeight + 12);
  checkButton.position(10 + nextButton.elt.offsetWidth + consoleButton.elt.offsetWidth + 20, drawHeight + 12);
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
