// Prediction Trust Ladder - Mermaid flowchart with a click directive on every node
// CANVAS_HEIGHT: 640
// Five rungs of evidence for a mastery-prediction claim, joined by upward
// arrows: Hoped for, Designed, Simulated, Measured once, Replicated and
// audited. Clicking a rung (a Mermaid click directive) fills the infobox with
// the evidence the rung requires, one example claim from the book that sits
// there, and what would move a claim up. "Place this claim" offers six
// example claims; the learner clicks the rung where the claim sits and the
// correct rung is highlighted. The ladder is a planning aid (Chapter 26),
// not a measured result.

const RUNGS = {
  R1: { n: 1, name: 'Hoped for', short: 'an idea with no design',
    requires: 'Nothing yet: a plausible idea, stated as a hypothesis together with the test that could refute it.',
    example: 'AI could generate MicroSims that are both fun and better at telling whether a learner has mastered a concept (the long-term vision, Chapter 26).',
    moveUp: 'Write a design: what would be built, which events it would emit, and how it would be evaluated.' },
  R2: { n: 2, name: 'Designed', short: 'a written design exists',
    requires: 'A written design or specification, with no working implementation or no evidence that it works.',
    example: 'Bayesian knowledge tracing run on MicroSim events predicts mastery: Chapter 18 specifies the model, but it has not been run on real learners.',
    moveUp: 'Build it and run it on a synthetic cohort whose true mastery is known, following the Chapter 19 protocol.' },
  R3: { n: 3, name: 'Simulated', short: 'tested on synthetic data',
    requires: 'A working pipeline tested on synthetic data where the truth is known. It shows the procedure works and says nothing about real learners.',
    example: 'The Chapter 19 synthetic evaluation: a 50-learner synthetic cohort produced an AUC interval about 0.27 wide.',
    moveUp: 'Collect consented data from one real class and report a held-out result with a base-rate baseline, calibration and uncertainty.' },
  R4: { n: 4, name: 'Measured once', short: 'held-out result from one real class',
    requires: 'A held-out result from one real class, reported with its sample size, baseline, calibration and uncertainty.',
    example: 'No claim in this book sits here yet: no learner data has been collected through MicroSims.',
    moveUp: 'Repeat across sessions and classes, compare error across learner groups, and have the analysis audited.' },
  R5: { n: 5, name: 'Replicated and audited', short: 'holds across sessions and groups',
    requires: 'Results that hold across sessions and learner groups, with error compared across groups, an independent audit, and a person who decides anything consequential.',
    example: 'No claim in this book sits here: the chapter says the top two rungs are empty.',
    moveUp: 'This is the top rung. Keep monitoring, because a model can drift as MicroSims and learners change.' }
};
const ORDER = ['R1', 'R2', 'R3', 'R4', 'R5'];

// Six example claims for "Place this claim" (two are marked hypothetical)
const CLAIMS = [
  { text: 'Bayesian knowledge tracing on MicroSim events predicts which learners have mastered a concept.',
    rung: 'R2', why: 'Chapter 18 specifies the model and Chapter 19 the evaluation, but it has not been run on real learners. The chapter puts it on the lowest rungs; a written design exists, so it is Designed.' },
  { text: 'On a 50-learner synthetic cohort, the evaluation produced an AUC with an interval about 0.27 wide.',
    rung: 'R3', why: 'It was tested on synthetic data where the truth is known. It shows the procedure works, not that events predict real mastery.' },
  { text: 'AI could generate MicroSims that are both fun and better at predicting mastery.',
    rung: 'R1', why: 'The chapter labels the whole long-term vision hoped for: nothing is built and no design document specifies it.' },
  { text: 'Guess-resistant probes will make mastery estimates more trustworthy by lowering the guess parameter.',
    rung: 'R1', why: 'The arithmetic is shown, but there is no design and no data. The test would be to fit the guess parameter from data and see it fall.' },
  { text: '(Hypothetical) A capstone team reports a held-out AUC, with its interval and a base-rate baseline, from one class of consenting classmates.',
    rung: 'R4', why: 'One real class, held out and reported with uncertainty, is Measured once. A class of about a dozen cannot support a general claim.' },
  { text: '(Hypothetical) Over three semesters the model\'s error is compared across keyboard, pointer and shared-device learners, and an independent reviewer audits the analysis.',
    rung: 'R5', why: 'It holds across sessions and groups and has been audited. In this book this rung is still empty.' }
];

const CANVAS_HEIGHT = 640;
let compact = null;      // true when the narrow (name-only) diagram is shown
let renderCount = 0;
let selected = null;     // rung id shown in the infobox
let claimIndex = -1;     // chosen claim, -1 = explore mode
let placed = null;       // rung the learner clicked for the current claim
const nodeEls = {};

function buildMermaid(compactLabels) {
  const lines = ['flowchart BT'];
  // Mermaid 10 has no one-way reverse arrow, so the ladder is drawn bottom-to-top
  // (BT): each arrow points up to the next rung.
  // under 600 px the nodes show only the rung name, so the ladder stays legible when it is short
  ORDER.forEach(id => lines.push('  ' + id + '["<b>' + RUNGS[id].name + '</b>' + (compactLabels ? '' : '<br/>' + RUNGS[id].short) + '"]'));
  for (let i = 0; i < ORDER.length - 1; i++) lines.push('  ' + ORDER[i] + ' --> ' + ORDER[i + 1]);
  // one click directive per node: calls window.rungClick(id); the string is the hover tooltip
  ORDER.forEach(id => lines.push('  click ' + id + ' rungClick "' + RUNGS[id].name + '"'));
  return lines.join('\n');
}

document.addEventListener('DOMContentLoaded', () => {
  const sel = document.getElementById('claim-select');
  sel.add(new Option('Explore: click any rung', '-1'));
  CLAIMS.forEach((c, i) => sel.add(new Option('Claim ' + (i + 1) + ': ' + c.text, String(i))));
  sel.addEventListener('change', () => {
    claimIndex = Number(sel.value);
    placed = null;
    refresh();
  });

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',            // required for click callbacks
    theme: 'default',
    flowchart: { useMaxWidth: false, htmlLabels: true, curve: 'basis', padding: 10,
      nodeSpacing: 30, rankSpacing: 30 },
    themeVariables: { fontSize: '16px', fontFamily: 'Arial, Helvetica, sans-serif' }
  });
  renderLadder();
  window.addEventListener('resize', () => {
    if ((window.innerWidth < 600) !== compact) renderLadder();
  });
});

function renderLadder() {
  compact = window.innerWidth < 600;
  renderCount++;
  mermaid.render('ladderSvg' + renderCount, buildMermaid(compact)).then(({ svg, bindFunctions }) => {
    const el = document.getElementById('diagram');
    el.innerHTML = svg;
    if (bindFunctions) bindFunctions(el);
    indexDiagram(el);
    refresh();
  }).catch(err => {
    document.getElementById('diagram').textContent = 'Diagram error: ' + err;
  });
}

// map Mermaid's node groups to rung ids and make each one keyboard-operable
function indexDiagram(el) {
  el.querySelectorAll('.node').forEach(g => {
    const id = g.getAttribute('data-id') || (g.id.match(/flowchart-(.+)-\d+$/) || [])[1];
    if (!RUNGS[id]) return;
    nodeEls[id] = g;
    g.classList.add('rung-' + RUNGS[id].n);
    g.setAttribute('tabindex', '0');
    g.setAttribute('role', 'button');
    g.setAttribute('aria-label', 'Rung ' + RUNGS[id].n + ': ' + RUNGS[id].name + ', ' + RUNGS[id].short);
    g.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.rungClick(id); }
    });
    g.addEventListener('focus', () => g.classList.add('hl-focus'));
    g.addEventListener('blur', () => g.classList.remove('hl-focus'));
  });
  // the svg keeps its natural aspect ratio and scales to the panel height
  const svg = el.querySelector('svg');
  if (svg) { svg.removeAttribute('height'); svg.style.maxWidth = '100%'; }
}

// Mermaid click directive callback (must be global)
window.rungClick = function (id) {
  selected = id;
  if (claimIndex >= 0 && placed === null) placed = id;
  refresh();
};

function refresh() {
  Object.values(nodeEls).forEach(g => g.classList.remove('hl-selected', 'hl-correct', 'hl-wrong'));
  const panel = document.getElementById('info-panel');
  if (claimIndex < 0) {
    if (selected && nodeEls[selected]) nodeEls[selected].classList.add('hl-selected');
    panel.innerHTML = selected ? rungHtml(selected) : introHtml();
    return;
  }
  const c = CLAIMS[claimIndex];
  let html = '<h3>Place this claim</h3><p class="claim">' + esc(c.text) + '</p>';
  if (placed === null) {
    html += '<p class="hint">Click the rung (or Tab to it and press Enter) where this claim sits today.</p>';
  } else {
    const ok = placed === c.rung;
    const off = Math.abs(RUNGS[placed].n - RUNGS[c.rung].n);
    nodeEls[c.rung].classList.add('hl-correct');
    if (!ok) nodeEls[placed].classList.add('hl-wrong');
    html += ok
      ? '<p class="ok">✓ Correct: ' + RUNGS[c.rung].name + '.</p>'
      : '<p class="bad">✗ You chose ' + RUNGS[placed].name + (off === 1 ? ' (one rung off)' : '') +
        '. It sits at ' + RUNGS[c.rung].name + ' (thick black outline).</p>';
    html += '<p>' + esc(c.why) + '</p>';
    html += '<h4>What would move it up</h4><p>' + esc(RUNGS[c.rung].moveUp) + '</p>';
    html += '<p class="hint">Choose another claim, or click any rung to read what it requires.</p>';
  }
  if (placed !== null && selected && selected !== placed) {
    // after answering, a further click shows that rung's details
    nodeEls[selected].classList.add('hl-selected');
    html = rungHtml(selected) + '<p class="hint">Choose a claim in the menu to place another.</p>';
  }
  panel.innerHTML = html;
}

function introHtml() {
  return '<h3>A ladder of evidence</h3>' +
    '<p>A mastery-prediction claim can be trusted only as far as its evidence reaches. Read the ladder from the bottom: each rung needs everything below it and more.</p>' +
    '<p class="hint">Click a rung (or Tab to it and press Enter) to see what it requires, an example from this book, and what would move a claim up. Then choose a claim in <b>Place this claim</b>.</p>' +
    '<p class="hint">The ladder is a planning aid, not a measured result.</p>';
}

function rungHtml(id) {
  const r = RUNGS[id];
  return '<h3>Rung ' + r.n + ': ' + r.name + '</h3>' +
    '<h4>Evidence it requires</h4><p>' + esc(r.requires) + '</p>' +
    '<h4>Example from this book</h4><p>' + esc(r.example) + '</p>' +
    '<h4>What would move a claim up</h4><p>' + esc(r.moveUp) + '</p>';
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
