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

## Lesson Plans

### 5th Grade Robotics Class Lesson Plan

#### Objective
- Introduce students to basic robotics concepts.
- Enable students to understand and operate simple robot kits.
- Foster teamwork and problem-solving skills.

#### Duration
- 1 hour (can be adjusted based on class schedule)

#### Materials
- LEGO Mindstorms EV3 kits or equivalent robotic kits.
- Computers with appropriate robotics programming software (e.g., LEGO Mindstorms software).
- Instruction manuals for the robotic kits.
- Worksheets for design planning and reflection.
- Whiteboard and markers for instruction and brainstorming.

#### Introduction (10 minutes)
- **Teacher-led Discussion**: Briefly discuss what robots are and their importance in today's world.
- **Video Presentation**: Show a short video on basic robotics and their applications.

#### Activity Part 1: Exploring the Robot Kits (15 minutes)
- **Team Formation**: Divide the class into small groups.
- **Kit Exploration**: Allow each group to explore their robot kit, identifying different components like sensors, motors, and the main processing unit.

#### Activity Part 2: Basic Programming (20 minutes)
- **Programming Introduction**: Demonstrate how to use the programming software to control a robot.
- **Hands-On Activity**: Each group programs their robot to perform simple tasks (e.g., moving in a straight line, turning, stopping).

#### Activity Part 3: Design Challenge (10 minutes)
- **Challenge Introduction**: Pose a simple challenge, like navigating a basic obstacle course.
- **Teamwork and Planning**: Groups plan their approach and begin programming their robots to complete the challenge.

#### Conclusion (5 minutes)
- **Group Sharing**: Each group shares their experience, challenges faced, and how they overcame them.
- **Reflection**: Encourage students to think about how they can apply what they learned in future projects.

#### Assessment
- Observation of student engagement and participation.
- Review of the completed worksheets for design planning and reflection.
- Assessment of the ability to program the robot to complete the given challenge.

#### Follow-Up
- In subsequent lessons, introduce more complex programming concepts and challenges.
- Encourage students to think of real-world problems that can be solved with robotics.
