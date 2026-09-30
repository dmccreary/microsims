// Capacity and Cost Explorer - Chart.js
// CANVAS_HEIGHT: 700
// Learning objective (Evaluate / judge): the learner judges which deployment tier fits a school or
// district by estimating daily statements and storage from the number of active students and
// comparing the result with the design's two published cost tiers (Chapter 21, "The Capacity
// Model" and "The Cost Model").
// Capacity assumptions (the design's capacity model, quoted in Chapter 21):
//   0.1 statements per second per active student, 40% duty cycle, 10 active hours (36,000 s),
//   1.5 KB per statement, ClickHouse columnar ratio of about 10, 180-day school year.
// Cost tiers (companion hardware specification, draft dated 2026-07-15, planning estimates from
// public on-demand cloud pricing, not quotes):
//   §8 single server, 1,000 stmt/s sustained (5,000 burst): $300-$800/month dedicated hosting,
//      $1,000-$2,500/month rented cloud instance, or $8,000-$15,000 upfront to buy.
//   §4 distributed, 10,000 stmt/s sustained (50,000 burst): about $10,300/month on demand,
//      infrastructure only; reserved pricing toward $6,500-$7,500/month.
//   §5 Neo4j license placeholder for the distributed tier: $3,000-$8,000/month.
//   §8 advice: move toward the distributed design as sustained ingest nears 3,000-5,000 stmt/s.

const RATE_PER_STUDENT = 0.1;
const ACTIVE_SECONDS = 36000;
const KB_PER_STATEMENT = 1.5;
const COLUMNAR_RATIO = 10;
const SCHOOL_DAYS = 180;
const BURST_FACTOR = 5;
const SINGLE_LIMIT = 1000, SINGLE_BURST = 5000;
const DIST_LIMIT = 10000, DIST_BURST = 50000;
const MOVE_LOW = 3000, MOVE_HIGH = 5000;
const LICENSE = [3000, 8000];
const COST_ROWS = [
    { tier: 'single', name: ['Single server', 'dedicated hosting'], short: ['Single', 'hosted'], range: [300, 800], src: 'hardware spec section 8' },
    { tier: 'single', name: ['Single server', 'rented cloud VM'], short: ['Single', 'rented'], range: [1000, 2500], src: 'hardware spec section 8' },
    { tier: 'dist', name: ['Distributed', 'reserved pricing'], short: ['Distrib.', 'reserved'], range: [6500, 7500], src: 'hardware spec section 4' },
    { tier: 'dist', name: ['Distributed', 'on demand'], short: ['Distrib.', 'on demand'], range: [10300, 10300], src: 'hardware spec section 4' }
];
// Okabe-Ito colors (color-blind safe)
const BLUE = '#0072B2', GREEN = '#009E73', ORANGE = '#E69F00', VERMILLION = '#D55E00', SKY = '#56B4E9';

let loadChart = null, costChart = null;
let current = null;

// ---------- Model ----------
function studentsFromSlider(v) {
    const raw = 500 * Math.pow(200, v / 1000);           // log scale 500 .. 100,000
    const step = raw < 1000 ? 10 : raw < 10000 ? 100 : 1000;
    return Math.round(raw / step) * step;
}

function compute() {
    const students = studentsFromSlider(Number(document.getElementById('students').value));
    const duty = Number(document.getElementById('duty').value) / 100;
    const rate = students * RATE_PER_STUDENT;
    const perDay = rate * duty * ACTIVE_SECONDS;
    const rawGB = perDay * KB_PER_STATEMENT / 1e6;
    const chGB = rawGB / COLUMNAR_RATIO;
    let tier, kind;
    if (rate <= SINGLE_LIMIT) { tier = 'single'; kind = 'fits'; }
    else if (rate < MOVE_LOW) { tier = 'single'; kind = 'stretched'; }
    else if (rate <= MOVE_HIGH) { tier = 'boundary'; kind = 'boundary'; }
    else if (rate <= DIST_LIMIT) { tier = 'dist'; kind = 'fits'; }
    else { tier = 'dist'; kind = 'over'; }
    return {
        students, duty, rate, perDay, rawGB, chGB, yearGB: chGB * SCHOOL_DAYS,
        burst: rate * BURST_FACTOR, tier, kind,
        neo4j: document.getElementById('neo4j').checked,
        showBurst: document.getElementById('burst').checked
    };
}

// ---------- Formatting ----------
function n0(x) { return Math.round(x).toLocaleString('en-US'); }
function mil(x) { return x >= 1e6 ? (x / 1e6).toFixed(x >= 1e8 ? 0 : 2) + ' million' : n0(x); }
function gb(x) { return x >= 1000 ? (x / 1000).toFixed(1) + ' TB' : x >= 100 ? n0(x) + ' GB' : x >= 10 ? x.toFixed(1) + ' GB' : x.toFixed(2) + ' GB'; }
function usd(x) { return '$' + n0(x); }
function narrowView() { return window.innerWidth < 520; }
function stackedView() { return window.innerWidth < 700; }   // charts stack: use the short message

// ---------- Plugins ----------
const valueLabels = {
    id: 'valueLabels',
    afterDatasetsDraw(chart) {
        const { ctx } = chart;
        ctx.save();
        ctx.font = 'bold 12px Arial, Helvetica, sans-serif';
        ctx.fillStyle = '#222';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        chart.data.datasets.forEach((ds, di) => {
            const meta = chart.getDatasetMeta(di);
            meta.data.forEach((bar, i) => {
                const v = ds.data[i];
                if (v === null || v === undefined) return;
                ctx.fillText(di === 0 ? mil(v) : gb(v), bar.x, bar.y - 3);
            });
        });
        ctx.restore();
    }
};

// Marks the tier that fits: a triangle and "your N stmt/s" beside the matching cost bars
const tierMarker = {
    id: 'tierMarker',
    afterDatasetsDraw(chart) {
        if (!current) return;
        const { ctx, chartArea } = chart;
        const meta = chart.getDatasetMeta(0);
        const rows = COST_ROWS.map((r, i) => ({ r, i })).filter(o =>
            current.tier === 'boundary' ? true : o.r.tier === current.tier);
        if (!rows.length) return;
        ctx.save();
        // outline the whole category band of each fitting row (both grouped bars included)
        const yScale = chart.scales.y;
        const band = Math.abs(yScale.getPixelForValue(1) - yScale.getPixelForValue(0));
        const idx = rows.map(o => o.i);
        const yTop = yScale.getPixelForValue(Math.min(...idx)) - band / 2 + 3;
        const yBot = yScale.getPixelForValue(Math.max(...idx)) + band / 2 - 3;
        const x = chartArea.right - 4;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(chartArea.left + 1, yTop, chartArea.right - chartArea.left - 2, yBot - yTop);
        ctx.setLineDash([]);
        ctx.font = 'bold 12px Arial, Helvetica, sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        if (chartArea.right - chartArea.left < 260) { ctx.restore(); return; }
        const label = (current.tier === 'boundary' ? 'near the boundary: ' : 'fits ') + n0(current.rate) + ' stmt/s' +
            (current.showBurst ? ' (burst ' + n0(current.burst) + ')' : '');
        const tw = ctx.measureText(label).width;
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.fillRect(x - tw - 18, yTop - 16, tw + 20, 16);
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(x - tw - 14, yTop - 12);
        ctx.lineTo(x - tw - 14, yTop - 2);
        ctx.lineTo(x - tw - 6, yTop - 7);
        ctx.closePath();
        ctx.fill();
        ctx.fillText(label, x, yTop - 1);
        ctx.restore();
    }
};

// ---------- Charts ----------
function buildLoadChart() {
    loadChart = new Chart(document.getElementById('loadChart'), {
        type: 'bar',
        data: {
            labels: [['Statements', 'per day'], ['Raw JSON', 'per day'], ['ClickHouse', 'per day']],
            datasets: [
                { label: 'Statements (left axis)', data: [0, null, null], yAxisID: 'y', backgroundColor: BLUE },
                { label: 'Storage in GB (right axis)', data: [null, 0, 0], yAxisID: 'y1', backgroundColor: [ORANGE, ORANGE, SKY] }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 250 },
            layout: { padding: { top: 6 } },
            datasets: { bar: { skipNull: true, maxBarThickness: 90 } },
            plugins: {
                title: { display: true, text: 'Estimated daily load', font: { size: 14 } },
                legend: { display: false },
                tooltip: { callbacks: { label: item => loadTooltip(item.dataIndex) } }
            },
            scales: {
                y: { beginAtZero: true, grace: '12%', position: 'left',
                     title: { display: true, text: 'statements per day', color: BLUE },
                     ticks: { callback: v => v >= 1e6 ? (v / 1e6) + 'M' : v >= 1e3 ? (v / 1e3) + 'K' : v } },
                y1: { beginAtZero: true, grace: '12%', position: 'right', grid: { drawOnChartArea: false },
                      title: { display: true, text: 'GB per day', color: '#8a5a00' } },
                x: { ticks: { font: { size: 12 }, autoSkip: false, maxRotation: 0 } }
            }
        },
        plugins: [valueLabels]
    });
}

function loadTooltip(i) {
    const c = current;
    const dutyPct = Math.round(c.duty * 100);
    if (i === 0) return [mil(c.perDay) + ' statements = ' + n0(c.rate) + ' stmt/s x ' + dutyPct + '% x 36,000 s',
        'rate = ' + n0(c.students) + ' students x 0.1 stmt/s. Source: design capacity model (Chapter 21).'];
    if (i === 1) return [gb(c.rawGB) + ' = ' + mil(c.perDay) + ' statements x 1.5 KB', 'Source: design capacity model (1.5 KB mean statement size).'];
    return [gb(c.chGB) + ' = raw ' + gb(c.rawGB) + ' / 10 (columnar ratio)', 'About ' + gb(c.yearGB) + ' per 180-day school year.'];
}

function buildCostChart() {
    costChart = new Chart(document.getElementById('costChart'), {
        type: 'bar',
        data: {
            labels: COST_ROWS.map(r => r.name),
            datasets: [
                { label: 'Infrastructure (planning estimate)', data: COST_ROWS.map(r => r.range), backgroundColor: [], borderColor: [],
                  borderWidth: 2, minBarLength: 6, barPercentage: 0.8, categoryPercentage: 0.8, borderSkipped: false },
                { label: 'With Neo4j license placeholder', data: COST_ROWS.map(r => r.tier === 'dist' ? [r.range[0] + LICENSE[0], r.range[1] + LICENSE[1]] : null),
                  backgroundColor: 'rgba(213, 94, 0, 0.35)', borderColor: VERMILLION, borderWidth: 1.5, minBarLength: 6,
                  barPercentage: 0.8, categoryPercentage: 0.8, borderSkipped: false }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 250 },
            layout: { padding: { top: 20 } },
            datasets: { bar: { skipNull: true } },
            plugins: {
                title: { display: true, text: 'Monthly cost by tier (USD)', font: { size: 14 } },
                legend: { position: 'bottom', onClick: null, labels: { boxWidth: 14, font: { size: 11 }, filter: it => !(it.datasetIndex === 1 && it.hidden) } },
                tooltip: { callbacks: { label: item => costTooltip(item) } }
            },
            scales: {
                x: { type: 'logarithmic', min: 100, max: 30000,
                     title: { display: true, text: 'USD per month (log scale)' },
                     ticks: { callback: v => [100, 300, 1000, 3000, 10000, 30000].includes(v) ? '$' + (v >= 1000 ? (v / 1000) + 'K' : v) : '' } },
                y: { ticks: { font: { size: 12 }, autoSkip: false } }
            }
        },
        plugins: [tierMarker]
    });
}

function costTooltip(item) {
    const r = COST_ROWS[item.dataIndex];
    const v = item.raw;
    const range = v[0] === v[1] ? 'about ' + usd(v[0]) : usd(v[0]) + ' to ' + usd(v[1]);
    if (item.datasetIndex === 1) {
        return [range + ' per month with the Neo4j license placeholder', '(+$3,000 to $8,000; hardware spec section 5, a placeholder, not a quote)'];
    }
    const cap = r.tier === 'single' ? 'sized for 1,000 stmt/s sustained, 5,000 burst' : 'sized for 10,000 stmt/s sustained, 50,000 burst';
    const lines = [range + ' per month, infrastructure only', cap, 'Source: ' + r.src + ', draft 2026-07-15. Planning estimate, not a quote.'];
    if (r.tier === 'single' && item.dataIndex === 0) lines.push('Buying instead: $8,000 to $15,000 upfront (section 8).');
    return lines;
}

// ---------- Update ----------
function update() {
    current = compute();
    const c = current;
    document.getElementById('students-val').textContent = n0(c.students);
    document.getElementById('duty-val').textContent = Math.round(c.duty * 100) + '%';

    loadChart.data.datasets[0].data = [c.perDay, null, null];
    loadChart.data.datasets[1].data = [null, c.rawGB, c.chGB];
    loadChart.update();

    const nv = narrowView();
    costChart.data.labels = COST_ROWS.map(r => nv ? r.short : r.name);
    const sv = stackedView();
    costChart.options.plugins.legend.display = !sv;
    costChart.options.layout.padding.top = sv ? 4 : 20;
    for (const ch of [loadChart, costChart]) ch.options.plugins.title.font.size = nv ? 12 : 14;
    loadChart.options.scales.y.title.display = !nv;
    loadChart.options.scales.y1.title.display = !nv;
    costChart.options.scales.x.title.display = !sv;
    const fits = r => c.tier === 'boundary' || r.tier === c.tier;
    costChart.data.datasets[0].backgroundColor = COST_ROWS.map(r => {
        const base = r.tier === 'single' ? '0, 158, 115' : '0, 114, 178';
        return 'rgba(' + base + ', ' + (fits(r) ? 0.9 : 0.3) + ')';
    });
    costChart.data.datasets[0].borderColor = COST_ROWS.map(r => r.tier === 'single' ? GREEN : BLUE);
    costChart.setDatasetVisibility(1, c.neo4j);
    costChart.update();

    document.getElementById('loadChart').setAttribute('aria-label',
        'Bar chart: ' + n0(c.students) + ' active students give ' + mil(c.perDay) + ' statements per day, ' +
        gb(c.rawGB) + ' of raw JSON and ' + gb(c.chGB) + ' in ClickHouse per day.');
    document.getElementById('costChart').setAttribute('aria-label',
        'Horizontal range chart of monthly cost: single server $300 to $800 hosted or $1,000 to $2,500 rented; ' +
        'distributed about $10,300 on demand or $6,500 to $7,500 reserved' + (c.neo4j ? ', plus $3,000 to $8,000 for a Neo4j license placeholder' : '') +
        '. The outlined tier is the one that fits ' + n0(c.rate) + ' statements per second.');
    writeMessage(c, stackedView());
}

function tierSentence(c) {
    const lic = c.neo4j ? ', plus $3,000-$8,000 for the Neo4j license placeholder' : '';
    if (c.tier === 'single' && c.kind === 'fits') {
        return ['fits', 'Single-server tier fits: ' + n0(c.rate) + ' stmt/s is inside its stated 1,000 stmt/s.',
            'About $300-$800/month hosted or $1,000-$2,500 rented, versus about $10,300/month on demand for the distributed tier' + lic + '.'];
    }
    if (c.tier === 'single') {
        return ['warn', 'Beyond the single-server sizing: ' + n0(c.rate) + ' stmt/s is over its stated 1,000 stmt/s.',
            'The specification says to move toward the distributed design as sustained ingest approaches 3,000-5,000 stmt/s; plan for it.'];
    }
    if (c.tier === 'boundary') {
        return ['warn', 'Near the boundary: ' + n0(c.rate) + ' stmt/s is inside the 3,000-5,000 stmt/s band.',
            'The specification advises moving to the distributed tier here: about $6,500-$10,300/month' + lic + ', and it adds high availability.'];
    }
    return ['dist', 'Distributed tier fits: ' + n0(c.rate) + ' stmt/s is within its 10,000 stmt/s design target.',
        'About $10,300/month on demand or $6,500-$7,500 reserved' + lic + '.'];
}

function writeMessage(c, nv) {
    const [cls, head, cost] = tierSentence(c);
    const el = document.getElementById('message');
    el.className = cls === 'fits' ? '' : cls;
    let burst = '';
    if (c.showBurst) {
        const lim = c.tier === 'dist' ? DIST_BURST : SINGLE_BURST;
        burst = ' Burst (5x): ' + n0(c.burst) + ' stmt/s' + (c.burst > lim && c.tier !== 'dist'
            ? ', above the single server\'s stated 5,000 burst.' : ', inside the tier\'s stated burst.') +
            ' The design absorbs bursts in the queue, so size by the sustained rate.';
    }
    if (nv) {
        el.innerHTML = '<span class="tier">' + head + '</span> ' + n0(c.students) + ' students: ' + mil(c.perDay) +
            ' statements, ' + gb(c.rawGB) + ' raw per day.' + (c.neo4j ? ' Orange bars add the Neo4j license placeholder.' : '') + burst +
            ' <span class="src">Draft hardware spec 2026-07-15: estimates, not quotes.</span>';
        return;
    }
    el.innerHTML = '<span class="tier">' + head + '</span> ' + cost + '<br>' +
        n0(c.students) + ' students x 0.1 = <b>' + n0(c.rate) + ' stmt/s</b> sustained. Per day: ' + mil(c.perDay) +
        ' statements, ' + gb(c.rawGB) + ' raw JSON, ' + gb(c.chGB) + ' in ClickHouse (' + gb(c.yearGB) + ' per school year).' + burst +
        '<br><span class="src">Capacity assumptions: the design\'s capacity model (Chapter 21). Costs: companion hardware specification, ' +
        'draft dated 2026-07-15, planning estimates from public cloud pricing, not quotes; they exclude engineering time and support.</span>';
}

document.addEventListener('DOMContentLoaded', function () {
    buildLoadChart();
    buildCostChart();
    for (const id of ['students', 'duty', 'neo4j', 'burst']) {
        document.getElementById(id).addEventListener('input', update);
        document.getElementById(id).addEventListener('change', update);
    }
    update();
    window.addEventListener('resize', update);
});
