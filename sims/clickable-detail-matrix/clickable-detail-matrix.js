// Clickable Detail Matrix - HTML table generated from data.json
// CANVAS_HEIGHT: 435
// Each cell shows a short summary tinted by emphasis. Clicking a cell calls
// showDetail(), which slides in a panel with the row, column, description and
// example. "Random cell" opens a random cell but asks the learner to predict its
// emphasis first. Escape, the close button or the overlay close the panel, and
// focus returns to the cell that opened it.

let data = null;
let lastCell = null;          // the cell to refocus when the panel closes
let predictions = { right: 0, total: 0 };

const EMPHASIS_ORDER = ['high', 'medium', 'low', 'balanced', 'unique'];

// ---------------------------------------------------------------------------
// Load and build
// ---------------------------------------------------------------------------
async function init() {
    try {
        const response = await fetch('./data.json');
        if (!response.ok) throw new Error('HTTP ' + response.status);
        data = await response.json();
    } catch (err) {
        document.getElementById('matrix-wrapper').innerHTML =
            '<p class="load-error">Could not load data.json (' + err.message + '). ' +
            'Open this MicroSim through a web server, for example with <code>mkdocs serve</code>.</p>';
        return;
    }
    document.getElementById('matrix-title').textContent = data.title;
    generateMatrix();
    buildLegend();
    setupEventListeners();
    updateScore();
}

function generateMatrix() {
    const head = document.getElementById('matrix-head');
    head.innerHTML = '<th class="row-header" scope="col">Theory</th>';
    data.columns.forEach(col => {
        const th = document.createElement('th');
        th.scope = 'col';
        th.textContent = col.name;
        head.appendChild(th);
    });

    const tbody = document.getElementById('matrix-body');
    tbody.innerHTML = '';
    data.rows.forEach((row, ri) => {
        const tr = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.className = 'row-name';
        nameCell.innerHTML = row.name + '<span class="sub">' + row.subtitle + '</span>';
        tr.appendChild(nameCell);

        data.columns.forEach((col, ci) => {
            const cell = document.createElement('td');
            const cellData = row.cells[col.key];
            cell.className = 'cell emphasis-' + cellData.emphasis;
            cell.textContent = cellData.value;
            cell.tabIndex = 0;
            cell.setAttribute('role', 'button');
            cell.setAttribute('aria-label', row.name + ', ' + col.name + ': ' + cellData.value + '. Open details.');
            cell.dataset.row = ri;
            cell.dataset.col = ci;
            cell.addEventListener('click', () => showDetail(row, col.key, col.name, cell));
            cell.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    showDetail(row, col.key, col.name, cell);
                }
            });
            tr.appendChild(cell);
        });

        tbody.appendChild(tr);
    });
}

function buildLegend() {
    const legend = document.getElementById('legend');
    legend.innerHTML = '<strong>Emphasis:</strong>';
    EMPHASIS_ORDER.forEach(e => {
        const item = document.createElement('span');
        item.className = 'legend-item';
        item.innerHTML = '<span class="swatch emphasis-' + e + '"></span><span><b>' + e + '</b> ' +
                         data.emphasisLegend[e] + '</span>';
        legend.appendChild(item);
    });
}

// ---------------------------------------------------------------------------
// Detail panel
// ---------------------------------------------------------------------------
function fillPanel(row, colKey, colName) {
    const cellData = row.cells[colKey];
    document.getElementById('detail-row').textContent = row.name;
    document.getElementById('detail-column').textContent = colName;
    document.getElementById('detail-value').textContent = cellData.value;
    const badge = document.getElementById('detail-emphasis');
    badge.textContent = cellData.emphasis;
    badge.className = 'emph-badge emphasis-' + cellData.emphasis;
    document.getElementById('detail-description').textContent = cellData.description;
    document.getElementById('detail-example').textContent = cellData.example;
}

function openPanel() {
    const panel = document.getElementById('detail-panel');
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    document.getElementById('overlay').classList.add('open');
}

function showDetail(row, colKey, colName, cellEl) {
    lastCell = cellEl;
    fillPanel(row, colKey, colName);
    document.getElementById('predict-box').hidden = true;
    document.getElementById('predict-result').hidden = true;
    document.getElementById('detail-body').hidden = false;
    openPanel();
    document.getElementById('close-btn').focus();
}

// Random cell: open the panel with the explanation hidden until the learner
// predicts the emphasis. The table tints are hidden while they decide.
function showRandomCell() {
    const ri = Math.floor(Math.random() * data.rows.length);
    const ci = Math.floor(Math.random() * data.columns.length);
    const row = data.rows[ri];
    const col = data.columns[ci];
    const cellEl = document.querySelector('td.cell[data-row="' + ri + '"][data-col="' + ci + '"]');
    lastCell = cellEl;
    fillPanel(row, col.key, col.name);

    document.getElementById('matrix').classList.add('no-emphasis');   // no peeking
    document.getElementById('detail-body').hidden = true;
    document.getElementById('predict-result').hidden = true;
    const box = document.getElementById('predict-box');
    box.hidden = false;
    const opts = document.getElementById('predict-options');
    opts.innerHTML = '';
    EMPHASIS_ORDER.forEach(e => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = e;
        b.addEventListener('click', () => answerPrediction(e, row.cells[col.key].emphasis));
        opts.appendChild(b);
    });
    openPanel();
    opts.firstChild.focus();
}

function answerPrediction(guess, actual) {
    predictions.total += 1;
    const right = guess === actual;
    if (right) predictions.right += 1;
    const res = document.getElementById('predict-result');
    res.hidden = false;
    res.className = 'predict-result ' + (right ? 'right' : 'wrong');
    res.textContent = right
        ? 'Correct: this cell is "' + actual + '" (' + data.emphasisLegend[actual] + ').'
        : 'Not quite. You predicted "' + guess + '", but this cell is "' + actual + '" (' +
          data.emphasisLegend[actual] + '). Read the description to see why.';
    document.getElementById('predict-box').hidden = true;
    document.getElementById('detail-body').hidden = false;
    restoreTints();
    updateScore();
    document.getElementById('close-btn').focus();
}

function restoreTints() {
    const on = document.getElementById('emphasis-toggle').checked;
    document.getElementById('matrix').classList.toggle('no-emphasis', !on);
}

function closeDetail() {
    const panel = document.getElementById('detail-panel');
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    document.getElementById('overlay').classList.remove('open');
    restoreTints();
    if (lastCell) lastCell.focus();        // focus returns to the clicked cell
}

function updateScore() {
    document.getElementById('score').textContent = predictions.total
        ? 'Predictions: ' + predictions.right + ' of ' + predictions.total + ' correct'
        : '';
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------
function setupEventListeners() {
    document.getElementById('close-btn').addEventListener('click', closeDetail);
    document.getElementById('overlay').addEventListener('click', closeDetail);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeDetail();
    });
    document.getElementById('emphasis-toggle').addEventListener('change', e => {
        document.getElementById('matrix').classList.toggle('no-emphasis', !e.target.checked);
        document.getElementById('legend').classList.toggle('hidden-tints', !e.target.checked);
    });
    document.getElementById('random-btn').addEventListener('click', showRandomCell);
}

document.addEventListener('DOMContentLoaded', init);
