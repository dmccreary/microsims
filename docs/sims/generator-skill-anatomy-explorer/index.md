---
title: Generator Skill Anatomy Explorer
description: An explorer that traces which parts of the microsim-generator skill an agent reads for a request — the SKILL.md routing table, one reference guide, one template folder and the utility scripts — while every other guide stays grey.
image: /sims/generator-skill-anatomy-explorer/generator-skill-anatomy-explorer.png
og:image: /sims/generator-skill-anatomy-explorer/generator-skill-anatomy-explorer.png
twitter:image: /sims/generator-skill-anatomy-explorer/generator-skill-anatomy-explorer.png
social:
   cards: false
quality_score: 100
---

# Generator Skill Anatomy Explorer

<iframe src="main.html" height="562px" width="100%" scrolling="no"></iframe>

[Run the Generator Skill Anatomy Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The microsim-generator skill is not one file but a small folder with distinct parts. The **entry file** `SKILL.md` holds the procedure and the routing table. The **reference guides** in `references/` state the rules for one MicroSim family each. The **template assets** in `assets/templates/` are working files the agent copies structurally. The **utility scripts** in the separate `microsim-utils` folder do the deterministic steps. This MicroSim shows the four parts as a folder tree connected to a box labeled *Agent working context*, and lets you trace which parts actually enter that context for a given request.

**Learning objective:** The learner will differentiate the entry file, reference guides, template assets and utility scripts of the generator skill by tracing which parts an agent reads for a given request.

**Bloom level:** Analyze (L4). **Bloom verb:** differentiate.

The explorer pattern suits an Analyze objective: you compare what happens across six requests and notice which parts change (the guide and the template folder) and which never change (SKILL.md and the utilities). Every small square is one real file or folder from the skill:

- **references/** shows all 17 reference guides. One turns blue per request; the other 16 stay grey and never cost a token.
- **assets/templates/** shows the template folders. The counts of files in each folder are read from the `data.json` file in this MicroSim's folder. The dashed square is `assets/concept-classifier/`, which sits beside `assets/templates/` rather than inside it.
- **microsim-utils/** shows the six Python utilities. A single-MicroSim request runs four of them; `extract-sim-specs.py` and `add-iframes-to-chapter.py` are for chapter batches.

## How to Use

1. Choose a request from the **Request** list, for example "A bouncing ball simulation".
2. Press **Trace**. The four links light up and are numbered in the order the agent follows: 1 the SKILL.md routing table, 2 the one matching guide, 3 the matching template folder, 4 the utilities it runs. The *Agent working context* box lists what was loaded, and the counter shows how many of the 17 guides were loaded.
3. Hover over any box or square to see what it contains. Hovering a grey guide square shows its trigger words.
4. Click a highlighted box or a blue square to read one sentence on why the agent needs it for this request. Click a grey square to read why it is left out.
5. Choose a different request and press **Trace** again. Compare which squares change. Press **Reset** to clear the trace.

Try "A sorting quiz" last. No row of the keyword table contains the word "quiz", so the routing comes from the skill's decision tree instead — a good reminder that keyword routing is a first pass, not the whole method.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/generator-skill-anatomy-explorer/main.html"
        height="562px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development) who will invoke, debug or extend an AI generator skill.

### Duration

15 minutes

### Prerequisites

- Keyword routing and the MicroSim type catalog (Chapter 4)
- The idea of an AI skill and an agent (Chapter 1)
- The layout conventions of a MicroSim, such as `drawHeight` and `controlHeight` (Chapter 2)

### Activities

1. **Trace and record (5 min):** Trace all six requests. For each one, record the guide and the template folder that light up. Which parts light up the same way for every request?
2. **Differentiate (5 min):** In a two-column table, write what a *reference guide* gives the agent and what a *template asset* gives it. Use one of your traces as the example for each column.
3. **Predict a new request (3 min):** Without the MicroSim, predict which guide and template folder "A flowchart of the scientific method" would load, and why the other guides would stay grey. Check your answer against the trigger words shown when you hover the grey squares.
4. **Discuss (2 min):** Why does the skill keep the utility scripts in a separate folder that the agent runs but does not read?

### Assessment

- The learner can name the four parts of the skill and state what each contributes to the agent's working context.
- The learner can explain why only one of 17 guides is loaded for a single request, and what that saves.
- The learner can distinguish a rule stated in a guide from a pattern copied from a template.
- Exit question: "A generated sketch invents its own layout variables instead of `drawHeight`. Which part of the skill did the agent probably skip?"

## References

1. [Chapter 5: Generating MicroSims with AI Skills](../../chapters/05-generating-microsims-with-ai-skills/index.md) — the entry file, reference guides, template assets and utility scripts.
2. [Chapter 4: Choosing a MicroSim Type](../../chapters/04-choosing-a-microsim-type/index.md) — keyword routing and the decision tree that select a guide.
3. [p5.js createSelect() reference](https://p5js.org/reference/p5/createSelect/) — the built-in control used for the Request list.
4. [MDN: Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) — how the MicroSim reads its `data.json` file.
5. [Separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns) — Wikipedia article on the design principle behind splitting a skill into procedure, rules, examples and tools.
