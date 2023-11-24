let grid;
let resolution = 5;
let cols;
let rows;
let start = false;

function setup() {
  createCanvas(640, 640);
  cols = width / resolution;
  rows = height / resolution;

  grid = make2DArray(cols, rows);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = floor(random(2));
    }
  }
}

function draw() {
  background(0);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * resolution;
      let y = j * resolution;
      if (grid[i][j] == 1) {
        fill(255);
        stroke(0);
        rect(x, y, resolution - 1, resolution - 1);
      }
    }
  }

  if (start) {
    stepGame();
  }

  drawButtons();
}

function stepGame() {
  let next = make2DArray(cols, rows);

  // Compute next based on grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let state = grid[i][j];
      let sum = 0;
      let neighbors = countNeighbors(grid, i, j);

      if (state == 0 && neighbors == 3) {
        next[i][j] = 1;
      } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
        next[i][j] = 0;
      } else {
        next[i][j] = state;
      }
    }
  }

  grid = next;
}

function mousePressed() {
  checkButtons();
}

function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
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

function checkButtons() {
  if (mouseX > 10 && mouseX < 110 && mouseY > 10 && mouseY < 35) {
    // Start button
    start = true;
  } else if (mouseX > 120 && mouseX < 220 && mouseY > 10 && mouseY < 35) {
    // Stop button
    start = false;
  } else if (mouseX > 230 && mouseX < 330 && mouseY > 10 && mouseY < 35) {
    // Step button
    start = false;
    stepGame();
  } else if (mouseX > 340 && mouseX < 440 && mouseY > 10 && mouseY < 35) {
    // Reset button
    setup();
  }
}

function drawButtons() {
  fill(255);
  rect(10, 10, 100, 25); // Start button
  rect(120, 10, 100, 25); // Stop button
  rect(230, 10, 100, 25); // Step button
  rect(340, 10, 100, 25); // Reset button

  fill(0);
  text("Start", 45, 28);
  text("Stop", 155, 28);
  text("Step", 265, 28);
  text("Reset", 375, 28);
}
