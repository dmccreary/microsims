---
title: Quality Score Calculator
description: Tick the rubric checks a MicroSim satisfies to calculate its 100-point quality score and grade, and find the cheapest change that reaches the 85 threshold.
image: /sims/quality-score-calculator/quality-score-calculator.png
og:image: /sims/quality-score-calculator/quality-score-calculator.png
twitter:image: /sims/quality-score-calculator/quality-score-calculator.png
social:
   cards: false
quality_score: 100
---

# Quality Score Calculator

<iframe src="main.html" height="622px" width="100%" scrolling="no"></iframe>

[Run the Quality Score Calculator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A **quality score** counts the presence of files, metadata and documentation, 0 to 100. This calculator lays out the rubric that `validate-sims.py` applies, in its seven groups, with every check's point value. Tick what a MicroSim has and the score, the bar and the grade letter update: A for 85 and above, B for 70 to 84, C for 50 to 69 and D below 50.

The calculator follows the script, including its quieter rules. The schema tag and `<main>` only count when `main.html` exists; the educational and pedagogical sections only count when `metadata.json` exists; the core fields earn 10, 5 or 0 points by how many are missing; and a folder with no `main.html` (or a non-p5.js MicroSim) receives all 5 p5.js points because the library cannot be checked. That is why the **Blank folder** preset scores 5, not 0.

**Suggest cheapest fix** finds the unticked check that would raise the score the most, highlights it (or all the checks tied with it), and states the new score and how many fixes are needed to reach 85. **Show gate line** draws the 85 bar and says whether a carried-over MicroSim would pass on score alone.

**Learning objective:** The learner will calculate the quality score and grade of a MicroSim by ticking which rubric checks it satisfies, and will identify the cheapest change that reaches the 85 threshold.

**Bloom level:** Apply. **Bloom verb:** calculate.

## How to Use

1. Choose **Load example**: *Bouncing Ball (score 82)*, *A-star (score 74)* or *Blank folder*.
2. Tick and untick checks; the group totals in the blue headings and the arithmetic line show how the score is built.
3. Hover a check to read what the validator looks for (on a narrow screen it appears under the score).
4. Press **Suggest cheapest fix** and read the suggestion.
5. Click the grade letter to see the four bands, the audit counts and each band's recommended action; click again to close.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/quality-score-calculator/main.html"
        height="622px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development).

### Duration

20 minutes

### Prerequisites

- The files of a MicroSim folder and the metadata sections (Chapter 2)
- The quality score and rubric table (Chapter 13)

### Activities

1. **Calculate by hand (6 min):** Before loading a preset, read its issue list from the chapter and calculate its score and grade on paper. Load the preset to check.
2. **Cheapest path (6 min):** For A-star, find the fewest checks that reach 85. Compare with Suggest cheapest fix.
3. **The quiet rules (4 min):** Load Blank folder and explain why it scores 5. Then tick File exists under main.html and explain why the score does not change.
4. **Gate (4 min):** Explain why a score of 87 is necessary but not sufficient to pass the quality gate.

### Assessment

- Given a list of a MicroSim's issues, the learner computes its score and grade correctly.
- The learner names the single change with the largest gain and the fewest changes that reach 85.
- Exit question: "Why do the best v1.0 MicroSims in the audit stop at 92?"

## References

1. [Chapter 13: Quality Assurance and Automated Layout Review](../../chapters/13-quality-assurance-and-automated-layout-review/index.md) — the quality score, the 100-point rubric, quality grades and the quality gate.
2. [Rubric (academic)](https://en.wikipedia.org/wiki/Rubric_(academic)) — Wikipedia article on scoring guides with weighted criteria.
3. [p5.js createCheckbox() reference](https://p5js.org/reference/p5/createCheckbox/) — the built-in control used for each rubric check.
4. [p5.js createSelect() reference](https://p5js.org/reference/p5/createSelect/) — the menus for the core fields and the examples.
