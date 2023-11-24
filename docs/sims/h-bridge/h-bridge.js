let state = "STOP";
let lineWidth = 2;
let animationSpeed = .3

function setup() {
    const canvas = createCanvas(400, 400);
    canvas.parent('canvas-container');
    rectMode(CENTER);
    
    buttonFwd = createButton('Forward');
    buttonFwd.position(10, 50);
    buttonFwd.mousePressed(() => { state = "FORWARD"; });

    buttonStop = createButton('Stop');
    buttonStop.position(10, 100);
    buttonStop.mousePressed(() => { state = "STOP"; });

    buttonRev = createButton('Reverse');
    buttonRev.position(10, 150);
    buttonRev.mousePressed(() => { state = "REVERSE"; });
}

function draw() {
    background(240);

    // draw power rails
    drawPowerRails();

    // draw H-bridge
    drawHbridge();
    
    // draw motor
    drawMotor();
    
    // draw knife switches
    drawSwitches();
}

function hline(x,y,w) {
  strokeWeight(lineWidth);
  line(x, y, x+w, y);
}

function vline(x,y,w) {
  strokeWeight(lineWidth);
  line(x, y, x, y+w);
}

function drawPowerRails() {
    stroke(0);
    strokeWeight(lineWidth);
    hline(0, 20, width); // positive rail
    hline(0, height-20, width); // negative rail
}

function drawHbridge() {
    // upper left wire
    drawAnimatedWire(100, 20, 100, 75, animationSpeed, state == "FORWARD");
    drawAnimatedWire(100, 125, 100, 200, animationSpeed, state == "FORWARD");
    drawAnimatedWire(100, 200, 180, 200, animationSpeed, state == "FORWARD");
    
    // upper right wire
    drawAnimatedWire(300, 20, 300, 75, animationSpeed, state == "REVERSE");
    drawAnimatedWire(300, 125, 300, 200, animationSpeed, state == "REVERSE");
    drawAnimatedWire(300, 200, 200, 200, animationSpeed, state == "REVERSE");
    
    // lower left wire

    // center to left
    drawAnimatedWire(200, 200, 100, 200, animationSpeed, state == "REVERSE");
    drawAnimatedWire(100, 200, 100, 275, animationSpeed, state == "REVERSE");
    drawAnimatedWire(100, 325, 100, 380, animationSpeed, state == "REVERSE");
    
    // lower right wire
    
    drawAnimatedWire(220, 200, 300, 200, animationSpeed, state == "FORWARD");
    drawAnimatedWire(300, 200, 300, 275, animationSpeed, state == "FORWARD");
    drawAnimatedWire(300, 325, 300, 380, animationSpeed, state == "FORWARD");
}

function drawMotor() {
    push();
    translate(200, 200);
    fill(150)
    circle(0,0,90)
    rotate(state == "FORWARD" ? frameCount * 0.03 : 
           state == "REVERSE" ? -frameCount * 0.03 : 0);
    fill(0,0,255)
    stroke(0)
    rect(0, 0, 60, 60);
    pop();
}

function drawSwitches() {
    // upper left switch
    drawSwitchVert(100, 75, 50, state == "FORWARD" ? 1 : 0);
    
    // upper right switch
    drawSwitchVert(300, 75, 50, state == "REVERSE" ? 1 : 0);
    
    // lower left switch
    drawSwitchVert(100, 275, 50, state == "REVERSE" ? 1 : 0);
    
    // lower right switch
    drawSwitchVert(300, 275, 50, state == "FORWARD" ? 1 : 0);
}

function drawSwitchVert(x, y, w, isClosed) {
  stroke(0);
  circle(x, y, 4)
  circle(x, y+w, 4)
  
  strokeWeight(2);
  if(isClosed) {
    line(x, y, x, y + w);
    fill(0);
    strokeWeight(0);
    text('on',x+7,y+29);
  } else { 
    line(x, y, x + w*.8, y + w * .6);
    fill(0);
    strokeWeight(0);
    text('off',x,y+29);
  }
}

function drawAnimatedWire(x1, y1, x2, y2, speed1, state) {
    if (state) {
        let distance = dist(x1, y1, x2, y2);
        let circlePos = map((millis() * speed1) % distance, 0, distance, 0, 1);

        // lerp generates the percent between two values
        let x = lerp(x1, x2, circlePos);
        let y = lerp(y1, y2, circlePos);

        stroke(0);
        strokeWeight(lineWidth);
        line(x1, y1, x2, y2); // Draw the wire

        fill(255, 0, 0);
        noStroke();
        circle(x, y, 10); // Draw the moving circle (electron)
    } else {
        stroke(0);
        strokeWeight(lineWidth);
        line(x1, y1, x2, y2); // Draw the wire
    }
}
