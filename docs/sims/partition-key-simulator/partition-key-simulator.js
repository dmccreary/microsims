// Partition Key Simulator - keying the event stream by district vs by district and learner
// CANVAS_HEIGHT: 600
// Learning objective (Analyze / compare): the learner compares keying by district with keying by
// district and learner, in terms of per-partition load and per-learner ordering (Chapter 20,
// "Partition by Learner").
// Colored dots (one color per learner) leave the gateway on the left, are routed to a partition
// lane by hashing the chosen key (murmur2, the hash Kafka's default partitioner uses), wait in
// their lane, and are read in order by the processor on the right. A load bar under each lane
// shows how many statements it holds against a red limit line. Click a learner to see the order
// in which the processor read that learner's statements. A third option, "No key", spreads
// statements over lanes at random to show what per-lane ordering protects.

// ---------- Canvas dimensions ----------
// Fixed total height; the drawing/control split is recomputed when the control rows wrap.
let canvasWidth = 800;
let canvasHeight = 600;
let controlHeight = 80;
let drawHeight = canvasHeight - controlHeight;
let margin = 12;
let defaultTextSize = 16;

// ---------- Model constants ----------
const BURST = 60;                       // statements per burst
const HOME = 'https://school.example.edu';
const DISTRICT_NAMES = ['district-a', 'district-b', 'district-c', 'district-d'];
const DISTRICT_SHARE = [0.50, 0.25, 0.15, 0.10];   // unequal districts: A is the large one
const READ_EVERY = [10, 14, 11, 16, 12, 13, 10, 15, 11, 14, 12, 13];  // frames per read, per lane
const KEY_DISTRICT = 'Key: district only';
const KEY_LEARNER = 'Key: district and learner';
const KEY_NONE = 'No key (random lane)';

// Okabe-Ito accents
const LIMIT_RED = [213, 94, 0];
const BAR_BLUE = [0, 114, 178];
const OK_GREEN = [0, 130, 90];

// ---------- State ----------
let learners = [];      // {name, district, col, produced}
let lanes = [];         // arrays of statements {learner, seq, born, lane}
let pending = [];       // statements waiting to be emitted {learner, seq}
let readLog = [];       // statements in the order the processor read them
let laneClock = [];
let lanePeak = [];     // the most statements each lane has held since the last restart
let simFrame = 0;
let paused = false;
let pointerInside = false;
let selected = 0;       // selected learner index
let rng;
let laneBoxes = [];     // geometry for click tests
let chipBoxes = [];

// ---------- Controls ----------
let keyRadio, learnersSlider, districtsSlider, partitionsSlider, burstButton, pauseButton;
let labelSpots = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('sans-serif');
  const main = document.querySelector('main');
  main.addEventListener('mouseenter', () => { pointerInside = true; });
  main.addEventListener('mouseleave', () => { pointerInside = false; });

  keyRadio = createRadio('partitionKey');
  keyRadio.option(KEY_DISTRICT);
  keyRadio.option(KEY_LEARNER);
  keyRadio.option(KEY_NONE);
  keyRadio.selected(KEY_LEARNER);
  keyRadio.changed(restart);
  for (const lab of keyRadio.elt.querySelectorAll('label')) {
    lab.style.whiteSpace = 'nowrap';
    lab.style.display = 'inline-block';
    lab.style.marginRight = '10px';
  }
  learnersSlider = createSlider(3, 60, 12, 1);
  districtsSlider = createSlider(1, 4, 2, 1);
  partitionsSlider = createSlider(2, 12, 6, 1);
  for (const s of [learnersSlider, districtsSlider, partitionsSlider]) s.input(restart);
  burstButton = createButton('Send burst');
  burstButton.mousePressed(() => { queueBurst(); paused = false; pauseButton.html('Pause'); });
  pauseButton = createButton('Pause');
  pauseButton.mousePressed(togglePause);
  for (const el of [keyRadio, learnersSlider, districtsSlider, partitionsSlider, burstButton, pauseButton]) el.parent(main);
  keyRadio.attribute('aria-label', 'Partition key');
  learnersSlider.attribute('aria-label', 'Learners');
  districtsSlider.attribute('aria-label', 'Districts');
  partitionsSlider.attribute('aria-label', 'Partitions');

  layoutControls();
  restart();

  describe('Partition Key Simulator. Colored dots, one color per learner, leave the gateway on the left ' +
    'and are routed into partition lanes by hashing the chosen key. With the district-only key all of a ' +
    'district\'s statements land in one lane, whose load bar crosses a red limit line. With the district ' +
    'and learner key the load spreads across the lanes and each learner stays in one lane. The processor ' +
    'on the right reads each lane in order; selecting a learner shows the order in which that learner\'s ' +
    'statements were read, and whether it matches the order they were produced.');
}

// ---------- Hashing: Kafka's murmur2 (default partitioner: toPositive(murmur2(key)) % partitions) ----------
function murmur2(str) {
  const data = new TextEncoder().encode(str);
  const len = data.length, m = 0x5bd1e995, r = 24;
  let h = (0x9747b28c ^ len) >>> 0;
  const l4 = len >> 2;
  for (let i = 0; i < l4; i++) {
    const i4 = i * 4;
    let k = (data[i4] | (data[i4 + 1] << 8) | (data[i4 + 2] << 16) | (data[i4 + 3] << 24)) >>> 0;
    k = Math.imul(k, m) >>> 0;
    k = (k ^ (k >>> r)) >>> 0;
    k = Math.imul(k, m) >>> 0;
    h = Math.imul(h, m) >>> 0;
    h = (h ^ k) >>> 0;
  }
  const t = len & ~3;
  switch (len % 4) {
    case 3: h = (h ^ (data[t + 2] << 16)) >>> 0;
    // falls through
    case 2: h = (h ^ (data[t + 1] << 8)) >>> 0;
    // falls through
    case 1: h = (h ^ data[t]) >>> 0; h = Math.imul(h, m) >>> 0;
  }
  h = (h ^ (h >>> 13)) >>> 0;
  h = Math.imul(h, m) >>> 0;
  h = (h ^ (h >>> 15)) >>> 0;
  return h;
}

function mulberry32(a) {
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function keyMode() { return keyRadio.value() || KEY_LEARNER; }

function keyFor(li) {
  const L = learners[li];
  if (keyMode() === KEY_DISTRICT) return DISTRICT_NAMES[L.district];
  return DISTRICT_NAMES[L.district] + ':' + HOME + '|' + L.name;
}

function laneFor(li) {
  const P = partitionsSlider.value();
  if (keyMode() === KEY_NONE) return floor(rng() * P);
  return (murmur2(keyFor(li)) & 0x7fffffff) % P;
}

// ---------- Simulation ----------
function buildLearners() {
  const L = learnersSlider.value(), D = districtsSlider.value();
  const share = DISTRICT_SHARE.slice(0, D);
  const sum = share.reduce((a, b) => a + b, 0);
  const counts = share.map(s => round(L * s / sum));
  while (counts.reduce((a, b) => a + b, 0) > L) counts[counts.indexOf(max(counts))]--;
  while (counts.reduce((a, b) => a + b, 0) < L) counts[0]++;
  learners = [];
  let n = 0;
  counts.forEach((c, d) => {
    for (let i = 0; i < c; i++) {
      const hue = (n * 137.508) % 360;
      learners.push({ name: 'learner-' + nf(n + 1, 2), district: d, hue, produced: 0 });
      n++;
    }
  });
}

function learnerColor(li, alpha) {
  push();
  colorMode(HSB, 360, 100, 100, 255);
  const L = learners[li];
  const c = color(L.hue, 75, 88 - (li % 3) * 12, alpha === undefined ? 255 : alpha);
  pop();
  return c;
}

function restart() {
  rng = mulberry32(20260930);
  buildLearners();
  const P = partitionsSlider.value();
  lanes = [];
  laneClock = [];
  lanePeak = [];
  for (let p = 0; p < P; p++) { lanes.push([]); laneClock.push(0); lanePeak.push(0); }
  lanePeak.length = P;
  pending = [];
  readLog = [];
  simFrame = 0;
  if (selected >= learners.length) selected = 0;
  // Pre-run one burst so the view opens with lanes already loaded
  queueBurst();
  for (let i = 0; i < BURST + 6; i++) stepSimulation();
  // the pre-run happened off screen: show every dot already in its lane, not frozen mid-flight
  for (const l of lanes) for (const st of l) st.born = -100;
}

function queueBurst() {
  // Every learner sends about the same number of statements, interleaved in a shuffled order
  const L = learners.length;
  const order = [];
  for (let k = 0; k < BURST; k++) order.push(k % L);
  for (let i = order.length - 1; i > 0; i--) {
    const j = floor(rng() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  for (const li of order) {
    learners[li].produced++;
    pending.push({ learner: li, seq: learners[li].produced });
  }
}

function stepSimulation() {
  simFrame++;
  // emit one statement per frame
  if (pending.length) {
    const s = pending.shift();
    s.lane = laneFor(s.learner);
    s.born = simFrame;
    lanes[s.lane].push(s);
    lanePeak[s.lane] = max(lanePeak[s.lane], lanes[s.lane].length);
  }
  // each lane's processor reads the oldest statement in its lane at its own pace
  for (let p = 0; p < lanes.length; p++) {
    laneClock[p]++;
    if (laneClock[p] >= READ_EVERY[p % READ_EVERY.length] && lanes[p].length) {
      laneClock[p] = 0;
      const s = lanes[p].shift();
      s.readAt = simFrame;
      readLog.push(s);
    }
  }
}

function togglePause() {
  paused = !paused;
  pauseButton.html(paused ? 'Resume' : 'Pause');
}

// ---------- Layout ----------
function narrow() { return canvasWidth < 560; }

function layoutControls() {
  const rowH = 34, x0 = 10, gap = 14;
  keyRadio.style('width', 'auto');
  keyRadio.position(0, 0);
  const radioNatural = keyRadio.elt.offsetWidth;
  const buttonsW = burstButton.elt.offsetWidth + 8 + pauseButton.elt.offsetWidth;
  textSize(14);
  const sliderRow = [
    { s: learnersSlider, label: 'Learners: 60' },
    { s: districtsSlider, label: 'Districts: 4' },
    { s: partitionsSlider, label: 'Partitions: 12' }
  ];
  let rows = [];
  if (!narrow() && radioNatural + gap + buttonsW < canvasWidth - 2 * x0) {
    rows.push({ h: rowH, items: [{ el: keyRadio, x: x0 }, { el: burstButton, x: x0 + radioNatural + gap },
      { el: pauseButton, x: x0 + radioNatural + gap + burstButton.elt.offsetWidth + 8 }] });
  } else {
    if (radioNatural > canvasWidth - 2 * x0) keyRadio.style('width', (canvasWidth - 2 * x0) + 'px');
    const rh = max(rowH, keyRadio.elt.offsetHeight + 12);
    rows.push({ h: rh, items: [{ el: keyRadio, x: x0 }] });
    rows.push({ h: rowH, items: [{ el: burstButton, x: x0 }, { el: pauseButton, x: x0 + burstButton.elt.offsetWidth + 8 }] });
  }
  // sliders: all on one row when wide, one per row when narrow
  labelSpots = [];
  const sliderRowsNeeded = narrow() ? 3 : 1;
  const totalRows = rows.length + sliderRowsNeeded;
  controlHeight = rows.reduce((a, r) => a + r.h, 0) + sliderRowsNeeded * rowH + 10;
  drawHeight = canvasHeight - controlHeight;
  let y = drawHeight + 6;
  for (const r of rows) {
    for (const it of r.items) it.el.position(it.x, y + (it.el === keyRadio ? 3 : 0));
    y += r.h;
  }
  if (narrow()) {
    const lw = 120;
    sliderRow.forEach((it, i) => {
      it.s.position(x0 + lw, y + 2);
      it.s.size(canvasWidth - x0 - lw - margin - 6);
      labelSpots.push({ s: it.s, x: x0, y: y + 12 });
      y += rowH;
    });
  } else {
    const cell = (canvasWidth - 2 * x0) / 3;
    sliderRow.forEach((it, i) => {
      const lw = fontWidth(it.label) + 10;
      it.s.position(x0 + i * cell + lw, y + 2);
      it.s.size(max(60, cell - lw - 14));
      labelSpots.push({ s: it.s, x: x0 + i * cell, y: y + 12 });
    });
  }
}

// ---------- Drawing ----------
function draw() {
  if (!paused && pointerInside) stepSimulation();

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
  textSize(narrow() ? 17 : 20);
  text('Partition Key Simulator', margin, 8);
  textStyle(NORMAL);
  textSize(12);
  fill('dimgray');
  const keyNote = keyMode() === KEY_DISTRICT ? 'key = district_id'
    : keyMode() === KEY_LEARNER ? 'key = district_id:home|name' : 'no key: any lane';
  textAlign(RIGHT, TOP);
  text(keyNote, canvasWidth - margin, 13);

  const legendBottom = drawLegend(margin, 36, canvasWidth - 2 * margin);
  const panelH = narrow() ? 74 : 70;
  const lanesTop = legendBottom + 8;
  const lanesBottom = drawHeight - panelH - 12;
  drawLanes(lanesTop, lanesBottom);
  drawOrderPanel(margin, drawHeight - panelH - 6, canvasWidth - 2 * margin, panelH);
  drawControlLabels();
  if (!narrow() && !pointerInside && !paused && (pending.length || lanes.some(l => l.length))) {
    noStroke();
    fill(90);
    textSize(11);
    textAlign(RIGHT, TOP);
    text('runs while the pointer is over the sim', canvasWidth - margin - 10, drawHeight - panelH);
  }
}

function drawLegend(x, y, w) {
  chipBoxes = [];
  textSize(12);
  textAlign(LEFT, CENTER);
  const d = 11;          // chip spacing
  let cx = x, cy = y + 8;
  let lastDistrict = -1;
  for (let li = 0; li < learners.length; li++) {
    const L = learners[li];
    if (L.district !== lastDistrict) {
      const lab = 'District ' + 'ABCD'[L.district] + ':';
      const lw = fontWidth(lab) + 6;
      if (cx + lw + d > x + w) { cx = x; cy += 16; }
      noStroke();
      fill(40);
      text(lab, cx, cy);
      cx += lw;
      lastDistrict = L.district;
    }
    if (cx + d > x + w) { cx = x + 10; cy += 16; }
    const sel = li === selected;
    stroke(sel ? 0 : 255);
    strokeWeight(sel ? 2.5 : 1);
    fill(learnerColor(li));
    circle(cx + 5, cy, sel ? 11 : 9);
    chipBoxes.push({ li, x: cx, y: cy - 7, w: d, h: 14 });
    cx += d + (li + 1 < learners.length && learners[li + 1].district !== L.district ? 10 : 0);
  }
  return cy + 9;
}

function drawLanes(top, bottom) {
  laneBoxes = [];
  const P = lanes.length;
  const prodW = narrow() ? 48 : 78, consW = narrow() ? 58 : 92;
  const lx = margin + prodW + 10, rx = canvasWidth - margin - consW - 10;
  const laneH = min(60, (bottom - top - 18) / P);
  const lanesH = laneH * P;
  const dotR = constrain((laneH - 12) / 2, 3, 6);
  const spacing = dotR * 2 + 3;
  const cap = max(1, floor((rx - lx - 50) / spacing));
  const limit = 2 * BURST / P;            // red line: twice an even share of one burst
  const barMax = max([limit * 2, ...lanePeak, 1]);

  // producer and consumer boxes
  stroke(120);
  strokeWeight(1);
  fill(255);
  rect(margin, top, prodW, lanesH - 6, 8);
  rect(canvasWidth - margin - consW, top, consW, lanesH - 6, 8);
  noStroke();
  fill(20);
  textAlign(CENTER, CENTER);
  textSize(narrow() ? 11 : 13);
  textStyle(BOLD);
  push();
  translate(margin + prodW / 2, top + (lanesH - 6) / 2);
  if (narrow()) { rotate(-HALF_PI); text('Gateway (producer)', 0, 0); }
  else { text('Gateway', 0, -10); textStyle(NORMAL); textSize(11); text('(producer)', 0, 8); }
  pop();
  push();
  translate(canvasWidth - margin - consW / 2, top + (lanesH - 6) / 2);
  textStyle(BOLD);
  textSize(narrow() ? 11 : 13);
  if (narrow()) { rotate(-HALF_PI); text('Processor (consumer)', 0, 0); }
  else {
    text('Processor', 0, -18);
    textStyle(NORMAL);
    textSize(11);
    text('(consumer)', 0, 0);
    text('read: ' + readLog.length, 0, 18);
  }
  pop();
  textStyle(NORMAL);

  for (let p = 0; p < P; p++) {
    const y = top + p * laneH;
    const midY = y + (laneH - 6) / 2;
    const n = lanes[p].length;
    laneBoxes.push({ p, x: lx, y, w: rx - lx, h: laneH });
    // lane pipe
    stroke(190);
    strokeWeight(1);
    fill(255, 255, 255, 200);
    rect(lx, y + 1, rx - lx, laneH - 8, 4);
    // lane label
    noStroke();
    fill(80);
    textSize(10);
    textAlign(LEFT, CENTER);
    if (laneH > 16) text('P' + p, lx + 3, midY);
    // queued statements: the oldest sits at the right end, next to the processor
    const shown = min(n, cap);
    for (let j = 0; j < shown; j++) {
      const s = lanes[p][j];
      let dxTarget = rx - 6 - dotR - j * spacing;
      // fly-in from the producer for newly emitted dots
      const age = simFrame - s.born;
      const x = age < 16 ? lerp(margin + prodW, dxTarget, age / 16) : dxTarget;
      const isSel = s.learner === selected;
      stroke(isSel ? 0 : 255);
      strokeWeight(isSel ? 2 : 0.8);
      fill(learnerColor(s.learner, isSel || selected < 0 ? 255 : 150));
      circle(x, midY, dotR * 2);
      if (isSel && dotR >= 5) {
        noStroke();
        fill(0);
        textSize(9);
        textAlign(CENTER, CENTER);
        text(s.seq, x, midY - dotR - 5 < y ? midY : midY - dotR - 5);
      }
    }
    if (n > cap) {
      noStroke();
      fill(LIMIT_RED);
      textSize(11);
      textStyle(BOLD);
      textAlign(LEFT, CENTER);
      text('+' + (n - cap), lx + 22, midY);
      textStyle(NORMAL);
    }
    // load bar under the lane with the red limit line
    const by = y + laneH - 7;
    const bw = rx - lx;
    noStroke();
    fill(228);
    rect(lx, by, bw, 4);
    // peak since the last restart (outline), then what the lane holds now (solid)
    const pk = lanePeak[p] || 0;
    if (pk > n) {
      noFill();
      stroke(pk > limit ? color(LIMIT_RED) : color(BAR_BLUE));
      strokeWeight(1);
      rect(lx, by, bw * min(1, pk / barMax), 4);
      noStroke();
    }
    fill(n > limit ? color(LIMIT_RED) : color(BAR_BLUE));
    rect(lx, by, bw * min(1, n / barMax), 4);
    stroke(LIMIT_RED);
    strokeWeight(2);
    const lxLim = lx + bw * (limit / barMax);
    line(lxLim, by - 2, lxLim, by + 6);
  }
  // legend for the load bars
  noStroke();
  textSize(11);
  textAlign(LEFT, TOP);
  fill(60);
  const legend = narrow() ? 'bar = statements held; outline = peak; red tick = limit ' + nf(limit, 0, 0)
    : 'bar under each lane = statements it holds (outline = peak since restart); red tick = limit of ' + nf(limit, 0, 0) +
      ', twice an even share of a 60-statement burst';
  text(legend, margin, top + lanesH);
}

function drawOrderPanel(x, y, w, h) {
  stroke(200);
  strokeWeight(1);
  fill(255, 255, 255, 235);
  rect(x, y, w, h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  if (!learners[selected]) return;
  const L = learners[selected];
  // where this learner's statements went
  const mine = readLog.filter(s => s.learner === selected);
  const queuedMine = [];
  lanes.forEach(l => l.forEach(s => { if (s.learner === selected) queuedMine.push(s); }));
  const laneSet = new Set(mine.map(s => s.lane).concat(queuedMine.map(s => s.lane)));
  const lanesTxt = [...laneSet].sort((a, b) => a - b).map(p => 'P' + p).join(', ') || 'none yet';
  let inOrder = true;
  for (let i = 1; i < mine.length; i++) if (mine[i].seq < mine[i - 1].seq) inOrder = false;

  // summary line for every learner
  let broken = 0;
  const lastSeq = {};
  const brokenSet = new Set();
  for (const s of readLog) {
    if (lastSeq[s.learner] !== undefined && s.seq < lastSeq[s.learner]) brokenSet.add(s.learner);
    lastSeq[s.learner] = max(lastSeq[s.learner] || 0, s.seq);
  }
  broken = brokenSet.size;
  const busiest = max(lanePeak);
  const limit = 2 * BURST / lanes.length;

  textSize(narrow() ? 12 : 13);
  textStyle(BOLD);
  fill(0);
  text(L.name + '  (District ' + 'ABCD'[L.district] + ')  → ' + lanesTxt, x + 10, y + 6);
  textStyle(NORMAL);
  // read order as a row of numbers
  let tx = x + 10;
  const ty = y + 25;
  textSize(12);
  fill(60);
  const lab = 'Processor read: ';
  text(lab, tx, ty);
  tx += fontWidth(lab);
  let prev = 0;
  for (const s of mine) {
    const bad = s.seq < prev;
    fill(bad ? color(LIMIT_RED) : color(0));
    textStyle(bad ? BOLD : NORMAL);
    const t = s.seq + ' ';
    if (tx + fontWidth(t) > x + w - 150) { text('...', tx, ty); tx += 14; break; }
    text(t, tx, ty);
    tx += fontWidth(t);
    prev = max(prev, s.seq);
  }
  textStyle(NORMAL);
  if (mine.length === 0) { fill(90); text('nothing yet', tx, ty); tx += 70; }
  fill(90);
  if (queuedMine.length) text(' (' + queuedMine.length + ' waiting)', tx, ty);
  textAlign(RIGHT, TOP);
  textStyle(BOLD);
  fill(inOrder ? color(OK_GREEN) : color(LIMIT_RED));
  text(mine.length < 2 ? '' : (inOrder ? 'in order ✓' : 'out of order ✗'), x + w - 10, ty);
  textStyle(NORMAL);
  textAlign(LEFT, TOP);
  textSize(narrow() ? 11 : 12);
  fill(busiest > limit ? color(LIMIT_RED) : color(40));
  const summary = 'Busiest lane peaked at ' + busiest + ' (limit ' + nf(limit, 0, 0) + ').  Learners read out of order: ' +
    broken + ' of ' + learners.length + '.';
  drawWrapped(summary, x + 10, y + 43, w - 20, 14);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(14);
  const names = ['Learners: ', 'Districts: ', 'Partitions: '];
  const sliders = [learnersSlider, districtsSlider, partitionsSlider];
  for (const l of labelSpots) {
    const i = sliders.indexOf(l.s);
    textStyle(BOLD);
    text(names[i], l.x, l.y);
    const nw = fontWidth(names[i]);
    textStyle(NORMAL);
    text(l.s.value(), l.x + nw, l.y);
  }
}

// ---------- Interaction ----------
function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight) return;
  for (const c of chipBoxes) {
    if (mouseX >= c.x && mouseX <= c.x + c.w && mouseY >= c.y && mouseY <= c.y + c.h) { selected = c.li; return; }
  }
  // clicking a dot in a lane selects its learner
  for (const b of laneBoxes) {
    if (mouseX < b.x || mouseX > b.x + b.w || mouseY < b.y || mouseY > b.y + b.h) continue;
    const P = lanes.length;
    const laneH = b.h;
    const dotR = constrain((laneH - 12) / 2, 3, 6);
    const spacing = dotR * 2 + 3;
    const j = floor((b.x + b.w - 6 - mouseX) / spacing);
    if (j >= 0 && j < lanes[b.p].length) selected = lanes[b.p][j].learner;
    return;
  }
}

function mouseMoved() {
  let over = false;
  for (const c of chipBoxes) if (mouseX >= c.x && mouseX <= c.x + c.w && mouseY >= c.y && mouseY <= c.y + c.h) over = true;
  cursor(over ? HAND : ARROW);
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
