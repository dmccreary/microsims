---
title: Choose the Type Challenge
description: A 19-card challenge in which you justify the MicroSim type for each learning objective by choosing a type and a reason, spot ambiguous objectives that need a clarifying question, and recognize when an existing MicroSim should be reused.
image: /sims/choose-the-type-challenge/choose-the-type-challenge.png
og:image: /sims/choose-the-type-challenge/choose-the-type-challenge.png
twitter:image: /sims/choose-the-type-challenge/choose-the-type-challenge.png
social:
   cards: false
quality_score: 100
---

# Choose the Type Challenge

<iframe src="main.html" height="702px" width="100%" scrolling="no"></iframe>

[Run the Choose the Type Challenge MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Chapter 4 ends with a promise: after it, you can justify the choice of a MicroSim type for any objective. This challenge puts that promise to the test. Each card shows one learning objective with its Bloom level and verb highlighted. You choose the type that should teach it and the reason that decided it — the **data shape**, the **verb and level**, a **keyword**, or an **existing MicroSim** found in a catalog search. Feedback gives the reference type and the reasoning straight away.

Two kinds of cards need more than a type:

- **Ambiguous cards** (four of them) fit two types about equally well, such as the Roman Empire objective where a map and a timeline both score within ten points. The right response is **Not sure: ask a question**, which reveals the one clarifying question that would separate the two types.
- **Reuse cards** show a catalog search result. When the similarity is at or above 0.75 *and* the existing MicroSim's verb and level fit, the right reason is **existing MicroSim**. One card is a trap: the topic matches but the verb does not, so it should not be reused.

**Learning objective:** The learner will justify the choice of a MicroSim type for a given objective by selecting a type and a reason, and will recognize when routing is ambiguous or when reuse is preferable.

**Bloom level:** Evaluate (L5). **Bloom verb:** justify.

The twelve type buttons cover the types discussed in Chapter 4: p5.js, Chart.js, Plotly, Mermaid, vis-network, causal loop, Venn, vis-timeline, Leaflet map, comparison table, image overlay (callout or grid) and verified poster. The reference answers are the chapter's own worked examples and the author's teaching judgments, not output of the generator skill.

## How to Use

1. Read the objective card. Notice the highlighted Bloom verb and the level chip.
2. Click a **Type** button, then a **Reason** button. As soon as you have both, the feedback panel shows whether you were right, the reference type and reason, and a short explanation. The reference type turns green; a wrong choice turns red.
3. If two types fit equally well, press **Not sure: ask a question** instead. On ambiguous cards this is the correct response, and the candidate types turn yellow.
4. Press **Next** for the next card. The running score counts correct choices out of attempts; a choice is correct when both the type and the reason match.
5. After the last card, **Next** shows a summary of the pairs of types you confused most often. Press **Reset** to start again.

On wide screens a panel beside the feedback defines the four reasons.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/choose-the-type-challenge/main.html"
        height="702px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development) who will choose MicroSim types for their own objectives.

### Duration

20 to 25 minutes

### Prerequisites

- Classifying an objective by Bloom level and verb (Chapter 3)
- The MicroSim type catalog, the routing rubric and routing ambiguity (Chapter 4)
- The reuse-versus-build thresholds (Chapter 4)

### Activities

1. **Individual pass (10 min):** Work through all 19 cards once without looking back at the chapter. Record your score and the summary of confusions.
2. **Justify in writing (5 min):** Pick the two cards you got wrong that surprised you most. For each, write one sentence that justifies the reference type using the data shape or the verb, and one sentence explaining why your choice scores lower.
3. **Pair discussion (5 min):** Compare the clarifying questions for the four ambiguous cards. Write a fifth ambiguous objective of your own and the question that would resolve it.
4. **Reuse check (3 min):** Explain why the "label the forces" card should not reuse the Bouncing Ball Gravity Lab even though its similarity score is above 0.75.

### Assessment

- The learner selects the reference type (or an acceptable alternative) with a matching reason on at least 12 of the 15 unambiguous cards.
- The learner presses "Not sure" on at least three of the four ambiguous cards and can state the clarifying question.
- The learner can explain the difference between a topic match and an objective match when deciding to reuse.
- Exit question: "Two candidate types score 78 and 72 for your objective. What do you do next, and why?"

## References

1. [Chapter 4: Choosing a MicroSim Type](../../chapters/04-choosing-a-microsim-type/index.md) — the type catalog, routing rubric, routing ambiguity and the reuse-versus-build decision.
2. [Bloom's taxonomy](https://en.wikipedia.org/wiki/Bloom%27s_taxonomy) — Wikipedia overview of the six levels used on each card.
3. [Learning object](https://en.wikipedia.org/wiki/Learning_object) — Wikipedia article on reusable learning objects, the idea behind the reuse cards.
4. [p5.js createButton() reference](https://p5js.org/reference/p5/createButton/) — the built-in control used for every type, reason and action button.
