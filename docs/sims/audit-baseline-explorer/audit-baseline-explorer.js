// Audit Baseline Explorer - Chart.js MicroSim
// CANVAS_HEIGHT: 570
// Learning objective (Analyze / examine): the learner examines the 2026-09-30 audit of 116
// MicroSims and identifies which rubric issues most often hold MicroSims below the grade A bar.
// Top: MicroSims per grade (click a bar to filter). Bottom: how often each rubric issue occurs,
// as counts or as total points lost (count x the rubric points of that check).

// ===========================================
// DATA: the audit recorded in this repository's TODO.md
// ===========================================
// Grade counts and issue totals are the published figures; the per-grade breakdown was tallied
// from the per-MicroSim issue lists in the same TODO.md section and sums to the totals.
const AUDIT = {
    date: '2026-09-30',
    source: 'TODO.md, "MicroSims 2.0: Per-Sim Quality Upgrades (audit 2026-09-30)", produced by validate-sims.py',
    total: 116,
    mean: 60.6,
    grades: {
        A: { count: 18, range: '85 and above', action: 'Already at the bar; confirm and carry over when a chapter adopts it.', color: 'seagreen' },
        B: { count: 27, range: '70 to 84', action: 'Close to the bar; fix the listed issues.', color: 'royalblue' },
        C: { count: 30, range: '50 to 69', action: 'Substantial work; rebuild from a specification if cheaper.', color: 'darkgoldenrod' },
        D: { count: 41, range: 'under 50', action: 'Likely rebuild or drop.', color: 'firebrick' }
    },
    // points: the rubric points that check is worth in validate-sims.py
    issues: [
        { label: 'Missing educational section', points: 5, total: 110, byGrade: { A: 17, B: 27, C: 29, D: 37 },
          note: 'an "educational" block in metadata.json' },
        { label: 'Missing Lesson Plan section', points: 10, total: 76, byGrade: { A: 0, B: 15, C: 22, D: 39 },
          note: 'a level 2 "Lesson Plan" heading in index.md' },
        { label: 'Missing References section', points: 5, total: 74, byGrade: { A: 3, B: 14, C: 22, D: 35 },
          note: 'a level 2 "References" heading in index.md' },
        { label: 'Missing schema meta tag', points: 3, total: 73, byGrade: { A: 18, B: 27, C: 20, D: 8 },
          note: 'the <meta name="schema"> line in main.html' },
        { label: 'Missing copy-paste iframe example', points: 5, total: 68, byGrade: { A: 0, B: 10, C: 20, D: 38 },
          note: 'an iframe example inside a code block in index.md' },
        { label: 'Missing description or about section', points: 5, total: 60, byGrade: { A: 0, B: 12, C: 17, D: 31 },
          note: 'a Description, About, Overview, How to Use or Introduction heading' },
        { label: 'Missing screenshot', points: 5, total: 54, byGrade: { A: 5, B: 8, C: 12, D: 29 },
          note: 'a PNG in the MicroSim folder' },
        { label: 'No main.html', points: 10, total: 43, byGrade: { A: 0, B: 0, C: 10, D: 33 },
          note: 'main.html itself: file 5 + schema tag 3 + main element 2 (a p5.js folder can lose the 5 free p5 points until its script follows the conventions)' }
    ]
};
const GRADE_KEYS = ['A', 'B', 'C', 'D'];

// ===========================================
// STATE
// ===========================================
let filter = 'all';        // all | belowA | A | B | C | D
let metric = 'count';      // count | points
let gradeChart = null, issueChart = null;
let sortedIssues = [];     // issues in the order currently drawn

function gradesInFilter() {
    if (filter === 'all') return GRADE_KEYS;
    if (filter === 'belowA') return ['B', 'C', 'D'];
    return [filter];
}
function issueCount(issue) {
    return gradesInFilter().reduce((s, g) => s + issue.byGrade[g], 0);
}
function simsInFilter() {
    return gradesInFilter().reduce((s, g) => s + AUDIT.grades[g].count, 0);
}
function filterName() {
    if (filter === 'all') return 'all grades';
    if (filter === 'belowA') return 'grades B, C and D (below the A bar)';
    return 'grade ' + filter;
}
function metricValue(issue) {
    const c = issueCount(issue);
    return metric === 'count' ? c : c * issue.points;
}

// ===========================================
// CHARTS
// ===========================================
function gradeColors() {
    const sel = gradesInFilter();
    return GRADE_KEYS.map(g => {
        const c = AUDIT.grades[g].color;
        return (filter === 'all' || sel.includes(g)) ? c : 'rgba(160,160,160,0.45)';
    });
}

function buildGradeChart() {
    const ctx = document.getElementById('grade-chart');
    gradeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: GRADE_KEYS,
            datasets: [{ label: 'MicroSims', data: GRADE_KEYS.map(g => AUDIT.grades[g].count),
                backgroundColor: gradeColors(), borderColor: '#333', borderWidth: 1 }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 250 },
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'MicroSims per grade (click a bar)', font: { size: 13 } },
                tooltip: {
                    callbacks: {
                        title: items => 'Grade ' + items[0].label + ' (' + AUDIT.grades[items[0].label].range + ')',
                        label: item => item.raw + ' MicroSims, ' + Math.round(100 * item.raw / AUDIT.total) + '% of ' + AUDIT.total
                    }
                }
            },
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'MicroSims' }, ticks: { precision: 0 } },
                x: { title: { display: false } }
            },
            onClick: (evt, elements) => {
                if (!elements.length) return;
                const g = GRADE_KEYS[elements[0].index];
                setFilter(filter === g ? 'all' : g);
            },
            onHover: (evt, elements) => {
                evt.native.target.style.cursor = elements.length ? 'pointer' : 'default';
            }
        }
    });
}

function buildIssueChart() {
    const ctx = document.getElementById('issue-chart');
    issueChart = new Chart(ctx, {
        type: 'bar',
        data: { labels: [], datasets: [{ label: '', data: [], backgroundColor: [], borderColor: '#333', borderWidth: 1 }] },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 300 },
            plugins: {
                // legend for the bar colors: the rubric points of each check
                legend: {
                    display: true,
                    position: 'bottom',
                    onClick: null,
                    labels: {
                        boxWidth: 12,
                        font: { size: 11 },
                        generateLabels: () => [
                            { text: '10-point check', fillStyle: 'darkslateblue', strokeStyle: '#333', lineWidth: 1 },
                            { text: '5-point check', fillStyle: 'steelblue', strokeStyle: '#333', lineWidth: 1 },
                            { text: '3-point check', fillStyle: 'lightsteelblue', strokeStyle: '#333', lineWidth: 1 }
                        ]
                    }
                },
                title: { display: true, text: '', font: { size: 13 } },
                tooltip: {
                    callbacks: {
                        title: items => sortedIssues[items[0].dataIndex].label,
                        label: item => {
                            const is = sortedIssues[item.dataIndex];
                            const c = issueCount(is);
                            return [
                                c + ' MicroSims in ' + filterName() + ' have it',
                                'Rubric points: ' + is.points + ' (' + is.note.split(' (')[0] + ')',
                                'Fixing it adds ' + is.points + ' to each: ' + (c * is.points) + ' points in total'
                            ];
                        }
                    }
                }
            },
            scales: {
                x: { beginAtZero: true, title: { display: true, text: '' }, ticks: { precision: 0 } },
                y: { ticks: { autoSkip: false, font: { size: 12 } } }
            }
        }
    });
}

// short labels when the chart is narrow, so the bars keep their room
function shortLabel(l) {
    return l.replace('Missing ', '').replace(' section', '').replace('copy-paste iframe example', 'iframe example')
        .replace('description or about', 'description/about');
}

function updateIssueChart() {
    sortedIssues = AUDIT.issues.slice().sort((a, b) => metricValue(b) - metricValue(a));
    const narrow = document.getElementById('issue-panel').clientWidth < 520;
    const ds = issueChart.data.datasets[0];
    issueChart.data.labels = sortedIssues.map(i => narrow ? shortLabel(i.label) : i.label);
    ds.data = sortedIssues.map(metricValue);
    ds.label = metric === 'count' ? 'MicroSims with the issue' : 'Points lost';
    // 10-point checks darker so the weight difference is visible
    ds.backgroundColor = sortedIssues.map(i => i.points === 10 ? 'darkslateblue' : (i.points === 5 ? 'steelblue' : 'lightsteelblue'));
    issueChart.options.plugins.title.text = (metric === 'count' ? 'How often each issue occurs' : 'Points lost to each issue (count x rubric points)') +
        ': ' + filterName() + ' (' + simsInFilter() + ' MicroSims)';
    issueChart.options.scales.x.title.text = metric === 'count' ? 'MicroSims with the issue' : 'Points lost';
    issueChart.options.plugins.title.font.size = narrow ? 11 : 13;
    issueChart.update();
    // accessible text alternative
    const summary = sortedIssues.map(i => i.label + ' ' + metricValue(i)).join('; ');
    document.getElementById('issue-chart').setAttribute('aria-label',
        (metric === 'count' ? 'Issue counts' : 'Points lost') + ' for ' + filterName() + ': ' + summary + '.');
}

// ===========================================
// INFO PANEL: recommended action and the top issues
// ===========================================
function updateInfo() {
    const box = document.getElementById('info');
    const top = AUDIT.issues.slice().sort((a, b) => issueCount(b) - issueCount(a)).filter(i => issueCount(i) > 0);
    const n = simsInFilter();
    const top3 = top.slice(0, 3).map(i => i.label.replace('Missing ', '').toLowerCase() + ' (' + issueCount(i) + ')').join(', ');
    let html;
    if (filter === 'all') {
        html = '<h3>All grades: ' + AUDIT.total + ' MicroSims, mean score ' + AUDIT.mean + '</h3>' +
            '<p>' + (AUDIT.total - AUDIT.grades.A.count) + ' MicroSims are below the A bar of 85. Most common issues: ' + top3 + '.</p>' +
            '<p class="wide-only">Click a grade bar, or choose <b>Below A</b>, to see what holds those MicroSims back.</p>';
    } else if (filter === 'belowA') {
        html = '<h3>Below the A bar: ' + n + ' MicroSims (grades B, C, D)</h3>' +
            '<p>Most common issues: ' + top3 + '. Switch to <b>Total points lost</b> to weigh each issue by its rubric points.</p>';
    } else {
        const g = AUDIT.grades[filter];
        html = '<h3><span class="swatch" style="background:' + g.color + '"></span>Grade ' + filter + ' (' + g.range + '): ' + g.count + ' MicroSims</h3>' +
            '<p><b>Audit action:</b> ' + g.action + '</p>' +
            '<p>Most common issues: ' + top3 + '.</p>';
    }
    html += '<p class="src">Source: ' + AUDIT.source + '.</p>';
    box.innerHTML = html;
    document.getElementById('grade-chart').setAttribute('aria-label',
        'MicroSims per grade in the ' + AUDIT.date + ' audit: ' +
        GRADE_KEYS.map(k => k + ' ' + AUDIT.grades[k].count).join(', ') + '. Selected: ' + filterName() + '.');
}

function setFilter(f) {
    filter = f;
    document.getElementById('grade-select').value = f;
    gradeChart.data.datasets[0].backgroundColor = gradeColors();
    gradeChart.update();
    updateIssueChart();
    updateInfo();
}

// ===========================================
// START
// ===========================================
document.addEventListener('DOMContentLoaded', function () {
    Chart.defaults.font.family = 'Arial, Helvetica, sans-serif';
    buildGradeChart();
    buildIssueChart();
    document.getElementById('grade-select').addEventListener('change', e => setFilter(e.target.value));
    document.getElementById('metric-select').addEventListener('change', e => {
        metric = e.target.value;
        updateIssueChart();
    });
    setFilter('all');
    let timer = null;
    window.addEventListener('resize', () => { clearTimeout(timer); timer = setTimeout(updateIssueChart, 150); });
});
