// Create a p5.js animation of Lissajous figures.
// Make one slider control the x-axis and one slider control the y-axis.
let sliderXFreq, sliderYFreq;
let xFreq = 3;
let yFreq = 2;
let phase = 0;
let phaseSpeed = 0.02;

function setup() {
  createCanvas(600, 600);
  background(255);
  
  // Create sliders
  createP('X-axis Frequency (a):');
  sliderXFreq = createSlider(1, 10, xFreq, .5);
  sliderXFreq.style('width', '580px');
  
  createP('Y-axis Frequency (b):');
  sliderYFreq = createSlider(1, 10, yFreq, .5);
  sliderYFreq.style('width', '580px');
  
  // Set drawing parameters
  strokeWeight(2);
  noFill();
}

function draw() {
  background('aliceblue');
  
  // Update frequencies from sliders
  xFreq = sliderXFreq.value();
  yFreq = sliderYFreq.value();
  
  // Parameters for Lissajous
  let A = width / 3;
  let B = height / 3;
  let delta = phase;
  
  translate(width / 2, height / 2);
  
  stroke(0, 100, 200);
  
  beginShape();
  for (let t = 0; t < TWO_PI * 2; t += 0.01) {
    let x = A * sin(xFreq * t + delta);
    let y = B * sin(yFreq * t);
    vertex(x, y);
  }
  endShape();
  
  // Increment phase for animation
  phase += phaseSpeed;
}
