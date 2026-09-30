---
title: Prediction Trust Ladder
description: Judge how far a mastery-prediction claim can be trusted by placing it on a five-rung ladder of evidence, from hoped for to replicated and audited, and read what each rung requires.
image: /sims/prediction-trust-ladder/prediction-trust-ladder.png
og:image: /sims/prediction-trust-ladder/prediction-trust-ladder.png
twitter:image: /sims/prediction-trust-ladder/prediction-trust-ladder.png
social:
   cards: false
quality_score: 100
---

# Prediction Trust Ladder

<iframe src="main.html" height="642px" width="100%" scrolling="no"></iframe>

[Run the Prediction Trust Ladder MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A **trustworthy prediction** is one a responsible person can rely on because it has been tested,
reported with its limits, and kept under human control. Chapter 26 places the claims in this book
on a ladder of evidence. Each rung needs everything below it and more:

| Rung | What it means | Where this book's claims sit |
|---|---|---|
| 5. Replicated and audited | Holds across sessions and learner groups, audited | Empty |
| 4. Measured once | Held-out result from one real class | Empty |
| 3. Simulated | Tested on synthetic data | The Chapter 19 synthetic evaluation |
| 2. Designed | A written design exists | Knowledge tracing on MicroSim events (Chapter 18) |
| 1. Hoped for | An idea with no design | The long-term vision of Chapter 26 |

Click any rung to see the evidence it requires, one example claim from the book that sits there,
and what would move a claim up. Hover over a rung to see its name. The **Place this claim** menu
offers six example claims; two of them are marked hypothetical because no real-learner result
exists yet. After you click the rung where you think a claim sits, the correct rung gets a thick
black outline and a wrong choice gets a dashed outline, with an explanation.

The ladder is a planning aid, not a measured result. As the chapter says, a reader who sees a
dashboard number for mastery should ask which rung produced it.

The rungs can also be reached from the keyboard: Tab moves from the menu to the rungs, bottom to
top, and Enter opens the focused rung. The ladder is drawn bottom-to-top so that each arrow points
up to the next rung.

**Learning objective:** The learner will judge how far a given mastery-prediction claim can be
trusted by locating it on a ladder of evidence.

**Bloom's taxonomy level:** Evaluate (verb: *judge*)

## How to Use

1. Click each rung from the bottom up and read what evidence it requires.
2. Choose a claim in **Place this claim**.
3. Click the rung where you think the claim sits today. Read the feedback and what would move the
   claim up.
4. Repeat for all six claims. Then click any rung to compare its requirements with the claim you
   just placed.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/prediction-trust-ladder/main.html"
        height="642px"
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

- Mastery prediction and knowledge tracing (Chapter 18)
- The fidelity evaluation protocol: held-out assessment, baseline, calibration (Chapter 19)
- Bias in prediction and ethical use of predictions (Chapter 24)

### Activities

1. **Read the ladder (4 min):** Click each rung and write one sentence on what separates it from
   the rung below.
2. **Place six claims (6 min):** Place every claim in the menu. For each miss, reread the rung it
   belongs on and name the missing evidence.
3. **Bring your own claim (5 min):** Write one mastery claim from your capstone portfolio or from a
   vendor dashboard you have seen. Place it on the ladder and write what would move it up one rung.

### Assessment

- The learner places at least five of the six claims on the correct rung.
- The learner explains why a synthetic result sits below a result from one real class.
- For their own claim, the learner names the rung, the missing evidence and the next test.

## References

1. [Replication crisis](https://en.wikipedia.org/wiki/Replication_crisis) - Wikipedia. Why a
   single measured result is weaker evidence than a replicated one.
2. [Calibration (statistics)](https://en.wikipedia.org/wiki/Calibration_(statistics)) - Wikipedia.
   One of the properties a trustworthy prediction must show.
3. [Flowchart syntax](https://mermaid.js.org/syntax/flowchart.html) - Mermaid documentation.
   Flowchart direction (`BT`) and the `click` directive used by this ladder.
