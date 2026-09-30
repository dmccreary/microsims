// Rubric Self-Check - Chart.js
// CANVAS_HEIGHT: 620
// A horizontal stacked bar chart of the seven capstone rubric criteria from
// Chapter 25. Each bar shows points earned (points x self-rating) against
// points still available. Moving a slider updates the bar and the total.
// Hovering a bar shows what "full credit means" for that criterion.
// "Suggest next focus" highlights the criterion with the most points still
// available; a text box records the learner's reason. The ratings are
// self-assessments, not a grade.

const CRITERIA = [
  { name: 'Portfolio design', short: 'Design', points: 15,
    full: 'Objectives with Bloom levels, at least three types, sound type choices' },
  { name: 'Quality gate', short: 'Quality gate', points: 15,
    full: 'Every new MicroSim at 70 or above and width-responsive' },
  { name: 'Instrumentation', short: 'Instrumentation', points: 15,
    full: 'Passing checks, one concept per statement, evidence classes justified' },
  { name: 'Usability test and peer review', short: 'Usability/review', points: 15,
    full: 'Findings recorded, fixes made and re-scored' },
  { name: 'Data policy', short: 'Data policy', points: 10,
    full: 'Minimization and aggregate-only rules stated and enforced in the analysis' },
  { name: 'Portfolio fidelity report', short: 'Fidelity report', points: 20,
    full: 'Complete Chapter 19 structure, uncertainty shown, limits sentence first' },
  { name: 'Defense', short: 'Defense', points: 10,
    full: 'Answers questions about measured versus designed claims' }
];
const DEFAULT_RATING = 50;

// Okabe-Ito blue for earned points; light grey for points still available;
// orange (with a thick outline) marks the suggested next focus.
const EARNED = 'rgba(0, 114, 178, 0.9)';
const REMAIN = 'rgba(215, 215, 215, 1)';
const FOCUS = 'rgba(230, 159, 0, 0.95)';

let ratings = CRITERIA.map(() => DEFAULT_RATING);
let focusIndex = -1;
let chart;

const earned = i => CRITERIA[i].points * ratings[i] / 100;
const remaining = i => CRITERIA[i].points - earned(i);
const f1 = v => (Math.round(v * 10) / 10).toFixed(1);

function isNarrow() { return window.innerWidth <= 640; }

function wrapWords(str, n) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  words.forEach(w => {
    if ((line + ' ' + w).trim().length > n && line) { lines.push(line); line = w; }
    else line = (line + ' ' + w).trim();
  });
  if (line) lines.push(line);
  return lines;
}

function labels() {
  return CRITERIA.map(c => (isNarrow() ? c.short : wrapWords(c.name, 16)));
}

function buildSliders() {
  const box = document.getElementById('sliders');
  CRITERIA.forEach((c, i) => {
    const row = document.createElement('div');
    row.className = 'row';
    row.id = 'row-' + i;
    row.innerHTML =
      '<label for="rate-' + i + '"><span class="long">' + c.name + ' (' + c.points + ' pts)</span>' +
      '<span class="short">' + c.short + ' (' + c.points + ')</span></label>' +
      '<input type="range" id="rate-' + i + '" min="0" max="100" step="5" value="' + ratings[i] + '">' +
      '<span class="val" id="val-' + i + '">' + ratings[i] + '%</span>';
    // keep the value next to the label on wide screens, after the slider on narrow ones
    box.appendChild(row);
    const input = row.querySelector('input');
    input.addEventListener('input', () => {
      ratings[i] = Number(input.value);
      update();
    });
  });
  placeValues();
}

// On wide screens the value sits on the label line; on narrow screens after the slider.
function placeValues() {
  CRITERIA.forEach((c, i) => {
    const row = document.getElementById('row-' + i);
    const val = document.getElementById('val-' + i);
    const input = row.querySelector('input');
    if (isNarrow()) row.appendChild(val);
    else row.insertBefore(val, input);
  });
}

function buildChart() {
  const ctx = document.getElementById('rubric-chart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels(),
      datasets: [
        { label: 'Points earned (self-rated)', data: [], backgroundColor: EARNED,
          borderColor: 'rgb(0, 80, 140)', borderWidth: 1 },
        { label: 'Points still available', data: [], backgroundColor: [], borderColor: [], borderWidth: [] }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 200 },
      plugins: {
        legend: { position: 'top', labels: { boxWidth: 14, color: '#1e1e1e', font: { size: 12 } } },
        tooltip: {
          callbacks: {
            title: items => CRITERIA[items[0].dataIndex].name + ' (' + CRITERIA[items[0].dataIndex].points + ' points)',
            label: item => {
              const i = item.dataIndex;
              return item.datasetIndex === 0
                ? 'Earned (self-rated): ' + f1(earned(i)) + ' of ' + CRITERIA[i].points + ' (' + ratings[i] + '%)'
                : 'Still available: ' + f1(remaining(i)) + ' points';
            },
            afterBody: items => ['', 'Full credit means:'].concat(wrapWords(CRITERIA[items[0].dataIndex].full, 42))
          }
        }
      },
      scales: {
        x: { stacked: true, min: 0, max: 20, ticks: { stepSize: 5, color: '#1e1e1e' },
          title: { display: true, text: 'Points', color: '#1e1e1e' } },
        y: { stacked: true, ticks: { color: '#1e1e1e', autoSkip: false, font: { size: 12 } } }
      }
    }
  });
}

function update() {
  const total = CRITERIA.reduce((s, c, i) => s + earned(i), 0);
  document.getElementById('total').textContent = f1(total);
  CRITERIA.forEach((c, i) => {
    document.getElementById('val-' + i).textContent = ratings[i] + '%';
    document.getElementById('rate-' + i).setAttribute('aria-valuetext',
      ratings[i] + ' percent, ' + f1(earned(i)) + ' of ' + c.points + ' points');
  });
  // a suggestion is stale once a rating changes; keep the highlight but say so
  chart.data.labels = labels();
  chart.data.datasets[0].data = CRITERIA.map((c, i) => earned(i));
  chart.data.datasets[1].data = CRITERIA.map((c, i) => remaining(i));
  chart.data.datasets[1].backgroundColor = CRITERIA.map((c, i) => (i === focusIndex ? FOCUS : REMAIN));
  chart.data.datasets[1].borderColor = CRITERIA.map((c, i) => (i === focusIndex ? 'rgb(120, 70, 0)' : 'rgb(150, 150, 150)'));
  chart.data.datasets[1].borderWidth = CRITERIA.map((c, i) => (i === focusIndex ? 3 : 1));
  chart.update();
  CRITERIA.forEach((c, i) => document.getElementById('row-' + i).classList.toggle('focus', i === focusIndex));
  const parts = CRITERIA.map((c, i) => c.name + ' ' + f1(earned(i)) + ' of ' + c.points);
  document.getElementById('rubric-chart').setAttribute('aria-label',
    'Stacked bar chart, self-rated total ' + f1(total) + ' of 100. ' + parts.join('; ') + '.' +
    (focusIndex >= 0 ? ' Suggested next focus: ' + CRITERIA[focusIndex].name + '.' : ''));
}

function suggest() {
  let best = 0;
  CRITERIA.forEach((c, i) => { if (remaining(i) > remaining(best) + 1e-9) best = i; });
  const ties = CRITERIA.map((c, i) => i).filter(i => i !== best && Math.abs(remaining(i) - remaining(best)) < 1e-9);
  focusIndex = best;
  const c = CRITERIA[best];
  let msg;
  if (remaining(best) < 1e-9) {
    msg = 'Every criterion is rated at 100%. Check your ratings against the "full credit means" text before trusting them.';
    focusIndex = -1;
  } else {
    msg = '<b>Next focus: ' + c.name + '.</b> ' + f1(remaining(best)) + ' of its ' + c.points +
      ' points are still available, the most of any criterion' +
      (ties.length ? ' (tied with ' + ties.map(i => CRITERIA[i].name).join(', ') + ')' : '') +
      '. Points are one reason; also ask which fix other criteria depend on.';
  }
  document.getElementById('msg').innerHTML = msg;
  document.getElementById('reason-label').textContent = focusIndex >= 0
    ? 'Your reason for improving ' + c.name + ' first (or another criterion instead):'
    : 'Your reason:';
  update();
}

document.addEventListener('DOMContentLoaded', () => {
  buildSliders();
  buildChart();
  document.getElementById('suggest').addEventListener('click', suggest);
  window.addEventListener('resize', () => { placeValues(); update(); });
  update();
});
