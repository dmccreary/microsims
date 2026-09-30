// Temperature and Pressure MicroSim
// Demonstrates relationship between temperature, molecular motion, and pressure

// Canvas dimensions - REQUIRED structure
let canvasWidth = 400;              // Initial width (responsive)
let drawHeight = 400;                // Drawing/simulation area height
let controlHeight = 80;              // Controls area height (increased for radio buttons)
let canvasHeight = drawHeight + controlHeight;
let margin = 25;                     // Margin for visual elements
let sliderLeftMargin = 180;          // Left margin for slider positioning
let defaultTextSize = 16;            // Base text size

// Simulation variables
let atoms = [];
let numAtoms = 100;                  // Fixed at 100
let temperature = 20;                // Temperature in Celsius (default 20°C)
let chamberArea = 300;               // Chamber size (fixed)
let collisionCount = 0;
let collisionsPerSecond = 0;
let lastSecond = 0;
let isRunning = false;               // Simulation running state
let isFahrenheit = false;            // Temperature scale (false = Celsius, true = Fahrenheit)

// Ice/Fire region
let iceFire_height = 50;

// UI controls
let temperatureSlider;
let startButton;
let celsiusRadio;
let fahrenheitRadio;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Temperature slider (-50°C to 100°C)
  temperatureSlider = createSlider(-50, 100, temperature, 1);
  temperatureSlider.position(sliderLeftMargin, drawHeight + 15);
  temperatureSlider.size(canvasWidth - sliderLeftMargin - 15);

  // Start/Pause button
  startButton = createButton('Start Simulation');
  startButton.position(10, drawHeight + 45);
  startButton.mousePressed(toggleSimulation);

  // Radio buttons for temperature scale (positioned in lower right)
  celsiusRadio = createRadio();
  celsiusRadio.option('Celsius', 'C');
  celsiusRadio.option('Fahrenheit', 'F');
  celsiusRadio.position(canvasWidth - 140, drawHeight + 40);
  celsiusRadio.style('color', 'black');
  celsiusRadio.selected('Celsius');  // Select by option name

  // Initialize atoms
  initializeAtoms();

  describe('Temperature and pressure simulation showing atoms moving in a chamber with temperature control and ice/fire visualization', LABEL);
}

function draw() {
  updateCanvasSize();

  // Sync isFahrenheit with radio button state using p5.js API
  let radioValue = celsiusRadio.value();
  let shouldBeFahrenheit = (radioValue === 'Fahrenheit');  // Compare to name, not value!

  // If the radio button changed, update the slider
  if (shouldBeFahrenheit !== isFahrenheit) {
    updateTemperatureScale();
  }

  // Get control values
  let tempCelsius = temperatureSlider.value();

  // Convert slider value if in Fahrenheit mode
  if (isFahrenheit) {
    tempCelsius = (tempCelsius - 32) * 5/9;  // Convert F to C for internal calculations
  }

  temperature = tempCelsius;

  // Drawing area (aliceblue background)
  fill('aliceblue');
  noStroke();
  rect(0, 0, width, drawHeight);

  // Title
  fill('black');
  textSize(28);
  textAlign(CENTER, TOP);
  noStroke();
  text('Temperature and Pressure', canvasWidth/2, margin);

  // Draw chamber centered in upper portion of drawing area
  let chamberX = (canvasWidth - chamberArea) / 2;
  let chamberY = margin + 40;  // Below title
  let chamberHeight = drawHeight - chamberY - iceFire_height - 10;

  push();
  stroke('silver');
  strokeWeight(2);
  noFill();
  rect(chamberX, chamberY, chamberArea, chamberHeight);
  pop();

  // Update and display atoms (only if simulation is running)
  if (isRunning) {
    let currentCollisions = 0;
    for (let i = 0; i < atoms.length; i++) {
      atoms[i].update(temperature, chamberX, chamberY, chamberArea, chamberHeight);
      atoms[i].display();

      // Check for wall collisions
      if (atoms[i].checkWallCollision(chamberX, chamberY, chamberArea, chamberHeight)) {
        currentCollisions++;
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
  } else {
    // Just display atoms without updating
    for (let i = 0; i < atoms.length; i++) {
      atoms[i].display();
    }
  }

  // Display collision counter (pressure indicator) in top right
  textSize(14);
  textAlign(RIGHT, TOP);
  fill('black');
  text('Wall Hits/sec: ' + collisionsPerSecond, canvasWidth - margin, margin + 35);
  text('(Pressure Indicator)', canvasWidth - margin, margin + 52);

  // Ice/Fire region (50px high, above control area)
  let iceFireY = drawHeight - iceFire_height;
  drawIceFireRegion(0, iceFireY, canvasWidth, iceFire_height, temperature);

  // Control area (white background)
  fill('white');
  noStroke();
  rect(0, drawHeight, width, controlHeight);

  // Draw control labels and values
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  fill('black');

  // Display temperature with appropriate scale
  // The slider value is already in the correct scale (C or F)
  let displayTemp = temperatureSlider.value();
  let tempUnit = isFahrenheit ? '°F' : '°C';
  text('Temperature: ' + displayTemp.toFixed(1) + tempUnit, 10, drawHeight + 25);

  // Update button text
  startButton.html(isRunning ? 'Pause Simulation' : 'Start Simulation');

  // Radio button label
  textSize(14);
  text('Scale:', canvasWidth - 190, drawHeight + 50);
}

function drawIceFireRegion(x, y, w, h, tempC) {
  // Background for ice/fire region
  fill(200, 220, 255);
  noStroke();
  rect(x, y, w, h);

  if (tempC < 0) {
    // Draw ice cubes when below 0°C
    drawIceCubes(x, y, w, h);
  } else {
    // Draw flames when above 0°C (more flames = hotter)
    let numFlames = floor(map(tempC, 0, 100, 5, 30));
    drawFlames(x, y, w, h, numFlames);
  }
}

function drawIceCubes(x, y, w, h) {
  // Draw multiple ice cubes across the region
  let cubeSize = 20;
  let spacing = 40;

  push();
  fill(200, 230, 255);
  stroke(150, 200, 255);
  strokeWeight(2);

  for (let cx = x + 20; cx < x + w - 20; cx += spacing) {
    let cy = y + h/2;
    rect(cx - cubeSize/2, cy - cubeSize/2, cubeSize, cubeSize, 3);

    // Ice sparkle lines
    /*
    stroke(255);
    strokeWeight(1);
    line(cx - cubeSize/4, cy - cubeSize/4, cx + cubeSize/4, cy + cubeSize/4);
    line(cx - cubeSize/4, cy + cubeSize/4, cx + cubeSize/4, cy - cubeSize/4);
    */
  }
  pop();
}

function drawFlames(x, y, w, h, numFlames) {
  // Draw animated flames
  push();
  noStroke();

  let spacing = w / (numFlames + 1);

  for (let i = 0; i < numFlames; i++) {
    let fx = x + spacing * (i + 1);
    let fy = y + h - 10;

    // Flame animation (flicker effect)
    let flicker = sin(millis() * 0.01 + i) * 3;

    // Orange flame (outer)
    fill(255, 140, 0, 200);
    drawFlameShape(fx, fy + flicker, 15, 25);

    // Yellow flame (inner)
    fill(255, 220, 0, 200);
    drawFlameShape(fx, fy + flicker + 5, 8, 15);

    // Red flame (core)
    fill(255, 50, 0, 150);
    drawFlameShape(fx, fy + flicker + 8, 4, 10);
  }
  pop();
}

function drawFlameShape(x, y, w, h) {
  // Draw a simple flame shape using bezier curves
  beginShape();
  vertex(x, y);
  bezierVertex(x - w/2, y - h/3, x - w/3, y - h * 0.7, x, y - h);
  bezierVertex(x + w/3, y - h * 0.7, x + w/2, y - h/3, x, y);
  endShape(CLOSE);
}

function celsiusToFahrenheit(c) {
  return c * 9/5 + 32;
}

function fahrenheitToCelsius(f) {
  return (f - 32) * 5/9;
}

function updateTemperatureScale() {
  // Check which radio button is selected using p5.js API
  let selectedValue = celsiusRadio.value();

  if (!isFahrenheit && selectedValue === 'Fahrenheit') {
    // Switching from Celsius to Fahrenheit
    let currentTempC = temperatureSlider.value();
    isFahrenheit = true;
    let tempF = celsiusToFahrenheit(currentTempC);
    temperatureSlider.remove();
    temperatureSlider = createSlider(-58, 212, tempF, 1);  // -50°C to 100°C in Fahrenheit
    temperatureSlider.position(sliderLeftMargin, drawHeight + 15);
    temperatureSlider.size(canvasWidth - sliderLeftMargin - 15);
  } else if (isFahrenheit && selectedValue === 'Celsius') {
    // Switching from Fahrenheit to Celsius
    let currentTempF = temperatureSlider.value();
    isFahrenheit = false;
    let tempC = fahrenheitToCelsius(currentTempF);
    temperatureSlider.remove();
    temperatureSlider = createSlider(-50, 100, tempC, 1);
    temperatureSlider.position(sliderLeftMargin, drawHeight + 15);
    temperatureSlider.size(canvasWidth - sliderLeftMargin - 15);
  }
}

function toggleSimulation() {
  isRunning = !isRunning;
}



function initializeAtoms() {
  atoms = [];
  let chamberX = (canvasWidth - chamberArea) / 2;
  let chamberY = margin + 40;
  let chamberHeight = drawHeight - chamberY - iceFire_height - 10;

  for (let i = 0; i < numAtoms; i++) {
    atoms.push(createAtom(chamberX, chamberY, chamberArea, chamberHeight));
  }
}

function createAtom(chamberX, chamberY, chamberWidth, chamberHeight) {
  return {
    x: chamberX + random(10, chamberWidth - 10),
    y: chamberY + random(10, chamberHeight - 10),
    vx: random(-1, 1),
    vy: random(-1, 1),
    radius: 4,

    update: function(temp, chamberX, chamberY, chamberWidth, chamberHeight) {
      // Update velocity magnitude based on temperature
      // Map temperature from -50°C to 100°C to speed from 0.5 to 15
      let speed = map(temp, -50, 100, 0.5, 15);
      speed = max(0.5, speed);  // Ensure minimum speed

      let currentSpeed = sqrt(this.vx * this.vx + this.vy * this.vy);
      if (currentSpeed > 0) {
        this.vx = (this.vx / currentSpeed) * speed;
        this.vy = (this.vy / currentSpeed) * speed;
      }

      // Update position
      this.x += this.vx;
      this.y += this.vy;
    },

    checkWallCollision: function(chamberX, chamberY, chamberWidth, chamberHeight) {
      let collided = false;

      // Left and right walls
      if (this.x - this.radius < chamberX) {
        this.x = chamberX + this.radius;
        this.vx *= -1;
        collided = true;
      } else if (this.x + this.radius > chamberX + chamberWidth) {
        this.x = chamberX + chamberWidth - this.radius;
        this.vx *= -1;
        collided = true;
      }

      // Top and bottom walls
      if (this.y - this.radius < chamberY) {
        this.y = chamberY + this.radius;
        this.vy *= -1;
        collided = true;
      } else if (this.y + this.radius > chamberY + chamberHeight) {
        this.y = chamberY + chamberHeight - this.radius;
        this.vy *= -1;
        collided = true;
      }

      return collided;
    },

    display: function() {
      // Color atoms based on temperature (cooler = blue, hotter = red)
      let tempNorm = map(temperature, -50, 100, 0, 1);
      let r = map(tempNorm, 0, 1, 100, 255);
      let g = map(tempNorm, 0, 1, 150, 100);
      let b = map(tempNorm, 0, 1, 255, 50);

      fill(r, g, b, 180);
      noStroke();
      ellipse(this.x, this.y, this.radius * 2);
    }
  };
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
    }
    if (typeof celsiusRadio !== 'undefined') {
      celsiusRadio.position(canvasWidth - 140, drawHeight + 40);
    }
  }
}