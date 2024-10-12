// Larson Scanner
let numCircles = 12;        // Total number of circles
let circles = [];           // Array to hold circle positions
let current = 0;            // Current active circle index
let direction = 1;          // Direction of the scanner: 1 = forward, -1 = backward
let speedSlider;            // Slider to control speed
let speed;                  // Speed value from slider
let lastUpdate = 0;         // Time of the last update
let interval = 200;         // Interval between updates in milliseconds

function setup() {
  createCanvas(600, 300);
  // Calculate spacing between circles
  let spacing = width / (numCircles + 1);
  for (let i = 0; i < numCircles; i++) {
    let x = spacing * (i + 1);
    let y = 50; // Positioned near the top
    circles.push(createVector(x, y));
  }
  
  // Create a slider for speed control
  // Slider range: 50 ms (fast) to 1000 ms (slow)
  speedSlider = createSlider(50, 1000, interval, 50);
  speedSlider.position(150, height + 20);
  speedSlider.style('width', '300px');
  
  // Label for the slider
  let label = createP('Adjust Speed');
  label.position(150, height - 10);
  label.style('font-family', 'Arial');
  label.style('font-size', '16px');
}

function draw() {
  background(0); // Black background
  
  // Get current speed from slider
  speed = speedSlider.value();
  
  // Update interval based on speed
  interval = speed;
  
  // Update the current active circle based on the interval
  if (millis() - lastUpdate > interval) {
    current += direction;
    
    // Change direction if we reach the end or beginning
    if (current >= numCircles - 1) {
      direction = -1;
    } else if (current <= 0) {
      direction = 1;
    }
    
    lastUpdate = millis();
  }
  
  // Draw all circles
  for (let i = 0; i < numCircles; i++) {
    if (i === current) {
      // Active circle: bright red
      fill(255, 0, 0, 255);
      ellipse(circles[i].x, circles[i].y, 30, 30);
    } else if (i === current - direction || i === current + direction) {
      // Adjacent circles: semi-transparent red
      fill(255, 0, 0, 100);
      ellipse(circles[i].x, circles[i].y, 30, 30);
    } else {
      // Inactive circles: dim red
      fill(255, 0, 0, 50);
      ellipse(circles[i].x, circles[i].y, 30, 30);
    }
  }
  
  // Optional: Display current speed
  fill(255);
  noStroke();
  textSize(14);
  textAlign(CENTER);
  text(`Speed: ${speed} ms per step`, width / 2, height - 10);
}
