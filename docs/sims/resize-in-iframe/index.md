# Resize in iframe

<iframe src="/microsims/sims/resize-in-iframe/resize-in-iframe.html" height="200px"></iframe>

[Run Resize in iFrame MicroSim](./resize-in-iframe.html){.md-button .md-button--primary}
[Edit in p5.js](https://editor.p5js.org/dmccreary/sketches/egl_OTZYr)

## Prompt

```linenums="0"
I would like to create a p5.js program that is aware of the width of the HTML container element that it is executing within.  I want to do this because my users want to use my p5.js application within an HTML iframe that is placed in a central content region knowing that the user will run in
many different sized windows.  Basically I want a responsive design for the width.

Please generate a p5.js program that displays the width and height of the region that contains it
in a 36 size.  Make the canvas background be aliceblue.

Also give guidance on how I should change the site CSS to style the iFrame that contains the p5.js program so it always expands to the width of the container it is running in.

Assume the standard p5.js HTML template that puts the container in a <main> element.
Assume that each p5.js will set the canvas hight to a fixed number of pixels.
```

## Response

```javascript
// global variables for width and height
let containerWidth; // calculated by container upon resize
let containerHeight = 200; // fixed height on page

function setup() {
    // Create a canvas to match the parent container's size
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, containerHeight);
    var mainElement = document.querySelector('main');
    canvas.parent(mainElement);
    /* canvas.parent('p5-container'); */
    noLoop(); // Stop the draw loop since we'll redraw only on resize
}

function draw() {
  background('aliceblue');
  fill('black');
  textSize(36);
  textAlign(CENTER, CENTER);

  // Display container dimensions
  text(`Width: ${containerWidth}px\nHeight: ${containerHeight}px`, width / 2, height / 2);
}

function windowResized() {
  // Update canvas size when the container resizes
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  redraw();
}

function updateCanvasSize() {
    // Get the exact dimensions of the container
    const container = document.getElementById('p5-container').getBoundingClientRect();
    containerWidth = Math.floor(container.width);  // Avoid fractional pixels
}
```

## Explanation of the Code

This code is a p5.js sketch that creates a canvas sized to the width of a parent HTML container element but uses a fixed height. It also updates and redraws the canvas whenever the browser window is resized. Here's a line-by-line explanation of what's happening:

### Global Variables

```javascript
let containerWidth; // Will store the width of the container
let containerHeight = 200; // A fixed height for the canvas
```

- **containerWidth**: This variable will be updated dynamically based on the `#p5-container` element's width.
- **containerHeight**: This is fixed at 200 pixels. Unlike width, it won't change when the window is resized.

### setup() Function

```javascript
function setup() {
    // Create a canvas to match the parent container's size
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, containerHeight);
    canvas.parent('p5-container');
    noLoop(); // Stop the draw loop since we'll redraw only on resize
}
```

- **updateCanvasSize()**: This function call updates `containerWidth` by measuring the HTML element with the ID `p5-container`.
- **createCanvas(containerWidth, containerHeight)**: Creates a p5.js canvas. The width is taken from the container's width; the height is the fixed 200 pixels.
- **canvas.parent('p5-container')**: Inserts the created canvas element inside the HTML element with the ID `p5-container`. This ensures the canvas is placed in the correct part of the page.
- **noLoop()**: Tells p5.js not to continuously call `draw()` every frame. Instead, it will only call `draw()` when explicitly instructed to. This helps prevent unnecessary re-rendering.

### draw() Function

```javascript
function draw() {
  background('aliceblue');
  fill('black');
  textSize(36);
  textAlign(CENTER, CENTER);

  // Display container dimensions
  text(`Width: ${containerWidth}px\nHeight: ${containerHeight}px`, width / 2, height / 2);
}
```

- **background('aliceblue')**: Sets a light blue background color for the canvas.
- **fill('black')**: Sets the text drawing color to black.
- **textSize(36)**: Sets the size of the text to be displayed on the canvas.
- **textAlign(CENTER, CENTER)**: Centers text both horizontally and vertically.
- **text(`Width: ${containerWidth}px\nHeight: ${containerHeight}px`, width / 2, height / 2)**: Draws a message in the center of the canvas displaying the current width and height values. The `\n` creates a new line so both values appear one above the other.

### windowResized() Function

```javascript
function windowResized() {
  // Update canvas size when the container resizes
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  redraw();
}
```

-   **windowResized()**: A p5.js event function that is automatically called whenever the browser window changes size.
-   **updateCanvasSize()**: Updates `containerWidth` based on the container's current dimensions.
-   **resizeCanvas(containerWidth, containerHeight)**: Adjusts the existing canvas to the new width and height. Because the height is fixed, only the width may really change.
-   **redraw()**: Manually triggers `draw()` again, ensuring the text reflects the new dimensions.

### updateCanvasSize() Function

```javascript
function updateCanvasSize() {
    // Get the exact dimensions of the container
    const container = document.getElementById('p5-container').getBoundingClientRect();
    containerWidth = Math.floor(container.width);  // Avoid fractional pixels
}
```

- **document.getElementById('p5-container').getBoundingClientRect()**: Returns an object containing the size and position of the element relative to the viewport.
- **containerWidth = Math.floor(container.width)**: Assigns the container's width (rounded down to the nearest whole number) to the `containerWidth` variable, ensuring no fractional pixel values that might cause layout jitter.

**Why This Matters:**

-   By separating the container width calculation from the canvas height (which is fixed), you ensure a stable vertical dimension.
-   Calling `updateCanvasSize()` before creating or resizing the canvas ensures the canvas matches the container's dimensions at all times.
-   Using `noLoop()` and `redraw()` allows the canvas to only update when necessary (on initial load and window resize), making the sketch more efficient.
