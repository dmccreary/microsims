// xAPI Statement Field Explorer
// CANVAS_HEIGHT: 670
// Click any line of a formatted xAPI statement to highlight the part it
// belongs to (actor, verb, object, result, context, or the housekeeping
// fields id and timestamp) and read which question that part answers.
// Three statements follow Chapter 16: an answered question, an interacted
// slider and an experienced run. "Quiz me" hides the colors and asks for
// the line that carries a named property.

// ---------- canvas layout ----------
let canvasWidth = 400;
let drawHeight = 620;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let sliderLeftMargin = 90;   // left edge of the Statement select
let defaultTextSize = 16;

// ---------- controls ----------
let statementSelect, quizCheckbox, nextButton;

// ---------- the five parts plus housekeeping ----------
const PARTS = {
  actor: { name: 'Actor', q: 'Who?', color: [0, 114, 178],
    def: 'The learner (or occasionally a group) the action belongs to, identified by exactly one inverse functional identifier. MicroSim statements use the account form: a homePage plus a name.' },
  verb: { name: 'Verb', q: 'Did what?', color: [230, 159, 0],
    def: 'The action the actor performed, named by an IRI such as http://adlnet.gov/expapi/verbs/answered, with a display label. Stores index and match on the IRI, never on the label.' },
  object: { name: 'Object', q: 'To what?', color: [0, 158, 115],
    def: 'The thing acted upon. In a MicroSim statement it is always an activity: an IRI identifier, a definition with a human-readable name, and a type (Page, MicroSim, Question or Control).' },
  result: { name: 'Result', q: 'How did it go?', color: [204, 121, 167],
    def: 'The outcome of the action: success, score.scaled, response, duration and extensions. Optional in xAPI; which fields are required depends on the verb.' },
  context: { name: 'Context', q: 'In what setting?', color: [213, 94, 0],
    def: 'Where the action happened. contextActivities holds the textbook version (grouping, required on every statement) and the page a question or control belongs to (parent); extensions carry the concept identifier.' },
  housekeeping: { name: 'Housekeeping (id, timestamp)', q: 'Which statement, and when?', color: [120, 120, 120],
    def: 'Not one of the five parts. The id is a UUID that names the statement itself; the timestamp is the moment the learner acted, written in ISO 8601 by the producer. The store stamps its own received time later.' }
};

// ---------- the three statements ----------
// Each line: [indent, text, part, tooltip, quiz key]
const SITE = 'https://dmccreary.github.io/learning-record-store';
const STATEMENTS = {
  answered: {
    label: 'answered',
    lines: [
      [0, '{', null, ''],
      [1, '"id": "8c9f2e4b-6d1a-4f3c-9b7e-2a5d0c1e3f47",', 'housekeeping', 'A UUID naming this statement, so a store can spot a duplicate.', 'id'],
      [1, '"actor": {', 'actor', 'Opens the actor: who did it.'],
      [2, '"objectType": "Agent",', 'actor', 'The actor is one person (an Agent), not a Group.'],
      [2, '"account": {', 'actor', 'The account form of identifier: a homePage plus a name.'],
      [3, '"homePage": "https://demo.example.edu",', 'actor', 'The system the learner\'s account lives in.', 'homePage'],
      [3, '"name": "student-0042"', 'actor', 'The learner\'s account name in that system (the store derives the pseudonym).', 'account'],
      [2, '}', 'actor', 'Closes the account.'],
      [1, '},', 'actor', 'Closes the actor.'],
      [1, '"verb": {', 'verb', 'Opens the verb: what the actor did.'],
      [2, '"id": "http://adlnet.gov/expapi/verbs/answered",', 'verb', 'The verb IRI. Stores match on this, never on the label.', 'verbId'],
      [2, '"display": {"en-US": "answered"}', 'verb', 'A human-readable label for the verb.', 'display'],
      [1, '},', 'verb', 'Closes the verb.'],
      [1, '"object": {', 'object', 'Opens the object: what was acted on.'],
      [2, '"objectType": "Activity",', 'object', 'The object is an activity.'],
      [2, '"id": "' + SITE + '/sims/lrs-data-model/#q2",', 'object', 'The activity IRI: the page address plus #q2 for question 2.', 'objId'],
      [2, '"definition": {', 'object', 'Opens the activity definition.'],
      [3, '"type": "http://adlnet.gov/expapi/activities/cmi.interaction",', 'object', 'cmi.interaction: the object is a Question.', 'objType'],
      [3, '"name": {"en-US": "How many PageEngagement vertices exist?"}', 'object', 'The question\'s human-readable name.', 'objName'],
      [2, '}', 'object', 'Closes the definition.'],
      [1, '},', 'object', 'Closes the object.'],
      [1, '"result": {', 'result', 'Opens the result: how it went.'],
      [2, '"score": {"scaled": 0.9},', 'result', 'A partial score from 0.0 to 1.0.', 'score'],
      [2, '"success": true,', 'result', 'Right or wrong. Its presence makes this an attempt.', 'success'],
      [2, '"duration": "PT4M12S"', 'result', 'How long it took: 4 minutes 12 seconds (ISO 8601).', 'duration'],
      [1, '},', 'result', 'Closes the result.'],
      [1, '"context": {', 'context', 'Opens the context: the setting.'],
      [2, '"contextActivities": {', 'context', 'Related activities, in named buckets.'],
      [3, '"grouping": [{"id": "' + SITE + '/textbook/lrs/v1.0.0"}],', 'context', 'grouping: the textbook version being read (required).', 'grouping'],
      [3, '"parent": [{"id": "' + SITE + '/sims/lrs-data-model/"}]', 'context', 'parent: the page this question belongs to.', 'parent'],
      [2, '},', 'context', 'Closes contextActivities.'],
      [2, '"extensions": {"https://w3id.org/lrs/ext/concept_id": "compression-ratio"}', 'context', 'Concept ID extension: which idea this is evidence about.', 'concept'],
      [1, '},', 'context', 'Closes the context.'],
      [1, '"timestamp": "2026-07-16T14:22:03Z"', 'housekeeping', 'When the learner acted, set by the producer (ISO 8601).', 'timestamp'],
      [0, '}', null, '']
    ],
    quiz: [
      ['the line that says whether the answer was right', 'success'],
      ['the line that identifies the learner', 'account'],
      ['the line whose IRI tells a store what kind of act this was', 'verbId'],
      ['the line that says how long the learner took', 'duration'],
      ['the line that says which textbook version was being read', 'grouping'],
      ['the line that says which concept this is evidence about', 'concept'],
      ['the line that says what kind of thing the object is', 'objType'],
      ['the line that records when the learner acted', 'timestamp'],
      ['the line that names this statement itself', 'id'],
      ['the line that gives a partial score', 'score']
    ]
  },
  interacted: {
    label: 'interacted',
    lines: [
      [0, '{', null, ''],
      [1, '"id": "1b7d4a90-3e25-4c68-8f14-6a9e2d7b5c03",', 'housekeeping', 'A UUID naming this statement, so a store can spot a duplicate.', 'id'],
      [1, '"actor": {', 'actor', 'Opens the actor: who did it.'],
      [2, '"objectType": "Agent",', 'actor', 'The actor is one person (an Agent), not a Group.'],
      [2, '"account": {', 'actor', 'The account form of identifier: a homePage plus a name.'],
      [3, '"homePage": "https://demo.example.edu",', 'actor', 'The system the learner\'s account lives in.', 'homePage'],
      [3, '"name": "student-0042"', 'actor', 'The learner\'s account name in that system (the store derives the pseudonym).', 'account'],
      [2, '}', 'actor', 'Closes the account.'],
      [1, '},', 'actor', 'Closes the actor.'],
      [1, '"verb": {', 'verb', 'Opens the verb: what the actor did.'],
      [2, '"id": "http://adlnet.gov/expapi/verbs/interacted",', 'verb', 'interacted: the learner manipulated or inspected a control.', 'verbId'],
      [2, '"display": {"en-US": "interacted"}', 'verb', 'A human-readable label for the verb.', 'display'],
      [1, '},', 'verb', 'Closes the verb.'],
      [1, '"object": {', 'object', 'Opens the object: what was acted on.'],
      [2, '"objectType": "Activity",', 'object', 'The object is an activity.'],
      [2, '"id": "' + SITE + '/sims/bouncing-ball/#speed-slider",', 'object', 'Page IRI plus #speed-slider, the control\'s slugified name.', 'objId'],
      [2, '"definition": {', 'object', 'Opens the activity definition.'],
      [3, '"name": {"en-US": "Speed Slider"},', 'object', 'The control\'s human-readable name.', 'objName'],
      [3, '"type": "http://adlnet.gov/expapi/activities/interaction"', 'object', 'interaction: the object is a Control (not cmi.interaction).', 'objType'],
      [2, '}', 'object', 'Closes the definition.'],
      [1, '},', 'object', 'Closes the object.'],
      [1, '"result": {', 'result', 'Opens the result. No success and no duration for a slider.'],
      [2, '"extensions": {', 'result', 'Result extensions: named additions, qualified under /lrs/ext/.'],
      [3, '"https://w3id.org/lrs/ext/value": 4,', 'result', 'The value the learner moved the slider to.', 'value'],
      [3, '"https://w3id.org/lrs/ext/previous-value": 3', 'result', 'The value the slider had before the move.', 'prev'],
      [2, '}', 'result', 'Closes the extensions.'],
      [1, '},', 'result', 'Closes the result.'],
      [1, '"context": {', 'context', 'Opens the context: the setting.'],
      [2, '"contextActivities": {', 'context', 'Related activities, in named buckets.'],
      [3, '"grouping": [{"id": "' + SITE + '/textbook/lrs/v1.0.0"}],', 'context', 'grouping: the textbook version being read (required).', 'grouping'],
      [3, '"parent": [{"id": "' + SITE + '/sims/bouncing-ball/"}]', 'context', 'parent: the page the slider belongs to.', 'parent'],
      [2, '},', 'context', 'Closes contextActivities.'],
      [2, '"extensions": {"https://w3id.org/lrs/ext/concept_id": "velocity"}', 'context', 'Concept ID extension: the slider is evidence about this concept.', 'concept'],
      [1, '},', 'context', 'Closes the context.'],
      [1, '"timestamp": "2026-07-16T14:25:40Z"', 'housekeeping', 'When the learner moved the slider (ISO 8601).', 'timestamp'],
      [0, '}', null, '']
    ],
    quiz: [
      ['the line that holds the value the slider moved to', 'value'],
      ['the line that holds the value the slider had before', 'prev'],
      ['the line that names the control that was used', 'objId'],
      ['the line that shows which page the slider sits on', 'parent'],
      ['the line that says the object is a Control', 'objType'],
      ['the line that identifies the learner', 'account'],
      ['the line whose IRI says the learner touched a control', 'verbId']
    ]
  },
  experienced: {
    label: 'experienced',
    lines: [
      [0, '{', null, ''],
      [1, '"id": "e4a2c6f1-9b38-4d57-a0c2-5f7e1b3d9a86",', 'housekeeping', 'A UUID naming this statement, so a store can spot a duplicate.', 'id'],
      [1, '"actor": {', 'actor', 'Opens the actor: who did it.'],
      [2, '"objectType": "Agent",', 'actor', 'The actor is one person (an Agent), not a Group.'],
      [2, '"account": {', 'actor', 'The account form of identifier: a homePage plus a name.'],
      [3, '"homePage": "https://demo.example.edu",', 'actor', 'The system the learner\'s account lives in.', 'homePage'],
      [3, '"name": "student-0042"', 'actor', 'The learner\'s account name in that system (the store derives the pseudonym).', 'account'],
      [2, '}', 'actor', 'Closes the account.'],
      [1, '},', 'actor', 'Closes the actor.'],
      [1, '"verb": {', 'verb', 'Opens the verb: what the actor did.'],
      [2, '"id": "http://adlnet.gov/expapi/verbs/experienced",', 'verb', 'experienced: time spent with a page or MicroSim (exposure evidence).', 'verbId'],
      [2, '"display": {"en-US": "experienced"}', 'verb', 'A human-readable label for the verb.', 'display'],
      [1, '},', 'verb', 'Closes the verb.'],
      [1, '"object": {', 'object', 'Opens the object: what was acted on.'],
      [2, '"objectType": "Activity",', 'object', 'The object is an activity.'],
      [2, '"id": "' + SITE + '/sims/bouncing-ball/",', 'object', 'The page IRI itself, with no fragment and a trailing slash.', 'objId'],
      [2, '"definition": {', 'object', 'Opens the activity definition.'],
      [3, '"type": "http://adlnet.gov/expapi/activities/simulation",', 'object', 'simulation: the object is a whole MicroSim.', 'objType'],
      [3, '"name": {"en-US": "Bouncing Ball"}', 'object', 'The MicroSim\'s human-readable name.', 'objName'],
      [2, '}', 'object', 'Closes the definition.'],
      [1, '},', 'object', 'Closes the object.'],
      [1, '"result": {', 'result', 'Opens the result: how it went.'],
      [2, '"duration": "PT1M25S",', 'result', 'Required for experienced: the run lasted 1 minute 25 seconds.', 'duration'],
      [2, '"extensions": {"https://w3id.org/lrs/ext/run-ended-by": "pause"}', 'result', 'Why the run ended; one Start and Pause pair gives one statement.', 'runEnded'],
      [1, '},', 'result', 'Closes the result.'],
      [1, '"context": {', 'context', 'Opens the context: the setting.'],
      [2, '"contextActivities": {', 'context', 'Related activities, in named buckets.'],
      [3, '"grouping": [{"id": "' + SITE + '/textbook/lrs/v1.0.0"}]', 'context', 'grouping: the textbook version being read (required).', 'grouping'],
      [2, '},', 'context', 'Closes contextActivities. No parent: the object is the page.'],
      [2, '"extensions": {"https://w3id.org/lrs/ext/concept_id": "kinematics"}', 'context', 'Concept ID extension: the page-level concept for a run.', 'concept'],
      [1, '},', 'context', 'Closes the context.'],
      [1, '"timestamp": "2026-07-16T14:27:05Z"', 'housekeeping', 'When the run ended and the statement was made (ISO 8601).', 'timestamp'],
      [0, '}', null, '']
    ],
    quiz: [
      ['the line that says how long the run lasted', 'duration'],
      ['the line that says why the run ended', 'runEnded'],
      ['the line that says this object is a whole MicroSim', 'objType'],
      ['the line that identifies the page itself, with no fragment', 'objId'],
      ['the line whose IRI marks this as exposure evidence', 'verbId'],
      ['the line that says which textbook version was being read', 'grouping'],
      ['the line that records when the statement was made', 'timestamp']
    ]
  }
};
const ORDER = ['answered', 'interacted', 'experienced'];

// ---------- state ----------
let current = 'answered';
let selectedLine = -1;
let hoverLine = -1;
let rows = [];            // drawn line rectangles
let quiz = { q: null, answered: false, pick: -1, correct: 0, attempts: 0, asked: [] };

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  const mainEl = document.querySelector('main');

  statementSelect = createSelect();
  statementSelect.parent(mainEl);
  for (const k of ORDER) statementSelect.option(STATEMENTS[k].label, k);
  statementSelect.selected('answered');
  statementSelect.changed(() => {
    current = statementSelect.value();
    selectedLine = -1;
    quiz.asked = [];
    if (quizCheckbox.checked()) newQuestion();
  });

  quizCheckbox = createCheckbox(' Quiz me', false);
  quizCheckbox.parent(mainEl);
  quizCheckbox.changed(() => {
    selectedLine = -1;
    if (quizCheckbox.checked()) { quiz.asked = []; newQuestion(); }
    else nextButton.hide();
  });

  nextButton = createButton('Next');
  nextButton.parent(mainEl);
  nextButton.mousePressed(newQuestion);
  nextButton.hide();

  positionControls();

  describe('A formatted xAPI statement is shown one JSON line per row. Clicking a line highlights the ' +
    'whole part it belongs to, actor, verb, object, result or context, or the housekeeping fields id ' +
    'and timestamp, and an information panel names the part, the question it answers and its ' +
    'definition. A Statement menu switches between an answered, an interacted and an experienced ' +
    'statement. Quiz me hides the colors and asks you to click the line that carries a named property.');
}

function positionControls() {
  const y = drawHeight + 12;
  statementSelect.position(sliderLeftMargin, y);
  const selW = statementSelect.elt.offsetWidth || 110;
  const cbX = sliderLeftMargin + selW + 14;
  quizCheckbox.position(cbX, y + 2);
  const cbW = quizCheckbox.elt.offsetWidth || 80;
  nextButton.position(cbX + cbW + 10, y - 1);
}

// ---------- quiz ----------
function newQuestion() {
  const list = STATEMENTS[current].quiz;
  if (quiz.asked.length >= list.length) quiz.asked = [];
  let q;
  do { q = floor(random(list.length)); } while (quiz.asked.includes(q));
  quiz.asked.push(q);
  quiz.q = list[q];
  quiz.answered = false;
  quiz.pick = -1;
  selectedLine = -1;
  nextButton.hide();
}

function answer(i) {
  if (quiz.answered || !quiz.q) return;
  quiz.answered = true;
  quiz.pick = i;
  quiz.attempts++;
  if (STATEMENTS[current].lines[i][4] === quiz.q[1]) quiz.correct++;
  nextButton.show();
}

function targetLine() {
  const lines = STATEMENTS[current].lines;
  for (let i = 0; i < lines.length; i++) if (lines[i][4] === quiz.q[1]) return i;
  return -1;
}

// ---------- drawing ----------
function isWide() { return canvasWidth >= 500; }

function draw() {
  updateCanvasSize();
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke();
  fill('black');
  textFont('sans-serif');
  textAlign(CENTER, TOP);
  textSize(isWide() ? 21 : 19);
  text('xAPI Statement Field Explorer', canvasWidth / 2, 8);

  const wide = isWide();
  const jsonW = wide ? floor(canvasWidth * 2 / 3) : canvasWidth;
  const top = 38;
  const rowH = wide ? 15.5 : 13;
  drawStatement(0, top, jsonW, rowH);

  if (wide) drawInfobox(jsonW + 6, top, canvasWidth - jsonW - 6 - margin, drawHeight - top - 10);
  else {
    const y = top + STATEMENTS[current].lines.length * rowH + 8;
    drawInfobox(margin, y, canvasWidth - 2 * margin, drawHeight - y - 8);
  }
  drawControlText();
  if (hoverLine >= 0 && !(quizCheckbox.checked() && !quiz.answered)) drawTooltip(STATEMENTS[current].lines[hoverLine][3]);
  cursor(hoverLine >= 0 ? HAND : ARROW);
}

function drawStatement(x0, top, w, rowH) {
  const lines = STATEMENTS[current].lines;
  const quizOn = quizCheckbox.checked();
  const fs = isWide() ? 13 : 12;
  textFont('monospace');
  textSize(fs);
  const charW = fontWidth('M');
  const textX = x0 + 16;
  const maxChars = floor((w - 22) / charW);
  const selPart = selectedLine >= 0 ? lines[selectedLine][2] : null;
  rows = [];
  hoverLine = -1;
  for (let i = 0; i < lines.length; i++) {
    const [indent, raw, part] = lines[i];
    const y = top + i * rowH;
    const r = { x: x0, y: y, w: w, h: rowH };
    rows.push(r);
    const over = mouseX >= x0 && mouseX < x0 + w && mouseY >= y && mouseY < y + rowH;
    if (over && part) hoverLine = i;
    // part highlight
    if (!quizOn && part && part === selPart) {
      const c = PARTS[part].color;
      fill(c[0], c[1], c[2], i === selectedLine ? 95 : 45);
      noStroke();
      rect(x0 + 10, y, w - 12, rowH);
    } else if (over && part) {
      fill(0, 0, 0, 18);
      noStroke();
      rect(x0 + 10, y, w - 12, rowH);
    }
    // gutter tab in the part color (hidden during the quiz)
    if (!quizOn && part) {
      const c = PARTS[part].color;
      fill(c);
      noStroke();
      rect(x0 + 3, y + 1, 5, rowH - 2);
    }
    // quiz marks
    if (quizOn && quiz.answered) {
      const t = targetLine();
      noFill();
      strokeWeight(2);
      if (i === t) { stroke('green'); rect(x0 + 10, y, w - 14, rowH, 2); }
      else if (i === quiz.pick) { stroke('firebrick'); rect(x0 + 10, y, w - 14, rowH, 2); }
    }
    noStroke();
    fill('black');
    textAlign(LEFT, TOP);
    const shown = elideLine('  '.repeat(indent) + raw, maxChars);
    text(shown, textX, y + (rowH - fs) / 2);
  }
  textFont('sans-serif');
}

// Shorten a line by eliding the middle of its longest quoted string
// (quotes pair up in order; the data contains no escaped quotes)
function elideLine(s, maxChars) {
  let guard = 0;
  while (s.length > maxChars && guard++ < 20) {
    const q = [];
    for (let i = 0; i < s.length; i++) if (s[i] === '"') q.push(i);
    let best = null;
    for (let k = 0; k + 1 < q.length; k += 2) {
      const len = q[k + 1] - q[k] - 1;
      if (!best || len > best.len) best = { start: q[k] + 1, len: len };
    }
    if (!best || best.len < 10) return s.slice(0, maxChars - 1) + '\u2026';
    const inner = s.substr(best.start, best.len);
    const over = s.length - maxChars;
    const keep = max(8, inner.length - over - 1);
    if (keep >= inner.length - 1) return s.slice(0, maxChars - 1) + '\u2026';
    const head = ceil(keep * 0.6), tail = keep - head;
    s = s.slice(0, best.start) + inner.slice(0, head) + '\u2026' + inner.slice(inner.length - tail) + s.slice(best.start + best.len);
  }
  return s;
}

function drawInfobox(x, y, w, h) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  const ix = x + 10, iw = w - 20;
  let yy = y + 8;
  const wide = isWide();
  const lead = wide ? 18 : 16;
  textSize(wide ? 14 : 13);
  const bottom = y + h - 6;

  if (quizCheckbox.checked()) {
    fill('black');
    textStyle(BOLD);
    textSize(wide ? 15 : 14);
    textAlign(LEFT, TOP);
    text('Quiz', ix, yy);
    textAlign(RIGHT, TOP);
    text('Score: ' + quiz.correct + ' / ' + quiz.attempts, x + w - 10, yy);
    textAlign(LEFT, TOP);
    textStyle(NORMAL);
    yy += lead + 4;
    textSize(wide ? 14 : 13);
    yy += wrapText('Click ' + quiz.q[0] + '.', ix, yy, iw, lead, bottom) + 6;
    if (quiz.answered) {
      const L = STATEMENTS[current].lines[quiz.pick];
      const right = L[4] === quiz.q[1];
      const t = STATEMENTS[current].lines[targetLine()];
      fill(right ? 'darkgreen' : 'firebrick');
      textStyle(BOLD);
      text(right ? 'Correct.' : 'Not that line.', ix, yy);
      textStyle(NORMAL);
      yy += lead;
      fill('black');
      const P = PARTS[t[2]];
      yy += wrapText('Answer: the ' + P.name.split(' ')[0].toLowerCase() + ' part (' + P.q.toLowerCase() +
        '). ' + t[3], ix, yy, iw, lead, bottom) + 4;
      if (!right && L[2] && wide) {
        fill('dimgray');
        wrapText('Your line: ' + L[3], ix, yy, iw, lead, bottom);
      }
    }
    return;
  }

  if (selectedLine < 0) {
    fill('black');
    textStyle(BOLD);
    text('Click any line', ix, yy);
    textStyle(NORMAL);
    yy += lead + 2;
    const keys = Object.keys(PARTS);
    if (!wide) {
      // two columns so all six fit in the short panel below the statement
      const colW = iw / 2;
      keys.forEach((k, i) => {
        const P = PARTS[k];
        const cx = ix + (i % 2) * colW, cy = yy + floor(i / 2) * lead;
        fill(P.color);
        rect(cx, cy + 3, 10, 10, 2);
        fill('black');
        const lbl = k === 'housekeeping' ? 'Housekeeping: id, when' : P.name + ': ' + P.q.toLowerCase();
        text(lbl, cx + 15, cy);
      });
      return;
    }
    for (const k of keys) {
      if (yy + lead > bottom) break;
      const P = PARTS[k];
      fill(P.color);
      rect(ix, yy + 3, 10, 10, 2);
      fill('black');
      yy += wrapText(P.name.split(' (')[0] + ': ' + P.q.toLowerCase(), ix + 16, yy, iw - 16, lead, bottom);
    }
    if (wide) {
      fill('dimgray');
      yy += 6;
      wrapText('Hover a line for a one-line meaning. Long addresses are shortened with …; click a line to see it in full.', ix, yy, iw, lead, bottom);
    }
    return;
  }

  const L = STATEMENTS[current].lines[selectedLine];
  const P = PARTS[L[2]];
  fill(P.color);
  rect(ix, yy + 2, 12, 12, 2);
  fill('black');
  textStyle(BOLD);
  textSize(wide ? 16 : 14);
  text(P.name, ix + 18, yy);
  textStyle(NORMAL);
  yy += lead + 4;
  textSize(wide ? 14 : 13);
  fill('navy');
  text('Answers: ' + P.q.toLowerCase(), ix, yy);
  yy += lead + 2;
  fill('black');
  yy += wrapText('This line: ' + L[3], ix, yy, iw, lead, bottom) + 4;
  fill('dimgray');
  yy += wrapText(P.def, ix, yy, iw, lead, bottom) + 6;
  if (wide) {
    textFont('monospace');
    textSize(12);
    fill('black');
    wrapChars(L[1], ix, yy, iw, 15, bottom);
    textFont('sans-serif');
  }
}

// Word-wrap text; stops (with an ellipsis) at the bottom limit; returns height used
function wrapText(str, x, y, w, lead, bottom) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (fontWidth(test) > w && line) { lines.push(line); line = word; }
    else line = test;
  }
  if (line) lines.push(line);
  textAlign(LEFT, TOP);
  let fit = lines.length;
  if (bottom) fit = min(lines.length, max(0, floor((bottom - y) / lead)));
  for (let i = 0; i < fit; i++) {
    let ln = lines[i];
    if (i === fit - 1 && fit < lines.length) ln = ln.replace(/\s*\S*$/, '') + ' \u2026';
    text(ln, x, y + i * lead);
  }
  return fit * lead;
}

// Character wrap for long code lines
function wrapChars(str, x, y, w, lead, bottom) {
  const per = max(10, floor(w / fontWidth('M')));
  for (let i = 0; i * per < str.length; i++) {
    if (y + (i + 1) * lead > bottom) break;
    text(str.slice(i * per, (i + 1) * per), x, y + i * lead);
  }
}

function drawTooltip(msg) {
  if (!msg) return;
  textSize(13);
  const tw = min(fontWidth(msg), canvasWidth - 40);
  const lines = [];
  let line = '';
  for (const word of msg.split(' ')) {
    const test = line ? line + ' ' + word : word;
    if (fontWidth(test) > tw && line) { lines.push(line); line = word; } else line = test;
  }
  lines.push(line);
  const th = lines.length * 17 + 8;
  let tx = constrain(mouseX + 12, 6, canvasWidth - tw - 20);
  let ty = mouseY + 16;
  if (ty + th > drawHeight - 4) ty = mouseY - th - 8;
  stroke('gray');
  strokeWeight(1);
  fill('lightyellow');
  rect(tx, ty, tw + 12, th, 4);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  for (let i = 0; i < lines.length; i++) text(lines[i], tx + 6, ty + 4 + i * 17);
}

function drawControlText() {
  noStroke();
  fill('black');
  textSize(15);
  textAlign(LEFT, CENTER);
  text('Statement:', 10, drawHeight + controlHeight / 2);
}

// ---------- events ----------
function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight) return;
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (mouseX >= r.x && mouseX < r.x + r.w && mouseY >= r.y && mouseY < r.y + r.h) {
      if (!STATEMENTS[current].lines[i][2]) return;
      if (quizCheckbox.checked()) answer(i);
      else selectedLine = i;
      return;
    }
  }
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
