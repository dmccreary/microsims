// MicroSim Directory Explorer - vis-network
// CANVAS_HEIGHT: 500
// Learning objective (Understand / explain): the learner explains the role of each file in a
// MicroSim directory and predicts which file to edit to make a given change.
// A fixed tree: the root docs/sims/h-bridge/ with five files below it. Hover a file for its
// one-sentence job; click it for what it contains, who reads it, and a change you would make
// there. "Which file?" shows change requests; the learner clicks the file to edit.

// ===========================================
// DATA
// ===========================================
const root = {
    id: 'root', label: 'docs/sims/h-bridge/', color: 'white', font: 'black',
    job: 'The MicroSim directory. Its name, the sim-id, is also the URL, the metadata ' +
        'identifier and the key that batch tools use.'
};

const files = [
    {
        id: 'html', label: 'main.html', color: 'orange', font: 'black', col: 0, row: 0,
        job: 'Loads the library and the sketch into a web page.',
        contains: 'The HTML wrapper: a schema meta tag, a pinned CDN script tag for p5.js, a ' +
            'script tag for h-bridge.js, and an empty <main> element.',
        reads: 'The browser, directly or through an iframe in a chapter.',
        change: 'Update the pinned p5.js version in the CDN address.'
    },
    {
        id: 'js', label: 'h-bridge.js', color: 'steelblue', font: 'white', col: 1, row: 1,
        job: 'Draws the MicroSim and makes it respond to the learner.',
        contains: 'The p5.js sketch: the model, the drawing, the controls, and the ' +
            '// CANVAS_HEIGHT comment.',
        reads: 'The browser, which runs it after the library loads.',
        change: 'Make a slider start at a different value, or make the motor spin faster.'
    },
    {
        id: 'md', label: 'index.md', color: 'green', font: 'white', col: 2, row: 0,
        job: 'Explains the MicroSim and embeds it in the textbook.',
        contains: 'The documentation page: front matter, the title, the iframe, a copy-and-' +
            'paste embed snippet, a fullscreen button, a lesson plan and references.',
        reads: 'Readers and teachers, after MkDocs turns it into a web page.',
        change: 'Fix a typo in the lesson plan or change the iframe height.'
    },
    {
        id: 'json', label: 'metadata.json', color: 'purple', font: 'white', col: 3, row: 1,
        job: 'Describes the MicroSim so search tools can find and filter it.',
        contains: 'The machine-readable description: Dublin Core fields, search tags, grade ' +
            'levels, learning objectives, framework and controls.',
        reads: 'Search tools, catalogs and validators, not the learner.',
        change: 'Add a learning objective or a grade level that searches can filter on.'
    },
    {
        id: 'png', label: 'h-bridge.png', color: 'gray', font: 'white', col: 4, row: 0,
        job: 'Shows what the MicroSim looks like at a glance.',
        contains: 'A screenshot of the running MicroSim, captured by a headless browser at the ' +
            'iframe height.',
        reads: 'Gallery pages (as a thumbnail) and social-media link previews.',
        change: 'Recapture it after changing how the MicroSim looks.'
    }
];

// Change requests for the "Which file?" quiz
const requests = [
    { text: 'Make the slider start at 0.5 instead of 0.8.', file: 'js',
      why: 'The slider is created in the sketch, so its starting value lives in h-bridge.js.' },
    { text: 'Make the motor spin faster when the switches close.', file: 'js',
      why: 'The model and the animation are coded in the sketch.' },
    { text: 'Add a Reset button below the drawing region.', file: 'js',
      why: 'Controls are created with createButton() in the sketch.' },
    { text: 'Add a learning objective that catalog searches can filter on.', file: 'json',
      why: 'Search tools read learningObjectives from metadata.json, not the page text.' },
    { text: 'Add grade levels 8 to 12 so a teacher\'s search finds it.', file: 'json',
      why: 'gradeLevel is a field in metadata.json.' },
    { text: 'Load a newer pinned version of p5.js.', file: 'html',
      why: 'The CDN script tag that pins the library version is in main.html.' },
    { text: 'Change the title in the browser tab when main.html is opened on its own.', file: 'html',
      why: 'That tab title comes from the <title> element of main.html.' },
    { text: 'Fix a typo in the lesson plan.', file: 'md',
      why: 'The lesson plan is part of the documentation page, index.md.' },
    { text: 'Change the iframe height on the MicroSim\'s documentation page.', file: 'md',
      why: 'The page\'s iframe tag and its copy-and-paste snippet are in index.md.' },
    { text: 'Add a References section with two links.', file: 'md',
      why: 'References are a section of the documentation page.' },
    { text: 'Update the gallery picture after changing the MicroSim\'s colors.', file: 'png',
      why: 'The gallery thumbnail is made from the screenshot, h-bridge.png.' },
    { text: 'Replace the image shown when the page is shared on social media.', file: 'png',
      why: 'The social preview fields point to h-bridge.png, so recapture that file.' }
];

const QUIZ_LENGTH = 6;

// ===========================================
// STATE
// ===========================================
let nodes, edges, network;
let selectedId = 'js';
let quizMode = false;
let quiz = [];
let qIndex = 0;
let qCorrect = 0;
let qAttempts = 0;
let qFirstTry = 0;
let qTried = false;
let qAnswered = false;
let qFeedback = '';

function fileById(id) { return files.find(f => f.id === id); }
function isNarrow() { return window.innerWidth < 600; }
function isInIframe() {
    try { return window.self !== window.top; } catch (e) { return true; }
}

// ===========================================
// NETWORK
// ===========================================
// Files are staggered on two rows so the five boxes fit side by side without shrinking the
// text; the root sits above the middle.
// Top row: main.html, index.md, h-bridge.png; lower row: h-bridge.js, metadata.json
const topRowX = [-180, 0, 180];
const lowRowX = [-100, 100];
function filePosition(f) {
    const k = isNarrow() ? 0.94 : 1;
    const x = f.row === 0 ? topRowX[f.col / 2] : lowRowX[(f.col - 1) / 2];
    if (isNarrow()) return { x: x * k, y: f.row === 0 ? 5 : 70 };
    return { x: x, y: f.row === 0 ? 20 : 150 };
}
function rootPosition() {
    return { x: 0, y: isNarrow() ? -75 : -150 };
}

function nodeFor(item, isRoot) {
    const selected = !quizMode && item.id === selectedId;
    const pos = isRoot ? rootPosition() : filePosition(item);
    return {
        id: item.id,
        label: item.label,
        x: pos.x, y: pos.y,
        shape: 'box',
        margin: isNarrow() ? 7 : 10,
        color: {
            background: item.color, border: selected ? 'black' : 'dimgray',
            highlight: { background: item.color, border: 'black' },
            hover: { background: item.color, border: 'black' }
        },
        borderWidth: selected ? 4 : 2,
        font: { color: item.font, size: isNarrow() ? 14 : 16, face: 'Arial' },
        title: quizMode ? undefined : item.job      // job tooltips are hidden during the quiz
    };
}

function allNodes() {
    return [nodeFor(root, true)].concat(files.map(f => nodeFor(f, false)));
}

function initNetwork() {
    nodes = new vis.DataSet(allNodes());
    edges = new vis.DataSet(files.map(f => ({
        id: 'e-' + f.id, from: 'root', to: f.id,
        color: { color: 'gray' }, width: 2, smooth: false
    })));
    const mouseNav = !isInIframe();   // wheel zoom / drag pan only when opened fullscreen
    const options = {
        layout: { improvedLayout: false },
        physics: { enabled: false },
        interaction: {
            dragNodes: false,
            dragView: mouseNav,
            zoomView: mouseNav,
            hover: true,
            navigationButtons: !isNarrow(),
            selectConnectedEdges: false,
            tooltipDelay: 120,
            keyboard: { enabled: false }
        },
        nodes: {
            shapeProperties: { borderRadius: 5 },
            shadow: { enabled: true, color: 'rgba(0,0,0,0.2)', size: 5, x: 2, y: 2 }
        },
        edges: { arrows: { to: { enabled: false } } }
    };
    network = new vis.Network(document.getElementById('network'), { nodes, edges }, options);
    network.on('click', onClick);
    network.on('hoverNode', () => { document.getElementById('network').style.cursor = 'pointer'; });
    network.on('blurNode', () => { document.getElementById('network').style.cursor = 'default'; });
    network.once('afterDrawing', fitView);
}

function fitView() {
    network.fit({ animation: false, maxZoomLevel: 1.1 });
    const scale = network.getScale() * 0.93;
    const c = network.getViewPosition();
    const shift = isNarrow() ? 0 : 20 / scale;   // room for the navigation buttons
    network.moveTo({ position: { x: c.x, y: c.y + shift }, scale: scale, animation: false });
}

let lastNarrow = null;
function applyLayoutMode() {
    const narrow = isNarrow();
    if (narrow === lastNarrow) return;
    lastNarrow = narrow;
    nodes.update(allNodes());
    network.setOptions({ interaction: { navigationButtons: !narrow } });
}

function refreshNodes() { nodes.update(allNodes()); }

function onClick(params) {
    if (params.nodes.length === 0) return;
    const id = params.nodes[0];
    network.unselectAll();
    if (quizMode) { answer(id); return; }
    selectedId = id;
    refreshNodes();
    renderPanel();
}

// ===========================================
// PANEL
// ===========================================
function renderPanel() {
    const panel = document.getElementById('panel');
    if (quizMode) { panel.innerHTML = quizHtml(); wireQuiz(); return; }
    if (selectedId === 'root') {
        panel.innerHTML =
            (isNarrow() ? '' : '<p class="hint">Hover a file for its job. Click it for details.</p>') +
            '<h3>docs/sims/h-bridge/</h3>' +
            '<p>' + root.job + '</p>' +
            '<p>Rename the folder and all three change: the page address, the identifier in ' +
            'metadata.json, and every iframe path that points to it.</p>';
        return;
    }
    const f = fileById(selectedId);
    panel.innerHTML =
        (isNarrow() ? '' : '<p class="hint">Hover a file for its job. Click it for details.</p>') +
        '<h3><span class="swatch" style="background:' + f.color + '"></span>' + f.label + '</h3>' +
        '<p><span class="label">Contains:</span> ' + escapeHtml(f.contains) + '</p>' +
        '<p><span class="label">Who reads it:</span> ' + f.reads + '</p>' +
        '<p><span class="label">A change you would make here:</span> ' + f.change + '</p>';
}

function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function quizHtml() {
    if (qIndex >= quiz.length) {
        return '<h3 style="font-family:Arial">Round complete</h3>' +
            '<p>Right on the first try: ' + qFirstTry + ' of ' + quiz.length + '</p>' +
            '<p class="score">Score: ' + qCorrect + ' correct / ' + qAttempts + ' attempts</p>' +
            '<p><button id="again-btn" class="btn btn-primary">New round</button></p>' +
            '<p class="hint">Press Explore to see the file details again.</p>';
    }
    const r = quiz[qIndex];
    let html = '<p class="hint">Which file would you edit? Click it in the tree.</p>' +
        '<div><b>Change ' + (qIndex + 1) + ' of ' + quiz.length + '</b></div>' +
        '<div class="request">' + escapeHtml(r.text) + '</div>';
    if (qFeedback) html += qFeedback;
    html += '<p class="score">Score: ' + qCorrect + ' correct / ' + qAttempts + ' attempts</p>';
    if (qAnswered) html += '<p><button id="next-btn" class="btn btn-primary">Next change</button></p>';
    return html;
}

function wireQuiz() {
    const n = document.getElementById('next-btn');
    if (n) n.addEventListener('click', nextRequest);
    const a = document.getElementById('again-btn');
    if (a) a.addEventListener('click', startQuiz);
}

// ===========================================
// QUIZ
// ===========================================
function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// One request for every file, plus one extra, in random order
function buildRound() {
    const byFile = files.map(f => shuffle(requests.filter(r => r.file === f.id))[0]);
    const extra = shuffle(requests.filter(r => !byFile.includes(r)))[0];
    return shuffle(byFile.concat([extra])).slice(0, QUIZ_LENGTH);
}

function startQuiz() {
    quizMode = true;
    quiz = buildRound();
    qIndex = 0; qCorrect = 0; qAttempts = 0; qFirstTry = 0;
    qTried = false; qAnswered = false; qFeedback = '';
    document.getElementById('quiz-btn').textContent = 'Explore';
    refreshNodes();
    renderPanel();
}

function stopQuiz() {
    quizMode = false;
    document.getElementById('quiz-btn').textContent = 'Which file?';
    refreshNodes();
    renderPanel();
}

function answer(id) {
    if (qIndex >= quiz.length || qAnswered) return;
    if (id === 'root') {
        qFeedback = '<p><span class="bad">That is the folder.</span> Pick one of the five ' +
            'files inside it.</p>';
        renderPanel();
        return;
    }
    const r = quiz[qIndex];
    qAttempts++;
    if (id === r.file) {
        qCorrect++;
        if (!qTried) qFirstTry++;
        qAnswered = true;
        qFeedback = '<p><span class="good">Correct: ' + fileById(id).label + '.</span> ' +
            escapeHtml(r.why) + '</p>';
    } else {
        qTried = true;
        qFeedback = '<p><span class="bad">Not ' + fileById(id).label + '.</span> That file ' +
            lowerFirst(fileById(id).job) + ' Try again.</p>';
    }
    renderPanel();
}

function lowerFirst(s) { return s.charAt(0).toLowerCase() + s.slice(1); }

function nextRequest() {
    qIndex++;
    qTried = false; qAnswered = false; qFeedback = '';
    renderPanel();
}

// ===========================================
// STARTUP AND RESIZE
// ===========================================
document.addEventListener('DOMContentLoaded', function () {
    lastNarrow = isNarrow();
    initNetwork();
    renderPanel();
    document.getElementById('quiz-btn').addEventListener('click', function () {
        if (quizMode) stopQuiz(); else startQuiz();
    });
    let t = null;
    window.addEventListener('resize', function () {
        clearTimeout(t);
        t = setTimeout(function () {
            applyLayoutMode();
            network.redraw();
            fitView();
            renderPanel();
        }, 120);
    });
});
