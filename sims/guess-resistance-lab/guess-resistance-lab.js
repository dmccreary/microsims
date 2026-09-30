// Guess Resistance Lab
// CANVAS_HEIGHT: 680
// Compare how easily a pure guesser succeeds on different probe designs.
// A probe has a number of options per item and 1 to 3 chained items that
// must all be right (feedback is for the whole chain, as in Chapter 26).
// The chance of a first-attempt lucky success is 1 / options^chained.
// With "Allow retry until correct", a guesser tries combinations not yet
// tried, so success is guaranteed within options^chained attempts, and only
// the attempt sequence, not the final success, separates a knower from a
// guesser. "Guess randomly" plays one guesser; "Run 1000 guessers" draws a
// histogram of attempts used.

// ---------- canvas layout ----------
// canvasHeight is fixed (it sets the iframe height). When the button row
// wraps at narrow widths the drawing region gives up that height.
let canvasWidth = 700;
let canvasHeight = 680;
let controlHeight = 115;
let drawHeight = canvasHeight - controlHeight;
let margin = 10;
let sliderLeftMargin = 170;
let defaultTextSize = 16;

// ---------- colors ----------
const INK = [30, 30, 30];
const MUTED = [95, 95, 95];
const OK_FILL = [0, 158, 115];       // bluish green (with a check mark)
const BAD_FILL = [213, 94, 0];        // vermillion (with a cross)
const OK_INK = [0, 110, 80];
const BAD_INK = [175, 60, 0];
const CUR = [0, 114, 178];         // current design bar
const REF = [170, 170, 170];       // reference designs

// Reference designs from the chapter's table
const REFERENCES = [
  { name: '4-option item', k: 4 },
  { name: '6-hotspot quiz', k: 6 },
  { name: '2 chained 4-option', k: 16 }
];

// ---------- controls ----------
let optionsSlider, chainSlider, retryBox, guessButton, runButton;

// ---------- state ----------
let options = 4, chained = 1, retry = false;
let target = [];            // correct option index per item
let attempts = [];          // [{picks:[..], ok:bool}] for the current guesser
let shown = 0;              // attempts revealed so far (animation)
let revealTimer = 0;
let hist = null;            // {bins:[{from,to,count,ok}], firstOk, n, K, retry}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  frameRate(30);

  optionsSlider = createSlider(2, 12, 4, 1);
  optionsSlider.parent(document.querySelector('main'));
  optionsSlider.attribute('aria-label', 'Options per item');
  chainSlider = createSlider(1, 3, 1, 1);
  chainSlider.parent(document.querySelector('main'));
  chainSlider.attribute('aria-label', 'Chained items');
  optionsSlider.input(designChanged);
  chainSlider.input(designChanged);

  retryBox = createCheckbox('Allow retry until correct', false);
  retryBox.parent(document.querySelector('main'));
  retryBox.addClass('ctl-row');
  retryBox.changed(designChanged);

  guessButton = createButton('Guess randomly');
  guessButton.parent(document.querySelector('main'));
  guessButton.mousePressed(guessOnce);
  runButton = createButton('Run 1000 guessers');
  runButton.parent(document.querySelector('main'));
  runButton.mousePressed(runMany);

  layoutControls();
  designChanged();
}

function K() { return Math.pow(options, chained); }

function designChanged() {
  options = optionsSlider.value();
  chained = chainSlider.value();
  retry = retryBox.checked();
  target = [];
  for (let i = 0; i < chained; i++) target.push(Math.floor(random(options)));
  attempts = [];
  shown = 0;
  hist = null;
  updateDescription();
}

// ---------- one random guesser ----------
function guessOnce() {
  attempts = [];
  const tried = new Set();
  const k = K();
  const maxAttempts = retry ? k : 1;
  for (let a = 0; a < maxAttempts; a++) {
    // pick uniformly among the combinations not yet tried
    let picks, key;
    do {
      picks = target.map(() => Math.floor(random(options)));
      key = picks.join(',');
    } while (tried.has(key));
    tried.add(key);
    const ok = picks.every((p, i) => p === target[i]);
    attempts.push({ picks, ok });
    if (ok) break;
  }
  shown = 0;
  revealTimer = 0;
  updateDescription();
}

// ---------- 1000 guessers ----------
// Without retry every guesser makes one attempt, which succeeds with
// probability 1/K. With retry, trying untried combinations in random order
// puts the correct one at a uniformly random position, so the attempts used
// are uniform on 1..K. Sampling that position directly is exact.
function runMany() {
  const k = K();
  const n = 1000;
  let firstOk = 0;
  if (!retry) {
    for (let g = 0; g < n; g++) if (random() < 1 / k) firstOk++;
    hist = { retry: false, n, K: k, firstOk, bins: [{ from: 1, to: 1, ok: firstOk, fail: n - firstOk }] };
  } else {
    const nb = Math.min(k, 24);
    const width = Math.ceil(k / nb);
    const bins = [];
    for (let s = 1; s <= k; s += width) bins.push({ from: s, to: Math.min(k, s + width - 1), ok: 0, fail: 0 });
    for (let g = 0; g < n; g++) {
      const used = Math.floor(random(k)) + 1;
      if (used === 1) firstOk++;
      bins[Math.floor((used - 1) / width)].ok++;
    }
    hist = { retry: true, n, K: k, firstOk, bins };
  }
  updateDescription();
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

  // reveal attempts one at a time; long sequences play faster
  if (shown < attempts.length) {
    const step = attempts.length <= 20 ? 6 : Math.max(1, Math.floor(90 / attempts.length));
    revealTimer++;
    if (attempts.length > 90) shown = Math.min(attempts.length, shown + Math.ceil(attempts.length / 90));
    else if (revealTimer >= step) { shown++; revealTimer = 0; }
  }

  const narrow = canvasWidth < 500;
  noStroke();
  fill(INK);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  textSize(narrow ? 19 : 22);
  text('Guess Resistance Lab', canvasWidth / 2, 8);
  textStyle(NORMAL);

  if (!narrow) {
    const lw = Math.floor(canvasWidth * 0.52);
    const leftBottom = drawProbe(margin, 40, lw - margin);
    const msgBottom = drawMessage(margin, leftBottom + 4, lw - margin, drawHeight - 8);
    drawDesignTable(margin, Math.max(msgBottom + 10, drawHeight - 132), lw - margin);
    const rx = lw + 8, rw = canvasWidth - rx - margin;
    const chartH = Math.floor((drawHeight - 40 - 18) / 2);
    drawChanceChart(rx, 40, rw, chartH);
    drawHistogram(rx, 40 + chartH + 10, rw, drawHeight - (40 + chartH + 10) - 8);
  } else {
    const w = canvasWidth - 2 * margin;
    const bottom = drawProbe(margin, 38, w);
    const msgBottom = drawMessage(margin, bottom + 2, w, bottom + 70);
    const cy = Math.max(msgBottom + 4, bottom + 72);
    const half = (w - 8) / 2;
    const ch = drawHeight - cy - 8;
    drawChanceChart(margin, cy, half, ch);
    drawHistogram(margin + half + 8, cy, half, ch);
  }
  drawControlLabels();
}

// Tiles for each chained item, attempts counter and sequence strip.
function drawProbe(x, y, w) {
  const narrow = canvasWidth < 500;
  const perRow = narrow && options > 6 ? Math.ceil(options / 2) : options;
  const labelW = 52;
  const gap = 4;
  const rowsPerItem = Math.ceil(options / perRow);
  const cap = narrow && chained * rowsPerItem > 3 ? 26 : 36;
  const tile = Math.min(cap, Math.floor((w - labelW - (perRow - 1) * gap) / perRow));
  const last = shown > 0 ? attempts[shown - 1] : null;
  textSize(13);
  for (let item = 0; item < chained; item++) {
    noStroke();
    fill(INK);
    textAlign(LEFT, CENTER);
    text('Item ' + (item + 1), x, y + tile / 2);
    for (let o = 0; o < options; o++) {
      const r = Math.floor(o / perRow), c = o % perRow;
      const tx = x + labelW + c * (tile + gap);
      const ty = y + r * (tile + gap);
      const picked = last && last.picks[item] === o;
      const correct = target[item] === o;
      stroke(150);
      strokeWeight(1);
      fill(picked ? (correct ? OK_FILL : BAD_FILL) : 255);
      rect(tx, ty, tile, tile, 4);
      if (correct) {       // the hidden correct tile, outlined for the observer
        noFill();
        stroke(0, 50, 120);
        strokeWeight(2.5);
        drawingContext.setLineDash([4, 3]);
        rect(tx + 2, ty + 2, tile - 4, tile - 4, 3);
        drawingContext.setLineDash([]);
        strokeWeight(1);
      }
      noStroke();
      fill(picked ? 255 : INK);
      textAlign(CENTER, CENTER);
      textSize(tile > 26 ? 13 : 11);
      text(picked ? (correct ? '✓' : '✗') : String.fromCharCode(65 + o), tx + tile / 2, ty + tile / 2);
      textSize(13);
    }
    const rows = Math.ceil(options / perRow);
    y += rows * (tile + gap) + 4;
  }
  noStroke();
  fill(MUTED);
  textSize(12);
  textAlign(LEFT, TOP);
  text('Dashed outline: the hidden correct tile (the guesser cannot see it).', x, y);
  y += 18;

  // counter and sequence strip
  fill(INK);
  textSize(14);
  const k = K();
  const used = shown;
  let counter = 'Attempts used: ' + used;
  if (attempts.length) counter += retry ? ' (retry on: at most ' + k + ')' : ' (one attempt allowed)';
  else counter += '  (press Guess randomly)';
  text(counter, x, y);
  y += 20;
  const sq = 15, sg = 3;
  const perLine = Math.max(1, Math.floor(w / (sq + sg)));
  const maxShow = perLine * 2;
  const seq = attempts.slice(0, shown);
  let drawList = seq;
  let skipped = 0;
  if (seq.length > maxShow) {        // keep the start and the end of a long sequence
    skipped = seq.length - (maxShow - 1);
    drawList = seq.slice(0, maxShow - 2).concat([null]).concat(seq.slice(seq.length - 1));
  }
  drawList.forEach((a, i) => {
    const sx = x + (i % perLine) * (sq + sg);
    const sy = y + Math.floor(i / perLine) * (sq + sg);
    if (a === null) {
      noStroke();
      fill(MUTED);
      textSize(10);
      textAlign(CENTER, CENTER);
      text('…', sx + sq / 2, sy + sq / 2);
      return;
    }
    noStroke();
    fill(a.ok ? OK_FILL : BAD_FILL);
    rect(sx, sy, sq, sq, 2);
    fill(255);
    textSize(10);
    textAlign(CENTER, CENTER);
    text(a.ok ? '✓' : '✗', sx + sq / 2, sy + sq / 2 + 1);
  });
  const lines = Math.max(1, Math.ceil(drawList.length / perLine));
  y += lines * (sq + sg) + 2;
  if (skipped) {
    noStroke();
    fill(MUTED);
    textSize(12);
    textAlign(LEFT, TOP);
    text('(' + skipped + ' wrong attempts hidden in the middle)', x, y);
    y += 16;
  }
  return y;
}

function drawMessage(x, y, w, maxY) {
  const k = K();
  noStroke();
  textAlign(LEFT, TOP);
  textSize(13);
  let msg, ink = INK;
  if (attempts.length && shown === attempts.length) {
    const last = attempts[attempts.length - 1];
    if (!retry) {
      msg = last.ok ? 'Lucky: the guesser was right on its only attempt, a 1 in ' + k + ' chance. Nothing in the record separates it from a knower.'
        : 'The guesser failed its only attempt, as a pure guesser will ' + pct(1 - 1 / k) + ' of the time.';
    } else {
      msg = 'Success on attempt ' + attempts.length + ' of at most ' + k + '. With retry, success is guaranteed within ' + k +
        ' attempts, so only the attempt sequence, not the final success, separates a knower (right on attempt 1) from a guesser.';
    }
  } else if (retry) {
    msg = 'Retry is on: a guesser is guaranteed to succeed within ' + k + ' attempts. Keep the sequence, not only the final success.';
  } else {
    msg = 'One attempt per learner: a pure guesser succeeds 1 time in ' + k + '.';
  }
  fill(ink);
  return wrapText(msg, x, y, w, 16);
}

function pct(p) {
  const v = 100 * p;
  return (v >= 10 ? v.toFixed(0) : v >= 1 ? v.toFixed(1) : v.toFixed(2)) + '%';
}

// Bar chart (horizontal bars): chance of success by pure guessing (first attempt)
function drawChanceChart(x, y, w, h) {
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 6);
  noStroke();
  fill(INK);
  textAlign(LEFT, TOP);
  textSize(13);
  textStyle(BOLD);
  const title = w < 250 ? 'Chance of a lucky first guess' : 'Chance of success by pure guessing (first attempt)';
  let ty = wrapText(title, x + 8, y + 6, w - 16, 15) + 2;
  textStyle(NORMAL);
  const bars = [{ name: 'Your design', k: K(), cur: true }].concat(REFERENCES);
  const plotX = x + 8, plotW = w - 16;
  const avail = y + h - 18 - ty;                 // leave room for the scale line
  const rowH = Math.max(18, Math.min(40, Math.floor(avail / bars.length)));
  const barH = Math.max(4, rowH - 17);
  const maxP = 0.5;                              // bar length: 0 to 50 percent
  bars.forEach((b, i) => {
    const p = 1 / b.k;
    const ry = ty + i * rowH;
    noStroke();
    fill(INK);
    textSize(w < 250 ? 11 : 12);
    textStyle(b.cur ? BOLD : NORMAL);
    textAlign(LEFT, TOP);
    text(fitText(b.name + ' (1 in ' + b.k + '): ' + pct(p), plotW), plotX, ry);
    textStyle(NORMAL);
    fill(238);
    rect(plotX, ry + 14, plotW, barH, 2);
    fill(b.cur ? CUR : REF);
    rect(plotX, ry + 14, Math.max(2, (p / maxP) * plotW), barH, 2);
  });
  // scale
  const sy = ty + bars.length * rowH + 1;
  fill(MUTED);
  textSize(11);
  textAlign(LEFT, TOP);
  text('0%', plotX, sy);
  textAlign(RIGHT, TOP);
  text('50%', plotX + plotW, sy);
}

function fitText(s, w) {
  if (fontWidth(s) <= w) return s;
  while (s.length > 3 && fontWidth(s + '\u2026') > w) s = s.slice(0, -1);
  return s + '\u2026';
}

// The chapter's comparison table, with a row for the current design (wide layout)
function drawDesignTable(x, y, w) {
  const k = K();
  const rows = [
    ['Four-option item', '1 in 4', '4'],
    ['Six-hotspot poster quiz', '1 in 6', '6'],
    ['Two chained four-option items', '1 in 16', '16'],
    ['Your design', '1 in ' + k, retry ? String(k) : 'never (one try)']
  ];
  const c1 = x, c2 = x + w * 0.52, c3 = x + w * 0.75;
  noStroke();
  textAlign(LEFT, TOP);
  textSize(12);
  textStyle(BOLD);
  fill(INK);
  text('Probe design', c1, y + 14);
  text('Lucky guess', c2, y + 14);
  text('Attempts to', c3, y);
  text('guarantee', c3, y + 14);
  textStyle(NORMAL);
  stroke(190);
  line(x, y + 30, x + w, y + 30);
  noStroke();
  rows.forEach((r, i) => {
    const ry = y + 35 + i * 18;
    textStyle(i === 3 ? BOLD : NORMAL);
    fill(i === 3 ? CUR : INK);
    text(r[0], c1, ry);
    text(r[1], c2, ry);
    text(fitText(r[2], x + w - c3), c3, ry);
  });
  textStyle(NORMAL);
  fill(MUTED);
  text(fitText('Reference rows assume retry until correct, as in the chapter\'s table.', w), c1, y + 35 + 4 * 18 + 2);
}

function drawHistogram(x, y, w, h) {
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 6);
  noStroke();
  fill(INK);
  textAlign(LEFT, TOP);
  textSize(13);
  textStyle(BOLD);
  let ty = wrapText(w < 250 ? '1000 guessers: attempts' : '1000 guessers: attempts used', x + 8, y + 6, w - 16, 15);
  textStyle(NORMAL);
  if (!hist) {
    fill(MUTED);
    wrapText('Press Run 1000 guessers to see how many attempts pure guessers use.', x + 8, ty + 4, w - 16, 15);
    return;
  }
  // summary line
  fill(INK);
  textSize(12);
  ty = wrapText('First-attempt successes: ' + hist.firstOk + ' of ' + hist.n + ' (' + pct(hist.firstOk / hist.n) +
    '; expected ' + pct(1 / hist.K) + ')' + (hist.retry ? '. All ' + hist.n + ' succeed within ' + hist.K + ' attempts.' : '.'),
    x + 8, ty + 2, w - 16, 14);
  const top = ty + 4, bottom = y + h - 22;
  const axisX = x + 8, plotW = w - 16;
  const maxC = Math.max(...hist.bins.map(b => b.ok + b.fail));
  // a single bin (no retry) is drawn as one stacked bar, not the full width
  const bw = hist.bins.length === 1 ? Math.min(plotW, 120) : plotW / hist.bins.length;
  const x0 = hist.bins.length === 1 ? axisX + (plotW - bw) / 2 : axisX;
  hist.bins.forEach((b, i) => {
    const bx = x0 + i * bw;
    const hOk = (b.ok / maxC) * (bottom - top);
    const hFail = (b.fail / maxC) * (bottom - top);
    noStroke();
    fill(OK_FILL);
    rect(bx + 1, bottom - hOk, Math.max(1, bw - 2), hOk);
    fill(BAD_FILL);
    rect(bx + 1, bottom - hOk - hFail, Math.max(1, bw - 2), hFail);
  });
  stroke(150);
  line(axisX, bottom, axisX + plotW, bottom);
  noStroke();
  fill(INK);
  textSize(11);
  if (!hist.retry) {
    textAlign(CENTER, TOP);
    text('1 attempt each: green ✓ ' + hist.firstOk + ', vermillion ✗ ' + (hist.n - hist.firstOk), axisX + plotW / 2, bottom + 3);
  } else {
    textAlign(LEFT, TOP);
    text('1', axisX, bottom + 3);
    textAlign(RIGHT, TOP);
    text(hist.K + ' attempts', axisX + plotW, bottom + 3);
  }
}

function drawControlLabels() {
  noStroke();
  fill(INK);
  textSize(15);
  textAlign(LEFT, CENTER);
  text('Options: ' + options, margin, drawHeight + 18);
  text('Chained items: ' + chained, margin, drawHeight + 53);
}

function updateDescription() {
  const k = K();
  let d = 'Guess Resistance Lab. Probe design: ' + options + ' options per item, ' + chained + ' chained item' +
    (chained > 1 ? 's' : '') + ', retry ' + (retry ? 'allowed' : 'not allowed') + '. A pure guess succeeds on the first attempt with probability 1 in ' +
    k + ' (' + pct(1 / k) + '), compared with 1 in 4, 1 in 6 and 1 in 16 for the reference designs.';
  if (retry) d += ' With retry, success is guaranteed within ' + k + ' attempts.';
  if (attempts.length) d += ' Last guesser: ' + attempts.map(a => (a.ok ? 'right' : 'wrong')).join(', ') + '.';
  if (hist) d += ' 1000 guessers: ' + hist.firstOk + ' succeeded on the first attempt.';
  describe(d);
}

// ---------- layout ----------
// Rows 1-2: the two sliders. Row 3: checkbox and buttons, wrapping to a
// fourth row at narrow widths; the drawing region gives up that height.
function layoutControls() {
  if (!runButton) return;
  sliderLeftMargin = 150;
  const full = canvasWidth - sliderLeftMargin - 2 * margin;
  const items = [retryBox, guessButton, runButton];
  let x = margin, row = 0;
  const placed = [];
  items.forEach(el => {
    const w = el.elt.offsetWidth;
    if (x > margin && x + w > canvasWidth - margin) { row++; x = margin; }
    placed.push({ el, x, row });
    x += w + 10;
  });
  const rows = 2 + row + 1;
  controlHeight = rows * 35 + 10;
  drawHeight = canvasHeight - controlHeight;
  optionsSlider.position(sliderLeftMargin, drawHeight + 8);
  optionsSlider.size(full);
  chainSlider.position(sliderLeftMargin, drawHeight + 43);
  chainSlider.size(full);
  placed.forEach(p => p.el.position(p.x, drawHeight + 76 + p.row * 35));
}

// wrapText with optional centering (for bar labels)
function wrapText(str, x, y, w, lh, maxLines, center) {
  const words = str.split(' ');
  let line = '';
  const out = [];
  for (const word of words) {
    const t = line ? line + ' ' + word : word;
    if (fontWidth(t) > w && line) { out.push(line); line = word; } else line = t;
  }
  if (line) out.push(line);
  out.forEach(L => { text(L, center ? x + w / 2 : x, y); y += lh; });
  return y;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  layoutControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.max(300, container.offsetWidth);
}
