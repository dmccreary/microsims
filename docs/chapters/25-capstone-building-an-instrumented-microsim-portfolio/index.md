---
title: "Capstone: Building an Instrumented MicroSim Portfolio"
description: A project chapter that walks through building, testing, protecting and reporting on an instrumented MicroSim portfolio, with milestones, a rubric and a worked plan.
generated_by: claude skill chapter-content-generator
date: 2026-09-30 11:39:46
version: 1.10
---

# Capstone: Building an Instrumented MicroSim Portfolio

## Summary

Guides students through building an instrumented MicroSim portfolio and reporting how well its event stream predicts mastery of its target concepts.

The chapter adds usability testing, peer review and the evidence on simulation effectiveness, and applies data minimization and aggregate-only policies. After it, students can deliver and defend a portfolio.

## Concepts Covered

This chapter covers the following 8 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| Simulation Effectiveness Studies | 3 |
| Engagement Versus Learning | 2 |
| Aggregate-Only Data Policy | 2 |
| Data Minimization | 1 |
| Usability Testing | 2 |
| Peer Review | 1 |
| Capstone Portfolio | 2 |
| Portfolio Fidelity Report | 1 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: What Is a MicroSim](../01-what-is-a-microsim/index.md)
- [Chapter 13: Quality Assurance and Automated Layout Review](../13-quality-assurance-and-automated-layout-review/index.md)
- [Chapter 14: Batch Generation from Specifications](../14-batch-generation-from-specifications/index.md)
- [Chapter 17: Instrumenting MicroSims with the xAPI Runtime](../17-instrumenting-microsims-with-the-xapi-runtime/index.md)
- [Chapter 19: Evaluating the Predictive Fidelity of the xAPI Stream](../19-evaluating-the-predictive-fidelity-of-the-xapi-stream/index.md)
- [Chapter 20: The Full LRS: Architecture and Ingestion](../20-the-full-lrs-architecture-and-ingestion/index.md)
- [Chapter 24: Pedagogy, Accessibility and Ethics](../24-pedagogy-accessibility-and-ethics/index.md)

---

## Welcome

!!! mascot-welcome "Your Portfolio Starts Here"
    ![Bounce waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    This is the chapter where the whole book turns into something you can show other people. You will assemble a small set of MicroSims that generate, pass quality checks, report evidence and come with an honest answer to the book's big question. Let's bounce it around!

Every earlier chapter taught one part of a pipeline: choose a type, generate from a specification, check the layout, describe the result, instrument it, and evaluate what its events can predict. The capstone asks you to run the whole pipeline once, on a topic you choose, and to defend the result. This chapter gives the project brief, the milestones, the deliverables, a rubric and a worked example. Along the way it adds five ideas the pipeline still lacks: evidence about whether simulations work, human testing, review by peers, and two data-protection policies.

## Project Brief

A **capstone portfolio** is a curated, documented set of instrumented MicroSims, built by one student or a small team for one course topic, together with the evidence that each part works. The brief below is the assignment for this book. The course description weights the capstone at 25 percent of the course grade and describes it as an instrumented portfolio with documentation and a mastery-prediction analysis. The portfolio size and the milestone dates in this chapter are suggestions for a semester course, and an instructor may change them.

The portfolio must meet these requirements, each of which points back to a chapter that taught the skill:

| Requirement | Suggested target | Taught in |
|---|---|---|
| Learning objectives with Bloom levels, one per target concept | 4 to 6 concepts | [Chapter 3](../03-learning-objectives-and-blooms-taxonomy/index.md) |
| MicroSims of at least three different types, generated from specifications | 4 to 6 MicroSims | [Chapter 14](../14-batch-generation-from-specifications/index.md) |
| Quality gate: every new MicroSim scores at least 70 on the validator, and is width-responsive | All MicroSims | [Chapter 13](../13-quality-assurance-and-automated-layout-review/index.md) |
| xAPI instrumentation that passes `check-xapi.py` | All MicroSims | [Chapter 17](../17-instrumenting-microsims-with-the-xapi-runtime/index.md) |
| Usability test and peer review, with the fixes they led to | 3 or more test participants, 1 reviewer | This chapter |
| Data policy statement | One page | This chapter and [Chapter 24](../24-pedagogy-accessibility-and-ethics/index.md) |
| Portfolio fidelity report | One report | [Chapter 19](../19-evaluating-the-predictive-fidelity-of-the-xapi-stream/index.md) and this chapter |

The 70-point bar for new MicroSims comes from the MicroSims 2.0 plan, which also sets 85 for any MicroSim carried over from version 1.0. Because the plan's own pilot instrumented about 10 MicroSims, a portfolio of four to six is deliberately smaller and deeper.

## Evidence About Simulations

Before you claim your portfolio helps anyone learn, you need to know what the research does and does not say. **Simulation effectiveness studies** are empirical studies that compare learning outcomes of students who used a simulation with outcomes of comparison groups, usually on a test of the target concept. Many such studies exist for established simulation libraries such as PhET. The MicroSims 2.0 plan is candid about the gap for this book: its effectiveness data are borrowed from PhET studies and meta-analyses, and none has been measured on MicroSims. Read published effect sizes as motivation for your design, never as a result you inherit.

The distinction that protects you from overclaiming is **engagement versus learning**. Engagement is what learners do with a MicroSim, such as clicks, minutes and slider changes. Learning is a change in what they know or can do, and only an assessment observes it. A MicroSim can be enjoyable and heavily used while teaching little, and the reverse is also possible. The xAPI stream measures engagement directly, so its link to learning is a hypothesis, which is exactly what your fidelity report tests.

!!! mascot-thinking "Clicks Are Not Knowledge"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Think of the event stream as footprints and the held-out assessment as the destination. Footprints can suggest where someone went, but only the assessment tells you whether they arrived.

## Testing With People

Automated checks find layout and instrumentation defects, but they cannot tell you whether a learner understands what to do. **Usability testing** is observing representative users as they attempt realistic tasks with a MicroSim, so that you find where they hesitate, misread or give up. Three participants is a practical minimum for a course project, though a small test finds problems and cannot estimate how common they are. Ask each participant to think aloud, and give tasks such as "make the ball bounce lower" without explaining the controls.

**Peer review** is structured critique of your work by another student or an instructor, using the same rubric that will grade it. Reviewers open the deployed pages, not your source folder, and they check the claims in your documentation against what they see. The table records what each method catches, and the worked plan later in the chapter shows both in use.

| Method | Who does it | What it catches | What it cannot catch |
|---|---|---|---|
| Automated quality chain | Scripts | Layout defects, missing metadata, hidden controls, malformed statements | Confusing instructions |
| Usability test | Representative users | Misread controls, unclear tasks, dead ends | How common a problem is |
| Peer review | Another student or instructor | Unsupported claims, gaps against the rubric | Problems only novices meet |

## Protecting Learner Data

Chapter 24 mapped where personal data can enter an instrumented MicroSim. Two policies from that discussion become deliverables in your capstone. **Data minimization** is the practice of collecting only the data needed for a stated purpose. For a portfolio, the purpose is predicting mastery of your target concepts, so each event you keep must map to an evidence class and a concept, and you should avoid free-text capture when a choice will do.

An **aggregate-only data policy** is a commitment that reports, dashboards and the portfolio fidelity report present only group-level figures and never individual learners' records. Chapter 21 supplies the mechanism in the Full LRS design: a suppression threshold, 10 students by default, below which a cell is hidden, plus complementary suppression so that row totals do not reveal a hidden cell. That chapter also notes the suppression filter is designed but not built, so your policy statement must say how your own analysis enforces the rule. A class of a dozen students will often fall under the threshold, which means many of your cells may have to be merged or withheld.

!!! mascot-warning "Small Classes Leak"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    In a class of twelve, a group of three is easy to identify by elimination, even without names. Merge small groups into larger ones, or report only the whole-cohort figure, and check that no total lets a reader subtract a hidden cell.

## The Portfolio Fidelity Report

The **portfolio fidelity report** is the capstone's written analysis of how well the event stream from your instrumented MicroSims predicts mastery of their target concepts. It follows the reporting structure of Chapter 19: prediction target, evidence window, held-out assessment, sample, baseline, metrics with uncertainty, confounders, coverage gaps, and a plain statement of what is measured, designed and hoped for.

Honesty rules apply strongly here. No learner data has been collected through MicroSims so far, and as of the learning-record-store repository's TODO dated 2026-09-26 no emitter posts statements to a store yet. A student portfolio therefore has two legitimate routes. You may run the Chapter 19 evaluation on a synthetic cohort, which demonstrates your procedure and says nothing about real learners. Or you may collect a small pilot from consenting classmates, which gives real but very noisy data. Chapter 19 showed that a 50-learner synthetic cohort produced an AUC interval about 0.27 wide, so a pilot of a dozen cannot support a predictive claim. State the sample size and label every result accordingly.

## Milestones and Deliverables

The milestones below order the work so that each stage feeds the next. Dates are expressed as weeks of a suggested 8-week schedule.

| Week | Milestone | Deliverable | Gate to pass |
|---|---|---|---|
| 1 | Plan | Portfolio plan: topic, concepts, objectives, one MicroSim type per concept | Instructor approves plan |
| 2 to 3 | Specify and generate | Specification blocks, generated MicroSims, metadata files | Each new MicroSim scores at least 70 |
| 4 | Instrument | xAPI wiring and `check-xapi.py` reports | All checks pass |
| 5 | Test and review | Usability notes, peer review form, list of fixes made | Fixes re-scored |
| 6 | Protect | Data policy statement | Reviewer confirms minimization and aggregate-only rules |
| 7 | Evaluate | Portfolio fidelity report | Limits sentence present |
| 8 | Present | Deployed site and a short defense | Rubric score |

Two commands support the gates. The first scores every MicroSim in the project and saves the results, and the second drives one MicroSim in a headless browser and checks its statements. The `--project-dir` flag names the book folder, `--output` names the results file, and the `--actions` flag names an optional JSON file that drives canvas clicks the generic pass cannot reach.

```bash
python3 validate-sims.py --project-dir . --output scores.json
uv run --with playwright==1.58.0 python check-xapi.py docs/sims/<name> --actions actions.json
```

#### Diagram: Portfolio Milestone Planner

<details markdown="1">
<summary>Portfolio Milestone Planner</summary>
Type: microsim
**sim-id:** portfolio-milestone-planner<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Create; verb: design): The learner will design a week-by-week schedule for their own portfolio and identify which milestone gates put the schedule at risk.

Layout: a drawing region above a control region. The drawing region shows eight week columns and seven milestone bars from the chapter's milestone table, each bar clickable. The control region is white and holds the sliders and buttons.

Controls:

- Slider "Number of MicroSims" from 3 to 8, default 5
- Slider "Test participants" from 1 to 8, default 3
- Slider "Weeks available" from 6 to 12, default 8
- Button "Reset to suggested schedule"

Behavior: changing a slider stretches or shrinks the bars for generation, testing and instrumentation, and bars that no longer fit turn amber with a one-sentence warning. Clicking a bar opens a panel listing its deliverable and the gate it must pass. The bar values are illustrative estimates for planning and are not measured effort data, and the sim says so.

Responsive design: the canvas width follows the container width on every window resize, and week labels rotate or abbreviate at narrow widths.

Implementation: p5.js with createSlider and createButton controls, and a describe() call summarizing the current schedule.
</details>

## Grading Rubric

The rubric assigns 100 points to the capstone. The weights emphasize honest analysis over impressive-looking numbers, since a weak but honest fidelity result deserves more credit than a strong claim the data cannot support.

| Criterion | Points | Full credit means |
|---|---|---|
| Portfolio design | 15 | Objectives with Bloom levels, at least three types, sound type choices |
| Quality gate | 15 | Every new MicroSim at 70 or above and width-responsive |
| Instrumentation | 15 | Passing checks, one concept per statement, evidence classes justified |
| Usability test and peer review | 15 | Findings recorded, fixes made and re-scored |
| Data policy | 10 | Minimization and aggregate-only rules stated and enforced in the analysis |
| Portfolio fidelity report | 20 | Complete Chapter 19 structure, uncertainty shown, limits sentence first |
| Defense | 10 | Answers questions about measured versus designed claims |

!!! mascot-tip "Check Early, Check Often"
    ![Bounce giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Run the quality chain and the instrumentation check after every MicroSim, not once at the end. A defect found in week 3 costs one regeneration, while the same defect found in week 7 can invalidate your evidence window.

#### Diagram: Rubric Self-Check

<details markdown="1">
<summary>Rubric Self-Check</summary>
Type: microsim
**sim-id:** portfolio-rubric-self-check<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Learning objective (Bloom level: Evaluate; verb: assess): The learner will assess a draft portfolio against the seven rubric criteria and justify which criterion to improve first.

Data: the seven criteria and their point values from the rubric table. Each criterion has a self-rating slider from 0 to 100 percent, defaulting to 50.

Layout: a horizontal stacked bar chart above a control region. Each bar shows points earned against points available for one criterion, with a total score displayed above the chart.

Interactions: moving a slider updates the bar and the total. Hovering a bar shows the criterion's "full credit means" text. A button "Suggest next focus" highlights the criterion with the largest points still available, and a text box records the learner's reason. The ratings are self-assessments and the sim says they are not a grade.

Responsive design: the chart width follows the container width on every window resize, and the sliders stack below the chart at narrow widths.

Implementation: Chart.js bar chart with HTML range inputs, updating the chart data on the input event.
</details>

## Worked Example: A Small Portfolio Plan

A worked example shows the plan from week 1. The scenario is invented for illustration: a student builds a portfolio for a unit on Ohm's law in an introductory electronics course. The concept identifiers are illustrative, and no real learners exist for this example.

| Concept ID | Objective (Bloom) | MicroSim and type | Evidence class expected |
|---|---|---|---|
| ohms-law-relation | Apply: compute current from voltage and resistance | Circuit lab, p5.js | Manipulation, checked prediction |
| iv-curve | Analyze: distinguish ohmic from non-ohmic parts | Current-voltage explorer, Chart.js | Exploration |
| series-resistance | Understand: explain why resistances add | Series circuit diagram, vis-network | Exploration, quiz answer |
| circuit-vocabulary | Remember: name components | Labeled overlay, image overlay | Exploration, quiz answer |

The plan uses three types across four MicroSims, which meets the type requirement. The data policy names each retained event by evidence class, drops free-text answers, and promises class-level figures only. The usability test uses three classmates given tasks such as "find the current when resistance doubles". Suppose two of them miss the reset button; the fix is a clearer label, and the MicroSim is re-scored afterward. The fidelity report uses a synthetic cohort and states, first, that its results show the procedure and nothing about real learners.

## Chapter Summary

- A capstone portfolio is a documented set of instrumented MicroSims plus evidence that each part works; this course's version needs three or more types and passes the quality gate.
- Simulation effectiveness studies exist mainly for other libraries, so their results motivate your design and are never a measured result for your MicroSims.
- Engagement is what learners do and learning is what they know; the event stream measures the first, and only a held-out assessment observes the second.
- Usability testing finds where real users struggle, and peer review checks your claims against the rubric; neither replaces automated checks.
- Data minimization keeps only events tied to an evidence class and concept, and an aggregate-only policy reports groups, applies suppression, and guards against subtraction.
- The portfolio fidelity report follows the Chapter 19 structure, states its sample and limits, and separates measured from designed and hoped-for claims.

!!! mascot-celebration "You Can Deliver and Defend"
    ![Bounce celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now plan, build, test, protect and report on an instrumented MicroSim portfolio, including writing a fidelity report that says only what the evidence supports. Every bounce leaves evidence, and yours is now organized.

With a defended portfolio in hand, [Chapter 26](../26-the-future-of-microsims/index.md) looks ahead to how AI-generated MicroSims might be designed for higher predictive value.
