// Conway's Game of Life MicroSim
// Cellular automata simulation with blue circles on aliceblue background
// Follows MicroSim design patterns with controls in bottom region

// Canvas dimensions
let canvasWidth = 580;
let drawHeight = 400;
let controlHeight = 40;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let sliderLeftMargin = 260;

// Layout constants
let margin = 10;
let defaultTextSize = 16;
let titleHeight = 35; // Space reserved for title at top

// Grid settings
let grid;
let resolution = 10;
let cols;
let rows;

// Simulation state
let isRunning = false;

// UI controls
let startButton, stepButton, resetButton, speedSlider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));

  // Calculate grid dimensions based on draw area (minus title space)
  cols = floor(containerWidth / resolution);
  rows = floor((drawHeight - titleHeight) / resolution);

  // Initialize grid with random values
  initializeGrid();

  // Create control buttons
  startButton = createButton('Start');
  startButton.position(10, drawHeight + 8);
  startButton.mousePressed(toggleSimulation);

  stepButton = createButton('Step');
  stepButton.position(70, drawHeight + 8);
  stepButton.mousePressed(stepGame);

  resetButton = createButton('Reset');
  resetButton.position(120, drawHeight + 8);
  resetButton.mousePressed(resetGrid);

  // Speed slider
  speedSlider = createSlider(1, 30, 10, 1);
  speedSlider.position(sliderLeftMargin, drawHeight + 10);
  speedSlider.size(containerWidth - 260 - margin);

  describe('Conway Game of Life cellular automata simulation with blue cells on light blue background', LABEL);
}

function draw() {
  updateCanvasSize();

  // Draw area with aliceblue background
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, containerWidth, drawHeight);

  // Control area with white background
  fill('white');
  stroke('silver');
  rect(0, drawHeight, containerWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textSize(20);
  textAlign(CENTER, TOP);
  text("Conway's Game of Life", containerWidth / 2, 8);

  // Draw grid cells as blue circles
  drawGrid();

  // Update simulation if running
  if (isRunning && frameCount % (31 - speedSlider.value()) === 0) {
    stepGame();
  }

  // Draw control labels
  drawControlLabels();
}

function initializeGrid() {
  grid = make2DArray(cols, rows);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = floor(random(2));
    }
  }
}

function drawGrid() {
  let cellRadius = resolution * 0.8;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] === 1) {
        let x = i * resolution + resolution / 2;
        let y = j * resolution + resolution / 2 + titleHeight; // Offset for title

        fill('blue');
        noStroke();
        circle(x, y, cellRadius);
      }
    }
  }
}

function stepGame() {
  let next = make2DArray(cols, rows);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let state = grid[i][j];
      let neighbors = countNeighbors(grid, i, j);

      // Conway's rules
      if (state === 0 && neighbors === 3) {
        next[i][j] = 1; // Birth
      } else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
        next[i][j] = 0; // Death
      } else {
        next[i][j] = state; // Survival
      }
    }
  }

  grid = next;
}

function toggleSimulation() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}

function resetGrid() {
  isRunning = false;
  startButton.html('Start');
  initializeGrid();
}

function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows).fill(0);
  }
  return arr;
}

function countNeighbors(grid, x, y) {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      sum += grid[col][row];
    }
  }
  sum -= grid[x][y];
  return sum;
}

function drawControlLabels() {
  fill('black');
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Speed: ' + speedSlider.value(), 180, drawHeight + 20);
}

// Allow clicking on grid to toggle cells
function mousePressed() {
  if (mouseY > titleHeight && mouseY < drawHeight) {
    let i = floor(mouseX / resolution);
    let j = floor((mouseY - titleHeight) / resolution);
    if (i >= 0 && i < cols && j >= 0 && j < rows) {
      grid[i][j] = grid[i][j] === 1 ? 0 : 1;
    }
  }
}

// Responsive design functions
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);

  // Recalculate grid dimensions
  cols = floor(containerWidth / resolution);
  rows = floor((drawHeight - titleHeight) / resolution);

  // Resize slider
  speedSlider.size(containerWidth - 260 - margin);

  // Reinitialize grid with new dimensions
  initializeGrid();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
