// bouncing ball - version 2
// with radius added to edge check and drawing region above controls

// global variables for width and height
let containerWidth; // this values is calculated by container upon init and changed on resize
// the width of the entire canvas
let canvasWidth = 400;
// The top drawing region above the interactive controls
let drawHeight = 400;
// control region height
let controlHeight = 30;
// The total hight of both the drawing region height + the control region height
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight; // fixed height on page determined by MicroSim author

// margin around the active plotting region
let margin = 25;
let sliderLeftMargin = 90;
// larger text so students in the back of the room can read the labels
let defaultTextSize = 16;
let r = 20; // radius of the ball

// set the initial position of the ball in the middle of the drawing region
let x = canvasWidth/2;
let y = drawHeight/2;
let speed = 3; // default speed
// direction of motion
let dx = speed;
let dy = speed;
// global variable for speed slider since the resize function needs to access it
let speedSlider;

function setup() {
  updateCanvasSize() // set the container dimensions to get the correct container width
  const canvas = createCanvas(containerWidth, containerHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  textSize(16);
  speedSlider = createSlider(0, 20, speed);
  speedSlider.position(sliderLeftMargin, drawHeight + 5);
  speedSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function draw() {
  // check for window resize
  updateCanvasSize();

  // fill drawing area with very light blue background
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // fill control area with a white background
  fill('white');
  rect(0, drawHeight, canvasWidth, canvasHeight-drawHeight); 
  // get the new speed from the UI
  speed = speedSlider.value();

  // adjust the x and y directions
  if (dx > 0) dx = speed;
     else dx = -speed;
  
  if (dy > 0) dy = speed;
     else dy = -speed;
  
  // Add the current speed to the position.
  x += dx;
  y += dy;

  // checks for edges right or left
  if ((x > width-r) || (x < r)) {
    dx = dx * -1; // change direction
  }
  if ((y > drawHeight - r) || (y < r)) {
    dy = dy * -1;
  }

  // draw the ball
  fill('blue');
  circle(x, y, r*2);

  // draw the speed label
  fill('black');
  noStroke();
  text('Speed: ' + speed, 10, drawHeight+20);
}

// this function is called whenever the browser window is resized
function windowResized() {
  // Update canvas size when the container resizes
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  // reposition and resize the speed slider
  speedSlider.size(canvasWidth - sliderLeftMargin - margin);
  redraw();
}

function updateCanvasSize() {
  // Get the width of the <main> element
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);  // Avoid fractional pixels
  // set the canvas width to the container width
  canvasWidth = containerWidth;
}