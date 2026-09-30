// Star Rating Comparison Table - plain HTML/CSS table with a short sort script
// CANVAS_HEIGHT: 500
// The rows are written in main.html. This script draws the star groups from each
// cell's data-rating, computes the weighted score from the two weight sliders,
// sorts the rows when sorting is on, and positions the row tooltips.

const tbody = document.getElementById('table-body');
const originalRows = Array.from(tbody.querySelectorAll('tr'));
let sortOn = false;

// ---------------------------------------------------------------------------
// Star cells: "stars stars-N" span of filled stars plus a "stars-empty" span
// ---------------------------------------------------------------------------
function drawStars() {
    document.querySelectorAll('td.rating').forEach(td => {
        const n = parseInt(td.dataset.rating, 10);
        td.innerHTML =
            '<span class="stars stars-' + n + '">' + '★'.repeat(n) + '</span>' +
            '<span class="stars-empty">' + '★'.repeat(5 - n) + '</span>' +
            '<span class="num">' + n + '</span>';
        td.setAttribute('aria-label', n + ' out of 5 stars');
    });
}

// ---------------------------------------------------------------------------
// Weighted score = (wE * ease + wI * interactivity) / (wE + wI), on the 1-5 scale
// ---------------------------------------------------------------------------
function weights() {
    return {
        ease: parseInt(document.getElementById('w-ease').value, 10),
        inter: parseInt(document.getElementById('w-inter').value, 10)
    };
}

function scoreOf(row) {
    const w = weights();
    const total = w.ease + w.inter;
    if (total === 0) return null;
    return (w.ease * parseFloat(row.dataset.ease) + w.inter * parseFloat(row.dataset.inter)) / total;
}

function updateScores() {
    const w = weights();
    document.getElementById('w-ease-val').textContent = w.ease;
    document.getElementById('w-inter-val').textContent = w.inter;

    let best = -Infinity;
    originalRows.forEach(row => {
        const s = scoreOf(row);
        row.dataset.score = s === null ? '' : s;
        row.querySelector('td.score').textContent = s === null ? '—' : s.toFixed(2);
        if (s !== null && s > best) best = s;
    });
    originalRows.forEach(row => {
        const s = row.dataset.score === '' ? null : parseFloat(row.dataset.score);
        row.classList.toggle('top-score', s !== null && Math.abs(s - best) < 1e-9);
    });
    if (sortOn) sortRows();
}

// ---------------------------------------------------------------------------
// The short sort function: highest weighted score first, ties keep table order
// ---------------------------------------------------------------------------
function sortRows() {
    const rows = originalRows.slice().sort((a, b) => {
        const sa = a.dataset.score === '' ? -1 : parseFloat(a.dataset.score);
        const sb = b.dataset.score === '' ? -1 : parseFloat(b.dataset.score);
        return (sb - sa) || (a.dataset.order - b.dataset.order);
    });
    rows.forEach(r => tbody.appendChild(r));
}

function resetOrder() {
    sortOn = false;
    const btn = document.getElementById('sort-btn');
    btn.setAttribute('aria-pressed', 'false');
    originalRows.forEach(r => tbody.appendChild(r));
}

// ---------------------------------------------------------------------------
// Row tooltips: above the row, except the first row, whose tooltip goes below
// so the header does not hide it
// ---------------------------------------------------------------------------
const tip = document.getElementById('row-tooltip');

function showTip(row) {
    tip.textContent = row.dataset.tooltip;
    tip.classList.add('visible');
    const wrap = document.getElementById('table-wrap').getBoundingClientRect();
    const r = row.getBoundingClientRect();
    const tw = tip.offsetWidth;
    const th = tip.offsetHeight;
    // center on the visible part of the row
    const visLeft = Math.max(r.left, wrap.left);
    const visRight = Math.min(r.right, wrap.right);
    let left = (visLeft + visRight) / 2 - tw / 2 + window.scrollX;
    left = Math.max(4, Math.min(left, document.documentElement.clientWidth - tw - 4));
    const isFirst = row === tbody.firstElementChild;
    const top = isFirst ? r.bottom + 6 + window.scrollY : r.top - th - 6 + window.scrollY;
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
}

function hideTip() {
    tip.classList.remove('visible');
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------
drawStars();
updateScores();

document.getElementById('w-ease').addEventListener('input', updateScores);
document.getElementById('w-inter').addEventListener('input', updateScores);

document.getElementById('sort-btn').addEventListener('click', () => {
    sortOn = true;
    document.getElementById('sort-btn').setAttribute('aria-pressed', 'true');
    sortRows();
});

document.getElementById('reset-btn').addEventListener('click', resetOrder);

document.getElementById('numeric-check').addEventListener('change', e => {
    document.getElementById('comparison-table').classList.toggle('show-numbers', e.target.checked);
});

originalRows.forEach(row => {
    row.addEventListener('mouseenter', () => showTip(row));
    row.addEventListener('mouseleave', hideTip);
    row.addEventListener('focus', () => showTip(row));
    row.addEventListener('blur', hideTip);
});

document.getElementById('table-wrap').addEventListener('scroll', hideTip);
