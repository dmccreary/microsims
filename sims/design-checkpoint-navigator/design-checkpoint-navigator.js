// Instructional Design Checkpoint Navigator - Mermaid with a click directive on every node
// CANVAS_HEIGHT: 680
// A flowchart of the instructional design checkpoint (Chapter 3). Every node has a Mermaid
// click directive that fills the information panel with the node's definition and one
// example. "Try a specification" loads one of four sample specifications; the learner clicks
// the path they would take, then "Check my path" compares it with the recommended path and
// shows the completed Instructional Design Check block.
// Bloom level: Apply (execute).

const CANVAS_HEIGHT = 680;

// ---------- nodes: short name, definition, example ----------
const nodeInfo = {
  A: { label: 'Extract objective', short: 'Extract',
    def: 'Pull the learning objective out of the specification: the full statement, its Bloom level and its verb.',
    example: 'Bouncing Ball Gravity Lab: "explain how gravity and bounciness change a ball\'s motion by predicting an outcome and then testing it."' },
  B: { label: 'Identify Bloom level and verb', short: 'Level and verb',
    def: 'Name the Bloom level (Remember to Create) and the verb, and check that the task agrees with the verb.',
    example: '"Explain" signals Understand; "predict the next bounce height for a new bounciness value" is Apply.' },
  C: { label: 'Match interaction pattern', short: 'Pattern',
    def: 'Use the level-to-pattern table: flashcards for Remember, step-throughs for Understand, sliders for Apply, explorers for Analyze, sorting for Evaluate, builders for Create.',
    example: 'An Understand objective about bounces maps to a step-through with the numbers visible.' },
  Q1: { label: 'Q1 Data the learner must see', short: 'Q1 data',
    def: 'Question 1: name the specific data the learner must see. The answer must be concrete, not a vague effect.',
    example: 'Concrete: the height and speed after each bounce, as numbers. Vague: "animated particles".' },
  Q2: { label: 'Q2 Must the learner predict first?', short: 'Q2 predict?',
    def: 'Question 2: does the learner need to commit to a prediction before observing? If yes, use a step-through and hold back the result.',
    example: 'An objective that says "by predicting an outcome and then testing it" answers yes.' },
  S: { label: 'Use step-through with Next and Previous', short: 'Step-through',
    def: 'Advance one step at a time with Next and Previous buttons so each result appears only after the prediction; no continuous animation.',
    example: 'A "Next bounce" button that shows the speed before and after each bounce as numbers.' },
  Q3: { label: 'Q3 Can you say what animation adds?', short: 'Q3 animation adds?',
    def: 'Question 3: finish the sentence "the animation shows ___, which an arrow cannot." If you cannot, the answer is no.',
    example: 'Yes: a pulse moving along an edge shows the order of study. No: concept nodes that bounce gently at all times.' },
  R: { label: 'Remove animation', short: 'Remove animation',
    def: 'Take the animation out of the design. Motion with no stated purpose adds extraneous load and teaches nothing.',
    example: 'Delete the always-bouncing nodes from a concept network and keep the click-to-highlight behavior.' },
  Q4: { label: 'Q4 Animation suitable for this level?', short: 'Q4 suits level?',
    def: 'Question 4: is continuous animation appropriate for this Bloom level? For Understand with "explain" it almost never is; for Apply with real-time feedback it often is.',
    example: 'A projectile path redrawn as the launch-angle slider moves (Apply) answers yes.' },
  F: { label: 'Flag and recommend step-through', short: 'Flag',
    def: 'Flag a possible instructional design issue, recommend a step-through, and ask the author whether to proceed with it before writing code.',
    example: '"The spec animates the ball continuously, but the objective is to explain. Should I use a Next bounce step mode instead?"' },
  D: { label: 'Record the decision', short: 'Record',
    def: 'Write the five-line Instructional Design Check: Bloom level, Bloom verb, recommended pattern, specification alignment and rationale.',
    example: 'Bloom Level: Understand. Bloom Verb: explain. Recommended Pattern: step-through with concrete data, gated by a prediction.' }
};

// ---------- the Mermaid flowchart (click directive on every node) ----------
const edges = [
  ['A', 'B', ''], ['B', 'C', ''], ['C', 'Q1', ''], ['Q1', 'Q2', ''],
  ['Q2', 'S', 'yes'], ['Q2', 'Q3', 'no'], ['S', 'Q3', ''],
  ['Q3', 'R', 'no'], ['Q3', 'Q4', 'yes'],
  ['Q4', 'F', 'no'], ['Q4', 'D', 'yes'], ['R', 'D', ''], ['F', 'D', '']
];

function buildMermaid() {
  const shape = id => {
    const t = nodeInfo[id].label;
    if (id.startsWith('Q')) return id + '{{"' + t + '"}}';
    if (id === 'D') return id + '(["' + t + '"])';
    return id + '["' + t + '"]';
  };
  const lines = ['flowchart TD'];
  Object.keys(nodeInfo).forEach(id => lines.push('  ' + shape(id)));
  edges.forEach(([a, b, l]) => lines.push('  ' + a + (l ? ' -->|' + l + '| ' : ' --> ') + b));
  // one click directive per node: calls window.nodeClick(nodeId) and shows a hover tooltip
  Object.keys(nodeInfo).forEach(id => lines.push('  click ' + id + ' nodeClick "Click for the definition and an example"'));
  // node colors are set in main.html CSS (kind-step, kind-question, kind-end) rather than with
  // classDef, because classDef writes inline styles that highlight classes could not override
  return lines.join('\n');
}

// ---------- four sample specifications ----------
const samples = [
  {
    title: 'Bouncing Ball Gravity Lab',
    spec: 'Learning objective (Bloom level: Understand; verb: explain): explain how gravity and bounciness change a ball\'s motion by predicting an outcome and then testing it. The ball animates continuously; a Predict first checkbox asks for a prediction; a readout shows height and speed.',
    path: ['A', 'B', 'C', 'Q1', 'Q2', 'S', 'Q3', 'Q4', 'F', 'D'],
    why: {
      Q2: 'Q2 is yes: the objective says "by predicting an outcome and then testing it", so a step-through is needed.',
      Q3: 'Q3 is yes: motion over time is the phenomenon itself, so some animation is defensible.',
      Q4: 'Q4 is no: continuous animation is almost never right for an Understand objective with "explain", so flag it.'
    },
    decision: 'Instructional Design Check:\n- Bloom Level: Understand\n- Bloom Verb: explain\n- Recommended Pattern: step-through with concrete data, gated by a prediction\n- Specification Alignment: partly aligned; the ball animates continuously\n- Rationale: seeing the numbers change one bounce at a time serves "explain"; keep the continuous fall only as an optional view.'
  },
  {
    title: 'Prerequisite Explorer',
    spec: 'Learning objective (Bloom level: Analyze; verb: examine): examine which concepts must be learned before a chosen concept by clicking it in a network. Every node bounces gently at all times so the graph feels alive.',
    path: ['A', 'B', 'C', 'Q1', 'Q2', 'Q3', 'R', 'D'],
    why: {
      Q2: 'Q2 is no: the learner explores relationships; there is no outcome to predict before observing.',
      Q3: 'Q3 is no: no sentence explains what the bouncing shows, and it competes for attention, so remove it.'
    },
    decision: 'Instructional Design Check:\n- Bloom Level: Analyze\n- Bloom Verb: examine\n- Recommended Pattern: network explorer; click a node to highlight its prerequisites\n- Specification Alignment: modified; the always-on bouncing is removed\n- Rationale: the motion has no instructional job and adds extraneous load to an explorer.'
  },
  {
    title: 'Projectile Range Calculator',
    spec: 'Learning objective (Bloom level: Apply; verb: calculate): calculate the range of a projectile for different launch angles and speeds. Sliders set the angle and speed; the projectile\'s path animates and the range is displayed.',
    path: ['A', 'B', 'C', 'Q1', 'Q2', 'Q3', 'Q4', 'D'],
    why: {
      Q2: 'Q2 is no: the learner changes inputs and reads results; the objective does not ask for a prediction first.',
      Q3: 'Q3 is yes: the moving projectile shows the shape of the path over time, which a static arrow cannot.',
      Q4: 'Q4 is yes: an Apply objective with real-time feedback is a case where animation often helps.'
    },
    decision: 'Instructional Design Check:\n- Bloom Level: Apply\n- Bloom Verb: calculate\n- Recommended Pattern: parameter sliders with real-time feedback\n- Specification Alignment: aligned\n- Rationale: the animated path gives immediate feedback on each change of angle or speed, which suits Apply.'
  },
  {
    title: 'Wave Interference Viewer',
    spec: 'Learning objective (Bloom level: Understand; verb: interpret): interpret how two waves combine into one pattern. Two waves travel continuously across the screen and their sum is drawn below them.',
    path: ['A', 'B', 'C', 'Q1', 'Q2', 'Q3', 'Q4', 'F', 'D'],
    why: {
      Q2: 'Q2 is no: the objective asks for interpretation, not a prediction.',
      Q3: 'Q3 is yes: wave motion is change over time, which static arrows cannot show.',
      Q4: 'Q4 is no: for an Understand objective, continuous motion lets the learner watch without thinking, so flag it.'
    },
    decision: 'Instructional Design Check:\n- Bloom Level: Understand\n- Bloom Verb: interpret\n- Recommended Pattern: step-through (Next phase) with the sum shown as numbers; motion as an optional view\n- Specification Alignment: partly aligned; the waves move continuously\n- Rationale: stepping one phase at a time lets the learner interpret each sum instead of watching it pass.'
  }
];

// ---------- state ----------
let sampleIndex = -1;        // -1 = explore mode
let userPath = [];
let checked = false;
let selectedNode = null;
let nodeEls = {};            // node id -> <g> element
let edgeEls = [];            // {from, to, el}

// ---------- rendering ----------
document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('spec-select');
  select.add(new Option('Explore: click any node', '-1'));
  samples.forEach((s, i) => select.add(new Option((i + 1) + '. ' + s.title, String(i))));
  select.addEventListener('change', () => {
    sampleIndex = parseInt(select.value, 10);
    userPath = [];
    checked = false;
    selectedNode = null;
    refresh();
  });
  document.getElementById('check-btn').addEventListener('click', () => {
    if (sampleIndex >= 0 && userPath.length) { checked = true; refresh(); }
  });
  document.getElementById('clear-btn').addEventListener('click', () => {
    userPath = [];
    checked = false;
    refresh();
  });

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',              // required for click callbacks
    theme: 'default',
    flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis', padding: 8,
      nodeSpacing: 24, rankSpacing: 26, wrappingWidth: 320 },
    themeVariables: { fontSize: '16px', fontFamily: 'Arial, Helvetica, sans-serif' }
  });
  mermaid.render('checkpointSvg', buildMermaid()).then(({ svg, bindFunctions }) => {
    const el = document.getElementById('diagram');
    el.innerHTML = svg;
    if (bindFunctions) bindFunctions(el);
    indexDiagram(el);
    fitHeights();
    refresh();
  }).catch(err => {
    document.getElementById('diagram').textContent = 'Diagram error: ' + err;
  });
  window.addEventListener('resize', fitHeights);
});

// map Mermaid's generated ids back to our node ids
function indexDiagram(el) {
  el.querySelectorAll('.node').forEach(g => {
    const m = g.id.match(/flowchart-(.+)-\d+$/);
    if (!m) return;
    nodeEls[m[1]] = g;
    g.classList.add(m[1].startsWith('Q') ? 'kind-question' : (m[1] === 'D' ? 'kind-end' : 'kind-step'));
  });
  el.querySelectorAll('path.flowchart-link').forEach(p => {
    const m = p.id.match(/^L_(.+?)_(.+?)_\d+$/);
    if (m) edgeEls.push({ from: m[1], to: m[2], el: p });
  });
}

// keep the whole widget inside the fixed iframe height; the diagram scales with the width
function fitHeights() {
  const narrow = window.innerWidth < 600;
  const toolbarH = document.getElementById('toolbar').offsetHeight;
  const layoutH = CANVAS_HEIGHT - toolbarH;
  const layout = document.getElementById('layout');
  const svg = document.querySelector('#diagram svg');
  layout.style.height = layoutH + 'px';
  const info = document.getElementById('info-panel');
  if (narrow) {
    const diagramH = Math.round(layoutH * 0.5);
    document.getElementById('diagram-panel').style.height = diagramH + 'px';
    if (svg) svg.style.maxHeight = (diagramH - 12) + 'px';
    info.style.height = (layoutH - diagramH) + 'px';
  } else {
    document.getElementById('diagram-panel').style.height = layoutH + 'px';
    if (svg) svg.style.maxHeight = (layoutH - 12) + 'px';
    info.style.height = layoutH + 'px';
  }
}

// Mermaid click directive callback (must be global)
window.nodeClick = function (id) {
  if (sampleIndex >= 0 && !checked) {
    userPath.push(id);
  }
  selectedNode = id;
  refresh();
};

// ---------- highlighting ----------
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
  const checkBtn = document.getElementById('check-btn');
  const clearBtn = document.getElementById('clear-btn');
  checkBtn.disabled = sampleIndex < 0 || userPath.length === 0 || checked;
  clearBtn.disabled = sampleIndex < 0 || userPath.length === 0;

  if (sampleIndex < 0) {
    if (selectedNode && nodeEls[selectedNode]) nodeEls[selectedNode].classList.add('hl-selected');
    renderExplorePanel();
    return;
  }
  const ref = samples[sampleIndex].path;
  if (!checked) {
    userPath.forEach(id => nodeEls[id] && nodeEls[id].classList.add('hl-user'));
    highlightEdges(userPath, 'hl-edge-user');
  } else {
    Object.keys(nodeEls).forEach(id => {
      const inUser = userPath.includes(id), inRef = ref.includes(id);
      if (inUser && inRef) nodeEls[id].classList.add('hl-match');
      else if (inUser) nodeEls[id].classList.add('hl-wrong');
      else if (inRef) nodeEls[id].classList.add('hl-ref');
    });
    highlightEdges(ref, 'hl-edge-ref');
  }
  renderTryPanel();
}

// ---------- panel content ----------
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderExplorePanel() {
  const panel = document.getElementById('info-panel');
  if (!selectedNode) {
    panel.innerHTML = '<h3>Instructional Design Checkpoint</h3>' +
      '<p>The checkpoint runs before any code is written. It classifies the objective, answers four questions, and records a decision.</p>' +
      '<p class="hint">Click any node to see its definition and an example.</p>' +
      '<p class="hint">Then choose a sample in <b>Try a specification</b>, click the path you would take from ' +
      '"Extract objective" to "Record the decision", and press <b>Check my path</b>.</p>';
    return;
  }
  const n = nodeInfo[selectedNode];
  setPanel(panel, '<h3>' + esc(n.label) + '</h3><p>' + esc(n.def) + '</p>' +
    '<div class="example"><b>Example:</b> ' + esc(n.example) + '</div>');
}

// set the panel HTML, shrinking the font until it fits (the panel never scrolls)
function setPanel(panel, html) {
  panel.innerHTML = html;
  let fs = window.innerWidth < 600 ? 13 : 14;
  panel.style.fontSize = fs + 'px';
  while (panel.scrollHeight > panel.clientHeight + 1 && fs > 11) {
    fs--;
    panel.style.fontSize = fs + 'px';
  }
}

function chips(path, cls) {
  if (!path.length) return '<span class="hint">(no nodes clicked yet)</span>';
  return path.map(id => '<span class="path-chip ' + cls + '">' + esc(nodeInfo[id].short) + '</span>').join(' &rarr; ');
}

function renderTryPanel() {
  const s = samples[sampleIndex];
  const panel = document.getElementById('info-panel');
  let html = '<h3>' + (sampleIndex + 1) + '. ' + esc(s.title) + '</h3>';
  if (!checked) {
    html += '<div class="spec">' + esc(s.spec) + '</div>';
    html += '<p class="hint">Click the nodes in the order you would visit them, from "Extract objective" to "Record the decision". At each question, click the node its answer leads to.</p>';
    html += '<h4>Your path</h4><p>' + chips(userPath, 'chip-user') + '</p>';
    if (selectedNode) {
      const L = nodeInfo[selectedNode].label;
      html += '<p><b>' + esc(L) + (L.endsWith('?') ? '' : ':') + '</b> ' + esc(nodeInfo[selectedNode].def) + '</p>';
    }
    setPanel(panel, html);
    return;
  }
  const ref = s.path;
  let firstDiff = -1;
  for (let i = 0; i < Math.max(ref.length, userPath.length); i++) {
    if (ref[i] !== userPath[i]) { firstDiff = i; break; }
  }
  const matches = ref.filter((id, i) => userPath[i] === id).length;
  if (firstDiff < 0) {
    html += '<p class="ok">Your path matches the recommended path: ' + matches + ' of ' + ref.length + ' steps.</p>';
  } else {
    html += '<p class="bad">' + matches + ' of ' + ref.length + ' steps match. The paths part at step ' + (firstDiff + 1) + '.</p>';
    const q = ref[firstDiff - 1];
    const reason = (q && s.why[q]) ? s.why[q] :
      'The checkpoint visits every step in order: after "' + (q ? nodeInfo[q].short : 'the start') + '" comes "' + (ref[firstDiff] ? nodeInfo[ref[firstDiff]].short : 'the end') + '".';
    html += '<p>' + esc(reason) + '</p>';
  }
  html += '<h4>Recommended path</h4><p>' + ref.map(id => '<span class="path-chip ' +
    (userPath.includes(id) ? 'chip-ref' : 'chip-miss') + '">' + esc(nodeInfo[id].short) + '</span>').join(' &rarr; ') + '</p>';
  if (window.innerWidth >= 600) {
    html += '<p class="hint">In the diagram, green nodes are on both paths, salmon nodes only on yours, and dashed outlines were recommended but skipped.</p>';
  }
  html += '<h4>Completed decision</h4><pre>' + esc(s.decision) + '</pre>';
  setPanel(panel, html);
}
