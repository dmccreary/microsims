// Flower Petal Designer
// Inspired by Jordanne https://editor.p5js.org/jordanne/sketches/UdedYjDif

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 210;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 180;
let defaultTextSize = 16;

// Global variables for responsive design
let containerWidth;
let containerHeight = canvasHeight;

// Slider variables
let petalSlider, lengthSlider, ctrlXSlider, ctrlYSlider;
let petalColorSlider, centerColorSlider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));

  angleMode(DEGREES);

  let sliderVerticalOffset = 8;
  let sliderVerticalSpacing = 29;

  // Number of Petals slider
  petalSlider = createSlider(3, 20, 6, 1);
  petalSlider.position(sliderLeftMargin, drawHeight + sliderVerticalOffset);
  petalSlider.size(containerWidth - sliderLeftMargin - 15);
  petalSlider.input(redrawFlower);

  // Petal Length slider
  lengthSlider = createSlider(20, 200, 130, 1);
  lengthSlider.position(sliderLeftMargin, drawHeight + sliderVerticalOffset + sliderVerticalSpacing);
  lengthSlider.size(containerWidth - sliderLeftMargin - 15);
  lengthSlider.input(redrawFlower);

  // Control Point X slider (curviness)
  ctrlXSlider = createSlider(0, 150, 40, 1);
  ctrlXSlider.position(sliderLeftMargin, drawHeight + sliderVerticalOffset + sliderVerticalSpacing*2);
  ctrlXSlider.size(containerWidth - sliderLeftMargin - 15);
  ctrlXSlider.input(redrawFlower);

  // Control Point Y slider (tip depth)
  ctrlYSlider = createSlider(0, 200, 75, 1);
  ctrlYSlider.position(sliderLeftMargin, drawHeight + sliderVerticalOffset + sliderVerticalSpacing*3);
  ctrlYSlider.size(containerWidth - sliderLeftMargin - 15);
  ctrlYSlider.input(redrawFlower);

  // Petal Color slider (hue: 0-360)
  petalColorSlider = createSlider(0, 360, 300, 1);
  petalColorSlider.position(sliderLeftMargin, drawHeight + sliderVerticalOffset + sliderVerticalSpacing*4);
  petalColorSlider.size(containerWidth - sliderLeftMargin - 15);
  petalColorSlider.input(redrawFlower);

  // Center Color slider (hue: 0-360)
  centerColorSlider = createSlider(0, 360, 60, 1);
  centerColorSlider.position(sliderLeftMargin, drawHeight + + sliderVerticalOffset + sliderVerticalSpacing*5);
  centerColorSlider.size(containerWidth - sliderLeftMargin - 15);
  centerColorSlider.input(redrawFlower);

  describe('Interactive flower petal dsiigner with adjustable parameters for petal count, length, curviness, and colors', LABEL);
}

function draw() {
  // Draw area background
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, containerWidth, drawHeight);

  // Controls area background
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(0, drawHeight, containerWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textSize(24);
  textAlign(CENTER, TOP);
  text("Flower Petal Designer", containerWidth/2, margin);

  // Draw the flower centered in the drawing area
  push();
  translate(containerWidth / 2, drawHeight / 2);

  let petals = petalSlider.value();
  let length = lengthSlider.value();
  let ctrlX = ctrlXSlider.value();
  let ctrlY = ctrlYSlider.value();
  let petalHue = petalColorSlider.value();
  let centerHue = centerColorSlider.value();

  // Convert hue to color
  colorMode(HSB, 360, 100, 100);
  let petalColor = color(petalHue, 75, 85);
  let centerColor = color(centerHue, 60, 95);
  colorMode(RGB, 255);

  drawFlower(petals, length, ctrlY, ctrlX, petalColor, centerColor);
  pop();

  // Draw control labels
  drawControlLabels();
}

function drawControlLabels() {
  fill('black');
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);

  // Label with current values
  text('Number of Petals: ' + petalSlider.value(), 10, drawHeight + 15);
  text('Petal Length: ' + lengthSlider.value(), 10, drawHeight + 45);
  text('Control Point X: ' + ctrlXSlider.value(), 10, drawHeight + 75);
  text('Control Point Y: ' + ctrlYSlider.value(), 10, drawHeight + 105);
  text('Petal Color (Hue): ' + petalColorSlider.value(), 10, drawHeight + 135);
  text('Center Color (Hue): ' + centerColorSlider.value(), 10, drawHeight + 165);

  // Display the function call code
  let petals = petalSlider.value();
  let length = lengthSlider.value();
  let ctrlX = ctrlXSlider.value();
  let ctrlY = ctrlYSlider.value();
  let petalHue = petalColorSlider.value();
  let centerHue = centerColorSlider.value();
  let codeString = `drawFlower(${petals}, ${length}, ${ctrlY}, ${ctrlX}, hue:${petalHue}, hue:${centerHue});`;

  textSize(12);
  text('Code: ' + codeString, 10, drawHeight + 195);
}

function drawFlower(petalCount, petalLength, ctrlY, ctrlX, petalColour, centerColour) {
  fill(petalColour);

  for (let i = 0; i < petalCount; i++) {
    rotate(360 / petalCount);
    noStroke();
    beginShape();
    vertex(0, 0);
    quadraticVertex(ctrlX, ctrlY, 0, petalLength);
    quadraticVertex(-ctrlX, ctrlY, 0, 0);
    endShape(CLOSE);
    
    // draw the circle and lines to the control point
    strokeWeight(.5);
    stroke(0);
    ellipse(ctrlX, ctrlY, 10);

    // Draw lines that meet at the control point
    line(0, 0, ctrlX, ctrlY); // from center to control point
    line(0, petalLength, ctrlX, ctrlY); // from tip to control point
  }

  fill(centerColour);
  noStroke();
  ellipse(0, 0, petalLength * 0.4);
}

function redrawFlower() {
  redraw();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);

  // Resize sliders to match new width
  petalSlider.size(containerWidth - sliderLeftMargin - 15);
  lengthSlider.size(containerWidth - sliderLeftMargin - 15);
  ctrlXSlider.size(containerWidth - sliderLeftMargin - 15);
  ctrlYSlider.size(containerWidth - sliderLeftMargin - 15);
  petalColorSlider.size(containerWidth - sliderLeftMargin - 15);
  centerColorSlider.size(containerWidth - sliderLeftMargin - 15);

  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
