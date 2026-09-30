// MicroSim for a simple recursive tree
// This version has responsive design

// the width of the entire canvas for initialization
let canvasWidth = 500;
// The top drawing region above the interactive controls
let drawHeight = 400;
// control region height
let controlHeight = 40;
// The total height of both the drawing region height + the control region height
let canvasHeight = drawHeight + controlHeight;

// margin around the active plotting region
let margin = 25;
let sliderLeftMargin = 80;
// larger text so students in the back of the room can read the labels
let defaultTextSize = 16;

// For our responsive design.  We recalculate these by container upon resize
let containerHeight = canvasHeight;
let containerWidth =canvasWidth; 


let slider;

// global variables for drawing the tree
let branchLength = 120;
let branchShrink = 0.7

function setup() {
  // Create a canvas to match the parent container's size
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  textSize(16);
  
  slider = createSlider(0, 10, 5, 1);  // Depth control
  slider.position(sliderLeftMargin, drawHeight + 10);
  slider.size(canvasWidth - sliderLeftMargin - 20);
}

function draw() {
  updateCanvasSize();
  // draw a light gray boarder around regions
  stroke('silver');
  strokeWeight(1);
  
  // fill the background drawing area with light blue
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  
  // Draw the controls area background in white
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  
  let depth = slider.value();
  
  // draw the branch
  push(); // Save the background reference frame
    translate(width / 2, drawHeight);
    strokeWeight(8);
    stroke(139, 69, 19); // Brown color for branches
    branch(branchLength, depth);
  pop();  // restore the background reference frame
  
  // draw slider label
  fill('black');
  noStroke();
  text("Depth: " + depth, 10, drawHeight + 25);
}

function branch(len, depth) {
  if (depth == 0) {
    // Draw a leaf at the tip
    fill(34, 139, 34);
    noStroke();
    ellipse(0, 0, 10, 15);
    return;
  }
  
  // make the branches get thinner as we get deeper
  // as we go from depth 10 to 0 the width maps from 20 to 1
  strokeWeight(map(depth, 0, 10, 1, 20));
  stroke(139, 69, 19); // Brown color for branches

  // the branch
  line(0, 0, 0, -len);
  // move to the end of the branch
  translate(0, -len);

  push();
    // rotate clockwise
    rotate(PI / 6);
    branch(len * branchShrink, depth - 1);
  pop();

  push();
    // rotate counter clockwise
    rotate(-PI / 6);
    branch(len * branchShrink, depth - 1);
  pop();
}

function windowResized() {
  // Update canvas size when the container resizes
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  redraw();
  // resize the sliders to match the new canvasWidth
  slider.size(canvasWidth - sliderLeftMargin - 15);
}

function updateCanvasSize() {
    // Get the exact dimensions of the container
    const container = document.querySelector('main').getBoundingClientRect();
    containerWidth = Math.floor(container.width);  // Avoid fractional pixels
    canvasWidth = containerWidth;
}