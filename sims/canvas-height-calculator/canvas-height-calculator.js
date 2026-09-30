// Canvas Height Calculator MicroSim
// CANVAS_HEIGHT: 660
// Learners set the region heights of a model MicroSim and an iframe height,
// then see whether the iframe shows the whole canvas or clips the controls.
// Rule taught: CANVAS_HEIGHT = drawHeight + controlHeight + graphHeight
//              iframe height = CANVAS_HEIGHT + 2   (2 px for the iframe border)

// ----- Layout of THIS MicroSim (standard MicroSim variables) -----
let canvasWidth = 400;                          // replaced by the container width
let drawHeight = 480;                           // drawing region - no controls here
let controlHeight = 180;                        // 5 rows of controls
let canvasHeight = drawHeight + controlHeight;  // 660
let margin = 25;
let sliderLeftMargin = 170;
let defaultTextSize = 16;

// ----- The MODEL MicroSim whose heights the learner is calculating -----
let modelDraw = 480;      // model drawHeight
let modelControl = 50;    // model controlHeight
let modelGraph = 0;       // model graphHeight
let iframeHeight = 532;   // height of the iframe that embeds the model

// H-Bridge numbers from Chapter 2
const HBRIDGE = { draw: 480, control: 50, graph: 0, iframe: 532 };

// Controls
let drawSlider, controlSlider, graphSlider, iframeSlider;
let snapButton, hbridgeCheckbox;

// Picture geometry (recomputed each frame)
const pictureTop = 68;     // top of both pictures
const pictureHeight = 206; // tallest picture (in screen pixels)

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Row 0: button and checkbox
  snapButton = createButton('Set iframe correctly');
  snapButton.position(10, drawHeight + 8);
  snapButton.mousePressed(snapIframe);

  hbridgeCheckbox = createCheckbox(' Show H-Bridge numbers', false);
  hbridgeCheckbox.position(175, drawHeight + 10);
  hbridgeCheckbox.changed(loadHBridge);

  // Rows 1-4: sliders (min, max, default, step)
  drawSlider = createSlider(200, 700, modelDraw, 10);
  controlSlider = createSlider(30, 150, modelControl, 5);
  graphSlider = createSlider(0, 250, modelGraph, 10);
  // The iframe slider runs to 1110 in steps of 1 so that "Set iframe correctly"
  // can always reach the calculated value (the largest possible is 700+150+250+2).
  iframeSlider = createSlider(200, 1110, iframeHeight, 1);

  const sliders = [drawSlider, controlSlider, graphSlider, iframeSlider];
  for (let i = 0; i < sliders.length; i++) {
    sliders[i].position(sliderLeftMargin, sliderRowY(i + 1));
    sliders[i].size(canvasWidth - sliderLeftMargin - margin);
    sliders[i].input(sliderMoved);
  }

  describe('Canvas height calculator. Four sliders set a model MicroSim\'s drawHeight, ' +
    'controlHeight and graphHeight and the height of the iframe that embeds it. ' +
    'On the left a scaled picture stacks the regions of the canvas; on the right a rounded ' +
    'frame shows the iframe. A readout computes canvasHeight = drawHeight + controlHeight + ' +
    'graphHeight and iframe height = CANVAS_HEIGHT + 2, and reports whether the iframe fits ' +
    'or how many pixels, including controls, are hidden.', LABEL);
}

// y position of control row n (row 0 = button row)
function sliderRowY(n) {
  return drawHeight + 8 + n * 34;
}

function draw() {
  updateCanvasSize();

  // Standard regions
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Read the controls
  modelDraw = drawSlider.value();
  modelControl = controlSlider.value();
  modelGraph = graphSlider.value();
  iframeHeight = iframeSlider.value();

  const canvasH = modelDraw + modelControl + modelGraph; // CANVAS_HEIGHT
  const needed = canvasH + 2;                             // correct iframe height
  const hidden = max(0, needed - iframeHeight);           // pixels cut off
  const blank = max(0, iframeHeight - needed);            // unused space

  // Title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(22);
  text('Canvas Height Calculator', canvasWidth / 2, 10);

  // One scale for both pictures so their heights can be compared directly
  const scaleFactor = pictureHeight / max(needed, iframeHeight);

  drawCanvasPicture(canvasH, scaleFactor);
  drawIframePicture(canvasH, needed, hidden, blank, scaleFactor);
  drawReadout(canvasH, needed, hidden, blank);
  drawControlLabels();
}

// ---------------------------------------------------------------
// Left picture: the model canvas as designed
// ---------------------------------------------------------------
function drawCanvasPicture(canvasH, s) {
  const figX = canvasWidth * 0.29;
  const figW = min(150, canvasWidth * 0.17);
  const y0 = pictureTop;

  noStroke();
  fill('black');
  textSize(15);
  textAlign(CENTER, BOTTOM);
  text(canvasWidth < 560 ? 'canvas' : 'MicroSim canvas', figX + figW / 2, y0 - 6);

  const regions = modelRegions();
  let y = y0;
  const labelYs = [];
  for (const r of regions) {
    const h = r.h * s;
    stroke('silver');
    strokeWeight(1);
    fill(r.fill);
    rect(figX, y, figW, h);
    if (r.name === 'controlHeight') drawMockControls(figX, y, figW, h, s, Infinity, false);
    labelYs.push({ name: r.name, value: r.h, y: y + h / 2 });
    y += h;
  }

  // Region labels to the left of the picture, spread so they never overlap
  // and never extend below the bottom of the picture (two text lines each)
  const gap = 38;
  for (let i = 1; i < labelYs.length; i++) {
    labelYs[i].y = max(labelYs[i].y, labelYs[i - 1].y + gap);
  }
  const lastIdx = labelYs.length - 1;
  labelYs[lastIdx].y = min(labelYs[lastIdx].y, y - 14);
  for (let i = lastIdx - 1; i >= 0; i--) {
    labelYs[i].y = min(labelYs[i].y, labelYs[i + 1].y - gap);
  }
  textSize(14);
  textAlign(RIGHT, CENTER);
  for (const L of labelYs) {
    const ly = L.y;
    noStroke();
    fill('black');
    text(L.name, figX - 8, ly - 8);
    fill('dimgray');
    text(L.value + ' px', figX - 8, ly + 9);
  }

  // Total brace under the picture
  noStroke();
  fill('navy');
  textAlign(CENTER, TOP);
  textSize(14);
  text('CANVAS_HEIGHT = ' + canvasH, figX + figW / 2, y + 6);
}

// ---------------------------------------------------------------
// Right picture: the iframe on the page, which may clip the canvas
// ---------------------------------------------------------------
function drawIframePicture(canvasH, needed, hidden, blank, s) {
  const figX = canvasWidth * 0.60;
  const figW = min(150, canvasWidth * 0.17);
  const frameX = figX - 3;
  const frameW = figW + 6;
  const y0 = pictureTop;
  const frameH = iframeHeight * s;
  // visible content height inside the 1 px iframe border (model pixels)
  const visibleModel = iframeHeight - 2;

  noStroke();
  fill('black');
  textSize(15);
  textAlign(CENTER, BOTTOM);
  text(canvasWidth < 560 ? 'iframe' : 'iframe on the page', frameX + frameW / 2, y0 - 6);

  // Page background inside the frame
  stroke('dimgray');
  strokeWeight(2);
  fill('white');
  rect(frameX, y0, frameW, frameH, 8);

  // Canvas regions: clip to the inside of the frame
  const regions = modelRegions();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(frameX, y0, frameW, frameH);
  drawingContext.clip();
  let y = y0 + 1 * s;
  for (const r of regions) {
    const h = r.h * s;
    stroke('silver');
    strokeWeight(1);
    fill(r.fill);
    rect(figX, y, figW, h);
    if (r.name === 'controlHeight') drawMockControls(figX, y, figW, h, s, visibleModel, true);
    y += h;
  }
  drawingContext.restore();

  // Hidden part below the frame, ghosted in red
  if (hidden > 0) {
    const hiddenTop = y0 + frameH;
    const hiddenH = hidden * s;
    // ghost of the clipped canvas
    drawingContext.save();
    drawingContext.setLineDash([5, 4]);
    stroke('red');
    strokeWeight(1.5);
    fill(255, 0, 0, 30);
    rect(figX, hiddenTop, figW, hiddenH);
    drawingContext.restore();
    // clipped mock controls drawn in red
    let cy = y0 + 1 * s;
    for (const r of regions) {
      const h = r.h * s;
      if (r.name === 'controlHeight') {
        drawingContext.save();
        drawingContext.beginPath();
        drawingContext.rect(figX, hiddenTop, figW, hiddenH);
        drawingContext.clip();
        drawMockControls(figX, cy, figW, h, s, visibleModel, true);
        drawingContext.restore();
      }
      cy += h;
    }
  }

  // Labels to the right of the frame
  const lx = frameX + frameW + 8;
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  fill('black');
  text('iframe', lx, y0 + 2);
  fill('dimgray');
  text(iframeHeight + ' px', lx, y0 + 19);
  fill('black');
  text('needed', lx, y0 + 42);
  fill('dimgray');
  text(needed + ' px', lx, y0 + 59);

  if (hidden > 0) {
    // red bracket beside the hidden part
    const top = y0 + frameH;
    const bot = top + hidden * s;
    stroke('red');
    strokeWeight(2);
    line(lx - 4, top, lx - 4, bot);
    line(lx - 4, top, lx, top);
    line(lx - 4, bot, lx, bot);
    noStroke();
    fill('red');
    textAlign(LEFT, CENTER);
    const midY = max((top + bot) / 2, y0 + 92);
    text('hidden', lx + 4, midY - 8);
    text(hidden + ' px', lx + 4, midY + 9);
  } else if (blank > 0) {
    noStroke();
    fill('darkorange');
    textAlign(LEFT, CENTER);
    const top = y0 + needed * s;
    const midY = max((top + y0 + frameH) / 2, y0 + 92);
    text('blank', lx, midY - 8);
    text(blank + ' px', lx, midY + 9);
  }
}

// Regions of the model canvas from top to bottom
function modelRegions() {
  const list = [{ name: 'drawHeight', h: modelDraw, fill: 'aliceblue' }];
  if (modelGraph > 0) list.push({ name: 'graphHeight', h: modelGraph, fill: 'lemonchiffon' });
  list.push({ name: 'controlHeight', h: modelControl, fill: 'white' });
  return list;
}

// Draw simple pictures of controls (a button and a slider per row).
// Rows whose bottom lies below visibleModel (model px) are clipped and drawn in red.
function drawMockControls(x, y, w, h, s, visibleModel, markClipped) {
  const rows = max(1, floor(modelControl / 35));
  const regionTopModel = modelDraw + modelGraph; // model y of the control region top
  for (let i = 0; i < rows; i++) {
    const rowTopModel = 5 + i * 35;
    const rowH = min(25, modelControl - 10);
    const rowBottomModel = regionTopModel + rowTopModel + rowH;
    const clipped = markClipped && rowBottomModel > visibleModel;
    const ry = y + rowTopModel * s;
    const rh = max(2, rowH * s);
    const col = clipped ? 'red' : 'steelblue';
    // button
    noStroke();
    fill(col);
    rect(x + w * 0.06, ry, w * 0.26, rh, 2);
    // slider track and knob
    stroke(col);
    strokeWeight(2);
    line(x + w * 0.42, ry + rh / 2, x + w * 0.92, ry + rh / 2);
    noStroke();
    fill(col);
    circle(x + w * 0.62, ry + rh / 2, max(4, min(10, rh)));
  }
}

// ---------------------------------------------------------------
// Readout panel with the two equations and the fit message
// ---------------------------------------------------------------
function drawReadout(canvasH, needed, hidden, blank) {
  const px = margin - 10;
  const py = 300;
  const pw = canvasWidth - 2 * px;
  const ph = drawHeight - py - 8;
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(px, py, pw, ph, 10);

  noStroke();
  textAlign(LEFT, TOP);
  const narrow = canvasWidth < 700;
  const lineH = narrow ? 20 : 24;
  textSize(narrow ? 15 : 16);
  const tx = px + 12;
  const tw = pw - 24;
  let y = py + 8;

  const eq1a = 'canvasHeight = drawHeight + controlHeight + graphHeight';
  const eq1b = '= ' + modelDraw + ' + ' + modelControl + ' + ' + modelGraph + ' = ' + canvasH;
  fill('black');
  if (fontWidth(eq1a + ' ' + eq1b) < tw) {
    text(eq1a + ' ', tx, y);
    fill('navy');
    text(eq1b, tx + fontWidth(eq1a + ' '), y);
    y += lineH;
  } else {
    text(eq1a, tx, y, tw);
    y += fontWidth(eq1a) > tw ? 2 * lineH : lineH;
    fill('navy');
    text(eq1b, tx + 20, y);
    y += lineH + 2;
  }

  const eq2a = 'iframe height = CANVAS_HEIGHT + 2';
  const eq2b = '= ' + canvasH + ' + 2 = ' + needed;
  fill('black');
  text(eq2a + ' ', tx, y);
  fill('navy');
  if (fontWidth(eq2a + ' ' + eq2b) < tw) {
    text(eq2b, tx + fontWidth(eq2a + ' '), y);
    y += lineH + 4;
  } else {
    y += lineH;
    text(eq2b, tx + 20, y);
    y += lineH + 4;
  }

  let msg;
  if (hidden > 0) {
    fill('firebrick');
    msg = 'Too short: ' + hidden + ' px of the MicroSim are hidden' +
      (hidden > 2 ? ', and the red controls are cut off.' : '.');
  } else if (blank > 0) {
    fill('darkgreen');
    msg = 'The MicroSim fits, with ' + blank + ' px of blank space below it.';
  } else {
    fill('darkgreen');
    msg = 'The MicroSim fits exactly: the iframe is CANVAS_HEIGHT + 2.';
  }
  textStyle(BOLD);
  text(msg, tx, y, tw);
  textStyle(NORMAL);

  // A practice prompt when there is room for it (wide layouts)
  const msgLines = ceil(fontWidth(msg) / tw);
  const tipY = y + msgLines * lineH + 12;
  if (tipY + 2 * lineH < py + ph) {
    fill('dimgray');
    text('Practice: move a region slider, work out the new iframe height yourself, ' +
      'then press "Set iframe correctly" to check your answer.', tx, tipY, tw);
  }
}

// ---------------------------------------------------------------
// Control labels (label and value together, left of each slider)
// ---------------------------------------------------------------
function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('drawHeight: ' + modelDraw, 10, sliderRowY(1) + 10);
  text('controlHeight: ' + modelControl, 10, sliderRowY(2) + 10);
  text('graphHeight: ' + modelGraph, 10, sliderRowY(3) + 10);
  text('iframe height: ' + iframeHeight, 10, sliderRowY(4) + 10);
}

// ---------------------------------------------------------------
// Event handlers
// ---------------------------------------------------------------
function snapIframe() {
  const needed = drawSlider.value() + controlSlider.value() + graphSlider.value() + 2;
  iframeSlider.value(needed);
}

function loadHBridge() {
  if (hbridgeCheckbox.checked()) {
    drawSlider.value(HBRIDGE.draw);
    controlSlider.value(HBRIDGE.control);
    graphSlider.value(HBRIDGE.graph);
    iframeSlider.value(HBRIDGE.iframe);
  }
}

// Moving any slider means the numbers are no longer the H-Bridge's
function sliderMoved() {
  if (hbridgeCheckbox.checked()) {
    const same = drawSlider.value() === HBRIDGE.draw &&
      controlSlider.value() === HBRIDGE.control &&
      graphSlider.value() === HBRIDGE.graph &&
      iframeSlider.value() === HBRIDGE.iframe;
    if (!same) hbridgeCheckbox.checked(false);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  const w = canvasWidth - sliderLeftMargin - margin;
  drawSlider.size(w);
  controlSlider.size(w);
  graphSlider.size(w);
  iframeSlider.size(w);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.floor(container.getBoundingClientRect().width);
  }
}
