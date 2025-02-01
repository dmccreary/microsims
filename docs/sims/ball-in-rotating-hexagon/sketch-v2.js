// --- Canvas Regions & Global Variables ---
let drawHeight = 400;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let aspectRatio = 1.91; // Open Graph standard
let canvasWidth = canvasHeight * aspectRatio;
let sliderLeftMargin = 70;

let ball;               // The bouncing ball
let center;             // Center of the hexagon (and drawing area)
let hexRadius;          // Radius of the hexagon (from center to vertex)
let hexRotation = 0;    // Current rotation angle (in radians)
let hexAngularVelocity; // Updated each frame from the slider

let rotationSlider;     // Slider to control the hexagon’s rotation speed

// --- Setup ---
function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  // Attach canvas to the main element on the page.
  let mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  
  // Create the rotation speed slider.
  // Range: from -0.1 to 0.1 (radians per frame); initial value 0.01; step 0.001.
  rotationSlider = createSlider(-0.1, 0.1, 0.01, 0.001);
  rotationSlider.size(canvasWidth - sliderLeftMargin - 160);
  // Position the slider in the center of the controls area.
  // (We assume the canvas’s (0,0) is aligned with the parent’s origin.)
  rotationSlider.position(sliderLeftMargin + 10, drawHeight + controlHeight / 2 - 10);
  rotationSlider.parent(mainElement);
  
  // Set up simulation variables.
  // We want the simulation (the hexagon and the ball) confined to the drawing area.
  center = createVector(canvasWidth / 2, drawHeight / 2);
  // Choose a hexagon size that fits well inside the drawing area.
  hexRadius = 150;
  // Start the ball near the center (but a little offset).
  ball = new Ball(center.x, center.y - 50);
}

// --- Draw Loop ---
function draw() {
  // Update hexagon angular speed from the slider.
  hexAngularVelocity = rotationSlider.value();

  // --- Drawing Area (Top Region) ---
  noStroke();
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);

  // --- Controls Area (Bottom Region) ---
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  
  // --- Update & Draw the Spinning Hexagon ---
  hexRotation += hexAngularVelocity;
  drawHexagon(center, hexRadius, hexRotation);
  
  // --- Update the Ball Physics ---
  // Apply gravity.
  ball.applyForce(createVector(0, 0.3));
  ball.update();
  
  // Check collisions with each of the 6 hexagon edges.
  for (let i = 0; i < 6; i++) {
    // Compute the world positions of the two consecutive vertices.
    let angle1 = hexRotation + (TWO_PI * i) / 6;
    let angle2 = hexRotation + (TWO_PI * (i + 1)) / 6;
    let A = createVector(center.x + hexRadius * cos(angle1), center.y + hexRadius * sin(angle1));
    let B = createVector(center.x + hexRadius * cos(angle2), center.y + hexRadius * sin(angle2));
    
    ball.checkCollisionWithEdge(A, B);
  }
  
  fill('black');
  textSize(20);
  text("Speed:", 10, drawHeight + 30);
  // Draw the ball.
  ball.show();
}

// --- Ball Class ---
class Ball {
  constructor(x, y) {
    this.pos = createVector(x, y);
    // Start with a small random velocity.
    this.vel = createVector(random(-2, 2), random(-2, 2));
    this.acc = createVector(0, 0);
    this.radius = 15;
    // Simulate air friction.
    this.friction = 0.99;
    // Restitution factor for bounces.
    this.restitution = 0.9;
  }
  
  applyForce(force) {
    this.acc.add(force);
  }
  
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.vel.mult(this.friction);
  }
  
  // Check and resolve collision with a line segment defined by A and B.
  checkCollisionWithEdge(A, B) {
    // Compute the projection of the ball's center onto the edge.
    let AB = p5.Vector.sub(B, A);
    let AP = p5.Vector.sub(this.pos, A);
    let t = constrain(AP.dot(AB) / AB.dot(AB), 0, 1);
    let closest = p5.Vector.add(A, p5.Vector.mult(AB, t));
    
    let collisionVec = p5.Vector.sub(this.pos, closest);
    let dist = collisionVec.mag();
    
    // If the ball overlaps the edge…
    if (dist < this.radius) {
      let n; // collision normal
      
      // Use the edge’s inward normal if the collision is along its flat part.
      if (t > 0.001 && t < 0.999) {
        n = getEdgeNormal(A, B);
      } else {
        // Near a vertex: use the vector from the vertex to the ball.
        if (dist !== 0) {
          n = collisionVec.copy().normalize();
        } else {
          n = getEdgeNormal(A, B);
        }
      }
      
      // Get the instantaneous velocity of the wall (due to rotation)
      let wallVel = getWallVelocity(closest);
      // Determine ball's velocity relative to the wall.
      let relVel = p5.Vector.sub(this.vel, wallVel);
      let relVelAlongNormal = relVel.dot(n);
      
      // Only resolve if the ball is moving toward the wall.
      if (relVelAlongNormal < 0) {
        // Reflect the velocity (with energy loss via restitution).
        let impulse = (1 + this.restitution) * relVelAlongNormal;
        let correction = p5.Vector.mult(n, impulse);
        let newRelVel = p5.Vector.sub(relVel, correction);
        this.vel = p5.Vector.add(wallVel, newRelVel);
        // Move the ball out of penetration.
        let penetration = this.radius - dist;
        this.pos.add(p5.Vector.mult(n, penetration));
      }
    }
  }
  
  show() {
    noStroke();
    fill(255, 0, 0);
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
  }
}

// --- Helper Functions ---

// Draws a regular hexagon centered at "center" with the given "radius" and rotated by "rotation".
function drawHexagon(center, radius, rotation) {
  push();
  translate(center.x, center.y);
  rotate(rotation);
  stroke(0);
  noFill();
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI * i / 6;
    let x = radius * cos(angle);
    let y = radius * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE);
  pop();
}

// Returns the inward (unit) normal for the edge defined by points A and B.
function getEdgeNormal(A, B) {
  let edge = p5.Vector.sub(B, A);
  let n = createVector(edge.y, -edge.x);
  n.normalize();
  // Ensure the normal points inward by checking against the vector toward the hexagon’s center.
  let toCenter = p5.Vector.sub(center, A);
  if (n.dot(toCenter) < 0) {
    n.mult(-1);
  }
  return n;
}

// Given a point P on the hexagon’s boundary, returns its instantaneous velocity due to rotation.
function getWallVelocity(P) {
  let r = p5.Vector.sub(P, center);
  // In 2D, the tangential velocity due to rotation is omega x r = omega * (-r.y, r.x)
  let vel = createVector(-hexAngularVelocity * r.y, hexAngularVelocity * r.x);
  return vel;
}
