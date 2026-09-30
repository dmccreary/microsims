// Faceted Filter Lab
// CANVAS_HEIGHT: 650
// Narrow a 300-record sample of the MicroSim catalog (sample.json, drawn from
// search-microsims docs/search/microsims-data.json) with three facets: Subject,
// Framework and Bloom level. Different facets always combine with AND; the
// toggle chooses OR or AND within a facet. "Predict first" hides the counts
// until the learner has typed the count they expect after their next change.

// ---------- canvas layout ----------
let canvasWidth = 400;
let drawHeight = 570;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let sliderLeftMargin = 150;   // no sliders; kept for the standard layout
let defaultTextSize = 16;

// ---------- controls ----------
let modeButton, resetButton, predictButton, predictInput;

// ---------- data and state ----------
const FACETS = [
  { key: 'subject', label: 'Subject', top: 6 },
  { key: 'framework', label: 'Framework', top: 5 },
  { key: 'bloomLevel', label: 'Bloom level', top: 8 }
];
const MISSING = '(missing)';
const BLOOM_ORDER = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];
let records = null;          // normalized records
let loadError = false;
let chipValues = {};         // facet key -> [{value, label}]
let selected = { subject: new Set(), framework: new Set(), bloomLevel: new Set() };
let withinMode = 'OR';
let chips = [];              // drawn chips for hit testing and keyboard focus
let focusIndex = -1;
let listRows = [];           // drawn title rows for hover tooltips
let predict = null;          // null | { armed: true } | { value, actual, before }
let lastResult = null;
let message = '';

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  frameRate(30);
  textSize(defaultTextSize);
  const mainEl = document.querySelector('main');

  modeButton = createButton('Within a facet: OR');
  modeButton.parent(mainEl);
  modeButton.mousePressed(toggleMode);

  resetButton = createButton('Reset filters');
  resetButton.parent(mainEl);
  resetButton.mousePressed(resetFilters);

  predictButton = createButton('Predict first');
  predictButton.parent(mainEl);
  predictButton.mousePressed(armPrediction);

  predictInput = createInput('', 'number');
  predictInput.parent(mainEl);
  predictInput.attribute('min', '0');
  predictInput.attribute('max', '300');
  predictInput.attribute('aria-label', 'Predicted number of records after your next change');
  predictInput.size(70);
  predictInput.hide();

  // Keyboard alternative: Tab moves between chips while the canvas has focus, Space toggles
  canvas.elt.setAttribute('tabindex', '0');
  canvas.elt.setAttribute('aria-label', 'Facet chips. Tab moves between chips, Space toggles one.');
  canvas.elt.addEventListener('keydown', onCanvasKey);
  canvas.elt.addEventListener('blur', () => { focusIndex = -1; });
  canvas.elt.addEventListener('focus', () => { if (focusIndex < 0) focusIndex = 0; });

  positionControls();

  loadJSON('sample.json', data => { records = data.records.map(normalizeRecord); buildChipValues(); },
    () => { loadError = true; });

  describe('A faceted search lab over 300 MicroSim catalog records. Three facets, Subject, Framework ' +
    'and Bloom level, list value chips with record counts; clicking a chip toggles it and selected chips ' +
    'turn green. A bar shows how many records remain and a list shows up to 12 matching titles. A ' +
    'button switches the logic within a facet between OR and AND; different facets always combine with ' +
    'AND. Predict first hides the counts until you type the count you expect after your next change.');
}

function positionControls() {
  const y1 = drawHeight + 8;
  modeButton.position(10, y1);
  resetButton.position(168, y1);
  predictButton.position(272, y1);
  predictInput.position(150, y1 + 38);
}

// ---------- normalization (case, version suffixes, "(L2)" labels) ----------
function asList(v) {
  if (v === null || v === undefined || v === '') return [];
  return Array.isArray(v) ? v.filter(x => x !== null && x !== '') : [v];
}

function normSubject(v) { return String(v).trim().toLowerCase(); }

function normFramework(v) {
  const s = String(v).trim();
  const low = s.toLowerCase();
  if (low.startsWith('p5')) return 'p5.js';
  if (low.startsWith('vis-network') || low === 'vis.js') return 'vis-network';
  if (low.startsWith('mermaid')) return 'Mermaid';
  if (low.startsWith('chart')) return 'Chart.js';
  if (low.startsWith('vis-timeline')) return 'vis-timeline';
  if (low.startsWith('leaflet')) return 'Leaflet';
  return s;
}

function normBloom(v) {
  const s = String(v).trim();
  for (const L of BLOOM_ORDER) {
    if (s.toLowerCase().startsWith(L.toLowerCase()) || new RegExp('^\\d-' + L, 'i').test(s)) return L;
  }
  return s;
}

function normalizeRecord(r) {
  const vals = (v, f) => {
    const out = [...new Set(asList(v).map(f))];
    return out.length ? out : [MISSING];
  };
  return {
    title: r.title || '(untitled)',
    description: r.description || '',
    url: r.url || '',
    subject: vals(r.subject, normSubject),
    framework: vals(r.framework, normFramework),
    bloomLevel: vals(r.bloomLevel, normBloom)
  };
}

// The chips shown for each facet: its most common values plus (missing)
function buildChipValues() {
  for (const f of FACETS) {
    const counts = {};
    for (const r of records) for (const v of r[f.key]) counts[v] = (counts[v] || 0) + 1;
    let vals = Object.keys(counts).filter(v => v !== MISSING);
    if (f.key === 'bloomLevel') {
      vals = vals.filter(v => BLOOM_ORDER.includes(v) || v === 'TBD')
        .sort((a, b) => bloomRank(a) - bloomRank(b));
    } else {
      vals.sort((a, b) => counts[b] - counts[a]);
      vals = vals.slice(0, f.top);
    }
    if (counts[MISSING]) vals.push(MISSING);
    chipValues[f.key] = vals;
  }
}

function bloomRank(v) { const i = BLOOM_ORDER.indexOf(v); return i < 0 ? 99 : i; }

// ---------- filtering ----------
function matchesFacet(r, key, sel) {
  if (sel.size === 0) return true;
  const vals = r[key];
  if (withinMode === 'OR') { for (const v of sel) if (vals.includes(v)) return true; return false; }
  for (const v of sel) if (!vals.includes(v)) return false;
  return true;
}

function filterRecords(sel) {
  return records.filter(r => FACETS.every(f => matchesFacet(r, f.key, sel[f.key])));
}

// Count shown on a chip. OR: records matching the other facets that have the value.
// AND: records matching every facet (this one included) that have the value.
function chipCount(key, value) {
  let n = 0;
  for (const r of records) {
    let ok = true;
    for (const f of FACETS) {
      if (f.key === key && withinMode === 'OR') continue;
      if (!matchesFacet(r, f.key, selected[f.key])) { ok = false; break; }
    }
    if (ok && r[key].includes(value)) n++;
  }
  return n;
}

// ---------- actions ----------
function changeAllowed() {
  if (predict && predict.armed) {
    const v = predictInput.value();
    if (v === '' || isNaN(int(v))) { message = 'Type your predicted count first, then make one change.'; return false; }
  }
  return true;
}

function afterChange(before) {
  const after = filterRecords(selected).length;
  if (predict && predict.armed) {
    predict = { value: int(predictInput.value()), actual: after, before: before };
    predictInput.hide();
    predictButton.html('Predict first');
  }
  message = '';
}

function toggleChip(key, value) {
  if (!records) return;
  const isSel = selected[key].has(value);
  if (!isSel && chipCount(key, value) === 0) return;
  if (!changeAllowed()) return;
  const before = filterRecords(selected).length;
  if (isSel) selected[key].delete(value); else selected[key].add(value);
  afterChange(before);
}

function toggleMode() {
  if (!records || !changeAllowed()) return;
  const before = filterRecords(selected).length;
  withinMode = withinMode === 'OR' ? 'AND' : 'OR';
  modeButton.html('Within a facet: ' + withinMode);
  afterChange(before);
}

function resetFilters() {
  for (const f of FACETS) selected[f.key].clear();
  predict = null;
  predictInput.hide();
  predictButton.html('Predict first');
  message = '';
}

function armPrediction() {
  if (predict && predict.armed) {   // cancel
    predict = null;
    predictInput.hide();
    predictButton.html('Predict first');
    message = '';
    return;
  }
  predict = { armed: true };
  predictInput.value('');
  predictInput.show();
  predictInput.elt.focus();
  predictButton.html('Cancel');
  message = '';
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
  textAlign(CENTER, TOP);
  textSize(isWide() ? 22 : 20);
  text('Faceted Filter Lab', canvasWidth / 2, 8);

  drawControlText();
  if (!records) {
    textSize(16);
    textAlign(CENTER, CENTER);
    fill(loadError ? 'firebrick' : 'dimgray');
    text(loadError ? 'Could not load sample.json. Open this page through a web server.' : 'Loading the catalog sample...',
      canvasWidth / 2, drawHeight / 2);
    return;
  }

  const hidden = predict && predict.armed;
  const result = filterRecords(selected);
  lastResult = result;

  let facetBottom;
  let rx, ry, rw;
  if (isWide()) {
    const lw = floor(canvasWidth * 0.45);
    facetBottom = drawFacets(margin, 42, lw - margin, hidden);
    rx = lw + 10; ry = 42; rw = canvasWidth - rx - margin;
    drawSideNote(margin, facetBottom + 8, lw - margin);
  } else {
    facetBottom = drawFacets(margin, 38, canvasWidth - 2 * margin, hidden);
    rx = margin; ry = facetBottom + 6; rw = canvasWidth - 2 * margin;
  }
  drawResults(rx, ry, rw, drawHeight - ry - 8, result, hidden);
  drawTooltip();
  cursor(chipAt(mouseX, mouseY) >= 0 || rowAt(mouseX, mouseY) >= 0 ? HAND : ARROW);
}

// Draw the three facets as flowing chips; returns the y below the last facet
function drawFacets(x, y, w, hidden) {
  chips = [];
  const chipH = 22, gap = 5;
  const hasFocus = document.activeElement === document.querySelector('canvas');
  for (const f of FACETS) {
    noStroke();
    fill('black');
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(15);
    text(f.label, x, y);
    const lw = fontWidth(f.label);
    textStyle(NORMAL);
    textSize(12);
    fill('dimgray');
    text(selected[f.key].size ? (selected[f.key].size + ' selected') : 'any value', x + lw + 8, y + 3);
    y += 21;
    let cx = x;
    textSize(13);
    for (const v of chipValues[f.key]) {
      const count = chipCount(f.key, v);
      const isSel = selected[f.key].has(v);
      const label = hidden ? v : v + '  ' + count;
      const cw = fontWidth(label) + 20;
      if (cx + cw > x + w && cx > x) { cx = x; y += chipH + gap; }
      const disabled = !isSel && count === 0;
      const idx = chips.length;
      chips.push({ key: f.key, value: v, x: cx, y: y, w: cw, h: chipH, disabled });
      stroke(isSel ? 'darkgreen' : (disabled ? 'silver' : 'steelblue'));
      strokeWeight(isSel ? 2 : 1);
      fill(isSel ? 'seagreen' : (disabled ? 'gainsboro' : 'white'));
      rect(cx, y, cw, chipH, 12);
      if (hasFocus && idx === focusIndex) {
        noFill();
        stroke('darkorange');
        strokeWeight(2);
        drawingContext.setLineDash([4, 3]);
        rect(cx - 3, y - 3, cw + 6, chipH + 6, 14);
        drawingContext.setLineDash([]);
      }
      noStroke();
      fill(isSel ? 'white' : (disabled ? 'gray' : 'black'));
      textAlign(CENTER, CENTER);
      text(label, cx + cw / 2, y + chipH / 2 + 1);
      cx += cw + gap;
    }
    y += chipH + 12;
  }
  return y;
}

function drawSideNote(x, y, w) {
  noStroke();
  fill('dimgray');
  textSize(13);
  textAlign(LEFT, TOP);
  wrapText('Across facets: always AND. Within a facet: ' + withinMode + '. Values were normalized ' +
    'for case, version numbers and "(L2)" labels; "(missing)" counts records with no value. ' +
    'Keyboard: click the chips area, then Tab and Space.', x, y, w, 17);
}

function drawResults(x, y, w, h, result, hidden) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 8);
  const ix = x + 10, iw = w - 20;
  let yy = y + 8;
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(15);
  text('Records remaining: ' + (hidden ? '?' : result.length) + ' of ' + records.length, ix, yy);
  textStyle(NORMAL);
  yy += 22;
  // bar
  fill('whitesmoke');
  stroke('silver');
  rect(ix, yy, iw, 16, 4);
  noStroke();
  if (!hidden) {
    fill('seagreen');
    rect(ix, yy, max(2, iw * result.length / records.length), 16, 4);
  }
  yy += 24;
  // the query in words
  textSize(13);
  fill('dimgray');
  yy += wrapText(queryText(), ix, yy, iw, 17) + 4;
  // prediction feedback or prompt
  if (predict && predict.armed) {
    fill('darkorange');
    textSize(14);
    yy += wrapText(message || 'Prediction armed: type the count you expect, then click one chip or flip OR/AND.', ix, yy, iw, 18) + 4;
  } else if (predict && predict.value !== undefined) {
    const diff = predict.actual - predict.value;
    fill(abs(diff) <= max(2, predict.actual * 0.1) ? 'darkgreen' : 'firebrick');
    textSize(14);
    yy += wrapText('You predicted ' + predict.value + '. Actual: ' + predict.actual + ' (was ' + predict.before + '). ' +
      'Difference: ' + (diff > 0 ? '+' : '') + diff + '.', ix, yy, iw, 18) + 4;
  } else if (message) {
    fill('darkorange');
    textSize(14);
    yy += wrapText(message, ix, yy, iw, 18) + 4;
  }
  // matching titles
  stroke('gainsboro');
  line(ix, yy + 2, ix + iw, yy + 2);
  yy += 8;
  listRows = [];
  noStroke();
  textSize(14);
  if (hidden) {
    fill('gray');
    text('Titles hidden until your change is made.', ix, yy);
    return;
  }
  const rowH = 19;
  const room = floor((y + h - yy - 22) / rowH);
  const shown = min([12, room, result.length]);
  const sorted = result.slice().sort((a, b) => a.title.localeCompare(b.title));
  for (let i = 0; i < shown; i++) {
    const r = sorted[i];
    const over = mouseX >= ix && mouseX <= ix + iw && mouseY >= yy && mouseY < yy + rowH;
    if (over) { fill(230, 240, 250); rect(ix - 4, yy - 1, iw + 8, rowH, 3); }
    fill('black');
    text(fitText('• ' + r.title, iw), ix, yy + 1);
    listRows.push({ x: ix, y: yy, w: iw, h: rowH, rec: r });
    yy += rowH;
  }
  if (result.length === 0) {
    fill('firebrick');
    text('No records match. Try OR within a facet, or remove a chip.', ix, yy);
  } else if (result.length > shown) {
    fill('dimgray');
    text('… and ' + (result.length - shown) + ' more', ix, yy + 2);
  }
}

function queryText() {
  const parts = [];
  for (const f of FACETS) {
    const s = [...selected[f.key]];
    if (s.length) parts.push('(' + f.label + ' = ' + s.join(' ' + withinMode + ' ') + ')');
  }
  return parts.length ? parts.join(' AND ') : 'No filters: every record matches.';
}

function drawTooltip() {
  const i = rowAt(mouseX, mouseY);
  if (i < 0) return;
  const r = listRows[i].rec;
  textSize(13);
  const w = min(320, canvasWidth - 30);
  let desc = r.description.length > 260 ? r.description.slice(0, 257) + '...' : r.description;
  const lines = wrapLines(desc || '(no description in the record)', w - 12);
  const h = lines.length * 17 + 10;
  let tx = constrain(mouseX - w / 2, 6, canvasWidth - w - 6);
  let ty = mouseY + 18;
  if (ty + h > drawHeight - 4) ty = mouseY - h - 10;
  stroke('gray');
  strokeWeight(1);
  fill('lightyellow');
  rect(tx, ty, w, h, 5);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  for (let k = 0; k < lines.length; k++) text(lines[k], tx + 6, ty + 5 + k * 17);
}

function drawControlText() {
  noStroke();
  fill('black');
  textSize(15);
  textAlign(LEFT, CENTER);
  const y2 = drawHeight + 50;
  if (predict && predict.armed) text('Predicted count:', 10, y2);
  else {
    fill('dimgray');
    textSize(14);
    text('Predict first hides the counts until you commit to a number.', 10, y2);
  }
}

// ---------- text helpers ----------
function wrapLines(str, w) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (fontWidth(test) > w && line) { lines.push(line); line = word; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function wrapText(str, x, y, w, lead) {
  const lines = wrapLines(str, w);
  textAlign(LEFT, TOP);
  for (let i = 0; i < lines.length; i++) text(lines[i], x, y + i * lead);
  return lines.length * lead;
}

function fitText(str, w) {
  if (fontWidth(str) <= w) return str;
  while (str.length > 3 && fontWidth(str + '…') > w) str = str.slice(0, -1);
  return str + '…';
}

// ---------- hit testing and events ----------
function chipAt(mx, my) {
  for (let i = 0; i < chips.length; i++) {
    const c = chips[i];
    if (mx >= c.x && mx <= c.x + c.w && my >= c.y && my <= c.y + c.h) return i;
  }
  return -1;
}

function rowAt(mx, my) {
  for (let i = 0; i < listRows.length; i++) {
    const r = listRows[i];
    if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my < r.y + r.h) return i;
  }
  return -1;
}

function mousePressed() {
  const i = chipAt(mouseX, mouseY);
  if (i >= 0) {
    focusIndex = i;
    toggleChip(chips[i].key, chips[i].value);
  }
}

function onCanvasKey(e) {
  if (!chips.length) return;
  if (e.key === 'Tab') {
    const next = focusIndex + (e.shiftKey ? -1 : 1);
    if (next >= 0 && next < chips.length) { focusIndex = next; e.preventDefault(); }
    else focusIndex = -1;   // let Tab leave the canvas
  } else if (e.key === ' ' || e.key === 'Spacebar') {
    if (focusIndex >= 0) toggleChip(chips[focusIndex].key, chips[focusIndex].value);
    e.preventDefault();
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
