// Circle MicroSim with responsive design
// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 100;
let defaultTextSize = 16;

// Global variables for width and height
let containerWidth; // calculated by container upon resize
let containerHeight = canvasHeight; // fixed height on page

// Circle parameters
let radius = 60;
let radiusSlider;

function setup() {
    // Create a canvas to match the parent container's size
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, containerHeight);
    canvas.parent(document.querySelector('main'));
    textSize(defaultTextSize);
    
    // Create slider for radius control
    radiusSlider = createSlider(0, 200, radius, 1);
    radiusSlider.position(sliderLeftMargin, drawHeight + 12);
    radiusSlider.size(canvasWidth - sliderLeftMargin - 20);
}

function draw() {
    // Draw the display area
    fill('aliceblue');
    stroke('silver');
    strokeWeight(1);
    rect(0, 0, canvasWidth, drawHeight);
    
    // Draw the controls area
    fill('white');
    rect(0, drawHeight, canvasWidth, controlHeight);
    
    // Get the current radius from the slider
    radius = radiusSlider.value();
    
    // Draw the circle
    fill('blue');
    noStroke();
    circle(canvasWidth/2, drawHeight/2, radius*2);
    
    // Draw the label and value
    fill('black');
    strokeWeight(0);
    textSize(defaultTextSize);
    textAlign(LEFT, CENTER);
    text('Radius: ' + radius, 10, drawHeight + 20);
}

function windowResized() {
    // Update canvas size when the container resizes
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
    
    // Resize the slider to match the new canvasWidth
    radiusSlider.size(canvasWidth - sliderLeftMargin - 20);
}

function updateCanvasSize() {
    // Get the exact dimensions of the container
    const container = document.querySelector('main').getBoundingClientRect();
    containerWidth = Math.floor(container.width);  // Avoid fractional pixels
    canvasWidth = containerWidth;
}