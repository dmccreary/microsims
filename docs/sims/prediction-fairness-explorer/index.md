---
title: Prediction Fairness Explorer
description: Critique a mastery prediction by comparing its under- and over-estimation rates across three synthetic learner groups, see how a pooled average can hide a gap, and watch a suppression threshold hide a small group.
image: /sims/prediction-fairness-explorer/prediction-fairness-explorer.png
og:image: /sims/prediction-fairness-explorer/prediction-fairness-explorer.png
twitter:image: /sims/prediction-fairness-explorer/prediction-fairness-explorer.png
social:
   cards: false
quality_score: 100
---

# Prediction Fairness Explorer

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the Prediction Fairness Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

**Bias in prediction** is a systematic difference in how well a model's estimates fit different
groups of learners, so that some are mis-estimated more often or in a consistent direction.
Chapter 24 states the evaluation method: once data exists, compute the same prediction-error
measure separately for each group and compare. A gap that the pooled average hides is a bias
signal.

This chart applies that method to three groups: pointer users, keyboard users and learners on a
shared device. Each group has a pair of bars:

- **Under-estimated** (blue): the share of the group's learners the model predicted "not yet"
  who then passed a held-out check.
- **Over-estimated** (orange): the share it predicted "mastered" who then failed the check.

Keeping the two directions apart matters. Chapter 24's first hypothesis is that a keyboard or
screen-reader learner may never produce hover evidence, so the model could read less activity as
less understanding. That would show up as under-estimation concentrated in one group. The dashed
lines show the pooled rates over all learners.

**All numbers are synthetic.** They were invented to illustrate the method, and no real learner
data has been collected through MicroSims. The three scenarios are:

| Scenario | What the synthetic data shows |
|---|---|
| Even error | Every group sits close to the pooled rates |
| Hidden gap | Keyboard users are under-estimated 37.5 percent of the time, yet the pooled rate is only 10.9 percent because the group is small |
| Small group | Only 12 learners use a shared device; raising the threshold above 12 suppresses the group and its gap disappears from view |

The **Threshold** mimics the Full LRS design's suppression rule, which hides any report cell built
from fewer than the district's threshold, 10 students by default. Suppression protects privacy,
but it also hides exactly the small groups a fairness check most needs to see, and that limit
should be disclosed. The pooled lines still count the suppressed learners, so a reader who knows
every count could subtract to recover the hidden group, which is why Chapter 25 also calls for
complementary suppression.

A text table of the data, updated with every change, is available to screen readers, and the
chart's accessible name summarizes the current values.

**Learning objective:** The learner will critique a mastery prediction by comparing its error
across learner groups, and decide whether a pooled average hides a gap.

**Bloom's taxonomy level:** Evaluate (verb: *critique*)

## How to Use

1. Start with **Even error**. Compare each group's bars with the dashed pooled lines.
2. Switch to **Hidden gap**. Read the pooled rates first, then the Keyboard users bars. Decide
   whether the model's pooled error is an acceptable summary.
3. Turn **Show pooled average** off and on. Notice how easy it is to report only the pooled rate.
4. Switch to **Small group** and drag **Threshold** from 10 to 13 or higher. The Shared device
   group is suppressed; read the message about what can no longer be seen.
5. Hover over any bar to see the count behind the percentage. Press **Reset** to return to the
   starting view.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/prediction-fairness-explorer/main.html"
        height="602px"
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

- Mastery prediction and held-out assessment (Chapters 18 and 19)
- Bias in prediction and the suppression threshold (Chapters 21 and 24)

### Activities

1. **Pooled first (3 min):** In Hidden gap, cover the bars and read only the pooled rates. Write
   one sentence a dashboard might print about this model.
2. **Critique (5 min):** Uncover the bars. Rewrite the sentence so it is honest about the
   Keyboard users group, and name the Chapter 24 hypothesis that could explain the direction of
   the error.
3. **Suppression trade-off (5 min):** In Small group, raise the threshold until the group is
   hidden. Discuss who is protected and who is harmed when a gap disappears from a report.
4. **Disclosure (optional, 5 min):** Draft the limits sentence a fidelity report should include
   when a group is too small to report.

### Assessment

- The learner states whether the pooled average hides a gap in each scenario, with the group,
  the direction and the size of the gap.
- The learner explains why under- and over-estimation should be reported separately.
- The learner explains what suppression hides and why its limit must be disclosed.

## References

1. [Fairness (machine learning)](https://en.wikipedia.org/wiki/Fairness_(machine_learning)) -
   Wikipedia. Group fairness criteria that compare error rates across groups.
2. [Simpson's paradox](https://en.wikipedia.org/wiki/Simpson%27s_paradox) - Wikipedia. How
   aggregating groups can hide or reverse what happens inside them.
3. [Statistical disclosure control](https://en.wikipedia.org/wiki/Statistical_disclosure_control) -
   Wikipedia. Cell suppression and why complementary suppression is needed.
4. [Bar chart documentation](https://www.chartjs.org/docs/latest/charts/bar.html) - Chart.js.
   The grouped bar chart used here.
