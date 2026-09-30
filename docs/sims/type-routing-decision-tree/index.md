---
title: Type Routing Decision Tree
description: A clickable Mermaid decision tree of the generator skill's routing questions, asked in order until the first yes, with a practice mode that routes six objectives and compares your path with the tree's.
image: /sims/type-routing-decision-tree/type-routing-decision-tree.png
og:image: /sims/type-routing-decision-tree/type-routing-decision-tree.png
twitter:image: /sims/type-routing-decision-tree/type-routing-decision-tree.png
social:
   cards: false
quality_score: 100
---

# Type Routing Decision Tree

<iframe src="main.html" height="822px" width="100%" scrolling="no"></iframe>

[Run the Type Routing Decision Tree MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

The MicroSim generator skill routes an objective to a type by asking a fixed sequence of yes-or-no questions about the objective's **data shape** and stopping at the first "yes". Numeric claims that must be verified come first, then dates, geographic coordinates, a mathematical function, nodes and edges, a flowchart or process, sets with overlaps, a priority matrix, a standard chart, a comparison table, a sorting quiz, a labeled illustration and runnable Python. If every answer is "no", the objective becomes a custom p5.js simulation. Each "yes" branch ends in a leaf that names the type and its library.

Every node in this Mermaid flowchart has a `click` directive. Clicking a question shows a one-sentence explanation and an example objective that answers "yes" there; clicking a leaf describes the type. In **Try an objective** mode you route one of six objectives yourself, and the diagram highlights your path and the path the skill's tree follows.

**Learning objective:** The learner will use the routing questions to select the correct MicroSim type for six described objectives.

**Bloom level:** Apply (L3). **Bloom verb:** use.

Notice that the order of the questions matters. An objective with both dates and places reaches the dates question first, so the tree alone would send it to a timeline. When two questions could both fairly answer "yes", that is a sign of *routing ambiguity*, which the Routing Score Workbench explores.

## How to Use

1. In **Explore** mode, click any question or leaf to read its explanation and example.
2. Choose **Objective 1** to **Objective 6** from **Try an objective**. Read the objective in the yellow box.
3. Ask the questions from the top, in order. Click the first question you would answer "yes" (or its leaf). If no question fits, click **Custom simulation: p5.js**.
4. The diagram colors the paths: green nodes are on both your path and the tree's, salmon nodes are only on yours, and dashed outlines are only on the tree's. The panel explains the questions that decided the route.
5. Press **Clear my path** to try again, or choose the next objective.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/type-routing-decision-tree/main.html"
        height="822px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development) who choose MicroSim types for learning objectives.

### Duration

15 minutes

### Prerequisites

- The MicroSim type catalog (Chapter 4)
- Classifying an objective by Bloom level and verb (Chapter 3)
- The idea of a *data shape*: events, coordinates, functions, nodes and edges, numbers in categories

### Activities

1. **Explore (3 min):** Click each question and read its example objective. For each, name one more objective of your own that would answer "yes".
2. **Route six objectives (7 min):** Work through Objectives 1 to 6. Before clicking, write down the question where you expect to stop.
3. **Test the order (3 min):** Invent an objective that has both dates and coordinates. Which leaf does the tree reach? Is that the best type? What clarifying question would you ask?
4. **Discuss (2 min):** Why does the tree ask about numeric claims that must be verified before anything else?

### Assessment

- The learner routes at least five of the six objectives to the tree's leaf on the first try.
- The learner can explain why an objective answered "no" at each question above its stopping point.
- The learner can identify an objective where the tree's first "yes" is not the best choice and propose a clarifying question.
- Exit question: "An objective asks learners to explore which of 40 concepts depend on each other. Where does the tree stop, and which library does it name?"

## References

1. [Chapter 4: Choosing a MicroSim Type](../../chapters/04-choosing-a-microsim-type/index.md) — type routing, keyword routing, routing ambiguity and the type catalog.
2. [Decision tree](https://en.wikipedia.org/wiki/Decision_tree) — Wikipedia article on decision trees as ordered sequences of tests.
3. [Mermaid flowchart syntax: interaction](https://mermaid.js.org/syntax/flowchart.html#interaction) — the `click` directive attached to every node.
4. [Mermaid flowchart syntax](https://mermaid.js.org/syntax/flowchart.html) — node shapes, edge labels and layout direction used in the diagram.
