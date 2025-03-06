// recursive tree
let drawHeight = 420;
let controlHeight = 40;
let canvasHeight = drawHeight + controlHeight;

let angleSlider;
let leftSliderMargin = 110;

// calculated 
let containerWidth, canvasWidth; 
let containerHeight = canvasHeight;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));

  angleSlider = createSlider(0, PI, PI / 4, 0.01);
  angleSlider.position(leftSliderMargin, drawHeight + 10);
  angleSlider.size(canvasWidth - leftSliderMargin - 20);
}

function draw() {
  
  // light gray border
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0,0,canvasWidth, drawHeight);
  fill('white');
  rect(0,drawHeight,canvasWidth, controlHeight);
  
  textSize(16);
  angle = angleSlider.value()
  fill(0);
  text('Angle: ' + angle, 10, drawHeight+25)

  translate(width / 2, drawHeight);
  drawBranch(120);

}

function drawBranch(len) {
  stroke('blue');
  line(0, 0, 0, -len);
  translate(0, -len);

  if (len > 4) {
    push();
    rotate(angleSlider.value());
    drawBranch(len * 0.67);
    pop();

    push();
    rotate(-angleSlider.value());
    drawBranch(len * 0.67);
    pop();
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  angleSlider.size(canvasWidth - leftSliderMargin - 15);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
