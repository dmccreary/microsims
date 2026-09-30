// Node and Edge Data Explorer - vis-network 9.1.9
// CANVAS_HEIGHT: 500
// A concept map of eight Chapter 8 concepts built from two vis.DataSets. Click a
// node or edge to see its data as JSON; add nodes, connect two nodes with a
// relationship label, swap an edge's direction, and switch between a fixed
// layout and a physics layout to compare them. Mouse-wheel zoom and drag-to-pan
// are off inside the iframe; the navigation buttons replace them.

// ---------------------------------------------------------------------------
// Original data (fixed positions measured from the canvas center)
// ---------------------------------------------------------------------------
const NODE_DATA = [
    { id: 1, label: 'Flowchart',            group: 'diagram', x: -165, y: 60 },
    { id: 2, label: 'Concept Map',          group: 'diagram', x: -40,  y: -145 },
    { id: 3, label: 'Venn Diagram',         group: 'diagram', x: -165, y: -60 },
    { id: 4, label: 'Mermaid Library',      group: 'library', x: -165, y: 150 },
    { id: 5, label: 'vis-network Library',  group: 'library', x: 170,  y: 20 },
    { id: 6, label: 'Network Layout',       group: 'feature', x: 0,    y: 150 },
    { id: 7, label: 'Node Selection Event', group: 'feature', x: 170,  y: 150 },
    { id: 8, label: 'Causal Loop Diagram',  group: 'diagram', x: 175,  y: -130 }
];

const EDGE_DATA = [
    { id: 'e1', from: 1, to: 4, label: 'is drawn with' },
    { id: 'e2', from: 2, to: 5, label: 'is drawn with' },
    { id: 'e3', from: 8, to: 5, label: 'is drawn with' },
    { id: 'e4', from: 8, to: 2, label: 'is a kind of' },
    { id: 'e5', from: 5, to: 6, label: 'computes' },
    { id: 'e6', from: 5, to: 7, label: 'raises' },
    { id: 'e7', from: 3, to: 2, label: 'is an alternative to' },
    { id: 'e8', from: 6, to: 2, label: 'arranges' }
];

const GROUP_COLORS = {
    diagram: { background: '#bfdbfe', border: '#1d4ed8', highlight: { background: '#93c5fd', border: '#1e3a8a' } },
    library: { background: '#bbf7d0', border: '#15803d', highlight: { background: '#86efac', border: '#14532d' } },
    feature: { background: '#fde68a', border: '#b45309', highlight: { background: '#fcd34d', border: '#78350f' } },
    new:     { background: '#e9d5ff', border: '#7e22ce', highlight: { background: '#d8b4fe', border: '#581c87' } }
};

const EDGE_COLOR = '#475569';
const EDGE_HIGHLIGHT = '#ea580c';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
let nodes, edges, network;
let selected = null;                 // { type: 'node'|'edge', id }
let connectMode = false;
let connectSource = null;
let layoutMode = 'fixed';
let nextEdgeNum = 9;

function isInIframe() {
    try { return window.self !== window.top; } catch (e) { return true; }
}

// Node colors come from the vis-network "groups" option, keyed by each node's group
function styledNode(n) {
    return Object.assign({}, n);
}

function styledEdge(e) {
    return Object.assign({}, e, {
        title: edgeSentence(e),
        color: { color: EDGE_COLOR, highlight: EDGE_HIGHLIGHT, hover: EDGE_HIGHLIGHT },
        width: 2
    });
}

function labelOf(id) {
    const n = nodes ? nodes.get(id) : NODE_DATA.find(d => d.id === id);
    return n ? n.label : String(id);
}

function edgeSentence(e) {
    return labelOf(e.from) + ' —' + e.label + '→ ' + labelOf(e.to);
}

// ---------------------------------------------------------------------------
// Network
// ---------------------------------------------------------------------------
function buildNetwork() {
    nodes = new vis.DataSet(NODE_DATA.map(styledNode));
    edges = new vis.DataSet(EDGE_DATA.map(styledEdge));
    nextEdgeNum = EDGE_DATA.length + 1;

    const mouseNav = !isInIframe();      // wheel zoom and drag-pan only when standalone
    const options = {
        layout: { improvedLayout: false },
        physics: { enabled: false },
        interaction: {
            hover: true,
            selectConnectedEdges: false,
            zoomView: mouseNav,
            dragView: mouseNav,
            dragNodes: true,
            navigationButtons: true,
            keyboard: false,
            tooltipDelay: 150
        },
        groups: {
            diagram: { color: GROUP_COLORS.diagram },
            library: { color: GROUP_COLORS.library },
            feature: { color: GROUP_COLORS.feature },
            new:     { color: GROUP_COLORS.new }
        },
        nodes: {
            shape: 'box',
            margin: 8,
            font: { size: 15, face: 'Arial', color: '#111827' },
            borderWidth: 2,
            widthConstraint: { maximum: 105 },
            shadow: { enabled: true, color: 'rgba(0,0,0,0.15)', size: 4, x: 1, y: 1 }
        },
        edges: {
            arrows: { to: { enabled: true, scaleFactor: 0.8 } },
            font: { size: 13, face: 'Arial', color: '#1f2937', strokeWidth: 0, background: 'rgba(255,255,255,0.92)', align: 'horizontal' },
            smooth: { type: 'curvedCW', roundness: 0.08 },
            selectionWidth: 1.5
        }
    };

    const container = document.getElementById('network');
    network = new vis.Network(container, { nodes, edges }, options);
    network.once('afterDrawing', () => fitView(false));

    network.on('selectNode', onSelectNode);
    network.on('selectEdge', params => {
        if (connectMode || params.nodes.length) return;
        selectEdge(params.edges[0]);
    });
    network.on('deselectNode', () => { if (!connectMode) clearSelection(); });
    network.on('deselectEdge', params => {
        if (!connectMode && params.nodes.length === 0 && params.edges.length === 0) clearSelection();
    });
    network.on('hoverEdge', params => {
        const e = edges.get(params.edge);
        setStatus('Edge: ' + edgeSentence(e));
    });
    network.on('blurEdge', () => { if (!connectMode) setStatus(''); });
    network.on('dragEnd', params => {
        if (params.nodes.length && layoutMode === 'fixed') {
            const id = params.nodes[0];
            const p = network.getPositions([id])[id];
            nodes.update({ id: id, x: Math.round(p.x), y: Math.round(p.y) });   // edit x and y by dragging
            showNodeData(id);
        }
    });
    network.on('stabilized', () => {
        if (layoutMode === 'physics') fitView(true);
        if (selected && selected.type === 'node') showNodeData(selected.id);
    });
}

// Fit the whole map into the part of the canvas above the navigation buttons
// (about 60px along the bottom edge), so no button ever covers a node.
function fitView(animate) {
    const ids = nodes.getIds();
    if (!ids.length) return;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    ids.forEach(id => {
        const b = network.getBoundingBox(id);
        minX = Math.min(minX, b.left); maxX = Math.max(maxX, b.right);
        minY = Math.min(minY, b.top);  maxY = Math.max(maxY, b.bottom);
    });
    const el = document.getElementById('network');
    const W = el.clientWidth, H = el.clientHeight;
    const navBand = 60, pad = 16;
    const scale = Math.min(1.1, (W - 2 * pad) / (maxX - minX), (H - navBand - 2 * pad) / (maxY - minY));
    network.moveTo({
        position: { x: (minX + maxX) / 2, y: (minY + maxY) / 2 + (navBand / 2) / scale },
        scale: scale,
        animation: animate ? { duration: 400 } : false
    });
}

// ---------------------------------------------------------------------------
// Selection and the JSON data panel
// ---------------------------------------------------------------------------
function highlight(obj) {
    // pretty JSON with light syntax coloring
    const json = JSON.stringify(obj, null, 2)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/"([^"]+)":/g, '<span class="k">"$1"</span>:')
        .replace(/: "([^"]*)"/g, ': <span class="s">"$1"</span>')
        .replace(/: (-?\d+)/g, ': <span class="n">$1</span>');
    return json;
}

function resetEdgeStyles() {
    edges.update(edges.get().map(e => ({ id: e.id, color: { color: EDGE_COLOR, highlight: EDGE_HIGHLIGHT, hover: EDGE_HIGHLIGHT }, width: 2 })));
}

function showNodeData(id) {
    const n = nodes.get(id);
    const pos = network.getPositions([id])[id];
    const obj = { id: n.id, label: n.label, group: n.group, x: Math.round(pos.x), y: Math.round(pos.y) };
    document.getElementById('panel-title').textContent = 'Selected node';
    document.getElementById('json-view').innerHTML = highlight(obj);
    const connected = edges.get({ filter: e => e.from === id || e.to === id });
    const out = connected.filter(e => e.from === id).map(e => '→ ' + e.label + ' ' + labelOf(e.to));
    const inc = connected.filter(e => e.to === id).map(e => '← ' + labelOf(e.from) + ' ' + e.label);
    document.getElementById('note').innerHTML = connected.length
        ? '<b>' + connected.length + ' connected edge' + (connected.length > 1 ? 's' : '') + '</b> (orange):<br>' +
          out.concat(inc).map(t => t.replace(/</g, '&lt;')).join('<br>')
        : 'No edges yet. Use <b>Connect</b> to link this node.';
}

function onSelectNode(params) {
    const id = params.nodes[0];
    if (connectMode) { handleConnectClick(id); return; }
    selected = { type: 'node', id };
    resetEdgeStyles();
    const connected = edges.get({ filter: e => e.from === id || e.to === id });
    edges.update(connected.map(e => ({ id: e.id, color: { color: EDGE_HIGHLIGHT, highlight: EDGE_HIGHLIGHT, hover: EDGE_HIGHLIGHT }, width: 3.5 })));
    showNodeData(id);
    updateButtons();
}

function selectEdge(edgeId) {
    const e = edges.get(edgeId);
    if (!e) return;
    selected = { type: 'edge', id: edgeId };
    resetEdgeStyles();
    edges.update({ id: edgeId, color: { color: EDGE_HIGHLIGHT, highlight: EDGE_HIGHLIGHT, hover: EDGE_HIGHLIGHT }, width: 3.5 });
    network.selectEdges([edgeId]);
    document.getElementById('panel-title').textContent = 'Selected edge';
    document.getElementById('json-view').innerHTML = highlight({ id: e.id, from: e.from, to: e.to, label: e.label });
    document.getElementById('note').innerHTML = 'Reads as: <b>' + edgeSentence(e).replace(/</g, '&lt;') + '</b><br>' +
        '<code>from</code> is ' + labelOf(e.from) + ' and <code>to</code> is ' + labelOf(e.to) + '. Try <b>Swap direction</b>.';
    updateButtons();
}

function clearSelection() {
    selected = null;
    resetEdgeStyles();
    document.getElementById('panel-title').textContent = 'Node and edge data';
    document.getElementById('json-view').innerHTML = highlight({ nodes: nodes.length, edges: edges.length });
    document.getElementById('note').innerHTML = 'Click a node or an edge to see its data. Hover an edge to read its relationship.';
    updateButtons();
}

function setStatus(text) {
    document.getElementById('status').textContent = text;
}

function updateButtons() {
    document.getElementById('swap-btn').disabled = !(selected && selected.type === 'edge');
}

// ---------------------------------------------------------------------------
// Editing: add node, connect, swap, reset, layout
// ---------------------------------------------------------------------------
function addNode() {
    const input = document.getElementById('node-label');
    const label = input.value.trim();
    if (!label) { setStatus('Type a label for the new concept first.'); input.focus(); return; }
    const id = Math.max(...nodes.getIds()) + 1;
    const count = id - NODE_DATA.length - 1;
    // open spots in the fixed layout; later nodes go below the map
    const slots = [[-95, 0], [-95, 100], [60, -100], [80, 230], [-95, 230], [-200, 230]];
    const [x, y] = count < slots.length ? slots[count] : [-200 + (count % 4) * 130, 300 + Math.floor(count / 4) * 60];
    const node = { id, label, group: 'new', x, y };
    nodes.add(styledNode(node));
    fitView(true);
    input.value = '';
    network.selectNodes([id]);
    onSelectNode({ nodes: [id] });
    setStatus('Added node ' + id + ' "' + label + '". Use Connect to link it to the map.');
}

function toggleConnect() {
    connectMode = !connectMode;
    connectSource = null;
    const btn = document.getElementById('connect-btn');
    btn.setAttribute('aria-pressed', String(connectMode));
    btn.textContent = connectMode ? 'Cancel connect' : 'Connect';
    network.unselectAll();
    setStatus(connectMode ? 'Connect: click the source node (the "from" end).' : '');
}

function handleConnectClick(id) {
    if (connectSource === null) {
        connectSource = id;
        setStatus('From "' + labelOf(id) + '". Now click the target node (the "to" end).');
        return;
    }
    if (id === connectSource) {
        setStatus('Pick a different node for the "to" end.');
        return;
    }
    const edgeId = 'e' + nextEdgeNum++;
    const e = { id: edgeId, from: connectSource, to: id, label: document.getElementById('rel-select').value };
    edges.add(styledEdge(e));
    toggleConnect();
    network.unselectAll();
    selectEdge(edgeId);
    setStatus('Created edge ' + edgeId + ': ' + edgeSentence(e) + '.');
}

function swapDirection() {
    if (!selected || selected.type !== 'edge') return;
    const e = edges.get(selected.id);
    const swapped = { id: e.id, from: e.to, to: e.from };
    swapped.title = labelOf(swapped.from) + ' —' + e.label + '→ ' + labelOf(swapped.to);
    edges.update(swapped);
    selectEdge(e.id);
    setStatus('Swapped: the arrow now reads ' + edgeSentence(edges.get(e.id)) + '. Does it still make sense?');
}

function setLayout(mode) {
    layoutMode = mode;
    if (mode === 'physics') {
        network.setOptions({
            physics: {
                enabled: true,
                solver: 'barnesHut',
                barnesHut: { gravitationalConstant: -2500, springLength: 110, springConstant: 0.04, avoidOverlap: 0.4 },
                stabilization: { iterations: 150 }
            }
        });
        setStatus('Physics layout: nodes repel and edges pull like springs, so positions are computed, not stored.');
    } else {
        network.setOptions({ physics: { enabled: false } });
        // put every node back at its stored x and y
        nodes.update(nodes.get().map(n => ({ id: n.id, x: n.x, y: n.y })));
        setTimeout(() => fitView(true), 50);
        setStatus('Fixed layout: each node sits at the x and y stored in its data.');
    }
    if (selected && selected.type === 'node') setTimeout(() => showNodeData(selected.id), 450);
}

function resetAll() {
    if (connectMode) toggleConnect();
    document.querySelector('input[name="layout"][value="fixed"]').checked = true;
    layoutMode = 'fixed';
    network.destroy();
    buildNetwork();
    clearSelection();
    setStatus('');
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    buildNetwork();
    clearSelection();

    document.getElementById('add-btn').addEventListener('click', addNode);
    document.getElementById('node-label').addEventListener('keydown', e => { if (e.key === 'Enter') addNode(); });
    document.getElementById('connect-btn').addEventListener('click', toggleConnect);
    document.getElementById('swap-btn').addEventListener('click', swapDirection);
    document.getElementById('reset-btn').addEventListener('click', resetAll);
    document.querySelectorAll('input[name="layout"]').forEach(r =>
        r.addEventListener('change', e => setLayout(e.target.value)));

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => fitView(false), 150);
    });
});
