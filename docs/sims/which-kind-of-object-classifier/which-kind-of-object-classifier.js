// Which Kind of Object Is It? - drag each example card into the right bin
// CANVAS_HEIGHT: 490
// Learning objective (Analyze / distinguish): the learner distinguishes learning objects,
// interactive simulations, MicroSims, and instrumented MicroSims by sorting example
// descriptions into the correct category.
// Twelve cards (three per category) are shuffled on each run. A correct drop turns the bin
// green and explains why; a wrong drop shakes the card and names the property that decides it.
// Keys 1-4 also place the card, for keyboard and screen-reader users.

// ---------- Canvas dimensions ----------
let canvasWidth = 700;
let drawHeight = 440;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;   // 490
let margin = 10;
let defaultTextSize = 16;

// ---------- Categories (bins), from most general to most specific ----------
const categories = [
  { id: 'lo', name: 'Learning Object', short: 'reusable, described', color: 'steelblue', text: 'white' },
  { id: 'sim', name: 'Interactive Simulation', short: '+ model and interaction', color: 'green', text: 'white' },
  { id: 'ms', name: 'MicroSim', short: '+ small, embeddable', color: 'orange', text: 'black' },
  { id: 'ims', name: 'Instrumented MicroSim', short: '+ reports xAPI events', color: 'crimson', text: 'white' }
];

// What an example lacks if it stops at the previous level / what it also has
const lacks = {
  sim: 'a model the learner can change, with an immediate visible response',
  ms: 'being small, running in a browser, embedding with one iframe tag, and a metadata file',
  ims: 'reporting learner interactions as xAPI statements to a record store'
};
const alsoHas = {
  sim: 'has a model the learner changes, with an immediate response',
  ms: 'is small, runs in a browser, embeds with one iframe tag and has metadata',
  ims: 'reports learner interactions as xAPI statements'
};

// ---------- Cards: three per category ----------
const allCards = [
  { cat: 'lo', text: 'A five-minute video on photosynthesis, listed in a catalog with its title and grade level.',
    why: 'It is a reusable, described unit of instruction, but the learner only watches: there is no model to change.' },
  { cat: 'lo', text: 'A labeled diagram of a plant cell with a caption, reused in three biology courses.',
    why: 'It is self-contained and reusable, but static: nothing responds to what the learner does.' },
  { cat: 'lo', text: 'A ten-question quiz on fractions with a description record so teachers can find it.',
    why: 'A quiz marks answers right or wrong, but there is no model the learner can manipulate.' },
  { cat: 'sim', text: 'A pendulum whose length you can change, in a desktop application.',
    why: 'It has a model and immediate interaction, but it is installed software that cannot be embedded in a web page.' },
  { cat: 'sim', text: 'A downloadable circuit simulator with hundreds of controls, where flipping a switch lights a bulb at once.',
    why: 'The learner changes inputs and sees results at once, but it is large and cannot be embedded with one iframe tag.' },
  { cat: 'sim', text: 'A planetarium program installed on lab computers: drag the time slider and the planets move.',
    why: 'A model with immediate interaction, but installed software rather than a small, embeddable browser page.' },
  { cat: 'ms', text: 'A two-slider ball simulation embedded in a chapter with a metadata file.',
    why: 'It is small, runs in the browser, embeds with one iframe tag and is described, but it reports nothing.' },
  { cat: 'ms', text: 'An AI-generated p5.js wave sketch with one amplitude slider that fits any screen width and has a metadata.json file.',
    why: 'Small, AI-generated, width-responsive and described: a MicroSim. It sends no learner events.' },
  { cat: 'ms', text: 'A browser pendulum lab placed in a lesson page with one iframe tag and described by metadata.json.',
    why: 'It has every MicroSim property, but nothing records what the learner does.' },
  { cat: 'ims', text: 'The same ball simulation that also sends slider and answer events to a record store.',
    why: 'A MicroSim that reports learner interactions as evidence (xAPI statements) is instrumented.' },
  { cat: 'ims', text: 'A predict-then-test MicroSim that sends each prediction as an xAPI "answered" statement to a learning record store.',
    why: 'Its answers are reported as xAPI statements, so it is an instrumented MicroSim.' },
  { cat: 'ims', text: 'An embedded gravity MicroSim whose slider moves are sent as xAPI "interacted" statements for a mastery dashboard.',
    why: 'Reporting slider changes as xAPI statements makes it an instrumented MicroSim.' }
];

// ---------- State ----------
let deck = [];
let cardIndex = 0;
let correct = 0;
let attempts = 0;
let firstTry = 0;
let triedThisCard = false;
let placed = false;             // current card placed correctly
let finished = false;
let feedback = null;            // {ok, title, body}
let placedCounts = [0, 0, 0, 0];

let cardX, cardY;               // current card center
let dragging = false;
let dragDX = 0, dragDY = 0;
let shakeStart = -1000;
let binFlash = [null, null, null, null];   // {ok, t}
let hoverBin = -1;
let binRects = [];

let nextButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  nextButton = createButton('Next');
  nextButton.parent(document.querySelector('main'));
  nextButton.position(10, drawHeight + 10);
  nextButton.size(96, 30);
  nextButton.mousePressed(nextCard);

  startRound();

  describe('A sorting activity with four bins across the bottom: Learning Object, ' +
    'Interactive Simulation, MicroSim and Instrumented MicroSim. A card in the center ' +
    'describes one example. Drag the card into a bin, or press keys 1 to 4 to choose a bin. ' +
    'A correct choice turns the bin green and explains why; a wrong choice shakes the card ' +
    'and names the deciding property. The control area has a Next button and the score as ' +
    'correct answers out of attempts.', LABEL);
}

function startRound() {
  deck = shuffleArray(allCards.slice());
  cardIndex = 0;
  correct = 0;
  attempts = 0;
  firstTry = 0;
  placedCounts = [0, 0, 0, 0];
  finished = false;
  newCard();
}

function newCard() {
  binFlash = [null, null, null, null];
  placed = false;
  triedThisCard = false;
  feedback = null;
  dragging = false;
  resetCardPosition();
  nextButton.html('Next');
  nextButton.attribute('disabled', '');
}

function shuffleArray(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------- Layout helpers ----------
function cardSize() {
  return { w: Math.min(440, canvasWidth - 40), h: 112 };
}
function cardHome() {
  return { x: canvasWidth / 2, y: 62 + cardSize().h / 2 };
}
function resetCardPosition() {
  const h = cardHome();
  cardX = h.x;
  cardY = h.y;
}

function draw() {
  updateCanvasSize();

  // Drawing and control regions
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title and instructions
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  textSize(canvasWidth < 500 ? 19 : 22);
  text('Which Kind of Object Is It?', canvasWidth / 2, 8);
  textStyle(NORMAL);
  fill('dimgray');
  textSize(14);
  text(canvasWidth < 500 ? 'Drag the card into a bin (or press 1-4).' :
    'Drag the card into the bin where it belongs, or press 1-4.', canvasWidth / 2, 36);

  layoutBins();
  if (!dragging) hoverBin = -1;
  drawBins();
  drawFeedback();
  if (finished) drawSummary();
  else if (!placed) drawCard();
  drawControlText();
  if (!finished && !placed) cursor(dragging ? 'grabbing' : (overCard(mouseX, mouseY) ? 'grab' : ARROW));
  else cursor(ARROW);
}

// ---------- Bins ----------
function layoutBins() {
  const gap = 8;
  const top = drawHeight - 128;
  const h = 116;
  const w = (canvasWidth - 2 * margin - 3 * gap) / 4;
  binRects = categories.map((c, i) => ({ x: margin + i * (w + gap), y: top, w: w, h: h }));
}

function drawBins() {
  const now = millis();
  categories.forEach((c, i) => {
    const r = binRects[i];
    const flash = binFlash[i];
    let body = 'white';
    if (flash && flash.ok && (placed || now - flash.t < 1200)) body = 'palegreen';
    if (flash && !flash.ok && now - flash.t < 900) body = 'mistyrose';
    // body
    stroke(i === hoverBin ? 'black' : 'gray');
    strokeWeight(i === hoverBin ? 3 : 1.5);
    fill(body);
    rect(r.x, r.y, r.w, r.h, 8);
    // colored header band with the category name
    noStroke();
    fill(c.color);
    const headH = 46;
    rect(r.x + 1, r.y + 1, r.w - 2, headH, 7, 7, 0, 0);
    fill(c.text);
    textStyle(BOLD);
    drawFittedLines(c.name, r.x + r.w / 2, r.y + 1 + headH / 2, r.w - 8, 2, 15, 11);
    textStyle(NORMAL);
    // key number and property reminder
    fill('dimgray');
    textAlign(CENTER, TOP);
    textSize(12);
    drawFittedLines(c.short, r.x + r.w / 2, r.y + headH + 18, r.w - 8, 2, 12, 10);
    // placed-card tally as small dots
    fill(c.color);
    const n = placedCounts[i];
    for (let k = 0; k < n; k++) circle(r.x + r.w / 2 + (k - (n - 1) / 2) * 13, r.y + r.h - 14, 9);
    // key hint in the corner
    fill('black');
    textAlign(RIGHT, BOTTOM);
    textSize(12);
    text('key ' + (i + 1), r.x + r.w - 5, r.y + r.h - 3);
  });
}

// Draw centered text wrapped to at most maxLines lines, shrinking the size to fit width
function drawFittedLines(str, cx, cy, maxW, maxLines, size, minSize) {
  let lines;
  let s = size;
  while (true) {
    textSize(s);
    lines = wrapLines(str, maxW);
    const tooWide = lines.some(l => fontWidth(l) > maxW);
    if ((!tooWide && lines.length <= maxLines) || s <= minSize) break;
    s--;
  }
  const lh = s * 1.15;
  textAlign(CENTER, CENTER);
  const y0 = cy - (lines.length - 1) * lh / 2;
  lines.forEach((l, k) => text(l, cx, y0 + k * lh));
}

function wrapLines(str, maxW) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (fontWidth(test) > maxW && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// ---------- Card ----------
function drawCard() {
  const s = cardSize();
  let x = cardX;
  const since = millis() - shakeStart;
  if (since < 500) {
    // shake: a decaying side-to-side wobble after a wrong drop
    x += sin(since * 0.08) * 10 * (1 - since / 500);
  }
  const left = x - s.w / 2, top = cardY - s.h / 2;
  // shadow
  noStroke();
  fill(0, 0, 0, dragging ? 45 : 25);
  rect(left + 4, top + 5, s.w, s.h, 10);
  stroke(dragging ? 'black' : 'darkgray');
  strokeWeight(dragging ? 2 : 1.5);
  fill('white');
  rect(left, top, s.w, s.h, 10);
  noStroke();
  fill('dimgray');
  textAlign(LEFT, TOP);
  textSize(12);
  textStyle(BOLD);
  text('EXAMPLE ' + (cardIndex + 1) + ' OF ' + deck.length, left + 12, top + 9);
  textStyle(NORMAL);
  fill('black');
  const card = deck[cardIndex];
  let size = 16;
  let lines;
  while (true) {
    textSize(size);
    lines = wrapLines(card.text, s.w - 24);
    if (lines.length <= 4 || size <= 13) break;
    size--;
  }
  const lh = size * 1.25;
  textAlign(CENTER, TOP);
  const y0 = top + 30 + (s.h - 36 - lines.length * lh) / 2;
  lines.forEach((l, k) => text(l, x, y0 + k * lh));
}

function overCard(mx, my) {
  if (finished || placed) return false;
  const s = cardSize();
  return mx > cardX - s.w / 2 && mx < cardX + s.w / 2 && my > cardY - s.h / 2 && my < cardY + s.h / 2;
}

// ---------- Feedback and summary ----------
function drawFeedback() {
  if (!feedback) return;
  const w = Math.min(460, canvasWidth - 24);
  const x = (canvasWidth - w) / 2;
  const y = placed ? 66 : 184;
  const h = placed ? 150 : 110;
  stroke(feedback.ok ? 'seagreen' : 'indianred');
  strokeWeight(1.5);
  fill(255, 255, 255, 240);
  rect(x, y, w, h, 10);
  noStroke();
  fill(feedback.ok ? 'darkgreen' : 'firebrick');
  textStyle(BOLD);
  textSize(16);
  textAlign(LEFT, TOP);
  let ty = y + 10;
  for (const l of wrapLines(feedback.title, w - 24)) { text(l, x + 12, ty); ty += 20; }
  textStyle(NORMAL);
  fill('black');
  textSize(15);
  ty += 2;
  for (const l of wrapLines(feedback.body, w - 24)) { text(l, x + 12, ty); ty += 19; }
  if (placed && !finished) {
    fill('dimgray');
    textSize(14);
    text('Press Next for the next card.', x + 12, y + h - 24);
  }
}

function drawSummary() {
  const w = Math.min(460, canvasWidth - 24);
  const x = (canvasWidth - w) / 2;
  const y = 66;
  stroke('steelblue');
  strokeWeight(1.5);
  fill(255, 255, 255, 240);
  rect(x, y, w, 150, 10);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(18);
  text('All ' + deck.length + ' cards sorted!', x + 12, y + 12);
  textStyle(NORMAL);
  textSize(15);
  const lines = [
    'Right on the first try: ' + firstTry + ' of ' + deck.length,
    'Score: ' + correct + ' correct out of ' + attempts + ' attempts',
    firstTry === deck.length ? 'Perfect sorting. You can tell all four kinds apart.' :
      'Look again at the cards you missed: which property decided each one?'
  ];
  let ty = y + 44;
  for (const s of lines) {
    for (const l of wrapLines(s, w - 24)) { text(l, x + 12, ty); ty += 20; }
  }
  fill('dimgray');
  textSize(14);
  text('Press Shuffle to sort a new round.', x + 12, y + 150 - 24);
}

function drawControlText() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  let size = 16;
  const msg = 'Score: ' + correct + ' correct / ' + attempts + ' attempts' +
    (finished ? '' : '   Card ' + (cardIndex + 1) + ' of ' + deck.length);
  textSize(size);
  while (fontWidth(msg) > canvasWidth - 130 && size > 11) { size--; textSize(size); }
  text(msg, 118, drawHeight + 25);
}

// ---------- Checking an answer ----------
function binAt(mx, my) {
  for (let i = 0; i < binRects.length; i++) {
    const r = binRects[i];
    if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) return i;
  }
  return -1;
}

function placeCard(binIndex) {
  if (finished || placed) return;
  const card = deck[cardIndex];
  const correctIndex = categories.findIndex(c => c.id === card.cat);
  attempts++;
  binFlash[binIndex] = { ok: binIndex === correctIndex, t: millis() };
  if (binIndex === correctIndex) {
    correct++;
    if (!triedThisCard) firstTry++;
    placed = true;
    placedCounts[binIndex]++;
    feedback = { ok: true, title: 'Correct: ' + categories[correctIndex].name + '.', body: card.why };
    nextButton.removeAttribute('disabled');
    if (cardIndex === deck.length - 1) nextButton.html('Finish');
  } else {
    triedThisCard = true;
    shakeStart = millis();
    resetCardPosition();
    let body;
    if (binIndex > correctIndex) {
      // too specific: name the first property the example lacks
      body = 'This example is missing ' + lacks[categories[correctIndex + 1].id] + '.';
    } else {
      // too general: name the next property the example has
      body = 'Look again: this example also ' + alsoHas[categories[binIndex + 1].id] +
        ', so a more specific bin fits.';
    }
    feedback = { ok: false, title: 'Not quite.', body: body + ' Try another bin.' };
  }
}

// ---------- Buttons ----------
function nextCard() {
  if (finished) {
    startRound();
    return;
  }
  if (!placed) return;
  if (cardIndex === deck.length - 1) {
    finished = true;
    feedback = null;
    binFlash = [null, null, null, null];
    nextButton.html('Shuffle');
    nextButton.removeAttribute('disabled');
    return;
  }
  cardIndex++;
  newCard();
}

// ---------- Mouse, touch and keyboard ----------
function mousePressed() {
  if (overCard(mouseX, mouseY)) {
    dragging = true;
    dragDX = mouseX - cardX;
    dragDY = mouseY - cardY;
    return false;
  }
}

function mouseDragged() {
  if (!dragging) return;
  const s = cardSize();
  cardX = constrain(mouseX - dragDX, s.w / 2 * 0.2, canvasWidth - s.w / 2 * 0.2);
  cardY = constrain(mouseY - dragDY, 0, drawHeight);
  hoverBin = binAt(mouseX, mouseY);
  return false;
}

function mouseReleased() {
  if (!dragging) return;
  dragging = false;
  const b = binAt(mouseX, mouseY);
  hoverBin = -1;
  if (b >= 0) placeCard(b);
  else resetCardPosition();
}

function keyPressed() {
  const n = parseInt(key, 10);
  if (n >= 1 && n <= 4) placeCard(n - 1);
}

// ---------- Responsive design ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  if (!dragging) resetCardPosition();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.max(320, Math.floor(container.getBoundingClientRect().width));
  }
}
