// Icons MicroSim - demonstrates clickable icons in control region
// This simulation shows a ball bouncing around inside a box with
// clickable Creative Commons and fullscreen icons in the lower right.
// The design is width responsive so it adjusts to the width of container as it resizes.

// global variables for width and height
let containerWidth; // this values is calculated by container upon init and changed on resize
// the temporary width of the entire canvas
let canvasWidth = 400;
// A fixed top drawing region above the interactive controls
let drawHeight = 400;
// control region height - use 30 pixels for each slider
let controlHeight = 30;
// The total hight of both the drawing region height + the control region height
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight; // fixed height on page determined by MicroSim author

// margin around the active plotting region
let margin = 25;
let sliderLeftMargin = 90;
let sliderRightMargin = 70;
// larger text so students in the back of the room can read the labels
let defaultTextSize = 16;

// application specific global variables
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

// Icon variables
let iconSize = 24;
let iconMargin = 5;
let ccIconX, ccIconY;  // Creative Commons icon position
let fsIconX, fsIconY;  // Fullscreen icon position

function setup() {
  updateCanvasSize() // set the container dimensions to get the correct container width
  const canvas = createCanvas(containerWidth, containerHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  textSize(16);
  speedSlider = createSlider(0, 20, speed);
  speedSlider.position(sliderLeftMargin, drawHeight + 5);
  speedSlider.size(canvasWidth - sliderLeftMargin - sliderRightMargin);
}

function draw() {
  // check for window resize
  updateCanvasSize();

  // fill drawing area with very light blue background - MicroSim standard style
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // fill control area with a white background
  fill('white');
  rect(0, drawHeight, canvasWidth, canvasHeight-drawHeight); 
  // get the new speed from the UI
  speed = speedSlider.value();

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(32);
  text('Icons Demo', canvasWidth/2, margin);
  // stroke();

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

  // draw the label and value for the speed slider
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Speed: ' + speed, 10, drawHeight+15);

  // Draw icons in lower right corner of control region
  drawIcons();
}

function drawIcons() {
  // Calculate icon positions (right to left)
  fsIconX = canvasWidth - iconMargin - iconSize/2;
  fsIconY = drawHeight + controlHeight/2;

  ccIconX = fsIconX - iconSize - iconMargin;
  ccIconY = fsIconY;

  // Draw Creative Commons icon
  fill('black');
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(20);
  text('ⓒ', ccIconX, ccIconY);
  // Draw Fullscreen icon
  text('⛶', fsIconX, fsIconY);
}

function mousePressed() {
  // Check if Creative Commons icon was clicked
  let distCC = dist(mouseX, mouseY, ccIconX, ccIconY);
  if (distCC < iconSize/2) {
    // Get the base URL (remove '/sims/icons/main.html' from current URL)
    let baseUrl = window.location.href.split('/sims/')[0];
    window.open(baseUrl + '/license/', '_blank');
    return;
  }

  // Check if Fullscreen icon was clicked
  let distFS = dist(mouseX, mouseY, fsIconX, fsIconY);
  if (distFS < iconSize/2) {
    // Open main.html in a new window/tab (same behavior as the fullscreen button)
    window.open('main.html', '_blank');
    return;
  }
}

// These two functions must be present for width responsiveness MicroSims
// this function is called whenever the browser window is resized
function windowResized() {
  // Update canvas size when the container resizes
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  // resize the speed slider and any other sliders here
  speedSlider.size(canvasWidth - sliderLeftMargin - sliderRightMargin);
  redraw();
}

function updateCanvasSize() {
  // Get the width of the <main> element
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);  // Avoid fractional pixels
  // update the canvas width to be the container width
  canvasWidth = containerWidth;
}