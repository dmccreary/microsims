// Triangle Type Explorer MicroSim
// Interactive triangle visualization that classifies triangles by sides and angles
// Uses p5.js and responsive canvas design for educational exploration
// Author: Claude Code
// Version: 1.0

// Canvas dimensions - responsive design
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 110;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Triangle vertices - positions that can be dragged
// Initial configuration: Equilateral triangle with side length ~250
let v1 = { x: 175, y: 300 };
let v2 = { x: 425, y: 300 };
let v3 = { x: 300, y: 83.5 };

// Dragging state
let draggingVertex = null;
let dragDistance = 20; // pixels from vertex center to start drag

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const mainElement = document.querySelector('main');
    canvas.parent(mainElement);

    // Set description for accessibility
    describe('Interactive triangle explorer. Drag the red vertices to create different types of triangles. The triangle type (Equilateral, Isosceles, or Scalene) combined with angle classification (Acute, Right, or Obtuse) is displayed in real time.', LABEL);
}

function draw() {
    // Update canvas size for responsiveness
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);

    // Draw background regions
    fill('aliceblue');
    stroke('silver');
    strokeWeight(1);
    rect(0, 0, canvasWidth, drawHeight);

    fill('white');
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Draw the triangle with semi-transparent fill
    stroke('black');
    strokeWeight(2);
    fill('rgba(100, 150, 255, 0.3)');
    triangle(v1.x, v1.y, v2.x, v2.y, v3.x, v3.y);

    // Calculate triangle properties
    let sides = calculateSides();
    let angles = calculateAngles();

    // Draw right angle symbol if applicable
    drawRightAngleSymbol(angles);

    // Draw vertices as draggable circles
    drawVertices();

    // Classify triangle
    let sideType = classifyBySides(sides);
    let angleType = classifyByAngles(angles);
    let fullClassification = sideType + " " + angleType;

    // Display classification title
    fill('black');
    textSize(28);
    textAlign(LEFT);
    noStroke();
    text(fullClassification, margin, margin + 28);

    // Display side lengths
    fill('black');
    textSize(14);
    text(`Sides: ${sides.a.toFixed(1)}, ${sides.b.toFixed(1)}, ${sides.c.toFixed(1)}`, margin, margin + 60);

    // Display angles
    text(`Angles: ${angles.A.toFixed(1)}°, ${angles.B.toFixed(1)}°, ${angles.C.toFixed(1)}°`, margin, margin + 80);

    // Display instructions in control area
    fill('darkgray');
    textSize(12);
    text("Drag vertices (red circles A, B, C) to create different triangle types.", margin, drawHeight + 25);
    text("Try: Equilateral, Isosceles Right, Obtuse Scalene, Acute Isosceles, etc.", margin, drawHeight + 45);
    text("Angles in any triangle sum to 180°. Click Reset to return to start position.", margin, drawHeight + 65);

    // Reset text
    textSize(11);
    fill('blue');
    text("[R key = Reset]", canvasWidth - 120, drawHeight + 25);
}

function drawVertices() {
    // Draw vertex circles - large enough to be draggable
    fill('red');
    stroke('darkred');
    strokeWeight(2);

    // Vertex A
    circle(v1.x, v1.y, 12);

    // Vertex B
    circle(v2.x, v2.y, 12);

    // Vertex C
    circle(v3.x, v3.y, 12);

    // Draw vertex labels
    fill('darkred');
    textSize(12);
    textAlign(CENTER, CENTER);
    text('A', v1.x, v1.y);
    text('B', v2.x, v2.y);
    text('C', v3.x, v3.y);
}

function drawRightAngleSymbol(angles) {
    // Draw right angle symbol (small square) at any vertex with a 90° angle
    let rightAngleTolerance = 5; // degrees
    let squareSize = 15; // size of the right angle marker

    // Check angle at vertex A (v1)
    if (Math.abs(angles.A - 90) < rightAngleTolerance) {
        drawRightAngleMarker(v1, v2, v3, squareSize);
    }

    // Check angle at vertex B (v2)
    if (Math.abs(angles.B - 90) < rightAngleTolerance) {
        drawRightAngleMarker(v2, v1, v3, squareSize);
    }

    // Check angle at vertex C (v3)
    if (Math.abs(angles.C - 90) < rightAngleTolerance) {
        drawRightAngleMarker(v3, v1, v2, squareSize);
    }
}

function drawRightAngleMarker(rightAngleVertex, adjacent1, adjacent2, size) {
    // Draw a small square at the vertex to indicate a right angle
    // rightAngleVertex: the vertex with the right angle
    // adjacent1, adjacent2: the two adjacent vertices
    // size: size of the square marker

    // Calculate unit vectors from vertex to adjacent vertices
    let dx1 = adjacent1.x - rightAngleVertex.x;
    let dy1 = adjacent1.y - rightAngleVertex.y;
    let len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    let ux1 = (dx1 / len1) * size;
    let uy1 = (dy1 / len1) * size;

    let dx2 = adjacent2.x - rightAngleVertex.x;
    let dy2 = adjacent2.y - rightAngleVertex.y;
    let len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    let ux2 = (dx2 / len2) * size;
    let uy2 = (dy2 / len2) * size;

    // Draw the square
    push();
    noFill();
    stroke('black');
    strokeWeight(2);
    beginShape();
    vertex(rightAngleVertex.x + ux1, rightAngleVertex.y + uy1);
    vertex(rightAngleVertex.x + ux1 + ux2, rightAngleVertex.y + uy1 + uy2);
    vertex(rightAngleVertex.x + ux2, rightAngleVertex.y + uy2);
    vertex(rightAngleVertex.x, rightAngleVertex.y);
    endShape(CLOSE);
    pop();
}

function calculateSides() {
    // Calculate distances between vertices using distance formula
    // a = side opposite to vertex A (BC)
    // b = side opposite to vertex B (AC)
    // c = side opposite to vertex C (AB)
    let a = dist(v2.x, v2.y, v3.x, v3.y);
    let b = dist(v1.x, v1.y, v3.x, v3.y);
    let c = dist(v1.x, v1.y, v2.x, v2.y);

    return { a: a, b: b, c: c };
}

function calculateAngles() {
    // Use Law of Cosines to find angles
    // cos(A) = (b² + c² - a²) / (2bc)
    let sides = calculateSides();
    let a = sides.a;
    let b = sides.b;
    let c = sides.c;

    // Avoid division by zero with minimum side length
    if (a < 1 || b < 1 || c < 1) {
        return { A: 0, B: 0, C: 0 };
    }

    // Apply Law of Cosines
    let angleA = Math.acos(Math.max(-1, Math.min(1, (b * b + c * c - a * a) / (2 * b * c))));
    let angleB = Math.acos(Math.max(-1, Math.min(1, (a * a + c * c - b * b) / (2 * a * c))));
    let angleC = Math.acos(Math.max(-1, Math.min(1, (a * a + b * b - c * c) / (2 * a * b))));

    // Convert from radians to degrees
    return {
        A: radiansToDegrees(angleA),
        B: radiansToDegrees(angleB),
        C: radiansToDegrees(angleC)
    };
}

function classifyBySides(sides) {
    // Tolerance for determining if sides are "equal"
    let tolerance = 5; // pixels

    let sideArray = [sides.a, sides.b, sides.c].sort((x, y) => x - y);

    // Check if equilateral (all three sides approximately equal)
    if (Math.abs(sideArray[2] - sideArray[0]) < tolerance) {
        return "Equilateral";
    }

    // Check if isosceles (two sides approximately equal)
    if (Math.abs(sideArray[1] - sideArray[0]) < tolerance ||
        Math.abs(sideArray[2] - sideArray[1]) < tolerance) {
        return "Isosceles";
    }

    // Otherwise scalene (all sides different)
    return "Scalene";
}

function classifyByAngles(angles) {
    // Tolerance for determining if angle is "right" (90°)
    let rightAngleTolerance = 5; // degrees

    let angleArray = [angles.A, angles.B, angles.C];

    // Check for right angle (approximately 90°)
    for (let angle of angleArray) {
        if (Math.abs(angle - 90) < rightAngleTolerance) {
            return "Right";
        }
    }

    // Check if all angles are acute (less than 90°)
    if (angleArray.every(angle => angle < 90)) {
        return "Acute";
    }

    // Check if one angle is obtuse (greater than 90°)
    if (angleArray.some(angle => angle > 90)) {
        return "Obtuse";
    }

    return "";
}

function radiansToDegrees(radians) {
    // Convert radians to degrees
    return radians * 180 / Math.PI;
}

function mousePressed() {
    // Check if clicking on a vertex to start dragging
    if (dist(mouseX, mouseY, v1.x, v1.y) < dragDistance) {
        draggingVertex = 'v1';
        return false;
    }
    if (dist(mouseX, mouseY, v2.x, v2.y) < dragDistance) {
        draggingVertex = 'v2';
        return false;
    }
    if (dist(mouseX, mouseY, v3.x, v3.y) < dragDistance) {
        draggingVertex = 'v3';
        return false;
    }
}

function mouseDragged() {
    // Constrain vertices to stay within canvas bounds with padding
    let padding = 10;

    if (draggingVertex === 'v1') {
        v1.x = constrain(mouseX, padding, canvasWidth - padding);
        v1.y = constrain(mouseY, padding, drawHeight - padding);
        return false;
    }
    if (draggingVertex === 'v2') {
        v2.x = constrain(mouseX, padding, canvasWidth - padding);
        v2.y = constrain(mouseY, padding, drawHeight - padding);
        return false;
    }
    if (draggingVertex === 'v3') {
        v3.x = constrain(mouseX, padding, canvasWidth - padding);
        v3.y = constrain(mouseY, padding, drawHeight - padding);
        return false;
    }
}

function mouseReleased() {
    // Stop dragging when mouse is released
    draggingVertex = null;
}

function keyPressed() {
    // Allow reset with 'R' or 'r' key
    if (key === 'r' || key === 'R') {
        resetTriangle();
        return false;
    }
}

function resetTriangle() {
    // Reset to initial triangle configuration (Equilateral)
    v1 = { x: 175, y: 300 };
    v2 = { x: 425, y: 300 };
    v3 = { x: 300, y: 83.5 };
}

function updateCanvasSize() {
    // Update canvas width based on container size for responsiveness
    const container = document.querySelector('main');
    if (container) {
        canvasWidth = container.offsetWidth;
        // Ensure minimum width
        if (canvasWidth < 300) {
            canvasWidth = 300;
        }
        // Update vertex positions proportionally if container changed significantly
        canvasHeight = drawHeight + controlHeight;
    }
}

function windowResized() {
    // Handle window resize for responsive design
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
}
