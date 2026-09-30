// Storage Meter Pressure Lab - p5.js
// CANVAS_HEIGHT: 700
// Learning objective (Apply / predict): the learner predicts which pressure level a given
// storage state triggers and which data the LRS-Lite library discards first.
// Rules (Chapter 22, "The 10 MB Budget and the Storage Meter" - a design, not built):
//   Protect: 95% or more of 10 MB WITH unsynced data -> force summary mode and fold the
//            oldest unsynced statements into summaries (truncated_statements: N)
//   Reclaim: 80% or more -> drop mirrored segments from other devices first, then this
//            device's segments that are synced AND covered by a verified checkpoint
//   Offer:   60% or more, OR 7+ days since the last backup, OR unsynced events older
//            than 24 hours -> a backup card appears
//   Normal:  otherwise -> nothing beyond the meter
// Summaries and evidence are never pruned. The split of the total into slices and the
// per-day growth rates are ILLUSTRATIVE (the design gives typical sizes, not a formula).
// Layout: fixed canvas height; the control rows wrap on narrow screens and the drawing
// region takes the height they leave.

// ---------- canvas and layout ----------
let canvasWidth = 700;
let canvasHeight = 700;           // fixed: equals CANVAS_HEIGHT
let controlHeight = 216;          // recomputed by layoutControls()
let drawHeight = canvasHeight - controlHeight;
let margin = 10;
let sliderLeftMargin = 190;
let defaultTextSize = 16;

// ---------- model constants ----------
const BUDGET_MB = 10;
const GROWTH_MB_PER_DAY = { summary: 0.37 / 90, full: 3.6 / 90 };   // heavy student, per design table
const EVENTS_PER_DAY = { summary: 50, full: 698 };                  // heavy student, per design model
const LEVELS = ['Normal', 'Offer', 'Reclaim', 'Protect'];
const RANK = { Normal: 0, Offer: 1, Reclaim: 2, Protect: 3 };
const LEVEL_COLOR = { Normal: '#0072B2', Offer: '#E69F00', Reclaim: '#D55E00', Protect: '#6A3D9A' };
// Okabe-Ito slice colors (color-blind safe), each also named in the legend
const SLICES = [
    { key: 'summaries', name: 'Summaries and evidence', short: 'Summaries', color: '#0072B2',
      tip: 'Summaries and evidence: the student’s state (one rollup per grain plus the ordered evidence lists). Never pruned. Typical 50 to 150 KB, hard cap 1 MB.' },
    { key: 'unsealed', name: 'Unsealed events', short: 'Unsealed', color: '#E69F00',
      tip: 'Unsealed events: statements from the current session, sealed into a segment every few minutes. Not pruned; under Protect the oldest unsynced statements are folded into summaries instead. Typical under 20 KB, cap 0.5 MB.' },
    { key: 'device', name: 'This device’s segments', short: 'This device', color: '#009E73',
      tip: 'This device’s sealed segments: pruned only after they are synced AND covered by a verified checkpoint (the second thing Reclaim drops). Typical 0.2 to 0.4 MB per semester.' },
    { key: 'mirrored', name: 'Mirrored segments', short: 'Mirrored', color: '#CC79A7',
      tip: 'Mirrored segments: copies of other devices’ segments, already safe in object storage. First to go under pressure (the first thing Reclaim drops). Typical 0 to 0.4 MB.' }
];

// ---------- controls ----------
let sizeSlider, backupSlider, unsyncedSlider, modeRadio;
let advanceButton, resetButton, persistSelect, persistButton;
let predictButtons = [];
let controlLabels = [];

// ---------- state ----------
let predicted = null;             // the learner's predicted level, or null
let score = { right: 0, tries: 0 };
let persistence = 'not requested';
let persistNote = '';
let hitBoxes = [];

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));
    textSize(defaultTextSize);
    const main = document.querySelector('main');

    sizeSlider = createSlider(0, 10, 0.34, 0.01);
    backupSlider = createSlider(0, 30, 2, 1);
    unsyncedSlider = createSlider(0, 72, 0, 1);
    [sizeSlider, backupSlider, unsyncedSlider].forEach(s => s.input(stateChanged));

    modeRadio = createRadio('mode');
    modeRadio.option('summary', 'Summary');
    modeRadio.option('full', 'Full');
    modeRadio.selected('summary');
    modeRadio.style('font-size', '15px');
    modeRadio.style('white-space', 'nowrap');
    modeRadio.changed(stateChanged);

    advanceButton = createButton('Advance 10 days');
    advanceButton.mousePressed(advanceTenDays);
    resetButton = createButton('Reset');
    resetButton.mousePressed(resetLab);

    persistSelect = createSelect();
    persistSelect.option('Firefox prompt');
    persistSelect.option('Chrome silent grant');
    persistSelect.option('Chrome silent denial');
    persistButton = createButton('Keep my record on this device');
    persistButton.mousePressed(requestPersistence);

    LEVELS.forEach(lv => {
        const b = createButton(lv);
        b.mousePressed(() => makePrediction(lv));
        predictButtons.push(b);
    });

    [sizeSlider, backupSlider, unsyncedSlider, modeRadio, advanceButton, resetButton,
     persistSelect, persistButton, ...predictButtons].forEach(c => {
        c.parent(main);
        c.style('font-size', '15px');
    });
    layoutControls();
    describeState();
}

// ---------- control layout (rows wrap on narrow screens) ----------
function layoutControls() {
    const narrow = canvasWidth < 500;
    const rowH = narrow ? 32 : 34, gap = 8, x0 = margin, right = canvasWidth - margin;
    const all = [sizeSlider, backupSlider, unsyncedSlider, modeRadio, advanceButton, resetButton,
                 persistSelect, persistButton, ...predictButtons];
    all.forEach(c => c.style('font-size', narrow ? '14px' : '15px'));
    all.forEach(c => c.position(0, drawHeight));     // absolute first, so widths are natural
    sliderLeftMargin = narrow ? 170 : 190;
    persistSelect.style('width', canvasWidth < 500 ? '140px' : 'auto');
    const sw = max(80, canvasWidth - sliderLeftMargin - margin - 4);
    [sizeSlider, backupSlider, unsyncedSlider].forEach(s => s.size(sw));
    const groups = [
        [{ label: 'size', w: sliderLeftMargin - x0 - gap }, { el: sizeSlider, w: sw }],
        [{ label: 'backup', w: sliderLeftMargin - x0 - gap }, { el: backupSlider, w: sw }],
        [{ label: 'unsynced', w: sliderLeftMargin - x0 - gap }, { el: unsyncedSlider, w: sw }],
        [{ label: 'mode', w: narrow ? 42 : 48 }, { el: modeRadio }, { el: advanceButton }, { el: resetButton }],
        [{ el: persistSelect }, { el: persistButton }],
        [{ label: 'predict', w: canvasWidth < 500 ? 62 : 132 }, ...predictButtons.map(b => ({ el: b }))]
    ];
    const placements = [];
    let row = -1;
    groups.forEach(items => {
        row++;
        let x = x0;
        items.forEach(it => {
            const w = it.w || it.el.elt.offsetWidth || 80;
            if (x > x0 && x + w > right) { row++; x = x0; }
            placements.push({ it, x, row });
            x += w + gap;
        });
    });
    controlHeight = (row + 1) * rowH + 12;
    drawHeight = canvasHeight - controlHeight;
    controlLabels = [];
    placements.forEach(p => {
        const y = drawHeight + 8 + p.row * rowH;
        if (p.it.label) controlLabels.push({ key: p.it.label, x: p.x, y: y + 12 });
        else {
            const dy = (p.it.el === modeRadio) ? 3 : ([sizeSlider, backupSlider, unsyncedSlider].includes(p.it.el) ? 4 : 0);
            p.it.el.position(p.x, y + dy);
        }
    });
}

// ---------- model ----------
function currentState() {
    const size = sizeSlider.value();
    const days = backupSlider.value();
    const hours = unsyncedSlider.value();
    const mode = modeRadio.value() || 'summary';
    const pct = 100 * size / BUDGET_MB;
    const unsynced = hours > 0;
    // illustrative split of the total into slices
    const summaries = min(1.0, 0.25 * size);
    const unsealed = min(0.5, 0.05 * size);
    const mirrored = 0.20 * size;
    const device = max(0, size - summaries - unsealed - mirrored);
    const rate = GROWTH_MB_PER_DAY[mode];
    // this device's segments not yet covered: written since the last verified backup, or unsynced
    const unsyncedDevice = unsynced ? min(device, rate * hours / 24) : 0;
    const notCovered = min(device, rate * days + unsyncedDevice);
    const covered = max(0, device - notCovered);
    return { size, days, hours, mode, pct, unsynced, rate,
             slices: { summaries, unsealed, device, mirrored }, covered, unsyncedDevice };
}

function levelOf(s) {
    const triggers = [];
    if (s.pct >= 95 && s.unsynced) triggers.push(['Protect', `${nf(s.pct, 1, 1)}% ≥ 95% with unsynced data`]);
    if (s.pct >= 95 && !s.unsynced) triggers.push(['Reclaim', `${nf(s.pct, 1, 1)}% ≥ 95%, but nothing is unsynced, so Protect does not apply`]);
    if (s.pct >= 80) triggers.push(['Reclaim', `${nf(s.pct, 1, 1)}% ≥ 80%`]);
    if (s.pct >= 60) triggers.push(['Offer', `${nf(s.pct, 1, 1)}% ≥ 60%`]);
    if (s.days >= 7) triggers.push(['Offer', `${s.days} days since the last backup (7 or more)`]);
    if (s.hours > 24) triggers.push(['Offer', `unsynced events are ${s.hours} h old (over 24 h)`]);
    let level = 'Normal';
    triggers.forEach(t => { if (RANK[t[0]] > RANK[level]) level = t[0]; });
    return { level, triggers };
}

// What the level does to the slices, in order
function applyLevel(s, level) {
    const after = Object.assign({}, s.slices);
    const steps = [];
    const line80 = 0.8 * BUDGET_MB;
    const total = () => after.summaries + after.unsealed + after.device + after.mirrored;
    if (level === 'Reclaim' || level === 'Protect') {
        // Reclaim frees space down to the 80% line; Protect is above it, so the drops apply too
        const need = () => total() - line80 + 0.005;      // free space down to just under 80%
        const drop = min(after.mirrored, max(0, need()));
        if (drop > 0.005) {
            after.mirrored -= drop;
            steps.push([`Drop mirrored segments from other devices (\u2212${nf(drop, 1, 2)} MB)`, `Drop mirrored segments (\u2212${nf(drop, 1, 2)} MB)`]);
        }
        if (need() <= 0.005) {
            steps.push(['This device\u2019s own segments are kept: the total is already under 80%', 'Own segments kept: already under 80%']);
        } else if (s.covered > 0.005) {
            const drop2 = min(s.covered, need());
            after.device -= drop2;
            steps.push([`Drop this device\u2019s synced, checkpoint-covered segments (\u2212${nf(drop2, 1, 2)} MB)`, `Drop covered own segments (\u2212${nf(drop2, 1, 2)} MB)`]);
        } else {
            steps.push(['No segments of this device are both synced and checkpoint-covered, so none can be dropped', 'No covered own segments to drop']);
        }
    }
    if (level === 'Protect') {
        const foldMB = after.unsealed + s.unsyncedDevice;
        const n = round(after.unsealed * 1e6 / 980 + s.unsyncedDevice * 1e6 / 98);
        after.unsealed = 0;
        after.device = max(0, after.device - s.unsyncedDevice);
        after.summaries += foldMB * 0.05;                         // folded into small summaries
        steps.push([`Force all sims into summary mode and fold the oldest unsynced statements into summaries (truncated_statements: ≈${n})`, `Force summary mode; fold oldest unsynced (truncated_statements ≈${n})`]);
    }
    if (level === 'Offer') steps.push(['Nothing is discarded. A backup card appears at the end of the next section.', 'Nothing discarded; a backup card appears.']);
    if (level === 'Normal') steps.push(['Nothing is discarded; the meter alone shows the state.', 'Nothing discarded; only the meter.']);
    return { after, steps };
}

// ---------- drawing ----------
function draw() {
    updateCanvasSize();
    hitBoxes = [];
    stroke('silver');
    strokeWeight(1);
    fill('aliceblue');
    rect(0, 0, canvasWidth, drawHeight);
    fill('white');
    rect(0, drawHeight, canvasWidth, controlHeight);

    noStroke();
    fill('black');
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    textSize(canvasWidth < 500 ? 18 : 21);
    text('Storage Meter Pressure Lab', canvasWidth / 2, 7);
    textStyle(NORMAL);

    const s = currentState();
    const lv = levelOf(s);
    const revealed = predicted !== null;
    const act = applyLevel(s, lv.level);

    let y = drawMeter(s, 36);
    y = drawSlices(s, act, revealed, y + 8);
    drawLevel(s, lv, act, revealed, y + 6);
    drawControlLabels(s);
    drawTooltip();
}

function drawMeter(s, y0) {
    const x = margin, w = canvasWidth - 2 * margin;
    const narrow = canvasWidth < 560;
    const status = s.pct >= 95 ? 'Full' : s.pct >= 80 ? 'Nearly full' : s.pct >= 60 ? 'Filling up' : 'Plenty of room';
    const meterText = nf(s.pct, 1, 1) + '% of 10 MB \u00b7 ' + status;
    const events = round(EVENTS_PER_DAY[s.mode] / 24 * s.hours);
    const syncLine = s.hours === 0 ? 'Synced: nothing waiting to upload'
        : 'Oldest unsynced event: ' + s.hours + ' h old \u00b7 about ' + events + ' events waiting';
    const backupLine = 'Last verified backup: ' + (s.days === 0 ? 'today' : s.days + (s.days === 1 ? ' day ago' : ' days ago'));
    const persistLine = 'Persistent storage: ' + persistence + (persistNote ? ' (' + persistNote + ')' : '');
    textSize(14);
    let lines;
    if (narrow) {
        lines = [syncLine, backupLine.replace('Last verified backup', 'Backup') + ' \u00b7 Persistent: ' + persistence];
        if (persistNote) lines = lines.concat(wrapLines('(' + persistNote + ')', w - 20));
    } else {
        lines = [syncLine + '   \u00b7   ' + backupLine].concat(wrapLines(persistLine, w - 20));
    }
    const textTop = narrow ? 50 : 36;
    const h = textTop + lines.length * 19 + 6;
    stroke('lightsteelblue');
    fill('white');
    rect(x, y0, w, h, 8);
    // fill bar with a text percentage and a status word, so meaning never depends on color
    const bw = narrow ? w - 20 : w * 0.55;
    const bx = x + 10, by = y0 + 10;
    fill('#eef2f6');
    stroke('gray');
    rect(bx, by, bw, 20, 4);
    noStroke();
    fill('steelblue');
    rect(bx + 1, by + 1, max(0, (bw - 2) * min(1, s.pct / 100)), 18, 3);
    fill('black');
    textSize(15);
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    if (narrow) text(meterText, bx, by + 31);
    else text(meterText, bx + bw + 10, by + 10);
    textStyle(NORMAL);
    textSize(14);
    fill('#222');
    lines.forEach((ln, i) => text(fitText(ln, w - 20), bx, y0 + textTop + 9 + i * 19));
    return y0 + h;
}

function drawSlices(s, act, revealed, y0) {
    const x = margin + 10, w = canvasWidth - 2 * margin - 20;
    const scale = w / BUDGET_MB;
    noStroke();
    fill('black');
    textSize(15);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    text('Local database by slice', x, y0);
    textStyle(NORMAL);
    textSize(13);
    fill('#444');
    textAlign(RIGHT, TOP);
    text('bar width = the 10 MB budget', x + w, y0 + 2);

    // threshold marks across both bars
    const narrow = canvasWidth < 560;
    const barH = 24, nowY = y0 + (narrow ? 34 : 38), afterY = nowY + barH + (narrow ? 22 : 26);
    [[60, 'Offer 60%'], [80, 'Reclaim 80%'], [95, '95%']].forEach(([p, lab]) => {
        const tx = x + w * p / 100;
        stroke('dimgray');
        drawingContext.setLineDash([3, 3]);
        line(tx, nowY - 6, tx, afterY + barH + 2);
        drawingContext.setLineDash([]);
        noStroke();
        fill('#333');
        textSize(12);
        textAlign(p === 95 ? LEFT : CENTER, BOTTOM);
        text(canvasWidth < 500 ? p + '%' : lab, p === 95 ? tx + 2 : tx, nowY - 6);
    });
    drawStack(s.slices, x, nowY, scale, barH, 'Now');
    if (revealed) drawStack(act.after, x, afterY, scale, barH, 'After ' + levelOf(s).level);
    else {
        noStroke();
        fill('#555');
        textSize(14);
        textAlign(LEFT, CENTER);
        text('After the level acts: predict the level first', x, afterY + barH / 2);
    }
    // legend with sizes (hover explains pruning)
    let lx = x, ly = afterY + barH + 10;
    textSize(13);
    SLICES.forEach((sl, i) => {
        const label = (narrow ? sl.short : sl.name) + ' ' + nf(s.slices[sl.key], 1, 2) + ' MB';
        let lw = 16 + fontWidth(label) + 14;
        if (narrow) { lw = w / 2; lx = x + (i % 2) * w / 2; if (i === 2) ly += 20; }
        else if (lx + lw > x + w && lx > x) { lx = x; ly += 20; }
        noStroke();
        fill(sl.color);
        rect(lx, ly + 2, 12, 12, 2);
        fill('#222');
        textAlign(LEFT, TOP);
        text(label, lx + 16, ly + 1);
        hitBoxes.push({ x: lx, y: ly, w: lw - 8, h: 17, tip: sl.tip });
        lx += lw;
    });
    return ly + 20;
}

function drawStack(sl, x, y, scale, h, tag) {
    let cx = x;
    stroke('gray');
    fill('white');
    rect(x, y, BUDGET_MB * scale, h, 3);
    SLICES.forEach(def => {
        const v = sl[def.key];
        const w = v * scale;
        if (w > 0.5) {
            noStroke();
            fill(def.color);
            rect(cx, y + 1, w, h - 2);
            hitBoxes.push({ x: cx, y: y, w: max(w, 3), h: h, tip: def.tip });
        }
        cx += w;
    });
    const total = sl.summaries + sl.unsealed + sl.device + sl.mirrored;
    noStroke();
    fill('#222');
    textSize(13);
    textAlign(LEFT, BOTTOM);
    text(tag + ': ' + nf(total, 1, 2) + ' MB', x, y - 1);
}

function drawLevel(s, lv, act, revealed, y0) {
    const x = margin, w = canvasWidth - 2 * margin;
    const h = drawHeight - y0 - 8;
    const narrow = canvasWidth < 560;
    if (h < 30) return;
    stroke('lightsteelblue');
    fill('white');
    rect(x, y0, w, h, 8);
    // level badge: a block on wide screens, a pill above the text on narrow ones
    let tx, tw, ty;
    noStroke();
    if (!narrow) {
        const bw = 118;
        fill(revealed ? LEVEL_COLOR[lv.level] : 'gainsboro');
        rect(x + 8, y0 + 8, bw, 46, 6);
        fill(revealed ? 'white' : '#333');
        textAlign(CENTER, CENTER);
        textSize(13);
        text('Level', x + 8 + bw / 2, y0 + 19);
        textStyle(BOLD);
        textSize(18);
        text(revealed ? lv.level : '?', x + 8 + bw / 2, y0 + 39);
        textStyle(NORMAL);
        fill('#222');
        textSize(13);
        textAlign(LEFT, TOP);
        text('Score ' + score.right + '/' + score.tries, x + 10, y0 + 60);
        tx = x + bw + 18; tw = w - bw - 26; ty = y0 + 8;
    } else {
        const label = 'Level: ' + (revealed ? lv.level : '?');
        textSize(15);
        textStyle(BOLD);
        const pw = fontWidth(label) + 18;
        fill(revealed ? LEVEL_COLOR[lv.level] : 'gainsboro');
        rect(x + 8, y0 + 6, pw, 24, 12);
        fill(revealed ? 'white' : '#333');
        textAlign(LEFT, CENTER);
        text(label, x + 17, y0 + 18);
        textStyle(NORMAL);
        fill('#222');
        textSize(13);
        text('Score ' + score.right + '/' + score.tries, x + pw + 16, y0 + 18);
        tx = x + 10; tw = w - 20; ty = y0 + 36;
    }

    // feedback text
    const lines = [];
    if (!revealed) {
        lines.push({ t: 'Which pressure level does this state trigger? Pick Normal, Offer, Reclaim or Protect below.' });
        if (!narrow) lines.push({ t: 'Check the percentage, the days since backup and the age of unsynced events.' });
    } else {
        const ok = predicted === lv.level;
        lines.push({ t: (ok ? '\u2713 Correct: ' : '\u2717 You predicted ' + predicted + '; it is ') + lv.level + '.',
                     b: true, c: ok ? '#1a5e20' : '#b00020' });
        const fired = lv.triggers.filter(t => t[0] === lv.level).map(t => t[1]);
        lines.push({ t: (narrow ? 'Rule: ' : 'Rule that fired: ') +
                     (fired.length ? fired.join('; ') : 'none of the Offer, Reclaim or Protect conditions holds') + '.' });
        if (!narrow && lv.triggers.some(t => RANK[t[0]] < RANK[lv.level])) {
            lines.push({ t: 'Lower-level conditions also hold, but the highest level wins.' });
        }
        act.steps.forEach((st, i) => lines.push({ t: (act.steps.length > 1 ? (i + 1) + '. ' : '') + (narrow ? st[1] : st[0]) }));
    }
    textSize(14);
    textAlign(LEFT, TOP);
    let yy = ty;
    const maxY = y0 + h - 4;
    for (const ln of lines) {
        fill(ln.c || '#222');
        textStyle(ln.b ? BOLD : NORMAL);
        for (const piece of wrapLines(ln.t, tw)) {
            if (yy + 17 > maxY) break;
            text(piece, tx, yy);
            yy += 17;
        }
        yy += 2;
    }
    textStyle(NORMAL);
}

function drawControlLabels(s) {
    noStroke();
    fill('black');
    textSize(canvasWidth < 500 ? 14 : 15);
    textAlign(LEFT, CENTER);
    controlLabels.forEach(l => {
        if (l.key === 'size') text('Database size: ' + nf(s.size, 1, 2) + ' MB', l.x, l.y);
        if (l.key === 'backup') text('Days since backup: ' + s.days, l.x, l.y);
        if (l.key === 'unsynced') text('Oldest unsynced: ' + s.hours + ' h', l.x, l.y);
        if (l.key === 'mode') text('Mode:', l.x, l.y);
        if (l.key === 'predict') {
            textStyle(BOLD);
            text(canvasWidth < 500 ? 'Predict:' : 'Predict the level:', l.x, l.y);
            textStyle(NORMAL);
        }
    });
}

function drawTooltip() {
    if (mouseY < 0 || mouseY > drawHeight) return;
    let tip = null;
    for (let i = hitBoxes.length - 1; i >= 0; i--) {
        const b = hitBoxes[i];
        if (mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h) { tip = b.tip; break; }
    }
    if (!tip) return;
    textSize(14);
    const w = min(300, canvasWidth - 20);
    const lines = wrapLines(tip, w - 16);
    const h = lines.length * 18 + 12;
    let x = mouseX + 14, y = mouseY + 14;
    if (x + w > canvasWidth - 4) x = mouseX - w - 10;
    if (x < 4) x = 4;
    if (y + h > drawHeight - 2) y = max(4, mouseY - h - 10);
    stroke('dimgray');
    fill(255, 255, 240, 245);
    rect(x, y, w, h, 6);
    noStroke();
    fill('#111');
    textAlign(LEFT, TOP);
    lines.forEach((ln, i) => text(ln, x + 8, y + 7 + i * 18));
}

// ---------- events ----------
function stateChanged() {
    predicted = null;               // any change hides the level until the next prediction
    predictButtons.forEach(b => b.style('font-weight', 'normal'));
    describeState();
}

function makePrediction(lv) {
    if (predicted !== null) return;  // one prediction per state
    predicted = lv;
    const actual = levelOf(currentState()).level;
    score.tries++;
    if (lv === actual) score.right++;
    predictButtons.forEach(b => b.style('font-weight', b.html() === lv ? 'bold' : 'normal'));
    describeState();
}

function advanceTenDays() {
    const s = currentState();
    sizeSlider.value(min(10, s.size + 10 * s.rate));
    backupSlider.value(min(30, s.days + 10));
    // an automatic sync keeps "nothing waiting" at zero; data already waiting keeps aging
    if (s.hours > 0) unsyncedSlider.value(min(72, s.hours + 240));
    stateChanged();
}

function requestPersistence() {
    const choice = persistSelect.value();
    if (choice === 'Firefox prompt') {
        persistence = 'granted';
        persistNote = 'the student chose Allow in Firefox’s prompt';
    } else if (choice === 'Chrome silent grant') {
        persistence = 'granted';
        persistNote = 'Chrome decided silently';
    } else {
        persistence = 'denied';
        persistNote = 'the browser may clear this copy; the synced record is safe';
    }
    // persistence protects against eviction; it does not change the 10 MB budget or the level
}

function resetLab() {
    sizeSlider.value(0.34);
    backupSlider.value(2);
    unsyncedSlider.value(0);
    modeRadio.selected('summary');
    persistSelect.selected('Firefox prompt');
    persistence = 'not requested';
    persistNote = '';
    score = { right: 0, tries: 0 };
    stateChanged();
}

function describeState() {
    const s = currentState();
    describe('Storage Meter Pressure Lab. The local LRS-Lite database holds ' + nf(s.size, 1, 2) +
        ' MB of a 10 MB budget (' + nf(s.pct, 1, 1) + '%), the last backup was ' + s.days +
        ' days ago and the oldest unsynced event is ' + s.hours + ' hours old. ' +
        (predicted ? 'The pressure level is ' + levelOf(s).level + '.' :
                     'Predict the pressure level with the Normal, Offer, Reclaim and Protect buttons.'));
}

// ---------- text helpers ----------
function wrapLines(str, w) {
    const words = str.split(' ');
    const lines = [];
    let cur = '';
    for (const wd of words) {
        const test = cur ? cur + ' ' + wd : wd;
        if (fontWidth(test) > w && cur) { lines.push(cur); cur = wd; } else cur = test;
    }
    if (cur) lines.push(cur);
    return lines;
}

function fitText(str, w) {
    if (fontWidth(str) <= w) return str;
    let s = str;
    while (s.length > 1 && fontWidth(s + '…') > w) s = s.slice(0, -1);
    return s + '…';
}

// ---------- responsive design ----------
function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    layoutControls();
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) canvasWidth = container.offsetWidth;
}
