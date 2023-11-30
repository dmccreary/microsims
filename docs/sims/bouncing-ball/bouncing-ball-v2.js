// bouncing ball - version 2
// with radius added to edge check and drawing region above controls

let width = 500;
let height = 350;
let drHeight = 300; // region for drawing
r = 20; // radius of the ball

// initial position
x = 100;
y = 100;
speed = 3; // default speed
// direction of motion
dx = speed;
dy = speed;
sliderLeftMargin = 120;

function setup() {
  const canvas = createCanvas(width, height);
  canvas.parent('canvas-container');
  textSize(16);

  speedSlider = createSlider(0, 20, speed);
  speedSlider.position(sliderLeftMargin, height - 35);
  speedSlider.style('width', width - sliderLeftMargin - 15 + 'px');

  radiusSlider = createSlider(2, 50, r);
  radiusSlider.position(sliderLeftMargin, height - 15);
  radiusSlider.style('width', width - sliderLeftMargin - 15 + 'px');
}

function draw() {
  fill(240);
  noStroke();
  rect(0, 0, width, drHeight+1); // fill drawing area with light gray
  fill('white');
  rect(0, drHeight, width, height-drHeight); // fill control with white
  
  // get the new speed from the UI
  speed = speedSlider.value();
  // get the new radius
  r = radiusSlider.value();

  // adjust the x and y directions
  if (dx > 0) dx = speed;
     else dx = -speed;
  
  if (dy > 0) dy = speed;
     else dy = -speed;
  
  // Add the current speed to the position.
  x += dx;
  y += dy;

  // checks for edges right or left
  if ((x > width-r) || (x < r)) {
    dx = dx * -1; // change direction
  }
  if ((y > drHeight - r) || (y < r)) {
    dy = dy * -1;
  }

  fill('blue');
  circle(x, y, r*2);
  fill('black');
  strokeWeight(0);
  text('Speed: ' + speed, 10, height-30)
  text('Ball Size: ' + r, 10, height-10)
}
