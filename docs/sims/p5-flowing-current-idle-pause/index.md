---
title: Flowing Current and Idle Pause
description: Design a flowing-current animation around a battery-and-lamp loop by choosing dot spacing, flow speed and direction, and decide whether pause-when-idle should be on by watching a live animation step counter.
image: /sims/p5-flowing-current-idle-pause/p5-flowing-current-idle-pause.png
og:image: /sims/p5-flowing-current-idle-pause/p5-flowing-current-idle-pause.png
twitter:image: /sims/p5-flowing-current-idle-pause/p5-flowing-current-idle-pause.png
social:
   cards: false
quality_score: 100
---

# Flowing Current and Idle Pause

<iframe src="main.html" height="507px" width="100%" scrolling="no"></iframe>

[Run the Flowing Current and Idle Pause MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim rebuilds two showcase techniques from the H-Bridge simulation described in Chapter 6. **Flowing current animation** moves a row of evenly spaced dots along a path stored as a list of corner points. One number, `flowOffset`, grows a little each frame; the dots start at `flowOffset % spacing`, and `lerp()` places each dot inside the segment where its distance falls. Dots inside the lamp circle are skipped, so the current seems to pass through the lamp. The path runs from the battery's positive terminal around the loop to its negative terminal, and the corner points are recomputed from the canvas width every frame, so the loop stretches with the page.

**Pause-when-idle animation** advances the animation only while the pointer is over the sim. Listeners for `mouseenter` and `mouseleave` on the `<main>` element set a flag, and `draw()` grows `flowOffset` only when the flag is true. The canvas is still redrawn every frame, so the picture stays visible. The readout shows whether the animation is advancing and why not, and the **Animation steps since load** counter stops the moment the pointer leaves.

**Learning objective:** The learner will design a flowing-current animation by choosing path, spacing, and speed, and will decide whether pause-when-idle should be on, by observing the effect on the animation and on a live step counter.

**Bloom level:** Create (L6). **Bloom verb:** design.

## How to Use

1. The sim starts paused. Press **Start**, then move the pointer over the sim. The dots flow and the step counter climbs.
2. Move the pointer off the sim. With **Pause when idle** on, the dots stop, the readout says "no (pointer is outside the sim)" and the counter freezes.
3. Uncheck **Pause when idle** and move the pointer away again. Now the dots keep moving whenever Start has been pressed, and the counter keeps climbing.
4. Adjust **Dot spacing (pixels)** from 12 to 48 and **Flow speed (pixels per frame)** from 0.5 to 4. The readout shows the path length, the number of dots and how long one dot takes to lap the loop at 60 frames per second.
5. Check **Reverse direction**. The dots turn from green to purple, the offset runs backward, and the battery symbol flips so the long plate (positive terminal) stays where the current leaves.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/p5-flowing-current-idle-pause/main.html"
        height="507px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers and learning-technology developers who design animated p5.js MicroSims (college undergraduate or professional development).

### Duration

15-20 minutes

### Prerequisites

- The Flowing Current Animation and Pause-When-Idle Animation sections of Chapter 6
- The animation loop and frame rate: per-frame motion depends on the frame rate

### Activities

1. **Observe the idle pause (3 min):** With Start pressed and Pause when idle on, move the pointer in and out of the sim. Record the step counter before and after 30 seconds away.
2. **Design for legibility (6 min):** Find a spacing and speed at which the direction of flow is obvious at a glance but the dots do not blur. Record your values and the lap time from the readout. Compare with the H-Bridge defaults of 24 pixels and 1.5 pixels per frame.
3. **Show direction (3 min):** Toggle Reverse direction. Explain why the H-Bridge uses both color and path to show a change in current direction.
4. **Decide (5 min):** For a chapter page with three animated MicroSims, write a one-paragraph design decision: pause-when-idle on or off, with Start pressed or not by default, citing distraction, battery use and touch screens (a tap wakes the animation).

### Assessment

- The learner produces a spacing, speed and direction choice with a justification tied to legibility and lap time.
- The learner explains, using the step counter as evidence, what pause-when-idle stops and what it does not stop (the redraw).
- The learner states when pause-when-idle should be off, for example on a dedicated full-screen page.

## References

1. [p5.js lerp() reference](https://p5js.org/reference/p5/lerp/) - Placing each dot between two corner points.
2. [p5.js frameRate() reference](https://p5js.org/reference/p5/frameRate/) - Why per-frame speed depends on the frame rate.
3. [MDN: mouseenter event](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event) - The listener that wakes the animation.
4. [Electric current](https://en.wikipedia.org/wiki/Electric_current) - Conventional current flows from the positive terminal around the circuit.
5. [Linear interpolation](https://en.wikipedia.org/wiki/Linear_interpolation) - The arithmetic behind `lerp()`.
