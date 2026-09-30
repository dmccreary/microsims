// Generator Skill Anatomy Explorer
// CANVAS_HEIGHT: 560
// Traces which parts of the microsim-generator skill an agent reads for a
// given request: the SKILL.md routing table, one reference guide, one template
// folder, and the utility scripts it runs. Parts that are not read stay grey.
// Bloom level: Analyze (differentiate). Pattern: explorer with trace + click-for-why.
// Template folder file counts are read from data.json in this folder.

// ---------- canvas dimensions (standard MicroSim layout) ----------
let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 14;
let defaultTextSize = 16;

// ---------- skill data ----------
// The 17 reference guides and their trigger words, from the routing table in SKILL.md.
const guides = [
  { file: 'p5-guide.md', lines: 1238, triggers: 'custom, simulation, physics, interactive, bouncing, movement, p5.js' },
  { file: 'chartjs-guide.md', lines: 651, triggers: 'chart, bar, line, pie, doughnut, radar, statistics, data' },
  { file: 'timeline-guide.md', lines: 709, triggers: 'timeline, dates, chronological, events, history, schedule, milestones' },
  { file: 'map-guide.md', lines: 417, triggers: 'map, geographic, coordinates, latitude, longitude, locations, markers' },
  { file: 'vis-network-guide.md', lines: 985, triggers: 'network, nodes, edges, graph, dependencies, concept map, knowledge graph' },
  { file: 'concept-classifier-guide.md', lines: 275, triggers: 'classify, classifier, categorize, sort scenarios, identify types, recognize patterns' },
  { file: 'mermaid-guide.md', lines: 1024, triggers: 'flowchart, workflow, process, state machine, UML, sequence diagram' },
  { file: 'plotly-guide.md', lines: 519, triggers: 'function, f(x), equation, plot, calculus, sine, cosine, polynomial' },
  { file: 'venn-guide.md', lines: 747, triggers: 'venn, sets, overlap, intersection, union, categories' },
  { file: 'bubble-guide.md', lines: 361, triggers: 'bubble, priority, matrix, quadrant, impact vs effort, risk vs value' },
  { file: 'causal-loop-guide.md', lines: 117, triggers: 'causal, feedback, loop, systems thinking, reinforcing, balancing, CLD' },
  { file: 'comparison-table-guide.md', lines: 223, triggers: 'comparison, table, ratings, stars, side-by-side, features' },
  { file: 'html-table.md', lines: 344, triggers: 'matrix, framework comparison, clickable cells, detail panel, expandable' },
  { file: 'celebration-guide.md', lines: 130, triggers: 'animation, celebration, particles, confetti, effects' },
  { file: 'infographic-overlay-guide.md', lines: 459, triggers: 'diagram overlay, callout labels, anatomy, labeled illustration' },
  { file: 'docker-python-lab-guide.md', lines: 234, triggers: 'python lab, code runner, runnable code block, docker' },
  { file: 'verified-infographic-guide.md', lines: 345, triggers: 'verified infographic, statistics poster, fact-checked poster, cited data' }
];

// The six Python utilities (src/microsim-utils). singleSim = used on a one-MicroSim request.
const utilities = [
  { file: 'extract-sim-specs.py', singleSim: false, job: 'parses every spec block in a chapter (chapter batches only)' },
  { file: 'generate-sim-scaffold.py', singleSim: true, job: 'creates main.html, index.md and metadata.json' },
  { file: 'add-iframes-to-chapter.py', singleSim: false, job: 'inserts iframes into a chapter (chapter batches only)' },
  { file: 'validate-sims.py', singleSim: true, job: 'scores the MicroSim on the 100-point rubric' },
  { file: 'sync-iframe-heights.py', singleSim: true, job: 'sets iframe heights from the CANVAS_HEIGHT comment' },
  { file: 'update-mkdocs-nav.py', singleSim: true, job: 'adds the MicroSim to the site navigation' }
];

const SKILL_LINES = 1055;

// Six sample requests. guide and template are indexes into guides / template folder names.
const requests = [
  {
    label: 'A bouncing ball simulation',
    match: 'bouncing, simulation',
    guide: 0, template: 'p5',
    guideWhy: 'p5-guide.md gives the layout rules a physics sketch needs: drawHeight, controlHeight, updateCanvasSize() and sliders placed below the drawing region.',
    templateWhy: 'templates/p5/ supplies bouncing-ball.js, which the guide says to copy structurally, so the new sketch keeps the standard variable names and resize pattern.'
  },
  {
    label: 'A bar chart of survey results',
    match: 'chart, bar, data',
    guide: 1, template: 'chartjs',
    guideWhy: 'chartjs-guide.md explains the bar chart configuration, tooltips and pinned Chart.js CDN link that a survey-results chart is built from.',
    templateWhy: 'templates/chartjs/ gives a working main.html, script.js and data-template.json, so the survey numbers go into a known data structure.'
  },
  {
    label: 'A timeline of Unix history',
    match: 'timeline, history',
    guide: 2, template: 'timeline',
    guideWhy: 'timeline-guide.md explains vis-timeline items, groups and dates, which is what a chronology of Unix releases is made of.',
    templateWhy: 'templates/timeline/ provides a data.json of dated events and a script.js that loads it, ready for the Unix milestones.'
  },
  {
    label: 'A map of trade routes',
    match: 'map, locations',
    guide: 3, template: 'map',
    guideWhy: 'map-guide.md covers Leaflet markers, routes, tile sources and turning off scroll-wheel zoom inside an iframe, all of which a trade-route map needs.',
    templateWhy: 'templates/map/ gives a working Leaflet page and a data-template.json for coordinates, so each port and route has a place to go.'
  },
  {
    label: 'A concept dependency network',
    match: 'network, dependencies, concept map',
    guide: 4, template: 'vis-network',
    guideWhy: 'vis-network-guide.md explains nodes, directed edges, fixed positions and iframe-safe zoom settings for a graph of concept dependencies.',
    templateWhy: 'templates/vis-network/ supplies concept-graph-example.html and a data-template.json of nodes and edges to copy.'
  },
  {
    label: 'A sorting quiz',
    match: 'sorting quiz (decision tree)',
    guide: 5, template: 'concept-classifier',
    guideWhy: 'concept-classifier-guide.md defines the data.json format of scenarios, options, explanations and hints that a sorting quiz is built from.',
    templateWhy: 'assets/concept-classifier/ (a sibling of assets/templates/) holds the quiz template sketch and a data-template.json to fill in.'
  }
];

// Descriptions shown when hovering each of the four skill parts and the context box
const partInfo = [
  { title: 'SKILL.md', sub: 'entry file',
    tip: 'The entry file: the skill\'s name and description, the numbered procedure (Steps 0 to 9) and the routing table that maps trigger words to guides.' },
  { title: 'references/', sub: 'reference guides',
    tip: '17 reference guides, one per MicroSim family. Each states rules in prose: layout formulas, control patterns and common bugs.' },
  { title: 'assets/templates/', sub: 'template assets',
    tip: 'Working example files the agent copies structurally: an HTML shell, docs and metadata templates, and a sample sketch or script per family.' },
  { title: 'microsim-utils/', sub: 'utility scripts (separate folder)',
    tip: 'Six Python scripts for the deterministic steps. The agent runs them and reads their output; it does not read their code.' }
];
const contextTip = 'Everything the agent has read for this request. Files that are never read cost no tokens and cannot pull the agent toward the wrong library.';

// ---------- state ----------
let templateData = null;      // loaded from data.json
let dataError = false;
let traced = 0;               // index of traced request, -1 = none (opens traced for request 1)
let selected = null;          // {kind, index} clicked item for the why panel
let partRects = [];           // hit areas for the four parts
let squareRects = [];         // hit areas for the small file / folder squares
let contextRect = null;
let hoverTip = null;

// ---------- controls ----------
let requestSelect, traceButton, resetButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  requestSelect = createSelect();
  requestSelect.parent(document.querySelector('main'));
  requests.forEach((r, i) => requestSelect.option(r.label, String(i)));
  requestSelect.changed(() => { traced = -1; selected = null; });

  traceButton = createButton('Trace');
  traceButton.parent(document.querySelector('main'));
  traceButton.mouseClicked(doTrace);

  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.mouseClicked(doReset);

  positionControls();

  // template folder file counts come from data.json (fetch works in p5.js 1.x and 2.x)
  fetch('data.json')
    .then(r => r.json())
    .then(d => { templateData = d; })
    .catch(() => { dataError = true; });

  describe('Diagram of the microsim-generator skill as four boxes: SKILL.md, references with 17 guides, ' +
    'assets/templates with one folder per MicroSim family, and the microsim-utils scripts, each linked to an ' +
    'Agent working context box. Choose a request and press Trace to highlight, in order, the routing table, ' +
    'the one guide, the one template folder and the utilities the agent uses. Unread guides stay grey. ' +
    'Click a highlighted box to read why the agent needs it.', LABEL);
}

function positionControls() {
  requestSelect.position(95, drawHeight + 8);
  requestSelect.size(min(300, canvasWidth - 110));
  traceButton.position(10, drawHeight + 44);
  resetButton.position(10 + traceButton.elt.offsetWidth + 8, drawHeight + 44);
}

function doTrace() {
  traced = int(requestSelect.value());
  selected = null;
}

function doReset() {
  traced = -1;
  selected = null;
  requestSelect.selected('0');
}

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
  textSize(22);
  text('Generator Skill Anatomy', canvasWidth / 2, 8);

  hoverTip = null;
  partRects = [];
  squareRects = [];
  const narrow = canvasWidth < 500;
  if (narrow) layoutNarrow(); else layoutWide();

  drawControlLabels();
  if (hoverTip) drawTooltip(hoverTip);
}

// ---------- layouts ----------
function layoutWide() {
  const leftW = canvasWidth * 0.58;
  const boxX = margin + 22;
  const boxW = leftW - boxX;
  const top = 60, boxH = 90, gap = 12;
  const rightX = leftW + 34;
  const rightW = canvasWidth - rightX - margin;

  drawTreeRoot(margin, 40, top, boxH, gap, boxX);
  for (let i = 0; i < 4; i++) partRects.push({ x: boxX, y: top + i * (boxH + gap), w: boxW, h: boxH });

  contextRect = { x: rightX, y: top, w: rightW, h: 230 };
  // connecting lines from each part to the context box
  // two passes so that no link line is drawn over an order badge
  for (const pass of ['lines', 'badges']) {
    for (let i = 0; i < 4; i++) {
      const r = partRects[i];
      const tx = contextRect.x;
      const ty = contextRect.y + 40 + i * 44;
      drawLink(i, r.x + r.w, r.y + r.h / 2, tx, ty, pass);
    }
  }
  for (let i = 0; i < 4; i++) drawPart(i, partRects[i]);
  drawContext(contextRect, false);
  drawWhyPanel({ x: rightX, y: top + 242, w: rightW, h: 4 * boxH + 3 * gap - 242 });
}

function layoutNarrow() {
  const boxX = margin + 18;
  const boxW = canvasWidth - boxX - margin - 18;
  const top = 58, boxH = 74, gap = 8;
  drawTreeRoot(margin, 38, top, boxH, gap, boxX);
  for (let i = 0; i < 4; i++) partRects.push({ x: boxX, y: top + i * (boxH + gap), w: boxW, h: boxH });

  const cy = top + 4 * (boxH + gap) + 4;
  contextRect = { x: margin, y: cy, w: canvasWidth - 2 * margin, h: drawHeight - cy - 8 };
  // a bus line on the right carries every part down into the context box
  const busX = canvasWidth - margin - 8;
  for (let i = 0; i < 4; i++) {
    const r = partRects[i];
    const on = traced >= 0;
    stroke(on ? 'royalblue' : 'silver');
    strokeWeight(on ? 3 : 1.5);
    line(r.x + r.w, r.y + r.h / 2, busX, r.y + r.h / 2);
  }
  stroke(traced >= 0 ? 'royalblue' : 'silver');
  strokeWeight(traced >= 0 ? 3 : 1.5);
  line(busX, partRects[0].y + partRects[0].h / 2, busX, contextRect.y - 6);
  arrowHead(busX, contextRect.y - 2, HALF_PI, traced >= 0 ? 'royalblue' : 'silver');
  for (let i = 0; i < 4; i++) drawPart(i, partRects[i]);
  if (selected) drawWhyPanel(contextRect);
  else drawContext(contextRect, true);
}

function drawTreeRoot(x, y, top, boxH, gap, boxX) {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(15);
  textStyle(BOLD);
  text('microsim-generator skill', x, y);
  textStyle(NORMAL);
  const trunkX = x + 8;
  for (let i = 0; i < 4; i++) {
    const my = top + i * (boxH + gap) + boxH / 2;
    stroke('gray');
    strokeWeight(1.5);
    if (i === 3) drawingContext.setLineDash([5, 4]); // utilities live in a separate folder
    line(trunkX, i === 0 ? y + 10 : top + (i - 1) * (boxH + gap) + boxH / 2, trunkX, my);
    line(trunkX, my, boxX, my);
    drawingContext.setLineDash([]);
  }
}

function drawLink(i, x1, y1, x2, y2, pass) {
  const on = traced >= 0;
  if (pass === 'lines') {
    stroke(on ? 'royalblue' : 'silver');
    strokeWeight(on ? 3 : 1.5);
    noFill();
    bezier(x1, y1, x1 + 20, y1, x2 - 20, y2, x2 - 6, y2);
    arrowHead(x2 - 2, y2, 0, on ? 'royalblue' : 'silver');
    return;
  }
  if (on) {
    // order badge
    // badge sits near the source box so it does not cover the arrowheads
    const mx = x1 + 16, my = y1;
    stroke('white');
    strokeWeight(2);
    fill('royalblue');
    circle(mx, my, 22);
    noStroke();
    fill('white');
    textAlign(CENTER, CENTER);
    textSize(13);
    textStyle(BOLD);
    text(i + 1, mx, my);
    textStyle(NORMAL);
  }
}

function arrowHead(x, y, ang, col) {
  push();
  translate(x, y);
  rotate(ang);
  noStroke();
  fill(col);
  triangle(0, 0, -9, -5, -9, 5);
  pop();
}

// ---------- the four skill parts ----------
function drawPart(i, r) {
  const on = traced >= 0;
  const hover = isInside(r);
  stroke(on ? 'royalblue' : (hover ? 'dimgray' : 'silver'));
  strokeWeight(on ? 3 : 1.5);
  fill('white');
  rect(r.x, r.y, r.w, r.h, 8);
  if (selected && selected.kind === 'part' && selected.index === i) {
    noFill();
    stroke('darkorange');
    strokeWeight(3);
    rect(r.x - 4, r.y - 4, r.w + 8, r.h + 8, 10);
  }

  // header
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(15);
  text(partInfo[i].title, r.x + 10, r.y + 7);
  const tw = fontWidth(partInfo[i].title);
  textStyle(NORMAL);
  textSize(13);
  fill('dimgray');
  if (r.x + 18 + tw + fontWidth(partInfo[i].sub) < r.x + r.w - 6) text(partInfo[i].sub, r.x + 18 + tw, r.y + 9);

  // squares row and status line
  const sy = r.y + 30;
  const statusY = r.y + r.h - 22;
  if (i === 0) drawSkillRow(r, sy);
  if (i === 1) drawSquares(r, sy, guides.length, k => traced >= 0 && requests[traced].guide === k,
    k => 'guide', k => guides[k].file + ' (' + guides[k].lines + ' lines)\nTriggers: ' + guides[k].triggers);
  if (i === 2) {
    const folders = templateData ? templateData.templateFolders : [];
    drawSquares(r, sy, folders.length, k => traced >= 0 && folders[k].name === requests[traced].template,
      k => 'template', k => folders[k].path + ' (' + folders[k].files.length + ' files)' +
        (folders[k].note ? '\n' + folders[k].note : ''), k => folders[k].name === 'concept-classifier');
  }
  if (i === 3) drawSquares(r, sy, utilities.length, k => traced >= 0 && utilities[k].singleSim,
    k => 'utility', k => utilities[k].file + '\n' + utilities[k].job);

  noStroke();
  fill(on ? 'black' : 'dimgray');
  textSize(13);
  textAlign(LEFT, TOP);
  const status = fitText(partStatus(i), r.w - 20);
  text(status, r.x + 10, statusY);

  if (hover && !hoverTip) hoverTip = partInfo[i].tip;
}

function drawSkillRow(r, y) {
  // one file icon plus the routing-table row that matched
  const on = traced >= 0;
  stroke(on ? 'royalblue' : 'gray');
  strokeWeight(1);
  fill(on ? 'royalblue' : 'gainsboro');
  rect(r.x + 10, y, 16, 18, 2);
  noStroke();
  fill('black');
  textSize(13);
  textAlign(LEFT, TOP);
  const prefix = canvasWidth < 500 ? 'Matched: ' : 'Routing table row matched: ';
  const msg = on ? prefix + requests[traced].match : 'Routing table: trigger words to guide';
  text(fitText(msg, r.w - 50), r.x + 34, y + 2);
}

// draws n small squares; isOn(k) says whether square k is read for the traced request
function drawSquares(r, y, n, isOn, kind, tipFor, isDashed) {
  if (n === 0) {
    noStroke();
    fill('firebrick');
    textSize(13);
    textAlign(LEFT, TOP);
    text(dataError ? 'data.json could not be loaded' : 'Loading data.json ...', r.x + 10, y + 2);
    return;
  }
  // shrink the squares so that one row always holds all n of them
  const gap = 4;
  const size = Math.max(9, Math.min(16, Math.floor((r.w - 20 + gap) / n) - gap));
  const maxPerRow = Math.floor((r.w - 20 + gap) / (size + gap));
  const perRow = Math.min(n, maxPerRow);
  for (let k = 0; k < n; k++) {
    const x = r.x + 10 + (k % perRow) * (size + gap);
    const yy = y + Math.floor(k / perRow) * (size + 3);
    const on = isOn(k);
    const rr = { x: x, y: yy, w: size, h: size, kind: kind(k), index: k, on: on };
    squareRects.push(rr);
    stroke(on ? 'navy' : 'gray');
    strokeWeight(on ? 2 : 1);
    if (isDashed && isDashed(k)) drawingContext.setLineDash([3, 2]);
    fill(on ? 'royalblue' : 'gainsboro');
    rect(x, yy, size, size, 3);
    drawingContext.setLineDash([]);
    if (isInside(rr)) hoverTip = tipFor(k);
  }
}

function partStatus(i) {
  if (traced < 0) {
    if (i === 0) return 'Always read first.';
    if (i === 1) return guides.length + ' guides; none loaded yet.';
    if (i === 2) return templateData ? templateData.templateFolders.length + ' template folders; none copied yet.' : 'Template folders (from data.json)';
    return utilities.length + ' scripts; none run yet.';
  }
  const q = requests[traced];
  if (i === 0) return '1. Read the procedure and routing table (' + fmtNum(SKILL_LINES) + ' lines).';
  if (i === 1) return '2. Loaded ' + guides[q.guide].file + '; ' + (guides.length - 1) + ' guides stay grey.';
  if (i === 2) {
    const f = templateFolder(q.template);
    return f ? '3. Copied ' + f.path + ' (' + f.files.length + ' files).' : '3. Copied the ' + q.template + ' templates.';
  }
  return '4. Runs 4 scripts; 2 are for chapter batches only.';
}

function templateFolder(name) {
  if (!templateData) return null;
  return templateData.templateFolders.find(f => f.name === name) || null;
}

function fmtNum(n) {
  return n.toLocaleString('en-US');
}

// ---------- agent working context ----------
function drawContext(r, compact) {
  const hover = isInside(r);
  stroke(traced >= 0 ? 'royalblue' : (hover ? 'dimgray' : 'silver'));
  strokeWeight(traced >= 0 ? 3 : 1.5);
  fill('lavender');
  rect(r.x, r.y, r.w, r.h, 10);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(15);
  text('Agent working context', r.x + 10, r.y + 8);
  textStyle(NORMAL);
  if (hover && !hoverTip) hoverTip = contextTip;

  textSize(compact ? 13 : 14);
  const lh = compact ? 17 : 20;
  let y = r.y + 32;
  if (traced < 0) {
    fill('dimgray');
    wrapLines('Nothing loaded yet. Choose a request and press Trace.', r.w - 20).forEach(L => {
      text(L, r.x + 10, y); y += lh;
    });
    return;
  }
  const q = requests[traced];
  const f = templateFolder(q.template);
  const items = [
    'SKILL.md: procedure and routing table',
    guides[q.guide].file + ' (' + fmtNum(guides[q.guide].lines) + ' lines)',
    (f ? f.path : q.template + ' templates') + (f ? ' (' + f.files.length + ' files)' : ''),
    'Output of 4 utility scripts'
  ];
  if (compact) {
    fill('black');
    const line1 = items.map((s, k) => (k + 1) + ' ' + s.split(' (')[0].split(':')[0]).join('  >  ');
    wrapLines(line1, r.w - 20).forEach(L => { text(L, r.x + 10, y); y += lh; });
  } else {
    items.forEach((s, k) => {
      fill('royalblue');
      circle(r.x + 20, y + 8, 18);
      fill('white');
      textAlign(CENTER, CENTER);
      text(k + 1, r.x + 20, y + 8);
      textAlign(LEFT, TOP);
      fill('black');
      wrapLines(s, r.w - 44).forEach(L => { text(L, r.x + 34, y); y += lh; });
      y += 3;
    });
  }
  if (compact) return;   // the counter is also shown in the control region
  y += 4;
  textStyle(BOLD);
  fill('darkslateblue');
  text('Guides loaded: 1 of ' + guides.length, r.x + 10, y);
  textStyle(NORMAL);
}

// ---------- why panel ----------
function drawWhyPanel(r) {
  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(r.x, r.y, r.w, r.h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  const lines = whyText();
  let y = r.y + 10;
  textStyle(BOLD);
  textSize(15);
  fill('black');
  wrapLines(lines.title, r.w - 20).forEach(L => { text(L, r.x + 10, y); y += 19; });
  textStyle(NORMAL);
  y += 2;
  // shrink the body font if it would overflow the panel
  let fs = 14;
  while (fs > 12 && wrapLinesAt(lines.body, r.w - 20, fs).length * (fs + 4) > r.y + r.h - y - 6) fs--;
  textSize(fs);
  fill(lines.dim ? 'dimgray' : 'black');
  wrapLines(lines.body, r.w - 20).forEach(L => { text(L, r.x + 10, y); y += fs + 4; });
}

function wrapLinesAt(str, w, fs) {
  textSize(fs);
  return wrapLines(str, w);
}

function whyText() {
  if (!selected) {
    return traced < 0 ?
      { title: 'Why does the agent need it?', body: 'Choose a request and press Trace. Then click a highlighted box or square to see why the agent needs it for that request.', dim: true } :
      { title: 'Why does the agent need it?', body: 'Click a highlighted box or a blue square. Click a grey square to see why that file is left out.', dim: true };
  }
  const q = requests[traced];
  if (selected.kind === 'part') {
    const i = selected.index;
    if (i === 0) {
      if (q.guide === 5) return { title: 'SKILL.md', body: 'The agent reads SKILL.md first. No keyword row says "quiz", so its decision tree question "Students classify scenarios into categories (sorting quiz)?" is what routes this request to concept-classifier-guide.md.' };
      return { title: 'SKILL.md', body: 'The agent reads SKILL.md first because its routing table is what matches "' + q.match + '" to ' + guides[q.guide].file + '.' };
    }
    if (i === 1) return { title: guides[q.guide].file, body: q.guideWhy };
    if (i === 2) return { title: 'Template assets', body: q.templateWhy };
    return { title: 'Utility scripts', body: 'For one MicroSim the agent runs generate-sim-scaffold.py, validate-sims.py, sync-iframe-heights.py and update-mkdocs-nav.py; extract-sim-specs.py and add-iframes-to-chapter.py are for chapter batches.' };
  }
  const k = selected.index;
  if (selected.kind === 'guide') {
    if (k === q.guide) return { title: guides[k].file, body: q.guideWhy };
    return { title: guides[k].file + ' is not read', body: 'None of its trigger words (' + guides[k].triggers + ') fits "' + q.label.toLowerCase() + '", so it never enters the agent\'s context.', dim: true };
  }
  if (selected.kind === 'template') {
    const f = templateData.templateFolders[k];
    if (f.name === q.template) return { title: f.path, body: q.templateWhy };
    return { title: f.path + ' is not copied', body: 'These ' + f.files.length + ' files belong to a different MicroSim family, so copying them would teach the agent the wrong structure.', dim: true };
  }
  const u = utilities[k];
  if (u.singleSim) return { title: u.file, body: 'The agent runs it because it ' + u.job + '. The script does this the same way every time, so no model tokens are spent on it.' };
  return { title: u.file + ' is not run', body: 'It ' + u.job + ', and this request asks for a single MicroSim.', dim: true };
}

// ---------- control labels ----------
function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(16);
  textAlign(LEFT, CENTER);
  text('Request:', 10, drawHeight + 20);
  textSize(canvasWidth < 500 ? 14 : 16);
  const x = 10 + traceButton.elt.offsetWidth + 8 + resetButton.elt.offsetWidth + 16;
  if (traced >= 0) {
    textStyle(BOLD);
    text('Guides loaded: 1 of ' + guides.length, x, drawHeight + 56);
    textStyle(NORMAL);
  } else {
    fill('dimgray');
    text(canvasWidth < 500 ? 'Guides loaded: 0 of ' + guides.length : 'Guides loaded: 0 of ' + guides.length + ' (press Trace)', x, drawHeight + 56);
  }
}

// ---------- tooltip ----------
function drawTooltip(msg) {
  textSize(14);
  const maxW = min(300, canvasWidth - 30);
  const lines = [];
  msg.split('\n').forEach(part => wrapLines(part, maxW - 16).forEach(L => lines.push(L)));
  const tw = min(maxW, max(lines.map(L => fontWidth(L))) + 16);
  const th = lines.length * 18 + 10;
  let tx = mouseX + 14, ty = mouseY + 16;
  if (tx + tw > canvasWidth - 4) tx = canvasWidth - 4 - tw;
  if (tx < 4) tx = 4;
  if (ty + th > drawHeight - 4) ty = mouseY - th - 8;
  stroke('dimgray');
  strokeWeight(1);
  fill('lightyellow');
  rect(tx, ty, tw, th, 6);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  lines.forEach((L, i) => text(L, tx + 8, ty + 6 + i * 18));
}

// ---------- helpers ----------
function isInside(r) {
  return mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h;
}

function wrapLines(str, maxW) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (fontWidth(test) > maxW && line) { lines.push(line); line = word; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

// shortens a single-line string with an ellipsis so it fits maxW
function fitText(str, maxW) {
  if (fontWidth(str) <= maxW) return str;
  let s = str;
  while (s.length > 3 && fontWidth(s + '...') > maxW) s = s.slice(0, -1);
  return s + '...';
}

// ---------- mouse ----------
function mousePressed() {
  if (mouseY > drawHeight) return;
  // squares first (they sit inside the part boxes)
  for (const s of squareRects) {
    if (isInside(s)) {
      if (traced >= 0) selected = { kind: s.kind, index: s.index };
      return;
    }
  }
  for (let i = 0; i < partRects.length; i++) {
    if (isInside(partRects[i])) {
      selected = traced >= 0 ? { kind: 'part', index: i } : null;
      return;
    }
  }
  // clicking elsewhere closes the panel
  selected = null;
}

// ---------- responsive design ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
}
