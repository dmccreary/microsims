// Guarded Call Runtime Toggle - what a guarded and an unguarded instrumentation call do with and
// without the xAPI runtime
// CANVAS_HEIGHT: 720
// Learning objective (Analyze / distinguish): the learner distinguishes a guarded from an
// unguarded instrumentation call by observing what each does when the runtime is present and
// when it is absent (Chapter 17, "The Guarded Call").
// Left: a small bouncing-ball sketch. Right: the sketch's instrumentation code, with the line that
// just ran highlighted, and a status strip. Toggling "Runtime loaded" or the call style reloads the
// sketch; "Move slider" fires one slider input. With the runtime off (the p5.js editor), the
// unguarded LRSSim.create() throws a ReferenceError in setup(), so draw() never runs.
// This file itself calls no runtime: the runtime is simulated, so it also runs in the p5.js editor.

// ---------- Canvas dimensions ----------
// Fixed total height; the drawing/control split is recomputed when the control rows wrap.
let canvasWidth = 800;
let canvasHeight = 720;
let controlHeight = 86;
let drawHeight = canvasHeight - controlHeight;
let margin = 12;
let defaultTextSize = 16;

// Okabe-Ito color-blind-safe tints (RGB)
const OK_C = [0, 115, 85], SKIP_C = [0, 100, 160], ERR_C = [185, 70, 0];
const OK_BG = [214, 240, 230], SKIP_BG = [222, 236, 247], ERR_BG = [251, 225, 205];

// ---------- The two code excerpts ----------
const CODE = {
  unguarded: [
    'let lrs = null, speedEvidence = null;',
    '',
    'function setup() {',
    '  createCanvas(400, 300);',
    '  speedSlider = createSlider(1, 10, 3, 1);',
    '  speedSlider.input(onSpeedInput);',
    "  lrs = LRSSim.create({ name: 'Bouncing Ball' });",
    "  speedEvidence = lrs.slider('speed-slider',",
    "      { name: 'Speed Slider', deadband: 1 });",
    '}',
    '',
    'function onSpeedInput() {',
    '  speed = speedSlider.value();',
    '  speedEvidence.input(speed);',
    '}'
  ],
  guarded: [
    'let lrs = null, speedEvidence = null;',
    '',
    'function setup() {',
    '  createCanvas(400, 300);',
    '  speedSlider = createSlider(1, 10, 3, 1);',
    '  speedSlider.input(onSpeedInput);',
    '  if (window.LRSSim) {',
    "    lrs = LRSSim.create({ name: 'Bouncing Ball' });",
    "    speedEvidence = lrs.slider('speed-slider',",
    "        { name: 'Speed Slider', deadband: 1 });",
    '  }',
    '}',
    '',
    'function onSpeedInput() {',
    '  speed = speedSlider.value();',
    '  if (lrs) speedEvidence.input(speed);',
    '}'
  ]
};
// line indexes that matter in each excerpt
const LINES = {
  unguarded: { setup: 6, handler: 13 },
  guarded: { setup: 6, handler: 15 }
};

// ---------- Simulated sketch state ----------
let runtimeOn = true;
let style = 'guarded';
let crashed = false;         // setup() threw
let speed = 3;
let ballX = 60, ballY = 80, vx = 1, vy = 0;
let recorded = 0;            // statements the simulated runtime recorded since the last reload
let hiLine = -1, hiKind = 'ok';
let status = { text: 'Runs', kind: 'ok' };
let logLine = '';
let caption = '';
let visited = {};            // which (style, runtime) combinations the learner has tried

// controls
let runtimeBox, styleRadio, moveButton;
let controlItems = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('sans-serif');
  const main = document.querySelector('main');

  runtimeBox = createCheckbox('Runtime loaded (off = the p5.js editor)', true);
  runtimeBox.changed(() => { runtimeOn = runtimeBox.checked(); reloadSketch(); });
  styleRadio = createRadio('callStyle');
  styleRadio.option('unguarded', 'Unguarded lrs.slider(...)');
  styleRadio.option('guarded', 'Guarded if (lrs) ...');
  styleRadio.selected('guarded');
  styleRadio.changed(() => { style = styleRadio.value(); reloadSketch(); });
  moveButton = createButton('Move slider');
  moveButton.mousePressed(moveSlider);
  controlItems = [runtimeBox, moveButton, styleRadio];
  for (const c of controlItems) c.parent(main);
  layoutControls();
  reloadSketch();

  describe('Guarded Call Runtime Toggle. Left: a bouncing ball sketch with a speed slider. Right: the ' +
    'sketch code with one line highlighted and a status strip. A checkbox loads or removes the xAPI ' +
    'runtime (removed simulates the p5.js editor), a radio button chooses an unguarded or a guarded ' +
    'instrumentation call, and Move slider fires one slider input. Without the runtime the guarded sketch ' +
    'keeps running and records nothing, while the unguarded sketch stops with ReferenceError: LRSSim is not defined.');
}

// ---------- Simulation ----------
// Simulate loading the page: setup() runs from the top.
function reloadSketch() {
  visited[style + (runtimeOn ? '-on' : '-off')] = true;
  speed = 3;
  ballX = 60; ballY = 80; vx = 1; vy = 0;
  recorded = 0;
  const L = LINES[style];
  if (runtimeOn) {
    crashed = false;
    hiLine = style === 'guarded' ? L.setup + 1 : L.setup;
    hiKind = 'ok';
    status = { text: 'Runs: the runtime is loaded and lrs was created.', kind: 'ok' };
    logLine = 'Reloaded with the runtime: lrs and speedEvidence are ready. No statement yet.';
    caption = 'The highlighted line created the runtime instance. With the runtime present, both call styles behave the same.';
  } else if (style === 'guarded') {
    crashed = false;
    hiLine = L.setup;
    hiKind = 'skip';
    status = { text: 'Runs: the if (window.LRSSim) block is skipped.', kind: 'ok' };
    logLine = 'Reloaded without the runtime: lrs stays null. Instrumentation is silently off.';
    caption = 'The guard "if (window.LRSSim)" is false in the p5.js editor, so setup() skips the instrumentation and the sketch draws normally.';
  } else {
    crashed = true;
    hiLine = L.setup;
    hiKind = 'err';
    status = { text: 'ReferenceError: LRSSim is not defined', kind: 'err' };
    logLine = 'Reloaded without the runtime: setup() threw at the highlighted line.';
    caption = 'The unguarded line names LRSSim, which does not exist in the p5.js editor. setup() throws, so draw() never starts and the ball never moves.';
  }
  console.log('[guarded-call-runtime-toggle] ' + status.text);
}

function moveSlider() {
  const prev = speed;
  speed = speed >= 9 ? 2 : speed + 1;
  const L = LINES[style];
  hiLine = L.handler;
  if (crashed) {
    // setup() threw after createSlider(), so the slider exists and its handler still fires,
    // but speedEvidence is null and draw() is not running.
    hiKind = 'err';
    status = { text: "TypeError: Cannot read properties of null (reading 'input')", kind: 'err' };
    logLine = 'Slider moved to ' + speed + ', but the handler threw too. No statement; the ball stays stopped.';
    caption = 'speedEvidence was never created because setup() stopped at LRSSim.create(). The unguarded handler line now fails as well.';
  } else if (runtimeOn) {
    recorded++;
    hiKind = 'ok';
    status = { text: 'Runs: one statement recorded.', kind: 'ok' };
    logLine = 'Recorded (Full mode): interacted .../sims/bouncing-ball/#speed-slider  value ' + speed + ', previous-value ' + prev;
    caption = 'The highlighted line passed the new value to the slider handle, which built one interacted statement.' +
      (style === 'guarded' ? ' The guard "if (lrs)" was true, so the call ran.' : '');
  } else {
    hiKind = 'skip';
    status = { text: 'Runs: nothing recorded, lrs is null.', kind: 'ok' };
    logLine = 'Slider moved to ' + speed + ': the ball speeds up. No statement, because "if (lrs)" skipped the call.';
    caption = 'The guard "if (lrs)" is false without the runtime, so the instrumentation call is skipped and the slider still works.';
  }
  console.log('[guarded-call-runtime-toggle] ' + logLine);
}

// ---------- Layout ----------
function narrow() { return canvasWidth < 500; }

function layoutControls() {
  const rowH = 34;
  for (const el of controlItems) if (el.elt.style.position !== 'absolute') el.position(0, drawHeight);
  // row 1: checkbox + button (button wraps if needed); next row(s): radio
  const cbW = runtimeBox.elt.offsetWidth || 280, btW = moveButton.elt.offsetWidth || 100;
  const wrapBtn = 10 + cbW + 14 + btW > canvasWidth - 10;
  const radioW = styleRadio.elt.offsetWidth || 400;
  const radioRows = 10 + 80 + radioW > canvasWidth - 10 ? 2 : 1;   // 80 px for the "Call style:" label
  const rows = (wrapBtn ? 2 : 1) + radioRows;
  controlHeight = rows * rowH + 16 + (radioRows === 2 ? 6 : 0);
  drawHeight = canvasHeight - controlHeight;
  runtimeBox.position(10, drawHeight + 12);
  moveButton.position(wrapBtn ? 10 : 10 + cbW + 14, wrapBtn ? drawHeight + 10 + rowH : drawHeight + 8);
  const ry = drawHeight + 12 + (wrapBtn ? 2 : 1) * rowH;
  styleRadio.position(radioRows === 2 ? 10 : 90, radioRows === 2 ? ry + 18 : ry);
  styleRadio.style('width', radioRows === 2 ? (canvasWidth - 20) + 'px' : 'auto');
}

// ---------- Drawing ----------
function draw() {
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(narrow() ? 19 : 22);
  text('Guarded Call Runtime Toggle', margin, 9);
  textStyle(NORMAL);

  const W = canvasWidth - 2 * margin;
  let ball, code, strip, log, cap;
  if (narrow()) {
    ball = { x: margin, y: 40, w: W, h: 124 };
    const codeH = CODE.guarded.length * 14 + 14;
    code = { x: margin, y: ball.y + ball.h + 8, w: W, h: codeH };
    strip = { x: margin, y: code.y + code.h + 4, w: W, h: 30 };
    log = { x: margin, y: strip.y + strip.h + 8, w: W, h: 52 };
    cap = { x: margin, y: log.y + log.h + 8, w: W, h: drawHeight - 8 - (log.y + log.h + 8) };
  } else {
    const half = floor((W - 12) * 0.42);           // the code gets the wider column
    const codeH = CODE.guarded.length * 18 + 16;
    code = { x: margin + half + 12, y: 42, w: W - half - 12, h: codeH };
    strip = { x: code.x, y: code.y + code.h + 6, w: code.w, h: 34 };
    ball = { x: margin, y: 42, w: half, h: 230 };
    log = { x: margin, y: ball.y + ball.h + 8, w: half, h: strip.y + strip.h - (ball.y + ball.h + 8) };
    cap = { x: margin, y: strip.y + strip.h + 10, w: W, h: drawHeight - 8 - (strip.y + strip.h + 10) };
  }
  drawBall(ball);
  drawCode(code);
  drawStrip(strip);
  drawLog(log);
  drawCaption(cap);
  drawControlLabels();
}

function drawBall(r) {
  stroke('silver');
  fill('white');
  rect(r.x, r.y, r.w, r.h, 8);
  noStroke();
  fill('dimgray');
  textSize(12);
  text('Bouncing Ball sketch' + (runtimeOn ? '' : '  (in the p5.js editor)'), r.x + 8, r.y + 6);
  const box = { x: r.x + 8, y: r.y + 24, w: r.w - 16, h: r.h - 58 };
  if (crashed) {
    // setup() threw: the canvas exists but draw() never paints anything
    stroke('gainsboro');
    fill('white');
    rect(box.x, box.y, box.w, box.h, 4);
    noStroke();
    fill(ERR_C);
    textAlign(CENTER, CENTER);
    textSize(narrow() ? 13 : 15);
    textStyle(BOLD);
    text('Stopped', box.x + box.w / 2, box.y + box.h / 2 - 12);
    textStyle(NORMAL);
    textSize(12);
    fill('dimgray');
    text('setup() threw, so draw() never runs', box.x + box.w / 2, box.y + box.h / 2 + 10);
    textAlign(LEFT, TOP);
  } else {
    stroke('lightsteelblue');
    fill('aliceblue');
    rect(box.x, box.y, box.w, box.h, 4);
    // simple bounce: horizontal speed from the slider, gravity vertically
    vy += 0.35;
    ballX += vx * speed * 0.8;
    ballY += vy;
    const rad = 10;
    if (ballX < rad) { ballX = rad; vx = 1; }
    if (ballX > box.w - rad) { ballX = box.w - rad; vx = -1; }
    if (ballY > box.h - rad) { ballY = box.h - rad; vy = -abs(vy) * 0.92; if (abs(vy) < 5) vy = -9; }
    noStroke();
    fill([0, 114, 178]);
    circle(box.x + ballX, box.y + ballY, 2 * rad);
  }
  // slider readout
  const sy = r.y + r.h - 24;
  noStroke();
  fill('black');
  textSize(13);
  text('Speed: ' + speed, r.x + 10, sy);
  const sx = r.x + 86, sw = r.w - 100;
  stroke('gray');
  strokeWeight(3);
  line(sx, sy + 8, sx + sw, sy + 8);
  strokeWeight(1);
  noStroke();
  fill('steelblue');
  circle(sx + (speed - 1) / 9 * sw, sy + 8, 12);
}

function drawCode(r) {
  stroke('silver');
  fill('white');
  rect(r.x, r.y, r.w, r.h, 8);
  const lines = CODE[style];
  // largest monospace size (10-13 px) at which the longest line of either excerpt fits
  const longest = max(CODE.guarded.map(l => l.length));
  const fs = constrain(floor((r.w - 22) / (longest * 0.61)), 10, 13);
  const lh = narrow() ? 14 : 18;
  textFont('monospace');
  textSize(fs);
  let y = r.y + 8;
  lines.forEach((ln, i) => {
    if (i === hiLine) {
      noStroke();
      fill(hiKind === 'err' ? ERR_BG : (hiKind === 'skip' ? SKIP_BG : OK_BG));
      rect(r.x + 3, y - 2, r.w - 6, lh, 3);
      fill(hiKind === 'err' ? ERR_C : (hiKind === 'skip' ? SKIP_C : OK_C));
      rect(r.x + 3, y - 2, 4, lh);
    }
    noStroke();
    const isInstr = /LRSSim|lrs\.|speedEvidence\.|if \(lrs\)/.test(ln);
    fill(isInstr ? [0, 70, 130] : 'black');
    text(fitMono(ln, r.w - 20), r.x + 12, y);
    y += lh;
  });
  textFont('sans-serif');
  noStroke();
  fill('dimgray');
  textSize(11);
  textAlign(RIGHT, TOP);
  text(style === 'guarded' ? 'guarded style' : 'unguarded style', r.x + r.w - 8, r.y + 6);
  textAlign(LEFT, TOP);
}

function drawStrip(r) {
  const err = status.kind === 'err';
  noStroke();
  fill(err ? ERR_BG : OK_BG);
  stroke(err ? ERR_C : OK_C);
  rect(r.x, r.y, r.w, r.h, 6);
  noStroke();
  fill(err ? ERR_C : OK_C);
  textStyle(BOLD);
  // shrink, then wrap to two lines, so the whole message is always visible
  let fs = narrow() ? 12 : 13.5;
  textSize(fs);
  if (fontWidth(status.text) > r.w - 16) { fs = 11.5; textSize(fs); }
  const lines = wrapWords(status.text, r.w - 16).slice(0, 2);
  textAlign(LEFT, CENTER);
  lines.forEach((l, i) => text(l, r.x + 8, r.y + r.h / 2 + (i - (lines.length - 1) / 2) * (fs + 2)));
  textStyle(NORMAL);
  textAlign(LEFT, TOP);
}

function drawLog(r) {
  stroke('silver');
  fill('white');
  rect(r.x, r.y, r.w, r.h, 8);
  noStroke();
  fill('black');
  textSize(narrow() ? 12 : 13);
  textStyle(BOLD);
  text('Statements recorded: ' + recorded, r.x + 10, r.y + 7);
  textStyle(NORMAL);
  fill('dimgray');
  textSize(narrow() ? 11 : 12.5);
  drawWrapped(logLine, r.x + 10, r.y + (narrow() ? 23 : 27), r.w - 20, narrow() ? 13 : 16);
}

function drawCaption(r) {
  stroke('silver');
  fill(255, 255, 255, 235);
  rect(r.x, r.y, r.w, r.h, 8);
  noStroke();
  fill('black');
  textSize(narrow() ? 12.5 : 15);
  let y = drawWrapped(caption, r.x + 10, r.y + 8, r.w - 20, narrow() ? 16 : 20) + 6;
  if (y + 40 < r.y + r.h) {
    fill('dimgray');
    textSize(narrow() ? 11.5 : 13);
    y = drawWrapped('The pattern from Chapter 17: start the instance as null, create it only inside if (window.LRSSim), ' +
      'and write every use as if (lrs). Name it lrs, not x, which p5.js sketches often use for a position.', r.x + 10, y, r.w - 20, narrow() ? 14 : 17) + 8;
  }
  if (y + 96 < r.y + r.h && r.w >= 520) drawOutcomeGrid(r.x + 10, y, r.w - 20);
}

// A 2 x 2 grid of outcomes; a cell is revealed once the learner has tried that combination
function drawOutcomeGrid(x, y, w) {
  const cells = {
    'unguarded-on': 'Runs; one statement per slider move',
    'unguarded-off': 'ReferenceError in setup(); nothing draws',
    'guarded-on': 'Runs; one statement per slider move',
    'guarded-off': 'Runs; records nothing'
  };
  const c0 = 150, cw = (w - c0) / 2, rh = 26;
  noStroke();
  fill('black');
  textSize(12.5);
  textStyle(BOLD);
  text('Outcomes you have observed', x, y);
  text('Runtime loaded', x + c0 + 6, y + 20);
  text('Runtime absent (p5.js editor)', x + c0 + cw + 6, y + 20);
  ['unguarded', 'guarded'].forEach((st, i) => {
    const ry = y + 38 + i * (rh + 4);
    fill('black');
    textStyle(BOLD);
    text(st === 'guarded' ? 'Guarded if (lrs)' : 'Unguarded call', x, ry + 6);
    textStyle(NORMAL);
    ['on', 'off'].forEach((rt, j) => {
      const key = st + '-' + rt;
      const cx = x + c0 + j * cw;
      const cur = style === st && (runtimeOn ? 'on' : 'off') === rt;
      const bad = key === 'unguarded-off';
      stroke(cur ? 'black' : 'gainsboro');
      strokeWeight(cur ? 2 : 1);
      fill(!visited[key] ? 'whitesmoke' : (bad ? ERR_BG : OK_BG));
      rect(cx, ry, cw - 6, rh, 4);
      strokeWeight(1);
      noStroke();
      fill(!visited[key] ? 'gray' : (bad ? ERR_C : OK_C));
      text(visited[key] ? cells[key] : '? try it', cx + 8, ry + 6);
    });
  });
  textStyle(NORMAL);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(14);
  textStyle(BOLD);
  const rb = styleRadio.elt.getBoundingClientRect();
  const cb = document.querySelector('main').getBoundingClientRect();
  const twoRows = (styleRadio.elt.style.width || 'auto') !== 'auto';
  text('Call style:', 10, rb.top - cb.top - (twoRows ? 17 : -3));
  textStyle(NORMAL);
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

function fitMono(s, w) { return fontWidth(s) <= w ? s : fitText(s, w); }

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
