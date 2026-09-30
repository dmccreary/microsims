// Gateway Request Simulator - the ingestion gateway's five request steps and the all-or-nothing batch
// CANVAS_HEIGHT: 620
// Learning objective (Apply / demonstrate): the learner demonstrates the gateway's five request
// steps (authenticate, validate, assign ids, produce, respond) and predicts whether a batch is
// accepted or rejected in full (Chapter 20, "The Ingestion Gateway").
// Build a batch of up to five statement cards, set the token and broker checkboxes, predict the
// outcome and send. The rules and message text mirror the repository's gateway validation.py and
// app.py: 401 for a bad token, 400 with every violation for a broken batch (zero statements
// queued), 503 with Retry-After: 5 when the local queue is full and the broker is unreachable,
// and 200 with the statement ids only after the queue acknowledges the write.

// ---------- Canvas dimensions ----------
// Fixed total height; the drawing/control split is recomputed when the control rows wrap.
let canvasWidth = 800;
let canvasHeight = 620;
let controlHeight = 114;
let drawHeight = canvasHeight - controlHeight;
let margin = 12;
let defaultTextSize = 16;

// ---------- Statement templates ----------
const SITE = 'https://dmccreary.github.io/microsims/';
const VALID_TEMPLATES = [
  { verb: 'interacted', detail: '#frequency slider (Control)' },
  { verb: 'answered', detail: '#q1 (Question), success: true' },
  { verb: 'experienced', detail: 'sine-wave (MicroSim), PT40S' },
  { verb: 'interacted', detail: '#amplitude slider (Control)' },
  { verb: 'answered', detail: '#q2 (Question), success: false' }
];
// Defects and the violation each produces (field, contract section, message from validation.py)
const DEFECTS = {
  'wrong verb': {
    verb: 'completed', detail: 'sine-wave (MicroSim)',
    field: 'verb.id', contract: '§3',
    message: "'http://adlnet.gov/expapi/verbs/completed' is not one of the three v1 verbs (answered, experienced, interacted)."
  },
  'answered without success': {
    verb: 'answered', detail: '#q3 (Question), no result',
    field: 'result.success', contract: '§3',
    message: '`answered` requires result.success (bool). Without it this concept reports attempts = 0 forever.'
  },
  'missing grouping': {
    verb: 'interacted', detail: '#frequency slider, no grouping',
    field: 'context.contextActivities.grouping[0].id', contract: '§4',
    message: 'required on every statement. A statement that cannot be attributed to a textbook version cannot be replayed.'
  },
  'page IRI with a fragment': {
    verb: 'experienced', detail: 'sine-wave/#intro typed Page, PT12S',
    field: 'object.id', contract: '§5',
    message: 'a fragment-qualified IRI must not be typed Page. This mints a PageEngagement vertex per fragment.'
  }
};
const STEPS = [
  { name: 'Authenticate', short: 'Auth', note: 'bearer token maps to a district' },
  { name: 'Validate', short: 'Validate', note: 'producer contract, whole batch' },
  { name: 'Assign ids', short: 'Ids', note: 'UUIDv7 + stored_at' },
  { name: 'Produce', short: 'Produce', note: 'append to the durable queue' },
  { name: 'Respond', short: 'Respond', note: 'only after the queue ack' }
];
const MAX_CARDS = 5;
const FRAMES_PER_STEP = 42;

// Okabe-Ito colors (color-blind safe)
const OK_COLOR = [0, 158, 115];     // bluish green
const BAD_COLOR = [213, 94, 0];     // vermillion
const ACTIVE_COLOR = [0, 114, 178]; // blue
const WARN_COLOR = [230, 159, 0];   // orange

// ---------- State ----------
let cards = [];          // {verb, detail, defect, id, status: 'new'|'ok'|'bad', fly}
let validCount = 0;
let queued = [];         // statements that reached the topic (persist until Reset)
let phase = 'idle';      // idle | predict | running | done
let stepIndex = -1;
let stepTimer = 0;
let stepStatus = [];     // per step: '', 'ok', 'fail'
let result = null;       // {code, title, lines[], violations[], accepted}
let prediction = '';
let localQueueFill = 0;  // 0..1, the producer's local queue when the broker is down
let flyProgress = 0;
let notice = '';
let cardSlots = null;  // geometry of the card column, for click-to-remove

// ---------- Controls ----------
let addValidButton, addBrokenButton, defectSelect, tokenBox, brokerBox, predictBox;
let sendButton, resetButton, acceptedButton, rejectedButton;
let layoutItems = [];    // {el, label, br}
let labelSpots = [];     // canvas-drawn control labels {text, x, y}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('sans-serif');
  const main = document.querySelector('main');

  addValidButton = createButton('Add valid statement');
  addValidButton.mousePressed(() => addCard(''));
  addBrokenButton = createButton('Add broken statement');
  addBrokenButton.mousePressed(() => addCard(defectSelect.value()));
  defectSelect = createSelect();
  for (const d of Object.keys(DEFECTS)) defectSelect.option(d);
  defectSelect.selected('wrong verb');
  tokenBox = createCheckbox('Token is valid', true);
  brokerBox = createCheckbox('Broker reachable', true);
  predictBox = createCheckbox('Predict first', true);
  sendButton = createButton('Send batch');
  sendButton.mousePressed(sendBatch);
  resetButton = createButton('Reset');
  resetButton.mousePressed(resetAll);
  acceptedButton = createButton('Accepted');
  acceptedButton.mousePressed(() => choose('Accepted'));
  rejectedButton = createButton('Rejected');
  rejectedButton.mousePressed(() => choose('Rejected'));

  for (const el of [addValidButton, addBrokenButton, defectSelect, tokenBox, brokerBox, predictBox,
    sendButton, resetButton, acceptedButton, rejectedButton]) {
    el.parent(main);
    el.style('white-space', 'nowrap');
  }
  for (const el of [tokenBox, brokerBox]) el.changed(() => { if (phase === 'done') clearResult(); });

  layoutItems = [
    { el: addValidButton }, { el: addBrokenButton }, { el: defectSelect, label: 'Defect:' },
    { el: tokenBox, br: true }, { el: brokerBox }, { el: predictBox },
    { el: sendButton, br: true }, { el: resetButton }, { el: acceptedButton, label: 'Prediction:' }, { el: rejectedButton }
  ];

  // Start with a small example batch: two valid statements and one broken one
  addCard('');
  addCard('');
  addCard('answered without success');
  notice = '';
  layoutControls();
  updateButtons();

  describe('Gateway Request Simulator. Statement cards on the left form a batch of up to five. ' +
    'A column of five gateway steps, authenticate, validate, assign ids, produce and respond, sits in ' +
    'the middle, and the durable queue is on the right. Sending the batch moves it through the steps. ' +
    'An invalid token stops it with 401. Any broken statement turns every card red at the validate step, ' +
    'lists each violation with its index and field, and queues nothing, with a 400 response. With the ' +
    'broker unreachable the local queue fills and the gateway answers 503 with Retry-After 5. Otherwise ' +
    'the cards reach the queue and the gateway answers 200 with their ids.');
}

// ---------- Batch building ----------
function addCard(defect) {
  if (phase === 'running' || phase === 'predict') return;
  if (phase === 'done') {
    if (result && result.accepted) cards = [];   // the accepted batch has left the client
    clearResult();
  }
  if (cards.length >= MAX_CARDS) { notice = 'A batch here holds at most five statements.'; return; }
  let c;
  if (defect) {
    const d = DEFECTS[defect];
    c = { verb: d.verb, detail: d.detail, defect };
  } else {
    const t = VALID_TEMPLATES[validCount % VALID_TEMPLATES.length];
    validCount++;
    c = { verb: t.verb, detail: t.detail, defect: '' };
  }
  c.status = 'new';
  c.id = '';
  c.sent = false;
  cards.push(c);
  notice = '';
}

function clearResult() {
  phase = 'idle';
  stepIndex = -1;
  stepStatus = [];
  result = null;
  prediction = '';
  localQueueFill = 0;
  flyProgress = 0;
  for (const c of cards) { c.status = 'new'; c.id = ''; c.sent = false; }
  updateButtons();
}

function resetAll() {
  cards = [];
  validCount = 0;
  queued = [];
  notice = '';
  clearResult();
}

function sendBatch() {
  if (phase === 'running' || phase === 'predict') return;
  if (phase === 'done') {
    // a finished batch that was accepted has left the client; start a fresh one
    if (result && result.accepted) { cards = []; }
    clearResult();
  }
  if (predictBox.checked()) {
    phase = 'predict';
  } else {
    startRun();
  }
  updateButtons();
}

function choose(p) {
  if (phase !== 'predict') return;
  prediction = p;
  startRun();
  updateButtons();
}

function startRun() {
  phase = 'running';
  stepIndex = 0;
  stepTimer = 0;
  stepStatus = ['', '', '', '', ''];
  localQueueFill = brokerBox.checked() ? 0 : 0.62;
}

// ---------- The gateway, one step at a time ----------
let idSeq = 0;
function uuid7ish() {
  // Illustrative UUIDv7-like id: a millisecond-style time prefix plus random bits (not a real UUID)
  idSeq++;
  const t = (0x0192f4c1a3b0 + idSeq * 37).toString(16).padStart(12, '0');
  const r = (Math.imul(idSeq, 2654435761) >>> 0).toString(16).padStart(8, '0');
  return t.slice(0, 8) + '-' + t.slice(8, 12) + '-7' + r.slice(0, 3) + '-' + r.slice(3, 7);
}

function runStep(i) {
  if (i === 0) {
    if (!tokenBox.checked()) return fail(0, {
      code: 401, title: 'HTTP 401 Unauthorized: unrecognised ingest token',
      lines: ['The batch stopped at step 1. Nothing was validated, given an id or queued.',
        'The bearer token maps a caller to a district; without it the gateway cannot scope anything.']
    });
    return true;
  }
  if (i === 1) {
    const violations = [];
    if (cards.length === 0) {
      violations.push({ index: 0, field: '(body)', contract: '§9', message: 'the request body must contain at least one statement.' });
    }
    cards.forEach((c, k) => {
      if (c.defect) {
        const d = DEFECTS[c.defect];
        violations.push({ index: k, field: d.field, contract: d.contract, message: d.message });
      }
    });
    if (violations.length) {
      for (const c of cards) c.status = 'bad';
      const valid = cards.filter(c => !c.defect).length;
      return fail(1, {
        code: 400, title: 'HTTP 400 Bad Request: the whole batch is rejected',
        lines: [violations.length + (violations.length === 1 ? ' violation' : ' violations') +
          ' listed at once. 0 statements queued' + (valid ? ', including the ' + valid + ' valid one' + (valid === 1 ? '' : 's') + '.' : '.')],
        violations
      });
    }
    for (const c of cards) c.status = 'ok';
    return true;
  }
  if (i === 2) {
    cards.forEach(c => { c.id = uuid7ish(); });
    return true;
  }
  if (i === 3) {
    if (!brokerBox.checked()) {
      localQueueFill = 1;
      return fail(3, {
        code: 503, title: 'HTTP 503 Service Unavailable, Retry-After: 5',
        lines: ['The broker is unreachable and the local queue is full: the gateway drained and retried three times, then gave up.',
          '0 statements queued. The design treats this as page-worthy: the one failure that can lose data.']
      });
    }
    // the broker acknowledged the durable write
    for (const c of cards) { queued.push({ id: c.id, verb: c.verb }); c.sent = true; }
    return true;
  }
  if (i === 4) {
    result = {
      code: 200, accepted: true, title: 'HTTP 200 OK: ' + cards.length + ' statement id' + (cards.length === 1 ? '' : 's') + ' returned',
      lines: ['Sent only after the queue acknowledged the durable write, never after later processing.'],
      ids: cards.map(c => c.id)
    };
    stepStatus[4] = 'ok';
    phase = 'done';
    updateButtons();
    return false;
  }
  return true;
}

function fail(i, res) {
  stepStatus[i] = 'fail';
  res.accepted = false;
  result = res;
  phase = 'done';
  updateButtons();
  return false;
}

function advance() {
  if (phase !== 'running') return;
  stepTimer++;
  if (stepIndex === 3 && brokerBox.checked()) flyProgress = min(1, stepTimer / FRAMES_PER_STEP);
  if (stepIndex === 3 && !brokerBox.checked()) localQueueFill = min(1, 0.62 + 0.38 * stepTimer / FRAMES_PER_STEP);
  if (stepTimer < FRAMES_PER_STEP) return;
  stepTimer = 0;
  const ok = runStep(stepIndex);
  if (ok) {
    stepStatus[stepIndex] = 'ok';
    stepIndex++;
  }
}

// ---------- Layout ----------
function narrow() { return canvasWidth < 500; }

function layoutControls() {
  const rowH = 34, x0 = 10, gap = 10;
  textSize(14);
  for (const it of layoutItems) it.el.position(0, 0);
  // First pass: rows
  let x = x0, row = 0;
  const placed = [];
  for (const it of layoutItems) {
    const lw = it.label ? textWidth(it.label) + 6 : 0;
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
    if (p.it.label) labelSpots.push({ text: p.it.label, x: p.x, y: y + 12 });
    const dy = (p.it.el === tokenBox || p.it.el === brokerBox || p.it.el === predictBox) ? 3 : 0;
    p.it.el.position(p.x + p.lw, y + dy);
  }
}

function updateButtons() {
  const busy = phase === 'running' || phase === 'predict';
  setEnabled(addValidButton, !busy);
  setEnabled(addBrokenButton, !busy);
  setEnabled(sendButton, !busy);
  setEnabled(acceptedButton, phase === 'predict');
  setEnabled(rejectedButton, phase === 'predict');
}

function setEnabled(b, on) {
  if (on) b.removeAttribute('disabled'); else b.attribute('disabled', '');
}

// ---------- Drawing ----------
function draw() {
  advance();

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
  text('Gateway Request Simulator', margin, 8);
  textStyle(NORMAL);
  textSize(13);
  fill('dimgray');
  if (!narrow()) text('POST /xapi/statements', canvasWidth - margin - textWidth('POST /xapi/statements'), 12);

  // Column geometry
  const top = 44;
  const gapX = narrow() ? 8 : 18;
  const usable = canvasWidth - 2 * margin - 2 * gapX;
  const cardW = usable * (narrow() ? 0.38 : 0.36);
  const stepW = usable * (narrow() ? 0.30 : 0.33);
  const queueW = usable - cardW - stepW;
  const cardX = margin, stepX = cardX + cardW + gapX, queueX = stepX + stepW + gapX;
  const zoneH = min(236, drawHeight - top - 150);
  drawCards(cardX, top, cardW, zoneH, queueX + 5);
  cardSlots = { x: cardX, y: top, w: cardW, h: zoneH };
  drawSteps(stepX, top, stepW, zoneH);
  drawQueue(queueX, top, queueW, zoneH);
  drawResponse(margin, top + zoneH + 10, canvasWidth - 2 * margin, drawHeight - (top + zoneH + 10) - 8);
  drawControlLabels();
}

function colHeader(label, x, y) {
  noStroke();
  fill('dimgray');
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text(label, x, y - 16);
  textStyle(NORMAL);
}

function drawCards(x, y, w, h, targetX) {
  colHeader('Batch (' + cards.length + ' of ' + MAX_CARDS + ')', x, y + 2);
  const slotH = (h - 4) / MAX_CARDS;
  const ch = slotH - 6;
  for (let k = 0; k < MAX_CARDS; k++) {
    const cy = y + 4 + k * slotH;
    if (k >= cards.length) {
      stroke(205);
      strokeWeight(1);
      drawingContext.setLineDash([4, 4]);
      noFill();
      rect(x, cy, w, ch, 6);
      drawingContext.setLineDash([]);
      continue;
    }
    const c = cards[k];
    if (c.sent) {
      // delivered: a faint ghost with the id the gateway assigned
      stroke(200);
      strokeWeight(1);
      fill(245);
      rect(x, cy, w, ch, 6);
      noStroke();
      fill('gray');
      textSize(12);
      textAlign(LEFT, CENTER);
      text(fitText('[' + k + '] queued as ' + c.id, w - 12), x + 6, cy + ch / 2);
      continue;
    }
    let fillC = color(255), strokeC = color(150);
    if (c.status === 'bad') { fillC = color(250, 215, 200); strokeC = color(BAD_COLOR); }
    if (c.status === 'ok') { fillC = color(215, 240, 230); strokeC = color(OK_COLOR); }
    // During Produce, accepted cards fly to the queue
    let dx = 0;
    if (phase === 'running' && stepIndex === 3 && brokerBox.checked() && c.status === 'ok') {
      dx = flyProgress * (targetX - x);
    }
    stroke(strokeC);
    strokeWeight(c.status === 'bad' ? 2 : 1.2);
    fill(fillC);
    rect(x + dx, cy, w, ch, 6);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(narrow() ? 12 : 13);
    textStyle(BOLD);
    fill(c.defect && c.verb === 'completed' ? color(BAD_COLOR) : color(0));
    text('[' + k + '] ' + c.verb, x + dx + 6, cy + 3);
    textStyle(NORMAL);
    textSize(12);
    const second = c.id ? 'id ' + c.id : c.detail;
    fill(c.defect ? color(150, 60, 0) : color(60));
    if (ch > 30) text(fitText(second, w - 12), x + dx + 6, cy + 19);
    if (c.status === 'bad' && ch > 20) {
      fill(BAD_COLOR);
      textAlign(RIGHT, TOP);
      textStyle(BOLD);
      text('✗', x + dx + w - 6, cy + 3);
      textStyle(NORMAL);
    }
  }
}

function drawSteps(x, y, w, h) {
  colHeader(narrow() ? 'Gateway' : 'Gateway steps', x, y + 2);
  const slotH = (h - 4) / 5;
  const bh = slotH - 8;
  for (let i = 0; i < 5; i++) {
    const by = y + 4 + i * slotH;
    const st = stepStatus[i] || '';
    const active = phase === 'running' && stepIndex === i;
    let fillC = color(255), strokeC = color(160), sw = 1.2;
    if (st === 'ok') { fillC = color(215, 240, 230); strokeC = color(OK_COLOR); }
    if (st === 'fail') { fillC = color(250, 215, 200); strokeC = color(BAD_COLOR); sw = 2.5; }
    if (active) { strokeC = color(ACTIVE_COLOR); sw = 3; fillC = color(225, 238, 250); }
    stroke(strokeC);
    strokeWeight(sw);
    fill(fillC);
    rect(x, by, w, bh, 6);
    // connector arrow to the next step
    if (i < 4) {
      stroke(170);
      strokeWeight(1.5);
      line(x + w / 2, by + bh, x + w / 2, by + slotH);
    }
    noStroke();
    fill('black');
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(narrow() ? 12 : 14);
    const nm = (i + 1) + ' ' + (narrow() ? STEPS[i].short : STEPS[i].name);
    text(nm, x + 6, by + 4);
    textStyle(NORMAL);
    const down = i === 3 && !brokerBox.checked();
    if (!narrow() && bh > 32) {
      textSize(11);
      fill(down ? color(150, 60, 0) : color(70));
      const note = down ? 'local queue ' + round(100 * max(0.62, localQueueFill)) + '% full' : STEPS[i].note;
      text(fitText(note, w - 12), x + 6, by + 19);
    }
    // status mark
    textAlign(RIGHT, TOP);
    textSize(14);
    textStyle(BOLD);
    if (st === 'ok') { fill(OK_COLOR); text('✓', x + w - 6, by + 3); }
    if (st === 'fail') { fill(BAD_COLOR); text('✗', x + w - 6, by + 3); }
    textStyle(NORMAL);
    // local producer queue gauge next to Produce when the broker is down
    if (i === 3 && !brokerBox.checked()) {
      const gw = w - 12, gy = by + bh - 6;
      noStroke();
      fill(225);
      rect(x + 6, gy, gw, 4, 2);
      fill(localQueueFill >= 1 ? color(BAD_COLOR) : color(WARN_COLOR));
      rect(x + 6, gy, gw * max(0.62, localQueueFill), 4, 2);
    }
  }
  // batch marker beside the active step
  if (phase === 'running' || phase === 'predict') {
    const i = phase === 'predict' ? 0 : stepIndex;
    const by = y + 4 + i * ((h - 4) / 5) + ((h - 4) / 5 - 8) / 2;
    noStroke();
    fill(ACTIVE_COLOR);
    triangle(x - 12, by - 7, x - 12, by + 7, x - 3, by);
  }
}

function drawQueue(x, y, w, h) {
  const down = !brokerBox.checked();
  colHeader(narrow() ? 'Queue' : 'Durable queue', x, y + 2);
  stroke(down ? color(BAD_COLOR) : color(120));
  strokeWeight(down ? 2 : 1.2);
  fill(down ? color(240) : color(255, 255, 255, 230));
  rect(x, y + 4, w, h - 8, 8);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(11);
  fill(80);
  text(fitText(narrow() ? 'raw topic' : 'xapi.statements.raw', w - 10), x + 5, y + 8);
  let listTop = y + 26;
  if (down) {
    fill(BAD_COLOR);
    textStyle(BOLD);
    textSize(12);
    listTop = drawWrapped('broker unreachable', x + 5, y + 26, w - 10, 14) + 4;
    textStyle(NORMAL);
  }
  // queued statements, newest at the top (earlier writes stay durable while the broker is down)
  const rowH = 17;
  const maxRows = floor((y + h - 14 - listTop) / rowH);
  const list = queued.slice().reverse();
  for (let k = 0; k < min(list.length, maxRows); k++) {
    const q = list[k];
    const ry = listTop + k * rowH;
    fill(down ? color(225) : color(215, 240, 230));
    stroke(down ? color(170) : color(OK_COLOR));
    strokeWeight(1);
    rect(x + 5, ry, w - 10, rowH - 3, 3);
    noStroke();
    fill(0);
    textSize(11);
    text(fitText(q.verb + ' \u2026' + q.id.slice(-9), w - 18), x + 9, ry + 2);
  }
  if (list.length > maxRows) {
    fill(80);
    textSize(11);
    text('+' + (list.length - maxRows) + ' more', x + 5, y + h - 20);
  }
  if (queued.length === 0 && !down) {
    fill(120);
    textSize(12);
    drawWrapped('empty: nothing has been queued yet', x + 5, y + 28, w - 10, 14);
  }
  // cards in flight during Produce
  if (phase === 'running' && stepIndex === 3 && flyProgress > 0) {
    fill(ACTIVE_COLOR);
    textSize(11);
    textAlign(LEFT, BOTTOM);
    text('writing...', x + 5, y + h - 8);
  }
}

function drawResponse(x, y, w, h) {
  stroke(200);
  strokeWeight(1);
  fill(255, 255, 255, 235);
  rect(x, y, w, h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  const small = narrow();
  let ty = y + 8;
  if (phase === 'idle') {
    textSize(15);
    textStyle(BOLD);
    fill('black');
    text('Response', x + 10, ty);
    textStyle(NORMAL);
    ty += 22;
    textSize(small ? 12 : 13);
    fill(60);
    const msg = notice || ('Build a batch with the buttons below, set the token and broker, then press Send batch. ' +
      'The gateway accepts the whole batch or rejects the whole batch.');
    ty = drawWrapped(msg, x + 10, ty, w - 20, small ? 15 : 17);
    drawCodeTable(x + 10, ty + 8, w - 20, y + h - 8);
    return;
  }
  if (phase === 'predict') {
    textSize(16);
    textStyle(BOLD);
    fill(ACTIVE_COLOR);
    text('Accepted or rejected?', x + 10, ty);
    textStyle(NORMAL);
    ty += 24;
    textSize(small ? 12 : 13);
    fill(40);
    drawWrapped('Look at the cards and the two checkboxes, then choose Accepted or Rejected in the controls below. ' +
      'The batch waits at the door until you commit to a prediction.', x + 10, ty, w - 20, small ? 15 : 17);
    drawCodeTable(x + 10, ty + 8, w - 20, y + h - 8);
    return;
  }
  if (phase === 'running') {
    textSize(15);
    textStyle(BOLD);
    fill(ACTIVE_COLOR);
    text('Step ' + (stepIndex + 1) + ' of 5: ' + STEPS[min(stepIndex, 4)].name + '...', x + 10, ty);
    textStyle(NORMAL);
    if (prediction) {
      textSize(13);
      fill(60);
      text('Your prediction: ' + prediction, x + 10, ty + 24);
    }
    return;
  }
  // done
  const r = result;
  textSize(small ? 14 : 16);
  textStyle(BOLD);
  fill(r.accepted ? color(0, 120, 80) : color(BAD_COLOR));
  ty = drawWrapped(r.title, x + 10, ty, w - 20, small ? 17 : 20);
  textStyle(NORMAL);
  if (prediction) {
    const right = (prediction === 'Accepted') === r.accepted;
    textSize(13);
    textStyle(BOLD);
    fill(right ? color(0, 120, 80) : color(BAD_COLOR));
    text((right ? 'Prediction correct: ' : 'Prediction missed: ') + 'you said ' + prediction + '.', x + 10, ty + 1);
    textStyle(NORMAL);
    ty += 19;
  }
  textSize(small ? 12 : 13);
  fill(40);
  for (const l of r.lines) ty = drawWrapped(l, x + 10, ty, w - 20, small ? 15 : 16);
  if (r.ids) {
    textSize(12);
    fill(60);
    ty = drawWrapped('ids: [' + r.ids.map(s => '"' + s + '"').join(', ') + ']', x + 10, ty + 2, w - 20, 15);
  }
  if (r.violations) {
    ty += 4;
    const lineH = small ? 14 : 15;
    const room = floor((y + h - 6 - ty) / (2 * lineH));
    const shown = r.violations.slice(0, max(1, room));
    for (const v of shown) {
      textSize(12);
      textStyle(BOLD);
      fill(BAD_COLOR);
      text(fitText('index ' + v.index + '  ·  ' + v.field + '  ·  ' + v.contract, w - 20), x + 10, ty);
      textStyle(NORMAL);
      fill(40);
      text(fitText(v.message, w - 30), x + 20, ty + lineH);
      ty += 2 * lineH + 2;
    }
    if (shown.length < r.violations.length) {
      fill(80);
      text('+ ' + (r.violations.length - shown.length) + ' more', x + 10, ty);
      ty += lineH;
    }
  }
  if (!r.accepted && y + h - 8 - ty > 18) {
    textSize(12);
    textStyle(ITALIC);
    fill(0, 90, 150);
    text(fitText(r.code === 400 ? 'Fix it: click each broken card to remove it, then press Send batch again.'
      : 'Fix it: change the checkbox that caused this, then press Send batch again.', w - 20), x + 10, y + h - 22);
    textStyle(NORMAL);
  }
}

// The gateway's response codes (Chapter 20 table, from app.py), shown while there is room
const CODE_ROWS = [
  ['Missing or unrecognised bearer token', '401'],
  ['Any statement breaks the producer contract', '400 + every violation, nothing queued'],
  ['Local queue full and broker unreachable', '503, Retry-After: 5'],
  ['Whole batch durably queued', '200 + the array of statement ids']
];

function drawCodeTable(x, y, w, bottom) {
  const rowH = narrow() ? 30 : 19;
  if (bottom - y < 22 + CODE_ROWS.length * rowH) return;
  textAlign(LEFT, TOP);
  textSize(12);
  textStyle(BOLD);
  fill(60);
  text('Situation', x, y);
  if (!narrow()) text('Response', x + w * 0.52, y);
  textStyle(NORMAL);
  stroke(210);
  strokeWeight(1);
  line(x, y + 16, x + w, y + 16);
  noStroke();
  let ry = y + 21;
  for (const r of CODE_ROWS) {
    fill(30);
    if (narrow()) {
      text(fitText(r[0], w), x, ry);
      fill(0, 90, 150);
      text(fitText('\u2192 ' + r[1], w - 10), x + 10, ry + 14);
    } else {
      text(fitText(r[0], w * 0.5), x, ry);
      fill(0, 90, 150);
      text(fitText(r[1], w * 0.48), x + w * 0.52, ry);
    }
    ry += rowH;
  }
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(14);
  for (const l of labelSpots) text(l.text, l.x, l.y);
}

// ---------- Interaction: click a card to remove it from the batch ----------
function cardIndexAt(mx, my) {
  if (!cardSlots) return -1;
  const { x, y, w, h } = cardSlots;
  if (mx < x || mx > x + w || my < y + 4 || my > y + h) return -1;
  const k = floor((my - y - 4) / ((h - 4) / MAX_CARDS));
  return k < cards.length ? k : -1;
}

function mousePressed() {
  if (phase === 'running' || phase === 'predict') return;
  const k = cardIndexAt(mouseX, mouseY);
  if (k < 0) return;
  if (phase === 'done') {
    if (result && result.accepted) return;
    clearResult();
  }
  cards.splice(k, 1);
  notice = 'Removed statement ' + k + '. The remaining cards are renumbered from index 0.';
}

function mouseMoved() {
  const k = (phase === 'running' || phase === 'predict') ? -1 : cardIndexAt(mouseX, mouseY);
  cursor(k >= 0 && !(result && result.accepted && phase === 'done') ? HAND : ARROW);
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

function fitText(s, w) {
  if (textWidth(s) <= w) return s;
  while (s.length > 3 && textWidth(s + '...') > w) s = s.slice(0, -1);
  return s + '...';
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
