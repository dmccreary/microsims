# Circle Slider

Here is a simple example that you can start with.  The ChatGPT prompt would be the following:

```linenums="0"
Generate a single p5.js sketch file that draws a blue circle
in the center of a 400x400 canvas.

Create a range control slider that allows the radius to be
adjusted from 0 to 200.

Use the text() function within the draw() function to display the
label and current value of the radius.
```

[Circle Slider](./circle-slider.html)

```javascript
let radiusSlider;
let radius = 0;

function setup() {
  createCanvas(400, 400);
  
  // Create the radius slider
  radiusSlider = createSlider(0, 200, 100);
  radiusSlider.position(10, 10);
}

function draw() {
  background(220);
  
  // Fetch the current radius from the slider
  radius = radiusSlider.value();

  // Draw the circle
  fill(0, 0, 255);
  noStroke();
  circle(width / 2, height / 2, radius * 2);

  // Display the radius value
  fill(0);
  text("Radius: " + radius, 10, 50);
}
```

[Circle Slider Demo](./circle-slider.html)