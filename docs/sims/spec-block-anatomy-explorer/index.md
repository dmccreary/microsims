---
title: Specification Block Anatomy Explorer
description: An explorer that breaks a MicroSim specification block into its eight fields, runs a simulated extraction that marks missing fields in red, and asks you to trace a generated defect back to the field that caused it.
image: /sims/spec-block-anatomy-explorer/spec-block-anatomy-explorer.png
og:image: /sims/spec-block-anatomy-explorer/spec-block-anatomy-explorer.png
twitter:image: /sims/spec-block-anatomy-explorer/spec-block-anatomy-explorer.png
social:
   cards: false
quality_score: 100
---

# Specification Block Anatomy Explorer

<iframe src="main.html" height="612px" width="100%" scrolling="no"></iframe>

[Run the Specification Block Anatomy Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Every MicroSim in this book starts as a **specification block**: a structured passage in a chapter that describes one interactive element completely enough for an agent to build it. The block has a fixed skeleton — heading, type, sim-id, library, status, learning objective, body and implementation — and tools such as `extract-sim-specs.py` read exactly those fields. When a field is missing or vague, the agent has to guess, and the guess shows up later as a defect in the generated MicroSim.

This MicroSim draws a specification block as a stack of labeled bands. The **Extract** button runs a simulated extraction that uses the same kind of patterns a parser uses (for example, a heading must begin `#### Diagram:` or `#### Drawing:`, and the objective must contain `Bloom level:` and `verb:`), then lists the fields found and marks missing ones in red. **Show defects** reverses the direction: it describes a defect in a generated MicroSim and asks which band caused it.

**Learning objective:** The learner will deconstruct a specification block into its fields and identify which field a given generation defect traces back to.

**Bloom level:** Analyze (L4). **Bloom verb:** deconstruct.

The three example specifications are stored in this MicroSim's `data.json` file:

- **1. Complete specification** — the Pendulum Period Explorer from Chapter 5, with every field present and exact numbers for ranges, steps, defaults and sizes.
- **2. Missing a Bloom verb** — the objective names a level but no verb, and uses the unmeasurable word "understand".
- **3. No numeric ranges** — the body names two sliders but gives no ranges, steps or defaults.

## How to Use

1. Hover over any band to read the definition of that field.
2. Choose an example from **Example spec** and press **Extract**. The panel lists what a parser finds. Missing fields are shown in red, and the band they come from turns red.
3. Click a band to highlight the fields extracted from it.
4. Turn on **Show defects**. A yellow card describes a defect in a generated MicroSim. Click the band you think caused it. A correct choice turns the band green and explains the link; a wrong choice turns it red, says what that band actually decides, and gives a hint.
5. Press **Next defect** to try another of the eight defects. Change the example spec to see how its missing field shows up in the extraction.

On a narrow screen the bands show one line each, and the panel lists only the fields of the band you click.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/spec-block-anatomy-explorer/main.html"
        height="612px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development) who will write specification blocks for AI-generated MicroSims.

### Duration

20 minutes

### Prerequisites

- Writing a measurable learning objective with a Bloom level and verb (Chapter 3)
- Choosing a MicroSim type and library (Chapter 4)
- The MicroSim folder and its `sim-id` directory name (Chapter 2)

### Activities

1. **Deconstruct (5 min):** With example 1, hover each band and write a one-line job description for each of the eight fields in your own words.
2. **Extract and compare (5 min):** Press Extract on all three examples. For each example that has a red field, write down what the agent will have to guess.
3. **Trace defects (7 min):** Turn on Show defects and work through all eight defects. Record your first-try score and, for each miss, the band you chose and why it was wrong.
4. **Repair (3 min):** Rewrite the objective of example 2 and the Controls sentence of example 3 so that nothing is left for the agent to guess.

### Assessment

- The learner can name the eight fields of a specification block and state what each one decides.
- The learner can predict which field a parser will report missing, given a flawed block.
- The learner can trace at least six of the eight defects to the correct field on the first try.
- Exit question: "A generated MicroSim uses a slider from 0 to 10 when you needed 0.1 to 1.0. Which field do you fix, and what exactly do you write?"

## References

1. [Chapter 5: Generating MicroSims with AI Skills](../../chapters/05-generating-microsims-with-ai-skills/index.md) — the specification block, its fields and the extraction script.
2. [Chapter 3: Learning Objectives and Bloom's Taxonomy](../../chapters/03-learning-objectives-and-blooms-taxonomy/index.md) — why the objective needs a measurable Bloom verb.
3. [Software requirements specification](https://en.wikipedia.org/wiki/Software_requirements_specification) — Wikipedia article on writing specifications complete enough to build from.
4. [MDN: Regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions) — the pattern-matching technique the simulated extraction uses.
5. [p5.js createSelect() reference](https://p5js.org/reference/p5/createSelect/) — the built-in control used for the Example spec list.
