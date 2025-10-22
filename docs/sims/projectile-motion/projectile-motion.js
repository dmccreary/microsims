// Projectile Motion MicroSim
// Demonstrates parabolic trajectory of projectiles with angle and power control

// Canvas dimensions - REQUIRED structure
let canvasWidth = 400;              // Initial width (responsive)
let drawHeight = 400;                // Drawing/simulation area height
let controlHeight = 100;             // Controls area height
let canvasHeight = drawHeight + controlHeight;
let margin = 25;                     // Margin for visual elements
let sliderLeftMargin = 120;          // Left margin for slider positioning
let defaultTextSize = 16;            // Base text size

// Simulation variables
let cannonX = 50;                    // Cannon position
let cannonY;                         // Set in setup based on drawHeight
let cannonLength = 40;
let gravity = 0.3;                   // Gravity acceleration

// Projectile state
let projectiles = [];                // Array of active projectiles
let trajectories = [];               // Array of completed trajectories
let isFiring = false;

// Control variables
let angle = 45;                      // Launch angle in degrees
let power = 15;                      // Launch power/velocity

// UI controls
let angleSlider;
let powerSlider;
let fireButton;
let resetButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Set cannon Y position (bottom of drawing area)
  cannonY = drawHeight - 50;

  // Angle slider (0-90 degrees)
  angleSlider = createSlider(0, 90, angle, 1);
  angleSlider.position(sliderLeftMargin, drawHeight + 15);
  angleSlider.size(canvasWidth - sliderLeftMargin - 170);

  // Power slider (5-25)
  powerSlider = createSlider(5, 25, power, 0.5);
  powerSlider.position(sliderLeftMargin, drawHeight + 45);
  powerSlider.size(canvasWidth - sliderLeftMargin - 170);

  // Fire button
  fireButton = createButton('Fire');
  fireButton.position(canvasWidth - 150, drawHeight + 15);
  fireButton.mousePressed(fireCannon);
  fireButton.style('padding', '8px 20px');
  fireButton.style('font-size', '14px');

  // Reset button
  resetButton = createButton('Reset');
  resetButton.position(canvasWidth - 150, drawHeight + 50);
  resetButton.mousePressed(resetTrajectories);
  resetButton.style('padding', '8px 20px');
  resetButton.style('font-size', '14px');

  describe('Projectile motion simulation with cannon that fires at adjustable angle and power, showing parabolic trajectories', LABEL);
}

function draw() {
  updateCanvasSize();

  // Get control values
  angle = angleSlider.value();
  power = powerSlider.value();

  // Drawing area (aliceblue background)
  fill('aliceblue');
  noStroke();
  rect(0, 0, width, drawHeight);

  // Draw ground line
  stroke('brown');
  strokeWeight(2);
  line(0, cannonY + 25, canvasWidth, cannonY + 25);

  // Draw cannon
  drawCannon();

  // Draw all saved trajectories (dashed lines)
  stroke('gray');
  strokeWeight(2);
  drawingContext.setLineDash([5, 5]);
  for (let trajectory of trajectories) {
    noFill();
    beginShape();
    for (let point of trajectory) {
      vertex(point.x, point.y);
    }
    endShape();
  }
  drawingContext.setLineDash([]);

  // Update and draw active projectiles
  for (let i = projectiles.length - 1; i >= 0; i--) {
    let p = projectiles[i];
    p.update();
    p.display();

    // Draw current trajectory
    stroke('blue');
    strokeWeight(2);
    drawingContext.setLineDash([5, 5]);
    noFill();
    beginShape();
    for (let point of p.trajectory) {
      vertex(point.x, point.y);
    }
    endShape();
    drawingContext.setLineDash([]);

    // Remove projectile if it's off screen or hit ground
    if (p.isDone()) {
      trajectories.push(p.trajectory);
      projectiles.splice(i, 1);
    }
  }

  // Draw title
  fill('black');
  textSize(28);
  textAlign(CENTER, TOP);
  noStroke();
  text('Projectile Motion', canvasWidth / 2, margin);

  // Control area (white background)
  fill('white');
  rect(0, drawHeight, width, controlHeight);

  // Draw control labels and values
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  fill('black');

  text('Angle: ' + angle + '°', 10, drawHeight + 25);
  text('Power: ' + power.toFixed(1), 10, drawHeight + 55);

  // Draw angle indicator on cannon
  textSize(12);
  textAlign(CENTER, CENTER);
  fill('darkred');
  let indicatorX = cannonX + cos(radians(angle - 90)) * (cannonLength + 15);
  let indicatorY = cannonY + sin(radians(angle - 90)) * (cannonLength + 15);
  text(angle + '°', indicatorX, indicatorY);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);

  // Reposition buttons
  fireButton.position(canvasWidth - 150, drawHeight + 15);
  resetButton.position(canvasWidth - 150, drawHeight + 50);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
    // Reposition all controls to match new width
    if (typeof angleSlider !== 'undefined') {
      angleSlider.size(canvasWidth - sliderLeftMargin - 170);
      powerSlider.size(canvasWidth - sliderLeftMargin - 170);
    }
  }
}

function drawCannon() {
  push();
  translate(cannonX, cannonY);
  rotate(radians(angle - 180)); // Adjust rotation

  // Cannon barrel
  fill('darkslategray');
  stroke('black');
  strokeWeight(2);
  rect(-8, 0, 16, cannonLength);

  // Cannon ball inside
  fill('navy');
  noStroke();
  ellipse(0, 5, 12, 12);

  pop();

  // Cannon base
  fill('darkslategray');
  stroke('black');
  strokeWeight(2);
  ellipse(cannonX, cannonY, 30, 30);
}

function fireCannon() {
  // Calculate initial velocity components
  let angleRad = radians(angle - 90);
  let vx = cos(angleRad) * power;
  let vy = sin(angleRad) * power;

  // Create new projectile
  let cannonTipX = cannonX + cos(angleRad) * cannonLength;
  let cannonTipY = cannonY + sin(angleRad) * cannonLength;

  projectiles.push(new Projectile(cannonTipX, cannonTipY, vx, vy));
}

function resetTrajectories() {
  trajectories = [];
  projectiles = [];
}

class Projectile {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = 6;
    this.trajectory = [];
    this.trajectory.push({x: this.x, y: this.y});
  }

  update() {
    // Apply gravity
    this.vy += gravity;

    // Update position
    this.x += this.vx;
    this.y += this.vy;

    // Record trajectory point
    this.trajectory.push({x: this.x, y: this.y});
  }

  display() {
    fill('navy');
    noStroke();
    ellipse(this.x, this.y, this.radius * 2);
  }

  isDone() {
    // Check if projectile is off screen or hit ground
    return (this.x > canvasWidth + 50 ||
            this.y > cannonY + 25 ||
            this.y > drawHeight ||
            this.x < -50);
  }
}
