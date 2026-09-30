// Choropleth Threshold Lab - Leaflet 1.9.4 with L.geoJSON and a slider-driven getColor()
// CANVAS_HEIGHT: 700
// Learning objective (Evaluate / judge): the learner judges whether a set of color thresholds
// reveals or hides a geographic pattern in a dataset.
//
// Data: data.json holds one PLACEHOLDER value per US state (not real statistics), built with
// two patterns: a south-to-north gradient, and a Great Lakes cluster (77-86) that rises from
// west to east. Boundaries: the map template's public us-states.json GeoJSON (fetched at load).
// Colors: the template's five classes; four thresholds t1 < t2 < t3 < t4 separate them.

let map, geojsonLayer, info, data;
let thresholds = [20, 40, 60, 80];        // template thresholds
let showValues = true;
let hovered = null;
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

// ---------- the threshold function ----------
function classOf(v) {                       // 1 (lowest) .. 5 (highest)
    if (v > thresholds[3]) return 5;
    if (v > thresholds[2]) return 4;
    if (v > thresholds[1]) return 3;
    if (v > thresholds[0]) return 2;
    return 1;
}

function getColor(v) {
    return data.colorScale[classOf(v) - 1];
}

function classRange(c) {
    const t = thresholds;
    return ['≤ ' + t[0], t[0] + '–' + t[1], t[1] + '–' + t[2], t[2] + '–' + t[3], '> ' + t[3]][c - 1];
}

function valueOf(name) {
    const f = data.features[name];
    return f ? f.value : null;
}

// ---------- styling ----------
function styleFeature(feature) {
    const v = valueOf(feature.properties.name);
    return {
        fillColor: v === null ? '#cccccc' : getColor(v),
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.85
    };
}

function recolor() {
    if (geojsonLayer) geojsonLayer.setStyle(styleFeature);
    if (hovered) highlight(hovered);
    renderLegend();
    info.update(hovered ? hovered.feature.properties.name : null);
    document.getElementById('feedback').innerHTML = '';
}

function highlight(layer) {
    layer.setStyle({ weight: 3, color: '#222', fillOpacity: 0.95 });
    layer.bringToFront();
}

// ---------- legend with a count per class ----------
function renderLegend() {
    const counts = [0, 0, 0, 0, 0];
    Object.values(data.features).forEach(f => { counts[classOf(f.value) - 1]++; });
    document.getElementById('legend').innerHTML = counts.map((n, i) =>
        '<span class="lg"><i style="background:' + data.colorScale[i] + '"></i>' + classRange(i + 1) +
        ' <span class="n">(' + n + ' region' + (n === 1 ? '' : 's') + ')</span></span>').join('');
}

// ---------- sliders kept in increasing order ----------
function buildSliders() {
    const box = document.getElementById('sliders');
    box.innerHTML = '';
    thresholds.forEach((t, i) => {
        const row = document.createElement('div');
        row.className = 'slider-row';
        row.innerHTML = '<span class="name" id="tl' + i + '">Threshold ' + (i + 1) + ': ' + t + '</span>' +
            '<input type="range" min="0" max="100" step="1" value="' + t + '" id="ts' + i + '" aria-label="Threshold ' + (i + 1) + '">';
        box.appendChild(row);
        row.querySelector('input').addEventListener('input', e => onSlider(i, parseInt(e.target.value, 10)));
    });
}

function onSlider(i, v) {
    // keep t1 < t2 < t3 < t4: a slider cannot pass its neighbors
    const lo = i > 0 ? thresholds[i - 1] + 1 : 0;
    const hi = i < 3 ? thresholds[i + 1] - 1 : 100;
    v = Math.max(lo, Math.min(hi, v));
    thresholds[i] = v;
    document.getElementById('ts' + i).value = v;
    document.getElementById('presetSelect').value = 'Custom';
    syncSliderLabels();
    recolor();
}

function syncSliderLabels() {
    thresholds.forEach((t, i) => {
        document.getElementById('ts' + i).value = t;
        document.getElementById('tl' + i).textContent = 'Threshold ' + (i + 1) + ': ' + t;
    });
}

function applyPreset(name) {
    if (name === 'Equal intervals') {
        const vals = Object.values(data.features).map(f => f.value);
        const lo = Math.min(...vals), hi = Math.max(...vals);
        thresholds = [1, 2, 3, 4].map(k => Math.round(lo + k * (hi - lo) / 5));
    } else if (Array.isArray(data.presets[name])) {
        thresholds = data.presets[name].slice();
    }
    syncSliderLabels();
    recolor();
}

// ---------- pattern check for the learner's judgment ----------
function patternStatus() {
    const cluster = data.clusterRegions;
    const rest = Object.keys(data.features).filter(n => !cluster.includes(n));
    const restClasses = new Set(rest.map(n => classOf(valueOf(n))));
    const clusterClasses = new Set(cluster.map(n => classOf(valueOf(n))));
    return {
        gradient: restClasses.size >= 3 ? 'revealed' : 'hidden',
        gradientN: restClasses.size,
        restCount: rest.length,
        cluster: clusterClasses.size >= 3 ? 'revealed' : 'hidden',
        clusterN: clusterClasses.size
    };
}

function checkJudgment() {
    const g = document.getElementById('judgeGradient').value;
    const c = document.getElementById('judgeCluster').value;
    const fb = document.getElementById('feedback');
    if (!g || !c) {
        fb.innerHTML = 'Choose <b>revealed</b> or <b>hidden</b> for both patterns first.';
        return;
    }
    const s = patternStatus();
    const line = (label, said, actual, why) =>
        '<div><span class="' + (said === actual ? 'ok">\u2713 ' + label + ': ' + actual + '.'
            : 'no">\u2717 ' + label + ': ' + actual + ', not ' + said + '.') + '</span> ' + why + '</div>';
    fb.innerHTML =
        line('Gradient', g, s.gradient, 'The ' + s.restCount + ' regions outside the cluster use ' + s.gradientN +
            ' class' + (s.gradientN === 1 ? '' : 'es') + (s.gradient === 'hidden' ? ': too few for a south-north rise.' : ': the south-north rise shows.')) +
        line('Great Lakes trend', c, s.cluster, 'The 7 cluster states (77\u201386) use ' + s.clusterN + ' class' +
            (s.clusterN === 1 ? '' : 'es') + (s.cluster === 'hidden' ? ': the west-east rise is invisible.' : ': the west-east rise shows.'));
}

// ---------- map ----------
function initMap(geo) {
    map = L.map('map', {
        scrollWheelZoom: false             // no scroll hijacking inside the chapter page
    });
    L.tileLayer(TILE_URL, {
        maxZoom: 12,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    fitStart();

    info = L.control({ position: 'topright' });
    info.onAdd = function () {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };
    info.update = function (name) {
        if (!name) {
            this._div.innerHTML = '<h4>Hover over a state</h4>Click to zoom in.';
            return;
        }
        const v = valueOf(name);
        if (v === null) { this._div.innerHTML = '<h4>' + name + '</h4>No value'; return; }
        const c = classOf(v);
        this._div.innerHTML = '<h4>' + name + '</h4>' +
            (showValues ? 'Value: <b>' + v + '</b> (placeholder)<br>' : '') +
            '<span class="swatch" style="background:' + getColor(v) + '"></span>Class ' + c + ' of 5: ' + classRange(c);
    };
    info.addTo(map);

    geojsonLayer = L.geoJSON(geo, {
        style: styleFeature,
        onEachFeature: (feature, layer) => {
            layer.on({
                mouseover: e => { hovered = e.target; highlight(e.target); info.update(feature.properties.name); },
                mouseout: e => { geojsonLayer.resetStyle(e.target); hovered = null; info.update(); },
                click: e => map.fitBounds(e.target.getBounds(), { padding: [20, 20] })
            });
        }
    }).addTo(map);
}

function fitStart() {
    map.fitBounds(data.config.bounds, { padding: [4, 4] });
}

function init(json) {
    data = json;
    buildSliders();
    renderLegendPlaceholder();
    fetch(data.config.geoJsonUrl)
        .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(geo => {
            initMap(geo);
            recolor();
        })
        .catch(err => {
            document.getElementById('map').innerHTML = '<div style="padding:20px;color:#b91c1c">Could not load the ' +
                'state boundaries (' + err.message + '). The map needs a network connection.</div>';
        });

    document.getElementById('presetSelect').addEventListener('change', e => applyPreset(e.target.value));
    document.getElementById('valuesToggle').addEventListener('change', e => {
        showValues = e.target.checked;
        if (info) info.update(hovered ? hovered.feature.properties.name : null);
    });
    document.getElementById('resetViewBtn').addEventListener('click', () => map && fitStart());
    document.getElementById('checkBtn').addEventListener('click', checkJudgment);
    ['judgeGradient', 'judgeCluster'].forEach(id =>
        document.getElementById(id).addEventListener('change', () => { document.getElementById('feedback').innerHTML = ''; }));

    // the map and legend follow the container width
    window.addEventListener('resize', () => { if (map) { map.invalidateSize(); } });
}

function renderLegendPlaceholder() {
    document.getElementById('legend').textContent = 'Loading boundaries…';
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(init)
        .catch(err => {
            document.getElementById('map').innerHTML = '<div style="padding:20px;color:#b91c1c">Could not load data.json (' +
                err.message + '). Open this page through a web server, for example <code>mkdocs serve</code>.</div>';
        });
});
