// Objective Rewriter Workbench
// CANVAS_HEIGHT: 595
// Repair a weak learning objective with the actor / action / concept /
// condition-and-standard checklist until every part is present and the verb is observable.

// ----- Standard MicroSim layout -----
let canvasWidth = 400;
let drawHeight = 440;
let controlHeight = 155;     // 4 rows of controls
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

// ----- Verbs: 20 observable ones from the book's canonical list plus 4 unobservable ones -----
const VERBS = [
  ['list', 'Remember'], ['define', 'Remember'], ['identify', 'Remember'],
  ['explain', 'Understand'], ['summarize', 'Understand'], ['classify', 'Understand'], ['compare', 'Understand'],
  ['use', 'Apply'], ['calculate', 'Apply'], ['demonstrate', 'Apply'], ['predict', 'Apply'],
  ['differentiate', 'Analyze'], ['examine', 'Analyze'], ['organize', 'Analyze'],
  ['judge', 'Evaluate'], ['critique', 'Evaluate'], ['justify', 'Evaluate'],
  ['design', 'Create'], ['construct', 'Create'], ['produce', 'Create'],
  ['understand', null], ['know', null], ['appreciate', null], ['be aware of', null]
];
const UNOBSERVABLE = ['understand', 'know', 'appreciate', 'be aware of', 'learn about',
  'be familiar with', 'know how to use'];

const CONDITIONS = ['After using the MicroSim,', 'Given a new example,',
  'Given a worked example to compare with,', 'Without looking at notes,'];
const STANDARDS = ['correctly on three of four trials', 'with a one-sentence reason for each answer',
  'with no errors', 'within five minutes'];

// ----- Eight weak objectives, each with a stored model repair -----
const OBJECTIVES = [
  { weak: 'Students will understand bouncing balls.', actor: 'Students', verb: 'understand',
    concept: 'bouncing balls', ok: ['explain', 'predict', 'compare', 'calculate'],
    model: { condition: 'After using the simulation,', verb: 'explain',
      concept: 'how gravity and bounciness change the next bounce in a Physics Simulation',
      standard: 'in one sentence for each of two sliders' } },
  { weak: 'Learners will know the parts of a MicroSim.', actor: 'Learners', verb: 'know',
    concept: 'the parts of a MicroSim', ok: ['identify', 'list', 'define', 'explain'],
    model: { condition: 'Given an unfamiliar MicroSim Directory,', verb: 'identify',
      concept: 'the job of each file in the MicroSim Directory', standard: 'naming all five files correctly' } },
  { weak: 'Students will be aware of xAPI.', actor: 'Students', verb: 'be aware of',
    concept: 'xAPI', ok: ['identify', 'explain', 'classify', 'list'],
    model: { condition: 'Given three sample statements,', verb: 'identify',
      concept: 'the actor, verb and object of each xAPI Statement', standard: 'with no errors' } },
  { weak: 'Participants will appreciate cognitive load.', actor: 'Participants', verb: 'appreciate',
    concept: 'cognitive load', ok: ['classify', 'differentiate', 'examine', 'explain'],
    model: { condition: 'Given a MicroSim with six design features,', verb: 'classify',
      concept: 'each feature as intrinsic, extraneous or germane load using Cognitive Load Theory',
      standard: 'correctly for five of the six features' } },
  { weak: 'Teachers will learn about Bloom\'s Taxonomy.', actor: 'Teachers', verb: 'learn about',
    concept: 'Bloom\'s Taxonomy', ok: ['classify', 'identify', 'differentiate', 'justify'],
    model: { condition: 'Given six course outcomes,', verb: 'classify',
      concept: 'each outcome by Bloom level with the Objective Classification procedure',
      standard: 'with a written reason for each placement' } },
  { weak: 'Students will understand iframe heights.', actor: 'Students', verb: 'understand',
    concept: 'iframe heights', ok: ['calculate', 'use', 'predict', 'explain'],
    model: { condition: 'Given drawHeight, controlHeight and graphHeight,', verb: 'calculate',
      concept: 'the Iframe Height of a MicroSim', standard: 'correctly for three of three designs' } },
  { weak: 'Designers will be familiar with interaction patterns.', actor: 'Designers', verb: 'be familiar with',
    concept: 'interaction patterns', ok: ['justify', 'differentiate', 'judge', 'design'],
    model: { condition: 'Given a learning objective and its Bloom level,', verb: 'justify',
      concept: 'the choice of an Interaction Pattern',
      standard: 'naming one pattern that fits and one that does not' } },
  { weak: 'Students will know how to use the quality tools.', actor: 'Students', verb: 'know how to use',
    concept: 'the quality tools', ok: ['use', 'demonstrate', 'judge', 'critique'],
    model: { condition: 'Given a new MicroSim directory,', verb: 'use',
      concept: 'the Validation Script to raise its Quality Score', standard: 'to at least 85 points' } }
];

// Concept labels of the book's learning graph (docs/learning-graph/learning-graph.json)
const CONCEPT_LABELS = [
  "MicroSim", "Intelligent Textbook", "Interactive Simulation", "Learning Object", "MicroSims 1.0",
  "MicroSims 2.0", "Instrumented MicroSim", "Showcase MicroSim", "Generative AI",
  "Large Language Model", "AI Skill", "AI Agent", "Prompt", "MkDocs", "GitHub Pages",
  "Git Version Control", "HTML5", "CSS", "JavaScript", "JavaScript Library", "CDN",
  "iframe Embedding", "Open Educational Resource", "Creative Commons License",
  "MicroSim Directory", "main.html", "MicroSim JavaScript File", "index.md Documentation Page",
  "metadata.json", "Draw Region", "Control Region", "Canvas Height Constant", "Page Front Matter",
  "Preview Image", "Pinned Library Version", "MicroSim Template", "Course Description", "Concept",
  "Learning Graph", "Concept Dependency", "Learning Objective", "Measurable Objective",
  "Learning Outcome", "Bloom's Taxonomy", "Remember Level", "Understand Level", "Apply Level",
  "Analyze Level", "Evaluate Level", "Create Level", "Bloom Verb", "Objective Classification",
  "Cognitive Load Theory", "Intrinsic Load", "Extraneous Load", "Germane Load",
  "Instructional Design Checkpoint", "Predict-First Design", "Purpose of Animation",
  "Interaction Pattern", "Scaffolding", "Formative Assessment", "MicroSim Type Catalog",
  "Type Routing", "Routing Rubric", "Keyword Routing", "Routing Score", "Routing Ambiguity",
  "Objective-to-Type Mapping", "Interactive-by-Default Policy", "Static Image Exception",
  "Reuse Versus Build Decision", "p5.js Type", "Chart.js Type", "Plotly Type", "Mermaid Type",
  "vis-network Type", "vis-timeline Type", "Leaflet Map Type", "Venn Diagram Type",
  "Causal Loop Diagram Type", "Comparison Table Type", "Image Overlay Type",
  "Grid Overlay Poster Type", "Verified Poster Type", "Docker Python Lab Type",
  "Concept Classifier Type", "Celebration Effect Type", "Flash Card MicroSim",
  "Model Editor MicroSim", "Runnable Code Block", "Lab Sandbox", "Sorting Quiz", "Category Bucket",
  "Reward Feedback", "Builder MicroSim", "MicroSim Generator Skill", "Skill Reference Guide",
  "Skill Template Asset", "Specification Block", "Diagram Specification", "Drawing Specification",
  "Prompt Design", "System Prompt", "Rules File", "Iterative Refinement", "Claude Code",
  "Debugging AI Code", "Code Review of AI Output", "Skill Invocation", "Agent Workflow",
  "Human in the Loop", "Generation Log", "Hallucinated API", "Library Version Drift",
  "p5.js 2.x Migration", "Reproducible Generation", "Generation Failure Mode", "Token Cost",
  "p5.js Web Editor", "p5.js Sketch", "setup() Function", "draw() Function", "Global Variables",
  "Canvas Creation", "Coordinate System", "Shape Drawing", "Color Model", "Animation Loop",
  "Frame Rate", "Vectors", "Physics Simulation", "Collision Detection", "Particle System",
  "Slider Control", "Button Control", "Mouse Events", "Keyboard Events", "Text Rendering",
  "Async Setup", "Flowing Current Animation", "Pause-When-Idle Animation", "Chart.js Library",
  "Chart Configuration", "Chart Dataset", "Bar Chart", "Line Chart", "Pie Chart", "Scatter Plot",
  "Bubble Chart", "Priority Matrix", "Chart Tooltip", "Plotly Library", "Function Plot",
  "Slider-Driven Plot", "Data Table", "Comparison Table", "Star Rating Table",
  "Clickable Table Detail Panel", "Chart Color Palette", "Data Source Citation", "Infographic",
  "Mermaid Library", "Flowchart", "Sequence Diagram", "Mermaid Syntax Rules", "Mermaid Hover Text",
  "vis-network Library", "Node and Edge Data", "Network Layout", "Concept Map", "Graph Viewer",
  "Node Selection Event", "Venn Diagram", "Causal Loop Diagram", "Reinforcing Loop",
  "Balancing Loop", "Feedback Loop", "System Dynamics", "Polarity Link", "Diagram Readability",
  "vis-timeline Library", "Timeline Event Item", "Timeline Grouping", "Timeline Date Handling",
  "Leaflet Library", "Map Marker", "Map Popup", "Map Tile Source", "Choropleth Map",
  "Scroll Zoom Hijacking", "Geographic Data Source", "Image Overlay", "Callout Label",
  "Hover Zone", "Point-Marker Overlay", "Overlay Data File", "Overlay Image Prompt",
  "Text-Free Image Rule", "Overlay Height Pinning", "Grid Overlay", "Comparison Poster",
  "Poster Column Zone", "Percentage Rectangle Zone", "Explore Mode", "Quiz Mode",
  "Zone Summary and Facts", "Edit Mode Alignment", "Verbatim Text Prompt",
  "Image Model Generation", "Poster Folder Convention", "Shared Overlay Library",
  "Fact-Verified Poster", "Claim Plan", "Source Discovery", "Claim Verification",
  "Verification Report", "Render Audit", "Poster Quiz Question", "Poster Instrumentation",
  "Width Responsiveness", "Container Width Detection", "windowResized Handler", "Iframe Height",
  "CANVAS_HEIGHT Comment", "Height Resolution Order", "Iframe Auto-Height Protocol",
  "postMessage Resize", "Height Sync Tool", "Relative Iframe Path", "Mobile Layout",
  "Control Wrapping", "Text Overflow", "Fullscreen Mode", "Quality Score", "100-Point Rubric",
  "Quality Grade", "Validation Script", "Playwright", "Headless Browser", "Screenshot Capture",
  "Layout Review", "Vision-Based Review", "Visual Checklist", "Layout Defect", "Clipped Content",
  "Hidden Control", "Control Visibility Test", "Iframe Height Test", "Fix Cycle Limit",
  "Smallest Patch Rule", "Cross-Browser Check", "Accessibility Check", "Color Contrast",
  "Quality Gate", "Standards Hardening", "Batch Generation", "Spec Extraction",
  "Specification JSON", "Scaffold Generation", "Status Lifecycle", "Sim Status File",
  "Resumable Pipeline", "Parallel Workers", "Coordinator Pattern", "Chapter Diagram Coverage",
  "Navigation Update", "Iframe Insertion", "Nav Status Icon", "Generation Cost",
  "Dublin Core Metadata", "Educational Metadata", "Technical Metadata", "Search Metadata",
  "Metadata Schema", "Faceted Search", "Search Index", "Cross-Book Index", "Reuse Before Build",
  "Similarity Search", "Adapt Existing MicroSim", "Provenance Record", "Concept Link Metadata",
  "Version Metadata", "Licensing Metadata", "MicroSim Submission Guidelines", "xAPI",
  "xAPI Statement", "Actor", "Verb", "Object", "Result", "Context", "Activity IRI",
  "Answered Verb", "Experienced Verb", "Interacted Verb", "Producer Contract",
  "Canonical Site URL", "Sub-Activity Fragment", "Concept ID Extension", "Result Extensions",
  "Evidence Class", "Continuous Parameter Evidence", "Discrete Inspection Evidence",
  "Run and Pause Evidence", "Page Dwell Evidence", "Assessment Evidence", "Focus Loss Handling",
  "Non-Evidence Threshold", "Hover Threshold", "Misclick Threshold", "LRS Runtime Script",
  "LRS Config File", "Library Adapter", "Slider Handle", "Item Handle", "Button Handle",
  "Question Handle", "Guarded Call", "Concept Mapping", "Teaching Mode", "Policy Precedence",
  "Instrumented Status", "Statement Log Viewer", "xAPI Quality Check", "Learning Record Store",
  "LRS Architecture", "System Context", "Multi-Tenancy", "District Tenant", "Roster and Identity",
  "Pseudonymous Learner ID", "Per-District Salt", "Property Graph Data Model", "Summary Vertex",
  "Ingestion Gateway", "Statement Validation", "All-or-Nothing Batch", "Event Stream",
  "Stream Processor", "Redpanda", "ClickHouse", "Neo4j Graph Database", "Twelve Core Functions",
  "Idempotent Ingest", "Partition by Learner", "Teacher Dashboard", "Author Dashboard",
  "Admin Interface", "Class Mastery Heatmap", "At-Risk Roster", "Content Insights",
  "A/B Experiment", "Capacity Model", "Cost Model", "Container Deployment", "Failure Modes",
  "Compliance Reporting", "Suppression Threshold", "LRS-Lite", "Serverless LRS",
  "Statement Volume Estimate", "Statement Size Measurement", "Session Summary Statement",
  "Compact Mode", "Full Mode", "Loss of Focus Event", "Answers Never Folded",
  "Producer-Side Summarization", "Browser Database", "IndexedDB Storage", "10 MB Budget",
  "Storage Meter", "Quota and Eviction", "Persistent Storage Request", "Event Identity",
  "Device Sequence Number", "Hybrid Logical Clock", "Local Summary Vertex", "Evidence List",
  "Object Storage Sync", "Sync Cycle", "Convergent Sync", "Multi-Device Backup",
  "Browser-Side Dashboard", "Full Versus Lite Decision", "Lite to Full Migration",
  "Concept Mastery", "Mastery Prediction", "Predictive Fidelity", "Evidence Stream",
  "Signal Versus Noise", "Diagnostic Value", "Guessing", "Slipping", "Bayesian Knowledge Tracing",
  "BKT Initial Knowledge", "BKT Learning Rate", "BKT Guess Parameter", "BKT Slip Parameter",
  "Mastery Threshold", "Attempt Order", "Soft Correctness Mapping", "Item Response Theory",
  "Deep Knowledge Tracing", "Per-Concept Mastery", "Prerequisite Propagation",
  "Held-Out Assessment", "Prediction Accuracy", "Correlation With Assessment", "Calibration",
  "Discrimination", "AUC", "Brier Score", "Stability Across Sessions", "Sample Size Requirement",
  "Confounding Factors", "Compact Versus Full Fidelity", "Information Loss",
  "Fidelity-Driven Instrumentation", "Interaction Diagnosticity", "Transfer Item",
  "Evaluation Protocol", "Threats to Validity", "Measured Versus Designed Claims",
  "Reporting Prediction Quality", "Concept Coverage Gap", "Universal Design for Learning",
  "PRIMM Method", "Semantic Waves", "Active Learning", "Simulation Effectiveness Studies",
  "Engagement Versus Learning", "Accessibility Standards", "Keyboard Operability",
  "Low-Bandwidth Design", "Equity Considerations", "Student Privacy", "PII Surface",
  "Aggregate-Only Data Policy", "Data Minimization", "Ethical Use of Predictions",
  "Bias in Prediction", "Usability Testing", "Peer Review", "Capstone Portfolio",
  "Portfolio Fidelity Report", "Near-Term Roadmap", "Verified Adapters", "End-to-End POST Path",
  "Closed-Loop Generation", "Automated Layout Repair", "Shared Sim Libraries", "Long-Term Vision",
  "Diagnostic Interaction Design", "Adaptive Difficulty", "Guess-Resistant Probes",
  "Fun and Engagement", "Learning From Aggregate Data", "Trustworthy Prediction",
  "Open Research Problems"
];

// Slot explanations shown on hover
const SLOT_HELP = {
  actor: 'Actor: who performs the action, named from the learner\'s point of view.',
  action: 'Action: an observable verb, something a reviewer, a quiz or a program could see the learner do.',
  concept: 'Concept: the subject matter, named precisely enough to attach to a node in the learning graph.',
  condstd: 'Condition and standard: the circumstances of the performance and the level that counts as success.'
};
const SLOT_COLORS = {
  actor: { fill: 'lavender', stroke: 'slateblue' },
  action: { fill: 'lightyellow', stroke: 'darkgoldenrod' },
  concept: { fill: 'honeydew', stroke: 'seagreen' },
  condstd: { fill: 'aliceblue', stroke: 'steelblue' }
};

// ----- State -----
let objIndex = 0;
let verb = '';            // current action verb
let condition = '';
let standard = '';
let checked = false;
let checkResult = null;
let flashUntil = 0;       // time until which the action slot flashes
let message = '';         // message under the slots
let slotRects = [];       // for hover hit testing
let openList = '';        // '' | 'condition' | 'standard'

// ----- Controls -----
let nextButton, verbSelect, conceptInput, condButton, stdButton, checkButton, pickSelect;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  nextButton = createButton('Next weak objective');
  nextButton.position(10, drawHeight + 8);
  nextButton.mousePressed(nextObjective);

  verbSelect = createSelect();
  verbSelect.option('Choose an action verb...', '');
  for (const [v, level] of VERBS) {
    verbSelect.option(v + (level ? ' (' + level + ')' : ' (not observable)'), v);
  }
  verbSelect.position(170, drawHeight + 8);
  verbSelect.changed(verbChosen);

  conceptInput = createInput('');
  conceptInput.position(90, drawHeight + 44);
  conceptInput.input(conceptTyped);
  conceptInput.attribute('list', 'concept-labels');
  conceptInput.attribute('aria-label', 'Concept');
  const dl = createElement('datalist');
  dl.id('concept-labels');
  for (const label of CONCEPT_LABELS) {
    const opt = createElement('option');
    opt.attribute('value', label);
    opt.parent(dl);
  }

  condButton = createButton('Add condition');
  condButton.position(10, drawHeight + 80);
  condButton.mousePressed(() => openPickList('condition'));

  stdButton = createButton('Add standard');
  stdButton.position(120, drawHeight + 80);
  stdButton.mousePressed(() => openPickList('standard'));

  checkButton = createButton('Check');
  checkButton.position(228, drawHeight + 80);
  checkButton.mousePressed(checkRepair);

  pickSelect = createSelect();
  pickSelect.position(110, drawHeight + 116);
  pickSelect.changed(pickChosen);
  pickSelect.hide();

  loadObjective(0);
  positionControls();

  describe('Objective rewriter workbench. A weak learning objective is split into four colored ' +
    'slots: actor, action, concept, and condition and standard. Empty slots have dashed red ' +
    'outlines. The learner picks an observable verb, types a concept that matches a learning-graph ' +
    'concept label, adds a condition and a standard, and presses Check to compare the repair with a ' +
    'stored model repair.', LABEL);
}

function loadObjective(i) {
  objIndex = i;
  const o = OBJECTIVES[objIndex];
  verb = o.verb;
  condition = '';
  standard = '';
  checked = false;
  checkResult = null;
  message = '';
  verbSelect.selected('');
  conceptInput.value(o.concept);
  openList = '';
  pickSelect.hide();
  conceptTyped();
}

function draw() {
  updateCanvasSize();

  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const o = OBJECTIVES[objIndex];
  const narrow = canvasWidth < 500;

  // Title and progress
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(narrow ? 18 : 20);
  text('Objective Rewriter Workbench', margin, 10);
  textSize(14);
  fill('dimgray');
  textAlign(RIGHT, TOP);
  text('Objective ' + (objIndex + 1) + ' of ' + OBJECTIVES.length, canvasWidth - margin, narrow ? 36 : 14);

  // The weak objective
  textAlign(LEFT, TOP);
  textSize(15);
  textStyle(ITALIC);
  fill('dimgray');
  const weakY = narrow ? 54 : 42;
  text('Weak objective: "' + o.weak + '"', margin, weakY, canvasWidth - 2 * margin);
  textStyle(NORMAL);

  // Four slots
  const slotsTop = narrow ? 94 : 76;
  const slotsBottom = drawSlots(slotsTop, narrow);

  // Message line: the unobservable-verb warning, or (wide only) the concept match status
  let y = slotsBottom + 8;
  textSize(14);
  textAlign(LEFT, TOP);
  if (message) {
    fill('firebrick');
    textStyle(BOLD);
    const lines = wrapLines(message, canvasWidth - 2 * margin);
    text(lines.join('\n'), margin, y);
    textStyle(NORMAL);
    y += lines.length * 17 + 6;
  } else if (!narrow) {
    fill('dimgray');
    text(conceptStatusText(), margin, y, canvasWidth - 2 * margin);
    y += 24;
  }

  drawComparison(y, narrow);
  drawControlLabels();
  drawTooltip();
}

// Draw the four slots and return the y of their bottom edge
function drawSlots(top, narrow) {
  const o = OBJECTIVES[objIndex];
  const matched = matchConcept(conceptInput.value());
  const slots = [
    { key: 'actor', title: 'Actor', text: o.actor, empty: !o.actor, bad: false },
    { key: 'action', title: 'Action', text: verb, empty: !verb, bad: isUnobservable(verb),
      note: isUnobservable(verb) ? 'not observable' : '' },
    { key: 'concept', title: 'Concept', text: conceptInput.value().trim(), empty: !conceptInput.value().trim(),
      bad: false, amber: !matched, note: matched ? 'in the learning graph' : 'no graph match' },
    { key: 'condstd', title: narrow ? 'Condition + standard' : 'Condition and standard',
      text: [condition, standard].filter(s => s).join(' ... '),
      empty: !condition && !standard, bad: false,
      note: condition && !standard ? 'standard missing' : (!condition && standard ? 'condition missing' : '') }
  ];
  const cols = narrow ? 2 : 4;
  const gap = 8;
  const w = (canvasWidth - 2 * margin - (cols - 1) * gap) / cols;
  const h = narrow ? 74 : 112;
  slotRects = [];
  const flashing = millis() < flashUntil && floor(millis() / 150) % 2 === 0;
  for (let i = 0; i < slots.length; i++) {
    const s = slots[i];
    const x = margin + (i % cols) * (w + gap);
    const y = top + floor(i / cols) * (h + gap);
    const c = SLOT_COLORS[s.key];
    if (s.empty) {
      drawingContext.save();
      drawingContext.setLineDash([6, 4]);
      stroke('red');
      strokeWeight(2);
      fill(255, 255, 255, 180);
      rect(x, y, w, h, 8);
      drawingContext.restore();
    } else {
      stroke(s.key === 'action' && flashing ? 'red' : c.stroke);
      strokeWeight(s.key === 'action' && flashing ? 4 : 2);
      let f = c.fill;
      if (s.key === 'action' && s.bad) f = 'mistyrose';
      if (s.key === 'concept') f = s.amber ? 'lemonchiffon' : 'honeydew';
      fill(f);
      rect(x, y, w, h, 8);
    }
    noStroke();
    textAlign(LEFT, TOP);
    textSize(13);
    textStyle(BOLD);
    fill(s.empty || s.bad ? 'red' : c.stroke);
    text(s.title + (s.empty ? ' (missing)' : ''), x + 8, y + 6, w - 12);
    textStyle(NORMAL);
    fill('black');
    textSize(narrow ? 13 : 15);
    if (!s.empty) text(s.text, x + 8, y + (narrow ? 22 : 26), w - 14, h - (narrow ? 38 : 44));
    if (s.note) {
      textSize(12);
      fill(s.bad || s.note.includes('missing') ? 'red' : (s.amber ? 'darkorange' : 'seagreen'));
      textAlign(LEFT, BOTTOM);
      text(s.note, x + 8, y + h - 4);
    }
    slotRects.push({ key: s.key, x, y, w, h });
  }
  const rows = ceil(slots.length / cols);
  return top + rows * h + (rows - 1) * gap;
}

// The learner's sentence and, after Check, the stored model repair beside (or below) it
function drawComparison(top, narrow) {
  const o = OBJECTIVES[objIndex];
  const mine = assemble(o.actor, verb, conceptInput.value().trim(), condition, standard);
  const model = assemble(o.actor, o.model.verb, o.model.concept, o.model.condition, o.model.standard);
  const fb = checked ? checkResult.feedback.join(' ') : '';
  if (!narrow) {
    const colW = (canvasWidth - 2 * margin - 16) / 2;
    const h = drawHeight - top - 10;
    panel(margin, top, colW, h, 'Your repair', mine, 'black', fb);
    panel(margin + colW + 16, top, colW, h, 'Model repair', checked ? model :
      'Press Check to score your repair and see the stored model repair here.', checked ? 'darkgreen' : 'dimgray', '');
  } else {
    const w = canvasWidth - 2 * margin;
    const h1 = panelHeight(mine, fb, w);
    panel(margin, top, w, h1, 'Your repair', mine, 'black', fb);
    if (checked) panel(margin, top + h1 + 6, w, panelHeight(model, '', w), 'Model repair', model, 'darkgreen', '');
  }
}

function panelHeight(body, fb, w) {
  textSize(14);
  let h = 26 + wrapLines(body, w - 20).length * 17;
  textSize(13);
  if (fb) h += wrapLines(fb, w - 20).length * 16 + 4;
  return h + 6;
}

function panel(x, y, w, h, title, body, col, fb) {
  const narrow = canvasWidth < 500;
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  let head = title;
  if (title === 'Your repair' && checked) head += ': ' + checkResult.score + ' of 5 parts';
  fill(title === 'Model repair' ? 'darkgreen' : (checked && checkResult.score === 5 ? 'darkgreen' : 'black'));
  text(head, x + 10, y + 7);
  textStyle(NORMAL);
  textSize(narrow ? 14 : 15);
  fill(col);
  const lines = wrapLines(body, w - 20);
  const lh = narrow ? 17 : 19;
  text(lines.join('\n'), x + 10, y + 26);
  if (fb) {
    textSize(13);
    fill('firebrick');
    text(wrapLines(fb, w - 20).join('\n'), x + 10, y + 30 + lines.length * lh);
  }
}

// Word-wrap with the current text size
function wrapLines(s, w) {
  const words = s.split(' ');
  const out = [];
  let cur = '';
  for (const word of words) {
    const t = cur ? cur + ' ' + word : word;
    if (fontWidth(t) > w && cur) { out.push(cur); cur = word; } else cur = t;
  }
  if (cur) out.push(cur);
  return out;
}

// Build a sentence from the parts
function assemble(actor, v, concept, cond, std) {
  let s = '';
  if (cond) s = cond + ' ' + actor.toLowerCase();
  else s = actor;
  s += ' will ' + (v || '___') + ' ' + (concept || '___');
  if (std) s += ', ' + std;
  return s + '.';
}

function conceptStatusText() {
  const m = matchConcept(conceptInput.value());
  return m ? 'Concept matches the learning-graph concept "' + m + '".' :
    'Concept does not match a learning-graph concept label yet (type to see suggestions).';
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Concept:', 10, drawHeight + 56);
  if (openList) text(openList === 'condition' ? 'Condition:' : 'Standard:', 10, drawHeight + 128);
}

function drawTooltip() {
  for (const r of slotRects) {
    if (mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h) {
      const tip = SLOT_HELP[r.key];
      textSize(13);
      const tw = min(260, canvasWidth - 2 * margin);
      const lines = ceil(fontWidth(tip) / (tw - 16)) + 1;
      const th = lines * 16 + 10;
      let tx = constrain(mouseX + 12, margin, canvasWidth - tw - margin);
      let ty = mouseY + 16;
      if (ty + th > drawHeight - 4) ty = mouseY - th - 8;
      stroke('gray');
      strokeWeight(1);
      fill(255, 255, 240, 245);
      rect(tx, ty, tw, th, 6);
      noStroke();
      fill('black');
      textAlign(LEFT, TOP);
      text(tip, tx + 8, ty + 6, tw - 16, th - 8);
      return;
    }
  }
}

// ----- Helpers -----
function isUnobservable(v) { return UNOBSERVABLE.includes(v); }

// A concept matches when the field equals a graph label, or contains a label of two or more words
function matchConcept(raw) {
  const t = raw.trim().toLowerCase().replace(/^(the|a|an)\s+/, '');
  if (!t) return null;
  let best = null;
  for (const label of CONCEPT_LABELS) {
    const l = label.toLowerCase();
    if (t === l) return label;
    if (l.includes(' ') && (' ' + t + ' ').includes(' ' + l + ' ')) {
      if (!best || label.length > best.length) best = label;
    } else if (l.includes(' ') && t.includes(l)) {
      if (!best || label.length > best.length) best = label;
    }
  }
  return best;
}

// ----- Event handlers -----
function nextObjective() {
  loadObjective((objIndex + 1) % OBJECTIVES.length);
}

function verbChosen() {
  const v = verbSelect.value();
  if (!v) return;
  verb = v;
  checked = false;
  if (isUnobservable(v)) {
    flashUntil = millis() + 1500;
    message = 'No observation separates a learner who does this from one who does not.';
  } else {
    message = '';
  }
}

function conceptTyped() {
  const m = matchConcept(conceptInput.value());
  conceptInput.style('background-color', m ? 'honeydew' : 'lemonchiffon');
  conceptInput.style('border', '2px solid ' + (m ? 'seagreen' : 'darkorange'));
  checked = false;
}

function openPickList(which) {
  openList = which;
  pickSelect.html('');
  pickSelect.option(which === 'condition' ? 'Pick a condition...' : 'Pick a standard...', '');
  const list = which === 'condition' ? CONDITIONS : STANDARDS;
  for (const s of list) pickSelect.option(s);
  pickSelect.selected(which === 'condition' ? condition : standard);
  pickSelect.show();
}

function pickChosen() {
  const v = pickSelect.value();
  if (openList === 'condition') condition = v;
  else if (openList === 'standard') standard = v;
  checked = false;
}

function checkRepair() {
  const o = OBJECTIVES[objIndex];
  const fb = [];
  let score = 1; // actor is present in every objective
  const observable = verb && !isUnobservable(verb);
  if (observable) {
    score++;
    if (!o.ok.includes(verb)) fb.push('"' + verb + '" is observable, but the model aims at "' + o.model.verb + '".');
  } else fb.push('Action: choose an observable verb.');
  if (matchConcept(conceptInput.value())) score++;
  else fb.push('Concept: name a learning-graph concept.');
  if (condition) score++; else fb.push('Add a condition.');
  if (standard) score++; else fb.push('Add a standard.');
  checkResult = { score, feedback: fb };
  checked = true;
  message = '';
}

function mousePressed() {
  // clicking the canvas clears a finished flash message
  if (mouseY < drawHeight && millis() > flashUntil) message = '';
}

// ----- Layout -----
function positionControls() {
  const narrow = canvasWidth < 500;
  verbSelect.position(narrow ? 165 : 175, drawHeight + 8);
  verbSelect.size(narrow ? canvasWidth - 175 : min(260, canvasWidth - 190));
  conceptInput.size(canvasWidth - 90 - margin - 6);
  pickSelect.size(canvasWidth - 110 - margin);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.floor(container.getBoundingClientRect().width);
  }
}
