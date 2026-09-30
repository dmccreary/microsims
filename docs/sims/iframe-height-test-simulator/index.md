---
title: Iframe Height Test Simulator
description: Apply the control visibility and iframe height tests to a mock MicroSim and calculate the suggested iframe height from its content height.
image: /sims/iframe-height-test-simulator/iframe-height-test-simulator.png
og:image: /sims/iframe-height-test-simulator/iframe-height-test-simulator.png
twitter:image: /sims/iframe-height-test-simulator/iframe-height-test-simulator.png
social:
   cards: false
quality_score: 100
---

# Iframe Height Test Simulator

<iframe src="main.html" height="622px" width="100%" scrolling="no"></iframe>

[Run the Iframe Height Test Simulator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The tester `test-iframe-heights.py` loads a MicroSim in a headless browser whose viewport is exactly as tall as the iframe, and checks every control's **bounding box**. This MicroSim runs the same two tests on a mock MicroSim so you can see the numbers:

- **Control visibility test**: a control passes when its bottom edge is at most the iframe height plus the tolerance (5 px by default). Canvases are measured but never reported as failures.
- **Iframe height test**: the MicroSim fails if any control fails. The content height is the lowest bottom edge on the page; the suggested height is that number plus 10, rounded up to the next multiple of 10. On a pass the tester simply repeats the current height.

Each element in the mock shows its bottom edge in pixels, and the frame's bottom edge moves with the **Iframe height** slider; everything below it is shaded because `scrolling="no"` hides it. **Content height** moves the lowest control. Tick **Declared CANVAS_HEIGHT** to base the suggestion on a declared value instead of the measurement, as the tester does when the script contains `// CANVAS_HEIGHT = N` (it reads only the equals form).

**Learning objective:** The learner will apply the control visibility and iframe height tests to a mock MicroSim by choosing an iframe height, and will calculate the suggested height from the content height.

**Bloom level:** Apply. **Bloom verb:** calculate.

## How to Use

1. Leave the defaults (iframe 500, content 528, tolerance 5). Predict which controls fail, then press **Run test**.
2. Read the results: each control's bottom and status, the MicroSim status, the content height and the suggested height.
3. Click any element in the mock to see its bounding box and the inequality that decided it.
4. Change the sliders and run again. Find the smallest iframe height that passes.
5. Tick **Declared CANVAS_HEIGHT**, enter a value, and see how the suggestion changes while the verdict does not.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/iframe-height-test-simulator/main.html"
        height="622px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development).

### Duration

15 minutes

### Prerequisites

- The CANVAS_HEIGHT comment and iframe heights (Chapter 12)
- Bounding boxes and the tester's rules (Chapter 13)

### Activities

1. **Calculate first (5 min):** For iframe 500 and content 528, compute each verdict and the suggested height on paper, then run the test.
2. **Worked example (4 min):** Reproduce the chapter's predator-prey row: iframe 697, content 720. Confirm the suggestion of 730.
3. **Tolerance (3 min):** Set tolerance to 0 and to 20. Explain what the tolerance protects against and what it could hide.
4. **Limits (3 min):** Name one defect this test cannot catch (for example, a slider past the right edge) and which check would.

### Assessment

- The learner computes the pass limit, each verdict and the suggested height for a given set of numbers.
- The learner explains why a declared CANVAS_HEIGHT changes the suggestion but not the PASS or FAIL.
- Exit question: "Content 613, iframe 600, tolerance 5. Status and suggested height?"

## References

1. [Chapter 13: Quality Assurance and Automated Layout Review](../../chapters/13-quality-assurance-and-automated-layout-review/index.md) — the control visibility test, the iframe height test and the tester's sample output.
2. [Playwright for Python](https://playwright.dev/python/docs/intro) — the automation library the tester uses to drive headless Chromium.
3. [Headless browser](https://en.wikipedia.org/wiki/Headless_browser) — Wikipedia article on browsers without a visible window.
4. [Element.getBoundingClientRect() (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) — the bounding box whose bottom edge the tester compares.
