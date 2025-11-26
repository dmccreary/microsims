---
title: MicroSim Architecture and Layout
description: Master the structural patterns and layout techniques that make MicroSims look professional
generated_by: claude skill chapter-content-generator
date: 2025-01-25 16:15:00
version: 0.03
---

# MicroSim Architecture and Layout

## Summary

This chapter teaches the structural organization of MicroSims that creates a consistent user experience. You will learn about the standard two-region architecture with a drawing region for visualizations and a control region for user interface elements. The chapter covers canvas dimension variables including canvasWidth, canvasHeight, drawHeight, and controlHeight, plus the use of margins for visual spacing. You will explore different layout patterns including standard, two-column, fixed, and responsive layouts.

## Concepts Covered

This chapter covers the following 12 concepts from the learning graph:

1. MicroSim Architecture
2. Drawing Region
3. Control Region
4. Canvas Width
5. Canvas Height
6. Draw Height
7. Control Height
8. Margin Variable
9. Standard Layout
10. Two-Column Layout
11. Fixed Layout
12. Responsive Layout

## Prerequisites

This chapter builds on concepts from:

- [Chapter 3: Getting Started with p5.js](../03-getting-started-with-p5js/index.md)
- [Chapter 4: Drawing, Animation, and Color](../04-drawing-animation-and-color/index.md)

---

## Making Your MicroSims Look Like a Million Bucks

You've learned to write code that works. Now it's time to make it *shine*.

Sometimes, to truly impress your students and colleagues, you need to add some **spit and polish** to your MicroSims. A simulation that looks professional—with clean layouts, consistent spacing, and thoughtful organization—commands attention and respect. It says, "This was crafted with care."

This chapter walks you through the **architecture of a MicroSim** and all the **layout tricks** that separate amateur-looking simulations from professional-quality educational tools. When you finish, your MicroSims won't just work—they'll look like a million bucks.

!!! tip "First Impressions Matter"
    Students make judgments about educational quality in seconds. A polished, well-organized MicroSim signals credibility and professionalism before a single interaction occurs.

## MicroSim Architecture: The Blueprint

**MicroSim architecture** refers to the structural organization of your simulation—how the different parts are arranged and how they work together. Just as a building has a floor plan that organizes rooms, a MicroSim has an architecture that organizes visual and interactive elements.

The standard MicroSim architecture divides the canvas into two distinct regions:

1. **Drawing Region**: Where the simulation visualization lives
2. **Control Region**: Where sliders, buttons, and labels reside

This separation isn't arbitrary—it's based on user interface principles that make simulations intuitive and learnable.

### Why Two Regions?

| Design Principle | How Two Regions Help |
|-----------------|---------------------|
| **Visual hierarchy** | Clear separation between content and controls |
| **Consistent expectations** | Users always know where to find controls |
| **Clean aesthetics** | Prevents cluttered, confusing layouts |
| **Responsive design** | Each region can adapt independently |
| **Accessibility** | Screen readers can navigate predictable structure |

#### Diagram: MicroSim Architecture Overview

<details markdown="1">
    <summary>MicroSim Architecture Diagram</summary>
    Type: diagram

    Purpose: Show the standard two-region MicroSim architecture with labeled dimensions (Bloom: Remember, Understand)

    Canvas size: 400x450 pixels total

    Components to show:
    - Full canvas outline with label "canvasHeight = 450"
    - Width dimension with label "canvasWidth = 400"
    - Drawing region (top):
      - Background: alice blue (#F0F8FF)
      - Height label: "drawHeight = 400"
      - Contains sample visualization (bouncing ball with trajectory)
      - Margin lines shown as dashed (25px from edges)
      - Label: "Drawing Region"
    - Control region (bottom):
      - Background: white (#FFFFFF)
      - Height label: "controlHeight = 50"
      - Contains sample slider and label
      - Dividing line between regions (silver)
      - Label: "Control Region"
    - Margin annotations:
      - Arrows showing 25px margins on left, right, top
      - Label: "margin = 25"

    Visual style:
    - Clean, technical diagram style
    - Dimension lines with arrows
    - Dashed lines for margins
    - Color-coded regions

    Annotations:
    - "Visualization goes here" in drawing region
    - "User controls here" in control region
    - Formula: "canvasHeight = drawHeight + controlHeight"

    Color scheme:
    - Drawing region: alice blue (#F0F8FF)
    - Control region: white (#FFFFFF)
    - Dimension lines: dark gray (#333)
    - Margin lines: dashed light gray

    Implementation: Static diagram or simple p5.js visualization
</details>

## The Drawing Region: Your Visualization Canvas

The **drawing region** is the primary visual area where your simulation's main content appears. This is where balls bounce, pendulums swing, graphs plot, and physics happens.

### Characteristics of the Drawing Region

- Occupies the **upper portion** of the canvas
- Uses a consistent **background color** (typically alice blue: `rgb(240, 248, 255)`)
- Contains all **animated or interactive visualizations**
- Respects **margins** to prevent elements from touching edges
- Height is defined by the `drawHeight` variable

### Drawing Region Best Practices

1. **Keep it focused**: One main visualization, not multiple competing elements
2. **Respect boundaries**: Elements should stay within margin boundaries
3. **Use the full space**: Don't leave large empty areas unused
4. **Consistent background**: Alice blue provides gentle contrast without distraction
5. **Clear visual hierarchy**: Most important elements should be most prominent

```javascript
// Drawing region setup
let drawHeight = 400;

function draw() {
  // Clear drawing region with alice blue
  fill(240, 248, 255);
  noStroke();
  rect(0, 0, width, drawHeight);

  // Your visualization code goes here
  // ...
}
```

## The Control Region: Command Central

The **control region** is the dedicated area for user interface elements—sliders, buttons, labels, and value displays. Separating controls from the visualization prevents clutter and creates a predictable user experience.

### Characteristics of the Control Region

- Located at the **bottom** of the canvas
- Uses a **white background** for clean contrast
- Contains **sliders**, **buttons**, and **text labels**
- Height is defined by the `controlHeight` variable (typically 50-100 pixels)
- Has a subtle **dividing line** separating it from the drawing region

### Control Region Layout

A well-organized control region follows this pattern:

```
|  Label: |===========O===========| Value  |
```

Where:
- **Label** appears to the left of the slider
- **Slider** occupies the middle space
- **Value** displays to the right (updates dynamically)

```javascript
// Control region setup
let controlHeight = 50;
let sliderLeftMargin = 100;

function draw() {
  // Draw control region background
  fill(255);
  noStroke();
  rect(0, drawHeight, width, controlHeight);

  // Dividing line
  stroke(200);
  strokeWeight(1);
  line(0, drawHeight, width, drawHeight);

  // Label
  fill(0);
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(14);
  text("Speed:", 10, drawHeight + controlHeight/2);

  // Value display
  textAlign(RIGHT, CENTER);
  text(speedSlider.value().toFixed(1), width - 10, drawHeight + controlHeight/2);
}
```

## Canvas Dimension Variables

Professional MicroSims use **named variables** for all dimensions rather than magic numbers. This makes code readable, maintainable, and easy to modify.

### The Core Dimension Variables

| Variable | Purpose | Typical Value |
|----------|---------|---------------|
| `canvasWidth` | Total canvas width | 400-800 pixels |
| `canvasHeight` | Total canvas height | Calculated: drawHeight + controlHeight |
| `drawHeight` | Height of visualization area | 300-500 pixels |
| `controlHeight` | Height of control area | 50-100 pixels |
| `margin` | Spacing from edges | 20-30 pixels |

### The Standard Variable Declaration Block

Every MicroSim should begin with this pattern:

```javascript
// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;

// Slider positioning
let sliderLeftMargin = 100;
let defaultTextSize = 16;
```

### Why Named Variables Matter

Consider the difference:

**Without named variables (hard to read):**
```javascript
rect(0, 400, 400, 50);
circle(200, 200, 40);
text("Speed:", 10, 425);
```

**With named variables (clear intent):**
```javascript
rect(0, drawHeight, canvasWidth, controlHeight);
circle(canvasWidth/2, drawHeight/2, 40);
text("Speed:", margin, drawHeight + controlHeight/2);
```

The second version tells a story: the rectangle is the control region, the circle is centered in the drawing area, and the text is positioned in the control region.

## The Margin Variable: Breathing Room

The **margin variable** defines the spacing between content and canvas edges. Margins create visual breathing room that makes simulations feel polished rather than cramped.

### Why Margins Matter

| Without Margins | With Margins |
|----------------|--------------|
| Elements touch edges | Clean visual boundaries |
| Feels cramped | Feels spacious |
| Text may be cut off | All content visible |
| Amateur appearance | Professional appearance |

### Using Margins Consistently

Apply margins to:

- **Title positioning**: `text(title, canvasWidth/2, margin)`
- **Shape boundaries**: `if (x < margin || x > canvasWidth - margin)`
- **Label placement**: `text(label, margin, y)`
- **Drawing constraints**: Keep visualizations within margin boundaries

```javascript
let margin = 25;

function draw() {
  // Title with margin from top
  textAlign(CENTER, TOP);
  text("Bouncing Ball Simulation", canvasWidth/2, margin);

  // Ball constrained by margins
  if (ballX < margin + ballRadius || ballX > canvasWidth - margin - ballRadius) {
    velocityX *= -1;  // Bounce off margin boundaries
  }
}
```

#### Diagram: Margin Visualization MicroSim

<details markdown="1">
    <summary>Interactive Margin Visualization</summary>
    Type: microsim

    Learning objective: Help students visualize how margins create visual boundaries and affect element positioning (Bloom: Understand, Apply)

    Canvas layout:
    - Drawing area: 400x350 pixels
    - Control area: 50 pixels

    Visual elements:
    - Canvas outline (dark gray)
    - Margin boundary rectangle (dashed red line, inset by margin value)
    - Sample elements positioned at margin boundaries:
      - Title text at top margin
      - Shapes bouncing within margin boundaries
      - Labels positioned at left margin
    - Dimension annotations showing margin distances
    - "Safe zone" label in center
    - "Margin zone" labels in edge areas

    Interactive controls:
    - Slider: "Margin Size" (0-50 pixels, default 25)
    - As slider changes, margin boundary updates in real-time
    - Sample elements reposition to respect new margins

    Behavior:
    - Changing margin slider updates dashed boundary line
    - Bouncing shape adjusts its boundaries
    - Shows how larger margins create more breathing room
    - Demonstrates margin = 0 vs margin = 50 difference

    Color scheme:
    - Drawing area: alice blue
    - Margin boundary: dashed red
    - Safe zone: light green tint
    - Edge zones: light red tint

    Implementation: p5.js with slider control
</details>

## The Standard Layout: Your Default Choice

The **standard layout** is the go-to pattern for most MicroSims. It features a single drawing region above a control region, with all elements arranged vertically.

### Standard Layout Structure

```
┌─────────────────────────────────┐
│                                 │
│        Drawing Region           │
│     (Visualization Area)        │
│                                 │
│         drawHeight              │
│                                 │
├─────────────────────────────────┤
│  Label: ════════O════════ Value │
│        Control Region           │
│         controlHeight           │
└─────────────────────────────────┘
```

### When to Use Standard Layout

- Single visualization without secondary displays
- Simple simulations with 1-3 controls
- Narrow container widths (< 500px)
- Mobile-friendly designs
- Quick prototypes

### Standard Layout Template

```javascript
// Standard Layout Template
let canvasWidth = 400;
let drawHeight = 350;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;

let speedSlider;

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Create slider in control region
  speedSlider = createSlider(1, 10, 5);
  speedSlider.position(100, drawHeight + 15);
  speedSlider.size(canvasWidth - 150);

  describe('Standard layout MicroSim with visualization and controls');
}

function draw() {
  // Drawing region
  background(240, 248, 255);

  // Control region
  fill(255);
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Dividing line
  stroke(200);
  line(0, drawHeight, canvasWidth, drawHeight);

  // Control label
  fill(0);
  noStroke();
  textSize(14);
  textAlign(LEFT, CENTER);
  text("Speed:", 10, drawHeight + controlHeight/2);

  // Value display
  textAlign(RIGHT, CENTER);
  text(speedSlider.value(), canvasWidth - 10, drawHeight + controlHeight/2);

  // Your visualization here...
}
```

## The Two-Column Layout: Side-by-Side Power

The **two-column layout** splits the drawing region into two side-by-side areas. This is perfect for simulations that need to show two related views simultaneously—like a main visualization paired with a graph or a comparison view.

### Two-Column Layout Structure

```
┌────────────────┬────────────────┐
│                │                │
│    Left        │     Right      │
│   Column       │    Column      │
│ (Simulation)   │   (Graph)      │
│                │                │
├────────────────┴────────────────┤
│  Label: ════════O════════ Value │
│         Control Region          │
└─────────────────────────────────┘
```

### When to Use Two-Column Layout

- Visualization with accompanying graph/chart
- Before/after comparisons
- Dual simulations for comparison
- Main view with data panel
- Animation with parameter display

### Two-Column Layout Template

```javascript
// Two-Column Layout Template
let canvasWidth = 600;
let drawHeight = 350;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;

// Column dimensions
let leftColumnWidth, rightColumnWidth;

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Calculate column widths
  leftColumnWidth = canvasWidth / 2;
  rightColumnWidth = canvasWidth / 2;

  describe('Two-column layout with simulation and graph');
}

function draw() {
  // Left column - Simulation
  fill(240, 248, 255);
  noStroke();
  rect(0, 0, leftColumnWidth, drawHeight);

  // Right column - Graph (slightly different tint)
  fill(248, 248, 255);
  rect(leftColumnWidth, 0, rightColumnWidth, drawHeight);

  // Column divider
  stroke(200);
  strokeWeight(1);
  line(leftColumnWidth, 0, leftColumnWidth, drawHeight);

  // Control region
  fill(255);
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Use push/translate/pop for each column
  push();
  translate(0, 0);
  drawSimulation();  // Draw in left column coordinates
  pop();

  push();
  translate(leftColumnWidth, 0);
  drawGraph();  // Draw in right column coordinates
  pop();
}
```

### The Push/Translate/Pop Pattern

For two-column layouts, use `push()`, `translate()`, and `pop()` to work in local coordinates:

```javascript
function drawGraph() {
  // Now (0,0) is the top-left of the right column
  // All drawing happens relative to this origin

  // Draw axes
  stroke(0);
  line(margin, drawHeight - margin, rightColumnWidth - margin, drawHeight - margin);
  line(margin, margin, margin, drawHeight - margin);

  // Plot data
  // coordinates are relative to column, not canvas
}
```

#### Diagram: Two-Column Layout Comparison

<details markdown="1">
    <summary>Two-Column Layout Interactive Demo</summary>
    Type: microsim

    Learning objective: Demonstrate how two-column layouts work with synchronized visualizations (Bloom: Understand, Apply)

    Canvas layout:
    - Total width: 600 pixels
    - Draw height: 350 pixels
    - Control height: 50 pixels

    Visual elements:
    Left column (300px wide):
    - Bouncing ball simulation
    - Ball moves within left column boundaries
    - Background: alice blue

    Right column (300px wide):
    - Real-time graph showing ball's Y position over time
    - X-axis: time (scrolling)
    - Y-axis: vertical position
    - Line graph updating each frame
    - Background: slightly different blue tint

    Divider:
    - 1px silver line between columns

    Interactive controls:
    - Slider: "Gravity" (affects ball in left column, shows in graph on right)
    - Slider: "Ball Size"

    Behavior:
    - Ball bounces in left column
    - Graph in right column plots ball's Y position over time
    - Changing gravity affects both visualizations
    - Demonstrates data flow between columns

    Educational emphasis:
    - Shows how columns can display related information
    - Demonstrates push/translate/pop coordinate system
    - Shows real-time data visualization

    Implementation: p5.js with push/translate/pop pattern
</details>

## Fixed Layout: Predictable and Stable

A **fixed layout** maintains constant dimensions regardless of the browser window or container size. The canvas is always the same width and height, providing a completely predictable visual experience.

### Characteristics of Fixed Layout

| Aspect | Fixed Layout Behavior |
|--------|----------------------|
| Canvas size | Always the same (e.g., 400x450) |
| Responsiveness | None—doesn't adapt to container |
| Predictability | Complete—elements never move |
| Best for | Precise positioning, print layouts |
| Drawbacks | May not fit all containers |

### When to Use Fixed Layout

- When precise pixel positioning is critical
- For simulations embedded in fixed-width containers
- When responsive adaptation would break the visualization
- For print or PDF export
- For consistent screenshots and documentation

### Fixed Layout Implementation

```javascript
// Fixed Layout - No responsive functions needed
let canvasWidth = 400;  // Always 400 pixels
let drawHeight = 350;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;

function setup() {
  createCanvas(canvasWidth, canvasHeight);  // Fixed size
  // No windowResized() function
  // No updateCanvasSize() function
}

function draw() {
  // Layout never changes
  // All positions are constant
}
```

## Responsive Layout: Adapting with Grace

A **responsive layout** adjusts to the available container width, making your MicroSim work beautifully on any screen size—from narrow mobile devices to wide desktop monitors.

### Characteristics of Responsive Layout

| Aspect | Responsive Layout Behavior |
|--------|---------------------------|
| Canvas width | Adapts to container width |
| Canvas height | Usually fixed (drawHeight + controlHeight) |
| Elements | Reposition relative to width |
| Best for | Web embedding, intelligent textbooks |
| Requires | windowResized() and updateCanvasSize() |

### The Responsive Pattern

Responsive layouts require three key elements:

1. **Initial size detection** in `setup()`
2. **windowResized()** function to detect changes
3. **updateCanvasSize()** function to recalculate dimensions

```javascript
// Responsive Layout Template
let canvasWidth = 400;  // Initial/minimum width
let drawHeight = 350;   // Fixed height
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;

function setup() {
  updateCanvasSize();  // Get initial container width
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  describe('Responsive MicroSim that adapts to container width');
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  repositionControls();  // Reposition sliders, buttons
}

function updateCanvasSize() {
  // Get container width, with minimum
  const container = document.querySelector('main');
  canvasWidth = max(300, container.offsetWidth);  // Minimum 300px
  // canvasHeight stays fixed
}

function repositionControls() {
  // Update slider positions and sizes
  speedSlider.position(100, drawHeight + 15);
  speedSlider.size(canvasWidth - 150);
}

function draw() {
  // Use canvasWidth for all horizontal positioning
  // Elements automatically adapt when width changes
}
```

### Responsive Positioning Strategies

**Relative positioning** (adapts to width):
```javascript
let centerX = canvasWidth / 2;
let rightEdge = canvasWidth - margin;
let thirdPoint = canvasWidth / 3;
```

**Percentage-based sizing**:
```javascript
let elementWidth = canvasWidth * 0.8;  // 80% of width
let sliderWidth = canvasWidth - sliderLeftMargin - margin;
```

**Anchored positioning**:
```javascript
// Anchor to right edge
let x = canvasWidth - 100;  // Always 100px from right

// Anchor to center
let x = canvasWidth / 2;    // Always centered
```

#### Diagram: Responsive Layout Playground

<details markdown="1">
    <summary>Responsive Layout Playground MicroSim</summary>
    Type: microsim

    Learning objective: Allow students to experiment with responsive layouts by simulating different container widths (Bloom: Apply, Analyze)

    Canvas layout:
    - Simulated container that can resize
    - MicroSim inside that adapts to container
    - External controls to change container width

    Visual elements:
    - Outer frame showing "browser window" or "container"
    - Inner MicroSim demonstrating responsive behavior
    - Width indicator showing current width in pixels
    - Annotations showing how elements reposition
    - Comparison: Fixed vs Responsive side-by-side

    Sample MicroSim inside:
    - Centered title (always centered regardless of width)
    - Bouncing ball (adjusts bounds to new width)
    - Slider (expands/contracts with width)
    - Labels (anchor positions demonstrated)

    Interactive controls:
    - Slider: "Container Width" (300-800 pixels)
    - Button: "Mobile (350px)"
    - Button: "Tablet (600px)"
    - Button: "Desktop (800px)"
    - Toggle: "Show positioning guides"

    Behavior:
    - Changing width slider resizes the simulated container
    - Inner MicroSim calls windowResized() and adapts
    - Shows elements repositioning in real-time
    - Guides show anchor points and relative positions

    Educational annotations:
    - "centerX = width/2" label following center point
    - "rightEdge = width - margin" label at right
    - "Slider stretches with width" annotation

    Color scheme:
    - Container frame: dark gray
    - Resize handle: blue
    - Position guides: red dashed lines
    - Annotations: green

    Implementation: p5.js with simulated resize behavior
</details>

### Making Sliders Responsive

Sliders need special attention in responsive layouts:

```javascript
let speedSlider;
let sliderLeftMargin = 100;

function setup() {
  updateCanvasSize();
  createCanvas(canvasWidth, canvasHeight);

  speedSlider = createSlider(1, 10, 5);
  repositionSlider();
}

function repositionSlider() {
  speedSlider.position(sliderLeftMargin, drawHeight + 15);
  speedSlider.size(canvasWidth - sliderLeftMargin - 50);  // Adaptive width
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  repositionSlider();  // Resize slider too!
}
```

## Layout Comparison: Choosing the Right Pattern

Here's a quick reference for selecting the appropriate layout:

| Layout | Best For | Container Width | Complexity |
|--------|----------|-----------------|------------|
| **Standard** | Simple simulations | Any | Low |
| **Two-Column** | Visualization + graph | Wide (500px+) | Medium |
| **Fixed** | Precise positioning | Fixed containers | Low |
| **Responsive** | Web embedding | Variable | Medium |

### Decision Flowchart

1. **Is precise pixel positioning critical?** → Use Fixed Layout
2. **Do you need two simultaneous views?** → Use Two-Column Layout
3. **Will this be embedded in various containers?** → Use Responsive Layout
4. **None of the above?** → Use Standard Layout

## Putting It All Together: The Polished MicroSim

Here's a complete example demonstrating professional layout practices:

```javascript
// Professional MicroSim Template
// Demonstrates: architecture, regions, dimensions, responsive layout

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 350;
let controlHeight = 75;  // Extra height for two rows of controls
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 100;

// Simulation variables
let ball = { x: 200, y: 175, vx: 3, vy: 2 };
let speedSlider, sizeSlider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Create controls
  speedSlider = createSlider(1, 10, 5, 0.5);
  sizeSlider = createSlider(10, 50, 25, 1);
  repositionControls();

  describe('Bouncing ball with speed and size controls, responsive layout');
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = max(300, container.offsetWidth);
  }
  canvasHeight = drawHeight + controlHeight;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  repositionControls();
}

function repositionControls() {
  const sliderWidth = canvasWidth - sliderLeftMargin - 60;

  speedSlider.position(sliderLeftMargin, drawHeight + 12);
  speedSlider.size(sliderWidth);

  sizeSlider.position(sliderLeftMargin, drawHeight + 42);
  sizeSlider.size(sliderWidth);
}

function draw() {
  // === DRAWING REGION ===
  background(240, 248, 255);  // Alice blue

  // Update physics
  let speed = speedSlider.value();
  ball.x += ball.vx * speed * 0.2;
  ball.y += ball.vy * speed * 0.2;

  // Bounce off margins
  let radius = sizeSlider.value() / 2;
  if (ball.x < margin + radius || ball.x > canvasWidth - margin - radius) {
    ball.vx *= -1;
    ball.x = constrain(ball.x, margin + radius, canvasWidth - margin - radius);
  }
  if (ball.y < margin + radius || ball.y > drawHeight - margin - radius) {
    ball.vy *= -1;
    ball.y = constrain(ball.y, margin + radius, drawHeight - margin - radius);
  }

  // Draw ball
  fill(100, 150, 255);
  stroke(50, 100, 200);
  strokeWeight(2);
  circle(ball.x, ball.y, sizeSlider.value());

  // === CONTROL REGION ===
  fill(255);
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Divider
  stroke(220);
  strokeWeight(1);
  line(0, drawHeight, canvasWidth, drawHeight);

  // Labels and values
  fill(60);
  noStroke();
  textSize(14);
  textAlign(LEFT, CENTER);

  // Speed control
  text("Speed:", margin, drawHeight + 25);
  textAlign(RIGHT, CENTER);
  text(speedSlider.value().toFixed(1), canvasWidth - margin, drawHeight + 25);

  // Size control
  textAlign(LEFT, CENTER);
  text("Size:", margin, drawHeight + 55);
  textAlign(RIGHT, CENTER);
  text(sizeSlider.value() + "px", canvasWidth - margin, drawHeight + 55);
}
```

## Key Takeaways

You now have the knowledge to make your MicroSims look like a million bucks:

1. **MicroSim Architecture** divides the canvas into a drawing region and control region for clarity.

2. The **Drawing Region** hosts your visualization with a consistent alice blue background.

3. The **Control Region** provides a clean white space for sliders, buttons, and labels.

4. Use **named dimension variables** (`canvasWidth`, `drawHeight`, `controlHeight`, `canvasHeight`) for readable, maintainable code.

5. The **margin variable** creates breathing room that separates amateur layouts from professional ones.

6. The **Standard Layout** is your default—simple, clean, effective.

7. Use **Two-Column Layout** when you need side-by-side visualization and data display.

8. **Fixed Layout** offers complete predictability at the cost of adaptability.

9. **Responsive Layout** adapts gracefully to any container width using `windowResized()` and `updateCanvasSize()`.

10. The **push/translate/pop** pattern enables working in local coordinates for multi-column layouts.

11. **Sliders must be repositioned** when the canvas resizes—don't forget `repositionControls()`!

12. Professional polish comes from **consistent spacing**, **proper alignment**, and **attention to detail**.

??? question "Challenge: Identify the layout type"
    Look at three MicroSims on the gallery page. For each one, identify whether it uses Standard, Two-Column, Fixed, or Responsive layout. What clues helped you determine the layout type?

## Next Steps

Your MicroSims now have professional architecture and layout. In the next chapter, we'll add **interactive controls**—sliders, buttons, and more—that bring your simulations to life and let users explore parameters hands-on.

Remember: the difference between good and great is in the details. Take time to polish your layouts, and your simulations will command the respect they deserve.

## References

- [p5.js Canvas Reference](https://p5js.org/reference/#/p5/createCanvas) - Canvas creation and sizing
- [Responsive Web Design Principles](https://web.dev/responsive-web-design-basics/) - Foundation for responsive layouts
- [Visual Design Principles](https://www.interaction-design.org/literature/topics/visual-design) - Spacing, alignment, hierarchy
- [MkDocs Material Layout](https://squidfunk.github.io/mkdocs-material/) - Container widths for textbook embedding
