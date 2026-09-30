// Vector and Particle Lab
// CANVAS_HEIGHT: 550
// One ball mode: a ball driven by position, velocity and acceleration vectors
// (Euler integration: velocity += gravity, position += velocity) with labeled
// arrows, and a fixed ball that can be dragged into its path to separate
// collision detection (dist < r1 + r2) from collision response.
// Fountain mode: a particle system whose particles fade with remaining life.

// ---------- layout globals ----------
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 150;             // four rows of controls
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 170;
let defaultTextSize = 16;

// ---------- model state ----------
let mode = 'One ball';
let isRunning = false;               // MicroSim standard: start paused
let ballPos, ballVel;
const ballR = 18;
let fixedFx = 0.55, fixedFy = 0.78;  // fixed ball position as fractions of width / drawHeight
const fixedR = 28;
let dragging = false;
let flashFrames = 0;                 // frames left to flash after a collision response
let lastResponse = '';               // text describing the last collision response
let responseAge = 999;               // frames since the last response
let particles = [];
let nextParticleId = 0;
const particleLife = 90;             // frames
let spawnLabelX = 10;                // x of the spawn-rate label (moves right on narrow screens)

// ---------- controls ----------
let modeRadio, startButton, resetButton, vectorsCheckbox;
let gravitySlider, bounceSlider, spawnSlider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  modeRadio = createRadio();
  modeRadio.parent(document.querySelector('main'));
  modeRadio.option('One ball');
  modeRadio.option('Fountain');
  modeRadio.selected('One ball');
  modeRadio.style('white-space', 'nowrap');
  modeRadio.changed(() => { mode = modeRadio.value(); });

  startButton = createButton('Start');
  startButton.parent(document.querySelector('main'));
  startButton.mousePressed(toggleRunning);

  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(resetModel);

  vectorsCheckbox = createCheckbox('Show vectors', true);
  vectorsCheckbox.parent(document.querySelector('main'));
  vectorsCheckbox.style('white-space', 'nowrap');

  gravitySlider = createSlider(0.1, 1.0, 0.5, 0.05);
  gravitySlider.parent(document.querySelector('main'));
  bounceSlider = createSlider(0.3, 0.95, 0.8, 0.05);
  bounceSlider.parent(document.querySelector('main'));
  spawnSlider = createSlider(1, 10, 3, 1);
  spawnSlider.parent(document.querySelector('main'));

  positionControls();
  resetModel();

  describe('A physics lab with two modes. In One ball mode a ball moves under gravity with a green velocity ' +
    'arrow, a red gravity arrow and a gray position arrow from the origin, and a readout of position, ' +
    'velocity and speed. A second ball can be dragged into its path; when the circles overlap both flash and ' +
    'the readout shows dist < r1 + r2 with the numbers. In Fountain mode particles spawn at the bottom center ' +
    'and fade as their life runs out, with a count of particles alive.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const g = gravitySlider.value();
  const e = bounceSlider.value();

  if (mode === 'One ball') {
    if (isRunning) updateBall(g, e);
    drawBallMode(g);
  } else {
    if (isRunning) updateParticles(g, e);
    drawFountainMode(g);
  }

  // Repaint the control region so arrows near the floor cannot spill into it
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title after the scene, top center
  noStroke();
  fill('black');
  textStyle(BOLD);
  textSize(20);
  textAlign(CENTER, TOP);
  if (canvasWidth >= 620) text('Vector and Particle Lab', canvasWidth / 2, 8);
  textStyle(NORMAL);

  drawControlLabels();
}

// ---------- one ball ----------
function fixedPos() {
  return createVector(fixedFx * canvasWidth, fixedFy * drawHeight);
}

function updateBall(g, e) {
  // Acceleration changes velocity; velocity changes position (Euler step)
  ballVel.y += g;
  ballPos.add(ballVel);

  // Floor and walls: detect, then respond
  if (ballPos.y > drawHeight - ballR) {
    ballPos.y = drawHeight - ballR;
    ballVel.y *= -e;
    ballVel.x *= 0.99;                       // a little rolling friction
  }
  if (ballPos.x > canvasWidth - ballR) { ballPos.x = canvasWidth - ballR; ballVel.x *= -e; }
  if (ballPos.x < ballR) { ballPos.x = ballR; ballVel.x *= -e; }

  // Collision with the fixed ball: detection first ...
  const f = fixedPos();
  const d = dist(ballPos.x, ballPos.y, f.x, f.y);
  if (d < ballR + fixedR && d > 0) {
    // ... then response: reflect the velocity about the contact normal, keep a fraction e
    const n = p5.Vector.sub(ballPos, f).normalize();
    const vn = ballVel.dot(n);
    if (vn < 0) {
      ballVel.sub(p5.Vector.mult(n, (1 + e) * vn));
      lastResponse = 'velocity reflected off the contact normal, ' + nf(e, 1, 2) + ' kept';
      responseAge = 0;
      flashFrames = 14;
    }
    ballPos = p5.Vector.add(f, p5.Vector.mult(n, ballR + fixedR));   // push apart
  }
  responseAge++;
}

function drawBallMode(g) {
  const f = fixedPos();
  const d = dist(ballPos.x, ballPos.y, f.x, f.y);
  const touching = d < ballR + fixedR;
  if (flashFrames > 0) flashFrames--;
  const flash = touching || flashFrames > 0;
  const showVec = vectorsCheckbox.checked();

  // Position vector from the origin (0, 0)
  if (showVec) {
    stroke('gray');
    strokeWeight(1.5);
    drawingContext.setLineDash([5, 4]);
    line(0, 0, ballPos.x, ballPos.y);
    drawingContext.setLineDash([]);
  }

  // Fixed ball (draggable)
  stroke(dragging ? 'black' : 'dimgray');
  strokeWeight(dragging ? 2 : 1);
  fill(flash ? 'gold' : 'lightslategray');
  circle(f.x, f.y, fixedR * 2);
  noStroke();
  fill('dimgray');
  textSize(13);
  textAlign(CENTER, TOP);
  text('drag me', f.x, f.y + fixedR + 4);

  // Moving ball
  stroke('white');
  strokeWeight(1);
  fill(flash ? 'gold' : 'steelblue');
  circle(ballPos.x, ballPos.y, ballR * 2);

  if (showVec) {
    // Velocity (green) scaled 10 px per unit; gravity (red) scaled 60 px per unit
    drawArrow(ballPos.x, ballPos.y, ballPos.x + ballVel.x * 10, ballPos.y + ballVel.y * 10, 'green', 'velocity');
    drawArrow(ballPos.x, ballPos.y, ballPos.x, ballPos.y + g * 60, 'red', 'gravity');
  }

  // Readout panel
  const speed = ballVel.mag();
  const lines = [
    { t: 'position = (' + nf(ballPos.x, 1, 1) + ', ' + nf(ballPos.y, 1, 1) + ')', c: 'dimgray' },
    { t: 'velocity = (' + nf(ballVel.x, 1, 2) + ', ' + nf(ballVel.y, 1, 2) + ')', c: 'green' },
    { t: 'speed = |velocity| = ' + nf(speed, 1, 2), c: 'green' },
    { t: 'gravity = (0, ' + nf(g, 1, 2) + ') per frame', c: 'firebrick' }
  ];
  if (touching) {
    lines.push({ t: 'Detection: dist = ' + nf(d, 1, 1) + ' < r1 + r2 = ' + (ballR + fixedR), c: 'darkgoldenrod', b: true });
  } else {
    lines.push({ t: 'Detection: dist = ' + nf(d, 1, 1) + ' ≥ r1 + r2 = ' + (ballR + fixedR), c: 'black' });
  }
  if (touching && !isRunning) {
    lines.push({ t: 'Response: none yet (paused)', c: 'darkorange', b: true });
  } else if (responseAge < 60) {
    lines.push({ t: 'Response: ' + lastResponse, c: 'darkorange', b: true });
  } else {
    lines.push({ t: 'Response: none', c: 'black' });
  }
  drawReadout(lines);
  if (showVec) drawLegend();
}

// ---------- fountain ----------
function fountainOrigin() {
  return createVector(0.5 * canvasWidth, drawHeight - 8);
}

function updateParticles(g, e) {
  const o = fountainOrigin();
  for (let i = 0; i < spawnSlider.value(); i++) {
    particles.push({
      id: nextParticleId++,
      pos: o.copy(),
      vel: createVector(random(-2, 2), random(-13, -9)),   // upward, slightly sideways
      life: particleLife
    });
  }
  for (const p of particles) {
    p.vel.y += g;                    // the same gravity for every particle
    p.pos.add(p.vel);
    if (p.pos.y > drawHeight - 3) {  // floor: detect, then respond
      p.pos.y = drawHeight - 3;
      p.vel.y *= -e;
      p.vel.x *= 0.9;
    }
    p.life--;
  }
  particles = particles.filter(p => p.life > 0 && p.pos.x > -10 && p.pos.x < canvasWidth + 10);
}

function drawFountainMode(g) {
  const o = fountainOrigin();
  noStroke();
  // Particles fade with their remaining life: alpha = 255 * life / maxLife
  for (const p of particles) {
    const c = color('steelblue');
    c.setAlpha(map(p.life, 0, particleLife, 0, 255));
    fill(c);
    circle(p.pos.x, p.pos.y, 8);
  }
  // Nozzle
  fill('dimgray');
  rect(o.x - 12, drawHeight - 10, 24, 10, 3);

  const showVec = vectorsCheckbox.checked();
  if (showVec) {
    // Velocity arrows for a few sampled particles (scaled 4 px per unit)
    let shown = 0;
    for (const p of particles) {
      if (p.id % 25 === 0 && shown < 8) {
        drawArrow(p.pos.x, p.pos.y, p.pos.x + p.vel.x * 4, p.pos.y + p.vel.y * 4, 'green', shown === 0 ? 'velocity' : '');
        shown++;
      }
    }
    // One gravity arrow for reference: every particle feels the same acceleration
    drawArrow(o.x + 60, drawHeight - 90, o.x + 60, drawHeight - 90 + g * 60, 'red', 'gravity');
  }

  drawReadout([
    { t: 'Particles alive: ' + particles.length, c: 'black', b: true },
    { t: 'spawned per frame: ' + spawnSlider.value(), c: 'dimgray' },
    { t: 'life: ' + particleLife + ' frames; alpha = 255 × life / ' + particleLife, c: 'dimgray' },
    { t: 'each frame: vel += gravity, pos += vel', c: 'green' }
  ]);
  if (showVec) drawLegend();
}

// ---------- drawing helpers ----------
function drawArrow(x1, y1, x2, y2, col, label) {
  const len = dist(x1, y1, x2, y2);
  stroke(col);
  strokeWeight(3);
  line(x1, y1, x2, y2);
  if (len > 4) {
    const a = atan2(y2 - y1, x2 - x1);
    push();
    translate(x2, y2);
    rotate(a);
    noStroke();
    fill(col);
    triangle(0, 0, -10, -5, -10, 5);
    pop();
  }
  if (label) {
    noStroke();
    fill(col);
    textSize(14);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text(label, x2 + 6, y2);
    textStyle(NORMAL);
  }
}

function drawReadout(lines) {
  textSize(15);
  let w = 0;
  for (const ln of lines) {
    textStyle(ln.b ? BOLD : NORMAL);
    w = max(w, fontWidth(ln.t));
  }
  textStyle(NORMAL);
  w = min(w + 20, canvasWidth - 20);
  const h = lines.length * 20 + 12;
  const y = canvasWidth >= 620 ? 36 : 8;
  fill(255, 255, 255, 225);
  stroke(200);
  rect(10, y, w, h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  for (let i = 0; i < lines.length; i++) {
    textStyle(lines[i].b ? BOLD : NORMAL);
    fill(lines[i].c);
    text(lines[i].t, 20, y + 8 + i * 20);
  }
  textStyle(NORMAL);
}

function drawLegend() {
  if (canvasWidth < 560) return;
  const items = mode === 'One ball'
    ? [['gray', 'position (from origin)'], ['green', 'velocity'], ['red', 'acceleration (gravity)']]
    : [['green', 'velocity (sampled)'], ['red', 'acceleration (gravity)']];
  const w = 210, h = items.length * 20 + 12;
  const x = canvasWidth - w - 10, y = 36;
  fill(255, 255, 255, 225);
  stroke(200);
  rect(x, y, w, h, 10);
  textSize(14);
  textAlign(LEFT, CENTER);
  for (let i = 0; i < items.length; i++) {
    stroke(items[i][0]);
    strokeWeight(3);
    line(x + 10, y + 16 + i * 20, x + 34, y + 16 + i * 20);
    noStroke();
    fill('black');
    text(items[i][1], x + 42, y + 16 + i * 20);
  }
  strokeWeight(1);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Gravity: ' + nf(gravitySlider.value(), 1, 2), 10, drawHeight + 55);
  text('Bounciness: ' + nf(bounceSlider.value(), 1, 2), 10, drawHeight + 90);
  fill(mode === 'Fountain' ? 'black' : 'dimgray');   // dimmed: only used by the fountain
  text('Spawn rate: ' + spawnSlider.value(), spawnLabelX, drawHeight + 125);
}

// ---------- actions ----------
function toggleRunning() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}

function resetModel() {
  ballPos = createVector(0.15 * canvasWidth, 200);   // below the readout panel
  ballVel = createVector(3, 0);
  flashFrames = 0;
  responseAge = 999;
  particles = [];
}

// ---------- mouse: drag the fixed ball ----------
function mousePressed() {
  if (mode !== 'One ball' || mouseY < 0 || mouseY > drawHeight || mouseX < 0 || mouseX > canvasWidth) return;
  const f = fixedPos();
  if (dist(mouseX, mouseY, f.x, f.y) < fixedR) dragging = true;
}

function mouseDragged() {
  if (!dragging) return;
  fixedFx = constrain(mouseX, fixedR, canvasWidth - fixedR) / canvasWidth;
  fixedFy = constrain(mouseY, fixedR, drawHeight - fixedR) / drawHeight;
}

function mouseReleased() {
  dragging = false;
}

// ---------- layout ----------
function positionControls() {
  const y1 = drawHeight + 8;
  modeRadio.position(10, y1);
  let x = 10 + modeRadio.elt.offsetWidth + 12;
  startButton.position(x, y1);
  x += 62;
  resetButton.position(x, y1);
  x += resetButton.elt.offsetWidth + 14;
  vectorsCheckbox.position(x, y1 + 2);
  const narrow = canvasWidth < 470 || x + vectorsCheckbox.elt.offsetWidth > canvasWidth - 8;
  spawnLabelX = 10;
  if (narrow) {
    vectorsCheckbox.position(10, drawHeight + 115);   // shares the spawn-rate row
    spawnLabelX = 10 + vectorsCheckbox.elt.offsetWidth + 12;
  }

  gravitySlider.position(sliderLeftMargin, drawHeight + 45);
  bounceSlider.position(sliderLeftMargin, drawHeight + 80);
  const spawnLeft = narrow ? spawnLabelX + 112 : sliderLeftMargin;
  spawnSlider.position(spawnLeft, drawHeight + 115);
  gravitySlider.size(canvasWidth - sliderLeftMargin - margin);
  bounceSlider.size(canvasWidth - sliderLeftMargin - margin);
  spawnSlider.size(max(60, canvasWidth - spawnLeft - margin));
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
