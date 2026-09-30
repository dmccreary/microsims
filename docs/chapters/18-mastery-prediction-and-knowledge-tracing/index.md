---
title: Mastery Prediction and Knowledge Tracing
description: Explains how an xAPI evidence stream becomes an estimate of concept mastery, using Bayesian knowledge tracing and its four parameters, and states honestly what is designed, built and untested.
generated_by: claude skill chapter-content-generator
date: 2026-09-30 11:16:23
version: 1.10
---

# Mastery Prediction and Knowledge Tracing

## Summary

Explains how an evidence stream becomes a prediction of concept mastery, using Bayesian knowledge tracing and its guess, slip and learning parameters.

Students learn why attempt order matters, how soft correctness and per-concept mastery work, and how mastery propagates across prerequisites. After it, they can trace a prediction from events to a mastery estimate.

## Concepts Covered

This chapter covers the following 20 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| Concept Mastery | 140 |
| Evidence Stream | 147 |
| Signal Versus Noise | 6 |
| Diagnostic Value | 5 |
| Guessing | 4 |
| Slipping | 2 |
| Attempt Order | 19 |
| Mastery Prediction | 138 |
| Predictive Fidelity | 7 |
| Bayesian Knowledge Tracing | 17 |
| BKT Initial Knowledge | 1 |
| BKT Learning Rate | 1 |
| BKT Guess Parameter | 1 |
| BKT Slip Parameter | 1 |
| Mastery Threshold | 2 |
| Soft Correctness Mapping | 1 |
| Item Response Theory | 1 |
| Deep Knowledge Tracing | 1 |
| Per-Concept Mastery | 7 |
| Prerequisite Propagation | 1 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 3: Learning Objectives and Bloom's Taxonomy](../03-learning-objectives-and-blooms-taxonomy/index.md)
- [Chapter 16: xAPI Statements and Evidence](../16-xapi-statements-and-evidence/index.md)
- [Chapter 17: Instrumenting MicroSims with the xAPI Runtime](../17-instrumenting-microsims-with-the-xapi-runtime/index.md)

---

## Welcome

!!! mascot-welcome "From Events to a Forecast"
    ![Bounce waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Your instrumented MicroSims now leave a trail of evidence, and this chapter shows how a model can read that trail and forecast whether a learner has mastered a concept. By the end you can trace a prediction by hand, from a list of answers to a single probability, and explain what it does and does not tell you. Let's bounce it around!

Chapter 16 defined the statements a MicroSim emits, and Chapter 17 showed how to wire a MicroSim to produce them. Neither chapter said what a store should do with those statements once it has them. This chapter answers that question. We begin with the thing being estimated, concept mastery, and the raw material used to estimate it, the evidence stream. We then ask which parts of that stream are worth reading, and build up the standard model for reading it, Bayesian knowledge tracing, one parameter at a time.

A note on status, which the rest of the chapter keeps in view. Everything here describes a model and a design. As of the `learning-record-store` repository's `TODO.md` dated 2026-09-26, no emitter sends statements to a store, and no learner data has been collected through MicroSims. So every claim that the stream predicts mastery is a hypothesis with an evaluation method, which Chapter 19 describes. The arithmetic in this chapter is real and checkable; whether it describes real learners is not yet known.

## Concept Mastery: The Quantity We Want

The learning graph in this book divides a subject into concepts, and each concept has a learning objective attached to it, as Chapter 3 described. **Concept mastery** is the state in which a learner can reliably do what that concept's objective says, at the Bloom level the objective names. A learner who has mastered the concept of a guarded call, for example, can apply it to a new MicroSim, not merely recite its definition.

Mastery has one awkward property: nobody can observe it directly. We see what a learner does, such as clicking an answer, and we infer the hidden state from that. Statisticians call an unobserved quantity a **latent variable**, and every model in this chapter treats mastery as one. It is also usually modelled as binary: at a given moment the learner either has the concept or does not. That is a simplification, since real understanding comes in degrees, but it keeps the mathematics small and the output easy to read.

Because the state is hidden, four different things are easy to confuse. The table below separates them, using a single learner and the concept of a guarded call as the example.

| Quantity | Can we observe it? | Example |
|----------|--------------------|---------|
| Mastery (latent state) | No | The learner can apply a guarded call to a new MicroSim |
| Evidence | Yes | The learner answers the guarded-call question wrongly, then correctly |
| Mastery estimate | Computed | "Under the chapter's illustrative parameters, there is a 0.59 probability this learner has mastered the concept" |
| Mastery prediction | Computed, about the future | "This learner will probably answer a new guarded-call item correctly" |

The worked example makes the distinction concrete. Suppose a learner answers a question on a concept wrongly on the first attempt and correctly on the second. The evidence is two facts. The estimate is a probability that combines those facts with the model's assumptions about slips and guesses. The mastery itself remains unknown. A dashboard that prints "mastered" next to this learner has quietly turned an estimate into a claim about the latent state.

## Per-Concept Mastery and the ConceptMastery Vertex

**Per-concept mastery** means keeping one separate estimate for each concept, for each learner. A learner is not "good" or "bad" at a whole chapter; they may have mastered concept A and not concept B. The Learning Record Store design records this as a `ConceptMastery` vertex at the grain of one student and one concept, carrying properties such as `mastery_score`, `evidence_count`, `attempts` and `successes`. Every vertex also carries `statements_compressed`, the number of statements it represents, so a report can always say how much evidence a number rests on.

The design specification also names the two tools that make per-concept estimates possible. The `COVERS` edge ties a question or MicroSim to a concept, and Chapter 16 explained how a statement carries one concept identifier. The `DEPENDS_ON` edges are the learning graph itself, which later sections use. Separate estimates are useful because they let a teacher see which concept to reteach, and a model can update each one independently as its own evidence arrives.

!!! mascot-thinking "Estimate, Not Verdict"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Notice that the model never sees mastery, only its footprints. Every number in this chapter is a degree of belief about a hidden state, which is why it can move up or down as new evidence arrives.

## The Evidence Stream

The **evidence stream** is the ordered sequence of statements a learner produces for one concept, read in the order they happened. It is the input to every model in this chapter. Chapter 16 sorted MicroSim interactions into evidence classes, and those classes now matter, because they decide what a model can do with each event.

Two facts from that chapter carry the load. First, only the `answered` verb reports `result.success`, so only assessment evidence can say whether the learner was right. Second, exposure evidence, meaning slider drags, hovers, runs and page dwell, contributes zero attempts to a mastery estimate by design. A model that needs a right-or-wrong answer has nothing to condition on when it meets a slider drag. The stream still contains those events, and they may turn out to be useful in other ways, but as the evidence-class reference puts it, hover data does not measure knowledge unless something checks an answer.

Before the diagram below, three terms need defining. A **stage** is one step in the path from a learner's action to a prediction. A **filter** is a rule that drops events that are not evidence, such as those fired by a program rather than the learner. A **model** is the procedure that turns the filtered stream into an estimate. The diagram lets you click each stage and see what enters and leaves it.

#### Diagram: From Interaction to Mastery Prediction

<details markdown="1">
<summary>From Interaction to Mastery Prediction</summary>
Type: infographic
**sim-id:** evidence-stream-to-prediction-pipeline<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Understand; verb: explain): The learner will explain what enters and leaves each stage between a learner's action and a mastery prediction, and identify which stage discards exposure evidence.

Layout: a left-to-right chain of six boxes in the drawing region: "Learner action", "xAPI statement", "Evidence stream (per concept)", "Filter", "Model", "Estimate and prediction". A white control region sits below the drawing region.

Controls:

- Click any box to open an infobox below the chain with its definition, its input, its output and one example
- Radio buttons "Assessment answer" and "Slider drag" that send a sample event down the chain
- Button "Reset"

Data: an assessment answer travels to the end and raises the value shown in the estimate box. A slider drag stops at the Filter box for a model that needs `success`, with the infobox text "attempts = 0: no right-or-wrong to condition on".

Interactions: hovering a box highlights its inputs and outputs. Every infobox text is written to the console as a log line so it can later feed an activity log.

Responsive design: the canvas width follows the container width on every window resize; below 600 pixels the boxes stack vertically and the infobox moves below them.

Implementation: p5.js with createRadio and createButton controls positioned relative to the drawing height, and a describe() call for accessibility.
</details>

The stream has two structural properties that later sections lean on. It is ordered, which is why the sequence of attempts matters, and it is noisy, which is why the model must be careful about how much to believe any one event. We take noise first.

## Signal Versus Noise and Diagnostic Value

In an evidence stream, **signal versus noise** is the distinction between variation caused by what the learner knows and variation caused by anything else. A correct answer that the learner earned by understanding is signal. A correct answer earned by a lucky guess, an incorrect answer caused by a misread question, and a hover that happened because the mouse crossed a diagram on the way to a button are noise.

Chapter 16 already built noise filters into the evidence classes. A hover under 600 ms is a crossing, a run under 250 ms is a mis-click, and a page visit under one second is a glance. Those thresholds are design decisions that have not been tested against learner data, so they are best read as a first guess at where noise ends. The producer contract also names a noise source that no threshold can remove: a learner who skims a page because they already met the material elsewhere looks identical to one who did not engage. Low engagement is therefore not evidence of low mastery.

**Diagnostic value** is how much a single observation changes the estimate, and so how useful it is for telling a learner who has mastered a concept from one who has not. An observation that a masterful learner and an unmastered learner produce equally often has no diagnostic value. An observation that only one of them tends to produce has a lot.

A worked example uses the update equation introduced later in this chapter, so treat the numbers as a preview. Start from an estimate of 0.50 and a slip rate of 0.10. If the chance of guessing a correct answer is 0.20, a correct answer moves the estimate to 0.82. If the item is easy to guess, with a guess rate of 0.50, the same correct answer moves it only to 0.64. The second item is less diagnostic because a correct answer is nearly as likely from a learner who lacks the concept. An exposure event, with no `success` at all, has a diagnostic value of zero for this kind of model.

!!! mascot-tip "Audit Your Guess Rate"
    ![Bounce giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Before you ship a quiz item, ask how a learner with no knowledge could still get it right. If they can eliminate options easily or brute-force the answer, the item has a high guess rate and low diagnostic value, so rewrite it or add distractors.


## Mastery Prediction and Predictive Fidelity

A mastery estimate describes the present. **Mastery prediction** turns it into a statement about the future: given what the model believes now, how likely is the learner to succeed on the next item for this concept? This is the step that makes an estimate testable, because a prediction can be checked against what the learner actually does next. It also carries the thesis behind this book, that a textbook earns the word "intelligent" by forecasting how each learner will do, not merely by containing generated text.

Bayesian knowledge tracing, introduced in the next section, gives a direct formula for the prediction. Write \(P(L)\) for the probability that the learner has mastered the concept, \(p_s\) for the slip rate (a mastered learner answering wrongly) and \(p_g\) for the guess rate (an unmastered learner answering correctly). A correct answer can then arise in two ways, so the predicted chance of a correct next answer is:

\[
P(\text{correct}) = P(L)\,(1 - p_s) + \bigl(1 - P(L)\bigr)\,p_g
\]

The worked example uses a slip rate of 0.10 and a guess rate of 0.20, the same illustrative values the rest of the chapter uses. If the estimate is 0.71, the predicted chance of a correct answer is \(0.71 \times 0.90 + 0.29 \times 0.20 = 0.697\), or about 0.70. The prediction is always squeezed toward the middle compared with the estimate, because even a fully mastered learner can slip and even an unmastered one can guess. The table below shows the effect for four estimates.

| Mastery estimate \(P(L)\) | Predicted chance of a correct next answer |
|---------------------------|-------------------------------------------|
| 0.20 | 0.34 |
| 0.50 | 0.55 |
| 0.80 | 0.76 |
| 0.95 | 0.87 |

**Predictive fidelity** is how closely such predictions match what learners do afterwards. A model with high predictive fidelity says 0.70 and is right about seven times in ten; one with low fidelity says 0.70 whatever happens. Chapter 19 covers how to measure it with held-out assessments, calibration and discrimination. Here we only need the definition, because it explains why the rest of this chapter is careful about status: until predictions are compared with outcomes from real learners, the fidelity of this stream is unknown.

## Bayesian Knowledge Tracing

**Bayesian knowledge tracing**, abbreviated BKT, is a model that keeps one probability of mastery per learner and concept and updates it after every observed answer. Formally it is a two-state hidden Markov model: the hidden state is mastered or not mastered, the observation is correct or incorrect, and the four parameters below govern how the state produces observations and how it changes over time. Intelligent tutoring systems have used it for decades, and the Learning Record Store design selects it for mastery computation (its ADR-006) over a weighted moving average, an Elo rating and item response theory. The design's stated reasons are that BKT outputs a probability a teacher can read at face value, and that its update needs only one number of state per learner and concept.

Two behaviours need names before the parameters do, because the parameters are just those behaviours expressed as probabilities. **Slipping** is a mastered learner answering incorrectly through carelessness, a misread question or a mis-click. **Guessing** is an unmastered learner answering correctly by chance, by eliminating options or by brute force. Without them a single wrong answer would prove ignorance and a single lucky click would prove mastery, and real learners do not behave that way.

Four numbers, all fitted or assumed per concept, define the model. The names below follow this book's concept list; the Learning Record Store's own chapter calls the first a prior mastery probability and the third a transit parameter, and they mean the same things.

- **BKT initial knowledge**, written \(P(L_0)\), is the probability the learner already mastered the concept before any evidence. It is the starting estimate.
- **BKT learning rate**, written \(p_t\), is the probability that a learner who has not mastered the concept masters it between one opportunity and the next. It is the only place where learning enters the model.
- **BKT guess parameter**, written \(p_g\), is the probability of a correct answer given that the concept is not mastered.
- **BKT slip parameter**, written \(p_s\), is the probability of an incorrect answer given that the concept is mastered.

The LRS design notes one further practical point: a brand-new concept has no history to fit, so it borrows starting values from its taxonomy category until enough of its own evidence accumulates. Those borrowed values are a guess, and the LRS design lists testing them against held-out quiz outcomes as future work.

### The Update in Two Steps

Each new answer is processed in two steps. The first step conditions the current estimate on the observation using Bayes' rule. If the answer was correct, the new estimate is the share of all the ways a correct answer could occur that come from a mastered learner:

\[
P(L_n \mid \text{correct}) = \frac{P(L_n)\,(1 - p_s)}{P(L_n)\,(1 - p_s) + \bigl(1 - P(L_n)\bigr)\,p_g}
\]

If the answer was incorrect, the roles swap. The numerator is a mastered learner who slipped, and the denominator adds an unmastered learner who did not guess correctly:

\[
P(L_n \mid \text{incorrect}) = \frac{P(L_n)\,p_s}{P(L_n)\,p_s + \bigl(1 - P(L_n)\bigr)\,(1 - p_g)}
\]

The second step applies learning. Whatever probability remains on "not mastered" after step one has a chance \(p_t\) of moving to "mastered" before the next opportunity, and that result becomes the estimate for the next observation:

\[
P(L_{n+1}) = P(L_n \mid \text{evidence}) + \bigl(1 - P(L_n \mid \text{evidence})\bigr)\,p_t
\]

This basic form has no forgetting: once the model believes a learner has mastered a concept, the learning step only moves probability toward mastery, so a later drop can come only from incorrect answers.

!!! mascot-encourage "Three Equations, Two Ideas"
    ![Bounce encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    If the fractions feel dense, that is normal, because most people need two passes through Bayes' rule. You already know the two ideas: weigh how each answer could have happened, then allow some learning. Try the numbers in the table below before rereading the algebra.

The worked example applies the update to one learner and four answers, with \(P(L_0) = 0.30\), \(p_t = 0.15\), \(p_g = 0.20\) and \(p_s = 0.10\). These are illustrative values, the same ones the Learning Record Store's mastery-trace MicroSim uses, and not fitted to any data. The first correct answer gives \(P(L_0 \mid \text{correct}) = 0.27 / (0.27 + 0.14) = 0.66\), and the learning step lifts that to \(0.66 + 0.34 \times 0.15 = 0.71\). The table records every step.

| Attempt | Observed | Estimate before | After conditioning | After learning step |
|---------|----------|-----------------|--------------------|---------------------|
| 1 | correct | 0.30 | 0.66 | 0.71 |
| 2 | incorrect | 0.71 | 0.23 | 0.35 |
| 3 | correct | 0.35 | 0.71 | 0.75 |
| 4 | correct | 0.75 | 0.93 | 0.94 |

Read the second row. One wrong answer pulls the estimate from 0.71 to 0.35, so the evidence matters, but it does not fall to zero, because a slip is possible. The learning step then lifts it again, and two correct answers restore most of the loss. The next MicroSim lets you change the four parameters and the sequence and watch the trajectory move.

#### Diagram: BKT Parameter Lab

<details markdown="1">
<summary>BKT Parameter Lab</summary>
Type: microsim
**sim-id:** bkt-parameter-lab<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Apply; verb: calculate): The learner will calculate the mastery estimate after each answer in a sequence by choosing the four BKT parameters, and will judge when the estimate first reaches a chosen mastery threshold.

Layout: the drawing region shows a line chart of the estimate \(P(L_n)\) from 0 to 1 against attempt number, with a dashed horizontal line for the threshold. Below the chart, a row of small tiles shows each attempt as a green (correct) or red (incorrect) square. The control region is white below the drawing region.

Controls:

- Four sliders: initial knowledge (default 0.30), learning rate (default 0.15), guess (default 0.20) and slip (default 0.10), each from 0.00 to 1.00 in steps of 0.01
- Slider "Mastery threshold" (default 0.95)
- Click a tile to flip it between correct and incorrect; buttons "Add correct", "Add incorrect" and "Reset"
- Checkbox "Show intermediate numbers" that prints the conditioning and learning-step values for the selected attempt

Data: the initial sequence is correct, incorrect, correct, correct, which reproduces the table in the text (0.71, 0.35, 0.75, 0.94). Every number is computed live from the update equations, never pre-baked.

Interactions: hovering a point on the line shows its attempt, observation and value. Every tooltip text is also written to the console as a log line so it can later feed an activity log.

Responsive design: the canvas width follows the container width on every window resize; sliders resize with it and the tiles wrap onto a second row below 500 pixels.

Implementation: p5.js with createSlider and createButton controls positioned relative to the drawing height, and a describe() call for accessibility.
</details>

## Mastery Threshold

A **mastery threshold** is the estimate at or above which a system treats a concept as mastered and acts on that, for example by marking it complete or moving the learner on. It converts a probability into a decision, and so it is a policy, not a fact about the learner. A high threshold demands more evidence and risks keeping a learner on material they already know; a low one moves faster and risks crediting mastery that is not there.

The worked example reuses the four-answer table. With every answer correct and the same illustrative parameters, the estimate after each answer is 0.71, 0.93, 0.99 and 1.00. Against a threshold of 0.95 the concept is declared mastered after the third answer, and against 0.90 after the second. Which value is right depends on the cost of each kind of mistake, and that cost is a judgment for the instructor. The LRS design documents consulted for this chapter do not fix one value, so treat any figure in this chapter as an example.

## Attempt Order

**Attempt order** is the sequence in which a learner's answers arrive, and in BKT it changes the result. The update is sequential: each answer conditions the estimate left by the previous one, and the learning step interleaves with the conditioning. Two streams containing the same answers in a different order therefore end in different places.

The worked example uses the same illustrative parameters and two answers correct, two incorrect. If the correct answers come first (correct, correct, incorrect, incorrect), the final estimate is 0.33, because the learner ends on two failures. If the incorrect answers come first (incorrect, incorrect, correct, correct), the final estimate is 0.88, because the learner ends on two successes. Same evidence, very different conclusions, and a model that only counted successes and failures would see no difference.

!!! mascot-warning "Do Not Sort or Deduplicate Attempts"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    It is tempting to summarize a learner's answers as "4 attempts, 2 correct", but that summary erases the order, and BKT needs the order. Keep every attempt with its timestamp and let the model do the counting.

The order that the model sees depends on what the producer emits. Chapter 16 already argued that every deliberate attempt should be emitted, wrong ones included, so that a learner who brute-forces a six-option quiz does not look like one who knew the answer. Order gives that argument its arithmetic. With the illustrative parameters, a learner who answers correctly on the first try has an estimate of 0.71; a learner who answers wrongly five times and then correctly ends at 0.56. If only the final success were emitted, both would look the same.

The producer contract leaves one question open: whether retries within one presentation of a question should count as one opportunity or several for mastery estimation, since a guess-then-correct sequence in one minute is not the same evidence as two attempts a week apart. The Learning Record Store's design also keeps one learner's statements on one queue partition so they are consumed in order, which is a design decision motivated by this section, not a measured result.

#### Diagram: Attempt Order Swap Lab

<details markdown="1">
<summary>Attempt Order Swap Lab</summary>
Type: microsim
**sim-id:** attempt-order-swap-lab<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: compare): The learner will compare the final mastery estimates produced by two orderings of the same set of answers, and will distinguish what order changes from what a simple success count would show.

Layout: two stacked line charts share one vertical axis from 0 to 1. The top chart shows the estimate for the learner's chosen order and the bottom chart for a second order. A summary strip between them reads "Successes: 2 of 4" in both, with the two final estimates beside it. A white control region sits below the drawing region.

Controls:

- Two rows of four draggable tiles, green for correct and red for incorrect; dragging a tile reorders that row
- Buttons "Preset: successes first", "Preset: failures first", "Preset: brute force (five wrong, then right)" and "Reset"
- Checkbox "Show a success-count-only model" that overlays a flat line at the success rate
- Four small sliders for the parameters, defaulting to 0.30, 0.15, 0.20 and 0.10

Data: presets reproduce the chapter's numbers, about 0.33 for successes first and 0.88 for failures first. All values are computed live from the update equations.

Interactions: hovering a tile shows its position, observation and the estimate after it. Every tooltip text is also written to the console as a log line so it can later feed an activity log.

Responsive design: the canvas width follows the container width on every window resize; below 500 pixels the tile rows shrink and the two charts keep their full width.

Implementation: p5.js with mouse-drag handling on the tiles, controls positioned relative to the drawing height, and a describe() call for accessibility.
</details>

## Soft Correctness Mapping

The two update equations expect a binary input, correct or incorrect, but most of a MicroSim's evidence is not binary. A slider drag, a hover or a page visit has no `success`. **Soft correctness mapping** is the proposed step that converts such non-binary evidence into a value between 0 and 1 that the update can treat as a partial "how correct was this", blended in with less weight than a graded answer. The Learning Record Store's design states the reason plainly: reading a page is weak evidence of mastery, and the model should say so.

The worked example comes from the Learning Record Store's mapping MicroSim, whose numbers are illustrative defaults, not fitted values. In that MicroSim a graded answer carries a weight of 1.0, while page dwell time and interaction depth each carry a capped weight of 0.30. The chapter does not present a blending formula, because the design has not chosen one.

!!! mascot-warning "Engagement Is Not Understanding"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A soft score built from dwell or interaction counts measures attention, and a learner can attend to something without understanding it. Keep such evidence at a low weight, and prefer adding a checked prediction to the MicroSim when you need real evidence.

The design is candid that one question about this mapping is unresolved: which component computes the value. A stream-side component could derive it from engagement summaries using a registry with one entry per MicroSim, which keeps scoring logic on the server but requires every new MicroSim to be registered. Alternatively, the MicroSim's own code could compute a proxy and embed it in the statement's `result.score`, which needs no new component but means the same scoring logic must be kept consistent in two places. Neither has been built, and the LRS repository's `TODO.md` lists it as an open question.

## Prerequisite Propagation

Concepts in the learning graph depend on one another, and evidence about one concept says something about its neighbours. **Prerequisite propagation** is the use of those dependency edges to carry information between per-concept estimates. It has two directions. Looking upstream, a learner who answers a hard question correctly has probably mastered its prerequisites too. Looking down a chain, a learner who struggles with a concept may be failing because a prerequisite is weak.

The Learning Record Store's design specifies the second direction as a report, not a probability update. Its Prerequisite Gap Analysis walks the `DEPENDS_ON` edges upstream from a weak concept and flags unmastered prerequisites. The sources consulted for this chapter do not specify any rule that propagates probability along edges, so treat automatic propagation as a hypothesis: it is attractive because one answer would inform several estimates, and risky because a wrong edge in the graph would spread a wrong inference.

A short illustrative chain shows the idea. Suppose the graph says Rates depends on Ratios, and Ratios depends on Fractions. A learner's Rates estimate is low, their Ratios estimate is low and their Fractions estimate is high. The gap analysis would point at Ratios as the first unmastered concept in the chain, since Fractions is already mastered, and that is where reteaching should begin.

#### Diagram: Prerequisite Propagation Explorer

<details markdown="1">
<summary>Prerequisite Propagation Explorer</summary>
Type: graph-model
**sim-id:** prerequisite-propagation-explorer<br/>
**Library:** vis-network<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: differentiate): The learner will differentiate a struggling concept whose own evidence is weak from one whose weakness traces to an unmastered prerequisite, by walking dependency edges upstream.

Layout: a small directed graph of seven concepts, with edges pointing from each concept to its prerequisites, matching the direction of the learning graph. Node fill runs from red (estimate 0.0) through yellow to green (estimate 1.0). A side panel shows the selected concept's estimate and its list of prerequisites.

Controls:

- Click a node to select it and open its infobox
- Slider "Estimate for selected concept" from 0.00 to 1.00
- Button "Find first gap" that highlights the deepest unmastered prerequisite reachable upstream from the selected concept
- Toggle "Threshold for mastered" (default 0.95) and button "Reset"

Data: seven illustrative concepts in a chain and a small branch, with hand-chosen starting estimates that include one weak middle concept.

Interactions: hovering an edge shows the text "depends on"; clicking a node lists which prerequisites are below the threshold. The tool does not change any estimate by propagation; it only reads them, matching the gap-analysis report. Every infobox text is also written to the console as a log line so it can later feed an activity log.

Responsive design: the network canvas follows the container width on every window resize, the side panel moves below the graph under 600 pixels, and physics is disabled after the layout settles.

Implementation: vis-network with a hierarchical layout and click and hover event handlers, plus a describe-style text summary for accessibility.
</details>

## Item Response Theory and Deep Knowledge Tracing

Two other families of models are worth knowing so you can say why BKT is the one this design uses.

**Item response theory**, abbreviated IRT, models the probability of a correct answer as a function of the learner's ability and properties of the item, such as its difficulty. It is well suited to designing and scoring calibrated tests. The Learning Record Store's design passed over it because it needs item-difficulty parameters calibrated across a large item bank, which is heavier than the state a stream processor can afford per statement. Standard IRT also treats ability as fixed during a test, whereas BKT models learning between opportunities; that second point is general background, not a claim from the design documents.

**Deep knowledge tracing** replaces the four-parameter model with a neural network trained on many learners' sequences of answers, and it predicts the next answer directly. Its appeal is that it can pick up patterns a four-parameter model cannot. Its costs are that it needs a large volume of training data, which this project does not have, and that its output is harder to explain to a teacher than "the chance of slipping is 0.10". It is not part of the Learning Record Store design, and this book mentions it for completeness only.

## What Is Built, Designed and Hoped For

The honesty rules of this book apply with particular force here, so the table below separates three kinds of claim. It summarizes statements made earlier in the chapter and adds no new ones.

| Kind of claim | Item |
|---------------|------|
| Measured | The Learning Record Store's repository records that a quiz retried three times emitted three `answered` statements with success false, false, true on one identifier, verified in a browser in July 2026. The chapter's arithmetic can be checked by hand. |
| Designed | BKT as the mastery model (ADR-006), a per-statement streaming update, per-concept parameters with taxonomy-category starting values, per-learner ordering, and the `ConceptMastery` vertex. Soft correctness and prerequisite propagation are proposals only. |
| Hoped for | That the stream from real learners predicts their later performance well enough to be useful. No learner data has been collected, so this is a hypothesis. |

Two cautions follow. As of `TODO.md` dated 2026-09-26, no emitter sends statements to a store, so the mastery pipeline described here has no live input. The repository's smoke test also contains an assertion that every `ConceptMastery` vertex carries a non-null BKT score, and its own comments say the join that would supply the score was not yet wired when it was written; check the repository for the current state before relying on any mastery figure. Chapter 19 describes how to evaluate the stream once real data exists.

## Chapter Summary

- **Concept mastery** is a hidden state, not directly observable; **per-concept mastery** keeps one estimate per learner and concept, stored as a `ConceptMastery` vertex in the design.
- The **evidence stream** is the ordered per-concept sequence of statements; only `answered` statements carry right or wrong, and exposure evidence contributes no attempts.
- **Signal versus noise** separates variation caused by knowledge from everything else, and **diagnostic value** measures how much one observation moves the estimate; a hard-to-guess item is more diagnostic.
- **Mastery prediction** turns an estimate into the chance of a correct next answer, and **predictive fidelity** measures how well those chances match outcomes, which Chapter 19 evaluates.
- **Bayesian knowledge tracing** updates a mastery probability in two steps, conditioning on the answer and then applying learning, using **BKT initial knowledge**, **BKT learning rate**, the **BKT guess parameter** and the **BKT slip parameter**; **guessing** and **slipping** are the behaviours those last two parameters describe.
- A **mastery threshold** is a policy, and **attempt order** changes the result, so producers must keep every attempt in sequence.
- **Soft correctness mapping** and **prerequisite propagation** are designed or proposed, not built; **item response theory** and **deep knowledge tracing** are alternatives this design did not choose.

!!! mascot-celebration "You Can Trace a Mastery Prediction"
    ![Bounce celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now take a sequence of answers and compute, step by step, a BKT mastery estimate and the predicted chance of a correct next answer, and you know why order and honest labelling matter. Every bounce leaves evidence, and you can now read what it says.

The next chapter asks how to test whether estimates like these actually predict what learners do, and how to report the result honestly.
