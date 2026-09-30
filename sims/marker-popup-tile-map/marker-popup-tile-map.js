// Marker, Popup and Tile Source Map - Leaflet 1.9.4
// CANVAS_HEIGHT: 580
// Learning objective (Analyze / distinguish): the learner distinguishes the roles of the
// marker, the popup and the tile source by changing each one independently and observing
// the result.
//   - tile source: the background images and their attribution (layer control, top left)
//   - marker: one [latitude, longitude] pair (Swap lat/lng moves one marker)
//   - popup: the text bound to a marker (click a marker)
// Data: data.json (seven Minneapolis landmarks in two categories).

// ---------- Tile sources (URL templates with {z}/{x}/{y} placeholders) ----------
const TILE_SOURCES = [
    {
        name: 'OpenStreetMap',
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        options: { maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }
    },
    {
        name: 'OpenTopoMap (terrain)',
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        options: { maxZoom: 17,
            attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)' }
    },
    {
        name: 'Esri World Imagery (satellite)',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        options: { maxZoom: 19,
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community' }
    }
];
const NEUTRAL = '#555555';

let map, info, data;
let markers = [];              // {rec, marker}
let showCategory = false;
let swapped = false;
let selected = null;           // record of the last clicked marker
let popupOpen = false;
let currentTiles = TILE_SOURCES[0].name;

// ---------- helpers ----------
function colorFor(rec) {
    return showCategory ? data.categories[rec.category].color : NEUTRAL;
}

function pinIcon(color, isSwapped) {
    return L.divIcon({
        className: 'pin-icon',
        html: '<div class="pin' + (isSwapped ? ' swapped' : '') + '" style="background:' + color + '"></div>',
        iconSize: [22, 22],
        iconAnchor: [11, 27],        // the pin's tip sits on the coordinate
        popupAnchor: [0, -26]
    });
}

const LABEL_OFFSET = { top: [0, -26], bottom: [0, 2], left: [-12, -14], right: [12, -14] };

function setCaption(html, warn) {
    const c = document.getElementById('caption');
    c.innerHTML = html;
    c.className = warn ? 'warn' : '';
}

function fmt(v) { return v.toFixed(4); }

// ---------- info panel (top-right control) ----------
function updateInfo() {
    let html = selected ? '<h4>' + selected.name + '</h4>' : '';
    if (selected) {
        const m = markers.find(x => x.rec === selected).marker.getLatLng();
        html += '<div>Category: <span class="cat" style="color:' + data.categories[selected.category].color + '">' +
            selected.category + '</span></div>' +
            '<div class="role"><b>Marker</b> [' + fmt(m.lat) + ', ' + fmt(m.lng) + ']</div>' +
            '<div class="role"><b>Popup</b> ' + (popupOpen ? 'open: title + description' : 'closed') + '</div>';
    } else {
        html += '<div><b>Click a marker</b> to open its popup.</div>';
    }
    html += '<div class="role"><b>Tiles</b> ' + currentTiles + '</div>';
    info._div.innerHTML = html;
}

// ---------- markers ----------
function buildMarkers() {
    data.markers.forEach(rec => {
        const marker = L.marker([rec.lat, rec.lng], {
            icon: pinIcon(colorFor(rec), false),
            title: rec.name,
            alt: rec.name + ' (' + rec.category + ')',
            keyboard: true
        });
        marker.bindPopup('<div class="popup-title">' + rec.name + '</div><div>' + rec.description + '</div>');
        const dir = rec.labelDirection || 'right';
        marker.bindTooltip(rec.name, {
            permanent: true, direction: dir, offset: LABEL_OFFSET[dir], className: 'place-label'
        });
        marker.on('click', () => {
            selected = rec;
            updateInfo();
            setCaption('<b>Popup:</b> the bubble over <i>' + rec.name + '</i> is text bound to this one marker with ' +
                '<code>bindPopup()</code>. The info panel at the top right is a separate control; it repeats the ' +
                'category (<b>' + rec.category + '</b>). The marker and the tiles did not change.');
        });
        marker.on('popupopen', () => { popupOpen = true; updateInfo(); });
        marker.on('popupclose', () => { popupOpen = false; updateInfo(); });
        marker.addTo(map);
        markers.push({ rec, marker });
    });
}

function restyleMarkers() {
    markers.forEach(({ rec, marker }) => {
        const c = colorFor(rec);
        const isSwapped = swapped && rec.name === data.swapMarker;
        marker.setIcon(pinIcon(c, isSwapped));
        const el = marker.getTooltip() && marker.getTooltip().getElement();
        if (el) {
            el.style.color = showCategory ? c : '#222';
            el.style.borderColor = showCategory ? c : '#777';
        }
    });
    const legend = document.getElementById('legend');
    legend.className = 'legend' + (showCategory ? '' : ' off');
    legend.innerHTML = Object.entries(data.categories).map(([name, v]) =>
        '<span><i style="background:' + (showCategory ? v.color : '#bbb') + '"></i>' + name + '</span>').join('');
}

function fitMarkers() {
    const pts = markers.map(m => m.marker.getLatLng());
    const wide = map.getSize().x >= 600;
    // keep pins and their labels clear of the info panel (top right) and the layer control (bottom left)
    map.fitBounds(L.latLngBounds(pts), {
        paddingTopLeft: [wide ? 30 : 20, 60],
        paddingBottomRight: [wide ? 240 : 20, wide ? 30 : 20],
        maxZoom: 13
    });
}

// ---------- the swap experiment ----------
function toggleSwap() {
    const entry = markers.find(m => m.rec.name === data.swapMarker);
    const rec = entry.rec;
    swapped = !swapped;
    if (swapped) {
        entry.marker.setLatLng([rec.lng, rec.lat]);           // longitude given where latitude belongs
        document.getElementById('swapBtn').textContent = 'Restore lat/lng';
        setCaption('<b>Swapped:</b> ' + rec.name + ' was entered as <code>[' + rec.lng + ', ' + rec.lat + ']</code>. ' +
            'Leaflet reads <code>[latitude, longitude]</code>, so ' + rec.lng + ' became a latitude beyond the South Pole ' +
            'and ' + rec.lat + ' a longitude east of Greenwich: the pin lands at the bottom edge of the world, south of Africa. ' +
            'Only the marker moved.', true);
    } else {
        entry.marker.setLatLng([rec.lat, rec.lng]);
        document.getElementById('swapBtn').textContent = 'Swap lat/lng';
        setCaption('<b>Restored:</b> latitude first, then longitude: <code>[' + rec.lat + ', ' + rec.lng + ']</code> ' +
            'puts ' + rec.name + ' back on the Mississippi riverfront.');
    }
    restyleMarkers();
    if (selected === rec) updateInfo();
    fitMarkers();
}

// ---------- setup ----------
function init(json) {
    data = json;
    map = L.map('map', {
        scrollWheelZoom: false            // avoid iframe scroll hijacking; use the +/- buttons
    }).setView(data.config.center, data.config.zoom);

    const baseMaps = {};
    TILE_SOURCES.forEach((t, i) => {
        const layer = L.tileLayer(t.url, t.options);
        baseMaps[t.name] = layer;
        if (i === 0) layer.addTo(map);
    });
    L.control.scale({ position: 'bottomleft', imperial: true }).addTo(map);
    // expanded on wide screens; a compact layers button on narrow ones
    const narrow = map.getSize().x < 600;
    L.control.layers(baseMaps, null, { collapsed: narrow, position: 'bottomleft' }).addTo(map);

    info = L.control({ position: 'topright' });
    info.onAdd = function () {
        this._div = L.DomUtil.create('div', 'info');
        return this._div;
    };
    info.addTo(map);

    map.on('baselayerchange', e => {
        currentTiles = e.name;
        updateInfo();
        setCaption('<b>Tile source:</b> the background is now <i>' + e.name + '</i>. Look at the attribution line at the ' +
            'bottom of the map: it changed with the source, because the credit belongs to the tiles. The markers and ' +
            'their popups did not move or change.');
    });

    buildMarkers();
    restyleMarkers();
    fitMarkers();
    updateInfo();
    setCaption('Three layers, three jobs: the <b>tile source</b> draws the background, each <b>marker</b> pins one ' +
        '[latitude, longitude] pair, and each <b>popup</b> holds that marker\'s text. Change one at a time and ' +
        'watch the other two stay the same.');

    document.getElementById('categoryToggle').addEventListener('change', e => {
        showCategory = e.target.checked;
        restyleMarkers();
        setCaption(showCategory
            ? '<b>Show category:</b> the pins and labels are recolored from each record\'s <code>category</code> field ' +
              '(Museum or Park). Same markers, same places, same popups: only their styling changed.'
            : 'Category colors off: every marker uses the same neutral color again.');
    });
    document.getElementById('swapBtn').addEventListener('click', toggleSwap);
    document.getElementById('fitBtn').addEventListener('click', fitMarkers);

    // fill the container width and refresh the map size when the window changes
    window.addEventListener('resize', () => map.invalidateSize());
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
