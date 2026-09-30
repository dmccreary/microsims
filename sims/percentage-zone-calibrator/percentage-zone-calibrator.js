// Percentage Zone Calibrator - p5.js MicroSim
// CANVAS_HEIGHT: 535
// Learning objective (Apply / calculate): the learner calculates the x1, y1, x2 and y2
// percentages of a rectangle drawn over an image and predicts whether a given click falls
// inside it. A placeholder poster (three colored columns) sits under one translucent zone
// with four draggable corner handles. Zone edges are stored ONLY as percentages of the
// picture's width and height and converted to pixels on every frame, so resizing the
// picture never changes the numbers.

// ---------- canvas layout ----------
let canvasWidth = 400;               // replaced by the container width
let drawHeight = 420;                // drawing region (picture + readout)
let controlHeight = 115;             // three rows of controls
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let sliderLeftMargin = 175;
let defaultTextSize = 16;

// ---------- model (all values are percentages) ----------
let zone = { x1: 2, y1: 12, x2: 34, y2: 90 };   // the chapter's first poster column
let target = null;                  // target-practice rectangle, or null
let targetChecked = false;          // true after "Check match"
let clickPoint = null;              // last click-test point {x, y} in percent
let showJson = false;               // JSON panel visible
let message = '';                   // one-off status line
let dragging = null;                // 'tl' | 'tr' | 'bl' | 'br' | null
const HANDLE = 24;                  // handle size in pixels (touch friendly)
const MIN_GAP = 3;                  // minimum zone width/height in percent

// ---------- computed geometry (pixels) ----------
let pic = { x: 0, y: 0, w: 0, h: 0 };
let panel = { x: 0, y: 0, w: 0, h: 0 };
let narrow = false;

// ---------- controls ----------
let showPctCheckbox, clickTestCheckbox;
let copyJsonButton, targetButton, resetButton;
let resizeSlider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Row 1: checkboxes
  showPctCheckbox = createCheckbox(' Show percentages', true);
  showPctCheckbox.position(10, drawHeight + 8);
  clickTestCheckbox = createCheckbox(' Click test', false);
  clickTestCheckbox.position(185, drawHeight + 8);
  clickTestCheckbox.changed(() => {
    clickPoint = null;
    message = clickTestCheckbox.checked()
      ? 'Click test is on. Predict first, then click anywhere on the picture.'
      : '';
  });

  // Row 2: buttons
  copyJsonButton = createButton('Copy JSON');
  copyJsonButton.position(10, drawHeight + 42);
  copyJsonButton.mousePressed(toggleJson);
  targetButton = createButton('Target practice');
  targetButton.position(110, drawHeight + 42);
  targetButton.mousePressed(targetAction);
  resetButton = createButton('Reset zone');
  resetButton.position(232, drawHeight + 42);
  resetButton.mousePressed(resetZone);

  // Row 3: picture size slider
  resizeSlider = createSlider(50, 100, 100, 1);
  resizeSlider.position(sliderLeftMargin, drawHeight + 80);
  resizeSlider.size(canvasWidth - sliderLeftMargin - 25);

  updateDescription();
}

function draw() {
  updateCanvasSize();
  computeLayout();

  // drawing region and control region backgrounds
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(22);
  text('Percentage Zone Calibrator', canvasWidth / 2, 10);

  drawPoster();
  if (target) drawTarget();
  drawZone();
  if (clickPoint) drawClickPoint();
  drawPanel();

  // control labels
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Resize picture: ' + resizeSlider.value() + '%', 10, drawHeight + 90);
}

// ---------- layout ----------
function computeLayout() {
  narrow = canvasWidth < 600;
  const top = 42;
  let boxX, boxY, boxW, boxH;
  if (!narrow) {
    panel.w = min(310, floor(canvasWidth * 0.37));
    boxX = margin;
    boxY = top;
    boxW = canvasWidth - panel.w - 3 * margin;
    boxH = drawHeight - top - margin;
    panel.x = boxX + boxW + margin;
    panel.y = top;
    panel.h = drawHeight - top - margin;
  } else {
    boxX = margin;
    boxY = top;
    boxW = canvasWidth - 2 * margin;
    boxH = 196;
    panel.x = margin;
    panel.y = boxY + boxH + 8;
    panel.w = canvasWidth - 2 * margin;
    panel.h = drawHeight - panel.y - 6;
  }
  // the poster keeps a 4:3 shape; the slider scales it from 50 to 100 percent
  const fullW = min(boxW, boxH * 4 / 3);
  pic.w = fullW * resizeSlider.value() / 100;
  pic.h = pic.w * 3 / 4;
  pic.x = boxX + (boxW - pic.w) / 2;
  pic.y = boxY;
}

// percent -> pixel and pixel -> percent conversions (the whole point of the lab)
function pxX(p) { return pic.x + p / 100 * pic.w; }
function pxY(p) { return pic.y + p / 100 * pic.h; }
function pctX(px) { return (px - pic.x) / pic.w * 100; }
function pctY(py) { return (py - pic.y) / pic.h * 100; }

// ---------- drawing ----------
function drawPoster() {
  // background card
  stroke('gray');
  strokeWeight(1);
  fill('ivory');
  rect(pic.x, pic.y, pic.w, pic.h);
  noStroke();
  // title bar (0-10%) and footer (92-98%)
  fill('dimgray');
  rect(pxX(2), pxY(2), pic.w * 0.96, pic.h * 0.08, 3);
  fill('gainsboro');
  rect(pxX(30), pxY(4.5), pic.w * 0.40, pic.h * 0.03, 2);
  fill('lightgray');
  rect(pxX(2), pxY(92), pic.w * 0.96, pic.h * 0.05, 3);

  // three columns: 2-34, 34-67, 67-98 across, 12-90 down
  const cols = [[2, 34, 'crimson'], [34, 67, 'teal'], [67, 98, 'rebeccapurple']];
  for (const c of cols) {
    const x = pxX(c[0]) + 2, w = (c[1] - c[0]) / 100 * pic.w - 4;
    fill(c[2]);
    rect(x, pxY(12), w, pic.h * 0.78, 4);
    // header band, illustration circle and "text rows"
    fill(255, 255, 255, 60);
    rect(x + w * 0.1, pxY(15), w * 0.8, pic.h * 0.06, 3);
    fill(255, 255, 255, 90);
    circle(x + w / 2, pxY(37), min(w * 0.5, pic.h * 0.22));
    fill(255, 255, 255, 150);
    for (let r = 0; r < 4; r++) {
      rect(x + w * 0.12, pxY(55 + r * 8), w * (r % 2 ? 0.6 : 0.76), pic.h * 0.025, 2);
    }
  }
}

function drawTarget() {
  const x = pxX(target.x1), y = pxY(target.y1);
  const w = pxX(target.x2) - x, h = pxY(target.y2) - y;
  push();
  noFill();
  stroke('darkorange');
  strokeWeight(3);
  drawingContext.setLineDash([8, 6]);
  rect(x, y, w, h);
  pop();
  // small label inside the target's lower-left corner
  textSize(13);
  const lw = textWidth('target') + 8;
  noStroke();
  fill(255, 255, 255, 220);
  rect(x + 3, y + h - 20, lw, 17, 3);
  fill('chocolate');
  textAlign(LEFT, CENTER);
  text('target', x + 7, y + h - 11);
}

function drawZone() {
  const x = pxX(zone.x1), y = pxY(zone.y1);
  const w = pxX(zone.x2) - x, h = pxY(zone.y2) - y;
  stroke('navy');
  strokeWeight(3);
  fill(255, 255, 255, 70);          // translucent white tint
  rect(x, y, w, h);

  // four corner handles (at least 24 px for touch)
  const corners = handlePositions();
  for (const k in corners) {
    const c = corners[k];
    stroke('navy');
    strokeWeight(2);
    fill(dragging === k ? 'gold' : 'white');
    rect(c.x - HANDLE / 2, c.y - HANDLE / 2, HANDLE, HANDLE, 4);
  }

  if (showPctCheckbox.checked()) {
    labelBox('x1 ' + nf(zone.x1, 1, 1) + '  y1 ' + nf(zone.y1, 1, 1),
      corners.tl.x + HANDLE / 2 + 4, corners.tl.y + HANDLE / 2 + 2, 'topleft');
    labelBox('x2 ' + nf(zone.x2, 1, 1) + '  y2 ' + nf(zone.y2, 1, 1),
      corners.br.x - HANDLE / 2 - 4, corners.br.y - HANDLE / 2 - 2, 'bottomright');
  }
}

// a small white label with a border, kept inside the canvas
function labelBox(s, ax, ay, anchor) {
  textSize(14);
  const w = textWidth(s) + 10, h = 20;
  let x = anchor === 'topleft' ? ax : ax - w;
  let y = anchor === 'topleft' ? ay : ay - h;
  x = constrain(x, 2, canvasWidth - w - 2);
  y = constrain(y, 2, drawHeight - h - 2);
  stroke('navy');
  strokeWeight(1);
  fill(255, 255, 255, 235);
  rect(x, y, w, h, 4);
  noStroke();
  fill('navy');
  textAlign(LEFT, CENTER);
  text(s, x + 5, y + h / 2 + 1);
}

function drawClickPoint() {
  const x = pxX(clickPoint.x), y = pxY(clickPoint.y);
  const inside = isInside(clickPoint, zone);
  stroke(inside ? 'darkgreen' : 'firebrick');
  strokeWeight(3);
  line(x - 9, y, x + 9, y);
  line(x, y - 9, x, y + 9);
  noFill();
  circle(x, y, 16);
}

function drawPanel() {
  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 235);
  rect(panel.x, panel.y, panel.w, panel.h, 10);

  const lx = panel.x + 10;
  let y = panel.y + 8;
  const lh = narrow ? 18 : 21;
  const show = showPctCheckbox.checked();
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(narrow ? 14 : 16);
  textStyle(BOLD);
  text('Zone = pixels ÷ picture size × 100', lx, y);
  textStyle(NORMAL);
  y += lh + 2;

  // the calculation for each edge, using pixel offsets from the picture's top-left
  const pw = round(pic.w), ph = round(pic.h);
  const rows = [
    ['x1', round(pxX(zone.x1) - pic.x), pw, zone.x1],
    ['y1', round(pxY(zone.y1) - pic.y), ph, zone.y1],
    ['x2', round(pxX(zone.x2) - pic.x), pw, zone.x2],
    ['y2', round(pxY(zone.y2) - pic.y), ph, zone.y2]
  ];
  if (narrow) {
    textSize(14);
    for (const r of rows) {
      text(edgeText(r, show, true), lx, y);
      y += 17;
    }
  } else {
    for (const r of rows) {
      text(edgeText(r, show, false), lx, y);
      y += lh;
    }
    fill('dimgray');
    text('Picture: ' + pw + ' × ' + ph + ' px', lx, y);
    y += lh;
  }
  y += 4;
  stroke('gainsboro');
  line(lx, y, panel.x + panel.w - 10, y);
  noStroke();
  y += 6;

  // status area: JSON, target result, click test, or a hint
  const maxW = panel.w - 20;
  const bottom = panel.y + panel.h - 6;
  fill('black');
  if (showJson) {
    textFont('monospace');
    textSize(narrow ? 13 : 14);
    // one compact wrapped line on a phone, the indented form otherwise
    const lines = narrow ? wrapLines(JSON.stringify(JSON.parse(zoneJson())).replace(/,/g, ', '), maxW)
      : zoneJson().split('\n');
    for (const l of lines) {
      if (y + 16 > bottom) break;
      text(l, lx, y);
      y += 17;
    }
    textFont('sans-serif');
    return;
  }
  const lines = statusLines();
  textSize(narrow ? 14 : 15);
  for (const item of lines) {
    fill(item.c || 'black');
    const wrapped = wrapLines(item.t, maxW);
    for (const w of wrapped) {
      if (y + 17 > bottom) return;
      text(w, lx, y);
      y += narrow ? 17 : 19;
    }
  }
}

function edgeText(r, show, short) {
  const val = show ? nf(r[3], 1, 1) + '%' : '?';
  if (short) return r[0] + ' = ' + r[1] + ' ÷ ' + r[2] + ' × 100 = ' + val;
  return r[0] + ' = ' + r[1] + ' ÷ ' + r[2] + ' × 100 = ' + val;
}

function statusLines() {
  const out = [];
  if (target) {
    if (!targetChecked) {
      out.push({ t: 'Target practice: drag the handles onto the dashed orange target, ' +
        'then press Check match. Every edge must be within 2 points.' });
    } else {
      const edges = ['x1', 'y1', 'x2', 'y2'];
      let allOk = true;
      const parts = [];
      for (const e of edges) {
        const err = abs(zone[e] - target[e]);
        const ok = err <= 2;
        if (!ok) allOk = false;
        const t = narrow ? e + ' off ' + nf(err, 1, 1) + (ok ? ' ok' : ' too far')
          : e + ' ' + nf(zone[e], 1, 1) + ' vs ' + target[e] + ': off ' + nf(err, 1, 1) +
            (ok ? ' ok' : ' too far');
        parts.push({ t: t, c: ok ? 'darkgreen' : 'firebrick' });
      }
      if (narrow) {
        // two edges per line on a phone-width panel
        out.push({ t: parts[0].t + ';  ' + parts[1].t, c: parts[0].c === parts[1].c ? parts[0].c : 'black' });
        out.push({ t: parts[2].t + ';  ' + parts[3].t, c: parts[2].c === parts[3].c ? parts[2].c : 'black' });
      } else {
        for (const q of parts) out.push(q);
      }
      out.push({ t: allOk ? 'Matched within 2 points on every edge.' :
        'Fix the edges marked too far, then check again.',
        c: allOk ? 'darkgreen' : 'firebrick' });
    }
    return out;
  }
  if (clickTestCheckbox.checked()) {
    if (!clickPoint) {
      out.push({ t: 'Click test: a click is inside when x1 ≤ x ≤ x2 and y1 ≤ y ≤ y2. ' +
        'Predict, then click the picture.' });
    } else {
      const p = clickPoint;
      const inX = p.x >= zone.x1 && p.x <= zone.x2;
      const inY = p.y >= zone.y1 && p.y <= zone.y2;
      out.push({ t: 'Click at x = ' + nf(p.x, 1, 1) + '%, y = ' + nf(p.y, 1, 1) + '%' });
      if (inX && inY) {
        out.push({ t: 'INSIDE: ' + nf(zone.x1, 1, 1) + ' ≤ ' + nf(p.x, 1, 1) + ' ≤ ' +
          nf(zone.x2, 1, 1) + ' and ' + nf(zone.y1, 1, 1) + ' ≤ ' + nf(p.y, 1, 1) + ' ≤ ' +
          nf(zone.y2, 1, 1), c: 'darkgreen' });
      } else {
        const why = !inX ? 'x is not between ' + nf(zone.x1, 1, 1) + ' and ' + nf(zone.x2, 1, 1)
          : 'y is not between ' + nf(zone.y1, 1, 1) + ' and ' + nf(zone.y2, 1, 1);
        out.push({ t: 'OUTSIDE: ' + why, c: 'firebrick' });
      }
    }
    return out;
  }
  if (message) out.push({ t: message });
  else out.push({ t: 'Drag a corner handle. Then move the Resize picture slider: ' +
    'the pixel numbers change, the percentages do not.', c: 'dimgray' });
  return out;
}

// word wrap for the current text size
function wrapLines(s, maxW) {
  const words = s.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? cur + ' ' + w : w;
    if (textWidth(test) > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

// ---------- model helpers ----------
function handlePositions() {
  return {
    tl: { x: pxX(zone.x1), y: pxY(zone.y1) },
    tr: { x: pxX(zone.x2), y: pxY(zone.y1) },
    bl: { x: pxX(zone.x1), y: pxY(zone.y2) },
    br: { x: pxX(zone.x2), y: pxY(zone.y2) }
  };
}

function isInside(p, z) {
  return p.x >= z.x1 && p.x <= z.x2 && p.y >= z.y1 && p.y <= z.y2;
}

function round1(v) { return Math.round(v * 10) / 10; }

function zoneJson() {
  const obj = {
    id: 'my-zone',
    label: 'My zone',
    x1: round1(zone.x1), y1: round1(zone.y1),
    x2: round1(zone.x2), y2: round1(zone.y2)
  };
  return JSON.stringify(obj, null, 2);
}

// ---------- pointer handling ----------
function mousePressed() {
  if (mouseY > drawHeight || mouseY < 0 || mouseX < 0 || mouseX > canvasWidth) return;
  const corners = handlePositions();
  for (const k in corners) {
    const c = corners[k];
    if (abs(mouseX - c.x) <= HANDLE / 2 + 4 && abs(mouseY - c.y) <= HANDLE / 2 + 4) {
      dragging = k;
      return false;
    }
  }
  // click test on the picture
  const onPic = mouseX >= pic.x && mouseX <= pic.x + pic.w &&
    mouseY >= pic.y && mouseY <= pic.y + pic.h;
  if (onPic && clickTestCheckbox.checked()) {
    clickPoint = { x: round1(pctX(mouseX)), y: round1(pctY(mouseY)) };
    showJson = false;
  }
}

function mouseDragged() {
  if (!dragging) return;
  const px = constrain(round1(pctX(mouseX)), 0, 100);
  const py = constrain(round1(pctY(mouseY)), 0, 100);
  if (dragging === 'tl' || dragging === 'bl') zone.x1 = min(px, zone.x2 - MIN_GAP);
  if (dragging === 'tr' || dragging === 'br') zone.x2 = max(px, zone.x1 + MIN_GAP);
  if (dragging === 'tl' || dragging === 'tr') zone.y1 = min(py, zone.y2 - MIN_GAP);
  if (dragging === 'bl' || dragging === 'br') zone.y2 = max(py, zone.y1 + MIN_GAP);
  if (targetChecked) targetChecked = false;
  return false;
}

function mouseReleased() {
  if (dragging) {
    dragging = null;
    updateDescription();
  }
}

// ---------- button actions ----------
function toggleJson() {
  showJson = !showJson;
  copyJsonButton.html(showJson ? 'Hide JSON' : 'Copy JSON');
  if (showJson && navigator.clipboard) {
    // copying may be blocked inside an iframe; the panel still shows the text
    navigator.clipboard.writeText(zoneJson()).catch(() => {});
  }
}

function targetAction() {
  showJson = false;
  copyJsonButton.html('Copy JSON');
  if (!target || (targetChecked && allWithinTwo())) {
    // start a new random target, with whole-number edges
    const x1 = floor(random(4, 45)), y1 = floor(random(6, 40));
    const x2 = floor(random(x1 + 18, 96)), y2 = floor(random(y1 + 25, 95));
    target = { x1: x1, y1: y1, x2: x2, y2: y2 };
    targetChecked = false;
    targetButton.html('Check match');
  } else {
    targetChecked = true;
    if (allWithinTwo()) targetButton.html('New target');
  }
}

function allWithinTwo() {
  if (!target) return false;
  return ['x1', 'y1', 'x2', 'y2'].every(e => abs(zone[e] - target[e]) <= 2);
}

function resetZone() {
  zone = { x1: 2, y1: 12, x2: 34, y2: 90 };
  target = null;
  targetChecked = false;
  clickPoint = null;
  showJson = false;
  message = '';
  targetButton.html('Target practice');
  copyJsonButton.html('Copy JSON');
  updateDescription();
}

function updateDescription() {
  describe('Percentage Zone Calibrator. A translucent zone over a three-column poster has ' +
    'x1 ' + nf(zone.x1, 1, 1) + ' percent, y1 ' + nf(zone.y1, 1, 1) + ' percent, x2 ' +
    nf(zone.x2, 1, 1) + ' percent and y2 ' + nf(zone.y2, 1, 1) + ' percent of the picture. ' +
    'Drag the corner handles to change it.', LABEL);
}

// ---------- responsive design ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  resizeSlider.size(canvasWidth - sliderLeftMargin - 25);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.floor(container.getBoundingClientRect().width);
  }
}
