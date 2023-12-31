# 555 Timer

<figure markdown>
   ![](./555-timer.png){ width="400" }
   <figcaption>555 Timer MicroSim</figcaption>
</figure>

[Run the 555 Timer MicroSim](./555-timer.html){ .md-button .md-button--primary }

[Edit the 555 Timer MicroSim](https://editor.p5js.org/dmccreary/sketches/mccfRwlmJ)

The 555 timer IC is an integrated circuit used in a variety of timer, delay, pulse generation, and oscillator applications. It is one of the most popular timing ICs due to its flexibility and price.

## Prompt

```linenums="0"
Create a single file p5.js simulation of a 555 timer in monostable mode.
Add sliders for resistance and capacitance.
Make the canvas be 400x250.
Make the text size be 16.
Draw a waveform and an LED that flashes.
Place the sliders at the bottom of the canvas in the bottom 50 pixels.
Add labels and values to the left of the sliders.  
```

## Response

```
This code will create an interactive simulation where you can adjust the resistance and capacitance values using sliders and see the effect on the LED flash rate and the waveform displayed. The LED and waveform visually represent the timer's operation in monostable mode.
```

```js
let resistanceSlider, capacitanceSlider;
let ledState = false;
let lastTriggerTime = 0;
let waveform = [];
const canvasWidth = 400, canvasHeight = 450;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  textSize(12);

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
```

## References

* [555 timer IC on Wikipedia](https://en.wikipedia.org/wiki/555_timer_IC)
* [Digikey 555-timer Calculator](https://www.digikey.com/en/resources/conversion-calculators/conversion-calculator-555-timer)