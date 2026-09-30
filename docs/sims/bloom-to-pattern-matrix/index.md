---
title: Bloom-to-Pattern Matrix
description: A clickable matrix of the six Bloom levels showing which MicroSim interaction patterns suit each level, which undermine it and why, with a Mismatch detective mode for practice.
image: /sims/bloom-to-pattern-matrix/bloom-to-pattern-matrix.png
og:image: /sims/bloom-to-pattern-matrix/bloom-to-pattern-matrix.png
twitter:image: /sims/bloom-to-pattern-matrix/bloom-to-pattern-matrix.png
social:
   cards: false
quality_score: 100
---

# Bloom-to-Pattern Matrix

<iframe src="main.html" height="642px" width="100%" scrolling="no"></iframe>

[Run the Bloom-to-Pattern Matrix Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

An interaction pattern is a reusable way in which a learner acts on a MicroSim and gets feedback. An objective at one Bloom level is served by some patterns and undermined by others. This matrix turns the instructional design checkpoint's table into something you can explore. Each row is a Bloom level. Green chips are patterns that suit the level, red chips are patterns that fail it, and blue chips are MicroSims in this book that use a suitable pattern. Every pattern chip opens a short explanation, a small sketch of the pattern, and the reason it suits or fails that level.

**Learning objective:** The learner will differentiate appropriate from inappropriate interaction patterns for each Bloom level and explain why a mismatched pattern fails.

**Bloom level:** Analyze. **Bloom verb:** differentiate.

The matrix is a plain HTML table generated from a JSON array in the script, with click and hover handlers and no external library.

## How to Use

1. Hover over a row to see that level's Bloom verbs.
2. Click any green or red chip. The detail panel shows what the pattern is, a sketch of it, and why it suits or fails the level.
3. Click a blue chip to read what an example MicroSim from this book does, with a link that opens it in a new tab.
4. Press **Mismatch detective**. The colors and the two pattern columns are hidden, and the panel describes a MicroSim whose pattern does not fit its objective. Click the chip, in the correct level's row, that the MicroSim violates. Correct answers add to the score, and the answer is then highlighted.
5. Press **Next case** for another description, **Show answers** to reveal the colors and the answer, or **Reset** to return to exploring and clear the score.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/bloom-to-pattern-matrix/main.html"
        height="642px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers and learning-technology developers who choose interaction patterns for MicroSims (college undergraduate or professional development).

### Duration

15 minutes.

### Prerequisites

- The six Bloom levels (Chapter 3)
- The definition of an interaction pattern (Chapter 3)

### Activities

1. **Explore (5 min):** Learners open one green and one red chip in each row and note, in a phrase, why each fits or fails.
2. **Mismatch detective (6 min):** Learners solve all seven cases. Before clicking, each learner says aloud the level of the MicroSim's objective.
3. **Explain a failure (4 min):** In pairs, learners pick one red chip and write two sentences explaining what evidence the mismatched MicroSim would fail to produce.

### Assessment

- The learner solves at least five of the seven Mismatch detective cases on the first attempt.
- Given a new MicroSim description, the learner names its objective's level, the mismatched pattern, and a better pattern, with a one-sentence reason.

## References

1. [Chapter 3: Learning Objectives and Bloom's Taxonomy](../../chapters/03-learning-objectives-and-blooms-taxonomy/index.md) - interaction patterns and the appropriate-pattern table.
2. [Bloom's taxonomy](https://en.wikipedia.org/wiki/Bloom%27s_taxonomy) - Wikipedia overview of the six levels.
3. [Cognitive load](https://en.wikipedia.org/wiki/Cognitive_load) - Wikipedia article on why decorative effects add extraneous load.
4. [HTML table element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table) - MDN Web Docs reference for the table this MicroSim generates.
