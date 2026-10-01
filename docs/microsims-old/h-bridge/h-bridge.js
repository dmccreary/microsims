// H-Bridge Circuit MicroSim
// CANVAS_HEIGHT: 530
// Use CANVAS_HEIGHT + 2 for every iframe that embeds this MicroSim.
// Students click the four knife switches (or press Forward, Stop and Reverse)
// to see how an H-bridge sends current through a DC motor in either direction.
// Green dots show forward current, purple dots show reverse current, and a
// short circuit (both switches on one side closed) flashes the wires red.
// Switches are numbered in reading order: S1 top-left, S2 top-right,
// S3 bottom-left, S4 bottom-right.  Forward = S1 + S4.  Reverse = S2 + S3.
// The Forward and Reverse buttons are disabled while their preset is already set.

// global variables for width and height
let canvasWidth = 400;          // replaced by the container width
let drawHeight = 480;           // drawing region - no controls in here
let controlHeight = 50;         // control region - one row of buttons
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// colors for the two current directions and for a short circuit
const forwardColor = 'green';
const reverseColor = 'darkviolet';
const shortColor = 'red';
const warningTextColor = 'firebrick';   // darker red so warning text is easy to read

// buttons in the control region
let forwardButton, stopButton, reverseButton;
let statusX = 260;              // x of the motor status label (set in positionControls)

// The four knife switches.  side is the way the blade swings when it opens
// (-1 = left, 1 = right).  blade eases from 0 (closed) to 1 (fully open).
let switches = [
  { name: 'S1', closed: false, side: -1, blade: 1 },   // top-left
  { name: 'S2', closed: false, side:  1, blade: 1 },   // top-right
  { name: 'S3', closed: false, side: -1, blade: 1 },   // bottom-left
  { name: 'S4', closed: false, side:  1, blade: 1 }    // bottom-right
];
const openAngle = 0.7;          // how far an open blade swings out (radians, about 40 degrees)
let lastToggleTime = -1000;     // a single tap can arrive as two events - see mousePressed()

// animation state - it only advances while the mouse is over the MicroSim
let mouseOverSim = false;
let flowOffset = 0;             // distance the current dots have traveled (pixels)
let motorAngle = 0;             // rotation of the motor spiral and direction arrows
let flashPhase = 0;             // frame counter for the short-circuit flash

// circuit geometry - recomputed every frame so the circuit stays centered
let cx, Lx, Rx, topY, midY, botY, railLeft;
let motorR = 42;                // motor radius
let ringR = 60;                 // radius of the rotating direction arrows
let swLen = 56;                 // length of a knife-switch blade

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);
  textLeading(20);

  // pause the animation while the mouse is away from the MicroSim
  mainElement.addEventListener('mouseenter', () => mouseOverSim = true);
  mainElement.addEventListener('mouseleave', () => mouseOverSim = false);

  // preset buttons - each one sets all four switches at once
  forwardButton = createButton('Forward');
  forwardButton.mousePressed(() => setSwitches([true, false, false, true]));
  stopButton = createButton('Stop');
  stopButton.mousePressed(() => setSwitches([false, false, false, false]));
  reverseButton = createButton('Reverse');
  reverseButton.mousePressed(() => setSwitches([false, true, true, false]));
  for (const b of [forwardButton, stopButton, reverseButton]) {
    b.parent(mainElement);
    b.style('font-size', '16px');
  }
  positionControls();

  describe('An H-bridge circuit. A red +5 volt wire runs across the top and a black ground wire runs across the bottom. ' +
    'Four knife switches, S1 top-left, S2 top-right, S3 bottom-left and S4 bottom-right, connect a motor in the center to the two wires. ' +
    'Click a switch, or press keys 1 to 4, to open or close it. The Forward, Stop and Reverse buttons, or keys F, S and R, set all four switches. ' +
    'Green dots flow when current goes forward and the motor turns clockwise. Purple dots flow when current goes in reverse and the motor turns counterclockwise. ' +
    'If both switches on one side are closed, the shorted wires flash red.', LABEL);
}

// place the buttons in one row and the status label just to their right
function positionControls() {
  let x = 10;
  for (const b of [forwardButton, stopButton, reverseButton]) {
    b.position(x, drawHeight + 10);
    x += b.elt.offsetWidth + 10;
  }
  statusX = x + 10;
}

// Gray out Forward or Reverse while the switches already match that preset,
// so students can see that pressing it again would change nothing.
// The button comes back as soon as any switch changes.
function updateButtons(circuit) {
  forwardButton.elt.disabled = circuit.mode === 'forward';
  reverseButton.elt.disabled = circuit.mode === 'reverse';
}

function draw() {
  updateCanvasSize();
  computeGeometry();

  // drawing region - aliceblue with a silver border (MicroSim standard)
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  // control region - white with the same silver border
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // title centered at the top
  noStroke();
  fill('black');
  textSize(24);
  textAlign(CENTER, TOP);
  text('H-Bridge Circuit', canvasWidth / 2, 10);
  textSize(defaultTextSize);

  const circuit = analyzeCircuit();
  updateButtons(circuit);

  // advance the animation only while the mouse is over the MicroSim
  if (mouseOverSim) {
    flowOffset += 1.5;
    flashPhase++;
    if (circuit.mode === 'forward') motorAngle += 0.04;   // clockwise
    if (circuit.mode === 'reverse') motorAngle -= 0.04;   // counterclockwise
  }
  // ease each blade toward its open or closed position
  for (const s of switches) {
    s.blade = lerp(s.blade, s.closed ? 0 : 1, 0.3);
  }

  const hovered = hoveredSwitch();
  if (hovered >= 0) drawHoverHighlight(switches[hovered]);
  drawWires();
  if (circuit.leftShort || circuit.rightShort) drawShortFlash(circuit);
  drawSwitches(hovered);
  drawMotor(circuit);
  if (circuit.mode === 'forward') drawCurrent(forwardPath(), forwardColor);
  if (circuit.mode === 'reverse') drawCurrent(reversePath(), reverseColor);
  drawStatus(circuit);

  cursor(hovered >= 0 ? HAND : ARROW);
}

// Positions of the rails, legs, motor and switches for the current width
function computeGeometry() {
  cx = canvasWidth / 2;
  const legHalf = constrain(canvasWidth * 0.3, 120, 210);
  Lx = cx - legHalf;              // left leg of the "H"
  Rx = cx + legHalf;              // right leg of the "H"
  topY = 80;                      // +5V rail
  botY = drawHeight - 80;         // GND rail
  midY = (topY + botY) / 2;       // crossbar with the motor
  railLeft = max(12, Lx - 60);    // where the power supply connects

  // each knife switch sits halfway along its half of a leg
  const upperY = (topY + midY) / 2;
  const lowerY = (midY + botY) / 2;
  const spots = [[Lx, upperY], [Rx, upperY], [Lx, lowerY], [Rx, lowerY]];
  for (let i = 0; i < switches.length; i++) {
    const s = switches[i];
    s.x = spots[i][0];
    s.y = spots[i][1];
    s.pivotY = s.y - swLen / 2;     // hinge end of the blade
    s.contactY = s.y + swLen / 2;   // contact clip the blade closes onto
  }
}

// Work out what the four switches do to the motor
function analyzeCircuit() {
  const [s1, s2, s3, s4] = switches.map(s => s.closed);
  const leftShort = s1 && s3;     // +5V straight down the left leg to GND
  const rightShort = s2 && s4;    // +5V straight down the right leg to GND
  let mode = 'stopped';
  let message;

  if (leftShort && rightShort) {
    mode = 'short';
    message = 'SHORT CIRCUIT! Both sides connect +5V straight to GND. Open some switches!';
  } else if (leftShort) {
    mode = 'short';
    message = 'SHORT CIRCUIT! S1 + S3 connect +5V straight to GND. Open one of them!';
  } else if (rightShort) {
    mode = 'short';
    message = 'SHORT CIRCUIT! S2 + S4 connect +5V straight to GND. Open one of them!';
  } else if (s1 && s4) {
    mode = 'forward';
    message = 'S1 + S4 closed: current flows left to right, so the motor spins clockwise.';
  } else if (s2 && s3) {
    mode = 'reverse';
    message = 'S2 + S3 closed: current flows right to left, so the motor spins counterclockwise.';
  } else if (s1 && s2) {
    message = 'S1 + S2 closed: both motor wires touch +5V, so no current flows through the motor.';
  } else if (s3 && s4) {
    message = 'S3 + S4 closed: both motor wires touch GND, so no current flows through the motor.';
  } else {
    const closed = switches.filter(s => s.closed);
    if (closed.length === 1) {
      message = 'Only ' + closed[0].name + ' is closed. The circuit is not complete, so no current flows.';
    } else {
      message = 'All switches are open, so no current flows. Click a switch or press Forward.';
    }
  }
  return { mode, leftShort, rightShort, message };
}

// Current paths from +5V, through the motor, to GND (conventional current)
function forwardPath() {
  return [[railLeft, topY], [Lx, topY], [Lx, midY], [Rx, midY], [Rx, botY], [railLeft, botY]];
}

function reversePath() {
  return [[railLeft, topY], [Rx, topY], [Rx, midY], [Lx, midY], [Lx, botY], [railLeft, botY]];
}

function drawWires() {
  // +5V rail (red) and GND rail (black) - solid, wide wires
  strokeWeight(6);
  stroke('red');
  line(railLeft, topY, Rx, topY);
  stroke('black');
  line(railLeft, botY, Rx, botY);

  // the two legs of the "H" - leave a gap where each knife switch sits
  stroke('dimgray');
  strokeWeight(3);
  for (const s of switches) {
    const isUpper = s.y < midY;
    line(s.x, isUpper ? topY : midY, s.x, s.pivotY);
    line(s.x, s.contactY, s.x, isUpper ? midY : botY);
  }
  // crossbar wires from each leg to the motor
  line(Lx, midY, cx - motorR, midY);
  line(cx + motorR, midY, Rx, midY);

  // junction dots where wires join
  noStroke();
  fill('red');
  circle(Lx, topY, 12);
  circle(Rx, topY, 12);
  fill('black');
  circle(Lx, botY, 12);
  circle(Rx, botY, 12);
  fill('dimgray');
  circle(Lx, midY, 9);
  circle(Rx, midY, 9);

  // power supply terminals at the left end of each rail
  strokeWeight(3);
  fill('white');
  stroke('red');
  circle(railLeft, topY, 14);
  stroke('black');
  circle(railLeft, botY, 14);

  noStroke();
  textStyle(BOLD);
  fill(warningTextColor);
  textAlign(LEFT, BOTTOM);
  text('+5V', railLeft - 6, topY - 10);
  fill('black');
  textAlign(LEFT, TOP);
  text('GND', railLeft - 6, botY + 10);
  textStyle(NORMAL);
}

// A short circuit is a path from +5V straight to GND that skips the motor.
// Flash that path wide and red (2 flashes per second - safe for photosensitive viewers).
function drawShortFlash(circuit) {
  const flashOn = !mouseOverSim || floor(flashPhase / 15) % 2 === 0;
  if (!flashOn) return;
  noFill();
  stroke(shortColor);
  strokeWeight(12);
  strokeJoin(ROUND);
  const shortedLegs = [];
  if (circuit.leftShort) shortedLegs.push(Lx);
  if (circuit.rightShort) shortedLegs.push(Rx);
  for (const x of shortedLegs) {
    beginShape();
    vertex(railLeft, topY);
    vertex(x, topY);
    vertex(x, botY);
    vertex(railLeft, botY);
    endShape();
  }
}

function drawSwitches(hovered) {
  for (let i = 0; i < switches.length; i++) {
    const s = switches[i];
    // the blade hinges at the pivot and swings outward as it opens
    const a = s.blade * openAngle;
    const tipX = s.x + s.side * sin(a) * swLen;
    const tipY = s.pivotY + cos(a) * swLen;

    // contact clip
    stroke('black');
    strokeWeight(2);
    fill('white');
    circle(s.x, s.contactY, 12);
    // blade
    stroke('dimgray');
    strokeWeight(5);
    line(s.x, s.pivotY, tipX, tipY);
    // hinge
    noStroke();
    fill('black');
    circle(s.x, s.pivotY, 12);
    // handle at the tip of the blade - it covers the clip when closed
    stroke('black');
    strokeWeight(1.5);
    fill(i === hovered ? 'orange' : 'gold');
    circle(tipX, tipY, 14);

    // name and state on the inside of the leg, away from the swinging blade
    const labelX = s.x - s.side * 16;
    noStroke();
    textAlign(s.side < 0 ? LEFT : RIGHT, CENTER);
    textStyle(BOLD);
    fill('black');
    text(s.name, labelX, s.y - 10);
    textStyle(NORMAL);
    fill(s.closed ? 'black' : 'dimgray');
    text(s.closed ? 'ON' : 'OFF', labelX, s.y + 10);
  }
}

function drawMotor(circuit) {
  const spinning = circuit.mode === 'forward' || circuit.mode === 'reverse';
  push();
  translate(cx, midY);
  // circular arrows around the motor show which way it turns
  if (spinning) {
    const forward = circuit.mode === 'forward';
    drawDirectionArrows(forward ? 1 : -1, forward ? forwardColor : reverseColor);
  }
  // motor body
  stroke('dimgray');
  strokeWeight(3);
  fill('lightgray');
  circle(0, 0, motorR * 2);
  // the spiral turns with the motor shaft
  rotate(motorAngle);
  noFill();
  stroke('black');
  strokeWeight(3);
  const turns = 2.5;
  beginShape();
  for (let a = 0; a <= TWO_PI * turns; a += 0.12) {
    const r = map(a, 0, TWO_PI * turns, 3, motorR - 8);
    vertex(r * cos(a), r * sin(a));
  }
  endShape();
  pop();

  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  text('Motor', cx, midY + ringR + 12);
}

// Three curved arrows on a ring.  dir = 1 is clockwise, dir = -1 is counterclockwise.
function drawDirectionArrows(dir, col) {
  push();
  rotate(motorAngle);
  // faint full circle behind the arrows
  const faint = color(col);
  faint.setAlpha(70);
  noFill();
  stroke(faint);
  strokeWeight(2);
  circle(0, 0, ringR * 2);

  const arcLength = radians(70);
  for (let k = 0; k < 3; k++) {
    const start = k * TWO_PI / 3;
    const end = start + arcLength;
    noFill();
    stroke(col);
    strokeWeight(5);
    arc(0, 0, ringR * 2, ringR * 2, start, end);

    // arrowhead on the leading end of the arc
    const a = dir > 0 ? end : start;
    const px = ringR * cos(a);
    const py = ringR * sin(a);
    const tx = -sin(a) * dir;       // tangent - the direction of travel
    const ty = cos(a) * dir;
    const nx = cos(a);              // radial - points away from the center
    const ny = sin(a);
    noStroke();
    fill(col);
    triangle(px + tx * 13, py + ty * 13,
             px - tx * 2 + nx * 9, py - ty * 2 + ny * 9,
             px - tx * 2 - nx * 9, py - ty * 2 - ny * 9);
  }
  pop();
}

// Dots that flow along the current path.  They hide while inside the motor.
function drawCurrent(path, col) {
  const lengths = [];
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const d = dist(path[i][0], path[i][1], path[i + 1][0], path[i + 1][1]);
    lengths.push(d);
    total += d;
  }
  const spacing = 24;
  stroke('white');
  strokeWeight(1.5);
  fill(col);
  for (let d = flowOffset % spacing; d < total; d += spacing) {
    // walk along the path to find the point that is d pixels from the start
    let remaining = d;
    for (let i = 0; i < lengths.length; i++) {
      if (remaining <= lengths[i]) {
        const f = remaining / lengths[i];
        const x = lerp(path[i][0], path[i + 1][0], f);
        const y = lerp(path[i][1], path[i + 1][1], f);
        if (dist(x, y, cx, midY) > motorR) circle(x, y, 10);
        break;
      }
      remaining -= lengths[i];
    }
  }
}

function drawStatus(circuit) {
  // explanation at the bottom of the drawing region
  const isShort = circuit.mode === 'short';
  noStroke();
  fill(isShort ? warningTextColor : 'black');
  textStyle(isShort ? BOLD : NORMAL);
  textAlign(CENTER, TOP);
  text(circuit.message, margin, botY + 30, canvasWidth - 2 * margin, drawHeight - botY - 32);

  // motor state in the control region, to the right of the buttons
  const labels = { forward: 'Motor: Forward', reverse: 'Motor: Reverse', stopped: 'Motor: Stopped', short: 'Short circuit!' };
  const colors = { forward: forwardColor, reverse: reverseColor, stopped: 'dimgray', short: warningTextColor };
  noStroke();
  fill(colors[circuit.mode]);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text(labels[circuit.mode], statusX, drawHeight + controlHeight / 2);
  textStyle(NORMAL);
}

// Clickable area around each switch: 48 px on the blade side, 56 px on the label side
function switchHitBox(s) {
  const left = s.side < 0 ? s.x - 48 : s.x - 56;
  return { x: left, y: s.pivotY - 14, w: 104, h: swLen + 28 };
}

function drawHoverHighlight(s) {
  const b = switchHitBox(s);
  stroke('orange');
  strokeWeight(2);
  fill('lightyellow');
  rect(b.x, b.y, b.w, b.h, 10);
}

// index of the switch under (x, y), or -1
function switchAt(x, y) {
  if (y < 0 || y > drawHeight) return -1;
  for (let i = 0; i < switches.length; i++) {
    const b = switchHitBox(switches[i]);
    if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return i;
  }
  return -1;
}

function hoveredSwitch() {
  return mouseOverSim ? switchAt(mouseX, mouseY) : -1;
}

function setSwitches(states) {
  for (let i = 0; i < switches.length; i++) {
    switches[i].closed = states[i];
  }
}

function mousePressed() {
  const i = switchAt(mouseX, mouseY);
  // a tap on a touch screen can fire both a touch and a mouse event - ignore the repeat
  if (i >= 0 && millis() - lastToggleTime > 300) {
    switches[i].closed = !switches[i].closed;
    lastToggleTime = millis();
    mouseOverSim = true;
  }
}

// keyboard access: 1-4 toggle a switch, F / S / R are the preset buttons
function keyPressed() {
  if (key >= '1' && key <= '4') {
    const s = switches[int(key) - 1];
    s.closed = !s.closed;
  } else if (key === 'f' || key === 'F') {
    setSwitches([true, false, false, true]);
  } else if (key === 's' || key === 'S') {
    setSwitches([false, false, false, false]);
  } else if (key === 'r' || key === 'R') {
    setSwitches([false, true, true, false]);
  }
}

// These two functions keep the MicroSim width-responsive
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.floor(container.getBoundingClientRect().width);
  }
}
