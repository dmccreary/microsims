---
title: Class Dashboard Load Estimator
description: Calculate how much a teacher's browser must download to build an LRS-Lite class dashboard, estimate the load-time band, and decide when the design's rollup function is needed.
image: /sims/class-dashboard-load-estimator/class-dashboard-load-estimator.png
og:image: /sims/class-dashboard-load-estimator/class-dashboard-load-estimator.png
twitter:image: /sims/class-dashboard-load-estimator/class-dashboard-load-estimator.png
social:
   cards: false
quality_score: 100
---

# Class Dashboard Load Estimator

<iframe src="main.html" height="542px" width="100%" scrolling="no"></iframe>

[Run the Class Dashboard Load Estimator Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

An LRS-Lite teacher dashboard has no dashboard server. The teacher's browser fetches every
student's `summary.json` from object storage in parallel and computes the class heatmap,
completion funnel and at-risk list itself. That works well for one class, but the download
grows with the roster. The design estimates about **11 KB gzipped** per student summary, puts
**150 students at about one to four seconds**, and adds an on-demand **rollup function above
roughly 100 students** that pre-aggregates the class into one file.

This estimator does the arithmetic:

- **Total download (MB)** = students × summary size (KB) ÷ 1000, fetched as one file per
  student.
- The dashed line marks the total download at **100 students** for the current summary size,
  the design's approximate threshold for using the rollup.
- The thin gray bar is the **rollup download**: one file. Its size is an illustrative
  assumption (2 KB per student plus 20 KB of class aggregates), not a design figure.
- The **load-time band** is an illustrative model calibrated so that 150 students at 11 KB
  gives about one to four seconds, as the design states.

The text panel names one of three outcomes: *Browser aggregation is comfortable*, *Expect a
few seconds*, or *Use the rollup function*.

**Learning objective:** The learner will calculate the download size and load-time band for a
teacher dashboard at a given roster size and decide whether the design's rollup function is
needed.

**Bloom's taxonomy level:** Apply (verb: *calculate*)

## How to Use

1. At the defaults (30 students, 11 KB), read the panel: 30 downloads, 0.33 MB in total.
2. Hover each bar to see its exact value and the formula behind it.
3. Drag **Students** upward. Watch the total bar approach the dashed 100-student line, and
   note when the message changes.
4. Drag **Summary size** up to 30 KB. The dashed line moves because it marks 100 students at
   the new size. Does a larger summary change when you should expect a few seconds?
5. Set 150 students and 11 KB and check that the band matches the design's one to four
   seconds.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/class-dashboard-load-estimator/main.html"
        height="542px"
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

- The idea of a browser-side dashboard and object storage sync (Chapter 23)
- Kilobytes and megabytes (1 MB = 1000 KB in this model)

### Activities

1. **Compute by hand (3 min):** For 30, 90 and 150 students at 11 KB, compute the total
   download. Check each against the chart.
2. **Find the switch points (4 min):** At 11 KB, find the smallest roster where the message
   becomes "Expect a few seconds" and where it becomes "Use the rollup function".
3. **Vary the summary (4 min):** Repeat at 20 KB and 30 KB. Explain why the first switch
   point moves but the rollup threshold does not.
4. **Decide (3 min):** A teacher has four sections of 35 students and wants one dashboard for
   all of them. Recommend whether to enable the rollup, citing the numbers.

### Assessment

- The learner computes the total download for a given roster and summary size.
- The learner states the load-time band and which message applies, with a reason.
- The learner explains which figures are design estimates and which are illustrative.

## References

1. [Dashboard (computing)](https://en.wikipedia.org/wiki/Dashboard_(computing)) - Wikipedia.
   What a dashboard aggregates and displays.
2. [Amazon S3](https://en.wikipedia.org/wiki/Amazon_S3) - Wikipedia. The object store that
   holds each student's `summary.json` in the LRS-Lite design.
3. [Experience API](https://en.wikipedia.org/wiki/Experience_API) - Wikipedia. The statement
   format summarized in each student's record.
4. [Chart.js bar chart documentation](https://www.chartjs.org/docs/latest/charts/bar.html) -
   Chart.js. The library used to draw the chart.
