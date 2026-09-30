---
title: Width-Responsive Breakpoint Lab
description: Drag the edge of a simulated container around a miniature MicroSim and switch windowResized and slider resizing on and off to see how container width detection keeps the canvas and its controls usable.
image: /sims/width-responsive-breakpoint-lab/width-responsive-breakpoint-lab.png
og:image: /sims/width-responsive-breakpoint-lab/width-responsive-breakpoint-lab.png
twitter:image: /sims/width-responsive-breakpoint-lab/width-responsive-breakpoint-lab.png
social:
   cards: false
quality_score: 100
---

# Width-Responsive Breakpoint Lab

<iframe src="main.html" height="537px" width="100%" scrolling="no"></iframe>

[Run the Width-Responsive Breakpoint Lab MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

**Width responsiveness** means a MicroSim's width follows the element that contains it while its
height stays a fixed constant. Two mechanisms make it work:

- **Container width detection**: `updateCanvasSize()` reads the width of the `<main>` element,
  and `setup()` calls it before `createCanvas()`, so the first frame already has the right width.
- **The windowResized handler**: p5.js calls `windowResized()` whenever the window changes size.
  The handler measures again, calls `resizeCanvas(canvasWidth, canvasHeight)`, and resizes every
  slider with `size()`, which is the line authors most often forget.

This lab draws a dashed **container** with a miniature MicroSim inside it: a ball placed at
`canvasWidth / 2`, a slider labeled "Gravity", and a row of three buttons. Drag the container's
right edge from 280 to 900 pixels. The readout compares the container width with the canvas
width, and the notes below the ruler report what is clipped, left blank, or overshooting:

- With both checkboxes on, the canvas and the slider follow the container, and nothing is
  clipped.
- With **Call windowResized** off, the canvas keeps the width it measured at load. Narrow the
  container and the right edge is clipped; widen it and blank space appears.
- With only **Resize sliders in the handler** off, the canvas follows but the slider track keeps
  its old length, and a red outline marks any part that runs past the canvas edge.

**Reload page** re-runs `setup()`, which measures the container again. The **Preset width** menu
jumps to a phone (375), tablet (768) or desktop (1024, clamped to the 900-pixel maximum) width.
Click any part of the miniature to see which function is responsible for its width. The lab
itself follows the same pattern: its canvas follows its own container and its height is fixed.

**Learning objective:** The learner will demonstrate how container width detection and the
windowResized handler keep a MicroSim usable, by dragging a container edge and switching the
handler and slider resizing on and off.

**Bloom's taxonomy level:** Apply (verb: *demonstrate*)

## How to Use

1. With both checkboxes on, drag the right edge of the dashed container. Watch the ball stay
   centered and the slider track grow and shrink.
2. Uncheck **Call windowResized**. Predict what will happen, then drag the edge narrower and
   wider. Press **Reload page** to see `setup()` fix the width once.
3. Turn the handler back on and uncheck **Resize sliders in the handler**. Choose **Phone 375**
   and look for the red outline.
4. Click the ball, the slider, the buttons, the canvas and the container to read which function
   sets each width.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/width-responsive-breakpoint-lab/main.html"
        height="537px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development).

### Duration

15 minutes

### Prerequisites

- The Width Responsiveness, Container Width Detection and windowResized Handler sections of
  Chapter 12
- Reading a p5.js `setup()` and `draw()` function

### Activities

1. **Predict (3 min):** Before touching the controls, write what you expect to break if
   `windowResized()` is never called, and what breaks if it forgets `gravitySlider.size()`.
2. **Demonstrate (7 min):** Reproduce three states and screenshot each: nothing clipped, canvas
   clipped, slider overshooting. For each, write which checkbox caused it and which line of
   code would fix it.
3. **Transfer (5 min):** Open one of your own sketches and list every control it creates. Mark
   which ones are resized or repositioned inside `windowResized()`.

### Assessment

- Three annotated states that match the diagnosis shown in the lab.
- Given a sketch whose slider overshoots on a phone, the learner names the missing line in
  `windowResized()`.
- The learner explains why "Reload page" fixes the width only until the next resize.

## References

1. [Responsive web design - Wikipedia](https://en.wikipedia.org/wiki/Responsive_web_design) -
   Background on layouts that adapt to the width of the screen.
2. [p5.js windowResized() reference](https://p5js.org/reference/p5/windowResized/) - The event
   function p5.js calls whenever the browser window changes size.
3. [p5.js resizeCanvas() reference](https://p5js.org/reference/p5/resizeCanvas/) - Changes the
   canvas size after `setup()`.
4. [MDN: Element.getBoundingClientRect()](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) -
   The browser call that measures the container's laid-out width.
