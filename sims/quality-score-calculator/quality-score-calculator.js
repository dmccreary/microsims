// Quality Score Calculator - p5.js MicroSim
// CANVAS_HEIGHT: 620
// Learning objective (Apply / calculate): the learner calculates the quality score and grade of a
// MicroSim by ticking the rubric checks it satisfies, and identifies the cheapest change that
// reaches the 85 threshold.
// The rubric and its gates copy validate-sims.py (microsim-utils):
//   main.html 10 = exists 5 + schema meta tag 3 + <main> 2 (schema and <main> need the file)
//   metadata.json 30 = present 10 + core fields (10 if 0-1 missing, 5 if 2-3, 0 if 4-5)
//                      + educational 5 + pedagogical 5 (all need the file)
//   index.md 35 = title 2 + YAML title/description 3 + social images 5 + iframe 10
//                 + fullscreen 5 + copy-paste example 5 + description/about 5
//   screenshot 5, Lesson Plan 10, References 5
//   p5.js conventions 5 = updateCanvasSize 2 + built-in controls 2 + parent to main 1;
//   non-p5 MicroSims, and folders with no main.html (library unknown), receive all 5.
// Grades: A 85+, B 70-84, C 50-69, D below 50.

// ---------- canvas dimensions ----------
let canvasWidth = 700;
let drawHeight = 540;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

// ---------- rubric ----------
const GROUPS = [
  { key: 'main', name: 'main.html', max: 10 },
  { key: 'meta', name: 'metadata.json', max: 30 },
  { key: 'index', name: 'index.md structure', max: 35 },
  { key: 'shot', name: 'Screenshot', max: 5 },
  { key: 'lesson', name: 'Lesson plan', max: 10 },
  { key: 'refs', name: 'References', max: 5 },
  { key: 'p5', name: 'p5.js conventions', max: 5 }
];
// id, group, label, points, what the validator looks for
const CHECKS = [
  ['m1', 'main', 'File exists', 5, 'a file named main.html in the MicroSim folder'],
  ['m2', 'main', 'Schema meta tag', 3, 'the text name="schema" and the word intelligent-textbooks in main.html'],
  ['m3', 'main', '&lt;main&gt; element', 2, 'the text "<main>" or "<main " anywhere in main.html'],
  ['d1', 'meta', 'File present', 10, 'a file named metadata.json (if its JSON is invalid, only these 10 points count)'],
  ['d2', 'meta', 'Educational section', 5, 'an "educational" block at the top level of metadata.json or inside dublinCore'],
  ['d3', 'meta', 'Pedagogical section', 5, 'a "pedagogical" block at the top level of metadata.json or inside dublinCore'],
  ['i1', 'index', 'Level 1 title', 2, 'a line starting with "# " below the YAML header of index.md'],
  ['i2', 'index', 'YAML title + description', 3, 'both title: and description: in the YAML header'],
  ['i3', 'index', 'YAML social images', 5, 'image: (or og:image) in the YAML header'],
  ['i4', 'index', 'Iframe src="main.html"', 10, 'an <iframe> tag whose src is exactly "main.html"'],
  ['i5', 'index', 'Fullscreen link', 5, 'a Markdown link whose text contains "Fullscreen" or "Run" and whose target contains main.html'],
  ['i6', 'index', 'Copy-paste iframe example', 5, 'a fenced code block (``` or ```html) that contains <iframe and main.html'],
  ['i7', 'index', 'Description or About', 5, 'a level 2 heading named Description, About, Overview, How to Use or Introduction'],
  ['s1', 'shot', 'PNG screenshot', 5, 'any .png file in the folder except favicon.png and icon.png'],
  ['l1', 'lesson', 'Lesson Plan heading', 10, 'a level 2 heading that begins "Lesson Plan"'],
  ['r1', 'refs', 'References heading', 5, 'a level 2 heading that begins "References"'],
  ['p1', 'p5', 'updateCanvasSize used', 2, 'the text updateCanvasSize anywhere in the folder\'s .js files'],
  ['p2', 'p5', 'Built-in controls', 2, 'createButton, createSlider, createCheckbox, createSelect, createInput or createRadio, or no mouse hit-testing at all'],
  ['p3', 'p5', 'Canvas parented to main', 1, 'document.querySelector and \'main\' in the .js files'],
  ['np', 'p5', 'Not a p5.js MicroSim', 0, 'the library detected from main.html; any library other than p5.js receives all 5 points']
];
const CORE_OPTIONS = ['0-1', '2-3', '4-5'];
const CORE_POINTS = { '0-1': 10, '2-3': 5, '4-5': 0 };
const CORE_HELP = 'non-empty title, description, creator, date and subject: 10 points if at most one is ' +
  'missing, 5 if two or three are, 0 otherwise';

const PRESETS = {
  'Bouncing Ball (score 82)': { off: ['m2', 'd2', 'i7', 'r1', 'np'], core: '0-1' },
  'A-star (score 74)': { off: ['m2', 'd2', 'i3', 'i2', 'i6', 'np'], core: '2-3' },
  'Blank folder': { off: CHECKS.map(c => c[0]), core: '4-5' }
};

const BANDS = [
  { g: 'A', lo: 85, range: '85 and above', action: 'Confirm and carry over when a chapter adopts it', n: 18, col: 'green' },
  { g: 'B', lo: 70, range: '70 to 84', action: 'Close to the bar; fix the listed issues', n: 27, col: 'royalblue' },
  { g: 'C', lo: 50, range: '50 to 69', action: 'Substantial work; rebuild from a specification if cheaper', n: 30, col: 'darkgoldenrod' },
  { g: 'D', lo: 0, range: 'under 50', action: 'Likely rebuild or drop', n: 41, col: 'firebrick' }
];

// ---------- controls ----------
let boxes = {};          // id -> p5 checkbox in the rubric list
let coreSelect;          // "Core fields missing"
let exampleSelect, suggestButton, gateCheckbox;

// ---------- state ----------
let suggestion = null;   // {ids, delta, score, steps}
let showBands = false;
let hoverHelp = null;    // {text, y}
let rowGeom = [];        // layout rows (for drawing and hover)
let gradeRect = null;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  CHECKS.forEach(c => {
    const cb = createCheckbox(c[2], false);
    cb.parent(document.querySelector('main'));
    cb.changed(onChange);
    cb.elt.title = 'Validator looks for ' + c[4];
    cb.elt.addEventListener('mouseenter', () => { hoverHelp = { id: c[0] }; });
    cb.elt.addEventListener('mouseleave', () => { hoverHelp = null; });
    boxes[c[0]] = cb;
  });
  coreSelect = createSelect();
  coreSelect.parent(document.querySelector('main'));
  CORE_OPTIONS.forEach(o => coreSelect.option(o));
  coreSelect.changed(onChange);
  coreSelect.elt.addEventListener('mouseenter', () => { hoverHelp = { id: 'core' }; });
  coreSelect.elt.addEventListener('mouseleave', () => { hoverHelp = null; });

  exampleSelect = createSelect();
  exampleSelect.parent(document.querySelector('main'));
  Object.keys(PRESETS).forEach(k => exampleSelect.option(k));
  exampleSelect.changed(loadExample);
  exampleSelect.style('font-size', '15px');

  suggestButton = createButton('Suggest cheapest fix');
  suggestButton.parent(document.querySelector('main'));
  suggestButton.mousePressed(suggestFix);
  suggestButton.style('font-size', '15px');

  gateCheckbox = createCheckbox('Show gate line', true);
  gateCheckbox.parent(document.querySelector('main'));
  gateCheckbox.style('font-size', '15px');

  loadExample();
  positionControls();

  describe('Quality Score Calculator. The rubric checks of validate-sims.py are listed under seven ' +
    'group headings with their point values: main.html 10, metadata.json 30, index.md 35, ' +
    'screenshot 5, lesson plan 10, references 5 and p5.js conventions 5. Ticking a check adds its ' +
    'points to a large score readout, a bar from 0 to 100 with ticks at 50, 70 and 85, and a grade ' +
    'letter. Load example sets Bouncing Ball (82), A-star (74) or a blank folder; Suggest cheapest ' +
    'fix highlights the unticked check worth the most points.', LABEL);
}

// ---------- scoring (mirrors validate-sims.py) ----------
function currentState() {
  const st = {};
  CHECKS.forEach(c => { st[c[0]] = boxes[c[0]].checked(); });
  st.core = coreSelect.value();
  return st;
}

function groupScores(st) {
  const g = {};
  g.main = st.m1 ? 5 + (st.m2 ? 3 : 0) + (st.m3 ? 2 : 0) : 0;
  g.meta = st.d1 ? 10 + CORE_POINTS[st.core] + (st.d2 ? 5 : 0) + (st.d3 ? 5 : 0) : 0;
  g.index = (st.i1 ? 2 : 0) + (st.i2 ? 3 : 0) + (st.i3 ? 5 : 0) + (st.i4 ? 10 : 0) +
    (st.i5 ? 5 : 0) + (st.i6 ? 5 : 0) + (st.i7 ? 5 : 0);
  g.shot = st.s1 ? 5 : 0;
  g.lesson = st.l1 ? 10 : 0;
  g.refs = st.r1 ? 5 : 0;
  // no main.html: the script cannot tell the library, so it gives the benefit of the doubt
  g.p5 = (!st.m1 || st.np) ? 5 : (st.p1 ? 2 : 0) + (st.p2 ? 2 : 0) + (st.p3 ? 1 : 0);
  return g;
}

function totalScore(st) {
  const g = groupScores(st);
  return Object.values(g).reduce((a, b) => a + b, 0);
}

function bandFor(score) { return BANDS.find(b => score >= b.lo); }

// is a check's point value currently counted? (gated rows are not)
function gateNote(id, st) {
  if (['m2', 'm3'].includes(id) && !st.m1) return 'needs main.html';
  if (['d2', 'd3'].includes(id) && !st.d1) return 'needs metadata.json';
  if (['p1', 'p2', 'p3'].includes(id) && (!st.m1 || st.np)) return st.np ? 'not p5.js' : 'no main.html';
  return '';
}

// ---------- handlers ----------
function onChange() { suggestion = null; }

function loadExample() {
  const p = PRESETS[exampleSelect.value()];
  CHECKS.forEach(c => boxes[c[0]].checked(!p.off.includes(c[0])));
  coreSelect.selected(p.core);
  suggestion = null;
  showBands = false;
}

// candidate single fixes: every unticked check (except the library toggle) and a better core-field
// count; the best are those that raise the score the most
function candidates(st) {
  const out = [];
  CHECKS.forEach(c => {
    if (c[0] === 'np' || st[c[0]]) return;
    const t = Object.assign({}, st);
    t[c[0]] = true;
    out.push({ ids: [c[0]], label: c[2].replace('&lt;', '<').replace('&gt;', '>'), delta: totalScore(t) - totalScore(st), next: t });
  });
  if (st.core !== '0-1') {
    const t = Object.assign({}, st, { core: '0-1' });
    out.push({ ids: ['core'], label: 'Core fields (fill them in)', delta: totalScore(t) - totalScore(st), next: t });
  }
  return out;
}

function suggestFix() {
  const st = currentState();
  const now = totalScore(st);
  const cands = candidates(st).filter(c => c.delta > 0);
  if (cands.length === 0) {
    const t = now === 100 ? 'Nothing to fix: the score is already 100.'
      : 'No single tick raises the score (the remaining checks are gated).';
    suggestion = { ids: [], text: t, short: t };
    return;
  }
  const best = max(cands.map(c => c.delta));
  const top = cands.filter(c => c.delta === best);
  // fewest fixes to reach 85: apply the largest gain repeatedly
  let s = st, steps = 0, sc = now;
  while (sc < 85 && steps < 25) {
    const cs = candidates(s).filter(c => c.delta > 0);
    if (!cs.length) break;
    const b = cs.reduce((a, c) => (c.delta > a.delta ? c : a));
    s = b.next; sc = totalScore(s); steps++;
  }
  let reach;
  if (now >= 85) reach = 'Already at or above 85.';
  else if (sc >= 85) reach = 'Fewest fixes to reach 85: ' + steps + '.';
  else reach = '85 cannot be reached with these checks.';
  const names = top.map(c => c.label);
  const head = top.length === 1
    ? 'Cheapest fix: ' + names[0] + ' (+' + best + ') gives ' + (now + best) + '.'
    : 'Tied at +' + best + ' each: ' + names.join(', ') + '. Any one gives ' + (now + best) + '.';
  const short = (top.length === 1 ? 'Cheapest: ' + names[0] : top.length + ' fixes tie (highlighted)') +
    ': +' + best + ' gives ' + (now + best) + '. ' + reach;
  suggestion = { ids: top.flatMap(c => c.ids), text: head + ' ' + reach, short: short };
}

// ---------- layout ----------
function isNarrow() { return canvasWidth < 500; }

function computeRows() {
  const narrow = isNarrow();
  const headH = narrow ? 16 : 24, rowH = narrow ? 15 : 22;
  const listW = narrow ? canvasWidth - 2 * margin : floor(canvasWidth * 0.63);
  const rows = [];
  const place = (groupKeys, x, y0, w) => {
    let y = y0;
    groupKeys.forEach(k => {
      rows.push({ type: 'head', group: k, x: x, y: y, w: w, h: headH });
      y += headH;
      CHECKS.filter(c => c[1] === k).forEach(c => {
        rows.push({ type: 'check', id: c[0], x: x, y: y, w: w, h: rowH });
        y += rowH;
        if (c[0] === 'd1') {
          rows.push({ type: 'core', id: 'core', x: x, y: y, w: w, h: rowH });
          y += rowH;
        }
      });
      y += narrow ? 1 : 4;
    });
  };
  if (narrow) {
    place(['main', 'meta', 'index', 'shot', 'lesson', 'refs', 'p5'], margin, 96, listW);
  } else {
    const colW = floor(listW / 2) - margin;
    place(['main', 'meta', 'shot', 'lesson', 'refs'], margin, 44, colW);
    place(['index', 'p5'], margin + colW + margin, 44, colW);
  }
  return rows;
}

function positionControls() {
  rowGeom = computeRows();
  const narrow = isNarrow();
  rowGeom.forEach(r => {
    if (r.type === 'check') {
      const cb = boxes[r.id];
      cb.position(r.x + 2, r.y + (narrow ? -2 : 2));
      cb.style('font-size', narrow ? '11px' : (canvasWidth < 760 ? '13px' : '14px'));
    } else if (r.type === 'core') {
      coreSelect.position(r.x + (narrow ? 132 : 140), r.y + (narrow ? -1 : 1));
      coreSelect.style('font-size', narrow ? '10px' : '13px');
    }
  });
  exampleSelect.position(118, drawHeight + 8);
  suggestButton.position(10, drawHeight + 44);
  gateCheckbox.position(190, drawHeight + 47);
}

// ---------- drawing ----------
function draw() {
  updateCanvasSize();
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const st = currentState();
  const g = groupScores(st);
  const score = totalScore(st);
  const narrow = isNarrow();

  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(narrow ? 18 : 22);
  text('Quality Score Calculator', margin, 8);
  textStyle(NORMAL);

  if (!(showBands && narrow)) drawRubric(st, g);
  if (narrow) drawReadoutStrip(score);
  else drawScorePanel(st, g, score);
  if (showBands && isNarrow()) drawNarrowBands(score);

  // control-region labels
  noStroke();
  fill('black');
  textSize(16);
  textAlign(LEFT, CENTER);
  text('Load example:', 10, drawHeight + 20);
}

function drawRubric(st, g) {
  const narrow = isNarrow();
  rowGeom.forEach(r => {
    if (r.type === 'head') {
      const grp = GROUPS.find(x => x.key === r.group);
      noStroke();
      fill('steelblue');
      rect(r.x, r.y + 2, r.w, r.h - 4, 4);
      fill('white');
      textStyle(BOLD);
      textSize(narrow ? 12 : 14);
      textAlign(LEFT, CENTER);
      text(grp.name, r.x + 6, r.y + r.h / 2);
      textAlign(RIGHT, CENTER);
      text(g[r.group] + ' / ' + grp.max, r.x + r.w - 6, r.y + r.h / 2);
      textStyle(NORMAL);
      return;
    }
    // suggestion highlight behind the row
    if (suggestion && suggestion.ids.includes(r.id)) {
      noStroke();
      fill('gold');
      rect(r.x, r.y, r.w, r.h, 3);
    }
    let pts = '', col = 'black';
    if (r.type === 'check') {
      const c = CHECKS.find(x => x[0] === r.id);
      const note = gateNote(r.id, st);
      if (r.id === 'np') { pts = st.np ? 'all 5' : ''; col = 'darkslateblue'; }
      else if (note) { pts = r.group === 'p5' || c[1] === 'p5' ? 'auto' : '(0)'; col = 'gray'; }
      else { pts = (st[r.id] ? '+' : '') + c[3]; col = st[r.id] ? 'darkgreen' : 'dimgray'; }
    } else if (r.type === 'core') {
      noStroke();
      fill(st.d1 ? 'black' : 'gray');
      textSize(narrow ? 12 : 14);
      textAlign(LEFT, CENTER);
      text('Core fields missing:', r.x + (narrow ? 6 : 8), r.y + r.h / 2);
      pts = st.d1 ? '+' + CORE_POINTS[st.core] : '(0)';
      col = st.d1 ? (CORE_POINTS[st.core] > 0 ? 'darkgreen' : 'dimgray') : 'gray';
    }
    noStroke();
    fill(col);
    textSize(narrow ? 11 : 13);
    textStyle(BOLD);
    textAlign(RIGHT, CENTER);
    text(pts, r.x + r.w - 4, r.y + r.h / 2);
    textStyle(NORMAL);
  });
}

// the bar from 0 to 100 with band ticks and the optional gate line
function drawBar(x, y, w, h, score) {
  const band = bandFor(score);
  stroke('gray');
  fill('white');
  rect(x, y, w, h, 3);
  noStroke();
  fill(band.col);
  rect(x, y, w * score / 100, h, 3);
  stroke('black');
  textSize(12);
  [0, 50, 70, 85, 100].forEach(t => {
    const tx = x + w * t / 100;
    stroke('black');
    line(tx, y + h, tx, y + h + 5);
    noStroke();
    fill('black');
    textAlign(CENTER, TOP);
    text(t, tx, y + h + 6);
  });
  if (gateCheckbox.checked()) {
    const gx = x + w * 0.85;
    stroke('crimson');
    strokeWeight(3);
    drawingContext.setLineDash([5, 3]);
    line(gx, y - 8, gx, y + h + 4);
    drawingContext.setLineDash([]);
    strokeWeight(1);
  }
}

function gateText(score) {
  if (score >= 85) {
    return 'Gate (85, carried over): PASS on score alone. It still needs width responsiveness, ' +
      'a correct iframe height and the visibility test.';
  }
  return 'Gate (85, carried over): FAIL, ' + (85 - score) + ' points short.' +
    (score >= 70 ? ' A new MicroSim would clear its 70 bar.' : '');
}

function drawScorePanel(st, g, score) {
  const listW = floor(canvasWidth * 0.63);
  const x = listW + 4, y = 44, w = canvasWidth - listW - 4 - margin, h = drawHeight - 44 - margin;
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 8);
  const band = bandFor(score);

  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(14);
  text('Quality score', x + 12, y + 10);
  textSize(54);
  textStyle(BOLD);
  text(score, x + 12, y + 28);
  const sw = fontWidth(String(score));
  textStyle(NORMAL);
  textSize(18);
  fill('dimgray');
  text('/ 100', x + 18 + sw, y + 58);

  // grade letter (click for the band table)
  const gs = 64;
  gradeRect = { x: x + w - gs - 12, y: y + 16, w: gs, h: gs };
  fill(band.col);
  rect(gradeRect.x, gradeRect.y, gs, gs, 10);
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(44);
  textStyle(BOLD);
  text(band.g, gradeRect.x + gs / 2, gradeRect.y + gs / 2 + 2);
  textStyle(NORMAL);
  fill('dimgray');
  textSize(12);
  text('click the grade', gradeRect.x + gs / 2, gradeRect.y + gs + 9);

  drawBar(x + 14, y + 112, w - 28, 18, score);

  // arithmetic by group
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(13);
  const parts = GROUPS.map(gr => g[gr.key]).join(' + ');
  text(parts + ' = ' + score, x + 12, y + 152, w - 24, 36);

  // band table replaces the lower panel while it is open
  if (showBands) {
    drawBandTable(score, x + 6, y + 150, w - 12, h - 156);
    return;
  }

  // gate status
  let yy = y + 190;
  if (gateCheckbox.checked()) {
    fill(score >= 85 ? 'darkgreen' : 'crimson');
    textStyle(BOLD);
    text(gateText(score), x + 12, yy, w - 24, 70);
    textStyle(NORMAL);
    yy += 72;
  }
  // suggestion
  if (suggestion) {
    stroke('goldenrod');
    fill('lightyellow');
    rect(x + 8, yy, w - 16, 94, 6);
    noStroke();
    fill('black');
    textSize(13);
    text(suggestion.text, x + 14, yy + 6, w - 28, 86);
  }
  // what the validator looks for (hovered row), pinned to the bottom of the panel
  const hy = y + h - 104;
  stroke('silver');
  fill('whitesmoke');
  rect(x + 8, hy, w - 16, 96, 6);
  noStroke();
  fill('black');
  textSize(13);
  textStyle(BOLD);
  text('What the validator looks for', x + 14, hy + 6, w - 28, 18);
  textStyle(NORMAL);
  fill(hoverHelp ? 'black' : 'dimgray');
  text(hoverHelp ? hoverText(st) : 'Hover a check or the Core fields menu.', x + 14, hy + 24, w - 28, 70);
}

// narrow layout: the readout moves above the one-column list
function drawReadoutStrip(score) {
  const band = bandFor(score);
  const x = margin, y = 32, w = canvasWidth - 2 * margin;
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(32);
  textStyle(BOLD);
  text(score, x, y);
  const sw = fontWidth(String(score));
  const gs = 34;
  gradeRect = { x: x + sw + 8, y: y + 1, w: gs, h: gs };
  fill(band.col);
  rect(gradeRect.x, gradeRect.y, gs, gs, 6);
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(24);
  text(band.g, gradeRect.x + gs / 2, gradeRect.y + gs / 2 + 1);
  textStyle(NORMAL);
  const bx = gradeRect.x + gs + 10;
  drawBar(bx, y + 4, w - (bx - x) - 6, 12, score);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(11);
  const st = currentState();
  let msg = '', col = 'black';
  if (hoverHelp) { msg = hoverText(st); col = 'black'; }
  else if (suggestion) { msg = suggestion.short; col = 'saddlebrown'; }
  else if (gateCheckbox.checked()) {
    msg = score >= 85 ? 'Gate 85: PASS on score alone' : 'Gate 85: FAIL, ' + (85 - score) + ' points short';
    col = score >= 85 ? 'darkgreen' : 'crimson';
  }
  fill(col);
  text(msg, x, y + 36, w, 26);
}

function hoverText(st) {
  if (hoverHelp.id === 'core') return 'Core fields: ' + CORE_HELP + '.';
  const c = CHECKS.find(q => q[0] === hoverHelp.id);
  let msg = c[4].charAt(0).toUpperCase() + c[4].slice(1) + '.';
  const note = gateNote(c[0], st);
  if (note) msg += ' Not counted now: ' + note + '.';
  return msg;
}

function drawBandTable(score, x, y, w, h) {
  stroke('dimgray');
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(13);
  textStyle(BOLD);
  text('Grade bands and the audit\'s recommended action', x + 8, y + 6, w - 16, 34);
  textStyle(NORMAL);
  const cur = bandFor(score).g;
  const rowH = min(62, (h - 64) / 4);
  BANDS.forEach((b, i) => {
    const ry = y + 42 + i * rowH;
    if (b.g === cur) { fill('lightyellow'); rect(x + 3, ry - 3, w - 6, rowH - 2, 4); }
    fill(b.col);
    rect(x + 8, ry, 24, 24, 4);
    fill('white');
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(15);
    text(b.g, x + 20, ry + 12);
    textStyle(NORMAL);
    fill('black');
    textAlign(LEFT, TOP);
    textSize(12);
    text(b.range + ', ' + b.n + ' MicroSims in the 2026-09-30 audit. ' + b.action + '.',
      x + 38, ry, w - 44, rowH - 4);
  });
  fill('dimgray');
  textSize(11);
  text('Click anywhere to close.', x + 8, y + h - 16);
}

// narrow layout: the list is full width, so the table covers it and the list controls hide
function drawNarrowBands(score) {
  drawBandTable(score, margin, 96, canvasWidth - 2 * margin, 300);
}

function setListVisible(v) {
  Object.values(boxes).forEach(b => (v ? b.show() : b.hide()));
  if (v) coreSelect.show(); else coreSelect.hide();
}

function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight || mouseX < 0 || mouseX > canvasWidth) return;
  if (showBands) { showBands = false; setListVisible(true); return; }
  const r = gradeRect;
  if (r && mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) {
    showBands = true;
    if (isNarrow()) setListVisible(false);
  }
}

// ---------- responsive design ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = max(320, container.offsetWidth);
}
