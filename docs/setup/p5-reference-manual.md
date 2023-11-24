# P5.js Reference Guide

#### Canvas

The area where p5.js drawings are displayed. Created using `createCanvas()`.
A good example is a canvas that is 400 wide and 300 high.
We can use two global variables to declare these dimensions.

```javascript
let width = 400
let height = 300
function setup() {
    const canvas = createCanvas(width, height);
    // code to connect your canvas into the HTML
    // canvas.parent('canvas-container');
    // uncommet this line only within the HTML file
}
```

#### setup()

Called once at the start of the program to define initial environment properties.

```javascript
let width = 400
let height = 300
function setup() {
    createCanvas(width, height);
    background(245);
}
```

#### draw()

Continuously executes the lines of code inside its block until stopped.

```javascript
function draw() {
    // draw a circle in the center
    circle(width/2, height/2, 50);
}
  ```

#### createVector()

Creates a new `p5.Vector` object with a x and y value.

  ```javascript
  let v = createVector(50, 50);
  ```

#### mouseX, mouseY
- System variables storing the coordinates of the mouse.
  ```javascript
  function draw() {
    circle(mouseX, mouseY, 50);
  }
  ```

#### background()
Sets the color used for the canvas background.  Our default should be 245
which is a light gray.

  ```javascript
  function setup() {
    createCanvas(400, 400);
    background(255); // White background
  }
  ```

#### fill()

Sets the color used to fill shapes.

```javascript
function draw() {
  fill(255, 0, 0); // Red color
  ellipse(50, 50, 80, 80);
}
```

#### stroke()
Sets the color used for lines and borders around shapes.
  ```javascript
  function draw() {
    stroke(0); // Black color
    line(0, 0, 100, 100);
  }
  ```

#### rect()
- Draws a rectangle.
  ```javascript
  function draw() {
    rect(30, 20, 55, 55);
  }
  ```

#### ellipse()
- Draws an ellipse (oval).
  ```javascript
  function draw() {
    ellipse(50, 50, 80, 80);
  }
  ```

#### line()
- Draws a line.
  ```javascript
  function draw() {
    line(30, 20, 85, 75);
  }
  ```

#### loadImage()
- Loads an image from a path.
  ```javascript
  let img;
  function preload() {
    img = loadImage('image.png');
  }
  ```

#### image()
- Draws an image to the canvas.
  ```javascript
  function draw() {
    image(img, 0, 0);
  }
  ```

#### createGraphics()
- Creates a new graphics object.
  ```javascript
  let pg;
  function setup() {
    createCanvas(100, 100);
    pg = createGraphics(50, 50);
  }
  ```

#### translate()
- Remaps the (0,0) position on the canvas.
  ```javascript
  function draw() {
    translate(width / 2, height / 2);
    rect(0, 0, 30, 30);
  }
  ```

#### rotate()
- Rotates the entire canvas.
  ```javascript
  function draw() {
    rotate(PI / 4);
    rect(50, 50, 100, 50);
  }
  ```

#### push()

Saves the current drawing style settings and transformations.
  ```javascript
  function draw() {
    push();
    stroke(0);
    fill(102);
    rect(0, 0, 50, 50);
    pop();
  }
  ```

#### pop()

Restores the drawing style settings and transformations previously saved.
  ```javascript
  // Used in conjunction with push() as shown above.
  ```

#### frameRate()

Specifies the number of frames to be displayed every second.
  ```javascript
  function setup() {
    frameRate(30);
  }
  ```

#### noLoop()

Stops the draw loop.  This can be used when a drawing is finished.
  ```javascript
  function draw() {
    ellipse(50, 50, 80, 80);
    noLoop();
  }
  ```

#### loop()

Restarts the draw loop after it has been stopped.

  ```javascript
  function mousePressed() {
    loop();
  }
  ```

#### keyPressed()

Called whenever a key is pressed.

  ```javascript
  function keyPressed() {
    if (keyCode === LEFT_ARROW) {
      // Left arrow key pressed
    }
  }
  ```

#### mousePressed()

Called whenever a mouse button is pressed.
  ```javascript
  function mousePressed() {
    ellipse(mouseX, mouseY, 80, 80);
  }
  ```

