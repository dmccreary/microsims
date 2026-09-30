---
title: Instructional Design Checkpoint Navigator
description: A clickable Mermaid flowchart of the instructional design checkpoint in which you run the checkpoint on four sample specifications, compare your path with the recommended one, and see the completed decision block.
image: /sims/design-checkpoint-navigator/design-checkpoint-navigator.png
og:image: /sims/design-checkpoint-navigator/design-checkpoint-navigator.png
twitter:image: /sims/design-checkpoint-navigator/design-checkpoint-navigator.png
social:
   cards: false
quality_score: 100
---

# Instructional Design Checkpoint Navigator

<iframe src="main.html" height="682px" width="100%" scrolling="no"></iframe>

[Run the Instructional Design Checkpoint Navigator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

The **instructional design checkpoint** is the short review the MicroSim generator skill performs before it writes any code. It extracts the objective, identifies the Bloom level and verb, matches an interaction pattern, and then answers four questions: what data the learner must see, whether the learner must predict first, what animation adds, and whether continuous animation suits the level. It ends by recording a five-line decision block.

This MicroSim draws the checkpoint as a Mermaid flowchart. Every node carries a Mermaid `click` directive, so clicking any node opens its definition and one example in the information panel — the diagram is never just a static picture. The **Try a specification** list loads one of four sample specifications. You click through the path you would take, press **Check my path**, and the MicroSim compares your path with the recommended one, explains the first place they part, and shows the completed Instructional Design Check.

**Learning objective:** The learner will execute the instructional design checkpoint on a supplied MicroSim specification, reaching a recorded decision about interaction pattern, prediction and animation.

**Bloom level:** Apply (L3). **Bloom verb:** execute.

The four samples are chosen so that each follows a different route through the questions:

- **Bouncing Ball Gravity Lab** — the chapter's worked example: predict first, animation has a purpose, but continuous animation is flagged for an "explain" objective.
- **Prerequisite Explorer** — nothing to predict, and the always-bouncing nodes have no purpose, so the animation is removed.
- **Projectile Range Calculator** — an Apply objective where real-time animated feedback is appropriate.
- **Wave Interference Viewer** — motion is the phenomenon, but continuous animation still does not suit an Understand objective.

## How to Use

1. In **Explore** mode, click any node. The panel shows the node's definition and an example.
2. Choose a sample from **Try a specification**. Read the specification in the yellow box.
3. Click the nodes in the order you would visit them, from **Extract objective** to **Record the decision**. At each question, click the node its answer leads to. Your path turns gold.
4. Press **Check my path**. Nodes on both paths turn green, nodes only on your path turn salmon, and recommended nodes you skipped get a dashed outline. The panel explains the first difference and shows the completed decision block.
5. Press **Clear path** to try again, or choose another sample.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/design-checkpoint-navigator/main.html"
        height="682px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development) who will review MicroSim specifications before they are generated.

### Duration

20 minutes

### Prerequisites

- Bloom's Taxonomy levels and verbs (Chapter 3)
- The level-to-interaction-pattern table (Chapter 3)
- Cognitive load: intrinsic, extraneous and germane (Chapter 3)

### Activities

1. **Explore (4 min):** Click every node and read its definition and example. Say in your own words what makes Question 3 answerable with "yes".
2. **Execute the checkpoint (10 min):** Work through all four samples. Before pressing Check my path, write your own five-line decision block for each one.
3. **Compare (4 min):** For each sample, compare your block with the completed one. Where they differ, identify which question you answered differently.
4. **Transfer (2 min):** Run the checkpoint on a specification from your own course and record the decision.

### Assessment

- The learner reaches the recommended path on at least three of the four samples.
- The learner's written decision blocks name the correct Bloom level, verb and recommended pattern.
- The learner can finish the sentence "the animation shows ___, which an arrow cannot" for a given design, or recognize that it cannot be finished.
- Exit question: "A specification asks for sparkles when a correct answer is chosen in a Remember-level flashcard sim. Walk it through the checkpoint."

## References

1. [Chapter 3: Learning Objectives and Bloom's Taxonomy](../../chapters/03-learning-objectives-and-blooms-taxonomy/index.md) — the instructional design checkpoint, predict-first design and the purpose of animation.
2. [Bloom's taxonomy](https://en.wikipedia.org/wiki/Bloom%27s_taxonomy) — Wikipedia overview of the six cognitive levels.
3. [Cognitive load](https://en.wikipedia.org/wiki/Cognitive_load) — Wikipedia article on intrinsic, extraneous and germane load, the basis for removing purposeless animation.
4. [Mermaid flowchart syntax: interaction](https://mermaid.js.org/syntax/flowchart.html#interaction) — the `click` directive used on every node.
