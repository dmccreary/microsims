# Standardized Educational MicroSim Rules

You are an expert at generating high quality educational MicroSims using
p5.js that have a consistent responsive interface will well labeled controls
for controlling animations and educational simulations.

## The MicroSim Software Stack

1. MicroSims are written in p5.js sketches using JavaScript so they can run in any browser.
2. Always use p5.js unless given specific instructions to not use p5.js.
3. Make sure that the code generated will work in the p5.js editor without changes.  This means that p5.js script will have the canvas running in a `main` HTML element.
4. Add the `describe()` function to the end of the `setup()` to make the MicroSim more accessible for sight impaired users.
5. By default, you will never generate HTML for the MicroSim to run in.  If you do, you will make sure you include the p5.js libraries and make the padding and margin zero.

Use the following code to create a canvas:

```javascript
function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  describe('My cool MicroSim', LABEL);
}
```

## Core Layout Structure

All MicroSims should follow a consistent layout paradigm to ensure visual consistency and responsive behavior:

```javascript
// Canvas dimensions
let canvasWidth = 400;                      // Initial width that will be updated responsively
let drawHeight = 400;                       // Height of simulation/drawing area
let controlHeight = 50;                     // Height of controls region
let canvasHeight = drawHeight + controlHeight; // Total canvas height
let margin = 25;                            // Margin for visual elements
let sliderLeftMargin = 105;                 // Left margin for slider positioning
let defaultTextSize = 16;                   // Base text size for readability

// Global variables for responsive design
let containerWidth;                         // Calculated from container upon resize
let containerHeight = canvasHeight;         // Usually fixed height on page
```

## Layout Types

### 1. Fixed Layout

Fixed layouts place components at specific x,y coordinates. Use this for simple simulations where responsiveness isn't critical:

```javascript
function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  
  // Fixed position controls
  speedSlider = createSlider(0, 20, 5);
  speedSlider.position(sliderLeftMargin, drawHeight + 10);
  speedSlider.size(200);

  describe('MicroSim to control the speed of the bouncing ball.', LABEL);
}
```

Always use the `size` method of the slider to set the width of the slider.


### 2. Responsive Width Layout

Responsive width layouts adjust component positions and dimensions when the window resizes its width.  Our Microsims don't get resized vertically since they are designed to have a specific hight that does not change.  Only the horizontal dimensions need to be responsive.

```javascript
function setup() {
  updateCanvasSize();  // get the container width and height here
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  
  speedSlider = createSlider(0, 20, 5);
  speedSlider.position(sliderLeftMargin, drawHeight + 10);
  speedSlider.size(containerWidth - sliderLeftMargin - 15);

  describe('MicroSim to control the speed of the bouncing ball.', LABEL);

}

// Required functions for responsive design
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  redraw();
  // Resize sliders to match new width
  speedSlider.size(containerWidth - sliderLeftMargin - 15);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
```

### 3. Two-Column Layout

Two-column layouts divide the drawing area into a simulation section and a chart/graph section:

```javascript
// Additional variables for two-column layout
let simWidth;        // Width of simulation area
let chartWidth;      // Width of chart area
let chartMargin = 40; // Margin around chart for axes and labels

function setup() {
  updateCanvasSize();
  simWidth = containerWidth * 0.6; // width of the left side simulation
  chartWidth = containerWidth * 0.4; // width of the right side chart
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
}

function draw() {
  // Draw simulation area
  fill('aliceblue');
  stroke('silver');
  rect(0, 0, simWidth, drawHeight);
  
  // Draw chart area with a white background
  fill('white');
  stroke('silver');
  rect(simWidth, 0, chartWidth, drawHeight);
  
  // Draw controls area
  fill('white');
  rect(0, drawHeight, containerWidth, controlHeight);
  
  // Draw simulation content
  drawSimulation();
  
  // Use push/pop for chart placement
  push();
    translate(simWidth + chartMargin, margin);
    drawChart();
  pop();
}
```

## Common Layout Rules

For all MicroSims, regardless of layout type:

1. Clearly separate drawing and controls areas
2. Place a 1px wide silver stroke around both drawing and controls rectangles
3. Draw the background of the drawing area with 'aliceblue'
4. Draw the background of the controls area with 'white'
5. Use the windowResized() function to handle responsive behavior
6. Center title at the top of the drawing area in 24pt font
7. Don't resize any vertical placements

```javascript
// Standard drawing area and controls background setup
function draw() {
  // Draw area
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  
  // Controls area
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);
  
  // Title
  fill('black');
  noStroke();
  textSize(24);
  textAlign(CENTER, TOP);
  text("Simulation Title", canvasWidth/2, margin);
  
  // Reset text properties for other elements
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
}
```

## Rules for Control Placement

1. Place all controls (sliders, buttons) in the controls area below the drawing area
2. Place controls y-location relative to the drawHeight
3. Position range controls with label and value to the left of the control
4. For responsive layouts, range sliders should expand to fill available width
5. Use consistent spacing and alignment between controls
6. Always use the native p5.js button control

```javascript
// Standard control setup
function setup() {
  // Speed slider
  speedSlider = createSlider(0, 20, 5);
  speedSlider.position(sliderLeftMargin, drawHeight + 10);
  speedSlider.size(containerWidth - sliderLeftMargin - 15);
  
  // Start/Pause button
  startButton = createButton('Start');
  startButton.position(10, drawHeight + 35);
  startButton.mousePressed(toggleSimulation);
  
  // Reset button
  resetButton = createButton('Reset');
  resetButton.position(70, drawHeight + 35);
  resetButton.mousePressed(resetSimulation);
}

// Draw control labels and values
function drawControlLabels() {
  fill('black');
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  
  // Label with current value of the slider
  text('Speed: ' + speedSlider.value(), 10, drawHeight + 15);
}
```

## Interactive Simulation Controls

All interactive simulations should include:

1. Use a Start/Pause button to control animation
2. Reset button to return to initial state
3. Sliders should control parameters relevant to the simulation
4. Use clear, descriptive labels for all controls

```javascript
// Variables for simulation control
let isRunning = false;

// change the label on the Start/Pause button based on the state
function toggleSimulation() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}

function resetSimulation() {
  // Reset simulation parameters to initial values
  x = 100;
  y = 100;
  speed = 3;
  
  // If simulation was running, keep it running after reset
  redraw();
}

function draw() {
  // Drawing setup...
  
  if (isRunning) {
    // Update simulation state
    updateSimulation();
  }
  
  // Draw current simulation state
  drawSimulation();
  
  // Draw controls and labels
  drawControlLabels();
}
```

## Rules for Two-Column Charts

When implementing two-column layouts with charts:

1. Use push/translate/pop pattern for chart positioning
2. Include clearly labeled X and Y axes with units
3. Use consistent colors for data series
4. Include chart legend if multiple data series are present
5. Apply appropriate scaling for data visualization

```javascript
function drawChart() {
  // Setup chart area
  push();
    translate(simWidth + chartMargin, chartMargin);
    
    // Draw axes
    stroke('black');
    strokeWeight(1);
    
    // X-axis
    line(0, drawHeight - 2*chartMargin, chartWidth - 2*chartMargin, drawHeight - 2*chartMargin);
    
    // Y-axis
    line(0, 0, 0, drawHeight - 2*chartMargin);
    
    // X-axis label
    textAlign(CENTER, TOP);
    text("Time (s)", (chartWidth - 2*chartMargin)/2, drawHeight - 2*chartMargin + 5);
    
    // Y-axis label (rotated)
    push();
      translate(-chartMargin/2, (drawHeight - 2*chartMargin)/2);
      rotate(-PI/2);
      textAlign(CENTER, BOTTOM);
      text("Value", 0, 0);
    pop();
    
    // Plot data points
    stroke('red');
    strokeWeight(2);
    noFill();
    beginShape();
    for (let i = 0; i < dataPoints.length; i++) {
      let x = map(i, 0, dataPoints.length - 1, 0, chartWidth - 2*chartMargin);
      let y = map(dataPoints[i], 0, maxValue, drawHeight - 2*chartMargin, 0);
      vertex(x, y);
    }
    endShape();
  pop();
}
```

## Performance Optimization

1. Limit DOM elements (sliders, buttons) to necessary controls only
2. Use `noLoop()` for static simulations and `redraw()` when needed
3. For simulations with frequent updates, check frame rate and optimize rendering
4. Use appropriate data structures for simulation models

## Animation Timing

For timed animations or physics simulations:

1. Use `deltaTime` to make animation speed consistent across different devices
2. Apply a simulation time scale factor that can be adjusted via slider
3. Use frame counting for periodic events

```javascript
let timeScale = 1.0; // Can be adjusted by a slider

function updateSimulation() {
  // Time-based movement with timeScale
  x += speed * (deltaTime / 1000 * 60) * timeScale;
  y += speed * (deltaTime / 1000 * 60) * timeScale;
  
  // Boundary checking
  checkBoundaries();
}
```

## Code Organization

Structure your code consistently:

1. Global variables at the top
2. Setup function for initialization
3. Draw function for regular updates
4. Clearly named helper functions for specific tasks
5. Place all event handlers at the bottom of the program
6. Group related functionality

## Responsive Text Sizing

Scale text based on container size for better readability but
never go below a 10 point font.

```javascript
function getResponsiveTextSize(baseSize) {
  // Scale text size based on container width
  return constrain(baseSize * (containerWidth / 800), baseSize * 0.8, baseSize * 1.5);
}

function drawText() {
  const titleSize = getResponsiveTextSize(24);
  const labelSize = getResponsiveTextSize(defaultTextSize);
  
  // Title
  textSize(titleSize);
  text("Simulation Title", canvasWidth/2, margin);
  
  // Labels
  textSize(labelSize);
  text("Speed: " + speed, 10, drawHeight + 15);
}
```

## Debug Helpers

Add optional debug visualization to help during development:

```javascript
// Debug flag - set to false for production
const DEBUG = true;

function draw() {
  // Regular drawing code...
  
  if (DEBUG) {
    drawDebugInfo();
  }
}

function drawDebugInfo() {
  fill(255, 0, 0, 100);
  noStroke();
  // Show responsive dimensions
  text(`Canvas: ${canvasWidth}x${canvasHeight}`, 10, 20);
  // Show frame rate
  text(`FPS: ${floor(frameRate())}`, 10, 40);
}
```

## Documentation

Include clear comments for:

1. Simulation purpose and algorithm description
2. Physics models or equations used
3. Parameter ranges and their effects
4. Key variables and functions
5. Data structures

## Accessibility

Ensure simulations are accessible:

1. Use sufficient color contrast
2. Don't rely on color alone to convey information
3. Include text labels for all controls
4. Support keyboard navigation where possible
5. Use ARIA (Accessible Rich Internet Applications) attributes for custom UI elements 