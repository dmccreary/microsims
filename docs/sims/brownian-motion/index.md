---
title: Brownian Motion
description: A MicroSim demonstrating gas molecules bouncing in a chamber with controls for temperature, molecule count, and chamber size.
quality_score: 95
image: /sims/brownian-motion/brownian-motion.png
og:image: /sims/brownian-motion/brownian-motion.png
twitter:image: /sims/brownian-motion/brownian-motion.png
social:
   cards: false
---

# Brownian Motion

<iframe src="main.html" height="532px" scrolling="no"></iframe>

[Run the Brownian Motion MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## Description

This MicroSim demonstrates **Brownian motion**, the random movement of gas molecules within a confined chamber. The simulation shows small particles (representing molecules) bouncing off chamber walls and colliding with each other, following the principles of kinetic molecular theory.

### Key Features

- **Temperature Control**: Adjust the speed/energy of molecules (simulating temperature)
- **Molecule Count**: Change the number of gas molecules (5-100)
- **Chamber Size**: Modify the chamber dimensions to observe density effects
- **Collision Counter**: Real-time display of collisions per second

### Physics Concepts

This simulation illustrates several fundamental concepts from physics and chemistry:

1. **Kinetic Molecular Theory**: Molecules are in constant, random motion
2. **Temperature-Velocity Relationship**: Higher temperature means faster molecular motion
3. **Elastic Collisions**: Molecules bounce off walls and each other without losing energy
4. **Pressure and Density**: More molecules in a smaller space leads to more frequent collisions

## Embedding

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/brownian-motion/main.html" height="532px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Describe the relationship between temperature and molecular motion
2. Explain how molecular density affects collision frequency
3. Connect microscopic molecular behavior to macroscopic properties like pressure and temperature
4. Understand the random nature of molecular motion in gases

### Classroom Activities

**Activity 1: Temperature Exploration** (10 minutes)
- Set molecules to 30 and chamber size to medium
- Gradually increase temperature from 1 to 20
- Observe and record changes in molecular speed and collision frequency
- **Discussion**: How does temperature relate to molecular kinetic energy?

**Activity 2: Density Investigation** (10 minutes)
- Keep temperature constant at 10
- Vary the number of molecules from 10 to 100
- Record collisions per second at different densities
- **Discussion**: Why do more molecules lead to more collisions? How does this relate to gas pressure?

**Activity 3: Volume Effects** (10 minutes)
- Set temperature to 10 and molecules to 50
- Change chamber size from small to large
- Observe collision frequency changes
- **Discussion**: How does volume affect molecular collisions? Connect to Boyle's Law.

### Assessment Questions

1. What happens to molecular motion when you increase temperature? Why?
2. If you double the number of molecules in the same chamber, what happens to collision frequency?
3. How would you use this simulation to model a gas being compressed?
4. Real gases don't behave exactly like this simulation. What factors are missing?

### Extensions

- Research Robert Brown's 1827 discovery of Brownian motion
- Connect to the ideal gas law: PV = nRT
- Explore how this relates to atmospheric pressure
- Investigate Einstein's mathematical treatment of Brownian motion

## Technical Notes

This MicroSim follows the standard MicroSim architecture:

- **Drawing Area**: 400px height with aliceblue background
- **Control Area**: 120px height with three responsive sliders
- **Responsive Design**: Adapts horizontally to container width
- **Framework**: Built with p5.js 1.11.10

The collision detection uses simple elastic collision physics for both wall bounces and molecule-molecule interactions.

## Sample Prompt

!!! prompt
    Using the MicroSim p5 generation skill microsim-p5 to generate a 2D simulation of Brownian motion.
    The simulation will demonstrate gas molecules as small circles bouncing around in a rectangular chamber.
    Add sliders to control the temperature, the number of molecules and the total area of the rectangular.
    Show a counter to show the number of collisions per second.

## References

- Brown, R. (1828). "A brief account of microscopical observations on particles contained in the pollen of plants"
- Einstein, A. (1905). "On the motion of small particles suspended in liquids at rest"
- Kinetic Molecular Theory of Gases (General Chemistry textbooks)
