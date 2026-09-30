---
title: Height Resolution Order Tracer
description: Examine a MicroSim folder, predict which of the four height sources the height sync tool will use, and trace the resolution order to the resulting iframe height.
image: /sims/height-resolution-order-tracer/height-resolution-order-tracer.png
og:image: /sims/height-resolution-order-tracer/height-resolution-order-tracer.png
twitter:image: /sims/height-resolution-order-tracer/height-resolution-order-tracer.png
social:
   cards: false
quality_score: 100
---

# Height Resolution Order Tracer

<iframe src="main.html" height="612px" width="100%" scrolling="no"></iframe>

[Run the Height Resolution Order Tracer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Not every MicroSim has a script, so the height sync tool, `sync-iframe-heights.py`, looks for a MicroSim's height in four places and takes the **first** one that has a value. Chapter 12 calls this the **height resolution order**:

1. `// CANVAS_HEIGHT: <n>` in the first 15 lines of `<sim-id>.js`
2. `"canvasHeight": <n>` in `metadata.json`
3. `<!-- CANVAS_HEIGHT: <n> -->` in `main.html`
4. `drawHeight + controlHeight` computed from the script (the tool then writes the comment back into line 2)

This MicroSim shows one MicroSim folder, `docs/sims/demo-sim/`, and the four sources as numbered boxes. You decide which files hold a height and what the values are, click the box you predict will win, and press **Trace**. The highlight walks down from priority 1, passes empty sources in gray, and stops in green on the first source with a value. The result panel shows `CANVAS_HEIGHT = n, iframe = n + 2`, or turns amber with *unresolved: iframes left untouched*. When a lower source disagrees with the winner, it is tagged *ignored*; hover it to see why the tool never reads it.

The rules copy the real script: only a plain integer counts, the script comment must use the sim's own file name, and the `index.md` line shows the height the tool would write, with the `px` suffix.

**Learning objective:** The learner will examine a MicroSim folder and determine which of the four height sources a synchronization tool would use, and what iframe height results.

**Bloom level:** Analyze. **Bloom verb:** examine.

## How to Use

1. Choose a **Preset**: a p5.js sketch with the comment, a Mermaid diagram with only metadata, a legacy HTML comment, a sketch with only variables, or no height anywhere.
2. Read the folder tree on the left. Tick or untick a source with the checkboxes (or click its line in the tree), and change the numbers in the fields.
3. Click the source box you think the tool will use, or the result panel if you think nothing will be found.
4. Press **Trace** and compare the result with your prediction.
5. Make two sources disagree, for example tick metadata.json with 480 while the comment says 450, trace again, and hover the orange box.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/height-resolution-order-tracer/main.html"
        height="612px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development).

### Duration

15 minutes

### Prerequisites

- The CANVAS_HEIGHT comment and the rule iframe height = CANVAS_HEIGHT + 2 (Chapter 12)
- The files in a MicroSim folder: main.html, the script, metadata.json, index.md (Chapter 2)

### Activities

1. **Predict (5 min):** For each of the five presets, write down the winning source and the iframe height before pressing Trace. Check each one.
2. **Disagreement (5 min):** Turn on the comment (450) and metadata.json (480) together. Explain why 480 is ignored and what the `--write-metadata` flag would do to it.
3. **Write-back (3 min):** Use the "Sketch with variables only" preset. Explain what the tool writes into line 2 of the script and why the next run is faster and safer.
4. **Transfer (2 min):** Open a MicroSim folder in your own project and name the source the sync tool would use for it.

### Assessment

- Given a description of a MicroSim folder, the learner names the source the tool uses and the iframe height it writes.
- The learner explains why a lower-priority value that disagrees is never read, and how to remove the drift.
- Exit question: "A Leaflet map has no script, no metadata height and no HTML comment. What happens to its iframes?"

## References

1. [Chapter 12: Width-Responsive Design and Iframe Heights](../../chapters/12-width-responsive-design-and-iframe-heights/index.md) — the height resolution order, the CANVAS_HEIGHT comment and the height sync tool.
2. [HTML iframe element (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) — the `height` attribute that the sync tool rewrites.
3. [p5.js createCheckbox() reference](https://p5js.org/reference/p5/createCheckbox/) — the built-in control used for each source.
4. [p5.js createInput() reference](https://p5js.org/reference/p5/createInput/) — the number fields for the source values.
