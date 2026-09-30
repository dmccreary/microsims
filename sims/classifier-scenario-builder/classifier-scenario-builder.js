// Classifier Scenario Builder - p5.js MicroSim
// CANVAS_HEIGHT: 835
// Learning objective (Create / write): the learner writes a concept-classifier scenario, four
// options, a hint and an explanation, and checks that exactly one option is defensible.
// A form (DOM inputs) sits beside a live preview of the quiz card drawn as a learner sees it;
// under 700 px the form and preview stack. "Check quality" runs simple string checks,
// "Show JSON" prints the scenario in the classifier's data.json shape, and "Try as learner"
// makes the preview card playable.

// ---------- canvas layout ----------
let canvasWidth = 400;
let drawHeight = 720;
let controlHeight = 115;           // three rows of controls
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

// ---------- starting points ----------
const EXAMPLES = {
  chapter: {
    scenario: 'A poster\'s left column lists five statistics with citations, and the right column lists five mirror-image statistics with no source.',
    correct: 'Symmetry fabrication',
    d: ['Meta-source citation', 'Geographic misattribution', 'Image-model number drift'],
    hint: 'Ask whether every number on one side has a source.',
    explanation: 'The right column invents figures to balance the layout, which the pipeline forbids.'
  },
  flawed: {
    scenario: 'A poster labels forest-bathing research carried out in Japan as "Finnish studies".',
    correct: 'Geographic misattribution',
    d: ['Symmetry fabrication', 'Meta-source citation',
        'Image-model number drift, because the model changed the country while rendering the text'],
    hint: 'Think about geographic misattribution.',
    explanation: ''
  },
  blank: { scenario: '', correct: '', d: ['', '', ''], hint: '', explanation: '' }
};

// ---------- form and state ----------
let fields = {};                   // name -> p5 element
let order = [0, 1, 2, 3];          // display order of the four options in the preview
let tryMode = false;
let tryChoice = -1;                // option index chosen in Try mode
let tryHint = false;
let checks = null;                 // last quality-check results, or null
let showJson = false;
let narrowView = 'preview';        // what the lower area shows when stacked
let lastLayoutW = -1;

// geometry
let form = { x: 0, w: 0 };
let previewBox = { x: 0, y: 0, w: 0, h: 0 };
let reportBox = null;              // quality report area (wide only)
let jsonBox = { x: 0, y: 0, w: 0, h: 0 };
let optionRects = [];
let hintRect = null;

// controls
let checkButton, jsonButton, tryButton, startSelect, defensibleCheckbox, jsonArea;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // the form: DOM inputs, positioned by layoutForm()
  fields.scenario = createElement('textarea');
  fields.correct = createInput('');
  fields.d1 = createInput('');
  fields.d2 = createInput('');
  fields.d3 = createInput('');
  fields.hint = createInput('');
  fields.explanation = createElement('textarea');
  fields.d1.attribute('placeholder', 'Distractor 1');
  fields.d2.attribute('placeholder', 'Distractor 2');
  fields.d3.attribute('placeholder', 'Distractor 3');
  for (const k in fields) {
    fields[k].parent(document.querySelector('main'));
    fields[k].style('font-size', '14px');
    fields[k].style('font-family', 'Arial, Helvetica, sans-serif');
    fields[k].style('box-sizing', 'border-box');
    fields[k].style('padding', '3px 5px');
    fields[k].input(onEdit);
  }
  fields.scenario.style('resize', 'none');
  fields.explanation.style('resize', 'none');

  jsonArea = createElement('textarea');
  jsonArea.parent(document.querySelector('main'));
  jsonArea.attribute('readonly', '');
  jsonArea.style('font-family', 'monospace');
  jsonArea.style('font-size', '13px');
  jsonArea.style('box-sizing', 'border-box');
  jsonArea.style('resize', 'none');
  jsonArea.hide();

  // controls
  checkButton = createButton('Check quality');
  checkButton.position(10, drawHeight + 8);
  checkButton.mousePressed(runChecks);
  jsonButton = createButton('Show JSON');
  jsonButton.position(125, drawHeight + 8);
  jsonButton.mousePressed(toggleJson);
  tryButton = createButton('Try as learner');
  tryButton.position(225, drawHeight + 8);
  tryButton.mousePressed(toggleTry);

  startSelect = createSelect();
  startSelect.option('Start from: chapter example', 'chapter');
  startSelect.option('Start from: flawed draft', 'flawed');
  startSelect.option('Start from: blank form', 'blank');
  startSelect.position(10, drawHeight + 44);
  startSelect.changed(() => loadExample(startSelect.value()));

  defensibleCheckbox = createCheckbox(' Only one option is defensible (I checked)', false);
  defensibleCheckbox.position(10, drawHeight + 80);
  defensibleCheckbox.changed(() => { if (checks) runChecks(); });

  loadExample('chapter');
  layoutForm();
  describe('Classifier Scenario Builder: a form for a sorting-quiz scenario, its correct ' +
    'answer, three distractors, a hint and an explanation, with a live preview of the quiz card.', LABEL);
}

function draw() {
  updateCanvasSize();
  if (canvasWidth !== lastLayoutW) layoutForm();

  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(20);
  text('Classifier Scenario Builder', margin, 9);

  drawFormLabels();
  const stacked = canvasWidth < 700;
  if (!stacked || narrowView === 'preview') drawPreview();
  if (!stacked) {
    drawReport(reportBox);
    if (!showJson) drawJsonPlaceholder();
  } else if (narrowView === 'quality') {
    drawReport(previewBox);
  }
}

// ---------- layout ----------
const ROWS = {          // y positions inside the form column
  scenarioLabel: 40, scenario: 58, scenarioH: 58,
  correctLabel: 122, correct: 140,
  dLabel: 172, d1: 190, d2: 220, d3: 250,
  hintLabel: 282, hint: 300,
  explLabel: 332, expl: 350, explH: 44
};
const INPUT_H = 26;

function layoutForm() {
  lastLayoutW = canvasWidth;
  const stacked = canvasWidth < 700;
  form.x = margin;
  form.w = stacked ? canvasWidth - 2 * margin : min(380, floor((canvasWidth - 3 * margin) * 0.48));
  fields.scenario.position(form.x, ROWS.scenario);
  fields.scenario.size(form.w, ROWS.scenarioH);
  fields.correct.position(form.x, ROWS.correct);
  fields.d1.position(form.x, ROWS.d1);
  fields.d2.position(form.x, ROWS.d2);
  fields.d3.position(form.x, ROWS.d3);
  fields.hint.position(form.x, ROWS.hint);
  for (const k of ['correct', 'd1', 'd2', 'd3', 'hint']) fields[k].size(form.w, INPUT_H);
  fields.explanation.position(form.x, ROWS.expl);
  fields.explanation.size(form.w, ROWS.explH);

  if (stacked) {
    const top = ROWS.expl + ROWS.explH + 12;
    previewBox = { x: margin, y: top, w: canvasWidth - 2 * margin, h: drawHeight - top - 8 };
    reportBox = null;
    jsonBox = previewBox;
  } else {
    const px = form.x + form.w + 2 * margin;
    previewBox = { x: px, y: 40, w: canvasWidth - px - margin, h: ROWS.expl + ROWS.explH - 40 };
    const lowTop = ROWS.expl + ROWS.explH + 14;
    reportBox = { x: margin, y: lowTop, w: form.w, h: drawHeight - lowTop - 8 };
    jsonBox = { x: px, y: lowTop, w: previewBox.w, h: drawHeight - lowTop - 8 };
  }
  jsonArea.position(jsonBox.x, jsonBox.y);
  jsonArea.size(jsonBox.w, jsonBox.h);
  updateJsonVisibility();
}

// ---------- drawing ----------
function drawFormLabels() {
  noStroke();
  fill('black');
  textAlign(LEFT, BOTTOM);
  textSize(14);
  textStyle(BOLD);
  text('scenario', form.x, ROWS.scenario - 2);
  text('correctAnswer', form.x, ROWS.correct - 2);
  text('three distractors', form.x, ROWS.d1 - 2);
  text('hint', form.x, ROWS.hint - 2);
  text('explanation', form.x, ROWS.expl - 2);
  textStyle(NORMAL);
  fill('dimgray');
  textAlign(RIGHT, BOTTOM);
  text('the text to classify', form.x + form.w, ROWS.scenario - 2);
  text('the one right category', form.x + form.w, ROWS.correct - 2);
  text('plausible wrong categories', form.x + form.w, ROWS.d1 - 2);
  text('guides without giving it away', form.x + form.w, ROWS.hint - 2);
  text('shown after answering', form.x + form.w, ROWS.expl - 2);
}

function drawPreview() {
  const B = previewBox;
  const v = values();
  stroke(tryMode ? 'steelblue' : 'silver');
  strokeWeight(tryMode ? 3 : 1);
  fill('white');
  rect(B.x, B.y, B.w, B.h, 10);
  strokeWeight(1);
  noStroke();
  const lx = B.x + 12, maxW = B.w - 24;
  let y = B.y + 8;

  textAlign(LEFT, TOP);
  textSize(13);
  fill(tryMode ? 'steelblue' : 'dimgray');
  text(tryMode ? 'TRY AS LEARNER: click an option' : 'LEARNER PREVIEW', lx, y);
  y += 18;

  // scenario box
  textSize(15);
  const sLines = wrapLines(v.scenario || '(scenario is empty)', maxW - 16).slice(0, 5);
  const sh = sLines.length * 19 + 28;
  fill('lavender');
  rect(lx, y, maxW, sh, 8);
  fill('slateblue');
  textStyle(BOLD);
  textSize(12);
  text('SCENARIO', lx + 8, y + 5);
  textStyle(NORMAL);
  textSize(15);
  fill(v.scenario ? 'black' : 'gray');
  let sy = y + 22;
  for (const l of sLines) { text(l, lx + 8, sy); sy += 19; }
  y += sh + 8;

  const answeredTry = tryMode && tryChoice >= 0;
  if (!answeredTry) {           // after an answer this line gives way to the feedback
    fill('dimgray');
    textSize(13);
    text('Select the correct category for this scenario', lx, y);
    y += 20;
  }

  // four options in display order, 2 x 2 when there is room
  const opts = [v.correct, v.d[0], v.d[1], v.d[2]];
  const cols = maxW >= 330 ? 2 : 1;
  const ow = (maxW - (cols - 1) * 8) / cols;
  textSize(14);
  let rowH = 0;
  const cells = order.map(i => {
    let lines = wrapLines(opts[i] || '(empty)', ow - 16);
    if (lines.length > 3) {        // show at most three lines and mark the cut
      lines = lines.slice(0, 3);
      lines[2] += ' ...';
    }
    return { i: i, lines: lines, h: max(36, lines.length * 17 + 14) };
  });
  optionRects = [];
  for (let k = 0; k < 4; k++) {
    const c = cells[k];
    const col = k % cols;
    if (col === 0) {
      rowH = cols === 2 ? max(c.h, cells[k + 1].h) : c.h;
    }
    const ox = lx + col * (ow + 8);
    let fillC = 'whitesmoke', strokeC = 'silver';
    if (tryMode && tryChoice >= 0) {
      if (c.i === 0) { fillC = 'honeydew'; strokeC = 'green'; }
      else if (c.i === tryChoice) { fillC = 'mistyrose'; strokeC = 'firebrick'; }
    } else if (tryMode && mouseInside(ox, y, ow, rowH)) {
      fillC = 'lightyellow'; strokeC = 'goldenrod';
    }
    stroke(strokeC);
    fill(fillC);
    rect(ox, y, ow, rowH, 6);
    noStroke();
    fill(opts[c.i] ? 'black' : 'gray');
    let ty = y + (rowH - c.lines.length * 17) / 2;
    for (const l of c.lines) { text(l, ox + 8, ty); ty += 17; }
    optionRects.push({ x: ox, y: y, w: ow, h: rowH, i: c.i });
    if (col === cols - 1) y += rowH + 8;
  }

  // hint button (hidden once the card is answered) and feedback
  const hw = 150;
  hintRect = null;
  if (!answeredTry) {
    hintRect = { x: lx, y: y, w: hw, h: 26 };
    stroke('goldenrod');
    fill(tryHint ? 'lightyellow' : 'white');
    rect(lx, y, hw, 26, 13);
    noStroke();
    fill('saddlebrown');
    textSize(13);
    textAlign(CENTER, CENTER);
    text('Hint (5 points max)', lx + hw / 2, y + 13);
    textAlign(LEFT, TOP);
    y += 32;
  }
  const bottom = B.y + B.h - 4;
  const say = (s, c, style) => {
    fill(c);
    textStyle(style || NORMAL);
    for (const l of wrapLines(s, maxW)) {
      if (y + 17 > bottom) return;
      text(l, lx, y);
      y += 17;
    }
    textStyle(NORMAL);
  };
  textSize(14);
  if (tryMode && tryHint && tryChoice < 0) say('Hint: ' + (v.hint || '(hint is empty)'), 'saddlebrown');
  if (tryMode && tryChoice >= 0) {
    const right = tryChoice === 0;
    say(right ? 'Correct! +' + (tryHint ? 5 : 10) + ' points' : 'Not quite. The answer is ' + (v.correct || '(empty)') + '.',
      right ? 'darkgreen' : 'firebrick', BOLD);
    say(v.explanation || '(explanation is empty, so the learner sees no reason)', v.explanation ? 'black' : 'gray');
  }
  if (!tryMode) say('Press Try as learner to play this card.', 'gray');
}

function drawReport(R) {
  if (!R) return;
  stroke('silver');
  fill('white');
  rect(R.x, R.y, R.w, R.h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  const lx = R.x + 12, maxW = R.w - 24, bottom = R.y + R.h - 4;
  let y = R.y + 10;
  fill('black');
  textStyle(BOLD);
  textSize(15);
  text('Quality check', lx, y);
  textStyle(NORMAL);
  y += 22;
  textSize(14);
  if (!checks) {
    fill('dimgray');
    for (const l of wrapLines('Press Check quality to test for an empty field, a correct ' +
      'answer that is missing or repeated among the options, an option far longer than the ' +
      'others, and a hint that repeats the answer.', maxW)) { text(l, lx, y); y += 18; }
    return;
  }
  for (const c of checks) {
    if (y + 18 > bottom) break;
    fill(c.status === 'ok' ? 'darkgreen' : c.status === 'fix' ? 'firebrick' : 'darkorange');
    textStyle(BOLD);
    const tag = c.status === 'ok' ? '✓ ' : c.status === 'fix' ? '✗ ' : '? ';
    text(tag + c.name, lx, y);
    textStyle(NORMAL);
    y += 18;
    fill('black');
    for (const l of wrapLines(c.msg, maxW - 16)) {
      if (y + 17 > bottom) break;
      text(l, lx + 16, y);
      y += 17;
    }
    y += 5;
  }
}

function drawJsonPlaceholder() {
  const R = jsonBox;
  stroke('silver');
  fill(255, 255, 255, 180);
  rect(R.x, R.y, R.w, R.h, 10);
  noStroke();
  fill('dimgray');
  textSize(14);
  textAlign(LEFT, TOP);
  let y = R.y + 12;
  for (const l of wrapLines('Press Show JSON to see this scenario in the classifier\'s data.json ' +
    'shape: id, scenario, correctAnswer, options, explanation and hint.', R.w - 24)) {
    text(l, R.x + 12, y);
    y += 18;
  }
}

// ---------- values, checks and JSON ----------
function values() {
  const t = k => fields[k].value().trim();
  return { scenario: t('scenario'), correct: t('correct'), d: [t('d1'), t('d2'), t('d3')],
           hint: t('hint'), explanation: t('explanation') };
}

function runChecks() {
  const v = values();
  const out = [];
  // 1. empty fields
  const names = { scenario: v.scenario, correctAnswer: v.correct, 'distractor 1': v.d[0],
                  'distractor 2': v.d[1], 'distractor 3': v.d[2], hint: v.hint, explanation: v.explanation };
  const empty = Object.keys(names).filter(k => !names[k]);
  out.push(empty.length ? { name: 'Empty field', status: 'fix', msg: 'Fill in: ' + empty.join(', ') + '.' }
    : { name: 'No empty fields', status: 'ok', msg: 'All seven fields have text.' });

  // 2. the correct answer must appear exactly once among the options
  const opts = [v.correct].concat(v.d);
  const low = opts.map(o => o.toLowerCase());
  const copies = low.filter(o => o && o === low[0]).length;
  const dupDistractor = v.d.some((o, i) => o && v.d.findIndex(p => p.toLowerCase() === o.toLowerCase()) !== i);
  if (!v.correct) out.push({ name: 'Correct answer missing', status: 'fix', msg: 'correctAnswer is empty, so no option can be right.' });
  else if (copies > 1) out.push({ name: 'Correct answer repeated', status: 'fix', msg: 'A distractor repeats the correct answer, so two options are right.' });
  else if (dupDistractor) out.push({ name: 'Duplicate distractors', status: 'fix', msg: 'Two distractors are the same; each wrong option should test a different misconception.' });
  else out.push({ name: 'Correct answer appears once', status: 'ok', msg: 'The correct answer is in options exactly once.' });

  // 3. an option far longer than the others (test-wise learners pick the longest)
  let longMsg = null;
  opts.forEach((o, i) => {
    const others = opts.filter((_, j) => j !== i && opts[j]).map(p => p.length);
    if (!o || others.length === 0) return;
    const mean = others.reduce((a, b) => a + b, 0) / others.length;
    if (o.length > 1.8 * mean && o.length - mean >= 12) {
      longMsg = (i === 0 ? 'The correct answer' : 'Distractor ' + i) + ': ' + o.length +
        ' characters vs. an average of ' + round(mean) + '. Trim it.';
    }
  });
  out.push(longMsg ? { name: 'Option far longer than the others', status: 'fix', msg: longMsg }
    : { name: 'Options of similar length', status: 'ok', msg: 'No option stands out by length.' });

  // 4. a hint that repeats the answer
  const words = v.correct.toLowerCase().split(/[^a-z0-9-]+/).filter(w => w.length >= 4);
  const hintLow = v.hint.toLowerCase();
  const shared = words.filter(w => hintLow.includes(w));
  const repeats = v.correct && v.hint && (hintLow.includes(v.correct.toLowerCase()) ||
    (words.length && shared.length / words.length >= 0.6));
  out.push(repeats ? { name: 'Hint repeats the answer', status: 'fix',
      msg: 'It uses "' + shared.join(' ') + '". Point to the scenario\'s evidence instead.' }
    : { name: 'Hint does not give the answer away', status: 'ok', msg: v.hint ? 'The hint does not repeat the answer\'s key words.' : 'No hint to check yet.' });

  // 5. the human judgment the string checks cannot make
  out.push(defensibleCheckbox.checked()
    ? { name: 'Exactly one defensible option', status: 'ok', msg: 'You argued against each distractor.' }
    : { name: 'Exactly one defensible option', status: 'judge',
        msg: 'Your call: try to defend each distractor. If one holds up, rewrite it; then tick the checkbox.' });
  checks = out;
  if (canvasWidth < 700) { narrowView = 'quality'; showJson = false; updateJsonVisibility(); }
}

function scenarioJson() {
  const v = values();
  return JSON.stringify({ id: 1, scenario: v.scenario, correctAnswer: v.correct,
    options: [v.correct].concat(v.d), explanation: v.explanation, hint: v.hint }, null, 2);
}

function toggleJson() {
  showJson = !showJson;
  if (canvasWidth < 700) narrowView = showJson ? 'json' : 'preview';
  updateJsonVisibility();
}

function updateJsonVisibility() {
  if (!jsonArea) return;
  jsonButton.html(showJson ? 'Hide JSON' : 'Show JSON');
  if (showJson) {
    jsonArea.value(scenarioJson());
    jsonArea.show();
  } else {
    jsonArea.hide();
  }
}

// ---------- events ----------
function onEdit() {
  // typing updates the preview at once (draw() redraws every frame); keep JSON and checks live
  if (showJson) jsonArea.value(scenarioJson());
  if (checks) runChecks();
  if (tryMode) { tryChoice = -1; tryHint = false; }
}

function toggleTry() {
  tryMode = !tryMode;
  tryChoice = -1;
  tryHint = false;
  order = shuffle([0, 1, 2, 3]);
  tryButton.html(tryMode ? 'Back to editing' : 'Try as learner');
  if (canvasWidth < 700) { narrowView = 'preview'; showJson = false; updateJsonVisibility(); }
}

function mousePressed() {
  if (!tryMode || mouseY > drawHeight) return;
  if (canvasWidth < 700 && narrowView !== 'preview') return;
  if (hintRect && mouseInside(hintRect.x, hintRect.y, hintRect.w, hintRect.h) && tryChoice < 0) {
    tryHint = true;
    return;
  }
  if (tryChoice >= 0) return;
  for (const r of optionRects) {
    if (mouseInside(r.x, r.y, r.w, r.h)) {
      tryChoice = r.i;
      describe('Try as learner: ' + (r.i === 0 ? 'correct answer chosen.' : 'wrong answer chosen.'), LABEL);
      return;
    }
  }
}

function loadExample(key) {
  const e = EXAMPLES[key];
  fields.scenario.value(e.scenario);
  fields.correct.value(e.correct);
  fields.d1.value(e.d[0]);
  fields.d2.value(e.d[1]);
  fields.d3.value(e.d[2]);
  fields.hint.value(e.hint);
  fields.explanation.value(e.explanation);
  order = shuffle([0, 1, 2, 3]);
  checks = null;
  tryChoice = -1;
  tryHint = false;
  defensibleCheckbox.checked(false);
  if (canvasWidth < 700 && narrowView === 'quality') narrowView = 'preview';
  updateJsonVisibility();
}

// ---------- helpers ----------
function mouseInside(x, y, w, h) {
  return mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h;
}

function wrapLines(s, maxW) {
  const words = s.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const t = cur ? cur + ' ' + w : w;
    if (fontWidth(t) > maxW && cur) { lines.push(cur); cur = w; } else { cur = t; }
  }
  if (cur) lines.push(cur);
  return lines;
}

// ---------- responsive design ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  layoutForm();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.floor(container.getBoundingClientRect().width);
  }
}
