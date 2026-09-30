// Tenant Isolation and Pseudonym Explorer
// CANVAS_HEIGHT: 480
// Learning objective (Understand / explain): the learner explains why a per-district salt gives
// one learner two unrelated pseudonymous keys, and which tenancy boundaries are hard or soft
// (Chapter 20, "Tenants, Rosters and Pseudonyms").
// A tenancy tree (System > two districts > school > course > section > student) sits beside a
// vault panel and an analytics-store panel. "Derive keys" computes each district's student_key
// from the account home page, the name and the salt. Tokens come from FNV-1a, a simple
// non-cryptographic hash: they are ILLUSTRATIVE, not a real hash (the design uses HMAC-SHA256).

// ---------- Canvas dimensions ----------
let canvasWidth = 800;
let drawHeight = 380;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let sliderLeftMargin = 185;   // left edge of the name field (no sliders in this sim)
let defaultTextSize = 16;

// ---------- Model ----------
const HOME_PAGE = 'https://school.example.edu';
const SALTS = { A: 'salt-7Q2f-district-a', B: 'salt-K9xw-district-b', GLOBAL: 'salt-GLOBAL-shared' };
const DISTRICTS = [
  { id: 'A', dId: 'district-a', name: 'District A', school: 'Lincoln High', course: 'Algebra 1', section: 'Period 3' },
  { id: 'B', dId: 'district-b', name: 'District B', school: 'Riverside High', course: 'Algebra 1', section: 'Period 5' }
];
const LEVELS = ['system', 'district', 'school', 'course', 'section', 'student'];
const RULES = {
  system: { kind: 'TOP', title: 'System',
    text: 'Holds every district tenant. The only action that reaches across districts is an explicit system-administrator benchmark over de-identified aggregates above the privacy threshold (default 10 students).' },
  district: { kind: 'HARD', title: 'District boundary: HARD',
    text: 'No query may cross it, except an explicit system-administrator benchmark of de-identified aggregates above the privacy threshold. Enforced by district_id leading the storage keys.' },
  school: { kind: 'SOFT', title: 'School boundary: SOFT',
    text: 'Role-based access control at the API decides what a school administrator or teacher may see inside the district.' },
  course: { kind: 'SOFT', title: 'Course boundary: SOFT',
    text: 'Role-based access control at the API. A textbook deployment assigned to a course shares its definition across districts, but its events stay partitioned by district.' },
  section: { kind: 'SOFT', title: 'Section boundary: SOFT',
    text: 'Role-based access control at the API: a teacher sees only the sections that teacher teaches.' },
  student: { kind: 'KEY', title: 'Enrollment and the pseudonym',
    text: 'Analytics stores see only the student_key. The real roster identity stays in the vault, a separate PostgreSQL instance that only the identity service can reach.' }
};

// Okabe-Ito colors (color-blind safe): vermillion for hard, blue for soft
const HARD_COLOR = [213, 94, 0];
const SOFT_COLOR = [0, 114, 178];
const LINK_RED = [200, 30, 30];

let nameInput, saltRadio, deriveButton, attackerBox;
let derived = false;
let derivedName = '';
let derivedMode = '';
let keys = { A: '', B: '' };
let selectedLevel = '';
let nodeRects = [];   // {level, x, y, w, h}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('sans-serif');
  const main = document.querySelector('main');

  nameInput = createInput('learner-17');
  nameInput.parent(main);
  nameInput.input(clearKeys);
  nameInput.attribute('aria-label', 'Learner account name');

  saltRadio = createRadio('saltMode');
  saltRadio.option('Per-district salt');
  saltRadio.option('One global salt');
  saltRadio.selected('Per-district salt');
  saltRadio.parent(main);
  saltRadio.style('white-space', 'nowrap');
  saltRadio.changed(clearKeys);

  deriveButton = createButton('Derive keys');
  deriveButton.parent(main);
  deriveButton.mousePressed(deriveKeys);

  attackerBox = createCheckbox('Attacker view', false);
  attackerBox.parent(main);
  attackerBox.style('white-space', 'nowrap');

  layoutControls();

  describe('Tenant Isolation and Pseudonym Explorer. A tree shows System at the top, District A and ' +
    'District B below it, then a school, a course, a section and one student in each district. ' +
    'Pressing Derive keys computes an illustrative student key for the same learner in each district. ' +
    'With per-district salts the two keys differ and cannot be linked; with one global salt they match ' +
    'and a red line links them. Attacker view hides the vault and shows only what an analytics reader ' +
    'sees. Clicking a level shows whether its boundary is hard or soft and the rule behind it.');
}

// ---------- Key derivation (illustrative only) ----------
function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

function token(salt, name) {
  const hex = fnv1a(salt + '|' + HOME_PAGE + '|' + name).toString(16).padStart(8, '0');
  return hex.slice(0, 4) + '-' + hex.slice(4);
}

function perDistrict() { return saltRadio.value() !== 'One global salt'; }

function saltFor(d) { return perDistrict() ? SALTS[d] : SALTS.GLOBAL; }

function deriveKeys() {
  derivedName = nameInput.value().trim();
  if (derivedName === '') { derived = false; return; }
  derivedMode = perDistrict() ? 'per' : 'global';
  keys.A = token(saltFor('A'), derivedName);
  keys.B = token(saltFor('B'), derivedName);
  derived = true;
}

function clearKeys() { derived = false; }

// ---------- Layout ----------
function wide() { return canvasWidth >= 620; }

function layoutControls() {
  const y1 = drawHeight + 8, y2 = drawHeight + 40, y3 = drawHeight + 70;
  for (const el of [saltRadio, attackerBox, deriveButton]) el.position(0, drawHeight);
  const radioW = saltRadio.elt.offsetWidth || 270;
  const inputW = wide() ? 150 : max(110, canvasWidth - sliderLeftMargin - margin);
  nameInput.size(inputW);
  nameInput.position(sliderLeftMargin, y1);
  saltRadio.position(10, y2);
  if (wide()) {
    deriveButton.position(sliderLeftMargin + inputW + 16, y1);
    attackerBox.position(10 + radioW + 24, y2);
  } else {
    deriveButton.position(10, y3);
    attackerBox.position(10 + (deriveButton.elt.offsetWidth || 95) + 16, y3 + 3);
  }
}

// ---------- Drawing ----------
function draw() {
  // Background regions
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const treeW = wide() ? canvasWidth * 0.58 : canvasWidth;

  // Title
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  let title = 'Tenant Isolation and Pseudonym Explorer';
  textSize(20);
  if (fontWidth(title) > canvasWidth - 2 * margin) title = 'Tenants and Pseudonyms';
  text(title, margin, 8);
  textStyle(NORMAL);

  drawTree(treeW);
  if (wide()) drawSidePanel(treeW + 8, 38, canvasWidth - treeW - 8 - margin, 262);
  drawInfoBand(margin, 306, canvasWidth - 2 * margin, drawHeight - 306 - 6);
  drawControlLabels();
  updateCursor();
}

function levelY(i) { return 50 + i * 38; }

function drawTree(treeW) {
  nodeRects = [];
  const colX = [treeW * 0.27, treeW * 0.73];
  const nodeW = min(150, treeW * 0.42);
  const nodeH = 26;
  const attacker = attackerBox.checked();

  // Hard district regions (shaded boxes around each district's subtree)
  for (let c = 0; c < 2; c++) {
    const x = colX[c] - nodeW / 2 - 6;
    const y = levelY(1) - nodeH / 2 - 6;
    const h = levelY(5) + nodeH / 2 + 34 - y;  // box ends just under the key token
    fill(255, 245, 235);
    stroke(HARD_COLOR);
    strokeWeight(selectedLevel === 'district' ? 4 : 2.5);
    rect(x, y, nodeW + 12, h, 8);
  }

  // Edges
  stroke('gray');
  strokeWeight(1.5);
  const sysX = treeW / 2;
  for (let c = 0; c < 2; c++) {
    line(sysX, levelY(0) + nodeH / 2, colX[c], levelY(1) - nodeH / 2);
    for (let i = 1; i < 5; i++) line(colX[c], levelY(i) + nodeH / 2, colX[c], levelY(i + 1) - nodeH / 2);
  }

  // System node
  drawNode('system', sysX, levelY(0), min(120, treeW * 0.3), nodeH, 'System', 'TOP');

  // District subtrees
  for (let c = 0; c < 2; c++) {
    const d = DISTRICTS[c];
    drawNode('district', colX[c], levelY(1), nodeW, nodeH, d.name, 'HARD');
    drawNode('school', colX[c], levelY(2), nodeW, nodeH, d.school, 'SOFT');
    drawNode('course', colX[c], levelY(3), nodeW, nodeH, d.course, 'SOFT');
    drawNode('section', colX[c], levelY(4), nodeW, nodeH, d.section, 'SOFT');
    const studentLabel = attacker ? 'identity hidden' : (derived ? derivedName : nameInput.value() || '(no name)');
    drawNode('student', colX[c], levelY(5), nodeW, nodeH, studentLabel, 'KEY');
  }

  // Key tokens under each student
  const ty = levelY(5) + nodeH / 2 + 6;
  const pillW = min(nodeW, 128), pillH = 22;
  for (let c = 0; c < 2; c++) {
    const k = derived ? keys[DISTRICTS[c].id] : '?';
    stroke(derived ? 'black' : 'silver');
    strokeWeight(1);
    fill(derived ? (derivedMode === 'global' ? color(255, 225, 225) : color(255, 255, 210)) : color(245));
    rect(colX[c] - pillW / 2, ty, pillW, pillH, 11);
    noStroke();
    fill(derived ? 'black' : 'gray');
    textAlign(CENTER, CENTER);
    textSize(13);
    text('key: ' + k, colX[c], ty + pillH / 2);
  }

  // The tokens are illustrative: say so right under them
  noStroke();
  fill('dimgray');
  textAlign(CENTER, TOP);
  textSize(12);
  textStyle(ITALIC);
  text('key tokens: illustrative, not a real hash', treeW / 2, ty + pillH + 12);
  textStyle(NORMAL);

  // Link (global salt) or no-link marker (per-district salt)
  if (derived) {
    const x1 = colX[0] + pillW / 2, x2 = colX[1] - pillW / 2, ym = ty + pillH / 2;
    if (derivedMode === 'global') {
      stroke(LINK_RED);
      strokeWeight(4);
      line(x1, ym, x2, ym);
      noStroke();
      fill(LINK_RED);
      textSize(12);
      textStyle(BOLD);
      textAlign(CENTER, BOTTOM);
      if (x2 - x1 > 70) text('linked', (x1 + x2) / 2, ym - 4);
      textStyle(NORMAL);
    } else {
      noStroke();
      fill('dimgray');
      textAlign(CENTER, CENTER);
      textSize(22);
      text('≠', (x1 + x2) / 2, ym);
    }
  }

  // Hard / soft legend on the System row, left of the System node
  textAlign(LEFT, CENTER);
  textSize(12);
  const ly = levelY(0);
  noStroke();
  fill(HARD_COLOR);
  rect(margin, ly - 5, 14, 10);
  fill('black');
  text('hard', margin + 18, ly);
  stroke(SOFT_COLOR);
  strokeWeight(2);
  drawingContext.setLineDash([4, 3]);
  noFill();
  rect(margin + 56, ly - 5, 14, 10);
  drawingContext.setLineDash([]);
  noStroke();
  fill('black');
  text('soft', margin + 74, ly);
}

function drawNode(level, cx, cy, w, h, label, kind) {
  const x = cx - w / 2, y = cy - h / 2;
  nodeRects.push({ level, x, y, w, h });
  const sel = selectedLevel === level;
  const hover = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  fill(sel ? color(255, 250, 200) : (hover ? color(235, 245, 255) : 'white'));
  if (kind === 'SOFT') {
    stroke(SOFT_COLOR);
    strokeWeight(sel ? 3 : 1.5);
    drawingContext.setLineDash([5, 3]);
  } else if (kind === 'HARD') {
    stroke(HARD_COLOR);
    strokeWeight(sel ? 4 : 2.5);
  } else {
    stroke(sel ? 'black' : 'gray');
    strokeWeight(sel ? 3 : 1.5);
  }
  rect(x, y, w, h, 6);
  drawingContext.setLineDash([]);
  noStroke();
  fill(level === 'student' && attackerBox.checked() ? 'dimgray' : 'black');
  textAlign(CENTER, CENTER);
  textSize(13);
  if (level === 'district') textStyle(BOLD);
  text(fitText(label, w - 10), cx, cy);
  textStyle(NORMAL);
}

function drawSidePanel(x, y, w, h) {
  const attacker = attackerBox.checked();
  const vaultH = 118;
  // Vault
  stroke(attacker ? 'silver' : 'dimgray');
  strokeWeight(1);
  fill(attacker ? color(235) : color(255, 255, 255, 235));
  rect(x, y, w, vaultH, 10);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  fill(attacker ? 'gray' : 'black');
  text('Vault (identity service only)', x + 10, y + 8);
  textStyle(NORMAL);
  textSize(12);
  let ty = y + 30;
  if (attacker) {
    fill('dimgray');
    drawWrapped('Hidden in attacker view. The vault is a separate PostgreSQL instance that analytics readers cannot reach, so the salts and the name-to-key mapping are out of sight.', x + 10, ty, w - 20, 16);
  } else {
    fill('black');
    if (perDistrict()) {
      text('salt A: ' + SALTS.A, x + 10, ty); ty += 16;
      text('salt B: ' + SALTS.B, x + 10, ty); ty += 20;
    } else {
      text('one salt for every district:', x + 10, ty); ty += 16;
      text(SALTS.GLOBAL, x + 10, ty); ty += 20;
    }
    const nm = derived ? derivedName : (nameInput.value() || '?');
    for (const d of DISTRICTS) {
      const k = derived ? keys[d.id] : '?';
      text(fitText(d.dId + ': ' + nm + ' → ' + k, w - 20), x + 10, ty);
      ty += 16;
    }
  }

  // Analytics store
  const ay = y + vaultH + 10, ah = h - vaultH - 10;
  stroke('dimgray');
  fill(255, 255, 255, 235);
  rect(x, ay, w, ah, 10);
  noStroke();
  fill('black');
  textSize(14);
  textStyle(BOLD);
  text('Analytics store (any reader)', x + 10, ay + 8);
  textStyle(NORMAL);
  textSize(12);
  fill('dimgray');
  text('district_id', x + 10, ay + 30);
  text('student_key', x + w * 0.5, ay + 30);
  fill('black');
  let ry = ay + 48;
  for (const d of DISTRICTS) {
    text(d.dId, x + 10, ry);
    text(derived ? keys[d.id] : '?', x + w * 0.5, ry);
    ry += 16;
  }
  ry += 6;
  textStyle(BOLD);
  if (!derived) {
    fill('dimgray');
    drawWrapped('Press Derive keys, then ask: can a reader link these rows?', x + 10, ry, w - 20, 15);
  } else if (derivedMode === 'global') {
    fill(LINK_RED);
    drawWrapped('Linkable: the same key appears in both districts.', x + 10, ry, w - 20, 15);
  } else {
    fill(0, 110, 60);
    drawWrapped('Not linkable: the two keys share nothing.', x + 10, ry, w - 20, 15);
  }
  textStyle(NORMAL);
}

function drawInfoBand(x, y, w, h) {
  stroke(200);
  strokeWeight(1);
  fill(255, 255, 255, 235);
  rect(x, y, w, h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  let head, body, headColor = color(0);
  if (selectedLevel) {
    const r = RULES[selectedLevel];
    head = r.title;
    body = r.text;
    if (r.kind === 'HARD') headColor = color(HARD_COLOR);
    if (r.kind === 'SOFT') headColor = color(SOFT_COLOR);
  } else if (!derived) {
    head = nameInput.value().trim() === '' ? 'Enter a learner account name' : 'Predict, then press Derive keys';
    body = 'Will ' + (nameInput.value().trim() || 'this learner') + ' get the same key in both districts? ' +
      'Each key mixes the home page, the name and the salt. Click any level of the tree to see its boundary rule.';
  } else if (derivedMode === 'per') {
    head = 'Per-district salt: two unrelated keys';
    body = attackerBox.checked()
      ? 'Without the vault, an analytics reader sees ' + keys.A + ' and ' + keys.B + ' and cannot link them. Deleting a district salt makes its key permanently underivable.'
      : 'The same learner gets ' + keys.A + ' in District A and ' + keys.B + ' in District B. Only the vault, holding both salts, knows they are one person.';
    headColor = color(0, 110, 60);
  } else {
    head = 'One global salt: the keys match';
    body = 'Both districts compute ' + keys.A + ', so anyone who can read the analytics store can link this learner across districts, and erasing one district cannot make the key underivable.';
    headColor = color(LINK_RED);
  }
  textSize(14);
  textStyle(BOLD);
  fill(headColor);
  text(head, x + 10, y + 7);
  textStyle(NORMAL);
  fill('black');
  textSize(canvasWidth < 500 ? 12 : 13);
  drawWrapped(body, x + 10, y + 26, w - 20, canvasWidth < 500 ? 14 : 16);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(15);
  textStyle(BOLD);
  text('Learner account name:', 10, drawHeight + 20);
  textStyle(NORMAL);
  if (wide()) {
    textSize(13);
    fill('dimgray');
    let note = 'Account home page: ' + HOME_PAGE + '.  The real design derives the key with HMAC-SHA256 keyed by the salt.';
    if (fontWidth(note) > canvasWidth - 20) note = 'Home page: ' + HOME_PAGE + '.  Real keys use HMAC-SHA256 with the salt.';
    if (fontWidth(note) > canvasWidth - 20) note = 'Home page: ' + HOME_PAGE;
    text(note, 10, drawHeight + 84);
  } else {
    // narrow: the note goes to the right of the button row when it fits
    textSize(12);
    fill('dimgray');
    const bx = 10 + (deriveButton.elt.offsetWidth || 95) + 16 + (attackerBox.elt.offsetWidth || 120) + 12;
    if (canvasWidth - bx > 120) drawWrapped('Home page: ' + HOME_PAGE, bx, drawHeight + 72, canvasWidth - bx - margin, 14);
  }
}

// ---------- Interaction ----------
function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight) return;
  for (const r of nodeRects) {
    if (mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h) {
      selectedLevel = selectedLevel === r.level ? '' : r.level;
      return;
    }
  }
  selectedLevel = '';
}

function updateCursor() {
  let over = false;
  for (const r of nodeRects) if (mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h) over = true;
  cursor(over ? HAND : ARROW);
}

// ---------- Text helpers ----------
function wrapWords(s, w) {
  const words = String(s).split(' ');
  const lines = [];
  let line = '';
  for (const wd of words) {
    const test = line ? line + ' ' + wd : wd;
    if (fontWidth(test) > w && line) { lines.push(line); line = wd; } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function drawWrapped(s, x, y, w, lh) {
  for (const l of wrapWords(s, w)) { text(l, x, y); y += lh; }
  return y;
}

function fitText(s, w) {
  if (fontWidth(s) <= w) return s;
  while (s.length > 3 && fontWidth(s + '...') > w) s = s.slice(0, -1);
  return s + '...';
}

// ---------- Responsive ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  layoutControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = max(320, container.offsetWidth);
}
