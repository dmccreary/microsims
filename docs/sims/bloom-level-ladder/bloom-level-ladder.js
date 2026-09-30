// Bloom Level Ladder
// CANVAS_HEIGHT: 520
// Six bars stacked like a ladder, Remember at the bottom and Create at the top.
// Hover a bar for a one-line definition; click it to list its eight Bloom verbs, an example
// outcome from the course description and an interaction pattern that suits it.

// ----- Standard MicroSim layout -----
let canvasWidth = 400;
let drawHeight = 440;
let controlHeight = 80;     // two rows of controls
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

// ----- The six levels (index 0 = Remember, bottom of the ladder) -----
const LEVELS = [
  { name: 'Remember', color: 'lightcoral', border: 'firebrick',
    def: 'Retrieve a fact, term or list from memory.',
    verbs: ['list', 'define', 'recall', 'identify', 'name', 'recognize', 'locate', 'describe'],
    outcome: 'Name the six levels of Bloom\'s 2001 Taxonomy and the verbs associated with each.',
    pattern: 'Flash cards, matching or labeling: exact retrieval with immediate right-or-wrong feedback.' },
  { name: 'Understand', color: 'sandybrown', border: 'sienna',
    def: 'Build meaning: explain, summarize, interpret, classify or compare in your own words.',
    verbs: ['explain', 'summarize', 'interpret', 'classify', 'compare', 'contrast', 'exemplify', 'infer'],
    outcome: 'Describe how a learning objective\'s Bloom level guides the choice of interaction pattern.',
    pattern: 'A step-through worked example with the concrete data visible at each step, not a continuous animation.' },
  { name: 'Apply', color: 'khaki', border: 'darkgoldenrod',
    def: 'Use a known procedure or idea in a situation you have not seen before.',
    verbs: ['use', 'execute', 'implement', 'solve', 'demonstrate', 'calculate', 'apply', 'practice'],
    outcome: 'Use an AI skill to generate a MicroSim of the type recommended by the routing rubric.',
    pattern: 'Parameter sliders, calculators and practice problems where the learner sets inputs and predicts the result.' },
  { name: 'Analyze', color: 'lightgreen', border: 'seagreen',
    def: 'Break a whole into parts and work out how the parts relate.',
    verbs: ['differentiate', 'organize', 'attribute', 'compare', 'contrast', 'examine', 'deconstruct', 'distinguish'],
    outcome: 'Break a learning objective into concepts and decide which MicroSim interactions provide evidence for each.',
    pattern: 'Network explorers, comparison tools and pattern finders that show relationships directly.' },
  { name: 'Evaluate', color: 'lightskyblue', border: 'steelblue',
    def: 'Make a judgment against stated criteria and defend it.',
    verbs: ['judge', 'critique', 'assess', 'justify', 'prioritize', 'recommend', 'validate', 'defend'],
    outcome: 'Judge a MicroSim against the quality score and against its stated learning objective.',
    pattern: 'Sorting, ranking and rubric-rating activities with feedback on the reasons, not only the choice.' },
  { name: 'Create', color: 'plum', border: 'purple',
    def: 'Produce something new by combining elements.',
    verbs: ['design', 'construct', 'develop', 'formulate', 'compose', 'produce', 'invent', 'generate'],
    outcome: 'Design an original MicroSim that pairs an interaction pattern with a measurable learning objective and a plan for the evidence it will produce.',
    pattern: 'Builders, editors and canvas tools that leave the learner free to choose, not rigid templates.' }
];

// ----- State -----
let selected = 3;          // level shown in the panel (start on Analyze)
let compareSel = [];       // up to two levels in compare mode
let quiz = null;           // { verb, answers:[levels], answered, correct, picked }
let score = { right: 0, asked: 0 };
let barRects = [];         // for hit testing
let panelDiv;              // DOM panel for the level details

// ----- Controls -----
let showVerbsBox, compareBox, quizButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  showVerbsBox = createCheckbox(' Show verbs on bars', false);
  showVerbsBox.position(10, drawHeight + 10);

  compareBox = createCheckbox(' Compare two levels', false);
  compareBox.position(190, drawHeight + 10);
  compareBox.changed(() => {
    quiz = null;
    compareSel = compareBox.checked() ? [selected] : [];
    updatePanel();
  });

  quizButton = createButton('Random level quiz');
  quizButton.position(10, drawHeight + 44);
  quizButton.mousePressed(startQuiz);

  // The details panel is a DOM element so screen readers can read it
  panelDiv = createDiv('');
  panelDiv.parent(document.querySelector('main'));
  panelDiv.style('position', 'absolute');
  panelDiv.style('overflow-y', 'auto');
  panelDiv.style('background', 'white');
  panelDiv.style('border', '1px solid silver');
  panelDiv.style('border-radius', '10px');
  panelDiv.style('padding', '8px 12px');
  panelDiv.style('box-sizing', 'border-box');
  panelDiv.style('font-family', 'Arial, Helvetica, sans-serif');
  panelDiv.style('font-size', '14px');
  panelDiv.style('line-height', '1.3');
  panelDiv.attribute('aria-live', 'polite');
  document.querySelector('main').style.position = 'relative';

  layoutPanel();
  updatePanel();

  describe('Bloom level ladder: six colored bars stacked like a ladder with Remember at the bottom ' +
    'and Create at the top. Hovering a bar shows its one-line definition. Clicking a bar lists its ' +
    'eight Bloom verbs, an example outcome from the course description and a suitable interaction ' +
    'pattern in the panel. A compare mode shows two levels\' verbs side by side with shared verbs ' +
    'highlighted, and a quiz asks which level a random verb belongs to.', LABEL);
}

function draw() {
  updateCanvasSize();

  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const L = ladderGeometry();

  // Title
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(20);
  text('Bloom Level Ladder', margin, 10);

  drawLadder(L);
  drawTooltip();
  drawControlText();
}

// Ladder area: left part when wide, top part when narrow
function ladderGeometry() {
  const narrow = canvasWidth < 600;
  if (narrow) {
    return { x: margin, y: 40, w: canvasWidth - 2 * margin, h: 214, narrow };
  }
  return { x: margin, y: 42, w: canvasWidth * 0.56 - margin, h: drawHeight - 42 - 14, narrow };
}

function drawLadder(L) {
  const railW = 8;
  const gap = L.narrow ? 4 : 8;
  const barH = (L.h - 5 * gap) / 6;
  // rails
  noStroke();
  fill('burlywood');
  rect(L.x, L.y - 4, railW, L.h + 8, 3);
  rect(L.x + L.w - railW, L.y - 4, railW, L.h + 8, 3);

  barRects = [];
  const showVerbs = showVerbsBox.checked();
  for (let i = 0; i < 6; i++) {
    const lev = LEVELS[i];
    const y = L.y + L.h - (i + 1) * barH - i * gap;   // Remember at the bottom
    const x = L.x + railW + 4;
    const w = L.w - 2 * railW - 8;
    const isSel = compareBox.checked() ? compareSel.includes(i) : (selected === i && !quiz);
    let quizMark = null;
    if (quiz && quiz.answered && quiz.picked === i) quizMark = quiz.correct ? 'right' : 'wrong';
    if (quiz && quiz.answered && quiz.answers.includes(i)) quizMark = quizMark || 'answer';

    stroke(isSel ? 'black' : lev.border);
    strokeWeight(isSel ? 3 : 1.5);
    fill(lev.color);
    rect(x, y, w, barH, 8);

    // level number and name
    noStroke();
    fill('black');
    textStyle(BOLD);
    textSize(L.narrow ? 15 : 18);
    textAlign(LEFT, showVerbs ? TOP : CENTER);
    const nameY = showVerbs ? y + 5 : y + barH / 2;
    text((i + 1) + '  ' + lev.name, x + 10, nameY);
    textStyle(NORMAL);

    if (showVerbs) {
      textSize(L.narrow ? 11 : 13);
      fill(40);
      textAlign(LEFT, TOP);
      text(lev.verbs.join(', '), x + 10, y + (L.narrow ? 21 : 26), w - 20, barH - 22);
    }

    // quiz feedback marks on the bar
    if (quizMark) {
      textAlign(RIGHT, CENTER);
      textSize(L.narrow ? 14 : 16);
      textStyle(BOLD);
      fill(quizMark === 'wrong' ? 'firebrick' : 'darkgreen');
      text(quizMark === 'wrong' ? '✗ your pick' : '✓', x + w - 10, y + barH / 2);
      textStyle(NORMAL);
    }
    barRects.push({ i, x, y, w, h: barH });
  }

  // arrow from the selected bar toward the panel (wide layout)
  if (!L.narrow && !compareBox.checked() && !quiz) {
    const r = barRects[selected];
    fill('black');
    noStroke();
    const ax = L.x + L.w + 4;
    triangle(ax, r.y + r.h / 2 - 8, ax, r.y + r.h / 2 + 8, ax + 10, r.y + r.h / 2);
  }
}

function drawTooltip() {
  for (const r of barRects) {
    if (mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h) {
      cursor(HAND);
      const lev = LEVELS[r.i];
      const tip = lev.name + ': ' + lev.def;
      textSize(14);
      const tw = min(fontWidth(tip) + 20, canvasWidth - 2 * margin);
      const lines = ceil(fontWidth(tip) / (tw - 16));
      const th = lines * 18 + 10;
      const tx = constrain(mouseX + 10, margin, canvasWidth - tw - margin);
      let ty = mouseY - th - 10;
      if (ty < 4) ty = mouseY + 18;
      stroke('gray');
      strokeWeight(1);
      fill(255, 255, 230, 245);
      rect(tx, ty, tw, th, 6);
      noStroke();
      fill('black');
      textAlign(LEFT, TOP);
      text(tip, tx + 8, ty + 6, tw - 16, th);
      return;
    }
  }
  cursor(ARROW);
}

function drawControlText() {
  noStroke();
  fill('navy');
  textSize(defaultTextSize);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text('Quiz score: ' + score.right + ' of ' + score.asked, 175, drawHeight + 56);
  textStyle(NORMAL);
}

// ----- Panel content -----
function chip(v, highlight) {
  return '<span style="display:inline-block;margin:2px 3px;padding:1px 8px;border-radius:10px;' +
    'border:1px solid silver;background:' + (highlight ? 'yellow' : 'whitesmoke') + '">' + v + '</span>';
}

function updatePanel() {
  let html = '';
  if (quiz) {
    html += '<div style="font-size:17px;font-weight:bold;margin-bottom:6px">Random level quiz</div>';
    html += '<p>Which Bloom level does the verb <b style="font-size:18px">' + quiz.verb + '</b> belong to? Click a bar on the ladder.</p>';
    if (quiz.answered) {
      const names = quiz.answers.map(a => LEVELS[a].name).join(' and ');
      if (quiz.correct) html += '<p style="color:darkgreen;font-weight:bold">Correct: ' + quiz.verb + ' is a ' + names + ' verb.</p>';
      else html += '<p style="color:firebrick;font-weight:bold">Not quite: ' + quiz.verb + ' is listed under ' + names + '.</p>';
      if (quiz.answers.length > 1) html += '<p>This verb appears at two levels. A verb is a clue, not a verdict: check what the learner must actually do.</p>';
      html += '<p style="color:dimgray">Press <b>Random level quiz</b> for another verb.</p>';
    }
  } else if (compareBox.checked()) {
    html += '<div style="font-size:17px;font-weight:bold;margin-bottom:6px">Compare two levels</div>';
    if (compareSel.length < 2) {
      html += '<p>Click ' + (compareSel.length === 0 ? 'two bars' : 'a second bar') + ' to compare their verb lists.</p>';
      if (compareSel.length === 1) html += '<p><b>' + LEVELS[compareSel[0]].name + '</b> is selected.</p>';
    } else {
      const a = LEVELS[compareSel[0]], b = LEVELS[compareSel[1]];
      const shared = a.verbs.filter(v => b.verbs.includes(v));
      html += '<div style="display:flex;gap:10px">';
      for (const lev of [a, b]) {
        html += '<div style="flex:1"><div style="font-weight:bold;border-bottom:3px solid ' + lev.border + '">' + lev.name + '</div>';
        html += lev.verbs.map(v => '<div>' + chip(v, shared.includes(v)) + '</div>').join('') + '</div>';
      }
      html += '</div>';
      html += shared.length ? '<p><b>Shared verbs:</b> ' + shared.join(', ') + ' (highlighted). The same verb can sit at two levels, so classify by what the task demands.</p>'
        : '<p>No shared verbs in the canonical lists. Try Understand and Analyze.</p>';
    }
  } else {
    const lev = LEVELS[selected];
    html += '<div style="font-size:18px;font-weight:bold;border-bottom:4px solid ' + lev.border + ';margin-bottom:6px">' +
      (selected + 1) + '. ' + lev.name + '</div>';
    html += '<p style="margin:4px 0 8px 0">' + lev.def + '</p>';
    html += '<div style="font-weight:bold">Bloom verbs</div><div>' + lev.verbs.map(v => chip(v, false)).join('') + '</div>';
    html += '<div style="font-weight:bold;margin-top:8px">Example outcome from the course description</div>';
    html += '<p style="margin:2px 0 8px 0;font-style:italic">' + lev.outcome + '</p>';
    html += '<div style="font-weight:bold">An interaction pattern that suits it</div>';
    html += '<p style="margin:2px 0">' + lev.pattern + '</p>';
  }
  panelDiv.html(html);
}

function layoutPanel() {
  const L = ladderGeometry();
  if (L.narrow) {
    panelDiv.position(margin, L.y + L.h + 10);
    panelDiv.size(canvasWidth - 2 * margin, drawHeight - (L.y + L.h + 10) - 8);
  } else {
    const px = L.x + L.w + 20;
    panelDiv.position(px, 40);
    panelDiv.size(canvasWidth - px - margin, drawHeight - 40 - 12);
  }
}

// ----- Interaction -----
function mousePressed() {
  for (const r of barRects) {
    if (mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h) {
      barClicked(r.i);
      return;
    }
  }
}

function barClicked(i) {
  if (quiz && !quiz.answered) {
    quiz.answered = true;
    quiz.picked = i;
    quiz.correct = quiz.answers.includes(i);
    score.asked++;
    if (quiz.correct) score.right++;
  } else if (compareBox.checked()) {
    quiz = null;
    if (compareSel.includes(i)) compareSel = compareSel.filter(k => k !== i);
    else {
      compareSel.push(i);
      if (compareSel.length > 2) compareSel.shift();
    }
  } else {
    quiz = null;
    selected = i;
  }
  updatePanel();
}

function startQuiz() {
  const all = [];
  LEVELS.forEach(lev => lev.verbs.forEach(v => { if (!all.includes(v)) all.push(v); }));
  let verb = random(all);
  if (quiz && all.length > 1) while (verb === quiz.verb) verb = random(all);
  const answers = [];
  LEVELS.forEach((lev, i) => { if (lev.verbs.includes(verb)) answers.push(i); });
  quiz = { verb, answers, answered: false, correct: false, picked: -1 };
  updatePanel();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  layoutPanel();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.floor(container.getBoundingClientRect().width);
  }
}
