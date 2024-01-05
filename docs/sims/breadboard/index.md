# MicroSim Template

<figure markdown>
   ![Image Name](./image.png){ width="400" }
   <figcaption>Figure caption.</figcaption>
</figure>

[Link to Breadboard Demo](./breadboard.html){ .md-button .md-button--primary }
[Link to Push Button Demo](./push-buttons.html){ .md-button .md-button--primary }
[Link to Resistors Demo](./resistors-demo.html){ .md-button .md-button--primary }
[Link to Vector Breadboard](./breadboard-vector.html){ .md-button .md-button--primary }
[Edit the Breadboard MicroSim](https://editor.p5js.org/dmccreary/sketches/6BlWx729A)

## About this MicroSim

This MicroSim teaches us how to simulate an LED
circuit with a button on a breadboard.

## Image Background

Here is how we draw a breadboard in the background

```js
canvasWidth = 400;
drawHeight = 275;
canvasHeight = 320;

function preload() {
    breadboard_img = loadImage('./breadboard-horiz-small.png');
}

function setup() {
    const canvas = createCanvas(canvasWidth, canvasHeight);
}

function draw() {
    // make the background drawing region light gray
    fill(245);
    rect(0,0,canvasWidth, canvasWidth);
    // make the background of the controls white
    fill('white')
    rect(0,drawHeight,canvasWidth, canvasHeight-drawHeight);

    // Place the image at 00
    image(breadboard_img, 0, 0);
}

// button press momentary 
function setup() {
  createCanvas(200, 200);
}

function draw() {
  background(245);
  
  // Button style - use a rect with rounded corners
  fill(0, 0, 255);
  rect(80, 80, 40, 40, 5);

  // Draw the circle red if we have a press in our circle
  if (dist(mouseX, mouseY, 100, 100) < 20 && mouseIsPressed)
    fill(255, 0, 0);
  else
    fill(200, 200, 200);
  
  // Draw the circle
  circle(100, 100, 38);
  
}
```

## Button Press



## Sample Prompt

```linenums="0"
Create a single file p5.js sketch.
Draw a green circle on a 600x400 canvas with a radius of 200.
```

## Sample Response

```javascript
let canvasHeight = 400;
let aspectRatio = 1.91; // Open Graph standard
let canvasWidth = canvasHeight * aspectRatio;
let radius = 200;
function setup() {
const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');
  fill(245);
  rect(0,0, canvasWidth, canvasHeight);
  fill('green');
  circle(canvasWidth/2, canvasHeight/2, radius);
}
```

## Lesson Plan

### Grade Level, Subject and Topic

9th grade geometry. Circle and radius.

### Activities

#### Fill Color

Change the color in the prompt.  You
can specify any one of the [140 named colors](https://www.w3schools.com/tags/ref_colornames.asp).

#### Border Weight

Change the prompt to include a black border of
width 10.

#### Border Color

Change the prompt to make the border purple.

#### Change the Radius

Change the prompt to make the circle smaller
or larger by changing the radius from 10 to 200.

#### Change the Location

Change the prompt to move the circle to the left or right.

## Prompt for 400-Tie Breadboard Layout

```linenums="0"
Create a p5.js drawing like the image attached.
Create a single file p5.js layout on a 400X275 canvas.
Create a layout of a 400-tie solderless mini breadboard.
The breadboard has a landscape orientation.
Each tie should be represented by a 4x4 black rectangle.
The breadboard should have two power rails at the top and bottom of the breadboard.
Each power rail has both a positive and negative horizontal row of ties.
The power rail rows have 5 groupings of 5 ties with a small space between the groups.
The positive power rail is red and the negative power rail is black.
The power rails run horizontally.
The center region has 30 columns of five vertical ties in columns at the top an bottom.
The 30 columns are evenly spaced in the 400 pixel width.
A central trough runs horizontally down the center of the breadboard.
```

## References

* [WokWi Online Simulator of the Pico](https://wokwi.com/pi-pico)