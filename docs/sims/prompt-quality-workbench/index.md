---
title: Prompt Quality Workbench
description: Toggle the six clauses of a MicroSim generation prompt and see which decisions each omission hands to the model and which generation failure modes it makes more likely.
image: /sims/prompt-quality-workbench/prompt-quality-workbench.png
og:image: /sims/prompt-quality-workbench/prompt-quality-workbench.png
twitter:image: /sims/prompt-quality-workbench/prompt-quality-workbench.png
social:
   cards: false
quality_score: 100
---

# Prompt Quality Workbench

<iframe src="main.html" height="657px" width="100%" scrolling="no"></iframe>

[Run the Prompt Quality Workbench MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A generation prompt is strongest when every clause removes one decision from the model. This workbench assembles a prompt from a one-line request plus six clauses, each shown as a card: names the skill, points to the specification, pins the library version, limits the output files, states the layout, and gives a tie-breaking rule. The wording follows the structured prompt in Chapter 5.

Beside the cards, the panel **Decisions left to the model** lists every decision the current prompt no longer makes. Each open decision is tagged with its risk for the chosen request and linked to the generation failure modes from Chapter 5 that it makes more likely, such as library version drift when the version pin is missing. The links are a teaching heuristic, and the panel says so in its footnote.

**Learning objective:** The learner will critique a prompt by identifying which decisions it leaves to the model and which failure modes those open decisions make more likely.

**Bloom level:** Evaluate (L5). **Bloom verb:** critique.

## How to Use

1. Choose a request in the **Scenario** dropdown. The three requests grow in difficulty: a one-slider bouncing ball, the pendulum period explorer from Chapter 5, and a two-panel projectile lab with a live chart.
2. Turn clauses on and off with the six checkboxes, or click a clause card. The cards show the assembled prompt, and the summary line counts its clauses and words.
3. Read the panel. Each open decision shows a risk tag (HIGH, MED, LOW) for the current request and the failure modes it makes more likely. The panel sorts the open decisions from highest to lowest risk and suggests which one to close first.
4. Hover over a card to see an example of that clause and why it matters.
5. Press **Reset** to return to the starting prompt, which leaves the version pin, the output-file limit and the tie-breaking rule off.

The clauses, decisions, risk levels and failure modes are stored in `data.json` in this folder, so an instructor can edit them without touching the sketch. When pasting the sketch into the p5.js editor, upload `data.json` too.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/prompt-quality-workbench/main.html"
        height="657px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers and learning-technology developers who generate MicroSims with an AI skill (college undergraduate or professional development).

### Duration

15-20 minutes

### Prerequisites

- The specification block and prompt design sections of Chapter 5
- The table of generation failure modes in Chapter 5 (hallucinated API, library version drift, control in drawing area, non-responsive canvas, wrong iframe height, text with an outline)

### Activities

1. **Predict (3 min):** With the default prompt on the medium scenario, predict which open decision is most dangerous before reading the panel. Compare your answer with the panel's "Close first" line.
2. **Strip it down (5 min):** Turn every clause off, leaving only the request. Read the six open decisions, then turn clauses back on one at a time in the order you think matters most for the hard scenario. Record your order.
3. **Compare requests (5 min):** Keep the same clauses and switch between the three scenarios. Note which risk tags change and explain why a missing clause matters more for a two-panel lab than for a one-slider sketch.
4. **Critique a real prompt (5 min):** Write down a prompt you have used, or one from a colleague. Mark which of the six clauses it contains, set the workbench to match, and list the failure modes you should test for first.

### Assessment

- Given a prompt with two clauses missing, the learner names both open decisions and at least one linked failure mode for each.
- The learner justifies which missing clause to add first for a given request, citing the request's difficulty.
- The learner explains why the links between open decisions and failure modes are a heuristic rather than a guarantee.

## References

1. [Prompt engineering](https://en.wikipedia.org/wiki/Prompt_engineering) - Wikipedia overview of structuring instructions for language models.
2. [Hallucination (artificial intelligence)](https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)) - Background for the hallucinated API failure mode.
3. [Bloom's taxonomy](https://en.wikipedia.org/wiki/Bloom%27s_taxonomy) - The Evaluate level that this MicroSim targets.
4. [p5.js createCheckbox() reference](https://p5js.org/reference/p5/createCheckbox/) - The control used for each clause.
5. [p5.js createSelect() reference](https://p5js.org/reference/p5/createSelect/) - The control used for the Scenario dropdown.
