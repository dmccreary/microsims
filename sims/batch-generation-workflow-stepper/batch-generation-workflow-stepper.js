// Batch Generation Workflow Stepper
// CANVAS_HEIGHT: 620
// Steps through the eight steps of the microsim-generator skill's batch route
// (Chapter 5). Each step box is colored by who does the work: steel blue for a
// script, orange for the agent's one creative step, green for a human checkpoint.
// A "Predict first" mode hides the actor until the learner predicts it.
// Bloom level: Understand (explain). Pattern: step-through with concrete data,
// no continuous animation.

// ---------- canvas dimensions (standard MicroSim layout) ----------
let canvasWidth = 400;               // updated from the container width
let drawHeight = 540;                // drawing region height
let controlHeight = 80;              // two rows of controls
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;

// ---------- workflow data (Chapter 5, "The Agent Workflow") ----------
// actor: 'script' | 'agent' | 'human'
const steps = [
  {
    short: ['Extract', 'specs'],
    name: 'Extract specifications',
    actor: 'script',
    purpose: 'Turn every specification block in a chapter into one JSON spec per MicroSim.',
    command: 'extract-sim-specs.py --chapter <dir> --output ch-specs.json --status-file sim-status.json',
    input: 'The chapter index.md with its #### Diagram: and #### Drawing: blocks',
    output: 'ch-specs.json (one spec per MicroSim) and sim-status.json',
    state: 'specified',
    why: 'Parsing headings and details blocks is deterministic, so a script gives the same JSON every time at no token cost.'
  },
  {
    short: ['Scaffold', 'folders'],
    name: 'Scaffold each MicroSim folder',
    actor: 'script',
    purpose: 'Create each MicroSim directory with its boilerplate files.',
    command: 'generate-sim-scaffold.py --spec-file ch-specs.json',
    input: 'ch-specs.json',
    output: 'docs/sims/<sim-id>/ with main.html, index.md and metadata.json',
    state: 'scaffolded',
    why: 'Boilerplate follows a fixed template, and the script skips folders that already exist.'
  },
  {
    short: ['Design', 'check'],
    name: 'Instructional design checkpoint',
    actor: 'human',
    purpose: 'Match the interaction pattern to the objective\'s Bloom level before any code exists.',
    command: 'The agent reads the Bloom level and verb and answers the four checkpoint questions; on a mismatch it asks you.',
    input: 'The learning objective in the specification',
    output: 'An "Instructional Design Check" block (level, verb, pattern, alignment, rationale)',
    state: 'scaffolded (unchanged)',
    why: 'Only the author knows the learners. When the spec and the pattern disagree, the skill stops and lets a person decide.'
  },
  {
    short: ['Write', 'the JS'],
    name: 'Write the JavaScript file',
    actor: 'agent',
    purpose: 'Write the sketch: the one creative step in the workflow.',
    command: 'Route to the matching reference guide, read its template assets, then write <sim-id>.js with a // CANVAS_HEIGHT comment.',
    input: 'The spec, one reference guide and its template assets',
    output: 'docs/sims/<sim-id>/<sim-id>.js',
    state: 'implemented',
    why: 'Turning a prose specification into working drawing code needs judgment, so this is where the language model earns its cost.'
  },
  {
    short: ['Insert', 'iframes'],
    name: 'Insert iframes into the chapter',
    actor: 'script',
    purpose: 'Embed each MicroSim in its chapter with a relative-path iframe.',
    command: 'add-iframes-to-chapter.py --chapter <dir> --fix-heights --fix-paths',
    input: 'The chapter index.md and the MicroSim folders',
    output: 'The chapter index.md with an <iframe> before each details block',
    state: 'implemented (iframe now in chapter)',
    why: 'Writing a tag with a relative path and a computed height is mechanical and easy to get wrong by hand.'
  },
  {
    short: ['Validate', '& test'],
    name: 'Validate, sync heights, test controls',
    actor: 'script',
    purpose: 'Score quality, fix iframe heights and check that every control is visible.',
    command: 'validate-sims.py, then sync-iframe-heights.py, then test-iframe-heights.py',
    input: 'The MicroSim folders and each // CANVAS_HEIGHT comment',
    output: 'A 100-point quality score, corrected iframe heights, PASS or FAIL per MicroSim',
    state: 'validated, then deployed (score of 70+ and a chapter iframe)',
    why: 'Rubric scoring, height arithmetic and bounding-box checks give the same answer every run.'
  },
  {
    short: ['Update', 'nav'],
    name: 'Update the site navigation',
    actor: 'script',
    purpose: 'Rebuild the MicroSims section of the site menu.',
    command: 'update-mkdocs-nav.py',
    input: 'The title in each docs/sims/*/index.md',
    output: 'mkdocs.yml with an alphabetical MicroSims nav section',
    state: 'deployed (unchanged)',
    why: 'Sorting a list of titles is deterministic and safe to repeat.'
  },
  {
    short: ['Capture', '& review'],
    name: 'Screenshot and visual layout review',
    actor: 'human',
    purpose: 'Capture a screenshot, review the layout, and hand any residue to a person.',
    command: 'bk-capture-screenshot, then the agent walks the visual checklist and patches failures (at most three cycles).',
    input: 'The running main.html and the visual checklist',
    output: '<sim-id>.png and a review report of passes, fixes and residue',
    state: 'deployed (unchanged)',
    why: 'The loop stops after three cycles and reports what remains, so a person decides whether the MicroSim is good enough.'
  }
];

const lifecycleStates = ['specified', 'scaffolded', 'implemented', 'validated', 'deployed'];
// index of the furthest lifecycle state reached after each step
const lifecycleAfterStep = [0, 1, 1, 2, 2, 4, 4, 4];

const actorInfo = {
  script: { label: 'Script', fill: 'steelblue', text: 'white' },
  agent:  { label: 'Agent (creative step)', fill: 'orange', text: 'black' },
  human:  { label: 'Human checkpoint', fill: 'seagreen', text: 'white' }
};

// ---------- state ----------
let current = 0;               // selected step index (0-7)
let predictMode = false;
let revealed = [];             // revealed[i] true once the actor is shown in predict mode
let predictions = [];          // learner's prediction per step
let boxes = [];                // computed box rectangles for hit testing
let hoverIndex = -1;

// ---------- controls ----------
let prevButton, nextButton, resetButton, predictCheckbox;
let scriptButton, agentButton, humanButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Row 1: navigation and the Predict first option
  prevButton = createButton('Previous');
  prevButton.parent(document.querySelector('main'));
  prevButton.mouseClicked(goPrevious);

  nextButton = createButton('Next');
  nextButton.parent(document.querySelector('main'));
  nextButton.mouseClicked(goNext);

  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.mouseClicked(resetAll);

  predictCheckbox = createCheckbox(' Predict first', false);
  predictCheckbox.parent(document.querySelector('main'));
  predictCheckbox.changed(togglePredict);

  // Row 2: prediction buttons (shown only in Predict first mode)
  scriptButton = createButton('Script');
  scriptButton.parent(document.querySelector('main'));
  scriptButton.mouseClicked(() => makePrediction('script'));

  agentButton = createButton('Agent');
  agentButton.parent(document.querySelector('main'));
  agentButton.mouseClicked(() => makePrediction('agent'));

  humanButton = createButton('Human');
  humanButton.parent(document.querySelector('main'));
  humanButton.mouseClicked(() => makePrediction('human'));

  resetState();
  positionControls();

  describe('Step-through of the eight steps of the MicroSim batch generation workflow. ' +
    'Eight numbered boxes are colored by actor: steel blue for scripts, orange for the agent\'s ' +
    'creative step and green for human checkpoints. A detail panel shows the command, input file, ' +
    'output file, lifecycle state and the reason for the actor. Previous and Next buttons move ' +
    'between steps and a Predict first option asks whether a script, the agent or a human does each step.', LABEL);
}

function resetState() {
  current = 0;
  revealed = steps.map(() => false);
  predictions = steps.map(() => null);
}

function positionControls() {
  let x = 10;
  const y1 = drawHeight + 8;
  prevButton.position(x, y1); x += prevButton.elt.offsetWidth + 8;
  nextButton.position(x, y1); x += nextButton.elt.offsetWidth + 8;
  resetButton.position(x, y1); x += resetButton.elt.offsetWidth + 16;
  predictCheckbox.position(x, y1 + 2);

  const y2 = drawHeight + 44;
  let x2 = canvasWidth < 500 ? 170 : 215;
  scriptButton.position(x2, y2); x2 += scriptButton.elt.offsetWidth + 8;
  agentButton.position(x2, y2); x2 += agentButton.elt.offsetWidth + 8;
  humanButton.position(x2, y2);
  updateControlState();
}

function updateControlState() {
  setDisabled(prevButton, current === 0);
  setDisabled(nextButton, current === steps.length - 1);
  const asking = predictMode && !revealed[current];
  [scriptButton, agentButton, humanButton].forEach(b => asking ? b.show() : b.hide());
}

function setDisabled(btn, flag) {
  if (flag) btn.attribute('disabled', '');
  else btn.removeAttribute('disabled');
}

function draw() {
  updateCanvasSize();

  // drawing region
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  // control region
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(22);
  text('Batch Generation Workflow', canvasWidth / 2, 10);

  drawLifecycleBar(42);
  drawLegend(80);
  const rowsBottom = drawStepBoxes(104);
  drawDetailPanel(rowsBottom + 14);
  drawControlLabels();
  drawTooltip();
}

// ---------- actor color legend ----------
function drawLegend(y) {
  const narrow = canvasWidth < 600;
  const items = [
    ['script', narrow ? 'Script' : 'Script (deterministic)'],
    ['agent', narrow ? 'Agent' : 'Agent (creative step)'],
    ['human', narrow ? 'Human' : 'Human checkpoint']
  ];
  textSize(14);
  textAlign(LEFT, CENTER);
  let total = 0;
  items.forEach(([k, label]) => { total += 16 + 6 + textWidth(label) + 18; });
  let x = (canvasWidth - total + 18) / 2;
  items.forEach(([k, label]) => {
    stroke('dimgray');
    strokeWeight(1);
    fill(actorInfo[k].fill);
    rect(x, y - 7, 14, 14, 3);
    noStroke();
    fill('black');
    text(label, x + 20, y);
    x += 16 + 6 + textWidth(label) + 18;
  });
}

// ---------- lifecycle bar ----------
function drawLifecycleBar(y) {
  const reached = lifecycleAfterStep[current];
  const x0 = margin;
  const w = canvasWidth - 2 * margin;
  const segW = w / lifecycleStates.length;
  const h = 26;
  textSize(canvasWidth < 500 ? 12 : 14);
  textAlign(CENTER, CENTER);
  for (let i = 0; i < lifecycleStates.length; i++) {
    const sx = x0 + i * segW;
    stroke('white');
    strokeWeight(2);
    if (i <= reached) fill(i === reached ? 'darkslateblue' : 'slateblue');
    else fill('gainsboro');
    // chevron-shaped segment
    const tip = 8;
    beginShape();
    vertex(sx, y);
    vertex(sx + segW - tip, y);
    vertex(sx + segW, y + h / 2);
    vertex(sx + segW - tip, y + h);
    vertex(sx, y + h);
    vertex(sx + (i === 0 ? 0 : tip), y + h / 2);
    endShape(CLOSE);
    noStroke();
    fill(i <= reached ? 'white' : 'dimgray');
    text(lifecycleStates[i], sx + segW / 2 + (i === 0 ? -2 : 2), y + h / 2);
  }
}

// ---------- step boxes ----------
function drawStepBoxes(top) {
  const perRow = canvasWidth < 600 ? 4 : 8;
  const gap = 16;
  const boxH = perRow === 8 ? 78 : 70;
  const rowGap = 24;
  const boxW = (canvasWidth - 2 * margin - (perRow - 1) * gap) / perRow;
  boxes = [];
  hoverIndex = -1;

  for (let i = 0; i < steps.length; i++) {
    const row = Math.floor(i / perRow);
    const col = i % perRow;
    const x = margin + col * (boxW + gap);
    const y = top + row * (boxH + rowGap);
    boxes.push({ x: x, y: y, w: boxW, h: boxH });
    if (mouseX >= x && mouseX <= x + boxW && mouseY >= y && mouseY <= y + boxH) hoverIndex = i;
  }

  // arrows between consecutive boxes
  stroke('dimgray');
  strokeWeight(2);
  fill('dimgray');
  for (let i = 0; i < steps.length - 1; i++) {
    const a = boxes[i], b = boxes[i + 1];
    if (Math.abs(a.y - b.y) < 1) {
      arrow(a.x + a.w + 2, a.y + a.h / 2, b.x - 2, b.y + b.h / 2);
    } else {
      // wrap from the end of row 1 back to the start of row 2
      const midY = a.y + a.h + rowGap / 2;
      noFill();
      line(a.x + a.w / 2, a.y + a.h, a.x + a.w / 2, midY);
      line(a.x + a.w / 2, midY, b.x + b.w / 2, midY);
      fill('dimgray');
      arrow(b.x + b.w / 2, midY, b.x + b.w / 2, b.y - 2);
    }
  }

  // boxes
  for (let i = 0; i < steps.length; i++) {
    const r = boxes[i];
    const hidden = predictMode && !revealed[i];
    const info = actorInfo[steps[i].actor];
    stroke(i === current ? 'black' : (i === hoverIndex ? 'dimgray' : 'silver'));
    strokeWeight(i === current ? 4 : 1.5);
    fill(hidden ? 'lightgray' : info.fill);
    rect(r.x, r.y, r.w, r.h, 8);

    noStroke();
    fill(hidden ? 'black' : info.text);
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    textSize(15);
    text(hidden ? (i + 1) + ' ?' : String(i + 1), r.x + r.w / 2, r.y + 6);
    textStyle(NORMAL);
    textSize(r.w < 72 ? 12 : 14);
    text(steps[i].short[0], r.x + r.w / 2, r.y + 24);
    text(steps[i].short[1], r.x + r.w / 2, r.y + 40);
    // actor word so the meaning does not depend on color alone
    textStyle(ITALIC);
    textSize(12);
    text(hidden ? '?' : steps[i].actor, r.x + r.w / 2, r.y + r.h - 17);
    textStyle(NORMAL);
  }
  cursor(hoverIndex >= 0 ? HAND : ARROW);

  const last = boxes[boxes.length - 1];
  return last.y + last.h;
}

function arrow(x1, y1, x2, y2) {
  stroke('dimgray');
  strokeWeight(2);
  line(x1, y1, x2, y2);
  const ang = atan2(y2 - y1, x2 - x1);
  noStroke();
  fill('dimgray');
  push();
  translate(x2, y2);
  rotate(ang);
  triangle(0, 0, -8, -4, -8, 4);
  pop();
}

// ---------- detail panel ----------
// The panel text is laid out at the largest font size (15 down to 12) that fits.
function drawDetailPanel(top) {
  const x = margin;
  const w = canvasWidth - 2 * margin;
  const h = drawHeight - 10 - top;
  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 235);
  rect(x, top, w, h, 10);

  let fs = 15;
  while (fs > 12 && layoutPanel(x, top, w, h, fs, true) > top + h - 26) fs--;
  layoutPanel(x, top, w, h, fs, false);

  if (predictMode) {
    const answered = predictions.filter(p => p !== null).length;
    const correct = predictions.filter((p, i) => p !== null && p === steps[i].actor).length;
    noStroke();
    fill('dimgray');
    textSize(14);
    textAlign(RIGHT, BOTTOM);
    text('Predictions correct: ' + correct + ' of ' + answered, x + w - 12, top + h - 6);
    textAlign(LEFT, TOP);
  }
}

// lays out (or only measures) the panel content; returns the bottom y
function layoutPanel(x, top, w, h, fs, measureOnly) {
  const s = steps[current];
  const hidden = predictMode && !revealed[current];
  const pad = 12;
  const narrow = canvasWidth < 600;
  const lh = fs + 4;
  const innerW = w - 2 * pad;
  let y = top + pad;

  noStroke();
  textAlign(LEFT, TOP);
  // heading
  textStyle(BOLD);
  textSize(fs + 1);
  fill('black');
  wrapLines('Step ' + (current + 1) + ' of 8: ' + s.name, innerW).forEach(L => {
    if (!measureOnly) text(L, x + pad, y);
    y += lh + 1;
  });
  textStyle(NORMAL);
  y += 4;

  // actor badge (or the prediction prompt)
  textSize(fs);
  if (hidden) {
    fill('darkslateblue');
    wrapLines('Who does this step: a script, the agent, or a human checkpoint? ' +
      'Read the purpose, input and output, then predict with the buttons below.', innerW).forEach(L => {
      if (!measureOnly) text(L, x + pad, y);
      y += lh;
    });
    y += 4;
  } else {
    const info = actorInfo[s.actor];
    textStyle(BOLD);
    const bw = textWidth(info.label) + 16;
    if (!measureOnly) {
      fill(info.fill);
      rect(x + pad, y - 2, bw, lh + 2, 6);
      fill(info.text);
      text(info.label, x + pad + 8, y);
    }
    textStyle(NORMAL);
    const p = predictions[current];
    if (p !== null) {
      const ok = p === s.actor;
      const msg = ok ? 'Your prediction was correct.' :
        'You predicted ' + actorInfo[p].label.split(' (')[0] + '.';
      const mx = x + pad + bw + 10;
      fill(ok ? 'darkgreen' : 'firebrick');
      if (mx + textWidth(msg) < x + w - pad) {
        if (!measureOnly) text(msg, mx, y);
      } else {
        y += lh + 4;
        if (!measureOnly) text(msg, x + pad, y);
      }
    }
    y += lh + 8;
  }

  // fields; on narrow screens the purpose is skipped once the answer is shown
  const fields = [];
  if (hidden || !narrow) fields.push(['Purpose:', s.purpose]);
  if (!hidden) fields.push(['Command or action:', s.command]);
  fields.push(['Input:', s.input]);
  fields.push(['Output:', s.output]);
  fields.push(['Lifecycle state:', s.state]);
  if (!hidden) fields.push(['Why this actor:', s.why]);

  const labelW = narrow ? 0 : 150;
  for (const [label, value] of fields) {
    y = drawField(label, value, x + pad, y, innerW, labelW, fs, lh, measureOnly);
    y += 3;
  }
  return y;
}

// draws a bold label and a wrapped value; returns the next y
function drawField(label, value, x, y, w, labelW, fs, lh, measureOnly) {
  textSize(fs);
  textStyle(BOLD);
  fill('black');
  if (!measureOnly) text(label, x, y);
  if (labelW === 0) {
    // narrow layout: the value starts on the label's line and wraps under it
    const lw = textWidth(label) + 6;
    textStyle(NORMAL);
    wrapLines(value, w, w - lw).forEach((L, i) => {
      if (!measureOnly) text(L, i === 0 ? x + lw : x, y);
      y += lh;
    });
    return y;
  }
  textStyle(NORMAL);
  wrapLines(value, w - labelW).forEach(L => {
    if (!measureOnly) text(L, x + labelW, y);
    y += lh;
  });
  return y;
}

// word-wrap helper using the current text size; firstW lets line 1 be shorter
function wrapLines(str, maxW, firstW) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  let limit = firstW !== undefined ? firstW : maxW;
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (textWidth(test) > limit && line) {
      lines.push(line);
      line = word;
      limit = maxW;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// ---------- control-region labels ----------
function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(canvasWidth < 500 ? 14 : 16);
  textAlign(LEFT, CENTER);
  const y2 = drawHeight + 57;
  if (predictMode && !revealed[current]) {
    textStyle(BOLD);
    text(canvasWidth < 500 ? 'Who does it?' : 'Script, agent or human?', 10, y2);
    textStyle(NORMAL);
  } else {
    fill('dimgray');
    text('Click any step box, or use Previous and Next.', 10, y2);
  }
}

// ---------- hover tooltip ----------
function drawTooltip() {
  if (hoverIndex < 0) return;
  const s = steps[hoverIndex];
  textSize(14);
  const maxW = min(280, canvasWidth - 40);
  const lines = wrapLines(s.purpose, maxW - 16);
  const tw = min(maxW, max(lines.map(L => textWidth(L))) + 16);
  const th = lines.length * 18 + 10;
  let tx = mouseX + 14;
  let ty = mouseY + 16;
  if (tx + tw > canvasWidth - 4) tx = canvasWidth - 4 - tw;
  if (ty + th > drawHeight - 4) ty = mouseY - th - 8;
  stroke('dimgray');
  strokeWeight(1);
  fill('lightyellow');
  rect(tx, ty, tw, th, 6);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  lines.forEach((L, i) => text(L, tx + 8, ty + 6 + i * 18));
}

// ---------- interactions ----------
function mousePressed() {
  for (let i = 0; i < boxes.length; i++) {
    const r = boxes[i];
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) {
      current = i;
      updateControlState();
      return;
    }
  }
}

function goPrevious() {
  if (current > 0) current--;
  updateControlState();
}

function goNext() {
  if (current < steps.length - 1) current++;
  updateControlState();
}

function resetAll() {
  resetState();
  updateControlState();
}

function togglePredict() {
  predictMode = predictCheckbox.checked();
  revealed = steps.map(() => false);
  predictions = steps.map(() => null);
  updateControlState();
}

function makePrediction(actor) {
  predictions[current] = actor;
  revealed[current] = true;
  updateControlState();
}

// ---------- responsive design ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
}
