// A* Search Algorithm Visualization
// Global variables for canvas dimensions
let canvasWidth = 600;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 30;

let graph;
let algorithm;

// UI elements
let startBtn, stepBtn, runBtn, resetBtn, newGraphBtn;
let autoRun = false;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));
    textSize(14);

    // Initialize graph and algorithm
    graph = new Graph(15); // 15 vertices
    algorithm = new AStarAlgorithm(graph);

    // Initialize buttons in control area
    createButtons();
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    canvasWidth = container ? container.offsetWidth : 600;
    // Keep minimum width for usability
    canvasWidth = max(canvasWidth, 400);
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    updateButtonPositions();
}

function createButtons() {
    let btnY = drawHeight + 10;
    let btnX = 10;

    startBtn = createButton('Start');
    startBtn.position(btnX, btnY);
    startBtn.mousePressed(() => {
        algorithm.startAlgorithm();
        algorithm.stepForward(); // Take first step immediately so user sees something happen
    });
    startBtn.parent(document.querySelector('main'));

    stepBtn = createButton('Step');
    stepBtn.position(btnX + 70, btnY);
    stepBtn.mousePressed(() => {
        // If not started yet, start first
        if (!algorithm.isRunning && !algorithm.isFinished) {
            algorithm.startAlgorithm();
        }
        algorithm.stepForward();
    });
    stepBtn.parent(document.querySelector('main'));

    runBtn = createButton('Run');
    runBtn.position(btnX + 130, btnY);
    runBtn.mousePressed(() => {
        if (!algorithm.isRunning && !algorithm.isFinished) {
            algorithm.startAlgorithm();
        }
        autoRun = !autoRun;
        runBtn.html(autoRun ? 'Pause' : 'Run');
    });
    runBtn.parent(document.querySelector('main'));

    resetBtn = createButton('Reset');
    resetBtn.position(btnX + 200, btnY);
    resetBtn.mousePressed(() => {
        algorithm.resetAlgorithm();
        autoRun = false;
        runBtn.html('Run');
    });
    resetBtn.parent(document.querySelector('main'));

    newGraphBtn = createButton('New Graph');
    newGraphBtn.position(btnX + 270, btnY);
    newGraphBtn.mousePressed(() => {
        updateCanvasSize();
        resizeCanvas(canvasWidth, canvasHeight);
        graph = new Graph(15);
        algorithm = new AStarAlgorithm(graph);
        autoRun = false;
        runBtn.html('Run');
        updateButtonPositions();
    });
    newGraphBtn.parent(document.querySelector('main'));

    describe('A* pathfinding algorithm visualization on a random graph', LABEL);
}

function updateButtonPositions() {
    // Get canvas position relative to page
    const canvas = document.querySelector('main canvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    let btnY = rect.top + scrollY + drawHeight + 10;
    let btnX = rect.left + scrollX + 10;

    startBtn.position(btnX, btnY);
    stepBtn.position(btnX + 60, btnY);
    runBtn.position(btnX + 120, btnY);
    resetBtn.position(btnX + 180, btnY);
    newGraphBtn.position(btnX + 250, btnY);
}

function draw() {
    // Drawing area with silver border
    fill('aliceblue');
    stroke('silver');
    strokeWeight(2);
    rect(0, 0, canvasWidth, drawHeight);

    // Control area with silver border
    fill('white');
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Title (drawn after rectangles so it's visible)
    fill('black');
    noStroke();
    textSize(24);
    textAlign(CENTER, CENTER);
    text('A* Search Algorithm', canvasWidth / 2, 18);

    // Auto-run: take a step every 45 frames (~1.3 steps per second at 60fps)
    if (autoRun && frameCount % 45 === 0) {
        algorithm.stepForward();
        if (algorithm.isFinished) {
            autoRun = false;
            runBtn.html('Run');
        }
    }

    // Draw the graph and algorithm state
    graph.draw();
    algorithm.draw();

    // Draw legend
    drawLegend();
}

function drawLegend() {
    let x = canvasWidth - 100;
    let y = 50;
    textSize(12);
    noStroke();
    textAlign(LEFT, CENTER);

    // Start node
    fill(0, 200, 0);
    ellipse(x, y, 12, 12);
    fill(0);
    textAlign(LEFT, CENTER);
    text('Start', x + 15, y);

    // End node
    fill(200, 0, 0);
    ellipse(x, y + 20, 12, 12);
    fill(0);
    text('Goal', x + 15, y + 20);

    // Open set
    fill(100, 100, 255);
    ellipse(x, y + 40, 12, 12);
    fill(0);
    text('Open Set', x + 15, y + 40);

    // Closed set
    fill(150, 150, 150);
    ellipse(x, y + 60, 12, 12);
    fill(0);
    text('Visited', x + 15, y + 60);

    // Current
    fill(255, 200, 0);
    ellipse(x, y + 80, 12, 12);
    fill(0);
    text('Current', x + 15, y + 80);

    // Path
    fill(0, 255, 100);
    ellipse(x, y + 100, 12, 12);
    fill(0);
    text('Path', x + 15, y + 100);
}

class Graph {
    constructor(vertexCount) {
        this.vertexCount = vertexCount;
        this.vertices = [];
        this.edges = []; // Each edge: [fromIndex, toIndex]
        this.adjacencyList = []; // For efficient neighbor lookup
        this.createRandomGraph();
    }

    createRandomGraph() {
        // Create vertices with padding from edges (accounting for title area at top)
        let padding = margin;
        let topPadding = 55; // Below title
        let legendWidth = 110; // Space for legend on right
        for (let i = 0; i < this.vertexCount; i++) {
            let x = random(padding + 10, canvasWidth - legendWidth); // Leave room for legend
            let y = random(topPadding, drawHeight - padding);
            this.vertices.push(createVector(x, y));
            this.adjacencyList.push([]);
        }

        // Create edges - ensure connectivity
        // First, create a spanning tree to ensure all nodes are connected
        for (let i = 1; i < this.vertexCount; i++) {
            let target = int(random(i)); // Connect to a random previous node
            this.addEdge(i, target);
        }

        // Add some extra edges for variety
        let extraEdges = int(this.vertexCount * 0.8);
        for (let i = 0; i < extraEdges; i++) {
            let a = int(random(this.vertexCount));
            let b = int(random(this.vertexCount));
            if (a !== b && !this.hasEdge(a, b)) {
                // Only add if distance is reasonable (not too long)
                let d = dist(this.vertices[a].x, this.vertices[a].y,
                            this.vertices[b].x, this.vertices[b].y);
                if (d < 200) {
                    this.addEdge(a, b);
                }
            }
        }
    }

    addEdge(a, b) {
        if (!this.hasEdge(a, b)) {
            this.edges.push([a, b]);
            this.adjacencyList[a].push(b);
            this.adjacencyList[b].push(a); // Undirected graph
        }
    }

    hasEdge(a, b) {
        return this.adjacencyList[a].includes(b);
    }

    getNeighbors(nodeIndex) {
        return this.adjacencyList[nodeIndex];
    }

    draw() {
        // Draw edges
        stroke(180);
        strokeWeight(1);
        for (let e of this.edges) {
            let v1 = this.vertices[e[0]];
            let v2 = this.vertices[e[1]];
            line(v1.x, v1.y, v2.x, v2.y);
        }
    }
}

class AStarAlgorithm {
    constructor(graph) {
        this.graph = graph;
        this.startIndex = 0;
        this.endIndex = this.graph.vertexCount - 1;

        // A* data structures
        this.openSet = [];      // Indices of nodes to explore
        this.closedSet = [];    // Indices of explored nodes
        this.gScore = [];       // Cost from start to each node
        this.fScore = [];       // gScore + heuristic
        this.cameFrom = [];     // For path reconstruction

        this.currentIndex = -1;
        this.path = [];         // Final path indices
        this.isRunning = false;
        this.isFinished = false;
        this.foundPath = false;

        this.initScores();
    }

    initScores() {
        for (let i = 0; i < this.graph.vertexCount; i++) {
            this.gScore[i] = Infinity;
            this.fScore[i] = Infinity;
            this.cameFrom[i] = -1;
        }
    }

    heuristic(a, b) {
        // Euclidean distance as heuristic
        let va = this.graph.vertices[a];
        let vb = this.graph.vertices[b];
        return dist(va.x, va.y, vb.x, vb.y);
    }

    edgeCost(a, b) {
        // Actual distance between nodes
        let va = this.graph.vertices[a];
        let vb = this.graph.vertices[b];
        return dist(va.x, va.y, vb.x, vb.y);
    }

    startAlgorithm() {
        if (this.isRunning || this.isFinished) return;

        this.gScore[this.startIndex] = 0;
        this.fScore[this.startIndex] = this.heuristic(this.startIndex, this.endIndex);
        this.openSet.push(this.startIndex);
        this.isRunning = true;
    }

    stepForward() {
        if (!this.isRunning || this.isFinished) return;

        if (this.openSet.length === 0) {
            console.log("No path found!");
            this.isRunning = false;
            this.isFinished = true;
            return;
        }

        // Find node in openSet with lowest fScore
        let lowestIndex = 0;
        for (let i = 1; i < this.openSet.length; i++) {
            if (this.fScore[this.openSet[i]] < this.fScore[this.openSet[lowestIndex]]) {
                lowestIndex = i;
            }
        }

        this.currentIndex = this.openSet[lowestIndex];

        // Check if we reached the goal
        if (this.currentIndex === this.endIndex) {
            this.reconstructPath();
            this.isRunning = false;
            this.isFinished = true;
            this.foundPath = true;
            console.log("Path found!");
            return;
        }

        // Move current from openSet to closedSet
        this.openSet.splice(lowestIndex, 1);
        this.closedSet.push(this.currentIndex);

        // Explore neighbors
        let neighbors = this.graph.getNeighbors(this.currentIndex);
        for (let neighbor of neighbors) {
            if (this.closedSet.includes(neighbor)) {
                continue; // Already evaluated
            }

            let tentativeGScore = this.gScore[this.currentIndex] +
                                  this.edgeCost(this.currentIndex, neighbor);

            if (!this.openSet.includes(neighbor)) {
                this.openSet.push(neighbor); // Discover new node
            } else if (tentativeGScore >= this.gScore[neighbor]) {
                continue; // Not a better path
            }

            // This is the best path so far
            this.cameFrom[neighbor] = this.currentIndex;
            this.gScore[neighbor] = tentativeGScore;
            this.fScore[neighbor] = tentativeGScore + this.heuristic(neighbor, this.endIndex);
        }
    }

    reconstructPath() {
        this.path = [];
        let current = this.endIndex;
        while (current !== -1) {
            this.path.unshift(current);
            current = this.cameFrom[current];
        }
    }

    resetAlgorithm() {
        this.openSet = [];
        this.closedSet = [];
        this.currentIndex = -1;
        this.path = [];
        this.isRunning = false;
        this.isFinished = false;
        this.foundPath = false;
        this.initScores();
    }

    draw() {
        let vertices = this.graph.vertices;

        // Draw path edges if found
        if (this.path.length > 1) {
            stroke(0, 255, 100);
            strokeWeight(4);
            for (let i = 0; i < this.path.length - 1; i++) {
                let v1 = vertices[this.path[i]];
                let v2 = vertices[this.path[i + 1]];
                line(v1.x, v1.y, v2.x, v2.y);
            }
        }

        // Draw edges being explored (from current to open set)
        if (this.currentIndex >= 0 && this.isRunning) {
            stroke(100, 100, 255, 150);
            strokeWeight(2);
            let currentV = vertices[this.currentIndex];
            for (let idx of this.openSet) {
                if (this.graph.hasEdge(this.currentIndex, idx)) {
                    let v = vertices[idx];
                    line(currentV.x, currentV.y, v.x, v.y);
                }
            }
        }

        noStroke();
        let nodeSize = 16;

        // Draw closed set (visited) nodes
        fill(150, 150, 150);
        for (let idx of this.closedSet) {
            if (idx !== this.startIndex && idx !== this.endIndex) {
                let v = vertices[idx];
                ellipse(v.x, v.y, nodeSize, nodeSize);
            }
        }

        // Draw open set nodes
        fill(100, 100, 255);
        for (let idx of this.openSet) {
            if (idx !== this.startIndex && idx !== this.endIndex) {
                let v = vertices[idx];
                ellipse(v.x, v.y, nodeSize, nodeSize);
            }
        }

        // Draw path nodes
        if (this.path.length > 0) {
            fill(0, 255, 100);
            for (let idx of this.path) {
                if (idx !== this.startIndex && idx !== this.endIndex) {
                    let v = vertices[idx];
                    ellipse(v.x, v.y, nodeSize, nodeSize);
                }
            }
        }

        // Draw current node
        if (this.currentIndex >= 0 && this.currentIndex !== this.startIndex &&
            this.currentIndex !== this.endIndex && this.isRunning) {
            fill(255, 200, 0);
            let v = vertices[this.currentIndex];
            ellipse(v.x, v.y, nodeSize + 4, nodeSize + 4);
        }

        // Draw unvisited nodes
        fill(220);
        stroke(100);
        strokeWeight(1);
        for (let i = 0; i < vertices.length; i++) {
            if (!this.openSet.includes(i) && !this.closedSet.includes(i) &&
                !this.path.includes(i) && i !== this.startIndex && i !== this.endIndex) {
                let v = vertices[i];
                ellipse(v.x, v.y, nodeSize, nodeSize);
            }
        }

        // Draw start node (green) - always visible
        noStroke();
        fill(0, 200, 0);
        let startV = vertices[this.startIndex];
        ellipse(startV.x, startV.y, nodeSize + 4, nodeSize + 4);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(10);
        text('S', startV.x, startV.y);

        // Draw end node (red) - always visible
        fill(200, 0, 0);
        let endV = vertices[this.endIndex];
        ellipse(endV.x, endV.y, nodeSize + 4, nodeSize + 4);
        fill(255);
        text('G', endV.x, endV.y);

        // Draw status text
        fill(0);
        textAlign(LEFT, TOP);
        textSize(14);
        let status = '';
        if (!this.isRunning && !this.isFinished) {
            status = 'Click "Start" then "Step" to begin';
        } else if (this.isRunning) {
            status = `Exploring... Open: ${this.openSet.length}, Visited: ${this.closedSet.length}`;
        } else if (this.foundPath) {
            status = `Path found! Length: ${this.path.length} nodes`;
        } else {
            status = 'No path exists!';
        }
        text(status, 10, 10);
    }
}
