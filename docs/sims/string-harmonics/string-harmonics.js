// Sine Wave Oscillator With Sound
// contributed by Shawn McBurnie

let width = 800
let height = 200

let amplitude = 80;
let stringLength;
let omega = 0.055; // 1/1000 of the vibration rate of the tone
let multiplierSlider;
let osc; // Sine wave oscillator

function setup() {
  const canvas = createCanvas(width, height);
  canvas.parent('canvas-container');
  textSize(16);
  stringLength = width - 40; // Leave some space at both ends for anchoring

  // Create a slider for the multiplier
  multiplierSlider = createSlider(1, 16, 1, .1);
  multiplierSlider.position(130, height - 20);
  multiplierSlider.style('width', width - 140 + 'px')

  // Initialize the sine wave oscillator
  //osc = new p5.Oscillator('sine');
  //osc.amp(0.3); // Set amplitude (volume) of the sound
  //osc.start(); // Start the oscillator
}

function draw() {
  background(245);

  let multiplier = multiplierSlider.value(); // Get the value from the slider
  // osc.freq(55 * multiplier); // Set the oscillator frequency
  stroke(1);
  strokeWeight(2);
  noFill();

  // Label for the slider
  fill(0);
  noStroke();
  text('Frequency: ' + multiplier, 10, height - 15);
  stroke(1);
  // Anchor points
  ellipse(20, height / 2-10, 8, 8); // Left anchor
  ellipse(width - 20, height / 2-10, 8, 8); // Right anchor

  // Vibrating string
  noFill();
  beginShape();
     vertex(20, height / 2 - 10); // Start at the left anchor

  for (let x = 0; x <= stringLength; x++) {
    let localAmplitude = amplitude * sin(multiplier * PI * x / stringLength);
    let timeComponent = cos(multiplier * omega * frameCount); // Oscillation speed

    let y = height / 2 + localAmplitude * timeComponent;
    vertex(x + 20, y-10); // Offset by 20 to account for the left anchor
  }

  vertex(width - 20, height / 2 - 10); // End at the right anchor
  endShape();
}