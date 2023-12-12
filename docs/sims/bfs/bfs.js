
// Global canvas size variables
let canvasWidth = 400;
let canvasHeight = 430;
// leave room for bottom controls
let drawHeight = 400;

// Array of colors but not too dark so we can read black text over the colors
let colors = ['pink', 'orange', 'yellow', 'lightgreen', 'lightblue', 'cyan', 'plum', 'silver', 'pink', 'olive', 'gold', 'brown'];

// Node and graph class definitions
class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.neighbors = [];
        this.visited = false;
        this.isCentral = false;
        this.hopDistance = -1;  // Distance in hops from the central node (-1 for unvisited nodes)
        this.color = 'silver';  // Initial color
    }

    addNeighbor(node) {
        if (!this.neighbors.includes(node)) {
            this.neighbors.push(node);
            // Ensure the link is bidirectional
            if (!node.neighbors.includes(this)) {
                node.neighbors.push(this);
            }
        }
    }

    drawNode() {
        fill(this.color);
        circle(this.x, this.y, 20);
        textSize(12);
        fill(0);
        text(str(this.hopDistance), this.x-4, this.y+4)
    }

    setColorByHopDistance() {
        if (this.hopDistance >= 0) {
            this.color = colors[this.hopDistance % colors.length];
        }
    }
}

class Graph {
    constructor() {
        this.nodes = [];
        this.queue = [];
        this.finished = false;
        this.currentHopLevel = -1;  // Current hop level being processed
    }

    addNode(node) {
        this.nodes.push(node);
    }
    
    connectClosest() {
        // Connect each node to its 2 or 3 closest neighbors
        this.nodes.forEach(v => {
            let distances = this.nodes.map(w => ({ node: w, dist: dist(v.x, v.y, w.x, w.y) }));
            distances.sort((a, b) => a.dist - b.dist);
            let neighbors = distances.slice(1, 4); // excluding the node itself
            neighbors.forEach(n => v.addNeighbor(n.node));
        });
    }

    drawGraph() {
        // Draw edges
        stroke(0);
        this.nodes.forEach(v => {
            v.neighbors.forEach(n => {
                line(v.x, v.y, n.x, n.y);
            });
        });

        // Draw nodes
        this.nodes.forEach(v => v.drawNode());
    }

    nextStep() {
        if (this.finished) return;

        if (this.queue.length === 0) {
            let central = this.nodes.find(v => v.isCentral);
            if (central) {
                central.visited = true;
                central.hopDistance = 0;
                central.setColorByHopDistance();
                this.queue.push({ node: central, hopDistance: 0 });
                this.currentHopLevel = 0;
            }
        } else {
            let nextQueue = [];
            while (this.queue.length > 0 && this.queue[0].hopDistance === this.currentHopLevel) {
                let currentPair = this.queue.shift();
                let current = currentPair.node;
                let currentHopDistance = currentPair.hopDistance;
                current.neighbors.forEach(neighbor => {
                    if (!neighbor.visited) {
                        neighbor.visited = true;
                        neighbor.hopDistance = currentHopDistance + 1;
                        neighbor.setColorByHopDistance();
                        nextQueue.push({ node: neighbor, hopDistance: neighbor.hopDistance });
                    }
                });
            }
            this.queue = nextQueue;
            this.currentHopLevel++;
        }

        this.finished = this.queue.length === 0 && this.nodes.every(v => v.visited);
    }

    finish() {
        while (!this.finished) {
            this.nextStep();
        }
    }

    restart() {
        this.queue = [];
        this.finished = false;
        this.currentHopLevel = -1;
        this.nodes.forEach(v => {
            v.visited = false;
            v.hopDistance = -1;
            v.color = 'silver';
        });
        let central = this.nodes.find(v => v.isCentral);
        if (central) {
            central.visited = true;
            central.hopDistance = 0;
            central.color = 'red';
            this.queue.push({ node: central, hopDistance: 0 });
            this.currentHopLevel = 0;
        }
    }
}

let graph = new Graph();

function setup() { 
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-container');
    textSize(16);


    // Create nodes
    for (let i = 0; i < 20; i++) {
        let x = random(20, canvasWidth - 20);
        // note we only draw down to the drawHeight not the canvasHeight
        let y = random(20, drawHeight - 20);
        let node = new Node(x, y);
        graph.addNode(node);
    }

    // Set central node
    let centralNode = graph.nodes[0];
    centralNode.isCentral = true;
    centralNode.color = 'red';
    centralNode.hopDistance = 0;

    // Connect nodes
    graph.connectClosest();

   // Position buttons at the bottom of the canvas
   createButton('Next Step')
   .position(10, drawHeight + 15)
   .mousePressed(() => { graph.nextStep(); redraw(); });

   createButton('Finish')
   .position(95, drawHeight + 15)
   .mousePressed(() => { graph.finish(); redraw(); });

   createButton('Restart')
   .position(160, drawHeight + 15)
   .mousePressed(() => { graph.restart(); redraw(); })

    // Draw the graph
    noLoop();
}

function draw() {
    fill(245);
    // draw all but the bottom control area
    rect(0, 0, canvasWidth, drawHeight);
    graph.drawGraph();
}
