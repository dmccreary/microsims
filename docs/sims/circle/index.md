---
title: Circle
description: An interactive MicroSim demonstrating circle.
quality_score: 57
image: /sims/circle/circle.png
og:image: /sims/circle/circle.png
twitter:image: /sims/circle/circle.png
social:
   cards: false
---
# Circle

<iframe src="main.html" height="450px" scrolling="no"></iframe>

[Run the Circle Slider MicroSim](./main.html){ .md-button .md-button--primary }

Here is a simple example that you can start with.  The ChatGPT prompt would be the following:

!!! prompt
  Generate a single p5.js sketch file that draws a blue circle
  in the center of a 400x400 canvas.

  Create a range control slider that allows the radius to be
  adjusted from 0 to 200.

  Use the text() function within the draw() function to display the
  label and current value of the radius.

  Use a responsive design and adjust the slider when the window is resized.


```javascript
let radiusSlider;
let radius = 0;

function setup() {
  createCanvas(400, 400);
  
  // Create the radius slider
  radiusSlider = createSlider(0, 200, 100);
  radiusSlider.position(10, 10);
}

function draw() {
  background(220);
  
  // Fetch the current radius from the slider
  radius = radiusSlider.value();

  // Draw the circle
  fill(0, 0, 255);
  noStroke();
  circle(width / 2, height / 2, radius * 2);

  // Display the radius value
  fill(0);
  text("Radius: " + radius, 10, 50);
}
```

## Full Responsive Version

```js
// Circle MicroSim with responsive design
// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 100;
let defaultTextSize = 16;

// Global variables for width and height
let containerWidth; // calculated by container upon resize
let containerHeight = canvasHeight; // fixed height on page

// Circle parameters
let radius = 60;
let radiusSlider;

function setup() {
    // Create a canvas to match the parent container's size
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, containerHeight);
    canvas.parent(document.querySelector('main'));
    textSize(defaultTextSize);
    
    // Create slider for radius control
    radiusSlider = createSlider(0, 200, radius, 1);
    radiusSlider.position(sliderLeftMargin, drawHeight + 12);
    radiusSlider.size(canvasWidth - sliderLeftMargin - 20);
}

function draw() {
    // Draw the display area
    fill('aliceblue');
    stroke('silver');
    strokeWeight(1);
    rect(0, 0, canvasWidth, drawHeight);
    
    // Draw the controls area
    fill('white');
    rect(0, drawHeight, canvasWidth, controlHeight);
    
    // Get the current radius from the slider
    radius = radiusSlider.value();
    
    // Draw the circle
    fill('blue');
    noStroke();
    circle(canvasWidth/2, drawHeight/2, radius*2);
    
    // Draw the label and value
    fill('black');
    strokeWeight(0);
    textSize(defaultTextSize);
    textAlign(LEFT, CENTER);
    text('Radius: ' + radius, 10, drawHeight + 20);
}

function windowResized() {
    // Update canvas size when the container resizes
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
    
    // Resize the slider to match the new canvasWidth
    radiusSlider.size(canvasWidth - sliderLeftMargin - 20);
}

function updateCanvasSize() {
    // Get the exact dimensions of the container
    const container = document.querySelector('main').getBoundingClientRect();
    containerWidth = Math.floor(container.width);  // Avoid fractional pixels
    canvasWidth = containerWidth;
}
```
