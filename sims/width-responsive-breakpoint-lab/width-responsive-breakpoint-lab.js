// Width-Responsive Breakpoint Lab - p5.js MicroSim
// CANVAS_HEIGHT: 535
// Learning objective (Apply / demonstrate): the learner demonstrates how container width
// detection and the windowResized handler keep a MicroSim usable, by dragging a container
// edge and switching the handler and slider resizing on and off.
// A "container" frame holds a miniature MicroSim (ball, Gravity slider, three buttons).
// Drag the frame's right edge (280-900 px). With both checkboxes on, the mini canvas and
// slider follow the container. Turn "Call windowResized" off and the canvas keeps its load
// width; turn only "Resize sliders in the handler" off and the slider track keeps its old
// length. The lab itself follows the same width-responsive pattern it teaches.

// ---------- canvas layout ----------
let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 115;                // three rows of controls
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

// ---------- the miniature MicroSim (all widths in its own pixels) ----------
const MIN_W = 280, MAX_W = 900;
const MINI_DRAW_H = 120, MINI_CTRL_H = 70, MINI_H = MINI_DRAW_H + MINI_CTRL_H;
const MINI_SLIDER_LEFT = 110;           // the mini sketch's sliderLeftMargin
const MINI_RIGHT_MARGIN = 25;           // the mini sketch's right margin
const MINI_BUTTONS = [{ x: 10, label: 'Start' }, { x: 80, label: 'Pause' }, { x: 150, label: 'Reset' }];
const MINI_BUTTON_W = 62;

let containerW = 600;                   // the container (<main>) width being simulated
let loadW = 600;                        // width measured by the last setup()
let miniCanvasW = 600;                  // the mini canvas width
let sliderLen = 600 - MINI_SLIDER_LEFT - MINI_RIGHT_MARGIN;
let note = 'Drag the right edge of the dashed container. Predict first: what should move?';
let noteColor = 'dimgray';

// ---------- screen geometry ----------
let s = 1;                              // screen pixels per mini pixel (horizontal)
let frame = { x: 0, y: 0, h: 0 };
let dragging = false;

// ---------- controls ----------
let handlerCheckbox, sliderCheckbox, reloadButton, presetSelect;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  handlerCheckbox = createCheckbox(' Call windowResized', true);
  handlerCheckbox.position(10, drawHeight + 8);
  handlerCheckbox.changed(() => setNote(handlerCheckbox.checked()
    ? 'windowResized() is back on. It runs on the next resize, so drag the edge to see it catch up.'
    : 'windowResized() is off. The mini canvas keeps the width it measured at load: ' + loadW + ' px.',
    'black'));
  sliderCheckbox = createCheckbox(' Resize sliders in the handler', true);
  sliderCheckbox.position(10, drawHeight + 42);
  sliderCheckbox.changed(() => setNote(sliderCheckbox.checked()
    ? 'The handler resizes the slider again, starting with the next resize.'
    : 'The handler still resizes the canvas, but no longer calls gravitySlider.size().', 'black'));

  reloadButton = createButton('Reload page');
  reloadButton.position(10, drawHeight + 78);
  reloadButton.mousePressed(reloadPage);
  presetSelect = createSelect();
  presetSelect.option('Preset width...', '');
  presetSelect.option('Phone 375', '375');
  presetSelect.option('Tablet 768', '768');
  presetSelect.option('Desktop 1024 (max 900)', '1024');
  presetSelect.position(120, drawHeight + 78);
  presetSelect.changed(() => {
    const v = parseInt(presetSelect.value(), 10);
    if (!v) return;
    setContainer(min(v, MAX_W));
    setNote('Preset: the container is now ' + containerW + ' px' +
      (v > MAX_W ? ' (1024 is clamped to the 900 px maximum).' : '.'), 'black');
  });

  updateDescription();
}

function draw() {
  updateCanvasSize();
  layout();

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
  text('Width-Responsive Breakpoint Lab', canvasWidth / 2, 8);

  drawReadout();
  drawMini();
  drawFrame();
  drawRuler();
  drawNotes();

  const overHandle = nearHandle(mouseX, mouseY);
  cursor(dragging || overHandle ? 'ew-resize' : ARROW);
}

// ---------- layout ----------
function narrow() { return canvasWidth < 560; }

function layout() {
  s = (canvasWidth - 2 * margin - 18) / MAX_W;
  frame.x = margin + 4;
  frame.y = narrow() ? 86 : 72;
  frame.h = MINI_H + 12;
}

function sx(miniX) { return frame.x + miniX * s; }       // mini x -> screen x

// ---------- drawing ----------
function drawReadout() {
  noStroke();
  textSize(16);
  textStyle(BOLD);
  const a = 'container width = ' + containerW + ' px';
  const b = 'canvas width = ' + miniCanvasW + ' px';
  const same = abs(containerW - miniCanvasW) <= 1;
  if (narrow()) {
    textAlign(CENTER, TOP);
    fill('saddlebrown'); text(a, canvasWidth / 2, 38);
    fill(same ? 'darkgreen' : 'firebrick'); text(b, canvasWidth / 2, 58);
  } else {
    textAlign(RIGHT, TOP);
    fill('saddlebrown'); text(a, canvasWidth / 2 - 12, 40);
    textAlign(LEFT, TOP);
    fill(same ? 'darkgreen' : 'firebrick'); text(b, canvasWidth / 2 + 12, 40);
  }
  textStyle(NORMAL);
}

function drawMini() {
  const top = frame.y + 6;
  const cw = miniCanvasW * s;
  // mini drawing region and control region
  stroke('silver');
  strokeWeight(1);
  fill('azure');
  rect(frame.x, top, cw, MINI_DRAW_H);
  fill('white');
  rect(frame.x, top + MINI_DRAW_H, cw, MINI_CTRL_H);

  // ball at canvasWidth / 2
  noStroke();
  fill('royalblue');
  circle(sx(miniCanvasW / 2), top + MINI_DRAW_H / 2 + 8, 26);
  fill('dimgray');
  textAlign(LEFT, TOP);
  textSize(12);
  if (cw > 120) text('mini MicroSim canvas', frame.x + 5, top + 4);

  // Gravity label and slider
  const rowY = top + MINI_DRAW_H + 20;
  const ts = constrain(14 * s * 1.6, 10, 14);
  textSize(ts);
  fill('black');
  textAlign(LEFT, CENTER);
  text(s > 0.6 ? 'Gravity: 9.8' : 'Gravity', sx(8), rowY);
  const x0 = sx(MINI_SLIDER_LEFT), x1 = sx(MINI_SLIDER_LEFT + sliderLen);
  stroke('lightsteelblue');
  strokeWeight(6);
  line(x0, rowY, x1, rowY);
  stroke('royalblue');
  line(x0, rowY, lerp(x0, x1, 0.4), rowY);
  noStroke();
  fill('royalblue');
  circle(lerp(x0, x1, 0.4), rowY, 14);

  // red outline marks any part of the track past the canvas edge
  const canvasRight = frame.x + cw;
  if (x1 > canvasRight + 1) {
    noFill();
    stroke('red');
    strokeWeight(2);
    rect(canvasRight, rowY - 9, x1 - canvasRight + 4, 18, 3);
  }

  // three buttons at fixed x positions
  const by = top + MINI_DRAW_H + 40;
  for (const b of MINI_BUTTONS) {
    const bx = sx(b.x), bw = MINI_BUTTON_W * s;
    stroke('gray');
    strokeWeight(1);
    fill('gainsboro');
    rect(bx, by, bw, 22, 4);
    noStroke();
    fill('black');
    textAlign(CENTER, CENTER);
    textSize(ts);
    if (textWidth(b.label) < bw - 4) text(b.label, bx + bw / 2, by + 11);
  }
  strokeWeight(1);
}

function drawFrame() {
  const fx = frame.x, fr = sx(containerW), fy = frame.y;
  const cw = miniCanvasW * s;
  // blank space inside the container, right of a too-narrow canvas
  if (cw < fr - fx - 1) {
    noStroke();
    fill(255, 165, 0, 60);
    rect(fx + cw, fy + 6, fr - fx - cw, MINI_H);
    fill('darkorange');
    textAlign(CENTER, CENTER);
    textSize(13);
    if (fr - fx - cw > 70) text('blank space', (fx + cw + fr) / 2, fy + 6 + MINI_DRAW_H / 2);
  }
  // everything right of the container edge is hidden by the iframe
  const right = max(fx + cw, sx(MINI_SLIDER_LEFT + sliderLen) + 6);
  if (right > fr + 1) {
    noStroke();
    fill(255, 255, 255, 170);
    rect(fr, fy, right - fr, frame.h);
    stroke(220, 20, 60, 120);
    strokeWeight(1);
    for (let x = fr - frame.h; x < right; x += 10) {
      line(max(x, fr), fy + max(0, fr - x), min(x + frame.h, right), fy + min(frame.h, right - x));
    }
    noStroke();
    fill('crimson');
    textSize(13);
    textAlign(CENTER, CENTER);
    if (right - fr > 60) text('clipped', (fr + right) / 2, fy + 18);
  }
  // the dashed container outline and its draggable right edge
  push();
  noFill();
  stroke('saddlebrown');
  strokeWeight(2);
  drawingContext.setLineDash([7, 5]);
  rect(fx - 3, fy, fr - fx + 3, frame.h);
  pop();
  noStroke();
  fill('saddlebrown');
  textAlign(LEFT, BOTTOM);
  textSize(13);
  text('container <main>', fx, fy - 2);
  // handle: at least 24 px wide for touch
  fill(dragging ? 'goldenrod' : 'burlywood');
  stroke('saddlebrown');
  rect(fr - 5, fy + frame.h / 2 - 26, 10, 52, 4);
  stroke('saddlebrown');
  for (let k = -1; k <= 1; k++) line(fr - 2, fy + frame.h / 2 + k * 8, fr + 2, fy + frame.h / 2 + k * 8);
  strokeWeight(1);
}

function drawRuler() {
  const y = frame.y + frame.h + 8;
  stroke('gray');
  line(sx(0), y, sx(MAX_W), y);
  const ticks = [0, 280, 375, 600, 768, 900];
  textSize(11);
  for (const t of ticks) {
    stroke('gray');
    line(sx(t), y, sx(t), y + 5);
    noStroke();
    fill('dimgray');
    textAlign(t === 0 ? LEFT : (t === MAX_W ? RIGHT : CENTER), TOP);
    if (s > 0.5 || t % 300 === 0 || t === 375 || t === 768) text(t, sx(t), y + 6);
  }
}

function drawNotes() {
  const top = frame.y + frame.h + 30;
  const lx = margin + 4, maxW = canvasWidth - 2 * margin - 8;
  let y = top;
  noStroke();
  textAlign(LEFT, TOP);
  textSize(narrow() ? 14 : 15);
  const lh = narrow() ? 17 : 19;
  const lines = diagnosis();
  lines.push({ t: note, c: noteColor });
  for (const item of lines) {
    fill(item.c);
    for (const l of wrapLines(item.t, maxW)) {
      if (y + lh > drawHeight - 4) return;
      text(l, lx, y);
      y += lh;
    }
  }
}

function diagnosis() {
  const out = [];
  const d = miniCanvasW - containerW;
  if (d > 1) out.push({ t: 'Canvas is ' + d + ' px wider than its container, so its right edge is clipped.', c: 'firebrick' });
  else if (d < -1) out.push({ t: 'Canvas is ' + (-d) + ' px narrower than its container, leaving blank space.', c: 'darkorange' });
  else out.push({ t: 'Canvas matches the container: nothing is clipped.', c: 'darkgreen' });
  const end = MINI_SLIDER_LEFT + sliderLen;
  const ideal = miniCanvasW - MINI_RIGHT_MARGIN;
  if (end > miniCanvasW) out.push({ t: 'Slider track overshoots the canvas by ' + (end - miniCanvasW) + ' px (red outline).', c: 'firebrick' });
  else if (end < ideal - 3) out.push({ t: 'Slider track stops ' + (ideal - end) + ' px short of where it should end.', c: 'darkorange' });
  else out.push({ t: 'Slider track fits the canvas.', c: 'darkgreen' });
  return out;
}

function wrapLines(str, maxW) {
  const words = str.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const t = cur ? cur + ' ' + w : w;
    if (textWidth(t) > maxW && cur) { lines.push(cur); cur = w; } else { cur = t; }
  }
  if (cur) lines.push(cur);
  return lines;
}

// ---------- the model being demonstrated ----------
// Changing the container fires the mini sketch's windowResized(), if it is being called.
function setContainer(w) {
  containerW = round(constrain(w, MIN_W, MAX_W));
  if (handlerCheckbox.checked()) {
    miniCanvasW = containerW;                                       // resizeCanvas(...)
    if (sliderCheckbox.checked()) {
      sliderLen = miniCanvasW - MINI_SLIDER_LEFT - MINI_RIGHT_MARGIN;   // gravitySlider.size(...)
    }
  }
  updateDescription();
}

// "Reload page": setup() runs again and measures the container.
function reloadPage() {
  loadW = containerW;
  miniCanvasW = containerW;
  sliderLen = containerW - MINI_SLIDER_LEFT - MINI_RIGHT_MARGIN;
  setNote('setup() ran again: updateCanvasSize() measured the container at ' + containerW +
    ' px, and createCanvas() and the slider used that width.', 'black');
  updateDescription();
}

function setNote(t, c) { note = t; noteColor = c || 'black'; }

// ---------- pointer ----------
function nearHandle(mx, my) {
  const fr = sx(containerW);
  return abs(mx - fr) <= 14 && my >= frame.y && my <= frame.y + frame.h;
}

function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight) return;
  if (nearHandle(mouseX, mouseY)) {
    dragging = true;
    return false;
  }
  explain(mouseX, mouseY);
}

function mouseDragged() {
  if (!dragging) return;
  setContainer((mouseX - frame.x) / s);
  return false;
}

function mouseReleased() {
  if (dragging) {
    dragging = false;
    presetSelect.selected('');
  }
}

// clicking part of the miniature names the function responsible for its width
function explain(mx, my) {
  const top = frame.y + 6;
  const fr = sx(containerW);
  const rowY = top + MINI_DRAW_H + 20;
  const by = top + MINI_DRAW_H + 40;
  const inY = (a, b) => my >= a && my <= b;
  if (dist(mx, my, sx(miniCanvasW / 2), top + MINI_DRAW_H / 2 + 8) < 18) {
    return setNote('Ball: its x position is canvasWidth / 2, computed in draw(), so it moves only when canvasWidth changes.', 'navy');
  }
  if (inY(rowY - 10, rowY + 10) && mx >= sx(MINI_SLIDER_LEFT) - 4 && mx <= sx(MINI_SLIDER_LEFT + sliderLen) + 6) {
    return setNote('Slider: its track length is set by gravitySlider.size(canvasWidth - sliderLeftMargin - margin), in setup() and again in windowResized().', 'navy');
  }
  for (const b of MINI_BUTTONS) {
    if (inY(by, by + 22) && mx >= sx(b.x) && mx <= sx(b.x + MINI_BUTTON_W)) {
      return setNote('Buttons: position(x, drawHeight + 5) places them at fixed x values, so their width never depends on the container.', 'navy');
    }
  }
  if (inY(frame.y, frame.y + frame.h) && mx > fr) {
    return setNote('Clipped area: this part lies outside the container, so the iframe hides it. resizeCanvas() in windowResized() would have shrunk the canvas.', 'navy');
  }
  if (inY(top, top + MINI_H) && mx >= frame.x && mx <= frame.x + miniCanvasW * s) {
    return setNote('Canvas: createCanvas() in setup() sets its width, and only resizeCanvas(canvasWidth, canvasHeight) in windowResized() changes it later.', 'navy');
  }
  if (inY(frame.y - 16, frame.y + frame.h) && mx >= frame.x - 4 && mx <= fr) {
    return setNote('Container: the <main> element. The page layout sets its width, and updateCanvasSize() reads it with getBoundingClientRect().', 'navy');
  }
  if (inY(34, 78)) {
    return setNote('Readout: updateCanvasSize() measures the container; the canvas width is whatever createCanvas() or resizeCanvas() set last.', 'navy');
  }
}

function updateDescription() {
  describe('Width-Responsive Breakpoint Lab. Container ' + containerW + ' pixels, mini canvas ' +
    miniCanvasW + ' pixels, slider track ' + sliderLen + ' pixels. Drag the container edge and ' +
    'toggle windowResized and slider resizing to see what breaks.', LABEL);
}

// ---------- responsive design: the lab follows the pattern it teaches ----------
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
