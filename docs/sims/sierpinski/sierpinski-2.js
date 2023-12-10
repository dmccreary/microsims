let canvasWidth = 400;
let canvasHeight = 465;
let drawHeight = 400;
let colorSlider;
let color;
let depthSlider;
let sliderLeftMargin = 120;

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');
  colorMode(HSB, 255);
  textSize(16);
  
  depthSlider = createSlider(0, 7, 5);
  depthSlider.position(sliderLeftMargin, canvasHeight - 60);
  depthSlider.style('width', canvasWidth - sliderLeftMargin + 'px');

  colorSlider = createSlider(0, 255, 0);
  colorSlider.position(sliderLeftMargin, canvasHeight - 40);
  colorSlider.style('width', canvasWidth - sliderLeftMargin + 'px');

  colorStepSlider = createSlider(0, 50, 20);
  colorStepSlider.position(sliderLeftMargin, canvasHeight - 20);
  colorStepSlider.style('width', canvasWidth - sliderLeftMargin + 'px');
}

function draw() {
  background(255);
  color = colorSlider.value();
  depth = depthSlider.value();
  colorStep = colorStepSlider.value();
  drawSierpinski(0, drawHeight, width, drawHeight, width / 2, 0, color, depth);
  fill(0);
  text("Depth: " + depth, 10, canvasHeight - 45);
  text("Color: " + color, 10, canvasHeight - 25);
  text("Color Step: " + colorStep, 10, canvasHeight - 5);
}

function drawSierpinski(x1, y1, x2, y2, x3, y3, color, depth) {
  fill(color % 255, 255, 255);
  stroke('black');
  triangle(x1, y1, x2, y2, x3, y3);

  if (depth > 0) {
    let newX1 = (x1 + x2) / 2;
    let newY1 = (y1 + y2) / 2;
    let newX2 = (x2 + x3) / 2;
    let newY2 = (y2 + y3) / 2;
    let newX3 = (x1 + x3) / 2;
    let newY3 = (y1 + y3) / 2;

    drawSierpinski(x1, y1, newX1, newY1, newX3, newY3, color+colorStep, depth - 1);
    drawSierpinski(newX1, newY1, x2, y2, newX2, newY2, color+colorStep, depth - 1);
    drawSierpinski(newX3, newY3, newX2, newY2, x3, y3, color+colorStep, depth - 1);
  }
}
