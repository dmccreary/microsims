---
title: AI Generation Pipeline
description: A clickable flowchart that shows how an author's prompt, an AI agent, a skill, a large language model and automated checks work together to generate a MicroSim.
image: /sims/ai-generation-pipeline/ai-generation-pipeline.png
og:image: /sims/ai-generation-pipeline/ai-generation-pipeline.png
twitter:image: /sims/ai-generation-pipeline/ai-generation-pipeline.png
social:
   cards: false
quality_score: 100
---

# AI Generation Pipeline

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the AI Generation Pipeline Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This flowchart follows one request through the machinery that generates a MicroSim. The
**author** writes a prompt or request. The **AI agent** reads it, **loads** a **skill** (a
folder of instructions, guides and templates), **asks** a **large language model** for code,
receives the **code**, and **writes** the MicroSim files: HTML, JavaScript and metadata. The
files go to **automated checks**, and the dashed arrow carries **errors to fix** back to the
agent. The loop repeats until the checks pass.

Every box is clickable. The panel below the diagram then shows a plain-language definition and
one concrete example. Hovering a box highlights the arrows into and out of it, which makes the
agent's central role easy to see: it touches every arrow except the one from the files to the
checks. Clicking the dashed arrow explains why generated code must be tested.

**Learning objective:** The learner will explain the role of a prompt, a large language model,
a skill, and an agent in generating a MicroSim.

**Bloom's taxonomy level:** Understand (verb: *explain*)

## How to Use

1. Read the default panel for a one-paragraph overview of the pipeline.
2. Click each box in turn, starting with **Author writes a prompt or request**, and read its
   definition and example.
3. Hover over **AI agent** and count the highlighted arrows. Then hover over **Large language
   model** and compare.
4. Click the dashed **errors to fix** arrow (or its label) to see why the checks send work back
   to the agent.

On narrow screens the flowchart switches from left-to-right to top-to-bottom so the boxes stay
readable.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/ai-generation-pipeline/main.html"
        height="502px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development).

### Duration

10-15 minutes

### Prerequisites

- The definitions of generative AI, large language model, prompt, skill and agent from
  Chapter 1

### Activities

1. **Trace (4 min):** Click the boxes in the order a request travels. Write one sentence per
   box in your own words.
2. **Contrast (4 min):** Explain the difference between the prompt and the skill. Which one
   changes with every request, and which one is reused?
3. **Break the loop (4 min):** Imagine the dashed arrow is removed. Describe two defects from
   the Chapter 1 examples (for example, a ball that sinks through the floor or controls that
   vanish in a narrow window) that would then reach learners.
4. **Share (2 min):** Compare explanations with a partner and agree on which component
   actually writes the code.

### Assessment

- The learner explains in one sentence each what the prompt, the skill, the model and the
  agent contribute.
- The learner correctly states that the model writes code but does not run or test it, and
  that the agent runs the checks.
- The learner gives one reason, from the dashed arrow's panel, why generated code must be
  tested.

## References

1. [Large language model](https://en.wikipedia.org/wiki/Large_language_model) - Wikipedia.
   Background on the models that write MicroSim code.
2. [Prompt engineering](https://en.wikipedia.org/wiki/Prompt_engineering) - Wikipedia. How
   the wording of a request shapes a model's output.
3. [Intelligent agent](https://en.wikipedia.org/wiki/Intelligent_agent) - Wikipedia. The
   general idea of a program that perceives and acts in a loop toward a goal.
4. [Mermaid flowchart syntax](https://mermaid.js.org/syntax/flowchart.html) - Mermaid. The
   diagram language used here, including click directives.
