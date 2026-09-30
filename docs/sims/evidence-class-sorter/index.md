---
title: Evidence Class Sorter
description: Assign each interaction in a mock MicroSim to one of the seven evidence classes, name the deciding question, and compare what Full and Compact modes record for it.
image: /sims/evidence-class-sorter/evidence-class-sorter.png
og:image: /sims/evidence-class-sorter/evidence-class-sorter.png
twitter:image: /sims/evidence-class-sorter/evidence-class-sorter.png
social:
   cards: false
quality_score: 100
---

# Evidence Class Sorter

<iframe src="main.html" height="762px" width="100%" scrolling="no"></iframe>

[Run the Evidence Class Sorter MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Every interaction in a MicroSim belongs to exactly one evidence class, or it is not evidence at
all. The class decides what the runtime records. This MicroSim shows a mock MicroSim with a
gravity slider, Start/Pause and Reset buttons, a bouncing ball, a three-node diagram, a checked
prediction and a browser tab bar. Next to it is the seven-question decision list from
Chapter 16, asked in order until the first yes:

1. Does it check a response against a right answer? Then it is assessment.
2. Does it change a numeric parameter continuously? Then it is a continuous parameter.
3. Does it start or stop time passing? Then it is run and pause.
4. Is it a one-shot action such as Reset? Then it is a discrete press (class 3a).
5. Is it looking at, opening, selecting or pinning something? Then it is discrete inspection.
6. Does the MicroSim have no Run control at all? Then add page dwell.
7. Did the program fire the event rather than the learner? Then it is not evidence.

After you place an element in a bin, the infobox highlights the deciding question and shows the
statement Full mode would emit, such as one `interacted` per deadband step for the slider. Check
**Compact mode** to see the folded summary fields instead: counts, minimum, maximum, last value
and reversals for the slider, or run time plus a press touch for Start/Pause. An assessment is
the one class the toggle leaves unchanged, because answers are never folded. Focus loss is not
reached by the seven questions at all: the runtime handles it itself.

**Challenge** presents eight described events, such as "the pointer crosses the diagram in 300
milliseconds", to classify with a score.

**Learning objective:** The learner will distinguish the evidence classes by assigning each
interaction in a described MicroSim to its class and explaining the deciding question.

**Bloom's taxonomy level:** Analyze (verb: *distinguish*)

## How to Use

1. Click an element of the mock MicroSim, or choose it in the **Item** list. It is outlined in
   gold.
2. Walk down the decision list and stop at the first yes. Hover a bin to read its definition.
3. Click that bin, or choose it in the **Bin** list and press **Assign** (keys **1** to **7**
   also work). The infobox names the deciding question and the Full-mode statement.
4. Check **Compact mode** and compare what the fold keeps. Try it on the checked prediction.
5. Press **Challenge** to classify eight new events. Press **Next event** after each one.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/evidence-class-sorter/main.html"
        height="762px"
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

- The three MicroSim verbs (`answered`, `experienced`, `interacted`)
- The evidence class table and the seven-question decision list (Chapter 16)
- The meaning of Full and Compact mode

### Activities

1. **Explore (6 min):** Classify all seven elements of the mock MicroSim. For each one, say the
   deciding question number before you choose a bin.
2. **Compare the modes (4 min):** For the slider, Start/Pause and the checked prediction, write
   what Full mode emits and what Compact mode keeps. Explain why the prediction is unchanged.
3. **Challenge (6 min):** Classify the eight challenge events. For the two events that are not
   evidence, name the reason: a threshold or a program-fired event.

### Assessment

- The learner classifies at least 7 of the 8 challenge events correctly.
- For any interaction, the learner names the first decision-list question that answers yes.
- The learner explains why a Reset press belongs with run and pause as class 3a and why focus
  loss is handled by the runtime rather than by the author.

## References

1. [Experience API](https://en.wikipedia.org/wiki/Experience_API) - Wikipedia. The xAPI standard whose statements the evidence classes produce.
2. [xAPI Specification, Part Two: Experience API Data (version 1.0.3)](https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md) - ADL. Statement structure, including `result.success` and `result.duration`.
3. [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) - MDN. The `visibilitychange` event the runtime uses to detect focus loss.
4. [p5.js createCheckbox() reference](https://p5js.org/reference/p5/createCheckbox/) - p5.js. The control used for the Compact toggle.
