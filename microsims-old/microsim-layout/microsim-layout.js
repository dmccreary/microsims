// MicroSim Architecture Diagram
// Shows the standard two-region layout with labeled dimensions
// Demonstrates the Drawing Region and Control Region architecture

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;

// Colors
const aliceBlue = '#F0F8FF';
const dimGray = '#333333';
const lightGray = '#CCCCCC';

// Sample ball for visualization
let ballX, ballY;
let ballVX = 2;
let ballVY = -3;
let ballRadius = 15;
let trajectory = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Initialize ball position
  ballX = canvasWidth / 2;
  ballY = drawHeight / 2;

  describe('MicroSim Architecture Diagram showing the standard two-region layout with Drawing Region and Control Region', LABEL);
}

function draw() {
  updateCanvasSize();
  background(255);

  // Draw the main canvas outline
  stroke(dimGray);
  strokeWeight(2);
  noFill();
  rect(0, 0, canvasWidth, canvasHeight);

  // Draw the Drawing Region (alice blue)
  fill(aliceBlue);
  stroke('silver');
  strokeWeight(1);
  rect(1, 1, canvasWidth - 2, drawHeight - 1);

  // Draw the Control Region (white)
  fill('white');
  rect(1, drawHeight, canvasWidth - 2, controlHeight - 1);

  // Draw dividing line between regions
  stroke('silver');
  strokeWeight(2);
  line(0, drawHeight, canvasWidth, drawHeight);

  // Draw margin dashed lines
  drawDashedRect(margin, margin, canvasWidth - 2 * margin, drawHeight - 2 * margin);

  // Update and draw sample ball with trajectory
  updateBall();
  drawTrajectory();
  drawBall();

  // Draw all dimension annotations
  drawDimensions();

  // Draw region labels
  drawRegionLabels();

  // Draw sample slider in control region
  drawSampleSlider();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  // Reset ball position to stay within bounds
  ballX = constrain(ballX, margin + ballRadius, canvasWidth - margin - ballRadius);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
  }
}

function drawDashedRect(x, y, w, h) {
  stroke(lightGray);
  strokeWeight(1);
  drawingContext.setLineDash([5, 5]);
  noFill();
  rect(x, y, w, h);
  drawingContext.setLineDash([]);
}

function updateBall() {
  // Simple bouncing ball physics
  ballX += ballVX;
  ballY += ballVY;

  // Bounce off margins
  if (ballX < margin + ballRadius || ballX > canvasWidth - margin - ballRadius) {
    ballVX *= -1;
    ballX = constrain(ballX, margin + ballRadius, canvasWidth - margin - ballRadius);
  }
  if (ballY < margin + ballRadius || ballY > drawHeight - margin - ballRadius) {
    ballVY *= -1;
    ballY = constrain(ballY, margin + ballRadius, drawHeight - margin - ballRadius);
  }

  // Store trajectory points
  trajectory.push({x: ballX, y: ballY});
  if (trajectory.length > 50) {
    trajectory.shift();
  }
}

function drawTrajectory() {
  noFill();
  stroke(100, 150, 255, 100);
  strokeWeight(2);
  beginShape();
  for (let i = 0; i < trajectory.length; i++) {
    let alpha = map(i, 0, trajectory.length, 50, 200);
    vertex(trajectory[i].x, trajectory[i].y);
  }
  endShape();
}

function drawBall() {
  // Draw ball shadow
  fill(0, 0, 0, 30);
  noStroke();
  ellipse(ballX + 3, ballY + 3, ballRadius * 2);

  // Draw ball
  fill(70, 130, 200);
  stroke(50, 100, 170);
  strokeWeight(2);
  ellipse(ballX, ballY, ballRadius * 2);

  // Ball highlight
  fill(255, 255, 255, 100);
  noStroke();
  ellipse(ballX - 5, ballY - 5, ballRadius * 0.8);
}

function drawDimensions() {
  textSize(12);
  textAlign(CENTER, CENTER);

  // Canvas width dimension (top)
  drawHorizontalDimension(0, -15, canvasWidth, 'canvasWidth = ' + canvasWidth);

  // Canvas height dimension (right side)
  drawVerticalDimension(canvasWidth + 15, 0, canvasHeight, 'canvasHeight = ' + canvasHeight);

  // Draw height dimension (right side, inside)
  push();
  fill(dimGray);
  noStroke();
  textSize(11);
  textAlign(LEFT, CENTER);
  text('drawHeight = ' + drawHeight, canvasWidth - 110, drawHeight / 2);

  // Draw small arrows for drawHeight
  stroke(dimGray);
  strokeWeight(1);
  line(canvasWidth - 115, drawHeight / 2 - 15, canvasWidth - 115, 5);
  line(canvasWidth - 115, drawHeight / 2 + 15, canvasWidth - 115, drawHeight - 5);
  // Arrow heads
  drawArrowHead(canvasWidth - 115, 5, 'up');
  drawArrowHead(canvasWidth - 115, drawHeight - 5, 'down');
  pop();

  // Control height dimension
  push();
  fill(dimGray);
  noStroke();
  textSize(11);
  textAlign(CENTER, CENTER);
  text('controlHeight = ' + controlHeight, canvasWidth / 2, drawHeight + controlHeight / 2 + 12);
  pop();

  // Margin annotations
  drawMarginAnnotations();
}

function drawHorizontalDimension(x, y, width, label) {
  push();
  stroke(dimGray);
  strokeWeight(1);

  // Horizontal line
  line(x + 5, y, x + width - 5, y);

  // Arrow heads
  drawArrowHead(x + 5, y, 'left');
  drawArrowHead(x + width - 5, y, 'right');

  // Label
  fill(dimGray);
  noStroke();
  textSize(12);
  textAlign(CENTER, BOTTOM);
  text(label, x + width / 2, y - 3);
  pop();
}

function drawVerticalDimension(x, y, height, label) {
  push();
  stroke(dimGray);
  strokeWeight(1);

  // Vertical line
  line(x, y + 5, x, y + height - 5);

  // Arrow heads
  drawArrowHead(x, y + 5, 'up');
  drawArrowHead(x, y + height - 5, 'down');

  // Label (rotated)
  fill(dimGray);
  noStroke();
  textSize(12);
  push();
  translate(x + 15, y + height / 2);
  rotate(HALF_PI);
  textAlign(CENTER, BOTTOM);
  text(label, 0, 0);
  pop();
  pop();
}

function drawArrowHead(x, y, direction) {
  let size = 5;
  push();
  fill(dimGray);
  noStroke();
  beginShape();
  switch(direction) {
    case 'up':
      vertex(x, y);
      vertex(x - size/2, y + size);
      vertex(x + size/2, y + size);
      break;
    case 'down':
      vertex(x, y);
      vertex(x - size/2, y - size);
      vertex(x + size/2, y - size);
      break;
    case 'left':
      vertex(x, y);
      vertex(x + size, y - size/2);
      vertex(x + size, y + size/2);
      break;
    case 'right':
      vertex(x, y);
      vertex(x - size, y - size/2);
      vertex(x - size, y + size/2);
      break;
  }
  endShape(CLOSE);
  pop();
}

function drawMarginAnnotations() {
  push();
  stroke(dimGray);
  strokeWeight(1);
  fill(dimGray);
  textSize(10);

  // Left margin annotation
  drawingContext.setLineDash([3, 3]);
  line(margin, margin, margin, margin + 40);
  line(0, margin + 20, margin, margin + 20);
  drawingContext.setLineDash([]);

  noStroke();
  textAlign(LEFT, CENTER);
  text('margin = ' + margin, 5, margin + 35);

  // Top margin indicator
  stroke(dimGray);
  drawingContext.setLineDash([3, 3]);
  line(margin, margin, margin + 40, margin);
  line(margin + 20, 0, margin + 20, margin);
  drawingContext.setLineDash([]);

  pop();
}

function drawRegionLabels() {
  push();

  // Drawing Region label
  fill(50, 100, 150);
  noStroke();
  textSize(16);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text('Drawing Region', canvasWidth / 2, 8);

  textStyle(NORMAL);
  textSize(12);
  fill(100);
  text('"Visualization goes here"', canvasWidth / 2, 30);

  // Control Region label
  fill(80);
  textSize(14);
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  text('Control Region', 10, drawHeight + 15);

  textStyle(NORMAL);
  textSize(10);
  fill(120);
  text('"User controls here"', 10, drawHeight + 32);

  // Formula at bottom
  fill(dimGray);
  textSize(10);
  textAlign(RIGHT, BOTTOM);
  textStyle(ITALIC);
  text('canvasHeight = drawHeight + controlHeight', canvasWidth - 10, canvasHeight - 5);

  pop();
}

function drawSampleSlider() {
  push();

  // Sample slider track
  let sliderX = 180;
  let sliderY = drawHeight + 20;
  let sliderWidth = canvasWidth - sliderX - 20;

  // Track background
  fill(220);
  stroke(180);
  strokeWeight(1);
  rect(sliderX, sliderY - 3, sliderWidth, 6, 3);

  // Filled portion
  fill(100, 150, 200);
  noStroke();
  rect(sliderX, sliderY - 3, sliderWidth * 0.6, 6, 3, 0, 0, 3);

  // Slider handle
  fill(255);
  stroke(100, 150, 200);
  strokeWeight(2);
  ellipse(sliderX + sliderWidth * 0.6, sliderY, 14, 14);

  // Label
  fill(60);
  noStroke();
  textSize(11);
  textAlign(RIGHT, CENTER);
  text('Speed: 3.0', sliderX - 8, sliderY);

  pop();
}
