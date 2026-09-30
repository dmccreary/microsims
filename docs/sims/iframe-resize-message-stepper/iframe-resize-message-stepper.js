// Iframe Resize Message Stepper - p5.js MicroSim
// CANVAS_HEIGHT: 600
// Learning objective (Analyze / differentiate): the learner differentiates the outcomes of a
// fixed iframe height, a runtime resize message, and a pinned infobox by stepping through the
// auto-height protocol and observing where the controls land.
// Protocol steps: (1) page loads with the default height attribute, (2) the child measures
// document.body.scrollHeight, (3) the child posts { type: 'microsim-resize', height }, (4) the
// parent's listener matches event.source to an iframe's contentWindow, (5) the iframe height
// changes. Numbers follow the generator skill's pinning reference: the infobox is 110, 140 or
// 240 px tall, so unpinned controls jump up to 130 px.

// ---------- canvas dimensions ----------
let canvasWidth = 700;
let drawHeight = 480;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

// ---------- controls ----------
let backButton, nextButton, calloutSelect, modeRadio, listenerCheckbox, allowanceSlider;
let sliderLeftMargin = 330;

// ---------- child page model (pixels inside the MicroSim) ----------
const LAYOUT_H = 200;                       // image + label panels (constant)
const CONTROLS_H = 44;                      // control row (constant)
const CALLOUTS = ['Short prompt', 'Medium description', 'Long description with tip'];
const INFOBOX_H = [110, 140, 240];          // infobox content height for each callout
const DEFAULT_ATTR = 402;                   // height="402px" written at build time
const MODE_KEYS = ['fixed', 'runtime', 'pinned'];
const MODE_LONG = ['Fixed height only', 'Runtime message without pinning', 'Runtime message with pinning'];
const MODE_SHORT = ['Fixed height', 'Message, no pin', 'Message + pin'];
const STEP_TITLES = [
  'Page loads with the default height attribute',
  'The child measures document.body.scrollHeight',
  'The child posts a microsim-resize message',
  "The parent's listener compares event.source",
  'The iframe height changes'
];

// ---------- state ----------
let step = 1;                  // 1..5
let iframeH = DEFAULT_ATTR;    // current iframe height on the parent page
let messages = [];             // {n, height, delivered, why}
let selectedMsg = -1;          // index of the message whose fields are shown
let lastControlsY = null;      // for the jump readout
let jump = 0;
let calloutIdx = 0;
let msgRows = [];              // hit boxes for message rows

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  backButton = createButton('Back');
  backButton.parent(document.querySelector('main'));
  backButton.mousePressed(goBack);

  nextButton = createButton('Next step');
  nextButton.parent(document.querySelector('main'));
  nextButton.mousePressed(goNext);

  calloutSelect = createSelect();
  calloutSelect.parent(document.querySelector('main'));
  CALLOUTS.forEach(c => calloutSelect.option(c));
  calloutSelect.selected(CALLOUTS[0]);
  calloutSelect.changed(calloutChanged);

  modeRadio = createRadio('mode');
  modeRadio.parent(document.querySelector('main'));
  for (let i = 0; i < 3; i++) modeRadio.option(MODE_KEYS[i], MODE_LONG[i]);
  modeRadio.selected('runtime');
  modeRadio.changed(resetProtocol);

  listenerCheckbox = createCheckbox('Parent listener installed', true);
  listenerCheckbox.parent(document.querySelector('main'));
  listenerCheckbox.changed(resetProtocol);

  allowanceSlider = createSlider(0, 40, 30, 1);
  allowanceSlider.parent(document.querySelector('main'));
  allowanceSlider.input(resetProtocol);

  [backButton, nextButton, calloutSelect, modeRadio, listenerCheckbox].forEach(c => c.style('font-size', '15px'));
  positionControls();
  lastControlsY = controlsY();

  describe('Iframe Resize Message Stepper. The left panel shows a MicroSim (the child) with an ' +
    'image area, an infobox and a control row. The right panel shows the chapter page (the ' +
    'parent) with the iframe drawn as an outline around the child and a list of messages ' +
    'received. Next step and Back walk through the five steps of the auto-height protocol. ' +
    'The Mode radio compares a fixed height, a runtime resize message, and a runtime message ' +
    'with a pinned infobox; the Callout menu changes the infobox text so learners can see ' +
    'whether the controls are clipped, jump, or stay in place.', LABEL);
}

// ---------- derived values ----------
function mode() { return modeRadio.value() || 'runtime'; }
function infoboxBoxH() { return mode() === 'pinned' ? max(INFOBOX_H) : INFOBOX_H[calloutIdx]; }
function scrollH() { return LAYOUT_H + infoboxBoxH() + CONTROLS_H; }
function controlsY() { return LAYOUT_H + infoboxBoxH(); }
function postedH() { return scrollH() + allowanceSlider.value(); }
function reports() { return mode() !== 'fixed'; }
function listening() { return listenerCheckbox.checked(); }

// ---------- control handlers ----------
function resetProtocol() {
  step = 1;
  iframeH = DEFAULT_ATTR;
  messages = [];
  selectedMsg = -1;
  jump = 0;
  lastControlsY = controlsY();
}

function goNext() {
  if (step >= 5) return;
  step++;
  if (step === 3 && reports()) {
    messages.push({ n: messages.length + 1, height: postedH(), delivered: listening(),
      why: 'initial report after load' });
  }
  if (step === 5 && reports() && listening()) iframeH = postedH();
}

function goBack() {
  if (step <= 1) return;
  if (step === 5) iframeH = DEFAULT_ATTR;
  if (step === 3) { messages = []; selectedMsg = -1; }
  step--;
}

function calloutChanged() {
  calloutIdx = CALLOUTS.indexOf(calloutSelect.value());
  const newY = controlsY();
  jump = newY - lastControlsY;
  lastControlsY = newY;
  // after the protocol has run, a runtime child re-reports whenever its height changes
  // (a ResizeObserver). With pinning the height does not change, so nothing is sent.
  if (step === 5 && reports()) {
    const h = postedH();
    const lastSent = messages.length ? messages[messages.length - 1].height : null;
    if (h !== lastSent) {
      messages.push({ n: messages.length + 1, height: h, delivered: listening(),
        why: 're-report after the callout changed' });
      if (listening()) iframeH = h;
    }
  }
}

// ---------- layout of controls ----------
function positionControls() {
  const y1 = drawHeight + 8, y2 = drawHeight + 44, y3 = drawHeight + 80;
  backButton.position(10, y1);
  nextButton.position(66, y1);
  calloutSelect.position(240, y1);
  modeRadio.position(62, y2);
  const labels = canvasWidth >= 680 ? MODE_LONG : MODE_SHORT;
  modeRadio.elt.querySelectorAll('span').forEach((sp, i) => {
    if (labels[i] && sp.innerHTML !== labels[i]) sp.innerHTML = labels[i];
  });
  listenerCheckbox.position(10, y3);
  sliderLeftMargin = canvasWidth >= 560 ? 445 : 340;
  allowanceSlider.position(sliderLeftMargin, y3);
  allowanceSlider.size(max(60, canvasWidth - sliderLeftMargin - 20));
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
  text('Iframe Resize Message Stepper', margin, 8);
  textStyle(NORMAL);

  drawBanner(margin, 36, canvasWidth - 2 * margin, 78);

  const top = 122;
  const wide = canvasWidth >= 700;
  let child, parent, s;
  if (wide) {
    const cw = floor(canvasWidth * 0.42);
    child = { x: margin, y: top, w: cw - margin - 4, h: drawHeight - top - margin };
    parent = { x: cw + 4, y: top, w: canvasWidth - cw - margin - 4, h: drawHeight - top - margin };
    s = 0.44;
  } else {
    // stacked: child above parent; both shrink
    const ch = 150;
    child = { x: margin, y: top, w: canvasWidth - 2 * margin, h: ch };
    parent = { x: margin, y: top + ch + 6, w: canvasWidth - 2 * margin, h: drawHeight - top - ch - 6 - margin };
    s = 0.2;
  }
  drawChildPanel(child, s, wide);
  drawParentPanel(parent, s, wide);

  // control-region labels
  noStroke();
  fill('black');
  textSize(15);
  textAlign(LEFT, CENTER);
  text('Callout:', 180, drawHeight + 20);
  text('Mode:', 10, drawHeight + 56);
  const lab = (canvasWidth >= 560 ? 'Iframe border allowance: ' : 'Allowance: ') + allowanceSlider.value() + ' px';
  text(lab, 222, drawHeight + 92);
}

// ---------- step banner ----------
function drawBanner(x, y, w, h) {
  stroke('steelblue');
  fill('white');
  rect(x, y, w, h, 6);
  noStroke();
  textAlign(LEFT, TOP);
  fill('steelblue');
  textSize(15);
  textStyle(BOLD);
  text('Step ' + step + ' of 5: ' + STEP_TITLES[step - 1], x + 8, y + 6, w - 16, 20);
  textStyle(NORMAL);
  const [msg, code] = bannerText();
  fill('black');
  textSize(13);
  text(msg, x + 8, y + 26, w - 16, 34);
  if (code) {
    textFont('monospace');
    textSize(12);
    fill('darkslateblue');
    text(code, x + 8, y + h - 17, w - 16, 16);
    textFont('sans-serif');
  }
}

function bannerText() {
  const m = mode();
  const sh = scrollH(), ph = postedH(), a = allowanceSlider.value();
  if (step === 1) {
    return ['The iframe starts at the height written into the page at build time. ' +
      (m === 'fixed' ? 'In Fixed height only mode this is the only height it will ever have.'
        : 'A runtime message may replace it after the child loads.'),
      '<iframe src=".../main.html" height="' + DEFAULT_ATTR + 'px" scrolling="no">'];
  }
  if (m === 'fixed') {
    return ['Skipped: in Fixed height only mode the child has no height reporter, so nothing is ' +
      'measured or sent and the iframe stays at ' + DEFAULT_ATTR + ' px.', ''];
  }
  if (step === 2) {
    return ['After layout settles the child adds up its content: image area ' + LAYOUT_H +
      ' + infobox ' + infoboxBoxH() + ' + controls ' + CONTROLS_H + ' = ' + sh + ' px.' +
      (m === 'pinned' ? ' The infobox is pinned to its worst case (min-height 240 px).' : ''),
      'const height = document.body.scrollHeight + ' + a + ';   // ' + sh + ' + ' + a + ' = ' + ph];
  }
  if (step === 3) {
    return ['The child sends the number to the embedding page. Target origin "*" means any ' +
      'origin, which is acceptable when the book is served from one GitHub Pages origin.',
      "window.parent.postMessage({ type: 'microsim-resize', height: " + ph + " }, '*');"];
  }
  if (step === 4) {
    if (!listening()) {
      return ['No listener is installed on the parent page, so the message event arrives and ' +
        'nothing handles it. no listener: iframe height unchanged.', ''];
    }
    return ['The type is "microsim-resize" and the height is a positive number, so the listener ' +
      'loops over the page iframes: iframe 1 contentWindow is not event.source; iframe 2 is, so ' +
      'it is the sender.', 'if (iframe.contentWindow === event.source) { ... break; }'];
  }
  if (!listening()) {
    return ['no listener: iframe height unchanged. The iframe keeps height="' + DEFAULT_ATTR +
      'px"; the message was sent but no code on the page acted on it.', ''];
  }
  return ['The listener sets the style and the attribute (themes read one or the other). ' +
    'Now change the Callout and watch the controls.',
    "iframe.style.height = '" + iframeH + "px'; iframe.setAttribute('height', " + iframeH + ");"];
}

// ---------- the child MicroSim, drawn at scale s ----------
function drawMini(x, y, w, s, withLabels) {
  const ib = infoboxBoxH();
  const content = INFOBOX_H[calloutIdx];
  // image + label panels
  stroke('gray');
  fill('honeydew');
  rect(x, y, w, LAYOUT_H * s);
  noStroke();
  fill('seagreen');
  const cx = x + w * 0.35, cy = y + LAYOUT_H * s * 0.5;
  ellipse(cx, cy, min(w * 0.35, LAYOUT_H * s * 0.75), LAYOUT_H * s * 0.6);
  fill('darkorange');
  for (let k = 0; k < 3; k++) circle(cx - w * 0.1 + k * w * 0.1, cy - 6 + k * 5, 7);
  // infobox (box height ib, text content height content)
  const iy = y + LAYOUT_H * s;
  stroke('gray');
  fill('white');
  rect(x, iy, w, ib * s);
  if (ib > content) {                    // reserved whitespace from pinning
    noStroke();
    fill(210);
    rect(x + 1, iy + content * s, w - 2, (ib - content) * s - 1);
  }
  // text lines standing in for the callout text
  noStroke();
  fill('dimgray');
  const lines = floor((content * s - 6) / 7);
  for (let k = 0; k < lines; k++) {
    const lw = (k === lines - 1) ? w * 0.45 : w * 0.85;
    rect(x + 6, iy + 5 + k * 7, lw, 3);
  }
  // control row
  const ry = iy + ib * s;
  stroke('gray');
  fill('white');
  rect(x, ry, w, CONTROLS_H * s);
  noStroke();
  fill('steelblue');
  const bh = max(6, CONTROLS_H * s * 0.55);
  rect(x + 6, ry + (CONTROLS_H * s - bh) / 2, 34, bh, 3);
  rect(x + 46, ry + (CONTROLS_H * s - bh) / 2, 34, bh, 3);
  if (withLabels && s >= 0.3) {
    textSize(11);
    const tag = (label, ty, alignV) => {
      const tw = fontWidth(label) + 6;
      noStroke();
      fill(255, 255, 255, 220);
      rect(x + w - tw - 2, ty - (alignV === CENTER ? 7 : 1), tw, 14);
      fill('black');
      textAlign(RIGHT, alignV);
      text(label, x + w - 4, ty);
    };
    tag('image area ' + LAYOUT_H, y + 3, TOP);
    tag('infobox ' + ib + (ib > content ? ' (pinned)' : ''), iy + 3, TOP);
    tag('controls ' + CONTROLS_H, ry + CONTROLS_H * s / 2, CENTER);
  }
  return y + scrollH() * s;
}

function drawChildPanel(r, s, wide) {
  stroke('silver');
  fill('white');
  rect(r.x, r.y, r.w, r.h, 8);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(15);
  textStyle(BOLD);
  text('Child (MicroSim)', r.x + 8, r.y + 6);
  textStyle(NORMAL);

  const mx = r.x + 10;
  const mw = wide ? r.w - 100 : r.w * 0.38;
  const my = r.y + 28;
  const bottom = drawMini(mx, my, mw, s, wide);

  // measurement bracket (steps 2+ in runtime modes)
  const measured = step >= 2 && reports();
  const bx = mx + mw + 8;
  stroke(measured ? 'purple' : 'lightgray');
  strokeWeight(measured ? 2 : 1);
  line(bx, my, bx, bottom);
  line(bx - 4, my, bx + 4, my);
  line(bx - 4, bottom, bx + 4, bottom);
  strokeWeight(1);
  noStroke();
  fill(measured ? 'purple' : 'dimgray');
  textSize(12);
  textAlign(LEFT, CENTER);
  const mlabel = measured ? 'scrollHeight\n' + scrollH() + ' px' : 'not\nmeasured';
  text(mlabel, bx + 6, (my + bottom) / 2);

  // readout: where the controls sit, and how far they jumped
  const cy = controlsY();
  let read = 'Controls top: y = ' + cy + ' px';
  let col = 'black';
  if (mode() === 'pinned') {
    read += '  (moved 0 px)';
    col = 'darkgreen';
  } else if (jump !== 0) {
    read += '  (jumped ' + (jump > 0 ? '+' : '') + jump + ' px)';
    col = 'firebrick';
  }
  let note = '';
  if (mode() === 'pinned' && infoboxBoxH() > INFOBOX_H[calloutIdx]) {
    note = 'Gray band: ' + (infoboxBoxH() - INFOBOX_H[calloutIdx]) + ' px reserved whitespace';
  } else if (mode() === 'pinned') {
    note = 'Worst-case callout: no reserved whitespace';
  } else if (mode() === 'runtime') {
    note = 'Unpinned: the infobox grows and shrinks';
  } else {
    note = 'No reporter: the child never measures';
  }
  fill(col);
  textSize(wide ? 13 : 12);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  const ry = wide ? r.y + r.h - 40 : r.y + 28;
  const rx = wide ? r.x + 8 : r.x + r.w * 0.38 + 104;
  const rw = wide ? r.w - 16 : r.w - (rx - r.x) - 6;
  text(read, rx, ry, rw, wide ? 18 : 48);
  textStyle(NORMAL);
  fill('dimgray');
  text(note, rx, ry + (wide ? 18 : 50), rw, wide ? 18 : 60);
}

// ---------- the parent page ----------
function drawParentPanel(r, s, wide) {
  stroke('silver');
  fill('white');
  rect(r.x, r.y, r.w, r.h, 8);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(15);
  textStyle(BOLD);
  text('Parent (chapter page)', r.x + 8, r.y + 6);
  textStyle(NORMAL);

  // a line of chapter text above the iframe
  const px = r.x + 10;
  const pw = wide ? r.w - 110 : r.w * 0.38;
  fill('lightgray');
  rect(px, r.y + 28, pw * 0.9, 4);

  // iframe outline with the child inside, clipped at the iframe height
  const fy = r.y + 38;
  const fh = iframeH * s;
  const content = scrollH();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(px, fy, pw, fh);
  drawingContext.clip();
  drawMini(px, fy, pw, s, false);
  drawingContext.restore();

  // clipped-region marker: content below the iframe edge is hidden
  if (content > iframeH) {
    const cy0 = fy + fh, cy1 = fy + content * s;
    fill(255, 0, 0, 40);
    stroke('red');
    drawingContext.setLineDash([4, 3]);
    rect(px, cy0, pw, cy1 - cy0);
    drawingContext.setLineDash([]);
    noStroke();
    fill('firebrick');
    textSize(12);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    if (wide) text('clipped: ' + (content - iframeH) + ' px hidden', px + 4, cy1 + 3, pw, 16);
    textStyle(NORMAL);
  }

  // the iframe border
  noFill();
  stroke('black');
  strokeWeight(2);
  rect(px, fy, pw, fh);
  strokeWeight(1);

  // iframe height label to the right of the frame
  noStroke();
  fill('black');
  textSize(12);
  textAlign(LEFT, TOP);
  const lx = px + pw + 6;
  const hlabel = 'iframe\n' + iframeH + ' px' + (iframeH === DEFAULT_ATTR ? '\n(default)' : '');
  if (wide) {
    text(hlabel, lx, fy + 2);
  } else {
    textAlign(RIGHT, TOP);
    text('iframe ' + iframeH + ' px' + (content > iframeH ? ', clipped ' + (content - iframeH) : ''),
      r.x + r.w - 8, r.y + 8);
    textAlign(LEFT, TOP);
  }

  // chapter text below the iframe: it moves when the iframe height changes
  const below = fy + max(fh, content > iframeH ? content * s + 18 : fh) + 6;
  fill('lightgray');
  rect(px, below, pw * 0.8, 4);

  // messages received
  const my = wide ? below + 12 : r.y + 28;
  const mx = wide ? r.x + 8 : px + pw + 12;
  const mw = wide ? r.w - 16 : r.w - (mx - r.x) - 8;
  const mh = r.y + r.h - my - 6;
  drawMessages(mx, my, mw, mh);
}

function drawMessages(x, y, w, h) {
  msgRows = [];
  stroke('silver');
  fill('whitesmoke');
  rect(x, y, w, h, 6);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(13);
  textStyle(BOLD);
  text(w < 300 ? 'Messages received' : 'Messages received (click one)', x + 6, y + 4, w - 12, 18);
  textStyle(NORMAL);
  if (messages.length === 0) {
    fill('dimgray');
    textSize(12);
    text(mode() === 'fixed' ? 'None: this child never posts.' : 'None yet.', x + 6, y + 22, w - 12, 30);
    return;
  }
  // detail view of the selected message
  if (selectedMsg >= 0 && selectedMsg < messages.length) {
    const m = messages[selectedMsg];
    textFont('monospace');
    textSize(12);
    fill('darkslateblue');
    const lines = [
      '#' + m.n + ' event.data = {',
      "  type: 'microsim-resize',",
      '  height: ' + m.height,
      '}  source: the child window'
    ];
    lines.forEach((ln, k) => text(ln, x + 6, y + 22 + k * 14, w - 12, 14));
    textFont('sans-serif');
    fill(m.delivered ? 'darkgreen' : 'firebrick');
    textSize(12);
    text(m.delivered ? 'handled: iframe set to ' + m.height + ' px'
      : 'no listener: iframe height unchanged', x + 6, y + 22 + 4 * 14 + 2, w - 12, 30);
    msgRows.push({ x: x, y: y, w: w, h: h, idx: -1 });
    return;
  }
  // list view: newest messages that fit, one line each (two when narrow)
  const narrow = w < 300;
  const rowH = narrow ? 30 : 17;
  const fit = max(1, floor((h - 22) / rowH));
  const start = max(0, messages.length - fit);
  textSize(12);
  for (let i = start; i < messages.length; i++) {
    const m = messages[i];
    const ry = y + 22 + (i - start) * rowH;
    fill(m.delivered ? 'darkslateblue' : 'firebrick');
    const status = m.delivered ? m.why : 'no listener: iframe height unchanged';
    const label = narrow ? '#' + m.n + ' height ' + m.height + (m.delivered ? '' : ', no listener')
      : '#' + m.n + ' microsim-resize, height ' + m.height + ' · ' + status;
    text(label, x + 6, ry, w - 12, rowH);
    msgRows.push({ x: x, y: ry - 1, w: w, h: rowH, idx: i });
  }
}

function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight) return;
  for (const r of msgRows) {
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) {
      selectedMsg = r.idx;        // -1 closes the detail view
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
