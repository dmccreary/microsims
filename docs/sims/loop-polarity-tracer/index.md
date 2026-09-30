---
title: Loop Polarity Tracer
description: Trace the polarity links of two learner feedback loops one link at a time, count the negative links, and decide whether each loop is reinforcing or balancing.
image: /sims/loop-polarity-tracer/loop-polarity-tracer.png
og:image: /sims/loop-polarity-tracer/loop-polarity-tracer.png
twitter:image: /sims/loop-polarity-tracer/loop-polarity-tracer.png
social:
   cards: false
quality_score: 0
---

# Loop Polarity Tracer

<iframe src="main.html" height="514px" width="100%" scrolling="no"></iframe>

[Run the Loop Polarity Tracer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This causal loop diagram holds the two learner loops from Chapter 8 on one canvas. They touch
at **Mastery**, the stock both loops share:

- **Learning loop:** Mastery raises Confidence, Confidence raises Practice time, and Practice
  time raises Mastery. All three links are positive.
- **Goal loop:** a larger Gap between goal and mastery raises Study effort, Study effort raises
  Mastery, and Mastery *lowers* the Gap. Two links are positive and one is negative.

Each link carries a green plus or a red minus, the generator's causal loop convention. The
loop markers start as grey question marks. To reveal a marker you trace its loop: the
**Trace next link** button highlights one link at a time while a counter tallies the negative
links so far. Before the final link, the MicroSim asks you to decide whether the loop is
reinforcing or balancing, then reports the full count and the rule: an even number of
negative links (including zero) makes a reinforcing loop, and an odd number makes a balancing
loop.

**Flip a sign** mode turns the diagram into an experiment. Click any link to reverse its
polarity (flipped links are drawn dashed) and watch the loop marker switch between R and B.
Flipping two links in the same loop shows why the rule is about the *parity* of the count,
not about any single link.

The diagram is stored as a JSON document in the causal loop schema (`metadata`, `nodes`,
`edges` with `polarity`, and `loops` with `type` and `path`) at the top of
`loop-polarity-tracer.js`. As the chapter notes, these loops are a plausible hypothesis about a
learner, not a measured result.

**Learning objective:** The learner will examine a causal loop diagram, trace its polarity
links, and determine whether the loop is reinforcing or balancing.

**Bloom's taxonomy level:** Analyze (verb: *examine*)

## How to Use

1. Hover over or click a variable to read its one-sentence description in the details panel.
2. Click a link to see its polarity and the reason for it, such as "More practice, more
   mastery."
3. Choose a loop in the **Loop** menu and press **Trace next link**. Watch the highlighted
   link and the "Negative links so far" counter.
4. When one link remains, look at its sign and choose **Reinforcing** or **Balancing**. The
   feedback names the total count and reveals the loop marker.
5. Check **Flip a sign**, click a link, and watch the loop marker change. Press **Restore
   signs** to return to the original diagram.
6. Use the **+**, **−** and **Fit** buttons to zoom; the mouse wheel scrolls the page, not
   the diagram. You can also drag the diagram or a variable.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/loop-polarity-tracer/main.html"
        height="514px"
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

- Definitions of a feedback loop, a polarity link and a causal loop diagram (Chapter 8,
  "Systems and Feedback")
- Reading arrows in a network diagram (Chapter 8, "Networks with vis-network")

### Activities

1. **Read the links (3 min):** Click each of the six links and restate its reason in your own
   words, using "if the source goes up, the target goes ..." for each.
2. **Trace both loops (5 min):** Trace the Learning loop and then the Goal loop. Before the
   final link of each, commit to Reinforcing or Balancing and write down the count that
   justifies your choice.
3. **Flip experiment (4 min):** Turn on **Flip a sign**. Predict what happens to the Goal loop
   if you flip Mastery → Gap, then flip it. Next flip two links in the Learning loop and
   explain why its label does not change.
4. **Discuss (3 min):** The two loops share Mastery. Describe in two sentences what the
   combined system might do over time when both loops act at once.

### Assessment

- Given a new three- or four-link loop, the learner counts the negative links and classifies
  the loop correctly.
- The learner explains why flipping one link changes a loop's type but flipping two links in
  the same loop does not.
- The learner can state the polarity of a link as a causal "if the source rises" sentence.

## References

1. [Causal loop diagram](https://en.wikipedia.org/wiki/Causal_loop_diagram) - Wikipedia.
   Polarity links, reinforcing and balancing loops, and the negative-link counting rule.
2. [Feedback](https://en.wikipedia.org/wiki/Feedback) - Wikipedia. Positive (reinforcing) and
   negative (balancing) feedback in natural and engineered systems.
3. [System dynamics](https://en.wikipedia.org/wiki/System_dynamics) - Wikipedia. The field that
   uses causal loop diagrams to reason about behavior over time.
4. [vis-network documentation](https://visjs.github.io/vis-network/docs/network/) - vis.js.
   The network library used to draw the diagram, with physics disabled and fixed positions.
