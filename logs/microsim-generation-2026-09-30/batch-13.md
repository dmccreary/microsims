# Batch 13 gap notes

Sims: failure-boundary-explorer, lite-semester-storage-estimator, compact-session-folding-lab,
storage-meter-pressure-lab, two-browser-convergence-lab, class-dashboard-load-estimator,
full-or-lite-decision-explorer, primm-semantic-wave-explorer.

All eight validate at 100, pass the iframe tester (via the Chrome shim), have no console errors
over HTTP or file://, and were checked by hand at 700 px and 400 px (and 1000 px for the
vis-network sim). No chapter file was touched (sync-iframe-heights reported 0 embeds because the
chapters do not embed these sims yet).

**Understand-level animation check:** none of the eight specs is at the Understand level, so no
spec asks for continuous animation for an Understand objective. The two specs that ask for motion
are Analyze-level (two-browser-convergence-lab: tiles moving to and from S3 during a sync;
compact-session-folding-lab: the practice sim's own Start/Pause run). Both animations are short
and triggered by the learner, not ambient.

## Batch-wide findings

- [skill-gap] p5 guide, "Iframe Structure" template: `describe('...', LABEL)` makes p5 render the
  description as a visible paragraph under the canvas. On compact-session-folding-lab this grew
  `<main>` from 600 px to 728 px. The iframe hides it, but fullscreen `main.html` shows a stray
  paragraph and the page is taller than CANVAS_HEIGHT. I used plain `describe(text)` (FALLBACK,
  screen-reader only) in all five p5 sims. The guide should recommend FALLBACK.
- [skill-gap] p5 guide, "Control Region Layout Formulas": the fixed `controlHeight = rows x 35 + 10`
  pattern assumes the control rows are known. Five of my specs require 6 to 12 controls and say
  controls must wrap on narrow screens, so the row count depends on width. I wrote a small flow
  layout in each p5 sim: it measures each control, wraps rows, sets `controlHeight` from the row
  count and gives the drawing region `drawHeight = canvasHeight - controlHeight`, so
  CANVAS_HEIGHT stays fixed. The guide has no pattern for this and should have one.
- [skill-gap] (the same pattern) p5 DOM elements report the wrong `offsetWidth` until
  `.position()` has been called. `createRadio()` is a block-level `<div>`, so before positioning
  it measures the full page width, and this wrapped every control after it onto its own row. The
  fix is to call `position(0, y)` on every control before measuring. This is worth a line in
  the guide's "Common Bug Patterns".
- [skill-gap] `test-iframe-heights.py` tests only at a 700 px viewport. Six of my specs state
  behavior at 400 to 600 px (stacking, wrapping, "controls reachable at 400 px"), and the narrow
  layouts are where my real defects were: truncated cards, a clipped seventh tile, a missing
  feedback panel. A `--width` option, or a second pass at 400 px, would catch these. I checked
  400 px by hand (`scratchpad/b13_check.py`).
- [skill-gap] `bk-capture-screenshot` always captures the default state. Two specs set an empty
  default (the folding lab: "both columns empty"; the convergence lab: no answers yet), so their
  gallery PNGs show empty columns. A documented `?demo=1` convention, or a capture option that
  runs a few clicks first, would give more informative thumbnails.
- [skill-gap] Chart.js guide: "Do not add any analysis or supporting documentation above or below
  the chart region" conflicts with specs that require a text panel or readout under the chart
  (class-dashboard-load-estimator, lite-semester-storage-estimator). I followed the specs. The
  guide's CDN pin (4.4.0) also differs from the scaffold's (4.4.4); I kept 4.4.4.
- [skill-gap] visual-checklist.md 5.3 ("Charts: legend present") fails a two-bar chart whose
  category labels already name the bars. A legend would be redundant there, so the checklist
  should accept labeled categories as the legend. I marked it PASS on that basis.

## failure-boundary-explorer

```
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: differentiate
- Recommended Pattern: fixed-position network explorer; break one component at a time and
  compare the verdict against the drawn durability boundary
- Specification Alignment: aligned (layout breakpoints adjusted, see decisions)
- Rationale: differentiating needs the learner to test each component against one rule; the
  red boundary line and the per-failure verdict panel make the rule and its one exception visible
```

- [spec-gap] The detection mechanism and "meanwhile" behavior per component are not in the
  chapter except for Kafka (buffer, 503, Retry-After: 5, page a person) and the general rule. I
  wrote generic, standard descriptions (health check fails, consumer lag grows, writes fail) and
  tied the rest to facts in Chapters 20 and 21: offsets are committed only after the write, raw
  topic retention is 7 days, idempotent ingest, "recompute absolutes", and the ClickHouse
  recovery objectives of one hour and four hours are only targets.
- [spec-gap] The spec does not say whether failures of the Learning Record Provider and the
  gateway "can lose data". The label says only failures *before* the line can lose data, but the
  chapter says only an unreachable Kafka can. I used three verdicts: Kafka = "Data can be lost"
  (red); Provider and Gateway = "Before the line: at risk only if the producer gives up" (amber);
  everything after the line = "No data lost: freshness or speed degrades".
- [spec-gap] "Redis cache attached to the read path" had no reader to attach to. I added a
  non-failable "Dashboards (readers)" node (Neo4j -> Redis -> Dashboards, dashed purple).
- [spec-gap] Built or designed status per node was taken from the ch20/ch21 status tables. Nodes
  that are only partly built (ClickHouse DDL, the seeded Neo4j graph, Redis started by
  `make stores`) are labeled "Partly built" and drawn with dashed borders like designed ones.
- [decision] The panel sits beside the network only at 900 px and wider, not 600 px. Seven boxes
  in one row next to a 290 px panel are unreadable at the usual 700 px textbook width. Under
  560 px the diagram folds into a two-row snake, and the boundary becomes an L around the three
  components before it.
- [decision] Navigation buttons are off, and the view is fitted to fixed world bounds with
  `moveTo`, because `fit()` ignores the boundary label drawn in `afterDrawing`. Edge labels
  ("POST", "produce") were dropped because they collided with the boxes. A "Your findings" tally
  of tried failures was added to the default panel to support the differentiation step.

## lite-semester-storage-estimator

```
Instructional Design Check:
- Bloom Level: Apply
- Bloom Verb: calculate
- Recommended Pattern: parameter sliders with a live chart and a readout showing every step of
  the arithmetic
- Specification Alignment: aligned
- Rationale: calculating needs the formula made visible at each step (per day, per semester,
  raw, gzip, headroom), with immediate feedback when an assumption changes
```

- [spec-gap] The spec's model (x 980 B, / 10) does not reproduce the chapter table's measured
  values for three of the four cases (Full typical: model 16.7/1.67 MB vs measured 16.1/1.05;
  Full heavy: 61.6/6.16 vs 59.6/3.6; Summary heavy: 4.41/0.44 vs 4.4/0.37). When a design case is
  loaded, the readout shows the measured row and the measured ratio (about 12 to 17 times) and
  says that "/ 10" is approximate.
- [spec-gap] The "judge headroom" verdict bands were unspecified. I used: at least 10 times
  headroom = comfortable; gzip at or over 6 MB = crosses the meter's 60% Offer level; over
  10 MB = over budget; otherwise "fits, with modest room".
- [spec-gap] "Load design cases" snapping to "each of the four cases" is implemented as one
  button that cycles through cases 1 to 4. Megabytes are decimal (10^6 bytes), which matches the
  chapter's 2.2 MB.
- [decision] The 10 MB line's label moves to the centre, on a white backing, when it would
  collide with the gzip bar's value label.

## compact-session-folding-lab

```
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: distinguish
- Recommended Pattern: side-by-side step-through with concrete statements (the spec's own
  instructional rationale), driven by the learner's real interactions
- Specification Alignment: aligned (controls moved to the control region, see decision)
- Rationale: learners must see which events vanish into the session card and which survive as
  statements; two live columns plus per-statement tooltips make that difference inspectable
```

- [spec-gap] The practice sim's content was unspecified. I chose a bouncing ball with an integer
  Gravity slider (1 to 10, deadband 1, as ch16 says for the bouncing ball's integer control),
  Start/Pause, and the question "with stronger gravity, does each bounce take less time or more
  time?" (correct: less time).
- [spec-gap] How `statements_represented` relates to runs was implicit. I used
  statements_represented = interaction_count + runs, which reproduces the chapter's table (5 steps
  + 2 presses + 1 run = 8 in Full; 1 summary with 8 in Compact, interaction_count 7).
- [spec-gap] `end_reason` strings: only `scrolled-away` appears in the chapter. I used
  `tab-hidden`, `idle` and `explicit-end` for the other three signals.
- [spec-gap] Behavior when a focus-loss signal arrives during a run was unspecified. I close the
  run first (Full emits the run's `experienced` statement; Compact counts it), and say so. "Sit
  idle 90 s" is ignored while running, which follows the chapter ("a running Start and Pause sim
  counts as busy").
- [spec-gap] A focus-loss button with no open session emits nothing and says so ("a visit with
  neither interactions nor answers emits nothing").
- [decision] The spec puts the slider, Start/Pause and Check "in the left pane". Following the p5
  rule of no controls in the drawing region, they are the first control row, directly beneath the
  practice pane. The focus-loss buttons form the second row. The Full column shows a gray
  "session N ended (no statement)" separator, so learners can see that Full emits nothing on
  leaving.

## storage-meter-pressure-lab

```
Instructional Design Check:
- Bloom Level: Apply
- Bloom Verb: predict
- Recommended Pattern: predict-then-reveal gate on a rule-based state model, with feedback
  naming the rule that fired
- Specification Alignment: aligned
- Rationale: applying the four-level rule means predicting from a state; hiding the level and the
  "after" bar until the learner commits makes every change a prediction exercise
```

- [spec-gap] The spec does not say how the total size splits into slices. I used an illustrative
  split: summaries = min(1 MB, 25%), unsealed = min(0.5 MB, 5%), mirrored = 20%, this device =
  the rest. At the default 0.34 MB this lands inside the chapter's typical ranges.
- [spec-gap] Which of this device's segments are "covered by a verified checkpoint" is not
  modelled in the chapter. Segments written since the last backup (growth rate x days), plus any
  unsynced ones, count as not covered.
- [spec-gap] How much Reclaim frees was unspecified. It drops mirrored segments, then covered
  segments, until the total is just under 80%. At Protect, the Reclaim drops also apply
  (assumption), then unsynced data is folded, with truncated_statements shown as about N
  (unsealed at 980 B each plus unsynced segments at 98 B each).
- [spec-gap] Oldest unsynced age of 0 h is treated as "nothing waiting", so Protect's "with
  unsynced data" is false at 0 h.
- [spec-gap] Growth for "Advance 10 days" uses the chapter's heavy-student figures (0.37 MB per
  90-day semester in Summary mode, 3.6 MB in Full mode). An advance also adds 10 backup days and
  ages any waiting unsynced data by 240 h (capped at 72 h).
- [spec-gap] The persistence dropdown has only three options, so "Firefox prompt" is modelled as
  the student choosing Allow (granted). Persistence never changes the level (per the chapter),
  and the meter says so.
- [spec-gap] The status word is not defined in the design sketch. I used fullness bands (Plenty of
  room / Filling up / Nearly full / Full), so it does not give away the time-based Offer triggers.
- [decision] CANVAS_HEIGHT is 700 so that the feedback panel still fits at 400 px, where the 12
  controls wrap to 7 rows. Narrow screens use a pill badge and short step texts.

## two-browser-convergence-lab

```
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: compare
- Recommended Pattern: run one scenario under two rules, with concrete tiles and a comparison
  banner; short learner-triggered push/pull animation
- Specification Alignment: aligned
- Rationale: comparing merge rules needs the same seven attempts traced through both; ghost tiles
  and the "lost for good" list make "which attempts each approach loses" explicit
```

- [spec-gap] The last-writer-wins mechanics were not defined. I modelled a whole-record snapshot
  stamped with the newest HLC: push only if the local stamp is newer than S3's, then pull and
  replace the local record if S3's is newer. The discarded local attempts appear as
  struck-through ghost tiles.
- [spec-gap] Statement ids (UUID-like), seq values (one sealed segment per device, seq 1) and HLC
  values (Chromebook 1000200-0 to 1000260-0, laptop 1036000-0 to 1036090-0) are illustrative.
  The Chromebook's wrong answer is its second.
- [spec-gap] "After both devices have synced" is read as: all seven attempts exist and each
  device has completed a sync since the last answer. The banner then lists the attempts that no
  device and no S3 object still holds.
- [spec-gap] Switching the merge rule mid-scenario was unspecified; switching resets the lab. Each
  answer button can be used once per run. A next-step hint line guides the Monday and Tuesday
  sequence.
- [decision] CANVAS_HEIGHT is 660 with a flexible drawing height. Below 500 px the columns stack
  as bands, device tiles go three per row, and the S3 band shows one line per segment. All text
  stays at 14 px or larger, per the spec.

## class-dashboard-load-estimator

```
Instructional Design Check:
- Bloom Level: Apply
- Bloom Verb: calculate
- Recommended Pattern: two-slider calculator with a bar chart, a threshold line and a decision
  message
- Specification Alignment: aligned
- Rationale: calculating the download and deciding on the rollup needs the formula, the threshold
  and the resulting message visible together, and updated on every input
```

- [spec-gap] The size of the "Rollup download (one file)" was unspecified. I labeled an
  illustrative assumption, (students x 2 KB + 20 KB) / 1000 MB, as not a design figure.
- [spec-gap] The load-time band model was unspecified. I used students x 5 to 20 ms plus MB / 10
  to 2.5 MB/s, calibrated so that 150 students at 11 KB gives about 0.9 to 3.7 s (the design says
  one to four seconds). It is labeled illustrative.
- [spec-gap] Message thresholds: over 100 students = "Use the rollup function"; otherwise an
  upper estimate over 2 s = "Expect a few seconds"; otherwise "Browser aggregation is
  comfortable".
- [spec-gap] A horizontal line that "marks 100 students" on an MB axis is drawn at 100 x summary
  size / 1000 MB and labeled "100 students = X MB", so it moves with the summary-size slider.
- [decision] The sliders sit above the chart and the text panel below it, since the spec did not
  place them.

## full-or-lite-decision-explorer

```
Instructional Design Check:
- Bloom Level: Evaluate
- Bloom Verb: recommend
- Recommended Pattern: scenario-driven rubric with visible criteria (tier cards listing unmet
  requirements), a recommendation and an on-demand reasoning trace
- Specification Alignment: aligned (budget slider made logarithmic, see decision)
- Rationale: recommending needs every requirement to rule tiers in or out visibly, so the
  learner can justify the choice against the trade-off table rows shown on each card
```

- [spec-gap] Budget rule: a tier fails when the budget is below its lowest design estimate (Lite
  $1, single server $300, Full $10,300 on demand), so a $0 budget fits no tier. Scale rule: Lite
  up to about 150 students, single server about 10,000, Full unlimited in the slider range.
- [spec-gap] "Staff to run servers" is a capability, not a need. Unchecked (the default) means no
  staff, which fails the single-server and Full tiers. The other three checkboxes rule out only
  Lite, per the table. Default checkbox states were unspecified; all four are unchecked, which
  recommends Lite at 30 students and $50.
- [decision] The budget slider is logarithmic (it keeps 0 to 12,000 and the $50 default). On a
  linear 0 to 12,000 slider, $50 and $300 are indistinguishable. The students slider is
  logarithmic, as specified. Wide cards also show the chapter's trade-off rows, so the
  justification can cite them.

## primm-semantic-wave-explorer

```
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: relate
- Recommended Pattern: static concept wave with stage highlighting, plus a drag-to-classify task
  with immediate explanatory feedback (no animation)
- Specification Alignment: aligned
- Rationale: relating stages to the wave needs a stable picture of the wave and repeated
  classification of activities, with the reason for each placement
```

- [spec-gap] Only one of the six activities was given. The others are "Drop the ball and compare
  its bounce with your guess" (Run), "Explain why each bounce is lower than the one before"
  (Investigate), "Change the bounciness slider to 0.9 and test it" (Modify), "Build your own sim
  of a ball bouncing on the Moon" (Make), and a deliberate near-miss, "Edit the code so each
  bounce loses 20% of its speed, then run it" (Modify, not Run).
- [spec-gap] Wave heights (illustrative, shown on screen): Predict 0.78, Run 0.18, Investigate
  0.72, Modify 0.38, Make 0.60. Stage descriptions and the per-stage bouncing-ball activities
  were written from the chapter's PRIMM and semantic-wave paragraphs.
- [spec-gap] Dragging is not keyboard-accessible, and the spec requires keyboard reach. While a
  card is in hand, pressing a stage button places it. Otherwise stage buttons highlight and
  describe.
- [decision] After a wrong placement the card stays in hand for another try, and the correct
  stage is highlighted, because the spec says to show the stage it most resembles.
