let robotPos; // a vector of x and y values
let robotVel; // velocity vector of x and y values
// The angle that the robot is moving
// orient to the right
let robotAngle = 90;
let sensorLength = 40;
let circleRadius = 200;
let robotSize = 20; // dist to edge for turn
let moving = false;
let isTurning = false;
let isBacking = false;
let remainingTurnAngle = 0;
let remainingBackup = 20;
let delay = 100; // 1/10 second delay when animating a turn

function setup() {
  const canvas = createCanvas(400, 400);
  canvas.parent('canvas-container');
  
  // place the robot in the center of the corral
  robotPos = createVector(width / 2, height / 2);
  robotVel = createVector(.01, 0);

  let startButton = createButton('Start');
  startButton.mousePressed(() => moving = true);

  let stopButton = createButton('Stop');
  stopButton.mousePressed(stopRobot);

  let resumeButton = createButton('Resume');
  resumeButton.mousePressed(() => moving = true);
  
  let resetButton = createButton('Reset');
  resetButton.mousePressed(resetRobot);
  
  frameRate(60);
}

function draw() {
  background(220);
  circle(width / 2, height / 2, circleRadius * 2);

  if (moving) {
    moveRobot();
    checkCollision();
  }

  // Handle gradual backing up
  if (isBacking) {
    let backStep = 1; // adjust the divisor for smoothness
    robotPos.sub(p5.Vector.mult(robotVel, 1.2));  //backup
    remainingBackup -= backStep;
    // console.log("backing backStep:"+backStep+" remainingBackup"+remainingBackup)

    if (remainingBackup < 0) { // if the remaining dist is small, stop backing
      isBacking = false;
      moving = true;
    }
  }
  
  // Handle gradual turning
  if (!(isBacking) & isTurning) {
    let turnStep = remainingTurnAngle / 20; // adjust the divisor for smoothness
    robotAngle += turnStep;
    remainingTurnAngle -= turnStep;
    //console.log("backing turnstep:"+turnStep+" remainingTurnAngle"+remainingTurnAngle)
    if (abs(remainingTurnAngle) < 0.1) { // if the remaining angle is small, stop turning
      isTurning = false;
      moving = true;
    }
  }
  
  drawRobot();
  
}

function Robot() {
  robotPos.add(robotVel);
  robotVel = p5.Vector.fromAngle(radians(robotAngle)).mult(2);
}


function moveRobot() {
  robotPos.add(robotVel);
  // 
  robotVel = p5.Vector.fromAngle(radians(robotAngle-90)).mult(1.2);
}

function checkCollision() {
  // distance of the center of the robot to the circle
  let d = dist(robotPos.x, robotPos.y, width / 2, height / 2);
  if (d + robotSize > circleRadius - sensorLength) {
    
    // Set up the backing 
    isBacking = true; // back up by 20 units
    remainingBackup = 20;
    
    // Set up the turn
    let totalTurnAngle = (random([-120, 120]) + random(-10, 10));
    remainingTurnAngle = totalTurnAngle;
    isTurning = true;
    
    // turn randomly 90 degrees 
    moving = false; // stop to avoid spinning
    // printRobotState()
  }
}

function drawRobot() {
  push();
    translate(robotPos.x, robotPos.y);
    rotate(radians(robotAngle));
    fill(0, 255, 0);
    // triangle(-robotSize, robotSize, robotSize, robotSize, 0, -robotSize);
    rect(-robotSize,-robotSize, robotSize*2, robotSize*2)
    stroke(255, 0, 0);
    line(0, -robotSize, 0, -sensorLength-15);
  pop();
}

function stopRobot() {
  moving = false;
  printRobotState();
}

function resetRobot() {
  stopRobot();
  robotPos = createVector(width / 2, height / 2);
  robotVel = createVector(1.2, 0);
  robotAngle = 90;
}

function printRobotState() {
  console.log("Pos(" + round(robotPos.x) + "," + round(robotPos.y) + ")"+ 
              "Ang:" + round(robotAngle), 
              "Vel(" + round(robotVel.x) + ","+ round(robotVel.y) + ')',
             "Mov:" + moving);
}
