// Sine Wave Oscillator With Sound
// contributed by Shawn McBurnie

let canvasWidth = 800;
let drawHeight = 160;
let controlHeight = 40;
let canvasHeight = drawHeight + controlHeight;
let sliderLeftMargin = 130;

let amplitude = 70;
let stringLength;
let omega = 0.055; // 1/1000 of the vibration rate of the tone
let multiplierSlider;
let osc; // Sine wave oscillator
let soundCheckbox;
let soundEnabled = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');
  textSize(16);

  // Create a slider for the multiplier
  multiplierSlider = createSlider(1, 16, 1, .1);

  // Create checkbox for enabling sound
  soundCheckbox = createCheckbox('Enable Sound', false);
  soundCheckbox.changed(toggleSound);

  // Initialize the sine wave oscillator
  osc = new p5.Oscillator('sine');
  osc.amp(0.3); // Set amplitude (volume) of the sound

  updateControlPositions();
}

function updateCanvasSize() {
  const container = document.getElementById('canvas-container');
  if (container) {
    canvasWidth = container.offsetWidth;
  }
  stringLength = canvasWidth - 40; // Leave some space at both ends for anchoring
}

function updateControlPositions() {
  // Position slider
  multiplierSlider.position(sliderLeftMargin, drawHeight + 12);
  multiplierSlider.style('width', (canvasWidth - sliderLeftMargin - 150) + 'px');

  // Position checkbox
  soundCheckbox.position(canvasWidth - 130, drawHeight + 8);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  updateControlPositions();
}

function toggleSound() {
  soundEnabled = soundCheckbox.checked();
  if (soundEnabled) {
    osc.start();
  } else {
    osc.stop();
  }
}

function draw() {
  // Draw area background
  noStroke();
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  let multiplier = multiplierSlider.value(); // Get the value from the slider
  if (soundEnabled) {
    osc.freq(55 * multiplier); // Set the oscillator frequency
  }

  stroke(0);
  strokeWeight(2);
  noFill();

  // Anchor points
  fill(0);
  ellipse(20, drawHeight / 2, 8, 8); // Left anchor
  ellipse(canvasWidth - 20, drawHeight / 2, 8, 8); // Right anchor

  // Label for the slider
  noStroke();
  text('Frequency: ' + multiplier, 10, drawHeight + 26);

  // Vibrating string
  stroke(0);
  noFill();
  beginShape();
  vertex(20, drawHeight / 2); // Start at the left anchor

  for (let x = 0; x <= stringLength; x++) {
    let localAmplitude = amplitude * sin(multiplier * PI * x / stringLength);
    let timeComponent = cos(multiplier * omega * frameCount); // Oscillation speed

    let y = drawHeight / 2 + localAmplitude * timeComponent;
    vertex(x + 20, y); // Offset by 20 to account for the left anchor
  }

  vertex(canvasWidth - 20, drawHeight / 2); // End at the right anchor
  endShape();
}
