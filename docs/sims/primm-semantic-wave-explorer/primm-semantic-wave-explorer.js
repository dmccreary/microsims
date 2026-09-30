// PRIMM Semantic Wave Explorer - p5.js
// CANVAS_HEIGHT: 560
// Learning objective (Analyze / relate): the learner relates each PRIMM stage (Predict, Run,
// Investigate, Modify, Make) to a point on a semantic wave and identifies which stage a
// given lesson activity belongs to (Chapter 24).
// The wave: the prediction is abstract, running the sim is concrete, investigating climbs
// back toward the general rule, modifying is hands-on again, and making applies the rule in
// a new setting. The heights are ILLUSTRATIVE and the sim says so on screen.
// Interaction: stage buttons highlight a point and describe the stage. Choosing an activity
// in the dropdown puts a card "in hand"; drag it onto a stage, or press a stage button to
// place it (keyboard route). Feedback names the stage the activity belongs to and why.
// Layout: fixed canvas height; control rows wrap (stage buttons form two rows under 500px)
// and the drawing region takes the height they leave.

// ---------- canvas and layout ----------
let canvasWidth = 700;
let canvasHeight = 560;          // fixed: equals CANVAS_HEIGHT
let controlHeight = 84;          // recomputed by layoutControls()
let drawHeight = canvasHeight - controlHeight;
let margin = 10;
let defaultTextSize = 16;

// ---------- data ----------
const STAGES = [
    { name: 'Predict', height: 0.78,
      desc: 'Learners say what they expect the simulation to do before it runs. The prediction is a general claim, so the wave starts high on the abstract side.',
      activity: 'Before dropping the ball, predict whether halving the bounciness halves the rebound height.' },
    { name: 'Run', height: 0.18,
      desc: 'Learners run the simulation and compare what happens with their prediction. Watching one particular ball bounce is the most concrete point of the wave.',
      activity: 'Drop the ball and count the bounces before it comes to rest.' },
    { name: 'Investigate', height: 0.72,
      desc: 'Learners ask why the outcome occurred and trace it to a rule in the model or the code. The explanation climbs back toward the general principle.',
      activity: 'Find the line of code that makes each bounce lower than the last.' },
    { name: 'Modify', height: 0.38,
      desc: 'Learners change a parameter or a line of code and test the effect. The work is hands-on again, guided by the rule they just found.',
      activity: 'Set gravity to the Moon’s 1.6 m/s² and check whether your rule still holds.' },
    { name: 'Make', height: 0.60,
      desc: 'Learners build a new variation of their own. Applying the rule in a new setting repacks it, so the idea transfers beyond the one example.',
      activity: 'Design a sim of a ball bouncing on a trampoline, with a new slider for spring stiffness.' }
];

const ACTIVITIES = [
    { text: 'Write a guess before dropping the ball', stage: 0,
      why: 'Committing to an outcome before seeing it is Predict, the abstract start of the wave.' },
    { text: 'Drop the ball and compare its bounce with your guess', stage: 1,
      why: 'Running the sim and comparing the result with the prediction is Run, the concrete trough of the wave.' },
    { text: 'Explain why each bounce is lower than the one before', stage: 2,
      why: 'Asking why and tracing the cause to the energy-loss rule is Investigate: the lesson climbs back toward the general principle.' },
    { text: 'Change the bounciness slider to 0.9 and test it', stage: 3,
      why: 'Changing a parameter and testing the effect is Modify: hands-on work guided by the rule.' },
    { text: 'Build your own sim of a ball bouncing on the Moon', stage: 4,
      why: 'Creating a new variation of your own is Make: the rule is applied in a new setting.' },
    { text: 'Edit the code so each bounce loses 20% of its speed, then run it', stage: 3,
      why: 'Editing the model and testing the edit is Modify, even though you run the sim again afterwards.' }
];

// ---------- controls ----------
let stageButtons = [];
let activitySelect, resetButton;
let controlLabels = [];

// ---------- state ----------
let selectedStage = -1;           // highlighted stage, or -1
let inHand = -1;                  // index of the activity card in hand, or -1
let placed = [];                  // activity indices placed correctly
let greenStages = new Set();      // stages with at least one correct placement
let feedback = null;              // {ok, text}
let card = { x: 0, y: 0, w: 0, h: 0, dragging: false, dx: 0, dy: 0, homeX: 0, homeY: 0 };
let geom = null;                  // chart geometry for this frame
let lastDescribed = '';

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));
    textSize(defaultTextSize);
    const main = document.querySelector('main');

    STAGES.forEach((st, i) => {
        const b = createButton(st.name);
        b.mousePressed(() => stagePressed(i));
        b.parent(main);
        stageButtons.push(b);
    });
    activitySelect = createSelect();
    activitySelect.parent(main);
    rebuildSelect();
    activitySelect.changed(activityChosen);
    resetButton = createButton('Reset');
    resetButton.parent(main);
    resetButton.mousePressed(resetAll);
    [...stageButtons, activitySelect, resetButton].forEach(c => c.style('font-size', '15px'));
    layoutControls();
    updateDescription();
}

function rebuildSelect() {
    activitySelect.elt.innerHTML = '';
    activitySelect.option('Choose a lesson activity…', '-1');
    ACTIVITIES.forEach((a, i) => activitySelect.option((placed.includes(i) ? '✓ ' : '') + a.text, String(i)));
    activitySelect.selected(inHand >= 0 ? String(inHand) : '-1');
}

// ---------- control layout ----------
function layoutControls() {
    const narrow = canvasWidth < 500;
    const rowH = 36, gap = 8, x0 = margin, right = canvasWidth - margin;
    const all = [...stageButtons, activitySelect, resetButton];
    all.forEach(c => { c.style('font-size', narrow ? '14px' : '15px'); c.position(0, drawHeight); });
    // stage buttons are a little wider on narrow screens so they are easy to tap
    stageButtons.forEach(b => b.style('min-width', narrow ? '90px' : '0'));
    // the select is as wide as the row allows
    const labelW = narrow ? 66 : 118;
    const selW = min(420, canvasWidth - 2 * margin - labelW - gap - (narrow ? 0 : resetButton.elt.offsetWidth + gap));
    activitySelect.style('width', selW + 'px');
    const groups = [
        stageButtons.map((b, i) => ({ el: b, breakBefore: narrow && i === 3 })),
        [{ label: 'activity', lw: labelW, el: activitySelect }, { el: resetButton }]
    ];
    const placements = [];
    let row = -1;
    groups.forEach(items => {
        row++;
        let x = x0;
        items.forEach(it => {
            const w = (it.lw || 0) + it.el.elt.offsetWidth;
            if ((x > x0 && x + w > right) || it.breakBefore) { row++; x = x0; }
            placements.push({ it, x, row });
            x += w + gap;
        });
    });
    controlHeight = (row + 1) * rowH + 12;
    drawHeight = canvasHeight - controlHeight;
    controlLabels = [];
    placements.forEach(p => {
        const y = drawHeight + 8 + p.row * rowH;
        if (p.it.label) controlLabels.push({ key: p.it.label, x: p.x, y: y + 13 });
        p.it.el.position(p.x + (p.it.lw || 0), y + (p.it.el === activitySelect ? 2 : 0));
    });
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

    noStroke();
    fill('black');
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    textSize(canvasWidth < 500 ? 18 : 21);
    text('PRIMM Semantic Wave Explorer', canvasWidth / 2, 6);
    textStyle(NORMAL);

    const trayTop = 34;
    const trayH = trayHeight();
    const panelH = canvasWidth < 500 ? 118 : 104;
    const panelTop = drawHeight - panelH - 8;
    geom = chartGeometry(trayTop + trayH + 8, panelTop - 30);
    drawAxes();
    drawWave();
    drawTray(trayTop, trayH);
    drawPanel(margin, panelTop, canvasWidth - 2 * margin, panelH);
    drawCard();
    drawControlLabels();
}

// The tray grows to fit the card in hand (up to three lines of text)
function trayHeight() {
    if (inHand < 0) return 50;
    textSize(14);
    const w = canvasWidth - 2 * margin;
    const scoreW = fontWidth('Placed 0 of 6') + 20;
    const cw = cardWidth(w, scoreW);
    const n = wrapLines(ACTIVITIES[inHand].text, cw - 20).length;
    return max(50, n * 17 + 14 + 12);
}

function cardWidth(w, scoreW) {
    return canvasWidth < 500 ? w - scoreW - 12 : min(w - scoreW - 20, max(220, canvasWidth * 0.5));
}

function chartGeometry(top, bottom) {
    const left = canvasWidth < 500 ? 76 : 96, right = canvasWidth - 16;
    const xs = STAGES.map((s, i) => left + (i + 0.5) * (right - left) / STAGES.length);
    const ys = STAGES.map(s => bottom - s.height * (bottom - top - 16) - 8);
    return { left, right, top, bottom, xs, ys, band: (right - left) / STAGES.length };
}

function drawAxes() {
    const g = geom;
    // plot area
    noStroke();
    fill('white');
    rect(g.left, g.top, g.right - g.left, g.bottom - g.top, 6);
    // vertical axis with arrow: concrete (bottom) to abstract (top)
    stroke('#444');
    strokeWeight(2);
    line(g.left - 10, g.bottom, g.left - 10, g.top + 4);
    line(g.left - 10, g.top + 4, g.left - 15, g.top + 12);
    line(g.left - 10, g.top + 4, g.left - 5, g.top + 12);
    strokeWeight(1);
    noStroke();
    fill('#222');
    textSize(14);
    textAlign(RIGHT, TOP);
    text('abstract', g.left - 16, g.top + 2);
    textAlign(RIGHT, BOTTOM);
    text('concrete', g.left - 16, g.bottom);
    // stage labels under the plot, plus drop highlight while dragging
    const dropI = card.dragging ? stageUnderMouse() : -1;
    STAGES.forEach((st, i) => {
        if (i === dropI) {
            noStroke();
            fill(0, 114, 178, 40);
            rect(g.xs[i] - g.band / 2 + 2, g.top, g.band - 4, g.bottom - g.top, 6);
        }
        noStroke();
        fill(greenStages.has(i) ? '#007A5A' : '#111');
        textStyle(i === selectedStage || greenStages.has(i) ? BOLD : NORMAL);
        textSize(canvasWidth < 500 ? 13.5 : 15);
        textAlign(CENTER, TOP);
        text(st.name, g.xs[i], g.bottom + 6);
        textStyle(NORMAL);
    });
    // note that the heights are illustrative
    fill('#555');
    textSize(13);
    textAlign(RIGHT, TOP);
    text('Wave heights are illustrative', g.right - 6, g.top + 4);
}

function drawWave() {
    const g = geom;
    // highlight line for the selected stage
    if (selectedStage >= 0) {
        stroke('#0072B2');
        drawingContext.setLineDash([5, 4]);
        line(g.xs[selectedStage], g.top + 4, g.xs[selectedStage], g.bottom);
        drawingContext.setLineDash([]);
    }
    // smooth curve through the five points
    noFill();
    stroke('#0072B2');
    strokeWeight(3);
    splineProperty('ends', EXCLUDE);  // first/last points are control points, as in 1.x curveVertex()
    beginShape();
    splineVertex(g.left + 4, g.ys[0] + (g.ys[0] - g.ys[1]) * 0.3);
    STAGES.forEach((s, i) => splineVertex(g.xs[i], g.ys[i]));
    splineVertex(g.right - 4, g.ys[4] + (g.ys[4] - g.ys[3]) * 0.3);
    endShape();
    strokeWeight(1);
    // points
    STAGES.forEach((s, i) => {
        const sel = i === selectedStage;
        const green = greenStages.has(i);
        stroke(sel ? '#003d63' : 'white');
        strokeWeight(sel ? 3 : 2);
        fill(green ? '#009E73' : (sel ? '#E69F00' : '#0072B2'));
        circle(g.xs[i], g.ys[i], sel ? 24 : 16);
        strokeWeight(1);
        if (green) {
            noStroke();
            fill('white');
            textSize(13);
            textAlign(CENTER, CENTER);
            text('✓', g.xs[i], g.ys[i] + 1);
        }
        // number of activities placed on this stage
        const n = placed.filter(a => ACTIVITIES[a].stage === i).length;
        if (n > 0) {
            noStroke();
            fill('#007A5A');
            textSize(13);
            textAlign(CENTER, BOTTOM);
            text(n + (n === 1 ? ' activity' : ' activities'), g.xs[i], g.ys[i] - 14);
        }
    });
}

function drawTray(top, h) {
    const x = margin, w = canvasWidth - 2 * margin;
    stroke('lightsteelblue');
    fill(255, 255, 255, 150);
    rect(x, top, w, h, 8);
    noStroke();
    textSize(14);
    fill('#333');
    textAlign(RIGHT, CENTER);
    const score = 'Placed ' + placed.length + ' of 6';
    text(score, x + w - 10, top + h / 2);
    const scoreW = fontWidth(score) + 20;
    if (inHand < 0) {
        textAlign(LEFT, CENTER);
        const msg = placed.length === ACTIVITIES.length
            ? 'All six activities placed. Press Reset to try again.'
            : 'Choose a lesson activity below to get a card, then drag it onto its stage.';
        wrapLines(msg, w - scoreW - 20).slice(0, 2).forEach((ln, i, a) =>
            text(ln, x + 10, top + h / 2 + (i - (a.length - 1) / 2) * 17));
        return;
    }
    // the card's home position is the tray; draw a hint beside it
    textSize(14);
    const cw = cardWidth(w, scoreW);
    card.w = cw;
    const lines = wrapLines(ACTIVITIES[inHand].text, cw - 20);
    card.h = max(34, lines.length * 17 + 14);
    card.homeX = x + 8;
    card.homeY = top + (h - card.h) / 2;
    if (!card.dragging) { card.x = card.homeX; card.y = card.homeY; }
    const hintX = card.homeX + cw + 10;
    if (hintX < x + w - scoreW - 60) {
        fill('#555');
        textAlign(LEFT, CENTER);
        wrapLines('Drag onto a stage, or press a stage button', x + w - scoreW - hintX - 4).slice(0, 2)
            .forEach((ln, i, a) => text(ln, hintX, top + h / 2 + (i - (a.length - 1) / 2) * 16));
    }
}

function drawCard() {
    if (inHand < 0) return;
    const lines = wrapLines(ACTIVITIES[inHand].text, card.w - 20);
    stroke('#E69F00');
    strokeWeight(card.dragging ? 3 : 2);
    fill('#FFF4DF');
    rect(card.x, card.y, card.w, card.h, 8);
    strokeWeight(1);
    noStroke();
    fill('#111');
    textSize(14);
    textAlign(LEFT, TOP);
    lines.forEach((ln, i) => text(ln, card.x + 10, card.y + 7 + i * 17));
}

function drawPanel(x, y, w, h) {
    stroke('lightsteelblue');
    fill('white');
    rect(x, y, w, h, 8);
    noStroke();
    textAlign(LEFT, TOP);
    const out = [];
    if (feedback) {
        out.push({ t: feedback.head, b: true, c: feedback.ok ? '#1a5e20' : '#b00020' });
        out.push({ t: feedback.text });
    } else if (selectedStage >= 0) {
        const st = STAGES[selectedStage];
        const level = st.height >= 0.66 ? 'high: toward abstract' : st.height <= 0.3 ? 'low: concrete' : 'middle of the wave';
        out.push({ t: st.name + ' (' + level + ')', b: true });
        out.push({ t: st.desc });
        out.push({ t: 'Bouncing-ball activity: ' + st.activity, c: '#1f4f7a' });
    } else {
        out.push({ t: 'Relate each PRIMM stage to the wave', b: true });
        out.push({ t: 'Press a stage button to see where it sits between concrete and abstract. Then choose a lesson activity and place it on the stage where it belongs.' });
    }
    textSize(14);
    let yy = y + 7;
    for (const ln of out) {
        fill(ln.c || '#222');
        textStyle(ln.b ? BOLD : NORMAL);
        for (const piece of wrapLines(ln.t, w - 20)) {
            if (yy + 17 > y + h - 3) break;
            text(piece, x + 10, yy);
            yy += 17;
        }
        yy += 2;
    }
    textStyle(NORMAL);
}

function drawControlLabels() {
    noStroke();
    fill('black');
    textSize(canvasWidth < 500 ? 14 : 15);
    textAlign(LEFT, CENTER);
    controlLabels.forEach(l => {
        if (l.key === 'activity') text(canvasWidth < 500 ? 'Activity:' : 'Lesson activity:', l.x, l.y);
    });
}

// ---------- interaction ----------
function stagePressed(i) {
    if (inHand >= 0) { placeCard(i); return; }   // keyboard route for placing a card
    selectedStage = i;
    feedback = null;
    updateDescription();
}

function activityChosen() {
    const v = Number(activitySelect.value());
    inHand = v;
    card.dragging = false;
    feedback = null;
    if (v >= 0 && placed.includes(v)) {
        feedback = { ok: true, head: 'Already placed', text: ACTIVITIES[v].why };
    }
    updateDescription();
}

function placeCard(i) {
    const a = ACTIVITIES[inHand];
    selectedStage = i;
    if (a.stage === i) {
        if (!placed.includes(inHand)) placed.push(inHand);
        greenStages.add(i);
        feedback = { ok: true, head: '✓ Correct: ' + STAGES[i].name, text: a.why };
        inHand = -1;
        rebuildSelect();
    } else {
        const right = STAGES[a.stage].name;
        feedback = { ok: false, head: '✗ Not ' + STAGES[i].name + ': this activity most resembles ' + right,
                     text: a.why + ' Try placing it again.' };
        selectedStage = a.stage;
    }
    card.dragging = false;
    updateDescription();
}

function stageUnderMouse() {
    if (!geom) return -1;
    if (mouseY < geom.top - 40 || mouseY > geom.bottom + 26) return -1;
    for (let i = 0; i < STAGES.length; i++) {
        if (abs(mouseX - geom.xs[i]) <= geom.band / 2) return i;
    }
    return -1;
}

function mousePressed() {
    if (inHand < 0) return;
    if (mouseX >= card.x && mouseX <= card.x + card.w && mouseY >= card.y && mouseY <= card.y + card.h) {
        card.dragging = true;
        card.dx = mouseX - card.x;
        card.dy = mouseY - card.y;
    }
}

function mouseDragged() {
    if (!card.dragging) return;
    card.x = constrain(mouseX - card.dx, 0, canvasWidth - card.w);
    card.y = constrain(mouseY - card.dy, 0, drawHeight - card.h);
    return false;
}

function mouseReleased() {
    if (!card.dragging) return;
    const i = stageUnderMouse();
    card.dragging = false;
    if (i >= 0) placeCard(i);
}

function resetAll() {
    selectedStage = -1;
    inHand = -1;
    placed = [];
    greenStages = new Set();
    feedback = null;
    card.dragging = false;
    rebuildSelect();
    updateDescription();
}

// describe() summarizes the current wave position for screen readers
function updateDescription() {
    let txt = 'PRIMM semantic wave. Five stages from left to right: Predict (high, abstract), ' +
        'Run (low, concrete), Investigate (high), Modify (lower) and Make (middle). Heights are illustrative. ';
    if (selectedStage >= 0) {
        const st = STAGES[selectedStage];
        txt += 'Highlighted stage: ' + st.name + ' at ' + round(st.height * 100) + ' percent of the way from concrete to abstract. ';
    }
    txt += placed.length + ' of 6 activities placed correctly.';
    if (feedback) txt += ' ' + feedback.head + '.';
    if (txt !== lastDescribed) { describe(txt); lastDescribed = txt; }
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
