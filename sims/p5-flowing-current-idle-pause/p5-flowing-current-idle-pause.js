// Flowing Current and Idle Pause
// CANVAS_HEIGHT: 505
// Showcase technique from the H-Bridge MicroSim: evenly spaced dots flow along
// a list of corner points (offset modulo the spacing, lerp() along each
// segment) around a battery-and-lamp loop, hidden inside the lamp. The
// animation advances only when Start has been pressed and, if "Pause when
// idle" is on, only while the pointer is over the sim. A step counter shows
// exactly when the animation is advancing.

// ---------- layout globals ----------
let canvasWidth = 400;
let drawHeight = 390;
let controlHeight = 115;             // three rows of controls
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 270;          // room for "Flow speed (pixels per frame): 1.5"
let defaultTextSize = 16;

// ---------- animation state ----------
let flowOffset = 0;                  // grows (or shrinks) by the flow speed each advancing frame
let animationSteps = 0;              // frames in which the animation advanced
let isRunning = false;               // MicroSim standard: start paused
let mouseOverSim = false;            // set by mouseenter / mouseleave on <main>
const lampR = 26;

// ---------- controls ----------
let startButton, idleCheckbox, reverseCheckbox, spacingSlider, speedSlider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Pause-when-idle: listen on the <main> element that holds the canvas and controls
  const mainElement = document.querySelector('main');
  mainElement.addEventListener('mouseenter', () => { mouseOverSim = true; });
  mainElement.addEventListener('mouseleave', () => { mouseOverSim = false; });

  startButton = createButton('Start');
  startButton.parent(mainElement);
  startButton.mousePressed(toggleRunning);

  idleCheckbox = createCheckbox('Pause when idle', true);
  idleCheckbox.parent(mainElement);
  idleCheckbox.style('white-space', 'nowrap');

  reverseCheckbox = createCheckbox('Reverse direction', false);
  reverseCheckbox.parent(mainElement);
  reverseCheckbox.style('white-space', 'nowrap');

  spacingSlider = createSlider(12, 48, 24, 1);
  spacingSlider.parent(mainElement);
  speedSlider = createSlider(0.5, 4, 1.5, 0.1);
  speedSlider.parent(mainElement);

  positionControls();

  describe('A rectangular loop of wire with a battery on the left and a lamp on the right. Evenly spaced ' +
    'green dots flow around the loop from the battery\'s positive terminal and are hidden inside the lamp. ' +
    'Readouts show whether the animation is advancing and how many animation steps have run since load. ' +
    'Sliders set the dot spacing and flow speed; checkboxes turn pause-when-idle on and reverse the flow, ' +
    'which turns the dots purple.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Decide whether the animation advances this frame
  const idlePause = idleCheckbox.checked();
  const advancing = isRunning && (!idlePause || mouseOverSim);
  const reversed = reverseCheckbox.checked();
  if (advancing) {
    flowOffset += speedSlider.value() * (reversed ? -1 : 1);
    animationSteps++;
  }

  // The loop's corner points are recomputed from the canvas width every frame
  const g = circuitGeometry();
  drawWires(g);
  drawBattery(g, reversed);
  drawLamp(g);
  drawDots(g, reversed);

  noStroke();
  fill('black');
  textStyle(BOLD);
  textSize(20);
  textAlign(LEFT, TOP);
  text('Flowing Current and Idle Pause', 12, 10);
  textStyle(NORMAL);

  drawReadout(g, advancing, idlePause);
  drawControlLabels();
}

// ---------- circuit geometry ----------
function circuitGeometry() {
  const narrow = canvasWidth < 560;
  const L = floor(canvasWidth * 0.14);
  const R = floor(canvasWidth * 0.86);
  const top = narrow ? 170 : 128;
  const bottom = drawHeight - 40;
  const midY = (top + bottom) / 2;
  const gap = 12;                    // half the battery's height on the left wire
  // Path from the battery's + terminal around the loop to its - terminal
  const pts = [
    createVector(L, midY - gap),
    createVector(L, top),
    createVector(R, top),
    createVector(R, bottom),
    createVector(L, bottom),
    createVector(L, midY + gap)
  ];
  let length = 0;
  for (let i = 0; i < pts.length - 1; i++) length += p5.Vector.dist(pts[i], pts[i + 1]);
  return { L: L, R: R, top: top, bottom: bottom, midY: midY, gap: gap, pts: pts, length: length,
    lamp: createVector(R, midY) };
}

// Point at distance d along the path: subtract segment lengths, then lerp inside one segment
function pointAt(g, d) {
  for (let i = 0; i < g.pts.length - 1; i++) {
    const a = g.pts[i], b = g.pts[i + 1];
    const segLen = p5.Vector.dist(a, b);
    if (d <= segLen) {
      const t = d / segLen;
      return createVector(lerp(a.x, b.x, t), lerp(a.y, b.y, t));
    }
    d -= segLen;
  }
  return g.pts[g.pts.length - 1].copy();
}

// ---------- drawing ----------
function drawWires(g) {
  stroke('dimgray');
  strokeWeight(4);
  noFill();
  beginShape();
  for (const p of g.pts) vertex(p.x, p.y);
  endShape();
  strokeWeight(1);
}

function drawBattery(g, reversed) {
  // Long plate = positive terminal. Reversing the flow flips the battery.
  const yLong = reversed ? g.midY + g.gap : g.midY - g.gap;
  const yShort = reversed ? g.midY - g.gap : g.midY + g.gap;
  stroke('black');
  strokeWeight(4);
  line(g.L - 22, yLong, g.L + 22, yLong);
  strokeWeight(6);
  line(g.L - 12, yShort, g.L + 12, yShort);
  strokeWeight(1);
  noStroke();
  fill('black');
  textSize(18);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text('+', g.L + 26, yLong - 2);
  text('−', g.L + 18, yShort + 2);
  textStyle(NORMAL);
  textSize(15);
  textAlign(LEFT, CENTER);
  text('Battery', g.L + 44, g.midY);         // inside the loop, clear of the canvas edge
}

function drawLamp(g) {
  const c = g.lamp;
  noStroke();
  fill(255, 215, 0, 90);             // soft glow
  circle(c.x, c.y, lampR * 2 + 18);
  stroke('black');
  strokeWeight(2);
  fill('lightyellow');
  circle(c.x, c.y, lampR * 2);
  const k = lampR * 0.6;
  line(c.x - k, c.y - k, c.x + k, c.y + k);
  line(c.x - k, c.y + k, c.x + k, c.y - k);
  strokeWeight(1);
  noStroke();
  fill('black');
  textSize(15);
  textAlign(RIGHT, CENTER);
  text('Lamp', c.x - lampR - 14, c.y);       // inside the loop, clear of the canvas edge
}

function drawDots(g, reversed) {
  const spacing = spacingSlider.value();
  // Start at the offset modulo the spacing, so the pattern repeats every "spacing" pixels
  const start = ((flowOffset % spacing) + spacing) % spacing;
  noStroke();
  fill(reversed ? 'purple' : 'green');
  for (let d = start; d <= g.length; d += spacing) {
    const p = pointAt(g, d);
    if (p5.Vector.dist(p, g.lamp) < lampR) continue;   // hidden inside the lamp
    circle(p.x, p.y, 9);
  }
}

function drawReadout(g, advancing, idlePause) {
  let why = '';
  if (!advancing) {
    why = !isRunning ? ' (press Start)' : ' (pointer is outside the sim)';
  }
  const spacing = spacingSlider.value();
  const dots = floor(g.length / spacing);
  const lapSeconds = g.length / speedSlider.value() / 60;
  const lines = [
    { t: 'Animation advancing: ' + (advancing ? 'yes' : 'no' + why), c: advancing ? 'seagreen' : 'firebrick', b: true },
    { t: 'Animation steps since load: ' + animationSteps, c: 'black', b: false },
    { t: 'Pointer over sim: ' + (mouseOverSim ? 'yes' : 'no') + (idlePause ? '' : ' (ignored)'), c: 'dimgray', b: false },
    { t: 'Path ' + round(g.length) + ' px, about ' + dots + ' dots, one lap in ' + nf(lapSeconds, 1, 1) +
      ' s at 60 fps', c: 'dimgray', b: false }
  ];
  const narrow = canvasWidth < 560;
  textSize(narrow ? 14 : 15);
  let w = 0;
  for (const ln of lines) { textStyle(ln.b ? BOLD : NORMAL); w = max(w, textWidth(ln.t)); }
  textStyle(NORMAL);
  w = min(w + 20, canvasWidth - 20);
  const lh = narrow ? 18 : 19;
  const h = lines.length * lh + 12;
  const x = narrow ? 10 : canvasWidth - w - 10;
  const y = narrow ? 38 : 8;
  fill(255, 255, 255, 235);
  stroke(200);
  rect(x, y, w, h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  for (let i = 0; i < lines.length; i++) {
    textStyle(lines[i].b ? BOLD : NORMAL);
    fill(lines[i].c);
    text(lines[i].t, x + 10, y + 7 + i * lh);
  }
  textStyle(NORMAL);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Dot spacing (pixels): ' + spacingSlider.value(), 10, drawHeight + 55);
  text('Flow speed (pixels per frame): ' + nf(speedSlider.value(), 1, 1), 10, drawHeight + 90);
}

// ---------- actions ----------
function toggleRunning() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}

// A touch screen has no hover, so a tap also wakes the animation
function mousePressed() {
  if (mouseX >= 0 && mouseX <= canvasWidth && mouseY >= 0 && mouseY <= canvasHeight) mouseOverSim = true;
}

// ---------- layout ----------
function positionControls() {
  startButton.position(10, drawHeight + 8);
  const x1 = 10 + max(startButton.elt.offsetWidth, 58) + 16;
  idleCheckbox.position(x1, drawHeight + 10);
  reverseCheckbox.position(x1 + idleCheckbox.elt.offsetWidth + 16, drawHeight + 10);
  // The sliders start just past the longest label
  textSize(defaultTextSize);
  sliderLeftMargin = ceil(textWidth('Flow speed (pixels per frame): 0.5')) + 24;
  spacingSlider.position(sliderLeftMargin, drawHeight + 45);
  speedSlider.position(sliderLeftMargin, drawHeight + 80);
  spacingSlider.size(max(60, canvasWidth - sliderLeftMargin - margin));
  speedSlider.size(max(60, canvasWidth - sliderLeftMargin - margin));
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.floor(container.getBoundingClientRect().width);
  }
}
