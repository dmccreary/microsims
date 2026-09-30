// Specification Block Anatomy Explorer
// CANVAS_HEIGHT: 610
// Shows a MicroSim specification block as a stack of labeled bands (heading, type,
// sim-id, library, status, learning objective, body, implementation). "Extract"
// runs a simulated extraction with the same kind of patterns a parser uses and
// marks missing fields in red. "Show defects" describes a generated defect and asks
// the learner to click the band that caused it.
// Bloom level: Analyze (deconstruct). The example specs and defects live in data.json.

// ---------- canvas dimensions (standard MicroSim layout) ----------
let canvasWidth = 400;
let drawHeight = 530;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 14;
let defaultTextSize = 16;

// ---------- band definitions ----------
const bandOrder = ['heading', 'type', 'sim-id', 'library', 'status', 'objective', 'body', 'implementation'];
const bandInfo = {
  'heading': { label: 'heading', def: 'A line that begins #### Diagram: or #### Drawing: followed by a title. Tools find blocks by this line.', decides: 'whether the extraction script finds the block at all' },
  'type': { label: 'type', def: 'Names the kind of element, such as microsim or diagram.', decides: 'what kind of element gets built' },
  'sim-id': { label: 'sim-id', def: 'The kebab-case name that becomes the MicroSim\'s folder under docs/sims. It must be unique across the whole book.', decides: 'the folder name and the iframe path' },
  'library': { label: 'library', def: 'Names the JavaScript library, such as p5.js or vis-network, chosen by routing (Chapter 4).', decides: 'which guide and library the agent uses' },
  'status': { label: 'status', def: 'Records the lifecycle state. New specifications are marked Specified.', decides: 'whether the batch run builds, reuses or skips the MicroSim' },
  'objective': { label: 'learning objective', def: 'States the Bloom level and verb and what the learner will be able to do. The design checkpoint reads it.', decides: 'the Bloom level and verb that choose the interaction pattern' },
  'body': { label: 'body', def: 'Describes layout, controls, data, interactions and responsive behavior, with exact ranges, defaults and sizes.', decides: 'the layout, controls, ranges, defaults and sizes' },
  'implementation': { label: 'implementation', def: 'The closing line that names the library calls and controls to use.', decides: 'which library calls and control functions the code uses' }
};

// ---------- state ----------
let data = null;             // loaded from data.json
let dataError = false;
let exampleIndex = 0;
let extracted = null;        // array of {key, value, band, missing}
let selectedBand = null;
let showDefects = false;
let defectIndex = 0;
let defectFeedback = null;   // {ok, band, text}
let bandRects = [];
let hoverBand = null;

// ---------- controls ----------
let exampleSelect, extractButton, defectsCheckbox, nextDefectButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  exampleSelect = createSelect();
  exampleSelect.parent(document.querySelector('main'));
  ['1. Complete specification', '2. Missing a Bloom verb', '3. No numeric ranges']
    .forEach((label, i) => exampleSelect.option(label, String(i)));
  exampleSelect.changed(changeExample);

  extractButton = createButton('Extract');
  extractButton.parent(document.querySelector('main'));
  extractButton.mouseClicked(runExtraction);

  defectsCheckbox = createCheckbox(' Show defects', false);
  defectsCheckbox.parent(document.querySelector('main'));
  defectsCheckbox.changed(toggleDefects);

  nextDefectButton = createButton('Next defect');
  nextDefectButton.parent(document.querySelector('main'));
  nextDefectButton.mouseClicked(nextDefect);
  nextDefectButton.hide();

  positionControls();

  // example specifications and defects come from data.json (fetch works in p5.js 1.x and 2.x)
  fetch('data.json')
    .then(r => r.json())
    .then(d => { data = d; runExtraction(); })   // example 1 opens already extracted
    .catch(() => { dataError = true; });

  describe('A MicroSim specification block drawn as eight labeled bands: heading, type, sim-id, library, ' +
    'status, learning objective, body and implementation. Choose one of three example specifications, press ' +
    'Extract to see the fields a parser would find with missing fields marked in red, and turn on Show defects ' +
    'to match a described generation defect to the band that caused it.', LABEL);
}

function positionControls() {
  exampleSelect.position(120, drawHeight + 8);
  exampleSelect.size(min(240, canvasWidth - 132));
  let x = 10;
  const y2 = drawHeight + 44;
  extractButton.position(x, y2); x += extractButton.elt.offsetWidth + 14;
  defectsCheckbox.position(x, y2 + 2); x += 130;
  nextDefectButton.position(x, y2);
}

function changeExample() {
  exampleIndex = int(exampleSelect.value());
  extracted = null;
  selectedBand = null;
  defectFeedback = null;
  if (data) defectIndex = data.examples[exampleIndex].startDefect;
}

function toggleDefects() {
  showDefects = defectsCheckbox.checked();
  defectFeedback = null;
  if (showDefects) {
    if (data) defectIndex = data.examples[exampleIndex].startDefect;
    nextDefectButton.show();
  } else {
    nextDefectButton.hide();
  }
}

function nextDefect() {
  if (!data) return;
  defectIndex = (defectIndex + 1) % data.defects.length;
  defectFeedback = null;
}

// ---------- simulated extraction ----------
// Uses regular expressions like those in a spec parser; a field with no match is missing.
function runExtraction() {
  if (!data) return;
  const b = data.examples[exampleIndex].bands;
  const rows = [];
  const add = (key, value, band) => rows.push({ key: key, value: value, band: band, missing: value === null });

  const h = b['heading'].match(/^####\s+(Diagram|Drawing):\s*(.+)$/);
  add('heading_type', h ? h[1] : null, 'heading');
  add('title', h ? h[2] : null, 'heading');
  const t = b['type'].match(/^Type:\s*(\S+)/);
  add('element_type', t ? t[1] : null, 'type');
  const s = b['sim-id'].match(/sim-id:\s*([a-z0-9]+(?:-[a-z0-9]+)*)\s*$/);
  add('sim_id', s ? s[1] : null, 'sim-id');
  const l = b['library'].match(/^Library:\s*(.+)$/);
  add('library', l ? l[1] : null, 'library');
  const st = b['status'].match(/^Status:\s*(\w+)/);
  add('status', st ? st[1] : null, 'status');
  const lv = b['objective'].match(/Bloom level:\s*(\w+)/);
  add('bloom_level', lv ? lv[1] : null, 'objective');
  const vb = b['objective'].match(/verb:\s*(\w+)/);
  add('bloom_verb', vb ? vb[1] : null, 'objective');
  const ob = b['objective'].match(/\):\s*(.+)$/);
  add('objective', ob ? ob[1] : null, 'objective');
  add('spec_text', b['body'].length + ' characters', 'body');
  // numbers the agent would otherwise have to invent: ranges, steps, defaults, sizes
  const nums = b['body'].match(/\d+(?:\.\d+)?(?:\s*to\s*\d+(?:\.\d+)?)?/g);
  add('numeric_values', nums ? nums.join(', ') : null, 'body');
  const im = b['implementation'].match(/^Implementation:\s*(.+)$/);
  add('implementation', im ? im[1] : null, 'implementation');
  extracted = rows;
}

function bandMissing(band) {
  return extracted && extracted.some(r => r.band === band && r.missing);
}

// ---------- draw ----------
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
  textSize(22);
  text('Specification Block Anatomy', canvasWidth / 2, 8);

  hoverBand = null;
  if (!data) {
    fill(dataError ? 'firebrick' : 'dimgray');
    textSize(16);
    text(dataError ? 'data.json could not be loaded. Open this page from a web server.' : 'Loading example specifications ...',
      canvasWidth / 2, 80);
    drawControlLabels();
    return;
  }

  const narrow = canvasWidth < 600;
  let stackRect, panelRect;
  if (narrow) {
    stackRect = { x: margin, y: 42, w: canvasWidth - 2 * margin, h: 0 };
    const bottom = drawStack(stackRect, true);
    panelRect = { x: margin, y: bottom + 10, w: canvasWidth - 2 * margin, h: drawHeight - bottom - 18 };
  } else {
    const stackW = canvasWidth * 0.56;
    stackRect = { x: margin, y: 42, w: stackW - margin, h: drawHeight - 50 };
    drawStack(stackRect, false);
    panelRect = { x: stackW + 12, y: 42, w: canvasWidth - stackW - 12 - margin, h: drawHeight - 50 };
  }
  drawPanel(panelRect, narrow);
  drawControlLabels();
  if (hoverBand) drawTooltip(bandInfo[hoverBand].label + ': ' + bandInfo[hoverBand].def);
}

// ---------- the stack of bands ----------
// compact = one line per band (narrow screens); otherwise text wraps and the font
// shrinks until the whole stack fits in r.h.
function drawStack(r, compact) {
  const b = data.examples[exampleIndex].bands;
  const tagW = compact ? 106 : 112;
  const gap = 4;
  let fs = 14;
  let layout;
  while (true) {
    layout = layoutBands(b, r.w - tagW - 16, fs, compact);
    const total = layout.reduce((a, L) => a + L.h, 0) + gap * (bandOrder.length - 1);
    if (compact || total <= r.h || fs <= 11) break;
    fs--;
  }
  bandRects = [];
  let y = r.y;
  layout.forEach((L, i) => {
    const key = bandOrder[i];
    const rr = { x: r.x, y: y, w: r.w, h: L.h, key: key };
    bandRects.push(rr);
    const hover = mouseX >= rr.x && mouseX <= rr.x + rr.w && mouseY >= rr.y && mouseY <= rr.y + rr.h;
    if (hover) hoverBand = key;
    const missing = bandMissing(key);
    const fb = defectFeedback && defectFeedback.band === key ? defectFeedback : null;

    // band body
    stroke(fb ? (fb.ok ? 'green' : 'firebrick') : (selectedBand === key ? 'darkorange' : (hover ? 'dimgray' : 'silver')));
    strokeWeight(fb || selectedBand === key ? 3 : 1);
    fill('white');
    rect(rr.x, rr.y, rr.w, rr.h, 5);
    // label tag
    noStroke();
    fill(missing ? 'firebrick' : 'steelblue');
    rect(rr.x + 1, rr.y + 1, tagW, rr.h - 2, 4, 0, 0, 4);
    fill('white');
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    textSize(compact ? 12 : 13);
    // one-line bands on narrow screens use the short label "objective"
    const tagLabel = (compact && key === 'objective') ? 'objective' : bandInfo[key].label;
    const tagLines = wrapLines(tagLabel + (missing ? ' !' : ''), tagW - 12);
    tagLines.forEach((t, k) => text(t, rr.x + 7, rr.y + rr.h / 2 + (k - (tagLines.length - 1) / 2) * 15));
    textStyle(NORMAL);
    // band content
    fill('black');
    textSize(fs);
    textAlign(LEFT, TOP);
    L.lines.forEach((t, k) => text(t, rr.x + tagW + 8, rr.y + 6 + k * (fs + 3)));
    y += L.h + gap;
  });
  return y - gap;
}

function layoutBands(b, w, fs, compact) {
  textSize(fs);
  return bandOrder.map(key => {
    let lines = wrapLines(b[key], w);
    if (compact && lines.length > 1) lines = [fitText(b[key], w)];
    return { lines: lines, h: Math.max(compact ? 26 : 30, lines.length * (fs + 3) + 10) };
  });
}

// ---------- the extraction panel ----------
function drawPanel(r, narrow) {
  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(r.x, r.y, r.w, r.h, 10);
  const pad = 10;
  let y = r.y + pad;
  const innerW = r.w - 2 * pad;
  noStroke();
  textAlign(LEFT, TOP);

  // defect card
  if (showDefects) {
    const d = data.defects[defectIndex];
    fill('lightyellow');
    stroke('goldenrod');
    strokeWeight(1);
    const cfs = narrow ? 13 : 14;
    const clh = cfs + 4;
    textSize(cfs);
    const prompt = wrapLines('Generated defect: "' + d.text + '"', innerW - 16);
    let fbLines = [];
    let fbColor = 'black';
    if (defectFeedback) {
      if (defectFeedback.ok) {
        fbLines = wrapLines('Yes, the ' + bandInfo[d.band].label + ' band. ' + d.explain, innerW - 16);
        fbColor = 'darkgreen';
      } else {
        fbLines = wrapLines('Not the ' + bandInfo[defectFeedback.band].label + ' band: it decides ' +
          bandInfo[defectFeedback.band].decides + '. Hint: ' + d.hint, innerW - 16);
        fbColor = 'firebrick';
      }
    } else {
      fbLines = wrapLines('Click the band that caused it.', innerW - 16);
      fbColor = 'dimgray';
    }
    const cardH = (prompt.length + fbLines.length) * clh + 14;
    rect(r.x + pad, y, innerW, cardH, 6);
    noStroke();
    fill('black');
    textStyle(BOLD);
    prompt.forEach((t, k) => text(t, r.x + pad + 8, y + 6 + k * clh));
    textStyle(NORMAL);
    fill(fbColor);
    fbLines.forEach((t, k) => text(t, r.x + pad + 8, y + 8 + (prompt.length + k) * clh));
    y += cardH + 10;
  }

  // extraction results
  fill('black');
  textStyle(BOLD);
  textSize(15);
  text('What the parser extracts', r.x + pad, y);
  textStyle(NORMAL);
  y += 22;
  textSize(13);
  if (!extracted) {
    fill('dimgray');
    const msg = selectedBand ?
      'Press Extract to see what a parser finds in the ' + bandInfo[selectedBand].label + ' band.' :
      'Press Extract to run a simulated extraction. Hover a band for its definition; click a band to highlight its fields.';
    wrapLines(msg, innerW).forEach(t => { text(t, r.x + pad, y); y += 17; });
    return;
  }

  const missingCount = extracted.filter(x => x.missing).length;
  let rows = extracted;
  const rowH = 18;
  const room = r.y + r.h - pad - y - 20;
  // not enough room for every field: list only the selected band's fields
  const showAll = rows.length * rowH <= room;
  if (!showAll) rows = extracted.filter(x => x.band === (selectedBand || '__none__'));

  const keyW = 118;
  rows.forEach(row => {
    if (y + rowH > r.y + r.h - 24) return;
    if (row.band === selectedBand) {
      fill('lemonchiffon');
      rect(r.x + pad - 4, y - 2, innerW + 8, rowH, 3);
    }
    fill(row.missing ? 'firebrick' : 'dimgray');
    textStyle(BOLD);
    text(row.key, r.x + pad, y);
    textStyle(NORMAL);
    fill(row.missing ? 'firebrick' : 'black');
    const val = row.missing ? 'MISSING' : row.value;
    text(fitText(val, innerW - keyW), r.x + pad + keyW, y);
    y += rowH;
  });
  if (!showAll && rows.length === 0) {
    fill('dimgray');
    wrapLines('Click a band to list the fields extracted from it.', innerW).forEach(t => { text(t, r.x + pad, y); y += 17; });
  }
  // summary line
  fill(missingCount ? 'firebrick' : 'darkgreen');
  textStyle(BOLD);
  textSize(13);
  const summary = missingCount ?
    missingCount + ' field' + (missingCount > 1 ? 's' : '') + ' missing: the agent will guess ' + (missingCount > 1 ? 'them' : 'it') + '.' :
    'All ' + extracted.length + ' fields found.';
  text(fitText(summary, innerW), r.x + pad, r.y + r.h - pad - 16);
  textStyle(NORMAL);
}

// ---------- control labels ----------
function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(16);
  textAlign(LEFT, CENTER);
  text('Example spec:', 10, drawHeight + 20);
}

// ---------- tooltip ----------
function drawTooltip(msg) {
  textSize(14);
  const maxW = min(300, canvasWidth - 30);
  const lines = wrapLines(msg, maxW - 16);
  const tw = min(maxW, max(lines.map(L => fontWidth(L))) + 16);
  const th = lines.length * 18 + 10;
  let tx = mouseX + 14, ty = mouseY + 16;
  if (tx + tw > canvasWidth - 4) tx = canvasWidth - 4 - tw;
  if (tx < 4) tx = 4;
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

// ---------- helpers ----------
function wrapLines(str, maxW) {
  const words = String(str).split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (fontWidth(test) > maxW && line) { lines.push(line); line = word; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function fitText(str, maxW) {
  str = String(str);
  if (fontWidth(str) <= maxW) return str;
  let s = str;
  while (s.length > 3 && fontWidth(s + '...') > maxW) s = s.slice(0, -1);
  return s + '...';
}

// ---------- mouse ----------
function mousePressed() {
  if (!data || mouseY > drawHeight) return;
  for (const r of bandRects) {
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) {
      selectedBand = r.key;
      if (showDefects) {
        const d = data.defects[defectIndex];
        defectFeedback = { ok: r.key === d.band, band: r.key };
      }
      return;
    }
  }
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
