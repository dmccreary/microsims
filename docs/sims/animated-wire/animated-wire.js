let canvasWidth = 500;
let canvasHeight = 500;

// the top region for drawing animations
let plotAreaWidth = canvasWidth;
let plotAreaHeight = 400;
let plotAreaMargin = 50;

// the lower region for placing controls like sliders
let controlAreaWidth = canvasWidth;
let controlHeight = 100;

let state = false;
let button;
let speedSlider;
// margin for the wire
let wireMargin = 50;
let lineWidth = 10;

function setup() {
    createCanvas(canvasWidth, canvasHeight);  // Set the canvas size
    frameRate(30);
    textSize(16);

    // Create the slider that controls the speed of the current dots
    speedSlider = createSlider(0.02, .5, .25, 0.03);
    speedSlider.position(120, plotAreaHeight+20);
    speedSlider.size(200);
  
    // Create the slider that controls the spacing of the current dots
    spacingSlider = createSlider(0.15, 1.5, 1, 0.05);
    spacingSlider.position(120, plotAreaHeight+50);
    spacingSlider.size(200);
    
  // Create the on/off button
    button = createButton('ON/OFF');
    button.position(350, plotAreaHeight+20);
    button.mousePressed(toggleState);
}

function draw() {
  // draw the background for the plot area in very light blue color
  noStroke();
  fill("aliceblue");  // DodgerBlue background
  rect(0,0,canvasWidth, plotAreaHeight)
  
  // Draw the background in a light tan color
  fill('cornsilk')
  stroke(1);
  strokeWeight(1);
  rect(0,plotAreaHeight,canvasWidth,controlHeight)

  // get any updates from the slider values
  let currentSeed = speedSlider.value();
  let currentSpacing = spacingSlider.value();
  
  // Draw the four wires in a square
  rightEdge = plotAreaWidth - wireMargin;
  bottomEdge = plotAreaHeight - wireMargin;
  
  // top wire
  drawAnimatedWire(wireMargin, wireMargin, rightEdge, wireMargin, currentSeed, currentSpacing, "black", state);
  
  // right wire
  drawAnimatedWire(rightEdge, wireMargin, rightEdge, bottomEdge, currentSeed, currentSpacing, "black", state);
  
  // lower wire
  drawAnimatedWire(rightEdge, bottomEdge, wireMargin, bottomEdge, currentSeed, currentSpacing, "black", state);
  
  // left wire from bottom to top
  drawAnimatedWire(wireMargin, bottomEdge, wireMargin, wireMargin, currentSeed, currentSpacing, "black", state);
  
  fill('black');
  noStroke();
  text('Speed:' + currentSeed, 10, plotAreaHeight+33);
  text('Spacing:' + currentSpacing, 10, plotAreaHeight + 66);
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

// Function to toggle state
function toggleState() {
    state = !state;
}
