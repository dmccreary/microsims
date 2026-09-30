// Chart Type Chooser - Chart.js 4.4.0
// CANVAS_HEIGHT: 450
// Learners pick the chart type (bar, line or pie) that best answers a stated
// data question, press "Check my choice" for green/amber feedback that quotes
// the fit rule, and then compare the same data drawn in the two other types.
// One Chart.js object is destroyed and rebuilt whenever the type or dataset changes.

// ---------------------------------------------------------------------------
// Fit rules (quoted in the side note after "Check my choice")
// ---------------------------------------------------------------------------
const FIT_RULES = {
    bar:  'bar: compare values across discrete categories',
    line: 'line: change over an ordered, continuous quantity such as time',
    pie:  'pie: parts of a whole, six slices or fewer'
};

// ---------------------------------------------------------------------------
// Three small built-in datasets (all values invented for illustration)
// ---------------------------------------------------------------------------
const DATASETS = [
    {
        key: 'shares',
        name: 'Library shares (%)',
        question: 'How is a collection of 200 MicroSims divided among the libraries used to build them?',
        unit: '%',
        valueLabel: 'Share of MicroSims',
        labels: ['p5.js', 'Chart.js', 'vis-network', 'Mermaid', 'Plotly'],
        values: [45, 20, 15, 12, 8],
        best: 'pie',
        feedback: {
            pie:  'Good fit. The five shares add up to 100 percent, so a pie shows how the whole collection is divided, and five slices stay readable.',
            bar:  'Workable, but not the best fit. Bars compare the shares precisely, yet they hide the fact that the shares add up to one whole. Try Pie.',
            line: 'Poor fit. The libraries have no natural order, so the line invents a trend between p5.js and Chart.js that does not exist.'
        }
    },
    {
        key: 'weeks',
        name: 'Learners by week',
        question: 'How did the number of weekly active learners change over the six weeks of the course?',
        unit: ' learners',
        valueLabel: 'Weekly active learners',
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        values: [120, 150, 185, 170, 210, 240],
        best: 'line',
        feedback: {
            line: 'Good fit. The weeks are ordered time points, so connecting them shows the rise, the dip in week 4 and the recovery as one trend.',
            bar:  'Workable, but not the best fit. Bars show each week\'s value, but the eye compares heights instead of following the trend. Try Line.',
            pie:  'Poor fit. Weekly counts are not parts of a whole, so a slice for "Week 3" has no meaning and the time order disappears.'
        }
    },
    {
        key: 'minutes',
        name: 'Minutes per sim type',
        question: 'Which MicroSim type holds a learner\'s attention longest, and by how much more than the next?',
        unit: ' min',
        valueLabel: 'Average minutes on task',
        labels: ['Concept map', 'Bouncing ball', 'Timeline', 'Priority matrix',
                 'Function plot', 'Flowchart', 'Venn diagram', 'Comparison table'],
        values: [7.4, 6.5, 5.0, 4.8, 4.2, 3.7, 3.1, 2.6],
        best: 'bar',
        feedback: {
            bar:  'Good fit. Eight unrelated categories are compared by length, and the eye judges bar lengths far more precisely than slice angles.',
            line: 'Poor fit. The sim types are unordered categories, so a line between "Timeline" and "Priority matrix" implies a trend that is not there.',
            pie:  'Poor fit. The minutes do not add up to a meaningful whole, and eight slices break the six-slice limit. Try Bar.'
        }
    }
];

// Semi-transparent fills with matching opaque borders (chapter palette idea)
const FILLS = ['rgba(37, 99, 235, 0.80)', 'rgba(22, 163, 74, 0.80)', 'rgba(217, 119, 6, 0.80)',
               'rgba(220, 38, 38, 0.80)', 'rgba(124, 58, 237, 0.80)', 'rgba(8, 145, 178, 0.80)',
               'rgba(219, 39, 119, 0.80)', 'rgba(101, 163, 13, 0.80)'];
const BORDERS = FILLS.map(c => c.replace('0.80', '1'));

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
let chart = null;
let datasetIndex = 0;
let chartType = 'bar';
let checked = false;                       // has "Check my choice" been pressed for this dataset?
let viewedTypes = new Set(['bar']);        // types drawn for the current dataset

const typeNames = { bar: 'Bar', line: 'Line', pie: 'Pie' };

// ---------------------------------------------------------------------------
// Chart construction
// ---------------------------------------------------------------------------
function buildChart() {
    const ds = DATASETS[datasetIndex];
    const ctx = document.getElementById('chart');

    if (chart) {
        chart.destroy();                   // one chart object, rebuilt on every change
    }

    const isPie = chartType === 'pie';
    const isLine = chartType === 'line';

    const dataset = {
        label: ds.valueLabel,
        data: ds.values.slice(),
        backgroundColor: isLine ? 'rgba(37, 99, 235, 0.15)' : FILLS.slice(0, ds.values.length),
        borderColor: isLine ? 'rgb(37, 99, 235)' : BORDERS.slice(0, ds.values.length),
        borderWidth: isLine ? 3 : 1,
        pointRadius: isLine ? 5 : undefined,
        pointHoverRadius: isLine ? 7 : undefined,
        pointBackgroundColor: isLine ? 'rgb(37, 99, 235)' : undefined,
        tension: isLine ? 0.1 : undefined,
        fill: false
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,        // fixed height, width follows the container
        animation: { duration: 400 },
        plugins: {
            legend: {
                display: isPie,
                position: 'right',
                labels: { font: { size: 13 }, boxWidth: 14 }
            },
            title: {
                display: true,
                text: ds.valueLabel + ' (' + typeNames[chartType].toLowerCase() + ' chart)',
                font: { size: 15, weight: 'bold' },
                padding: { top: 2, bottom: 6 }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = isPie ? context.parsed : context.parsed.y;
                        return ' ' + context.label + ': ' + value + ds.unit;
                    }
                }
            }
        }
    };

    if (!isPie) {
        options.scales = {
            y: {
                beginAtZero: true,
                title: { display: true, text: ds.valueLabel + ' (' + ds.unit.trim() + ')', font: { size: 13 } },
                ticks: { font: { size: 12 } }
            },
            x: {
                ticks: { font: { size: 12 }, maxRotation: 40, minRotation: 0, autoSkip: false }
            }
        };
    }

    chart = new Chart(ctx, {
        type: chartType,
        data: { labels: ds.labels.slice(), datasets: [dataset] },
        options: options
    });
}

// ---------------------------------------------------------------------------
// UI updates
// ---------------------------------------------------------------------------
function updateQuestion() {
    const ds = DATASETS[datasetIndex];
    document.getElementById('question').innerHTML =
        '<strong>Data question:</strong> ' + ds.question;
}

function updateViewed() {
    const parts = ['bar', 'line', 'pie'].map(t =>
        (viewedTypes.has(t) ? '&#10003; ' : '&#9675; ') + typeNames[t]);
    let text = 'Drawn for this dataset: ' + parts.join(' &nbsp; ');
    if (checked && viewedTypes.size < 3) {
        text += '<br>Now switch to the other types to compare the same data.';
    } else if (checked && viewedTypes.size === 3) {
        text += '<br>You have compared all three types for this dataset.';
    }
    document.getElementById('viewed').innerHTML = text;
}

function resetFeedback() {
    checked = false;
    const fb = document.getElementById('feedback');
    fb.className = 'feedback neutral';
    fb.innerHTML = 'Pick the chart type you think answers the data question, then press <strong>Check my choice</strong>.';
    document.getElementById('rule').textContent = '';
}

function checkChoice() {
    const ds = DATASETS[datasetIndex];
    const fits = chartType === ds.best;
    checked = true;

    const fb = document.getElementById('feedback');
    fb.className = 'feedback ' + (fits ? 'good' : 'amber');
    fb.textContent = ds.feedback[chartType];

    let rule = 'Fit rule: "' + FIT_RULES[chartType] + '"';
    if (!fits) {
        rule += '. Best fit here: "' + FIT_RULES[ds.best] + '"';
    }
    document.getElementById('rule').textContent = rule;
    updateViewed();
}

function onTypeChange(event) {
    chartType = event.target.value;
    viewedTypes.add(chartType);
    buildChart();
    if (checked) {
        // keep the verdict visible but refresh it for the newly drawn type
        checkChoice();
    } else {
        updateViewed();
    }
}

function onDatasetChange(event) {
    datasetIndex = parseInt(event.target.value, 10);
    viewedTypes = new Set([chartType]);
    resetFeedback();
    updateQuestion();
    updateViewed();
    buildChart();
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    const select = document.getElementById('dataset-select');
    DATASETS.forEach((ds, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = ds.name;
        select.appendChild(opt);
    });
    select.addEventListener('change', onDatasetChange);

    document.querySelectorAll('input[name="chart-type"]').forEach(radio => {
        radio.addEventListener('change', onTypeChange);
    });

    document.getElementById('check-btn').addEventListener('click', checkChoice);

    updateQuestion();
    updateViewed();
    buildChart();
});
