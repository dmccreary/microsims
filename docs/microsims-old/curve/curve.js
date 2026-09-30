let canvasWidth = 600;
let drawHeight = 300;
let canvasHeight = 460;
let margin = 40;
let lm = 115; // left margin for text
let sg = 25; // slider gap
let so = 10; // slider vertical offset
let slider1, slider2, slider3, slider4;
let sx = margin;
let sy = margin;
let ex = canvasWidth - margin;
let ey = drawHeight - margin;
let delta_x = ex-sx;
let delta_y = ey-sy;

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(16);

  // Creating sliders
  
  // End Point Y Slider
  EYslider = createSlider(margin, drawHeight-margin, 250); // First control point x

  // start control point x
  scpxSlider = createSlider(-1000, 0, -1000); // First control point x
  
  slider2 = createSlider(0, 600,  delta_y + (delta_y*.2)); // First control point y
  slider3 = createSlider(0, 1000, 1000); // Second control point x
  slider4 = createSlider(-drawHeight, drawHeight, 0); // Second control point y

  // Positioning sliders
  EYslider.position(lm, drawHeight + so);
  scpxSlider.position(lm, drawHeight + so + sg);
  slider2.position(lm, drawHeight + so + 2*sg);
  slider3.position(lm, drawHeight + so + 3*sg);
  slider4.position(lm, drawHeight + so + 4*sg);
  
  EYslider.size(canvasWidth - lm);
  scpxSlider.size(canvasWidth - lm);
  slider2.size(canvasWidth - lm);
  slider3.size(canvasWidth - lm);
  slider4.size(canvasWidth - lm);
}

function draw() {
  fill(245);
  rect(0,0,canvasWidth,drawHeight);
  fill('white');
  rect(0,drawHeight,canvasWidth,canvasHeight - drawHeight);
  
  ey = EYslider.value();
  delta_y = ey-sy;
  
  // draw the starting point
  fill('black');
  circle(sx,sy, 8);
  circle(ex,ey, 8);
  
  // Drawing curve
  stroke(0, 0, 255);
  strokeWeight(3);
  noFill();
  curve(scpxSlider.value(), slider2.value(), 
        sx, sy, 
        ex, ey,  
        slider3.value(), slider4.value());

  // Displaying slider values in left margin
  fill(0);
  noStroke();
  text(`End Y: ${EYslider.value()}`, 10, drawHeight + sg);
  text(`SCP X: ${scpxSlider.value()}`, 10, drawHeight + 2*sg);
  text(`SCP Y: ${slider2.value()}`, 10, drawHeight + 3*sg);
  text(`ECP X: ${slider3.value()}`, 10, drawHeight + 4*sg);
  text(`ECP Y: ${slider4.value()}`, 10, drawHeight + 5*sg);
  text(`Delta Y: ${delta_y}`, 10, drawHeight + 6*sg)

  // Start and end points
  text(`Start (50, 50)`, 10, 20);
  text(`End (350, ${ey})`, ex - 80, ey + 20);
}

