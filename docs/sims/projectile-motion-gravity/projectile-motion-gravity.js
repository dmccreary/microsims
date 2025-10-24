// Projectile Motion MicroSim
// Demonstrates the effect of gravity on projectile motion
// Canvas dimensions
let canvasWidth = 500;
let drawHeight = 400;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 250;
let defaultTextSize = 16;

// Global variables for responsive design
let containerWidth; // calculated by container upon resize
let containerHeight = canvasHeight; // fixed height on page

// Cannon properties
let cannonX = 50;
let cannonY;
let cannonLength = 40;
let cannonAngle = 45; // degrees
let initialVelocity = 15;

// Projectile properties
let projectiles = []; // Array to store all fired projectiles
let gravity = 0.5; // m/s^2 (adjustable)

// UI Controls
let gravitySlider;
let fireButton;
let resetButton;

function setup() {
  // Create a canvas to match the parent container's size
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  
  // Position cannon at bottom
  cannonY = drawHeight - margin - 10;
  
  // Create gravity slider (0 to 2 m/s^2)
  gravitySlider = createSlider(0, 2, 0.5, 0.1);
  gravitySlider.position(sliderLeftMargin, drawHeight + 15);
  // Keep room for the trajectories label
  gravitySlider.size(containerWidth - sliderLeftMargin - 200);
  
  // Create fire button
  fireButton = createButton('Fire');
  fireButton.position(10, drawHeight + 15);
  fireButton.mousePressed(fireProjectile);
  
  // Create reset button
  resetButton = createButton('Reset');
  resetButton.position(60, drawHeight + 15);
  resetButton.mousePressed(resetSimulation);
  
  describe('Projectile motion simulator showing the effect of gravity on a cannon ball trajectory with adjustable gravity control.', LABEL);
}

function draw() {
  // Draw area background
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  
  // Control area background
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);
  
  // Update gravity from slider
  gravity = gravitySlider.value();
  
  // Title
  fill('black');
  noStroke();
  textSize(24);
  textAlign(CENTER, TOP);
  text("Projectile Motion with Variable Gravity", canvasWidth/2, margin/2);
  
  // Reset text properties
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  
  // Draw ground line
  stroke('brown');
  strokeWeight(2);
  line(0, cannonY + 10, canvasWidth, cannonY + 10);
  
  // Draw cannon
  drawCannon();
  
  // Update and draw all projectiles
  for (let i = projectiles.length - 1; i >= 0; i--) {
    let proj = projectiles[i];
    
    // Update position
    proj.velocityY += gravity;
    proj.x += proj.velocityX;
    proj.y += proj.velocityY;
    
    // Store trail point
    proj.trail.push({x: proj.x, y: proj.y});
    
    // Check if projectile hit the ground or went off screen
    if (proj.y >= cannonY || proj.x > canvasWidth || proj.x < 0 || proj.y > drawHeight) {
      proj.active = false;
    }
    
    // Draw trail with dashed line
    drawDashedTrail(proj.trail, proj.active);
    
    // Draw projectile if still active
    if (proj.active) {
      fill('black');
      noStroke();
      circle(proj.x, proj.y, 8);
    }
  }
  
  // Draw control label
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  text(`Gravity: ${gravity.toFixed(1)} m/s²`, 120, drawHeight + 25);
  
  // Display trajectory count
  textAlign(RIGHT, CENTER);
  text(`Trajectories: ${projectiles.length}`, canvasWidth - 80, drawHeight + 25);
}

function drawCannon() {
  push();
  translate(cannonX, cannonY);
  
  // Draw cannon base
  fill('darkgray');
  stroke('black');
  strokeWeight(2);
  circle(0, 0, 20);
  
  // Draw cannon barrel
  rotate(-radians(cannonAngle));
  fill('gray');
  rect(0, -5, cannonLength, 10);
  
  pop();
}

function drawDashedTrail(trail, isActive) {
  if (trail.length < 2) return;
  
  // Set color based on whether projectile is active
  if (isActive) {
    stroke('red');
    strokeWeight(2);
  } else {
    stroke('blue');
    strokeWeight(1.5);
  }
  
  // Draw dashed line through trail points
  let dashLength = 5;
  let gapLength = 3;
  let totalDist = 0;
  let drawDash = true;
  
  for (let i = 0; i < trail.length - 1; i++) {
    let p1 = trail[i];
    let p2 = trail[i + 1];
    
    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    let segmentLength = sqrt(dx * dx + dy * dy);
    
    if (segmentLength > 0) {
      let steps = ceil(segmentLength / (dashLength + gapLength));
      let stepX = dx / segmentLength;
      let stepY = dy / segmentLength;
      
      for (let j = 0; j < segmentLength; j += (dashLength + gapLength)) {
        if (drawDash) {
          let endDist = min(j + dashLength, segmentLength);
          line(
            p1.x + stepX * j,
            p1.y + stepY * j,
            p1.x + stepX * endDist,
            p1.y + stepY * endDist
          );
        }
        drawDash = !drawDash;
      }
    }
  }
}

function fireProjectile() {
  // Calculate initial velocity components
  let angle = radians(cannonAngle);
  let vx = initialVelocity * cos(angle);
  let vy = -initialVelocity * sin(angle);
  
  // Create new projectile
  let projectile = {
    x: cannonX + cos(angle) * cannonLength,
    y: cannonY - sin(angle) * cannonLength,
    velocityX: vx,
    velocityY: vy,
    trail: [],
    active: true
  };
  
  // Add initial position to trail
  projectile.trail.push({x: projectile.x, y: projectile.y});
  
  // Add to projectiles array
  projectiles.push(projectile);
}

function resetSimulation() {
  // Clear all projectiles and their trails
  projectiles = [];
}

function windowResized() {
  // Update canvas size when the container resizes
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  redraw();
  
  // Resize the slider to match the new canvasWidth
  gravitySlider.size(containerWidth - sliderLeftMargin - 200);
}

function updateCanvasSize() {
  // Get the exact dimensions of the container
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);  // Avoid fractional pixels
  canvasWidth = containerWidth;
}