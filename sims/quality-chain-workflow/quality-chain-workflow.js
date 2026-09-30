// Quality Chain Workflow - Mermaid flowchart with click callbacks on every node and edge
// CANVAS_HEIGHT: 560
// Learning objective (Understand / explain): the learner explains the order of the quality
// chain, what each step checks, and what happens after a failure.
// Every node has a Mermaid click directive (with a one-line hover tooltip) that fills the
// infobox with a definition, the tool and command, and the chapter section. Mermaid has no click
// directive for edges, so each edge gets a click handler after rendering (a wide invisible hit
// path plus its label) that explains the edge's condition. "Trace a failure" steps through the
// path of a MicroSim that fails the iframe height test (the tester guide's predator-prey sample).

// ===========================================
// DIAGRAM SOURCE (Mermaid 10 flowchart, top to bottom)
// ===========================================
const NODE_TOOLTIPS = {
    V: 'Score the folder out of 100',
    C: 'Save a PNG at the iframe height',
    L: 'Walk the visual checklist; patch up to 3 cycles',
    H: 'Check every control fits inside the iframe',
    G: 'Pass or fail the bar',
    P: 'Smallest change, in the file that causes the failure',
    S: 'Report what remains after the third cycle',
    B: 'Enters the chapter; TODO.md entry ticked'
};

function diagramSource() {
    const lines = [
        'flowchart TD',
        '    V["Validate score"]:::check',
        '    C["Capture screenshot"]:::check',
        '    L["Layout review"]:::check',
        '    H["Iframe height test"]:::check',
        '    G{"Quality gate"}:::gate',
        '    P["Patch source"]:::fix',
        '    S(["Stop and escalate<br/>to a person"]):::stop',
        '    B(["Carry into the book"]):::done',
        '    V -->|score| C',
        '    C -->|PNG| L',
        '    L -->|reviewed| H',
        '    H -->|results| G',
        '    G -->|pass| B',
        '    G -->|fail| P',
        '    P -->|re-capture| C',
        '    L -.->|third cycle reached| S'
    ];
    Object.keys(NODE_TOOLTIPS).forEach(id => {
        lines.push('    click ' + id + ' nodeClick "' + NODE_TOOLTIPS[id] + '"');
    });
    lines.push(
        '    classDef check fill:steelblue,stroke:#333,stroke-width:2px,color:white,font-size:16px',
        '    classDef gate fill:gold,stroke:#333,stroke-width:2px,color:black,font-size:16px',
        '    classDef fix fill:darkorange,stroke:#333,stroke-width:2px,color:black,font-size:16px',
        '    classDef stop fill:firebrick,stroke:#333,stroke-width:2px,color:white,font-size:16px',
        '    classDef done fill:seagreen,stroke:#333,stroke-width:2px,color:white,font-size:16px',
        '    linkStyle default stroke:dimgray,stroke-width:2px'
    );
    return lines.join('\n');
}

// ===========================================
// INFOBOX CONTENT
// ===========================================
const NODE_INFO = {
    V: { title: 'Validate score', color: 'steelblue',
        def: 'Scores the MicroSim folder out of 100 against the rubric: files, metadata and documentation sections. It measures presence, not learning value, and it always exits normally.',
        tool: 'python3 validate-sims.py --project-dir . --sim <id> --verbose',
        section: 'Scoring Quality: Quality Score, 100-Point Rubric, Validation Script' },
    C: { title: 'Capture screenshot', color: 'steelblue',
        def: 'Renders the MicroSim in headless Chromium, 800 px wide and as tall as the iframe in index.md, and saves <id>.png as the evidence for review.',
        tool: 'bk-capture-screenshot docs/sims/<id> 3 <iframe-height>',
        section: 'Screenshot Capture' },
    L: { title: 'Layout review', color: 'steelblue',
        def: 'A vision-based review walks the 29-item visual checklist against the screenshot, marks each item PASS, FAIL or N/A, and applies the smallest patch for each FAIL, for up to three cycles.',
        tool: 'layout-reviewer (microsim-utils): visual-checklist.md and common-fixes.md',
        section: 'Layout Review, Visual Checklist, Vision-Based Review' },
    H: { title: 'Iframe height test', color: 'steelblue',
        def: 'Loads main.html in Playwright at 700 px wide and the iframe height. A control passes when its bottom is at most the height plus 5 px. On FAIL it suggests content + 10, rounded up to a multiple of 10, and exits with status 1.',
        tool: 'python3 test-iframe-heights.py --sims-dir docs/sims --sim <id>',
        section: 'Control Visibility Test, Iframe Height Test' },
    G: { title: 'Quality gate', color: 'goldenrod',
        def: 'The pass-or-fail bar. A MicroSim carried over from version 1.0 needs a score of 85, width responsiveness and a correct iframe height; a new one needs 70. Every MicroSim must pass the height and visibility tests.',
        tool: 'No script enforces it yet: you read the results of the other steps (a build-failing gate is designed, not built).',
        section: 'Quality Gate' },
    P: { title: 'Patch source', color: 'darkorange',
        def: 'Make the smallest change that resolves the failure, in the file that causes it: the .js for most libraries, main.html for Mermaid, a data file for data defects. A height failure is fixed in the CANVAS_HEIGHT comment and synced to every embed.',
        tool: 'python3 sync-iframe-heights.py --project-dir . --sim <id>',
        section: 'Smallest Patch Rule' },
    S: { title: 'Stop and escalate to a person', color: 'firebrick',
        def: 'After the third review-and-patch cycle with failures left, stop. Report the library and files touched, each defect with evidence, each edit, the final state and the model version.',
        tool: 'The layout reviewer\'s report (clean, partial or unfixed)',
        section: 'Fix Cycle Limit' },
    B: { title: 'Carry into the book', color: 'seagreen',
        def: 'The MicroSim enters the chapter that adopted it, embedded with a relative path, and its entry in the audit\'s TODO.md is ticked off.',
        tool: '<iframe src="../../sims/<id>/main.html" height="...px" scrolling="no">',
        section: 'Running the Whole Chain' }
};

const EDGE_INFO = {
    'V-C': { title: 'Validate score → Capture screenshot', cond: 'After scoring. Fix the largest missing items first (sort the --verbose issue list by points), then move on to the browser checks.' },
    'C-L': { title: 'Capture screenshot → Layout review', cond: 'The PNG exists at exactly the iframe height, so the review sees what readers see. A blank image is a capture problem: raise the delay from 3 to 5 seconds.' },
    'L-H': { title: 'Layout review → Iframe height test', cond: 'The checklist passes, or its FAILs were patched within the cycle limit. Controls clipped at the bottom are handed to the height test, which gives a precise number.' },
    'H-G': { title: 'Iframe height test → Quality gate', cond: 'The tester reports PASS or FAIL per control and a suggested height, and it exits with status 1 if anything failed.' },
    'G-B': { title: 'Quality gate → Carry into the book (pass)', cond: 'Pass: score at least 85 for a carried-over MicroSim (70 for a new one), width-responsive, and the height and visibility tests PASS.' },
    'G-P': { title: 'Quality gate → Patch source (fail)', cond: 'Fail: for example, score below 85 for a carried-over MicroSim, a control below the iframe edge, or a layout that is not width-responsive.' },
    'P-C': { title: 'Patch source → Capture screenshot (re-capture)', cond: 'After every patch the chain runs again from the screenshot, because a patch can move a control.' },
    'L-S': { title: 'Layout review → Stop and escalate (third cycle reached)', cond: 'Third cycle reached and FAILs remain. Repeated tweaking usually means a deeper design problem, so a person takes over.' }
};

// the path of a MicroSim that fails the height test, then passes after a height patch
const TRACE = [
    { node: 'V', text: 'Validate score: say the MicroSim scores 88, grade A. The score part of the gate is met, so the chain continues.' },
    { node: 'C', edge: 'V-C', text: 'Capture screenshot at the declared iframe height, 697 px.' },
    { node: 'L', edge: 'C-L', text: 'Layout review: the bottom control is cut off. That is an iframe-height defect, so it is handed to the height test instead of being patched here.' },
    { node: 'H', edge: 'L-H', text: 'Iframe height test: FAIL. Content height 720; a control\'s bottom is below 697 + 5 = 702. Suggested height: 720 + 10 = 730.' },
    { node: 'G', edge: 'H-G', text: 'Quality gate: fail. A good score does not rescue a failed height test.' },
    { node: 'P', edge: 'G-P', text: 'Patch source: set // CANVAS_HEIGHT to 728 and run sync-iframe-heights.py, which writes 730px into index.md and every chapter embed.' },
    { node: 'C', edge: 'P-C', text: 'Re-capture at 730 px, because the patch changed the height.' },
    { node: 'L', edge: 'C-L', text: 'Layout review: every checklist item passes.' },
    { node: 'H', edge: 'L-H', text: 'Iframe height test: PASS at 730.' },
    { node: 'G', edge: 'H-G', text: 'Quality gate: pass. Score, responsiveness, height and visibility all pass.' },
    { node: 'B', edge: 'G-B', text: 'Carry into the book: the chapter embeds it and its TODO.md entry is ticked.' }
];
let traceStep = -1;      // -1: not tracing
let selectedNode = null;

// ===========================================
// INFOBOX RENDERING
// ===========================================
function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function showNode(id) {
    const n = NODE_INFO[id];
    if (!n) return;
    selectedNode = id;
    document.getElementById('infobox').innerHTML =
        '<span class="kind" style="background:' + n.color + '">step</span>' +
        '<h3>' + esc(n.title) + '</h3>' +
        '<p>' + esc(n.def) + '</p>' +
        '<p class="label">Tool and command</p><code>' + esc(n.tool) + '</code>' +
        '<p><span class="label">Chapter section:</span> ' + esc(n.section) + '</p>';
    markSelected();
}

function showEdge(key) {
    const e = EDGE_INFO[key];
    if (!e) return;
    selectedNode = null;
    markSelected();
    document.getElementById('infobox').innerHTML =
        '<span class="kind" style="background:royalblue">condition</span>' +
        '<h3>' + esc(e.title) + '</h3>' +
        '<p>' + esc(e.cond) + '</p>' +
        '<p class="hint">Click a box for its tool and command.</p>';
}

function showDefault() {
    document.getElementById('infobox').innerHTML =
        '<h3>The quality chain</h3>' +
        '<p>Score first, then capture, review, and test the height. The gate lets a MicroSim into ' +
        'the book or sends it back to be patched and re-checked. Three review cycles is the limit.</p>' +
        '<p class="hint">Click any box or arrow label to see what it checks. Hover a box for a ' +
        'one-line summary. Press <b>Trace a failure</b> to follow a MicroSim that fails the height test.</p>';
}

// called by the Mermaid click directives (securityLevel 'loose' is required)
window.nodeClick = function (id) {
    if (traceStep >= 0) clearTrace(false);
    showNode(id);
};

// ===========================================
// SVG LOOKUP HELPERS (Mermaid 10: node ids "flowchart-V-3"; edges "LS-V LE-C")
// ===========================================
function nodeIdOf(el) {
    const m = (el.id || '').match(/flowchart-(.+)-\d+$/);
    return m ? m[1] : null;
}
function nodeEl(id) {
    return Array.from(document.querySelectorAll('#diagram .node')).find(n => nodeIdOf(n) === id);
}
function edgePaths() {
    return Array.from(document.querySelectorAll('#diagram path.flowchart-link'));
}
function edgeKeyOf(path) {
    const from = Array.from(path.classList).find(c => c.startsWith('LS-'));
    const to = Array.from(path.classList).find(c => c.startsWith('LE-'));
    return from && to ? from.slice(3) + '-' + to.slice(3) : null;
}
function edgePath(key) { return edgePaths().find(p => edgeKeyOf(p) === key); }

function markSelected() {
    document.querySelectorAll('#diagram .node').forEach(n => {
        n.classList.toggle('sel', nodeIdOf(n) === selectedNode && traceStep < 0);
    });
}

// edges: a wide invisible copy of each path, and its label, open the edge infobox
function wireEdges() {
    const paths = edgePaths();
    const labels = Array.from(document.querySelectorAll('#diagram .edgeLabels > g.edgeLabel'));
    paths.forEach((p, i) => {
        const key = edgeKeyOf(p);
        if (!key) return;
        const hit = p.cloneNode(false);
        hit.removeAttribute('id');
        hit.removeAttribute('marker-end');
        hit.removeAttribute('marker-start');
        hit.setAttribute('class', 'edge-hit');
        hit.setAttribute('style', 'stroke: transparent; stroke-width: 16px; fill: none; pointer-events: stroke;');
        p.parentNode.appendChild(hit);
        const lab = labels[i];
        [hit, lab].forEach(el => {
            if (!el) return;
            el.addEventListener('click', () => { if (traceStep >= 0) clearTrace(false); showEdge(key); });
            el.addEventListener('mouseenter', () => { p.classList.add('hl'); if (lab) lab.classList.add('hl'); });
            el.addEventListener('mouseleave', () => { p.classList.remove('hl'); if (lab) lab.classList.remove('hl'); });
        });
    });
}

// ===========================================
// TRACE A FAILURE (step-through)
// ===========================================
function renderTrace() {
    document.querySelectorAll('#diagram .node').forEach(n => n.classList.remove('trace', 'trace-now', 'sel'));
    edgePaths().forEach(p => p.classList.remove('traced'));
    for (let i = 0; i <= traceStep; i++) {
        const s = TRACE[i];
        const el = nodeEl(s.node);
        if (el) el.classList.add(i === traceStep ? 'trace-now' : 'trace');
        if (s.edge) { const p = edgePath(s.edge); if (p) p.classList.add('traced'); }
    }
    const s = TRACE[traceStep];
    document.getElementById('infobox').innerHTML =
        '<span class="kind" style="background:darkorange">trace</span>' +
        '<h3>Step ' + (traceStep + 1) + ' of ' + TRACE.length + ': ' + esc(NODE_INFO[s.node].title) + '</h3>' +
        '<p>' + esc(s.text) + '</p>' +
        (traceStep < TRACE.length - 1 ? '<p class="hint">Press <b>Next step</b> to continue.</p>'
            : '<p class="hint">The failure sent the MicroSim around the loop once: patch, then the whole chain again from the screenshot.</p>');
    document.getElementById('trace-btn').textContent =
        traceStep < TRACE.length - 1 ? 'Next step' : 'Trace again';
}

function traceNext() {
    if (traceStep >= TRACE.length - 1) traceStep = -1;
    traceStep++;
    selectedNode = null;
    renderTrace();
}

function clearTrace(resetBox) {
    traceStep = -1;
    document.querySelectorAll('#diagram .node').forEach(n => n.classList.remove('trace', 'trace-now'));
    edgePaths().forEach(p => p.classList.remove('traced'));
    document.getElementById('trace-btn').textContent = 'Trace a failure';
    if (resetBox !== false) { selectedNode = null; markSelected(); showDefault(); }
}

// ===========================================
// RENDER (re-rendered on resize so the diagram always fits its panel)
// ===========================================
let renderCount = 0;
let lastWidth = -1;

async function renderDiagram() {
    const panel = document.getElementById('diagram-panel');
    if (panel.clientWidth === lastWidth) return;
    lastWidth = panel.clientWidth;
    renderCount++;
    const { svg, bindFunctions } = await mermaid.render('quality-chain-svg-' + renderCount, diagramSource());
    const host = document.getElementById('diagram');
    host.innerHTML = svg;
    if (bindFunctions) bindFunctions(host);   // attaches the click directives and tooltips
    const el = host.querySelector('svg');
    if (el) {
        el.setAttribute('aria-label', 'Top-to-bottom flowchart: Validate score, Capture screenshot, ' +
            'Layout review, Iframe height test, Quality gate. The gate passes to Carry into the book or ' +
            'fails to Patch source, which returns to Capture screenshot. Layout review escalates to a ' +
            'person after the third cycle.');
    }
    wireEdges();
    if (traceStep >= 0) renderTrace(); else markSelected();
}

document.addEventListener('DOMContentLoaded', async function () {
    mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',        // required for click callbacks
        theme: 'default',
        flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis',
            nodeSpacing: 36,
            rankSpacing: 32
        }
    });
    showDefault();
    document.getElementById('trace-btn').addEventListener('click', traceNext);
    document.getElementById('clear-btn').addEventListener('click', () => clearTrace(true));
    await renderDiagram();
    let timer = null;
    window.addEventListener('resize', function () {
        clearTimeout(timer);
        timer = setTimeout(renderDiagram, 150);
    });
});
