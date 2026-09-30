---
title: Contract Violation Finder
description: Critique eight candidate xAPI statements against the nine rules of the MicroSim producer contract, flagging each violating field and justifying it by section number.
image: /sims/contract-violation-finder/contract-violation-finder.png
og:image: /sims/contract-violation-finder/contract-violation-finder.png
twitter:image: /sims/contract-violation-finder/contract-violation-finder.png
social:
   cards: false
quality_score: 100
---

# Contract Violation Finder

<iframe src="main.html" height="802px" width="100%" scrolling="no"></iframe>

[Run the Contract Violation Finder MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The producer contract gathers the rules every MicroSim statement must follow. This MicroSim turns
the contract audit from Chapter 16 into practice. Each of eight candidate statements is shown as
JSON, one field per row, with a one-line scenario saying what the learner did. Some statements are
valid; others hide one to three planted violations, twelve in all, such as:

- a `main.html` identifier, a missing trailing slash, or a local `127.0.0.1` origin (section 1)
- a shuffled quiz question named by its position, `#q3` (section 2)
- a `completed` verb, an `answered` with no `success`, or an `experienced` with no `duration`
  (section 3)
- a missing `grouping` (section 4)
- a slider typed as a MicroSim (section 5)
- a 120 ms run that still produced an `experienced` statement (section 7)

You flag the rows you suspect and link each flag to the rule it breaks. **Check my answer**
marks every flag as correct or a false alarm, shows the violations you missed, and explains
each rule in one sentence. The score (found, missed, false alarms) runs across the whole set.

**Learning objective:** The learner will critique a candidate xAPI statement against the
producer contract's rules and justify each violation by section number.

**Bloom's taxonomy level:** Evaluate (verb: *critique*)

## How to Use

1. Read the scenario, then read the statement row by row against the rules on the right (below
   the statement on narrow screens).
2. Click a row you think breaks a rule. It turns orange and becomes the selected flag.
3. Click the rule (section) it breaks. A row can break more than one rule; click each one.
   Click the selected row again to remove its flag. The keys **1** to **9** also toggle rules.
4. Keyboard users can pick a row and a rule from the two dropdowns and press
   **Flag row with rule**.
5. Stuck? **Show hint** highlights the section of the statement that still hides a violation.
6. Press **Check my answer**, read the findings, then **Next statement**. Two of the eight
   statements are valid: leaving them unflagged is the right critique.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/contract-violation-finder/main.html"
        height="802px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development).

### Duration

20-25 minutes

### Prerequisites

- The five parts of an xAPI statement and the three MicroSim verbs
- Activity IRIs, the canonical site URL and sub-activity fragments (Chapter 16)
- The producer contract's nine-rule summary table (Chapter 16)

### Activities

1. **Audit alone (12 min):** Work through all eight statements without hints. Before you check,
   write the section number of every flag in your notes.
2. **Compare critiques (6 min):** With a partner, compare false alarms. For each one, find the
   rule you thought was broken and explain why the row actually satisfies it.
3. **Write the fix (5 min):** For three violations you found, write the corrected field, for
   example the fragment `#q-mitochondrion` instead of `#q3`, and name the rule it now satisfies.

### Assessment

- The learner finds at least 10 of the 12 planted violations with the correct section number.
- The learner makes no more than two false alarms across the set, and leaves both valid
  statements unflagged.
- For any violation, the learner states the consequence of leaving it in place (for example, a
  split page rollup or an attempt count of zero).

## References

1. [xAPI Specification, Part Two: Experience API Data (version 1.0.3)](https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md) - ADL. The statement, activity and context structure the contract builds on.
2. [Experience API](https://en.wikipedia.org/wiki/Experience_API) - Wikipedia. Overview of xAPI statements and learning record stores.
3. [Internationalized Resource Identifier](https://en.wikipedia.org/wiki/Internationalized_Resource_Identifier) - Wikipedia. The identifier format used for verbs and activities.
4. [URI fragment](https://en.wikipedia.org/wiki/URI_fragment) - Wikipedia. The part after `#` that names a sub-activity.
