---
title: Spinning 3D Shapes
description: An interactive 3D MicroSim demonstrating p5.js WebGL capabilities with a rotating torus and orbiting shapes controlled by mouse movement.
image: /sims/spinning-3d-shapes/spinning-3d-shapes.png
og:image: /sims/spinning-3d-shapes/spinning-3d-shapes.png
twitter:image: /sims/spinning-3d-shapes/spinning-3d-shapes.png
social:
   cards: false
---

# Spinning 3D Shapes

<iframe src="main.html" height="420px" width="100%" scrolling="no"></iframe>

[Run the Spinning 3D Shapes MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim demonstrates p5.js's powerful WebGL capabilities for creating 3D graphics directly in the browser. It features a central rotating torus (donut shape) with multiple orbiting shapes including spheres, boxes, and cones, creating a visually engaging "solar system" or "atom" effect.

## Interactive Controls

- **Mouse X Position**: Controls rotation speed (move left for slower, right for faster)
- **Mouse Y Position**: Controls lighting intensity (move up for brighter, down for dimmer)
- **Click**: Cycles through different color schemes (Teal, Purple, Orange, Green, Pink)
- **Drag**: Orbits the camera around the scene to view from different angles

## 3D Concepts Demonstrated

1. **WEBGL Rendering Mode**: Uses GPU-accelerated 3D rendering
2. **3D Transformations**: `rotateX()`, `rotateY()`, `rotateZ()` for rotation
3. **3D Translation**: `translate()` to position objects in 3D space
4. **3D Primitives**: `sphere()`, `box()`, `torus()`, `cone()`
5. **Lighting**: `ambientLight()`, `directionalLight()`, `pointLight()`
6. **Camera Control**: `orbitControl()` for interactive viewing

## Embed This MicroSim

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/spinning-3d-shapes/main.html"
        height="420px"
        width="100%"
        scrolling="no">
</iframe>
```

## Description

This simulation creates an immersive 3D scene with:

- A **central torus** (donut shape) that rotates smoothly on multiple axes
- **Five orbiting shapes** (spheres, boxes, and cones) that follow circular paths at different speeds and orbital inclinations
- **Background stars** scattered in 3D space for a cosmic atmosphere
- **Dynamic lighting** that responds to mouse position
- **HSB color mode** for vibrant, easily manipulable colors

The animation demonstrates how p5.js handles 3D graphics as elegantly as 2D, using the same familiar `setup()` and `draw()` pattern. Students can see that 3D programming is simply an extension of 2D concepts with an additional Z-axis dimension.

## How It Works

The core animation loop updates a rotation angle each frame:

```javascript
// Central torus rotation
push();
rotateY(angle);
rotateX(angle * 0.3);
torus(80, 30);
pop();

// Orbiting shapes follow circular paths
push();
rotateY(angle * 0.8);  // Orbital rotation
translate(130, 0, 0);   // Distance from center
rotateX(angle * 2);     // Self-rotation
sphere(18);
pop();
```

Each shape uses `push()` and `pop()` to isolate its transformations, allowing independent rotation and positioning.

## Lesson Plan

### Grade Level
Middle School to High School (Grades 6-12)

### Learning Objectives

By the end of this lesson, students will be able to:

1. **Understand** how WebGL enables 3D graphics in web browsers
2. **Identify** the three axes (X, Y, Z) in 3D coordinate systems
3. **Apply** rotation and translation transformations to 3D objects
4. **Recognize** how lighting affects the perception of 3D shapes
5. **Experiment** with parameters to observe cause-and-effect relationships

### Suggested Activities

1. **Exploration Phase** (5 minutes)
   - Have students interact with the simulation using mouse controls
   - Ask: "What happens when you move the mouse left to right? Up and down?"
   - Click to cycle through color schemes

2. **Observation Questions** (5 minutes)
   - How many different types of 3D shapes can you identify?
   - Which shapes orbit faster? Which orbit slower?
   - How does the lighting change the appearance of the shapes?

3. **3D Concepts Discussion** (10 minutes)
   - Introduce the X, Y, Z coordinate system
   - Explain rotation around each axis
   - Discuss how translation moves objects in 3D space

4. **Code Exploration** (Optional, 10 minutes)
   - Open the code in p5.js editor
   - Modify orbital speeds, shape sizes, or colors
   - Add additional orbiting shapes

### Extension Activities

- Add a slider to control the number of orbiting shapes
- Create a "pause" button to freeze the animation
- Experiment with different 3D primitives (cylinder, ellipsoid)
- Add texture mapping to shapes

## Technical Notes

- Uses **WEBGL** mode which leverages GPU acceleration for smooth 3D rendering
- **HSB color mode** (Hue, Saturation, Brightness) makes it easy to create rainbow progressions
- **Specular materials** create shiny, reflective surfaces
- Fixed 400x400 canvas provides consistent viewing experience
- Compatible with modern browsers supporting WebGL (Chrome, Firefox, Safari, Edge)

## References

- [p5.js WebGL Reference](https://p5js.org/learn/getting-started-in-webgl.html)
- [3D Primitives in p5.js](https://p5js.org/reference/#group-3D%20Primitives)
- [Lighting in WebGL](https://p5js.org/reference/#group-Lights)
