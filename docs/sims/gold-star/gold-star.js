// MicroSim: Gold Star with variable number of points
// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 100;
let defaultTextSize = 16;

// global variables for width and height
let containerWidth; // calculated by container upon resize
let containerHeight = canvasHeight; // fixed height on page

// Star parameters
let points = 10; // default number of points
let pointsSlider;

function setup() {
    // Create a canvas to match the parent container's size
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, containerHeight);
    canvas.parent(document.querySelector('main'));
    textSize(defaultTextSize);

    // Create slider for number of points
    pointsSlider = createSlider(4, 30, 10);
    pointsSlider.position(sliderLeftMargin, drawHeight + 15);
    pointsSlider.size(canvasWidth - sliderLeftMargin - 15);
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

    // Get the new number of points from the slider
    points = pointsSlider.value();

    // Calculate star radius based on canvas size
    const r = min(canvasWidth, drawHeight) * 0.4;
    
    // Draw the star in the center of the drawing area
    push();
    translate(canvasWidth / 2, drawHeight / 2);
    star(0, 0, r * 0.6, r, points);
    pop();
    
    // Draw the label and values in the control area
    fill('black');
    strokeWeight(0);
    textSize(defaultTextSize);
    textAlign(LEFT, CENTER);
    text('Points: ' + points, 10, drawHeight + 25);
}

// Draw star at (x,y) with inner and outer radius and n points
function star(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    
    fill('gold');
    stroke('darkgoldenrod');
    strokeWeight(2);
    
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
        let sx = x + cos(a) * radius2;
        let sy = y + sin(a) * radius2;
        vertex(sx, sy);
        sx = x + cos(a + halfAngle) * radius1;
        sy = y + sin(a + halfAngle) * radius1;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}

function windowResized() {
    // Update canvas size when the container resizes
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
    
    // Resize the slider to match the new canvasWidth
    pointsSlider.size(canvasWidth - sliderLeftMargin - 15);
}

function updateCanvasSize() {
    // Get the exact dimensions of the container
    const container = document.querySelector('main').getBoundingClientRect();
    containerWidth = Math.floor(container.width);  // Avoid fractional pixels
    canvasWidth = containerWidth;
}