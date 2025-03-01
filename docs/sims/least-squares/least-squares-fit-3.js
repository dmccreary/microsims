// Responsive Slope and Intercept Visualization
// Canvas dimensions
let canvasWidth = 500;
let drawHeight = 500;
let controlHeight = 55;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;
let labelValueWidth = 120;

// global variables for width and height
let containerWidth; // calculated by container upon resize
let containerHeight = canvasHeight; // fixed height on page

// test points
let p1 = [100, 280];
let p2 = [200, 320];
let p3 = [300, 200];
let p4 = [400, 210];

// UI elements
let slopeSlider, interceptSlider;

function setup() {
    // Create a canvas to match the parent container's size
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, containerHeight);
    canvas.parent(document.querySelector('main'));
    textSize(defaultTextSize);
    
    // Slope slider
    slopeSlider = createSlider(-2, 3, 0.5, 0.01);
    slopeSlider.position(labelValueWidth, drawHeight + 10);
    slopeSlider.size(containerWidth - labelValueWidth - 20);
    
    // Intercept slider
    interceptSlider = createSlider(-100, 170, 0, 1);
    interceptSlider.position(labelValueWidth, drawHeight + 30);
    interceptSlider.size(containerWidth - labelValueWidth - 20);
}

function draw() {
    // outline of regions in light gray
    stroke('silver');
    strokeWeight(1);
    // Drawing region
    fill('aliceblue');
    rect(0, 0, containerWidth, drawHeight);
    
    // draw the background of the controls region
    fill('white');
    rect(0, drawHeight, containerWidth, controlHeight);
    
    let slope = slopeSlider.value();
    let intercept = interceptSlider.value();
    
    drawGridLines();
    drawLine(slope, intercept);
    drawPoints();
    drawSquares(slope, intercept);
    drawLabelValues(slope, intercept);
}

function drawPoints() {
    // Adjust the points based on container size
    const scaleX = containerWidth / 500;
    const scaleY = drawHeight / 500;
    
    const scaledP1 = [p1[0] * scaleX, p1[1] * scaleY];
    const scaledP2 = [p2[0] * scaleX, p2[1] * scaleY];
    const scaledP3 = [p3[0] * scaleX, p3[1] * scaleY];
    const scaledP4 = [p4[0] * scaleX, p4[1] * scaleY];
    
    fill('green');
    noStroke();
    circle(scaledP1[0], scaledP1[1], 10);
    circle(scaledP2[0], scaledP2[1], 10);
    circle(scaledP3[0], scaledP3[1], 10);
    circle(scaledP4[0], scaledP4[1], 10);
}

function drawSquares(slope, intercept) {
    const scaleX = containerWidth / 500;
    const scaleY = drawHeight / 500;
    
    const scaledP1 = [p1[0] * scaleX, p1[1] * scaleY];
    const scaledP2 = [p2[0] * scaleX, p2[1] * scaleY];
    const scaledP3 = [p3[0] * scaleX, p3[1] * scaleY];
    const scaledP4 = [p4[0] * scaleX, p4[1] * scaleY];
    
    strokeWeight(0);
    
    // For each point, draw squares showing the difference between actual and predicted
    drawSquareForPoint(scaledP1, slope, intercept, 'red', 'orange');
    drawSquareForPoint(scaledP2, slope, intercept, 'yellow', 'pink');
    drawSquareForPoint(scaledP3, slope, intercept, 'cyan', 'blue');
    drawSquareForPoint(scaledP4, slope, intercept, 'lightgreen', 'olive');
    
    // Draw the points on the line
    fill('purple');
    noStroke();
    
    circle(scaledP1[0], drawHeight - (slope * scaledP1[0] + intercept), 10);
    circle(scaledP2[0], drawHeight - (slope * scaledP2[0] + intercept), 10);
    circle(scaledP3[0], drawHeight - (slope * scaledP3[0] + intercept), 10);
    circle(scaledP4[0], drawHeight - (slope * scaledP4[0] + intercept), 10);
}

function drawSquareForPoint(point, slope, intercept, colorAbove, colorBelow) {
    // predicted y point on line
    let p = drawHeight - (slope * point[0] + intercept);
    // absolute distance between the points
    let d = dist(point[0], point[1], point[0], p);
    
    // if prediction is above the actual point
    if (p > point[1]) {
        fill(colorAbove);
        rect(point[0], point[1], d, d);
    } else {
        fill(colorBelow);
        rect(point[0], p, d, d);
    }
}

function drawGridLines() {
    stroke('silver');
    
    // Calculate grid spacing based on container dimensions
    const hSpacing = containerWidth / 10;
    const vSpacing = drawHeight / 10;
    
    // horizontal lines
    for (let i = 0; i <= 10; i++) {
        strokeWeight(i % 2 ? 1 : 2);
        line(0, i * vSpacing, containerWidth, i * vSpacing);
    }
    
    // Vertical lines
    for (let i = 0; i <= 10; i++) {
        strokeWeight(i % 2 ? 1 : 2);
        line(i * hSpacing, 0, i * hSpacing, drawHeight);
    }
}

function drawLabelValues(slope, intercept) {
    fill('black');
    strokeWeight(0);
    textAlign(LEFT, CENTER);
    text('Slope: ' + slope.toFixed(1), 10, drawHeight + 20);
    text('Intercept: ' + intercept, 10, drawHeight + 40);
}

function drawLine(slope, intercept) {
    // Draw line in the drawing region
    stroke('blue');
    strokeWeight(2);
    
    // Calculate y values for x=0 and x=containerWidth
    const y1 = drawHeight - intercept;
    const y2 = drawHeight - (slope * containerWidth + intercept);
    
    line(0, y1, containerWidth, y2);
}

function windowResized() {
    // Update canvas size when the container resizes
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
    
    // Update slider positions and sizes
    slopeSlider.size(containerWidth - labelValueWidth - 20);
    interceptSlider.size(containerWidth - labelValueWidth - 20);
}

function updateCanvasSize() {
    // Get the exact dimensions of the container
    const container = document.querySelector('main').getBoundingClientRect();
    containerWidth = Math.floor(container.width);  // Avoid fractional pixels
    canvasWidth = containerWidth;
}