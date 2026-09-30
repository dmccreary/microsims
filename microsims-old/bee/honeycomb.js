let hexSizeSlider, hexSizeLabel;
let hexSize = 40;
let cols, rows;

function setup() {
  // Select the <main> element as the parent for the canvas
  let mainElement = select('main');
  let canvas = createCanvas(mainElement.width, 400);
  canvas.parent(mainElement);

  // Create a container for the controls
  let controlsContainer = createDiv();
  controlsContainer.parent(mainElement);
  controlsContainer.style('margin-top', '10px');

  // Create label for slider
  hexSizeLabel = createSpan('Hex Size: ' + hexSize);
  hexSizeLabel.parent(controlsContainer);
  hexSizeLabel.style('font-size', '16px');
  hexSizeLabel.style('margin-right', '10px');

  // Create slider for hex size
  hexSizeSlider = createSlider(10, 80, hexSize, 1);
  hexSizeSlider.parent(controlsContainer);
  hexSizeSlider.input(updateHexSize);
}

function updateHexSize() {
  hexSize = hexSizeSlider.value();
  hexSizeLabel.html('Hex Size: ' + hexSize);
}

function draw() {
  background('cornsilk');
  drawHoneycomb();
}

function drawHoneycomb() {
  let hexWidth = sqrt(3) * hexSize;
  let hexHeight = 2 * hexSize;
  let yOffset = hexHeight * 0.9; // Increased vertical spacing

  cols = ceil(width / hexWidth) + 1;
  rows = ceil(height / yOffset) + 1;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let x = col * hexWidth;
      let y = row * yOffset;

      if (col % 2 === 1) {
        y += yOffset / 2;
      }

      drawHexagon(x, y, hexSize);
    }
  }
}

function drawHexagon(x, y, size) {
  let angleStep = TWO_PI / 6;
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = angleStep * i;
    let vx = x + cos(angle) * size;
    let vy = y + sin(angle) * size;
    vertex(vx, vy);
  }
  endShape(CLOSE);
}

// Adjust canvas width dynamically on window resize
function windowResized() {
  let mainElement = select('main');
  resizeCanvas(mainElement.width, 400);
}
