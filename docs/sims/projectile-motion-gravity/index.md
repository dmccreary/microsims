---
title: Projectile Motion with Gravity
description: A MicroSim demonstrating the effect of gravity on projectile motion with adjustable gravity control and multiple trajectory visualization.
image: /sims/projectile-motion-gravity/projectile-motion-gravity.png
og:image: /sims/projectile-motion-gravity/projectile-motion-gravity.png
twitter:image: /sims/projectile-motion-gravity/projectile-motion-gravity.png
social:
   cards: false
---

# Projectile Motion

<iframe src="main.html" height="452px" scrolling="no"></iframe>

[Run the Projectile Motion MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/projectile-motion/main.html" height="452px" scrolling="no"></iframe>
```

## Description

The Projectile Motion MicroSim demonstrates the fundamental physics principle of how gravity affects the trajectory of projectiles. Students can fire a cannon and observe the parabolic path that results from the combination of horizontal velocity and vertical acceleration due to gravity.

By adjusting the gravity slider, students can explore how different gravitational forces affect the shape and distance of projectile paths. Multiple trajectories remain visible on screen (until reset) allowing for direct comparison between different gravity settings. This visual comparison helps students understand the relationship between gravitational acceleration and trajectory characteristics.

Key features include:

- A cannon positioned in the lower left corner that fires projectiles at a 45-degree angle
- Dashed trajectory lines that clearly show the parabolic path (red for active, blue for completed)
- Adjustable gravity from 0 to 2 m/s² to explore different scenarios (Earth, Moon, Mars, etc.)
- Multiple trajectory visualization for comparison
- Real-time physics simulation using accurate kinematic equations

## Lesson Plan

### Learning Objectives

Students will be able to:

1. **Understand** that gravity affects the vertical motion of projectiles (Bloom's: Understand)
2. **Apply** concepts of parabolic motion to predict trajectory shapes (Bloom's: Apply)
3. **Analyze** how changes in gravity affect projectile range and height (Bloom's: Analyze)
4. **Evaluate** the relationship between gravitational acceleration and trajectory characteristics (Bloom's: Evaluate)

### Prerequisites

- Basic understanding of gravity as a force
- Familiarity with acceleration concepts
- Understanding that objects can have both horizontal and vertical motion simultaneously

### Instructional Sequence

#### Introduction (5 minutes)

1. Ask students: "What happens when you throw a ball? Does it travel in a straight line?"
2. Discuss the concept that objects follow a curved path when thrown
3. Explain that this lesson will explore WHY this curve happens

#### Guided Exploration (15 minutes)

1. **Initial Observation**
   - Have students fire the cannon once with default gravity (0.5 m/s²)
   - Ask: "Describe the shape of the path. Is it straight? Curved?"
   - Expected answer: The path is a smooth curve (parabola)

2. **Prediction Activity**
   - Before changing gravity, ask students to predict: "What will happen to the trajectory if we increase gravity to 1.5 m/s²?"
   - Have students sketch their prediction
   - Fire the cannon with increased gravity and compare to predictions
   - Discuss why the trajectory is steeper and shorter

3. **Extreme Cases**
   - Set gravity to minimum (0.1 m/s²): Observe very flat, long trajectory
   - Set gravity to maximum (2.0 m/s²): Observe steep, short trajectory
   - Ask: "What would happen with zero gravity?" (straight line)

4. **Comparative Analysis**
   - Fire 3-5 projectiles at different gravity settings
   - Have students identify patterns:
     - Higher gravity = shorter distance, steeper curve
     - Lower gravity = longer distance, flatter curve

#### Independent Practice (10 minutes)

1. **Real-World Connections**
   - Earth gravity ≈ 1.0 m/s² (scaled for simulation)
   - Moon gravity ≈ 0.17 m/s² (use 0.2 in simulation)
   - Mars gravity ≈ 0.38 m/s² (use 0.4 in simulation)
   
   Have students:
   - Fire projectiles at these different settings
   - Record the approximate distance traveled
   - Explain why astronauts could jump higher on the Moon

2. **Challenge Questions**
   - "If you wanted to throw a ball the farthest distance possible, would you want high or low gravity?"
   - "Why do projectiles follow a curved path rather than a straight line?"
   - "What stays constant: the horizontal speed or the vertical speed?"

### Assessment Questions

**Remember Level:**
- What force causes projectiles to follow a curved path?
- What shape is the path called?

**Understand Level:**
- Explain why the projectile eventually comes back down
- Describe what happens to the vertical speed as the projectile travels

**Apply Level:**
- If gravity were twice as strong, how would the trajectory change?
- Sketch what the trajectory would look like on the Moon (low gravity)

**Analyze Level:**
- Compare trajectories at 0.5 m/s² and 1.5 m/s². What is the ratio of their ranges?
- What stays the same regardless of gravity? What changes?

**Evaluate Level:**
- Why is 45 degrees often considered the optimal angle for maximum range?
- How would air resistance change these results in the real world?

### Extensions

1. **Mathematical Connection**: Introduce the kinematic equations (d = v₀t + ½at²)
2. **Angle Exploration**: Modify the simulation to allow angle adjustment
3. **Velocity Investigation**: Add a velocity slider to explore how initial speed affects trajectory
4. **Historical Context**: Discuss Galileo's experiments with projectile motion
5. **Engineering Application**: Design a "Mars lander" that must account for different gravity

### Common Misconceptions

- **"Heavier objects fall faster"**: Use this simulation to discuss that gravity accelerates all objects equally (in vacuum)
- **"Objects thrown horizontally fall slower"**: Emphasize that horizontal and vertical motion are independent
- **"The ball speeds up throughout flight"**: Clarify that horizontal speed stays constant; only vertical speed changes

### Differentiation

**For Struggling Learners:**
- Start with just two gravity settings to compare
- Focus on qualitative observations ("higher" vs "lower") before quantitative
- Use analogy: "It's like throwing a ball on Earth vs. on the Moon"

**For Advanced Learners:**
- Calculate actual distances and compare ratios
- Explore the mathematical relationship (distance ∝ 1/gravity)
- Research and compare to actual planetary gravities
- Investigate optimal launch angles for different objectives

### Technology Notes

- Works on tablets and smartphones (responsive design)
- No login or installation required
- Can be embedded in Google Classroom or LMS
- Recommended viewing: Desktop or tablet for best experience

### Standards Alignment

**Next Generation Science Standards (NGSS):**
- MS-PS2-1: Apply Newton's Third Law to design a solution
- MS-PS2-2: Plan investigation of motion and forces
- HS-PS2-1: Analyze data to support Newton's laws of motion

**Common Core Math:**
- HSF-IF.B.4: Interpret key features of graphs
- HSF-IF.C.7: Graph functions and show key features

### Duration

- Full lesson: 30-40 minutes
- Quick demonstration: 5-10 minutes
- Extended exploration: 45-60 minutes with extensions

## Tips for Educators

1. **Start Simple**: Begin with one trajectory to familiarize students with controls
2. **Use Prediction**: Always have students predict before experimenting
3. **Facilitate Discussion**: Ask "Why?" and "What if?" questions throughout
4. **Connect to Experience**: Reference sports (basketball, soccer) where projectile motion applies
5. **Safety Note**: Use simulation to explore concepts that would be dangerous to test in reality

## Additional Resources

- [NASA: Projectile Motion](https://www.grc.nasa.gov/www/k-12/airplane/trjctl.html)
- [Physics Classroom: Projectile Motion](https://www.physicsclassroom.com/class/vectors/Lesson-2/What-is-a-Projectile)
- [Khan Academy: Projectile Motion](https://www.khanacademy.org/science/physics/two-dimensional-motion/two-dimensional-projectile-mot)
