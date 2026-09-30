---
title: Semester Storage Estimator
description: Calculate a semester's xAPI statement count and LRS-Lite storage footprint from daily activity assumptions, then judge the headroom left under the 10 MB budget in Summary and Full mode.
image: /sims/lite-semester-storage-estimator/lite-semester-storage-estimator.png
og:image: /sims/lite-semester-storage-estimator/lite-semester-storage-estimator.png
twitter:image: /sims/lite-semester-storage-estimator/lite-semester-storage-estimator.png
social:
   cards: false
quality_score: 100
---

# Semester Storage Estimator

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the Semester Storage Estimator Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

LRS-Lite keeps each student's learning record in a small database inside the browser, so the
design has to show that a semester of statements is small enough to live there. This estimator
repeats the design's back-of-the-envelope arithmetic. You set the daily activity of one student
and the emission mode, and the chart shows the raw and gzipped size of a semester against the
10 MB budget.

The model uses the design's own rules:

- **Summary mode** statements per day = page reads + sim sessions + quiz answers.
- **Full mode** statements per day = page reads + quiz answers + sim sessions × (drags + 2).
- **Raw size** = statements × 980 bytes. **Gzipped size** ≈ raw ÷ 10 (the design's approximate
  ratio).
- **Headroom** = 10 MB ÷ gzipped size.

The figures are modelled from synthetic statements, not from real learners. The **Load design
cases** button steps through the four measured cases from the chapter's table and shows the
measured values next to the model's. The measured gzip ratio is about 10 times for summary
statements but about 15 to 17 times for Full mode, so "÷ 10" is only an approximation.

**Learning objective:** The learner will calculate the statement count and storage footprint of
a semester from activity assumptions, and judge how much headroom remains under a 10 MB limit.

**Bloom's taxonomy level:** Apply (verb: *calculate*)

## How to Use

1. Start with the defaults, the design's typical student: 6 page reads, 4 sim sessions and 15
   quiz answers per active day for 90 days, in Summary mode. Check the readout: 25 statements
   a day, 2,250 per semester, about 0.22 MB gzipped, about 45 times headroom.
2. Hover a bar to see its exact value and the formula that produced it.
3. Press **Full** to switch the emission mode. Every sim session now costs drags + 2
   statements. Move the **Drags / session** slider and watch the bars.
4. Press **Load design cases** repeatedly to snap the controls to each of the four cases in
   the chapter's table. Compare the model's gzip figure with the measured one.
5. Try to find settings that cross 6 MB gzipped (60% of the budget) or 10 MB. Which mode and
   which slider does it take?

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/lite-semester-storage-estimator/main.html"
        height="602px"
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

- What an xAPI statement is (Chapter 16)
- The difference between Full mode and Compact (summary) mode (Chapter 22)
- Megabytes as 1,000,000 bytes

### Activities

1. **Check the worked example (3 min):** With the defaults, compute the statements per day,
   the statements per semester, the raw size and the gzipped size by hand. Confirm each number
   against the readout.
2. **Full mode (4 min):** Switch to Full. Before touching anything, predict the statements per
   day for 40 drags per session. Then verify: 6 + 15 + 4 × (40 + 2) = 189.
3. **Design cases (4 min):** Step through the four design cases. For each, record the model's
   gzip size and the measured one. Explain why the model overstates Full mode.
4. **Stress test (4 min):** Find the smallest number of drags per session that pushes a heavy
   student in Full mode over 6 MB gzipped. Discuss whether the 10 MB budget is a working
   constraint or a safety rail.

### Assessment

- Given reads, sessions, answers, days and mode, the learner computes the statements per
  semester and the gzipped size to within rounding.
- The learner states the headroom multiple for a case and explains what it means.
- The learner explains which two levers (summarizing and compression) keep a semester small.

## References

1. [Experience API](https://en.wikipedia.org/wiki/Experience_API) - Wikipedia. The statement
   format whose size this estimator models.
2. [xAPI specification](https://github.com/adlnet/xAPI-Spec) - Advanced Distributed Learning
   (ADL) on GitHub. The structure of a statement.
3. [gzip](https://en.wikipedia.org/wiki/Gzip) - Wikipedia. The compression format used to size
   the stored segments.
4. [Chart.js bar chart documentation](https://www.chartjs.org/docs/latest/charts/bar.html) -
   Chart.js. The library used to draw the chart.
