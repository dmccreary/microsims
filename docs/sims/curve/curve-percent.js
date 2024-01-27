let canvasWidth = 400;
let drawHeight = 300;
let canvasHeight = 340;
let margin = 30; // margin around drawing
let lm = 113; // left margin for slider text

let x1 = margin;
let y1 = margin;
let x2 = canvasWidth - margin;
let y2 = drawHeight - margin;
// streight horizontal to the right
let c1x = -1000, c1y = 400;
// streight horizontal from the left
let c2x = 1000, c2y = -50;

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(16);
  
  percentSlider = createSlider(0, 1, .5, 0.01);
  percentSlider.position(lm, drawHeight + 10);
  percentSlider.size(canvasWidth-lm - 17);
}

function draw() {
  // get any updates from the slider
  percent = percentSlider.value();
  
  // a little border is nice
  strokeWeight(1);
  // fill the drawing region background with a light gray
  fill(245);
  rect(1,1,canvasWidth-2,drawHeight-2);
  // fill the control region background with white
  fill('white');
  rect(1,drawHeight,canvasWidth-2,canvasHeight - drawHeight-2);
  
  // draw the source and target labels
  fill('black');
  noStroke();
  text('Source', margin - 15, margin - 10);
  text('Target', canvasWidth - 60, drawHeight - 10);
  // draw the endpoints
  fill('green');
  circle(x1,y1, 8);
  fill('red');
  circle(x2,y2, 8);
  
  noFill(0);
  strokeWeight(3);
  stroke('blue')
  customCurve(c1x, c1y, x1, y1, x2, y2, c2x, c2y, percent);
  
  noStroke();
  fill('black');
  text('Percent:' + round(percent*100) + '%', 10, drawHeight + 25);
}

// Draw a curve with only the percent drawin
function customCurve(c1x, c1y, x1, y1, x2, y2, c2x, c2y, percent) {
  beginShape();
  for (let t = -0.01; t <= percent + 0.01; t += 0.01) {
    let v0 = createVector(c1x, c1y);
    let v1 = createVector(x1, y1);
    let v2 = createVector(x2, y2);
    let v3 = createVector(c2x, c2y);
    let x = curvePoint(v0.x, v1.x, v2.x, v3.x, t);
    let y = curvePoint(v0.y, v1.y, v2.y, v3.y, t);
    curveVertex(x, y);
  }
  endShape();
}
