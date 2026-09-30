---
title: Audit Baseline Explorer
description: Explore the 2026-09-30 audit of 116 MicroSims by grade and find which rubric issues most often hold MicroSims below the grade A bar.
image: /sims/audit-baseline-explorer/audit-baseline-explorer.png
og:image: /sims/audit-baseline-explorer/audit-baseline-explorer.png
twitter:image: /sims/audit-baseline-explorer/audit-baseline-explorer.png
social:
   cards: false
quality_score: 100
---

# Audit Baseline Explorer

<iframe src="main.html" height="572px" width="100%" scrolling="no"></iframe>

[Run the Audit Baseline Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Before the MicroSims 2.0 rewrite, every MicroSim folder in this repository was scored with `validate-sims.py`. The audit, recorded in the repository's `TODO.md` on 2026-09-30, found 116 MicroSims with a mean score of 60.6: 18 in grade A, 27 in B, 30 in C and 41 in D. This MicroSim charts that baseline.

The top chart shows MicroSims per grade. The bottom chart shows how often eight rubric issues occur, sorted from most to least, with bar color showing what each check is worth (10, 5 or 3 points). Click a grade bar to filter the issue chart to that grade and read the audit's recommended action, or choose **Below A** to combine grades B, C and D, the MicroSims that must be raised before they can be carried over. Switch the issue chart to **Total points lost** to weigh each issue by its rubric points: a frequent 3-point issue can cost less than a rarer 10-point one.

The grade counts and issue totals are the published audit figures. The per-grade breakdown was tallied from the per-MicroSim issue lists in the same `TODO.md` section, and it sums to those totals.

**Learning objective:** The learner will examine the 2026-09-30 audit of 116 MicroSims and identify which rubric issues most often hold MicroSims below the grade A bar.

**Bloom level:** Analyze. **Bloom verb:** examine.

## How to Use

1. Hover a grade bar to see its band and share; click it to filter the issue chart (click again to show all grades).
2. Use **Grades** to choose all grades, Below A, or a single grade.
3. Hover an issue bar to see its count, its rubric points and the points gained by fixing it.
4. Switch **Issue chart shows** between *Counts* and *Total points lost* and compare the order of the bars.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/audit-baseline-explorer/main.html"
        height="572px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development).

### Duration

15 minutes

### Prerequisites

- The 100-point rubric and grades (Chapter 13)

### Activities

1. **Read the baseline (3 min):** State what share of the 116 MicroSims is already at grade A and what share is in grade D.
2. **Below the bar (5 min):** Choose Below A. Name the three issues that most often hold MicroSims back, first by count and then by points lost. Explain any change in order.
3. **Grade B (4 min):** Filter to grade B. Which two fixes, together, would lift most grade-B MicroSims into grade A? Check the arithmetic with the rubric.
4. **Plan (3 min):** Using the audit's recommended actions, argue whether a grade-D MicroSim should be raised or rebuilt from a specification.

### Assessment

- The learner identifies the most common and the most costly issues below the A bar and explains the difference.
- The learner links each grade to its recommended action.
- Exit question: "Every grade-A MicroSim lacks the schema tag. Why does that not keep it out of grade A?"

## References

1. [Chapter 13: Quality Assurance and Automated Layout Review](../../chapters/13-quality-assurance-and-automated-layout-review/index.md) — the quality grade table and the audit of 116 MicroSims.
2. [Chart.js bar chart documentation](https://www.chartjs.org/docs/latest/charts/bar.html) — vertical and horizontal bar charts (indexAxis).
3. [Pareto chart](https://en.wikipedia.org/wiki/Pareto_chart) — Wikipedia article on sorting problems by frequency to find the few that matter most.
