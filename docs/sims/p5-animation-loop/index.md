# p5.js Animation Loop Cycle

This diagram illustrates how the p5.js animation loop works, showing the continuous cycle of `draw()` calls that enables smooth animations.

<iframe src="main.html" width="100%" height="550px" scrolling="no"></iframe>

[View p5.js Animation Loop Cycle Fullscreen](main.html)

## Key Points

- **setup()** - Runs **ONCE** when the program starts
- **draw()** - Runs **REPEATEDLY** in a continuous loop
- Default frame rate is 60 frames per second (~16.7ms per frame)
- `frameCount` increments with each draw() call

## About This Diagram

When a p5.js program starts, the `setup()` function runs exactly once to initialize the canvas and any variables. Then the `draw()` function runs continuously in a loop, typically 60 times per second (60fps). Each iteration waits approximately 16.7 milliseconds before the next frame, and the built-in `frameCount` variable increments with each cycle. This continuous loop is what enables smooth animations in p5.js.

## How It Works

1. **Program Starts** - The browser loads and begins executing your p5.js sketch
2. **setup() runs once** - Executes exactly one time to initialize the canvas, set up variables, and configure settings
3. **draw() runs** - The main drawing function that creates each frame of your animation
4. **Wait for next frame** - The system pauses briefly (~16.7 milliseconds at 60fps)
5. **frameCount++** - The built-in frame counter increments
6. **Loop continues** - Execution returns to `draw()` and the cycle repeats indefinitely

## Code Example

```javascript
let x = 0;

function setup() {
    createCanvas(400, 300);
    // This runs ONCE
    console.log("Setup complete!");
}

function draw() {
    background(220);
    // This runs REPEATEDLY (60 times per second)
    ellipse(x, height/2, 50, 50);
    x = x + 1;

    // frameCount increments each loop
    text("Frame: " + frameCount, 10, 20);
}
```

## Related Concepts

- [Getting Started with p5.js](../../chapters/03-getting-started-with-p5js/index.md)
- [Drawing, Animation and Color](../../chapters/04-drawing-animation-and-color/index.md)
- [noLoop() and loop()](https://p5js.org/reference/#/p5/noLoop) - Control the animation loop
- [frameRate()](https://p5js.org/reference/#/p5/frameRate) - Change the frames per second
