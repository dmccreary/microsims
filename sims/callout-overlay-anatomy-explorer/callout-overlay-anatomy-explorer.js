// Callout Overlay Anatomy Explorer - how each field of an overlay data file shows up on screen
// CANVAS_HEIGHT: 620
// Learning objective (Understand / explain): the learner explains how each field of an overlay
// data file (position, label, hint, description) appears in the rendered overlay, by changing
// one field and observing the effect.
//
// The picture is a text-free animal cell drawn with p5 shapes. Every shape is placed in
// percentages of the picture's width and height, exactly like the callout markers, so the
// markers stay on their structures when the picture is resized.

// ---------- Canvas dimensions (standard MicroSim layout) ----------
let canvasWidth = 400;                 // updated from the container width
let drawHeight = 470;                  // drawing region (aliceblue)
let controlHeight = 150;               // control region (white): 4 rows x 35 + 10
let canvasHeight = drawHeight + controlHeight;   // 620
let margin = 25;
let sliderLeftMargin = 190;            // room for "Resize picture: 100%"
let defaultTextSize = 16;

// ---------- The overlay data file (same field names as the overlay schema) ----------
const overlay = {
  title: 'Animal Cell',
  image: 'animal-cell.png',
  callouts: [
    { id: 1, label: 'Nucleus', x: 40.0, y: 42.0, radius: 5, color: '#8E44AD',
      hint: 'Large round purple structure near the center of the cell.',
      description: 'The control center of the cell, wrapped in a double membrane, that holds the DNA.' },
    { id: 2, label: 'Cell membrane', x: 89.0, y: 29.0, radius: 4, color: '#C0392B',
      hint: 'The thin outer boundary that wraps the whole cell.',
      description: 'A flexible lipid bilayer that surrounds the cell and controls what enters and leaves.' },
    { id: 3, label: 'Mitochondrion', x: 70.0, y: 64.0, radius: 5, color: '#E67E22',
      hint: 'Orange bean-shaped structure with folded inner lines.',
      description: 'The organelle that releases energy from food through cellular respiration, making ATP.' },
    { id: 4, label: 'Ribosome', x: 60.0, y: 22.0, radius: 3, color: '#2C3E50',
      hint: 'One of the tiny dark dots scattered in the cytoplasm.',
      description: 'A tiny molecular machine that builds proteins by reading messenger RNA.' }
  ]
};

// ---------- State ----------
let selectedId = 1;
let hoverId = null;
let mode = 'explore';                  // 'explore' | 'quiz'
let quizOrder = [], quizIndex = 0, quizCorrect = 0, quizFeedback = '';
let lastChanged = null;                // 'x' | 'y' | null - field to flash in the JSON
let narrow = false;
let pic = {};                          // picture box {x, y, w, h, maxW, maxH}
let labelX = 0;                        // left edge of the label column
let infoBox = {}, jsonBox = {};

// ---------- Controls ----------
let xSlider, ySlider, scaleSlider, exploreButton, quizButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  xSlider = createSlider(0, 100, 40, 0.1);
  xSlider.position(sliderLeftMargin, drawHeight + 8);
  xSlider.input(() => moveSelected('x', xSlider.value()));

  ySlider = createSlider(0, 100, 42, 0.1);
  ySlider.position(sliderLeftMargin, drawHeight + 43);
  ySlider.input(() => moveSelected('y', ySlider.value()));

  scaleSlider = createSlider(50, 100, 100, 1);
  scaleSlider.position(sliderLeftMargin, drawHeight + 78);
  scaleSlider.input(() => { lastChanged = null; });

  exploreButton = createButton('Explore');
  exploreButton.position(10, drawHeight + 112);
  exploreButton.mousePressed(startExplore);

  quizButton = createButton('Quiz');
  quizButton.position(92, drawHeight + 112);
  quizButton.mousePressed(startQuiz);

  for (const b of [exploreButton, quizButton]) b.style('font-size', '15px');
  resizeSliders();
  syncSliders();
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

  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(narrow ? 18 : 22);
  text('Callout Overlay Anatomy Explorer', canvasWidth / 2, 8);

  hoverId = mode === 'explore' ? markerAt(mouseX, mouseY) : null;

  drawPicture();
  drawLeaderLinesAndLabels();
  drawMarkers();
  drawInfoBox();
  if (!narrow) drawFieldMap();
  drawJson();
  drawControlLabels();
}

// ---------- Geometry ----------
function px(c) { return pic.x + (c.x / 100) * pic.w; }       // percent -> pixels
function py(c) { return pic.y + (c.y / 100) * pic.h; }
function markerRadius(c) { return max(9, (c.radius / 100) * pic.w * 0.9); }

function markerAt(mx, my) {
  for (const c of overlay.callouts) {
    if (dist(mx, my, px(c), py(c)) <= markerRadius(c) + 3) return c.id;
  }
  return null;
}

function callout(id) { return overlay.callouts.find(c => c.id === id); }

// ---------- The text-free picture ----------
function drawPicture() {
  // picture frame (the "image" in data.json)
  stroke(200);
  strokeWeight(1);
  fill('white');
  rect(pic.x, pic.y, pic.w, pic.h);
  // dashed outline of the full-size picture when it is scaled down
  if (pic.w < pic.maxW - 1) {
    noFill();
    stroke(170);
    drawingContext.setLineDash([5, 5]);
    rect(pic.x, pic.y, pic.maxW, pic.maxH);
    drawingContext.setLineDash([]);
  }
  const P = (fx, fy) => [pic.x + fx * pic.w / 100, pic.y + fy * pic.h / 100];
  const W = v => v * pic.w / 100, H = v => v * pic.h / 100;

  // cell membrane and cytoplasm
  stroke('#C0392B');
  strokeWeight(max(2, W(1.2)));
  fill('#FDEBD0');
  ellipse(...P(50, 50), W(90), H(84));
  noStroke();
  // endoplasmic-reticulum-like folds (decoration, no text)
  noFill();
  stroke('#D7BDE2');
  strokeWeight(max(1.5, W(0.7)));
  for (let i = 0; i < 3; i++) arc(...P(40, 42), W(40 + i * 7), H(52 + i * 9), PI * 0.1, PI * 0.8);
  // nucleus with nucleolus
  noStroke();
  fill('#8E44AD');
  ellipse(...P(40, 42), W(26), H(34));
  fill('#5B2C6F');
  ellipse(...P(43, 39), W(8), H(10));
  // mitochondria (the marked one at 70, 64)
  drawMito(...P(70, 64), W(17), H(12), -0.35);
  drawMito(...P(26, 72), W(12), H(9), 0.5);
  // ribosomes: small dark dots
  fill('#2C3E50');
  const dots = [[60, 22], [64, 26], [57, 27], [67, 20], [22, 40], [25, 46], [48, 72], [53, 76],
                [78, 42], [82, 48], [35, 20], [72, 80]];
  for (const [fx, fy] of dots) circle(...P(fx, fy), max(3, W(1.5)));
}

function drawMito(cx, cy, w, h, ang) {
  push();
  translate(cx, cy);
  rotate(ang);
  stroke('#A04000');
  strokeWeight(max(1.5, w * 0.06));
  fill('#E67E22');
  rect(-w / 2, -h / 2, w, h, h / 2);
  noFill();
  stroke('#FAD7A0');
  strokeWeight(max(1, w * 0.04));
  beginShape();
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    vertex(-w * 0.38 + t * w * 0.76, (i % 2 === 0 ? -1 : 1) * h * 0.25);
  }
  endShape();
  pop();
}

// ---------- Callout engine drawing ----------
function labelRowY(i) {
  const top = pic.y + 14, bottom = pic.y + pic.maxH - 14;
  return top + i * (bottom - top) / (overlay.callouts.length - 1);
}

function drawLeaderLinesAndLabels() {
  overlay.callouts.forEach((c, i) => {
    const ly = labelRowY(i);
    const active = c.id === hoverId || (c.id === selectedId && mode === 'explore');
    // leader line from the marker to its label row
    stroke(active ? c.color : color(120, 120, 120, 150));
    strokeWeight(c.id === hoverId ? 3 : active ? 2 : 1);
    line(px(c), py(c), labelX - 4, ly);
    // label row: number badge plus the label text (hidden in quiz mode)
    noStroke();
    fill(c.color);
    circle(labelX + 10, ly, 20);
    fill('white');
    textSize(12);
    textAlign(CENTER, CENTER);
    text(c.id, labelX + 10, ly);
    fill('black');
    textSize(narrow ? 14 : 15);
    textAlign(LEFT, CENTER);
    textStyle(active ? BOLD : NORMAL);
    const txt = mode === 'quiz' ? '?' : c.label;
    text(fitText(txt, canvasWidth - labelX - 30), labelX + 24, ly);
    textStyle(NORMAL);
  });
}

function drawMarkers() {
  for (const c of overlay.callouts) {
    const r = markerRadius(c);
    const isHover = c.id === hoverId, isSel = c.id === selectedId && mode === 'explore';
    stroke('white');
    strokeWeight(2);
    fill(c.color);
    circle(px(c), py(c), r * 2);
    if (isHover || isSel) {
      noFill();
      stroke(isHover ? 'gold' : 'black');
      strokeWeight(3);
      circle(px(c), py(c), r * 2 + 8);
    }
    noStroke();
    fill('white');
    textSize(max(11, r));
    textAlign(CENTER, CENTER);
    text(c.id, px(c), py(c) + 1);
  }
}

function drawInfoBox() {
  const b = infoBox;
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(b.x, b.y, b.w, b.h, 8);
  noStroke();
  textAlign(LEFT, TOP);
  let head, body;
  if (mode === 'quiz') {
    if (quizIndex < quizOrder.length) {
      head = 'Quiz ' + (quizIndex + 1) + ' of ' + quizOrder.length + ': click the marker';
      body = (quizFeedback ? quizFeedback + ' Next hint: ' : 'Hint: ') + callout(quizOrder[quizIndex]).hint;
    } else {
      head = 'Quiz complete: ' + quizCorrect + ' of ' + quizOrder.length + ' correct';
      body = quizFeedback + ' Press Quiz to try again or Explore to see the labels.';
    }
  } else {
    const c = callout(hoverId || selectedId);
    head = c.id + '  ' + c.label + (hoverId ? '' : ' (selected)');
    body = c.description;
  }
  fill('black');
  textSize(15);
  textStyle(BOLD);
  text(head, b.x + 10, b.y + 6, b.w - 20, 20);
  textStyle(NORMAL);
  textSize(14);
  fill(40);
  text(body, b.x + 10, b.y + 26, b.w - 20, b.h - 28);
}

// Which field of the data file produces which part of the overlay
function drawFieldMap() {
  const b = { x: infoBox.x, y: infoBox.y + infoBox.h + 8, w: infoBox.w, h: drawHeight - (infoBox.y + infoBox.h + 8) - 10 };
  if (b.h < 60) return;
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(b.x, b.y, b.w, b.h, 8);
  const rows = [
    ['x, y', 'where the marker sits, in percent of the picture', lastChanged === 'x' || lastChanged === 'y'],
    ['label', 'the text beside the leader line', hoverId !== null && mode === 'explore'],
    ['hint', 'the clue shown in Quiz mode', mode === 'quiz'],
    ['description', 'the information box above', hoverId !== null && mode === 'explore']
  ];
  noStroke();
  fill('black');
  textSize(14);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('How each field appears', b.x + 10, b.y + 6);
  textStyle(NORMAL);
  const lh = min(20, (b.h - 28) / rows.length);
  rows.forEach(([field, where, on], i) => {
    const y = b.y + 26 + i * lh;
    if (on) { fill(255, 243, 176); rect(b.x + 4, y - 2, b.w - 8, lh, 4); }
    fill(11, 83, 148);
    textFont('monospace');
    textSize(13);
    text('"' + field + '"', b.x + 10, y);
    textFont('sans-serif');
    fill(40);
    textSize(14);
    text('\u2192 ' + fitText(where, b.w - 130), b.x + 118, y);
  });
}

// ---------- JSON panel ----------
function jsonLines() {
  // each line is a list of [text, kind, fieldKey] tokens; kinds: p (punctuation), k, s, n
  const L = [];
  const q = s => '"' + s + '"';
  const showAll = !narrow;
  L.push({ t: [['{', 'p']] });
  if (showAll) {
    L.push({ t: [['  ', 'p'], [q('title'), 'k'], [': ', 'p'], [q(overlay.title), 's'], [',', 'p']] });
    L.push({ t: [['  ', 'p'], [q('image'), 'k'], [': ', 'p'], [q(overlay.image), 's'], [',', 'p']] });
  }
  L.push({ t: [['  ', 'p'], [q('callouts'), 'k'], [': [', 'p']] });
  const list = showAll ? overlay.callouts : [callout(hoverId || selectedId)];
  for (const c of list) {
    const hideText = mode === 'quiz';
    const lab = hideText ? '?' : c.label;
    L.push({ id: c.id, t: [['    { ', 'p'], [q('id'), 'k'], [': ', 'p'], [String(c.id), 'n'], [', ', 'p'],
      [q('label'), 'k'], [': ', 'p'], [q(lab), 's', 'label'], [',', 'p']] });
    L.push({ id: c.id, t: [['      ', 'p'], [q('x'), 'k'], [': ', 'p'], [nf(c.x, 0, 1), 'n', 'x'], [', ', 'p'],
      [q('y'), 'k'], [': ', 'p'], [nf(c.y, 0, 1), 'n', 'y'], [', ', 'p'],
      [q('radius'), 'k'], [': ', 'p'], [String(c.radius), 'n'], [',', 'p']] });
    L.push({ id: c.id, t: [['      ', 'p'], [q('color'), 'k'], [': ', 'p'], [q(c.color), 's'], [',', 'p']] });
    L.push({ id: c.id, t: [['      ', 'p'], [q('hint'), 'k'], [': ', 'p'], [q(hideText ? '?' : c.hint), 's', 'hint'], [',', 'p']] });
    L.push({ id: c.id, t: [['      ', 'p'], [q('description'), 'k'], [': ', 'p'],
      [q(hideText ? '?' : c.description), 's', 'description'], [' }' + (showAll && c.id < 4 ? ',' : ''), 'p']] });
  }
  if (!showAll) L.push({ t: [['    ... 3 more callouts', 'p']] });
  L.push({ t: [['  ]', 'p']] });
  L.push({ t: [['}', 'p']] });
  return L;
}

const TOKEN_COLORS = { p: [90, 90, 90], k: [11, 83, 148], s: [154, 52, 18], n: [0, 110, 90] };

function drawJson() {
  const b = jsonBox;
  stroke('silver');
  strokeWeight(1);
  fill(250, 250, 250);
  rect(b.x, b.y, b.w, b.h, 8);
  noStroke();
  fill(60);
  textSize(13);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  text('data.json' + (narrow ? ' (selected callout)' : ''), b.x + 8, b.y + 5);
  textStyle(NORMAL);

  const lines = jsonLines();
  const lh = narrow ? 14 : 15;
  textFont('monospace');                 // code text only; the rest of the sim uses the default font
  textSize(narrow ? 11.5 : 12.5);
  const cw = textWidth('M');
  const maxChars = floor((b.w - 16) / cw);
  const active = mode === 'quiz' ? null : (hoverId || selectedId);
  let y = b.y + 24;
  // highlight the block of the active callout
  const rows = lines.map((l, i) => ({ l, i })).filter(r => r.l.id === active);
  if (rows.length) {
    fill(255, 243, 176);
    rect(b.x + 4, y + rows[0].i * lh - 1, b.w - 8, rows.length * lh + 2, 4);
  }
  for (const line of lines) {
    let x = b.x + 8, used = 0;
    for (const [txt, kind, field] of line.t) {
      let s = txt;
      if (used + s.length > maxChars) {                  // truncate long strings with an ellipsis
        const room = maxChars - used - 2;
        s = room > 3 ? s.slice(0, room) + '…' + (kind === 's' ? '"' : '') : '…';
      }
      const flash = line.id === selectedId && field && field === lastChanged;
      if (flash) {
        fill(255, 200, 80);
        rect(x - 1, y - 1, textWidth(s) + 2, lh);
      }
      fill(...TOKEN_COLORS[kind]);
      text(s, x, y);
      x += textWidth(s);
      used += s.length;
      if (used >= maxChars) break;
    }
    y += lh;
  }
  textFont('sans-serif');
}

function fitText(s, w) {
  if (textWidth(s) <= w) return s;
  while (s.length > 1 && textWidth(s + '…') > w) s = s.slice(0, -1);
  return s + '…';
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  const c = callout(selectedId);
  text('x: ' + nf(c.x, 0, 1) + ' %', 10, drawHeight + 18);
  text('y: ' + nf(c.y, 0, 1) + ' %', 10, drawHeight + 53);
  text('Resize picture: ' + scaleSlider.value() + ' %', 10, drawHeight + 88);
  textSize(15);
  fill(50);
  const status = mode === 'quiz'
    ? 'Quiz mode: labels hidden. Score ' + quizCorrect + ' of ' + min(quizIndex, quizOrder.length)
    : 'Selected: ' + c.id + ' ' + c.label + ' (click a marker to select)';
  text(fitText(status, canvasWidth - 170), 162, drawHeight + 126);
}

// ---------- Interaction ----------
function mousePressed() {
  if (mouseY > drawHeight) return;
  const id = markerAt(mouseX, mouseY);
  if (id === null) return;
  if (mode === 'explore') {
    selectedId = id;
    lastChanged = null;
    syncSliders();
    updateDescription();
  } else if (quizIndex < quizOrder.length) {
    const target = quizOrder[quizIndex];
    if (id === target) { quizCorrect++; quizFeedback = 'Correct: that was the ' + callout(target).label + '.'; }
    else quizFeedback = 'Not quite: that hint was the ' + callout(target).label + ' (marker ' + target + ').';
    quizIndex++;
  }
}

function moveSelected(field, v) {
  if (mode !== 'explore') return;
  callout(selectedId)[field] = round(v * 10) / 10;       // write the percentage into the data
  lastChanged = field;
  updateDescription();
}

function syncSliders() {
  const c = callout(selectedId);
  xSlider.value(c.x);
  ySlider.value(c.y);
}

function startExplore() {
  mode = 'explore';
  xSlider.removeAttribute('disabled');
  ySlider.removeAttribute('disabled');
  quizFeedback = '';
  updateDescription();
}

function startQuiz() {
  mode = 'quiz';
  xSlider.attribute('disabled', '');         // positions are fixed during the quiz
  ySlider.attribute('disabled', '');
  quizOrder = shuffle(overlay.callouts.map(c => c.id));
  quizIndex = 0;
  quizCorrect = 0;
  quizFeedback = '';
  lastChanged = null;
  updateDescription();
}

function updateDescription() {
  const c = callout(selectedId);
  describe('A text-free drawing of an animal cell with four numbered callout markers and, beside it, ' +
    'the overlay data file as JSON. Mode: ' + mode + '. Selected callout ' + c.id + ', ' + c.label +
    ', at x ' + nf(c.x, 0, 1) + ' percent and y ' + nf(c.y, 0, 1) + ' percent: ' + c.description, LABEL);
}

// ---------- Responsive design ----------
function resizeSliders() {
  const w = canvasWidth - sliderLeftMargin - margin;
  xSlider.size(w);
  ySlider.size(w);
  scaleSlider.size(w);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  resizeSliders();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
  narrow = canvasWidth < 600;
  const scale = scaleSlider ? scaleSlider.value() / 100 : 1;
  const top = narrow ? 36 : 42;
  const labelW = narrow ? 118 : 130;
  let leftW;
  if (narrow) {
    leftW = canvasWidth - 20;
  } else {
    leftW = floor(canvasWidth * 0.55);
  }
  // full-size picture: 4:3 landscape, as wide as the column allows (minus the label column)
  let maxW = leftW - labelW - 18;
  const maxH = narrow ? 200 : drawHeight - top - 100;
  maxW = min(maxW, maxH * 4 / 3);
  pic = { x: 10, y: top, maxW: maxW, maxH: maxW * 0.75 };
  pic.w = pic.maxW * scale;                  // Resize picture: 50-100% of the full width
  pic.h = pic.w * 0.75;
  labelX = pic.x + pic.maxW + 18;            // the label column does not move
  const infoY = pic.y + pic.maxH + 10;
  infoBox = { x: 10, y: infoY, w: narrow ? canvasWidth - 20 : leftW, h: narrow ? 64 : 76 };
  if (narrow) {
    jsonBox = { x: 10, y: infoBox.y + infoBox.h + 8, w: canvasWidth - 20, h: drawHeight - (infoBox.y + infoBox.h + 8) - 8 };
  } else {
    const jx = leftW + 22;
    jsonBox = { x: jx, y: top, w: canvasWidth - jx - 10, h: drawHeight - top - 10 };
  }
}
