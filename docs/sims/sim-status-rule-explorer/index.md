---
title: Sim Status Rule Explorer
description: Set the state of a MicroSim's files and predict the lifecycle status that extract-sim-specs.py assigns, then see the ordered rule that decided it.
image: /sims/sim-status-rule-explorer/sim-status-rule-explorer.png
og:image: /sims/sim-status-rule-explorer/sim-status-rule-explorer.png
twitter:image: /sims/sim-status-rule-explorer/sim-status-rule-explorer.png
social:
   cards: false
quality_score: 100
---

# Sim Status Rule Explorer

<iframe src="main.html" height="707px" width="100%" scrolling="no"></iframe>

[Run the Sim Status Rule Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The batch pipeline never asks a person where a MicroSim stands. Each time
`extract-sim-specs.py` runs with `--status-file`, it looks at the files on disk and derives
one of six statuses. This explorer lets you set those files yourself and watch the same rules
decide.

The rules are checked in order, and each one can only promote a sim that passed the one before:

| Order | Rule | Result |
|---|---|---|
| 1 | The spec's `**Status:**` line says Reused | `reused`, whatever the files say |
| 2 | No `docs/sims/<sim-id>/` directory | `specified` |
| 3 | The directory has `main.html` | `scaffolded` (without it, still `specified`) |
| 4 | A `.js` file with **more than 50** lines | `implemented` |
| 5 | `quality_score` in `index.md` front matter is **70 or higher** | `validated` |
| 6 | A chapter iframe embeds the sim | `deployed` |

The strip at the top shows the five statuses of the sequence and the separate `reused` box
(dashed). The **What is on disk** panel mirrors your settings as a file listing, using the
chapter's worked example `bouncing-ball-gravity-lab`. The **Rules, checked in order** panel
marks each rule green when it passes, orange for the rule that decided the result, and gray
for rules never reached. The box at the bottom states the result in one sentence, such as
"Score 62 is below 70, so not validated".

**Learning objective:** The learner will predict the status that the extraction script
assigns to a MicroSim given the state of its files, and will explain which rule produced
the result.

**Bloom's taxonomy level:** Apply (verb: *predict*)

## How to Use

1. Use the checkboxes and sliders to describe a sim's files: whether the directory and
   `main.html` exist, how many lines the `.js` file has, its quality score, whether the
   chapter has an iframe, and whether the spec says Reused.
2. Read the status in the strip and the rule that decided it.
3. Press **Predict first**. The result and the rule trace are hidden. Change the files if you
   like, then choose the status you expect, either by clicking a box in the strip or from the
   list next to the button.
4. The result is revealed with a check or cross on your choice, and the counter records how
   many of your predictions were right.
5. Try the chapter's worked example: directory, `main.html`, 120 lines, score 62 and an
   iframe. Predict first, then raise the score to 78 and predict again.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/sim-status-rule-explorer/main.html"
        height="707px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development).

### Duration

15 minutes

### Prerequisites

- The status lifecycle and the sim status file in Chapter 14
- What `quality_score` in an `index.md` front matter records (Chapter 13)

### Activities

1. **Worked example (4 min):** Reproduce the chapter's example (120 lines, score 62, iframe
   present). Explain why the iframe does not make it deployed.
2. **Prediction round (6 min):** In pairs, one learner sets the files and the other presses
   **Predict first** and predicts. Swap after five predictions. Include at least one case at
   exactly 50 lines and one at a score of exactly 70.
3. **Edge cases (5 min):** Find a setting in which the files look finished but the status is
   `reused`, and one in which a 300-line `.js` file is still `specified`. Write the rule that
   explains each.

### Assessment

- The learner predicts the correct status in at least four of five scenarios.
- For a wrong prediction, the learner names the rule that decided the real status.
- The learner explains why status is recomputed from the file system and how that makes a
  batch run resumable.

## References

1. [Finite-state machine](https://en.wikipedia.org/wiki/Finite-state_machine) - Wikipedia.
   A lifecycle of named states with rules for moving between them.
2. [YAML](https://en.wikipedia.org/wiki/YAML) - Wikipedia. The format of the `index.md` front
   matter that holds `quality_score`.
3. [p5.js createCheckbox() reference](https://p5js.org/reference/p5/createCheckbox/) - p5.js.
   The control used for the file checkboxes.
4. [p5.js createSlider() reference](https://p5js.org/reference/p5/createSlider/) - p5.js.
   The control used for the line count and the quality score.
