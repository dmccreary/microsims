// Pendulum MicroSim with adjustable parameters
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 120;  // Increased to accommodate more controls
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Pendulum parameters
let pivot = { x: canvasWidth/2, y: 50 };
let angle = Math.PI/4;  // Initial angle
let angleVelocity = 0;
let angleAcceleration = 0;
let gravity = 0.4;
let running = false;
let damping = 0.999;  // Small amount of damping to make it more realistic

// UI Controls
let lengthSlider;
let massSlider;
let toggleButton;
let resetButton;

// Initial conditions for reset
const initialAngle = Math.PI/4;
const initialVelocity = 0;

function setup() {
    const canvas = createCanvas(canvasWidth, canvasHeight);
    var mainElement = document.querySelector('main');
    canvas.parent(mainElement);
    textSize(defaultTextSize);

    // Create length slider
    lengthSlider = createSlider(100, 300, 200, 1);
    lengthSlider.position(margin, drawHeight + 20);
    lengthSlider.size(canvasWidth - 2*margin);

    // Create mass slider
    massSlider = createSlider(10, 50, 20, 1);
    massSlider.position(margin, drawHeight + 60);
    massSlider.size(canvasWidth - 2*margin);

    // Create toggle button
    toggleButton = createButton('Start');
    toggleButton.position(margin, drawHeight + 85);
    toggleButton.mousePressed(toggleSimulation);

    // Create reset button
    resetButton = createButton('Reset');
    resetButton.position(margin + 60, drawHeight + 85);
    resetButton.mousePressed(resetSimulation);
}

function draw() {
    // Drawing region
    stroke('silver');
    fill('aliceblue');
    rect(0, 0, canvasWidth, drawHeight);
    
    // Control region
    fill('white');
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Get current values from sliders
    let length = lengthSlider.value();
    let mass = massSlider.value();

    // Update physics if running
    if (running) {
        // Calculate forces on pendulum
        angleAcceleration = (-1 * gravity / length) * sin(angle);
        angleVelocity += angleAcceleration;
        angleVelocity *= damping;
        angle += angleVelocity;
    }

    // Calculate bob position
    let bobX = pivot.x + length * sin(angle);
    let bobY = pivot.y + length * cos(angle);

    // Draw pendulum
    stroke(0);
    strokeWeight(2);
    // Draw string
    line(pivot.x, pivot.y, bobX, bobY);
    
    // Draw pivot point
    fill(0);
    circle(pivot.x, pivot.y, 8);
    
    // Draw bob (size based on mass)
    fill(50);
    circle(bobX, bobY, mass);

    // Draw labels
    noStroke();
    fill(0);
    text("String Length: " + length + " pixels", margin, drawHeight + 15);
    text("Mass: " + mass + " units", margin, drawHeight + 55);
}

function toggleSimulation() {
    running = !running;
    toggleButton.html(running ? 'Stop' : 'Start');
}

function resetSimulation() {
    angle = initialAngle;
    angleVelocity = initialVelocity;
    running = false;
    toggleButton.html('Start');
}