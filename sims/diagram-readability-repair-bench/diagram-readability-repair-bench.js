// Readability Repair Bench - critique a cluttered flowchart and repair it in order of effect
// CANVAS_HEIGHT: 655
// Learning objective (Evaluate / critique): the learner critiques a cluttered diagram against
// the seven readability standards from Chapter 8 and repairs it by applying fixes in order
// of effect.
//
// Model: five repairs toggle five flags. Each of the seven standards is met or not as a
// function of those flags. Two repairs fix two standards each (split, shorten labels), and
// enlarging fonts BEFORE shortening the labels makes long labels overflow their boxes, which
// breaks the Layout standard - so the order of the repairs matters.

// ---------- Canvas dimensions (standard MicroSim layout) ----------
let canvasWidth = 400;                 // updated from the container width
let drawHeight = 540;                  // drawing region (aliceblue)
let controlHeight = 115;               // control region (white): 3 rows x 35 + 10
let canvasHeight = drawHeight + controlHeight;   // 655
let margin = 25;
let defaultTextSize = 16;

// ---------- The seven standards (Chapter 8, "Making Diagrams Readable") ----------
const STANDARDS = [
  { key: 'text',     name: 'Text size',     rule: 'Node text at least 16 px' },
  { key: 'contrast', name: 'Contrast',      rule: 'Text contrast at least 4.5:1' },
  { key: 'length',   name: 'Label length',  rule: 'Two to five words per node' },
  { key: 'size',     name: 'Size',          rule: 'About 15 nodes or fewer' },
  { key: 'color',    name: 'Color use',     rule: 'Color paired with a symbol' },
  { key: 'interact', name: 'Interaction',   rule: 'Hover text; panels beside' },
  { key: 'layout',   name: 'Layout',        rule: 'Room to read; no crossings' }
];

// ---------- The flowchart: 20 steps for building and publishing a MicroSim ----------
// type: step | decision | fix (red) | done (green); flaw: the node's most visible flaw
const NODES = [
  { id: 1,  type: 'step',     flaw: 'text',     short: 'Identify the concept',  long: 'Teacher reads the chapter and identifies a concept that needs a MicroSim' },
  { id: 2,  type: 'step',     flaw: 'length',   short: 'Write the objective',   long: 'Write one clear learning objective that names a Bloom level and an action verb for the learner' },
  { id: 3,  type: 'step',     flaw: 'contrast', short: 'Draft the specification', long: 'Draft the specification with layout, data, controls and behavior' },
  { id: 4,  type: 'step',     flaw: 'text',     short: 'Choose the library',    long: 'Choose the visualization library that fits the content structure' },
  { id: 5,  type: 'step',     flaw: 'length',   short: 'Run the generator',     long: 'Run the generator skill so that it scaffolds every file the new MicroSim needs in its folder' },
  { id: 6,  type: 'step',     flaw: 'contrast', short: 'Write the JavaScript',  long: 'Implement the JavaScript file and adjust the main HTML page' },
  { id: 7,  type: 'decision', flaw: 'text',     short: 'Loads without errors?', long: 'Does the MicroSim load in the browser without console errors?' },
  { id: 8,  type: 'fix',      flaw: 'color',    short: 'Fix console errors',    long: 'Fix the JavaScript errors reported in the browser console' },
  { id: 9,  type: 'step',     flaw: 'length',   short: 'Run automated checks',  long: 'Run the automated checks for the metadata, the iframe height and the control layout of the page' },
  { id: 10, type: 'decision', flaw: 'contrast', short: 'Checks pass?',          long: 'Do all automated checks pass with a score of 85 or more?' },
  { id: 11, type: 'fix',      flaw: 'color',    short: 'Repair failed checks',  long: 'Repair the failing items listed in the validator report' },
  { id: 12, type: 'step',     flaw: 'length',   short: 'Capture a screenshot',  long: 'Capture a screenshot of the finished MicroSim at exactly the height of the iframe that embeds it' },
  { id: 13, type: 'step',     flaw: 'contrast', short: 'Review the layout',     long: 'Review the screenshot against every item on the visual checklist' },
  { id: 14, type: 'decision', flaw: 'text',     short: 'Layout defects?',       long: 'Does the layout review find clipped or overlapping elements?' },
  { id: 15, type: 'fix',      flaw: 'color',    short: 'Patch the layout',      long: 'Patch the layout defects and capture a new screenshot' },
  { id: 16, type: 'step',     flaw: 'length',   short: 'Write the lesson plan', long: 'Write the lesson plan, the references and the embed code in the index page for teachers to use' },
  { id: 17, type: 'step',     flaw: 'contrast', short: 'Embed in the chapter',  long: 'Add the MicroSim to the chapter and to the site navigation' },
  { id: 18, type: 'step',     flaw: 'text',     short: 'Try it with a class',   long: 'Ask a colleague to try the MicroSim with a class of learners' },
  { id: 19, type: 'done',     flaw: 'color',    short: 'MicroSim published',    long: 'The MicroSim is published and ready for learners' },
  { id: 20, type: 'done',     flaw: 'color',    short: 'Learners use it',       long: 'Learners use the MicroSim and their interactions are recorded' }
];
// [from, to, kind]  kind: next | yes | no | back
const EDGES = [
  [1, 2, 'next'], [2, 3, 'next'], [3, 4, 'next'], [4, 5, 'next'], [5, 6, 'next'], [6, 7, 'next'],
  [7, 9, 'yes'], [7, 8, 'no'], [8, 6, 'back'],
  [9, 10, 'next'], [10, 12, 'yes'], [10, 11, 'no'], [11, 9, 'back'],
  [12, 13, 'next'], [13, 14, 'next'], [14, 15, 'yes'], [14, 16, 'no'], [15, 13, 'back'],
  [16, 17, 'next'], [17, 18, 'next'], [18, 19, 'next'], [19, 20, 'next']
];
// After the split: part 1 builds the MicroSim, part 2 checks and publishes it.
// Positions are fractions of the diagram area; the "to part 2" connector replaces 7 -> 9.
const PART1 = { 1: [0.13, 0.2], 2: [0.38, 0.2], 3: [0.63, 0.2], 4: [0.87, 0.2],
                5: [0.87, 0.55], 6: [0.63, 0.55], 7: [0.38, 0.55], 8: [0.38, 0.87] };
const PART2 = { 9: [0.13, 0.13], 10: [0.38, 0.13], 12: [0.63, 0.13], 13: [0.87, 0.13],
                11: [0.38, 0.4], 15: [0.63, 0.4], 14: [0.87, 0.4],
                16: [0.87, 0.67], 17: [0.63, 0.67], 18: [0.38, 0.67], 19: [0.13, 0.67],
                20: [0.13, 0.92] };
// Narrow screens (under 600 px) use three columns so 16 px labels still fit their boxes.
const PART1_NARROW = { 1: [0.17, 0.12], 2: [0.5, 0.12], 3: [0.83, 0.12], 4: [0.83, 0.4],
                       5: [0.5, 0.4], 6: [0.17, 0.4], 7: [0.17, 0.68], 8: [0.5, 0.92] };
const PART2_NARROW = { 9: [0.17, 0.1], 10: [0.5, 0.1], 12: [0.83, 0.1], 11: [0.5, 0.3],
                       13: [0.83, 0.3], 15: [0.5, 0.5], 14: [0.83, 0.5], 16: [0.83, 0.7],
                       17: [0.5, 0.7], 18: [0.17, 0.7], 19: [0.17, 0.9], 20: [0.5, 0.9] };
const CONNECTOR = { 1: [0.13, 0.55], 2: [0.13, 0.4] };
const CONNECTOR_NARROW = { 1: [0.83, 0.68], 2: [0.17, 0.3] };

// ---------- State ----------
const repairs = { fonts: false, shorten: false, contrast: false, split: false, symbols: false };
let repairLog = [];                    // [{key, label, gained:[], lost:[]}]
const found = {};                      // standard key -> learner has clicked a flaw of this kind
let showBefore = false;                // Before / After toggle
let part = 1;                          // which half is shown after the split
let message = 'Click anything that looks wrong in the diagram to name the standard it breaks. Then repair it: the order of the repairs matters.';
let messageColor = 'black';
let hoverNode = null;
let boxes = [];                        // hit regions of drawn nodes: {node, x, y, w, h}
let edgeSegs = [];                     // hit regions of crossing edges: {x1, y1, x2, y2}
let overlayBox = null;                 // the notes overlay in the cluttered diagram

// ---------- Layout regions (recomputed on resize) ----------
let narrow = false;
let dArea = {}, cArea = {}, mArea = {};

// ---------- Controls ----------
let fontsBtn, shortenBtn, contrastBtn, splitBtn, symbolsBtn, beforeBtn, resetBtn, partBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  fontsBtn = makeButton('Enlarge fonts', () => applyRepair('fonts'));
  shortenBtn = makeButton('Shorten labels', () => applyRepair('shorten'));
  contrastBtn = makeButton('Fix contrast', () => applyRepair('contrast'));
  splitBtn = makeButton('Split into two', () => applyRepair('split'));
  symbolsBtn = makeButton('Add symbols', () => applyRepair('symbols'));
  beforeBtn = makeButton('Show Before', toggleBefore);
  resetBtn = makeButton('Reset', resetBench);
  partBtn = makeButton('Show part 2', togglePart);
  positionControls();
  updateButtons();

  describe('A cluttered 20-step flowchart about building a MicroSim, with tiny low-contrast text, ' +
    'long labels, crossing arrows and red and green boxes with no symbols, beside a checklist of ' +
    'seven readability standards with status lights. Buttons apply five repairs.', LABEL);
}

function makeButton(label, fn) {
  const b = createButton(label);
  b.mousePressed(fn);
  b.style('font-size', '15px');
  return b;
}

let repairsTextX = 260;

// place each row of buttons left to right using their rendered widths
function positionControls() {
  const rows = [[fontsBtn, shortenBtn, contrastBtn], [splitBtn, symbolsBtn], [beforeBtn, resetBtn, partBtn]];
  rows.forEach((row, i) => {
    let x = 10;
    for (const b of row) {
      b.position(x, drawHeight + 6 + i * 35);
      x += b.elt.offsetWidth + 8;
    }
    if (i === 2) repairsTextX = x + 8;
  });
}

// ---------- Standards as a function of the repairs ----------
function standardsMet(r) {
  return {
    text: r.fonts,
    contrast: r.contrast,
    length: r.shorten,
    size: r.split,
    color: r.symbols,
    interact: r.shorten,                           // long text moves into hover text
    layout: r.split && !(r.fonts && !r.shorten)    // big fonts + long labels overflow
  };
}

function countMet(m) {
  return Object.values(m).filter(v => v).length;
}

function viewRepairs() {
  return showBefore ? { fonts: false, shorten: false, contrast: false, split: false, symbols: false } : repairs;
}

// ---------- Draw ----------
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
  textAlign(CENTER, TOP);
  textSize(narrow ? 18 : 22);
  text('Readability Repair Bench', narrow ? canvasWidth / 2 : dArea.x + dArea.w / 2, 8);

  drawDiagram();
  drawChecklist();
  drawMessage();
  drawControlText();
}

function drawDiagram() {
  const r = viewRepairs();
  // panel
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(dArea.x, dArea.y, dArea.w, dArea.h, 6);
  boxes = [];
  edgeSegs = [];
  overlayBox = null;

  // view tag
  noStroke();
  textSize(13);
  textAlign(LEFT, TOP);
  fill(showBefore ? 'firebrick' : 'dimgray');
  let tag = showBefore ? 'BEFORE (original)'
    : (repairLog.length ? 'AFTER (' + repairLog.length + ' of 5 repairs)' : 'CURRENT (no repairs yet)');
  if (r.split) tag += ' · part ' + part + ' of 2';
  text(tag, dArea.x + 6, dArea.y + 4);

  const inner = { x: dArea.x + 6, y: dArea.y + 20, w: dArea.w - 12, h: dArea.h - 26 };
  // keep overflowing labels inside the diagram panel
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(dArea.x + 1, dArea.y + 1, dArea.w - 2, dArea.h - 2);
  drawingContext.clip();
  if (r.split) drawSplit(inner, r);
  else drawCluttered(inner, r);
  drawingContext.restore();
}

// 20 nodes in a 5 x 4 snake grid: crowded, with branch arrows drawn across other boxes
function drawCluttered(a, r) {
  const cols = 5, rows = 4;
  const cw = a.w / cols, ch = a.h / rows;
  const pos = {};
  NODES.forEach((n, i) => {
    const row = floor(i / cols);
    let col = i % cols;
    if (row % 2 === 1) col = cols - 1 - col;
    pos[n.id] = { x: a.x + (col + 0.5) * cw, y: a.y + (row + 0.5) * ch };
  });
  const bw = cw * 0.9, bh = ch * 0.62;
  // forward edges first (short), boxes, then the long branch edges on top (the crossing flaw)
  for (const [f, t, kind] of EDGES) {
    if (kind === 'next' && abs(NODES.findIndex(n => n.id === t) - NODES.findIndex(n => n.id === f)) === 1) {
      drawArrow(pos[f], pos[t], bw, bh, color(150), 1);
    }
  }
  for (const n of NODES) drawNode(n, pos[n.id].x, pos[n.id].y, bw, bh, r, false);
  for (const [f, t, kind] of EDGES) {
    const straight = kind === 'next' && abs(NODES.findIndex(n => n.id === t) - NODES.findIndex(n => n.id === f)) === 1;
    if (!straight) {
      const c = kind === 'no' || kind === 'back' ? color(170, 170, 170) : color(150);
      drawArrow(pos[f], pos[t], bw, bh, c, 1);
      edgeSegs.push({ x1: pos[f].x, y1: pos[f].y, x2: pos[t].x, y2: pos[t].y });
    }
  }
  // notes overlay that covers part of the diagram (Interaction flaw) until labels move to hover text
  if (!r.shorten) {
    const ow = min(170, a.w * 0.36), oh = 58;
    overlayBox = { x: a.x + a.w - ow - 2, y: a.y + ch * 0.55, w: ow, h: oh };
    stroke(200);
    fill(255, 250, 205, 245);
    rect(overlayBox.x, overlayBox.y, ow, oh, 4);
    noStroke();
    fill(r.contrast ? 30 : 'khaki');
    textSize(r.fonts ? 14 : 9);
    textAlign(LEFT, TOP);
    text('NOTES: red boxes are fixes, green boxes are the end. Steps 7, 10 and 14 branch.',
      overlayBox.x + 5, overlayBox.y + 4, ow - 10, oh - 6);
  }
  if (r.symbols) drawColorLegend(a);
}

function drawSplit(a, r) {
  const layout = narrow ? (part === 1 ? PART1_NARROW : PART2_NARROW) : (part === 1 ? PART1 : PART2);
  const ids = Object.keys(layout).map(Number);
  const pos = {};
  for (const id of ids) pos[id] = { x: a.x + layout[id][0] * a.w, y: a.y + layout[id][1] * a.h };
  const bw = narrow ? a.w * 0.31 : min(a.w * 0.22, 150);
  const bh = narrow ? min(a.h * (part === 1 ? 0.2 : 0.165), 48) : min(max(a.h * (part === 1 ? 0.2 : 0.16), 34), 52);
  // connector between the parts
  const cn = (narrow ? CONNECTOR_NARROW : CONNECTOR)[part];
  if (part === 1) pos.p2 = { x: a.x + cn[0] * a.w, y: a.y + cn[1] * a.h };
  else pos.p1 = { x: a.x + cn[0] * a.w, y: a.y + cn[1] * a.h };
  for (const [f, t, kind] of EDGES) {
    const fIn = pos[f] !== undefined && ids.includes(f);
    const tIn = pos[t] !== undefined && ids.includes(t);
    if (fIn && tIn) drawArrow(pos[f], pos[t], bw, bh, color(90), 1.5, kind);
    else if (part === 1 && f === 7 && t === 9) drawArrow(pos[7], pos.p2, bw, bh, color(90), 1.5, 'yes');
  }
  if (part === 2) drawArrow(pos.p1, pos[9], bw * 0.7, bh, color(90), 1.5, 'next');
  for (const id of ids) drawNode(NODES[id - 1], pos[id].x, pos[id].y, bw, bh, r, true);
  // connector circles
  const cp = part === 1 ? pos.p2 : pos.p1;
  stroke(90);
  fill('lavender');
  strokeWeight(1.5);
  ellipse(cp.x, cp.y, min(bw * 0.8, 90), bh);
  noStroke();
  fill(20);
  textAlign(CENTER, CENTER);
  textSize(r.fonts ? 15 : 9);
  text(part === 1 ? 'To part 2' : 'From part 1', cp.x, cp.y);
  if (r.symbols) drawColorLegend(a);
}

function drawColorLegend(a) {
  const items = [['✓ done', 'palegreen'], ['✗ fix', 'lightpink'], ['? decision', 'lightyellow']];
  textSize(13);
  let x = a.x + a.w - 4;
  const y = a.y - 16;
  textAlign(RIGHT, TOP);
  for (let i = items.length - 1; i >= 0; i--) {
    const [label, c] = items[i];
    const w = fontWidth(label) + 10;
    stroke(120);
    fill(c);
    rect(x - w, y, w, 16, 3);
    noStroke();
    fill(20);
    text(label, x - 5, y + 1);
    x -= w + 6;
  }
}

function drawNode(n, cx, cy, w, h, r, spaced) {
  const x = cx - w / 2, y = cy - h / 2;
  // fill: color carries meaning; before the symbols repair it is the ONLY carrier
  let fillC = 'white';
  if (n.type === 'fix') fillC = r.symbols ? 'lightpink' : 'lightcoral';
  if (n.type === 'done') fillC = r.symbols ? 'palegreen' : 'lightgreen';
  if (n.type === 'decision' && r.symbols) fillC = 'lightyellow';
  const isHover = hoverNode === n.id && !showBefore;
  stroke(isHover ? 'dodgerblue' : (spaced ? 90 : 170));
  strokeWeight(isHover ? 2.5 : 1);
  fill(fillC);
  rect(x, y, w, h, n.type === 'decision' && r.symbols ? 12 : 3);
  boxes.push({ node: n, x, y, w, h });

  // label text
  const label = r.shorten ? n.short : n.long;
  let ts = r.fonts ? 16 : 9;
  let txtC = color(40);
  if (n.flaw === 'contrast' && !r.contrast) txtC = color('khaki');
  if (r.contrast) txtC = color(15);
  textSize(ts);
  let prefix = '';
  if (r.symbols) prefix = n.type === 'fix' ? '✗ ' : n.type === 'done' ? '✓ ' : n.type === 'decision' ? '? ' : '';
  const lines = wrapLines(prefix + label, w - (narrow ? 4 : 8));
  const lh = ts * 1.15;
  let ty = cy - (lines.length * lh) / 2 + lh / 2;
  noStroke();
  fill(txtC);
  textAlign(CENTER, CENTER);
  for (const line of lines) {           // no clipping: long labels at 16 px spill out of the box
    text(line, cx, ty);
    ty += lh;
  }
}

function wrapLines(str, maxW) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (fontWidth(test) <= maxW || !line) line = test;
    else { lines.push(line); line = w; }
  }
  if (line) lines.push(line);
  return lines;
}

function drawArrow(p, q, bw, bh, c, wgt, kind) {
  // clip the segment to the box borders so arrowheads touch the boxes
  const a = clipToBox(q, p, bw, bh), b = clipToBox(p, q, bw, bh);
  stroke(c);
  strokeWeight(wgt);
  line(a.x, a.y, b.x, b.y);
  const ang = atan2(b.y - a.y, b.x - a.x);
  fill(c);
  noStroke();
  push();
  translate(b.x, b.y);
  rotate(ang);
  triangle(0, 0, -8, -4, -8, 4);
  pop();
  if ((kind === 'yes' || kind === 'no') && dist(a.x, a.y, b.x, b.y) > 34) {
    noStroke();
    fill(60);
    textSize(12);
    textAlign(CENTER, CENTER);
    const horiz = abs(b.x - a.x) > abs(b.y - a.y);
    text(kind === 'yes' ? 'yes' : 'no', (a.x + b.x) / 2 + (horiz ? 0 : 12), (a.y + b.y) / 2 - (horiz ? 9 : 0));
  }
}

function clipToBox(from, center, bw, bh) {
  // point where the segment from "from" to "center" enters the box around "center"
  const dx = from.x - center.x, dy = from.y - center.y;
  if (dx === 0 && dy === 0) return { x: center.x, y: center.y };
  const sx = (bw / 2) / max(abs(dx), 0.0001), sy = (bh / 2) / max(abs(dy), 0.0001);
  const s = min([sx, sy, 1]);
  return { x: center.x + dx * s, y: center.y + dy * s };
}

function drawChecklist() {
  const r = viewRepairs();
  const met = standardsMet(r);
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(cArea.x, cArea.y, cArea.w, cArea.h, 6);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(narrow ? 15 : 17);
  textStyle(BOLD);
  text('Score: ' + countMet(met) + ' / 7 standards met', cArea.x + 10, cArea.y + (narrow ? 6 : 8));
  textStyle(NORMAL);

  const cols = narrow ? 2 : 1;
  const top = cArea.y + (narrow ? 27 : 38);
  const rowH = narrow ? (cArea.h - 30) / 4 : (cArea.h - 46) / 7;
  const colW = (cArea.w - 12) / cols;
  STANDARDS.forEach((s, i) => {
    const col = narrow ? floor(i / 4) : 0;
    const row = narrow ? i % 4 : i;
    const x = cArea.x + 8 + col * colW, y = top + row * rowH;
    // status light: green = met, red = violation found by the learner, grey = not yet checked
    let light = 'lightgray', status = 'not checked';
    if (met[s.key]) { light = 'limegreen'; status = 'met'; }
    else if (found[s.key]) { light = 'red'; status = 'violated'; }
    stroke(80);
    strokeWeight(1);
    fill(light);
    circle(x + 9, y + 9, narrow ? 14 : 16);
    noStroke();
    fill(20);
    textSize(narrow ? 14 : 16);
    textAlign(LEFT, TOP);
    text(s.name, x + 24, y + 1);
    if (!narrow) {
      const nw = fontWidth(s.name);
      textSize(13);
      fill(status === 'met' ? 'darkgreen' : status === 'violated' ? 'firebrick' : 'gray');
      text(status, x + 30 + nw, y + 3);
      fill(70);
      text(s.rule, x + 24, y + 21);
    }
  });
}

function drawMessage() {
  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 235);
  rect(mArea.x, mArea.y, mArea.w, mArea.h, 6);
  noStroke();
  fill(messageColor);
  textSize(14);
  textLeading(17);
  textAlign(LEFT, TOP);
  let msg = message;
  if (hoverNode !== null && !showBefore) {
    const n = NODES[hoverNode - 1];
    msg = repairs.shorten
      ? 'Hover text for "' + n.short + '": ' + n.long + '.'
      : 'No hover text on this node: all of its text is crammed into the label.';
  }
  text(msg, mArea.x + 8, mArea.y + 6, mArea.w - 16, mArea.h - 8);
}

function drawControlText() {
  noStroke();
  fill(70);
  textSize(14);
  textAlign(LEFT, CENTER);
  text('Repairs: ' + repairLog.length + ' / 5', repairsTextX, drawHeight + 93);
}

// ---------- Interaction ----------
function mouseMoved() {
  hoverNode = null;
  if (showBefore) return;
  for (const b of boxes) {
    if (mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h) {
      hoverNode = b.node.id;
      return;
    }
  }
}

function mousePressed() {
  if (mouseY > drawHeight || mouseX < dArea.x || mouseX > dArea.x + dArea.w ||
      mouseY < dArea.y || mouseY > dArea.y + dArea.h) return;
  const r = viewRepairs();
  const met = standardsMet(r);
  // 1. overlay box
  if (overlayBox && inRect(mouseX, mouseY, overlayBox)) return nameFlaw('interact', 'This notes box sits on top of the diagram and hides part of it, and no node has hover text. Put details in hover text or a panel beside the diagram.');
  // 2. a node: its most visible remaining flaw
  for (const b of boxes) {
    if (inRect(mouseX, mouseY, b)) return critiqueNode(b.node, r, met);
  }
  // 3. a crossing branch arrow
  for (const s of edgeSegs) {
    if (distToSegment(mouseX, mouseY, s) < 7) return nameFlaw('layout', 'This branch arrow runs across other boxes, and the boxes are packed with almost no space between them. Readers lose the path.');
  }
  // 4. empty background
  if (!r.split) return nameFlaw('size', 'The diagram has 20 nodes. The standard is to split a diagram that exceeds about 15 nodes into several smaller ones.');
  message = 'Nothing wrong here. Click a box or an arrow to check it.';
  messageColor = 'black';
}

function critiqueNode(n, r, met) {
  const order = [n.flaw, 'text', 'length', 'contrast', 'color', 'interact', 'layout'];
  const texts = {
    text: 'This label is drawn at ' + (r.fonts ? 16 : 9) + ' px. The standard is at least 16 px.',
    length: '"' + n.long + '" is ' + n.long.split(' ').length + ' words. The standard is two to five.',
    contrast: 'Pale yellow text on white is about 1.3:1. The standard is at least 4.5:1.',
    color: 'Red and green are the only signal that this is a ' + (n.type === 'fix' ? 'fix step' : 'finished step') + '. Add a symbol or label for readers who cannot tell the colors apart.',
    interact: 'This node has no hover text; every word has to live in the label.',
    layout: 'At this font size the long label spills out of its box and over its neighbors.'
  };
  for (const key of order) {
    if (met[key]) continue;
    if (key === 'contrast' && n.flaw !== 'contrast') continue;       // only pale-text nodes
    if (key === 'color' && n.type !== 'fix' && n.type !== 'done') continue;
    if (key === 'layout' && !(r.fonts && !r.shorten)) continue;
    return nameFlaw(key, texts[key]);
  }
  message = '"' + (r.shorten ? n.short : n.long) + '" now meets the standards that apply to a single box.';
  messageColor = 'darkgreen';
}

function nameFlaw(key, text) {
  found[key] = true;
  const s = STANDARDS.find(x => x.key === key);
  message = 'Violates ' + s.name + '. ' + text;
  messageColor = 'firebrick';
}

function inRect(x, y, b) {
  return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
}

function distToSegment(px, py, s) {
  const dx = s.x2 - s.x1, dy = s.y2 - s.y1;
  const t = constrain(((px - s.x1) * dx + (py - s.y1) * dy) / (dx * dx + dy * dy), 0, 1);
  return dist(px, py, s.x1 + t * dx, s.y1 + t * dy);
}

// ---------- Repairs ----------
const REPAIR_LABELS = { fonts: 'Enlarge fonts', shorten: 'Shorten labels', contrast: 'Fix contrast',
                        split: 'Split into two', symbols: 'Add symbols' };

function applyRepair(key) {
  if (repairs[key]) return;
  showBefore = false;
  const before = standardsMet(repairs);
  repairs[key] = true;
  const after = standardsMet(repairs);
  const gained = STANDARDS.filter(s => after[s.key] && !before[s.key]).map(s => s.name);
  const lost = STANDARDS.filter(s => !after[s.key] && before[s.key]).map(s => s.name);
  repairLog.push({ key, label: REPAIR_LABELS[key], gained, lost, net: gained.length - lost.length });
  let msg = REPAIR_LABELS[key] + ': ' + (gained.length ? '+' + gained.length + ' (' + gained.join(', ') + ')' : 'no new standard met');
  if (lost.length) msg += ', but ' + lost.join(', ') + ' now fails';
  if (key === 'fonts' && !repairs.shorten) msg += '. The long labels no longer fit their boxes: shortening them first would have avoided this';
  msg += '. Score ' + countMet(after) + ' / 7.';
  if (repairLog.length === 5) msg = orderSummary();
  message = msg;
  messageColor = lost.length ? 'darkorange' : 'darkgreen';
  if (repairLog.length === 5) messageColor = 'black';
  updateButtons();
}

const SHORT_NAMES = { fonts: 'Fonts', shorten: 'Shorten', contrast: 'Contrast', split: 'Split', symbols: 'Symbols' };

function orderSummary() {
  const steps = repairLog.map(l => SHORT_NAMES[l.key] + ' ' + (l.net >= 0 ? '+' : '') + l.net).join(', ');
  const first = repairLog.slice(0, 2).map(l => l.key).sort().join(',');
  const fontsIdx = repairLog.findIndex(l => l.key === 'fonts');
  const shortIdx = repairLog.findIndex(l => l.key === 'shorten');
  let verdict;
  if (first === 'shorten,split') verdict = 'You applied the two largest-effect repairs first. Well judged.';
  else if (fontsIdx < shortIdx) verdict = 'Enlarging fonts before shortening cost a step: start with split and shorten (two standards each).';
  else verdict = 'For the biggest early gain, start with split and shorten, which fix two standards each.';
  return 'All 7 met. Order: ' + steps + '. ' + verdict;
}

function toggleBefore() {
  showBefore = !showBefore;
  updateButtons();
}

function togglePart() {
  part = part === 1 ? 2 : 1;
  updateButtons();
}

function resetBench() {
  for (const k of Object.keys(repairs)) repairs[k] = false;
  for (const k of Object.keys(found)) delete found[k];
  repairLog = [];
  showBefore = false;
  part = 1;
  message = 'Reset. Click anything that looks wrong in the diagram to name the standard it breaks, then repair it.';
  messageColor = 'black';
  updateButtons();
}

function updateButtons() {
  const btns = { fonts: fontsBtn, shorten: shortenBtn, contrast: contrastBtn, split: splitBtn, symbols: symbolsBtn };
  for (const [k, b] of Object.entries(btns)) {
    if (repairs[k]) b.attribute('disabled', ''); else b.removeAttribute('disabled');
    b.html((repairs[k] ? '✓ ' : '') + REPAIR_LABELS[k]);
  }
  beforeBtn.html(showBefore ? 'Show After' : 'Show Before');
  partBtn.html(part === 1 ? 'Show part 2' : 'Show part 1');
  if (repairs.split && !showBefore) partBtn.show(); else partBtn.hide();
  positionControls();
}

// ---------- Responsive design ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
  narrow = canvasWidth < 600;
  const top = 36, msgH = 72;
  mArea = { x: 8, y: drawHeight - msgH - 5, w: canvasWidth - 16, h: msgH };
  if (narrow) {
    // checklist moves below the diagram
    dArea = { x: 8, y: top, w: canvasWidth - 16, h: 323 };
    cArea = { x: 8, y: top + 328, w: canvasWidth - 16, h: mArea.y - (top + 328) - 5 };
  } else {
    const dw = floor((canvasWidth - 24) * 2 / 3);
    dArea = { x: 8, y: top, w: dw, h: mArea.y - top - 6 };
    cArea = { x: dw + 16, y: top, w: canvasWidth - dw - 24, h: mArea.y - top - 6 };
    mArea.w = dw;
    // the message box sits under the diagram; the checklist runs the full height
    cArea.h = drawHeight - top - 6;
  }
}
