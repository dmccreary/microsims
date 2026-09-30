---
title: Callout Overlay Anatomy Explorer
description: See how each field of an overlay data file (x, y, label, hint, description) turns into a marker, a label, a quiz clue or an information box on a text-free cell illustration.
image: /sims/callout-overlay-anatomy-explorer/callout-overlay-anatomy-explorer.png
og:image: /sims/callout-overlay-anatomy-explorer/callout-overlay-anatomy-explorer.png
twitter:image: /sims/callout-overlay-anatomy-explorer/callout-overlay-anatomy-explorer.png
social:
   cards: false
quality_score: 0
---

# Callout Overlay Anatomy Explorer

<iframe src="main.html" height="622px" width="100%" scrolling="no"></iframe>

[Run the Callout Overlay Anatomy Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A callout overlay has two halves that only work together: a picture with no words in it, and a
data file that holds every word and every position. This MicroSim puts both halves on screen at
once. On the left is a flat-color animal cell drawn with p5.js shapes, with four numbered markers
(nucleus, cell membrane, mitochondrion and ribosome), leader lines and a label column, as the
callout engine draws them. On the right is the overlay data file as syntax-colored JSON, using the
same field names as the overlay schema: `id`, `label`, `x`, `y`, `radius`, `color`, `hint` and
`description`.

Every field has a visible job, and the MicroSim lets you watch each one:

| Field | Where it appears |
|---|---|
| `x`, `y` | The marker's position, in percent of the picture's width and height |
| `label` | The text beside the leader line in the label column |
| `hint` | The clue shown in Quiz mode |
| `description` | The information box under the picture |
| `color`, `radius` | The marker's fill color and size |

Hovering a marker highlights its leader line, its block in the JSON and its description. The
**x** and **y** sliders move the selected marker and rewrite its percentages in the JSON as you
drag. The **Resize picture** slider shrinks the picture to as little as half its width; because
the positions are percentages, every marker stays on its structure. **Quiz** mode hides the labels
(and the matching text in the JSON), shows each hint in turn, and asks you to click the marker it
describes.

**Learning objective:** The learner will explain how each field of an overlay data file (position,
label, hint, description) appears in the rendered overlay, by changing one field and observing the
effect.

**Bloom's taxonomy level:** Understand (verb: *explain*)

## How to Use

1. Hover over each marker and read the highlighted JSON block and the information box.
2. Click a marker to select it, then drag the **x** and **y** sliders. Watch the marker move and
   the numbers change in the JSON.
3. Drag **Resize picture** down to 50 percent. Check that each marker is still on its structure.
4. Press **Quiz**, read each hint, and click the matching marker. Press **Explore** to return.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/callout-overlay-anatomy-explorer/main.html"
        height="622px"
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

- JSON objects and fields (Chapter 1)
- Callout labels, point markers, hover zones and the overlay data file (Chapter 10, "The Callout
  Engine")

### Activities

1. **Map the fields (4 min):** Hover each marker. For each of `x`, `y`, `label`, `hint` and
   `description`, write one sentence naming where it appears on screen.
2. **Change one field (4 min):** Select the mitochondrion and move it with the **x** and **y** sliders until it
   sits on the other mitochondrion. Record the new `x` and `y` values and explain what edit mode
   alignment in a real overlay would do with them.
3. **Why percentages (3 min):** Resize the picture to 50 percent. Explain why markers stored in
   pixels would drift off their structures and markers stored in percentages do not.
4. **Quiz and critique (4 min):** Take the quiz. Then rewrite one `hint` so that it describes the
   structure without naming it, as the overlay guide requires.

### Assessment

- The learner states where each of `x`, `y`, `label`, `hint` and `description` appears in the
  rendered overlay.
- The learner explains why positions are stored as percentages of the image size.
- The learner writes a new callout object with all required fields for a fifth structure.

## References

1. [Cell (biology)](https://en.wikipedia.org/wiki/Cell_(biology)) - Wikipedia. Background on the
   animal cell structures used in the illustration.
2. [Mitochondrion](https://en.wikipedia.org/wiki/Mitochondrion) - Wikipedia. The organelle behind
   callout 3 and its role in cellular respiration.
3. [JSON](https://en.wikipedia.org/wiki/JSON) - Wikipedia. The format of the overlay data file.
4. [p5.js mouseMoved() reference](https://p5js.org/reference/p5/mouseMoved/) - p5.js. The event
   used for hover detection on the markers.
