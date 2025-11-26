---
title: Drawing, Animation, and Color
description: Master drawing primitives, text rendering, and color theory to create vibrant MicroSims
generated_by: claude skill chapter-content-generator
date: 2025-01-25 15:00:00
version: 0.03
---

# Drawing, Animation, and Color

## Summary

This chapter expands your p5.js skills with drawing primitives, text rendering, and color theory. You will learn to use stroke() for outlines, rect() for rectangles, ellipse() for circles and ovals, and line() for connecting points. The chapter covers text display with text(), textSize(), and textAlign() functions, and explores shape rendering techniques. You will also develop a deeper understanding of color theory and how to apply it effectively in your simulations.

## Concepts Covered

This chapter covers the following 10 concepts from the learning graph:

1. stroke()
2. rect()
3. ellipse()
4. line()
5. text()
6. textSize()
7. textAlign()
8. Drawing Primitives
9. Shape Rendering
10. Color Theory

## Prerequisites

This chapter builds on concepts from:

- [Chapter 3: Getting Started with p5.js](../03-getting-started-with-p5js/index.md)

---

## Welcome to the Most Colorful Chapter!

Get ready to paint with code! This chapter is where your MicroSims burst into life with vibrant colors, elegant shapes, and expressive text. By the time you finish, you'll have the skills to create your own **personal rainbow MicroSims**—interactive visualizations that dance with color and respond to your every input.

In p5.js, everything you see on the canvas is built from simple building blocks called **drawing primitives**. Just as an artist might use basic strokes to create a masterpiece, you'll combine rectangles, ellipses, lines, and text to craft educational simulations that are both beautiful and functional.

!!! tip "The Joy of Color"
    Color isn't just decoration—it's communication. The right colors can highlight important data, guide attention, create mood, and make learning more engaging. This chapter gives you complete control over the rainbow!

## Drawing Primitives: Your Visual Vocabulary

**Drawing primitives** are the fundamental shapes that form the foundation of all visual output in p5.js. Think of them as the alphabet of visual programming—simple on their own, but capable of creating infinite combinations when used together.

The core drawing primitives in p5.js include:

- **Rectangles** (`rect()`) - Four-sided shapes with right angles
- **Ellipses** (`ellipse()`) - Circles and ovals
- **Lines** (`line()`) - Straight connections between two points
- **Points** (`point()`) - Single pixels
- **Triangles** (`triangle()`) - Three-sided shapes
- **Arcs** (`arc()`) - Portions of ellipses
- **Quadrilaterals** (`quad()`) - Four-sided shapes with any angles

For MicroSims, we use rectangles, ellipses, and lines most frequently. Let's master each one!

## Rectangles with rect()

The `rect()` function draws rectangles—the workhorses of user interface design. Every button, slider background, control panel, and data display in our MicroSims uses rectangles.

### Basic Rectangle Syntax

```javascript
rect(x, y, width, height);
```

| Parameter | Description |
|-----------|-------------|
| `x` | X-coordinate of the top-left corner |
| `y` | Y-coordinate of the top-left corner |
| `width` | Width of the rectangle in pixels |
| `height` | Height of the rectangle in pixels |

### Rectangle Examples

```javascript
function setup() {
  createCanvas(400, 300);
  background(240, 248, 255);

  // Simple rectangle
  fill(255, 100, 100);  // Coral red
  rect(50, 50, 100, 80);

  // Square (equal width and height)
  fill(100, 255, 100);  // Bright green
  rect(200, 50, 80, 80);

  // Rounded rectangle (optional 5th parameter)
  fill(100, 100, 255);  // Soft blue
  rect(50, 180, 150, 60, 20);  // 20px corner radius
}
```

### Rounded Corners

Adding a fifth parameter creates rounded corners—perfect for modern, friendly-looking buttons:

```javascript
rect(x, y, width, height, radius);        // All corners same radius
rect(x, y, width, height, tl, tr, br, bl); // Individual corner radii
```

!!! info "Rectangle Mode"
    By default, `rect()` uses the top-left corner as the reference point. You can change this with `rectMode(CENTER)` to draw rectangles from their center—useful for centering shapes easily.

## Ellipses with ellipse()

The `ellipse()` function draws circles and ovals. While rectangles feel structured and mechanical, ellipses add organic, flowing elements to your designs.

### Basic Ellipse Syntax

```javascript
ellipse(x, y, width, height);
```

| Parameter | Description |
|-----------|-------------|
| `x` | X-coordinate of the center |
| `y` | Y-coordinate of the center |
| `width` | Width (horizontal diameter) |
| `height` | Height (vertical diameter) |

Note that unlike `rect()`, the `ellipse()` function draws from the **center** by default!

### Circle Shorthand

When width equals height, you get a perfect circle. p5.js also provides a convenient `circle()` function:

```javascript
// These are equivalent:
ellipse(200, 150, 100, 100);  // Circle using ellipse
circle(200, 150, 100);         // Circle using circle() - diameter is 100
```

### Colorful Ellipse Examples

```javascript
function setup() {
  createCanvas(400, 300);
  background(20, 20, 40);  // Dark background for color pop
  noStroke();

  // Rainbow circles
  fill(255, 0, 0);      // Red
  circle(80, 150, 60);

  fill(255, 127, 0);    // Orange
  circle(140, 150, 60);

  fill(255, 255, 0);    // Yellow
  circle(200, 150, 60);

  fill(0, 255, 0);      // Green
  circle(260, 150, 60);

  fill(0, 0, 255);      // Blue
  circle(320, 150, 60);
}
```

## Lines with line()

The `line()` function draws straight lines between two points. Lines are essential for connecting elements, drawing axes, creating grids, and showing relationships.

### Basic Line Syntax

```javascript
line(x1, y1, x2, y2);
```

| Parameter | Description |
|-----------|-------------|
| `x1, y1` | Starting point coordinates |
| `x2, y2` | Ending point coordinates |

### Line Style Control

Lines are styled using `stroke()` (color) and `strokeWeight()` (thickness):

```javascript
function setup() {
  createCanvas(400, 200);
  background(240, 248, 255);

  // Thin black line
  stroke(0);
  strokeWeight(1);
  line(50, 50, 350, 50);

  // Thick red line
  stroke(255, 0, 0);
  strokeWeight(5);
  line(50, 100, 350, 100);

  // Rainbow gradient effect (multiple lines)
  strokeWeight(3);
  for (let i = 0; i < 7; i++) {
    stroke(i * 40, 100, 255 - i * 30);
    line(50 + i * 10, 150, 350 - i * 10, 150);
  }
}
```

## The stroke() Function: Outlining Your Shapes

The `stroke()` function sets the color for lines and shape outlines. Every shape you draw has two color components:

- **Fill** - The interior color (set with `fill()`)
- **Stroke** - The outline color (set with `stroke()`)

### Stroke Syntax Options

```javascript
stroke(gray);              // Grayscale (0-255)
stroke(gray, alpha);       // Grayscale with transparency
stroke(r, g, b);           // RGB color
stroke(r, g, b, alpha);    // RGB with transparency
stroke('#FF5733');         // Hexadecimal color string
stroke(colorObject);       // p5.Color object
```

### Controlling Stroke Appearance

```javascript
strokeWeight(pixels);  // Line thickness
noStroke();            // Remove outline entirely
```

### Stroke Examples

```javascript
function setup() {
  createCanvas(400, 300);
  background(255);

  // Blue fill with thick red stroke
  fill(100, 150, 255);
  stroke(255, 0, 0);
  strokeWeight(4);
  rect(50, 50, 100, 80);

  // Yellow fill with no stroke
  fill(255, 255, 0);
  noStroke();
  ellipse(250, 90, 100, 80);

  // No fill, only stroke (wireframe)
  noFill();
  stroke(0, 200, 100);
  strokeWeight(2);
  rect(50, 180, 300, 60);
}
```

| Function | Purpose |
|----------|---------|
| `stroke(color)` | Set outline color |
| `strokeWeight(n)` | Set line thickness to n pixels |
| `noStroke()` | Remove outlines |
| `noFill()` | Remove fill (transparent interior) |

## Shape Rendering: How p5.js Draws

Understanding **shape rendering** helps you control exactly how your shapes appear. p5.js renders shapes in the order you write them—later shapes draw on top of earlier ones, like layers of paint.

### The Rendering Pipeline

When you call a drawing function like `rect()` or `ellipse()`, p5.js:

1. Checks the current fill color
2. Checks the current stroke color and weight
3. Calculates the shape geometry
4. Renders the fill area
5. Renders the stroke outline on top

This layered approach means you can create complex visuals by strategically ordering your drawing commands.

#### Diagram: Shape Rendering Order

<details markdown="1">
    <summary>Shape Rendering Order Demonstration</summary>
    Type: microsim

    Learning objective: Demonstrate how drawing order affects visual layering in p5.js (Bloom: Understand)

    Canvas layout:
    - Drawing area: 400x300 pixels with light gray background
    - Control area: 50 pixels for interactive buttons

    Visual elements:
    - Three overlapping circles in red, green, and blue
    - Circles positioned to overlap in center
    - Current drawing order displayed as text
    - Visual demonstration of "painter's algorithm"

    Interactive controls:
    - Three buttons: "Red First", "Green First", "Blue First"
    - Clicking changes which circle is drawn first/last
    - Shows how later shapes cover earlier ones

    Behavior:
    - Default: Red drawn first, then Green, then Blue (blue on top)
    - Clicking "Red First" draws red first (red on bottom)
    - Order text updates to show current sequence
    - Helps understand layering concept

    Color scheme:
    - Red circle: rgba(255, 0, 0, 200)
    - Green circle: rgba(0, 255, 0, 200)
    - Blue circle: rgba(0, 0, 255, 200)
    - Semi-transparent to show overlapping areas

    Implementation: p5.js with button controls
</details>

### Rendering Modes

p5.js provides different modes that change how coordinates are interpreted:

```javascript
rectMode(CORNER);   // Default: x,y is top-left corner
rectMode(CENTER);   // x,y is center of rectangle
rectMode(CORNERS);  // x,y and width,height are opposite corners

ellipseMode(CENTER);  // Default: x,y is center
ellipseMode(CORNER);  // x,y is top-left of bounding box
```

## Text Display with text(), textSize(), and textAlign()

Text is essential for MicroSims—labels, values, instructions, and feedback all rely on clear text rendering. p5.js provides powerful text functions that give you complete control over typography.

### The text() Function

```javascript
text(string, x, y);
text(string, x, y, maxWidth, maxHeight);  // With text box bounds
```

### Setting Text Size with textSize()

```javascript
textSize(pixels);  // Set font size in pixels
```

### Aligning Text with textAlign()

```javascript
textAlign(horizontalAlign);
textAlign(horizontalAlign, verticalAlign);
```

Horizontal alignment options:

- `LEFT` - Text starts at x position (default)
- `CENTER` - Text is centered on x position
- `RIGHT` - Text ends at x position

Vertical alignment options:

- `TOP` - Text top at y position
- `CENTER` - Text middle at y position
- `BOTTOM` - Text bottom at y position
- `BASELINE` - Text baseline at y position (default)

### Text Example: Labeled Controls

```javascript
function setup() {
  createCanvas(400, 200);
  background(240, 248, 255);

  // Large centered title
  fill(50, 50, 150);
  textSize(32);
  textAlign(CENTER, TOP);
  text("Welcome to p5.js!", width/2, 20);

  // Left-aligned label
  fill(0);
  textSize(16);
  textAlign(LEFT, CENTER);
  text("Speed:", 20, 100);

  // Right-aligned value
  textAlign(RIGHT, CENTER);
  text("50", 380, 100);

  // Small footer text
  textSize(12);
  textAlign(CENTER, BOTTOM);
  fill(128);
  text("Adjust the slider to change speed", width/2, height - 10);
}
```

| Function | Purpose | Common Values |
|----------|---------|---------------|
| `text(str, x, y)` | Display text at position | Any string |
| `textSize(n)` | Set font size | 12-48 for most uses |
| `textAlign(h, v)` | Set alignment | LEFT, CENTER, RIGHT |
| `textFont(font)` | Set typeface | 'Georgia', 'Courier' |

## Color Theory: The Science of Beautiful Palettes

Now we arrive at the heart of this colorful chapter: **color theory**. Understanding how colors work together transforms your MicroSims from functional to beautiful.

### The Color Wheel

The color wheel is a circular arrangement of colors showing relationships between primary, secondary, and tertiary colors.

#### Diagram: Interactive Color Wheel

<details markdown="1">
    <summary>Interactive Color Wheel Explorer</summary>
    Type: microsim

    Learning objective: Help students understand color relationships (complementary, analogous, triadic) through interactive exploration (Bloom: Understand, Analyze)

    Canvas layout:
    - Drawing area: 400x350 pixels with dark gray background
    - Control area: 50 pixels for mode selection

    Visual elements:
    - Large color wheel (300px diameter) in center
    - 12 color segments representing primary, secondary, tertiary colors
    - Interactive selector dot that moves around wheel
    - Display of selected color's RGB values
    - Harmony colors highlighted based on selected mode
    - Preview swatches showing the harmony palette

    Color wheel segments (clockwise from top):
    - Red (0°)
    - Red-Orange (30°)
    - Orange (60°)
    - Yellow-Orange (90°)
    - Yellow (120°)
    - Yellow-Green (150°)
    - Green (180°)
    - Blue-Green (210°)
    - Blue (240°)
    - Blue-Violet (270°)
    - Violet (300°)
    - Red-Violet (330°)

    Interactive controls:
    - Radio buttons or dropdown: "Complementary", "Analogous", "Triadic", "Split-Complementary"
    - Click on wheel to select a color
    - Drag selector around wheel

    Behavior by mode:
    - Complementary: Highlights color 180° opposite
    - Analogous: Highlights two adjacent colors
    - Triadic: Highlights colors 120° apart
    - Split-Complementary: Highlights two colors adjacent to complement

    Display elements:
    - Selected color swatch (large)
    - Harmony color swatches (smaller)
    - RGB/HSB values for selected color
    - Harmony name label

    Educational annotations:
    - Tooltips explaining each harmony type
    - "These colors create visual tension" for complementary
    - "These colors feel harmonious together" for analogous

    Implementation: p5.js with HSB color mode for easy angle-based color selection
</details>

### Color Harmonies

Color harmonies are combinations of colors that are aesthetically pleasing. Here are the most useful harmonies for MicroSim design:

| Harmony Type | Description | Best Use |
|-------------|-------------|----------|
| **Complementary** | Colors opposite on wheel | High contrast, emphasis |
| **Analogous** | Adjacent colors | Harmony, natural feel |
| **Triadic** | Three colors equally spaced | Vibrant, balanced |
| **Split-Complementary** | Base + two adjacent to complement | Contrast with less tension |
| **Monochromatic** | Single hue, varying brightness | Elegant, cohesive |

### HSB Color Mode: The Rainbow's Best Friend

While RGB is intuitive for mixing light, **HSB (Hue, Saturation, Brightness)** is far superior for creating rainbow effects and color harmonies.

```javascript
colorMode(HSB, 360, 100, 100);  // Hue: 0-360°, Sat: 0-100%, Bri: 0-100%
```

| HSB Component | Range | Meaning |
|--------------|-------|---------|
| **Hue** | 0-360 | Position on color wheel (red=0, green=120, blue=240) |
| **Saturation** | 0-100 | Color intensity (0=gray, 100=vivid) |
| **Brightness** | 0-100 | Light level (0=black, 100=full brightness) |

### Creating Rainbows with HSB

HSB makes rainbow generation trivially easy—just loop through hue values!

```javascript
function setup() {
  createCanvas(400, 200);
  colorMode(HSB, 360, 100, 100);
  noStroke();

  // Draw rainbow bars
  let barWidth = width / 360;
  for (let h = 0; h < 360; h++) {
    fill(h, 100, 100);  // Full saturation and brightness
    rect(h * barWidth, 0, barWidth + 1, height);
  }
}
```

This simple loop creates a full spectrum rainbow! The magic is that hue values map directly to positions on the color wheel.

## MicroSim: Your Personal Rainbow Generator

Now let's put everything together! This MicroSim lets you create your own rainbow patterns with interactive controls for every aspect of the color.

#### Diagram: Personal Rainbow Generator MicroSim

<details markdown="1">
    <summary>Personal Rainbow Generator MicroSim</summary>
    Type: microsim

    Learning objective: Apply color theory and drawing primitives to create personalized rainbow visualizations (Bloom: Apply, Create)

    Canvas layout:
    - Drawing area: 400x300 pixels with dark background (#1a1a2e)
    - Control area: 100 pixels for sliders and buttons

    Visual elements:
    - Rainbow arc or bars (user selectable)
    - Smooth color gradient using HSB color mode
    - Reflection effect below rainbow (optional toggle)
    - Particle/sparkle effects (optional)
    - Current palette preview strip

    Interactive controls:
    1. Slider: "Start Hue" (0-360) - Where rainbow begins
    2. Slider: "End Hue" (0-360) - Where rainbow ends
    3. Slider: "Saturation" (0-100) - Color vividness
    4. Slider: "Band Count" (3-24) - Number of color bands
    5. Toggle button: "Arc / Bars" - Shape style
    6. Toggle button: "Add Sparkles" - Particle effects
    7. Button: "Randomize" - Generate random palette
    8. Button: "Export" - Copy color values

    Rainbow styles:
    - Arc: Classic semi-circular rainbow using arc() function
    - Bars: Vertical color bars across canvas
    - Each style uses current slider values

    Animation features:
    - Subtle shimmer animation on colors
    - Floating sparkle particles when enabled
    - Smooth transitions when parameters change

    Behavior:
    - Adjusting Start/End Hue changes color range
    - Low saturation creates pastel rainbows
    - Band Count changes from smooth gradient to distinct bands
    - Randomize picks pleasing random values
    - Export shows array of hex color values

    Code structure:
    ```
    let startHue, endHue, saturation, bands;

    function setup() {
      createCanvas(400, 400);
      colorMode(HSB, 360, 100, 100);
      // Create sliders...
    }

    function draw() {
      background(26, 26, 46);

      let hueStep = (endHue - startHue) / bands;
      for (let i = 0; i < bands; i++) {
        let hue = startHue + i * hueStep;
        fill(hue, saturation, 100);
        // Draw arc or rect based on mode
      }
    }
    ```

    Educational emphasis:
    - Shows practical application of HSB color mode
    - Demonstrates how sliders control visual output
    - Encourages experimentation with color
    - Creates shareable, personalized results

    Accessibility:
    - describe() function for screen readers
    - High contrast control labels
    - Slider values displayed numerically

    Implementation: p5.js with createSlider() and createButton()
</details>

This MicroSim brings together everything in this chapter: rectangles for the control area, ellipses/arcs for the rainbow shape, lines for accents, text for labels, stroke for outlines, and color theory for beautiful palettes!

## MicroSim: Shape Playground

Before creating complex simulations, it helps to experiment with drawing primitives in an interactive environment.

#### Diagram: Shape Playground MicroSim

<details markdown="1">
    <summary>Interactive Shape Playground</summary>
    Type: microsim

    Learning objective: Practice using drawing primitives (rect, ellipse, line) with immediate visual feedback (Bloom: Apply)

    Canvas layout:
    - Drawing area: 400x300 pixels with light background
    - Control area: 100 pixels for shape selection and parameters

    Visual elements:
    - Currently selected shape rendered at mouse position or center
    - Shape preview panel showing all available shapes
    - Parameter values displayed in real-time
    - Grid overlay (toggleable) for positioning reference

    Interactive controls:
    1. Radio buttons: "Rectangle", "Ellipse", "Line", "Triangle"
    2. Slider: "Width" (10-200)
    3. Slider: "Height" (10-200)
    4. Slider: "Fill Hue" (0-360, HSB mode)
    5. Slider: "Stroke Weight" (0-10)
    6. Checkbox: "Show Grid"
    7. Button: "Random Shape"

    Behavior:
    - Selected shape follows mouse in drawing area
    - Clicking stamps shape at current position
    - Sliders update shape properties in real-time
    - Grid helps understand coordinate positioning
    - Clear button removes all stamped shapes

    Shape-specific behavior:
    - Rectangle: width and height as set
    - Ellipse: width and height as set
    - Line: click and drag to set endpoints
    - Triangle: three clicks to set vertices

    Display text:
    - Current mouse coordinates
    - Shape function call (e.g., "rect(156, 89, 80, 60)")
    - This teaches syntax while experimenting

    Color scheme:
    - Drawing area: white with optional grid
    - Control area: light gray
    - Grid lines: very light gray (#EEEEEE)

    Educational emphasis:
    - Shows exact function calls for shapes
    - Builds intuition for coordinates
    - Encourages experimentation

    Implementation: p5.js with radio buttons and sliders
</details>

## Combining Primitives: Building Complex Shapes

Real MicroSims combine multiple primitives to create meaningful visualizations. Here's how to think about composition:

### Layered Construction

Build complex shapes from simple ones, drawing background elements first:

```javascript
function drawButton(x, y, w, h, label) {
  // Shadow layer (drawn first, appears behind)
  fill(100);
  noStroke();
  rect(x + 3, y + 3, w, h, 8);

  // Button body
  fill(70, 130, 220);
  stroke(50, 100, 180);
  strokeWeight(2);
  rect(x, y, w, h, 8);

  // Button text (drawn last, appears on top)
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(16);
  text(label, x + w/2, y + h/2);
}
```

### Creating Custom Shapes with beginShape()

For shapes beyond the primitives, use vertex-based drawing:

```javascript
function setup() {
  createCanvas(400, 300);
  background(240, 248, 255);

  fill(255, 200, 100);
  stroke(200, 150, 50);
  strokeWeight(2);

  // Draw a star using vertices
  beginShape();
  for (let i = 0; i < 10; i++) {
    let angle = TWO_PI * i / 10 - HALF_PI;
    let radius = (i % 2 === 0) ? 80 : 40;
    let x = 200 + cos(angle) * radius;
    let y = 150 + sin(angle) * radius;
    vertex(x, y);
  }
  endShape(CLOSE);
}
```

## Practical Application: MicroSim Control Panel

Let's apply everything to create a reusable control panel pattern:

```javascript
// Drawing a standard MicroSim control panel
function drawControlPanel(y, height) {
  // Panel background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(0, y, width, height);

  // Subtle top border
  stroke(180);
  strokeWeight(2);
  line(0, y, width, y);
}

function drawLabeledSlider(label, value, x, y) {
  // Label text
  fill(60);
  noStroke();
  textSize(14);
  textAlign(LEFT, CENTER);
  text(label, x, y);

  // Value display
  textAlign(RIGHT, CENTER);
  text(value.toFixed(1), x + 280, y);
}
```

This pattern appears in nearly every MicroSim—a clean white control area with labeled sliders showing current values.

## Key Takeaways

Congratulations! You've completed the most colorful chapter in this book. Here's what you've mastered:

1. **Drawing Primitives** are your visual vocabulary: `rect()`, `ellipse()`, `line()`, and more.

2. **rect()** draws rectangles from the top-left corner (or center with `rectMode(CENTER)`), with optional rounded corners.

3. **ellipse()** draws from the center by default, with width and height parameters for circles and ovals.

4. **line()** connects two points, styled with `stroke()` and `strokeWeight()`.

5. **stroke()** sets outline color; use `noStroke()` to remove outlines entirely.

6. **Shape Rendering** follows painter's algorithm—draw order determines layering.

7. **text()** displays strings, with `textSize()` for font size and `textAlign()` for positioning.

8. **Color Theory** helps you create harmonious palettes using complementary, analogous, and triadic relationships.

9. **HSB Color Mode** makes rainbows easy—just loop through hue values from 0 to 360!

10. **Combining primitives** with thoughtful layering creates professional-looking interfaces.

??? question "Challenge: What HSB values would you use to create a sunset palette?"
    A sunset palette uses warm hues in the red-orange-yellow range (0-60°), with varying saturation (60-100%) and brightness (70-100%). Try: `fill(30, 90, 100)` for orange, `fill(0, 80, 90)` for coral, and `fill(50, 100, 100)` for golden yellow!

## Next Steps

You now have the skills to create visually stunning MicroSims with complete control over shapes, text, and color. In the next chapter, we'll add **interactivity**—sliders, buttons, and mouse events that let users explore simulations hands-on.

Go experiment with your new rainbow powers! Try creating:

- A color picker with HSB sliders
- A drawing app with shape stamps
- An animated rainbow that cycles through hues
- A mood board with complementary color pairs
- A text-based data display with styled labels

The canvas is your palette. Paint something wonderful!

## References

For deeper exploration of color and design:

- [p5.js Color Reference](https://p5js.org/reference/#group-Color) - Complete color function documentation
- [Adobe Color](https://color.adobe.com) - Interactive color wheel and palette generator
- [Coolors](https://coolors.co) - Fast palette generation tool
- [Color Theory Fundamentals](https://www.interaction-design.org/literature/topics/color-theory) - Academic overview
- [HSB vs RGB](https://learnui.design/blog/the-hsb-color-system-practicioners-primer.html) - Practical guide to HSB
