---
title: MicroSim Family Tree
description: Explore how a learning object, an interactive simulation, a MicroSim and an instrumented MicroSim nest, then classify examples by the property each level adds.
image: /sims/microsim-family-tree/microsim-family-tree.png
og:image: /sims/microsim-family-tree/microsim-family-tree.png
twitter:image: /sims/microsim-family-tree/microsim-family-tree.png
social:
   cards: false
quality_score: 100
---

# MicroSim Family Tree

<iframe src="main.html" height="522px" width="100%" scrolling="no"></iframe>

[Run the MicroSim Family Tree Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This diagram shows four kinds of learning object as a family, from the most general to the
most specific. Each arrow points from a kind of object to the one that specializes it, and the
arrow's label names the one property the more specific kind adds:

- **Learning Object** to **Interactive Simulation** adds *a model and immediate interaction*.
- **Interactive Simulation** to **MicroSim** adds *small, embeddable, described,
  AI-generated*.
- **MicroSim** to **Instrumented MicroSim** adds *reports evidence through xAPI*.

Every instrumented MicroSim is also a MicroSim, every MicroSim is an interactive simulation,
and every interactive simulation is a learning object. Clicking a box shows its definition,
one example that fits, and one near miss that fails the definition. The near misses are the
important part: each one lacks exactly the property that its arrow adds.

**Learning objective:** The learner will classify an example as a learning object, an
interactive simulation, a MicroSim, or an instrumented MicroSim, by identifying the property
that distinguishes each level.

**Bloom's taxonomy level:** Understand (verb: *classify*)

## How to Use

1. Click any box to read its definition, an example and a near miss in the panel.
2. Hover an arrow to see the property it adds as a tooltip.
3. Press **Quiz me**. The box labels are replaced by question marks and the panel shows an
   example. Click the box where the example belongs.
4. A wrong answer tells you which property the example is missing (or which extra property it
   has). Try again, then press **Next example**. The score counts correct answers out of
   attempts.
5. Press **Explore** to bring the labels back.

When the page is narrower than 600 pixels, the panel moves below the diagram and the arrow
labels move into the hover tooltips.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/microsim-family-tree/main.html"
        height="522px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development).

### Duration

10-15 minutes

### Prerequisites

- The definitions of learning object and interactive simulation from Chapter 1
- A general idea of what an iframe and a metadata file are

### Activities

1. **Explore (4 min):** Click each box and read its near miss. For each near miss, name the
   arrow property that it lacks.
2. **Quiz (4 min):** Press **Quiz me** and place all four examples. Repeat with a new set.
3. **Sort your own (5 min):** List three learning resources you have used this month. Place
   each one on the family tree and write the property that stops it from reaching the next
   level.
4. **Discuss (2 min):** Which property would be cheapest to add to one of your resources to
   move it one level down the tree?

### Assessment

- The learner places four new examples on the correct level on the first try.
- For a near miss, the learner names the single missing property (for example, "not
  embeddable" or "does not report xAPI statements").
- The learner explains why every instrumented MicroSim is also a learning object.

## References

1. [Learning object](https://en.wikipedia.org/wiki/Learning_object) - Wikipedia. The general
   idea of reusable, described units of instruction.
2. [Experience API](https://en.wikipedia.org/wiki/Experience_API) - Wikipedia. The xAPI
   standard that instrumented MicroSims use to report learner interactions.
3. [xAPI specification](https://github.com/adlnet/xAPI-Spec) - Advanced Distributed Learning
   (ADL) on GitHub. The statement format behind "reports evidence through xAPI".
4. [vis-network documentation](https://visjs.github.io/vis-network/docs/network/) - vis.js.
   The library used to draw the diagram.
