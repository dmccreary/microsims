// Solar Battery Simulation
// Shows a solar cell charging a battery during the day and
// discharging at night through a light bulb

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 350;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 150;
let defaultTextSize = 16;

// Responsive design variables
let containerWidth; // calculated by container upon resize
let containerHeight = canvasHeight; // fixed height on page

// Simulation variables
let batteryLevel = 50; // battery charge level (0-100)
let lineWidth = 3; // width of wires
let timeOfDay = 12; // 0-24 hours
let sunIntensity = 0.7; // 0-1 for solar power generation
let powerDrain = 0.5; // 0-1 for power consumption

// UI elements
let timeSlider;
let sunIntensitySlider;
let powerDrainSlider;

function setup() {
  // Create a canvas to match the parent container's size
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Create sliders for simulation controls
  timeSlider = createSlider(0, 24, 12, 0.1);
  timeSlider.position(sliderLeftMargin, drawHeight + 15);
  timeSlider.size(canvasWidth - sliderLeftMargin - 15);
  
  sunIntensitySlider = createSlider(0, 100, 70, 1);
  sunIntensitySlider.position(sliderLeftMargin, drawHeight + 45);
  sunIntensitySlider.size(canvasWidth - sliderLeftMargin - 15);
  
  powerDrainSlider = createSlider(0, 100, 50, 1);
  powerDrainSlider.position(sliderLeftMargin, drawHeight + 75);
  powerDrainSlider.size(canvasWidth - sliderLeftMargin - 15);
}

function draw() {
  // Get values from sliders
  timeOfDay = timeSlider.value();
  sunIntensity = sunIntensitySlider.value() / 100;
  powerDrain = powerDrainSlider.value() / 100;

  // Background for drawing area
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Draw ground on bottom 5% of drawing region
  fill('#8B4513'); // Brown color for ground
  noStroke();
  rect(0, drawHeight - drawHeight * 0.05, canvasWidth, drawHeight * 0.05);
  
  // Draw grass on bottom 10% of drawing region
  fill('#228B22'); // Forest green
  rect(0, drawHeight - drawHeight * 0.1, canvasWidth, drawHeight * 0.05);

  // Background for controls area
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Draw scene based on time of day
  drawSky();
  drawSun();
  drawClouds();
  
  // Draw simulation elements
  const solarCellX = margin + 20;
  const solarCellY = drawHeight * 0.67;
  const solarCellWidth = 120;
  const solarCellHeight = 80;
  
  const batteryX = containerWidth / 2 - 20;
  const batteryY = drawHeight * 0.67;
  const batteryWidth = 40;
  const batteryHeight = 80;
  
  const lightBulbX = containerWidth - margin - 80;
  const lightBulbY = drawHeight * 0.8;
  
  // Draw Solar Cell
  drawSolarCell(solarCellX, solarCellY, solarCellWidth, solarCellHeight, "Solar Cell", "black");
  
  // Draw Battery
  drawBattery(batteryX, batteryY, batteryWidth, batteryHeight, "vertical", batteryLevel);
  
  // Draw Light Bulb
  drawLightBulb(lightBulbX, lightBulbY, 60, isNight());
  
  // Draw wires connecting components
  drawCircuit(solarCellX, solarCellY, solarCellWidth, solarCellHeight, 
              batteryX, batteryY, batteryWidth, batteryHeight,
              lightBulbX, lightBulbY);
  
  // Update battery level based on solar input and power drain
  updateBatteryLevel();
  
  // Draw labels for sliders
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  text('Time: ' + formatTime(timeOfDay), 10, drawHeight + 25);
  text('Sunshine: ' + sunIntensitySlider.value() + '%', 10, drawHeight + 55);
  text('Power Drain: ' + powerDrainSlider.value() + '%', 10, drawHeight + 85);
}

function drawSky() {
  // Day to night gradient based on time
  let skyColor;
  if (timeOfDay >= 6 && timeOfDay <= 18) {
    // Daytime - blue sky
    // More intense blue at noon, lighter at dawn/dusk
    let blueness = map(min(abs(timeOfDay - 12), 6), 0, 6, 255, 150);
    skyColor = color(135, 206, blueness);
  } else {
    // Nighttime - dark blue to black
    let darkness = map(min(timeOfDay, 24 - timeOfDay), 0, 6, 20, 100);
    skyColor = color(0, 0, darkness);
  }
  
  // Apply sky color
  noStroke();
  fill(skyColor);
  rect(0, 0, canvasWidth, drawHeight - drawHeight*.1);
  
  // Draw stars at night
  if (isNight()) {
    drawStars();
  }
}

function drawStars() {
  fill(255, 255, 255);
  noStroke();
  
  // Use noise to create a consistent star pattern
  randomSeed(10);
  for (let i = 0; i < 100; i++) {
    let x = random(canvasWidth);
    let y = random(drawHeight * 0.7);
    let size = random(1, 3);
    
    // Stars are more visible during deep night
    let starBrightness = map(min(timeOfDay, 24 - timeOfDay), 0, 5, 255, 0);
    if (starBrightness > 0) {
      fill(255, 255, 255, starBrightness);
      circle(x, y, size);
    }
  }
  randomSeed(); // Reset random seed
}

function drawSun() {
  // Calculate sun position based on time of day
  // Sun rises at 6AM and sets at 6PM (6-18 range)
  let isSunVisible = timeOfDay >= 6 && timeOfDay <= 18;
  
  if (isSunVisible) {
    // Calculate sun position along an arc
    let sunProgress = map(timeOfDay, 6, 18, 0, PI);
    let sunX = map(sunProgress, 0, PI, 0, canvasWidth);
    let sunY = map(sin(sunProgress), 0, 1, drawHeight * 0.7, drawHeight * 0.1);
    
    // Calculate sun color and size based on time
    let sunSize = map(sin(sunProgress), 0, 1, 40, 60);
    
    // Redder at sunrise/sunset
    let sunRed = map(sin(sunProgress), 0, 1, 255, 255);
    let sunGreen = map(sin(sunProgress), 0, 1, 100, 255);
    let sunBlue = map(sin(sunProgress), 0, 1, 0, 0);
    
    // Apply sun intensity from slider
    sunSize *= map(sunIntensity, 0, 1, 0.7, 1.3);
    
    // Draw sun
    fill(sunRed, sunGreen, sunBlue);
    noStroke();
    circle(sunX, sunY, sunSize);
    
    // Draw sun rays
    stroke(sunRed, sunGreen, sunBlue, 150);
    strokeWeight(2);
    for (let i = 0; i < 8; i++) {
      let angle = i * PI / 4;
      let rayLength = sunSize * 0.7 * sunIntensity;
      let x1 = sunX + cos(angle) * (sunSize / 2);
      let y1 = sunY + sin(angle) * (sunSize / 2);
      let x2 = sunX + cos(angle) * (sunSize / 2 + rayLength);
      let y2 = sunY + sin(angle) * (sunSize / 2 + rayLength);
      line(x1, y1, x2, y2);
    }
  }
}

function drawClouds() {
  // Draw clouds based on sunIntensity (fewer clouds = more sun)
  let cloudCount = map(sunIntensity, 0, 1, 5, 0); // More clouds when less sunlight
  
  // Cloud color depends on time of day
  let cloudBrightness = isNight() ? 150 : 255;
  fill(cloudBrightness, cloudBrightness, cloudBrightness, 200);
  noStroke();
  
  // Use a fixed random seed to keep clouds consistent
  randomSeed(42);
  
  for (let i = 0; i < cloudCount; i++) {
    let cloudX = map(i, 0, cloudCount, 0, canvasWidth);
    let cloudY = random(50, 150);
    let cloudWidth = random(50, 150);
    let cloudHeight = random(30, 60);
    
    // Draw cloud as a group of circles
    for (let j = 0; j < 5; j++) {
      let offsetX = map(j, 0, 4, -cloudWidth/2, cloudWidth/2);
      let offsetY = random(-cloudHeight/3, cloudHeight/3);
      let size = random(cloudHeight * 0.5, cloudHeight);
      circle(cloudX + offsetX, cloudY + offsetY, size);
    }
  }
  
  randomSeed(); // Reset random seed
}

function drawLightBulb(x, y, size, isOn) {
  // Draw light bulb
  const bulbSize = size * 0.6;
  const baseSize = size * 0.4;
  
  // Draw base
  fill(150);
  stroke(100);
  strokeWeight(1);
  rect(x - baseSize/2, y + bulbSize/2, baseSize, baseSize/2, 0, 0, 5, 5);
  
  // Draw metal contacts
  fill(200);
  rect(x - baseSize/3, y + bulbSize/2 + baseSize/3, baseSize/6, baseSize/6);
  rect(x + baseSize/6, y + bulbSize/2 + baseSize/3, baseSize/6, baseSize/6);
  
  // Draw bulb
  if (isOn && batteryLevel > 0) {
    // Light on - yellow glow with radial gradient
    fill(255, 255, 100, 100);
    noStroke();
    circle(x, y, bulbSize * 2); // Outer glow
    
    fill(255, 255, 150, 150);
    circle(x, y, bulbSize * 1.5); // Middle glow
    
    fill(255, 255, 200);
  } else {
    // Light off - transparent bulb
    fill(220, 220, 220, 150);
  }
  
  stroke(200);
  strokeWeight(1);
  circle(x, y, bulbSize);
  
  // Draw filament
  stroke(100);
  strokeWeight(1);
  line(x, y + bulbSize/2, x, y);
  line(x - bulbSize/4, y, x + bulbSize/4, y);
}

function drawCircuit(solarX, solarY, solarW, solarH, batteryX, batteryY, batteryW, batteryH, lightX, lightY) {
  // Connect solar panel to battery (charging circuit)
  const isSolarActive = !isNight() && sunIntensity > 0.1;
  
  // top wire from solar cell to battery
  drawAnimatedWire(
    solarX + solarW, solarY + solarH/2,
    batteryX, batteryY + solarH/2,
    0.05, 1, color(255, 0, 0), isSolarActive
  );
  
  // Wires from battery to solar cell
  drawAnimatedWire(  
    batteryX, batteryY + batteryH - 10,
    solarX + solarW, solarY + solarH - 10,
    0.05, 1, color(255, 0, 0), isSolarActive
  );
  
  // Wires from battery to light bulb (discharging circuit)
  const isLightActive = isNight() && batteryLevel > 0 && powerDrain > 0;
  
  // top wire from battery to bulb
  drawAnimatedWire(
    batteryX + batteryW, batteryY + batteryH/2,
    lightX - 20, lightY + 10,
    0.05, 1, color(255, 0, 0), isLightActive
  );
  
  // bottom wire from bulb back to battery
  drawAnimatedWire(
    lightX - 10, lightY + 30,
    batteryX + batteryW, batteryY + batteryH - 10,
    0.05, 1, color(255, 0, 0), isLightActive
  );
}

function updateBatteryLevel() {
  // Charging: during day with sun intensity
  let chargeRate = 0;
  if (!isNight()) {
    // Solar charging rate based on sun intensity and time of day
    // Max charging at noon, less at dawn/dusk
    let timeEffect = 1 - abs(timeOfDay - 12) / 6;
    chargeRate = sunIntensity * 0.2 * timeEffect;
  }
  
  // Discharging: at night with power drain
  let dischargeRate = 0;
  if (isNight() && batteryLevel > 0) {
    dischargeRate = powerDrain * 0.15;
  }
  
  // Update battery level
  batteryLevel = constrain(batteryLevel + chargeRate - dischargeRate, 0, 100);
}

function isNight() {
  return timeOfDay < 6 || timeOfDay > 18;
}

function formatTime(hours) {
  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
}

function windowResized() {
  // Update canvas size when the container resizes
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  redraw();
  
  // Resize sliders to match the new canvasWidth
  timeSlider.size(canvasWidth - sliderLeftMargin - 15);
  sunIntensitySlider.size(canvasWidth - sliderLeftMargin - 15);
  powerDrainSlider.size(canvasWidth - sliderLeftMargin - 15);
}

function updateCanvasSize() {
  // Get the exact dimensions of the container
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);  // Avoid fractional pixels
  canvasWidth = containerWidth;
}

// Function for drawing an animated wire with adjustable circle spacing
function drawAnimatedWire(x1, y1, x2, y2, speed, spacing, color, state) {
    let distance = dist(x1, y1, x2, y2);
    let numCircles = Math.floor(distance / (spacing * 50));  // Spacing scale factor for better visual control
    
    stroke(0);
    strokeWeight(lineWidth);
    line(x1, y1, x2, y2); // Draw the wire

    if (state) {
        for (let i = 0; i <= numCircles; i++) {
            // Calculate the position of each circle
            let circlePos = (millis() * speed + i * spacing * 50) % distance; // Space circles along the wire

            let x = lerp(x1, x2, circlePos / distance);
            let y = lerp(y1, y2, circlePos / distance);

            fill(255, 0, 0);
            noStroke();
            circle(x, y, 9); // Draw each circle (electron)
        }
    }
}

function drawBattery(x, y, width, height, orientation, level) {
  push(); // Save current transformation
  
  if (orientation === "horizontal") {
    // For horizontal orientation, we'll swap width and height and use rotation
    translate(x + height, y);
    rotate(PI/2);
    x = 0;
    y = 0;
    // Swap width and height
    let temp = width;
    width = height;
    height = temp;
  } else {
    translate(x, y);
    x = 0;
    y = 0;
  }
  
  // Calculate battery proportions
  let terminalHeight = height * 0.1; // Height of the positive terminal
  let bodyHeight = height - terminalHeight;
  let goldPercent = 0.4; // Proportion of the battery that is gold (positive)
  let goldHeight = bodyHeight * goldPercent;
  let blackHeight = bodyHeight * (1 - goldPercent);
  let batteryBorder = width * 0.1;
  let innerWidth = width - (batteryBorder * 2);
  
  // Draw battery outline
  strokeWeight(2);
  stroke(100);
  fill(240);
  rect(0, 0, width, height, 5, 5, 5, 5); // Rounded corners
  
  // Positive terminal (smaller rectangle at top)
  fill(220);
  noStroke();
  rect(width * 0.3, -terminalHeight, width * 0.4, terminalHeight);
  
  // Positive electrode (gold)
  fill('gold');
  rect(batteryBorder, batteryBorder, innerWidth, goldHeight);
  
  // Negative electrode (black)
  fill('black');
  rect(batteryBorder, batteryBorder + goldHeight, innerWidth, blackHeight);
  
  // Calculate battery level height/width
  let levelHeight = map(level, 0, 100, 0, bodyHeight - batteryBorder * 2);
  
  // Determine color based on battery level
  let levelColor;
  if (level < 20) {
    levelColor = color(255, 0, 0); // Red for low battery
  } else if (level < 50) {
    levelColor = color(255, 165, 0); // Orange for medium battery
  } else {
    levelColor = color(0, 255, 0); // Green for high battery
  }
  
  // Draw battery level (starting from bottom)
  fill(levelColor);
  rect(
    batteryBorder * 1.5, 
    height - batteryBorder - levelHeight, 
    innerWidth - batteryBorder, 
    levelHeight
  );
  
  // Draw battery terminals
  strokeWeight(2);
  stroke(50);
  
  // Positive terminal symbol (+)
  let centerX = width / 2;
  let plusY = batteryBorder + goldHeight / 2;
  line(centerX - 10, plusY, centerX + 10, plusY);
  line(centerX, plusY - 10, centerX, plusY + 10);
  
  // Negative terminal symbol (-)
  let minusY = batteryBorder + goldHeight + blackHeight / 2;
  stroke('gray');
  line(centerX - 10, minusY*1.2, centerX + 10, minusY*1.2);
  
  pop(); // Restore original transformation
}

// draw a solar cell with a grid upper left at (x,y) of width and height a title on top like "Solar Cell"
function drawSolarCell(x, y, width, height, title, textColor) {
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
  pop(); // Restore drawing state
}