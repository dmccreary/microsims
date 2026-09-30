// Clickable Flowchart Anatomy - Mermaid 11
// CANVAS_HEIGHT: 520
// The drafting flowchart from Chapter 8, rendered from text. Every node has a
// Mermaid click directive whose callback fills the information panel with the
// node's shape, role and the Mermaid line that created it. Hovering shows the
// same text; the Yes/No labels and the arrows are clickable too. "Break it"
// removes the quotes from one label and shows Mermaid's real parse error.

// ---------------------------------------------------------------------------
// Mermaid source. The Done label contains parentheses, so it needs its quotes.
// ---------------------------------------------------------------------------
const NODE_LINES = {
    Start: 'Start("Learning objective written"):::startNode',
    Draft: 'Draft["AI drafts the MicroSim"]:::processNode',
    Check: 'Check{"Meets the<br/>objective?"}:::decisionNode',
    Done:  'Done("Publish (add to chapter)"):::endNode'
};
const BROKEN_DONE_LINE = 'Done(Publish (add to chapter)):::endNode';

const CLASS_DEFS = {
    startNode:    'classDef startNode fill:#667eea,stroke:#333,stroke-width:2px,color:#fff,font-size:16px',
    processNode:  'classDef processNode fill:#764ba2,stroke:#333,stroke-width:2px,color:#fff,font-size:16px',
    decisionNode: 'classDef decisionNode fill:#f093fb,stroke:#333,stroke-width:2px,color:#333,font-size:16px',
    endNode:      'classDef endNode fill:#1d6fb8,stroke:#333,stroke-width:2px,color:#fff,font-size:16px'
};

function buildSource(broken) {
    return [
        'flowchart TD',
        '    ' + NODE_LINES.Start,
        '    ' + NODE_LINES.Draft,
        '    ' + NODE_LINES.Check,
        '    ' + (broken ? BROKEN_DONE_LINE : NODE_LINES.Done),
        '',
        '    Start --> Draft --> Check',
        '    Check -->|Yes| Done',
        '    Check -->|No| Draft',
        '',
        '    ' + CLASS_DEFS.startNode,
        '    ' + CLASS_DEFS.processNode,
        '    ' + CLASS_DEFS.decisionNode,
        '    ' + CLASS_DEFS.endNode,
        '    linkStyle default stroke:#555,stroke-width:2px',
        '',
        '    click Start showNode "Show details"',
        '    click Draft showNode "Show details"',
        '    click Check showNode "Show details"',
        '    click Done showNode "Show details"'
    ].join('\n');
}

// ---------------------------------------------------------------------------
// Panel content
// ---------------------------------------------------------------------------
const NODE_INFO = {
    Start: {
        title: 'Learning objective written',
        shape: 'Rounded rectangle, written with ( )',
        role: 'Start: where the process begins. Rounded ends mark a start or an end.',
        cls: 'startNode', style: 'blue fill, white text'
    },
    Draft: {
        title: 'AI drafts the MicroSim',
        shape: 'Rectangle, written with [ ]',
        role: 'Process step: an action. The No branch returns here, so it can repeat.',
        cls: 'processNode', style: 'purple fill, white text'
    },
    Check: {
        title: 'Meets the objective?',
        shape: 'Diamond, written with { }',
        role: 'Decision: a question with one labeled arrow out for each answer.',
        cls: 'decisionNode', style: 'pink fill, dark text'
    },
    Done: {
        title: 'Publish (add to chapter)',
        shape: 'Rounded rectangle, written with ( )',
        role: 'End: where the process stops. Its label contains ( ), so it needs quotes.',
        cls: 'endNode', style: 'dark blue fill, white text'
    }
};

const EDGE_INFO = {
    'Check-Done': {
        title: 'Branch label "Yes"',
        role: 'A branch label names the condition for taking an arrow. When the draft meets the objective, the flow continues to Publish.',
        line: 'Check -->|Yes| Done'
    },
    'Check-Draft': {
        title: 'Branch label "No"',
        role: 'When the draft falls short, this arrow loops back to the drafting step. A loop back is how a flowchart shows iteration.',
        line: 'Check -->|No| Draft'
    },
    'Start-Draft': {
        title: 'Edge (arrow) from Start to Draft',
        role: 'An edge shows the order of steps. An arrow with no label simply means "then". One chained line created two edges.',
        line: 'Start --> Draft --> Check'
    },
    'Draft-Check': {
        title: 'Edge (arrow) from Draft to Check',
        role: 'An edge shows the order of steps. This arrow leads every draft into the decision. It comes from the same chained line.',
        line: 'Start --> Draft --> Check'
    }
};

const SHAPE_INFO = {
    rounded: { title: 'Rounded rectangle', role: 'Marks the start or end of a process. In this diagram: Start and Publish.', line: 'Id("Label")' },
    rect:    { title: 'Rectangle', role: 'A process step, an action someone or something performs. In this diagram: AI drafts the MicroSim.', line: 'Id["Label"]' },
    diamond: { title: 'Diamond', role: 'A decision with one labeled arrow per answer. In this diagram: Meets the objective?', line: 'Id{"Label?"}' },
    circle:  { title: 'Circle', role: 'A connector that joins flows or continues a diagram elsewhere. This small diagram does not need one.', line: 'Id(("Label"))' }
};

let pinned = null;          // HTML of the last clicked item, restored after hover
let broken = false;
let renderCount = 0;

function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function nodeCardHTML(id) {
    const n = NODE_INFO[id];
    return '<div class="card-title">' + esc(n.title) + '</div>' +
        '<div class="card-row"><b>Shape:</b> ' + esc(n.shape) + '</div>' +
        '<div class="card-row"><b>Role:</b> ' + esc(n.role) + '</div>' +
        '<div class="card-row"><b>Mermaid line:</b><code class="code">' + esc(NODE_LINES[id]) + '</code></div>' +
        '<div class="card-row"><b>Style class:</b> <code>:::' + n.cls + '</code> (' + n.style + ')</div>';
}

function edgeCardHTML(key) {
    const e = EDGE_INFO[key];
    return '<div class="card-title">' + esc(e.title) + '</div>' +
        '<div class="card-row"><b>Role:</b> ' + esc(e.role) + '</div>' +
        '<div class="card-row"><b>Mermaid line:</b><code class="code">' + esc(e.line) + '</code></div>';
}

function shapeCardHTML(key) {
    const s = SHAPE_INFO[key];
    return '<div class="card-title">' + esc(s.title) + '</div>' +
        '<div class="card-row"><b>Role:</b> ' + esc(s.role) + '</div>' +
        '<div class="card-row"><b>Syntax:</b><code class="code">' + esc(s.line) + '</code></div>';
}

function setCard(html, isError) {
    const card = document.getElementById('card');
    card.innerHTML = html;
    card.classList.toggle('error', !!isError);
}

function pin(html) {
    pinned = html;
    setCard(html);
}

// Mermaid click-directive callback: receives the node id
window.showNode = function (nodeId) {
    if (broken || !NODE_INFO[nodeId]) return;
    clearHighlights();
    const el = findNode(nodeId);
    if (el) el.classList.add('hl');
    pin(nodeCardHTML(nodeId));
};

// ---------------------------------------------------------------------------
// Rendering and wiring
// ---------------------------------------------------------------------------
function nodeIdOf(el) {
    return (el.id.match(/flowchart-(.+)-\d+$/) || [])[1];
}

function findNode(id) {
    return Array.from(document.querySelectorAll('#mermaid-box .node')).find(n => nodeIdOf(n) === id);
}

function clearHighlights() {
    document.querySelectorAll('#mermaid-box .hl').forEach(el => el.classList.remove('hl'));
}

function edgeKeyFromId(id) {
    const m = (id || '').match(/L[-_]([A-Za-z]+)[-_]([A-Za-z]+)[-_]\d+$/);
    return m ? m[1] + '-' + m[2] : null;
}

function wireDiagram() {
    const box = document.getElementById('mermaid-box');

    // Nodes: hover shows the same text as a click; keyboard users press Enter
    box.querySelectorAll('.node').forEach(node => {
        const id = nodeIdOf(node);
        if (!NODE_INFO[id]) return;
        node.setAttribute('tabindex', '0');
        node.setAttribute('role', 'button');
        node.setAttribute('aria-label', NODE_INFO[id].title + ': show details');
        node.addEventListener('mouseenter', () => {
            if (broken) return;
            node.classList.add('hl');
            setCard(nodeCardHTML(id));
        });
        node.addEventListener('mouseleave', () => {
            if (broken) return;
            clearHighlights();
            if (pinned) setCard(pinned);
        });
        node.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.showNode(id); }
        });
    });

    // Edge labels (Yes / No)
    box.querySelectorAll('g.edgeLabel').forEach(lbl => {
        const text = lbl.textContent.trim();
        if (!text) return;
        const key = text === 'Yes' ? 'Check-Done' : text === 'No' ? 'Check-Draft' : null;
        if (!key) return;
        lbl.setAttribute('tabindex', '0');
        lbl.setAttribute('role', 'button');
        lbl.setAttribute('aria-label', 'Branch label ' + text + ': show details');
        const show = () => {
            if (broken) return;
            clearHighlights();
            lbl.classList.add('hl');
            pin(edgeCardHTML(key));
        };
        lbl.addEventListener('click', show);
        lbl.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(); } });
    });

    // Edges: add a wide invisible hit path over each thin arrow
    box.querySelectorAll('path.flowchart-link').forEach(path => {
        const key = edgeKeyFromId(path.id) || edgeKeyFromId(path.getAttribute('data-id'));
        if (!key || !EDGE_INFO[key]) return;
        const hit = path.cloneNode(false);
        hit.removeAttribute('id');
        hit.removeAttribute('marker-end');
        hit.removeAttribute('marker-start');
        hit.setAttribute('class', 'edge-hit');
        hit.setAttribute('style', 'stroke: transparent; stroke-width: 14px; fill: none; pointer-events: stroke;');
        path.parentNode.insertBefore(hit, path.nextSibling);
        hit.addEventListener('click', () => {
            if (broken) return;
            clearHighlights();
            path.classList.add('hl');
            pin(edgeCardHTML(key));
        });
    });
}

async function renderDiagram() {
    const box = document.getElementById('mermaid-box');
    renderCount += 1;
    const { svg, bindFunctions } = await mermaid.render('flow' + renderCount, buildSource(false));
    box.innerHTML = svg;
    if (bindFunctions) bindFunctions(box);      // activates the click directives
    wireDiagram();
}

// ---------------------------------------------------------------------------
// Break it: remove the quotes from the Done label and show the parse error
// ---------------------------------------------------------------------------
async function toggleBreak() {
    const btn = document.getElementById('break-btn');
    const box = document.getElementById('mermaid-box');
    const status = document.getElementById('diagram-status');
    broken = !broken;
    btn.setAttribute('aria-pressed', String(broken));
    btn.textContent = broken ? 'Restore quotes' : 'Break it';
    clearHighlights();

    if (broken) {
        let message = '';
        try {
            await mermaid.parse(buildSource(true));
            message = 'No error was reported.';
        } catch (err) {
            // keep the first line and the token the parser tripped on
            const lines = String(err && err.message ? err.message : err).split('\n');
            const got = (lines[lines.length - 1].match(/got '([^']+)'/) || [])[1];
            message = lines[0] + (got ? " ... got '" + got + "'" : '');
        }
        box.classList.add('broken');
        status.hidden = false;
        status.textContent = 'Mermaid could not parse the changed source, so the diagram was not redrawn.';
        setCard('<div class="card-title">Parse error: quotes removed</div>' +
            '<div class="card-row"><b>Changed line:</b><code class="code">' + esc(BROKEN_DONE_LINE) + '</code></div>' +
            '<div class="card-row"><b>Mermaid says:</b><code class="code">' + esc(message) + '</code></div>' +
            '<div class="card-row">\'PS\' is the parser\'s name for an opening <code>(</code>. Without quotes, the <code>(</code> inside the label looks like the start of a new shape.</div>', true);
    } else {
        box.classList.remove('broken');
        status.hidden = true;
        await renderDiagram();
        pinned = null;
        setCard('<div class="card-title">Quotes restored</div>' +
            '<div class="card-row">With the label wrapped in quotes, Mermaid treats everything inside as text and the diagram renders again.</div>' +
            '<div class="card-row"><b>Fixed line:</b><code class="code">' + esc(NODE_LINES.Done) + '</code></div>');
    }
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async function () {
    mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',          // required for click callbacks
        theme: 'default',
        themeVariables: { fontSize: '16px' },
        flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis',
                     rankSpacing: 34, nodeSpacing: 40, padding: 10, diagramPadding: 6 }
    });

    document.getElementById('break-btn').addEventListener('click', toggleBreak);
    document.querySelectorAll('.key-item').forEach(b =>
        b.addEventListener('click', () => {
            if (broken) return;
            clearHighlights();
            pin(shapeCardHTML(b.dataset.shape));
        }));

    await renderDiagram();
});
