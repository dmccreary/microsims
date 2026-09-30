// Prompt Quality Workbench
// CANVAS_HEIGHT: 655
// Learners critique a generation prompt built from a request plus six clauses.
// Turning a clause off hands one more decision to the model; the panel on the
// right lists every open decision and the Chapter 5 failure modes it makes
// more likely. Clauses, decisions and failure modes live in data.json.
// Width-responsive: the panel moves below the cards under 600 px and the
// checkboxes wrap to more rows on narrow screens.

// ---------- layout globals ----------
let canvasWidth = 400;               // replaced by the container width
let drawHeight = 540;                // drawing region height
let controlHeight = 115;             // three rows of controls
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let sliderLeftMargin = 90;           // left edge of the Scenario dropdown
let defaultTextSize = 16;
let narrowBreakpoint = 600;          // below this the panel moves under the cards

// ---------- model state ----------
let data = null;                     // loaded from data.json
let loadError = null;
let clauseOn = {};                   // clause id -> true / false
let scenarioIndex = 1;               // start with the pendulum request

// ---------- controls ----------
let scenarioSelect;
let resetButton;
let clauseBoxes = {};                // clause id -> p5 checkbox
let checkboxRows = 1;                // how many rows the checkboxes use

// ---------- hover state ----------
let cardRects = [];                  // hit boxes for the cards
let hoverId = null;

const riskColor = { high: 'firebrick', medium: 'darkorange', low: 'seagreen' };
const riskRank = { high: 3, medium: 2, low: 1 };

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  frameRate(30);

  // Row 1: scenario dropdown and reset button
  scenarioSelect = createSelect();
  scenarioSelect.parent(document.querySelector('main'));
  scenarioSelect.changed(onScenarioChanged);

  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(resetClauses);

  positionControls();

  describe('A prompt built from a one-line request plus six clauses shown as cards: names the skill, ' +
    'points to the specification, pins the library version, limits the output files, states the layout, ' +
    'and gives a tie-breaking rule. Checkboxes turn clauses on and off. A panel titled Decisions left to ' +
    'the model lists each decision the prompt no longer makes and the failure modes it makes more likely.', LABEL);

  loadData();
}

// Load clauses, decisions and failure modes from the JSON file in this folder
function loadData() {
  fetch('data.json')
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(json => {
      data = json;
      for (let i = 0; i < data.scenarios.length; i++) {
        scenarioSelect.option(data.scenarios[i].label, i);
      }
      scenarioSelect.selected(String(scenarioIndex));
      // Row 2: one checkbox per clause
      for (const c of data.clauses) {
        const box = createCheckbox(c.name, false);
        box.parent(document.querySelector('main'));
        box.style('white-space', 'nowrap');
        box.changed(() => { clauseOn[c.id] = box.checked(); });
        clauseBoxes[c.id] = box;
      }
      resetClauses();
      positionControls();
      redraw();                      // draw the loaded data at once
    })
    .catch(err => {
      loadError = 'Could not load data.json (' + err.message + '). Open this page through a web server, ' +
        'for example mkdocs serve, rather than as a local file.';
    });
}

function draw() {
  updateCanvasSize();

  // Drawing region and control region backgrounds
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(22);
  text('Prompt Quality Workbench', margin, 10);
  textStyle(NORMAL);

  if (!data) {
    textSize(defaultTextSize);
    fill(loadError ? 'firebrick' : 'dimgray');
    text(loadError || 'Loading clauses...', margin, 50, canvasWidth - 2 * margin, 120);
    drawControlLabels();
    return;
  }

  const scenario = data.scenarios[scenarioIndex];
  const narrow = canvasWidth < narrowBreakpoint;

  // Layout: cards on the left and panel on the right, or stacked when narrow
  let cardsX = margin, cardsY = 64, cardsW, panelX, panelY, panelW, panelH;
  if (!narrow) {
    cardsW = floor((canvasWidth - 3 * margin) * 0.56);
    panelX = cardsX + cardsW + margin;
    panelY = 10;
    panelW = canvasWidth - panelX - margin;
    panelH = drawHeight - 20;
  } else {
    cardsW = canvasWidth - 2 * margin;
  }

  // Summary line under the title
  const onCount = data.clauses.filter(c => clauseOn[c.id]).length;
  noStroke();
  fill('dimgray');
  textSize(15);
  textAlign(LEFT, TOP);
  text('Assembled prompt: ' + onCount + ' of 6 clauses, ' + promptWordCount(scenario) + ' words',
    margin, 38);

  const cardsBottom = drawCards(scenario, cardsX, cardsY, cardsW, narrow);

  if (narrow) {
    panelX = margin;
    panelY = cardsBottom + 8;
    panelW = canvasWidth - 2 * margin;
    panelH = drawHeight - panelY - 8;
  }
  drawPanel(scenario, panelX, panelY, panelW, panelH, narrow);

  drawControlLabels();
  drawTooltip(scenario);
}

// Fill the placeholders in a clause for the current scenario
function clauseText(c, scenario) {
  return c.text.replace('{simId}', scenario.simId)
    .replace('{chapter}', scenario.chapter)
    .replace('{layout}', scenario.layout);
}

function promptWordCount(scenario) {
  let s = scenario.request;
  for (const c of data.clauses) {
    if (clauseOn[c.id]) s += ' ' + clauseText(c, scenario);
  }
  return s.trim().split(/\s+/).length;
}

// Draw the request card and the six clause cards; returns the bottom y
function drawCards(scenario, x, y, w, narrow) {
  cardRects = [];
  const nameW = narrow ? 124 : 132;
  const gap = narrow ? 2 : 6;
  const items = [{ id: 'request', name: 'Request', text: scenario.request, on: true }];
  for (const c of data.clauses) {
    items.push({ id: c.id, name: c.name, text: clauseText(c, scenario), on: clauseOn[c.id] });
  }

  let cy = y;
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    textSize(15);
    const textW = w - nameW - 14;
    let lines;
    if (!it.on) {
      lines = ['(omitted: the model decides)'];
    } else if (narrow) {
      lines = [truncateToWidth(it.text, textW)];
    } else {
      lines = wrapLines(it.text, textW);
    }
    const h = narrow ? 24 : max(34, lines.length * 19 + 14);

    // Card body
    const hovered = (hoverId === it.id);
    strokeWeight(hovered ? 2 : 1);
    if (it.id === 'request') {
      fill('lavender');
      stroke(hovered ? 'steelblue' : 'silver');
    } else if (it.on) {
      fill('white');
      stroke(hovered ? 'steelblue' : 'lightsteelblue');
    } else {
      fill('whitesmoke');
      stroke(hovered ? 'steelblue' : 'darkgray');
      drawingContext.setLineDash([5, 4]);
    }
    rect(x, cy, w, h, 6);
    drawingContext.setLineDash([]);

    // Accent strip on the left of an active card
    noStroke();
    if (it.on && it.id !== 'request') {
      fill('steelblue');
      rect(x + 1, cy + 1, 5, h - 2, 6, 0, 0, 6);
    }

    // Name column
    fill(it.on ? 'black' : 'gray');
    textStyle(BOLD);
    textSize(15);
    textAlign(LEFT, TOP);
    const label = (it.id === 'request') ? 'Request' : i + '. ' + it.name;
    text(label, x + 12, cy + (narrow ? 5 : 8));
    textStyle(NORMAL);

    // Clause text
    fill(it.on ? 'black' : 'gray');
    if (!it.on) textStyle(ITALIC);
    for (let k = 0; k < lines.length; k++) {
      text(lines[k], x + nameW, cy + (narrow ? 5 : 8) + k * 19);
    }
    textStyle(NORMAL);

    cardRects.push({ id: it.id, x: x, y: cy, w: w, h: h });
    cy += h + gap;
  }
  return cy - gap;
}

// Draw the "Decisions left to the model" panel
function drawPanel(scenario, x, y, w, h, narrow) {
  fill(255, 255, 255, 235);
  stroke(200);
  strokeWeight(1);
  rect(x, y, w, h, 10);

  const pad = 10;
  let ty = y + (narrow ? 7 : pad);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(narrow ? 16 : 17);
  text('Decisions left to the model', x + pad, ty);
  textStyle(NORMAL);
  ty += narrow ? 21 : 24;

  const open = data.clauses.filter(c => !clauseOn[c.id]);
  // Sort the open decisions by risk for this request, highest first
  open.sort((a, b) => riskRank[scenario.risk[b.id]] - riskRank[scenario.risk[a.id]]);

  textSize(narrow ? 14 : 15);
  fill('dimgray');
  const nHigh = open.filter(c => scenario.risk[c.id] === 'high').length;
  const summary = open.length + ' of 6 open for this request' +
    (open.length ? ' (' + nHigh + ' high risk)' : '');
  text(summary, x + pad, ty);
  ty += narrow ? 20 : 24;

  const lineH = narrow ? 16 : 18;
  const tagW = 46;
  const textW = w - 2 * pad - tagW - 6;
  const footY = y + h - (narrow ? 20 : 40);

  if (open.length === 0) {
    fill('seagreen');
    textSize(15);
    const msg = wrapLines('None. Every decision on this list is settled by the prompt. ' +
      'Try turning one clause off and predict what appears here.', w - 2 * pad);
    for (const ln of msg) { text(ln, x + pad, ty); ty += lineH; }
  }

  for (const c of open) {
    const risk = scenario.risk[c.id];
    // Risk tag
    fill(riskColor[risk]);
    rect(x + pad, ty + 1, tagW, 16, 4);
    fill('white');
    textSize(12);
    textStyle(BOLD);
    textAlign(CENTER, TOP);
    text(risk === 'medium' ? 'MED' : risk.toUpperCase(), x + pad + tagW / 2, ty + 3);
    textAlign(LEFT, TOP);
    textStyle(NORMAL);

    // Decision text, then the linked failure modes
    textSize(narrow ? 14 : 15);
    fill('black');
    let lines;
    if (narrow) {
      lines = wrapLines(c.decision + ' → ' + c.failures.join('; '), textW);
    } else {
      lines = wrapLines(c.decision, textW);
    }
    for (const ln of lines) { text(ln, x + pad + tagW + 6, ty); ty += lineH; }
    if (!narrow) {
      fill('firebrick');
      const fl = wrapLines('→ more likely: ' + c.failures.join('; '), textW);
      for (const ln of fl) { text(ln, x + pad + tagW + 6, ty); ty += lineH; }
    }
    ty += narrow ? 2 : 7;
  }

  // Suggest the first decision to close, when there is room
  if (open.length > 0 && !narrow && ty + 42 < footY) {
    fill('black');
    textSize(15);
    textStyle(BOLD);
    const tip = wrapLines('Close first: ' + open[0].decision.toLowerCase() +
      ' (' + scenario.risk[open[0].id] + ' risk here).', w - 2 * pad);
    for (const ln of tip) { text(ln, x + pad, ty); ty += lineH; }
    textStyle(NORMAL);
  }

  // Footnote: the links are a heuristic
  fill('dimgray');
  textStyle(ITALIC);
  textSize(13);
  const note = narrow
    ? '* Teaching heuristic: more likely, not certain.'
    : '* Teaching heuristic: an open decision makes these failure modes more likely, not certain.';
  const nl = wrapLines(note, w - 2 * pad);
  let fy = footY;
  for (const ln of nl) { text(ln, x + pad, fy); fy += 16; }
  textStyle(NORMAL);
}

// Labels and hints in the control region
function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Scenario:', 10, drawHeight + 20);
  if (data && checkboxRows === 1) {
    fill('dimgray');
    textSize(15);
    text('Toggle a clause (or click its card). Which open decision would you close first?',
      10, drawHeight + 93);
  }
}

// Hover tooltip: an example of the clause under the pointer
function drawTooltip(scenario) {
  if (!hoverId) return;
  let msg;
  if (hoverId === 'request') {
    msg = 'The request itself: "' + scenario.request + '" Sent alone, it is the vague prompt, and the ' +
      'model makes every decision on the list. ' + scenario.why;
  } else {
    const c = data.clauses.find(k => k.id === hoverId);
    msg = c.title + '. Example: ' + c.example;
  }
  textSize(14);
  const boxW = min(340, canvasWidth - 20);
  const lines = wrapLines(msg, boxW - 16);
  const boxH = lines.length * 18 + 12;
  let bx = mouseX + 14;
  let by = mouseY + 14;
  if (bx + boxW > canvasWidth - 6) bx = canvasWidth - boxW - 6;
  if (by + boxH > drawHeight - 6) by = mouseY - boxH - 10;
  if (by < 4) by = 4;
  fill(255, 255, 240, 245);
  stroke('goldenrod');
  strokeWeight(1);
  rect(bx, by, boxW, boxH, 6);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  for (let k = 0; k < lines.length; k++) text(lines[k], bx + 8, by + 6 + k * 18);
}

// ---------- helpers ----------
function wrapLines(str, maxW) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (fontWidth(test) <= maxW || !line) {
      line = test;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function truncateToWidth(str, maxW) {
  if (fontWidth(str) <= maxW) return str;
  let s = str;
  while (s.length > 1 && fontWidth(s + '...') > maxW) s = s.slice(0, -1);
  return s + '...';
}

// ---------- events ----------
function mouseMoved() {
  hoverId = null;
  if (mouseY < 0 || mouseY > drawHeight) return;
  for (const r of cardRects) {
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) {
      hoverId = r.id;
    }
  }
}

function mousePressed() {
  mouseMoved();
  // Clicking a clause card toggles it, the same as its checkbox
  if (data && hoverId && hoverId !== 'request') {
    clauseOn[hoverId] = !clauseOn[hoverId];
    clauseBoxes[hoverId].checked(clauseOn[hoverId]);
  }
}

function onScenarioChanged() {
  scenarioIndex = int(scenarioSelect.value());
}

function resetClauses() {
  if (!data) return;
  for (const c of data.clauses) {
    clauseOn[c.id] = data.defaultOn.includes(c.id);
    if (clauseBoxes[c.id]) clauseBoxes[c.id].checked(clauseOn[c.id]);
  }
}

// Place the controls; the checkboxes wrap onto a new row when they run out of room
function positionControls() {
  const selW = max(150, min(290, canvasWidth - sliderLeftMargin - 90));
  scenarioSelect.position(sliderLeftMargin, drawHeight + 8);
  scenarioSelect.size(selW);
  resetButton.position(sliderLeftMargin + selW + 10, drawHeight + 8);

  let x = 10;
  let y = drawHeight + 44;
  checkboxRows = 1;
  if (!data) return;
  for (const c of data.clauses) {
    const box = clauseBoxes[c.id];
    box.position(x, y);
    const w = box.elt.offsetWidth;
    if (x > 10 && x + w > canvasWidth - 10) {
      x = 10;
      y += 32;
      checkboxRows++;
      box.position(x, y);
    }
    x += w + 16;
  }
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
