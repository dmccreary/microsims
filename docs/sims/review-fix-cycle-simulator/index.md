---
title: Review and Fix Cycle Simulator
description: Judge candidate patches against the smallest patch rule and decide when the three-cycle limit requires stopping and reporting.
image: /sims/review-fix-cycle-simulator/review-fix-cycle-simulator.png
og:image: /sims/review-fix-cycle-simulator/review-fix-cycle-simulator.png
twitter:image: /sims/review-fix-cycle-simulator/review-fix-cycle-simulator.png
social:
   cards: false
quality_score: 100
---

# Review and Fix Cycle Simulator

<iframe src="main.html" height="562px" width="100%" scrolling="no"></iframe>

[Run the Review and Fix Cycle Simulator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A layout review patches what the checklist flags, but two rules keep it honest. The **smallest patch rule** says to make the smallest change that resolves the defect, because a broad edit can fix one defect and create three. The **fix cycle limit** says to stop after three review-and-patch cycles and report what remains, because repeated tweaking usually signals a deeper problem that needs a person.

The mock screenshot starts with three FAIL items: 1.1 clipped row labels, 1.3 a residual text stroke and 3.1 a title running under the JSON panel. For each, the **Choose a patch** menu offers three candidates in mixed order:

- the **smallest correct patch**, which clears the defect and nothing else;
- an **over-broad patch**, which clears it but also changes an unrelated value and creates a new FAIL (2.2, 4.1 or 3.3);
- a **wrong-cause patch**, aimed at a different cause, which changes nothing visible.

Each **Apply patch and re-capture** redraws the screenshot, re-walks the checklist strip and uses one cycle. After the third cycle the simulator locks until you **Stop and report**. The report gives the final state (clean, partial or unfixed), counts defects fixed, new defects and cycles used, and explains every choice.

**Learning objective:** The learner will judge whether each proposed patch follows the smallest patch rule and decide when the fix cycle limit requires stopping and reporting.

**Bloom level:** Evaluate. **Bloom verb:** judge.

## How to Use

1. Pick a FAIL item in **Defect** (or click it in the checklist strip).
2. Read the three candidates in **Choose a patch**. Tick **Show hint from the fixes catalog** if you want the catalog entry.
3. Choose the patch you judge smallest and correct, then press **Apply patch and re-capture**.
4. Watch the screenshot, the strip and the log. Continue until everything passes or the three cycles are used.
5. Press **Stop and report** and read the explanations. Press **Reset** to try a different path.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/review-fix-cycle-simulator/main.html"
        height="562px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development).

### Duration

20 minutes

### Prerequisites

- Layout defects and the fixes table (Chapter 13)
- The layout reviewer's ten-step workflow (Chapter 13)

### Activities

1. **Judge before applying (8 min):** For each seeded defect, rank the three patches from best to worst and write one sentence of justification. Then run the cycles.
2. **Deliberate mistake (5 min):** Reset and apply one over-broad patch on purpose. Explain why a clean result is now impossible within three cycles.
3. **Ratchet (3 min):** Apply a wrong-cause patch. Relate it to the chapter's warning against widening the same number again.
4. **Report (4 min):** Write the report a reviewer would send after a partial run: files touched, defects with evidence, edits, final state.

### Assessment

- The learner reaches a clean state in three cycles using only smallest patches.
- The learner justifies why each rejected patch is over-broad or aimed at the wrong cause.
- Exit question: "After three cycles one FAIL remains. What do you do, and what goes in the report?"

## References

1. [Chapter 13: Quality Assurance and Automated Layout Review](../../chapters/13-quality-assurance-and-automated-layout-review/index.md) — layout review, the smallest patch rule and the fix cycle limit.
2. [Regression testing](https://en.wikipedia.org/wiki/Regression_testing) — Wikipedia article on re-checking after a change, the reason every patch is followed by a re-capture.
3. [p5.js noStroke() reference](https://p5js.org/reference/p5/noStroke/) — the smallest patch for a residual text stroke.
4. [p5.js textAlign() reference](https://p5js.org/reference/p5/textAlign/) — the smallest patch for a title that collides with a panel.
