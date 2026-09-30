// Gear Animation with Start/Stop Button and Speed Slider
// 

let canvasWidth = 800;
let drawHeight = 400;
let canvasHeight = 450;
let largeGear, smallGear;
let isRunning = true;
let speedSlider;
let startStopButton;

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);
   
  angleMode(RADIANS);
  
  // Initialize Gears
  // Large Gear: 20 teeth
  largeGear = new Gear(width / 3, height / 2, 150, 20);
  
  // Small Gear: 10 teeth
  smallGear = new Gear((2 * width) / 3 -25, height / 2, 75, 10);
  
  // Create Speed Slider
  createP('Rotation Speed:');
  speedSlider = createSlider(0, 4, .5, 0.1); // Base speed from 0 to 5
  
  // Create Start/Stop Button
  startStopButton = createButton('Stop');
  startStopButton.mousePressed(toggleAnimation);
  
  // Set text alignment for controls
  textAlign(CENTER, CENTER);
}

function draw() {
  background('aliceblue');
  
  // Update rotation if running
  if (isRunning) {
    let baseSpeed = speedSlider.value();
    largeGear.update(baseSpeed);
    smallGear.update(-2 * baseSpeed); // Small gear rotates twice as fast in opposite direction
  }
  
  // Display Gears
  largeGear.display();
  smallGear.display();
}

// Function to toggle animation
function toggleAnimation() {
  isRunning = !isRunning;
  if (isRunning) {
    startStopButton.html('Stop');
  } else {
    startStopButton.html('Start');
  }
}

// Gear Class Definition
class Gear {
  constructor(x, y, radius, numTeeth) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.numTeeth = numTeeth;
    this.angle = 0;
  }
  
  update(speed) {
    this.angle += speed * 0.02; // Adjusted for smoother rotation
  }
  
  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    
    // Draw Gear Body
    stroke(0);
    strokeWeight(2);
    fill('lightblue');
    ellipse(0, 0, this.radius * 2, this.radius * 2);
    
    // Draw Teeth
    let toothWidth = 10; // Width of each tooth in pixels
    let toothHeight = 50; // Height of each tooth in pixels
    
    for (let i = 0; i < this.numTeeth; i++) {
      let theta = i * TWO_PI / this.numTeeth;
      push();
      rotate(theta);
      // Position the tooth at the edge of the gear
      translate(this.radius, 0);
      rotate(PI / this.numTeeth); // Slight rotation for better alignment
      
      // Draw Tooth
      fill('blue');
      noStroke();
      rectMode(CENTER);
      rect(0, 0, toothWidth, toothHeight);
      
      pop();
    }
    
    pop();
  }
}