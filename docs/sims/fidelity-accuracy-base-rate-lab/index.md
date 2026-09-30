---
title: Accuracy Versus Base Rate Lab
description: Change how common success is and how informative a synthetic model is, and judge whether its accuracy beats the always-predict-the-majority baseline or carries no evidence at all.
image: /sims/fidelity-accuracy-base-rate-lab/fidelity-accuracy-base-rate-lab.png
og:image: /sims/fidelity-accuracy-base-rate-lab/fidelity-accuracy-base-rate-lab.png
twitter:image: /sims/fidelity-accuracy-base-rate-lab/fidelity-accuracy-base-rate-lab.png
social:
   cards: false
quality_score: 100
---

# Accuracy Versus Base Rate Lab

<iframe src="main.html" height="522px" width="100%" scrolling="no"></iframe>

[Run the Accuracy Versus Base Rate Lab MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

**Prediction accuracy** is the share of held-out outcomes a model calls correctly once its probabilities are turned into yes-or-no calls (forecast of at least 0.5 means "correct"). It is easy to explain and easy to misread. When most learners succeed, a forecaster that ignores the stream and always predicts "correct" is right most of the time. That **baseline** is what accuracy would be worth if the stream carried no information, so an accuracy claim means something only next to it.

The lab draws a synthetic cohort of 200 learners and compares two bars: the model's accuracy and the always-predict-the-majority baseline. The caption states the lift in percentage points. The first cohort reproduces Chapter 19's numbers: 127 of 200 learners (0.635) answer the held-out item correctly, the model is right on 141 (0.705), and the lift is about seven points.

- **Base rate of correct answers** sets how common success is (0.10 to 0.90).
- **Model signal strength** scales how informative the model is, from 0.0 (no information) to 1.0 (as informative as the chapter's synthetic BKT model).
- **Simulate 200 learners** draws a fresh cohort, so you can see how much the lift changes from one sample to the next.

When the model's accuracy is no better than the baseline, the lab says "This accuracy carries no evidence." At signal 0 this happens at every base rate. At extreme base rates it happens even at full signal, because the evidence is rarely strong enough to overturn the majority call; accuracy then hides a signal that the Brier score or AUC would show.

All values are synthetic. The model is a calibrated stand-in for the chapter's BKT forecaster: each learner's evidence score is normally distributed, shifted up for learners who will succeed and down for those who will not, and the forecast is the exact probability of success given that score. At signal 1.0 and base rate 0.635 its expected accuracy is about 0.705 and its expected AUC about 0.74, the chapter's values. The random numbers come from the same generator as Python's `random` module, so any cohort can be reproduced from its seed.

**Learning objective:** Learners will judge whether a reported accuracy demonstrates predictive value by comparing it with the always-predict-the-majority baseline as the base rate changes.

**Bloom level:** Evaluate (L5). **Bloom verb:** judge.

## How to Use

1. Read the default chart: model 0.705 against baseline 0.635, a lift of 7.0 percentage points.
2. Hover over a bar to see its exact value and how many of the 200 learners it classified correctly.
3. Drag **Model signal strength** to 0. The model's calls collapse to the majority class and its bar equals the baseline bar.
4. With signal back at 1.0, drag **Base rate of correct answers** to 0.90, then to 0.10. Watch the baseline rise and the lift shrink.
5. Press **Simulate 200 learners** several times at the default settings and note how much the lift varies between cohorts.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/fidelity-accuracy-base-rate-lab/main.html"
        height="522px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development) who read or report the accuracy of learning-analytics predictions.

### Duration

15 minutes.

### Prerequisites

- Prediction accuracy and the base-rate baseline (Chapter 19)
- The synthetic cohort and its 0.635 base rate (Chapter 19)

### Activities

1. **Judge a claim (3 min):** Show the claim "Our model predicts held-out success with 90 percent accuracy." Learners write what else they need to know before they believe it.
2. **Explore (6 min):** In pairs, learners find a base rate and signal setting where a 90 percent accuracy carries no evidence, and one where a 70 percent accuracy does carry evidence. They record both settings and both lifts.
3. **Sampling noise (3 min):** Learners press **Simulate 200 learners** five times at the default settings and record the smallest and largest lift.
4. **Rewrite the claim (3 min):** Learners rewrite the claim from step 1 so that it reports the baseline in the same sentence.

### Assessment

- Given a reported accuracy and a base rate, the learner states the baseline accuracy and the lift, and judges whether the accuracy demonstrates predictive value.
- The learner explains why an informative model can still tie the baseline on accuracy when the base rate is extreme, and names a score that would reveal the difference.

## References

1. [Chapter 19: Evaluating the Predictive Fidelity of the xAPI Stream](../../chapters/19-evaluating-the-predictive-fidelity-of-the-xapi-stream/index.md) - prediction accuracy, the base-rate baseline and the synthetic cohort.
2. [Accuracy paradox](https://en.wikipedia.org/wiki/Accuracy_paradox) - why a high accuracy can hide a useless model when classes are imbalanced.
3. [Base rate](https://en.wikipedia.org/wiki/Base_rate) - the prior frequency that every accuracy should be compared with.
4. [Chart.js bar chart documentation](https://www.chartjs.org/docs/latest/charts/bar.html) - the chart type used for the two bars.
