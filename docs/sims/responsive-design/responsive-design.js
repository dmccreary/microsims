// MicroSim Template with region drawing parameters
// the width of the entire canvas
let canvasWidth = 400;
// The top drawing region above the interactive controls
let drawHeight = 400;
// control region height
let controlHeight = 50;
// The total hight of both the drawing region height + the control region height
let canvasHeight = drawHeight + controlHeight;
// margin around the active plotting region
let margin = 25;
let sliderLeftMargin = 105;
// larger text so students in the back of the room can read the labels
let defaultTextSize = 16;

// global variables for width and height
let containerWidth; // calculated by container upon resize
let containerHeight = canvasHeight; // fixed height on page

r = 20; // radius of the ball

// initial position
x = 100;
y = 100;
speed = 3; // default speed
// direction of motion
dx = speed;
dy = speed;
let speedSlider;
let radiusSlider;

function setup() {
    // Create a canvas to match the parent container's size
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, containerHeight);
    canvas.parent(document.querySelector('main'));

    speedSlider = createSlider(0, 20, 5);
    speedSlider.position(sliderLeftMargin, drawHeight + 5);
    speedSlider.size(canvasWidth - sliderLeftMargin - 15);
  
    radiusSlider = createSlider(2, 50, 25);
    radiusSlider.position(sliderLeftMargin, drawHeight + 25);
    radiusSlider.size(canvasWidth - sliderLeftMargin - 15);
}

function draw() {
  // Draw light gray outlines of the draw and controls regions
  stroke('silver');
  strokeWeight(1);
  // Draw the drawing area background in light blue
  fill('aliceblue');
  rect(0,0, canvasWidth, drawHeight);
  // Draw the controls area background in white
  fill('white');
  rect(0,drawHeight, canvasWidth, controlHeight);

  // get the new speed from the UI
  speed = speedSlider.value();
  // get the new radius
  r = radiusSlider.value();

  // adjust the x and y directions
  if (dx > 0) dx = speed;
     else dx = -speed;
  
  if (dy > 0) dy = speed;
     else dy = -speed;
  
  // Add the current speed to the position.
  x += dx;
  y += dy;

  // checks for edges right or left
  if ((x > canvasWidth-r) || (x < r)) {
    dx = dx * -1; // change direction
  }
  if ((y > drawHeight - r) || (y < r)) {
    dy = dy * -1;
  }

  fill('blue');
  circle(x, y, r*2);
  fill('black');
  
  // draw the label and values
  strokeWeight(0);
  textSize(16);
  textAlign(LEFT, CENTER);
  text('Speed: ' + speed, 10, drawHeight+15)
  text('Ball Size: ' + r, 10, drawHeight+35)

  fill('black');
  textSize(36);
  textAlign(CENTER, CENTER);
  // Display container dimensions
  text(`Width: ${containerWidth}px\nHeight: ${containerHeight}px`, 10, displayHeight - 20);
}

function windowResized() {
  // Update canvas size when the container resizes
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  redraw();
  // resize the sliders to match the new canvasWidth
  speedSlider.size(canvasWidth - sliderLeftMargin - 15);
  radiusSlider.size(canvasWidth - sliderLeftMargin - 15);
}

function updateCanvasSize() {
    // Get the width of the <main> element
    const container = document.querySelector('main').getBoundingClientRect();
    containerWidth = Math.floor(container.width);  // Avoid fractional pixels
    // set the canvas width to the container width
    canvasWidth = containerWidth;
}