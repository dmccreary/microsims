// Maze Simulation with generation and solving
// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 65;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Maze parameters
let cols, rows;
let cellSize = 20;
let grid = [];
let current;
let stack = [];

// Solving parameters
let solving = false;
let solveStack = [];
let solutionPath = [];
let solveSpeed = 10;
let solveSpeedSlider;

// UI elements
let solveButton;
let resetButton;
let newMazeButton;

// Start and end points
let start, end;

function setup() {
    const canvas = createCanvas(canvasWidth, canvasHeight);
    // place the canvas in the main element of the HTML page
    var mainElement = document.querySelector('main');
    canvas.parent(mainElement);
    textSize(defaultTextSize);
    
    // Create solver speed slider
    solveSpeedSlider = createSlider(0, 60, 8, 1);
    solveSpeedSlider.position(margin, drawHeight + 40);
    solveSpeedSlider.size(canvasWidth - 2*margin);
    
    // Create buttons using p5.js createButton function
    solveButton = createButton('Solve');
    solveButton.position(canvasWidth - 100, drawHeight + 10);
    solveButton.size(80, 30);
    solveButton.mousePressed(startSolving);
    solveButton.style('background-color', 'green');
    solveButton.style('color', 'white');
    solveButton.style('border', 'none');
    solveButton.style('border-radius', '4px');
    
    resetButton = createButton('Reset');
    resetButton.position(canvasWidth - 100, drawHeight + 10);
    resetButton.size(80, 30);
    resetButton.mousePressed(resetMaze);
    resetButton.style('background-color', 'maroon');
    resetButton.style('color', 'white');
    resetButton.style('border', 'none');
    resetButton.style('border-radius', '4px');
    resetButton.hide(); // Initially hidden
    
    newMazeButton = createButton('New Maze');
    newMazeButton.position(canvasWidth - 200, drawHeight + 10);
    newMazeButton.size(90, 30);
    newMazeButton.mousePressed(createNewMaze);
    newMazeButton.style('background-color', 'blue');
    newMazeButton.style('color', 'white');
    newMazeButton.style('border', 'none');
    newMazeButton.style('border-radius', '4px');
    
    // Initialize maze - note this is a responsive design
    cols = floor((canvasWidth - 2*margin) / cellSize);
    rows = floor((drawHeight - 2*margin) / cellSize);
    
    // Create maze cells
    createMaze();
    
    // Generate maze using Depth First Search (DFS)
    generateMaze();
    
    // Set start and end points
    // green square in upper left corner
    start = grid[0][0];
    // red square in lower right corner
    end = grid[cols-1][rows-1];
    
    // Setup for solving
    resetSolving();
}

function draw() {
    // Background for drawing area
    fill('aliceblue');
    stroke('silver');
    rect(0, 0, canvasWidth, drawHeight);
    
    // Background for controls area
    fill('white');
    rect(0, drawHeight, canvasWidth, controlHeight);
    
    // Update solve speed from slider
    solveSpeed = solveSpeedSlider.value();
    
    // Draw the maze
    drawMaze();
    
    // If solving, iterate the solve algorithm based on the speed
    if (solving) {
        // Control speed with a counter
        if (frameCount % Math.max(1, Math.floor(60 / solveSpeed)) === 0) {
            solveMazeStep();
        }
    }
    
    // Draw UI elements
    drawUI();
}

function createMaze() {
    // Initialize grid of cells
    grid = new Array(cols);
    for (let i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
        for (let j = 0; j < rows; j++) {
            grid[i][j] = new Cell(i, j);
        }
    }
    
    // Reset start and end points
    start = grid[0][0];
    end = grid[cols-1][rows-1];
}

function generateMaze() {
    // Reset grid
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].visited = false;
        }
    }
    
    // Start from top-left cell
    current = grid[0][0];
    current.visited = true;
    stack = [current];
    
    // Generate maze using DFS
    while (stack.length > 0) {
        current = stack.pop();
        let next = getUnvisitedNeighbor(current);
        
        if (next) {
            stack.push(current);
            removeWalls(current, next);
            next.visited = true;
            stack.push(next);
        }
    }
    
    // Reset visited status for solving
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].visited = false;
        }
    }
    
    // Update start and end references
    start = grid[0][0];
    end = grid[cols-1][rows-1];
}

function getUnvisitedNeighbor(cell) {
    let neighbors = [];
    let i = cell.i;
    let j = cell.j;
    
    // Check all four neighbors
    if (i > 0 && !grid[i-1][j].visited) neighbors.push(grid[i-1][j]);          // Left
    if (i < cols-1 && !grid[i+1][j].visited) neighbors.push(grid[i+1][j]);     // Right
    if (j > 0 && !grid[i][j-1].visited) neighbors.push(grid[i][j-1]);          // Top
    if (j < rows-1 && !grid[i][j+1].visited) neighbors.push(grid[i][j+1]);     // Bottom
    
    if (neighbors.length > 0) {
        let r = floor(random(0, neighbors.length));
        return neighbors[r];
    } else {
        return undefined;
    }
}

function removeWalls(a, b) {
    let x = a.i - b.i;
    let y = a.j - b.j;
    
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

function resetSolving() {
    solving = false;
    
    // Reset cell visited status
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].visited = false;
            grid[i][j].inSolution = false;
        }
    }
    
    // Initialize solving with BFS
    solveStack = [];
    solutionPath = [];
    
    // Set the correct button visibility
    solveButton.show();
    resetButton.hide();
    
    // We'll mark start as visited when we begin solving
    start.visited = true;
    solveStack.push({
        cell: start,
        path: [start]
    });
}

function solveMazeStep() {
    if (solveStack.length > 0) {
        let current = solveStack.shift();  // BFS uses queue (shift from front)
        let cell = current.cell;
        let path = current.path;
        
        // Check if we've reached the end - using both reference and position check
        if (cell === end || (cell.i === cols-1 && cell.j === rows-1)) {
            solving = false;
            solutionPath = path;
            
            // Mark cells in solution path
            for (let i = 0; i < solutionPath.length; i++) {
                solutionPath[i].inSolution = true;
            }
            console.log("Solution found!");
            
            // Update button visibility
            solveButton.hide();
            resetButton.show();
            return;
        }
        
        // Check all four directions
        let i = cell.i;
        let j = cell.j;
        
        // For each neighbor, check if we can move there (no wall in between)
        // Right
        if (i < cols-1 && !grid[i+1][j].visited && !cell.walls[1]) {
            grid[i+1][j].visited = true;
            let newPath = path.slice();  // Copy the path
            newPath.push(grid[i+1][j]);  // Add new cell to path
            solveStack.push({
                cell: grid[i+1][j],
                path: newPath
            });
        }
        
        // Down
        if (j < rows-1 && !grid[i][j+1].visited && !cell.walls[2]) {
            grid[i][j+1].visited = true;
            let newPath = path.slice();
            newPath.push(grid[i][j+1]);
            solveStack.push({
                cell: grid[i][j+1],
                path: newPath
            });
        }
        
        // Left
        if (i > 0 && !grid[i-1][j].visited && !cell.walls[3]) {
            grid[i-1][j].visited = true;
            let newPath = path.slice();
            newPath.push(grid[i-1][j]);
            solveStack.push({
                cell: grid[i-1][j],
                path: newPath
            });
        }
        
        // Up
        if (j > 0 && !grid[i][j-1].visited && !cell.walls[0]) {
            grid[i][j-1].visited = true;
            let newPath = path.slice();
            newPath.push(grid[i][j-1]);
            solveStack.push({
                cell: grid[i][j-1],
                path: newPath
            });
        }
    } else {
        // No solution found
        solving = false;
        console.log("No solution found");
        
        // Update button visibility
        solveButton.hide();
        resetButton.show();
    }
}

function drawMaze() {
    translate(margin, margin);
    
    // Draw cells
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].show();
        }
    }
    
    // Draw start and end points
    fill(0, 255, 0, 100);
    noStroke();
    rect(start.i * cellSize, start.j * cellSize, cellSize, cellSize);
    
    fill(255, 0, 0, 100);
    rect(end.i * cellSize, end.j * cellSize, cellSize, cellSize);
    
    // Reset translation
    translate(-margin, -margin);
}

function drawUI() {
    // Draw controls and labels
    fill(0);
    text("Solve Speed: " + solveSpeed, margin, drawHeight + 25);
    
    // Toggle button visibility based on state
    if (solving || solutionPath.length > 0) {
        solveButton.hide();
        resetButton.show();
    }
}

// Button event handlers
function startSolving() {
    resetSolving();
    solving = true;
    
    // Switch button visibility
    solveButton.hide();
    resetButton.show();
}

function resetMaze() {
    resetSolving();
    
    // Switch button visibility
    resetButton.hide();
    solveButton.show();
}

function createNewMaze() {
    createMaze();
    generateMaze();
    resetSolving();
    
    // Set correct button visibility
    resetButton.hide();
    solveButton.show();
}

// Cell class to represent each cell in the maze
class Cell {
    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.walls = [true, true, true, true];  // top, right, bottom, left
        this.visited = false;
        this.inSolution = false;
    }
    
    show() {
        let x = this.i * cellSize;
        let y = this.j * cellSize;
        
        // Fill visited cells during solving
        if (this.visited && solving) {
            noStroke();
            fill(255, 0, 255, 100);
            rect(x, y, cellSize, cellSize);
        }
        
        // Fill solution path cells
        if (this.inSolution) {
            noStroke();
            fill(255, 255, 0, 150);
            rect(x, y, cellSize, cellSize);
        }
        
        stroke(0);
        strokeWeight(2);
        
        // Draw walls
        if (this.walls[0]) line(x, y, x + cellSize, y);                     // Top
        if (this.walls[1]) line(x + cellSize, y, x + cellSize, y + cellSize); // Right
        if (this.walls[2]) line(x, y + cellSize, x + cellSize, y + cellSize); // Bottom
        if (this.walls[3]) line(x, y, x, y + cellSize);                     // Left
    }
}