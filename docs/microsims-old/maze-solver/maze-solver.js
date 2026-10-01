// Maze Solver MicroSim - a random maze is generated with depth-first search (DFS)
// and then solved, one step at a time, with breadth-first search (BFS)
// CANVAS_HEIGHT: 480
// Learning objective (Understand / explain): the learner explains how breadth-first search
// explores a maze in layers and why the first path it finds to the end cell is the shortest.
//
// Model:
//   Generation (instant, on page load and on New Maze): depth-first search with backtracking.
//     From the current cell, pick a random unvisited neighbor, remove the wall between the
//     two cells and move there. With no unvisited neighbor, back up along the stack.
//     The result is a "perfect" maze: exactly one path between any two cells.
//   Solving (animated): breadth-first search from the start cell (S) to the end cell (E).
//     One step takes the oldest cell out of the queue and adds each open, unvisited neighbor
//     to the back of the queue. Every cell remembers the cell it was reached from (its
//     parent), so the solution is found by following the parents from E back to S.
// The Solve Speed slider sets the number of steps per second. A speed of 0 pauses the search.
// The number of maze columns follows the width of the canvas, so a wider page gets a wider
// maze. Changing the width enough to add or remove a column makes a new maze.

// ---------- Canvas dimensions (standard MicroSim layout) ----------
let canvasWidth = 400;               // updated from the container width
let drawHeight = 410;                // drawing region (aliceblue)
let controlHeight = 70;              // control region (white): 2 rows of controls
let canvasHeight = drawHeight + controlHeight;  // 480
let margin = 25;
let sliderLeftMargin = 140;          // room for "Solve Speed: 60" to the left of the slider
let defaultTextSize = 16;

// ---------- Layout constants ----------
const titleHeight = 40;              // band for the title, above the maze
const statusHeight = 30;             // band for the status line, below the maze
const cellSize = 20;                 // width and height of one maze cell

// ---------- Model constants ----------
const minSpeed = 0;                  // 0 steps per second pauses the search
const maxSpeed = 60;
const defaultSpeed = 8;
const exploredColor = [255, 0, 255, 100];   // pink: cells the search has reached
const pathColor = [255, 255, 0, 220];       // yellow: cells on the shortest path
const startColor = [0, 255, 0, 150];        // green: the start cell
const endColor = [255, 0, 0, 120];          // red: the end cell

// ---------- Maze state ----------
let cols, rows;                      // size of the maze in cells
let grid = [];                       // grid[i][j] is the cell in column i and row j
let startCell, endCell;              // upper left and lower right corners

// ---------- Search state ----------
let searchState = 'ready';           // 'ready', 'solving' or 'solved'
let queue = [];                      // cells waiting for their turn, oldest first
let exploredCount = 0;               // cells the search has reached
let pathLength = 0;                  // cells on the shortest path, counting S and E
let solveSpeed = defaultSpeed;       // steps per second
let stepBudget = 0;                  // fraction of a step carried over to the next frame

// ---------- Controls ----------
let solveButton, newMazeButton;
let speedSlider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Row 1: Solve / Reset and New Maze
  solveButton = createButton('Solve');
  solveButton.parent(document.querySelector('main'));
  solveButton.position(10, drawHeight + 8);
  solveButton.size(70, 26);
  solveButton.mousePressed(toggleSolving);
  styleButton(solveButton, 'green');

  newMazeButton = createButton('New Maze');
  newMazeButton.parent(document.querySelector('main'));
  newMazeButton.position(86, drawHeight + 8);
  newMazeButton.size(90, 26);
  newMazeButton.mousePressed(createNewMaze);
  styleButton(newMazeButton, 'blue');

  // Row 2: solve speed slider
  speedSlider = createSlider(minSpeed, maxSpeed, defaultSpeed, 1);   // min, max, default, step
  speedSlider.parent(document.querySelector('main'));
  speedSlider.position(sliderLeftMargin, drawHeight + 42);
  speedSlider.size(canvasWidth - sliderLeftMargin - margin);

  createNewMaze();

  describe('A maze of square cells with black walls. The start cell in the upper left corner ' +
    'is green and marked S. The end cell in the lower right corner is red and marked E. ' +
    'A Solve button starts a breadth-first search that spreads out from the start cell and ' +
    'colors each cell it reaches pink. When the search reaches the end cell, the shortest ' +
    'path from start to end turns yellow. A status line under the maze counts the cells ' +
    'explored and the cells on the path. A Reset button clears the search, a New Maze ' +
    'button makes a new random maze, and a Solve Speed slider sets the steps per second ' +
    'from 0, which pauses the search, to 60.', LABEL);
}

function draw() {
  // Drawing region and control region backgrounds (required MicroSim standard)
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // get the updated slider value
  solveSpeed = speedSlider.value();

  // Run the search at solveSpeed steps per second. A long frame is counted as
  // 0.1 seconds at most, so the search does not jump ahead after the tab was hidden.
  if (searchState === 'solving') {
    stepBudget += solveSpeed * min(deltaTime, 100) / 1000;
    while (stepBudget >= 1 && searchState === 'solving') {
      solveMazeStep();
      stepBudget -= 1;
    }
  }

  // Title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Maze Solver', canvasWidth / 2, 8);

  drawMaze();
  drawStatus();
  drawControlLabels();
}

// ---------- Maze generation: depth-first search with backtracking ----------
function createMaze() {
  cols = columnsThatFit();
  rows = floor((drawHeight - titleHeight - statusHeight) / cellSize);

  // Every cell starts with all four walls
  grid = new Array(cols);
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Cell(i, j);
    }
  }

  // green square in the upper left corner and red square in the lower right corner
  startCell = grid[0][0];
  endCell = grid[cols - 1][rows - 1];
}

function generateMaze() {
  // Start from the upper left cell
  let current = startCell;
  current.visited = true;
  let stack = [current];

  // The stack holds the trail back to the start. A cell stays on the stack
  // for as long as it has an unvisited neighbor.
  while (stack.length > 0) {
    current = stack.pop();
    const next = getUnvisitedNeighbor(current);
    if (next) {
      stack.push(current);
      removeWalls(current, next);
      next.visited = true;
      stack.push(next);
    }
  }
}

function getUnvisitedNeighbor(cell) {
  const neighbors = [];
  const i = cell.i;
  const j = cell.j;

  // Check all four neighbors
  if (i > 0 && !grid[i - 1][j].visited) neighbors.push(grid[i - 1][j]);          // Left
  if (i < cols - 1 && !grid[i + 1][j].visited) neighbors.push(grid[i + 1][j]);   // Right
  if (j > 0 && !grid[i][j - 1].visited) neighbors.push(grid[i][j - 1]);          // Top
  if (j < rows - 1 && !grid[i][j + 1].visited) neighbors.push(grid[i][j + 1]);   // Bottom

  // random() of an empty array is undefined, which ends this branch of the search
  return random(neighbors);
}

// Remove the wall between two cells that are side by side
function removeWalls(a, b) {
  const x = a.i - b.i;
  const y = a.j - b.j;

  if (x === 1) {
    a.walls[3] = false;  // Remove left wall of a
    b.walls[1] = false;  // Remove right wall of b
  } else if (x === -1) {
    a.walls[1] = false;  // Remove right wall of a
    b.walls[3] = false;  // Remove left wall of b
  }

  if (y === 1) {
    a.walls[0] = false;  // Remove top wall of a
    b.walls[2] = false;  // Remove bottom wall of b
  } else if (y === -1) {
    a.walls[2] = false;  // Remove bottom wall of a
    b.walls[0] = false;  // Remove top wall of b
  }
}

// ---------- Maze solving: breadth-first search ----------
// Clear the search and put the start cell in the queue. The maze itself is not changed.
function resetSearch() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].visited = false;
      grid[i][j].inSolution = false;
      grid[i][j].parent = null;
    }
  }
  startCell.visited = true;
  queue = [startCell];
  exploredCount = 1;
  pathLength = 0;
  stepBudget = 0;
  searchState = 'ready';
  updateSolveButton();
}

// One step of the search: the oldest cell in the queue takes its turn
function solveMazeStep() {
  if (queue.length === 0) {
    // every cell was explored without reaching the end (not possible in a perfect maze)
    searchState = 'solved';
    return;
  }

  const cell = queue.shift();  // BFS uses a queue: take from the front, add to the back

  if (cell === endCell) {
    // Follow the parents from the end back to the start to mark the shortest path
    for (let c = endCell; c; c = c.parent) {
      c.inSolution = true;
      pathLength++;
    }
    searchState = 'solved';
    return;
  }

  // A wall on the edge of the maze is never removed, so an open wall always has a neighbor
  const i = cell.i;
  const j = cell.j;
  if (!cell.walls[1]) reachCell(grid[i + 1][j], cell);  // Right
  if (!cell.walls[2]) reachCell(grid[i][j + 1], cell);  // Down
  if (!cell.walls[3]) reachCell(grid[i - 1][j], cell);  // Left
  if (!cell.walls[0]) reachCell(grid[i][j - 1], cell);  // Up
}

// Add a neighbor to the back of the queue the first time the search reaches it
function reachCell(next, from) {
  if (next.visited) return;
  next.visited = true;
  next.parent = from;
  queue.push(next);
  exploredCount++;
}

// ---------- Drawing helpers ----------
function drawMaze() {
  push();
  // center the maze under the title
  translate(floor((canvasWidth - cols * cellSize) / 2), titleHeight);

  // Cell colors first, then the walls on top of them
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].showFill();
    }
  }
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].showWalls();
    }
  }

  // The letters name the start and end cells for anyone who cannot tell green from red
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(13);
  text('S', (startCell.i + 0.5) * cellSize, (startCell.j + 0.5) * cellSize + 1);
  text('E', (endCell.i + 0.5) * cellSize, (endCell.j + 0.5) * cellSize + 1);
  textStyle(NORMAL);
  pop();
}

// The status line under the maze: what the search has done so far
function drawStatus() {
  let status;
  if (searchState === 'ready') {
    status = 'Press Solve to start the search';
  } else {
    const total = cols * rows;
    status = 'Explored: ' + exploredCount + ' of ' + total + ' cells';
    if (searchState === 'solved') {
      status += '   Path: ' + pathLength + ' cells';
    } else if (solveSpeed === 0) {
      status += '   Paused';
    }
    // shorter wording when the long one does not fit on a narrow canvas
    textSize(defaultTextSize);
    if (fontWidth(status) > canvasWidth - 20) {
      status = 'Explored: ' + exploredCount + '/' + total;
      if (searchState === 'solved') {
        status += '   Path: ' + pathLength;
      } else if (solveSpeed === 0) {
        status += '   Paused';
      }
    }
  }
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  textSize(defaultTextSize);
  text(status, canvasWidth / 2, drawHeight - statusHeight / 2);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Solve Speed: ' + solveSpeed, 10, drawHeight + 52);
}

// White text on a solid color, as in the first version of this MicroSim
function styleButton(button, backgroundColor) {
  button.style('background-color', backgroundColor);
  button.style('color', 'white');
  button.style('border', 'none');
  button.style('border-radius', '4px');
  button.style('font-size', '14px');
}

// The same button starts the search (green Solve) and clears it (maroon Reset)
function updateSolveButton() {
  const isReady = searchState === 'ready';
  solveButton.html(isReady ? 'Solve' : 'Reset');
  solveButton.style('background-color', isReady ? 'green' : 'maroon');
}

// ---------- Button handlers ----------
function toggleSolving() {
  if (searchState === 'ready') {
    searchState = 'solving';
    updateSolveButton();
  } else {
    resetSearch();
  }
}

function createNewMaze() {
  createMaze();
  generateMaze();
  resetSearch();
}

// ---------- Responsive design ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  speedSlider.size(canvasWidth - sliderLeftMargin - margin);
  // The maze fills the width of the canvas, so a new width may need a new maze
  if (columnsThatFit() !== cols) {
    createNewMaze();
  }
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.max(300, Math.floor(container.getBoundingClientRect().width));
  }
}

// The number of maze columns that fit between the left and right margins
function columnsThatFit() {
  return floor((canvasWidth - 2 * margin) / cellSize);
}

// ---------- Cell class: one square of the maze ----------
class Cell {
  constructor(i, j) {
    this.i = i;                              // column
    this.j = j;                              // row
    this.walls = [true, true, true, true];   // top, right, bottom, left
    this.visited = false;                    // used by the generator, then by the solver
    this.inSolution = false;                 // true when the cell is on the shortest path
    this.parent = null;                      // the cell the search came from
  }

  showFill() {
    const x = this.i * cellSize;
    const y = this.j * cellSize;
    noStroke();

    // Yellow for the shortest path, pink for the other cells the search has reached
    if (this.inSolution) {
      fill(pathColor);
      rect(x, y, cellSize, cellSize);
    } else if (this.visited && searchState !== 'ready') {
      fill(exploredColor);
      rect(x, y, cellSize, cellSize);
    }

    if (this === startCell) {
      fill(startColor);
      rect(x, y, cellSize, cellSize);
    } else if (this === endCell) {
      fill(endColor);
      rect(x, y, cellSize, cellSize);
    }
  }

  showWalls() {
    const x = this.i * cellSize;
    const y = this.j * cellSize;
    stroke('black');
    strokeWeight(2);

    if (this.walls[0]) line(x, y, x + cellSize, y);                         // Top
    if (this.walls[1]) line(x + cellSize, y, x + cellSize, y + cellSize);   // Right
    if (this.walls[2]) line(x, y + cellSize, x + cellSize, y + cellSize);   // Bottom
    if (this.walls[3]) line(x, y, x, y + cellSize);                         // Left
  }
}
