---
title: Cognitive Load Balance Lab
description: Toggle features on a mock bouncing-ball MicroSim and watch a qualitative gauge split the load into intrinsic, extraneous and germane parts against a comfortable-capacity line.
image: /sims/cognitive-load-balance-lab/cognitive-load-balance-lab.png
og:image: /sims/cognitive-load-balance-lab/cognitive-load-balance-lab.png
twitter:image: /sims/cognitive-load-balance-lab/cognitive-load-balance-lab.png
social:
   cards: false
quality_score: 100
---

# Cognitive Load Balance Lab

<iframe src="main.html" height="627px" width="100%" scrolling="no"></iframe>

[Run the Cognitive Load Balance Lab Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Cognitive load theory holds that working memory is small, so every slider, label, effect and sentence in a MicroSim competes for the same limited attention. The theory separates three kinds of load. Intrinsic load comes from the material itself, extraneous load comes from the way it is presented, and germane load is the effort a learner spends building understanding. A designer manages intrinsic load, reduces extraneous load and encourages germane load.

This lab puts those ideas on a mock bouncing-ball MicroSim. Each design feature you switch on appears in the mock and adds to one segment of a stacked bar. When the total passes the comfortable-capacity line, the bar turns amber and a message names the largest extraneous contributor, which is usually the first thing to remove. The two buttons load Designer A and Designer B from the Chapter 3 worked example.

The gauge is a teaching illustration. Its weights are fixed and made up for this lab, and it does not measure any real learner. Chapter 3 also notes that some researchers treat germane load as part of intrinsic load; the three-part split is used here as a design checklist.

**Learning objective:** The learner will differentiate the design features that add intrinsic, extraneous and germane load by toggling features on a mock MicroSim and observing a qualitative load gauge.

**Bloom level:** Analyze. **Bloom verb:** differentiate.

## How to Use

1. Start with **Reset to Designer A**: two variables and a prediction prompt, well under capacity.
2. Before you toggle each feature, predict which segment of the bar it will grow. Then switch it on and check. The list under the gauge shows what each feature added.
3. Move **Number of variables** from 1 to 6 and watch the intrinsic segment grow faster than linearly, because each new variable interacts with the others.
4. Press **Set to Designer B**: six variables, a decorative particle trail and instructions far from the drawing. Read which contributor the message tells you to remove first.
5. Starting from Designer B, find the smallest set of changes that brings the total back under the capacity line while keeping the prediction prompt.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/cognitive-load-balance-lab/main.html"
        height="627px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers and learning-technology developers who design or review MicroSims (college undergraduate or professional development).

### Duration

15 minutes.

### Prerequisites

- Cognitive load theory and the definitions of intrinsic, extraneous and germane load (Chapter 3)
- The Designer A and Designer B worked example (Chapter 3)

### Activities

1. **Predict and sort (5 min):** Learners list the five checkbox features and the variable slider, and predict for each whether it adds intrinsic, extraneous or germane load. They then toggle each one to check.
2. **Repair Designer B (5 min):** Learners bring Designer B under capacity with as few changes as possible and record which changes they made and why.
3. **Discuss (5 min):** Why does the lab say to remove extraneous load first rather than lowering germane load? When is it right to reduce intrinsic load instead, and how could a designer do that without changing the concept?

### Assessment

- The learner classifies each of the six design features correctly as intrinsic, extraneous or germane.
- The learner explains in two sentences why a decorative particle trail and a prediction prompt both add load but only one of them should be removed.

## References

1. [Chapter 3: Learning Objectives and Bloom's Taxonomy](../../chapters/03-learning-objectives-and-blooms-taxonomy/index.md) - cognitive load theory and the Designer A and Designer B example.
2. [Cognitive load](https://en.wikipedia.org/wiki/Cognitive_load) - Wikipedia article on cognitive load theory and its three types of load.
3. [John Sweller](https://en.wikipedia.org/wiki/John_Sweller) - Wikipedia biography of the psychologist who developed cognitive load theory.
4. [p5.js reference: createCheckbox()](https://p5js.org/reference/p5/createCheckbox/) - the control used for the feature toggles.
