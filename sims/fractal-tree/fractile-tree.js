// Fractal Tree MicroSim with responsive design
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 170;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 110;
let defaultTextSize = 16;

let containerWidth;
let containerHeight = canvasHeight;

let angleSlider, branchesSlider, lengthSlider, widthSlider, depthSlider;
// Default values
let branches = 3, maxDepth = 3, angle = 45, length = 120, width = 4;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, containerHeight);
    canvas.parent(document.querySelector('main'));

    // Spacing between sliders is 30 pixels
    branchesSlider = createSlider(2, 5, 3);
    branchesSlider.position(sliderLeftMargin, drawHeight + 15);
    branchesSlider.size(canvasWidth - sliderLeftMargin - 15);

    depthSlider = createSlider(2, 8, 3);
    depthSlider.position(sliderLeftMargin, drawHeight + 45);
    depthSlider.size(canvasWidth - sliderLeftMargin - 15);

    angleSlider = createSlider(0, 90, 45);
    angleSlider.position(sliderLeftMargin, drawHeight + 75);
    angleSlider.size(canvasWidth - sliderLeftMargin - 15);

    lengthSlider = createSlider(50, 200, 120);
    lengthSlider.position(sliderLeftMargin, drawHeight + 105);
    lengthSlider.size(canvasWidth - sliderLeftMargin - 15);

    widthSlider = createSlider(1, 10, 4);
    widthSlider.position(sliderLeftMargin, drawHeight + 135);
    widthSlider.size(canvasWidth - sliderLeftMargin - 15);


}

function draw() {
    // drawing area background
    fill('aliceblue');
    // light gray border
    stroke('silver');
    strokeWeight(1);
    rect(0, 0, canvasWidth, drawHeight);
    // Draw control panel background
    fill('white');
    rect(0, drawHeight, canvasWidth, controlHeight);

    angle = angleSlider.value();
    branches = branchesSlider.value();
    length = lengthSlider.value();
    width = widthSlider.value();
    maxDepth = depthSlider.value();

    translate(containerWidth / 2, drawHeight - 10);
    stroke(0);
    strokeWeight(width);
    line(0, 0, 0, -length);
    translate(0, -length);

    drawBranch(length * 0.67, width, 0);

    resetMatrix();
    noStroke();
    fill('black');
    textSize(defaultTextSize);
    textAlign(LEFT, CENTER);
    
    // Draw control panel text every 30 pixels down
    text(`Branches: ${branches}`, 10, drawHeight + 25);
    text(`Max Depth: ${maxDepth}`, 10, drawHeight + 55);
    text(`Angle: ${angle}°`, 10, drawHeight + 85);
    text(`Length: ${length}`, 10, drawHeight + 115);
    text(`Width: ${width}`, 10, drawHeight + 145);

}

function drawBranch(len, strokeW, depth) {
    if (len < 4 || depth >= maxDepth) return;
  
    // 'angle' from slider is treated as half the total spread
    let halfSpread = angle;
    let numBranches = branches;
  
    // If only 1 branch, angleStep = 0 so we rotate by 0 (straight up)
    let angleStep = (numBranches > 1) ? (2 * halfSpread) / (numBranches - 1) : 0;
    let startAngle = -halfSpread;
  
    for (let i = 0; i < numBranches; i++) {
      push();
      // Current branch angle
      let branchAngle = startAngle + i * angleStep;
      rotate(radians(branchAngle));
  
      // Draw this branch
      let branchLen = len;
      let branchWidth = strokeW * 0.7;
      stroke(0);
      strokeWeight(max(1, branchWidth));
      line(0, 0, 0, -branchLen);
  
      // Move “up” the branch and recurse
      translate(0, -branchLen);
      drawBranch(branchLen * 0.67, branchWidth, depth + 1);
      pop();
    }
  }
  

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
    angleSlider.size(canvasWidth - sliderLeftMargin - 15);
    branchesSlider.size(canvasWidth - sliderLeftMargin - 15);
    lengthSlider.size(canvasWidth - sliderLeftMargin - 15);
    widthSlider.size(canvasWidth - sliderLeftMargin - 15);
    depthSlider.size(canvasWidth - sliderLeftMargin - 15);
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    containerWidth = Math.floor(container.width);
    canvasWidth = containerWidth;
}
