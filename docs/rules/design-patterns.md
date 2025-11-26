# MicroSim Design Patterns

This page documents the reusable design patterns used across MicroSims. Each pattern follows ISO 11179 naming conventions with a precise definition and code example.

## 1. Two-Region Canvas Pattern

A canvas layout that divides vertical space into an upper visualization region and a lower control region, enabling clear separation between simulation content and user interface elements.

**Example:**
```javascript
let drawHeight = 400;      // Upper visualization region
let controlHeight = 50;    // Lower control region
let canvasHeight = drawHeight + controlHeight;
```

---

## 2. Width-Responsive Layout Pattern

A responsive design approach where canvas width adapts to container dimensions while height remains fixed, enabling consistent embedding across different viewport sizes.

**Example:**
```javascript
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  speedSlider.size(canvasWidth - sliderLeftMargin - margin);
}
```

---

## 3. Container Parent Pattern

A DOM attachment method that binds the p5.js canvas to a specific HTML element, enabling consistent positioning within page layouts and compatibility with the p5.js editor.

**Example:**
```javascript
const canvas = createCanvas(canvasWidth, canvasHeight);
canvas.parent(document.querySelector('main'));
```

---

## 4. Labeled Slider Pattern

A control layout where each slider displays its label and current value to the left of the control element, providing immediate feedback to users.

**Example:**
```javascript
speedSlider.position(sliderLeftMargin, drawHeight + 10);
text('Speed: ' + speedSlider.value(), 10, drawHeight + 15);
```

---

## 5. Start/Pause Toggle Pattern

An animation control that alternates between running and paused states using a single button with dynamic labeling.

**Example:**
```javascript
let isRunning = false;
function toggleSimulation() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}
```

---

## 6. Standard Color Scheme Pattern

A consistent color palette where the drawing region uses 'aliceblue' background with 'silver' borders and the control region uses 'white' background.

**Example:**
```javascript
fill('aliceblue');
stroke('silver');
rect(0, 0, canvasWidth, drawHeight);

fill('white');
rect(0, drawHeight, canvasWidth, controlHeight);
```

---

## 7. Centered Title Pattern

A text placement convention where the simulation title is centered horizontally at the top of the drawing region in 24pt font.

**Example:**
```javascript
textSize(24);
textAlign(CENTER, TOP);
text("Simulation Title", canvasWidth/2, margin);
```

---

## 8. Accessibility Description Pattern

An accessibility feature that provides a text description of the simulation for screen readers using the p5.js `describe()` function.

**Example:**
```javascript
function setup() {
  // ... canvas setup ...
  describe('Interactive bouncing ball simulation with speed control', LABEL);
}
```

---

## 9. Two-Column Layout Pattern

A horizontal division of the drawing area into a simulation section (typically 60%) and a chart/graph section (typically 40%) for data visualization.

**Example:**
```javascript
simWidth = containerWidth * 0.6;
chartWidth = containerWidth * 0.4;
push();
  translate(simWidth + chartMargin, margin);
  drawChart();
pop();
```

---

## 10. Delta Time Animation Pattern

A timing technique that uses elapsed time between frames to ensure consistent animation speed across devices with different frame rates.

**Example:**
```javascript
function updateSimulation() {
  x += speed * (deltaTime / 1000 * 60) * timeScale;
}
```

---

## 11. Boundary Reflection Pattern

A collision detection method that reverses object velocity when it reaches canvas edges, creating contained motion within the drawing region.

**Example:**
```javascript
if ((x > width - r) || (x < r)) {
  dx = dx * -1;
}
if ((y > drawHeight - r) || (y < r)) {
  dy = dy * -1;
}
```

---

## 12. Coordinate Transform Pattern

A rendering technique using `push()`, `translate()`, and `pop()` to create local coordinate systems for drawing complex elements or charts.

**Example:**
```javascript
push();
  translate(canvasWidth/2, drawHeight/2);
  scale(1, -1);  // Flip y-axis for mathematical coordinates
  drawSineWave();
pop();
```

---

## 13. Standard Variables Pattern

A set of consistently named global variables that define canvas dimensions, margins, and layout properties across all MicroSims.

**Example:**
```javascript
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50;
let margin = 25;
let sliderLeftMargin = 105;
let defaultTextSize = 16;
```

---

## 14. Iframe Embedding Pattern

An HTML integration method where the MicroSim is embedded in web pages using a fixed-height iframe with scrolling disabled.

**Example:**
```html
<iframe src="main.html" height="450px" scrolling="no"></iframe>
```

---

## 15. Code Organization Pattern

A file structure convention where code is ordered: global variables, `setup()`, `draw()`, helper functions, then event handlers.

**Example:**
```javascript
// 1. Global variables
let x, y, speed;

// 2. Setup function
function setup() { ... }

// 3. Draw function
function draw() { ... }

// 4. Helper functions
function drawSimulation() { ... }
function updateSimulation() { ... }

// 5. Event handlers
function windowResized() { ... }
function mousePressed() { ... }
```

---

## 16. Hover Tooltip Pattern

An interactive feedback mechanism that displays contextual information when the user hovers over specific regions of the visualization.

**Example:**
```javascript
function drawTooltip() {
  if (hoveredLayer && mouseY < drawHeight) {
    fill(50, 50, 50, 230);
    rect(tx, ty, tw, 22, 4);
    fill(255);
    text(tooltipText, tx + 8, ty + 11);
  }
}
```

---

## 17. Debug Mode Pattern

A development aid that displays diagnostic information (canvas dimensions, frame rate) when a DEBUG flag is enabled.

**Example:**
```javascript
const DEBUG = true;
function draw() {
  if (DEBUG) {
    text(`Canvas: ${canvasWidth}x${canvasHeight}`, 10, 20);
    text(`FPS: ${floor(frameRate())}`, 10, 40);
  }
}
```

---

## 18. Open Graph Aspect Ratio Pattern

A canvas sizing approach that uses the 1.91:1 Open Graph standard aspect ratio for optimal social media preview rendering.

**Example:**
```javascript
let aspectRatio = 1.91;
let canvasWidth = canvasHeight * aspectRatio;
```

---

## References

- [MicroSim Standard Rules](./microsim-rules.md)
- [Cursor Rules File](./cursor.md)
- [p5.js Reference](https://p5js.org/reference/)
