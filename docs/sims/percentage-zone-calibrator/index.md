---
title: Percentage Zone Calibrator
description: Drag the corners of a zone over a placeholder poster and watch the pixel-to-percentage calculation for x1, y1, x2 and y2, then practice matching a target zone and predicting whether a click falls inside.
image: /sims/percentage-zone-calibrator/percentage-zone-calibrator.png
og:image: /sims/percentage-zone-calibrator/percentage-zone-calibrator.png
twitter:image: /sims/percentage-zone-calibrator/percentage-zone-calibrator.png
social:
   cards: false
quality_score: 100
---

# Percentage Zone Calibrator

<iframe src="main.html" height="537px" width="100%" scrolling="no"></iframe>

[Run the Percentage Zone Calibrator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A grid overlay describes each clickable region of a poster as a **percentage rectangle zone**:
four numbers, `x1`, `y1`, `x2` and `y2`, each a percentage of the image's width or height.
`x1` and `y1` locate the top-left corner and `x2` and `y2` the bottom-right corner. Because the
numbers are percentages, the zone covers the same part of the picture whether the poster is
shown 300 or 1,400 pixels wide.

This MicroSim puts one translucent zone over a placeholder poster with three colored columns.
The zone starts on the first column, at the chapter's worked-example values of 2 to 34 percent
across and 12 to 90 percent down. Drag any of the four corner handles and the readout shows the
calculation for each edge:

$$
x_1 = \frac{\text{pixels from the left edge of the picture}}{\text{picture width in pixels}} \times 100
$$

and likewise for `y1` and `y2` with the picture height. The sketch stores only the percentages
and converts them to pixels on every frame, so the **Resize picture** slider changes every pixel
number in the readout while the percentages stay the same. Pixel values are rounded to whole
pixels, so a hand calculation can differ from the displayed percentage in the last decimal
place.

**Learning objective:** The learner will calculate the x1, y1, x2 and y2 percentages of a
rectangle drawn over an image and predict whether a given click falls inside it.

**Bloom's taxonomy level:** Apply (verb: *calculate*)

## How to Use

1. Drag a corner handle. Watch the pixel offset, the picture size and the resulting percentage
   for that edge in the readout.
2. Move the **Resize picture** slider. The pixel numbers change and the percentages do not.
3. Uncheck **Show percentages**. The readout keeps the pixel division but hides the answer, so
   you can calculate each edge yourself before checking it again.
4. Press **Target practice**. A dashed orange target appears. Drag the zone onto it and press
   **Check match**. Each edge must be within 2 percentage points; the readout reports the error
   for every edge.
5. Check **Click test**. Predict whether a point is inside the zone, then click it. The readout
   applies the rule "inside when x1 ≤ x ≤ x2 and y1 ≤ y ≤ y2" and names the edge that fails.
6. Press **Copy JSON** to see the zone in the shape a grid overlay's `data.json` uses. The text
   is also copied to the clipboard where the browser allows it.

When the page is narrower than 600 pixels, the readout moves under the picture.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/percentage-zone-calibrator/main.html"
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

- The Grid Overlay and Percentage Rectangle Zones sections of Chapter 10
- Converting a fraction to a percentage

### Activities

1. **Predict (3 min):** Before touching anything, write down what will happen to `x1` if the
   picture is shown at half its width. Move the Resize picture slider to check.
2. **Calculate (5 min):** Turn off Show percentages. Drag the zone to cover the middle column,
   compute all four percentages from the pixel readout by hand, then turn the percentages back
   on to check.
3. **Match (4 min):** Complete two Target practice rounds. Note which edge was hardest to place
   within 2 points and why.
4. **Click test (3 min):** With Click test on, predict inside or outside for five clicks near
   the zone's edges before making each one.

### Assessment

- Given a 600 × 450 pixel picture and a rectangle whose top-left corner is at (90, 54) and
  bottom-right corner at (300, 405) pixels, the learner calculates x1 = 15, y1 = 12, x2 = 50 and
  y2 = 90.
- Given a zone and a click at a stated percentage position, the learner predicts inside or
  outside and names the inequality that decides it.
- The learner explains why storing percentages, not pixels, keeps a zone on the same part of
  the poster at every display width.

## References

1. [Percentage - Wikipedia](https://en.wikipedia.org/wiki/Percentage) - How a part-to-whole
   ratio is expressed out of 100, the conversion every zone edge uses.
2. [Minimum bounding rectangle - Wikipedia](https://en.wikipedia.org/wiki/Minimum_bounding_rectangle) -
   Axis-aligned rectangles described by minimum and maximum x and y, the same four-number form
   as a zone.
3. [p5.js createSlider() reference](https://p5js.org/reference/p5/createSlider/) - The builtin
   slider used for the Resize picture control.
4. [p5.js createCheckbox() reference](https://p5js.org/reference/p5/createCheckbox/) - The
   builtin checkbox used for Show percentages and Click test.
