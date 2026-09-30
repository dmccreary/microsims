// Priority Matrix Bubble Explorer - Chart.js 4.4.0 bubble chart
// CANVAS_HEIGHT: 500
// Eight invented MicroSim types plotted by effort (x) and impact (y), with bubble
// size showing how many planned MicroSims use the type. Click a bubble to select
// it, then move it with the Effort and Impact sliders and watch the quadrant list.
// A custom plugin shades the quadrants (beforeDatasetsDraw) and draws the quadrant
// and item labels (afterDatasetsDraw) so tooltips always paint on top.

// ---------------------------------------------------------------------------
// Data (invented for illustration)
// ---------------------------------------------------------------------------
const ORIGINAL_ITEMS = [
    { id: 0, name: 'Bar Charts',     effort: 2,   impact: 7,   count: 12, status: 'Planned' },
    { id: 1, name: 'Function Plots', effort: 4,   impact: 8,   count: 5,  status: 'Planned' },
    { id: 2, name: 'Physics Sims',   effort: 6,   impact: 8.5, count: 9,  status: 'In progress' },
    { id: 3, name: 'Network Maps',   effort: 8,   impact: 6.5, count: 3,  status: 'Proposed' },
    { id: 4, name: 'Timelines',      effort: 3.5, impact: 4,   count: 6,  status: 'In progress' },
    { id: 5, name: 'Venn Diagrams',  effort: 1.5, impact: 2,   count: 4,  status: 'Proposed' },
    { id: 6, name: 'Map Explorers',  effort: 6.5, impact: 2.5, count: 2,  status: 'Planned' },
    { id: 7, name: '3D Models',      effort: 9,   impact: 4,   count: 1,  status: 'Proposed' }
];

const STATUS_COLORS = {
    'Planned':     { fill: 'rgba(37, 99, 235, 0.65)',  border: 'rgb(30, 64, 175)' },
    'In progress': { fill: 'rgba(217, 119, 6, 0.65)',  border: 'rgb(146, 64, 14)' },
    'Proposed':    { fill: 'rgba(124, 58, 237, 0.60)', border: 'rgb(91, 33, 182)' }
};

const MIDPOINT = 5;  // a score above 5 is "high"; 5 or below is "low"

const QUADRANTS = {
    quick: { name: 'Quick Wins',     rule: 'impact > 5, effort 5 or less', cls: 'q-quick', shade: 'rgba(22, 163, 74, 0.08)',  text: 'rgba(21, 128, 61, 0.85)' },
    major: { name: 'Major Projects', rule: 'impact > 5, effort > 5',       cls: 'q-major', shade: 'rgba(37, 99, 235, 0.08)',  text: 'rgba(30, 64, 175, 0.85)' },
    fill:  { name: 'Fill-ins',       rule: 'impact 5 or less, effort 5 or less', cls: 'q-fill', shade: 'rgba(161, 98, 7, 0.07)', text: 'rgba(133, 77, 14, 0.85)' },
    pit:   { name: 'Money Pits',     rule: 'impact 5 or less, effort > 5', cls: 'q-pit',   shade: 'rgba(220, 38, 38, 0.08)',  text: 'rgba(185, 28, 28, 0.85)' }
};
const QUAD_ORDER = ['quick', 'major', 'fill', 'pit'];

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
let items = [];
let selectedId = 0;
let bubbleScale = 2;
let showQuadLabels = true;
let chart = null;
let lastQuadrant = {};

function cloneItems() {
    return ORIGINAL_ITEMS.map(it => Object.assign({}, it));
}

function quadrantOf(item) {
    const highImpact = item.impact > MIDPOINT;
    const highEffort = item.effort > MIDPOINT;
    if (highImpact && !highEffort) return 'quick';
    if (highImpact && highEffort) return 'major';
    if (!highImpact && !highEffort) return 'fill';
    return 'pit';
}

// Linear radius scaling between a min and max radius (bubble guide pattern).
// Bubble scale 2 gives the guide's 8 to 30 pixel bounds.
function bubbleRadius(count) {
    const counts = ORIGINAL_ITEMS.map(i => i.count);
    const minCount = Math.min(...counts);
    const maxCount = Math.max(...counts);
    const minR = 4 * bubbleScale;
    const maxR = 15 * bubbleScale;
    return minR + ((count - minCount) / (maxCount - minCount)) * (maxR - minR);
}

function buildDatasets() {
    return Object.keys(STATUS_COLORS).map(status => ({
        label: status,
        data: items.filter(it => it.status === status).map(it => ({
            x: it.effort, y: it.impact, r: bubbleRadius(it.count), id: it.id
        })),
        backgroundColor: STATUS_COLORS[status].fill,
        borderColor: ctx => (ctx.raw && ctx.raw.id === selectedId) ? '#111827' : STATUS_COLORS[status].border,
        borderWidth: ctx => (ctx.raw && ctx.raw.id === selectedId) ? 4 : 1.5,
        hoverBorderWidth: 3
    }));
}

// ---------------------------------------------------------------------------
// Quadrant plugin: shading before the bubbles, labels after them
// ---------------------------------------------------------------------------
const quadrantPlugin = {
    id: 'quadrants',
    beforeDatasetsDraw(chart) {
        const { ctx, chartArea: a, scales: { x, y } } = chart;
        const mx = x.getPixelForValue(MIDPOINT);
        const my = y.getPixelForValue(MIDPOINT);
        ctx.save();
        const rects = {
            quick: [a.left, a.top, mx - a.left, my - a.top],
            major: [mx, a.top, a.right - mx, my - a.top],
            fill:  [a.left, my, mx - a.left, a.bottom - my],
            pit:   [mx, my, a.right - mx, a.bottom - my]
        };
        for (const q of QUAD_ORDER) {
            ctx.fillStyle = QUADRANTS[q].shade;
            ctx.fillRect(...rects[q]);
        }
        // dashed midpoint lines
        ctx.strokeStyle = 'rgba(71, 85, 105, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(mx, a.top); ctx.lineTo(mx, a.bottom);
        ctx.moveTo(a.left, my); ctx.lineTo(a.right, my);
        ctx.stroke();
        ctx.restore();
    },
    afterDatasetsDraw(chart) {
        const { ctx, chartArea: a } = chart;
        ctx.save();
        // Quadrant labels in the outer corners
        if (showQuadLabels) {
            ctx.font = 'bold 13px Arial, Helvetica, sans-serif';
            const pad = 6;
            const corner = {
                quick: [a.left + pad, a.top + pad, 'left', 'top'],
                major: [a.right - pad, a.top + pad, 'right', 'top'],
                fill:  [a.left + pad, a.bottom - pad, 'left', 'bottom'],
                pit:   [a.right - pad, a.bottom - pad, 'right', 'bottom']
            };
            for (const q of QUAD_ORDER) {
                const [cx, cy, align, base] = corner[q];
                ctx.fillStyle = QUADRANTS[q].text;
                ctx.textAlign = align;
                ctx.textBaseline = base;
                ctx.fillText(QUADRANTS[q].name, cx, cy);
            }
        }
        // Item name labels just above each bubble
        ctx.font = '12px Arial, Helvetica, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        chart.data.datasets.forEach((ds, di) => {
            const meta = chart.getDatasetMeta(di);
            if (meta.hidden) return;
            meta.data.forEach((el, i) => {
                const raw = ds.data[i];
                const item = items[raw.id];
                const r = el.options.radius;
                ctx.fillStyle = raw.id === selectedId ? '#111827' : '#334155';
                ctx.font = (raw.id === selectedId ? 'bold ' : '') + '12px Arial, Helvetica, sans-serif';
                ctx.fillText(item.name, el.x, el.y - r - 2);
            });
        });
        ctx.restore();
    }
};

// ---------------------------------------------------------------------------
// Chart
// ---------------------------------------------------------------------------
// The axes run from -0.5 to 10.5 so edge bubbles are not clipped; this puts
// the tick marks back on the whole numbers 0 to 10.
function integerTicks(axis) {
    axis.ticks = Array.from({ length: 11 }, (_, v) => ({ value: v }));
}

function createChart() {
    const ctx = document.getElementById('chart');
    chart = new Chart(ctx, {
        type: 'bubble',
        data: { datasets: buildDatasets() },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.3,
            animation: { duration: 250 },
            layout: { padding: { top: 2, right: 6 } },
            scales: {
                x: {
                    min: -0.5, max: 10.5,
                    title: { display: true, text: 'Effort (0 = trivial, 10 = very hard)', font: { size: 13, weight: 'bold' } },
                    afterBuildTicks: integerTicks,
                    ticks: { font: { size: 12 } },
                    grid: { color: 'rgba(0,0,0,0.05)' }
                },
                y: {
                    min: -0.5, max: 10.5,
                    title: { display: true, text: 'Impact (0 = none, 10 = large)', font: { size: 13, weight: 'bold' } },
                    afterBuildTicks: integerTicks,
                    ticks: { font: { size: 12 } },
                    grid: { color: 'rgba(0,0,0,0.05)' }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: { font: { size: 12 }, boxWidth: 12, usePointStyle: true,
                              // plain status swatches (the selection outline must not leak into the legend)
                              generateLabels: chart => Chart.defaults.plugins.legend.labels.generateLabels(chart)
                                  .map(l => Object.assign(l, { lineWidth: 1.5, strokeStyle: STATUS_COLORS[l.text].border })) }
                },
                title: {
                    display: true,
                    text: 'Color = status; bubble size = number of planned MicroSims of that type',
                    font: { size: 12, weight: 'normal' },
                    color: '#475569',
                    padding: { top: 0, bottom: 2 },
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        title: ctxs => items[ctxs[0].raw.id].name,
                        label: c => {
                            const it = items[c.raw.id];
                            return [' Effort: ' + it.effort.toFixed(1),
                                    ' Impact: ' + it.impact.toFixed(1),
                                    ' Count: ' + it.count + ' planned MicroSims',
                                    ' Status: ' + it.status];
                        }
                    }
                }
            },
            onClick: (evt, elements) => {
                if (elements.length > 0) {
                    const el = elements[0];
                    const raw = chart.data.datasets[el.datasetIndex].data[el.index];
                    selectItem(raw.id);
                }
            },
            onHover: (evt, elements) => {
                evt.native.target.style.cursor = elements.length ? 'pointer' : 'default';
            }
        },
        plugins: [quadrantPlugin]
    });
}

function refreshChart() {
    // Update the data in place, then ask Chart.js to redraw
    const fresh = buildDatasets();
    chart.data.datasets.forEach((ds, i) => { ds.data = fresh[i].data; });
    chart.update();
}

// ---------------------------------------------------------------------------
// Quadrant list and explanation
// ---------------------------------------------------------------------------
function renderQuadList(flashQuads) {
    const box = document.getElementById('quad-list');
    box.innerHTML = '';
    for (const q of QUAD_ORDER) {
        const members = items.filter(it => quadrantOf(it) === q);
        const div = document.createElement('div');
        div.className = 'quad ' + QUADRANTS[q].cls + (flashQuads && flashQuads.includes(q) ? ' flash' : '');
        const names = members.length
            ? members.map(it => it.id === selectedId ? '<span class="sel">' + it.name + '</span>' : it.name).join(', ')
            : '<em>none</em>';
        div.innerHTML = '<div class="quad-title">' + QUADRANTS[q].name + ' (' + members.length + ')</div>' +
                        '<div class="quad-rule">' + QUADRANTS[q].rule + '</div>' +
                        '<div class="quad-items">' + names + '</div>';
        box.appendChild(div);
    }
}

function explainSelected(movedFrom) {
    const it = items[selectedId];
    const q = quadrantOf(it);
    const effortPart = it.effort > MIDPOINT ? 'effort ' + it.effort.toFixed(1) + ' > 5' : 'effort ' + it.effort.toFixed(1) + ' is 5 or less';
    const impactPart = it.impact > MIDPOINT ? 'impact ' + it.impact.toFixed(1) + ' > 5' : 'impact ' + it.impact.toFixed(1) + ' is 5 or less';
    let text = '<strong>Why:</strong> ' + it.name + ' has ' + impactPart + ' and ' + effortPart +
               ', so it is in <strong>' + QUADRANTS[q].name + '</strong>.';
    if (movedFrom && movedFrom !== q) {
        text += ' It moved from ' + QUADRANTS[movedFrom].name + '.';
    }
    document.getElementById('why').innerHTML = text;
}

// ---------------------------------------------------------------------------
// Controls
// ---------------------------------------------------------------------------
function syncSliders() {
    const it = items[selectedId];
    document.getElementById('selected-label').textContent =
        'Selected: ' + it.name + ' (click another bubble to select it)';
    document.getElementById('effort-slider').value = it.effort;
    document.getElementById('impact-slider').value = it.impact;
    document.getElementById('effort-val').textContent = it.effort.toFixed(1);
    document.getElementById('impact-val').textContent = it.impact.toFixed(1);
}

function selectItem(id) {
    selectedId = id;
    syncSliders();
    renderQuadList();
    explainSelected();
    chart.update('none');
}

function moveSelected(field, value) {
    const it = items[selectedId];
    const before = quadrantOf(it);
    it[field] = value;
    const after = quadrantOf(it);
    document.getElementById(field + '-val').textContent = value.toFixed(1);
    refreshChart();
    renderQuadList(before !== after ? [before, after] : null);
    explainSelected(before);
}

function resetAll() {
    items = cloneItems();
    selectedId = 0;
    bubbleScale = 2;
    showQuadLabels = true;
    document.getElementById('scale-slider').value = 2;
    document.getElementById('scale-val').textContent = '2.0';
    document.getElementById('labels-check').checked = true;
    syncSliders();
    refreshChart();
    renderQuadList();
    explainSelected();
}

document.addEventListener('DOMContentLoaded', function () {
    items = cloneItems();
    createChart();

    document.getElementById('effort-slider').addEventListener('input', e =>
        moveSelected('effort', parseFloat(e.target.value)));
    document.getElementById('impact-slider').addEventListener('input', e =>
        moveSelected('impact', parseFloat(e.target.value)));
    document.getElementById('scale-slider').addEventListener('input', e => {
        bubbleScale = parseFloat(e.target.value);
        document.getElementById('scale-val').textContent = bubbleScale.toFixed(1);
        refreshChart();
    });
    document.getElementById('labels-check').addEventListener('change', e => {
        showQuadLabels = e.target.checked;
        chart.update('none');
    });
    document.getElementById('reset-btn').addEventListener('click', resetAll);

    document.getElementById('scale-val').textContent = bubbleScale.toFixed(1);
    syncSliders();
    renderQuadList();
    explainSelected();
});
