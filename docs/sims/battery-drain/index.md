# Battery Drain

<figure markdown>
   ![Image Name](./battery-drain.png){ width="400" }
   <figcaption>Battery Drain</figcaption>
</figure>

[Run the Battery Drain Demo](./battery-drain.html){ .md-button .md-button--primary }

[Edit the Simulation](https://editor.p5js.org/dmccreary/sketches/4MkEFEt0i)

## About The Battery Drain MicroSim

This MicroSim teaches students how batteries work in robots.  The
student can adjust the speed of the motor.  But the more power
the motor draws, the faster the battery drains.  When the motor
is off, there is no drain.  When the battery is fully drained
the motor will no longer turn.

## Sample Prompt

```linenums="0"
Generate a p5.js file on a 400x400 canvas that demonstrates the
rate that a battery is discharged when it is powering a motor.
Add a slider at the bottom of the canvas that allows the user
to adjust the speed of the motor.  Place the battery on the
left side.  Make the negative sign be at the bottom and 
use a black filled rect.  Make the battery top be positive
and use a gold filled rect to draw it.  Draw wires from
the battery's positive and negative to a motor in the right side.
The motor should drive a circle that spins faster as the slider is changed.
The motor should only spin if we have power.
```

## Sample Code

```javascript
// battery drain
// Animate a motor that drains a battery faster the more power is used
let canvasWidth = 400;
let drawHeight = 400;
let canvasHeight = 430;
let motorSpeedSlider;
let motorSpeed;
let batteryLevel = 100;
let dischargeRate;
let sliderLeftMargin = 100;

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  //
  textSize(16);
  
  motorSpeedSlider = createSlider(0, 100, 50);
  motorSpeedSlider.position(sliderLeftMargin, drawHeight + 10);
  motorSpeedSlider.style('width', canvasWidth - sliderLeftMargin - 20 + 'px')
  
  frameRate(60);
}

function draw() {
  fill(245);
  rect(0,0,canvasWidth,drawHeight);
  fill('white');
  rect(0,drawHeight,canvasWidth,canvasHeight-drawHeight);

  motorSpeed = motorSpeedSlider.value();
  // Battery representation
  drawBattery();

  // Wires from battery to motor
  stroke(0);
  // top wire
  line(50, 50, 350, 50);
  // bottom wire
  line(50, 350, 350, 350);
  line(350, 50, 350, 350);

  // Motor and spinning circle
  drawMotor();

  // Update battery discharge
  updateBattery();
  noStroke();
  fill('black');
  text("Speed:"+motorSpeed, 10, drawHeight+25);
}

function drawBattery() {
  // Battery body
  
  percentGold = .4
  // Positive terminal
  fill('gold'); // Gold color
  rect(20, 50, 50, 300*percentGold);

  // Negative terminal
  fill('black');
  rect(20, 350*percentGold, 50, 350*(1-percentGold));

  // Battery level
  let levelHeight = map(batteryLevel, 0, 100, 0, 300);
  fill(0, 255, 0);
  rect(30, 350 - levelHeight, 30, levelHeight);
}

// draw a spinning motor if we have power
function drawMotor() {
  fill(150);
  ellipse(350, 200, 100, 100); // Motor body

  // draw the spinner if we have power
  if (batteryLevel > 1) {
   push();
      translate(350, 200);
      rotate(frameCount / 50 * motorSpeed);
      fill(0, 0, 255);
      ellipse(0, 40, 20, 20); // Spinning circle
   pop();
  }
}

// the battery level goes down with time
function updateBattery() {
  dischargeRate = motorSpeedSlider.value() / 1000;
  batteryLevel -= dischargeRate;
  batteryLevel = max(batteryLevel, 0);
}
```

!!! Challenges
    1. Add a label that shows the percent of charge remaining
    2. Add a label that predicts how long the battery will last at the current discharge rate
    3. Add another button called "Recharge" that will slowly recharge the battery
    4. Add animation to the wires of red dots moving along the wires.  Make the dots go faster at a higher power.
    5. Make the battery explode if you charge it too quickly

## Lesson Plans

### 5th Grade Robotics Class Lesson Plan

#### Objective
  - Understand the concept of battery discharge and its application in powering motors, particularly in robotics.
  - Develop an understanding of how adjusting variables (like motor speed) can impact power consumption.
  - Ask questions about what we do with batteries when they are discharged?

#### Duration
- 1 hour

#### Materials
- Computers with internet access to use the p5.js Web Editor.
- Projector to demonstrate the p5.js simulation.
- Printed screenshots of the p5.js canvas setup (for reference).

#### Introduction (10 minutes)
- **Interactive Questioning**: Begin by asking students about their experiences with batteries. "What devices at home use batteries?" "Have you noticed how the performance changes as the battery drains?"
- **Relevance to Robotics**: Discuss why robots need batteries, linking to their own experiences with battery-powered devices.

#### Demonstration of the Simulation (10 minutes)
- **Show the p5.js Simulation**: Project the simulation on the screen. Demonstrate how the motor's speed changes with the slider and how this affects battery discharge.
- **Explain the Components**: Point out the battery, the wires, the motor, and the spinning circle, explaining their roles.

#### Group Activity: Experimenting with the Simulation (20 minutes)
- **Hands-On Exploration**: Students work in pairs on computers to experiment with the simulation.
- **Guided Inquiry**: Encourage students to observe what happens as they adjust the motor speed. Does the battery discharge faster at higher speeds?

#### Discussion and Reflection (15 minutes)
- **Group Discussion**: Reconvene as a class and discuss observations. Key questions: "How did changing the motor speed affect the battery life?" "Why is this important for designing robots?"
- **Connecting to Real Life**: Relate the activity to real-world scenarios. "How might this knowledge impact the way we design battery-powered devices or robots?"

#### Conclusion (5 minutes)
- **Summarize Key Learnings**: Reinforce the importance of understanding battery usage in robotics and everyday devices.
- **Reflect on the Activity**: Ask students to share one new thing they learned and how they might apply this knowledge.

#### Assessment
- Participation and engagement during the activity.
- Responses during the discussion, reflecting understanding of the concept.

#### Follow-Up
- In the next lesson, explore other factors affecting battery life in robots, like weight or the type of task performed.
- Assign a small project where students design a simple battery-powered device or robot, considering battery life.
