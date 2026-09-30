---
title: Coordinate System Explorer
description: Read mouseX and mouseY on a labeled p5.js pixel grid, then calculate where a height on a meter scale lands, including the y flip, and check the answer against the filled-in map() call.
image: /sims/p5-coordinate-system-explorer/p5-coordinate-system-explorer.png
og:image: /sims/p5-coordinate-system-explorer/p5-coordinate-system-explorer.png
twitter:image: /sims/p5-coordinate-system-explorer/p5-coordinate-system-explorer.png
social:
   cards: false
quality_score: 100
---

# Coordinate System Explorer

<iframe src="main.html" height="517px" width="100%" scrolling="no"></iframe>

[Run the Coordinate System Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

p5.js measures positions in pixels from the top-left corner of the canvas. The x value grows to the right and, unlike a mathematics graph, the y value grows downward. This MicroSim makes that system visible: a light grid every 50 pixels is labeled with pixel coordinates, and a readout next to the pointer shows `mouseX` and `mouseY` as you move.

The **Challenge** button asks for a point such as "3 meters high on a 0 to 10 meter scale" on a dashed vertical line. Because larger y is lower on the screen, 0 meters belongs at the bottom (y = 400) and the maximum at the top (y = 0), which is exactly the flip that `map(heightMeters, 0, 10, drawHeight, 0)` performs in Chapter 6. After you click, the sim draws the correct point with a meter ruler and shows the `map()` call with the numbers filled in. If your click matches the unflipped `map(h, 0, max, 0, drawHeight)`, it tells you the flip is missing.

**Learning objective:** The learner will calculate the pixel coordinates of a target point, including the y flip used when plotting a value, and confirm the result by placing a marker.

**Bloom level:** Apply (L3). **Bloom verb:** calculate.

## How to Use

1. Move the pointer over the grid and watch the `mouseX` and `mouseY` readout. Find the point (200, 100) using only the grid labels.
2. Click anywhere to place a marker; the panel lists the most recent marker coordinates.
3. **Show origin and axes directions** starts checked: arrows from (0, 0) are labeled "x grows right" and "y grows down". Uncheck it to test yourself without them.
4. Press **Challenge**. Calculate the y value on paper first, then click where the point belongs on the dashed line. A click within 12 pixels counts as correct.
5. Move the **Scale maximum (m)** slider (5 to 20 meters) to change the challenge scale, and predict how the same height moves on the screen.
6. Press **Clear markers** to start over.

The drawing region is 400 pixels tall so the arithmetic stays clean: on a 0 to 10 meter scale each meter is 40 pixels.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/p5-coordinate-system-explorer/main.html"
        height="517px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers and learning-technology developers who read, review or write p5.js MicroSims (college undergraduate or professional development).

### Duration

10-15 minutes

### Prerequisites

- The Canvas Creation and Coordinate System sections of Chapter 6
- The five arguments of `map(value, fromLow, fromHigh, toLow, toHigh)`

### Activities

1. **Read the grid (2 min):** With the axes arrows on, find three named points by pointer and confirm them with the readout.
2. **Calculate before clicking (5 min):** Complete five challenges. For each, write `y = map(h, 0, max, 400, 0)` with your numbers and the result before you click.
3. **Change the scale (3 min):** Set the scale maximum to 8, then 16, then 20. Predict the pixel height of 4 meters on each scale, then check with a challenge or the ruler.
4. **Diagnose the flip (3 min):** Deliberately click where `map(h, 0, max, 0, 400)` would put the point. Read the feedback and explain in one sentence why the unflipped call draws a mirrored graph.

### Assessment

- Given a height, a scale maximum and a drawing height, the learner writes the `map()` call and computes the y pixel.
- The learner explains why 0 meters is at y = `drawHeight` and not at y = 0.
- The learner scores at least four of five challenges within 12 pixels.

## References

1. [p5.js map() reference](https://p5js.org/reference/p5/map/) - Re-mapping a number from one range to another.
2. [p5.js mouseX reference](https://p5js.org/reference/p5/mouseX/) - The pointer's horizontal position on the canvas.
3. [p5.js mousePressed() reference](https://p5js.org/reference/p5/mousePressed/) - The event function used to place markers.
4. [Cartesian coordinate system](https://en.wikipedia.org/wiki/Cartesian_coordinate_system) - The mathematics convention that screen coordinates flip vertically.
5. [Linear interpolation](https://en.wikipedia.org/wiki/Linear_interpolation) - The arithmetic behind `map()`.
