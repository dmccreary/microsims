---
title: Quality Chain Workflow
description: A clickable flowchart of the quality chain that explains each step, the condition on every arrow, and the path a MicroSim takes after failing the height test.
image: /sims/quality-chain-workflow/quality-chain-workflow.png
og:image: /sims/quality-chain-workflow/quality-chain-workflow.png
twitter:image: /sims/quality-chain-workflow/quality-chain-workflow.png
social:
   cards: false
quality_score: 100
---

# Quality Chain Workflow

<iframe src="main.html" height="562px" width="100%" scrolling="no"></iframe>

[Run the Quality Chain Workflow MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Chapter 13 ends by putting its checks in order. The **quality chain** scores the MicroSim first, captures a screenshot at the iframe height, reviews the layout against the visual checklist, tests the iframe height and control visibility, and then applies the **quality gate**. A pass carries the MicroSim into the book; a failure sends it to be patched and back through the chain from the screenshot, because a patch can move a control. If the layout review is still failing after its third cycle, the MicroSim goes to a person.

Every box and every arrow in the flowchart is clickable. A box opens its definition, the tool and command that performs it, and the chapter section that explains it; hovering a box shows a one-line summary. An arrow opens the condition for taking it, such as *score below 85* or *third cycle reached*. **Trace a failure** walks, one step at a time, through the path of a MicroSim like the tester guide's predator-prey sample: it fails the height test at 697 px, is patched to 730 px, and passes the second time around.

**Learning objective:** The learner will explain the order of the quality chain, what each step checks, and what happens after a failure.

**Bloom level:** Understand. **Bloom verb:** explain.

## How to Use

1. Click any box to read what it checks, its command and the chapter section.
2. Click an arrow or its label to read the condition for taking it.
3. Press **Trace a failure**, then **Next step** to follow the MicroSim around the loop. Press **Clear** to reset.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/quality-chain-workflow/main.html"
        height="562px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development).

### Duration

15 minutes

### Prerequisites

- The quality score, screenshot capture, layout review and height tests (Chapter 13)

### Activities

1. **Explore (4 min):** Click every box and write one sentence per step: what it checks and which tool does it.
2. **Trace (5 min):** Run the failure trace. At each step, predict the next box before pressing Next step.
3. **Explain (4 min):** In pairs, explain why the loop returns to Capture screenshot rather than to Validate score, and why the cycle limit hands a MicroSim to a person.
4. **Order (2 min):** Explain the book's advice to repeat the height test last, using the chain.

### Assessment

- The learner lists the five checks in order and says what each one catches that the others miss.
- The learner describes the path after a height-test failure, including the patch and the re-capture.
- Exit question: "A MicroSim scores 90 but a button sits below the iframe edge. Where does the chain send it?"

## References

1. [Chapter 13: Quality Assurance and Automated Layout Review](../../chapters/13-quality-assurance-and-automated-layout-review/index.md) — the whole quality chain and the quality gate.
2. [Mermaid flowchart syntax: interaction](https://mermaid.js.org/syntax/flowchart.html#interaction) — the `click` directive and tooltip used on every node.
3. [Software quality assurance](https://en.wikipedia.org/wiki/Software_quality_assurance) — Wikipedia article on processes that check software before release.
4. [Headless browser](https://en.wikipedia.org/wiki/Headless_browser) — the program-controlled browser behind the screenshot and height steps.
