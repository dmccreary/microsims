---
title: p5.js Coordinate System
description: An interactive visualization helping students understand that p5.js has (0,0) at the top-left corner with Y increasing downward.
image: /sims/p5-coordinate-system/p5-coordinate-system.png
og:image: /sims/p5-coordinate-system/p5-coordinate-system.png
twitter:image: /sims/p5-coordinate-system/p5-coordinate-system.png
social:
   cards: false
---

# p5.js Coordinate System

<iframe src="main.html" height="402px" width="100%" scrolling="no"></iframe>

[Run the p5.js Coordinate System MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This interactive visualization helps students understand the p5.js coordinate system:

- **Origin at Top-Left**: Unlike traditional math coordinate systems, p5.js places (0,0) at the top-left corner of the canvas
- **X Increases Rightward**: Moving right increases the X coordinate (same as traditional math)
- **Y Increases Downward**: Moving down increases the Y coordinate (opposite of traditional math)

## How to Use

1. Move your mouse over the canvas
2. Watch the blue point follow your cursor
3. Observe how the (x, y) coordinates change as you move
4. Notice that Y values get larger as you move DOWN

## Key Concepts

| Direction | Coordinate Change |
|-----------|------------------|
| Move Right | X increases |
| Move Left | X decreases |
| Move Down | Y increases |
| Move Up | Y decreases |

## Why is Y Inverted?

The p5.js coordinate system follows the convention used by most computer graphics systems. This convention dates back to early CRT monitors, which drew pixels starting from the top-left corner and scanned downward line by line.

## Embedding This MicroSim

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/p5-coordinate-system/main.html" height="402px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

By the end of this activity, students will be able to:

1. **Understand** that the p5.js coordinate system has (0,0) at the top-left corner
2. **Recognize** that Y coordinates increase downward (opposite of traditional math)
3. **Apply** this knowledge to position elements accurately in p5.js sketches

### Suggested Activities

1. **Predict and Test**: Before moving the mouse, ask students to predict what coordinates will appear at specific locations (center, corners, edges)

2. **Corner Hunt**: Challenge students to move to each corner and record the coordinates

3. **Coordinate Bingo**: Call out coordinates and have students move their mouse to approximate those positions

4. **Sketch Planning**: Have students sketch a simple design on graph paper and then translate the coordinates to p5.js positions

### Common Misconceptions

- Students often expect (0,0) to be at the bottom-left (like in math class)
- Students may initially think moving up should increase Y values
- The center of the canvas is NOT at (0,0) - it's at (width/2, height/2)

### Assessment Questions

1. Where is the origin (0,0) located in p5.js?
2. What happens to the Y coordinate when you move down?
3. If a point is at (200, 175), where would it be on a 400x350 canvas?
