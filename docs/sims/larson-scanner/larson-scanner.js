// Larson Scanner MicroSim
// Simulates the iconic Cylon/KITT scanner effect with fading red lights

// Canvas dimensions - minimal height for efficiency
let canvasWidth = 400;
let drawHeight = 80;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let sliderLeftMargin = 180;

// Scanner parameters
let numCircles = 12;
let circles = [];
let current = 0;
let direction = 1;
let speedSlider;
let lastUpdate = 0;
let interval = 150;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    var mainElement = document.querySelector('main');
    canvas.parent(mainElement);

    describe('Larson Scanner animation with red lights that sweep back and forth like Cylon eyes', LABEL);

    // Calculate circle positions based on current width
    calculateCirclePositions();

    // Create speed slider (higher value = faster, inverted in draw())
    speedSlider = createSlider(30, 500, 380, 10);  // Default 380 → 150ms interval
    speedSlider.position(sliderLeftMargin, drawHeight + 12);
    speedSlider.size(canvasWidth - sliderLeftMargin - 15);
}

function calculateCirclePositions() {
    circles = [];
    let spacing = canvasWidth / (numCircles + 1);
    for (let i = 0; i < numCircles; i++) {
        let x = spacing * (i + 1);
        let y = drawHeight / 2;
        circles.push(createVector(x, y));
    }
}

function draw() {
    // Black background for drawing area (contrast with red lights)
    fill(0);
    noStroke();
    rect(0, 0, canvasWidth, drawHeight);

    // Dark gray control area
    fill(30);
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Get current speed from slider (inverted: right = faster)
    interval = 530 - speedSlider.value();  // 530 = min(30) + max(500)

    // Update scanner position based on interval
    if (millis() - lastUpdate > interval) {
        current += direction;

        if (current >= numCircles - 1) {
            direction = -1;
        } else if (current <= 0) {
            direction = 1;
        }

        lastUpdate = millis();
    }

    // Draw circles with glow effect
    noStroke();
    let circleSize = Math.min(30, (canvasWidth / numCircles) * 0.6);

    for (let i = 0; i < numCircles; i++) {
        let alpha;
        let glowSize = circleSize;

        if (i === current) {
            // Active circle: bright red with glow
            alpha = 255;
            glowSize = circleSize * 1.2;
            // Draw glow
            fill(255, 0, 0, 50);
            ellipse(circles[i].x, circles[i].y, glowSize * 1.8, glowSize * 1.8);
            fill(255, 0, 0, 100);
            ellipse(circles[i].x, circles[i].y, glowSize * 1.4, glowSize * 1.4);
        } else if (Math.abs(i - current) === 1) {
            // Adjacent circles: medium brightness
            alpha = 150;
        } else if (Math.abs(i - current) === 2) {
            // Two away: dim
            alpha = 80;
        } else {
            // Inactive circles: very dim
            alpha = 30;
        }

        fill(255, 0, 0, alpha);
        ellipse(circles[i].x, circles[i].y, circleSize, circleSize);
    }

    // Draw slider label
    fill(200);
    textSize(14);
    textAlign(LEFT, CENTER);
    text('Speed: (delay=' + interval + ' msec)', margin, drawHeight + 25);
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    calculateCirclePositions();

    // Reposition slider
    speedSlider.position(sliderLeftMargin, drawHeight + 12);
    speedSlider.size(canvasWidth - sliderLeftMargin - 15);
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    canvasWidth = Math.floor(container.width);
    canvasWidth = Math.max(canvasWidth, 300);
}
