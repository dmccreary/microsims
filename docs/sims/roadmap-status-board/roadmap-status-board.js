// Roadmap Status Board
// CANVAS_HEIGHT: 760
// Fourteen cards in two lanes: the five near-term roadmap items from
// Chapter 26 (about one year, each traced to a written source) and, in the
// long-term lane, the five long-term ideas plus the four open problem areas.
// Card color encodes the label: dark steel blue = built, amber = designed,
// grey with a dashed border = hoped for (the label word is also printed on
// the card). Click a card for its source, the test that would show it
// worked, and the main way it could fail. "Quiz me" hides the labels and
// asks the learner to label five cards.

// ---------- canvas layout ----------
let canvasWidth = 700;
let drawHeight = 710;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

// ---------- colors ----------
const INK = [30, 30, 30];
const MUTED = [95, 95, 95];
const LABELS = {
  built: { word: 'Built', fill: [40, 90, 140], text: [255, 255, 255], dashed: false,
    meaning: 'Built: working code exists and a check has run.' },
  designed: { word: 'Designed', fill: [230, 159, 0], text: [0, 0, 0], dashed: false,
    meaning: 'Designed: a written design exists, but the piece is unbuilt or unproven.' },
  hoped: { word: 'Hoped for', fill: [222, 222, 222], text: [0, 0, 0], dashed: true,
    meaning: 'Hoped for: a plausible idea with no design and no data.' }
};
const SPEC = 'No source: speculative.';

// ---------- the fourteen cards (Chapter 26) ----------
const CARDS = [
  // near term
  { lane: 'near', title: 'Verified adapters', label: 'built', chapterLabel: 'Partly built', cardNote: 'partly built',
    source: 'MicroSims 2.0 plan (near-term list); adapter status table in the add-xapi-events-to-microsim skill.',
    test: 'A pilot simulation for each adapter passes check-xapi.py in the real book that contains it.',
    fail: 'An adapter records events the student never caused, such as Leaflet zoomend firing on setView.',
    note: 'p5.js DOM and canvas click, Mermaid and HTML, image overlay, quiz page and Chart.js are verified; vis-network, Plotly, Leaflet and p5.js drags are not.' },
  { lane: 'near', title: 'End-to-end POST path', label: 'designed', chapterLabel: 'Designed, partly built', cardNote: 'partly built',
    source: 'learning-record-store TODO.md (2026-09-26): build the processor, then the identity service, then teach emitters to POST.',
    test: 'A statement typed in a browser is found in the store, with a positive control proving the probe can see writes.',
    fail: 'A salt invented early makes the privacy boundary look tested when it is not.',
    note: 'The gateway is built; no emitter POSTs, and the statements table held zero rows.' },
  { lane: 'near', title: 'Closed-loop generation', label: 'designed', chapterLabel: 'Designed',
    source: 'MicroSims 2.0 plan roadmap: run QA and vision review inside the generator.',
    test: 'Over a fixed batch of specifications, compare first-pass rate and fix cycles with and without the loop.',
    fail: 'The loop raises cost, or hides defects the geometric checks cannot see.' },
  { lane: 'near', title: 'Automated layout repair', label: 'designed', chapterLabel: 'Designed',
    source: 'MicroSims 2.0 plan (near-term list); automates the Chapter 13 repair procedure.',
    test: 'Compare defects left after automated repair with those left after human review on the same MicroSims.',
    fail: 'Height tests see only the bottom edge, so a repair can pass them while a defect elsewhere remains.' },
  { lane: 'near', title: 'Shared sim libraries', label: 'built', chapterLabel: 'Partly built', cardNote: 'partly built',
    source: 'MicroSims 2.0 plan risk list: the lrs-*.js runtime files are copied into each book.',
    test: 'install-runtime.py --check reports no missing or drifted runtime files before each release.',
    fail: 'Copied files, such as a vendored diagram.js, drift apart across books.',
    note: 'The xAPI runtime is identical in every book and a script reports drift; shared posters are still open.' },
  // long term: the five ideas
  { lane: 'long', title: 'Fun and engagement', label: 'hoped',
    test: 'Compare a plain and a playful version of one MicroSim; fun helps only if held-out scores hold or rise as engagement rises.',
    fail: 'A fun MicroSim that produces noisy events is worse for prediction than a dull, clean one.' },
  { lane: 'long', title: 'Diagnostic interaction design', label: 'hoped',
    test: 'Generate MicroSims with and without a diagnostic step and compare how well each predicts the held-out assessment.',
    fail: 'Inferring mastery from an act that was never designed as evidence.' },
  { lane: 'long', title: 'Guess-resistant probes', label: 'hoped',
    test: 'Fit the knowledge-tracing guess parameter from data and confirm that it falls.',
    fail: 'Retry-until-correct keeps only the final success, so a brute-force guesser looks like a knower.' },
  { lane: 'long', title: 'Adaptive difficulty', label: 'hoped',
    test: 'Compare adaptive and fixed versions on held-out gain, and check that prediction fidelity holds once difficulty is recorded.',
    fail: 'Adaptation changes what an event means; no contract extension records difficulty yet.' },
  { lane: 'long', title: 'Learning from aggregate data', label: 'hoped',
    test: 'Apply a learned design rule to new MicroSims and measure whether held-out prediction beats a control set.',
    fail: 'Confounding: a design may look predictive only because stronger learners used it.' },
  // long term: open problem areas
  { lane: 'long', title: 'Privacy (open problem)', label: 'hoped',
    test: 'Show that subtraction across aggregate-only reports cannot reveal an individual.',
    fail: 'Free text lets identity into the stream; suppression, audit and erasure are designed but not built.' },
  { lane: 'long', title: 'Validity (open problem)', label: 'hoped',
    test: 'Show that concept labels match the learning graph and that page dwell is not over-counted before trusting fidelity results.',
    fail: 'Only about 65 percent of quiz concept labels matched exactly, and one statement carries only one concept.' },
  { lane: 'long', title: 'Equity (open problem)', label: 'hoped',
    test: 'Once data exists, compare prediction error across device, bandwidth and assistive-technology groups.',
    fail: 'The same knowledge produces different events on different devices, so access looks like mastery.' },
  { lane: 'long', title: 'Evaluation (open problem)', label: 'hoped',
    test: 'Run the Chapter 19 protocol on real learners: held-out assessment, baseline, calibration, sample-size plan.',
    fail: 'No learner data yet; one activity in two books merges into one rollup, so a learner can look disengaged.' }
];

// ---------- state ----------
let show = { built: true, designed: true, hoped: true };
let selected = 0;
let canvasFocused = false;
let quiz = null;      // { items: [cardIndex], answers: [label|null], pos, done }
let cardRects = [];   // [{i, x, y, w, h}]

// ---------- controls ----------
let builtBox, designedBox, hopedBox, quizButton;
let answerButtons = [], exitButton;
let liveRegion;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  frameRate(20);

  canvas.elt.setAttribute('tabindex', '0');
  canvas.elt.addEventListener('focus', () => { canvasFocused = true; });
  canvas.elt.addEventListener('blur', () => { canvasFocused = false; });
  canvas.elt.addEventListener('keydown', boardKeyDown);

  builtBox = createCheckbox('Built', true);
  designedBox = createCheckbox('Designed', true);
  hopedBox = createCheckbox('Hoped for', true);
  [builtBox, designedBox, hopedBox].forEach((b, k) => {
    b.parent(document.querySelector('main'));
    b.addClass('ctl-row');
    b.changed(() => {
      show = { built: builtBox.checked(), designed: designedBox.checked(), hoped: hopedBox.checked() };
      if (!visible(selected)) selected = firstVisible();
      updateDescription();
    });
  });
  quizButton = createButton('Quiz me');
  quizButton.parent(document.querySelector('main'));
  quizButton.mousePressed(startQuiz);

  // quiz answer buttons (shown only during the quiz)
  ['built', 'designed', 'hoped'].forEach(k => {
    const b = createButton(LABELS[k].word);
    b.parent(document.querySelector('main'));
    b.mousePressed(() => answer(k));
    b.hide();
    answerButtons.push(b);
  });
  exitButton = createButton('Exit quiz');
  exitButton.parent(document.querySelector('main'));
  exitButton.mousePressed(endQuiz);
  exitButton.hide();

  liveRegion = createDiv('');
  liveRegion.parent(document.querySelector('main'));
  liveRegion.addClass('sr-only');
  liveRegion.attribute('aria-live', 'polite');

  layoutControls();
  updateDescription();
}

function draw() {
  updateCanvasSize();
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const wide = canvasWidth >= 600;
  noStroke();
  fill(INK);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  textSize(wide ? 22 : 19);
  text('Roadmap Status Board', canvasWidth / 2, 8);
  textStyle(NORMAL);

  // layout: lanes left + panel right (wide), or lanes then panel below (narrow)
  const laneX = margin;
  const laneW = wide ? Math.floor((canvasWidth - 3 * margin) * 0.6) : canvasWidth - 2 * margin;
  const cols = wide ? (laneW >= 380 ? 3 : 2) : 2;
  const cardH = wide ? 68 : 40;
  const gap = wide ? 10 : 5;
  let y = 38;
  y = drawKey(laneX, y, laneW, wide);

  cardRects = [];
  y = drawLane('near', 'Near term (about one year)', laneX, y, laneW, cols, cardH, gap);
  y += 4;
  y = drawLane('long', 'Long term (speculative)', laneX, y, laneW, cols, cardH, gap);

  // information panel
  let px, py, pw, ph;
  if (wide) { px = laneX + laneW + margin; py = 38; pw = canvasWidth - px - margin; ph = drawHeight - py - margin; }
  else { px = margin; py = y + 4; pw = canvasWidth - 2 * margin; ph = drawHeight - py - margin; }
  if (wide) drawMeanings(laneX, y + 6, laneW);
  drawPanel(px, py, pw, ph);

  // hover tooltip: one line with the card's label
  const h = cardAt(mouseX, mouseY);
  if (h >= 0) {
    const t = quiz && !quiz.done ? 'Label hidden during the quiz.' : LABELS[CARDS[h].label].meaning;
    drawTooltip(t, mouseX, mouseY);
  }
}

function drawKey(x, y, w, wide) {
  // compact key: swatch + word for each label (not shown during an active quiz)
  if (quiz && !quiz.done) {
    noStroke();
    fill(MUTED);
    textSize(13);
    textAlign(LEFT, TOP);
    text('Quiz: labels are hidden.', x, y + 2);
    return y + 22;
  }
  let cx = x;
  textSize(13);
  textAlign(LEFT, CENTER);
  ['built', 'designed', 'hoped'].forEach(k => {
    const L = LABELS[k];
    stroke(L.dashed ? 90 : 60);
    if (L.dashed) drawingContext.setLineDash([4, 3]);
    fill(L.fill);
    rect(cx, y + 3, 22, 14, 3);
    drawingContext.setLineDash([]);
    noStroke();
    fill(INK);
    text(L.word, cx + 27, y + 10);
    cx += 27 + fontWidth(L.word) + 16;
  });
  return y + 24;
}

function visible(i) {
  if (quiz && !quiz.done) return true;
  return show[CARDS[i].label];
}
function firstVisible() {
  for (let i = 0; i < CARDS.length; i++) if (visible(i)) return i;
  return -1;
}

function drawLane(lane, title, x, y, w, cols, cardH, gap) {
  noStroke();
  fill(INK);
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  text(title, x, y);
  textStyle(NORMAL);
  y += 20;
  const idx = CARDS.map((c, i) => i).filter(i => CARDS[i].lane === lane && visible(i));
  const cw = (w - (cols - 1) * gap) / cols;
  const rows = Math.max(1, Math.ceil(idx.length / cols));
  // lane background
  stroke(200);
  fill(255, 255, 255, 110);
  rect(x - 4, y - 4, w + 8, rows * (cardH + gap) + 4, 8);
  if (!idx.length) {
    noStroke();
    fill(MUTED);
    textSize(13);
    text('No cards match the checked labels.', x + 6, y + 6);
  }
  idx.forEach((i, k) => {
    const cx = x + (k % cols) * (cw + gap);
    const cy = y + Math.floor(k / cols) * (cardH + gap);
    cardRects.push({ i, x: cx, y: cy, w: cw, h: cardH });
    drawCard(i, cx, cy, cw, cardH);
  });
  return y + rows * (cardH + gap) + 4;
}

function drawCard(i, x, y, w, h) {
  const c = CARDS[i];
  const hideLabel = quiz && !quiz.done;
  const L = LABELS[c.label];
  const qpos = quiz ? quiz.items.indexOf(i) : -1;
  // body
  if (hideLabel) { fill(255); stroke(120); }
  else { fill(L.fill); stroke(L.dashed ? 80 : 50); }
  strokeWeight(1);
  if (!hideLabel && L.dashed) drawingContext.setLineDash([5, 4]);
  rect(x, y, w, h, 7);
  drawingContext.setLineDash([]);
  // selection / quiz focus outline
  const isCurrent = quiz && !quiz.done && qpos === quiz.pos;
  if (i === selected || isCurrent) {
    noFill();
    stroke(isCurrent ? [200, 60, 0] : [0, 40, 100]);
    strokeWeight(3);
    rect(x - 3, y - 3, w + 6, h + 6, 9);
    strokeWeight(1);
  }
  // text
  noStroke();
  fill(hideLabel ? INK : L.text);
  textAlign(LEFT, TOP);
  const small = h < 50;
  textSize(small ? 12 : 13);
  textStyle(BOLD);
  const tx = x + 7 + (qpos >= 0 ? 18 : 0);
  const tw = w - 14 - (qpos >= 0 ? 18 : 0);
  if (small) text(fitText(c.title, tw), tx, y + 5);
  else wrapText(c.title, tx, y + 6, tw, 15, 2);
  textStyle(NORMAL);
  if (!hideLabel) {
    textSize(11);
    text(L.word + (c.cardNote ? ' (' + c.cardNote + ')' : ''), x + 7, y + h - 15);
  }
  // quiz number badge and result mark
  if (qpos >= 0) {
    fill(255);
    stroke(60);
    circle(x + 13, y + 13, 18);
    noStroke();
    fill(INK);
    textAlign(CENTER, CENTER);
    textSize(11);
    textStyle(BOLD);
    text(qpos + 1, x + 13, y + 13);
    textStyle(NORMAL);
    if (quiz.done) {
      const ok = quiz.answers[qpos] === c.label;
      fill(255);
      stroke(60);
      rect(x + w - 24, y + h - 22, 20, 18, 4);
      noStroke();
      fill(ok ? [0, 110, 80] : [175, 60, 0]);
      textSize(14);
      text(ok ? '✓' : '✗', x + w - 14, y + h - 13);
    }
  }
}

function drawMeanings(x, y, w) {
  // under the lanes on wide screens: what each label means
  if (quiz && !quiz.done) return;
  noStroke();
  textAlign(LEFT, TOP);
  textSize(13);
  fill(MUTED);
  let yy = y + 4;
  ['built', 'designed', 'hoped'].forEach(k => { yy = wrapText(LABELS[k].meaning, x, yy, w, 16) + 2; });
  yy = wrapText('The chapter calls two near-term items "partly built" (shown as Built, since checked code exists for part of each) and the POST path "designed, partly built" (shown as Designed).', x, yy + 4, w, 16);
}

function drawPanel(x, y, w, h) {
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  textAlign(LEFT, TOP);
  let yy = y + 8;
  const tx = x + 10, tw = w - 20;
  if (quiz) { drawQuizPanel(tx, yy, tw); return; }
  if (selected < 0) {
    fill(MUTED);
    textSize(13);
    wrapText('Check at least one label to show cards.', tx, yy, tw, 16);
    return;
  }
  const c = CARDS[selected];
  const L = LABELS[c.label];
  fill(INK);
  textSize(15);
  textStyle(BOLD);
  yy = wrapText(c.title, tx, yy, tw, 18) + 2;
  textSize(13);
  yy = field('Label: ', L.word + (c.chapterLabel && c.chapterLabel !== L.word ? ' (the chapter\'s table says "' + c.chapterLabel + '")' : ''), tx, yy, tw);
  if (w > 300 && canvasWidth >= 600) yy = field('Lane: ', c.lane === 'near' ? 'Near term (about one year)' : 'Long term (speculative)', tx, yy, tw);
  yy = field('Source: ', c.lane === 'near' ? c.source : SPEC, tx, yy, tw);
  yy = field(c.lane === 'near' ? 'Test that would show it worked: ' : 'Required test: ', c.test, tx, yy, tw);
  yy = field('Main way it could fail: ', c.fail, tx, yy, tw);
  if (c.note) yy = field('Status: ', c.note, tx, yy, tw);
}

function drawQuizPanel(tx, yy, tw) {
  textSize(15);
  textStyle(BOLD);
  fill(INK);
  yy = wrapText(quiz.done ? 'Quiz results' : 'Quiz: card ' + (quiz.pos + 1) + ' of 5', tx, yy, tw, 18) + 2;
  textStyle(NORMAL);
  textSize(13);
  if (!quiz.done) {
    const c = CARDS[quiz.items[quiz.pos]];
    fill(INK);
    yy = wrapText('Which label does "' + c.title + '" carry today? Answer with the Built, Designed and Hoped for buttons below. The card is outlined in orange.', tx, yy, tw, 16) + 6;
    fill(MUTED);
    wrapText('Built: working code and a passed check. Designed: a written design, unbuilt or unproven. Hoped for: no design and no data.', tx, yy, tw, 16);
    return;
  }
  const score = quiz.items.filter((ci, k) => quiz.answers[k] === CARDS[ci].label).length;
  fill(INK);
  textStyle(BOLD);
  yy = wrapText(score + ' of 5 correct.', tx, yy, tw, 16) + 2;
  textStyle(NORMAL);
  quiz.items.forEach((ci, k) => {
    const c = CARDS[ci];
    const ok = quiz.answers[k] === c.label;
    fill(ok ? [0, 110, 80] : [175, 60, 0]);
    const line = (k + 1) + '. ' + c.title + ': ' + (ok ? '✓ ' + LABELS[c.label].word
      : '✗ you said ' + LABELS[quiz.answers[k]].word + '; it is ' + LABELS[c.label].word +
        (c.cardNote ? ' (' + c.cardNote + ')' : '')) + '.';
    yy = wrapText(line, tx, yy, tw, 16) + 1;
  });
  fill(MUTED);
  wrapText('Click any card (or press Exit quiz) to leave the quiz and read the source and test of a card, or press Quiz me for five new cards.', tx, yy + 4, tw, 16);
}

function field(label, body, x, y, w) {
  fill(INK);
  textStyle(BOLD);
  const lw = fontWidth(label);
  text(label, x, y);
  textStyle(NORMAL);
  const words = body.split(' ');
  let line = '', cx = x + lw, cw = w - lw, first = true;
  for (const word of words) {
    const t = line ? line + ' ' + word : word;
    if (fontWidth(t) > cw && line) {
      text(line, cx, y); y += 16; line = word;
      if (first) { first = false; cx = x; cw = w; }
    } else line = t;
  }
  if (line) { text(line, cx, y); y += 16; }
  return y + 3;
}

function drawTooltip(t, mx, my) {
  textSize(12);
  const w = fontWidth(t) + 14;
  let x = constrain(mx + 12, 4, canvasWidth - w - 4);
  let y = my + 16;
  if (y + 22 > drawHeight) y = my - 30;
  stroke(80);
  fill(255, 255, 225);
  rect(x, y, w, 22, 4);
  noStroke();
  fill(INK);
  textAlign(LEFT, CENTER);
  text(t, x + 7, y + 11);
}

// ---------- quiz ----------
function startQuiz() {
  // five random cards: three near-term and two long-term, so the quiz is
  // not dominated by the nine hoped-for cards
  const near = shuffle(CARDS.map((c, i) => i).filter(i => CARDS[i].lane === 'near')).slice(0, 3);
  const long = shuffle(CARDS.map((c, i) => i).filter(i => CARDS[i].lane === 'long')).slice(0, 2);
  const items = shuffle(near.concat(long));
  quiz = { items, answers: [null, null, null, null, null], pos: 0, done: false };
  selected = -1;
  [builtBox, designedBox, hopedBox, quizButton].forEach(b => b.hide());
  answerButtons.forEach(b => b.show());
  exitButton.show();
  layoutControls();
  liveRegion.html('Quiz started. Card 1 of 5: ' + CARDS[items[0]].title + '. Which label does it carry?');
  updateDescription();
}

function answer(k) {
  if (!quiz || quiz.done) return;
  quiz.answers[quiz.pos] = k;
  if (quiz.pos < 4) {
    quiz.pos++;
    liveRegion.html('Card ' + (quiz.pos + 1) + ' of 5: ' + CARDS[quiz.items[quiz.pos]].title + '.');
  } else {
    quiz.done = true;
    const score = quiz.items.filter((ci, j) => quiz.answers[j] === CARDS[ci].label).length;
    liveRegion.html('Quiz finished: ' + score + ' of 5 correct. ' + quiz.items.map((ci, j) =>
      CARDS[ci].title + ' is ' + LABELS[CARDS[ci].label].word).join('. ') + '.');
    answerButtons.forEach(b => b.hide());
    quizButton.show();
    layoutControls();
  }
  updateDescription();
}

function endQuiz() {
  quiz = null;
  selected = firstVisible();
  answerButtons.forEach(b => b.hide());
  exitButton.hide();
  [builtBox, designedBox, hopedBox, quizButton].forEach(b => b.show());
  layoutControls();
  updateDescription();
}

// ---------- interaction ----------
function cardAt(mx, my) {
  for (const r of cardRects) if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) return r.i;
  return -1;
}

function mousePressed() {
  const i = cardAt(mouseX, mouseY);
  if (i < 0) return;
  if (quiz && !quiz.done) return;       // during the quiz, answer with the buttons
  if (quiz && quiz.done) { quiz = null; endQuiz(); }
  selected = i;
  updateDescription();
}

function boardKeyDown(e) {
  if (quiz && !quiz.done) {
    const map = { b: 'built', d: 'designed', h: 'hoped' };
    if (map[e.key]) { answer(map[e.key]); e.preventDefault(); }
    return;
  }
  const order = cardRects.map(r => r.i);
  if (!order.length) return;
  let k = order.indexOf(selected);
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { k = (k + 1) % order.length; e.preventDefault(); }
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { k = (k - 1 + order.length) % order.length; e.preventDefault(); }
  else return;
  selected = order[k];
  const c = CARDS[selected];
  liveRegion.html(c.title + ', ' + LABELS[c.label].word + '. Required test: ' + c.test);
  updateDescription();
}

function updateDescription() {
  const vis = CARDS.map((c, i) => i).filter(visible);
  let d = 'Roadmap Status Board. ' + vis.length + ' cards in two lanes, near term (about one year) and long term (speculative). ';
  if (quiz && !quiz.done) {
    d += 'Quiz in progress: labels are hidden; card ' + (quiz.pos + 1) + ' of 5 is ' + CARDS[quiz.items[quiz.pos]].title + '.';
  } else {
    d += vis.map(i => CARDS[i].title + ': ' + LABELS[CARDS[i].label].word).join('; ') + '.';
    if (selected >= 0) d += ' Selected: ' + CARDS[selected].title + '. Required test: ' + CARDS[selected].test;
  }
  describe(d);
}

// ---------- layout helpers ----------
function layoutControls() {
  if (!exitButton) return;
  const items = quiz && !quiz.done ? answerButtons.concat([exitButton])
    : (quiz ? [quizButton, exitButton] : [builtBox, designedBox, hopedBox, quizButton]);
  let x = margin;
  items.forEach(el => {
    el.position(x, drawHeight + 10);
    x += el.elt.offsetWidth + 12;
  });
}

function fitText(s, w) {
  if (fontWidth(s) <= w) return s;
  while (s.length > 3 && fontWidth(s + '…') > w) s = s.slice(0, -1);
  return s + '…';
}

function wrapText(str, x, y, w, lh, maxLines) {
  const words = str.split(' ');
  let line = '', n = 0;
  for (const word of words) {
    const t = line ? line + ' ' + word : word;
    if (fontWidth(t) > w && line) {
      n++;
      if (maxLines && n >= maxLines) { text(fitText(line + ' ' + word, w), x, y); return y + lh; }
      text(line, x, y); y += lh; line = word;
    } else line = t;
  }
  if (line) { text(line, x, y); y += lh; }
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
