---
title: Evaluating the Predictive Fidelity of the xAPI Stream
description: Shows how to test whether an xAPI evidence stream predicts mastery, using held-out assessments, accuracy against baselines, Brier score, calibration, AUC, sample size and honest reporting.
generated_by: claude skill chapter-content-generator
date: 2026-09-30 11:20:00
version: 1.10
---

# Evaluating the Predictive Fidelity of the xAPI Stream

## Summary

Teaches how to measure how well the xAPI stream predicts mastery, using held-out assessments, calibration, discrimination and honest reporting of limits.

Students learn evaluation protocols, sample-size needs, confounders and threats to validity, and how to design instrumentation for fidelity. After it, they can report prediction quality and separate measured claims from designed ones.

## Concepts Covered

This chapter covers the following 18 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| Held-Out Assessment | 126 |
| Prediction Accuracy | 99 |
| Correlation With Assessment | 1 |
| Calibration | 27 |
| Discrimination | 27 |
| AUC | 1 |
| Brier Score | 1 |
| Stability Across Sessions | 1 |
| Sample Size Requirement | 21 |
| Confounding Factors | 21 |
| Fidelity-Driven Instrumentation | 3 |
| Interaction Diagnosticity | 1 |
| Transfer Item | 1 |
| Evaluation Protocol | 25 |
| Threats to Validity | 20 |
| Measured Versus Designed Claims | 19 |
| Reporting Prediction Quality | 4 |
| Concept Coverage Gap | 1 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 3: Learning Objectives and Bloom's Taxonomy](../03-learning-objectives-and-blooms-taxonomy/index.md)
- [Chapter 16: xAPI Statements and Evidence](../16-xapi-statements-and-evidence/index.md)
- [Chapter 18: Mastery Prediction and Knowledge Tracing](../18-mastery-prediction-and-knowledge-tracing/index.md)

---

!!! mascot-welcome "Does the Bounce Predict the Learner?"
    ![Bounce waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Every MicroSim you instrument leaves a trail of events, and this chapter shows you how to find out whether that trail tells the truth about what learners know. By the end you can design a fair test, score it, and write up the result without overclaiming. Let's bounce it around!

Chapter 18 ended with a promise. A mastery estimate is only useful if it forecasts what a learner will do next, and the chapter defined **predictive fidelity** as how closely those forecasts match later behavior. This chapter turns that definition into a procedure. It explains how to test the forecasts, how to summarize how good they are with a few numbers, and how to describe the outcome so that a reader can tell what was measured from what was merely designed.

One fact shapes everything that follows. As of the Learning Record Store repository's `TODO.md` dated 2026-09-26, no MicroSim emitter sends statements to a store, and no learner data have been collected through this book's MicroSims. Every number in this chapter therefore comes from a **synthetic cohort**, a small population of simulated learners whose behavior we programmed ourselves. The numbers illustrate the method. They are not evidence that any real stream predicts mastery.

## The Evaluation Protocol

An **evaluation protocol** is a written plan, fixed before any data are examined, that states what will be predicted, from which evidence, for whom, against which outcome, and how the result will be scored. Writing it first matters because the choices are easy to bend after the fact. If an analyst sees the results and then picks the threshold, the concept or the subgroup that looks best, the reported quality is inflated and nobody, including the analyst, can tell by how much.

A protocol for this book's question has six parts, and each is settled in the sections below.

1. **Prediction target.** What event is forecast, for example a correct answer on a specific assessment item for one concept.
2. **Evidence window.** Which part of the xAPI stream the model may use, for example every statement recorded before the assessment.
3. **Held-out outcome.** The assessment that the model never sees during fitting or updating.
4. **Metrics.** Accuracy, Brier score, calibration, discrimination and their baselines, chosen in advance.
5. **Sample plan.** How many learners are needed for the result to be stable.
6. **Validity checks.** The confounders and threats that will be examined, and how.

The next section defines the second and third parts precisely, because they carry the most weight.

## The Held-Out Assessment

A **held-out assessment** is a test of the learner's mastery whose results the prediction model has never used. The model may use everything the stream recorded during practice. It must not use the assessment answers, or any statement produced after them, when it makes the forecast. The assessment is "held out" in the same sense that a test set is held out in machine learning: it exists to reveal how the model behaves on evidence it did not learn from.

The reason is simple. A knowledge-tracing model updates its estimate after every answer, so the stream's own answers are always, in a sense, explained by the model. Asking a model to predict answers it has already absorbed measures memory, not foresight. Only an outcome that arrives after the forecast is fixed can show whether the forecast was any good.

Two practical rules follow. First, the assessment must be separated in time or by design from the practice stream, and its timestamp must be later than the last statement used. Second, the assessment items should not be items the learner practiced. An item that is new but tests the same concept is called a **transfer item**. Transfer items check that the learner grasps the concept rather than the specific wording of a practice question, and this is the meaning of mastery the book cares about.

The Learning Record Store design already points in this direction. Its design specification treats the starting parameters that a new concept borrows from its taxonomy category as a guess until real data exist, and it lists checking them against held-out quiz outcomes as future work. That is a design statement, not a completed test.

!!! mascot-thinking "The Test Must Arrive After the Forecast"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Picture a weather forecaster who is allowed to look out the window before predicting rain. Their accuracy would be superb and meaningless. A held-out assessment is the rule that keeps the window closed until the forecast is on record.

The interactive below lets you see how the timing rule works before we compute anything. It uses only the terms defined above: the evidence window, the forecast and the held-out assessment.

#### Diagram: Held-Out Split Explorer

<details markdown="1">
<summary>Held-Out Split Explorer</summary>
Type: microsim
**sim-id:** fidelity-held-out-split-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Analyze (L4)
Bloom Verb: distinguish

Learning objective: Learners will distinguish statements that may legitimately feed a forecast from those that leak the held-out assessment, by placing a forecast cutoff on a learner's timeline and judging each statement.

Layout: A horizontal timeline for one synthetic learner shows about twelve statements as small markers, colored by type (practice answer, exposure event, held-out assessment answer). A draggable vertical line marks the forecast cutoff. A right panel lists the statements the model may use.

Controls: A draggable cutoff line; a checkbox "Allow the model to see assessment answers" that intentionally introduces leakage; a "Reset" button.

Data: The learner's timeline is fixed and hand-written with timestamps. A readout shows a mock predicted probability computed only from the permitted statements, and a second mock accuracy that jumps upward when leakage is enabled.

Interactions: Hovering a marker shows its type and timestamp. Dragging the cutoff updates the usable-evidence list and flags any statement after the cutoff that is still in use with a red outline. Turning on leakage displays the message "Score is inflated: the forecast saw its own answer key."

Responsive design: The canvas width follows the container and re-lays out on window resize; the side panel drops below the timeline on narrow screens.

Implementation: p5.js with a single sketch, a timeline drawn in draw(), and DOM controls for the checkbox and reset button.
</details>

## The Synthetic Cohort

Before defining the scores, we need data to score. This section builds the smallest honest example: a simulated cohort whose true behavior we know, so that every metric has a value we can check by hand. It is **synthetic**, and the label appears on every table below.

The simulation models one concept. Each of 200 simulated learners starts as mastered with probability 0.30. A learner answers four practice items. A mastered learner answers correctly with probability 0.90 (a slip rate of 0.10) and an unmastered learner with probability 0.20 (a guess rate of 0.20). After every answer, an unmastered learner has a 0.15 chance of learning the concept. Finally, each learner answers one held-out item with the same slip and guess rates. The random seed is 19.

The forecast comes from the Bayesian knowledge tracing update of Chapter 18, using the same four values, then converted to a predicted chance of a correct held-out answer with the formula from that chapter. Because the model's parameters equal the simulation's true parameters, this is the best case. The final section of the worked example weakens that assumption.

Four functions do all the work. `bkt` runs the two-step update over a list of practice answers (True for correct) and returns the final mastery estimate; its keyword arguments are the initial knowledge `L0`, the learning rate `pt`, the guess `pg` and the slip `ps`. `pred` converts a mastery estimate into the chance of a correct next answer. `auc` and the Brier line are explained in the sections that define those scores, so they are shown there.

```python
def bkt(obs, L0=.3, pt=.15, pg=.2, ps=.1):
    L = L0
    for correct in obs:
        if correct:
            c = L * (1 - ps) / (L * (1 - ps) + (1 - L) * pg)
        else:
            c = L * ps / (L * ps + (1 - L) * (1 - pg))
        L = c + (1 - c) * pt
    return L

def pred(L, pg=.2, ps=.1):
    return L * (1 - ps) + (1 - L) * pg
```

## Prediction Accuracy

**Prediction accuracy** is the fraction of held-out outcomes the model gets right after its probabilities are turned into yes-or-no calls. The usual rule predicts "correct" when the forecast is at least 0.5 and "incorrect" otherwise. Accuracy is easy to explain to a teacher, which is why it is the first number most people ask for, and it is also the easiest number to misread.

On the synthetic cohort the model's accuracy is 0.705: it called 141 of 200 held-out answers correctly. That sounds decent until you compare it with the simplest possible forecaster. In this cohort 63.5 percent of learners answered the held-out item correctly, so a forecaster that ignores the stream and always predicts "correct" is right 63.5 percent of the time. The stream adds about seven percentage points over that **baseline**, a reference forecast that uses no evidence. Any accuracy claim should be reported next to its baseline, because the baseline is what accuracy would be worth if the stream carried no information.

The table below puts the three forecasters side by side. All values are computed on the synthetic cohort.

| Forecaster (synthetic cohort, n = 200) | Accuracy | Brier score | AUC |
|----------------------------------------|----------|-------------|-----|
| Always predict the cohort base rate (0.635) | 0.635 | 0.232 | 0.500 |
| Raw fraction correct in the four practice answers | 0.695 | 0.247 | 0.724 |
| BKT with the true parameters | 0.705 | 0.195 | 0.743 |

The Brier score and AUC columns are defined in later sections; for now, read only the accuracy column and notice how narrow the gaps are.

!!! mascot-warning "Accuracy Can Hide a Do-Nothing Model"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    When most learners succeed, a model that always says "will succeed" scores well without knowing anything. Report the baseline in the same sentence as the accuracy, every time.

The interactive below makes the trap visible by letting you change how common success is and how informative the model is.

#### Diagram: Accuracy Versus Base Rate Lab

<details markdown="1">
<summary>Accuracy Versus Base Rate Lab</summary>
Type: microsim
**sim-id:** fidelity-accuracy-base-rate-lab<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Bloom Level: Evaluate (L5)
Bloom Verb: judge

Learning objective: Learners will judge whether a reported accuracy demonstrates predictive value by comparing it with the always-predict-the-majority baseline as the base rate changes.

Layout: A grouped bar chart with two bars, "Model accuracy" and "Baseline accuracy", above a row of controls. A caption under the chart states the lift in percentage points.

Controls: A slider for the base rate of correct answers (0.10 to 0.90, step 0.01, default 0.635); a slider for model signal strength (0.0 meaning no information, 1.0 meaning the synthetic model above, default 1.0); a "Simulate 200 learners" button that draws a fresh synthetic cohort.

Data: Each press of the button draws a cohort with the chosen base rate, generates model forecasts whose informativeness scales with the signal slider, and computes both accuracies. All values are synthetic and the chart title says so.

Interactions: Hovering a bar shows its exact value and how many of the 200 learners it classified correctly. When the signal slider is at zero and the base rate is far from 0.5, the model bar equals or falls below the baseline bar and a message reads "This accuracy carries no evidence."

Responsive design: The chart resizes with its container and the controls stack vertically below tablet width.

Implementation: Chart.js bar chart with DOM sliders; cohort generation in a small seeded JavaScript function.
</details>

Accuracy also throws away information. A forecast of 0.51 and a forecast of 0.99 both become "correct", even though one is a coin flip and the other is near certainty. The next scores keep the probabilities intact.

## The Brier Score

The **Brier score** is the mean squared difference between each forecast probability and what actually happened, where a correct answer counts as 1 and an incorrect answer as 0. It ranges from 0, for perfect and fully confident forecasts, upward; a forecaster who always says 0.5 scores exactly 0.25. Lower is better. In code it is one line:

```python
brier = sum((p - y) ** 2 for p, y in zip(predictions, outcomes)) / len(outcomes)
```

Here `predictions` are forecast probabilities and `outcomes` are 1 for a correct held-out answer and 0 for an incorrect one. On the synthetic cohort the BKT forecast scores 0.195, the base-rate baseline 0.232 and the raw fraction 0.247. Notice that the raw fraction, which looked competitive on accuracy, is worse than the do-nothing baseline on Brier. Its forecasts of exactly 0 and 1 are overconfident, and the squared error punishes confident mistakes heavily. This is the practical value of the Brier score: it rewards honest uncertainty, which is what an estimate of mastery is supposed to express.

## Calibration

**Calibration** asks whether a forecast of 0.70 comes true about 70 percent of the time. It is a property of the probabilities themselves, separate from whether the model ranks learners well. A calibrated model can be trusted at face value: when a dashboard says "80 percent likely to have mastered this", a teacher can act on that number as a rate.

To check it, sort the forecasts into bins, then compare the average forecast in each bin with the fraction of learners in that bin who actually succeeded. A well-calibrated model gives pairs that lie close together. Plotting observed against predicted gives a reliability curve; a perfectly calibrated model traces the diagonal. The table below shows the synthetic cohort in four bins.

| Forecast bin (synthetic) | Learners | Mean forecast | Observed correct |
|--------------------------|----------|---------------|------------------|
| below 0.4 | 65 | 0.332 | 0.400 |
| 0.4 to 0.6 | 25 | 0.586 | 0.520 |
| 0.6 to 0.8 | 8 | 0.653 | 0.500 |
| 0.8 and above | 102 | 0.880 | 0.824 |

The pairs are close but not identical. With only 8 learners in the third bin, a gap of 0.15 is well within chance. This is why calibration tables should always show the bin counts: a large gap in a small bin is a warning to gather more data, not proof of miscalibration.

The worked example now weakens the ideal assumption. Suppose the simulated learners' true guess rate is 0.35 but the model still uses 0.20, a mistake a real deployment could easily make because the design's starting parameters are borrowed guesses. Over 200 learners with the same seed, accuracy falls to 0.655, below that cohort's baseline of 0.690, and the Brier score is 0.216, slightly worse than the baseline's 0.214. The lowest bin (below 0.4) contains 47 learners, the model forecast 0.341 on average, and 0.574 of them succeeded. The model underestimated its weakest learners because it assumed guessing was rarer than it was.

!!! mascot-tip "Always Print the Bin Counts"
    ![Bounce giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    A calibration plot with no counts hides which points are noise. Print the number of learners in every bin, and merge bins with fewer than about ten learners before drawing conclusions.

The interactive below lets you build a reliability curve yourself, using only the bins and counts described above.

#### Diagram: Calibration Curve Lab

<details markdown="1">
<summary>Calibration Curve Lab</summary>
Type: microsim
**sim-id:** fidelity-calibration-curve-lab<br/>
**Library:** Plotly<br/>
**Status:** Specified

Bloom Level: Analyze (L4)
Bloom Verb: diagnose

Learning objective: Learners will diagnose whether a synthetic model is overconfident, underconfident or well calibrated by reading a reliability curve and its bin counts.

Layout: A scatter plot of mean forecast (x axis, 0 to 1) against observed fraction correct (y axis, 0 to 1) with a dashed diagonal for perfect calibration. Point size is proportional to the number of learners in the bin. A table of bin counts sits beside the plot.

Controls: A dropdown for the synthetic scenario ("model parameters match the simulation" and "true guess rate 0.35, model assumes 0.20"); a slider for the number of bins (3 to 10, default 4); a slider for cohort size (50 to 1000, default 200); a "Redraw cohort" button.

Data: A seeded synthetic cohort generated in the browser with the same rules as the chapter's worked example. The plot title states "Synthetic data".

Interactions: Hovering a point shows the bin range, the count, the mean forecast and the observed fraction. Bins with fewer than ten learners are drawn with a dashed outline and a tooltip reading "Too few learners to trust this point". Changing the scenario animates the points to their new positions.

Responsive design: The Plotly chart uses responsive layout and the table wraps below the plot on narrow screens.

Implementation: Plotly.js scatter plot with a shape for the diagonal; cohort simulation in vanilla JavaScript.
</details>

## Discrimination

**Discrimination** is the model's ability to tell learners who succeed from learners who fail, by giving the first group higher forecasts. It concerns ranking, not the exact probability. A model can discriminate perfectly yet be badly calibrated, for example by predicting 0.9 for every success and 0.8 for every failure, and it can be calibrated yet useless at ranking, for example by predicting the cohort average for everyone. The base-rate baseline is exactly that second case: perfectly calibrated on average and unable to separate anyone.

The two properties answer different practical questions. Calibration tells a teacher how far to trust a number. Discrimination tells a teacher whether the list of learners flagged as "likely struggling" actually contains the ones who struggle. A report on predictive fidelity needs both, and the common failure is to publish one.

## AUC

The standard single number for discrimination is **AUC**, the area under the receiver operating characteristic curve. The curve plots, for every possible cutoff, the fraction of successful learners correctly called successful against the fraction of unsuccessful learners wrongly called successful. The area under it has a plain interpretation that needs no calculus. Take one learner who answered the held-out item correctly and one who answered it incorrectly, both chosen at random. AUC is the probability that the model gave the first a higher forecast, with ties counted as half.

An AUC of 0.5 means the ranking is no better than a coin flip and 1.0 means perfect ranking. The function below computes it by comparing every correct-incorrect pair, which is fine for hundreds of learners:

```python
def auc(preds, outcomes):
    pos = [p for p, y in zip(preds, outcomes) if y]
    neg = [p for p, y in zip(preds, outcomes) if not y]
    wins = sum((a > b) + 0.5 * (a == b) for a in pos for b in neg)
    return wins / (len(pos) * len(neg))
```

The arguments are the forecast probabilities and the 1-or-0 outcomes, as for the Brier score. On the synthetic cohort the BKT forecast has an AUC of 0.743, the raw fraction correct 0.724, and the base-rate baseline exactly 0.500 because it gives every learner the same number. In the mismatched scenario BKT drops to 0.680 while still ranking learners better than chance.

!!! mascot-encourage "Ranking Pairs, Nothing More"
    ![Bounce encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    ROC curves look intimidating, but the reading is one sentence long: pick a success and a failure at random, and AUC is how often the success got the higher score.

The interactive below draws the curve and reports the pair-based reading side by side, so the two definitions can be checked against each other.

#### Diagram: AUC Pair Explorer

<details markdown="1">
<summary>AUC Pair Explorer</summary>
Type: microsim
**sim-id:** fidelity-auc-pair-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Understand (L2)
Bloom Verb: explain

Learning objective: Learners will explain AUC as the probability that a random successful learner outranks a random unsuccessful one, by connecting the ROC curve to a live count of correct pairs.

Layout: The left half shows a strip of 40 synthetic learners as dots sorted by forecast, green for correct held-out answers and orange for incorrect. The right half shows the ROC curve with a movable cutoff point and the shaded area under it.

Controls: A slider for the cutoff (0 to 1, step 0.01); a slider for model signal strength (0 to 1, default 0.6); a "Draw random pair" button that picks one green and one orange dot and highlights which one the model ranked higher; a "Draw 100 pairs" button.

Data: A synthetic cohort of 40 learners, regenerated when the signal slider moves. A readout shows the computed AUC, the running fraction of random pairs won, and the cutoff's true-positive and false-positive rates.

Interactions: Moving the cutoff slides a vertical line along the strip and moves the point on the ROC curve. Repeated pair draws converge visibly on the AUC value. At signal strength 0 the curve lies on the diagonal and the readout shows about 0.5.

Responsive design: The two panels sit side by side on wide screens and stack vertically on narrow ones; the canvas width follows the container and re-lays out on window resize.

Implementation: p5.js sketch with seeded random generation, ROC computed in the sketch, and DOM sliders and buttons.
</details>

## Correlation With Assessment

A simpler summary is the **correlation with assessment**: the Pearson correlation between the predicted mastery values and the held-out scores, for example a 0 or 1 per item or a percentage on a longer assessment. It is popular because it needs no threshold and works for graded scores as well as right-or-wrong items. On the synthetic cohort the correlation between forecast and held-out outcome is 0.41.

Its limits deserve saying plainly. Correlation measures how well a straight line relates the two quantities, so it says nothing about calibration: a model that multiplies every forecast by 0.5 keeps the same correlation while being badly miscalibrated. It is also sensitive to a few extreme learners. Use it as a quick sanity check and a way to compare against published studies, never as the only score.

## Stability Across Sessions

A model can look good on one occasion and poor on the next. **Stability across sessions** is whether the fidelity metrics stay about the same when the evaluation is repeated on different class sessions, dates or sections. A result that swings widely between sessions cannot be relied on, even if its average is high, because the next classroom might be the bad one.

The worked example splits the synthetic cohort into its first 100 learners and its last 100. The AUC is 0.777 for the first half and 0.714 for the second. Every learner was generated by the same process, so the 0.06 gap is pure sampling noise. That is the yardstick: real between-session differences must be larger than this noise before they signal a problem with the model or the instrumentation.

## The Sample Size Requirement

The **sample size requirement** is the number of learners and held-out answers needed before a fidelity number is worth reporting. Small samples produce metrics that move a lot from one draw to the next. To measure that uncertainty, the worked example resampled the cohort with replacement 500 times, a method called the bootstrap, and recorded the middle 95 percent of the resulting AUC values.

| Synthetic cohort size | AUC | 95 percent bootstrap interval |
|-----------------------|-----|-------------------------------|
| 50 | 0.758 | 0.612 to 0.885 |
| 200 | 0.743 | 0.676 to 0.810 |
| 1000 | 0.776 | 0.746 to 0.802 |

At 50 learners the interval spans 0.27, wide enough to contain both "useless" (near 0.6) and "excellent" (near 0.9). At 200 it narrows to about 0.13, and at 1000 to about 0.06. The point estimates barely move; the confidence in them does. This gives a practical rule: plan the sample size before the study, by deciding how narrow an interval you need and simulating or resampling to see what cohort size delivers it. The numbers above are for this synthetic setup only, and a real study must recompute them, since noisier answers or fewer items per learner widen the intervals.

## Confounding Factors and Threats to Validity

**Confounding factors** are conditions that influence both the stream and the assessment outcome, so that a link between them can appear without the stream carrying real information about mastery. Suppose a class that meets in the morning spends longer on the MicroSim and also scores higher, because of the teacher or the time of day. The model would seem to predict mastery from dwell time when it is really detecting the class. Other confounders in this setting include prior knowledge, reading speed, device type, whether the MicroSim was assigned or optional, and whether the teacher hinted during the assessment.

**Threats to validity** are the broader set of reasons a conclusion might not hold. They include confounding, but also leakage of assessment answers into the forecast, an assessment that does not really test the concept, a sample that does not represent the learners you care about, and repeated peeking at results until a good one appears. The table below summarizes the threats most relevant to this book's question and one defense for each.

| Threat | How it shows up | Defense |
|--------|-----------------|---------|
| Leakage | Forecast used statements after the assessment | Fix the cutoff time in the protocol |
| Confounding | A class or teacher effect drives both stream and score | Compare within class, or record and adjust for it |
| Weak criterion | The assessment tests wording, not the concept | Use transfer items with reviewed alignment |
| Unrepresentative sample | Volunteers are keener than typical learners | Report who was included and who was not |
| Result shopping | Metrics chosen after seeing the data | Fix the metrics in the protocol beforehand |

!!! mascot-warning "Correlation From the Classroom, Not the Learner"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    If all your high-engagement learners sit in one section, you cannot tell whether the stream predicted mastery or merely identified the section. Record the section, and check that the result holds inside each one.

## Interaction Diagnosticity

Chapter 18 introduced diagnostic value: how much one observation moves a mastery estimate. **Interaction diagnosticity** applies the same idea to a whole kind of interaction, measured against the held-out outcome. An interaction is diagnostic to the degree that learners who perform it succeed on the assessment at a different rate from learners who do not. A diagnostic interaction is worth instrumenting and weighting; a non-diagnostic one is noise, however busy the log looks.

The measure is a simple comparison of rates. The counts below are hypothetical, chosen only to show the arithmetic, and are not from any study. Suppose 100 learners used a MicroSim, 40 of whom entered a prediction before running it. Of those 40, 30 passed the held-out item, a rate of 0.75. Of the other 60, 18 passed, a rate of 0.30. The ratio of the two rates is 2.5, so making a prediction first would look strongly diagnostic. Whether that survives a check for confounders, such as stronger learners being more willing to predict, is exactly what the previous section warns about.

## Fidelity-Driven Instrumentation

**Fidelity-driven instrumentation** means designing what a MicroSim emits according to what the evaluation will need, instead of emitting whatever is easy. Working backward from the protocol gives concrete requirements. Each item must carry the concept identifier that the held-out assessment also uses, so events and outcomes can be joined. Answers must keep their attempt order, which the runtime supports by passing answers through unchanged even in compact mode while folding other events. And events below the runtime's noise thresholds must be left out, as Chapter 16 explains: a hover under 600 milliseconds, a click under 250 milliseconds and a page glance under one second are not treated as evidence.

Two additions come from the evaluation itself. First, record enough context to check confounders, such as the section or session, using the identifiers the design already permits and honoring its privacy rules. Second, include at least one transfer item per concept so the held-out assessment can be built from material the stream did not train on. Chapter 17 shows how to add the instrumentation itself; this chapter supplies the reasons for choosing what to add.

## Concept Coverage Gap

A **concept coverage gap** is a concept for which the evaluation lacks either stream evidence or a held-out outcome, so its fidelity cannot be measured at all. It is a different problem from poor fidelity. Poor fidelity is a measured result; a gap is an absence, and it is easy to miss because the concept simply disappears from every summary table.

Detecting gaps needs a cross-check. For each concept in the learning graph, count the instrumented interactions and the held-out items, and flag any concept with none of either. The table below shows the check on a hypothetical three-concept book.

| Concept (hypothetical) | Instrumented answers | Held-out items | Status |
|------------------------|----------------------|----------------|--------|
| Concept A | 40 | 3 | Measurable |
| Concept B | 0 | 2 | Gap: no stream evidence |
| Concept C | 25 | 0 | Gap: no outcome to predict |

Report the gaps alongside the metrics. A fidelity claim about "the book" that quietly covers only concept A is not a claim about the book.

## Measured Versus Designed Claims

This book's honesty rules divide statements into three kinds. **Measured versus designed claims** is the discipline of labeling each statement as one of them. A measured claim states a result that was actually observed and can be repeated. A designed claim states what a system is built or specified to do. A hoped-for claim states what its authors expect but have not tested. Chapter 18 applied this three-way split to the mastery pipeline, and the same test applies here to every sentence about prediction quality.

Applying it to this chapter shows how much is missing. The synthetic AUC of 0.743 is a measured result, but about a simulation whose rules we wrote, so it says the evaluation code works, not that real learners behave that way. The specification of the held-out protocol is designed. That real MicroSim streams predict real mastery is hoped for. The interactive below lets you practice sorting sentences.

#### Diagram: Claim Sorter

<details markdown="1">
<summary>Claim Sorter</summary>
Type: microsim
**sim-id:** fidelity-claim-sorter<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Evaluate (L5)
Bloom Verb: classify

Learning objective: Learners will classify statements about the xAPI stream as measured, designed or hoped for, and justify the classification by pointing to the evidence that would be required.

Layout: A stack of sentence cards at the top and three labeled drop zones below: "Measured", "Designed" and "Hoped for". A feedback panel on the right shows an explanation for the last card placed.

Controls: Drag a card into a zone, or select a card and press a zone button for keyboard use; a "Check all" button; a "Shuffle" button; a "Reset" button.

Data: About ten cards, each with a correct label and a one-sentence explanation. Examples include "The synthetic cohort's AUC is 0.743" (measured, about a simulation), "The LRS design chooses Bayesian knowledge tracing" (designed), "MicroSim streams predict real mastery" (hoped for), and "No emitter sends statements to a store yet" (measured, as recorded in the repository's TODO file).

Interactions: A correct placement turns the card green and shows its explanation. An incorrect placement returns the card and shows a hint naming the evidence a measured claim would need. A counter shows how many cards are correctly placed.

Responsive design: Cards and zones reflow to a single column on narrow screens, and the canvas width follows the container on window resize.

Implementation: p5.js with drag-and-drop and a keyboard-accessible fallback using buttons.
</details>

## Reporting Prediction Quality

**Reporting prediction quality** is writing up a fidelity result so that a reader can interpret and check it. The protocol supplies most of the content. A complete report states, in order:

1. The prediction target, the evidence window and the held-out assessment, including how it was separated from practice.
2. The sample: how many learners and answers, who was included, and how many were excluded and why.
3. The baseline forecast and the model's accuracy, Brier score, AUC and calibration table, with bin counts.
4. Uncertainty for each metric, such as bootstrap intervals, and stability across sessions.
5. Confounders examined and threats that remain.
6. Concept coverage gaps.
7. A plain statement of what is measured, designed and hoped for.

A sentence built from those parts might read, using only this chapter's synthetic figures: "On a synthetic cohort of 200 simulated learners, BKT with the generating parameters reached an AUC of 0.743 (bootstrap 95 percent interval 0.676 to 0.810) and a Brier score of 0.195 against 0.232 for the base-rate baseline; this demonstrates the evaluation procedure and says nothing about real learners." The final clause is not optional: it is what keeps a correct number from becoming a false claim.

!!! mascot-tip "Write the Limits Sentence First"
    ![Bounce giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Before you write the results, write the sentence that says what the results cannot show. It is easier to be honest before you know whether the numbers look good.

## Chapter Summary

- An **evaluation protocol** fixes the target, evidence window, held-out outcome, metrics, sample plan and validity checks before anyone looks at results.
- A **held-out assessment** is never used by the model, and a **transfer item** tests the concept with wording the learner has not practiced.
- **Prediction accuracy** must be reported next to a base-rate baseline, because a model that says "correct" for everyone can score well when most learners succeed.
- The **Brier score** rewards honest probabilities; **calibration** checks that forecasts match observed rates, with bin counts shown; **discrimination** checks ranking, and **AUC** is the chance a random success outranks a random failure.
- **Correlation with assessment** is a quick check that ignores calibration, and **stability across sessions** checks that results hold from one class to the next.
- The **sample size requirement** can be studied by bootstrap: in the synthetic example the 95 percent AUC interval narrowed from 0.27 wide at 50 learners to about 0.06 at 1000.
- **Confounding factors** and other **threats to validity** can create apparent prediction where none exists; **interaction diagnosticity** compares success rates with and without an interaction, and **fidelity-driven instrumentation** designs what MicroSims emit around the protocol.
- A **concept coverage gap** is an absence of evidence or outcomes, not a poor result, and **measured versus designed claims** must be labeled, since no real learner data exist yet.
- **Reporting prediction quality** means giving the sample, baseline, metrics with uncertainty, threats, gaps and the measured-designed-hoped-for split.

!!! mascot-celebration "You Can Test a Prediction Honestly"
    ![Bounce celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now design a held-out evaluation, score it with accuracy against a baseline, Brier score, calibration and AUC, and report the result with its limits. Every bounce leaves evidence, and now you know how to check what it is worth.

The next chapter turns from evaluating the stream to storing it, beginning with the architecture and ingestion path of the full Learning Record Store.

