---
title: Responsive Design Techniques
description: Master the art of creating MicroSims that adapt gracefully to any screen size
generated_by: claude skill chapter-content-generator
date: 2025-01-25 17:30:00
version: 0.03
---

# Responsive Design Techniques

## Summary

This chapter teaches techniques for making MicroSims adapt to different screen sizes and container widths. You will learn to use windowResized() and updateCanvasSize() functions to handle browser resizing, work with container width for responsive calculations, and implement relative positioning instead of absolute coordinates. The chapter covers the push(), pop(), and translate() functions for element grouping and coordinate translation, enabling you to create MicroSims that work well on both narrow textbook pages and fullscreen displays.

## Concepts Covered

This chapter covers the following 11 concepts from the learning graph:

1. windowResized()
2. updateCanvasSize()
3. Container Width
4. Relative Positioning
5. Responsive Width
6. Dynamic Scaling
7. push() Function
8. pop() Function
9. translate() Function
10. Element Grouping
11. Coordinate Translation

## Prerequisites

This chapter builds on concepts from:

- [Chapter 3: Getting Started with p5.js](../03-getting-started-with-p5js/index.md)
- [Chapter 6: MicroSim Architecture and Layout](../06-microsim-architecture-and-layout/index.md)
- [Chapter 7: User Interface Controls and Events](../07-user-interface-controls-and-events/index.md)

---

## The Pro Test: Just Resize the Window

Want to know one of the quickest ways to tell a real professional from a rookie? Just resize the browser window.

Watch what happens to the interface. Do the elements move gracefully together, like **dancers on a stage**, flowing smoothly as the space contracts and expands? Or do they remain **frozen like statues**, rigidly pinned to the left edge of a vast, empty landscape?

That simple test reveals everything about how much care went into the design. Amateur MicroSims look acceptable at one specific window size—the size they were designed on—but fall apart the moment the user resizes their browser or views them on a different device. Professional MicroSims adapt fluidly to any container, maintaining proportions, keeping elements aligned, and ensuring the experience remains excellent regardless of screen dimensions.

!!! tip "The Responsive Mindset"
    Every time you place an element on the canvas, ask yourself: "Will this still look right if the window is twice as wide? Half as wide?" If the answer is no, you're using the wrong positioning strategy.

The key to this elegant dance lies in implementing **responsive rules**—patterns where components intelligently change their positions, sizes, and relationships as the window is resized. This chapter will teach you to think responsively and create MicroSims that work beautifully everywhere.

## Understanding Responsive Width

**Responsive width** is the principle that your MicroSim's horizontal dimension should adapt to its container rather than remaining fixed. In the context of educational content, your MicroSim might appear in:

- A narrow sidebar (300-400 pixels)
- A textbook page with margins (500-700 pixels)
- A fullscreen presentation (1920+ pixels)

| Display Context | Typical Width | Challenge |
|----------------|---------------|-----------|
| Mobile phone | 320-480px | Extreme compression |
| Textbook column | 500-700px | Standard educational context |
| Tablet | 768-1024px | Medium flexibility |
| Desktop sidebar | 300-400px | Narrow constraint |
| Fullscreen | 1200-1920px | Expanded space |

A truly responsive MicroSim handles all of these gracefully. The core technique involves calculating positions and sizes relative to the current canvas width rather than using fixed pixel values.

### Fixed vs. Responsive Positioning

Consider placing a title centered at the top of your canvas:

**Fixed positioning (rookie approach):**
```javascript
text("Simulation Title", 200, 30);  // Works only if canvas is ~400px wide
```

**Responsive positioning (professional approach):**
```javascript
text("Simulation Title", width / 2, margin);  // Centered at any width
```

The difference seems small, but it cascades through every element in your simulation. Use fixed values, and your entire layout breaks when conditions change. Use relative values, and the layout maintains its relationships at any size.

## Container Width: Knowing Your Boundaries

**Container width** refers to the actual width available to your MicroSim in its embedding context. When a MicroSim is embedded in an iframe within a textbook page, the container might be narrower than you expect. Your code must detect this and adapt.

### Detecting Container Width

```javascript
function updateCanvasSize() {
  // Get the parent container's width
  let container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
  } else {
    canvasWidth = windowWidth;  // Fallback to full window
  }

  // Enforce minimum and maximum widths
  canvasWidth = constrain(canvasWidth, 300, 1200);
}
```

### The Container Detection Pattern

```javascript
let canvasWidth = 400;  // Default width
let drawHeight = 350;
let controlHeight = 50;

function setup() {
  updateCanvasSize();
  createCanvas(canvasWidth, drawHeight + controlHeight);
  // Position canvas in the document
  let canvas = document.querySelector('canvas');
  canvas.parentElement.style.display = 'flex';
  canvas.parentElement.style.justifyContent = 'center';
}

function updateCanvasSize() {
  let container = document.querySelector('main');
  canvasWidth = container ? container.offsetWidth : windowWidth;
  canvasWidth = constrain(canvasWidth, 300, 1200);
}
```

This pattern ensures your MicroSim never exceeds its container and never shrinks below a usable minimum.

## The windowResized() Function

The `windowResized()` function is a p5.js event handler that fires automatically whenever the browser window changes size. This is your hook for triggering responsive adjustments.

### Basic windowResized() Pattern

```javascript
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, drawHeight + controlHeight);
  repositionControls();
  redraw();
}
```

### What Happens During Resize

When the user resizes the browser:

1. Browser fires a resize event
2. p5.js catches it and calls your `windowResized()` function
3. You recalculate the canvas size
4. You call `resizeCanvas()` to update the canvas dimensions
5. You reposition any controls (sliders, buttons)
6. You trigger a `redraw()` to render with new dimensions

| Step | Function | Purpose |
|------|----------|---------|
| 1 | `windowResized()` | Event handler triggered |
| 2 | `updateCanvasSize()` | Calculate new dimensions |
| 3 | `resizeCanvas()` | Update canvas element |
| 4 | `repositionControls()` | Move sliders and buttons |
| 5 | `redraw()` | Render the updated layout |

### Debouncing Resize Events

During active resizing, the browser fires many resize events in rapid succession. To avoid performance issues, you can debounce—wait until resizing stops before recalculating:

```javascript
let resizeTimer;

function windowResized() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, drawHeight + controlHeight);
    repositionControls();
    redraw();
  }, 100);  // Wait 100ms after last resize event
}
```

## The updateCanvasSize() Function

The `updateCanvasSize()` function is a custom helper that centralizes all canvas dimension calculations. This pattern keeps your resize logic organized and maintainable.

### Complete updateCanvasSize() Implementation

```javascript
function updateCanvasSize() {
  // Get container width
  let container = document.querySelector('main');
  canvasWidth = container ? container.offsetWidth : windowWidth;

  // Apply constraints
  canvasWidth = constrain(canvasWidth, 300, 1200);

  // Calculate dependent values
  canvasHeight = drawHeight + controlHeight;

  // Update margins relative to width
  margin = canvasWidth * 0.05;  // 5% margins

  // Update font sizes relative to width
  titleSize = constrain(canvasWidth / 20, 14, 32);
  labelSize = constrain(canvasWidth / 30, 10, 16);

  // Calculate drawing area boundaries
  leftBound = margin;
  rightBound = canvasWidth - margin;
  drawableWidth = rightBound - leftBound;
}
```

### Calculating Relative Sizes

The key insight is that many visual properties should scale with canvas width:

```javascript
// Font sizes
let titleSize = map(canvasWidth, 300, 1200, 18, 36);
let labelSize = map(canvasWidth, 300, 1200, 10, 16);

// Element sizes
let buttonWidth = canvasWidth * 0.15;  // 15% of canvas width
let circleRadius = min(canvasWidth, drawHeight) * 0.1;  // 10% of smaller dimension

// Spacing
let elementGap = canvasWidth * 0.02;  // 2% spacing between elements
```

#### Diagram: Responsive Calculation Flowchart

<details markdown="1">
    <summary>Responsive Calculation Flow</summary>
    Type: diagram

    Purpose: Show how window resize triggers cascading recalculations (Bloom: Understand)

    Layout: Top-down flowchart

    Components:
    1. Trigger (top):
       - "Browser Resize Event" (rounded rectangle, blue)

    2. Event Handler:
       - "windowResized()" function box

    3. Calculations (middle section):
       - "updateCanvasSize()" box containing:
         - "Get container width"
         - "Apply constraints (min/max)"
         - "Calculate margins"
         - "Calculate font sizes"
         - "Calculate positions"

    4. Updates (bottom section):
       - "resizeCanvas()" - update HTML canvas element
       - "repositionControls()" - move DOM elements
       - "redraw()" - render new layout

    Flow arrows:
    - Browser Event → windowResized()
    - windowResized() → updateCanvasSize()
    - updateCanvasSize() → resizeCanvas()
    - resizeCanvas() → repositionControls()
    - repositionControls() → redraw()

    Annotations:
    - "Fires many times during active resize" near trigger
    - "Consider debouncing for performance" as side note
    - "All visual elements use updated values" near redraw

    Color scheme:
    - Event trigger: blue
    - Calculation functions: orange
    - Update functions: green
    - Arrows: gray

    Implementation: Mermaid.js or static SVG
</details>

## Relative Positioning

**Relative positioning** means placing elements based on proportional relationships rather than fixed coordinates. Every x and y value should be expressed as a function of canvas dimensions or other elements.

### The Relative Positioning Mindset

Instead of thinking "place this at (200, 150)", think:

- "Place this at 50% of the width, 40% of the height"
- "Place this 20 pixels from the right edge"
- "Place this below the previous element with 10% spacing"

### Common Relative Positioning Patterns

```javascript
// Center horizontally
let centerX = width / 2;

// Center vertically in drawing area
let centerY = drawHeight / 2;

// Right-aligned with margin
let rightX = width - margin;

// Bottom of drawing area
let bottomY = drawHeight - margin;

// Percentage positioning
let quarterX = width * 0.25;
let threeQuarterY = drawHeight * 0.75;

// Relative to another element
let label2Y = label1Y + lineHeight * 1.5;
```

### Positioning Controls Responsively

Sliders and buttons need special attention because they're DOM elements with their own positioning:

```javascript
function repositionControls() {
  // Position slider to fill available space
  let sliderLeft = sliderLabelWidth + margin;
  let sliderWidth = canvasWidth - sliderLeft - valueDisplayWidth - margin;

  speedSlider.position(sliderLeft, drawHeight + 15);
  speedSlider.size(sliderWidth);

  // Position buttons evenly spaced
  let buttonSpacing = canvasWidth / 4;
  startButton.position(buttonSpacing * 1 - 30, drawHeight + 10);
  pauseButton.position(buttonSpacing * 2 - 30, drawHeight + 10);
  resetButton.position(buttonSpacing * 3 - 30, drawHeight + 10);
}
```

#### Diagram: Responsive vs Fixed Positioning MicroSim

<details markdown="1">
    <summary>Responsive vs Fixed Positioning Comparison</summary>
    Type: microsim

    Learning objective: Demonstrate visually how responsive positioning adapts to different widths while fixed positioning fails (Bloom: Understand, Analyze)

    Canvas layout:
    - Drawing area: responsive width × 300 pixels
    - Control area: 50 pixels

    Visual elements:
    - Split view showing two layouts side by side:
      - Left half: "Fixed Positioning" example
      - Right half: "Responsive Positioning" example
    - Both halves show identical elements:
      - Title text
      - Three circles in a row
      - Labels below circles
      - Value display in corner

    Fixed side behavior:
    - Title at position (200, 30) - absolute
    - Circles at (100, 150), (200, 150), (300, 150) - absolute
    - Labels at fixed positions
    - As width changes: elements clip, overlap, or have huge gaps

    Responsive side behavior:
    - Title at (width/4, 30) - centered in half
    - Circles at (width*0.1, 150), (width*0.25, 150), (width*0.4, 150) - proportional
    - Labels relative to circles
    - As width changes: elements maintain proportional spacing

    Interactive controls:
    - Slider: "Canvas Width" (400-1000px)
    - Live width display showing current value
    - "Reset to 600px" button

    Behavior:
    - Dragging slider resizes canvas width
    - Fixed side becomes increasingly broken at extreme widths
    - Responsive side maintains proportions throughout
    - Annotations highlight problems as they occur

    Educational annotations:
    - When width < 500: "Fixed elements overlap!" on left side
    - When width > 800: "Fixed elements lost in empty space!" on left side
    - Continuous: "Responsive elements maintain relationships" on right side

    Color scheme:
    - Fixed side: red-tinted background (warning)
    - Responsive side: green-tinted background (success)
    - Elements: blue circles, black labels

    Implementation: p5.js with slider controlling canvas width
</details>

## Dynamic Scaling

**Dynamic scaling** extends relative positioning to element sizes. Not only should positions adapt, but the visual elements themselves should scale appropriately.

### When to Scale Elements

| Element Type | Scaling Approach |
|-------------|------------------|
| Text (titles) | Scale with canvas width |
| Text (labels) | Scale with canvas width, with min/max constraints |
| Shapes (decorative) | Scale proportionally |
| Shapes (functional) | May have minimum sizes for usability |
| Line weights | Scale subtly or remain constant |
| Margins/padding | Scale with canvas width |

### Scaling Calculations

```javascript
function calculateScaledSizes() {
  // Scale factor based on canvas width
  let scaleFactor = canvasWidth / 600;  // 600 is "reference" width

  // Title scales from 18px (at 300px) to 36px (at 1200px)
  titleSize = map(canvasWidth, 300, 1200, 18, 36);

  // Circles scale but maintain minimum size
  circleRadius = max(20, canvasWidth * 0.08);

  // Stroke weight scales subtly
  strokeWeight(max(1, scaleFactor * 2));

  // Text sizes with constraints
  labelSize = constrain(canvasWidth / 30, 12, 18);
}
```

### The Reference Width Pattern

Design your MicroSim at a "reference width" (commonly 600px), then scale all values from that baseline:

```javascript
const REFERENCE_WIDTH = 600;

function getScaledValue(baseValue) {
  return baseValue * (canvasWidth / REFERENCE_WIDTH);
}

// Usage
let scaledMargin = getScaledValue(25);
let scaledRadius = getScaledValue(40);
let scaledFontSize = getScaledValue(16);
```

## Coordinate Translation with translate()

The `translate()` function shifts the entire coordinate system to a new origin. Instead of calculating complex offsets for every element, you translate once and then draw using simple local coordinates.

### How translate() Works

```javascript
// Without translate - calculating positions manually
rect(200 + 10, 150 + 10, 80, 60);
ellipse(200 + 50, 150 + 40, 20, 20);
text("Label", 200 + 10, 150 + 80);

// With translate - cleaner code
translate(200, 150);
rect(10, 10, 80, 60);
ellipse(50, 40, 20, 20);
text("Label", 10, 80);
```

After `translate(200, 150)`, the point (0, 0) is now at what was (200, 150). All subsequent drawing commands use coordinates relative to this new origin.

### translate() for Responsive Groups

The real power emerges when moving entire groups of elements:

```javascript
// Draw a control panel that can be positioned anywhere
function drawControlPanel(x, y) {
  translate(x, y);

  // All elements drawn relative to (0, 0) which is now at (x, y)
  fill(240);
  rect(0, 0, 150, 100);

  fill(0);
  textSize(14);
  text("Controls", 10, 20);

  // Button at local position
  fill(100, 150, 255);
  rect(10, 40, 60, 25);

  // Label
  fill(255);
  text("Start", 25, 58);
}
```

## Element Grouping with push() and pop()

The `push()` and `pop()` functions create a **transformation stack** that isolates coordinate changes and style settings. This is essential for clean, modular responsive code.

### The push()/pop() Pattern

```javascript
function draw() {
  background(240);

  // Draw first group
  push();
    translate(50, 50);
    fill(255, 0, 0);
    rect(0, 0, 100, 100);  // Red square at (50, 50)
  pop();  // Coordinate system restored

  // Draw second group - unaffected by previous translate
  push();
    translate(200, 50);
    fill(0, 0, 255);
    rect(0, 0, 100, 100);  // Blue square at (200, 50)
  pop();

  // We're back at original coordinates
  fill(0);
  text("Original origin", 10, 200);
}
```

### What push() and pop() Save

The `push()` function saves the current:

- Transformation matrix (translate, rotate, scale)
- Fill color
- Stroke color
- Stroke weight
- Text size, alignment, font
- Tint
- Blend mode

When you call `pop()`, all of these are restored to their previous values.

### Nested Groups

Groups can be nested for complex hierarchies:

```javascript
function draw() {
  push();
    translate(width / 2, height / 2);  // Center of canvas

    push();
      rotate(angle);
      translate(100, 0);  // Orbit radius
      fill(255, 200, 0);
      ellipse(0, 0, 30, 30);  // Sun
    pop();

    push();
      rotate(angle * 2);
      translate(50, 0);
      fill(100, 100, 255);
      ellipse(0, 0, 20, 20);  // Planet
    pop();

  pop();

  // Back to original coordinates
  drawUI();
}
```

#### Diagram: push/pop Coordinate Stack MicroSim

<details markdown="1">
    <summary>push/pop Coordinate Stack Visualization</summary>
    Type: microsim

    Learning objective: Visualize how push() and pop() manage the transformation stack (Bloom: Understand, Analyze)

    Canvas layout:
    - Drawing area: 500x350 pixels
    - Control area: 50 pixels

    Visual elements:
    - Left side: Interactive canvas showing shapes being drawn
    - Right side: Stack visualization showing transformation states

    Stack visualization:
    - Vertical stack of "cards" representing saved states
    - Each card shows: (x, y) origin, rotation, fill color
    - Cards animate sliding on/off the stack
    - Current state highlighted at top

    Interactive features:
    - "Execute" button steps through code line by line
    - "Reset" returns to initial state
    - "Auto Play" runs through code automatically
    - Speed slider for auto play

    Code display:
    - Shows sample code with current line highlighted
    - push() lines turn green when executed
    - pop() lines turn red when executed
    - translate/fill/rect lines turn blue

    Sample code to execute:
    ```
    push();           // Save state 1
    translate(100, 50);
    fill(255, 0, 0);
    rect(0, 0, 40, 40);
    push();           // Save state 2
    translate(50, 50);
    fill(0, 255, 0);
    rect(0, 0, 30, 30);
    pop();            // Restore state 2
    fill(0, 0, 255);
    rect(50, 0, 35, 35);
    pop();            // Restore state 1
    rect(0, 0, 50, 50);
    ```

    Behavior:
    - Each step shows which line executes
    - Canvas updates to show drawn shapes
    - Stack visualization updates to show saves/restores
    - Origin marker moves to show current coordinate system

    Educational annotations:
    - "push() saves current state to stack"
    - "pop() restores most recent saved state"
    - "Notice how origin jumps back after pop()"

    Color scheme:
    - Stack cards: light blue with dark borders
    - Current line: yellow highlight
    - Origin marker: purple crosshairs

    Implementation: p5.js with step-through animation
</details>

## Coordinate Translation in Practice

Combining `translate()` with `push()`/`pop()` creates a powerful pattern for responsive element grouping.

### The Group Drawing Pattern

```javascript
function drawGroup(x, y, groupWidth, groupHeight) {
  push();
    translate(x, y);

    // All coordinates relative to group origin (0, 0)
    fill(245);
    stroke(200);
    rect(0, 0, groupWidth, groupHeight);

    // Title centered at top of group
    fill(0);
    noStroke();
    textAlign(CENTER, TOP);
    textSize(14);
    text("Group Title", groupWidth / 2, 5);

    // Content area
    let contentTop = 25;
    let contentHeight = groupHeight - contentTop - 10;

    stroke(220);
    noFill();
    rect(5, contentTop, groupWidth - 10, contentHeight);

  pop();
}
```

### Responsive Two-Column Layout

Using groups enables sophisticated responsive layouts:

```javascript
function draw() {
  background(240, 248, 255);

  // Calculate responsive column widths
  let gap = 10;
  let columnWidth = (canvasWidth - gap * 3) / 2;

  // Left column - Simulation
  push();
    translate(gap, gap);
    drawSimulationPanel(columnWidth, drawHeight - gap * 2);
  pop();

  // Right column - Data Display
  push();
    translate(gap * 2 + columnWidth, gap);
    drawDataPanel(columnWidth, drawHeight - gap * 2);
  pop();

  // Control region spans full width
  drawControlRegion();
}
```

### Moving Groups Responsively

The beauty of this approach: to move an entire group, you only change the `translate()` call:

```javascript
function draw() {
  // Calculate responsive position
  let panelX = canvasWidth * 0.6;  // 60% from left
  let panelY = drawHeight * 0.1;   // 10% from top
  let panelW = canvasWidth * 0.35;  // 35% of width
  let panelH = drawHeight * 0.8;    // 80% of height

  push();
    translate(panelX, panelY);
    drawInfoPanel(panelW, panelH);  // Everything inside uses local coords
  pop();
}
```

## Complete Responsive MicroSim Pattern

Here's a complete implementation combining all the techniques:

```javascript
// Responsive MicroSim Template
let canvasWidth = 600;
let drawHeight = 350;
let controlHeight = 50;
let canvasHeight;

// Responsive sizing variables
let margin, titleSize, labelSize;
let speedSlider;

function setup() {
  updateCanvasSize();
  canvasHeight = drawHeight + controlHeight;

  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Create slider
  speedSlider = createSlider(1, 10, 5, 0.5);
  repositionControls();

  describe('A responsive MicroSim demonstrating adaptive layout', LABEL);
}

function updateCanvasSize() {
  // Get container width
  let container = document.querySelector('main');
  canvasWidth = container ? container.offsetWidth : windowWidth;
  canvasWidth = constrain(canvasWidth, 300, 1000);

  // Calculate responsive values
  margin = canvasWidth * 0.05;
  titleSize = map(canvasWidth, 300, 1000, 16, 28);
  labelSize = map(canvasWidth, 300, 1000, 10, 14);
}

function repositionControls() {
  let sliderX = margin + 60;
  let sliderY = drawHeight + 15;
  let sliderWidth = canvasWidth - sliderX - margin - 40;

  speedSlider.position(sliderX, sliderY);
  speedSlider.size(sliderWidth);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, drawHeight + controlHeight);
  repositionControls();
  redraw();
}

function draw() {
  // Drawing region
  background(240, 248, 255);

  // Draw content using responsive coordinates
  push();
    // Main content area
    translate(margin, margin);
    let contentWidth = canvasWidth - margin * 2;
    let contentHeight = drawHeight - margin * 2;

    // Title
    fill(0);
    textSize(titleSize);
    textAlign(CENTER, TOP);
    text("Responsive MicroSim", contentWidth / 2, 0);

    // Demo element - circle that scales
    let circleX = contentWidth / 2;
    let circleY = contentHeight / 2;
    let circleR = min(contentWidth, contentHeight) * 0.2;

    fill(100, 150, 255);
    stroke(50, 100, 200);
    strokeWeight(2);
    ellipse(circleX, circleY, circleR * 2);

  pop();

  // Control region
  fill(255);
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Divider line
  stroke(200);
  line(0, drawHeight, canvasWidth, drawHeight);

  // Slider label
  fill(0);
  noStroke();
  textSize(labelSize);
  textAlign(LEFT, CENTER);
  text("Speed:", margin, drawHeight + 25);

  // Value display
  textAlign(RIGHT, CENTER);
  text(speedSlider.value().toFixed(1), canvasWidth - margin, drawHeight + 25);
}
```

#### Diagram: Complete Responsive Layout MicroSim

<details markdown="1">
    <summary>Complete Responsive Layout Demonstration</summary>
    Type: microsim

    Learning objective: Provide a fully functional example demonstrating all responsive techniques together (Bloom: Apply, Analyze)

    Canvas layout:
    - Drawing area: responsive width × 400 pixels
    - Control area: 80 pixels (two rows)

    Visual elements:
    - Main simulation area with:
      - Centered title (scales with width)
      - Three animated bouncing balls (positions relative)
      - Data display panel (positioned responsively)
      - Current width indicator
    - Margin indicators (visible lines showing margins)

    Interactive controls:
    Row 1:
    - Button: "Show Margins" (toggles margin visualization)
    - Button: "Show Grid" (toggles percentage grid overlay)
    - Button: "Reset"

    Row 2:
    - Slider: "Ball Size" (affects all balls proportionally)
    - Speed: display only (shows current animation speed)

    Behavior:
    - Balls bounce within margins, positions calculated relatively
    - All text scales with canvas width
    - Margin visualization shows the responsive spacing
    - Grid overlay shows 25% intervals
    - Entire layout adapts smoothly during resize

    Margin visualization mode:
    - Red dashed lines showing margin boundaries
    - Corner indicators showing margin values
    - Shaded margin areas

    Grid overlay mode:
    - Light gray lines at 25%, 50%, 75% of width/height
    - Labels showing percentage values
    - Helps visualize proportional positioning

    Educational emphasis:
    - Shows width value updating during resize
    - Demonstrates all elements maintaining relationships
    - Clear visualization of responsive principles in action

    Color scheme:
    - Balls: red, green, blue (primary colors)
    - Margins: light red shading when visible
    - Grid: light gray
    - Background: aliceblue

    Implementation: p5.js with full responsive pattern
</details>

## Common Responsive Patterns

### Pattern 1: Responsive Slider Row

```javascript
function createResponsiveSlider(label, min, max, defaultVal, y) {
  let labelWidth = 80;
  let valueWidth = 40;
  let sliderX = margin + labelWidth;
  let sliderWidth = canvasWidth - margin * 2 - labelWidth - valueWidth;

  let slider = createSlider(min, max, defaultVal, (max - min) / 100);
  slider.position(sliderX, y);
  slider.size(sliderWidth);

  return {
    slider: slider,
    label: label,
    y: y,
    reposition: function() {
      sliderWidth = canvasWidth - margin * 2 - labelWidth - valueWidth;
      slider.position(margin + labelWidth, this.y);
      slider.size(sliderWidth);
    },
    draw: function() {
      fill(0);
      textSize(labelSize);
      textAlign(LEFT, CENTER);
      text(this.label + ":", margin, this.y + 10);
      textAlign(RIGHT, CENTER);
      text(this.slider.value().toFixed(1), canvasWidth - margin, this.y + 10);
    }
  };
}
```

### Pattern 2: Responsive Button Row

```javascript
function drawResponsiveButtonRow(buttons, y) {
  let buttonCount = buttons.length;
  let totalGap = canvasWidth * 0.1;  // 10% for gaps
  let buttonWidth = (canvasWidth - totalGap) / buttonCount;
  let gap = totalGap / (buttonCount + 1);

  for (let i = 0; i < buttonCount; i++) {
    let x = gap + i * (buttonWidth + gap);
    buttons[i].position(x, y);
    buttons[i].size(buttonWidth - 10, 30);
  }
}
```

### Pattern 3: Responsive Text Block

```javascript
function drawResponsiveText(content, x, y, maxWidth) {
  push();
    translate(x, y);
    textSize(labelSize);
    textAlign(LEFT, TOP);
    textWrap(WORD);
    text(content, 0, 0, maxWidth);
  pop();
}
```

## The Responsive Design Checklist

Before considering a MicroSim complete, verify:

| Requirement | Test |
|------------|------|
| **Positions are relative** | All x values use `width`, `canvasWidth`, or percentages |
| **Sizes scale** | Text and shapes scale with canvas dimensions |
| **Controls reposition** | Sliders and buttons adapt in `windowResized()` |
| **Minimum width respected** | MicroSim remains usable at 300-400px |
| **Maximum width respected** | MicroSim doesn't over-expand at 1200+px |
| **Groups use push/pop** | Related elements are isolated in transformation blocks |
| **No fixed magic numbers** | All pixel values derive from responsive calculations |

## Key Takeaways

You've learned the responsive design techniques that separate professional MicroSims from amateur ones:

1. **windowResized()** triggers responsive recalculation when the browser window changes size.

2. **updateCanvasSize()** centralizes all canvas dimension calculations for maintainability.

3. **Container width** detection ensures your MicroSim adapts to its embedding context.

4. **Relative positioning** expresses all coordinates as proportions of canvas dimensions.

5. **Responsive width** allows horizontal adaptation while maintaining vertical consistency.

6. **Dynamic scaling** adjusts element sizes proportionally to canvas dimensions.

7. **translate()** shifts the coordinate origin, simplifying position calculations.

8. **push() and pop()** create isolated transformation contexts for modular drawing.

9. **Element grouping** combines translate with push/pop for movable component groups.

10. **Coordinate translation** enables complex layouts with simple local coordinates.

11. All techniques combine to create MicroSims that work beautifully at any size.

??? question "Challenge: Make the Dancers Dance"
    Take a MicroSim you've created previously and apply responsive design techniques. Test it by resizing the window through the full range (300px to 1200px). Do your elements dance gracefully together, or do they stand frozen like statues? Fix any issues you find using the patterns from this chapter.

## Next Steps

You've mastered the art of responsive design—your MicroSims can now dance gracefully on any stage, from narrow mobile screens to expansive desktop displays. In the next chapter, we'll explore **animation and physics**, bringing your responsive layouts to life with smooth motion, realistic physics, and engaging visual dynamics.

Remember: the resize test doesn't lie. When your elements flow together like coordinated dancers rather than standing rigid like forgotten statues, you've achieved responsive design mastery.

## References

- [p5.js windowResized() Reference](https://p5js.org/reference/#/p5/windowResized) - Official documentation
- [p5.js Coordinate System](https://p5js.org/learn/coordinate-system-and-shapes.html) - Understanding canvas coordinates
- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design) - Web responsive principles
- [p5.js push() and pop()](https://p5js.org/reference/#/p5/push) - Transformation stack documentation
