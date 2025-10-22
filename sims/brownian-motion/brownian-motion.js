// Brownian Motion MicroSim
// Demonstrates gas molecules bouncing in a chamber with temperature control

// Canvas dimensions - REQUIRED structure
let canvasWidth = 400;              // Initial width (responsive)
let drawHeight = 400;                // Drawing/simulation area height
let controlHeight = 120;             // Controls area height
let canvasHeight = drawHeight + controlHeight;
let margin = 25;                     // Margin for visual elements
let sliderLeftMargin = 150;          // Left margin for slider positioning
let defaultTextSize = 16;            // Base text size

// Simulation variables
let molecules = [];
let temperature = 5;
let numMolecules = 30;
let chamberArea = 300;  // Side length of chamber square
let collisionCount = 0;
let collisionsPerSecond = 0;
let lastSecond = 0;

// UI controls
let temperatureSlider;
let moleculesSlider;
let areaSlider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Temperature slider (affects velocity)
  temperatureSlider = createSlider(1, 20, temperature, 0.5);
  temperatureSlider.position(sliderLeftMargin, drawHeight + 15);
  temperatureSlider.size(canvasWidth - sliderLeftMargin - 15);

  // Number of molecules slider
  moleculesSlider = createSlider(5, 100, numMolecules, 1);
  moleculesSlider.position(sliderLeftMargin, drawHeight + 45);
  moleculesSlider.size(canvasWidth - sliderLeftMargin - 15);

  // Chamber area slider
  areaSlider = createSlider(150, 380, chamberArea, 10);
  areaSlider.position(sliderLeftMargin, drawHeight + 75);
  areaSlider.size(canvasWidth - sliderLeftMargin - 15);

  // Initialize molecules
  initializeMolecules();

  describe('Brownian motion simulation showing gas molecules bouncing in a chamber with temperature, molecule count, and area controls', LABEL);
}

function draw() {
  updateCanvasSize();

  // Get control values
  temperature = temperatureSlider.value();
  let targetMolecules = moleculesSlider.value();
  chamberArea = areaSlider.value();

  // Adjust molecule count
  while (molecules.length < targetMolecules) {
    molecules.push(createMolecule());
  }
  while (molecules.length > targetMolecules) {
    molecules.pop();
  }

  // Drawing area (aliceblue background)
  fill('aliceblue');
  noStroke();
  rect(0, 0, width, drawHeight);

  // Draw chamber centered in drawing area
  let chamberX = (canvasWidth - chamberArea) / 2;
  let chamberY = (drawHeight - chamberArea) / 2 + 30; // Offset for title

  push();
  stroke('silver');
  strokeWeight(2);
  noFill();
  rect(chamberX, chamberY, chamberArea, chamberArea);
  pop();

  // Title
  fill('black');
  textSize(28);
  textAlign(CENTER, TOP);
  noStroke();
  text('Brownian Motion', canvasWidth/2, margin);

  // Update and display molecules
  let currentCollisions = 0;
  for (let i = 0; i < molecules.length; i++) {
    molecules[i].update(temperature, chamberX, chamberY, chamberArea);
    molecules[i].display();

    // Check for wall collisions
    if (molecules[i].checkWallCollision(chamberX, chamberY, chamberArea)) {
      currentCollisions++;
    }

    // Check for molecule-molecule collisions
    for (let j = i + 1; j < molecules.length; j++) {
      if (molecules[i].checkMoleculeCollision(molecules[j])) {
        currentCollisions++;
      }
    }
  }

  collisionCount += currentCollisions;

  // Update collisions per second counter
  let currentTime = floor(millis() / 1000);
  if (currentTime > lastSecond) {
    collisionsPerSecond = collisionCount;
    collisionCount = 0;
    lastSecond = currentTime;
  }

  // Display collision counter in top right
  textSize(14);
  textAlign(RIGHT, TOP);
  fill('black');
  text('Collisions/sec: ' + collisionsPerSecond, canvasWidth - margin, margin + 35);

  // Control area (white background)
  fill('white');
  noStroke();
  rect(0, drawHeight, width, controlHeight);

  // Draw control labels and values
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  fill('black');

  text('Temperature: ' + temperature.toFixed(1), 10, drawHeight + 25);
  text('Molecules: ' + molecules.length, 10, drawHeight + 55);
  text('Chamber Size: ' + chamberArea, 10, drawHeight + 85);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
    // Reposition all controls to match new width
    if (typeof temperatureSlider !== 'undefined') {
      temperatureSlider.size(canvasWidth - sliderLeftMargin - 15);
      moleculesSlider.size(canvasWidth - sliderLeftMargin - 15);
      areaSlider.size(canvasWidth - sliderLeftMargin - 15);
    }
  }
}

function initializeMolecules() {
  molecules = [];
  for (let i = 0; i < numMolecules; i++) {
    molecules.push(createMolecule());
  }
}

function createMolecule() {
  let chamberX = (canvasWidth - chamberArea) / 2;
  let chamberY = (drawHeight - chamberArea) / 2 + 30;

  return {
    x: chamberX + random(10, chamberArea - 10),
    y: chamberY + random(10, chamberArea - 10),
    vx: random(-1, 1),
    vy: random(-1, 1),
    radius: 4,

    update: function(temp, chamberX, chamberY, chamberSize) {
      // Update velocity magnitude based on temperature
      let speed = temp * 0.5;
      let currentSpeed = sqrt(this.vx * this.vx + this.vy * this.vy);
      if (currentSpeed > 0) {
        this.vx = (this.vx / currentSpeed) * speed;
        this.vy = (this.vy / currentSpeed) * speed;
      }

      // Update position
      this.x += this.vx;
      this.y += this.vy;
    },

    checkWallCollision: function(chamberX, chamberY, chamberSize) {
      let collided = false;

      // Left and right walls
      if (this.x - this.radius < chamberX) {
        this.x = chamberX + this.radius;
        this.vx *= -1;
        collided = true;
      } else if (this.x + this.radius > chamberX + chamberSize) {
        this.x = chamberX + chamberSize - this.radius;
        this.vx *= -1;
        collided = true;
      }

      // Top and bottom walls
      if (this.y - this.radius < chamberY) {
        this.y = chamberY + this.radius;
        this.vy *= -1;
        collided = true;
      } else if (this.y + this.radius > chamberY + chamberSize) {
        this.y = chamberY + chamberSize - this.radius;
        this.vy *= -1;
        collided = true;
      }

      return collided;
    },

    checkMoleculeCollision: function(other) {
      let dx = other.x - this.x;
      let dy = other.y - this.y;
      let distance = sqrt(dx * dx + dy * dy);
      let minDist = this.radius + other.radius;

      if (distance < minDist) {
        // Simple elastic collision
        let angle = atan2(dy, dx);
        let targetX = this.x + cos(angle) * minDist;
        let targetY = this.y + sin(angle) * minDist;
        let ax = (targetX - other.x) * 0.5;
        let ay = (targetY - other.y) * 0.5;

        this.vx -= ax;
        this.vy -= ay;
        other.vx += ax;
        other.vy += ay;

        return true;
      }

      return false;
    },

    display: function() {
      fill(100, 150, 255, 180);
      noStroke();
      ellipse(this.x, this.y, this.radius * 2);
    }
  };
}
