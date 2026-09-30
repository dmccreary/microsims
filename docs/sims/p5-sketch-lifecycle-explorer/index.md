---
title: Sketch Lifecycle Explorer
description: Step a p5.js sketch one draw() call at a time, watch setup() and draw() counters and the executing statement, and see why statement order inside draw() changes the canvas.
image: /sims/p5-sketch-lifecycle-explorer/p5-sketch-lifecycle-explorer.png
og:image: /sims/p5-sketch-lifecycle-explorer/p5-sketch-lifecycle-explorer.png
twitter:image: /sims/p5-sketch-lifecycle-explorer/p5-sketch-lifecycle-explorer.png
social:
   cards: false
quality_score: 100
---

# Sketch Lifecycle Explorer

<iframe src="main.html" height="557px" width="100%" scrolling="no"></iframe>

[Run the Sketch Lifecycle Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Every p5.js sketch is organized around two functions that the library calls for you: `setup()`, which runs once, and `draw()`, which runs again and again. This MicroSim slows that loop down so it can be watched. On the left is the canvas of a small sketch like the falling-ball example in Chapter 6. On the right, counters show that `setup()` ran once while `draw()` and `frameCount` keep climbing, and a numbered list of the five statements inside `draw()` highlights the one executing.

Two checkboxes change the code inside `draw()`. Turning off **Clear background each frame** skips the `background()` statement, so nothing erases the earlier frames and the ball leaves a streak. Turning on **Draw ball before background** moves `circle()` ahead of `background()`, so the background paints over the ball and it vanishes. A one-sentence caption under the canvas explains each result.

**Learning objective:** The learner will explain when setup() and draw() run and why the order of statements inside draw() changes what appears on the canvas.

**Bloom level:** Understand (L2). **Bloom verb:** explain.

## How to Use

1. On load, `setup()` has run once and created the canvas, but `draw()` has not run. Predict what the first `draw()` call will paint.
2. Press **Step one frame**. Exactly one `draw()` call runs: the highlight moves through the five statements and the canvas builds up statement by statement. The counters go up by one.
3. Press **Start** to call `draw()` repeatedly at the **Frame rate** set by the slider (1 to 60 frames per second, default 5). Press **Pause** to stop.
4. Uncheck **Clear background each frame** and step a few frames. Predict the picture before each step.
5. Check **Draw ball before background** and step again. Watch the statement list reorder and the ball disappear.

The simulation is deliberately slow and steppable: a learner can predict the next frame before seeing it, which suits an Understand-level objective better than full-speed animation.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/p5-sketch-lifecycle-explorer/main.html"
        height="557px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers and learning-technology developers who read or review p5.js MicroSim code (college undergraduate or professional development).

### Duration

10-15 minutes

### Prerequisites

- The p5.js Sketch, setup() Function and draw() Function sections of Chapter 6
- The recommended drawing order inside `draw()` (background, grid, title, model, labels)

### Activities

1. **Predict the first frame (2 min):** Before pressing Step, write down what one `draw()` call will paint and what the three counters will read afterward.
2. **Step and count (3 min):** Step five frames. Explain why `setup() calls` stays at 1 while `draw() calls` and `frameCount` rise together.
3. **Remove the background (3 min):** Uncheck Clear background each frame. Predict, then step, then explain the streak and the smeared label in one sentence each.
4. **Reorder the statements (3 min):** Restore the background and check Draw ball before background. Explain why the ball vanishes even though `circle()` still runs every frame.
5. **Connect to code review (3 min):** Look at a generated sketch from your own work and check that its `draw()` follows the order background, grid, title, model, labels.

### Assessment

- The learner states when `setup()` runs and when `draw()` runs, and what `frameCount` counts.
- Given a `draw()` function with statements in a new order, the learner predicts which drawn elements will be visible.
- The learner explains the cause of a streaking ball and of a vanished ball in terms of statement order.

## References

1. [p5.js setup() reference](https://p5js.org/reference/p5/setup/) - The function p5.js calls once at the start.
2. [p5.js draw() reference](https://p5js.org/reference/p5/draw/) - The function p5.js calls once per frame.
3. [p5.js frameCount reference](https://p5js.org/reference/p5/frameCount/) - The number of frames drawn since the sketch started.
4. [p5.js background() reference](https://p5js.org/reference/p5/background/) - Painting the canvas at the start of each frame.
5. [Video game programming](https://en.wikipedia.org/wiki/Video_game_programming) - Background on the update-then-draw loop that p5.js runs for you.
