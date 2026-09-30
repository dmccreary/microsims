// Batch Generation Pipeline Stepper
// CANVAS_HEIGHT: 640
// Step through the eight steps of the microsim-generator batch route and see
// which steps a Python utility performs (blue), which step the AI agent
// performs (orange) and which step is the instructional design checkpoint
// (gray). The detail panel traces the files each step reads and writes.
// Width responsive: 8 boxes in one row at 600px and wider, 2 rows of 4 below.

// ---------- canvas layout ----------
let canvasWidth = 400;
let drawHeight = 590;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 160;   // not used for sliders here; kept for the standard layout
let defaultTextSize = 16;

// ---------- controls ----------
let prevButton, nextButton, showFilesCheckbox;

// ---------- state ----------
let selected = 0;          // index of the selected step (0..7)
let hovered = -1;          // index of the box under the mouse
let boxes = [];            // computed box rectangles

// Actor styles: fill, border, label
const ACTORS = {
  script:     { fill: 'lightskyblue', border: 'steelblue', label: 'Python script' },
  agent:      { fill: 'orange',       border: 'darkorange', label: 'AI agent' },
  checkpoint: { fill: 'lightgray',    border: 'dimgray',    label: 'Checkpoint' }
};

// The eight batch steps, as listed in Chapter 14 and the microsim-generator skill.
// reads/writes use short file names; "chapter index.md" is the chapter page and
// "index.md" is the sim's own documentation page.
const STEPS = [
  { short: 'Extract specs', title: 'Extract the specifications', actor: 'script',
    tool: 'extract-sim-specs.py',
    purpose: 'Turn the chapter\'s spec blocks into the specification JSON.',
    does: 'Scans the chapter for #### Diagram: and #### Drawing: headings and turns each details block into one record; with --status-file it also derives every sim\'s status from the files on disk.',
    reads: ['chapter index.md'], writes: ['ch-specs.json', 'sim-status.json'] },
  { short: 'Scaffold', title: 'Scaffold each sim directory', actor: 'script',
    tool: 'generate-sim-scaffold.py',
    purpose: 'Create docs/sims/<sim-id>/ with three boilerplate files.',
    does: 'Creates a directory for every record and writes the three boilerplate files. It skips existing directories unless --force is used, and it never writes the .js file.',
    reads: ['ch-specs.json'], writes: ['main.html', 'index.md', 'metadata.json'] },
  { short: 'Design check', title: 'Instructional design checkpoint', actor: 'checkpoint',
    tool: 'no script: a judgment recorded before coding',
    purpose: 'Match the Bloom level and verb to an interaction pattern.',
    does: 'Reads the Bloom level, verb and objective in each spec and matches them to an interaction pattern before any code exists. It produces a decision, not a file.',
    reads: ['ch-specs.json'], writes: [] },
  { short: 'Write .js', title: 'Write the .js file', actor: 'agent',
    tool: 'AI agent, following the matched generator guide',
    purpose: 'The one creative step: write the simulation code.',
    does: 'The agent reads the full spec_text and the scaffolded main.html, follows the matched guide, and writes the simulation with a // CANVAS_HEIGHT: comment near the top.',
    reads: ['ch-specs.json', 'main.html'], writes: ['<sim-id>.js'] },
  { short: 'Insert iframes', title: 'Insert and fix chapter iframes', actor: 'script',
    tool: 'add-iframes-to-chapter.py',
    purpose: 'Embed each sim in the chapter with a relative iframe.',
    does: 'Adds a ../../sims/<sim-id>/main.html iframe before every spec block that lacks one. --fix-heights reads the canvas height from the .js file and --fix-paths makes absolute paths relative.',
    reads: ['chapter index.md', '<sim-id>.js'], writes: ['chapter index.md'] },
  { short: 'Validate & sync', title: 'Validate, sync heights, test controls', actor: 'script',
    tool: 'validate-sims.py, sync-iframe-heights.py, test-iframe-heights.py',
    purpose: 'Score quality, fix iframe heights, check controls are visible.',
    does: 'Scores each sim on the 100-point rubric, writes CANVAS_HEIGHT + 2 into every iframe that embeds the sim, and loads the sim in a headless browser to confirm every control is visible.',
    reads: ['main.html', 'index.md', 'metadata.json', '<sim-id>.js', 'chapter index.md'],
    writes: ['index.md', 'chapter index.md'] },
  { short: 'Update nav', title: 'Update the site navigation', actor: 'script',
    tool: 'update-mkdocs-nav.py',
    purpose: 'Rebuild the MicroSims section of mkdocs.yml.',
    does: 'Scans docs/sims/ for directories with an index.md, reads each display title, and replaces the whole MicroSims section of mkdocs.yml with an alphabetical list.',
    reads: ['index.md'], writes: ['mkdocs.yml'] },
  { short: 'Screenshot & review', title: 'Screenshot and layout review', actor: 'script',
    tool: 'bk-capture-screenshot (then the Chapter 13 layout review)',
    purpose: 'Capture the preview image, then review the layout.',
    does: 'Renders main.html in headless Chrome at the iframe height and saves the preview image. The visual layout review of Chapter 13 then walks a checklist against that image.',
    reads: ['main.html', '<sim-id>.js'], writes: ['<sim-id>.png'] }
];

// What happens to files that no later batch step reads
const DOWNSTREAM = {
  'sim-status.json': 'read on resume',
  'mkdocs.yml': 'read by mkdocs build',
  '<sim-id>.png': 'used as the preview image',
  'metadata.json': 'read by search tools',
  'chapter index.md': 'published by mkdocs build'
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  prevButton = createButton('Previous');
  prevButton.parent(document.querySelector('main'));
  prevButton.mousePressed(() => selectStep(selected - 1));

  nextButton = createButton('Next');
  nextButton.parent(document.querySelector('main'));
  nextButton.mousePressed(() => selectStep(selected + 1));

  showFilesCheckbox = createCheckbox(' Show files', false);
  showFilesCheckbox.parent(document.querySelector('main'));

  positionControls();

  describe('Eight rounded boxes show the steps of the MicroSim batch generation pipeline. ' +
    'Blue boxes are Python scripts, the orange box is the AI agent writing the .js file, and the ' +
    'gray box is the instructional design checkpoint. Previous and Next buttons or a click on a ' +
    'box select a step; a panel lists the actor, the tool, and the files the step reads and ' +
    'writes, with the earlier step that produced each input. Show files draws arrows between ' +
    'the steps that pass files to each other.');
}

function positionControls() {
  const y = drawHeight + 12;
  prevButton.position(10, y);
  nextButton.position(95, y);
  showFilesCheckbox.position(160, y + 2);
}

function selectStep(i) {
  selected = constrain(i, 0, STEPS.length - 1);
}

// ---------- layout ----------
function isWide() { return canvasWidth >= 600; }

// Vertical layout for the two responsive modes
function layout() {
  if (isWide()) return { legendY: 48, arrowLegendY: 70, rowTop: 122, bh: 80, rowGap: 0, perRow: 8, panelTop: 262 };
  return { legendY: 44, arrowLegendY: 64, rowTop: 112, bh: 62, rowGap: 24, perRow: 4, panelTop: 298 };
}

function computeBoxes() {
  boxes = [];
  const L = layout();
  const n = STEPS.length;
  const gap = isWide() ? 8 : 10;
  const bw = (canvasWidth - 2 * margin - (L.perRow - 1) * gap) / L.perRow;
  for (let i = 0; i < n; i++) {
    const row = floor(i / L.perRow);
    const col = i % L.perRow;
    boxes.push({ x: margin + col * (bw + gap), y: L.rowTop + row * (L.bh + L.rowGap), w: bw, h: L.bh, row: row });
  }
}

function boxAt(mx, my) {
  for (let i = 0; i < boxes.length; i++) {
    const b = boxes[i];
    if (mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h) return i;
  }
  return -1;
}

// The step that most recently wrote a file before step s (or -1 = the author)
function producerOf(file, s) {
  for (let k = s - 1; k >= 0; k--) {
    if (STEPS[k].writes.includes(file)) return k;
  }
  return -1;
}

// Later steps that read a file whose latest producer is step s
function consumersOf(file, s) {
  const out = [];
  for (let k = s + 1; k < STEPS.length; k++) {
    if (STEPS[k].reads.includes(file) && producerOf(file, k) === s) out.push(k);
  }
  return out;
}

function draw() {
  updateCanvasSize();
  computeBoxes();

  // drawing region and control region backgrounds
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(isWide() ? 22 : 19);
  text('Batch Pipeline: Script or Agent?', canvasWidth / 2, 10);

  drawLegend();

  // hover detection
  hovered = boxAt(mouseX, mouseY);

  if (showFilesCheckbox.checked()) drawFileArrows();
  drawBoxes();
  drawDetailPanel();
  drawControlText();

  if (hovered >= 0) drawTooltip(hovered);
  cursor(hovered >= 0 ? HAND : ARROW);
}

function drawLegend() {
  const L = layout();
  const items = ['script', 'agent', 'checkpoint'];
  textSize(14);
  textAlign(LEFT, CENTER);
  let widths = items.map(k => 18 + fontWidth(ACTORS[k].label) + 16);
  let total = widths.reduce((a, b) => a + b, 0);
  let x = (canvasWidth - total) / 2;
  const y = L.legendY;
  for (let i = 0; i < items.length; i++) {
    const a = ACTORS[items[i]];
    stroke(a.border);
    strokeWeight(1);
    fill(a.fill);
    rect(x, y - 6, 12, 12, 2);
    noStroke();
    fill('black');
    text(a.label, x + 18, y);
    x += widths[i];
  }
  if (showFilesCheckbox && showFilesCheckbox.checked()) {
    textSize(13);
    textAlign(CENTER, CENTER);
    const ly = L.arrowLegendY;
    fill('darkgreen');
    text('green arrows: files this step reads', canvasWidth / 2 - (isWide() ? 130 : 0), ly);
    fill('purple');
    text('purple arrows: files later steps read', canvasWidth / 2 + (isWide() ? 130 : 0), ly + (isWide() ? 0 : 16));
  }
}

function drawBoxes() {
  for (let i = 0; i < boxes.length; i++) {
    const b = boxes[i];
    const a = ACTORS[STEPS[i].actor];
    if (i === selected) {
      stroke('black');
      strokeWeight(4);
    } else {
      stroke(a.border);
      strokeWeight(i === hovered ? 2.5 : 1.5);
    }
    fill(a.fill);
    rect(b.x, b.y, b.w, b.h, 10);

    // step number, short name and actor tag (a non-color cue)
    noStroke();
    fill('black');
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    textSize(13);
    text(String(i + 1), b.x + b.w / 2, b.y + 4);
    textStyle(NORMAL);
    textSize(b.w < 80 ? 12 : 13);
    const lines = wrapLines(STEPS[i].short, b.w - 6);
    const lead = b.w < 80 ? 14 : 15;
    const midY = b.y + 20 + (b.h - 38) / 2;
    let ty = midY - (lines.length * lead) / 2;
    for (const ln of lines) { text(ln, b.x + b.w / 2, ty); ty += lead; }
    textStyle(ITALIC);
    textSize(12);
    fill('black');
    text(STEPS[i].actor, b.x + b.w / 2, b.y + b.h - 17);
    textStyle(NORMAL);
  }
}

// Split a string into lines no wider than w at the current text size
function wrapLines(str, w) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (fontWidth(test) > w && line) { lines.push(line); line = word; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

// Draw word-wrapped text at (x, y) and return the height used
function wrappedText(str, x, y, w, lead) {
  const lines = wrapLines(str, w);
  textAlign(LEFT, TOP);
  for (let i = 0; i < lines.length; i++) text(lines[i], x, y + i * lead);
  return lines.length * lead;
}

// Draw a curved arrow from box s to box t (label drawn only in the wide layout)
function drawArrowBetween(s, t, col, label, above, bulge) {
  const bs = boxes[s], bt = boxes[t];
  let x1, y1, x2, y2, c1y, c2y;
  if (bs.row === bt.row) {
    x1 = bs.x + bs.w / 2; x2 = bt.x + bt.w / 2;
    if (above) { y1 = bs.y; y2 = bt.y; c1y = y1 - bulge; c2y = y2 - bulge; }
    else { y1 = bs.y + bs.h; y2 = bt.y + bt.h; c1y = y1 + bulge; c2y = y2 + bulge; }
  } else {
    // different rows (narrow layout): bottom of the upper box to top of the lower box
    const off = col === 'purple' ? 10 : -10;
    x1 = bs.x + bs.w / 2 + off;
    x2 = bt.x + bt.w / 2 + off;
    if (bs.row < bt.row) { y1 = bs.y + bs.h; y2 = bt.y; }
    else { y1 = bs.y; y2 = bt.y + bt.h; }
    c1y = (y1 + y2) / 2; c2y = (y1 + y2) / 2;
  }
  noFill();
  stroke(col);
  strokeWeight(2);
  bezier(x1, y1, x1, c1y, x2, c2y, x2, y2);
  // arrowhead at the target, pointing along the final (vertical) tangent
  push();
  translate(x2, y2);
  if (y2 < c2y) rotate(PI);   // curve arrives from below: point up
  fill(col);
  noStroke();
  triangle(0, 0, -5, -9, 5, -9);
  pop();
  if (!isWide()) return;
  const mx = bezierPoint(x1, x1, x2, x2, 0.5);
  const my = bezierPoint(y1, c1y, c2y, y2, 0.5);
  textSize(12);
  const tw = fontWidth(label);
  noStroke();
  fill(255, 255, 255, 230);
  rect(mx - tw / 2 - 3, my - 8, tw + 6, 16, 3);
  fill(col);
  textAlign(CENTER, CENTER);
  text(label, mx, my);
}

function drawFileArrows() {
  const s = selected;
  const wide = isWide();
  // In the wide layout, incoming arcs go above the row and outgoing arcs below.
  // In the narrow layout, same-row arcs go above row 1 and below row 2.
  const sideFor = (a, b, incoming) => wide ? incoming : boxes[a].row === 0;
  const incoming = {};
  for (const f of STEPS[s].reads) {
    const p = producerOf(f, s);
    if (p >= 0) (incoming[p] = incoming[p] || []).push(f);
  }
  const inKeys = Object.keys(incoming).map(Number).sort((a, b) => b - a);
  inKeys.forEach((p, idx) => {
    const span = abs(s - p) % (wide ? 8 : 4) || 1;
    const bulge = wide ? 14 + 7 * span + 4 * idx : 10 + 4 * span + 3 * idx;
    drawArrowBetween(p, s, 'darkgreen', shortList(incoming[p]), sideFor(p, s, true), bulge);
  });
  const outgoing = {};
  for (const f of STEPS[s].writes) {
    for (const r of consumersOf(f, s)) (outgoing[r] = outgoing[r] || []).push(f);
  }
  const outKeys = Object.keys(outgoing).map(Number).sort((a, b) => a - b);
  outKeys.forEach((r, idx) => {
    const span = abs(r - s) % (wide ? 8 : 4) || 1;
    const bulge = wide ? 12 + 6 * span + 4 * idx : 10 + 4 * span + 3 * idx;
    drawArrowBetween(s, r, 'purple', shortList(outgoing[r]), sideFor(s, r, false), bulge);
  });
}

function shortList(files) {
  if (files.length <= 2) return files.join(', ');
  return files.length + ' files';
}

// ---------- detail panel ----------
function drawDetailPanel() {
  const L = layout();
  const wide = isWide();
  const px = margin;
  const py = L.panelTop;
  const pw = canvasWidth - 2 * margin;
  const ph = drawHeight - py - 10;
  const st = STEPS[selected];
  const a = ACTORS[st.actor];

  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(px, py, pw, ph, 10);
  noStroke();
  fill(a.fill);
  rect(px + 1, py + 1, 8, ph - 2, 10, 0, 0, 10);   // actor color stripe

  const x = px + 20;
  let y = py + 10;
  const w = pw - 32;
  const lead = wide ? 19 : 17;
  fill('black');
  textStyle(BOLD);
  textSize(wide ? 17 : 16);
  y += wrappedText('Step ' + (selected + 1) + ': ' + (wide ? st.title : st.short), x, y, w, wide ? 22 : 20) + 2;
  textSize(wide ? 15 : 14);
  text('Actor:', x, y);
  const ax = x + fontWidth('Actor: ');
  textStyle(NORMAL);
  y += wrappedText(a.label + ' \u2014 ' + st.tool, ax, y, w - (ax - x), lead);
  y += wrappedText(st.does, x, y, w, lead) + 8;

  if (wide) {
    const colW = (w - 20) / 2;
    drawFileList('Reads', st.reads, x, y, colW, 'in');
    drawFileList('Writes', st.writes, x + colW + 20, y, colW, 'out');
    // a closing reminder of the division of labor
    textSize(14);
    textStyle(ITALIC);
    fill('dimgray');
    wrappedText('Scripts do the six steps that have one correct answer; the agent does only step 4, ' +
      'and step 3 is a judgment recorded before any code is written.', x, py + ph - 48, w, 18);
    textStyle(NORMAL);
  } else {
    const h1 = drawFileList('Reads', st.reads, x, y, w, 'in');
    drawFileList('Writes', st.writes, x, y + h1 + 2, w, 'out');
  }
}

// Draw a heading and a flowing list of document chips; returns the height used
function drawFileList(heading, files, x, y, w, dir) {
  const wide = isWide();
  textStyle(BOLD);
  textSize(14);
  fill('black');
  noStroke();
  textAlign(LEFT, TOP);
  text(heading, x, y);
  textStyle(NORMAL);
  let cy = y + 20;
  if (files.length === 0) {
    fill('dimgray');
    text('nothing: this step writes no file', x, cy);
    return 44;
  }
  let cx = x;
  const chipH = wide ? 36 : 22;
  for (const f of files) {
    let caption;
    let iconFill = 'white';
    if (dir === 'in') {
      const p = producerOf(f, selected);
      if (p < 0) caption = wide ? 'from the author' : '(author)';
      else { caption = wide ? 'from step ' + (p + 1) : '(step ' + (p + 1) + ')'; iconFill = ACTORS[STEPS[p].actor].fill; }
    } else {
      const c = consumersOf(f, selected);
      iconFill = ACTORS[STEPS[selected].actor].fill;
      if (c.length) caption = (wide ? 'read by step' + (c.length > 1 ? 's ' : ' ') : '(to ') + c.map(k => k + 1).join(', ') + (wide ? '' : ')');
      else caption = wide ? (DOWNSTREAM[f] || 'final output') : '(' + (DOWNSTREAM[f] || 'final output') + ')';
    }
    textSize(13);
    const nameW = fontWidth(f);
    textSize(12);
    const capW = fontWidth(caption);
    const cw = wide ? 22 + max(nameW, capW) + 10 : 20 + nameW + 5 + capW + 12;
    if (cx + cw > x + w && cx > x) { cx = x; cy += chipH + 4; }
    drawDocIcon(cx, cy + (wide ? 2 : 0), iconFill);
    noStroke();
    textAlign(LEFT, TOP);
    fill('black');
    textSize(13);
    text(f, cx + 20, cy + (wide ? 0 : 3));
    fill('dimgray');
    textSize(12);
    if (wide) text(caption, cx + 20, cy + 17);
    else text(caption, cx + 20 + nameW + 5, cy + 4);
    cx += cw + 6;
  }
  return (cy + chipH) - y;
}

// A small document icon with a folded corner
function drawDocIcon(x, y, col) {
  stroke('dimgray');
  strokeWeight(1);
  fill(col);
  beginShape();
  vertex(x, y);
  vertex(x + 9, y);
  vertex(x + 14, y + 5);
  vertex(x + 14, y + 18);
  vertex(x, y + 18);
  endShape(CLOSE);
  line(x + 9, y, x + 9, y + 5);
  line(x + 9, y + 5, x + 14, y + 5);
}

function drawControlText() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textStyle(BOLD);
  textAlign(RIGHT, CENTER);
  text('Step ' + (selected + 1) + ' of ' + STEPS.length, canvasWidth - 12, drawHeight + controlHeight / 2);
  textStyle(NORMAL);
}

function drawTooltip(i) {
  const msg = STEPS[i].purpose;
  textSize(14);
  const tw = min(fontWidth(msg), 240);
  const lines = wrapLines(msg, tw);
  const th = lines.length * 18 + 8;
  let tx = mouseX + 14;
  let ty = mouseY + 18;
  if (tx + tw + 14 > canvasWidth) tx = canvasWidth - tw - 18;
  if (ty + th > drawHeight) ty = mouseY - th - 8;
  stroke('dimgray');
  strokeWeight(1);
  fill('lightyellow');
  rect(tx, ty, tw + 12, th, 5);
  noStroke();
  fill('black');
  wrappedText(msg, tx + 6, ty + 4, tw + 2, 18);
}

// ---------- events ----------
function mousePressed() {
  computeBoxes();
  const i = boxAt(mouseX, mouseY);
  if (i >= 0) selectStep(i);
}

function keyPressed() {
  if (key === 'ArrowRight') selectStep(selected + 1);
  if (key === 'ArrowLeft') selectStep(selected - 1);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
}
