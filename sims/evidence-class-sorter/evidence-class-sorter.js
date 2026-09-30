// Evidence Class Sorter - assign each interaction in a mock MicroSim to its evidence class
// CANVAS_HEIGHT: 760
// Learning objective (Analyze / distinguish): the learner distinguishes the evidence classes by
// assigning each interaction in a described MicroSim to its class and explaining the deciding
// question (Chapter 16, "Evidence Classes").
// Click an element of the mock MicroSim (or pick it from the Item list), then choose a bin. The
// infobox names the deciding question from the seven-question list and what Full mode emits;
// the Compact checkbox shows the folded summary fields instead (an assessment is unchanged).
// Challenge mode presents eight unlabeled events to classify, with a score.

// ---------- Canvas dimensions ----------
// Fixed total height; the drawing/control split is recomputed when the controls wrap.
let canvasWidth = 800;
let canvasHeight = 760;
let controlHeight = 50;
let drawHeight = canvasHeight - controlHeight;
let margin = 12;
let defaultTextSize = 16;

// Text colors for right / wrong feedback (dark Okabe-Ito bluish green and vermillion)
const RIGHT_TEXT = [0, 115, 85], WRONG_TEXT = [185, 70, 0];

// ---------- Evidence classes (bins), from the chapter's class table ----------
// Bin colors are the Okabe-Ito color-blind-safe palette; each bin also has a number and label.
const BINS = [
  { id: 'continuous', label: 'Continuous parameter', num: '1', color: [0, 114, 178], ink: 'white',
    def: 'A control that sets a number along a range: a slider, a zoom, a numeric input.',
    full: 'one interacted statement per deadband step (default: the range divided by 60), with value and previous-value; the release value is always sent',
    compact: 'a count, the minimum, the maximum, the last value and the number of reversals' },
  { id: 'inspection', label: 'Discrete inspection', num: '2', color: [86, 180, 233], ink: 'black',
    def: 'Looking at, opening, selecting or pinning one identifiable thing: a node, a marker, a legend entry, a data point.',
    full: 'one interacted statement with the engagement mode (hover, click, pinned, select) and the duration',
    compact: 'counts, modes and time for each object' },
  { id: 'run', label: 'Run and pause', num: '3', color: [230, 159, 0], ink: 'black',
    def: 'The interval between starting and stopping the MicroSim\'s time. One-shot presses such as Reset (class 3a) are a variant of this class.',
    full: 'an interacted press (action start or pause) for each press, plus one experienced statement per run, emitted on Pause with its duration; nothing for a run under 250 ms',
    compact: 'the run time plus a press touch' },
  { id: 'dwell', label: 'Page dwell', num: '4', color: [204, 121, 167], ink: 'black',
    def: 'Time on a MicroSim that has no Run control, recorded when focus is lost.',
    full: 'one experienced statement on focus loss, only if the visit lasted one second or more',
    compact: 'carried by the session summary\'s time' },
  { id: 'assessment', label: 'Assessment', num: '5', color: [0, 158, 115], ink: 'white',
    def: 'Any interaction that checks a response against a right answer. The only class that reports success.',
    full: 'one answered statement with result.success for every deliberate attempt, wrong ones included',
    compact: 'UNCHANGED: the answered statement passes through at once, as its own statement, in both modes, because a knowledge-tracing model reads the order of attempts' },
  { id: 'focus', label: 'Focus loss', num: '6', color: [213, 94, 0], ink: 'white',
    def: 'The tab is hidden, the MicroSim scrolls away, the learner goes idle or the window blurs. The runtime handles it; the author writes no code.',
    full: 'no statement of its own: it closes the open run or page interval, which emits its experienced statement then (never a synthetic Pause press)',
    compact: 'ends the Compact session, which then emits its one summary statement' },
  { id: 'none', label: 'Not evidence', num: '7', color: [105, 105, 105], ink: 'white',
    def: 'Events the program fires itself, and acts below a non-evidence threshold such as a hover under 600 ms.',
    full: 'nothing', compact: 'nothing' }
];

// ---------- The seven-question decision list (asked in order) ----------
const QUESTIONS = [
  { short: 'Checks a response against a right answer?', to: 'assessment', long: 'Does it check a response against a right answer? Then it is assessment, whatever it looks like.' },
  { short: 'Changes a number continuously?', to: 'continuous parameter', long: 'Does it change a numeric parameter continuously? Then it is a continuous parameter.' },
  { short: 'Starts or stops time passing?', to: 'run and pause', long: 'Does it start or stop time passing in the MicroSim? Then it is run and pause, and the interval is the evidence.' },
  { short: 'One-shot action such as Reset?', to: 'discrete press (3a)', long: 'Is it a one-shot action such as Reset? Then it is a discrete press (class 3a).' },
  { short: 'Looks at, opens, selects or pins?', to: 'discrete inspection', long: 'Is it the learner looking at, opening, selecting or pinning something? Then it is discrete inspection.' },
  { short: 'No Run control at all?', to: 'add page dwell', long: 'Does the MicroSim have no Run control at all? Then add page dwell so time on it is still recorded.' },
  { short: 'Fired by the program?', to: 'not evidence', long: 'Did the program fire the event rather than the learner? Then it is not evidence.' }
];

// ---------- Elements of the mock MicroSim (Explore mode) ----------
// q: deciding question (1-7); 0 = not reached by the list (focus loss)
const ITEMS = [
  { id: 'slider', short: 'Gravity slider', name: 'Gravity slider', bin: 'continuous', q: 2 },
  { id: 'startpause', short: 'Start/Pause button', name: 'Start/Pause button', bin: 'run', q: 3 },
  { id: 'reset', short: 'Reset button', name: 'Reset button', bin: 'run', q: 4,
    full: 'one interacted statement with the action extension "reset"; a press never claims a duration',
    compact: 'a touch with its mode' },
  { id: 'node', short: 'Diagram node', name: 'Diagram node (hover of 600 ms or more, or a click)', bin: 'inspection', q: 5 },
  { id: 'check', short: 'Checked prediction', name: 'Checked prediction (the Check button)', bin: 'assessment', q: 1 },
  { id: 'ball', short: 'Ball animation', name: 'Ball animation frames', bin: 'none', q: 7,
    note: 'The draw loop moves the ball every frame; no learner act is involved.' },
  { id: 'tab', short: 'Another tab', name: 'Switching to another browser tab', bin: 'focus', q: 0 }
];

// ---------- Challenge events ----------
const CHALLENGE = [
  { text: 'The pointer crosses the diagram in 300 milliseconds.', bin: 'none', q: 5,
    note: 'Looking at a node would be question 5, but a 300 ms crossing is below the 600 ms hover threshold, so it is not evidence.' },
  { text: 'The learner drags the gravity slider from 9.8 to 3.7.', bin: 'continuous', q: 2 },
  { text: 'The learner rests the pointer on the Velocity node for 1.2 seconds.', bin: 'inspection', q: 5 },
  { text: 'The learner picks "lower" and presses Check; the MicroSim marks it correct.', bin: 'assessment', q: 1 },
  { text: 'The learner switches to another browser tab while the ball is running.', bin: 'focus', q: 0 },
  { text: 'A learner spends two minutes reading a static diagram MicroSim that has no Run control.', bin: 'dwell', q: 6 },
  { text: 'The sketch redraws its canvas by itself after the window is resized.', bin: 'none', q: 7 },
  { text: 'The learner presses Start, watches for 20 seconds, then presses Pause.', bin: 'run', q: 3 }
];

// ---------- State ----------
let selected = null;       // the ITEMS entry (Explore) being classified
let answer = null;         // { item, bin, correct } after a bin is chosen
let exploreDone = {};      // item id -> true when classified correctly
let challenge = false;
let chOrder = [];
let chIndex = 0;
let chScore = 0;
let chAnswered = false;
let hoverBin = -1;
let mockRects = [];
let binRects = [];
let ballX = 0.3, ballY = 0.2, ballVX = 0.012, ballVY = 0;

// controls
let itemSelect, binSelect, assignButton, compactBox, challengeButton, nextButton;
let controlItems = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('sans-serif');
  frameRate(30);
  const main = document.querySelector('main');

  itemSelect = createSelect();
  itemSelect.option('Item: choose an element', '');
  for (const it of ITEMS) itemSelect.option(it.short, it.id);
  itemSelect.style('width', '165px');
  itemSelect.changed(() => selectItem(itemSelect.value()));
  binSelect = createSelect();
  BINS.forEach((b, i) => binSelect.option('Bin ' + b.num + ': ' + b.label, i));
  binSelect.style('width', '175px');
  assignButton = createButton('Assign');
  assignButton.mousePressed(() => chooseBin(int(binSelect.value())));
  compactBox = createCheckbox('Compact mode', false);
  challengeButton = createButton('Challenge');
  challengeButton.mousePressed(toggleChallenge);
  nextButton = createButton('Next event');
  nextButton.mousePressed(nextChallenge);
  controlItems = [itemSelect, binSelect, assignButton, compactBox, challengeButton, nextButton];
  for (const c of controlItems) c.parent(main);
  updateControls();

  describe('Evidence Class Sorter. A mock MicroSim with a gravity slider, Start/Pause and Reset buttons, ' +
    'a bouncing ball, a three-node diagram, a checked prediction and a browser tab bar sits beside the ' +
    'seven-question decision list. Select an element, then choose one of seven evidence-class bins. ' +
    'The infobox names the deciding question and the statement Full mode emits, or the Compact summary ' +
    'fields when Compact mode is checked. Challenge mode asks you to classify eight described events.');
}

// ---------- Actions ----------
function selectItem(id) {
  if (challenge) return;
  selected = ITEMS.find(it => it.id === id) || null;
  answer = null;
  if (selected) itemSelect.selected(selected.id);
  if (selected) console.log('[evidence-class-sorter] selected: ' + selected.name);
}

function chooseBin(i) {
  const b = BINS[i];
  if (challenge) {
    if (chAnswered || chIndex >= CHALLENGE.length) return;
    const ev = CHALLENGE[chOrder[chIndex]];
    answer = { item: ev, bin: b.id, correct: ev.bin === b.id };
    if (answer.correct) chScore++;
    chAnswered = true;
  } else {
    if (!selected) return;
    answer = { item: selected, bin: b.id, correct: selected.bin === b.id };
    if (answer.correct) exploreDone[selected.id] = true;
  }
  console.log('[evidence-class-sorter] ' + (answer.item.name || answer.item.text) + ' -> ' + b.label +
    (answer.correct ? ' (correct)' : ' (correct class: ' + BINS.find(x => x.id === answer.item.bin).label + ')'));
  updateControls();
}

function toggleChallenge() {
  challenge = !challenge;
  answer = null;
  selected = null;
  if (challenge) {
    chOrder = shuffle([...Array(CHALLENGE.length).keys()]);
    chIndex = 0;
    chScore = 0;
    chAnswered = false;
  }
  itemSelect.selected('');
  updateControls();
}

function nextChallenge() {
  if (!challenge || !chAnswered) return;
  chIndex++;
  chAnswered = false;
  answer = null;
  updateControls();
}

function updateControls() {
  challengeButton.html(challenge ? 'Back to explore' : 'Challenge');
  if (challenge) { itemSelect.attribute('disabled', ''); } else { itemSelect.removeAttribute('disabled'); }
  if (challenge && chAnswered && chIndex < CHALLENGE.length) nextButton.removeAttribute('disabled');
  else nextButton.attribute('disabled', '');
  nextButton.html(chIndex >= CHALLENGE.length - 1 ? 'See score' : 'Next event');
  if (challenge) nextButton.show(); else nextButton.hide();
  layoutControls();
}

// ---------- Layout ----------
function narrow() { return canvasWidth < 600; }

function layoutControls() {
  const rowH = 36;
  let x = 10, row = 0;
  const pos = [];
  // take every control out of the normal flow first, so a block-level checkbox div
  // reports its own width rather than the container's
  for (const el of controlItems) if (el.elt.style.position !== 'absolute') el.position(0, drawHeight);
  for (const el of controlItems) {
    if (el.elt.style.display === 'none') { pos.push(null); continue; }
    const w = el.elt.offsetWidth || 100;
    if (x > 10 && x + w > canvasWidth - 10) { row++; x = 10; }
    pos.push([x, row]);
    x += w + 10;
  }
  controlHeight = (row + 1) * rowH + 14;
  drawHeight = canvasHeight - controlHeight;
  for (let i = 0; i < controlItems.length; i++) {
    if (pos[i]) controlItems[i].position(pos[i][0], drawHeight + 10 + pos[i][1] * rowH + (controlItems[i] === compactBox ? 4 : 0));
  }
}

function geometry() {
  const g = {};
  const W = canvasWidth - 2 * margin;
  if (narrow()) {
    g.mock = { x: margin, y: 38, w: W, h: 176 };
    g.list = { x: margin, y: 222, w: W, h: 7 * 18 + 28 };
    g.binY = g.list.y + g.list.h + 8;
    g.binH = 2 * 30 + 4;
  } else {
    const mw = floor(W * 0.52);
    g.mock = { x: margin, y: 42, w: mw, h: 252 };
    g.list = { x: margin + mw + 10, y: 42, w: W - mw - 10, h: 252 };
    g.binY = 304;
    g.binH = 58;
  }
  g.info = { x: margin, y: g.binY + g.binH + 8, w: W };
  g.info.h = drawHeight - 8 - g.info.y;
  return g;
}

// ---------- Drawing ----------
function draw() {
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const g = geometry();
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(narrow() ? 19 : 22);
  text('Evidence Class Sorter', margin, 9);
  textStyle(NORMAL);
  textSize(narrow() ? 13 : 15);
  textAlign(RIGHT, TOP);
  fill('dimgray');
  const n = Object.keys(exploreDone).length;
  const status = challenge
    ? (narrow() ? chScore + ' of ' + CHALLENGE.length : 'Challenge: ' + chScore + ' of ' + CHALLENGE.length + ' correct')
    : (narrow() ? n + ' of ' + ITEMS.length : 'Classified: ' + n + ' of ' + ITEMS.length) + (compactBox.checked() ? '  |  Compact' : '  |  Full');
  text(status, canvasWidth - margin, narrow() ? 14 : 14);
  textAlign(LEFT, TOP);

  if (challenge) drawChallengeCard(g.mock); else drawMock(g.mock);
  drawDecisionList(g.list);
  drawBins(g);
  drawInfo(g.info);
  drawBinTooltip();
}

function drawMock(r) {
  mockRects = [];
  stroke('silver');
  fill('white');
  rect(r.x, r.y, r.w, r.h, 8);
  const hoverId = mockHit(mouseX, mouseY);
  const on = id => (selected && selected.id === id) || hoverId === id;
  const mark = (id, x, y, w, h) => {
    mockRects.push({ id, x, y, w, h });
    if (selected && selected.id === id) { noFill(); stroke('gold'); strokeWeight(4); rect(x - 3, y - 3, w + 6, h + 6, 6); strokeWeight(1); }
    else if (hoverId === id) { noFill(); stroke('steelblue'); strokeWeight(2); rect(x - 2, y - 2, w + 4, h + 4, 5); strokeWeight(1); }
    if (exploreDone[id]) { noStroke(); fill(RIGHT_TEXT); circle(x + w, y, 14); fill('white'); textSize(10); textAlign(CENTER, CENTER); text('✓', x + w, y); textAlign(LEFT, TOP); }
  };

  // tab bar (focus loss)
  const tbY = r.y + 4;
  noStroke();
  fill('gainsboro');
  rect(r.x + 4, tbY, r.w - 8, 22, 5, 5, 0, 0);
  fill('white');
  rect(r.x + 8, tbY + 3, 104, 19, 4, 4, 0, 0);
  fill('black');
  textSize(12);
  textAlign(LEFT, CENTER);
  text('Chapter 16', r.x + 16, tbY + 12);
  const otx = r.x + 118;
  fill(on('tab') ? 'lightyellow' : 'whitesmoke');
  rect(otx, tbY + 3, 96, 19, 4, 4, 0, 0);
  fill('dimgray');
  text('Another tab', otx + 8, tbY + 12);
  mark('tab', otx, tbY + 3, 96, 19);

  const top = r.y + 32;
  const colL = r.w * 0.55;
  // gravity slider
  const sx = r.x + 10, sw = colL - 24;
  noStroke();
  fill('black');
  textSize(12);
  textAlign(LEFT, TOP);
  text('Gravity: 9.8 m/s²', sx, top);
  stroke('gray');
  strokeWeight(3);
  line(sx, top + 22, sx + sw, top + 22);
  strokeWeight(1);
  noStroke();
  fill('steelblue');
  circle(sx + sw * 0.6, top + 22, 12);
  mark('slider', sx - 2, top - 2, sw + 4, 30);
  // Start/Pause and Reset buttons
  const by = top + 36;
  const bw1 = min(92, (sw - 8) * 0.55), bw2 = min(60, sw - bw1 - 8);
  stroke('gray');
  fill('whitesmoke');
  rect(sx, by, bw1, 22, 4);
  rect(sx + bw1 + 8, by, bw2, 22, 4);
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  text('Start/Pause', sx + bw1 / 2, by + 11);
  text('Reset', sx + bw1 + 8 + bw2 / 2, by + 11);
  mark('startpause', sx, by, bw1, 22);
  mark('reset', sx + bw1 + 8, by, bw2, 22);
  // ball box
  const bx = sx, byy = by + 32, bbw = sw, bbh = r.y + r.h - 10 - byy;
  stroke('lightsteelblue');
  fill('aliceblue');
  rect(bx, byy, bbw, bbh, 4);
  // program-driven animation: the ball moves by itself every frame
  ballVY += 0.004;
  ballX += ballVX; ballY += ballVY;
  if (ballX < 0.05 || ballX > 0.95) ballVX = -ballVX;
  if (ballY > 0.85) { ballY = 0.85; ballVY = -abs(ballVY) * 0.95; if (abs(ballVY) < 0.03) ballVY = -0.06; }
  noStroke();
  fill('tomato');
  circle(bx + ballX * bbw, byy + ballY * bbh, 12);
  mark('ball', bx, byy, bbw, bbh);

  // right column: three-node diagram
  const rx = r.x + colL, rw = r.w - colL - 10;
  const cx = rx + rw / 2;
  const d = min(rw / 3, 46);
  const nodes = [[cx, top + 10, 'Velocity'], [cx - d, top + 50, 'Gravity'], [cx + d, top + 50, 'Height']];
  stroke('gray');
  line(nodes[1][0], nodes[1][1], nodes[0][0], nodes[0][1]);
  line(nodes[0][0], nodes[0][1], nodes[2][0], nodes[2][1]);
  for (const n of nodes) {
    stroke('navy');
    fill('lightsteelblue');
    circle(n[0], n[1], 20);
    noStroke();
    fill('black');
    textSize(11);
    textAlign(CENTER, TOP);
    text(n[2], n[0], n[1] + 11);
  }
  mark('node', cx - d - 26, top - 2, 2 * d + 52, 78);
  // checked prediction (sits at the bottom of the column when the panel is tall)
  const py = max(top + 86, r.y + r.h - 56);
  noStroke();
  fill('black');
  textSize(11);
  textAlign(LEFT, TOP);
  text('Less gravity: the bounce is', rx + 4, py);
  const opts = ['higher', 'lower', 'same'];
  const ow = (rw - 8 - 44) / 3;
  for (let i = 0; i < 3; i++) {
    stroke('gray');
    fill('white');
    rect(rx + 4 + i * (ow + 2), py + 18, ow, 18, 3);
    noStroke();
    fill('black');
    textAlign(CENTER, CENTER);
    text(opts[i], rx + 4 + i * (ow + 2) + ow / 2, py + 27);
  }
  const ckx = rx + 4 + 3 * (ow + 2) + 2;
  stroke('gray');
  fill('whitesmoke');
  rect(ckx, py + 18, 40, 18, 3);
  noStroke();
  fill('black');
  text('Check', ckx + 20, py + 27);
  mark('check', rx + 2, py - 2, rw - 2, 42);
  textAlign(LEFT, TOP);
}

function mockHit(mx, my) {
  if (challenge) return null;
  // test small targets first (buttons inside the ball box area never overlap, but order matters)
  for (const m of mockRects) {
    if (mx >= m.x && mx <= m.x + m.w && my >= m.y && my <= m.y + m.h) return m.id;
  }
  return null;
}

function drawChallengeCard(r) {
  mockRects = [];
  stroke('slategray');
  fill('lightyellow');
  rect(r.x, r.y, r.w, r.h, 8);
  noStroke();
  fill('dimgray');
  textSize(13);
  textAlign(LEFT, TOP);
  if (chIndex >= CHALLENGE.length) {
    fill('black');
    textSize(narrow() ? 16 : 18);
    textStyle(BOLD);
    text('Challenge complete', r.x + 14, r.y + 14);
    textStyle(NORMAL);
    textSize(narrow() ? 14 : 16);
    drawWrapped('You classified ' + chScore + ' of ' + CHALLENGE.length + ' events correctly. Press Back to explore, ' +
      'then Challenge again for a new order.', r.x + 14, r.y + 46, r.w - 28, 21);
    return;
  }
  text('Challenge event ' + (chIndex + 1) + ' of ' + CHALLENGE.length + ': which class?', r.x + 14, r.y + 12);
  fill('black');
  textSize(narrow() ? 16 : 18);
  drawWrapped(CHALLENGE[chOrder[chIndex]].text, r.x + 14, r.y + 38, r.w - 28, narrow() ? 21 : 24);
  fill('dimgray');
  textSize(12);
  drawWrapped(chAnswered ? 'Read the feedback below, then press Next event.' : 'Click a bin, or choose it in the Bin list and press Assign (keys 1-7 also work).',
    r.x + 14, r.y + r.h - 36, r.w - 28, 15);
}

function drawDecisionList(r) {
  stroke('silver');
  fill('white');
  rect(r.x, r.y, r.w, r.h, 8);
  noStroke();
  fill('black');
  textStyle(BOLD);
  textSize(13);
  textAlign(LEFT, TOP);
  text('Decision list: ask in order, stop at the first yes', r.x + 8, r.y + 6);
  textStyle(NORMAL);
  const decide = answer ? answer.item.q : -1;
  const two = !narrow() && r.h >= 240;          // roomy layout: the class goes on its own line
  const lh = narrow() ? 18 : (two ? 31 : 22);
  let y = r.y + (narrow() ? 26 : 30);
  QUESTIONS.forEach((q, i) => {
    if (decide === i + 1) { noStroke(); fill(255, 215, 0, 140); rect(r.x + 4, y - 2, r.w - 8, lh - 1, 4); }
    noStroke();
    textSize(two ? 14 : (narrow() ? 12 : 12.5));
    fill('slategray');
    textStyle(BOLD);
    text((i + 1) + '.', r.x + 8, y + 1);
    textStyle(NORMAL);
    fill('black');
    const qt = q.short;
    text(qt, r.x + 26, y + 1);
    const qw = textWidth(qt + ' ');
    fill('darkslateblue');
    const tail = '→ ' + q.to;
    if (two) { textSize(12); text(tail, r.x + 26, y + 16); }
    else if (r.x + 26 + qw + textWidth(tail) < r.x + r.w - 4) text(tail, r.x + 26 + qw, y + 1);
    y += lh;
  });
}

function drawBins(g) {
  binRects = [];
  hoverBin = -1;
  const x0 = margin, W = canvasWidth - 2 * margin;
  for (let i = 0; i < BINS.length; i++) {
    let bx, by, bw, bh;
    if (narrow()) {
      const perRow = i < 4 ? 4 : 3;
      const idx = i < 4 ? i : i - 4;
      bw = (W - (perRow - 1) * 4) / perRow; bh = 30;
      bx = x0 + idx * (bw + 4); by = g.binY + (i < 4 ? 0 : 34);
    } else {
      bw = (W - 6 * 5) / 7; bh = g.binH;
      bx = x0 + i * (bw + 5); by = g.binY;
    }
    binRects.push({ x: bx, y: by, w: bw, h: bh });
    const b = BINS[i];
    const over = mouseX >= bx && mouseX <= bx + bw && mouseY >= by && mouseY <= by + bh;
    if (over) hoverBin = i;
    const isChoice = answer && answer.bin === b.id;
    const isRight = answer && answer.item.bin === b.id;
    stroke(isRight ? 'black' : (isChoice ? WRONG_TEXT : b.color));
    strokeWeight(isRight || isChoice ? 4 : (over ? 3 : 1.5));
    if (isChoice && !isRight) drawingContext.setLineDash([6, 4]);
    fill(over ? 'lightyellow' : 'white');
    rect(bx, by, bw, bh, 6);
    strokeWeight(1);
    noStroke();
    drawingContext.setLineDash([]);
    fill(b.color);
    rect(bx + 4, by + 4, 18, 18, 4);
    fill(b.ink);
    textSize(12);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(b.num, bx + 13, by + 13);
    fill('black');
    textSize(narrow() ? 11 : 12.5);
    textAlign(LEFT, TOP);
    const lines = wrapWords(b.label, bw - 30);
    if (narrow() || lines.length === 1) {
      textAlign(LEFT, CENTER);
      text(fitWords(b.label, bw - 28), bx + 26, by + 13);
    } else {
      text(lines[0], bx + 26, by + 6);
      text(lines.slice(1).join(' '), bx + 6, by + 24);
    }
    textStyle(NORMAL);
    if (!narrow() && isRight) { fill(RIGHT_TEXT); textSize(11); textAlign(LEFT, BOTTOM); text('✓ correct class', bx + 6, by + bh - 3); }
    else if (!narrow() && isChoice) { fill(WRONG_TEXT); textSize(11); textAlign(LEFT, BOTTOM); text('✗ your choice', bx + 6, by + bh - 3); }
    else if (narrow() && (isRight || isChoice)) {
      stroke(isRight ? RIGHT_TEXT : WRONG_TEXT); fill('white'); circle(bx + bw - 3, by + 3, 15); noStroke();
      fill(isRight ? RIGHT_TEXT : WRONG_TEXT); textSize(11); textAlign(CENTER, CENTER); text(isRight ? '✓' : '✗', bx + bw - 3, by + 3);
    }
  }
  textAlign(LEFT, TOP);
}

function drawBinTooltip() {
  if (hoverBin < 0) return;
  const b = BINS[hoverBin];
  const r = binRects[hoverBin];
  textSize(13);
  const w = min(320, canvasWidth - 2 * margin);
  const lines = wrapWords(b.label + ': ' + b.def, w - 16);
  const h = lines.length * 17 + 12;
  let x = constrain(r.x + r.w / 2 - w / 2, margin, canvasWidth - margin - w);
  let y = r.y - h - 6;
  stroke('dimgray');
  fill(255, 255, 240, 245);
  rect(x, y, w, h, 6);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  lines.forEach((l, i) => text(l, x + 8, y + 6 + i * 17));
}

function drawInfo(r) {
  stroke('silver');
  fill(255, 255, 255, 240);
  rect(r.x, r.y, r.w, r.h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  const tx = r.x + 12, tw = r.w - 24;
  const lh = narrow() ? 15 : (canvasWidth >= 760 ? 21 : 19);
  const fs = narrow() ? 12.5 : (canvasWidth >= 760 ? 16 : 15);
  let y = r.y + 10;
  const compact = compactBox.checked();
  if (!answer) {
    fill('black');
    textSize(fs + 1);
    textStyle(BOLD);
    const head = challenge
      ? (chIndex >= CHALLENGE.length ? 'Challenge complete' : 'Classify the event above')
      : (selected ? 'Selected: ' + selected.name : 'Select an element of the mock MicroSim');
    y = drawWrapped(head, tx, y, tw, lh + 1) + 4;
    textStyle(NORMAL);
    textSize(fs);
    const body = challenge
      ? 'Pick the evidence class for the described event. Hover a bin to read its definition.'
      : (selected
        ? 'Which evidence class is it? Walk the decision list from question 1 and stop at the first yes, then click that bin (or use the Bin list and Assign, or keys 1-7). Hover a bin to read its definition.'
        : 'Click the slider, a button, the ball, the diagram, the prediction or the "Another tab" tab, or choose it in the Item list. Then pick the bin for its evidence class.');
    y = drawWrapped(body, tx, y, tw, lh) + 6;
    fill('dimgray');
    textSize(fs - 1);
    y = drawWrapped('Mode: ' + (compact ? 'Compact (exposure evidence folds into one session summary)' : 'Full (one statement per interaction)') + '. Toggle it with the Compact mode checkbox.', tx, y, tw, lh - 1) + 10;
    const worked = 'Worked example from Chapter 16: dragging the slider through five steps, pressing Start and Pause, ' +
      'and leaving the tab produces eight Full-mode statements (five slider, two press, one run), or in Compact mode a ' +
      'single summary recording statements_represented: 8. Answers are never folded.';
    if (y + 4 * lh < r.y + r.h) {
      fill('black');
      textSize(fs - 1);
      drawWrapped(worked, tx, y, tw, lh - 1);
    }
    return;
  }
  const it = answer.item;
  const right = BINS.find(b => b.id === it.bin);
  const chosen = BINS.find(b => b.id === answer.bin);
  textSize(fs + 1);
  textStyle(BOLD);
  fill(answer.correct ? RIGHT_TEXT : WRONG_TEXT);
  const who = it.name || ('"' + it.text + '"');
  y = drawWrapped(answer.correct
    ? 'Correct: ' + right.label + (it.id === 'reset' ? ' (discrete press, class 3a)' : '')
    : 'Not quite: you chose ' + chosen.label + '; the class is ' + right.label + (it.id === 'reset' ? ' (class 3a)' : ''), tx, y, tw, lh + 1) + 2;
  textStyle(NORMAL);
  textSize(fs - 1);
  fill('dimgray');
  y = drawWrapped(it.name ? 'Item: ' + it.name : 'Event: ' + it.text, tx, y, tw, lh - 1) + 4;
  fill('black');
  textSize(fs);
  const q = it.q ? QUESTIONS[it.q - 1] : null;
  y = labelled('Deciding question', q ? 'Question ' + it.q + ': ' + q.long
    : 'None of the seven: focus loss is handled by the runtime itself, which closes the open interval.', tx, y, tw, lh);
  if (it.note) y = labelled('Why', it.note, tx, y, tw, lh);
  const fullTxt = it.full || right.full;
  const compTxt = it.compact || right.compact;
  if (compact) y = labelled('Compact mode keeps', compTxt + (it.bin === 'assessment' ? '' : '.'), tx, y, tw, lh);
  else y = labelled('Full mode emits', fullTxt + '.', tx, y, tw, lh);
  if (y + lh < r.y + r.h && it.bin === 'assessment') {
    fill(RIGHT_TEXT);
    drawWrapped(compact ? 'Toggle Compact off: the answered statement is the same in Full mode.' : 'Toggle Compact on: an assessment is the one class the fold leaves unchanged.', tx, y + 2, tw, lh);
  } else if (y + lh < r.y + r.h) {
    fill('dimgray');
    textSize(fs - 1);
    drawWrapped(compact ? 'Uncheck Compact mode to see the Full-mode statement.' : 'Check Compact mode to see what the fold keeps for this item.', tx, y + 2, tw, lh - 1);
  }
}

function labelled(label, body, x, y, w, lh) {
  textStyle(BOLD);
  fill('black');
  text(label + ':', x, y);
  const lw = textWidth(label + ': ');
  textStyle(NORMAL);
  if (lw > w * 0.45) return drawWrapped(body, x, y + lh, w, lh) + 4;
  return drawWrapped(body, x + lw, y, w - lw, lh) + 4;
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

function fitWords(s, w) {
  if (textWidth(s) <= w) return s;
  const short = { 'Continuous parameter': 'Continuous', 'Discrete inspection': 'Inspection', 'Run and pause': 'Run/pause' };
  return short[s] || s;
}

// ---------- Mouse and keyboard ----------
function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight) return;
  for (let i = 0; i < binRects.length; i++) {
    const r = binRects[i];
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) { chooseBin(i); return; }
  }
  const id = mockHit(mouseX, mouseY);
  if (id) selectItem(id);
}

function keyPressed() {
  if (document.activeElement && document.activeElement.tagName === 'SELECT') return;
  if (key >= '1' && key <= '7') chooseBin(int(key) - 1);
  else if (key === 'n' || key === 'N') nextChallenge();
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
