# Analog Clock Face

## Prompt

```
Create a single p5.js sketch file that uses a 400x400 canvas.
The file is a simulation of an analog clock face.
The clock face has a black background.
The clock has white hands for the minute and hour hand.
The clock as a red second hand.
There are two modes: manual and automtic
Manual mode allows the use to manually set the time using three sliders for hours, minute and seconds.
Automatic mode use the local time to update the display.
Add labels and values for the sliders.
Make sure to reenable the controls as we switch back to manual mode.
```

[Link to Demo](./analog-clock-face.html)

## Code

This is a wonderful lab to demonstrate some use of the trigonomic functions sine() and cosine().  We ask the question:

*Write some Python code that will take in the seconds as a number
from 0 to 59 and it will return the x and y positions
of the tip of the second hand.*

```js
// Draw second hand
// convert seconds to radians
secondHand = map(sc, 0, 60, 0, TWO_PI) - HALF_PI;
// draw a line from the center of the canvas to the endpoint
line(0, 0, cos(secondHand) * canvasSize / 2.5, 
           sin(secondHand) * canvasSize / 2.5);
```

## FUll Program Source

```py
let canvasSize = 400;
let hourHand, minuteHand, secondHand;
let hourSlider, minuteSlider, secondSlider;
let manualMode = true;

function setup() {
  const canvas = createCanvas(400, 400);
  // use this line in the web
  canvas.parent('canvas-container');
  // use this in editor
  // createCanvas(canvasSize, canvasSize);
  background(0);

  // Create sliders for manual mode
  hourSlider = createSlider(0, 11, 0);
  hourSlider.position(10, canvasSize + 10);

  minuteSlider = createSlider(0, 59, 0);
  minuteSlider.position(10, canvasSize + 40);

  secondSlider = createSlider(0, 59, 0);
  secondSlider.position(10, canvasSize + 70);

  let modeButton = createButton('Switch Mode');
  modeButton.position(10, canvasSize + 100);
  modeButton.mousePressed(switchMode);
}

function draw() {
  background(0);
  translate(canvasSize / 2, canvasSize / 2);

  let hr, mn, sc;
  if (manualMode) {
    hr = hourSlider.value();
    mn = minuteSlider.value();
    sc = secondSlider.value();
  } else {
    let now = new Date();
    hr = now.getHours() % 12;
    mn = now.getMinutes();
    sc = now.getSeconds();
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
  strokeWeight(4);
  secondHand = map(sc, 0, 60, 0, TWO_PI) - HALF_PI;
  line(0, 0, cos(secondHand) * canvasSize / 2.5, sin(secondHand) * canvasSize / 2.5);
}

function switchMode() {
  manualMode = !manualMode;
  
  // disable the controls
  if manualMode {
    hourSlider.attribute('disabled', !manualMode);
    minuteSlider.attribute('disabled', !manualMode);
    secondSlider.attribute('disabled', !manualMode);
  } else {
    hourSlider.attribute('enabled', !manualMode);
    minuteSlider.attribute('enabled', !manualMode);
    secondSlider.attribute('enabled', !manualMode);
  }

}

```