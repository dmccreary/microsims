// Loop Polarity Tracer - vis-network causal loop diagram with a link-by-link trace
// CANVAS_HEIGHT: 512
// Learning objective (Analyze / examine): the learner examines a causal loop diagram, traces
// its polarity links, and determines whether each loop is reinforcing or balancing.
// Rule used throughout: count the negative links around a loop. An even count (including
// zero) makes a reinforcing loop (R); an odd count makes a balancing loop (B).

// ---------------------------------------------------------------------------
// The diagram as a JSON document in the causal loop schema (metadata, nodes,
// edges with polarity, loops with type and path). Physics is off, so every
// node carries an explicit position. The two loops share the Mastery node.
// ---------------------------------------------------------------------------
const CLD = {
  metadata: {
    id: 'loop-polarity-tracer-cld',
    title: 'Mastery Loops: Learning Loop and Goal Loop',
    archetype: 'limits-to-growth',
    description: 'A reinforcing learning loop (Mastery, Confidence, Practice time) and a balancing goal loop (Gap between goal and mastery, Study effort, Mastery) that meet at Mastery. A plausible hypothesis about a learner, not a measured result.',
    version: '1.0.0',
    created_date: '2026-09-30',
    author: 'MicroSims 2.0',
    tags: ['causal-loop', 'reinforcing-loop', 'balancing-loop', 'learning']
  },
  nodes: [
    { id: 'mastery', label: 'Mastery', type: 'stock', position: { x: 0, y: 0 },
      description: 'How much of the course\'s skills the learner can reliably perform; the stock that both loops share.' },
    { id: 'confidence', label: 'Confidence', type: 'variable', position: { x: -180, y: -125 },
      description: 'The learner\'s belief that they can succeed at the next task.' },
    { id: 'practice_time', label: 'Practice time', type: 'variable', position: { x: -180, y: 125 },
      description: 'The hours per week the learner chooses to spend practicing.' },
    { id: 'study_effort', label: 'Study effort', type: 'variable', position: { x: 180, y: -125 },
      description: 'The deliberate work the learner puts in to close the gap to the goal.' },
    { id: 'gap', label: 'Gap between goal and mastery', type: 'variable', position: { x: 185, y: 135 },
      description: 'How far the learner\'s current mastery falls short of the learning goal.' }
  ],
  edges: [
    { id: 'mastery_to_confidence', source: 'mastery', target: 'confidence', polarity: 'positive',
      description: 'More mastery, more confidence: success builds belief in the next success.' },
    { id: 'confidence_to_practice', source: 'confidence', target: 'practice_time', polarity: 'positive',
      description: 'More confidence, more practice time: confident learners choose to practice more.' },
    { id: 'practice_to_mastery', source: 'practice_time', target: 'mastery', polarity: 'positive',
      description: 'More practice, more mastery.' },
    { id: 'gap_to_effort', source: 'gap', target: 'study_effort', polarity: 'positive',
      description: 'Bigger gap, more study effort: a learner far from the goal works harder.' },
    { id: 'effort_to_mastery', source: 'study_effort', target: 'mastery', polarity: 'positive',
      description: 'More study effort, more mastery.' },
    { id: 'mastery_to_gap', source: 'mastery', target: 'gap', polarity: 'negative',
      description: 'More mastery, smaller gap: as mastery rises, the distance to the goal shrinks.' }
  ],
  loops: [
    { id: 'R1', name: 'Learning loop', type: 'reinforcing',
      path: ['mastery', 'confidence', 'practice_time', 'mastery'],
      position: { x: -118, y: 0 },
      description: 'Mastery builds confidence, confidence adds practice, practice adds mastery.' },
    { id: 'B1', name: 'Goal loop', type: 'balancing',
      path: ['gap', 'study_effort', 'mastery', 'gap'],
      position: { x: 120, y: 0 },
      description: 'A gap drives effort, effort raises mastery, mastery closes the gap.' }
  ]
};

// ---------- Colors (the generator's causal loop conventions) ----------
const POS = '#1e7e34';      // green plus
const NEG = '#b02a37';      // red minus
const R_COLOR = '#dc3545';  // reinforcing marker
const B_COLOR = '#28a745';  // balancing marker

// ---------- State ----------
let network, nodesDS, edgesDS;
const polarity = {};                 // current polarity of every edge (flippable)
const revealed = {};                 // loop id -> marker shows R/B instead of "?"
let traceLoopId = 'R1';
let traceStep = 0;                   // number of links highlighted so far
let awaitingAnswer = false;          // the R/B question is showing
let traceResult = null;              // {correct, answer, type, negatives}
let flipMode = false;
let lastFlip = null;                 // message about the last flip

CLD.edges.forEach(e => { polarity[e.id] = e.polarity; });

// ---------- Helpers ----------
function nodeById(id) { return CLD.nodes.find(n => n.id === id); }
function edgeById(id) { return CLD.edges.find(e => e.id === id); }
function loopById(id) { return CLD.loops.find(l => l.id === id); }

function loopEdgeIds(loop) {
  const ids = [];
  for (let i = 0; i < loop.path.length - 1; i++) {
    const e = CLD.edges.find(x => x.source === loop.path[i] && x.target === loop.path[i + 1]);
    ids.push(e.id);
  }
  return ids;
}

function negativeCount(loop, upTo) {
  const ids = loopEdgeIds(loop).slice(0, upTo === undefined ? undefined : upTo);
  return ids.filter(id => polarity[id] === 'negative').length;
}

function loopType(loop) {
  return negativeCount(loop) % 2 === 0 ? 'reinforcing' : 'balancing';
}

function loopsContainingEdge(edgeId) {
  return CLD.loops.filter(l => loopEdgeIds(l).includes(edgeId));
}

function wrapText(text, maxLen) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length <= maxLen) line = (line ? line + ' ' : '') + w;
    else { if (line) lines.push(line); line = w; }
  }
  if (line) lines.push(line);
  return lines.join('\n');
}

function tooltip(text) {
  const div = document.createElement('div');
  div.style.cssText = 'max-width:240px;white-space:normal;line-height:1.4;font-size:14px;';
  div.textContent = text;
  return div;
}

function sign(p) { return p === 'positive' ? '+' : '−'; }

// ---------- Building the vis-network data ----------
function visNode(n) {
  const isStock = n.type === 'stock';
  return {
    id: n.id,
    label: wrapText(n.label, 12),
    x: n.position.x,
    y: n.position.y,
    title: tooltip(n.description),
    borderWidth: isStock ? 3 : 2,
    color: {
      background: isStock ? '#e3f2fd' : 'white',
      border: 'dodgerblue',
      highlight: { background: 'lightyellow', border: 'darkblue' },
      hover: { background: 'lightyellow', border: 'darkblue' }
    }
  };
}

function markerNode(loop) {
  const show = revealed[loop.id];
  const t = loopType(loop);
  return {
    id: 'loop_' + loop.id,
    label: show ? (t === 'reinforcing' ? 'R' : 'B') : '?',
    x: loop.position.x,
    y: loop.position.y,
    shape: 'circle',
    font: { color: 'white', size: 22, face: 'Arial', bold: true },
    color: {
      background: show ? (t === 'reinforcing' ? R_COLOR : B_COLOR) : '#6c757d',
      border: '#222',
      highlight: { background: show ? (t === 'reinforcing' ? R_COLOR : B_COLOR) : '#6c757d', border: '#000' },
      hover: { background: show ? (t === 'reinforcing' ? R_COLOR : B_COLOR) : '#6c757d', border: '#000' }
    },
    widthConstraint: { minimum: 30, maximum: 30 },
    title: tooltip(loop.name + ': ' + loop.description),
    shadow: false
  };
}

function visEdge(e) {
  const p = polarity[e.id];
  const flipped = p !== e.polarity;
  const c = p === 'positive' ? POS : NEG;
  return {
    id: e.id,
    from: e.source,
    to: e.target,
    label: sign(p),
    width: 2.5,
    dashes: flipped,
    color: { color: c, highlight: c, hover: c },
    font: { size: 30, color: c, strokeWidth: 6, strokeColor: 'white', align: 'horizontal', bold: true, vadjust: -2 },
    title: tooltip(e.description)
  };
}

// Apply trace highlighting on top of the base styles
function styledEdges() {
  const loop = loopById(traceLoopId);
  const ids = traceStep > 0 ? loopEdgeIds(loop) : [];
  return CLD.edges.map(e => {
    const v = visEdge(e);
    if (traceStep > 0) {
      const k = ids.indexOf(e.id);
      if (k === -1) {
        v.color = { color: '#cfd4da', highlight: '#cfd4da', hover: '#cfd4da' };
        v.font = Object.assign({}, v.font, { color: '#adb5bd' });
      } else if (k < traceStep) {
        v.width = (k === traceStep - 1) ? 7 : 4.5;
        if (k === traceStep - 1) v.shadow = { enabled: true, color: 'rgba(255,193,7,0.9)', size: 12, x: 0, y: 0 };
      }
    }
    return v;
  });
}

function styledNodes() {
  const loop = loopById(traceLoopId);
  const out = CLD.nodes.map(n => {
    const v = visNode(n);
    if (traceStep > 0 && loop.path.includes(n.id)) {
      v.borderWidth = 4;
      v.color = Object.assign({}, v.color, { border: '#e0a800' });
    }
    return v;
  });
  CLD.loops.forEach(l => out.push(markerNode(l)));
  return out;
}

function refreshStyles() {
  nodesDS.update(styledNodes());
  edgesDS.update(styledEdges());
}

// ---------- Details panel ----------
function setInfo(html) {
  document.getElementById('info').innerHTML = html;
}

function showNode(id) {
  if (id.startsWith('loop_')) {
    const loop = loopById(id.slice(5));
    const neg = negativeCount(loop);
    const body = revealed[loop.id]
      ? '<p>' + neg + ' negative link' + (neg === 1 ? '' : 's') + ' (' + (neg % 2 === 0 ? 'even' : 'odd') +
        '), so this loop is <b>' + loopType(loop) + '</b>.</p>'
      : '<p class="hint">Trace this loop to find out whether it is reinforcing or balancing.</p>';
    setInfo('<h2>' + loop.name + '</h2><p>' + loop.description + '</p>' + body);
    return;
  }
  const n = nodeById(id);
  const inLoops = CLD.loops.filter(l => l.path.includes(id)).map(l => l.name);
  setInfo('<h2>' + n.label + (n.type === 'stock' ? ' <span class="hint">(stock)</span>' : '') + '</h2>' +
    '<p>' + n.description + '</p>' +
    '<p class="hint">Part of: ' + inLoops.join(' and ') + '</p>');
}

function showEdge(id) {
  const e = edgeById(id);
  const p = polarity[id];
  const flipped = p !== e.polarity;
  let reason = e.description;
  if (flipped) {
    reason = 'Flipped for this experiment: now a rise in ' + nodeById(e.source).label +
      ' would push ' + nodeById(e.target).label + (p === 'negative' ? ' down.' : ' up.') +
      ' (Original reason: ' + e.description + ')';
  }
  setInfo('<h2>' + nodeById(e.source).label + ' → ' + nodeById(e.target).label + '</h2>' +
    '<p><span class="badge ' + (p === 'positive' ? 'pos">+ positive' : 'neg">− negative') + '</span>' +
    (flipped ? ' <span class="hint">(flipped)</span>' : '') + '</p>' +
    '<p>' + reason + '</p>');
}

function defaultInfo() {
  setInfo('<h2>Two loops, one shared variable</h2>' +
    '<p>Hover or click a variable to read its description. Click a link to see its polarity and reason.</p>' +
    '<p class="hint">Green + : the target moves the same way as the source. Red − : it moves the opposite way.</p>');
}

function renderTracePanel() {
  const panel = document.getElementById('tracePanel');
  const loop = loopById(traceLoopId);
  const ids = loopEdgeIds(loop);
  if (flipMode) {
    const lines = CLD.loops.map(l => {
      const n = negativeCount(l);
      return '<li>' + l.name + ': ' + n + ' negative (' + (n % 2 === 0 ? 'even' : 'odd') + ') → <b>' +
        (n % 2 === 0 ? 'R' : 'B') + '</b></li>';
    }).join('');
    panel.innerHTML = '<h2>Flip a sign mode</h2>' +
      '<p>Click any link to flip its polarity and watch the loop labels.</p>' +
      (lastFlip ? '<p>' + lastFlip + '</p>' : '') +
      '<ul class="trace">' + lines + '</ul>';
    return;
  }
  if (traceStep === 0) {
    panel.innerHTML = '<h2>Trace a loop</h2><p>Choose a loop below and press <b>Trace next link</b> ' +
      'to follow it one link at a time while the counter tallies the negative links.</p>';
    return;
  }
  let html = '<h2>Tracing the ' + loop.name + '</h2><ol class="trace">';
  for (let k = 0; k < traceStep; k++) {
    const e = edgeById(ids[k]);
    const p = polarity[e.id];
    html += '<li>' + nodeById(e.source).label + ' → ' + nodeById(e.target).label + ' <b style="color:' +
      (p === 'positive' ? POS : NEG) + '">' + sign(p) + '</b></li>';
  }
  html += '</ol>';
  html += '<div class="counter">Negative links so far: ' + negativeCount(loop, traceStep) + '</div>';
  if (awaitingAnswer) {
    const last = edgeById(ids[ids.length - 1]);
    html += '<p>One link left: ' + nodeById(last.source).label + ' → ' + nodeById(last.target).label +
      '. Look at its sign. Is this loop reinforcing or balancing?</p>' +
      '<div class="choice-row"><button id="ansR">Reinforcing</button><button id="ansB">Balancing</button></div>';
  } else if (traceResult) {
    const n = traceResult.negatives;
    const parity = n % 2 === 0 ? (n === 0 ? 'Zero is even' : 'An even count') : 'An odd count';
    html += '<p class="' + (traceResult.correct ? 'ok">Correct.' : 'no">Not quite.') + '</p>' +
      '<p>The ' + loop.name + ' has <b>' + n + '</b> negative link' + (n === 1 ? '' : 's') + '. ' + parity +
      ' makes a <b>' + traceResult.type + '</b> loop: a rise in ' + nodeById(loop.path[0]).label +
      (traceResult.type === 'reinforcing' ? ' comes back as a further rise.' : ' comes back as a push the other way.') + '</p>' +
      '<p class="hint">Press Trace next link to trace it again, or choose the other loop.</p>';
  }
  panel.innerHTML = html;
  // on narrow screens the panel sits under the diagram: keep the trace in view
  const details = document.getElementById('details');
  if (details.scrollHeight > details.clientHeight) details.scrollTop = panel.offsetTop - 8;
  if (awaitingAnswer) {
    document.getElementById('ansR').onclick = () => answer('reinforcing');
    document.getElementById('ansB').onclick = () => answer('balancing');
  }
}

// ---------- Trace ----------
function traceNext() {
  if (flipMode || awaitingAnswer) return;
  const loop = loopById(traceLoopId);
  const total = loopEdgeIds(loop).length;
  if (traceStep >= total) {            // finished: start again
    traceStep = 0;
    traceResult = null;
  }
  traceStep++;
  if (traceStep === total - 1) awaitingAnswer = true;   // ask before the final step
  const e = edgeById(loopEdgeIds(loop)[traceStep - 1]);
  showEdge(e.id);
  refreshStyles();
  renderTracePanel();
}

function answer(choice) {
  const loop = loopById(traceLoopId);
  const type = loopType(loop);
  awaitingAnswer = false;
  traceStep = loopEdgeIds(loop).length;          // reveal the final link
  traceResult = { correct: choice === type, answer: choice, type: type, negatives: negativeCount(loop) };
  revealed[loop.id] = true;
  showEdge(loopEdgeIds(loop)[traceStep - 1]);
  refreshStyles();
  renderTracePanel();
}

function resetTrace() {
  traceStep = 0;
  awaitingAnswer = false;
  traceResult = null;
  refreshStyles();
  renderTracePanel();
  defaultInfo();
}

// ---------- Flip a sign ----------
function flipEdge(id) {
  const e = edgeById(id);
  const before = loopsContainingEdge(id).map(l => [l, loopType(l)]);
  polarity[id] = polarity[id] === 'positive' ? 'negative' : 'positive';
  const changes = before.map(([l, t]) => {
    const now = loopType(l);
    return l.name + ' changed from ' + (t === 'reinforcing' ? 'R' : 'B') + ' to ' + (now === 'reinforcing' ? 'R' : 'B');
  });
  lastFlip = 'You flipped ' + nodeById(e.source).label + ' → ' + nodeById(e.target).label + ' to ' +
    sign(polarity[id]) + '. ' + changes.join('; ') + '.';
  refreshStyles();
  showEdge(id);
  renderTracePanel();
}

function restoreSigns() {
  CLD.edges.forEach(e => { polarity[e.id] = e.polarity; });
  lastFlip = 'Original signs restored.';
  refreshStyles();
  renderTracePanel();
}

// ---------- Setup ----------
document.addEventListener('DOMContentLoaded', function () {
  // details panel: an info section plus a trace section
  document.getElementById('details').innerHTML = '<div id="info"></div><hr style="border:none;border-top:1px solid #ddd;margin:6px 0"><div id="tracePanel"></div>';

  const select = document.getElementById('loopSelect');
  CLD.loops.forEach(l => {
    const opt = document.createElement('option');
    opt.value = l.id;
    opt.textContent = l.name;
    select.appendChild(opt);
  });

  nodesDS = new vis.DataSet(styledNodes());
  edgesDS = new vis.DataSet(styledEdges());

  const container = document.getElementById('network');
  network = new vis.Network(container, { nodes: nodesDS, edges: edgesDS }, {
    layout: { improvedLayout: false },
    physics: { enabled: false },
    interaction: {
      hover: true,
      zoomView: false,           // no mouse-wheel zoom: the page keeps scrolling
      dragView: true,
      dragNodes: true,
      selectConnectedEdges: false,
      tooltipDelay: 250
    },
    nodes: {
      shape: 'box',
      margin: 10,
      font: { size: 18, face: 'Arial', color: '#111' },
      shadow: { enabled: true, size: 4, x: 1, y: 1 }
    },
    edges: {
      arrows: { to: { enabled: true, scaleFactor: 1.1 } },
      smooth: { type: 'curvedCCW', roundness: 0.2 },
      selectionWidth: 1.5,
      hoverWidth: 1
    }
  });

  network.once('afterDrawing', () => network.fit({ animation: false }));

  network.on('hoverNode', p => showNode(p.node));
  network.on('hoverEdge', p => { if (!flipMode) showEdge(p.edge); });
  network.on('click', p => {
    if (p.nodes.length > 0) { showNode(p.nodes[0]); return; }
    if (p.edges.length > 0) {
      if (flipMode) flipEdge(p.edges[0]);
      else showEdge(p.edges[0]);
    }
  });

  select.addEventListener('change', () => { traceLoopId = select.value; resetTrace(); });
  document.getElementById('traceBtn').addEventListener('click', traceNext);
  document.getElementById('resetTraceBtn').addEventListener('click', resetTrace);
  document.getElementById('flipMode').addEventListener('change', ev => {
    flipMode = ev.target.checked;
    traceStep = 0; awaitingAnswer = false; traceResult = null;
    if (flipMode) CLD.loops.forEach(l => { revealed[l.id] = true; });
    lastFlip = null;
    document.getElementById('traceBtn').disabled = flipMode;
    refreshStyles();
    renderTracePanel();
  });
  document.getElementById('restoreBtn').addEventListener('click', restoreSigns);
  document.getElementById('zoomInBtn').addEventListener('click', () =>
    network.moveTo({ scale: network.getScale() * 1.25, animation: { duration: 200 } }));
  document.getElementById('zoomOutBtn').addEventListener('click', () =>
    network.moveTo({ scale: network.getScale() / 1.25, animation: { duration: 200 } }));
  document.getElementById('fitBtn').addEventListener('click', () => network.fit({ animation: { duration: 300 } }));

  // re-fit to the container width when the window is resized
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { network.redraw(); network.fit({ animation: false }); }, 120);
  });

  defaultInfo();
  renderTracePanel();
});
