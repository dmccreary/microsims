// Global Impact MicroSim - Interactive World Map Visualization
// Shows the spread of MicroSims and educational resources worldwide

// ============================================
// DATA DEFINITIONS
// ============================================

// Main library hubs (central nodes)
const libraryHubs = [
    {
        id: 'minneapolis',
        name: 'Minneapolis MicroSim Library',
        lat: 44.9778,
        lng: -93.2650,
        type: 'library',
        description: 'Central hub for MicroSim development and distribution',
        sims: ['Bouncing Ball', 'Pendulum Wave', 'Fourier Transform', 'Neural Network'],
        stats: { sims: 45, books: 12, teachers: 150, students: 5000 }
    },
    {
        id: 'cmu',
        name: 'CMU Pittsburgh Library',
        lat: 40.4433,
        lng: -79.9436,
        type: 'library',
        description: 'Carnegie Mellon University - AI and CS education focus',
        sims: ['Machine Learning Viz', 'Algorithm Animator', 'Data Structures'],
        stats: { sims: 38, books: 8, teachers: 120, students: 3500 }
    },
    {
        id: 'cairo',
        name: 'Cairo MicroSim Library',
        lat: 30.0444,
        lng: 31.2357,
        type: 'library',
        description: 'Regional hub for Middle East and Africa',
        sims: ['Arabic Math', 'Physics Demos', 'Chemistry Lab'],
        stats: { sims: 25, books: 6, teachers: 80, students: 2000 }
    }
];

// Educational nodes around the world (teachers, schools, students)
const educationalNodes = [
    // North America
    { id: 'n1', lat: 42.3601, lng: -71.0589, type: 'school', name: 'Boston STEM Academy', region: 'North America' },
    { id: 'n2', lat: 34.0522, lng: -118.2437, type: 'teacher', name: 'LA Tech Educator', region: 'North America' },
    { id: 'n3', lat: 37.7749, lng: -122.4194, type: 'student', name: 'SF Student Hub', region: 'North America' },
    { id: 'n4', lat: 41.8781, lng: -87.6298, type: 'school', name: 'Chicago Learning Center', region: 'North America' },
    { id: 'n5', lat: 29.7604, lng: -95.3698, type: 'teacher', name: 'Houston Educator Network', region: 'North America' },
    { id: 'n6', lat: 47.6062, lng: -122.3321, type: 'student', name: 'Seattle Code Club', region: 'North America' },
    { id: 'n7', lat: 43.6532, lng: -79.3832, type: 'school', name: 'Toronto Tech School', region: 'North America' },
    { id: 'n8', lat: 19.4326, lng: -99.1332, type: 'teacher', name: 'Mexico City STEM', region: 'North America' },

    // Europe
    { id: 'e1', lat: 51.5074, lng: -0.1278, type: 'school', name: 'London Digital Academy', region: 'Europe' },
    { id: 'e2', lat: 48.8566, lng: 2.3522, type: 'teacher', name: 'Paris EdTech Collective', region: 'Europe' },
    { id: 'e3', lat: 52.5200, lng: 13.4050, type: 'student', name: 'Berlin Coding Youth', region: 'Europe' },
    { id: 'e4', lat: 41.9028, lng: 12.4964, type: 'school', name: 'Rome STEM Initiative', region: 'Europe' },
    { id: 'e5', lat: 55.7558, lng: 37.6173, type: 'teacher', name: 'Moscow Science Teachers', region: 'Europe' },
    { id: 'e6', lat: 59.3293, lng: 18.0686, type: 'student', name: 'Stockholm Student Network', region: 'Europe' },
    { id: 'e7', lat: 50.0755, lng: 14.4378, type: 'school', name: 'Prague Tech Academy', region: 'Europe' },

    // Asia
    { id: 'a1', lat: 35.6762, lng: 139.6503, type: 'school', name: 'Tokyo Digital School', region: 'Asia' },
    { id: 'a2', lat: 22.3193, lng: 114.1694, type: 'teacher', name: 'Hong Kong STEM Hub', region: 'Asia' },
    { id: 'a3', lat: 1.3521, lng: 103.8198, type: 'student', name: 'Singapore Code Academy', region: 'Asia' },
    { id: 'a4', lat: 28.6139, lng: 77.2090, type: 'school', name: 'Delhi Innovation School', region: 'Asia' },
    { id: 'a5', lat: 19.0760, lng: 72.8777, type: 'teacher', name: 'Mumbai EdTech Teachers', region: 'Asia' },
    { id: 'a6', lat: 13.0827, lng: 80.2707, type: 'student', name: 'Chennai Student Coders', region: 'Asia' },
    { id: 'a7', lat: 31.2304, lng: 121.4737, type: 'school', name: 'Shanghai STEM Center', region: 'Asia' },
    { id: 'a8', lat: 37.5665, lng: 126.9780, type: 'teacher', name: 'Seoul Tech Educators', region: 'Asia' },

    // Rural/Remote locations (Afghanistan, Africa, India rural)
    { id: 'r1', lat: 34.5553, lng: 69.2075, type: 'school', name: 'Kabul Girls Tech School', region: 'Afghanistan' },
    { id: 'r2', lat: 33.9391, lng: 67.7100, type: 'student', name: 'Ghazni Rural Students', region: 'Afghanistan' },
    { id: 'r3', lat: -1.2921, lng: 36.8219, type: 'school', name: 'Nairobi Innovation Hub', region: 'Africa' },
    { id: 'r4', lat: 6.5244, lng: 3.3792, type: 'teacher', name: 'Lagos STEM Teachers', region: 'Africa' },
    { id: 'r5', lat: -26.2041, lng: 28.0473, type: 'student', name: 'Johannesburg Code Club', region: 'Africa' },
    { id: 'r6', lat: 9.1450, lng: 40.4897, type: 'school', name: 'Ethiopia Rural School', region: 'Africa' },
    { id: 'r7', lat: -6.7924, lng: 39.2083, type: 'teacher', name: 'Dar es Salaam Educators', region: 'Africa' },
    { id: 'r8', lat: 26.9124, lng: 75.7873, type: 'student', name: 'Jaipur Village Students', region: 'India' },
    { id: 'r9', lat: 23.2599, lng: 77.4126, type: 'school', name: 'Bhopal Rural Initiative', region: 'India' },
    { id: 'r10', lat: 15.3173, lng: 75.7139, type: 'teacher', name: 'Karnataka Village Teachers', region: 'India' },

    // South America
    { id: 's1', lat: -23.5505, lng: -46.6333, type: 'school', name: 'Sao Paulo Tech School', region: 'South America' },
    { id: 's2', lat: -34.6037, lng: -58.3816, type: 'teacher', name: 'Buenos Aires Educators', region: 'South America' },
    { id: 's3', lat: -12.0464, lng: -77.0428, type: 'student', name: 'Lima Student Network', region: 'South America' },
    { id: 's4', lat: 4.7110, lng: -74.0721, type: 'school', name: 'Bogota Innovation Center', region: 'South America' },

    // Australia/Oceania
    { id: 'o1', lat: -33.8688, lng: 151.2093, type: 'school', name: 'Sydney STEM Academy', region: 'Oceania' },
    { id: 'o2', lat: -37.8136, lng: 144.9631, type: 'teacher', name: 'Melbourne EdTech Hub', region: 'Oceania' },
    { id: 'o3', lat: -41.2865, lng: 174.7762, type: 'student', name: 'Wellington Code Club', region: 'Oceania' }
];

// MicroSim creator nodes (contributing to libraries)
const creatorNodes = [
    { id: 'c1', lat: 42.3736, lng: -72.5199, type: 'microsim', name: 'UMass Amherst Creator', targetLibrary: 'minneapolis' },
    { id: 'c2', lat: 38.0293, lng: -78.4767, type: 'book', name: 'UVA Textbook Author', targetLibrary: 'minneapolis' },
    { id: 'c3', lat: 51.7520, lng: -1.2577, type: 'microsim', name: 'Oxford Physics Sims', targetLibrary: 'cmu' },
    { id: 'c4', lat: 52.2053, lng: 0.1218, type: 'book', name: 'Cambridge Math Books', targetLibrary: 'cmu' },
    { id: 'c5', lat: 31.7683, lng: 35.2137, type: 'microsim', name: 'Jerusalem Ed Sims', targetLibrary: 'cairo' },
    { id: 'c6', lat: 36.8065, lng: 10.1815, type: 'book', name: 'Tunis Science Books', targetLibrary: 'cairo' },
    { id: 'c7', lat: 45.4642, lng: 9.1900, type: 'microsim', name: 'Milan STEM Creator', targetLibrary: 'cmu' },
    { id: 'c8', lat: 48.1351, lng: 11.5820, type: 'book', name: 'Munich Tech Books', targetLibrary: 'minneapolis' }
];

// ============================================
// GLOBAL VARIABLES
// ============================================

let map;
let markersLayer;
let connectionsLayer;
let isPlaying = false;
let currentTime = 0;
let animationInterval;
let allConnections = [];
let visibleConnections = [];
let markers = {};

// Statistics
let stats = {
    sims: 0,
    connections: 0,
    countries: 0
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initMap();
    initMarkers();
    initConnections();
    initControls();
    initCallouts();
    updateVisualization(0);
});

function initMap() {
    // Create map centered on Atlantic for global view
    map = L.map('map', {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 8,
        worldCopyJump: true,
        zoomControl: true
    });

    // Dark theme map tiles with visible continent outlines
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
        maxZoom: 16
    }).addTo(map);

    // Update SVG overlay position on map move
    map.on('move', updateConnectionPositions);
    map.on('zoom', updateConnectionPositions);
    map.on('resize', updateConnectionPositions);
}

function initMarkers() {
    markersLayer = L.layerGroup().addTo(map);

    // Add library hubs
    libraryHubs.forEach(hub => {
        const marker = createMarker(hub);
        markers[hub.id] = { data: hub, marker: marker, layer: marker };
    });

    // Add educational nodes
    educationalNodes.forEach(node => {
        const marker = createMarker(node);
        markers[node.id] = { data: node, marker: marker, layer: marker };
    });

    // Add creator nodes
    creatorNodes.forEach(node => {
        const marker = createMarker(node);
        markers[node.id] = { data: node, marker: marker, layer: marker };
    });
}

function createMarker(data) {
    const iconHtml = getIconHtml(data.type);
    const icon = L.divIcon({
        html: iconHtml,
        className: 'custom-marker-container',
        iconSize: [getMarkerSize(data.type), getMarkerSize(data.type)],
        iconAnchor: [getMarkerSize(data.type) / 2, getMarkerSize(data.type) / 2]
    });

    const marker = L.marker([data.lat, data.lng], { icon: icon })
        .bindPopup(createPopupContent(data))
        .on('mouseover', () => showHoverInfo(data))
        .on('mouseout', hideHoverInfo)
        .on('click', () => showDetailedInfo(data));

    return marker;
}

function getIconHtml(type) {
    const icons = {
        microsim: '<div class="custom-marker marker-microsim marker-active"></div>',
        book: '<div class="custom-marker marker-book">i</div>',
        library: '<div class="custom-marker marker-library"></div>',
        teacher: '<div class="custom-marker marker-teacher"></div>',
        school: '<div class="custom-marker marker-school"></div>',
        student: '<div class="custom-marker marker-student"></div>'
    };
    return icons[type] || icons.microsim;
}

function getMarkerSize(type) {
    const sizes = {
        library: 36,
        school: 28,
        book: 26,
        microsim: 24,
        teacher: 22,
        student: 18
    };
    return sizes[type] || 24;
}

function createPopupContent(data) {
    let content = `<div style="color: #333;"><strong>${data.name}</strong>`;
    if (data.description) {
        content += `<br><small>${data.description}</small>`;
    }
    if (data.region) {
        content += `<br><em>Region: ${data.region}</em>`;
    }
    if (data.sims) {
        content += `<br><strong>Example MicroSims:</strong><br>${data.sims.join(', ')}`;
    }
    content += '</div>';
    return content;
}

// ============================================
// CONNECTIONS
// ============================================

function initConnections() {
    connectionsLayer = document.getElementById('connections-layer');

    // Generate all possible connections
    generateConnections();

    // Initially hide all
    allConnections.forEach(conn => {
        conn.element.classList.remove('visible');
    });
}

function generateConnections() {
    // Creator to Library connections (microsim-to-library, book-to-library)
    creatorNodes.forEach(creator => {
        const targetHub = libraryHubs.find(h => h.id === creator.targetLibrary);
        if (targetHub) {
            const connType = creator.type === 'microsim' ? 'microsim-to-library' : 'book-to-library';
            createConnection(creator, targetHub, connType, Math.random() * 30);
        }
    });

    // Library to Educational nodes (library-to-student)
    libraryHubs.forEach(hub => {
        educationalNodes.forEach(node => {
            // Connect each library to nearby nodes based on distance
            const distance = getDistance(hub.lat, hub.lng, node.lat, node.lng);
            if (distance < 8000) { // Within 8000km
                createConnection(hub, node, 'library-to-student', 30 + Math.random() * 40);
            }
        });
    });

    // Peer sharing between educational nodes
    for (let i = 0; i < educationalNodes.length; i++) {
        for (let j = i + 1; j < educationalNodes.length; j++) {
            const nodeA = educationalNodes[i];
            const nodeB = educationalNodes[j];
            const distance = getDistance(nodeA.lat, nodeA.lng, nodeB.lat, nodeB.lng);
            if (distance < 3000) { // Nearby nodes share
                createConnection(nodeA, nodeB, 'peer-sharing', 50 + Math.random() * 50);
            }
        }
    }
}

function createConnection(from, to, type, appearTime) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.classList.add('connection-path', type);

    const connection = {
        from: from,
        to: to,
        type: type,
        appearTime: appearTime,
        element: path
    };

    allConnections.push(connection);
    connectionsLayer.appendChild(path);
}

function updateConnectionPositions() {
    allConnections.forEach(conn => {
        const fromPoint = map.latLngToContainerPoint([conn.from.lat, conn.from.lng]);
        const toPoint = map.latLngToContainerPoint([conn.to.lat, conn.to.lng]);

        const d = createCurvedPath(fromPoint.x, fromPoint.y, toPoint.x, toPoint.y);
        conn.element.setAttribute('d', d);

        // Set dash array for animation
        const pathLength = conn.element.getTotalLength ? conn.element.getTotalLength() : 300;
        conn.element.style.strokeDasharray = pathLength;
        conn.element.style.strokeDashoffset = pathLength;
    });
}

function createCurvedPath(x1, y1, x2, y2) {
    // Calculate control point for quadratic curve
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Curve outward perpendicular to the line
    const curveAmount = Math.min(distance * 0.3, 100);
    const perpX = -dy / distance * curveAmount;
    const perpY = dx / distance * curveAmount;

    const cpX = midX + perpX;
    const cpY = midY + perpY;

    return `M ${x1} ${y1} Q ${cpX} ${cpY} ${x2} ${y2}`;
}

function getDistance(lat1, lng1, lat2, lng2) {
    // Haversine formula for distance in km
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// ============================================
// CONTROLS
// ============================================

function initControls() {
    const playPauseBtn = document.getElementById('play-pause-btn');
    const timeSlider = document.getElementById('time-slider');

    playPauseBtn.addEventListener('click', togglePlayPause);
    timeSlider.addEventListener('input', handleSliderChange);
}

function togglePlayPause() {
    isPlaying = !isPlaying;

    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');

    if (isPlaying) {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
        startAnimation();
    } else {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        stopAnimation();
    }
}

function startAnimation() {
    if (animationInterval) clearInterval(animationInterval);

    animationInterval = setInterval(() => {
        currentTime += 0.5;
        if (currentTime > 100) {
            currentTime = 100;
            stopAnimation();
            isPlaying = false;
            document.getElementById('play-icon').classList.remove('hidden');
            document.getElementById('pause-icon').classList.add('hidden');
        }

        document.getElementById('time-slider').value = currentTime;
        updateVisualization(currentTime);
    }, 100);
}

function stopAnimation() {
    if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
    }
}

function handleSliderChange(e) {
    currentTime = parseFloat(e.target.value);
    updateVisualization(currentTime);
}

// ============================================
// VISUALIZATION UPDATE
// ============================================

function updateVisualization(time) {
    updateConnectionPositions();
    updateVisibleConnections(time);
    updateMarkerVisibility(time);
    updateStatistics(time);
    updateTimeLabel(time);
    updateCallouts(time);
}

function updateVisibleConnections(time) {
    let visibleCount = 0;

    allConnections.forEach(conn => {
        if (time >= conn.appearTime) {
            conn.element.classList.add('visible');
            if (!conn.animated) {
                conn.animated = true;
                conn.element.classList.add('animating');
            }
            visibleCount++;
        } else {
            conn.element.classList.remove('visible', 'animating');
            conn.animated = false;
        }
    });

    stats.connections = visibleCount;
}

function updateMarkerVisibility(time) {
    // Libraries are always visible
    libraryHubs.forEach(hub => {
        if (markers[hub.id]) {
            if (!map.hasLayer(markers[hub.id].layer)) {
                markers[hub.id].layer.addTo(map);
            }
        }
    });

    // Creator nodes appear early
    creatorNodes.forEach((node, index) => {
        const appearTime = index * 3;
        if (markers[node.id]) {
            if (time >= appearTime) {
                if (!map.hasLayer(markers[node.id].layer)) {
                    markers[node.id].layer.addTo(map);
                }
            } else {
                if (map.hasLayer(markers[node.id].layer)) {
                    map.removeLayer(markers[node.id].layer);
                }
            }
        }
    });

    // Educational nodes appear progressively
    educationalNodes.forEach((node, index) => {
        const appearTime = 20 + index * 1.5;
        if (markers[node.id]) {
            if (time >= appearTime) {
                if (!map.hasLayer(markers[node.id].layer)) {
                    markers[node.id].layer.addTo(map);
                }
            } else {
                if (map.hasLayer(markers[node.id].layer)) {
                    map.removeLayer(markers[node.id].layer);
                }
            }
        }
    });
}

function updateStatistics(time) {
    // Calculate stats based on time
    const maxSims = 150;
    const maxCountries = 45;

    stats.sims = Math.floor(maxSims * Math.pow(time / 100, 1.5));
    stats.countries = Math.floor(maxCountries * Math.min(1, time / 80));

    // Update DOM
    document.getElementById('sim-count').textContent = stats.sims;
    document.getElementById('connection-count').textContent = stats.connections;
    document.getElementById('country-count').textContent = stats.countries;
    document.getElementById('dynamic-count').textContent = stats.sims;
}

function updateTimeLabel(time) {
    const year = Math.floor(time / 20) + 1;
    document.getElementById('time-label').textContent = `Year ${year}`;
}

function updateCallouts(time) {
    const callouts = [
        { id: 'callout1', appearTime: 10 },
        { id: 'callout2', appearTime: 30 },
        { id: 'callout3', appearTime: 50 },
        { id: 'callout4', appearTime: 70 }
    ];

    callouts.forEach(callout => {
        const element = document.getElementById(callout.id);
        if (time >= callout.appearTime) {
            element.classList.add('visible');
        } else {
            element.classList.remove('visible');
        }
    });
}

function initCallouts() {
    // Callouts start hidden
    document.querySelectorAll('.callout').forEach(el => {
        el.classList.remove('visible');
    });
}

// ============================================
// HOVER AND CLICK INFO
// ============================================

function showHoverInfo(data) {
    const hoverInfo = document.getElementById('hover-info');
    const titleEl = document.getElementById('hover-title');
    const descEl = document.getElementById('hover-description');
    const statsEl = document.getElementById('hover-stats');

    titleEl.textContent = data.name;
    descEl.textContent = data.description || `${data.type.charAt(0).toUpperCase() + data.type.slice(1)} in ${data.region || 'global network'}`;

    if (data.stats) {
        statsEl.innerHTML = `
            <div>MicroSims: ${data.stats.sims}</div>
            <div>Books: ${data.stats.books}</div>
            <div>Teachers: ${data.stats.teachers}</div>
            <div>Students: ${data.stats.students}</div>
        `;
    } else {
        statsEl.innerHTML = '';
    }

    hoverInfo.classList.remove('hidden');
}

function hideHoverInfo() {
    document.getElementById('hover-info').classList.add('hidden');
}

function showDetailedInfo(data) {
    // Show popup on click
    if (markers[data.id]) {
        markers[data.id].marker.openPopup();
    }
}

// ============================================
// RESIZE HANDLING
// ============================================

window.addEventListener('resize', () => {
    updateConnectionPositions();
});
