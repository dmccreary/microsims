// Reuse Threshold Explorer
// CANVAS_HEIGHT: 675
// Move the reuse and template thresholds of find-similar-templates.py (reuse
// mode) and see which documented similarity scores land in the wrong band.
// Every number comes from the tool's README: default thresholds 0.75 and 0.60,
// score ranges 0.73-0.86 (same concept), 0.53-0.69 (related but different),
// 0.43-0.51 (absent), and a Coulomb's law probe at 0.730.

// ---------- canvas layout ----------
let canvasWidth = 400;
let drawHeight = 560;
let controlHeight = 115;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 215;
let defaultTextSize = 16;

// ---------- controls ----------
let reuseSlider, templateSlider, resetButton, misCheckbox;

// ---------- documented data (README, recalibrated 2026-07-15, 1,411-sim catalog) ----------
const DEFAULT_REUSE = 0.75;
const DEFAULT_TEMPLATE = 0.60;
const AXIS_MIN = 0.40, AXIS_MAX = 0.90;
const RANGES = [
  { name: 'Same concept', lo: 0.73, hi: 0.86, expect: 'reuse', color: 'seagreen',
    desc: 'Same-concept matches scored 0.73 to 0.86 (reported by the tool\'s author). These should be sent to reuse.' },
  { name: 'Related but different', lo: 0.53, hi: 0.69, expect: 'template', color: 'darkorange',
    desc: 'Related-but-different concepts scored 0.53 to 0.69 (reported by the tool\'s author). These should become templates, never reuse.' },
  { name: 'Absent concept', lo: 0.43, hi: 0.51, expect: 'generate', color: 'slategray',
    desc: 'Absent concepts scored 0.43 to 0.51 (reported by the tool\'s author). Nothing close exists, so these should be generated from scratch.' }
];
const PROBE = { name: 'Coulomb\'s law probe', score: 0.730, expect: 'reuse',
  desc: 'A genuine same-concept probe about Coulomb\'s law scored 0.730, just under the default 0.75 reuse threshold (reported by the tool\'s author).' };
const BAND_COLORS = { generate: [226, 232, 240], template: [255, 236, 204], reuse: [214, 240, 222] };
const BAND_TEXT = { generate: 'slategray', template: 'darkorange', reuse: 'seagreen' };

let clampNote = '';
let clampTime = 0;
let hoverItem = null;   // { desc } of the bar or probe under the mouse

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  const mainEl = document.querySelector('main');

  reuseSlider = createSlider(0.60, 0.90, DEFAULT_REUSE, 0.01);
  reuseSlider.parent(mainEl);
  reuseSlider.input(() => enforceOrder('reuse'));

  templateSlider = createSlider(0.40, 0.75, DEFAULT_TEMPLATE, 0.01);
  templateSlider.parent(mainEl);
  templateSlider.input(() => enforceOrder('template'));

  resetButton = createButton('Reset to defaults');
  resetButton.parent(mainEl);
  resetButton.mousePressed(() => { reuseSlider.value(DEFAULT_REUSE); templateSlider.value(DEFAULT_TEMPLATE); clampNote = ''; });

  misCheckbox = createCheckbox(' Show misclassified', true);
  misCheckbox.parent(mainEl);

  positionControls();

  describe('A horizontal similarity-score axis from 0.40 to 0.90 is shaded into generate, template ' +
    'and reuse bands by two threshold lines. Three bars show the score ranges the tool\'s author ' +
    'reported for same-concept, related and absent matches, and a diamond marks the Coulomb\'s law ' +
    'probe at 0.730. Sliders move the reuse and template thresholds; a panel lists which parts of each ' +
    'range fall in the wrong band, as missed reuse or false reuse.');
}

function positionControls() {
  const y0 = drawHeight + 8;
  reuseSlider.position(sliderLeftMargin, y0);
  reuseSlider.size(canvasWidth - sliderLeftMargin - margin);
  templateSlider.position(sliderLeftMargin, y0 + 35);
  templateSlider.size(canvasWidth - sliderLeftMargin - margin);
  resetButton.position(10, y0 + 72);
  misCheckbox.position(160, y0 + 74);
}

// The reuse threshold may never be below the template threshold
function enforceOrder(moved) {
  const r = reuseSlider.value(), t = templateSlider.value();
  if (r < t - 1e-9) {
    if (moved === 'reuse') reuseSlider.value(t);
    else templateSlider.value(r);
    clampNote = 'The reuse threshold cannot be set below the template threshold.';
    clampTime = millis();
  }
}

function thresholds() {
  return { r: round(reuseSlider.value() * 100) / 100, t: round(templateSlider.value() * 100) / 100 };
}

// Band for a single score
function bandOf(score, th) {
  if (score >= th.r - 1e-9) return 'reuse';
  if (score >= th.t - 1e-9) return 'template';
  return 'generate';
}

// Split a closed range [lo, hi] into the parts that fall in each band:
// generate: score < t, template: t <= score < r, reuse: score >= r
function splitRange(lo, hi, th) {
  const e = 1e-9;
  const parts = [];
  if (lo < th.t - e) parts.push({ band: 'generate', a: lo, b: min(hi, th.t), upperOpen: hi >= th.t - e });
  const ta = max(lo, th.t);
  if (hi >= th.t - e && ta < th.r - e) parts.push({ band: 'template', a: ta, b: min(hi, th.r), upperOpen: hi >= th.r - e });
  if (hi >= th.r - e) parts.push({ band: 'reuse', a: max(lo, th.r), b: hi, upperOpen: false });
  return parts;
}

function fmt(v) { return nf(v, 1, 2); }

// ---------- drawing ----------
function draw() {
  updateCanvasSize();
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const th = thresholds();
  const wide = canvasWidth >= 600;
  const axL = margin + 6, axR = canvasWidth - margin - 6;
  const xOf = s => map(s, AXIS_MIN, AXIS_MAX, axL, axR);
  const bandTop = 76, bandBot = 256;

  // shaded bands first
  noStroke();
  const bands = [['generate', AXIS_MIN, th.t], ['template', th.t, th.r], ['reuse', th.r, AXIS_MAX]];
  for (const [b, a, c] of bands) {
    if (c <= a) continue;
    fill(BAND_COLORS[b]);
    rect(xOf(a), bandTop, xOf(c) - xOf(a), bandBot - bandTop);
    // band name at the top when there is room
    textSize(13);
    textStyle(BOLD);
    if (xOf(c) - xOf(a) > textWidth(b) + 6) {
      fill(BAND_TEXT[b]);
      textAlign(CENTER, TOP);
      text(b, (xOf(a) + xOf(c)) / 2, bandTop + 4);
    }
    textStyle(NORMAL);
  }

  // axis with ticks
  stroke('black');
  strokeWeight(1);
  line(axL, bandBot, axR, bandBot);
  const step = wide ? 0.05 : 0.10;
  for (let s = AXIS_MIN; s <= AXIS_MAX + 1e-9; s += step) {
    const x = xOf(s);
    stroke('black');
    line(x, bandBot, x, bandBot + 5);
    noStroke();
    fill('black');
    textSize(12);
    textAlign(CENTER, TOP);
    text(fmt(s), x, bandBot + 7);
  }
  noStroke();
  textSize(13);
  textAlign(CENTER, TOP);
  fill('dimgray');
  text('WHAT similarity score (cosine)', (axL + axR) / 2, bandBot + 22);

  // title (after the background layers)
  fill('black');
  textSize(wide ? 22 : 20);
  textAlign(CENTER, TOP);
  text('Reuse Threshold Explorer', canvasWidth / 2, 8);
  textSize(13);
  fill('dimgray');
  text(wide ? 'Score ranges reported by the tool\'s author (find-similar-templates README)' :
    'Ranges reported by the tool\'s author (README)', canvasWidth / 2, 34);

  // range bars and probe
  hoverItem = null;
  const showMis = misCheckbox.checked();
  const rowY = [118, 164, 210];
  for (let i = 0; i < RANGES.length; i++) {
    const R = RANGES[i];
    const y = rowY[i];
    const x1 = xOf(R.lo), x2 = xOf(R.hi);
    noStroke();
    fill(R.color);
    rect(x1, y, x2 - x1, 14, 4);
    if (showMis) {
      for (const p of splitRange(R.lo, R.hi, th)) {
        if (p.band === R.expect) continue;
        const px1 = xOf(p.a), px2 = max(xOf(p.b), px1 + 3);
        fill(220, 20, 60, 90);
        stroke('crimson');
        strokeWeight(2);
        rect(px1, y - 3, px2 - px1, 20, 3);
      }
    }
    // label above the bar, kept inside the canvas
    noStroke();
    fill('black');
    textSize(13);
    textAlign(LEFT, BOTTOM);
    const label = R.name + ' ' + fmt(R.lo) + '–' + fmt(R.hi);
    const lx = constrain(x1, axL, axR - textWidth(label));
    fill(255, 255, 255, 170);
    rect(lx - 2, y - 19, textWidth(label) + 4, 16, 3);
    fill('black');
    text(label, lx, y - 3);
    if (mouseX >= x1 - 2 && mouseX <= x2 + 2 && mouseY >= y - 18 && mouseY <= y + 16) hoverItem = R;
  }
  // probe diamond on its own row
  const py = 238;
  const px = xOf(PROBE.score);
  const probeBand = bandOf(PROBE.score, th);
  const probeWrong = probeBand !== PROBE.expect;
  stroke(showMis && probeWrong ? 'crimson' : 'black');
  strokeWeight(showMis && probeWrong ? 3 : 1.5);
  fill('seagreen');
  quad(px, py - 9, px + 8, py, px, py + 9, px - 8, py);
  noStroke();
  fill('black');
  textSize(13);
  const plabel = PROBE.name + ' 0.730';
  if (px + 12 + textWidth(plabel) < axR) { textAlign(LEFT, CENTER); text(plabel, px + 12, py); }
  else { textAlign(RIGHT, CENTER); text(plabel, px - 12, py); }
  if (dist(mouseX, mouseY, px, py) < 12) hoverItem = PROBE;

  // threshold lines, colored by the band they open
  drawThreshold(xOf(th.t), bandTop, bandBot, 'darkorange', 'template ≥ ' + fmt(th.t), 'left');
  drawThreshold(xOf(th.r), bandTop, bandBot, 'seagreen', 'reuse ≥ ' + fmt(th.r), 'right');

  drawReadout(th, margin, bandBot + 44, canvasWidth - 2 * margin, drawHeight - (bandBot + 44) - 8);
  drawControlLabels(th);
  if (hoverItem) drawTooltip(hoverItem.desc);
}

function drawThreshold(x, y1, y2, col, label, side) {
  stroke(col);
  strokeWeight(3);
  line(x, y1, x, y2);
  noStroke();
  fill(col);
  textSize(12);
  textStyle(BOLD);
  textAlign(side === 'left' ? RIGHT : LEFT, TOP);
  const tx = side === 'left' ? x + 1 : x - 1;
  const ty = y1 - 18;
  // a white backing keeps the label readable over the bars
  const tw = textWidth(label);
  fill(255, 255, 255, 210);
  rect(side === 'left' ? tx - tw - 2 : tx - 2, ty - 1, tw + 4, 15, 3);
  fill(col);
  text(label, tx, ty);
  textStyle(NORMAL);
}

// Sentences about each documented item under the current thresholds
function outcomeSentences(th) {
  const out = [];
  let missedReuse = false, falseReuse = false;
  for (const R of RANGES) {
    const wrong = splitRange(R.lo, R.hi, th).filter(p => p.band !== R.expect);
    if (!wrong.length) {
      out.push({ ok: true, text: R.name + ' (' + fmt(R.lo) + '–' + fmt(R.hi) + '): all sent to ' + R.expect + '.' });
      continue;
    }
    for (const p of wrong) {
      const span = (p.b - p.a < 0.005) ? 'a score of ' + fmt(p.a) : 'scores from ' + fmt(p.a) + (p.upperOpen ? ' to just under ' : ' to ') + fmt(p.b);
      let kind = '';
      if (R.expect === 'reuse') { kind = ' (missed reuse)'; missedReuse = true; }
      if (p.band === 'reuse') { kind = ' (false reuse)'; falseReuse = true; }
      if (R.expect === 'template' && p.band === 'generate') kind = ' (missed template)';
      if (R.expect === 'generate' && p.band === 'template') kind = ' (false template)';
      out.push({ ok: false, text: R.name + ': ' + span + ' would be sent to ' + p.band + ', not ' + R.expect + kind + '.' });
    }
  }
  const pb = bandOf(PROBE.score, th);
  if (pb !== 'reuse') { missedReuse = true; out.push({ ok: false, text: 'Coulomb\'s law probe would be sent to ' + pb + ', not reuse.' }); }
  else out.push({ ok: true, text: 'Coulomb\'s law probe (0.730) is sent to reuse.' });
  return { out, missedReuse, falseReuse };
}

function drawReadout(th, x, y, w, h) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  const res = outcomeSentences(th);
  const ix = x + 10, iw = w - 20;
  let yy = y + 8;
  // headline: the two kinds of error
  textSize(15);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  fill(res.missedReuse ? 'firebrick' : 'darkgreen');
  const a = 'Missed reuse: ' + (res.missedReuse ? 'yes' : 'none');
  text(a, ix, yy);
  fill(res.falseReuse ? 'firebrick' : 'darkgreen');
  const bx = ix + textWidth(a) + 24;
  if (bx + 120 < ix + iw) text('False reuse: ' + (res.falseReuse ? 'yes' : 'none'), bx, yy);
  else { yy += 19; text('False reuse: ' + (res.falseReuse ? 'yes' : 'none'), ix, yy); }
  textStyle(NORMAL);
  yy += 24;
  const narrow = canvasWidth < 600;
  textSize(narrow ? 13 : 14);
  if (misCheckbox.checked()) {
    for (const s of res.out) {
      fill(s.ok ? 'dimgray' : 'crimson');
      yy += wrapText((s.ok ? '✓ ' : '✗ ') + s.text, ix, yy, iw, narrow ? 17 : 18) + (narrow ? 1 : 2);
    }
  } else {
    fill('dimgray');
    yy += wrapText('Check Show misclassified to list the parts of each range that land in the wrong band.', ix, yy, iw, 18) + 2;
  }
  if (clampNote && millis() - clampTime < 4000) {
    fill('darkorange');
    yy += wrapText(clampNote, ix, yy + 2, iw, 18) + 2;
  }
  // the author's reason for staying conservative, pinned to the panel bottom
  textSize(13);
  fill('black');
  textStyle(ITALIC);
  const why = 'Author\'s rationale (tool source): keep the reuse threshold conservative, because a false reuse, ' +
    'the wrong sim embedded in a published book, costs more than regenerating.';
  const lines = wrapLines(why, iw);
  const wy = y + h - lines.length * 17 - 6;
  if (wy > yy) for (let i = 0; i < lines.length; i++) text(lines[i], ix, wy + i * 17);
  textStyle(NORMAL);
}

function drawControlLabels(th) {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  const y0 = drawHeight + 8;
  text('Reuse threshold: ' + fmt(th.r), 10, y0 + 10);
  text('Template threshold: ' + fmt(th.t), 10, y0 + 45);
}

function drawTooltip(msg) {
  textSize(13);
  const w = min(300, canvasWidth - 20);
  const lines = wrapLines(msg, w - 12);
  const h = lines.length * 17 + 10;
  let tx = constrain(mouseX - w / 2, 6, canvasWidth - w - 6);
  let ty = mouseY + 18;
  if (ty + h > drawHeight - 4) ty = mouseY - h - 12;
  stroke('gray');
  strokeWeight(1);
  fill('lightyellow');
  rect(tx, ty, w, h, 5);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  for (let i = 0; i < lines.length; i++) text(lines[i], tx + 6, ty + 5 + i * 17);
}

function wrapLines(str, w) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (textWidth(test) > w && line) { lines.push(line); line = word; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function wrapText(str, x, y, w, lead) {
  const lines = wrapLines(str, w);
  textAlign(LEFT, TOP);
  for (let i = 0; i < lines.length; i++) text(lines[i], x, y + i * lead);
  return lines.length * lead;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
}
