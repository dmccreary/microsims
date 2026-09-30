---
title: Generation Failure Mode Triage
description: Diagnose eight defective AI-generated MicroSims by matching each symptom and simulated console message to one of six generation failure modes, its cause and its first repair.
image: /sims/generation-failure-mode-triage/generation-failure-mode-triage.png
og:image: /sims/generation-failure-mode-triage/generation-failure-mode-triage.png
twitter:image: /sims/generation-failure-mode-triage/generation-failure-mode-triage.png
social:
   cards: false
quality_score: 100
---

# Generation Failure Mode Triage

<iframe src="main.html" height="612px" width="100%" scrolling="no"></iframe>

[Run the Generation Failure Mode Triage MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

AI-written MicroSim code fails in recognizable patterns. This triage exercise presents eight defective MicroSims, one at a time. Each case shows a written symptom and a small picture of the defective sim with the defect visible, and it can reveal a simulated browser console message. The learner matches the case to one of the six failure modes from the Chapter 5 table: hallucinated API, library version drift, control in drawing area, non-responsive canvas, wrong iframe height, and text with an outline.

After **Check**, the sim names the cause and the first repair. For a wrong pick it also explains what evidence would have told the two modes apart, for example that a hallucinated API throws an error for a function no release ever had, while version drift involves a call that was real in another release.

**Learning objective:** The learner will distinguish generation failure modes by matching a described symptom to its most likely cause and first repair.

**Bloom level:** Analyze (L4). **Bloom verb:** distinguish.

## How to Use

1. Read the case heading and the **Symptom**, and study the picture of the defective MicroSim.
2. Optionally press **Show console** to reveal the simulated browser console. A clean console is evidence too: layout defects rarely throw errors.
3. Hover over a failure-mode card to read its definition, then click the card you think fits.
4. Press **Check**. The sim marks the correct card in green and a wrong pick in red, and explains the cause, the first repair and what tells the modes apart.
5. Press **Next case** to continue. The score line counts only correct first tries. After all eight cases, a new round starts in shuffled order.

The eight cases, console messages and answers are stored in `data.json`. Every interaction (viewing a case, opening the console, selecting a card, checking an answer) passes through one function, `logInteraction()`, which records the event and dispatches a `microsim-interaction` browser event, so Chapter 17 can attach xAPI statements without changing the rest of the sketch. When pasting the sketch into the p5.js editor, upload `data.json` too.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/generation-failure-mode-triage/main.html"
        height="612px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers and learning-technology developers who review AI-generated MicroSim code (college undergraduate or professional development).

### Duration

15-20 minutes

### Prerequisites

- The failure-mode table in Chapter 5 and the sections on hallucinated APIs, library version drift and the p5.js 2.x migration
- The MicroSim layout of Chapter 2: drawing region, control region, `drawHeight` and the iframe height rule

### Activities

1. **Triage without the console (5 min):** Work through the first four cases using only the symptom and the picture. Record your choice and confidence before pressing Check.
2. **Triage with the console (5 min):** For the next four cases, open the console first. Note which cases the console settled and which it could not, because the console was clean.
3. **Pairs that look alike (5 min):** In pairs, list the two modes you confused most often and write one sentence of evidence that separates them, such as "fullscreen fine, chapter clipped" for wrong iframe height versus non-responsive canvas.
4. **Debrief (3 min):** Connect each first repair to the five-move debugging process in Chapter 5: reproduce, read the console, classify, repair the smallest thing, retest.

### Assessment

- The learner scores at least six of eight correct first tries on a second round.
- Given a new symptom description, the learner names the most likely failure mode and justifies it with one piece of evidence.
- The learner explains why a clean console points away from a hallucinated API.

## References

1. [Hallucination (artificial intelligence)](https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)) - Background for the hallucinated API failure mode.
2. [p5.js compatibility add-ons for 1.x sketches](https://github.com/processing/p5.js-compatibility) - The p5.js project's notes and add-ons for code written for 1.x, the source of most version drift in this book.
3. [p5.js createSlider() reference](https://p5js.org/reference/p5/createSlider/) - The documented call that the invented `createRangeSlider` imitates.
4. [p5.js noStroke() reference](https://p5js.org/reference/p5/noStroke/) - The first repair for text with an outline.
5. [Debugging](https://en.wikipedia.org/wiki/Debugging) - Wikipedia overview of the reproduce-isolate-fix process.
