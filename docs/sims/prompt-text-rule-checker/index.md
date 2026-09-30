---
title: Prompt Text Rule Checker
description: Judge each line of a draft image prompt as safe for a callout overlay or likely to put text into the image, then read why and see a safe rewrite for every risky line.
image: /sims/prompt-text-rule-checker/prompt-text-rule-checker.png
og:image: /sims/prompt-text-rule-checker/prompt-text-rule-checker.png
twitter:image: /sims/prompt-text-rule-checker/prompt-text-rule-checker.png
social:
   cards: false
quality_score: 0
---

# Prompt Text Rule Checker

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the Prompt Text Rule Checker MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

An image made for a callout overlay must follow the **text-free image rule**: no labels, no
numbers, no arrows, no callout lines and no title. The overlay engine draws every word and mark at
runtime from `data.json`, and image models add text whether or not you ask for it. The most
reliable defense is a prompt in which no line invites text.

This checker shows a draft `image-prompt.md` for an animal-cell overlay, one line per row. Each
run draws ten lines (eight on narrow screens) from a pool of sixteen, half safe and half risky, in
a new random order. Some judgments are easy, such as "Add the title Animal Cell across the top."
Others need care:

- "Format: PNG, 1200 x 900 px" contains numbers, but it describes the file, so it is safe.
- "This image must contain absolutely no text, labels, arrows or numbers" mentions text only to
  forbid it; it is the template's own Critical Rule.
- "Make it look like a labeled diagram from a biology textbook" never asks for a label, yet it
  invites labels by naming a labeled style, so it is risky.

After each judgment the row turns green (correct) or red (incorrect) and shows the line's true
class with a symbol, and the panel below the list explains why in one sentence. For a risky line,
**Show rewrite** gives a safe replacement that keeps the intent without inviting text. The score
counts correct judgments out of attempts; each line can be judged once per run.

**Learning objective:** The learner will judge whether a line of an image prompt is safe for a
callout overlay or violates the text-free image rule, and will justify the judgment.

**Bloom's taxonomy level:** Evaluate (verb: *judge*)

## How to Use

1. Click a line of the draft prompt to select it.
2. Before pressing a button, say or write why you think the line is safe or risky.
3. Press **Keeps image text-free** or **Risks text in image**. Compare your reason with the
   explanation in the panel.
4. For a risky line, press **Show rewrite** to see a safe replacement.
5. When every line is judged, press **New prompt** for a different draft.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/prompt-text-rule-checker/main.html"
        height="602px"
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

- The text-free image rule and the overlay image prompt template (Chapter 10, "Making the Image:
  Prompts and Rules")
- Callout labels and the overlay data file (Chapter 10, "The Callout Engine")

### Activities

1. **Judge with reasons (6 min):** Work through one draft. For each line, write a one-phrase
   reason before you press a button, then compare it with the explanation.
2. **Sort the hard cases (3 min):** List the lines you got wrong or hesitated on. For each,
   state the feature that made it tricky (numbers that describe the file, a rule that names text,
   a style that implies labels).
3. **Rewrite (4 min):** For two risky lines, write your own safe rewrite before pressing **Show
   rewrite**, then compare.
4. **Apply (2 min):** Press **New prompt** and aim for a perfect score on a fresh draft.

### Assessment

- The learner classifies new prompt lines as safe or risky with a correct one-sentence reason.
- The learner rewrites a risky line so that it keeps its visual intent but gives the model nothing
  to write.
- The learner explains why text belongs in `data.json` rather than in the image.

## References

1. [Text-to-image model](https://en.wikipedia.org/wiki/Text-to-image_model) - Wikipedia.
   Background on the image models that turn prompts into pictures.
2. [Prompt engineering](https://en.wikipedia.org/wiki/Prompt_engineering) - Wikipedia. General
   techniques for writing instructions to generative models, including image models.
3. [Web Content Accessibility Guidelines (WCAG) 2.1, Images of Text](https://www.w3.org/WAI/WCAG21/Understanding/images-of-text.html) -
   W3C. Why real text is preferred to text baked into images.
4. [p5.js mousePressed() reference](https://p5js.org/reference/p5/mousePressed/) - p5.js. The
   event used to select a line of the prompt.
