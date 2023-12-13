// battery drain
// Animate a motor that drains a battery faster the more power is used
let canvasWidth = 400;
let drawHeight = 400;
let canvasHeight = 430;
let motorSpeedSlider;
let motorSpeed;
let batteryLevel = 100;
let dischargeRate;
let sliderLeftMargin = 100;

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  // remove for use in the editor
  canvas.parent('canvas-container');
  textSize(16);
  
  motorSpeedSlider = createSlider(0, 100, 50);
  motorSpeedSlider.position(sliderLeftMargin, drawHeight + 10);
  motorSpeedSlider.style('width', canvasWidth - sliderLeftMargin - 20 + 'px')
  
  frameRate(60);
}

function draw() {
  fill(245);
  rect(0,0,canvasWidth,drawHeight);
  fill('white');
  rect(0,drawHeight,canvasWidth,canvasHeight-drawHeight);

  motorSpeed = motorSpeedSlider.value();
  // Battery representation
  drawBattery();

  // Wires from battery to motor
  stroke(0);
  // top wire
  line(50, 50, 350, 50);
  // bottom wire
  line(50, 350, 350, 350);
  line(350, 50, 350, 350);

  // Motor and spinning circle
  drawMotor();

  // Update battery discharge
  updateBattery();
  noStroke();
  fill('black');
  text("Speed:"+motorSpeed, 10, drawHeight+25);
}

function drawBattery() {
  // Battery body
  
  percentGold = .4
  // Positive terminal
  fill('gold'); // Gold color
  rect(20, 50, 50, 300*percentGold);

  // Negative terminal
  fill('black');
  rect(20, 350*percentGold, 50, 350*(1-percentGold));

  // Battery level
  let levelHeight = map(batteryLevel, 0, 100, 0, 300);
  fill(0, 255, 0);
  rect(30, 350 - levelHeight, 30, levelHeight);
}

function drawMotor() {
    fill(150);
    ellipse(350, 200, 100, 100); // Motor body
  
    if (batteryLevel > 1) {
     push();
        translate(350, 200);
        rotate(frameCount / 50 * motorSpeed);
        fill(0, 0, 255);
        ellipse(0, 40, 20, 20); // Spinning circle
     pop();
    }
  }

function updateBattery() {
  dischargeRate = motorSpeedSlider.value() / 1000;
  batteryLevel -= dischargeRate;
  batteryLevel = max(batteryLevel, 0);
}

