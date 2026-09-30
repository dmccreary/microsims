// Bloom-to-Pattern Matrix - custom HTML table, no external library
// CANVAS_HEIGHT: 640
// Six Bloom levels x (appropriate patterns, inappropriate patterns, example MicroSims).
// Click a chip for an explanation, a small sketch and the reason it suits or fails the level.
// "Mismatch detective" hides the colors and asks which row and chip a MicroSim violates.

// ===========================================
// DATA (a JSON array; one object per Bloom level)
// ===========================================
const MATRIX = [
  { level: 'Remember', color: 'lightcoral',
    verbs: 'list, define, recall, identify, name, recognize, locate, describe',
    good: [
      { name: 'Flashcards', sketch: 'flashcard', text: 'A prompt on one side and the answer on the other; the learner recalls, then flips to check.',
        reason: 'Remember objectives demand exact retrieval, and a flashcard gives an immediate right-or-wrong check on exactly that.' },
      { name: 'Matching', sketch: 'matching', text: 'The learner connects each term with its definition or partner.',
        reason: 'Matching tests whether the learner can retrieve which item goes with which, with feedback on every pair.' },
      { name: 'Labeling', sketch: 'labeling', text: 'The learner places names on the parts of a diagram.',
        reason: 'Labeling checks recall of names in place, which is the performance a Remember objective asks for.' }],
    bad: [
      { name: 'Complex simulation', sketch: 'complex', text: 'A rich simulation with many controls and moving parts.',
        reason: 'The learner spends attention operating the model instead of retrieving facts, and its events say little about recall.' }],
    examples: [
      { name: 'MicroSim Type Catalog Explorer', short: 'Type Catalog Explorer', id: 'microsim-type-catalog-explorer', text: 'Identify the library, data and a suitable objective for each MicroSim type.' },
      { name: 'MicroSims Milestones Timeline', short: 'Milestones Timeline', id: 'microsims-milestones-timeline', text: 'Identify the milestones between MicroSims 1.0 and 2.0 and order them in time.' }] },
  { level: 'Understand', color: 'sandybrown',
    verbs: 'explain, summarize, interpret, classify, compare, contrast, exemplify, infer',
    good: [
      { name: 'Step-through worked example', sketch: 'stepper', text: 'The process advances one step at a time with Next and Previous buttons, and each step shows its intermediate values.',
        reason: 'The learner can predict the next step and then check it, which builds the explanation the objective asks for.' },
      { name: 'Concrete data visibility', sketch: 'data', text: 'The actual numbers, arrays or strings are shown at each stage instead of abstract motion.',
        reason: 'Seeing the real data lets the learner explain what changes and why, in their own words.' }],
    bad: [
      { name: 'Continuous animation', sketch: 'animation', text: 'The model plays on its own, frame after frame, while the learner watches.',
        reason: 'The learner can watch without predicting or explaining, and changes happen too fast to connect cause and effect.' },
      { name: 'Particle effects', sketch: 'particles', text: 'Decorative sparkles, trails or confetti.',
        reason: 'They add extraneous load and pull the eye away from the relationship the learner must explain.' }],
    examples: [
      { name: 'Batch Generation Workflow Stepper', short: 'Batch Workflow Stepper', id: 'batch-generation-workflow-stepper', text: 'Explain what each step of the batch workflow does, one step at a time.' },
      { name: 'Bloom Level Ladder', short: 'Bloom Level Ladder', id: 'bloom-level-ladder', text: 'Summarize what each Bloom level asks of a learner.' }] },
  { level: 'Apply', color: 'khaki',
    verbs: 'use, execute, implement, solve, demonstrate, calculate, apply, practice',
    good: [
      { name: 'Parameter sliders', sketch: 'sliders', text: 'Sliders set the inputs of a model and the result updates immediately.',
        reason: 'The learner uses the procedure on new values and can predict the result before moving the slider.' },
      { name: 'Calculator', sketch: 'calculator', text: 'The learner enters values and the tool computes a result the learner can check.',
        reason: 'Apply objectives ask the learner to use a procedure; a calculator lets them compute first and verify after.' },
      { name: 'Practice problems', sketch: 'practice', text: 'A stream of new problems of the same kind, each with feedback.',
        reason: 'New cases are the point of Apply, and repeated practice with feedback shows whether the procedure transfers.' }],
    bad: [
      { name: 'Passive viewing only', sketch: 'passive', text: 'The learner watches a demonstration or a result but cannot change anything.',
        reason: 'Nothing is applied, so neither the learner nor the event stream can show that the procedure was used.' }],
    examples: [
      { name: 'Canvas Height Calculator', short: 'Canvas Height Calculator', id: 'canvas-height-calculator', text: 'Calculate CANVAS_HEIGHT and the iframe height from region heights.' },
      { name: 'BKT Parameter Lab', short: 'BKT Parameter Lab', id: 'bkt-parameter-lab', text: 'Calculate mastery estimates by choosing the four BKT parameters.' }] },
  { level: 'Analyze', color: 'lightgreen',
    verbs: 'differentiate, organize, attribute, compare, contrast, examine, deconstruct, distinguish',
    good: [
      { name: 'Network explorer', sketch: 'network', text: 'Nodes and edges the learner can click to reveal how concepts connect.',
        reason: 'Analysis is finding how parts relate, and an explorer lets the learner trace the relationships directly.' },
      { name: 'Comparison tool', sketch: 'comparison', text: 'Two or more items side by side on the same dimensions.',
        reason: 'Differentiating needs the parts lined up so the learner can find the differences that matter.' },
      { name: 'Pattern finder', sketch: 'pattern', text: 'A view the learner can filter, sort or highlight until a structure appears.',
        reason: 'The learner discovers the structure instead of being told it, which is what Analyze demands.' }],
    bad: [
      { name: 'Pre-computed results', sketch: 'precomputed', text: 'The tool shows the finished analysis: the conclusion is already on the screen.',
        reason: 'The learner reads the structure instead of finding it, so no analysis happens.' }],
    examples: [
      { name: 'Objectives Neighborhood of the Learning Graph', short: 'Objectives Neighborhood', id: 'objectives-graph-neighborhood', text: 'Differentiate the prerequisites of a concept from its dependents.' },
      { name: 'Cognitive Load Balance Lab', short: 'Cognitive Load Lab', id: 'cognitive-load-balance-lab', text: 'Differentiate features that add intrinsic, extraneous and germane load.' }] },
  { level: 'Evaluate', color: 'lightskyblue',
    verbs: 'judge, critique, assess, justify, prioritize, recommend, validate, defend',
    good: [
      { name: 'Sorting and ranking', sketch: 'sorting', text: 'The learner sorts or orders items and must defend the result.',
        reason: 'Evaluation is judgment against criteria; ranking forces a judgment, and feedback on the reasons tests it.' },
      { name: 'Rubric tool', sketch: 'rubric', text: 'The learner rates an item against named criteria.',
        reason: 'The criteria make the judgment explicit, so it can be compared with an expert rating.' }],
    bad: [
      { name: 'No feedback mechanism', sketch: 'nofeedback', text: 'The learner makes a judgment but never learns whether it, or its reasons, hold up.',
        reason: 'Without feedback on the reasons a judgment is only an opinion, and the learner cannot calibrate it.' }],
    examples: [
      { name: 'MicroSim Directory Audit', short: 'Directory Audit', id: 'microsim-directory-audit', text: 'Critique a directory by flagging defects and rating their severity.' },
      { name: 'Claim Bucket Sorter', short: 'Claim Bucket Sorter', id: 'claim-bucket-sorter', text: 'Classify evidence records and justify each choice.' }] },
  { level: 'Create', color: 'plum',
    verbs: 'design, construct, develop, formulate, compose, produce, invent, generate',
    good: [
      { name: 'Builder', sketch: 'builder', text: 'The learner assembles parts into something new.',
        reason: 'Create objectives ask for a new product; a builder supplies the parts and leaves the combination open.' },
      { name: 'Editor', sketch: 'editor', text: 'The learner writes or changes a model, a specification or code.',
        reason: 'Editing lets the learner produce and revise a design of their own.' },
      { name: 'Canvas tool', sketch: 'canvas', text: 'A free drawing or layout surface.',
        reason: 'An open canvas leaves the learner free to choose the form of the product.' }],
    bad: [
      { name: 'Rigid template', sketch: 'template', text: 'Fixed fields and a single allowed answer.',
        reason: 'A template pours the learner\'s work into a predetermined shape, so nothing original can be created.' }],
    examples: [
      { name: 'Classifier Scenario Builder', short: 'Scenario Builder', id: 'classifier-scenario-builder', text: 'Write a classifier scenario with options, a hint and an explanation.' },
      { name: 'Portfolio Milestone Planner', short: 'Milestone Planner', id: 'portfolio-milestone-planner', text: 'Design a week-by-week schedule for a portfolio.' }] }
];

// Mismatch detective cases: the answer is a row and one of that row's inappropriate chips
const CASES = [
  { text: 'A particle animation that plays continuously to teach learners to explain why a bouncing ball slows down.',
    row: 1, chips: ['Continuous animation', 'Particle effects'] },
  { text: 'A 3D physics sandbox with twelve sliders, built so that learners memorize the names of the six Bloom levels.',
    row: 0, chips: ['Complex simulation'] },
  { text: 'A replay of a function plot that learners watch but cannot change, meant to teach them to calculate slopes.',
    row: 2, chips: ['Passive viewing only'] },
  { text: 'A chart that already announces which MicroSim type is best, for an objective asking learners to differentiate the types.',
    row: 3, chips: ['Pre-computed results'] },
  { text: 'A ranking task in which learners order five MicroSims by quality but never see whether their ranking or reasons hold up.',
    row: 4, chips: ['No feedback mechanism'] },
  { text: 'A form with fixed fields and one accepted answer for an objective asking learners to design an original MicroSim.',
    row: 5, chips: ['Rigid template'] },
  { text: 'Confetti bursts on every click in a MicroSim meant to help learners summarize the steps of a process.',
    row: 1, chips: ['Particle effects'] }
];

// ===========================================
// SKETCHES (small inline SVG drawings of each pattern)
// ===========================================
function svg(inner) {
  return '<svg width="170" height="78" viewBox="0 0 170 78" role="img" aria-hidden="true">' +
    '<rect x="1" y="1" width="168" height="76" rx="8" fill="aliceblue" stroke="silver"/>' + inner + '</svg>';
}
const SKETCHES = {
  flashcard: () => svg('<rect x="40" y="16" width="70" height="44" rx="5" fill="white" stroke="gray"/><rect x="52" y="10" width="70" height="44" rx="5" fill="lightyellow" stroke="darkgoldenrod"/><text x="87" y="37" font-size="14" text-anchor="middle">term?</text><path d="M128 40 q12 -14 0 -26" fill="none" stroke="gray" marker-end="url(#a)"/>'),
  matching: () => svg('<g font-size="11"><rect x="18" y="10" width="44" height="14" fill="white" stroke="gray"/><rect x="18" y="32" width="44" height="14" fill="white" stroke="gray"/><rect x="18" y="54" width="44" height="14" fill="white" stroke="gray"/><rect x="108" y="10" width="44" height="14" fill="white" stroke="gray"/><rect x="108" y="32" width="44" height="14" fill="white" stroke="gray"/><rect x="108" y="54" width="44" height="14" fill="white" stroke="gray"/></g><path d="M62 17 L108 61 M62 39 L108 17 M62 61 L108 39" stroke="seagreen" stroke-width="2"/>'),
  labeling: () => svg('<circle cx="60" cy="40" r="24" fill="lightgreen" stroke="seagreen"/><circle cx="60" cy="40" r="8" fill="seagreen"/><path d="M68 40 L120 22 M78 52 L120 58" stroke="black"/><rect x="120" y="14" width="40" height="16" fill="white" stroke="gray"/><rect x="120" y="50" width="40" height="16" fill="white" stroke="gray"/>'),
  complex: () => svg('<g stroke="steelblue" stroke-width="2">' + [12, 24, 36, 48, 60].map(y => '<line x1="12" y1="' + y + '" x2="70" y2="' + y + '"/><circle cx="' + (20 + y) + '" cy="' + y + '" r="3" fill="steelblue"/>').join('') + '</g><circle cx="120" cy="38" r="22" fill="none" stroke="gray" stroke-dasharray="4 3"/><circle cx="110" cy="30" r="5" fill="tomato"/><circle cx="130" cy="46" r="5" fill="orange"/><circle cx="128" cy="26" r="4" fill="purple"/>'),
  stepper: () => svg('<g font-size="12" text-anchor="middle">' + [0, 1, 2].map(i => '<rect x="' + (14 + i * 50) + '" y="14" width="40" height="30" rx="5" fill="' + (i === 1 ? 'khaki' : 'white') + '" stroke="gray"/><text x="' + (34 + i * 50) + '" y="34">' + (i + 1) + '</text>').join('') + '</g><rect x="98" y="52" width="56" height="18" rx="4" fill="steelblue"/><text x="126" y="65" font-size="11" fill="white" text-anchor="middle">Next &#9654;</text>'),
  data: () => svg('<g font-size="12" font-family="monospace"><text x="14" y="24">[ 3, 7, 1, 9 ]</text><text x="14" y="44">sorted:</text><text x="14" y="62">[ 1, 3, 7, 9 ]</text></g><path d="M118 20 L118 58" stroke="gray" marker-end="url(#a)"/>'),
  animation: () => svg('<circle cx="40" cy="40" r="10" fill="steelblue" opacity="0.25"/><circle cx="62" cy="36" r="10" fill="steelblue" opacity="0.45"/><circle cx="84" cy="32" r="10" fill="steelblue" opacity="0.7"/><circle cx="106" cy="28" r="10" fill="steelblue"/><text x="140" y="36" font-size="18" fill="gray">&#8635;</text>'),
  particles: () => svg([[30, 20, 'gold'], [50, 50, 'tomato'], [70, 26, 'orchid'], [95, 58, 'gold'], [112, 20, 'deepskyblue'], [130, 44, 'tomato'], [148, 24, 'lime'], [40, 62, 'deepskyblue'], [82, 42, 'orange']].map(p => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="4" fill="' + p[2] + '"/>').join('')),
  sliders: () => svg('<g stroke="gray" stroke-width="3"><line x1="16" y1="22" x2="96" y2="22"/><line x1="16" y1="50" x2="96" y2="50"/></g><circle cx="60" cy="22" r="6" fill="steelblue"/><circle cx="34" cy="50" r="6" fill="steelblue"/><path d="M110 60 Q130 10 156 30" fill="none" stroke="seagreen" stroke-width="2"/>'),
  calculator: () => svg('<rect x="50" y="8" width="70" height="62" rx="6" fill="white" stroke="gray"/><rect x="56" y="13" width="58" height="14" fill="honeydew" stroke="gray"/><text x="110" y="24" font-size="11" text-anchor="end">532</text>' + [0, 1, 2].map(r => [0, 1, 2].map(c => '<rect x="' + (58 + c * 19) + '" y="' + (32 + r * 12) + '" width="15" height="9" rx="2" fill="gainsboro"/>').join('')).join('')),
  practice: () => svg('<text x="16" y="28" font-size="13">480 + 50 + 2 = ?</text><rect x="16" y="38" width="56" height="22" fill="white" stroke="steelblue"/><text x="44" y="54" font-size="13" text-anchor="middle">532</text><text x="92" y="56" font-size="20" fill="seagreen">&#10003;</text>'),
  passive: () => svg('<rect x="40" y="12" width="90" height="54" rx="6" fill="white" stroke="gray"/><path d="M76 26 L100 39 L76 52 Z" fill="gray"/>'),
  network: () => svg('<g stroke="gray"><line x1="30" y1="40" x2="80" y2="20"/><line x1="30" y1="40" x2="80" y2="60"/><line x1="80" y1="20" x2="135" y2="40"/><line x1="80" y1="60" x2="135" y2="40"/></g><circle cx="30" cy="40" r="9" fill="lightgreen" stroke="green"/><circle cx="80" cy="20" r="9" fill="gold" stroke="darkgoldenrod"/><circle cx="80" cy="60" r="9" fill="lightsteelblue" stroke="slateblue"/><circle cx="135" cy="40" r="9" fill="orange" stroke="chocolate"/>'),
  comparison: () => svg('<g><rect x="20" y="12" width="60" height="56" fill="white" stroke="gray"/><rect x="90" y="12" width="60" height="56" fill="white" stroke="gray"/></g><g fill="steelblue"><rect x="28" y="22" width="40" height="8"/><rect x="28" y="38" width="22" height="8"/><rect x="28" y="54" width="34" height="8"/><rect x="98" y="22" width="26" height="8"/><rect x="98" y="38" width="44" height="8"/><rect x="98" y="54" width="16" height="8"/></g>'),
  pattern: () => svg([0, 1, 2, 3, 4, 5].map(c => [0, 1, 2].map(r => '<rect x="' + (22 + c * 22) + '" y="' + (12 + r * 20) + '" width="16" height="16" fill="' + ((c + r) % 3 === 0 ? 'seagreen' : 'gainsboro') + '"/>').join('')).join('')),
  precomputed: () => svg('<rect x="30" y="14" width="110" height="50" rx="6" fill="white" stroke="gray"/><text x="85" y="36" font-size="12" text-anchor="middle">Answer:</text><text x="85" y="54" font-size="13" font-weight="bold" text-anchor="middle">"Type B wins"</text>'),
  sorting: () => svg('<g><rect x="14" y="38" width="44" height="30" fill="white" stroke="gray"/><rect x="63" y="38" width="44" height="30" fill="white" stroke="gray"/><rect x="112" y="38" width="44" height="30" fill="white" stroke="gray"/></g><rect x="66" y="10" width="38" height="18" rx="3" fill="khaki" stroke="darkgoldenrod"/><path d="M85 28 L130 40" stroke="gray" marker-end="url(#a)"/>'),
  rubric: () => svg('<g font-size="11">' + ['Accurate', 'Clear', 'Aligned'].map((t, i) => '<text x="14" y="' + (24 + i * 20) + '">' + t + '</text>' + [0, 1, 2].map(c => '<circle cx="' + (92 + c * 24) + '" cy="' + (20 + i * 20) + '" r="6" fill="' + (c === (i + 1) % 3 ? 'steelblue' : 'white') + '" stroke="gray"/>').join('')).join('') + '</g>'),
  nofeedback: () => svg('<rect x="30" y="24" width="60" height="26" rx="5" fill="steelblue"/><text x="60" y="41" font-size="12" fill="white" text-anchor="middle">Submit</text><text x="118" y="48" font-size="30" fill="gray">?</text>'),
  builder: () => svg('<g stroke="gray"><rect x="20" y="44" width="30" height="20" fill="khaki"/><rect x="50" y="44" width="30" height="20" fill="lightgreen"/><rect x="35" y="24" width="30" height="20" fill="lightskyblue"/><rect x="110" y="20" width="30" height="20" fill="plum"/></g><path d="M108 36 L72 36" stroke="gray" marker-end="url(#a)"/>'),
  editor: () => svg('<rect x="20" y="10" width="130" height="58" rx="5" fill="white" stroke="gray"/><g stroke="silver" stroke-width="3"><line x1="30" y1="22" x2="110" y2="22"/><line x1="30" y1="34" x2="130" y2="34"/><line x1="30" y1="46" x2="90" y2="46"/></g><line x1="94" y1="41" x2="94" y2="53" stroke="black" stroke-width="2"/>'),
  canvas: () => svg('<rect x="16" y="10" width="138" height="58" fill="white" stroke="gray"/><path d="M26 56 C50 10, 80 70, 104 26 S140 40, 146 20" fill="none" stroke="purple" stroke-width="3"/>'),
  template: () => svg('<g font-size="11">' + ['Title:', 'Verb:', 'Answer:'].map((t, i) => '<text x="18" y="' + (24 + i * 20) + '">' + t + '</text><rect x="68" y="' + (13 + i * 20) + '" width="80" height="14" fill="whitesmoke" stroke="gray"/>').join('') + '</g><path d="M140 6 l8 8 m0 -8 l-8 8" stroke="firebrick" stroke-width="2"/>')
};
const ARROW_DEFS = '<svg width="0" height="0" style="position:absolute"><defs><marker id="a" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="gray"/></marker></defs></svg>';

// ===========================================
// STATE
// ===========================================
let mode = 'explore';          // 'explore' | 'detective'
let showAnswers = false;
let caseOrder = [];
let caseIndex = 0;
let caseAnswered = false;
let score = { right: 0, tried: 0 };
let selectedChip = null;       // DOM element

// ===========================================
// BUILD THE TABLE AND THE CARDS FROM THE ARRAY
// ===========================================
function chipHtml(item, kind, row) {
  const cls = (mode === 'detective' && !showAnswers && kind !== 'example') ? 'neutral' : kind;
  return '<button class="chip ' + cls + '" data-row="' + row + '" data-kind="' + kind + '" data-name="' +
    item.name + '" title="' + item.name + '">' + (item.short || item.name) + '</button>';
}

function buildMatrix() {
  const body = document.getElementById('matrix-body');
  const cards = document.getElementById('cards');
  let rows = '', cardHtml = '';
  MATRIX.forEach((r, i) => {
    // in detective mode both pattern columns are mixed so position does not give the answer away
    const hidden = mode === 'detective' && !showAnswers;
    let goodCell, badCell, patternTds;
    if (hidden) {
      // mix both kinds in one cell, alphabetically, so neither color nor column gives the answer away
      const mixed = r.good.map(g => [g, 'good']).concat(r.bad.map(b => [b, 'bad']))
        .sort((a, b) => a[0].name.localeCompare(b[0].name));
      goodCell = mixed.map(m => chipHtml(m[0], m[1], i)).join('');
      badCell = '';
      patternTds = '<td colspan="2">' + goodCell + '</td>';
    } else {
      goodCell = r.good.map(g => chipHtml(g, 'good', i)).join('');
      badCell = r.bad.map(b => chipHtml(b, 'bad', i)).join('');
      patternTds = '<td>' + goodCell + '</td><td>' + badCell + '</td>';
    }
    const ex = r.examples.map(e => chipHtml(e, 'example', i)).join('');
    rows += '<tr class="row" data-row="' + i + '"><td><span class="lvl-swatch" style="background:' + r.color + '"></span>' +
      (i + 1) + '. ' + r.level + '</td>' + patternTds + '<td>' + ex + '</td></tr>';
    cardHtml += '<div class="card row" data-row="' + i + '" style="border-left-color:' + r.color + '"><h4>' + (i + 1) + '. ' + r.level + '</h4>' +
      '<div>' + goodCell + (mode === 'detective' && !showAnswers ? '' : badCell) + '</div><div class="sub">Examples: ' + ex + '</div></div>';
  });
  body.innerHTML = rows;
  const heads = document.querySelectorAll('#matrix thead th');
  const hidden = mode === 'detective' && !showAnswers;
  heads[1].textContent = hidden ? 'Patterns (colors and columns hidden)' : 'Appropriate patterns';
  heads[1].colSpan = hidden ? 2 : 1;
  heads[2].style.display = hidden ? 'none' : '';
  cards.innerHTML = cardHtml;
  document.querySelectorAll('.chip').forEach(c => c.addEventListener('click', onChip));
  document.querySelectorAll('.row').forEach(r => {
    r.addEventListener('mousemove', e => showTip(e, +r.dataset.row));
    r.addEventListener('mouseleave', hideTip);
  });
}

function findItem(row, kind, name) {
  const r = MATRIX[row];
  const list = kind === 'good' ? r.good : kind === 'bad' ? r.bad : r.examples;
  return list.find(x => x.name === name);
}

// ===========================================
// DETAIL PANEL
// ===========================================
function showDetail(row, kind, name) {
  const item = findItem(row, kind, name);
  const r = MATRIX[row];
  const d = document.getElementById('detail');
  if (kind === 'example') {
    d.innerHTML = '<h3>' + item.name + '</h3><span class="kind example">Example in this book: ' + r.level + '</span>' +
      '<p>' + item.text + '</p><p><a href="../' + item.id + '/" target="_blank" rel="noopener">Open this MicroSim in a new tab</a></p>' +
      '<p class="hint">Look for which appropriate ' + r.level + ' pattern it uses.</p>';
    return;
  }
  const suits = kind === 'good';
  d.innerHTML = '<h3>' + item.name + '</h3><span class="kind ' + kind + '">' + (suits ? 'Suits ' : 'Fails ') + r.level + '</span>' +
    '<div class="sketch">' + SKETCHES[item.sketch]() + '</div>' +
    '<div>' + item.text + '</div>' +
    '<div class="reason"><b>' + (suits ? 'Why it suits ' : 'Why it fails ') + r.level + ':</b> ' + item.reason + '</div>';
}

function showIntro() {
  document.getElementById('detail').innerHTML =
    '<h3>How to read the matrix</h3><p>Each row is a Bloom level. <span style="color:darkgreen"><b>Green</b></span> chips are interaction patterns that suit the level, ' +
    '<span style="color:darkred"><b>red</b></span> chips are patterns that undermine it, and <span style="color:navy"><b>blue</b></span> chips are MicroSims in this book that use a suitable pattern.</p>' +
    '<p>Click any chip for an explanation, a small sketch and the reason it suits or fails the level. Hover a row to see its verbs.</p>' +
    '<p class="hint">Press <b>Mismatch detective</b> to test yourself.</p>';
}

// ===========================================
// MISMATCH DETECTIVE
// ===========================================
function startDetective() {
  mode = 'detective';
  showAnswers = false;
  caseOrder = shuffle(CASES.map((c, i) => i));
  caseIndex = 0;
  newCase();
}

function newCase() {
  caseAnswered = false;
  buildMatrix();
  const c = CASES[caseOrder[caseIndex]];
  const note = document.getElementById('mode-note');
  note.textContent = 'Mismatch detective: colors hidden';
  note.classList.add('detective');
  document.getElementById('detective-btn').textContent = 'Next case';
  document.getElementById('detail').innerHTML = '<h3>Mismatch detective</h3><div class="scenario">' + c.text + '</div>' +
    '<p>Which Bloom level is this MicroSim\'s objective at, and which pattern does it use that fails that level? ' +
    'Click that chip in the level\'s row.</p><p class="hint">Case ' + (caseIndex + 1) + ' of ' + CASES.length + '</p>';
}

function answerCase(row, kind, name, el) {
  if (caseAnswered) { showDetail(row, kind, name); return; }
  const c = CASES[caseOrder[caseIndex]];
  const rightRow = row === c.row;
  const rightChip = rightRow && c.chips.includes(name);
  caseAnswered = true;
  score.tried++;
  if (rightChip) score.right++;
  updateScore();
  showAnswers = true;
  buildMatrix();
  markAnswer(c, rightChip ? null : { row, name });
  const item = findItem(c.row, 'bad', c.chips[0]);
  let msg;
  if (rightChip) msg = '<p class="ok">Correct: ' + MATRIX[c.row].level + ' row, "' + name + '".</p>';
  else if (rightRow) msg = '<p class="no">Right row (' + MATRIX[c.row].level + '), but "' + name + '" is not the problem here.</p>';
  else msg = '<p class="no">Not quite: the objective in this case is at the ' + MATRIX[c.row].level + ' level.</p>';
  document.getElementById('detail').innerHTML = '<h3>Mismatch detective</h3><div class="scenario">' + c.text + '</div>' + msg +
    '<p><b>' + c.chips.join(' / ') + '</b> fails ' + MATRIX[c.row].level + ': ' + item.reason + '</p>' +
    '<p class="hint">' + (caseIndex + 1 < CASES.length ? 'Press <b>Next case</b> for another.' : 'That was the last case. Press <b>Reset</b> to start over.') + '</p>';
}

function markAnswer(c, wrong) {
  document.querySelectorAll('.chip').forEach(ch => {
    const row = +ch.dataset.row;
    if (row === c.row && c.chips.includes(ch.dataset.name)) ch.classList.add('answer');
    if (wrong && row === wrong.row && ch.dataset.name === wrong.name) ch.classList.add('wrong');
  });
  document.querySelectorAll('.row').forEach(r => r.classList.toggle('hl', +r.dataset.row === c.row));
}

function updateScore() {
  document.getElementById('score').textContent = 'Score: ' + score.right + ' of ' + score.tried;
}

// ===========================================
// EVENTS
// ===========================================
function onChip(e) {
  const el = e.currentTarget;
  const row = +el.dataset.row, kind = el.dataset.kind, name = el.dataset.name;
  if (mode === 'detective' && kind !== 'example') { answerCase(row, kind, name, el); return; }
  if (selectedChip) selectedChip.classList.remove('selected');
  selectedChip = el;
  el.classList.add('selected');
  showDetail(row, kind, name);
}

function showTip(e, row) {
  const tip = document.getElementById('tooltip');
  const app = document.getElementById('app').getBoundingClientRect();
  tip.innerHTML = '<b>' + MATRIX[row].level + ' verbs:</b> ' + MATRIX[row].verbs;
  tip.style.display = 'block';
  let x = e.clientX - app.left + 14, y = e.clientY - app.top + 16;
  if (x + 290 > app.width) x = app.width - 290;
  if (y + 60 > app.height) y = e.clientY - app.top - 60;
  tip.style.left = Math.max(4, x) + 'px';
  tip.style.top = y + 'px';
}
function hideTip() { document.getElementById('tooltip').style.display = 'none'; }

function reset() {
  mode = 'explore';
  showAnswers = false;
  score = { right: 0, tried: 0 };
  updateScore();
  selectedChip = null;
  const note = document.getElementById('mode-note');
  note.textContent = 'Click a chip for details';
  note.classList.remove('detective');
  document.getElementById('detective-btn').textContent = 'Mismatch detective';
  buildMatrix();
  showIntro();
}

function onDetectiveButton() {
  if (mode !== 'detective') { startDetective(); return; }
  if (caseIndex + 1 < CASES.length) { caseIndex++; showAnswers = false; newCase(); }
}

function onShowAnswers() {
  showAnswers = true;
  buildMatrix();
  if (mode === 'detective') {
    const c = CASES[caseOrder[caseIndex]];
    markAnswer(c, null);
    if (!caseAnswered) {
      caseAnswered = true;
      score.tried++;
      updateScore();
      const item = findItem(c.row, 'bad', c.chips[0]);
      document.getElementById('detail').innerHTML = '<h3>Answer</h3><div class="scenario">' + c.text + '</div>' +
        '<p><b>' + MATRIX[c.row].level + '</b> row, <b>' + c.chips.join(' / ') + '</b>: ' + item.reason + '</p>' +
        '<p class="hint">Revealed answers count as attempts. Press <b>Next case</b> to continue.</p>';
    }
  }
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

document.addEventListener('DOMContentLoaded', function () {
  document.body.insertAdjacentHTML('afterbegin', ARROW_DEFS);
  buildMatrix();
  showIntro();
  document.getElementById('reset-btn').addEventListener('click', reset);
  document.getElementById('detective-btn').addEventListener('click', onDetectiveButton);
  document.getElementById('answers-btn').addEventListener('click', onShowAnswers);
});
