// Verified Poster Pipeline Explorer - vis-network
// CANVAS_HEIGHT: 560
// Learning objective (Understand / sequence): the learner sequences the nine steps of the
// verified poster route and explains which step is the mandatory human checkpoint and which
// step alone calls the image model. The chain reads left to right and wraps like lines of
// text: steps 1-4 (bracketed "reusable on their own"), then 5-8, then 9. A dashed backward
// edge from 8 to 7 is the render-audit retry loop. Click a step for its description, the file
// it writes and what goes wrong if it is skipped; hover an edge for what passes along it;
// "Skip a step" greys one step out; "Sequence quiz" shuffles the steps to be put in order.

// ===========================================
// DATA (from the verified-infographic guide as summarized in Chapter 11)
// ===========================================
const steps = [
    { n: 1, name: 'Claim plan',
      desc: 'Before any search, list the 5 to 10 factual claims the poster must make, each with ' +
            'its subject, metric type, polarity and prominence. The plan also warns in advance ' +
            'about symmetry bias in versus layouts.',
      writes: '01-claim-plan.yaml',
      skip: 'Searching drives the content: the poster says whatever the results happen to ' +
            'support, claims cannot be checked one by one, and nobody warns that the weaker ' +
            'side of a versus layout may be padded with invented numbers.' },
    { n: 2, name: 'Source discovery',
      desc: 'For each planned claim, run at least two independent web searches and record the ' +
            'title, authors, year, publisher, URL and a quoted supporting sentence. Peer-reviewed ' +
            'and government sources are preferred; marketing pages are rejected.',
      writes: 'No file of its own: the source records and search queries go into the verification report.',
      skip: 'Verification has nothing to compare against, so numbers come from memory or from ' +
            'round-trip marketing statistics with no traceable primary paper.' },
    { n: 3, name: 'Verification',
      desc: 'Compare each claim with what its sources actually say and sort it into VERIFIED, ' +
            'DIRECTIONAL, QUALITATIVE-ONLY or REJECTED. If more than 20 percent of the claims ' +
            'are rejected, stop and reconsider the framing.',
      writes: '02-verification-report.md',
      skip: 'Unverified numbers reach the layout and the prompt. Meta-source citations and ' +
            'marketing statistics go unnoticed, and nothing softens a claim to a range or a word.' },
    { n: 4, name: 'User checkpoint', color: 'orange', font: 'black',
      desc: 'Show the requester every claim and its verdict: which survived, which were softened ' +
            'and which were dropped, then wait for explicit approval. The guide calls this the ' +
            'most important safety checkpoint; nothing is laid out or rendered before it.',
      writes: 'Nothing new: it approves the claim set in 02-verification-report.md.',
      skip: 'No person approves the claims. The requester never learns that a claim was ' +
            'softened or dropped, and a topic that should have been reshaped is rendered anyway.' },
    { n: 5, name: 'Layout spec',
      desc: 'Declare every text element of the poster in YAML, giving each factual element a ' +
            'source_id from the report or marking it as non-factual design, such as the title. ' +
            'Asymmetric layouts are allowed, so no filler numbers are needed.',
      writes: '03-layout-spec.yaml',
      skip: 'The prompt is written from loose notes, so a number with no source_id can slip ' +
            'onto the poster and no printed statistic is tied to its citation.' },
    { n: 6, name: 'Prompt assembly',
      desc: 'Compose the image prompt directly from the layout spec, copying every number ' +
            'verbatim. The prompt tells the model to render text exactly and to leave out any ' +
            'text it cannot render legibly.',
      writes: '04-image-prompt.md',
      skip: 'With no verbatim instructions, the image model paraphrases labels, substitutes ' +
            'numbers and invents extra rows or statistics.' },
    { n: 7, name: 'Render', color: 'rebeccapurple', font: 'white',
      desc: 'The one call to the image model: the locked prompt goes in and one poster image ' +
            'comes out. No other step in the route calls the image model.',
      writes: 'poster.png',
      skip: 'No poster is produced. The verified claim set from steps 1 to 4 is still useful, ' +
            'and it can feed an interactive chart or table instead.' },
    { n: 8, name: 'Render audit',
      desc: 'Read the rendered image and confirm every number, author, year and institution ' +
            'against the layout, with no invented or missing rows. If drift is found, log it ' +
            'and render again, up to three attempts before escalating to the user.',
      writes: 'sources.md, the reader-facing citation list',
      skip: 'Image-model number drift is published: a "+12%" that rendered as "+21%", or a ' +
            'misspelled author, reaches readers, and there is no sources.md to check it against.' },
    { n: 9, name: 'Overlay',
      desc: 'Wrap poster.png in a grid overlay with showLabels set to false, carry each claim\'s ' +
            'source_id into the zone facts, and add quiz questions. A flat image emits nothing, ' +
            'while zones and quiz answers can become interaction events.',
      writes: 'data.json and main.html (the grid overlay)',
      skip: 'The poster stays a flat PNG that emits no interaction events, so nothing shows ' +
            'whether any reader engaged with the verified claims.' }
];

const edgeInfo = {
    '1-2': 'The claim plan: 5 to 10 planned claims with subject, metric type, polarity and prominence, and no values yet.',
    '2-3': 'Candidate sources for each claim: title, authors, year, publisher, URL, a quoted passage and the search queries used.',
    '3-4': 'The verification report: every claim with its bucket, final value and phrasing, citation, URL and quoted passage.',
    '4-5': 'The approved final claim set, only after the requester\'s explicit approval.',
    '5-6': 'The layout spec: every text element, each factual one carrying a source_id.',
    '6-7': 'The locked image prompt, with every number copied verbatim from the layout spec.',
    '7-8': 'poster.png, the single rendered image.',
    '8-7': 'Drift found: the audit logs the mismatch and sends the poster back to be rendered again, up to three attempts before escalating to the user.',
    '8-9': 'The audited poster.png and its sources.md citation list.'
};

// explore layout: rows of four read left to right, then wrap
const explorePos = {
    1: [-204, -110], 2: [-68, -110], 3: [68, -110], 4: [204, -110],
    5: [-204, 40], 6: [-68, 40], 7: [68, 40], 8: [204, 40],
    9: [-204, 170]
};
// quiz slots: a 3 x 3 grid that gives away no order
const quizSlots = [[-170, -100], [0, -100], [170, -100], [-170, 20], [0, 20], [170, 20],
                   [-170, 140], [0, 140], [170, 140]];

// ===========================================
// STATE
// ===========================================
let nodes, edges, network;
let selectedN = null;
let answerShown = false;
let skipN = 0;
let quizMode = false;
let quizPhase = 'order';         // 'order' | 'checkpoint' | 'render' | 'done'
let slotOf = {};
let nextExpected = 1;
let orderMistakes = 0;
let checkpointFirst = true, renderFirst = true;
let quizFeedback = '';

function isNarrow() { return window.innerWidth < 600; }
function isInIframe() {
    try { return window.self !== window.top; } catch (e) { return true; }
}
function step(n) { return steps[n - 1]; }
function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// ===========================================
// NETWORK
// ===========================================
function nodeFor(s) {
    let bg = s.color || 'white', border = s.color ? 'dimgray' : 'steelblue', font = s.font || 'black';
    let label = s.n + ' ' + s.name, dashes = false, pos = explorePos[s.n];
    if (quizMode) {
        pos = quizSlots[slotOf[s.n]];
        const placed = s.n < nextExpected;
        const revealColors = quizPhase === 'done';
        bg = revealColors ? (s.color || 'white') : 'white';
        font = revealColors ? (s.font || 'black') : 'black';
        border = placed ? 'green' : 'steelblue';
        label = placed ? s.n + ' ' + s.name : s.name;
    } else if (s.n === skipN) {
        bg = 'gainsboro'; border = 'darkgray'; font = 'gray'; dashes = [5, 5];
    }
    const sel = !quizMode && s.n === selectedN;
    return {
        id: s.n, label: label, x: pos[0], y: pos[1],
        shape: 'box', margin: 8,
        widthConstraint: { minimum: 112, maximum: 112 },
        heightConstraint: { minimum: 44, valign: 'middle' },
        color: { background: bg, border: sel ? 'black' : border,
                 highlight: { background: bg, border: 'black' },
                 hover: { background: bg, border: 'black' } },
        borderWidth: sel ? 4 : (quizMode && s.n < nextExpected ? 3 : 2),
        shapeProperties: { borderRadius: 6, borderDashes: dashes },
        font: { size: 17, face: 'Arial', color: font }
    };
}

function edgeList() {
    const list = [];
    for (let i = 1; i < 9; i++) {
        const key = i + '-' + (i + 1);
        list.push({ id: key, from: i, to: i + 1, title: edgeInfo[key] });
    }
    list.push({ id: '8-7', from: 8, to: 7, title: edgeInfo['8-7'], back: true });
    return list.map(e => {
        const touchesSkip = !quizMode && skipN && (e.from === skipN || e.to === skipN);
        const hideInQuiz = quizMode && quizPhase === 'order' && !(e.to < nextExpected && e.from < nextExpected);
        const base = {
            id: e.id, from: e.from, to: e.to, title: e.title,
            hidden: quizMode ? (hideInQuiz || e.back) : false,
            arrows: { to: { enabled: true, scaleFactor: 0.9 } },
            width: 2.5,
            color: { color: touchesSkip ? 'lightgray' : 'dimgray', hover: 'black', highlight: 'black' },
            dashes: touchesSkip ? [4, 6] : false,
            smooth: false
        };
        if (e.back) {
            base.label = 'drift found, up to 3 retries';
            base.dashes = [8, 6];
            base.color = { color: touchesSkip ? 'lightgray' : 'firebrick', hover: 'darkred', highlight: 'darkred' };
            base.font = { size: 15, face: 'Arial', color: 'firebrick', background: 'aliceblue',
                          strokeWidth: 0, vadjust: -14 };
            base.smooth = { type: 'curvedCCW', roundness: 0.9 };
        }
        if (e.id === '4-5' && !quizMode) {
            base.label = 'approved claims';
            base.font = { size: 15, face: 'Arial', color: 'darkorange', background: 'aliceblue', strokeWidth: 0 };
        }
        return base;
    });
}

// an invisible node above the bracket label so that fit() keeps the bracket in view
const PAD = { id: 'pad', x: 0, y: -192, shape: 'dot', size: 1, label: '',
              color: { background: 'rgba(0,0,0,0)', border: 'rgba(0,0,0,0)' }, shadow: false };

function initNetwork() {
    nodes = new vis.DataSet(steps.map(nodeFor).concat([PAD]));
    edges = new vis.DataSet(edgeList());
    const mouseNav = !isInIframe();
    const options = {
        layout: { improvedLayout: false },
        physics: { enabled: false },
        interaction: {
            dragNodes: false, dragView: mouseNav, zoomView: mouseNav,
            hover: true, navigationButtons: !isNarrow(),
            selectConnectedEdges: false, tooltipDelay: 100,
            keyboard: { enabled: false }
        },
        nodes: { shadow: { enabled: true, color: 'rgba(0,0,0,0.15)', size: 4, x: 2, y: 2 } }
    };
    network = new vis.Network(document.getElementById('network'), { nodes, edges }, options);
    network.on('click', onClick);
    network.on('beforeDrawing', drawBracket);
    network.on('hoverNode', () => { document.getElementById('network').style.cursor = 'pointer'; });
    network.on('blurNode', () => { document.getElementById('network').style.cursor = 'default'; });
    network.once('afterDrawing', fitView);
}

// bracket over steps 1-4, drawn in network coordinates
function drawBracket(ctx) {
    if (quizMode) return;
    const y = -160, x1 = -266, x2 = 266;
    ctx.strokeStyle = 'seagreen';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x1, y + 16); ctx.lineTo(x1, y); ctx.lineTo(x2, y); ctx.lineTo(x2, y + 16);
    ctx.moveTo(0, y); ctx.lineTo(0, y - 8);
    ctx.stroke();
    ctx.fillStyle = 'seagreen';
    ctx.font = 'bold 17px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Steps 1-4: reusable on their own', 0, y - 10);
}

function fitView() {
    network.fit({ animation: false, maxZoomLevel: 1.15 });
    const k = isNarrow() ? 0.98 : 0.9;
    const scale = network.getScale() * k;
    const c = network.getViewPosition();
    const shift = isNarrow() ? 0 : 22 / scale;     // room for the navigation buttons
    network.moveTo({ position: { x: c.x, y: c.y + shift }, scale: scale, animation: false });
}

function refresh() {
    nodes.update(steps.map(nodeFor));
    edges.update(edgeList());
}

let lastNarrow = null;
function applyLayoutMode() {
    const narrow = isNarrow();
    if (narrow === lastNarrow) return;
    lastNarrow = narrow;
    network.setOptions({ interaction: { navigationButtons: !narrow } });
}

function onClick(params) {
    if (params.nodes.length === 0 || params.nodes[0] === 'pad') return;
    const n = params.nodes[0];
    network.unselectAll();
    if (quizMode) { quizAnswer(n); return; }
    selectedN = n;
    answerShown = (n === skipN);
    refresh();
    renderPanel();
}

// ===========================================
// PANEL
// ===========================================
function renderPanel() {
    const panel = document.getElementById('panel');
    if (quizMode) { panel.innerHTML = quizHtml(); wireQuiz(); return; }
    let html = '';
    if (skipN) {
        const s = step(skipN);
        html += '<h3 style="font-family:Arial">Skipping step ' + s.n + ': ' + s.name + '</h3>' +
            '<div class="failure">' + esc(s.skip) + '</div>';
        if (selectedN === skipN) { panel.innerHTML = html; return; }
    }
    if (!selectedN) {
        html += '<p><b>Click any step</b> to read what it does, the file it writes, and what ' +
            'goes wrong if it is skipped.</p>' +
            '<p class="hint">Hover an arrow to see what passes along it.</p>' +
            '<div class="legend">' +
            '<span class="swatch" style="background:orange"></span>mandatory human checkpoint<br>' +
            '<span class="swatch" style="background:rebeccapurple"></span>the only image-model call<br>' +
            '<span style="color:firebrick;font-weight:bold">- - &gt;</span> render audit retry loop<br>' +
            '<span style="color:seagreen;font-weight:bold">[ ]</span> steps 1-4 also feed interactive MicroSims' +
            '</div>';
        panel.innerHTML = html;
        return;
    }
    const s = step(selectedN);
    const writesIsFile = /^[0-9a-z.-]+(\.yaml|\.md|\.png)$/.test(s.writes);
    html += '<h3 style="font-family:Arial">Step ' + s.n + ': ' + s.name + '</h3>' +
        '<p>' + esc(s.desc) + '</p>' +
        '<p><span class="label">Writes:</span> ' +
        (writesIsFile ? '<span class="writes">' + esc(s.writes) + '</span>' : esc(s.writes)) + '</p>' +
        '<p><span class="label">What goes wrong if this step is skipped?</span></p>';
    if (answerShown) {
        html += '<div class="failure">' + esc(s.skip) + '</div>';
    } else {
        html += '<p><button id="reveal-btn" class="btn">Show the answer</button></p>';
    }
    panel.innerHTML = html;
    const b = document.getElementById('reveal-btn');
    if (b) b.addEventListener('click', () => { answerShown = true; renderPanel(); });
}

// ===========================================
// SKIP A STEP
// ===========================================
function buildSkipSelect() {
    const sel = document.getElementById('skip-select');
    sel.innerHTML = '<option value="0">(none)</option>' +
        steps.map(s => '<option value="' + s.n + '">' + s.n + ' ' + s.name + '</option>').join('');
    sel.addEventListener('change', () => {
        skipN = parseInt(sel.value, 10);
        selectedN = skipN || selectedN;
        answerShown = true;
        refresh();
        renderPanel();
    });
}

// ===========================================
// SEQUENCE QUIZ
// ===========================================
function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function startQuiz() {
    quizMode = true;
    quizPhase = 'order';
    const slots = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    slotOf = {};
    steps.forEach((s, i) => { slotOf[s.n] = slots[i]; });
    nextExpected = 1;
    orderMistakes = 0;
    checkpointFirst = true;
    renderFirst = true;
    quizFeedback = '';
    selectedN = null;
    document.getElementById('quiz-btn').textContent = 'Explore';
    document.getElementById('skip-select').disabled = true;
    refresh();
    network.once('afterDrawing', fitView);
    renderPanel();
}

function stopQuiz() {
    quizMode = false;
    document.getElementById('quiz-btn').textContent = 'Sequence quiz';
    document.getElementById('skip-select').disabled = false;
    refresh();
    network.once('afterDrawing', fitView);
    renderPanel();
}

function quizAnswer(n) {
    const s = step(n);
    if (quizPhase === 'order') {
        if (n < nextExpected) return;                     // already placed
        if (n === nextExpected) {
            quizFeedback = '<p><span class="good">Yes: step ' + n + ', ' + s.name + '.</span></p>';
            nextExpected++;
            if (nextExpected > 9) {
                quizPhase = 'checkpoint';
                quizFeedback = '<p><span class="good">All nine steps are in order.</span></p>';
            }
        } else {
            orderMistakes++;
            quizFeedback = '<p><span class="bad">Not yet: ' + s.name + ' comes ' +
                (n > nextExpected ? 'later' : 'earlier') + '.</span> Think about what the next ' +
                'step needs as input.</p>';
        }
    } else if (quizPhase === 'checkpoint') {
        if (n === 4) {
            quizPhase = 'render';
            quizFeedback = '<p><span class="good">Correct: step 4, User checkpoint.</span> ' +
                'Nothing is laid out or rendered until the requester approves the claims.</p>';
        } else {
            checkpointFirst = false;
            quizFeedback = '<p><span class="bad">Not ' + s.name + '.</span> Which step waits for a ' +
                'person to approve the claims?</p>';
        }
    } else if (quizPhase === 'render') {
        if (n === 7) {
            quizPhase = 'done';
            quizFeedback = '<p><span class="good">Correct: step 7, Render.</span> It is the single ' +
                'image-model call; step 8 only reads the result and may send it back.</p>';
        } else {
            renderFirst = false;
            quizFeedback = '<p><span class="bad">Not ' + s.name + '.</span> Which step turns the ' +
                'locked prompt into pixels?</p>';
        }
    }
    refresh();
    renderPanel();
}

function quizHtml() {
    let html = '';
    if (quizPhase === 'order') {
        html += '<p class="hint">The steps are shuffled and unnumbered.</p>' +
            '<p><b>Click the steps in order, starting with step ' + nextExpected + '.</b></p>' +
            '<p>Placed: ' + (nextExpected - 1) + ' of 9 &middot; out-of-order clicks: ' + orderMistakes + '</p>';
    } else if (quizPhase === 'checkpoint') {
        html += '<p><b>Now click the step that is the mandatory human checkpoint.</b></p>';
    } else if (quizPhase === 'render') {
        html += '<p><b>Last: click the one step that calls the image model.</b></p>';
    } else {
        html += '<h3 style="font-family:Arial">Quiz complete</h3>' +
            '<p>Out-of-order clicks: ' + orderMistakes + '<br>Checkpoint on the first try: ' +
            (checkpointFirst ? 'yes' : 'no') + '<br>Image-model step on the first try: ' +
            (renderFirst ? 'yes' : 'no') + '</p>' +
            '<p><button id="again-btn" class="btn btn-primary">New quiz</button></p>';
    }
    return html + quizFeedback;
}

function wireQuiz() {
    const a = document.getElementById('again-btn');
    if (a) a.addEventListener('click', startQuiz);
}

// ===========================================
// STARTUP AND RESIZE
// ===========================================
document.addEventListener('DOMContentLoaded', function () {
    lastNarrow = isNarrow();
    buildSkipSelect();
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
        }, 120);
    });
});
