// Neural Network Structure MicroSim
// Demonstrates counting model parameters in a neural network

// Canvas dimensions
let canvasWidth = 450;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 180;

// Sliders
let numLayersSlider;
let numNeuronsSlider;

// Network parameters
let numLayers = 3;
let numNeurons = 4;
let parameterCount = 0;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-container');

    describe('Interactive neural network visualization showing layers, neurons, and parameter count', LABEL);

    // Create sliders
    numLayersSlider = createSlider(2, 7, 3);
    numLayersSlider.position(sliderLeftMargin, drawHeight + 15);
    numLayersSlider.size(canvasWidth - sliderLeftMargin - 15);
    numLayersSlider.input(draw);

    numNeuronsSlider = createSlider(2, 10, 4);
    numNeuronsSlider.position(sliderLeftMargin, drawHeight + 45);
    numNeuronsSlider.size(canvasWidth - sliderLeftMargin - 15);
    numNeuronsSlider.input(draw);
}

function draw() {
    // Drawing area with aliceblue background
    fill('aliceblue');
    stroke('silver');
    strokeWeight(1);
    rect(0, 0, canvasWidth, drawHeight);

    // Control area with white background
    fill('white');
    noStroke();
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Draw title
    fill('black');
    noStroke();
    textSize(20);
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    text('Neural Network Structure', canvasWidth / 2, 10);

    // Draw subtitle
    textSize(14);
    textStyle(NORMAL);
    fill('darkgray');
    text('Counting model parameters', canvasWidth / 2, 35);

    // Get current slider values
    numLayers = numLayersSlider.value();
    numNeurons = numNeuronsSlider.value();

    // Calculate layer positions
    let layerPositions = [];
    for (let i = 0; i < numLayers; i++) {
        layerPositions.push(map(i, 0, numLayers - 1, 0.15, 0.85) * canvasWidth);
    }

    // Reset parameter count
    parameterCount = 0;

    // Draw connections first (so they appear behind nodes)
    stroke(150);
    strokeWeight(1);
    for (let i = 0; i < layerPositions.length - 1; i++) {
        connectLayers(layerPositions[i], drawHeight / 2 + 20, numNeurons,
                      layerPositions[i + 1], drawHeight / 2 + 20, numNeurons);
        parameterCount += numNeurons * numNeurons; // weights
    }

    // Add biases
    parameterCount += (numLayers - 1) * numNeurons;

    // Draw nodes
    for (let i = 0; i < layerPositions.length; i++) {
        let label = "Hidden";
        if (i === 0) label = "Input";
        else if (i === layerPositions.length - 1) label = "Output";

        drawNodes(layerPositions[i], drawHeight / 2 + 20, numNeurons, label);
    }

    // Draw parameter count
    fill('navy');
    textSize(16);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text('Total Parameters: ' + parameterCount, canvasWidth / 2, drawHeight - 20);

    // Draw slider labels
    fill('black');
    textStyle(NORMAL);
    textSize(14);
    textAlign(LEFT, CENTER);
    text('Layers: ' + numLayers, margin, drawHeight + 27);
    text('Neurons/Layer: ' + numNeurons, margin, drawHeight + 57);

    noLoop();
}

function drawNodes(x, y, numNodes, label) {
    let gap = 35;
    let startY = y - ((numNodes - 1) * gap) / 2;

    // Draw nodes
    for (let i = 0; i < numNodes; i++) {
        fill('steelblue');
        stroke('navy');
        strokeWeight(2);
        ellipse(x, startY + i * gap, 24, 24);
    }

    // Draw layer label
    fill('black');
    noStroke();
    textSize(12);
    textAlign(CENTER, TOP);
    text(label, x, startY + (numNodes - 1) * gap + 20);
}

function connectLayers(x1, y1, numNodes1, x2, y2, numNodes2) {
    let gap1 = 35;
    let gap2 = 35;
    let startY1 = y1 - ((numNodes1 - 1) * gap1) / 2;
    let startY2 = y2 - ((numNodes2 - 1) * gap2) / 2;

    for (let i = 0; i < numNodes1; i++) {
        for (let j = 0; j < numNodes2; j++) {
            line(x1, startY1 + i * gap1, x2, startY2 + j * gap2);
        }
    }
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);

    // Reposition sliders
    numLayersSlider.position(sliderLeftMargin, drawHeight + 15);
    numLayersSlider.size(canvasWidth - sliderLeftMargin - 15);
    numNeuronsSlider.position(sliderLeftMargin, drawHeight + 45);
    numNeuronsSlider.size(canvasWidth - sliderLeftMargin - 15);

    redraw();
}

function updateCanvasSize() {
    const container = document.querySelector('main') || document.querySelector('#canvas-container');
    if (container) {
        canvasWidth = Math.min(container.offsetWidth - 20, 600);
        canvasWidth = Math.max(canvasWidth, 350);
    }
}
