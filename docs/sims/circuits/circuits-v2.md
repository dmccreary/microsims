# Circuits

## Background

Creating a simulation of a basic electrical circuit with an on/off switch, a battery, and a light bulb is a great way to teach students about electricity and circuits. We'll use p5.js to create this interactive simulation. In this simulation, students can toggle the switch to turn the light bulb on and off, visually seeing how closing and opening a circuit works.

Here's a basic outline of the p5.js code for this simulation:

1. **Setup:** Define the canvas and initial state of the switch (on or off).
2. **Draw:** Render the battery, switch, and light bulb. The light bulb's brightness changes based on the switch's state.
3. **Mouse Interaction:** Allow the switch to be toggled on and off with a mouse click.

## Classroom Implementation Ideas

**Concept Visualization:** Use this simulation to help students visualize how a simple circuit works, emphasizing the role of each component.
**Interactive Learning:** Encourage students to toggle the switch and observe changes, fostering understanding through interaction.
**Critical Thinking:** Pose questions like "What happens if the battery is reversed?" or "What changes if we add another light bulb?"

## Further Extensions

**Additional Components:** Introduce resistors or variable resistors (like a potentiometer) to the circuit.
**Circuit Diagrams:** Have students draw the circuit diagram based on the simulation, then build the actual circuit using physical components.
**Exploring Variables:** Modify the code to represent different battery voltages or bulb wattages.

## Demos of Circuits

1. [Simple Circuit](./circuits.html)
2. [Switch](./switch.md)
3. [Battery With LED Circuit](./battery-circuit.md)
4. [Wire Animate](./wire-animate.md)
5. [Motor Circuit](./motor.md)
6. [H-Bridge](./h-bridge.md)

## Sample Prompt

```linenubs="0"
Create a single file p5.js sketch on a 300x200 canvas.
Subject: simple electrical circiuts.
Create a simulation of an electrical circuit with a batter, an on/off switch, a light bulb and the connecting wires.
Make the default text size be 16.
Add the title "Click Anywhere to Toggle The Switch" to the top of the canvas.
Place the battery standing vertically on the left with the positive side up and the negative side down.
Draw the top of the battery as a gold rectangle on the top with a "+" on it.
Draw the bottom of the battery as a black rectangle "-" near the bottom.
The top row of connection points are at y=50.
The bottom row of connection points are at y=150.
Make the wires toogle from black (circuit off) to red (circuit on).
Make all the wires width 3.
Make the switch be a rectangle that is horizontal and 50px wide when on.
Make the swtich rectangle rotate up 45 degrees when the switch is off.
Complete the circuit with the light going to the negative battery terminal in a column at x=250.
Make sure to reset the stroke width to 0 after drawing wires.
Allow the user to click anywhere on the canvas to toggle the switch.

```

## Sample Code

```js
let switchOn = false; // Initial state of the switch
let switchAngle = 45; // Angle of the switch when off

function setup() {
  createCanvas(300, 200);
  textSize(16);
}

function draw() {
  background(220);

  // Draw title
  fill(0);
  strokeWeight(0);
  text("Click Anywhere to Toggle The Switch", 10, 20);

  // Draw the battery
  drawBattery();

  // Draw the switch
  drawSwitch();

  // Draw the light bulb
  drawLightBulb();

  // Draw wires
  drawWires();
}

function drawBattery() {
  fill('grey');
  rect(20, 100, 20, 50); // battery body
  rect(20, 95, 20, 5); // positive terminal
  rect(20, 150, 20, 5); // negative terminal
}

function drawSwitch() {
  push();
    translate(80, 50); // Move origin to switch pivot
    rotate(radians(switchOn ? 0 : switchAngle)); // Rotate when off
    fill('black');
    rect(0, 0, 50, 10); // switch
  pop();
}

function drawLightBulb() {
  if (switchOn) {
    fill('yellow');
  } else {
    fill('white');
  }
  ellipse(250, 50, 30, 30); // light bulb
}

function drawWires() {
  stroke(switchOn ? 'red' : 'black');
  strokeWeight(3);

  // Wire from battery top to switch
  line(40, 100, 40, 50);
  line(40, 50, 80, 50);

  // Wire from switch to light bulb
  line(130, 50, 250, 50);

  // Wire from light bulb to battery bottom
  line(250, 50, 250, 150);
  line(250, 150, 40, 150);
}

function mousePressed() {
  switchOn = !switchOn; // Toggle the switch
  switchAngle = switchOn ? 0 : 45; // Adjust switch angle
}

```