// Metadata Section Explorer - vis-network
// CANVAS_HEIGHT: 500
// Explore the H-Bridge metadata.json (data.json, an unmodified copy of the STEM
// Robots file) as a network: a microsim root, the five required sections, and
// the three optional sections. Required-field lists, types and descriptions are
// read from microsim-schema.json (an unmodified copy of this repository's
// src/microsim-schema/microsim-schema.json). No field value is invented.

const REQUIRED_SECTIONS = ['dublinCore', 'search', 'educational', 'technical', 'userInterface'];
const OPTIONAL_SECTIONS = ['simulation', 'analytics', 'usage'];

// One color per required section (Tableau 10 palette); optional sections are gray
const SECTION_COLORS = {
    dublinCore: '#4e79a7',
    search: '#f28e2b',
    educational: '#59a14f',
    technical: '#b07aa1',
    userInterface: '#e15759'
};
const OPTIONAL_COLOR = '#9e9e9e';

// One-sentence purpose of each section, from Chapters 2 and 15
const SECTION_PURPOSE = {
    dublinCore: 'Describes what the MicroSim is with the Dublin Core vocabulary, so any library or repository can catalog it.',
    search: 'Written for discovery: tags, keywords and constrained values that search tools and facets filter on.',
    educational: 'Says who the MicroSim is for and what it teaches, so a teacher can judge fit without running it.',
    technical: 'Says how the MicroSim is built and what it needs to run, so a deployer can judge compatibility.',
    userInterface: 'Lists the controls and visual elements the learner works with.',
    simulation: 'Optional: the simulation model, its variables and its scenarios.',
    analytics: 'Optional: learning-analytics events and indicators, reserved for the event design of Chapters 16 and 17.',
    usage: 'Optional: recommended usage, teaching strategies and assessment questions.'
};

let hb = null;            // the H-Bridge "microsim" object from data.json
let schema = null;        // schema.properties.microsim from microsim-schema.json
let nodes, edges, network;
let expanded = null;      // name of the expanded section
let quiz = null;          // { items:[{sec,field}], index, answered, correct, attempts, lastPick }
const MIN_SCALE = 0.72;   // with 17px fonts, labels never render below about 12px

// ---------- environment ----------
function isInIframe() {
    try { return window.self !== window.top; } catch (e) { return true; }
}

// ---------- schema helpers ----------
function sectionDef(sec) { return schema.properties[sec]; }

function fieldsOf(sec) {
    if (hb[sec]) return Object.keys(hb[sec]);
    return Object.keys(sectionDef(sec).properties || {});
}

function isRequired(sec, field) {
    return (sectionDef(sec).required || []).includes(field);
}

function typeText(def) {
    if (!def) return 'not defined in the schema';
    if (def.enum) return def.type + ', one of ' + def.enum.length + ' allowed values';
    if (def.type === 'array') {
        const it = def.items || {};
        if (it.enum) return 'array of ' + it.type + 's from ' + it.enum.length + ' allowed values';
        return 'array of ' + (it.type || 'items') + 's';
    }
    if (def.type === 'integer' && def.minimum !== undefined) return 'integer from ' + def.minimum + ' to ' + def.maximum;
    return def.type || 'unspecified';
}

function describeField(sec, field) {
    const def = (sectionDef(sec).properties || {})[field];
    if (!def) return 'This field is not defined in the schema.';
    if (def.description) return def.description;
    if (def.type === 'object' && def.properties) {
        return 'The schema gives no description; it defines an object with ' + Object.keys(def.properties).join(', ') + '.';
    }
    if (def.type === 'array' && def.items && def.items.properties) {
        return 'The schema gives no description; it defines a list of objects with ' + Object.keys(def.items.properties).slice(0, 6).join(', ') + '.';
    }
    return 'The schema gives no description for this field.';
}

function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function valueText(v, maxLen) {
    let s = typeof v === 'string' ? '"' + v + '"' : JSON.stringify(v, null, 1);
    s = s.replace(/\n\s*/g, ' ');
    if (s.length > maxLen) s = s.slice(0, maxLen - 1) + '…';
    return s;
}

function tint(hex, amount) {
    const n = parseInt(hex.slice(1), 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    const mix = c => Math.round(c + (255 - c) * amount);
    return 'rgb(' + mix(r) + ',' + mix(g) + ',' + mix(b) + ')';
}

function tooltipEl(text) {
    const d = document.createElement('div');
    d.textContent = text;
    return d;
}

// ---------- graph construction ----------
function sectionNode(sec, i) {
    const req = REQUIRED_SECTIONS.includes(sec);
    let angle, r;
    if (req) { angle = -Math.PI / 2 + i * 2 * Math.PI / 5; r = 170; }
    else { angle = -Math.PI / 2 + (i * 2 + 3) * Math.PI / 5; r = 120; }
    const col = req ? SECTION_COLORS[sec] : OPTIONAL_COLOR;
    return {
        id: 'sec:' + sec,
        label: req ? sec : sec + '\n(optional)',
        x: Math.round(r * Math.cos(angle)), y: Math.round(r * Math.sin(angle)),
        shape: 'box',
        margin: req ? 10 : 6,
        borderWidth: 2,
        color: { background: req ? col : '#eeeeee', border: req ? col : OPTIONAL_COLOR,
                 highlight: { background: req ? col : '#e0e0e0', border: 'black' },
                 hover: { background: req ? col : '#e0e0e0', border: 'black' } },
        font: { size: req ? 18 : 16, color: req ? 'white' : '#424242', face: 'Arial' },
        title: tooltipEl(sec + ': ' + (sectionDef(sec).description || '') +
            (req ? ' (required section)' : ' (optional section)'))
    };
}

function buildBaseGraph() {
    const n = [{
        id: 'root', label: 'microsim', x: 0, y: 0, shape: 'ellipse',
        color: { background: 'white', border: '#333333', highlight: { background: 'white', border: 'black' } },
        borderWidth: 2, font: { size: 18, face: 'Arial' },
        title: tooltipEl('microsim: the single top-level object; the schema requires dublinCore, search, educational, technical and userInterface inside it.')
    }];
    const e = [];
    REQUIRED_SECTIONS.forEach((sec, i) => {
        n.push(sectionNode(sec, i));
        e.push({ id: 'e:' + sec, from: 'root', to: 'sec:' + sec, color: { color: '#777777' }, width: 2 });
    });
    OPTIONAL_SECTIONS.forEach((sec, i) => {
        n.push(sectionNode(sec, i));
        e.push({ id: 'e:' + sec, from: 'root', to: 'sec:' + sec, color: { color: '#aaaaaa' }, width: 1.5, dashes: [6, 4] });
    });
    return { n, e };
}

function fieldNode(sec, field, x, y) {
    const req = isRequired(sec, field);
    const col = SECTION_COLORS[sec] || OPTIONAL_COLOR;
    const hidden = document.getElementById('required-only').checked && !req;
    return {
        id: 'fld:' + sec + ':' + field,
        label: field,
        x: x, y: y,
        shape: 'box',
        margin: 7,
        borderWidth: 2,
        shapeProperties: { borderDashes: req ? false : [5, 4] },
        color: { background: tint(col, 0.8), border: col,
                 highlight: { background: tint(col, 0.6), border: 'black' },
                 hover: { background: tint(col, 0.65), border: col } },
        font: { size: 17, face: 'Arial', color: 'black' },
        hidden: hidden,
        title: tooltipEl(field + ' (' + (req ? 'required' : 'optional') + '): ' + describeField(sec, field))
    };
}

// Place fields in two alternating fans that open away from the root
function expandSection(sec) {
    collapseSection();
    const pos = network.getPositions(['sec:' + sec])['sec:' + sec];
    const theta = Math.atan2(pos.y, pos.x);
    const fields = fieldsOf(sec);
    const k = fields.length;
    // up to about 150 degrees of fan, with fields alternating among 1-3 rings
    const spread = Math.min(2.6, 0.3 * (k - 1) + 0.2);
    const rings = k > 8 ? [125, 200, 275] : (k > 4 ? [130, 210] : [150]);
    const newNodes = [], newEdges = [];
    fields.forEach((f, i) => {
        const a = theta + (k === 1 ? 0 : -spread / 2 + spread * i / (k - 1));
        const r = rings[i % rings.length];
        newNodes.push(fieldNode(sec, f, pos.x + r * Math.cos(a), pos.y + r * Math.sin(a)));
        newEdges.push({ id: 'fe:' + sec + ':' + f, from: 'sec:' + sec, to: 'fld:' + sec + ':' + f,
                        color: { color: tint(SECTION_COLORS[sec] || OPTIONAL_COLOR, 0.3) }, width: 1.2 });
    });
    nodes.add(newNodes);
    edges.add(newEdges);
    expanded = sec;
    fitTo(['sec:' + sec].concat(newNodes.filter(nn => !nn.hidden).map(nn => nn.id)));
}

function collapseSection() {
    if (!expanded) return;
    const ids = fieldsOf(expanded).map(f => 'fld:' + expanded + ':' + f);
    edges.remove(fieldsOf(expanded).map(f => 'fe:' + expanded + ':' + f));
    nodes.remove(ids);
    expanded = null;
}

function fitTo(ids) {
    network.fit({ nodes: ids, animation: false });
    clampScale();
}

// Keep labels at 12px or larger on screen
function clampScale() {
    const s = network.getScale();
    if (s < MIN_SCALE) network.moveTo({ scale: MIN_SCALE, position: network.getViewPosition() });
}

// ---------- infobox ----------
function info(html) { document.getElementById('infobox').innerHTML = html; }

function showWelcome() {
    info('<h3>H-Bridge metadata.json</h3>' +
        '<p>The <b>microsim</b> root holds five required sections (colored) and three optional ' +
        'sections (gray). Click a section to expand its fields; click a field for its type, ' +
        'whether the schema requires it, and its H-Bridge value. Hover any node for the ' +
        'schema description.</p>' +
        '<div class="legend-row"><span class="legend-box"></span> required field (solid border)</div>' +
        '<div class="legend-row"><span class="legend-box dashed"></span> optional field (dashed border)</div>' +
        '<p class="muted">Values come from data.json, a copy of the STEM Robots H-Bridge file; ' +
        'required lists and descriptions come from microsim-schema.json.</p>');
}

function showSection(sec) {
    const req = REQUIRED_SECTIONS.includes(sec);
    const col = req ? SECTION_COLORS[sec] : OPTIONAL_COLOR;
    let html = '<h3><span class="swatch" style="background:' + col + '"></span>' + sec + '</h3>' +
        '<div class="kv">' + (req ? '<span class="req">Required section</span>' : '<span class="opt">Optional section</span>') + '</div>' +
        '<p>' + esc(SECTION_PURPOSE[sec]) + '</p>';
    const reqList = sectionDef(sec).required || [];
    html += '<div class="kv"><b>Schema requires:</b> ' + (reqList.length ? reqList.join(', ') : 'no fields') + '</div>';
    if (hb[sec]) {
        html += '<div class="kv"><b>H-Bridge values:</b></div>';
        for (const f of Object.keys(hb[sec])) {
            html += '<div class="kv">' + (isRequired(sec, f) ? '■ ' : '□ ') + '<b>' + f + ':</b> ' +
                esc(valueText(hb[sec][f], 90)) + '</div>';
        }
        html += '<p class="muted">■ required, □ optional</p>';
    } else {
        html += '<p class="muted">The H-Bridge file has no ' + sec + ' section. Its fields are shown ' +
            'from the schema, all optional, with no values.</p>';
    }
    info(html);
}

function showField(sec, field) {
    const def = (sectionDef(sec).properties || {})[field];
    const req = isRequired(sec, field);
    const col = SECTION_COLORS[sec] || OPTIONAL_COLOR;
    let html = '<h3><span class="swatch" style="background:' + col + '"></span>' + field + '</h3>' +
        '<div class="kv"><b>Section:</b> ' + sec + '</div>' +
        '<div class="kv"><b>Type:</b> ' + esc(typeText(def)) + '</div>' +
        '<div class="kv"><b>Required by the schema:</b> ' + (req ? '<span class="req">yes</span>' : '<span class="opt">no</span>') + '</div>' +
        '<div class="kv"><b>Schema description:</b> ' + esc(describeField(sec, field)) + '</div>';
    if (hb[sec] && hb[sec][field] !== undefined) {
        html += '<div class="kv"><b>H-Bridge value:</b></div><pre>' + esc(JSON.stringify(hb[sec][field], null, 2).slice(0, 900)) + '</pre>';
    } else {
        html += '<div class="kv"><b>H-Bridge value:</b> <span class="muted">not present in the file</span></div>';
    }
    info(html);
}

// ---------- quiz ----------
function startQuiz() {
    collapseSection();
    const pool = [];
    REQUIRED_SECTIONS.forEach(sec => Object.keys(hb[sec]).forEach(f => pool.push({ sec, field: f })));
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    quiz = { items: pool.slice(0, 8), index: 0, answered: false, correct: 0, attempts: 0, lastPick: null };
    document.getElementById('quiz-btn').textContent = 'Stop quiz';
    showQuizNode();
    network.fit({ animation: false });
    clampScale();
    renderQuiz();
}

function stopQuiz() {
    removeQuizNode();
    quiz = null;
    document.getElementById('quiz-btn').textContent = 'Quiz me';
    showWelcome();
}

function showQuizNode() {
    removeQuizNode();
    if (!quiz || quiz.index >= quiz.items.length) return;
    const it = quiz.items[quiz.index];
    nodes.add({
        id: 'quiz', label: '? ' + it.field, x: 0, y: 70, shape: 'box', margin: 8, borderWidth: 3,
        color: { background: 'lightyellow', border: 'darkorange', highlight: { background: 'lightyellow', border: 'darkorange' } },
        font: { size: 17, face: 'Arial', color: 'black' },
        title: tooltipEl('Which section holds this field? Click that section node.')
    });
}

function removeQuizNode() {
    if (nodes.get('quiz')) nodes.remove('quiz');
    if (edges.get('quiz-edge')) edges.remove('quiz-edge');
}

function answerQuiz(sec) {
    if (!quiz || quiz.answered || quiz.index >= quiz.items.length) return;
    const it = quiz.items[quiz.index];
    quiz.answered = true;
    quiz.attempts++;
    quiz.lastPick = sec;
    const right = sec === it.sec;
    if (right) quiz.correct++;
    edges.add({ id: 'quiz-edge', from: 'sec:' + it.sec, to: 'quiz', width: 3, dashes: false,
                color: { color: right ? 'green' : 'firebrick' } });
    renderQuiz();
}

function nextQuiz() {
    if (!quiz) return;
    quiz.index++;
    quiz.answered = false;
    quiz.lastPick = null;
    showQuizNode();
    renderQuiz();
}

function renderQuiz() {
    let html = '<h3>Quiz: which section?</h3><div class="kv"><b>Score:</b> ' + quiz.correct + ' / ' + quiz.attempts + '</div>';
    if (quiz.index >= quiz.items.length) {
        html += '<p>Round complete: ' + quiz.correct + ' of ' + quiz.items.length + ' on the first try.</p>' +
            '<button type="button" id="again-btn" aria-label="Start a new quiz round">New round</button>';
        info(html);
        document.getElementById('again-btn').onclick = startQuiz;
        removeQuizNode();
        return;
    }
    const it = quiz.items[quiz.index];
    html += '<p>Field ' + (quiz.index + 1) + ' of ' + quiz.items.length + ': <b>' + it.field + '</b></p>' +
        '<div class="kv"><b>H-Bridge value:</b> ' + esc(valueText(hb[it.sec][it.field], 110)) + '</div>' +
        '<p>Click the section node this field belongs to.</p>';
    if (quiz.answered) {
        const right = quiz.lastPick === it.sec;
        html += '<p class="' + (right ? 'right' : 'wrong') + '">' + (right ? 'Correct' : 'Incorrect') + ': ' +
            it.field + ' is in <b>' + it.sec + '</b>' + (right ? '' : ', not ' + quiz.lastPick) + '. It is ' +
            (isRequired(it.sec, it.field) ? 'required' : 'optional') + ' there.</p>' +
            '<button type="button" id="next-btn" aria-label="Next quiz field">Next field</button>';
    }
    info(html);
    const nb = document.getElementById('next-btn');
    if (nb) nb.onclick = nextQuiz;
}

// ---------- events ----------
function onClick(params) {
    if (!params.nodes.length) return;
    const id = params.nodes[0];
    if (id.startsWith('sec:')) {
        const sec = id.slice(4);
        if (quiz) {
            if (REQUIRED_SECTIONS.includes(sec)) answerQuiz(sec);
            return;
        }
        if (expanded === sec) { collapseSection(); network.fit({ animation: false }); clampScale(); }
        else expandSection(sec);
        showSection(sec);
    } else if (id.startsWith('fld:')) {
        const parts = id.split(':');
        showField(parts[1], parts[2]);
    } else if (id === 'root' && !quiz) {
        showWelcome();
    }
}

function onRequiredToggle() {
    if (!expanded) return;
    const only = document.getElementById('required-only').checked;
    const updates = fieldsOf(expanded).map(f => ({ id: 'fld:' + expanded + ':' + f, hidden: only && !isRequired(expanded, f) }));
    nodes.update(updates);
}

function init(data, schemaJson) {
    hb = data.microsim;
    schema = schemaJson.properties.microsim;
    const g = buildBaseGraph();
    nodes = new vis.DataSet(g.n);
    edges = new vis.DataSet(g.e);
    const mouseOK = !isInIframe();
    const options = {
        layout: { improvedLayout: false },
        physics: {
            enabled: true,
            barnesHut: { gravitationalConstant: -2600, springLength: 150, springConstant: 0.04, avoidOverlap: 0.4 },
            stabilization: { iterations: 200, fit: true }
        },
        interaction: {
            hover: true,
            tooltipDelay: 150,
            selectConnectedEdges: false,
            dragView: mouseOK,
            zoomView: mouseOK,
            dragNodes: true,
            navigationButtons: true,
            keyboard: { enabled: true, bindToWindow: false }
        },
        edges: { smooth: false },
        nodes: { widthConstraint: { maximum: 200 } }
    };
    network = new vis.Network(document.getElementById('network'), { nodes, edges }, options);
    // Physics lays out the first view, then turns off so dragged nodes stay put
    network.once('stabilizationIterationsDone', () => {
        network.setOptions({ physics: { enabled: false } });
        network.fit({ animation: false });
        clampScale();
    });
    network.on('click', onClick);
    document.getElementById('required-only').addEventListener('change', onRequiredToggle);
    document.getElementById('quiz-btn').addEventListener('click', () => quiz ? stopQuiz() : startQuiz());
    document.getElementById('collapse-btn').addEventListener('click', () => {
        if (quiz) stopQuiz();
        collapseSection();
        network.fit({ animation: false });
        clampScale();
        showWelcome();
    });
    window.addEventListener('resize', () => { network.fit({ animation: false }); clampScale(); });
    showWelcome();
}

document.addEventListener('DOMContentLoaded', function () {
    Promise.all([
        fetch('data.json').then(r => r.json()),
        fetch('microsim-schema.json').then(r => r.json())
    ]).then(([d, s]) => init(d, s)).catch(err => {
        info('<h3>Could not load the data</h3><p>This MicroSim reads data.json and microsim-schema.json ' +
            'with fetch(), which browsers block for pages opened from the file system. Open it ' +
            'through a web server (for example <code>mkdocs serve</code>).</p><p class="muted">' + esc(err) + '</p>');
    });
});
