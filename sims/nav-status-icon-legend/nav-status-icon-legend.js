// Nav Status Icon Legend
// CANVAS_HEIGHT: 550
// A mock Material for MkDocs navigation sidebar with the five MicroSim status
// icons used by the learning-record-store book (scaffold, built, implemented,
// instrumented, approved). Hover an icon for its nav tooltip, click it for its
// meaning and the batch lifecycle state that usually produces it, take a short
// matching quiz, and switch the sidebar to a dark background to check contrast.

// ---------- canvas layout ----------
let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let sliderLeftMargin = 160;   // no sliders; kept for the standard layout
let defaultTextSize = 16;

// ---------- controls ----------
let quizButton, nextButton, darkCheckbox;

// ---------- data ----------
// Colors and tooltip text are copied from the learning-record-store book's
// docs/css/extra.css and mkdocs.yml (extra.status).
const STATUS = {
  scaffold: {
    color: [211, 47, 47], hex: '#d32f2f', colorName: 'red', shape: 'filled circle',
    tooltip: 'Scaffold — placeholder, not yet implemented',
    meaning: 'A placeholder page: the files exist but the MicroSim is not implemented yet.',
    lifecycle: 'scaffolded',
    lifecycleNote: 'Set when the scaffold exists but the .js file is not yet substantive.',
    quiz: ['a placeholder that is not yet implemented', 'the batch status scaffolded']
  },
  built: {
    color: [245, 124, 0], hex: '#f57c00', colorName: 'orange', shape: 'filled circle',
    tooltip: 'Built — implementation complete, awaiting review',
    meaning: 'The implementation is complete and waiting for a human review.',
    lifecycle: 'validated',
    lifecycleNote: 'Proposed mapping: validated goes to built or approved depending on score.',
    quiz: ['an implementation that is complete but awaiting review', 'validated, but not yet signed off by a reviewer']
  },
  implemented: {
    color: [25, 118, 210], hex: '#1976d2', colorName: 'blue', shape: 'filled circle',
    tooltip: 'Implemented — the MicroSim works',
    meaning: 'The MicroSim works: it has a substantive .js file and runs.',
    lifecycle: 'implemented',
    lifecycleNote: 'The batch status implemented: a .js file with more than 50 lines.',
    quiz: ['a MicroSim that works', 'the batch status implemented']
  },
  instrumented: {
    color: [0, 137, 123], hex: '#00897b', colorName: 'teal', shape: 'broadcast signal',
    tooltip: 'Instrumented — the MicroSim emits xAPI events; add ?xapi=teaching to the URL to see them',
    meaning: 'The MicroSim emits xAPI events.',
    lifecycle: 'none (set after instrumentation)',
    lifecycleNote: 'Not a batch state: sync-status.py --apply sets it on any sim that carries xAPI handling.',
    quiz: ['a MicroSim that emits xAPI events', 'the status sync-status.py --apply sets after xAPI wiring']
  },
  approved: {
    color: [56, 142, 60], hex: '#388e3c', colorName: 'green', shape: 'check circle',
    tooltip: 'Approved — tested and approved',
    meaning: 'Tested and approved by a person.',
    lifecycle: 'validated (plus a sign-off)',
    lifecycleNote: 'A human sign-off. Who sets it is still an open decision; sync-status.py never overwrites it.',
    quiz: ['a MicroSim that was tested and approved', 'a human sign-off that sync-status.py never overwrites']
  }
};
const ORDER = ['scaffold', 'built', 'implemented', 'instrumented', 'approved'];

// Sample nav entries (titles from this book; statuses are illustrative)
const TITLES = ['Batch Generation Pipeline Stepper', 'Sim Status Rule Explorer',
  'Bouncing Ball Gravity Lab', 'xAPI Statement Field Explorer', 'Metadata Section Explorer'];

// ---------- state ----------
let assignment = ORDER.slice();   // status shown on each nav row
let selected = null;              // selected status key
let hoverRow = -1;
let rowRects = [];
let quiz = null;                  // { order:[keys], promptType:[0|1], index, answered, lastClick, correct, attempts }

// Background colors of the mock sidebar
const LIGHT_BG = [255, 255, 255];
const DARK_BG = [30, 33, 41];     // a dark slate similar to Material's dark scheme

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  const mainEl = document.querySelector('main');

  quizButton = createButton('Quiz me');
  quizButton.parent(mainEl);
  quizButton.mousePressed(toggleQuiz);

  nextButton = createButton('Next question');
  nextButton.parent(mainEl);
  nextButton.mousePressed(nextQuestion);
  nextButton.hide();

  darkCheckbox = createCheckbox(' Dark mode', false);
  darkCheckbox.parent(mainEl);

  positionControls();

  describe('A mock documentation navigation sidebar lists five MicroSim titles, each with a colored ' +
    'status icon: a red filled circle for scaffold, an orange filled circle for built, a blue filled ' +
    'circle for implemented, a teal broadcast signal for instrumented, and a green check circle for ' +
    'approved. Hovering an icon shows its nav tooltip; clicking it shows its meaning and the batch ' +
    'lifecycle state that usually produces it. Quiz me asks you to click the icon for a description. ' +
    'Dark mode switches the sidebar to a dark background. Keys 1 to 5 select a nav row.');
}

function positionControls() {
  const y = drawHeight + 12;
  quizButton.position(10, y);
  nextButton.position(100, y);
  darkCheckbox.position(max(235, canvasWidth - 130), y + 2);
}

function isWide() { return canvasWidth >= 600; }

// ---------- geometry ----------
function sidebarRect() {
  if (isWide()) {
    const w = max(260, floor(canvasWidth * 0.42));
    return { x: margin, y: 46, w: w, h: 250 };
  }
  return { x: margin, y: 42, w: canvasWidth - 2 * margin, h: 222 };
}

function detailRect() {
  const s = sidebarRect();
  if (isWide()) return { x: s.x + s.w + 15, y: s.y, w: canvasWidth - (s.x + s.w + 15) - margin, h: drawHeight - s.y - 10 };
  return { x: margin, y: s.y + s.h + 8, w: canvasWidth - 2 * margin, h: drawHeight - (s.y + s.h + 8) - 8 };
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
  textAlign(CENTER, TOP);
  textSize(isWide() ? 22 : 20);
  text('Nav Status Icon Legend', canvasWidth / 2, 10);

  drawSidebar();
  drawDetail();
  if (isWide()) drawHint();
  if (hoverRow >= 0 && !quiz) drawTooltip(STATUS[assignment[hoverRow]].tooltip);
  cursor(hoverRow >= 0 ? HAND : ARROW);
}

function drawSidebar() {
  const s = sidebarRect();
  const dark = darkCheckbox.checked();
  const bg = dark ? DARK_BG : LIGHT_BG;
  const fg = dark ? [226, 228, 233] : [0, 0, 0];
  stroke(dark ? 'black' : 'silver');
  strokeWeight(1);
  fill(bg);
  rect(s.x, s.y, s.w, s.h, 6);

  noStroke();
  fill(fg[0], fg[1], fg[2], 170);
  textAlign(LEFT, TOP);
  textSize(13);
  textStyle(BOLD);
  text('MICROSIMS  (sample nav)', s.x + 14, s.y + 12);
  textStyle(NORMAL);

  rowRects = [];
  hoverRow = -1;
  const rowH = isWide() ? 42 : 36;
  for (let i = 0; i < TITLES.length; i++) {
    const ry = s.y + 36 + i * rowH;
    const r = { x: s.x + 6, y: ry, w: s.w - 12, h: rowH - 4 };
    rowRects.push(r);
    const key = assignment[i];
    const icx = r.x + r.w - 18;
    const icy = ry + (quiz ? r.h / 2 : 12);
    const over = dist(mouseX, mouseY, icx, icy) < 14 ||
      (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h);
    if (over) hoverRow = i;
    const isSel = (!quiz && selected === key) || (quiz && quiz.answered && quiz.lastClick === i);
    if (isSel || over) {
      fill(dark ? [255, 255, 255, 28] : [0, 0, 0, 14]);
      rect(r.x, r.y, r.w, r.h, 4);
    }
    // title
    noStroke();
    fill(fg);
    textSize(14);
    textAlign(LEFT, TOP);
    text(fitText(TITLES[i], r.w - 50), r.x + 8, ry + 4);
    // label under the title (hidden during the quiz)
    if (!quiz) {
      textSize(12);
      fill(fg[0], fg[1], fg[2], 160);
      text('status: ' + key, r.x + 8, ry + 21);
    }
    drawStatusIcon(key, icx, icy, isWide() ? 20 : 18, over);
    if (isSel) {
      noFill();
      stroke(dark ? 'white' : 'black');
      strokeWeight(2);
      circle(icx, icy, 28);
    }
  }
}

// Draw one of the three icon shapes in the status color (darker on hover, like the CSS)
function drawStatusIcon(key, cx, cy, d, darker) {
  const st = STATUS[key];
  const c = darker ? st.color.map(v => v * 0.82) : st.color;
  if (st.shape === 'broadcast signal') {
    noStroke();
    fill(c);
    circle(cx, cy, d * 0.22);
    noFill();
    stroke(c);
    strokeWeight(max(1.8, d * 0.09));
    arc(cx, cy, d * 0.52, d * 0.52, -QUARTER_PI, QUARTER_PI);
    arc(cx, cy, d * 0.52, d * 0.52, PI - QUARTER_PI, PI + QUARTER_PI);
    arc(cx, cy, d * 0.92, d * 0.92, -QUARTER_PI, QUARTER_PI);
    arc(cx, cy, d * 0.92, d * 0.92, PI - QUARTER_PI, PI + QUARTER_PI);
  } else {
    noStroke();
    fill(c);
    circle(cx, cy, d);
    if (st.shape === 'check circle') {
      stroke('white');
      strokeWeight(max(2, d * 0.1));
      noFill();
      beginShape();
      vertex(cx - d * 0.22, cy + d * 0.02);
      vertex(cx - d * 0.06, cy + d * 0.18);
      vertex(cx + d * 0.24, cy - d * 0.14);
      endShape();
    }
  }
  noStroke();
}

function fitText(str, w) {
  if (fontWidth(str) <= w) return str;
  while (str.length > 3 && fontWidth(str + '…') > w) str = str.slice(0, -1);
  return str + '…';
}

function panelBox(r) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(r.x, r.y, r.w, r.h, 8);
  noStroke();
}

function drawDetail() {
  const r = detailRect();
  panelBox(r);
  if (quiz) { drawQuizPanel(r); return; }
  if (!selected) { drawLegendTable(r); return; }

  const st = STATUS[selected];
  const x = r.x + 12;
  let y = r.y + 10;
  const w = r.w - 24;
  const wide = isWide();
  drawStatusIcon(selected, x + 16, y + 16, 30, false);
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(18);
  text(selected, x + 40, y + 2);
  textStyle(NORMAL);
  textSize(13);
  fill('dimgray');
  text(st.colorName + ' ' + st.hex + ', ' + st.shape, x + 40, y + 22);
  y += 42;
  const lead = wide ? 18 : 17;
  textSize(wide ? 14 : 13);
  y = labeled('Nav tooltip', '"' + st.tooltip + '"', x, y, w, lead);
  y = labeled('Meaning', st.meaning, x, y, w, lead);
  y = labeled('Usual lifecycle state', st.lifecycle + '. ' + st.lifecycleNote, x, y, w, lead);
  // contrast of the icon color on the current sidebar background
  const bg = darkCheckbox.checked() ? DARK_BG : LIGHT_BG;
  const cr = contrastRatio(st.color, bg);
  const ok = cr >= 3;
  y = labeled('Contrast on the ' + (darkCheckbox.checked() ? 'dark' : 'light') + ' sidebar',
    cr.toFixed(1) + ':1 ' + (ok ? '(meets the 3:1 guideline for icons)' : '(below the 3:1 guideline for icons)'), x, y, w, lead);
}

// "Label: body" as one wrapped paragraph, label drawn in navy; returns the next y
function labeled(label, body, x, y, w, lead) {
  const full = label + ': ' + body;
  const lines = wrapLines(full, w);
  textAlign(LEFT, TOP);
  for (let i = 0; i < lines.length; i++) {
    let ln = lines[i];
    let lx = x;
    if (i === 0) {
      fill('navy');
      text(label + ':', x, y);
      lx = x + fontWidth(label + ': ');
      ln = ln.slice(label.length + 2);
    }
    fill('black');
    text(ln, lx, y + i * lead);
  }
  return y + lines.length * lead + (isWide() ? 8 : 4);
}

function drawLegendTable(r) {
  const x = r.x + 12;
  let y = r.y + 10;
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(15);
  text('Legend (click an icon for details)', x, y);
  textStyle(NORMAL);
  y += 28;
  const wide = isWide();
  textSize(wide ? 14 : 13);
  const lead = wide ? 18 : 16;
  for (const key of ORDER) {
    drawStatusIcon(key, x + 10, y + 9, 18, false);
    fill('black');
    textStyle(BOLD);
    text(key, x + 28, y + 1);
    textStyle(NORMAL);
    fill('dimgray');
    const mx = x + 28 + (wide ? 0 : 100);
    const my = y + 1 + (wide ? 19 : 0);
    const h = wrapText(STATUS[key].meaning, mx, my, r.x + r.w - mx - 10, lead);
    y = my + h + (wide ? 10 : 6);
  }
}

function drawQuizPanel(r) {
  const x = r.x + 12;
  let y = r.y + 10;
  const w = r.w - 24;
  const lead = 19;
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(15);
  const done = quiz.index >= quiz.order.length;
  text(done ? 'Quiz complete' : 'Question ' + (quiz.index + 1) + ' of ' + quiz.order.length, x, y);
  textAlign(RIGHT, TOP);
  text('Score: ' + quiz.correct + ' / ' + quiz.attempts, r.x + r.w - 12, y);
  textAlign(LEFT, TOP);
  textStyle(NORMAL);
  y += 28;
  textSize(15);
  if (done) {
    y += wrapText('You matched ' + quiz.correct + ' of ' + quiz.attempts + ' on the first try. ' +
      'Press Stop quiz to see the labels again, or Quiz me for a new round.', x, y, w, lead);
    return;
  }
  const key = quiz.order[quiz.index];
  const prompt = STATUS[key].quiz[quiz.promptType[quiz.index]];
  y += wrapText('Click the icon in the nav that means: ' + prompt + '.', x, y, w, lead) + 10;
  if (quiz.answered) {
    const clicked = assignment[quiz.lastClick];
    const right = clicked === key;
    fill(right ? 'darkgreen' : 'firebrick');
    textStyle(BOLD);
    text(right ? 'Correct.' : 'Not quite.', x, y);
    textStyle(NORMAL);
    fill('black');
    y += lead + 2;
    const msg = right
      ? 'The ' + STATUS[key].colorName + ' ' + STATUS[key].shape + ' is ' + key + ': "' + STATUS[key].tooltip + '".'
      : 'You clicked ' + clicked + ' (' + STATUS[clicked].colorName + ' ' + STATUS[clicked].shape + '). The answer is ' +
        key + ', the ' + STATUS[key].colorName + ' ' + STATUS[key].shape + '.';
    wrapText(msg, x, y, w, lead);
  } else {
    fill('dimgray');
    textSize(14);
    wrapText('Labels and tooltips are hidden, and the icons have been shuffled among the titles.', x, y, w, 18);
  }
}

function drawHint() {
  const s = sidebarRect();
  noStroke();
  fill('dimgray');
  textSize(14);
  textAlign(LEFT, TOP);
  const msg = quiz ? 'Keys 1-5 also pick a row.' :
    'Hover an icon to see the tooltip a reader sees in the nav. Click it (or press 1-5) for details. ' +
    'Colors and tooltip text come from the learning-record-store book.';
  wrapText(msg, s.x + 4, s.y + s.h + 12, s.w - 8, 18);
}

// A browser-style tooltip near the mouse
function drawTooltip(msg) {
  textSize(13);
  const maxW = min(300, canvasWidth - 30);
  const lines = wrapLines(msg, maxW - 12);
  let tw = 0;
  for (const l of lines) tw = max(tw, fontWidth(l));
  const th = lines.length * 17 + 8;
  let tx = mouseX + 10;
  let ty = mouseY + 20;
  if (tx + tw + 14 > canvasWidth - 4) tx = canvasWidth - tw - 18;
  if (ty + th > drawHeight - 4) ty = mouseY - th - 10;
  stroke('gray');
  strokeWeight(1);
  fill(250, 250, 250);
  rect(tx, ty, tw + 12, th, 3);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  for (let i = 0; i < lines.length; i++) text(lines[i], tx + 6, ty + 4 + i * 17);
}

function wrapLines(str, w) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (fontWidth(test) > w && line) { lines.push(line); line = word; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

// Draw wrapped text and return its height
function wrapText(str, x, y, w, lead) {
  const lines = wrapLines(str, w);
  textAlign(LEFT, TOP);
  for (let i = 0; i < lines.length; i++) text(lines[i], x, y + i * lead);
  return lines.length * lead;
}

// WCAG relative luminance and contrast ratio
function luminance(c) {
  const ch = c.map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}
function contrastRatio(a, b) {
  const la = luminance(a), lb = luminance(b);
  return (max(la, lb) + 0.05) / (min(la, lb) + 0.05);
}

// ---------- quiz ----------
function toggleQuiz() {
  if (quiz) {
    quiz = null;
    assignment = ORDER.slice();
    quizButton.html('Quiz me');
    nextButton.hide();
    return;
  }
  assignment = shuffle(ORDER.slice());
  quiz = {
    order: shuffle(ORDER.slice()),
    promptType: ORDER.map(() => floor(random(2))),
    index: 0, answered: false, lastClick: -1, correct: 0, attempts: 0
  };
  selected = null;
  quizButton.html('Stop quiz');
  nextButton.hide();
}

function nextQuestion() {
  if (!quiz) return;
  quiz.index++;
  quiz.answered = false;
  quiz.lastClick = -1;
  nextButton.hide();
}

function chooseRow(i) {
  if (i < 0 || i >= TITLES.length) return;
  if (!quiz) { selected = assignment[i]; return; }
  if (quiz.answered || quiz.index >= quiz.order.length) return;
  quiz.answered = true;
  quiz.lastClick = i;
  quiz.attempts++;
  if (assignment[i] === quiz.order[quiz.index]) quiz.correct++;
  nextButton.html(quiz.index + 1 < quiz.order.length ? 'Next question' : 'Finish');
  nextButton.show();
}

// ---------- events ----------
function mousePressed() {
  for (let i = 0; i < rowRects.length; i++) {
    const r = rowRects[i];
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) { chooseRow(i); return; }
  }
}

function keyPressed() {
  if (key >= '1' && key <= '5') chooseRow(int(key) - 1);
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
