---
title: Routing Score Workbench
description: A Chart.js workbench in which you score competing MicroSim types for ten objectives against the five-band routing rubric, resolve close scores with a clarifying question, and compare your scores with reference bands.
image: /sims/routing-score-workbench/routing-score-workbench.png
og:image: /sims/routing-score-workbench/routing-score-workbench.png
twitter:image: /sims/routing-score-workbench/routing-score-workbench.png
social:
   cards: false
quality_score: 100
---

# Routing Score Workbench

<iframe src="main.html" height="682px" width="100%" scrolling="no"></iframe>

[Run the Routing Score Workbench MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

The **routing rubric** turns a judgment about which MicroSim type fits an objective into a comparable number from 0 to 100, read against five bands: 90-100 perfect match (choose it), 70-89 strong match (choose it and note the limitations), 50-69 moderate match (keep as a fallback), 30-49 weak match (avoid unless nothing else fits), and 0-29 poor match (do not use). The scores are structured judgments, not the output of a formula. When the top two candidates land within about ten points of each other, the choice is **ambiguous** and the right move is one clarifying question about the objective.

In this workbench you play the role of the agent. For each of ten objectives you score three or four candidate types with sliders. The horizontal bar chart shows your scores over the shaded rubric bands. Hovering a bar shows the rubric guideline, from the generator skill's routing criteria, for the band your score is in — so you can compare the guideline's words with the objective and adjust. When your top two scores are within ten points, a banner asks you to choose between two clarifying questions, and tells you whether your question actually separates the candidates. **Reveal reference bands** then overlays the reference band for each candidate as a dashed box and counts how many of your scores fell inside.

**Learning objective:** The learner will justify a type choice by assigning rubric scores to competing types for a described objective and explaining any routing ambiguity.

**Bloom level:** Evaluate (L5). **Bloom verb:** justify.

The reference bands were written by the author of this bank as teaching examples. They are not output of the generator skill, and a score one band away from the reference can be defensible if you can justify it.

## How to Use

1. Read the objective at the top.
2. Drag each candidate's slider (0 to 100, in steps of 5). The bar and the band label ("Strong", "Weak" and so on) update as you drag. The highest bar is dark blue.
3. Hover a bar to read the rubric guideline for the band your score is in. If the guideline does not describe the objective, move the slider.
4. If your top two scores are within ten points, the ambiguity banner appears. Choose the clarifying question you would ask the author; the feedback says whether it separates the candidates. Uncheck **Show ambiguity warning** to hide the banner.
5. Press **Reveal reference bands**. Dashed boxes show the reference band for each candidate — green when your score is inside it, red when it is not — and the panel reports how many of your scores matched.
6. Press **Next objective** to move through all ten objectives.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/routing-score-workbench/main.html"
        height="682px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development) who route objectives to MicroSim types and review others' routing decisions.

### Duration

25 minutes

### Prerequisites

- The MicroSim type catalog and the strengths of each type (Chapter 4)
- Keyword routing and the routing decision tree (Chapter 4)
- Classifying an objective by Bloom level and verb (Chapter 3)

### Activities

1. **Score before revealing (10 min):** For each of the first five objectives, score every candidate and write a one-sentence justification for your top score before pressing Reveal.
2. **Calibrate (5 min):** Compare your scores with the reference bands. For each score outside its band, either change it or write why your score is still defensible.
3. **Ambiguity practice (5 min):** On the three objectives where a map and a timeline, a chart and a network, or a map and a chart compete, write the clarifying question you would ask and the answer that would settle it.
4. **Peer review (5 min):** Swap justifications with a partner. Mark any justification that argues from library preference instead of from the objective.

### Assessment

- At least 70 percent of the learner's scores fall in the reference band across the ten objectives.
- Each top-score justification cites the objective's data shape or verb and the matching rubric guideline.
- On ambiguous objectives the learner chooses the clarifying question that separates the candidates and explains why.
- Exit question: "Two candidates score 80 and 75. Your colleague says 'just pick the 80.' Write your reply."

## References

1. [Chapter 4: Choosing a MicroSim Type](../../chapters/04-choosing-a-microsim-type/index.md) — the routing rubric, routing scores and routing ambiguity.
2. [Chart.js horizontal bar chart](https://www.chartjs.org/docs/latest/charts/bar.html#horizontal-bar-chart) — the `indexAxis: 'y'` bar chart used here.
3. [Chart.js plugins](https://www.chartjs.org/docs/latest/developers/plugins.html) — the plugin hooks used to shade the rubric bands and draw the reference boxes.
4. [Rubric (academic)](https://en.wikipedia.org/wiki/Rubric_(academic)) — Wikipedia article on scoring rubrics with ordered performance bands.
