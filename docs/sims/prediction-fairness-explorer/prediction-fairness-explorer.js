// Prediction Fairness Explorer - Chart.js
// CANVAS_HEIGHT: 600
// Compares a mastery prediction's error across three learner groups. Each
// group has a pair of bars: the share of its learners the model
// under-estimated (predicted "not yet", passed the held-out check) and the
// share it over-estimated (predicted "mastered", failed the check). Dashed
// lines show the pooled rate over all learners. A threshold hides any group
// with fewer learners than the threshold, as the Full LRS suppression rule
// would. ALL NUMBERS ARE SYNTHETIC and invented to illustrate the method.

// ---------- synthetic scenarios (counts, so every rate is an honest fraction) ----------
const GROUPS = ['Pointer users', 'Keyboard users', 'Shared device'];
const SCENARIOS = {
  even: {
    name: 'Even error',
    n: [150, 40, 30], under: [13, 4, 3], over: [11, 3, 2]
  },
  gap: {
    name: 'Hidden gap',
    n: [170, 24, 36], under: [12, 9, 4], over: [14, 1, 3]
  },
  small: {
    name: 'Small group',
    n: [180, 40, 12], under: [14, 4, 5], over: [13, 3, 1]
  }
};
const DEFAULTS = { scenario: 'gap', threshold: 10, pooled: true };
const GAP_POINTS = 10;   // a group this many percentage points above the pooled rate is flagged

// Okabe-Ito blue and orange (color-blind safe pair); darker inks for text
const UNDER_COLOR = 'rgba(0, 114, 178, 0.85)';
const OVER_COLOR = 'rgba(230, 159, 0, 0.85)';
const UNDER_INK = 'rgb(0, 90, 160)';
const OVER_INK = 'rgb(150, 90, 0)';

let chart;
let state = Object.assign({}, DEFAULTS);

const pct = (a, b) => (b > 0 ? 100 * a / b : 0);
const fmt = v => v.toFixed(1) + '%';

function computeView() {
  const s = SCENARIOS[state.scenario];
  const N = s.n.reduce((a, b) => a + b, 0);
  const pooledUnder = pct(s.under.reduce((a, b) => a + b, 0), N);
  const pooledOver = pct(s.over.reduce((a, b) => a + b, 0), N);
  const groups = GROUPS.map((g, i) => ({
    name: g, n: s.n[i],
    under: pct(s.under[i], s.n[i]), over: pct(s.over[i], s.n[i]),
    shown: s.n[i] >= state.threshold
  }));
  return { s, N, pooledUnder, pooledOver, groups };
}

// ---------- plugin: dashed pooled-average lines with labels ----------
const pooledLinePlugin = {
  id: 'pooledLines',
  afterDatasetsDraw(c) {
    if (!state.pooled) return;
    const v = computeView();
    const { ctx, chartArea: a, scales: { y } } = c;
    const narrow = c.width < 500;
    const lines = [
      { val: v.pooledUnder, color: UNDER_COLOR, ink: UNDER_INK, label: 'Pooled under-estimate ' + fmt(v.pooledUnder) },
      { val: v.pooledOver, color: OVER_COLOR, ink: OVER_INK, label: 'Pooled over-estimate ' + fmt(v.pooledOver) }
    ];
    const ys = lines.map(L => y.getPixelForValue(L.val));
    ctx.save();
    lines.forEach((L, i) => {
      ctx.strokeStyle = L.color;
      ctx.lineWidth = 2.5;
      ctx.setLineDash(i === 0 ? [8, 5] : [3, 4]);
      ctx.beginPath();
      ctx.moveTo(a.left, ys[i]);
      ctx.lineTo(a.right, ys[i]);
      ctx.stroke();
    });
    ctx.setLineDash([]);
    // key box at the top-left of the plot (the Pointer users bars never reach it)
    ctx.font = (narrow ? '11px' : '12px') + ' Arial, Helvetica, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const tw = Math.max(...lines.map(L => ctx.measureText(L.label).width));
    const bx = a.left + 6, by = a.top + 4, bw = tw + 44, bh = 36;
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.strokeStyle = 'silver';
    ctx.lineWidth = 1;
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeRect(bx, by, bw, bh);
    lines.forEach((L, i) => {
      const yy = by + 10 + i * 16;
      ctx.strokeStyle = L.color;
      ctx.lineWidth = 2.5;
      ctx.setLineDash(i === 0 ? [8, 5] : [3, 4]);
      ctx.beginPath();
      ctx.moveTo(bx + 6, yy);
      ctx.lineTo(bx + 32, yy);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = L.ink;
      ctx.fillText(L.label, bx + 38, yy);
    });
    ctx.restore();
  }
};

function buildChart() {
  const ctx = document.getElementById('fairness-chart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [
        { label: 'Under-estimated: predicted "not yet", passed', data: [], backgroundColor: UNDER_COLOR,
          borderColor: 'rgb(0, 90, 160)', borderWidth: 1 },
        { label: 'Over-estimated: predicted "mastered", failed', data: [], backgroundColor: OVER_COLOR,
          borderColor: 'rgb(150, 90, 0)', borderWidth: 1 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 300 },
      plugins: {
        title: { display: true, text: 'Mastery-prediction error by learner group (synthetic)',
          font: { size: 16, weight: 'bold' }, color: '#1e1e1e', padding: { top: 2, bottom: 4 } },
        legend: { position: 'top', labels: { color: '#1e1e1e', boxWidth: 14, font: { size: 12 } } },
        tooltip: {
          callbacks: {
            title: items => GROUPS[items[0].dataIndex],
            label: item => {
              const v = computeView();
              const g = v.groups[item.dataIndex];
              const count = item.datasetIndex === 0 ? v.s.under[item.dataIndex] : v.s.over[item.dataIndex];
              return (item.datasetIndex === 0 ? 'Under-estimated: ' : 'Over-estimated: ') +
                count + ' of ' + g.n + ' learners (' + fmt(item.raw) + ')';
            }
          }
        }
      },
      scales: {
        y: { beginAtZero: true, max: 50,
          title: { display: true, text: "Share of the group's learners (%)", color: '#1e1e1e' },
          ticks: { color: '#1e1e1e', callback: v => v + '%' } },
        x: { ticks: { color: '#1e1e1e', autoSkip: false, maxRotation: 0, minRotation: 0 } }
      }
    },
    plugins: [pooledLinePlugin]
  });
}

function update() {
  const v = computeView();
  const narrow = document.querySelector('.chart-wrap').clientWidth < 500;
  chart.data.labels = v.groups.map(g => g.shown
    ? (narrow ? g.name + ' (n=' + g.n + ')' : [g.name, 'n = ' + g.n])
    : (narrow ? g.name + ' (hidden)' : [g.name, 'hidden: n < ' + state.threshold]));
  chart.data.datasets[0].data = v.groups.map(g => (g.shown ? g.under : null));
  chart.data.datasets[1].data = v.groups.map(g => (g.shown ? g.over : null));
  // bar labels rotate under 500 px
  chart.options.scales.x.ticks.maxRotation = narrow ? 40 : 0;
  chart.options.scales.x.ticks.minRotation = narrow ? 40 : 0;
  chart.options.plugins.title.font.size = narrow ? 14 : 16;
  chart.update();

  document.getElementById('threshold-value').textContent = state.threshold;
  document.getElementById('message').innerHTML = messageFor(v);
  updateAccessibleText(v);
}

function messageFor(v) {
  const hidden = v.groups.filter(g => !g.shown);
  const shown = v.groups.filter(g => g.shown);
  if (hidden.length) {
    const names = hidden.map(g => g.name).join(' and ');
    return '<b>Suppressed:</b> the ' + names + ' group has fewer learners than the threshold (' + state.threshold +
      '), so its bars are hidden. If its error differs from the other groups, this chart can no longer show the gap. ' +
      'The pooled lines still count its learners, so a reader who knows every count could subtract to recover it, ' +
      'which is why complementary suppression is also needed.';
  }
  // largest gap between a visible group and the pooled rate, for either kind of error
  let worst = null;
  shown.forEach(g => {
    [['under', 'under-estimated', v.pooledUnder], ['over', 'over-estimated', v.pooledOver]].forEach(([k, word, pooled]) => {
      const gap = g[k] - pooled;
      if (!worst || gap > worst.gap) worst = { g, word, gap, rate: g[k], pooled };
    });
  });
  if (worst && worst.gap >= GAP_POINTS) {
    return '<b>Gap:</b> learners in the ' + worst.g.name + ' group are ' + worst.word + ' ' + fmt(worst.rate) + ' of the time, against a pooled ' +
      fmt(worst.pooled) + '. The pooled average looks acceptable but hides this gap, a bias signal to investigate' +
      (state.pooled ? '.' : ' (turn on the pooled average to compare).');
  }
  const spread = worst ? Math.max(0, worst.gap) : 0;
  return '<b>No visible gap:</b> every group shown is within ' + Math.ceil(spread) +
    ' percentage points of the pooled rate for both kinds of error. That is true of these synthetic numbers only.';
}

function updateAccessibleText(v) {
  const parts = v.groups.map(g => g.shown
    ? g.name + ', ' + g.n + ' learners: under-estimated ' + fmt(g.under) + ', over-estimated ' + fmt(g.over)
    : g.name + ': hidden, fewer learners than the threshold');
  document.getElementById('fairness-chart').setAttribute('aria-label',
    'Bar chart of synthetic prediction error by learner group, scenario ' + v.s.name + '. ' + parts.join('; ') +
    '. Pooled over all ' + v.N + ' learners: under-estimated ' + fmt(v.pooledUnder) + ', over-estimated ' + fmt(v.pooledOver) + '.');
  const rows = v.groups.map(g => '<tr><th scope="row">' + g.name + '</th><td>' + g.n + '</td><td>' +
    (g.shown ? fmt(g.under) : 'suppressed') + '</td><td>' + (g.shown ? fmt(g.over) : 'suppressed') + '</td><td>' +
    (g.shown ? 'yes' : 'no') + '</td></tr>');
  rows.push('<tr><th scope="row">Pooled (all learners)</th><td>' + v.N + '</td><td>' + fmt(v.pooledUnder) +
    '</td><td>' + fmt(v.pooledOver) + '</td><td>' + (state.pooled ? 'yes' : 'no') + '</td></tr>');
  document.querySelector('#data-table tbody').innerHTML = rows.join('');
}

function syncControls() {
  document.getElementById('scenario').value = state.scenario;
  document.getElementById('threshold').value = state.threshold;
  document.getElementById('pooled').checked = state.pooled;
}

document.addEventListener('DOMContentLoaded', () => {
  buildChart();
  document.getElementById('scenario').addEventListener('change', e => { state.scenario = e.target.value; update(); });
  document.getElementById('threshold').addEventListener('input', e => { state.threshold = Number(e.target.value); update(); });
  document.getElementById('pooled').addEventListener('change', e => { state.pooled = e.target.checked; update(); });
  document.getElementById('reset').addEventListener('click', () => {
    state = Object.assign({}, DEFAULTS);
    syncControls();
    update();
  });
  window.addEventListener('resize', update);
  syncControls();
  update();
});
