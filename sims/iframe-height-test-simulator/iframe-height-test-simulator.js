// Iframe Height Test Simulator - p5.js MicroSim
// CANVAS_HEIGHT: 620
// Learning objective (Apply / calculate): the learner applies the control visibility and iframe
// height tests to a mock MicroSim by choosing an iframe height, and calculates the suggested
// height from the content height.
// The rules copy test-iframe-heights.py (microsim-utils):
//   a control is visible when its bottom <= iframe height + tolerance (default 5 px);
//   canvases are measured but never reported as failures;
//   content height = the lowest bottom edge of any element inside <main>;
//   a declared "// CANVAS_HEIGHT = N" replaces the measured content height for the suggestion;
//   suggested height = (content or declared) + 10, rounded up to the next multiple of 10,
//   shown on FAIL; on PASS the tester simply repeats the current iframe height.

// ---------- canvas dimensions ----------
let canvasWidth = 700;
let drawHeight = 470;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let sliderLeftMargin = 210;
let defaultTextSize = 16;

// ---------- controls ----------
let iframeSlider, contentSlider, toleranceSlider, declaredCheckbox, declaredInput, runButton;

// ---------- mock MicroSim: element boxes in page pixels ----------
// The Reset button is the lowest control; its bottom edge is the content height.
function elements() {
  const content = contentSlider.value();
  return [
    { id: 'canvas', label: 'canvas', kind: 'canvas', top: 0, bottom: 260 },
    { id: 'speed', label: 'Speed slider', kind: 'slider', top: 266, bottom: 286 },
    { id: 'size', label: 'Size slider', kind: 'slider', top: 296, bottom: 316 },
    { id: 'count', label: 'Count slider', kind: 'slider', top: 326, bottom: 346 },
    { id: 'start', label: 'Start button', kind: 'button', top: 372, bottom: 398 },
    { id: 'reset', label: 'Reset button', kind: 'button', top: content - 26, bottom: content }
  ];
}

// ---------- state ----------
let scanState = 'idle';      // idle | scanning | done
let scanY = 0;               // current scan line position in page pixels
let scanStart = 0;
const SCAN_MS = 1800;
let selectedId = null;
let hitBoxes = [];           // canvas-space boxes of the mock elements
let resultsStale = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  iframeSlider = createSlider(300, 800, 500, 1);
  contentSlider = createSlider(400, 800, 528, 1);
  toleranceSlider = createSlider(0, 20, 5, 1);
  [iframeSlider, contentSlider, toleranceSlider].forEach(sl => {
    sl.parent(document.querySelector('main'));
    sl.input(markStale);
  });
  declaredCheckbox = createCheckbox('Declared CANVAS_HEIGHT', false);
  declaredCheckbox.parent(document.querySelector('main'));
  declaredCheckbox.changed(markStale);
  declaredCheckbox.style('font-size', '15px');
  declaredInput = createInput('520', 'number');
  declaredInput.parent(document.querySelector('main'));
  declaredInput.size(60);
  declaredInput.input(markStale);
  declaredInput.style('font-size', '15px');
  runButton = createButton('Run test');
  runButton.parent(document.querySelector('main'));
  runButton.mousePressed(runTest);
  runButton.style('font-size', '15px');
  positionControls();

  describe('Iframe Height Test Simulator. A mock MicroSim with a canvas, three sliders and two ' +
    'buttons sits inside an iframe frame whose bottom edge follows the Iframe height slider. ' +
    'Each control shows its bottom edge in pixels. Run test sweeps a scan line down the page and ' +
    'marks each control PASS when its bottom is at most the iframe height plus the tolerance, ' +
    'otherwise FAIL. A results panel lists each control, the overall status, the content height ' +
    'and, on failure, the suggested height: content height plus 10, rounded up to a multiple of 10.', LABEL);
}

// ---------- test logic ----------
function tolerance() { return toleranceSlider.value(); }
function iframeH() { return iframeSlider.value(); }
function contentH() { return max(elements().map(e => e.bottom)); }
function declaredValue() {
  const t = String(declaredInput.value()).trim();
  return declaredCheckbox.checked() && /^\d+$/.test(t) ? int(t) : null;
}
function passes(e) { return e.bottom <= iframeH() + tolerance(); }
function overallPass() { return elements().every(e => e.kind === 'canvas' || passes(e)); }
function suggested() {
  const base = declaredValue() !== null ? declaredValue() : contentH();
  return ceil((base + 10) / 10) * 10;
}
// has the scan line reached this element's bottom yet?
function revealed(e) {
  if (scanState === 'done') return true;
  if (scanState === 'scanning') return scanY >= e.bottom;
  return false;
}

function markStale() {
  if (scanState !== 'idle') resultsStale = true;
  scanState = 'idle';
}

function runTest() {
  scanState = 'scanning';
  scanStart = millis();
  scanY = 0;
  resultsStale = false;
}

// ---------- layout ----------
function isWide() { return canvasWidth >= 600; }

function positionControls() {
  const rowY = i => drawHeight + 8 + i * 35;
  iframeSlider.position(sliderLeftMargin, rowY(0));
  contentSlider.position(sliderLeftMargin, rowY(1));
  toleranceSlider.position(sliderLeftMargin, rowY(2));
  [iframeSlider, contentSlider, toleranceSlider].forEach(sl => sl.size(canvasWidth - sliderLeftMargin - 20));
  declaredCheckbox.position(10, rowY(3) + 3);
  declaredInput.position(232, rowY(3));
  runButton.position(318, rowY(3));
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

  if (scanState === 'scanning') {
    const maxY = max(contentH(), iframeH() + tolerance()) + 20;
    scanY = map(millis() - scanStart, 0, SCAN_MS, 0, maxY, true);
    if (scanY >= maxY) scanState = 'done';
  }

  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(20);
  textStyle(BOLD);
  text('Iframe Height Test Simulator', margin, 8);
  textStyle(NORMAL);

  let frameArea, resultArea;
  if (isWide()) {
    const fw = floor(canvasWidth * 0.52);
    frameArea = { x: margin, y: 38, w: fw, h: drawHeight - 38 - margin };
    resultArea = { x: margin + fw + 8, y: 38, w: canvasWidth - fw - 2 * margin - 8, h: drawHeight - 38 - margin };
  } else {
    frameArea = { x: margin, y: 38, w: canvasWidth - 2 * margin, h: 200 };
    resultArea = { x: margin, y: 38 + 200 + 6, w: canvasWidth - 2 * margin, h: drawHeight - 38 - 200 - 6 - margin };
  }
  drawFrame(frameArea);
  drawResults(resultArea);

  // control-region labels
  noStroke();
  fill('black');
  textSize(16);
  textAlign(LEFT, CENTER);
  const rowY = i => drawHeight + 18 + i * 35;
  text('Iframe height: ' + iframeH() + ' px', 10, rowY(0));
  text('Content height: ' + contentSlider.value() + ' px', 10, rowY(1));
  text('Tolerance: ' + tolerance() + ' px', 10, rowY(2));
}

// the iframe frame with the mock MicroSim inside
function drawFrame(a) {
  const pageMax = 820;
  const s = (a.h - 6) / pageMax;             // page pixels -> canvas pixels
  const wide = isWide();
  const labelW = wide ? 96 : 110;
  const fx = a.x + (wide ? 34 : 34), fw = a.w - labelW - 34;
  const fy = a.y + 2;
  const Y = p => fy + p * s;
  hitBoxes = [];

  // page ruler on the left
  noStroke();
  fill('dimgray');
  textSize(11);
  textAlign(RIGHT, CENTER);
  for (let p = 0; p <= 800; p += 100) {
    text(p, fx - 6, Y(p));
    stroke('lightgray');
    line(fx - 4, Y(p), fx, Y(p));
    noStroke();
  }

  // the page (white) and the mock elements
  stroke('silver');
  fill('white');
  rect(fx, fy, fw, pageMax * s);
  const els = elements();
  els.forEach(e => {
    const y0 = Y(e.top), y1 = Y(e.bottom);
    let bx, bw;
    if (e.kind === 'canvas') { bx = fx + 6; bw = fw - 12; }
    else if (e.kind === 'slider') { bx = fx + 6; bw = fw * 0.7; }
    else if (e.id === 'start') { bx = fx + 6; bw = min(70, fw * 0.3); }
    else { bx = fx + 6 + min(80, fw * 0.34); bw = min(70, fw * 0.3); }
    hitBoxes.push({ id: e.id, x: bx, y: y0, w: bw, h: max(4, y1 - y0) });
    // element drawing
    if (e.kind === 'canvas') {
      stroke('silver'); fill('aliceblue'); rect(bx, y0, bw, y1 - y0);
      noStroke(); fill('steelblue');
      for (let k = 0; k < 5; k++) {
        const bh = (y1 - y0) * (0.25 + 0.12 * k);
        rect(bx + 10 + k * (bw - 20) / 5, y1 - bh - 4, (bw - 20) / 5 - 6, bh);
      }
    } else if (e.kind === 'slider') {
      stroke('silver'); strokeWeight(3);
      line(bx + 44, (y0 + y1) / 2, bx + bw, (y0 + y1) / 2);
      strokeWeight(1); noStroke(); fill('royalblue');
      circle(bx + 44 + bw * 0.3, (y0 + y1) / 2, max(6, (y1 - y0) * 0.7));
      fill('black'); textSize(wide ? 10.5 : 9); textAlign(LEFT, CENTER);
      text(e.label.split(' ')[0], bx, (y0 + y1) / 2);
    } else {
      stroke('gray'); fill('gainsboro'); rect(bx, y0, bw, y1 - y0, 3);
      noStroke(); fill('black'); textSize(wide ? 11 : 10); textAlign(CENTER, CENTER);
      text(e.label.split(' ')[0], bx + bw / 2, (y0 + y1) / 2);
    }
    // PASS / FAIL marks once the scan line has passed the element
    if (revealed(e) && !resultsStale) {
      const ok = e.kind === 'canvas' ? null : passes(e);
      if (ok !== null) {
        noFill();
        stroke(ok ? 'green' : 'red');
        strokeWeight(2);
        rect(bx - 2, y0 - 2, bw + 4, y1 - y0 + 4, 3);
        strokeWeight(1);
      }
    }
    // bottom-edge label to the right of the frame (sliders only when there is room)
    if (!wide && e.kind === 'slider') return;
    noStroke();
    fill(e.kind === 'canvas' ? 'dimgray' : 'black');
    textSize(wide ? 11.5 : 10);
    textAlign(LEFT, CENTER);
    let tag = 'bottom ' + e.bottom;
    if (revealed(e) && !resultsStale && e.kind !== 'canvas') tag += passes(e) ? ' PASS' : ' FAIL';
    stroke('lightgray');
    line(fx + fw, Y(e.bottom), fx + fw + 4, Y(e.bottom));
    noStroke();
    if (revealed(e) && !resultsStale && e.kind !== 'canvas') fill(passes(e) ? 'green' : 'red');
    // keep the Start and Reset labels apart when their bottoms are close
    const gapPx = (contentSlider.value() - 398) * s;
    let dy = 0;
    if (gapPx < 12 && e.id === 'start') dy = -(12 - gapPx) / 2;
    if (gapPx < 12 && e.id === 'reset') dy = (12 - gapPx) / 2;
    text(tag, fx + fw + 6, Y(e.bottom) + dy);
  });

  // outside the iframe: shaded, because scrolling="no" hides it
  const ih = iframeH();
  noStroke();
  fill(90, 90, 90, 70);
  rect(fx, Y(ih), fw, (pageMax - ih) * s);
  // tolerance band
  stroke('darkorange');
  drawingContext.setLineDash([4, 3]);
  line(fx - 4, Y(ih + tolerance()), fx + fw, Y(ih + tolerance()));
  drawingContext.setLineDash([]);
  // the iframe frame: its bottom edge follows the slider
  noFill();
  stroke('black');
  strokeWeight(3);
  rect(fx, fy, fw, ih * s);
  strokeWeight(1);
  noStroke();
  fill('black');
  textSize(11);
  textAlign(LEFT, BOTTOM);
  text('iframe ' + ih + ' px', fx + 4, Y(ih) - 2);
  fill('darkorange');
  textAlign(LEFT, TOP);
  textAlign(RIGHT, TOP);
  if (tolerance() > 0) text('+' + tolerance() + ' tolerance', fx + fw - 4, Y(ih + tolerance()) + 1);

  // scan line
  if (scanState === 'scanning') {
    stroke('magenta');
    strokeWeight(2);
    line(fx - 10, Y(scanY), fx + fw + 10, Y(scanY));
    strokeWeight(1);
  }

  // selected element: bounding box
  const sel = hitBoxes.find(b => b.id === selectedId);
  if (sel) {
    noFill();
    stroke('purple');
    strokeWeight(2);
    drawingContext.setLineDash([3, 3]);
    rect(sel.x - 4, sel.y - 4, sel.w + 8, sel.h + 8);
    drawingContext.setLineDash([]);
    strokeWeight(1);
  }
}

function drawResults(a) {
  stroke('silver');
  fill('white');
  rect(a.x, a.y, a.w, a.h, 8);
  noStroke();
  textAlign(LEFT, TOP);
  const pad = 10;
  const els = elements();
  const wide = isWide();
  const run = scanState !== 'idle' && !resultsStale;
  const done = scanState === 'done' && !resultsStale;

  fill('black');
  textSize(15);
  textStyle(BOLD);
  text('Test results', a.x + pad, a.y + 8);
  textStyle(NORMAL);
  textSize(12);
  fill('dimgray');
  const limit = iframeH() + tolerance();
  text('Pass rule: bottom <= ' + iframeH() + ' + ' + tolerance() + ' = ' + limit, a.x + pad + 96, a.y + 10, a.w - 110, 16);

  // per-control rows
  let y = a.y + 32;
  const rowH = wide ? 20 : 14;
  const colB = a.x + a.w * 0.52, colS = a.x + a.w - pad;
  els.forEach(e => {
    textSize(wide ? 13 : 12);
    fill('black');
    textAlign(LEFT, TOP);
    text(e.label, a.x + pad, y);
    textAlign(RIGHT, TOP);
    text(e.bottom, colB, y);
    let st = '?', col = 'gray';
    if (e.kind === 'canvas') { st = 'measured only'; col = 'dimgray'; }
    else if (run && revealed(e)) { st = passes(e) ? 'PASS' : 'FAIL'; col = passes(e) ? 'green' : 'red'; }
    fill(col);
    textStyle(BOLD);
    text(st, colS, y);
    textStyle(NORMAL);
    y += rowH;
  });

  // summary
  y += 4;
  stroke('silver');
  line(a.x + pad, y, a.x + a.w - pad, y);
  noStroke();
  y += 6;
  textAlign(LEFT, TOP);
  textSize(wide ? 14 : 11);
  const dec = declaredValue();
  if (!done) {
    fill('dimgray');
    text(resultsStale ? 'Settings changed: press Run test again.'
      : (scanState === 'scanning' ? 'Scanning...' : 'Press Run test. Predict first: which controls fail?'),
      a.x + pad, y, a.w - 2 * pad, 36);
    y += wide ? 40 : 30;
  } else {
    const ok = overallPass();
    fill(ok ? 'green' : 'red');
    textStyle(BOLD);
    text('MicroSim status: ' + (ok ? 'PASS' : 'FAIL'), a.x + pad, y);
    textStyle(NORMAL);
    y += wide ? 20 : 16;
    fill('black');
    text('Content height: ' + contentH() + ' px (lowest bottom edge)', a.x + pad, y, a.w - 2 * pad, 18);
    y += wide ? 20 : 16;
    if (ok) {
      text('Suggested height: none (a PASS repeats the current ' + iframeH() + ')', a.x + pad, y, a.w - 2 * pad, 36);
    } else {
      const base = dec !== null ? dec : contentH();
      const src = dec !== null ? 'declared ' + dec : 'content ' + contentH();
      textStyle(BOLD);
      fill('darkslateblue');
      text('Suggested height: ' + suggested() + ' px', a.x + pad, y);
      textStyle(NORMAL);
      y += wide ? 18 : 15;
      fill('black');
      text('= ' + src + ' + 10 = ' + (base + 10) + ', rounded up to a multiple of 10',
        a.x + pad, y, a.w - 2 * pad, 36);
    }
    y += wide ? 38 : 28;
  }

  // declared value note and the clicked element's inequality
  textSize(12);
  fill('dimgray');
  if (dec !== null && wide) {
    text('Declared as // CANVAS_HEIGHT = ' + dec + ' (the tester reads only the "=" form).',
      a.x + pad, y, a.w - 2 * pad, 32);
    y += 34;
  }
  const e = els.find(q => q.id === selectedId);
  const boxH = a.y + a.h - y - 8;
  if (boxH > 30) {
    stroke('purple');
    fill('lavender');
    rect(a.x + 6, y, a.w - 12, boxH, 6);
    noStroke();
    fill('black');
    textSize(wide ? 13 : 12);
    let msg;
    if (!e) msg = 'Click any element in the mock to see its bounding box and the inequality that decides it.';
    else if (e.kind === 'canvas') msg = 'canvas: top ' + e.top + ', bottom ' + e.bottom + '. Canvases are measured but never reported as failures.';
    else {
      const ok = passes(e);
      msg = e.label + ': top ' + e.top + ', bottom ' + e.bottom + '. Is ' + e.bottom + ' <= ' +
        iframeH() + ' + ' + tolerance() + ' = ' + limit + '? ' + (ok ? 'Yes, so PASS.' : 'No, so FAIL.');
    }
    text(msg, a.x + 12, y + 6, a.w - 24, boxH - 8);
  }
}

function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight || mouseX < 0 || mouseX > canvasWidth) return;
  for (const b of hitBoxes) {
    if (mouseX >= b.x - 3 && mouseX <= b.x + b.w + 3 && mouseY >= b.y - 3 && mouseY <= b.y + b.h + 3) {
      selectedId = b.id;
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
