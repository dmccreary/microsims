// Full or Lite Decision Explorer - p5.js
// CANVAS_HEIGHT: 640
// Learning objective (Evaluate / recommend): the learner recommends Full, single-server or
// Lite for a described school by weighing scale, freshness, evidence integrity and budget,
// and justifies the recommendation against the trade-off table (Chapter 23).
// Rule set (a TEACHING HEURISTIC derived from the chapter's trade-off table, not an
// official sizing tool). A tier fails a requirement when:
//   Scale:     students above its target (Lite ~150, single server ~10,000; Full = districts)
//   Budget:    the monthly budget is below the tier's lowest design estimate
//              (Lite ~$1, single server ~$300, Full ~$10,300 on demand)
//   Evidence:  grades depend on evidence -> Lite fails (self-reported by the browser)
//   Analytics: cross-class analytics needed -> Lite fails (on demand only, or unsupported)
//   Alerts:    real-time alerts needed -> Lite fails (scheduled function only)
//   Staff:     no staff to run servers -> single server and Full fail
// The recommendation is the cheapest tier with no unmet requirement.
// Layout: fixed canvas height; the control rows wrap on narrow screens and the drawing
// region takes the rest. Cards sit in a row at 600px and wider, and stack below that.

// ---------- canvas and layout ----------
let canvasWidth = 700;
let canvasHeight = 640;          // fixed: equals CANVAS_HEIGHT
let controlHeight = 148;         // recomputed by layoutControls()
let drawHeight = canvasHeight - controlHeight;
let margin = 10;
let sliderLeftMargin = 200;
let defaultTextSize = 16;

// ---------- tiers (design and planning estimates quoted in Chapters 21-23) ----------
const TIERS = [
    { key: 'lite', name: 'Lite', cost: 'about $1–5 / month', minCost: 1,
      brief: '~$1–5/month · up to ~150 students',
      scale: 'one course, up to about 150 students', maxStudents: 150, servers: false,
      trade: ['Freshness: as of last sync', 'Evidence: self-reported', 'Analytics: on demand or none',
              'Alerts: scheduled only', 'Servers: none'],
      source: 'Cost: about $1 to $5 per month, the LRS-Lite design estimate (analysis of ' +
              '2026-09-24); S3 alone is estimated at about $0.77 per month for 150 students at AWS ' +
              'list prices. Scale: one course of up to about 150 students, the design target. ' +
              'Both are design estimates, not bills or measurements.' },
    { key: 'single', name: 'Single server', cost: '$300–$2,500 / month', minCost: 300,
      brief: '$300–$2,500/month · ~10,000 students',
      scale: 'about 10,000 concurrent active students', maxStudents: 10000, servers: true,
      trade: ['Freshness: near real time', 'Evidence: server-authenticated', 'Analytics: native',
              'Alerts: native', 'Servers: one host, no HA'],
      source: 'Cost: $300 to $2,500 per month, a planning-level estimate from the draft ' +
              'hardware specification (2026-07-15): $1,000-$2,500 to rent a large cloud instance, ' +
              '$300-$800 for dedicated hosting. Scale: roughly 10,000 concurrent active students on ' +
              'one host with no high availability; it stops fitting near 3,000-5,000 statements per second.' },
    { key: 'full', name: 'Full', cost: 'about $10,300 / month', minCost: 10300,
      brief: '~$10,300/month · districts',
      scale: 'many classes and districts', maxStudents: Infinity, servers: true,
      trade: ['Freshness: near real time', 'Evidence: server-authenticated', 'Analytics: native',
              'Alerts: native', 'Servers: clustered, on call'],
      source: 'Cost: about $10,300 per month on demand, infrastructure only, a planning-level ' +
              'estimate from the hardware specification; reserved pricing might approach $6,500-$7,500. ' +
              'It excludes a Neo4j license placeholder of $3,000-$8,000 and engineering time. ' +
              'Scale: districts, designed for 10,000 statements per second bursting to 50,000.' }
];

// ---------- controls ----------
let studentSlider, budgetSlider;
let gradesBox, crossBox, alertsBox, staffBox;
let reasonButton, resetButton;
let controlLabels = [];

// ---------- state ----------
let showReasoning = false;
let hitBoxes = [];
let lastDescribed = '';

// Logarithmic mappings: slider position 0..1000
function studentsFromPos(p) {
    const v = 10 * pow(2000, p / 1000);                  // 10 .. 20,000
    if (v < 100) return round(v);
    if (v < 1000) return round(v / 10) * 10;
    return round(v / 100) * 100;
}
function posFromStudents(s) { return round(1000 * log(s / 10) / log(2000)); }
function budgetFromPos(p) {
    if (p <= 0) return 0;
    const v = pow(10, (p / 1000) * log(12000) / log(10)); // 1 .. 12,000
    if (v < 100) return round(v);
    if (v < 1000) return round(v / 10) * 10;
    return round(v / 100) * 100;
}
function posFromBudget(b) { return b <= 0 ? 0 : round(1000 * (log(b) / log(10)) / (log(12000) / log(10))); }

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));
    textSize(defaultTextSize);
    const main = document.querySelector('main');

    studentSlider = createSlider(0, 1000, posFromStudents(30), 1);
    budgetSlider = createSlider(0, 1000, posFromBudget(50), 1);
    gradesBox = createCheckbox('Grades depend on evidence', false);
    crossBox = createCheckbox('Need cross-class analytics', false);
    alertsBox = createCheckbox('Need real-time alerts', false);
    staffBox = createCheckbox('Staff to run servers', false);
    reasonButton = createButton('Show reasoning');
    reasonButton.mousePressed(() => {
        showReasoning = !showReasoning;
        reasonButton.html(showReasoning ? 'Hide reasoning' : 'Show reasoning');
    });
    resetButton = createButton('Reset');
    resetButton.mousePressed(resetAll);

    [studentSlider, budgetSlider, gradesBox, crossBox, alertsBox, staffBox, reasonButton, resetButton]
        .forEach(c => { c.parent(main); c.style('font-size', '15px'); });
    layoutControls();
}

// ---------- control layout (rows wrap on narrow screens) ----------
function layoutControls() {
    const narrow = canvasWidth < 500;
    const rowH = 33, gap = 10, x0 = margin, right = canvasWidth - margin;
    const all = [studentSlider, budgetSlider, gradesBox, crossBox, alertsBox, staffBox, reasonButton, resetButton];
    all.forEach(c => { c.style('font-size', narrow ? '14px' : '15px'); c.position(0, drawHeight); });
    sliderLeftMargin = narrow ? 180 : 210;
    const sw = max(80, canvasWidth - sliderLeftMargin - margin - 4);
    studentSlider.size(sw);
    budgetSlider.size(sw);
    const groups = [
        [{ label: 'students', w: sliderLeftMargin - x0 - gap }, { el: studentSlider, w: sw }],
        [{ label: 'budget', w: sliderLeftMargin - x0 - gap }, { el: budgetSlider, w: sw }],
        [{ el: gradesBox }, { el: crossBox }, { el: alertsBox }, { el: staffBox }],
        [{ el: reasonButton }, { el: resetButton }]
    ];
    const placements = [];
    let row = -1;
    groups.forEach((items, gi) => {
        // the buttons may share the last checkbox row when there is room
        if (gi === 3 && placements.length) {
            const last = placements[placements.length - 1];
            const lx = last.x + (last.it.el ? last.it.el.elt.offsetWidth : 0) + gap + 20;
            const need = reasonButton.elt.offsetWidth + resetButton.elt.offsetWidth + gap;
            if (lx + need <= right) {
                let x = lx;
                items.forEach(it => { placements.push({ it, x, row }); x += it.el.elt.offsetWidth + gap; });
                return;
            }
        }
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
        else p.it.el.position(p.x, y + ([studentSlider, budgetSlider].includes(p.it.el) ? 4 : 2));
    });
}

// ---------- decision model ----------
function readState() {
    return {
        students: studentsFromPos(studentSlider.value()),
        budget: budgetFromPos(budgetSlider.value()),
        grades: gradesBox.checked(),
        cross: crossBox.checked(),
        alerts: alertsBox.checked(),
        staff: staffBox.checked()
    };
}

function money(v) { return '$' + v.toLocaleString('en-US'); }

// Unmet requirements for one tier: [{long, short}]
function unmetFor(t, s) {
    const u = [];
    if (s.students > t.maxStudents) {
        u.push({ long: '✗ Scale: ' + s.students.toLocaleString('en-US') + ' students is above about ' + t.maxStudents.toLocaleString('en-US'),
                 short: '✗ Scale: ' + s.students.toLocaleString('en-US') + ' > ~' + t.maxStudents.toLocaleString('en-US') });
    }
    if (s.budget < t.minCost) {
        u.push({ long: '✗ Budget: ' + money(s.budget) + ' is below about ' + money(t.minCost),
                 short: '✗ Budget: ' + money(s.budget) + ' < ~' + money(t.minCost) });
    }
    if (t.key === 'lite') {
        if (s.grades) u.push({ long: '✗ Evidence is self-reported by the browser', short: '✗ Evidence self-reported' });
        if (s.cross) u.push({ long: '✗ Cross-class analytics: on demand only', short: '✗ No cross-class analytics' });
        if (s.alerts) u.push({ long: '✗ Alerts: scheduled only, fresh as of last sync', short: '✗ No real-time alerts' });
    }
    if (t.servers && !s.staff) u.push({ long: '✗ Needs always-on servers and staff to run them', short: '✗ Needs server staff' });
    return u;
}

function decide(s) {
    const results = TIERS.map(t => ({ t, unmet: unmetFor(t, s) }));
    const fits = results.filter(r => r.unmet.length === 0);
    return { results, pick: fits.length ? fits[0].t : null };   // TIERS are ordered cheapest first
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
    text('Full or Lite Decision Explorer', canvasWidth / 2, 7);
    textStyle(NORMAL);

    const s = readState();
    const d = decide(s);
    const bannerH = canvasWidth < 600 ? 70 : 54;
    const top = 36, bottom = drawHeight - bannerH - 12;
    drawCards(d, top, bottom);
    drawBanner(d, margin, drawHeight - bannerH - 6, canvasWidth - 2 * margin, bannerH);
    if (showReasoning) drawReasoning(s, d, top, bottom);
    drawControlLabels(s);
    drawTooltip();
    updateDescription(s, d);
}

function drawCards(d, top, bottom) {
    const rowMode = canvasWidth >= 600;
    const gap = rowMode ? 8 : 6;
    const n = d.results.length;
    let rects;
    if (rowMode) {
        const w = (canvasWidth - 2 * margin - (n - 1) * gap) / n;
        rects = d.results.map((r, i) => ({ x: margin + i * (w + gap), y: top, w, h: bottom - top }));
    } else {
        // stacked: share the height in proportion to what each card must show
        textSize(14);
        const need = d.results.map(r => 50 + max(1, r.unmet.length) * 17);
        const total = need.reduce((a, b) => a + b, 0);
        const avail = bottom - top - (n - 1) * gap;
        let y = top;
        rects = d.results.map((r, i) => {
            const h = avail * need[i] / total;
            const rr = { x: margin, y, w: canvasWidth - 2 * margin, h };
            y += h + gap;
            return rr;
        });
    }
    d.results.forEach((r, i) => drawCard(r, rects[i], d.pick && d.pick.key === r.t.key, rowMode));
}

function drawCard(r, b, recommended, rowMode) {
    const ok = r.unmet.length === 0;
    if (recommended) { stroke('#009E73'); strokeWeight(4); }
    else if (ok) { stroke('#009E73'); strokeWeight(2); }
    else { stroke('#bbbbbb'); strokeWeight(1); }
    fill(ok ? '#e8f6ef' : '#efefef');
    rect(b.x, b.y, b.w, b.h, 8);
    strokeWeight(1);
    noStroke();
    const pad = 9;
    let y = b.y + 7;
    textAlign(LEFT, TOP);
    fill(ok ? '#111' : '#555');
    textStyle(BOLD);
    textSize(rowMode ? 18 : 16);
    text(r.t.name, b.x + pad, y);
    if (recommended) {
        textSize(13);
        const lab = 'Recommended';
        const lw = textWidth(lab) + 14;
        fill('#007A5A');
        rect(b.x + b.w - lw - 8, y, lw, 20, 10);
        fill('white');
        textAlign(CENTER, CENTER);
        text(lab, b.x + b.w - lw / 2 - 8, y + 10);
        textAlign(LEFT, TOP);
    }
    textStyle(NORMAL);
    textSize(14);
    fill(ok ? '#222' : '#555');
    if (rowMode) {
        y += 26;
        for (const ln of wrapLines('Cost: ' + r.t.cost + ' (design estimate)', b.w - 2 * pad)) { text(ln, b.x + pad, y); y += 17; }
        y += 2;
        for (const ln of wrapLines('Scale: ' + r.t.scale, b.w - 2 * pad)) { text(ln, b.x + pad, y); y += 17; }
        y += 8;
    } else {
        text(fitText(r.t.brief, b.w - 2 * pad), b.x + pad, y + 21);
        y += 41;
    }
    textStyle(BOLD);
    if (ok) {
        fill('#1a5e20');
        text('✓ Meets every requirement', b.x + pad, y);
    } else {
        fill('#b00020');
        const maxY = b.y + b.h - 4;
        for (const u of r.unmet) {
            for (const ln of wrapLines(rowMode ? u.long : u.short, b.w - 2 * pad)) {
                if (y + 16 > maxY) break;
                text(ln, b.x + pad, y);
                y += 17;
            }
            y += rowMode ? 3 : 0;
        }
    }
    textStyle(NORMAL);
    if (rowMode) {
        // the chapter's trade-off rows, anchored to the bottom of the card
        const rows = r.t.trade;
        let ty = b.y + b.h - 8 - rows.length * 17 - 20;
        if (ty > y + 6) {
            stroke('#cccccc');
            line(b.x + pad, ty, b.x + b.w - pad, ty);
            noStroke();
            fill('#555');
            textSize(13);
            text('Trade-offs (Chapter 23 table)', b.x + pad, ty + 4);
            textSize(14);
            fill(ok ? '#333' : '#666');
            rows.forEach((ln, i) => text(fitText(ln, b.w - 2 * pad), b.x + pad, ty + 21 + i * 17));
        }
    }
    hitBoxes.push({ x: b.x, y: b.y, w: b.w, h: b.h, tip: r.t.name + ': ' + r.t.source });
}

function drawBanner(d, x, y, w, h) {
    const pick = d.pick;
    stroke(pick ? '#009E73' : '#D55E00');
    strokeWeight(2);
    fill(pick ? '#e3f4ec' : '#fbe9e1');
    rect(x, y, w, h, 8);
    strokeWeight(1);
    noStroke();
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(15);
    fill('#111');
    const head = pick ? 'Recommendation: ' + pick.name + ', the cheapest tier with no unmet requirement.'
                      : 'No tier fits: relax a requirement or raise the budget.';
    let yy = y + 7;
    for (const ln of wrapLines(head, w - 16).slice(0, 2)) { text(ln, x + 8, yy); yy += 19; }
    textStyle(NORMAL);
    textSize(14);
    fill('#333');
    const caveat = canvasWidth < 600 ? 'A teaching heuristic, not an official sizing tool.'
                                     : 'A teaching heuristic from the trade-off table, not an official sizing tool.';
    for (const ln of wrapLines(caveat, w - 16).slice(0, 2)) {
        text(ln, x + 8, yy + 2);
        yy += 17;
    }
}

function drawReasoning(s, d, top, bottom) {
    const x = margin + 4, w = canvasWidth - 2 * margin - 8;
    stroke('steelblue');
    strokeWeight(2);
    fill(255, 255, 255, 250);
    rect(x, top, w, bottom - top, 8);
    strokeWeight(1);
    noStroke();
    const names = keys => keys.length ? 'rules out ' + keys.join(' and ') : 'rules out no tier';
    const lines = [
        ['Scale: ' + s.students.toLocaleString('en-US') + ' students', names(TIERS.filter(t => s.students > t.maxStudents).map(t => t.name))],
        ['Budget: ' + money(s.budget) + ' per month', names(TIERS.filter(t => s.budget < t.minCost).map(t => t.name))],
        ['Grades depend on evidence: ' + (s.grades ? 'yes' : 'no'), names(s.grades ? ['Lite'] : [])],
        ['Cross-class analytics needed: ' + (s.cross ? 'yes' : 'no'), names(s.cross ? ['Lite'] : [])],
        ['Real-time alerts needed: ' + (s.alerts ? 'yes' : 'no'), names(s.alerts ? ['Lite'] : [])],
        ['Staff to run servers: ' + (s.staff ? 'yes' : 'no'), names(s.staff ? [] : ['Single server', 'Full'])]
    ];
    let y = top + 8;
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(15);
    fill('#111');
    for (const ln of wrapLines('Reasoning: each requirement and the tiers it rules out', w - 20)) { text(ln, x + 10, y); y += 19; }
    y += 5;
    textSize(14);
    const narrow = canvasWidth < 600;
    for (const [req, res] of lines) {
        textStyle(BOLD);
        fill('#222');
        if (narrow) {
            text(fitText(req, w - 20), x + 10, y);
            y += 17;
            textStyle(NORMAL);
            fill(res.includes('no tier') ? '#444' : '#b00020');
            text(fitText('→ ' + res, w - 30), x + 22, y);
            y += 19;
        } else {
            text(fitText(req, w * 0.5 - 16), x + 10, y);
            textStyle(NORMAL);
            fill(res.includes('no tier') ? '#444' : '#b00020');
            text(fitText('→ ' + res, w * 0.5 - 10), x + w * 0.5, y);
            y += 21;
        }
    }
    y += 4;
    textStyle(BOLD);
    fill(d.pick ? '#1a5e20' : '#b00020');
    const concl = d.pick ? 'Cheapest tier left: ' + d.pick.name + '.' : 'Every tier is ruled out.';
    for (const ln of wrapLines(concl, w - 20)) { if (y + 17 > bottom - 4) break; text(ln, x + 10, y); y += 17; }
    textStyle(NORMAL);
}

function drawControlLabels(s) {
    noStroke();
    fill('black');
    textSize(canvasWidth < 500 ? 14 : 15);
    textAlign(LEFT, CENTER);
    controlLabels.forEach(l => {
        if (l.key === 'students') text('Students: ' + s.students.toLocaleString('en-US'), l.x, l.y);
        if (l.key === 'budget') text('Monthly budget: ' + money(s.budget), l.x, l.y);
    });
}

function drawTooltip() {
    if (showReasoning) return;
    if (mouseY < 0 || mouseY > drawHeight) return;
    let tip = null;
    for (const b of hitBoxes) {
        if (mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h) { tip = b.tip; break; }
    }
    if (!tip) return;
    textSize(14);
    const w = min(320, canvasWidth - 20);
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

function updateDescription(s, d) {
    const txt = 'Full or Lite Decision Explorer. ' + s.students + ' students, budget $' + s.budget +
        ' per month. Three tier cards (Lite, Single server, Full) list the requirements each fails. ' +
        (d.pick ? 'Recommendation: ' + d.pick.name + '.' : 'No tier fits.') +
        ' This is a teaching heuristic, not an official sizing tool.';
    if (txt !== lastDescribed) { describe(txt); lastDescribed = txt; }
}

function resetAll() {
    studentSlider.value(posFromStudents(30));
    budgetSlider.value(posFromBudget(50));
    [gradesBox, crossBox, alertsBox, staffBox].forEach(c => c.checked(false));
    showReasoning = false;
    reasonButton.html('Show reasoning');
}

// ---------- text helpers ----------
function wrapLines(str, w) {
    const words = str.split(' ');
    const lines = [];
    let cur = '';
    for (const wd of words) {
        const test = cur ? cur + ' ' + wd : wd;
        if (textWidth(test) > w && cur) { lines.push(cur); cur = wd; } else cur = test;
    }
    if (cur) lines.push(cur);
    return lines;
}

function fitText(str, w) {
    if (textWidth(str) <= w) return str;
    let s = str;
    while (s.length > 1 && textWidth(s + '…') > w) s = s.slice(0, -1);
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
