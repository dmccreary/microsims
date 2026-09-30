---
title: Held-Out Split Explorer
description: Drag a forecast cutoff along one synthetic learner's xAPI timeline and judge which statements may feed a mastery forecast and which leak the held-out assessment.
image: /sims/fidelity-held-out-split-explorer/fidelity-held-out-split-explorer.png
og:image: /sims/fidelity-held-out-split-explorer/fidelity-held-out-split-explorer.png
twitter:image: /sims/fidelity-held-out-split-explorer/fidelity-held-out-split-explorer.png
social:
   cards: false
quality_score: 100
---

# Held-Out Split Explorer

<iframe src="main.html" height="542px" width="100%" scrolling="no"></iframe>

[Run the Held-Out Split Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A **held-out assessment** is a test whose results the prediction model has never used. The model may use everything the stream recorded during practice, but not the assessment answers or any statement produced after them. Otherwise the forecast is graded on answers it has already seen, which measures memory, not foresight.

The explorer shows twelve xAPI statements from one synthetic learner over five days, in three lanes: practice answers, exposure events (page views and MicroSim interactions) and a single held-out assessment answer, a transfer item on Thursday. A dashed forecast cutoff marks the end of the evidence window. The side panel lists the statements the model may use, and the readout shows:

- the forecast of a correct held-out answer, computed with the Chapter 18 BKT update from the answers in use (the practice answers correct, incorrect, correct, correct give 0.86);
- a mock cohort accuracy taken from Chapter 19's synthetic cohort of 200 learners: 0.705 when the model sees all four practice answers, against a base rate of 0.635.

Any statement that is in use although it is the held-out answer, comes after the held-out assessment, or lies beyond the cutoff is leakage, and it gets a vermillion ring. Checking **Allow the model to see assessment answers** feeds the held-out answer to the model on purpose: the mock accuracy jumps to 0.910, and the readout warns "Score is inflated: the forecast saw its own answer key."

The same rule applies one level up. Here the BKT parameters are fixed in advance, so leakage can only enter through the statements. If the parameters were fitted to data, the fit must not use the held-out answers of the learners being evaluated either: split by learner, so that no learner's own assessment outcome helps build the model that forecasts it.

The synthetic learner, the timestamps and the mock accuracies are illustrative. They show the timing rule, not any real learner.

**Learning objective:** Learners will distinguish statements that may legitimately feed a forecast from those that leak the held-out assessment, by placing a forecast cutoff on a learner's timeline and judging each statement.

**Bloom level:** Analyze (L4). **Bloom verb:** distinguish.

## How to Use

1. Hover over any marker to see its type, timestamp and whether the model is using it.
2. Drag the dashed forecast cutoff left or right (or click inside the timeline, or use the left and right arrow keys). The panel updates the list of usable statements, and the forecast and mock accuracy change with the number of practice answers in the window.
3. Drag the cutoff past Thursday 09:00 and watch the held-out answer and every later statement turn into leaks.
4. Return the cutoff to Wednesday and check **Allow the model to see assessment answers**. The held-out answer is used even though it lies after the cutoff, and the accuracy is inflated.
5. **Reset** puts the cutoff back between Wednesday and Thursday and clears the checkbox.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/fidelity-held-out-split-explorer/main.html"
        height="542px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development) who will design or review an evaluation of learning-analytics forecasts.

### Duration

15 minutes.

### Prerequisites

- The evaluation protocol, the evidence window and the held-out assessment (Chapter 19)
- The BKT forecast of a correct next answer (Chapter 18)

### Activities

1. **Judge each statement (5 min):** With the cutoff at its default, learners label each of the twelve statements "may feed the forecast" or "must not", then check their labels against the panel.
2. **Find the legal limit (4 min):** Learners drag the cutoff to the latest position that still gives a clean split, and explain why statements #10 to #12 are leaks even though they are practice or exposure events.
3. **Break it on purpose (3 min):** Learners turn on the leakage checkbox, compare the mock accuracy with the clean value, and write the warning in their own words.
4. **Discuss (3 min):** Why does the mock accuracy with no practice answers in the window (0.365) fall below the base rate (0.635)?

### Assessment

- Given a new timeline, the learner marks the latest valid forecast cutoff and lists every statement that would leak if the cutoff were moved past the assessment.
- The learner explains in one or two sentences why an accuracy computed with leaked statements cannot count as evidence of predictive fidelity.

## References

1. [Chapter 19: Evaluating the Predictive Fidelity of the xAPI Stream](../../chapters/19-evaluating-the-predictive-fidelity-of-the-xapi-stream/index.md) - the evaluation protocol, the held-out assessment, transfer items and the synthetic cohort.
2. [Training, validation, and test data sets](https://en.wikipedia.org/wiki/Training,_validation,_and_test_data_sets) - why a test set must be held out from fitting.
3. [Leakage (machine learning)](https://en.wikipedia.org/wiki/Leakage_%28machine_learning%29) - how information from the outcome can contaminate a model's inputs.
4. [p5.js reference: mouseDragged()](https://p5js.org/reference/p5/mouseDragged/) - the event used to drag the forecast cutoff.
