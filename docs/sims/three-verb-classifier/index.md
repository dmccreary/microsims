---
title: Three Verb Classifier
description: Classify twelve learner events in a mock Bouncing Ball MicroSim as answered, experienced, interacted or no statement, then see the verb, object type, required result field and the statement's JSON.
image: /sims/three-verb-classifier/three-verb-classifier.png
og:image: /sims/three-verb-classifier/three-verb-classifier.png
twitter:image: /sims/three-verb-classifier/three-verb-classifier.png
social:
   cards: false
quality_score: 100
---

# Three Verb Classifier

<iframe src="main.html" height="702px" width="100%" scrolling="no"></iframe>

[Run the Three Verb Classifier MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Version 1 of the producer contract allows exactly three verbs, and each one has a job and a
required result field. This MicroSim gives you twelve scripted learner events from a mock
Bouncing Ball MicroSim (a speed slider, a Start/Pause button, a three-node diagram and a
one-question check) and asks you to place each one in the right bin:

| Bin | What it can say | Object type | Required result field |
|---|---|---|---|
| answered | the learner was right or wrong on a checked item | Question | `success` |
| experienced | the learner spent this long in a run | MicroSim (the page, no fragment) | `duration` |
| interacted | the learner touched this control, with these values | Control | none; values go in result extensions |
| no statement | nothing: a sub-threshold act, a repeat, or not a new attempt | none | none |

After each placement the infobox shows the correct verb, the object type, the required result
field and one sentence of reasoning from Chapter 16. **Show statement** renders the statement's
verb, object and result as xAPI 1.0.3 JSON, using this book's canonical site URL for the
activity IRI. Three of the events need no statement at all, and explaining why is part of the task.

**Learning objective:** The learner will classify learner actions in a described MicroSim into
the correct verb, object type and required result field, and explain any action that needs no
statement.

**Bloom's taxonomy level:** Apply (verb: *classify*)

## How to Use

1. Read the event card. The part of the mock MicroSim it concerns is highlighted in gold.
2. Drag the card into one of the four bins, or press a bin button or the keys **1** to **4**.
3. Read the feedback: verb, object type, required result field and the reason.
4. Press **Show statement** (or **S**) to see the JSON; for a "no statement" event it explains
   why there is nothing to show.
5. Press **Next event** (or **N**). After twelve events, click any chip in a bin to review it.
   **Try again** reshuffles the events and resets the score.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/three-verb-classifier/main.html"
        height="702px"
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

- The five parts of an xAPI statement (actor, verb, object, result, context)
- The three MicroSim verbs and the four object types from Chapter 16
- The hover (600 ms) and misclick (250 ms) thresholds

### Activities

1. **Classify (8 min):** Sort all twelve events. Before dropping each card, say the verb and
   the required result field out loud, then check yourself against the infobox.
2. **Read the statements (4 min):** For one event of each verb, press Show statement and point
   to the field that makes it valid: `success`, `duration`, or the values in result extensions.
3. **Explain the silences (5 min):** For each "no statement" event, write one sentence naming
   the rule that suppresses it (misclick threshold, hover threshold, or "not a new attempt").
   Then press Try again and aim for 12 of 12.

### Assessment

- The learner classifies at least 10 of 12 events correctly on the first try.
- Given a new event, the learner names its verb, object type and required result field.
- The learner explains why a 100 ms run, a repeated wrong choice and a fast pointer sweep emit
  no statement.

## References

1. [xAPI Specification, Part Two: Experience API Data (version 1.0.3)](https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md) - ADL. The statement, verb, object and result definitions used in the JSON.
2. [Experience API](https://en.wikipedia.org/wiki/Experience_API) - Wikipedia. Overview of xAPI and learning record stores.
3. [ISO 8601 durations](https://en.wikipedia.org/wiki/ISO_8601#Durations) - Wikipedia. The `PT40S` format used in `result.duration`.
4. [p5.js mouseDragged() reference](https://p5js.org/reference/p5/mouseDragged/) - p5.js. The event used to drag the card.
