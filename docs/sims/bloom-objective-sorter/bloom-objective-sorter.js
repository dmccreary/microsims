// Bloom Objective Sorter
// CANVAS_HEIGHT: 560
// Sort 24 learning outcomes from this book's course description into the six Bloom levels
// with the three-step objective classification procedure. Ambiguous outcomes accept the
// plausible neighboring level as "defensible" when the learner picks the matching reason.

// ----- Standard MicroSim layout -----
let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let defaultTextSize = 16;

const LEVELS = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];
const LEVEL_FILL = ['lightcoral', 'sandybrown', 'khaki', 'lightgreen', 'lightskyblue', 'plum'];
const LEVEL_BORDER = ['firebrick', 'sienna', 'darkgoldenrod', 'seagreen', 'steelblue', 'purple'];
// Canonical verb table from Chapter 3 (used by procedure step 1)
const VERB_TABLE = [
  ['list', 'define', 'recall', 'identify', 'name', 'recognize', 'locate', 'describe'],
  ['explain', 'summarize', 'interpret', 'classify', 'compare', 'contrast', 'exemplify', 'infer'],
  ['use', 'execute', 'implement', 'solve', 'demonstrate', 'calculate', 'apply', 'practice'],
  ['differentiate', 'organize', 'attribute', 'compare', 'contrast', 'examine', 'deconstruct', 'distinguish'],
  ['judge', 'critique', 'assess', 'justify', 'prioritize', 'recommend', 'validate', 'defend'],
  ['design', 'construct', 'develop', 'formulate', 'compose', 'produce', 'invent', 'generate']
];

// 24 outcomes from docs/course-description.md, four per level.
// level: official level index; must: what the learner must do (procedure step 2);
// alt + reasons: for ambiguous outcomes, the defensible neighboring level and two written
// reasons (reasons[0] supports the official level, reasons[1] the neighbor).
const CARDS = [
  { text: 'Define a MicroSim and list its files (main.html, the JavaScript file, index.md, metadata.json)', level: 0,
    must: 'retrieve a definition and a list of file names', why: 'The learner reproduces a definition and a list exactly as taught; nothing new is built or judged.' },
  { text: 'Name the six levels of Bloom\'s 2001 Taxonomy and the verbs associated with each', level: 0,
    must: 'recall six names and their verbs', why: 'Naming the levels and verbs is exact retrieval from memory, the defining act of Remember.' },
  { text: 'List the MicroSim types in the catalog and the library that each type uses', level: 0,
    must: 'retrieve a list of types and libraries', why: 'The learner lists stored facts; correctness is checked against the catalog, item by item.' },
  { text: 'State the four parameters of a Bayesian knowledge tracing model (initial knowledge, learning, guess and slip)', level: 0,
    must: 'recall four named parameters', why: '"State" is not in the verb table, but the task is recalling four names, which is Remember.' },
  { text: 'Explain why an interactive MicroSim can teach more effectively than a static diagram, and when it cannot', level: 1,
    must: 'give reasons in their own words', why: 'Explaining why, including the exceptions, requires constructing meaning, not repeating a phrase.' },
  { text: 'Describe how a learning objective\'s Bloom level guides the choice of interaction pattern', level: 1,
    must: 'explain a relationship between two ideas', why: '"Describe" is listed under Remember, but here the learner must explain how one idea shapes another, which is Understand.' },
  { text: 'Summarize the differences between the full LRS and LRS-Lite in what each stores, what each preserves, and what each costs', level: 1,
    must: 'restate differences in their own words', why: 'Summarizing differences on stated dimensions is constructing meaning; no new case, judgment or product is required.' },
  { text: 'Explain what prediction fidelity means and why hover-only or very short interactions are excluded as evidence', level: 1,
    must: 'explain a meaning and a reason', why: 'The learner interprets a term and gives the reason for a rule, which is Understand.' },
  { text: 'Use an AI skill to generate a MicroSim of the type recommended by the routing rubric', level: 2,
    must: 'carry out a known procedure on a new objective', why: 'The learner runs a taught procedure (rubric then skill) in a new situation, the core of Apply.' },
  { text: 'Run the validation, height-sync, Playwright and layout-review tools and correct the defects they report', level: 2,
    must: 'execute tools and fix what they report', why: 'Running a known tool chain and applying its fixes is executing a procedure, so the course places it under Apply.',
    alt: 3, reasons: ['The learner executes a known sequence of tools and applies the fixes they point to.',
      'Correcting reported defects requires diagnosing how the layout, height and code relate.'] },
  { text: 'Search the MicroSim index for an existing example and reuse or adapt it rather than building a new one', level: 2,
    must: 'use a tool on a new need', why: 'The learner applies the search tool and the reuse procedure to a need they have not met before.' },
  { text: 'Add xAPI instrumentation to an existing MicroSim and map each interaction to a concept in a learning graph', level: 2,
    must: 'implement a taught procedure in an existing MicroSim', why: 'Instrumenting follows the runtime\'s documented steps, applied to a MicroSim the learner did not write.' },
  { text: 'Break a learning objective into concepts and decide which MicroSim interactions provide evidence for each', level: 3,
    must: 'take a whole apart and relate the parts', why: 'Breaking an objective into concepts and linking each to evidence is finding structure, which is Analyze.' },
  { text: 'Compare candidate MicroSim types for the same objective on diagnostic value, cognitive load and effort', level: 3,
    must: 'examine options on several dimensions and relate them', why: 'The learner breaks each type down on three dimensions and relates them; the outcome does not ask for a final verdict.',
    alt: 4, reasons: ['The learner breaks each type down on three dimensions and relates them without having to pick a winner.',
      'Weighing types against criteria such as diagnostic value and effort is a judgment against criteria.'] },
  { text: 'Examine an xAPI event stream and separate real evidence from noise (accidental clicks, idle time and guessing)', level: 3,
    must: 'separate a stream into kinds of events', why: 'Separating evidence from noise means sorting parts of a whole by their structure, which is Analyze.' },
  { text: 'Contrast what a Compact summary and a Full stream each reveal about the same student session', level: 3,
    must: 'work out what each format keeps or loses', why: 'The learner must work out which information each format keeps or loses about one session, not just restate differences.',
    alt: 1, reasons: ['The learner must work out what information each format keeps or loses about the same session.',
      '"Contrast" is also an Understand verb: the learner restates the differences in their own words.'] },
  { text: 'Judge a MicroSim against the quality score and against its stated learning objective', level: 4,
    must: 'judge against two stated criteria', why: 'The outcome supplies both criteria (quality score and objective) and asks for a judgment, which is Evaluate.' },
  { text: 'Critique a MicroSim\'s instrumentation for missing, redundant or misleading evidence', level: 4,
    must: 'judge and defend against criteria', why: 'A critique is a defended judgment against stated criteria: missing, redundant or misleading.' },
  { text: 'Appraise the privacy and equity risks of collecting learner data, and decide what a MicroSim should not record', level: 4,
    must: 'weigh risks and make a decision', why: 'Appraising risks and deciding what not to record is a judgment with consequences, which is Evaluate.' },
  { text: 'Distinguish claims that have been measured from those that are only designed or hoped for', level: 4,
    must: 'judge each claim against evidence criteria', why: 'The learner judges the strength of evidence behind each claim; judgment against criteria is Evaluate, although "distinguish" is an Analyze verb.',
    alt: 3, reasons: ['The learner judges the strength of evidence behind each claim against criteria.',
      'The learner separates the claims into two groups, which is breaking a whole into parts.'] },
  { text: 'Design an original MicroSim that pairs an interaction pattern with a measurable learning objective and a plan for the evidence it will produce', level: 5,
    must: 'produce something new', why: 'An original design combining pattern, objective and evidence plan is a new product, which is Create.' },
  { text: 'Produce a batch of MicroSims from specifications that pass the quality gate and the automated layout checks', level: 5,
    must: 'produce new MicroSims that meet a standard', why: 'Although a pipeline helps, the learner produces MicroSims that did not exist, so the course places it under Create.' },
  { text: 'Build a capstone portfolio of instrumented MicroSims and report on how well its event stream predicts mastery of its target concepts', level: 5,
    must: 'build a new portfolio and report on it', why: 'Building a portfolio and its report combines many elements into a new product.' },
  { text: 'Propose a design for a future AI-generated MicroSim that is both engaging and a better predictor of mastery, and state how the claim would be tested', level: 5,
    must: 'formulate a new design and test plan', why: 'Proposing a new design with a test plan is formulating something new, which is Create.' }
];

const PROCEDURE = [
  'Step 1. Find the verb and note the level or levels it suggests.',
  'Step 2. Ask what the learner must do: retrieve, construct meaning, use in a new case, take apart, judge against criteria, or produce something new.',
  'Step 3. If two levels remain plausible, choose the most demanding process the task truly requires, and record the reason.'
];

// ----- State -----
let order = [];
let pos = 0;              // index into order
let placed = -1;          // bin the current card was placed in (-1 = not yet)
let status = '';          // 'correct' | 'defensible' | 'missed' | 'reason' (waiting for reason)
let reasonChoice = -1;    // 0 or 1 once chosen
let reasonOrder = [0, 1]; // display order of the two reasons
let stepsShown = 0;       // procedure steps revealed
let score = { correct: 0, defensible: 0, missed: 0 };
let dragging = false;
let dragOffset = { x: 0, y: 0 };
let cardRect = { x: 0, y: 0, w: 0, h: 0 };
let binRects = [];
let reasonRects = [];
let procRect = null;
let finished = false;

// ----- Controls -----
let nextButton, restartButton, procedureBox;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  nextButton = createButton('Next card');
  nextButton.position(10, drawHeight + 8);
  nextButton.mousePressed(nextCard);

  restartButton = createButton('Restart');
  restartButton.position(98, drawHeight + 8);
  restartButton.mousePressed(restart);

  procedureBox = createCheckbox(' Show the procedure', false);
  procedureBox.position(178, drawHeight + 10);
  procedureBox.changed(() => { stepsShown = procedureBox.checked() ? 1 : 0; });

  restart();

  describe('Bloom objective sorter. A card at the top shows a learning outcome from the course ' +
    'description. The learner drags it into one of six bins, Remember through Create, or clicks a ' +
    'bin. Feedback highlights the verb, shows the official level and a rationale, and for ambiguous ' +
    'outcomes accepts the neighboring level as defensible when the learner picks the matching reason. ' +
    'An optional step-through shows the three-step classification procedure.', LABEL);
}

function restart() {
  order = shuffle([...Array(CARDS.length).keys()]);
  pos = 0;
  score = { correct: 0, defensible: 0, missed: 0 };
  finished = false;
  resetCard();
}

function resetCard() {
  placed = -1;
  status = '';
  reasonChoice = -1;
  reasonOrder = random() < 0.5 ? [0, 1] : [1, 0];
  stepsShown = procedureBox && procedureBox.checked() ? 1 : 0;
  dragging = false;
  updateButtons();
}

function updateButtons() {
  const ready = placed >= 0 && status !== 'reason';
  if (ready || finished) nextButton.removeAttribute('disabled');
  else nextButton.attribute('disabled', '');
}

function draw() {
  updateCanvasSize();

  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const narrow = canvasWidth < 500;
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(narrow ? 18 : 20);
  text('Bloom Objective Sorter', margin, 10);
  textSize(14);
  fill('dimgray');
  textAlign(RIGHT, TOP);
  text('Card ' + min(pos + 1, CARDS.length) + ' of ' + CARDS.length, canvasWidth - margin, 14);

  if (finished) {
    drawSummary();
    drawScore();
    return;
  }

  const card = CARDS[order[pos]];
  const binsTop = drawBins(narrow, card);
  drawLowerPanel(binsTop, narrow, card);
  drawCard(card, narrow);
  drawScore();
}

// ----- The outcome card (drawn last so a dragged card is on top) -----
function drawCard(card, narrow) {
  const w = canvasWidth - 2 * margin;
  const h = narrow ? 92 : 78;
  let x = margin, y = 38;
  if (dragging) {
    x = mouseX - dragOffset.x;
    y = mouseY - dragOffset.y;
  }
  cardRect = { x: margin, y: 38, w, h };
  const s = dragging ? 0.75 : 1;
  push();
  translate(x, y);
  scale(s);
  stroke(placed >= 0 ? LEVEL_BORDER[card.level] : 'dimgray');
  strokeWeight(2);
  fill('white');
  if (dragging) drawingContext.shadowBlur = 12;
  rect(0, 0, w, h, 10);
  drawingContext.shadowBlur = 0;
  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(LEFT, TOP);
  text(placed >= 0 ? 'OUTCOME' : 'OUTCOME  (drag me to a bin, or click a bin)', 12, 6);
  // highlight the verb (first word) after the drop or once step 1 is shown
  const showVerb = placed >= 0 || stepsShown >= 1;
  drawRichText(card.text, 12, 24, w - 24, narrow ? 15 : 16, showVerb ? 0 : -1);
  pop();
}

// Word-wrapped text with one highlighted word (index hi)
function drawRichText(str, x, y, w, size, hi) {
  textSize(size);
  textAlign(LEFT, TOP);
  const words = str.split(' ');
  const lh = size * 1.3;
  let cx = x, cy = y;
  const space = fontWidth(' ');
  for (let i = 0; i < words.length; i++) {
    if (i === hi) textStyle(BOLD);
    const ww = fontWidth(words[i]);
    textStyle(NORMAL);
    if (cx + ww > x + w && cx > x) { cx = x; cy += lh; }
    if (i === hi) {
      noStroke();
      fill('yellow');
      rect(cx - 2, cy - 1, ww + 4, lh, 3);
      fill('black');
      textStyle(BOLD);
      text(words[i], cx, cy);
      textStyle(NORMAL);
    } else {
      fill('black');
      text(words[i], cx, cy);
    }
    cx += ww + space;
  }
}

// ----- Six bins: 2 rows of 3, or 3 rows of 2 when narrow -----
function drawBins(narrow, card) {
  const cols = narrow ? 2 : 3;
  const gap = 8;
  const top = narrow ? 138 : 124;
  const bw = (canvasWidth - 2 * margin - (cols - 1) * gap) / cols;
  const bh = narrow ? 40 : 50;
  binRects = [];
  for (let i = 0; i < 6; i++) {
    const x = margin + (i % cols) * (bw + gap);
    const y = top + floor(i / cols) * (bh + gap);
    const over = dragging && mouseX > x && mouseX < x + bw && mouseY > y && mouseY < y + bh;
    const hover = !dragging && placed < 0 && mouseX > x && mouseX < x + bw && mouseY > y && mouseY < y + bh;
    let sw = 1.5, sc = LEVEL_BORDER[i];
    if (over || hover) { sw = 3; sc = 'black'; }
    fill(LEVEL_FILL[i]);
    stroke(sc);
    strokeWeight(sw);
    rect(x, y, bw, bh, 8);
    noStroke();
    fill('black');
    // label at the left once a result mark may appear on the right
    const marks = placed >= 0;
    textAlign(marks ? LEFT : CENTER, CENTER);
    textStyle(BOLD);
    textSize(narrow ? 15 : 17);
    text((i + 1) + '  ' + LEVELS[i], marks ? x + 10 : x + bw / 2, y + bh / 2);
    textStyle(NORMAL);
    // result marks
    if (placed >= 0 && status !== 'reason') {
      textSize(narrow ? 13 : 14);
      textAlign(RIGHT, CENTER);
      if (i === card.level) { fill('darkgreen'); text('✓ official', x + bw - 8, y + bh / 2); }
      else if (i === placed) { fill(status === 'defensible' ? 'darkgreen' : 'firebrick'); text(status === 'defensible' ? 'defensible' : '✗', x + bw - 8, y + bh / 2); }
      else if (card.alt === i) { fill('dimgray'); text('defensible', x + bw - 8, y + bh / 2); }
    } else if (placed === i) {
      textSize(14); textAlign(RIGHT, CENTER); fill('black'); text('placed', x + bw - 8, y + bh / 2);
    }
    binRects.push({ i, x, y, w: bw, h: bh });
  }
  const rows = 6 / cols;
  return top + rows * bh + (rows - 1) * gap;
}

// ----- Procedure (before the drop) or feedback (after) -----
function drawLowerPanel(top, narrow, card) {
  const x = margin, y = top + 10, w = canvasWidth - 2 * margin, h = drawHeight - y - 8;
  procRect = null;
  reasonRects = [];
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  const tw = w - 24;
  let cy = y + 10;
  const fs = narrow ? 14 : 15;

  if (placed < 0) {
    if (procedureBox.checked()) {
      procRect = { x, y, w, h };
      fill('black');
      textSize(fs);
      textStyle(BOLD);
      text('Classification procedure' + (stepsShown < 3 ? ' (click here for the next step)' : ''), x + 12, cy, tw);
      textStyle(NORMAL);
      cy += narrow ? 40 : 26;
      for (let s = 0; s < stepsShown; s++) {
        fill('black');
        textSize(fs);
        const lines = wrapCount(PROCEDURE[s], tw);
        text(PROCEDURE[s], x + 12, cy, tw);
        cy += lines * (fs + 4) + 2;
        fill('navy');
        const hint = stepHint(s, card);
        if (hint) {
          const hl = wrapCount(hint, tw - 16);
          text(hint, x + 28, cy, tw - 16);
          cy += hl * (fs + 4) + 6;
        }
      }
    } else {
      fill('dimgray');
      textSize(fs);
      text('Read the outcome, decide which level of thinking it demands, then drag the card into that bin or click the bin. ' +
        'Check "Show the procedure" to step through the three-step classification procedure first.', x + 12, cy, tw);
    }
    return;
  }

  // After the drop
  const verb = card.text.split(' ')[0];
  if (status === 'reason') {
    fill('black');
    textSize(fs);
    textStyle(BOLD);
    const q = 'This outcome is ambiguous. Which reason supports placing it under ' + LEVELS[placed] + '?';
    text(q, x + 12, cy, tw);
    textStyle(NORMAL);
    cy += wrapCount(q, tw) * (fs + 4) + 8;
    for (const r of reasonOrder) {
      const rt = card.reasons[r];
      const lines = wrapCount(rt, tw - 24);
      const rh = lines * (fs + 4) + 14;
      const hover = mouseX > x + 12 && mouseX < x + 12 + tw && mouseY > cy && mouseY < cy + rh;
      stroke(hover ? 'black' : 'steelblue');
      strokeWeight(hover ? 2 : 1);
      fill(hover ? 'lightcyan' : 'azure');
      rect(x + 12, cy, tw, rh, 8);
      noStroke();
      fill('black');
      text(rt, x + 24, cy + 7, tw - 24);
      reasonRects.push({ r, x: x + 12, y: cy, w: tw, h: rh });
      cy += rh + 8;
    }
    return;
  }

  let head, col;
  if (status === 'correct') { head = '✓ Correct: ' + LEVELS[card.level]; col = 'darkgreen'; }
  else if (status === 'defensible') { head = '✓ Defensible: the official level is ' + LEVELS[card.level] + ', and your reason supports ' + LEVELS[placed]; col = 'darkgreen'; }
  else { head = '✗ Not this time: you chose ' + LEVELS[placed] + '; the official level is ' + LEVELS[card.level]; col = 'firebrick'; }
  fill(col);
  textSize(fs);
  textStyle(BOLD);
  text(head, x + 12, cy, tw);
  textStyle(NORMAL);
  cy += wrapCount(head, tw) * (fs + 4) + 6;
  fill('black');
  const v = 'Verb: "' + verb + '" ' + verbLevelsText(verb) + '.';
  text(v, x + 12, cy, tw);
  cy += wrapCount(v, tw) * (fs + 4) + 4;
  text(card.why, x + 12, cy, tw);
  cy += wrapCount(card.why, tw) * (fs + 4) + 4;
  if (card.alt !== undefined && reasonChoice >= 0) {
    fill('dimgray');
    const rn = reasonChoice === 0 ? 'Your reason argues for ' + LEVELS[card.level] + '.' : 'Your reason argues for ' + LEVELS[card.alt] + '.';
    text(rn + (status === 'missed' ? ' It does not match your placement.' : ''), x + 12, cy, tw);
  }
}

function stepHint(s, card) {
  const verb = card.text.split(' ')[0];
  if (s === 0) return 'Verb: "' + verb + '" ' + verbLevelsText(verb) + '.';
  if (s === 1) return 'Here the learner must ' + card.must + '.';
  return '';
}

function verbLevelsText(verb) {
  const v = verb.toLowerCase();
  const lv = [];
  VERB_TABLE.forEach((list, i) => { if (list.includes(v)) lv.push(LEVELS[i]); });
  if (lv.length === 0) return 'is not in the verb table, so read what the task demands';
  return 'is listed under ' + lv.join(' and ');
}

function wrapCount(s, w) {
  const words = s.split(' ');
  let lines = 1, cur = '';
  for (const word of words) {
    const t = cur ? cur + ' ' + word : word;
    if (fontWidth(t) > w && cur) { lines++; cur = word; } else cur = t;
  }
  return lines;
}

function drawScore() {
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(canvasWidth < 500 ? 15 : 16);
  textStyle(BOLD);
  fill('darkgreen');
  let x = 10;
  const y = drawHeight + 58;
  const parts = [['Correct ' + score.correct, 'darkgreen'], ['Defensible ' + score.defensible, 'teal'],
    ['Missed ' + score.missed, 'firebrick']];
  for (const [t, c] of parts) {
    fill(c);
    text(t, x, y);
    x += fontWidth(t) + 20;
  }
  textStyle(NORMAL);
}

function drawSummary() {
  const x = margin, y = 40, w = canvasWidth - 2 * margin, h = drawHeight - 50;
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 10);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(20);
  textStyle(BOLD);
  text('All 24 outcomes sorted', x + 16, y + 16);
  textStyle(NORMAL);
  textSize(16);
  const total = score.correct + score.defensible;
  text('Correct: ' + score.correct + '   Defensible: ' + score.defensible + '   Missed: ' + score.missed, x + 16, y + 56, w - 32);
  text('You placed ' + total + ' of 24 outcomes at the official or a defensible level. ' +
    'For each miss, go back to step 2 of the procedure: what must the learner actually do?', x + 16, y + 90, w - 32);
  fill('dimgray');
  text('Press Restart to sort a new shuffle.', x + 16, y + 170, w - 32);
}

// ----- Interaction -----
function mousePressed() {
  if (finished || mouseY > drawHeight) return;
  // reason choice
  if (status === 'reason') {
    for (const rr of reasonRects) {
      if (inRect(rr)) { chooseReason(rr.r); return; }
    }
    return;
  }
  if (placed >= 0) return;
  // procedure step-through
  if (procRect && inRect(procRect) && stepsShown < 3) { stepsShown++; return; }
  // start dragging the card
  if (inRect(cardRect)) {
    dragging = true;
    dragOffset = { x: (mouseX - cardRect.x) * 0.75, y: (mouseY - cardRect.y) * 0.75 };
    return;
  }
  // click a bin
  for (const b of binRects) if (inRect(b)) { place(b.i); return; }
}

function mouseReleased() {
  if (!dragging) return;
  dragging = false;
  for (const b of binRects) if (inRect(b)) { place(b.i); return; }
}

function inRect(r) {
  return mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h;
}

function place(bin) {
  const card = CARDS[order[pos]];
  placed = bin;
  if (card.alt !== undefined && (bin === card.level || bin === card.alt)) {
    status = 'reason';     // ask for a reason before scoring
  } else if (bin === card.level) {
    status = 'correct';
    score.correct++;
  } else {
    status = 'missed';
    score.missed++;
  }
  updateButtons();
}

function chooseReason(r) {
  const card = CARDS[order[pos]];
  reasonChoice = r;
  const supports = r === 0 ? card.level : card.alt;
  if (placed === card.level) { status = 'correct'; score.correct++; }
  else if (supports === placed) { status = 'defensible'; score.defensible++; }
  else { status = 'missed'; score.missed++; }
  updateButtons();
}

function nextCard() {
  if (finished) return;
  if (pos + 1 >= CARDS.length) { finished = true; updateButtons(); return; }
  pos++;
  resetCard();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.floor(container.getBoundingClientRect().width);
  }
}
