// Activity IRI Builder
// CANVAS_HEIGHT: 640
// Build the activity IRI that goes in object.id, following the producer
// contract of Chapter 16: canonical site_url (with a trailing slash) + the
// page's navigation path (with a trailing slash) + an optional fragment for a
// control, a diagram node or a question. Choose a mistake to see the offending
// segment turn red and one learner's visit split into two rows in a store.

// ---------- canvas layout ----------
let canvasWidth = 400;
let drawHeight = 460;
let controlHeight = 180;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let sliderLeftMargin = 132;   // left edge of the inputs and selects
let defaultTextSize = 16;

// ---------- controls ----------
let siteInput, resetButton, pathSelect, subSelect, nameInput, loadSelect, mistakeSelect;

// ---------- options ----------
const DEFAULT_SITE = 'https://dmccreary.github.io/microsims';
const PATHS = [
  'sims/bouncing-ball/',
  'chapters/01-what-is-a-microsim/',
  'chapters/16-xapi-statements-and-evidence/',
  'sims/metadata-section-explorer/',
  'sims/nav-status-icon-legend/'
];
const SUBS = ['none', 'control', 'node', 'fixed-order question', 'shuffled question'];
const SUB_DEFAULT_NAME = { none: '', control: 'Speed Slider', node: 'Dublin Core', 'fixed-order question': '3', 'shuffled question': 'nucleus' };
const LOADS = ['published site', 'local preview', 'iframe payload main.html'];
const MISTAKES = ['none', 'uses main.html', 'missing trailing slash', 'local origin',
  'zero-based question number', 'positional fragment for a shuffled quiz'];
const SEG_COLORS = { site: [70, 130, 180], path: [46, 139, 87], frag: [128, 0, 128] };

// ---------- state ----------
let segBoxes = [];
let ruleFor = null;   // 'site' | 'path' | 'frag' clicked by the learner

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  const mainEl = document.querySelector('main');

  siteInput = createInput(DEFAULT_SITE);
  siteInput.parent(mainEl);
  siteInput.attribute('aria-label', 'site_url from mkdocs.yml');
  siteInput.input(() => { ruleFor = 'site'; });

  resetButton = createButton('Reset');
  resetButton.parent(mainEl);
  resetButton.mousePressed(resetAll);

  pathSelect = createSelect();
  pathSelect.parent(mainEl);
  for (const p of PATHS) pathSelect.option(p);
  pathSelect.changed(() => { ruleFor = 'path'; });

  subSelect = createSelect();
  subSelect.parent(mainEl);
  for (const s of SUBS) subSelect.option(s);
  subSelect.changed(onSubChanged);

  nameInput = createInput('');
  nameInput.parent(mainEl);
  nameInput.attribute('aria-label', 'Name or number of the sub-activity');
  nameInput.input(() => { ruleFor = 'frag'; });

  loadSelect = createSelect();
  loadSelect.parent(mainEl);
  for (const l of LOADS) loadSelect.option(l);
  loadSelect.changed(() => { ruleFor = 'load'; });

  mistakeSelect = createSelect();
  mistakeSelect.parent(mainEl);
  for (const m of MISTAKES) mistakeSelect.option(m);
  mistakeSelect.changed(onMistakeChanged);

  for (const el of [siteInput, pathSelect, subSelect, nameInput, loadSelect, mistakeSelect]) el.style('font-size', '14px');
  onSubChanged();
  ruleFor = null;
  positionControls();

  describe('An activity IRI builder. The identifier for object.id is shown as colored segments: the ' +
    'site URL, the page path and an optional fragment. Controls set site_url, the page path, a ' +
    'sub-activity (control, node, fixed-order or shuffled question) with its name, where the page is ' +
    'loaded from, and an optional mistake. Clicking a segment explains its rule. A preview shows how ' +
    'a learning record store would group one learner\'s visit; a mistake splits it into two rows and ' +
    'turns the offending segment red.');
}

function positionControls() {
  const x = sliderLeftMargin;
  const y0 = drawHeight + 8;
  const avail = canvasWidth - x - 10;
  siteInput.position(x, y0);
  siteInput.style('width', (avail - 72) + 'px');
  resetButton.position(canvasWidth - 66, y0);
  pathSelect.position(x, y0 + 34);
  pathSelect.style('max-width', avail + 'px');
  subSelect.position(x, y0 + 68);
  const subW = min(170, floor(avail * 0.58));
  subSelect.style('width', subW + 'px');
  nameInput.position(x + subW + 8, y0 + 68);
  nameInput.style('width', (avail - subW - 14) + 'px');
  loadSelect.position(x, y0 + 102);
  loadSelect.style('max-width', avail + 'px');
  mistakeSelect.position(x, y0 + 136);
  mistakeSelect.style('max-width', avail + 'px');
}

function resetAll() {
  siteInput.value(DEFAULT_SITE);
  pathSelect.selected(PATHS[0]);
  subSelect.selected('none');
  loadSelect.selected(LOADS[0]);
  mistakeSelect.selected('none');
  onSubChanged();
  ruleFor = null;
}

function onSubChanged() {
  const s = subSelect.value();
  nameInput.value(SUB_DEFAULT_NAME[s]);
  if (s === 'none') nameInput.attribute('disabled', ''); else nameInput.removeAttribute('disabled');
  // a mistake that needs a different kind of sub-activity no longer applies
  const m = mistakeSelect.value();
  if ((m === 'zero-based question number' && s !== 'fixed-order question') ||
      (m === 'positional fragment for a shuffled quiz' && s !== 'shuffled question')) mistakeSelect.selected('none');
  ruleFor = 'frag';
}

// Some mistakes only make sense with a matching sub-activity or loading place
function onMistakeChanged() {
  const m = mistakeSelect.value();
  if (m === 'zero-based question number' && subSelect.value() !== 'fixed-order question') {
    subSelect.selected('fixed-order question');
    nameInput.value('3');
    nameInput.removeAttribute('disabled');
  }
  if (m === 'positional fragment for a shuffled quiz' && subSelect.value() !== 'shuffled question') {
    subSelect.selected('shuffled question');
    nameInput.value('nucleus');
    nameInput.removeAttribute('disabled');
  }
  if (m === 'uses main.html') loadSelect.selected('iframe payload main.html');
  if (m === 'local origin') loadSelect.selected('local preview');
  ruleFor = null;
}

// ---------- IRI construction ----------
function slugify(s) {
  return String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function siteBase() {
  let s = siteInput.value().trim();
  if (s && !s.endsWith('/')) s += '/';   // the runtime adds the trailing slash
  return s;
}

function sitePathPrefix() {
  // the path part of site_url, e.g. "/microsims/"
  const m = siteBase().match(/^https?:\/\/[^\/]+(\/.*)$/);
  return m ? m[1] : '/';
}

function fragmentFor(sub, name) {
  if (sub === 'none') return '';
  if (sub === 'control' || sub === 'node') return '#' + (slugify(name) || '?');
  if (sub === 'fixed-order question') {
    const n = parseInt(name, 10);
    return '#q' + (isNaN(n) ? '?' : n);
  }
  return '#q-' + (slugify(name) || '?');
}

function objectType(path, sub) {
  if (sub === 'control' || sub === 'node') return { name: 'Control', iri: 'http://adlnet.gov/expapi/activities/interaction' };
  if (sub.includes('question')) return { name: 'Question', iri: 'http://adlnet.gov/expapi/activities/cmi.interaction' };
  if (path.startsWith('sims/')) return { name: 'MicroSim', iri: 'http://adlnet.gov/expapi/activities/simulation' };
  return { name: 'Page', iri: 'http://adlnet.gov/expapi/activities/lesson' };
}

// Returns { correct:{site,path,frag}, shown:{site,path,frag}, bad:null|'site'|'path'|'frag', reason, rows }
function build() {
  const path = pathSelect.value();
  const sub = subSelect.value();
  const name = nameInput.value();
  const m = mistakeSelect.value();
  const correct = { site: siteBase(), path: path, frag: fragmentFor(sub, name) };
  const shown = Object.assign({}, correct);
  let bad = null, reason = '';
  const full = s => s.site + s.path + s.frag;
  const learner = 'student-0042';
  let rows = [{ iri: full(correct), n: 3, note: 'every statement from ' + learner + '\'s visit', bad: false }];

  if (m === 'uses main.html') {
    shown.path = path + 'main.html';
    bad = 'path';
    reason = 'main.html is the iframe payload. MkDocs renders the page at /' + path + ' and copies main.html beside it, so citing it gives one activity a second identifier.';
  } else if (m === 'missing trailing slash') {
    shown.path = path.replace(/\/$/, '');
    bad = 'path';
    reason = '.../' + path + ' and .../' + path.replace(/\/$/, '') + ' are different strings to a store that groups by identifier.';
  } else if (m === 'local origin') {
    shown.site = 'http://127.0.0.1:8000' + sitePathPrefix();
    bad = 'site';
    reason = 'The base must be the canonical site_url from mkdocs.yml, never the address the browser shows; preview traffic would name a different page.';
  } else if (m === 'zero-based question number') {
    const n = parseInt(name, 10);
    shown.frag = '#q' + (isNaN(n) ? '?' : n - 1);
    bad = 'frag';
    reason = 'Fixed-order questions are numbered as the learner sees them, from 1. Question ' + name + ' is #q' + name +
      '; #q' + (n - 1) + ' is another question\'s identifier.';
  } else if (m === 'positional fragment for a shuffled quiz') {
    shown.frag = '#q4';
    bad = 'frag';
    reason = 'A shuffled question moves on every reload, so its position is not an identity. Name it for what it asks about: #q-' + (slugify(name) || '?') + '.';
  }

  if (bad) {
    if (m === 'positional fragment for a shuffled quiz') {
      const base = correct.site + correct.path;
      rows = [
        { iri: base + '#q4', n: 1, note: 'load 1: the ' + (slugify(name) || '?') + ' question was 4th', bad: true },
        { iri: base + '#q2', n: 1, note: 'load 2: the same question was 2nd', bad: true }
      ];
    } else if (m === 'zero-based question number') {
      rows = [
        { iri: full(correct), n: 2, note: 'answers recorded by a one-based emitter', bad: false },
        { iri: full(shown), n: 1, note: 'the same question, numbered from zero', bad: true }
      ];
    } else {
      rows = [
        { iri: full(correct), n: 2, note: 'statements whose IRI came from the runtime\'s pageIri()', bad: false },
        { iri: full(shown), n: 1, note: 'the statement built by hand with the mistake', bad: true }
      ];
    }
  }
  return { correct, shown, bad, reason, rows, type: objectType(path, subSelect.value()), m };
}

function browserAddress() {
  const path = pathSelect.value();
  const where = loadSelect.value();
  if (where === 'local preview') return 'http://127.0.0.1:8000' + sitePathPrefix() + path;
  if (where === 'iframe payload main.html') {
    return siteBase() + path + (path.startsWith('sims/') ? 'main.html' : '');
  }
  return siteBase() + path;
}

// ---------- drawing ----------
function isWide() { return canvasWidth >= 500; }

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
  textSize(isWide() ? 22 : 20);
  text('Activity IRI Builder', canvasWidth / 2, 8);

  const B = build();
  const x = margin, w = canvasWidth - 2 * margin;
  let y = 40;

  // what the browser shows
  textAlign(LEFT, TOP);
  textSize(13);
  fill('dimgray');
  text('Browser address bar (' + loadSelect.value() + '):', x, y);
  y += 17;
  stroke('silver');
  fill('white');
  rect(x, y, w, 22, 11);
  noStroke();
  fill('black');
  textFont('monospace');
  textSize(12);
  text(fitMono(browserAddress(), w - 20), x + 10, y + 5);
  textFont('sans-serif');
  y += 32;

  // the IRI as colored segments
  textSize(14);
  textStyle(BOLD);
  fill('black');
  text('Activity IRI (object.id)', x, y);
  const labelW = fontWidth('Activity IRI (object.id)');
  textStyle(NORMAL);
  textSize(13);
  fill('dimgray');
  text('click a segment for its rule', x + labelW + 10, y + 1);
  y += 20;
  y = drawSegments(B, x, y, w) + 6;

  // object type
  textSize(13);
  fill('black');
  textAlign(LEFT, TOP);
  const typeTxt = 'Object type: ' + B.type.name + '  (' + B.type.iri.replace('http://adlnet.gov/expapi/activities/', '.../activities/') + ')';
  y += wrapText(typeTxt, x, y, w, 17) + 6;

  // rule or mistake panel
  y = drawRulePanel(B, x, y, w) + 8;

  // grouping preview
  drawGrouping(B, x, y, w, drawHeight - y - 8);
  drawControlLabels();
  cursor(segmentAt(mouseX, mouseY) ? HAND : ARROW);
}

// Draw site / path / fragment as colored boxes that wrap; returns the bottom y
function drawSegments(B, x, y, w) {
  segBoxes = [];
  textFont('monospace');
  const fs = isWide() ? 14 : 13;
  textSize(fs);
  const charW = fontWidth('M');
  const h = 26;
  let cx = x;
  const parts = [['site', B.shown.site], ['path', B.shown.path]];
  if (B.shown.frag) parts.push(['frag', B.shown.frag]);
  for (const [key, str] of parts) {
    // break a segment that is wider than a whole line into pieces
    let rest = str;
    while (rest.length) {
      const room = floor((x + w - cx - 12) / charW);
      if (room < 6 || (rest.length > room && cx > x && rest.length * charW + 12 <= w)) { cx = x; y += h + 6; continue; }
      const piece = rest.slice(0, max(1, room));
      rest = rest.slice(piece.length);
      const bw = piece.length * charW + 12;
      const isBad = B.bad === key;
      const c = isBad ? [220, 20, 60] : SEG_COLORS[key];
      stroke(c);
      strokeWeight(ruleFor === key ? 3 : (isBad ? 2.5 : 1.5));
      fill(c[0], c[1], c[2], isBad ? 55 : 30);
      rect(cx, y, bw, h, 6);
      noStroke();
      fill(isBad ? [170, 0, 30] : [0, 0, 0]);
      textAlign(LEFT, CENTER);
      text(piece, cx + 6, y + h / 2 + 1);
      segBoxes.push({ key, x: cx, y, w: bw, h });
      cx += bw + 4;
      if (rest.length) { cx = x; y += h + 6; }
    }
  }
  textFont('sans-serif');
  // legend of the three segment kinds
  y += h + 4;
  textSize(12);
  textAlign(LEFT, TOP);
  let lx = x;
  for (const [key, label] of [['site', 'site URL'], ['path', 'page path'], ['frag', 'fragment']]) {
    fill(SEG_COLORS[key]);
    rect(lx, y + 3, 10, 10, 2);
    fill('dimgray');
    text(label, lx + 14, y + 1);
    lx += 14 + fontWidth(label) + 16;
  }
  fill('dimgray');
  if (lx + fontWidth('red: the mistake') < x + w) { fill([220, 20, 60]); rect(lx, y + 3, 10, 10, 2); fill('dimgray'); text('the mistake', lx + 14, y + 1); }
  return y + 16;
}

function drawRulePanel(B, x, y, w) {
  let title, body, col;
  if (B.bad && (!ruleFor || ruleFor === B.bad || ruleFor === 'load')) {
    title = 'Mistake: ' + B.m;
    body = B.reason;
    col = [220, 20, 60];
  } else if (ruleFor === 'load') {
    title = 'Where the page is loaded from';
    body = 'The browser now shows ' + browserAddress() + ', but the IRI does not change: the identifier comes from site_url and the navigation path, not from the address bar.';
    col = [105, 105, 105];
  } else {
    const key = ruleFor || 'path';
    col = SEG_COLORS[key === 'load' ? 'path' : key];
    if (key === 'site') {
      title = 'Rule for the site URL';
      body = 'Use the canonical site_url from mkdocs.yml, never the address the browser shows. The runtime adds the trailing slash if the configuration omits it.' +
        (/127\.0\.0\.1|localhost/.test(siteInput.value()) ? ' This site_url looks like a local address, not the published one.' : '') +
        (/^https?:\/\//.test(siteInput.value().trim()) ? '' : ' A site_url must start with https:// (or http://).');
    } else if (key === 'frag') {
      const sub = subSelect.value();
      title = 'Rule for the fragment';
      body = sub === 'none' ? 'No fragment: the IRI names the ' + B.type.name + ' itself.' :
        sub === 'control' ? 'A control is named by its slugified name (#speed-slider): a control\'s identity is its name.' :
        sub === 'node' ? 'A diagram node is named by its slugified stable key, so reordering the diagram does not re-point the IRI.' :
        sub === 'fixed-order question' ? 'A question in a fixed order is #q plus its one-based number, the number the learner sees.' :
        'A shuffled question is #q- plus what it asks about, because its position changes on every reload.';
    } else {
      title = 'Rule for the page path';
      body = 'The navigation path where MkDocs renders index.md, with a trailing slash. Never main.html, the file inside the iframe.';
    }
  }
  textSize(13);
  const lines = wrapLines(body, w - 20);
  const h = 24 + lines.length * 17 + 6;
  stroke(col);
  strokeWeight(1.5);
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill(col);
  textStyle(BOLD);
  textSize(14);
  textAlign(LEFT, TOP);
  text(title, x + 10, y + 6);
  textStyle(NORMAL);
  fill('black');
  textSize(13);
  for (let i = 0; i < lines.length; i++) text(lines[i], x + 10, y + 26 + i * 17);
  return y + h;
}

function drawGrouping(B, x, y, w, h) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textStyle(BOLD);
  textSize(14);
  textAlign(LEFT, TOP);
  text('How a store groups one learner\'s visit', x + 10, y + 6);
  textStyle(NORMAL);
  let yy = y + 26;
  const countW = 34;
  for (const r of B.rows) {
    if (yy + 34 > y + h) break;
    fill(r.bad ? [255, 235, 238] : [235, 245, 235]);
    rect(x + 8, yy, w - 16, 34, 4);
    textFont('monospace');
    textSize(12);
    fill(r.bad ? [170, 0, 30] : [0, 90, 40]);
    text(fitMono(r.iri, w - 30 - countW), x + 14, yy + 3);
    textFont('sans-serif');
    textSize(12);
    fill('dimgray');
    text(fitSans(r.note, w - 30 - countW), x + 14, yy + 18);
    fill('black');
    textStyle(BOLD);
    textAlign(RIGHT, CENTER);
    text(r.n + '×', x + w - 14, yy + 17);
    textStyle(NORMAL);
    textAlign(LEFT, TOP);
    yy += 38;
  }
  textSize(13);
  if (yy + 16 < y + h) {
    fill(B.rows.length > 1 ? [170, 0, 30] : [0, 90, 40]);
    text(B.rows.length > 1 ? 'One visit, split into ' + B.rows.length + ' rows that never merge.' : 'One visit, one row.', x + 10, yy + 1);
  }
}

// Fit a string into a width with a middle ellipsis (monospace)
function fitMono(s, w) {
  const per = floor(w / fontWidth('M'));
  if (s.length <= per) return s;
  const keep = per - 1;
  const head = ceil(keep * 0.45);
  return s.slice(0, head) + '…' + s.slice(s.length - (keep - head));
}

function fitSans(s, w) {
  if (fontWidth(s) <= w) return s;
  while (s.length > 3 && fontWidth(s + '…') > w) s = s.slice(0, -1);
  return s + '…';
}

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

function wrapText(str, x, y, w, lead) {
  const lines = wrapLines(str, w);
  for (let i = 0; i < lines.length; i++) text(lines[i], x, y + i * lead);
  return lines.length * lead;
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(15);
  textAlign(LEFT, CENTER);
  const y0 = drawHeight + 8 + 11;
  text('site_url:', 10, y0);
  text('Page path:', 10, y0 + 34);
  text('Sub-activity:', 10, y0 + 68);
  text('Loaded from:', 10, y0 + 102);
  text('Show a mistake:', 10, y0 + 136);
}

// ---------- events ----------
function segmentAt(mx, my) {
  for (const b of segBoxes) if (mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h) return b.key;
  return null;
}

function mousePressed() {
  const k = segmentAt(mouseX, mouseY);
  if (k) ruleFor = k;
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
