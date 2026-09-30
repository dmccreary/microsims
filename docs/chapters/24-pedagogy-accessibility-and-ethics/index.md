---
title: Pedagogy, Accessibility and Ethics
description: Covers the teaching methods, accessibility practices, equity concerns and data ethics that decide whether an instrumented MicroSim helps every learner without exposing them.
generated_by: claude skill chapter-content-generator
date: 2026-09-30 11:38:10
version: 1.10
---

# Pedagogy, Accessibility and Ethics

## Summary

Covers the pedagogical, accessibility, equity and ethical foundations for MicroSims that collect learner data, including Universal Design for Learning, privacy and bias in prediction.

Students learn PRIMM, semantic waves, keyboard operability, low-bandwidth design and the ethical use of predictions. After it, they can review a MicroSim for accessibility and data-ethics risks.

## Concepts Covered

This chapter covers the following 13 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| Scaffolding | 2 |
| Universal Design for Learning | 8 |
| PRIMM Method | 1 |
| Semantic Waves | 1 |
| Active Learning | 4 |
| Accessibility Standards | 3 |
| Keyboard Operability | 2 |
| Equity Considerations | 4 |
| PII Surface | 4 |
| Ethical Use of Predictions | 5 |
| Bias in Prediction | 2 |
| Accessibility Check | 1 |
| Low-Bandwidth Design | 1 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: What Is a MicroSim](../01-what-is-a-microsim/index.md)
- [Chapter 3: Learning Objectives and Bloom's Taxonomy](../03-learning-objectives-and-blooms-taxonomy/index.md)
- [Chapter 6: p5.js MicroSims](../06-p5js-microsims/index.md)
- [Chapter 13: Quality Assurance and Automated Layout Review](../13-quality-assurance-and-automated-layout-review/index.md)
- [Chapter 16: xAPI Statements and Evidence](../16-xapi-statements-and-evidence/index.md)
- [Chapter 18: Mastery Prediction and Knowledge Tracing](../18-mastery-prediction-and-knowledge-tracing/index.md)
- [Chapter 20: The Full LRS: Architecture and Ingestion](../20-the-full-lrs-architecture-and-ingestion/index.md)

---

!!! mascot-welcome "Build Sims That Work for Everyone"
    ![Bounce waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    A MicroSim that only some learners can operate, or that quietly exposes them, is not finished, however nicely it bounces. By the end of this chapter you will be able to review any MicroSim for teaching quality, accessibility and data-ethics risks before it reaches a classroom. Let's bounce it around!

The earlier chapters taught you to build MicroSims and to make them report evidence. This chapter asks whether they should, and for whom. Every technical choice so far has a human side: a slider that a learner cannot reach with a keyboard, a statement that carries a name, a mastery estimate that misreads a student who learns differently. We start with the teaching methods that make a simulation worth using, move to accessibility and equity, and finish with the privacy and ethical questions that instrumentation raises.

## Teaching Methods That Fit MicroSims

### Active Learning

**Active Learning** is instruction in which learners do something with the material, such as predicting, manipulating, explaining or deciding, rather than only listening or reading. A MicroSim is active by construction, because the learner changes a parameter and immediately sees the model respond. The book's research base includes reviews of active learning by Freeman and colleagues (2014) and by Prince (2004), and the design framework treats them as support for building simulations that ask for learner action. Those studies concern instruction generally, not MicroSims in particular, and no learner data has been collected through MicroSims yet. So the claim this book can make is that MicroSims are a good vehicle for active learning, not that they have been shown to improve outcomes.

### Scaffolding

**Scaffolding** is temporary support that lets a learner do a task they could not yet do alone, and that is withdrawn as skill grows. The paper's review of PhET research reports that both extremes underperform: fully prescriptive step-by-step procedures and completely unguided exploration. The approach it describes as best is minimal but strategic guidance, for example a challenge such as "find three ways to make the bulb brighter."

Applying this to a MicroSim means choosing the amount of guidance deliberately. A worked example for the bouncing ball from Chapter 1 shows the range:

- **Too much:** "Move the gravity slider to 1.5. Now click Drop Again. Write down the bounce height."
- **Too little:** an open canvas with no prompt at all.
- **Scaffolded:** "Find a gravity setting where the ball never rises above half its starting height. What did you change, and why did that work?"

Later, the same task can drop the hint about what to change, which is scaffolding fading. The Chapter 3 objective levels help here: early tasks sit at Remember and Understand with more guidance, and later tasks at Analyze and Create with less.

### PRIMM Method

The **PRIMM Method** is a five-stage sequence: Predict, Run, Investigate, Modify, Make. The design framework builds each generated lesson plan on it. Learners first predict what a simulation will do, then run it and compare, investigate why the outcome occurred, modify parameters or code, and finally make a new variation of their own. The Predict stage is the one instrumentation can observe most cleanly, because a "Predict first" control such as the one in the Chapter 1 specification can record a hypothesis before the result appears. Chapter 16 shows how a hypothesis control is reported as an interaction rather than an answer.

### Semantic Waves

**Semantic Waves** describe how good explanations move between abstract and concrete. The design framework says a MicroSim unpacks an abstract concept into a tangible interaction and then repacks it into a generalized statement, so that understanding transfers beyond the one example. A PRIMM sequence traces such a wave: the prediction is abstract, running the sim is concrete, investigating moves back toward the general rule, and making applies the rule in a new setting. The lesson to draw is practical. A MicroSim that stays concrete leaves learners with a memory of one animation, and a page that stays abstract never gives them anything to grip.

The next specification lets you see the two ideas together, so the description above becomes something you can manipulate.

#### Diagram: PRIMM Semantic Wave Explorer

<details markdown="1">
<summary>PRIMM Semantic Wave Explorer</summary>
Type: microsim
**sim-id:** primm-semantic-wave-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: relate): The learner will relate each PRIMM stage to a point on a semantic wave and identify which stage a given lesson activity belongs to.

Layout: a drawing region above a control region. The drawing region shows a horizontal axis of five labeled stages (Predict, Run, Investigate, Modify, Make) and a vertical axis running from "concrete" at the bottom to "abstract" at the top. The control region is white with a silver divider.

Data: a fixed wave drawn as a smooth curve through five points, one per stage, with Predict and Investigate higher than Run. The heights are illustrative and the sim states this on screen.

Controls:

- Five stage buttons that highlight the matching point on the curve and show a two-sentence description with one bouncing-ball activity
- Dropdown "Lesson activity" with six sample activities (for example "Write a guess before dropping the ball"); the learner drags the activity onto the stage where it belongs and receives immediate feedback
- Button "Reset"

Behavior: a correct placement turns the stage green and shows why; an incorrect one shows the stage the activity most resembles and the reason.

Responsive design: the canvas width follows the container width on every window resize, the stage buttons wrap to two rows under 500 pixels, and all controls remain reachable by keyboard.

Implementation: p5.js with createButton and createSelect controls positioned relative to the drawing height. Include a describe() call summarizing the current wave position.
</details>

!!! mascot-thinking "The Wave Is the Point"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Notice that a MicroSim is not the whole wave, it is the concrete trough in the middle of one. If the surrounding page never asks the abstract question before and after, the sim alone will not carry the learning.

## Designing for Every Learner

### Universal Design for Learning

**Universal Design for Learning**, abbreviated UDL, is a framework that asks designers to plan for learner variability from the start instead of retrofitting adjustments for individuals. It organizes design around three principles: multiple means of engagement (why a learner cares), multiple means of representation (how content is presented), and multiple means of action and expression (how a learner shows what they know). The design framework claims that responsive layouts, adaptable controls and multimodal interfaces support these principles. That is a design intention. Whether particular MicroSims deliver it has not been audited in this book, and Chapter 13 tested layout, not learner variability.

A concrete mapping shows what the three principles ask of a single simulation:

| UDL principle | Question for the MicroSim | Example design response |
|---------------|---------------------------|--------------------------|
| Engagement | Can learners choose a challenge level? | A "Predict first" checkbox and an optional hint button |
| Representation | Is the model shown in more than one form? | A graph beside the animation, plus a text readout and a `describe()` summary |
| Action and expression | Can learners respond in more than one way? | Slider or typed value; keyboard or pointer; choice or short explanation |

Read the table as a review lens, not a checklist to satisfy mechanically. A simulation that offers three representations but hides them behind a menu no keyboard user can open has met the letter of the table and missed its purpose. The same principle explains why the later sections ask about operability and bandwidth as design questions, not as afterthoughts.

### Accessibility Standards

**Accessibility Standards** are published, testable criteria for whether people with disabilities can perceive, operate and understand web content. The design framework names WCAG 2.1 level AA as its target, which is the Web Content Accessibility Guidelines standard from the World Wide Web Consortium, and Chapter 8 already tied the 4.5 to 1 text contrast ratio to it. The framework also lists concrete provisions: never conveying information through color alone, a `describe()` text alternative for canvas content, and touch targets of at least 44 by 44 pixels. Treat these as the book's stated targets. This chapter did not audit the existing MicroSims against them.

### Keyboard Operability

**Keyboard Operability** means every function a pointer can perform can also be performed from the keyboard, in a sensible focus order, with a visible focus indicator. It matters to learners who cannot use a mouse, to switch and screen reader users, and to anyone on a device without a pointer. Native form controls are focusable and respond to the keyboard without extra work, which is why the standard p5.js `createSlider` and `createButton` controls are a good baseline. A drawing on the canvas is different, because a click handler on a canvas has no keyboard equivalent unless you write one.

The snippet below shows a minimal equivalent for a hypothetical sim. It uses p5.js's `keyPressed()` event function and its built-in `key`, `keyCode` and `LEFT_ARROW` and `RIGHT_ARROW` values. The functions `toggleRun()` and `nudgeGravity()` stand for whatever your sketch already does when its buttons are pressed. Returning `false` stops the browser from also scrolling the page on the space bar.

```javascript
// Keyboard equivalents for pointer actions (toggleRun and nudgeGravity are
// placeholders for the sketch's own functions)
function keyPressed() {
  if (key === ' ') {
    toggleRun();          // same action as the Start / Pause button
    return false;         // keep the page from scrolling
  }
  if (keyCode === LEFT_ARROW) {
    nudgeGravity(-0.1);   // same step size as the slider
  } else if (keyCode === RIGHT_ARROW) {
    nudgeGravity(0.1);
  }
}
```

!!! mascot-warning "A Keyboard Handler Can Hijack the Page"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Because `keyPressed()` listens on the whole page, arrow and space keys can fight with the textbook's own scrolling and with typing in other fields. Handle only the keys you need, and return `false` only for those.

### Accessibility Check

An **Accessibility Check** is a repeatable review of a MicroSim against the standards above, combining automated tools with a person operating the sim. Automated tools catch mechanical failures such as low contrast and missing text alternatives, but they cannot tell whether a description is useful or whether the focus order makes sense. The Chapter 13 layout review already covers contrast by eye. An accessibility check adds four human steps: complete the whole task using only the keyboard, confirm the focus indicator is always visible, read the `describe()` text without looking at the canvas, and confirm no meaning depends on color alone.

#### Diagram: Accessibility Check Walkthrough

<details markdown="1">
<summary>Accessibility Check Walkthrough</summary>
Type: microsim
**sim-id:** accessibility-check-walkthrough<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Evaluate; verb: judge): The learner will judge whether a mock MicroSim passes each of four accessibility checks and justify each verdict with the defect they found.

Layout: a drawing region above a control region. The drawing region shows a small mock simulation (a ball and two controls). A checklist panel on the right lists the four checks: keyboard-only completion, visible focus, text alternative, and no color-only meaning.

Data: three mock variants selected from a dropdown. Variant A has a pointer-only canvas control, variant B has a hidden focus indicator, and variant C passes all four checks. The defects are built into the mock and are not real product findings.

Controls:

- Dropdown "Mock variant" with the three variants
- Toggle "Keyboard only" that disables pointer input on the mock and lights the focus ring when the learner presses Tab
- Toggle "Show description" that displays the text a screen reader would read
- Four pass/fail buttons, one per check, and a "Reveal answers" button

Behavior: after the learner records verdicts, the sim compares them with the built-in defects and explains each mismatch in one sentence.

Responsive design: the canvas width follows the container width on every window resize, the checklist moves below the mock under 600 pixels, and every control is reachable by keyboard.

Implementation: p5.js with createSelect, createCheckbox and createButton controls. Include a describe() call for accessibility.
</details>

### Low-Bandwidth Design

**Low-Bandwidth Design** keeps a MicroSim usable on slow, metered or unreliable connections. The main levers are small page weight, few external libraries, no large images or media, and behavior that still works when a request fails. Every MicroSim already loads a JavaScript library, so choosing one library rather than three is a real saving. The LRS-Lite design supports the same goal from the data side: because each sim condenses its session into a few summary statements and the store lives in the browser, a learner on a poor connection is not asked to stream every event to a server. This is a design property, and no bandwidth measurements exist yet.

!!! mascot-tip "Test on the Worst Device You Can Find"
    ![Bounce giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Open your MicroSim with the browser's network throttled to a slow connection and unplug the mouse. If it still teaches, most learners' conditions are covered.

### Equity Considerations

**Equity Considerations** are the questions about who can actually use and benefit from a MicroSim, given differences in devices, connectivity, language, disability and access to assistance at home. The previous sections are equity work: keyboard operability and low bandwidth decide whether a learner can participate at all. Instrumentation adds a second equity risk, because a learner who shares a family device, uses a screen reader or connects rarely will leave a different kind of evidence trail than one on a fast personal laptop. If the trail is later read as engagement or mastery, differences in access will masquerade as differences in learning. The two sections that follow return to this problem.

## Privacy and Prediction Ethics

### PII Surface

Personally identifiable information, or PII, is any data that can identify a person, alone or combined with other data. The **PII Surface** of an instrumented MicroSim is the set of places where such data can enter, be stored or be shown. Mapping the surface is the first privacy step, because you cannot protect a place you have not listed.

The Chapter 16 summary of the xAPI producer contract gives the design's answer. The actor is the only place personal identity enters the system, and the account name is sent as is, not pre-hashed, because the store derives a pseudonym once using a per-district salt. Producers must never send `district_id`, `student_key`, `stored_at`, `section_id`, `voided_by` or `provisional`. In the current runtime the actor is a placeholder account, `demo-student`, so no real learner identity flows anywhere yet.

Before the next specification, note the shape of a statement it will annotate. The example below is illustrative and trimmed, with an invented account and simplified identifiers:

```json
{
  "actor": { "account": { "homePage": "https://district.example.edu", "name": "student-4471" } },
  "verb": { "id": "http://adlnet.gov/expapi/verbs/answered" },
  "object": { "id": "https://example.org/book/sims/kafka-lab/#q-kafka" },
  "result": { "success": true, "response": "Because my group leader Maria said so" }
}
```

Three places deserve a review. The `actor` holds a real account name. The `object` should identify a page, never a person or a local address. The `result.response` can hold free text, and this example shows the risk: a learner can type a name, or anything else, into a free-text answer. Free text is therefore the least controllable part of the surface, because the designer cannot predict its content. In LRS-Lite, add one more place: the statements sit in browser storage, so on a shared classroom computer another user of the same browser profile could reach them.

#### Diagram: PII Surface Explorer

<details markdown="1">
<summary>PII Surface Explorer</summary>
Type: microsim
**sim-id:** pii-surface-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: classify): The learner will classify each field of an example xAPI statement as no PII risk, pseudonymous, direct identifier or uncontrolled free text, and explain what protects or exposes it.

Layout: a drawing region above a control region. The drawing region displays the illustrative statement from the chapter as a formatted list of fields, each in its own clickable box. The control region is white and holds the classification buttons.

Data: the fields actor.account.homePage, actor.account.name, verb.id, object.id, result.success, result.response and two context fields. The classifications are the chapter's own analysis, not a legal determination, and the sim says so.

Controls:

- Click a field, then choose one of four buttons: "No PII risk", "Pseudonymous", "Direct identifier", "Uncontrolled free text"
- Toggle "Storage location" with two settings, "Full LRS" and "LRS-Lite browser", that changes which extra risks are listed under the statement
- Button "Check my answers"

Behavior: the sim colors each field green when the learner's class matches, amber when it is defensible but differs, and red otherwise, and shows a one-sentence reason. The storage toggle adds the shared-device risk for LRS-Lite.

Responsive design: the canvas width follows the container width on every window resize, and long field values wrap or truncate with a tooltip at narrow widths.

Implementation: p5.js with createButton and createRadio controls. Include a describe() call listing each field and its current classification.
</details>

### Controlling the Surface

Three controls follow from the map. First, minimize: emit only what the three verbs and the evidence classes in Chapter 16 need, and avoid free-text capture when a choice will do. Second, separate: the LRS design keeps identity behind its own boundary, so downstream components see a pseudonymous student key and not a name. Third, suppress and audit: the Full LRS design hides any report cell built from fewer than the district's threshold, 10 students by default, and logs each read of PII-adjacent data. Chapter 21 notes the suppression filter, audit log and erasure path are designed but not built, so treat them as requirements to verify, not guarantees.

Law enters at this point, and this book describes it only in general terms. In the United States, FERPA governs student education records, and it gives parents and eligible students access rights. COPPA adds verifiable parental consent for services that collect personal information from children under 13. The EU's GDPR is best known here for its right to erasure. The LRS design implements one mechanism for deletion, and the district chooses the policy profile that decides when it applies. This is not legal advice. A district's counsel decides what applies, and a MicroSim author should ask before collecting anything beyond the design's minimum.

!!! mascot-warning "Anonymous Is Not the Same as Pseudonymous"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A pseudonym still points to one person for whoever holds the mapping, so it is protection, not anonymity. If a design says "anonymous," ask who can reverse it, and say "pseudonymous" unless the answer is nobody.

### Bias in Prediction

**Bias in Prediction** is a systematic difference in how well a model's estimates fit different groups of learners, so that some are mis-estimated more often or in a consistent direction. Chapter 18's mastery model turns evidence into an estimate, and Chapter 19 proposes evaluating that estimate. Neither chapter has learner data, so the following are hypotheses to check and not findings.

- **Evidence that assumes a pointer.** The hover threshold is 600 milliseconds. A learner who explores by keyboard or screen reader may never generate hover evidence, and the model could read less activity as less understanding.
- **Access as engagement.** A learner with a slow connection or a shared device may have shorter or fewer sessions. LRS-Lite adds browser storage risks such as eviction, which can erase history.
- **Uncalibrated thresholds.** The non-evidence thresholds are design judgments, not values fitted to any population.

The evaluation method is straightforward to state. Once data exists, compute the same prediction-error measure separately for each group, such as learners using assistive technology or shared devices, and compare. A gap that the pooled average hides is a bias signal. Groups small enough to fall under the suppression threshold cannot be reported, which limits how well this can be done, and that limit itself should be disclosed.

#### Diagram: Prediction Fairness Explorer

<details markdown="1">
<summary>Prediction Fairness Explorer</summary>
Type: chart
**sim-id:** prediction-fairness-explorer<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Learning objective (Bloom level: Evaluate; verb: critique): The learner will critique a mastery prediction by comparing its error across learner groups, and decide whether a pooled average hides a gap.

Layout: a bar chart in the drawing region with one pair of bars per group, plus a control region below. A banner states in plain text that all numbers are synthetic and invented to illustrate the method, and that no real learner data has been collected.

Data: a synthetic table of three groups (for example "Pointer users", "Keyboard users", "Shared device") with an invented count and prediction error for each, and a pooled average line.

Controls:

- Slider "Threshold" from 5 to 20, default 10, that hides any group with fewer learners than the threshold
- Dropdown "Scenario" with "Even error", "Hidden gap" and "Small group"
- Toggle "Show pooled average"
- Button "Reset"

Behavior: in the "Hidden gap" scenario the pooled average looks acceptable while one group's bar is much taller. In "Small group," raising the threshold suppresses that group, and a message explains that the gap can no longer be seen.

Responsive design: the chart resizes with its container on window resize, bar labels rotate under 500 pixels, and a text table of the data is available for screen reader users.

Implementation: Chart.js bar chart with a data table fallback and an aria-label on the canvas.
</details>

### Ethical Use of Predictions

The **Ethical Use of Predictions** is the discipline of deciding what a mastery estimate may be used for, who sees it, and what a learner can do about it. The design already models one safeguard: the Chapter 21 at-risk roster is described as resting on unvalidated mastery estimates, so a flag is a prompt for a conversation and not a finding. Four commitments extend that idea.

1. **Predictions are hypotheses.** State the status of the model in every place its output appears, and separate measured from designed from hoped for, as Chapter 18 does.
2. **A person decides.** No estimate should by itself place, grade, label or discipline a learner. A teacher reviews it against what they know.
3. **Purpose is limited.** Data collected to improve a MicroSim should not be reused to rank learners or teachers without a new decision.
4. **Learners can see and contest.** A learner or family should be able to ask what is recorded and why an estimate was made, and a wrong estimate should be correctable.

A short worked example applies them. Suppose a dashboard flags a student because activity dropped sharply. Commitments 1 and 2 send the teacher to ask first whether the student had device or connectivity trouble, or uses a keyboard route the evidence model handles poorly, before concluding anything about mastery. The decision remains the teacher's, and the flag remains a question.

!!! mascot-encourage "This Is Hard, and That Is Normal"
    ![Bounce encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    Ethics questions rarely have a clean answer, and reasonable people weigh them differently. Start with the four commitments as questions to ask about one sim, and revisit a prerequisite chapter whenever a term is unclear.

## Putting the Review Together

A review of an instrumented MicroSim can now combine the sections into one pass. Ask what the sim asks the learner to do, and whether the guidance suits the learner's level. Ask whether every function works from the keyboard, with a usable description and sufficient contrast. Ask how it behaves on a slow connection. List every field that could identify a person, and check that free text is minimized. Finally, ask what any downstream prediction may and may not be used for, and whether groups with different access are treated fairly. Each question maps to a concept in this chapter.

!!! mascot-celebration "Review Skills Unlocked"
    ![Bounce celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now review a MicroSim for scaffolded PRIMM design, keyboard operability, the PII surface of its statements and the ethical limits of any prediction built on them. That is a review most tool builders never do.

## Chapter Summary

- **Active Learning** is what MicroSims are built for, but the research cited is about active learning generally, and no MicroSim learner data exists yet.
- **Scaffolding** should be minimal but strategic, and fade as skill grows. **PRIMM Method** and **Semantic Waves** give the sequence and the movement between concrete and abstract.
- **Universal Design for Learning** plans for variability through engagement, representation, and action and expression.
- **Accessibility Standards** in this book target WCAG 2.1 AA, and **Keyboard Operability** must be built into canvas interactions deliberately. An **Accessibility Check** combines automated tools with human tests.
- **Low-Bandwidth Design** and **Equity Considerations** decide who can use a sim at all, and how their evidence should be read.
- The **PII Surface** is every place identity can enter, be stored or be shown, with free text the hardest to control. The suppression, audit and erasure mechanisms are designed but not built.
- **Bias in Prediction** should be checked by comparing error across groups once data exists, and **Ethical Use of Predictions** keeps a person in charge of every consequential decision.
- Nothing here is legal advice. Districts and their counsel decide what FERPA, COPPA and GDPR require.

Chapter 25 puts these skills to work in a capstone, where you build an instrumented MicroSim portfolio and review it against this chapter's checks.
