---
title: Solar Cell Battery Charger MicroSim
description: An interactive MicroSim demonstrating solar cell battery charger microsim.
quality_score: 47
social:
   cards: false
---
# Solar Cell Battery Charger MicroSim

[Run the Solar Cell Battery Charger MicroSim By Claude Anthropic 3.7](https://editor.p5js.org/dmccreary/sketches/ZkNGouD2x)

[]()

!!! prompt
    Please generate a p5.js sketch file for simulation of a battery being charged by a solar cell during the day and discharged at night be a light.  
    Add sliders at the bottom control region for:
    
        1. the time-of-day
        2. the amount of sunshine - and make the sun brighter with fewer clouds as you get brighter
        3. the amount of power drain
    
Have the sun move in an arch across the sky with it near the horizon in the early morning and late at night.

Use the responsive-design.js template.

Use the drawAnimatedWire, drawBattery and  drawSolarCell functions below to draw simulation.

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