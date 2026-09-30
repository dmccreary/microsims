// Docker Lab Run Flow - vis-network
// CANVAS_HEIGHT: 560
// Learning objective (Analyze / diagnose): the learner diagnoses why a Docker Python lab
// fails to run by identifying which part of the path from browser to container is missing.
// Five nodes in a row (a column under 600 px): the lab page, docker-lab.js, the local
// service on port 5001, a fresh Docker container (the Lab Sandbox) and the output area.
// Arrows: Run clicked, code sent, container started, text returned, output displayed.
// "Break it" picks a failure; with "Diagnose first" on, the learner reads the symptom and
// clicks the part that is broken before the red node, the explanation and the fix appear.

// ===========================================
// DATA (from the Docker Python lab guide and docker-lab.js, as described in Chapter 11)
// ===========================================
const parts = [
    { id: 'page', label: 'Lab page\n(textarea, Run, Reset)', name: 'Lab page',
      role: 'The part of the textbook page the learner sees: a textarea with the starter code, ' +
            'Run and Reset buttons, and an output area. Every ID in one lab ends in the same ' +
            'suffix, such as -1.',
      breaks: 'A mismatched suffix, such as runDocker(\'2\') in a lab whose IDs end in -1, makes ' +
              'Run do nothing, with no error at all.' },
    { id: 'js', label: 'docker-lab.js', name: 'docker-lab.js',
      role: 'The shared script, listed under extra_javascript in mkdocs.yml, that defines ' +
            'runDocker() and resetDocker(). It sends the code to the local service and writes ' +
            'the reply into the output area.',
      breaks: 'If mkdocs.yml does not list it, runDocker is undefined: Run does nothing and the ' +
              'console shows a ReferenceError.' },
    { id: 'service', label: 'Local service\non port 5001', name: 'local service',
      role: 'A small HTTP service on the learner\'s own computer, started with ' +
            'bash scripts/run-python-docker.sh. It receives each run request on port 5001 and ' +
            'starts a container for it.',
      breaks: 'If it is not running, the output area says it cannot connect to the Python ' +
              'Docker service.' },
    { id: 'container', label: 'Fresh Docker container\n(Lab Sandbox)', name: 'Docker container',
      role: 'The Lab Sandbox: a fresh, isolated python:3.11-alpine container for every run, ' +
            'discarded afterward so no state carries over. It has only the standard library, ' +
            'no standard input and no files that persist.',
      breaks: 'input() raises EOFError, and importing a third-party package raises ' +
              'ModuleNotFoundError.' },
    { id: 'output', label: 'Output area', name: 'output area',
      role: 'The <pre> element under the editor. It shows the program\'s printed text, with ' +
            'errors in red, or "(program finished with no output)" when nothing was printed.',
      breaks: 'Nothing breaks here on its own; it only shows what came back. A run that prints ' +
              'nothing usually means the starter never calls print().' }
];

const arrows = [
    { id: 'a1', from: 'page', to: 'js', label: 'Run\nclicked',
      title: 'Clicking Run calls runDocker(\'1\'), which reads the code from the textarea docker-code-1.' },
    { id: 'a2', from: 'js', to: 'service', label: 'code\nsent',
      title: 'docker-lab.js sends the code as JSON in an HTTP POST to http://127.0.0.1:5001/run.' },
    { id: 'a3', from: 'service', to: 'container', label: 'container\nstarted',
      title: 'The service starts a fresh python:3.11-alpine container that runs the code once.' },
    { id: 'a4', from: 'container', to: 'js', label: 'text returned', back: true,
      title: 'The program\'s printed output, error text and return code travel back through the service to docker-lab.js as JSON.' },
    { id: 'a5', from: 'js', to: 'output', label: 'output displayed', over: true,
      title: 'docker-lab.js writes the printed text into the output area, with errors in red.' }
];

const scenarios = [
    { id: 'service', menu: 'Service not started', node: 'service', cut: ['a2'],
      symptom: 'You click Run. After a moment the output area says: "Cannot connect to the ' +
               'Python Docker service. Please open a terminal and run: bash ' +
               'scripts/run-python-docker.sh".',
      hint: 'The message was written into the output area, so the script ran. What did it fail to reach?',
      why: 'docker-lab.js did its job: it tried to send the code and reported the failed ' +
           'connection. Nothing was listening on port 5001.',
      fix: 'Run bash scripts/run-python-docker.sh in a separate terminal, then reload the page.' },
    { id: 'mkdocs', menu: 'Script missing from mkdocs.yml', node: 'js', cut: ['a1'],
      symptom: 'You click Run and nothing happens. The output area still says "Output will ' +
               'appear here after you click Run." The browser console shows "ReferenceError: ' +
               'runDocker is not defined".',
      hint: 'No request ever left the browser, and the console says a function is undefined.',
      why: 'The Run button calls runDocker(), but the script that defines it was never loaded ' +
           'on the page, so nothing is sent.',
      fix: 'Add js/docker-lab.js under extra_javascript (and css/docker-lab.css under ' +
           'extra_css) in mkdocs.yml, then rebuild or restart mkdocs serve.' },
    { id: 'input', menu: 'Starter program calls input()', node: 'container', cut: ['a4'],
      symptom: 'Run works and the service answers, but the output shows the prompt text and ' +
               'then a red error ending in "EOFError: EOF when reading a line".',
      hint: 'The service answered and Python ran. What does the sandbox not have?',
      why: 'The container runs the code with no standard input, so input() has nothing to read ' +
           'and Python raises EOFError.',
      fix: 'Edit the starter code in the lab page: replace input() with a fixed value, such as ' +
           'name = "Ada", and keep a print() call.' },
    { id: 'numpy', menu: 'Starter imports numpy', node: 'container', cut: ['a4'],
      symptom: 'The output area shows a red error: "ModuleNotFoundError: No module named ' +
               '\'numpy\'".',
      hint: 'The error came from Python itself, after the service answered.',
      why: 'The python:3.11-alpine image in the sandbox ships only the standard library.',
      fix: 'Rewrite the starter with the standard library only, or build a container image ' +
           'that includes the package.' },
    { id: 'suffix', menu: 'Run button calls runDocker(\'2\')', node: 'page', cut: ['a1'],
      symptom: 'You click Run and nothing happens, and the browser console shows no error at all.',
      hint: 'No error anywhere: the function exists, but it found nothing to run.',
      why: 'The lab\'s IDs end in -1, so runDocker(\'2\') looks for docker-code-2, finds nothing ' +
           'and quietly returns.',
      fix: 'Make the suffix match: every ID in this lab ends in -1, so the buttons must call ' +
           'runDocker(\'1\') and resetDocker(\'1\').' }
];

// ===========================================
// STATE
// ===========================================
let nodes, edges, network;
let selectedId = null;
let scenario = null;             // the active failure, or null
let mystery = false;             // the menu name was hidden ("Mystery: symptom only")
let solved = false;              // the broken part has been identified or revealed
let tries = 0;
let feedback = '';

function isNarrow() { return window.innerWidth < 600; }
function isInIframe() {
    try { return window.self !== window.top; } catch (e) { return true; }
}
function partById(id) { return parts.find(p => p.id === id); }
function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function diagnoseFirst() { return document.getElementById('diagnose-check').checked; }

// ===========================================
// NETWORK
// ===========================================
function position(i) {
    return isNarrow() ? { x: 0, y: (i - 2) * 104 } : { x: (i - 2) * 215, y: 0 };
}

function nodeFor(p, i) {
    const pos = position(i);
    const broken = scenario && solved && scenario.node === p.id;
    const sel = p.id === selectedId;
    const bg = broken ? 'mistyrose' : (p.id === 'container' ? 'lightcyan' : 'white');
    return {
        id: p.id, label: p.label, x: pos.x, y: pos.y,
        shape: 'box', margin: 9,
        widthConstraint: { minimum: 120, maximum: 120 },
        heightConstraint: { minimum: 48, valign: 'middle' },
        color: { background: bg, border: broken ? 'red' : (sel ? 'black' : 'steelblue'),
                 highlight: { background: bg, border: 'black' },
                 hover: { background: bg, border: 'black' } },
        borderWidth: broken ? 5 : (sel ? 4 : 2),
        shapeProperties: { borderRadius: 6 },
        font: { size: 18, face: 'Arial', color: 'black' }
    };
}

function edgeFor(a) {
    const cut = scenario && solved && scenario.cut.includes(a.id);
    let smooth = false;
    if (a.back) smooth = { type: 'curvedCW', roundness: isNarrow() ? 0.9 : 0.35 };
    if (a.over) smooth = { type: 'curvedCW', roundness: isNarrow() ? 0.6 : 0.28 };
    return {
        id: a.id, from: a.from, to: a.to, label: a.label, title: a.title,
        arrows: { to: { enabled: true, scaleFactor: 0.9 } },
        width: cut ? 3 : 2,
        dashes: cut ? [6, 6] : (a.back ? [8, 5] : false),
        color: { color: cut ? 'red' : (a.back || a.over ? 'darkslateblue' : 'dimgray'),
                 hover: 'black', highlight: 'black' },
        font: { size: a.back || a.over ? 16 : 14, face: 'Arial', color: cut ? 'red' : 'black', background: 'aliceblue',
                strokeWidth: 0, align: 'horizontal' },
        smooth: smooth
    };
}

function initNetwork() {
    nodes = new vis.DataSet(parts.map(nodeFor));
    edges = new vis.DataSet(arrows.map(edgeFor));
    const mouseNav = !isInIframe();
    const options = {
        layout: { improvedLayout: false },
        physics: { enabled: false },
        interaction: {
            dragNodes: false, dragView: mouseNav, zoomView: mouseNav,
            hover: true, navigationButtons: false,
            selectConnectedEdges: false, tooltipDelay: 100,
            keyboard: { enabled: false }
        },
        nodes: { shadow: { enabled: true, color: 'rgba(0,0,0,0.15)', size: 4, x: 2, y: 2 } }
    };
    network = new vis.Network(document.getElementById('network'), { nodes, edges }, options);
    network.on('click', onClick);
    network.on('hoverNode', () => { document.getElementById('network').style.cursor = 'pointer'; });
    network.on('blurNode', () => { document.getElementById('network').style.cursor = 'default'; });
    network.once('afterDrawing', fitView);
}

// fit() measures nodes only and leaves generous margins, so size the view from the known
// extent of the diagram instead, including the curved arrows and their labels
function fitView() {
    const el = document.getElementById('network');
    const gw = isNarrow() ? 430 : 4 * 215 + 120 + 40;
    const gh = isNarrow() ? 4 * 104 + 48 + 30 : 215;
    const scale = Math.min(el.clientWidth / gw, el.clientHeight / gh, 1.2);
    network.moveTo({ position: { x: 0, y: 0 }, scale: scale, animation: false });
}

function refresh() {
    nodes.update(parts.map(nodeFor));
    edges.update(arrows.map(edgeFor));
}

let lastNarrow = null;
function applyLayoutMode() {
    const narrow = isNarrow();
    if (narrow === lastNarrow) return;
    lastNarrow = narrow;
    refresh();                      // row <-> column positions
}

function onClick(params) {
    if (params.nodes.length === 0) return;
    const id = params.nodes[0];
    network.unselectAll();
    if (scenario && !solved) { diagnose(id); return; }
    selectedId = id;
    refresh();
    renderPanel();
}

// ===========================================
// PANEL
// ===========================================
function partHtml(p) {
    return '<h3>' + esc(p.label.replace('\n', ' ')) + '</h3>' +
        '<p><span class="label">Role:</span> ' + esc(p.role) + '</p>' +
        '<p><span class="label">One thing that can break it:</span> ' + esc(p.breaks) + '</p>';
}

function renderPanel() {
    const panel = document.getElementById('panel');
    if (!scenario) {
        if (!selectedId) {
            panel.innerHTML = '<p><b>Click any part of the path</b> to see its role and one ' +
                'thing that can break it. Hover an arrow to see what travels along it.</p>' +
                '<p class="hint">Then choose a failure in <b>Break it</b>. With <b>Diagnose ' +
                'first</b> checked, you read only the symptom and click the part you think is ' +
                'broken. <b>Mystery</b> hides the failure\'s name too.</p>';
        } else {
            panel.innerHTML = partHtml(partById(selectedId));
        }
        return;
    }
    const title = mystery && !solved ? 'Mystery failure' : scenario.menu;
    let html = '<h3 style="font-family:Arial">' + esc(title) + '</h3>';
    // on a phone-width panel the symptom gives way to the explanation once solved
    if (!(solved && isNarrow())) {
        html += '<div class="symptom"><span class="label">Symptom:</span> ' + esc(scenario.symptom) + '</div>';
    }
    if (!solved) {
        html += '<p><b>Click the part of the path that is broken.</b></p>' + feedback;
    } else {
        const p = partById(scenario.node);
        html += feedback +
            '<div class="cols"><div><p><span class="label">Broken part:</span> ' + esc(p.name) +
            '. ' + esc(scenario.why) + '</p></div>' +
            '<div><p><span class="label">Fix:</span> ' + esc(scenario.fix) + '</p></div></div>';
    }
    panel.innerHTML = html;
}

// ===========================================
// BREAK IT
// ===========================================
function buildMenu() {
    const sel = document.getElementById('break-select');
    sel.innerHTML = '<option value="">Nothing broken</option>' +
        scenarios.map(s => '<option value="' + s.id + '">' + esc(s.menu) + '</option>').join('') +
        '<option value="mystery">Mystery: symptom only</option>';
    sel.addEventListener('change', () => startScenario(sel.value));
    document.getElementById('diagnose-check').addEventListener('change', () => {
        const v = sel.value;
        if (v) startScenario(v);
    });
}

function startScenario(value) {
    selectedId = null;
    feedback = '';
    tries = 0;
    if (!value) {
        scenario = null;
        mystery = false;
        solved = false;
    } else {
        mystery = value === 'mystery';
        scenario = mystery ? scenarios[Math.floor(Math.random() * scenarios.length)]
                           : scenarios.find(s => s.id === value);
        // a mystery is always diagnosed first; otherwise the checkbox decides
        solved = !mystery && !diagnoseFirst();
    }
    refresh();
    renderPanel();
}

function diagnose(id) {
    tries++;
    const p = partById(id);
    if (id === scenario.node) {
        solved = true;
        feedback = '<p><span class="good">Yes: the ' + esc(p.name) + (tries === 1 ?
            ' on the first try.' : '.') + '</span>' +
            (mystery ? ' The failure was: ' + esc(scenario.menu) + '.' : '') + '</p>';
    } else {
        feedback = '<p><span class="bad">Not the ' + esc(p.name) + '.</span> Hint: ' +
            esc(scenario.hint) + '</p>';
    }
    refresh();
    renderPanel();
}

// ===========================================
// STARTUP AND RESIZE
// ===========================================
document.addEventListener('DOMContentLoaded', function () {
    lastNarrow = isNarrow();
    buildMenu();
    initNetwork();
    renderPanel();
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
