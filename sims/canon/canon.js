// Cannon Ball - a demonstration of projectile motion
// Gravity is a constant
let canvasWidth = 600;
let drawHeight = 500;
let canvasHeight = drawHeight + 40; // add 20 per slider
let angleSlider, powerSlider;
let angle, power;
let cannonBall;
let firing = false;
let sliderLeftMargin = 140;

// setup the canvas and controls and 
// create a new cannonBall in the lower left corner
function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  // uncomment when placing into HTML
  canvas.parent('canvas-container');
  textSize(16);

  angleSlider = createSlider(0, 90, 75, 1);
  angleSlider.position(sliderLeftMargin, drawHeight + 5);
  angleSlider.style('width', canvasWidth - sliderLeftMargin - 200 + 'pt')
  
  powerSlider = createSlider(1, 10, 7, 0.1);
  powerSlider.position(sliderLeftMargin, drawHeight + 25);
  powerSlider.style('width', canvasWidth - sliderLeftMargin - 200 + 'pt')

  fireButton = createButton('Fire');
  fireButton.position(10, drawHeight+15);
  fireButton.mousePressed(fireCannon);

  cannonBall = new CannonBall(10, drawHeight-10, 0, 0);
}

function draw() {
  // only draw the drawing region light gray
  fill(245);
  rect(0, 0, canvasWidth, drawHeight);
  // fill the bottom control region with a white background
  fill('white');
  rect(0, drawHeight, canvasWidth, canvasHeight- drawHeight);
  
  // get the new angle and power
  angle = angleSlider.value();
  power = powerSlider.value();

  if(firing) {
    cannonBall.applyForce(createVector(0, 0.05)); // Gravity is here
    cannonBall.update();
  }
  
  // draws the new cannon ball
  cannonBall.display();

  // are we still on the canvas?
  if(cannonBall.pos.y > drawHeight || cannonBall.pos.y < 0) {
    firing = false;
    // get a new ball ready
    cannonBall = new CannonBall(10, drawHeight-10, 0, 0);
  }
  
  fill(1);
  noStroke();
  text('Angle: ' + angle, 60, drawHeight + 20);
  text('Power: ' + power, 60, drawHeight + 40);
}

function fireCannon() {
  let force = p5.Vector.fromAngle(radians(-angle));
  force.mult(power);
  cannonBall.applyForce(force);
  firing = true;
}

class CannonBall {
  constructor(x, y, vx, vy) {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.acc = createVector(0, 0);
    this.r = 10;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  display() {
    fill('black')
    circle(this.pos.x, this.pos.y, this.r * 2);
  }
}
