// MicroSim Technology Stack - click a layer to see its role; "Break it" to see what fails
// CANVAS_HEIGHT: 560
// Learning objective (Understand / describe): the learner describes what HTML5, CSS,
// JavaScript, a JavaScript library, a CDN, and an iframe each contribute to a running MicroSim.
// Layout: a vertical stack of six layers (a browser frame around the five that run in the
// browser, the CDN below it) and a detail panel to the right. Under 600px wide the panel moves
// below the stack. The panel shows the layer's role, a three-line code sample, what breaks if
// the layer is missing, and a small preview of the MicroSim as the learner would see it.

// ---------- Canvas dimensions ----------
let canvasWidth = 700;
let drawHeight = 510;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;   // 560
let margin = 12;
let defaultTextSize = 16;

// ---------- Layer data (top of the stack first) ----------
const layers = [
  {
    id: 'iframe', name: 'iframe', sub: 'the window into the hosting page',
    color: 'teal', text: 'white', deps: ['html'],
    role: 'The iframe is the window that shows the MicroSim\'s main.html inside a ' +
      'chapter or any other page, at the full width of its container and a fixed height.',
    code: ['<iframe src="../../sims/ball/main.html"', '  width="100%" height="452"',
      '  scrolling="no"></iframe>'],
    missing: 'The chapter shows no simulation. main.html still runs on its own, but readers ' +
      'of the chapter never see it.'
  },
  {
    id: 'html', name: 'HTML5', sub: 'structure',
    color: 'darkorange', text: 'black', deps: [],
    role: 'HTML5 gives the page its structure: main.html loads the library and the sketch ' +
      'with script tags and provides the empty main element the canvas fills.',
    code: ['<main></main>', '<script src="p5.js"></script>', '<script src="ball.js"></script>'],
    missing: 'There is no page to load, so the iframe shows an error or an empty box and ' +
      'nothing else can run.'
  },
  {
    id: 'css', name: 'CSS', sub: 'appearance',
    color: 'royalblue', text: 'white', deps: ['html'],
    role: 'CSS sets how the page\'s elements look (margins, fonts, background colors and ' +
      'borders) without changing what the MicroSim does.',
    code: ['main {', '  background: aliceblue;', '  border: 1px solid silver; }'],
    missing: 'The MicroSim still works but looks unstyled: default margins, a serif font, ' +
      'and no background or border.'
  },
  {
    id: 'js', name: 'JavaScript', sub: 'the model and behavior',
    color: 'gold', text: 'black', deps: ['html', 'lib'],
    role: 'JavaScript holds the model and the behavior: every frame it updates the ball\'s ' +
      'speed and position, reads the sliders and redraws the picture.',
    code: ['speed = speed + gravity;', 'y = y + speed;', 'circle(200, y, 40);'],
    missing: 'The page loads but stays empty: no canvas, no ball and no controls, because ' +
      'nothing draws them.'
  },
  {
    id: 'lib', name: 'JavaScript library', sub: 'ready-made drawing and controls (p5.js)',
    color: 'mediumvioletred', text: 'white', deps: ['html', 'cdn'],
    role: 'The library (p5.js here) supplies ready-made functions such as createCanvas, ' +
      'createSlider and circle, so the sketch does not rebuild them from scratch.',
    code: ['createCanvas(400, 450);', 'let g = createSlider(0, 2, 0.8);', 'circle(x, y, 40);'],
    missing: 'The sketch stops at its first line with "createCanvas is not defined", so ' +
      'the page is blank.'
  },
  {
    id: 'cdn', name: 'CDN', sub: 'delivers the library',
    color: 'slategray', text: 'white', deps: [],
    role: 'The content delivery network hosts a pinned copy of the library and delivers it ' +
      'to each learner\'s browser from a server nearby.',
    code: ['https://cdn.jsdelivr.net/', '  npm/p5@2.3.2/', '  lib/p5.js'],
    missing: 'The browser cannot download the library (for example, in an offline ' +
      'classroom), so the sketch fails as if the library were missing.'
  }
];

// ---------- State ----------
let selectedId = 'js';      // start with the layer that holds the model
let hoverId = null;
let brokenId = null;        // layer removed by "Break it"
let hitRects = [];          // {id, x, y, w, h} rebuilt every frame
let breakButton;

function layerById(id) { return layers.find(l => l.id === id); }

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  breakButton = createButton('Break it');
  breakButton.parent(document.querySelector('main'));
  breakButton.position(10, drawHeight + 12);
  breakButton.size(90, 28);
  breakButton.mousePressed(toggleBreak);

  describe('A technology stack diagram for a running MicroSim. Six colored layers are ' +
    'stacked from bottom to top: CDN, JavaScript library, JavaScript, CSS, HTML5 and iframe. ' +
    'A browser frame surrounds the top five layers and an arrow shows the CDN delivering ' +
    'the library. Clicking a layer shows its role, a three-line code sample and what breaks ' +
    'without it. Hovering a layer outlines the layers it depends on. The Break it button ' +
    'removes the selected layer and a small preview shows what the learner would then see.',
    LABEL);
}

function draw() {
  updateCanvasSize();
  hitRects = [];

  // Drawing and control regions (standard MicroSim layout)
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const narrow = canvasWidth < 600;

  // Title
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(narrow ? 19 : 22);
  textStyle(BOLD);
  text('MicroSim Technology Stack', margin, 9);
  textStyle(NORMAL);

  let stackBottom;
  if (narrow) {
    stackBottom = drawStack(margin, 40, canvasWidth - 2 * margin, 26, 4, true);
    drawPanel(margin, stackBottom + 10, canvasWidth - 2 * margin, drawHeight - 6, true);
  } else {
    const stackW = floor(canvasWidth * 0.42);
    drawStack(margin, 44, stackW - margin, 52, 7, false);
    drawPanel(stackW + 16, 44, canvasWidth - stackW - 16 - margin, drawHeight - 8, false);
  }

  drawControlText();
  cursor(hoverId ? HAND : ARROW);
}

// ---------- The stack ----------
// Returns the y of the bottom of the CDN layer
function drawStack(x, y, w, layerH, gap, compact) {
  const barH = compact ? 18 : 26;
  const pad = compact ? 5 : 8;
  const browserLayers = layers.slice(0, 5);
  const frameH = barH + pad * 2 + browserLayers.length * layerH + (browserLayers.length - 1) * gap;

  // Browser frame with a title bar, three dots and an address bar
  stroke('gray');
  strokeWeight(1.5);
  fill('whitesmoke');
  rect(x, y, w, frameH, 8);
  noStroke();
  fill('gainsboro');
  rect(x + 1, y + 1, w - 2, barH - 1, 8, 8, 0, 0);
  const dotY = y + barH / 2;
  ['indianred', 'goldenrod', 'mediumseagreen'].forEach((c, i) => {
    fill(c);
    circle(x + 12 + i * 13, dotY, compact ? 7 : 9);
  });
  fill('white');
  const addrX = x + 52;
  rect(addrX, y + 4, w - 62, barH - 8, 4);
  fill('dimgray');
  textAlign(LEFT, CENTER);
  textSize(compact ? 11 : 12);
  text(fitText('browser showing a chapter page', w - 74), addrX + 6, dotY);

  // The five in-browser layers
  let ly = y + barH + pad;
  for (const layer of browserLayers) {
    drawLayer(layer, x + pad, ly, w - 2 * pad, layerH, compact);
    ly += layerH + gap;
  }
  const libBottom = ly - gap;

  // CDN below the browser, with a "delivers" arrow up into the library layer
  const cdnY = y + frameH + (compact ? 22 : 34);
  drawLayer(layers[5], x + pad, cdnY, w - 2 * pad, layerH, compact);
  const ax = x + w * 0.3;
  stroke('dimgray');
  strokeWeight(2);
  line(ax, cdnY - 2, ax, libBottom + 8);
  noStroke();
  fill('dimgray');
  triangle(ax - 6, libBottom + 10, ax + 6, libBottom + 10, ax, libBottom + 2);
  textAlign(LEFT, CENTER);
  textSize(13);
  text('delivers p5.js over the internet', ax + 10, (cdnY + y + frameH) / 2);
  return cdnY + layerH;
}

function drawLayer(layer, x, y, w, h, compact) {
  hitRects.push({ id: layer.id, x: x, y: y, w: w, h: h });
  const isBroken = brokenId === layer.id;
  const isSelected = selectedId === layer.id;
  const isHover = hoverId === layer.id;
  const hoverLayer = hoverId ? layerById(hoverId) : null;
  const isDep = hoverLayer && hoverLayer.deps.includes(layer.id);

  if (isBroken) {
    // A removed layer: dashed empty outline
    noFill();
    stroke('firebrick');
    strokeWeight(2);
    drawingContext.setLineDash([6, 5]);
    rect(x, y, w, h, 8);
    drawingContext.setLineDash([]);
    noStroke();
    fill('firebrick');
    textAlign(CENTER, CENTER);
    textSize(compact ? 13 : 15);
    textStyle(BOLD);
    text(layer.name + ' removed', x + w / 2, y + h / 2);
    textStyle(NORMAL);
    return;
  }

  // Dependency highlight: a gold halo behind the layer
  if (isDep) {
    noStroke();
    fill('gold');
    rect(x - 4, y - 4, w + 8, h + 8, 10);
  }
  stroke(isSelected || isHover ? 'black' : 'dimgray');
  strokeWeight(isSelected ? 3.5 : (isHover ? 2.5 : 1));
  fill(layer.color);
  rect(x, y, w, h, 8);

  noStroke();
  fill(layer.text);
  textStyle(BOLD);
  if (compact) {
    textAlign(LEFT, CENTER);
    textSize(14);
    text(layer.name, x + 10, y + h / 2);
  } else {
    textAlign(LEFT, TOP);
    textSize(16);
    text(layer.name, x + 12, y + 8);
    textStyle(NORMAL);
    textSize(13);
    text(layer.sub, x + 12, y + 29);
  }
  textStyle(NORMAL);
  if (isDep) {
    // small tag saying the hovered layer needs this one
    const tag = 'needed';
    textSize(12);
    const tw = fontWidth(tag) + 10;
    fill('black');
    rect(x + w - tw - 6, y + h / 2 - 9, tw, 18, 9);
    fill('gold');
    textAlign(CENTER, CENTER);
    text(tag, x + w - tw / 2 - 6, y + h / 2);
  }
}

// ---------- The detail panel ----------
function drawPanel(x, y, w, bottom, compact) {
  const layer = layerById(selectedId);
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, bottom - y, 10);
  const innerX = x + 12;
  const innerW = w - 24;
  let cy = y + 10;

  // Heading with a color swatch
  noStroke();
  fill(layer.color);
  rect(innerX, cy + 2, 16, 16, 3);
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(compact ? 16 : 18);
  text(layer.name, innerX + 24, cy);
  textStyle(NORMAL);
  cy += compact ? 24 : 28;

  // Role
  textSize(compact ? 14 : 15);
  cy = drawWrapped(layer.role, innerX, cy, innerW, compact ? 17 : 19) + 4;

  // Depends on (wide layout only; the hover halo shows it in both layouts)
  if (!compact) {
    const deps = layer.deps.length ? layer.deps.map(d => layerById(d).name).join(', ') :
      'nothing below it in this stack';
    textSize(14);
    fill('dimgray');
    cy = drawWrapped('Depends on: ' + deps, innerX, cy, innerW, 18) + 6;
  }

  // In the compact layout, the preview replaces the code sample while a layer is broken
  const showCode = !compact || !brokenId;
  if (showCode) {
    const lineH = 17;
    const boxH = lineH * 3 + 12;
    fill('darkslategray');
    rect(innerX, cy, innerW, boxH, 6);
    fill('white');
    textFont('monospace');
    textSize(compact ? 12 : 13);
    textAlign(LEFT, TOP);
    layer.code.forEach((ln, i) => text(ln, innerX + 8, cy + 7 + i * lineH));
    textFont('sans-serif');
    cy += boxH + 8;
  }

  // What breaks
  fill('firebrick');
  textStyle(BOLD);
  textSize(compact ? 14 : 15);
  text('If it is missing:', innerX, cy);
  const labelW = fontWidth('If it is missing:') + 6;   // measured in bold
  textStyle(NORMAL);
  fill('black');
  cy = drawWrapped(layer.missing, innerX, cy, innerW, compact ? 17 : 19, labelW) + 6;

  // Preview of the MicroSim as the learner sees it
  if (!compact || brokenId) {
    const room = bottom - cy - 8;
    if (room >= 70) {
      fill('dimgray');
      textSize(13);
      textStyle(BOLD);
      text(brokenId ? 'What the learner sees without ' + layerById(brokenId).name + ':' :
        'What the learner sees:', innerX, cy);
      textStyle(NORMAL);
      const ph = Math.min(170, room - 20);
      drawPreview(innerX, cy + 18, Math.min(innerW, 330), ph);
    }
  }
}

// ---------- Mini preview of a chapter page with an embedded MicroSim ----------
function drawPreview(x, y, w, h) {
  // The hosting chapter page
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 4);
  noStroke();
  fill('lightgray');
  rect(x + 8, y + 7, w * 0.62, 5, 2);
  rect(x + 8, y + 16, w * 0.48, 5, 2);
  const sx = x + 8, sy = y + 27, sw = w - 16, sh = h - 34;   // iframe slot

  if (brokenId === 'iframe') {
    // No iframe tag: the chapter text simply continues
    fill('lightgray');
    for (let i = 0; i < 5 && 6 + i * 11 < sh - 14; i++) rect(sx, sy + 4 + i * 11, sw * (0.9 - 0.08 * (i % 3)), 5, 2);
    fill('firebrick');
    textAlign(CENTER, BOTTOM);
    textSize(12);
    text('no MicroSim on the page', sx + sw / 2, sy + sh);
    return;
  }
  // iframe border
  stroke('silver');
  noFill();
  rect(sx, sy, sw, sh);
  noStroke();

  if (brokenId === 'html') {
    fill('whitesmoke');
    rect(sx + 1, sy + 1, sw - 2, sh - 2);
    fill('dimgray');
    textAlign(CENTER, CENTER);
    textFont('serif');
    textSize(15);
    text('404 Not Found', sx + sw / 2, sy + sh / 2 - 8);
    textSize(11);
    text('main.html', sx + sw / 2, sy + sh / 2 + 10);
    textFont('sans-serif');
    return;
  }
  if (brokenId === 'js') {
    drawBackLink(sx + 6, sy + 8);
    return;
  }
  if (brokenId === 'lib' || brokenId === 'cdn') {
    drawBackLink(sx + 6, sy + 8);
    const lines = brokenId === 'cdn' ?
      ['GET .../p5@2.3.2/lib/p5.js failed', 'ReferenceError: createCanvas is not defined'] :
      ['ReferenceError: createCanvas is not defined'];
    const bh = lines.length * 14 + 8;
    fill('mistyrose');
    rect(sx + 1, sy + sh - bh - 1, sw - 2, bh);
    fill('firebrick');
    textAlign(LEFT, TOP);
    textSize(10.5);
    lines.forEach((ln, i) => text(ln, sx + 6, sy + sh - bh + 3 + i * 14));
    return;
  }
  // A working (or unstyled) MicroSim
  const unstyled = brokenId === 'css';
  const off = unstyled ? 6 : 0;                 // default page margin shows up without CSS
  const dh = (sh - 2) * 0.68;
  fill(unstyled ? 'white' : 'aliceblue');
  if (!unstyled) { stroke('silver'); }
  rect(sx + 1 + off, sy + 1 + off, sw - 2 - off, dh - off);
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  if (unstyled) textFont('serif');
  textSize(11);
  text('Bouncing Ball', sx + sw / 2 + off, sy + 4 + off);
  textFont('sans-serif');
  // floor and ball
  stroke(unstyled ? 'lightgray' : 'silver');
  line(sx + 6 + off, sy + dh - 6, sx + sw - 6, sy + dh - 6);
  noStroke();
  fill('orangered');
  circle(sx + sw * 0.4 + off, sy + dh - 16, 18);
  // control region: a button and a slider
  const cy = sy + dh + 4;
  fill(unstyled ? 'white' : 'white');
  stroke('gray');
  rect(sx + 8 + off, cy + 3, 34, 14, unstyled ? 0 : 3);
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  if (unstyled) textFont('serif');
  textSize(9);
  text('Start', sx + 25 + off, cy + 10);
  textFont('sans-serif');
  stroke('gray');
  strokeWeight(2);
  line(sx + 52 + off, cy + 10, sx + sw - 10, cy + 10);
  strokeWeight(1);
  noStroke();
  fill('royalblue');
  circle(sx + 52 + off + (sw - 62 - off) * 0.4, cy + 10, 10);
  if (unstyled) drawBackLink(sx + 8, cy + 22);
}

function drawBackLink(x, y) {
  fill('blue');
  noStroke();
  textAlign(LEFT, TOP);
  textFont('serif');
  textSize(11);
  text('Back to Lesson Plan', x, y);
  stroke('blue');
  line(x, y + 12, x + fontWidth('Back to Lesson Plan'), y + 12);
  noStroke();
  textFont('sans-serif');
}

// ---------- Text helpers ----------
// Draw wrapped text; the first line may start after an inline label of width firstIndent.
function drawWrapped(str, x, y, maxW, lineH, firstIndent) {
  const indent = firstIndent || 0;
  const words = str.split(' ');
  let line = '';
  let first = true;
  textAlign(LEFT, TOP);
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    const avail = first ? maxW - indent : maxW;
    if (fontWidth(test) > avail && line) {
      text(line, x + (first ? indent : 0), y);
      y += lineH;
      line = word;
      first = false;
    } else {
      line = test;
    }
  }
  if (line) {
    text(line, x + (first ? indent : 0), y);
    y += lineH;
  }
  return y;
}

function drawControlText() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(15);
  const layer = layerById(selectedId);
  const msg = brokenId ? layerById(brokenId).name + ' removed: press Restore to put it back.' :
    'Selected: ' + layer.name + '. Press Break it to remove it.';
  drawFitted(msg, 112, drawHeight + 26, canvasWidth - 122);
}

// Shorten a string with an ellipsis until it fits maxW at the current text size
function fitText(str, maxW) {
  if (fontWidth(str) <= maxW) return str;
  let t = str;
  while (t.length > 3 && fontWidth(t + '…') > maxW) t = t.slice(0, -1);
  return t.trimEnd() + '…';
}

// Draw one line of text, shrinking the font size if needed so it fits the width
function drawFitted(str, x, y, maxW) {
  let size = 15;
  textSize(size);
  while (fontWidth(str) > maxW && size > 11) { size--; textSize(size); }
  text(str, x, y);
}

// ---------- Interaction ----------
function layerAt(mx, my) {
  for (const r of hitRects) {
    if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) return r.id;
  }
  return null;
}

function mouseMoved() {
  hoverId = (mouseY < drawHeight) ? layerAt(mouseX, mouseY) : null;
}

function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight) return;
  const id = layerAt(mouseX, mouseY);
  if (!id) return;
  if (brokenId && id !== brokenId) {
    // one experiment at a time: selecting another layer restores the broken one
    brokenId = null;
    breakButton.html('Break it');
  }
  selectedId = id;
}

function toggleBreak() {
  if (brokenId) {
    brokenId = null;
    breakButton.html('Break it');
  } else {
    brokenId = selectedId;
    breakButton.html('Restore');
  }
}

// ---------- Responsive design ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.max(320, Math.floor(container.getBoundingClientRect().width));
  }
}
