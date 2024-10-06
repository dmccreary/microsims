# Background Grid Controls

[Run the Background Grid Control Demo](./background-grid.html){ .md-button .md-button--primary }

## Key Points

1. The simulations have two regions
2. The plot region holds the animation
3. The controls region holds the interactive controls

## Sample Code

```js
// Standard sizes for Smartboard with controls at the bottom
let canvasWidth = 600;
let canvasHeight = 600;

let plotWidth = canvasWidth;
let plotHeight = 500;
let plotMargin = 50;

let controlWidth = canvasWidth;
let controlHeight = 100;

let thicknessSlider, spacingSlider;
let gridThickness = 1;
let gridSpacing = 50;

function setup() {
  createCanvas(canvasWidth, canvasHeight);  // Set the canvas size
  
  // Create thickness slider (range from 1 to 10)
  thicknessSlider = createSlider(.1, 1.25, .25, .05);
  thicknessSlider.position(190, plotHeight + 20);
  thicknessSlider.size(canvasWidth / 2);

  // Create spacing slider (range from 5 to 100, step of 5)
  spacingSlider = createSlider(5, 100, 25, 5);
  spacingSlider.position(190, plotHeight + 50);
  spacingSlider.size(canvasWidth / 2);

  // Call the function to draw the grid initially
  drawGrid();
}

function draw() {
  noStroke();
  fill("DodgerBlue");  // DodgerBlue background
  rect(0,0,canvasWidth, plotHeight)
  drawGrid(25);  // Call the drawGrid function with a grid spacing of 25
  
  // Draw the Controls Area
  fill('cornsilk')
  stroke(1);
  strokeWeight(1);
  rect(0,plotHeight,canvasWidth,controlHeight)

  // Get values from sliders
  gridThickness = thicknessSlider.value();
  gridSpacing = spacingSlider.value();

  // Draw grid using the current slider values
  drawGrid();

  // Display slider labels and values
  fill('black');
  noStroke();
  textSize(16);
  textAlign(LEFT, CENTER);
  text("Grid Thickness: " + gridThickness, 10, plotHeight + 30);
  text("Grid Spacing: " + gridSpacing, 10, plotHeight + 60);
}

function drawGrid() {
  for (let x = 0; x < plotWidth; x += gridSpacing) {
    if (x % 100 === 0) {
      strokeWeight(gridThickness * 4);  // Adjust thickness for every 100th line
    } else if (x % 50 === 0) {
      strokeWeight(gridThickness * 2);  // Adjust thickness for every 50th line
    } else {
      strokeWeight(gridThickness);  // Standard line thickness
    }
    stroke(255);  // Set the grid color to white
    line(x, 0, x, plotHeight);  // Draw vertical grid lines within the plot area
  }

  for (let y = 0; y < plotHeight; y += gridSpacing) {
    if (y % 100 === 0) {
      strokeWeight(gridThickness * 4);  // Adjust thickness for every 100th line
    } else if (y % 50 === 0) {
      strokeWeight(gridThickness * 2);  // Adjust thickness for every 50th line
    } else {
      strokeWeight(gridThickness);  // Standard line thickness
    }
    stroke(255);  // Set the grid color to white
    line(0, y, plotWidth, y);  // Draw horizontal grid lines within the plot area
  }
}

```