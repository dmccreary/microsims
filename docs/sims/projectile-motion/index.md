---
title: Projectile Motion
description: A MicroSim demonstrating parabolic trajectories of projectiles with controls for launch angle and power.
image: /sims/projectile-motion/projectile-motion.png
og:image: /sims/projectile-motion/projectile-motion.png
twitter:image: /sims/projectile-motion/projectile-motion.png
social:
   cards: false
---

# Projectile Motion

<iframe src="main.html" height="512px" scrolling="no"></iframe>

[Run the Projectile Motion MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## Description

This MicroSim demonstrates **projectile motion**, one of the fundamental concepts in classical physics. Watch as cannonballs follow parabolic trajectories under the influence of gravity. The simulation allows you to explore how launch angle and initial velocity affect the path and range of projectiles.

### Key Features

- **Cannon Visual**: Realistic cannon in the lower-left corner that rotates to match the angle
- **Angle Control**: Adjust launch angle from 0° to 90°
- **Power Control**: Modify initial velocity (power) from 5 to 25
- **Fire Button**: Launch projectiles and watch them fly
- **Trajectory Traces**: Dashed lines show the parabolic path of each projectile
- **Multiple Trajectories**: Compare different launch parameters by firing multiple times
- **Reset Function**: Clear all trajectories to start fresh

### Physics Concepts

This simulation illustrates several key physics principles:

1. **Parabolic Trajectory**: Objects in free fall follow a parabolic path
2. **Projectile Motion Components**: Horizontal (constant velocity) and vertical (accelerated) motion are independent
3. **Gravity Effect**: Constant downward acceleration affects the vertical component
4. **Optimal Angle**: 45° typically gives maximum range (in the absence of air resistance)
5. **Velocity Components**: Initial velocity splits into horizontal (vx) and vertical (vy) components

### Mathematical Model

The simulation uses these physics equations:

- **Horizontal position**: x = x₀ + vₓt
- **Vertical position**: y = y₀ + vᵧt + ½gt²
- **Velocity components**:
  - vₓ = v₀ cos(θ)
  - vᵧ = v₀ sin(θ) + gt

Where:
- v₀ = initial velocity (power)
- θ = launch angle
- g = gravitational acceleration (0.3 in simulation units)
- t = time

## Embedding

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/projectile-motion/main.html" height="512px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Describe the trajectory of a projectile as parabolic
2. Explain how launch angle affects projectile range and maximum height
3. Understand that horizontal and vertical motions are independent
4. Predict the optimal angle for maximum range
5. Apply concepts of velocity components and vector decomposition

### Classroom Activities

**Activity 1: Angle Exploration** (10 minutes)
- Set power to 15 (medium)
- Fire projectiles at angles: 15°, 30°, 45°, 60°, 75°
- Observe and sketch the different trajectories
- **Discussion**: Which angle gives the longest range? Why?

**Activity 2: Power Investigation** (10 minutes)
- Set angle to 45°
- Fire projectiles at different power levels: 5, 10, 15, 20, 25
- Compare the trajectories
- **Discussion**: How does initial velocity affect range and height?

**Activity 3: Trajectory Comparison** (15 minutes)
- Fire multiple projectiles with different combinations
- Try to hit a specific target area
- Find complementary angles (e.g., 30° and 60°) that land at the same distance
- **Discussion**: Why do different angles sometimes give similar ranges?

**Activity 4: Real-World Applications** (10 minutes)
- Discuss real projectile scenarios: basketball, artillery, water fountains
- Explain why the simulation ignores air resistance
- **Discussion**: How would air resistance change the trajectories?

### Assessment Questions

1. What shape is the trajectory of a projectile? Why?
2. At what angle does the cannon shoot the farthest? (Assume level ground)
3. If you fire at 30° and 60° with the same power, what do you notice about the landing points?
4. How does gravity affect the horizontal and vertical components of motion differently?
5. What assumptions does this simulation make? (Hint: air resistance, Earth's curvature)

### Extensions

- Calculate the theoretical range using physics equations and compare to simulation
- Explore complementary angles (angles that sum to 90°)
- Investigate how changing gravity would affect trajectories
- Research historical uses of projectile motion (catapults, cannons)
- Study ballistic trajectories in space exploration

## Technical Notes

This MicroSim follows the standard MicroSim architecture:

- **Drawing Area**: 400px height with aliceblue background
- **Control Area**: 100px height with two sliders and two buttons
- **Responsive Design**: Adapts horizontally to container width
- **Framework**: Built with p5.js 1.11.10

The simulation uses:
- Object-oriented design with Projectile class
- Array storage for multiple trajectories
- Canvas 2D context for dashed line rendering
- Vector mathematics for velocity components

## Sample Prompt

!!! prompt
    Generate a new P5 MicroSim using the MicroSim-p5 skill that will demonstrate projectile motion.
    Create a folder called projectile-motion to store the MicroSim.
    A cannon is in the lower-left corner of the canvas.
    A "Fire" button is in the control area along with two sliders.
    One slider controls the angle and the other slider controls the power.
    When the user presses the Fire button, a small blue ball will exit the cannon and fly in the pattern of parabola.
    A dashed line will trace the trajectory of the cannon ball.
    Pressing the Fire button again will fire a new cannon ball, but will not erase the prior paths.
    A Reset button will erase all the prior paths.

## References

- Halliday, D., Resnick, R., & Walker, J. "Fundamentals of Physics" - Chapter on Projectile Motion
- Newton's Laws of Motion and Universal Gravitation
- Khan Academy: Projectile Motion
- PhET Interactive Simulations: Projectile Motion
