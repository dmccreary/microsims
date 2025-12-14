---
title: Bouncing Ball in a Rotating Hexagon
description: An interactive p5.js simulation demonstrating physics concepts including gravity, momentum, friction, and collision detection with rotating boundaries.
quality_score: 90
social:
   cards: false
---
# Bouncing Ball in a Rotating Hexagon

<iframe src="main.html" width="100%" height="440px" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }
[Edit in the p5.js Editor](https://editor.p5js.org/dmccreary/sketches/b9cXAHp6A){ .md-button .md-button--primary }

Copy this iframe to your website:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/ball-in-rotating-hexagon/main.html" width="100%" height="470px"></iframe>
```

## About This MicroSim

This simulation demonstrates a ball bouncing inside a rotating hexagon. The ball is affected by:

- **Gravity**: A constant downward force pulls the ball
- **Friction**: Air resistance gradually slows the ball
- **Collision Detection**: The ball bounces off the rotating hexagon walls
- **Momentum Transfer**: The rotating walls impart velocity to the ball on collision

Use the **Speed** slider to control the hexagon's rotation speed. Positive values rotate clockwise, negative values rotate counter-clockwise. Watch how the rotating walls affect the ball's trajectory and energy.

## How It Works

The simulation calculates collisions by:

1. Projecting the ball's position onto each hexagon edge
2. Detecting when the ball overlaps an edge
3. Computing the relative velocity between the ball and the moving wall
4. Reflecting the ball's velocity and adding energy from the rotating wall

## Lesson Plan

**Learning Objectives:**

- Understand how gravity affects projectile motion
- Observe momentum transfer between moving surfaces and objects
- Explore how rotation speed affects system dynamics
- Visualize collision detection and response algorithms

**Activities:**

1. Set the rotation speed to zero and observe pure gravitational bouncing
2. Increase rotation speed and note how the ball gains energy from the walls
3. Try negative rotation speeds and compare the ball's behavior
4. Find settings that create stable orbital patterns

**Discussion Questions:**

- Why does the ball gain or lose energy based on rotation direction?
- How does the hexagon shape affect bouncing patterns compared to a circle?
- What real-world systems exhibit similar rotating boundary collisions?

## References

- [p5.js Documentation](https://p5js.org/reference/) - Official p5.js reference
- [2D Collision Detection](https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection) - MDN collision detection guide
- Special thanks to [Linas Beliūnas](https://www.linkedin.com/in/linasbeliunas/) for the suggestion
