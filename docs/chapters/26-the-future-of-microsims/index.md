---
title: The Future of MicroSims
description: Separates the near-term, evidence-backed roadmap for MicroSims from speculative long-term ideas about AI-designed simulations that predict mastery more trustworthily.
generated_by: claude skill chapter-content-generator
date: 2026-09-30 11:43:14
version: 1.10
---

# The Future of MicroSims

## Summary

Looks ahead: near-term work over the next year, and the long-term prospect of AI generating MicroSims that are fun to use and better able to predict whether a student has mastered a concept.

Students see the roadmap for verified adapters, an end-to-end path from sim to store, and closed-loop generation, then diagnostic interaction design, adaptive difficulty and guess-resistant probes. They finish with the open problems of trust, validity and equity.

## Concepts Covered

This chapter covers the following 14 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| Near-Term Roadmap | 14 |
| Verified Adapters | 1 |
| End-to-End POST Path | 1 |
| Closed-Loop Generation | 2 |
| Automated Layout Repair | 1 |
| Shared Sim Libraries | 1 |
| Long-Term Vision | 8 |
| Diagnostic Interaction Design | 2 |
| Adaptive Difficulty | 1 |
| Guess-Resistant Probes | 1 |
| Fun and Engagement | 1 |
| Learning From Aggregate Data | 1 |
| Trustworthy Prediction | 2 |
| Open Research Problems | 1 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: What Is a MicroSim](../01-what-is-a-microsim/index.md)
- [Chapter 13: Quality Assurance and Automated Layout Review](../13-quality-assurance-and-automated-layout-review/index.md)
- [Chapter 14: Batch Generation from Specifications](../14-batch-generation-from-specifications/index.md)
- [Chapter 15: Metadata, Search and Reuse](../15-metadata-search-and-reuse/index.md)
- [Chapter 17: Instrumenting MicroSims with the xAPI Runtime](../17-instrumenting-microsims-with-the-xapi-runtime/index.md)
- [Chapter 18: Mastery Prediction and Knowledge Tracing](../18-mastery-prediction-and-knowledge-tracing/index.md)
- [Chapter 19: Evaluating the Predictive Fidelity of the xAPI Stream](../19-evaluating-the-predictive-fidelity-of-the-xapi-stream/index.md)
- [Chapter 20: The Full LRS: Architecture and Ingestion](../20-the-full-lrs-architecture-and-ingestion/index.md)
- [Chapter 21: The Full LRS: Dashboards, Operations and Compliance](../21-the-full-lrs-dashboards-operations-and-compliance/index.md)
- [Chapter 24: Pedagogy, Accessibility and Ethics](../24-pedagogy-accessibility-and-ethics/index.md)
- [Chapter 25: Capstone: Building an Instrumented MicroSim Portfolio](../25-capstone-building-an-instrumented-microsim-portfolio/index.md)

---

## Welcome

!!! mascot-welcome "Where Do the Bounces Go Next?"
    ![Bounce waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    You have built, checked, instrumented and defended a portfolio, so now you get to look up from the workbench. Let's bounce it around! This chapter shows you which improvements are close enough to plan for this year and which are ideas you can test but should not yet trust, so you can decide where your own effort belongs.

A chapter about the future invites overclaiming, and this book has a rule against it. Every item below carries one of three labels. **Built** means working code exists and a check has run. **Designed** means a written design exists but the piece is unbuilt or unproven. **Hoped for** means a plausible idea with no design and no data, which is the label for everything in the long-term half of the chapter. No learner data has been collected through MicroSims yet, so no claim here about predicting mastery is an established result. Each long-term idea therefore comes with the test that could confirm or refute it.

## The Near-Term Roadmap

The **near-term roadmap** is the set of improvements planned for about the next year. Each one traces to a written source: the [MicroSims 2.0 plan](../../appendices/microsims-2-plan.md), which lists them as the short-term part of this chapter's description, or the open work list of the `learning-record-store` repository, whose `TODO.md` is dated 2026-09-26. An item that cannot point to one of those sources does not belong on a near-term roadmap. It belongs in the long-term section, where the labels are different.

Five near-term items matter most for this book. Each is a gap between something the earlier chapters described and something a reader can run end to end today.

| Item | Gap it closes | Label today |
|------|---------------|-------------|
| Verified adapters | Some libraries have no proven instrumentation recipe | Partly built |
| End-to-end POST path | No emitter sends statements to a store | Designed, partly built |
| Closed-loop generation | Quality checks run after generation, not inside it | Designed |
| Automated layout repair | Layout fixes are a manual review procedure | Designed |
| Shared sim libraries | Runtime copies and posters can drift apart across books | Partly built |

The sections below take the items in the order a dependency would force them: first what the emitters can instrument, then where the statements go, then how generation and repair improve, then how sharing scales.

#### Diagram: Roadmap Status Board

<details markdown="1">
<summary>Roadmap Status Board</summary>
Type: infographic
**sim-id:** roadmap-status-board<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: distinguish): The learner will distinguish what is built, designed and hoped for among the near-term and long-term items by opening each item and reading its source and its test.

Layout: a drawing region above a control region, following the standard MicroSim layout. The drawing region is aliceblue and holds two horizontal lanes of rounded cards, "Near term (about one year)" on top and "Long term (speculative)" below. The control region is white and silver-bordered.

Data: fourteen cards. The five near-term items from the table above and the five long-term ideas covered later in this chapter (fun and engagement, diagnostic interaction design, guess-resistant probes, adaptive difficulty, learning from aggregate data), plus the open problem areas of privacy, validity, equity and evaluation. Card color encodes the label: steel blue for built, amber for designed, grey with a dashed border for hoped for.

Interactions: hovering a card shows a one-line tooltip with its label. Clicking a card opens an information panel on the right with the source it traces to (a plan section or a TODO item), the test that would show it worked, and the main way it could fail. Near-term cards show the source; long-term cards show "no source: speculative" and a required test.

Controls:

- Checkboxes "Built", "Designed", "Hoped for" (all on by default) to filter cards by label
- Button "Quiz me" that hides the colors and asks the learner to place five random cards into the correct label, then reveals the answers

Responsive design: the canvas width follows the container width on every window resize, cards reflow to two columns under 600 pixels, and the information panel moves below the lanes at that width.

Implementation: p5.js with card rectangles hit-tested in mousePressed and a describe() call for accessibility.
</details>

### Verified Adapters

A **library adapter**, introduced in Chapter 17, tells an author where to hook a specific library so that clicks, hovers and control changes become xAPI statements. An adapter is **verified** only after a pilot simulation has passed the shared quality check, `check-xapi.py`, in the real book that contains it. The `add-xapi-events-to-microsim` skill records each adapter's status in its `SKILL.md` table, and the **verified adapters** item of the roadmap is simply to move every row of that table to verified.

The table records a mixed picture. The p5.js adapters for DOM controls and for canvas click and predict interactions are verified, as are the Mermaid and plain HTML adapter, the image-overlay adapter, the chapter quiz page and Chart.js. The vis-timeline adapter is verified for item click, hover and stepping but not for zoom and pan. The p5.js canvas adapter is unverified for drags. The vis-network, Plotly and Leaflet adapters are unverified, each waiting on a named pilot simulation. The skill's own notes put the scale in context: a grep of roughly 5,000 simulations in sibling repositories on 2026-09-26 found about 3,580 using p5.js, 531 using vis-network, 304 using Chart.js, 96 using vis-timeline, 48 using Leaflet and 10 using Plotly. Verifying vis-network therefore matters far more than verifying Plotly.

A worked example shows why a pilot is required. The Leaflet adapter warns that `zoomend` and `moveend` also fire when code calls `setView`, so a naive listener would record a student interaction that the student never performed. No amount of reading the library documentation would have confirmed that such events fire and get filtered correctly. A pilot that drives the map headlessly and counts statements does confirm it. The adapter stays unverified until that run exists.

### The End-to-End POST Path

The **end-to-end POST path** is the complete route from a MicroSim's emitter, through the gateway and processor, into the store that holds statements. Chapter 20 describes it as a design. The honest status, recorded in the `learning-record-store` TODO, is that the pieces exist unevenly. The gateway exists: it validates statements against the producer contract with 17 tested reject paths, enforces all-or-nothing batches, and was smoke-tested by writing to Kafka. The runtime file `lrs-xapi.js` has a `transport` seam, a place where sending code can plug in, and deliberately contains no network call. No emitter POSTs anything, and the store table of statements still held zero rows when the TODO was written.

The TODO lists the next steps in a fixed order: build the processor that turns raw statements into stored rows, build the identity service that holds each district's salt, and only then teach the emitters to POST. The order matters because a salt invented early would make the privacy boundary look tested when it is not. The roadmap item is complete when a statement typed in a browser can be found in the store, and the test is exactly that round trip, with a positive control proving the probe can see writes.

### Closed-Loop Generation

**Closed-loop generation** means the generator runs its own quality checks and acts on the result before it hands over a MicroSim. Today the pipeline is open: Chapter 14's batch scripts generate and scaffold, and the Chapter 13 gate and layout review run afterward, usually as separate steps. The plan's roadmap asks for QA and vision review to run inside the generator, so that a failed height test or a clipped control is seen by the same process that can fix it.

The idea is sound but unmeasured. A reasonable test counts, over a fixed batch of specifications, how many MicroSims pass the quality gate on first delivery with and without the loop, and how many fix cycles each needs. If the loop raises the first-pass rate without raising cost or hiding defects the geometric checks cannot see, it has earned its place.

!!! mascot-thinking "An Open Loop Leaks Quality"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Think of a thermostat that never reads the room's temperature. Generation without checking inside the loop behaves the same way, because nothing pushes the output back toward the standard.

### Automated Layout Repair

**Automated layout repair** is the part of the loop that fixes defects rather than only finding them. Chapter 13 already defines the repair procedure for a person or an agent: walk the visual checklist, apply the smallest patch that fixes each defect, and stop after a **fix cycle limit** of three. The roadmap item automates that procedure so a detected defect, such as a control that falls below the iframe edge, triggers a patch and a recheck without a person in between.

The limits from Chapter 13 still apply and become more important with automation. The height and control visibility tests see only the bottom edge, so an automated repair can satisfy the test while a defect elsewhere remains. The smallest patch rule keeps an unattended repair from rewriting a working sketch, and the cycle limit keeps it from looping. A test for this item compares defects remaining after automated repair against defects remaining after human review on the same set of MicroSims.

### Shared Sim Libraries

A **shared sim library** is a body of simulation code, posters or runtime files used by more than one book from a single maintained source. The idea has a working piece and an open problem. The working piece is the xAPI runtime: it is identical in every book, and only `lrs-config.js` differs. A checking script reports drift.

The plan's risk list names the open problem directly: the `lrs-*.js` files are copied into each book, so copies can fall out of sync, and the same question applies to shared poster libraries such as the `diagram.js` file vendored from another repository. The script below reports whether a book's runtime files are missing or differ from the canonical copy. Its `--book` flag names the book root, and `--check` makes it report only, exiting with status 1 if anything is missing or drifted.

```bash
python3 ~/projects/ibook-skills/skills/add-xapi-events-to-microsim/scripts/install-runtime.py \
  --book . --check
```

Combined with the Chapter 15 catalog, which held 3,764 records from 90 repositories, this points at the near-term goal: reuse search across books that finds an existing MicroSim, plus a drift check that keeps embedded copies current. The plan also lists showcase-quality animation and per-concept mastery dashboards in this near-term group. Those items depend on the items above and on real data respectively, so they are noted here without a section of their own.

!!! mascot-warning "Do Not Copy Without a Drift Check"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A runtime file copied once and never compared will eventually differ from the canonical copy, and two books will then emit slightly different statements. Run the check before each release, and ask the book's owner before using `--force`, because a book may pin an older runtime on purpose.

## The Long-Term Vision

The **long-term vision** is the plan's statement that AI could eventually generate MicroSims that are both fun to use and better at telling whether a learner has mastered a concept. Nothing in this section is built, and no design document specifies it. It is hoped for. The paper's conclusion lists similar directions, namely adaptive difficulty, learning analytics integration, collaborative simulations and immersive technologies. This chapter keeps the first two because they serve the book's core question and leaves the others out, because they do not bear on whether events predict mastery.

The vision has four parts, and each is stated as a hypothesis with a test. The tests reuse Chapter 19's protocol: a held-out assessment, a base-rate baseline, calibration and a sample-size plan.

### Fun and Engagement

**Fun and engagement** describe a learner's willingness to keep interacting with a MicroSim voluntarily. The hypothesis is that a MicroSim can be both enjoyable and diagnostic. Chapter 25 already drew the warning line: engagement is what learners do, learning is what they know, and the stream measures only the first. A MicroSim that is fun but produces noise is worse for prediction than a dull one that is clean.

The test is a controlled comparison of two versions of one MicroSim, one plain and one playful. Measure time on task and return visits for engagement, and a held-out assessment for learning. Fun helps only if assessment scores hold or rise while engagement rises.

### Diagnostic Interaction Design

**Diagnostic interaction design** is choosing the interaction first for the evidence it yields about a concept and second for its appeal. Chapter 18 called the evidence value of a single observation its diagnostic value. The TODO states the design principle briefly: instrument the act you designed, and do not infer from the act you did not. The Chapter 1 gravity lab specification already points this way, since its "Predict first" checkbox makes the learner commit to an answer before seeing the result, which produces an answered statement instead of a bare exposure.

An AI generator could be asked to do this systematically: for every learning objective, propose at least one interaction whose outcome separates learners who know the concept from those who do not. The test is interaction diagnosticity from Chapter 19. Generate MicroSims with and without the diagnostic step, then compare how strongly each predicts the held-out assessment.

### Guess-Resistant Probes

A **guess-resistant probe** is a question or task built so that a learner who does not know the concept rarely produces the right response. Chapter 18 named the **guess** parameter of Bayesian knowledge tracing: the chance of a correct answer without mastery. A probe with a low guess rate gives each correct answer more weight.

The `learning-record-store` TODO records a concrete failure. In the animal-cell poster's quiz, six hotspots sit on one image, so a learner can click every marker and be guaranteed to land on the right one. The recorded sequence of wrong, wrong, right answers on one question is the honest signal, and reporting only the success would make a brute-forcing learner look identical to one who knew the answer at once. Retry-until-correct also makes the question close to worthless if only the final success is kept.

Simple arithmetic shows how guess resistance scales. On a single four-option item, a random guess succeeds with probability \( 1/4 \). Two independent four-option items are both guessed correctly with probability \( 1/16 \). A probe with free numeric entry and a tolerance window has a guess rate that is far lower still, though the exact rate depends on the task and must be estimated from data.

| Probe design | Random-guess success, single attempt | Attempts to guarantee success |
|--------------|--------------------------------------|-------------------------------|
| Four-option item | 1 in 4 | 4 |
| Six-hotspot poster quiz | 1 in 6 | 6 |
| Two chained four-option items | 1 in 16 | 16 |
| Free numeric entry with a tolerance window | Depends on the task | Not bounded by a menu |

The table reports only arithmetic on the menu size. Whether a probe really resists guessing is an empirical question: fit the guess parameter from data and confirm that it falls. The interactive lab below lets a reader see the arithmetic before any data exists.

#### Diagram: Guess Resistance Lab

<details markdown="1">
<summary>Guess Resistance Lab</summary>
Type: microsim
**sim-id:** guess-resistance-lab<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Apply; verb: compare): The learner will compare the chance of a lucky success and the attempts needed to guarantee success across probe designs by changing option count, chained items and retry policy.

Layout: a drawing region above a control region, following the standard MicroSim layout. The drawing region is aliceblue with a row of option tiles on the left and a bar chart on the right showing "chance of success by pure guessing" for the current design. The control region is white, separated by a silver line.

Visual elements: a row of option tiles (the hidden correct tile outlined), a counter of attempts used, a sequence strip that shows each attempt as a red or green square in order, and the bar chart described above.

Controls:

- Slider "Options" from 2 to 12 in steps of 1, default 4
- Slider "Chained items" from 1 to 3 in steps of 1, default 1
- Checkbox "Allow retry until correct" (default off)
- Button "Guess randomly" that simulates one random guesser and draws the attempt sequence
- Button "Run 1000 guessers" that draws a histogram of attempts used and reports the fraction who succeed on the first attempt

Behavior: a guesser picks uniformly at random among the options not yet tried. The bar chart always shows \( 1/\text{options}^{\text{chained}} \) for a first-attempt pure guess. When retry is on, the tool reports that success is guaranteed within the option count and that only the attempt sequence, not the final success, distinguishes a knower from a guesser.

Responsive design: the canvas width follows the container width on every window resize, the tiles wrap to a second row under 500 pixels, and the sliders and buttons remain visible at 400 pixels wide.

Implementation: p5.js with createSlider, createCheckbox and createButton controls positioned relative to the drawing height, and a describe() call for accessibility.
</details>

!!! mascot-tip "Score the Sequence, Not Just the Win"
    ![Bounce giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    When a probe allows retries, ask what a pure guesser's attempt sequence would look like before you design the scoring. If the final success is all you keep, you have built a menu-clicking game instead of a probe.

### Adaptive Difficulty

**Adaptive difficulty** means the MicroSim changes its challenge, for example the parameter range or the way a concept is represented, according to the learner's observed behavior or estimated mastery. The paper's conclusion names adaptive difficulty as a future direction, and it is the most familiar of the long-term ideas. It is also the riskiest for evidence.

The danger is that adaptation changes what an event means. If a MicroSim gives easy items to a learner who struggles, a correct answer from that learner is weaker evidence than a correct answer on a hard item, yet both look like a single answered statement with success true. A design would need to record the difficulty level with each attempt, using a new extension, since the current contract tables define none for it. The test compares an adaptive and a fixed version on held-out gain, and checks that the fidelity of prediction does not fall once difficulty is accounted for.

### Learning From Aggregate Data

**Learning from aggregate data** means feeding what many learners did back into the generator, so it learns which designs yield the most predictive evidence. The plan frames this as AI that learns from aggregate xAPI data which sim designs give the most predictive evidence. The hypothesis is that diagnosticity measured across learners for one sim can guide how the next sim is specified.

Two constraints from earlier chapters shape it. Chapter 25's aggregate-only policy means the generator sees group summaries with small groups suppressed, never individual records. Chapter 19's confounding warning means a design that looks predictive may simply have been used by stronger learners. The test is prospective: have the generator apply a learned design rule to new MicroSims, then measure whether their held-out prediction improves over a control set.

!!! mascot-thinking "A Loop That Learns Needs Clean Evidence"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Notice that every long-term idea above feeds on the same thing: events that mean what they claim. A generator that learns from noisy events will confidently learn the wrong lesson.

## Trustworthy Prediction

**Trustworthy prediction** is a prediction that a responsible person can rely on because it has been tested, reported with its limits, and kept under human control. The Chapter 19 protocol supplies the tests and Chapter 24 supplies the guardrails. A trustworthy prediction has calibrated probabilities, a stated baseline, results that hold across sessions, error rates compared across learner groups, and a person who decides anything consequential.

The claims in this book sit at different rungs of a ladder. The ladder below is a planning aid, not a measured result, and it states what evidence each rung needs.

#### Diagram: Prediction Trust Ladder

<details markdown="1">
<summary>Prediction Trust Ladder</summary>
Type: diagram
**sim-id:** prediction-trust-ladder<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Learning objective (Bloom level: Evaluate; verb: judge): The learner will judge how far a given mastery-prediction claim can be trusted by locating it on a ladder of evidence.

Nodes and edges: a vertical flowchart (TD) of five boxes joined by upward arrows: "Hoped for: an idea with no design", "Designed: a written design exists", "Simulated: tested on synthetic data", "Measured once: held-out result from one real class", "Replicated and audited: holds across sessions and groups". The first three are styled grey, amber and light blue, and the last two are styled steel blue and green.

Interactions: every node has a Mermaid click directive that opens an infobox showing what evidence the rung requires, one example claim from this book that sits there, and what would move it up. Hovering a node shows the rung name in a tooltip. A "Place this claim" select offers six example claims and, after the learner picks a rung, highlights the correct one.

Responsive design: the diagram re-fits to the container width on window resize, and the infobox moves below the diagram when the width is under 600 pixels.

Implementation: Mermaid flowchart TD with a click directive on every node and a small script that fills the infobox.
</details>

As of this chapter, the claim that Bayesian knowledge tracing run on MicroSim events predicts mastery sits on the lowest rungs. The synthetic evaluation in Chapter 19 sits at simulated. No real-learner result exists, so the top two rungs are empty. A reader who sees a dashboard number for mastery should ask which rung produced it.

!!! mascot-warning "A Smooth Number Is Not a Validated One"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A dashboard can show a clean mastery percentage long before anyone has checked it against a held-out assessment. Ask for the rung, the sample and the baseline, and treat a number without them as a hypothesis.

## Open Research Problems

An **open research problem** is a question the field has not answered well enough to rely on. Four areas matter for this book: privacy, validity, equity and evaluation. The list below names concrete, recorded examples of each.

- **Privacy.** Free text is the hardest place for identity to enter the stream, and the suppression, audit and erasure mechanisms in Chapter 24 are designed but not built. An aggregate-only generator loop has to prove that subtraction across reports cannot reveal an individual.
- **Validity.** The recorded open questions include how to give one statement several concepts when a node covers many, since the contract allows one concept identifier per statement; how chapter quiz concept labels map to learning-graph identifiers, since only about 65 percent matched exactly when the TODO was written; and a known over-count of page dwell in Full mode for scrolled-away simulations.
- **Equity.** Device, bandwidth and assistive technology differences change how learners interact, so the same knowledge can produce different events. Chapter 24 asks for error comparison across groups once data exists, and that comparison cannot run before then.
- **Evaluation.** No learner data has been collected, so every fidelity claim remains a hypothesis. The TODO also records that the same activity embedded in two books merges into one rollup vertex, which can make a learner who met the material elsewhere look disengaged, and low engagement is not low mastery.

None of these has a clean solution today, and progress on each needs data that only a real deployment would produce. That dependency is the main reason the near-term roadmap puts the POST path ahead of every long-term idea: without statements arriving in a store, the tests for the long-term items cannot even start.

## Chapter Summary

- The **near-term roadmap** covers about one year and includes only items that trace to the plan or to the `learning-record-store` TODO; everything else is labeled built, designed or hoped for.
- **Verified adapters** need a passing pilot each; vis-network, Plotly and Leaflet are still unverified, along with p5.js canvas drags and vis-timeline zoom and pan.
- The **end-to-end POST path** has a built gateway but no emitter that sends statements, and the processor and identity service come before emitters POST.
- **Closed-loop generation** and **automated layout repair** move quality checks inside the generator, within Chapter 13's smallest patch rule and fix cycle limit of three, and both are designed, not measured.
- **Shared sim libraries** already share the xAPI runtime, and a drift check guards against copies falling out of sync.
- The **long-term vision** of fun, diagnostic, mastery-predicting MicroSims is hoped for; each idea (**fun and engagement**, **diagnostic interaction design**, **guess-resistant probes**, **adaptive difficulty**, **learning from aggregate data**) has a stated test.
- **Trustworthy prediction** means calibrated, baseline-compared, replicated across sessions and groups, and overseen by a person; today's claims sit on the lowest rungs of the trust ladder.
- **Open research problems** in privacy, validity, equity and evaluation all wait on real learner data, so the first job is getting statements into a store.

!!! mascot-celebration "You Can Read a Roadmap Honestly"
    ![Bounce celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now separate built, designed and hoped-for claims, plan near-term work that traces to a source, and attach a testable hypothesis to each long-term idea. Every bounce leaves evidence, and you know how to ask what that evidence is worth.

## Closing Thought

MicroSims began as small simulations that one educator could build in an afternoon, and this book has argued that they can also become small instruments that report what learners do. Whether those reports predict mastery is a question for data, not for enthusiasm. The next step belongs to you: pick one near-term item, build it, measure it with the protocol in Chapter 19, and report what you find, including the parts that did not work.
