// Claim Bucket Sorter - p5.js MicroSim
// CANVAS_HEIGHT: 550
// Learning objective (Evaluate / classify): the learner classifies evidence records for a
// planned claim as VERIFIED, DIRECTIONAL, QUALITATIVE-ONLY or REJECTED, and justifies each
// choice from the quoted passage and the source type. Twelve invented practice records are
// loaded from data.json. Drag the record card into a bucket (or press 1-4); feedback names
// the deciding rule at once. "Show rule" halves the points for that record, and a summary
// screen lists missed records by pattern.

// ---------- canvas layout ----------
let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

// ---------- data and state ----------
let data = null;
let loadState = 'loading';       // 'loading' | 'ready' | 'error'
let records = [];
let index = 0;
let score = 0;
let rulesShown = 0;
let ruleShownNow = false;
let answered = null;             // bucket name chosen for the current record, or null
let results = [];                // {rec, chosen, correct, ruleShown}
let finished = false;

// dragging
let dragging = false;
let dragX = 0, dragY = 0;

// geometry
let card = { x: 0, y: 0, w: 0, h: 0 };
let side = null;                 // definitions panel, or null when narrow
let feedbackBox = { x: 0, y: 0, w: 0, h: 0 };
let bucketRects = [];

// controls
let ruleButton, nextButton, restartButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  ruleButton = createButton('Show rule');
  ruleButton.position(10, drawHeight + 12);
  ruleButton.mousePressed(showRule);
  nextButton = createButton('Next record');
  nextButton.position(105, drawHeight + 12);
  nextButton.mousePressed(nextRecord);
  restartButton = createButton('Restart');
  restartButton.position(215, drawHeight + 12);
  restartButton.mousePressed(restart);

  // the records live in data.json so the sketch can be reused with other records
  loadJSON('data.json', (d) => { data = d; loadState = 'ready'; restart(); },
    () => { loadState = 'error'; });

  describe('Claim Bucket Sorter: drag an evidence record card into one of four buckets, ' +
    'VERIFIED, DIRECTIONAL, QUALITATIVE-ONLY or REJECTED, and read the rule that decides it.', LABEL);
}

function draw() {
  updateCanvasSize();
  computeLayout();

  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(22);
  text('Claim Bucket Sorter', canvasWidth / 2, 8);

  if (loadState !== 'ready') {
    textSize(16);
    fill(loadState === 'error' ? 'firebrick' : 'dimgray');
    textAlign(CENTER, CENTER);
    text(loadState === 'error'
      ? 'Could not load data.json. Open this page through a web server, for example mkdocs serve.'
      : 'Loading records...', margin, 60, canvasWidth - 2 * margin, 200);
    updateButtons();
    return;
  }

  drawStatusLine();
  if (finished) {
    drawSummary();
  } else {
    drawCard();
    if (side) drawSidePanel();
    drawFeedback();
  }
  drawBuckets();
  if (dragging) drawDragChip();
  updateButtons();
}

// ---------- layout ----------
function computeLayout() {
  const top = 58;
  const narrow = canvasWidth < 700;
  const grid = canvasWidth < 500;              // buckets reflow into a 2 x 2 grid
  const bucketTop = grid ? 386 : 408;
  const bucketH = drawHeight - bucketTop - 8;
  const fbH = grid ? 104 : 72;
  if (narrow) {
    side = null;
    card = { x: margin, y: top, w: canvasWidth - 2 * margin, h: bucketTop - fbH - top - 12 };
  } else {
    const sw = 272;
    card = { x: margin, y: top, w: canvasWidth - sw - 3 * margin, h: bucketTop - fbH - top - 12 };
    // the definitions panel runs down to the buckets; feedback sits under the card only
    side = { x: canvasWidth - sw - margin, y: top, w: sw, h: bucketTop - top - 8 };
  }
  feedbackBox = { x: margin, y: card.y + card.h + 6, w: side ? card.w : canvasWidth - 2 * margin, h: fbH };

  bucketRects = [];
  const n = data ? data.buckets.length : 4;
  if (grid) {
    const w = (canvasWidth - 3 * margin) / 2, h = (bucketH - margin) / 2;
    for (let i = 0; i < n; i++) {
      bucketRects.push({ x: margin + (i % 2) * (w + margin), y: bucketTop + floor(i / 2) * (h + margin), w: w, h: h });
    }
  } else {
    const w = (canvasWidth - (n + 1) * margin) / n;
    for (let i = 0; i < n; i++) {
      bucketRects.push({ x: margin + i * (w + margin), y: bucketTop, w: w, h: bucketH });
    }
  }
}

// ---------- drawing ----------
function drawStatusLine() {
  noStroke();
  fill('dimgray');
  textAlign(CENTER, TOP);
  textSize(14);
  const shown = finished ? records.length : index + 1;
  text('Record ' + shown + ' of ' + records.length + '   ·   Score ' + score + ' of ' +
    records.length * data.config.pointsCorrect + '   ·   Rules shown ' + rulesShown,
    canvasWidth / 2, 36);
}

function drawCard() {
  const r = records[index];
  const c = card;
  stroke(dragging ? 'lightgray' : 'gray');
  strokeWeight(1);
  fill(dragging ? 'whitesmoke' : 'white');
  rect(c.x, c.y, c.w, c.h, 10);
  if (dragging) return;

  const lx = c.x + 12, maxW = c.w - 24;
  let y = c.y + 10;
  const bottom = c.y + c.h - 4;
  noStroke();
  textAlign(LEFT, TOP);
  fill('dimgray');
  textSize(13);
  text('PLANNED CLAIM  ·  practice record, invented', lx, y);
  y += 20;

  textStyle(BOLD);
  textSize(16);
  fill('black');
  for (const l of wrapLines(r.claim, maxW)) { text(l, lx, y); y += 20; }
  textStyle(NORMAL);
  y += 6;

  // source-type badge
  textSize(14);
  const badge = 'Source: ' + r.sourceType;
  const bw = min(fontWidth(badge) + 16, maxW);
  fill('lavender');
  stroke('slateblue');
  rect(lx, y, bw, 24, 12);
  noStroke();
  fill('midnightblue');
  textAlign(LEFT, CENTER);
  text(badge, lx + 8, y + 12);
  textAlign(LEFT, TOP);
  y += 32;

  fill('black');
  textSize(15);
  textStyle(ITALIC);
  for (const l of wrapLines('"' + r.passage + '"', maxW)) {
    if (y + 19 > bottom) break;
    text(l, lx, y);
    y += 19;
  }
  textStyle(NORMAL);

  if (!answered) {
    fill('steelblue');
    textSize(13);
    textAlign(RIGHT, BOTTOM);
    text('drag this card into a bucket, or press 1-4', c.x + c.w - 10, c.y + c.h - 6);
  }
}

function drawSidePanel() {
  const s = side;
  stroke('silver');
  fill(255, 255, 255, 235);
  rect(s.x, s.y, s.w, s.h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  let y = s.y + 8;
  fill('black');
  textStyle(BOLD);
  textSize(15);
  text('Bucket definitions', s.x + 10, y);
  textStyle(NORMAL);
  y += 22;
  for (const b of data.buckets) {
    fill(b.color);
    textStyle(BOLD);
    textSize(13);
    text(b.name, s.x + 10, y);
    textStyle(NORMAL);
    y += 16;
    fill('black');
    for (const l of wrapLines(b.definition, s.w - 20)) {
      if (y + 15 > s.y + s.h - 4) break;
      text(l, s.x + 10, y);
      y += 15;
    }
    y += 5;
  }
}

function drawFeedback() {
  const f = feedbackBox;
  const r = records[index];
  let head = '', body = '', col = 'black', bg = null;
  if (answered) {
    const right = answered === r.bucket;
    const pts = right ? (ruleShownNow ? data.config.pointsWithRule : data.config.pointsCorrect) : 0;
    head = right ? 'Correct: ' + r.bucket + ' (+' + pts + ')'
      : 'Not quite: you chose ' + answered + '; this record is ' + r.bucket + '.';
    body = r.rule;
    col = right ? 'darkgreen' : 'firebrick';
    bg = right ? 'honeydew' : 'mistyrose';
  } else if (ruleShownNow) {
    head = 'Rule to apply (this record now scores at most ' + data.config.pointsWithRule + '):';
    body = r.hint;
    col = 'saddlebrown';
    bg = 'lightyellow';
  } else {
    return;
  }
  stroke('silver');
  fill(bg);
  rect(f.x, f.y, f.w, f.h, 8);
  noStroke();
  textAlign(LEFT, TOP);
  let y = f.y + 6;
  textSize(15);
  textStyle(BOLD);
  fill(col);
  for (const l of wrapLines(head, f.w - 20)) { text(l, f.x + 10, y); y += 18; }
  textStyle(NORMAL);
  fill('black');
  textSize(14);
  for (const l of wrapLines(body, f.w - 20)) {
    if (y + 17 > f.y + f.h) break;
    text(l, f.x + 10, y);
    y += 17;
  }
}

function drawBuckets() {
  const hoverB = dragging ? bucketAt(mouseX, mouseY) : -1;
  const r = !finished && records.length ? records[index] : null;
  for (let i = 0; i < bucketRects.length; i++) {
    const b = data.buckets[i], R = bucketRects[i];
    let sw = 2, sc = b.color;
    if (i === hoverB) sw = 5;
    if (r && answered) {
      if (b.name === r.bucket) { sw = 5; sc = 'limegreen'; }
      else if (b.name === answered) { sw = 5; sc = 'red'; }
    }
    stroke(sc);
    strokeWeight(sw);
    fill(i === hoverB ? 'lightyellow' : 'white');
    rect(R.x, R.y, R.w, R.h, 8);
    strokeWeight(1);
    noStroke();
    // colored header strip with the bucket name and its key
    fill(b.color);
    rect(R.x + 3, R.y + 3, R.w - 6, 24, 6);
    fill('white');
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(R.w < 120 ? 12 : 14);
    text((i + 1) + ' ' + b.name, R.x + R.w / 2, R.y + 15);
    textStyle(NORMAL);
    if (R.h > 50) {
      fill('black');
      textSize(13);
      let y = R.y + 34;
      for (const l of wrapLines(b.short, R.w - 12)) {
        if (y + 15 > R.y + R.h) break;
        text(l, R.x + R.w / 2, y + 6);
        y += 16;
      }
    }
  }
}

function drawDragChip() {
  const r = records[index];
  textSize(14);
  // a one-line chip: as many opening words of the claim as fit in 220 px
  const all = r.claim.split(' ');
  let n = min(6, all.length), words = all.slice(0, n).join(' ') + '...';
  while (n > 1 && fontWidth(words) > 220) { n--; words = all.slice(0, n).join(' ') + '...'; }
  const w = fontWidth(words) + 20, h = 34;
  stroke('steelblue');
  strokeWeight(2);
  fill(255, 255, 255, 240);
  rect(mouseX - w / 2, mouseY - h / 2, w, h, 8);
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  text(words, mouseX, mouseY);
  strokeWeight(1);
}

function drawSummary() {
  const x = margin, w = canvasWidth - 2 * margin;
  const top = 58, h = bucketRects[0].y - top - 8;
  stroke('silver');
  fill('white');
  rect(x, top, w, h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  let y = top + 10;
  const correct = results.filter(q => q.correct).length;
  fill('black');
  textStyle(BOLD);
  textSize(17);
  for (const l of wrapLines('Summary: ' + correct + ' of ' + results.length + ' correct, score ' +
    score + ' of ' + results.length * data.config.pointsCorrect, w - 24)) {
    text(l, x + 12, y);
    y += 21;
  }
  textStyle(NORMAL);
  y += 4;
  textSize(14);
  fill('dimgray');
  text('Rules shown: ' + rulesShown + '. Press Restart for a new shuffled round.', x + 12, y);
  y += 24;

  const missed = results.filter(q => !q.correct);
  fill('black');
  textSize(15);
  if (missed.length === 0) {
    text('No missed records. Every bucket was justified by the passage and the source type.', x + 12, y, w - 24);
    return;
  }
  textStyle(BOLD);
  text('Missed records by pattern:', x + 12, y);
  textStyle(NORMAL);
  y += 22;
  // group the misses by the pattern that decides them
  const groups = {};
  for (const q of missed) (groups[q.rec.pattern] = groups[q.rec.pattern] || []).push(q);
  const bottom = top + h - 4;
  textSize(14);
  let shownCount = 0;
  for (const p in groups) {
    if (y + 36 > bottom) break;
    fill('firebrick');
    textStyle(BOLD);
    text(p, x + 12, y);
    textStyle(NORMAL);
    y += 18;
    for (const q of groups[p]) {
      // each miss: the claim (up to two lines), then what was chosen
      const lines = wrapLines('• ' + q.rec.claim, w - 40).slice(0, 2);
      if (y + 17 * (lines.length + 1) > bottom) break;
      fill('black');
      for (const l of lines) { text(l, x + 22, y); y += 17; }
      fill('dimgray');
      text('  you chose ' + q.chosen + '; it was ' + q.rec.bucket, x + 22, y);
      y += 17;
      shownCount++;
    }
    y += 3;
  }
  if (shownCount < missed.length) {
    fill('dimgray');
    text('...and ' + (missed.length - shownCount) + ' more', x + 12, min(y, bottom - 16));
  }
}

// ---------- text helpers ----------
function wrapLines(s, maxW) {
  const words = s.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const t = cur ? cur + ' ' + w : w;
    if (fontWidth(t) > maxW && cur) { lines.push(cur); cur = w; } else { cur = t; }
  }
  if (cur) lines.push(cur);
  return lines;
}

// ---------- interaction ----------
function bucketAt(mx, my) {
  for (let i = 0; i < bucketRects.length; i++) {
    const R = bucketRects[i];
    if (mx >= R.x && mx <= R.x + R.w && my >= R.y && my <= R.y + R.h) return i;
  }
  return -1;
}

function mousePressed() {
  if (loadState !== 'ready' || finished || answered) return;
  if (mouseX >= card.x && mouseX <= card.x + card.w && mouseY >= card.y && mouseY <= card.y + card.h) {
    dragging = true;
    return false;
  }
}

function mouseDragged() {
  if (dragging) return false;          // keep touch drags from scrolling the page
}

function mouseReleased() {
  if (!dragging) return;
  dragging = false;
  const b = bucketAt(mouseX, mouseY);
  if (b >= 0) classify(data.buckets[b].name);
}

function keyPressed() {
  if (loadState !== 'ready' || finished || answered) return;
  const k = parseInt(key, 10);
  if (k >= 1 && k <= data.buckets.length) classify(data.buckets[k - 1].name);
}

function classify(name) {
  const r = records[index];
  answered = name;
  const correct = name === r.bucket;
  if (correct) score += ruleShownNow ? data.config.pointsWithRule : data.config.pointsCorrect;
  results.push({ rec: r, chosen: name, correct: correct, ruleShown: ruleShownNow });
  describe('Record sorted into ' + name + '. ' + (correct ? 'Correct. ' : 'The correct bucket is ' +
    r.bucket + '. ') + r.rule, LABEL);
}

function showRule() {
  if (loadState !== 'ready' || finished || answered || ruleShownNow) return;
  ruleShownNow = true;
  rulesShown++;
}

function nextRecord() {
  if (!answered) return;
  answered = null;
  ruleShownNow = false;
  if (index + 1 >= records.length) {
    finished = true;
    return;
  }
  index++;
}

function restart() {
  if (!data) return;
  records = shuffle(data.records.slice());
  index = 0;
  score = 0;
  rulesShown = 0;
  ruleShownNow = false;
  answered = null;
  results = [];
  finished = false;
}

function updateButtons() {
  const ready = loadState === 'ready';
  setEnabled(ruleButton, ready && !finished && !answered && !ruleShownNow);
  setEnabled(nextButton, ready && !finished && !!answered);
  const label = ready && index + 1 >= records.length ? 'See summary' : 'Next record';
  if (nextButton.html() !== label) nextButton.html(label);
  setEnabled(restartButton, ready);
}

// change the disabled attribute only when it differs, since this runs every frame
function setEnabled(btn, on) {
  const off = btn.elt.disabled;
  if (on && off) btn.removeAttribute('disabled');
  if (!on && !off) btn.attribute('disabled', '');
}

// ---------- responsive design ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.floor(container.getBoundingClientRect().width);
  }
}
