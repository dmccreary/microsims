// From Author to Learner - Mermaid top-to-bottom workflow with click callbacks
// CANVAS_HEIGHT: 600
// Learning objective (Understand / summarize): the learner summarizes the path a MicroSim takes
// from an author's files to a learner's browser.
// Every step has a Mermaid click directive that opens an infobox naming the command or tool
// used and what could go wrong at that step. Hovering the arrow between two steps shows the
// artifact passed along.

// ===========================================
// DIAGRAM SOURCE (Mermaid 10 flowchart, top to bottom)
// ===========================================
const diagramSource = `
flowchart TD
    Write["Author writes files<br/>(Markdown, HTML, JavaScript)"]:::author
    Preview["Local preview with<br/>mkdocs serve"]:::author
    Commit["Commit to Git"]:::git
    Push["Push to the<br/>GitHub repository"]:::git
    Deploy["mkdocs gh-deploy<br/>builds the site"]:::publish
    Pages["GitHub Pages<br/>serves the pages"]:::publish
    Browser["Learner's browser loads the page,<br/>the iframe, and the library from a CDN"]:::learner

    Write --> Preview --> Commit --> Push --> Deploy --> Pages --> Browser

    click Write showStep
    click Preview showStep
    click Commit showStep
    click Push showStep
    click Deploy showStep
    click Pages showStep
    click Browser showStep

    classDef author fill:rebeccapurple,stroke:#333,stroke-width:2px,color:white,font-size:16px
    classDef git fill:darkorange,stroke:#333,stroke-width:2px,color:black,font-size:16px
    classDef publish fill:seagreen,stroke:#333,stroke-width:2px,color:white,font-size:16px
    classDef learner fill:steelblue,stroke:#333,stroke-width:2px,color:white,font-size:16px
    linkStyle default stroke:dimgray,stroke-width:2px
`;

const phases = [
    { name: 'Authoring', color: 'rebeccapurple' },
    { name: 'Version control (Git, GitHub)', color: 'darkorange' },
    { name: 'Publishing (MkDocs, GitHub Pages)', color: 'seagreen' },
    { name: 'The learner', color: 'steelblue' }
];

// ===========================================
// STEP AND ARROW CONTENT
// ===========================================
const steps = {
    Write: {
        title: 'Author writes files', color: 'rebeccapurple',
        toolLabel: 'Tool',
        tool: 'A text editor or an AI agent\ndocs/sims/<sim-id>/main.html, <sim-id>.js,\nindex.md, metadata.json',
        wrong: 'A wrong iframe path (an absolute /sims/... instead of ../../sims/...) or a ' +
            'missing <main> element breaks the MicroSim before anyone sees it.'
    },
    Preview: {
        title: 'Local preview', color: 'rebeccapurple',
        toolLabel: 'Command',
        tool: 'mkdocs serve\nthen open http://127.0.0.1:8000',
        wrong: 'An error in mkdocs.yml stops the build. Skipping the preview lets clipped ' +
            'iframes and broken links reach readers.'
    },
    Commit: {
        title: 'Commit to Git', color: 'darkorange',
        toolLabel: 'Commands',
        tool: 'git add docs/sims/<sim-id>/\ngit commit -m "Add gravity lab"',
        wrong: 'Staging everything with "git add ." can commit secrets or build folders, ' +
            'and a vague message hides why the change was made.'
    },
    Push: {
        title: 'Push to GitHub', color: 'darkorange',
        toolLabel: 'Command',
        tool: 'git push',
        wrong: 'The push is rejected if the GitHub copy has commits you do not have. Pull, ' +
            'merge, and push again.'
    },
    Deploy: {
        title: 'Build and deploy the site', color: 'seagreen',
        toolLabel: 'Command',
        tool: 'mkdocs gh-deploy',
        wrong: 'It builds from your local copy, so uncommitted or out-of-date files get ' +
            'published. A build error stops the deploy.'
    },
    Pages: {
        title: 'GitHub Pages serves the site', color: 'seagreen',
        toolLabel: 'Service',
        tool: 'GitHub Pages (gh-pages branch)\nhttps://<user>.github.io/<repo>/',
        wrong: 'Changes can take a minute to appear, and absolute paths such as /sims/... ' +
            'break because the site lives under /<repo>/.'
    },
    Browser: {
        title: 'The learner\'s browser', color: 'steelblue',
        toolLabel: 'Tool',
        tool: 'A web browser loads index.html,\nthe iframe\'s main.html, and p5.js from the CDN',
        wrong: 'An iframe that is too short hides the controls, and an offline classroom ' +
            'cannot reach the CDN, so the MicroSim stays blank.'
    }
};

// What each arrow passes along (keyed "From-To")
const artifacts = {
    'Write-Preview': 'Source files: Markdown pages, main.html, the JavaScript sketch and ' +
        'metadata.json',
    'Preview-Commit': 'Files you have checked in the local preview',
    'Commit-Push': 'A commit: a saved snapshot of the changed files with a message',
    'Push-Deploy': 'The committed source, now also backed up on GitHub (gh-deploy builds ' +
        'from your local copy)',
    'Deploy-Pages': 'Built HTML pages, pushed to the gh-pages branch',
    'Pages-Browser': 'HTML pages, main.html and the sketch, sent over HTTPS'
};

let selected = null;

function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Called by the Mermaid click directives (securityLevel 'loose')
function showStep(id) {
    const s = steps[id];
    if (!s) return;
    selected = id;
    document.getElementById('info').innerHTML =
        '<h3><span class="swatch" style="background:' + s.color + '"></span>' + s.title + '</h3>' +
        '<p class="label">' + s.toolLabel + ':</p>' +
        '<code>' + escapeHtml(s.tool) + '</code>' +
        '<p><span class="wrong">What could go wrong:</span> ' + escapeHtml(s.wrong) + '</p>';
    document.querySelectorAll('#diagram .node').forEach(n => {
        n.classList.toggle('selected', nodeIdOf(n) === id);
    });
}
window.showStep = showStep;

function showDefault() {
    document.getElementById('info').innerHTML =
        '<h3>Seven steps, four phases</h3>' +
        '<p>Files you write become pages a learner reads: preview them, record them in Git, ' +
        'push them to GitHub, build and deploy the site, and GitHub Pages serves it.</p>' +
        '<p class="hint">Click a step to see the command or tool it uses and what can go ' +
        'wrong. Hover an arrow to see what it passes to the next step.</p>';
}

function renderLegend() {
    document.getElementById('legend').innerHTML = phases.map(p =>
        '<div><span class="swatch" style="background:' + p.color + '"></span>' + p.name + '</div>'
    ).join('');
}

function nodeIdOf(el) {
    const m = (el.id || '').match(/flowchart-(.+)-\d+$/);
    return m ? m[1] : null;
}

// ===========================================
// ARROW HOVER: wide invisible hit paths show the artifact tooltip
// ===========================================
function setupEdgeHover() {
    const svg = document.querySelector('#diagram svg');
    const tip = document.getElementById('edge-tip');
    const app = document.getElementById('app');
    svg.querySelectorAll('path.flowchart-link').forEach(path => {
        const m = (path.id || '').match(/^L-(.+)-(.+)-\d+$/);
        if (!m) return;
        const key = m[1] + '-' + m[2];
        if (!artifacts[key]) return;
        const hit = path.cloneNode(false);
        hit.removeAttribute('id');
        hit.removeAttribute('marker-end');
        hit.setAttribute('class', 'edge-hit');
        hit.setAttribute('style', 'stroke: transparent; stroke-width: 22px; fill: none; pointer-events: stroke;');
        path.parentNode.appendChild(hit);
        const move = (e) => {
            const r = app.getBoundingClientRect();
            let x = e.clientX - r.left + 14;
            let y = e.clientY - r.top + 12;
            x = Math.min(x, r.width - tip.offsetWidth - 6);
            y = Math.min(y, r.height - tip.offsetHeight - 6);
            tip.style.left = x + 'px';
            tip.style.top = y + 'px';
        };
        hit.addEventListener('mouseenter', (e) => {
            path.classList.add('hl');
            tip.innerHTML = '<b>Passes along:</b> ' + escapeHtml(artifacts[key]);
            tip.style.display = 'block';
            move(e);
        });
        hit.addEventListener('mousemove', move);
        hit.addEventListener('mouseleave', () => {
            path.classList.remove('hl');
            tip.style.display = 'none';
        });
    });
}

// ===========================================
// RENDER
// ===========================================
document.addEventListener('DOMContentLoaded', async function () {
    mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',       // required for click callbacks
        theme: 'default',
        flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis',
            nodeSpacing: 30,
            rankSpacing: 30,
            subGraphTitleMargin: { top: 10, bottom: 14 }
        }
    });
    renderLegend();
    showDefault();
    const host = document.getElementById('diagram');
    const { svg, bindFunctions } = await mermaid.render('workflow-svg', diagramSource);
    host.innerHTML = svg;
    if (bindFunctions) bindFunctions(host);
    setupEdgeHover();
});
