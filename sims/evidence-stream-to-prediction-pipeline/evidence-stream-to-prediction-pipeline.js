// From Interaction to Mastery Prediction - what enters and leaves each stage of the pipeline
// CANVAS_HEIGHT: 620
// Learning objective (Understand / explain): the learner explains what enters and leaves each
// stage between a learner's action and a mastery prediction, and identifies which stage discards
// exposure evidence (Chapter 18, "The Evidence Stream").
// Six stages left to right (stacked below 600 px). Click a stage for its definition, input,
// output and an example. Choose "Assessment answer" or "Slider drag" and step the sample event
// through the chain with "Next stage": an answer reaches the model and raises the estimate; a
// slider drag stops at the Filter because a model that needs success has nothing to condition on.
// The model is standard Bayesian knowledge tracing with the chapter's illustrative parameters.

// ---------- Canvas dimensions ----------
// Fixed total height; the drawing/control split is recomputed when the control rows wrap.
let canvasWidth = 800;
let canvasHeight = 620;
let controlHeight = 50;
let drawHeight = canvasHeight - controlHeight;
let margin = 12;
let defaultTextSize = 16;

// Okabe-Ito color-blind-safe colors (RGB)
const C_ANSWER = [0, 114, 178];     // blue: assessment evidence
const C_EXPOSE = [230, 159, 0];     // orange: exposure evidence
const C_STOP = [185, 70, 0];        // vermillion: stopped at the filter
const C_HOVER = [0, 158, 115];      // bluish green: hovered inputs/outputs

// BKT parameters (the chapter's illustrative values, not fitted to data)
const P_L0 = 0.30, P_T = 0.15, P_G = 0.20, P_S = 0.10;

// ---------- Stages ----------
const STAGES = [
  { name: 'Learner action', short: 'Learner action',
    def: 'What the learner does inside a MicroSim: answers a checked prediction, drags a slider, presses Start.',
    input: 'the learner\'s intent and the MicroSim\'s controls',
    output: 'a browser event, which the MicroSim\'s instrumentation passes to a guarded handle call',
    example: 'The learner picks "lower" on the elasticity prediction and presses Check.' },
  { name: 'xAPI statement', short: 'xAPI statement',
    def: 'One JSON record of one action, shaped like a sentence: actor, verb, object, result and context, with one concept ID.',
    input: 'the handle call, such as question.answer({success}) or slider.input(value)',
    output: 'one statement: answered with result.success, or interacted with value extensions and no success',
    example: 'answered .../sims/bouncing-ball/#q1, result.success true, concept_id elasticity' },
  { name: 'Evidence stream (per concept)', short: 'Evidence stream',
    def: 'The ordered sequence of statements one learner produces for one concept, read in the order they happened.',
    input: 'statements that carry the concept ID extension, from every MicroSim the learner used',
    output: 'one ordered list per learner and concept, mixing exposure evidence and answers',
    example: 'elasticity: interacted, experienced, answered (wrong), answered (right)' },
  { name: 'Filter', short: 'Filter',
    def: 'A rule that drops events the model cannot use. For a model that needs success, only statements carrying result.success pass: this is the stage that discards exposure evidence.',
    input: 'the whole stream: slider drags, hovers, runs, page dwell and answers',
    output: 'the attempts: answered statements in order, each correct or incorrect',
    example: 'A slider drag stops here: attempts = 0: no right-or-wrong to condition on.' },
  { name: 'Model', short: 'Model',
    def: 'The procedure that turns the attempts into an estimate. Here, Bayesian knowledge tracing: condition on each answer with Bayes\' rule, then apply the learning step.',
    input: 'ordered attempts and four parameters: P(L0) 0.30, p_t 0.15, p_g 0.20, p_s 0.10',
    output: 'an updated P(L), the probability that the concept is mastered',
    example: '0.30, then a correct answer: 0.66 after conditioning, 0.71 after the learning step' },
  { name: 'Estimate and prediction', short: 'Estimate',
    def: 'The mastery estimate P(L), and the prediction P(correct next) = P(L)(1 - p_s) + (1 - P(L)) p_g.',
    input: 'P(L) from the model',
    output: 'a probability a teacher can read, and a forecast that the next answer can check',
    example: 'P(L) = 0.71 gives a predicted chance of 0.70 that the next answer is correct' }
];

// ---------- State ----------
let pL = P_L0;               // current estimate for the concept
let attempts = 0;
let exposure = 0;
let streamLog = [];          // {kind: 'answer'|'drag', kept}
let token = null;            // {kind, stage 0-5, stopped, before, cond, after}
let selectedBox = -1;        // stage whose general card is shown (-1 = follow the token)
let hoverBox = -1;
let boxRects = [];
let lastLogged = '';

// controls
let eventRadio, stepButton, resetButton;
let controlItems = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('sans-serif');
  const main = document.querySelector('main');

  eventRadio = createRadio('sampleEvent');
  eventRadio.option('answer', 'Assessment answer');
  eventRadio.option('drag', 'Slider drag');
  eventRadio.changed(() => sendEvent(eventRadio.value()));
  stepButton = createButton('Send event');
  stepButton.mousePressed(stepPipeline);
  resetButton = createButton('Reset');
  resetButton.mousePressed(resetAll);
  controlItems = [eventRadio, stepButton, resetButton];
  for (const c of controlItems) c.parent(main);
  layoutControls();
  updateButton();

  describe('From Interaction to Mastery Prediction. Six stages form a chain: learner action, xAPI ' +
    'statement, evidence stream per concept, filter, model and estimate and prediction. Clicking a stage ' +
    'shows its definition, input, output and an example. Choosing Assessment answer or Slider drag sends a ' +
    'sample event that Next stage moves one stage at a time: an answer reaches the model and raises the ' +
    'mastery estimate, while a slider drag stops at the filter because it has no right-or-wrong result.');
}

// ---------- BKT ----------
function bktStep(p, correct) {
  const cond = correct
    ? p * (1 - P_S) / (p * (1 - P_S) + (1 - p) * P_G)
    : p * P_S / (p * P_S + (1 - p) * (1 - P_G));
  return { cond: cond, after: cond + (1 - cond) * P_T };
}

function predictCorrect(p) { return p * (1 - P_S) + (1 - p) * P_G; }

// ---------- Actions ----------
function sendEvent(kind) {
  if (!kind) return;
  token = { kind: kind, stage: 0, stopped: false };
  selectedBox = -1;
  updateButton();
}

function stepPipeline() {
  if (!token || token.stage >= 5 || token.stopped) { sendEvent(eventRadio.value() || 'answer'); if (!eventRadio.value()) eventRadio.selected('answer'); return; }
  token.stage++;
  selectedBox = -1;
  if (token.stage === 2) {
    // entering the evidence stream
    if (token.kind === 'drag') exposure++;
    streamLog.push({ kind: token.kind, kept: undefined });   // decided at the filter
  }
  if (token.stage === 3) {
    if (token.kind === 'drag') token.stopped = true;
    else attempts++;
    streamLog[streamLog.length - 1].kept = token.kind === 'answer';
  }
  if (token.stage === 4 && token.kind === 'answer') {
    const r = bktStep(pL, true);
    token.before = pL; token.cond = r.cond; token.after = r.after;
  }
  if (token.stage === 5 && token.kind === 'answer') pL = token.after;
  updateButton();
}

function resetAll() {
  pL = P_L0;
  attempts = 0;
  exposure = 0;
  streamLog = [];
  token = null;
  selectedBox = -1;
  eventRadio.selected('');
  for (const inp of eventRadio.elt.querySelectorAll('input')) inp.checked = false;
  updateButton();
}

function updateButton() {
  if (!token) stepButton.html('Send event');
  else if (token.stopped || token.stage >= 5) stepButton.html('Send another');
  else stepButton.html('Next stage');
  layoutControls();
}

// ---------- Layout ----------
function narrow() { return canvasWidth < 600; }

function layoutControls() {
  const rowH = 36;
  for (const el of controlItems) if (el.elt.style.position !== 'absolute') el.position(0, drawHeight);
  let x = 10, row = 0;
  const labelW = 58;                     // "Send:" label drawn on the canvas before the radio
  const pos = [];
  controlItems.forEach((el, i) => {
    const w = (el.elt.offsetWidth || 100) + (i === 0 ? labelW : 0);
    if (x > 10 && x + w > canvasWidth - 10) { row++; x = 10; }
    pos.push([x + (i === 0 ? labelW : 0), row]);
    x += w + 10;
  });
  controlHeight = (row + 1) * rowH + 14;
  drawHeight = canvasHeight - controlHeight;
  controlItems.forEach((el, i) => el.position(pos[i][0], drawHeight + 10 + pos[i][1] * rowH + (i === 0 ? 4 : 0)));
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
  textSize(narrow() ? 18 : 22);
  text('From Interaction to Mastery Prediction', margin, 9);
  textStyle(NORMAL);

  computeBoxes();
  drawArrows();
  drawBoxes();
  drawToken();
  let infoTop;
  if (narrow()) {
    infoTop = boxRects[5].y + boxRects[5].h + 12;
  } else {
    drawStream(margin, boxRects[0].y + boxRects[0].h + 40, canvasWidth - 2 * margin);
    infoTop = boxRects[0].y + boxRects[0].h + 92;
  }
  drawInfo({ x: margin, y: infoTop, w: canvasWidth - 2 * margin, h: drawHeight - 8 - infoTop });
  // "Send:" label in the control region
  noStroke();
  fill('black');
  textStyle(BOLD);
  textSize(14);
  textAlign(LEFT, TOP);
  const rb = eventRadio.elt.getBoundingClientRect(), mb = document.querySelector('main').getBoundingClientRect();
  text('Send:', rb.left - mb.left - 52, rb.top - mb.top + 2);
  textStyle(NORMAL);
}

function computeBoxes() {
  boxRects = [];
  const W = canvasWidth - 2 * margin;
  if (narrow()) {
    const bh = 34, gap = 12, y0 = 40;
    const bw = W - 118;                     // room on the right for the token tag
    for (let i = 0; i < 6; i++) boxRects.push({ x: margin, y: y0 + i * (bh + gap), w: bw, h: bh });
  } else {
    const gap = 26, bh = 86, y0 = 46;
    const bw = (W - 5 * gap) / 6;
    for (let i = 0; i < 6; i++) boxRects.push({ x: margin + i * (bw + gap), y: y0, w: bw, h: bh });
  }
  hoverBox = -1;
  boxRects.forEach((r, i) => { if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) hoverBox = i; });
}

function drawArrows() {
  for (let i = 0; i < 5; i++) {
    const a = boxRects[i], b = boxRects[i + 1];
    const lit = hoverBox === i || hoverBox === i + 1;
    const blocked = token && token.stopped && i === 3;
    stroke(lit ? C_HOVER : 'gray');
    strokeWeight(lit ? 3 : 1.5);
    fill(lit ? C_HOVER : 'gray');
    if (narrow()) {
      const x = a.x + a.w / 2;
      line(x, a.y + a.h, x, b.y - 4);
      noStroke();
      triangle(x - 5, b.y - 7, x + 5, b.y - 7, x, b.y - 1);
    } else {
      const y = a.y + a.h / 2;
      line(a.x + a.w, y, b.x - 4, y);
      noStroke();
      triangle(b.x - 8, y - 5, b.x - 8, y + 5, b.x - 1, y);
    }
    strokeWeight(1);
    if (blocked) {
      // a slider drag cannot pass the filter
      const cx = narrow() ? a.x + a.w / 2 : (a.x + a.w + b.x) / 2;
      const cy = narrow() ? (a.y + a.h + b.y) / 2 : a.y + a.h / 2;
      stroke(C_STOP);
      strokeWeight(3);
      line(cx - 6, cy - 6, cx + 6, cy + 6);
      line(cx - 6, cy + 6, cx + 6, cy - 6);
      strokeWeight(1);
    }
  }
}

function drawBoxes() {
  boxRects.forEach((r, i) => {
    const st = STAGES[i];
    const isSel = selectedBox === i || (selectedBox < 0 && token && token.stage === i);
    const lit = hoverBox >= 0 && abs(hoverBox - i) <= 1;
    stroke(hoverBox === i ? C_HOVER : (isSel ? 'black' : 'silver'));
    strokeWeight(hoverBox === i || isSel ? 2.5 : 1);
    const stopHere = i === 3 && token && token.stopped;
    fill(stopHere ? [255, 236, 220] : (lit ? [230, 246, 240] : 'white'));
    rect(r.x, r.y, r.w, r.h, 8);
    strokeWeight(1);
    noStroke();
    fill('slategray');
    textSize(11);
    textAlign(LEFT, TOP);
    if (!narrow()) text('Stage ' + (i + 1), r.x + 6, r.y + 5);
    fill('black');
    textStyle(BOLD);
    textSize(narrow() ? 13 : 13.5);
    if (narrow()) {
      textAlign(LEFT, CENTER);
      textSize(12.5);
      text((i + 1) + '. ' + (i === 5 ? 'Estimate & prediction' : st.name), r.x + 10, r.y + r.h / 2);
    } else {
      textAlign(CENTER, TOP);
      const lines = wrapWords(st.name, r.w - 10);
      lines.forEach((l, k) => text(l, r.x + r.w / 2, r.y + 22 + k * 17));
    }
    textStyle(NORMAL);
    textAlign(LEFT, TOP);
    if (i === 5) {
      // the estimate lives in the last box
      fill(C_ANSWER);
      textStyle(BOLD);
      textSize(narrow() ? 13 : 15);
      if (narrow()) { textSize(12.5); textAlign(RIGHT, CENTER); text('P(L) = ' + nf(pL, 1, 2), r.x + r.w - 8, r.y + r.h / 2); }
      else { textAlign(CENTER, BOTTOM); text('P(L) = ' + nf(pL, 1, 2), r.x + r.w / 2, r.y + r.h - 6); }
      textStyle(NORMAL);
      textAlign(LEFT, TOP);
    }
  });
}

function drawToken() {
  if (!token) return;
  const r = boxRects[token.stage];
  const label = token.kind === 'answer' ? 'answer' : (narrow() ? 'drag' : 'slider drag');
  const c = token.kind === 'answer' ? C_ANSWER : C_EXPOSE;
  textSize(12);
  const tw = textWidth(label) + (token.stopped ? 64 : 18);
  let x, y;
  if (narrow()) { x = r.x + r.w + 10; y = r.y + r.h / 2 - 11; }
  else { x = r.x + r.w / 2 - tw / 2; y = r.y + r.h + 8; }
  noStroke();
  fill(c);
  rect(x, y, tw, 22, 11);
  fill(token.kind === 'answer' ? 'white' : 'black');
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  text(label + (token.stopped ? '  stopped' : ''), x + 9, y + 11);
  textStyle(NORMAL);
  textAlign(LEFT, TOP);
}

// Wide layouts: the learner's evidence stream for the concept, as chips
function drawStream(x, y, w) {
  noStroke();
  fill('black');
  textSize(12.5);
  textStyle(BOLD);
  text('This learner\'s elasticity stream:', x, y + 4);
  let cx = x + textWidth('This learner\'s elasticity stream: ') + 8;
  textStyle(NORMAL);
  textSize(12);
  if (streamLog.length === 0) { fill('dimgray'); text('empty: send an event', cx, y + 4); }
  for (const ev of streamLog) {
    const t = ev.kind === 'answer' ? 'answered (right)' : 'interacted (drag)';
    const bw = textWidth(t) + 16;
    if (cx + bw > x + w) { fill('dimgray'); text('...', cx, y + 4); break; }
    fill(ev.kind === 'answer' ? C_ANSWER : [250, 222, 160]);
    rect(cx, y, bw, 22, 11);
    fill(ev.kind === 'answer' ? 'white' : 'black');
    text(t, cx + 8, y + 5);
    if (ev.kept === false) { stroke(C_STOP); strokeWeight(2); line(cx + 4, y + 11, cx + bw - 4, y + 11); strokeWeight(1); noStroke(); }
    cx += bw + 6;
  }
  fill('dimgray');
  textSize(11.5);
  text('Struck-through chips were dropped by the filter. Attempts: ' + attempts + ', exposure events: ' + exposure + '.', x, y + 28);
}

function drawInfo(r) {
  stroke('silver');
  fill(255, 255, 255, 240);
  rect(r.x, r.y, r.w, r.h, 10);
  noStroke();
  const tx = r.x + 12, tw = r.w - 24;
  const big = canvasWidth >= 760;
  const lh = narrow() ? 15 : (big ? 22 : 19);
  const fs = narrow() ? 12.5 : (big ? 16 : 15);
  let y = r.y + 10;
  textAlign(LEFT, TOP);
  const idx = selectedBox >= 0 ? selectedBox : (token ? token.stage : -1);
  if (idx < 0) {
    fill('black');
    textStyle(BOLD);
    textSize(fs + 1);
    y = drawWrapped('Click a stage, or send a sample event', tx, y, tw, lh + 2) + 4;
    textStyle(NORMAL);
    textSize(fs);
    y = drawWrapped('Each box is a stage between what a learner does and a mastery prediction. Click one to see its ' +
      'definition, what enters it, what leaves it, and an example. Hover a box to highlight its input and output.', tx, y, tw, lh) + 6;
    y = drawWrapped('Then choose Assessment answer or Slider drag and press Next stage to follow one event down the chain. ' +
      'Watch for the stage where the slider drag stops.', tx, y, tw, lh) + 8;
    const facts = [
      ['Assessment answer', 'the learner picks "lower" on the elasticity prediction and presses Check; it is correct.'],
      ['Slider drag', 'the learner drags the Elasticity slider from 0.8 to 0.6.'],
      ['Model', 'Bayesian knowledge tracing with P(L0) 0.30, p_t 0.15, p_g 0.20, p_s 0.10 (illustrative, not fitted).']
    ];
    for (const [label, body] of facts) {
      if (y + 2 * lh > r.y + r.h) break;
      textStyle(BOLD);
      fill(label === 'Slider drag' ? [150, 100, 0] : C_ANSWER);
      text(label + ':', tx, y);
      const lw = textWidth(label + ': ');
      textStyle(NORMAL);
      fill('black');
      y = drawWrapped(body, tx + lw, y, tw - lw, lh) + 3;
    }
    logOnce('intro');
    return;
  }
  const st = STAGES[idx];
  const tokenView = selectedBox < 0 && token;
  fill('black');
  textStyle(BOLD);
  textSize(fs + 1);
  const title = 'Stage ' + (idx + 1) + ' of 6: ' + st.name + (tokenView ? '  (' + (token.kind === 'answer' ? 'assessment answer' : 'slider drag') + ')' : '');
  y = drawWrapped(title, tx, y, tw, lh + 2) + 4;
  textStyle(NORMAL);
  textSize(fs);
  const parts = [];
  if (tokenView) {
    const ev = eventText(idx);
    parts.push(['This event', ev]);
    parts.push(['Stage', st.def]);
    parts.push(['Enters', st.input]);
    parts.push(['Leaves', token.stopped && idx === 3 ? 'nothing for this event: it never reaches the model' : st.output]);
  } else {
    parts.push(['Definition', st.def]);
    parts.push(['Input', st.input]);
    parts.push(['Output', st.output]);
    parts.push(['Example', st.example]);
  }
  for (const [label, body] of parts) {
    if (y + lh > r.y + r.h) break;
    fill(label === 'This event' ? (token.stopped && idx === 3 ? C_STOP : C_ANSWER) : 'black');
    textStyle(BOLD);
    text(label + ':', tx, y);
    const lw = narrow() ? 78 : (big ? 108 : 96);
    textStyle(NORMAL);
    fill('black');
    y = drawWrapped(body, tx + lw, y, tw - lw, lh) + 4;
  }
  logOnce(title + ' | ' + parts.map(p => p[0] + ': ' + p[1]).join(' | '));
}

// Event-specific text for the token's current stage
function eventText(i) {
  const n = attempts;
  if (token.kind === 'answer') {
    const before = token.before !== undefined ? token.before : pL;
    return [
      'The learner picks "lower" on the elasticity prediction and presses Check. The MicroSim marks it correct.',
      'Emitted: answered, object .../sims/bouncing-ball/#q1, result.success = true, concept_id elasticity.',
      'Appended to this learner\'s elasticity stream, after ' + exposure + ' exposure event' + (exposure === 1 ? '' : 's') + '.',
      'Kept: it carries result.success, so it counts as an attempt (attempts = ' + n + ').',
      'BKT update on a correct answer: conditioning ' + nf(before, 1, 2) + ' to ' + nf(token.cond, 1, 2) +
        ', then the learning step ' + nf(token.cond, 1, 2) + ' + (1 - ' + nf(token.cond, 1, 2) + ') x 0.15 = ' + nf(token.after, 1, 2) + '.',
      'The estimate rises from ' + nf(before, 1, 2) + ' to P(L) = ' + nf(token.after, 1, 2) + '. Predicted chance the next answer is correct: ' +
        nf(token.after, 1, 2) + ' x 0.90 + ' + nf(1 - token.after, 1, 2) + ' x 0.20 = ' + nf(predictCorrect(token.after), 1, 2) + '.'
    ][i];
  }
  return [
    'The learner drags the Elasticity slider from 0.8 to 0.6.',
    'Emitted: interacted, object .../sims/bouncing-ball/#elasticity-slider, value 0.6, previous-value 0.8, no success, concept_id elasticity.',
    'Appended to the elasticity stream. It is real exposure evidence that the learner engaged.',
    'Stopped here. attempts = 0: no right-or-wrong to condition on. The estimate stays at ' + nf(pL, 1, 2) + '.',
    '', ''
  ][i];
}

function logOnce(txt) {
  if (txt === lastLogged) return;
  lastLogged = txt;
  if (txt !== 'intro') console.log('[infobox] ' + txt);
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

// ---------- Mouse ----------
function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight) return;
  for (let i = 0; i < boxRects.length; i++) {
    const r = boxRects[i];
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) {
      selectedBox = (token && token.stage === i && selectedBox === i) ? -1 : i;
      return;
    }
  }
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
