// Chart Configuration Anatomy Explorer - Chart.js 4.4.0
// CANVAS_HEIGHT: 660
// The left panel shows a Chart.js configuration as three color-coded blocks
// (type, data, options); the right panel draws the chart from that object.
// Each control rewrites exactly one block. Hovering a block outlines the chart
// features it controls; hovering a bar, point or slice shows a tooltip naming
// the configuration path that produced it. "Break it" removes one label to
// show a labels/values mismatch.

// ---------- the configuration state (the single source of truth) ----------
const DEFAULT_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const DATASET_A = {
  label: 'Section A',
  data: [12, 19, 8, 15, 10],
  backgroundColor: ['lightskyblue', 'deepskyblue', 'dodgerblue', 'steelblue', 'royalblue'],
  borderColor: 'midnightblue'
};
const DATASET_B = {
  label: 'Section B',
  data: [9, 14, 11, 17, 6],
  backgroundColor: ['moccasin', 'sandybrown', 'orange', 'darkorange', 'chocolate'],
  borderColor: 'saddlebrown'
};
const PART_COLORS = { type: 'slateblue', data: 'seagreen', options: 'darkorange' };

let state = null;
let chart = null;
let highlight = null;               // 'type' | 'data' | 'options' | null
let captionTimer = null;

function freshState() {
  return {
    type: 'bar',
    labels: DEFAULT_LABELS.slice(),
    datasets: [copyDataset(DATASET_A)],
    responsive: true,
    legendPosition: 'top',
    broken: false
  };
}

function copyDataset(d) {
  return { label: d.label, data: d.data.slice(), backgroundColor: d.backgroundColor.slice(), borderColor: d.borderColor };
}

// ---------- build the Chart.js configuration from the state ----------
function buildConfig() {
  return {
    type: state.type,
    data: {
      labels: state.labels.slice(),
      datasets: state.datasets.map(d => Object.assign(copyDataset(d), { borderWidth: state.type === 'line' ? 3 : 1 }))
    },
    options: {
      responsive: state.responsive,
      maintainAspectRatio: false,
      animation: { duration: 300 },
      plugins: {
        title: { display: true, text: 'MicroSim sessions per day' },
        legend: {
          position: state.legendPosition,
          onHover: () => showLegendNote(),
          onLeave: () => setCaption(defaultCaption())
        },
        tooltip: {
          callbacks: {
            title: items => {
              if (!items.length) return '';
              const i = items[0].dataIndex;
              const lab = state.labels[i];
              return 'data.labels[' + i + '] = ' + (lab === undefined ? 'undefined (missing!)' : "'" + lab + "'");
            },
            label: item => 'data.datasets[' + item.datasetIndex + '].data[' + item.dataIndex + '] = ' + item.raw,
            footer: items => items.length
              ? 'color: data.datasets[' + items[0].datasetIndex + '].backgroundColor[' + items[0].dataIndex + ']'
              : ''
          }
        }
      }
    },
    plugins: [anatomyPlugin]
  };
}

// Draws dashed outlines around the chart features controlled by the hovered block
const anatomyPlugin = {
  id: 'anatomyHighlight',
  afterDraw(c) {
    if (!highlight) return;
    const ctx = c.ctx;
    ctx.save();
    ctx.strokeStyle = PART_COLORS[highlight];
    ctx.lineWidth = 3;
    ctx.setLineDash([7, 5]);
    const boxes = [];
    if (highlight === 'type') {
      const a = c.chartArea;
      boxes.push([a.left, a.top, a.right - a.left, a.bottom - a.top]);
    } else if (highlight === 'data') {
      // Category labels live on the x axis (bar, line) or in the legend (pie)
      if (c.scales.x) {
        const s = c.scales.x;
        boxes.push([s.left, s.top, s.width, s.height]);
      } else if (c.legend) {
        boxes.push([c.legend.left, c.legend.top, c.legend.width, c.legend.height]);
      }
    } else if (highlight === 'options') {
      if (c.legend && c.legend.width > 0) boxes.push([c.legend.left, c.legend.top, c.legend.width, c.legend.height]);
      const t = c.titleBlock;
      if (t && t.width > 0) boxes.push([t.left, t.top, t.width, t.height]);
      boxes.push([2, 2, c.width - 4, c.height - 4]);       // the canvas size (responsive)
    }
    for (const b of boxes) ctx.strokeRect(b[0] - 2, b[1] - 2, b[2] + 4, b[3] + 4);
    ctx.restore();
  }
};

// Create (or re-create) the chart from the configuration object
function rebuildChart() {
  if (chart) chart.destroy();
  const box = document.getElementById('chartBox');
  box.innerHTML = '';
  const canvas = document.createElement('canvas');
  canvas.id = 'chartCanvas';
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'A ' + state.type + ' chart drawn from the configuration on the left');
  if (!state.responsive) {
    // Not responsive: the chart keeps the canvas's own fixed size
    canvas.width = 300;
    canvas.height = 200;
    canvas.style.width = '300px';
    canvas.style.height = '200px';
  }
  box.appendChild(canvas);
  chart = new Chart(canvas, buildConfig());
}

// Apply a data or legend edit to the live chart, then call chart.update()
function updateChart() {
  chart.data.labels = state.labels.slice();
  chart.data.datasets = buildConfig().data.datasets;
  chart.options.plugins.legend.position = state.legendPosition;
  chart.update();
}

// ---------- render the configuration text ----------
function q(s) { return "'" + s + "'"; }

function renderCode() {
  document.getElementById('typeCode').innerHTML = highlightCode('  type: ' + q(state.type) + ',');

  let d = '  data: {\n';
  d += '    labels: [' + state.labels.map(q).join(', ') + '],\n';
  d += '    datasets: [';
  state.datasets.forEach((ds, i) => {
    d += (i ? ', ' : '') + '{\n';
    d += '      label: ' + q(ds.label) + ',\n';
    d += '      data: [' + ds.data.join(', ') + '],\n';
    d += '      backgroundColor: [' + ds.backgroundColor.map(q).join(', ') + '],\n';
    d += '      borderColor: ' + q(ds.borderColor) + '\n';
    d += '    }';
  });
  d += ']\n  },';
  document.getElementById('dataCode').innerHTML = highlightCode(d);

  let o = '  options: {\n';
  o += '    responsive: ' + state.responsive + ',\n';
  o += '    maintainAspectRatio: false,\n';
  o += '    plugins: {\n';
  o += "      title: { display: true, text: 'MicroSim sessions per day' },\n";
  o += '      legend: { position: ' + q(state.legendPosition) + ' }\n';
  o += '    }\n';
  o += '    // + tooltip callbacks\n';
  o += '  }';
  document.getElementById('optionsCode').innerHTML = highlightCode(o);
}

// Tiny highlighter for the generated code: comments, strings, keys, numbers, booleans.
// Each line becomes a div with a hanging indent, so wrapped lines stay indented.
function highlightCode(src) {
  const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return src.split('\n').map(rawLine => {
    const indent = rawLine.match(/^ */)[0].length;
    const line = rawLine.slice(indent);
    const ci = line.indexOf('//');
    const code = ci >= 0 ? line.slice(0, ci) : line;
    const comment = ci >= 0 ? line.slice(ci) : '';
    const html = code.replace(/('[^']*')|(\b[A-Za-z_]+\b)(?=\s*:)|(\b\d+(?:\.\d+)?\b)|(\btrue\b|\bfalse\b)|([^'\w]+|\w+)/g,
      (m, str, key, num, bool) => {
        if (str) return '<span class="s">' + esc(str) + '</span>';
        if (key) return '<span class="k">' + esc(key) + '</span>';
        if (num) return '<span class="n">' + num + '</span>';
        if (bool) return '<span class="b">' + bool + '</span>';
        return esc(m);
      });
    const body = html + (comment ? '<span class="c">' + esc(comment) + '</span>' : '');
    return '<div class="ln" style="padding-left:' + (indent + 2) + 'ch;text-indent:-2ch">' + body + '</div>';
  }).join('');
}

function flash(part) {
  const el = document.getElementById(part + 'Block');
  el.classList.remove('changed');
  void el.offsetWidth;               // restart the animation
  el.classList.add('changed');
}

// ---------- captions ----------
function defaultCaption() {
  if (state.broken) return mismatchCaption();
  return 'Hover a colored block on the left to outline what it controls, or hover a bar, point or slice ' +
    'to see the configuration path that produced it.';
}

function mismatchCaption() {
  const n = state.labels.length, m = state.datasets[0].data.length;
  const lost = state.datasets[0].data[m - 1];
  let effect;
  if (state.type === 'pie') {
    effect = 'The pie still draws a fifth slice for ' + lost + ', but it has no name in the legend.';
  } else {
    effect = 'With only ' + n + ' categories on the x axis, the value ' + lost + ' has no place and is not drawn.';
  }
  return '<b>Mismatch:</b> <code>data.labels</code> has ' + n + ' entries but <code>data.datasets[0].data</code> has ' +
    m + ' values. ' + effect + ' Press Fix it to restore the label.';
}

function setCaption(html, warn) {
  const cap = document.getElementById('caption');
  cap.innerHTML = html;
  cap.classList.toggle('warn', !!(warn || state.broken));
}

const PART_NOTES = {
  type: () => '<b>type</b> <code>' + q(state.type) + '</code> decides the kind of mark: bars, a line with points, or ' +
    'pie slices. The outline shows the plot area it fills. Change it with the Chart type dropdown.',
  data: () => '<b>data</b> supplies the content: <code>labels</code> name the categories (outlined), and each dataset ' +
    'gives its values and colors. Every highlighted ' + (state.type === 'pie' ? 'slice' : state.type === 'line' ? 'point' : 'bar') +
    ' comes from this block.',
  options: () => '<b>options</b> set behavior and appearance: <code>responsive: ' + state.responsive + '</code> ' +
    (state.responsive ? 'lets the canvas (outlined) fill its panel' : 'keeps the canvas at its fixed 300 by 200 size') +
    ', <code>plugins.title</code> writes the chart title, and <code>legend.position</code> puts the legend at the ' +
    state.legendPosition + ' (both outlined).'
};

function showLegendNote() {
  setCaption('<b>Legend:</b> its place comes from <code>options.plugins.legend.position = ' + q(state.legendPosition) +
    '</code>; its entries come from ' + (state.type === 'pie' ? '<code>data.labels</code>' : '<code>data.datasets[i].label</code>') + '.');
}

// ---------- block hover: outline the chart features a block controls ----------
function setHighlight(part) {
  highlight = part;
  document.querySelectorAll('.block').forEach(b => b.classList.toggle('lit', b.dataset.part === part));
  if (!chart) return;
  if (part === 'data') {
    // Show every element in its hover style
    const active = [];
    chart.data.datasets.forEach((ds, di) => ds.data.forEach((v, i) => active.push({ datasetIndex: di, index: i })));
    chart.setActiveElements(active);
  } else {
    chart.setActiveElements([]);
  }
  chart.tooltip.setActiveElements([], { x: 0, y: 0 });
  chart.update('none');
  setCaption(part ? PART_NOTES[part]() : defaultCaption());
}

// ---------- controls ----------
function buildValueInputs() {
  const row = document.getElementById('valueRow');
  row.querySelectorAll('label').forEach(l => l.remove());
  DEFAULT_LABELS.forEach((lab, i) => {
    const label = document.createElement('label');
    label.textContent = lab + ' ';
    const input = document.createElement('input');
    input.type = 'number';
    input.min = 0;
    input.max = 50;
    input.step = 1;
    input.className = 'value-input';
    input.value = state.datasets[0].data[i];
    input.setAttribute('aria-label', 'data.datasets[0].data[' + i + ']');
    input.addEventListener('input', () => {
      const v = constrain0to50(parseFloat(input.value));
      if (isNaN(v)) return;
      state.datasets[0].data[i] = v;
      renderCode();
      flash('data');
      updateChart();
    });
    label.appendChild(input);
    row.appendChild(label);
  });
}

function constrain0to50(v) {
  if (isNaN(v)) return NaN;
  return Math.max(0, Math.min(50, Math.round(v)));
}

function syncControls() {
  document.getElementById('typeSelect').value = state.type;
  document.getElementById('legendSelect').value = state.legendPosition;
  document.getElementById('responsiveCheck').checked = state.responsive;
  document.getElementById('addButton').textContent = state.datasets.length > 1 ? 'Remove dataset' : 'Add dataset';
  document.getElementById('breakButton').textContent = state.broken ? 'Fix it' : 'Break it';
  buildValueInputs();
}

function wireControls() {
  document.getElementById('typeSelect').addEventListener('change', e => {
    state.type = e.target.value;            // rewrites the type block only
    renderCode();
    flash('type');
    rebuildChart();
    setCaption(defaultCaption());
  });
  document.getElementById('legendSelect').addEventListener('change', e => {
    state.legendPosition = e.target.value;  // rewrites the options block
    renderCode();
    flash('options');
    updateChart();
  });
  document.getElementById('responsiveCheck').addEventListener('change', e => {
    state.responsive = e.target.checked;    // rewrites the options block
    renderCode();
    flash('options');
    rebuildChart();
    setCaption(state.responsive
      ? '<code>responsive: true</code>: the canvas fills its panel and follows the window width.'
      : '<code>responsive: false</code>: the canvas keeps its own fixed 300 by 200 size, whatever the panel width.');
  });
  document.getElementById('addButton').addEventListener('click', () => {
    if (state.datasets.length > 1) {
      state.datasets.pop();
    } else {
      state.datasets.push(copyDataset(DATASET_B));   // a second dataset with its own label and colors
    }
    syncControls();
    renderCode();
    flash('data');
    updateChart();
  });
  document.getElementById('breakButton').addEventListener('click', () => {
    state.broken = !state.broken;
    state.labels = state.broken ? DEFAULT_LABELS.slice(0, 4) : DEFAULT_LABELS.slice();
    syncControls();
    renderCode();
    flash('data');
    updateChart();
    setCaption(defaultCaption(), state.broken);
  });
  document.getElementById('resetButton').addEventListener('click', () => {
    state = freshState();
    syncControls();
    renderCode();
    rebuildChart();
    setCaption(defaultCaption());
  });
  document.querySelectorAll('.block').forEach(b => {
    b.addEventListener('mouseenter', () => setHighlight(b.dataset.part));
    b.addEventListener('mouseleave', () => setHighlight(null));
    b.addEventListener('focus', () => setHighlight(b.dataset.part));
    b.addEventListener('blur', () => setHighlight(null));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  Chart.defaults.font.size = 14;     // readable ticks, legend and tooltips
  state = freshState();
  wireControls();
  syncControls();
  renderCode();
  rebuildChart();
  setCaption(defaultCaption());
});
