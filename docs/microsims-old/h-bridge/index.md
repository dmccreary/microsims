---
title: "H-Bridge Circuit"
description: "Click the four knife switches of an H-bridge, or press Forward, Stop, or Reverse, and watch green or purple current flow spin the motor. A short circuit flashes the wires red."
quality_score: 95
image: /microsims-old/h-bridge/h-bridge.png
og:image: /microsims-old/h-bridge/h-bridge.png
twitter:image: /microsims-old/h-bridge/h-bridge.png
social:
   cards: false
status: implemented
---
# H-Bridge Circuit

<iframe src="main.html" width="100%" height="532px" scrolling="no"></iframe>

Copy this iframe to your website:

```html
<iframe src="https://dmccreary.github.io/microsims/microsims-old/h-bridge/main.html" width="100%" height="532px" scrolling="no"></iframe>
```

[Run the H-Bridge Circuit MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

## Description

An **H-bridge** is a circuit that lets a robot run a motor forward *or* backward.
It uses four switches arranged like the letter "H," with the motor in the middle bar.
Closing two switches on opposite corners sends current through the motor one way.
Closing the other two corners sends current through it the other way.

In this MicroSim, each switch is a **knife switch**, which is a metal blade on a hinge.
When the blade drops into its clip, the switch is closed (ON) and current can pass.
When the blade swings out, the switch is open (OFF) and current stops.

### How to Use It

1. **Click any switch** on the drawing to flip it ON or OFF. You can also press the keys **1**, **2**, **3**, and **4**.
2. **Press Forward, Stop, or Reverse** below the drawing to set all four switches at once. The keys **F**, **S**, and **R** do the same thing.
3. **Move your mouse over the MicroSim** to run the animation. It pauses when your mouse leaves, so it won't distract you while you read.
4. **Read the message** under the circuit. It tells you what your switches are doing to the motor.

The switches are numbered in reading order: **S1** is top-left, **S2** is top-right, **S3** is bottom-left, and **S4** is bottom-right.

### What the Colors Mean

| What you see | What it means |
|--------------|---------------|
| Solid red wire across the top | The **+5V** power wire |
| Solid black wire across the bottom | The **GND** (ground, 0 volts) wire |
| Green dots flowing | Forward current: S1 and S4 are closed and current goes left to right through the motor |
| Purple dots flowing | Reverse current: S2 and S3 are closed and current goes right to left through the motor |
| Green circle arrows | The motor spins clockwise |
| Purple circle arrows | The motor spins counterclockwise |
| Wide red wires flashing | A **short circuit**: power is flowing straight from +5V to GND |

The dots show **conventional current**, which engineers draw flowing from + to −.
(Electrons really drift the other way, but we use the + to − rule on every circuit drawing.)

!!! mascot-warning "Watch Out for Shorts!"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Never close both switches on the same side, like S1 and S3. That makes a path from +5V straight to GND with no motor in the way. Real motor driver chips have protection so our code can't do this by accident.

### What to Try

- Close only **S1**. Why doesn't the motor turn?
- Close **S1 and S2**. Both motor wires now touch +5V. With no difference in voltage, no current flows, so the motor stays still.
- Press **Forward** and then **Reverse**. Trace the dots with your finger. Which parts of the path change, and which stay the same?

Here is the same circuit drawn as a simple block diagram.
Try matching each box to a switch in the MicroSim.

![A block diagram of an H-bridge with SW1 top-left, SW2 top-right, SW3 bottom-left, SW4 bottom-right, and the motor in the center bar between a red top wire and a gray bottom wire](../../img/h-bridge.png)

*The H-bridge lets the same motor spin in both directions.*

## Lesson Plan

### Learning Objectives

After using this MicroSim, students will be able to:

1. **Explain** (Understand) how closing diagonally opposite switches (S1 + S4 or S2 + S3) sets the direction of current through a DC motor.
2. **Predict** (Apply) the motor's direction, or lack of motion, for any combination of the four switches.
3. **Analyze** (Analyze) a switch combination to decide whether it drives the motor, stops it, or creates a short circuit (shoot-through).
4. **Relate** (Understand) the four switches to the transistors inside the robot's motor driver IC.

### Target Audience

Students in grades 8–12 with no prior electronics background. The MicroSim also works as a quick visual reference for instructors introducing motor drivers.

### Prerequisites

- A circuit needs a complete loop from + to − for current to flow.
- A DC motor reverses direction when the two motor wires are swapped (see [Motor Direction](https://dmccreary.github.io/stem-robots/lessons/15-motor-direction/)).
- The terms *open* and *closed* as applied to a switch.

### Time and Materials

- **Time:** 15–20 minutes
- **Materials:** One device with a web browser per student or pair; a printed or whiteboard copy of the switch-combination table below.

### Activities

1. **Predict, then test (5 minutes).** Load the MicroSim with all switches open. Ask students to predict which *two* switches must close to make the motor spin, and to write the prediction down before clicking anything. Students then click switches on the canvas to test the prediction.
2. **Trace the current path (3 minutes).** Students press **Forward** and trace the green dots from +5V to GND, naming each switch the current passes through. Repeat with **Reverse** and the purple dots. Ask: which wires carry current in both directions?
3. **Complete the switch table (7 minutes).** In pairs, students test each two-switch combination and record the result.

    | Closed switches | Motor result |
    |-----------------|--------------|
    | S1 + S4 | |
    | S2 + S3 | |
    | S1 + S2 | |
    | S3 + S4 | |
    | S1 + S3 | |
    | S2 + S4 | |

4. **Find every short (3 minutes).** Students identify every combination that flashes red and state a single rule that predicts all of them ("both switches on the same leg closed").
5. **Connect to the robot (2 minutes).** Explain that the Cytron Maker Pi RP2040's motor driver chip contains an H-bridge built from transistors instead of knife switches. Our MicroPython code picks which transistors turn on, and the chip's built-in protection prevents shoot-through.

### Differentiation

- **Support:** Have struggling students use only the Forward, Stop, and Reverse buttons first, then change one switch at a time from a working state.
- **Extension:** Ask advanced students why S1 + S2 or S3 + S4 is called *braking*, and how braking differs from simply opening every switch (coasting).

### Assessment

Use these as an exit ticket or quick formative check:

1. Which two switches make the motor spin clockwise in this MicroSim? *(S1 and S4)*
2. A student closes S2 and S4. What happens, and why is it dangerous for a real circuit? *(Short circuit: +5V connects straight to GND, which can overheat wires, drain the battery, or destroy the switching transistors.)*
3. S3 and S4 are closed and the other two are open. Is the motor spinning? Explain. *(No. Both motor wires connect to GND, so there is no voltage difference across the motor.)*
4. Sketch the H-bridge and draw arrows showing the reverse current path. *(+5V → S2 → motor right to left → S3 → GND)*

## Version History

This MicroSim was first built by hand from a short text prompt, with three buttons and animated wires.
The current version adds clickable switches, short-circuit detection, direction-colored current, and a spinning motor.
The original hand-coded version is saved in this repository's git history.

??? note "The original prompt and the generated response"

    ```linenums="0"
    Generate a single p5.js sketch file.

    Draw an H-bridge circuit for reversing the direction of a DC motor.

    Have three state buttons for "Forward", "Stop" and "Reverse".
    Place the positive power rail at the top of the circuit.
    Place the negative rail at the bottom of the circuit.
    Place the motor in the center of the H-brige ciricut.
    Animate the motor moving clockwise for the Forward state.
    Animate the motor going counter-clockwise for the Reverse state.
    Make the motor stopped for the Stop state.
    Have the upper left and lower right wires animate current for the Forward state.
    Have the upper right and lower left wires animate current for the Reverse state.
    Turn off all wire animation for the Stop state.

    Create four knife switches.
    Have the upper left and lower right be closed for Forward.
    Have the upper right and lower left be closed for Reverse.
    Have all the switches be open for Stop.

    Use the following function to draw current in a wire:

    function drawAnimatedWire(x1, y1, x2, y2, speed1, state) {
        if (state) {
            let distance = dist(x1, y1, x2, y2);
            let circlePos = map((millis() * speed1) % distance, 0, distance, 0, 1);

            // lerp generates the percent between two values
            let x = lerp(x1, x2, circlePos);
            let y = lerp(y1, y2, circlePos);

            stroke(0);
            strokeWeight(lineWidth)
            line(x1, y1, x2, y2); // Draw the wire

            fill(255, 0, 0);
            noStroke();
            circle(x, y, 10); // Draw the moving circle (electron)
        } else {
            stroke(0);
            strokeWeight(lineWidth)
            line(x1, y1, x2, y2); // Draw the wire
        }
    }
    ```

    **Response:**

    ```js
    let forwardButton;
    let stopButton;
    let reverseButton;

    const lineWidth = 2;

    function setup() {
      createCanvas(400, 400);

      forwardButton = createButton('Forward');
      forwardButton.position(10, 10);
      forwardButton.mousePressed(forward);

      stopButton = createButton('Stop');
      stopButton.position(90, 10);
      stopButton.mousePressed(stop);

      reverseButton = createButton('Reverse');
      reverseButton.position(150, 10);
      reverseButton.mousePressed(reverse);
    }

    function forward() {
      // Code to control the H-bridge for forward motion
    }

    function stop() {
      // Code to stop the motor
    }

    function reverse() {
      // Code to control the H-bridge for reverse motion
    }

    function draw() {
      background(220);

      // Draw positive power rail
      stroke(0);
      strokeWeight(lineWidth);
      line(40, 60, width - 40, 60);

      // Draw negative power rail
      stroke(0);
      strokeWeight(lineWidth);
      line(40, height - 60, width - 40, height - 60);

      // Draw H-bridge circuit
      stroke(0);
      strokeWeight(lineWidth);
      line(width / 2 - 40, 60, width / 2 - 40, height - 60);
      line(width / 2 + 40, 60, width / 2 + 40, height - 60);
      line(width / 2 - 40, height / 2, width / 2 + 40, height / 2);

      // Draw motor
      noFill();
      stroke(0);
      strokeWeight(lineWidth);
      rect(width / 2 - 20, height / 2 - 20, 40, 40);

      // Draw wires with current
      let speed1 = 0.01;
      drawAnimatedWire(40, 60, width / 2 - 40, 60, speed1, forwardButton.elt.disabled);
      drawAnimatedWire(width / 2 + 40, 60, width - 40, 60, speed1, reverseButton.elt.disabled);
      drawAnimatedWire(40, height - 60, width / 2 - 40, height - 60, speed1, reverseButton.elt.disabled);
      drawAnimatedWire(width / 2 + 40, height - 60, width - 40, height - 60, speed1, forwardButton.elt.disabled);
    }

    function drawAnimatedWire(x1, y1, x2, y2, speed1, state) {
      if (state) {
        let distance = dist(x1, y1, x2, y2);
        let circlePos = map((millis() * speed1) % distance, 0, distance, 0, 1);

        // lerp generates the percent between two values
        let x = lerp(x1, x2, circlePos);
        let y = lerp(y1, y2, circlePos);

        stroke(0);
        strokeWeight(lineWidth);
        line(x1, y1, x2, y2); // Draw the wire

        fill(255, 0, 0);
        noStroke();
        circle(x, y, 10); // Draw the moving circle (electron)
      } else {
        stroke(0);
        strokeWeight(lineWidth);
        line(x1, y1, x2, y2); // Draw the wire
      }
    }
    ```

## References

1. [H-bridge](https://en.wikipedia.org/wiki/H-bridge) - accessed 2026-09-29 - Wikipedia - How four switches around a load reverse the current, including the shoot-through (short circuit) condition this MicroSim flashes red.
2. [Knife switch](https://en.wikipedia.org/wiki/Knife_switch) - accessed 2026-09-29 - Wikipedia - Background on the hinged-blade switch drawn in the MicroSim.
3. [Short circuit](https://en.wikipedia.org/wiki/Short_circuit) - accessed 2026-09-29 - Wikipedia - Why a low-resistance path from + to − is dangerous for batteries, wires, and transistors.
4. [Electric current](https://en.wikipedia.org/wiki/Electric_current) - accessed 2026-09-29 - Wikipedia - Explains conventional current direction, which the flowing dots follow.
5. [DC motor](https://en.wikipedia.org/wiki/DC_motor) - accessed 2026-09-29 - Wikipedia - How reversing the voltage across a brushed DC motor reverses its rotation.
6. [Motor Direction](https://dmccreary.github.io/stem-robots/lessons/15-motor-direction/) - STEM Robots - Lesson on reversing the robot's motors, with the same S1–S4 switch states.
7. [H-Bridge](https://dmccreary.github.io/stem-robots/lessons/16-h-bridge/) - STEM Robots - Lesson introducing the H-bridge circuit.
8. [p5.js Reference](https://p5js.org/reference/) - accessed 2026-09-29 - p5.js - Documentation for the JavaScript library used to build this MicroSim.
