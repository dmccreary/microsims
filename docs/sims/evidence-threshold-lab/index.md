---
title: Evidence Threshold Lab
description: Move the hover, misclick and glance thresholds and watch a scripted 60-second learner session gain or lose statements, then justify a choice of thresholds by the noise it keeps and the attention it throws away.
image: /sims/evidence-threshold-lab/evidence-threshold-lab.png
og:image: /sims/evidence-threshold-lab/evidence-threshold-lab.png
twitter:image: /sims/evidence-threshold-lab/evidence-threshold-lab.png
social:
   cards: false
quality_score: 100
---

# Evidence Threshold Lab

<iframe src="main.html" height="772px" width="100%" scrolling="no"></iframe>

[Run the Evidence Threshold Lab MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The xAPI runtime keeps noise out of the record with three non-evidence thresholds, constants in
`lrs-sim.js` that authors reference and never change:

| Constant | Value | Applies to | Reason |
|---|---|---|---|
| `HOVER_MS` | 600 ms | discrete inspection by hover | a pointer crossing a diagram enters many nodes in a few hundred milliseconds |
| `MISCLICK_MS` | 250 ms | a run | a shorter run is a mis-click and would add zero-length rows |
| `GLANCE_MS` | 1000 ms | page dwell | under one second on a page is a glance |

This lab replays one fixed, scripted 60-second session: eight quick node hovers of 100 to 500 ms,
three longer hovers of 700 to 1200 ms, a 120 ms run, a 40-second run, a 0.7-second glance and a
2.4-second look at a static chart, and one answered question. Each slider moves one threshold.
Acts at or above a threshold turn green and become statements; acts below it turn gray and are
filtered. The list shows the verb and object of every emitted statement, and the cost table
counts two kinds of error: likely noise kept (crossings, a mis-click, a glance) and likely
attention lost (long hovers, a real look). The answered statement is never affected.

The chapter is candid that 600, 250 and 1000 ms are design judgments, not values fitted to
learner data. The lab lets you see what each judgment trades away.

**Learning objective:** The learner will justify a choice of hover, misclick and glance
thresholds by observing how each changes the number and kind of statements produced from a
fixed, scripted session.

**Bloom's taxonomy level:** Evaluate (verb: *justify*)

## How to Use

1. Start at the runtime defaults and count the statements (6 of 16 acts).
2. Drag **Hover threshold** to 0 and watch every crossing become an `interacted` statement.
   Then drag it to 1500 and watch the long hovers disappear.
3. Move **Misclick threshold** below 120 ms and **Glance threshold** below 700 ms or above
   2400 ms, and read the cost table and notes.
4. Hover any bar to see its duration and the rule that admitted or removed it.
5. Check **Show statements that were filtered out** to see every act in the list, struck
   through when filtered. **Reset to runtime defaults** restores 600, 250 and 1000 ms.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/evidence-threshold-lab/main.html"
        height="772px"
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

- The three MicroSim verbs and the evidence classes (Chapter 16)
- The hover, misclick and glance thresholds and the reasons given for each

### Activities

1. **Observe the extremes (5 min):** For each slider, record the statement count at its minimum,
   at the default and at its maximum.
2. **Find the safe band (5 min):** For this session, find the range of hover thresholds that keeps
   no crossing and loses no long hover. Do the same for the glance threshold.
3. **Justify (7 min):** Write a short paragraph defending a set of three thresholds for a MicroSim
   used on touch screens by younger learners. Name one kind of evidence your choice would lose and
   explain why you accept that cost.

### Assessment

- The learner states the band of hover thresholds (above 500 ms, up to 700 ms) that separates this
  session's crossings from its long hovers.
- The learner explains why no threshold changes the answered statement.
- The learner's justification names both a kind of noise kept and a kind of attention lost, and
  acknowledges that the defaults are untested design judgments.

## References

1. [Experience API](https://en.wikipedia.org/wiki/Experience_API) - Wikipedia. The xAPI standard whose statements the thresholds filter.
2. [Signal-to-noise ratio](https://en.wikipedia.org/wiki/Signal-to-noise_ratio) - Wikipedia. The general idea behind keeping sub-threshold acts out of the record.
3. [Precision and recall](https://en.wikipedia.org/wiki/Precision_and_recall) - Wikipedia. A vocabulary for the trade-off between noise kept and attention lost.
4. [p5.js createSlider() reference](https://p5js.org/reference/p5/createSlider/) - p5.js. The control used for each threshold.
