---
title: Bloom Objective Sorter
description: Sort 24 real learning outcomes from this course's description into the six Bloom levels with the three-step classification procedure, and defend ambiguous placements with a written reason.
image: /sims/bloom-objective-sorter/bloom-objective-sorter.png
og:image: /sims/bloom-objective-sorter/bloom-objective-sorter.png
twitter:image: /sims/bloom-objective-sorter/bloom-objective-sorter.png
social:
   cards: false
quality_score: 100
---

# Bloom Objective Sorter

<iframe src="main.html" height="562px" width="100%" scrolling="no"></iframe>

[Run the Bloom Objective Sorter MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Objective classification assigns each learning objective to one Bloom level, and the level then decides which interaction patterns suit it. Because Bloom verbs overlap, classification needs a procedure. This book uses three steps:

1. Find the verb and note the level or levels it suggests.
2. Ask what the learner must do with the content: retrieve it, construct meaning from it, use it in a new case, take it apart, judge it against criteria, or produce something new.
3. If two levels remain plausible, choose the level of the most demanding process that the task truly requires, and record the reason.

The sorter gives you 24 outcomes taken from this course's own course description, four for each level, in a shuffled order. After each placement it highlights the verb, shows the official level from the course description, and explains the classification. Four outcomes are ambiguous, such as "Distinguish claims that have been measured from those that are only designed or hoped for". For those, the neighboring level counts as defensible, but only if you also choose the written reason that supports your placement.

**Learning objective:** The learner will demonstrate the three-step objective classification procedure by sorting real course-description outcomes into the six Bloom levels and giving a reason for each placement.

**Bloom level:** Apply. **Bloom verb:** demonstrate.

## How to Use

1. Read the outcome on the card at the top.
2. Optionally check **Show the procedure**. The three steps then appear one at a time as you click the procedure panel, with a hint for the current card: the levels its verb suggests, and what the learner must actually do.
3. Drag the card into one of the six bins, or simply click a bin.
4. If the outcome is ambiguous and you chose its official or neighboring level, pick the reason that supports your placement.
5. Read the feedback: the highlighted verb, the official level, and the rationale. The bins show the official level and any defensible alternative.
6. Press **Next card** to continue, or **Restart** for a new shuffle. The score line counts correct, defensible and missed placements.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/bloom-objective-sorter/main.html"
        height="562px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers and learning-technology developers who classify objectives when designing MicroSims or courses (college undergraduate or professional development).

### Duration

20 minutes.

### Prerequisites

- The six Bloom levels and the Bloom verb table (Chapter 3)
- The three-step objective classification procedure (Chapter 3)

### Activities

1. **Model the procedure (4 min):** With **Show the procedure** checked, the instructor classifies the "Distinguish claims" outcome aloud, one step at a time.
2. **Sort with the procedure (8 min):** Learners sort the first twelve cards with the procedure shown, saying or writing step 2 for each card before dropping it.
3. **Sort without it (5 min):** Learners uncheck the procedure and sort the remaining cards.
4. **Debrief (3 min):** Which verbs misled you? Discuss the "Describe" and "State" cards, whose verbs point to a different level or to none.

### Assessment

- The learner places at least 20 of the 24 outcomes at the official or a defensible level.
- For three outcomes of the instructor's choice, the learner writes the three procedure steps, including a one-sentence reason for the final level.

## References

1. [Chapter 3: Learning Objectives and Bloom's Taxonomy](../../chapters/03-learning-objectives-and-blooms-taxonomy/index.md) - Bloom verbs and the objective classification procedure.
2. [Course description](../../course-description.md) - the source of all 24 learning outcomes.
3. [Bloom's taxonomy](https://en.wikipedia.org/wiki/Bloom%27s_taxonomy) - Wikipedia overview of the original and revised taxonomy.
4. [p5.js reference: mouseReleased()](https://p5js.org/reference/p5/mouseReleased/) - the event used to drop the card into a bin.
