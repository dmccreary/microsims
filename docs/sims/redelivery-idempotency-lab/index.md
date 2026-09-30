---
title: Redelivery and Idempotency Lab
description: Deliver statements through an at-least-once stream, crash the processor before it commits, and compare a summary writer that increments with one that recomputes an absolute count from a deduplicated log.
image: /sims/redelivery-idempotency-lab/redelivery-idempotency-lab.png
og:image: /sims/redelivery-idempotency-lab/redelivery-idempotency-lab.png
twitter:image: /sims/redelivery-idempotency-lab/redelivery-idempotency-lab.png
social:
   cards: false
quality_score: 100
---

# Redelivery and Idempotency Lab

<iframe src="main.html" height="562px" width="100%" scrolling="no"></iframe>

[Run the Redelivery and Idempotency Lab MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The LRS event stream guarantees **at-least-once delivery**: a statement is never lost, but it may
arrive twice. The stream processor writes a batch to the log and only then commits the queue
offset. If it crashes between the write and the commit, the whole batch is delivered again.

This lab reads a stream of twelve statements in batches of three. Each delivery adds a row to the
log, and two writers keep a summary count:

- **Writer A: count += 1** adds one on every delivery, the way `count = count + 2` would.
- **Writer B: count = recomputed from log** writes an absolute value, the number of rows in the
  deduplicated log, the design's rule "recompute absolutes, never increment".

A dashed **truth line** marks the correct count, the number of distinct statements delivered. The
**Deduplicate log by statement id** checkbox stands for ClickHouse's ReplacingMergeTree and the
`lrs.statements_deduped` view, which keep one row per statement id. Turn it off and duplicate rows
stay in the log.

The lab opens just after a crash: the first batch was written, the processor died before its
commit, and two of its statements have already been redelivered. Writer A reads 5 while the truth
and Writer B read 3.

**Learning objective:** The learner will justify why writing absolute values, not increments, keeps
a summary correct when statements are redelivered.

**Bloom's taxonomy level:** Evaluate (verb: *justify*)

## How to Use

1. Read the opening state: which writer is on the truth line, and why is the other one above it?
2. Press **Deliver next statement** repeatedly. At each batch boundary the processor tries to
   commit; with **Redelivery chance** above zero it sometimes crashes and the batch comes back.
3. Press **Crash before commit** at any time to force the current batch to be redelivered.
4. Uncheck **Deduplicate log by statement id**, deliver a few repeats, and read the message:
   which layer failed?
5. Check the box again. Writer B recomputes from the fixed log and heals. Does Writer A?
6. **Reset** empties the log and both counters.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/redelivery-idempotency-lab/main.html"
        height="562px"
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

- The stream processor's write-then-commit sequence (Chapter 20)
- What a summary vertex count such as `statements_compressed` means (Chapter 20)
- Basic idea of a database row and a unique key

### Activities

1. **Explain the opening state (4 min):** Write down the three numbers (Writer A, Writer B,
   truth) and trace, delivery by delivery, how Writer A reached 5.
2. **Run to the end (5 min):** Set Redelivery chance to 30% and deliver all twelve statements.
   Record how far Writer A drifted and whether Writer B ever left the truth line.
3. **Break the log (4 min):** Turn deduplication off, force a crash, redeliver, then turn it back
   on. Describe what each writer does at each step.
4. **Justify (5 min):** In a short paragraph, justify the design rule "recompute absolutes, never
   increment" to a colleague who proposes `count = count + n` because it is faster.

### Assessment

- The learner explains that an increment cannot distinguish a repeated statement from a new one,
  so every redelivery adds a permanent error that nothing downstream can detect.
- The learner explains that an absolute value recomputed from a deduplicated log is the same no
  matter how many times it is written, and that it heals once the log is correct.
- The learner identifies deduplication by statement id as a second, separate layer, and names it
  as the layer that failed when Writer B drifts.

## References

1. [Idempotence](https://en.wikipedia.org/wiki/Idempotence) - Wikipedia. Operations that give the same result when applied more than once.
2. [Apache Kafka](https://en.wikipedia.org/wiki/Apache_Kafka) - Wikipedia. Consumer offsets, commits and at-least-once delivery.
3. [ClickHouse](https://en.wikipedia.org/wiki/ClickHouse) - Wikipedia. The column-oriented database that holds the LRS log.
4. [p5.js createCheckbox() reference](https://p5js.org/reference/p5/createCheckbox/) - p5.js. The control used for the deduplication switch.
