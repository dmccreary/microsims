// Claim Sorter - p5.js MicroSim
// CANVAS_HEIGHT: 580
// Sort ten sentences about the xAPI stream and the Learning Record Store into three kinds of
// claim: Measured (observed and repeatable), Designed (specified, decided or planned) and
// Hoped for (expected but untested). Drag the top card of the stack onto a zone, or use the
// zone buttons (keyboard). A correct placement turns the card into a green chip and shows why;
// an incorrect one returns the card and shows the evidence a measured claim would need.
// Sources: Chapters 18-20 of this book and the LRS repository's TODO.md dated 2026-09-26.

// ---------- canvas layout ----------
let canvasWidth = 400;
let canvasHeight = 580;          // must equal CANVAS_HEIGHT above
let controlHeight = 46;          // recomputed by layoutControls()
let drawHeight = canvasHeight - controlHeight;
let margin = 25;
let defaultTextSize = 16;
let rowStep = 34;

// Okabe-Ito colors
const ZONES = [
  { key: 'measured', name: 'Measured', note: 'observed and repeatable', color: [0, 114, 178] },
  { key: 'designed', name: 'Designed', note: 'specified, decided or planned', color: [230, 159, 0] },
  { key: 'hoped', name: 'Hoped for', note: 'expected, not yet tested', color: [204, 121, 167] }
];
const RIGHT_COLOR = [0, 158, 115];     // bluish green
const WRONG_COLOR = [213, 94, 0];      // vermillion

const CARDS = [
  { id: 1, label: 'measured', short: 'AUC 0.743 (synthetic)',
    text: 'On the synthetic cohort, BKT reached an AUC of 0.743.',
    why: 'Measured, but about a simulation: the number was computed from a run that anyone can repeat with seed 19. It shows the evaluation code works, not how real learners behave.',
    hint: 'This sentence reports a number that was actually computed. That is what a measured claim needs: a run, a log or a metric someone can repeat. Is it a plan, a hope or a result?' },
  { id: 2, label: 'designed', short: 'BKT chosen (ADR-006)',
    text: 'The LRS design chooses Bayesian knowledge tracing for mastery (ADR-006).',
    why: 'Designed: a decision recorded in the design documents. Nothing in the sentence says the model has run or been tested.',
    hint: 'To be measured it would need a running BKT component and an observed result, such as estimates checked against held-out outcomes. A decision record is not an observation.' },
  { id: 3, label: 'hoped', short: 'Streams predict mastery',
    text: 'MicroSim xAPI streams predict real learners\' mastery.',
    why: 'Hoped for: no learner data have been collected, so this is the hypothesis the whole evaluation exists to test.',
    hint: 'A measured version would need held-out assessment outcomes from real learners compared with forecasts, and none exist yet. No design can make it true either.' },
  { id: 4, label: 'measured', short: 'No emitter yet (TODO)',
    text: 'As of TODO.md dated 2026-09-26, no emitter sends statements to a store.',
    why: 'Measured: an observed state of the repository, recorded with its date (the statement table held zero rows). Anyone can check it.',
    hint: 'This reports what was observed in the repository on a given date. A measured claim needs an observation someone can check. Does this sentence cite one?' },
  { id: 5, label: 'designed', short: 'Transfer items planned',
    text: 'The held-out assessment will use transfer items the learner never practiced.',
    why: 'Designed: part of the evaluation protocol, fixed before any data exist. It says how the test will be built, not what it found.',
    hint: 'A measured claim would report an assessment that was actually given and scored. This sentence describes a planned procedure.' },
  { id: 6, label: 'measured', short: 'Baseline 0.635',
    text: 'Always predicting "correct" scores 0.635 accuracy on the synthetic cohort.',
    why: 'Measured: computed on the synthetic cohort (127 of 200 learners answered correctly) and repeatable with the same seed. Again, it is about a simulation.',
    hint: 'The number here was computed from data. A measured claim needs a result someone can recompute, and this sentence has one.' },
  { id: 7, label: 'measured', short: 'Retry: 3 statements',
    text: 'A quiz retried three times emitted three answered statements: false, false, true.',
    why: 'Measured: the repository records this behavior as verified in a browser in July 2026.',
    hint: 'This was observed in a browser session and recorded. An observation plus a record of it is what a measured claim needs.' },
  { id: 8, label: 'designed', short: 'One partition per learner',
    text: 'The LRS keeps each learner\'s statements on one partition so they are read in order.',
    why: 'Designed: a partitioning decision in the LRS design, motivated by attempt order. The processor that would read the partitions is not built yet.',
    hint: 'To be measured, someone would have to run the stream with real traffic and check the order the processor read. The processor does not exist yet.' },
  { id: 9, label: 'hoped', short: 'Predicting is diagnostic',
    text: 'Entering a prediction before running a MicroSim is diagnostic of mastery.',
    why: 'Hoped for: the chapter\'s pass rates of 0.75 and 0.30 are hypothetical counts chosen to show the arithmetic, not data from any study.',
    hint: 'A measured claim would need real held-out pass rates for learners who did and did not predict, checked for confounders. The chapter\'s counts are hypothetical.' },
  { id: 10, label: 'hoped', short: 'Trust dashboard %',
    text: 'Teachers can trust dashboard mastery percentages at face value.',
    why: 'Hoped for: trusting a percentage as a rate requires calibration on real learners, which has not been measured.',
    hint: 'A measured version would need a calibration table from real learners showing that forecasts come true at their stated rates.' }
];

// ---------- state ----------
let stack = [];                  // card ids still to sort, top of stack = stack[0]
let placed = {};                 // id -> zone key (correct placements only)
let attempts = 0, firstTryRight = 0;
let triedWrong = new Set();
let feedback = null;             // { kind: 'right'|'wrong'|'summary'|'review'|'intro', ... }
let drag = null;                 // { dx, dy, x, y }
let L = null;
let zoneButtons = [], checkButton, shuffleButton, resetButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  ZONES.forEach(z => {
    const b = createButton('→ ' + z.name);
    b.mousePressed(() => placeTop(z.key));
    zoneButtons.push(b);
  });
  checkButton = createButton('Check all');
  checkButton.mousePressed(checkAll);
  shuffleButton = createButton('Shuffle');
  shuffleButton.mousePressed(shuffleStack);
  resetButton = createButton('Reset');
  resetButton.mousePressed(resetAll);
  for (const b of [...zoneButtons, checkButton, shuffleButton, resetButton]) b.parent(document.querySelector('main'));

  resetAll();
  layoutControls();

  describe('A card sorting activity. The top card of a stack shows a sentence about the xAPI stream or the ' +
    'Learning Record Store. Drag it into one of three zones, Measured, Designed or Hoped for, or use the zone ' +
    'buttons below. A feedback panel explains each correct placement or gives a hint naming the evidence a ' +
    'measured claim would need, and a counter shows how many of ten cards are correctly placed.');
}

function resetAll() {
  stack = CARDS.map(c => c.id);
  placed = {};
  attempts = 0;
  firstTryRight = 0;
  triedWrong = new Set();
  feedback = { kind: 'intro' };
  drag = null;
}

function shuffleStack() {
  for (let i = stack.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [stack[i], stack[j]] = [stack[j], stack[i]];
  }
  logEvent('shuffled the remaining ' + stack.length + ' cards');
}

function cardById(id) { return CARDS.find(c => c.id === id); }
function zoneByKey(k) { return ZONES.find(z => z.key === k); }
function logEvent(msg) { console.log('[fidelity-claim-sorter] ' + msg); }

// ---------- sorting ----------
function placeTop(zoneKey) {
  if (stack.length === 0) return;
  const card = cardById(stack[0]);
  attempts++;
  if (card.label === zoneKey) {
    stack.shift();
    placed[card.id] = zoneKey;
    if (!triedWrong.has(card.id)) firstTryRight++;
    feedback = { kind: 'right', card };
    logEvent('card ' + card.id + ' placed in ' + zoneKey + ': correct');
  } else {
    triedWrong.add(card.id);
    feedback = { kind: 'wrong', card, tried: zoneKey };
    logEvent('card ' + card.id + ' placed in ' + zoneKey + ': incorrect (returned to the stack)');
  }
}

function checkAll() {
  feedback = { kind: 'summary' };
  logEvent('check all: ' + Object.keys(placed).length + ' of ' + CARDS.length + ' correctly placed, ' +
    stack.length + ' left, ' + attempts + ' attempts');
}

// ---------- layout ----------
function computeLayout() {
  const wide = canvasWidth >= 640;
  const g = { wide };
  const top = 38;
  if (wide) {
    const leftW = Math.floor(canvasWidth * 0.62);
    g.card = { x: 22, y: top + 8, w: leftW - 44, h: 100 };
    g.zoneTop = top + 132;
    g.zones = ZONES.map((z, i) => {
      const w = (leftW - 20 - 16) / 3;
      return { x: 10 + i * (w + 8), y: g.zoneTop, w, h: drawHeight - g.zoneTop - 10 };
    });
    g.panel = { x: leftW, y: top, w: canvasWidth - leftW - 10, h: drawHeight - top - 10 };
  } else {
    g.card = { x: 16, y: top + 6, w: canvasWidth - 32, h: 92 };
    g.zoneTop = top + 112;
    const zh = 50;
    g.zones = ZONES.map((z, i) => ({ x: 6, y: g.zoneTop + i * (zh + 5), w: canvasWidth - 12, h: zh }));
    const py = g.zoneTop + 3 * (zh + 5) + 2;
    g.panel = { x: 6, y: py, w: canvasWidth - 12, h: drawHeight - py - 6 };
  }
  return g;
}

function zoneAt(x, y) {
  for (let i = 0; i < L.zones.length; i++) {
    const z = L.zones[i];
    if (x >= z.x && x <= z.x + z.w && y >= z.y && y <= z.y + z.h) return ZONES[i].key;
  }
  return null;
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
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(L.wide ? 21 : 18);
  const title = canvasWidth >= 520 ? 'Claim Sorter: Measured, Designed or Hoped For?' : 'Claim Sorter';
  text(title, canvasWidth / 2, 8);

  drawZones();
  drawStack();
  drawPanel();
  drawChipHover();
}

function drawZones() {
  const hoverZone = drag ? zoneAt(mouseX, mouseY) : null;
  ZONES.forEach((z, i) => {
    const r = L.zones[i];
    const c = z.color;
    stroke(c[0], c[1], c[2]);
    strokeWeight(hoverZone === z.key ? 4 : 2);
    fill(c[0], c[1], c[2], hoverZone === z.key ? 55 : 22);
    rect(r.x, r.y, r.w, r.h, 10);
    noStroke();
    fill(c[0] * 0.6, c[1] * 0.6, c[2] * 0.6);
    textStyle(BOLD);
    textSize(L.wide ? 17 : 15);
    textAlign(LEFT, TOP);
    text(z.name, r.x + 10, r.y + 7);
    textStyle(NORMAL);
    fill(50);
    textSize(L.wide ? 12 : 12);
    if (L.wide) text(z.note, r.x + 10, r.y + 28, r.w - 16, 32);
    else text(z.note, r.x + 100, r.y + 9);
    drawChips(z.key, r);
  });
}

// chips for correctly placed cards
function chipRects(zoneKey, r) {
  const ids = CARDS.filter(c => placed[c.id] === zoneKey).map(c => c.id);
  const out = [];
  if (L.wide) {
    ids.forEach((id, k) => out.push({ id, x: r.x + 6, y: r.y + 62 + k * 30, w: r.w - 12, h: 26 }));
  } else {
    ids.forEach((id, k) => out.push({ id, x: r.x + 8 + k * 44, y: r.y + 26, w: 40, h: 20 }));
  }
  return out;
}

function drawChips(zoneKey, r) {
  for (const ch of chipRects(zoneKey, r)) {
    const card = cardById(ch.id);
    const selected = feedback && feedback.card && feedback.card.id === ch.id;
    stroke(selected ? 0 : 255);
    strokeWeight(selected ? 2 : 1);
    fill(RIGHT_COLOR);
    rect(ch.x, ch.y, ch.w, ch.h, 6);
    noStroke();
    fill('white');
    textAlign(LEFT, CENTER);
    textSize(L.wide ? 13 : 12);
    const label = L.wide ? '#' + card.id + ' ' + card.short : '✓' + card.id;
    text(fitText(label, ch.w - 10), ch.x + 6, ch.y + ch.h / 2);
  }
}

function fitText(s, w) {
  if (fontWidth(s) <= w) return s;
  while (s.length > 3 && fontWidth(s + '…') > w) s = s.slice(0, -1);
  return s + '…';
}

function drawStack() {
  const c = L.card;
  if (stack.length === 0) {
    stroke(RIGHT_COLOR);
    strokeWeight(2);
    fill(255);
    rect(c.x, c.y, c.w, c.h, 10);
    noStroke();
    fill(0, 110, 80);
    textSize(L.wide ? 18 : 16);
    textAlign(CENTER, CENTER);
    text('All ' + CARDS.length + ' cards sorted. Press "Check all" for your summary.', c.x + 10, c.y, c.w - 20, c.h);
    return;
  }
  // cards waiting underneath
  const under = Math.min(2, stack.length - 1);
  for (let k = under; k >= 1; k--) {
    stroke(170);
    strokeWeight(1);
    fill(250);
    rect(c.x + k * 5, c.y + k * 5, c.w, c.h, 10);
  }
  const card = cardById(stack[0]);
  let x = c.x, y = c.y;
  if (drag) { x = mouseX - drag.dx; y = mouseY - drag.dy; }
  if (drag) {
    drawingContext.shadowColor = 'rgba(0,0,0,0.3)';
    drawingContext.shadowBlur = 10;
  }
  stroke(feedback && feedback.kind === 'wrong' && feedback.card.id === card.id ? color(WRONG_COLOR) : color(90));
  strokeWeight(2);
  fill(255);
  rect(x, y, c.w, c.h, 10);
  drawingContext.shadowBlur = 0;
  noStroke();
  fill(90);
  textSize(12);
  textAlign(LEFT, TOP);
  text('Card #' + card.id + '  •  ' + stack.length + ' left  •  drag me to a zone', x + 12, y + 7);
  fill(0);
  textSize(L.wide ? 17 : 15);
  text(card.text, x + 12, y + 26, c.w - 24, c.h - 30);
}

function drawPanel() {
  const p = L.panel;
  stroke(205);
  strokeWeight(1);
  fill('white');
  rect(p.x, p.y, p.w, p.h, 8);
  const pad = 10;
  let y = p.y + 8;
  const fs = L.wide ? 14 : 13;
  noStroke();
  textAlign(LEFT, TOP);

  // counter (always visible)
  const nPlaced = Object.keys(placed).length;
  fill(20);
  textStyle(BOLD);
  textSize(fs);
  text('Correctly placed: ' + nPlaced + ' of ' + CARDS.length, p.x + pad, y);
  textStyle(NORMAL);
  fill(80);
  textSize(fs - 2);
  const attemptsText = 'attempts: ' + attempts;
  const room = p.x + p.w - pad - fontWidth(attemptsText) > p.x + pad + 20 + fontWidth('Correctly placed: 10 of 10') * 1.08;
  if (room) text(attemptsText, p.x + p.w - pad - fontWidth(attemptsText), y + 1);
  else { y += fs + 3; text(attemptsText, p.x + pad, y); }
  y += fs + 10;
  stroke(225);
  line(p.x + pad, y - 4, p.x + p.w - pad, y - 4);
  noStroke();

  const w = p.w - 2 * pad;
  const f = feedback || { kind: 'intro' };
  if (f.kind === 'intro') {
    fill(40);
    textSize(fs);
    text('Read the top card and decide what kind of claim it is. Ask: was it observed and can it be repeated ' +
      '(measured), is it what a system is specified or planned to do (designed), or is it expected but untested ' +
      '(hoped for)?', p.x + pad, y, w, p.y + p.h - y - 6);
    return;
  }
  if (f.kind === 'summary') {
    const left = stack.map(id => '#' + id).join(', ');
    let msg = nPlaced + ' of ' + CARDS.length + ' cards are correctly placed';
    msg += stack.length ? ', and ' + stack.length + ' remain in the stack (' + left + ').' : '.';
    msg += ' First-try correct: ' + firstTryRight + ' of ' + nPlaced + ' placed cards, in ' + attempts + ' attempts.';
    if (stack.length) msg += ' For each remaining card ask what evidence would make it a measured claim, and whether that evidence exists.';
    else msg += ' Click any green chip to review its explanation.';
    fill(20);
    textStyle(BOLD);
    textSize(fs + 1);
    text('Check all', p.x + pad, y);
    textStyle(NORMAL);
    textSize(fs);
    fill(40);
    text(msg, p.x + pad, y + fs + 8, w, p.y + p.h - y - fs - 12);
    return;
  }
  // right / wrong / review of one card
  const card = f.card;
  const zone = zoneByKey(card.label);
  const bottom = p.y + p.h - 6;
  textStyle(BOLD);
  textSize(fs + 1);
  if (f.kind === 'wrong') {
    fill(WRONG_COLOR);
    y = drawWrapped('✗ Not ' + zoneByKey(f.tried).name + ': the card went back to the stack', p.x + pad, y, w, fs + 5, bottom);
  } else {
    fill(0, 120, 90);
    y = drawWrapped('✓ ' + zone.name + (f.kind === 'review' ? ' (review)' : ': correct'), p.x + pad, y, w, fs + 5, bottom);
  }
  textStyle(NORMAL);
  y += 6;
  if (L.wide) {
    textSize(fs - 1);
    textStyle(ITALIC);
    fill(70);
    y = drawWrapped('#' + card.id + ' “' + card.text + '”', p.x + pad, y, w, fs + 3, bottom);
    textStyle(NORMAL);
    y += 8;
  }
  fill(20);
  textSize(fs);
  drawWrapped(f.kind === 'wrong' ? 'Hint: ' + card.hint : card.why, p.x + pad, y, w, fs + 5, bottom);
}

// Draw word-wrapped text line by line with the current font; returns the y below the last line.
function drawWrapped(str, x, y, w, lineH, bottom) {
  const words = str.split(' ');
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (fontWidth(test) > w && line) {
      if (y + lineH > bottom) return y;
      text(line, x, y);
      y += lineH;
      line = word;
    } else {
      line = test;
    }
  }
  if (line && y + lineH <= bottom + 2) {
    text(line, x, y);
    y += lineH;
  }
  return y;
}

function chipAt(mx, my) {
  if (!L) return null;
  for (let i = 0; i < ZONES.length; i++) {
    for (const ch of chipRects(ZONES[i].key, L.zones[i])) {
      if (mx >= ch.x && mx <= ch.x + ch.w && my >= ch.y && my <= ch.y + ch.h) return ch.id;
    }
  }
  return null;
}

function drawChipHover() {
  if (drag) { cursor('grabbing'); return; }
  const c = L.card;
  const overCard = stack.length && mouseX >= c.x && mouseX <= c.x + c.w && mouseY >= c.y && mouseY <= c.y + c.h;
  cursor(overCard ? 'grab' : (chipAt(mouseX, mouseY) ? HAND : ARROW));
}

// ---------- mouse ----------
function mousePressed() {
  if (!L || mouseY > drawHeight) return;
  const c = L.card;
  if (stack.length && mouseX >= c.x && mouseX <= c.x + c.w && mouseY >= c.y && mouseY <= c.y + c.h) {
    drag = { dx: mouseX - c.x, dy: mouseY - c.y };
    return;
  }
  const id = chipAt(mouseX, mouseY);
  if (id) feedback = { kind: 'review', card: cardById(id) };
}

function mouseReleased() {
  if (!drag) return;
  const zone = zoneAt(mouseX, mouseY);
  drag = null;
  if (zone) placeTop(zone);
}

// ---------- responsive layout ----------
function layoutControls() {
  const items = [...zoneButtons, checkButton, shuffleButton, resetButton];
  let x = 10, row = 0;
  const pos = [];
  for (const el of items) {
    const w = el.elt.offsetWidth || 90;
    if (x + w > canvasWidth - 10 && x > 10) { row++; x = 10; }
    pos.push({ el, x, row });
    x += w + 8;
  }
  controlHeight = (row + 1) * rowStep + 12;
  drawHeight = canvasHeight - controlHeight;
  for (const p of pos) p.el.position(p.x, drawHeight + 8 + p.row * rowStep);
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
