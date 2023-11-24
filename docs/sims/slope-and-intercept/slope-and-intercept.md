# Slope and Intercept

## Prompt

```linenums="0"
Generate a single file p5.js sketch on an 300x400 canvas.
Set a variable "width" to be 300.
Set a variable "height" to be 400.
The purpose of this sketch is to demonstrate the concepts of slope and intercept.
Divide the canvas into two regions on top of each other.
The top region is called the "drawing" region. 
The drawing region is 300x300 and has a light gray background of 240.
The bottom region the "controls" region.
The controls region holds the controls and is 300x100.
The background for the controls is white of 255.
The controls holds two sliders with labels and values on the left.
The width of the sliders are both 180px.
The slope slider ranges from -2 to 3 with the default of .5.
The intercept slider ranges from -100 to 100.
Draw the slope and the intercept only in the top drawing region.
The top drawing region uses a cartesian coordinate system with the center at 150, 150.
In the drawing regsion positive Y is at tthe top.
Place this prompt at the top of the sketch a multi-line comment.
```
[Slope and Intercept Demo](./slope-and-intercept.html)

## Response

```js
/*
Generate a single file p5.js sketch on a 300x400 canvas.
Set a global variable "width" to be 300.
Set a global variable "height" to be 400.
Set a global variable "drawingRegionHeight" to be 400.
The purpose of this sketch is to demonstrate the concepts of slope and intercept.
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
The top drawing region uses a cartesian coordinate system with the center at 150, 150.
In the drawing region, positive Y is at the top.
Add vertical and horizontal grid lines every 50 pixels.
*/

let width = 500;
let height = 400;
let drawingRegionHeight = 350;
let labelValueWidth = 110;
let slopeSlider, interceptSlider;

function setup() {
  createCanvas(width, height);
  textSize(16);

  // Slope slider
  text('Slope', 20, 320);
  slopeSlider = createSlider(0, 5, 0.5, 0.1);
  slopeSlider.position(labelValueWidth, height - 45);
  slopeSlider.style('width', width -labelValueWidth - 20 + 'px');

  // Intercept slider
  text('Intercept', 20, 360);
  interceptSlider = createSlider(0, 300, 50, 1);
  interceptSlider.position(labelValueWidth, height - 25);
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
}

function drawGridLines() {
  stroke('silver');
  strokeWeight(1);
  // horizontal lines
  for (let i=0; i<9; i++) {
    line(0, i*50, width, i*50);
  }
  // Vertical lines
  for (let i=0; i<10; i++) {
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
  stroke('red');
  strokeWeight(2);
  line(0, drawingRegionHeight - intercept, width, drawingRegionHeight - (drawingRegionHeight * slope + intercept));
}
```

