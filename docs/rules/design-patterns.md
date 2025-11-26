# MicroSim Design Patterns

This page documents the reusable design patterns used across MicroSims. Each pattern follows ISO 11179 naming conventions with a precise definition and code example.

## 1. Separation of Drawing and Control Regions Pattern

A canvas layout that divides vertical space into an upper visualization region and a lower control region, 
enabling clear separation between simulation content and user interface elements.

**Example:**
```javascript
let drawHeight = 400;      // Upper visualization region
let controlHeight = 50;    // Lower control region
let canvasHeight = drawHeight + controlHeight;
```

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

## 3. Main Container Parent Pattern

A DOM attachment method that binds the p5.js canvas to the `main` HTML element.
This pattern enables consistent positioning within page layouts and compatibility with the p5.js editor.

**Example:**
```javascript
const canvas = createCanvas(canvasWidth, canvasHeight);
canvas.parent(document.querySelector('main'));
```

## 4. Labeled Value Slider Pattern

A control layout where each slider displays its label and current value to the left of the control element, 
providing immediate feedback to users.

**Example:**
```javascript
speedSlider.position(sliderLeftMargin, drawHeight + 10);
text('Speed: ' + speedSlider.value(), 10, drawHeight + 15);
```

This pattern requires the AI to estimate the width of the label-value pairs and to place the sliders
to the right of the widest label value pairs.

!!! note
  There are ways to precisely measure the right edge of label-value pairs in the controls region
  and place this x-position value in the console.  This value can be read by an agent and used
  to recalculate the sliderLeftMargin variable.  This process is beyond the scope of many AI processes.

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

## 6. Standard Color Scheme Pattern

A consistent color palette where the drawing region uses 'aliceblue' background with 'silver' borders and the control region uses 'white' background.

**Example:**
```javascript
// make the background of the drawing region light blue
fill('aliceblue');
// draw a light gray border around both the drawing region and the control region
stroke('silver');
rect(0, 0, canvasWidth, drawHeight);
// make the background of the control region white
fill('white');
rect(0, drawHeight, canvasWidth, controlHeight);
```

This color scheme give all MicroSims a consistent look and feel.  When a student sees the light blue
background in an intelligent textbook page it is a clue that they can interact with the MicroSim using
the controls and the region is not only a static drawing.

## 7. Centered Title Pattern

A text placement convention where the simulation title is centered horizontally at the top of the drawing region in 24pt font.

**Example:**
```javascript
textSize(24);
textAlign(CENTER, TOP);
text("Simulation Title", canvasWidth/2, margin);
```

The exception to this is when the MicroSim uses a X-Y grid and the vertical axis label is at the top-center
of the drawing region.  In this case the title is drawn AFTER the gridlines and axis labels and placed
to the left.

```javascript
// center the title to the left to avoid covering the vertical axis
text("Simulation Title", canvasWidth*.3, margin);
```

## 8. Accessibility Description Pattern

An accessibility feature that provides a text description of the simulation for screen readers using the p5.js `describe()` function.

**Example:**
```javascript
function setup() {
  // ... canvas setup ...
  describe('Interactive bouncing ball simulation with speed control', LABEL);
}
```

## 9. Two-Column Layout Pattern

A horizontal division of the drawing area into a simulation section (typically the left 50%) and a chart/graph section (typically the right 50%) for data visualization.

**Example:**
```javascript
simWidth = containerWidth * 0.5;
chartWidth = containerWidth * 0.5;
push();
  translate(simWidth + chartMargin, margin);
  drawChart();
pop();
```

This pattern is only used when a chart is being drawn to show changes in the value of a simulation state.

## 10. Delta Time Animation Pattern

A timing technique that uses elapsed time between frames to ensure consistent animation speed across devices with different frame rates.

**Example:**
```javascript
function updateSimulation() {
  x += speed * (deltaTime / 1000 * 60) * timeScale;
}
```

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

## 12. Coordinate Transform Pattern

A rendering technique using `push()`, `translate()`, and `pop()` to create local coordinate systems for drawing groups of complex elements or charts.

**Example:**
```javascript
push();
  // move all the items in the drawing group to the center of the drawing region
  translate(canvasWidth/2, drawHeight/2);
  scale(1, -1);  // Flip y-axis for mathematical coordinates where (0,0) is in the lower left
  drawSineWave();
pop();
```

!!! note
  The transform pattern is not needed for single items such as the title.

## 13. Standard Variables Pattern

A set of consistently named global variables that define canvas dimensions, margins, and layout properties across all MicroSims.

**Example:**
```javascript
let canvasWidth = 400; // this will change based on the container width on resize
let drawHeight = 400;
let controlHeight = 50;
let margin = 25;
let sliderLeftMargin = 105;
let defaultTextSize = 16;
```

## 14. Iframe Embedding Pattern

An HTML integration method where the MicroSim is embedded in web pages using a fixed-height iframe with scrolling disabled.

**Example:**
```html
<iframe src="main.html" height="450px" scrolling="no"></iframe>
```

!!! warning
  Do not forget to include the no scrolling attribute.  Making the iframe scrollable is confusing to users
  when the textbook content is also scrolling.

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

!!! note
  windowResized() is required on all MicroSims in order to be width-responsive.

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

## 18. Open Graph Aspect Ratio Pattern

A canvas sizing approach that uses the 1.91:1 Open Graph standard aspect ratio for optimal social media preview rendering.

**Example:**
```javascript
let aspectRatio = 1.91;
let canvasWidth = canvasHeight * aspectRatio;
```

## 19. Standard Directory Structure Pattern

A file organization convention where each MicroSim resides in its own directory containing a consistent set of files with standardized names.

**Example:**
```
docs/sims/bouncing-ball/
├── index.md           # Documentation with YAML frontmatter
├── main.html          # HTML wrapper that loads the sketch
├── bouncing-ball.js   # p5.js sketch (named after directory)
├── bouncing-ball.png  # Preview image for social sharing
├── metadata.json      # Dublin Core metadata for discovery
└── style.css          # Optional custom styles
```

**Required Files:**

| File | Purpose |
|------|---------|
| `index.md` | MkDocs documentation page with title, description, iframe embed, and lesson plan |
| `main.html` | Minimal HTML wrapper that includes p5.js CDN and loads the sketch |
| `{sim-name}.js` | The p5.js sketch file, named to match the directory |
| `{sim-name}.png` | Preview screenshot (recommended 1200x630px for Open Graph) |
| `metadata.json` | Dublin Core metadata including creator, subject, educational level |

**Optional Files:**

| File | Purpose |
|------|---------|
| `style.css` | Custom CSS overrides for the HTML wrapper |

!!! note
    The `.js` and `.png` files must match the directory name exactly. This enables automated gallery generation and consistent linking.

## 20. Metadata JSON Schema Pattern

A structured metadata file that describes a MicroSim using Dublin Core standards and educational specifications, validated against a formal JSON schema for consistency and discoverability.

**Schema Location:** [microsim-schema.json](https://github.com/dmccreary/microsims/blob/main/src/microsim-schema/microsim-schema.json)

**Example:**
```json
{
  "microsim": {
    "dublinCore": {
      "title": "Bouncing Ball Simulation",
      "creator": ["Claude AI", "Dan McCreary"],
      "subject": ["Physics", "Kinematics"],
      "description": "Interactive simulation demonstrating velocity and collision",
      "date": "2025-01-15",
      "type": "Educational MicroSim",
      "format": "text/javascript",
      "language": "en",
      "rights": "CC BY-NC-SA 4.0"
    },
    "search": {
      "tags": ["physics", "motion", "animation"],
      "visualizationType": ["animation", "simulation"]
    },
    "educational": {
      "gradeLevel": ["9", "10", "11"],
      "subjectArea": ["Physics", "Science"],
      "topic": ["velocity", "collision detection"],
      "learningObjectives": [
        "Understand how velocity affects motion",
        "Observe elastic collision behavior"
      ],
      "bloomsTaxonomy": ["Understand", "Apply"],
      "difficulty": "Beginner"
    },
    "technical": {
      "framework": "p5.js",
      "canvasDimensions": {
        "width": 400,
        "height": 450,
        "responsive": true
      },
      "regions": {
        "drawHeight": 400,
        "controlHeight": 50
      }
    },
    "userInterface": {
      "layoutType": "responsive-width",
      "controls": [
        {
          "id": "speedSlider",
          "type": "slider",
          "label": "Speed",
          "properties": {
            "min": 0,
            "max": 20,
            "default": 5,
            "step": 1
          }
        }
      ]
    }
  }
}
```

**Required Sections:**

| Section | Purpose |
|---------|---------|
| `dublinCore` | Resource identification (title, creator, subject, description, date, type, format, rights) |
| `search` | Discovery metadata (tags, visualizationType) |
| `educational` | Learning context (gradeLevel, subjectArea, topic, learningObjectives) |
| `technical` | Implementation details (framework, canvasDimensions) |
| `userInterface` | Control specifications (controls array) |

**Optional Sections:**

| Section | Purpose |
|---------|---------|
| `simulation` | Model specifications, equations, variables |
| `analytics` | Learning analytics events and tracking |
| `usage` | Pedagogical recommendations and assessment questions |

!!! tip "Validation"
    Use the validation script to check your metadata:
    ```bash
    python src/validate-yaml-file.py docs/sims/{sim-name}/metadata.json
    ```

## References

- [MicroSim Standard Rules](./microsim-rules.md)
- [Cursor Rules File](./cursor.md)
- [p5.js Reference](https://p5js.org/reference/)
