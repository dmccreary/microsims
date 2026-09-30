---
title: Compact Session Folding Lab
description: Drive a small practice MicroSim and watch the same interactions arrive as separate statements in Full mode but fold into one session summary in Compact mode, while checked answers pass through unfolded.
image: /sims/compact-session-folding-lab/compact-session-folding-lab.png
og:image: /sims/compact-session-folding-lab/compact-session-folding-lab.png
twitter:image: /sims/compact-session-folding-lab/compact-session-folding-lab.png
social:
   cards: false
quality_score: 100
---

# Compact Session Folding Lab

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the Compact Session Folding Lab Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A MicroSim can report in two modes. In **Full mode** it emits one xAPI statement per meaningful
interaction: every slider step past its deadband, every Start or Pause press, and every run
between them. In **Compact mode** the runtime (`lrs-lite-sim.js`) folds those same events into
an in-memory session and emits a single `experienced` **session summary** when a **Loss of
Focus Event** ends the session. The summary carries `statements_represented`, so the
compression stays visible.

One rule cuts across both modes: **answers are never folded**. A checked answer is emitted
immediately as its own `answered` statement in both modes, keeps its place in the order of
attempts, and does not change `statements_represented`. An answer does open a session,
though, so a visit with only an answer ends in a summary with `statements_represented: 0`.

The left pane is a tiny practice MicroSim: a ball bouncing under adjustable gravity, a
Start/Pause button and a two-choice question. The two columns on the right list the statements
each mode emits. Four buttons simulate the loss-of-focus signals from the chapter: **Hide tab**
(`visibilitychange`), **Scroll away 10 s** (`IntersectionObserver`), **Sit idle 90 s** (no
input while the sim is not running) and **Click Done** (an explicit `end()`). Hover any
statement to see why it was or was not folded.

**Learning objective:** The learner will distinguish which interactions Compact mode folds into
a session summary, which pass through as their own statements, and which Loss of Focus Event
ends the session.

**Bloom's taxonomy level:** Analyze (verb: *distinguish*)

## How to Use

1. Drag the **Gravity** slider five steps. Each step adds an `interacted` statement to the Full
   column, while the Compact column only updates the open session card.
2. Press **Start**, wait, then press **Pause**. Full mode adds two presses and one
   `experienced` run; the card counts one more run.
3. Choose an answer and press **Check**. An `answered` statement appears in both columns at
   once, and the card's `statements_represented` does not change.
4. Press **Sit idle 90 s** while the ball is running. Nothing happens: a running sim counts as
   busy. Pause, then press **Scroll away 10 s** to close the session. Compare the totals.
5. Press **Reset lab**, answer the question without touching anything else, then press
   **Hide tab**. The summary represents 0 statements.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/compact-session-folding-lab/main.html"
        height="602px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development).

### Duration

15-20 minutes

### Prerequisites

- The three verbs a MicroSim emits: `interacted`, `experienced` and `answered` (Chapter 16)
- Deadbands and the author API of the xAPI runtime (Chapter 17)
- Full mode and Compact mode (Chapter 22)

### Activities

1. **Reproduce the worked example (5 min):** Make 5 slider steps, press Start, wait, press
   Pause, then press Hide tab. Confirm the chapter's table: 8 statements in Full mode, 1 in
   Compact mode with `statements_represented: 8`.
2. **Sort the events (5 min):** Make a two-column list, "folded" and "passes through". Place
   slider steps, presses, runs, answers and the session end in the right column, testing each
   one in the lab.
3. **Probe the edge cases (5 min):** Find out what happens when you press Sit idle 90 s during
   a run, when you press a focus-loss button with no session open, and when a session holds
   only an answer.
4. **Explain (3 min):** In two sentences, explain why answers are never folded, using the
   words "order" and "evidence".

### Assessment

- Given a sequence of interactions, the learner predicts the statement count in each mode and
  the summary's `statements_represented`.
- The learner names which Loss of Focus Event closed a session and explains why Idle does not
  fire while a sim is running.
- The learner explains why `answered` statements appear in both streams and never inside the
  summary.

## References

1. [Experience API](https://en.wikipedia.org/wiki/Experience_API) - Wikipedia. The statement
   format and verbs used in both streams.
2. [xAPI specification](https://github.com/adlnet/xAPI-Spec) - Advanced Distributed Learning
   (ADL) on GitHub. Statement structure, results and extensions.
3. [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) -
   MDN Web Docs. The `visibilitychange` event behind the Hide tab signal.
4. [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) -
   MDN Web Docs. The mechanism behind the Scroll away signal.
5. [p5.js reference: createRadio](https://p5js.org/reference/p5/createRadio/) - p5.js. The
   control used for the practice question.
