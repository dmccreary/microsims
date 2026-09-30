---
title: Claim Sorter
description: Sort ten sentences about the xAPI stream and the Learning Record Store into measured, designed and hoped-for claims, and justify each by the evidence a measured claim would need.
image: /sims/fidelity-claim-sorter/fidelity-claim-sorter.png
og:image: /sims/fidelity-claim-sorter/fidelity-claim-sorter.png
twitter:image: /sims/fidelity-claim-sorter/fidelity-claim-sorter.png
social:
   cards: false
quality_score: 100
---

# Claim Sorter

<iframe src="main.html" height="582px" width="100%" scrolling="no"></iframe>

[Run the Claim Sorter MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This book's honesty rules divide statements into three kinds, and **measured versus designed claims** is the discipline of labeling every sentence as one of them:

- A **measured** claim states a result that was actually observed and can be repeated: a run, a log, a computed metric, a recorded inspection.
- A **designed** claim states what a system is specified, decided or planned to do.
- A **hoped-for** claim states what its authors expect but have not tested.

The sorter holds ten sentences drawn from Chapters 18 to 20 and from the Learning Record Store repository's `TODO.md` dated 2026-09-26. Some are easy, such as "MicroSim xAPI streams predict real learners' mastery", which is hoped for because no learner data exist. Some are subtle. "On the synthetic cohort, BKT reached an AUC of 0.743" is measured, but about a simulation whose rules the authors wrote, so it shows that the evaluation code works, not that real learners behave that way. "No emitter sends statements to a store yet" is also measured: it is an observed, dated state of the repository.

A correct placement turns the card into a green chip in its zone and explains the classification. An incorrect placement returns the card to the stack with a hint that names the evidence a measured claim would need.

**Learning objective:** Learners will classify statements about the xAPI stream as measured, designed or hoped for, and justify the classification by pointing to the evidence that would be required.

**Bloom level:** Evaluate (L5). **Bloom verb:** classify.

## How to Use

1. Read the sentence on the top card of the stack.
2. Drag the card into **Measured**, **Designed** or **Hoped for**. For keyboard use, tab to the **→ Measured**, **→ Designed** or **→ Hoped for** button instead; the buttons act on the top card.
3. Read the feedback panel: the explanation for a correct placement, or a hint about the missing evidence for an incorrect one. The counter shows how many cards are correctly placed.
4. Click any green chip to review its explanation.
5. **Check all** summarizes your progress and first-try accuracy, **Shuffle** reorders the remaining stack, and **Reset** starts over.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/fidelity-claim-sorter/main.html"
        height="582px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development) who write or review claims about learning analytics.

### Duration

15 to 20 minutes.

### Prerequisites

- Measured versus designed claims (Chapter 19)
- The "What Is Built, Designed and Hoped For" sections of Chapters 18 and 20

### Activities

1. **Sort (8 min):** Learners sort all ten cards. Before each drop they say, or write, the evidence that would make the sentence a measured claim.
2. **Compare (4 min):** Pairs compare first-try results and discuss the two synthetic-cohort cards: why are they measured, and what do they not show?
3. **Upgrade a claim (5 min):** Each learner picks one hoped-for card and writes the study, log or test that would turn it into a measured claim.
4. **Apply (3 min):** Learners label three sentences from a vendor brochure or their own project documentation as measured, designed or hoped for.

### Assessment

- The learner places at least 8 of the 10 cards correctly on the first try.
- For any card, the learner names the evidence a measured claim would require and says whether it exists.
- The learner explains why a measured result about a simulation is not evidence about real learners.

## References

1. [Chapter 19: Evaluating the Predictive Fidelity of the xAPI Stream](../../chapters/19-evaluating-the-predictive-fidelity-of-the-xapi-stream/index.md) - measured versus designed claims and reporting prediction quality.
2. [Chapter 18: Mastery Prediction and Knowledge Tracing](../../chapters/18-mastery-prediction-and-knowledge-tracing/index.md) - the built, designed and hoped-for table for the mastery pipeline.
3. [Chapter 20: The Full LRS: Architecture and Ingestion](../../chapters/20-the-full-lrs-architecture-and-ingestion/index.md) - component status as of the repository's TODO file.
4. [p5.js reference: createButton()](https://p5js.org/reference/p5/createButton/) - the control used for the keyboard-accessible zone buttons.
