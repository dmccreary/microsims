// Comparison Poster Explorer - p5.js MicroSim
// CANVAS_HEIGHT: 640
// Learning objective (Analyze / compare): the learner compares three robot kits across the
// same attributes by exploring the columns of a comparison poster, and identifies which
// column matches a described property. The poster is drawn with p5.js shapes; its three
// columns are percentage rectangle zones (2-34, 34-67, 67-98 across; 12-90 down) whose
// summaries, facts and quiz questions come from the STEM Robots robot-kits data file.

// ---------- canvas layout ----------
let canvasWidth = 400;
let drawHeight = 560;
let controlHeight = 80;                 // two rows of controls
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

// ---------- data (same field names as a grid overlay's data.json) ----------
const zones = [
  {
    id: 'base-bot', label: 'Base Bot', color: 'crimson',
    x1: 2, y1: 12, x2: 34, y2: 90, price: '~$18', tagline: 'Motors + distance sensor',
    summary: 'The core kit: motors, chassis and a time-of-flight distance sensor',
    facts: [
      'Total cost: about $18, the most affordable entry point',
      'Board: Cytron Maker Pi RP2040 with a built-in MX1508 motor driver',
      'Distance sensor: VL53L0X time-of-flight over I2C',
      'Control: USB-tethered from Thonny while the cable is plugged in',
      'Display: none'
    ]
  },
  {
    id: 'wifi-bot', label: 'WiFi Bot', color: 'teal',
    x1: 34, y1: 12, x2: 67, y2: 90, price: '~$21', tagline: '+ WiFi and Bluetooth LE',
    summary: 'Adds wireless: drive the robot from any browser or pair robots over BLE',
    facts: [
      'Total cost: about $21 (Base Bot parts with a Raspberry Pi Pico W swap)',
      'Board: Raspberry Pi Pico W with a CYW43439 WiFi and Bluetooth LE chip',
      'WiFi: runs a web server so a phone or laptop browser can drive it',
      'Bluetooth LE: robot-to-robot messages for swarms, 1 to 10 ms latency',
      'Distance sensor: the same VL53L0X time-of-flight sensor'
    ]
  },
  {
    id: 'display-bot', label: 'Display Bot', color: 'rebeccapurple',
    x1: 67, y1: 12, x2: 98, y2: 90, price: '~$24', tagline: '+ OLED screen',
    summary: 'Adds an OLED screen to show sensor readings and status on the robot itself',
    facts: [
      'Total cost: about $24 (Base Bot plus about $6 for the display)',
      'Display: SSD1306 128×64 pixel monochrome OLED over I2C',
      'I2C bus shared with the distance sensor at different addresses',
      'Board: Cytron Maker Pi RP2040, the same as the Base Bot',
      'Best for: live sensor readings, distance bar graphs, status messages'
    ]
  }
];

const quiz = [
  { question: 'Which kit is the most affordable at about $18 and is the best starting point for a first-time robot builder?',
    correct_zone: 'base-bot',
    explanation: 'The Base Bot costs about $18: the Cytron Maker Pi RP2040 board, a chassis kit and a VL53L0X sensor, with the motor driver, NeoPixels and buzzer on the board.' },
  { question: 'Which kit lets you drive your robot from a web browser on your phone without a USB cable?',
    correct_zone: 'wifi-bot',
    explanation: 'The WiFi Bot uses the Raspberry Pi Pico W and its CYW43439 WiFi chip to run a web server, so any browser on the same network can load the control page.' },
  { question: 'Which kit adds an SSD1306 OLED screen so the robot can show live sensor readings on itself?',
    correct_zone: 'display-bot',
    explanation: 'The Display Bot adds a 128×64 pixel monochrome OLED over I2C for distance readings, bar graphs and status messages.' },
  { question: 'Which kit supports BLE robot-to-robot communication with just 1–10 ms latency for swarm robotics?',
    correct_zone: 'wifi-bot',
    explanation: 'The Pico W chip supports Bluetooth LE as well as WiFi, so one robot can send commands directly to another with no router.' },
  { question: 'Which kit wires both a VL53L0X ToF sensor and an OLED display on the same I2C bus simultaneously?',
    correct_zone: 'display-bot',
    explanation: 'The Display Bot puts the VL53L0X (address 0x29) and the SSD1306 (address 0x3C) on one I2C bus; unique addresses let both work at once.' }
];

// ---------- state ----------
let mode = 'explore';          // 'explore' | 'quiz'
let hovered = null;            // zone id under the pointer
let selected = null;           // zone id opened in explore mode
let order = [];                // shuffled quiz order
let qIndex = 0;
let attemptsThisQ = 0;
let firstTry = 0;              // questions answered right on the first click
let answered = 0;
let quizState = 'asking';      // 'asking' | 'wrong' | 'correct' | 'done'
let lastWrong = null;          // zone id of the last wrong click
let flashUntil = 0;
let revealed = {};             // zones revealed by a correct answer in quiz mode

// ---------- geometry ----------
let poster = { x: 0, y: 0, w: 0, h: 0 };
let panel = { x: 0, y: 0, w: 0, h: 0 };
let narrow = false;

// ---------- controls ----------
let exploreButton, quizButton, nextButton, edgesCheckbox;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  exploreButton = createButton('Explore');
  exploreButton.position(10, drawHeight + 8);
  exploreButton.mousePressed(startExplore);
  quizButton = createButton('Quiz Me');
  quizButton.position(90, drawHeight + 8);
  quizButton.mousePressed(startQuiz);
  nextButton = createButton('Next question');
  nextButton.position(175, drawHeight + 8);
  nextButton.mousePressed(nextQuestion);
  nextButton.hide();

  edgesCheckbox = createCheckbox(' Show zone edges', false);
  edgesCheckbox.position(10, drawHeight + 46);

  styleModeButtons();
  describe('Comparison Poster Explorer: a poster with three robot kit columns, Base Bot, ' +
    'WiFi Bot and Display Bot. Click a column to read its facts, or press Quiz Me to ' +
    'answer which-column questions.', LABEL);
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

  hovered = zoneAt(mouseX, mouseY);
  drawHeader();
  drawPoster();
  drawZoneOverlays();
  drawPanel();

  // control-row status text
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  if (mode === 'quiz') {
    const s = 'First-try correct: ' + firstTry + ' of ' + answered;
    text(s, max(190, canvasWidth - textWidth(s) - 12), drawHeight + 56);
  }
  cursor(hovered && mouseY < drawHeight ? HAND : ARROW);
}

// ---------- layout ----------
function computeLayout() {
  narrow = canvasWidth < 600;
  const headerH = narrow ? 70 : 52;
  poster.w = min(canvasWidth - 2 * margin, 900);
  poster.h = min(290, poster.w * 0.62);
  poster.x = (canvasWidth - poster.w) / 2;
  poster.y = headerH;
  panel.x = poster.x;
  panel.w = poster.w;
  panel.y = poster.y + poster.h + 10;
  panel.h = drawHeight - panel.y - 8;
}

function px(p) { return poster.x + p / 100 * poster.w; }
function py(p) { return poster.y + p / 100 * poster.h; }

// rectangular hit testing from percentage zones
function zoneAt(mx, my) {
  if (mx < poster.x || mx > poster.x + poster.w || my < poster.y || my > poster.y + poster.h) return null;
  const xp = (mx - poster.x) / poster.w * 100;
  const yp = (my - poster.y) / poster.h * 100;
  for (const z of zones) {
    if (xp >= z.x1 && xp <= z.x2 && yp >= z.y1 && yp <= z.y2) return z.id;
  }
  return null;
}

function zoneById(id) { return zones.find(z => z.id === id); }

// ---------- drawing ----------
function drawHeader() {
  noStroke();
  textAlign(LEFT, TOP);
  const w = canvasWidth - 2 * margin;
  let s, c = 'black';
  if (mode === 'explore') {
    s = 'Explore: hover a column to highlight it, then click it to open its summary and facts below.';
    c = 'dimgray';
    textStyle(NORMAL);
  } else if (quizState === 'done') {
    s = 'Quiz complete. Press Quiz Me to try again or Explore to return.';
    textStyle(BOLD);
  } else {
    const q = quiz[order[qIndex]];
    s = 'Q' + (qIndex + 1) + ' of ' + quiz.length + ': ' + q.question;
    textStyle(BOLD);
  }
  textSize(narrow ? 15 : 16);
  fill(c);
  let y = 8;
  for (const l of wrapLines(s, w)) {
    text(l, margin, y);
    y += narrow ? 19 : 20;
  }
  textStyle(NORMAL);
}

function drawPoster() {
  const P = poster;
  stroke('gray');
  strokeWeight(1);
  fill('white');
  rect(P.x, P.y, P.w, P.h, 6);

  // printed title (top 12%) and footer (bottom 10%)
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(constrain(P.h * 0.065, 12, 22));
  text('STEM Robot Kits Compared', P.x + P.w / 2, py(6));
  textStyle(NORMAL);
  fill('dimgray');
  textSize(constrain(P.h * 0.045, 10, 14));
  text('Approximate prices · click a column for details', P.x + P.w / 2, py(95));

  for (const z of zones) drawColumn(z);
}

function drawColumn(z) {
  const x = px(z.x1) + 3, y = py(z.y1), w = px(z.x2) - px(z.x1) - 6, h = py(z.y2) - py(z.y1);
  noStroke();
  fill(z.color);
  rect(x, y, w, h, 6);

  const cx = x + w / 2;
  const u = min(w, h * 1.1);          // size unit for the drawing
  // printed column title
  fill('white');
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(constrain(u * 0.11, 11, 22));
  text(z.label, cx, y + h * 0.09);
  textStyle(NORMAL);

  // price badge
  const bw = constrain(u * 0.36, 40, 80), bh = constrain(h * 0.11, 16, 30);
  fill('white');
  rect(cx - bw / 2, y + h * 0.17, bw, bh, bh / 2);
  fill(z.color);
  textStyle(BOLD);
  textSize(constrain(bh * 0.6, 10, 18));
  text(z.price, cx, y + h * 0.17 + bh / 2 + 1);
  textStyle(NORMAL);

  // robot seen from above: body, two wheels, sensor at the front
  const rw = min(u * 0.34, h * 0.28), rh = rw * 0.88, ry = y + h * 0.40;
  fill(255, 255, 255, 70);
  rect(cx - rw / 2 - rw * 0.18, ry + rh * 0.15, rw * 0.14, rh * 0.7, 3);   // left wheel
  rect(cx + rw / 2 + rw * 0.04, ry + rh * 0.15, rw * 0.14, rh * 0.7, 3);   // right wheel
  fill(255, 255, 255, 200);
  rect(cx - rw / 2, ry, rw, rh, 6);
  fill(z.color);
  rect(cx - rw * 0.15, ry - rh * 0.1, rw * 0.3, rh * 0.18, 2);             // sensor
  if (z.id === 'wifi-bot') {
    noFill();
    stroke('white');
    strokeWeight(2);
    for (let i = 1; i <= 3; i++) arc(cx, ry - rh * 0.05, rw * 0.18 * i, rw * 0.18 * i, PI + QUARTER_PI, TWO_PI - QUARTER_PI);
    noStroke();
  }
  if (z.id === 'display-bot') {
    fill('black');
    rect(cx - rw * 0.3, ry + rh * 0.3, rw * 0.6, rh * 0.45, 2);
    fill('aqua');
    rect(cx - rw * 0.22, ry + rh * 0.42, rw * 0.3, rh * 0.06);
    rect(cx - rw * 0.22, ry + rh * 0.55, rw * 0.44, rh * 0.06);
  }

  // printed tagline, shown only when it can be read
  const ts = constrain(u * 0.075, 9, 16);
  if (ts >= 10) {
    fill('white');
    textSize(ts);
    const lines = wrapLines(z.tagline, w - 10);
    let ly = y + h * 0.845;
    for (const l of lines.slice(0, 2)) {
      text(l, cx, ly);
      ly += ts + 3;
    }
  }
}

function drawZoneOverlays() {
  for (const z of zones) {
    const x = px(z.x1), y = py(z.y1), w = px(z.x2) - px(z.x1), h = py(z.y2) - py(z.y1);
    // quiz mode dims every zone until it is revealed by a correct answer
    if (mode === 'quiz' && !revealed[z.id]) {
      noStroke();
      fill(40, 40, 40, 120);
      rect(x + 3, y, w - 6, h, 6);
    }
    let sc = null, sw = 0;
    if (mode === 'explore' && selected === z.id) { sc = 'black'; sw = 4; }
    if (hovered === z.id) { sc = 'gold'; sw = 5; }
    if (mode === 'quiz' && lastWrong === z.id && millis() < flashUntil) { sc = 'red'; sw = 5; }
    if (mode === 'quiz' && revealed[z.id] && quizState === 'correct' &&
        quiz[order[qIndex]].correct_zone === z.id) { sc = 'limegreen'; sw = 5; }
    if (sc) {
      noFill();
      stroke(sc);
      strokeWeight(sw);
      rect(x + 3, y, w - 6, h, 6);
    }
    if (edgesCheckbox.checked()) drawEdges(z, x, y, w, h);
  }
  strokeWeight(1);
}

// the four percentage values of each zone, drawn inside it
function drawEdges(z, x, y, w, h) {
  push();
  noFill();
  stroke('black');
  strokeWeight(1.5);
  drawingContext.setLineDash([6, 4]);
  rect(x, y, w, h);
  pop();
  textSize(narrow ? 11 : 13);
  const l1 = 'x1 ' + z.x1 + '  x2 ' + z.x2;
  const l2 = 'y1 ' + z.y1 + '  y2 ' + z.y2;
  const bw = max(textWidth(l1), textWidth(l2)) + 8;
  const bx = x + (w - bw) / 2, by = y + h * 0.655;
  noStroke();
  fill(255, 255, 255, 235);
  rect(bx, by, bw, 32, 4);
  fill('black');
  textAlign(CENTER, CENTER);
  text(l1, x + w / 2, by + 9);
  text(l2, x + w / 2, by + 24);
}

function drawPanel() {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(panel.x, panel.y, panel.w, panel.h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  const lx = panel.x + 12, maxW = panel.w - 24;
  const bottom = panel.y + panel.h - 6;
  const ts = narrow ? 14 : 15, lh = narrow ? 18 : 20;
  let y = panel.y + 10;

  const write = (s, col, style, indent) => {
    textSize(ts);
    textStyle(style || NORMAL);
    fill(col || 'black');
    for (const l of wrapLines(s, maxW - (indent || 0))) {
      if (y + lh > bottom + 2) return;
      text(l, lx + (indent || 0), y);
      y += lh;
    }
    textStyle(NORMAL);
  };

  if (mode === 'explore') {
    if (!selected) {
      write('Click any robot kit column to learn about it.', 'black', BOLD);
      y += 4;
      write('Compare as you go: which attributes stay the same across the three kits, ' +
        'and which one attribute makes each kit different?', 'dimgray');
      return;
    }
    const z = zoneById(selected);
    textSize(ts + 3);
    textStyle(BOLD);
    fill(z.color);
    text(z.label, lx, y);
    y += lh + 4;
    write(z.summary, 'black', ITALIC);
    y += 4;
    for (const f of z.facts) {
      if (y + lh > bottom + 2) break;
      fill(z.color);
      circle(lx + 5, y + lh / 2 - 2, 7);
      write(f, 'black', NORMAL, 16);
    }
    return;
  }

  // quiz mode
  if (quizState === 'done') {
    write('You answered ' + firstTry + ' of ' + quiz.length + ' questions correctly on the first try.', 'black', BOLD);
    y += 4;
    write('Every question named one property that is true of exactly one column. ' +
      'Before you retry, list the one property that sets each kit apart.', 'dimgray');
    return;
  }
  const q = quiz[order[qIndex]];
  if (quizState === 'asking') {
    write('Click the column that answers the question above.', 'black', BOLD);
    y += 4;
    write('The poster prints only titles, prices and taglines, so switch to Explore ' +
      'if you need the facts first.', 'dimgray');
  } else if (quizState === 'wrong') {
    const z = zoneById(lastWrong);
    write('You clicked ' + z.label + '. Not quite, try again.', 'firebrick', BOLD);
    y += 4;
    write(z.label + ': ' + z.summary + '.', 'black');
  } else if (quizState === 'correct') {
    const z = zoneById(q.correct_zone);
    write('Correct! ' + z.label + (attemptsThisQ === 1 ? ' on the first try.' : '.'), 'darkgreen', BOLD);
    y += 4;
    write(q.explanation, 'black');
    y += 4;
    write('Press Next question to continue.', 'dimgray');
  }
}

// word wrap for the current text size
function wrapLines(s, maxW) {
  const words = s.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const t = cur ? cur + ' ' + w : w;
    if (textWidth(t) > maxW && cur) { lines.push(cur); cur = w; } else { cur = t; }
  }
  if (cur) lines.push(cur);
  return lines;
}

// ---------- interaction ----------
function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight) return;
  const id = zoneAt(mouseX, mouseY);
  if (!id) return;
  if (mode === 'explore') {
    selected = id;
    describe('Comparison Poster Explorer: ' + zoneById(id).label + ' selected. ' +
      zoneById(id).summary + '.', LABEL);
    return;
  }
  if (quizState !== 'asking' && quizState !== 'wrong') return;
  const q = quiz[order[qIndex]];
  attemptsThisQ++;
  if (id === q.correct_zone) {
    if (attemptsThisQ === 1) firstTry++;
    answered++;
    revealed[id] = true;
    quizState = 'correct';
    lastWrong = null;
    nextButton.show();
  } else {
    quizState = 'wrong';
    lastWrong = id;
    flashUntil = millis() + 700;
  }
}

function startExplore() {
  mode = 'explore';
  nextButton.hide();
  revealed = {};
  styleModeButtons();
}

function startQuiz() {
  mode = 'quiz';
  selected = null;
  order = shuffle([...Array(quiz.length).keys()]);
  qIndex = 0;
  firstTry = 0;
  answered = 0;
  attemptsThisQ = 0;
  revealed = {};
  lastWrong = null;
  quizState = 'asking';
  nextButton.hide();
  styleModeButtons();
}

function nextQuestion() {
  if (quizState !== 'correct') return;
  nextButton.hide();
  revealed = {};
  attemptsThisQ = 0;
  if (qIndex + 1 >= quiz.length) {
    quizState = 'done';
    return;
  }
  qIndex++;
  quizState = 'asking';
}

function styleModeButtons() {
  exploreButton.style('font-weight', mode === 'explore' ? 'bold' : 'normal');
  quizButton.style('font-weight', mode === 'quiz' ? 'bold' : 'normal');
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
