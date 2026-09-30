// Calibration Curve Lab - Plotly.js MicroSim
// CANVAS_HEIGHT: 620
// Reliability (calibration) curve for a synthetic cohort generated in the browser with the
// same rules as Chapter 19's worked example:
//   each learner starts mastered with probability 0.30; answers 4 practice items (correct with
//   probability 0.90 if mastered, the TRUE guess rate if not); after each answer an unmastered
//   learner learns with probability 0.15; finally answers one held-out item with the same rates.
//   The forecast is the BKT estimate after the 4 practice answers (L0 0.30, pt 0.15, ps 0.10 and
//   the MODEL's guess rate), converted to the chance of a correct held-out answer.
// Random numbers come from a Mersenne Twister identical to Python's random.Random(seed), so
// seed 19 with 200 learners reproduces the chapter's table exactly: with 5 equal-width bins the
// non-empty bins are 0.2-0.4 (65 learners, mean forecast 0.332, observed 0.400), 0.4-0.6 (25,
// 0.586, 0.520), 0.6-0.8 (8, 0.653, 0.500) and 0.8-1.0 (102, 0.880, 0.824).
// Points: x = mean forecast in the bin, y = observed fraction correct, area proportional to the
// number of learners. Bins with fewer than 10 learners get a dashed outline.

const CHAPTER_SEED = 19;
const SMALL_BIN = 10;
const SCENARIOS = {
    match: { pgTrue: 0.20, pgModel: 0.20, truth: 'well',
        name: 'model parameters match the simulation' },
    over: { pgTrue: 0.35, pgModel: 0.20, truth: 'over',
        name: 'true guess rate 0.35, model assumes 0.20' },
    under: { pgTrue: 0.20, pgModel: 0.35, truth: 'under',
        name: 'true guess rate 0.20, model assumes 0.35' }
};
const BLUE = 'rgba(0, 114, 178, 0.80)';        // Okabe-Ito blue
const BLUE_LIGHT = 'rgba(0, 114, 178, 0.25)';

// ---------- Mersenne Twister matching Python's random.Random(intSeed).random() ----------
function PyRandom(seed) {
    const N = 624, M = 397;
    const mt = new Uint32Array(N);
    let mti = N + 1;
    function initGenrand(s) {
        mt[0] = s >>> 0;
        for (mti = 1; mti < N; mti++) {
            const prev = mt[mti - 1] ^ (mt[mti - 1] >>> 30);
            mt[mti] = (Math.imul(1812433253, prev) + mti) >>> 0;
        }
    }
    function initByArray(key) {
        initGenrand(19650218);
        let i = 1, j = 0;
        for (let k = Math.max(N, key.length); k > 0; k--) {
            const prev = mt[i - 1] ^ (mt[i - 1] >>> 30);
            mt[i] = ((mt[i] ^ Math.imul(prev, 1664525)) + key[j] + j) >>> 0;
            i++; j++;
            if (i >= N) { mt[0] = mt[N - 1]; i = 1; }
            if (j >= key.length) j = 0;
        }
        for (let k = N - 1; k > 0; k--) {
            const prev = mt[i - 1] ^ (mt[i - 1] >>> 30);
            mt[i] = ((mt[i] ^ Math.imul(prev, 1566083941)) - i) >>> 0;
            i++;
            if (i >= N) { mt[0] = mt[N - 1]; i = 1; }
        }
        mt[0] = 0x80000000;
    }
    function genrandInt32() {
        let y;
        if (mti >= N) {
            let kk;
            for (kk = 0; kk < N - M; kk++) {
                y = (mt[kk] & 0x80000000) | (mt[kk + 1] & 0x7fffffff);
                mt[kk] = mt[kk + M] ^ (y >>> 1) ^ ((y & 1) ? 0x9908b0df : 0);
            }
            for (; kk < N - 1; kk++) {
                y = (mt[kk] & 0x80000000) | (mt[kk + 1] & 0x7fffffff);
                mt[kk] = mt[kk + (M - N)] ^ (y >>> 1) ^ ((y & 1) ? 0x9908b0df : 0);
            }
            y = (mt[N - 1] & 0x80000000) | (mt[0] & 0x7fffffff);
            mt[N - 1] = mt[M - 1] ^ (y >>> 1) ^ ((y & 1) ? 0x9908b0df : 0);
            mti = 0;
        }
        y = mt[mti++];
        y ^= (y >>> 11);
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= (y >>> 18);
        return y >>> 0;
    }
    initByArray([seed >>> 0]);
    return function random() {
        const a = genrandInt32() >>> 5, b = genrandInt32() >>> 6;
        return (a * 67108864 + b) / 9007199254740992;
    };
}

// ---------- BKT (Chapter 18) ----------
function bkt(obs, pg) {
    const L0 = 0.30, pt = 0.15, ps = 0.10;
    let L = L0;
    for (const correct of obs) {
        const c = correct
            ? L * (1 - ps) / (L * (1 - ps) + (1 - L) * pg)
            : L * ps / (L * ps + (1 - L) * (1 - pg));
        L = c + (1 - c) * pt;
    }
    return L;
}
function predictCorrect(L, pg) {
    const ps = 0.10;
    return L * (1 - ps) + (1 - L) * pg;
}

// ---------- synthetic cohort (same draw order as the chapter's Python) ----------
function simulateCohort(seed, n, pgTrue, pgModel) {
    const r = PyRandom(seed);
    const forecasts = [], outcomes = [];
    for (let i = 0; i < n; i++) {
        let mastered = r() < 0.30;
        const obs = [];
        for (let k = 0; k < 4; k++) {
            obs.push(r() < (mastered ? 0.90 : pgTrue));
            if (!mastered && r() < 0.15) mastered = true;
        }
        const heldOut = r() < (mastered ? 0.90 : pgTrue);
        forecasts.push(predictCorrect(bkt(obs, pgModel), pgModel));
        outcomes.push(heldOut ? 1 : 0);
    }
    return { forecasts, outcomes };
}

// ---------- binning ----------
function binCohort(cohort, k) {
    const bins = [];
    for (let b = 0; b < k; b++) bins.push({ lo: b / k, hi: (b + 1) / k, n: 0, sumF: 0, sumY: 0 });
    cohort.forecasts.forEach((f, i) => {
        const b = Math.min(k - 1, Math.floor(f * k));
        bins[b].n++;
        bins[b].sumF += f;
        bins[b].sumY += cohort.outcomes[i];
    });
    bins.forEach(b => {
        b.meanF = b.n ? b.sumF / b.n : null;
        b.obs = b.n ? b.sumY / b.n : null;
        b.label = b.lo.toFixed(2) + '–' + (b.hi >= 1 ? '1.00' : b.hi.toFixed(2));
    });
    return bins;
}

// ---------- state ----------
let state = { scenario: 'match', bins: 5, size: 200, seed: CHAPTER_SEED };
let plotted = false;

function markerDiameter(n, maxN) {
    return 10 + 34 * Math.sqrt(n / Math.max(1, maxN));
}

function buildFigure(bins, forAnimation) {
    const maxN = Math.max(...bins.map(b => b.n));
    const x = [], y = [], size = [], colors = [], lineW = [], custom = [];
    bins.forEach(b => {
        x.push(b.meanF);
        y.push(b.obs);
        size.push(b.n ? markerDiameter(b.n, maxN) : 0);
        const small = b.n > 0 && b.n < SMALL_BIN;
        colors.push(small ? BLUE_LIGHT : BLUE);
        lineW.push(small ? 0 : 1.5);
        custom.push([
            b.label, b.n,
            b.meanF === null ? '' : b.meanF.toFixed(3),
            b.obs === null ? '' : b.obs.toFixed(3),
            small ? '<b>Too few learners to trust this point</b>' : ''
        ]);
    });
    const trace = {
        type: 'scatter',
        mode: 'markers',
        x, y,
        customdata: custom,
        marker: { size, color: colors, line: { color: 'rgb(0, 70, 110)', width: lineW } },
        hovertemplate: 'Bin %{customdata[0]}<br>Learners: %{customdata[1]}<br>' +
            'Mean forecast: %{customdata[2]}<br>Observed correct: %{customdata[3]}<br>%{customdata[4]}<extra></extra>',
        name: 'bins'
    };
    const shapes = [{
        type: 'line', xref: 'x', yref: 'y', x0: 0, y0: 0, x1: 1, y1: 1,
        line: { color: '#555', width: 1.5, dash: 'dash' }, layer: 'below'
    }];
    if (!forAnimation) {
        bins.forEach((b, i) => {
            if (b.n > 0 && b.n < SMALL_BIN) {
                const rad = size[i] / 2 + 5;
                shapes.push({
                    type: 'circle', xref: 'x', yref: 'y', xsizemode: 'pixel', ysizemode: 'pixel',
                    xanchor: b.meanF, yanchor: b.obs, x0: -rad, x1: rad, y0: -rad, y1: rad,
                    line: { color: '#222', width: 2, dash: 'dash' }
                });
            }
        });
    }
    const narrow = window.innerWidth < 600;
    const layout = {
        title: {
            text: 'Reliability curve: Synthetic data',
            font: { size: narrow ? 14 : 16 },
            yref: 'container',
            y: 1,
            yanchor: 'top',
            pad: { t: 8 }
        },
        margin: { l: 52, r: 14, t: 56, b: 44 },
        xaxis: { title: { text: 'Mean forecast in bin', standoff: 4 }, range: [0, 1], dtick: 0.2,
            fixedrange: true, zeroline: false, gridcolor: '#e6ebf0', constrain: 'domain' },
        yaxis: { title: { text: 'Observed fraction correct', standoff: 4 }, range: [0, 1], dtick: 0.2,
            fixedrange: true, zeroline: false, gridcolor: '#e6ebf0', scaleanchor: 'x', constrain: 'domain' },
        shapes,
        showlegend: false,
        hovermode: 'closest',
        dragmode: false,
        plot_bgcolor: 'white',
        paper_bgcolor: 'white',
        font: { family: 'Arial, Helvetica, sans-serif', size: 13 },
        annotations: [{
            // subtitle: which cohort is on screen
            x: 0.5, y: 1, xref: 'paper', yref: 'paper', xanchor: 'center', yanchor: 'bottom', yshift: 6,
            text: (state.seed === CHAPTER_SEED ? "seed 19 (the chapter's cohort)" : 'seed ' + state.seed) +
                ', ' + state.size + ' learners, ' + state.bins + ' bins',
            showarrow: false, font: { size: 12, color: '#333' }
        }, {
            x: 0.2, y: 0.12, xref: 'x', yref: 'y', text: 'perfect calibration', showarrow: false,
            font: { size: 11, color: '#555' }, textangle: -45
        }]
    };
    return { trace, layout };
}

function renderTable(bins, cohort) {
    const tbody = document.querySelector('#bin-table tbody');
    let html = '';
    bins.filter(b => b.n > 0).forEach(b => {
        const small = b.n < SMALL_BIN;
        html += '<tr class="' + (small ? 'small' : '') + '"><td>' + b.label + (small ? ' *' : '') + '</td><td>' +
            b.n + '</td><td>' + b.meanF.toFixed(3) + '</td><td>' + b.obs.toFixed(3) + '</td></tr>';
    });
    const n = cohort.forecasts.length;
    const meanF = cohort.forecasts.reduce((a, b) => a + b, 0) / n;
    const obs = cohort.outcomes.reduce((a, b) => a + b, 0) / n;
    html += '<tr class="total"><td>All learners</td><td>' + n + '</td><td>' + meanF.toFixed(3) + '</td><td>' +
        obs.toFixed(3) + '</td></tr>';
    tbody.innerHTML = html;
    const empty = bins.filter(b => b.n === 0).length;
    const smallCount = bins.filter(b => b.n > 0 && b.n < SMALL_BIN).length;
    document.getElementById('table-note').innerHTML =
        (smallCount ? '* fewer than 10 learners: too few to trust (dashed outline on the plot). ' : '') +
        (empty ? empty + ' empty bin' + (empty > 1 ? 's are' : ' is') + ' not plotted.' : '');
}

function render(animate) {
    const sc = SCENARIOS[state.scenario];
    const cohort = simulateCohort(state.seed, state.size, sc.pgTrue, sc.pgModel);
    const bins = binCohort(cohort, state.bins);
    renderTable(bins, cohort);
    document.getElementById('bins-value').textContent = state.bins;
    document.getElementById('size-value').textContent = state.size;
    const fig = buildFigure(bins, false);
    const config = { responsive: true, displayModeBar: false, scrollZoom: false };
    if (!plotted) {
        Plotly.newPlot('plot', [fig.trace], fig.layout, config);
        plotted = true;
    } else if (animate) {
        // glide the points to their new positions, then restore the dashed outlines
        const anim = buildFigure(bins, true);
        Plotly.animate('plot', {
            data: [{ x: anim.trace.x, y: anim.trace.y, marker: anim.trace.marker, customdata: anim.trace.customdata }],
            traces: [0],
            layout: { shapes: anim.layout.shapes }
        }, {
            transition: { duration: 600, easing: 'cubic-in-out' },
            frame: { duration: 600, redraw: false }
        }).then(() => Plotly.react('plot', [fig.trace], fig.layout, config));
    } else {
        Plotly.react('plot', [fig.trace], fig.layout, config);
    }
    console.log('[fidelity-calibration-curve-lab] scenario ' + state.scenario + ', seed ' + state.seed +
        ', ' + state.size + ' learners, ' + state.bins + ' bins: ' +
        bins.filter(b => b.n).map(b => b.label + ' n=' + b.n + ' f=' + b.meanF.toFixed(3) + ' o=' + b.obs.toFixed(3)).join('; '));
}

// ---------- diagnosis feedback ----------
const FEEDBACK = {
    well: {
        right: 'Right. The model uses the simulation\'s own parameters, so it is calibrated; gaps come from sampling noise. Notice that the largest gaps sit in the smallest bins.',
        hint: 'Look only at the large, solid points. Do they sit close to the diagonal? Dashed points hold too few learners to count as evidence.'
    },
    over: {
        right: 'Right. Low forecasts come true more often than forecast (above the diagonal) and high forecasts less often (below it): the forecasts are too extreme. The model assumed guessing was rarer than it is.',
        hint: 'Compare the lowest and highest large bins with the diagonal. Is the curve flatter or steeper than the diagonal?'
    },
    under: {
        right: 'Right. The forecasts are squeezed toward the middle: the lowest bin comes true less often than forecast and the upper-middle bins more often. The model assumed guessing was more common than it is. With only 200 learners the pattern is noisy; try 1000.',
        hint: 'Raise the cohort size to 1000 so the pattern is clear, then compare the lowest bin and the middle bins with the diagonal. Is the curve flatter or steeper than the diagonal?'
    }
};

function diagnose(choice) {
    const truth = SCENARIOS[state.scenario].truth;
    const right = choice === truth;
    document.querySelectorAll('.diag-btn').forEach(b => b.classList.remove('chosen-right', 'chosen-wrong'));
    const btn = document.querySelector('.diag-btn[data-diag="' + choice + '"]');
    btn.classList.add(right ? 'chosen-right' : 'chosen-wrong');
    const text = right ? FEEDBACK[truth].right : 'Not quite. ' + FEEDBACK[truth].hint;
    document.getElementById('diag-feedback').textContent = text;
    console.log('[fidelity-calibration-curve-lab] diagnosis ' + choice + ' for scenario ' + state.scenario +
        ': ' + (right ? 'correct' : 'incorrect'));
}

function clearDiagnosis() {
    document.querySelectorAll('.diag-btn').forEach(b => b.classList.remove('chosen-right', 'chosen-wrong'));
    document.getElementById('diag-feedback').textContent = 'Read the curve and the counts, then choose.';
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('scenario').addEventListener('change', e => {
        state.scenario = e.target.value;
        clearDiagnosis();
        render(true);
    });
    document.getElementById('bins').addEventListener('input', e => {
        state.bins = parseInt(e.target.value, 10);
        render(false);
    });
    document.getElementById('size').addEventListener('input', e => {
        state.size = parseInt(e.target.value, 10);
        render(false);
    });
    document.getElementById('redraw').addEventListener('click', () => {
        state.seed += 1;
        render(false);
    });
    document.querySelectorAll('.diag-btn').forEach(b => b.addEventListener('click', () => diagnose(b.dataset.diag)));
    render(false);
});
