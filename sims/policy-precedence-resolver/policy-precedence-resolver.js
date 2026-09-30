// Policy Precedence Resolver - resolve compact and teaching through the five policy layers
// CANVAS_HEIGHT: 700
// Learning objective (Apply / determine): the learner determines the final compact and teaching
// values for a MicroSim by applying the five policy layers in order, and identifies which layer
// supplied each value (Chapter 17, "Policy Precedence").
// Five stacked bars, lowest priority at the bottom (runtime defaults) and highest at the top (the
// ?xapi= URL switch). Set the layers with the dropdowns, predict, then press Resolve: a highlight
// climbs from the bottom bar, overwriting the running value wherever a layer sets a key.
// Resolution follows lrs-lite-sim.js loadPolicy(): per key, URL > metadata.json > page option >
// lrs-config.js > defaults; a lone ?xapi=teaching also implies compact false (teaching starts on Full).

// ---------- Canvas dimensions ----------
// Fixed total height; the drawing/control split is recomputed when the control rows wrap.
let canvasWidth = 800;
let canvasHeight = 700;
let controlHeight = 150;
let drawHeight = canvasHeight - controlHeight;
let margin = 12;
let defaultTextSize = 16;

// Okabe-Ito color-blind-safe colors (RGB): true = blue, false = vermillion
const TRUE_C = [0, 114, 178], FALSE_C = [213, 94, 0];
const TRUE_BG = [222, 236, 247], FALSE_BG = [251, 231, 214];

// ---------- Layers, lowest priority first ----------
const LAYERS = [
  { n: 1, name: 'Runtime defaults', file: 'lrs-lite-sim.js DEFAULTS',
    tip: 'Layer 1, runtime defaults: the DEFAULTS object in lrs-lite-sim.js (compact true, teaching false). Used only when no other layer sets a key.' },
  { n: 2, name: 'Book config', file: 'docs/js/lrs-config.js, xapi block',
    tip: 'Layer 2, book config: the xapi block in docs/js/lrs-config.js. One file sets the policy for every MicroSim in the textbook.' },
  { n: 3, name: 'Page option', file: 'policy option of LRSSim.create()',
    tip: 'Layer 3, page option: the policy object a page passes to LRSSim.create() in its own script. Over the book, under the sim\'s metadata.' },
  { n: 4, name: 'metadata.json', file: 'the MicroSim\'s metadata.json, xapi block',
    tip: 'Layer 4, metadata.json: the xapi block in this MicroSim\'s own metadata.json. Changes one MicroSim without touching the book.' },
  { n: 5, name: 'URL switch', file: '?xapi= on the page URL (one visit)',
    tip: 'Layer 5, URL switch: ?xapi= on the MicroSim\'s page or on the page that embeds it. Highest priority, for one visit only; no file is edited.' }
];

// Dropdown choices for layers 2-4: [label, {compact, teaching}]
const COMBOS = [
  ['not set', {}],
  ['compact true', { compact: true }],
  ['compact false', { compact: false }],
  ['teaching true', { teaching: true }],
  ['teaching false', { teaching: false }],
  ['compact true, teaching true', { compact: true, teaching: true }],
  ['compact true, teaching false', { compact: true, teaching: false }],
  ['compact false, teaching true', { compact: false, teaching: true }],
  ['compact false, teaching false', { compact: false, teaching: false }]
];
const URL_CHOICES = ['(no switch)', 'teaching', 'production', 'full', 'compact', 'teaching,compact', 'production,full'];

// ---------- State ----------
let layerValues = [];      // per layer: {compact?, teaching?} (+ implied flag for the URL layer)
let resolveStart = -1;     // millis() when Resolve was pressed; -1 = not resolving
let resolvedStep = -1;     // how many layers have been applied (0-5); -1 = not resolved
const STEP_MS = 800;
let hoverLayer = -1;
let lastLogged = -1;
let barRects = [];

// controls
let bookSelect, pageSelect, metaSelect, urlSelect, resolveButton, resetButton, presetButton, wonBox;
let units = [];            // {label, el}
let buttonsRow = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('sans-serif');
  const main = document.querySelector('main');

  bookSelect = makeComboSelect();
  pageSelect = makeComboSelect();
  metaSelect = makeComboSelect();
  urlSelect = createSelect();
  URL_CHOICES.forEach((u, i) => urlSelect.option(i === 0 ? u : '?xapi=' + u, i));
  urlSelect.style('width', '170px');
  for (const s of [bookSelect, pageSelect, metaSelect, urlSelect]) s.changed(onLayerChange);
  resolveButton = createButton('Resolve');
  resolveButton.mousePressed(startResolve);
  resetButton = createButton('Reset');
  resetButton.mousePressed(resetLayers);
  presetButton = createButton('Worked example');
  presetButton.mousePressed(loadWorkedExample);
  wonBox = createCheckbox('Show which layer won', false);
  units = [
    { label: 'Book config (layer 2)', el: bookSelect },
    { label: 'Page option (layer 3)', el: pageSelect },
    { label: 'metadata.json (layer 4)', el: metaSelect },
    { label: 'URL switch (layer 5)', el: urlSelect }
  ];
  buttonsRow = [resolveButton, resetButton, presetButton, wonBox];
  for (const c of [bookSelect, pageSelect, metaSelect, urlSelect, resolveButton, resetButton, presetButton, wonBox]) c.parent(main);

  resetLayers();
  layoutControls();
  describe('Policy Precedence Resolver. Five stacked bars show the policy layers from runtime defaults at ' +
    'the bottom to the ?xapi= URL switch at the top, each with a compact and a teaching box reading true, ' +
    'false or not set. Dropdowns set the book config, page option, metadata.json and URL switch layers. ' +
    'Resolve climbs from the bottom layer to the top, overwriting each key wherever a layer sets it, and ' +
    'a result box shows the final compact and teaching values and, optionally, which layer supplied each.');
}

function makeComboSelect() {
  const s = createSelect();
  COMBOS.forEach((c, i) => s.option(c[0], i));
  s.style('width', '188px');
  return s;
}

// ---------- Policy logic (mirrors lrs-lite-sim.js loadPolicy and urlPolicy) ----------
function urlPolicy(choice) {
  const out = {};
  if (choice === 0) return out;
  for (const t of URL_CHOICES[choice].split(',')) {
    if (t === 'teaching') out.teaching = true;
    else if (t === 'production') out.teaching = false;
    else if (t === 'full') out.compact = false;
    else if (t === 'compact') out.compact = true;
  }
  // "Teaching sims start on Full": a lone teaching token also sets compact false
  if (out.teaching === true && out.compact === undefined) { out.compact = false; out.implied = true; }
  return out;
}

function readLayers() {
  layerValues = [
    { compact: true, teaching: false },
    COMBOS[int(bookSelect.value())][1],
    COMBOS[int(pageSelect.value())][1],
    COMBOS[int(metaSelect.value())][1],
    urlPolicy(int(urlSelect.value()))
  ];
}

// Resolve through the first `upto` layers; returns {compact, teaching, from: {compact, teaching}}
function resolveThrough(upto) {
  const out = { compact: undefined, teaching: undefined, from: {} };
  for (let i = 0; i < upto; i++) {
    for (const k of ['compact', 'teaching']) {
      if (layerValues[i][k] !== undefined) { out[k] = layerValues[i][k]; out.from[k] = i; }
    }
  }
  return out;
}

// ---------- Actions ----------
function onLayerChange() {
  readLayers();
  resolveStart = -1;
  resolvedStep = -1;
}

function startResolve() {
  readLayers();
  resolveStart = millis();
  resolvedStep = 0;
}

function resetLayers() {
  bookSelect.selected(6);   // compact true, teaching false: the reference book's lrs-config.js
  pageSelect.selected(0);
  metaSelect.selected(0);
  urlSelect.selected(0);
  wonBox.checked(false);
  onLayerChange();
}

function loadWorkedExample() {
  // Chapter 17: book compact true / teaching false; metadata.json compact false / teaching true;
  // the reader opens the page with ?xapi=production.
  bookSelect.selected(6);
  pageSelect.selected(0);
  metaSelect.selected(7);
  urlSelect.selected(2);
  onLayerChange();
}

// ---------- Layout ----------
function narrow() { return canvasWidth < 500; }

function layoutControls() {
  const labelH = 16, selRowH = 50, btnRowH = 36;
  for (const u of units) {
    u.el.style('width', (narrow() ? (u.el === urlSelect ? 160 : 172) : (u.el === urlSelect ? 170 : 188)) + 'px');
    u.el.style('font-size', narrow() ? '12px' : '13px');
  }
  for (const u of units) if (u.el.elt.style.position !== 'absolute') u.el.position(0, drawHeight);
  for (const b of buttonsRow) if (b.elt.style.position !== 'absolute') b.position(0, drawHeight);
  // select units (label drawn on the canvas above each select)
  let x = 10, row = 0;
  const upos = [];
  for (const u of units) {
    const w = max(u.el.elt.offsetWidth, 150);
    if (x > 10 && x + w > canvasWidth - 10) { row++; x = 10; }
    upos.push([x, row]);
    x += w + 12;
  }
  const selRows = row + 1;
  // button row(s)
  x = 10; row = 0;
  const bpos = [];
  for (const b of buttonsRow) {
    const w = b.elt.offsetWidth || 90;
    if (x > 10 && x + w > canvasWidth - 10) { row++; x = 10; }
    bpos.push([x, row]);
    x += w + 10;
  }
  const btnRows = row + 1;
  controlHeight = selRows * selRowH + btnRows * btnRowH + 16;
  drawHeight = canvasHeight - controlHeight;
  units.forEach((u, i) => {
    u.x = upos[i][0];
    u.y = drawHeight + 8 + upos[i][1] * selRowH;
    u.el.position(u.x, u.y + labelH + 2);
  });
  const by = drawHeight + 10 + selRows * selRowH;
  buttonsRow.forEach((b, i) => b.position(bpos[i][0], by + bpos[i][1] * btnRowH + (b === wonBox ? 4 : 0)));
}

// ---------- Drawing ----------
function draw() {
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // advance the Resolve animation
  if (resolveStart >= 0) {
    resolvedStep = min(5, floor((millis() - resolveStart) / STEP_MS) + 1);
    if (resolvedStep >= 5 && millis() - resolveStart > 5 * STEP_MS) resolveStart = -1;
  }

  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(narrow() ? 19 : 22);
  text('Policy Precedence Resolver', margin, 9);
  textStyle(NORMAL);

  const W = canvasWidth - 2 * margin;
  let bars, res;
  if (narrow()) {
    const resH = 128;
    bars = { x: margin, y: 40, w: W, h: drawHeight - 40 - resH - 16 };
    res = { x: margin, y: drawHeight - 8 - resH, w: W, h: resH };
  } else {
    const bw = floor(W * 0.62);
    bars = { x: margin, y: 42, w: bw, h: drawHeight - 50 };
    res = { x: margin + bw + 12, y: 42, w: W - bw - 12, h: drawHeight - 50 };
  }
  drawBars(bars);
  drawResult(res);
  drawControlLabels();
  drawTooltip();
}

function keyBox(x, y, w, h, key, val, implied, highlight, won) {
  if (val === undefined) {
    stroke('darkgray');
    drawingContext.setLineDash([4, 3]);
    fill('white');
    rect(x, y, w, h, 5);
    drawingContext.setLineDash([]);
  } else {
    stroke(won ? 'darkgoldenrod' : 'navy');
    strokeWeight(won ? 3 : 1);
    fill(val ? TRUE_C : FALSE_C);
    rect(x, y, w, h, 5);
    strokeWeight(1);
  }
  if (highlight) { noFill(); stroke('gold'); strokeWeight(4); rect(x - 3, y - 3, w + 6, h + 6, 7); strokeWeight(1); }
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(narrow() ? 10.5 : 11.5);
  fill(val === undefined ? 'dimgray' : 'white');
  text(key, x + w / 2, y + h * 0.3);
  textStyle(BOLD);
  textSize(narrow() ? 12 : 13.5);
  text(val === undefined ? 'not set' : String(val) + (implied ? '*' : ''), x + w / 2, y + h * 0.7);
  textStyle(NORMAL);
  textAlign(LEFT, TOP);
}

function drawBars(r) {
  barRects = [];
  hoverLayer = -1;
  const gap = 8;
  const arrowW = narrow() ? 0 : 26;
  const bh = min(100, (r.h - 4 * gap - (layerValues[4].implied ? 14 : 0)) / 5);
  const partial = resolvedStep >= 0 ? resolveThrough(resolvedStep) : null;
  const final = resolvedStep >= 5 ? resolveThrough(5) : null;
  const showWon = wonBox.checked() && final;
  // priority arrow
  if (!narrow()) {
    stroke('slategray');
    strokeWeight(2);
    const ax = r.x + 10;
    line(ax, r.y + 5 * (bh + gap) - gap - 6, ax, r.y + 8);
    fill('slategray');
    noStroke();
    triangle(ax - 6, r.y + 14, ax + 6, r.y + 14, ax, r.y + 2);
    push();
    translate(ax + 11, r.y + 5 * (bh + gap) / 2);
    rotate(-HALF_PI);
    textAlign(CENTER, CENTER);
    textSize(11);
    fill('slategray');
    text('higher priority', 0, 0);
    pop();
    strokeWeight(1);
  }
  for (let li = 4; li >= 0; li--) {
    const row = 4 - li;                 // top row = layer 5
    const x = r.x + arrowW, y = r.y + row * (bh + gap), w = r.w - arrowW;
    const L = LAYERS[li];
    const v = layerValues[li];
    const over = mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + bh;
    if (over) hoverLayer = li;
    const active = resolveStart >= 0 && resolvedStep - 1 === li;
    const applied = resolvedStep > li;
    stroke(active ? 'darkorange' : (over ? 'steelblue' : 'silver'));
    strokeWeight(active ? 3 : (over ? 2 : 1));
    fill(active ? 'lightyellow' : (applied ? 'honeydew' : 'white'));
    rect(x, y, w, bh, 8);
    strokeWeight(1);
    // layer label
    noStroke();
    fill('slategray');
    rect(x + 6, y + 6, 24, 22, 5);
    fill('white');
    textStyle(BOLD);
    textSize(13);
    textAlign(CENTER, CENTER);
    text(L.n, x + 18, y + 17);
    textAlign(LEFT, TOP);
    fill('black');
    textSize(narrow() ? 13 : 15);
    text(L.name, x + 36, y + 7);
    textStyle(NORMAL);
    const boxW = narrow() ? 64 : 88;
    const boxH = min(bh - 14, 44);
    const bx2 = x + w - 8 - boxW, bx1 = bx2 - 6 - boxW;
    if (bh > 44 || !narrow()) {
      fill('dimgray');
      textSize(narrow() ? 10.5 : 11.5);
      text(fitText(L.file, bx1 - (x + 36) - 6), x + 36, y + (narrow() ? 26 : 28));
    }
    const wonC = showWon && final.from.compact === li;
    const wonT = showWon && final.from.teaching === li;
    keyBox(bx1, y + (bh - boxH) / 2, boxW, boxH, 'compact', v.compact, li === 4 && v.implied, false, wonC);
    keyBox(bx2, y + (bh - boxH) / 2, boxW, boxH, 'teaching', v.teaching, false, false, wonT);
    if (active) {
      // mark keys this layer overwrites during the climb
      noStroke();
      fill('darkorange');
      textSize(11);
      textAlign(RIGHT, BOTTOM);
      const sets = ['compact', 'teaching'].filter(k => v[k] !== undefined);
      text(sets.length ? 'sets ' + sets.join(' and ') : 'sets nothing: values pass through', bx1 - 8, y + bh - 5);
      textAlign(LEFT, TOP);
    }
    barRects.push({ li, x, y, w, h: bh });
  }
  if (layerValues[4].implied) {
    noStroke();
    fill('dimgray');
    textSize(11);
    text('* ?xapi=teaching alone implies compact false: teaching sims start on Full.', r.x + arrowW, r.y + 5 * (bh + gap) - 2);
  }
}

function drawResult(r) {
  stroke('silver');
  fill('white');
  rect(r.x, r.y, r.w, r.h, 10);
  noStroke();
  fill('black');
  textStyle(BOLD);
  textSize(narrow() ? 14 : 16);
  textAlign(LEFT, TOP);
  text('Resolved policy', r.x + 12, r.y + 8);
  textStyle(NORMAL);
  const state = resolvedStep < 0 ? 'none' : (resolvedStep < 5 || resolveStart >= 0 ? 'running' : 'done');
  const cur = resolvedStep >= 0 ? resolveThrough(resolvedStep) : null;
  const showWon = wonBox.checked() && state === 'done';
  const keys = ['compact', 'teaching'];
  if (narrow()) {
    // two value boxes side by side, then one line of meaning
    const bw = (r.w - 36) / 2;
    keys.forEach((k, i) => {
      const bx = r.x + 12 + i * (bw + 12), by = r.y + 32;
      const val = cur ? cur[k] : undefined;
      valueBox(bx, by, bw, 46, k, state === 'none' ? '?' : val, showWon ? 'from layer ' + (cur.from[k] + 1) : '');
    });
    fill('black');
    textSize(12);
    drawWrapped(resultMeaning(state, cur), r.x + 12, r.y + 86, r.w - 24, 15);
    return;
  }
  let y = r.y + 38;
  for (const k of keys) {
    const val = cur ? cur[k] : undefined;
    valueBox(r.x + 12, y, r.w - 24, 60, k, state === 'none' ? '?' : val,
      showWon ? 'from layer ' + (cur.from[k] + 1) + ': ' + LAYERS[cur.from[k]].name : '');
    y += 70;
  }
  fill('black');
  textSize(14);
  y = drawWrapped(resultMeaning(state, cur), r.x + 12, y + 2, r.w - 24, 18) + 10;
  fill('dimgray');
  textSize(12.5);
  const notes = [
    'Resolution is per key: a layer that sets only teaching leaves compact to the layers below.',
    'Order, lowest first: defaults, lrs-config.js, page option, metadata.json, ?xapi=.'
  ];
  for (const n of notes) {
    if (y + 34 > r.y + r.h) break;
    y = drawWrapped(n, r.x + 12, y, r.w - 24, 16) + 6;
  }
}

function valueBox(x, y, w, h, key, val, from) {
  stroke('silver');
  fill(val === true ? TRUE_BG : (val === false ? FALSE_BG : 'whitesmoke'));
  rect(x, y, w, h, 8);
  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(LEFT, TOP);
  text(key, x + 10, y + 6);
  fill(val === true ? TRUE_C : (val === false ? FALSE_C : 'dimgray'));
  textStyle(BOLD);
  textSize(narrow() ? 17 : 22);
  text(val === undefined ? '...' : String(val), x + 10, y + (narrow() ? 21 : 22));
  textStyle(NORMAL);
  if (from) {
    fill('darkgoldenrod');
    textSize(narrow() ? 10.5 : 12);
    textAlign(RIGHT, TOP);
    text(fitText(from, w - (narrow() ? 64 : 90)), x + w - 8, y + (narrow() ? 26 : 30));
    textAlign(LEFT, TOP);
  }
}

function resultMeaning(state, cur) {
  if (state === 'none') return 'Predict both values and the layer that supplies each, then press Resolve.';
  if (state === 'running') return 'Climbing: layer ' + resolvedStep + ' of 5 applied...';
  const m1 = cur.compact ? 'Compact: exposure evidence folds into one summary per session (LRS-Lite).'
                         : 'Full: one statement per interaction.';
  const m2 = cur.teaching ? 'Teaching panel shown (statement log, Full/Compact switch, Simulate Done).'
                          : 'Silent: no teaching panel.';
  return m1 + ' ' + m2;
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  for (const u of units) if (u.y !== undefined) text(u.label, u.x + 2, u.y);
  textStyle(NORMAL);
}

function drawTooltip() {
  if (hoverLayer < 0) { lastLogged = -1; return; }
  const L = LAYERS[hoverLayer];
  if (lastLogged !== hoverLayer) {
    console.log('[policy-precedence-resolver] tooltip: ' + L.tip);
    lastLogged = hoverLayer;
  }
  textSize(13);
  const w = min(330, canvasWidth - 2 * margin);
  const lines = wrapWords(L.tip, w - 16);
  const h = lines.length * 17 + 12;
  const r = barRects.find(b => b.li === hoverLayer);
  const x = constrain(mouseX - w / 2, margin, canvasWidth - margin - w);
  let y = r.y + r.h + 4;
  if (y + h > drawHeight - 4) y = r.y - h - 4;
  stroke('dimgray');
  fill(255, 255, 240, 250);
  rect(x, y, w, h, 6);
  noStroke();
  fill('black');
  lines.forEach((l, i) => text(l, x + 8, y + 6 + i * 17));
}

// ---------- Text helpers ----------
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

function fitText(s, w) {
  if (fontWidth(s) <= w) return s;
  while (s.length > 3 && fontWidth(s + '...') > w) s = s.slice(0, -1);
  return s + '...';
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
