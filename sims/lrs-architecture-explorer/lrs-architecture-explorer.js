// Full LRS Architecture Explorer - vis-network MicroSim
// CANVAS_HEIGHT: 660
// Twelve nodes (textbooks plus eleven LRS components) in five horizontal bands, the planes
// Ingestion, Processing, Storage, Analytics and Presentation. Node data, edge descriptions and
// status live in data.json, so the diagram can be updated when the repository status changes.
// Status colors: Okabe-Ito bluish green = built, yellow = files exist but the workers that feed
// them do not, light gray with a dashed border = designed; white = outside the LRS.
// Fixed positions, physics off. Below 600 px the bands are re-laid out two nodes per row, and
// the node font grows as the view scale shrinks so labels never render below 11 px.

const STATUS_STYLE = {
    built: { background: '#009e73', border: '#00664a', font: '#ffffff', dashes: false },
    partial: { background: '#f0e442', border: '#8a8020', font: '#222222', dashes: false },
    designed: { background: '#eeeeee', border: '#777777', font: '#222222', dashes: [6, 4] },
    context: { background: '#ffffff', border: '#333333', font: '#222222', dashes: false }
};
const QUIZ_STYLE = { background: '#ffffff', border: '#555555', font: '#222222', dashes: false };
const BAND_FILL = ['rgba(0,114,178,0.07)', 'rgba(0,114,178,0.13)'];

let data = null;
let nodes, edges, network;
let layout = null;              // { pos, bands, x0, x1, trayY, narrow }
let fontSize = 15;
let selectedId = 'gateway';
let hideDesigned = false;
let quiz = null;                // { order, index, placed:Set, triedWrong:Set, firstTry, message }
let quizResult = null;

function log(msg) { console.log('[lrs-architecture-explorer] ' + msg); }
function nodeById(id) { return data.nodes.find(n => n.id === id); }
function planeById(id) { return data.planes.find(p => p.id === id); }
function flat(label) { return label.replace(/\n/g, ' '); }
function isInIframe() { try { return window.self !== window.top; } catch (e) { return true; } }

// ---------- layout ----------
function computeLayout() {
    const narrow = window.innerWidth < 600;
    const pos = {};
    const bands = [];
    if (!narrow) {
        data.nodes.forEach(n => { pos[n.id] = { x: n.x, y: n.y }; });
        data.planes.forEach(p => bands.push({ id: p.id, label: p.label, y0: p.y - 57, y1: p.y + 57 }));
        return { pos, bands, x0: -370, x1: 445, trayY: -120, narrow };
    }
    // narrow: single-line labels, textbooks on top, then each plane with at most two nodes
    // per row; row spacing and column offset follow the current font size
    const rowH = 1.3 * fontSize + 34;
    const header = 1.1 * fontSize + 10;
    const colX = 3.4 * fontSize + 14;
    pos.textbooks = { x: 0, y: 0 };
    let y = rowH / 2 + 6;
    data.planes.forEach(p => {
        const members = data.nodes.filter(n => n.plane === p.id).sort((a, b) => a.x - b.x);
        const rows = Math.ceil(members.length / 2);
        const y0 = y, h = header + rows * rowH;
        members.forEach((n, i) => {
            const r = Math.floor(i / 2), c = i % 2;
            const inRow = Math.min(2, members.length - r * 2);
            pos[n.id] = { x: inRow === 1 ? 0 : (c === 0 ? -colX : colX), y: y0 + header + rowH / 2 + r * rowH };
        });
        bands.push({ id: p.id, label: p.label, y0, y1: y0 + h });
        y = y0 + h + 4;
    });
    const half = colX + 3.6 * fontSize;
    return { pos, bands, x0: -half, x1: half, trayY: -rowH, narrow };
}

// ---------- node and edge styling ----------
function isHidden(n) {
    if (quiz) return n.plane !== null && !quiz.placed.has(n.id) && n.id !== quiz.order[quiz.index];
    return hideDesigned && n.status === 'designed';
}

function labelFor(n) {
    return layout && layout.narrow ? n.label.split('\n')[0] : n.label;
}

function buildNode(n) {
    const inQuiz = quiz && n.plane !== null && !quiz.placed.has(n.id);
    const st = inQuiz ? QUIZ_STYLE : STATUS_STYLE[n.status];
    const current = quiz && n.id === quiz.order[quiz.index];
    // the component being quizzed waits in the tray, right of the tray's caption
    const trayX = (layout.x0 + layout.x1) / 2 + (layout.x1 - layout.x0) * 0.22;
    const p = current ? { x: trayX, y: layout.trayY + 8 } : layout.pos[n.id];
    const selected = !quiz && n.id === selectedId;
    return {
        id: n.id,
        label: labelFor(n),
        x: p.x,
        y: p.y,
        hidden: isHidden(n),
        fixed: { x: !current, y: !current },
        color: {
            background: st.background, border: selected ? '#000000' : st.border,
            highlight: { background: st.background, border: '#000000' },
            hover: { background: st.background, border: '#000000' }
        },
        borderWidth: selected ? 4 : (current ? 3 : 2),
        shapeProperties: { borderDashes: st.dashes },
        font: { color: st.font, size: fontSize, face: 'Arial', multi: false }
    };
}

function buildEdge(e, i) {
    const a = nodeById(e.from), b = nodeById(e.to);
    const hidden = !!quiz || isHidden(a) || isHidden(b);
    return {
        id: 'e' + i,
        from: e.from,
        to: e.to,
        hidden,
        title: flat(a.label) + ' → ' + flat(b.label) + ': ' + e.carries,
        arrows: { to: { enabled: true, scaleFactor: 0.8 } },
        color: { color: '#4a4a4a', highlight: '#000000', hover: '#000000' },
        width: 2,
        smooth: e.curve ? { enabled: true, type: 'curvedCCW', roundness: 0.28 } : { enabled: false }
    };
}

function refresh() {
    nodes.update(data.nodes.map(buildNode));
    edges.update(data.edges.map(buildEdge));
}

// ---------- view fitting with a font floor ----------
// The node font grows as the scale shrinks so labels never render below 11 px. On narrow
// screens the layout depends on the font, so layout, scale and font are iterated to agree.
function fitView() {
    if (!network) return;
    const el = document.getElementById('network');
    const W = el.clientWidth, H = el.clientHeight;
    if (!W || !H) return;
    let box = null;
    for (let iter = 0; iter < 6; iter++) {
        layout = computeLayout();
        const xs = Object.values(layout.pos).map(p => p.x);
        const pad = layout.narrow ? 3.6 * fontSize : 80;
        const minX = Math.min(layout.x0, Math.min(...xs) - pad), maxX = Math.max(layout.x1, Math.max(...xs) + pad);
        const minY = (quiz ? layout.trayY - 45 : Math.min(-30, layout.bands[0].y0 - (layout.narrow ? 1.3 * fontSize : 0))) - 6;
        const maxY = layout.bands[layout.bands.length - 1].y1 + 6;
        const scale = Math.min(W / (maxX - minX), H / (maxY - minY)) * 0.97;
        box = { minX, maxX, minY, maxY, scale };
        const wanted = Math.max(14, Math.ceil(11.5 / scale));
        if (wanted === fontSize) break;
        fontSize = wanted;
    }
    refresh();
    network.moveTo({ position: { x: (box.minX + box.maxX) / 2, y: (box.minY + box.maxY) / 2 }, scale: box.scale, animation: false });
}

// ---------- bands drawn under the network ----------
function drawBands(ctx) {
    const s = network.getScale();
    const labelPx = Math.max(13, 12 / s);
    layout.bands.forEach((b, i) => {
        ctx.fillStyle = BAND_FILL[i % 2];
        ctx.fillRect(layout.x0, b.y0, layout.x1 - layout.x0, b.y1 - b.y0);
        ctx.strokeStyle = 'rgba(0,114,178,0.35)';
        ctx.lineWidth = 1 / s;
        ctx.strokeRect(layout.x0, b.y0, layout.x1 - layout.x0, b.y1 - b.y0);
        ctx.fillStyle = '#0b4f7a';
        ctx.font = 'bold ' + labelPx + 'px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(b.label, layout.x0 + 8 / s, b.y0 + 5 / s);
    });
    if (quiz) {
        const y = layout.trayY;
        ctx.fillStyle = 'rgba(230,159,0,0.12)';
        ctx.fillRect(layout.x0, y - 42, layout.x1 - layout.x0, 84);
        ctx.strokeStyle = 'rgba(170,110,0,0.8)';
        ctx.setLineDash([6 / s, 4 / s]);
        ctx.strokeRect(layout.x0, y - 42, layout.x1 - layout.x0, 84);
        ctx.setLineDash([]);
        ctx.fillStyle = '#7a4f00';
        ctx.font = 'bold ' + labelPx + 'px Arial';
        ctx.fillText('Drag this component into its plane', layout.x0 + 8 / s, y - 40 + 3 / s);
    }
}

function bandAt(x, y) {
    if (x < layout.x0 || x > layout.x1) return null;
    const b = layout.bands.find(b => y >= b.y0 && y <= b.y1);
    return b ? b.id : null;
}

// ---------- information panel ----------
function renderPanel() {
    const panel = document.getElementById('panel');
    if (quiz) { renderQuizPanel(); return; }
    if (quizResult) {
        panel.innerHTML = '<h2>Quiz complete</h2><div class="full">' + quizResult +
            ' Click any component to read its role, dependencies and status.</div>';
        return;
    }
    const n = nodeById(selectedId);
    const st = data.statuses[n.status];
    const plane = n.plane ? planeById(n.plane).label + ' plane' : 'system context';
    panel.innerHTML =
        '<h2>' + flat(n.label) + ' <span class="badge ' + n.status + '">' + st.label + '</span> ' +
        '<span style="font-weight:normal;font-size:13px;color:#555">' + plane + '</span></h2>' +
        '<div><h3>Role</h3>' + n.role + '</div>' +
        '<div><h3>Hard dependencies</h3><ul>' + n.dependencies.map(d => '<li>' + d + '</li>').join('') + '</ul></div>' +
        '<div><h3>Status</h3>' + n.statusNote + ' <span style="color:#666">(Source: ' +
        data.metadata.statusSource.replace('LRS repository ', '') + '.)</span></div>';
    const plain = flat(n.label) + ' (' + plane + ', ' + st.label + '): ' + n.role + ' Hard dependencies: ' +
        n.dependencies.join('; ') + '. Status per ' + data.metadata.statusSource + ': ' + n.statusNote;
    document.getElementById('sr-summary').textContent = plain;
    log('infobox: ' + plain);
}

function renderQuizPanel() {
    const panel = document.getElementById('panel');
    const id = quiz.order[quiz.index];
    const n = nodeById(id);
    const buttons = data.planes.map(p => '<button type="button" data-plane="' + p.id + '">' + p.label + '</button>').join('');
    panel.innerHTML =
        '<h2>Quiz: component ' + (quiz.index + 1) + ' of ' + quiz.order.length + '. Where does "' + flat(n.label) +
        '" belong?</h2>' +
        '<div class="full">' + (quiz.message || 'Drag the component from the orange tray into its plane, or choose a plane below.') + '</div>' +
        '<div class="quiz-row">' + buttons + '</div>';
    panel.querySelectorAll('button[data-plane]').forEach(b => b.addEventListener('click', () => checkPlacement(b.dataset.plane)));
}

// ---------- quiz ----------
function startQuiz() {
    const order = data.nodes.filter(n => n.plane !== null).map(n => n.id);
    for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }
    quiz = { order, index: 0, placed: new Set(), triedWrong: new Set(), firstTry: 0, message: '' };
    quizResult = null;
    document.getElementById('quiz-btn').textContent = 'End quiz';
    document.getElementById('hide-designed').disabled = true;
    document.getElementById('legend').style.visibility = 'hidden';
    network.setOptions({ interaction: { dragNodes: true } });
    refresh();
    fitView();
    renderPanel();
    log('quiz started');
}

function endQuiz(completed) {
    if (completed) {
        quizResult = 'You placed all ' + quiz.order.length + ' components, ' + quiz.firstTry + ' of them on the first try.';
        log('quiz complete: ' + quiz.firstTry + ' of ' + quiz.order.length + ' on the first try');
    }
    quiz = null;
    document.getElementById('quiz-btn').textContent = 'Quiz me';
    document.getElementById('hide-designed').disabled = false;
    document.getElementById('legend').style.visibility = 'visible';
    network.setOptions({ interaction: { dragNodes: false } });
    refresh();
    fitView();
    renderPanel();
}

function checkPlacement(planeId) {
    if (!quiz) return;
    const id = quiz.order[quiz.index];
    const n = nodeById(id);
    if (planeId === n.plane) {
        quiz.placed.add(id);
        if (!quiz.triedWrong.has(id)) quiz.firstTry++;
        quiz.message = '<span class="ok">Correct:</span> ' + flat(n.label) + ' belongs to the ' + planeById(n.plane).label +
            ' plane. ' + n.role;
        log('quiz: ' + id + ' -> ' + planeId + ' correct');
        quiz.index++;
        if (quiz.index >= quiz.order.length) { endQuiz(true); return; }
    } else {
        quiz.triedWrong.add(id);
        const chosen = planeId ? planeById(planeId) : null;
        quiz.message = '<span class="bad">' + (chosen ? 'Not ' + chosen.label + '.' : 'Drop it inside one of the five bands.') +
            '</span> ' + (chosen ? chosen.hint + ' ' : '') + 'What does ' + flat(n.label) + ' do? ' + n.role;
        log('quiz: ' + id + ' -> ' + (planeId || 'outside') + ' incorrect');
    }
    refresh();
    fitView();
    renderPanel();
}

// ---------- start-up ----------
function init(json) {
    data = json;
    layout = computeLayout();
    nodes = new vis.DataSet(data.nodes.map(buildNode));
    edges = new vis.DataSet(data.edges.map(buildEdge));
    const free = !isInIframe();
    network = new vis.Network(document.getElementById('network'), { nodes, edges }, {
        layout: { improvedLayout: false },
        physics: { enabled: false },
        interaction: {
            hover: true,
            tooltipDelay: 120,
            dragNodes: false,
            dragView: free,
            zoomView: free,
            navigationButtons: true,
            selectConnectedEdges: false,
            keyboard: { enabled: false }
        },
        nodes: { shape: 'box', margin: 8, shadow: { enabled: true, color: 'rgba(0,0,0,0.15)', size: 4, x: 2, y: 2 } },
        edges: { selectionWidth: 1, hoverWidth: 1 }
    });
    network.on('beforeDrawing', drawBands);
    network.on('click', params => {
        if (quiz || params.nodes.length === 0) return;
        selectedId = params.nodes[0];
        quizResult = null;
        refresh();
        renderPanel();
    });
    network.on('dragEnd', params => {
        if (!quiz || params.nodes.length === 0) return;
        const id = params.nodes[0];
        if (id !== quiz.order[quiz.index]) return;
        const p = network.getPositions([id])[id];
        checkPlacement(bandAt(p.x, p.y));
    });
    network.once('afterDrawing', fitView);

    document.getElementById('hide-designed').addEventListener('change', e => {
        hideDesigned = e.target.checked;
        if (hideDesigned && nodeById(selectedId).status === 'designed') selectedId = 'gateway';
        refresh();
        renderPanel();
        log('hide designed components: ' + hideDesigned);
    });
    document.getElementById('quiz-btn').addEventListener('click', () => (quiz ? endQuiz(false) : startQuiz()));

    let timer = null;
    window.addEventListener('resize', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            network.redraw();
            fitView();
        }, 120);
    });

    document.getElementById('sr-summary').textContent = 'Architecture diagram with ' + data.nodes.length +
        ' nodes in five planes. Built: gateway. Files exist: event stream, ClickHouse, Neo4j. Designed: ' +
        data.nodes.filter(n => n.status === 'designed').map(n => flat(n.label)).join(', ') + '.';
    renderPanel();
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('data.json')
        .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(init)
        .catch(err => {
            const box = document.getElementById('load-error');
            box.hidden = false;
            box.textContent = 'Could not load data.json (' + err.message + '). This diagram reads its nodes and status ' +
                'from data.json, so open it through a web server such as "mkdocs serve" rather than as a local file.';
            document.getElementById('panel').textContent = 'The diagram data did not load.';
        });
});
