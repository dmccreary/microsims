// Poster Folder Explorer - vis-network
// CANVAS_HEIGHT: 560
// Learning objective (Understand / describe): the learner describes the role of each file in a
// poster folder and of the shared overlay library, and identifies which file to edit to fix a
// given problem. A fixed left-to-right tree: docs/posters/ -> landing index.md, shared-libs/
// (four engine files) and robot-kits/ (five poster files). Dashed arrows show that main.html
// loads the shared library, fetches data.json, and that data.json names the PNG.
// Click a node for its role; hover an arrow for what passes along it; "Fix it" shows a
// symptom and asks which file to edit.

// ===========================================
// DATA
// ===========================================
const KIND = {
    folder: { bg: 'moccasin', border: 'darkgoldenrod', name: 'folder' },
    md: { bg: 'honeydew', border: 'seagreen', name: 'Markdown page' },
    engine: { bg: 'lightsteelblue', border: 'steelblue', name: 'shared engine file' },
    html: { bg: 'peachpuff', border: 'chocolate', name: 'HTML page' },
    json: { bg: 'thistle', border: 'purple', name: 'data file' },
    png: { bg: 'gainsboro', border: 'gray', name: 'image' }
};

const items = [
    { id: 'root', label: 'docs/posters/', kind: 'folder', x: -250, y: -20,
      role: 'The folder that holds the whole poster collection, one subfolder per poster. ' +
            'MkDocs publishes everything inside it under the site\'s posters/ address.',
      fixes: 'A poster folder saved outside docs/ is never published: move it under docs/posters/.' },
    { id: 'landing', label: 'index.md\n(landing page)', kind: 'md', x: -80, y: -252, parent: 'root',
      role: 'The collection\'s landing page: a grid of cards, each with a thumbnail, a title ' +
            'link and a one-sentence description. It is the one page that lists every poster.',
      fixes: 'A finished poster is missing from the gallery: add its card to docs/posters/index.md.' },
    { id: 'shared', label: 'shared-libs/', kind: 'folder', x: -80, y: -139, parent: 'root',
      role: 'One folder of engine files that every overlay page loads with ../shared-libs/ paths, ' +
            'instead of copying them into each poster. A fix here reaches every poster at once, ' +
            'but copies kept elsewhere can drift.',
      fixes: 'Posters behave differently from another book\'s: diff this folder against the skill\'s bundled copy.' },
    { id: 'grid-js', label: 'grid-diagram.js', kind: 'engine', x: 120, y: -205, parent: 'shared',
      role: 'The grid overlay engine. It builds the image and the transparent zone layer from ' +
            'data.json, then runs Explore, Quiz Me and the ?edit=true calibration mode.',
      fixes: 'Hover or quiz behavior is wrong on every poster at once: fix grid-diagram.js.' },
    { id: 'grid-css', label: 'grid-overlay.css', kind: 'engine', x: 120, y: -161, parent: 'shared',
      role: 'The style sheet for grid overlays: zone highlights, the detail panel, the mode ' +
            'buttons and the edit panel. Each grid poster\'s main.html links it.',
      fixes: 'The panel or buttons look wrong on every grid poster: fix grid-overlay.css.' },
    { id: 'diagram-js', label: 'diagram.js', kind: 'engine', x: 120, y: -117, parent: 'shared',
      role: 'The callout overlay engine, used by labeled-illustration overlays rather than by ' +
            'grid posters. It draws numbered markers from x and y percentages.',
      fixes: 'Callout markers misbehave on every callout overlay: fix diagram.js (a grid poster does not load it).' },
    { id: 'style-css', label: 'style.css', kind: 'engine', x: 120, y: -73, parent: 'shared',
      role: 'The style sheet for the callout engine\'s markers, labels and information box. ' +
            'Grid posters do not use it.',
      fixes: 'Callout labels look wrong on every callout overlay: edit style.css.' },
    { id: 'kits', label: 'robot-kits/', kind: 'folder', x: -80, y: 97, parent: 'root',
      role: 'One poster\'s folder. Its name is the poster\'s slug and becomes part of its web ' +
            'address, and every poster folder holds the same set of files.',
      fixes: 'The poster lives at the wrong web address: rename the folder and update the landing page link.' },
    { id: 'kits-md', label: 'index.md', kind: 'md', x: 120, y: -20, parent: 'kits',
      role: 'The poster\'s documentation page: front matter, the audience, an iframe that embeds ' +
            'main.html, an About section, and the image prompt in a prompt admonition.',
      fixes: 'The overlay is cut off on the documentation page: change the iframe height in robot-kits/index.md.' },
    { id: 'main', label: 'main.html', kind: 'html', x: 120, y: 24, parent: 'kits',
      role: 'The page that hosts the overlay. It links ../shared-libs/grid-overlay.css, holds the ' +
            'Explore and Quiz Me buttons and the detail panel, and loads ../shared-libs/grid-diagram.js.',
      fixes: 'A blank poster page with a 404 for grid-diagram.js: fix the relative path in main.html.' },
    { id: 'data', label: 'data.json', kind: 'json', x: 120, y: 96, parent: 'kits',
      role: 'The poster\'s data: title, image filename, layout "grid", showLabels, palette, the ' +
            'zones with x1, y1, x2, y2, summary and facts, and the quiz. Most content changes happen here.',
      fixes: 'Zone in the wrong place: edit data.json. Broken image: check the filename in data.json.' },
    { id: 'png', label: 'robot-kits-\ninfographic.png', kind: 'png', x: 120, y: 170, parent: 'kits',
      role: 'The generated poster picture, saved under exactly the filename that data.json names. ' +
            'Its printed titles and numbers come from the verbatim image prompt.',
      fixes: 'Nothing is edited here directly: regenerate it from image-prompt.md, then recalibrate the zones.' },
    { id: 'prompt', label: 'image-prompt.md', kind: 'md', x: 120, y: 226, parent: 'kits',
      role: 'The verbatim text prompt that produced the PNG, kept so the picture can be ' +
            'regenerated. It must name the same image filename as data.json.',
      fixes: 'A wrong number is printed inside the picture: correct image-prompt.md and regenerate the PNG.' }
];

// dashed dependency arrows, with what passes along each one
const links = [
    { id: 'l-loads', from: 'main', to: 'shared', label: 'loads',
      title: 'main.html loads the shared library: a <link> to ../shared-libs/grid-overlay.css ' +
              'and a <script> for ../shared-libs/grid-diagram.js. The engine code and styles pass along this arrow.' },
    { id: 'l-fetch', from: 'main', to: 'data', label: 'fetches',
      title: 'grid-diagram.js, running inside main.html, fetches data.json. The image name, ' +
             'zones, facts and quiz questions pass along this arrow.' },
    { id: 'l-names', from: 'data', to: 'png', label: 'names',
      title: 'data.json names the PNG: its "image" field holds robot-kits-infographic.png, and ' +
             'the engine creates the picture from that exact, case-sensitive filename.' }
];

// "Fix it" symptoms: the file to edit and why
const symptoms = [
    { text: 'One zone\'s highlight covers half of two columns instead of one column.', file: 'data',
      why: 'Zone coordinates live in data.json. Calibrate with ?edit=true and paste back only the zones array.' },
    { text: 'The page shows a broken-image icon where the poster should be.', file: 'data',
      why: 'The "image" field in data.json must match the PNG\'s filename exactly, including case.' },
    { text: 'A quiz question accepts the wrong column as the correct answer.', file: 'data',
      why: 'Each question\'s correct_zone is stored in the quiz list of data.json.' },
    { text: 'The poster picture itself prints the WiFi Bot price as $12.', file: 'prompt',
      why: 'Pixels cannot be edited. Correct the verbatim text in image-prompt.md and regenerate the PNG.' },
    { text: 'The robot-kits poster is missing from the gallery of all posters.', file: 'landing',
      why: 'The landing page, docs/posters/index.md, holds one card per poster.' },
    { text: 'On the robot-kits documentation page, the iframe cuts off the detail panel.', file: 'kits-md',
      why: 'The iframe and its height are written in robot-kits/index.md.' },
    { text: 'Hover highlighting stopped working on all six posters after an update.', file: 'grid-js',
      why: 'Every grid poster runs the same engine, so a fault on all of them points to grid-diagram.js.' },
    { text: 'Only this poster shows plain, unstyled buttons, and the browser reports a 404 for grid-overlay.css.', file: 'main',
      why: 'One poster failing with a 404 means its main.html links the wrong path; the shared file itself is fine.' },
    { text: 'The detail panel\'s colors and spacing look wrong on every grid poster.', file: 'grid-css',
      why: 'A styling fault shared by every grid poster belongs in grid-overlay.css.' }
];
const ROUND_LENGTH = 6;

// ===========================================
// STATE
// ===========================================
let nodes, edges, network;
let selectedId = null;
let fixMode = false;
let round = [], rIndex = 0, rFirstTry = 0, rTried = false, rAnswered = false, rFeedback = '';

function itemById(id) { return items.find(i => i.id === id); }
function isNarrow() { return window.innerWidth < 600; }
function isInIframe() {
    try { return window.self !== window.top; } catch (e) { return true; }
}
function plain(label) { return label.replace('\n', ''); }

// ===========================================
// NETWORK
// ===========================================
function nodeFor(it) {
    const k = KIND[it.kind];
    const sel = !fixMode && it.id === selectedId;
    return {
        id: it.id, label: it.label, x: it.x, y: it.y,
        shape: 'box', margin: 8,
        widthConstraint: it.parent && itemById(it.parent).parent ? { minimum: 150 } : { minimum: 110 },
        color: {
            background: k.bg, border: sel ? 'black' : k.border,
            highlight: { background: k.bg, border: 'black' },
            hover: { background: k.bg, border: 'black' }
        },
        borderWidth: sel ? 4 : 2,
        font: { size: 17, face: 'Arial', color: 'black', multi: false }
    };
}

function initNetwork() {
    nodes = new vis.DataSet(items.map(nodeFor));
    const treeEdges = items.filter(i => i.parent).map(i => ({
        id: 't-' + i.id, from: i.parent, to: i.id,
        color: { color: 'gray', hover: 'dimgray' }, width: 1.5, smooth: false,
        arrows: { to: { enabled: false } },
        title: plain(itemById(i.parent).label) + ' contains ' + plain(i.label) + '.'
    }));
    const linkEdges = links.map(l => ({
        id: l.id, from: l.from, to: l.to, label: l.label, title: l.title,
        dashes: [8, 6], width: 2.5,
        color: { color: 'darkorange', hover: 'orangered', highlight: 'orangered' },
        arrows: { to: { enabled: true, scaleFactor: 0.9 } },
        font: { size: 15, face: 'Arial', color: 'saddlebrown', background: 'white', strokeWidth: 0 },
        smooth: l.id === 'l-loads' ? { type: 'curvedCW', roundness: 0.25 } : false
    }));
    edges = new vis.DataSet(treeEdges.concat(linkEdges));

    const mouseNav = !isInIframe();   // wheel zoom and drag pan only when opened fullscreen
    const options = {
        layout: { improvedLayout: false },
        physics: { enabled: false },
        interaction: {
            dragNodes: false, dragView: mouseNav, zoomView: mouseNav,
            hover: true, navigationButtons: !isNarrow(),
            selectConnectedEdges: false, tooltipDelay: 100,
            keyboard: { enabled: false }
        },
        nodes: {
            shapeProperties: { borderRadius: 5 },
            shadow: { enabled: true, color: 'rgba(0,0,0,0.15)', size: 4, x: 2, y: 2 }
        }
    };
    network = new vis.Network(document.getElementById('network'), { nodes, edges }, options);
    network.on('click', onClick);
    network.on('hoverNode', () => { document.getElementById('network').style.cursor = 'pointer'; });
    network.on('blurNode', () => { document.getElementById('network').style.cursor = 'default'; });
    network.once('afterDrawing', fitView);
}

function fitView() {
    network.fit({ animation: false, maxZoomLevel: 1.1 });
    // leave a strip at the bottom for the navigation buttons (wide layout only)
    const k = isNarrow() ? 0.97 : 0.88;
    const scale = network.getScale() * k;
    const c = network.getViewPosition();
    const shift = isNarrow() ? 0 : 26 / scale;
    network.moveTo({ position: { x: c.x, y: c.y + shift }, scale: scale, animation: false });
}

let lastNarrow = null;
function applyLayoutMode() {
    const narrow = isNarrow();
    if (narrow === lastNarrow) return;
    lastNarrow = narrow;
    network.setOptions({ interaction: { navigationButtons: !narrow } });
}

function refreshNodes() { nodes.update(items.map(nodeFor)); }

function onClick(params) {
    if (params.nodes.length === 0) return;
    const id = params.nodes[0];
    network.unselectAll();
    if (fixMode) { answer(id); return; }
    selectedId = id;
    refreshNodes();
    renderPanel();
}

// ===========================================
// PANEL
// ===========================================
function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function legendHtml() {
    return '<div class="legend">' + ['folder', 'md', 'html', 'json', 'png', 'engine'].map(k =>
        '<span class="swatch" style="background:' + KIND[k].bg + ';border-color:' + KIND[k].border +
        '"></span>' + KIND[k].name).join('<br>') +
        '<br><span style="color:darkorange;font-weight:bold">- - &gt;</span> dependency (hover it)</div>';
}

function renderPanel() {
    const panel = document.getElementById('panel');
    if (fixMode) { panel.innerHTML = fixHtml(); wireFix(); return; }
    if (!selectedId) {
        panel.innerHTML =
            '<p><b>Click any folder or file</b> to read its role and one problem it would fix.</p>' +
            '<p class="hint">Hover a dashed arrow to see what passes along it. Press Fix it to ' +
            'practice choosing the file to edit.</p>' + legendHtml();
        return;
    }
    const it = itemById(selectedId);
    panel.innerHTML =
        '<h3><span class="swatch" style="background:' + KIND[it.kind].bg + '"></span>' +
        esc(plain(it.label)) + '</h3>' +
        '<p>' + esc(it.role) + '</p>' +
        '<p><span class="label">Problem it fixes:</span> ' + esc(it.fixes) + '</p>';
}

function fixHtml() {
    if (rIndex >= round.length) {
        return '<h3 style="font-family:Arial">Round complete</h3>' +
            '<p>Right on the first try: ' + rFirstTry + ' of ' + round.length + '</p>' +
            '<p><button id="again-btn" class="btn btn-primary">New round</button></p>' +
            '<p class="hint">Press Explore to read the roles again.</p>';
    }
    const s = round[rIndex];
    let html = (isNarrow() ? '' : '<p class="hint">Which file would you edit? Click it in the tree.</p>') +
        '<div><b>Symptom ' + (rIndex + 1) + ' of ' + round.length + '</b> &middot; first-try correct: ' +
        rFirstTry + '</div>' +
        '<div class="symptom">' + esc(s.text) + '</div>';
    if (rFeedback) html += rFeedback;
    if (rAnswered) html += '<p><button id="next-btn" class="btn btn-primary">Next symptom</button></p>';
    return html;
}

function wireFix() {
    const n = document.getElementById('next-btn');
    if (n) n.addEventListener('click', nextSymptom);
    const a = document.getElementById('again-btn');
    if (a) a.addEventListener('click', startFix);
}

// ===========================================
// FIX IT MODE
// ===========================================
function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function startFix() {
    fixMode = true;
    round = shuffle(symptoms).slice(0, ROUND_LENGTH);
    rIndex = 0; rFirstTry = 0; rTried = false; rAnswered = false; rFeedback = '';
    document.getElementById('mode-btn').textContent = 'Explore';
    refreshNodes();
    renderPanel();
}

function stopFix() {
    fixMode = false;
    document.getElementById('mode-btn').textContent = 'Fix it';
    refreshNodes();
    renderPanel();
}

function answer(id) {
    if (rIndex >= round.length || rAnswered) return;
    const s = round[rIndex];
    const it = itemById(id);
    if (it.kind === 'folder') {
        rTried = true;
        rFeedback = '<p><span class="bad">' + esc(plain(it.label)) + ' is a folder.</span> ' +
            'Pick the file inside it that you would edit.</p>';
    } else if (id === s.file) {
        if (!rTried) rFirstTry++;
        rAnswered = true;
        rFeedback = '<p><span class="good">Correct: ' + esc(plain(it.label)) + '.</span> ' +
            esc(s.why) + '</p>';
    } else {
        rTried = true;
        // on a phone-width panel keep the feedback to one line
        rFeedback = '<p><span class="bad">Not ' + esc(plain(it.label)) + '.</span> ' +
            (isNarrow() ? '' : esc(it.role.split('. ')[0]) + '. ') + 'Try again.</p>';
    }
    renderPanel();
}

function nextSymptom() {
    rIndex++;
    rTried = false; rAnswered = false; rFeedback = '';
    renderPanel();
}

// ===========================================
// STARTUP AND RESIZE
// ===========================================
document.addEventListener('DOMContentLoaded', function () {
    lastNarrow = isNarrow();
    initNetwork();
    renderPanel();
    document.getElementById('mode-btn').addEventListener('click', function () {
        if (fixMode) stopFix(); else startFix();
    });
    let t = null;
    window.addEventListener('resize', function () {
        clearTimeout(t);
        t = setTimeout(function () {
            applyLayoutMode();
            network.redraw();
            fitView();
        }, 120);
    });
});
