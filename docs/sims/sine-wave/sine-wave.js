// p5.js code to generate a sine wave with amplitude, frequency and period controls
// Width-responsive version

let canvasWidth = 600;
let drawHeight = 400;
let controlHeight = 75;
let canvasHeight = drawHeight + controlHeight;
let halfWidth, halfHeight;
let amplitude = 100;
let phase = 0;

let amplitudeSlider, periodSlider, phaseSlider;
let sliderLeftMargin = 120;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  textFont('Arial');
  textSize(16);

  // Create sliders
  amplitudeSlider = createSlider(0, 200, 100);
  amplitudeSlider.position(sliderLeftMargin, drawHeight + 10);
  amplitudeSlider.size(canvasWidth - sliderLeftMargin - 15);

  periodSlider = createSlider(1, 100, 50);
  periodSlider.position(sliderLeftMargin, drawHeight + 30);
  periodSlider.size(canvasWidth - sliderLeftMargin - 15);

  phaseSlider = createSlider(-PI*100, PI*100, 0, 0.01);
  phaseSlider.position(sliderLeftMargin, drawHeight + 50);
  phaseSlider.size(canvasWidth - sliderLeftMargin - 15);
}

function updateCanvasSize() {
  const mainElement = document.querySelector('main');
  if (mainElement) {
    canvasWidth = mainElement.offsetWidth;
  }
  halfWidth = canvasWidth / 2;
  halfHeight = drawHeight / 2;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);

  // Resize sliders
  amplitudeSlider.size(canvasWidth - sliderLeftMargin - 15);
  periodSlider.size(canvasWidth - sliderLeftMargin - 15);
  phaseSlider.size(canvasWidth - sliderLeftMargin - 15);
}

function draw() {
  stroke(0);
  // make the background drawing region light blue
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  // make the background of the controls white
  fill('white')
  rect(0, drawHeight, canvasWidth, controlHeight);

  amplitude = amplitudeSlider.value();
  period = periodSlider.value();
  phase = phaseSlider.value();

  // draw slider labels
  strokeWeight(0);
  fill('black');
  text('Amplitude: ' + amplitude/100,    10, drawHeight + 25);
  text('Period: '    + period,           10, drawHeight + 45);
  text('Phase: '     + phase.toFixed(2), 10, drawHeight + 65);

  // draw on the standard axis to keep text upright
  drawAxis();
  translate(canvasWidth / 2, drawHeight / 2);

  scale(1, -1); // Flip y-axis to make positive y up
  drawSineWave(amplitude, 1/period, phase);
}

function setLineDash(list) {
  drawingContext.setLineDash(list);
}

function drawAxis() {
  fill('black')
  strokeWeight(0)
  text('y', halfWidth - 20, 15)
  text('x', canvasWidth - 20, halfHeight + 20)
  stroke('gray')
  strokeWeight(1)
  setLineDash([5, 5])

  // horizontal line
  line(0, halfHeight, canvasWidth, halfHeight)
  // vertical line
  line(halfWidth, 0, halfWidth, drawHeight)
}

function drawSineWave(amplitude, frequency, phase) {
  stroke('blue');
  strokeWeight(3)
  noFill();
  // turn off dash line
  setLineDash([1, 0])
  beginShape();
    for (let x = -canvasWidth / 2; x < canvasWidth / 2; x++) {
      let y = amplitude * sin(frequency * (x - phase));
      vertex(x, y);
    }
  endShape();
}
