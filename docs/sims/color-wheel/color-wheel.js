// Color Wheel MicroSim
// Helps students understand color relationships through interactive exploration

// Canvas dimensions
let canvasWidth = 650;
let drawHeight = 600;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;
let selectorLeftMargin = 120;

// Color wheel parameters
let wheelRadius = 200;
let wheelCenterX, wheelCenterY;
let selectedAngle = 0; // In degrees, 0 = red at top
let isDragging = false;

// Harmony mode
let harmonyMode = 'complementary';
let harmonySelect;

// Color names for the 12 segments
const colorNames = [
  'Red', 'Red-Orange', 'Orange', 'Yellow-Orange',
  'Yellow', 'Yellow-Green', 'Green', 'Blue-Green',
  'Blue', 'Blue-Violet', 'Violet', 'Red-Violet'
];

// Harmony descriptions
const harmonyDescriptions = {
  'complementary': 'Creates visual tension and contrast',
  'analogous': 'Creates harmony and unity',
  'triadic': 'Creates vibrant, balanced compositions',
  'split-complementary': 'High contrast with less tension'
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  colorMode(HSB, 360, 100, 100);

  // Calculate wheel center
  wheelCenterX = canvasWidth / 2 - 80;
  wheelCenterY = drawHeight / 2 + 20;

  // Create harmony mode selector
  harmonySelect = createSelect();
  harmonySelect.position(selectorLeftMargin, drawHeight + 15);
  harmonySelect.option('Complementary', 'complementary');
  harmonySelect.option('Analogous', 'analogous');
  harmonySelect.option('Triadic', 'triadic');
  harmonySelect.option('Split-Complementary', 'split-complementary');
  harmonySelect.selected('complementary');
  harmonySelect.changed(() => {
    harmonyMode = harmonySelect.value();
  });
  harmonySelect.style('font-size', '14px');

  describe('Interactive color wheel showing color harmony relationships including complementary, analogous, triadic, and split-complementary colors', LABEL);
}

function draw() {
  updateCanvasSize();

  // Drawing area
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  // Control area
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill(0, 0, 0);
  noStroke();
  textSize(24);
  textAlign(CENTER, TOP);
  text('Color Wheel Harmonies', canvasWidth / 2, 10);

  // Draw the color wheel
  drawColorWheel();

  // Draw harmony indicators
  drawHarmonyIndicators();

  // Draw selector
  drawSelector();

  // Draw info panel
  drawInfoPanel();

  // Draw control labels
  drawControlLabels();
}

function drawColorWheel() {
  push();
  translate(wheelCenterX, wheelCenterY);

  // Draw wheel segments
  let numSegments = 360;
  let segmentAngle = TWO_PI / numSegments;

  noStroke();
  for (let i = 0; i < numSegments; i++) {
    let angle = i * segmentAngle - HALF_PI; // Start from top
    let hue = i;

    fill(hue, 80, 95);
    arc(0, 0, wheelRadius * 2, wheelRadius * 2, angle, angle + segmentAngle + 0.01, PIE);
  }

  // Draw inner circle (white center)
  fill(0, 0, 100);
  stroke(0, 0, 70);
  strokeWeight(2);
  ellipse(0, 0, wheelRadius * 0.3, wheelRadius * 0.3);

  // Draw segment dividers and labels
  stroke(0, 0, 100);
  strokeWeight(1);
  for (let i = 0; i < 12; i++) {
    let angle = (i * 30 - 90) * PI / 180;
    let x1 = cos(angle) * wheelRadius * 0.15;
    let y1 = sin(angle) * wheelRadius * 0.15;
    let x2 = cos(angle) * wheelRadius;
    let y2 = sin(angle) * wheelRadius;
    line(x1, y1, x2, y2);
  }

  // Draw color name labels
  textSize(11);
  textAlign(CENTER, CENTER);
  fill(0, 0, 30);
  noStroke();
  for (let i = 0; i < 12; i++) {
    let angle = (i * 30 - 90) * PI / 180;
    let labelRadius = wheelRadius + 30;
    let x = cos(angle) * labelRadius;
    let y = sin(angle) * labelRadius;

    push();
    translate(x, y);
    // Rotate text for readability
    if (angle > HALF_PI && angle < PI + HALF_PI) {
      rotate(angle + PI);
    } else {
      rotate(angle);
    }
    text(colorNames[i], 0, 0);
    pop();
  }

  pop();
}

function drawHarmonyIndicators() {
  push();
  translate(wheelCenterX, wheelCenterY);

  let harmonyAngles = getHarmonyAngles();

  // Draw lines connecting harmony colors
  stroke(0, 0, 40);
  strokeWeight(2);

  let selectedRad = (selectedAngle - 90) * PI / 180;
  let selectedX = cos(selectedRad) * wheelRadius * 0.7;
  let selectedY = sin(selectedRad) * wheelRadius * 0.7;

  for (let angle of harmonyAngles) {
    let rad = (angle - 90) * PI / 180;
    let x = cos(rad) * wheelRadius * 0.7;
    let y = sin(rad) * wheelRadius * 0.7;
    line(selectedX, selectedY, x, y);
  }

  // Draw harmony color markers
  for (let angle of harmonyAngles) {
    let rad = (angle - 90) * PI / 180;
    let x = cos(rad) * wheelRadius * 0.7;
    let y = sin(rad) * wheelRadius * 0.7;

    fill(angle, 80, 95);
    stroke(0, 0, 0);
    strokeWeight(3);
    ellipse(x, y, 30, 30);

    // Inner highlight
    noFill();
    stroke(0, 0, 100, 0.5);
    strokeWeight(2);
    ellipse(x, y, 24, 24);
  }

  pop();
}

function drawSelector() {
  push();
  translate(wheelCenterX, wheelCenterY);

  let rad = (selectedAngle - 90) * PI / 180;
  let x = cos(rad) * wheelRadius * 0.7;
  let y = sin(rad) * wheelRadius * 0.7;

  // Outer ring
  stroke(0, 0, 0);
  strokeWeight(4);
  noFill();
  ellipse(x, y, 40, 40);

  // Inner fill
  fill(selectedAngle, 80, 95);
  stroke(0, 0, 100);
  strokeWeight(2);
  ellipse(x, y, 34, 34);

  // Center dot
  fill(0, 0, 0);
  noStroke();
  ellipse(x, y, 6, 6);

  pop();
}

function drawInfoPanel() {
  let panelX = canvasWidth - 160;
  let panelY = 10;
  let panelW = 150;
  let panelH = 250;

  // Panel background
  fill(0, 0, 100, 0.95);
  stroke(0, 0, 80);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 10);

  // Selected color section
  fill(0, 0, 20);
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  text('Selected Color', panelX + 10, panelY + 10);

  // Selected color swatch
  fill(selectedAngle, 80, 95);
  stroke(0, 0, 60);
  strokeWeight(1);
  rect(panelX + 10, panelY + 30, panelW - 20, 50, 5);

  // Color values
  fill(0, 0, 20);
  noStroke();
  textSize(12);
  let rgb = hsbToRgb(selectedAngle, 80, 95);
  text('HSB: ' + Math.round(selectedAngle) + ', 80, 95', panelX + 10, panelY + 90);
  text('RGB: ' + rgb.r + ', ' + rgb.g + ', ' + rgb.b, panelX + 10, panelY + 108);

  // Color name
  let colorIndex = Math.round(selectedAngle / 30) % 12;
  textSize(13);
  text(colorNames[colorIndex], panelX + 10, panelY + 128);

  // Harmony section
  fill(0, 0, 20);
  textSize(14);
  text('Harmony Colors', panelX + 10, panelY + 155);

  // Harmony swatches
  let harmonyAngles = getHarmonyAngles();
  let swatchY = panelY + 175;
  let swatchSize = 40;

  for (let i = 0; i < harmonyAngles.length; i++) {
    let angle = harmonyAngles[i];
    fill(angle, 80, 95);
    stroke(0, 0, 60);
    strokeWeight(1);
    rect(panelX + 10 + i * (swatchSize + 5), swatchY, swatchSize, swatchSize, 5);
  }

  // Harmony description
  fill(0, 0, 20);
  noStroke();
  textSize(12);
  textAlign(LEFT, TOP);

  // Mode name
  let modeName = harmonyMode.charAt(0).toUpperCase() + harmonyMode.slice(1).replace('-', ' ');
  textSize(13);
  text(modeName, panelX + 10, swatchY + swatchSize + 15);

  // Description with word wrap
  textSize(14);
  fill('black');
  let description = harmonyDescriptions[harmonyMode];
  text(description, 300, drawHeight + 20);

  // Instructions
  fill(0, 0, 50);
  textSize(11);
  textAlign(CENTER, CENTER);
  text('Click or drag on the color wheel to select a new base color.', canvasWidth/2, drawHeight - 15);
}


function getHarmonyAngles() {
  let angles = [];

  switch (harmonyMode) {
    case 'complementary':
      angles.push((selectedAngle + 180) % 360);
      break;
    case 'analogous':
      angles.push((selectedAngle + 30 + 360) % 360);
      angles.push((selectedAngle - 30 + 360) % 360);
      break;
    case 'triadic':
      angles.push((selectedAngle + 120) % 360);
      angles.push((selectedAngle + 240) % 360);
      break;
    case 'split-complementary':
      angles.push((selectedAngle + 150) % 360);
      angles.push((selectedAngle + 210) % 360);
      break;
  }

  return angles;
}

function hsbToRgb(h, s, b) {
  // Convert HSB to RGB
  push();
  colorMode(HSB, 360, 100, 100);
  let c = color(h, s, b);
  colorMode(RGB, 255);
  let r = Math.round(red(c));
  let g = Math.round(green(c));
  let bl = Math.round(blue(c));
  pop();
  return { r: r, g: g, b: bl };
}

function drawControlLabels() {
  fill(0, 0, 0);
  noStroke();
  textSize(14);
  textAlign(LEFT, CENTER);
  text('Harmony Mode:', 10, drawHeight + 25);
}

function mousePressed() {
  checkWheelClick();
}

function mouseDragged() {
  if (isDragging) {
    updateSelectedAngle();
  }
}

function mouseReleased() {
  isDragging = false;
}

function checkWheelClick() {
  let dx = mouseX - wheelCenterX;
  let dy = mouseY - wheelCenterY;
  let dist = sqrt(dx * dx + dy * dy);

  if (dist < wheelRadius && dist > wheelRadius * 0.15) {
    isDragging = true;
    updateSelectedAngle();
  }
}

function updateSelectedAngle() {
  let dx = mouseX - wheelCenterX;
  let dy = mouseY - wheelCenterY;
  let angle = atan2(dy, dx) * 180 / PI + 90;
  if (angle < 0) angle += 360;
  selectedAngle = angle;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  wheelCenterX = canvasWidth / 2 - 80;
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = max(600, container.offsetWidth);
    wheelCenterX = canvasWidth / 2 - 80;
  }
}
