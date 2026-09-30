---
title: Prerequisite Propagation Explorer
description: Walk depends-on edges upstream through a seven-concept learning graph to tell a concept whose own evidence is weak from one whose weakness traces to an unmastered prerequisite.
image: /sims/prerequisite-propagation-explorer/prerequisite-propagation-explorer.png
og:image: /sims/prerequisite-propagation-explorer/prerequisite-propagation-explorer.png
twitter:image: /sims/prerequisite-propagation-explorer/prerequisite-propagation-explorer.png
social:
   cards: false
quality_score: 100
---

# Prerequisite Propagation Explorer

<iframe src="main.html" height="642px" width="100%" scrolling="no"></iframe>

[Run the Prerequisite Propagation Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Concepts in a learning graph depend on one another. **Prerequisite propagation** uses those dependency edges to carry information between per-concept mastery estimates. The Learning Record Store design specifies only one direction of it, and only as a report: its Prerequisite Gap Analysis walks the `DEPENDS_ON` edges upstream from a weak concept and flags unmastered prerequisites. It does not move any probability along an edge.

This explorer does the same. It shows seven illustrative concepts. Each arrow points from a concept to one of its prerequisites, the direction of the learning graph, and hovering an arrow shows the words "depends on". Each concept's fill runs from red (estimate 0.0) through yellow to blue (estimate 1.0) on a color-blind-safe scale, and each box also prints its estimate, with a check mark when it is at or above the mastery threshold.

The starting estimates repeat the chapter's example: Rates and Ratios are low and Fractions is high, so the gap analysis points at **Ratios**, the weak middle concept, as the place to begin reteaching. Percentages is different: its estimate is below the threshold, but every prerequisite upstream of it is mastered, so its weakness lies in its own evidence.

**Learning objective:** The learner will differentiate a struggling concept whose own evidence is weak from one whose weakness traces to an unmastered prerequisite, by walking dependency edges upstream.

**Bloom level:** Analyze. **Bloom verb:** differentiate.

## How to Use

1. Click a concept to select it. The side panel lists its estimate, its direct prerequisites and every prerequisite upstream that is below the threshold. Each panel text is also written to the browser console as a log line.
2. Press **Find first gap**. The explorer walks the depends-on edges upstream from the selected concept and highlights the deepest unmastered prerequisite with a dashed purple border, together with the edges it walked.
3. Read the verdict in the panel: either the weakness traces to a prerequisite, or no prerequisite is below the threshold and the weakness is in the concept's own evidence.
4. Move **Estimate for selected concept** to change one estimate by hand, for example raise Ratios to 0.97, then select Rates again and find its first gap.
5. Change **Threshold for mastered** (0.80 to 0.95) to see how the policy decides which concepts count as gaps. **Reset** restores the starting estimates, the 0.95 threshold and the Rates selection.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/prerequisite-propagation-explorer/main.html"
        height="642px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development) who read mastery reports and decide where reteaching should begin.

### Duration

15 minutes.

### Prerequisites

- Per-concept mastery estimates and the mastery threshold (Chapter 18)
- Learning graphs and their depends-on edges (earlier chapters on learning graphs)

### Activities

1. **Read the graph (3 min):** Learners name the weakest concept and trace, with a finger, the arrows from Speed Problems down to Multiplication.
2. **Two kinds of weakness (5 min):** Learners select Rates and then Percentages, press **Find first gap** for each, and write one sentence on why the two verdicts differ although both concepts are below the threshold.
3. **Change the evidence (4 min):** Learners raise Ratios above the threshold, then repeat the gap search for Rates and Speed Problems and record what changed.
4. **Change the policy (3 min):** Learners lower the threshold to 0.90 and explain why Percentages is no longer a gap although no estimate changed.

### Assessment

- Given a selected concept, the learner states whether its weakness is its own or traces to a prerequisite, and names the first gap.
- The learner explains that the explorer reads estimates but never changes one by propagation, and names one risk of automatic propagation along a wrong edge.

## References

1. [Chapter 18: Mastery Prediction and Knowledge Tracing](../../chapters/18-mastery-prediction-and-knowledge-tracing/index.md) - prerequisite propagation, the gap-analysis report and the Rates, Ratios and Fractions example.
2. [Directed acyclic graph](https://en.wikipedia.org/wiki/Directed_acyclic_graph) - the structure of a prerequisite graph.
3. [vis-network documentation](https://visjs.github.io/vis-network/docs/network/) - the network library, including hierarchical layout and edge tooltips.
4. [ColorBrewer](https://colorbrewer2.org/) - source of the RdYlBu color-blind-safe diverging scale used for the node fill.
