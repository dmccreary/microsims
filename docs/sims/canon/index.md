# Canon and Projectile Motion

<figure markdown>
   ![Image Name](./canon.png){ width="400" }
   <figcaption>Figure caption.</figcaption>
</figure>

[Run Demo of Canon Projectile Motion](./canon.html){ .md-button .md-button--primary }

In this lesson, we add gravity to our simulation.  The program has a "Fire" button
and you can adjust the angle an power of the canon that fires the ball.

## Sample Prompts

```linenums="0"
Generate a single file p5.js sketch that demonstrates projectile motion.
Allow the user to set the initial angle and power of a projectile.
```

Here is a more precise specification with details on the control placement.

```linenums="0"
Generate a single file p5.js sketch on an 800x550 canvas.
The program is a simulation of projecile motion.
The upper drawing region is 800x500 and is intialized with a light gray rectangle of 245.
The lower 50 height is for placing the controls on a white background.
A circle of radius 10 is placed in the lower left corner of the drawing region.
A "Fire" buttin is below the circle.
To the right of the fire button are two sliders.
One slider is for the initial angle at fire time.
One slider is for the power at fire time.
Gravity is in the positive y of force 0.05
When the ball goes outside the drawing region (800x500) the simulation must stop.
When the simulation stops, place a new ball in the lower left corner of the drawing region.
```

[Edit this Code Using the p5.js Editor](https://editor.p5js.org/dmccreary/sketches/KK75id7n4)

## Sample Code

```js
// Cannon Ball - a demonstration of projectile motion
// Gravity is a constant
let canvasWidth = 800;
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
  // canvas.parent('canvas-container');
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

```

## Learnings from the Code

1. The p5.js has a library for simulating forces on an object.
2. We can use the Class operator to create functions on the canon ball.

## References

1. 