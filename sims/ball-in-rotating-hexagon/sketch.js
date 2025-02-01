// Global variables for the ball and the hexagon:
let ball;          // our bouncing ball
let center;        // center of the hexagon (and canvas)
let hexRadius;     // distance from the hexagon's center to its vertices
let hexRotation = 0;       // current rotation angle of the hexagon (in radians)
let hexAngularVelocity = 0.01; // constant angular velocity (radians per frame)

function setup() {
  const canvas = createCanvas(600, 600);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  // Set the hexagon (and canvas) center.
  center = createVector(width / 2, height / 2);
  // Choose a hexagon that nearly fills the canvas:
  hexRadius = 250;
  
  // Create a new ball at an initial position (near the center) with a small random velocity.
  ball = new Ball(center.x, center.y - 100);
}

function draw() {
  background('aliceblue');
  
  // Update the hexagon’s rotation:
  hexRotation += hexAngularVelocity;
  
  // Draw the rotating hexagon:
  drawHexagon(center, hexRadius, hexRotation);
  
  // Apply gravity to the ball (a constant downward force):
  ball.applyForce(createVector(0, 0.3));
  
  // Update the ball’s physics (velocity, position, friction):
  ball.update();
  
  // Check collisions against each of the six edges.
  // (The hexagon is defined by 6 vertices; we loop through them to create the edges.)
  for (let i = 0; i < 6; i++) {
    // Compute the angles (in world coordinates) of two consecutive vertices.
    let angle1 = hexRotation + (TWO_PI * i) / 6;
    let angle2 = hexRotation + (TWO_PI * (i + 1)) / 6;
    // Compute the endpoints for this edge.
    let A = createVector(center.x + hexRadius * cos(angle1), center.y + hexRadius * sin(angle1));
    let B = createVector(center.x + hexRadius * cos(angle2), center.y + hexRadius * sin(angle2));
    
    // Let the ball check for collision with this wall.
    ball.checkCollisionWithEdge(A, B);
  }
  
  // Draw the ball.
  ball.show();
}

/* =========================
   Ball class definition
   ========================= */
class Ball {
  constructor(x, y) {
    this.pos = createVector(x, y);
    // Give the ball an initial random velocity.
    this.vel = createVector(random(-2, 2), random(-2, 2));
    this.acc = createVector(0, 0);
    this.radius = 15;
    // A little air friction (damps the velocity gradually).
    this.friction = 0.99;
    // Restitution (bounciness) used in collisions.
    this.restitution = 0.9;
  }
  
  // Apply a force (acceleration) to the ball.
  applyForce(f) {
    this.acc.add(f);
  }
  
  // Update the ball’s velocity and position.
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    // Reset acceleration.
    this.acc.mult(0);
    // Apply air friction.
    this.vel.mult(this.friction);
  }
  
  // Check and resolve a collision between the ball and a wall defined by endpoints A and B.
  checkCollisionWithEdge(A, B) {
    // Compute the vector along the wall and from A to the ball’s center.
    let AB = p5.Vector.sub(B, A);
    let AP = p5.Vector.sub(this.pos, A);
    // Project the ball’s center onto the line AB and clamp to the segment.
    let t = constrain(AP.dot(AB) / AB.dot(AB), 0, 1);
    // The closest point on the edge (or its endpoints) to the ball’s center:
    let closest = p5.Vector.add(A, p5.Vector.mult(AB, t));
    
    // Compute the vector from the closest point to the ball’s center.
    let collisionVec = p5.Vector.sub(this.pos, closest);
    let dist = collisionVec.mag();
    
    // If the ball is overlapping the wall (its distance to the edge is less than its radius):
    if (dist < this.radius) {
      let n; // collision normal
      
      // If the collision is with the flat face (not a corner),
      // use the wall’s inward normal.
      if (t > 0.001 && t < 0.999) {
        n = getEdgeNormal(A, B);
      } else {
        // Otherwise (if colliding near an endpoint), use the vector from the vertex to the ball.
        if (dist != 0) {
          n = collisionVec.copy().normalize();
        } else {
          // Rare degenerate case: fallback to using the wall’s normal.
          n = getEdgeNormal(A, B);
        }
      }
      
      // Compute the instantaneous velocity of the wall at the collision point.
      let wallVel = getWallVelocity(closest);
      
      // Determine the ball’s velocity relative to the moving wall.
      let relVel = p5.Vector.sub(this.vel, wallVel);
      // Compute the component along the collision normal.
      let relVelAlongNormal = relVel.dot(n);
      
      // Only resolve if the ball is moving toward the wall.
      if (relVelAlongNormal < 0) {
        // Reflect the relative velocity (with energy loss given by restitution).
        let impulse = (1 + this.restitution) * relVelAlongNormal;
        let correction = p5.Vector.mult(n, impulse);
        let newRelVel = p5.Vector.sub(relVel, correction);
        // The new absolute velocity is the wall velocity plus the reflected relative velocity.
        this.vel = p5.Vector.add(wallVel, newRelVel);
        
        // Reposition the ball so it is no longer penetrating the wall.
        let penetration = this.radius - dist;
        this.pos.add(p5.Vector.mult(n, penetration));
      }
    }
  }
  
  // Draw the ball.
  show() {
    noStroke();
    fill('blue');
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
  }
}

/* =========================
   Helper Functions
   ========================= */

// Draws a regular hexagon centered at 'center' with radius 'radius'
// and rotated by the angle 'rotation'.
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

// Given an edge defined by points A and B,
// returns the inward normal (unit vector) for the hexagon’s wall.
function getEdgeNormal(A, B) {
  // The raw perpendicular vector (one of two choices).
  let edge = p5.Vector.sub(B, A);
  let n = createVector(edge.y, -edge.x);
  n.normalize();
  // To decide which direction is “inward”, compare the normal to the vector
  // pointing from the edge (A) toward the hexagon’s center.
  let toCenter = p5.Vector.sub(center, A);
  if (n.dot(toCenter) < 0) {
    n.mult(-1);
  }
  return n;
}

// Given a point on the hexagon’s boundary, returns the velocity of that point
// due to the hexagon’s rotation about its center.
function getWallVelocity(P) {
  // Compute the vector from the hexagon’s center to point P.
  let r = p5.Vector.sub(P, center);
  // In 2D, the tangential (rotational) velocity is given by:
  // v = omega x r = omega * (-r.y, r.x)
  let vel = createVector(-hexAngularVelocity * r.y, hexAngularVelocity * r.x);
  return vel;
}
