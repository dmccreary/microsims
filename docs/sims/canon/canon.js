let angleSlider, powerSlider;
let angle, power;
let cannonBall;
let firing = false;

function setup() {
  createCanvas(800, 600);

  angleSlider = createSlider(0, 90, 45, 1);
  angleSlider.position(20, 20);
  powerSlider = createSlider(1, 10, 5, 0.1);
  powerSlider.position(20, 60);
  fireButton = createButton('Fire');
  fireButton.position(20, 100);
  fireButton.mousePressed(fireCannon);

  cannonBall = new CannonBall(0, height, 0, 0);
}

function draw() {
  background(200);
  angle = angleSlider.value();
  power = powerSlider.value();

  text('Angle: ' + angle, 20, 15);
  text('Power: ' + power, 20, 55);

  if(firing) {
    cannonBall.applyForce(createVector(0, 0.05)); // Gravity
    cannonBall.update();
  }
  cannonBall.display();

  if(cannonBall.pos.y > height || cannonBall.pos.y < 0) {
    firing = false;
    cannonBall = new CannonBall(0, height, 0, 0);
  }
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
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }
}
