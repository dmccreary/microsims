// MicroSim: Analog Clock with Manual and Automatic Modes
// This simulation displays an analog clock that can be set manually using sliders
// or automatically based on the current system time.
let canvasWidth = 400;
let drawHeight = 400;
let canvasHeight = 490;
let hourHand, minuteHand, secondHand;
let hourSlider, minuteSlider, secondSlider;
let manualMode = true;
let sliderLeftMargin = 105;

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');
  textSize(16);
  // Create sliders for manual mode
  hourSlider = createSlider(0, 11, 8);
  hourSlider.position(sliderLeftMargin, drawHeight + 10);
  hourSlider.style('width', canvasWidth - sliderLeftMargin - 20 + 'px')

  minuteSlider = createSlider(0, 59, 20);
  minuteSlider.position(sliderLeftMargin, drawHeight + 30);
  minuteSlider.style('width', canvasWidth - sliderLeftMargin - 20 + 'px')

  secondSlider = createSlider(0, 59, 10);
  secondSlider.position(sliderLeftMargin, drawHeight + 50);
  secondSlider.style('width', canvasWidth - sliderLeftMargin - 20 + 'px')

  let modeButton = createButton('Switch Mode');
  modeButton.position(10, drawHeight + 75);
  modeButton.mousePressed(switchMode);
}

function draw() {
  noStroke();
  fill('black');
  rect(0,0, canvasWidth, canvasHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, canvasHeight-drawHeight);
  
  push();
  translate(canvasWidth / 2, drawHeight / 2);
  noFill()
  stroke(255);
  strokeWeight(6);
  circle(0, 0, 340)
  let hr, mn, sc;
  if (manualMode) {
    hr = hourSlider.value();
    mn = minuteSlider.value();
    sc = secondSlider.value();
  } else {
    let currentTime = new Date();
    hr = currentTime.getHours() % 12;
    mn = currentTime.getMinutes();
    sc = currentTime.getSeconds();
  }

  // Draw hour hand
  stroke(255);
  strokeWeight(10);
  hourHand = map(hr, 0, 12, 0, TWO_PI) - HALF_PI;
  line(0, 0, cos(hourHand) * canvasWidth / 4, sin(hourHand) * canvasWidth / 4);

  // Draw minute hand
  strokeWeight(8);
  minuteHand = map(mn, 0, 60, 0, TWO_PI) - HALF_PI;
  line(0, 0, cos(minuteHand) * canvasWidth / 3, sin(minuteHand) * canvasWidth / 3);

  // Draw second hand
  stroke(255, 0, 0);
  strokeWeight(6);
  secondHand = map(sc, 0, 60, 0, TWO_PI) - HALF_PI;
  line(0, 0, cos(secondHand) * canvasWidth / 2.5, sin(secondHand) * canvasWidth / 2.5);
  pop();

  fill('black');
  strokeWeight(1);
  text("Hours:" + hr, 10, drawHeight + 20);
  text("Minutes:" + mn, 10, drawHeight + 40);
  text("Seconds:" + sc, 10, drawHeight + 60);
}

function switchMode() {
  manualMode = !manualMode;

  hourSlider.attribute('disabled', !manualMode);
  minuteSlider.attribute('disabled', !manualMode);
  secondSlider.attribute('disabled', !manualMode);
}