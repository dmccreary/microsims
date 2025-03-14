let sizeSlider, sizeLabel;
let rotationSlider, rotationLabel;

// Default slider values
let beeSize = 190;
let beeRotation = 0;

function setup() {
  // Create a canvas within the <main> element
  const mainElement = select('main');
  let canvas = createCanvas(mainElement.width, 400);
  canvas.parent(mainElement);

  // Create a container for controls
  let controlsContainer = createDiv();
  controlsContainer.parent(mainElement);
  controlsContainer.style('margin-top', '10px');

  // SIZE label & slider
  sizeLabel = createSpan('Size: ' + beeSize);
  sizeLabel.parent(controlsContainer);
  sizeLabel.style('margin-right', '10px');

  sizeSlider = createSlider(50, 200, beeSize, 1);
  sizeSlider.parent(controlsContainer);
  sizeSlider.input(() => {
    beeSize = sizeSlider.value();
    sizeLabel.html('Size: ' + beeSize);
  });

  // ROTATION label & slider
  rotationLabel = createSpan(' Rotation: 0.0°');
  rotationLabel.parent(controlsContainer);
  rotationLabel.style('margin-left', '20px');
  rotationLabel.style('margin-right', '10px');

  rotationSlider = createSlider(0, TWO_PI, beeRotation, 0.01);
  rotationSlider.parent(controlsContainer);
  rotationSlider.input(() => {
    beeRotation = rotationSlider.value();
    rotationLabel.html(' Rotation: ' + degrees(beeRotation).toFixed(1) + '°');
  });
}

function draw() {
  background(255);

  // Center and rotate the entire bee
  translate(width / 2, height / 2);
  rotate(beeRotation);

  drawBee(beeSize);
}

function drawBee(s) {
  // Basic dimensions
  let bodyW = s * 0.5;
  let bodyH = s;

  // --- BACK LEGS ---
  push();
  stroke(0);
  strokeWeight(1);
  fill(0); // Add fill for legs
  drawLegs(bodyW, bodyH, s*.7, 'back'); // behind wings/body
  pop();

  // --- WINGS ---
  push();
  noStroke();
  drawWings(bodyW, bodyH, s);
  pop();

  // --- MIDDLE LEGS ---
  push();
  stroke(0);
  strokeWeight(1);
  fill(0); // Add fill for legs
  drawLegs(bodyW*.1, bodyH, s*1.7, 'middle'); // behind body, in front of wings
  pop();

  // --- BODY (with stripes) ---
  push();
  drawBodyWithStripes(bodyW, bodyH);
  pop();

  // --- FRONT LEGS ---
  push();
  stroke(0);
  strokeWeight(1);
  fill(0); // Add fill for legs
  drawLegs(bodyW, bodyH, s*.7, 'front'); // in front of the body
  pop();

  // --- HEAD & ANTENNAE ---
  push();
  drawHeadAndAntennae(bodyW, bodyH, s);
  pop();
}

/* ---------------------------------
   BODY with STRIPES
--------------------------------- */
function drawBodyWithStripes(bodyW, bodyH) {
  // Draw main body
  fill(0);
  noStroke();
  ellipse(0, 0, bodyW, bodyH);

  // Yellow stripes - using rectangles instead of arcs for better visibility
  fill(255, 204, 0);
  noStroke();
  let stripeCount = 3;
  let stripeHeight = bodyH * 0.12;
  
  for (let i = 1; i <= stripeCount; i++) {
    let fraction = i / (stripeCount + 1);
    // Y-position of stripe center
    let stripeY = lerp(-bodyH/2, bodyH/2, fraction);
    
    // Calculate width at this y-position (using ellipse equation)
    let y_normalized = stripeY / (bodyH/2);
    let x_at_y = bodyW/2 * sqrt(1 - y_normalized * y_normalized);
    
    // Draw a rectangle for the stripe
    rectMode(CENTER);
    rect(0, stripeY, x_at_y * 2, stripeHeight);
  }
}

/* ---------------------------------
   HEAD & ANTENNAE
--------------------------------- */
function drawHeadAndAntennae(bodyW, bodyH, size) {
  let headW = bodyW * 0.6;
  let headH = bodyH * 0.4;
  let headY = -bodyH / 2; // top of the main body

  // Head
  fill(0);
  noStroke();
  ellipse(0, headY, headW, headH);

  // Eyes
  fill(255);
  let eyeSize = size * 0.05;
  circle(-headW * 0.3, headY*1.1, eyeSize);
  circle(headW * 0.3, headY*1.1, eyeSize);

  // Antennae
  stroke(0);
  strokeWeight(2);
  noFill();
  let antennaLen = size * 0.4;

  // Left antenna
  let startLX = -headW * 0.25;
  let startLY = headY - headH * 0.2;
  let endLX = startLX - antennaLen * 0.7;
  let endLY = startLY - antennaLen * 0.3;
  bezier(
    startLX, startLY,
    startLX - antennaLen * 0.2, startLY - antennaLen * 0.1,
    startLX - antennaLen * 0.5, startLY - antennaLen * 0.4,
    endLX, endLY
  );

  // Right antenna
  let startRX = headW * 0.25;
  let startRY = headY - headH * 0.2;
  let endRX = startRX + antennaLen * 0.7;
  let endRY = startRY - antennaLen * 0.3;
  bezier(
    startRX, startRY,
    startRX + antennaLen * 0.2, startRY - antennaLen * 0.1,
    startRX + antennaLen * 0.5, startRY - antennaLen * 0.4,
    endRX, endRY
  );
}

/* ---------------------------------
   WINGS
--------------------------------- */
function drawWings(bodyW, bodyH, size) {
  let wingW = size * 1.2; // Increased wing width by 2x
  let wingH = size * 0.4;
  let wingY = -bodyH * 0.15;

  fill(200, 200, 255, 160); // semi-transparent

  // Left wing - moved further out from body
  push();
  translate(-bodyW * 0.6, wingY); // Increased distance from center
  rotate(-.15)
  drawDetailedWing(wingW, wingH, false);
  pop();

  // Right wing - moved further out from body
  push();
  translate(bodyW * 0.6, wingY); // Increased distance from center
  rotate(.15)
  drawDetailedWing(wingW, wingH, true);
  pop();
}

// A helper to add some overlapping ellipses & lines for detail
function drawDetailedWing(w, h, flip) {
  if (flip) scale(-1, 1);  
  ellipse(0, 0, w, h);
  // these don't seem to work
  // ellipse(w * 0.5, h * 0.2, w * 0.5, h * 0.4);
  // ellipse(w * 0.4, h * 0.3, w * 0.4, h * 0.3);

  // Some lines to suggest wing veins
  stroke(150);
  strokeWeight(1);
  line(0, 0, w * 0.4, -h * 0.25);
  line(0, 0, w * 0.35, h * 0.2);
  noStroke();
}

/* ---------------------------------
   LEGS
   We have 3 sets: back, middle, front
--------------------------------- */
function drawLegs(bodyW, bodyH, s, whichPair) {
  // Define leg offsets and angles for each pair
  let legBaseY, segmentDirectionY;
  
  switch (whichPair) {
    case 'back':
      legBaseY = bodyH * 0.3; // Attach near bottom
      segmentDirectionY = 1; // Bend down/back
      break;
    case 'middle':
      legBaseY = 0; // Attach at middle
      segmentDirectionY = 0; // Horizontal
      break;
    case 'front':
      legBaseY = -bodyH * 0.3; // Attach near top
      segmentDirectionY = -0.5; // Bend up/forward
      break;
  }
  
  // Left legs
  drawBeeLegs(-bodyW/2, legBaseY, s * 0.6, -1, segmentDirectionY); 
  
  // Right legs
  drawBeeLegs(bodyW/2, legBaseY, s * 0.6, 1, segmentDirectionY);
}

/* ---------------------------------
   Draw bee legs - simplified approach
--------------------------------- */
function drawBeeLegs(xBase, yBase, legLength, sideMultiplier, directionY) {
  // Leg joint positions
  let seg1Length = legLength * 0.4;
  let seg2Length = legLength * 0.6;
  
  // First segment - outward
  let joint1X = xBase + (seg1Length * sideMultiplier);
  let joint1Y = yBase + (seg1Length * 0.1); // Slightly downward
  
  // Second segment - downward and outward
  let endX = joint1X + (seg2Length * 0.7 * sideMultiplier);
  let endY = joint1Y + (seg2Length * directionY);
  
  // Draw the leg segments
  strokeWeight(4);
  line(xBase, yBase, joint1X, joint1Y);
  strokeWeight(2);
  line(joint1X, joint1Y, endX, endY);
  
  // Optional: Add small "foot" at the end
  line(endX, endY, endX + (3 * sideMultiplier), endY + 3);
}
/* ---------------------------------
   Keep canvas full-width, fixed height
--------------------------------- */
function windowResized() {
  const mainElement = select('main');
  resizeCanvas(mainElement.width, 400);
}