---
title: Vector and Particle Lab
description: Watch labeled position, velocity and gravity arrows drive a bouncing ball, drag a second ball into its path to separate collision detection from response, and switch to a fading particle fountain.
image: /sims/p5-vector-particle-lab/p5-vector-particle-lab.png
og:image: /sims/p5-vector-particle-lab/p5-vector-particle-lab.png
twitter:image: /sims/p5-vector-particle-lab/p5-vector-particle-lab.png
social:
   cards: false
quality_score: 100
---

# Vector and Particle Lab

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Vector and Particle Lab MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A p5.js vector stores an x part and a y part, so "how fast, and which way" becomes a single object. This lab shows three vectors doing three different jobs. In **One ball** mode, a gray dashed arrow from the origin is the ball's **position**, a green arrow is its **velocity**, and a red arrow is the **acceleration** from gravity. Each frame the sketch runs the two additions from Chapter 6: `velocity.add(gravity)` and then `position.add(velocity)`. The readout shows the numbers behind the arrows.

A second ball can be dragged into the path. The readout separates the two steps of a collision. **Detection** is the test `dist < r1 + r2`, shown with the actual distance, and it runs every frame, even while paused. **Response** is what the code does next: here it reflects the velocity about the contact normal and keeps the Bounciness fraction. Overlap the balls while paused and you see a collision detected with no response yet.

In **Fountain** mode, particles spawn at the bottom center, all following the same rule, and each is drawn with an alpha that fades with its remaining life. A counter shows how many are alive, and with Show vectors on, a few sampled particles show their velocity arrows.

**Learning objective:** The learner will distinguish the roles of position, velocity, and acceleration vectors, and of collision detection versus collision response, by changing parameters and observing the labeled arrows.

**Bloom level:** Analyze (L4). **Bloom verb:** distinguish.

## How to Use

1. The lab starts paused in One ball mode. Press **Start** and watch the green velocity arrow change while the red gravity arrow stays the same.
2. Move the **Gravity** slider (0.1 to 1.0). The red arrow's length changes at once, even while paused; the velocity changes only as frames run.
3. Move **Bounciness** (0.3 to 0.95) and compare the bounce heights.
4. Press **Pause**, then drag the gray ball onto the blue ball. Both flash, and the readout shows `dist < r1 + r2` with numbers, but "Response: none yet (paused)". Press **Start** to see the response.
5. Switch the mode to **Fountain** and press Start. Change **Spawn rate** (1 to 10 per frame) and watch the particles-alive counter.
6. **Reset** restarts the ball and clears the particles. **Show vectors** toggles all arrows.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/p5-vector-particle-lab/main.html"
        height="552px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers and learning-technology developers who read or build p5.js simulations (college undergraduate or professional development).

### Duration

15-20 minutes

### Prerequisites

- The Vectors, Physics Simulation, Collision Detection and Particle System sections of Chapter 6
- The idea of Euler integration: velocity changes position, acceleration changes velocity

### Activities

1. **Three arrows, three jobs (5 min):** Run the ball and pause it at the top of a bounce, on the way down, and just after hitting the floor. Sketch the three arrows each time and describe which one changed.
2. **Isolate gravity (3 min):** Pause, then move the Gravity slider. Record which readout values change immediately and which change only after pressing Start. Explain why.
3. **Detection versus response (5 min):** Overlap the balls while paused. Explain in one sentence why the collision is detected but nothing happens, then press Start and describe the response.
4. **One rule, many objects (4 min):** In Fountain mode, change the spawn rate and gravity. Predict the particles-alive count at spawn rate 10, then check it (each particle lives 90 frames).

### Assessment

- The learner states which vector each arrow represents and which vector gravity changes directly.
- The learner distinguishes collision detection (a yes/no test) from collision response (a change to velocity or position) using the readout as evidence.
- The learner explains why the particle count levels off near spawn rate times life.

## References

1. [p5.js p5.Vector reference](https://p5js.org/reference/p5/p5.Vector/) - The vector class with add(), mult(), mag() and dot().
2. [p5.js dist() reference](https://p5js.org/reference/p5/dist/) - The distance function behind the collision test.
3. [Euler method](https://en.wikipedia.org/wiki/Euler_method) - The step-by-step integration the physics loop uses.
4. [Collision detection](https://en.wikipedia.org/wiki/Collision_detection) - Background on detecting contact between objects.
5. [Particle system](https://en.wikipedia.org/wiki/Particle_system) - The technique behind the fountain.
