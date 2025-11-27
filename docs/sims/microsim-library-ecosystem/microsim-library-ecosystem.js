// MicroSim Library Ecosystem - Causal Loop Diagram
// Demonstrates the virtuous cycle of MicroSim creation, sharing, and improvement

// Global variables
let network = null;
let container = null;
let currentStep = 0;
let maxSteps = 5;
let isAnimating = false;
let animationInterval = null;

// Node and edge data arrays
let allNodes = [];
let allEdges = [];
let visibleNodes = new vis.DataSet([]);
let visibleEdges = new vis.DataSet([]);

// Color themes for each cluster
const colors = {
    central: { background: '#FFD700', border: '#DAA520', highlight: '#FFC400', font: '#333' },
    creation: { background: '#4A90D9', border: '#2E6BB0', highlight: '#5BA0E9', font: '#fff' },
    search: { background: '#4CAF50', border: '#388E3C', highlight: '#66BB6A', font: '#fff' },
    usage: { background: '#9C27B0', border: '#7B1FA2', highlight: '#AB47BC', font: '#fff' },
    improvement: { background: '#E91E63', border: '#C2185B', highlight: '#EC407A', font: '#fff' },
    connecting: { color: '#FF9800', highlight: '#FFB74D' }
};

// Font Awesome icons as shapes with labels
const icons = {
    database: '\uf1c0',
    search: '\uf002',
    admin: '\uf007',
    robot: '\uf544',
    teacher: '\uf51c',
    lightbulb: '\uf0eb',
    checkmark: '\uf00c',
    upload: '\uf093',
    file: '\uf15b',
    target: '\uf140',
    magnifier: '\uf002',
    eye: '\uf06e',
    puzzle: '\uf12e',
    student: '\uf501',
    dashboard: '\uf3fd',
    chart: '\uf201',
    wrench: '\uf0ad',
    sparkle: '\uf005',
    star: '\uf005'
};

// Statistics counters
let stats = {
    simulations: 0,
    subjects: 0,
    countries: 0
};
let targetStats = {
    simulations: 1000,
    subjects: 50,
    countries: 100
};

// Define all nodes for each step
function initializeData() {
    // Step 1 - Central Hub (Gold)
    const centralNodes = [
        { id: 'hub', label: 'Global\nMicroSim\nLibraries', x: 0, y: 0, group: 'central',
          font: { size: 16, bold: true }, shape: 'circle', size: 50 },
        { id: 'hub-search', label: 'Faceted\nSearch', x: -80, y: -60, group: 'central',
          shape: 'circle', size: 25 },
        { id: 'hub-admin', label: 'Library\nAdmin', x: 80, y: -60, group: 'central',
          shape: 'circle', size: 25 },
        { id: 'hub-quality', label: 'AI Quality\nRobot', x: 0, y: 90, group: 'central',
          shape: 'circle', size: 25 }
    ];

    const centralEdges = [
        { from: 'hub', to: 'hub-search', color: colors.central.border },
        { from: 'hub', to: 'hub-admin', color: colors.central.border },
        { from: 'hub', to: 'hub-quality', color: colors.central.border }
    ];

    // Step 2 - Creation Cluster (Blue) - Right side
    const creationNodes = [
        { id: 'create-label', label: 'New MicroSim\nCreation', x: 280, y: 0, group: 'creation',
          font: { size: 14, bold: true }, shape: 'circle', size: 35 },
        { id: 'create-teacher', label: 'Teacher\nIdentifies Need', x: 350, y: -80, group: 'creation',
          shape: 'circle', size: 22 },
        { id: 'create-ai', label: 'Design\nwith AI', x: 380, y: 0, group: 'creation',
          shape: 'circle', size: 22 },
        { id: 'create-test', label: 'Test &\nRefine', x: 350, y: 80, group: 'creation',
          shape: 'circle', size: 22 },
        { id: 'create-upload', label: 'Upload\nPackage', x: 250, y: 100, group: 'creation',
          shape: 'circle', size: 22 },
        { id: 'create-metadata', label: 'metadata\n.json', x: 220, y: -80, group: 'creation',
          shape: 'box', size: 18 }
    ];

    const creationEdges = [
        { from: 'create-label', to: 'create-teacher', color: colors.creation.border },
        { from: 'create-label', to: 'create-ai', color: colors.creation.border },
        { from: 'create-label', to: 'create-test', color: colors.creation.border },
        { from: 'create-label', to: 'create-upload', color: colors.creation.border },
        { from: 'create-label', to: 'create-metadata', color: colors.creation.border },
        { from: 'create-teacher', to: 'create-ai', arrows: 'to', color: colors.creation.border, dashes: true },
        { from: 'create-ai', to: 'create-test', arrows: 'to', color: colors.creation.border, dashes: true },
        { from: 'create-test', to: 'create-upload', arrows: 'to', color: colors.creation.border, dashes: true },
        // Connect to hub
        { from: 'create-upload', to: 'hub', arrows: 'to', color: colors.connecting.color, width: 3,
          smooth: { type: 'curvedCW', roundness: 0.2 } }
    ];

    // Step 3 - Search Cluster (Green) - Top
    const searchNodes = [
        { id: 'search-label', label: 'Teacher\nSearch', x: 0, y: -220, group: 'search',
          font: { size: 14, bold: true }, shape: 'circle', size: 35 },
        { id: 'search-objective', label: 'Learning\nObjective', x: -100, y: -280, group: 'search',
          shape: 'circle', size: 22 },
        { id: 'search-find', label: 'Search\nLibrary', x: 0, y: -310, group: 'search',
          shape: 'circle', size: 22 },
        { id: 'search-preview', label: 'Preview\nOptions', x: 100, y: -280, group: 'search',
          shape: 'circle', size: 22 },
        { id: 'search-sort', label: 'Sort by\nPopularity', x: 100, y: -180, group: 'search',
          shape: 'circle', size: 22 },
        { id: 'search-embed', label: 'Embed in\nCourse', x: -100, y: -180, group: 'search',
          shape: 'circle', size: 22 }
    ];

    const searchEdges = [
        { from: 'search-label', to: 'search-objective', color: colors.search.border },
        { from: 'search-label', to: 'search-find', color: colors.search.border },
        { from: 'search-label', to: 'search-preview', color: colors.search.border },
        { from: 'search-label', to: 'search-sort', color: colors.search.border },
        { from: 'search-label', to: 'search-embed', color: colors.search.border },
        { from: 'search-objective', to: 'search-find', arrows: 'to', color: colors.search.border, dashes: true },
        { from: 'search-find', to: 'search-preview', arrows: 'to', color: colors.search.border, dashes: true },
        // Connect to hub
        { from: 'hub', to: 'search-label', arrows: 'to', color: colors.connecting.color, width: 3,
          smooth: { type: 'curvedCW', roundness: 0.2 } }
    ];

    // Step 4 - Usage Statistics Cluster (Purple) - Left
    const usageNodes = [
        { id: 'usage-label', label: 'Field Usage\nStatistics', x: -280, y: 0, group: 'usage',
          font: { size: 14, bold: true }, shape: 'circle', size: 35 },
        { id: 'usage-student', label: 'Student\nUsage', x: -380, y: -60, group: 'usage',
          shape: 'circle', size: 22 },
        { id: 'usage-teacher', label: 'Teacher\nFeedback', x: -380, y: 60, group: 'usage',
          shape: 'circle', size: 22 },
        { id: 'usage-dashboard', label: 'Analytics\nDashboard', x: -320, y: -100, group: 'usage',
          shape: 'circle', size: 22 },
        { id: 'usage-chart', label: 'Effectiveness\nMetrics', x: -320, y: 100, group: 'usage',
          shape: 'circle', size: 22 },
        { id: 'usage-identify', label: 'Identify\nEnhancements', x: -220, y: 80, group: 'usage',
          shape: 'circle', size: 22 }
    ];

    const usageEdges = [
        { from: 'usage-label', to: 'usage-student', color: colors.usage.border },
        { from: 'usage-label', to: 'usage-teacher', color: colors.usage.border },
        { from: 'usage-label', to: 'usage-dashboard', color: colors.usage.border },
        { from: 'usage-label', to: 'usage-chart', color: colors.usage.border },
        { from: 'usage-label', to: 'usage-identify', color: colors.usage.border },
        { from: 'usage-student', to: 'usage-dashboard', arrows: 'to', color: colors.usage.border, dashes: true },
        { from: 'usage-teacher', to: 'usage-chart', arrows: 'to', color: colors.usage.border, dashes: true },
        // Connect to hub
        { from: 'search-embed', to: 'usage-label', arrows: 'to', color: colors.connecting.color, width: 3,
          smooth: { type: 'curvedCW', roundness: 0.3 } }
    ];

    // Step 5 - Improvement Cluster (Pink) - Bottom
    const improvementNodes = [
        { id: 'improve-label', label: 'Upload\nImprovements', x: 0, y: 220, group: 'improvement',
          font: { size: 14, bold: true }, shape: 'circle', size: 35 },
        { id: 'improve-refine', label: 'Refine\nMicroSim', x: -100, y: 280, group: 'improvement',
          shape: 'circle', size: 22 },
        { id: 'improve-score', label: 'Score\nImpact', x: 0, y: 310, group: 'improvement',
          shape: 'circle', size: 22 },
        { id: 'improve-ai', label: 'AI\nSuggestions', x: 100, y: 280, group: 'improvement',
          shape: 'circle', size: 22 },
        { id: 'improve-share', label: 'Share with\nCommunity', x: 100, y: 180, group: 'improvement',
          shape: 'circle', size: 22 }
    ];

    const improvementEdges = [
        { from: 'improve-label', to: 'improve-refine', color: colors.improvement.border },
        { from: 'improve-label', to: 'improve-score', color: colors.improvement.border },
        { from: 'improve-label', to: 'improve-ai', color: colors.improvement.border },
        { from: 'improve-label', to: 'improve-share', color: colors.improvement.border },
        { from: 'improve-refine', to: 'improve-score', arrows: 'to', color: colors.improvement.border, dashes: true },
        { from: 'improve-score', to: 'improve-ai', arrows: 'to', color: colors.improvement.border, dashes: true },
        // Connect back to hub - completing the cycle
        { from: 'usage-identify', to: 'improve-label', arrows: 'to', color: colors.connecting.color, width: 3,
          smooth: { type: 'curvedCW', roundness: 0.3 } },
        { from: 'improve-share', to: 'hub', arrows: 'to', color: colors.connecting.color, width: 3,
          smooth: { type: 'curvedCW', roundness: 0.2 } }
    ];

    // Store all data by step
    allNodes = [
        centralNodes,
        creationNodes,
        searchNodes,
        usageNodes,
        improvementNodes
    ];

    allEdges = [
        centralEdges,
        creationEdges,
        searchEdges,
        usageEdges,
        improvementEdges
    ];
}

// Captions for each step
const captions = [
    "Step 1: Visionary education leaders and foundations use AI to create faceted search on rich MicroSim metadata. Searchable by subject, grade level, learning objective, and quality ratings.",
    "Step 2: Educators worldwide contribute MicroSims to the library using an easy-to-use package upload with metadata.json describing the simulation.",
    "Step 3: Teachers find the perfect MicroSim instantly. Each download is logged to show which MicroSims are most popular and effective.",
    "Step 4: Continuous improvement from real classroom use. Student engagement and learning outcomes drive data-informed enhancements.",
    "Step 5: AI suggests that improvements be shared with others based on real-world usage patterns and effectiveness metrics."
];

// Network options
function getNetworkOptions() {
    return {
        nodes: {
            font: {
                size: 12,
                face: 'Arial',
                multi: true
            },
            borderWidth: 2,
            shadow: true
        },
        edges: {
            width: 2,
            shadow: true,
            smooth: {
                enabled: true,
                type: 'continuous'
            }
        },
        groups: {
            central: {
                color: {
                    background: colors.central.background,
                    border: colors.central.border,
                    highlight: { background: colors.central.highlight, border: colors.central.border }
                },
                font: { color: colors.central.font }
            },
            creation: {
                color: {
                    background: colors.creation.background,
                    border: colors.creation.border,
                    highlight: { background: colors.creation.highlight, border: colors.creation.border }
                },
                font: { color: colors.creation.font }
            },
            search: {
                color: {
                    background: colors.search.background,
                    border: colors.search.border,
                    highlight: { background: colors.search.highlight, border: colors.search.border }
                },
                font: { color: colors.search.font }
            },
            usage: {
                color: {
                    background: colors.usage.background,
                    border: colors.usage.border,
                    highlight: { background: colors.usage.highlight, border: colors.usage.border }
                },
                font: { color: colors.usage.font }
            },
            improvement: {
                color: {
                    background: colors.improvement.background,
                    border: colors.improvement.border,
                    highlight: { background: colors.improvement.highlight, border: colors.improvement.border }
                },
                font: { color: colors.improvement.font }
            }
        },
        physics: {
            enabled: false
        },
        interaction: {
            hover: true,
            tooltipDelay: 200,
            zoomView: true,
            dragView: true
        }
    };
}

// Show nodes and edges for a specific step
function showStep(step) {
    if (step < 0) step = 0;
    if (step > maxSteps - 1) step = maxSteps - 1;
    currentStep = step;

    // Clear existing data
    visibleNodes.clear();
    visibleEdges.clear();

    // Add all nodes and edges up to and including current step
    for (let i = 0; i <= step; i++) {
        allNodes[i].forEach(node => {
            if (!visibleNodes.get(node.id)) {
                visibleNodes.add(node);
            }
        });
        allEdges[i].forEach(edge => {
            visibleEdges.add(edge);
        });
    }

    // Update caption
    document.getElementById('caption').textContent = captions[step];

    // Update step indicator
    document.getElementById('step-indicator').textContent = `Step ${step + 1} of ${maxSteps}`;

    // Update button states
    document.getElementById('prev-btn').disabled = step === 0;
    document.getElementById('next-btn').disabled = step === maxSteps - 1;

    // Fit the view if network exists
    if (network) {
        setTimeout(() => {
            network.fit({ animation: { duration: 500, easingFunction: 'easeInOutQuad' } });
        }, 100);
    }

    // Update stats display based on step
    updateStats(step);
}

// Update animated statistics
function updateStats(step) {
    const statsDiv = document.getElementById('stats');
    if (step >= 1) {
        statsDiv.style.opacity = 1;
        // Animate counters
        animateCounter('sim-count', Math.floor(targetStats.simulations * (step + 1) / maxSteps));
        animateCounter('subject-count', Math.floor(targetStats.subjects * (step + 1) / maxSteps));
        animateCounter('country-count', Math.floor(targetStats.countries * (step + 1) / maxSteps));
    } else {
        statsDiv.style.opacity = 0.5;
    }
}

function animateCounter(elementId, target) {
    const element = document.getElementById(elementId);
    const current = parseInt(element.textContent) || 0;
    const increment = Math.ceil((target - current) / 20);

    if (current < target) {
        element.textContent = Math.min(current + increment, target);
        setTimeout(() => animateCounter(elementId, target), 50);
    }
}

// Control functions
function nextStep() {
    if (currentStep < maxSteps - 1) {
        showStep(currentStep + 1);
    }
}

function prevStep() {
    if (currentStep > 0) {
        showStep(currentStep - 1);
    }
}

function toggleAnimation() {
    isAnimating = !isAnimating;
    const btn = document.getElementById('play-btn');

    if (isAnimating) {
        btn.textContent = 'Pause';
        btn.classList.add('active');
        animationInterval = setInterval(() => {
            if (currentStep < maxSteps - 1) {
                nextStep();
            } else {
                // Reset to beginning after reaching the end
                showStep(0);
            }
        }, 3000);
    } else {
        btn.textContent = 'Play';
        btn.classList.remove('active');
        if (animationInterval) {
            clearInterval(animationInterval);
            animationInterval = null;
        }
    }
}

function resetVisualization() {
    if (isAnimating) {
        toggleAnimation();
    }
    showStep(0);
}

// Initialize the network
function initNetwork() {
    container = document.getElementById('network-container');

    initializeData();

    const data = {
        nodes: visibleNodes,
        edges: visibleEdges
    };

    network = new vis.Network(container, data, getNetworkOptions());

    // Add hover events for highlighting
    network.on('hoverNode', function(params) {
        const nodeId = params.node;
        highlightConnected(nodeId);
    });

    network.on('blurNode', function() {
        resetHighlight();
    });

    // Show first step
    showStep(0);
}

// Highlight connected nodes
function highlightConnected(nodeId) {
    const connectedNodes = network.getConnectedNodes(nodeId);
    const allNodeIds = visibleNodes.getIds();

    // Dim non-connected nodes
    allNodeIds.forEach(id => {
        if (id !== nodeId && !connectedNodes.includes(id)) {
            const node = visibleNodes.get(id);
            if (node) {
                visibleNodes.update({ id: id, opacity: 0.3 });
            }
        }
    });
}

function resetHighlight() {
    const allNodeIds = visibleNodes.getIds();
    allNodeIds.forEach(id => {
        visibleNodes.update({ id: id, opacity: 1 });
    });
}

// Responsive resize
function handleResize() {
    if (network) {
        network.fit();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initNetwork);
window.addEventListener('resize', handleResize);
