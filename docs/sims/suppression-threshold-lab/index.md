---
title: Suppression Threshold Lab
description: Predict which counts in a small mastery-band table must be hidden under a suppression threshold, see how a single hidden cell leaks through the row total by subtraction, and apply complementary suppression to close the leak.
image: /sims/suppression-threshold-lab/suppression-threshold-lab.png
og:image: /sims/suppression-threshold-lab/suppression-threshold-lab.png
twitter:image: /sims/suppression-threshold-lab/suppression-threshold-lab.png
social:
   cards: false
quality_score: 100
---

# Suppression Threshold Lab

<iframe src="main.html" height="562px" width="100%" scrolling="no"></iframe>

[Run the Suppression Threshold Lab MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Dashboards that aggregate people can reveal individuals. The full LRS design refuses to show a
number built from fewer students than its **suppression threshold**, 10 by default. Hiding one
small cell is not enough when the table also publishes a **Row Total**: anyone can subtract the
visible cells from the total and recover the hidden count. **Complementary suppression** closes
that leak by hiding a second cell in the same row, so the total gives away only the sum of two
hidden cells.

This lab shows two schools in a cross-school view, with student counts in four mastery bands
(Beginning, Developing, Proficient, Advanced) and a published Row Total. It uses these rules:

- A count from 1 to one below the threshold is hidden (red, with a lock). A zero stays visible,
  as in the chapter's worked example.
- With **Apply complementary suppression** checked, a row with exactly one hidden cell also hides
  its smallest non-zero visible count (amber, with a lock). A row with two or more hidden cells
  needs no complement.

Each cell starts unrevealed. Click a count and predict **Hidden** or **Shown** before the answer
appears. Once every cell is revealed, the line under the table says whether any hidden value can
still be recovered, and **Show the subtraction** draws the arithmetic.

The three scenarios are: **All cells safe**; **One small cell**, the chapter's example (14, 9, 22,
0, total 45, where 45 − 36 = 9); and **Complementary suppression needed**, where the complement
must skip a zero and one school has two small cells. The design's suppression filter is designed,
not built, and the counts here are made up.

**Learning objective:** The learner will apply a suppression threshold and complementary
suppression to a small table and predict which cells must be hidden so that no hidden count can be
recovered by subtraction.

**Bloom's taxonomy level:** Apply (verb: *apply*)

## How to Use

1. With **One small cell** and complementary suppression off, click each count and predict
   Hidden or Shown. Read the feedback after each prediction.
2. When all eight cells are revealed, read the recovery line and the drawn subtraction: which
   value leaks?
3. Check **Apply complementary suppression** and watch a second cell lock and the leak close.
4. Press **Reset** to hide the answers again and predict with complementary suppression on.
5. Try **Complementary suppression needed**, then move the **Threshold** slider between 5 and 20
   and predict how the table changes. **Reveal all** shows every answer at once.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/suppression-threshold-lab/main.html"
        height="562px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development).

### Duration

15-20 minutes

### Prerequisites

- The Suppression Threshold section of Chapter 21
- Why a small group can identify an individual by elimination
- Adding and subtracting row counts

### Activities

1. **Predict the chapter's example (5 min):** In **One small cell**, predict all eight cells with
   complementary suppression off, then explain the leak in one sentence.
2. **Close the leak (4 min):** Turn complementary suppression on, press Reset and predict again.
   Record your score and explain why the complement is the smallest non-zero cell.
3. **Harder table (6 min):** In **Complementary suppression needed**, predict every cell at a
   threshold of 10, then at 5 and at 15. Explain why Hillcrest needs no complement at 10.

### Assessment

- The learner hides exactly the cells below the threshold and correctly predicts when a second
  cell must be hidden.
- The learner shows, with the row total, how a single hidden cell is recovered by subtraction
  and why two hidden cells reveal only their sum.
- The learner explains why a zero is a poor complement in this table.

## References

1. [Statistical disclosure control](https://en.wikipedia.org/wiki/Statistical_disclosure_control) - Wikipedia. Suppression and related methods for protecting individuals in published tables.
2. [Family Educational Rights and Privacy Act](https://en.wikipedia.org/wiki/Family_Educational_Rights_and_Privacy_Act) - Wikipedia. The United States education-records law the design aligns with.
3. [Contingency table](https://en.wikipedia.org/wiki/Contingency_table) - Wikipedia. Tables of counts with row and column totals.
4. [p5.js createSelect() reference](https://p5js.org/reference/p5/createSelect/) - p5.js. The control used to choose a scenario.
