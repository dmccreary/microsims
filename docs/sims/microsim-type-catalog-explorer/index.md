---
title: MicroSim Type Catalog Explorer
description: A vis-network explorer of the MicroSim Type Catalog's eight families and eighteen types, with hover-for-library, click-for-details and a Quiz me mode that matches example objectives to types.
image: /sims/microsim-type-catalog-explorer/microsim-type-catalog-explorer.png
og:image: /sims/microsim-type-catalog-explorer/microsim-type-catalog-explorer.png
twitter:image: /sims/microsim-type-catalog-explorer/microsim-type-catalog-explorer.png
social:
   cards: false
quality_score: 100
---

# MicroSim Type Catalog Explorer

<iframe src="main.html" height="662px" width="100%" scrolling="no"></iframe>

[Run the MicroSim Type Catalog Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A **MicroSim type** is a family of MicroSims that share a rendering library, a data format and an interaction style. The **MicroSim Type Catalog** groups the generator skill's types by what the learner needs to see: custom simulations, quantitative data, structure and process, time and place, comparison, image-based, assessment and labs, and verified facts. This explorer draws the catalog as a left-to-right hierarchy. The dark box for each family has its own color, and the types in that family use a lighter tint of the same color.

**Learning objective:** The learner will identify the library, the typical data, and one suitable objective for each MicroSim type in the catalog.

**Bloom level:** Remember (L1). **Bloom verb:** identify.

For a Remember objective the MicroSim offers two patterns: an explorer that pairs each type with its library, data and example (hover and click), and a flashcard-style **Quiz me** mode that hides the type names and asks you to match example objectives to types. Each type's panel also gives a **near miss** — an objective that sounds similar but belongs to a different type — because telling look-alike types apart is where routing mistakes start.

## How to Use

1. Hover over any light type box to see the library it is built on.
2. Click a type box. The panel shows a one-sentence definition, the data the type needs, an example objective, and a near-miss objective with the type it actually belongs to.
3. Click a dark family box to list its types.
4. Drag any box to move it. Use the navigation buttons to pan and zoom; in fullscreen view the mouse wheel also zooms. Press **Fit view** to reset.
5. Press **Quiz me**. The type names turn into question marks. Read the example objective in the panel and click the type box that fits. The answer is revealed with a green outline (and your wrong choice in red). Press **Next question** to continue through all 18 types, or **Stop quiz** to return to exploring.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/microsim-type-catalog-explorer/main.html"
        height="662px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development) who are new to the MicroSim types and libraries.

### Duration

15 minutes

### Prerequisites

- What a MicroSim is and what a library is (Chapter 1)
- The parts of a MicroSim folder (Chapter 2)

### Activities

1. **Explore by family (5 min):** Click every type in two families of your choice. For each type, write its library and the data it needs.
2. **Near misses (3 min):** Read three near-miss objectives and say, in one sentence each, what feature of the objective moves it to the other type.
3. **Quiz (5 min):** Run Quiz me through all 18 types. Record your score and the types you missed.
4. **Reflect (2 min):** Which two types did you confuse most? Name the single question that separates them.

### Assessment

- The learner can name the library for at least 15 of the 18 types.
- The learner can state the data each type needs and give an example objective for it.
- The learner scores at least 14 of 18 in Quiz me.
- Exit question: "Which two types are both built on vis-network, and what distinguishes them?"

## References

1. [Chapter 4: Choosing a MicroSim Type](../../chapters/04-choosing-a-microsim-type/index.md) — the type catalog, its families and each type in detail.
2. [vis-network documentation](https://visjs.github.io/vis-network/docs/network/) — the network library used for this explorer, including its hierarchical layout.
3. [Chart.js documentation](https://www.chartjs.org/docs/latest/) — the library behind the Chart.js and bubble chart types.
4. [Leaflet](https://leafletjs.com/) — the map library behind the Leaflet map type.
5. [Mermaid](https://mermaid.js.org/) — the text-to-diagram library behind the Mermaid type.
