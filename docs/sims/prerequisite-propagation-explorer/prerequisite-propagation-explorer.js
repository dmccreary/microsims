// Prerequisite Propagation Explorer - vis-network MicroSim
// CANVAS_HEIGHT: 640
// Seven illustrative concepts from a learning graph. Edges point from each concept to its
// prerequisites ("depends on"), the same direction as the learning graph's DEPENDS_ON edges.
// The tool only READS mastery estimates and walks the edges upstream, like the LRS design's
// Prerequisite Gap Analysis report. It never propagates probability along an edge.
// Node fill uses the ColorBrewer RdYlBu diverging scale (color-blind safe): red = 0.0,
// yellow = 0.5, blue = 1.0, and every label also prints the number.

const CONCEPTS = [
    { id: 'speed', label: 'Speed Problems', estimate: 0.52, level: 0 },
    { id: 'rates', label: 'Rates', estimate: 0.58, level: 1 },
    { id: 'ratios', label: 'Ratios', estimate: 0.42, level: 2 },
    { id: 'percent', label: 'Percentages', estimate: 0.91, level: 2 },
    { id: 'fractions', label: 'Fractions', estimate: 0.96, level: 3 },
    { id: 'division', label: 'Division', estimate: 0.97, level: 4 },
    { id: 'multiplication', label: 'Multiplication', estimate: 0.99, level: 5 }
];

// from = concept, to = its prerequisite
const DEPENDS_ON = [
    { from: 'speed', to: 'rates' },
    { from: 'rates', to: 'ratios' },
    { from: 'ratios', to: 'fractions' },
    { from: 'percent', to: 'fractions' },
    { from: 'fractions', to: 'division' },
    { from: 'division', to: 'multiplication' }
];

const DEFAULT_SELECTED = 'rates';
const DEFAULT_THRESHOLD = 0.95;
const GAP_COLOR = '#5b2a86';

let estimates = {};
let threshold = DEFAULT_THRESHOLD;
let selectedId = DEFAULT_SELECTED;
let gapResult = null;       // result of the last "Find first gap" for the selected node
let nodes, edges, network;

// ---------- helpers ----------
function conceptById(id) { return CONCEPTS.find(c => c.id === id); }
function labelOf(id) { return conceptById(id).label; }
function isMastered(id) { return estimates[id] >= threshold - 1e-9; }
function prereqsOf(id) { return DEPENDS_ON.filter(e => e.from === id).map(e => e.to); }
function fmt(v) { return v.toFixed(2); }
function possessive(name) { return name.endsWith('s') ? name + "'" : name + "'s"; }

function log(msg) { console.log('[prerequisite-propagation-explorer] ' + msg); }

// RdYlBu interpolation for an estimate in [0, 1]
const SCALE = [[215, 48, 39], [252, 141, 89], [254, 224, 144], [145, 191, 219], [69, 117, 180]];
function fillFor(v) {
    const t = Math.max(0, Math.min(1, v)) * (SCALE.length - 1);
    const i = Math.min(SCALE.length - 2, Math.floor(t));
    const f = t - i;
    const c = SCALE[i].map((a, k) => Math.round(a + (SCALE[i + 1][k] - a) * f));
    return 'rgb(' + c.join(',') + ')';
}
function fontFor(v) {
    // pick black or white text, whichever contrasts more with the fill (WCAG relative luminance)
    const rgb = fillFor(v).match(/\d+/g).map(Number).map(c => {
        c /= 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    const L = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    return (1.05 / (L + 0.05)) > ((L + 0.05) / 0.05) ? '#ffffff' : '#111111';
}

// All concepts reachable upstream (following depends-on edges), with their longest distance
function upstream(id) {
    const depth = {};
    const parent = {};
    function visit(node, d) {
        for (const p of prereqsOf(node)) {
            if (depth[p] === undefined || d + 1 > depth[p]) {
                depth[p] = d + 1;
                parent[p] = node;
                visit(p, d + 1);
            }
        }
    }
    visit(id, 0);
    return { depth, parent };
}

// "First gap": the deepest unmastered prerequisite reachable upstream from the selection
function findFirstGap(id) {
    const { depth, parent } = upstream(id);
    const unmastered = Object.keys(depth).filter(p => !isMastered(p));
    if (unmastered.length === 0) return { gaps: [], path: [], unmastered };
    const maxDepth = Math.max(...unmastered.map(p => depth[p]));
    const gaps = unmastered.filter(p => depth[p] === maxDepth);
    // path of edges from the selection up to the (first) gap
    const path = [];
    let cur = gaps[0];
    while (cur !== id && parent[cur] !== undefined) {
        path.unshift({ from: parent[cur], to: cur });
        cur = parent[cur];
    }
    return { gaps, path, unmastered, depth };
}

// ---------- network ----------
// Narrow screens fit the graph at a smaller scale, so the node font is larger there to keep
// the rendered labels at 11 px or more.
function nodeFontSize() {
    return window.innerWidth < 600 ? 23 : 17;
}

function nodeLabel(c) {
    const mark = isMastered(c.id) ? ' ✓' : '';
    return c.label + mark + '\n' + fmt(estimates[c.id]);
}

function buildNode(c) {
    const v = estimates[c.id];
    const selected = c.id === selectedId;
    const isGap = gapResult && gapResult.forId === selectedId && gapResult.gaps.includes(c.id);
    return {
        id: c.id,
        label: nodeLabel(c),
        level: c.level,
        color: {
            background: fillFor(v),
            border: isGap ? GAP_COLOR : (selected ? '#000000' : '#555555'),
            highlight: { background: fillFor(v), border: '#000000' },
            hover: { background: fillFor(v), border: '#000000' }
        },
        borderWidth: isGap ? 5 : (selected ? 4 : 1.5),
        shapeProperties: { borderDashes: isGap ? [6, 4] : false },
        font: { color: fontFor(v), size: nodeFontSize(), face: 'Arial', multi: false }
    };
}

function buildEdge(e, i) {
    const onPath = gapResult && gapResult.forId === selectedId &&
        gapResult.path.some(p => p.from === e.from && p.to === e.to);
    return {
        id: 'e' + i,
        from: e.from,
        to: e.to,
        title: labelOf(e.from) + ' depends on ' + labelOf(e.to),
        color: { color: onPath ? GAP_COLOR : '#666666', highlight: '#000000', hover: '#000000' },
        width: onPath ? 4 : 2,
        arrows: { to: { enabled: true, scaleFactor: 0.9 } }
    };
}

function refreshGraph() {
    nodes.update(CONCEPTS.map(buildNode));
    edges.update(DEPENDS_ON.map(buildEdge));
}

function isInIframe() {
    try { return window.self !== window.top; } catch (e) { return true; }
}

function initNetwork() {
    nodes = new vis.DataSet(CONCEPTS.map(buildNode));
    edges = new vis.DataSet(DEPENDS_ON.map(buildEdge));
    const free = !isInIframe();
    const options = {
        layout: {
            hierarchical: {
                enabled: true,
                direction: 'UD',
                sortMethod: 'directed',
                levelSeparation: 84,
                nodeSpacing: 175
            }
        },
        physics: { enabled: false },
        interaction: {
            hover: true,
            tooltipDelay: 120,
            selectConnectedEdges: false,
            dragNodes: false,
            dragView: free,
            zoomView: free,
            navigationButtons: true,
            keyboard: { enabled: false }
        },
        nodes: {
            shape: 'box',
            margin: 6,
            widthConstraint: { minimum: 110 },
            shadow: { enabled: true, color: 'rgba(0,0,0,0.18)', size: 4, x: 2, y: 2 }
        },
        edges: {
            smooth: { enabled: true, type: 'cubicBezier', forceDirection: 'vertical', roundness: 0.4 }
        }
    };
    network = new vis.Network(document.getElementById('network'), { nodes, edges }, options);
    network.on('click', params => {
        if (params.nodes.length > 0) selectConcept(params.nodes[0]);
    });
    network.once('afterDrawing', fitGraph);
}

function fitGraph() {
    if (!network) return;
    network.fit({ animation: false });
    // shrink slightly and nudge up so the navigation buttons at the bottom do not cover a node
    const s = network.getScale();
    const pos = network.getViewPosition();
    network.moveTo({ position: { x: pos.x, y: pos.y + 8 / s }, scale: s * 0.93, animation: false });
}

// ---------- panel ----------
function selectConcept(id) {
    selectedId = id;
    gapResult = null;
    document.getElementById('est-slider').value = estimates[id];
    refreshGraph();
    renderPanel(true);
}

function statusSpan(id) {
    return isMastered(id)
        ? '<span class="status-ok">mastered</span>'
        : '<span class="status-low">below threshold</span>';
}

function gapMessage(id) {
    const name = labelOf(id);
    if (!gapResult || gapResult.forId !== id) return '';
    if (gapResult.gaps.length === 0) {
        if (isMastered(id)) {
            return name + ' is mastered and every prerequisite upstream is at or above ' + fmt(threshold) +
                '. There is no gap to reteach here.';
        }
        return 'No prerequisite of ' + name + ' is below ' + fmt(threshold) + '. The weakness is in ' + possessive(name) +
            ' own evidence: reteach ' + name + ' itself.';
    }
    const g = gapResult.gaps.map(labelOf);
    const steps = gapResult.depth[gapResult.gaps[0]];
    let msg = 'First gap: ' + g.join(' and ') + ' (' + gapResult.gaps.map(p => fmt(estimates[p])).join(', ') +
        '), ' + steps + (steps === 1 ? ' step' : ' steps') + ' upstream of ' + name + '. ';
    if (isMastered(id)) {
        msg += name + ' itself is above the threshold, but its evidence rests on an unmastered prerequisite.';
    } else {
        msg += possessive(name) + ' weakness may trace to ' + g[0] + ': begin reteaching at ' + g[0] + '.';
    }
    return msg;
}

function renderPanel(logIt) {
    const id = selectedId;
    const name = labelOf(id);
    const direct = prereqsOf(id);
    const { depth } = upstream(id);
    const below = Object.keys(depth).filter(p => !isMastered(p)).sort((a, b) => depth[a] - depth[b]);

    let html = '<h2>' + name + '</h2>';
    html += '<div>Estimate: <strong>' + fmt(estimates[id]) + '</strong> &mdash; ' + statusSpan(id) +
        ' <span class="muted">(threshold ' + fmt(threshold) + ')</span></div>';
    const gm = gapMessage(id);
    if (gm) html += '<div class="gap-box">' + gm + '</div>';
    html += '<h3>Depends on</h3>';
    if (direct.length === 0) {
        html += '<div class="muted">No prerequisites in this graph.</div>';
    } else {
        html += '<ul>' + direct.map(p => '<li>' + labelOf(p) + ': ' + fmt(estimates[p]) + ' ' +
            (isMastered(p) ? '&#10003;' : '&#10007;') + '</li>').join('') + '</ul>';
    }
    html += '<h3>Prerequisites below ' + fmt(threshold) + ' (all upstream)</h3>';
    if (below.length === 0) {
        html += '<div class="muted">None.</div>';
    } else {
        html += '<ul>' + below.map(p => '<li>' + labelOf(p) + ': ' + fmt(estimates[p]) + ' <span class="muted">(' +
            depth[p] + (depth[p] === 1 ? ' step' : ' steps') + ' up)</span></li>').join('') + '</ul>';
    }
    if (!gm) html += '<div class="muted" style="margin-top:6px">Press "Find first gap" to walk the depends-on edges upstream.</div>';
    document.getElementById('panel').innerHTML = html;

    // plain-text version for the activity log and screen readers
    const plain = name + ': estimate ' + fmt(estimates[id]) + (isMastered(id) ? ' (mastered)' : ' (below threshold)') +
        '; threshold ' + fmt(threshold) + '; depends on ' +
        (direct.length ? direct.map(p => labelOf(p) + ' ' + fmt(estimates[p])).join(', ') : 'nothing') +
        '; prerequisites below threshold: ' + (below.length ? below.map(labelOf).join(', ') : 'none') +
        (gm ? '; ' + gm : '');
    document.getElementById('est-value').textContent = fmt(estimates[id]);
    document.getElementById('sr-summary').textContent = plain;
    if (logIt) log('infobox: ' + plain);
}

function updateLegend() {
    const marker = document.getElementById('legend-threshold');
    marker.style.left = 'calc(' + (threshold * 100) + '% - 1px)';
}

// ---------- controls ----------
function resetAll() {
    estimates = {};
    CONCEPTS.forEach(c => { estimates[c.id] = c.estimate; });
    threshold = DEFAULT_THRESHOLD;
    document.getElementById('threshold').value = DEFAULT_THRESHOLD.toFixed(2);
    selectedId = DEFAULT_SELECTED;
    gapResult = null;
    document.getElementById('est-slider').value = estimates[selectedId];
    updateLegend();
    if (nodes) refreshGraph();
    renderPanel(true);
}

document.addEventListener('DOMContentLoaded', function () {
    CONCEPTS.forEach(c => { estimates[c.id] = c.estimate; });
    initNetwork();

    const slider = document.getElementById('est-slider');
    slider.addEventListener('input', () => {
        estimates[selectedId] = parseFloat(slider.value);
        gapResult = null;
        refreshGraph();
        renderPanel(false);
    });
    slider.addEventListener('change', () => renderPanel(true));

    document.getElementById('gap-btn').addEventListener('click', () => {
        const r = findFirstGap(selectedId);
        gapResult = Object.assign({ forId: selectedId }, r);
        refreshGraph();
        renderPanel(true);
    });
    document.getElementById('threshold').addEventListener('change', e => {
        threshold = parseFloat(e.target.value);
        gapResult = null;
        updateLegend();
        refreshGraph();
        renderPanel(true);
    });
    document.getElementById('reset-btn').addEventListener('click', resetAll);

    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { refreshGraph(); network.redraw(); fitGraph(); }, 120);
    });

    resetAll();
});
