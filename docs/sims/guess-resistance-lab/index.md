---
title: Guess Resistance Lab
description: Compare how easily a pure guesser succeeds on different probe designs by changing the number of options, the number of chained items and the retry policy, then simulate one guesser or a thousand.
image: /sims/guess-resistance-lab/guess-resistance-lab.png
og:image: /sims/guess-resistance-lab/guess-resistance-lab.png
twitter:image: /sims/guess-resistance-lab/guess-resistance-lab.png
social:
   cards: false
quality_score: 100
---

# Guess Resistance Lab

<iframe src="main.html" height="682px" width="100%" scrolling="no"></iframe>

[Run the Guess Resistance Lab MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A **guess-resistant probe** is a question or task built so that a learner who does not know the
concept rarely produces the right response. Chapter 26 shows the arithmetic: a random guess on a
four-option item succeeds with probability \( 1/4 \), and two independent four-option items are
both guessed correctly with probability \( 1/16 \). In general, for a probe of *chained* items that
must all be right, each with the same number of *options*, the chance of a lucky success on the
first attempt is

\[
P(\text{lucky first attempt}) = \frac{1}{\text{options}^{\text{chained}}}
\]

The lab shows that number as a bar beside three reference designs from the chapter's table: a
four-option item (1 in 4), the six-hotspot poster quiz (1 in 6) and two chained four-option items
(1 in 16).

The retry policy changes the story. With **Allow retry until correct**, a guesser keeps trying
combinations it has not tried before, so it is guaranteed to succeed within
\( \text{options}^{\text{chained}} \) attempts. That is the failure the chapter records for the
animal-cell poster, where a learner can click every hotspot and be sure to land on the right one.
When retries are allowed, only the attempt sequence, not the final success, separates a knower
(right on attempt 1) from a guesser.

The simulated guesser picks uniformly at random among the options not yet tried. For chained
items, feedback is for the whole chain, as in the chapter's table, so a retry means trying a new
combination. The hidden correct tile is outlined so you can watch the guesser, who cannot see it.

**Learning objective:** The learner will compare the chance of a lucky success and the attempts
needed to guarantee success across probe designs by changing option count, chained items and
retry policy.

**Bloom's taxonomy level:** Apply (verb: *compare*)

## How to Use

1. Leave **Options** at 4 and **Chained items** at 1. Press **Guess randomly** several times and
   watch the sequence strip: one square per attempt, a cross for wrong and a check for right.
2. Press **Run 1000 guessers**. Compare the first-attempt successes with the bar for your design.
3. Turn on **Allow retry until correct** and run 1000 guessers again. Every guesser now succeeds;
   the histogram shows the attempts they needed, spread evenly from 1 to the maximum.
4. Raise **Chained items** to 2 and 3, and **Options** up to 12. Compare the bar with the three
   reference designs and note how many attempts retry would need.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/guess-resistance-lab/main.html"
        height="682px"
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

- The guess parameter of Bayesian knowledge tracing (Chapter 18)
- Guess-resistant probes and the animal-cell poster example (Chapter 26)

### Activities

1. **Predict (3 min):** Before touching the sliders, write the lucky-guess chance for a
   six-option item and for three chained four-option items. Check with the bar chart.
2. **Compare designs (5 min):** Find two settings that give roughly the same lucky-guess chance,
   one with many options and one with chained items. Discuss which is easier to build well.
3. **Retry (5 min):** With retry on, run 1000 guessers for a four-option item. Explain why every
   guesser succeeds and what a learning record should keep so a guesser does not look like a
   knower.
4. **Design (optional, 5 min):** Redesign the six-hotspot poster quiz so a pure guesser succeeds
   less than 5 percent of the time, and say how you would score retries.

### Assessment

- The learner computes \( 1/\text{options}^{\text{chained}} \) for a given design and matches it
  to the simulation.
- The learner states the maximum attempts to guarantee success with retry for a given design.
- The learner explains why keeping only the final success makes a retry-until-correct question
  close to worthless as evidence.

## References

1. [Bayesian knowledge tracing](https://en.wikipedia.org/wiki/Bayesian_knowledge_tracing) -
   Wikipedia. The guess and slip parameters of knowledge tracing.
2. [Multiple choice](https://en.wikipedia.org/wiki/Multiple_choice) - Wikipedia. Guessing and
   scoring in selected-response items.
3. [Simple random sample](https://en.wikipedia.org/wiki/Simple_random_sample) -
   Wikipedia. Why the correct option's position among untried options is uniform.
4. [random()](https://p5js.org/reference/p5/random/) - p5.js reference. The random number
   function used by the simulated guessers.
