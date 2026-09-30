---
title: Portfolio Milestone Planner
description: Design a week-by-week schedule for a capstone MicroSim portfolio by changing the number of MicroSims, test participants and weeks available, and see which milestone gates the schedule puts at risk.
image: /sims/portfolio-milestone-planner/portfolio-milestone-planner.png
og:image: /sims/portfolio-milestone-planner/portfolio-milestone-planner.png
twitter:image: /sims/portfolio-milestone-planner/portfolio-milestone-planner.png
social:
   cards: false
quality_score: 100
---

# Portfolio Milestone Planner

<iframe src="main.html" height="682px" width="100%" scrolling="no"></iframe>

[Run the Portfolio Milestone Planner MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Chapter 25 orders the capstone into seven milestones over a suggested 8-week schedule: Plan,
Specify and generate, Instrument, Test and review, Protect, Evaluate and Present. Each milestone
has a deliverable and a gate it must pass before the next stage can rely on it. This planner draws
the milestones as bars on a week grid, one after another, and lets you fit the plan to your own
portfolio.

Three stages depend on the size of the portfolio:

| Stage | What stretches it | Illustrative estimate |
|---|---|---|
| Specify and generate | Number of MicroSims | 0.4 week per MicroSim |
| Instrument | Number of MicroSims | 0.2 week per MicroSim |
| Test and review | Test participants and MicroSims | 0.25 week + 0.15 per participant + 0.06 per MicroSim |

The other four stages stay at one week each. With the defaults (5 MicroSims, 3 participants) the
plan reproduces the chapter's suggested 8 weeks. These durations are illustrative planning
estimates chosen to reproduce that schedule, not measured effort data; use them to reason about
trade-offs, then replace them with your own estimates.

A bar turns amber, with a dashed outline and an exclamation mark, when it would finish after the
last available week (the dashed deadline line), or when its gate is at risk for another reason:
the project brief asks for three or more test participants. Click a bar to read its deliverable,
its gate, how its length was estimated and, for an amber bar, a one-sentence warning.

**Learning objective:** The learner will design a week-by-week schedule for their own portfolio
and identify which milestone gates put the schedule at risk.

**Bloom's taxonomy level:** Create (verb: *design*)

## How to Use

1. Set **Weeks available** to the length of your own course project.
2. Set **Number of MicroSims** and **Test participants** to the portfolio you intend to build.
3. Read the summary line under the chart: it states the weeks needed and names every milestone
   that finishes after the deadline or has a gate at risk.
4. Click any bar, or Tab to the chart and use the arrow keys, to see its deliverable, gate,
   estimate and warning.
5. Adjust the sliders until no bar is amber, then press **Reset to suggested schedule** to compare
   your plan with the chapter's suggestion.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/portfolio-milestone-planner/main.html"
        height="682px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development).

### Duration

20-30 minutes

### Prerequisites

- The capstone project brief, milestones and gates in Chapter 25
- The quality gate (Chapter 13) and the instrumentation check (Chapter 17)

### Activities

1. **Explore (5 min):** Move each slider from one end to the other. Record which bars change
   length and which only move.
2. **Design (10 min):** Enter your real constraints (weeks, MicroSims, participants). Produce a
   schedule with no amber bars and write it down week by week, with each gate on the week it
   must pass.
3. **Stress test (5 min):** Take one week away. Name the gate that first falls past the deadline
   and decide what you would cut: a MicroSim, a participant, or scope inside a stage.
4. **Critique the model (5 min):** The estimates are illustrative. Write which one you think is
   most wrong for your own situation, and what you would measure to replace it.

### Assessment

- The learner's final schedule fits the available weeks and meets the brief's minimums (4 to 6
  MicroSims of at least three types, 3 or more test participants).
- The learner names the gate most at risk in their plan and gives a concrete mitigation.
- The learner states that the durations are estimates and says how they would check them.

## References

1. [Gantt chart](https://en.wikipedia.org/wiki/Gantt_chart) - Wikipedia. The bar-on-timeline
   format used by the planner.
2. [Phase-gate process](https://en.wikipedia.org/wiki/Phase-gate_process) - Wikipedia. Stages that
   must pass a gate before the next stage begins.
3. [Usability testing](https://en.wikipedia.org/wiki/Usability_testing) - Wikipedia. Background on
   the test-and-review milestone.
4. [createSlider()](https://p5js.org/reference/p5/createSlider/) - p5.js reference. The slider
   controls used here.
