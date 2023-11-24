let switchOn = false; // Initial state of the switch
let switchAngle = 45; // Angle of the switch when off

function setup() {
  const canvas = createCanvas(300, 200);
  canvas.parent('canvas-container');
  textSize(16);
}

function draw() {
  background(220);

  // Draw title
  fill(0);
  strokeWeight(0);
  text("Click Anywhere to Toggle The Switch", 10, 20);

  // Draw the battery
  drawBattery();

  // Draw the switch
  drawSwitch();

  // Draw the light bulb
  drawLightBulb();

  // Draw wires
  drawWires();
}

function drawBattery() {
  fill('grey');
  rect(20, 100, 20, 50); // battery body
  rect(20, 95, 20, 5); // positive terminal
  rect(20, 150, 20, 5); // negative terminal
}

function drawSwitch() {
  push();
    translate(80, 50); // Move origin to switch pivot
    rotate(radians(switchOn ? 0 : switchAngle)); // Rotate when off
    fill('black');
    rect(0, 0, 50, 10); // switch
  pop();
}

function drawLightBulb() {
  if (switchOn) {
    fill('yellow');
  } else {
    fill('white');
  }
  ellipse(250, 50, 30, 30); // light bulb
}

function drawWires() {
  stroke(switchOn ? 'red' : 'black');
  strokeWeight(3);

  // Wire from battery top to switch
  line(40, 100, 40, 50);
  line(40, 50, 80, 50);

  // Wire from switch to light bulb
  line(130, 50, 250, 50);

  // Wire from light bulb to battery bottom
  line(250, 50, 250, 150);
  line(250, 150, 40, 150);
}

function mousePressed() {
  switchOn = !switchOn; // Toggle the switch
  switchAngle = switchOn ? 0 : 45; // Adjust switch angle
}
