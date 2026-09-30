// Choose the Type Challenge
// CANVAS_HEIGHT: 700
// Evaluate-level practice for Chapter 4: read an objective card, choose the MicroSim
// type that should teach it and the reason for the choice, or say "Not sure: ask a
// question" when routing is ambiguous. Two cards describe an existing MicroSim that
// should be reused. A running score counts correct choices, and the summary lists the
// types most often confused.
// Layout note: the total canvas height is fixed (iframe height). The control region
// holds 19 built-in buttons whose grid reflows from 4 columns to 2 under 600 px, so
// controlHeight is computed from the width and drawHeight = canvasHeight - controlHeight.

// ---------- canvas dimensions ----------
let canvasWidth = 400;
let canvasHeight = 700;
let controlHeight = 190;                 // recomputed in layoutControls()
let drawHeight = canvasHeight - controlHeight;
let margin = 16;
let defaultTextSize = 16;

// ---------- the 12 types discussed in Chapter 4 ----------
const TYPES = ['p5.js', 'Chart.js', 'Plotly', 'Mermaid', 'vis-network', 'Causal loop',
  'Venn', 'vis-timeline', 'Leaflet map', 'Comparison table', 'Image overlay', 'Verified poster'];
const REASONS = ['data shape', 'verb and level', 'keyword', 'existing MicroSim'];
const REASON_HELP = {
  'data shape': 'The form the content takes: dated events, coordinates, nodes and edges, numbers in categories, a function, sets.',
  'verb and level': 'The Bloom verb names what the learner does, and the level names the interaction pattern.',
  'keyword': 'A trigger word in the request, such as "timeline", "sine" or "poster". Confirm it; do not trust it alone.',
  'existing MicroSim': 'A catalog match of 0.75 or more whose level and verb also fit: embed it instead of building.'
};
let typeLabelY = 0, reasonLabelY = 0;   // control-region label rows, set in layoutControls()

// ---------- objective cards ----------
// type: reference type; alt: acceptable alternative or null; reasons: acceptable reasons;
// ambiguous: true when "Not sure" is the correct response; candidates / question for those.
const cards = [
  { text: 'Analyze the prerequisites of one concept in the learning graph.', level: 'Analyze', verb: 'analyze',
    type: 'vis-network', alt: null, reasons: ['data shape'],
    explain: 'Prerequisites are nodes joined by directed edges, and an Analyze objective calls for a network explorer, which is what vis-network provides.' },
  { text: 'Explain how amplitude changes the graph of a sine wave.', level: 'Understand', verb: 'explain',
    type: 'Plotly', alt: null, reasons: ['data shape', 'keyword'],
    explain: 'The content is a continuous function with a parameter a slider can vary. "Sine" is also one of the Plotly trigger words.' },
  { text: 'Explain how the Roman Empire expanded around the Mediterranean between 100 BC and AD 117.', level: 'Understand', verb: 'explain',
    ambiguous: true, candidates: ['Leaflet map', 'vis-timeline'],
    question: 'Should the learner see the spread over time, or the place where each event happened?',
    explain: 'Places and dates both matter, so a map and a timeline score within ten points of each other. Only the author knows whether "where" or "when" is the point.' },
  { text: 'Identify the parts of a moss sporophyte.', level: 'Remember', verb: 'identify',
    type: 'Image overlay', alt: null, reasons: ['verb and level'],
    explain: 'A Remember objective about named parts calls for labeling, and a callout overlay puts hover labels and a quiz mode on the illustration.' },
  { text: 'Compare the number of MicroSims of each type across three books.', level: 'Understand', verb: 'compare',
    type: 'Chart.js', alt: null, reasons: ['data shape'],
    explain: 'Numbers in categories are a bar chart. A legend toggle for each book comes with Chart.js at no extra cost.' },
  { text: 'Explain how gravity changes the height of each bounce.', search: 'Catalog search: Bouncing Ball Gravity Lab, similarity 0.82', level: 'Understand', verb: 'explain',
    type: 'p5.js', alt: null, reasons: ['existing MicroSim'], reuse: true,
    explain: 'The match is above the 0.75 reuse threshold, and the existing lab already has gravity and bounciness sliders with a predict-first option. Embed it and mark it Reused.' },
  { text: 'Explain the steps of a change-approval process and its two decision points.', level: 'Understand', verb: 'explain',
    type: 'Mermaid', alt: null, reasons: ['data shape'],
    explain: 'A fixed sequence of steps with yes/no decisions is a flowchart. Mermaid is acceptable here because every node gets a click directive.' },
  { text: 'Explain why adding more road capacity can increase traffic.', level: 'Understand', verb: 'explain',
    type: 'Causal loop', alt: null, reasons: ['data shape'],
    explain: 'The point is a reinforcing feedback loop, so the learner must see loop polarity, not just connections.' },
  { text: 'Examine a graph of the course project\'s dependencies.', level: 'Analyze', verb: 'examine',
    ambiguous: true, candidates: ['vis-network', 'Chart.js'],
    question: 'Do you mean a chart of numbers, or a network showing which parts depend on which?',
    explain: '"Graph" names both a chart and a network. The skill itself lists this word as one that triggers a clarifying question.' },
  { text: 'Distinguish what artificial intelligence, machine learning and data science have in common.', level: 'Analyze', verb: 'distinguish',
    type: 'Venn', alt: null, reasons: ['data shape'],
    explain: 'Overlap among three sets is the whole point, which is the case the Venn type is for (two to four sets).' },
  { text: 'Recall the order of the major Unix releases from 1971 to 1991.', level: 'Remember', verb: 'recall',
    type: 'vis-timeline', alt: null, reasons: ['data shape', 'keyword'],
    explain: 'Dated events on a time axis are a timeline. Without dates a flowchart would do, but here the dates are given.' },
  { text: 'Label the forces acting on a bouncing ball.', search: 'Catalog search: Bouncing Ball Gravity Lab, similarity 0.78', level: 'Remember', verb: 'label',
    type: 'p5.js', alt: 'Image overlay', reasons: ['verb and level'],
    explain: 'The topic matches but the verb does not: the lab asks learners to predict a bounce, not to label forces, so do not reuse it. A ball with force arrows is easy to draw natively in p5.js with drag-to-label; an image overlay would also work.' },
  { text: 'Locate the major shipping routes of the Hanseatic League.', level: 'Remember', verb: 'locate',
    type: 'Leaflet map', alt: null, reasons: ['data shape', 'keyword'],
    explain: 'Location itself carries the meaning: ports and routes need coordinates, which is what Leaflet maps are for.' },
  { text: 'Compare five charting libraries on ease of learning and interactivity.', level: 'Analyze', verb: 'compare',
    type: 'Comparison table', alt: null, reasons: ['data shape', 'verb and level'],
    explain: 'Several items rated on a few criteria is a star-rating comparison table. Each cell is a rating, not a paragraph.' },
  { text: 'Use a diagram to explain how a request moves through an API gateway.', level: 'Understand', verb: 'explain',
    ambiguous: true, candidates: ['Mermaid', 'vis-network'],
    question: 'Will the learner follow one fixed sequence of steps, or explore and drag the connections?',
    explain: '"Diagram" can mean a structural flowchart (Mermaid), a network (vis-network) or a custom drawing (p5.js).' },
  { text: 'Predict how a pendulum\'s period changes when its length changes, then test the prediction.', level: 'Apply', verb: 'predict',
    type: 'p5.js', alt: null, reasons: ['verb and level'],
    explain: 'An Apply objective calls for parameter sliders, and the learner must change a parameter and watch a model respond, which is the p5.js type.' },
  { text: 'Identify the milestones between MicroSims 1.0 and 2.0 and order them in time.', search: 'Catalog search: MicroSims history timeline (Chapter 1), similarity 0.91', level: 'Remember', verb: 'identify',
    type: 'vis-timeline', alt: null, reasons: ['existing MicroSim'], reuse: true,
    explain: 'The Chapter 1 timeline already teaches exactly this objective, and 0.91 is well above the reuse threshold. Embed it rather than generate a copy.' },
  { text: 'Summarize LED and incandescent lighting efficiency on a printable poster with real numbers.', level: 'Understand', verb: 'summarize',
    type: 'Verified poster', alt: null, reasons: ['keyword', 'data shape'],
    explain: 'A static poster was asked for by name and it carries numeric claims, so every number is verified first and the poster is then wrapped in a grid overlay.' },
  { text: 'Interpret how enrollment in each of the 50 states changed over ten years.', level: 'Understand', verb: 'interpret',
    ambiguous: true, candidates: ['Leaflet map', 'Chart.js'],
    question: 'Is the point where the change happened, or how much it changed from year to year?',
    explain: 'A choropleth map and a line chart both fit. The answer to one question about the objective decides between them.' }
];

// ---------- state ----------
let cardIndex = 0;
let chosenType = null;
let chosenReason = null;
let answered = false;
let result = null;            // {correct, lines:[{text,color,bold}]}
let attempts = 0;
let correctCount = 0;
let confusions = {};          // 'A / B' -> count
let showSummary = false;

// ---------- controls ----------
let typeButtons = [];
let reasonButtons = [];
let notSureButton, nextButton, resetButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  TYPES.forEach(t => {
    const b = createButton(t);
    b.parent(document.querySelector('main'));
    b.mouseClicked(() => chooseType(t));
    typeButtons.push(b);
  });
  REASONS.forEach(r => {
    const b = createButton(r);
    b.parent(document.querySelector('main'));
    b.mouseClicked(() => chooseReason(r));
    reasonButtons.push(b);
  });
  notSureButton = createButton('Not sure: ask a question');
  notSureButton.parent(document.querySelector('main'));
  notSureButton.mouseClicked(chooseNotSure);
  nextButton = createButton('Next');
  nextButton.parent(document.querySelector('main'));
  nextButton.mouseClicked(goNext);
  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.mouseClicked(resetAll);

  layoutControls();
  styleButtons();

  describe('Choose the Type Challenge: an objective card shows a learning objective with its Bloom level ' +
    'and verb highlighted. Below the drawing are twelve MicroSim type buttons, four reason buttons (data shape, ' +
    'verb and level, keyword, existing MicroSim), a Not sure button for ambiguous objectives, and Next and Reset. ' +
    'After a type and a reason are chosen, feedback gives the reference type and reasoning. A running score and ' +
    'an end summary of confused types are shown.', LABEL);
}

// ---------- control layout ----------
// Returns nothing; sets controlHeight and drawHeight from the current width.
function layoutControls() {
  const cols = canvasWidth < 600 ? 2 : 4;
  const gap = 6;
  const rowH = canvasWidth < 600 ? 30 : 34;
  const labelH = canvasWidth < 600 ? 20 : 24;
  const left = 10;
  const bw = (canvasWidth - 2 * left - (cols - 1) * gap) / cols;
  const typeRows = Math.ceil(TYPES.length / cols);
  const reasonCols = canvasWidth < 600 ? 2 : 4;
  const reasonRows = Math.ceil(REASONS.length / reasonCols);
  // label row + type grid + label row + reasons + action row
  controlHeight = labelH + typeRows * rowH + labelH + reasonRows * rowH + rowH + 10;
  drawHeight = canvasHeight - controlHeight;

  typeLabelY = drawHeight + labelH / 2 + 2;
  let y = drawHeight + labelH + 2;
  typeButtons.forEach((b, i) => {
    b.position(left + (i % cols) * (bw + gap), y + Math.floor(i / cols) * rowH);
    b.size(bw, rowH - 6);
  });
  y += typeRows * rowH;
  reasonLabelY = y + labelH / 2;
  y += labelH;
  const rw = (canvasWidth - 2 * left - (reasonCols - 1) * gap) / reasonCols;
  reasonButtons.forEach((b, i) => {
    b.position(left + (i % reasonCols) * (rw + gap), y + Math.floor(i / reasonCols) * rowH);
    b.size(rw, rowH - 6);
  });
  y += reasonRows * rowH + 2;
  notSureButton.position(left, y);
  nextButton.position(left + notSureButton.elt.offsetWidth + 10, y);
  resetButton.position(left + notSureButton.elt.offsetWidth + 10 + nextButton.elt.offsetWidth + 8, y);
}

// colors show the learner's choice and, after answering, the reference answer
function styleButtons() {
  const c = cards[cardIndex];
  typeButtons.forEach((b, i) => {
    const t = TYPES[i];
    let bg = 'white';
    if (answered && !c.ambiguous && (t === c.type || t === c.alt)) bg = 'lightgreen';
    else if (answered && c.ambiguous && c.candidates.includes(t)) bg = 'khaki';
    else if (answered && t === chosenType) bg = 'lightcoral';
    else if (t === chosenType) bg = 'gold';
    b.style('background-color', bg);
    b.style('border', '1px solid gray');
    b.style('border-radius', '5px');
    b.style('font-size', '14px');
    b.style('cursor', answered || showSummary ? 'default' : 'pointer');
  });
  reasonButtons.forEach((b, i) => {
    const r = REASONS[i];
    let bg = 'aliceblue';
    if (answered && !c.ambiguous && c.reasons.includes(r)) bg = 'lightgreen';
    else if (answered && r === chosenReason) bg = 'lightcoral';
    else if (r === chosenReason) bg = 'gold';
    b.style('background-color', bg);
    b.style('border', '1px solid steelblue');
    b.style('border-radius', '14px');
    b.style('font-size', '14px');
  });
  notSureButton.style('font-size', '14px');
}

// ---------- answering ----------
function chooseType(t) {
  if (answered || showSummary) return;
  chosenType = t;
  if (chosenReason) evaluate(false); else styleButtons();
}

function chooseReason(r) {
  if (answered || showSummary) return;
  chosenReason = r;
  if (chosenType) evaluate(false); else styleButtons();
}

function chooseNotSure() {
  if (answered || showSummary) return;
  chosenType = null;
  chosenReason = null;
  evaluate(true);
}

function evaluate(notSure) {
  const c = cards[cardIndex];
  const lines = [];
  let correct = false;
  if (c.ambiguous) {
    if (notSure) {
      correct = true;
      lines.push({ text: 'Correct: this objective is ambiguous.', color: 'darkgreen', bold: true });
    } else {
      const defensible = c.candidates.includes(chosenType);
      lines.push({ text: 'Not quite: this objective is ambiguous between ' + c.candidates.join(' and ') + '.', color: 'firebrick', bold: true });
      if (defensible) lines.push({ text: chosenType + ' is defensible, but ask before you build.', color: 'black' });
      addConfusion(c.candidates[0] + ' or ' + c.candidates[1], chosenType, true);
    }
    lines.push({ text: 'Clarifying question: "' + c.question + '"', color: 'darkslateblue', bold: true });
    lines.push({ text: c.explain, color: 'black' });
  } else if (notSure) {
    lines.push({ text: 'Not quite: this objective is not ambiguous.', color: 'firebrick', bold: true });
    lines.push({ text: 'Reference: ' + c.type + ' (reason: ' + c.reasons[0] + ').' + (c.alt ? ' Also acceptable: ' + c.alt + '.' : ''), color: 'black', bold: true });
    lines.push({ text: c.explain, color: 'black' });
  } else {
    const typeOk = chosenType === c.type || chosenType === c.alt;
    const reasonOk = c.reasons.includes(chosenReason);
    correct = typeOk && reasonOk;
    if (correct) lines.push({ text: 'Correct: ' + chosenType + ', for its ' + chosenReason + '.', color: 'darkgreen', bold: true });
    else if (typeOk) lines.push({ text: 'Right type, but a different reason fits better.', color: 'darkorange', bold: true });
    else lines.push({ text: 'Not quite: you chose ' + chosenType + '.', color: 'firebrick', bold: true });
    lines.push({ text: 'Reference: ' + c.type + ' (reason: ' + c.reasons.join(' or ') + ').' + (c.alt ? ' Also acceptable: ' + c.alt + '.' : ''), color: 'black', bold: true });
    if (chosenReason === 'existing MicroSim' && !c.reuse && !c.search) {
      lines.push({ text: 'No catalog match is given for this objective, so there is nothing to reuse.', color: 'black' });
    }
    lines.push({ text: c.explain, color: 'black' });
    if (!typeOk) addConfusion(c.type, chosenType, false);
  }
  attempts++;
  if (correct) correctCount++;
  answered = true;
  result = { correct: correct, lines: lines };
  styleButtons();
}

function addConfusion(ref, chosen, ambiguous) {
  const key = ambiguous ? 'Built ' + chosen + ' when a question was needed' : [ref, chosen].sort().join(' vs ');
  confusions[key] = (confusions[key] || 0) + 1;
}

function goNext() {
  if (showSummary) return;
  if (cardIndex === cards.length - 1) {
    showSummary = true;
  } else {
    cardIndex++;
  }
  chosenType = null;
  chosenReason = null;
  answered = false;
  result = null;
  styleButtons();
}

function resetAll() {
  cardIndex = 0;
  chosenType = null;
  chosenReason = null;
  answered = false;
  result = null;
  attempts = 0;
  correctCount = 0;
  confusions = {};
  showSummary = false;
  styleButtons();
}

// ---------- draw ----------
function draw() {
  updateCanvasSize();
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const narrow = canvasWidth < 600;
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(narrow ? 19 : 22);
  text('Choose the Type Challenge', margin, 10);
  textSize(14);
  textAlign(RIGHT, TOP);
  fill('dimgray');
  const progress = showSummary ? 'Finished' : 'Card ' + (cardIndex + 1) + ' of ' + cards.length;
  text(progress + '   Correct: ' + correctCount + ' of ' + attempts, canvasWidth - margin, narrow ? 38 : 16);

  if (showSummary) drawSummary(narrow ? 60 : 48);
  else drawCard(narrow ? 60 : 48);
  drawControlLabels();
}

function drawCard(top) {
  const c = cards[cardIndex];
  const x = margin;
  let w = canvasWidth - 2 * margin;
  const narrow = canvasWidth < 600;
  const fs = narrow ? 16 : 18;

  // measure the card
  textSize(fs);
  const words = c.text.split(' ');
  const lines = layoutWords(words, w - 28);
  let cardH = 44 + lines.length * (fs + 6) + (c.search ? 26 : 0) + 8;

  stroke('steelblue');
  strokeWeight(2);
  fill('white');
  rect(x, top, w, cardH, 10);

  // Bloom level and verb chips
  noStroke();
  textSize(14);
  textStyle(BOLD);
  const chip1 = 'Bloom level: ' + c.level;
  const chip2 = 'verb: ' + c.verb;
  fill('steelblue');
  rect(x + 14, top + 12, fontWidth(chip1) + 16, 22, 11);
  fill('darkorange');
  rect(x + 14 + fontWidth(chip1) + 24, top + 12, fontWidth(chip2) + 16, 22, 11);
  fill('white');
  textAlign(LEFT, CENTER);
  text(chip1, x + 22, top + 23);
  fill('black');
  text(chip2, x + 14 + fontWidth(chip1) + 32, top + 23);
  textStyle(NORMAL);

  // objective text with the verb highlighted
  textSize(fs);
  textAlign(LEFT, TOP);
  let y = top + 44;
  const verbIdx = words.findIndex(wd => wd.toLowerCase().replace(/[^a-z]/g, '').startsWith(c.verb.toLowerCase()));
  let k = 0;
  lines.forEach(line => {
    let lx = x + 14;
    line.forEach(wd => {
      if (k === verbIdx) {
        textStyle(BOLD);
        fill('darkorange');
        rect(lx - 2, y - 1, fontWidth(wd) + 4, fs + 4, 3);
        fill('black');
      } else {
        textStyle(NORMAL);
        fill('black');
      }
      text(wd, lx, y);
      lx += fontWidth(wd + ' ');
      k++;
    });
    y += fs + 6;
  });
  textStyle(NORMAL);
  if (c.search) {
    textSize(14);
    fill('darkslateblue');
    textStyle(ITALIC);
    text(fitText(c.search, w - 28), x + 14, y + 2);
    textStyle(NORMAL);
  }

  // current choice (on narrow screens the button colors show it once answered)
  y = top + cardH + 12;
  if (!(narrow && answered)) {
    textSize(15);
    fill('black');
    textAlign(LEFT, TOP);
    const choice = answered && !chosenType ? 'You chose: Not sure, ask a question' :
      'Your type: ' + (chosenType || '(choose below)') + '    Your reason: ' + (chosenReason || '(choose below)');
    wrapText(choice, w).forEach(L => { text(L, x, y); y += 20; });
    y += 6;
  }

  // feedback panel, with a reminder of the four reasons beside it on wide screens
  const ph = drawHeight - y - 10;
  let fw = w;
  if (!narrow) {
    fw = Math.round(w * 0.6);
    drawReasonHelp(x + fw + 10, y, w - fw - 10, ph);
  }
  w = fw;
  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 235);
  rect(x, y, w, ph, 10);
  noStroke();
  if (!result) {
    fill('dimgray');
    textSize(14);
    wrapText('Choose a type and a reason, or press "Not sure: ask a question" if two types fit equally well. ' +
      'Feedback appears as soon as you have chosen both.', w - 24).forEach((L, i) => text(L, x + 12, y + 10 + i * 18));
    return;
  }
  // fit the feedback text into the panel
  let ffs = 15;
  while (ffs > 12 && feedbackHeight(result.lines, w - 24, ffs) > ph - 16) ffs--;
  let fy = y + 10;
  result.lines.forEach(L => {
    textSize(ffs);
    textStyle(L.bold ? BOLD : NORMAL);
    fill(L.color);
    wrapText(L.text, w - 24).forEach(t => { text(t, x + 12, fy); fy += ffs + 4; });
    fy += 4;
  });
  textStyle(NORMAL);
}

function drawReasonHelp(x, y, w, h) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  let fs = 14;
  // shrink until the four definitions fit
  while (fs > 11) {
    let hh = 30;
    textSize(fs);
    REASONS.forEach(r => { hh += 18 + wrapText(REASON_HELP[r], w - 20).length * (fs + 3) + 6; });
    if (hh <= h) break;
    fs--;
  }
  let yy = y + 10;
  fill('black');
  textStyle(BOLD);
  textSize(15);
  text('The four reasons', x + 10, yy);
  yy += 24;
  REASONS.forEach(r => {
    textStyle(BOLD);
    textSize(fs);
    fill('steelblue');
    text(r, x + 10, yy);
    yy += fs + 4;
    textStyle(NORMAL);
    fill('black');
    wrapText(REASON_HELP[r], w - 20).forEach(L => { text(L, x + 10, yy); yy += fs + 3; });
    yy += 6;
  });
}

function feedbackHeight(lines, w, fs) {
  let h = 0;
  lines.forEach(L => {
    textSize(fs);
    textStyle(L.bold ? BOLD : NORMAL);
    h += wrapText(L.text, w).length * (fs + 4) + 4;
  });
  textStyle(NORMAL);
  return h;
}

function drawSummary(top) {
  const x = margin, w = canvasWidth - 2 * margin;
  stroke('steelblue');
  strokeWeight(2);
  fill('white');
  rect(x, top, w, drawHeight - top - 10, 10);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(18);
  text('Summary', x + 14, top + 12);
  textStyle(NORMAL);
  textSize(15);
  let y = top + 42;
  const pct = attempts ? Math.round(100 * correctCount / attempts) : 0;
  text('Correct choices: ' + correctCount + ' of ' + attempts + ' attempts (' + pct + '%)', x + 14, y);
  y += 26;
  textStyle(BOLD);
  text('Types you most often confused', x + 14, y);
  textStyle(NORMAL);
  y += 22;
  const entries = Object.entries(confusions).sort((a, b) => b[1] - a[1]).slice(0, 5);
  if (entries.length === 0) {
    fill('darkgreen');
    text('None: every type you chose was the reference type or an acceptable alternative.', x + 14, y, w - 28);
    y += 40;
  } else {
    entries.forEach(([k, n]) => {
      fill('black');
      wrapText(k + ' (' + n + ')', w - 40).forEach(L => { text('- ' + L, x + 20, y); y += 20; });
    });
    y += 8;
  }
  fill('dimgray');
  textSize(14);
  wrapText('Press Reset to try the cards again. For each confusion, ask which question about the objective ' +
    '(data shape, verb and level, a keyword, or an existing MicroSim) would have separated the two types.', w - 28)
    .forEach(L => { text(L, x + 14, y); y += 18; });
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(14);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text('Type', 10, typeLabelY);
  text('Reason', 10, reasonLabelY);
  textStyle(NORMAL);
}

// ---------- text helpers ----------
function layoutWords(words, maxW) {
  const lines = [];
  let line = [];
  let lw = 0;
  words.forEach(wd => {
    const ww = fontWidth(wd + ' ');
    if (lw + fontWidth(wd) > maxW && line.length) {
      lines.push(line);
      line = [];
      lw = 0;
    }
    line.push(wd);
    lw += ww;
  });
  if (line.length) lines.push(line);
  return lines;
}

function wrapText(str, maxW) {
  return layoutWords(str.split(' '), maxW).map(L => L.join(' '));
}

function fitText(str, maxW) {
  if (fontWidth(str) <= maxW) return str;
  let s = str;
  while (s.length > 3 && fontWidth(s + '...') > maxW) s = s.slice(0, -1);
  return s + '...';
}

// ---------- responsive design ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  layoutControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
}
