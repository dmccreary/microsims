---
title: Full LRS Architecture Explorer
description: Explore the full Learning Record Store's five planes and twelve nodes, see which components are built, partly built or only designed, and quiz yourself by dragging each component into its plane.
image: /sims/lrs-architecture-explorer/lrs-architecture-explorer.png
og:image: /sims/lrs-architecture-explorer/lrs-architecture-explorer.png
twitter:image: /sims/lrs-architecture-explorer/lrs-architecture-explorer.png
social:
   cards: false
quality_score: 100
---

# Full LRS Architecture Explorer

<iframe src="main.html" height="662px" width="100%" scrolling="no"></iframe>

[Run the Full LRS Architecture Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

The full Learning Record Store (LRS) divides its work into five **planes**, each a group of components that share a responsibility. The ingestion plane accepts statements and puts them on a durable queue. The processing plane validates, enriches and pseudonymizes them and runs the compression that produces summaries. The storage plane holds the log, the graph and the identity vault. The analytics plane runs the queries behind every report. The presentation plane renders dashboards and admin screens.

The explorer draws the planes as five horizontal bands, with the textbooks that produce statements on the left, outside the LRS. Arrows show data flow: textbooks to the gateway, to the event stream, to the processors and into ClickHouse; ClickHouse to the summarizer and on to Neo4j; and the processors to the reconciler and on to Neo4j. The identity service, the vault, the analytics API and the dashboards complete the picture. Hover over any arrow to see what travels along it.

Each component is colored by its status in the companion repository's `TODO.md` dated 2026-09-26:

- **Built** (bluish green): code exists and has been run. Only the gateway, verified against a live Redpanda with 28 contract tests reported.
- **Files exist** (yellow): the event stream, ClickHouse and Neo4j have infrastructure and schema files, but the workers that feed them are not built.
- **Designed** (light gray, dashed border): in the design document, with no code yet.

Check **Hide designed components** to see how little of the path is built today. The node data, edge descriptions and status notes live in `data.json`, so the diagram can be updated when the repository changes.

**Learning objective:** The learner will differentiate the five architectural planes and the components in each, and distinguish built components from designed ones.

**Bloom level:** Analyze. **Bloom verb:** differentiate.

## How to Use

1. Click any component. The panel below the diagram shows its one-sentence role, its hard dependencies and its status with the date of the source. Each panel text is also written to the browser console as a log line.
2. Hover over an arrow to read what travels along it, such as validated statements keyed by district and learner.
3. Check **Hide designed components** to leave only the built and partly built components.
4. Press **Quiz me**. The status colors and arrows are hidden and one component at a time appears in the orange tray. Drag it into its plane, or choose the plane with a button in the panel. A wrong answer explains what the chosen plane does and repeats the component's role. **End quiz** returns to the explorer.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/lrs-architecture-explorer/main.html"
        height="662px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development) who need to understand what the full LRS is made of and how much of it exists.

### Duration

15 to 20 minutes.

### Prerequisites

- What a Learning Record Store is and its three duties (Chapter 20)
- xAPI statements (Chapter 16)

### Activities

1. **Trace one statement (5 min):** Starting at Textbooks, learners click each component along the path of one `interacted` statement and write one sentence per plane it passes through.
2. **Built versus designed (4 min):** Learners check **Hide designed components** and list what is left. They explain why the path stops at the event stream.
3. **Quiz (6 min):** Learners run **Quiz me** and record their first-try score. Pairs discuss any component they misplaced.
4. **Discuss (3 min):** Why is the gateway's only hard dependency the queue? What would happen to a classroom's evidence if the gateway depended on ClickHouse?

### Assessment

- The learner names the five planes in order and places at least 9 of the 11 components on the first try.
- The learner states which components are built, which have only files, and which are designed, citing the status source and its date.

## References

1. [Chapter 20: The Full LRS: Architecture and Ingestion](../../chapters/20-the-full-lrs-architecture-and-ingestion/index.md) - the five planes, the component glossary and the built, designed and hoped-for table.
2. [xAPI specification (ADL)](https://github.com/adlnet/xAPI-Spec) - the statement format and Learning Record Store requirements.
3. [Apache Kafka documentation](https://kafka.apache.org/documentation/) - topics, partitions and ordering within a partition.
4. [vis-network documentation](https://visjs.github.io/vis-network/docs/network/) - the network library, including fixed positions and edge tooltips.
