// LED Circuit Simulation
let state = false;
let animationSpeed = .2;
let lineWidth = 8;
// top row of components
let topRowHeight = 70;
// bottom row of components
let rightColumnWidth = 300;
let batteryHeight = 150;
// set this to height - 50
let bottomRowHeight = 350;


// Function for drawing an animated wire
function drawAnimatedWire(x1, y1, x2, y2, speed1, state) {
    if (state) {
        let distance = dist(x1, y1, x2, y2);
        let circlePos = map((millis() * speed1) % distance, 0, distance, 0, 1);

        let x = lerp(x1, x2, circlePos);
        let y = lerp(y1, y2, circlePos);

        stroke(0);
        strokeWeight(lineWidth)
        line(x1, y1, x2, y2);

        fill(255, 0, 0);
        noStroke();
        circle(x, y, 10);
    } else {
        stroke(0);
        strokeWeight(lineWidth)
        line(x1, y1, x2, y2);
    }
}

function setup() {
  const canvas = createCanvas(400, 400);
  canvas.parent('canvas-container');
  let bottomRowHeight = height - 100;
  createButton('Toggle On/Off')
    .position(width/2 - 60, height-35)
    .mousePressed(() => state = !state);
}

function draw() {
  background(245);
  
  // x, y, state
  drawSwitch(150, topRowHeight, state);
  drawResistor(rightColumnWidth - 15, topRowHeight+50, 30, 100, 2, 'vertical');
  drawLED(rightColumnWidth, 255, state);
  
  // Draw the wires
  // battery to switch
  // vertical line
  drawAnimatedWire(75, topRowHeight+50, 75, topRowHeight, animationSpeed, state);
  // horizontal line
  drawAnimatedWire(75, topRowHeight, 150, topRowHeight, animationSpeed, state);
  
  // switch to resistor
  // horizontal line
  drawAnimatedWire(200, topRowHeight, rightColumnWidth, topRowHeight, animationSpeed, state);
  // vertical line
  drawAnimatedWire(rightColumnWidth, topRowHeight, rightColumnWidth, topRowHeight+50, animationSpeed, state);
  
  // resistor to LED vertical wire
  drawAnimatedWire(rightColumnWidth, 220, rightColumnWidth, 250, animationSpeed, state);
  
  // LED to negative of battery
  drawAnimatedWire(rightColumnWidth, 310, rightColumnWidth, bottomRowHeight, animationSpeed, state);
  
  drawAnimatedWire(rightColumnWidth, bottomRowHeight, 75, bottomRowHeight, animationSpeed, state);
  
  // vertical line up to battery
  drawAnimatedWire(75, bottomRowHeight, 75, bottomRowHeight-100, animationSpeed, state);
  
  // x, y, batteryWidth, Batteryheight
  drawBattery(50, topRowHeight+50, 50, 150);
}


function drawBattery(x1, y1, batWidth, batHeight) {
  batteryWidth = batWidth;
  batteryHeight = batHeight;
  goldTopPercent = .30;
  // "-" and "+" horizontal line x margin
  hlinex = batteryWidth/5
  strokeWeight(2);
  fill('gold')
  rect(x1, y1, batteryWidth, batteryHeight*goldTopPercent)
  fill('black')
  rect(x1, y1+batteryHeight*goldTopPercent, batteryWidth, batteryHeight*(1-goldTopPercent))
  // horizontal line x margin
  hlinex = batteryWidth/5
  // draw the minus in white
  stroke('white')
  strokeWeight(2)
  line(x1 + batteryWidth/4, y1 + batteryHeight*.9, x1+   
       batteryWidth/4*3, y1 + batteryHeight*.9);
  
  // draw the plus at the top of the battery
  stroke('black')
  // horizontal black line of the "+"
  line(x1+hlinex, y1 + batteryHeight*.15, x1+   
       hlinex*4, y1 + batteryHeight*.15);
  // verticl line of tbe "+""
  line(x1 + batteryWidth/2, y1 + batteryHeight*.05, 
       x1 + batteryWidth/2, y1 + batteryHeight*.25);
}

function drawSwitch(x, y, state) {
  strokeWeight(lineWidth);
  if (state) {
    line(x, y, x + 50, y);
  } else {
    line(x, y, x + 30, y - 30);
    
  }
}

function drawLED(x, y, state) {
  strokeWeight(3);
  if (state == 1)
    fill(color(255, 0, 0))
  else
    fill(0);
  circle(x, y + 25, 50);
}

// function drawResistor(150, 200, 100, 200, 2, 'vertical');
function drawResistor(x, y, rwidth, rheight, lineWidth, orientation) {
  // light gray background
  fill(230);
  stroke(1);
  strokeWeight(1);
  rect(x,y,rwidth,rheight);
  strokeWeight(lineWidth);
  // the percent of the length of the resistor that is taken by each end wire
  endWirePercent = .15
  endWireLength = rwidth * endWirePercent
  // draw end wires
  halfHeight = y+rheight/2
  
  // number of zig-zag peaks
  // The international symbol is 6
  let peaks = 6;
  let peakWidth = (rwidth-2*endWireLength) / peaks;
  let peakHeight = rheight / 3;

  if (orientation === 'horizontal') {
    beginShape();
    // left end wire
    line(x, halfHeight,x + endWireLength,halfHeight);
    // right end wire 
    line(x + rwidth-endWireLength, halfHeight,
       x+rwidth,halfHeight);
    vertex(x+endWireLength, halfHeight);
    for(let i = 0; i <= peaks -1; i++) {
      let xPos = x+endWireLength + i * peakWidth + peakWidth/2;
      let yPos = (i % 2 === 0) ? 
          halfHeight - peakHeight : 
          halfHeight + peakHeight;
      vertex(xPos, yPos);
    }
    vertex(x + rwidth-endWireLength , halfHeight);
    endShape();
  } 
  else if (orientation === 'vertical') {
    halfwidth = x+rwidth/2
    endWireLength = rheight * endWirePercent
    let peakHeight = rwidth / 3;
    let peakWidth = (rheight-2*endWireLength) / peaks;
    beginShape();
      // end wire
      vertex(halfwidth, y);
      vertex(halfwidth, y+endWireLength);
      for(let i = 0; i <= peaks - 1; i++) {
        let yPos = y+endWireLength + i * peakWidth + peakWidth/2;
        let xPos = (i % 2 === 0) ?
          halfwidth - peakHeight : 
          halfwidth + peakHeight;
        vertex(xPos, yPos);
      }
      // end wire
      vertex(halfwidth, y + rheight - endWireLength);
      vertex(halfwidth, y + rheight);
    endShape();
  }
}