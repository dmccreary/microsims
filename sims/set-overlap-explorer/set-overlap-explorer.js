// Set Overlap Explorer - venn.js 0.2.20 with D3 7.9.0
// CANVAS_HEIGHT: 440
// Three sets of diagram characteristics: an ordered process (typical of a
// flowchart), labeled relationships (a concept map) and feedback (a causal loop
// diagram). Hovering a region shows its one-sentence definition; clicking lists
// two example diagrams. Classify mode presents six example descriptions and the
// learner clicks the region where each belongs, with immediate feedback.

// ---------------------------------------------------------------------------
// Data: symbolic sizes (balanced, not measured) and region definitions
// ---------------------------------------------------------------------------
const SET_LABELS = {
    Process: 'Ordered process (Flowchart)',
    Relationships: 'Labeled relationships (Concept Map)',
    Feedback: 'Feedback (Causal Loop)'
};

const SHORT = { Process: 'ordered process', Relationships: 'labeled relationships', Feedback: 'feedback' };

const COLORS = { Process: '#2563eb', Relationships: '#059669', Feedback: '#ea580c' };

const sets = [
    { sets: ['Process'], size: 12, label: SET_LABELS.Process },
    { sets: ['Relationships'], size: 12, label: SET_LABELS.Relationships },
    { sets: ['Feedback'], size: 12, label: SET_LABELS.Feedback },
    { sets: ['Process', 'Relationships'], size: 4 },
    { sets: ['Process', 'Feedback'], size: 4 },
    { sets: ['Relationships', 'Feedback'], size: 4 },
    { sets: ['Process', 'Relationships', 'Feedback'], size: 1.8 }
];

// Keys are the sorted, comma-joined set names of each region
const definitions = {
    'Process': 'Steps in a fixed order from a start to an end, with no loop back and no named relationships.',
    'Relationships': 'Concepts joined by links that name a relationship, such as "is a kind of", with no required order and no loop.',
    'Feedback': 'A closed loop in which a change comes back to affect itself, drawn without ordered steps or named links.',
    'Process,Relationships': 'An ordered process whose arrows also name the relationship between the things they join, with no loop back.',
    'Feedback,Process': 'An ordered process that loops back to an earlier step, with arrows that name no relationships.',
    'Feedback,Relationships': 'Named cause-and-effect links that close into a loop, with no ordered start or end.',
    'Feedback,Process,Relationships': 'An ordered sequence whose named links also close into a loop that repeats.'
};

const examples = {
    'Process': ['A setup checklist flowchart: open the editor, paste the code, press Run.',
                'A page-load sequence: fetch the HTML, load the library, draw the canvas.'],
    'Relationships': ['A concept map in which "bar chart" is a kind of "chart" and "Chart.js" draws "bar chart".',
                      'A glossary map that links "Mermaid" to "flowchart" with the label "draws".'],
    'Feedback': ['An unlabeled ring of arrows: practice, skill, confidence, and back to practice.',
                 'A sketch of a thermostat cycle drawn as a circle of arrows with no labels.'],
    'Process,Relationships': ['A data pipeline: the MicroSim "sends" a statement to the LRS, which "stores" it for the dashboard.',
                              'An approval process whose arrows read "submits to", "reviews" and "approves".'],
    'Feedback,Process': ['The drafting flowchart: draft, check, and loop back to the draft on No.',
                         'A game loop: read input, update the state, draw the frame, repeat.'],
    'Feedback,Relationships': ['A causal loop diagram: more practice "increases" skill, and more skill "increases" the motivation to practice.',
                               'A reinforcing loop: more users "attract" more content, which "attracts" more users.'],
    'Feedback,Process,Relationships': ['A plan-do-check-act cycle whose arrows read "produces", "measures" and "informs".',
                                       'An adaptive lesson: the quiz "measures" mastery, mastery "selects" the next activity, and the cycle repeats.']
};

const CLASSIFY_ITEMS = [
    { text: 'Install Python, create a project folder, then start the server, in that order.',
      answer: 'Process',
      reason: 'It is an ordered sequence with a start and an end, and nothing loops back or names a relationship.' },
    { text: '"Bar chart" is a kind of "chart", and "Chart.js" draws "bar chart".',
      answer: 'Relationships',
      reason: 'Every link names a relationship between concepts, and there is no order of steps and no loop.' },
    { text: 'More errors "lower" confidence, and lower confidence "causes" more errors.',
      answer: 'Feedback,Relationships',
      reason: 'The links are named cause-and-effect relationships, and the chain returns to where it started.' },
    { text: 'Run the tests; if any fail, fix the code and run the tests again.',
      answer: 'Feedback,Process',
      reason: 'It is an ordered process that loops back to an earlier step, and its arrows name no relationships.' },
    { text: 'A ring of unlabeled arrows: attention leads to engagement, which leads back to attention.',
      answer: 'Feedback',
      reason: 'It is a closed loop with no ordered start or end and no named links.' },
    { text: 'The MicroSim "emits" events, the LRS "stores" them, the dashboard "informs" the teacher, and the teacher "revises" the MicroSim, again and again.',
      answer: 'Feedback,Process,Relationships',
      reason: 'It runs in a fixed order, names every link, and loops back to the start.' }
];

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
let layout = null;            // venn.js result, includes circles in pixels
let classifyMode = false;
let itemIndex = 0;
let score = 0;
let answered = false;
let lastWidth = 0;

function keyOf(setNames) {
    return setNames.slice().sort().join(',');
}

const ORDER = ['Process', 'Relationships', 'Feedback'];

function cap(t) { return t.charAt(0).toUpperCase() + t.slice(1); }

// e.g. "Ordered process + feedback, no labeled relationships"
function regionName(key) {
    const parts = key.split(',');
    const inc = ORDER.filter(k => parts.includes(k));
    const exc = ORDER.filter(k => !parts.includes(k));
    if (inc.length === 3) return 'All three: ordered process, labeled relationships and feedback';
    if (inc.length === 1) return cap(SHORT[inc[0]]) + ' only';
    return cap(SHORT[inc[0]]) + ' + ' + SHORT[inc[1]] + ', no ' + SHORT[exc[0]];
}

function swatches(key) {
    const parts = key.split(',');
    return ORDER.filter(k => parts.includes(k))
        .map(k => '<span class="swatch" style="background:' + COLORS[k] + '"></span>').join('');
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------
function diagramSize() {
    const col = document.querySelector('.venn-col');
    // at most 418 x 360 so the diagram fits the fixed iframe height at any width
    const w = Math.max(260, Math.min(418, col.clientWidth - 4));
    return { w: w, h: Math.round(w * 0.86) };
}

function render() {
    const size = diagramSize();
    lastWidth = size.w;
    const div = d3.select('#venn-diagram');
    div.selectAll('*').remove();

    const chart = venn.VennDiagram()
        .width(size.w)
        .height(size.h)
        .padding(12)
        .fontSize('16px')
        .duration(0);
    layout = chart(div.datum(sets));      // chart() returns the layout, including circles in pixels

    // color the three circles
    div.selectAll('.venn-circle path')
        .style('fill', d => COLORS[d.sets[0]])
        .style('fill-opacity', 0.22)
        .style('stroke', d => COLORS[d.sets[0]])
        .style('stroke-width', 2)
        .style('stroke-opacity', 0.9);
    div.selectAll('.venn-circle text').style('fill', d => COLORS[d.sets[0]]);

    buildHighlightLayer();
    wireEvents();
}

// Exact region shapes for highlighting: clip to every included circle (nested
// clip paths give the intersection) and mask out every excluded circle.
function buildHighlightLayer() {
    const svg = d3.select('#venn-diagram svg');
    const circles = layout.circles;
    const names = Object.keys(circles);
    const defs = svg.append('defs');
    names.forEach(n => {
        defs.append('clipPath').attr('id', 'clip-' + n)
            .append('circle').attr('cx', circles[n].x).attr('cy', circles[n].y).attr('r', circles[n].radius);
    });
    const hl = svg.append('g').attr('class', 'region-hl');
    Object.keys(definitions).forEach(key => {
        const inc = key.split(',');
        const exc = names.filter(n => !inc.includes(n));
        const maskId = 'mask-' + key.replace(/,/g, '-');
        const mask = defs.append('mask').attr('id', maskId);
        mask.append('rect').attr('x', 0).attr('y', 0).attr('width', '100%').attr('height', '100%').attr('fill', 'white');
        exc.forEach(n => mask.append('circle').attr('cx', circles[n].x).attr('cy', circles[n].y)
            .attr('r', circles[n].radius).attr('fill', 'black'));
        let g = hl;
        inc.forEach(n => { g = g.append('g').attr('clip-path', 'url(#clip-' + n + ')'); });
        g.append('rect')
            .attr('class', 'hl-' + key.replace(/,/g, '-'))
            .attr('x', 0).attr('y', 0).attr('width', '100%').attr('height', '100%')
            .attr('mask', 'url(#' + maskId + ')')
            .attr('fill', '#facc15').attr('fill-opacity', 0);
    });
}

function setHighlight(key, color, opacity) {
    d3.selectAll('.region-hl rect').attr('fill-opacity', 0);
    if (key) {
        d3.select('.region-hl .hl-' + key.replace(/,/g, '-'))
            .attr('fill', color || '#facc15').attr('fill-opacity', opacity || 0.45);
    }
}

// ---------------------------------------------------------------------------
// Interaction
// ---------------------------------------------------------------------------
const tooltip = d3.select('#tooltip');
let pinnedKey = null;         // region highlighted by the last click / answer
let pinnedColor = null;

function wireEvents() {
    d3.select('#venn-diagram').selectAll('.venn-area')
        .on('mouseover', function (event, d) {
            const key = keyOf(d.sets);
            setHighlight(key);
            tooltip.html('<b>' + regionName(key) + '</b><br>' + definitions[key]).classed('visible', true);
            moveTooltip(event);
        })
        .on('mousemove', moveTooltip)
        .on('mouseout', function () {
            tooltip.classed('visible', false);
            setHighlight(pinnedKey, pinnedColor);
        })
        .on('click', function (event, d) {
            const key = keyOf(d.sets);
            if (classifyMode) answer(key); else showExamples(key);
        });
}

function moveTooltip(event) {
    const node = tooltip.node();
    const tw = node.offsetWidth, th = node.offsetHeight;
    let x = event.pageX + 14, y = event.pageY + 14;
    if (x + tw > window.innerWidth - 6) x = event.pageX - tw - 14;
    if (x < 4) x = 4;
    if (y + th > window.innerHeight + window.scrollY - 6) y = event.pageY - th - 14;
    tooltip.style('left', x + 'px').style('top', y + 'px');
}

function showExamples(key) {
    pinnedKey = key;
    pinnedColor = '#facc15';
    setHighlight(key);
    const ex = examples[key].map(e => '<li>' + e + '</li>').join('');
    document.getElementById('panel').innerHTML =
        '<h2>' + swatches(key) + regionName(key) + '</h2>' +
        '<div class="def">' + definitions[key] + '</div>' +
        '<b>Two example diagrams:</b><ul>' + ex + '</ul>';
}

function exploreIntro() {
    document.getElementById('panel').innerHTML =
        '<h2>Three characteristics</h2>' +
        '<div class="def"><span class="swatch" style="background:' + COLORS.Process + '"></span><b>Ordered process</b>: steps in a set order (typical of a flowchart).</div>' +
        '<div class="def"><span class="swatch" style="background:' + COLORS.Relationships + '"></span><b>Labeled relationships</b>: links that name how concepts relate (typical of a concept map).</div>' +
        '<div class="def"><span class="swatch" style="background:' + COLORS.Feedback + '"></span><b>Feedback</b>: a loop in which a change returns to affect itself (typical of a causal loop diagram).</div>' +
        '<p class="muted">Circle sizes are symbolic, not measured. Click any of the seven regions.</p>';
}

// ---------------------------------------------------------------------------
// Classify mode
// ---------------------------------------------------------------------------
function toggleMode() {
    classifyMode = !classifyMode;
    const btn = document.getElementById('mode-btn');
    btn.setAttribute('aria-pressed', String(classifyMode));
    btn.textContent = classifyMode ? 'Back to Explore' : 'Start Classify mode';
    document.getElementById('mode-status').textContent = classifyMode
        ? 'Classify: click the region where each example diagram belongs.'
        : 'Explore: hover a region for its definition, click it for two examples.';
    pinnedKey = null;
    setHighlight(null);
    if (classifyMode) { itemIndex = 0; score = 0; showItem(); } else { exploreIntro(); }
}

function showItem() {
    answered = false;
    pinnedKey = null;
    setHighlight(null);
    const item = CLASSIFY_ITEMS[itemIndex];
    document.getElementById('panel').innerHTML =
        '<div class="progress">Example ' + (itemIndex + 1) + ' of ' + CLASSIFY_ITEMS.length + ' &middot; score ' + score + '</div>' +
        '<div class="item-card">' + item.text + '</div>' +
        '<p class="muted">Which region does this diagram belong to? Click it in the Venn diagram.</p>';
}

function answer(key) {
    if (answered) return;
    answered = true;
    const item = CLASSIFY_ITEMS[itemIndex];
    const right = key === item.answer;
    if (right) score += 1;
    pinnedKey = item.answer;
    pinnedColor = '#22c55e';
    setHighlight(item.answer, '#22c55e', 0.55);
    const last = itemIndex === CLASSIFY_ITEMS.length - 1;
    document.getElementById('panel').innerHTML =
        '<div class="progress">Example ' + (itemIndex + 1) + ' of ' + CLASSIFY_ITEMS.length + ' &middot; score ' + score + '</div>' +
        '<div class="item-card">' + item.text + '</div>' +
        '<div class="result ' + (right ? 'right' : 'wrong') + '">' +
        (right ? '<b>Correct.</b> ' : '<b>Not quite.</b> You chose ' + regionName(key).toLowerCase() + '. It belongs in <b>' + regionName(item.answer).toLowerCase() + '</b> (green). ') +
        item.reason + '</div>' +
        '<div class="actions">' + (last
            ? '<span><b>Done: ' + score + ' of ' + CLASSIFY_ITEMS.length + ' correct.</b></span> <button type="button" id="again-btn">Try again</button>'
            : '<button type="button" id="next-btn">Next example</button>') + '</div>';
    if (last) {
        document.getElementById('again-btn').addEventListener('click', () => { itemIndex = 0; score = 0; showItem(); });
    } else {
        document.getElementById('next-btn').addEventListener('click', () => { itemIndex += 1; showItem(); });
    }
}

// ---------------------------------------------------------------------------
// Setup and responsive re-render
// ---------------------------------------------------------------------------
document.getElementById('mode-btn').addEventListener('click', toggleMode);
exploreIntro();
render();

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (Math.abs(diagramSize().w - lastWidth) > 4) {
            render();
            setHighlight(pinnedKey, pinnedColor);
        }
    }, 200);
});
