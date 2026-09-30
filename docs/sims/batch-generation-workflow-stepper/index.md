---
title: Batch Generation Workflow Stepper
description: A step-through of the eight steps of the MicroSim generator skill's batch workflow that shows each step's command, input, output and lifecycle state, and why a script, the agent or a human does it.
image: /sims/batch-generation-workflow-stepper/batch-generation-workflow-stepper.png
og:image: /sims/batch-generation-workflow-stepper/batch-generation-workflow-stepper.png
twitter:image: /sims/batch-generation-workflow-stepper/batch-generation-workflow-stepper.png
social:
   cards: false
quality_score: 100
---

# Batch Generation Workflow Stepper

<iframe src="main.html" height="622px" width="100%" scrolling="no"></iframe>

[Run the Batch Generation Workflow Stepper MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The microsim-generator skill turns a chapter full of specification blocks into working MicroSims in eight steps. Six of those steps are done by Python scripts, one is the agent's single creative step (writing the JavaScript), and two are checkpoints where a person decides. This MicroSim lets you walk through the steps one at a time and see, for each one, the command or action, the file it reads, the file it writes, and the lifecycle state it leaves the MicroSim in (specified, scaffolded, implemented, validated or deployed).

**Learning objective:** The learner will explain what each step of the batch generation workflow does and why it is done by a script or by the agent.

**Bloom level:** Understand (L2). **Bloom verb:** explain.

Because the objective is at the Understand level, the MicroSim uses a step-through pattern with concrete data (real script names, real file names) and no continuous animation. The optional **Predict first** mode hides who does each step until you commit to a prediction, which turns reading into a test of your own explanation.

The color of each box tells you who does the work, and the word at the bottom of the box repeats it so that the meaning does not depend on color alone:

- **Steel blue — script.** Deterministic work that gives the same answer every run and costs no model tokens.
- **Orange — agent.** Writing the `.js` file, the only step that needs the language model's judgment.
- **Green — human checkpoint.** The instructional design checkpoint and the final layout review, where the skill stops and a person decides.

## How to Use

1. Read the lifecycle bar at the top. It shows the furthest state a MicroSim has reached after the selected step.
2. Press **Next** and **Previous** to move through the eight steps, or click any step box to jump to it.
3. Hover over a box to see a one-line purpose for that step.
4. Read the detail panel: the command or action, the input file, the output file, the lifecycle state, and the reason the step belongs to a script, the agent or a human.
5. Turn on **Predict first**. The boxes turn grey and the actor is hidden. For each step, read the purpose, input and output, then press **Script**, **Agent** or **Human** to predict who does it. The answer and the reason are revealed, and a running count of correct predictions appears at the bottom of the panel.
6. Press **Reset** to return to step 1 and clear your predictions.

Notice where the lifecycle state changes. It advances at steps 1, 2, 4 and 6, and stays put at the checkpoints. Step 6 moves the MicroSim to *validated*, and because step 5 already placed its iframe in the chapter, the status file then records it as *deployed*.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/batch-generation-workflow-stepper/main.html"
        height="622px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development) who will generate MicroSims with an AI agent.

### Duration

15 minutes

### Prerequisites

- The parts of a MicroSim folder: `main.html`, `index.md`, `metadata.json` and the `.js` file (Chapter 2)
- The instructional design checkpoint (Chapter 3)
- What a specification block is and what the generator skill does (Chapter 5)

### Activities

1. **Predict (4 min):** Turn on Predict first and predict the actor for all eight steps before reading any answers in detail. Record your score.
2. **Explain (6 min):** For each step you missed, read the "Why this actor" line. In one sentence each, explain why the step is deterministic or why it needs judgment.
3. **Trace the lifecycle (3 min):** With Predict first off, step through again and write down the lifecycle state after each step. Identify the two steps that change nothing in the status file and say what they contribute instead.
4. **Discuss (2 min):** Which step would cost the most tokens if the agent did it instead of a script? Which step would be riskiest to hand to a script?

### Assessment

- The learner can state, for any step, whether a script, the agent or a human does it and give a reason in terms of determinism or judgment.
- The learner can name the input and output file of each script step.
- The learner can explain why the skill reserves the language model for writing the JavaScript file.
- Exit question: "A colleague proposes letting the agent compute iframe heights by reading the sketch. What would be lost?"

## References

1. [Chapter 5: Generating MicroSims with AI Skills](../../chapters/05-generating-microsims-with-ai-skills/index.md) — the batch workflow, human in the loop, and lifecycle states this MicroSim models.
2. [Human-in-the-loop](https://en.wikipedia.org/wiki/Human-in-the-loop) — Wikipedia overview of designs in which a person reviews or decides inside an automated process.
3. [Worked-example effect](https://en.wikipedia.org/wiki/Worked-example_effect) — Wikipedia summary of why step-by-step examples help novices understand a procedure.
4. [p5.js createButton() reference](https://p5js.org/reference/p5/createButton/) — the built-in control used for Previous, Next, Reset and the prediction buttons.
5. [p5.js createCheckbox() reference](https://p5js.org/reference/p5/createCheckbox/) — the built-in control used for the Predict first option.
