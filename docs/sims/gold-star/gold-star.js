// Draw a gold star width number points as a parameter
let pointsSlider;
let width = 400;
let height = 430;
let drawHeight = 400;
let cx = width / 2;
let cy = height / 2;
let sliderLeftMargin = 100;

function setup() {
  const canvas = createCanvas(width, height);
  canvas.parent('canvas-container');
  textSize(16);

  pointsSlider = createSlider(4, 20, 10);
  pointsSlider.position(90, height - 15);
  pointsSlider.style('width', width - sliderLeftMargin +'px');
}

function draw() {
  // fill the drawing area with a light gray background
  fill(220);
  rect(0,0,width,drawHeight);
  fill(245);
  rect(0,drawHeight,width,height-drawHeight);

  // radius
  const r = min(width, height) * 0.45;

  // points
  points = pointsSlider.value();

  // tempory move of coordinate system to center
  push();
     translate(cx, cy);
     star(0, 0, r * 0.6, r, points);
  pop();
  
  // draw the label and values in the control area
  fill(0);
  text("Points:" + points, 10, height - 10);
}

// draw star at (x,y) with inner and outer radius and n points
function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  fill('gold');
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
