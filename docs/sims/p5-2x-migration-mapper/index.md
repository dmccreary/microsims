---
title: p5.js 2.x Migration Mapper
description: Convert four short p5.js 1.x snippets to their 2.x form by flagging the v1-only call, choosing its replacement and checking the choice against the chapter's migration table.
image: /sims/p5-2x-migration-mapper/p5-2x-migration-mapper.png
og:image: /sims/p5-2x-migration-mapper/p5-2x-migration-mapper.png
twitter:image: /sims/p5-2x-migration-mapper/p5-2x-migration-mapper.png
social:
   cards: false
quality_score: 100
---

# p5.js 2.x Migration Mapper

<iframe src="main.html" height="682px" width="100%" scrolling="no"></iframe>

[Run the p5.js 2.x Migration Mapper MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

p5.js 2.x removed or changed four calls that older MicroSims rely on: `preload()`, the multi-control-point form of `bezierVertex()`, `curveVertex()` and `quadraticVertex()`. This MicroSim turns the migration table from Chapter 5 into practice. Each of four short snippets uses one legacy call, taken from the MicroSims that the repository's static scan flagged: the breadboard sketches, book-gen-workflow and temp-and-pressure, curve, and flower-petal.

The learner flags the v1-only lines, chooses one of three candidate replacements, and gets an answer that quotes the migration table. **Show 2.x form** then reveals the corrected snippet with the changed lines highlighted, so the learner can compare it with their own version.

**Learning objective:** The learner will use the migration table to convert a short p5.js 1.x snippet into its 2.x form and identify which call in it is no longer valid.

**Bloom level:** Apply (L3). **Bloom verb:** use.

## How to Use

1. Choose a snippet in the **Snippet** dropdown and read the 1.x code. Predict which call will not survive the upgrade.
2. Press **Flag legacy calls**. The lines that use a v1-only call turn red, the panel heading names the call, and the matching chip at the top is highlighted.
3. Click a highlighted line. Three candidate replacements appear. Pick one.
4. The right panel shows your 2.x version, with the changed lines in green (correct) or red (not correct), and the feedback box explains the choice by quoting the migration table. Click a highlighted line again to try another candidate.
5. Press **Show 2.x form** to see the corrected snippet. Press **Reset** to start the snippet again.
6. Hover over a chip (`preload()`, `bezierVertex()`, `curveVertex()`, `quadraticVertex()`) to see its one-line migration rule.

The snippets, candidates and explanations are stored in `data.json` and follow the migration table in Chapter 5 and the p5.js 2.x reference pages. The sketch itself only displays code, so it runs unchanged on the repository's pinned p5.js 2.3.2 and on 1.x alike. When pasting it into the p5.js editor, upload `data.json` too.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/p5-2x-migration-mapper/main.html"
        height="682px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers and learning-technology developers who maintain p5.js MicroSims (college undergraduate or professional development).

### Duration

15-20 minutes

### Prerequisites

- The sections on library version drift and the p5.js 2.x migration in Chapter 5
- Reading knowledge of a p5.js sketch: `setup()`, `draw()`, `beginShape()` and `endShape()` (Chapter 6)

### Activities

1. **Predict (3 min):** For each snippet, write down the line you expect to be flagged before pressing Flag legacy calls.
2. **Convert (8 min):** Convert all four snippets. Aim for a correct pick on the first try; the counter at the top right shows how many you have converted.
3. **Explain (4 min):** For the `curveVertex()` and `quadraticVertex()` snippets, explain in one sentence why the "half right" candidate is not enough, using the words of the migration table.
4. **Transfer (5 min):** Open one of the affected MicroSims named in the feedback box, find the legacy call in its sketch file, and write the 2.x replacement.

### Assessment

- Given a new 1.x snippet that uses one of the four calls, the learner names the call that is no longer valid and writes its 2.x form.
- The learner explains why `preload()` code must move into `async function setup()` with `await`.
- The learner distinguishes `splineVertex()` (the renamed `curveVertex()`) from `bezierVertex()` with `bezierOrder(2)` (the replacement for `quadraticVertex()`).

## References

1. [p5.js compatibility add-ons for 1.x sketches](https://github.com/processing/p5.js-compatibility) - The p5.js project's notes and add-ons for running code written for 1.x.
2. [p5.js bezierVertex() reference](https://p5js.org/reference/p5/bezierVertex/) - One control point per call in 2.x.
3. [p5.js bezierOrder() reference](https://p5js.org/reference/p5/bezierOrder/) - Selecting quadratic (order 2) Bezier curves.
4. [p5.js splineVertex() reference](https://p5js.org/reference/p5/splineVertex/) - The 2.x replacement for `curveVertex()`, including `endShape(CLOSE)`.
5. [Software versioning](https://en.wikipedia.org/wiki/Software_versioning) - Background on major versions and breaking changes.
