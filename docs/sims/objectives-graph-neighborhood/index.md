---
title: Objectives Neighborhood of the Learning Graph
description: Explore the 26 learning-objective concepts of this book's learning graph with their direct prerequisites and dependents, and test yourself on which concepts come before which.
image: /sims/objectives-graph-neighborhood/objectives-graph-neighborhood.png
og:image: /sims/objectives-graph-neighborhood/objectives-graph-neighborhood.png
twitter:image: /sims/objectives-graph-neighborhood/objectives-graph-neighborhood.png
social:
   cards: false
quality_score: 100
---

# Objectives Neighborhood of the Learning Graph

<iframe src="main.html" height="604px" width="100%" scrolling="no"></iframe>

[Run the Objectives Neighborhood MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This network shows a small neighborhood of the book's learning graph: the 26 concepts of the taxonomy category OBJ (Learning Objectives and Bloom), which Chapter 3 teaches, plus every concept joined to them by one dependency edge. That adds four foundation concepts they build on and 27 concepts from later chapters that build on them, 57 concepts and 69 edges in all. The data is read from `docs/learning-graph/learning-graph.json` when the page loads. If the file cannot be fetched, for example when `main.html` is opened directly from disk, an embedded snapshot of the same neighborhood is used, and the note in the header says which source is showing.

Every edge points from a dependent concept to its prerequisite, the direction the book uses, and the arrowhead reads "depends on". The stored layout places prerequisites to the left, so reading from left to right follows a valid teaching order. Each dot's size grows with the logarithm of its Concept Impact Score, which is 1 plus the sum of the scores of the concepts that depend on it directly. A large dot is a concept that much of the book builds on.

**Learning objective:** The learner will differentiate the prerequisites of a concept from its dependents by exploring a small neighborhood of the book's learning graph, and will explain why a concept with many dependents deserves more careful teaching.

**Bloom level:** Analyze. **Bloom verb:** differentiate.

## How to Use

1. Hover any dot to see its name and Concept Impact Score.
2. Click a concept. Its direct prerequisites turn green, its direct dependents turn orange, and the panel on the right shows its definition, its score and both lists. Dependents from other chapters are drawn as unlabeled gray dots; their names appear in the panel and on hover.
3. Check **Show transitive dependents** to extend the orange highlight to every concept that depends on the selected one through any path. Try it on Concept or Learning Objective, then on Germane Load, and compare.
4. Press **Check me**. The highlight is hidden and a randomly chosen concept is marked in gold. Click every concept it depends on directly, then press **Done**. Correct prerequisites turn green and wrong picks turn pink. The score counts fully correct attempts.
5. Opened fullscreen, the network can also be zoomed and panned with the mouse. Inside the textbook page, use the navigation buttons instead.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/objectives-graph-neighborhood/main.html"
        height="604px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers and learning-technology developers who design MicroSims against a learning graph (college undergraduate or professional development).

### Duration

15 to 20 minutes.

### Prerequisites

- Concept, learning graph and concept dependency, as defined in Chapter 3
- The idea of a directed graph with arrows

### Activities

1. **Read the direction (3 min):** Click Learning Graph. Learners say aloud which two concepts it depends on and why those sit to its left.
2. **Prerequisite or dependent? (5 min):** Learners click Bloom Verb, Objective Classification and Interaction Pattern in turn and record, for each, one prerequisite and one dependent with a reason.
3. **Impact (5 min):** Compare the transitive dependents of Concept (score 3316) with those of Germane Load (score 1). In pairs, learners write two sentences on why a concept with many dependents deserves more careful teaching and more assessment evidence.
4. **Check me (5 min):** Each learner completes three Check me rounds and notes any concept they mistook for a prerequisite.

### Assessment

- Given a concept in the neighborhood, the learner lists its direct prerequisites and distinguishes them from its dependents, as checked by three Check me rounds.
- The learner explains, citing the Concept Impact Score and the transitive dependents, why a weakness in Learning Objective would affect more of the book than a weakness in Learning Outcome.

## References

1. [Chapter 3: Learning Objectives and Bloom's Taxonomy](../../chapters/03-learning-objectives-and-blooms-taxonomy/index.md) - concepts, the learning graph and concept dependency.
2. [Directed acyclic graph](https://en.wikipedia.org/wiki/Directed_acyclic_graph) - Wikipedia article on the graph structure that a learning graph uses.
3. [Topological sorting](https://en.wikipedia.org/wiki/Topological_sorting) - Wikipedia article on ordering a directed acyclic graph so every prerequisite comes first.
4. [vis-network documentation](https://visjs.github.io/vis-network/docs/network/) - the library used to draw this network.
