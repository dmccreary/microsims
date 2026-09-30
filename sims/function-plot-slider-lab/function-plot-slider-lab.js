// Function Plot Slider Lab - Plotly.js 2.27.0
// CANVAS_HEIGHT: 540
// A red marker follows the x slider along the chosen curve; the readout above the
// plot reports x and f(x). "Show matches" marks every x in the domain where the
// curve reaches the target y. The whole plot is redrawn by createPlot(pointX).

// ---------------------------------------------------------------------------
// Configuration (guide pattern: domain about -2π to 2π, 500 samples)
// ---------------------------------------------------------------------------
const config = {
    xMin: -6.28,
    xMax: 6.28,
    numPoints: 500,
    initialX: 0
};

const PI = Math.PI;

// Each function lists its exact special points inside the domain so the
// hover text can name them, e.g. "(maximum of sin)".
const FUNCTIONS = {
    sin: {
        label: 'sin(x)', short: 'sin',
        f: x => Math.sin(x),
        features: [
            { x: -3 * PI / 2, note: 'maximum of sin' }, { x: PI / 2, note: 'maximum of sin' },
            { x: -PI / 2, note: 'minimum of sin' }, { x: 3 * PI / 2, note: 'minimum of sin' },
            { x: -PI, note: 'zero of sin' }, { x: 0, note: 'zero of sin' }, { x: PI, note: 'zero of sin' }
        ]
    },
    cos: {
        label: 'cos(x)', short: 'cos',
        f: x => Math.cos(x),
        features: [
            { x: 0, note: 'maximum of cos' },
            { x: -PI, note: 'minimum of cos' }, { x: PI, note: 'minimum of cos' },
            { x: -3 * PI / 2, note: 'zero of cos' }, { x: -PI / 2, note: 'zero of cos' },
            { x: PI / 2, note: 'zero of cos' }, { x: 3 * PI / 2, note: 'zero of cos' }
        ]
    },
    square: {
        label: 'x²', short: 'x²',
        f: x => x * x,
        features: [{ x: 0, note: 'minimum and zero of x²' }]
    },
    gauss: {
        label: 'e^(−x²)', short: 'e^(−x²)',
        f: x => Math.exp(-x * x),
        features: [{ x: 0, note: 'maximum of e^(−x²)' }]
    }
};

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
let fnKey = 'sin';
let pointX = config.initialX;
let matchXs = null;          // null = matches not shown
let matchTarget = null;

function fmt(v) {
    // three decimals, and avoid printing "-0.000"
    const s = v.toFixed(3);
    return s === '-0.000' ? '0.000' : s;
}

function currentFn() { return FUNCTIONS[fnKey]; }

// 500 evenly spaced samples plus the exact special points, sorted
function sampleCurve() {
    const fn = currentFn();
    const pts = [];
    for (let i = 0; i < config.numPoints; i++) {
        const x = config.xMin + (config.xMax - config.xMin) * i / (config.numPoints - 1);
        pts.push({ x: x, note: null });
    }
    fn.features.forEach(ft => {
        if (ft.x >= config.xMin && ft.x <= config.xMax) pts.push({ x: ft.x, note: ft.note });
    });
    pts.sort((a, b) => a.x - b.x);
    const xs = pts.map(p => p.x);
    const ys = xs.map(fn.f);
    const hover = pts.map((p, i) => 'x = ' + fmt(xs[i]) + ', f(x) = ' + fmt(ys[i]) + (p.note ? ' (' + p.note + ')' : ''));
    return { xs, ys, hover };
}

// y range padded by 10 percent of the span beyond the extreme values
function paddedRange(ys) {
    const lo = Math.min(...ys);
    const hi = Math.max(...ys);
    const pad = 0.1 * (hi - lo);
    return [lo - pad, hi + pad];
}

// ---------------------------------------------------------------------------
// Matches: every x in the domain where f(x) = target
// ---------------------------------------------------------------------------
function findMatches(target) {
    const f = currentFn().f;
    const g = x => f(x) - target;
    const N = 12560;                                   // 0.001 spacing
    const h = (config.xMax - config.xMin) / N;
    const xs = [], gs = [];
    for (let i = 0; i <= N; i++) {
        const x = config.xMin + i * h;
        xs.push(x);
        gs.push(g(x));
    }
    const roots = [];
    // 1. sign changes, refined by bisection
    for (let i = 0; i < N; i++) {
        if (gs[i] === 0) { roots.push(xs[i]); continue; }
        if (gs[i] * gs[i + 1] < 0) {
            let a = xs[i], b = xs[i + 1];
            for (let k = 0; k < 50; k++) {
                const m = (a + b) / 2;
                if (g(a) * g(m) <= 0) b = m; else a = m;
            }
            roots.push((a + b) / 2);
        }
    }
    // 2. touch points (curve reaches the target without crossing, e.g. sin(x) = 1)
    for (let i = 1; i < N; i++) {
        const ai = Math.abs(gs[i]);
        if (ai < 1e-3 && ai <= Math.abs(gs[i - 1]) && ai <= Math.abs(gs[i + 1]) && gs[i - 1] * gs[i + 1] > 0) {
            let a = xs[i - 1], b = xs[i + 1];
            for (let k = 0; k < 60; k++) {             // ternary search on |g|
                const m1 = a + (b - a) / 3, m2 = b - (b - a) / 3;
                if (Math.abs(g(m1)) < Math.abs(g(m2))) b = m2; else a = m1;
            }
            const xStar = (a + b) / 2;
            if (Math.abs(g(xStar)) < 1e-6) roots.push(xStar);
        }
    }
    roots.sort((a, b) => a - b);
    return roots.filter((r, i) => i === 0 || r - roots[i - 1] > 1e-3);
}

// ---------------------------------------------------------------------------
// Plot
// ---------------------------------------------------------------------------
function plotHeight() {
    return window.innerWidth < 600 ? 300 : 400;
}

function createPlot(pointX) {
    const fn = currentFn();
    const curve = sampleCurve();
    const pointY = fn.f(pointX);

    const traces = [
        {
            x: curve.xs, y: curve.ys,
            type: 'scatter', mode: 'lines',
            name: fn.label,
            line: { color: '#2563eb', width: 3 },
            customdata: curve.hover,
            hovertemplate: '%{customdata}<extra></extra>'
        },
        {
            x: [pointX], y: [pointY],
            type: 'scatter', mode: 'markers',
            name: 'marker',
            marker: { color: '#dc2626', size: 14, line: { color: '#7f1d1d', width: 2 } },
            hovertemplate: 'marker: x = ' + fmt(pointX) + ', f(x) = ' + fmt(pointY) + '<extra></extra>'
        }
    ];

    const shapes = [];
    if (matchXs !== null) {
        traces.push({
            x: matchXs, y: matchXs.map(() => matchTarget),
            type: 'scatter', mode: 'markers',
            name: 'matches',
            marker: { color: '#16a34a', size: 12, symbol: 'diamond', line: { color: '#14532d', width: 1.5 } },
            hovertemplate: 'match: x = %{x:.3f}, f(x) = %{y:.3f}<extra></extra>'
        });
        shapes.push({
            type: 'line', xref: 'x', yref: 'y',
            x0: config.xMin, x1: config.xMax, y0: matchTarget, y1: matchTarget,
            line: { color: '#16a34a', width: 1.5, dash: 'dash' }
        });
    }

    const yr = paddedRange(curve.ys);
    const layout = {
        height: plotHeight(),
        margin: { l: 52, r: 12, t: 12, b: 42 },
        showlegend: false,
        hovermode: 'closest',
        plot_bgcolor: 'white',
        paper_bgcolor: 'white',
        font: { family: 'Arial, Helvetica, sans-serif', size: 13 },
        xaxis: {
            range: [config.xMin, config.xMax],
            title: { text: 'x', standoff: 4 },
            zeroline: true, zerolinecolor: '#94a3b8',
            gridcolor: '#e2e8f0',
            tickvals: [-2 * PI, -3 * PI / 2, -PI, -PI / 2, 0, PI / 2, PI, 3 * PI / 2, 2 * PI],
            ticktext: ['−2π', '−3π/2', '−π', '−π/2', '0', 'π/2', 'π', '3π/2', '2π']
        },
        yaxis: {
            range: yr,
            title: { text: 'f(x) = ' + fn.label, standoff: 4 },
            zeroline: true, zerolinecolor: '#94a3b8',
            gridcolor: '#e2e8f0',
            fixedrange: true
        },
        shapes: shapes
    };

    const plotConfig = {
        responsive: true,
        displaylogo: false,
        scrollZoom: false,
        modeBarButtonsToRemove: ['select2d', 'lasso2d', 'autoScale2d', 'toggleSpikelines']
    };

    Plotly.react('plot', traces, layout, plotConfig);
    updateReadout(pointX, pointY);
}

function updateReadout(x, y) {
    document.getElementById('readout').textContent =
        'x = ' + fmt(x) + ',  f(x) = ' + currentFn().short + '(' + fmt(x) + ') = ' + fmt(y);
    if (fnKey === 'square' || fnKey === 'gauss') {
        const expr = fnKey === 'square' ? '(' + fmt(x) + ')²' : 'e^(−(' + fmt(x) + ')²)';
        document.getElementById('readout').textContent = 'x = ' + fmt(x) + ',  f(x) = ' + expr + ' = ' + fmt(y);
    }
    const slider = document.getElementById('x-slider');
    slider.setAttribute('aria-valuetext', 'x = ' + x.toFixed(2) + ', f(x) = ' + y.toFixed(3));
}

function showMatches() {
    const input = document.getElementById('target-input');
    const t = parseFloat(input.value);
    const box = document.getElementById('matches');
    if (Number.isNaN(t)) {
        box.className = 'matches none';
        box.textContent = 'Type a number in Target y first.';
        return;
    }
    matchTarget = t;
    matchXs = findMatches(t);
    const fn = currentFn();
    if (matchXs.length === 0) {
        const ys = sampleCurve().ys;
        box.className = 'matches none';
        box.textContent = 'No x between −6.28 and 6.28 gives ' + fn.label.replace('x', 'x') + ' = ' + t +
            '. Here f(x) only ranges from ' + fmt(Math.min(...ys)) + ' to ' + fmt(Math.max(...ys)) + '.';
    } else {
        box.className = 'matches';
        box.textContent = 'f(x) = ' + t + ' at x = ' + matchXs.map(fmt).join(', ') +
            '  (' + matchXs.length + (matchXs.length === 1 ? ' match)' : ' matches)');
    }
    createPlot(pointX);
}

function clearMatches() {
    matchXs = null;
    matchTarget = null;
    const box = document.getElementById('matches');
    box.className = 'matches';
    box.textContent = 'Enter a target y and press Show matches to mark every x where the curve reaches it.';
    createPlot(pointX);
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    const slider = document.getElementById('x-slider');
    slider.value = config.initialX;

    slider.addEventListener('input', e => {
        pointX = parseFloat(e.target.value);
        createPlot(pointX);
    });

    document.getElementById('fn-select').addEventListener('change', e => {
        fnKey = e.target.value;            // slider position is kept
        if (matchXs !== null) {
            showMatches();                 // re-mark matches for the new curve
        } else {
            createPlot(pointX);
        }
    });

    document.getElementById('match-btn').addEventListener('click', showMatches);
    document.getElementById('clear-btn').addEventListener('click', clearMatches);
    document.getElementById('target-input').addEventListener('keydown', e => {
        if (e.key === 'Enter') showMatches();
    });

    let lastNarrow = window.innerWidth < 600;
    window.addEventListener('resize', () => {
        const narrow = window.innerWidth < 600;
        if (narrow !== lastNarrow) {
            lastNarrow = narrow;
            createPlot(pointX);            // switch between 400 and 300 pixel heights
        }
    });

    clearMatches();                        // draws the first plot
});
