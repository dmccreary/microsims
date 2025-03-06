// Fibonacci Clock MicroSim
// with options to display the time and the key
let canvasWidth = 600;
let drawingHeight = 375;
let controlsHeight = 50;
let keyHeight = 120;  // Increased height for additional key explanation
let canvasHeight = drawingHeight + controlsHeight;

// Define the Fibonacci squares with their values and positions
const fibSquares = [
  { value: 1, x: 150, y: 0, width: 75, height: 75 },   // First 1-square
  { value: 1, x: 150, y: 75, width: 75, height: 75 },  // Second 1-square
  { value: 2, x: 0, y: 0, width: 150, height: 150 },   // 2-square
  { value: 3, x: 0, y: 150, width: 225, height: 225 }, // 3-square
  { value: 5, x: 225, y: 0, width: 375, height: 375 }  // 5-square
];

// Color definitions
const OFF_COLOR = "#333333";     // Dark gray for "off" squares
const HOUR_COLOR = "#FF4136";    // Red for hours
const MINUTE_COLOR = "#2ECC40";  // Green for minutes
const BOTH_COLOR = "#0074D9";    // Blue for both hours and minutes
const TEXT_COLOR = "#FFFFFF";    // White text

// UI elements
let showTimeCheckbox;
let showKeyCheckbox;

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textAlign(CENTER, CENTER);
  textFont('Arial');
  frameRate(1); // Update once per second
  
  // Create checkboxes in controls area
  showTimeCheckbox = createCheckbox('Show Time', false);
  showTimeCheckbox.position(10, drawingHeight + 15);
  
  showKeyCheckbox = createCheckbox('Show Key', false);
  showKeyCheckbox.position(140, drawingHeight + 15);
  
  // Add event listener for the showKey checkbox
  showKeyCheckbox.changed(updateCanvasSize);
}

function updateCanvasSize() {
  if (showKeyCheckbox.checked()) {
    resizeCanvas(canvasWidth, drawingHeight + controlsHeight + keyHeight);
  } else {
    resizeCanvas(canvasWidth, drawingHeight + controlsHeight);
  }
}

function draw() {
  background(255);
  
  // Get current time
  const now = new Date();
  let hours = now.getHours() % 12; // Convert to 12-hour format
  if (hours === 0) hours = 12;     // Handle 12 AM/PM case
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  
  // Round minutes to nearest 5 (Fibonacci clocks typically display in 5-minute increments)
  let displayMinutes = Math.round(minutes / 5) * 5;
  if (displayMinutes == 60) displayMinutes = 0;
  
  // Draw divider between drawing area and controls area
  stroke(200);
  strokeWeight(1);
  line(0, drawingHeight, canvasWidth, drawingHeight);
  
  // Calculate which squares to light for hours (0-12)
  const hourSquares = calculateSquares(hours);
  
  // Calculate which squares to light for minutes (0-60, in steps of 5)
  const minuteSquares = calculateSquares(displayMinutes / 5);
  
  // Draw each Fibonacci square
  fibSquares.forEach((square, index) => {
    // Determine the color of the square
    let fillColor = OFF_COLOR; // Default off
    
    const isUsedForHour = hourSquares.includes(index);
    const isUsedForMinute = minuteSquares.includes(index);
    
    if (isUsedForHour && isUsedForMinute) {
      fillColor = BOTH_COLOR;      // Blue: both hours and minutes
    } else if (isUsedForHour) {
      fillColor = HOUR_COLOR;      // Red: hours only
    } else if (isUsedForMinute) {
      fillColor = MINUTE_COLOR;    // Green: minutes only
    }
    
    // Draw the square
    drawSquare(square.x, square.y, square.width, square.value, fillColor);
  });
  
  // Draw the controls area background
  noStroke();
  fill(240);
  rect(0, drawingHeight, canvasWidth, controlsHeight + (showKeyCheckbox.checked() ? keyHeight : 0));
  
  // Display digital time in controls area if checkbox is checked
  if (showTimeCheckbox.checked()) {
    fill(0);
    noStroke();
    textSize(20);
    // Format time with leading zeros
    const timeString = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    text(timeString, canvasWidth/2, drawingHeight + controlsHeight/2);
  }
  
  // Display key if checkbox is checked
  if (showKeyCheckbox.checked()) {
    fill(0);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(14);
    
    // Draw color key boxes and text
    // Hours - Red
    fill(HOUR_COLOR);
    rect(20, drawingHeight + controlsHeight + 10, 20, 20);
    
    // Minutes - Green
    fill(MINUTE_COLOR);
    rect(20, drawingHeight + controlsHeight + 40, 20, 20);
    
    // Both - Blue
    fill(BOTH_COLOR);
    rect(350, drawingHeight + controlsHeight + 10, 20, 20);
    
    // Off - Dark gray
    fill(OFF_COLOR);
    rect(350, drawingHeight + controlsHeight + 40, 20, 20);
    
    // Key text
    fill(0);
    textAlign(LEFT, CENTER);
    text("Red: Hours", 50, drawingHeight + controlsHeight + 20);
    text("Green: Minutes (in 5 minute increments)", 50, drawingHeight + controlsHeight + 50);
    text("Blue: Both hours and minutes", 380, drawingHeight + controlsHeight + 20);
    text("Dark gray: Inactive", 380, drawingHeight + controlsHeight + 50);
    
    // Additional explanation text
    text("Hours: sum the red and blue values", 50, drawingHeight + controlsHeight + 80);
    text("Minutes: sum the green and blue values and multiply by 5", 50, drawingHeight + controlsHeight + 100);
    
    // Reset text alignment for next elements
    textAlign(CENTER, CENTER);
  }
}

// Calculate which squares to use to represent a number
function calculateSquares(num) {
  const activeSquares = [];
  let remaining = num;
  
  // Start from the largest square and work backwards
  for (let i = fibSquares.length - 1; i >= 0; i--) {
    if (fibSquares[i].value <= remaining) {
      activeSquares.push(i);
      remaining -= fibSquares[i].value;
    }
  }
  
  return activeSquares;
}

function drawSquare(x, y, size, value, fillColor) {
  // Draw square
  fill(fillColor);
  stroke(0);
  strokeWeight(2);
  rect(x, y, size, size);
  
  // Draw fibonacci number in center
  fill(TEXT_COLOR);
  noStroke();
  
  // Scale text size based on square size
  let fontSize = value === 1 ? 24 : 36;
  textSize(fontSize);
  
  // Position text in center of square
  text(value, x + size/2, y + size/2);
}