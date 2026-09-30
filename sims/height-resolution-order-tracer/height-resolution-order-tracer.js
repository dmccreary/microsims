// Height Resolution Order Tracer - p5.js MicroSim
// CANVAS_HEIGHT: 610
// Learning objective (Analyze / examine): the learner examines a MicroSim folder and
// determines which of the four height sources sync-iframe-heights.py would use, and what
// iframe height results (CANVAS_HEIGHT + 2).
// The four sources, in the tool's priority order:
//   1. // CANVAS_HEIGHT: n   comment in the first 15 lines of <sim-id>.js
//   2. "canvasHeight": n     in metadata.json
//   3. <!-- CANVAS_HEIGHT: n --> in main.html
//   4. drawHeight + controlHeight computed from <sim-id>.js (then written back to line 2)
// The learner sets the inputs, clicks a source box to predict the winner, then presses Trace.

// ---------- canvas dimensions ----------
let canvasWidth = 700;
let drawHeight = 430;
let controlHeight = 180;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

// ---------- controls ----------
let presetSelect, traceButton;
let sourceChecks = [];     // four checkboxes, one per source
let valueInputs = [];      // 450, 480, 500, drawHeight 400, controlHeight 50
let inputColumn = 132;     // x where the checkboxes start (inputs sit to the left)

// ---------- model ----------
const SIM_ID = 'demo-sim';
const DEFAULTS = ['450', '480', '500', '400', '50'];
const PRESETS = {
  'p5.js sketch with comment':          [true, false, false, true],
  'Mermaid diagram with metadata only': [false, true, false, false],
  'Legacy HTML comment':                [false, false, true, false],
  'Sketch with variables only':         [false, false, false, true],
  'No height anywhere':                 [false, false, false, false]
};
const SOURCE_TITLES = [
  '// CANVAS_HEIGHT: n  in ' + SIM_ID + '.js',
  '"canvasHeight": n  in metadata.json',
  '<!-- CANVAS_HEIGHT: n -->  in main.html',
  'drawHeight + controlHeight  (computed)'
];
const SOURCE_NOTES = [
  'first 15 lines of the script',
  'MicroSims with no script',
  'older MicroSims, back-compat',
  'last resort, from the script'
];
const LONG_LABELS = [
  '1 · // CANVAS_HEIGHT comment present',
  '2 · metadata.json canvasHeight present',
  '3 · main.html comment present',
  '4 · drawHeight and controlHeight variables present'
];
const SHORT_LABELS = [
  '1 · // comment present',
  '2 · metadata canvasHeight',
  '3 · HTML comment present',
  '4 · height variables present'
];

// trace state: 'idle' (not traced), 'tracing', 'done'
let traceState = 'idle';
let traceIndex = 0;          // box currently being read during the trace
let traceTimer = 0;
const TRACE_STEP_MS = 550;
let prediction = null;       // 0..3 for a source, 4 for "unresolved", null for none

// geometry filled in by layout() each frame (used for hit testing)
let boxRects = [];
let resultRect = null;
let treeRows = [];           // {x, y, w, h, source} clickable tree rows
let staleIframe = 402;       // the height already written in index.md before this run

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Row 0: preset dropdown and Trace button
  presetSelect = createSelect();
  presetSelect.parent(document.querySelector('main'));
  Object.keys(PRESETS).forEach(name => presetSelect.option(name));
  presetSelect.selected('p5.js sketch with comment');
  presetSelect.changed(applyPreset);
  presetSelect.style('font-size', '15px');

  traceButton = createButton('Trace');
  traceButton.parent(document.querySelector('main'));
  traceButton.mousePressed(startTrace);
  traceButton.style('font-size', '15px');

  // Rows 1-4: value fields on the left, one checkbox per source
  for (let i = 0; i < 5; i++) {
    const inp = createInput(DEFAULTS[i], 'number');
    inp.parent(document.querySelector('main'));
    inp.style('font-size', '15px');
    inp.input(resetTrace);
    valueInputs.push(inp);
  }
  for (let i = 0; i < 4; i++) {
    const cb = createCheckbox(LONG_LABELS[i], false);
    cb.parent(document.querySelector('main'));
    cb.style('font-size', '15px');
    cb.changed(resetTrace);
    sourceChecks.push(cb);
  }
  applyPreset();
  positionControls();

  describe('Height Resolution Order Tracer. A folder tree of one MicroSim shows which ' +
    'height sources exist: a CANVAS_HEIGHT comment in the script, a canvasHeight field in ' +
    'metadata.json, a CANVAS_HEIGHT comment in main.html, and drawHeight plus controlHeight ' +
    'variables. Four numbered source boxes show what each source holds. Pressing Trace ' +
    'checks the boxes from priority 1 down and stops at the first one with a value; the ' +
    'result panel shows CANVAS_HEIGHT and the iframe height, CANVAS_HEIGHT plus 2, or ' +
    'reports that the MicroSim is unresolved and its iframes are left untouched.', LABEL);
}

// ---------- model helpers ----------
function parseIntStrict(s) {
  // the sync tool's regexes only accept plain digits
  const t = String(s).trim();
  return /^\d+$/.test(t) ? int(t) : null;
}

// value held by each source (null when the source is absent or not a plain integer)
function sourceValues() {
  const v = [];
  for (let i = 0; i < 3; i++) {
    v.push(sourceChecks[i].checked() ? parseIntStrict(valueInputs[i].value()) : null);
  }
  if (sourceChecks[3].checked()) {
    const d = parseIntStrict(valueInputs[3].value());
    const c = parseIntStrict(valueInputs[4].value());
    v.push(d !== null && c !== null ? d + c : null);
  } else {
    v.push(null);
  }
  return v;
}

function winnerIndex(vals) {
  for (let i = 0; i < 4; i++) if (vals[i] !== null) return i;
  return -1;
}

function jsFilePresent() {
  return sourceChecks[0].checked() || sourceChecks[3].checked();
}

// ---------- control handlers ----------
function applyPreset() {
  const flags = PRESETS[presetSelect.value()];
  for (let i = 0; i < 4; i++) sourceChecks[i].checked(flags[i]);
  for (let i = 0; i < 5; i++) valueInputs[i].value(DEFAULTS[i]);
  prediction = null;
  resetTrace();
}

function resetTrace() {
  traceState = 'idle';
  traceIndex = 0;
}

function startTrace() {
  traceState = 'tracing';
  traceIndex = 0;
  traceTimer = millis();
}

function toggleSource(i) {
  sourceChecks[i].checked(!sourceChecks[i].checked());
  resetTrace();
}

// ---------- layout ----------
function isWide() { return canvasWidth >= 600; }

function positionControls() {
  const y0 = drawHeight + 8;
  presetSelect.position(72, y0);
  const selW = presetSelect.elt.offsetWidth || 250;
  traceButton.position(72 + selW + 12, y0);

  const rowY = i => drawHeight + 44 + i * 33;
  // number fields (source 4 has two: drawHeight + controlHeight)
  for (let i = 0; i < 3; i++) {
    valueInputs[i].position(10, rowY(i));
    valueInputs[i].size(56);
  }
  valueInputs[3].position(10, rowY(3));
  valueInputs[3].size(48);
  valueInputs[4].position(86, rowY(3));
  valueInputs[4].size(40);
  const labels = canvasWidth >= 520 ? LONG_LABELS : SHORT_LABELS;
  for (let i = 0; i < 4; i++) {
    sourceChecks[i].position(inputColumn, rowY(i) + 2);
    const span = sourceChecks[i].elt.querySelector('span');
    if (span && span.innerHTML !== labels[i]) span.innerHTML = labels[i];
  }
}

// ---------- drawing ----------
function draw() {
  updateCanvasSize();

  // drawing region and control region backgrounds
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  advanceTrace();

  const vals = sourceValues();
  const win = winnerIndex(vals);

  // title and instruction
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(22);
  textStyle(BOLD);
  text('Height Resolution Order Tracer', margin, 8);
  textStyle(NORMAL);
  textSize(14);
  fill('dimgray');
  text(canvasWidth >= 560 ? 'Set the files, click a source box to predict the winner, then press Trace.'
    : 'Click a source box to predict, then press Trace.', margin, 36);

  // panel geometry
  const top = 60;
  let tree, stack;
  if (isWide()) {
    const treeW = floor(canvasWidth * 0.42);
    tree = { x: margin, y: top, w: treeW - margin, h: drawHeight - top - margin };
    stack = { x: treeW + margin, y: top, w: canvasWidth - treeW - 2 * margin };
  } else {
    tree = { x: margin, y: top, w: canvasWidth - 2 * margin, h: 118 };
    stack = { x: margin, y: top + tree.h + 8, w: canvasWidth - 2 * margin };
  }

  drawTree(tree, vals, win);
  drawSourceStack(stack, vals, win);
  drawTooltip(vals, win);

  // control-region labels
  noStroke();
  fill('black');
  textSize(16);
  textAlign(LEFT, CENTER);
  text('Preset:', 10, drawHeight + 20);
  textSize(15);
  text('+', 72, drawHeight + 44 + 3 * 33 + 13);
}

function advanceTrace() {
  if (traceState !== 'tracing') return;
  if (millis() - traceTimer < TRACE_STEP_MS) return;
  traceTimer = millis();
  const vals = sourceValues();
  if (vals[traceIndex] !== null) {        // stop on the first source with a value
    traceState = 'done';
    return;
  }
  if (traceIndex >= 3) {                  // walked past source 4: unresolved
    traceIndex = 4;
    traceState = 'done';
    return;
  }
  traceIndex++;
}

// ---------- folder tree ----------
function drawTree(r, vals, win) {
  treeRows = [];
  const wide = isWide();
  stroke('silver');
  fill('white');
  rect(r.x, r.y, r.w, r.h, 8);

  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(15);
  textStyle(BOLD);
  text('Folder: docs/sims/' + SIM_ID + '/', r.x + 10, r.y + 8);
  textStyle(NORMAL);

  const s = sourceChecks.map(c => c.checked());
  const usedSource4 = traceState === 'done' && win === 3;
  const lineH = wide ? 19 : 15;
  let y = r.y + (wide ? 34 : 28);
  const codeX = r.x + (wide ? 34 : 118);
  const nameX = r.x + 14;

  // helper: one file line with a clickable toggle box (source index or -1)
  const fileLine = (name, present, src) => {
    textSize(wide ? 15 : 13);
    noStroke();
    fill(present ? 'black' : 'dimgray');
    text(name, nameX + 16, y);
    // folder-tree connector
    stroke('silver');
    line(nameX + 4, y - 4, nameX + 4, y + lineH - 6);
    line(nameX + 4, y + 7, nameX + 12, y + 7);
    noStroke();
  };
  const codeLine = (txt, colorName, src, rowY) => {
    textFont('monospace');
    textSize(wide ? 13 : 12);
    noStroke();
    fill(colorName);
    text(txt, codeX, rowY, r.x + r.w - codeX - 6, lineH);
    textFont('sans-serif');
    if (src >= 0) treeRows.push({ x: r.x, y: rowY - 2, w: r.w, h: lineH, source: src });
  };

  // demo-sim.js
  const js = jsFilePresent();
  fileLine(SIM_ID + '.js', js, -1);
  if (!wide) {
    // narrow layout: the code snippet shares the file line
    const bits = [];
    if (s[0]) bits.push('// CANVAS_HEIGHT: ' + valueInputs[0].value());
    if (s[3]) bits.push('vars ' + valueInputs[3].value() + ' + ' + valueInputs[4].value());
    if (usedSource4) bits.push('// CANVAS_HEIGHT: ' + vals[3] + ' (written)');
    codeLine(js ? (bits.join('; ') || '(no height)') : '(no script file)',
      js ? 'darkslateblue' : 'dimgray', -1, y);
    treeRows.push({ x: r.x, y: y - 2, w: r.w, h: lineH, source: s[0] || !s[3] ? 0 : 3 });
    y += lineH;
  } else {
    y += lineH;
    if (!js) {
      codeLine('(no script file)', 'dimgray', 0, y);
      y += lineH;
    } else {
      codeLine('1 // Demo Sim', 'dimgray', -1, y); y += lineH;
      if (s[0]) {
        codeLine('2 // CANVAS_HEIGHT: ' + valueInputs[0].value(), 'darkslateblue', 0, y);
      } else if (usedSource4) {
        codeLine('2 // CANVAS_HEIGHT: ' + vals[3] + '  <- written by sync', 'green', 0, y);
      } else {
        codeLine('2 (no CANVAS_HEIGHT comment)', 'dimgray', 0, y);
      }
      y += lineH;
      if (s[3]) {
        codeLine('  let drawHeight = ' + valueInputs[3].value() + ';', 'darkslateblue', 3, y); y += lineH;
        codeLine('  let controlHeight = ' + valueInputs[4].value() + ';', 'darkslateblue', 3, y); y += lineH;
      } else {
        codeLine('  (no height variables)', 'dimgray', 3, y); y += lineH;
      }
    }
  }
  y += wide ? 4 : 0;

  // metadata.json
  fileLine('metadata.json', true, -1);
  if (!wide) {
    codeLine(s[1] ? '"canvasHeight": ' + valueInputs[1].value() : '(no canvasHeight)',
      s[1] ? 'darkslateblue' : 'dimgray', 1, y);
    y += lineH;
  } else {
    y += lineH;
    codeLine(s[1] ? '"canvasHeight": ' + valueInputs[1].value() : '(no canvasHeight key)',
      s[1] ? 'darkslateblue' : 'dimgray', 1, y);
    y += lineH + 4;
  }

  // main.html
  fileLine('main.html', true, -1);
  if (!wide) {
    codeLine(s[2] ? '<!-- CANVAS_HEIGHT: ' + valueInputs[2].value() + ' -->' : '(no comment)',
      s[2] ? 'darkslateblue' : 'dimgray', 2, y);
    y += lineH;
  } else {
    y += lineH;
    codeLine(s[2] ? '<!-- CANVAS_HEIGHT: ' + valueInputs[2].value() + ' -->' : '(no height comment)',
      s[2] ? 'darkslateblue' : 'dimgray', 2, y);
    y += lineH + 4;
  }

  // index.md: shows what the sync tool would write
  fileLine('index.md', true, -1);
  let iframeTxt, iframeColor;
  if (traceState === 'done' && win >= 0) {
    iframeTxt = 'height="' + (vals[win] + 2) + 'px"  (was ' + staleIframe + 'px)';
    iframeColor = 'green';
  } else if (traceState === 'done') {
    iframeTxt = 'height="' + staleIframe + 'px"  (left untouched)';
    iframeColor = 'darkgoldenrod';
  } else {
    iframeTxt = '<iframe ... height="' + staleIframe + 'px">';
    iframeColor = 'dimgray';
  }
  if (!wide) {
    codeLine(iframeTxt, iframeColor, -1, y);
    y += lineH;
  } else {
    y += lineH;
    codeLine(iframeTxt, iframeColor, -1, y);
    y += lineH;
  }

  // wide layout: the tool's rules in the spare space below the tree
  if (wide) {
    y += 12;
    noStroke();
    fill('black');
    textSize(14);
    textStyle(BOLD);
    text('How sync-iframe-heights.py reads it', r.x + 10, y);
    textStyle(NORMAL);
    fill('dimgray');
    textSize(13);
    text('It checks sources 1 to 4 in order and stops at the first value. ' +
      'Only a plain integer counts. Click a gray or blue line to toggle it.',
      r.x + 10, y + 20, r.w - 20, r.y + r.h - y - 22);
  }
}

// ---------- the four source boxes and the result panel ----------
function drawSourceStack(r, vals, win) {
  const wide = isWide();
  const boxH = wide ? 54 : 40;
  const gap = wide ? 7 : 5;
  boxRects = [];
  for (let i = 0; i < 4; i++) {
    const b = { x: r.x, y: r.y + i * (boxH + gap), w: r.w, h: boxH };
    boxRects.push(b);
    const status = boxStatus(i, vals, win);

    // box fill by trace status
    let bg = 'white', edge = 'silver', weight = 1;
    if (status === 'reading') { bg = 'lightyellow'; edge = 'goldenrod'; weight = 3; }
    else if (status === 'empty') { bg = 'gainsboro'; edge = 'gray'; }
    else if (status === 'used') { bg = 'honeydew'; edge = 'green'; weight = 3; }
    else if (status === 'ignored') { bg = 'white'; edge = 'darkorange'; weight = 2; }
    stroke(edge);
    strokeWeight(weight);
    fill(bg);
    rect(b.x, b.y, b.w, b.h, 6);
    strokeWeight(1);

    // priority badge
    noStroke();
    fill(status === 'used' ? 'green' : 'steelblue');
    circle(b.x + 18, b.y + b.h / 2, 24);
    fill('white');
    textAlign(CENTER, CENTER);
    textSize(15);
    textStyle(BOLD);
    text(i + 1, b.x + 18, b.y + b.h / 2 + 1);

    // source title and value
    const tagW = 96;
    const tx = b.x + 36;
    const tw = b.w - 36 - tagW;
    textAlign(LEFT, TOP);
    fill('black');
    textSize(canvasWidth >= 760 ? 14 : 13);
    text(SOURCE_TITLES[i], tx, b.y + (wide ? 7 : 4), tw + (traceState === 'idle' && prediction !== i ? tagW - 8 : 0), 18);
    textStyle(NORMAL);
    const v = vals[i];
    let vt;
    if (v === null) vt = wide ? 'empty  (' + SOURCE_NOTES[i] + ')' : 'empty';
    else if (i === 3) vt = 'value ' + v + ' (' + valueInputs[3].value() + ' + ' + valueInputs[4].value() + ')';
    else vt = 'value ' + v;
    fill(v === null ? 'dimgray' : 'darkslateblue');
    textSize(13);
    text(vt, tx, b.y + b.h - (wide ? 18 : 17), tw, 16);

    // status tag on the right
    let tag = '', tagColor = 'dimgray';
    if (status === 'reading') { tag = 'reading...'; tagColor = 'darkgoldenrod'; }
    else if (status === 'empty') { tag = 'empty: next'; tagColor = 'dimgray'; }
    else if (status === 'used') { tag = 'USED'; tagColor = 'green'; }
    else if (status === 'ignored') { tag = 'ignored (hover)'; tagColor = 'darkorange'; }
    else if (status === 'notread') { tag = 'not read'; tagColor = 'dimgray'; }
    textAlign(RIGHT, CENTER);
    textSize(13);
    textStyle(BOLD);
    fill(tagColor);
    text(tag, b.x + b.w - 8, b.y + b.h / 2 - (prediction === i ? 8 : 0));
    textStyle(NORMAL);
    if (prediction === i) {
      fill('purple');
      text('your prediction', b.x + b.w - 8, b.y + b.h / 2 + 10);
    }
  }

  // result panel
  const ry = r.y + 4 * (boxH + gap) + 2;
  const rh = wide ? 90 : 64;
  resultRect = { x: r.x, y: ry, w: r.w, h: rh };
  drawResult(resultRect, vals, win);
}

// status of one source box: '' (not traced), 'reading', 'empty', 'used', 'ignored', 'notread'
function boxStatus(i, vals, win) {
  if (traceState === 'tracing') {
    if (i < traceIndex) return 'empty';
    if (i === traceIndex) return 'reading';
    return '';
  }
  if (traceState === 'done') {
    if (win < 0) return 'empty';
    if (i < win) return 'empty';
    if (i === win) return 'used';
    return vals[i] !== null && vals[i] !== vals[win] ? 'ignored' : 'notread';
  }
  return '';
}

function drawResult(r, vals, win) {
  const wide = isWide();
  let bg = 'white', edge = 'silver';
  const done = traceState === 'done';
  if (done && win >= 0) { bg = 'honeydew'; edge = 'green'; }
  if (done && win < 0) { bg = 'moccasin'; edge = 'darkorange'; }
  stroke(edge);
  strokeWeight(done ? 2 : 1);
  fill(bg);
  rect(r.x, r.y, r.w, r.h, 6);
  strokeWeight(1);
  noStroke();
  textAlign(LEFT, TOP);
  const pad = 10;
  const tw = r.w - 2 * pad;

  if (!done) {
    fill('black');
    textSize(wide ? 17 : 15);
    textStyle(BOLD);
    text(traceState === 'tracing' ? 'Tracing from priority 1...' : 'Result: press Trace',
      r.x + pad, r.y + 8, tw, 22);
    textStyle(NORMAL);
    textSize(13);
    fill('dimgray');
    const p = prediction === null ? 'No prediction yet: click the source box you think will win ' +
      '(or this panel for "unresolved").'
      : 'Your prediction: ' + (prediction === 4 ? 'unresolved' : 'source ' + (prediction + 1)) + '.';
    text(p, r.x + pad, r.y + (wide ? 34 : 28), tw, r.h - 36);
    if (prediction === 4) {
      fill('purple');
      textAlign(RIGHT, TOP);
      text('your prediction', r.x + r.w - 8, r.y + 8);
    }
    return;
  }

  // traced: show the answer, the prediction check, and any note
  fill(win >= 0 ? 'darkgreen' : 'saddlebrown');
  textStyle(BOLD);
  const headline = win >= 0
    ? 'CANVAS_HEIGHT = ' + vals[win] + ', iframe = ' + vals[win] + ' + 2 = ' + (vals[win] + 2) + 'px'
    : 'unresolved: iframes left untouched';
  let ts = wide ? 18 : 15;
  textSize(ts);
  while (textWidth(headline) > tw && ts > 11) { ts--; textSize(ts); }
  text(headline, r.x + pad, r.y + 7);
  textStyle(NORMAL);
  textSize(13);
  fill('black');
  let note;
  if (win === 3) {
    note = 'Source 4 was used, so the tool writes "// CANVAS_HEIGHT: ' + vals[3] +
      '" into line 2 of ' + SIM_ID + '.js; the next run finds it at priority 1.';
  } else if (win >= 0) {
    note = 'Source ' + (win + 1) + ' is the first with a value; every iframe that shows ' +
      SIM_ID + ' gets ' + (vals[win] + 2) + 'px.';
  } else {
    note = 'No source has a value. The sim is reported as unresolved and skipped, ' +
      'the same way folders that are not MicroSims are skipped.';
  }
  const answer = win >= 0 ? win : 4;
  let verdict = '';
  if (prediction !== null) {
    verdict = prediction === answer ? '  Your prediction was right.'
      : '  Your prediction (' + (prediction === 4 ? 'unresolved' : 'source ' + (prediction + 1)) +
        ') was not the winner.';
  }
  text(note + verdict, r.x + pad, r.y + (wide ? 34 : 28), tw, r.h - (wide ? 36 : 30));
}

// tooltip explaining why a disagreeing lower-priority value is ignored
function drawTooltip(vals, win) {
  if (traceState !== 'done' || win < 0) return;
  for (let i = win + 1; i < 4; i++) {
    const b = boxRects[i];
    if (!b || vals[i] === null || vals[i] === vals[win]) continue;
    if (mouseX < b.x || mouseX > b.x + b.w || mouseY < b.y || mouseY > b.y + b.h) continue;
    const why = [
      '',
      ' Running the sync tool with --write-metadata would overwrite it with ' + vals[win] + '.',
      ' Update or delete the old comment so the two cannot drift.',
      ' The variables changed but the comment did not: update the comment after every layout edit.'
    ][i];
    const msg = 'Source ' + (win + 1) + ' already has ' + vals[win] + ', and the tool stops at the ' +
      'first source with a value, so this ' + vals[i] + ' is never read.' + why;
    const tw = min(300, canvasWidth - 20);
    textSize(13);
    const lines = ceil(textWidth(msg) / (tw - 16)) + 1;
    const th = lines * 17 + 12;
    let tx = constrain(mouseX - tw / 2, 10, canvasWidth - tw - 10);
    let ty = b.y - th - 6;
    if (ty < 4) ty = b.y + b.h + 6;
    stroke('darkorange');
    fill('lightyellow');
    rect(tx, ty, tw, th, 6);
    noStroke();
    fill('black');
    textAlign(LEFT, TOP);
    text(msg, tx + 8, ty + 6, tw - 16, th - 8);
  }
}

// ---------- mouse: predict by clicking a box, toggle a source by clicking a tree line ----------
function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight || mouseX < 0 || mouseX > canvasWidth) return;
  if (traceState === 'tracing') return;
  for (let i = 0; i < boxRects.length; i++) {
    const b = boxRects[i];
    if (mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h) {
      prediction = (prediction === i) ? null : i;
      resetTrace();
      return;
    }
  }
  const r = resultRect;
  if (r && mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) {
    prediction = (prediction === 4) ? null : 4;
    resetTrace();
    return;
  }
  for (const row of treeRows) {
    if (mouseX >= row.x && mouseX <= row.x + row.w && mouseY >= row.y && mouseY <= row.y + row.h) {
      toggleSource(row.source);
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
  if (container) canvasWidth = max(320, container.offsetWidth);
}
