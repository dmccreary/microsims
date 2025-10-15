// Yin-Yang Symbol MicroSim
// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 105;
let controlTextSize = 16;

// Global variables for responsive design
let containerWidth; // calculated by container upon resize
let containerHeight = canvasHeight; // fixed height on page

// Yin-Yang parameters
let circleSize = 200; // default size of the yin-yang symbol
let sizeSlider;
let yinTextInput, yangTextInput;
let drawingTextSize = 24;
let yinText = "LLM";
let yangText = "EKG";

function setup() {
  // Create a canvas to match the parent container's size
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(controlTextSize);
  
  // Create size slider
  sizeSlider = createSlider(50, 350, 300);
  sizeSlider.position(sliderLeftMargin, drawHeight + 20);
  sizeSlider.size(containerWidth - sliderLeftMargin - margin);
  
  // Create text inputs
  yinTextInput = createInput(yinText);
  yinTextInput.position(sliderLeftMargin, drawHeight + 50);
  yinTextInput.size(containerWidth/2 - sliderLeftMargin - margin*4);
  yinTextInput.input(updateYinText);
  
  yangTextInput = createInput(yangText);
  yangTextInput.position(containerWidth/2 + 10, drawHeight + 50);
  yangTextInput.size(containerWidth/2 - 40);
  yangTextInput.input(updateYangText);
  
  describe('A Yin-Yang symbol MicroSim that allows adjusting the size and adding custom text to each side.', LABEL);
}

function draw() {
  // Draw area
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  
  // Controls area
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);
  
  // Update circle size from slider
  circleSize = sizeSlider.value();
  drawingTextSize = circleSize/8; 
  
  // Draw the Yin-Yang symbol
  drawYinYang();
  
  // Draw control labels
  drawControlLabels();
}

function drawYinYang() {
  // Calculate position at center of draw area
  let centerX = canvasWidth / 2;
  let centerY = drawHeight / 2;
  let radius = circleSize / 2;
  
  push();
  translate(centerX, centerY);
  
  // Draw outer circle
  stroke(0);
  strokeWeight(1);
  fill(255);
  circle(0, 0, circleSize);
  
  // Draw the yin-yang symbol with proper teardrop shapes
  push();
  
  // First, draw the full white circle as background
  fill(255);
  noStroke();
  circle(0, 0, circleSize);
  
  // Create the black half with the S-curve
  fill(0);
  noStroke();
  
  // Draw the black half (right side)
  beginShape();
    // Start at the top of the circle
    vertex(0, -radius);
    
    // Go around the right side of the circle
    for (let angle = -HALF_PI; angle <= HALF_PI; angle += 0.05) {
      let x = radius * cos(angle);
      let y = radius * sin(angle);
      vertex(x, y);
    }
    
    // Continue to bottom of the circle
    vertex(0, radius);
    
    // Now create the S-curve by going around the white teardrop
    for (let angle = HALF_PI; angle <= HALF_PI + PI; angle += 0.05) {
      let x = radius/2 * cos(angle);
      let y = radius/2 * sin(angle) + radius/2; // Offset to position at bottom half
      vertex(x, y);
    }
    
    // Close the shape
    endShape(CLOSE);
  
  // Draw white teardrop in the top half (needed for proper overlap)
  fill(255);
  beginShape();
    // Start at the center
    vertex(0, 0);
    
    // Top half of the circle
    for (let angle = -2*PI ; angle < HALF_PI; angle += 0.05) {
      let x = radius/2 * cos(angle);
      let y = radius/2 * sin(angle) - radius/2; // Offset to position at top half
      vertex(x, y);
    }
    
    // Close the shape
    endShape(CLOSE);
  
  pop();
  
  // Draw small circles
  
  // Black circle in white area
  fill(0);
  let smallRadius = radius / 6;
  circle(0, -radius/2, smallRadius * 2);
  
  // White circle in black area
  fill(255);
  circle(0, radius/2, smallRadius * 2);
  
  // Draw text in each half
  let textSizeVal = constrain(radius / 5, 10, 24);
  textSize(drawingTextSize);
  textAlign(CENTER, CENTER);
  
  // Yin - white text in black area
  fill(255);
  text(yinText, radius/2, radius/4);
  
  // Yang - black text in white area
  fill(0);
  text(yangText, -radius/2, -radius/4);
  
  pop();
}

function drawControlLabels() {
  fill('black');
  noStroke();
  textSize(controlTextSize);
  textAlign(LEFT, CENTER);
  
  // Label with current value of the slider
  text(`Size: ${circleSize}`, margin, drawHeight + 30);
  
  // Labels for text inputs
  text('Bottom Text:', margin/2, drawHeight + 60);
  
  // Position the Yang text label to align with the Yang text input
  textAlign(RIGHT, CENTER);
  text('Top Text:', containerWidth/2, drawHeight + 60);
  textAlign(LEFT, CENTER);
}

function updateYinText() {
  yinText = yinTextInput.value();
}

function updateYangText() {
  yangText = yangTextInput.value();
}

function windowResized() {
  // Update canvas size when the container resizes
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  
  // Resize and reposition controls
  sizeSlider.size(containerWidth - sliderLeftMargin - margin);
  
  yinTextInput.size(containerWidth/2 - sliderLeftMargin - margin*4);
  
  yangTextInput.position(containerWidth/2 + 10, drawHeight + 50);
  yangTextInput.size(containerWidth/2 - 40);
  
  redraw();
}

function updateCanvasSize() {
  // Get the exact dimensions of the container
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);  // Avoid fractional pixels
  canvasWidth = containerWidth;
}