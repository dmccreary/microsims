// Portfolio Milestone Planner
// CANVAS_HEIGHT: 680
// A week-by-week plan of the seven capstone milestones from Chapter 25.
// Sliders for the number of MicroSims, the number of usability-test
// participants and the weeks available stretch or shrink the generation,
// instrumentation and testing bars. Bars that end after the last available
// week, or whose gate is at risk, turn amber with a one-sentence warning.
// Click a bar (or focus the chart and use the arrow keys) to see its
// deliverable and the gate it must pass.
// The durations are ILLUSTRATIVE planning estimates, not measured effort data.

// ---------- canvas layout ----------
// canvasHeight is fixed (it sets the iframe height). At narrow widths the
// controls need one more row and the drawing region gives up that height.
let canvasWidth = 700;
let canvasHeight = 680;
let controlHeight = 115;
let drawHeight = canvasHeight - controlHeight;
let margin = 10;
let sliderLeftMargin = 200;
let defaultTextSize = 16;

// ---------- colors ----------
const INK = [30, 30, 30];
const MUTED = [95, 95, 95];
const BAR = [0, 114, 178];          // on-schedule bar (white text, 5.2:1)
const AMBER = [230, 159, 0];        // at-risk bar (black text, 9.3:1)
const AMBER_INK = [150, 90, 0];     // warning text on white (5.6:1)
const SEL = [0, 50, 110];

// ---------- milestones (Chapter 25 milestone table) ----------
const MILESTONES = [
  { name: 'Plan', short: 'Plan',
    deliverable: 'Portfolio plan: topic, concepts, objectives, one MicroSim type per concept.',
    gate: 'Instructor approves plan.' },
  { name: 'Specify and generate', short: 'Generate',
    deliverable: 'Specification blocks, generated MicroSims, metadata files.',
    gate: 'Each new MicroSim scores at least 70.' },
  { name: 'Instrument', short: 'Instrument',
    deliverable: 'xAPI wiring and check-xapi.py reports.',
    gate: 'All checks pass.' },
  { name: 'Test and review', short: 'Test',
    deliverable: 'Usability notes, peer review form, list of fixes made.',
    gate: 'Fixes re-scored.' },
  { name: 'Protect', short: 'Protect',
    deliverable: 'Data policy statement.',
    gate: 'Reviewer confirms minimization and aggregate-only rules.' },
  { name: 'Evaluate', short: 'Evaluate',
    deliverable: 'Portfolio fidelity report.',
    gate: 'Limits sentence present.' },
  { name: 'Present', short: 'Present',
    deliverable: 'Deployed site and a short defense.',
    gate: 'Rubric score.' }
];

// ---------- illustrative effort model (weeks) ----------
// Calibrated so the defaults (5 MicroSims, 3 participants) reproduce the
// chapter's suggested 8-week schedule: 1 + 2 + 1 + 1 + 1 + 1 + 1.
const GEN_PER_SIM = 0.4;        // specify, generate and pass the 70-point gate
const INSTR_PER_SIM = 0.2;      // wire xAPI and pass check-xapi.py
const TEST_BASE = 0.25, TEST_PER_PERSON = 0.15, TEST_FIX_PER_SIM = 0.06;
const DEFAULTS = { sims: 5, people: 3, weeks: 8 };

function durations(sims, people) {
  const r = v => Math.round(v * 10) / 10;
  return [
    1,
    r(GEN_PER_SIM * sims),
    r(INSTR_PER_SIM * sims),
    r(TEST_BASE + TEST_PER_PERSON * people + TEST_FIX_PER_SIM * sims),
    1, 1, 1
  ];
}

function estimateText(i, sims, people) {
  if (i === 1) return GEN_PER_SIM + ' week per MicroSim x ' + sims + ' MicroSims.';
  if (i === 2) return INSTR_PER_SIM + ' week per MicroSim x ' + sims + ' MicroSims.';
  if (i === 3) return TEST_BASE + ' week setup + ' + TEST_PER_PERSON + ' per participant x ' + people +
    ' + ' + TEST_FIX_PER_SIM + ' per MicroSim for fixes x ' + sims + '.';
  return 'Fixed at 1 week, as in the suggested schedule.';
}

// ---------- state ----------
let plan = [];          // [{start, end, dur, late, risk, warning}]
let selected = 1;           // start with "Specify and generate" open
let canvasFocused = false;
let barRects = [];

// ---------- controls ----------
let simSlider, peopleSlider, weeksSlider, resetButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  frameRate(20);

  canvas.elt.setAttribute('tabindex', '0');
  canvas.elt.addEventListener('focus', () => { canvasFocused = true; if (selected < 0) selected = 0; updateDescription(); });
  canvas.elt.addEventListener('blur', () => { canvasFocused = false; });
  canvas.elt.addEventListener('keydown', chartKeyDown);

  simSlider = createSlider(3, 8, DEFAULTS.sims, 1);
  simSlider.parent(document.querySelector('main'));
  simSlider.attribute('aria-label', 'Number of MicroSims');
  peopleSlider = createSlider(1, 8, DEFAULTS.people, 1);
  peopleSlider.parent(document.querySelector('main'));
  peopleSlider.attribute('aria-label', 'Test participants');
  weeksSlider = createSlider(6, 12, DEFAULTS.weeks, 1);
  weeksSlider.parent(document.querySelector('main'));
  weeksSlider.attribute('aria-label', 'Weeks available');
  [simSlider, peopleSlider, weeksSlider].forEach(s => s.input(() => { recompute(); }));

  resetButton = createButton('Reset to suggested schedule');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(() => {
    simSlider.value(DEFAULTS.sims);
    peopleSlider.value(DEFAULTS.people);
    weeksSlider.value(DEFAULTS.weeks);
    recompute();
  });

  layoutControls();
  recompute();
}

function recompute() {
  const sims = simSlider.value(), people = peopleSlider.value(), weeks = weeksSlider.value();
  const d = durations(sims, people);
  let t = 0;
  plan = d.map((dur, i) => {
    const p = { start: t, end: t + dur, dur, late: false, risk: false, warning: '' };
    t += dur;
    return p;
  });
  plan.forEach((p, i) => {
    if (p.end > weeks + 1e-9) {
      p.late = true;
      p.warning = MILESTONES[i].name + ' would finish ' + p.end.toFixed(1) + ' weeks in, after the ' + weeks +
        ' weeks available, so its gate ("' + MILESTONES[i].gate.replace(/\.$/, '') + '") is at risk.';
    }
  });
  // gate risk that is about scope, not time: the brief asks for 3 or more participants
  if (people < 3) {
    const p = plan[3];
    p.risk = true;
    const msg = 'fewer than 3 test participants is below the brief\'s minimum, so the usability evidence is too thin to support the fixes.';
    p.warning = p.warning ? p.warning + ' Also, ' + msg : msg.charAt(0).toUpperCase() + msg.slice(1);
  }
  updateDescription();
}

function draw() {
  updateCanvasSize();
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const narrow = canvasWidth < 560;
  const sims = simSlider.value(), people = peopleSlider.value(), weeks = weeksSlider.value();
  const total = plan.length ? plan[plan.length - 1].end : 8;

  // title and disclaimer
  noStroke();
  fill(INK);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  textSize(narrow ? 19 : 22);
  text('Portfolio Milestone Planner', canvasWidth / 2, 8);
  textStyle(NORMAL);
  textSize(13);
  fill(MUTED);
  textAlign(LEFT, TOP);
  let y = wrapText(narrow ? 'Illustrative estimates, not measured effort data.' : 'Bar lengths are illustrative planning estimates, not measured effort data.', margin, 36, canvasWidth - 2 * margin, 16) + 4;

  // ---- Gantt geometry ----
  const labelW = narrow ? 78 : 150;
  const gx = margin + labelW;
  const gw = canvasWidth - gx - margin;
  const cols = Math.max(weeks, Math.ceil(total - 1e-9));
  const colW = gw / cols;
  const headY = y;
  const rowH = narrow ? 26 : 30;
  const rowsY = headY + 22;
  const rowsH = rowH * MILESTONES.length;

  // week columns: available weeks white, weeks past the deadline shaded
  for (let c = 0; c < cols; c++) {
    stroke(210);
    fill(c < weeks ? 255 : color(245, 225, 225));
    rect(gx + c * colW, rowsY, colW, rowsH);
    // week labels: full, abbreviated, or number only as the columns narrow
    noStroke();
    fill(c < weeks ? INK : AMBER_INK);
    textAlign(CENTER, TOP);
    textSize(12);
    const lbl = colW > 62 ? 'Week ' + (c + 1) : (colW > 34 ? 'Wk ' + (c + 1) : '' + (c + 1));
    text(lbl, gx + c * colW + colW / 2, headY + 3);
  }
  // deadline line
  const dx = gx + weeks * colW;
  stroke(AMBER_INK);
  strokeWeight(2);
  drawingContext.setLineDash([6, 4]);
  line(dx, headY, dx, rowsY + rowsH + 4);
  drawingContext.setLineDash([]);
  strokeWeight(1);

  // milestone rows
  barRects = [];
  MILESTONES.forEach((m, i) => {
    const ry = rowsY + i * rowH;
    const p = plan[i];
    noStroke();
    fill(INK);
    textAlign(LEFT, CENTER);
    textSize(13);
    text(narrow ? m.short : m.name, margin, ry + rowH / 2);
    const bx = gx + p.start * colW + 1;
    const bw = Math.max(4, p.dur * colW - 2);
    const r = { x: bx, y: ry + 4, w: bw, h: rowH - 8 };
    barRects.push(r);
    const warn = p.late || p.risk;
    stroke(warn ? color(120, 70, 0) : color(0, 70, 120));
    if (warn) drawingContext.setLineDash([4, 3]);
    fill(warn ? AMBER : BAR);
    rect(r.x, r.y, r.w, r.h, 4);
    drawingContext.setLineDash([]);
    if (i === selected) {
      noFill();
      stroke(SEL);
      strokeWeight(3);
      rect(r.x - 3, r.y - 3, r.w + 6, r.h + 6, 6);
      strokeWeight(1);
    }
    // text inside the bar: duration, and "!" when at risk (not color alone)
    noStroke();
    fill(warn ? 0 : 255);
    textSize(12);
    textAlign(CENTER, CENTER);
    const label = (warn ? '! ' : '') + p.dur.toFixed(1) + ' wk';
    if (fontWidth(label) + 6 < r.w) text(label, r.x + r.w / 2, r.y + r.h / 2);
    else if (warn) text('!', r.x + r.w / 2, r.y + r.h / 2);
  });

  // deadline label and summary line
  y = rowsY + rowsH + 6;
  noStroke();
  textSize(13);
  textAlign(LEFT, TOP);
  const lateNames = MILESTONES.filter((m, i) => plan[i].late).map(m => m.name);
  const riskNames = MILESTONES.filter((m, i) => plan[i].risk).map(m => m.name);
  let summary;
  if (!lateNames.length) {
    summary = 'Needs ' + total.toFixed(1) + ' of ' + weeks + ' weeks available: the plan fits with ' + (weeks - total).toFixed(1) + ' weeks of slack.';
  } else {
    summary = 'Needs ' + total.toFixed(1) + ' of ' + weeks + ' weeks available: ' + listWords(lateNames) + (lateNames.length > 1 ? ' finish' : ' finishes') + ' after the deadline' + (narrow ? '.' : ' (dashed line).');
  }
  if (riskNames.length) summary += ' Gate risk: ' + listWords(riskNames) + '.';
  fill(lateNames.length || riskNames.length ? AMBER_INK : INK);
  textStyle(BOLD);
  y = wrapText(summary, margin, y, canvasWidth - 2 * margin, 16) + 6;
  textStyle(NORMAL);

  // information panel for the selected bar
  drawPanel(y, sims, people);
  drawControlLabels();
}

function drawPanel(y, sims, people) {
  const x = margin, w = canvasWidth - 2 * margin;
  const h = drawHeight - y - margin;
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 6);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(13);
  let yy = y + 7;
  if (selected < 0) {
    fill(MUTED);
    wrapText('Click a bar, or focus the chart and use the arrow keys, to see its deliverable and the gate it must pass. Then move the sliders to fit the plan to your own course.', x + 10, yy, w - 20, 16);
    return;
  }
  const m = MILESTONES[selected], p = plan[selected];
  fill(INK);
  textStyle(BOLD);
  const wFirst = Math.floor(p.start + 1e-9) + 1, wLast = Math.ceil(p.end - 1e-9);
  const span = wFirst === wLast ? 'week ' + wFirst : 'weeks ' + wFirst + ' to ' + wLast;
  yy = wrapText((selected + 1) + '. ' + m.name + ': ' + p.dur.toFixed(1) + ' weeks, in ' + span + ' (from ' + p.start.toFixed(1) + ' to ' + p.end.toFixed(1) + ' weeks in)', x + 10, yy, w - 20, 16) + 2;
  textStyle(NORMAL);
  yy = labeled('Deliverable: ', m.deliverable, x + 10, yy, w - 20);
  yy = labeled('Gate: ', m.gate, x + 10, yy, w - 20);
  fill(MUTED);
  yy = wrapText('Estimate: ' + estimateText(selected, sims, people), x + 10, yy, w - 20, 16) + 2;
  if (p.warning) {
    fill(AMBER_INK);
    textStyle(BOLD);
    wrapText('! ' + p.warning, x + 10, yy, w - 20, 16);
    textStyle(NORMAL);
  }
}

function labeled(label, body, x, y, w) {
  fill(INK);
  textStyle(BOLD);
  const lw = fontWidth(label);
  text(label, x, y);
  textStyle(NORMAL);
  // first line continues after the label, later lines wrap to the left edge
  const words = body.split(' ');
  let line = '', first = true, cx = x + lw, cw = w - lw;
  for (const word of words) {
    const t = line ? line + ' ' + word : word;
    if (fontWidth(t) > cw && line) {
      text(line, cx, y); y += 16; line = word;
      if (first) { first = false; cx = x; cw = w; }
    } else line = t;
  }
  if (line) { text(line, cx, y); y += 16; }
  return y + 2;
}

function listWords(a) {
  if (a.length <= 1) return a.join('');
  return a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
}

// ---------- interaction ----------
function mousePressed() {
  for (let i = 0; i < barRects.length; i++) {
    const r = barRects[i];
    if (mouseX >= r.x - 2 && mouseX <= r.x + r.w + 2 && mouseY >= r.y - 2 && mouseY <= r.y + r.h + 2) {
      selected = i;
      updateDescription();
      return;
    }
  }
}

function chartKeyDown(e) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { selected = (selected + 1) % MILESTONES.length; e.preventDefault(); updateDescription(); }
  else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { selected = (selected + MILESTONES.length - 1) % MILESTONES.length; e.preventDefault(); updateDescription(); }
  else if (e.key === 'Escape') { selected = -1; updateDescription(); }
}

function updateDescription() {
  if (!plan.length) return;
  const weeks = weeksSlider.value();
  const parts = MILESTONES.map((m, i) => m.name + ' ' + plan[i].dur.toFixed(1) + ' weeks' +
    (plan[i].late ? ' (finishes after the deadline)' : '') + (plan[i].risk ? ' (gate at risk)' : ''));
  const total = plan[plan.length - 1].end;
  let d = 'Portfolio Milestone Planner. Illustrative schedule for ' + simSlider.value() + ' MicroSims and ' +
    peopleSlider.value() + ' test participants: ' + parts.join('; ') + '. Needs ' + total.toFixed(1) + ' of ' + weeks + ' weeks available.';
  if (selected >= 0) d += ' Selected: ' + MILESTONES[selected].name + '. Deliverable: ' + MILESTONES[selected].deliverable +
    ' Gate: ' + MILESTONES[selected].gate + (plan[selected].warning ? ' Warning: ' + plan[selected].warning : '');
  describe(d);
}

// ---------- layout ----------
// Row 1: MicroSims slider (+ Reset at wide widths); rows 2-3: the other two
// sliders; at narrow widths Reset moves to a fourth row.
function layoutControls() {
  if (!resetButton) return;
  const wide = canvasWidth >= 620;
  const rows = wide ? 3 : 4;
  controlHeight = rows * 35 + 10;
  drawHeight = canvasHeight - controlHeight;
  sliderLeftMargin = canvasWidth < 420 ? 175 : 190;
  const resetW = resetButton.elt.offsetWidth;
  const full = canvasWidth - sliderLeftMargin - 2 * margin;
  simSlider.position(sliderLeftMargin, drawHeight + 8);
  simSlider.size(wide ? full - resetW - 15 : full);
  peopleSlider.position(sliderLeftMargin, drawHeight + 43);
  peopleSlider.size(full);
  weeksSlider.position(sliderLeftMargin, drawHeight + 78);
  weeksSlider.size(full);
  if (wide) resetButton.position(canvasWidth - margin - resetW, drawHeight + 6);
  else resetButton.position(margin, drawHeight + 111);
}

function drawControlLabels() {
  noStroke();
  fill(INK);
  textSize(15);
  textAlign(LEFT, CENTER);
  text('Number of MicroSims: ' + simSlider.value(), margin, drawHeight + 18);
  text('Test participants: ' + peopleSlider.value(), margin, drawHeight + 53);
  text('Weeks available: ' + weeksSlider.value(), margin, drawHeight + 88);
}

function wrapText(str, x, y, w, lh) {
  const words = str.split(' ');
  let line = '';
  for (const word of words) {
    const t = line ? line + ' ' + word : word;
    if (fontWidth(t) > w && line) { text(line, x, y); y += lh; line = word; } else line = t;
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
