---
title: User Interface Controls and Events
description: Master interactive controls that put users in command of your MicroSims
generated_by: claude skill chapter-content-generator
date: 2025-01-25 16:45:00
version: 0.03
---

# User Interface Controls and Events

## Summary

This chapter covers interactive controls that allow users to manipulate MicroSim parameters. You will learn to create sliders and buttons using createSlider() and createButton(), implement start/stop/pause/reset functionality, and handle mouse and keyboard events. The chapter explores event handlers, the isRunning state pattern for animation control, and techniques for speed control and parameter adjustment. These skills enable you to create truly interactive educational simulations.

## Concepts Covered

This chapter covers the following 20 concepts from the learning graph:

1. Slider Control
2. Button Control
3. Start Button
4. Stop Button
5. Pause Button
6. Reset Button
7. createSlider()
8. createButton()
9. Input Handling
10. Mouse Events
11. mousePressed()
12. mouseDragged()
13. Keyboard Events
14. keyPressed()
15. Event Handlers
16. User Interaction
17. isRunning State
18. Animation Control
19. Speed Control
20. Parameter Adjustment

## Prerequisites

This chapter builds on concepts from:

- [Chapter 3: Getting Started with p5.js](../03-getting-started-with-p5js/index.md)
- [Chapter 6: MicroSim Architecture and Layout](../06-microsim-architecture-and-layout/index.md)

---

## Taking Control of Your Controls

Welcome to the chapter where you finally take control—literally! A MicroSim without user controls is like a car without a steering wheel: it might go somewhere, but you have no say in where. By the end of this chapter, you'll have *complete control* over how users *control the controls* in your simulations.

Every educational MicroSim needs **user interaction**. Students learn best when they can experiment, adjust parameters, and see immediate results. The controls you add transform passive viewers into active explorers.

!!! tip "The Control Principle"
    The best controls are ones users don't have to think about. When controls are intuitive and consistent, students focus on the concept—not the interface. Keep your controls under control!

## The Two Essential Controls: Sliders and Buttons

In the world of MicroSims, two controls rule supreme:

| Control Type | Best For | User Action |
|-------------|----------|-------------|
| **Sliders** | Continuous values (speed, size, angle) | Drag to adjust |
| **Buttons** | Discrete actions (start, stop, reset) | Click to trigger |

Together, sliders and buttons give users complete control over any simulation. Let's master each one.

## Slider Control: The Continuous Commander

A **slider control** lets users select a value from a continuous range by dragging a handle. Sliders are perfect for parameters that vary smoothly—like speed, gravity, temperature, or any numeric value.

### Why Sliders Work

Sliders provide:

- **Visual feedback**: The handle position shows the current value
- **Intuitive interaction**: Drag right for more, left for less
- **Bounded input**: Users can't enter invalid values
- **Immediate response**: Changes apply as you drag

### The createSlider() Function

The `createSlider()` function creates a slider control:

```javascript
let mySlider = createSlider(min, max, default, step);
```

| Parameter | Description | Example |
|-----------|-------------|---------|
| `min` | Minimum value | 0, 1, -100 |
| `max` | Maximum value | 100, 10, 360 |
| `default` | Starting value | 50, 5, 0 |
| `step` | Increment size (optional) | 1, 0.1, 5 |

### Complete Slider Example

```javascript
let speedSlider;
let drawHeight = 350;
let controlHeight = 50;

function setup() {
  createCanvas(400, drawHeight + controlHeight);

  // Create slider: range 1-10, default 5, step 0.5
  speedSlider = createSlider(1, 10, 5, 0.5);
  speedSlider.position(100, drawHeight + 15);
  speedSlider.size(200);  // Width in pixels
}

function draw() {
  background(240, 248, 255);

  // Control region
  fill(255);
  noStroke();
  rect(0, drawHeight, width, controlHeight);

  // Get current value
  let speed = speedSlider.value();

  // Display label and value
  fill(0);
  textSize(14);
  textAlign(LEFT, CENTER);
  text("Speed:", 20, drawHeight + 25);
  textAlign(RIGHT, CENTER);
  text(speed.toFixed(1), width - 20, drawHeight + 25);

  // Use the value in your simulation
  // ...
}
```

### Slider Styling and Positioning

Sliders need careful positioning in the control region:

```javascript
// Standard slider positioning pattern
let sliderLeftMargin = 100;  // Space for label

function repositionSlider() {
  speedSlider.position(sliderLeftMargin, drawHeight + 15);
  speedSlider.size(canvasWidth - sliderLeftMargin - 60);  // Leave room for value
}
```

#### Diagram: Slider Control Playground

<details markdown="1">
    <summary>Interactive Slider Playground</summary>
    Type: microsim

    Learning objective: Allow students to experiment with slider parameters (min, max, default, step) and see immediate effects (Bloom: Apply)

    Canvas layout:
    - Drawing area: 400x300 pixels
    - Control area: 100 pixels (multiple control rows)

    Visual elements:
    - Main display: A circle whose size is controlled by a slider
    - Current value displayed prominently
    - Min/max markers on slider track
    - Step indicators (tick marks when step > 1)

    Meta-controls (controls that control the slider!):
    - Input field: "Min value" (changes slider minimum)
    - Input field: "Max value" (changes slider maximum)
    - Input field: "Step size" (changes increment)
    - The main slider updates when meta-controls change

    Behavior:
    - Changing min/max rebuilds the slider
    - Step size shows as tick marks
    - Circle size responds to slider value
    - Shows how slider parameters affect behavior

    Educational annotations:
    - "Smaller step = finer control" when step < 1
    - "Larger range = coarser control" when range > 100
    - Live code display showing current createSlider() call

    Color scheme:
    - Circle: blue with white stroke
    - Slider track: gray
    - Value display: black

    Implementation: p5.js with createSlider() and input fields
</details>

## Button Control: The Discrete Decision Maker

A **button control** triggers a specific action when clicked. Unlike sliders that adjust values continuously, buttons execute commands: start, stop, reset, change mode.

### Why Buttons Work

Buttons provide:

- **Clear action**: One click, one result
- **Visible state**: Labels tell users what will happen
- **Feedback**: Visual response confirms the click
- **Simplicity**: No ambiguity about what happens

### The createButton() Function

The `createButton()` function creates a clickable button:

```javascript
let myButton = createButton('Label Text');
myButton.position(x, y);
myButton.mousePressed(callbackFunction);
```

### Button Example

```javascript
let startButton;
let counter = 0;

function setup() {
  createCanvas(400, 400);

  startButton = createButton('Click Me!');
  startButton.position(150, 360);
  startButton.mousePressed(handleClick);
}

function handleClick() {
  counter++;  // Increment on each click
}

function draw() {
  background(240, 248, 255);

  // Display click count
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(0);
  text("Clicks: " + counter, width/2, height/2);
}
```

### Button Styling

Style buttons using the `.style()` method:

```javascript
let resetButton = createButton('Reset');
resetButton.position(10, drawHeight + 10);
resetButton.style('font-size', '14px');
resetButton.style('padding', '8px 16px');
resetButton.style('background-color', '#4CAF50');
resetButton.style('color', 'white');
resetButton.style('border', 'none');
resetButton.style('border-radius', '4px');
resetButton.style('cursor', 'pointer');
```

## The Control Button Family: Start, Stop, Pause, Reset

Every animation-based MicroSim needs a family of control buttons. Let's meet the whole crew:

### Start Button

The **start button** begins or resumes the animation:

```javascript
let startButton;
let isRunning = false;

function setup() {
  startButton = createButton('Start');
  startButton.mousePressed(startAnimation);
}

function startAnimation() {
  isRunning = true;
  startButton.html('Running...');
}
```

### Stop Button

The **stop button** halts the animation completely (often resetting to initial state):

```javascript
let stopButton;

function setup() {
  stopButton = createButton('Stop');
  stopButton.mousePressed(stopAnimation);
}

function stopAnimation() {
  isRunning = false;
  resetToInitialState();  // Also reset
}
```

### Pause Button

The **pause button** freezes the animation without resetting—so users can resume later:

```javascript
let pauseButton;
let isPaused = false;

function setup() {
  pauseButton = createButton('Pause');
  pauseButton.mousePressed(togglePause);
}

function togglePause() {
  isPaused = !isPaused;
  pauseButton.html(isPaused ? 'Resume' : 'Pause');
}
```

### Reset Button

The **reset button** returns all parameters to their default values:

```javascript
let resetButton;

function setup() {
  resetButton = createButton('Reset');
  resetButton.mousePressed(resetSimulation);
}

function resetSimulation() {
  // Reset all variables to initial values
  ball.x = initialX;
  ball.y = initialY;
  ball.vx = 0;
  ball.vy = 0;

  // Reset sliders to defaults
  speedSlider.value(5);
  gravitySlider.value(0.5);

  // Stop animation
  isRunning = false;
}
```

### The Complete Button Family

| Button | Action | State Change | Label Change |
|--------|--------|--------------|--------------|
| **Start** | Begin animation | isRunning → true | "Start" → "Running" |
| **Stop** | Halt and reset | isRunning → false | Optional |
| **Pause** | Freeze in place | isPaused toggle | "Pause" ↔ "Resume" |
| **Reset** | Restore defaults | All values reset | Usually static |

## Input Handling: The Big Picture

**Input handling** is the overall process of detecting and responding to user actions. In p5.js, input comes from three main sources:

1. **DOM Controls**: Sliders, buttons, text inputs
2. **Mouse Events**: Clicks, drags, movement
3. **Keyboard Events**: Key presses and releases

Each input type uses a different handling pattern:

```javascript
// DOM Controls: Callback functions
slider.input(handleSliderChange);
button.mousePressed(handleButtonClick);

// Mouse Events: Built-in p5.js functions
function mousePressed() { /* handle click */ }
function mouseDragged() { /* handle drag */ }

// Keyboard Events: Built-in p5.js functions
function keyPressed() { /* handle key */ }
```

## Mouse Events: Point and Click Power

**Mouse events** let users interact directly with the canvas—clicking on objects, dragging elements, and responding to cursor position.

### The mousePressed() Function

The `mousePressed()` function runs once when the user clicks:

```javascript
function mousePressed() {
  // Check if click is in drawing area
  if (mouseY < drawHeight) {
    // Create new object at click position
    objects.push({
      x: mouseX,
      y: mouseY,
      size: 20
    });
  }
}
```

### Using mouseX and mouseY

p5.js provides real-time cursor position:

| Variable | Description |
|----------|-------------|
| `mouseX` | Current horizontal position |
| `mouseY` | Current vertical position |
| `pmouseX` | Previous frame's X position |
| `pmouseY` | Previous frame's Y position |
| `mouseIsPressed` | Boolean: is button held down? |

### The mouseDragged() Function

The `mouseDragged()` function runs continuously while dragging:

```javascript
let dragging = false;
let dragObject = null;

function mousePressed() {
  // Check if we clicked on an object
  for (let obj of objects) {
    if (dist(mouseX, mouseY, obj.x, obj.y) < obj.size/2) {
      dragging = true;
      dragObject = obj;
      break;
    }
  }
}

function mouseDragged() {
  if (dragging && dragObject) {
    dragObject.x = mouseX;
    dragObject.y = mouseY;
  }
}

function mouseReleased() {
  dragging = false;
  dragObject = null;
}
```

#### Diagram: Mouse Event Demo MicroSim

<details markdown="1">
    <summary>Mouse Event Interactive Demo</summary>
    Type: microsim

    Learning objective: Demonstrate mousePressed(), mouseDragged(), and mouseReleased() through interactive drawing (Bloom: Apply, Analyze)

    Canvas layout:
    - Drawing area: 400x350 pixels (acts as drawing canvas)
    - Control area: 50 pixels for clear button

    Visual elements:
    - Blank canvas that users can draw on
    - Current mouse position displayed
    - Different colors for different actions:
      - Blue dots on click (mousePressed)
      - Red line while dragging (mouseDragged)
      - Green dot on release (mouseReleased)
    - Event log showing recent events

    Interactive features:
    - Click anywhere: Blue dot appears
    - Click and drag: Red trail follows cursor
    - Release: Green dot marks end
    - Event type displayed in corner

    Controls:
    - Button: "Clear Canvas"
    - Toggle: "Show Event Log"

    Behavior:
    - Drawing persists until cleared
    - Event log shows last 5 events
    - Position coordinates update in real-time
    - Clear demonstration of each event type

    Educational annotations:
    - "mousePressed() fires once per click"
    - "mouseDragged() fires continuously while dragging"
    - "mouseX, mouseY always available"

    Color scheme:
    - Click dots: blue
    - Drag trails: red with alpha
    - Release dots: green
    - Background: white

    Implementation: p5.js with mousePressed, mouseDragged, mouseReleased
</details>

### Click Detection: Is the User Clicking on Something?

A common pattern is detecting if a click hit a specific object:

```javascript
function mousePressed() {
  // Check if click is on the ball
  let d = dist(mouseX, mouseY, ball.x, ball.y);
  if (d < ball.radius) {
    ball.selected = true;
    console.log("Ball clicked!");
  }

  // Check if click is on a rectangle
  if (mouseX > rect.x && mouseX < rect.x + rect.width &&
      mouseY > rect.y && mouseY < rect.y + rect.height) {
    rect.selected = true;
  }
}
```

## Keyboard Events: Keys to Control

**Keyboard events** provide an alternative input method, great for quick actions, shortcuts, and game-like interactions.

### The keyPressed() Function

The `keyPressed()` function runs once when a key is pressed:

```javascript
function keyPressed() {
  if (key === ' ') {  // Spacebar
    isRunning = !isRunning;  // Toggle animation
  }

  if (key === 'r' || key === 'R') {
    resetSimulation();
  }

  if (keyCode === LEFT_ARROW) {
    moveLeft();
  }

  if (keyCode === RIGHT_ARROW) {
    moveRight();
  }
}
```

### Key Variables

| Variable | Description | Example Values |
|----------|-------------|----------------|
| `key` | The character pressed | 'a', 'B', '5', ' ' |
| `keyCode` | Numeric code | 65 (A), 32 (space) |
| `keyIsPressed` | Boolean: key held? | true/false |

### Special Key Codes

```javascript
// Arrow keys
LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW

// Modifier keys
SHIFT, CONTROL, ALT

// Other special keys
ENTER, RETURN, BACKSPACE, DELETE, ESCAPE, TAB
```

### Keyboard Shortcuts Table

Document keyboard shortcuts for users:

| Key | Action |
|-----|--------|
| `Space` | Start/Pause animation |
| `R` | Reset simulation |
| `↑` `↓` | Increase/decrease speed |
| `←` `→` | Adjust parameter |
| `Escape` | Stop simulation |

## Event Handlers: The Responders

**Event handlers** are functions that respond to specific events. In p5.js, there are two types:

1. **Built-in handlers**: Predefined function names (mousePressed, keyPressed)
2. **Callback handlers**: Functions you assign to DOM elements

### Built-in Event Handler Functions

```javascript
// Mouse handlers
function mousePressed() { }   // Click down
function mouseReleased() { }  // Click up
function mouseMoved() { }     // Mouse movement (no click)
function mouseDragged() { }   // Move while clicking
function mouseWheel(event) { } // Scroll wheel

// Keyboard handlers
function keyPressed() { }     // Key down
function keyReleased() { }    // Key up
function keyTyped() { }       // Character typed
```

### Callback Event Handlers

For DOM elements, you assign callbacks:

```javascript
// Button callback
myButton.mousePressed(handleButtonClick);
myButton.mouseOver(handleHover);
myButton.mouseOut(handleLeave);

// Slider callback
mySlider.input(handleSliderChange);  // Fires while dragging
mySlider.changed(handleSliderDone);  // Fires when released

// The callback functions
function handleButtonClick() {
  console.log("Button was clicked!");
}

function handleSliderChange() {
  console.log("Slider value: " + this.value());
}
```

#### Diagram: Event Handler Flow

<details markdown="1">
    <summary>Event Handler Flow Diagram</summary>
    Type: diagram

    Purpose: Show how events flow from user action to handler function (Bloom: Understand)

    Layout: Left-to-right flow diagram

    Components:
    1. User Action (left side):
       - Mouse click icon
       - Keyboard icon
       - Slider icon

    2. Event Detection (middle):
       - "p5.js Event System" box
       - Arrows showing event routing

    3. Event Handlers (right side):
       - mousePressed() function box
       - keyPressed() function box
       - slider.input() callback box

    4. Response (far right):
       - State changes
       - Visual updates
       - Animation control

    Flow arrows:
    - User clicks → mousePressed() → update state
    - User types → keyPressed() → update state
    - User drags slider → input callback → parameter change

    Visual style:
    - Rounded boxes for functions
    - Arrows showing data flow
    - Color coding by event type

    Annotations:
    - "Built-in handlers have special names"
    - "Callbacks are assigned to elements"
    - "State changes trigger visual updates in draw()"

    Color scheme:
    - Mouse events: blue
    - Keyboard events: green
    - DOM events: orange
    - State/response: purple

    Implementation: Mermaid.js or static SVG
</details>

## User Interaction: Designing for Humans

**User interaction** encompasses all the ways users engage with your MicroSim. Good interaction design makes simulations intuitive and enjoyable.

### Interaction Design Principles

1. **Immediate feedback**: Every action should produce visible results
2. **Consistent behavior**: Similar controls should work similarly
3. **Clear affordances**: Controls should look interactive
4. **Error prevention**: Make it hard to do the wrong thing
5. **Forgiving design**: Easy to undo or reset

### Providing Feedback

Users need to know their actions had effect:

```javascript
function draw() {
  // Visual feedback for button hover
  if (isHovering) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }

  // Visual feedback for slider adjustment
  if (speedChanged) {
    // Briefly highlight the affected element
    fill(255, 255, 0, fadeAmount);
    rect(ball.x - 5, ball.y - 5, 30, 30);
    fadeAmount -= 5;
  }
}
```

## The isRunning State Pattern

The **isRunning state** is a boolean variable that controls whether your animation is active. This simple pattern is essential for playable, pauseable simulations.

### Basic isRunning Pattern

```javascript
let isRunning = false;

function draw() {
  background(240, 248, 255);

  // Only update physics when running
  if (isRunning) {
    updatePhysics();
  }

  // Always draw current state
  drawVisualization();
  drawControls();
}

function toggleRunning() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}
```

### Extended State Pattern

For more complex simulations, use multiple state variables:

```javascript
let isRunning = false;
let isPaused = false;
let isComplete = false;

function draw() {
  background(240, 248, 255);

  if (isRunning && !isPaused && !isComplete) {
    updateSimulation();

    if (checkCompletion()) {
      isComplete = true;
      showResults();
    }
  }

  drawVisualization();
}
```

### State Diagram

| State | isRunning | isPaused | Animation |
|-------|-----------|----------|-----------|
| Stopped | false | false | Static |
| Running | true | false | Animating |
| Paused | true | true | Frozen |
| Complete | false | false | Final state |

## Animation Control: Start, Stop, and Smooth

**Animation control** manages the flow of your simulation—starting it, stopping it, and controlling its speed.

### The Complete Animation Controller

```javascript
let isRunning = false;
let isPaused = false;
let startButton, pauseButton, resetButton;

function setup() {
  createCanvas(400, 450);

  startButton = createButton('Start');
  startButton.position(20, 410);
  startButton.mousePressed(toggleStart);

  pauseButton = createButton('Pause');
  pauseButton.position(100, 410);
  pauseButton.mousePressed(togglePause);
  pauseButton.attribute('disabled', '');  // Disabled until started

  resetButton = createButton('Reset');
  resetButton.position(180, 410);
  resetButton.mousePressed(resetAll);
}

function toggleStart() {
  isRunning = !isRunning;
  isPaused = false;

  if (isRunning) {
    startButton.html('Stop');
    pauseButton.removeAttribute('disabled');
  } else {
    startButton.html('Start');
    pauseButton.attribute('disabled', '');
    pauseButton.html('Pause');
  }
}

function togglePause() {
  if (isRunning) {
    isPaused = !isPaused;
    pauseButton.html(isPaused ? 'Resume' : 'Pause');
  }
}

function resetAll() {
  isRunning = false;
  isPaused = false;

  // Reset all simulation variables
  initializeSimulation();

  // Reset UI
  startButton.html('Start');
  pauseButton.html('Pause');
  pauseButton.attribute('disabled', '');
}

function draw() {
  background(240, 248, 255);

  if (isRunning && !isPaused) {
    updateSimulation();
  }

  drawSimulation();
  drawControlRegion();
}
```

#### Diagram: Complete Control Panel MicroSim

<details markdown="1">
    <summary>Animation Control Panel Demo</summary>
    Type: microsim

    Learning objective: Demonstrate the complete start/stop/pause/reset pattern with a simple animation (Bloom: Apply, Analyze)

    Canvas layout:
    - Drawing area: 400x350 pixels
    - Control area: 50 pixels for buttons

    Visual elements:
    - Bouncing ball animation
    - Current state indicator (Running/Paused/Stopped)
    - Frame counter showing animation progress
    - Button row with all four controls

    Buttons:
    - Start/Stop toggle button (changes label based on state)
    - Pause/Resume toggle button (disabled when stopped)
    - Reset button (always enabled)
    - State indicator text

    State visualization:
    - Green glow when running
    - Yellow glow when paused
    - Gray when stopped
    - Clear state label

    Behavior:
    - Start: Ball begins bouncing
    - Stop: Ball stops and resets to center
    - Pause: Ball freezes in current position
    - Resume: Ball continues from paused position
    - Reset: Ball returns to center, all values reset

    Transitions:
    - Stopped → Running (Start)
    - Running → Stopped (Stop)
    - Running → Paused (Pause)
    - Paused → Running (Resume)
    - Any → Stopped (Reset)

    Educational emphasis:
    - Clear state visualization
    - Button label changes reflect current state
    - Disabled states prevent invalid actions

    Implementation: p5.js with isRunning, isPaused pattern
</details>

## Speed Control: From Slow Motion to Fast Forward

**Speed control** lets users adjust how fast the simulation runs. This is invaluable for understanding complex dynamics—slow down to see details, speed up to see patterns.

### Speed Multiplier Pattern

```javascript
let speedSlider;
let baseSpeed = 2;

function setup() {
  speedSlider = createSlider(0.1, 3, 1, 0.1);  // 0.1x to 3x speed
  speedSlider.position(100, drawHeight + 15);
}

function draw() {
  if (isRunning) {
    let speedMultiplier = speedSlider.value();
    let actualSpeed = baseSpeed * speedMultiplier;

    ball.x += ball.vx * actualSpeed;
    ball.y += ball.vy * actualSpeed;
  }
}
```

### Frame-Independent Speed

For consistent physics regardless of frame rate:

```javascript
let lastTime = 0;

function draw() {
  let currentTime = millis();
  let deltaTime = (currentTime - lastTime) / 1000;  // Seconds
  lastTime = currentTime;

  if (isRunning) {
    let speedMultiplier = speedSlider.value();
    ball.x += ball.vx * speedMultiplier * deltaTime * 60;  // Normalize to 60fps
    ball.y += ball.vy * speedMultiplier * deltaTime * 60;
  }
}
```

### Speed Control UI

Label speed controls clearly:

```javascript
function drawSpeedLabel() {
  let speed = speedSlider.value();
  let label;

  if (speed < 0.5) {
    label = "Slow Motion (" + speed.toFixed(1) + "x)";
  } else if (speed > 1.5) {
    label = "Fast Forward (" + speed.toFixed(1) + "x)";
  } else {
    label = "Normal Speed (" + speed.toFixed(1) + "x)";
  }

  fill(0);
  textAlign(LEFT, CENTER);
  text("Speed: " + label, 20, drawHeight + 25);
}
```

## Parameter Adjustment: Tuning the Simulation

**Parameter adjustment** allows users to modify the values that control simulation behavior—gravity, friction, mass, spring constants, and more.

### Common Adjustable Parameters

| Parameter | Typical Range | Use Case |
|-----------|--------------|----------|
| Gravity | 0 - 2 | Physics simulations |
| Friction | 0 - 1 | Damping effects |
| Speed | 0.1 - 10 | Animation speed |
| Mass | 0.5 - 5 | Weight/inertia |
| Spring constant | 0.01 - 0.5 | Oscillation |
| Angle | 0 - 360 | Direction |
| Count | 1 - 100 | Number of objects |

### Multi-Parameter Control Panel

```javascript
let gravitySlider, frictionSlider, massSlider;

function setup() {
  createCanvas(400, 500);

  gravitySlider = createSlider(0, 2, 0.5, 0.1);
  gravitySlider.position(120, 410);

  frictionSlider = createSlider(0, 1, 0.1, 0.01);
  frictionSlider.position(120, 435);

  massSlider = createSlider(0.5, 5, 1, 0.5);
  massSlider.position(120, 460);
}

function draw() {
  // Physics with adjustable parameters
  let gravity = gravitySlider.value();
  let friction = frictionSlider.value();
  let mass = massSlider.value();

  ball.vy += gravity * mass;       // Gravity
  ball.vx *= (1 - friction);       // Friction
  ball.vy *= (1 - friction);
}

function drawParameterLabels() {
  fill(0);
  textSize(12);
  textAlign(LEFT, CENTER);

  text("Gravity:", 20, 420);
  text("Friction:", 20, 445);
  text("Mass:", 20, 470);

  textAlign(RIGHT, CENTER);
  text(gravitySlider.value().toFixed(1), 380, 420);
  text(frictionSlider.value().toFixed(2), 380, 445);
  text(massSlider.value().toFixed(1), 380, 470);
}
```

#### Diagram: Parameter Adjustment MicroSim

<details markdown="1">
    <summary>Physics Parameter Playground</summary>
    Type: microsim

    Learning objective: Allow students to experiment with physics parameters and observe effects on simulation behavior (Bloom: Apply, Analyze, Evaluate)

    Canvas layout:
    - Drawing area: 400x300 pixels
    - Control area: 100 pixels (3 rows of sliders)

    Visual elements:
    - Ball bouncing in the drawing area
    - Trail showing recent positions
    - Parameter values displayed next to sliders
    - Real-time physics calculations shown

    Parameters:
    1. Gravity slider (0 - 2, default 0.5)
       - 0 = zero gravity (floating)
       - 2 = heavy gravity (fast fall)
    2. Friction slider (0 - 0.3, default 0.05)
       - 0 = no friction (perpetual motion)
       - 0.3 = high friction (quick stop)
    3. Bounciness slider (0 - 1, default 0.8)
       - 0 = no bounce (absorbs energy)
       - 1 = perfect bounce (perpetual)

    Behavior:
    - Ball responds immediately to parameter changes
    - Trail helps visualize motion patterns
    - Extreme values produce obvious effects
    - Can demonstrate energy conservation/loss

    Preset buttons:
    - "Moon" (low gravity, no friction)
    - "Earth" (normal gravity, slight friction)
    - "Mud" (normal gravity, high friction)

    Educational annotations:
    - Physics formulas displayed
    - Energy indicator (kinetic + potential)
    - "Energy lost to friction: X%"

    Color scheme:
    - Ball: blue
    - Trail: fading blue
    - Energy indicator: green to red gradient

    Implementation: p5.js with multiple sliders
</details>

## Putting It All Together: The Complete Control System

Here's a complete example combining all the controls we've learned:

```javascript
// Complete Control System Example
let canvasWidth = 400;
let drawHeight = 300;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;

// Simulation state
let isRunning = false;
let isPaused = false;
let ball = { x: 200, y: 150, vx: 3, vy: 0 };

// Controls
let startButton, pauseButton, resetButton;
let speedSlider, gravitySlider;

function setup() {
  createCanvas(canvasWidth, canvasHeight);

  // Buttons
  startButton = createButton('Start');
  startButton.position(20, drawHeight + 10);
  startButton.mousePressed(toggleStart);

  pauseButton = createButton('Pause');
  pauseButton.position(80, drawHeight + 10);
  pauseButton.mousePressed(togglePause);
  pauseButton.attribute('disabled', '');

  resetButton = createButton('Reset');
  resetButton.position(150, drawHeight + 10);
  resetButton.mousePressed(resetAll);

  // Sliders
  speedSlider = createSlider(0.1, 3, 1, 0.1);
  speedSlider.position(80, drawHeight + 45);
  speedSlider.size(120);

  gravitySlider = createSlider(0, 1, 0.3, 0.05);
  gravitySlider.position(280, drawHeight + 45);
  gravitySlider.size(100);

  describe('Bouncing ball with complete animation controls');
}

function toggleStart() {
  isRunning = !isRunning;
  isPaused = false;
  updateButtonStates();
}

function togglePause() {
  if (isRunning) {
    isPaused = !isPaused;
    pauseButton.html(isPaused ? 'Resume' : 'Pause');
  }
}

function resetAll() {
  isRunning = false;
  isPaused = false;
  ball = { x: 200, y: 150, vx: 3, vy: 0 };
  speedSlider.value(1);
  gravitySlider.value(0.3);
  updateButtonStates();
}

function updateButtonStates() {
  startButton.html(isRunning ? 'Stop' : 'Start');
  pauseButton.html('Pause');
  if (isRunning) {
    pauseButton.removeAttribute('disabled');
  } else {
    pauseButton.attribute('disabled', '');
  }
}

function draw() {
  // Drawing region
  background(240, 248, 255);

  // Update physics if running
  if (isRunning && !isPaused) {
    let speed = speedSlider.value();
    let gravity = gravitySlider.value();

    ball.vy += gravity * speed;
    ball.x += ball.vx * speed;
    ball.y += ball.vy * speed;

    // Bounce off walls
    if (ball.x < 20 || ball.x > canvasWidth - 20) {
      ball.vx *= -1;
      ball.x = constrain(ball.x, 20, canvasWidth - 20);
    }
    if (ball.y > drawHeight - 20) {
      ball.vy *= -0.8;
      ball.y = drawHeight - 20;
      if (abs(ball.vy) < 0.5) ball.vy = 0;
    }
  }

  // Draw ball
  fill(100, 150, 255);
  stroke(50, 100, 200);
  strokeWeight(2);
  circle(ball.x, ball.y, 40);

  // Control region
  fill(255);
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke(200);
  line(0, drawHeight, canvasWidth, drawHeight);

  // Labels
  fill(0);
  noStroke();
  textSize(12);
  textAlign(LEFT, CENTER);
  text("Speed:", 20, drawHeight + 55);
  text("Gravity:", 220, drawHeight + 55);

  // State indicator
  textAlign(RIGHT, TOP);
  if (isRunning && !isPaused) {
    fill(0, 150, 0);
    text("▶ Running", canvasWidth - 10, drawHeight + 10);
  } else if (isPaused) {
    fill(200, 150, 0);
    text("⏸ Paused", canvasWidth - 10, drawHeight + 10);
  } else {
    fill(100);
    text("⏹ Stopped", canvasWidth - 10, drawHeight + 10);
  }
}

// Keyboard shortcuts
function keyPressed() {
  if (key === ' ') {
    if (isRunning) {
      togglePause();
    } else {
      toggleStart();
    }
  }
  if (key === 'r' || key === 'R') {
    resetAll();
  }
}

// Click to reposition ball
function mousePressed() {
  if (mouseY < drawHeight) {
    ball.x = mouseX;
    ball.y = mouseY;
    ball.vx = random(-3, 3);
    ball.vy = 0;
  }
}
```

## Key Takeaways

You've now mastered the controls that put users in control! Here are the essential insights:

1. **Slider controls** (`createSlider()`) handle continuous values with min, max, default, and step parameters.

2. **Button controls** (`createButton()`) trigger discrete actions with callback functions.

3. The **control button family** (Start, Stop, Pause, Reset) provides complete animation control.

4. **Mouse events** (`mousePressed()`, `mouseDragged()`) enable direct canvas interaction.

5. **Keyboard events** (`keyPressed()`) provide shortcuts and alternative input.

6. **Event handlers** respond to user actions—both built-in and callback-based.

7. **User interaction** design prioritizes feedback, consistency, and forgiveness.

8. The **isRunning state** pattern controls animation with a simple boolean.

9. **Animation control** combines state management with button interactions.

10. **Speed control** uses multipliers to adjust simulation pace.

11. **Parameter adjustment** lets users tune simulation behavior with sliders.

12. **Input handling** unifies all input sources into a coherent control system.

??? question "Challenge: Add a keyboard shortcut"
    Take one of your existing MicroSims and add keyboard shortcuts for common actions. Use spacebar for start/pause, 'R' for reset, and arrow keys for parameter adjustment. How does this improve the user experience?

## Next Steps

You're now in *complete control* of user controls! Your MicroSims can respond to sliders, buttons, mouse clicks, and keyboard shortcuts. In the next chapter, we'll explore **physics and motion**—making objects move realistically with gravity, bouncing, and more.

Remember: good controls should be invisible. When users stop thinking about *how* to interact and start focusing on *what* they're learning, you've mastered the art of control.

Now go forth and *take control*!

## References

- [p5.js DOM Reference](https://p5js.org/reference/#group-DOM) - Complete DOM control documentation
- [p5.js Events Reference](https://p5js.org/reference/#group-Events) - Mouse and keyboard events
- [UI/UX Design Principles](https://www.interaction-design.org/literature/topics/ui-design-patterns) - Interaction design patterns
- [Fitts's Law](https://www.interaction-design.org/literature/topics/fitts-law) - Button sizing and positioning
