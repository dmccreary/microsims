// Accuracy Versus Base Rate Lab - Chart.js MicroSim
// CANVAS_HEIGHT: 520
// Compares a model's accuracy with the always-predict-the-majority baseline on a synthetic
// cohort of 200 learners. All data are synthetic and generated in the browser.
//
// Cohort model (a calibrated "binormal" stand-in for the chapter's BKT forecaster):
//   outcome      y ~ Bernoulli(base rate b)
//   evidence     x = z + delta/2 if y = 1, z - delta/2 if y = 0, with z ~ Normal(0, 1)
//   forecast     f = sigmoid(logit(b) + delta * x)  (the exact posterior, so it is calibrated)
//   call         "correct" when f >= 0.5
//   delta = D * signal. D = 0.924 makes signal 1.0 match the chapter's synthetic BKT model in
//   expectation: AUC about 0.743 and, at base rate 0.635, accuracy about 0.705.
// At signal 0 every forecast equals the base rate, so the model calls the majority class for
// everyone and its accuracy equals the baseline: that accuracy carries no evidence.
// The random numbers come from a Mersenne Twister identical to Python's random.Random(seed),
// so every cohort can be reproduced in Python. The first cohort uses seed 177, the first seed
// whose draw matches the chapter's counts (127 of 200 correct, model right on 141 of 200).

const N_LEARNERS = 200;
const SEPARATION_D = 0.924;
const FIRST_SEED = 177;

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

// ---------- state ----------
let seed = FIRST_SEED;
let cohortNumber = 1;
let draws = [];          // per learner: { u, z } fixed for a cohort, so sliders move smoothly
let chart = null;

function drawCohort() {
    const rand = PyRandom(seed);
    draws = [];
    for (let i = 0; i < N_LEARNERS; i++) {
        const u = rand();
        const u1 = 1 - rand();
        const u2 = rand();
        draws.push({ u: u, z: Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2) });
    }
}

function evaluate(baseRate, signal) {
    const delta = SEPARATION_D * signal;
    const logitB = Math.log(baseRate / (1 - baseRate));
    let nCorrect = 0, modelRight = 0;
    for (const d of draws) {
        const y = d.u < baseRate;
        const x = d.z + (y ? delta / 2 : -delta / 2);
        const f = 1 / (1 + Math.exp(-(logitB + delta * x)));
        if (y) nCorrect++;
        if ((f >= 0.5) === y) modelRight++;
    }
    const baselineRight = Math.max(nCorrect, N_LEARNERS - nCorrect);
    return {
        nCorrect,
        modelRight,
        baselineRight,
        modelAcc: modelRight / N_LEARNERS,
        baselineAcc: baselineRight / N_LEARNERS,
        majority: nCorrect >= N_LEARNERS - nCorrect ? 'correct' : 'incorrect'
    };
}

function readControls() {
    return {
        baseRate: parseFloat(document.getElementById('base-rate').value),
        signal: parseFloat(document.getElementById('signal').value)
    };
}

function update() {
    const c = readControls();
    const r = evaluate(c.baseRate, c.signal);
    document.getElementById('base-rate-value').textContent = c.baseRate.toFixed(3);
    document.getElementById('signal-value').textContent = c.signal.toFixed(2);

    lastCohortText = { full: 'Cohort #' + cohortNumber + ' (seed ' + seed + '): base rate ' +
        c.baseRate.toFixed(3) + ', signal ' + c.signal.toFixed(2) + ', ' + r.nCorrect + ' of 200 answered correctly',
        short: 'Cohort #' + cohortNumber + ': ' + r.nCorrect + ' of 200 answered correctly' };
    if (chart) {
        chart.data.datasets[0].data = [r.modelAcc];
        chart.data.datasets[0].counts = [r.modelRight];
        chart.data.datasets[1].data = [r.baselineAcc];
        chart.data.datasets[1].counts = [r.baselineRight];
        applyTitles(chart.width);
        chart.update();
    }

    const lift = (r.modelAcc - r.baselineAcc) * 100;
    const sign = lift > 0 ? '+' : (lift < 0 ? '−' : '');
    document.getElementById('caption').innerHTML =
        '<strong>Lift: ' + sign + Math.abs(lift).toFixed(1) + ' percentage points</strong> ' +
        '(model ' + r.modelAcc.toFixed(3) + ' vs. baseline ' + r.baselineAcc.toFixed(3) +
        ', which always predicts "' + r.majority + '")';

    const msg = document.getElementById('message');
    if (r.modelRight <= r.baselineRight) {
        msg.className = 'message warn';
        const detail = c.signal === 0
            ? 'The model has no information, so its accuracy only reflects the base rate.'
            : 'At this base rate the model\'s calls match the majority vote, so accuracy cannot show its signal. Use the Brier score or AUC.';
        msg.innerHTML = 'This accuracy carries no evidence. <span class="detail">' + detail + '</span>';
    } else {
        msg.className = 'message ok';
        msg.textContent = 'The model beats the do-nothing baseline on this cohort. Is the lift larger than a fresh cohort would change it? Press "Simulate 200 learners".';
    }
    if (chart) console.log('[fidelity-accuracy-base-rate-lab] cohort ' + cohortNumber + ' seed ' + seed + ' base rate ' +
        c.baseRate.toFixed(3) + ' signal ' + c.signal.toFixed(2) + ' model ' + r.modelRight + '/200 baseline ' +
        r.baselineRight + '/200 lift ' + lift.toFixed(1));
}

// Shorter titles on narrow screens so nothing collides with the axis title
let lastCohortText = { full: '', short: '' };
function applyTitles(width, c) {
    c = c || chart;
    if (!c) return;
    const narrow = width < 520;
    c.options.plugins.title.text = narrow
        ? ['Model vs. majority baseline', '(synthetic data)']
        : 'Model vs. always-predict-the-majority baseline (synthetic data)';
    c.options.plugins.subtitle.text = narrow ? lastCohortText.short : lastCohortText.full;
}

function buildChart() {
    Chart.defaults.font.family = 'Arial, Helvetica, sans-serif';
    Chart.defaults.font.size = 14;
    const ctx = document.getElementById('chart');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Synthetic cohort of 200 learners'],
            datasets: [
                {
                    label: 'Model accuracy',
                    data: [0],
                    counts: [0],
                    backgroundColor: 'rgba(0, 114, 178, 0.85)',      // Okabe-Ito blue
                    borderColor: 'rgb(0, 84, 140)',
                    borderWidth: 1
                },
                {
                    label: 'Baseline accuracy',
                    data: [0],
                    counts: [0],
                    backgroundColor: 'rgba(230, 159, 0, 0.85)',      // Okabe-Ito orange
                    borderColor: 'rgb(170, 110, 0)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 250 },
            onResize: function (c, size) { applyTitles(size.width, c); },
            categoryPercentage: 0.7,
            barPercentage: 0.85,
            scales: {
                y: {
                    min: 0,
                    max: 1,
                    ticks: { stepSize: 0.1 },
                    title: { display: true, text: 'Accuracy' }
                },
                x: { ticks: { font: { size: 14 } } }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Model vs. always-predict-the-majority baseline (synthetic data)',
                    font: { size: 17, weight: 'bold' },
                    padding: { top: 2, bottom: 2 }
                },
                subtitle: {
                    display: true,
                    text: '',
                    font: { size: 13 },
                    padding: { bottom: 6 }
                },
                legend: { position: 'top', labels: { boxWidth: 18 } },
                tooltip: {
                    callbacks: {
                        label: function (item) {
                            const n = item.dataset.counts[item.dataIndex];
                            return item.dataset.label + ': ' + item.parsed.y.toFixed(3) +
                                ' (' + n + ' of 200 learners classified correctly)';
                        }
                    }
                }
            }
        },
        plugins: [{
            // value labels on top of each bar, drawn before tooltips so a tooltip covers them
            id: 'barValues',
            afterDatasetsDraw(c) {
                const g = c.ctx;
                g.save();
                g.font = 'bold 15px Arial, Helvetica, sans-serif';
                g.fillStyle = '#111';
                g.textAlign = 'center';
                c.data.datasets.forEach((ds, i) => {
                    c.getDatasetMeta(i).data.forEach((bar, j) => {
                        g.fillText(ds.data[j].toFixed(3), bar.x, bar.y - 6);
                    });
                });
                g.restore();
            }
        }]
    });
}

document.addEventListener('DOMContentLoaded', function () {
    drawCohort();
    update();          // fill the caption and message first so the chart is sized to its final box
    buildChart();
    document.getElementById('base-rate').addEventListener('input', update);
    document.getElementById('signal').addEventListener('input', update);
    document.getElementById('simulate').addEventListener('click', function () {
        seed += 1;
        cohortNumber += 1;
        drawCohort();
        update();
    });
    update();
});
