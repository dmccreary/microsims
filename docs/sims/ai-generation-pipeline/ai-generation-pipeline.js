// AI Generation Pipeline - Mermaid flowchart with click callbacks
// CANVAS_HEIGHT: 500
// Learning objective (Understand / explain): the learner explains the role of a prompt, a large
// language model, a skill, and an agent in generating a MicroSim.
// Every node has a Mermaid click directive that fills the infobox below the diagram with a
// plain-language definition and one example. Hovering a node highlights the arrows into and
// out of it. The dashed feedback arrow (checks -> agent) is clickable and explains why
// generated code must be tested.

// ===========================================
// DIAGRAM SOURCE (Mermaid 10 flowchart, left to right)
// ===========================================
// Left to right when there is room; top to bottom in narrow containers so the node text
// stays readable instead of shrinking with the whole diagram.
function diagramSource(direction) {
    return `
flowchart ${direction}
    Author(["Author writes a<br/>prompt or request"]):::author
    Agent["AI agent"]:::agent
    Skill["Skill<br/>(instructions, guides,<br/>templates)"]:::skill
    LLM["Large language<br/>model"]:::llm
    Files["MicroSim files<br/>(HTML, JavaScript,<br/>metadata)"]:::files
    Checks["Automated<br/>checks"]:::checks

    Author --> Agent
    Agent -->|loads| Skill
    Agent -->|asks| LLM
    LLM -->|code| Agent
    Agent -->|writes| Files
    Files --> Checks
    Checks -.->|errors to fix| Agent

    click Author showInfo
    click Agent showInfo
    click Skill showInfo
    click LLM showInfo
    click Files showInfo
    click Checks showInfo

    classDef author fill:rebeccapurple,stroke:#333,stroke-width:2px,color:white,font-size:16px
    classDef agent fill:steelblue,stroke:#333,stroke-width:2px,color:white,font-size:16px
    classDef skill fill:seagreen,stroke:#333,stroke-width:2px,color:white,font-size:16px
    classDef llm fill:darkorange,stroke:#333,stroke-width:2px,color:black,font-size:16px
    classDef files fill:slategray,stroke:#333,stroke-width:2px,color:white,font-size:16px
    classDef checks fill:crimson,stroke:#333,stroke-width:2px,color:white,font-size:16px
    linkStyle default stroke:dimgray,stroke-width:2px
`;
}

// ===========================================
// INFOBOX CONTENT
// ===========================================
const nodeInfo = {
    Author: {
        title: 'Author: the prompt or request', color: 'rebeccapurple',
        definition: 'A prompt is the text you give a language model to say what you want. The ' +
            'author states the goal, audience, library and learning behavior, then reviews ' +
            'the result at the end of the loop.',
        example: '"Use the microsim-generator skill to create a p5.js lab where learners ' +
            'predict how gravity changes a bounce."'
    },
    Agent: {
        title: 'AI agent', color: 'steelblue',
        definition: 'A program built around a language model that takes actions in a loop: ' +
            'it reads files, loads a skill, asks the model for code, writes files and runs ' +
            'tools until the task is finished.',
        example: 'A coding agent reads the request, loads the MicroSim skill, writes ' +
            'main.html and the .js file, runs the validator and fixes what it reports.'
    },
    Skill: {
        title: 'Skill: instructions, guides, templates', color: 'seagreen',
        definition: 'A packaged folder of instructions, reference guides and templates that ' +
            'the agent loads when a task matches, so the work follows the same careful ' +
            'method every time.',
        example: 'microsim-generator/ holds SKILL.md (rules for choosing a type), ' +
            'references/ (one guide per library) and assets/templates/ (starter files).'
    },
    LLM: {
        title: 'Large language model', color: 'darkorange',
        definition: 'A neural network trained on a very large body of text that predicts the ' +
            'most likely continuation. Because code is text, it can write JavaScript, but it ' +
            'cannot see whether the code works.',
        example: 'Asked for a gravity slider, it returns a sketch with createSlider() and a ' +
            'draw() loop, which may still hide a bug such as a slider below the iframe edge.'
    },
    Files: {
        title: 'MicroSim files', color: 'slategray',
        definition: 'What the agent writes into the MicroSim directory: main.html loads the ' +
            'library, the .js file holds the behavior, and index.md and metadata.json ' +
            'describe the MicroSim for readers and search tools.',
        example: 'docs/sims/bouncing-ball-gravity-lab/ with main.html, ' +
            'bouncing-ball-gravity-lab.js, index.md and metadata.json.'
    },
    Checks: {
        title: 'Automated checks', color: 'crimson',
        definition: 'Programs that test the generated files instead of trusting them: a quality ' +
            'score, a browser test that every control is visible inside the iframe, and a ' +
            'screenshot review.',
        example: 'A validator scores the directory out of 100; an iframe test fails a sim ' +
            'whose slider sits below the visible edge, and the agent fixes it.'
    },
    Feedback: {
        title: 'The dashed arrow: errors to fix', color: 'crimson',
        definition: 'Generated code must be tested because a language model writes fluent code ' +
            'whether or not it is correct. It may invent a function, use an outdated library ' +
            'version, or place controls outside the visible area.',
        exampleLabel: 'What the loop does:',
        example: 'The checks turn those hidden errors into messages the agent can act on. The ' +
            'loop repeats until the checks pass, and then the author reviews the result.'
    }
};

let selectedNode = null;

// Called by Mermaid click directives (securityLevel 'loose' is required) and by the
// dashed-arrow click handler
function showInfo(nodeId) {
    const info = nodeInfo[nodeId];
    if (!info) return;
    selectedNode = nodeId;
    document.getElementById('infobox').innerHTML =
        '<h3><span class="swatch" style="background:' + info.color + '"></span>' +
        info.title + '</h3>' +
        '<p>' + info.definition + '</p>' +
        '<p><span class="label">' + (info.exampleLabel || 'Example:') + '</span> ' +
        info.example + '</p>';
    document.querySelectorAll('#diagram .node').forEach(n => {
        n.classList.toggle('selected', nodeIdOf(n) === nodeId);
    });
}
window.showInfo = showInfo;

function showDefaultInfo() {
    document.getElementById('infobox').innerHTML =
        '<h3>How a MicroSim gets generated</h3>' +
        '<p>An author asks, an <b>agent</b> does the work, a <b>skill</b> tells it how, and a ' +
        '<b>language model</b> writes the code. Automated checks send errors back until they ' +
        'pass.</p>' +
        '<p class="hint">Click any box for a definition and an example. Hover a box to ' +
        'highlight its arrows. Click the dashed arrow to see why generated code is tested.</p>';
}

// ===========================================
// HOVER HIGHLIGHTING
// ===========================================
// Mermaid 10 node ids look like "flowchart-Agent-3"; edge paths carry classes
// "LS-<from> LE-<to>" and ids like "L-Checks-Agent-0".
function nodeIdOf(el) {
    const m = (el.id || '').match(/flowchart-(.+)-\d+$/);
    return m ? m[1] : null;
}

function edgeLabelFor(path, labels, paths) {
    const i = paths.indexOf(path);
    return i >= 0 ? labels[i] : null;
}

function setupInteractions() {
    const svg = document.querySelector('#diagram svg');
    const paths = Array.from(svg.querySelectorAll('path.flowchart-link'));
    const labels = Array.from(svg.querySelectorAll('.edgeLabels > g.edgeLabel'));

    svg.querySelectorAll('.node').forEach(node => {
        const id = nodeIdOf(node);
        node.addEventListener('mouseenter', () => {
            paths.forEach(p => {
                const touches = p.classList.contains('LS-' + id) || p.classList.contains('LE-' + id);
                p.classList.toggle('hl', touches);
                p.classList.toggle('dim', !touches);
                const lab = edgeLabelFor(p, labels, paths);
                if (lab) lab.classList.toggle('hl', touches);
            });
        });
        node.addEventListener('mouseleave', () => {
            paths.forEach(p => {
                p.classList.remove('hl', 'dim');
                const lab = edgeLabelFor(p, labels, paths);
                if (lab) lab.classList.remove('hl');
            });
        });
    });

    // The dashed feedback arrow and its label open the "why test" infobox.
    const feedback = paths.find(p => p.classList.contains('LS-Checks') && p.classList.contains('LE-Agent'));
    if (feedback) {
        // A wide transparent copy of the path makes the thin dashed line easy to click
        const hit = feedback.cloneNode(false);
        hit.removeAttribute('id');
        hit.removeAttribute('marker-end');
        hit.setAttribute('class', 'feedback-hit');
        hit.setAttribute('style', 'stroke: transparent; stroke-width: 18px; fill: none; pointer-events: stroke;');
        feedback.parentNode.appendChild(hit);
        const lab = edgeLabelFor(feedback, labels, paths);
        [hit, lab].forEach(el => {
            if (!el) return;
            el.style.cursor = 'pointer';
            el.addEventListener('click', () => showInfo('Feedback'));
            el.addEventListener('mouseenter', () => feedback.classList.add('hl'));
            el.addEventListener('mouseleave', () => feedback.classList.remove('hl'));
        });
    }
}

// ===========================================
// RENDER
// ===========================================
let currentDirection = null;
let renderCount = 0;

function wantedDirection() {
    return document.getElementById('diagram-panel').clientWidth < 560 ? 'TB' : 'LR';
}

async function renderDiagram() {
    const direction = wantedDirection();
    if (direction === currentDirection) return;
    currentDirection = direction;
    const host = document.getElementById('diagram');
    renderCount++;
    const { svg, bindFunctions } = await mermaid.render('pipeline-svg-' + renderCount,
        diagramSource(direction));
    host.innerHTML = svg;
    if (bindFunctions) bindFunctions(host);   // attaches the click directives
    setupInteractions();
    if (selectedNode && selectedNode !== 'Feedback') showInfo(selectedNode);
}

document.addEventListener('DOMContentLoaded', async function () {
    mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',       // required for click callbacks
        theme: 'default',
        flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis',
            nodeSpacing: 34,
            rankSpacing: 48,
            subGraphTitleMargin: { top: 10, bottom: 14 }
        }
    });
    showDefaultInfo();
    await renderDiagram();
    let resizeTimer = null;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(renderDiagram, 150);
    });
});
