---
title: Guarded Call Runtime Toggle
description: Toggle the xAPI runtime on and off and switch between a guarded and an unguarded instrumentation call to see which one keeps a p5.js sketch running in the p5.js editor.
image: /sims/guarded-call-runtime-toggle/guarded-call-runtime-toggle.png
og:image: /sims/guarded-call-runtime-toggle/guarded-call-runtime-toggle.png
twitter:image: /sims/guarded-call-runtime-toggle/guarded-call-runtime-toggle.png
social:
   cards: false
quality_score: 100
---

# Guarded Call Runtime Toggle

<iframe src="main.html" height="722px" width="100%" scrolling="no"></iframe>

[Run the Guarded Call Runtime Toggle MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A teacher may paste an instrumented p5.js MicroSim into the p5.js web editor, where none of the
xAPI runtime files exist. A **guarded call** is an instrumentation call wrapped in a test that the
runtime is present, so the MicroSim runs unchanged, and silently, without it. The idiom from
Chapter 17 is: the instance variable `lrs` starts as `null`, is created only inside
`if (window.LRSSim)`, and every use is written `if (lrs)`.

This MicroSim shows a small bouncing-ball sketch beside its instrumentation code. Two switches
set up the experiment:

- **Runtime loaded** on means the runtime files are present; off simulates the p5.js editor.
- **Call style** chooses the unguarded code (`lrs = LRSSim.create(...)` in `setup()` and
  `speedEvidence.input(speed)` in the slider handler) or the guarded code.

Changing either switch reloads the sketch. **Move slider** fires one slider input. The line that
just ran is highlighted, a status strip reads "Runs" or shows the error, and a log line says
whether a statement was recorded. With the runtime off, the unguarded sketch stops at
`ReferenceError: LRSSim is not defined` in `setup()`, so `draw()` never starts; a slider move then
fails a second time because `speedEvidence` is still `null`. The guarded sketch keeps running and
records nothing. A grid fills in each outcome as you try it.

The runtime here is simulated inside the sketch, so this page itself runs in the p5.js editor.

**Learning objective:** The learner will distinguish a guarded from an unguarded
instrumentation call by observing what each does when the runtime is present and when it is
absent.

**Bloom's taxonomy level:** Analyze (verb: *distinguish*)

## How to Use

1. With the runtime loaded and the guarded style, press **Move slider**. One `interacted`
   statement is recorded.
2. Switch to the unguarded style and press **Move slider** again. Nothing changes: with the
   runtime present, both styles behave the same.
3. Uncheck **Runtime loaded**. The unguarded sketch stops in `setup()`. Press **Move slider**
   and read the second error.
4. Switch back to the guarded style. The ball runs again and slider moves record nothing.
5. Compare the highlighted lines and fill in all four cells of the outcome grid.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/guarded-call-runtime-toggle/main.html"
        height="722px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development).

### Duration

10-15 minutes

### Prerequisites

- The LRS runtime script and handles such as `lrs.slider()` (Chapter 17)
- Basic p5.js structure: `setup()`, `draw()` and control callbacks

### Activities

1. **Fill the grid (5 min):** Try all four combinations of runtime and call style and press
   Move slider in each. Record the status and the statement count.
2. **Explain the difference (4 min):** For the one failing combination, name the exact line that
   throws and explain why `draw()` never starts.
3. **Guard a new call (5 min):** Write the guarded version of a Reset-button press,
   `resetEvidence.press('reset')`, and of a call to `LRS.conceptId(353)`, which the chapter says
   must also not run at the top level of a sketch.

### Assessment

- The learner predicts the outcome of each of the four combinations before trying it.
- The learner identifies the line that throws in the unguarded sketch and names the error.
- The learner rewrites an unguarded instrumentation call so that it runs silently without the
  runtime.

## References

1. [ReferenceError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError) - MDN. The error thrown when code names a variable that does not exist.
2. [Optional chaining (?.)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) - MDN. A related JavaScript idiom for skipping calls on a null object.
3. [p5.js Web Editor](https://editor.p5js.org/) - p5.js. The environment the unguarded sketch fails in.
4. [p5.js createRadio() reference](https://p5js.org/reference/p5/createRadio/) - p5.js. The control used for the call style.
