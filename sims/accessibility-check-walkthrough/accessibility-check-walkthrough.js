// Accessibility Check Walkthrough
// CANVAS_HEIGHT: 700
// A mock MicroSim (a ball, a Gravity slider and a Drop button) is shown in
// three variants. The learner runs the four human accessibility checks from
// Chapter 24 (keyboard-only completion, visible focus, text alternative and
// no color-only meaning), records a Pass or Fail verdict for each, and then
// reveals the built-in answers. Every mismatch is explained in one sentence.
// The defects are built into the mock; they are not findings about any real
// product. The sim itself models the checks: every control is a native,
// keyboard-reachable element with a visible focus ring, the mock can be
// operated from the keyboard, nothing is shown by color alone, and describe()
// is kept current.

// ---------- canvas layout ----------
// The total height is fixed (it sets the iframe height). The control region
// grows by one row when the controls wrap at narrow widths, and the drawing
// region gives up that height: drawHeight + controlHeight === canvasHeight.
let canvasWidth = 700;
let canvasHeight = 700;
let controlHeight = 88;
let drawHeight = canvasHeight - controlHeight;
let margin = 10;
let defaultTextSize = 16;
const ROW_H = 38;

// ---------- colors (text colors all reach 4.5:1 on white and aliceblue) ----------
const INK = [30, 30, 30];
const PASS_INK = [0, 90, 160];      // blue text
const FAIL_INK = [175, 60, 0];      // dark vermillion text
const MUTED_INK = [95, 95, 95];
const RING = [0, 60, 130];          // mock focus ring (dark blue)

// ---------- controls ----------
let variantGroup, variantSelect, keyboardBox, descBox, revealButton;
let verdictButtons = [];
let liveRegion;

// ---------- the three mock variants ----------
// A: pointer-only Gravity slider + a vague description.
// B: hidden focus ring + a status light that uses color alone.
// C: passes all four checks.
const VARIANTS = {
  A: { stops: ['drop'], ringVisible: true, statusWord: true, goodText: false },
  B: { stops: ['gravity', 'drop'], ringVisible: false, statusWord: false, goodText: true },
  C: { stops: ['gravity', 'drop'], ringVisible: true, statusWord: true, goodText: true }
};

const CHECKS = [
  { id: 'keyboard', short: 'Keyboard', title: '1. Keyboard-only completion',
    test: 'Turn on Keyboard only and finish the task with Tab, Enter and the arrow keys.' },
  { id: 'focus', short: 'Focus', title: '2. Visible focus',
    test: 'As you press Tab, can you always see which mock control has focus?' },
  { id: 'text', short: 'Text alt', title: '3. Text alternative',
    test: 'Turn on Show description. Does the text alone say what is shown and what the controls do?' },
  { id: 'color', short: 'Color', title: '4. No color-only meaning',
    test: 'Is any information in the mock given by color alone?' }
];

// Built-in answers: [verdict, one-sentence reason]
const ANSWERS = {
  A: {
    keyboard: ['fail', 'The Gravity slider is drawn on the canvas and only drags, so Tab skips it and the task cannot be finished.'],
    focus: ['pass', 'Drop, the only mock control that takes focus, shows a thick ring when it is focused.'],
    text: ['fail', '"Interactive sketch." names nothing on screen and no control, so the text alone tells a listener nothing.'],
    color: ['pass', 'The status light always has a word beside it, so color is never the only cue.']
  },
  B: {
    keyboard: ['pass', 'Both mock controls take focus and work with the arrow keys and Enter, so the task can be finished.'],
    focus: ['fail', 'Focus moves (Enter still drops the ball), but no ring is drawn, so you cannot see which control is active.'],
    text: ['pass', 'The description names the ball, the gravity value, both controls and the status.'],
    color: ['fail', 'The status light has no word; only red versus green shows it has landed, which many color-blind users miss.']
  },
  C: {
    keyboard: ['pass', 'Both mock controls take focus and work with the arrow keys and Enter.'],
    focus: ['pass', 'A thick dark ring outlines whichever mock control has focus.'],
    text: ['pass', 'The description names the ball, the gravity value, both controls and the status.'],
    color: ['pass', 'The status light always has a word beside it, so color is never the only cue.']
  }
};

// ---------- state ----------
let variant = 'A';
let verdicts = { A: {}, B: {}, C: {} };     // check id -> 'pass' | 'fail'
let revealed = { A: false, B: false, C: false };
let keyboardOnly = false;
let showDesc = false;

// mock simulation state
let gravity = 0.5;
let ball = { y: 0, vy: 0, state: 'ready' };   // ready | falling | landed
let taskDone = false;
let focusIndex = -1;          // index into the variant's focus stops, -1 = none
let canvasFocused = false;
let lastTabShift = false, lastTabTime = 0;
let draggingSlider = false;
let pointerNotice = 0;        // frame count until which the "pointer off" notice shows
let mockRects = {};           // hit areas of the mock's drawn controls

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  frameRate(30);

  // The canvas takes keyboard focus so the mock can be operated by keys.
  // Keys are handled on the canvas element only, never on the whole page.
  canvas.elt.setAttribute('tabindex', '0');
  canvas.elt.addEventListener('keydown', mockKeyDown);
  canvas.elt.addEventListener('focus', () => {
    canvasFocused = true;
    const recentTab = millis() - lastTabTime < 400;
    const stops = VARIANTS[variant].stops;
    focusIndex = recentTab ? (lastTabShift ? stops.length - 1 : 0) : -1;
  });
  canvas.elt.addEventListener('blur', () => { canvasFocused = false; focusIndex = -1; });
  document.addEventListener('keydown', e => {
    if (e.key === 'Tab') { lastTabShift = e.shiftKey; lastTabTime = millis(); }
  }, true);

  // Row 1: mock controls
  variantGroup = createDiv('');
  variantGroup.parent(document.querySelector('main'));
  variantGroup.addClass('ctl-row1');
  const lab = createElement('label', 'Mock variant ');
  lab.attribute('for', 'variant-select');
  lab.parent(variantGroup);
  variantSelect = createSelect();
  variantSelect.id('variant-select');
  variantSelect.parent(variantGroup);
  variantSelect.option('A');
  variantSelect.option('B');
  variantSelect.option('C');
  variantSelect.selected('A');
  variantSelect.changed(() => { variant = variantSelect.value(); resetMock(); refreshVerdictButtons(); updateDescription(); });

  keyboardBox = createCheckbox('Keyboard only', false);
  keyboardBox.parent(document.querySelector('main'));
  keyboardBox.addClass('ctl-row1');
  keyboardBox.changed(() => { keyboardOnly = keyboardBox.checked(); draggingSlider = false; updateDescription(); });

  descBox = createCheckbox('Show description', false);
  descBox.parent(document.querySelector('main'));
  descBox.addClass('ctl-row1');
  descBox.changed(() => { showDesc = descBox.checked(); updateDescription(); });

  // Row 2: one verdict button per check, plus Reveal answers
  CHECKS.forEach(ch => {
    const b = createButton(ch.short + ': ?');
    b.parent(document.querySelector('main'));
    b.mousePressed(() => cycleVerdict(ch.id));
    verdictButtons.push(b);
  });
  revealButton = createButton('Reveal answers');
  revealButton.parent(document.querySelector('main'));
  revealButton.mousePressed(revealAnswers);

  // Polite live region so screen reader users hear the comparison results
  liveRegion = createDiv('');
  liveRegion.parent(document.querySelector('main'));
  liveRegion.addClass('sr-only');
  liveRegion.attribute('aria-live', 'polite');

  refreshVerdictButtons();
  layoutControls();
  resetMock();
  describe('Accessibility Check Walkthrough.');
  updateDescription();
}

function draw() {
  updateCanvasSize();
  stepMock();

  // Drawing region and control region
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  noStroke();
  fill(INK);
  textAlign(CENTER, TOP);
  textSize(canvasWidth < 500 ? 19 : 22);
  textStyle(BOLD);
  text('Accessibility Check Walkthrough', canvasWidth / 2, 8);
  textStyle(NORMAL);

  const wide = canvasWidth >= 600;
  const top = 42;
  let mock, list;
  if (wide) {
    const mw = Math.floor(canvasWidth * 0.5) - margin - 4;
    mock = { x: margin, y: top, w: mw, h: drawHeight - top - margin };
    list = { x: margin + mw + 10, y: top, w: canvasWidth - (margin + mw + 10) - margin, h: drawHeight - top - margin };
  } else {
    mock = { x: margin, y: top, w: canvasWidth - 2 * margin, h: 172 };
    list = { x: margin, y: top + 180, w: canvasWidth - 2 * margin, h: drawHeight - top - 180 - margin };
  }
  drawMock(mock);
  drawChecklist(list, wide);
}

// ------------------------------------------------------------------
// The mock MicroSim (the thing being judged)
// ------------------------------------------------------------------
function drawMock(m) {
  const v = VARIANTS[variant];
  // frame
  stroke(120);
  strokeWeight(1);
  fill('white');
  rect(m.x, m.y, m.w, m.h, 8);
  // header bar
  noStroke();
  fill(225, 232, 240);
  rect(m.x + 1, m.y + 1, m.w - 2, 26, 8, 8, 0, 0);
  fill(INK);
  textAlign(LEFT, CENTER);
  textSize(14);
  textStyle(BOLD);
  text('Mock MicroSim: Drop the Ball (' + variantLabel() + ')', m.x + 10, m.y + 14);
  textStyle(NORMAL);

  const bodyY = m.y + 30;
  const bodyH = m.h - 32;

  if (showDesc) {
    drawDescriptionPanel(m, bodyY, bodyH);
    return;
  }

  // mock control bar at the bottom of the mock
  const ctlY = m.y + m.h - 46;
  // ball column on the left
  const colW = Math.min(90, m.w * 0.3);
  const col = { x: m.x + 12, y: bodyY + 6, w: colW, h: ctlY - bodyY - 14 };
  stroke(170);
  fill(248, 250, 252);
  rect(col.x, col.y, col.w, col.h, 4);
  const r = 12;
  const floorY = col.y + col.h - r - 2;
  const topY = col.y + r + 2;
  const by = topY + ball.y * (floorY - topY);
  noStroke();
  fill(0, 114, 178);
  circle(col.x + col.w / 2, by, 2 * r);

  // task and status on the right of the column
  const tx = col.x + col.w + 12;
  const tw = m.x + m.w - tx - 10;
  noStroke();
  fill(INK);
  textSize(14);
  textAlign(LEFT, TOP);
  let y = bodyY + 6;
  y = wrapText('Task: set Gravity to 1.0, then press Drop.', tx, y, tw, 18) + 8;

  // status light
  const st = ball.state;
  let dot;
  if (v.statusWord) {
    dot = st === 'falling' ? [230, 159, 0] : (st === 'landed' ? [0, 114, 178] : [150, 150, 150]);
  } else {
    dot = st === 'falling' ? [220, 40, 40] : (st === 'landed' ? [40, 170, 60] : [150, 150, 150]);
  }
  noStroke();
  fill(INK);
  text('Status:', tx, y);
  fill(dot);
  stroke(60);
  circle(tx + textWidth('Status: ') + 9, y + 8, 16);
  if (v.statusWord) {
    noStroke();
    fill(INK);
    text(st === 'ready' ? 'Ready' : (st === 'falling' ? 'Falling' : 'Landed'),
      tx + textWidth('Status: ') + 22, y);
  }
  y += 26;
  if (taskDone) {
    noStroke();
    fill(0, 110, 80);
    y = wrapText('Task complete: dropped at gravity 1.0.', tx, y, tw, 18) + 4;
  }

  // keyboard-only notices
  noStroke();
  textSize(13);
  if (keyboardOnly) {
    fill(MUTED_INK);
    let msg;
    if (!canvasFocused) msg = 'Pointer input is off. Click the mock once or press Shift+Tab to reach it, then use Tab.';
    else if (focusIndex < 0) msg = 'The mock has keyboard focus. Press Tab to move to its first control.';
    else msg = 'Tab / Shift+Tab: move. Arrow keys: gravity. Enter: Drop.';
    wrapText(msg, tx, Math.max(y, ctlY - 58), tw, 16);
  }
  if (frameCount < pointerNotice) {
    fill(FAIL_INK);
    textAlign(LEFT, TOP);
    wrapText('Keyboard only is on, so the mouse does nothing here.', tx, ctlY - 22 - 16, tw, 16);
  }

  // ---- mock controls (drawn on the canvas on purpose: they are what is judged) ----
  const sx = m.x + 14;
  const sw = Math.max(90, m.w - 14 - 100 - 24);
  const dropW = 76;
  const dropX = m.x + m.w - dropW - 14;
  mockRects.gravity = { x: sx - 6, y: ctlY + 2, w: sw + 12, h: 38 };
  mockRects.drop = { x: dropX, y: ctlY + 8, w: dropW, h: 30 };

  // Gravity slider
  noStroke();
  fill(INK);
  textSize(13);
  textAlign(LEFT, TOP);
  text('Gravity ' + gravity.toFixed(1), sx, ctlY + 2);
  const trackY = ctlY + 30;
  stroke(150);
  strokeWeight(4);
  line(sx, trackY, sx + sw, trackY);
  strokeWeight(1);
  const kx = sx + (gravity - 0.1) / 1.9 * sw;
  stroke(60);
  fill(240);
  circle(kx, trackY, 16);

  // Drop button
  stroke(90);
  fill(235);
  rect(mockRects.drop.x, mockRects.drop.y, dropW, 30, 6);
  noStroke();
  fill(INK);
  textAlign(CENTER, CENTER);
  textSize(14);
  text('Drop', mockRects.drop.x + dropW / 2, mockRects.drop.y + 15);

  // Focus ring on the focused mock control (hidden in variant B: its defect)
  if (canvasFocused && focusIndex >= 0 && v.ringVisible) {
    const id = v.stops[focusIndex];
    const rr = mockRects[id];
    noFill();
    stroke(RING);
    strokeWeight(3);
    rect(rr.x - 3, rr.y - 3, rr.w + 6, rr.h + 6, 6);
    strokeWeight(1);
  }
}

function drawDescriptionPanel(m, bodyY, bodyH) {
  noStroke();
  fill(250, 250, 240);
  rect(m.x + 6, bodyY + 4, m.w - 12, bodyH - 8, 6);
  fill(INK);
  textAlign(LEFT, TOP);
  textSize(13);
  textStyle(BOLD);
  let y = wrapText('What a screen reader reads (the describe() text), with the picture hidden:',
    m.x + 14, bodyY + 12, m.w - 28, 17) + 8;
  textStyle(NORMAL);
  textSize(15);
  wrapText('"' + mockDescription() + '"', m.x + 14, y, m.w - 28, 20);
}

// The text alternative each variant provides
function mockDescription() {
  if (!VARIANTS[variant].goodText) return 'Interactive sketch.';
  const st = ball.state === 'ready' ? 'ready to drop' : (ball.state === 'falling' ? 'falling' : 'landed');
  return 'Ball drop simulation. A blue ball sits in a tall box. Gravity slider, set to ' +
    gravity.toFixed(1) + ', range 0.1 to 2.0. Drop button releases the ball, which bounces and ' +
    'comes to rest. Status: ' + st + '. Task: set gravity to 1.0, then press Drop.';
}

function variantLabel() { return 'Variant ' + variant; }

// ------------------------------------------------------------------
// Checklist panel
// ------------------------------------------------------------------
function drawChecklist(p, wide) {
  stroke('silver');
  fill('white');
  rect(p.x, p.y, p.w, p.h, 8);
  noStroke();
  fill(INK);
  textAlign(LEFT, TOP);
  textSize(15);
  textStyle(BOLD);
  text('Checklist for ' + variantLabel(), p.x + 10, p.y + 8);
  textStyle(NORMAL);
  let y = p.y + 30;
  const x = p.x + 10;
  const w = p.w - 20;
  const rev = revealed[variant];
  let matches = 0, judged = 0;

  CHECKS.forEach(ch => {
    const mine = verdicts[variant][ch.id];
    const ans = ANSWERS[variant][ch.id];
    if (mine) judged++;
    if (mine && mine === ans[0]) matches++;
    noStroke();
    fill(INK);
    textSize(14);
    textStyle(BOLD);
    text(ch.title, x, y);
    textStyle(NORMAL);
    y += 18;
    if (wide && !rev) {
      fill(MUTED_INK);
      textSize(13);
      y = wrapText(ch.test, x + 8, y, w - 8, 16) + 2;
    }
    textSize(13);
    const mineWord = mine ? (mine === 'pass' ? 'Pass' : 'Fail') : 'not judged';
    fill(mine ? (mine === 'pass' ? PASS_INK : FAIL_INK) : MUTED_INK);
    let line = 'Your verdict: ' + mineWord;
    if (rev) {
      const ok = mine === ans[0];
      line += '   Answer: ' + (ans[0] === 'pass' ? 'Pass' : 'Fail') + (ok ? '  ✓ match' : (mine ? '  ✗ mismatch' : ''));
    }
    text(line, x + 8, y);
    y += 17;
    if (rev && mine !== ans[0]) {
      fill(INK);
      y = wrapText(ans[1], x + 8, y, w - 8, 16) + 2;
    }
    y += wide ? 8 : 4;
  });

  // summary line
  noStroke();
  textSize(13);
  fill(INK);
  if (rev) {
    textStyle(BOLD);
    wrapText(matches + ' of 4 verdicts match the built-in defects. ' +
      (matches === 4 ? 'Now justify each Fail by naming the defect.' : 'Re-test the mismatches, then try another variant.'),
      x, y, w, 16);
    textStyle(NORMAL);
  } else if (judged === 4) {
    wrapText('All four verdicts recorded. Press Reveal answers to compare.', x, y, w, 16);
  } else if (wide) {
    fill(MUTED_INK);
    wrapText('Record a verdict with the buttons below the picture: each press switches Pass and Fail.', x, y, w, 16);
  }
}

// ------------------------------------------------------------------
// Mock behavior
// ------------------------------------------------------------------
function resetMock() {
  ball = { y: 0, vy: 0, state: 'ready' };
  gravity = 0.5;
  taskDone = false;
  focusIndex = canvasFocused ? 0 : -1;
  draggingSlider = false;
}

function dropBall() {
  if (ball.state === 'falling') return;
  ball = { y: 0, vy: 0, state: 'falling' };
  taskDone = Math.abs(gravity - 1.0) < 0.05;
  updateDescription();
}

function stepMock() {
  if (ball.state !== 'falling') return;
  // positions are fractions of the column height; gravity scales acceleration
  ball.vy += gravity * 0.004;
  ball.y += ball.vy;
  if (ball.y >= 1) {
    ball.y = 1;
    ball.vy = -ball.vy * 0.55;
    if (Math.abs(ball.vy) < 0.012) {
      ball.vy = 0;
      ball.state = 'landed';
      updateDescription();
    }
  }
}

function setGravity(g) {
  gravity = constrain(Math.round(g * 10) / 10, 0.1, 2.0);
}

function mockKeyDown(e) {
  const stops = VARIANTS[variant].stops;
  if (e.key === 'Tab') {
    if (!e.shiftKey && focusIndex < stops.length - 1) { focusIndex++; e.preventDefault(); }
    else if (e.shiftKey && focusIndex > 0) { focusIndex--; e.preventDefault(); }
    // otherwise let Tab leave the canvas: the mock never traps focus
    return;
  }
  if (focusIndex < 0) return;
  const id = stops[focusIndex];
  if (id === 'gravity' && (e.key === 'ArrowLeft' || e.key === 'ArrowDown')) { setGravity(gravity - 0.1); e.preventDefault(); updateDescription(); }
  if (id === 'gravity' && (e.key === 'ArrowRight' || e.key === 'ArrowUp')) { setGravity(gravity + 0.1); e.preventDefault(); updateDescription(); }
  if (id === 'drop' && (e.key === 'Enter' || e.key === ' ')) { dropBall(); e.preventDefault(); }
}

function inRect(px, py, r) {
  return r && px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
}

function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight || mouseX < 0 || mouseX > canvasWidth) return;
  if (showDesc) return;
  const onMockControl = inRect(mouseX, mouseY, mockRects.drop) || inRect(mouseX, mouseY, mockRects.gravity);
  if (keyboardOnly) {
    if (onMockControl) pointerNotice = frameCount + 60;
    return;
  }
  if (inRect(mouseX, mouseY, mockRects.drop)) dropBall();
  else if (inRect(mouseX, mouseY, mockRects.gravity)) { draggingSlider = true; sliderFromMouse(); }
}

function mouseDragged() {
  if (draggingSlider && !keyboardOnly) sliderFromMouse();
}

function mouseReleased() {
  if (draggingSlider) { draggingSlider = false; updateDescription(); }
}

function sliderFromMouse() {
  const r = mockRects.gravity;
  const sx = r.x + 6, sw = r.w - 12;
  setGravity(0.1 + constrain((mouseX - sx) / sw, 0, 1) * 1.9);
}

// ------------------------------------------------------------------
// Verdicts
// ------------------------------------------------------------------
function cycleVerdict(id) {
  const cur = verdicts[variant][id];
  verdicts[variant][id] = cur === 'pass' ? 'fail' : 'pass';
  revealed[variant] = false;
  refreshVerdictButtons();
  updateDescription();
}

function refreshVerdictButtons() {
  CHECKS.forEach((ch, i) => {
    const v = verdicts[variant][ch.id];
    verdictButtons[i].html(ch.short + ': ' + (v ? (v === 'pass' ? 'Pass' : 'Fail') : '?'));
    verdictButtons[i].attribute('aria-label', ch.title.slice(3) + ' verdict: ' + (v || 'not judged') + '. Press to switch.');
  });
  layoutControls();
}

function revealAnswers() {
  revealed[variant] = true;
  const parts = [];
  let matches = 0;
  CHECKS.forEach(ch => {
    const mine = verdicts[variant][ch.id];
    const ans = ANSWERS[variant][ch.id];
    if (mine === ans[0]) { matches++; parts.push(ch.short + ': match.'); }
    else parts.push(ch.short + ': answer is ' + ans[0] + '. ' + ans[1]);
  });
  liveRegion.html(variantLabel() + ': ' + matches + ' of 4 match. ' + parts.join(' '));
  updateDescription();
}

// ------------------------------------------------------------------
// describe() for the whole sim, kept current
// ------------------------------------------------------------------
function updateDescription() {
  const v = verdicts[variant];
  const vtext = CHECKS.map(ch => ch.short + ' ' + (v[ch.id] || 'not judged')).join(', ');
  describe('Accessibility Check Walkthrough. A mock MicroSim, ' + variantLabel() +
    ', shows a ball in a tall box, a Gravity slider set to ' + gravity.toFixed(1) +
    ' and a Drop button; its status is ' + ball.state + '. Keyboard only is ' + (keyboardOnly ? 'on' : 'off') +
    ' and Show description is ' + (showDesc ? 'on' : 'off') + '. A checklist lists four checks: ' +
    'keyboard-only completion, visible focus, text alternative and no color-only meaning. Your verdicts: ' +
    vtext + '.' + (revealed[variant] ? ' Answers are revealed.' : ''));
}

// ------------------------------------------------------------------
// Layout helpers
// ------------------------------------------------------------------
// Place the controls left to right and wrap when a row is full. Row 1 holds
// the mock controls; the verdict buttons always start a new row.
function layoutControls() {
  if (!revealButton) return;
  const groups = [[variantGroup, keyboardBox, descBox], verdictButtons.concat([revealButton])];
  const gap = 10, left = margin, right = canvasWidth - margin;
  // first pass: count rows
  let rows = 0;
  const placed = [];
  groups.forEach(g => {
    let x = left;
    rows++;
    g.forEach(el => {
      const w = el.elt.offsetWidth;
      if (x > left && x + w > right) { rows++; x = left; }
      placed.push({ el, x, row: rows - 1 });
      x += w + gap;
    });
  });
  controlHeight = rows * ROW_H + 12;
  drawHeight = canvasHeight - controlHeight;
  placed.forEach(p => p.el.position(p.x, drawHeight + 10 + p.row * ROW_H));
}

// Draw word-wrapped text; returns the y below the last line
function wrapText(str, x, y, w, lh) {
  const words = str.split(' ');
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (textWidth(test) > w && line) {
      text(line, x, y);
      y += lh;
      line = word;
    } else {
      line = test;
    }
  }
  if (line) { text(line, x, y); y += lh; }
  return y;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  layoutControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.max(300, container.offsetWidth);
}
