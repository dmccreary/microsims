---
title: Class Mastery Heatmap Reader
description: Read a synthetic class mastery heatmap to tell a concept the whole class struggles with (a dark column) from a student who struggles broadly (a dark row), and reweight the at-risk roster's three signals to see how the ranking changes.
image: /sims/class-mastery-heatmap-reader/class-mastery-heatmap-reader.png
og:image: /sims/class-mastery-heatmap-reader/class-mastery-heatmap-reader.png
twitter:image: /sims/class-mastery-heatmap-reader/class-mastery-heatmap-reader.png
social:
   cards: false
quality_score: 100
---

# Class Mastery Heatmap Reader

<iframe src="main.html" height="642px" width="100%" scrolling="no"></iframe>

[Run the Class Mastery Heatmap Reader MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The full LRS teacher dashboard opens on two reports for a section. The **Class Mastery Heatmap**
has one row per student and one column per concept, and each cell is shaded by that student's
estimated mastery of that concept. The **At-Risk Roster** ranks students by a composite risk
score.

This reader shows a synthetic section of 12 students and 8 concepts from a trigonometry unit
(unit circle through wave sums), generated once from a fixed seed. Darker cells are lower
estimates, so the two patterns the chapter describes stand out:

- a **dark column** means most of the class is struggling with one concept, which points at the
  content or the teaching;
- a **dark row** means one student is struggling broadly, which points at that student.

The roster uses the prototype teacher dashboard's formula:

`risk = 0.45 x (1 - mastery) + 0.30 x (days idle / max days idle) + 0.25 x gap ratio`

where mastery is the student's mean estimate, the longest-idle student in the section scores 1
(10 days here), and the gap ratio is the share of the eight concepts whose prerequisites include
one below 0.6. The three weights are sliders. The defaults are one prototype's choices, not a
validated standard, and every shade is a model estimate from the mastery model of Chapter 18,
not a measured fact.

**Learning objective:** The learner will distinguish a concept that most of a class struggles with
from a student who struggles broadly, by reading the dark columns and dark rows of a heatmap and by
computing an at-risk score.

**Bloom's taxonomy level:** Analyze (verb: *distinguish*)

## How to Use

1. Scan the heatmap for a dark column and a dark row. Hover any cell to see the student, the
   concept and the estimate.
2. Press **Quiz me** and click the concept the class most needs re-taught, then the student who
   struggles across most concepts. The feedback explains each choice.
3. Press **Show the pattern** to outline the weak column and the weak row.
4. Click a name in the **At-risk roster** to highlight that student's row and see the three
   signals and the arithmetic behind the score.
5. Move the three weight sliders. Raise **Weight on inactivity** and watch Kim, who is idle for
   10 days but otherwise strong, climb the roster.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/class-mastery-heatmap-reader/main.html"
        height="642px"
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

- What a mastery estimate is and why it is a model output (Chapters 18 and 19)
- The Teacher Dashboard section of Chapter 21
- Weighted sums

### Activities

1. **Two patterns (4 min):** Without the pattern button, name the weak concept and the weak
   student and say what action each suggests. Then check with **Quiz me**.
2. **Compute a score by hand (5 min):** Click Hal in the roster, copy the three signals and
   compute the risk score with the default weights. Compare with the arithmetic shown.
3. **Stress the weights (5 min):** Find weights that put Kim above Hal. Explain what that says
   about a single severe signal and why a teacher should read the breakdown, not only the rank.
4. **Caution (3 min):** List two reasons a dark cell might not mean the student has not learned
   the concept.

### Assessment

- The learner correctly separates a class-wide concept problem (dark column) from an individual
  student problem (dark row) and names a different response to each.
- The learner computes an at-risk score from the three signals and weights.
- The learner explains that the shades and scores rest on unvalidated model estimates and treats
  a flag as a prompt to look, not a verdict.

## References

1. [Heat map](https://en.wikipedia.org/wiki/Heat_map) - Wikipedia. Reading values encoded as color in a matrix.
2. [Learning analytics](https://en.wikipedia.org/wiki/Learning_analytics) - Wikipedia. Using learner data to inform teaching.
3. [Bayesian knowledge tracing](https://en.wikipedia.org/wiki/Bayesian_knowledge_tracing) - Wikipedia. One family of models that produce mastery estimates.
4. [Weighted arithmetic mean](https://en.wikipedia.org/wiki/Weighted_arithmetic_mean) - Wikipedia. The idea behind a weighted composite score.
5. [p5.js createSlider() reference](https://p5js.org/reference/p5/createSlider/) - p5.js. The control used for each weight.
