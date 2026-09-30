// AUC Pair Explorer - p5.js MicroSim
// CANVAS_HEIGHT: 580
// AUC two ways: as the area under the ROC curve and as the chance that a randomly chosen
// successful learner has a higher forecast than a randomly chosen unsuccessful one (ties = half).
// Synthetic cohort of 40 learners: 24 answered the held-out item correctly, 16 did not.
// Each learner has a fixed seeded normal draw z. Evidence score = z + delta/2 for successful
// learners and z - delta/2 for unsuccessful ones, delta = 1.516 x signal strength, and the
// forecast is 1 / (1 + exp(-(logit(0.6) + score))). Only the ranking matters for AUC.
// The draws come in +z / -z pairs inside each group, so at signal 0 both groups have the same,
// symmetric scores and the AUC is exactly 0.5. Seed 6 gives AUC 0.742 at the default signal
// 0.6, close to the chapter's synthetic BKT value of 0.743.
// Colors: Okabe-Ito bluish green (correct, circles) and orange (incorrect, squares).

// ---------- canvas layout ----------
let canvasWidth = 400;
let canvasHeight = 580;          // must equal CANVAS_HEIGHT above
let controlHeight = 80;          // recomputed by layoutControls()
let drawHeight = canvasHeight - controlHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;
let rowStep = 34;

const GREEN = [0, 158, 115];
const ORANGE = [230, 159, 0];
const INK = [30, 30, 30];
const AREA = [86, 180, 233];     // Okabe-Ito sky blue for the area under the curve
const SEED = 6;
const SEPARATION_D = 1.516;
const N_POS = 24, N_NEG = 16;

// ---------- state ----------
let baseZ = [];                  // { z, correct }
let learners = [];               // { f, correct }
let aucValue = 0.5;
let roc = [];
let pairsDrawn = 0, pairsWon = 0;
let history = [];                // running fraction after each draw
let lastPair = null;             // { pos, neg, result }
let cutoffSlider, signalSlider, pairButton, hundredButton;
let geo = null;

// ---------- Mersenne Twister matching Python's random.Random(intSeed).random() ----------
function PyRandom(seed) {
  const N = 624, M = 397;
  const mt = new Uint32Array(N);
  let mti = N + 1;
  function initGenrand(s) {
    mt[0] = s >>> 0;
    for (mti = 1; mti < N; mti++) {
      const prev = mt[mti - 1] ^ (mt[mti - 1] >>> 30);
      mt[mti] = (Math.imul(1812433253, prev) + mti) >>> 0;
    }
  }
  function initByArray(key) {
    initGenrand(19650218);
    let i = 1, j = 0;
    for (let k = Math.max(N, key.length); k > 0; k--) {
      const prev = mt[i - 1] ^ (mt[i - 1] >>> 30);
      mt[i] = ((mt[i] ^ Math.imul(prev, 1664525)) + key[j] + j) >>> 0;
      i++; j++;
      if (i >= N) { mt[0] = mt[N - 1]; i = 1; }
      if (j >= key.length) j = 0;
    }
    for (let k = N - 1; k > 0; k--) {
      const prev = mt[i - 1] ^ (mt[i - 1] >>> 30);
      mt[i] = ((mt[i] ^ Math.imul(prev, 1566083941)) - i) >>> 0;
      i++;
      if (i >= N) { mt[0] = mt[N - 1]; i = 1; }
    }
    mt[0] = 0x80000000;
  }
  function genrandInt32() {
    let y;
    if (mti >= N) {
      let kk;
      for (kk = 0; kk < N - M; kk++) {
        y = (mt[kk] & 0x80000000) | (mt[kk + 1] & 0x7fffffff);
        mt[kk] = mt[kk + M] ^ (y >>> 1) ^ ((y & 1) ? 0x9908b0df : 0);
      }
      for (; kk < N - 1; kk++) {
        y = (mt[kk] & 0x80000000) | (mt[kk + 1] & 0x7fffffff);
        mt[kk] = mt[kk + (M - N)] ^ (y >>> 1) ^ ((y & 1) ? 0x9908b0df : 0);
      }
      y = (mt[N - 1] & 0x80000000) | (mt[0] & 0x7fffffff);
      mt[N - 1] = mt[M - 1] ^ (y >>> 1) ^ ((y & 1) ? 0x9908b0df : 0);
      mti = 0;
    }
    y = mt[mti++];
    y ^= (y >>> 11);
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= (y >>> 18);
    return y >>> 0;
  }
  initByArray([seed >>> 0]);
  return function () {
    const a = genrandInt32() >>> 5, b = genrandInt32() >>> 6;
    return (a * 67108864 + b) / 9007199254740992;
  };
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // seeded normal draws, in +z / -z pairs within each group
  const r = PyRandom(SEED);
  const normal = () => {
    const u1 = 1 - r(), u2 = r();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  };
  for (let i = 0; i < N_POS / 2; i++) { const z = normal(); baseZ.push({ z, correct: true }, { z: -z, correct: true }); }
  for (let i = 0; i < N_NEG / 2; i++) { const z = normal(); baseZ.push({ z, correct: false }, { z: -z, correct: false }); }

  pairButton = createButton('Draw random pair');
  pairButton.mousePressed(() => drawPairs(1));
  hundredButton = createButton('Draw 100 pairs');
  hundredButton.mousePressed(() => drawPairs(100));
  cutoffSlider = createSlider(0, 1, 0.5, 0.01);
  signalSlider = createSlider(0, 1, 0.6, 0.01);
  signalSlider.input(() => { buildCohort(); resetPairs(); });
  for (const el of [pairButton, hundredButton, cutoffSlider, signalSlider]) el.parent(document.querySelector('main'));

  buildCohort();
  layoutControls();

  describe('Left: 40 synthetic learners as dots along a forecast axis from 0 to 1, green circles for correct ' +
    'held-out answers above the axis and orange squares for incorrect ones below, with a movable cutoff line. ' +
    'Below it, a running fraction of random green-orange pairs won by the model. Right: the ROC curve with the ' +
    'area under it shaded and a point for the current cutoff. The AUC readout equals the share of all 384 ' +
    'green-orange pairs in which the green learner has the higher forecast.');
}

// ---------- model ----------
function buildCohort() {
  const delta = SEPARATION_D * signalSlider.value();
  const logitBase = Math.log(0.6 / 0.4);
  learners = baseZ.map(b => {
    const score = b.z + (b.correct ? delta / 2 : -delta / 2);
    return { f: 1 / (1 + Math.exp(-(logitBase + score))), correct: b.correct };
  });
  aucValue = pairAUC();
  roc = rocPoints();
  lastPair = null;
}

function pairAUC() {
  const pos = learners.filter(l => l.correct), neg = learners.filter(l => !l.correct);
  let wins = 0;
  for (const a of pos) for (const b of neg) wins += a.f > b.f ? 1 : (a.f === b.f ? 0.5 : 0);
  return wins / (pos.length * neg.length);
}

function rates(c) {
  const tp = learners.filter(l => l.correct && l.f >= c).length;
  const fp = learners.filter(l => !l.correct && l.f >= c).length;
  return { tp, fp, tpr: tp / N_POS, fpr: fp / N_NEG };
}

function rocPoints() {
  const cuts = [...new Set(learners.map(l => l.f))].sort((a, b) => b - a);
  const pts = [{ fpr: 0, tpr: 0 }];
  for (const c of cuts) {
    const r = rates(c);
    pts.push({ fpr: r.fpr, tpr: r.tpr });
  }
  pts.push({ fpr: 1, tpr: 1 });
  return pts;
}

function resetPairs() {
  pairsDrawn = 0;
  pairsWon = 0;
  history = [];
  lastPair = null;
}

function drawPairs(n) {
  const pos = learners.map((l, i) => i).filter(i => learners[i].correct);
  const neg = learners.map((l, i) => i).filter(i => !learners[i].correct);
  for (let k = 0; k < n; k++) {
    const a = pos[Math.floor(Math.random() * pos.length)];
    const b = neg[Math.floor(Math.random() * neg.length)];
    const fa = learners[a].f, fb = learners[b].f;
    const result = fa > fb ? 1 : (fa === fb ? 0.5 : 0);
    pairsDrawn++;
    pairsWon += result;
    history.push(pairsWon / pairsDrawn);
    lastPair = { pos: a, neg: b, result };
  }
  console.log('[fidelity-auc-pair-explorer] drew ' + n + ' pair(s): ' + pairsWon + ' won of ' + pairsDrawn +
    ' (' + (pairsWon / pairsDrawn).toFixed(3) + '), AUC ' + aucValue.toFixed(3));
}

// ---------- layout ----------
function computeGeometry() {
  const wide = canvasWidth >= 640;
  const g = { wide };
  const top = 36;
  if (wide) {
    const half = canvasWidth / 2;
    g.strip = { x: 10, y: top, w: half - 15, h: 236 };
    g.conv = { x: 10, y: top + 244, w: half - 15, h: drawHeight - top - 252 };
    g.rocPanel = { x: half + 5, y: top, w: canvasWidth - half - 15, h: drawHeight - top - 8 };
  } else {
    const avail = drawHeight - top - 8;
    g.strip = { x: 6, y: top, w: canvasWidth - 12, h: Math.round(avail * 0.37) };
    const rocH = Math.round(avail * 0.34);
    g.rocPanel = { x: 6, y: top + g.strip.h + 6, w: canvasWidth - 12, h: rocH };
    g.conv = { x: 6, y: g.rocPanel.y + rocH + 6, w: canvasWidth - 12, h: drawHeight - 8 - (g.rocPanel.y + rocH + 6) };
  }
  // strip internals
  const s = g.strip;
  g.sx0 = s.x + 24;
  g.sx1 = s.x + s.w - 24;
  g.axisY = s.y + s.h * 0.55;
  g.dot = wide ? 12 : 10;
  return g;
}

function stripX(f) { return map(f, 0, 1, geo.sx0, geo.sx1); }

// beeswarm-style stacking: dots in a lane move away from the axis until they do not overlap
function dotPositions() {
  const pos = new Array(learners.length);
  for (const correct of [true, false]) {
    const placed = [];
    const idx = learners.map((l, i) => i).filter(i => learners[i].correct === correct)
      .sort((a, b) => learners[a].f - learners[b].f);
    for (const i of idx) {
      const x = stripX(learners[i].f);
      let level = 0;
      while (placed.some(p => p.level === level && Math.abs(p.x - x) < geo.dot + 1)) level++;
      placed.push({ x, level });
      const dy = (geo.dot / 2 + 4) + level * (geo.dot + 1);
      pos[i] = { x, y: correct ? geo.axisY - dy : geo.axisY + dy };
    }
  }
  return pos;
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

  geo = computeGeometry();
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(geo.wide ? 21 : 18);
  text('AUC Pair Explorer', canvasWidth / 2, 7);

  const dots = dotPositions();
  drawStrip(dots);
  drawROC();
  drawConvergence();
  drawHoverDot(dots);
  drawControlLabels();
}

function panel(p) {
  stroke(205);
  strokeWeight(1);
  fill('white');
  rect(p.x, p.y, p.w, p.h, 8);
}

function drawStrip(dots) {
  const s = geo.strip;
  panel(s);
  noStroke();
  fill(20);
  textSize(geo.wide ? 14 : 13);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  text('40 learners sorted by forecast', s.x + 10, s.y + 6);
  textStyle(NORMAL);

  // cutoff shading (learners at or right of the cutoff are called "successful")
  const c = cutoffSlider.value();
  const cx = stripX(c);
  fill(0, 114, 178, 22);
  rect(cx, s.y + 26, geo.sx1 + 12 - cx, s.h - 52);

  // axis
  stroke(90);
  strokeWeight(1);
  line(geo.sx0, geo.axisY, geo.sx1, geo.axisY);
  noStroke();
  fill(70);
  textSize(11);
  for (const t of [0, 0.25, 0.5, 0.75, 1]) {
    stroke(150);
    line(stripX(t), geo.axisY - 3, stripX(t), geo.axisY + 3);
  }
  noStroke();
  fill(90);
  textSize(12);
  textAlign(RIGHT, CENTER);
  text('0', geo.sx0 - 4, geo.axisY);
  textAlign(LEFT, CENTER);
  text('1', geo.sx1 + 4, geo.axisY);
  textAlign(LEFT, CENTER);
  fill(0, 110, 80);
  text('correct', s.x + 6, s.y + 34);
  fill(160, 100, 0);
  text('incorrect', s.x + 6, s.y + s.h - 34);

  // highlighted pair
  if (lastPair) {
    const a = dots[lastPair.pos], b = dots[lastPair.neg];
    stroke(lastPair.result === 1 ? color(0, 114, 178) : color(213, 94, 0));
    strokeWeight(2.5);
    line(a.x, a.y, b.x, b.y);
  }

  // dots: green circles above the axis, orange squares below
  learners.forEach((l, i) => {
    const d = dots[i];
    const picked = lastPair && (i === lastPair.pos || i === lastPair.neg);
    stroke(picked ? 0 : 255);
    strokeWeight(picked ? 3 : 1);
    if (l.correct) {
      fill(GREEN);
      circle(d.x, d.y, geo.dot);
    } else {
      fill(ORANGE);
      rectMode(CENTER);
      rect(d.x, d.y, geo.dot - 1, geo.dot - 1);
      rectMode(CORNER);
    }
  });

  // cutoff line
  stroke(INK);
  strokeWeight(2);
  drawingContext.setLineDash([5, 4]);
  line(cx, s.y + 24, cx, s.y + s.h - 26);
  drawingContext.setLineDash([]);

  // axis caption and cutoff readout
  const r = rates(c);
  noStroke();
  fill(40);
  textSize(geo.wide ? 13 : 12);
  textAlign(CENTER, BOTTOM);
  text('Cutoff ' + c.toFixed(2) + ':  TPR ' + r.tp + '/' + N_POS + ' = ' +
    r.tpr.toFixed(2) + ',  FPR ' + r.fp + '/' + N_NEG + ' = ' + r.fpr.toFixed(2), s.x + s.w / 2, s.y + s.h - 6);
}

function drawROC() {
  const p = geo.rocPanel;
  panel(p);
  noStroke();
  fill(20);
  textSize(geo.wide ? 14 : 13);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('ROC curve', p.x + 10, p.y + 6);
  textStyle(NORMAL);

  // square plot that fits the panel
  const readoutH = geo.wide ? 84 : 0;
  const side = Math.max(60, Math.min(p.w - 70, p.h - 30 - 34 - readoutH));
  const x0 = geo.wide ? p.x + (p.w - side) / 2 + 12 : p.x + 50;
  const y0 = p.y + 30;
  const X = v => x0 + v * side, Y = v => y0 + side - v * side;

  // area under the curve
  noStroke();
  fill(AREA[0], AREA[1], AREA[2], 70);
  beginShape();
  vertex(X(0), Y(0));
  for (const q of roc) vertex(X(q.fpr), Y(q.tpr));
  vertex(X(1), Y(0));
  endShape(CLOSE);

  // frame, grid and diagonal
  noFill();
  stroke(180);
  strokeWeight(1);
  rect(x0, y0, side, side);
  stroke(120);
  drawingContext.setLineDash([5, 4]);
  line(X(0), Y(0), X(1), Y(1));
  drawingContext.setLineDash([]);

  // ROC staircase
  stroke(0, 90, 150);
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (const q of roc) vertex(X(q.fpr), Y(q.tpr));
  endShape();

  // current cutoff point
  const r = rates(cutoffSlider.value());
  stroke(255);
  strokeWeight(2);
  fill(INK);
  circle(X(r.fpr), Y(r.tpr), 12);

  // axis labels
  noStroke();
  fill(50);
  textSize(12);
  textAlign(CENTER, TOP);
  text('0', X(0), Y(0) + 3);
  text('1', X(1), Y(0) + 3);
  text('false-positive rate', X(0.5), Y(0) + 16);
  textAlign(RIGHT, CENTER);
  text('0', X(0) - 4, Y(0));
  text('1', X(0) - 4, Y(1));
  push();
  translate(X(0) - 14, Y(0.5));
  rotate(-HALF_PI);
  textAlign(CENTER, BOTTOM);
  text('true-positive rate', 0, 0);
  pop();

  // AUC readout
  textAlign(LEFT, TOP);
  fill(0);
  if (geo.wide) {
    const ty = y0 + side + 20;
    textSize(15);
    textStyle(BOLD);
    text('AUC = ' + aucValue.toFixed(3), p.x + 12, ty);
    textStyle(NORMAL);
    textSize(13);
    fill(40);
    text('= shaded area = share of all ' + (N_POS * N_NEG) + ' green–orange pairs in which the green learner ' +
      'has the higher forecast (ties count half)', p.x + 12, ty + 20, p.w - 24, 58);
  } else {
    // on narrow screens the readout sits to the right of the square
    const tx = X(1) + 12;
    textSize(14);
    textStyle(BOLD);
    text('AUC = ' + aucValue.toFixed(3), tx, y0);
    textStyle(NORMAL);
    textSize(12);
    fill(40);
    text('= shaded area = share of the ' + (N_POS * N_NEG) + ' green–orange pairs won by the green learner',
      tx, y0 + 20, p.x + p.w - tx - 8, 90);
  }
}

function drawConvergence() {
  const p = geo.conv;
  panel(p);
  noStroke();
  fill(20);
  textSize(geo.wide ? 14 : 13);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Random pairs', p.x + 10, p.y + 6);
  textStyle(NORMAL);
  const frac = pairsDrawn ? pairsWon / pairsDrawn : 0;
  textSize(geo.wide ? 13 : 12);
  fill(40);
  if (pairsDrawn) {
    text('won ' + fmtWins(pairsWon) + ' of ' + pairsDrawn + ' = ' + frac.toFixed(3) + '   (AUC ' + aucValue.toFixed(3) + ')',
      p.x + 110, p.y + 7, p.w - 118, 20);
  }

  // last pair sentence (or a prompt before the first draw)
  let lineY = p.y + 26;
  if (!lastPair) {
    const prompt = 'Press "Draw random pair" to compare one green and one orange learner.';
    const twoLines = fontWidth(prompt) > p.w - 20;
    text(prompt, p.x + 10, lineY, p.w - 20, twoLines ? 36 : 20);
    if (twoLines) lineY += 16;
  } else {
    const fa = learners[lastPair.pos].f, fb = learners[lastPair.neg].f;
    const verdict = lastPair.result === 1 ? 'win (green ranked higher)'
      : (lastPair.result === 0.5 ? 'tie (counts half)' : 'loss (orange ranked higher)');
    fill(lastPair.result === 1 ? color(0, 90, 150) : color(170, 70, 0));
    const sentence = 'Last pair: green ' + fa.toFixed(2) + ' vs orange ' + fb.toFixed(2) + ' → ' + verdict;
    const twoLines = fontWidth(sentence) > p.w - 20;
    text(sentence, p.x + 10, lineY, p.w - 20, twoLines ? 36 : 20);
    if (twoLines) lineY += 16;
  }
  lineY += 20;

  // running fraction plot with the AUC as a dashed target line
  const gx0 = p.x + 34, gx1 = p.x + p.w - 12, gy0 = lineY + 4, gy1 = p.y + p.h - 16;
  if (gy1 - gy0 < 20) return;
  const nMax = Math.max(100, pairsDrawn);
  const X = k => map(k, 0, nMax, gx0, gx1), Y = v => map(v, 0, 1, gy1, gy0);
  stroke(200);
  strokeWeight(1);
  noFill();
  rect(gx0, gy0, gx1 - gx0, gy1 - gy0);
  stroke(0, 90, 150);
  drawingContext.setLineDash([6, 4]);
  line(gx0, Y(aucValue), gx1, Y(aucValue));
  drawingContext.setLineDash([]);
  if (history.length) {
    stroke(213, 94, 0);
    strokeWeight(2);
    beginShape();
    history.forEach((v, k) => vertex(X(k + 1), Y(v)));
    endShape();
  }
  noStroke();
  fill(60);
  textSize(11);
  textAlign(RIGHT, CENTER);
  text('1', gx0 - 3, gy0);
  text('0.5', gx0 - 3, Y(0.5));
  text('0', gx0 - 3, gy1);
  textAlign(RIGHT, TOP);
  text('pairs drawn: ' + pairsDrawn, gx1, gy1 + 2);
  textAlign(LEFT, TOP);
  fill(0, 90, 150);
  text('AUC', gx0 + 4, Y(aucValue) + 2);
}

function fmtWins(w) {
  return Number.isInteger(w) ? String(w) : w.toFixed(1);
}

function drawHoverDot(dots) {
  if (!geo) return;
  for (let i = 0; i < learners.length; i++) {
    if (dist(mouseX, mouseY, dots[i].x, dots[i].y) <= geo.dot / 2 + 2) {
      const l = learners[i];
      const t = 'Forecast ' + l.f.toFixed(2) + ', ' + (l.correct ? 'correct' : 'incorrect') + ' on the held-out item';
      textSize(13);
      const w = fontWidth(t) + 14, h = 22;
      const x = constrain(mouseX + 10, 4, canvasWidth - w - 4);
      const y = mouseY - h - 8;
      stroke(120);
      strokeWeight(1);
      fill(255, 255, 240);
      rect(x, y, w, h, 4);
      noStroke();
      fill(0);
      textAlign(LEFT, CENTER);
      text(t, x + 7, y + h / 2);
      return;
    }
  }
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(15);
  textAlign(LEFT, CENTER);
  if (cutoffSlider.pos) text('Cutoff: ' + cutoffSlider.value().toFixed(2), cutoffSlider.pos.labelX, cutoffSlider.pos.y + 10);
  if (signalSlider.pos) text('Signal strength: ' + signalSlider.value().toFixed(2), signalSlider.pos.labelX, signalSlider.pos.y + 10);
}

// ---------- responsive layout ----------
function layoutControls() {
  const buttons = [pairButton, hundredButton];
  let x = 10;
  buttons.forEach(b => { b.pos = { x }; x += (b.elt.offsetWidth || 120) + 10; });
  const sliders = [cutoffSlider, signalSlider];
  const cols = canvasWidth >= 700 ? 2 : 1;
  // on wide screens the buttons share the first row with nothing else; sliders follow
  const sliderRows = Math.ceil(sliders.length / cols);
  controlHeight = (1 + sliderRows) * rowStep + 12;
  drawHeight = canvasHeight - controlHeight;
  buttons.forEach(b => b.position(b.pos.x, drawHeight + 8));
  const colW = (canvasWidth - 10) / cols;
  sliders.forEach((s, i) => {
    const c = i % cols, r = Math.floor(i / cols);
    const colX = 5 + c * colW;
    const y = drawHeight + 8 + (1 + r) * rowStep;
    s.position(colX + sliderLeftMargin, y);
    s.size(Math.max(60, colW - sliderLeftMargin - 16));
    s.pos = { labelX: colX + 8, y };
  });
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  layoutControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    const w = Math.floor(container.getBoundingClientRect().width);
    if (w > 0) canvasWidth = w;
  }
}
