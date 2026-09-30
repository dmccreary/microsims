// Contract Violation Finder - critique candidate xAPI statements against the producer contract
// CANVAS_HEIGHT: 800
// Learning objective (Evaluate / critique): the learner critiques a candidate xAPI statement
// against the producer contract's rules and justifies each violation by section number
// (Chapter 16, "The Producer Contract").
// Eight candidate statements carry 0-3 planted violations (12 in all). Click a JSON row to flag
// it, then click one or more rules (sections 1-9) to justify the flag. "Check my answer" marks each
// flag correct, missed or false alarm and explains the rule; the score runs across the set.

// ---------- Canvas dimensions ----------
// Fixed total height; the split between drawing and control regions is recomputed when the
// control rows wrap on narrow screens (drawHeight + controlHeight is always 800).
let canvasWidth = 800;
let canvasHeight = 800;
let controlHeight = 86;
let drawHeight = canvasHeight - controlHeight;
let margin = 12;
let defaultTextSize = 16;

// ---------- Colors: Okabe-Ito color-blind-safe palette (darkened where white text sits on it) ----------
const C_FLAG = [0, 114, 178];       // blue: a flag and its linked rules, before checking
const C_RIGHT = [0, 120, 90];       // bluish green: correct
const C_FALSE = [200, 82, 0];       // vermillion: false alarm
const C_MISSED = [150, 70, 130];    // reddish purple: missed
const C_FLAG_BG = [222, 236, 247];

// ---------- Vocabulary ----------
const SITE = 'https://dmccreary.github.io/microsims/';
const GROUPING = SITE + 'textbook/microsims/v2.0.0';
const VERB = 'http://adlnet.gov/expapi/verbs/';
const ACT = 'http://adlnet.gov/expapi/activities/';
const EXT = 'https://w3id.org/lrs/ext/';

// ---------- The nine rules (section numbers from the contract's digest) ----------
const RULES = [
  { n: 1, short: 'Page IRI', text: 'A page IRI is the canonical site URL plus the navigation path, with a trailing slash; never main.html, never local.' },
  { n: 2, short: 'Fragment', text: 'A sub-activity fragment is its stable local name; fixed-order questions are #q{N}, one-based.' },
  { n: 3, short: 'Verbs', text: 'Exactly three verbs; answered needs success, experienced needs duration.' },
  { n: 4, short: 'Grouping', text: 'grouping[0] is the textbook version IRI on every statement; parent[0] is the page for answers and controls.' },
  { n: 5, short: 'Types', text: 'Four object types: Page, MicroSim, Question, Control; one object, one type.' },
  { n: 6, short: 'Concept', text: 'One concept identifier per statement, in the concept ID extension.' },
  { n: 7, short: 'Runs', text: 'One experienced per run, emitted on Pause; nothing under 250 ms.' },
  { n: 8, short: 'Store fields', text: 'Producers never send district_id, student_key, stored_at, section_id, voided_by or provisional.' },
  { n: 9, short: 'Transport', text: 'A JSON array sent by POST, accepted or rejected as a whole.' }
];

// ---------- Candidate statements ----------
// Each line: [text, part, key, violations]. part/key are set only on clickable field rows.
// violations: [[rule, one-sentence explanation], ...]
function ctx(parent, concept) {
  const L = [
    ['  "context": {'],
    ['    "contextActivities": {'],
    ['      "grouping": [{"id": "' + GROUPING + '"}]' + (parent ? ',' : ''), 'context', 'grouping']
  ];
  if (parent) L.push(['      "parent": [{"id": "' + parent + '"}]', 'context', 'parent']);
  L.push(['    },']);
  L.push(['    "extensions": {"' + EXT + 'concept_id": "' + concept + '"}', 'context', 'concept']);
  L.push(['  },']);
  return L;
}
const TS = ['  "timestamp": "2026-07-16T14:22:03Z"', 'housekeeping', 'timestamp'];

const STATEMENTS = [
  { scenario: 'A learner moves the Speed slider from 3 to 4 on the Bouncing Ball MicroSim.',
    lines: [
      ['{'],
      ['  "verb": {"id": "' + VERB + 'interacted"},', 'verb', 'verb'],
      ['  "object": {'],
      ['    "id": "' + SITE + 'sims/bouncing-ball/#speed-slider",', 'object', 'object.id'],
      ['    "definition": {"type": "' + ACT + 'simulation"}', 'object', 'object type',
        [[5, 'A slider is a Control, typed interaction; simulation is the type of the MicroSim page itself, and one object has one type.']]],
      ['  },'],
      ['  "result": {"extensions": {"' + EXT + 'value": 4, "' + EXT + 'previous-value": 3}},', 'result', 'result'],
      ['  "context": {'],
      ['    "contextActivities": {'],
      ['      "grouping": [{"id": "' + GROUPING + '"}],', 'context', 'grouping'],
      ['      "parent": [{"id": "' + SITE + 'sims/bouncing-ball"}]', 'context', 'parent',
        [[1, 'The page IRI needs its trailing slash: .../bouncing-ball and .../bouncing-ball/ are different strings to a store that groups by identifier.']]],
      ['    },'],
      ['    "extensions": {"' + EXT + 'concept_id": "adjustable-speed"}', 'context', 'concept'],
      ['  },'],
      TS, ['}']
    ] },
  { scenario: 'A learner presses Start and then Pause 40 seconds later. The author was previewing the book locally with mkdocs serve.',
    lines: [
      ['{'],
      ['  "verb": {"id": "' + VERB + 'experienced"},', 'verb', 'verb'],
      ['  "object": {'],
      ['    "id": "http://127.0.0.1:8000/sims/bouncing-ball/",', 'object', 'object.id',
        [[1, 'The IRI must start with the canonical site_url, never the local preview address, so test traffic and real traffic name the same page.']]],
      ['    "definition": {"type": "' + ACT + 'simulation"}', 'object', 'object type'],
      ['  },'],
      ['  "result": {"extensions": {"' + EXT + 'run-ended-by": "paused"}},', 'result', 'result',
        [[3, 'An experienced statement must carry result.duration; the elapsed time of the run is the whole point of the statement.']]],
      ...ctx(null, 'motion'),
      TS, ['}']
    ] },
  { scenario: 'A learner answers the Animal Cell quiz item about the nucleus correctly. The quiz order is reshuffled on every load.',
    lines: [
      ['{'],
      ['  "verb": {"id": "' + VERB + 'answered"},', 'verb', 'verb'],
      ['  "object": {'],
      ['    "id": "' + SITE + 'sims/animal-cell/#q-nucleus",', 'object', 'object.id'],
      ['    "definition": {"type": "' + ACT + 'cmi.interaction"}', 'object', 'object type'],
      ['  },'],
      ['  "result": {"success": true, "response": "nucleus"},', 'result', 'result'],
      ...ctx(SITE + 'sims/animal-cell/', 'cell-nucleus'),
      TS, ['}']
    ] },
  { scenario: 'An older emitter reports that a learner finished the Sine Wave MicroSim after 2 minutes 10 seconds.',
    lines: [
      ['{'],
      ['  "verb": {"id": "' + VERB + 'completed"},', 'verb', 'verb',
        [[3, 'Only answered, experienced and interacted are valid in version 1; completed carries no success, so every attempt count would read zero.']]],
      ['  "object": {'],
      ['    "id": "' + SITE + 'sims/sine-wave/",', 'object', 'object.id'],
      ['    "definition": {"type": "' + ACT + 'simulation"}', 'object', 'object type'],
      ['  },'],
      ['  "result": {"duration": "PT2M10S"},', 'result', 'result'],
      ['  "context": {'],
      ['    "contextActivities": {},', 'context', 'contextActivities',
        [[4, 'grouping[0], the textbook version IRI, is required on every statement so the statement can be tied to the content it described.']]],
      ['    "extensions": {"' + EXT + 'concept_id": "sine-wave"}', 'context', 'concept'],
      ['  },'],
      TS, ['}']
    ] },
  { scenario: 'A learner answers an Animal Cell quiz item. The quiz is reshuffled on every load; this learner saw the item third.',
    lines: [
      ['{'],
      ['  "verb": {"id": "' + VERB + 'answered"},', 'verb', 'verb'],
      ['  "object": {'],
      ['    "id": "' + SITE + 'sims/animal-cell/#q3",', 'object', 'object.id',
        [[2, 'In a shuffled quiz a position is not an identity: the fragment must name what the item asks about, such as #q-mitochondrion.']]],
      ['    "definition": {"type": "' + ACT + 'cmi.interaction"}', 'object', 'object type'],
      ['  },'],
      ['  "result": {"response": "mitochondrion"},', 'result', 'result',
        [[3, 'An answered statement must carry success; without it the store counts zero attempts and the answer cannot inform a mastery estimate.']]],
      ...ctx(SITE + 'sims/animal-cell/', 'cell-mitochondrion'),
      TS, ['}']
    ] },
  { scenario: 'A learner presses Start and then presses Pause 120 milliseconds later.',
    lines: [
      ['{'],
      ['  "verb": {"id": "' + VERB + 'experienced"},', 'verb', 'verb'],
      ['  "object": {'],
      ['    "id": "' + SITE + 'sims/bouncing-ball/",', 'object', 'object.id'],
      ['    "definition": {"type": "' + ACT + 'simulation"}', 'object', 'object type'],
      ['  },'],
      ['  "result": {"duration": "PT0.12S", "extensions": {"' + EXT + 'run-ended-by": "paused"}},', 'result', 'result',
        [[7, 'A run under 250 ms is a mis-click and must produce no experienced statement; zero-length rows would pollute the dwell total.']]],
      ...ctx(null, 'motion'),
      TS, ['}']
    ] },
  { scenario: 'A hand-written emitter reports a learner moving the Amplitude slider on the Sine Wave MicroSim from 2 to 2.5.',
    lines: [
      ['{'],
      ['  "verb": {"id": "' + VERB + 'interacted"},', 'verb', 'verb'],
      ['  "object": {'],
      ['    "id": "' + SITE + 'sims/sine-wave/main.html",', 'object', 'object.id',
        [[1, 'main.html is the iframe payload file; the page IRI ends at the navigation path with a trailing slash, or one page gains two identifiers.'],
         [2, 'A slider is a sub-activity, so its IRI needs a fragment with its stable name, such as #amplitude-slider.']]],
      ['    "definition": {"type": "' + ACT + 'simulation"}', 'object', 'object type',
        [[5, 'A slider is a Control, typed interaction, not a MicroSim; one object, one type.']]],
      ['  },'],
      ['  "result": {"extensions": {"' + EXT + 'value": 2.5, "' + EXT + 'previous-value": 2}},', 'result', 'result'],
      ...ctx(SITE + 'sims/sine-wave/', 'amplitude'),
      TS, ['}']
    ] },
  { scenario: 'A learner rests the pointer on the nucleus hotspot of the Animal Cell MicroSim for 1.4 seconds.',
    lines: [
      ['{'],
      ['  "verb": {"id": "' + VERB + 'interacted"},', 'verb', 'verb'],
      ['  "object": {'],
      ['    "id": "' + SITE + 'sims/animal-cell/#nucleus",', 'object', 'object.id'],
      ['    "definition": {"type": "' + ACT + 'interaction"}', 'object', 'object type'],
      ['  },'],
      ['  "result": {"duration": "PT1.4S", "extensions": {"' + EXT + 'engagement-mode": "hover"}},', 'result', 'result'],
      ...ctx(SITE + 'sims/animal-cell/', 'cell-nucleus'),
      TS, ['}']
    ] }
];

// ---------- State ----------
let si = 0;                 // statement index (8 = summary)
let flags = {};             // row index -> Set of rule numbers
let activeRow = -1;
let checked = false;
let hintPart = null;
let message = '';
let totals = { found: 0, missed: 0, falseAlarm: 0 };
let results = null;         // grading of the current statement
let rowRects = [];
let ruleRects = [];

// controls
let checkButton, hintButton, nextButton, clearButton, rowSelect, ruleSelect, linkButton;
let controlItems = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('sans-serif');
  const main = document.querySelector('main');

  checkButton = createButton('Check my answer');
  checkButton.mousePressed(checkAnswer);
  hintButton = createButton('Show hint');
  hintButton.mousePressed(showHint);
  nextButton = createButton('Next statement');
  nextButton.mousePressed(nextStatement);
  clearButton = createButton('Clear flags');
  clearButton.mousePressed(clearFlags);
  rowSelect = createSelect();
  ruleSelect = createSelect();
  for (const r of RULES) ruleSelect.option('Section ' + r.n + ': ' + r.short, r.n);
  linkButton = createButton('Flag row with rule');
  linkButton.mousePressed(linkFromSelects);
  controlItems = [checkButton, hintButton, nextButton, clearButton, rowSelect, ruleSelect, linkButton];
  for (const c of controlItems) c.parent(main);

  loadStatement(0);
  describe('Contract Violation Finder. A candidate xAPI statement is shown as JSON, one field per row, ' +
    'beside the nine rules of the producer contract. Click a row to flag it and click rules to justify ' +
    'the flag, or use the Row and Rule dropdowns with the Flag row with rule button. Check my answer ' +
    'marks each flag correct, missed or false alarm and explains the rule. Eight statements in all.');
}

function loadStatement(i) {
  si = i;
  flags = {};
  activeRow = -1;
  checked = false;
  hintPart = null;
  results = null;
  message = si < STATEMENTS.length ? 'Click a row that breaks a rule, then click the rule it breaks.' : '';
  // rebuild the row dropdown for this statement
  rowSelect.elt.innerHTML = '';
  if (si < STATEMENTS.length) {
    STATEMENTS[si].lines.forEach((ln, k) => { if (ln[2]) rowSelect.option('Row: ' + ln[2], k); });
  }
  updateButtons();
}

function updateButtons() {
  const live = si < STATEMENTS.length;
  setEnabled(checkButton, live && !checked);
  setEnabled(hintButton, live && !checked);
  setEnabled(clearButton, live && !checked);
  setEnabled(linkButton, live && !checked);
  setEnabled(rowSelect, live && !checked);
  setEnabled(ruleSelect, live && !checked);
  nextButton.html(!live ? 'Start over' : (si === STATEMENTS.length - 1 ? 'See summary' : 'Next statement'));
  layoutControls();
}

function setEnabled(el, on) {
  if (on) el.removeAttribute('disabled'); else el.attribute('disabled', '');
}

// ---------- Actions ----------
function clickRow(k) {
  if (checked) return;
  if (!flags[k]) { flags[k] = new Set(); activeRow = k; message = 'Row flagged. Now click the rule (section) it breaks.'; }
  else if (activeRow === k) { delete flags[k]; activeRow = -1; message = 'Flag removed.'; }
  else { activeRow = k; message = 'Flag selected. Click rules to link or unlink them.'; }
}

function toggleRule(n) {
  if (checked) return;
  if (activeRow < 0 || !flags[activeRow]) { message = 'Click a row first to flag it, then choose the rule.'; return; }
  const s = flags[activeRow];
  if (s.has(n)) s.delete(n); else s.add(n);
  message = 'Row "' + STATEMENTS[si].lines[activeRow][2] + '" linked to ' + (s.size ? [...s].sort().map(v => 'section ' + v).join(', ') : 'no rule yet') + '.';
}

function linkFromSelects() {
  const k = int(rowSelect.value());
  const n = int(ruleSelect.value());
  if (!flags[k]) flags[k] = new Set();
  activeRow = k;
  toggleRule(n);
}

function clearFlags() {
  flags = {};
  activeRow = -1;
  message = 'All flags cleared.';
}

function showHint() {
  const st = STATEMENTS[si];
  for (let k = 0; k < st.lines.length; k++) {
    const v = st.lines[k][3];
    if (!v) continue;
    for (const [n] of v) {
      if (!(flags[k] && flags[k].has(n))) {
        hintPart = st.lines[k][1];
        message = 'Hint: at least one violation you have not justified lies in the highlighted ' + hintPart + ' section.';
        return;
      }
    }
  }
  hintPart = null;
  message = st.lines.some(l => l[3])
    ? 'Hint: every planted violation already has a flag with the right rule. Check for false alarms.'
    : 'Hint: no section stands out. Test every row against the nine rules before you decide.';
}

function checkAnswer() {
  if (checked || si >= STATEMENTS.length) return;
  const st = STATEMENTS[si];
  const res = { found: [], missed: [], falseAlarm: [] };
  for (let k = 0; k < st.lines.length; k++) {
    const ln = st.lines[k];
    const planted = (ln[3] || []).map(v => v[0]);
    const linked = flags[k] ? [...flags[k]] : [];
    for (const v of (ln[3] || [])) {
      if (linked.includes(v[0])) res.found.push({ k, n: v[0], why: v[1] });
      else res.missed.push({ k, n: v[0], why: v[1] });
    }
    for (const n of linked) if (!planted.includes(n)) res.falseAlarm.push({ k, n });
    if (flags[k] && linked.length === 0 && planted.length === 0) res.falseAlarm.push({ k, n: 0 });
  }
  results = res;
  checked = true;
  hintPart = null;
  activeRow = -1;
  totals.found += res.found.length;
  totals.missed += res.missed.length;
  totals.falseAlarm += res.falseAlarm.length;
  const planted = res.found.length + res.missed.length;
  message = planted === 0
    ? (res.falseAlarm.length ? 'This statement was valid: every flag is a false alarm.' : 'Right: this statement follows every rule.')
    : 'Found ' + res.found.length + ' of ' + planted + ' planted violation' + (planted > 1 ? 's' : '') +
      (res.falseAlarm.length ? ', with ' + res.falseAlarm.length + ' false alarm' + (res.falseAlarm.length > 1 ? 's' : '') : '') + '.';
  updateButtons();
}

function nextStatement() {
  if (si >= STATEMENTS.length) {
    totals = { found: 0, missed: 0, falseAlarm: 0 };
    loadStatement(0);
    return;
  }
  loadStatement(si + 1);
}

// ---------- Layout ----------
function narrow() { return canvasWidth < 600; }

function layoutControls() {
  const rowH = 36;
  let x = 10, row = 0;
  const pos = [];
  for (const el of controlItems) {
    const w = el.elt.offsetWidth || 100;
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
  textSize(narrow() ? 19 : 22);
  text('Contract Violation Finder', margin, 8);
  textStyle(NORMAL);
  textSize(narrow() ? 13 : 15);
  textAlign(RIGHT, TOP);
  if (!narrow()) text('Statement ' + min(si + 1, 8) + ' of 8', canvasWidth - margin, 12);
  textAlign(LEFT, TOP);
  fill('dimgray');
  const scoreTxt = (narrow() ? 'Statement ' + min(si + 1, 8) + ' of 8   ' : '') +
    'Found ' + totals.found + '   Missed ' + totals.missed + '   False alarms ' + totals.falseAlarm;
  text(scoreTxt, margin, narrow() ? 34 : 38);

  if (si >= STATEMENTS.length) { drawSummary(); return; }

  const st = STATEMENTS[si];
  const top = narrow() ? 54 : 60;
  const bottomPanelH = narrow() ? (checked ? 170 : 142) : 0;
  const leftW = narrow() ? canvasWidth - 2 * margin : floor((canvasWidth - 2 * margin) * 0.6);
  // scenario caption
  fill('black');
  textSize(narrow() ? 13 : 14);
  textStyle(ITALIC);
  let y = drawWrapped('Scenario: ' + st.scenario, margin, top, leftW, narrow() ? 16 : 18);
  textStyle(NORMAL);
  // statement panel
  const panelTop = y + 4;
  const panelBottom = drawHeight - 8 - bottomPanelH - (narrow() ? 8 : 0) - 40;
  drawStatement(st, margin, panelTop, leftW, panelBottom - panelTop);
  // message strip under the statement
  const msgY = panelBottom + 4;
  fill(checked ? 'honeydew' : 'lightyellow');
  stroke('silver');
  rect(margin, msgY, leftW, 36, 6);
  noStroke();
  fill('black');
  textSize(narrow() ? 12 : 13);
  textAlign(LEFT, TOP);
  const ml = wrapWords(message, leftW - 16).slice(0, 2);
  const my = msgY + (ml.length === 1 ? 11 : 3);
  ml.forEach((l, i) => text(l, margin + 8, my + i * 15));

  // rules / findings panel
  if (narrow()) {
    const py = drawHeight - 8 - bottomPanelH;
    if (checked) drawFindings(margin, py, canvasWidth - 2 * margin, bottomPanelH);
    else drawRuleGrid(margin, py, canvasWidth - 2 * margin, bottomPanelH);
  } else {
    const px = margin + leftW + 10, pw = canvasWidth - margin - px;
    if (checked) drawFindings(px, 60, pw, drawHeight - 68);
    else drawRuleList(px, 60, pw, drawHeight - 68);
  }
}

function drawStatement(st, x, y, w, h) {
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 8);
  // choose the largest monospace size at which the whole statement fits the panel
  textFont('monospace');
  let fs = narrow() ? 11 : (canvasWidth >= 760 ? 14 : 13), lh = fs + 4, maxChars = 0;
  for (; fs >= 10; fs--) {
    textSize(fs);
    lh = fs + (fs >= 12 ? 4 : 3);
    maxChars = max(24, floor((w - 16) / fontWidth('M')));
    let n = 0;
    let extra = 0;
    st.lines.forEach((ln, k) => { n += wrapMono(ln[0], maxChars).length; if (rowBadges(k, ln).length) extra += 18; });
    if (n * lh + extra + 12 <= h) break;
  }
  rowRects = [];
  let ty = y + 6;
  st.lines.forEach((ln, k) => {
    const pieces = wrapMono(ln[0], maxChars);
    const badges = rowBadges(k, ln);
    const rh = pieces.length * lh + (badges.length ? 18 : 0);
    const clickable = !!ln[2];
    // row background: hint, active flag, flagged, graded
    noStroke();
    if (clickable && hintPart && ln[1] === hintPart) { fill(255, 215, 0, 90); rect(x + 3, ty - 1, w - 6, rh + 1, 3); }
    if (clickable && flags[k]) {
      fill(k === activeRow ? color(120, 180, 225, 150) : color(190, 220, 240, 130));
      rect(x + 3, ty - 1, w - 6, rh + 1, 3);
    }
    if (checked && ln[3]) {
      noFill();
      stroke(C_FALSE);
      strokeWeight(1.5);
      rect(x + 3, ty - 1, w - 6, rh + 1, 3);
      strokeWeight(1);
      noStroke();
    }
    if (clickable && !checked && isOver(x, ty - 1, w, rh + 1)) {
      noFill(); stroke('steelblue'); rect(x + 3, ty - 1, w - 6, rh + 1, 3); noStroke();
    }
    if (clickable) rowRects.push({ k, x, y: ty - 1, w, h: rh + 1 });
    ty = drawJsonLine(ln[0], maxChars, x + 8, ty, lh);
    // badges: linked rules (and results after checking), on their own line under the row
    if (badges.length) ty += 18;
    let bx = x + w - 8;
    textFont('sans-serif');
    textSize(11);
    for (let b = badges.length - 1; b >= 0; b--) {
      const bw = fontWidth(badges[b].t) + 10;
      bx -= bw;
      fill(badges[b].c);
      noStroke();
      rect(bx, ty - 17, bw, 15, 7);
      fill('white');
      textAlign(CENTER, CENTER);
      text(badges[b].t, bx + bw / 2, ty - 17 + 7.5);
      bx -= 4;
    }
    textAlign(LEFT, TOP);
    textFont('monospace');
    textSize(fs);
  });
  textFont('sans-serif');
}

function rowBadges(k, ln) {
  const out = [];
  const planted = (ln[3] || []).map(v => v[0]);
  const linked = flags[k] ? [...flags[k]].sort() : [];
  if (!checked) {
    if (flags[k] && linked.length === 0) out.push({ t: 'flagged', c: C_FLAG });
    for (const n of linked) out.push({ t: '§' + n, c: C_FLAG });
    return out;
  }
  for (const n of linked) out.push(planted.includes(n) ? { t: '§' + n + ' correct', c: C_RIGHT } : { t: '§' + n + ' false alarm', c: C_FALSE });
  if (flags[k] && linked.length === 0 && planted.length === 0) out.push({ t: 'false alarm', c: C_FALSE });
  for (const n of planted) if (!linked.includes(n)) out.push({ t: '§' + n + ' missed', c: C_MISSED });
  return out;
}

function drawRuleList(x, y, w, h) {
  ruleRects = [];
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textStyle(BOLD);
  textSize(15);
  text('Producer contract rules', x + 10, y + 8);
  textStyle(NORMAL);
  textSize(11);
  fill('dimgray');
  text(activeRow >= 0 ? 'Click rules to link them to the selected flag' : 'Flag a row first, then click its rule', x + 10, y + 27);
  let ty = y + 46;
  const linked = activeRow >= 0 && flags[activeRow] ? flags[activeRow] : new Set();
  const avail = h - 52;
  const big = canvasWidth >= 760;
  const lh = big ? 17 : 15;
  for (const r of RULES) {
    textSize(big ? 13.5 : 12);
    const lines = wrapWords(r.text, w - 50);
    const rh = max(lines.length * lh + 8, 26);
    const on = linked.has(r.n);
    const hover = isOver(x + 4, ty, w - 8, rh);
    stroke(on ? C_FLAG : (hover ? 'steelblue' : 'gainsboro'));
    fill(on ? C_FLAG_BG : 'white');
    rect(x + 4, ty, w - 8, rh - 3, 5);
    noStroke();
    fill(on ? C_FLAG : 'slategray');
    rect(x + 8, ty + 4, 26, 18, 4);
    fill('white');
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    text(r.n, x + 21, ty + 13);
    textStyle(NORMAL);
    textAlign(LEFT, TOP);
    fill('black');
    let ly = ty + 4;
    for (const l of lines) { text(l, x + 40, ly); ly += lh; }
    ruleRects.push({ n: r.n, x: x + 4, y: ty, w: w - 8, h: rh - 3 });
    ty += rh;
    if (ty > y + 52 + avail) break;
  }
}

function drawRuleGrid(x, y, w, h) {
  ruleRects = [];
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textSize(12);
  textStyle(BOLD);
  text('Rules (click to link to the selected flag)', x + 8, y + 6);
  textStyle(NORMAL);
  const linked = activeRow >= 0 && flags[activeRow] ? flags[activeRow] : new Set();
  const cols = 3, gw = (w - 16 - 8) / cols, gh = 24;
  let hovered = null;
  RULES.forEach((r, i) => {
    const cx = x + 8 + (i % cols) * (gw + 4), cy = y + 26 + floor(i / cols) * (gh + 4);
    const on = linked.has(r.n);
    const hover = isOver(cx, cy, gw, gh);
    if (hover) hovered = r;
    stroke(on ? C_FLAG : (hover ? 'steelblue' : 'gainsboro'));
    fill(on ? C_FLAG_BG : 'ghostwhite');
    rect(cx, cy, gw, gh, 5);
    noStroke();
    fill('black');
    textSize(12);
    textAlign(LEFT, CENTER);
    text('§' + r.n + ' ' + r.short, cx + 6, cy + gh / 2);
    ruleRects.push({ n: r.n, x: cx, y: cy, w: gw, h: gh });
  });
  textAlign(LEFT, TOP);
  fill('dimgray');
  textSize(11);
  const show = hovered || (activeRow >= 0 && linked.size ? RULES[[...linked][0] - 1] : null);
  drawWrapped(show ? '§' + show.n + ': ' + show.text : 'Hover a rule to read it in full.', x + 8, y + 26 + 3 * (gh + 4) + 2, w - 16, 13);
}

function drawFindings(x, y, w, h) {
  ruleRects = [];
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textStyle(BOLD);
  textSize(narrow() ? 13 : 15);
  text('Findings', x + 10, y + 8);
  textStyle(NORMAL);
  const st = STATEMENTS[si];
  let ty = y + (narrow() ? 26 : 32);
  const lh = narrow() ? 13 : 16;
  textSize(narrow() ? 11 : 13);
  const items = [];
  for (const f of results.found) items.push({ c: C_RIGHT, t: 'Correct, §' + f.n + ' on ' + st.lines[f.k][2] + ': ' + f.why });
  for (const f of results.missed) items.push({ c: C_MISSED, t: 'Missed, §' + f.n + ' on ' + st.lines[f.k][2] + ': ' + f.why });
  for (const f of results.falseAlarm) {
    items.push({ c: C_FALSE, t: 'False alarm on ' + st.lines[f.k][2] + (f.n ? ' (§' + f.n + ')' : '') + ': this row does not break ' + (f.n ? 'that rule.' : 'any rule.') });
  }
  if (items.length === 0) items.push({ c: C_RIGHT, t: 'No violations were planted and you flagged nothing. This statement follows all nine rules.' });
  for (const it of items) {
    fill(it.c);
    circle(x + 16, ty + lh / 2, 9);
    fill('black');
    ty = drawWrapped(it.t, x + 26, ty, w - 36, lh) + 5;
    if (ty > y + h - lh) break;
  }
  if (ty < y + h - 2 * lh && !narrow()) {
    fill('dimgray');
    drawWrapped('Press Next statement to continue.', x + 10, ty + 4, w - 20, lh);
  }
}

function drawSummary() {
  const x = margin, y = 70, w = canvasWidth - 2 * margin, h = drawHeight - 80;
  stroke('seagreen');
  strokeWeight(2);
  fill('honeydew');
  rect(x, y, w, h, 10);
  strokeWeight(1);
  noStroke();
  fill('black');
  textSize(narrow() ? 18 : 22);
  textStyle(BOLD);
  text('Set complete', x + 16, y + 16);
  textStyle(NORMAL);
  textSize(narrow() ? 14 : 16);
  const planted = totals.found + totals.missed;
  let ty = y + 56;
  const lh = narrow() ? 19 : 22;
  const lines = [
    'Violations found: ' + totals.found + ' of ' + planted + ' planted across eight statements.',
    'Violations missed: ' + totals.missed + '.   False alarms: ' + totals.falseAlarm + '.',
    'Two of the eight statements were valid. A careful critic justifies every flag with a section number and leaves a valid statement alone.',
    'Sections 6, 8 and 9 were never broken in this set: a single statement cannot break the transport rule, and every statement carried exactly one concept.',
    'Press Start over to try the set again.'
  ];
  for (const l of lines) ty = drawWrapped(l, x + 16, ty, w - 32, lh) + 8;
}

// ---------- Text helpers ----------
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

function wrapMono(s, maxChars) { return wrapParts(s, maxChars); }

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
  const cw = fontWidth('M');
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

function isOver(x, y, w, h) {
  return mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h;
}

// ---------- Mouse and keyboard ----------
function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight || si >= STATEMENTS.length || checked) return;
  for (const r of rowRects) {
    if (isOver(r.x, r.y, r.w, r.h)) { clickRow(r.k); return; }
  }
  for (const r of ruleRects) {
    if (isOver(r.x, r.y, r.w, r.h)) { toggleRule(r.n); return; }
  }
}

function keyPressed() {
  if (document.activeElement && document.activeElement.tagName === 'SELECT') return;
  if (key >= '1' && key <= '9') toggleRule(int(key));
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
