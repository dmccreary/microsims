// Three Verb Classifier - sort learner events into answered, experienced, interacted or no statement
// CANVAS_HEIGHT: 700
// Learning objective (Apply / classify): the learner classifies learner actions in a described
// MicroSim into the correct verb, object type and required result field, and explains any action
// that needs no statement (Chapter 16, "The Three MicroSim Verbs").
// Twelve scripted events about a mock Bouncing Ball MicroSim are shuffled each round. Drag the
// event card into a bin, or press a bin button (or keys 1-4). The infobox then gives the correct
// verb, object type, required result field and the chapter's reasoning; "Show statement" renders
// the statement's verb, object and result as JSON (xAPI 1.0.3 shape, actor/context omitted).

// ---------- Canvas dimensions ----------
// The canvas height is fixed. The control rows wrap on narrow screens, so the split between the
// drawing region and the control region is recomputed on every resize (sum stays 700).
let canvasWidth = 800;
let canvasHeight = 700;
let controlHeight = 50;                        // recomputed by layoutControls()
let drawHeight = canvasHeight - controlHeight; // recomputed by layoutControls()
let margin = 12;
let defaultTextSize = 16;

// ---------- xAPI vocabulary used in the rendered statements ----------
const PAGE_IRI = 'https://dmccreary.github.io/microsims/sims/bouncing-ball/';
const VERB_IRI = {
  answered: 'http://adlnet.gov/expapi/verbs/answered',
  experienced: 'http://adlnet.gov/expapi/verbs/experienced',
  interacted: 'http://adlnet.gov/expapi/verbs/interacted'
};
const TYPE_IRI = {
  Page: 'http://adlnet.gov/expapi/activities/lesson',
  MicroSim: 'http://adlnet.gov/expapi/activities/simulation',
  Question: 'http://adlnet.gov/expapi/activities/cmi.interaction',
  Control: 'http://adlnet.gov/expapi/activities/interaction'
};
const EXT = 'https://w3id.org/lrs/ext/';

// ---------- Colors: Okabe-Ito color-blind-safe palette (RGB) ----------
const CB_GREEN = [0, 158, 115], CB_BLUE = [0, 114, 178], CB_ORANGE = [230, 159, 0];
const CB_VERMILLION = [213, 94, 0], CB_GRAY = [105, 105, 105];
const RIGHT_TEXT = [0, 115, 85], WRONG_TEXT = [185, 70, 0];   // darker shades for text

// ---------- Bins ----------
const BINS = [
  { id: 'answered', label: 'answered', sub: 'a checked attempt', color: CB_GREEN, ink: 'white' },
  { id: 'experienced', label: 'experienced', sub: 'time spent in a run', color: CB_BLUE, ink: 'white' },
  { id: 'interacted', label: 'interacted', sub: 'a control touched', color: CB_ORANGE, ink: 'black' },
  { id: 'none', label: 'no statement', sub: 'not evidence', color: CB_GRAY, ink: 'white' }
];

// ---------- The twelve scripted events ----------
// target: which part of the mock MicroSim the event is about (highlighted in the scene)
// verb: correct bin; type: object type; frag: IRI fragment ('' = the page itself)
const EVENTS = [
  { text: 'picks option B ("the same") on the checked prediction and presses Check. It is wrong.',
    target: 'question', verb: 'answered', type: 'Question', frag: '#q1', name: 'Bounce Height Prediction',
    field: 'success (here false)',
    result: { success: false, response: 'B' },
    why: 'Every deliberate attempt at a checked item is emitted, wrong ones included, and answered is the only verb that can carry success.' },
  { text: 'picks option C ("lower") on the checked prediction and presses Check. It is correct.',
    target: 'question', verb: 'answered', type: 'Question', frag: '#q1', name: 'Bounce Height Prediction',
    field: 'success (here true)',
    result: { success: true, response: 'C' },
    why: 'The MicroSim checks the response against a right answer, so it is answered with success true, the only kind of statement that adds an attempt to a mastery estimate.' },
  { text: 'picks option A ("higher") after an earlier wrong B, and presses Check. It is also wrong.',
    target: 'question', verb: 'answered', type: 'Question', frag: '#q1', name: 'Bounce Height Prediction',
    field: 'success (here false)',
    result: { success: false, response: 'A' },
    why: 'A different choice is a new deliberate attempt, so it is emitted even though it is wrong; only a repeat of the same choice is skipped.' },
  { text: 'presses Start, waits 40 seconds, then presses Pause.',
    target: 'startpause', verb: 'experienced', type: 'MicroSim', frag: '', name: 'Bouncing Ball',
    field: 'duration (here PT40S)',
    result: { duration: 'PT40S', extensions: { 'run-ended-by': 'paused' } },
    why: 'One Start and Pause pair produces exactly one experienced statement, emitted on Pause with the elapsed time; the object is the page itself, with no fragment. (Each press may also be recorded as an interacted press.)' },
  { text: 'presses Start, then presses Pause 2 seconds later.',
    target: 'startpause', verb: 'experienced', type: 'MicroSim', frag: '', name: 'Bouncing Ball',
    field: 'duration (here PT2S)',
    result: { duration: 'PT2S', extensions: { 'run-ended-by': 'paused' } },
    why: 'The run is longer than the 250 ms misclick threshold, so it is real time spent: one experienced statement carrying its duration.' },
  { text: 'presses Start, then switches to another browser tab 30 seconds later without pressing Pause.',
    target: 'startpause', verb: 'experienced', type: 'MicroSim', frag: '', name: 'Bouncing Ball',
    field: 'duration (here PT30S)',
    result: { duration: 'PT30S', extensions: { 'run-ended-by': 'tab-hidden' } },
    why: 'Focus loss closes the open run: the runtime emits the experienced statement itself when the tab is hidden, and never a synthetic Pause press.' },
  { text: 'moves the Speed slider from 3 to 4.',
    target: 'slider', verb: 'interacted', type: 'Control', frag: '#speed-slider', name: 'Speed Slider',
    field: 'none (the values go in result extensions)',
    result: { extensions: { value: 4, 'previous-value': 3 } },
    why: 'A slider movement is neither an answer (it has no success) nor an interval (it has no duration), so it is interacted, with the old and new values in result extensions.' },
  { text: 'rests the pointer on the Velocity node for 900 milliseconds to read it.',
    target: 'velocity', verb: 'interacted', type: 'Control', frag: '#velocity', name: 'Velocity Node',
    field: 'none (mode and duration are carried)',
    result: { duration: 'PT0.9S', extensions: { 'engagement-mode': 'hover' } },
    why: 'A hover of at least 600 ms is discrete inspection: an interacted statement with engagement mode hover and the hover duration.' },
  { text: 'clicks the Gravity node to pin its explanation open.',
    target: 'gravity', verb: 'interacted', type: 'Control', frag: '#gravity', name: 'Gravity Node',
    field: 'none (the engagement mode is carried)',
    result: { extensions: { 'engagement-mode': 'pinned' } },
    why: 'Pinning a node is a deliberate inspection of one identifiable thing, so it is interacted; the fragment is the node\'s stable key, not its position.' },
  { text: 'presses Start and then presses Pause 100 milliseconds later.',
    target: 'startpause', verb: 'none', type: 'MicroSim', frag: '', name: 'Bouncing Ball',
    field: 'none: nothing is emitted for the run',
    why: 'A run under the 250 ms misclick threshold is an accidental press, so no experienced statement is emitted and no zero-length row pollutes the dwell total. The two presses themselves may still be recorded.' },
  { text: 'clicks the same wrong option B and presses Check a second time.',
    target: 'question', verb: 'none', type: 'Question', frag: '#q1', name: 'Bounce Height Prediction',
    field: 'none: it is not a new attempt',
    why: 'Checking the same choice twice is not a new attempt, so it must not add a second answered statement: do not report evidence the interaction does not support.' },
  { text: 'sweeps the pointer across all three nodes in under half a second on the way to the Check button.',
    target: 'nodes', verb: 'none', type: 'Control', frag: '', name: '',
    field: 'none: the hovers are below threshold',
    why: 'Each hover lasts well under the 600 ms hover threshold, so the pointer was crossing the diagram, not attending to it: sweeping nodes quickly must emit zero statements.' }
];

// ---------- State ----------
let order = [];            // shuffled event indexes for this round
let current = 0;           // position in order
let placements = [];       // {ev, bin, correct, n}
let state = 'await';       // 'await' | 'placed' | 'done'
let reviewItem = null;     // the placement shown in the infobox
let showJson = false;
let score = 0;

// drag
let dragging = false;
let dragDX = 0, dragDY = 0;
let cardX = 0, cardY = 0;  // current card top-left while dragging
let cardRect = { x: 0, y: 0, w: 0, h: 0 };
let binRects = [];
let chipRects = [];

// controls
let binButtons = [];
let showButton, nextButton, againButton;
let controlItems = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('sans-serif');

  for (let i = 0; i < BINS.length; i++) {
    const b = createButton((i + 1) + ' ' + BINS[i].label);
    b.parent(document.querySelector('main'));
    b.mousePressed(() => assign(BINS[i].id));
    binButtons.push(b);
  }
  showButton = createButton('Show statement');
  showButton.parent(document.querySelector('main'));
  showButton.mousePressed(toggleJson);
  nextButton = createButton('Next event');
  nextButton.parent(document.querySelector('main'));
  nextButton.mousePressed(nextEvent);
  againButton = createButton('Try again');
  againButton.parent(document.querySelector('main'));
  againButton.mousePressed(newRound);
  controlItems = binButtons.concat([showButton, nextButton, againButton]);

  newRound();
  layoutControls();

  describe('Three Verb Classifier. A mock Bouncing Ball MicroSim with a speed slider, a Start/Pause ' +
    'button, three diagram nodes and a one-question check sits above an event card. Classify each of ' +
    'twelve learner events as answered, experienced, interacted or no statement by dragging the card ' +
    'into a bin or pressing the bin buttons or keys 1 to 4. Feedback gives the correct verb, object ' +
    'type, required result field and a reason, and Show statement renders the statement as JSON.');
}

function newRound() {
  order = shuffle([...Array(EVENTS.length).keys()]);
  current = 0;
  placements = [];
  score = 0;
  state = 'await';
  reviewItem = null;
  showJson = false;
  dragging = false;
  updateButtons();
}

function currentEvent() {
  return state === 'await' ? EVENTS[order[current]] : null;
}

function assign(binId) {
  if (state !== 'await') return;
  const ev = EVENTS[order[current]];
  const ok = ev.verb === binId;
  if (ok) score++;
  const item = { ev: ev, bin: binId, correct: ok, n: current + 1 };
  placements.push(item);
  reviewItem = item;
  state = 'placed';
  showJson = false;
  dragging = false;
  updateButtons();
}

function nextEvent() {
  if (state !== 'placed') return;
  current++;
  showJson = false;
  reviewItem = null;
  state = current >= EVENTS.length ? 'done' : 'await';
  updateButtons();
}

function toggleJson() {
  if (!reviewItem) return;
  showJson = !showJson;
  updateButtons();
}

function updateButtons() {
  const awaiting = state === 'await';
  for (const b of binButtons) {
    if (awaiting) b.removeAttribute('disabled'); else b.attribute('disabled', '');
  }
  if (reviewItem) showButton.removeAttribute('disabled'); else showButton.attribute('disabled', '');
  showButton.html(showJson ? 'Hide statement' : 'Show statement');
  if (state === 'placed') nextButton.removeAttribute('disabled'); else nextButton.attribute('disabled', '');
  nextButton.html(current >= EVENTS.length - 1 && state === 'placed' ? 'Finish' : 'Next event');
  if (controlItems.length) layoutControls();
}

// ---------- Layout ----------
function layoutControls() {
  // Flow the buttons left to right, wrapping to a new row when the canvas is too narrow.
  const rowH = 36;
  let x = 10, row = 0;
  const pos = [];
  for (const el of controlItems) {
    const w = el.elt.offsetWidth || 90;
    if (x > 10 && x + w > canvasWidth - 10) { row++; x = 10; }
    pos.push([x, row]);
    x += w + 8;
  }
  controlHeight = (row + 1) * rowH + 14;
  drawHeight = canvasHeight - controlHeight;
  for (let i = 0; i < controlItems.length; i++) {
    controlItems[i].position(pos[i][0], drawHeight + 10 + pos[i][1] * rowH);
  }
}

function narrow() { return canvasWidth < 500; }

function geometry() {
  const g = {};
  g.sceneY = 42; g.sceneH = 104;
  g.cardY = g.sceneY + g.sceneH + 10; g.cardH = 74;
  g.binY = g.cardY + g.cardH + 10;
  g.binH = narrow() ? 4 * 28 + 3 * 5 : 100;
  g.infoY = g.binY + g.binH + 10;
  g.infoH = drawHeight - 8 - g.infoY;
  return g;
}

// ---------- Drawing ----------
function draw() {
  // regions
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const g = geometry();

  // title and score
  noStroke();
  fill('black');
  textStyle(BOLD);
  textSize(narrow() ? 19 : 22);
  textAlign(LEFT, TOP);
  text('Three Verb Classifier', margin, 10);
  textStyle(NORMAL);
  textSize(16);
  textAlign(RIGHT, TOP);
  text('Score: ' + score + ' of ' + EVENTS.length, canvasWidth - margin, 13);

  drawScene(g);
  drawCardZone(g);
  if (showJson && reviewItem) {
    drawJson(g);
  } else {
    drawBins(g);
    drawInfo(g);
  }
  if (dragging) drawCard(cardX, cardY, cardRect.w, cardRect.h, EVENTS[order[current]], true);
}

// The mock MicroSim: slider, Start/Pause, three nodes, one-question check
function drawScene(g) {
  const x0 = margin, w = canvasWidth - 2 * margin, y0 = g.sceneY, h = g.sceneH;
  stroke('silver');
  fill('white');
  rect(x0, y0, w, h, 8);
  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(LEFT, TOP);
  text('Mock MicroSim: Bouncing Ball', x0 + 8, y0 + 5);

  const ev = reviewItem ? reviewItem.ev : currentEvent();
  const target = ev ? ev.target : '';
  const colW = w / 3;
  const cy = y0 + 22;

  // column 1: speed slider and Start/Pause button
  const c1 = x0 + 10;
  const sw = colW - 24;
  if (target === 'slider') glow(c1 - 4, cy, sw + 8, 36);
  noStroke();
  fill('black');
  textSize(13);
  textAlign(LEFT, TOP);
  text('Speed: 3', c1, cy + 2);
  stroke('gray');
  strokeWeight(3);
  line(c1, cy + 26, c1 + sw, cy + 26);
  strokeWeight(1);
  fill('steelblue');
  noStroke();
  circle(c1 + sw * 0.3, cy + 26, 12);
  const bw = min(sw, 110);
  if (target === 'startpause') glow(c1 - 4, cy + 42, bw + 8, 32);
  stroke('gray');
  fill('whitesmoke');
  rect(c1, cy + 46, bw, 24, 4);
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  text('Start / Pause', c1 + bw / 2, cy + 58);

  // column 2: three-node diagram
  const cx = x0 + colW * 1.5;
  const d = min(colW / 3, 48);
  const nodes = {
    velocity: [cx, cy + 14, 'Velocity'],
    gravity: [cx - d, cy + 52, 'Gravity'],
    bounce: [cx + d, cy + 52, 'Bounce']
  };
  if (target === 'nodes') glow(cx - d - 30, cy - 4, 2 * d + 60, 80);
  stroke('gray');
  strokeWeight(1.5);
  line(nodes.gravity[0], nodes.gravity[1], nodes.velocity[0], nodes.velocity[1]);
  line(nodes.velocity[0], nodes.velocity[1], nodes.bounce[0], nodes.bounce[1]);
  strokeWeight(1);
  for (const k in nodes) {
    const nd = nodes[k];
    if (target === k) { noStroke(); fill('gold'); circle(nd[0], nd[1], 34); }
    stroke('navy');
    fill('lightsteelblue');
    circle(nd[0], nd[1], 22);
    noStroke();
    fill('black');
    textSize(12);
    textAlign(CENTER, k === 'velocity' ? CENTER : TOP);
    if (k === 'velocity') {
      textAlign(LEFT, CENTER);
      text(nd[2], nd[0] + 14, nd[1]);
    } else {
      text(nd[2], nd[0], nd[1] + 12);
    }
  }

  // column 3: one-question check
  const q0 = x0 + colW * 2 + 6;
  const qw = colW - 14;
  if (target === 'question') glow(q0 - 4, cy - 4, qw + 8, h - 22);
  noStroke();
  fill('black');
  textSize(12);
  textAlign(LEFT, TOP);
  text(qw > 150 ? 'Predict: after a bounce the ball rises' : 'After a bounce, it rises', q0, cy);
  const opts = qw > 150 ? ['A higher', 'B the same', 'C lower'] : ['A higher', 'B same', 'C lower'];
  const ow = min(qw - 52, 110);
  for (let i = 0; i < 3; i++) {
    const oy = cy + 18 + i * 19;
    stroke('gray');
    fill('white');
    rect(q0, oy, ow, 16, 3);
    noStroke();
    fill('black');
    textAlign(LEFT, CENTER);
    text(opts[i], q0 + 5, oy + 8);
  }
  stroke('gray');
  fill('whitesmoke');
  rect(q0 + ow + 6, cy + 37, 42, 18, 3);
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  text('Check', q0 + ow + 27, cy + 46);
}

function glow(x, y, w, h) {
  noStroke();
  fill(255, 215, 0, 110);
  rect(x, y, w, h, 6);
}

function drawCardZone(g) {
  const w = min(canvasWidth - 2 * margin, 620);
  const x = (canvasWidth - w) / 2;
  cardRect = { x: x, y: g.cardY, w: w, h: g.cardH };
  if (state === 'await') {
    if (!dragging) drawCard(x, g.cardY, w, g.cardH, EVENTS[order[current]], false);
    else {
      noFill();
      stroke('silver');
      drawingContext.setLineDash([5, 5]);
      rect(x, g.cardY, w, g.cardH, 8);
      drawingContext.setLineDash([]);
    }
  } else if (state === 'placed') {
    stroke('silver');
    fill('white');
    rect(x, g.cardY, w, g.cardH, 8);
    noStroke();
    fill('black');
    textSize(15);
    textAlign(LEFT, TOP);
    const msg = current >= EVENTS.length - 1
      ? 'That was the last event. Read the feedback, then press Finish.'
      : 'Read the feedback below, then press Next event (or the N key) for event ' + (current + 2) + ' of 12.';
    drawWrapped(msg, x + 12, g.cardY + 10, w - 24, 19);
  } else {
    stroke(CB_GREEN);
    strokeWeight(2);
    fill('honeydew');
    rect(x, g.cardY, w, g.cardH, 8);
    strokeWeight(1);
    noStroke();
    fill('black');
    textSize(16);
    textAlign(LEFT, TOP);
    drawWrapped('Round complete: ' + score + ' of 12 classified correctly. Click any chip in a bin to review it, ' +
      'or press Try again to reshuffle.', x + 12, g.cardY + 10, w - 24, 20);
  }
}

function drawCard(x, y, w, h, ev, lifted) {
  if (lifted) {
    noStroke();
    fill(0, 0, 0, 40);
    rect(x + 4, y + 4, w, h, 8);
  }
  stroke('slategray');
  strokeWeight(lifted ? 2 : 1);
  fill('lightyellow');
  rect(x, y, w, h, 8);
  strokeWeight(1);
  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(LEFT, TOP);
  text('Event ' + (current + 1) + ' of 12 - drag me into a bin', x + 10, y + 6);
  fill('black');
  textSize(narrow() ? 14 : 16);
  drawWrapped('The learner ' + ev.text, x + 10, y + 24, w - 20, narrow() ? 17 : 20);
}

function drawBins(g) {
  binRects = [];
  chipRects = [];
  const n = BINS.length;
  const x0 = margin, w = canvasWidth - 2 * margin;
  const hoverBin = dragging ? binAt(mouseX, mouseY) : -1;
  for (let i = 0; i < n; i++) {
    let bx, by, bw, bh;
    if (narrow()) {
      bx = x0; bw = w; bh = 28; by = g.binY + i * 33;
    } else {
      const gap = 8;
      bw = (w - gap * (n - 1)) / n; bh = g.binH;
      bx = x0 + i * (bw + gap); by = g.binY;
    }
    binRects.push({ x: bx, y: by, w: bw, h: bh });
    const b = BINS[i];
    stroke(b.color);
    strokeWeight(hoverBin === i ? 4 : 2);
    fill(hoverBin === i ? 'lightyellow' : 'white');
    rect(bx, by, bw, bh, 8);
    strokeWeight(1);
    noStroke();
    fill(b.color);
    rect(bx, by, narrow() ? 110 : bw, narrow() ? bh : 24, 8, narrow() ? 0 : 8, 0, narrow() ? 8 : 0);
    fill(b.ink);
    textStyle(BOLD);
    textSize(14);
    textAlign(narrow() ? LEFT : CENTER, CENTER);
    text((i + 1) + ' ' + b.label, narrow() ? bx + 8 : bx + bw / 2, by + (narrow() ? bh / 2 : 12));
    textStyle(NORMAL);
    if (!narrow()) {
      fill('dimgray');
      textSize(12);
      textAlign(CENTER, TOP);
      text(b.sub, bx + bw / 2, by + 28);
    }
    // chips for events placed in this bin
    const items = placements.filter(p => p.bin === b.id);
    let cx = narrow() ? bx + 118 : bx + 8;
    let cy = narrow() ? by + 4 : by + 46;
    for (const it of items) {
      if (narrow() && cx + 20 > bx + bw - 4) break;
      if (!narrow() && cx + 20 > bx + bw - 4) { cx = bx + 8; cy += 24; }
      const sel = reviewItem === it;
      stroke(it.correct ? CB_GREEN : CB_VERMILLION);
      strokeWeight(sel ? 3 : 1.5);
      fill(it.correct ? CB_GREEN : 'white');
      rect(cx, cy, 20, 20, 4);
      strokeWeight(1);
      noStroke();
      fill(it.correct ? 'white' : WRONG_TEXT);
      textSize(11);
      textAlign(CENTER, CENTER);
      text(it.correct ? it.n : 'x' + it.n, cx + 10, cy + 10);
      chipRects.push({ x: cx, y: cy, w: 20, h: 20, item: it });
      cx += 24;
    }
  }
}

function drawInfo(g) {
  const x = margin, y = g.infoY, w = canvasWidth - 2 * margin, h = g.infoH;
  stroke('silver');
  fill(255, 255, 255, 235);
  rect(x, y, w, h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  const lh = narrow() ? 17 : 20;
  let ty = y + 10;
  const tx = x + 12, tw = w - 24;
  if (!reviewItem) {
    fill('black');
    textSize(narrow() ? 14 : 16);
    textStyle(BOLD);
    text(state === 'done' ? 'Review your round' : 'How to classify', tx, ty);
    textStyle(NORMAL);
    ty += lh + 4;
    const lines = state === 'done' ? [
      'Green chips were classified correctly on the first try; outlined chips marked x were not. ' +
      'Click a chip to see its verb, object type, required result field and reason, then press Show statement for its JSON.',
      'For each miss, say which question you should have asked: can it say right or wrong, did time pass in a run, ' +
      'was a control touched, or was it below a threshold or not a new act?'
    ] : [
      'Ask what the event can say: a checked right-or-wrong answer (answered), time spent in a run (experienced), ' +
      'or a control touched (interacted). If it is none of these, or it falls below a threshold, it gets no statement.',
      'Drag the card into a bin, or press a bin button or the keys 1 to 4. Feedback appears here.'
    ];
    for (const s of lines) { ty = drawWrapped(s, tx, ty, tw, lh) + 6; }
    drawVerbTable(tx, ty + 4, tw, y + h - 8);
    return;
  }
  const it = reviewItem, ev = it.ev;
  const bin = BINS.find(b => b.id === ev.verb);
  const chosen = BINS.find(b => b.id === it.bin);
  textSize(narrow() ? 15 : 17);
  textStyle(BOLD);
  fill(it.correct ? RIGHT_TEXT : WRONG_TEXT);
  const head = it.correct
    ? 'Correct: ' + bin.label + '  (event ' + it.n + ')'
    : 'Not quite: you chose ' + chosen.label + '; the answer is ' + bin.label + '  (event ' + it.n + ')';
  ty = drawWrapped(head, tx, ty, tw, lh) + 4;
  textStyle(NORMAL);
  textSize(narrow() ? 13 : 15);
  fill('dimgray');
  ty = drawWrapped('Event: the learner ' + ev.text, tx, ty, tw, lh - 2) + 6;
  fill('black');
  const verbTxt = ev.verb === 'none' ? 'none (no statement)' : ev.verb;
  const objTxt = ev.verb === 'none'
    ? 'none (the act would concern a ' + ev.type + ')'
    : ev.type + ' (' + (ev.frag ? '.../bouncing-ball/' + ev.frag : 'the page, .../bouncing-ball/') + ')';
  const rows = [['Verb', verbTxt], ['Object type', objTxt], ['Required result field', ev.field]];
  for (const r of rows) {
    textStyle(BOLD);
    text(r[0] + ':', tx, ty);
    const lw = textWidth(r[0] + ': ');
    textStyle(NORMAL);
    ty = drawWrapped(r[1], tx + lw, ty, tw - lw, lh - 2);
  }
  ty += 6;
  textStyle(BOLD);
  text('Why:', tx, ty);
  const lw = textWidth('Why: ');
  textStyle(NORMAL);
  ty = drawWrapped(ev.why, tx + lw, ty, tw - lw, lh - 2) + 6;
  if (ty + lh < y + h) {
    fill('dimgray');
    textSize(narrow() ? 12 : 13);
    drawWrapped('Press Show statement to see the ' + (ev.verb === 'none' ? 'result: no JSON at all.' : 'statement as JSON.'), tx, ty, tw, lh - 3);
  }
}

// The chapter's three-verb summary table, drawn only when there is room (wide layouts)
function drawVerbTable(x, y, w, bottom) {
  const rows = [
    ['Verb', 'Object', 'Required result', 'What it can say'],
    ['answered', 'Question', 'success', 'right or wrong on a checked item'],
    ['experienced', 'MicroSim or Page', 'duration', 'the learner spent this long with it'],
    ['interacted', 'Control', 'none', 'the learner touched this control, with these values']
  ];
  const rh = 24;
  if (w < 600 || y + rows.length * rh > bottom) return;
  const cols = [0, 120, 270, 400];
  textSize(14);
  for (let r = 0; r < rows.length; r++) {
    const ry = y + r * rh;
    noStroke();
    fill(r === 0 ? 'lavender' : (r % 2 ? 'white' : 'ghostwhite'));
    rect(x, ry, w, rh);
    fill('black');
    textStyle(r === 0 ? BOLD : NORMAL);
    textAlign(LEFT, CENTER);
    for (let c = 0; c < 4; c++) text(rows[r][c], x + 8 + cols[c], ry + rh / 2);
  }
  textStyle(NORMAL);
  stroke('silver');
  noFill();
  rect(x, y, w, rows.length * rh);
  noStroke();
  textAlign(LEFT, TOP);
}

// Render the statement's verb, object and result as compact JSON
function drawJson(g) {
  const top = narrow() ? g.cardY : g.binY;   // on narrow screens the JSON also covers the card zone
  const x = margin, y = top, w = canvasWidth - 2 * margin, h = drawHeight - 8 - top;
  const ev = reviewItem.ev;
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 10);
  noStroke();
  fill('black');
  textSize(narrow() ? 13 : 15);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Statement for event ' + reviewItem.n + (ev.verb === 'none' ? ': none' : ': ' + ev.verb), x + 12, y + 8);
  textStyle(NORMAL);
  fill('dimgray');
  textSize(12);
  if (ev.verb === 'none') {
    textSize(narrow() ? 14 : 16);
    fill('black');
    let ty = y + 40;
    ty = drawWrapped('No statement is emitted for this event, so there is no JSON to show.', x + 12, ty, w - 24, 22) + 8;
    fill('dimgray');
    drawWrapped(ev.why, x + 12, ty, w - 24, 22);
    return;
  }
  text('verb, object and result only; actor, context, id and timestamp omitted', x + 12, y + 28);
  const lines = statementLines(ev);
  const fs = narrow() ? 11 : 13;
  textFont('monospace');
  textSize(fs);
  const cw = textWidth('M');
  const maxChars = max(20, floor((w - 24) / cw));
  const lh = fs + 3;
  let ty = y + 48;
  for (const ln of lines) {
    if (ty > y + h - lh) break;
    ty = drawJsonLine(ln, maxChars, x + 12, ty, lh);
  }
  textFont('sans-serif');
}

// Split a long monospace line into pieces of at most maxChars. Continuation pieces are indented
// two spaces past the line's own indent. Returns [{start, end, pad}] offsets into s.
function wrapParts(s, maxChars) {
  if (s.length <= maxChars) return [{ start: 0, end: s.length, pad: 0 }];
  const indent = s.match(/^ */)[0].length + 2;
  const out = [];
  let pos = 0;
  let first = true;
  while (pos < s.length) {
    const room = first ? maxChars : maxChars - indent;
    let cut = min(s.length, pos + room);
    if (cut < s.length) {
      // prefer to break after a space, slash or comma so IRIs split at a path boundary
      const sp = Math.max(s.lastIndexOf(' ', cut - 1), s.lastIndexOf('/', cut - 1), s.lastIndexOf(',', cut - 1));
      if (sp - pos > room * 0.5) cut = sp + 1;
    }
    out.push({ start: pos, end: cut, pad: first ? 0 : indent });
    pos = cut;
    first = false;
  }
  return out;
}

// Syntax colors for one whole JSON line: keys navy, strings dark green, numbers/booleans orange
function jsonColors(s) {
  const cols = new Array(s.length).fill('black');
  const re = /("(?:[^"\\]|\\.)*")(\s*:)?|(\btrue\b|\bfalse\b|-?\d+(?:\.\d+)?)/g;
  let m;
  while ((m = re.exec(s)) !== null) {
    const c = m[1] ? (m[2] ? 'navy' : 'darkgreen') : 'chocolate';
    const len = m[1] ? m[1].length : m[3].length;
    for (let i = m.index; i < m.index + len; i++) cols[i] = c;
  }
  return cols;
}

// Draw one JSON line, wrapped, coloring the whole line before it is split. Returns the new y.
function drawJsonLine(s, maxChars, x, y, lh) {
  const cols = jsonColors(s);
  const cw = textWidth('M');
  noStroke();
  for (const p of wrapParts(s, maxChars)) {
    let i = p.start;
    while (i < p.end) {
      let k = i;
      while (k < p.end && cols[k] === cols[i]) k++;
      fill(cols[i]);
      text(s.slice(i, k), x + (p.pad + i - p.start) * cw, y);
      i = k;
    }
    y += lh;
  }
  return y;
}

function statementLines(ev) {
  const st = {
    verb: { id: VERB_IRI[ev.verb], display: { 'en-US': ev.verb } },
    object: {
      objectType: 'Activity',
      id: PAGE_IRI + ev.frag,
      definition: { name: { 'en-US': ev.name }, type: TYPE_IRI[ev.type] }
    },
    result: {}
  };
  for (const k in ev.result) {
    if (k === 'extensions') {
      const ex = {};
      for (const e in ev.result.extensions) ex[EXT + e] = ev.result.extensions[e];
      st.result.extensions = ex;
    } else st.result[k] = ev.result[k];
  }
  return prettyJson(st, 0);
}

// JSON pretty-printer that keeps short objects on one line
function prettyJson(v, ind) {
  const pad = ' '.repeat(ind);
  const one = JSON.stringify(v).replace(/":/g, '": ').replace(/,"/g, ', "');
  if (typeof v !== 'object' || v === null || one.length + ind < 44) return [pad + one];
  const keys = Object.keys(v);
  const out = [pad + '{'];
  keys.forEach((k, i) => {
    const sub = prettyJson(v[k], ind + 2);
    sub[0] = ' '.repeat(ind + 2) + JSON.stringify(k) + ': ' + sub[0].trim();
    if (i < keys.length - 1) sub[sub.length - 1] += ',';
    out.push(...sub);
  });
  out.push(pad + '}');
  return out;
}

// word-wrap text inside width w; returns the y below the last line
function drawWrapped(s, x, y, w, lh) {
  const words = String(s).split(' ');
  let line = '';
  for (const wd of words) {
    const test = line ? line + ' ' + wd : wd;
    if (textWidth(test) > w && line) {
      text(line, x, y);
      y += lh;
      line = wd;
    } else line = test;
  }
  if (line) { text(line, x, y); y += lh; }
  return y;
}

// ---------- Interaction ----------
function binAt(mx, my) {
  for (let i = 0; i < binRects.length; i++) {
    const r = binRects[i];
    if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) return i;
  }
  return -1;
}

function mousePressed() {
  if (mouseY > drawHeight || mouseY < 0) return;
  if (state === 'await' && !showJson &&
      mouseX >= cardRect.x && mouseX <= cardRect.x + cardRect.w &&
      mouseY >= cardRect.y && mouseY <= cardRect.y + cardRect.h) {
    dragging = true;
    dragDX = mouseX - cardRect.x;
    dragDY = mouseY - cardRect.y;
    cardX = cardRect.x;
    cardY = cardRect.y;
    return;
  }
  if (!showJson) {
    for (const c of chipRects) {
      if (mouseX >= c.x && mouseX <= c.x + c.w && mouseY >= c.y && mouseY <= c.y + c.h) {
        if (state !== 'await') { reviewItem = c.item; updateButtons(); }
        return;
      }
    }
  }
}

function mouseDragged() {
  if (!dragging) return;
  cardX = mouseX - dragDX;
  cardY = mouseY - dragDY;
  return false;
}

function mouseReleased() {
  if (!dragging) return;
  const i = binAt(mouseX, mouseY);
  dragging = false;
  if (i >= 0) assign(BINS[i].id);
}

function keyPressed() {
  if (key >= '1' && key <= '4') assign(BINS[int(key) - 1].id);
  else if (key === 'n' || key === 'N' || key === 'Enter') nextEvent();
  else if (key === 's' || key === 'S') toggleJson();
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
