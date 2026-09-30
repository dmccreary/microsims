---
title: Canvas Height Calculator
description: Set a MicroSim's drawHeight, controlHeight and graphHeight, calculate CANVAS_HEIGHT and the iframe height, and see exactly how many pixels of controls a short iframe hides.
image: /sims/canvas-height-calculator/canvas-height-calculator.png
og:image: /sims/canvas-height-calculator/canvas-height-calculator.png
twitter:image: /sims/canvas-height-calculator/canvas-height-calculator.png
social:
   cards: false
quality_score: 100
---

# Canvas Height Calculator

<iframe src="main.html" height="662px" width="100%" scrolling="no"></iframe>

[Run the Canvas Height Calculator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Every MicroSim canvas is a stack of regions: a draw region, an optional graph region and a control region. Their heights add up to the canvas height constant, `CANVAS_HEIGHT`, and the iframe that embeds the MicroSim must be `CANVAS_HEIGHT + 2` pixels tall, the extra two pixels covering the iframe border. This calculator makes that arithmetic visible. The left picture shows the canvas as designed, and the right picture shows the iframe that a page gives it. When the iframe is too short, the hidden part of the canvas is drawn below the frame in red, the controls that fall inside it turn red, and the readout says how many pixels are lost.

**Learning objective:** The learner will calculate the canvas height and the iframe height for a MicroSim from its region heights, and will detect when an iframe is too short to show the controls.

**Bloom level:** Apply. **Bloom verb:** calculate.

The H-Bridge Circuit MicroSim from Chapter 2 is built in as a worked example: a 480-pixel draw region plus a 50-pixel control region gives `CANVAS_HEIGHT` 530, so its iframe is 532 pixels tall.

## How to Use

1. Check **Show H-Bridge numbers** to load the worked example (480, 50, 0 and an iframe of 532). The readout confirms that the MicroSim fits exactly.
2. Move the **drawHeight**, **controlHeight** or **graphHeight** slider. Before you look at the readout, calculate the new `CANVAS_HEIGHT` and iframe height yourself.
3. Watch the right-hand picture. The iframe did not grow, so the bottom of the canvas is now hidden and the clipped controls turn red. The red bracket reports the hidden pixels.
4. Press **Set iframe correctly** to snap the iframe height to `CANVAS_HEIGHT + 2` and compare it with your answer.
5. Drag the **iframe height** slider above the calculated value. The MicroSim still fits, but the readout reports the blank space left below it.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/canvas-height-calculator/main.html"
        height="662px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers and learning-technology developers who build or embed MicroSims (college undergraduate or professional development).

### Duration

10 to 15 minutes.

### Prerequisites

- The draw region and control region of a MicroSim canvas (Chapter 2)
- What an iframe is and why it does not resize itself to fit its content

### Activities

1. **Worked example (3 min):** Load the H-Bridge numbers. Ask learners to say aloud where 530 and 532 come from.
2. **Predict and calculate (5 min):** Give three designs, for example 400 + 80, 500 + 115 + 180 and 350 + 45. Learners write `CANVAS_HEIGHT` and the iframe height for each, set the sliders, and press **Set iframe correctly** to check.
3. **Find the clipping (4 min):** Keep the iframe at 532 and raise `controlHeight` to 115, as for a MicroSim with three rows of controls. Learners record how many pixels are hidden and which controls a reader could no longer reach.
4. **Discuss (3 min):** Why is a slightly-too-tall iframe a cosmetic problem while a slightly-too-short one can make a MicroSim unusable?

### Assessment

- Given `drawHeight`, `controlHeight` and `graphHeight`, the learner writes the correct `CANVAS_HEIGHT` and iframe height on three of three items.
- Given a canvas height and an iframe height, the learner states whether the controls are visible and how many pixels are hidden.

## References

1. [Chapter 2: Anatomy of a MicroSim](../../chapters/02-anatomy-of-a-microsim/index.md) - the draw and control regions and the canvas height constant.
2. [The Inline Frame element (iframe)](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) - MDN Web Docs reference for the `height` and `scrolling` attributes.
3. [p5.js reference: createCanvas()](https://p5js.org/reference/p5/createCanvas/) - how a p5.js sketch sets its canvas width and height.
4. [p5.js reference: windowResized()](https://p5js.org/reference/p5/windowResized/) - the event handler that keeps a MicroSim width-responsive.
