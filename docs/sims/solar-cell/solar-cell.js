let canvasWidth = 500;
let drawHeight = 400;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;

let timeSlider, sunlightSlider;
let batteryCharge = 50; // Initial battery charge (percentage)
let chargingRate = 0.1; // Rate of charging per frame
let dischargingRate = 0.2; // Rate of discharging per frame

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  
  // Create sliders
  timeSlider = createSlider(0, 24, 12, 0.1); // Time of day from 0 to 24 hours
  timeSlider.position(100, drawHeight + 10);
  timeSlider.style('width', '200px');
  
  sunlightSlider = createSlider(0, 100, 50, 1); // Sunlight intensity (0-100)
  sunlightSlider.position(100, drawHeight + 35);
  sunlightSlider.style('width', '200px');
}

function draw() {
  background(240);

  let timeOfDay = timeSlider.value();
  let sunlightIntensity = sunlightSlider.value();
  
  // Determine charging or discharging
  if (timeOfDay >= 6 && timeOfDay <= 18) { // Daytime
    let chargeAmount = (sunlightIntensity / 100) * chargingRate;
    batteryCharge = min(100, batteryCharge + chargeAmount);
  } else { // Nighttime
    batteryCharge = max(0, batteryCharge - dischargingRate);
  }

  // Draw sky background
  drawSky(timeOfDay);
  
  // Draw the sun or moon
  drawSunOrMoon(timeOfDay);
  
  // Draw battery
  drawBattery(batteryCharge);
  
  // Draw lightbulb (turns on at night)
  drawLightbulb(timeOfDay);
  
  // Display slider values
  fill(0);
  textSize(16);
  text("Time of Day: " + nf(timeOfDay, 1, 1) + " hrs", 10, drawHeight + 25);
  text("Sunlight: " + sunlightIntensity + "%", 10, drawHeight + 50);
}

function drawSky(timeOfDay) {
  if (timeOfDay >= 6 && timeOfDay <= 18) {
    background(135, 206, 250); // Daytime sky (light blue)
  } else {
    background(20, 24, 82); // Nighttime sky (dark blue)
  }
}

function drawSunOrMoon(timeOfDay) {
  let x = map(timeOfDay, 0, 24, 50, canvasWidth - 50);
  let y = timeOfDay >= 6 && timeOfDay <= 18 ? 100 : 300; // Sun higher, moon lower

  fill(timeOfDay >= 6 && timeOfDay <= 18 ? 'yellow' : 'white');
  noStroke();
  ellipse(x, y, 50, 50);
}

function drawBattery(chargeLevel) {
  fill(50);
  rect(200, 250, 100, 50, 5);
  
  fill('green');
  let chargeWidth = map(chargeLevel, 0, 100, 0, 100);
  rect(200, 250, chargeWidth, 50, 5);
  
  fill(0);
  textSize(14);
  text("Battery: " + nf(chargeLevel, 1, 1) + "%", 210, 245);
}

function drawLightbulb(timeOfDay) {
  let on = timeOfDay > 18 || timeOfDay < 6; // On at night
  fill(on ? 'yellow' : 'grey');
  ellipse(350, 270, 40, 40);
}

// draw a solar cell with a grid upper left at (x,y) of width and height a title on top like "Solar Cell"
function solarCell(x, y, width, height, title, textColor) {
  push(); // Save current drawing state
  fill(textColor);
  textSize(16);
  textAlign(CENTER);
  text(title, x+width/2, y-10);
  // Main panel background
  fill(40, 70, 110); // Dark blue-gray color typical of solar panels
  stroke(80);
  strokeWeight(2);
  rect(x, y, width, height);
  
  // Grid lines for solar cells
  const cellsPerRow = 4;
  const cellsPerCol = 4;
  const cellWidth = width / cellsPerRow;
  const cellHeight = height / cellsPerCol;
  
  // Draw vertical grid lines
  strokeWeight(1);
  stroke(60);
  for (let i = 1; i < cellsPerRow; i++) {
    line(x + i * cellWidth, y, x + i * cellWidth, y + height);
  }
  
  // Draw horizontal grid lines
  for (let i = 1; i < cellsPerCol; i++) {
    line(x, y + i * cellHeight, x + width, y + i * cellHeight);
  }
  
  // Add metallic connectors
  stroke(200);
  strokeWeight(1);
  for (let i = 0; i < cellsPerRow; i++) {
    for (let j = 0; j < cellsPerCol; j++) {
      // Draw thin lines representing the metallic connections
      const cellX = x + i * cellWidth;
      const cellY = y + j * cellHeight;
      
      // Horizontal connector lines
      line(cellX + 2, cellY + cellHeight/2, 
           cellX + cellWidth - 2, cellY + cellHeight/2);
      
      // Vertical connector lines
      line(cellX + cellWidth/2, cellY + 2, 
           cellX + cellWidth/2, cellY + cellHeight - 2);
    }
  }