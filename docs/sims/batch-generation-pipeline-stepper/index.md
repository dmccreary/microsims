---
title: Batch Generation Pipeline Stepper
description: Step through the eight steps of a MicroSim batch run to tell the Python-script steps from the one AI-agent step and trace the files each step reads and writes.
image: /sims/batch-generation-pipeline-stepper/batch-generation-pipeline-stepper.png
og:image: /sims/batch-generation-pipeline-stepper/batch-generation-pipeline-stepper.png
twitter:image: /sims/batch-generation-pipeline-stepper/batch-generation-pipeline-stepper.png
social:
   cards: false
quality_score: 100
---

# Batch Generation Pipeline Stepper

<iframe src="main.html" height="642px" width="100%" scrolling="no"></iframe>

[Run the Batch Generation Pipeline Stepper MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A batch run of the `microsim-generator` skill turns every specification in a chapter into a
working MicroSim in eight fixed steps. Most of those steps have exactly one correct answer, so
small Python utilities do them. Only one step, writing each simulation's `.js` file, needs the
AI agent's judgment and code. This stepper makes that division visible.

Each rounded box is one step. The color and the small italic tag tell you who performs it:

| Color | Tag | Who does the step |
|---|---|---|
| Blue | script | A Python utility (or, for step 8, the `bk-capture-screenshot` shell script) |
| Orange | agent | The AI agent, writing `<sim-id>.js` |
| Gray | checkpoint | The instructional design checkpoint, a judgment recorded before any code exists |

Select a step and the panel shows the actor, the tool, one sentence about what the step does,
and two lists of document icons: the files the step **reads** and the files it **writes**.
Each input is labeled with the earlier step that produced it (or "from the author" for the
chapter text), and each output is labeled with the later steps that read it. Turn on
**Show files** to draw the same hand-offs as arrows between the boxes.

**Learning objective:** The learner will differentiate the steps that a Python utility
performs from the step that the AI agent performs, and will trace what each step reads and
writes.

**Bloom's taxonomy level:** Analyze (verb: *differentiate*)

## How to Use

1. Press **Next** and **Previous**, use the left and right arrow keys, or click any box to
   select a step. The counter in the control bar reads "Step N of 8".
2. Hover over a box to see a one-line tooltip with the step's purpose.
3. Read the panel: who acts, which tool runs, and which files go in and come out.
4. Check **Show files**. Green arrows come from the steps that wrote the files the selected
   step reads; purple arrows go to the later steps that read what it writes.
5. Try to predict, before you select a step, whether it is a script or the agent and which
   earlier step produced its inputs.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/batch-generation-pipeline-stepper/main.html"
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

- What a MicroSim directory contains (`main.html`, `index.md`, `metadata.json`, `<sim-id>.js`)
- The idea of a specification block from Chapter 5
- The batch pipeline list at the start of Chapter 14

### Activities

1. **Sort the actors (5 min):** Before touching the stepper, write "script", "agent" or
   "checkpoint" beside each of the eight steps in the chapter's list. Then step through the
   sim and correct your list.
2. **Trace a file (5 min):** Follow `ch-specs.json` from the step that writes it to every step
   that reads it. Repeat for `index.md` and notice that step 6 rewrites a file step 2 created.
3. **Explain the split (5 min):** In two sentences, explain why writing the `.js` file is the
   only step given to the agent, using the chapter's rule that a script should do everything
   that has one correct answer.
4. **Resume scenario (optional, 5 min):** A run stops after step 4. Using the panel, list the
   files that already exist and the step that will need each of them next.

### Assessment

- The learner labels all eight steps with the correct actor.
- For any step, the learner names at least one file it reads and the step that produced it.
- The learner explains why the design checkpoint writes no file yet still comes before step 4.

## References

1. [Pipeline (computing)](https://en.wikipedia.org/wiki/Pipeline_(computing)) - Wikipedia.
   The general idea of a sequence of stages in which each stage's output feeds the next.
2. [JSON](https://en.wikipedia.org/wiki/JSON) - Wikipedia. The format of the specification
   JSON and the sim status file.
3. [MkDocs](https://www.mkdocs.org/) - Official documentation for the static site generator
   whose `mkdocs.yml` navigation step 7 rewrites.
4. [p5.js bezier() reference](https://p5js.org/reference/p5/bezier/) - p5.js. The curve
   function used to draw the file hand-off arrows.
