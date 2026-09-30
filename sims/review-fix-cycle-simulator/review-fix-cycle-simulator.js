// Review and Fix Cycle Simulator - p5.js MicroSim
// CANVAS_HEIGHT: 560
// Learning objective (Evaluate / judge): the learner judges whether each proposed patch follows
// the smallest patch rule and decides when the fix cycle limit requires stopping and reporting.
// A mock screenshot starts with three seeded defects: 1.1 clipped row labels, 1.3 a residual
// text stroke, 3.1 a title running under a panel. For the selected defect the learner picks one of
// three patches: the smallest correct patch (clears it), an over-broad patch that also changes an
// unrelated value (clears it and creates a new defect), or a patch aimed at the wrong cause
// (changes nothing visible). Each "Apply patch and re-capture" consumes one of three cycles; after
// the third the simulator locks until "Stop and report". Rules follow the layout reviewer guide.

// ---------- canvas dimensions ----------
let canvasWidth = 700;
let drawHeight = 440;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

// ---------- controls ----------
let defectSelect, patchSelect, applyButton, stopButton, resetButton, hintCheckbox;

// ---------- defects and patches ----------
// kind: small (smallest correct), broad (over-broad), wrong (wrong cause); creates: defect id
const DEFECTS = {
  A: { item: '1.1', name: 'Clipped row labels', short: 'Clipped labels', seeded: true,
    hint: 'Clipped row/column labels on a grid. Likely cause: the grid reserves a fixed offset ' +
      '(axisOffset) smaller than the widest label. Fix: raise it to at least ' +
      'textWidth(longestLabel) + 8; for 13-pt "completion: false" (about 96 px), 110 is safe.',
    patches: [
      { kind: 'broad', text: 'Raise axisOffset to 110 and cut sliderLeftMargin 140 to 90', creates: 'D',
        why: 'fixed the labels but also changed sliderLeftMargin, an unrelated value, so the slider track now runs under its label (2.2).' },
      { kind: 'small', text: 'Raise axisOffset from 60 to 110',
        why: 'changed only the value that causes the clipping, as the fixes catalog says.' },
      { kind: 'wrong', text: 'Add noStroke() before the row labels',
        why: 'noStroke() cures halos, not clipping. The offset was still 60, so the labels stayed cut.' }
    ] },
  B: { item: '1.3', name: 'Residual text stroke', short: 'Text stroke', seeded: true,
    hint: 'Text has an ugly outline (p5.js). Likely cause: a stroke() call is still active when ' +
      'text() runs. Fix: add noStroke() immediately before the text() call. Why: p5 keeps the ' +
      'stroke state until it is changed.',
    patches: [
      { kind: 'wrong', text: 'Set strokeWeight(1) before the cell labels',
        why: 'the weight was already 1; the stroke itself was still on, so the halo stayed.' },
      { kind: 'broad', text: 'Call noStroke() at the top of draw() and delete every stroke()', creates: 'E',
        why: 'removed the halo but also every border, so the drawing area and grid lost their lines (4.1).' },
      { kind: 'small', text: 'Add noStroke() just before the cell-label text()',
        why: 'one line, placed right before the text() call, exactly as the catalog prescribes.' }
    ] },
  C: { item: '3.1', name: 'Title runs under the panel', short: 'Title overlap', seeded: true,
    hint: 'Title overlaps a right-side panel. Likely cause: the title is centered at canvasWidth/2 ' +
      'while a panel fills the right side. Fix, in order of preference: left-align it at the ' +
      'margin; center it over the left panel; shrink it.',
    patches: [
      { kind: 'small', text: 'Left-align the title at the margin',
        why: 'the catalog\'s first choice: one alignment change and nothing else.' },
      { kind: 'wrong', text: 'Add textAlign(CENTER, TOP) before the title',
        why: 'the title was already centered; centering it again changed nothing.' },
      { kind: 'broad', text: 'Left-align the title and move the JSON panel down 60 px', creates: 'F',
        why: 'fixed the title but moving the panel was not needed, and it now runs past the drawing area (3.3).' }
    ] },
  D: { item: '2.2', name: 'Slider label overlaps track', short: 'Label on track', seeded: false,
    hint: 'Slider label overlaps slider track (p5.js). Likely cause: sliderLeftMargin is smaller ' +
      'than the label width. Fix: widen sliderLeftMargin until it clears the longest label by at ' +
      'least 10 px.',
    patches: [
      { kind: 'wrong', text: 'Change the slider step from 1 to 5',
        why: 'the step changes how the knob moves, not where the track starts.' },
      { kind: 'small', text: 'Restore sliderLeftMargin to 140',
        why: 'returned the one value that was changed by mistake.' },
      { kind: 'broad', text: 'Restore sliderLeftMargin and set axisOffset back to 60 to match', creates: 'A',
        why: 'fixed the slider but reverting axisOffset brought the clipped labels back (1.1).' }
    ] },
  E: { item: '4.1', name: 'Borders and grid lines missing', short: 'Borders gone', seeded: false,
    hint: 'Drawing area background or border missing. Likely cause: the fill or stroke before the ' +
      'drawing-area rect() was removed. Fix: fill(\'aliceblue\'); stroke(\'silver\'); before the ' +
      'rect, and a stroke before the grid lines.',
    patches: [
      { kind: 'broad', text: 'Restore stroke() at the top of draw() and remove the new noStroke()', creates: 'B',
        why: 'brought the borders back but also the stroke that haloed the text (1.3).' },
      { kind: 'wrong', text: 'Raise strokeWeight from 1 to 2',
        why: 'there was no stroke color set, so a thicker weight drew nothing.' },
      { kind: 'small', text: 'Put stroke(\'silver\') back before the drawing-area rect and grid',
        why: 'restored only the missing stroke, where the catalog says it belongs.' }
    ] },
  F: { item: '3.3', name: 'Panel runs past the drawing area', short: 'Panel overflow', seeded: false,
    hint: 'Panel content overflows panel border. Likely cause: the panel no longer fits the space ' +
      'it was given. Fix: move or resize the panel so it stays inside the drawing region. Note: CSS ' +
      'overflow: hidden only hides the problem.',
    patches: [
      { kind: 'small', text: 'Move the JSON panel back up 60 px',
        why: 'undid the one change that pushed the panel down.' },
      { kind: 'broad', text: 'Move the panel up and center the title again for symmetry', creates: 'C',
        why: 'fixed the panel but re-centering the title put it back under the panel (3.1).' },
      { kind: 'wrong', text: 'Add overflow: hidden to the page CSS',
        why: 'CSS on the page does not clip what p5 draws on the canvas; nothing changed.' }
    ] }
};
const STRIP = ['A', 'B', 'C', 'D', 'E', 'F'];
const KIND_LABEL = { small: 'smallest correct patch', broad: 'over-broad patch', wrong: 'wrong-cause patch' };
const MAX_CYCLES = 3;

// ---------- state ----------
let present;            // Set of defect ids currently visible in the screenshot
let cycles;             // [{defect, patch, cleared, created}]
let logLines;
let stopped;
let walkStart = -1;     // millis() when the checklist re-walk started (-1: not walking)
const WALK_STEP = 180;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  defectSelect = createSelect();
  defectSelect.parent(document.querySelector('main'));
  defectSelect.changed(fillPatches);
  patchSelect = createSelect();
  patchSelect.parent(document.querySelector('main'));
  hintCheckbox = createCheckbox('Show hint from the fixes catalog', false);
  hintCheckbox.parent(document.querySelector('main'));
  applyButton = createButton('Apply patch and re-capture');
  applyButton.parent(document.querySelector('main'));
  applyButton.mousePressed(applyPatch);
  stopButton = createButton('Stop and report');
  stopButton.parent(document.querySelector('main'));
  stopButton.mousePressed(() => { stopped = true; updateButtons(); });
  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(resetRun);
  [defectSelect, patchSelect, hintCheckbox, applyButton, stopButton, resetButton].forEach(c => c.style('font-size', '15px'));

  resetRun();
  positionControls();

  describe('Review and Fix Cycle Simulator. A mock screenshot of a MicroSim starts with three ' +
    'layout defects: clipped row labels, a residual text stroke and a title running under a panel. ' +
    'For the selected defect the learner chooses one of three patches and applies it; each apply ' +
    're-captures the screenshot and uses one of three review cycles. A cycle tracker, a checklist ' +
    'strip of PASS and FAIL items and an edit log show the result. After the third cycle the ' +
    'learner must stop and report; the report scores defects fixed, new defects and cycles used.', LABEL);
}

// ---------- run control ----------
function resetRun() {
  present = new Set(['A', 'B', 'C']);
  cycles = [];
  logLines = ['Capture 0: screenshot at the iframe height; checklist walked: 1.1, 1.3 and 3.1 FAIL.'];
  stopped = false;
  walkStart = -1;
  fillDefects();
  updateButtons();
}

function fillDefects() {
  defectSelect.elt.innerHTML = '';
  const fails = STRIP.filter(id => present.has(id));
  if (fails.length === 0) defectSelect.option('(no FAIL items)', '');
  fails.forEach(id => defectSelect.option(DEFECTS[id].item + ' ' + DEFECTS[id].name, id));
  fillPatches();
  positionControls();     // the defect menu width changes with its options
}

function fillPatches() {
  patchSelect.elt.innerHTML = '';
  const id = defectSelect.value();
  if (!id || !DEFECTS[id]) { patchSelect.option('(nothing to patch)', ''); return; }
  patchSelect.option('Choose a patch...', '');
  DEFECTS[id].patches.forEach((p, i) => patchSelect.option(p.text, String(i)));
}

function walking() { return walkStart >= 0 && millis() - walkStart < WALK_STEP * (STRIP.length + 1); }

function updateButtons() {
  const locked = stopped || cycles.length >= MAX_CYCLES;
  if (locked) applyButton.attribute('disabled', ''); else applyButton.removeAttribute('disabled');
  if (stopped) stopButton.attribute('disabled', ''); else stopButton.removeAttribute('disabled');
}

function applyPatch() {
  if (stopped || cycles.length >= MAX_CYCLES || walking()) return;
  const id = defectSelect.value();
  const pi = patchSelect.value();
  if (!id || pi === '' || pi === null) {
    logLines.push('Pick a defect and a patch first (no cycle used).');
    return;
  }
  const p = DEFECTS[id].patches[int(pi)];
  const c = { defect: id, patch: p, cleared: false, created: null };
  if (p.kind !== 'wrong') { present.delete(id); c.cleared = true; }
  if (p.kind === 'broad' && p.creates && !present.has(p.creates)) {
    present.add(p.creates);
    c.created = p.creates;
  }
  cycles.push(c);
  let res = c.cleared ? DEFECTS[id].item + ' PASS' : DEFECTS[id].item + ' still FAIL (no visible change)';
  if (c.created) res += '; new FAIL ' + DEFECTS[c.created].item;
  logLines.push('Cycle ' + cycles.length + ': ' + p.text + '. Re-capture: ' + res + '.');
  walkStart = millis();
  fillDefects();
  updateButtons();
}

// ---------- layout ----------
function isWide() { return canvasWidth >= 600; }

function positionControls() {
  const y1 = drawHeight + 8, y2 = drawHeight + 44, y3 = drawHeight + 80;
  defectSelect.position(70, y1);
  const dw = defectSelect.elt.offsetWidth || 230;
  hintCheckbox.position(70 + dw + 14, y1 + 2);
  const span = hintCheckbox.elt.querySelector('span');
  const lab = canvasWidth >= 560 ? 'Show hint from the fixes catalog' : 'Show hint';
  if (span && span.innerHTML !== lab) span.innerHTML = lab;
  patchSelect.position(134, y2);
  patchSelect.style('max-width', (canvasWidth - 144) + 'px');
  applyButton.position(10, y3);
  const aw = applyButton.elt.offsetWidth || 200;
  stopButton.position(10 + aw + 10, y3);
  const sw = stopButton.elt.offsetWidth || 120;
  resetButton.position(10 + aw + 10 + sw + 10, y3);
}

// ---------- drawing ----------
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
  textAlign(LEFT, TOP);
  textSize(20);
  textStyle(BOLD);
  text('Review and Fix Cycle Simulator', margin, 8);
  textStyle(NORMAL);

  const wide = isWide();
  if (wide) {
    const half = floor(canvasWidth / 2);
    const mw = half - margin - 4;
    const mh = min(mw * 2 / 3, 240);
    drawMock(margin, 38, mw, mh);
    drawHintBox(margin, 38 + mh + 18, mw, drawHeight - 38 - mh - 18 - margin);
    const rx = half + 4, rw = canvasWidth - half - 4 - margin;
    drawTracker(rx, 38, rw, 74);
    drawStrip(rx, 120, rw, 96);
    drawLog(rx, 224, rw, drawHeight - 224 - margin);
  } else {
    const w = canvasWidth - 2 * margin;
    const mh = min(w * 2 / 3, 170);
    drawMock(margin + (w - mh * 1.5) / 2, 36, mh * 1.5, mh);
    let y = 36 + mh + 16;
    drawTracker(margin, y, w, 56); y += 62;
    drawStrip(margin, y, w, 74); y += 80;
    if (hintCheckbox.checked()) drawHintBox(margin, y, w, drawHeight - y - margin);
    else drawLog(margin, y, w, drawHeight - y - margin);
  }
  if (stopped) drawReport();

  // control-region labels
  noStroke();
  fill('black');
  textSize(15);
  textAlign(LEFT, CENTER);
  text('Defect:', 10, drawHeight + 20);
  text('Choose a patch:', 10, drawHeight + 56);
}

// the mock screenshot (600 x 400 units), drawn with whichever defects are present
function drawMock(x, y, w, h) {
  const s = min(w / 600, h / 400);
  push();
  translate(x, y);
  scale(s);
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(0, 0, 600, 400);
  drawingContext.clip();

  const E = present.has('E');
  // regions
  if (E) noStroke(); else stroke('silver');
  fill('aliceblue');
  rect(0, 0, 600, 320);
  fill('white');
  rect(0, 320, 600, 80);

  // title: centered (defect C) runs under the panel drawn next; fixed = left-aligned
  noStroke();
  fill('black');
  textSize(24);
  textStyle(BOLD);
  if (present.has('C')) { textAlign(CENTER, TOP); text('Statement Completion Explorer', 300, 10); }
  else { textAlign(LEFT, TOP); text('Statement Completion Explorer', 12, 10); }
  textStyle(NORMAL);

  // JSON panel (defect F: moved down 60 px, it runs into the control region)
  const py = present.has('F') ? 68 : 8;
  stroke('gray');
  fill('white');
  rect(420, py, 170, 300, 6);
  noStroke();
  fill('black');
  textFont('monospace');
  textSize(12);
  textAlign(LEFT, TOP);
  ['{', '  "verb": "completed",', '  "result": {', '    "completion":', '      true,', '    "success":', '      false', '  }', '}']
    .forEach((ln, i) => text(ln, 428, py + 40 + i * 18));
  textFont('sans-serif');

  // 2 x 2 grid (defect A: offset 60 clips the row labels; fixed offset 120)
  const gx = present.has('A') ? 60 : 120, gt = 70, gr = 400, gb = 250;
  const cw = (gr - gx) / 2, ch = (gb - gt) / 2;
  const fills = ['honeydew', 'mistyrose', 'lemonchiffon', 'lavender'];
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      if (E) noStroke(); else stroke('black');
      fill(fills[r * 2 + c]);
      rect(gx + c * cw, gt + r * ch, cw, ch);
    }
  }
  noStroke();
  fill('black');
  textSize(13);
  textAlign(CENTER, BOTTOM);
  text('success: true', gx + cw / 2, gt - 4);
  text('success: false', gx + cw * 1.5, gt - 4);
  textAlign(RIGHT, CENTER);
  text('completion: true', gx - 6, gt + ch / 2);
  text('completion: false', gx - 6, gt + ch * 1.5);
  // cell labels (defect B: the grid's stroke is still on when text() runs)
  textSize(15);
  textAlign(CENTER, CENTER);
  if (present.has('B')) { stroke('black'); strokeWeight(1.6); } else noStroke();
  fill('darkslateblue');
  ['passed', 'completed, failed', 'in progress', 'not attempted'].forEach((t, i) => {
    text(t, gx + (i % 2) * cw + cw / 2, gt + floor(i / 2) * ch + ch / 2);
  });
  noStroke();
  strokeWeight(1);

  // control row (defect D: track starts under the label)
  stroke('gray');
  fill('gainsboro');
  rect(10, 346, 64, 28, 4);
  noStroke();
  fill('black');
  textSize(14);
  textAlign(CENTER, CENTER);
  text('Start', 42, 360);
  const trackX = present.has('D') ? 150 : 210;
  stroke('silver');
  strokeWeight(6);
  line(trackX, 360, 580, 360);
  strokeWeight(1);
  noStroke();
  fill('royalblue');
  circle(trackX + 90, 360, 16);
  fill('black');
  textSize(15);
  textAlign(LEFT, CENTER);
  text('Speed: 5', 100, 360);

  drawingContext.restore();
  noFill();
  stroke('gray');
  strokeWeight(1 / s);
  rect(0, 0, 600, 400);
  pop();
  strokeWeight(1);

  // caption
  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(LEFT, TOP);
  text('Screenshot after capture ' + cycles.length, x, y + 400 * s + 2);
}

function drawTracker(x, y, w, h) {
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(13);
  textStyle(BOLD);
  const locked = cycles.length >= MAX_CYCLES;
  let head = 'Fix cycles: ' + cycles.length + ' of ' + MAX_CYCLES + ' used';
  if (stopped) head += ' (stopped)';
  else if (locked) head += ' - limit reached: Stop and report';
  else if (present.size === 0) head += ' - all PASS: Stop and report';
  fill(locked && !stopped ? 'firebrick' : 'black');
  text(head, x + 8, y + 5, w - 16, 16);
  textStyle(NORMAL);
  const bw = (w - 16 - 2 * 6) / 3, by = y + 24, bh = h - 30;
  for (let i = 0; i < MAX_CYCLES; i++) {
    const bx = x + 8 + i * (bw + 6);
    const c = cycles[i];
    let bg = 'whitesmoke', edge = 'silver';
    if (c) {
      if (c.patch.kind === 'small') { bg = 'honeydew'; edge = 'green'; }
      else if (c.patch.kind === 'broad') { bg = 'lightyellow'; edge = 'darkorange'; }
      else { bg = 'mistyrose'; edge = 'firebrick'; }
    }
    stroke(edge);
    fill(bg);
    rect(bx, by, bw, bh, 5);
    noStroke();
    fill('black');
    textSize(12);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    text(String(i + 1), bx + 5, by + 3);
    textStyle(NORMAL);
    let t = c ? DEFECTS[c.defect].item + ' ' + (c.cleared ? 'fixed' : 'no change') +
      (c.created ? ', new ' + DEFECTS[c.created].item : '') : 'not used';
    fill(c ? 'black' : 'dimgray');
    text(t, bx + 18, by + 3, bw - 22, bh - 4);
  }
}

// checklist strip: status of each item; unchecked while the re-walk runs
function drawStrip(x, y, w, h) {
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(13);
  textStyle(BOLD);
  text('Checklist strip', x + 8, y + 5);
  textStyle(NORMAL);
  const cols = 2;
  const cw = (w - 16) / cols;
  const rowH = (h - 24) / 3;
  const walkedUpTo = walkStart >= 0 ? floor((millis() - walkStart) / WALK_STEP) : 99;
  STRIP.forEach((id, i) => {
    const cx = x + 8 + (i % cols) * cw;
    const cy = y + 22 + floor(i / cols) * rowH;
    let st, col;
    if (i >= walkedUpTo) { st = 'unchecked'; col = 'gray'; }
    else if (present.has(id)) { st = 'FAIL'; col = 'firebrick'; }
    else { st = 'PASS'; col = 'green'; }
    fill(col);
    rect(cx, cy + 2, 62, rowH - 5, 4);
    fill('white');
    textSize(11);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(st, cx + 31, cy + rowH / 2);
    textStyle(NORMAL);
    fill('black');
    textAlign(LEFT, CENTER);
    textSize(12);
    text(DEFECTS[id].item + ' ' + (cw > 230 ? DEFECTS[id].name : DEFECTS[id].short), cx + 67, cy + rowH / 2);
  });
}

function drawLog(x, y, w, h) {
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(13);
  textStyle(BOLD);
  text('Edit log', x + 8, y + 5);
  textStyle(NORMAL);
  textSize(12);
  // newest entries that fit, measured by wrapped line count
  const lineH = 15, tw = w - 16;
  const heights = logLines.map(l => (ceil(textWidth(l) / (tw - 6)) || 1) * lineH + 3);
  let avail = h - 26, start = logLines.length;
  while (start > 0 && avail - heights[start - 1] >= 0) { avail -= heights[start - 1]; start--; }
  let yy = y + 24;
  for (let i = start; i < logLines.length; i++) {
    fill(i === logLines.length - 1 ? 'black' : 'dimgray');
    text(logLines[i], x + 8, yy, tw, heights[i]);
    yy += heights[i];
  }
}

function drawHintBox(x, y, w, h) {
  const id = defectSelect.value();
  const d = DEFECTS[id];
  stroke(hintCheckbox.checked() ? 'goldenrod' : 'silver');
  fill(hintCheckbox.checked() ? 'lightyellow' : 'white');
  rect(x, y, w, h, 8);
  noStroke();
  textAlign(LEFT, TOP);
  fill('black');
  textSize(13);
  textStyle(BOLD);
  if (hintCheckbox.checked() && d) {
    text('Fixes catalog: ' + d.item + ' ' + d.name, x + 8, y + 6, w - 16, 18);
    textStyle(NORMAL);
    text(d.hint, x + 8, y + 26, w - 16, h - 30);
  } else {
    text('The smallest patch rule', x + 8, y + 6, w - 16, 18);
    textStyle(NORMAL);
    fill('dimgray');
    text('Make the smallest change that resolves the defect. Each Apply re-captures the screenshot and ' +
      'uses one cycle; stop after three and report what remains. Tick "Show hint" to read the fixes ' +
      'catalog entry for the selected defect.', x + 8, y + 26, w - 16, h - 30);
  }
}

// ---------- final report ----------
function drawReport() {
  const x = margin + 6, y = 34, w = canvasWidth - 2 * margin - 12, h = drawHeight - 34 - margin - 4;
  stroke('dimgray');
  fill('white');
  rect(x, y, w, h, 10);
  noStroke();
  const seededFixed = ['A', 'B', 'C'].filter(id => !present.has(id));
  const created = cycles.filter(c => c.created).map(c => c.created);
  const secondaryFixed = cycles.filter(c => c.cleared && !DEFECTS[c.defect].seeded).length;
  const remaining = STRIP.filter(id => present.has(id));
  const state = remaining.length === 0 ? 'clean' : (seededFixed.length + secondaryFixed > 0 ? 'partial' : 'unfixed');
  const smallCount = cycles.filter(c => c.patch.kind === 'small').length;

  textAlign(LEFT, TOP);
  fill('black');
  textSize(17);
  textStyle(BOLD);
  text('Review report  -  final state: ' + state, x + 12, y + 10, w - 24, 22);
  textStyle(NORMAL);
  textSize(13);
  let yy = y + 36;
  const line2 = (t, col, lh) => {
    fill(col || 'black');
    const lines = ceil(textWidth(t) / (w - 30)) || 1;
    text(t, x + 12, yy, w - 24, lines * (lh || 16) + 2);
    yy += lines * (lh || 16) + 4;
  };
  line2('Defects fixed: ' + seededFixed.length + ' of 3 seeded' +
    (secondaryFixed ? ', plus ' + secondaryFixed + ' introduced along the way' : '') +
    '.   New defects introduced: ' + created.length +
    (created.length ? ' (' + created.map(id => DEFECTS[id].item).join(', ') + ')' : '') +
    '.   Cycles used: ' + cycles.length + ' of 3.');
  line2('Remaining FAILs to report: ' + (remaining.length ? remaining.map(id => DEFECTS[id].item + ' ' + DEFECTS[id].name).join('; ') : 'none') + '.',
    remaining.length ? 'firebrick' : 'green');
  yy += 2;
  textStyle(BOLD);
  line2('Your choices');
  textStyle(NORMAL);
  if (cycles.length === 0) line2('No patches applied.', 'dimgray');
  cycles.forEach((c, i) => {
    const col = c.patch.kind === 'small' ? 'darkgreen' : (c.patch.kind === 'broad' ? 'darkorange' : 'firebrick');
    line2('Cycle ' + (i + 1) + ', ' + DEFECTS[c.defect].item + ': ' + KIND_LABEL[c.patch.kind] + '. It ' + c.patch.why, col);
  });
  yy += 2;
  textStyle(BOLD);
  line2('Stopping decision');
  textStyle(NORMAL);
  let stopMsg;
  if (remaining.length === 0) stopMsg = 'You stopped with every item PASS: a clean review in ' + cycles.length + ' cycle(s).';
  else if (cycles.length >= MAX_CYCLES) stopMsg = 'You used all three cycles with FAILs left, so stopping and reporting was required. Repeated fixing now needs human judgment.';
  else stopMsg = 'You stopped with ' + (MAX_CYCLES - cycles.length) + ' cycle(s) left and FAILs remaining. The rule allows up to three; stopping early is right only when the remaining defect needs a person.';
  line2(stopMsg);
  const verdict = smallCount === cycles.length && cycles.length > 0 ? 'Every patch followed the smallest patch rule.'
    : 'Press Reset and try to finish clean in three cycles using only smallest patches.';
  line2(verdict, 'steelblue');
}

// ---------- mouse: clicking a FAIL item in the strip selects it ----------
function mousePressed() {
  // the strip layout mirrors drawStrip(); recompute its geometry
  if (stopped || mouseY < 0 || mouseY > drawHeight) return;
  const wide = isWide();
  let sx, sy, sw, sh;
  if (wide) { const half = floor(canvasWidth / 2); sx = half + 4; sy = 120; sw = canvasWidth - half - 4 - margin; sh = 96; }
  else { const w = canvasWidth - 2 * margin; const mh = min(w * 2 / 3, 170); sx = margin; sy = 36 + mh + 16 + 62; sw = w; sh = 74; }
  const cw = (sw - 16) / 2, rowH = (sh - 24) / 3;
  STRIP.forEach((id, i) => {
    const cx = sx + 8 + (i % 2) * cw, cy = sy + 22 + floor(i / 2) * rowH;
    if (mouseX >= cx && mouseX <= cx + cw && mouseY >= cy && mouseY <= cy + rowH && present.has(id)) {
      defectSelect.selected(id);
      fillPatches();
    }
  });
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
