// Evidence Threshold Lab - how hover, misclick and glance thresholds change the statement stream
// CANVAS_HEIGHT: 770
// Learning objective (Evaluate / justify): the learner justifies a choice of hover, misclick and
// glance thresholds by observing how each changes the number and kind of statements produced
// from a fixed, scripted session (Chapter 16, "What Does Not Count: Non-Evidence Thresholds").
// A scripted 60-second session is drawn as bars in four lanes. Each slider recomputes which acts
// become statements (green) and which are filtered (gray). The list shows each emitted statement's
// verb and object; the readout counts likely noise let in and likely attention thrown away.

// ---------- Canvas dimensions ----------
// Fixed total height; the drawing/control split is recomputed when the control rows wrap.
let canvasWidth = 800;
let canvasHeight = 770;
let controlHeight = 150;
let drawHeight = canvasHeight - controlHeight;
let margin = 12;
let sliderLeftMargin = 235;
let defaultTextSize = 16;

// Okabe-Ito color-blind-safe colors (RGB): emitted = bluish green, costs = vermillion, ok = blue
const EMIT = [0, 158, 115], EMIT_DARK = [0, 110, 80], COST = [185, 70, 0], OK = [0, 100, 160];

// Runtime defaults (the constants in lrs-sim.js)
const HOVER_MS = 600, MISCLICK_MS = 250, GLANCE_MS = 1000;
const SESSION_S = 60;

// ---------- The scripted session ----------
// lane: hover | run | page | answer; t: start (s); ms: duration
const ACTS = [
  { lane: 'hover', t: 2.0, ms: 180, obj: '#gravity' },
  { lane: 'hover', t: 3.5, ms: 120, obj: '#mass' },
  { lane: 'hover', t: 5.0, ms: 260, obj: '#velocity' },
  { lane: 'hover', t: 6.5, ms: 410, obj: '#height' },
  { lane: 'hover', t: 9.0, ms: 700, obj: '#velocity' },
  { lane: 'run', t: 12.5, ms: 120, obj: 'bouncing-ball/' },
  { lane: 'page', t: 13.5, ms: 700, obj: 'energy-chart/' },
  { lane: 'run', t: 15.0, ms: 40000, obj: 'bouncing-ball/' },
  { lane: 'page', t: 19.0, ms: 2400, obj: 'energy-chart/' },
  { lane: 'hover', t: 24.0, ms: 100, obj: '#gravity' },
  { lane: 'hover', t: 25.5, ms: 330, obj: '#mass' },
  { lane: 'hover', t: 27.0, ms: 500, obj: '#friction' },
  { lane: 'hover', t: 28.5, ms: 220, obj: '#height' },
  { lane: 'hover', t: 33.0, ms: 950, obj: '#energy' },
  { lane: 'hover', t: 45.0, ms: 1200, obj: '#friction' },
  { lane: 'answer', t: 57.5, ms: 0, obj: '#q1' }
];
const LANES = [
  { id: 'hover', label: 'Hovers', sub: 'diagram nodes' },
  { id: 'run', label: 'Runs', sub: 'Start to Pause' },
  { id: 'page', label: 'Page dwell', sub: 'static chart' },
  { id: 'answer', label: 'Answer', sub: 'checked item' }
];

// ---------- State ----------
let hoverSlider, misclickSlider, glanceSlider, showFilteredBox, resetButton;
let barRects = [];
let hoveredAct = -1;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('sans-serif');
  const main = document.querySelector('main');

  hoverSlider = createSlider(0, 2000, HOVER_MS, 50);
  misclickSlider = createSlider(0, 1000, MISCLICK_MS, 50);
  glanceSlider = createSlider(0, 3000, GLANCE_MS, 100);
  showFilteredBox = createCheckbox('Show statements that were filtered out', false);
  resetButton = createButton('Reset to runtime defaults');
  resetButton.mousePressed(resetDefaults);
  for (const c of [hoverSlider, misclickSlider, glanceSlider, showFilteredBox, resetButton]) c.parent(main);
  layoutControls();

  describe('Evidence Threshold Lab. A scripted 60-second learner session is drawn as bars in four lanes: ' +
    'eleven node hovers, two runs, two page-dwell visits and one answered question. Three sliders set the ' +
    'hover, misclick and glance thresholds; acts at or above a threshold turn green and become statements, ' +
    'acts below it turn gray and are filtered. A list shows the verb and object of every emitted statement, ' +
    'and a readout counts likely noise kept and likely attention lost.');
}

function resetDefaults() {
  hoverSlider.value(HOVER_MS);
  misclickSlider.value(MISCLICK_MS);
  glanceSlider.value(GLANCE_MS);
  showFilteredBox.checked(false);
}

// ---------- The rules ----------
function evaluate(a) {
  const hv = hoverSlider.value(), mc = misclickSlider.value(), gl = glanceSlider.value();
  if (a.lane === 'answer') return { ok: true, rule: 'An answered statement is assessment evidence: no threshold applies to it.' };
  if (a.lane === 'hover') {
    return a.ms >= hv
      ? { ok: true, rule: a.ms + ' ms is at or above the ' + hv + ' ms hover threshold, so the hover counts as inspection.' }
      : { ok: false, rule: a.ms + ' ms is below the ' + hv + ' ms hover threshold: a pointer crossing, not attention.' };
  }
  if (a.lane === 'run') {
    return a.ms >= mc
      ? { ok: true, rule: fmtMs(a.ms) + ' is at or above the ' + mc + ' ms misclick threshold, so the run emits one experienced statement on Pause.' }
      : { ok: false, rule: a.ms + ' ms is below the ' + mc + ' ms misclick threshold: an accidental press, so no experienced (the presses may still be recorded).' };
  }
  return a.ms >= gl
    ? { ok: true, rule: fmtMs(a.ms) + ' is at or above the ' + gl + ' ms glance threshold, so page dwell is recorded on focus loss.' }
    : { ok: false, rule: a.ms + ' ms is below the ' + gl + ' ms glance threshold: a glance, not engagement.' };
}

function statementText(a) {
  if (a.lane === 'hover') return ['interacted', '.../sims/gravity-diagram/' + a.obj, 'hover, ' + iso(a.ms)];
  if (a.lane === 'run') return ['experienced', '.../sims/' + a.obj, iso(a.ms)];
  if (a.lane === 'page') return ['experienced', '.../sims/' + a.obj, iso(a.ms)];
  return ['answered', '.../sims/bouncing-ball/' + a.obj, 'success: true'];
}

function iso(ms) {
  const s = ms / 1000;
  return 'PT' + (Number.isInteger(s) ? s : s.toFixed(2).replace(/0+$/, '')) + 'S';
}

function fmtMs(ms) { return ms >= 1000 ? (ms / 1000) + ' s' : ms + ' ms'; }

// ---------- Layout ----------
function narrow() { return canvasWidth < 560; }

function layoutControls() {
  const rowH = 34;
  const sliders = [hoverSlider, misclickSlider, glanceSlider];
  // row 3 holds the checkbox and the button; the button wraps below the checkbox if needed
  for (const el of [showFilteredBox, resetButton]) if (el.elt.style.position !== 'absolute') el.position(0, drawHeight);
  const cbW = showFilteredBox.elt.offsetWidth || 280;
  const btW = resetButton.elt.offsetWidth || 180;
  const wrap = 10 + cbW + 16 + btW > canvasWidth - 10;
  controlHeight = (wrap ? 5 : 4) * rowH + 14;
  drawHeight = canvasHeight - controlHeight;
  sliders.forEach((s, i) => {
    s.position(sliderLeftMargin, drawHeight + 12 + i * rowH);
    s.size(canvasWidth - sliderLeftMargin - margin - 5);
  });
  const y3 = drawHeight + 12 + 3 * rowH;
  showFilteredBox.position(10, y3 + 2);
  resetButton.position(wrap ? 10 : 10 + cbW + 16, wrap ? y3 + rowH : y3);
}

// ---------- Drawing ----------
function draw() {
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const results = ACTS.map(evaluate);
  const emitted = results.filter(r => r.ok).length;

  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(narrow() ? 19 : 22);
  text('Evidence Threshold Lab', margin, 9);
  textStyle(NORMAL);
  textSize(narrow() ? 14 : 16);
  textAlign(RIGHT, TOP);
  fill(EMIT_DARK);
  text((narrow() ? '' : 'Statements: ') + emitted + ' of ' + ACTS.length + (narrow() ? '' : ' acts'), canvasWidth - margin, narrow() ? 12 : 13);
  textAlign(LEFT, TOP);

  const tl = { x: margin, y: 40, w: canvasWidth - 2 * margin, h: narrow() ? 158 : constrain(drawHeight - 40 - 352, 170, 230) };
  drawTimeline(tl, results);
  const lowY = tl.y + tl.h + 8;
  if (narrow()) {
    const readH = 104;
    drawList({ x: margin, y: lowY, w: canvasWidth - 2 * margin, h: drawHeight - 8 - lowY - readH - 6 }, results);
    drawReadout({ x: margin, y: drawHeight - 8 - readH, w: canvasWidth - 2 * margin, h: readH }, results);
  } else {
    const lw = floor((canvasWidth - 2 * margin) * 0.56);
    drawList({ x: margin, y: lowY, w: lw, h: drawHeight - 8 - lowY }, results);
    drawReadout({ x: margin + lw + 10, y: lowY, w: canvasWidth - 2 * margin - lw - 10, h: drawHeight - 8 - lowY }, results);
  }
  drawControlLabels();
  drawTooltip(results);
}

function drawTimeline(r, results) {
  stroke('silver');
  fill('white');
  rect(r.x, r.y, r.w, r.h, 8);
  const labelW = narrow() ? 64 : 92;
  const ax = r.x + labelW, aw = r.w - labelW - 12;
  const laneH = narrow() ? 28 : floor((r.h - 26 - 26) / LANES.length);
  const top = r.y + 26;
  noStroke();
  fill('black');
  textSize(narrow() ? 12 : 13);
  textStyle(BOLD);
  text('Scripted session (0 to 60 s)', r.x + 8, r.y + 6);
  textStyle(NORMAL);
  // legend
  textSize(11);
  const lgX = r.x + r.w - (narrow() ? 150 : 190);
  fill(EMIT); rect(lgX, r.y + 9, 10, 10, 2);
  fill('black'); text('statement', lgX + 14, r.y + 8);
  fill('silver'); rect(lgX + (narrow() ? 76 : 88), r.y + 9, 10, 10, 2);
  fill('black'); text('filtered', lgX + (narrow() ? 90 : 102), r.y + 8);
  // lanes
  LANES.forEach((ln, i) => {
    const y = top + i * laneH;
    fill(i % 2 ? 'white' : 'ghostwhite');
    rect(ax, y, aw, laneH - 2);
    fill('black');
    textSize(narrow() ? 11 : 13);
    textAlign(LEFT, TOP);
    text(ln.label, r.x + 8, y + (narrow() ? 2 : 1));
    if (!narrow()) { fill('dimgray'); textSize(10.5); text(ln.sub, r.x + 8, y + 16); }
  });
  // axis ticks
  const axisY = top + LANES.length * laneH;
  stroke('gray');
  line(ax, axisY, ax + aw, axisY);
  noStroke();
  fill('dimgray');
  textSize(10.5);
  textAlign(CENTER, TOP);
  for (let s = 0; s <= SESSION_S; s += 10) {
    const x = ax + s / SESSION_S * aw;
    stroke('gainsboro');
    line(x, top, x, axisY);
    noStroke();
    text(s + ' s', x, axisY + 3);
  }
  textAlign(LEFT, TOP);
  // bars
  barRects = [];
  hoveredAct = -1;
  ACTS.forEach((a, i) => {
    const li = LANES.findIndex(l => l.id === a.lane);
    const y = top + li * laneH + 5;
    const x = ax + a.t / SESSION_S * aw;
    const bw = max(a.ms / 1000 / SESSION_S * aw, narrow() ? 4 : 6);
    const h = laneH - 12;
    const ok = results[i].ok;
    const over = mouseX >= x - 2 && mouseX <= x + bw + 2 && mouseY >= y && mouseY <= y + h;
    if (over) hoveredAct = i;
    if (a.lane === 'answer') {
      stroke('darkgoldenrod');
      strokeWeight(2);
      fill('gold');
      quad(x, y, x + 8, y + h / 2, x, y + h, x - 8, y + h / 2);
      strokeWeight(1);
      noStroke();
      fill('black');
      textSize(10.5);
      textAlign(RIGHT, CENTER);
      text('answered', x - 11, y + h / 2);
      textAlign(LEFT, TOP);
    } else {
      stroke(over ? 'black' : (ok ? EMIT_DARK : 'gray'));
      strokeWeight(over ? 2 : 1);
      fill(ok ? EMIT : 'silver');
      rect(x, y, bw, h, 2);
      strokeWeight(1);
      if (a.lane === 'run' && a.ms > 5000) {
        noStroke();
        fill('white');
        textSize(11);
        text('40 s run', x + 6, y + 2);
      }
    }
    barRects.push({ x, y, w: bw, h });
  });
}

function drawList(r, results) {
  stroke('silver');
  fill('white');
  rect(r.x, r.y, r.w, r.h, 8);
  noStroke();
  fill('black');
  textStyle(BOLD);
  textSize(narrow() ? 13 : 14);
  text('Resulting statements (verb, object, result)', r.x + 8, r.y + 6);
  textStyle(NORMAL);
  const showF = showFilteredBox.checked();
  const rows = [];
  ACTS.forEach((a, i) => { if (results[i].ok || showF) rows.push(i); });
  const lh = min(narrow() ? 15 : 18, (r.h - 30) / max(rows.length, 1));
  const fs = min(narrow() ? 11.5 : 13, lh - 3);
  let y = r.y + 26;
  const c1 = r.x + 8, c2 = r.x + 8 + (narrow() ? 78 : 92);
  for (const i of rows) {
    const a = ACTS[i];
    const ok = results[i].ok;
    const [verb, obj, res] = statementText(a);
    if (i === hoveredAct) { fill(255, 215, 0, 120); rect(r.x + 3, y - 1, r.w - 6, lh, 3); }
    if (a.lane === 'answer') { stroke('darkgoldenrod'); noFill(); rect(r.x + 3, y - 1, r.w - 6, lh, 3); noStroke(); }
    textSize(fs);
    fill(ok ? (a.lane === 'answer' ? 'darkgoldenrod' : EMIT_DARK) : 'darkgray');
    textStyle(BOLD);
    text(ok ? verb : 'filtered', c1, y);
    textStyle(NORMAL);
    fill(ok ? 'black' : 'darkgray');
    const tail = ok ? obj + '  ' + res : obj + '  ' + fmtMs(a.ms) + ' ' + a.lane;
    text(fitText(tail + (a.lane === 'answer' ? '  (no threshold)' : ''), r.x + r.w - 8 - c2), c2, y);
    if (!ok) { stroke('darkgray'); line(c2, y + fs * 0.6, c2 + min(textWidth(tail), r.x + r.w - 8 - c2), y + fs * 0.6); noStroke(); }
    y += lh;
  }
  if (!showF) {
    fill('dimgray');
    textSize(11);
    const nf = results.filter(x => !x.ok).length;
    if (y + 14 < r.y + r.h) text(nf + ' filtered act' + (nf === 1 ? '' : 's') + ' hidden: check "Show statements that were filtered out".', c1, y + 4);
  }
}

function drawReadout(r, results) {
  stroke('silver');
  fill('white');
  rect(r.x, r.y, r.w, r.h, 8);
  noStroke();
  const hv = hoverSlider.value(), mc = misclickSlider.value(), gl = glanceSlider.value();
  const quick = ACTS.filter(a => a.lane === 'hover' && a.ms < 600);
  const longH = ACTS.filter(a => a.lane === 'hover' && a.ms >= 600);
  const noiseH = quick.filter(a => a.ms >= hv).length;
  const lostH = longH.filter(a => a.ms < hv).length;
  const misRun = ACTS.find(a => a.lane === 'run' && a.ms < 250);
  const glance = ACTS.find(a => a.lane === 'page' && a.ms < 1000);
  const look = ACTS.find(a => a.lane === 'page' && a.ms >= 1000);
  const rows = [
    ['Hover', noiseH ? noiseH + ' of 8 crossings' : 'none', lostH ? lostH + ' of 3 long hovers' : 'none'],
    ['Misclick', misRun.ms >= mc ? '120 ms run' : 'none', 'none'],
    ['Glance', glance.ms >= gl ? '0.7 s glance' : 'none', look.ms >= gl ? 'none' : '2.4 s look']
  ];
  const tx = r.x + 10;
  let y = r.y + 6;
  textAlign(LEFT, TOP);
  if (narrow()) {
    fill('black');
    textStyle(BOLD);
    textSize(12);
    text('Likely noise kept / likely attention lost', tx, y);
    textStyle(NORMAL);
    y += 18;
    textSize(11.5);
    for (const rw of rows) {
      fill(rw[1] === 'none' && rw[2] === 'none' ? OK : COST);
      text(rw[0] + ': kept ' + rw[1] + ' / lost ' + rw[2], tx, y);
      y += 15;
    }
    fill('darkgoldenrod');
    text('The answered statement is never filtered.', tx, y + 2);
    return;
  }
  fill('black');
  textStyle(BOLD);
  textSize(14);
  text('What each threshold costs', tx, y);
  textStyle(NORMAL);
  y += 22;
  const cw = (r.w - 20) / 3;
  textSize(12);
  fill('dimgray');
  text('Rule', tx, y);
  text('Likely noise kept', tx + cw * 0.62, y);
  text('Likely attention lost', tx + cw * 1.85, y);
  y += 17;
  stroke('gainsboro');
  line(tx, y - 2, r.x + r.w - 10, y - 2);
  noStroke();
  for (const rw of rows) {
    textSize(12.5);
    fill('black');
    textStyle(BOLD);
    text(rw[0], tx, y + 2);
    textStyle(NORMAL);
    fill(rw[1] === 'none' ? OK : COST);
    text(rw[1], tx + cw * 0.62, y + 2);
    fill(rw[2] === 'none' ? OK : COST);
    text(fitText(rw[2], r.x + r.w - 10 - (tx + cw * 1.85)), tx + cw * 1.85, y + 2);
    y += 20;
  }
  y += 6;
  textSize(12.5);
  fill('black');
  const notes = [];
  if (hv <= 100) notes.push('Hover threshold at ' + hv + ' ms: every crossing becomes an inspection. A pointer sweeping the diagram now looks like careful study, and dashboards will believe it.');
  else if (hv > 700) notes.push('Hover threshold at ' + hv + ' ms is over-strict: hovers of 700 to 1200 ms, long enough to read a label, are thrown away as if they were crossings.');
  if (mc < 120 + 1) notes.push('Misclick threshold at ' + mc + ' ms: the 120 ms mis-click now adds an experienced row of almost zero length to the dwell total.');
  if (gl <= 700) notes.push('Glance threshold at ' + gl + ' ms: the 0.7 s glance at the chart is credited as page dwell.');
  else if (gl > 2400) notes.push('Glance threshold at ' + gl + ' ms: the 2.4 s look at the chart is discarded along with the glance.');
  if (notes.length === 0) notes.push(hv === HOVER_MS && mc === MISCLICK_MS && gl === GLANCE_MS
    ? 'Runtime defaults (600, 250 and 1000 ms): no crossing, mis-click or glance is kept and no longer act is lost in this session.'
    : 'In this session these settings keep no likely noise and lose no likely attention.');
  for (const n of notes) y = drawWrapped(n, tx, y, r.w - 20, 16) + 5;
  fill('darkgoldenrod');
  y = drawWrapped('The answered statement is never filtered: thresholds remove sub-threshold acts, not answers or learners.', tx, y, r.w - 20, 16) + 5;
  const tries = 'Try: hover 0, then 1500; misclick 100; glance 500, then 2500. Hover any bar for its rule.';
  fill('black');
  textSize(12);
  if (y + 90 < r.y + r.h) drawWrapped(tries, tx, y + 6, r.w - 20, 15);
  fill('dimgray');
  textSize(11);
  if (y + 30 < r.y + r.h) drawWrapped('"Likely" rests on the chapter\'s reasons for each constant; no learner data has tested them.', tx, r.y + r.h - 34, r.w - 20, 14);
}

function drawControlLabels() {
  const rowH = 34;
  const labels = [
    ['Hover threshold (ms): ', hoverSlider.value(), HOVER_MS],
    ['Misclick threshold (ms): ', misclickSlider.value(), MISCLICK_MS],
    ['Glance threshold (ms): ', glanceSlider.value(), GLANCE_MS]
  ];
  noStroke();
  textAlign(LEFT, CENTER);
  labels.forEach((l, i) => {
    const y = drawHeight + 21 + i * rowH;
    textSize(narrow() ? 13 : 15);
    fill('black');
    textStyle(BOLD);
    text(l[0], 10, y);
    const lw = textWidth(l[0]);
    fill(l[1] === l[2] ? 'black' : 'darkorange');
    text(l[1], 10 + lw, y);
    textStyle(NORMAL);
  });
  textAlign(LEFT, TOP);
}

function drawTooltip(results) {
  if (hoveredAct < 0) return;
  const a = ACTS[hoveredAct];
  const b = barRects[hoveredAct];
  const res = results[hoveredAct];
  const head = a.lane === 'answer' ? 'Answered question ' + a.obj + ' (success: true)'
    : (a.lane === 'hover' ? 'Hover on ' + a.obj : a.lane === 'run' ? 'Run (Start to Pause)' : 'Page dwell on the chart') + ': ' + fmtMs(a.ms);
  const body = (res.ok ? 'Emitted. ' : 'Filtered. ') + res.rule;
  textSize(13);
  const w = min(340, canvasWidth - 2 * margin);
  const lines = wrapWords(body, w - 16);
  const h = 26 + lines.length * 16 + 6;
  let x = constrain(b.x + b.w / 2 - w / 2, margin, canvasWidth - margin - w);
  let y = b.y + b.h + 8;
  stroke('dimgray');
  fill(255, 255, 240, 250);
  rect(x, y, w, h, 6);
  noStroke();
  fill('black');
  textStyle(BOLD);
  text(head, x + 8, y + 6);
  textStyle(NORMAL);
  fill(res.ok ? EMIT_DARK : 'dimgray');
  lines.forEach((l, i) => text(l, x + 8, y + 26 + i * 16));
}

// ---------- Text helpers ----------
function wrapWords(s, w) {
  const words = String(s).split(' ');
  const lines = [];
  let line = '';
  for (const wd of words) {
    const test = line ? line + ' ' + wd : wd;
    if (textWidth(test) > w && line) { lines.push(line); line = wd; } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function drawWrapped(s, x, y, w, lh) {
  for (const l of wrapWords(s, w)) { text(l, x, y); y += lh; }
  return y;
}

function fitText(s, w) {
  if (textWidth(s) <= w) return s;
  while (s.length > 3 && textWidth(s + '...') > w) s = s.slice(0, -1);
  return s + '...';
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
