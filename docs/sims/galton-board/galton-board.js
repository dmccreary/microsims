// Enhanced Galton Board (Plinko) Simulation with Speed Control Slider

let canvasWidth = 600;
let drawHeight = 650;
let canvasHeight = 700;

let numRows = 6;             // Number of pin rows
let pins = [];               // 2D array to store pin positions
let rowsY = [];              // Y-positions for each row
let ball = null;             // Current ball object
let newBallButton;           // "New Ball" button
let speedSlider;             // Speed control slider
let speedLabel;              // Label for the speed slider
let marginTop = 50;          // Top margin for pins
let marginBottom = 50;       // Bottom margin
let rowSpacing;              // Vertical spacing between rows
let marginX = 50;            // Horizontal margin
let spacingX;                // Horizontal spacing between pins

let speedFactor = 1;         // Initial speed factor

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  
  // Calculate vertical spacing between rows
  rowSpacing = (height - marginTop - marginBottom) / (numRows + 1);
  
  // Calculate Y-positions for each row
  for (let i = 1; i <= numRows; i++) {
    rowsY.push(marginTop + i * rowSpacing);
  }
  
  // Calculate horizontal spacing based on the maximum number of pins
  spacingX = (width - 2 * marginX) / (numRows - 1);
  
  // Calculate pin positions for each row with consistent horizontal spacing
  for (let i = 1; i <= numRows; i++) {
    let rowPins = [];
    let numPinsInRow = i;
    // Calculate the starting x position to center the row
    let startX = marginX + (numRows - i) * (spacingX / 2);
    for (let j = 0; j < numPinsInRow; j++) {
      let x = startX + j * spacingX;
      let y = rowsY[i - 1];
      rowPins.push({x, y});
    }
    pins.push(rowPins);
  }
  
  // Create "New Ball" button
  newBallButton = createButton('New Ball');
  newBallButton.position(10, 10);
  newBallButton.mousePressed(spawnNewBall);
  
  // Create Speed Slider
  speedLabel = createDiv('Simulation Speed: 1.0x');
  speedLabel.position(10, 40);
  
  speedSlider = createSlider(0.1, 3.0, .5, 0.1);
  speedSlider.position(150, 650);
  speedSlider.style('width', '200px');
}

function draw() {
  background(220);
  
  // Update speed factor from the slider
  speedFactor = speedSlider.value();
  speedLabel.html('Simulation Speed: ' + speedFactor.toFixed(1) + 'x');
  
  // Draw all pins
  fill(0);
  noStroke();
  for (let row of pins) {
    for (let pin of row) {
      circle(pin.x, pin.y, 10);
    }
  }
  
  // Update and draw the ball if it exists
  if (ball) {
    ball.update();
    ball.draw();
    
    // Check if the ball has stopped moving
    if (!ball.isMoving) {
      // Reset the ball to allow spawning a new one
      ball = null;
    }
  }
}

// Function to spawn a new ball
function spawnNewBall() {
  if (!ball) {
    ball = new Ball();
  }
}

// Ball class to handle ball properties and behavior
class Ball {
  constructor() {
    this.x = width / 2;                // Starting X position (top center)
    this.y = marginTop;                // Starting Y position (just below the top margin)
    this.radius = 5;                   // Ball radius
    this.velocityY = 0;                // Vertical velocity
    this.accelerationY = 0.5;          // Gravity
    this.currentRow = 0;               // Current row index
    this.targetY = rowsY[this.currentRow]; // Y-position of the first row
    this.isMoving = true;              // Ball movement state
    this.bounceHeight = 50;            // Maximum height of each bounce
    this.bouncing = false;             // Indicates if the ball is currently bouncing
    this.shiftDirection = 0;           // -1 for left, +1 for right
    this.shiftDistance = spacingX / 2; // Precise horizontal shift distance
  }
  
  update() {
    if (this.isMoving) {
      // Apply gravity scaled by speedFactor
      this.velocityY += this.accelerationY * speedFactor;
      this.y += this.velocityY * speedFactor;
      
      // Check for collision with the current target Y (pin)
      if (!this.bouncing && this.y >= this.targetY - this.radius) {
        // Initiate bounce
        this.bouncing = true;
        this.velocityY = -Math.sqrt(2 * this.accelerationY * this.bounceHeight) * speedFactor;
        
        // Decide shift direction
        this.shiftDirection = random() < 0.5 ? -1 : 1;
      }
      
      // Check if the ball has reached the apex of the bounce
      if (this.bouncing && this.velocityY >= 0) {
        // End of bounce
        this.bouncing = false;
        this.velocityY = 0;
        this.y = this.targetY;
        
        // Shift x position based on direction
        this.x += this.shiftDirection * this.shiftDistance;
        this.x = constrain(this.x, this.radius, width - this.radius);
        
        // Move to the next row
        this.currentRow++;
        if (this.currentRow < numRows) {
          this.targetY = rowsY[this.currentRow];
        } else {
          // Set target Y to bottom of the canvas
          this.targetY = height - marginBottom;
        }
      }
      
      // Check if the ball has reached the bottom
      if (this.currentRow >= numRows && this.y >= this.targetY - this.radius) {
        this.isMoving = false;
        this.y = this.targetY;
      }
    }
  }
  
  draw() {
    fill('blue');
    noStroke();
    circle(this.x, this.y, this.radius * 2);
  }
}