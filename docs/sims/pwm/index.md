### Pulse-Width Modulation

![PWM](./pwm.png)

[Pulse-Width Modulation](./pwm.html){ .md-button .md-button--primary }

Pulse-width modulation is the way that microcontrollers send a precise signal to a 
device such as a motor controller.  This simulation models an old CRT oscilloscope display
with a bright green line on a black background.

## Sample Prompt

```linenums="0"
Generate a p5.js sketch file of a simulation of a static pulse width
   modulation (PWM) waveform on a 600x300 canvas.
Add a range control slider to adjust the Duty Cycle of the waveform.
Make the default Duty Cycle be 50%.
The min should be 0% and the max should be 100%.
Place the range control slider at the bottom of the canvas.
Make sure the range control slider has a width of 400px using the 
   style attribute.
At the end of the draw() function add a text() function that displays
   the label and value of the duty cycle.
```

## Sample Response

```js
// Pulse Wave Modulation (PWM) simulation
// Made to render like an old oscilloscope - lime green on black
let dutyCycleSlider;
let dutyCycle = 0.5; // Initialize to 50%
let cycles = 6;
let waveHeight = height/3

function setup() {
  const canvas = createCanvas(600, 200);
  canvas.parent('canvas-container');
  
  dutyCycleSlider = createSlider(0, 1, 0.5, 0.01); // Range from 0 to 1, default value 0.5, step size 0.01
  dutyCycleSlider.style('width', '400px'); // Set width of slider
  dutyCycleSlider.position(150, height - 45); // Position slider
}

function draw() {
  background('black');
  
  // Update duty cycle
  dutyCycle = dutyCycleSlider.value();
  
  // Set stroke for waveform
  stroke('limegreen');
  // disable the fill in the waveform
  noFill();
  // make the line be double wide
  strokeWeight(2);
  
  // Generate PWM waveform
  beginShape();
  for (let x = 0; x < width; x++) {
    // Map x to time period of waveform
    let t = map(x, 0, width, 0, TWO_PI * cycles);
    
    // Calculate value of waveform at this point in time
    // Draw high if in duty cycle, low otherwise
    let y = (sin(t) > 2 * dutyCycle - 1) ? 
        2*height/3 : height/3; 
    
    // Add vertex to waveform
    vertex(x, y);
  }
  endShape();
  
  // Display duty cycle
  fill('white');
  noStroke();
  textSize(16);
  // Display duty cycle as percentage
  text("Duty Cycle: " + nf(dutyCycle*100, 0, 0) + "%", 20, height - 30); 
}

```

## Lesson Plan

### Lesson Plan Prompt

```linenums="0"
I have a webpage that simulates a pulse-width-modulation waveform. 
The page has a slider that allows students to change the duty cycle from 0% to 100%.
When the students change the slider, the waveform is updated with the duty cycle.
Generate a lesson plan for a 9th-grade robotics class that uses this simulation.
Return the response in a single raw markdown file.
```

### Lesson Plan: Understanding Pulse-Width Modulation in Robotics

#### Objective:
Students will understand the concept of PWM and its application in controlling robotic components like motors and LEDs.

#### Materials Needed:
- Computers with internet access for the PWM simulation webpage.
- Projector for demonstrations.
- Optional: Physical components such as a small motor, LED, and Arduino for real-world demonstration.

#### Duration:
1 hour

### Lesson Outline:

#### 1. Introduction to PWM (15 minutes)
- Begin with a brief overview of PWM and its significance in robotics.
- Explain key terms: duty cycle, frequency, analog vs. digital signals.

#### 2. Demonstration of PWM Simulation (10 minutes)
- Project the PWM simulation on the screen.
- Show how changing the duty cycle affects the waveform.
- Relate this to how it would affect a motor's speed or an LED's brightness.

#### 3. Hands-On Activity with the Simulation (20 minutes)
- Students will use the simulation on their computers.
- Tasks:
  - Set the duty cycle to various levels (0%, 25%, 50%, 75%, 100%) and observe changes.
  - Students note their observations regarding the waveform changes.

#### 4. Real-World Application Discussion (10 minutes)
- Discuss how PWM is used in real-world robotics.
- If available, demonstrate using a motor or LED with an Arduino.
- Encourage students to think of examples where PWM might be used in everyday technology.

#### 5. Reflection and Q&A (5 minutes)
- Encourage students to ask questions.
- Discuss the importance of PWM in precise control in robotics.

### Assessment:
- Students will submit a brief report on their findings from the simulation.
- Include a few quiz questions at the end of the session to gauge understanding.

### Extension Activity:
- For advanced students or as a follow-up lesson, introduce a Python program that uses PWM to control a motor speed using a motor driver chip such as an L293D or control an LED brightness.

### Notes:
- Ensure that all students understand the basic concepts before moving to the hands-on activity.
- Assist students who might have difficulty with the simulation or concepts.
- Encourage group discussions and peer learning.

