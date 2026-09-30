---
title: Clickable Flowchart Anatomy
description: Inspect a working Mermaid flowchart to tell apart its node shapes, edges, branch labels and style classes, and see the real parse error when a label loses its quotes.
image: /sims/clickable-flowchart-anatomy/clickable-flowchart-anatomy.png
og:image: /sims/clickable-flowchart-anatomy/clickable-flowchart-anatomy.png
twitter:image: /sims/clickable-flowchart-anatomy/clickable-flowchart-anatomy.png
social:
   cards: false
quality_score: 100
---

# Clickable Flowchart Anatomy

<iframe src="main.html" height="522px" width="100%" scrolling="no"></iframe>

[Run the Clickable Flowchart Anatomy MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim is the drafting flowchart from Chapter 8, drawn by the Mermaid library from a few lines of text. It has four nodes and four edges:

- **Learning objective written** (rounded rectangle): the start.
- **AI drafts the MicroSim** (rectangle): a process step.
- **Meets the objective?** (diamond): a decision.
- **Publish (add to chapter)** (rounded rectangle): the end.

The start leads to the draft and the draft to the check. The check leads to Publish on the branch labeled **Yes** and loops back to the draft on the branch labeled **No**, which is how a flowchart shows iteration. Every node has a Mermaid `click` directive whose callback fills the information panel with the node's shape, its role, the Mermaid line that created it and its style class, so touch and keyboard users reach the same explanation as mouse users. A strip below the diagram names all four standard node shapes, including the circle connector that this small diagram does not need.

The **Break it** button removes the quotes from the Publish label. Because that label contains parentheses, Mermaid can no longer parse the source, and the panel shows Mermaid's real error message. A second click restores the quotes.

**Learning objective (Bloom level: Analyze; verb: differentiate):** The learner will differentiate the four node shapes of a flowchart and the roles of edges, labels and style classes by inspecting a small working diagram.

## How to Use

1. Hover any node to highlight it and preview its details; click it (or tab to it and press Enter) to keep the details in the panel.
2. Click the **Yes** or **No** label to see what a branch label means, and click an unlabeled arrow to see what an edge does.
3. Click each entry in the **Four node shapes** strip to see its role and Mermaid syntax, then find each shape in the diagram.
4. Press **Break it** and read the changed line and the parse error. Explain why the parser fails, then press **Restore quotes**.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/clickable-flowchart-anatomy/main.html"
        height="522px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development).

### Duration

15 minutes

### Prerequisites

- The idea of a flowchart as steps joined by arrows.
- The Chapter 8 Mermaid example and its syntax rules table.

### Activities

1. **Sort the parts (5 min):** Click every node, label and arrow. Build a three-column table: part, what it looks like in the diagram, and the Mermaid syntax that produced it.
2. **Differentiate (5 min):** Explain in one sentence each how a rounded node, a rectangle and a diamond differ in role, and why the diamond is the only node with labeled outgoing arrows.
3. **Break and repair (5 min):** Use **Break it**. Predict which character causes the failure before reading the error, then write a repaired version of a label of your own that contains parentheses.

### Assessment

- Given a new flowchart description, the learner chooses the correct shape for each step and writes the matching Mermaid node line.
- The learner explains the difference between an edge, a branch label and a style class, and states why labels with parentheses need quotes.

## References

1. [Mermaid Flowchart Syntax](https://mermaid.js.org/syntax/flowchart.html) - Official reference for node shapes, edges, labels, `classDef` and `click`.
2. [Mermaid Documentation](https://mermaid.js.org/) - Official documentation for the Mermaid library.
3. [Flowchart - Wikipedia](https://en.wikipedia.org/wiki/Flowchart) - Background on flowchart symbols and their conventional meanings.
