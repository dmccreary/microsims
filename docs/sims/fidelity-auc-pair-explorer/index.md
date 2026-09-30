---
title: AUC Pair Explorer
description: Connect the ROC curve to a live count of random pairs and explain AUC as the chance that a random successful learner outranks a random unsuccessful one.
image: /sims/fidelity-auc-pair-explorer/fidelity-auc-pair-explorer.png
og:image: /sims/fidelity-auc-pair-explorer/fidelity-auc-pair-explorer.png
twitter:image: /sims/fidelity-auc-pair-explorer/fidelity-auc-pair-explorer.png
social:
   cards: false
quality_score: 100
---

# AUC Pair Explorer

<iframe src="main.html" height="582px" width="100%" scrolling="no"></iframe>

[Run the AUC Pair Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

**Discrimination** is a model's ability to give learners who will succeed higher forecasts than learners who will fail. Its standard summary, **AUC**, is the area under the receiver operating characteristic (ROC) curve. The curve plots, for every possible cutoff, the fraction of successful learners called successful (the true-positive rate) against the fraction of unsuccessful learners wrongly called successful (the false-positive rate). The area has a plain reading that needs no calculus: pick one learner who answered the held-out item correctly and one who did not, both at random, and AUC is the probability that the model gave the first a higher forecast, with ties counted as half.

The explorer shows both readings side by side for a synthetic cohort of 40 learners. On the left, 24 learners who answered correctly (green circles) and 16 who did not (orange squares) sit along a forecast axis from 0 to 1. The dashed cutoff line splits them into "called successful" (right, shaded) and "called unsuccessful" (left), and the readout gives the true-positive and false-positive rates. On the right, the same cutoff is a point on the ROC curve, and the shaded area is the AUC.

**Draw random pair** picks one green and one orange learner and highlights which one the model ranked higher. **Draw 100 pairs** repeats the draw, and the running fraction of pairs won settles on the AUC line: the two definitions agree. With the default signal strength of 0.6 the AUC is 0.742, close to the 0.743 of the chapter's synthetic BKT model. At signal strength 0 the two groups get the same spread of forecasts, the ROC curve wanders along the diagonal and the AUC is exactly 0.500.

The forecasts are synthetic rank scores, so only their order matters here; AUC ignores calibration. The random draws are seeded, so the cohort is the same every time the page loads.

**Learning objective:** Learners will explain AUC as the probability that a random successful learner outranks a random unsuccessful one, by connecting the ROC curve to a live count of correct pairs.

**Bloom level:** Understand (L2). **Bloom verb:** explain.

## How to Use

1. Move the **Cutoff** slider. Watch the dashed line slide along the strip and the black point move along the ROC curve; the readout shows the true-positive and false-positive rates for that cutoff.
2. Press **Draw random pair** a few times. Each draw connects one green and one orange learner and says whether the model ranked the successful learner higher.
3. Press **Draw 100 pairs** and watch the running fraction approach the dashed AUC line.
4. Move **Signal strength** to 0, then to 1. The cohort is recomputed, the pair count restarts, and the ROC curve and AUC change with it. Hover over any dot to see its forecast.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/fidelity-auc-pair-explorer/main.html"
        height="582px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development) who need to read and explain AUC values in reports on predictive fidelity.

### Duration

15 minutes.

### Prerequisites

- Discrimination versus calibration (Chapter 19)
- True-positive and false-positive rates as fractions of each group

### Activities

1. **Predict (2 min):** Before drawing any pair, learners estimate from the strip how often a random green learner sits to the right of a random orange one.
2. **One pair at a time (4 min):** Learners draw ten single pairs, tally wins by hand and compare the tally with the AUC readout.
3. **Converge (3 min):** Learners draw 100 pairs twice and describe how close the running fraction gets to the AUC line and why it wobbles.
4. **Sweep the cutoff (3 min):** Learners move the cutoff from 1 down to 0 and explain why the ROC point moves up and to the right, and why the point never changes the AUC.
5. **Explain (3 min):** Learners write two sentences explaining an AUC of 0.74 to a teacher without using the words "curve" or "area".

### Assessment

- The learner explains in plain words that an AUC of 0.74 means a randomly chosen successful learner has the higher forecast about 74 percent of the time.
- The learner explains why a signal strength of 0 gives an AUC of 0.5 and a ROC curve near the diagonal.
- The learner states that moving the cutoff changes the true-positive and false-positive rates but not the AUC.

## References

1. [Chapter 19: Evaluating the Predictive Fidelity of the xAPI Stream](../../chapters/19-evaluating-the-predictive-fidelity-of-the-xapi-stream/index.md) - discrimination, AUC and the pair-counting function.
2. [Receiver operating characteristic](https://en.wikipedia.org/wiki/Receiver_operating_characteristic) - the ROC curve, AUC and its probabilistic interpretation.
3. [Mann-Whitney U test](https://en.wikipedia.org/wiki/Mann%E2%80%93Whitney_U_test) - the rank statistic that equals AUC times the number of pairs.
4. [p5.js reference: createSlider()](https://p5js.org/reference/p5/createSlider/) - the control used for the cutoff and the signal strength.
