// Semester Storage Estimator - Chart.js
// CANVAS_HEIGHT: 600
// Learning objective (Apply / calculate): the learner calculates the statement count and
// storage footprint of a semester from activity assumptions, and judges how much headroom
// remains under LRS-Lite's 10 MB budget.
// Model (from the LRS-Lite design, Chapter 22):
//   Summary mode statements/day = reads + sim sessions + answers
//   Full mode statements/day    = reads + answers + sim sessions x (drags + 2)
//   raw bytes  = statements x 980 bytes      (MB = 1,000,000 bytes)
//   gzip bytes = raw / 10                    (the design's approximate ratio)
//   headroom   = 10 MB / gzip MB
// All figures are modelled from synthetic statements, not from real learners.

const BYTES_PER_STATEMENT = 980;   // design's measured average, rounded
const GZIP_RATIO = 10;             // design's approximate raw-to-gzip ratio
const BUDGET_MB = 10;              // LRS-Lite's self-imposed budget per book
const OFFER_MB = 6;                // 60% of the budget: the meter's Offer level

// The four measured cases from the chapter's table (measured on synthetic statements)
const DESIGN_CASES = [
    { name: 'Summary, typical', mode: 'summary',
      reads: 6, sessions: 4, answers: 15, days: 90, drags: 40,
      measured: { statements: 2250, raw: 2.2, gzip: 0.22 } },
    { name: 'Summary, heavy', mode: 'summary',
      reads: 12, sessions: 8, answers: 30, days: 90, drags: 80,
      measured: { statements: 4500, raw: 4.4, gzip: 0.37 } },
    { name: 'Full, typical, 40 drags per session', mode: 'full',
      reads: 6, sessions: 4, answers: 15, days: 90, drags: 40,
      measured: { statements: 17010, raw: 16.1, gzip: 1.05 } },
    { name: 'Full, heavy, 80 drags per session', mode: 'full',
      reads: 12, sessions: 8, answers: 30, days: 90, drags: 80,
      measured: { statements: 62820, raw: 59.6, gzip: 3.6 } }
];

const SLIDERS = ['reads', 'sessions', 'answers', 'days', 'drags'];

let chart = null;
let mode = 'summary';
let caseIndex = -1;       // index of the design case last loaded (-1 = none)
let caseActive = false;   // true until the learner changes a control after loading a case
let model = null;

// ---------- formatting helpers ----------
function fmtInt(n) { return Math.round(n).toLocaleString('en-US'); }
function fmtMB(mb) {
    if (mb === 0) return '0 MB';
    if (mb < 0.1) return mb.toFixed(3) + ' MB';
    if (mb < 10) return mb.toFixed(2) + ' MB';
    return mb.toFixed(1) + ' MB';
}
function fmtX(x) {
    if (!isFinite(x)) return 'unlimited';
    if (x >= 10) return Math.round(x).toLocaleString('en-US') + '×';
    return x.toFixed(1) + '×';
}

// ---------- model ----------
function readInputs() {
    const v = {};
    SLIDERS.forEach(id => { v[id] = Number(document.getElementById(id).value); });
    return v;
}

function computeModel(v) {
    let perDay, perDayFormula;
    if (mode === 'summary') {
        perDay = v.reads + v.sessions + v.answers;
        perDayFormula = `${v.reads} + ${v.sessions} + ${v.answers}`;
    } else {
        perDay = v.reads + v.answers + v.sessions * (v.drags + 2);
        perDayFormula = `${v.reads} + ${v.answers} + ${v.sessions} × (${v.drags} + 2)`;
    }
    const statements = perDay * v.days;
    const rawMB = statements * BYTES_PER_STATEMENT / 1e6;
    const gzipMB = rawMB / GZIP_RATIO;
    const headroom = gzipMB > 0 ? BUDGET_MB / gzipMB : Infinity;
    return { v, perDay, perDayFormula, statements, rawMB, gzipMB, headroom,
             pctUsed: 100 * gzipMB / BUDGET_MB };
}

// ---------- chart ----------
// Draws the 10 MB reference line and the value labels. Uses afterDatasetsDraw so the
// tooltip is painted on top of these annotations.
const annotationPlugin = {
    id: 'budgetLine',
    afterDatasetsDraw(c) {
        const { ctx, chartArea, scales } = c;
        const y = scales.y.getPixelForValue(BUDGET_MB);
        ctx.save();
        // value labels above each bar
        const meta = c.getDatasetMeta(0);
        ctx.fillStyle = '#222';
        ctx.font = 'bold 15px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        meta.data.forEach((bar, i) => {
            const val = c.data.datasets[0].data[i];
            ctx.fillText(fmtMB(val), bar.x, bar.y - 4);
        });
        // budget line
        if (y >= chartArea.top && y <= chartArea.bottom) {
            ctx.strokeStyle = '#D55E00';
            ctx.lineWidth = 2;
            ctx.setLineDash([7, 5]);
            ctx.beginPath();
            ctx.moveTo(chartArea.left, y);
            ctx.lineTo(chartArea.right, y);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = '#A23E00';
            ctx.font = 'bold 15px Arial';
            ctx.textBaseline = 'bottom';
            // put the line label on the right unless the gzip bar's value label sits there
            const gz = meta.data[1];
            const gzLabelTop = gz.y - 22, gzLabelBottom = gz.y;
            const clashRight = (y - 18 < gzLabelBottom) && (y > gzLabelTop);
            if (clashRight) {
                // centre the label between the two bars on a white backing
                const cx = (chartArea.left + chartArea.right) / 2;
                const w = ctx.measureText('10 MB budget').width + 8;
                ctx.fillStyle = 'rgba(255,255,255,0.9)';
                ctx.fillRect(cx - w / 2, y - 20, w, 18);
                ctx.fillStyle = '#A23E00';
                ctx.textAlign = 'center';
                ctx.fillText('10 MB budget', cx, y - 3);
            } else {
                ctx.textAlign = 'right';
                ctx.fillText('10 MB budget', chartArea.right - 4, y - 3);
            }
        }
        ctx.restore();
    }
};

function buildChart() {
    const ctx = document.getElementById('chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Raw JSON (MB)', 'Gzipped (MB)'],
            datasets: [{
                label: 'Semester storage',
                data: [0, 0],
                // Okabe-Ito sky blue and blue (color-blind safe)
                backgroundColor: ['#56B4E9', '#0072B2'],
                borderColor: ['#2b7fb0', '#004f7c'],
                borderWidth: 1,
                barPercentage: 0.6,
                categoryPercentage: 0.8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 250 },
            layout: { padding: { top: 22 } },
            plugins: {
                legend: { display: false },
                tooltip: {
                    titleFont: { size: 14 },
                    bodyFont: { size: 14 },
                    callbacks: {
                        title: items => items[0].label,
                        label: item => tooltipLines(item.dataIndex)
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Megabytes (MB)', font: { size: 14 } },
                    ticks: { font: { size: 14 } }
                },
                x: { ticks: { font: { size: 15, weight: 'bold' }, color: '#222' } }
            }
        },
        plugins: [annotationPlugin]
    });
}

function tooltipLines(i) {
    const m = model;
    if (i === 0) {
        return [
            fmtMB(m.rawMB),
            `= ${fmtInt(m.statements)} statements × ${BYTES_PER_STATEMENT} bytes`,
            `statements = ${fmtInt(m.perDay)} per day × ${m.v.days} days`
        ];
    }
    return [
        fmtMB(m.gzipMB),
        `= ${fmtMB(m.rawMB)} raw ÷ ${GZIP_RATIO}`,
        '(the design’s approximate gzip ratio)'
    ];
}

// ---------- readout ----------
function verdict(m) {
    if (m.gzipMB > BUDGET_MB) {
        return { cls: 'bad', text: 'Over the 10 MB budget: this semester does not fit.' };
    }
    if (m.gzipMB >= OFFER_MB) {
        return { cls: 'warn', text: 'Fits, but above 60% of the budget, where the storage meter offers a backup.' };
    }
    if (m.headroom >= 10) {
        return { cls: 'ok', text: 'Comfortable: the budget is a safety rail, not a constraint.' };
    }
    return { cls: 'warn', text: 'Fits, with modest room to spare.' };
}

function renderReadout(m) {
    const vd = verdict(m);
    const pct = (m.pctUsed > 0 && m.pctUsed < 0.1) ? '<0.1' : m.pctUsed.toFixed(1);
    let html = '';
    html += `<div><span class="n">${fmtInt(m.perDay)}</span> statements per day` +
            ` <span class="f">= ${m.perDayFormula}</span></div>`;
    html += `<div><span class="n">${fmtInt(m.statements)}</span> per semester` +
            ` <span class="f">= ${fmtInt(m.perDay)} \u00d7 ${m.v.days} days</span></div>`;
    html += `<div>Raw <span class="n">${fmtMB(m.rawMB)}</span> &middot; gzipped` +
            ` <span class="n">${fmtMB(m.gzipMB)}</span> <span class="f">(raw \u00f7 10)</span></div>`;
    html += `<div class="headroom">Headroom: ${fmtX(m.headroom)} under 10 MB</div>`;
    html += `<div class="f">${pct}% of the budget used (${fmtMB(m.gzipMB)} \u00f7 10 MB)</div>`;
    html += `<div class="verdict ${vd.cls}">${vd.text}</div>`;
    if (caseActive && caseIndex >= 0) {
        const c = DESIGN_CASES[caseIndex];
        const ratio = c.measured.raw / c.measured.gzip;
        html += `<div class="case"><b>Design case ${caseIndex + 1} of 4</b> (${c.name}): ` +
                `measured ${fmtInt(c.measured.statements)} statements, ` +
                `${c.measured.raw} MB raw, ${c.measured.gzip} MB gzip. ` +
                `Measured ratio \u2248 ${ratio.toFixed(0)}\u00d7, so \u00f7 10 is approximate.</div>`;
    } else if (mode === 'summary') {
        html += `<div class="case f">Summary mode ignores the drags slider.</div>`;
    }
    document.getElementById('readout').innerHTML = html;
}

// ---------- update cycle ----------
function update() {
    const v = readInputs();
    SLIDERS.forEach(id => { document.getElementById(id + '-val').textContent = v[id]; });
    const dragsRow = document.getElementById('drags-row');
    dragsRow.classList.toggle('disabled', mode === 'summary');
    document.getElementById('drags').disabled = (mode === 'summary');
    document.getElementById('mode-summary').setAttribute('aria-pressed', mode === 'summary');
    document.getElementById('mode-full').setAttribute('aria-pressed', mode === 'full');

    model = computeModel(v);
    chart.data.datasets[0].data = [model.rawMB, model.gzipMB];
    // keep the 10 MB line in view and leave room for the value labels
    chart.options.scales.y.max = niceMax(Math.max(BUDGET_MB * 1.2, model.rawMB * 1.12));
    chart.update();
    renderReadout(model);
}

function niceMax(x) {
    const steps = [12, 15, 20, 25, 30, 40, 50, 60, 80, 100, 120, 150, 200];
    for (const s of steps) if (x <= s) return s;
    return Math.ceil(x / 50) * 50;
}

function setMode(newMode, fromCase) {
    mode = newMode;
    if (!fromCase) caseActive = false;
    update();
}

function loadNextCase() {
    caseIndex = (caseIndex + 1) % DESIGN_CASES.length;
    const c = DESIGN_CASES[caseIndex];
    SLIDERS.forEach(id => { document.getElementById(id).value = c[id]; });
    caseActive = true;
    setMode(c.mode, true);
}

document.addEventListener('DOMContentLoaded', function () {
    buildChart();
    SLIDERS.forEach(id => {
        document.getElementById(id).addEventListener('input', () => { caseActive = false; update(); });
    });
    document.getElementById('mode-summary').addEventListener('click', () => setMode('summary', false));
    document.getElementById('mode-full').addEventListener('click', () => setMode('full', false));
    document.getElementById('cases-btn').addEventListener('click', loadNextCase);
    window.addEventListener('resize', () => { if (chart) chart.resize(); });
    update();
});
