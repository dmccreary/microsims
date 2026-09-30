---
title: Which Kind of Object Is It?
description: Drag twelve example cards into four bins to distinguish learning objects, interactive simulations, MicroSims and instrumented MicroSims, with feedback that names the deciding property.
image: /sims/which-kind-of-object-classifier/which-kind-of-object-classifier.png
og:image: /sims/which-kind-of-object-classifier/which-kind-of-object-classifier.png
twitter:image: /sims/which-kind-of-object-classifier/which-kind-of-object-classifier.png
social:
   cards: false
quality_score: 100
---

# Which Kind of Object Is It?

<iframe src="main.html" height="492px" width="100%" scrolling="no"></iframe>

[Run the Which Kind of Object Is It? MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This sorting activity checks whether you can tell apart the four kinds of object defined in
Chapter 1. Each card describes one example, such as "A five-minute video on photosynthesis" or
"The same simulation that also sends slider and answer events to a record store." Drag the card
into one of four bins:

| Bin | The property that earns it |
|---|---|
| Learning Object | Reusable, self-contained and described |
| Interactive Simulation | Adds a model the learner changes, with an immediate response |
| MicroSim | Adds small, browser-based, embeddable with one iframe, described by metadata |
| Instrumented MicroSim | Adds reporting of learner interactions as xAPI statements |

There are twelve cards, three per bin, shuffled on every run. A correct drop turns the bin green
and explains the decision in one sentence. A wrong drop shakes the card back to the center and
names the deciding property: the property the example is missing if you chose a bin that is
too specific, or the extra property it has if you chose one that is too general. The score
counts correct answers out of attempts.

**Learning objective:** The learner will distinguish learning objects, interactive
simulations, MicroSims, and instrumented MicroSims by sorting example descriptions into the
correct category.

**Bloom's taxonomy level:** Analyze (verb: *distinguish*)

## How to Use

1. Read the example on the card.
2. Drag the card into the bin where it belongs. You can also press the keys **1** to **4** to
   choose a bin.
3. If the bin turns green, read the explanation and press **Next**.
4. If the card shakes back, read which property decides the example and try another bin.
5. After twelve cards, the summary shows how many you sorted right on the first try. Press
   **Shuffle** to play a new round.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/which-kind-of-object-classifier/main.html"
        height="492px"
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

- The definitions of learning object, interactive simulation, MicroSim and instrumented
  MicroSim from Chapter 1
- The MicroSim Family Tree diagram (recommended)

### Activities

1. **Sort (6 min):** Sort all twelve cards. Aim for at least ten right on the first try.
2. **Explain a miss (4 min):** For each card you missed, write the property that decided it and
   where that property appears in the card's wording.
3. **Write a card (4 min):** Write a new example for the bin you found hardest, then trade with
   a partner and sort each other's cards.

### Assessment

- The learner sorts at least 10 of 12 cards correctly on the first attempt.
- For any card, the learner can name the single property that separates it from the
  neighboring category.
- The learner writes an original example that a partner sorts into the intended bin.

## References

1. [Learning object](https://en.wikipedia.org/wiki/Learning_object) - Wikipedia. Reusable,
   described units of instruction.
2. [Simulation](https://en.wikipedia.org/wiki/Simulation) - Wikipedia. The general idea of a
   model whose behavior can be explored.
3. [Experience API](https://en.wikipedia.org/wiki/Experience_API) - Wikipedia. The xAPI
   standard that instrumented MicroSims use to report interactions.
4. [p5.js mouseDragged() reference](https://p5js.org/reference/p5/mouseDragged/) - p5.js. The
   event used to drag the card.
