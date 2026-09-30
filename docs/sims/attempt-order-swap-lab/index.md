---
title: Attempt Order Swap Lab
description: Drag answer tiles into two different orders and compare the Bayesian knowledge tracing estimates they produce, against a success-count model that cannot tell the orders apart.
image: /sims/attempt-order-swap-lab/attempt-order-swap-lab.png
og:image: /sims/attempt-order-swap-lab/attempt-order-swap-lab.png
twitter:image: /sims/attempt-order-swap-lab/attempt-order-swap-lab.png
social:
   cards: false
quality_score: 100
---

# Attempt Order Swap Lab

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the Attempt Order Swap Lab MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Bayesian knowledge tracing (BKT) updates a mastery estimate one answer at a time: it first conditions the estimate on the answer with Bayes' rule, then applies the learning step. Because each answer starts from the estimate the previous one left behind, the **attempt order** changes the result. Two learners with exactly the same answers can end in very different places.

The lab shows two orders of the same answers as two stacked line charts that share the same vertical axis from 0 to 1. With the chapter's illustrative parameters (initial knowledge 0.30, learning rate 0.15, guess 0.20, slip 0.10), two successes followed by two failures end at **0.33**, while two failures followed by two successes end at **0.88**. The summary strip between the charts shows that both orders contain the same evidence, "Successes: 2 of 4", yet the final estimates differ by 0.55.

Check **Show a success-count-only model** to overlay a flat line at each order's success rate. That model sees 0.50 for both orders, which is exactly what order erases. The brute-force preset shows why every attempt should be emitted: a learner who answers wrongly five times and then correctly ends at 0.56, while a stream that kept only the final success would report 0.71, the same as a learner who was right the first time.

Every estimate is computed live from the two BKT update equations, and the tile colors (bluish green with a check mark for correct, vermillion with a cross for incorrect) come from a color-blind-safe palette.

**Learning objective:** The learner will compare the final mastery estimates produced by two orderings of the same set of answers, and will distinguish what order changes from what a simple success count would show.

**Bloom level:** Analyze. **Bloom verb:** compare.

## How to Use

1. Read the default comparison: order A (successes first) and order B (failures first). Compare the two final estimates in the summary strip.
2. Drag any tile left or right within its row to reorder that row. The blue bar shows where the tile will land. The chart and the final estimate update as soon as you drop it.
3. Hover over a tile to see its position, the observation and the estimate after it. Each tooltip is also written to the browser console as a log line.
4. Check **Show a success-count-only model** and compare the dashed purple lines with the BKT trajectories.
5. Press **Preset: brute force (five wrong, then right)** to compare a learner whose every attempt was emitted with a stream that kept only the final success.
6. Move the four parameter sliders (initial knowledge, learning rate, guess, slip) and watch whether the gap between the orders grows or shrinks. **Reset** restores the defaults.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/attempt-order-swap-lab/main.html"
        height="602px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development) who will read or design mastery estimates computed from xAPI answer streams.

### Duration

15 minutes.

### Prerequisites

- The two-step BKT update and its four parameters (Chapter 18, "Bayesian Knowledge Tracing")
- The idea of an evidence stream as an ordered sequence of answers (Chapter 18)

### Activities

1. **Predict (3 min):** Before touching anything, learners write down which order they expect to end higher, successes first or failures first, and why.
2. **Compare (5 min):** Learners read the two final estimates, then drag tiles to find the order of two correct and two incorrect answers that ends highest and the one that ends lowest. They record both values and note that the success count never changed.
3. **Contrast with counting (3 min):** Learners check the success-count-only model and explain in one sentence what it cannot see.
4. **Brute force (4 min):** Learners press the brute-force preset and explain why a producer that emits only the final success would overstate this learner's mastery.

### Assessment

- The learner states that orders with the same success count can produce different BKT estimates, and cites the 0.33 and 0.88 values as evidence.
- The learner explains that the most recent answers weigh most heavily in the final estimate, and that a success-count model gives both orders the same value.
- Given a new sequence, such as incorrect, correct, incorrect, correct, the learner predicts whether its final estimate is above or below that of the reversed sequence and checks the prediction in the lab.

## References

1. [Chapter 18: Mastery Prediction and Knowledge Tracing](../../chapters/18-mastery-prediction-and-knowledge-tracing/index.md) - the BKT update, the attempt-order worked example and the brute-force argument.
2. [Bayesian knowledge tracing](https://en.wikipedia.org/wiki/Bayesian_knowledge_tracing) - Wikipedia overview of the model and its four parameters.
3. [Hidden Markov model](https://en.wikipedia.org/wiki/Hidden_Markov_model) - the model family that BKT belongs to.
4. [p5.js reference: mouseReleased()](https://p5js.org/reference/p5/mouseReleased/) - the event used to drop a tile into its new position.
