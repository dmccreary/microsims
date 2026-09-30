// Class Dashboard Load Estimator - Chart.js
// CANVAS_HEIGHT: 540
// Learning objective (Apply / calculate): the learner calculates the download size and
// load-time band for an LRS-Lite teacher dashboard at a given roster size and decides
// whether the design's rollup function is needed.
// Design figures (Chapter 23, LRS-Lite analysis): about 11 KB gzipped per student summary,
// 150 students load in about one to four seconds, rollup function above roughly 100 students.
// Model:
//   total MB  = students x summary KB / 1000      (one summary.json download per student)
//   line      = 100 x summary KB / 1000           (the 100-student threshold at this size)
//   load band = students x 5..20 ms + total MB / 10..2.5 MB/s   (ILLUSTRATIVE, calibrated
//               so that 150 students x 11 KB gives about 1 to 4 seconds, as the design says)
//   rollup MB = (students x 2 KB + 20 KB) / 1000  (ILLUSTRATIVE size of one pre-aggregated file)

const THRESHOLD_STUDENTS = 100;     // design's approximate rollup threshold
const ROLLUP_KB_PER_STUDENT = 2;    // illustrative, not a design figure
const ROLLUP_FIXED_KB = 20;         // illustrative class-level aggregates
const MS_PER_FILE_LOW = 5, MS_PER_FILE_HIGH = 20;     // illustrative per-request cost
const MBPS_LOW = 10, MBPS_HIGH = 2.5;                  // illustrative transfer rates
const COMFORT_SECONDS = 2;          // upper estimate at or below this counts as comfortable

let chart = null;
let m = null;

function fmtMB(x) {
    if (x < 0.1) return x.toFixed(3) + ' MB';
    if (x < 10) return x.toFixed(2) + ' MB';
    return x.toFixed(1) + ' MB';
}
function fmtS(x) { return x < 10 ? x.toFixed(1) : Math.round(x).toString(); }

function compute() {
    const students = Number(document.getElementById('students').value);
    const kb = Number(document.getElementById('kb').value);
    const totalMB = students * kb / 1000;
    const thresholdMB = THRESHOLD_STUDENTS * kb / 1000;
    const rollupMB = (students * ROLLUP_KB_PER_STUDENT + ROLLUP_FIXED_KB) / 1000;
    const lowS = students * MS_PER_FILE_LOW / 1000 + totalMB / MBPS_LOW;
    const highS = students * MS_PER_FILE_HIGH / 1000 + totalMB / MBPS_HIGH;
    let band;
    if (students > THRESHOLD_STUDENTS) {
        band = { msg: 'Use the rollup function', color: '#D55E00',
                 why: `${students} students is above the design's threshold of about 100.` };
    } else if (highS > COMFORT_SECONDS) {
        band = { msg: 'Expect a few seconds', color: '#E69F00',
                 why: `The upper estimate is over ${COMFORT_SECONDS} s, but the roster is still at or under about 100.` };
    } else {
        band = { msg: 'Browser aggregation is comfortable', color: '#009E73',
                 why: `The upper estimate stays at or under ${COMFORT_SECONDS} s.` };
    }
    return { students, kb, totalMB, thresholdMB, rollupMB, lowS, highS, band };
}

// Value labels and the 100-student reference line (drawn before tooltips)
const annotationPlugin = {
    id: 'thresholdLine',
    afterDatasetsDraw(c) {
        const { ctx, chartArea, scales } = c;
        ctx.save();
        ctx.font = 'bold 15px Arial';
        ctx.fillStyle = '#222';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        const b0 = c.getDatasetMeta(0).data[0];
        const b1 = c.getDatasetMeta(1).data[1];
        if (b0) ctx.fillText(fmtMB(m.totalMB), b0.x, b0.y - 4);
        if (b1) ctx.fillText(fmtMB(m.rollupMB), b1.x, b1.y - 4);
        const y = scales.y.getPixelForValue(m.thresholdMB);
        ctx.strokeStyle = '#D55E00';
        ctx.lineWidth = 2;
        ctx.setLineDash([7, 5]);
        ctx.beginPath();
        ctx.moveTo(chartArea.left, y);
        ctx.lineTo(chartArea.right, y);
        ctx.stroke();
        ctx.setLineDash([]);
        const label = `100 students = ${fmtMB(m.thresholdMB)}`;
        ctx.textAlign = 'right';
        const w = ctx.measureText(label).width + 8;
        const x = chartArea.right - 4;
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.fillRect(x - w + 4, y - 20, w, 18);
        ctx.fillStyle = '#A23E00';
        ctx.fillText(label, x, y - 3);
        ctx.restore();
    }
};

function buildChart() {
    chart = new Chart(document.getElementById('chart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: [['Total download', ''], ['Rollup download', '(one file)']],
            datasets: [
                { label: 'Total download (MB)', data: [0, null], grouped: false,
                  backgroundColor: '#0072B2', borderColor: '#004f7c', borderWidth: 1,
                  barPercentage: 0.55, categoryPercentage: 0.8 },
                { label: 'Rollup download (one file)', data: [null, 0], grouped: false,
                  backgroundColor: '#8c8c8c', borderColor: '#555555', borderWidth: 1,
                  barPercentage: 0.14, categoryPercentage: 0.8 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 200 },
            layout: { padding: { top: 20 } },
            plugins: {
                legend: { display: false },
                tooltip: {
                    titleFont: { size: 14 }, bodyFont: { size: 14 },
                    filter: item => item.raw !== null,
                    callbacks: { label: item => tooltipLines(item.dataIndex) }
                }
            },
            scales: {
                y: { beginAtZero: true,
                     title: { display: true, text: 'Download size (MB)', font: { size: 14 } },
                     ticks: { font: { size: 14 } } },
                x: { ticks: { font: { size: 15, weight: 'bold' }, color: '#222' } }
            }
        },
        plugins: [annotationPlugin]
    });
}

function tooltipLines(i) {
    if (i === 0) {
        return [fmtMB(m.totalMB),
                `= ${m.students} students × ${m.kb} KB ÷ 1000`,
                `${m.students} downloads of summary.json`];
    }
    return [fmtMB(m.rollupMB) + ' (illustrative size)',
            `= (${m.students} × ${ROLLUP_KB_PER_STUDENT} KB + ${ROLLUP_FIXED_KB} KB) ÷ 1000`,
            '1 download: the rollup pre-aggregates the class'];
}

function renderPanel() {
    const p = document.getElementById('panel');
    p.style.borderLeftColor = m.band.color;
    p.innerHTML =
        `<div class="msg">${m.band.msg}</div>` +
        `<div><b>${m.students}</b> downloads (one summary.json per student), ` +
        `total <b>${fmtMB(m.totalMB)}</b> <span class="f">= ${m.students} × ${m.kb} KB ÷ 1000</span></div>` +
        `<div>Estimated load time: about <b>${fmtS(m.lowS)} to ${fmtS(m.highS)} s</b>. ${m.band.why}</div>` +
        `<div class="note">The 11 KB summary size and the 100-student threshold are the design's estimates. ` +
        `The time band and the rollup file size are illustrative, calibrated to the design's ` +
        `“150 students in about one to four seconds.”</div>`;
}

function update() {
    m = compute();
    document.getElementById('students-val').textContent = m.students;
    document.getElementById('kb-val').textContent = m.kb;
    // two-line category labels wrap instead of overflowing on narrow screens
    chart.data.labels = [['Total download', `(${m.students} files)`], ['Rollup download', '(one file)']];
    chart.data.datasets[0].data = [m.totalMB, null];
    chart.data.datasets[1].data = [null, m.rollupMB];
    const top = Math.max(m.totalMB, m.thresholdMB, m.rollupMB) * 1.25;
    chart.options.scales.y.max = niceMax(top);
    chart.update();
    renderPanel();
}

function niceMax(x) {
    const steps = [0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12];
    for (const s of steps) if (x <= s) return s;
    return Math.ceil(x);
}

document.addEventListener('DOMContentLoaded', function () {
    buildChart();
    document.getElementById('students').addEventListener('input', update);
    document.getElementById('kb').addEventListener('input', update);
    window.addEventListener('resize', () => { if (chart) { chart.resize(); chart.update('none'); } });
    update();
});
