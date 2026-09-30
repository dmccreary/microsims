// Timeline Item and Date Explorer - vis-timeline 7.7.3
// CANVAS_HEIGHT: 650
// Learning objective (Apply / use): the learner uses the JSON event format to place events on
// a timeline and identifies how month numbering and group values change what is displayed.
//
// Data: data.json holds eight fictional course-schedule events in the timeline template's
// format (start_date {year, month?, day?}, text {headline, text}, group, notes).
// Conversion: new Date(year, month - 1, day) - JSON months run 1-12, JavaScript months 0-11.
// The "Show month numbering bug" checkbox rebuilds every item WITHOUT the "- 1".

const GROUP_CLASS = { 'Planning': 'planning', 'Teaching': 'teaching', 'Assessment': 'assessment' };
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
                'September', 'October', 'November', 'December'];
const DAY = 24 * 60 * 60 * 1000;

let timeline, dataset;
let events = [];            // the JSON events (month edits are written back here)
let groups = [];            // group names in first-seen order
let currentFilter = 'all';
let showBug = false;
let selectedId = 4;         // start with "Midterm MicroSim lab" selected
let editedId = null;        // event whose month the learner changed

// Scroll rule: wheel zoom and drag are off in the embedded page; the buttons navigate.
// Add ?enable-interaction=true to the URL to allow dragging and wheel zoom.
function isInteractionEnabled() {
    return new URLSearchParams(window.location.search).get('enable-interaction') === 'true';
}

// ---------- JSON event -> vis-timeline item ----------
function toDate(sd, bug) {
    const year = parseInt(sd.year, 10);
    let month = 0;                                   // missing month -> January
    if (sd.month) month = bug ? parseInt(sd.month, 10) : parseInt(sd.month, 10) - 1;
    const day = sd.day ? parseInt(sd.day, 10) : 1;   // missing day -> the 1st
    return new Date(year, month, day);
}

function toItem(ev, id) {
    const cls = GROUP_CLASS[ev.group] || 'planning';
    return {
        id: id,
        content: ev.text.headline,
        start: toDate(ev.start_date, showBug),
        title: ev.notes || ev.text.text,              // hover tooltip = notes
        className: cls + (id === editedId ? ' moved' : ''),
        category: ev.group,
        description: ev.text.text
    };
}

function allItems() {
    return events.map((ev, i) => toItem(ev, i));
}

function visibleItems() {
    const items = allItems();
    return currentFilter === 'all' ? items : items.filter(it => it.category === currentFilter);
}

// ---------- rendering ----------
function rebuild(keepWindow) {
    const win = timeline ? timeline.getWindow() : null;
    dataset.clear();                                 // filters clear and re-add matching items
    dataset.add(visibleItems());
    if (keepWindow && win) timeline.setWindow(win.start, win.end, { animation: false });
    if (selectedId !== null && dataset.get(selectedId)) timeline.setSelection([selectedId]);
    renderDetails();
    renderCaption();
}

function formatDate(sd, date) {
    if (!sd.month) return sd.year + ' (year only, placed at January 1)';
    const monthName = MONTHS[date.getMonth()];
    if (!sd.day) return monthName + ' ' + date.getFullYear() + ' (year and month, placed on the 1st)';
    return monthName + ' ' + date.getDate() + ', ' + date.getFullYear();
}

function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function jsonHtml(ev) {
    // pretty-print the event with the month and group values highlighted
    const sd = ev.start_date;
    const parts = ['"year": <span class="s">"' + sd.year + '"</span>'];
    if (sd.month) parts.push('<span class="hl">"month": <span class="s">"' + sd.month + '"</span></span>');
    if (sd.day) parts.push('"day": <span class="s">"' + sd.day + '"</span>');
    return '<pre class="json">{\n' +
        '  <span class="k">"start_date"</span>: { ' + parts.join(', ') + ' },\n' +
        '  <span class="k">"text"</span>: { "headline": <span class="s">"' + escapeHtml(ev.text.headline) + '"</span>, ... },\n' +
        '  <span class="hl"><span class="k">"group"</span>: <span class="s">"' + escapeHtml(ev.group) + '"</span></span>,\n' +
        '  <span class="k">"notes"</span>: <span class="s">"..."</span>\n}</pre>';
}

function renderDetails() {
    const card = document.getElementById('eventCard');
    const jcard = document.getElementById('jsonCard');
    if (selectedId === null) {
        card.innerHTML = '<div class="event-title">Click an event</div>Its headline, formatted date and description appear here. Hover an event to see its notes.';
        jcard.innerHTML = '<div class="hint">The event\'s JSON appears here.</div>';
        return;
    }
    const ev = events[selectedId];
    const date = toDate(ev.start_date, showBug);
    const cls = GROUP_CLASS[ev.group];
    card.innerHTML = '<div class="event-title">' + escapeHtml(ev.text.headline) + '</div>' +
        '<div class="event-date">' + formatDate(ev.start_date, date) + '</div>' +
        '<div>' + escapeHtml(ev.text.text) + '</div>' +
        '<div style="margin-top:4px">Group: <span class="badge ' + cls + '">' + escapeHtml(ev.group) + '</span></div>';
    const sd = ev.start_date;
    const m = sd.month ? parseInt(sd.month, 10) : null;
    let conv;
    if (m === null) conv = 'new Date(' + sd.year + ', 0, 1)  // no month: January';
    else if (showBug) conv = 'new Date(' + sd.year + ', ' + m + ', ' + (sd.day || 1) + ')  // bug: ' + MONTHS[date.getMonth()];
    else conv = 'new Date(' + sd.year + ', ' + (m - 1) + ', ' + (sd.day || 1) + ')  // ' + MONTHS[m - 1];
    jcard.innerHTML = jsonHtml(ev) + '<div class="conv' + (showBug && m !== null ? ' bug' : '') + '">' + conv + '</div>';
    document.getElementById('monthInput').value = sd.month || '';
    document.getElementById('monthLabel').textContent = 'Event month (1-12):';
}

function renderCaption() {
    const cap = document.getElementById('caption');
    if (showBug) {
        cap.className = 'bug';
        cap.innerHTML = '<b>Bug on:</b> the month goes into <code>new Date()</code> without the \u2212 1, so dated ' +
            'events land one month late ("3" shows as April; "12" rolls into next January). Year-only events do not move.';
    } else {
        cap.className = '';
        cap.innerHTML = 'JSON months run 1-12 but <code>new Date()</code> counts 0-11, so the script subtracts 1: ' +
            '<code>"month": "3"</code> \u2192 <code>new Date(2026, 2, 16)</code> = March 16. ' +
            (currentFilter === 'all' ? 'Colors and filters come from each <code>group</code> value.'
                : 'Showing only events whose group is exactly "' + currentFilter + '".');
    }
}

// ---------- window helpers ----------
function setWindowWithPadding(items) {
    if (!items.length) return;
    const ts = items.map(i => i.start.getTime());
    const span = Math.max(Math.max(...ts) - Math.min(...ts), 30 * DAY);
    // labels are centered on their dates: leave half a label (~100 px) on each side
    const W = document.getElementById('timeline').clientWidth || 600;
    const h = Math.min(100, W / 2 - 40);
    const pad = h * span / (W - 2 * h) + 10 * DAY;
    timeline.setWindow(new Date(Math.min(...ts) - pad), new Date(Math.max(...ts) + pad), { animation: false });
}

function panBy(frac) {
    const w = timeline.getWindow();
    const d = (w.end - w.start) * frac;
    timeline.setWindow(new Date(w.start.getTime() + d), new Date(w.end.getTime() + d));
}

function zoomBy(factor) {
    const w = timeline.getWindow();
    const c = (w.start.getTime() + w.end.getTime()) / 2;
    const half = (w.end - w.start) * factor / 2;
    timeline.setWindow(new Date(c - half), new Date(c + half));
}

// ---------- controls ----------
function setFilter(group) {
    currentFilter = group;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.group === group));
    if (selectedId !== null && group !== 'all' && events[selectedId].group !== group) selectedId = null;
    rebuild(false);
    setWindowWithPadding(visibleItems());
}

function updateMonth() {
    const msg = document.getElementById('monthMsg');
    msg.style.color = '#b91c1c';
    if (selectedId === null) { msg.textContent = 'Click an event first.'; return; }
    const raw = document.getElementById('monthInput').value.trim();
    const m = Number(raw);
    if (!/^\d{1,2}$/.test(raw) || m < 1 || m > 12) {
        msg.textContent = 'Enter a whole number from 1 to 12.';
        return;
    }
    msg.textContent = '';
    const ev = events[selectedId];
    const before = toDate(ev.start_date, showBug);
    ev.start_date.month = String(m);                 // write the edit back into the JSON event
    editedId = selectedId;
    rebuild(true);
    const after = toDate(ev.start_date, showBug);
    const moved = Math.round((after - before) / DAY);
    msg.style.color = '#14532d';
    msg.textContent = moved === 0 ? 'Same date.' : 'Moved ' + Math.abs(moved) + ' days ' + (moved > 0 ? 'later.' : 'earlier.');
}

// ---------- setup ----------
function init(data) {
    events = data.events;
    events.forEach(ev => { if (!groups.includes(ev.group)) groups.push(ev.group); });

    // filter buttons: "All" plus one per group value
    const row = document.getElementById('filterGroup');
    const mk = (label, group, cls) => {
        const b = document.createElement('button');
        b.textContent = label;
        b.className = 'filter-btn ' + cls;
        b.dataset.group = group;
        b.addEventListener('click', () => setFilter(group));
        row.appendChild(b);
    };
    mk('All', 'all', 'all active');
    groups.forEach(g => mk(g, g, GROUP_CLASS[g] || ''));

    dataset = new vis.DataSet(allItems());
    const interaction = isInteractionEnabled();
    const container = document.getElementById('timeline');
    timeline = new vis.Timeline(container, dataset, {
        width: '100%',
        height: '100%',
        margin: { item: { horizontal: 10, vertical: 8 }, axis: 20 },
        orientation: 'top',
        stack: true,
        selectable: true,
        showCurrentTime: false,
        align: 'center',
        moveable: interaction,
        zoomable: interaction,
        zoomMin: 20 * DAY,
        zoomMax: 6 * 365 * DAY,
        min: new Date(2023, 6, 1),
        max: new Date(2028, 6, 1),
        tooltip: { followMouse: true, overflowMethod: 'cap' }
    });

    // vertical wheel scrolls the page, never the timeline (capture phase runs before vis)
    container.addEventListener('wheel', e => {
        if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) e.stopImmediatePropagation();
    }, true);

    timeline.on('select', props => {
        if (props.items.length > 0) {
            selectedId = props.items[0];
            document.getElementById('monthMsg').textContent = '';
            renderDetails();
        }
    });

    document.getElementById('panLeftBtn').addEventListener('click', () => panBy(-0.3));
    document.getElementById('panRightBtn').addEventListener('click', () => panBy(0.3));
    document.getElementById('zoomInBtn').addEventListener('click', () => zoomBy(0.5));
    document.getElementById('zoomOutBtn').addEventListener('click', () => zoomBy(2));
    document.getElementById('fitBtn').addEventListener('click', () => setWindowWithPadding(visibleItems()));
    document.getElementById('bugToggle').addEventListener('change', e => {
        showBug = e.target.checked;
        rebuild(true);
    });
    document.getElementById('updateBtn').addEventListener('click', updateMonth);
    document.getElementById('monthInput').addEventListener('keydown', e => { if (e.key === 'Enter') updateMonth(); });

    // width is 100%; vis-timeline redraws on resize, and we re-apply the window
    window.addEventListener('resize', () => timeline.redraw());

    rebuild(false);
    setWindowWithPadding(allItems());
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(init)
        .catch(err => {
            document.getElementById('eventCard').innerHTML = '<b>Could not load data.json</b> (' + err.message +
                '). Open this page through a web server, for example <code>mkdocs serve</code>.';
        });
});
