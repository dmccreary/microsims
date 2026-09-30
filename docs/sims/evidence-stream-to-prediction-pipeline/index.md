---
title: From Interaction to Mastery Prediction
description: Step an assessment answer and a slider drag through the six stages from a learner's action to a mastery prediction, and see which stage discards exposure evidence.
image: /sims/evidence-stream-to-prediction-pipeline/evidence-stream-to-prediction-pipeline.png
og:image: /sims/evidence-stream-to-prediction-pipeline/evidence-stream-to-prediction-pipeline.png
twitter:image: /sims/evidence-stream-to-prediction-pipeline/evidence-stream-to-prediction-pipeline.png
social:
   cards: false
quality_score: 100
---

# From Interaction to Mastery Prediction

<iframe src="main.html" height="622px" width="100%" scrolling="no"></iframe>

[Run the From Interaction to Mastery Prediction MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A mastery prediction is the end of a chain that starts with something a learner does. This
MicroSim draws that chain as six stages:

1. **Learner action**: what the learner does in the MicroSim.
2. **xAPI statement**: one JSON record of that action, with one concept ID.
3. **Evidence stream (per concept)**: the learner's statements for one concept, in order.
4. **Filter**: the rule that keeps only what the model can use. For a model that needs a
   right-or-wrong result, only statements carrying `result.success` pass.
5. **Model**: Bayesian knowledge tracing, which conditions on each answer and then applies the
   learning step.
6. **Estimate and prediction**: the mastery estimate P(L) and the predicted chance that the next
   answer is correct.

Click any stage to read its definition, what enters it, what leaves it, and an example. Then
send a sample event and step it through the chain. An **assessment answer** (a correct answer
on the elasticity prediction) travels to the end and raises the estimate: from 0.30 to 0.71 on
the first answer, using the chapter's illustrative parameters P(L0) = 0.30, p_t = 0.15,
p_g = 0.20 and p_s = 0.10. A **slider drag** is real exposure evidence and enters the stream,
but it stops at the Filter with "attempts = 0: no right-or-wrong to condition on", and the
estimate does not move. Every infobox text is also written to the browser console as a log line.

**Learning objective:** The learner will explain what enters and leaves each stage between a
learner's action and a mastery prediction, and identify which stage discards exposure evidence.

**Bloom's taxonomy level:** Understand (verb: *explain*)

## How to Use

1. Click each stage in turn and read its input and output. Hover a stage to highlight the
   arrows into and out of it.
2. Choose **Slider drag** under Send. Press **Next stage** to move the event one stage at a
   time. Watch where it stops and what the Filter says.
3. Choose **Assessment answer** and step it to the end. Read the BKT update at the Model stage
   and the prediction at the last stage.
4. Press **Send another** to send more events; the estimate keeps climbing with each correct
   answer (0.71, 0.93, 0.99). **Reset** returns the estimate to 0.30.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/evidence-stream-to-prediction-pipeline/main.html"
        height="622px"
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

- The three MicroSim verbs and the evidence classes (Chapter 16)
- The idea of a mastery estimate as a probability (Chapter 18)

### Activities

1. **Trace (5 min):** Step one slider drag and one answer through the chain. For each stage,
   write one line: what entered and what left.
2. **Explain the stop (4 min):** In two sentences, explain why the slider drag never reaches the
   model, and what a soft correctness mapping would have to add for it to count.
3. **Predict (4 min):** Before sending a second answer, predict the new estimate, then check it.

### Assessment

- The learner names the Filter as the stage that discards exposure evidence and gives the reason
  (no `result.success`, so zero attempts).
- For any stage, the learner states its input and output.
- The learner explains why an estimate is a probability about a hidden state, not a verdict.

## References

1. [Bayesian knowledge tracing](https://en.wikipedia.org/wiki/Bayesian_knowledge_tracing) - Wikipedia. The model used at the Model stage.
2. [Hidden Markov model](https://en.wikipedia.org/wiki/Hidden_Markov_model) - Wikipedia. The two-state model behind BKT.
3. [Experience API](https://en.wikipedia.org/wiki/Experience_API) - Wikipedia. The statement format at the second stage.
4. [xAPI Specification, Part Two: Experience API Data (version 1.0.3)](https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md) - ADL. Defines `result.success` and the other result fields.
