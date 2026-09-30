---
title: p5.js MicroSims
description: Teaches the p5.js sketch structure, drawing, animation, physics and controls behind the most flexible MicroSim type, including showcase-quality animation techniques.
generated_by: claude skill chapter-content-generator
date: 2026-09-30 10:31:02
version: 1.10
---

# p5.js MicroSims

## Summary

Teaches the p5.js sketch structure, drawing, animation, physics and controls that power the most flexible MicroSim type, including showcase-quality animation.

Students build up from setup and draw to vectors, collisions, particles and interactive controls. After it, they can create an animated, controllable simulation and apply the pause-when-idle and flowing-current techniques.

## Concepts Covered

This chapter covers the following 22 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| p5.js Sketch | 52 |
| setup() Function | 21 |
| draw() Function | 23 |
| Global Variables | 6 |
| Canvas Creation | 11 |
| Coordinate System | 10 |
| Shape Drawing | 4 |
| Color Model | 1 |
| Animation Loop | 7 |
| Frame Rate | 1 |
| Vectors | 5 |
| Physics Simulation | 3 |
| Collision Detection | 1 |
| Particle System | 1 |
| Slider Control | 5 |
| Button Control | 3 |
| Mouse Events | 8 |
| Keyboard Events | 3 |
| Text Rendering | 1 |
| Async Setup | 1 |
| Flowing Current Animation | 1 |
| Pause-When-Idle Animation | 1 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: What Is a MicroSim](../01-what-is-a-microsim/index.md)
- [Chapter 2: Anatomy of a MicroSim](../02-anatomy-of-a-microsim/index.md)
- [Chapter 4: Choosing a MicroSim Type](../04-choosing-a-microsim-type/index.md)
- [Chapter 5: Generating MicroSims with AI Skills](../05-generating-microsims-with-ai-skills/index.md)

---

## Welcome

!!! mascot-welcome "Time to Make Things Move"
    ![Bounce waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    p5.js is where a MicroSim stops being a picture and starts being a machine you can push on. By the end of this chapter you will be able to build an animated simulation with sliders, buttons, physics, and a showcase-quality touch or two. Let's bounce it around!

[Chapter 4](../04-choosing-a-microsim-type/index.md) presented p5.js as the most flexible MicroSim type and the default for anything that behaves like a system, such as a model that moves, collides, or responds to a click. This chapter teaches the parts of p5.js that a MicroSim author needs, in the order a sketch uses them. We begin with the structure of a sketch, move to drawing and animation, add vectors and physics, then wire in the controls that make a simulation interactive. We finish with two techniques borrowed from the H-Bridge showcase MicroSim of Chapter 1: flowing current and pause-when-idle animation.

You do not have to type all of this by hand, since Chapter 5 showed how the generator skill writes p5.js from a specification. You do have to read it fluently. A reader who understands the structure can review generated code, spot the hallucinated function, and change a parameter without asking the model again.

## The Anatomy of a Sketch

### The p5.js Sketch

A **p5.js Sketch** is a JavaScript program that uses the p5.js library to draw graphics and respond to the user, organized around two special functions that the library calls for you: `setup()`, which runs once, and `draw()`, which runs over and over. In this book, every p5.js MicroSim is one sketch stored in a single `.js` file, loaded by a small `main.html` page like the one you met in Chapter 1 and dissected in [Chapter 2](../02-anatomy-of-a-microsim/index.md).

p5.js can run in two modes, and the difference matters for reading code. In *global mode*, the functions you write and the p5.js functions you call, such as `circle()` and `createSlider()`, all live at the top level of the file, so no library prefix is needed. Every MicroSim template in this book uses global mode. The benefit is that the same file runs unchanged when pasted into the online p5.js editor, a compatibility requirement stated in the generator skill's p5.js guide.

The version matters too. The generator skill's `main.html` template loads p5.js 2.3.2 from a CDN with a pinned version number. The p5.js 2.x line changed a few functions, which we list near the end of the chapter, so a sketch written for 1.x can fail under 2.x.

A **worked example** shows the whole idea in nine lines. The sketch below drops a circle down the canvas. Before reading it, note the four functions it calls: `createCanvas(w, h)` makes the drawing surface, `background(color)` paints it, `circle(x, y, d)` draws a circle of diameter `d` centered at the point `(x, y)`, and `ballY` is a variable that we change on every pass.

```javascript
let ballY = 50;

function setup() {
  createCanvas(400, 300);
}

function draw() {
  background('aliceblue');
  circle(200, ballY, 40);
  ballY = ballY + 2;
}
```

Nothing in this file calls `setup()` or `draw()`. The p5.js library finds them by name and calls them at the right moments, which is why the two names are fixed. Everything else in a sketch exists to support these two functions.

### The setup() Function

The **setup() Function** runs exactly once, when the page loads, before the first frame is drawn. Its job is to create things that must exist a single time: the canvas, the sliders and buttons, and any starting values that depend on the canvas size.

Three tasks belong in `setup()` in this book's MicroSims. First, measure the container width and create the canvas. Second, create every control, because creating a slider inside `draw()` would make a new slider on every frame. Third, call `describe()`, which gives screen readers a text description of the canvas. The template from the generator skill follows this order and begins with a call to its width helper.

```javascript
function setup() {
  updateCanvasSize();                        // measure the container first
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  startButton = createButton('Start');       // controls are created once
  speedSlider = createSlider(0, 20, 3);

  describe('A ball bounces inside a box; a slider sets its speed.', LABEL);
}
```

The `LABEL` argument asks p5.js to expose the description as a text label next to the canvas, so assistive technology has something to announce. The functions `updateCanvasSize()` and `canvas.parent()` appear again in the canvas section below.

### The draw() Function

The **draw() Function** runs after `setup()` finishes and then repeats. Each pass is one *frame*: the sketch erases the previous picture, updates the state of the model, and draws the new picture. In this book's MicroSims, `draw()` is where the simulation's rules live.

!!! mascot-thinking "A Movie Made of Redraws"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Think of `draw()` as a flip book. Nothing on the canvas actually moves; the whole picture is repainted each frame with the objects a little further along, and the motion is your eye's interpretation.

The order inside `draw()` is a convention that prevents visual bugs. The generator skill's guide gives the order below, and it exists because later drawing paints over earlier drawing.

1. Draw the background regions: the drawing area in `'aliceblue'`, then the control area in `'white'`.
2. Draw any grid and axes.
3. Draw the title, after the grid so that the grid cannot cover it.
4. Update the model and draw the main visualization.
5. Draw annotation panels, and finally the labels and values for the controls.

A **worked example** shows why the order matters. If the sketch paints the background after drawing the ball, the ball disappears, because the background covers it. If the sketch never repaints the background, each frame's circle stays on screen and the ball smears into a long streak. Both are common in first drafts, and both come from the order of statements in `draw()`.

#### Diagram: Sketch Lifecycle Explorer

<details markdown="1">
<summary>Sketch Lifecycle Explorer</summary>
Type: microsim
**sim-id:** p5-sketch-lifecycle-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Understand; verb: explain): The learner will explain when setup() and draw() run and why the order of statements inside draw() changes what appears on the canvas.

Layout: a drawing region above a control region. The left half of the drawing region shows a small ball falling from a sketch like the one in this section. The right half shows a live counter panel with the lines "setup() calls: 1", "draw() calls: N", and "frameCount: N", plus a numbered list of the five draw() steps with the currently executing step highlighted.

Controls: a "Start / Pause" button (default paused), a "Step one frame" button, a checkbox "Clear background each frame" (default on), a checkbox "Draw ball before background" (default off), and a slider "Frame rate" from 1 to 60 frames per second, default 5 so the learner can watch each step.

Behavior: pressing Step runs exactly one draw() call and advances the highlighted step through the list. Turning off "Clear background" shows the streak. Turning on "Draw ball before background" makes the ball vanish. A one-sentence caption under the canvas explains each result.

Instructional rationale: a slowed, steppable loop lets the learner predict the next frame before seeing it, which suits an Understand-level objective better than continuous animation at full speed.

Responsive design: the canvas width follows the container on window resize, the counter panel moves below the ball at widths under 500 pixels, and the slider width is recalculated on every resize.

Implementation: p5.js with createButton, createCheckbox, and createSlider controls positioned relative to drawHeight, and a describe() call for accessibility.
</details>

### Global Variables

**Global Variables** are variables declared at the top level of the sketch file, outside any function, so that `setup()`, `draw()`, and every event handler can share them. A simulation is a model that changes over time, and the values that persist from one frame to the next need a home that survives when a function returns. Global variables are that home.

Variables declared inside `draw()` with `let` are recreated on every frame, so they cannot hold state. This is the source of a classic beginner bug: a ball whose position is declared inside `draw()` never moves, because it restarts at its initial value each frame.

The MicroSim template groups globals into three families, and following the grouping makes generated code easy to review.

| Family | Examples from the template | Purpose |
|---|---|---|
| Layout | `canvasWidth`, `drawHeight`, `controlHeight`, `canvasHeight`, `margin`, `sliderLeftMargin` | Fix where everything goes |
| Model state | `x`, `y`, `dx`, `dy`, `speed`, `r` | Hold the simulation between frames |
| Controls and flags | `speedSlider`, `startButton`, `isRunning` | Let functions outside `setup()` reach the controls |

The third row explains a detail of the template: the slider is declared globally even though it is created in `setup()`, because `windowResized()` and `draw()` must both reach it later. The `isRunning` flag records whether the simulation is animating, and the template sets it to `false` so a MicroSim starts paused.

!!! mascot-tip "Name Every Tunable Number"
    ![Bounce giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    When you spot a literal such as `0.8` inside a formula, lift it into a named global like `gravity`. A named global can become a slider in one line, while a buried literal has to be found and rewritten.

## The Canvas and Its Coordinates

### Canvas Creation

**Canvas Creation** is the step in which `createCanvas(width, height)` makes the rectangular drawing surface, and in a MicroSim it also attaches that surface to the page and sizes it to its container. The canvas holds both regions from Chapter 2: the drawing region of height `drawHeight` and the control region of height `controlHeight` beneath it. The total is `canvasHeight`, and the generator skill's guide says the iframe height should be the canvas height plus 2 pixels for the border.

The width is not fixed. The skill's guide requires the sketch to read the width of the `<main>` element at the start of `setup()` and again on every resize, so the same file fits a phone and a wide monitor. Chapter 12 develops responsive design in depth. Here we need only the pattern, which uses two functions.

```javascript
function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;       // the container sets the width
  }
}

function windowResized() {                     // p5.js calls this when the window resizes
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);     // height stays fixed
  speedSlider.size(canvasWidth - sliderLeftMargin - margin);
}
```

Read the second function line by line. `windowResized()` is another name that p5.js looks for and calls whenever the browser window changes size. It re-measures the container, resizes the canvas to the new width with `resizeCanvas()`, and resizes each slider, because a slider does not shrink on its own.

!!! mascot-warning "Pass an Element, Not the Word 'main'"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Writing `canvas.parent('main')` looks right but fails, because the string form searches for an element whose id is `main`, and our `<main>` tag has no id. Pass the element itself, as in `canvas.parent(document.querySelector('main'))`, and do the same for sliders and buttons.

### The Coordinate System

The **Coordinate System** of p5.js measures positions in pixels from the top-left corner of the canvas. The point `(0, 0)` is the top-left corner. The x value grows to the right, and, unlike the graphs of a mathematics class, the y value grows *downward*. The system variables `width` and `height` hold the canvas size, so `(width / 2, height / 2)` is the center.

The downward y axis explains two things in the code you have already seen. The bouncing ball in Chapter 1 tests `y > height - 20` to find the floor, because larger y is lower on the screen. And the control region sits at `drawHeight + 5` and beyond, because the controls are below the drawing area and therefore have larger y values.

A **worked example** shows the flip that every plotting MicroSim performs. Suppose a simulation tracks a height between 0 and 10 meters and must draw it in a drawing region that is `drawHeight` pixels tall. Height 0 belongs at the bottom, at y equal to `drawHeight`, and height 10 belongs at the top, at y equal to 0. The `map()` function converts one range into another, so reversing the two output values does the flip.

```javascript
// map(value, fromLow, fromHigh, toLow, toHigh)
let py = map(heightMeters, 0, 10, drawHeight, 0);   // 0 m -> bottom, 10 m -> top
circle(200, py, 20);
```

If the output range were written `0, drawHeight` instead, the ball would appear upside down: rising values would move it down the screen. When a simulation's graph seems mirrored, check the direction of the mapping first.

#### Diagram: Coordinate System Explorer

<details markdown="1">
<summary>Coordinate System Explorer</summary>
Type: microsim
**sim-id:** p5-coordinate-system-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Apply; verb: calculate): The learner will calculate the pixel coordinates of a target point, including the y flip used when plotting a value, and confirm the result by placing a marker.

Layout: an aliceblue drawing region with a light grid every 50 pixels, labeled with pixel coordinates, and a white control region below.

Interactions: moving the mouse over the drawing region shows a readout of mouseX and mouseY next to the pointer. Clicking places a marker and lists its coordinates. A "Challenge" button shows a target such as "Place a marker at the point that is 3 meters high on a 0 to 10 meter scale", and the learner clicks where they think it belongs. The sim then draws the correct point and shows the map() call that produces it, with the numbers filled in.

Controls: a slider "Scale maximum (m)" from 5 to 20, default 10, that changes the challenge scale; buttons "Challenge" and "Clear markers"; a checkbox "Show origin and axes directions" that draws arrows from the top-left origin labeled "x grows right" and "y grows down".

Responsive design: the grid and target positions are computed from the current canvas width and drawHeight on every frame, so the sim adapts when the window resizes.

Implementation: p5.js using mouseX, mouseY, mousePressed(), and map(), with a describe() call.
</details>

## Drawing the Picture

Now that positions are clear, we can define how to put shapes, colors, and words at those positions. These three concepts are brief: each is a small vocabulary of functions.

### Shape Drawing

**Shape Drawing** in p5.js uses one function call per primitive shape, and each call takes its position and size in canvas coordinates. The primitives used most in MicroSims are `rect(x, y, w, h)` for rectangles, `circle(x, y, d)` for circles, `line(x1, y1, x2, y2)` for lines, and `triangle()` for triangles. For custom outlines, `beginShape()`, then a series of `vertex(x, y)` calls, then `endShape()` trace a polygon. The H-Bridge showcase draws its motor spiral this way, by computing a point for each small angle step.

Two settings apply to the shapes drawn after them: `fill()` sets the interior color, and `stroke()` sets the outline color, with `noFill()` and `noStroke()` turning either off. The `push()` and `pop()` functions save and restore these settings together with any `translate()` or `rotate()` transformation, so a helper function can rotate one object without disturbing the rest. The H-Bridge sketch wraps its motor drawing in `push()` and `pop()` for exactly this reason.

### Color Model

The **Color Model** in p5.js is the way a color is specified: by a name, by numbers, or by a color object. This book's standard is *named colors* such as `'aliceblue'`, `'silver'`, `'orangered'`, and `'gold'`, because the generator skill's guide says named colors are far easier for a reader to understand than hexadecimal codes, and it forbids the hexadecimal form. Numeric forms exist as well: `fill(255, 255, 255, 230)` gives red, green, blue, and an alpha (transparency) value, and the guide uses that form for semi-transparent annotation panels. To fade a named color, the H-Bridge sketch creates a color object with `color()` and calls its `setAlpha()` method.

### Text Rendering

**Text Rendering** draws words on the canvas with `text(string, x, y)`, with `textSize()` and `textAlign()` controlling how they appear. Three rules from the generator skill's guide prevent the most common defects. Call `noStroke()` before every `text()`, so a leftover outline does not make letters look smeared. Keep text at 16 pixels or larger so it can be read from the back of a classroom. And combine each control's label and value in one string, as in `text('Speed: ' + speed, 70, drawHeight + 15)`.

When a message may be long, `text(message, x, y, w, h)` wraps the words inside a box. The H-Bridge sketch uses that four-number form for its status message, so the explanation stays inside the drawing region as the canvas narrows.

## Making Things Move

### The Animation Loop

The **Animation Loop** is the cycle in which p5.js calls `draw()` once per frame, and the sketch changes its state a little each time so that repeated redrawing looks like motion. The loop starts by itself after `setup()` and continues until the page closes, unless the sketch stops it. The functions `noLoop()` and `loop()` stop and restart it, and `redraw()` runs a single pass while it is stopped. The template's `windowResized()` uses `redraw()` for this reason.

Every animated MicroSim follows one pattern: update, then draw. The template's bouncing ball shows it, with the update guarded by a state flag.

```javascript
function draw() {
  // ... draw the background regions ...
  if (isRunning) {           // update the model only while running
    x += dx;                 // move by the current velocity
    y += dy;
    if (x > width - r || x < r) dx = -dx;   // bounce off left and right edges
  }
  circle(x, y, r * 2);       // always draw the current state
}
```

The guard makes the simulation *pausable*. The canvas is still redrawn every frame, so the picture stays visible, but the model stops advancing. The template sets `isRunning` to `false` at the start because a simulation that moves while a learner scrolls past it in a chapter is a distraction.

### Frame Rate

**Frame Rate** is the number of frames drawn per second. By default p5.js aims for about sixty. Calling `frameRate(30)` in `setup()` lowers the target, and calling `frameRate()` with no argument reports the current rate. A lower target saves battery on a laptop or tablet, at the cost of choppier motion.

Because the examples in this chapter move an object by a fixed number of pixels per frame, their apparent speed depends on the frame rate: a slow computer draws fewer frames and the ball moves more slowly. The p5.js system variable `deltaTime`, the milliseconds since the previous frame, lets a sketch scale each step so speed stays constant. For classroom MicroSims the per-frame approach is the norm, and the simplicity is worth the small variation.

## Vectors, Physics and Collisions

### Vectors

A **vector** in p5.js is an object that stores two numbers, an x part and a y part, and provides methods to combine them. In a simulation, a vector naturally represents a position, a velocity, or an acceleration. `createVector(x, y)` makes one, and the properties `.x` and `.y` read its parts. The method `add()` adds another vector, `mult()` scales a vector by a number, and `mag()` returns its length.

The benefit is that physics reads like its description. A ball has a position vector and a velocity vector. Each frame, the velocity adds gravity, and the position adds the velocity. The code in the next section uses exactly those two `add()` calls, and it replaces the four separate variables `x`, `y`, `dx`, and `dy` from the template with two vector objects.

!!! mascot-thinking "One Object, Two Numbers"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    A vector is worth learning because it lets you treat "how fast, and which way" as a single thing. Once velocity is one object, adding gravity to it is one line, whatever direction the ball happens to be moving.

### Physics Simulation

A **Physics Simulation** in a MicroSim is a small model in which each frame updates velocities from forces or accelerations and then updates positions from velocities. The generator skill's guide shows the core in three lines: `velocity.y += gravity`, then `position.add(velocity)`, then, on hitting the floor, `velocity.y *= -elasticity`. This approach, stepping forward by one small increment per frame, is called *Euler integration*, and it is accurate enough for teaching when the step is small.

A **worked example** runs the model with numbers. Start the ball at `y = 50` with velocity 0 and gravity 0.5. Frame one: velocity becomes 0.5 and position 50.5. Frame two: velocity 1.0 and position 51.5. Frame three: velocity 1.5 and position 53. The velocity grows by a constant amount each frame, so the distance fallen per frame grows too, and that is acceleration, produced by two additions.

```javascript
let position, velocity, gravity;

function setup() {
  createCanvas(400, 400);
  position = createVector(200, 50);       // start near the top, centered
  velocity = createVector(2, 0);          // drifting right
  gravity = createVector(0, 0.5);         // pulls down each frame
}

function draw() {
  background('aliceblue');
  velocity.add(gravity);                  // acceleration changes velocity
  position.add(velocity);                 // velocity changes position
  if (position.y > height - 20) {         // floor: 20 pixels is the ball radius
    position.y = height - 20;             // put the ball back on the floor
    velocity.y *= -0.8;                   // reverse and keep 80 percent
  }
  circle(position.x, position.y, 40);
}
```

Notice that the code resets `position.y` to the floor before reversing the velocity. Without that line, a fast ball can end a frame below the floor, and the next frame it may still be below the floor and reverse again, so the ball jitters underground. The Chapter 1 mentions this kind of defect, a ball sinking through the floor at high gravity, as something testing catches in generated code.

### Collision Detection

**Collision Detection** is the test that decides whether two objects touch, so the simulation can respond. The simplest tests use geometry. A ball hits a wall when its center is closer to the wall than its radius, which is the floor test above. Two circles collide when the distance between their centers is less than the sum of their radii, and the `dist()` function computes that distance.

```javascript
function circlesCollide(a, b) {           // a and b each have x, y and r
  return dist(a.x, a.y, b.x, b.y) < a.r + b.r;
}
```

Detection only answers yes or no. The *response*, such as reversing a velocity or changing a color, is a separate step that you write. Keeping the two steps distinct makes both easier to test.

### Particle System

A **Particle System** is a collection of many small objects, each with its own position, velocity, and lifetime, that together produce an effect such as sparks, smoke, or a fountain. The technique is to store the particles in an array, and on each frame to add new ones, update every one with the same physics, draw them, and remove the ones whose lifetime has ended.

```javascript
let particles = [];

function spawnParticle(x, y) {
  particles.push({
    pos: createVector(x, y),
    vel: createVector(random(-1.5, 1.5), random(-5, -3)),   // upward, slightly sideways
    life: 120                                               // frames to live
  });
}

function updateParticles() {
  for (const p of particles) {
    p.vel.y += 0.1;                  // gravity
    p.pos.add(p.vel);
    p.life--;
  }
  particles = particles.filter(p => p.life > 0);   // drop expired particles
}
```

Calling `spawnParticle` a few times per frame, and `updateParticles` once, gives a fountain. The lesson for a MicroSim author is the pattern of updating a whole population with one rule, since complex-looking behavior comes from many simple objects. Chapter 4 lists celebration effects under the p5.js custom-simulation type, and such effects are typically particle systems. Chapter 3 gives the counterweight: for an Understand-level objective, particle effects add extraneous load, so use them for feedback and reward, not as decoration.

#### Diagram: Vector and Particle Lab

<details markdown="1">
<summary>Vector and Particle Lab</summary>
Type: microsim
**sim-id:** p5-vector-particle-lab<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: distinguish): The learner will distinguish the roles of position, velocity, and acceleration vectors, and of collision detection versus collision response, by changing parameters and observing the labeled arrows.

Layout: a drawing region above a control region. A mode switch at the top of the controls selects "One ball" or "Fountain".

One ball mode: a ball with a green arrow for velocity, a red arrow for gravity, and a small readout of position, velocity, and speed. A second, fixed ball can be dragged into the path; when the circles collide, both flash and the readout shows "dist < r1 + r2" with the actual numbers.

Fountain mode: particles spawn at the bottom center, each drawn with an alpha that fades with its remaining life, and a counter shows how many particles are alive.

Controls: sliders "Gravity" (0.1 to 1.0, default 0.5), "Bounciness" (0.3 to 0.95, default 0.8), and "Spawn rate" (1 to 10 per frame, default 3); buttons "Start / Pause" (default paused) and "Reset"; a checkbox "Show vectors" (default on).

Behavior: changing gravity changes the red arrow length at once. Turning on "Show vectors" in fountain mode draws the velocity arrow for a few sampled particles. Pausing freezes the model but keeps the picture on screen.

Responsive design: canvas width follows the container on resize, sliders are resized in windowResized(), and the fixed ball and the fountain origin are positioned as fractions of the canvas width.

Implementation: p5.js with createVector(), p5.Vector methods, dist(), mouse dragging, and an array of particle objects; include a describe() call.
</details>

## Controls and Events

A MicroSim is interactive because the learner can change something. p5.js provides two mechanisms: DOM controls such as sliders and buttons, which the library creates and manages, and event functions such as `mousePressed()`, which the library calls when the user acts. The generator skill's guide is emphatic on one point: use the native built-in controls of p5.js, and never draw your own controls with drawing commands.

### Slider Control

A **Slider Control** is a horizontal control that sets a numeric value within a range. `createSlider(min, max, default, step)` makes one, `.value()` reads it, `.position(x, y)` places it, and `.size(w)` sets its width. The skill's guide adds a rule that is easy to forget: set the width with `size()`, never with `style()`, so the resize code has one consistent way to change it.

Sliders can be read in two ways. The simple way reads `.value()` inside `draw()` every frame, which is what the template does. The other way attaches a function with `.input(fn)`, and p5.js calls that function only when the learner moves the slider. The second way suits a change that must trigger something once, such as resetting a simulation, and it is the form the skill's guide shows for a slider that calls `resetSimulation`.

A **worked example** wires a gravity slider into the falling-ball model above. The slider goes in the control region, the value is read each frame, and a label shows the current number.

```javascript
let gravitySlider;

function setup() {
  // ... create the canvas, then:
  gravitySlider = createSlider(0.1, 2.0, 0.8, 0.1);        // min, max, default, step
  gravitySlider.position(sliderLeftMargin, drawHeight + 5); // below the drawing region
  gravitySlider.size(canvasWidth - sliderLeftMargin - margin);
}

function draw() {
  // ... draw the background regions ...
  gravity.y = gravitySlider.value();                         // read each frame
  // ... update and draw the ball ...
  noStroke();
  fill('black');
  text('Gravity: ' + gravitySlider.value(), 10, drawHeight + 15);
}
```

The slider is placed at `sliderLeftMargin` so that the label, which starts at x equal to 10, does not overlap it. The template uses 160 pixels when a button precedes the slider, and the guide notes that the margin must be widened when more controls come first. The width `canvasWidth - sliderLeftMargin - margin` makes the slider fill the rest of the row, and the resize function repeats that line.

### Button Control

A **Button Control** triggers a single action when clicked. `createButton(label)` makes one, and `.mousePressed(fn)` names the function to run. The template's start button shows the standard pattern, in which one function flips the `isRunning` flag and rewrites the label with `.html()`.

```javascript
function toggleSimulation() {
  isRunning = !isRunning;                       // flip between running and paused
  startButton.html(isRunning ? 'Pause' : 'Start');
}
```

Buttons suit discrete actions such as Start, Reset, and Drop Again. Continuous quantities belong to sliders, and on-off options belong to checkboxes, created with `createCheckbox(label, initialState)`. The guide suggests one to three sliders and up to two buttons per MicroSim, and it asks whether each control is essential to the learning objective.

### Mouse Events

**Mouse Events** are the moments the user presses, drags, releases, or moves the mouse over the canvas, and p5.js reports them by calling functions with fixed names: `mousePressed()`, `mouseDragged()`, `mouseReleased()`, and `mouseMoved()`. Inside any of them, the system variables `mouseX` and `mouseY` give the pointer position in canvas coordinates. That is why the coordinate system comes first in this chapter.

Reacting to a click usually means a *hit test*: deciding which object lies under the pointer. The H-Bridge sketch does this for its four switches with a rectangle test, and for a round object the same `dist()` function from the collision section serves.

```javascript
function mousePressed() {
  if (mouseY > drawHeight) return;                     // ignore clicks in the control region
  if (dist(mouseX, mouseY, position.x, position.y) < 20) {
    dragging = true;                                   // the pointer is on the ball
  }
}

function mouseDragged() {
  if (dragging) position.set(mouseX, mouseY);          // the ball follows the pointer
}

function mouseReleased() {
  dragging = false;
}
```

The early return in `mousePressed()` matters because the canvas covers both regions. Without it, a click on a control could also count as a click in the simulation. The H-Bridge sketch has a similar guard, and it also ignores a second event that arrives within 300 milliseconds of the first, because its comments note that a single tap on a touch screen can fire both a touch event and a mouse event.

Hover is a mouse event without a click. The p5.js canvas object has `mouseOver()` and `mouseOut()` methods, which the pause-when-idle section uses.

### Keyboard Events

**Keyboard Events** let the learner control a MicroSim from the keyboard, which helps users who cannot operate a mouse and lets anyone work faster. p5.js calls `keyPressed()` when a key goes down, and the variable `key` holds the character. The H-Bridge sketch maps keys 1 to 4 to its four switches and `F`, `S`, and `R` to its Forward, Stop, and Reverse presets.

```javascript
function keyPressed() {
  if (key === 'f' || key === 'F') {          // accept upper and lower case
    setSwitches([true, false, false, true]); // the same action as the Forward button
  }
}
```

!!! mascot-tip "Every Shortcut Mirrors a Button"
    ![Bounce giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Let each key call the same function as the matching button, as the H-Bridge does, and test both upper and lower case. Then the keyboard path can never drift out of step with the mouse path.

The table below summarizes the four control mechanisms and when each fits. It restates the guidance above rather than adding to it.

| Mechanism | p5.js call | Best for | Read by |
|---|---|---|---|
| Slider | `createSlider()` | A continuous parameter | `.value()` in `draw()` or `.input(fn)` |
| Button | `createButton()` | A discrete action | `.mousePressed(fn)` |
| Mouse event | `mousePressed()` and related | Direct manipulation of drawn objects | `mouseX`, `mouseY` |
| Keyboard event | `keyPressed()` | Shortcuts and accessibility | `key` |

Later chapters treat each of these interactions as a candidate for reporting, since a slider change or a button press is the evidence an instrumented MicroSim collects.

## Loading Assets in p5.js 2.x

### Async Setup

**Async Setup** is the p5.js 2.x way to load images, fonts, and data before the sketch starts: declare `setup()` as an `async function` and `await` each loading call. In p5.js 1.x, a separate `preload()` function loaded assets before `setup()`. The 2.x line removed `preload()`, and this repository's upgrade list tells authors to move the loading calls into `async function setup()` and to await each `load*()` call before `createCanvas()`.

```javascript
let diagram;

async function setup() {
  diagram = await loadImage('circuit.png');   // wait until the image has loaded
  createCanvas(canvasWidth, canvasHeight);
}
```

The `await` keyword pauses `setup()` until the image arrives, so `draw()` never runs with a missing picture. Four sketch files from the MicroSims 1.0 collection, three breadboard sketches and `push-buttons.js`, still use `preload()` and appear on that upgrade list.

!!! mascot-warning "A 1.x Sketch May Not Run on 2.x"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Old sketches can hide three breakages under p5.js 2.x: `preload()` is gone, `curveVertex()` is now `splineVertex()`, and `quadraticVertex()` is folded into `bezierVertex()`. When an AI model hands you 1.x-style code, check for those names first, and pin the version in `main.html` so it cannot change underneath you.

The same upgrade list records two curve changes. In 2.x, `bezierVertex()` takes one control point per call, so several points are chained across calls, and `bezierOrder(2)` selects a quadratic curve in place of the old `quadraticVertex()`. The old `curveVertex()` was renamed `splineVertex()`, and it no longer needs duplicated first and last points. Most MicroSims use only circles, lines, and rectangles, so these changes touch a small fraction of sketches.

## Showcase Techniques

The techniques below come from the H-Bridge simulation in the STEM Robots book, which Chapter 1 named as a showcase MicroSim. Neither technique is required for a working MicroSim, and both raise the perceived quality noticeably. Each combines the concepts you have already learned.

### Flowing Current Animation

**Flowing Current Animation** moves a row of evenly spaced dots along a path so that the eye reads them as a stream of current. The H-Bridge sketch stores each current path as a list of corner points. On every frame, it walks along the path by a distance measured in pixels, places a dot every 24 pixels, and shifts all the dots forward together.

The trick is a single number, `flowOffset`, that grows a little each frame. The sketch starts placing dots at `flowOffset % spacing`, the remainder after dividing by the spacing, so the pattern repeats every 24 pixels and the dots seem to travel without end. To find where a dot at distance `d` sits, the code steps through the path's segments, subtracts each segment's length until the remaining distance fits inside one, and uses `lerp()` to interpolate along that segment. The sketch also skips dots that fall inside the motor circle, so the current appears to pass into the motor and out again.

Direction is color and path together: green dots follow the forward path and purple dots follow the reverse path, so the learner sees the current change direction when the switches change. Because the offset advances by a fixed amount per frame, the flow speed follows the frame rate, exactly as discussed for frame rate.

### Pause-When-Idle Animation

**Pause-When-Idle Animation** advances animation only while the mouse is over the MicroSim. The generator skill's guide gives three reasons: it saves CPU and battery, it reduces distraction while the reader reads the surrounding text, and the simulation feels responsive because it wakes when the pointer arrives. The canvas is still redrawn every frame, so the current picture stays visible. Only the *progress* variables, such as `flowOffset`, stop growing.

The guide's pattern has three parts. A flag, `mouseOverCanvas`, starts as `false`. Two listeners in `setup()` set it to `true` and `false` when the pointer enters and leaves. And `draw()` advances the animation phases only when the flag is `true`.

```javascript
let mouseOverSim = false;
let flowOffset = 0;

function setup() {
  // ... create the canvas and controls ...
  const mainElement = document.querySelector('main');
  mainElement.addEventListener('mouseenter', () => mouseOverSim = true);
  mainElement.addEventListener('mouseleave', () => mouseOverSim = false);
}

function draw() {
  // ... draw the background regions ...
  if (mouseOverSim) {
    flowOffset += 1.5;          // progress advances only while the pointer is here
  }
  // ... draw the dots from flowOffset, always ...
}
```

The guide attaches its listeners to the canvas with `canvas.mouseOver()` and `canvas.mouseOut()`, while the H-Bridge listens on the `<main>` element that contains the canvas and the controls. Either works. The H-Bridge also sets its flag to `true` inside `mousePressed()`, since a touch screen has no hover, and a tap must wake the animation.

This rule complements the paused-by-default rule from the template. The template's `isRunning` flag gives the learner explicit control through a Start button. Pause-when-idle adds an automatic control tied to the pointer. A MicroSim can use either or both, and you should choose deliberately.

The H-Bridge shows one more habit worth copying. Its short-circuit warning flashes the wires red about twice per second, and its comments state that this rate is safe for photosensitive viewers. Attention-grabbing animation should be checked against accessibility concerns, a subject Chapter 24 returns to.

#### Diagram: Flowing Current and Idle Pause

<details markdown="1">
<summary>Flowing Current and Idle Pause</summary>
Type: microsim
**sim-id:** p5-flowing-current-idle-pause<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Create; verb: design): The learner will design a flowing-current animation by choosing path, spacing, and speed, and will decide whether pause-when-idle should be on, by observing the effect on the animation and on a live step counter.

Layout: a drawing region containing a rectangular loop of wire with a battery on the left and a lamp on the right, and a control region beneath it.

Visual elements: green dots flowing along the loop, spaced evenly, hidden while inside the lamp circle; a text readout "Animation advancing: yes or no" and a counter "Animation steps since load".

Controls: sliders "Dot spacing (pixels)" from 12 to 48, default 24, and "Flow speed (pixels per frame)" from 0.5 to 4, default 1.5; a checkbox "Pause when idle" (default on); a checkbox "Reverse direction"; a button "Start / Pause" (default paused).

Behavior: with "Pause when idle" on, the dots move only while the pointer is over the sim, and the step counter stops when the pointer leaves. With it off, the dots move whenever the Start button has been pressed. Reversing direction changes the dot color from green to purple and runs the offset backward.

Responsive design: the loop's corner points are computed from the canvas width on every frame, so the loop stretches with the container, and sliders are resized in windowResized().

Implementation: p5.js using a list of corner points, an offset modulo the spacing, lerp() to place dots, and mouse enter and leave listeners on the main element; include a describe() call.
</details>

## Putting It Together

A complete MicroSim now reads as a short checklist. The sketch declares layout and state as **Global Variables**. Its `setup()` measures the container, creates the canvas and the controls, and describes the canvas for screen readers. Its `draw()` repaints the two regions, updates the model only while running, and draws the result. Event functions react to the mouse and keyboard, and `windowResized()` keeps the width and the sliders responsive. Starting from the template and changing the model is the fastest route, and Chapter 2 shows the files that surround it.

## Chapter Summary

!!! mascot-celebration "You Can Read and Build a Sketch"
    ![Bounce celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now build an animated p5.js MicroSim with a pausable animation loop, vector-based physics, sliders, buttons, and mouse and keyboard handlers, and you can explain the pause-when-idle technique. That is the toolkit behind the most flexible MicroSim type.

The key ideas of this chapter are:

- A p5.js sketch is organized around `setup()`, which runs once to create the canvas and controls, and `draw()`, which runs every frame to update and paint.
- Global variables hold layout, model state, and control references between frames, and the canvas is sized from its container and resized on every window change.
- p5.js positions use pixels from the top-left corner with y growing downward, and `map()` performs the flip when plotting values.
- Shapes, named colors, and text use short function calls, with `noStroke()` before text and named colors instead of hexadecimal codes.
- The animation loop redraws every frame while the model advances only when running, and the frame rate sets the pace of per-frame motion.
- Vectors let velocity and position be updated with `add()`, and simple distance tests detect collisions, while particle systems apply one rule to many short-lived objects.
- Sliders, buttons, mouse events, and keyboard events give the learner control, and guards keep clicks and shortcuts consistent with the controls.
- In p5.js 2.x, assets load through an async `setup()`, and old `preload()`, `curveVertex()`, and `quadraticVertex()` code must be updated.
- Flowing current and pause-when-idle animation are showcase techniques that make motion legible and keep pages calm.

The next chapter leaves free-form drawing behind and turns to charts, plots, and tables, where a library does the drawing and the author supplies the data.
