---
title: Comparison Poster Explorer
description: Explore a three-column robot-kit comparison poster by hovering and clicking its percentage zones, then answer which-column quiz questions that each name one property true of exactly one kit.
image: /sims/comparison-poster-explorer/comparison-poster-explorer.png
og:image: /sims/comparison-poster-explorer/comparison-poster-explorer.png
twitter:image: /sims/comparison-poster-explorer/comparison-poster-explorer.png
social:
   cards: false
quality_score: 100
---

# Comparison Poster Explorer

<iframe src="main.html" height="642px" width="100%" scrolling="no"></iframe>

[Run the Comparison Poster Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A **comparison poster** sets two or three items side by side in parallel columns so a reader
can compare them attribute by attribute. A grid overlay turns each column into a **poster
column zone**, a percentage rectangle that responds to hover, click and quiz questions.

This MicroSim redraws the STEM Robots kit-comparison poster with p5.js shapes. Its three
columns, **Base Bot**, **WiFi Bot** and **Display Bot**, are zones from 2 to 34, 34 to 67 and
67 to 98 percent across and 12 to 90 percent down, the values used in Chapter 10. The poster
prints only each column's title, price badge, a robot drawing and a short tagline. The summary
and facts that open in the panel below come from the STEM Robots `robot-kits` data file, and
the five quiz questions are that file's own `quiz` list.

In **Explore** mode, hovering a column outlines it in gold and clicking it opens its summary and
facts. In **Quiz Me** mode, the columns are dimmed and a question appears above the poster.
A wrong click names the column you chose and lets you try again. A right click reveals the
column and shows the explanation. Unlike the grid engine described in Chapter 10, which counts
only correct answers, this version reports how many questions were answered correctly on the
**first** try.

**Learning objective:** The learner will compare three items across the same attributes by
exploring the columns of a poster, and will identify which column matches a described property.

**Bloom's taxonomy level:** Analyze (verb: *compare*)

## How to Use

1. In Explore mode, click each column and read its facts. Look for the attributes the kits
   share (motors, the VL53L0X distance sensor) and the one attribute that sets each apart.
2. Check **Show zone edges** to see the four percentage values of every zone.
3. Press **Quiz Me**. Read the question above the poster and click the matching column. After a
   correct answer, press **Next question**.
4. Press **Explore** at any time to return to the facts.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/comparison-poster-explorer/main.html"
        height="642px"
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

- The Poster Column Zones, Zone Summary and Facts, and Explore Mode and Quiz Mode sections of
  Chapter 10
- Reading a percentage rectangle zone (x1, y1, x2, y2)

### Activities

1. **Explore (5 min):** Open all three columns. Build a three-row table on paper: attributes the
   kits share, the attribute unique to each kit, and the price difference between neighbors.
2. **Quiz (5 min):** Complete the five questions. Record your first-try score.
3. **Critique (5 min):** For one question, explain which single fact makes the answer
   unambiguous. Then write one new question for the Base Bot whose answer is true of that
   column only.

### Assessment

- First-try score on the five quiz questions.
- The learner's shared-versus-unique attribute table.
- A new which-column question that is true of exactly one column and names the fact that
  decides it.

## References

1. [Infographic - Wikipedia](https://en.wikipedia.org/wiki/Infographic) - Background on
   posters that present information visually for quick comparison.
2. [Raspberry Pi microcontroller documentation](https://www.raspberrypi.com/documentation/microcontrollers/) -
   Official documentation for the Pico series, including the WiFi-capable Pico W used in the
   WiFi Bot.
3. [p5.js createButton() reference](https://p5js.org/reference/p5/createButton/) - The builtin
   buttons used for the Explore and Quiz Me modes.
4. [p5.js mousePressed() reference](https://p5js.org/reference/p5/mousePressed/) - The event
   function that performs the rectangular hit test on the zones.
