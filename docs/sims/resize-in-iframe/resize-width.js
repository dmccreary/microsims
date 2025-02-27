// Responsive width - resize to the width of the container

// global variables
let container; // The HTML element that contains the canvas
let canvasWidth = 400; // Elastic width of container
let canvasHeight = 400; // Maintain the fixed height

function setup() {
  // Select the container dynamically using the document object
  // make sure you have a <main> element in your HTML
  container = document.querySelector('main');
  
  // Create a canvas with the same width as the container and a fixed height
  canvasWidth = container.offsetWidth;
  let canvas = createCanvas(canvasWidth, canvasHeight);
  
  // Attach the canvas to the container
  canvas.parent(container);
  
  // Set text properties
  textSize(36);
  textAlign(CENTER, CENTER);
  noLoop();
}

function draw() {
  background('aliceblue');
  
  // Display the canvas width and height as text in center of canvas
  const canvasWidth = container.offsetWidth;
  text(`Width: ${canvasWidth}px\nHeight: ${canvasHeight}px`, canvasWidth / 2, canvasHeight / 2);
}

function windowResized() {
  // Update the canvas width when the window is resized
  canvasWidth = container.offsetWidth;
  resizeCanvas(canvasWidth, canvasHeight);
}
