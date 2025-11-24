---
title: Collision Avoidance Robot
description: An interactive MicroSim demonstrating collision avoidance robot.
quality_score: 37
image: /sims/collision-avoidance-robot/collision-avoidance-robot.png
og:image: /sims/collision-avoidance-robot/collision-avoidance-robot.png
twitter:image: /sims/collision-avoidance-robot/collision-avoidance-robot.png
social:
   cards: false
---
# Collision Avoidance Robot

<figure markdown>
   ![Image Name](./collision-avoidance-robot.png){ width="400" }
   <figcaption>Collision Avoidance Robot</figcaption>
</figure>

[Link to Collision Avoidance Demo](./collision-avoidance-robot.html){ .md-button .md-button--primary }

## Sample Prompt

```linenums="0"
Create a p5.js simulation of a collision avoidance robot on a 400x400 canvas.
The robot moves in a circle of radius 200 which is centered in the canvas.
The robot is drawn as blue filled rectangle 40x40 with a 20 long red line pointing at the front.
The robot has four modes: stopped, forward, backing up a turning.
There are three buttons at the bottom of the drawing region: Start, Stop and Reset.
The initial state is stopped.  Place the robot in the center facing right.
When the user presses Start the robot goes into forward mode.
When the robot comes within 20 of the edge of the circle it will backup 20 and then turn.
The turn will be 120 degrees either right or left.
After the robot turns it will then go forward.
When the user presses Stop the mode will be stopped.
When the user presses Reset the robot will be placed stopped at the center of the canvas.
```
