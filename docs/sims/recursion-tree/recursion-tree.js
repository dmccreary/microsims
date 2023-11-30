let canvasWidth = 400;
let canvasHeight = 450;
let drawHeight = 420;
let angleSlider;
let leftSliderMargin = 110;

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');

  angleSlider = createSlider(0, PI, PI / 4, 0.01);
  angleSlider.position(leftSliderMargin, height - 15);
  angleSlider.style("width", width - leftSliderMargin + 'px')
}

function draw() {
  fill(230);
  rect(0,0,canvasWidth, drawHeight);
  fill(245);
  rect(0,drawHeight,canvasWidth, canvasHeight-drawHeight);
  textSize(16);
  angle = angleSlider.value()
  fill(0);
  text('Angle: ' + angle, 10, height-10)

  translate(width / 2, drawHeight);
  drawBranch(120);

}

function drawBranch(len) {
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
