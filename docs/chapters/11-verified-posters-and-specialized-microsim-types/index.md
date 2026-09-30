---
title: Verified Posters and Specialized MicroSim Types
description: Explains how a fact-verified poster is planned, sourced, verified and audited, and how runnable labs, sorting quizzes, celebration effects, flash cards, editors and builders fit the specialized MicroSim types.
generated_by: claude skill chapter-content-generator
date: 2026-09-30 10:48:42
version: 1.10
---

# Verified Posters and Specialized MicroSim Types

## Summary

Covers fact-verified posters, in which every numeric claim is checked against a cited source, and the specialized types of runnable labs, sorting quizzes, flash cards and builders.

The chapter walks through claim planning, source discovery, verification and a render audit, then the interaction patterns for remembering and creating. After it, students can produce a verified poster and choose a specialized type.

## Concepts Covered

This chapter covers the following 17 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| Docker Python Lab Type | 3 |
| Concept Classifier Type | 3 |
| Celebration Effect Type | 2 |
| Flash Card MicroSim | 2 |
| Model Editor MicroSim | 2 |
| Runnable Code Block | 1 |
| Lab Sandbox | 1 |
| Sorting Quiz | 2 |
| Category Bucket | 1 |
| Reward Feedback | 1 |
| Builder MicroSim | 1 |
| Fact-Verified Poster | 6 |
| Claim Plan | 5 |
| Source Discovery | 4 |
| Claim Verification | 3 |
| Verification Report | 2 |
| Render Audit | 1 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 3: Learning Objectives and Bloom's Taxonomy](../03-learning-objectives-and-blooms-taxonomy/index.md)
- [Chapter 4: Choosing a MicroSim Type](../04-choosing-a-microsim-type/index.md)
- [Chapter 10: Image Overlays and Comparison Posters](../10-image-overlays-and-comparison-posters/index.md)

---

## Welcome

!!! mascot-welcome "Numbers You Can Defend"
    ![Bounce waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    An image model will happily print a statistic that no study ever produced, and readers cannot tell the difference. In this chapter you will learn a pipeline that makes every number on a poster traceable, plus the specialized MicroSims for running code, sorting scenarios and building things. Let's bounce it around!

## The Fact-Verified Poster

Chapter 10 showed how to turn a picture into an interactive MicroSim. It also introduced a poster whose printed words and numbers are the content, not decoration. When those numbers are empirical claims, such as a percentage improvement in test scores, a new risk appears: the numbers may simply be wrong. A **Fact-Verified Poster** is a static poster whose every numeric claim has been traced to a cited source and a quoted passage before any pixel is rendered, with the trail of evidence saved beside the image.

The verified-infographic guide in the generator skill motivates this with one observed session, not a measured error rate. In a one-shot poster about biophilic design (design that brings nature into buildings), the guide reports that 8 of 10 numeric claims were unsupported by the cited sources and 2 of 5 citations were fictional or misattributed. Once wrong text is baked into an image it cannot be edited, so the guide moves all fact-checking into plain text and calls the image model only after the content is locked. Its core principles are to separate facts from pixels, to gather evidence before composing a layout, to bake nothing unverified into the image, and to keep an audit trail.

This route also differs from every MicroSim type so far. It writes a poster image and its audit files to `docs/posters/<slug>/` and skips the usual scaffold, script and iframe pipeline. Two standing policies gate it, both introduced in Chapter 4. A static image is rendered only when a person specifically asked for one, and any rendered poster is then wrapped in a grid overlay, so a reader's hovers and quiz answers can produce interaction events.

The guide organizes the work as eight phases plus the overlay step. Before the diagram, note the phase names: claim planning, source discovery, verification, a user checkpoint, a layout specification, prompt assembly, rendering and a post-render audit. The overlay wrap is a ninth step.

#### Diagram: Verified Poster Pipeline Explorer

<details markdown="1">
<summary>Verified Poster Pipeline Explorer</summary>
Type: diagram
**sim-id:** verified-poster-pipeline-explorer<br/>
**Library:** vis-network<br/>
**Status:** Specified

Learning objective (Bloom level: Understand; verb: sequence): The learner will sequence the nine steps of the verified poster route, and will explain which step is the mandatory human checkpoint and which step alone calls the image model.

Nodes and edges: nine nodes in a left-to-right chain, labeled "1 Claim plan", "2 Source discovery", "3 Verification", "4 User checkpoint", "5 Layout spec", "6 Prompt assembly", "7 Render", "8 Render audit", "9 Overlay". A dashed backward edge from "8 Render audit" to "7 Render" is labeled "drift found, up to 3 retries". A bracket labels nodes 1 to 4 "reusable on their own". The "4 User checkpoint" node is orange and the "7 Render" node is purple.

Interactions: clicking a node opens an information panel with a two-sentence description, the file it writes (for example 01-claim-plan.yaml for step 1), and the question "What goes wrong if this step is skipped?". Hovering an edge shows what passes along it. A "Skip a step" toggle greys out one node and shows the failure the guide anticipates, such as unverified numbers reaching the prompt.

Responsive design: the network re-fits to the container width on every window resize, and the information panel moves below the network when the width is under 600 pixels.

Implementation: vis-network with fixed positions, physics disabled, and click and hover handlers.
</details>

## Planning the Claims

The first phase produces a **Claim Plan**, a structured list of the 5 to 10 factual claims a poster must make, written before anyone searches for a source. For each claim the guide records the subject, the metric type (percentage, count, range or qualitative descriptor), the polarity (positive, negative or neutral outcome) and the desired prominence (hero number, supporting statistic or footnote). The plan is saved as `01-claim-plan.yaml` from a template in the skill.

The plan also flags comparisons that invite *symmetry bias*, the temptation to invent a matching statistic for the weaker side of a "versus" layout so the columns look balanced. The guide tells the author to state this up front: the versus side may end up with less data, and the pipeline will not invent numbers to balance it. Asymmetric layouts are allowed.

A **worked example** shows the shape of a plan. Suppose a teacher requests a printable poster comparing two kinds of lighting, as in Chapter 4. The YAML below is a hypothetical fragment that follows the template's field names. Read `metric_type` as the kind of number expected and `prominence` as how large it will print. Notice that no values appear yet, because finding them is the next phase.

```yaml
poster:
  slug: led-vs-incandescent
  comparison_structure:
    type: versus
    symmetry_warning: true
claims:
  - claim_id: energy_use
    subject: "electricity used for the same light output"
    metric_type: percentage
    prominence: hero
  - claim_id: bulb_lifetime
    subject: "rated lifetime of a bulb"
    metric_type: range
    prominence: supporting
```

!!! mascot-thinking "Plan the Question, Not the Answer"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    A claim plan records what the poster wants to say, not a number you already believe. Ask of each claim: could a reviewer say "that is, or is not, supported by source X"? If not, narrow it until they could.

## Finding and Verifying Sources

**Source Discovery** is the phase that finds candidate sources for each planned claim. The guide requires at least two independent web searches per claim, with different phrasings. For each candidate the author records the title, authors, year, publisher or journal, URL and a quoted sentence that directly supports the claim. Sources are preferred in this order: peer-reviewed articles, systematic reviews and meta-analyses, government reports, and named institutional studies with authors. The guide rejects blog posts that cite unnamed studies, marketing pages and vendor whitepapers, statistics with no traceable primary paper, and social media posts. Wikipedia may point to primary sources but is never the sole source.

**Claim Verification** compares each claim with what the sources actually say and sorts it into one of four buckets. The table summarizes the buckets and what each does to the poster.

| Bucket | Meaning | On the poster |
|---|---|---|
| VERIFIED | A specific number matches a specific paper, with a quoted passage | Use the exact number |
| DIRECTIONAL | The direction of an effect is well established but the number differs across studies | Use a range or the best-supported single study |
| QUALITATIVE-ONLY | The effect is supported but not reliably quantified | Use a word such as "lower", with no invented percentage |
| REJECTED | No credible source | Remove it, or replace it with a verified claim on a related subject |

The guide adds an abort rule: if more than 20 percent of planned claims are rejected, stop and tell the user that the topic may not support the original framing. Its anti-patterns explain what verification catches. They include meta-source citation (citing a review as if it produced a specific percentage), round-trip marketing statistics with no primary paper, geographic misattribution, and image-model number drift.

!!! mascot-warning "A Review Is Not the Origin of a Number"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Watch out for citing a review paper as the source of a specific percentage. It synthesizes other studies, so the number belongs to one of them. Trace the percentage to the primary study, or downgrade the claim to DIRECTIONAL or QUALITATIVE-ONLY.

The results go into the **Verification Report**, saved as `02-verification-report.md`. It lists every planned claim with its classification, final value, final phrasing, citation, URL, quoted passage and the search queries used, followed by a list of fabrication risks detected and a recommended final claim set. The report is also the artifact for the mandatory user checkpoint. The guide says to show the user every original claim and its verdict and to wait for explicit approval, and it calls this the most important safety checkpoint. No layout or rendering happens before approval.

The guide's template gives a worked example of a QUALITATIVE-ONLY entry. A claim that nature exposure lowers cortisol (a stress hormone) is supported by a 2019 meta-analysis whose quoted conclusion is that forest bathing can significantly reduce cortisol in the short term. Because that study reports no single percentage suitable for a headline, the poster says "significant reduction" and prints no number. The lesson generalizes: a missing number is a legitimate output, and inventing one to fill the space is the failure the pipeline exists to prevent.

Try the classification yourself in the following specification, which uses only the four buckets defined above.

#### Diagram: Claim Bucket Sorter

<details markdown="1">
<summary>Claim Bucket Sorter</summary>
Type: microsim
**sim-id:** claim-bucket-sorter<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Evaluate; verb: classify): The learner will classify evidence records for a planned claim as VERIFIED, DIRECTIONAL, QUALITATIVE-ONLY or REJECTED, and will justify each choice from the quoted passage and the source type.

Data: 12 invented practice records, each with a claim, a source type (peer-reviewed article, meta-analysis, marketing page, blog post citing unnamed studies), a quoted passage, and a correct bucket. The records are illustrative practice items and contain no real statistics.

Layout: a card in the upper left shows the current record. Four labeled bucket regions run across the bottom. A side panel shows the four bucket definitions.

Interactions: the learner drags the card into a bucket. Feedback appears at once and names the rule that decides the case (for example "a marketing page with no primary paper cannot verify a number"). A "Show rule" button reduces the score by half, and a summary screen lists missed records by pattern.

Responsive design: the canvas width follows the container width on window resize, the buckets reflow into a two-by-two grid under 500 pixels, and the height is a fixed constant.

Implementation: p5.js with drag handling, a data.json file of records, and a describe() call for accessibility.
</details>

## Rendering, Auditing and Wrapping

Once the claims are approved, three phases build the poster. The layout specification (`03-layout-spec.yaml`) declares every text element, and each factual element must carry a `source_id` from the report, or the element is marked as non-factual design such as a title. The prompt phase then composes the image prompt directly from the layout, copying numbers verbatim and instructing the model to leave out any text it cannot render legibly. The single image-model call renders `poster.png`. This is the same verbatim text prompt idea from Chapter 10, now fed by verified content.

A **Render Audit** is the final check. Claude reads the rendered image and confirms that every number in the layout appears correctly, that every author, year and institution is spelled as in the source list, that no unexpected rows or statistics were hallucinated, and that no approved row is missing. If drift appears, the guide logs the mismatch, regenerates and audits again, with a cap of three regeneration attempts before escalating to the user. The audit then produces `sources.md`, a reader-facing citation list that makes the poster independently checkable.

The guide sets targets for the process: every numeric claim traces to a URL and quoted passage, no citation is fictional or misattributed, and post-render drift stays below 5 percent. These are design targets from the guide, not measured results from this book.

!!! mascot-tip "Reuse the Verified Claims"
    ![Bounce giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Phases 1 to 4 stand alone. If an interactive chart or table needs real numbers, run those four phases, then carry each `source_id` into the MicroSim's data file, and skip the image entirely.

Finally the poster is wrapped in a grid overlay, following Chapter 10. The guide's steps set `showLabels` to false because the poster already prints its column titles, and carry each claim's `source_id` into the zone facts so the citation appears on hover. It also asks for quiz questions on the key claims. The reason given is measurement: a flat image emits nothing, while zones and quiz answers can become events. Whether those events reveal understanding is a hypothesis for Chapters 16 to 19, and nothing here has been measured on learners.

## Specialized Types for Assessment and Practice

The remaining concepts are specialized MicroSim types, each suited to a narrow interaction. Three have dedicated guides in the generator skill: runnable Python labs, sorting quizzes and celebration effects. The others (flash cards, editors and builders) are interaction patterns that Chapters 3 and 4 tied to Bloom levels, and the skill has no dedicated guide for them. Each section says which case applies.

### Runnable Code Blocks and the Lab Sandbox

A **Runnable Code Block** is a page element that shows editable source code with Run and Reset buttons and an output area, so a learner can execute the code in place. The **Docker Python Lab Type** is the generator skill's version for Python: real Python, with the full standard library, runs on a local service. The **Lab Sandbox** is the isolated place where that code executes. The guide states that each run happens in a fresh, isolated Docker container reached through a local HTTP service on port 5001, so one learner's code cannot leave state behind for the next run.

Before the markup, know what its parts mean. Each lab on a page needs a unique *suffix*, a short string such as `1` that is appended to every element ID so the script can find the matching editor, buttons and output. The Run button calls `runDocker` with that suffix, and Reset calls `resetDocker`. Both functions come from `docker-lab.js`, and the styling comes from `docker-lab.css`. This is the guide's standard lab, with the Python starter code inside the `textarea`.

```html
<div id="docker-lab-1">
<div id="docker-editor-1">
<textarea id="docker-code-1" spellcheck="false">print("Hello, World!")
</textarea>
<div id="docker-buttons-1">
  <button id="docker-run-1" onclick="runDocker('1')">&#9654; Run</button>
  <button id="docker-reset-1" onclick="resetDocker('1')">&#8635; Reset</button>
</div>
<pre id="docker-output-1" class="docker-output">Output will appear here after you click Run.</pre>
</div>
</div>
```

The guide lists practical constraints. Starter code should be short (5 to 15 lines) and should print something. It should avoid `input()`, since the runner has no standard input, and file input and output, since the container keeps no files. Third-party imports fail unless the container image has them, and the guide says the image, `python:3.11-alpine`, ships only the standard library. The page must tell the reader to start the service first with `bash scripts/run-python-docker.sh`, and the guide notes that `docker-lab.css`, `docker-lab.js` and that script must exist in the project.

#### Diagram: Docker Lab Run Flow

<details markdown="1">
<summary>Docker Lab Run Flow</summary>
Type: diagram
**sim-id:** docker-lab-run-flow<br/>
**Library:** vis-network<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: diagnose): The learner will diagnose why a lab fails to run by identifying which part of the path from browser to container is missing.

Nodes and edges: five nodes in a row, "Lab page (textarea, Run, Reset)", "docker-lab.js", "Local service on port 5001", "Fresh Docker container (Lab Sandbox)" and "Output area". Arrows show "code sent", "container started", "text returned" and "output displayed".

Interactions: clicking a node shows its role and one thing that can break it. A "Break it" menu offers three failures: service not started, script missing from mkdocs.yml, and a starter program that calls input(). Choosing one turns the failing node red and shows the symptom, and the fix ("run bash scripts/run-python-docker.sh, then reload the page" for the first).

Responsive design: the row wraps into a column under 600 pixels, and the network re-fits to the container on every window resize.

Implementation: vis-network with fixed positions, click handlers and a scenario menu.
</details>

### Concept Classifiers and Sorting Quizzes

A **Sorting Quiz** shows a learner a scenario and asks which category it belongs to. The **Concept Classifier Type** is the generator skill's p5.js implementation. Each question presents a scenario with typically four answer options, a hint system that lowers the score when used, an explanation shown after each answer, and a score display with a final performance screen. A **Category Bucket** is one of the categories a scenario can be sorted into. In the guide's implementation the buckets appear as the answer options, each with a short description stored under `categoryDescriptions`.

All content lives in a `data.json` file, which keeps the p5.js logic reusable across subjects. In the fragment below, `scenario` is the text to classify, `correctAnswer` is the right bucket, `options` are the choices, and `hint` and `explanation` support the learner. The guide's sample configuration awards 10 points for a correct answer and 5 with a hint. The categories here come from the poster anti-patterns above.

```json
{
  "id": 1,
  "scenario": "A poster's left column lists five statistics with citations, and the right column lists five mirror-image statistics with no source.",
  "correctAnswer": "Symmetry fabrication",
  "options": ["Symmetry fabrication", "Meta-source citation", "Geographic misattribution", "Image-model number drift"],
  "explanation": "The right column invents figures to balance the layout, which the pipeline forbids.",
  "hint": "Ask whether every number on one side has a source."
}
```

Good scenarios demonstrate one category clearly, and good distractors are plausible errors that represent common misconceptions, according to the guide. It targets 15 to 30 scenarios per quiz and 4 to 8 categories, and draws a random subset (10 by default) for each attempt.

The guide states that the format primarily addresses the Apply level of Bloom's taxonomy, while Chapter 4 mapped sorting quizzes to Evaluate. These are compatible once you look at the scenario: naming a textbook example of a category is Apply, and judging an ambiguous case against criteria is closer to Evaluate. State the level you intend when you write the scenarios.

!!! mascot-thinking "Every Wrong Option Is a Diagnosis"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    A distractor earns its place by matching a real misconception. When a learner picks it, you learn *which* confusion they have, and that is more useful than a plain wrong mark.

#### Diagram: Classifier Scenario Builder

<details markdown="1">
<summary>Classifier Scenario Builder</summary>
Type: microsim
**sim-id:** classifier-scenario-builder<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Create; verb: write): The learner will write a classifier scenario, four options, a hint and an explanation, and will check that exactly one option is defensible.

Layout: a form on the left with fields scenario, correctAnswer, three distractors, hint and explanation, and a live preview of the quiz card on the right, drawn as the learner would see it.

Interactions: typing updates the preview at once. A "Check quality" button flags an empty field, a correct answer missing from the options, an option far longer than the others, and a hint that repeats the answer. A "Show JSON" button displays the scenario in the data.json shape above, and a "Try as learner" button plays the card.

Responsive design: the form and preview stack vertically under 700 pixels, and the canvas width follows the container on every window resize.

Implementation: p5.js with DOM inputs, simple string checks and a describe() call.
</details>

### Celebration Effects and Reward Feedback

**Reward Feedback** is a visible response given when a learner does something right, such as a correct answer. A **Celebration Effect Type** is the generator skill's p5.js particle animation that delivers it. Each effect is a self-contained JavaScript file with a unique particle array and four standard functions: one to create the effect, one to update and draw it each frame, one to report whether it is active, and one to clear it. Effects accept a `speedMultiplier` where 0.5 is slow, 1.0 medium and 1.8 fast, and the guide names motion patterns such as burst up, float up, fall down, explode out, zoom across and pop.

Treat the reward as a design decision with a cost. A celebration draws attention, so it belongs after a milestone the learner has earned and should stay brief. The guide's motivation is feedback for young learners, and it does not report evidence on how celebrations affect learning, so this chapter makes no such claim.

### Flash Cards, Model Editors and Builders

A **Flash Card MicroSim** presents question and answer pairs for memorization and recall practice, following this book's glossary. It suits Remember-level objectives, as Chapter 3 explained, because it demands exact retrieval and gives immediate feedback. Recall is a weak indicator of deeper mastery, so a flash card alone should not be claimed to show more than recall. This repository contains a flashcards page in `docs/sims/flashcards`, but its content is a sample project-decomposition prompt rather than a model of the pattern.

A **Model Editor MicroSim** and a **Builder MicroSim** serve Create-level objectives. In this book's usage, a model editor lets the learner change the parts or rules of a model and observe the result, and a builder lets the learner assemble something from parts. Chapter 3 said such tools should leave the learner free to choose, instead of pouring work into a rigid template, and graded work needs a rubric. The generator skill has no dedicated guide for either, so they are custom p5.js work chosen through Chapter 4's routing. The scenario builder above is a small example of a builder.

The table summarizes the specialized types and how to choose among them.

| Type | Bloom level it suits | Route in the skill | Interaction |
|---|---|---|---|
| Flash Card MicroSim | Remember | No dedicated guide | Flip to reveal an answer |
| Sorting Quiz (Concept Classifier Type) | Apply, or Evaluate for ambiguous cases | Concept classifier guide | Choose a category for a scenario |
| Docker Python Lab Type | Apply and Create with code | Docker Python lab guide | Edit and run code |
| Model Editor MicroSim, Builder MicroSim | Create | No dedicated guide | Change or assemble parts |
| Celebration Effect Type | Not an assessment | Celebration guide | Particle reward after success |

## Putting It All Together

Consider a course on lighting that needs a printable comparison poster and a practice quiz. The author writes a claim plan, searches for sources, classifies each claim, and takes the verification report to the instructor. After approval the poster is rendered, audited and wrapped in a grid overlay. The same claim set then feeds a concept classifier whose categories are the poster's claims and their common misreadings, with a celebration effect on a correct streak. One verified set of facts serves three products, and each numeric statement still traces to a source.

## Chapter Summary

!!! mascot-celebration "You Can Defend Every Number"
    ![Bounce celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now take a poster from a claim plan through source discovery, four-bucket verification, a user checkpoint and a render audit, and choose the specialized type that fits a learning goal. Every bounce leaves evidence, and now your posters do too.

The key ideas of this chapter are:

- A fact-verified poster traces every numeric claim to a cited source and quoted passage before rendering, and keeps the audit trail in the poster folder.
- A claim plan lists 5 to 10 claims with metric type and prominence, and it warns in advance about symmetry bias in versus layouts.
- Source discovery uses at least two independent searches per claim and prefers peer-reviewed and government sources over marketing pages.
- Claim verification sorts claims into VERIFIED, DIRECTIONAL, QUALITATIVE-ONLY and REJECTED, and a missing number is an acceptable result.
- The verification report is the artifact for a mandatory user checkpoint, and the render audit compares the finished image with the layout, with at most three regeneration attempts.
- Every rendered poster is then wrapped in a grid overlay so its regions can produce interaction events, and whether those events show understanding is still a hypothesis.
- A runnable code block runs Python in a fresh Docker lab sandbox, and it needs the local service running.
- A sorting quiz, built as a concept classifier from a data file, sorts scenarios into category buckets and suits Apply or Evaluate depending on scenario difficulty.
- Reward feedback through a celebration effect should follow earned milestones, while flash cards suit Remember and model editors and builders suit Create.

The next chapter turns to width-responsive design and iframe heights, so that every type in this part of the book fits the page that embeds it.
