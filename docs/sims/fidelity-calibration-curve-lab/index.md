---
title: Calibration Curve Lab
description: Build a reliability curve from a seeded synthetic cohort, read its bin counts, and diagnose whether a knowledge-tracing forecast is overconfident, underconfident or well calibrated.
image: /sims/fidelity-calibration-curve-lab/fidelity-calibration-curve-lab.png
og:image: /sims/fidelity-calibration-curve-lab/fidelity-calibration-curve-lab.png
twitter:image: /sims/fidelity-calibration-curve-lab/fidelity-calibration-curve-lab.png
social:
   cards: false
quality_score: 100
---

# Calibration Curve Lab

<iframe src="main.html" height="622px" width="100%" scrolling="no"></iframe>

[Run the Calibration Curve Lab MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

**Calibration** asks whether a forecast of 0.70 comes true about 70 percent of the time. To check it, sort the learners into bins by their forecast, then compare the average forecast in each bin with the fraction of learners in that bin who actually succeeded. Plotting observed against predicted gives a **reliability curve**; a perfectly calibrated model traces the dashed diagonal.

This lab builds that curve in the browser from a synthetic cohort generated with the same rules as Chapter 19's worked example: each learner starts mastered with probability 0.30, answers four practice items and one held-out item, slips with probability 0.10, guesses with the scenario's true guess rate, and learns with probability 0.15 after each practice answer. The forecast is the Chapter 18 BKT estimate after the four practice answers, converted to the chance of a correct held-out answer. Its random numbers match Python's `random` module, so seed 19 with 200 learners and five equal-width bins reproduces the chapter's table exactly: 65, 25, 8 and 102 learners, with mean forecasts 0.332, 0.586, 0.653 and 0.880 against observed rates 0.400, 0.520, 0.500 and 0.824.

Each point's area is proportional to the number of learners in its bin. Bins with fewer than ten learners get a dashed outline and the hover text "Too few learners to trust this point", because a large gap in a small bin is a reason to gather more data, not proof of miscalibration.

Three scenarios are available:

- **Model parameters match the simulation:** the best case, calibrated by construction.
- **True guess rate 0.35, model assumes 0.20:** the chapter's mismatched case. The lowest bin forecasts 0.341 on average while 0.574 succeed; the forecasts are too extreme (overconfident).
- **True guess rate 0.20, model assumes 0.35:** the reverse mistake, added so that underconfidence can also be diagnosed. The forecasts are squeezed toward the middle.

**Learning objective:** Learners will diagnose whether a synthetic model is overconfident, underconfident or well calibrated by reading a reliability curve and its bin counts.

**Bloom level:** Analyze (L4). **Bloom verb:** diagnose.

## How to Use

1. Read the default curve and table: the chapter's cohort, 200 learners in five bins. Hover over a point to see its bin range, count, mean forecast and observed fraction.
2. Choose a **Scenario**. The points glide to their new positions.
3. Decide whether the curve is flatter than the diagonal (overconfident), steeper (underconfident) or close to it (well calibrated), giving weight only to the large, solid points. Press your diagnosis to get feedback.
4. Change the **Number of bins** (3 to 10) and the **Cohort size** (50 to 1000) and see how the smallest bins become unreliable.
5. Press **Redraw cohort** for a fresh seed to see how much the curve moves from one sample to the next.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/fidelity-calibration-curve-lab/main.html"
        height="622px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development) who will read or publish calibration results for mastery forecasts.

### Duration

20 minutes.

### Prerequisites

- Forecast probabilities, the Brier score and calibration (Chapter 19)
- The BKT guess parameter and the synthetic cohort (Chapters 18 and 19)

### Activities

1. **Read the chapter's table (4 min):** With the default settings, learners find the bin with the largest gap between forecast and observed rate and explain why it is not evidence of miscalibration.
2. **Diagnose the three scenarios (8 min):** For each scenario, learners sketch the curve, name its shape relative to the diagonal and record a diagnosis before pressing a button.
3. **Stress the bins (4 min):** Learners set 10 bins and 50 learners, count the dashed points and explain what the rule "merge bins with fewer than about ten learners" protects against.
4. **Link to the parameters (4 min):** Learners explain, in terms of the guess parameter, why assuming guessing is rarer than it is makes a model overconfident.

### Assessment

- Given a reliability curve with bin counts, the learner classifies the model as overconfident, underconfident or well calibrated and names the bins that support the conclusion.
- The learner explains why a gap in a bin of 8 learners should not change the diagnosis on its own.

## References

1. [Chapter 19: Evaluating the Predictive Fidelity of the xAPI Stream](../../chapters/19-evaluating-the-predictive-fidelity-of-the-xapi-stream/index.md) - calibration, bin counts and the mismatched-guess-rate example.
2. [Calibration (statistics)](https://en.wikipedia.org/wiki/Calibration_%28statistics%29) - reliability diagrams and calibration of probability forecasts.
3. [Brier score](https://en.wikipedia.org/wiki/Brier_score) - the score whose reliability term the curve visualizes.
4. [Plotly JavaScript scatter plots](https://plotly.com/javascript/line-and-scatter/) - the chart type used for the reliability curve.
