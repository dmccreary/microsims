---
title: Failure Boundary Explorer
description: Break one component of the full LRS at a time and see why only a failure before the durability boundary at Kafka can lose data, while every failure after it only degrades freshness or speed.
image: /sims/failure-boundary-explorer/failure-boundary-explorer.png
og:image: /sims/failure-boundary-explorer/failure-boundary-explorer.png
twitter:image: /sims/failure-boundary-explorer/failure-boundary-explorer.png
social:
   cards: false
quality_score: 100
---

# Failure Boundary Explorer

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the Failure Boundary Explorer Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

The full Learning Record Store (LRS) moves each statement from a Learning Record Provider
through the ingestion gateway into Kafka, and from there to the processor, ClickHouse, the
summarizer and Neo4j, with a Redis cache on the read path. The design sorts its failure modes
with one rule: **a statement already in Kafka is durable**. Anything after Kafka can be rebuilt
from the log, so losing it degrades freshness or speed and heals on recovery. Only an
unreachable Kafka can lose data, because a statement that never reached durable storage cannot
be reconstructed. In that case the gateway buffers briefly, then returns HTTP 503 with a
`Retry-After` header, and the design pages a person immediately.

The dashed red line after Kafka marks that durability boundary. Choosing a component in **Fail
this component** grays it out and shows what is detected, what the system does meanwhile, and
whether data is lost. Kafka turns the panel red and shows the 503 response. Clicking any box
shows its role and whether it is built or only designed; a dashed border means designed or
only partly built, following the repository TODO file quoted in Chapters 20 and 21. The panel
keeps a running list of the failures you have tried, sorted by what they cost.

**Learning objective:** The learner will differentiate the one failure that can lose data from
the failures that only degrade freshness or speed, by locating each failing component relative
to the durability boundary at Kafka.

**Bloom's taxonomy level:** Analyze (verb: *differentiate*)

## How to Use

1. Read the default panel's legend: orange boxes are before the line, Kafka is the durable
   log, blue boxes are after it, and purple is the read path.
2. Before failing a component, predict whether it can lose data. Then choose it in **Fail this
   component** and check the verdict.
3. Fail Kafka and read the 503 and `Retry-After: 5` response. Compare it with failing the
   gateway: why does a gateway failure not lose data by itself?
4. Fail each component after the line. What does each one cost: freshness, speed, or nothing
   visible?
5. Click any box to read its role and status. Press **Restore all** to see your findings.

On screens narrower than 900 pixels the panel sits below the diagram; under about 560 pixels
the diagram folds into two rows and the boundary becomes an L around the three components
before it.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/failure-boundary-explorer/main.html"
        height="602px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development).

### Duration

15 minutes

### Prerequisites

- The full LRS pipeline: gateway, event stream, processor, ClickHouse and Neo4j (Chapter 20)
- Idempotent ingest and "recompute absolutes, never increment" (Chapter 20)

### Activities

1. **Predict and sort (5 min):** Before touching the sim, sort the eight components into
   "can lose data" and "only degrades freshness or speed". Write one reason for each.
2. **Test (5 min):** Fail each component in turn and compare the verdicts with your sort.
   Mark any you got wrong.
3. **Explain the one exception (3 min):** In two sentences, explain why Kafka is the only
   failure that pages a person immediately, using the words "durable" and "rebuild".
4. **Transfer (2 min):** Where would the boundary sit in a system you know, such as a web
   form that writes straight to a database?

### Assessment

- The learner names Kafka as the one failure that can lose data and justifies it with the
  durability rule.
- For any component after the line, the learner states what degrades and why it heals on
  recovery (replay from the log, idempotent ingest, recomputed absolutes).
- The learner explains why a gateway failure puts the burden on the producer to retry.

## References

1. [Apache Kafka](https://en.wikipedia.org/wiki/Apache_Kafka) - Wikipedia. The durable,
   partitioned event log at the boundary.
2. [ClickHouse](https://en.wikipedia.org/wiki/ClickHouse) - Wikipedia. The column store that
   holds the statement log.
3. [Neo4j](https://en.wikipedia.org/wiki/Neo4j) - Wikipedia. The graph database that holds
   structure and summary vertices.
4. [Redis](https://en.wikipedia.org/wiki/Redis) - Wikipedia. The in-memory store used as a
   cache on the read path.
5. [HTTP 503 Service Unavailable](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503) -
   MDN Web Docs. The status code and the `Retry-After` header the gateway returns.
6. [vis-network documentation](https://visjs.github.io/vis-network/docs/network/) - vis.js.
   The library used to draw the diagram.
