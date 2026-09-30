// Cognitive Load Balance Lab
// CANVAS_HEIGHT: 625
// Toggle design features on a mock bouncing-ball MicroSim and watch a qualitative load gauge
// split into intrinsic, extraneous and germane load. The weights are fixed and illustrative:
// the gauge is a teaching illustration, not a measurement of any real learner.

// ----- Standard MicroSim layout -----
let canvasWidth = 400;
let drawHeight = 410;
let controlHeight = 215;   // up to 6 rows of controls at 400 px wide
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let sliderLeftMargin = 210;
let defaultTextSize = 16;

// ----- Illustrative weights (arbitrary units; comfortable capacity = 100) -----
const CAPACITY = 100;
// intrinsic load by number of variables: each variable adds elements and interactions
const INTRINSIC_BY_VARS = [10, 22, 36, 52, 70, 90];
// (listed in an order that packs into few rows; the learner discovers each feature's load type)
const FEATURES = [
  { key: 'particles', label: 'Decorative particle trail', type: 'extraneous', weight: 18 },
  { key: 'sound', label: 'Sound effects', type: 'extraneous', weight: 12 },
  { key: 'predict', label: 'Prediction prompt before each run', type: 'germane', weight: 12 },
  { key: 'explain', label: 'Ask for a one-sentence explanation', type: 'germane', weight: 10 },
  { key: 'far', label: 'Instructions far from the drawing', type: 'extraneous', weight: 15 }
];
const VAR_NAMES = ['gravity', 'bounciness', 'air drag', 'ball mass', 'floor friction', 'wind'];
const COLORS = { intrinsic: 'steelblue', extraneous: 'indianred', germane: 'seagreen' };

// The two designs from the Chapter 3 worked example
const DESIGNER_A = { vars: 2, particles: false, sound: false, far: false, predict: true, explain: false };
const DESIGNER_B = { vars: 6, particles: true, sound: false, far: true, predict: false, explain: false };

// ----- Controls -----
let varSlider;
let boxes = {};
let buttonA, buttonB;
let lastDesign = 'Designer A';

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  varSlider = createSlider(1, 6, 2, 1);
  varSlider.input(() => { lastDesign = ''; });
  for (const f of FEATURES) {
    boxes[f.key] = createCheckbox(' ' + f.label, false);
    boxes[f.key].style('display', 'inline-block');   // so offsetWidth is the label width
    boxes[f.key].style('white-space', 'nowrap');
    boxes[f.key].changed(() => { lastDesign = ''; });
  }
  buttonA = createButton('Reset to Designer A');
  buttonA.mousePressed(() => loadDesign(DESIGNER_A, 'Designer A'));
  buttonB = createButton('Set to Designer B');
  buttonB.mousePressed(() => loadDesign(DESIGNER_B, 'Designer B'));

  loadDesign(DESIGNER_A, 'Designer A');
  positionControls();

  describe('Cognitive load balance lab. On the left is a small mock of a bouncing-ball MicroSim ' +
    'that shows the chosen features: sliders, a particle trail, sound, distant instructions, a ' +
    'prediction prompt and an explanation box. On the right a stacked bar splits the illustrative ' +
    'load into intrinsic, extraneous and germane segments against a comfortable capacity line; the ' +
    'bar turns amber when the total passes the line and a message names the largest extraneous ' +
    'contributor. The gauge is a teaching illustration, not a measurement of any learner.', LABEL);
}

function loadDesign(d, name) {
  varSlider.value(d.vars);
  for (const f of FEATURES) boxes[f.key].checked(d[f.key]);
  lastDesign = name;
}

// Current load values
function computeLoad() {
  const v = varSlider.value();
  const load = { intrinsic: INTRINSIC_BY_VARS[v - 1], extraneous: 0, germane: 0, parts: [] };
  load.parts.push({ label: v + (v === 1 ? ' variable' : ' variables'), type: 'intrinsic', weight: load.intrinsic });
  for (const f of FEATURES) {
    if (boxes[f.key].checked()) {
      load[f.type] += f.weight;
      load.parts.push({ label: f.label, type: f.type, weight: f.weight, key: f.key });
    }
  }
  load.total = load.intrinsic + load.extraneous + load.germane;
  return load;
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
  const load = computeLoad();

  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(narrow ? 18 : 20);
  text('Cognitive Load Balance Lab', margin, 10);
  if (lastDesign) {
    textSize(14);
    fill('dimgray');
    textAlign(RIGHT, TOP);
    text(lastDesign, canvasWidth - margin, 14);
  }

  if (narrow) {
    drawMock(margin, 40, canvasWidth - 2 * margin, 170, true);
    drawGauge(margin, 222, canvasWidth - 2 * margin, drawHeight - 222 - 30, load, true);
  } else {
    const mockW = canvasWidth * 0.42;
    drawMock(margin, 42, mockW, drawHeight - 42 - 40, false);
    drawGauge(margin + mockW + 20, 42, canvasWidth - mockW - 2 * margin - 20, drawHeight - 42 - 40, load, false);
  }

  // Caption required by the specification
  noStroke();
  fill('dimgray');
  textSize(12);
  textStyle(ITALIC);
  textAlign(LEFT, BOTTOM);
  text('Teaching illustration: fixed, made-up weights. It is not a measurement of any real learner.',
    margin, drawHeight - 8, canvasWidth - 2 * margin);
  textStyle(NORMAL);

  drawControlLabels();
}

// ---------------------------------------------------------------
// Mock bouncing-ball MicroSim
// ---------------------------------------------------------------
function drawMock(x, y, w, h, narrow) {
  const v = varSlider.value();
  const far = boxes.far.checked();
  // when instructions are far away they take a column beside the mock
  const instrW = far ? min(110, w * 0.3) : 0;
  const mw = w - instrW - (far ? 8 : 0);
  const sliderRows = v;
  const ctrlH = narrow ? min(60, 8 + sliderRows * 9) : 12 + sliderRows * 14;
  const promptH = (boxes.predict.checked() ? 24 : 0) + (boxes.explain.checked() ? 24 : 0);
  const drawH = h - ctrlH - promptH - 18;

  // frame and label
  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(LEFT, TOP);
  text('Mock MicroSim', x, y);
  const fy = y + 16;

  // draw region
  stroke('silver');
  fill('azure');
  rect(x, fy, mw, drawH, 4);
  // floor and bounce path
  stroke('gray');
  line(x + 6, fy + drawH - 8, x + mw - 6, fy + drawH - 8);
  noFill();
  stroke('lightsteelblue');
  strokeWeight(1.5);
  drawingContext.setLineDash([4, 4]);
  const bx0 = x + mw * 0.15, bx1 = x + mw * 0.55, bx2 = x + mw * 0.85;
  const floorY = fy + drawH - 8;
  bezier(bx0, fy + 16, bx0 + 10, fy + 20, bx1 - 20, floorY, bx1, floorY);
  bezier(bx1, floorY, bx1 + 10, floorY - drawH * 0.6, bx2 - 10, floorY - drawH * 0.6, bx2, floorY - drawH * 0.35);
  drawingContext.setLineDash([]);
  strokeWeight(1);
  // particle trail
  if (boxes.particles.checked()) {
    const cols = ['gold', 'orchid', 'deepskyblue', 'orange', 'lime'];
    for (let i = 0; i < 26; i++) {
      const t = i / 26;
      const px = lerp(bx1, bx2, t) + sin(i * 2.1) * 8;
      const py = lerp(floorY, floorY - drawH * 0.35, t) - sin(t * PI) * drawH * 0.35 + cos(i * 1.7) * 8;
      noStroke();
      fill(cols[i % cols.length]);
      circle(px, py, 4 + (i % 3));
    }
  }
  // ball
  noStroke();
  fill('crimson');
  circle(bx2, floorY - drawH * 0.35, 16);
  // sound icon
  if (boxes.sound.checked()) {
    const sx = x + mw - 30, sy = fy + 8;
    fill('dimgray');
    rect(sx, sy + 5, 6, 8);
    triangle(sx + 6, sy + 5, sx + 13, sy, sx + 13, sy + 18);
    triangle(sx + 6, sy + 13, sx + 13, sy + 18, sx + 13, sy);
    noFill();
    stroke('dimgray');
    arc(sx + 14, sy + 9, 10, 12, -HALF_PI, HALF_PI);
    arc(sx + 14, sy + 9, 18, 20, -HALF_PI, HALF_PI);
    noStroke();
  }
  // short instructions inside the drawing when they are close
  if (!far) {
    fill('black');
    textSize(11);
    textAlign(LEFT, TOP);
    text('Move a slider, then press Start.', x + 6, fy + 5, mw * 0.6);
  }

  // prediction prompt and explanation box
  let py = fy + drawH + 3;
  textSize(narrow ? 10.5 : 11);
  textAlign(LEFT, CENTER);
  if (boxes.predict.checked()) {
    stroke('seagreen');
    fill('honeydew');
    rect(x, py, mw, 20, 4);
    noStroke();
    fill('darkgreen');
    text('Predict: will the next bounce be higher or lower?', x + 5, py + 10, mw - 8);
    py += 24;
  }
  if (boxes.explain.checked()) {
    stroke('seagreen');
    fill('white');
    rect(x, py, mw, 20, 4);
    noStroke();
    fill('darkgreen');
    text('Explain what changed, in one sentence: ____', x + 5, py + 10, mw - 8);
    py += 24;
  }

  // mock control region with one slider per variable
  stroke('silver');
  fill('white');
  rect(x, py, mw, ctrlH, 4);
  const rowH = (ctrlH - 6) / sliderRows;
  textSize(narrow ? 9.5 : 11);
  for (let i = 0; i < sliderRows; i++) {
    const ry = py + 4 + rowH * (i + 0.5);
    noStroke();
    fill('black');
    textAlign(LEFT, CENTER);
    if (rowH >= 8) text(VAR_NAMES[i], x + 5, ry);
    stroke('gray');
    strokeWeight(2);
    line(x + mw * 0.42, ry, x + mw - 8, ry);
    noStroke();
    fill('steelblue');
    circle(x + mw * (0.5 + 0.07 * i), ry, max(5, min(9, rowH - 2)));
    strokeWeight(1);
  }

  // distant instructions
  if (far) {
    const ix = x + mw + 8;
    stroke('silver');
    fill('whitesmoke');
    rect(ix, fy, instrW, h - 18, 4);
    noStroke();
    fill('dimgray');
    textSize(narrow ? 9.5 : 11);
    textAlign(LEFT, TOP);
    text('Instructions: read this paragraph first. Choose values for each slider, predict the path, press Start, then compare the bounce heights with the table in the text...',
      ix + 5, fy + 5, instrW - 10, h - 28);
  }
}

// ---------------------------------------------------------------
// Load gauge: stacked bar with a capacity line
// ---------------------------------------------------------------
function drawGauge(x, y, w, h, load, narrow) {
  const over = load.total > CAPACITY;
  noStroke();
  fill('black');
  textSize(narrow ? 14 : 16);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  if (over) fill('darkorange');
  text(over ? 'Load gauge: over capacity' : 'Load gauge', x, y);
  textStyle(NORMAL);

  // bar geometry: scale so that 160 units fill the bar
  const barY = y + (narrow ? 26 : 32);
  const barH = narrow ? 30 : 38;
  const scaleU = w / 160;
  // background track
  stroke('silver');
  fill(over ? 'moccasin' : 'white');
  rect(x, barY, w, barH, 6);
  // segments
  let sx = x;
  for (const type of ['intrinsic', 'extraneous', 'germane']) {
    const sw = load[type] * scaleU;
    if (sw <= 0) continue;
    noStroke();
    fill(COLORS[type]);
    rect(sx, barY + 3, sw, barH - 6);
    if (sw > 34) {
      fill('white');
      textSize(narrow ? 11 : 12);
      textAlign(CENTER, CENTER);
      text(type === 'intrinsic' ? 'Intrinsic' : type === 'extraneous' ? 'Extraneous' : 'Germane', sx + sw / 2, barY + barH / 2);
    }
    sx += sw;
  }
  // over capacity: the bar's frame and track turn amber
  const capX = x + CAPACITY * scaleU;
  if (over) {
    stroke('darkorange');
    strokeWeight(3);
    noFill();
    rect(x, barY, w, barH, 6);
    strokeWeight(1);
  }
  // capacity line
  stroke('black');
  strokeWeight(2);
  drawingContext.setLineDash([5, 3]);
  line(capX, barY - 8, capX, barY + barH + 8);
  drawingContext.setLineDash([]);
  strokeWeight(1);
  noStroke();
  fill('black');
  textSize(12);
  textAlign(CENTER, TOP);
  text('comfortable capacity', capX, barY + barH + 10);

  // legend with values
  let ly = barY + barH + 30;
  textSize(narrow ? 13 : 14);
  textAlign(LEFT, TOP);
  const legend = [['Intrinsic', 'intrinsic'], ['Extraneous', 'extraneous'], ['Germane', 'germane']];
  let lx = x;
  for (const [name, type] of legend) {
    fill(COLORS[type]);
    rect(lx, ly + 2, 12, 12, 2);
    fill('black');
    const t = name + ' ' + load[type];
    text(t, lx + 16, ly);
    lx += textWidth(t) + 30;
  }
  ly += 24;

  // status message
  textStyle(BOLD);
  const tw = w;
  let msg;
  if (!over) {
    fill('darkgreen');
    msg = 'Within comfortable capacity: total ' + load.total + ' of ' + CAPACITY + '.';
  } else {
    fill('darkorange');
    const ext = load.parts.filter(p => p.type === 'extraneous').sort((a, b) => b.weight - a.weight);
    if (ext.length) msg = 'Over capacity (total ' + load.total + '). Largest extraneous contributor: ' +
      ext[0].label + ' (+' + ext[0].weight + '). Remove it first.';
    else msg = 'Over capacity (total ' + load.total + ') with no extraneous load: manage intrinsic load, ' +
      'for example by introducing one variable at a time.';
  }
  text(msg, x, ly, tw);
  textStyle(NORMAL);
  ly += (textWidth(msg) > tw ? (textWidth(msg) > 2 * tw ? 60 : 42) : 24) + 4;

  // breakdown of what is adding load (wide layout only)
  if (!narrow) {
    fill('black');
    textSize(14);
    text('What is adding load:', x, ly);
    ly += 20;
    textSize(13);
    for (const p of load.parts) {
      if (ly > y + h - 14) break;
      fill(COLORS[p.type]);
      rect(x + 4, ly + 3, 9, 9, 2);
      fill('black');
      text(p.label + '  +' + p.weight + ' ' + p.type, x + 18, ly);
      ly += 18;
    }
  }
}

// ---------------------------------------------------------------
// Control layout (flows to fit the width) and labels
// ---------------------------------------------------------------
let rowYs = {};
function positionControls() {
  const x0 = 10;
  let y = drawHeight + 8;
  varSlider.position(sliderLeftMargin, y);
  varSlider.size(canvasWidth - sliderLeftMargin - margin);
  rowYs.slider = y;
  y += 32;
  let x = x0;
  for (const f of FEATURES) {
    const el = boxes[f.key];
    const w = el.elt.offsetWidth || textWidth(f.label) + 30;
    if (x + w > canvasWidth - margin && x > x0) { x = x0; y += 28; }
    el.position(x, y);
    x += w + 18;
  }
  y += 34;
  buttonA.position(x0, y);
  buttonB.position(x0 + (buttonA.elt.offsetWidth || 150) + 10, y);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Number of variables: ' + varSlider.value(), 10, rowYs.slider + 10);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.floor(container.getBoundingClientRect().width);
  }
}
