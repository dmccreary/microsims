let canvasSize = 400;
let hourHand, minuteHand, secondHand;
let hourSlider, minuteSlider, secondSlider;
let manualMode = true;

function setup() {
  const canvas = createCanvas(400, 400);
  canvas.parent('canvas-container');
  // createCanvas(canvasSize, canvasSize);
  // black background
  background(0);

  // Create sliders for manual mode
  hourSlider = createSlider(0, 11, 8);
  hourSlider.position(10, canvasSize + 10);

  minuteSlider = createSlider(0, 59, 20);
  minuteSlider.position(10, canvasSize + 40);

  secondSlider = createSlider(0, 59, 10);
  secondSlider.position(10, canvasSize + 70);

  let modeButton = createButton('Switch Mode');
  modeButton.position(10, canvasSize + 100);
  modeButton.mousePressed(switchMode);
}

function draw() {
  background(0);
  
  translate(canvasSize / 2, canvasSize / 2);
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
  line(0, 0, cos(hourHand) * canvasSize / 4, sin(hourHand) * canvasSize / 4);

  // Draw minute hand
  strokeWeight(8);
  minuteHand = map(mn, 0, 60, 0, TWO_PI) - HALF_PI;
  line(0, 0, cos(minuteHand) * canvasSize / 3, sin(minuteHand) * canvasSize / 3);

  // Draw second hand
  stroke(255, 0, 0);
  strokeWeight(8);
  secondHand = map(sc, 0, 60, 0, TWO_PI) - HALF_PI;
  line(0, 0, cos(secondHand) * canvasSize / 2.5, sin(secondHand) * canvasSize / 2.5);
}

function switchMode() {
  manualMode = !manualMode;

  hourSlider.attribute('disabled', !manualMode);
  minuteSlider.attribute('disabled', !manualMode);
  secondSlider.attribute('disabled', !manualMode);
}