---
title: Getting Started with p5.js
description: An introduction to the p5.js library for creating interactive MicroSims
generated_by: claude skill chapter-content-generator
date: 2025-01-25 14:30:00
version: 0.03
---

# Getting Started with p5.js

## Summary

This chapter introduces the p5.js library, the primary JavaScript framework used for creating MicroSims. You will learn about the HTML canvas element that serves as the drawing surface, the coordinate system for positioning elements, and the fundamental structure of p5.js programs with the setup() and draw() functions. The chapter covers essential concepts like global and local variables, the animation loop, frame rate control, and the createCanvas() and background() functions.

## Concepts Covered

This chapter covers the following 14 concepts from the learning graph:

1. p5.js Library
2. Canvas Element
3. Coordinate System
4. Pixels
5. RGB Color Model
6. setup() Function
7. draw() Function
8. Global Variables
9. Local Variables
10. Animation Loop
11. Frame Rate
12. createCanvas()
13. background()
14. fill()

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Educational MicroSims](../01-intro-to-educational-microsims/index.md)
- [Chapter 2: Web Development Essentials](../02-web-development-essentials/index.md)

---

## Welcome to the Creative World of p5.js!

If you've ever wanted to create art with code, build interactive visualizations, or bring mathematical concepts to life through animation, you're about to discover one of the most delightful tools in the creative coding universe. **p5.js** is a JavaScript library that makes programming accessible, fun, and surprisingly powerful. It transforms the potentially intimidating world of code into a playground where creativity flows as naturally as paint on canvas.

What makes p5.js special isn't just what it can do—it's *who* it was designed for. Unlike many programming libraries built by engineers for engineers, p5.js was created specifically to help artists, designers, educators, and beginners learn to code. The result is a remarkably intuitive system where you can create something visual in just a few lines of code.

!!! tip "Why p5.js for MicroSims?"
    p5.js is perfect for educational simulations because it combines visual immediacy with interactivity. Students can see their code come alive instantly, making abstract concepts tangible and engaging.

## A Brief History: From Processing to p5.js

Understanding where p5.js comes from helps explain why it's so wonderfully suited for creative coding. The story begins in 2001 at the MIT Media Lab.

#### Diagram: Processing and p5.js Evolution Timeline

<iframe src="../../sims/p5-timeline/main.html" width="100%" height="700px" scrolling="no"></iframe>
[View the P5 Timeline Fullscreen](../../sims/p5-timeline/main.html)

<details markdown="1">
    <summary>Processing and p5.js Evolution Timeline</summary>
    Type: timeline

    Purpose: Show the historical evolution from Processing to p5.js, highlighting key milestones and NYU's crucial support

    Time period: 2001-2025

    Orientation: Horizontal with alternating above/below event placement

    Events:
    - 2001: Casey Reas and Ben Fry create Processing at MIT Media Lab as a "sketchbook for code"
    - 2003: Processing 1.0 released with Java foundation, designed to teach programming to visual artists
    - 2005: Processing Foundation established as non-profit to promote software literacy
    - 2008: Processing reaches 100,000+ users, adopted in art schools worldwide
    - 2011: Processing 2.0 adds JavaScript mode (Processing.js)
    - 2013: Lauren McCarthy begins p5.js development at NYU ITP (Interactive Telecommunications Program)
    - 2014: p5.js 0.1.0 officially released—a complete reimagining of Processing for the web
    - 2015: NYU ITP becomes primary institutional home for p5.js development and community
    - 2016: p5.js Editor launched, making browser-based creative coding accessible to everyone
    - 2018: p5.js reaches 1 million monthly downloads
    - 2020: p5.js 1.0 released with stable API
    - 2023: p5.js community exceeds 10 million users globally
    - 2024: p5.js 2.0 development begins with WebGL2 enhancements

    Color coding:
    - Blue: MIT/Processing Foundation era (2001-2012)
    - Purple: NYU ITP era begins (2013-2015)
    - Green: p5.js growth and maturity (2016-present)

    Visual style: Modern timeline with circular milestone nodes connected by flowing lines

    Interactive features:
    - Hover over milestones to see detailed descriptions
    - Click to expand with quotes from creators and community impact statistics

    Key annotations:
    - At 2013: "NYU ITP provides institutional support, funding, and community building"
    - At 2014: "p5.js makes Processing's creative philosophy native to the web"

    Implementation: vis-timeline JavaScript library
</details>

### The Processing Philosophy

In 2001, Ben Fry and Casey Reas were graduate students at the MIT Media Lab when they created **Processing**—a programming environment designed to teach fundamentals of computer programming within a visual context. Their radical idea was simple yet transformative: *programming should be as expressive and immediate as sketching*.

Traditional programming languages at the time required hundreds of lines of code just to draw a simple circle on screen. Processing changed that entirely. Suddenly, artists and designers could express visual ideas in code almost as quickly as they could sketch them on paper.

The core principles they established continue to guide p5.js today:

- **Immediate visual feedback**: See your code's output instantly
- **Low barrier to entry**: Create something interesting on day one
- **High ceiling**: The same tools can create sophisticated professional work
- **Community-driven**: Share, remix, and learn from others

### NYU ITP: The Home of p5.js

In 2013, something wonderful happened. **Lauren McCarthy**, a faculty member and researcher at **NYU's Interactive Telecommunications Program (ITP)**, began developing what would become p5.js. Her vision was to bring Processing's creative philosophy directly into web browsers using JavaScript.

NYU ITP has been instrumental in p5.js's success, providing:

- **Institutional support** for development and maintenance
- **Funding** for community programs and accessibility initiatives
- **A home for the community** through workshops, residencies, and events
- **Educational resources** including tutorials and curriculum development
- **Commitment to diversity and inclusion** in the creative coding community

!!! quote "Lauren McCarthy on p5.js"
    "p5.js is a community and p5.js is a library. I think the community is just as important as the library."

The NYU community's emphasis on accessibility has shaped p5.js into a tool that welcomes everyone. Features like the `describe()` function for screen reader accessibility, internationalization efforts, and inclusive documentation all reflect this commitment.

## The Canvas Element: Your Digital Sketchpad

Every p5.js sketch draws on an HTML **canvas element**—a special rectangular region on a web page designed specifically for graphics. Think of it as a digital version of an artist's canvas: a defined space where your creative vision comes to life.

| Canvas Property | Description |
|----------------|-------------|
| Width | Horizontal size in pixels |
| Height | Vertical size in pixels |
| Background | Base color that clears the canvas |
| Context | The 2D or WebGL drawing context |

The canvas element is part of HTML5 and provides a bitmap drawing surface. Unlike regular HTML elements that contain text and images, the canvas is designed for programmatic drawing—perfect for animations, games, data visualizations, and our MicroSims.

### Creating Your First Canvas

In p5.js, you create a canvas using the `createCanvas()` function. This function takes two required parameters: width and height in pixels.

```javascript
function setup() {
  createCanvas(400, 400);
}
```

This single line creates a 400×400 pixel canvas—your digital playground for creative coding. The function also returns a canvas object that you can manipulate further, such as positioning it within a specific HTML container.

## Understanding Pixels and the Coordinate System

A **pixel** (short for "picture element") is the smallest addressable point on your canvas. Each pixel has a specific location defined by its coordinates, and every pixel can display a single color at any given moment.

### The p5.js Coordinate System

The p5.js coordinate system might feel a bit unusual at first if you're familiar with standard mathematical graphs. Here's the key difference:

- **Origin (0, 0)** is at the **top-left corner** of the canvas
- **X values increase** as you move **right**
- **Y values increase** as you move **down**

This may seem backwards, but it actually matches how computer displays work—screens refresh from top to bottom, and this coordinate system reflects that underlying technology.

#### Diagram: p5.js Coordinate System

<details markdown="1">
    <summary>p5.js Coordinate System Visualization</summary>
    Type: microsim

    Learning objective: Help students understand that the p5.js coordinate system has (0,0) at the top-left corner, with Y increasing downward (Bloom: Understand)

    Canvas layout:
    - Drawing area: 400x350 pixels with 'aliceblue' background
    - Control area: 50 pixels height with 'white' background

    Visual elements:
    - Grid lines at 50-pixel intervals (light gray)
    - Origin point (0,0) marked with a red circle at top-left
    - X-axis arrow pointing right with "X →" label
    - Y-axis arrow pointing down with "↓ Y" label
    - Interactive point that follows mouse position
    - Coordinate display showing current (x, y) position near the point
    - Corner coordinates labeled: (0,0), (400,0), (0,350), (400,350)

    Interactive controls:
    - The point automatically follows the mouse cursor
    - Coordinates update in real-time as mouse moves

    Behavior:
    - As user moves mouse, the point follows and displays current coordinates
    - Helps build intuition for how x increases rightward and y increases downward

    Color scheme:
    - Grid: light gray (#CCCCCC)
    - Origin: red
    - Interactive point: blue
    - Labels: black

    Implementation: p5.js with mouseX/mouseY tracking
</details>

Here's a comparison with traditional mathematical coordinates:

| Feature | Math Coordinate System | p5.js Coordinate System |
|---------|----------------------|------------------------|
| Origin location | Center or bottom-left | Top-left corner |
| Y-axis direction | Increases upward | Increases downward |
| X-axis direction | Increases rightward | Increases rightward |
| Common use | Graphing functions | Screen graphics |

## Colors: The RGB Model

Color in p5.js is specified using the **RGB color model**, which represents colors as combinations of Red, Green, and Blue light. Each color channel accepts a value from 0 (none) to 255 (maximum intensity).

Common RGB values you'll use frequently:

- **Black**: `(0, 0, 0)` - all channels off
- **White**: `(255, 255, 255)` - all channels at maximum
- **Red**: `(255, 0, 0)` - only red at maximum
- **Green**: `(0, 255, 0)` - only green at maximum
- **Blue**: `(0, 0, 255)` - only blue at maximum
- **Yellow**: `(255, 255, 0)` - red + green
- **Cyan**: `(0, 255, 255)` - green + blue
- **Magenta**: `(255, 0, 255)` - red + blue

### Using Colors with background() and fill()

The `background()` function sets the canvas background color, effectively "clearing" the canvas with that color. The `fill()` function sets the color for shapes drawn afterward.

```javascript
function setup() {
  createCanvas(400, 400);
  background(240, 248, 255);  // Alice blue - our standard drawing area color
}

function draw() {
  fill(255, 100, 100);  // Soft red
  circle(200, 200, 100);  // Draw a circle at center
}
```

!!! info "Color Shorthand"
    When all three RGB values are the same, you can use a single number: `background(220)` creates a light gray. You can also add a fourth parameter for transparency (alpha): `fill(255, 0, 0, 128)` creates a semi-transparent red.

## The Magic Two Functions: setup() and draw()

Here's where p5.js reveals its elegant simplicity. Every p5.js program is built around just two core functions:

1. **`setup()`** - Runs once when your program starts
2. **`draw()`** - Runs repeatedly in a loop, creating animation

This pattern is so intuitive that it feels almost natural. You set things up once, then the draw function keeps running, updating your visuals frame by frame. It's like the difference between building a stage (setup) and performing a play on it (draw).

```javascript
function setup() {
  // This code runs ONCE when the program starts
  createCanvas(400, 400);
  background(240, 248, 255);
}

function draw() {
  // This code runs REPEATEDLY (about 60 times per second)
  circle(mouseX, mouseY, 50);
}
```

### Why This Pattern Works

The setup/draw pattern maps beautifully to how animations and simulations actually work:

- **Setup**: Initialize your world—create the canvas, set initial positions, load resources
- **Draw**: Update your world—move objects, respond to input, render the current state

This pattern is so fundamental that you'll find variations of it in many other frameworks:

| Framework | Setup Function | Draw/Update Function |
|-----------|---------------|---------------------|
| p5.js | `setup()` | `draw()` |
| Processing | `setup()` | `draw()` |
| Arduino | `setup()` | `loop()` |
| Unity | `Start()` | `Update()` |
| Pygame | Initialization code | Main game loop |

Once you master this pattern in p5.js, you'll recognize it everywhere!

## Variables: Global vs. Local

Variables in p5.js (and JavaScript generally) come in two flavors based on their **scope**—where in your code they can be accessed.

### Global Variables

**Global variables** are declared outside of any function, typically at the top of your sketch. They can be accessed and modified from anywhere in your code.

```javascript
// Global variables - accessible everywhere
let canvasWidth = 400;
let drawHeight = 350;
let controlHeight = 50;
let ballX = 200;
let ballY = 200;

function setup() {
  createCanvas(canvasWidth, drawHeight + controlHeight);
}

function draw() {
  background(240, 248, 255);
  circle(ballX, ballY, 50);  // Can access ballX and ballY here
  ballX = ballX + 1;  // Can modify global variables too
}
```

Global variables are essential for MicroSims because they:

- Store state that persists between draw() calls
- Allow values to be shared across multiple functions
- Enable animation by changing values over time

### Local Variables

**Local variables** are declared inside a function and only exist within that function's scope.

```javascript
function draw() {
  let diameter = 50;  // Local variable - only exists in draw()
  circle(200, 200, diameter);
}

function mousePressed() {
  // This would cause an error:
  // console.log(diameter);  // 'diameter' is not defined here!
}
```

Local variables are useful for temporary calculations that don't need to persist between function calls.

| Variable Type | Declaration Location | Accessibility | Lifetime |
|--------------|---------------------|---------------|----------|
| Global | Outside all functions | Everywhere in sketch | Entire program duration |
| Local | Inside a function | Only within that function | Duration of function call |

## The Animation Loop and Frame Rate

The `draw()` function runs in an **animation loop**—it executes over and over, creating the illusion of movement just like frames in a movie.

By default, p5.js tries to run `draw()` approximately **60 times per second**. This rate, called the **frame rate**, determines how smooth your animations appear.

### Controlling Frame Rate

You can adjust the frame rate using the `frameRate()` function:

```javascript
function setup() {
  createCanvas(400, 400);
  frameRate(30);  // Run draw() 30 times per second instead of 60
}
```

Why would you want to change the frame rate?

- **Lower frame rates** (15-30 fps): Better for slower animations, educational purposes, or reducing CPU usage
- **Higher frame rates** (60+ fps): Smoother animations, better for games and interactive experiences

You can also check the current frame rate during execution using the `frameRate()` function without arguments, and the `frameCount` variable tells you how many frames have been drawn since the program started.

#### Diagram: Animation Loop Cycle

<details markdown="1">
    <summary>Animation Loop Cycle Diagram</summary>
    Type: diagram

    Purpose: Illustrate how the p5.js animation loop works, showing the continuous cycle of draw() calls (Bloom: Understand)

    Components to show:
    - "Program Starts" node
    - "setup() runs once" process box
    - "draw() runs" process box (highlighted as main loop)
    - "Wait for next frame" process
    - "~16.7ms at 60fps" timing annotation
    - Loop arrow returning from "Wait" back to "draw()"
    - "frameCount++" indicator

    Flow:
    1. Program Starts → setup() runs once → draw() runs → Wait → draw() runs (loop continues)

    Style: Flowchart with rounded rectangles and arrows

    Colors:
    - setup() box: blue
    - draw() box: green (highlighted)
    - Arrows: dark gray
    - Timing annotation: purple

    Labels:
    - "Runs ONCE" next to setup()
    - "Runs REPEATEDLY" next to draw() with loop indicator
    - Frame timing calculation shown

    Implementation: Mermaid.js flowchart or p5.js static diagram
</details>

## Putting It All Together: Your First Complete Sketch

Let's combine everything we've learned into a complete, working p5.js sketch. This example demonstrates all 14 concepts from this chapter:

```javascript
// Global variables (Concept: Global Variables)
let canvasWidth = 400;
let drawHeight = 350;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let circleX, circleY;
let speedX = 2;
let speedY = 3;
let diameter = 60;

// Setup function - runs once (Concept: setup() Function)
function setup() {
  // Create the canvas element (Concepts: Canvas Element, createCanvas())
  createCanvas(canvasWidth, canvasHeight);

  // Initialize circle position (using Coordinate System)
  circleX = canvasWidth / 2;  // Position in pixels (Concept: Pixels)
  circleY = drawHeight / 2;

  // Set frame rate (Concept: Frame Rate)
  frameRate(60);

  // Accessibility description
  describe('A colorful bouncing circle animation demonstrating p5.js basics');
}

// Draw function - runs repeatedly (Concepts: draw() Function, Animation Loop)
function draw() {
  // Clear background with alice blue (Concept: background())
  background(240, 248, 255);  // RGB color (Concept: RGB Color Model)

  // Draw the control area
  fill(255);  // White (Concept: fill())
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Update circle position (Animation via global variable modification)
  circleX = circleX + speedX;
  circleY = circleY + speedY;

  // Bounce off walls (using Coordinate System knowledge)
  if (circleX > canvasWidth - diameter/2 || circleX < diameter/2) {
    speedX = -speedX;
  }
  if (circleY > drawHeight - diameter/2 || circleY < diameter/2) {
    speedY = -speedY;
  }

  // Draw the circle with RGB color
  fill(100, 150, 255);  // Soft blue using RGB
  stroke(50, 100, 200);
  strokeWeight(3);
  circle(circleX, circleY, diameter);

  // Display frame count (demonstrates Animation Loop)
  let frameInfo = "Frame: " + frameCount;  // Local variable (Concept: Local Variables)
  fill(0);
  noStroke();
  textSize(14);
  text(frameInfo, 10, drawHeight + 30);
}
```

This simple bouncing ball animation demonstrates every concept we've covered. The joy of p5.js is that with just these fundamentals, you can create endless variations and increasingly sophisticated simulations!

## MicroSim: Sound Visualization with FFT

One of p5.js's most exciting features is its **sound library** (p5.sound), which includes a powerful **FFT (Fast Fourier Transform)** analyzer. FFT transforms audio signals into frequency data, letting you visualize sound in real-time.

The following MicroSim demonstrates how just a few lines of code can create a mesmerizing audio visualization using your microphone:

#### Diagram: FFT Microphone Audio Visualizer

<details markdown="1">
    <summary>FFT Microphone Audio Visualizer MicroSim</summary>
    Type: microsim

    Learning objective: Demonstrate the power of p5.js sound library to analyze and visualize audio frequencies in real-time with minimal code (Bloom: Apply, Analyze)

    Canvas layout:
    - Drawing area: 400x350 pixels with dark background for visual contrast
    - Control area: 50 pixels height for start/stop button

    Concept demonstration:
    - Shows that complex audio visualization is achievable in approximately 30 lines of code
    - Demonstrates the p5.sound library's FFT capabilities
    - Illustrates real-time data visualization

    Visual elements:
    - Frequency spectrum displayed as vertical bars
    - Bar height corresponds to amplitude at each frequency
    - Color gradient from bass (red/orange) to treble (blue/purple)
    - Smooth animation as bars respond to audio input
    - Background: very dark blue (#0a0a20)

    Interactive controls:
    - "Start Microphone" / "Stop" toggle button
    - Button positioned in control area, centered

    Core code structure (minimal lines):
    ```
    let mic, fft;

    function setup() {
      createCanvas(400, 400);
      mic = new p5.AudioIn();
      fft = new p5.FFT();
      fft.setInput(mic);
    }

    function draw() {
      background(10, 10, 32);
      let spectrum = fft.analyze();
      noStroke();
      for (let i = 0; i < spectrum.length; i++) {
        let x = map(i, 0, spectrum.length, 0, width);
        let h = map(spectrum[i], 0, 255, 0, height);
        let hue = map(i, 0, spectrum.length, 0, 360);
        fill(hue, 80, 90);  // HSB color mode for rainbow effect
        rect(x, height - h, width/spectrum.length, h);
      }
    }

    function mousePressed() {
      mic.start();
    }
    ```

    Behavior:
    - User clicks button to start microphone access
    - Browser prompts for microphone permission
    - Once granted, bars begin animating to match audio input
    - Speaking, clapping, or playing music creates visual patterns
    - Bass frequencies appear on left, treble on right

    Dependencies:
    - p5.js library
    - p5.sound library (additional include required)

    Accessibility:
    - Button has clear label indicating state
    - describe() function explains visualization for screen readers

    Educational notes:
    - Emphasize how few lines create a sophisticated visualization
    - FFT is used in music apps, voice recognition, and scientific analysis
    - The p5.sound library abstracts complex digital signal processing

    Implementation: p5.js with p5.sound library
    Note: Requires HTTPS or localhost for microphone access
</details>

This MicroSim showcases the remarkable power of p5.js—creating a real-time audio visualizer in about 30 lines of code. The `p5.FFT` object handles all the complex mathematics of frequency analysis, letting you focus on the creative visualization.

## MicroSim: 3D Animation Fun

p5.js isn't limited to 2D graphics! By using **WebGL mode**, you can create stunning 3D graphics right in the browser. Let's explore a playful 3D animation that demonstrates p5.js's versatility:

#### Diagram: Spinning 3D Shapes MicroSim

<details markdown="1">
    <summary>Spinning 3D Shapes MicroSim</summary>
    Type: microsim

    Learning objective: Demonstrate p5.js's WebGL capabilities for 3D graphics and introduce 3D coordinate concepts (Bloom: Understand, Apply)

    Canvas layout:
    - Full canvas: 400x400 pixels in WEBGL mode
    - No separate control area (controls via mouse interaction)

    Visual elements:
    - Central rotating torus (donut shape) in primary color
    - Multiple orbiting smaller shapes (spheres, boxes, cones) in complementary colors
    - Subtle ambient lighting and directional light for depth
    - Gradient background transitioning from deep purple to dark blue
    - Stars or particles in background for cosmic feel

    3D concepts demonstrated:
    - WEBGL rendering mode
    - rotateX(), rotateY(), rotateZ() functions
    - translate() in 3D space
    - 3D primitives: sphere(), box(), torus(), cone()
    - Lighting: ambientLight(), directionalLight()
    - Camera perspective (automatic in WEBGL)

    Interactive features:
    - Mouse X position controls rotation speed
    - Mouse Y position controls lighting intensity
    - Clicking changes color scheme
    - Drag to orbit camera around scene

    Animation behavior:
    - Central torus rotates smoothly on Y axis
    - Orbiting shapes follow circular paths at different speeds
    - Each orbiting shape also rotates on its own axis
    - Creates a playful "solar system" or "atom" visual effect

    Code structure:
    ```
    let angle = 0;

    function setup() {
      createCanvas(400, 400, WEBGL);
      colorMode(HSB);
    }

    function draw() {
      background(260, 80, 15);  // Deep purple-blue

      // Lighting
      ambientLight(60);
      directionalLight(255, 255, 255, 0, 0, -1);

      // Central torus
      push();
      rotateY(angle);
      rotateX(angle * 0.3);
      fill(180, 70, 90);  // Teal
      torus(80, 30);
      pop();

      // Orbiting spheres
      for (let i = 0; i < 5; i++) {
        push();
        rotateY(angle * (i + 1) * 0.2);
        translate(150, 0, 0);
        rotateX(angle * 2);
        fill((i * 60) % 360, 80, 90);
        sphere(15);
        pop();
      }

      angle += 0.02;
    }
    ```

    Color scheme:
    - HSB color mode for vibrant, easy-to-manipulate colors
    - Rainbow progression for orbiting shapes
    - Complementary colors for visual harmony

    Performance notes:
    - WEBGL mode uses GPU acceleration
    - Smooth animation even with multiple 3D shapes
    - Demonstrates p5.js handles 3D as elegantly as 2D

    Educational emphasis:
    - Show that 3D is just an extension of 2D concepts
    - Same setup()/draw() pattern works for 3D
    - Encourages experimentation with 3D primitives

    Implementation: p5.js with WEBGL mode
</details>

This 3D MicroSim demonstrates that p5.js's elegant simplicity extends into three dimensions. The same `setup()` and `draw()` pattern you learned for 2D works identically for 3D—you simply add `WEBGL` as the third parameter to `createCanvas()` and suddenly you have access to a whole new dimension of creative possibilities!

## Key Takeaways

Let's summarize the essential concepts from this chapter:

1. **p5.js** is a JavaScript library designed to make creative coding accessible and joyful, with roots in the Processing project and strong institutional support from NYU ITP.

2. The **canvas element** is your digital drawing surface, created with `createCanvas(width, height)`.

3. The **coordinate system** places (0,0) at the top-left corner, with X increasing rightward and Y increasing downward.

4. **Pixels** are the smallest addressable points on the canvas, and colors are specified using the **RGB model** (0-255 for each channel).

5. The **setup() function** runs once at program start; the **draw() function** runs repeatedly as an **animation loop**.

6. **Global variables** persist across function calls and enable animation; **local variables** exist only within their function.

7. The **frame rate** (default 60 fps) controls how often draw() executes.

8. The **background()** function clears and colors the canvas; **fill()** sets the color for shapes.

9. p5.js includes powerful additional libraries like **p5.sound** for audio visualization.

10. **3D graphics** are accessible through WEBGL mode using the same simple patterns.

??? question "Quick Check: What's the coordinate of a point at the exact center of a 400×300 canvas?"
    The center would be at **(200, 150)** — half the width and half the height. Remember, we're measuring from the top-left corner!

## Next Steps

Now that you understand the fundamentals of p5.js, you're ready to start building your own MicroSims! In the next chapter, we'll explore how to add **interactive controls**—sliders, buttons, and input fields—that let users experiment with simulation parameters.

The joy of p5.js is that every concept you learn opens up new creative possibilities. With just the tools from this chapter, you could create:

- Bouncing animations with physics
- Color-changing patterns
- Mouse-following visualizations
- Simple particle systems
- Audio-reactive art
- 3D explorations

The canvas is yours. Go create something wonderful!

## References

For further exploration of p5.js:

- [p5.js Official Website](https://p5js.org) - Documentation, tutorials, and examples
- [p5.js Web Editor](https://editor.p5js.org) - Browser-based coding environment
- [The Coding Train](https://thecodingtrain.com) - Daniel Shiffman's video tutorials
- [Processing Foundation](https://processingfoundation.org) - The non-profit behind Processing and p5.js
- [NYU ITP](https://itp.nyu.edu) - Academic home of p5.js development
