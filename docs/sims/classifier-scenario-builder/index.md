---
title: Classifier Scenario Builder
description: Write a concept-classifier scenario with a correct answer, three distractors, a hint and an explanation, watch the learner's quiz card update as you type, check its quality, export it as data.json and play it.
image: /sims/classifier-scenario-builder/classifier-scenario-builder.png
og:image: /sims/classifier-scenario-builder/classifier-scenario-builder.png
twitter:image: /sims/classifier-scenario-builder/classifier-scenario-builder.png
social:
   cards: false
quality_score: 100
---

# Classifier Scenario Builder

<iframe src="main.html" height="837px" width="100%" scrolling="no"></iframe>

[Run the Classifier Scenario Builder MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The **Concept Classifier Type** is the generator skill's sorting quiz: each question shows a
scenario and asks which **category bucket** it belongs to. All of its content lives in a
`data.json` file, one object per scenario, with these fields:

| Field | Holds |
|---|---|
| `id` | A number that identifies the scenario |
| `scenario` | The text to classify |
| `correctAnswer` | The one right category |
| `options` | The correct answer and three distractors |
| `explanation` | Why the answer is right, shown after answering |
| `hint` | A nudge that does not give the answer away |

This builder is a small **Builder MicroSim** for writing one such object. The form on the left
has the seven fields. The quiz card on the right is drawn as a learner would see it, with the
four options in shuffled order, and it updates as you type. Three buttons test the draft:

- **Check quality** flags an empty field, a correct answer that is missing or repeated among
  the options, an option far longer than the others (test-wise learners pick the longest), and
  a hint that repeats the answer. It also reminds you of the one check that strings cannot do:
  make sure **exactly one option is defensible**. Try to argue for each distractor; if one
  holds up, rewrite it, then tick the checkbox.
- **Show JSON** prints the scenario in the data.json shape, ready to copy.
- **Try as learner** makes the card playable: click an option, or use the hint first, and read
  the feedback and explanation a learner would see.

The **Start from** menu loads the chapter's example about symmetry fabrication, a **flawed
draft** with three planted problems, or a blank form. When the page is narrower than 700
pixels, the form and the preview stack, and the quality report and JSON take the preview's
place when you ask for them.

**Learning objective:** The learner will write a classifier scenario, four options, a hint
and an explanation, and will check that exactly one option is defensible.

**Bloom's taxonomy level:** Create (verb: *write*)

## How to Use

1. Choose **Start from: flawed draft** and press **Check quality**. Fix each flagged problem in
   the form and watch the checks update as you type.
2. Read the long distractor about image-model drift. Could an expert defend it for this
   scenario? If so, rewrite it into a clearly wrong but plausible option.
3. Press **Try as learner** and answer the card, once with the hint and once without.
4. Choose **Start from: blank form** and write your own scenario from the anti-patterns in
   Chapter 11. Press **Show JSON** when every check passes.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/classifier-scenario-builder/main.html"
        height="837px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development).

### Duration

20 minutes

### Prerequisites

- The Concept Classifiers and Sorting Quizzes section of Chapter 11
- The poster anti-patterns listed in Chapter 11 (symmetry fabrication, meta-source citation,
  round-trip marketing statistics, geographic misattribution, image-model number drift)

### Activities

1. **Repair (5 min):** Fix the flawed draft until every automatic check passes. Explain which
   fix mattered most for a learner.
2. **Write (10 min):** From a blank form, write two scenarios for different anti-patterns. Each
   distractor must name a real misconception, not a joke option.
3. **Swap and defend (5 min):** Trade JSON with a partner. Try as learner, then try to defend
   one of your partner's distractors. If you can, the partner rewrites it.

### Assessment

- Two scenarios that pass all automatic checks.
- A partner's written attempt to defend each distractor, and the author's response.
- The exported JSON, checked for the fields id, scenario, correctAnswer, options, explanation
  and hint.

## References

1. [Multiple choice - Wikipedia](https://en.wikipedia.org/wiki/Multiple_choice) - Background on
   item writing, including distractors and cues such as option length.
2. [JSON - Wikipedia](https://en.wikipedia.org/wiki/JSON) - The data format of the classifier's
   data.json file.
3. [p5.js createInput() reference](https://p5js.org/reference/p5/createInput/) - The builtin
   input used for the form's single-line fields.
4. [p5.js createElement() reference](https://p5js.org/reference/p5/createElement/) - Used to
   create the scenario and explanation text areas.
