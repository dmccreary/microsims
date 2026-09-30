// p5.js Coordinate System Visualization
// Learning objective: Understand that p5.js has (0,0) at top-left with Y increasing downward

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 350;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    describe('Interactive visualization showing the p5.js coordinate system with origin at top-left and Y increasing downward. Move your mouse to see coordinates update.', LABEL);
}

function draw() {
    updateCanvasSize();

    // Drawing area background
    fill('aliceblue');
    stroke('silver');
    strokeWeight(1);
    rect(0, 0, canvasWidth, drawHeight);

    // Control area background
    fill('white');
    noStroke();
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Draw grid
    drawGrid();

    // Draw axes arrows
    drawAxes();

    // Draw corner coordinates
    drawCornerLabels();

    // Draw title
    fill('black');
    noStroke();
    textSize(20);
    textAlign(CENTER, TOP);
    text('p5.js Coordinate System', canvasWidth / 2, 8);

    // Draw interactive point following mouse
    drawInteractivePoint();

    // Draw instructions in control area
    drawControlArea();
}

function drawGrid() {
    stroke('#CCCCCC');
    strokeWeight(1);

    // Vertical grid lines every 50 pixels
    for (let x = 0; x <= canvasWidth; x += 50) {
        line(x, 0, x, drawHeight);
    }

    // Horizontal grid lines every 50 pixels
    for (let y = 0; y <= drawHeight; y += 50) {
        line(0, y, canvasWidth, y);
    }
}

function drawAxes() {
    let arrowSize = 10;
    let axisOffset = 40;

    // X-axis arrow (pointing right)
    stroke('black');
    strokeWeight(2);
    // Main line
    line(axisOffset, axisOffset, axisOffset + 100, axisOffset);
    // Arrowhead
    line(axisOffset + 100, axisOffset, axisOffset + 90, axisOffset - 5);
    line(axisOffset + 100, axisOffset, axisOffset + 90, axisOffset + 5);

    // X-axis label
    fill('black');
    noStroke();
    textSize(16);
    textAlign(LEFT, CENTER);
    text('X', axisOffset + 105, axisOffset);

    // Y-axis arrow (pointing down)
    stroke('black');
    strokeWeight(2);
    // Main line
    line(axisOffset, axisOffset, axisOffset, axisOffset + 100);
    // Arrowhead
    line(axisOffset, axisOffset + 100, axisOffset - 5, axisOffset + 90);
    line(axisOffset, axisOffset + 100, axisOffset + 5, axisOffset + 90);

    // Y-axis label
    fill('black');
    noStroke();
    textSize(16);
    textAlign(CENTER, TOP);
    text('Y', axisOffset, axisOffset + 105);
}

function drawCornerLabels() {
    fill('black');
    noStroke();
    textSize(14);

    // Origin (0,0) - top-left with red circle
    fill('red');
    ellipse(8, 8, 12, 12);
    fill('black');
    textAlign(LEFT, TOP);
    text('(0, 0)', 18, 5);

    // Top-right corner
    textAlign(RIGHT, TOP);
    text('(' + canvasWidth + ', 0)', canvasWidth - 5, 5);

    // Bottom-left corner
    textAlign(LEFT, BOTTOM);
    text('(0, ' + drawHeight + ')', 5, drawHeight - 5);

    // Bottom-right corner
    textAlign(RIGHT, BOTTOM);
    text('(' + canvasWidth + ', ' + drawHeight + ')', canvasWidth - 5, drawHeight - 5);
}

function drawInteractivePoint() {
    // Constrain mouse position to drawing area
    let mx = constrain(mouseX, 0, canvasWidth);
    let my = constrain(mouseY, 0, drawHeight);

    // Only draw if mouse is within the canvas
    if (mouseX >= 0 && mouseX <= canvasWidth && mouseY >= 0 && mouseY <= drawHeight) {
        // Draw crosshair lines
        stroke('#3366CC');
        strokeWeight(1);
        // Vertical line
        line(mx, 0, mx, drawHeight);
        // Horizontal line
        line(0, my, canvasWidth, my);

        // Draw the interactive point
        fill('#3366CC');
        noStroke();
        ellipse(mx, my, 16, 16);

        // Draw coordinate label near the point
        let labelX = mx + 15;
        let labelY = my - 15;

        // Adjust label position if too close to edges
        if (labelX + 80 > canvasWidth) {
            labelX = mx - 85;
        }
        if (labelY < 30) {
            labelY = my + 25;
        }

        // Draw label background
        fill(255, 255, 255, 220);
        stroke('#3366CC');
        strokeWeight(1);
        rectMode(CORNER);
        rect(labelX - 5, labelY - 12, 75, 24, 5);

        // Draw coordinate text
        fill('#3366CC');
        noStroke();
        textSize(14);
        textAlign(LEFT, CENTER);
        text('(' + Math.round(mx) + ', ' + Math.round(my) + ')', labelX, labelY);
    }
}

function drawControlArea() {
    fill('black');
    noStroke();
    textSize(defaultTextSize);
    textAlign(CENTER, CENTER);
    text('Move your mouse over the canvas to see coordinates', canvasWidth / 2, drawHeight + controlHeight / 2);
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) {
        canvasWidth = container.offsetWidth;
    }
}
