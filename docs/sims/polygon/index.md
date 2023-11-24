# Polygon

In this example, we will use a more detailed prompt to control the placement of the sliders and their values.

## Prompt

```linenums="0"
Generate a p5.js sketch file that draws filled polygons on a 400x400 canvas.

Create one range control slider that allows the number of points on
the polygon to vary from 3 to 10 in steps of 1.  Make the default be 10.

Create a second range control slider that allows the color inside the polygon
to be changed to any color.  Make the default value be 170 (blue).

Make the sliders be the width of the canvas less the width of the
labels and values.  Place the sliders at the bottom
of the canvas 100 points in from the left.

Use the text() function at the end of the draw() function to display the
name and current values of the sliders in the bottom left of the screen.
```

[Polygon Demonstration](./polygon.html)

## Response:

```js
// Ploygon with sliders for number of points and color
let canvasSize = 400;
let colorSlider;
let pointSlider;

function setup() {
  createCanvas(canvasSize, canvasSize);
  colorMode(HSB, 255);
  textSize(16);

  pointSlider = createSlider(3, 20, 3);
  pointSlider.position(140, canvasSize - 40);
  pointSlider.style('width', '180pt')

  colorSlider = createSlider(0, 255, 100);
  colorSlider.position(140, canvasSize - 20);
  colorSlider.style('width', '180pt')
}

function draw() {
    background(240);
    let colorValue = colorSlider.value();
    let pointValue = pointSlider.value();

    // Draw the polygon, HSB
    fill(colorValue, 255, 255);
    beginShape();
    for (let i = 0; i < pointValue; i++) {
        let angle = map(i, 0, pointValue, 0, TWO_PI);
        let x = canvasSize/2 + 150 * cos(angle);
        let y = canvasSize/2 + 150 * sin(angle);
        vertex(x, y);
    }
    endShape(CLOSE);

    // Draw the slider values
    fill('black');
    text("Number Points: " + pointValue, 5, canvasSize - 25);
    text("Color: " + colorValue, 5, canvasSize - 5);  
}
```
