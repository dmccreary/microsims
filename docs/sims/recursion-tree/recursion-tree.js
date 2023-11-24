let angleSlider;

function setup() {
  const canvas = createCanvas(400, 400);
  canvas.parent('canvas-container');
  angleSlider = createSlider(0, TWO_PI, PI / 4, 0.01);
  angleSlider.position(10, height + 10);
}

function draw() {
  background(255);
  stroke(0);
  translate(width / 2, height);
  drawBranch(100);
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
