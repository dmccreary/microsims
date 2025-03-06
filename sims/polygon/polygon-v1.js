// MicroSim Template with responsive polygon drawing
// the width of the entire canvas
let canvasWidth = 400;
// The top drawing region above the interactive controls
let drawHeight = 400;
// control region height
let controlHeight = 50;
// The total height of both the drawing region height + the control region height
let canvasHeight = drawHeight + controlHeight;
// margin around the active plotting region
let margin = 25;
let sliderLeftMargin = 140;
// larger text so students in the back of the room can read the labels
let defaultTextSize = 16;

// global variables for width and height
let containerWidth; // calculated by container upon resize
let containerHeight = canvasHeight; // fixed height on page

// Polygon properties
let polygonRadius = 150;
let colorSlider;
let pointSlider;

function setup() {
    // Create a canvas to match the parent container's size
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, containerHeight);
    canvas.parent(document.querySelector('main'));
    
    textSize(defaultTextSize);
    noStroke();
    strokeWeight(0);
    // Change the default color scheme from RGB to Hue, Saturation and Brightness
    colorMode(HSB, 255);

    // number of points (or edges) in polygon
    pointSlider = createSlider(3, 20, 10);
    pointSlider.position(sliderLeftMargin, drawHeight + 5);
    pointSlider.size(canvasWidth - sliderLeftMargin - 15);

    colorSlider = createSlider(0, 255, 170);
    colorSlider.position(sliderLeftMargin, drawHeight + 25);
    colorSlider.size(canvasWidth - sliderLeftMargin - 15);
}

function draw() {
    // Draw the display area
    fill('aliceblue');
    stroke('silver');
    strokeWeight(1);
    rect(0, 0, containerWidth, drawHeight);
    
    // Draw the controls area
    fill('white');
    rect(0, drawHeight, containerWidth, controlHeight);

    let colorValue = colorSlider.value();
    let pointValue = pointSlider.value();

    // Calculate polygon center (adjusted for responsive canvas)
    let centerX = containerWidth / 2;
    let centerY = drawHeight / 2;
    
    // Adjust polygon radius if canvas gets too small
    let adjustedRadius = Math.min(polygonRadius, (containerWidth - 2*margin) / 2, (drawHeight - 2*margin) / 2);

    // Draw the polygon using HSB color mode
    fill(colorValue, 255, 255);
    noStroke();
    beginShape();
    for (let i = 0; i < pointValue; i++) {
        // walk around the 360 angles
        let angle = map(i, 0, pointValue, 0, TWO_PI);
        let x = centerX + adjustedRadius * cos(angle);
        let y = centerY + adjustedRadius * sin(angle);
        vertex(x, y);
    }
    endShape(CLOSE);

    // Draw the slider values
    fill('black');
    noStroke();
    strokeWeight(0);
    textSize(defaultTextSize);
    textAlign(LEFT, CENTER);
    text("Points: " + pointValue, 10, drawHeight + 15);
    text("Color: " + colorValue, 10, drawHeight + 35);
}

function windowResized() {
    // Update canvas size when the container resizes
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
    
    // Resize the sliders to match the new canvasWidth
    pointSlider.size(containerWidth - sliderLeftMargin - 15);
    colorSlider.size(containerWidth - sliderLeftMargin - 15);
}

function updateCanvasSize() {
    // Get the exact dimensions of the container
    const container = document.querySelector('main').getBoundingClientRect();
    containerWidth = Math.floor(container.width);  // Avoid fractional pixels
    canvasWidth = containerWidth;
}