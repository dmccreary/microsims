---
title: Set Overlap Explorer
description: Classify example diagrams into the seven regions of a three-circle Venn diagram of ordered process, labeled relationships and feedback, the characteristics of flowcharts, concept maps and causal loop diagrams.
image: /sims/set-overlap-explorer/set-overlap-explorer.png
og:image: /sims/set-overlap-explorer/set-overlap-explorer.png
twitter:image: /sims/set-overlap-explorer/set-overlap-explorer.png
social:
   cards: false
quality_score: 100
---

# Set Overlap Explorer

<iframe src="main.html" height="442px" width="100%" scrolling="no"></iframe>

[Run the Set Overlap Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Flowcharts, concept maps and causal loop diagrams each have a signature characteristic, and real diagrams often combine them. This Venn diagram, drawn with venn.js on top of D3, has three sets:

- **Ordered process**: steps in a set order, typical of a flowchart.
- **Labeled relationships**: links that name how concepts relate, typical of a concept map.
- **Feedback**: a loop in which a change returns to affect itself, typical of a causal loop diagram.

The three circles create seven regions. The circle sizes are symbolic and do not measure anything, so, following the Venn guide, each region's tooltip shows a one-sentence definition from a definitions object keyed by the sorted set names (for example `Feedback,Process`) instead of a numeric size. Clicking a region lists two example diagrams that belong there. **Classify mode** presents six example diagram descriptions one at a time; you click the region where each belongs and receive immediate feedback with a one-sentence reason, and the correct region is shaded green.

**Learning objective (Bloom level: Understand; verb: classify):** The learner will classify example diagrams into the correct region of a three-circle Venn diagram of Flowchart, Concept Map and Causal Loop Diagram characteristics.

## How to Use

1. Hover over each of the seven regions and read its definition in the tooltip. The region under the pointer is shaded yellow.
2. Click a region to list two example diagrams that belong there.
3. Press **Start Classify mode**. Read each example diagram description, decide which characteristics it has, and click that region.
4. Read the feedback and the reason, then press **Next example**. After six examples your score appears; press **Try again** to repeat, or **Back to Explore** to return.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/set-overlap-explorer/main.html"
        height="442px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development).

### Duration

15 minutes

### Prerequisites

- The Chapter 8 definitions of flowchart, concept map and feedback loop.
- Reading a Venn diagram: overlapping regions share characteristics.

### Activities

1. **Explore the regions (5 min):** Hover every region and, for each pair overlap, write one example of your own that fits it.
2. **Classify (6 min):** Complete Classify mode. Before each click, name the characteristics you see in the description: is there an order, are the links named, does anything loop back?
3. **Discuss (4 min):** Compare the drafting flowchart (ordered process with a loop back) with a causal loop diagram (named cause-and-effect links in a loop). Explain why a flowchart loop is not the same as a feedback loop of named causes.

### Assessment

- Given a new diagram description, the learner names its region and justifies the choice by listing which of the three characteristics it has.
- The learner explains why circle sizes in this diagram carry no numeric meaning.

## References

1. [venn.js on GitHub](https://github.com/benfred/venn.js) - The library used to lay out and draw the circles.
2. [D3.js](https://d3js.org/) - The data-driven document library that venn.js builds on.
3. [Venn diagram - Wikipedia](https://en.wikipedia.org/wiki/Venn_diagram) - Background on Venn diagrams and set regions.
4. [Concept map - Wikipedia](https://en.wikipedia.org/wiki/Concept_map) - Background on concept maps and labeled relationships.
5. [Causal loop diagram - Wikipedia](https://en.wikipedia.org/wiki/Causal_loop_diagram) - Background on feedback loops drawn with named causal links.
