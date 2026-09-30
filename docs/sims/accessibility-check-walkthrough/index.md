---
title: Accessibility Check Walkthrough
description: Run four human accessibility checks (keyboard-only completion, visible focus, text alternative and no color-only meaning) on three variants of a mock MicroSim, record a Pass or Fail verdict for each, and compare your verdicts with the built-in defects.
image: /sims/accessibility-check-walkthrough/accessibility-check-walkthrough.png
og:image: /sims/accessibility-check-walkthrough/accessibility-check-walkthrough.png
twitter:image: /sims/accessibility-check-walkthrough/accessibility-check-walkthrough.png
social:
   cards: false
quality_score: 100
---

# Accessibility Check Walkthrough

<iframe src="main.html" height="702px" width="100%" scrolling="no"></iframe>

[Run the Accessibility Check Walkthrough MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Automated tools catch mechanical accessibility failures such as low contrast, but they cannot
tell whether a description is useful or whether a keyboard user can finish the task. Chapter 24
adds four human steps to every accessibility check. This MicroSim lets you practice them on a
small mock simulation: a ball in a tall box, a **Gravity** slider and a **Drop** button. The
mock's task is "set Gravity to 1.0, then press Drop."

| Check | How to run it here | Related WCAG success criterion |
|---|---|---|
| 1. Keyboard-only completion | Turn on **Keyboard only** and finish the task with Tab, the arrow keys and Enter | 2.1.1 Keyboard |
| 2. Visible focus | While you press Tab, watch for a ring around the focused mock control | 2.4.7 Focus Visible |
| 3. Text alternative | Turn on **Show description** and read the text with the picture hidden | 1.1.1 Non-text Content |
| 4. No color-only meaning | Look for information that only a color carries | 1.4.1 Use of Color |

The mock comes in three variants. Each has defects built in on purpose; they are teaching
material, not findings about any real product. One variant passes every check. The other two
fail two checks each, and part of the exercise is finding out which ones by operating the mock,
not by guessing.

The MicroSim itself follows the checks it teaches. Every real control is a native, labeled form
element that you can reach with Tab and that shows a thick focus ring. The mock's own keyboard
handling listens only while the mock has focus, and Tab past its last control always leaves the
mock, so it never traps focus. Verdicts are shown as words as well as colors, text colors reach a
4.5 to 1 contrast ratio, and the `describe()` text is updated after every change. The results of
**Reveal answers** are also announced to screen readers.

**Learning objective:** The learner will judge whether a mock MicroSim passes each of four
accessibility checks and justify each verdict with the defect they found.

**Bloom's taxonomy level:** Evaluate (verb: *judge*)

## How to Use

1. Choose a mock in **Mock variant** (A, B or C).
2. Turn on **Keyboard only**. The mouse no longer works on the mock. Click the mock once, or
   press Shift+Tab until it has focus, then press **Tab** to move to its first control. Use the
   arrow keys to change Gravity and **Enter** to press Drop. Try to finish the task.
3. While you press Tab, notice whether you can always see which mock control has focus.
4. Turn on **Show description**. The picture is replaced by the text a screen reader would read.
   Decide whether the text alone tells you what is shown and what the controls do.
5. Look at the mock's status light while the ball falls and lands. Is anything shown by color
   alone?
6. Record a verdict for each check with the four buttons below the picture. Each press switches
   between Pass and Fail.
7. Press **Reveal answers**. Each matching verdict is marked; each mismatch is explained in one
   sentence. Then choose another variant.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/accessibility-check-walkthrough/main.html"
        height="702px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development).

### Duration

20-25 minutes

### Prerequisites

- The accessibility standards, keyboard operability and accessibility check sections of Chapter 24
- Using Tab, Shift+Tab, the arrow keys and Enter to operate a web page

### Activities

1. **Predict (3 min):** Before touching the mock, write which of the four checks you expect an
   AI-generated canvas sketch to fail most often, and why.
2. **Judge variant A (6 min):** Run all four checks and record verdicts. For every Fail, write one
   sentence naming the defect you observed (for example, "Tab went from Drop straight out of the
   mock").
3. **Judge variants B and C (8 min):** Repeat. Reveal answers only after all four verdicts for a
   variant are recorded, then re-test any mismatch until you can see the defect yourself.
4. **Repair plan (5 min):** For each defect you found, write the smallest change that would fix
   it in a p5.js sketch, such as replacing a drawn slider with `createSlider()` or adding a word
   next to a status light.

### Assessment

- The learner's verdicts match the built-in answers for all three variants, with at most one
  mismatch in total.
- Each Fail verdict is justified by an observed defect, not by a guess.
- The repair plan names a concrete, minimal fix for each defect.

## References

1. [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/TR/WCAG21/) - W3C. The
   book's stated target is level AA; checks 1 to 4 correspond to success criteria 2.1.1, 2.4.7,
   1.1.1 and 1.4.1, which WCAG 2.2 keeps.
2. [Understanding Success Criterion 2.4.7: Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html) -
   W3C WAI. Why keyboard users need to see where focus is.
3. [Understanding Success Criterion 1.4.1: Use of Color](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html) -
   W3C WAI. Why color must not be the only visual means of conveying information.
4. [describe()](https://p5js.org/reference/p5/describe/) - p5.js reference. The canvas text
   alternative used by MicroSims.
5. [Web Content Accessibility Guidelines](https://en.wikipedia.org/wiki/Web_Content_Accessibility_Guidelines) -
   Wikipedia. Background on the guidelines and their conformance levels.
