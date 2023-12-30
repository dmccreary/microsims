let resistanceSlider, capacitanceSlider;
let ledState = false;
let lastTriggerTime = 0;
let waveform = [];
const canvasWidth = 400, canvasHeight = 450;

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');
  textSize(16);

  // Sliders
  resistanceSlider = createSlider(1, 100, 50);
  resistanceSlider.position(20, canvasHeight - 30);
  capacitanceSlider = createSlider(1, 100, 50);
  capacitanceSlider.position(220, canvasHeight - 30);
}

function draw() {
  background(255);

  // Draw the waveform
  drawWaveform();

  // Update and draw LED
  updateLED();
  drawLED();

  // Draw slider labels and values
  drawLabelsAndValues();
}

function drawWaveform() {
  stroke(0);
  noFill();
  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], 0, 1, 150, 100);
    vertex(x, y);
  }
  endShape();

  if (frameCount % 2 === 0) {
    waveform.push(ledState ? 1 : 0);
    if (waveform.length > width) {
      waveform.splice(0, 1);
    }
  }
}

function updateLED() {
  let currentTime = millis();
  let thresholdTime = lastTriggerTime + (resistanceSlider.value() * capacitanceSlider.value());
  if (currentTime > thresholdTime) {
    ledState = !ledState;
    lastTriggerTime = currentTime;
  }
}

function drawLED() {
  fill(ledState ? color(255, 0, 0) : color(128));
  ellipse(200, 50, 30, 30);
}

function drawLabelsAndValues() {
  fill(0);
  text("Resistance: " + resistanceSlider.value() + " Ω", 20, canvasHeight - 40);
  text("Capacitance: " + capacitanceSlider.value() + " µF", 220, canvasHeight - 40);
}

// Add this function to handle window resizing
function windowResized() {
  resizeCanvas(canvasWidth, canvasHeight);
}
