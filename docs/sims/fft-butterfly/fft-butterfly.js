// ===== Global Layout & Variables =====
let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 40;
let canvasHeight = drawHeight + controlHeight;

let margin = 20;
let sliderLeftMargin = 270;
let defaultTextSize = 16;

let containerWidth;
let containerHeight = canvasHeight;

let startOrNextButton;
let resetButton;
let fftRadio;

let fftSize = 8;
let maxStages;
let stage = 0; // which "stage" (0..maxStages) we are on

// reorder[s] will store how data indices are ordered at stage s
// positions[s][dataIndex] => the (x,y) where that dataIndex is drawn at stage s
let reorder = [];
let positions = [];

// UI state
let hasStarted = false; // for changing button label from "Start" to "Next Step"

// ===== Setup =====
function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));

  // FFT size radio
  fftRadio = createRadio();
  fftRadio.option('4', 4);
  fftRadio.option('8', 8);
  fftRadio.option('16', 16);
  fftRadio.option('32', 32);
  fftRadio.selected('8');
  fftRadio.position(sliderLeftMargin, drawHeight + 10);
  fftRadio.style('width', '250px');
  fftRadio.changed(() => {
    fftSize = int(fftRadio.value());
    resetSimulation();
  });

  // Buttons
  startOrNextButton = createButton('Start');
  startOrNextButton.position(10, drawHeight + 10);
  startOrNextButton.mousePressed(handleNextStep);

  resetButton = createButton('Reset');
  resetButton.position(100, drawHeight + 10);
  resetButton.mousePressed(resetSimulation);

  buildStages();
  describe(
    'FFT butterfly demonstration showing the data reordering through different stages of the algorithm. Click Start/Next Step, then Reset to re-run.',
    LABEL
  );
}

// ===== Draw Loop =====
function draw() {
  // Draw backgrounds
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textSize(24);
  textAlign(CENTER, TOP);
  text(`FFT Butterfly: Stage ${stage+1} of ${maxStages+1}`, canvasWidth / 2, margin-10);

  // "FFT Size" label
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text("FFT Size:", 200, drawHeight + 20);

  drawLabels();          // Inputs/Outputs labels
  drawConnections();     // Draw lines from stage to stage
  drawNodes();           // Draw the circles for each data index
}

// ===== Building the Reorder & Positions =====
function buildStages() {
  
  // Number of butterfly stages = log2(fftSize)
  maxStages = Math.log2(fftSize) + 1; // +1 to include the input stage

  reorder = [];
  positions = [];

  // Stage 0 => identity ordering [0,1,2,...,N-1]
  let N = fftSize;
  reorder[0] = [...Array(N).keys()];

  // Build subsequent reorderings for each stage s in [1..maxStages]
  for (let s = 1; s <= maxStages; s++) {
    reorder[s] = reorderStage(reorder[s - 1], s - 1);
  }

  // Create positions for each stage
  positions = new Array(maxStages + 1).fill(null).map(() => []);
  
  // Calculate stage width to ensure even spacing across the canvas
  // This is the key change for responsiveness
  let availableWidth = containerWidth - 2 * margin;
  let stageWidth = availableWidth / maxStages;
  
  for (let s = 0; s <= maxStages; s++) {
    // Center each column of nodes
    let x = margin + stageWidth * s;
    
    // For the first stage, add a small offset to the left
    if (s === 0) {
      x += stageWidth * 0.2;
    }
    // For the last stage, subtract a small offset from the right
    else if (s === maxStages) {
      x -= stageWidth * 0.2;
    }
    
    // the height of the network
    let offsetY = (drawHeight - 2 * margin - 80) / (N - 1);
    // invert reorder[s]
    for (let i = 0; i < N; i++) {
      let dataIndex = reorder[s][i];
      let y = margin + 60 + i * offsetY;
      positions[s][dataIndex] = { x, y };
    }
  }

  // Remove the first and last "identity" stages
  reorder.shift();
  positions.shift();
  reorder.pop();
  positions.pop();
  maxStages -= 2; // reduce stage count since we removed two stages
  
  stage = 0;
  hasStarted = false;
  if (startOrNextButton) {
    startOrNextButton.html('Start');
  }
}

// ===== Reordering for Each Stage =====
// s is the "stage index" (0-based)
function reorderStage(prevOrder, s) {
  // This function returns a new array that groups pairs according to the butterfly logic at stage s.
  // For stage s, block size m = 2^(s+1), half = 2^s.
  // In each block of size m, we reorder so that (top[i], bot[i]) become consecutive pairs.
  let N = prevOrder.length;
  let m = 1 << (s + 1);  // block size
  let half = m >> 1;     // half block
  let newArr = [];

  for (let start = 0; start < N; start += m) {
    let block = prevOrder.slice(start, start + m);
    if (block.length < m) {
      // Handle incomplete blocks (shouldn't happen with power-of-2 sizes)
      newArr = newArr.concat(block);
      continue;
    }
    
    let top = block.slice(0, half);
    let bot = block.slice(half, m);
    // weave them: top[0], bot[0], top[1], bot[1] ...
    for (let i = 0; i < half; i++) {
      if (i < top.length) newArr.push(top[i]);
      if (i < bot.length) newArr.push(bot[i]);
    }
  }
  return newArr;
}

// ===== Drawing the Lines (Data Crossings) =====
function drawConnections() {
  // Draw lines from stage k-1 to stage k, for k in [1..stage]
  stroke('navy');
  strokeWeight(1.5);

  for (let k = 1; k <= stage; k++) {
    // For each data index j in [0..fftSize-1], 
    // draw line from positions[k-1][ j ] to positions[k][ j ] (same data index j).
    for (let j = 0; j < fftSize; j++) {
      let pA = positions[k - 1][j];
      let pB = positions[k][j];
      line(pA.x, pA.y, pB.x, pB.y);
    }
  }
}

// ===== Drawing the Data Nodes =====
function drawNodes() {
  // Calculate node size based on container width and FFT size
  let nodeSize = calculateNodeSize();
  
  // Draw nodes for all stages from 0..maxStages
  for (let s = 0; s <= maxStages; s++) {
    // If s > stage, draw them in lighter color to indicate they're not "active" yet
    let active = (s <= stage);
    for (let j = 0; j < fftSize; j++) {
      let pt = positions[s][j];
      if (active) {
        // Stage 0 => orange for input, Stage maxStages => green for final
        if (s === 0) {
          fill('orange');
        } else if (s === maxStages) {
          fill('lightgreen');
        } else {
          fill('lightblue');
        }
      } else {
        // Future stages not reached yet
        fill(220);
      }
      stroke('black');
      
      // Draw the circle for this node
      circle(pt.x, pt.y, nodeSize);
      
      // Draw index values inside nodes (except for fftSize=32)
      if (fftSize < 32) {
        let fontSize = calculateTextSize();
        fill('black');
        textAlign(CENTER, CENTER);
        textSize(fontSize);
        text(j, pt.x, pt.y);
      }
    }
  }
}

// Calculate appropriate node size based on container width and FFT size
function calculateNodeSize() {
  // Base size calculation
  let baseSize;
  
  switch(true) {
    case (fftSize <= 4):
      baseSize = 36;
      break;
    case (fftSize <= 8):
      baseSize = 30;
      break;
    case (fftSize <= 16):
      baseSize = 18;
      break;
    default:
      baseSize = 12;
  }
  
  // Scale based on container width
  let scaleFactor = constrain(containerWidth / 800, 0.75, 1.25);
  return baseSize * scaleFactor;
}

// Calculate appropriate text size based on container width and FFT size
function calculateTextSize() {
  let baseSize;
  
  switch(true) {
    case (fftSize <= 4):
      baseSize = 24;
      break;
    case (fftSize <= 8):
      baseSize = 20;
      break;
    case (fftSize <= 16):
      baseSize = 12;
      break;
    default:
      baseSize = 10;
  }
  
  // Scale based on container width
  let scaleFactor = constrain(containerWidth / 800, 0.75, 1.25);
  return baseSize * scaleFactor;
}

// ===== Left & Right Labels =====
function drawLabels() {
  fill('black');
  textSize(16);
  textAlign(CENTER, CENTER);

  // Place the "Inputs" label above the first column
  let xLeft = positions[0][0].x;
  text('Inputs', xLeft, margin*2 + 10);

  // Place the "Outputs" over the last column near maxStages X
  let xRight = positions[maxStages][0].x;
  text('Outputs', xRight, margin*2 + 10);
}

// ===== Button Handlers =====
function handleNextStep() {
  if (!hasStarted) {
    hasStarted = true;
    startOrNextButton.html('Next Step');
  }
  if (stage < maxStages) {
    stage++;
  }
}

function resetSimulation() {
  buildStages();
  if (startOrNextButton) {
    startOrNextButton.html('Start');
  }
}

// ===== Window Resize Helper =====
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);

  // Adjust control positions
  let responsiveSliderLeftMargin = min(270, containerWidth * 0.6);
  fftRadio.position(responsiveSliderLeftMargin, drawHeight + 10);
  startOrNextButton.position(10, drawHeight + 10);
  resetButton.position(100, drawHeight + 10);
  
  // Rebuild the stage positions to adapt to the new container width
  buildStages();
  
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);  // Avoid fractional pixels
  canvasWidth = containerWidth;
}