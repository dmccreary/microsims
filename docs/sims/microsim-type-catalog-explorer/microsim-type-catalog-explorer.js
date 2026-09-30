// MicroSim Type Catalog Explorer - vis-network
// CANVAS_HEIGHT: 660
// A left-to-right hierarchical tree network of the MicroSim Type Catalog from Chapter 4: the
// catalog, its eight families, and the types in each family. Family nodes have one color each
// and type nodes use a lighter tint. Hover a type for its library; click it for a definition,
// the data it needs, an example objective and a near-miss objective. "Quiz me" hides the
// type labels and asks the learner to click the type that fits an example objective.
// Bloom level: Remember (identify).

const CANVAS_HEIGHT = 660;

// ---------- families (dark color) and the tint used for their types ----------
const families = [
  { id: 'F1', label: 'Custom\nsimulation', color: '#4682b4', tint: '#c6d9ec' },
  { id: 'F2', label: 'Quantitative\ndata', color: '#b3541e', tint: '#f6d7c3' },
  { id: 'F3', label: 'Structure and\nprocess', color: '#2e8b57', tint: '#c9ecd6' },
  { id: 'F4', label: 'Time and\nplace', color: '#663399', tint: '#e1d4f0' },
  { id: 'F5', label: 'Comparison', color: '#8b6914', tint: '#f3e6b8' },
  { id: 'F6', label: 'Image-based', color: '#b22222', tint: '#f6cfcf' },
  { id: 'F7', label: 'Assessment\nand labs', color: '#00707a', tint: '#c2e8ea' },
  { id: 'F8', label: 'Verified\nfacts', color: '#555555', tint: '#dddddd' }
];

// ---------- the types ----------
// near = a near-miss objective that belongs to another type (nearType)
const types = [
  { id: 'p5', fam: 'F1', label: 'p5.js', lib: 'p5.js',
    def: 'Canvas MicroSims with an animation loop, drawing functions and built-in controls, for any model a learner changes and watches.',
    data: 'A model: variables, equations or rules, and the ranges for each slider.',
    ex: 'Show how gravity and bounciness change a ball\'s motion.',
    near: 'Show enrollment by year for five schools.', nearType: 'chartjs' },
  { id: 'celebrate', fam: 'F1', label: 'Celebration effects', lib: 'p5.js',
    def: 'Particle and confetti effects that give visual feedback at a moment worth marking, such as finishing a quiz.',
    data: 'The event to celebrate and effect settings: particle count, colors and duration.',
    ex: 'Mark the moment a learner masters all ten flashcards with a short celebration.',
    near: 'Explain how gas particles spread out to fill a container.', nearType: 'p5' },
  { id: 'chartjs', fam: 'F2', label: 'Chart.js', lib: 'Chart.js',
    def: 'Standard statistical charts (bar, line, pie, doughnut, radar, scatter) with tooltips and legend toggles.',
    data: 'Numbers in categories or over time, as labeled datasets.',
    ex: 'Compare the number of MicroSims of each type across three books.',
    near: 'Explain how the amplitude of a sine wave changes its graph.', nearType: 'plotly' },
  { id: 'bubble', fam: 'F2', label: 'Bubble chart', lib: 'Chart.js',
    def: 'Priority matrices and quadrant charts where items sit on two dimensions and bubble size shows a third.',
    data: 'Items with two scores, such as impact and effort, and an optional size value.',
    ex: 'Prioritize ten course improvements by impact and effort.',
    near: 'Compare the enrollment of five schools.', nearType: 'chartjs' },
  { id: 'plotly', fam: 'F2', label: 'Plotly', lib: 'Plotly.js',
    def: 'Plots of mathematical functions with sliders, coordinate tooltips, zoom and pan.',
    data: 'A function such as f(x) = A sin(Bx) and the range of each parameter.',
    ex: 'Explain how the amplitude and frequency of a sine wave change its graph.',
    near: 'Compare survey counts across four groups.', nearType: 'chartjs' },
  { id: 'mermaid', fam: 'F3', label: 'Mermaid', lib: 'Mermaid',
    def: 'Flowcharts and other diagrams generated from short text; in this book every node gets a click directive.',
    data: 'Steps, decisions and the arrows between them, written as text.',
    ex: 'Explain the steps of a change-approval process and its two decision points.',
    near: 'Explore which of 200 concepts depend on this one.', nearType: 'visnetwork' },
  { id: 'visnetwork', fam: 'F3', label: 'vis-network', lib: 'vis-network',
    def: 'Interactive node-and-edge graphs with dragging, click-for-details and neighbor highlighting.',
    data: 'Nodes, edges and optional groups or fixed positions.',
    ex: 'Analyze which concepts must be learned before Instrumented MicroSim.',
    near: 'Describe the steps of a change-approval process.', nearType: 'mermaid' },
  { id: 'venn', fam: 'F3', label: 'Venn diagram', lib: 'venn.js (custom)',
    def: 'Two to four overlapping circles with hover text that defines each region.',
    data: 'The sets and the members or size of each overlap.',
    ex: 'Distinguish what AI, machine learning and data science have in common.',
    near: 'Analyze how twelve research fields cite one another.', nearType: 'visnetwork' },
  { id: 'cld', fam: 'F3', label: 'Causal loop', lib: 'vis-network',
    def: 'Feedback diagrams whose arrows show increase or decrease and whose loops are marked reinforcing or balancing.',
    data: 'Variables, signed causal links and loop labels.',
    ex: 'Explain why adding more road capacity can increase traffic.',
    near: 'List the systems that connect to the billing service.', nearType: 'visnetwork' },
  { id: 'timeline', fam: 'F4', label: 'vis-timeline', lib: 'vis-timeline',
    def: 'Events and periods on a zoomable time axis with click-for-detail and category filtering.',
    data: 'Dated events, each with a start date and an optional end date.',
    ex: 'Identify the milestones between MicroSims 1.0 and 2.0 and order them in time.',
    near: 'Describe the steps of making coffee, which have no dates.', nearType: 'mermaid' },
  { id: 'leaflet', fam: 'F4', label: 'Leaflet map', lib: 'Leaflet',
    def: 'Interactive maps with markers, popups, routes and layers drawn over map tiles.',
    data: 'Coordinates or place names, with popup text for each marker.',
    ex: 'Locate the major shipping routes of the Hanseatic League.',
    near: 'Map the prerequisites of one concept in the learning graph.', nearType: 'visnetwork' },
  { id: 'comparison', fam: 'F5', label: 'Comparison table', lib: 'Custom HTML',
    def: 'Side-by-side tables with 1 to 5 star ratings, badges and hover tooltips for 3 to 8 items.',
    data: 'Items, criteria and a rating or short value for each cell.',
    ex: 'Compare five charting libraries on ease of learning and interactivity.',
    near: 'Compare four learning theories across six dimensions, with a paragraph per cell.', nearType: 'matrix' },
  { id: 'matrix', fam: 'F5', label: 'HTML matrix', lib: 'Custom HTML',
    def: 'Grids whose cells open a detail panel, best at 4 to 8 rows by 3 to 6 columns.',
    data: 'Rows, columns and a paragraph plus an example for each cell.',
    ex: 'Compare four learning theories across six dimensions.',
    near: 'Rate five libraries on two criteria.', nearType: 'comparison' },
  { id: 'overlay', fam: 'F6', label: 'Image overlay', lib: 'diagram.js (custom)',
    def: 'A text-free illustration with callout markers whose labels come from a data file, with explore and quiz modes.',
    data: 'An annotation-free image and a data file of marker positions and labels.',
    ex: 'Identify the parts of a moss sporophyte.',
    near: 'Compare three storage approaches shown as columns on a poster.', nearType: 'grid' },
  { id: 'grid', fam: 'F6', label: 'Grid overlay poster', lib: 'grid-diagram.js (custom)',
    def: 'Rectangular hover zones, stored as percentages of the image, over a poster or side-by-side comparison.',
    data: 'An image and a data file of zones (x1, y1, x2, y2) with summaries and facts.',
    ex: 'Compare three data-storage approaches shown as columns on a poster.',
    near: 'Label the organelles of a plant cell.', nearType: 'overlay' },
  { id: 'classifier', fam: 'F7', label: 'Concept classifier', lib: 'p5.js',
    def: 'Sorting quizzes in which learners classify scenarios into categories, with hints and explanations.',
    data: 'A data file of scenarios, answer options, correct answers and explanations.',
    ex: 'Classify ten learning objectives by Bloom level.',
    near: 'Identify the parts of a plant cell.', nearType: 'overlay' },
  { id: 'docker', fam: 'F7', label: 'Docker Python lab', lib: 'docker-lab.js (custom)',
    def: 'Runnable Python code blocks that execute in a Docker container.',
    data: 'Starter code, the expected output and a container image.',
    ex: 'Modify a list-sorting function and run it on three inputs.',
    near: 'Show how a sorting algorithm swaps elements, one step at a time.', nearType: 'p5' },
  { id: 'verified', fam: 'F8', label: 'Verified poster', lib: 'Text verification, then an image',
    def: 'A static poster whose every number has a verified source, made only on explicit request and then wrapped in a grid overlay.',
    data: 'A claim plan with a cited source for every numeric claim.',
    ex: 'Summarize LED and incandescent lighting efficiency on a printable poster with real numbers.',
    near: 'Chart enrollment figures that I typed in.', nearType: 'chartjs' }
];

const typeById = {};
types.forEach(t => { typeById[t.id] = t; });
const famById = {};
families.forEach(f => { famById[f.id] = f; });

// ---------- state ----------
let network, nodes, edges;
let selected = null;
let quiz = null;        // {order:[typeIds], index, correct, answered, clicked}

// ---------- environment ----------
function isInIframe() {
  try { return window.self !== window.top; } catch (e) { return true; }
}

// ---------- build ----------
function typeNode(t, hideLabel) {
  const f = famById[t.fam];
  return {
    id: t.id, level: 2, shape: 'box',
    label: hideLabel ? '  ?  ' : t.label,
    title: hideLabel ? undefined : 'Library: ' + t.lib,
    color: { background: f.tint, border: f.color, highlight: { background: f.tint, border: 'black' }, hover: { background: f.tint, border: 'black' } },
    font: { color: 'black', size: 15 }, borderWidth: 2, margin: { top: 5, bottom: 5, left: 8, right: 8 }
  };
}

function initNetwork() {
  const nodeList = [{
    id: 'catalog', level: 0, shape: 'box', label: 'MicroSim\nType Catalog',
    title: '8 families, ' + types.length + ' types',
    color: { background: '#191970', border: '#191970', highlight: { background: '#191970', border: 'black' } },
    font: { color: 'white', size: 16, bold: true }, margin: 10
  }];
  const edgeList = [];
  families.forEach(f => {
    const n = types.filter(t => t.fam === f.id).length;
    nodeList.push({
      id: f.id, level: 1, shape: 'box', label: f.label, title: n + (n === 1 ? ' type' : ' types'),
      color: { background: f.color, border: f.color, highlight: { background: f.color, border: 'black' }, hover: { background: f.color, border: 'black' } },
      font: { color: 'white', size: 15 }, margin: 8
    });
    edgeList.push({ from: 'catalog', to: f.id });
  });
  types.forEach(t => {
    nodeList.push(typeNode(t, false));
    edgeList.push({ from: t.fam, to: t.id, color: { color: famById[t.fam].color } });
  });
  // Tree layout computed here (levels at fixed x, types in evenly spaced rows, each family
  // centered on its types) so the eight families never crowd each other.
  const ROW = 29, FAMILY_GAP = 14, X = [0, 180, 370];
  const yOf = {};
  let y = 0;
  types.forEach((t, i) => {
    if (i > 0) y += ROW + (t.fam !== types[i - 1].fam ? FAMILY_GAP : 0);
    yOf[t.id] = y;
  });
  families.forEach(f => {
    const ys = types.filter(t => t.fam === f.id).map(t => yOf[t.id]);
    yOf[f.id] = ys.reduce((a, b) => a + b, 0) / ys.length;
  });
  yOf.catalog = y / 2;
  nodeList.forEach(n => {
    n.x = X[n.level];
    n.y = yOf[n.id];
  });
  nodes = new vis.DataSet(nodeList);
  edges = new vis.DataSet(edgeList);

  const standalone = !isInIframe();
  const options = {
    layout: { hierarchical: { enabled: false }, improvedLayout: false },
    physics: { enabled: false },
    interaction: {
      hover: true, dragNodes: true, tooltipDelay: 150,
      dragView: standalone,           // pan and wheel zoom only when not embedded in an iframe
      zoomView: standalone,
      navigationButtons: true, selectConnectedEdges: false
    },
    edges: { color: { color: '#999999' }, width: 1.5, smooth: { type: 'cubicBezier', forceDirection: 'horizontal', roundness: 0.5 } },
    nodes: { shape: 'box', font: { face: 'Arial' } }
  };
  network = new vis.Network(document.getElementById('network'), { nodes: nodes, edges: edges }, options);
  network.once('afterDrawing', fitWithRoom);
  network.on('click', params => {
    if (params.nodes.length) onNodeClick(params.nodes[0]);
  });
}

// ---------- sizing ----------
function fitLayout() {
  const narrow = window.innerWidth < 600;
  const toolbarH = document.getElementById('toolbar').offsetHeight;
  const layoutH = CANVAS_HEIGHT - toolbarH;
  document.getElementById('layout').style.height = layoutH + 'px';
  const netH = narrow ? Math.round(layoutH * 0.58) : layoutH;
  document.getElementById('network-wrap').style.height = netH + 'px';
  document.getElementById('info-panel').style.height = (narrow ? layoutH - netH : layoutH) + 'px';
  if (network) {
    network.redraw();
    fitWithRoom();
  }
}

// fit the whole tree into the view while keeping the bottom strip (where the navigation
// buttons sit) clear of nodes
function fitWithRoom() {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  nodes.getIds().forEach(id => {
    const b = network.getBoundingBox(id);
    minX = Math.min(minX, b.left); maxX = Math.max(maxX, b.right);
    minY = Math.min(minY, b.top); maxY = Math.max(maxY, b.bottom);
  });
  const el = document.getElementById('network');
  const navH = 62, pad = 16;
  const scale = Math.min((el.clientWidth - pad) / (maxX - minX), (el.clientHeight - navH - pad) / (maxY - minY));
  network.moveTo({
    position: { x: (minX + maxX) / 2, y: (minY + maxY) / 2 + (navH / 2) / scale },
    scale: scale, animation: false
  });
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
  const next = document.getElementById('next-q');
  if (next) next.addEventListener('click', nextQuestion);
}

function typeHtml(t) {
  const f = famById[t.fam];
  const nt = typeById[t.nearType];
  return '<h3>' + esc(t.label) + '</h3>' +
    '<span class="lib" style="background:' + f.tint + ';border:1px solid ' + f.color + '">Library: ' + esc(t.lib) + '</span>' +
    '<p>' + esc(t.def) + '</p>' +
    '<p><span class="label">Data it needs:</span> ' + esc(t.data) + '</p>' +
    '<div class="ex"><span class="label">Example objective:</span> ' + esc(t.ex) + '</div>' +
    '<div class="miss"><span class="label">Near miss:</span> "' + esc(t.near) + '" belongs to <b>' + esc(nt.label) + '</b>, not ' + esc(t.label) + '.</div>';
}

function showIntro() {
  setPanel('<h3>MicroSim Type Catalog</h3>' +
    '<p>The catalog groups the generator skill\'s MicroSim types into eight families by what the learner needs to see. Dark boxes are families, each with its own color; light boxes are the types in that family, in a lighter tint of the same color.</p>' +
    '<p class="hint">Hover a type to see its library. Click a type for its definition, the data it needs, an example objective and a near-miss objective.</p>' +
    '<p class="hint">Press <b>Quiz me</b> to hide the type names and match example objectives to types.</p>');
}

function onNodeClick(id) {
  if (quiz) { answerQuiz(id); return; }
  selected = id;
  if (typeById[id]) setPanel(typeHtml(typeById[id]));
  else if (famById[id]) {
    const list = types.filter(t => t.fam === id).map(t => esc(t.label)).join(', ');
    setPanel('<h3>' + esc(famById[id].label.replace('\n', ' ')) + '</h3><p>Family of ' +
      types.filter(t => t.fam === id).length + ' type(s): ' + list + '.</p><p class="hint">Click one of its types for details.</p>');
  } else showIntro();
}

// ---------- quiz ----------
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function setTypeLabels(hidden) {
  nodes.update(types.map(t => typeNode(t, hidden)));
}

function startQuiz() {
  quiz = { order: shuffle(types.map(t => t.id)), index: 0, correct: 0, answered: 0, clicked: null };
  document.getElementById('quiz-btn').textContent = 'Stop quiz';
  setTypeLabels(true);
  network.unselectAll();
  renderQuiz();
}

function stopQuiz() {
  quiz = null;
  document.getElementById('quiz-btn').textContent = 'Quiz me';
  setTypeLabels(false);
  showIntro();
}

function renderQuiz() {
  const target = typeById[quiz.order[quiz.index]];
  let html = '<h3>Quiz: which type fits?</h3>' +
    '<p class="hint">Question ' + (quiz.index + 1) + ' of ' + quiz.order.length + ' &nbsp; Correct: ' + quiz.correct + ' of ' + quiz.answered + '</p>' +
    '<div class="quiz">' + esc(target.ex) + '</div>';
  if (!quiz.clicked) {
    html += '<p class="hint">Click the type node (a light box marked ?) that fits this objective. The family colors are your clue.</p>';
  } else {
    const ok = quiz.clicked === target.id;
    html += ok ? '<p class="ok">Correct: ' + esc(target.label) + ' (' + esc(target.lib) + ').</p>' :
      '<p class="bad">Not quite: you clicked ' + esc(typeById[quiz.clicked].label) + '. The answer is ' + esc(target.label) + ' (' + esc(target.lib) + ').</p>';
    html += '<p>' + esc(target.def) + '</p>';
    html += quiz.index + 1 < quiz.order.length ? '<button id="next-q">Next question</button>' :
      '<p class="ok">Quiz finished: ' + quiz.correct + ' of ' + quiz.order.length + ' correct.</p><button id="next-q">Start again</button>';
  }
  setPanel(html);
}

function answerQuiz(id) {
  if (!typeById[id] || quiz.clicked) return;
  const target = quiz.order[quiz.index];
  quiz.clicked = id;
  quiz.answered++;
  if (id === target) quiz.correct++;
  // reveal the clicked node and the answer
  const upd = [typeNode(typeById[target], false)];
  upd[0].color = Object.assign({}, upd[0].color, { border: 'green' });
  upd[0].borderWidth = 4;
  if (id !== target) {
    const wrong = typeNode(typeById[id], false);
    wrong.color = Object.assign({}, wrong.color, { border: 'red' });
    wrong.borderWidth = 4;
    upd.push(wrong);
  }
  nodes.update(upd);
  renderQuiz();
}

function nextQuestion() {
  if (!quiz) return;
  if (quiz.index + 1 >= quiz.order.length) { startQuiz(); return; }
  quiz.index++;
  quiz.clicked = null;
  setTypeLabels(true);
  network.unselectAll();
  renderQuiz();
}

// ---------- start ----------
document.addEventListener('DOMContentLoaded', () => {
  fitLayout();
  initNetwork();
  showIntro();
  document.getElementById('quiz-btn').addEventListener('click', () => (quiz ? stopQuiz() : startQuiz()));
  document.getElementById('fit-btn').addEventListener('click', fitWithRoom);
  window.addEventListener('resize', fitLayout);
});
