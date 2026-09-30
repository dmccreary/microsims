// p5.js 2.x Migration Mapper
// CANVAS_HEIGHT: 680
// Learners convert a short p5.js 1.x snippet into its 2.x form using the
// migration table from Chapter 5. Flag legacy calls highlights the v1-only
// lines; clicking a highlighted line offers three candidate replacements;
// the sim answers by quoting the migration table; Show 2.x form reveals the
// corrected snippet. Snippets and replacements live in data.json.

// ---------- layout globals ----------
let canvasWidth = 400;
let drawHeight = 600;
let controlHeight = 80;              // two rows: controls, then a hint (or wrapped buttons)
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let sliderLeftMargin = 80;           // left edge of the Snippet dropdown (no sliders here)
let defaultTextSize = 16;
let narrowBreakpoint = 600;          // below this the panels stack vertically

// ---------- data and state ----------
let data = null;
let loadError = null;
let snippetIndex = 0;
let flagged = false;                 // Flag legacy calls pressed
let chooserOpen = false;             // candidate list visible
let pick = null;                     // index of the chosen candidate
let showAnswer = false;              // Show 2.x form pressed
let message = null;                  // short note when no feedback applies
let solved = {};                     // snippet id -> true when converted correctly

// ---------- controls ----------
let snippetSelect, flagButton, answerButton, resetButton;
let controlRows = 1;

// ---------- hit boxes ----------
let lineRects = [];                  // {panel, index, x, y, w, h}
let candidateRects = [];
let chipRects = [];
let hoverChip = null;
let hoverLine = null;
let hoverCandidate = null;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  frameRate(30);

  snippetSelect = createSelect();
  snippetSelect.parent(document.querySelector('main'));
  snippetSelect.changed(() => { snippetIndex = int(snippetSelect.value()); resetSnippet(); });

  flagButton = createButton('Flag legacy calls');
  flagButton.parent(document.querySelector('main'));
  flagButton.mousePressed(flagLegacy);

  answerButton = createButton('Show 2.x form');
  answerButton.parent(document.querySelector('main'));
  answerButton.mousePressed(() => { if (data) { showAnswer = true; chooserOpen = false; } });

  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(resetSnippet);

  positionControls();

  describe('A p5.js migration exercise. Four chips across the top name the calls that changed in p5.js 2.x: ' +
    'preload, bezierVertex, curveVertex and quadraticVertex. A code panel shows a p5.js 1.x snippet and a ' +
    'second panel shows the learner\'s 2.x version. Flagging highlights the v1-only lines; clicking one offers ' +
    'three replacements, and the sim explains each choice by quoting the migration table.', LABEL);

  fetch('data.json')
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(json => {
      data = json;
      for (let i = 0; i < data.snippets.length; i++) snippetSelect.option(data.snippets[i].label, i);
      snippetSelect.selected('0');
      positionControls();
      redraw();                      // draw the loaded data at once
    })
    .catch(err => {
      loadError = 'Could not load data.json (' + err.message + '). Open this page through a web server, ' +
        'for example mkdocs serve, rather than as a local file.';
    });
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(22);
  text('p5.js 2.x Migration Mapper', margin, 10);
  textStyle(NORMAL);

  if (!data) {
    fill(loadError ? 'firebrick' : 'dimgray');
    textSize(defaultTextSize);
    text(loadError || 'Loading snippets...', margin, 50, canvasWidth - 2 * margin, 120);
    return;
  }

  const sn = data.snippets[snippetIndex];
  const narrow = canvasWidth < narrowBreakpoint;
  lineRects = [];

  // Progress in the title row (wide) or under the chips (narrow)
  const nSolved = Object.keys(solved).length;
  noStroke();
  fill('dimgray');
  textSize(15);
  if (!narrow) {
    textAlign(RIGHT, TOP);
    text('Converted: ' + nSolved + ' of ' + data.snippets.length, canvasWidth - margin, 16);
    textAlign(LEFT, TOP);
  }

  const chipsBottom = drawChips(sn, margin, 44, canvasWidth - 2 * margin, narrow);

  const codeSize = narrow ? 13 : 14;
  const lh = narrow ? 16 : 19;

  // What the right panel shows
  let head2, lines2, marks2 = [], markColor = null;
  if (showAnswer) {
    head2 = 'Corrected 2.x form';
    lines2 = sn.v2; marks2 = sn.changed; markColor = 'honeydew';
  } else if (pick !== null) {
    const cand = sn.candidates[pick];
    head2 = 'Your 2.x version';
    lines2 = cand.result; marks2 = cand.mark; markColor = cand.correct ? 'honeydew' : 'mistyrose';
  } else {
    head2 = 'Your 2.x version';
    lines2 = [];
  }

  // Panel sizes follow the (soft-wrapped) code they hold
  let p1x, p1y, p1w, p2x, p2y, p2w, p1h, p2h, areaY;
  p1w = narrow ? canvasWidth - 2 * margin : floor((canvasWidth - 3 * margin) / 2);
  p2w = p1w;
  textFont('monospace');
  textSize(codeSize);
  const rows1 = wrapCode(sn.v1, p1w - codeGutter(codeSize) - 20).length;
  const rows2 = max(lines2.length ? wrapCode(lines2, p2w - codeGutter(codeSize) - 20).length : 0,
    (pick === null && !showAnswer) ? (narrow ? 4 : 6) : 0);
  textFont('sans-serif');
  if (!narrow) {
    p1x = margin; p1y = chipsBottom + 10;
    p2x = p1x + p1w + margin; p2y = p1y;
    p1h = p2h = 40 + max([rows1, rows2, 8]) * lh;
    areaY = p1y + p1h + 10;
  } else {
    p1x = margin; p1y = chipsBottom + 8;
    p1h = 38 + rows1 * lh;
    p2x = margin; p2y = p1y + p1h + 6;
    p2h = 38 + rows2 * lh;
    areaY = p2y + p2h + 6;
  }

  // Left panel: the 1.x snippet
  let head1 = '1.x snippet';
  if (flagged) head1 += ': ' + sn.call + '() is v1-only';
  drawCodePanel('v1', head1, sn.v1, flagged ? sn.flagged : [], flagged ? 'mistyrose' : null,
    p1x, p1y, p1w, p1h, codeSize, lh);

  // Right panel: the learner's version or the corrected 2.x form
  drawCodePanel('v2', head2, lines2, marks2, markColor, p2x, p2y, p2w, p2h, codeSize, lh);
  if (!showAnswer && pick === null) {
    noStroke();
    fill('dimgray');
    textSize(narrow ? 14 : 15);
    textStyle(ITALIC);
    const steps = narrow
      ? ['1. Press Flag legacy calls.  2. Click a red line', '   in the 1.x snippet.', '3. Pick a replacement.',
        '4. Press Show 2.x form to compare.']
      : ['1. Press Flag legacy calls.', '2. Click a highlighted line', '    in the 1.x snippet.',
        '3. Pick a replacement.', '4. Press Show 2.x form', '    to compare.'];
    for (let k = 0; k < steps.length; k++) text(steps[k], p2x + 12, p2y + 34 + k * (narrow ? 17 : 20));
    textStyle(NORMAL);
  }

  // Chooser and feedback area
  candidateRects = [];
  if (chooserOpen) {
    if (narrow) {
      drawChooser(sn, p2x, p2y, p2w, drawHeight - p2y - 8);
    } else {
      drawChooser(sn, margin, areaY, canvasWidth - 2 * margin, drawHeight - areaY - 10);
    }
  }
  if (!(chooserOpen && !narrow)) {
    drawFeedback(sn, margin, areaY, canvasWidth - 2 * margin, drawHeight - areaY - 8, narrow);
  }

  drawControlHint();
  drawChipTooltip();
}

// The four call chips; returns the bottom y
function drawChips(sn, x, y, w, narrow) {
  chipRects = [];
  textFont('monospace');
  textSize(14);
  const h = 26;
  let cx = x, cy = y;
  const cols = narrow ? 2 : 4;
  const cw = narrow ? (w - 8) / 2 : null;
  for (let i = 0; i < data.chips.length; i++) {
    const chip = data.chips[i];
    const chipW = narrow ? cw : textWidth(chip.label) + 22;
    if (narrow) {
      cx = x + (i % cols) * (cw + 8);
      cy = y + floor(i / cols) * (h + 6);
    }
    const isCurrent = flagged && chip.call === sn.call;
    fill(isCurrent ? 'mistyrose' : 'white');
    stroke(isCurrent ? 'firebrick' : (hoverChip === i ? 'steelblue' : 'lightsteelblue'));
    strokeWeight(isCurrent || hoverChip === i ? 2 : 1);
    rect(cx, cy, chipW, h, 13);
    strokeWeight(1);
    noStroke();
    fill(isCurrent ? 'firebrick' : 'black');
    textAlign(CENTER, CENTER);
    text(chip.label, cx + chipW / 2, cy + h / 2);
    chipRects.push({ i: i, x: cx, y: cy, w: chipW, h: h });
    if (!narrow) cx += chipW + 10;
  }
  textFont('sans-serif');
  textAlign(LEFT, TOP);
  return narrow ? y + 2 * h + 6 : y + h;
}

// A code panel with line numbers; marked lines get a colored background
function drawCodePanel(panel, heading, lines, marks, markColor, x, y, w, h, size, lh) {
  fill('white');
  stroke('silver');
  rect(x, y, w, h, 8);
  noStroke();
  fill(panel === 'v1' ? 'black' : (showAnswer ? 'seagreen' : 'black'));
  textStyle(BOLD);
  textSize(15);
  textAlign(LEFT, TOP);
  text(truncateToWidth(heading, w - 20), x + 10, y + 8);
  textStyle(NORMAL);

  textFont('monospace');
  textSize(size);
  const gutter = codeGutter(size);
  const rows = wrapCode(lines, w - gutter - 20);
  for (let r = 0; r < rows.length; r++) {
    const k = rows[r].index;
    const ly = y + 32 + r * lh;
    const isMarked = marks.includes(k);
    if (isMarked && markColor) {
      fill(markColor);
      rect(x + 4, ly - 1, w - 8, lh, 3);
      fill(markColor === 'mistyrose' ? 'firebrick' : 'seagreen');
      rect(x + 4, ly - 1, 4, lh, 2);
    }
    if (panel === 'v1' && hoverLine === k && flagged && marks.includes(k)) {
      noFill();
      stroke('firebrick');
      rect(x + 4, ly - 1, w - 8, lh, 3);
      noStroke();
    }
    if (rows[r].first) {
      fill('gray');
      textAlign(RIGHT, TOP);
      text(k + 1, x + gutter, ly + 1);
    }
    textAlign(LEFT, TOP);
    fill('black');
    text(rows[r].text, x + gutter + 8, ly + 1);
    lineRects.push({ panel: panel, index: k, x: x, y: ly - 1, w: w, h: lh });
  }
  textFont('sans-serif');
}

// Three candidate replacements
function drawChooser(sn, x, y, w, h) {
  fill(255, 255, 255, 250);
  stroke('steelblue');
  strokeWeight(2);
  rect(x, y, w, h, 10);
  strokeWeight(1);
  noStroke();
  fill('black');
  textStyle(BOLD);
  textSize(15);
  textAlign(LEFT, TOP);
  text('Replace the ' + sn.call + '() code with:', x + 10, y + 8);
  textStyle(NORMAL);
  let cy = y + 32;
  const narrow = canvasWidth < narrowBreakpoint;
  textSize(narrow ? 14 : 15);
  for (let i = 0; i < sn.candidates.length; i++) {
    const lines = wrapLines(String.fromCharCode(65 + i) + '. ' + sn.candidates[i].label, w - 36);
    const ch = lines.length * 19 + 12;
    fill(hoverCandidate === i ? 'lightyellow' : 'aliceblue');
    stroke(hoverCandidate === i ? 'steelblue' : 'lightsteelblue');
    rect(x + 10, cy, w - 20, ch, 6);
    noStroke();
    fill('black');
    for (let k = 0; k < lines.length; k++) text(lines[k], x + 18, cy + 6 + k * 19);
    candidateRects.push({ i: i, x: x + 10, y: cy, w: w - 20, h: ch });
    cy += ch + 6;
  }
}

// Feedback, the migration-table quote and the affected MicroSims
function drawFeedback(sn, x, y, w, h, narrow) {
  if (h < 30) return;
  const parts = [];
  if (message) parts.push({ text: message, color: 'darkorange', bold: true });
  if (pick !== null && !showAnswer) {
    const cand = sn.candidates[pick];
    parts.push({ text: cand.explain, color: cand.correct ? 'seagreen' : 'firebrick', bold: false });
    if (!cand.correct && !narrow) parts.push({ text: 'Click a highlighted line to choose again, or press Show 2.x form.', color: 'dimgray' });
  }
  if (showAnswer) {
    parts.push({ text: 'Green lines changed. Compare them with your version: the call that is no longer valid in 2.x is ' +
      sn.call + '().', color: 'seagreen' });
  }
  if (flagged && !narrow) {
    parts.push({ text: 'Migration table: ' + sn.guidance, color: 'black', italic: true });
    parts.push({ text: 'Found by the repository scan in: ' + sn.affected + '.', color: 'dimgray' });
  }
  if (!flagged && !message) {
    parts.push({ text: 'Which call in this snippet is no longer valid in p5.js 2.x? Predict, then press Flag legacy calls. ' +
      'Hover a chip at the top for its one-line rule.', color: 'dimgray' });
  }
  if (parts.length === 0) return;

  const size = narrow ? 14 : 15;
  const lhh = size + 4;
  textSize(size);
  let nLines = 0;
  for (const p of parts) nLines += wrapLines(p.text, w - 20).length;
  let boxH = nLines * lhh + 16 + (parts.length - 1) * 4;
  if (narrow && boxH > h) {
    // Grow upward from the bottom of the drawing region, over the end of the panel above
    boxH = min(boxH, 200);
    y = drawHeight - 8 - boxH;
    h = boxH;
  }
  boxH = min(h, boxH);
  fill('white');
  stroke('silver');
  rect(x, y, w, boxH, 8);
  noStroke();
  let ty = y + 8;
  for (const p of parts) {
    textStyle(p.bold ? BOLD : (p.italic ? ITALIC : NORMAL));
    fill(p.color);
    for (const ln of wrapLines(p.text, w - 20)) {
      if (ty + lhh > y + boxH) break;
      text(ln, x + 10, ty);
      ty += lhh;
    }
    ty += 4;
  }
  textStyle(NORMAL);
}

function drawControlHint() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Snippet:', 10, drawHeight + 20);
  if (controlRows === 1) {
    fill('dimgray');
    textSize(15);
    text('Flag the legacy call, click a red line, pick its replacement, then compare with the 2.x form.',
      10, drawHeight + 58);
  }
}

function drawChipTooltip() {
  if (hoverChip === null) return;
  const chip = data.chips[hoverChip];
  const r = chipRects[hoverChip];
  textSize(14);
  const boxW = min(340, canvasWidth - 20);
  const lines = wrapLines(chip.label + ': ' + chip.rule, boxW - 16);
  const boxH = lines.length * 18 + 12;
  let bx = min(r.x, canvasWidth - boxW - 6);
  const by = r.y + r.h + 6;
  fill(255, 255, 240, 250);
  stroke('goldenrod');
  rect(bx, by, boxW, boxH, 6);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  for (let k = 0; k < lines.length; k++) text(lines[k], bx + 8, by + 6 + k * 18);
}

// ---------- actions ----------
function flagLegacy() {
  if (!data) return;
  flagged = true;
  message = null;
}

function resetSnippet() {
  flagged = false;
  chooserOpen = false;
  pick = null;
  showAnswer = false;
  message = null;
}

// ---------- helpers ----------
function wrapLines(str, maxW) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (textWidth(test) <= maxW || !line) {
      line = test;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function codeGutter(size) {
  return size < 14 ? 22 : 28;
}

// Soft-wrap code lines that are too wide, breaking after a comma;
// continuation rows keep the line index but show no line number
function wrapCode(lines, maxW) {
  const rows = [];
  for (let k = 0; k < lines.length; k++) {
    let rest = lines[k];
    let first = true;
    while (textWidth(rest) > maxW) {
      let cut = -1;
      for (let i = rest.length - 1; i > 0; i--) {
        if (rest[i] === ',' && textWidth(rest.slice(0, i + 1)) <= maxW) { cut = i + 1; break; }
      }
      if (cut < 0) break;
      rows.push({ index: k, text: rest.slice(0, cut), first: first });
      first = false;
      const indent = rest.match(/^\s*/)[0];
      rest = indent + '    ' + rest.slice(cut).trim();
    }
    rows.push({ index: k, text: rest, first: first });
  }
  return rows;
}

function truncateToWidth(str, maxW) {
  if (textWidth(str) <= maxW) return str;
  let s = str;
  while (s.length > 1 && textWidth(s + '...') > maxW) s = s.slice(0, -1);
  return s + '...';
}

function inside(r) {
  return mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h;
}

// ---------- events ----------
function mouseMoved() {
  hoverChip = null; hoverLine = null; hoverCandidate = null;
  if (!data || mouseY < 0 || mouseY > drawHeight) return;
  for (const r of chipRects) if (inside(r)) hoverChip = r.i;
  for (const r of candidateRects) if (inside(r)) hoverCandidate = r.i;
  if (hoverCandidate === null) {
    for (const r of lineRects) if (r.panel === 'v1' && inside(r)) hoverLine = r.index;
  }
}

function mousePressed() {
  if (!data || mouseY < 0 || mouseY > drawHeight) return;
  mouseMoved();
  const sn = data.snippets[snippetIndex];

  // A click on a candidate chooses it
  if (chooserOpen && hoverCandidate !== null) {
    pick = hoverCandidate;
    chooserOpen = false;
    showAnswer = false;
    message = null;
    if (sn.candidates[pick].correct) solved[sn.id] = true;
    return;
  }

  // A click on a line of either panel
  for (const r of lineRects) {
    if (!inside(r)) continue;
    if (r.panel === 'v1') {
      if (!flagged) {
        message = 'Press Flag legacy calls first, or predict which line will be flagged.';
      } else if (sn.flagged.includes(r.index)) {
        chooserOpen = true;
        message = null;
      } else {
        message = 'Line ' + (r.index + 1) + ' runs unchanged in 2.x. Click a highlighted line.';
        chooserOpen = false;
      }
    } else if (flagged && !showAnswer) {
      chooserOpen = true;           // lines in your version reopen the choices
      message = null;
    }
    return;
  }
  // A click elsewhere closes the chooser
  if (chooserOpen) chooserOpen = false;
}

function positionControls() {
  const selW = min(230, max(150, canvasWidth - sliderLeftMargin - 20));
  snippetSelect.position(sliderLeftMargin, drawHeight + 8);
  snippetSelect.size(selW);
  // Buttons follow the dropdown on row 1 and wrap to row 2 when they run out of room
  let x = sliderLeftMargin + selW + 10;
  let y = drawHeight + 8;
  controlRows = 1;
  for (const b of [flagButton, answerButton, resetButton]) {
    b.style('white-space', 'nowrap');
    b.position(x, y);
    const bw = b.elt.offsetWidth;
    if (x + bw > canvasWidth - 8) {
      x = 10;
      y = drawHeight + 44;
      controlRows = 2;
      b.position(x, y);
    }
    x += bw + 8;
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.floor(container.getBoundingClientRect().width);
  }
}
