// Layout Defect Catalog Explorer - p5.js MicroSim
// CANVAS_HEIGHT: 540
// Learning objective (Analyze / distinguish): the learner distinguishes clipped content, hidden
// controls and low color contrast in a rendered MicroSim, and matches each defect to its visual
// checklist item and its usual repair (the layout reviewer's visual-checklist.md and
// common-fixes.md, summarized in Chapter 13).
// The mock MicroSim on the left is drawn with eight seeded defects. Clicking a region flags it:
// a correct flag outlines it in green and opens a card with the checklist item, likely cause and
// repair; a wrong flag outlines the spot in red with a hint. Apply repair redraws the mock with
// the selected defect fixed.

// ---------- canvas dimensions ----------
let canvasWidth = 700;
let drawHeight = 460;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

// ---------- controls ----------
let repairButton, resetButton, revealButton, familySelect;

// ---------- the eight defects ----------
// family: clipped | hidden | contrast
const DEFECTS = {
  R: { name: 'Row label cut off at the left edge', items: '1.1, 3.5', family: 'clipped',
    cause: 'The reserved offset (axisOffset = 60) is smaller than the label width: "completion: false" is about 96 px wide at 13 pt.',
    repair: 'Raise the offset to at least textWidth(longestLabel) + 8; 110 is a safe value here.' },
  T: { name: 'Title collides with the right panel', items: '3.1', family: 'clipped',
    cause: 'The title is centered on the whole canvas (canvasWidth / 2) while a panel fills the right side.',
    repair: 'Left-align the title at the margin, or center it over the left panel only.' },
  S: { name: 'Legend heading is a white sliver', items: '3.2', family: 'clipped',
    cause: 'The legend\'s background rectangle was drawn after its heading, so it paints over the text.',
    repair: 'Draw the heading after all background shapes (background, then grid, then title and text).' },
  SR: { name: 'Slider runs past the right edge', items: '2.1', family: 'hidden',
    cause: 'size() was set in setup() but not in windowResized(), so the track kept its old width.',
    repair: 'Resize every slider on resize with the same formula: slider.size(canvasWidth - sliderLeftMargin - margin).' },
  SL: { name: 'Slider label overlaps the track', items: '2.2', family: 'hidden',
    cause: 'sliderLeftMargin is smaller than the longest label, so the track starts under "Speed: 5".',
    repair: 'Widen sliderLeftMargin so it clears the longest label by 10 px.' },
  BO: { name: 'Buttons overlap', items: '2.3', family: 'hidden',
    cause: 'Reset was positioned at x = 50, inside the Start button that runs from 10 to 70.',
    repair: 'Compute each x from the running total of widths: resetButton.position(10 + startWidth + 10, y).' },
  H: { name: 'Black halo around every letter', items: '1.3', family: 'contrast',
    cause: 'A stroke() was still active from the grid lines when text() ran.',
    repair: 'Call noStroke() just before text().' },
  P: { name: 'Pale text on aliceblue', items: '1.4', family: 'contrast',
    cause: 'The hint is drawn with fill(\'khaki\'), far below 4.5 to 1 against the aliceblue background.',
    repair: 'Use a dark text color such as fill(\'black\') or fill(\'dimgray\').' }
};
const DEFECT_IDS = Object.keys(DEFECTS);
const FAMILY_NAMES = { all: 'All', clipped: 'Clipped content', hidden: 'Hidden control', contrast: 'Color contrast' };

// checklist families shown in the right panel (items seeded in this mock are listed)
const CHECKLIST = [
  { n: 1, name: 'Text legibility', items: [['1.1', 'Clipped text at canvas edges', ['R']], ['1.3', 'Residual text strokes', ['H']], ['1.4', 'Low-contrast text', ['P']]] },
  { n: 2, name: 'Control region', items: [['2.1', 'Slider past right edge', ['SR']], ['2.2', 'Slider label overlaps track', ['SL']], ['2.3', 'Buttons overlap', ['BO']]] },
  { n: 3, name: 'Drawing region', items: [['3.1', 'Title position and overlap', ['T']], ['3.2', 'Draw-order bugs', ['S']], ['3.5', 'Grid row/column labels', ['R']]] },
  { n: 4, name: 'Color and hierarchy', items: [] },
  { n: 5, name: 'Library-specific', items: [] },
  { n: 6, name: 'Sanity checks', items: [] }
];

// decoy regions (mock units) with hints for wrong flags
const HINTS = {
  json: 'The JSON text is dark on white and sits inside its panel. Look at where the panel meets something else.',
  headers: 'These column headers are complete and dark. Compare them with the row labels on the left.',
  size: 'This part of the Size slider is fine. Follow its track all the way to the end.',
  speed: 'The right part of the Speed slider is fine. Look at where its track begins.',
  controls: 'Nothing wrong in this empty strip. Check each control: fully visible, separate, readable?',
  drawing: 'No defect here. Look for text cut at an edge, overlapping controls, halos and pale colors.'
};

// ---------- state ----------
let found = new Set();
let repaired = new Set();
let revealed = false;
let selected = null;        // defect id shown in the card
let wrongFlag = null;       // {x, y, hint} in mock units
let mock = { x: 0, y: 0, s: 1 };   // mock placement: origin and scale (mock is 600 x 420 units)
const MOCK_W = 600, MOCK_H = 420;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  repairButton = createButton('Apply repair');
  repairButton.parent(document.querySelector('main'));
  repairButton.mousePressed(applyRepair);
  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(resetAll);
  revealButton = createButton('Reveal');
  revealButton.parent(document.querySelector('main'));
  revealButton.mousePressed(() => { revealed = true; });
  familySelect = createSelect();
  familySelect.parent(document.querySelector('main'));
  Object.keys(FAMILY_NAMES).forEach(k => familySelect.option(FAMILY_NAMES[k], k));
  familySelect.changed(() => {
    if (selected && !visibleDefect(selected)) selected = null;
    wrongFlag = null;
  });
  [repairButton, resetButton, revealButton, familySelect].forEach(c => c.style('font-size', '15px'));
  positionControls();

  describe('Layout Defect Catalog Explorer. A deliberately flawed mock MicroSim holds eight layout ' +
    'defects: row labels cut off at the left edge, a title colliding with a side panel, a legend ' +
    'heading painted over, a slider running past the right edge, a slider label overlapping its ' +
    'track, overlapping buttons, black-haloed text and pale text on aliceblue. Clicking a region ' +
    'flags it; a correct flag opens a card with the visual checklist item, likely cause and repair. ' +
    'A checklist panel lists the six checklist families.', LABEL);
}

// ---------- defect state helpers ----------
function family() { return familySelect.value(); }
function visibleDefect(id) { return family() === 'all' || DEFECTS[id].family === family(); }
// a defect is drawn when it is not repaired and its family is visible
function active(id) { return !repaired.has(id) && visibleDefect(id); }

// geometry of the mock in its own 600 x 420 units, derived from which defects are active
function geom() {
  const gridX = active('R') ? 60 : 120;
  const g = {
    gridX: gridX, gridR: 390, gridT: 72, gridB: 252,
    title: 'Statement Completion Explorer',
    panel: { x: 410, y: 8, w: 180, h: 312 },
    start: { x: 10, y: 342, w: 60, h: 26 },
    reset: { x: active('BO') ? 50 : 80, y: 342, w: 60, h: 26 },
    speedLabelX: 160,
    speedTrackX: active('SL') ? 196 : 244, speedTrackR: 410,
    sizeTrackX: 100, sizeTrackR: active('SR') ? 660 : 580
  };
  return g;
}

// hit boxes (mock units) for each active defect
function defectBoxes(g) {
  textSize(24);
  textStyle(BOLD);
  const tw = textWidth(g.title);
  textStyle(NORMAL);
  const tx = active('T') ? 300 - tw / 2 : 12;
  return {
    R: { x: 0, y: g.gridT, w: g.gridX, h: g.gridB - g.gridT },
    H: { x: g.gridX, y: g.gridT, w: g.gridR - g.gridX, h: g.gridB - g.gridT },
    T: { x: tx - 4, y: 6, w: tw + 8, h: 34 },
    P: { x: 40, y: 258, w: 350, h: 22 },
    S: { x: 16, y: 284, w: 380, h: 40 },
    BO: { x: 8, y: 338, w: 106, h: 34 },
    SL: { x: 150, y: 338, w: 150, h: 34 },
    SR: { x: 440, y: 376, w: 160, h: 34 }
  };
}

// ---------- control handlers ----------
function applyRepair() {
  if (selected && found.has(selected)) repaired.add(selected);
}

function resetAll() {
  found.clear();
  repaired.clear();
  revealed = false;
  selected = null;
  wrongFlag = null;
}

// ---------- layout ----------
function isWide() { return canvasWidth >= 600; }

function areas() {
  const top = 36;
  if (isWide()) {
    const mw = floor(canvasWidth * 0.64) - margin;
    const mockArea = { x: margin, y: top, w: mw, h: 316 };
    const listArea = { x: margin + mw + 8, y: top, w: canvasWidth - mw - 2 * margin - 8, h: 316 };
    const card = { x: margin, y: top + 316 + 8, w: canvasWidth - 2 * margin, h: drawHeight - top - 316 - 8 - margin };
    return { mockArea, listArea, card };
  }
  const mh = min(250, (canvasWidth - 2 * margin) * MOCK_H / MOCK_W);
  const mockArea = { x: margin, y: top, w: canvasWidth - 2 * margin, h: mh };
  const listArea = { x: margin, y: top + mh + 6, w: canvasWidth - 2 * margin, h: 62 };
  const cy = listArea.y + listArea.h + 6;
  const card = { x: margin, y: cy, w: canvasWidth - 2 * margin, h: drawHeight - cy - margin };
  return { mockArea, listArea, card };
}

function positionControls() {
  repairButton.position(10, drawHeight + 8);
  resetButton.position(122, drawHeight + 8);
  revealButton.position(186, drawHeight + 8);
  familySelect.position(128, drawHeight + 44);
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
  text('Layout Defect Catalog Explorer', margin, 8);
  textStyle(NORMAL);

  const a = areas();
  drawMockFrame(a.mockArea);
  if (isWide()) drawChecklist(a.listArea); else drawChecklistCompact(a.listArea);
  drawCard(a.card);

  // control-region labels and the counter
  noStroke();
  fill('black');
  textSize(16);
  textAlign(LEFT, CENTER);
  text('Defect family:', 10, drawHeight + 56);
  textAlign(RIGHT, CENTER);
  textStyle(BOLD);
  const shown = DEFECT_IDS.filter(visibleDefect).length;
  text('Found ' + found.size + ' of 8' + (shown < 8 ? '  (' + shown + ' shown)' : ''),
    canvasWidth - 12, drawHeight + 20);
  textStyle(NORMAL);
}

function drawMockFrame(area) {
  const s = min(area.w / MOCK_W, area.h / MOCK_H);
  mock.s = s;
  mock.x = area.x + (area.w - MOCK_W * s) / 2;
  mock.y = area.y + (area.h - MOCK_H * s) / 2;
  push();
  translate(mock.x, mock.y);
  scale(s);
  // clip everything to the mock's own canvas, the way a real canvas edge clips
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(0, 0, MOCK_W, MOCK_H);
  drawingContext.clip();
  drawMock();
  drawingContext.restore();
  // outline of the mock canvas
  noFill();
  stroke('gray');
  strokeWeight(1 / s);
  rect(0, 0, MOCK_W, MOCK_H);
  drawFlags();
  pop();
}

// the flawed MicroSim itself, in mock units
function drawMock() {
  const g = geom();
  // drawing region and control region
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, MOCK_W, 330);
  fill('white');
  rect(0, 330, MOCK_W, 90);

  // title (defect T: centered on the whole canvas, into the panel)
  noStroke();
  fill('black');
  textSize(24);
  textStyle(BOLD);
  if (active('T')) { textAlign(CENTER, TOP); text(g.title, 300, 10); }
  else { textAlign(LEFT, TOP); text(g.title, 12, 10); }
  textStyle(NORMAL);

  // side JSON panel, drawn after the title (so a centered title disappears under it)
  const p = g.panel;
  stroke('silver');
  fill('white');
  rect(p.x, p.y, p.w, p.h, 6);
  noStroke();
  fill('black');
  textFont('monospace');
  textSize(12);
  textAlign(LEFT, TOP);
  const json = ['{', '  "verb": "completed",', '  "object": "cell-2",', '  "result": {', '    "completion":', '      true,', '    "success":', '      false', '  }', '}'];
  json.forEach((ln, i) => text(ln, p.x + 8, p.y + 48 + i * 18));
  textFont('sans-serif');

  // 2 x 2 grid
  const cw = (g.gridR - g.gridX) / 2, ch = (g.gridB - g.gridT) / 2;
  stroke('black');
  strokeWeight(1);
  const cellFill = ['honeydew', 'mistyrose', 'lemonchiffon', 'lavender'];
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      fill(cellFill[r * 2 + c]);
      rect(g.gridX + c * cw, g.gridT + r * ch, cw, ch);
    }
  }
  // column headers (fine)
  noStroke();
  fill('black');
  textSize(13);
  textAlign(CENTER, BOTTOM);
  text('success: true', g.gridX + cw / 2, g.gridT - 4);
  text('success: false', g.gridX + cw * 1.5, g.gridT - 4);
  // row labels right-aligned to the grid (defect R: offset too small, so they spill off the left)
  textAlign(RIGHT, CENTER);
  text('completion: true', g.gridX - 6, g.gridT + ch / 2);
  text('completion: false', g.gridX - 6, g.gridT + ch * 1.5);
  // cell text (defect H: the grid's stroke is still active)
  const cellText = ['passed', 'completed, failed', 'in progress', 'not attempted'];
  textSize(15);
  textAlign(CENTER, CENTER);
  if (active('H')) { stroke('black'); strokeWeight(1.6); } else { noStroke(); }
  fill('darkslateblue');
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      text(cellText[r * 2 + c], g.gridX + c * cw + cw / 2, g.gridT + r * ch + ch / 2);
    }
  }
  noStroke();
  strokeWeight(1);

  // hint line (defect P: pale khaki on aliceblue)
  fill(active('P') ? 'khaki' : 'dimgray');
  textSize(14);
  textAlign(LEFT, TOP);
  text('Click a cell to see its xAPI statement.', 44, 261);

  // legend box (defect S: background drawn after the heading)
  const drawLegendHeading = () => {
    noStroke();
    fill('black');
    textStyle(BOLD);
    textSize(14);
    textAlign(LEFT, TOP);
    text('Legend', 26, 282);
    textStyle(NORMAL);
  };
  if (active('S')) drawLegendHeading();
  stroke('silver');
  fill('white');
  rect(18, active('S') ? 291 : 280, 376, active('S') ? 33 : 44, 4);
  if (!active('S')) drawLegendHeading();
  noStroke();
  const leg = [['honeydew', 'passed'], ['mistyrose', 'failed'], ['lemonchiffon', 'in progress'], ['lavender', 'not attempted']];
  textSize(12);
  leg.forEach((l, i) => {
    const lx = 90 + i * 76;
    stroke('gray');
    fill(l[0]);
    rect(lx, 302, 12, 12);
    noStroke();
    fill('black');
    textAlign(LEFT, CENTER);
    text(l[1], lx + 16, 308);
  });

  // control region: buttons (defect BO: Reset placed inside Start)
  const btn = (b, label) => {
    stroke('gray');
    fill('gainsboro');
    rect(b.x, b.y, b.w, b.h, 4);
    noStroke();
    fill('black');
    textSize(14);
    textAlign(CENTER, CENTER);
    text(label, b.x + b.w / 2, b.y + b.h / 2);
  };
  btn(g.start, 'Start');
  btn(g.reset, 'Reset');
  // speed slider (defect SL: track starts under the label)
  const slider = (x0, x1, y, knobX) => {
    stroke('silver');
    strokeWeight(6);
    line(x0, y, x1, y);
    strokeWeight(1);
    stroke('royalblue');
    fill('royalblue');
    circle(knobX, y, 16);
  };
  slider(g.speedTrackX, g.speedTrackR, 355, g.speedTrackX + 60);
  noStroke();
  fill('black');
  textSize(15);
  textAlign(LEFT, CENTER);
  text('Speed: 5', g.speedLabelX, 355);
  // size slider (defect SR: runs past the right edge; its end and knob are cut off)
  text('Size: 12', 12, 392);
  slider(g.sizeTrackX, g.sizeTrackR, 392, g.sizeTrackR - 30);
}

// outlines for found, wrong and revealed flags (mock units)
function drawFlags() {
  const boxes = defectBoxes(geom());
  const s = mock.s;
  DEFECT_IDS.forEach(id => {
    if (!visibleDefect(id)) return;
    const b = boxes[id];
    if (found.has(id)) {
      noFill();
      stroke(repaired.has(id) ? 'seagreen' : 'green');
      strokeWeight((id === selected ? 4 : 2.5) / s);
      if (repaired.has(id)) drawingContext.setLineDash([6 / s, 4 / s]);
      rect(b.x, b.y, b.w, b.h, 4);
      drawingContext.setLineDash([]);
    } else if (revealed && !repaired.has(id)) {
      noFill();
      stroke('darkorange');
      strokeWeight(2.5 / s);
      drawingContext.setLineDash([5 / s, 4 / s]);
      rect(b.x, b.y, b.w, b.h, 4);
      drawingContext.setLineDash([]);
    }
  });
  if (wrongFlag) {
    noFill();
    stroke('red');
    strokeWeight(2.5 / s);
    rect(wrongFlag.x - 24, wrongFlag.y - 14, 48, 28, 4);
  }
  strokeWeight(1);
}

// ---------- checklist panel ----------
function drawChecklist(r) {
  stroke('silver');
  fill('white');
  rect(r.x, r.y, r.w, r.h, 8);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  text('Visual checklist families', r.x + 8, r.y + 6);
  textStyle(NORMAL);
  let y = r.y + 28;
  CHECKLIST.forEach(fam => {
    fill(fam.items.length ? 'steelblue' : 'slategray');
    textStyle(BOLD);
    textSize(13);
    text(fam.n + '. ' + fam.name, r.x + 8, y);
    const headW = textWidth(fam.n + '. ' + fam.name);
    textStyle(NORMAL);
    if (fam.items.length === 0) {
      fill('gray');
      textSize(12);
      text('(none seeded)', r.x + 8 + headW + 6, y + 1);
      y += 18;
      return;
    }
    y += 17;
    fam.items.forEach(it => {
      const hit = it[2].some(id => found.has(id));
      const fixed = it[2].every(id => repaired.has(id));
      fill(hit ? (fixed ? 'seagreen' : 'green') : 'dimgray');
      textSize(12);
      textStyle(hit ? BOLD : NORMAL);
      const mark = hit ? (fixed ? ' (repaired)' : ' FAIL') : '';
      text(it[0] + ' ' + it[1] + mark, r.x + 20, y, r.w - 26, 16);
      textStyle(NORMAL);
      y += 16;
    });
    y += 3;
  });
}

// narrow layout: one line per seeded family
function drawChecklistCompact(r) {
  stroke('silver');
  fill('white');
  rect(r.x, r.y, r.w, r.h, 6);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(12);
  let y = r.y + 5;
  CHECKLIST.slice(0, 3).forEach(fam => {
    let x = r.x + 6;
    fill('steelblue');
    textStyle(BOLD);
    const head = fam.n + ' ' + fam.name + ':';
    text(head, x, y);
    x += textWidth(head) + 6;
    textStyle(NORMAL);
    fam.items.forEach(it => {
      const hit = it[2].some(id => found.has(id));
      fill(hit ? 'green' : 'dimgray');
      textStyle(hit ? BOLD : NORMAL);
      text(it[0], x, y);
      x += textWidth(it[0]) + 8;
      textStyle(NORMAL);
    });
    y += 15;
  });
  fill('gray');
  text('4 Color, 5 Library, 6 Sanity: no defect seeded', r.x + 6, y);
}

// ---------- card ----------
function drawCard(r) {
  const d = selected ? DEFECTS[selected] : null;
  stroke(d ? 'green' : (wrongFlag ? 'red' : 'silver'));
  strokeWeight(d || wrongFlag ? 2 : 1);
  fill('white');
  rect(r.x, r.y, r.w, r.h, 8);
  strokeWeight(1);
  noStroke();
  textAlign(LEFT, TOP);
  const pad = 10, tw = r.w - 2 * pad;
  if (d) {
    fill('green');
    textSize(15);
    textStyle(BOLD);
    const status = repaired.has(selected) ? '  (repaired)' : '';
    text(d.name + '  ·  checklist item ' + d.items + '  ·  ' + FAMILY_NAMES[d.family] + status,
      r.x + pad, r.y + 7, tw, 20);
    textStyle(NORMAL);
    textSize(13);
    fill('black');
    text('Likely cause: ' + d.cause, r.x + pad, r.y + 29, tw, 34);
    fill('darkslateblue');
    text('Repair: ' + d.repair + (repaired.has(selected) ? '' : '  Press Apply repair to see it.'),
      r.x + pad, r.y + 29 + (r.h > 90 ? 34 : 30), tw, 34);
  } else if (wrongFlag) {
    fill('firebrick');
    textSize(15);
    textStyle(BOLD);
    text('Not a defect', r.x + pad, r.y + 7);
    textStyle(NORMAL);
    fill('black');
    textSize(13);
    text('Hint: ' + wrongFlag.hint, r.x + pad, r.y + 29, tw, r.h - 34);
  } else {
    fill('black');
    textSize(14);
    text('Click any suspicious region of the mock MicroSim to flag it. There are 8 defects ' +
      'in three families: clipped content, hidden controls and color contrast. A correct flag ' +
      'names the defect, its checklist item, the likely cause and the repair.',
      r.x + pad, r.y + 8, tw, r.h - 12);
  }
}

// ---------- flagging ----------
function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight || mouseX < 0 || mouseX > canvasWidth) return;
  const mx = (mouseX - mock.x) / mock.s, my = (mouseY - mock.y) / mock.s;
  if (mx < 0 || mx > MOCK_W || my < 0 || my > MOCK_H) return;
  const boxes = defectBoxes(geom());
  // a correct flag: the click is inside an active (unrepaired, visible) defect or a found one
  for (const id of DEFECT_IDS) {
    if (!visibleDefect(id)) continue;
    if (repaired.has(id) && !found.has(id)) continue;
    const b = boxes[id];
    if (mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h) {
      if (!active(id) && !found.has(id)) continue;
      found.add(id);
      selected = id;
      wrongFlag = null;
      return;
    }
  }
  // a wrong flag: pick a hint for the region
  let hint = HINTS.drawing;
  if (mx >= 410 && my < 330) hint = HINTS.json;
  else if (my >= 50 && my < 72 && mx < 400) hint = HINTS.headers;
  else if (my >= 376 && mx < 440) hint = HINTS.size;
  else if (my >= 338 && my < 376 && mx >= 300) hint = HINTS.speed;
  else if (my >= 330) hint = HINTS.controls;
  if (!visibleDefect('R') || !visibleDefect('H')) {
    // filtered view: remind the learner that some families are hidden
    hint += ' (Only ' + FAMILY_NAMES[family()] + ' defects are shown.)';
  }
  wrongFlag = { x: mx, y: my, hint: hint };
  selected = null;
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
