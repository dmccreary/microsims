---
title: Reinforcing and Balancing Behavior Lab
description: Compare how a reinforcing loop and a balancing loop behave over time by changing the loop rate, the goal and the start value and predicting how each curve will respond.
image: /sims/feedback-behavior-lab/feedback-behavior-lab.png
og:image: /sims/feedback-behavior-lab/feedback-behavior-lab.png
twitter:image: /sims/feedback-behavior-lab/feedback-behavior-lab.png
social:
   cards: false
quality_score: 0
---

# Reinforcing and Balancing Behavior Lab

<iframe src="main.html" height="652px" width="100%" scrolling="no"></iframe>

[Run the Reinforcing and Balancing Behavior Lab MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A causal loop diagram shows the *structure* of a system. This lab shows the *behavior* that
structure produces. It runs the two update rules from Chapter 8 side by side, one time step
at a time:

- **Reinforcing loop (R, red circles):** `x = x + rate * x`. The change each step is
  proportional to the current value, so growth feeds more growth and the curve bends upward.
- **Balancing loop (B, green squares):** `x = x + rate * (goal - x)`. The change each step is
  proportional to the distance from the goal, so the curve rises quickly at first and then
  levels off at the dashed goal line.

Both curves share the same rate and start value, so any difference you see comes from the
loop structure alone. The vertical axis always runs from 0 to twice the goal, so the goal line
sits at mid-height; when the reinforcing curve leaves the top of the chart, a marker shows the
step where it escaped. A caption under the chart explains the shape seen so far with the
actual numbers, for example "B is slowing: next step adds 0.10 × gap 34.9 = +3.5".

With **Predict first** turned on, the lab pauses each time you move a slider and asks whether
each curve will rise faster, slower or the same over the first 10 steps, compared with the
previous settings. The previous run stays on the chart as faint dashed curves, and after
step 10 the lab reports each result with the two rises. The most revealing change is the
start value: a higher start makes the reinforcing curve rise faster but the balancing curve
rise *slower*, because the balancing loop responds to the gap, not to the value.

**Learning objective:** The learner will compare the time behavior of a reinforcing loop and a
balancing loop by changing the loop rate and the goal and observing the resulting curves.

**Bloom's taxonomy level:** Understand (verb: *compare*)

## How to Use

1. Press **Start** and watch both curves grow for 50 steps. Read the caption as they grow.
2. Hover over any point to see its step number and exact value.
3. Move one slider: **Rate** (0.01 to 0.30), **Goal** (50 to 200) or **Start value** (1 to 50).
4. With **Predict first** checked, choose **Faster**, **Slower** or **Same** for the R curve
   and for the B curve. The run starts when both predictions are in, and the panel (or the
   caption on narrow screens) reports whether you were right, with the rise over the first
   10 steps before and after your change.
5. Press **Reset** to clear the prediction state, or uncheck **Predict first** to explore
   freely.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/feedback-behavior-lab/main.html"
        height="652px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development). No prior system dynamics
background is assumed.

### Duration

15 to 20 minutes

### Prerequisites

- The definitions of a feedback loop, a polarity link, a reinforcing loop and a balancing
  loop (Chapter 8, "Systems and Feedback")
- Reading a line graph with time on the horizontal axis

### Activities

1. **Observe (3 min):** Run the default settings (rate 0.10, goal 100, start 10). Describe the
   shape of each curve in one sentence, using the words "accelerating" and "leveling off".
2. **Predict and test (7 min):** With **Predict first** on, make three single-slider changes:
   raise the rate, raise the goal, then raise the start value. Record each prediction and
   result in a table with columns for the change, R and B.
3. **Compare (5 min):** In pairs, explain why raising the goal changes the B curve but not the
   R curve, and why raising the start value speeds up R but slows down B. Use the two update
   rules in your explanation.
4. **Connect (3 min):** Relate each curve to the learner loops from the chapter: Mastery,
   Confidence and Practice time (R1), and Gap, Study effort and Mastery (B1). Which one
   describes a learner who is catching up to a fixed learning goal?

### Assessment

- Given a new setting, the learner predicts correctly whether each curve will rise faster,
  slower or the same, and justifies the prediction from the update rule.
- The learner states the difference in one sentence: a reinforcing loop changes in proportion
  to its current value, while a balancing loop changes in proportion to its distance from a
  goal.
- The learner identifies which loop type produces goal-seeking behavior and which produces
  exponential growth or decline.

## References

1. [System dynamics](https://en.wikipedia.org/wiki/System_dynamics) - Wikipedia. The field
   that studies how stocks, flows and feedback loops produce behavior over time.
2. [Causal loop diagram](https://en.wikipedia.org/wiki/Causal_loop_diagram) - Wikipedia.
   Explains reinforcing and balancing loops and the sign-counting rule.
3. [Exponential growth](https://en.wikipedia.org/wiki/Exponential_growth) - Wikipedia. The
   behavior of a pure reinforcing loop, where the growth rate is proportional to the value.
4. [p5.js createSlider() reference](https://p5js.org/reference/p5/createSlider/) - p5.js.
   The built-in slider control used for the rate, goal and start value.
