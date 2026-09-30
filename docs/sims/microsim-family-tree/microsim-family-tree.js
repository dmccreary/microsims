// MicroSim Family Tree - vis-network
// CANVAS_HEIGHT: 520
// Learning objective (Understand / classify): the learner classifies an example as a learning
// object, an interactive simulation, a MicroSim, or an instrumented MicroSim by identifying the
// property that distinguishes each level. Each arrow names the property the next level adds.
// Layout: toolbar (44px) + body (476px). The body is network | info panel, and the panel moves
// below the network when the page is narrower than 600px (see style.css).

// ===========================================
// DATA
// ===========================================
const levels = [
    {
        id: 'lo', label: 'Learning\nObject', name: 'Learning Object',
        color: 'steelblue', font: 'white', col: 0,
        definition: 'A self-contained, reusable unit of instruction that addresses one ' +
            'learning goal. It carries a description (metadata) so it can be found and dropped ' +
            'into a new course without being rewritten.',
        example: 'A labeled diagram of a plant cell with a caption and a catalog record, reused ' +
            'in three different biology courses.',
        nearMiss: 'A semester-long slide deck that only makes sense inside one course: it is ' +
            'not self-contained, so it cannot be reused on its own.',
        adds: 'is self-contained, reusable and described'
    },
    {
        id: 'sim', label: 'Interactive\nSimulation', name: 'Interactive Simulation',
        color: 'green', font: 'white', col: 1,
        definition: 'A learning object built around a computer model that the learner can ' +
            'manipulate. The system\'s behavior changes visibly and immediately when the ' +
            'learner acts.',
        example: 'A desktop pendulum program: drag the length slider and the swing ' +
            'changes at once.',
        nearMiss: 'A video of a pendulum swinging. It shows one outcome, but the learner ' +
            'cannot change anything, so there is no interaction with a model.',
        adds: 'a model and immediate interaction'
    },
    {
        id: 'ms', label: 'MicroSim', name: 'MicroSim',
        color: 'orange', font: 'black', col: 2,
        definition: 'A small, self-contained, AI-generated interactive simulation that runs in ' +
            'a browser and embeds in any page with one iframe tag. It adapts to its ' +
            'container\'s width and carries a metadata file so it can be found and reused.',
        example: 'A two-slider bouncing-ball simulation embedded in a chapter with one ' +
            'iframe tag and described by a metadata.json file.',
        nearMiss: 'A large desktop physics application with hundreds of controls. It is ' +
            'interactive, but it is not small and cannot be embedded in a web page.',
        adds: 'small, embeddable, described, AI-generated'
    },
    {
        id: 'ims', label: 'Instrumented\nMicroSim', name: 'Instrumented MicroSim',
        color: 'crimson', font: 'white', col: 3,
        definition: 'A MicroSim that also records meaningful learner interactions and ' +
            'reports them as xAPI statements. It behaves the same for the learner but ' +
            'becomes a source of evidence about learning.',
        example: 'The bouncing-ball MicroSim that sends slider changes and prediction ' +
            'answers as xAPI statements to a learning record store.',
        nearMiss: 'A MicroSim whose page views are counted by a web analytics tool. ' +
            'Visits are not learner interactions reported as xAPI statements.',
        adds: 'reports evidence through xAPI'
    }
];

// Quiz pool: two examples per level; each quiz round uses one per level, shuffled
const quizPool = [
    { level: 'lo', text: 'A five-minute video on photosynthesis, catalogued with a title, ' +
        'subject and grade level.',
      why: 'It is reusable and described, but the learner only watches: there is no model to change.' },
    { level: 'lo', text: 'A ten-question fractions quiz with its own description record, ' +
        'reused by several teachers.',
      why: 'It is a reusable, described unit of instruction, but it has no model that responds to the learner.' },
    { level: 'sim', text: 'A pendulum whose length you can change, in a desktop application.',
      why: 'It has a model and immediate interaction, but it is not small and cannot be embedded in a page.' },
    { level: 'sim', text: 'A downloadable circuit simulator with dozens of panels where ' +
        'flipping a switch lights a bulb at once.',
      why: 'The learner changes inputs and sees the result immediately, but it is large and installed, not embeddable.' },
    { level: 'ms', text: 'A two-slider ball simulation embedded in a chapter with a ' +
        'metadata file.',
      why: 'It is small, runs in the browser, embeds with one iframe and is described, but it reports no events.' },
    { level: 'ms', text: 'An AI-generated browser sketch of a wave with one amplitude ' +
        'slider that fits any page width and has a metadata.json file.',
      why: 'Small, embeddable, width-responsive and described: a MicroSim. Nothing is reported as xAPI.' },
    { level: 'ims', text: 'The same ball simulation that also sends slider and answer ' +
        'events to a record store.',
      why: 'It is a MicroSim that reports learner interactions as evidence through xAPI.' },
    { level: 'ims', text: 'A predict-then-test MicroSim whose answers are sent as xAPI ' +
        '"answered" statements for mastery estimates.',
      why: 'Its interactions are reported as xAPI statements, so it is instrumented.' }
];

// ===========================================
// STATE
// ===========================================
let nodes, edges, network;
let selectedId = 'ms';          // preselect the chapter's central concept
let quizMode = false;
let quizItems = [];
let quizIndex = 0;
let quizCorrect = 0;
let quizAttempts = 0;
let firstTryCorrect = 0;
let answered = false;           // current example answered correctly
let triedThisItem = false;
let feedbackHtml = '';

function levelById(id) { return levels.find(l => l.id === id); }

// Wide layout: a left-to-right staircase with room for the arrow labels between boxes.
// Narrow layout (info panel below): a flatter staircase; arrow labels move to tooltips.
function isNarrow() { return window.innerWidth < 600; }
function nodePosition(level) {
    const c = level.col - 1.5;
    return isNarrow() ? { x: c * 96, y: c * 58 } : { x: c * 100, y: c * 135 };
}
function levelIndex(id) { return levels.findIndex(l => l.id === id); }

function isInIframe() {
    try { return window.self !== window.top; } catch (e) { return true; }
}

// ===========================================
// NETWORK
// ===========================================
function nodeStyle(level, selected) {
    return {
        id: level.id,
        label: quizMode ? '?' : level.label,
        x: nodePosition(level).x, y: nodePosition(level).y,
        color: {
            background: level.color, border: selected ? 'black' : 'dimgray',
            highlight: { background: level.color, border: 'black' },
            hover: { background: level.color, border: 'black' }
        },
        borderWidth: selected ? 4 : 2,
        margin: isNarrow() ? 6 : 10,
        widthConstraint: isNarrow() ? { minimum: 92, maximum: 100 } : { minimum: 118, maximum: 130 },
        heightConstraint: { minimum: isNarrow() ? 38 : 46 },
        font: { color: level.font, size: quizMode ? 26 : (isNarrow() ? 14 : 16), face: 'Arial' },
        title: quizMode ? 'Click to place the example here' : 'Click for the definition of ' + level.name
    };
}

function buildEdges() {
    const out = [];
    for (let i = 0; i < levels.length - 1; i++) {
        const to = levels[i + 1];
        out.push({
            id: 'e' + i,
            from: levels[i].id,
            to: to.id,
            label: isNarrow() ? undefined : wrapEdgeLabel('adds ' + to.adds),
            title: to.name + ' = ' + levels[i].name + ' + ' + to.adds,
            arrows: { to: { enabled: true, scaleFactor: 0.9 } },
            color: { color: 'dimgray', hover: 'black', highlight: 'black' },
            width: 2,
            smooth: false,
            font: { size: 15, face: 'Arial', color: 'black', strokeWidth: 0,
                    background: 'white', align: 'horizontal' }
        });
    }
    return out;
}

// Break an edge label into two roughly equal lines
function wrapEdgeLabel(text) {
    const words = text.split(' ');
    let best = text, bestDiff = Infinity;
    for (let i = 1; i < words.length; i++) {
        const a = words.slice(0, i).join(' ');
        const b = words.slice(i).join(' ');
        const diff = Math.abs(a.length - b.length);
        if (diff < bestDiff) { bestDiff = diff; best = a + '\n' + b; }
    }
    return best;
}

function initNetwork() {
    nodes = new vis.DataSet(levels.map(l => nodeStyle(l, l.id === selectedId)));
    edges = new vis.DataSet(buildEdges());
    const mouseNav = !isInIframe();   // wheel zoom / drag pan only when opened fullscreen
    const options = {
        layout: { improvedLayout: false },
        physics: { enabled: false },
        interaction: {
            dragNodes: false,
            dragView: mouseNav,
            zoomView: mouseNav,
            hover: true,
            navigationButtons: !isNarrow(),   // no room for them when the panel is below
            selectConnectedEdges: false,
            tooltipDelay: 150,
            keyboard: { enabled: false }
        },
        nodes: {
            shape: 'box',
            margin: 10,
            shapeProperties: { borderRadius: 6 },
            shadow: { enabled: true, color: 'rgba(0,0,0,0.2)', size: 5, x: 2, y: 2 }
        }
    };
    network = new vis.Network(document.getElementById('network'), { nodes, edges }, options);
    network.on('click', onNetworkClick);
    network.on('hoverNode', () => { document.getElementById('network').style.cursor = 'pointer'; });
    network.on('blurNode', () => { document.getElementById('network').style.cursor = 'default'; });
    network.once('afterDrawing', fitView);
}

// Fit the whole family in view, leaving room at the bottom for the navigation buttons
function fitView() {
    network.fit({ animation: false, maxZoomLevel: 1.1 });
    const scale = network.getScale() * 0.92;
    const center = network.getViewPosition();
    // shift the diagram up a little so the navigation buttons sit below it
    const shift = isNarrow() ? 0 : 22 / scale;
    network.moveTo({ position: { x: center.x, y: center.y + shift }, scale: scale, animation: false });
}

// Rebuild positions, arrow labels and buttons when the layout mode changes
let lastNarrow = null;
function applyLayoutMode() {
    const narrow = isNarrow();
    if (narrow === lastNarrow) return;
    lastNarrow = narrow;
    refreshNodes();
    edges.update(buildEdges());
    network.setOptions({ interaction: { navigationButtons: !narrow } });
}

function refreshNodes() {
    nodes.update(levels.map(l => nodeStyle(l, !quizMode && l.id === selectedId)));
}

function onNetworkClick(params) {
    if (params.nodes.length === 0) return;
    const id = params.nodes[0];
    if (quizMode) {
        checkAnswer(id);
    } else {
        selectedId = id;
        refreshNodes();
        renderPanel();
    }
    network.unselectAll();
}

// ===========================================
// PANEL
// ===========================================
function renderPanel() {
    const panel = document.getElementById('panel');
    if (quizMode) { panel.innerHTML = quizHtml(); wireQuizButtons(); return; }
    const l = levelById(selectedId);
    const i = levelIndex(selectedId);
    const addsLine = i === 0 ?
        '<p><span class="label">Starting point:</span> <span class="adds">' + l.adds + '</span></p>' :
        '<p><span class="label">Adds to ' + levels[i - 1].name + ':</span> <span class="adds">' +
        l.adds + '</span></p>';
    panel.innerHTML =
        '<p class="hint">Click any box. Hover an arrow to see what it adds.</p>' +
        '<h3><span class="swatch" style="background:' + l.color + '"></span>' + l.name + '</h3>' +
        '<p>' + (isNarrow() ? l.definition.split('. ')[0] + '.' : l.definition) + '</p>' +
        addsLine +
        '<p><span class="label good">Example:</span> ' + l.example + '</p>' +
        '<p><span class="label bad">Near miss:</span> ' + l.nearMiss + '</p>';
    if (window.innerWidth < 600) {
        // keep the narrow panel within its fixed height
        const hint = panel.querySelector('.hint');
        if (hint) hint.remove();
    }
}

function quizHtml() {
    if (quizIndex >= quizItems.length) {
        return '<h3>Quiz complete</h3>' +
            '<p>You placed all ' + quizItems.length + ' examples.</p>' +
            '<p class="score">First-try correct: ' + firstTryCorrect + ' of ' + quizItems.length +
            '<br/>Score: ' + quizCorrect + ' correct / ' + quizAttempts + ' attempts</p>' +
            '<p><button id="again-btn" class="btn btn-primary">New set of examples</button></p>' +
            '<p class="hint">Press Explore to see the labels and definitions again.</p>';
    }
    const item = quizItems[quizIndex];
    let html = '<p class="hint">The labels are hidden. Click the box where this example ' +
        'belongs. ' + (isNarrow() ? 'Hover an arrow to see the property it adds.' :
        'The arrows still name each added property.') + '</p>' +
        '<h3>Example ' + (quizIndex + 1) + ' of ' + quizItems.length + '</h3>' +
        '<div class="card">' + item.text + '</div>';
    if (feedbackHtml) html += feedbackHtml;
    html += '<p class="score">Score: ' + quizCorrect + ' correct / ' + quizAttempts + ' attempts</p>';
    if (answered) html += '<p><button id="next-btn" class="btn btn-primary">Next example</button></p>';
    return html;
}

function wireQuizButtons() {
    const next = document.getElementById('next-btn');
    if (next) next.addEventListener('click', nextExample);
    const again = document.getElementById('again-btn');
    if (again) again.addEventListener('click', startQuiz);
}

// ===========================================
// QUIZ
// ===========================================
function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function startQuiz() {
    quizMode = true;
    // one example per level, in random order
    quizItems = shuffle(levels.map(l => shuffle(quizPool.filter(q => q.level === l.id))[0]));
    quizIndex = 0;
    quizCorrect = 0;
    quizAttempts = 0;
    firstTryCorrect = 0;
    answered = false;
    triedThisItem = false;
    feedbackHtml = '';
    document.getElementById('quiz-btn').textContent = 'Explore';
    refreshNodes();
    renderPanel();
}

function stopQuiz() {
    quizMode = false;
    document.getElementById('quiz-btn').textContent = 'Quiz me';
    refreshNodes();
    renderPanel();
}

function checkAnswer(id) {
    if (quizIndex >= quizItems.length || answered) return;
    const item = quizItems[quizIndex];
    quizAttempts++;
    const chosen = levelIndex(id);
    const correctIdx = levelIndex(item.level);
    const correctLevel = levels[correctIdx];
    if (chosen === correctIdx) {
        quizCorrect++;
        if (!triedThisItem) firstTryCorrect++;
        answered = true;
        feedbackHtml = '<p><span class="good">Correct: ' + correctLevel.name + '.</span> ' +
            item.why + '</p>';
        // reveal the label on the correct node
        nodes.update({ id: id, label: correctLevel.label, font: { size: isNarrow() ? 14 : 16, color: correctLevel.font } });
    } else if (chosen > correctIdx) {
        // chose a level that is too specific: name the first property the example lacks
        feedbackHtml = '<p><span class="bad">Not quite.</span> This example is missing a ' +
            'property of that level: it does not ' + lackPhrase[levels[correctIdx + 1].id] +
            '. Try again.</p>';
    } else {
        // chose a level that is too general: name the next property it does have
        feedbackHtml = '<p><span class="bad">Look again.</span> This example goes further: ' +
            'it also ' + hasPhrase[levels[chosen + 1].id] + '. Try again.</p>';
    }
    triedThisItem = true;
    renderPanel();
}

// Verb phrases for feedback: what an example lacks, or what it also has
const lackPhrase = {
    sim: 'have a model that responds immediately to the learner',
    ms: 'stay small and embed in a web page with one iframe tag and a metadata file',
    ims: 'report learner interactions as xAPI statements'
};
const hasPhrase = {
    sim: 'has a model that responds immediately to the learner',
    ms: 'is small and embeds in a web page with one iframe tag and a metadata file',
    ims: 'reports learner interactions as xAPI statements'
};

function nextExample() {
    quizIndex++;
    answered = false;
    triedThisItem = false;
    feedbackHtml = '';
    refreshNodes();
    renderPanel();
}

// ===========================================
// STARTUP AND RESIZE
// ===========================================
document.addEventListener('DOMContentLoaded', function () {
    initNetwork();
    lastNarrow = isNarrow();
    renderPanel();
    document.getElementById('quiz-btn').addEventListener('click', function () {
        if (quizMode) stopQuiz(); else startQuiz();
    });
    let resizeTimer = null;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            applyLayoutMode();
            network.redraw();
            fitView();
            renderPanel();
        }, 120);
    });
});
