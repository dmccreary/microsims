---
title: Partition Key Simulator
description: Route a burst of xAPI statements into event-stream partitions by district, by district and learner, or with no key, and compare the load on each partition lane with the order in which the processor reads each learner's statements.
image: /sims/partition-key-simulator/partition-key-simulator.png
og:image: /sims/partition-key-simulator/partition-key-simulator.png
twitter:image: /sims/partition-key-simulator/partition-key-simulator.png
social:
   cards: false
quality_score: 100
---

# Partition Key Simulator

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the Partition Key Simulator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The full LRS puts every accepted statement on an event stream (Redpanda in development, Kafka in
production). A topic is split into partitions, and a partition is one ordered lane: the stream
guarantees order inside a lane and makes no promise across lanes. The message **key** decides the
lane, because the producer hashes the key and takes the result modulo the number of partitions.

This simulator sends bursts of 60 statements from a class of learners, one color per learner, and
routes each one by hashing the key you choose:

- **Key: district only** (`district-a`). Every statement from a district shares one key, so the
  whole district lands in a single lane. The large district's lane overflows the red limit line.
- **Key: district and learner** (`district-a:https://school.example.edu|learner-07`, the form the
  gateway builds). Each learner has a key of their own, so the load spreads across lanes while
  each learner's statements stay in one lane, in order.
- **No key (random lane)**, a contrast the chapter does not discuss: statements are spread with no
  key, so one learner's statements land in several lanes and the processor can read them out of
  order.

The processor on the right reads the oldest statement in each lane at its own pace. Select a
learner to see which lanes their statements used and the order in which the processor read them.
Order matters because sequential Bayesian updates do not commute: "wrong, wrong, right" and
"right, wrong, wrong" produce different mastery estimates.

The hash is murmur2, the function Kafka's default partitioner applies to a key. District sizes are
unequal on purpose (District A has half of the learners), because a large district on one lane is
the hotspot the chapter describes. The red limit is a teaching threshold, twice an even share of a
burst, not a Kafka setting.

**Learning objective:** The learner will compare keying by district with keying by district and
learner, in terms of per-partition load and per-learner ordering.

**Bloom's taxonomy level:** Analyze (verb: *compare*)

## How to Use

1. Start with the default, **Key: district and learner**. Read the load bars and the summary line:
   what is the busiest lane's peak, compared with the limit?
2. Select **Key: district only**. Watch one lane per district fill and the large district's bar
   cross the red limit. Note the peak.
3. Click a learner's dot (in the legend or in a lane). Read the lanes used and the processor's
   read order in the panel. Compare the two keys: is the order kept in both?
4. Try **No key (random lane)** and hover over the sim while the lanes drain. How many learners
   are read out of order now?
5. Change **Learners**, **Districts** and **Partitions**, press **Send burst**, and use **Pause**
   to freeze the lanes. The sim moves only while the pointer is over it.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/partition-key-simulator/main.html"
        height="602px"
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

- What the event stream does in the LRS and why statements are queued (Chapter 20)
- The idea of a hash function that maps a string to a number
- Why the order of evidence matters to a sequential mastery estimate (Chapter 18)

### Activities

1. **Two-key comparison table (7 min):** For each key, record the busiest lane's peak, the number
   of lanes in use and whether the selected learner was read in order. Repeat with 1 district and
   with 4 districts.
2. **Stress the design (5 min):** Set 60 learners, 1 district and 12 partitions. Explain what
   the district-only key does to the other 11 lanes, and connect it to the chapter's
   200,000-student district.
3. **Justify the choice (5 min):** Using the no-key contrast, write two sentences on why the
   design keys by district and learner rather than by district alone or not at all.

### Assessment

- The learner states that keying by district concentrates a district's whole load on one lane,
  while keying by district and learner spreads the load.
- The learner explains that both keys keep each learner in one lane, so both preserve per-learner
  order, and that order is only lost when one learner's statements are spread across lanes.
- The learner connects per-learner order to the non-commuting mastery updates of Chapter 18.

## References

1. [Apache Kafka](https://en.wikipedia.org/wiki/Apache_Kafka) - Wikipedia. Topics, partitions and per-partition ordering.
2. [MurmurHash](https://en.wikipedia.org/wiki/MurmurHash) - Wikipedia. The family of hash functions Kafka uses to map keys to partitions.
3. [Partition (database)](https://en.wikipedia.org/wiki/Partition_(database)) - Wikipedia. Hot spots and choosing a partition key.
4. [Message queue](https://en.wikipedia.org/wiki/Message_queue) - Wikipedia. Producers, consumers and durable queues.
5. [p5.js createRadio() reference](https://p5js.org/reference/p5/createRadio/) - p5.js. The control used to choose the key.
