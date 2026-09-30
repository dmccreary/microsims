// Failure Boundary Explorer - vis-network
// CANVAS_HEIGHT: 600
// Learning objective (Analyze / differentiate): the learner differentiates the one failure
// that can lose data from the failures that only degrade freshness or speed, by locating
// each failing component relative to the durability boundary at Kafka.
// Layout: toolbar + body. The body is network | panel at 900px and wider, and network over
// panel below that (see style.css). Physics is off and every node has a fixed position.
// Content follows Chapters 20-21: a statement already in Kafka is durable, so failures after
// the line degrade freshness or speed and heal on recovery; only an unreachable Kafka can
// lose data. Status labels follow the repository TODO dated 2026-09-26 as quoted in the book.

// ===========================================
// COLORS (color-blind safe: position is also shown by the red line and by text)
// ===========================================
const COLORS = {
    before: { background: '#FCE3C0', border: '#B8660B' },   // not yet durable
    kafka:  { background: '#F9D3D3', border: '#B00020' },   // the durable log itself
    after:  { background: '#D6E9F8', border: '#1F5F99' },   // rebuildable from the log
    read:   { background: '#E8E1F3', border: '#6A4C93' },   // read path
    failed: { background: '#D0D0D0', border: '#555555' }
};

// ===========================================
// COMPONENTS
// status: 'built' (code exists and has run) or 'designed' (in the design, no code yet)
// verdict: 'lost' | 'risk' | 'safe'
// ===========================================
const COMPONENTS = [
    {
        id: 'lrp', label: 'Learning\nRecord\nProvider', name: 'Learning Record Provider',
        zone: 'before', status: 'designed',
        statusText: 'Partly built: the statement builder (lrs-xapi.js) exists, but no emitter POSTs statements to the gateway yet.',
        role: 'The MicroSim or textbook page that builds xAPI statements and sends them to the gateway.',
        detected: 'The LRS cannot see one producer fail. At most, operators notice less traffic arriving at the gateway.',
        meanwhile: 'Everything downstream keeps running on what already arrived. Statements the page has built but not yet delivered exist only in the browser.',
        verdict: 'risk',
        lost: 'Only what the page never delivered. The LRS cannot rebuild a statement it never received, which is why this node sits before the line.'
    },
    {
        id: 'gw', label: 'Ingestion\nGateway', name: 'Ingestion Gateway',
        zone: 'before', status: 'built',
        statusText: 'Built: a FastAPI service with a POST route and a /health route, verified against a live Redpanda.',
        role: 'The front door. It authenticates, validates, assigns ids, places statements on Kafka and replies only after Kafka acknowledges.',
        detected: 'Its /health check fails and producers get connection errors instead of a 200.',
        meanwhile: 'Nothing new enters the log. Kafka and every consumer keep working on what is already stored, and producers must hold statements and retry.',
        verdict: 'risk',
        lost: 'Not by the gateway itself: it answers 200 only after Kafka has the statement, so anything unacknowledged is still with the producer. Data is lost only if the producer gives up.'
    },
    {
        id: 'kafka', label: 'Kafka', name: 'Kafka', longName: 'Kafka (Redpanda in development)',
        zone: 'kafka', status: 'built',
        statusText: 'Built as infrastructure: Redpanda runs in development (Kafka in production), and the topic bootstrap is built.',
        role: 'The durable, ordered event stream. Once a statement is here it is safe, and every later component can replay it.',
        detected: 'The gateway cannot produce to the broker. It buffers briefly, then answers every request with 503, and a person is paged at once.',
        meanwhile: 'Nothing new becomes durable. Components after the line keep serving what is already in the log, but stop advancing.',
        verdict: 'lost',
        lost: 'Yes. This is the one failure that can lose data: a statement that never reached durable storage cannot be rebuilt. It survives only if the producer keeps it and retries after the 503.'
    },
    {
        id: 'proc', label: 'Processor', name: 'Processor',
        zone: 'after', status: 'designed',
        statusText: 'Designed, not built. The TODO file calls it the critical path.',
        role: 'Workers that read the stream, pseudonymize and enrich statements, and write them to ClickHouse, committing their Kafka offset only after the write.',
        detected: 'Consumer lag on the raw topic grows: the log keeps filling but nothing reads it.',
        meanwhile: 'The gateway keeps accepting statements, which wait in Kafka. Dashboards go stale.',
        verdict: 'safe',
        lost: 'No. On recovery the processor resumes from its last committed offset, and idempotent ingest absorbs any redelivered statements. (The raw topic keeps 7 days in the design.)'
    },
    {
        id: 'ch', label: 'ClickHouse', name: 'ClickHouse',
        zone: 'after', status: 'designed',
        statusText: 'Partly built: infrastructure and DDL files exist, but applying the DDL is manual and no worker writes to it yet.',
        role: 'The column store and system of record: every statement at full fidelity, ordered by district, learner and time.',
        detected: 'Processor writes fail and health checks report it down.',
        meanwhile: 'The processor stops committing offsets, so statements wait safely in Kafka. Queries on the log fail or go stale; the gateway is unaffected because it imports no ClickHouse client.',
        verdict: 'safe',
        lost: 'No. The processor replays from Kafka when ClickHouse returns. The design’s recovery objectives for it (one hour and four hours) are targets, not tested figures.'
    },
    {
        id: 'sum', label: 'Summarizer', name: 'Summarizer',
        zone: 'after', status: 'designed',
        statusText: 'Designed, not built.',
        role: 'Copies compact summaries from ClickHouse into the graph about once a minute, writing absolute values rather than increments.',
        detected: 'Summary vertices stop updating; their age since last update grows.',
        meanwhile: 'The log keeps filling. The graph and the dashboards show summaries as of the last run.',
        verdict: 'safe',
        lost: 'No. It recomputes absolutes from the log on recovery ("recompute absolutes, never increment"), so nothing is double counted or missed.'
    },
    {
        id: 'neo', label: 'Neo4j', name: 'Neo4j',
        zone: 'after', status: 'designed',
        statusText: 'Partly built: runs with a seeded demo graph and a constraint file; the summarizer that would feed it is designed, not built.',
        role: 'The graph of structure and summary vertices that dashboards read. A projection of the log, never the source of truth.',
        detected: 'Summarizer writes and dashboard queries fail; health checks report it down.',
        meanwhile: 'Ingestion and the log are untouched. Dashboards that read summaries are unavailable or stale.',
        verdict: 'safe',
        lost: 'No. Every summary vertex can be rebuilt by replaying the log in ClickHouse.'
    },
    {
        id: 'redis', label: 'Redis cache', name: 'Redis cache',
        zone: 'read', status: 'designed',
        statusText: 'Partly built: started as a backing service by make stores; the read path that would use it is designed, not built.',
        role: 'A cache on the read path, so repeated dashboard queries do not hit the databases every time.',
        detected: 'Cache connections fail and dashboard latency rises.',
        meanwhile: 'Reads go straight to Neo4j and ClickHouse. Dashboards are slower but correct.',
        verdict: 'safe',
        lost: 'No. A cache holds only copies of data that lives elsewhere.'
    }
];
// Readers at the end of the read path: shown for context, not a failure option
const READERS = {
    id: 'dash', label: 'Dashboards', name: 'Dashboards (readers)', zone: 'read',
    role: 'Teacher, author and administrator views that read summaries through the cache. Today they are prototype Dash apps over a seeded graph.'
};

const EDGES = [
    { from: 'lrp', to: 'gw' },
    { from: 'gw', to: 'kafka' },
    { from: 'kafka', to: 'proc' },
    { from: 'proc', to: 'ch' },
    { from: 'ch', to: 'sum' },
    { from: 'sum', to: 'neo' },
    { from: 'neo', to: 'redis', dashes: true, read: true },
    { from: 'redis', to: 'dash', dashes: true, read: true }
];

// Two fixed layouts. Wide: the seven write-path nodes in one row, left to right, with the
// read path below Neo4j. Narrow (network under 560px wide): the same order as a two-row
// snake so labels stay legible; the boundary becomes an L around the three nodes before it.
const LAYOUTS = {
    wide: {
        pos: { lrp: [-324, 0], gw: [-216, 0], kafka: [-108, 0], proc: [0, 0], ch: [108, 0],
               sum: [216, 0], neo: [324, 0], redis: [324, 100], dash: [180, 100] },
        world: { minX: -375, maxX: 372, minY: -118, maxY: 125 },
        boundary: [[-54, -78], [-54, 128]],
        label: [-54, -88], sideY: -62
    },
    narrow: {
        pos: { lrp: [-170, -40], gw: [-60, -40], kafka: [55, -40], proc: [170, -40],
               ch: [170, 60], sum: [55, 60], neo: [-60, 60], redis: [-170, 60], dash: [-170, 140] },
        world: { minX: -225, maxX: 222, minY: -122, maxY: 162 },
        boundary: [[112, -80], [112, 12], [-228, 12]],
        label: [-5, -92], sideY: null
    }
};
let layoutName = 'wide';

let nodes, edges, network;
let failedId = null;
let shownId = null;
const tried = new Set();   // components the learner has failed at least once

function byId(id) { return COMPONENTS.find(c => c.id === id); }

function isInIframe() {
    try { return window.self !== window.top; } catch (e) { return true; }
}

function posOf(id) { return LAYOUTS[layoutName].pos[id]; }

function nodeStyle(c, failed) {
    const col = failed ? COLORS.failed : COLORS[c.zone];
    const [x, y] = posOf(c.id);
    return {
        id: c.id,
        label: failed ? c.label + '\n(failed)' : c.label,
        x: x, y: y,
        color: { background: col.background, border: col.border,
                 highlight: { background: col.background, border: 'black' },
                 hover: { background: col.background, border: 'black' } },
        font: { color: failed ? '#333333' : '#1a1a1a', size: 15, face: 'Arial' },
        borderWidth: failed ? 3 : 2,
        // dashed border = designed, not built
        shapeProperties: { borderDashes: c.status === 'designed' ? [5, 4] : false },
        opacity: failed ? 0.8 : 1
    };
}

function readerNode() {
    const [x, y] = posOf(READERS.id);
    return {
        id: READERS.id, label: READERS.label, x: x, y: y,
        shape: 'box', color: { background: 'white', border: '#6A4C93',
                               highlight: { background: 'white', border: 'black' },
                               hover: { background: 'white', border: 'black' } },
        font: { size: 15, color: '#1a1a1a' }, borderWidth: 1,
        shapeProperties: { borderDashes: [2, 3] }
    };
}

function chooseLayout() {
    const w = document.getElementById('network').clientWidth || 700;
    return w < 560 ? 'narrow' : 'wide';
}

function buildNetwork() {
    layoutName = chooseLayout();
    const nodeList = COMPONENTS.map(c => nodeStyle(c, false));
    nodeList.push(readerNode());
    const edgeList = EDGES.map((e, i) => ({
        id: 'e' + i, from: e.from, to: e.to,
        dashes: !!e.dashes,
        color: { color: e.read ? '#6A4C93' : '#333333', hover: 'black', highlight: 'black' },
        smooth: false,
        width: 2
    }));
    nodes = new vis.DataSet(nodeList);
    edges = new vis.DataSet(edgeList);

    const mouseNav = !isInIframe();
    const options = {
        layout: { improvedLayout: false },
        physics: { enabled: false },
        interaction: {
            dragNodes: false, dragView: mouseNav, zoomView: mouseNav,
            selectConnectedEdges: false, hover: true,
            navigationButtons: false, keyboard: false
        },
        nodes: { shape: 'box', margin: { top: 7, bottom: 7, left: 8, right: 8 },
                 widthConstraint: { maximum: 110 } },
        edges: { arrows: { to: { enabled: true, scaleFactor: 0.8 } } }
    };
    network = new vis.Network(document.getElementById('network'), { nodes, edges }, options);

    network.on('afterDrawing', drawBoundary);
    network.on('click', params => {
        if (params.nodes.length) showNode(params.nodes[0]);
    });
    network.on('hoverNode', () => { document.getElementById('network').style.cursor = 'pointer'; });
    network.on('blurNode', () => { document.getElementById('network').style.cursor = 'default'; });
    // vis-network auto-centers on its first draw, so fit after that draw as well
    network.once('afterDrawing', fitView);
    fitView();
}

// Switch between the one-row and the two-row layout when the container crosses 560px
function applyLayoutIfChanged() {
    const want = chooseLayout();
    if (want === layoutName) return;
    layoutName = want;
    const upd = COMPONENTS.map(c => { const [x, y] = posOf(c.id); return { id: c.id, x: x, y: y }; });
    const [dx, dy] = posOf(READERS.id);
    upd.push({ id: READERS.id, x: dx, y: dy });
    nodes.update(upd);
}

// The dashed red durability boundary and its label, drawn in network coordinates
function drawBoundary(ctx) {
    const L = LAYOUTS[layoutName];
    ctx.save();
    ctx.strokeStyle = '#B00020';
    ctx.lineWidth = 3;
    ctx.setLineDash([9, 7]);
    ctx.beginPath();
    L.boundary.forEach(([x, y], i) => { if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); });
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#B00020';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Only failures before this line can lose data', L.label[0], L.label[1]);
    const lx = L.boundary[0][0];
    ctx.font = '14px Arial';
    if (L.sideY !== null) {
        ctx.fillStyle = '#6b3d00';
        ctx.textAlign = 'right';
        ctx.fillText('\u2190 not yet durable', lx - 10, L.sideY);
        ctx.fillStyle = '#1F4F7A';
        ctx.textAlign = 'left';
        ctx.fillText('durable in the log, rebuildable \u2192', lx + 10, L.sideY);
    } else {
        ctx.fillStyle = '#6b3d00';
        ctx.textAlign = 'left';
        ctx.fillText('\u2196 not yet durable', -225, 30);
        ctx.fillStyle = '#1F4F7A';
        ctx.textAlign = 'right';
        ctx.fillText('rebuildable from the log', 222, 105);
    }
    ctx.restore();
}

// Fit the layout's fixed world rectangle into the container (deterministic, includes labels)
function fitView() {
    const el = document.getElementById('network');
    const w = el.clientWidth, h = el.clientHeight;
    if (!w || !h) return;
    const W = LAYOUTS[layoutName].world;
    const bw = W.maxX - W.minX, bh = W.maxY - W.minY;
    const scale = Math.min(w / bw, h / bh) * 0.98;
    network.moveTo({
        position: { x: (W.minX + W.maxX) / 2, y: (W.minY + W.maxY) / 2 },
        scale: scale, animation: false
    });
}

// ===========================================
// PANEL
// ===========================================
const VERDICT = {
    lost: { cls: 'v-lost', text: 'Data can be lost' },
    risk: { cls: 'v-risk', text: 'Before the line: at risk only if the producer gives up' },
    safe: { cls: 'v-safe', text: 'No data lost: freshness or speed degrades' }
};

function statusLine(c) {
    return `<p class="status"><span class="lbl">Status:</span> ${c.statusText}</p>`;
}

function defaultPanel() {
    const p = document.getElementById('panel');
    p.classList.remove('danger');
    p.innerHTML =
        '<h3>Where can a failure lose data?</h3>' +
        '<p class="hint">Pick a component in <b>Fail this component</b> to break it, or click any box ' +
        'to read its role. Before you break one, predict: will data be lost, or only slowed down?</p>' +
        '<div class="grid">' +
        '<div class="legend-row"><span class="sw" style="background:#FCE3C0;border-color:#B8660B"></span>Before the line: not yet durable</div>' +
        '<div class="legend-row"><span class="sw" style="background:#F9D3D3;border-color:#B00020"></span>Kafka: the durable log</div>' +
        '<div class="legend-row"><span class="sw" style="background:#D6E9F8;border-color:#1F5F99"></span>After the line: rebuildable</div>' +
        '<div class="legend-row"><span class="sw" style="background:#E8E1F3;border-color:#6A4C93"></span>Read path (cache)</div>' +
        '<div class="legend-row"><span class="sw" style="background:white"></span>Solid border: built</div>' +
        '<div class="legend-row"><span class="sw dashed" style="background:white"></span>Dashed border: designed or partly built</div>' +
        '</div>' + findingsHtml();
}

// A running sort of the failures the learner has tried, by what they cost
function findingsHtml() {
    if (tried.size === 0) return '';
    const groups = { lost: [], risk: [], safe: [] };
    COMPONENTS.forEach(c => { if (tried.has(c.id)) groups[c.verdict].push(c.name); });
    const part = (k, title) => groups[k].length ? `<div><span class="lbl">${title}:</span> ${groups[k].join(', ')}</div>` : '';
    return `<p class="hint" style="margin-top:6px"><span class="lbl">Your findings (${tried.size} of ${COMPONENTS.length} tried)</span></p>` +
        part('lost', 'Can lose data') + part('risk', 'Before the line, safe if the producer retries') +
        part('safe', 'Only freshness or speed');
}

function failurePanel(c) {
    const p = document.getElementById('panel');
    const v = VERDICT[c.verdict];
    p.classList.toggle('danger', c.id === 'kafka');
    let html = `<h3>${c.longName || c.name} has failed</h3>`;
    html += `<span class="verdict ${v.cls}">${v.text}</span>`;
    html += `<p><span class="lbl">Data lost?</span> ${c.lost}</p>`;
    html += '<div class="grid">';
    html += `<p><span class="lbl">Detected:</span> ${c.detected}</p>`;
    html += `<p><span class="lbl">Meanwhile:</span> ${c.meanwhile}</p>`;
    html += '</div>';
    if (c.id === 'kafka') {
        html += '<pre>HTTP/1.1 503 Service Unavailable\nRetry-After: 5</pre>';
    }
    html += statusLine(c);
    p.innerHTML = html;
}

function rolePanel(id) {
    const p = document.getElementById('panel');
    if (id === READERS.id) {
        p.classList.remove('danger');
        p.innerHTML = `<h3>${READERS.name}</h3><p>${READERS.role}</p>` +
            '<p class="hint">Readers are not a failure option here. When anything after the line fails, ' +
            'they see stale or slower data, not lost data.</p>';
        return;
    }
    const c = byId(id);
    if (id === failedId) { failurePanel(c); return; }
    p.classList.remove('danger');
    const side = c.zone === 'before' ? 'before the durability line'
               : c.zone === 'kafka' ? 'on the durability line: it is the durable log'
               : c.zone === 'read' ? 'on the read path, after the line'
               : 'after the durability line';
    p.innerHTML = `<h3>${c.name}</h3>` +
        `<p><span class="lbl">Role:</span> ${c.role}</p>` +
        `<p><span class="lbl">Position:</span> ${side}.</p>` +
        statusLine(c) +
        '<p class="hint">Choose it in <b>Fail this component</b> to see what happens when it fails.</p>';
}

function showNode(id) {
    shownId = id;
    rolePanel(id);
}

// ===========================================
// FAIL / RESTORE
// ===========================================
function setFailed(id) {
    if (failedId) nodes.update(nodeStyle(byId(failedId), false));
    failedId = id || null;
    if (failedId) {
        tried.add(failedId);
        nodes.update(nodeStyle(byId(failedId), true));
        failurePanel(byId(failedId));
    } else {
        defaultPanel();
    }
}

function restoreAll() {
    document.getElementById('fail-select').value = '';
    setFailed(null);
}

document.addEventListener('DOMContentLoaded', function () {
    const sel = document.getElementById('fail-select');
    sel.appendChild(new Option('(none)', ''));
    COMPONENTS.forEach(c => sel.appendChild(new Option(c.name, c.id)));
    sel.addEventListener('change', () => setFailed(sel.value));
    document.getElementById('restore-btn').addEventListener('click', restoreAll);
    buildNetwork();
    defaultPanel();
    // re-fit to the container on every resize (layout may switch between side and below)
    window.addEventListener('resize', () => {
        applyLayoutIfChanged();
        network.redraw();
        fitView();
    });
});
