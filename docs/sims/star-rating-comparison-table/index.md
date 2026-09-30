---
title: Star Rating Comparison Table
description: Judge which of five MicroSim libraries best fits a stated need by weighting two star-rated criteria, sorting by weighted score, and reading badges and row tooltips.
image: /sims/star-rating-comparison-table/star-rating-comparison-table.png
og:image: /sims/star-rating-comparison-table/star-rating-comparison-table.png
twitter:image: /sims/star-rating-comparison-table/star-rating-comparison-table.png
social:
   cards: false
quality_score: 97
---

# Star Rating Comparison Table

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Star Rating Comparison Table MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A star rating table places several items side by side against shared criteria so a reader can choose among them. This table compares five JavaScript libraries used to build MicroSims on two criteria rated from one to five stars. The stars use a five-color scale (5 green, 4 yellow-green, 3 orange, 2 red-orange, 1 red), each row has a difficulty badge and a "Best for" cell, and hovering a row shows a one-sentence description of the library. The first row's tooltip appears below the row so that the header does not hide it.

Star ratings compress a judgment into a number, so a trustworthy table states what each criterion means:

- **Ease of use**: how quickly an author with little coding time can produce a working MicroSim.
- **Interactivity**: how much a learner can manipulate, explore and change in the result.

Two weight sliders turn the ratings into a weighted score, \( (w_E \times \text{ease} + w_I \times \text{interactivity}) / (w_E + w_I) \), on the same one-to-five scale. **All ratings, badges and descriptions are invented illustrations for this exercise, not a measured evaluation of the libraries.**

**Learning objective (Bloom level: Evaluate; verb: judge):** The learner will judge which of several items best fits a stated need, by comparing star ratings, badges and tooltip descriptions across weighted criteria.

## How to Use

1. Read the **Stated need** and choose another one from the dropdown when you are ready for the next scenario.
2. Set **Weight: Ease of use** and **Weight: Interactivity** (0 to 5) to reflect what the need values. The weighted score column updates at once, and the top score gets a star.
3. Press **Sort by weighted score**. While sorting is on, every weight change reorders the rows. Press **Reset order** to turn sorting off and restore the original order.
4. Hover a row (or tab to it with the keyboard) to read its description, and check the difficulty badge against the legend.
5. Check **Show numeric ratings** to add the digit next to each star group, for readers who cannot rely on color.
6. Decide which library best fits the need and justify the choice in one or two sentences that cite the ratings, the badge and the description.

On screens narrower than 600 pixels, the table scrolls sideways inside its box while the library column stays in place.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/star-rating-comparison-table/main.html"
        height="502px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development).

### Duration

20 minutes

### Prerequisites

- Reading a comparison table with star ratings.
- A weighted average as a way of combining criteria.

### Activities

1. **Translate needs into weights (6 min):** For each of the three stated needs, decide the two weights before touching the table, and write one sentence explaining them.
2. **Sort and judge (8 min):** Enter the weights, sort, and record the top-ranked library for each need. Then read the badge and tooltip of the top two rows and decide whether you agree with the ranking.
3. **Challenge the score (4 min):** Find weights that make Mermaid rank first and weights that make p5.js rank first. Discuss what this reveals about who chooses the weights.
4. **Accessibility check (2 min):** Turn on numeric ratings and discuss why color alone is not enough to carry a rating.

### Assessment

- For a new stated need, the learner chooses weights, names the best-fitting library, and justifies the judgment with the ratings, the difficulty badge and the description.
- The learner explains one limitation of star ratings, such as the loss of nuance or the dependence of rankings on weights.

## References

1. [Likert scale - Wikipedia](https://en.wikipedia.org/wiki/Likert_scale) - Background on ordinal rating scales such as one-to-five stars.
2. [Weighted arithmetic mean - Wikipedia](https://en.wikipedia.org/wiki/Weighted_arithmetic_mean) - The weighted average used for the score column.
3. [Multiple-criteria decision analysis - Wikipedia](https://en.wikipedia.org/wiki/Multiple-criteria_decision_analysis) - Methods for judging options against several weighted criteria.
4. [MDN: position sticky](https://developer.mozilla.org/en-US/docs/Web/CSS/position) - The CSS feature that keeps the library column fixed while the table scrolls.
