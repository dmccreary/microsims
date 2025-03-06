/*
Generate a single file p5.js sketch on a 500x550 canvas.
The purpose of this sketch is to demonstrate the concepts of slope and intercept.
Set a global variable "width" to be 500.
Set a global variable "height" to be 550.
Set a global variable "drawingRegionHeight" to be 500.
Divide the canvas into two regions on top of each other.
The top region is called the "drawing" region.
The drawing region is 300x300 and has a light gray background of 240.
The bottom region is the "controls" region.
The controls region holds the controls and is 300x100.
The background for the controls is white of 255.
The controls holds two sliders with labels and values on the left.
The width of the sliders are both 180px.
The slope slider ranges from -2 to 3 with the default of .5.
The intercept slider ranges from -100 to 100.
Draw the slope and the intercept only in the top drawing region.
The top drawing region uses a cartesian coordinate system with the center at width/2, height/2.
In the drawing region, positive Y is at the top.
*/

let width = 500;
let height = 550;
let drawingRegionHeight = 500;
let labelValueWidth = 120;
let slopeSlider, interceptSlider;
// test points
let p1 = [100, 280]
let p2 = [200, 320]
let p3 = [300, 200]
let p4 = [400, 210]

function setup() {
  const canvas = createCanvas(width, height);
  canvas.parent('canvas-container');
  textSize(16);

  // Slope slider
  text('Slope', 20, 320);
  slopeSlider = createSlider(-0.2, 5, 0.5, 0.1);
  slopeSlider.position(labelValueWidth, height - 35);
  slopeSlider.style('width', width -labelValueWidth - 20 + 'px');

  // Intercept slider
  text('Intercept', 20, 360);
  interceptSlider = createSlider(0, 300, 100, 1);
  interceptSlider.position(labelValueWidth, height - 15);
  interceptSlider.style('width', width -labelValueWidth - 20 + 'px');
}

function draw() {
  // Redraw drawing region
  noStroke();
  
  // Drawing region
  fill(230);
  rect(0, 0, width, drawingRegionHeight);

  // Controls region
  fill(245);
  rect(0, drawingRegionHeight, width, 100);
  
  let slope = slopeSlider.value();
  let intercept = interceptSlider.value();
  drawGridLines();
  drawLine(slope, intercept);
  drawLabelValues(slope, intercept);
  
  drawSquares(slope, intercept);
  drawPoints();
}

function drawPoints() {
  fill('green');
  noStroke();
  circle(p1[0], p1[1], 10);
  circle(p2[0], p2[1], 10);
  circle(p3[0], p3[1], 10);
  circle(p4[0], p4[1], 10);
}

function drawSquares(slope, intercept) {
  
  strokeWeight(0);
  
  // predicted y point on line
  p = drawingRegionHeight - (slope * p1[0] + intercept)
  // absolute distance between the points
  d = dist(p1[0], p1[1], p1[0], p)
  // if prediction is above
  if (p > p1[1]) {
     fill('red');
     rect(p1[0], p1[1], d, d) }
  else {
    fill('orange');
    rect(p1[0], p, d, d)
  }
  
  p = drawingRegionHeight - (slope * p2[0] + intercept)
  d = dist(p2[0], p2[1], p2[0], p)
  if (p > p2[1]) {
     fill('yellow');
     rect(p2[0], p2[1], d, d) }
  else {
    fill('pink');
    rect(p2[0], p, d, d)
  }
  
  p = drawingRegionHeight - (slope * p3[0] + intercept)
  d = dist(p3[0], p3[1], p3[0], p)
  if (p > p3[1]) {
     fill('cyan');
     rect(p3[0], p3[1], d, d) }
  else {
    fill('blue');
    rect(p3[0], p, d, d)
  }
  
  p = drawingRegionHeight - (slope * p4[0] + intercept)
  d = dist(p4[0], p4[1], p4[0], p)
  if (p > p4[1]) {
     fill('lightgreen');
     rect(p4[0], p4[1], d, d) }
  else {
    fill('olive');
    rect(p4[0], p, d, d)
  }
  
 
  fill('purple');
  noStroke();
  circle(p1[0], drawingRegionHeight - (slope * p1[0] + intercept), 10);
  circle(p2[0], drawingRegionHeight - (slope * p2[0] + intercept), 10);
  circle(p3[0], drawingRegionHeight - (slope * p3[0] + intercept), 10);
  circle(p4[0], drawingRegionHeight - (slope * p4[0] + intercept), 10);
}

function drawGridLines() {
  stroke('silver');
  // horizontal lines
  for (let i=0; i<11; i++) {
    if (i%2) strokeWeight(1); else strokeWeight(2);
    line(0, i*50, width, i*50);
  }
  // Vertical lines
  for (let i=0; i<10; i++) {
    if (i%2) strokeWeight(1); else strokeWeight(2);
    line(i*50, 0, i*50, drawingRegionHeight);
  }
}

function drawLabelValues(slope, intercept) {
  fill('black');
  strokeWeight(0);
  text('Slope: ' + slope, 10, drawingRegionHeight + 20);
  text('Intercept: ' + intercept, 10, drawingRegionHeight + 40);
}

function drawLine() {
  let slope = slopeSlider.value();
  let intercept = interceptSlider.value();

  // Draw line in the drawing region
  stroke('blue');
  strokeWeight(2);
  line(0, drawingRegionHeight - intercept, width, drawingRegionHeight - (drawingRegionHeight * slope + intercept));
}
