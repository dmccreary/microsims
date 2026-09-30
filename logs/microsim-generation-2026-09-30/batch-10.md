# Batch 10 gap notes

Sims: three-verb-classifier, contract-violation-finder, evidence-class-sorter,
evidence-threshold-lab, policy-precedence-resolver, guarded-call-runtime-toggle,
evidence-stream-to-prediction-pipeline, bkt-parameter-lab (chapters 16-18, all p5.js).

Helpers (scratchpad, not in the project): `b10_check.py` (copy of b07_check: HTTP server +
Playwright/Chrome at several widths, console errors, scripted clicks/JS/screenshots) and
`b10_meta.py` (copy of b06_meta: writes metadata.json in the flat layout the validator scores),
with one spec file per sim in `b10/meta/`.

## Batch-wide findings

- [decision] Every sim in this batch has controls that must wrap at 400 px, while the iframe height
  is fixed. Instead of reserving the worst-case control rows at every width (which leaves a band of
  empty white under the buttons on desktop), each sketch flow-lays its p5 controls and recomputes
  the split: `controlHeight` = rows needed at the current width, `drawHeight = canvasHeight -
  controlHeight`. `drawHeight + controlHeight` still equals the `// CANVAS_HEIGHT:` value, so
  sync-iframe-heights and the tester are unaffected. The p5 guide only shows a fixed
  `drawHeight`; it has no pattern for "controls wrap at narrow widths inside a fixed-height iframe"
  even though most specs demand "all controls visible at 400 px".
- [decision] `describe(text)` is called without `LABEL`, so no visible description div is added
  under the canvas (batch 06 reported that the LABEL form makes `<main>` taller than the canvas).
- [decision] Statement examples use this book's canonical site URL
  (`https://dmccreary.github.io/microsims/`) for activity IRIs, as Chapter 16 says the IRI must;
  concept identifiers are the runtime demo sims' readable slugs (`adjustable-speed`, ...), which
  Chapter 16 notes the demonstration sims use. The textbook-version IRI
  `https://dmccreary.github.io/microsims/textbook/microsims/v2.0.0` is invented in the form
  Chapter 16 gives (site URL + `textbook/` + id + version) because this book has no
  `lrs-config.js` yet.
- [decision] After the brief added the color-blind rule mid-run, the first five sims were
  re-coloured with the Okabe-Ito palette (as RGB arrays, since the p5 guide's "named colors only"
  rule has no color-blind-safe named set): categorical bins, correct/incorrect marks and
  true/false boxes. Right/wrong is also carried by words, check/cross glyphs or dashed outlines.
  [skill-gap] The p5 guide says "always use named colors, never hex", but CSS named colors contain
  no color-blind-safe categorical palette, so the two rules conflict; the guide should name one
  (for example Okabe-Ito as `[r, g, b]` arrays).
- [skill-gap] `concept-classifier-guide.md` only describes the multiple-choice-with-mascot quiz
  driven by `data.json`. The chapter 16 classifier specs ask for drag-to-bin sorting with a
  keyboard alternative and per-item feedback panels; the guide has no drag-to-bin pattern, so
  these were built from the p5 guide instead (data inline, so the sketch still runs in the p5.js
  editor and from file://).

## three-verb-classifier

```
Instructional Design Check:
- Bloom Level: Apply
- Bloom Verb: classify
- Recommended Pattern: drag-to-bin classifier with a keyboard alternative, immediate rule-based
  feedback (verb, object type, required result field, reason) and a statement preview
- Specification Alignment: aligned
- Rationale: applying the three-verb rules to new events needs many quick classify-then-check
  cycles; showing the resulting JSON ties each classification to the field it requires.
```

- [spec-gap] Only six of the twelve events were given. Invented six more so each bin gets three:
  a correct answer, a different wrong answer (a new attempt), a 2 s run, a run closed by a hidden
  tab (focus loss), a 900 ms node hover and a click-to-pin. Answer key: answered 3, experienced 3,
  interacted 3, no statement 3.
- [spec-gap] The spec's scene has three diagram nodes but its example event sweeps "four nodes".
  Reworded to "sweeps the pointer across all three nodes in under half a second".
- [spec-gap] "Presses Start and Pause 100 ms later" is ambiguous: Chapter 16 says the run emits
  no `experienced` but the two presses may still emit press `interacted` statements. The card is
  keyed to "no statement" (the run) and the feedback says the presses may still be recorded.
  Likewise "Start, 40 s, Pause" is keyed to `experienced`, with the optional presses mentioned.
- [spec-gap] Scoring rule unspecified. Chose one placement per event (first try counts); a wrong
  placement stays in the chosen bin as an outlined "x" chip, and the infobox gives the answer.
  Score reads "Score: n of 12". Chips are clickable to review any event after the round.
- [spec-gap] Mock MicroSim content unspecified: chose Speed slider (3), Start/Pause, nodes
  Velocity/Gravity/Bounce, and a fixed-order prediction "after a bounce the ball rises: A higher,
  B the same, C lower" (answer C), so the question fragment is `#q1`.
- [decision] JSON shows verb, object and result only (as the spec says) in xAPI 1.0.3 shape, with
  full IRIs; short objects are kept on one line so a statement fits the panel; long lines wrap.
  "Show statement" replaces the bins/infobox area with the JSON panel while it is open.
- [decision] Added the chapter's three-verb summary table to the empty infobox on wide screens
  (hidden when there is no room) after the first layout review showed a large empty panel.

## contract-violation-finder

```
Instructional Design Check:
- Bloom Level: Evaluate
- Bloom Verb: critique
- Recommended Pattern: flag-and-justify audit of worked examples against an explicit rule
  checklist, graded per flag (correct / missed / false alarm) with one-sentence explanations
- Specification Alignment: aligned
- Rationale: critique requires judging each field against a criterion and defending the judgment;
  linking every flag to a section number makes the justification itself the graded act, and
  valid statements in the set punish "flag everything".
```

- [spec-gap] The eight statements and their violations were not given, only the ten violation
  kinds. Wrote them (12 planted in all, 2 valid statements): S1 slider typed simulation (§5) +
  parent without trailing slash (§1); S2 local 127.0.0.1 origin (§1) + experienced without
  duration (§3); S3 valid shuffled-quiz answer; S4 verb `completed` (§3) + empty
  contextActivities (§4); S5 shuffled quiz `#q3` (§2) + answered without success (§3); S6 a
  120 ms run with `experienced` (§7); S7 `.../sine-wave/main.html` for a slider (§1 and §2 on the
  same row) + typed simulation (§5); S8 valid 1.4 s hover.
- [spec-gap] "Correct" was undefined when a row is right but the section is wrong. Chose grading
  per (row, section) pair: a planted pair linked = found; a planted pair not linked = missed; a
  linked pair that was not planted, or a flagged valid row with no section, = false alarm.
- [spec-gap] Each statement needs context the JSON cannot carry (is the quiz shuffled? how long
  was the run? was the author previewing locally?). Added a one-line scenario caption per
  statement; without it §2 and §7 violations are undecidable.
- [spec-gap] A missing field (no `success`, no `grouping`) has no row to click. Planted such
  violations on the row where the field belongs (`result`, `contextActivities`).
- [spec-gap] Hint behavior for a valid statement unspecified. It says "no section stands out;
  test every row" rather than highlighting anything.
- [decision] Actor, statement id and display maps are omitted from the candidates to keep one
  field per row readable; §8 and §6 therefore act as distractor rules (the summary says so).
- [decision] Keyboard alternative: Row and Rule dropdowns plus "Flag row with rule", plus keys
  1-9 for rules. Added a "Clear flags" button.
- [decision] Monospace size auto-fits (14 px down to 10 px) so the longest statement fits at
  400 px; badges ("§5 correct", "§2 missed") sit on their own line under the row so they never
  cover the IRI being judged. JSON syntax colors are computed on the whole line before wrapping
  (wrapping first broke string detection and colored the digits in "w3id").
- [decision] CANVAS_HEIGHT 800 (tallest case: narrow screen after checking, with the findings
  panel below the statement).

## evidence-class-sorter

```
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: distinguish
- Recommended Pattern: select-and-sort over the parts of a concrete mock MicroSim, with the
  ordered decision list visible and the deciding question highlighted in the feedback; a
  Full/Compact toggle for contrast; a scored challenge set for transfer
- Specification Alignment: aligned
- Rationale: distinguishing classes means testing each interaction against ordered criteria;
  highlighting the first "yes" makes the reasoning, not just the answer, visible.
```

- [spec-gap] The seven bins omit class 3a (discrete press), yet the decision list has a Reset
  question (4) and the mock has a Reset button. Decision: Reset goes in "Run and pause", labeled
  as class 3a in the feedback, following the chapter ("3a is a variant of class 3").
- [spec-gap] Focus loss has a bin but no decision-list question, and the mock MicroSim has no
  element for it. Added a clickable "Another tab" tab to the mock; its feedback says it is not
  reached by the seven questions because the runtime handles it.
- [spec-gap] Page dwell cannot occur in the mock (it has a Run control), so it appears only in
  the challenge set ("two minutes on a static diagram with no Run control").
- [spec-gap] Only one of the eight challenge events was given. Wrote seven more covering every
  bin: slider drag, 1.2 s node hover, correct Check, tab switch mid-run, static-diagram dwell,
  program redraw after resize, Start-20 s-Pause.
- [spec-gap] "The pointer crosses the diagram in 300 ms" could be read as discrete inspection
  (question 5). Keyed as Not evidence, with the feedback naming question 5 plus the 600 ms
  hover threshold.
- [spec-gap] Compact summary fields per class came from the chapter's class table; the
  program-fired "ball animation" item was added to give the Not-evidence bin an Explore item.
- [decision] Added Item and Bin dropdowns with an Assign button, keys 1-7, and a "Classified:
  n of 7" progress readout in Explore mode (the spec only scores Challenge mode).
- [skill-gap] p5 `createCheckbox()` returns a block-level `<div>`; measured before `.position()`
  it reports the full container width, so a flow layout wrapped every control onto its own
  row on first load. Fix: position every control once before measuring. The p5 guide's
  checkbox example never meets this because it hard-codes x positions.

## evidence-threshold-lab

```
Instructional Design Check:
- Bloom Level: Evaluate
- Bloom Verb: justify
- Recommended Pattern: threshold sliders over a fixed, visible dataset (a scripted session
  timeline) with live recomputation, per-act explanations on hover, and a two-sided cost readout
  (likely noise kept vs likely attention lost) to argue from
- Specification Alignment: modified (one extra act, see below)
- Rationale: a justification needs evidence on both sides of the trade-off; a fixed session makes
  every change attributable to the threshold alone.
```

- [spec-gap] Exact times and durations of the session acts were not given. Chose quick hovers of
  180, 120, 260, 410, 100, 330, 500 and 220 ms in two sweeps; long hovers of 700, 950 and 1200 ms;
  a 120 ms run at 12.5 s; a 40 s run from 15 s; the answer at 57.5 s. Acts are spaced at least
  1.5 s apart so each bar is visible and hoverable at 400 px.
- [spec-gap] Whether a threshold is inclusive was unstated. Used ">= threshold is kept" (the
  chapter's "at least 600 ms", "one second or more"), which puts the safe hover band at
  550-700 ms for this session.
- [decision] Added a 2.4 s page-dwell act beside the spec's 0.7 s one. With only the 0.7 s
  visit, an over-strict glance threshold costs nothing in this session, so the Evaluate task
  had no downside to weigh for that slider.
- [decision] Optional Start/Pause press statements are not listed (they fire regardless of the
  misclick threshold); the run tooltip says so. Including them would add four rows the sliders
  never change.
- [decision] Added a "What each threshold costs" table (likely noise kept / likely attention
  lost) with notes for flood and over-strict settings, and a caveat that "likely" rests on the
  chapter's reasons, not on data. The spec asked only for a readout note on over-strict hover.
- [decision] The object IRIs in the list are abbreviated (`.../sims/gravity-diagram/#velocity`)
  so each statement fits one row; the full-IRI rule is taught in the other chapter 16 sims.

## policy-precedence-resolver

```
Instructional Design Check:
- Bloom Level: Apply
- Bloom Verb: determine
- Recommended Pattern: configure-predict-resolve; the result stays "?" until Resolve so the
  learner commits to a prediction, then a step animation applies the layers bottom-up with
  optional source attribution
- Specification Alignment: modified (a fourth dropdown for the page-option layer)
- Rationale: applying an ordered rule needs many self-checked attempts; hiding the answer until
  Resolve and animating the per-key overwrite makes the procedure itself visible.
```

- [spec-gap] The spec draws five layers but gives dropdowns for only three (book config,
  metadata.json, URL switch), so layer 3 (the `policy` option of `LRSSim.create`) could never
  be set. Added a fourth "Page option" dropdown ([decision]); otherwise the learner applies
  only four of the five layers named in the objective.
- [spec-gap] "Each with choices for the two keys" was ambiguous (two selects per layer, or one
  select of combinations). Chose one select per layer listing the nine combinations ("not set",
  "compact true", ..., "compact false, teaching false").
- [spec-gap] The URL tokens' meaning was not stated. Read `learning-record-store/docs/js/
  lrs-lite-sim.js` `urlPolicy()`: teaching -> teaching true, production -> teaching false,
  full -> compact false, compact -> compact true, tokens combine, and a lone `teaching` also
  sets compact false ("teaching sims start on Full"). The sim mirrors that, marks the implied
  value with an asterisk and a footnote, and offers `teaching,compact` and `production,full`.
- [spec-gap] "Starting state" for Reset was unspecified. Chose the reference book's
  `lrs-config.js` (compact true, teaching false) with the other layers unset.
- [decision] The result shows "?" until Resolve is pressed, and any dropdown change clears it,
  so learners predict before they see the answer. Tooltip text is logged to the console once
  per hovered bar (not every frame).
- [decision] true/false boxes use the Okabe-Ito blue/vermillion pair (and the words), not green
  and red.

## guarded-call-runtime-toggle

```
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: distinguish
- Recommended Pattern: contrasting cases on two factors (runtime present/absent x guarded/
  unguarded), each trigger highlighting the exact line that ran, with an outcome grid that
  fills in as each combination is tried
- Specification Alignment: aligned (grid added)
- Rationale: distinguishing the two styles means seeing that they differ only when the runtime
  is absent; the grid makes the one failing cell stand out against three that run.
```

- [spec-gap] The spec says the unguarded style "stops the ball" when the slider moves, but in
  real p5.js the unguarded `LRSSim.create()` throws in `setup()` at load, so `draw()` never
  starts (Chapter 17: "the sketch would never draw"). Decision: toggling a switch reloads the
  simulated sketch; the unguarded, runtime-off sketch shows "Stopped" with
  `ReferenceError: LRSSim is not defined` at once, and Move slider then shows the second, real
  consequence (`TypeError: Cannot read properties of null (reading 'input')`, because the slider
  was created before the throw and its handler still fires).
- [spec-gap] The code excerpt was not given. Wrote both styles from Chapter 17's idiom (`lrs`
  null at top, created inside `if (window.LRSSim)`, every use `if (lrs)`), with a Speed slider
  handle using `deadband: 1` as in the chapter's bouncing-ball example.
- [spec-gap] "One statement recorded" is only true in Full mode (the book default is Compact,
  where a slider move is folded). The log line says "Recorded (Full mode)".
- [decision] The runtime is simulated inside the sketch (no runtime files are loaded), so the
  page itself still runs in the p5.js editor.
- [decision] Added the outcome grid (cells show "? try it" until visited). Status strip text
  shrinks, then wraps, instead of being truncated (layout review cycle 1 found a clipped status).

## evidence-stream-to-prediction-pipeline

```
Instructional Design Check:
- Bloom Level: Understand
- Bloom Verb: explain
- Recommended Pattern: step-through worked example with concrete data at each stage (the
  statement emitted, the attempt count, the BKT numbers), plus click-to-inspect stage cards
- Specification Alignment: modified (step-through instead of a free-running token)
- Rationale: to explain what enters and leaves each stage the learner must be able to stop at
  each one; a "Next stage" button lets them predict before the event moves on.
```

- [decision] Skill Step 3.4 says to ask before animating an Understand/explain spec; I could not
  ask, so I followed its recommendation: choosing a radio option places the sample event at
  stage 1 and a "Send event / Next stage / Send another" button advances it one stage at a time
  (the spec had only the radio and Reset). No continuous animation.
- [spec-gap] The spec's "Type: infographic" with Library p5.js routed to the p5 guide (the
  infographic-overlay route needs an image and data.json, which does not fit a six-box chain).
- [spec-gap] Sample events, concept and model parameters were unspecified. Chose one concept
  (`elasticity`) for both events: a correct answer on an elasticity prediction (`#q1`) and an
  Elasticity slider drag 0.8 -> 0.6 (`#elasticity-slider`); BKT with the chapter's illustrative
  P(L0) 0.30, p_t 0.15, p_g 0.20, p_s 0.10. The answer is always correct, so repeated sends give
  the chapter's all-correct sequence 0.71, 0.93, 0.99.
- [spec-gap] Stage definitions, inputs, outputs and examples were written from Chapter 18 (and
  Chapter 16 for the statement stage); the Filter card uses the spec's exact text
  "attempts = 0: no right-or-wrong to condition on".
- [decision] Added a stream strip (wide screens) showing the learner's per-concept stream as chips,
  with filtered drags struck through, and a cross on the Filter-to-Model arrow when a drag stops.
- [decision] Layout review cycle 1: the Filter box was tinted from the start, which gave away
  "which stage discards exposure evidence" before any exploration. It is now tinted only after a
  drag stops there; the default infobox lists the two sample events and the model parameters.
- [decision] Infobox texts are logged to the console once per change (`[infobox] ...`), not every
  frame.

## bkt-parameter-lab

```
Instructional Design Check:
- Bloom Level: Apply
- Bloom Verb: calculate
- Recommended Pattern: parameter sliders plus an editable answer sequence, live chart, and an
  optional worked panel that writes out both update steps for a selected attempt so learners can
  calculate first and check second
- Specification Alignment: aligned
- Rationale: calculation practice needs the exact intermediate values to check against; hiding
  them behind a checkbox preserves the "calculate, then verify" order.
```

- BKT check: the sim implements standard BKT (conditioning by Bayes' rule on the observation, then
  `P(L_next) = P(L|obs) + (1 - P(L|obs)) p_t`, no forgetting). Defaults 0.30/0.15/0.20/0.10 with
  C, I, C, C give 0.710, 0.349, 0.751, 0.942 (chapter: 0.71, 0.35, 0.75, 0.94), verified in the
  browser. All-correct gives 0.71, 0.93, 0.99, so thresholds 0.90/0.95 are first reached after
  answers 2/3, matching the chapter's Mastery Threshold section.
- [spec-gap] "The selected attempt" had no selection mechanism (tile clicks flip). Chose: click a
  chart point, or left/right arrow keys; adding or flipping a tile also selects it. Key F flips the
  selected tile (keyboard alternative to clicking tiles).
- [spec-gap] Which value is compared with the threshold (after conditioning or after learning)
  was unstated. Used the post-learning estimate P(L_n), as the chapter's worked threshold example
  does; the message prints three decimals so 0.942 vs 0.95 is not shown as "0.94 = 0.95".
- [spec-gap] Reset scope unspecified. Reset restores both the default sequence and the default
  parameters. Maximum sequence length chosen as 20.
- [spec-gap] Degenerate parameters: with p_s = 0 an incorrect answer at P(L) = 1 has probability
  0 (division by zero). The lab leaves the estimate unchanged and says the observation is
  impossible; it also warns when p_g + p_s >= 1 (conditioning on a correct answer then lowers
  the estimate).
- [decision] With the checkbox on, the chart also marks each attempt's post-conditioning value
  (orange ring) joined to its post-learning value, so the two steps are visible, not only printed.
- [decision] Tiles use Okabe-Ito bluish green and vermillion plus check/cross glyphs, rather than
  the spec's plain green/red, to satisfy the color-blind rule while keeping the spec's meaning.

## Layout review summary (Step 9)

Screenshots at 800 px plus scripted Playwright captures at 400/700 px (feedback states, JSON views,
worst-case sequences). All eight: validator 100, tester PASS, no console errors at 400/700/1000 px,
no horizontal overflow. `sync-iframe-heights.py --sim` changed no chapter file (the only chapter
diff, ch01 line ~541, was already there before this batch started).

| sim | fixes applied | residue |
|---|---|---|
| three-verb-classifier | narrow JSON clipped -> JSON panel also covers card zone; empty wide infobox -> verb table | none |
| contract-violation-finder | narrow statement overflow -> auto-fit mono 14-10 px, taller canvas; badges covered IRIs -> own line; digits in wrapped URLs mis-colored | wide statement panel has spare space |
| evidence-class-sorter | checkbox measured full-width -> pre-position; narrow infobox overflow; prediction label overflow; glyph over bin label | wide infobox half empty before first answer |
| evidence-threshold-lab | narrow title/counter collision; truncated cost cells; wide space -> taller lanes and "Try" prompts | none |
| policy-precedence-resolver | selects wrapped to 3 rows at 400 px -> narrower selects | none |
| guarded-call-runtime-toggle | code lines truncated -> wider code column + auto-fit; status text clipped -> shrink/wrap | none |
| evidence-stream-to-prediction-pipeline | narrow label/estimate overlap; filter tint gave away the answer | wide infobox has spare space |
| bkt-parameter-lab | top value labels clipped; threshold label over points; narrow info overflow -> canvas 770 | point labels can touch the line at local minima |
