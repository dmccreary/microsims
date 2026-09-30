// MicroSim Directory Audit
// CANVAS_HEIGHT: 560
// The learner audits three sample MicroSim directories, flags the lines that hold
// planted defects, rates each flag's severity, and checks the audit against a rubric.
// Severity rubric: cosmetic < discovery < display < breaks embedding.

// ----- Standard MicroSim layout -----
let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

// ----- Code viewer metrics -----
const codeSize = 13;      // monospace text size in the viewer
const rowH = 19;          // height of one wrapped code row
const gutterW = 30;       // line-number gutter
const SEVERITIES = ['cosmetic', 'discovery', 'display', 'breaks embedding'];
const RUBRIC = {
  'cosmetic': 'looks untidy, but everything works and can be found',
  'discovery': 'search, the gallery or previews cannot find or show it',
  'display': 'it runs, but shows the wrong thing or hides part of itself',
  'breaks embedding': 'the iframe or link that embeds it fails to load it'
};

// ----- Sample directories with planted defects (file 0 is the directory listing) -----
const SAMPLES = [
  {
    folder: 'docs/sims/Pendulum-Period/',
    files: [
      { name: 'Pendulum-Period/', kind: 'dir', lines: [
        'docs/sims/Pendulum-Period/',
        '    Pendulum-Period.js',
        '    Pendulum-Period.png',
        '    index.md',
        '    main.html',
        '    metadata.json'] },
      { name: 'Pendulum-Period.js', lines: [
        '// Pendulum Period MicroSim',
        '// CANVAS_HEIGHT: 450',
        'let canvasWidth = 400;',
        'let drawHeight = 400;',
        'let controlHeight = 90;',
        'let canvasHeight = drawHeight + controlHeight;',
        'let margin = 25;',
        '',
        'function setup() {',
        '  updateCanvasSize();',
        '  const canvas = createCanvas(canvasWidth, canvasHeight);',
        "  canvas.parent(document.querySelector('main'));",
        '  // ... length and gravity sliders ...',
        '}'] },
      { name: 'index.md', lines: [
        '---',
        'title: Pendulum Period',
        'description: Change the length of a pendulum and time its swing.',
        'creator: Dan McCreary',
        'rights: CC BY-NC-SA 4.0',
        'image: /sims/Pendulum-Period/Pendulum-Period.png',
        'og:image: /sims/Pendulum-Period/Pendulum-Period.png',
        'social:',
        '   cards: false',
        '---',
        '# Pendulum Period',
        '',
        '<iframe src="main.html" height="452px" width="100%" scrolling="no"></iframe>',
        '',
        '[Run the Pendulum Period MicroSim Fullscreen](main.html){ .md-button }'] },
      { name: 'main.html', lines: [
        '<!DOCTYPE html>',
        '<html lang="en">',
        '<head>',
        '  <meta charset="UTF-8">',
        '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        '  <meta name="schema" content="https://dmccreary.github.io/intelligent-textbooks/ns/microsim/v1">',
        '  <title>Pendulum Period MicroSim using p5.js</title>',
        '  <script src="https://cdn.jsdelivr.net/npm/p5/lib/p5.js"></script>',
        '  <script src="Pendulum-Period.js"></script>',
        '</head>',
        '<body>',
        '  <main></main>',
        '  <a href=".">Back to Documentation</a>',
        '</body>',
        '</html>'] },
      { name: 'metadata.json', lines: [
        '{',
        '  "title": "Pendulum Period",',
        '  "creator": "Dan McCreary",',
        '  "subject": ["Physics", "Pendulum"],',
        '  "description": "Change the length of a pendulum and time its swing.",',
        '  "identifier": "https://dmccreary.github.io/microsims/sims/Pendulum-Period/",',
        '  "educational": { "bloomsTaxonomy": ["Apply"] },',
        '  "technical": {',
        '    "framework": "p5.js",',
        '    "canvasDimensions": { "height": 490 }',
        '  }',
        '}'] }
    ],
    defects: [
      { file: 0, lines: [1, 2, 3], name: 'Folder name has uppercase letters', severity: 'breaks embedding',
        why: 'The capitals become part of the URL, so a chapter iframe written as ../../sims/pendulum-period/main.html gets a 404 on case-sensitive GitHub Pages.' },
      { file: 1, lines: [2, 4, 5], name: 'CANVAS_HEIGHT is not drawHeight + controlHeight', severity: 'display',
        why: '400 + 90 = 490, not 450, so synced iframes will be 452 px tall and cut off the bottom 40 px, where the sliders are.' },
      { file: 2, lines: [4, 5], name: 'Dublin Core fields in the front matter', severity: 'discovery',
        why: 'creator and rights belong only in metadata.json; search tools ignore them in the front matter and the two copies drift apart.' },
      { file: 3, lines: [8], name: 'Script address has no version', severity: 'display',
        why: 'Without a version the CDN serves the newest p5.js release, so the sketch can draw differently or stop running when the library updates.' }
    ]
  },
  {
    folder: 'docs/sims/ohms-law-explorer/',
    files: [
      { name: 'ohms-law-explorer/', kind: 'dir', lines: [
        'docs/sims/ohms-law-explorer/',
        '    index.md',
        '    main.html',
        '    metadata.json',
        '    ohms-law-explorer.js'] },
      { name: 'index.md', lines: [
        '---',
        "title: Ohm's Law Explorer",
        'description: Drag the voltage and resistance sliders and watch the current.',
        'quality_score: 88',
        'image: /sims/ohms-law-explorer/ohms-law-explorer.png',
        'og:image: /sims/ohms-law-explorer/ohms-law-explorer.png',
        'twitter:image: /sims/ohms-law-explorer/ohms-law-explorer.png',
        'social:',
        '   cards: false',
        '---',
        "# Ohm's Law Explorer",
        '',
        '<iframe src="main.html" height="560px" width="100%" scrolling="no"></iframe>'] },
      { name: 'main.html', lines: [
        '<!DOCTYPE html>',
        '<html lang="en">',
        '<head>',
        '  <meta charset="UTF-8">',
        '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        "  <title>Ohm's Law Explorer using p5.js 2.3.2</title>",
        '  <script src="https://cdn.jsdelivr.net/npm/p5@2.3.2/lib/p5.js"></script>',
        '  <script src="ohms-law-explorer.js"></script>',
        '</head>',
        '<body>',
        '  <main></main>',
        '  <a href=".">Back to Documentation</a>',
        '</body>',
        '</html>'] },
      { name: 'metadata.json', lines: [
        '{',
        '  "microsim": {',
        '    "dublinCore": {',
        '      "title": "Ohm\'s Law Explorer",',
        '      "creator": ["Dan McCreary"],',
        '      "subject": ["Electricity", "Ohm\'s Law"],',
        '      "rights": "CC BY-NC-SA 4.0"',
        '    },',
        '    "technical": {',
        '      "framework": "p5.js",',
        '      "canvasDimensions": { "height": 530 },',
        '      "dependencies": ["p5.js 2.3.2 (jsDelivr CDN)"]',
        '    }',
        '  }',
        '}'] },
      { name: 'ohms-law-explorer.js', lines: [
        "// Ohm's Law Explorer",
        '// CANVAS_HEIGHT: 530',
        'let canvasWidth = 400;',
        'let drawHeight = 450;',
        'let controlHeight = 80;',
        'let canvasHeight = drawHeight + controlHeight;',
        '',
        'function setup() {',
        '  updateCanvasSize();',
        '  const canvas = createCanvas(canvasWidth, canvasHeight);',
        "  canvas.parent(document.querySelector('main'));",
        '}'] }
    ],
    defects: [
      { file: 2, lines: [3, 4, 5, 9], name: 'Missing schema meta tag', severity: 'discovery',
        why: 'Without <meta name="schema" ...> code search cannot count or discover this MicroSim.' },
      { file: 1, lines: [13], name: 'Iframe height is not CANVAS_HEIGHT + 2', severity: 'cosmetic',
        why: '530 + 2 = 532, so a 560 px iframe leaves 28 px of blank space under the MicroSim: untidy, but nothing is hidden.' },
      { file: 1, lines: [5, 6, 7], name: 'Preview image is missing', severity: 'discovery',
        why: 'The front matter points to ohms-law-explorer.png, which is not in the directory, so the gallery thumbnail and social preview are blank.' }
    ]
  },
  {
    folder: 'docs/sims/wave-interference/',
    files: [
      { name: 'wave-interference/', kind: 'dir', lines: [
        'docs/sims/wave-interference/',
        '    index.md',
        '    main.html',
        '    metadata.json',
        '    wave-interference.js',
        '    wave-interference.png'] },
      { name: 'index.md', lines: [
        '---',
        'title: Wave Interference',
        'description: Move two wave sources and watch where the waves add and cancel.',
        'subject: Physics',
        'date: 2026-09-30',
        'image: /sims/wave-interference/wave-interference.png',
        'og:image: /sims/wave-interference/wave-interference.png',
        'social:',
        '   cards: false',
        '---',
        '# Wave Interference',
        '',
        '<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>'] },
      { name: 'main.html', lines: [
        '<!DOCTYPE html>',
        '<html lang="en">',
        '<head>',
        '  <meta charset="UTF-8">',
        '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        '  <meta name="schema" content="https://dmccreary.github.io/intelligent-textbooks/ns/microsim/v1">',
        '  <title>Wave Interference MicroSim using p5.js</title>',
        '  <script src="https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.js"></script>',
        '  <script src="wave-interference.js"></script>',
        '</head>',
        '<body>',
        '  <main></main>',
        '</body>',
        '</html>'] },
      { name: 'metadata.json', lines: [
        '{',
        '  "microsim": {',
        '    "dublinCore": {',
        '      "title": "Wave Interference",',
        '      "subject": ["Physics", "Waves"],',
        '      "date": "2026-09-30"',
        '    },',
        '    "technical": {',
        '      "framework": "p5.js",',
        '      "canvasDimensions": { "height": 580 }',
        '    }',
        '  }',
        '}'] },
      { name: 'wave-interference.js', lines: [
        '// Wave Interference MicroSim',
        '// CANVAS_HEIGHT: 620',
        'let canvasWidth = 400;',
        'let drawHeight = 500;',
        'let controlHeight = 80;',
        'let canvasHeight = drawHeight + controlHeight;',
        '',
        'function setup() {',
        '  updateCanvasSize();',
        '  const canvas = createCanvas(canvasWidth, canvasHeight);',
        "  canvas.parent(document.querySelector('main'));",
        '}'] }
    ],
    defects: [
      { file: 2, lines: [8], name: 'Script address has a floating version', severity: 'display',
        why: 'p5@latest follows the newest release, so the sketch can break or change when p5.js updates; pin an exact version such as p5@2.3.2.' },
      { file: 4, lines: [2, 4, 5], name: 'CANVAS_HEIGHT is not drawHeight + controlHeight', severity: 'cosmetic',
        why: '500 + 80 = 580, not 620, so synced iframes would be 622 px and show 40 px of blank space: untidy but harmless.' },
      { file: 1, lines: [4, 5], name: 'Dublin Core fields in the front matter', severity: 'discovery',
        why: 'subject and date belong only in metadata.json; search tools read them there, not in the page header.' },
      { file: 1, lines: [13], name: 'Iframe height is not CANVAS_HEIGHT + 2', severity: 'display',
        why: 'The canvas is 580 px tall, so a 482 px iframe hides the bottom 100 px, including the whole control region.' }
    ]
  }
];

// ----- State -----
let order = [];            // shuffled order of sample indices
let orderPos = 0;          // position in that order
let sample;                // current sample object
let currentFile = 0;       // index of the open file, or -1 for the audit report
let flags = new Map();     // key "file:line" -> { file, line, severity }
let activeKey = null;      // flag whose severity the dropdown edits
let checked = false;       // has the audit been checked?
let result = null;         // results of the last check
let scrollY = 0;           // viewer scroll offset (px)
let contentH = 0;          // height of viewer content (px)

// geometry filled in each frame for hit testing
let treeItems = [];        // {x, y, w, h, file}
let viewer = { x: 0, y: 0, w: 0, h: 0 };
let rowLayout = [];        // {line, y, h} in content coordinates

// ----- Controls -----
let checkButton, nextButton, severitySelect;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  checkButton = createButton('Check audit');
  checkButton.position(10, drawHeight + 8);
  checkButton.mousePressed(checkAudit);

  nextButton = createButton('Next directory');
  nextButton.position(110, drawHeight + 8);
  nextButton.mousePressed(nextDirectory);

  severitySelect = createSelect();
  severitySelect.option('Severity of flag...', '');
  for (const s of SEVERITIES) severitySelect.option(s);
  severitySelect.position(232, drawHeight + 8);
  severitySelect.changed(setSeverity);

  order = shuffle([0, 1, 2]);
  loadSample(0);

  describe('MicroSim directory audit. A file tree of a sample MicroSim directory is on the ' +
    'left and a viewer showing the selected file\'s lines is on the right. The learner clicks ' +
    'lines to flag planted defects, rates each flag as cosmetic, discovery, display or breaks ' +
    'embedding, and presses Check audit to see which flags are correct, which are false alarms, ' +
    'which defects were missed, and why each defect matters.', LABEL);
}

function loadSample(pos) {
  orderPos = pos;
  sample = SAMPLES[order[orderPos]];
  currentFile = 0;
  flags = new Map();
  activeKey = null;
  checked = false;
  result = null;
  scrollY = 0;
  syncSelect();
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

  // Title
  noStroke();
  fill('black');
  textFont('sans-serif');
  textAlign(LEFT, TOP);
  textSize(20);
  text('MicroSim Directory Audit', margin, 10);
  textSize(14);
  fill('dimgray');
  textAlign(RIGHT, TOP);
  text('Directory ' + (orderPos + 1) + ' of ' + SAMPLES.length, canvasWidth - margin, 14);

  const narrow = canvasWidth < 600;
  let viewerTop;
  if (narrow) {
    viewerTop = drawTreeChips(40);
    viewer = { x: margin, y: viewerTop, w: canvasWidth - 2 * margin, h: drawHeight - viewerTop - 8 };
  } else {
    const treeW = 200;
    drawTree(margin, 42, treeW);
    viewer = { x: margin + treeW + 10, y: 42, w: canvasWidth - treeW - 3 * margin, h: drawHeight - 50 };
  }

  if (currentFile === -1) drawReport();
  else drawFile();

  drawScore();
}

// ---------------------------------------------------------------
// File tree (wide layout)
// ---------------------------------------------------------------
function drawTree(x, y, w) {
  treeItems = [];
  noStroke();
  fill('black');
  textSize(15);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  text('Files', x, y);
  textStyle(NORMAL);
  let yy = y + 24;
  for (let i = 0; i < sample.files.length; i++) {
    const f = sample.files[i];
    const indent = f.kind === 'dir' ? 0 : 16;
    treeItem(x, yy, w, 24, i, f.name, indent, f.kind === 'dir');
    yy += 26;
  }
  if (checked) {
    treeItem(x, yy, w, 24, -1, 'Audit report', 0, false, true);
    yy += 26;
  }

  // How-to text under the tree
  yy += 10;
  noStroke();
  fill('dimgray');
  textSize(13);
  textAlign(LEFT, TOP);
  const help = 'Click a file to open it. Click a line to flag it as a defect; click it again ' +
    'to unflag. Choose the flag\'s severity in the dropdown below. Something missing? ' +
    'Flag the line where it belongs or the line that points to it.';
  text(help, x, yy, w - 4);
}

function treeItem(x, y, w, h, fileIdx, label, indent, isDir, isReport) {
  const selected = currentFile === fileIdx;
  const hover = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  noStroke();
  if (selected) fill('lightsteelblue');
  else if (hover) fill(225, 235, 245);
  else noFill();
  rect(x, y, w, h, 4);
  // icon
  const ix = x + 6 + indent;
  if (isReport) {
    fill('seagreen');
    rect(ix, y + 6, 12, 13, 2);
  } else if (isDir) {
    fill('goldenrod');
    rect(ix, y + 7, 14, 11, 2);
    rect(ix, y + 5, 6, 4, 1);
  } else {
    stroke('gray');
    fill('white');
    rect(ix + 1, y + 5, 10, 14, 1);
  }
  noStroke();
  fill(isReport ? 'seagreen' : 'black');
  textSize(14);
  textAlign(LEFT, CENTER);
  text(label, ix + 20, y + h / 2);
  // number of flags in this file
  const n = flagsInFile(fileIdx);
  if (n > 0 && fileIdx >= 0) {
    fill('darkorange');
    textAlign(RIGHT, CENTER);
    text(n + (n === 1 ? ' flag' : ' flags'), x + w - 4, y + h / 2);
  }
  treeItems.push({ x, y, w, h, file: fileIdx });
}

// ---------------------------------------------------------------
// File chips (narrow layout): returns the y below the chips
// ---------------------------------------------------------------
function drawTreeChips(y) {
  treeItems = [];
  textSize(13);
  let x = margin;
  let yy = y;
  const items = sample.files.map((f, i) => ({ label: f.name, file: i }));
  if (checked) items.push({ label: 'Audit report', file: -1 });
  for (const it of items) {
    const n = flagsInFile(it.file);
    const label = it.label + (n > 0 && it.file >= 0 ? ' (' + n + ')' : '');
    const w = fontWidth(label) + 16;
    if (x + w > canvasWidth - margin) {
      x = margin;
      yy += 28;
    }
    const selected = currentFile === it.file;
    stroke('silver');
    fill(selected ? 'lightsteelblue' : 'white');
    rect(x, yy, w, 24, 12);
    noStroke();
    fill(it.file === -1 ? 'seagreen' : 'black');
    textAlign(CENTER, CENTER);
    text(label, x + w / 2, yy + 12);
    treeItems.push({ x, y: yy, w, h: 24, file: it.file });
    x += w + 6;
  }
  return yy + 32;
}

function flagsInFile(fileIdx) {
  let n = 0;
  for (const f of flags.values()) if (f.file === fileIdx) n++;
  return n;
}

// ---------------------------------------------------------------
// File viewer
// ---------------------------------------------------------------
function drawFile() {
  const f = sample.files[currentFile];
  drawViewerFrame(f.kind === 'dir' ? 'Directory listing: ' + sample.folder : f.name);

  textFont('monospace');
  textSize(codeSize);
  const textW = viewer.w - gutterW - 16 - 108; // room on the right for severity tags
  const charW = fontWidth('M');
  const maxChars = max(12, floor(textW / charW));

  // Lay out wrapped rows in content coordinates
  rowLayout = [];
  let cy = 4;
  for (let i = 0; i < f.lines.length; i++) {
    const parts = wrapCode(f.lines[i], maxChars);
    rowLayout.push({ line: i + 1, y: cy, h: parts.length * rowH, parts });
    cy += parts.length * rowH;
  }
  contentH = cy + 6;
  clampScroll();

  // Clip to the viewer body
  const bodyTop = viewer.y + 28;
  const bodyH = viewer.h - 28;
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(viewer.x, bodyTop, viewer.w, bodyH);
  drawingContext.clip();

  for (const r of rowLayout) {
    const y = bodyTop + r.y - scrollY;
    if (y + r.h < bodyTop || y > bodyTop + bodyH) continue;
    const flagKey = currentFile + ':' + r.line;
    const flag = flags.get(flagKey);
    const hover = mouseInViewerBody() && mouseY >= y && mouseY < y + r.h;
    const status = lineStatus(currentFile, r.line, flag);

    // row background
    noStroke();
    if (status === 'correct') fill('honeydew');
    else if (status === 'false') fill('mistyrose');
    else if (flag) fill('lemonchiffon');
    else if (hover) fill(235, 242, 250);
    else noFill();
    rect(viewer.x + 1, y, viewer.w - 2, r.h);

    // missed defect outline
    if (status === 'missed') {
      drawingContext.save();
      drawingContext.setLineDash([4, 3]);
      stroke('red');
      strokeWeight(1.5);
      noFill();
      rect(viewer.x + 3, y + 1, viewer.w - 6, r.h - 2, 3);
      drawingContext.restore();
    }
    // active flag outline
    if (flag && flagKey === activeKey) {
      stroke('darkorange');
      strokeWeight(2);
      noFill();
      rect(viewer.x + 2, y + 1, viewer.w - 4, r.h - 2, 3);
    }

    // gutter: line number and flag marker
    noStroke();
    fill('gray');
    textFont('monospace');
    textSize(codeSize);
    textAlign(RIGHT, TOP);
    text(r.line, viewer.x + gutterW - 4, y + 3);
    if (flag) drawFlagIcon(viewer.x + gutterW + 2, y + 3, status);

    // code text
    fill('black');
    textAlign(LEFT, TOP);
    for (let k = 0; k < r.parts.length; k++) {
      text(r.parts[k], viewer.x + gutterW + 16, y + 3 + k * rowH);
    }

    // right-side tag: severity or status
    // (the row color and flag color already show correct / false alarm)
    let tag = '';
    let tagCol = 'dimgray';
    if (flag) {
      tag = flag.severity || 'rate it';
      if (status === 'correct') tagCol = 'green';
      else if (status === 'false') { tag = 'false alarm'; tagCol = 'firebrick'; }
      else if (!flag.severity) tagCol = 'darkorange';
    } else if (status === 'missed') { tag = 'missed'; tagCol = 'red'; }
    if (tag) {
      textFont('sans-serif');
      textSize(12);
      textAlign(RIGHT, TOP);
      fill(tagCol);
      text(tag, viewer.x + viewer.w - 6, y + 4);
    }
  }
  drawingContext.restore();
  textFont('sans-serif');
  drawScrollHint(bodyTop, bodyH);
}

function drawViewerFrame(title) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(viewer.x, viewer.y, viewer.w, viewer.h, 6);
  noStroke();
  fill(232, 238, 245);
  rect(viewer.x + 1, viewer.y + 1, viewer.w - 2, 26, 6, 6, 0, 0);
  fill('black');
  textFont('sans-serif');
  textSize(14);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  let t = title;
  while (fontWidth(t) > viewer.w - 16 && t.length > 4) t = t.slice(0, -2);
  text(t, viewer.x + 8, viewer.y + 14);
  textStyle(NORMAL);
}

function drawFlagIcon(x, y, status) {
  let col = 'darkorange';
  if (status === 'correct') col = 'green';
  if (status === 'false') col = 'firebrick';
  stroke(col);
  strokeWeight(2);
  line(x, y, x, y + 13);
  noStroke();
  fill(col);
  triangle(x, y, x + 9, y + 3.5, x, y + 7);
}

function drawScrollHint(bodyTop, bodyH) {
  if (contentH <= bodyH) return;
  noStroke();
  fill('steelblue');
  textSize(12);
  textAlign(RIGHT, BOTTOM);
  const more = scrollY + bodyH < contentH - 2;
  const hint = more ? 'scroll for more ▼' : '▲ top';
  fill(255, 255, 255, 235);
  rect(viewer.x + viewer.w - fontWidth(hint) - 16, bodyTop + bodyH - 18, fontWidth(hint) + 12, 17, 4);
  fill('steelblue');
  text(hint, viewer.x + viewer.w - 8, bodyTop + bodyH - 2);
}

// Wrap a code line to rows of at most n characters, indenting continuations
function wrapCode(s, n) {
  if (s.length <= n) return [s];
  const out = [];
  let rest = s;
  let first = true;
  while (rest.length > 0) {
    const room = first ? n : n - 2;
    let cut = rest.length <= room ? rest.length : rest.lastIndexOf(' ', room);
    if (cut <= room * 0.4) cut = min(room, rest.length);
    out.push((first ? '' : '  ') + rest.slice(0, cut));
    rest = rest.slice(cut).replace(/^ /, '');
    first = false;
  }
  return out;
}

// Status of a line after checking: 'correct', 'false', 'missed', or ''
function lineStatus(fileIdx, line, flag) {
  if (!checked || !result) return '';
  const d = defectAt(fileIdx, line);
  if (flag) return d >= 0 ? 'correct' : 'false';
  if (d >= 0 && !result.found.has(d) && sample.defects[d].lines[0] === line) return 'missed';
  return '';
}

function defectAt(fileIdx, line) {
  for (let i = 0; i < sample.defects.length; i++) {
    const d = sample.defects[i];
    if (d.file === fileIdx && d.lines.includes(line)) return i;
  }
  return -1;
}

// ---------------------------------------------------------------
// Audit report
// ---------------------------------------------------------------
function drawReport() {
  drawViewerFrame('Audit report: ' + sample.folder);
  const bodyTop = viewer.y + 28;
  const bodyH = viewer.h - 28;
  const x = viewer.x + 10;
  const w = viewer.w - 20;

  // Build the report as blocks of wrapped text
  const blocks = [];
  blocks.push({ t: 'Found ' + result.found.size + ' of ' + sample.defects.length + ' defects', style: 'head', col: 'black' });
  for (const [d, flag] of result.found) {
    const def = sample.defects[d];
    const ok = flag.severity === def.severity;
    blocks.push({ t: '✓ ' + sample.files[def.file].name + ' line ' + flag.line + ': ' + def.name, style: 'bold', col: 'green' });
    const rated = flag.severity ? 'You rated it ' + flag.severity : 'You did not rate it';
    blocks.push({ t: rated + '; the rubric says ' + def.severity + (ok ? ' ✓' : ' ✗'), style: 'normal', col: ok ? 'green' : 'firebrick' });
    blocks.push({ t: def.why, style: 'normal', col: 'black' });
  }
  if (result.falseAlarms.length > 0) {
    blocks.push({ t: 'False alarms: ' + result.falseAlarms.length, style: 'head', col: 'black' });
    for (const fa of result.falseAlarms) {
      blocks.push({ t: '✗ ' + sample.files[fa.file].name + ' line ' + fa.line + ' follows the conventions.', style: 'normal', col: 'firebrick' });
    }
  }
  const missed = sample.defects.map((d, i) => i).filter(i => !result.found.has(i));
  if (missed.length > 0) {
    blocks.push({ t: 'Still missing: ' + missed.length + ' (outlined in red in the files)', style: 'head', col: 'black' });
    for (const i of missed) {
      const d = sample.defects[i];
      blocks.push({ t: '• ' + sample.files[d.file].name + ': ' + d.name, style: 'normal', col: 'red' });
    }
  } else {
    blocks.push({ t: 'No defects missed.', style: 'head', col: 'green' });
  }
  blocks.push({ t: 'Severity rubric', style: 'head', col: 'black' });
  for (const s of SEVERITIES) blocks.push({ t: s + ': ' + RUBRIC[s], style: 'normal', col: 'dimgray' });

  // Measure and draw with clipping and scrolling
  textFont('sans-serif');
  textSize(14);
  const lineH = 18;
  let cy = 6;
  const laid = [];
  for (const b of blocks) {
    textStyle(b.style === 'normal' ? NORMAL : BOLD);
    const lines = wrapWords(b.t, w);
    const gapBefore = b.style === 'head' ? 8 : 0;
    laid.push({ b, lines, y: cy + gapBefore });
    cy += gapBefore + lines.length * lineH + 2;
  }
  textStyle(NORMAL);
  contentH = cy + 6;
  clampScroll();

  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(viewer.x, bodyTop, viewer.w, bodyH);
  drawingContext.clip();
  noStroke();
  textAlign(LEFT, TOP);
  for (const L of laid) {
    textStyle(L.b.style === 'normal' ? NORMAL : BOLD);
    fill(L.b.col);
    for (let k = 0; k < L.lines.length; k++) {
      const indent = L.b.style === 'normal' && !L.b.t.startsWith('✗') && !L.b.t.startsWith('•') ? 16 : 0;
      text(L.lines[k], x + indent, bodyTop + L.y + k * lineH - scrollY);
    }
  }
  textStyle(NORMAL);
  drawingContext.restore();
  drawScrollHint(bodyTop, bodyH);
}

// Word wrap using the current text settings
function wrapWords(s, w) {
  const words = s.split(' ');
  const lines = [];
  let cur = '';
  for (const word of words) {
    const test = cur ? cur + ' ' + word : word;
    if (fontWidth(test) > w - 20 && cur) {
      lines.push(cur);
      cur = word;
    } else cur = test;
  }
  if (cur) lines.push(cur);
  return lines;
}

// ---------------------------------------------------------------
// Score line in the control region
// ---------------------------------------------------------------
function drawScore() {
  noStroke();
  textFont('sans-serif');
  const narrow = canvasWidth < 600;
  textSize(narrow ? 15 : defaultTextSize);
  textAlign(LEFT, CENTER);
  const y = drawHeight + 56;
  if (!checked) {
    fill('black');
    const n = flags.size;
    text('Flags placed: ' + n + (narrow ? '. Rate them, then Check audit.' :
      '. Rate each flag, then press Check audit.'), 10, y);
  } else {
    fill('navy');
    textStyle(BOLD);
    const sep = narrow ? ' | ' : '  |  ';
    text('Found ' + result.found.size + ' of ' + sample.defects.length +
      sep + 'False alarms ' + result.falseAlarms.length +
      sep + (narrow ? 'Ratings ' : 'Ratings correct ') + result.ratingsCorrect + ' of ' + result.found.size, 10, y);
    textStyle(NORMAL);
  }
}

// ---------------------------------------------------------------
// Actions
// ---------------------------------------------------------------
function checkAudit() {
  const found = new Map();   // defect index -> flag that found it
  const falseAlarms = [];
  const sorted = [...flags.values()].sort((a, b) => a.file - b.file || a.line - b.line);
  for (const f of sorted) {
    const d = defectAt(f.file, f.line);
    if (d < 0) falseAlarms.push(f);
    else if (!found.has(d) || (!found.get(d).severity && f.severity)) found.set(d, f);
  }
  let ratingsCorrect = 0;
  for (const [d, f] of found) if (f.severity === sample.defects[d].severity) ratingsCorrect++;
  result = { found, falseAlarms, ratingsCorrect };
  checked = true;
  currentFile = -1;
  scrollY = 0;
}

function nextDirectory() {
  let pos = orderPos + 1;
  if (pos >= order.length) {
    order = shuffle([0, 1, 2]);
    pos = 0;
  }
  loadSample(pos);
}

function setSeverity() {
  if (activeKey && flags.has(activeKey)) {
    flags.get(activeKey).severity = severitySelect.value();
  }
}

function syncSelect() {
  if (activeKey && flags.has(activeKey)) {
    severitySelect.removeAttribute('disabled');
    severitySelect.selected(flags.get(activeKey).severity || '');
  } else {
    severitySelect.selected('');
    severitySelect.attribute('disabled', '');
  }
}

function mouseInViewerBody() {
  return mouseX > viewer.x && mouseX < viewer.x + viewer.w &&
    mouseY > viewer.y + 28 && mouseY < viewer.y + viewer.h;
}

function mousePressed() {
  if (mouseY > drawHeight || mouseY < 0) return;
  // tree items
  for (const it of treeItems) {
    if (mouseX > it.x && mouseX < it.x + it.w && mouseY > it.y && mouseY < it.y + it.h) {
      currentFile = it.file;
      scrollY = 0;
      return;
    }
  }
  // lines in the viewer
  if (currentFile >= 0 && mouseInViewerBody()) {
    const cy = mouseY - (viewer.y + 28) + scrollY;
    for (const r of rowLayout) {
      if (cy >= r.y && cy < r.y + r.h) {
        const flagKey = currentFile + ':' + r.line;
        if (flags.has(flagKey)) {
          if (activeKey === flagKey) {
            flags.delete(flagKey);
            activeKey = null;
          } else activeKey = flagKey;
        } else {
          flags.set(flagKey, { file: currentFile, line: r.line, severity: '' });
          activeKey = flagKey;
        }
        syncSelect();
        return;
      }
    }
  }
}

// Scroll the viewer only when its content overflows and the mouse is over it
function mouseWheel(event) {
  const bodyH = viewer.h - 28;
  if (mouseInViewerBody() && contentH > bodyH) {
    scrollY += event.delta;
    clampScroll();
    return false;
  }
}

function keyPressed() {
  if (contentH <= viewer.h - 28) return;
  if (key === 'ArrowDown') { scrollY += rowH * 2; clampScroll(); return false; }
  if (key === 'ArrowUp') { scrollY -= rowH * 2; clampScroll(); return false; }
}

function clampScroll() {
  const bodyH = viewer.h - 28;
  scrollY = constrain(scrollY, 0, max(0, contentH - bodyH));
}

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
