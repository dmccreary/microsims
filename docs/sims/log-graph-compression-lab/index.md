---
title: Log and Graph Compression Lab
description: Move the ingest rate and sync cadence to see how summary vertices keep graph writes near 2,500 per second while one vertex per statement would climb to 250,000, using the LRS design document's published estimates.
image: /sims/log-graph-compression-lab/log-graph-compression-lab.png
og:image: /sims/log-graph-compression-lab/log-graph-compression-lab.png
twitter:image: /sims/log-graph-compression-lab/log-graph-compression-lab.png
social:
   cards: false
quality_score: 100
---

# Log and Graph Compression Lab

<iframe src="main.html" height="662px" width="100%" scrolling="no"></iframe>

[Run the Log and Graph Compression Lab MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

The full LRS keeps two databases. ClickHouse stores every statement as a row. The Neo4j graph
stores structure plus **summary vertices**, one vertex per analytical grain, such as one
`ConceptMastery` vertex per student and concept. This lab uses the design document's own
estimates to show why that choice matters.

The **left chart** compares, for one simulated 90-day semester at the chosen ingest rate, the
number of ClickHouse rows with the number of vertices for the chosen grain. The design estimates
storage ratios of about 40:1 for `PageEngagement`, 100:1 for `ConceptMastery`, 60:1 for
`MicroSimEngagement`, 3:1 for `QuestionResponse` and 3,000:1 for `SectionRollup`. It gives no
ratio for `LearningSession`, and the chart says so.

The **right chart** plots graph writes per second against the ingest rate. The dashed line is
what one vertex per statement would cost: the design's "about 50,000 graph writes per second" at
10,000 statements per second (a vertex plus about four edges each). The solid line is the
summarizer's upserts: at each sync cadence it writes one upsert per *distinct grain touched in the
window*, not per statement. **Show design estimates** overlays the design's three rows at
10,000 statements per second: about 10,000 upserts/s at a 5 s cadence, 2,500 at 60 s and 1,000 at
300 s.

The student population is held at the design's peak of about 100,000 active students, so moving
the rate up is a burst: each student emits more statements, but no new students or grains
appear. Values between the design's rows come from this sim's interpolation, and every number is a
design estimate, not a measurement. Hover a bar or a point to see its arithmetic and source
section.

**Learning objective:** The learner will examine how summary vertices decouple graph write rate
from ingest rate, using the design's published estimates as inputs.

**Bloom's taxonomy level:** Analyze (verb: *examine*)

## How to Use

1. At the defaults (10,000 statements/s, 60 s), read the note: statements per grain, summary
   upserts per second, and writes per second with one vertex per statement.
2. Drag **Ingest rate** to 50,000, the design's burst. Which line moves, and by how much?
3. Drag **Sync cadence** from 5 s to 300 s. What does a longer window buy, and what does it
   cost in graph lag?
4. Check **Show design estimates** and compare the three design rows with the solid line.
5. Change **Grain** and compare the semester's rows and vertices for each summary vertex.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/log-graph-compression-lab/main.html"
        height="662px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development).

### Duration

15-20 minutes

### Prerequisites

- The roles of ClickHouse and the Neo4j graph in the full LRS (Chapter 20)
- The six summary vertices and their grains (Chapter 20)
- Reading a logarithmic axis

### Activities

1. **Burst test (5 min):** Record both lines at 10,000 and at 50,000 statements per second.
   Compute the ratio of change for each line and explain the difference in one sentence.
2. **Cadence trade-off (5 min):** Record upserts per second and statements per grain at 5 s,
   60 s and 300 s. Explain why the design picks 60 s as its default.
3. **Grain comparison (5 min):** For each grain, record the semester's vertex count. Which grain
   compresses least, and why does that follow from what it counts?

### Assessment

- The learner explains that the summary write rate is set by the number of distinct grains per
  window, which a burst barely changes, while one vertex per statement scales with every statement.
- The learner distinguishes storage compression (statements per vertex over time) from write-rate
  compression (upserts per second per window).
- The learner labels every figure as a design estimate and names which values were interpolated.

## References

1. [ClickHouse](https://en.wikipedia.org/wiki/ClickHouse) - Wikipedia. The column-oriented database that stores the statement log.
2. [Neo4j](https://en.wikipedia.org/wiki/Neo4j) - Wikipedia. The graph database that holds structure and summary vertices.
3. [Graph database](https://en.wikipedia.org/wiki/Graph_database) - Wikipedia. Vertices, edges and the property graph model.
4. [Chart.js logarithmic axis](https://www.chartjs.org/docs/latest/axes/cartesian/logarithmic.html) - Chart.js documentation. The axis type used on both charts.
5. [Chart.js documentation](https://www.chartjs.org/docs/latest/) - Chart.js. The charting library used by this MicroSim.
