// Objectives Neighborhood of the Learning Graph - vis-network
// CANVAS_HEIGHT: 602
// The 26 OBJ concepts of the book's learning graph plus their direct prerequisites and
// dependents. Edges point from a dependent to its prerequisite ("depends on").
// Click a concept: prerequisites turn green, dependents orange, and the panel lists both.
// Data is read from docs/learning-graph/learning-graph.json at load time; an embedded
// snapshot of the same neighborhood is used when the file cannot be fetched (file://).

// ===========================================
// DATA
// ===========================================
const GRAPH_URL = '../../learning-graph/learning-graph.json';
const FOCUS_GROUP = 'OBJ';

// Stored left-to-right layout (graph units): prerequisites sit to the left.
const STORED_POSITIONS = {
  2: [0, 110],  // Intelligent Textbook
  3: [360, 455],  // Interactive Simulation
  4: [0, 250],  // Learning Object
  14: [0, 20],  // MkDocs
  37: [72, 60],  // Course Description
  38: [72, 180],  // Concept
  39: [144, 15],  // Learning Graph
  40: [144, 110],  // Concept Dependency
  41: [144, 215],  // Learning Objective
  42: [216, 180],  // Measurable Objective
  43: [216, 75],  // Learning Outcome
  44: [216, 270],  // Bloom's Taxonomy
  45: [288, 410],  // Remember Level
  46: [288, 335],  // Understand Level
  47: [288, 235],  // Apply Level
  48: [360, 185],  // Analyze Level
  49: [432, 135],  // Evaluate Level
  50: [504, 85],  // Create Level
  51: [288, 140],  // Bloom Verb
  52: [360, 280],  // Objective Classification
  53: [72, 370],  // Cognitive Load Theory
  54: [144, 310],  // Intrinsic Load
  55: [144, 395],  // Extraneous Load
  56: [144, 480],  // Germane Load
  57: [432, 380],  // Instructional Design Checkpoint
  58: [504, 450],  // Predict-First Design
  59: [504, 330],  // Purpose of Animation
  60: [432, 250],  // Interaction Pattern
  61: [216, 350],  // Scaffolding
  62: [216, 15],  // Formative Assessment
  63: [475, 210],  // MicroSim Type Catalog
  64: [422, 210],  // Type Routing
  69: [494, 306],  // Objective-to-Type Mapping
  70: [513, 282],  // Interactive-by-Default Policy
  87: [350, 410],  // Concept Classifier Type
  89: [494, 282],  // Flash Card MicroSim
  90: [547, 130],  // Model Editor MicroSim
  100: [206, 402],  // Specification Block
  169: [282, 66],  // Node and Edge Data
  171: [115, 178],  // Concept Map
  172: [301, 18],  // Graph Viewer
  181: [206, 426],  // Diagram Readability
  206: [278, 42],  // Quiz Mode
  272: [278, 306],  // Educational Metadata
  283: [206, 138],  // Concept Link Metadata
  303: [513, 250],  // Evidence Class
  308: [278, 18],  // Assessment Evidence
  321: [320, 18],  // Concept Mapping
  335: [320, 42],  // Property Graph Data Model
  389: [278, 202],  // Concept Mastery
  394: [513, 218],  // Diagnostic Value
  408: [301, 74],  // Prerequisite Propagation
  409: [278, 98],  // Held-Out Assessment
  422: [475, 178],  // Interaction Diagnosticity
  428: [301, 34],  // Concept Coverage Gap
  430: [547, 434],  // PRIMM Method
  431: [134, 370],  // Semantic Waves
};

// One-sentence definitions written from the chapter text (the learning graph file
// stores labels and scores only).
const DEFINITIONS = {
  2: 'A textbook published as a website that can adapt to its readers, built in this book with MkDocs, a learning graph and embedded MicroSims.',
  3: 'A computer model that a learner changes through controls and that responds immediately, so the learner can explore cause and effect.',
  4: 'A self-contained, reusable container for instruction, such as a diagram, a video or a MicroSim.',
  14: 'A static-site generator that turns Markdown files into the website that hosts this book and its MicroSims.',
  37: 'A structured document that states a course\'s title, audience, prerequisites, topics covered and excluded, and learning outcomes.',
  38: 'A named unit of knowledge small enough to be defined in a sentence and assessed on its own.',
  39: 'A directed acyclic graph whose nodes are concepts and whose edges record that one concept depends on another.',
  40: 'A statement that a learner needs one concept before another, recorded from the dependent concept to its prerequisite.',
  41: 'A statement of what a learner will be able to do after an instructional experience: an actor, an action and a concept.',
  42: 'A learning objective whose success can be decided by observing what the learner does, under stated conditions and against a stated standard.',
  43: 'What a learner can actually do after instruction, as observed in their performance.',
  44: 'A framework, revised in 2001, that classifies learning objectives by the kind of thinking they demand, in six levels.',
  45: 'The Bloom level at which the learner retrieves a fact, term or list from memory.',
  46: 'The Bloom level at which the learner builds meaning: explaining, summarizing, interpreting, classifying, comparing or inferring.',
  47: 'The Bloom level at which the learner uses a known procedure or idea in a situation they have not seen before.',
  48: 'The Bloom level at which the learner breaks a whole into parts and works out how the parts relate.',
  49: 'The Bloom level at which the learner makes a judgment against stated criteria and defends it.',
  50: 'The Bloom level at which the learner produces something new by combining elements.',
  51: 'The action verb that opens a learning objective and signals which Bloom level it aims at.',
  52: 'Assigning each learning objective to one Bloom level with a recorded reason, using the book\'s three-step procedure.',
  53: 'The theory that working memory is severely limited, so instruction works best when it does not overload it.',
  54: 'Load imposed by the difficulty of the material itself: how many interacting elements must be held in mind at once.',
  55: 'Load caused by the way information is presented, when that load does not contribute to learning.',
  56: 'The effort a learner spends building and organizing knowledge; the load a designer wants to encourage.',
  57: 'A mandatory review before any code is written: extract the objective, match an interaction pattern, and answer four design questions.',
  58: 'A design in which the learner commits to a prediction before the MicroSim shows the result.',
  59: 'The rule that animation is used only when it shows something a static arrow cannot.',
  60: 'A reusable way in which a learner acts on a MicroSim and receives feedback, such as sorting items or moving a slider.',
  61: 'Temporary support that lets a learner succeed at a task before they can do it alone, removed as their skill grows.',
  62: 'A check of understanding made during learning to guide the next step, not to assign a grade.',
  63: 'The list of MicroSim types, such as p5.js simulations, charts, networks, timelines and maps, with the library each uses.',
  64: 'Choosing the MicroSim type and library for a learning objective with a scoring rubric.',
  69: 'The mapping from an objective\'s Bloom level and verb to the MicroSim types that suit it.',
  70: 'The policy that a MicroSim is interactive unless a static image was specifically requested.',
  87: 'A MicroSim type in which learners sort scenarios into categories and see an explanation for each answer.',
  89: 'A MicroSim type that shows a prompt and then reveals the answer, suited to Remember-level recall.',
  90: 'A MicroSim type in which learners build or edit a model, suited to Create-level objectives.',
  100: 'The structured text in a chapter that tells an AI skill what MicroSim to build, including its learning objective.',
  169: 'The lists of nodes and edges, with their properties, from which a network diagram is drawn.',
  171: 'A diagram of concepts drawn as nodes joined by labeled relationships.',
  172: 'A MicroSim that displays a learning graph so readers can explore its concepts and dependencies.',
  181: 'How easily a reader can make out a diagram\'s labels, links and layout.',
  206: 'A MicroSim mode that asks the learner questions about what the diagram or simulation shows.',
  272: 'The metadata fields that record a MicroSim\'s audience, learning objectives and Bloom levels.',
  283: 'Metadata that ties a MicroSim to the learning-graph concepts it teaches.',
  303: 'A category of interaction ranked by how much it reveals about mastery, from noise to strong evidence.',
  308: 'Interactions, such as answered questions, that can count as evidence of what a learner knows.',
  321: 'Tagging each interaction statement with the learning-graph concept it provides evidence about.',
  335: 'A graph data model whose nodes and edges carry key-value properties, used to store learners, concepts and events.',
  389: 'Having learned a concept well enough to use it reliably.',
  394: 'How much an interaction\'s result changes the estimate of whether a learner has mastered a concept.',
  408: 'Updating mastery estimates of prerequisite concepts from evidence about the concepts that depend on them.',
  409: 'An assessment kept apart from the event stream and used to test how well the events predict mastery.',
  422: 'How well a kind of interaction separates learners who have mastered a concept from those who have not.',
  428: 'A concept in the learning graph that no MicroSim or assessment yet provides evidence for.',
  430: 'A programming pedagogy with five stages: Predict, Run, Investigate, Modify and Make.',
  431: 'Moving an explanation back and forth between abstract ideas and concrete examples so learners connect them.'
};

// Embedded snapshot of the neighborhood (used only if the JSON file cannot be fetched)
const SNAPSHOT = {
  groups: {"BATCH": {"classifierName": "Batch Generation, Metadata and Reuse"}, "DIAG": {"classifierName": "Diagrams, Networks, Timelines and Maps"}, "FOUND": {"classifierName": "Foundations and Anatomy"}, "GEN": {"classifierName": "AI Generation and Skills"}, "LRS": {"classifierName": "The Full LRS"}, "MAST": {"classifierName": "Mastery Prediction and Evaluation"}, "OBJ": {"classifierName": "Learning Objectives and Bloom"}, "OVL": {"classifierName": "Image Overlays and Posters"}, "PED": {"classifierName": "Pedagogy, Ethics and the Future"}, "TYPE": {"classifierName": "MicroSim Types and Routing"}, "XAPI": {"classifierName": "xAPI Instrumentation"}},
  nodes: [
    {"id": 2, "label": "Intelligent Textbook", "group": "FOUND", "cis": 47},
    {"id": 3, "label": "Interactive Simulation", "group": "FOUND", "cis": 3475},
    {"id": 4, "label": "Learning Object", "group": "FOUND", "cis": 6272},
    {"id": 14, "label": "MkDocs", "group": "FOUND", "cis": 438},
    {"id": 37, "label": "Course Description", "group": "OBJ", "cis": 46},
    {"id": 38, "label": "Concept", "group": "OBJ", "cis": 3316},
    {"id": 39, "label": "Learning Graph", "group": "OBJ", "cis": 45},
    {"id": 40, "label": "Concept Dependency", "group": "OBJ", "cis": 13},
    {"id": 41, "label": "Learning Objective", "group": "OBJ", "cis": 3094},
    {"id": 42, "label": "Measurable Objective", "group": "OBJ", "cis": 902},
    {"id": 43, "label": "Learning Outcome", "group": "OBJ", "cis": 1},
    {"id": 44, "label": "Bloom's Taxonomy", "group": "OBJ", "cis": 1317},
    {"id": 45, "label": "Remember Level", "group": "OBJ", "cis": 6},
    {"id": 46, "label": "Understand Level", "group": "OBJ", "cis": 1},
    {"id": 47, "label": "Apply Level", "group": "OBJ", "cis": 6},
    {"id": 48, "label": "Analyze Level", "group": "OBJ", "cis": 5},
    {"id": 49, "label": "Evaluate Level", "group": "OBJ", "cis": 4},
    {"id": 50, "label": "Create Level", "group": "OBJ", "cis": 3},
    {"id": 51, "label": "Bloom Verb", "group": "OBJ", "cis": 635},
    {"id": 52, "label": "Objective Classification", "group": "OBJ", "cis": 631},
    {"id": 53, "label": "Cognitive Load Theory", "group": "OBJ", "cis": 16},
    {"id": 54, "label": "Intrinsic Load", "group": "OBJ", "cis": 3},
    {"id": 55, "label": "Extraneous Load", "group": "OBJ", "cis": 3},
    {"id": 56, "label": "Germane Load", "group": "OBJ", "cis": 1},
    {"id": 57, "label": "Instructional Design Checkpoint", "group": "OBJ", "cis": 7},
    {"id": 58, "label": "Predict-First Design", "group": "OBJ", "cis": 2},
    {"id": 59, "label": "Purpose of Animation", "group": "OBJ", "cis": 1},
    {"id": 60, "label": "Interaction Pattern", "group": "OBJ", "cis": 541},
    {"id": 61, "label": "Scaffolding", "group": "OBJ", "cis": 2},
    {"id": 62, "label": "Formative Assessment", "group": "OBJ", "cis": 158},
    {"id": 63, "label": "MicroSim Type Catalog", "group": "TYPE", "cis": 317},
    {"id": 64, "label": "Type Routing", "group": "TYPE", "cis": 82},
    {"id": 69, "label": "Objective-to-Type Mapping", "group": "TYPE", "cis": 3},
    {"id": 70, "label": "Interactive-by-Default Policy", "group": "TYPE", "cis": 2},
    {"id": 87, "label": "Concept Classifier Type", "group": "TYPE", "cis": 3},
    {"id": 89, "label": "Flash Card MicroSim", "group": "TYPE", "cis": 2},
    {"id": 90, "label": "Model Editor MicroSim", "group": "TYPE", "cis": 2},
    {"id": 100, "label": "Specification Block", "group": "GEN", "cis": 47},
    {"id": 169, "label": "Node and Edge Data", "group": "DIAG", "cis": 11},
    {"id": 171, "label": "Concept Map", "group": "DIAG", "cis": 1},
    {"id": 172, "label": "Graph Viewer", "group": "DIAG", "cis": 1},
    {"id": 181, "label": "Diagram Readability", "group": "DIAG", "cis": 1},
    {"id": 206, "label": "Quiz Mode", "group": "OVL", "cis": 3},
    {"id": 272, "label": "Educational Metadata", "group": "BATCH", "cis": 37},
    {"id": 283, "label": "Concept Link Metadata", "group": "BATCH", "cis": 22},
    {"id": 303, "label": "Evidence Class", "group": "XAPI", "cis": 211},
    {"id": 308, "label": "Assessment Evidence", "group": "XAPI", "cis": 28},
    {"id": 321, "label": "Concept Mapping", "group": "XAPI", "cis": 10},
    {"id": 335, "label": "Property Graph Data Model", "group": "LRS", "cis": 10},
    {"id": 389, "label": "Concept Mastery", "group": "MAST", "cis": 140},
    {"id": 394, "label": "Diagnostic Value", "group": "MAST", "cis": 5},
    {"id": 408, "label": "Prerequisite Propagation", "group": "MAST", "cis": 1},
    {"id": 409, "label": "Held-Out Assessment", "group": "MAST", "cis": 126},
    {"id": 422, "label": "Interaction Diagnosticity", "group": "MAST", "cis": 1},
    {"id": 428, "label": "Concept Coverage Gap", "group": "MAST", "cis": 1},
    {"id": 430, "label": "PRIMM Method", "group": "PED", "cis": 1},
    {"id": 431, "label": "Semantic Waves", "group": "PED", "cis": 1}
  ],
  edges: [
    {from: 37, to: 14}, {from: 37, to: 2}, {from: 38, to: 4}, {from: 39, to: 38}, {from: 39, to: 37}, {from: 40, to: 38}, {from: 41, to: 38}, {from: 42, to: 41}, {from: 43, to: 41}, {from: 44, to: 41}, {from: 45, to: 44}, {from: 46, to: 44}, {from: 47, to: 44}, {from: 48, to: 47}, {from: 49, to: 48}, {from: 50, to: 49}, {from: 51, to: 44}, {from: 51, to: 42}, {from: 52, to: 44}, {from: 52, to: 41}, {from: 52, to: 51}, {from: 53, to: 4}, {from: 54, to: 53}, {from: 55, to: 53}, {from: 56, to: 53}, {from: 57, to: 52}, {from: 57, to: 53}, {from: 58, to: 57}, {from: 59, to: 57}, {from: 59, to: 55}, {from: 60, to: 52}, {from: 60, to: 3}, {from: 61, to: 54}, {from: 62, to: 41}, {from: 63, to: 60}, {from: 64, to: 52}, {from: 69, to: 57}, {from: 69, to: 51}, {from: 70, to: 60}, {from: 87, to: 45}, {from: 89, to: 45}, {from: 89, to: 60}, {from: 90, to: 50}, {from: 90, to: 60}, {from: 100, to: 41}, {from: 169, to: 40}, {from: 171, to: 38}, {from: 172, to: 39}, {from: 181, to: 55}, {from: 206, to: 62}, {from: 272, to: 41}, {from: 272, to: 44}, {from: 283, to: 38}, {from: 283, to: 39}, {from: 303, to: 60}, {from: 308, to: 62}, {from: 321, to: 39}, {from: 335, to: 39}, {from: 389, to: 42}, {from: 389, to: 38}, {from: 394, to: 60}, {from: 408, to: 40}, {from: 409, to: 62}, {from: 409, to: 42}, {from: 422, to: 60}, {from: 428, to: 39}, {from: 430, to: 61}, {from: 430, to: 58}, {from: 431, to: 53}
  ]
};

// ===========================================
// STATE
// ===========================================
let network = null;
let nodesDS = null;
let edgesDS = null;
let graph = null;           // { nodes: Map id->node, edges: [{from,to}], groups }
let selectedId = null;
let checkMode = null;       // { target, picks:Set, done:bool, result }
let score = { correct: 0, attempts: 0 };

const COLORS = {
  obj: { background: 'lightsteelblue', border: 'slateblue' },
  other: { background: 'gainsboro', border: 'gray' },
  selected: { background: 'gold', border: 'darkgoldenrod' },
  prereq: { background: 'lightgreen', border: 'green' },
  dependent: { background: 'orange', border: 'chocolate' },
  dim: { background: 'white', border: 'lightgray' },
  pick: { background: 'lightskyblue', border: 'royalblue' },
  wrong: { background: 'lightpink', border: 'firebrick' }
};

// ===========================================
// ENVIRONMENT
// ===========================================
function isInIframe() {
  try { return window.self !== window.top; } catch (e) { return true; }
}

// ===========================================
// LOADING
// ===========================================
async function loadGraph() {
  try {
    const resp = await fetch(GRAPH_URL);
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const full = await resp.json();
    document.getElementById('source-note').textContent = 'data: learning-graph.json';
    return buildNeighborhood(full);
  } catch (e) {
    document.getElementById('source-note').textContent = 'data: embedded snapshot';
    return buildNeighborhood(SNAPSHOT);
  }
}

// Keep the focus-group concepts plus every node joined to them by one edge.
// Only edges that touch a focus-group concept are kept.
function buildNeighborhood(full) {
  const all = new Map(full.nodes.map(n => [n.id, n]));
  const focus = new Set(full.nodes.filter(n => n.group === FOCUS_GROUP).map(n => n.id));
  const edges = full.edges.filter(e => focus.has(e.from) || focus.has(e.to))
    .map(e => ({ from: e.from, to: e.to }));
  const ids = new Set();
  edges.forEach(e => { ids.add(e.from); ids.add(e.to); });
  focus.forEach(id => ids.add(id));
  const nodes = new Map();
  ids.forEach(id => { if (all.has(id)) nodes.set(id, all.get(id)); });
  return { nodes, edges, groups: full.groups || {} };
}

// ===========================================
// GRAPH QUERIES
// ===========================================
function prerequisitesOf(id) {
  return graph.edges.filter(e => e.from === id).map(e => e.to);
}
function dependentsOf(id) {
  return graph.edges.filter(e => e.to === id).map(e => e.from);
}
function transitiveDependentsOf(id) {
  const seen = new Set();
  const stack = [id];
  while (stack.length) {
    const cur = stack.pop();
    for (const d of dependentsOf(cur)) {
      if (!seen.has(d)) { seen.add(d); stack.push(d); }
    }
  }
  return seen;
}
function label(id) { return graph.nodes.get(id).label; }
function cis(id) { return graph.nodes.get(id).cis || 1; }
function isFocus(id) { return graph.nodes.get(id).group === FOCUS_GROUP; }
// Focus concepts and their outside prerequisites carry labels; outside dependents do not
function isLabeled(id) {
  return isFocus(id) || graph.edges.some(e => e.to === id && isFocus(e.from));
}

// Fallback position for a concept that has no stored position (if the graph changes)
function fallbackPosition(id) {
  const pre = prerequisitesOf(id).filter(p => STORED_POSITIONS[p]);
  const x = pre.length ? Math.max(...pre.map(p => STORED_POSITIONS[p][0])) + 60 : 640;
  return [x, 40 + (id * 37) % 440];
}

// ===========================================
// NETWORK
// ===========================================
function nodeSize(id) { return 4 + 1.9 * Math.log(cis(id)); }

function baseStyle(id) {
  const c = isFocus(id) ? COLORS.obj : COLORS.other;
  return { color: { background: c.background, border: c.border,
    highlight: { background: c.background, border: c.border },
    hover: { background: c.background, border: c.border } },
    font: { color: 'black' }, borderWidth: 2 };
}

function initNetwork() {
  const nodeList = [];
  graph.nodes.forEach((n, id) => {
    const p = STORED_POSITIONS[id] || fallbackPosition(id);
    nodeList.push(Object.assign({
      id: id,
      // dependents from other chapters are unlabeled dots (hover for the name)
      label: isLabeled(id) ? n.label : undefined,
      x: p[0], y: p[1],
      size: nodeSize(id),
      title: n.label + '\nConcept Impact Score: ' + (n.cis || 1)
    }, baseStyle(id)));
  });
  const edgeList = graph.edges.map((e, i) => ({ id: 'e' + i, from: e.from, to: e.to }));

  nodesDS = new vis.DataSet(nodeList);
  edgesDS = new vis.DataSet(edgeList);

  const mouse = !isInIframe();
  const options = {
    layout: { improvedLayout: false },
    physics: { enabled: false },
    interaction: {
      hover: true,
      tooltipDelay: 150,
      selectConnectedEdges: false,
      dragNodes: false,
      dragView: mouse,
      zoomView: mouse,
      navigationButtons: true,
      keyboard: { enabled: false }
    },
    nodes: {
      shape: 'dot',
      font: { size: 16, face: 'Arial', color: 'black', multi: false },
      widthConstraint: { maximum: 90 },
      borderWidth: 2
    },
    edges: {
      arrows: { to: { enabled: true, scaleFactor: 0.55 } },
      color: { color: 'silver', highlight: 'silver', hover: 'gray' },
      width: 1,
      smooth: false
    }
  };

  network = new vis.Network(document.getElementById('network'), { nodes: nodesDS, edges: edgesDS }, options);
  network.on('click', onClick);
  network.once('afterDrawing', fitView);
  window.addEventListener('resize', () => { if (network) { network.redraw(); fitView(); } });
}

// Fit the whole neighborhood, leaving room for the navigation buttons at the bottom
function fitView() {
  network.fit({ animation: false });
  const pos = network.getViewPosition();
  const s = network.getScale();
  network.moveTo({ position: { x: pos.x, y: pos.y + 22 / s }, scale: s, animation: false });
}

// ===========================================
// HIGHLIGHTING
// ===========================================
function restyle() {
  const updates = [];
  const edgeUpdates = [];
  let pre = new Set(), dep = new Set();
  if (selectedId !== null && !checkMode) {
    pre = new Set(prerequisitesOf(selectedId));
    dep = document.getElementById('transitive').checked ?
      transitiveDependentsOf(selectedId) : new Set(dependentsOf(selectedId));
  }
  graph.nodes.forEach((n, id) => {
    let style = baseStyle(id);
    let c = null;
    if (checkMode) {
      if (id === checkMode.target) c = COLORS.selected;
      else if (checkMode.done) {
        const truth = new Set(prerequisitesOf(checkMode.target));
        if (truth.has(id)) c = COLORS.prereq;
        else if (checkMode.picks.has(id)) c = COLORS.wrong;
      } else if (checkMode.picks.has(id)) c = COLORS.pick;
    } else if (selectedId !== null) {
      if (id === selectedId) c = COLORS.selected;
      else if (pre.has(id)) c = COLORS.prereq;
      else if (dep.has(id)) c = COLORS.dependent;
      else c = COLORS.dim;
    }
    if (c) {
      style.color = { background: c.background, border: c.border,
        highlight: { background: c.background, border: c.border },
        hover: { background: c.background, border: c.border } };
      if (c === COLORS.dim) style.font = { color: 'darkgray' };
      if (c !== COLORS.dim) style.borderWidth = 3;
    }
    // make the selected concept or the Check me target easy to see, however small its score
    const emphasized = (checkMode && id === checkMode.target) || (!checkMode && id === selectedId);
    style.size = emphasized ? Math.max(nodeSize(id), 12) : nodeSize(id);
    updates.push(Object.assign({ id: id }, style));
  });
  graph.edges.forEach((e, i) => {
    let color = 'silver', width = 1;
    if (!checkMode && selectedId !== null) {
      if (e.from === selectedId && pre.has(e.to)) { color = 'green'; width = 2.5; }
      else if (dep.has(e.from) && (e.to === selectedId || dep.has(e.to))) { color = 'chocolate'; width = 2.5; }
      else color = 'gainsboro';
    }
    edgeUpdates.push({ id: 'e' + i, color: { color: color, highlight: color, hover: color }, width: width });
  });
  nodesDS.update(updates);
  edgesDS.update(edgeUpdates);
}

// ===========================================
// INFO PANEL
// ===========================================
function groupName(id) {
  const g = graph.nodes.get(id).group;
  return (graph.groups[g] && graph.groups[g].classifierName) || g;
}

function listHtml(ids) {
  if (ids.length === 0) return '<ul><li class="hint">none in this neighborhood</li></ul>';
  const sorted = [...ids].sort((a, b) => cis(b) - cis(a));
  return '<ul>' + sorted.map(i => '<li>' + label(i) + ' <span class="note">(' + cis(i) + ')</span></li>').join('') + '</ul>';
}

function showInfo(id) {
  const info = document.getElementById('info');
  if (id === null) {
    info.innerHTML = '<p class="hint">Click any concept to see its definition, its Concept Impact Score, ' +
      'the concepts it depends on (green) and the concepts that depend on it (orange). ' +
      'Hover a dot to see its score. Press <b>Check me</b> to test yourself.</p>' +
      '<p class="hint">The Concept Impact Score is 1 plus the sum of the scores of a concept\'s direct dependents, ' +
      'so a concept many others build on scores high.</p>';
    return;
  }
  const pre = prerequisitesOf(id);
  const transitive = document.getElementById('transitive').checked;
  const dep = transitive ? [...transitiveDependentsOf(id)] : dependentsOf(id);
  const focus = isFocus(id);
  let html = '<p class="note">Click another concept, or click empty space to clear.</p>' +
    '<h3>' + label(id) + '</h3>' +
    '<span class="cat' + (focus ? '' : ' other') + '">' + groupName(id) + '</span>' +
    '<div class="def">' + (DEFINITIONS[id] || '') + '</div>' +
    '<div class="cis">Concept Impact Score: ' + cis(id) + '</div>' +
    '<div class="list-title pre">Prerequisites (' + pre.length + ')</div>' + listHtml(pre) +
    '<div class="list-title dep">' + (transitive ? 'All dependents, any path (' : 'Direct dependents (') +
    dep.length + ')</div>' + listHtml(dep);
  if (!focus) html += '<p class="note">This concept belongs to another chapter; only its links to this chapter\'s concepts are shown.</p>';
  else html += '<p class="note">Numbers in brackets are Concept Impact Scores.</p>';
  info.innerHTML = html;
}

// ===========================================
// CHECK ME
// ===========================================
function startCheck() {
  const btn = document.getElementById('check-btn');
  if (checkMode && !checkMode.done) { finishCheck(); return; }
  const candidates = [...graph.nodes.keys()].filter(id => isFocus(id) && prerequisitesOf(id).length > 0);
  let target = candidates[Math.floor(Math.random() * candidates.length)];
  if (checkMode && candidates.length > 1) {
    while (target === checkMode.target) target = candidates[Math.floor(Math.random() * candidates.length)];
  }
  checkMode = { target: target, picks: new Set(), done: false };
  selectedId = null;
  btn.textContent = 'Done';
  restyle();
  document.getElementById('info').innerHTML =
    '<h3>Check me</h3><p>Click <b>every prerequisite</b> of <b>' + label(target) +
    '</b> (the gold dot): the concepts it depends on directly. Click a pick again to remove it. ' +
    'Press <b>Done</b> when you have them all.</p><p class="note">Remember: prerequisites sit to the left, ' +
    'and the arrowheads point at them.</p><div id="picks"></div>';
  updatePicks();
}

function updatePicks() {
  const el = document.getElementById('picks');
  if (!el) return;
  el.innerHTML = '<div class="list-title">Your picks (' + checkMode.picks.size + ')</div>' +
    (checkMode.picks.size ? '<ul>' + [...checkMode.picks].map(i => '<li>' + label(i) + '</li>').join('') + '</ul>' : '');
}

function finishCheck() {
  const truth = new Set(prerequisitesOf(checkMode.target));
  const picks = checkMode.picks;
  const hits = [...picks].filter(i => truth.has(i));
  const wrong = [...picks].filter(i => !truth.has(i));
  const missed = [...truth].filter(i => !picks.has(i));
  const perfect = wrong.length === 0 && missed.length === 0;
  score.attempts++;
  if (perfect) score.correct++;
  checkMode.done = true;
  document.getElementById('check-btn').textContent = 'Check me';
  document.getElementById('score-val').textContent = score.correct + ' of ' + score.attempts;
  restyle();
  let html = '<h3>' + label(checkMode.target) + '</h3>' +
    (perfect ? '<p class="good">Correct: you found every prerequisite.</p>' :
      '<p class="bad">You found ' + hits.length + ' of ' + truth.size + ' prerequisites' +
      (wrong.length ? ' and picked ' + wrong.length + (wrong.length === 1 ? ' concept that is' : ' concepts that are') +
        ' not prerequisites.' : '.') + '</p>') +
    '<div class="list-title pre">Prerequisites (green)</div>' + listHtml([...truth]);
  if (wrong.length) html += '<div class="list-title" style="color:firebrick">Not prerequisites (pink)</div>' + listHtml(wrong) +
    '<p class="note">A dependent builds on the concept; a prerequisite comes before it.</p>';
  html += '<p class="hint">Press <b>Check me</b> for another concept, or click any concept to explore.</p>';
  document.getElementById('info').innerHTML = html;
}

// ===========================================
// EVENTS
// ===========================================
function onClick(params) {
  const id = params.nodes.length ? params.nodes[0] : null;
  if (checkMode && !checkMode.done) {
    if (id !== null && id !== checkMode.target) {
      if (checkMode.picks.has(id)) checkMode.picks.delete(id); else checkMode.picks.add(id);
      restyle();
      updatePicks();
    }
    return;
  }
  checkMode = null;
  selectedId = id;
  restyle();
  showInfo(id);
}

document.addEventListener('DOMContentLoaded', async function () {
  graph = await loadGraph();
  initNetwork();
  // Start with Learning Objective selected so the highlight is visible without a click
  selectedId = graph.nodes.has(41) ? 41 : null;
  restyle();
  showInfo(selectedId);
  document.getElementById('transitive').addEventListener('change', () => {
    restyle();
    if (selectedId !== null && !checkMode) showInfo(selectedId);
  });
  document.getElementById('check-btn').addEventListener('click', startCheck);
});
