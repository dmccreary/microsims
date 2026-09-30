---
title: BKT Parameter Lab
description: Set the four Bayesian knowledge tracing parameters and a sequence of correct and incorrect answers, watch the mastery estimate update after each answer, and find when it first reaches a mastery threshold.
image: /sims/bkt-parameter-lab/bkt-parameter-lab.png
og:image: /sims/bkt-parameter-lab/bkt-parameter-lab.png
twitter:image: /sims/bkt-parameter-lab/bkt-parameter-lab.png
social:
   cards: false
quality_score: 100
---

# BKT Parameter Lab

<iframe src="main.html" height="772px" width="100%" scrolling="no"></iframe>

[Run the BKT Parameter Lab MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Bayesian knowledge tracing (BKT) keeps one probability of mastery, P(L), per learner and concept,
and updates it after every answer in two steps. First it conditions on the answer with Bayes'
rule:

$$
P(L_n \mid \text{correct}) = \frac{P(L_n)(1 - p_s)}{P(L_n)(1 - p_s) + (1 - P(L_n))\,p_g}
\qquad
P(L_n \mid \text{incorrect}) = \frac{P(L_n)\,p_s}{P(L_n)\,p_s + (1 - P(L_n))(1 - p_g)}
$$

Then it applies learning:

$$
P(L_{n+1}) = P(L_n \mid \text{evidence}) + \bigl(1 - P(L_n \mid \text{evidence})\bigr)\,p_t
$$

The four parameters are initial knowledge P(L0), learning rate p_t, guess p_g and slip p_s. With
the chapter's illustrative values (0.30, 0.15, 0.20, 0.10) the sequence correct, incorrect,
correct, correct gives 0.71, 0.35, 0.75 and 0.94, the table in Chapter 18. Every number in this
lab is computed live from those equations.

The chart plots the estimate after each attempt, with a dashed line for the mastery threshold,
and rings the first attempt at which the estimate reaches it. With the default threshold of 0.95
the default sequence stops just short at 0.94; one more correct answer crosses it. Check
**Show intermediate numbers** to see the conditioning value (orange circles on the chart) and the
learning step, with every multiplication written out, for the selected attempt. If you set
guess + slip to 1 or more, the lab warns that the model no longer behaves as BKT assumes.

**Learning objective:** The learner will calculate the mastery estimate after each answer in a
sequence by choosing the four BKT parameters, and will judge when the estimate first reaches a
chosen mastery threshold.

**Bloom's taxonomy level:** Apply (verb: *calculate*)

## How to Use

1. Read the default chart: 0.30, then 0.71, 0.35, 0.75 and 0.94.
2. Check **Show intermediate numbers** and click a point to select an attempt (or use the left and
   right arrow keys). Work the two steps by hand, then compare.
3. Click a tile to flip that answer between correct and incorrect, or press **F** to flip the
   selected one. **Add correct** and **Add incorrect** extend the sequence (up to 20 answers).
4. Move the four parameter sliders and the **Mastery threshold** slider and watch when the
   estimate first reaches the threshold. **Reset** restores the default sequence and values.
5. Hover a point to see its attempt, answer and value.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/bkt-parameter-lab/main.html"
        height="772px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development).

### Duration

20-25 minutes

### Prerequisites

- Probability and Bayes' rule at an introductory level
- The BKT parameters and the two-step update (Chapter 18)

### Activities

1. **Check the table (6 min):** With the defaults, calculate attempts 1 and 2 by hand, then turn
   on the intermediate numbers and compare each step with yours.
2. **One parameter at a time (8 min):** Raise the guess parameter from 0.20 to 0.50 and record how
   much the first correct answer raises the estimate. Do the same with slip. Explain the
   difference in terms of diagnostic value.
3. **Judge the threshold (7 min):** For thresholds of 0.90 and 0.95, find the attempt at which an
   all-correct sequence is first declared mastered (the chapter reports after the second and the
   third answer). Argue which threshold you would use for a quiz that is easy to guess.

### Assessment

- The learner calculates the conditioning value and the learning step for a new answer to within
  0.01 of the lab's values.
- The learner states the attempt at which the estimate first reaches a given threshold.
- The learner explains why one wrong answer lowers but does not zero the estimate.

## References

1. [Bayesian knowledge tracing](https://en.wikipedia.org/wiki/Bayesian_knowledge_tracing) - Wikipedia. The model, its four parameters and its update.
2. [Bayes' theorem](https://en.wikipedia.org/wiki/Bayes%27_theorem) - Wikipedia. The rule used in the conditioning step.
3. [Hidden Markov model](https://en.wikipedia.org/wiki/Hidden_Markov_model) - Wikipedia. BKT is a two-state hidden Markov model.
4. [p5.js createSlider() reference](https://p5js.org/reference/p5/createSlider/) - p5.js. The control used for each parameter.
