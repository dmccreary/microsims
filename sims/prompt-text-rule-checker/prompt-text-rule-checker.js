// Prompt Text Rule Checker - judge each line of an image prompt against the text-free image rule
// CANVAS_HEIGHT: 600
// Learning objective (Evaluate / judge): the learner judges whether a line of an image prompt is
// safe for a callout overlay or violates the text-free image rule, and justifies the judgment.
//
// A run shows a shuffled draft prompt of 10 lines (8 on narrow screens), half safe and half
// risky, drawn from a pool of 16. Click a line, then judge it with a button. The row turns green
// for a correct judgment and red for an incorrect one, and the explanation appears below the list.

// ---------- Canvas dimensions (standard MicroSim layout) ----------
let canvasWidth = 400;                 // updated from the container width
let drawHeight = 520;                  // drawing region (aliceblue)
let controlHeight = 80;                // control region (white): 2 rows x 35 + 10
let canvasHeight = drawHeight + controlHeight;   // 600
let margin = 25;
let defaultTextSize = 16;

// ---------- The pool of prompt lines ----------
// safe: true when the line keeps the image text-free
const POOL = [
  { text: 'Background: clean white (#FFFFFF).', safe: true,
    why: 'A background color gives the model nothing to write.' },
  { text: 'Format: PNG, 1200 x 900 px, landscape 4:3.', safe: true,
    why: 'The size describes the file, not something to draw, so no digits end up in the picture.' },
  { text: 'Style: flat scientific illustration for a college course.', safe: true,
    why: 'A drawing style shapes how things look without asking for any lettering.' },
  { text: 'Nucleus: large round purple structure, centered 40% from the left and 16% from the top.', safe: true,
    why: 'Positions in words and percentages place the structure; they are read, not drawn.' },
  { text: 'Leave at least 8% of the width between neighboring structures.', safe: true,
    why: 'Spacing leaves room for the overlay\'s markers without adding any marks.' },
  { text: 'Mitochondria: three orange bean shapes with folded inner membranes.', safe: true,
    why: 'Describing shape and color draws the structure without naming it in the image.' },
  { text: 'This image must contain absolutely no text, labels, arrows or numbers.', safe: true,
    why: 'This is the template\'s Critical Rule: it mentions text only to forbid it.' },
  { text: 'Colors: membrane #C0392B, cytoplasm #FDEBD0, nucleus #8E44AD.', safe: true,
    why: 'Hex codes pin the colors; the model reads them and does not draw them.' },
  { text: 'Add the title Animal Cell across the top.', safe: false,
    why: 'A title is text baked into pixels, and the engine already renders the title from data.json.',
    rewrite: 'Leave a clean white band across the top, with no title or heading.' },
  { text: 'Label each organelle with its name.', safe: false,
    why: 'Labels belong in data.json; names baked into the image cannot be corrected, translated or searched.',
    rewrite: 'Draw each organelle clearly and distinctly, with no labels.' },
  { text: 'Draw arrows pointing to the nucleus.', safe: false,
    why: 'Arrows and pointer lines are the engine\'s job; drawn ones collide with its leader lines.',
    rewrite: 'Make the nucleus large and clearly visible, with no arrows or lines pointing to it.' },
  { text: 'Number the structures 1 to 4 in small circles.', safe: false,
    why: 'The engine draws its own numbered markers; printed numbers would duplicate them.',
    rewrite: 'Keep every structure free of marks; the overlay adds the numbered markers.' },
  { text: 'Include a legend box in the lower-right corner that explains the colors.', safe: false,
    why: 'A legend is text, and it would sit underneath the overlay\'s markers and panels.',
    rewrite: 'Use one consistent color per organelle type, with no legend or key box.' },
  { text: 'Show the cell on a microscope slide with the specimen name written on it.', safe: false,
    why: 'Asking for writing on an object invites lettering, which image models often garble.',
    rewrite: 'Show the cell alone on a white background, with no slide, sign or lettering.' },
  { text: 'Make it look like a labeled diagram from a biology textbook.', safe: false,
    why: 'Naming a labeled-diagram style invites labels even though none are listed.',
    rewrite: 'Style: clean flat illustration, like an unlabeled textbook figure.' },
  { text: 'Add a caption under the cell that reads Figure 1.', safe: false,
    why: 'A caption is text in the image; the overlay\'s description field does that job.',
    rewrite: 'Leave the area under the cell empty and white, with no caption.' }
];

// ---------- State ----------
let lines = [];                        // this run: [{...pool item, judged, said, correct}]
let selected = 0;
let lastJudged = null;                 // index of the most recently judged line
let showRewrite = false;
let correct = 0, attempts = 0;
let rowBoxes = [];                     // hit regions {i, x, y, w, h}
let listFont = 16;

// ---------- Controls ----------
let safeButton, riskyButton, rewriteButton, newButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  safeButton = createButton('Keeps image text-free');
  safeButton.mousePressed(() => judge(true));
  riskyButton = createButton('Risks text in image');
  riskyButton.mousePressed(() => judge(false));
  rewriteButton = createButton('Show rewrite');
  rewriteButton.mousePressed(() => { showRewrite = true; updateButtons(); });
  newButton = createButton('New prompt');
  newButton.mousePressed(newRun);
  styleButtons();
  newRun();
}

function styleButtons() {
  const fs = canvasWidth < 500 ? '14px' : '16px';
  for (const b of [safeButton, riskyButton, rewriteButton, newButton]) {
    b.style('font-size', fs);
    b.style('padding', canvasWidth < 500 ? '3px 7px' : '4px 12px');
  }
  safeButton.style('background-color', '#dcfce7');
  riskyButton.style('background-color', '#fee2e2');
  positionButtons();
}

function positionButtons() {
  let x = 10;
  for (const b of [safeButton, riskyButton]) { b.position(x, drawHeight + 7); x += b.elt.offsetWidth + 10; }
  x = 10;
  for (const b of [rewriteButton, newButton]) { b.position(x, drawHeight + 43); x += b.elt.offsetWidth + 10; }
}

function newRun() {
  const n = canvasWidth >= 600 ? 10 : 8;
  const safe = shuffle(POOL.filter(p => p.safe)).slice(0, n / 2);
  const risky = shuffle(POOL.filter(p => !p.safe)).slice(0, n / 2);
  lines = shuffle(safe.concat(risky)).map(p => Object.assign({}, p, { judged: false, said: null, correct: null }));
  selected = 0;
  lastJudged = null;
  showRewrite = false;
  correct = 0;
  attempts = 0;
  updateButtons();
  updateDescription();
}

// ---------- Draw ----------
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
  textSize(canvasWidth < 500 ? 19 : 22);
  text('Prompt Text Rule Checker', canvasWidth / 2, 8);
  textSize(14);
  fill(70);
  const sub = canvasWidth < 500 ? 'Draft image-prompt.md for a cell overlay'
    : 'Draft image prompt for an animal-cell callout overlay (image-prompt.md)';
  text(sub, canvasWidth / 2, 36);

  const panelH = canvasWidth < 500 ? 112 : 104;
  const listTop = 58;
  drawList(listTop, drawHeight - panelH - 12);
  drawPanel(drawHeight - panelH - 6, panelH);
  drawScore();
}

function wrapLines(str, maxW) {
  const words = str.split(' ');
  const out = [];
  let line = '';
  for (const w of words) {
    const t = line ? line + ' ' + w : w;
    if (fontWidth(t) <= maxW || !line) line = t;
    else { out.push(line); line = w; }
  }
  if (line) out.push(line);
  return out;
}

function layoutRows(fs, top, bottom) {
  textSize(fs);
  const badgeW = canvasWidth < 500 ? 70 : 96;
  const textW = canvasWidth - 20 - 34 - badgeW - 10;
  const lh = fs * 1.25;
  const rows = [];
  let y = top;
  for (let i = 0; i < lines.length; i++) {
    const wrapped = wrapLines(lines[i].text, textW);
    const h = wrapped.length * lh + 10;
    rows.push({ i, x: 10, y, w: canvasWidth - 20, h, wrapped, lh, badgeW });
    y += h + 4;
  }
  return { rows, bottom: y };
}

function drawList(top, bottom) {
  // largest font (16 down to 12) at which the whole prompt fits: row height scales with width
  let L;
  for (listFont = 16; listFont >= 12; listFont--) {
    L = layoutRows(listFont, top, bottom);
    if (L.bottom <= bottom) break;
  }
  rowBoxes = L.rows;
  for (const r of L.rows) {
    const ln = lines[r.i];
    let bg = 'white', border = color(190);
    if (ln.judged) bg = ln.correct ? '#dcfce7' : '#fee2e2';
    if (r.i === selected) border = color(30, 64, 175);
    stroke(border);
    strokeWeight(r.i === selected ? 2.5 : 1);
    fill(bg);
    rect(r.x, r.y, r.w, r.h, 6);
    // line number
    noStroke();
    fill(110);
    textSize(listFont - 2);
    textAlign(RIGHT, TOP);
    text((r.i + 1) + '.', r.x + 26, r.y + 6);
    // the prompt line itself, wrapped inside its row
    fill(20);
    textSize(listFont);
    textAlign(LEFT, TOP);
    let ty = r.y + 5;
    for (const w of r.wrapped) { text(w, r.x + 34, ty); ty += r.lh; }
    // judgment badge: symbol + class, so color is never the only signal
    if (ln.judged) {
      textAlign(RIGHT, TOP);
      textSize(listFont - 1);
      textStyle(BOLD);
      fill(ln.correct ? '#14532d' : '#991b1b');
      text((ln.correct ? '✓ ' : '✗ ') + (ln.safe ? 'safe' : 'risky'), r.x + r.w - 8, r.y + 5);
      textStyle(NORMAL);
    }
  }
}

function drawPanel(y, h) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(10, y, canvasWidth - 20, h, 8);
  noStroke();
  textAlign(LEFT, TOP);
  const w = canvasWidth - 40;
  if (attempts === lines.length) {
    fill('black');
    textSize(15);
    textStyle(BOLD);
    text('All ' + lines.length + ' lines judged: ' + correct + ' correct.', 20, y + 8, w);
    textStyle(NORMAL);
    textSize(14);
    fill(50);
    const last = lastJudged !== null ? lines[lastJudged] : null;
    let body = 'Press New prompt for a different draft. ';
    if (last) body += 'Last line: ' + (last.safe ? 'safe' : 'risky') + '. ' + last.why +
      (showRewrite && last.rewrite ? ' Rewrite: "' + last.rewrite + '"' : '');
    text(body, 20, y + 30, w, h - 34);
    return;
  }
  const ln = lines[selected];
  fill('black');
  textSize(15);
  textStyle(BOLD);
  if (!ln.judged) {
    text('Line ' + (selected + 1) + ': is it safe for a callout overlay?', 20, y + 8, w);
    textStyle(NORMAL);
    textSize(14);
    fill(50);
    text('A line is risky if it could make the model put letters, numbers, arrows, labels, a title or ' +
      'any other marks into the picture. Choose a button below.', 20, y + 30, w, h - 34);
    return;
  }
  fill(ln.correct ? '#14532d' : '#991b1b');
  text((ln.correct ? 'Correct: ' : 'Not quite: ') + 'line ' + (selected + 1) + ' ' +
    (ln.safe ? 'keeps the image text-free.' : 'risks text in the image.'), 20, y + 8, w);
  textStyle(NORMAL);
  textSize(14);
  fill(40);
  let body = 'Why: ' + ln.why;
  if (!ln.safe) {
    body += showRewrite ? '\nSafe rewrite: "' + ln.rewrite + '"' : '\nPress Show rewrite for a safe replacement.';
  }
  text(body, 20, y + 30, w, h - 34);
}

function drawScore() {
  noStroke();
  fill('black');
  textSize(canvasWidth < 500 ? 14 : 16);
  textAlign(RIGHT, CENTER);
  text('Score: ' + correct + ' of ' + attempts + ' correct', canvasWidth - 12, drawHeight + 58);
}

// ---------- Interaction ----------
function mousePressed() {
  if (mouseY > drawHeight) return;
  for (const r of rowBoxes) {
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) {
      selected = r.i;
      showRewrite = false;
      updateButtons();
      updateDescription();
      return;
    }
  }
}

function judge(saidSafe) {
  const ln = lines[selected];
  if (ln.judged) return;                 // one judgment per line
  ln.judged = true;
  ln.said = saidSafe;
  ln.correct = saidSafe === ln.safe;
  attempts++;
  if (ln.correct) correct++;
  lastJudged = selected;
  showRewrite = false;
  updateButtons();
  updateDescription();
}

function updateButtons() {
  const ln = lines[selected];
  const judged = ln && ln.judged;
  for (const b of [safeButton, riskyButton]) {
    if (judged) b.attribute('disabled', ''); else b.removeAttribute('disabled');
  }
  const canRewrite = judged && !ln.safe && !showRewrite;
  if (canRewrite) rewriteButton.removeAttribute('disabled'); else rewriteButton.attribute('disabled', '');
}

function updateDescription() {
  const ln = lines[selected];
  describe('A draft image prompt of ' + lines.length + ' lines. Line ' + (selected + 1) + ' is selected: "' +
    ln.text + '". ' + (ln.judged ? 'It has been judged ' + (ln.correct ? 'correctly' : 'incorrectly') +
    '; it ' + (ln.safe ? 'keeps the image text-free. ' : 'risks text in the image. ') : 'It has not been judged yet. ') +
    'Score: ' + correct + ' correct of ' + attempts + ' attempts.', LABEL);
}

// ---------- Responsive design ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  styleButtons();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
}
