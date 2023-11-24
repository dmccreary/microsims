# Sine Wave


In this demo, we use three range control sliders to change the:

1. amplitude
2. period
3. and phase

of a sine wave.

[Sine Wave Demo](./sine.html)

### Prompt

Draw a sine wave with 3 sliders: Amplititude, Period and Phase
Draw X and Y Axis
Label Axis
Make (0,0) be in the center and positive y is at the top

### Result

```js
// sine wave with 3 sliders
let width = 600;
let height = 400;
let halfWidth = width / 2
let halfHeight = height / 2
let amplitude = 100;
let phase = 0;

let amplitudeSlider, periodSlider, phaseSlider;
let labelValueMargin = 120;

function setup() {
  createCanvas(width, height);
  textSize(16)
  
  // Create sliders
  amplitudeSlider = createSlider(0, 200, 100);
  amplitudeSlider.position(labelValueMargin, height - 20);
  amplitudeSlider.style('width', width - labelValueMargin + 'px')
  
  periodSlider = createSlider(1, 100, 50);
  periodSlider.position(labelValueMargin, height - 40);
  periodSlider.style('width', width - labelValueMargin + 'px')
  
  phaseSlider = createSlider(-PI*100, PI*100, 0, 0.01);
  phaseSlider.position(labelValueMargin, height - 60);
  phaseSlider.style('width', width - labelValueMargin + 'px')
}

function draw() {
  background(240);
  
  amplitude = amplitudeSlider.value();
  period = periodSlider.value();
  phase = phaseSlider.value();
  
  // draw on the standard axis to keep text upright
  drawAxis();
  translate(width / 2, height / 2); // Shift origin to center
  scale(1, -1); // Flip y-axis to make positive y up
  
  drawSineWave(amplitude, 1/period, phase);
}

function setLineDash(list) {
  drawingContext.setLineDash(list);
}

function drawAxis() {
  fill('black')
  strokeWeight(0)
  text('y', halfWidth-20, 15)
  text('x', width-20, halfHeight + 20)
  stroke('gray')
  strokeWeight(1)
  setLineDash([5, 5])
  
  // horizontal line
  line(0, halfHeight, width, halfHeight)
  // vertical line
  line(halfWidth, 0, halfWidth, height)
  
  stroke(0)
  strokeWeight(0);
  fill('black'); // Text color
  text('Amplitude: ' + amplitude/100,    10, height - 5);
  text('Period: '    + period,           10, height - 25);
  text('Phase: '     + phase.toFixed(2), 10, height - 45);
}

function drawSineWave(amplitude, frequency, phase) {
  stroke('blue');
  strokeWeight(3)
  noFill();
  // turn off dash line
  setLineDash([1, 0])
  beginShape();
    for (let x = -width / 2; x < width / 2; x++) {
      let y = amplitude * sin(frequency * (x - phase));
      vertex(x, y);
    }
  endShape();
}
```

!!! Challenge
    Create your own trigonometry demos by drawing
    the cosine and tangent functions.