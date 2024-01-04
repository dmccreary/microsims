# MicroSim Template

<figure markdown>
   ![Image Name](./image.png){ width="400" }
   <figcaption>Figure caption.</figcaption>
</figure>

[Link to Breadboard Demo](./breadboard.html){ .md-button .md-button--primary }
[Link to Push Button Demo](./push-buttons.html){ .md-button .md-button--primary }
[Link to Resistors Demo](./resistors-demo.html){ .md-button .md-button--primary }

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

