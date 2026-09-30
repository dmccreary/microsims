# Batch 12 gap notes

Sims: tenant-pseudonym-explorer, gateway-request-simulator, partition-key-simulator,
redelivery-idempotency-lab, log-graph-compression-lab (chapter 20), class-mastery-heatmap-reader,
suppression-threshold-lab, capacity-cost-explorer (chapter 21).

Helpers (scratchpad, not in the project): `b12_check.py` (copy of b10_check: HTTP server +
Playwright/Chrome at several widths, console errors, scripted clicks, screenshots) and
`b12_meta.py` (copy of b10_meta: writes metadata.json in the flat layout the validator scores),
with one spec file per sim in `b12/meta/`.

## Batch-wide findings

- [decision] The chapter text quotes the companion repository, which is on this machine at
  `~/projects/learning-record-store`. Where a spec said "mirror validation.py" or "the design
  document's estimates", I read the real files (`src/lrs/gateway/validation.py`, `app.py`,
  `producer.py`, `docs/specs/lrs-design-v1.md` §4 and §4.1, `docs/specs/hardware-requirements.md`
  §4, §5, §8, `dashboards/teacher_app.py`) so the numbers and message text match the source,
  not a guess. Nothing in the repository was changed.
- [skill-gap] The microsim-generator skill has no guidance for specs that say "mirror file X" or
  "use the design document's published estimates". Nothing tells the agent where such sources
  live or that it should read them rather than invent values; a spec field such as
  `source_files:` with paths would remove the guesswork.
- [decision] p5 sims whose controls must wrap at 400 px use the batch-10 pattern: a fixed
  `// CANVAS_HEIGHT:` total, with `controlHeight` recomputed from the number of wrapped rows
  and `drawHeight = canvasHeight - controlHeight`. The p5 guide still has no pattern for this.
- [decision] `describe(text)` is called without `LABEL` (known issue); textFont('sans-serif').
- [skill-gap] `test-iframe-heights.py` tests one viewport width (700 px, `VIEWPORT_WIDTH`) and only
  checks that control bounding boxes sit inside the iframe height. Every spec in this batch says
  "controls visible at 400 px", and every real defect I found (clipped notes at 620 px and 500 px,
  Chart.js charts squeezed to ~100 px at 400 px, a cost chart hiding half its category labels at
  620 px) was invisible to it. I ran my own sweep (1200/700/620/500/400/360 px: horizontal
  overflow, lowest control vs canvas height, `#app` scrollHeight vs clientHeight, console errors).
  A `--widths` option and a content-overflow check would make the tester match the specs.
- [skill-gap] p5-guide.md contradicts itself and the scaffold on the p5 version (template text
  says p5@2.3.2; its "HTML Structure (REQUIRED)" section shows cdnjs p5 1.7.0 with an `<h1>`
  inside `<main>`; the scaffold pins 1.11.10). I kept the scaffold's 1.11.10. chartjs-guide.md
  says chart.js@4.4.0 while the scaffold pins 4.4.4; kept 4.4.4.
- [skill-gap] p5-guide.md says "always use named colors, never hex", which cannot give the
  color-blind-safe palette the brief requires (Okabe-Ito has no CSS names). I used RGB arrays with
  comments naming the palette.
- [skill-gap] The p5 guide's pause-when-the-pointer-leaves pattern uses `canvas.mouseOver/mouseOut`,
  but p5 controls are siblings of the canvas, so pointing at a slider pauses the sim. Listening on
  `<main>` (mouseenter/mouseleave) fixes it.
- [skill-gap] The Step 4.4 CANVAS_HEIGHT table suggests ~505 px for Chart.js, but a two-chart spec
  that "stacks under 600/700 px" inside a fixed-height iframe needs 660-700 px, plus shorter text
  when stacked. The chartjs guide has no fixed-height flex-column pattern; I reused the one other
  batches used (`#app` of fixed height, charts `flex: 1`).
- [decision] Short, button-triggered animations (gateway steps, a burst of dots) run to
  completion even when the pointer leaves the canvas; the p5 guide's "animate only while the
  mouse is over the canvas" rule is written for continuous animations, and pausing a
  4-second step-through because the pointer moved onto a control felt broken. The partition
  sim's continuous consumer drain does honor the pause rule (see its section).

## tenant-pseudonym-explorer

```
Instructional Design Check:
- Bloom Level: Understand
- Bloom Verb: explain
- Recommended Pattern: predict-then-derive step-through with concrete data (both keys, both
  salts, the vault rows and the analytics rows visible side by side), plus clickable rules
- Specification Alignment: aligned
- Rationale: explaining why salts break linkage needs the learner to see the same inputs give
  different tokens under two salts, and the same token under one salt, from the attacker's
  seat; no animation adds anything, so none is used.
```

- [spec-gap] The Layout paragraph says "a drop-down for salt handling" while Controls and
  Implementation say radio buttons (createRadio). Used radio buttons.
- [spec-gap] School, course and section names, the district ids, the salt strings and the
  token format were not given. Chose Lincoln High / Algebra 1 / Period 3 (District A) and
  Riverside High / Algebra 1 / Period 5 (District B), `district-a`/`district-b`, three
  obviously fake salt strings, and an 8-hex-digit FNV-1a token shown as `xxxx-xxxx`.
- [spec-gap] Rule text per level was not given beyond "hard or soft". Wrote rules from the
  chapter's table: District HARD (district_id leads the storage keys; only a system-admin
  de-identified benchmark above the threshold may cross), School/Course/Section SOFT (RBAC at
  the API), System (top), Student (key in analytics, identity in the vault). The chapter's third
  table row, "textbook deployment: shared definition, separate events", has no node in the spec's
  tree; its rule is shown on the Course level instead of adding a cross-district node, which did
  not fit at 400 px.
- [spec-gap] "Toggle Attacker view" implemented as a checkbox. In attacker view the student
  nodes read "identity hidden" and the vault panel is greyed out with an explanation.
- [spec-gap] The spec does not say what happens when the name or salt changes after a
  derivation. Changing either clears the keys so the learner must press Derive keys again
  (keeps the predict-then-observe loop honest).
- [decision] The vault and analytics-store side panel appears only at >= 620 px; below that the
  tree takes the full width and the student nodes plus the info band carry the same facts.
  The account home page is fixed (`https://school.example.edu`, the chapter's example).
- Layout review: clean on the first capture (one pre-capture fix: the "linked" label is hidden
  when the gap between the key tokens is under 70 px). Width sweep fix: at 620 px the control-row
  note ran off the right edge; it now falls back to shorter wordings.

## gateway-request-simulator

```
Instructional Design Check:
- Bloom Level: Apply
- Bloom Verb: demonstrate
- Recommended Pattern: build-a-batch practice with a forced prediction, then a short step
  animation through the five steps with a response panel that names the status code, the
  failing step and every violation (index, field, contract section)
- Specification Alignment: aligned
- Rationale: applying the all-or-nothing rule means repeatedly predicting outcomes for new
  batches and checking them; the step animation is short, button-triggered and shows which
  step decides each status code, which static arrows cannot.
```

- [spec-gap] The spec says the rules "mirror validation.py" but gives the message text for
  none of the four defects. Took the field, contract section and (shortened) message from the
  repository's `validation.py`: wrong verb -> `verb.id` §3; answered without success ->
  `result.success` §3; missing grouping -> `context.contextActivities.grouping[0].id` §4;
  page IRI with a fragment -> `object.id` §5 ("a fragment-qualified IRI must not be typed
  Page"). Note the last one is §5 in the code, although the chapter's contract table puts page
  IRIs under §1.
- [spec-gap] "If the broker is unreachable and the local queue is full" has no control for the
  local queue. Modeled from `producer.py`: with the broker unchecked, the local producer queue
  is shown 62% full, fills during Produce, the gateway "drains and retries three times", then
  answers 503 with Retry-After: 5.
- [spec-gap] Statement card contents, the id format and what an empty batch does were not
  given. Five rotating valid templates (sine-wave sliders, two questions, one run), UUIDv7-like
  illustrative ids, and an empty batch returns the `§9` "at least one statement" violation
  from validation.py.
- [spec-gap] "The step column collapses to a vertical list under 500 pixels" is ambiguous
  because the steps already form a column. Interpreted as: under 500 px the step boxes drop
  their one-line notes and use short names (Auth, Validate, Ids, Produce, Respond) so the three
  columns still fit at 400 px.
- [decision] Added click-a-card-to-remove it: without it a rejected batch could only be fixed
  by Reset, which defeats the "fix everything and resend" lesson of the chapter's tip.
- [decision] Prediction buttons (Accepted / Rejected) sit in the control area and are disabled
  except while a prediction is pending; "Rejected" counts 400, 401 and 503.
- [decision] The sim opens with two valid cards and one "answered without success" card so the
  default screen already poses a prediction.
- Layout review: 1 fix. The first capture showed a large empty Response panel in the idle state;
  it now shows the chapter's situation-to-response table while there is room (hidden at 400 px
  when the panel is too short).

## partition-key-simulator

```
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: compare
- Recommended Pattern: comparison tool - one switch between two keys, with the two comparison
  criteria (lane load vs a limit; one learner's read order) visible at the same time
- Specification Alignment: modified (a third "No key" contrast option; see decision)
- Rationale: comparing two keys on load and order needs both measures side by side for the same
  burst; the short flow of dots shows routing and the per-lane FIFO that the order claim rests on.
```

- [spec-gap] The spec does not say what the red threshold is. Chose "twice an even share of a
  60-statement burst" (60 / partitions x 2 = 20 at the defaults) and labeled it a teaching
  limit, not a Kafka setting. Load bars show what each lane holds now plus an outline for its
  peak since the last restart, so the comparison survives after the lanes drain.
- [spec-gap] District sizes were not given. With equal districts, 4 districts on 6 lanes would
  not overflow, which hides the chapter's point (a 200,000-student district on one lane). Chose
  unequal shares 50/25/15/10% so District A is the large one.
- [spec-gap] The hash was "a simple deterministic string hash". Used murmur2 exactly as Kafka's
  default partitioner applies it (`toPositive(murmur2(key)) % partitions`), and the key string
  the chapter says the gateway builds (`district_id:home|name`). At the defaults the learner key
  spreads 12 learners 2/2/2/2/1/3 over 6 lanes.
- [spec-gap] "Lane count adapts to the width" does not fit horizontal lanes (lanes are stacked
  vertically, so the fixed height, not the width, limits them). Interpreted as: the visible
  slots per lane adapt to the width, with a "+N" overflow count; lane height adapts so all 12
  partitions fit at 400 px.
- [spec-gap] One color per learner cannot be color-blind safe for up to 60 learners. Colors use
  golden-angle hues; the selected learner is also marked with a black outline and sequence
  numbers, so color is never the only cue.
- [decision] Added a third radio option, "No key (random lane)". With only the two specified
  keys the ordering comparison always comes out "in order" for both (each keeps a learner in one
  lane), so the learner cannot see what per-learner ordering protects. The contrast shows 9 of 12
  learners read out of order at the defaults. Lane consumers read at slightly different fixed
  paces (10-16 frames), which is what lets the no-key case reorder; the two keyed modes are
  unaffected.
- [decision] The continuous drain follows the p5 guide's pause rule, using mouseenter/mouseleave
  on `<main>` (so hovering a control counts as "over the sim"); a hint says it runs only while the
  pointer is over it. The view opens with one burst pre-run so the screenshot is not empty.
- [decision] Any change to the key or a slider restarts the run with a fresh seeded burst so
  the two keys are compared on the same statement order.
- Layout review: 1 fix. The first capture froze newly emitted dots mid-flight (the pre-run left
  them "in the air" and the sim is paused without a pointer); pre-run dots are now placed in their
  lanes. Earlier pre-capture fixes: slider value overlapping its bold label, empty space under
  the lanes, radio labels breaking mid-label at 400 px (each option label is now nowrap).

## redelivery-idempotency-lab

```
Instructional Design Check:
- Bloom Level: Evaluate
- Bloom Verb: justify
- Recommended Pattern: side-by-side contrast of two write strategies under identical, learner-
  triggered failures, with a truth line and a message that names the failed layer; the
  justification itself is written in the lesson-plan activity
- Specification Alignment: aligned
- Rationale: justifying "recompute absolutes" needs evidence the learner produced: the same
  redeliveries push one counter off the truth line and leave the other on it, and turning the
  log's deduplication off and on shows which layer each writer depends on.
```

- [spec-gap] The spec does not define a "batch" or when the offset is committed, yet "Crash
  before commit forces the last batch to be redelivered" depends on it. Chose batches of three and
  a lazy commit: the processor commits a batch's offset when it fetches the next batch (matching
  the chapter's "write, then commit"). A crash rewinds to the last committed offset, so everything
  since the last commit, up to three statements, comes back.
- [spec-gap] "Redelivery chance" was not tied to a mechanism. It is the chance that a commit
  attempt at a batch boundary fails, so the whole batch is redelivered (seeded RNG, reseeded by Reset, so a run is repeatable).
- [spec-gap] Number of statements, id format and what the counters' scale is were not given.
  Chose twelve statements `st-01`..`st-12` in four batches; bars scale to max(14, A+2).
- [spec-gap] The spec does not say what toggling deduplication does to rows already written.
  Chose: Writer B recomputes immediately from the current log view, so turning dedup back on
  heals Writer B while Writer A stays wrong. This is the strongest evidence for the objective,
  and matches the chapter's "if one disagrees with the log, the log wins and the summary is
  rebuilt".
- [decision] The lab opens mid-story (batch 1 written, crash before commit, two statements
  redelivered: A = 5, B = truth = 3) so the default view and the screenshot already pose the
  question; Reset gives an empty start.
- [decision] ReplacingMergeTree deduplicates eventually, at merge time; the lab shows the
  deduplicated view (`lrs.statements_deduped`) immediately and says so in the metadata.
- Layout review: clean on the first capture (pre-capture fixes: truth-line label overlapped the
  Writer A bar; "Log (lrs.statements)" title collided with the dedup badge and the processor
  offset text overflowed its box at 600 px). Width sweep fix at 500 px: the stream legend slid
  under the message panel and the truth-line footnote was clipped; both fixed, screenshot
  re-captured.

## log-graph-compression-lab

```
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: examine
- Recommended Pattern: model explorer - two linked charts driven by sliders, with the source's
  own data points as an overlay and hover arithmetic that names the source section
- Specification Alignment: aligned
- Rationale: examining the decoupling means varying the ingest rate and seeing one line climb
  while the other stays flat, then checking the model against the design's published rows.
```

- [spec-gap] The batch assignment listed this sim as chapter 21, but its TODO JSON and the chapter
  text place it in Chapter 20 ("ClickHouse and Neo4j"); metadata uses chapter 20.
- [spec-gap] "The design document's estimates" are not in the spec or the chapter beyond three
  numbers (100:1, 3,000:1, ~2,500 upserts/s). Took all inputs from `lrs-design-v1.md` §4 and §4.1:
  storage ratios 40/100/60/3/3,000:1, the cadence rows 5 s -> ~10,000, 60 s -> ~2,500, 300 s ->
  ~1,000 upserts/s, ~100,000 active students, and "~50,000 graph writes/s if materialized" at
  10,000 stmt/s. The design gives no ratio for LearningSession; the chart says "no design
  estimate" instead of inventing one.
- [spec-gap] The spec asks for a continuous line across 1,000-50,000 stmt/s and 5-300 s but the
  design only has three points. Chose a model that passes through all three rows: distinct grains
  per window = min(statements in window, 100,000 x 1.5 x (cadence/60)^0.437), upserts = grains /
  cadence, with the student population fixed (so a higher rate is a burst). "Every statement a
  vertex" = 5 writes per statement, which reproduces the design's ~50,000 at 10,000 (the design's
  own derivation text says "10k x ~4 edges", which is 40,000; I matched its stated result).
- [spec-gap] "One simulated semester" was not defined: chose 90 school days (half of the design's
  180-day year) with the design's 40% duty cycle and 10-hour window; vertices = rows / ratio "if
  every statement fed this grain".
- [spec-gap] The spec does not say whether the Grain drop-down affects the right chart. The
  design's write-rate rows count all grains together, so the grain changes only the left chart.
- [decision] Both charts use logarithmic y axes (13 billion rows vs 4 million SectionRollup
  vertices; 250,000 vs 2,500 writes/s would otherwise flatten the smaller series to zero). Bar
  values are printed on the bars.
- [decision] CANVAS_HEIGHT 660 (not the ~500 the skill table suggests) because at 400 px the two
  stacked charts plus wrapped controls and the note need it; the note switches to a shorter
  wording under 600 px and the right chart's legend labels shorten.
- Layout review: clean on the first capture (pre-capture fix: at 400 px the stacked charts were
  about 100 px tall; fixed with the taller canvas, shorter narrow note and legend labels).

## capacity-cost-explorer

```
Instructional Design Check:
- Bloom Level: Evaluate
- Bloom Verb: judge
- Recommended Pattern: estimator with a live verdict - the learner's inputs produce rates and
  storage, the fitting tier is outlined against published criteria, and the lesson plan asks for
  a written recommendation with a named risk
- Specification Alignment: aligned
- Rationale: judging a tier needs the estimate and the criteria (tier limits, the 3,000-5,000
  advice, cost ranges, exclusions) visible together, with arithmetic on hover so the verdict can
  be checked rather than trusted.
```

- [spec-gap] "Names the tier whose stated limits the load falls inside" needs tier limits the
  chapter does not state for bursts. Took them from `hardware-requirements.md`: single server 1,000
  stmt/s sustained, 5,000 burst (§8.1); distributed 10,000 sustained, 50,000 burst (§1). Verdict
  bands: <= 1,000 fits single; 1,000-3,000 "beyond single-server sizing, plan the move"; 3,000-5,000
  "near the boundary" (both tiers outlined, warning); 5,000-10,000 distributed fits. The slider
  maximum (100,000 students) is exactly the design's 10,000 stmt/s target.
- [spec-gap] "A horizontal range chart ... with a marker at the learner's estimated rate" mixes a
  cost axis with a rate. Implemented the chart as monthly-cost floating bars (four rows: hosted,
  rented, reserved, on demand) and the "marker" as a dashed outline around the fitting tier's rows
  with a "fits N stmt/s" tag (tag hidden when the chart is under 260 px wide; the message still
  names the tier).
- [spec-gap] The $8,000-$15,000 "buy" option is not monthly, so it is not a bar; it appears in the
  hosted row's tooltip and in the About text. The on-demand figure is a point estimate (~$10,300),
  drawn with a minimum bar length.
- [spec-gap] What "Show burst (5x)" should change was not given. Burst does not change daily
  volume, so it only adds the burst rate to the message and the marker tag, checked against the
  tier's stated burst, with the design's note that the queue absorbs bursts.
- [spec-gap] The log-scale student slider needs a mapping: slider 0-1000 -> 500 x 200^(v/1000),
  rounded to 10/100/1,000; the default position 338 gives exactly 3,000.
- [decision] Both axes of the load chart are linear with two y axes (statements left, GB right);
  the cost chart uses a logarithmic dollar axis so $300 and $18,300 are both readable.
- [decision] Dollar amounts in index.md use a bare `$`, the chapter's convention; checked with
  Python-Markdown + pymdownx.arithmatex (generic) that no amount on the page becomes math.
- Layout review: clean on the first capture (pre-capture fixes: clipped one-line tier labels ->
  two-line labels; x labels auto-skipped on the load chart; at 400 px the cost chart was too short,
  so the stacked charts now split 0.8:1.2, the cost legend hides and the message shortens; the
  dashed outline now covers the full category band including the Neo4j bars). Width sweep fix at
  620 px: the stacked cost chart auto-skipped two of its four tier labels; y ticks no longer
  auto-skip, and the short message, split and hidden legend now apply whenever the charts stack
  (< 700 px). Screenshot re-captured.

## class-mastery-heatmap-reader

```
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: distinguish
- Recommended Pattern: pattern finder - a heatmap with printed values, a two-question quiz that
  separates the column pattern from the row pattern, a reveal, and a roster whose score breakdown
  is shown as arithmetic
- Specification Alignment: modified (shade direction; second quiz question; see below)
- Rationale: distinguishing a class-wide concept problem from an individual problem is a
  discrimination task, so the learner must pick one and be told why the other reading is wrong;
  the transparent risk arithmetic covers "computing an at-risk score".
```

- [spec-gap] CONFLICT inside the spec: the Layout line says cells shade "from light (low mastery)
  to dark blue (high mastery)" (which is also what the repository's prototype `teacher_app.py`
  does), but the learning objective, and the chapter text, say struggle shows as "dark columns and
  dark rows". Followed the objective and the chapter: darker = lower estimate, on a sequential
  blue scale. The mapping is one function (`cellColor`) if the author prefers the other reading,
  but then the objective and the chapter's "A dark column means..." sentence would need to say
  "light".
- [spec-gap] Concept names, student names, the prerequisite structure, days idle and the pass line
  were not given. Chose a trigonometry unit that matches the book's sine-wave examples (Unit circle,
  Radians, Sine function, Amplitude, Frequency, Period, Phase shift, Wave sum) with a small
  prerequisite DAG; 12 obviously synthetic first names; days idle 0-10 with max 10 (the chapter's
  worked example); pass line 0.6 (the prototype's `MASTERY_PASS`). Gap ratio is computed from the
  heatmap: concepts with a prerequisite below 0.6, divided by 8.
- [spec-gap] Weak column = Phase shift (10 of 12 students below 0.6); weak row = Hal (7 of 8 below
  0.6). Kim is strong but idle 10 days, so raising the inactivity weight lifts her above Hal, the
  chapter's "a single severe signal can lift a student toward the top".
- [spec-gap] Weights are not normalized: the chapter's formula uses the raw weights, so the sliders
  feed it directly.
- [decision] "Quiz me" asks a second question (click the broadly struggling student) after the
  specified one (the concept to re-teach), because the objective is to distinguish the two
  patterns and one question only tests one of them. Wrong answers get specific feedback (for
  example, clicking a dark cell in Hal's row explains that it is a row pattern).
- [decision] Under 600 px the roster moves below the heatmap as two columns of six so the heatmap,
  roster and detail panel all fit in the fixed 640 px canvas.
- Layout review: clean on the first capture (pre-capture fixes: the rotated "Wave sum" header ran
  off the heatmap, so headers now slant up-left; the legend text ran under the roster panel, so it
  now picks the longest wording that fits; the narrow detail panel was one line too short).

## suppression-threshold-lab

```
Instructional Design Check:
- Bloom Level: Apply
- Bloom Verb: apply
- Recommended Pattern: predict-then-reveal practice - every cell starts unrevealed, the learner
  predicts Hidden or Shown and gets a one-sentence reason; after the table is revealed the
  threshold and checkboxes update it live and the subtraction is drawn
- Specification Alignment: aligned (with a Reveal all shortcut added)
- Rationale: applying a rule means using it on new cases before seeing the answer; the drawn
  subtraction makes the leak concrete, and the complementary checkbox shows the leak closing.
```

- [spec-gap] Preset values were not given. Chose two schools per preset (a cross-school view,
  where the chapter says suppression applies): All cells safe (14/18/22/11, 12/20/17/13); One small
  cell (the chapter's 14/9/22/0 = 45 plus a safe row); Complementary suppression needed (0/7/30/12,
  where the complement must skip the zero, and 6/4/25/18, two small cells that need no complement).
  The names "One small cell" and "Complementary suppression needed" overlap (the chapter's single
  small cell also needs a complement); the About text explains the difference.
- [spec-gap] The rule for WHICH second cell to hide was not given. Chose the smallest non-zero
  visible count in the row (leftmost on a tie), the usual least-information-loss choice; a zero is
  skipped because hiding it leaves the hidden pair's sum equal to the small count.
- [spec-gap] Whether 0 counts are suppressed was not stated. Followed the chapter's worked example,
  where the 0 stays visible (rule: hide 1..threshold-1). Real policies differ; noted in the About
  text as the lab's rule.
- [spec-gap] "Clicking any cell asks the learner to predict ... before the answer is shown" conflicts
  with a table whose locks are always visible. Resolved with an unrevealed start: raw counts with a
  "?" until predicted; the recovery line and subtraction appear once every cell is revealed.
  Changing the threshold or checkboxes after that updates the revealed table live; Reset hides the
  answers again for a new round. Default for "Show the subtraction": on (the Interactions line says
  the subtraction is displayed).
- [decision] Added "Reveal all" and the two prediction buttons (Hidden / Shown) as native p5
  buttons, disabled except while a cell awaits a prediction.
- [decision] Hidden cells show the lock, a text tag ("below 10" / "complement") and the true count
  in parentheses, so the learner can check the drawn subtraction; the published table would show
  only the lock.
- Layout review: 1 fix. The first capture had a large empty band between the legend and the
  feedback box while predicting; it now shows the two rules to apply there (and the drawn
  subtraction once the table is revealed). Hint and tag text raised from 11 to 12-13 px.
