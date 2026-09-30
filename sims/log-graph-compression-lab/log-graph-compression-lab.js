// Log and Graph Compression Lab - Chart.js
// CANVAS_HEIGHT: 660
// Learning objective (Analyze / examine): the learner examines how summary vertices decouple the
// graph write rate from the ingest rate, using the design's published estimates as inputs
// (Chapter 20, "ClickHouse and Neo4j").
// Every number comes from the companion LRS design document (lrs-design-v1.md), labeled
// "design estimate, not measured":
//   §4   capacity model: 40% duty cycle, 10-hour (36,000 s) active window, and "graph writes/sec if
//        statements were materialized ~50,000 at 10,000 stmt/s (10k x ~4 edges)"
//   §4.1 storage compression per grain: PageEngagement ~40:1, ConceptMastery ~100:1,
//        MicroSimEngagement ~60:1, QuestionResponse ~3:1, SectionRollup ~3,000:1
//        (the design gives no ratio for LearningSession)
//   §4.1 write-rate compression rows at 10,000 stmt/s: 5 s -> ~10,000 upserts/s,
//        60 s -> ~2,500, 300 s -> ~1,000, from ~100,000 active students at peak
// Model used between the design's rows (this sim's interpolation, not the design's):
//   distinct grains per window G = min(statements in window, 100,000 x h(cadence)),
//   h(c) = 1.5 x (c / 60)^0.437 distinct objects per student per window (passes through the
//   design's 0.5, 1.5 and 3 at 5 s, 60 s and 300 s); summary upserts/s = G / cadence.
//   The student population is fixed, so raising the rate is a burst: more statements per student.

const SEMESTER_DAYS = 90;          // half of the design's 180-day school year (this sim's choice)
const DUTY = 0.40;                 // design §4
const ACTIVE_SECONDS = 36000;      // design §4: ~10 h/day
const WRITES_PER_STATEMENT = 5;    // design §4: ~50,000 writes/s at 10,000 stmt/s (vertex + ~4 edges)
const ACTIVE_STUDENTS = 100000;    // design §4.1: ~100,000 concurrent active students at peak
const GRAINS = {
    ConceptMastery: { ratio: 100, per: 'student and concept', stmts: '~50-200 evidence events' },
    PageEngagement: { ratio: 40, per: 'student and page', stmts: '~20-60 views, scrolls, dwell pings' },
    MicroSimEngagement: { ratio: 60, per: 'student and MicroSim', stmts: '~30-100 interactions' },
    QuestionResponse: { ratio: 3, per: 'student and question', stmts: '~1-5 attempts' },
    LearningSession: { ratio: null, per: 'student and session', stmts: 'no design estimate' },
    SectionRollup: { ratio: 3000, per: 'section and concept', stmts: '30 students x ~100 events' }
};
const DESIGN_ROWS = [
    { cadence: 5, coalesced: '50 K', grains: '~50 K', upserts: 10000, lag: '5 s' },
    { cadence: 60, coalesced: '600 K', grains: '~150 K', upserts: 2500, lag: '60 s' },
    { cadence: 300, coalesced: '3 M', grains: '~300 K', upserts: 1000, lag: '5 min' }
];
// Okabe-Ito colors (color-blind safe)
const BLUE = '#0072B2', ORANGE = '#E69F00', VERMILLION = '#D55E00', BLACK = '#000000';

let storageChart = null, rateChart = null;

// ---------- Model ----------
function objectsPerStudent(c) { return 1.5 * Math.pow(c / 60, 0.437); }

function grainsPerWindow(rate, c) {
    return Math.min(rate * c, ACTIVE_STUDENTS * objectsPerStudent(c));
}

function summaryUpserts(rate, c) { return grainsPerWindow(rate, c) / c; }

function everyVertexWrites(rate) { return rate * WRITES_PER_STATEMENT; }

function semesterRows(rate) { return rate * DUTY * ACTIVE_SECONDS * SEMESTER_DAYS; }

// ---------- Formatting ----------
function big(x) {
    if (x >= 1e9) return (x / 1e9).toFixed(x >= 1e10 ? 1 : 2) + ' billion';
    if (x >= 1e6) return (x / 1e6).toFixed(x >= 1e7 ? 1 : 2) + ' million';
    if (x >= 1e3) return Math.round(x).toLocaleString('en-US');
    return x.toFixed(x < 10 ? 1 : 0);
}
function short(x) {
    if (x >= 1e9) return (x / 1e9).toFixed(0) + 'B';
    if (x >= 1e6) return (x / 1e6).toFixed(0) + 'M';
    if (x >= 1e3) return (x / 1e3).toFixed(0) + 'K';
    return String(x);
}
function logTick(value) {
    const l = Math.log10(value);
    return Math.abs(l - Math.round(l)) < 1e-9 ? short(value) : '';
}

// ---------- Controls ----------
function readControls() {
    return {
        rate: Number(document.getElementById('ingest').value),
        cadence: Number(document.getElementById('cadence').value),
        grain: document.getElementById('grain').value,
        design: document.getElementById('design').checked
    };
}

// ---------- Charts ----------
// Draw each bar's value above it, so the comparison reads without hovering
const barValuePlugin = {
    id: 'barValues',
    afterDatasetsDraw(chart) {
        const { ctx } = chart;
        const meta = chart.getDatasetMeta(0);
        ctx.save();
        ctx.font = 'bold 12px Arial, Helvetica, sans-serif';
        ctx.fillStyle = '#222';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        meta.data.forEach((bar, i) => {
            const v = chart.data.datasets[0].data[i];
            if (v === null || v === undefined) {
                ctx.fillText('no design estimate', bar.x, chart.chartArea.bottom - 6);
            } else {
                ctx.fillText(big(v), bar.x, bar.y - 3);
            }
        });
        ctx.restore();
    }
};

function narrowView() { return window.innerWidth < 600; }

function buildStorageChart() {
    const ctx = document.getElementById('storageChart');
    storageChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['ClickHouse rows', 'Graph vertices'],
            datasets: [{
                label: 'One simulated semester',
                data: [1, 1],
                backgroundColor: [BLUE, ORANGE],
                borderColor: [BLUE, ORANGE],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 250 },
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'One simulated semester (90 school days)', font: { size: 14 } },
                subtitle: { display: true, text: '', font: { size: 12 }, color: '#444', padding: { bottom: 4 } },
                tooltip: {
                    callbacks: {
                        title: items => items[0].label,
                        label: item => storageTooltip(item.dataIndex)
                    }
                }
            },
            scales: {
                y: {
                    type: 'logarithmic',
                    min: 1e5,
                    grace: 0,
                    max: 1e11,
                    title: { display: true, text: 'count (log scale)' },
                    ticks: { callback: v => logTick(v) }
                },
                x: { ticks: { font: { size: 12 } } }
            }
        },
        plugins: [barValuePlugin]
    });
}

function storageTooltip(i) {
    const s = readControls();
    const rows = semesterRows(s.rate);
    const g = GRAINS[s.grain];
    if (i === 0) {
        return [
            big(rows) + ' rows = ' + s.rate.toLocaleString('en-US') + ' stmt/s x 40% x 36,000 s x 90 days',
            'Source: design section 4 (duty cycle, active window); 90 days is this sim\'s semester.',
            'Design estimate, not measured.'
        ];
    }
    if (!g.ratio) return ['No design estimate: the design gives no ratio for LearningSession.'];
    return [
        big(rows / g.ratio) + ' ' + s.grain + ' vertices = rows / ' + g.ratio.toLocaleString('en-US'),
        'One vertex per ' + g.per + ' (' + g.stmts + '), if every statement fed this grain.',
        'Source: design section 4.1 storage compression. Design estimate, not measured.'
    ];
}

function buildRateChart() {
    const ctx = document.getElementById('rateChart');
    rateChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                { label: 'If every statement were a vertex', data: [], borderColor: VERMILLION, backgroundColor: VERMILLION,
                  borderDash: [6, 4], borderWidth: 2.5, pointRadius: 0, pointHitRadius: 6, tension: 0 },
                { label: 'Summary vertex upserts', data: [], borderColor: BLUE, backgroundColor: BLUE,
                  borderWidth: 3, pointRadius: 0, pointHitRadius: 6, tension: 0 },
                { label: 'Your ingest rate', data: [], type: 'scatter', borderColor: BLACK, backgroundColor: '#ffffff',
                  pointRadius: 6, pointBorderWidth: 2, pointStyle: 'circle', showLine: false },
                { label: 'Design section 4.1 rows', data: [], type: 'scatter', borderColor: BLACK, backgroundColor: ORANGE,
                  pointRadius: 7, pointStyle: 'triangle', pointBorderWidth: 1.5, showLine: false }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 250 },
            interaction: { mode: 'nearest', intersect: false },
            plugins: {
                title: { display: true, text: 'Graph writes per second vs ingest rate', font: { size: 14 } },
                legend: { position: 'bottom', onClick: null, labels: { boxWidth: 18, font: { size: 11 }, filter: it => !(it.datasetIndex === 3 && it.hidden) } },
                tooltip: { callbacks: { label: item => rateTooltip(item) } }
            },
            scales: {
                x: {
                    type: 'linear', min: 1000, max: 50000,
                    title: { display: true, text: 'ingest rate, statements/s (same 100,000 students)' },
                    ticks: { callback: v => short(v), maxTicksLimit: 8 }
                },
                y: {
                    type: 'logarithmic', min: 100, max: 1e6,
                    title: { display: true, text: 'graph writes/s (log scale)' },
                    ticks: { callback: v => logTick(v) }
                }
            }
        }
    });
}

function rateTooltip(item) {
    const s = readControls();
    const x = item.parsed.x, y = item.parsed.y;
    const ds = item.datasetIndex;
    if (ds === 0) {
        return ['Every statement a vertex: ' + big(y) + ' writes/s = ' + big(x) + ' x ~5 (vertex + ~4 edges)',
            'Source: design section 4 (~50,000 at 10,000 stmt/s). Design estimate, not measured.'];
    }
    if (ds === 1 || ds === 2) {
        const g = grainsPerWindow(x, s.cadence);
        return ['Summary upserts: ' + big(y) + '/s = ' + big(g) + ' grains / ' + s.cadence + ' s window',
            (x * s.cadence / g).toFixed(1) + ' statements per grain per window',
            'Source: design section 4.1 rows, interpolated by this sim. Not measured.'];
    }
    const r = DESIGN_ROWS[item.dataIndex];
    return ['Design row, ' + r.cadence + ' s cadence at 10,000 stmt/s:',
        r.coalesced + ' statements coalesced, ' + r.grains + ' grains, ~' + r.upserts.toLocaleString('en-US') + ' upserts/s, lag ' + r.lag,
        'Source: design section 4.1. Design estimate, not measured.'];
}

// ---------- Update ----------
function update() {
    const s = readControls();
    document.getElementById('ingest-val').textContent = s.rate.toLocaleString('en-US') + '/s';
    document.getElementById('cadence-val').textContent = s.cadence + ' s';

    // left chart
    const rows = semesterRows(s.rate);
    const g = GRAINS[s.grain];
    const verts = g.ratio ? rows / g.ratio : null;
    storageChart.data.labels = ['ClickHouse rows', s.grain + ' vertices'];
    storageChart.data.datasets[0].data = [rows, verts];
    storageChart.options.plugins.subtitle.text = g.ratio
        ? 'ratio ~' + g.ratio.toLocaleString('en-US') + ':1 (design estimate)'
        : 'no design estimate for LearningSession';
    storageChart.update();

    // right chart: curves across the ingest range
    const every = [], summary = [];
    for (let x = 1000; x <= 50000; x += 500) {
        every.push({ x, y: everyVertexWrites(x) });
        summary.push({ x, y: summaryUpserts(x, s.cadence) });
    }
    const nv = narrowView();
    rateChart.data.datasets[0].label = nv ? 'Every statement a vertex' : 'If every statement were a vertex';
    rateChart.data.datasets[2].label = nv ? 'Your rate' : 'Your ingest rate';
    rateChart.data.datasets[3].label = nv ? 'Design rows' : 'Design section 4.1 rows';
    for (const c of [storageChart, rateChart]) c.options.plugins.title.font.size = nv ? 12 : 14;
    rateChart.options.plugins.legend.labels.font.size = nv ? 10 : 11;
    rateChart.options.plugins.legend.labels.boxWidth = nv ? 12 : 18;
    rateChart.options.scales.x.title.text = nv ? 'ingest rate, stmt/s' : 'ingest rate, statements/s (same 100,000 students)';
    rateChart.options.scales.y.title.text = nv ? 'writes/s (log)' : 'graph writes/s (log scale)';
    storageChart.options.scales.y.title.text = nv ? 'count (log)' : 'count (log scale)';
    storageChart.options.plugins.subtitle.display = !nv;
    rateChart.data.datasets[0].data = every;
    rateChart.data.datasets[1].data = summary;
    rateChart.data.datasets[1].label = nv ? 'Summary upserts' : 'Summary upserts (' + s.cadence + ' s cadence)';
    rateChart.data.datasets[2].data = [{ x: s.rate, y: everyVertexWrites(s.rate) }, { x: s.rate, y: summaryUpserts(s.rate, s.cadence) }];
    rateChart.data.datasets[3].data = DESIGN_ROWS.map(r => ({ x: 10000, y: r.upserts }));
    rateChart.setDatasetVisibility(3, s.design);
    rateChart.update();

    // accessible descriptions
    document.getElementById('storageChart').setAttribute('aria-label',
        'Bar chart, log scale: one simulated semester at ' + s.rate.toLocaleString('en-US') + ' statements per second gives ' +
        big(rows) + ' ClickHouse rows and ' + (verts ? big(verts) + ' ' + s.grain + ' vertices' : 'no design estimate for ' + s.grain) + '.');
    const up = summaryUpserts(s.rate, s.cadence);
    document.getElementById('rateChart').setAttribute('aria-label',
        'Line chart, log scale: at ' + s.rate.toLocaleString('en-US') + ' statements per second, one vertex per statement would need ' +
        big(everyVertexWrites(s.rate)) + ' graph writes per second, while summary vertices at a ' + s.cadence +
        ' second cadence need about ' + big(up) + ' upserts per second.');

    writeNote(s, up);
}

function writeNote(s, up) {
    const inWindow = s.rate * s.cadence;
    const grains = grainsPerWindow(s.rate, s.cadence);
    const perGrain = inWindow / grains;
    const base = summaryUpserts(10000, s.cadence);
    const burst = summaryUpserts(50000, s.cadence);
    if (narrowView()) {
        document.getElementById('note').innerHTML = '<b>' + perGrain.toFixed(1) + ' statements per grain</b> per ' + s.cadence +
            ' s window: about <b>' + big(up) + ' upserts/s</b>, versus <b>' + big(everyVertexWrites(s.rate)) +
            ' writes/s</b> with one vertex per statement. <b>A burst adds statements per grain, not grains.</b> ' +
            '<span class="src">Design estimates (sections 4, 4.1), not measured.</span>';
        return;
    }
    let html = '<b>At ' + s.rate.toLocaleString('en-US') + ' stmt/s and a ' + s.cadence + ' s cadence:</b> ' +
        big(inWindow) + ' statements per window coalesce into about ' + big(grains) + ' grains (' +
        perGrain.toFixed(1) + ' statements per grain), so the summarizer writes about <b>' + big(up) +
        ' upserts/s</b>. One vertex per statement would need <b>' + big(everyVertexWrites(s.rate)) + ' writes/s</b>. ';
    html += 'A 5x burst from 10,000 to 50,000 stmt/s moves the summary line from ' + big(base) + ' to ' + big(burst) +
        ' upserts/s: <b>a burst increases statements per grain, not the number of grains.</b> ';
    html += '<span class="src">Inputs: design sections 4 and 4.1; values between the design rows are interpolated. ' +
        'Design estimates, not measured.</span>';
    document.getElementById('note').innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function () {
    buildStorageChart();
    buildRateChart();
    for (const id of ['ingest', 'cadence', 'grain', 'design']) {
        document.getElementById(id).addEventListener('input', update);
        document.getElementById(id).addEventListener('change', update);
    }
    update();
    window.addEventListener('resize', () => { update(); });
});
