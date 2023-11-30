# Neural Network

Generate a p5.js file that draws a three layer neural network. 
The input is on the left.  The output is on the right.
The layer on the left should be labeled "Input".
add slider controls that change the number of layers and the number of neurons in a layer

[Link to Chat Transcript](https://chat.openai.com/share/10acccc0-b4b0-4232-8ae6-9e5a77195dcb)

[Link to Demo](./neural-network.html){ .md-button .md-button--primary }

```js
// Demo of parameters in neural networks
let width = 800;
let height = 400;
let numLayersSlider;
let numNeuronsSlider;
let parameterCount = 0;
let labelValueWidth = 240;

let numLayers = 3;  // Default number of layers (including Input and Output)
let numNeurons = 4; // Default number of neurons in each layer

function setup() {
  const canvas = createCanvas(width, height);
  canvas.parent('canvas-container');
  
  numLayersSlider = createSlider(2, 7, 3);
  numLayersSlider.position(labelValueWidth, height - 50);
  numLayersSlider.style('width', width - labelValueWidth - 20 + 'px')
  numLayersSlider.input(updateNetwork);
  
  
  numNeuronsSlider = createSlider(2, 10, 4);
  numNeuronsSlider.position(labelValueWidth, height - 25);
  numNeuronsSlider.input(updateNetwork);
  
  updateNetwork();
}

function updateNetwork() {
  background(240);
  
  numLayers = numLayersSlider.value();
  numNeurons = numNeuronsSlider.value();
  
  let layerPositions = Array.from({length: numLayers}, (_, i) => map(i, 0, numLayers - 1, 0.2, 0.8) * width);
  
  parameterCount = 0;
  
  for (let i = 0; i < layerPositions.length; i++) {
    let label = "Hidden";
    if (i === 0) label = "Input";
    else if (i === layerPositions.length - 1) label = "Output";
    
    drawNodes(layerPositions[i], height / 2, numNeurons, label);
  }
  
  for (let i = 0; i < layerPositions.length - 1; i++) {
    connectLayers(layerPositions[i], height / 2, numNeurons, layerPositions[i + 1], height / 2, numNeurons);
    parameterCount += numNeurons * numNeurons; // Adding weights
  }
  
  parameterCount += (numLayers - 1) * numNeurons; // Adding biases
  
  // Show labels and parameter count
  textSize(16);
  // textAlign(LEFT, CENTER);
  text('Number of Layers: ' + numLayers, 70, numLayersSlider.y);
  text('Number of Neurons/Layer: ' + numNeurons, 70 * 1.5, numNeuronsSlider.y);
  
  textAlign(CENTER, CENTER);
  text('Total Parameter Count: ' + parameterCount, width / 2, height - 20);
}

function drawNodes(x, y, numNodes, label) {
  let gap = 40;
  let startY = y - ((numNodes - 1) * gap) / 2;
  for (let i = 0; i < numNodes; i++) {
    ellipse(x, startY + i * gap, 20, 20);
  }
  textSize(16);
  textAlign(CENTER, CENTER);
  text(label, x, y + ((numNodes + 1) * gap) / 2);
}

function connectLayers(x1, y1, numNodes1, x2, y2, numNodes2) {
  let gap1 = 40;
  let gap2 = 40;
  let startY1 = y1 - ((numNodes1 - 1) * gap1) / 2;
  let startY2 = y2 - ((numNodes2 - 1) * gap2) / 2;
  for (let i = 0; i < numNodes1; i++) {
    for (let j = 0; j < numNodes2; j++) {
      line(x1, startY1 + i * gap1, x2, startY2 + j * gap2);
    }
  }
}

```