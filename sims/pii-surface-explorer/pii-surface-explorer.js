// PII Surface Explorer
// CANVAS_HEIGHT: 790
// Classify each field of an illustrative xAPI statement as no PII risk,
// pseudonymous, direct identifier or uncontrolled free text. Click a field
// (or focus the statement and use the arrow keys), choose a class with the
// buttons, then press "Check my answers". A field turns green when it matches
// the chapter's analysis, amber when a different class is defensible, and red
// otherwise, with a one-sentence reason. The "Storage location" setting lists
// the extra risks of a Full LRS or of LRS-Lite in the browser.
// The classifications are Chapter 24's analysis, not a legal determination.

// ---------- canvas layout ----------
// canvasHeight is fixed (it sets the iframe height). When the controls wrap
// to an extra row at narrow widths, the drawing region gives up that height.
let canvasWidth = 700;
let canvasHeight = 790;
let controlHeight = 88;
let drawHeight = canvasHeight - controlHeight;
let margin = 10;
let defaultTextSize = 16;
const ROW_H = 38;

// ---------- colors ----------
const INK = [30, 30, 30];
const MUTED = [95, 95, 95];
const SEL = [0, 60, 130];
// verdict tints (fill) and inks (text), with a symbol and a word as well
const VERDICT = {
  match: { fill: [214, 240, 228], ink: [0, 110, 80], sym: '✓', word: 'Match' },
  defensible: { fill: [253, 236, 200], ink: [150, 90, 0], sym: '~', word: 'Defensible' },
  mismatch: { fill: [250, 221, 206], ink: [175, 60, 0], sym: '✗', word: 'Mismatch' }
};

// ---------- the four classes ----------
const CLASSES = [
  { id: 'none', label: 'No PII risk' },
  { id: 'pseudo', label: 'Pseudonymous' },
  { id: 'direct', label: 'Direct identifier' },
  { id: 'free', label: 'Uncontrolled free text' }
];
function classLabel(id) { const c = CLASSES.find(k => k.id === id); return c ? c.label : 'not classified'; }

// ---------- the statement's fields (Chapter 24 example; context fields added) ----------
// answer: the chapter's class; alt: a class that is defensible but differs.
const FIELDS = [
  { path: 'actor.account.homePage', value: '"https://district.example.edu"', answer: 'none', alt: 'direct',
    reason: 'It names the district, not a learner; only together with the account name does it single out one person.',
    altReason: 'Defensible: it is half of the pair that identifies a learner, but on its own it points to an institution.' },
  { path: 'actor.account.name', value: '"student-4471"', answer: 'direct', alt: 'pseudo',
    reason: 'It is the real account name, sent as is and not pre-hashed; with homePage it identifies one learner in every book.',
    altReason: 'Defensible: it looks like a code, but the district roster maps it straight to one student; the store, not the producer, makes the pseudonym.' },
  { path: 'verb.id', value: '"http://adlnet.gov/expapi/verbs/answered"', answer: 'none', alt: null,
    reason: 'It names the action, answered, which is the same for every learner.' },
  { path: 'object.id', value: '"https://example.org/book/sims/kafka-lab/#q-kafka"', answer: 'none', alt: null,
    reason: 'It identifies a question on a published page, never a person or a local address.' },
  { path: 'result.success', value: 'true', answer: 'none', alt: 'pseudo',
    reason: 'The value identifies no one; it becomes part of a learner\'s record only through the actor.',
    altReason: 'Defensible: once stored it is linked to the learner\'s pseudonymous key, but the value itself cannot identify anyone.' },
  { path: 'result.response', value: '"Because my group leader Maria said so"', answer: 'free', alt: 'direct',
    reason: 'A learner can type anything here, even a classmate\'s name, so the designer cannot predict or control what it holds.',
    altReason: 'Defensible for this answer, which contains a name, but classify the field: any content at all can appear in it.' },
  { path: 'context.contextActivities.grouping', value: '[{"id": "https://example.org/book/v1.0.0"}]', answer: 'none', alt: null,
    reason: 'It names the textbook version, which every reader of that version shares.' },
  { path: 'context.registration', value: '"7c1e4a52-9b3d-4f0e-a2c8-5d61f09e3b17"', answer: 'pseudo', alt: 'none',
    reason: 'A random ID that links every statement of one attempt; it names no one, but whoever joins it to the actor re-identifies the trail.',
    altReason: 'Defensible: it holds no personal data, but it links one learner\'s statements together, which is what a pseudonym does.' }
];

// ---------- storage-location risks ----------
const RISKS = {
  full: [
    'The actor is replaced by a pseudonymous student_key; real identities stay in a separate vault (designed, not built).',
    'Report cells under 10 students are suppressed and PII reads are audited (designed, not built).',
    'The stored raw statement keeps result.response, so a typed name survives pseudonymization.'
  ],
  lite: [
    'Shared device: another user of the same browser profile could read the statements in IndexedDB.',
    'Eviction, or a Chromebook wipe at sign-out, can erase the history.',
    'With sync on, a copy also sits in object storage, a second place to protect.'
  ]
};

// ---------- state ----------
let chosen = FIELDS.map(() => null);    // learner's class per field
let checked = FIELDS.map(() => false);  // whether the field's current class has been checked
let selected = 0;
let storage = 'full';
let canvasFocused = false;
let rowRects = [];

// ---------- controls ----------
let classButtons = [];
let checkButton, storageRadio, storageGroup;
let liveRegion;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  frameRate(20);

  // The statement area takes keyboard focus: arrow keys move the selection,
  // keys 1-4 assign a class. Keys are handled on the canvas element only.
  canvas.elt.setAttribute('tabindex', '0');
  canvas.elt.addEventListener('focus', () => { canvasFocused = true; });
  canvas.elt.addEventListener('blur', () => { canvasFocused = false; });
  canvas.elt.addEventListener('keydown', statementKeyDown);

  CLASSES.forEach(c => {
    const b = createButton(c.label);
    b.parent(document.querySelector('main'));
    b.mousePressed(() => assignClass(c.id));
    classButtons.push(b);
  });
  checkButton = createButton('Check my answers');
  checkButton.parent(document.querySelector('main'));
  checkButton.mousePressed(checkAnswers);

  storageGroup = createDiv('');
  storageGroup.parent(document.querySelector('main'));
  storageGroup.addClass('radio-group');
  storageGroup.attribute('role', 'radiogroup');
  storageGroup.attribute('aria-label', 'Storage location');
  const lab = createSpan('Storage location:');
  lab.parent(storageGroup);
  storageRadio = createRadio('storage');
  storageRadio.parent(storageGroup);
  storageRadio.option('full', 'Full LRS');
  storageRadio.option('lite', 'LRS-Lite browser');
  storageRadio.selected('full');
  storageRadio.changed(() => { storage = storageRadio.value() || 'full'; updateDescription(); });

  liveRegion = createDiv('');
  liveRegion.parent(document.querySelector('main'));
  liveRegion.addClass('sr-only');
  liveRegion.attribute('aria-live', 'polite');

  layoutControls();
  describe('PII Surface Explorer.');
  updateDescription();
}

function draw() {
  updateCanvasSize();
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const narrow = canvasWidth < 560;
  // title and disclaimer
  noStroke();
  fill(INK);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  textSize(narrow ? 19 : 22);
  text('PII Surface Explorer', canvasWidth / 2, 8);
  textStyle(NORMAL);
  textAlign(LEFT, TOP);
  textSize(13);
  fill(MUTED);
  let y = wrapText('Illustrative statement from Chapter 24, with two context fields added. The classes follow the chapter\'s analysis; they are not a legal determination.',
    margin, 36, canvasWidth - 2 * margin, 16) + 6;

  // field boxes
  const rowH = narrow ? 39 : 50;
  rowRects = [];
  let hoverIdx = -1;
  FIELDS.forEach((f, i) => {
    const r = { x: margin, y: y, w: canvasWidth - 2 * margin, h: rowH - 5 };
    rowRects.push(r);
    const v = checked[i] ? verdictFor(i) : null;
    stroke(i === selected ? SEL : color(170));
    strokeWeight(i === selected ? 3 : 1);
    fill(v ? VERDICT[v].fill : color(255));
    rect(r.x, r.y, r.w, r.h, 6);
    strokeWeight(1);

    // line 1: path
    noStroke();
    fill(INK);
    textFont('monospace');
    textStyle(BOLD);
    textSize(13);
    text(f.path, r.x + 10, r.y + (narrow ? 3 : 6));
    textStyle(NORMAL);

    // right side of line 2: class tag and verdict
    textFont('sans-serif');
    textSize(13);
    let tag = chosen[i] ? classLabel(chosen[i]) : 'not classified';
    if (v) tag = VERDICT[v].sym + ' ' + VERDICT[v].word + ': ' + tag;
    const tagW = fontWidth(tag);
    fill(v ? VERDICT[v].ink : (chosen[i] ? INK : MUTED));
    textAlign(RIGHT, TOP);
    text(tag, r.x + r.w - 10, r.y + (narrow ? 19 : 24));
    textAlign(LEFT, TOP);

    // line 2: value, truncated with an ellipsis if it does not fit
    textFont('monospace');
    textSize(13);
    fill(INK);
    const avail = r.w - 20 - tagW - 16;
    const shown = fitText(f.value, avail);
    text(shown, r.x + 10, r.y + (narrow ? 19 : 24));
    f.truncated = shown !== f.value;
    textFont('sans-serif');

    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) hoverIdx = i;
    y += rowH;
  });

  // reason panel for the selected field
  y += 2;
  y = drawReasonPanel(y, narrow);

  // storage-location risks
  y += 6;
  drawRisks(y);

  // tooltip with the full value of a truncated field
  if (hoverIdx >= 0 && FIELDS[hoverIdx].truncated) drawTooltip(FIELDS[hoverIdx].value, mouseX, mouseY);
}

function drawReasonPanel(y, narrow) {
  const x = margin, w = canvasWidth - 2 * margin;
  const f = FIELDS[selected];
  // measure first so the panel fits its text
  textSize(13);
  const lines = [];
  lines.push({ t: 'Selected: ' + f.path, bold: true, ink: INK });
  if (f.truncated) lines.push({ t: 'Full value: ' + f.value, ink: INK });
  lines.push({ t: 'Your class: ' + classLabel(chosen[selected]), ink: INK });
  if (checked[selected]) {
    const v = verdictFor(selected);
    let msg;
    if (v === 'defensible') msg = VERDICT[v].sym + ' ' + f.altReason + ' The chapter\'s class is ' + classLabel(f.answer) + '.';
    else if (v === 'match') msg = VERDICT[v].sym + ' Match. ' + f.reason;
    else msg = VERDICT[v].sym + ' Mismatch. The chapter\'s class is ' + classLabel(f.answer) + '. ' + f.reason;
    lines.push({ t: msg, ink: VERDICT[v].ink });
  } else if (chosen[selected]) {
    lines.push({ t: 'Press Check my answers to compare with the chapter\'s analysis.', ink: MUTED });
  } else {
    lines.push({ t: 'Choose a class with the buttons below. Click a field, or focus the statement and use the arrow keys, to select it.', ink: MUTED });
  }
  const summary = summaryText();
  if (summary) lines.push({ t: summary, bold: true, ink: INK });

  let h = 10;
  lines.forEach(L => { textStyle(L.bold ? BOLD : NORMAL); h += countLines(L.t, w - 20) * 16 + 2; });
  textStyle(NORMAL);
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 6);
  noStroke();
  let yy = y + 6;
  lines.forEach(L => {
    fill(L.ink);
    textStyle(L.bold ? BOLD : NORMAL);
    yy = wrapText(L.t, x + 10, yy, w - 20, 16) + 2;
  });
  textStyle(NORMAL);
  return y + h;
}

function drawRisks(y) {
  const x = margin, w = canvasWidth - 2 * margin;
  noStroke();
  fill(INK);
  textSize(13);
  textStyle(BOLD);
  text('Extra risks where the statement is stored (' + (storage === 'full' ? 'Full LRS' : 'LRS-Lite browser') + '):', x, y);
  textStyle(NORMAL);
  y += 18;
  RISKS[storage].forEach(r => {
    fill(INK);
    text('•', x + 4, y);
    y = wrapText(r, x + 16, y, w - 16, 16) + 1;
  });
}

function drawTooltip(str, mx, my) {
  textFont('monospace');
  textSize(12);
  const w = Math.min(canvasWidth - 20, fontWidth(str) + 16);
  const lines = countLines(str, w - 16);
  const h = lines * 15 + 10;
  let tx = constrain(mx - w / 2, 8, canvasWidth - w - 8);
  let ty = my + 18;
  if (ty + h > drawHeight - 4) ty = my - h - 10;
  stroke(90);
  fill(255, 255, 225);
  rect(tx, ty, w, h, 4);
  noStroke();
  fill(INK);
  textAlign(LEFT, TOP);
  wrapText(str, tx + 8, ty + 5, w - 16, 15);
  textFont('sans-serif');
}

// ---------- logic ----------
function verdictFor(i) {
  const c = chosen[i];
  const f = FIELDS[i];
  if (c === f.answer) return 'match';
  if (c && c === f.alt) return 'defensible';
  return 'mismatch';
}

function summaryText() {
  if (!checked.some(Boolean)) return '';
  let m = 0, d = 0, x = 0, un = 0, nc = 0;
  FIELDS.forEach((f, i) => {
    if (chosen[i] === null) { nc++; return; }
    if (!checked[i]) { un++; return; }
    const v = verdictFor(i);
    if (v === 'match') m++; else if (v === 'defensible') d++; else x++;
  });
  return 'Checked: ' + m + ' match, ' + d + ' defensible, ' + x + ' mismatch' + (un ? ', ' + un + ' changed' : '') + (nc ? ', ' + nc + ' not classified' : '') + '.';
}

function assignClass(id) {
  chosen[selected] = id;
  checked[selected] = false;       // a changed answer must be checked again
  liveRegion.html(FIELDS[selected].path + ': ' + classLabel(id));
  updateDescription();
}

function checkAnswers() {
  checked = FIELDS.map((f, i) => chosen[i] !== null);
  const s = summaryText() || 'No fields classified yet.';
  const unclassified = chosen.filter(c => c === null).length;
  liveRegion.html(s + (unclassified ? ' ' + unclassified + ' fields are not classified yet.' : ''));
  updateDescription();
}

function statementKeyDown(e) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { selected = (selected + 1) % FIELDS.length; e.preventDefault(); announceSelection(); }
  else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { selected = (selected + FIELDS.length - 1) % FIELDS.length; e.preventDefault(); announceSelection(); }
  else if (['1', '2', '3', '4'].includes(e.key)) { assignClass(CLASSES[Number(e.key) - 1].id); e.preventDefault(); }
}

function announceSelection() {
  liveRegion.html('Selected ' + FIELDS[selected].path + ', value ' + FIELDS[selected].value + ', class ' + classLabel(chosen[selected]));
}

function mousePressed() {
  for (let i = 0; i < rowRects.length; i++) {
    const r = rowRects[i];
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) {
      selected = i;
      updateDescription();
      return;
    }
  }
}

function updateDescription() {
  const parts = FIELDS.map((f, i) => f.path + ' ' + classLabel(chosen[i]) +
    (checked[i] ? ' (' + VERDICT[verdictFor(i)].word + ')' : ''));
  describe('PII Surface Explorer. An illustrative xAPI statement shown as eight fields, each with the learner\'s current classification: ' +
    parts.join('; ') + '. Selected field: ' + FIELDS[selected].path + '. Storage location: ' +
    (storage === 'full' ? 'Full LRS' : 'LRS-Lite browser') + '. Classes follow Chapter 24\'s analysis, not a legal determination.');
}

// ---------- layout helpers ----------
function layoutControls() {
  if (!storageGroup) return;
  const items = classButtons.concat([checkButton, storageGroup]);
  const gap = 10, left = margin, right = canvasWidth - margin;
  let x = left, row = 0;
  const placed = [];
  items.forEach(el => {
    const w = el.elt.offsetWidth;
    if (x > left && x + w > right) { row++; x = left; }
    placed.push({ el, x, row });
    x += w + gap;
  });
  const rows = row + 1;
  controlHeight = rows * ROW_H + 12;
  drawHeight = canvasHeight - controlHeight;
  placed.forEach(p => p.el.position(p.x, drawHeight + 10 + p.row * ROW_H));
}

function fitText(str, w) {
  if (fontWidth(str) <= w) return str;
  let s = str;
  while (s.length > 4 && fontWidth(s + '…') > w) s = s.slice(0, -1);
  return s + '…';
}

function countLines(str, w) {
  const words = str.split(' ');
  let line = '', n = 0;
  for (const word of words) {
    const t = line ? line + ' ' + word : word;
    if (fontWidth(t) > w && line) { n++; line = word; } else line = t;
  }
  return n + (line ? 1 : 0);
}

function wrapText(str, x, y, w, lh) {
  const words = str.split(' ');
  let line = '';
  for (const word of words) {
    const t = line ? line + ' ' + word : word;
    if (fontWidth(t) > w && line) { text(line, x, y); y += lh; line = word; } else line = t;
  }
  if (line) { text(line, x, y); y += lh; }
  return y;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  layoutControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.max(300, container.offsetWidth);
}
