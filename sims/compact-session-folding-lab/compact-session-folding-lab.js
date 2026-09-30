// Compact Session Folding Lab - p5.js
// CANVAS_HEIGHT: 600
// Learning objective (Analyze / distinguish): the learner distinguishes which interactions
// Compact mode folds into a session summary, which pass through as their own statements,
// and which Loss of Focus Event ends the session.
// Model (Chapter 22, lrs-lite-sim.js as described there):
//   Full mode:    every slider step past the deadband (1 unit), every Start/Pause press and
//                 every run between them is its own statement. Leaving emits nothing extra.
//   Compact mode: the same events fold into an in-memory session; a loss of focus closes it
//                 and emits ONE experienced summary with statements_represented.
//   Answers are never folded: a Check emits an `answered` statement in BOTH modes at once,
//   opens a session if none is open, and never changes statements_represented.
// Layout: the canvas height is fixed. The control rows wrap on narrow screens, so the
// drawing region takes whatever height the controls leave (drawHeight = canvasHeight -
// controlHeight). Below 700px the practice pane stacks above the two stream columns.

// ---------- canvas and layout ----------
let canvasWidth = 700;
let canvasHeight = 600;          // fixed: equals CANVAS_HEIGHT
let controlHeight = 84;          // recomputed by layoutControls()
let drawHeight = canvasHeight - controlHeight;
let margin = 10;
let sliderLeftMargin = 98;       // room for the "Gravity: 10" label before the slider
let defaultTextSize = 16;

// ---------- controls ----------
let gravitySlider, startButton, choiceRadio, checkButton;
let hideButton, scrollButton, idleButton, doneButton, resetButton;
let controlLabels = [];          // drawn text labels placed by layoutControls()

// ---------- practice sim state ----------
let isRunning = false;
let runStartMs = 0;
let ballT = 0;                   // seconds into the current bounce
let lastGravity = 5;
let feedback = '';               // result of the last Check

// ---------- statement streams ----------
let fullStream = [];             // {kind, verb, text, tip} or {kind:'sep', text, tip}
let compactStream = [];          // answered and summary statements
let session = null;              // the open compact session, or null
let sessionCount = 0;
let lastComparison = '';         // e.g. "last session: 8 Full statements vs 1 summary"
let message = 'Move the slider, press Start or answer the question to open a session.';
let hoverTip = null;             // {x, y, text} tooltip under the mouse
let hitBoxes = [];               // [{x, y, w, h, tip}] rebuilt every frame

// Okabe-Ito based tile colors (color-blind safe; every tile also names its verb)
const TILE = {
    interacted: { fill: '#DCEBF7', edge: '#0072B2' },
    run:        { fill: '#D9F0E6', edge: '#009E73' },
    answered:   { fill: '#FBE7C6', edge: '#E69F00' },
    summary:    { fill: '#F1DFEC', edge: '#CC79A7' },
    sep:        { fill: 'white',   edge: 'silver' }
};

// Loss-of-focus signals (Chapter 22 table)
const SIGNALS = {
    hide:   { reason: 'tab-hidden',    how: 'visibilitychange became hidden' },
    scroll: { reason: 'scrolled-away', how: 'IntersectionObserver saw under 25% of the frame for 10 s' },
    idle:   { reason: 'idle',          how: 'no pointer, key or wheel input for 90 s while not running' },
    done:   { reason: 'explicit-end',  how: 'the sim called end() from its Done button' }
};

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));
    textSize(defaultTextSize);

    gravitySlider = createSlider(1, 10, 5, 1);
    gravitySlider.input(onGravityInput);

    startButton = createButton('Start');
    startButton.mousePressed(toggleRun);
    startButton.style('width', '66px');     // same width for Start and Pause

    choiceRadio = createRadio('answer');
    choiceRadio.option('less time');
    choiceRadio.option('more time');
    choiceRadio.style('font-size', '15px');
    choiceRadio.style('white-space', 'nowrap');

    checkButton = createButton('Check');
    checkButton.mousePressed(checkAnswer);

    hideButton = createButton('Hide tab');
    hideButton.mousePressed(() => lossOfFocus('hide'));
    scrollButton = createButton('Scroll away 10 s');
    scrollButton.mousePressed(() => lossOfFocus('scroll'));
    idleButton = createButton('Sit idle 90 s');
    idleButton.mousePressed(() => lossOfFocus('idle'));
    doneButton = createButton('Click Done');
    doneButton.mousePressed(() => lossOfFocus('done'));
    resetButton = createButton('Reset lab');
    resetButton.mousePressed(resetLab);

    [gravitySlider, startButton, choiceRadio, checkButton, hideButton, scrollButton,
     idleButton, doneButton, resetButton].forEach(c => c.parent(document.querySelector('main')));
    [startButton, checkButton, hideButton, scrollButton, idleButton, doneButton, resetButton]
        .forEach(b => b.style('font-size', '15px'));

    layoutControls();
    describe('Compact Session Folding Lab. Left: a practice bouncing-ball MicroSim with a ' +
        'gravity slider, a Start/Pause button and a two-choice question with a Check button. ' +
        'Right: two columns list the xAPI statements that Full mode and Compact mode emit. ' +
        'Slider steps, presses and runs appear one by one in the Full column but are folded ' +
        'into an open session card in the Compact column. Answers appear in both columns at ' +
        'once. Buttons for Hide tab, Scroll away, Sit idle and Click Done close the session ' +
        'and turn the card into one summary statement.');
}

// ---------- layout of the DOM controls (wraps into rows on narrow screens) ----------
function layoutControls() {
    const rowH = 36, gap = 8, x0 = margin;
    const right = canvasWidth - margin;
    const sliderW = canvasWidth < 500 ? 120 : 140;
    gravitySlider.size(sliderW);
    // make every control absolute first, so offsetWidth is its natural width
    [gravitySlider, startButton, choiceRadio, checkButton, hideButton, scrollButton,
     idleButton, doneButton, resetButton].forEach(c => c.position(0, drawHeight));
    const groups = [
        [ { label: 'gravity', w: sliderLeftMargin - x0 - 4 }, { el: gravitySlider, w: sliderW },
          { el: startButton }, { el: choiceRadio }, { el: checkButton } ],
        [ { label: 'end', w: 96 }, { el: hideButton }, { el: scrollButton }, { el: idleButton },
          { el: doneButton }, { el: resetButton } ]
    ];
    // first pass: count rows so the drawing region can take the rest of the fixed height
    const placements = [];
    let row = 0;
    groups.forEach((items, gi) => {
        if (gi > 0) row++;
        let x = x0;
        items.forEach(it => {
            const w = it.w || it.el.elt.offsetWidth || 80;
            if (x > x0 && x + w > right) { row++; x = x0; }
            placements.push({ it, x, row });
            x += w + gap;
        });
    });
    const rows = row + 1;
    controlHeight = rows * rowH + 12;
    drawHeight = canvasHeight - controlHeight;
    controlLabels = [];
    placements.forEach(p => {
        const y = drawHeight + 8 + p.row * rowH;
        if (p.it.label) controlLabels.push({ key: p.it.label, x: p.x, y: y + 13 });
        else {
            // radios are a little taller than buttons; nudge them to share the row's centre
            const dy = p.it.el === choiceRadio ? 3 : (p.it.el === gravitySlider ? 4 : 0);
            p.it.el.position(p.x, y + dy);
        }
    });
}

function draw() {
    updateCanvasSize();
    hitBoxes = [];

    // drawing region and control region
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
    textStyle(BOLD);
    textSize(canvasWidth < 500 ? 18 : 21);
    text('Compact Session Folding Lab', canvasWidth / 2, 7);
    textStyle(NORMAL);

    const L = paneLayout();
    advanceBall();
    drawPracticePane(L.pane);
    drawStreamColumn(L.fullCol, 'Full mode stream', fullStream, false);
    drawStreamColumn(L.compactCol, 'Compact mode stream', compactStream, true);
    drawTotals();
    drawControlLabels();
    drawTooltip();
}

// Pane geometry: side by side at 700px and wider, stacked below that
function paneLayout() {
    const top = 36;
    const bottom = drawHeight - 30;          // leave room for the totals line
    if (canvasWidth >= 700) {
        const pw = max(220, floor(canvasWidth * 0.31));
        const colX = margin + pw + 10;
        const colW = (canvasWidth - colX - margin - 8) / 2;
        return {
            stacked: false,
            pane: { x: margin, y: top, w: pw, h: bottom - top },
            fullCol: { x: colX, y: top, w: colW, h: bottom - top },
            compactCol: { x: colX + colW + 8, y: top, w: colW, h: bottom - top }
        };
    }
    const ph = 150;
    const colY = top + ph + 8;
    const colW = (canvasWidth - 2 * margin - 8) / 2;
    return {
        stacked: true,
        pane: { x: margin, y: top, w: canvasWidth - 2 * margin, h: ph },
        fullCol: { x: margin, y: colY, w: colW, h: bottom - colY },
        compactCol: { x: margin + colW + 8, y: colY, w: colW, h: bottom - colY }
    };
}

// ---------- practice MicroSim ----------
function gPixels() { return gravitySlider.value() * 60; }   // px/s^2, illustrative scale

function advanceBall() {
    if (!isRunning) return;
    ballT += deltaTime / 1000;
}

function drawPracticePane(p) {
    stroke('silver');
    fill('white');
    rect(p.x, p.y, p.w, p.h, 8);
    noStroke();
    fill('black');
    textAlign(LEFT, TOP);
    textSize(15);
    textStyle(BOLD);
    text('Practice MicroSim', p.x + 8, p.y + 6);
    textStyle(NORMAL);

    // ball box: a ball bouncing to a fixed apex; stronger gravity = shorter bounce
    const stacked = canvasWidth < 700;
    const bx = p.x + 8, by = p.y + 28;
    const bw = stacked ? min(150, p.w * 0.38) : p.w - 16;
    const bh = stacked ? p.h - 36 : min(165, p.h * 0.38);
    fill('aliceblue');
    stroke('lightsteelblue');
    rect(bx, by, bw, bh, 4);
    stroke('gray');
    line(bx + 4, by + bh - 6, bx + bw - 4, by + bh - 6);
    const apex = bh - 44;                             // keep the status line clear
    const g = gPixels();
    const T = 2 * sqrt(2 * apex / g);                  // bounce period
    const t = ballT % T;
    const h = (g * T / 2) * t - 0.5 * g * t * t;       // height above the floor
    noStroke();
    fill('#D55E00');
    circle(bx + bw / 2, by + bh - 6 - 9 - h, 18);
    fill('#333');
    textSize(14);
    textAlign(LEFT, TOP);
    const state = (isRunning ? 'Running' : 'Paused') + ' · ' + nf(T, 1, 2) + ' s';
    text(fitText(bw > 180 ? state + ' per bounce' : state, bw - 8), bx + 5, by + 4);

    // question, feedback and the latest message
    let qx, qy, qw;
    if (stacked) { qx = bx + bw + 10; qy = p.y + 6; qw = p.x + p.w - qx - 8; }
    else { qx = p.x + 8; qy = by + bh + 8; qw = p.w - 16; }
    fill('black');
    textSize(15);
    textAlign(LEFT, TOP);
    const q = 'Question: with stronger gravity, does each bounce take less time or more time?';
    const qLines = wrapLines(q, qw);
    qLines.forEach((ln, i) => text(ln, qx, qy + i * 18));
    let yy = qy + qLines.length * 18 + 4;
    if (feedback) {
        fill(feedback.startsWith('✓') ? '#1a5e20' : '#b00020');
        textStyle(BOLD);
        const fLines = wrapLines(feedback, qw);
        fLines.forEach((ln, i) => text(ln, qx, yy + i * 18));
        textStyle(NORMAL);
        yy += fLines.length * 18 + 4;
    }
    fill('#333');
    textSize(14);
    const mLines = wrapLines(message, qw);
    const maxLines = floor((p.y + p.h - 6 - yy) / 17);
    mLines.slice(0, max(0, maxLines)).forEach((ln, i) => text(ln, qx, yy + i * 17));
}

// ---------- stream columns ----------
function drawStreamColumn(c, title, list, isCompact) {
    stroke('silver');
    fill(255, 255, 255, 200);
    rect(c.x, c.y, c.w, c.h, 8);
    noStroke();
    fill('black');
    textAlign(LEFT, TOP);
    textSize(15);
    textStyle(BOLD);
    text(fitText(title, c.w - 16), c.x + 8, c.y + 6);
    textStyle(NORMAL);
    textSize(14);
    fill('#444');
    const n = list.filter(e => e.kind !== 'sep').length;
    text(n + (n === 1 ? ' statement' : ' statements'), c.x + 8, c.y + 25);

    let listTop = c.y + 46;
    let listBottom = c.y + c.h - 6;
    // the open session card sits at the bottom of the Compact column
    if (isCompact && session) {
        const cardH = 118;
        drawSessionCard(c.x + 6, listBottom - cardH, c.w - 12, cardH);
        listBottom -= cardH + 6;
    } else if (isCompact) {
        fill('#666');
        textAlign(LEFT, BOTTOM);
        text('No open session', c.x + 8, listBottom);
        listBottom -= 22;
    }
    // show the newest tiles that fit, oldest first
    const heights = list.map(e => e.kind === 'summary' ? 42 : 26);
    let used = 0, first = list.length;
    for (let i = list.length - 1; i >= 0; i--) {
        if (used + heights[i] + 3 > listBottom - listTop - (i > 0 ? 18 : 0)) break;
        used += heights[i] + 3;
        first = i;
    }
    let y = listTop;
    if (list.length === 0) {
        fill('#666');
        textAlign(LEFT, TOP);
        const hint = isCompact ? 'Answers and session summaries appear here.'
                               : 'Every statement appears here as it is emitted.';
        wrapLines(hint, c.w - 16).forEach((ln, i) => text(ln, c.x + 8, y + i * 18));
    }
    if (first > 0) {
        fill('#555');
        textAlign(LEFT, TOP);
        text('▲ ' + first + ' earlier', c.x + 8, y);
        y += 18;
    }
    for (let i = first; i < list.length; i++) {
        drawTile(list[i], c.x + 6, y, c.w - 12, heights[i]);
        y += heights[i] + 3;
    }
}

function drawTile(e, x, y, w, h) {
    const col = TILE[e.kind];
    if (e.kind === 'sep') {
        stroke('darkgray');
        drawingContext.setLineDash([4, 4]);
        line(x, y + h / 2, x + w, y + h / 2);
        drawingContext.setLineDash([]);
        noStroke();
        fill('#555');
        textSize(13);
        textAlign(CENTER, CENTER);
        const t = fitText(e.text, w - 8);
        const tw = fontWidth(t) + 8;
        fill('aliceblue');
        rect(x + w / 2 - tw / 2, y + 4, tw, h - 8);
        fill('#555');
        text(t, x + w / 2, y + h / 2);
    } else {
        stroke(col.edge);
        strokeWeight(e.fresh > 0 ? 2.5 : 1);
        fill(col.fill);
        rect(x, y, w, h, 5);
        strokeWeight(1);
        noStroke();
        fill('#111');
        textSize(14);
        textAlign(LEFT, CENTER);
        const narrow = w < 200 && e.short;
        if (e.kind === 'summary') {
            textStyle(BOLD);
            text(fitText(narrow ? e.short : e.text, w - 10), x + 6, y + 12);
            textStyle(NORMAL);
            text(fitText(e.text2, w - 10), x + 6, y + 30);
        } else {
            text(fitText(narrow ? e.short : e.text, w - 10), x + 6, y + h / 2);
        }
        if (e.fresh > 0) e.fresh--;
    }
    hitBoxes.push({ x, y, w, h, tip: e.tip });
}

function drawSessionCard(x, y, w, h) {
    stroke('#CC79A7');
    drawingContext.setLineDash([6, 4]);
    fill('white');
    rect(x, y, w, h, 6);
    drawingContext.setLineDash([]);
    noStroke();
    fill('#6a2c57');
    textAlign(LEFT, TOP);
    textSize(14);
    textStyle(BOLD);
    text(fitText('Open session ' + session.n + ' (in memory)', w - 10), x + 6, y + 5);
    textStyle(NORMAL);
    fill('#111');
    const gv = session.controls.gravity;
    const lines = [
        'interaction_count: ' + session.interactions,
        'gravity: n ' + gv.n + (gv.n ? ', min ' + gv.min + ', max ' + gv.max : ''),
        'start_pause: n ' + session.controls.start_pause.n,
        'runs: ' + session.runs,
        'statements_represented: ' + represented(session)
    ];
    lines.forEach((ln, i) => text(fitText(ln, w - 10), x + 6, y + 24 + i * 18));
    hitBoxes.push({ x, y, w, h, tip: 'The open session lives in memory. Slider steps, presses ' +
        'and runs only update these counters; nothing is emitted until a Loss of Focus Event ' +
        'closes the session. statements_represented = interactions + runs. Answers never ' +
        'change it.' });
}

function drawTotals() {
    const full = fullStream.filter(e => e.kind !== 'sep').length;
    const compact = compactStream.length;
    noStroke();
    fill('black');
    textAlign(CENTER, CENTER);
    textSize(canvasWidth < 500 ? 14 : 16);
    let s = 'Emitted so far: Full ' + full + ' · Compact ' + compact;
    if (lastComparison && canvasWidth >= 560) s += '   (' + lastComparison + ')';
    text(fitText(s, canvasWidth - 20), canvasWidth / 2, drawHeight - 15);
}

function drawControlLabels() {
    noStroke();
    fill('black');
    textSize(15);
    textAlign(LEFT, CENTER);
    controlLabels.forEach(l => {
        if (l.key === 'gravity') text('Gravity: ' + gravitySlider.value(), l.x, l.y);
        if (l.key === 'end') {
            textStyle(BOLD);
            text('End session:', l.x, l.y);
            textStyle(NORMAL);
        }
    });
}

function drawTooltip() {
    hoverTip = null;
    if (mouseY < 0 || mouseY > drawHeight) return;
    for (const b of hitBoxes) {
        if (mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h) {
            hoverTip = b.tip;
            break;
        }
    }
    if (!hoverTip) return;
    textSize(14);
    const w = min(300, canvasWidth - 20);
    const lines = wrapLines(hoverTip, w - 16);
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

// ---------- event handling (the lab's model of lrs-lite-sim.js) ----------
function openSessionIfNeeded() {
    if (session) return;
    sessionCount++;
    session = { n: sessionCount, interactions: 0, runs: 0,
                controls: { gravity: { n: 0, min: null, max: null }, start_pause: { n: 0 } },
                fullBefore: fullStream.filter(e => e.kind !== 'sep').length,
                answers: 0 };
}

function represented(s) { return s.interactions + s.runs; }

function pushFull(e) { e.fresh = 30; fullStream.push(e); }
function pushCompact(e) { e.fresh = 30; compactStream.push(e); }

function onGravityInput() {
    const v = gravitySlider.value();
    if (v === lastGravity) return;       // deadband of 1 unit: every integer step counts
    lastGravity = v;
    openSessionIfNeeded();
    pushFull({ kind: 'interacted', text: 'interacted · gravity → ' + v,
        short: 'interacted · g → ' + v,
        tip: 'interacted: a slider step past the deadband (1 unit), gravity = ' + v + '. Full ' +
             'mode emits one statement per step. Compact mode folds it into the open session: ' +
             'interaction_count +1 and the gravity control’s n, min and max update.' });
    session.interactions++;
    const gv = session.controls.gravity;
    gv.n++;
    gv.min = gv.min === null ? v : min(gv.min, v);
    gv.max = gv.max === null ? v : max(gv.max, v);
    message = 'Slider step: 1 statement in Full, folded into session ' + session.n + ' in Compact.';
}

function toggleRun() {
    openSessionIfNeeded();
    if (!isRunning) {
        isRunning = true;
        runStartMs = millis();
        startButton.html('Pause');
        pushFull({ kind: 'interacted', text: 'interacted · Start',
            tip: 'interacted: the Start press. Full mode emits it. Compact mode folds it into ' +
                 'the session (interaction_count +1, start_pause n +1).' });
        session.interactions++;
        session.controls.start_pause.n++;
        message = 'Start: 1 statement in Full, folded in Compact. The run is now in progress.';
    } else {
        pushFull({ kind: 'interacted', text: 'interacted · Pause',
            tip: 'interacted: the Pause press. Full mode emits it. Compact mode folds it into ' +
                 'the session (interaction_count +1, start_pause n +1).' });
        session.interactions++;
        session.controls.start_pause.n++;
        endRun();
        message = 'Pause: Full emits the press and the run (2 statements). Compact counts one more run.';
    }
}

// Close the run in progress: Full emits it as an experienced statement, Compact counts it
function endRun() {
    const secs = (millis() - runStartMs) / 1000;
    isRunning = false;
    startButton.html('Start');
    pushFull({ kind: 'run', text: 'experienced · run ' + nf(secs, 1, 1) + ' s',
        short: 'experienced · run',
        tip: 'experienced: one run between Start and Pause (' + nf(secs, 1, 1) + ' s). Full ' +
             'mode emits it as its own statement. Compact mode records it as one of the ' +
             'session’s runs, which counts toward statements_represented.' });
    session.runs++;
}

function checkAnswer() {
    const choice = choiceRadio.value();
    if (!choice) {
        message = 'Choose an answer first, then press Check.';
        return;
    }
    const ok = choice === 'less time';
    openSessionIfNeeded();         // an answer still opens the session
    session.answers++;
    feedback = ok ? '✓ Correct: stronger gravity, shorter bounce.'
                  : '✗ Not quite: watch the bounce time as gravity rises.';
    const label = 'answered · success: ' + ok + (ok ? ' ✓' : ' ✗');
    const short = 'answered · ' + ok + (ok ? ' ✓' : ' ✗');
    const tip = 'answered: a checked answer with result.success = ' + ok + '. Answers are never ' +
        'folded: both modes emit it at once, it keeps its own question identity and order, and ' +
        'it does not change the session’s statements_represented.';
    pushFull({ kind: 'answered', text: label, short, tip });
    pushCompact({ kind: 'answered', text: label, short, tip });
    message = 'Check: 1 answered statement in each column, emitted immediately. The session card ' +
              'does not change.';
}

function lossOfFocus(key) {
    const sig = SIGNALS[key];
    if (!session) {
        message = sig.reason + ': no session is open, so nothing is emitted. A visit with ' +
                  'neither interactions nor answers emits nothing.';
        return;
    }
    if (key === 'idle' && isRunning) {
        message = 'Idle does not fire while the sim is running: a running Start/Pause sim ' +
                  'counts as busy. Press Pause first.';
        return;
    }
    let note = '';
    if (isRunning) { endRun(); note = ' The run in progress was closed first.'; }
    const s = session;
    const rep = represented(s);
    const gv = s.controls.gravity;
    const controlsText = (gv.n ? 'gravity {n ' + gv.n + ', min ' + gv.min + ', max ' + gv.max + '}' : '') +
        (s.controls.start_pause.n ? (gv.n ? ', ' : '') + 'start_pause {n ' + s.controls.start_pause.n + '}' : '');
    const zero = rep === 0;
    pushCompact({
        kind: 'summary',
        text: 'experienced · summary',
        short: 'experienced · summary',
        text2: 'represents ' + rep + ' · ' + sig.reason,
        tip: 'experienced: the summary of session ' + s.n + ', emitted because of a Loss of Focus ' +
             'Event (' + sig.how + '). end_reason: ' + sig.reason + '. statements_represented: ' +
             rep + ' (' + s.interactions + ' interactions + ' + s.runs + ' runs), ' +
             'interaction_count: ' + s.interactions + ', runs: ' + s.runs + ', controls: ' +
             (controlsText || '{} (empty)') + '.' +
             (zero ? ' Only an answer opened this session, so nothing was folded, but the summary ' +
                     'still carries the duration.' : '')
    });
    pushFull({ kind: 'sep', text: 'session ' + s.n + ' ended: ' + sig.reason,
        tip: 'Full mode emits nothing extra when the session ends: every interaction was already ' +
             'sent as it happened.' });
    lastComparison = 'last session: ' + rep + ' Full vs 1 summary';
    message = sig.reason + ' closed session ' + s.n + ': ' + rep + ' Full-mode statement' +
              (rep === 1 ? '' : 's') + ' \u2192 1 summary.' + note;
    session = null;
}

function resetLab() {
    fullStream = [];
    compactStream = [];
    session = null;
    sessionCount = 0;
    isRunning = false;
    ballT = 0;
    startButton.html('Start');
    gravitySlider.value(5);
    lastGravity = 5;
    choiceRadio.selected('');
    const inputs = choiceRadio.elt.querySelectorAll('input');
    inputs.forEach(i => { i.checked = false; });
    feedback = '';
    lastComparison = '';
    message = 'Lab reset. Session closed and both columns are empty.';
}

// ---------- text helpers ----------
function wrapLines(str, w) {
    const words = str.split(' ');
    const lines = [];
    let cur = '';
    for (const wd of words) {
        const test = cur ? cur + ' ' + wd : wd;
        if (fontWidth(test) > w && cur) { lines.push(cur); cur = wd; }
        else cur = test;
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
