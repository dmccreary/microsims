// Routing Score Workbench - Chart.js
// CANVAS_HEIGHT: 680
// Evaluate-level practice with the routing rubric from Chapter 4. For each objective the learner
// scores three or four candidate types with sliders (0 to 100, step 5). A horizontal bar chart
// shows the scores over the five rubric bands (shaded by a custom plugin). When the top two
// scores are within 10 points, a banner warns of routing ambiguity and offers two clarifying
// questions. "Reveal reference bands" overlays the author's reference band for each candidate and
// counts how many of the learner's scores fall inside it. Reference bands are teaching examples
// written for this bank, not output of the generator skill.

const CANVAS_HEIGHT = 680;

// ---------- the five rubric bands (routing-criteria.md scoring scale) ----------
const BANDS = [
  { lo: 0, hi: 29, name: 'Poor', short: 'Poor', long: 'Poor match: do not use', fill: 'rgba(220, 53, 69, 0.14)' },
  { lo: 30, hi: 49, name: 'Weak', short: 'Weak', long: 'Weak match: avoid unless nothing else fits', fill: 'rgba(253, 126, 20, 0.15)' },
  { lo: 50, hi: 69, name: 'Moderate', short: 'Mod.', long: 'Moderate match: keep as a fallback', fill: 'rgba(255, 193, 7, 0.20)' },
  { lo: 70, hi: 89, name: 'Strong', short: 'Str.', long: 'Strong match: choose it and note the limitations', fill: 'rgba(40, 167, 69, 0.15)' },
  { lo: 90, hi: 100, name: 'Perfect', short: '90+', long: 'Perfect match: choose it', fill: 'rgba(40, 167, 69, 0.30)' }
];

function bandOf(score) {
  if (score >= 90) return 4;
  if (score >= 70) return 3;
  if (score >= 50) return 2;
  if (score >= 30) return 1;
  return 0;
}

// ---------- rubric guideline text per generator and band (from routing-criteria.md) ----------
const NONE = 'The criteria file gives no guideline for this band.';
const GUIDES = {
  p5: ['Pure data visualization better served by specialized libraries (charts, plots, diagrams)',
    'Could be done with p5 but standard library would be simpler',
    'Standard visualization with some custom styling needs',
    'Needs high interactivity with custom controls, visual effects, or creative visual style',
    'Requires custom animations, physics simulations, unique interactions not available in standard libraries'],
  chartjs: ['Non-chart visualization (diagrams, maps, networks, mathematical functions)',
    'Chart representation possible but not optimal (e.g., timeline data, network data)',
    'Could be represented as a chart but might benefit from more specialized tools',
    'Data visualization needs that closely align with standard chart types',
    'Explicitly requests one of the supported chart types with numerical/categorical data'],
  plotly: ['Non-plot visualizations (diagrams, charts, timelines, networks)',
    'Plot needs but not specifically functions (discrete data, categorical)',
    'Numerical data that could be approximated as a function',
    'Scientific/physics plot that can be expressed as a function',
    'Plotting a mathematical function with domain/range, f(x) notation, or function exploration with sliders'],
  mermaid: ['Data-driven visualizations (charts, plots, timelines) or highly interactive needs',
    'Diagram needs but with heavy interactivity requirements',
    'Could be represented as a diagram but might need customization',
    'Process or structural visualization that fits Mermaid\'s diagram types',
    'Flowcharts, state machines, sequence diagrams, or other standard diagram types supported by Mermaid'],
  visnetwork: ['Non-network visualizations (charts, plots, timelines, workflows without connections)',
    'Relationships exist but not the primary focus',
    'Connected data but could also be shown as a tree or diagram',
    'Hierarchical or relational data that naturally forms a network structure',
    'Nodes and edges, network relationships, dependency graphs, or concept maps with connections'],
  timeline: ['Non-temporal visualizations (charts, diagrams, networks, plots)',
    'Some temporal aspect but not the primary organizing principle',
    'Sequential data without specific dates (could use other methods)',
    'Time-based data that would benefit from timeline visualization',
    'Events with specific dates, timeline/chronological order, or temporal sequences'],
  leaflet: ['Non-geographic visualizations (charts, timelines, diagrams, plots)',
    'Location mentioned but not central to visualization',
    'Some geographic component but could use other representations',
    'Location-based data that would benefit from spatial representation',
    'Geographic coordinates, location names, map regions, or an explicit request for a map'],
  venn: ['Not a set comparison (charts, timelines, networks, plots)',
    'Multiple categories but no clear overlap relationships',
    'Comparison of categories but overlaps not emphasized',
    'Category comparison that would benefit from showing overlaps',
    'Explicitly requests Venn diagram or describes 2-4 sets with overlaps and intersections'],
  bubble: ['Non-comparative visualizations or single-dimension data',
    'Comparison data but not naturally 2D or quadrant-based',
    '2D scatter plot without size dimension (could use chartjs instead)',
    'Multi-dimensional comparison that would benefit from bubble visualization',
    'Priority matrix, impact vs effort, 2x2 quadrant analysis, or bubble chart with 3 dimensions'],
  htmltable: ['Non-tabular visualizations (charts, networks, timelines, diagrams)',
    'Table structure but no interactivity needed',
    'Simple comparison table without need for expanded content',
    'Comparison table where cells contain summary values but detailed explanations would enhance learning',
    'A matrix/table where each cell needs expandable detailed content'],
  cld: ['Static flowcharts (mermaid) or data charts', NONE,
    'Generic "network of causes" without loop polarity (consider vis-network-guide)', NONE,
    'The request names feedback loops, CLDs, or reinforcing/balancing dynamics'],
  verified: ['Decorative imagery, illustrative/hypothetical numbers, or an interactive sim whose values are pedagogical',
    'The user supplied pre-verified data and only needs a layout rendered', NONE,
    'An interactive sim must present real-world data with citations',
    'A static poster/infographic carries numeric claims that must be traceable to sources']
};

// ---------- objective bank (reference bands are the author's teaching examples) ----------
// ref = index into BANDS
const bank = [
  { text: 'Explain how the Roman Empire expanded around the Mediterranean between 100 BC and AD 117.',
    cands: [['Leaflet map', 'leaflet', 3], ['vis-timeline', 'timeline', 3], ['p5.js', 'p5', 1], ['Chart.js', 'chartjs', 0]],
    good: 'Should the learner see the spread over time, or the place where each event happened?',
    weak: 'Which of the two libraries is easier to code?',
    goodWhy: 'It asks about the objective, and the answer separates the map from the timeline.',
    weakWhy: 'Ease of coding says nothing about what the learner needs to see, so it cannot settle the routing.',
    note: 'Places and dates both matter, so the map and the timeline both land in the strong band. That tie is routing ambiguity.' },
  { text: 'Analyze which concepts must be learned before Instrumented MicroSim.',
    cands: [['vis-network', 'visnetwork', 4], ['Mermaid', 'mermaid', 1], ['Chart.js', 'chartjs', 0]],
    good: 'Must the learner explore and highlight prerequisites, or follow one fixed order of steps?',
    weak: 'Should the concept boxes be round or square?',
    goodWhy: 'Exploring and highlighting points to vis-network; one fixed sequence would point to Mermaid.',
    weakWhy: 'Node shape is a styling choice that both libraries support.',
    note: 'Concepts and dependencies are nodes and edges: a primary vis-network use case.' },
  { text: 'Explain how the amplitude and frequency of a sine wave change its graph.',
    cands: [['Plotly', 'plotly', 4], ['p5.js', 'p5', 2], ['Chart.js', 'chartjs', 0]],
    good: 'Is the content a continuous function the learner varies with sliders, or a set of measured data points?',
    weak: 'Should the curve be drawn in blue or red?',
    goodWhy: 'A continuous function with parameters is Plotly\'s primary use case.',
    weakWhy: 'Color does not distinguish the candidate libraries.',
    note: 'A function with two parameters and sliders is exactly what the Plotly guideline describes.' },
  { text: 'Compare the number of MicroSims of each type across three books.',
    cands: [['Chart.js', 'chartjs', 4], ['Plotly', 'plotly', 1], ['HTML matrix', 'htmltable', 1], ['p5.js', 'p5', 0]],
    good: 'Does the learner compare counts at a glance, or read a paragraph of explanation for each cell?',
    weak: 'How many books will there be next year?',
    goodWhy: 'Counts at a glance is a grouped bar chart; paragraphs per cell would be an HTML matrix.',
    weakWhy: 'The number of books changes the data, not the type.',
    note: 'Numbers in categories are a standard bar chart.' },
  { text: 'Prioritize ten course improvements by impact and effort.',
    cands: [['Bubble chart', 'bubble', 4], ['Chart.js', 'chartjs', 3], ['HTML matrix', 'htmltable', 1]],
    good: 'Does each item need a third measure, such as cost, shown as bubble size?',
    weak: 'Should the chart have a title?',
    goodWhy: 'A third dimension favors the bubble-chart guide; two dimensions alone could be a plain scatter chart.',
    weakWhy: 'Both candidates can have a title.',
    note: 'Impact versus effort is the bubble guide\'s named use case; both candidates run on Chart.js.' },
  { text: 'Explain the steps of a change-approval process and its two decision points.',
    cands: [['Mermaid', 'mermaid', 4], ['vis-network', 'visnetwork', 2], ['p5.js', 'p5', 1]],
    good: 'Will the learner follow one sequence of steps, or drag and explore connections?',
    weak: 'How many people approve a change?',
    goodWhy: 'One sequence of steps with decisions is a flowchart.',
    weakWhy: 'The number of approvers is content, not a routing question.',
    note: 'A process with decisions is a standard flowchart; in this book every node gets a click directive.' },
  { text: 'Examine a graph of our project\'s dependencies.',
    cands: [['vis-network', 'visnetwork', 3], ['Chart.js', 'chartjs', 2], ['Mermaid', 'mermaid', 2]],
    good: 'Do you mean a chart of numbers, or a network showing which parts depend on which?',
    weak: 'Should the graph fit on one screen?',
    goodWhy: '"Graph" names both a chart and a network; this question separates them.',
    weakWhy: 'Screen size does not tell you whether the content is numbers or connections.',
    note: 'The generator skill lists this request as ambiguous: "graph" can mean Chart.js or vis-network.' },
  { text: 'Distinguish what artificial intelligence, machine learning and data science have in common.',
    cands: [['Venn diagram', 'venn', 4], ['vis-network', 'visnetwork', 1], ['HTML matrix', 'htmltable', 1]],
    good: 'Is the point the overlap among a few sets, or the links among many entities?',
    weak: 'Which field is the oldest?',
    goodWhy: 'Overlap among three sets is the Venn diagram\'s case; many links would be a network.',
    weakWhy: 'Age is a fact about the fields, not about the shape of the content.',
    note: 'Three overlapping sets is the Venn guideline\'s perfect match.' },
  { text: 'Explain why adding more road capacity can increase traffic.',
    cands: [['Causal loop', 'cld', 4], ['vis-network', 'visnetwork', 2], ['p5.js', 'p5', 1]],
    good: 'Must the learner see whether each loop reinforces or balances change?',
    weak: 'How many lanes does the road have?',
    goodWhy: 'Loop polarity is the reason to choose a causal loop diagram over a plain network.',
    weakWhy: 'Lane count is a detail of the example, not of the routing.',
    note: 'The objective is a reinforcing feedback loop, so polarity matters.' },
  { text: 'Interpret how enrollment in each of the 50 states changed over ten years.',
    cands: [['Leaflet map', 'leaflet', 3], ['Chart.js', 'chartjs', 3], ['vis-timeline', 'timeline', 1]],
    good: 'Is the point where the change happened, or how much it changed from year to year?',
    weak: 'Which map tiles should be used?',
    goodWhy: 'Where points to a choropleth map; how much over time points to a line chart.',
    weakWhy: 'Choosing tiles assumes the map already won.',
    note: 'A choropleth map and a line chart both fit well: another case for a clarifying question.' }
];

// ---------- state ----------
let objIndex = 0;
let scores = [];
let touched = false;
let revealed = false;
let questionChoice = null;   // 'good' | 'weak'
let questionOrder = [];      // shuffled ['good','weak']
let chart = null;

// ---------- Chart.js plugin: shaded rubric bands and reference-band overlay ----------
const bandPlugin = {
  id: 'rubricBands',
  beforeDatasetsDraw(c) {
    const { ctx, chartArea: a, scales: { x } } = c;
    ctx.save();
    BANDS.forEach((b, i) => {
      const x0 = x.getPixelForValue(b.lo === 0 ? 0 : b.lo);
      const x1 = x.getPixelForValue(i === BANDS.length - 1 ? 100 : BANDS[i + 1].lo);
      ctx.fillStyle = b.fill;
      ctx.fillRect(x0, a.top, x1 - x0, a.bottom - a.top);
      ctx.fillStyle = 'dimgray';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      // use the short label when the band is too narrow for the full name
      // (the last band may spill into the chart's right padding)
      const room = x1 - x0 - 2 + (i === BANDS.length - 1 ? 24 : 0);
      const label = ctx.measureText(b.name).width > room ? b.short : b.name;
      ctx.fillText(label, (x0 + x1) / 2, a.top - 3);
    });
    ctx.restore();
  },
  // drawn before the tooltip so the tooltip stays on top
  afterDatasetsDraw(c) {
    const { ctx, scales: { x } } = c;
    const meta = c.getDatasetMeta(0);
    ctx.save();
    meta.data.forEach((bar, i) => {
      // score at the end of each bar
      ctx.fillStyle = 'black';
      ctx.font = 'bold 13px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(scores[i]), bar.x + 4, bar.y);
      if (!revealed) return;
      const ref = BANDS[bank[objIndex].cands[i][2]];
      const x0 = x.getPixelForValue(ref.lo);
      const x1 = x.getPixelForValue(ref.hi === 100 ? 100 : ref.hi + 1);
      const h = bar.height + 10;
      const inBand = bandOf(scores[i]) === bank[objIndex].cands[i][2];
      ctx.strokeStyle = inBand ? 'darkgreen' : 'firebrick';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(x0, bar.y - h / 2, x1 - x0, h);
      ctx.setLineDash([]);
    });
    ctx.restore();
  }
};

// ---------- helpers ----------
function wrap(text, width) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  words.forEach(w => {
    if ((line + ' ' + w).trim().length > width) { lines.push(line.trim()); line = w; }
    else line += ' ' + w;
  });
  if (line.trim()) lines.push(line.trim());
  return lines;
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ---------- build the page for one objective ----------
function loadObjective(i) {
  objIndex = i;
  const o = bank[i];
  scores = o.cands.map(() => 50);
  touched = false;
  revealed = false;
  questionChoice = null;
  questionOrder = Math.random() < 0.5 ? ['good', 'weak'] : ['weak', 'good'];
  document.getElementById('obj-meta').textContent = 'Objective ' + (i + 1) + ' of ' + bank.length + ': score each candidate type from 0 to 100';
  document.getElementById('obj-text').textContent = o.text;
  document.getElementById('reveal-btn').disabled = false;

  const box = document.getElementById('sliders');
  box.innerHTML = '<h4>Your scores</h4>';
  o.cands.forEach((cand, k) => {
    const row = document.createElement('div');
    row.className = 'srow';
    row.innerHTML = '<div class="top"><span class="name">' + esc(cand[0]) + '</span><span class="val" id="val' + k + '"></span></div>' +
      '<input type="range" min="0" max="100" step="5" value="50" id="s' + k + '" aria-label="Score for ' + esc(cand[0]) + '">' +
      '<div class="ref" id="ref' + k + '"></div>';
    box.appendChild(row);
    row.querySelector('input').addEventListener('input', e => {
      scores[k] = parseInt(e.target.value, 10);
      touched = true;
      update();
    });
  });

  chart.data.labels = o.cands.map(c => c[0]);
  chart.data.datasets[0].data = scores.slice();
  sizeLayout();
  update();
}

function update() {
  const o = bank[objIndex];
  o.cands.forEach((cand, k) => {
    const b = BANDS[bandOf(scores[k])];
    const narrow = window.innerWidth < 600;
    let val = scores[k] + ' · ' + b.name;
    // on narrow screens the reference goes on the value line to save height
    if (revealed && narrow) {
      const rb = BANDS[cand[2]];
      val += ' (ref ' + rb.lo + '-' + rb.hi + (bandOf(scores[k]) === cand[2] ? ', in band)' : ', outside)');
    }
    const valEl = document.getElementById('val' + k);
    valEl.textContent = val;
    valEl.className = 'val' + (revealed && narrow ? (bandOf(scores[k]) === cand[2] ? ' inband' : ' outband') : '');
    const ref = document.getElementById('ref' + k);
    if (revealed && !narrow) {
      const rb = BANDS[cand[2]];
      const inBand = bandOf(scores[k]) === cand[2];
      ref.className = 'ref ' + (inBand ? 'inband' : 'outband');
      ref.textContent = 'Reference: ' + rb.lo + '-' + rb.hi + ' (' + rb.name + ')' + (inBand ? ', yours is in the band' : ', yours is outside it');
    } else {
      ref.className = 'ref';
      ref.textContent = '';
    }
  });
  // highest bar in dark blue, the others in steel blue
  const top = Math.max(...scores);
  chart.data.datasets[0].data = scores.slice();
  chart.data.datasets[0].backgroundColor = scores.map(s => (s === top ? 'midnightblue' : 'steelblue'));
  chart.update('none');
  renderFeedback();
}

function renderFeedback() {
  const o = bank[objIndex];
  const fb = document.getElementById('feedback');
  const sorted = scores.slice().sort((a, b) => b - a);
  const ambiguous = sorted[0] - sorted[1] <= 10;
  const showWarn = document.getElementById('amb-check').checked;
  let html = '';
  if (!touched) {
    html += '<p class="hint" style="margin:2px 0">Drag each slider to score how well that type fits the objective. Hover a bar to read the rubric guideline for the band your score is in.</p>';
  } else if (ambiguous && showWarn) {
    html += '<div id="banner"><div class="title">Routing ambiguity: ask a clarifying question</div>' +
      '<div>Your top two scores are within 10 points. Which question would you ask the author?</div>';
    questionOrder.forEach(kind => {
      const q = kind === 'good' ? o.good : o.weak;
      const chosen = questionChoice === kind;
      html += '<button data-kind="' + kind + '"' + (chosen ? ' style="font-weight:bold"' : '') + '>' + esc(q) + '</button>';
    });
    if (questionChoice) {
      html += '<div class="fb ' + (questionChoice === 'good' ? 'ok' : 'bad') + '">' +
        (questionChoice === 'good' ? 'Good question. ' + esc(o.goodWhy) : 'Weak question. ' + esc(o.weakWhy)) + '</div>';
    }
    html += '</div>';
  } else if (touched) {
    const lead = o.cands[scores.indexOf(sorted[0])][0];
    html += '<p style="margin:2px 0">Your top choice is <b>' + esc(lead) + '</b>, ' + (sorted[0] - sorted[1]) +
      ' points ahead of the next candidate. ' + esc(BANDS[bandOf(sorted[0])].long) + '.</p>';
  }
  if (revealed) {
    const hits = o.cands.filter((c, k) => bandOf(scores[k]) === c[2]).length;
    html += '<p style="margin:4px 0"><b>' + hits + ' of ' + o.cands.length + '</b> of your scores fall in the reference band. ' + esc(o.note) + '</p>';
  }
  fb.innerHTML = html;
  fb.querySelectorAll('#banner button').forEach(b => b.addEventListener('click', () => {
    questionChoice = b.getAttribute('data-kind');
    renderFeedback();
  }));
  fitFeedbackFont();
}

// shrink the feedback text if it would overflow its fixed-height area
function fitFeedbackFont() {
  const fb = document.getElementById('feedback');
  let fs = window.innerWidth < 600 ? 13 : 14;
  fb.style.fontSize = fs + 'px';
  while (fb.scrollHeight > fb.clientHeight + 1 && fs > 11) {
    fs--;
    fb.style.fontSize = fs + 'px';
  }
}

// ---------- layout: everything fits in CANVAS_HEIGHT ----------
function sizeLayout() {
  const narrow = window.innerWidth < 600;
  const objH = document.getElementById('objective').offsetHeight;
  const ctrlH = document.getElementById('controls').offsetHeight;
  const feedbackH = narrow ? 178 : 172;
  document.getElementById('feedback').style.height = feedbackH + 'px';
  const mainH = CANVAS_HEIGHT - objH - ctrlH - feedbackH - 2;
  const chartBox = document.getElementById('chart-box');
  const sliders = document.getElementById('sliders');
  if (narrow) {
    sliders.style.height = 'auto';
    const sH = sliders.offsetHeight;
    chartBox.style.height = Math.max(170, mainH - sH) + 'px';
    document.getElementById('main').style.height = mainH + 'px';
  } else {
    document.getElementById('main').style.height = mainH + 'px';
    chartBox.style.height = mainH + 'px';
    sliders.style.height = mainH + 'px';
  }
  if (chart) chart.resize();
}

// ---------- start ----------
document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('chart');
  chart = new Chart(ctx, {
    type: 'bar',
    data: { labels: [], datasets: [{ label: 'Your score (set with the sliders)', data: [], backgroundColor: 'steelblue', borderRadius: 4, barPercentage: 0.6 }] },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      layout: { padding: { top: 18, right: 28 } },
      scales: {
        x: { min: 0, max: 100, ticks: { stepSize: 10, font: { size: 12 } }, grid: { color: 'rgba(0,0,0,0.08)' },
          title: { display: true, text: 'Routing score (0 to 100)', font: { size: 13 } } },
        y: { ticks: { autoSkip: false, font: { size: 14, weight: 'bold' }, color: 'black' }, grid: { display: false } }
      },
      plugins: {
        legend: { display: true, position: 'bottom', labels: { font: { size: 12 }, boxWidth: 14 } },
        tooltip: {
          callbacks: {
            title: items => items[0].label,
            label: item => 'Your score: ' + item.raw + ' (' + BANDS[bandOf(item.raw)].name + ')',
            afterBody: items => {
              const k = items[0].dataIndex;
              const cand = bank[objIndex].cands[k];
              const lines = ['Guideline at your score:'].concat(wrap(GUIDES[cand[1]][bandOf(scores[k])], 44));
              if (revealed) {
                lines.push('Reference band ' + BANDS[cand[2]].lo + '-' + BANDS[cand[2]].hi + ':');
                wrap(GUIDES[cand[1]][cand[2]], 44).forEach(L => lines.push(L));
              }
              return lines;
            }
          }
        }
      }
    },
    plugins: [bandPlugin]
  });

  document.getElementById('reveal-btn').addEventListener('click', () => {
    revealed = true;
    document.getElementById('reveal-btn').disabled = true;
    update();
    sizeLayout();
  });
  document.getElementById('next-btn').addEventListener('click', () => loadObjective((objIndex + 1) % bank.length));
  document.getElementById('amb-check').addEventListener('change', renderFeedback);
  window.addEventListener('resize', () => { sizeLayout(); renderFeedback(); });
  loadObjective(0);
});
