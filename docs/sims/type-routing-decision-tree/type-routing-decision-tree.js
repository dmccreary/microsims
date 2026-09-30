// Type Routing Decision Tree - Mermaid
// CANVAS_HEIGHT: 820
// The generator skill's routing decision tree (Chapter 4) as a top-to-bottom flowchart of
// yes-or-no questions asked in order; the first "yes" ends in a leaf naming the type and
// library. Every node has a Mermaid click directive that fills the infobox with a one-sentence
// explanation and an example objective that answers yes there. "Try an objective" shows one of
// six objectives; the learner clicks where they would stop, and the diagram highlights the
// learner's path and the path the skill's tree follows.
// Bloom level: Apply (use).

const CANVAS_HEIGHT = 820;

// ---------- questions (in the order the tree asks them) and their yes-leaves ----------
const questions = [
  { id: 'Q1', text: 'Numeric claims to verify?', leaf: 'Verify claims first: verified poster route',
    explain: 'Does the content carry real-world numbers that must be checked against sources before they appear?',
    example: 'Summarize LED and incandescent lighting efficiency on a printable poster with real numbers.',
    leafNote: 'Run the claim-verification phases first. Only an explicitly requested poster becomes a static image (then wrapped in a grid overlay); otherwise the verified claims go into an interactive type.' },
  { id: 'Q2', text: 'Dates or a timeline?', leaf: 'Timeline: vis-timeline',
    explain: 'Is the content a set of dated events or periods that must be seen in time order?',
    example: 'Identify the milestones between MicroSims 1.0 and 2.0 and order them in time.',
    leafNote: 'vis-timeline places events on a zoomable time axis with click-for-detail. It needs real dates.' },
  { id: 'Q3', text: 'Geographic coordinates?', leaf: 'Map: Leaflet',
    explain: 'Does location itself carry the meaning, given as coordinates or place names?',
    example: 'Locate the major shipping routes of the Hanseatic League.',
    leafNote: 'Leaflet draws markers, routes and layers on a tiled map; scroll-wheel zoom stays off in an iframe.' },
  { id: 'Q4', text: 'A mathematical function?', leaf: 'Function plot: Plotly',
    explain: 'Is the content a continuous function such as f(x), with parameters a slider can vary?',
    example: 'Explain how the amplitude and frequency of a sine wave change its graph.',
    leafNote: 'Plotly plots functions with sliders, coordinate tooltips, zoom and pan.' },
  { id: 'Q5', text: 'Nodes and edges?', leaf: 'Network: vis-network',
    explain: 'Are the relationships between entities the content itself, as nodes joined by edges?',
    example: 'Analyze which concepts must be learned before Instrumented MicroSim.',
    leafNote: 'vis-network gives dragging, click-for-details and neighbor highlighting. If loop polarity matters, use a causal loop diagram, also built on vis-network.' },
  { id: 'Q6', text: 'A flowchart or process?', leaf: 'Flowchart: Mermaid',
    explain: 'Is the content a sequence of steps or decisions that the learner follows in order?',
    example: 'Explain the steps of a change-approval process and its two decision points.',
    leafNote: 'Mermaid draws the flowchart from text; in this book every node must also get a click directive.' },
  { id: 'Q7', text: 'Sets with overlaps?', leaf: 'Venn diagram: venn.js',
    explain: 'Is the point the overlap among two to four sets?',
    example: 'Distinguish what artificial intelligence, machine learning and data science have in common.',
    leafNote: 'A Venn diagram shows two to four overlapping sets with hover text for each region.' },
  { id: 'Q8', text: 'A priority matrix?', leaf: 'Bubble chart: Chart.js',
    explain: 'Are items placed on two dimensions, such as impact versus effort, often with a third as size?',
    example: 'Prioritize ten course improvements by impact and effort.',
    leafNote: 'The bubble-chart guide builds priority matrices and quadrants on Chart.js.' },
  { id: 'Q9', text: 'A standard chart?', leaf: 'Chart: Chart.js',
    explain: 'Is the content numbers in categories or over time, shown as bars, lines, pies or radar?',
    example: 'Compare the number of MicroSims of each type across three books.',
    leafNote: 'Chart.js gives bar, line, pie, radar and scatter charts with tooltips and legend toggles.' },
  { id: 'Q10', text: 'A comparison table?', leaf: 'Comparison table: custom HTML',
    explain: 'Are several items compared side by side on a few criteria?',
    example: 'Compare five charting libraries on ease of learning and interactivity.',
    leafNote: 'A custom HTML table with star ratings, or a matrix whose cells open detail panels.' },
  { id: 'Q11', text: 'A sorting quiz?', leaf: 'Classifier quiz: p5.js',
    explain: 'Must learners sort scenarios into categories and get feedback?',
    example: 'Classify ten learning objectives by Bloom level.',
    leafNote: 'The concept classifier is a p5.js quiz driven by a data.json of scenarios, options and explanations.' },
  { id: 'Q12', text: 'A labeled illustration?', leaf: 'Image overlay: diagram.js',
    explain: 'Does an illustration need names attached to its parts, with explore and quiz modes?',
    example: 'Identify the parts of a moss sporophyte.',
    leafNote: 'The image overlay draws callout labels from a data file over a text-free image.' },
  { id: 'Q13', text: 'Runnable Python?', leaf: 'Python lab: Docker',
    explain: 'Must learners edit and run Python code?',
    example: 'Modify a list-sorting function and run it on three inputs.',
    leafNote: 'The Docker Python lab runs code blocks in a container through docker-lab.js.' }
];
const FALLBACK = { id: 'L14', leaf: 'Custom simulation: p5.js',
  explain: 'No question answered yes, so the objective needs a custom model: p5.js is the default.',
  example: 'Show how gravity and bounciness change a ball\'s motion.' };

// ---------- six objectives to route ----------
const objectives = [
  { text: 'Identify the milestones between MicroSims 1.0 and 2.0 and order them in time.', stop: 'Q2',
    notes: { Q1: 'No: the milestones are events, not numeric claims.', Q2: 'Yes: the content is dated events in time order.' } },
  { text: 'Locate the major shipping routes of the Hanseatic League on a map.', stop: 'Q3',
    notes: { Q1: 'No: there are no statistics to verify.', Q2: 'No: the objective is about places, not dates.', Q3: 'Yes: ports and routes are coordinates.' } },
  { text: 'Explain how the amplitude and frequency of a sine wave change its graph.', stop: 'Q4',
    notes: { Q3: 'No: nothing is located on a map.', Q4: 'Yes: a sine wave is a continuous function with two parameters.' } },
  { text: 'Analyze which concepts must be learned before Instrumented MicroSim.', stop: 'Q5',
    notes: { Q4: 'No: there is no function to plot.', Q5: 'Yes: concepts are nodes and dependencies are directed edges.' } },
  { text: 'Compare the number of MicroSims of each type across three books.', stop: 'Q9',
    notes: { Q5: 'No: the types are categories, not connected entities.', Q7: 'No: nothing overlaps; each MicroSim has one type.', Q8: 'No: there is one measure, not two dimensions of priority.', Q9: 'Yes: counts in categories are a bar chart.' } },
  { text: 'Show how gravity and bounciness change a ball\'s motion.', stop: 'L14',
    notes: { Q4: 'No: the motion is simulated step by step, not plotted as one function.', Q9: 'No: the learner watches a model, not a chart.', Q13: 'No: nothing is coded by the learner.', L14: 'Every question answered no, so the tree ends at a custom p5.js simulation.' } }
];

// ---------- build the Mermaid source ----------
// Questions alternate which child is defined first so the chain zig-zags instead of drifting sideways.
function buildMermaid() {
  const lines = ['flowchart TD', '  START(["A described objective"]) --> Q1'];
  questions.forEach((q, i) => {
    const next = i + 1 < questions.length ? questions[i + 1].id : 'L14';
    const qdef = q.id + '{{"' + q.id + ' ' + q.text + '"}}';
    const ldef = 'L' + (i + 1) + '["' + q.leaf + '"]';
    if (i % 2 === 0) {
      lines.push('  ' + qdef + ' -->|yes| ' + ldef);
      lines.push('  ' + q.id + ' -->|no| ' + next);
    } else {
      lines.push('  ' + qdef + ' -->|no| ' + next);
      lines.push('  ' + q.id + ' -->|yes| ' + ldef);
    }
  });
  lines.push('  L14["' + FALLBACK.leaf + '"]');
  // one click directive per node
  ['START'].concat(questions.map(q => q.id)).concat(questions.map((q, i) => 'L' + (i + 1))).concat(['L14'])
    .forEach(id => lines.push('  click ' + id + ' nodeClick "Click for an explanation and an example"'));
  return lines.join('\n');
}

// ---------- state ----------
let objIndex = -1;          // -1 = explore mode
let userStop = null;        // question id or 'L14' where the learner stops
let selectedNode = null;
let nodeEls = {};
let edgeEls = [];

document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('spec-select');
  select.add(new Option('Explore: click any node', '-1'));
  objectives.forEach((o, i) => select.add(new Option('Objective ' + (i + 1), String(i))));
  select.addEventListener('change', () => {
    objIndex = parseInt(select.value, 10);
    userStop = null;
    selectedNode = null;
    refresh();
  });
  document.getElementById('clear-btn').addEventListener('click', () => {
    userStop = null;
    refresh();
  });

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',              // required for click callbacks
    theme: 'default',
    flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis', padding: 5,
      nodeSpacing: 14, rankSpacing: 14, diagramPadding: 4, wrappingWidth: 400 },
    themeVariables: { fontSize: '16px', fontFamily: 'Arial, Helvetica, sans-serif' }
  });
  mermaid.render('routingSvg', buildMermaid()).then(({ svg, bindFunctions }) => {
    const el = document.getElementById('diagram');
    el.innerHTML = svg;
    if (bindFunctions) bindFunctions(el);
    indexDiagram(el);
    fitHeights();
    refresh();
  }).catch(err => {
    document.getElementById('diagram').textContent = 'Diagram error: ' + err;
  });
  window.addEventListener('resize', () => { fitHeights(); refresh(); });
});

function indexDiagram(el) {
  el.querySelectorAll('.node').forEach(g => {
    const m = g.id.match(/flowchart-(.+)-\d+$/);
    if (!m) return;
    const id = m[1];
    nodeEls[id] = g;
    g.classList.add(id === 'START' ? 'kind-start' : (id.startsWith('Q') ? 'kind-question' : 'kind-end'));
  });
  el.querySelectorAll('path.flowchart-link').forEach(p => {
    const m = p.id.match(/^L_(.+?)_(.+?)_\d+$/);
    if (m) edgeEls.push({ from: m[1], to: m[2], el: p });
  });
}

function fitHeights() {
  const narrow = window.innerWidth < 600;
  const toolbarH = document.getElementById('toolbar').offsetHeight;
  const layoutH = CANVAS_HEIGHT - toolbarH;
  document.getElementById('layout').style.height = layoutH + 'px';
  const svg = document.querySelector('#diagram svg');
  const info = document.getElementById('info-panel');
  const diagramH = narrow ? Math.round(layoutH * 0.62) : layoutH;
  document.getElementById('diagram-panel').style.height = diagramH + 'px';
  if (svg) svg.style.maxHeight = (diagramH - 12) + 'px';
  info.style.height = (narrow ? layoutH - diagramH : layoutH) + 'px';
}

// ---------- paths ----------
// the node sequence for stopping at a question (answer yes there) or at L14 (all no)
function pathTo(stop) {
  const path = ['START'];
  for (let i = 0; i < questions.length; i++) {
    path.push(questions[i].id);
    if (questions[i].id === stop) { path.push('L' + (i + 1)); return path; }
  }
  path.push('L14');
  return path;
}

function stopFor(id) {
  if (id === 'START') return null;
  if (id.startsWith('Q')) return id;
  const n = parseInt(id.slice(1), 10);
  return n === 14 ? 'L14' : 'Q' + n;
}

// Mermaid click directive callback (must be global)
window.nodeClick = function (id) {
  selectedNode = id;
  if (objIndex >= 0) userStop = stopFor(id);
  refresh();
};

function clearHighlights() {
  Object.values(nodeEls).forEach(g => g.classList.remove('hl-selected', 'hl-user', 'hl-match', 'hl-wrong', 'hl-ref'));
  edgeEls.forEach(e => e.el.classList.remove('hl-edge-user', 'hl-edge-ref'));
}

function highlightEdges(path, cls) {
  for (let i = 0; i < path.length - 1; i++) {
    edgeEls.filter(e => e.from === path[i] && e.to === path[i + 1]).forEach(e => e.el.classList.add(cls));
  }
}

function refresh() {
  clearHighlights();
  document.getElementById('clear-btn').disabled = objIndex < 0 || !userStop;
  if (objIndex < 0) {
    if (selectedNode && nodeEls[selectedNode]) nodeEls[selectedNode].classList.add('hl-selected');
    renderExplore();
    return;
  }
  const refPath = pathTo(objectives[objIndex].stop);
  if (userStop) {
    const userPath = pathTo(userStop);
    Object.keys(nodeEls).forEach(id => {
      const inU = userPath.includes(id), inR = refPath.includes(id);
      if (inU && inR) nodeEls[id].classList.add('hl-match');
      else if (inU) nodeEls[id].classList.add('hl-wrong');
      else if (inR) nodeEls[id].classList.add('hl-ref');
    });
    highlightEdges(userPath, 'hl-edge-user');
    highlightEdges(refPath, 'hl-edge-ref');
  }
  renderTry();
}

// ---------- panel ----------
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function setPanel(html) {
  const panel = document.getElementById('info-panel');
  panel.innerHTML = html;
  let fs = window.innerWidth < 600 ? 13 : 14;
  panel.style.fontSize = fs + 'px';
  while (panel.scrollHeight > panel.clientHeight + 1 && fs > 11) {
    fs--;
    panel.style.fontSize = fs + 'px';
  }
}

function nodeHtml(id) {
  if (!id) return '';
  if (id === 'START') {
    return '<h3>Start</h3><p>Ask the questions in order and stop at the first "yes". The order matters: an objective with dates and places is routed by the dates question first.</p>';
  }
  if (id === 'L14') {
    return '<h3>' + esc(FALLBACK.leaf) + '</h3><p>' + esc(FALLBACK.explain) + '</p>' +
      '<div class="example"><b>Example objective:</b> ' + esc(FALLBACK.example) + '</div>';
  }
  if (id.startsWith('Q')) {
    const q = questions.find(x => x.id === id);
    return '<h3>' + esc(q.id + ' ' + q.text) + '</h3><p>' + esc(q.explain) + '</p>' +
      '<div class="example"><b>Answers yes:</b> ' + esc(q.example) + '</div>';
  }
  const q = questions[parseInt(id.slice(1), 10) - 1];
  return '<h3>' + esc(q.leaf) + '</h3><p>' + esc(q.leafNote) + '</p>' +
    '<div class="example"><b>Example objective:</b> ' + esc(q.example) + '</div>';
}

function renderExplore() {
  if (!selectedNode) {
    setPanel('<h3>Type Routing Decision Tree</h3>' +
      '<p>The generator skill routes an objective by asking these yes-or-no questions about its data shape, in this order, and stopping at the first "yes". If every answer is no, it builds a custom p5.js simulation.</p>' +
      '<p class="hint">Click any node for a one-sentence explanation and an example objective that answers yes there.</p>' +
      '<p class="hint">Then choose an objective in <b>Try an objective</b> and click the question where you would stop (or its leaf).</p>');
    return;
  }
  setPanel(nodeHtml(selectedNode));
}

function leafName(stop) {
  if (stop === 'L14') return FALLBACK.leaf;
  return questions.find(q => q.id === stop).leaf;
}

function renderTry() {
  const o = objectives[objIndex];
  let html = '<h3>Objective ' + (objIndex + 1) + ' of ' + objectives.length + '</h3>';
  html += '<div class="spec">' + esc(o.text) + '</div>';
  if (!userStop) {
    html += '<p class="hint">Walk down the tree asking each question about this objective. Click the first question you answer "yes" (or its leaf). If none fits, click the custom simulation leaf.</p>';
    setPanel(html);
    return;
  }
  const ok = userStop === o.stop;
  html += '<p class="' + (ok ? 'ok' : 'bad') + '">' + (ok ? 'Correct: ' : 'Not quite. ') +
    'You routed to <b>' + esc(leafName(userStop)) + '</b>.' +
    (ok ? '' : ' The tree routes to <b>' + esc(leafName(o.stop)) + '</b>.') + '</p>';
  // reasons along the reference path
  const refPath = pathTo(o.stop).filter(id => o.notes[id]);
  html += '<h4>How the tree decides</h4>';
  refPath.forEach(id => { html += '<p><b>' + esc(id === 'L14' ? 'End' : id) + ':</b> ' + esc(o.notes[id]) + '</p>'; });
  if (!ok) {
    const userIdx = pathTo(userStop).length, refIdx = pathTo(o.stop).length;
    html += '<p>' + (userIdx < refIdx ?
      'You stopped too early: the tree answers "no" at ' + esc(userStop) + ' for this objective.' :
      'You went past ' + esc(o.stop) + ': the tree stops at the first "yes".') + '</p>';
  }
  if (window.innerWidth >= 600) {
    html += '<p class="hint">Green: on both paths. Salmon: only on yours. Dashed outline: on the tree\'s path only.</p>';
  }
  if (selectedNode && window.innerWidth >= 600) html += '<hr>' + nodeHtml(selectedNode);
  setPanel(html);
}
