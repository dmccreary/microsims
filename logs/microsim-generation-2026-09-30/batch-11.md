# Batch 11 gap notes

Sims: attempt-order-swap-lab (ch 18, p5.js), prerequisite-propagation-explorer (ch 18,
vis-network), fidelity-held-out-split-explorer (ch 19, p5.js), fidelity-accuracy-base-rate-lab
(ch 19, Chart.js), fidelity-calibration-curve-lab (ch 19, Plotly), fidelity-auc-pair-explorer
(ch 19, p5.js), fidelity-claim-sorter (ch 19, p5.js), lrs-architecture-explorer (ch 20,
vis-network).

Helpers (scratchpad, not in the project): `b11_check.py` (copy of b10_check: HTTP server +
Playwright/Chrome at several widths, console errors, scripted clicks and screenshots),
`b11/cohort.py` (Python re-creation of the chapter 19 synthetic cohort), `b11/mt.js` (a
Mersenne Twister port that reproduces Python's `random.Random(seed).random()` bit for bit).

## Batch-wide findings

- [decision] Chapter 19 never shows the code that generated its synthetic cohort, only its rules
  ("200 learners ... The random seed is 19"). I rebuilt it in Python (`b11/cohort.py`): drawing, per
  learner, mastered = r < 0.30, then for each of 4 practice items correct = r < (0.9 if mastered else
  0.2) followed by one learning draw only while unmastered (r < 0.15), then the held-out item. With
  `random.Random(19)` this reproduces every number the chapter prints: base rate 0.635, BKT accuracy
  0.705 (141/200), Brier 0.195/0.232/0.247, AUC 0.743/0.724, the four calibration rows
  (65/25/8/102 learners, 0.332/0.400 ...), the mismatched scenario (accuracy 0.655 vs 0.690,
  Brier 0.216 vs 0.214, lowest bin 47 learners 0.341 vs 0.574, AUC 0.680) and the cohort-size AUCs
  (0.758 at 50, 0.776 at 1000). I then ported MT19937 with Python's `init_by_array` seeding to JS
  and verified the first outputs match Python exactly, so the calibration lab regenerates the
  chapter's cohort in the browser rather than hard-coding its table.
  The chapter should probably publish that generator (or the fact that the learning draw happens
  only while unmastered): a variant that always draws the learning random number gives different
  numbers (base rate 0.605, AUC 0.792).
- [decision] Every p5 sketch in this batch flow-lays its controls (wrapping rows at narrow widths)
  and recomputes `controlHeight`, with `drawHeight = canvasHeight - controlHeight`, so the total
  always equals the `// CANVAS_HEIGHT:` value (same pattern as batch 10).
- [decision] `main canvas { display: block; }` added to each p5 main.html: without it the inline
  canvas leaves a 4 px descender gap, so `<main>` measured 604 px for a 600 px canvas.
- [decision] Color-blind safety: all categorical encodings use Okabe-Ito colors plus a redundant
  cue (glyph, shape or text). Where a spec asked for green/red (tiles, correct/incorrect) I used
  Okabe-Ito bluish green (#009E73) and vermillion (#D55E00) with check/cross glyphs; where it asked
  for a red-yellow-green diverging fill I used ColorBrewer RdYlBu (red-yellow-blue) instead.
- [skill-gap] `b10_check`-style `CLICK:text=Reset` matched "Preset: ..." first because Playwright's
  `text=` selector is a case-insensitive substring match; use `button:text-is('Reset')`. (Only a
  helper-script pitfall, noted so later batches do not misread a test result.)
- [skill-gap] The only 404 seen in every console check is `/favicon.ico` from the ad-hoc HTTP server;
  it is not a sim defect.

## attempt-order-swap-lab

```
Instructional Design Check:
- Bloom Level: Analyze (L4)
- Bloom Verb: compare
- Recommended Pattern: comparison tool with direct manipulation (drag to reorder) and live recomputation
- Specification Alignment: aligned (colors adapted for color-blind safety)
- Rationale: learners must put two orders side by side and separate what order changes (the BKT
  estimate) from what it does not (the success count); two stacked charts on one axis plus an
  order-blind overlay make that contrast visible without animation.
```

- [spec-gap] "Two rows of four draggable tiles" conflicts with "Preset: brute force (five wrong, then
  right)", which needs six attempts. Chose variable-length rows: the brute-force preset sets order
  A = five incorrect then one correct (every attempt emitted, final 0.56) and order B = the single
  final success (only the success emitted, 0.71), which is the chapter's argument. Both charts
  share one x scale so the attempts line up.
- [spec-gap] The spec does not say what the presets do to the second row. Chose: "successes first"
  = A CCII vs B IICC (the default, 0.33 vs 0.88); "failures first" swaps them; Reset restores that
  default, the four parameter defaults and unchecks the overlay.
- [spec-gap] Slider ranges unspecified. Chose 0.00-1.00 for initial knowledge and learning rate and
  0.00-0.50 for guess and slip (larger guess/slip values make the model non-identifiable); a
  degenerate 0/0 update keeps the previous estimate.
- [spec-gap] Tiles cannot change correct/incorrect (spec only allows reordering), so learners
  explore the six orders of two correct and two incorrect answers plus the brute-force preset.
- [decision] Tile colors: Okabe-Ito bluish green / vermillion with check/cross glyphs instead of
  green/red. Tiles sit directly above the chart point they produce, which links tile and estimate.
- [decision] The success-count overlay label sits in the right margin outside the plot; inside the
  plot it collided with the point value labels (seen on the brute-force preset).
- [decision] Reorders and presets are also logged to the console, in addition to the required
  tooltip log lines.
- Layout review: clean on the first capture (one fix made before capture: overlay label moved).

## prerequisite-propagation-explorer

```
Instructional Design Check:
- Bloom Level: Analyze (L4)
- Bloom Verb: differentiate
- Recommended Pattern: network explorer with a read-only gap finder and contrasting cases
- Specification Alignment: aligned (diverging colors changed for color-blind safety)
- Rationale: learners differentiate by comparing two weak concepts with different upstream
  situations (Rates, whose gap is Ratios, vs Percentages, whose prerequisites are mastered); walking
  highlighted depends-on edges makes the "upstream" reasoning visible, and nothing is animated.
```

- [spec-gap] The seven concepts and their estimates were left to the generator. Chose a numeracy
  chain that extends the chapter's own example (Speed Problems -> Rates -> Ratios -> Fractions ->
  Division -> Multiplication) plus a branch (Percentages -> Fractions). Estimates: 0.52, 0.58,
  0.42 (the weak middle concept), 0.96, 0.97, 0.99, and Percentages 0.91 so that the threshold
  control changes its verdict.
- [spec-gap] "Toggle 'Threshold for mastered' (default 0.95)" does not say what it toggles between.
  Implemented as a select with 0.80, 0.85, 0.90 and 0.95.
- [spec-gap] "Deepest unmastered prerequisite" is ambiguous on a branching graph. Defined as the
  unmastered prerequisite(s) at the greatest (longest-path) distance upstream; ties are all
  highlighted. When none exists the panel says the weakness is in the concept's own evidence.
- [spec-gap] No initial selection is specified; Rates is pre-selected so the panel is never empty
  (and the screenshot shows the infobox).
- [decision] Node fill uses ColorBrewer RdYlBu (red -> yellow -> blue) instead of red -> yellow ->
  green, which is not color-blind safe; each node also prints its estimate and a check mark when
  mastered, and label color is chosen by WCAG contrast.
- [decision] Hierarchical layout runs top-down with physics off from the start (a hierarchical
  layout needs no settling), rather than "physics disabled after the layout settles".
- [decision] The node font is 23 px below 600 px wide (17 px above) so the fitted labels stay at
  about 12 px; the first version rendered 9 px labels at 400 px. CANVAS_HEIGHT raised from the
  first plan of 560 to 640 for the same reason.
- [skill-gap] vis-network-guide.md's overlay legend (absolute, top-left) collided with the top node
  of a top-down hierarchical layout; the guide's layout assumes graphs placed on the left with a
  right panel. Moved the legend into its own row above the graph.
- [skill-gap] The guide mandates navigation buttons; at 400 px they occupy a large share of a
  small graph area. Kept them as required.
- Layout review: fixed 3 (legend overlapping the top node, 9 px labels at 400 px, overlapping
  levels at 64 px separation) before the final capture; final capture clean.

## fidelity-held-out-split-explorer

```
Instructional Design Check:
- Bloom Level: Analyze (L4)
- Bloom Verb: distinguish
- Recommended Pattern: timeline explorer with a draggable boundary plus a deliberate failure toggle
- Specification Alignment: aligned
- Rationale: learners judge each statement against the timing rule and immediately see which ones
  the model uses and which leak; the leakage checkbox provides the contrasting "broken" case with a
  concrete inflated number, and nothing needs to animate.
```

- [spec-gap] The twelve statements and their timestamps were left to the generator. Chose Mon-Fri with
  four practice answers correct, incorrect, correct, correct (the Chapter 18 worked example, so the
  clean forecast is 0.86), six exposure events, one held-out transfer item on Thursday 09:00, and
  two statements after it (a feedback view and a practice retry) so that "any statement produced
  after the assessment" has examples.
- [spec-gap] "A second mock accuracy that jumps upward when leakage is enabled" has no numbers. Used
  the chapter's own synthetic cohort (reproduced in Python): BKT accuracy on the held-out item with
  0-4 practice answers visible = 0.365 / 0.530 / 0.660 / 0.685 / 0.705, and 0.910 when the model
  also sees the held-out answer. So the mock accuracy tracks the window size, and the leaked value
  is a computed number rather than an invented one.
- [spec-gap] The spec does not say what happens when the cutoff itself is dragged past the
  assessment. Treated it as leakage too (the held-out answer and everything after it are ringed),
  which matches the chapter's rule "or any statement produced after them".
- [spec-gap] Only one held-out item: the chapter's cohort has exactly one, and a single item keeps
  the mock accuracy tied to real numbers.
- [decision] The brief asks for "held-out splits that avoid student-level leakage". The spec is about
  temporal leakage within one learner; index.md adds a paragraph that the same rule applies when
  parameters are fitted: split by learner so no learner's own held-out outcome helps fit the model
  that forecasts it.
- [decision] Markers use Okabe-Ito colors and three shapes (circle practice, square exposure, diamond
  held-out); correct/incorrect is a glyph inside the marker; leakage is a vermillion ring plus the
  word LEAK in the list ("!" on narrow screens).
- [decision] Added arrow-key movement of the cutoff and click-to-place as keyboard/pointer
  alternatives to dragging.
- [skill-gap] p5's `createCheckbox()` returns a block-level div whose offsetWidth is the full page
  width, so any flow layout that measures it wraps the next control; set
  `style('display','inline-block')`. The p5 guide positions checkboxes but never mentions this.
- [skill-gap] The Write tool stored `✓`-style escapes in JS source as literal UTF-8 glyphs, so a
  later scripted search for the escape text silently failed to match. Harmless for the browser
  (main.html is UTF-8) but worth knowing when patching generated files.
- Layout review: fixed 3 during development (Reset wrapping because of the checkbox width, narrow
  readout banner clipped, colliding "#3 check / #4 cross" captions) plus one after the first
  capture (unused space under the readout: timeline made taller). Final capture clean.

## fidelity-accuracy-base-rate-lab

```
Instructional Design Check:
- Bloom Level: Evaluate (L5)
- Bloom Verb: judge
- Recommended Pattern: parameter sliders with a paired comparison chart and a verdict message
- Specification Alignment: aligned (slider step changed so the default is reachable)
- Rationale: judging an accuracy claim requires comparing it with a baseline under varied
  conditions; two bars, a lift caption and a "carries no evidence" verdict give the criterion,
  and fresh cohorts expose sampling noise.
```

- [spec-gap] "Model forecasts whose informativeness scales with the signal slider" has no model.
  Chose a calibrated binormal forecaster: evidence x ~ N(+delta/2, 1) for learners who will succeed
  and N(-delta/2, 1) for those who will not, forecast = exact posterior sigmoid(logit(b) + delta x),
  delta = 0.924 x signal. D = 0.924 makes signal 1.0 match "the synthetic model above" in
  expectation (AUC 0.743; accuracy 0.706 averaged over 2,000 seeded cohorts at base rate 0.635).
  At signal 0 the forecast is the base rate for everyone, so accuracy equals the baseline exactly.
- [spec-gap] The base-rate slider "step 0.01, default 0.635" is contradictory (0.635 is not on a
  0.01 grid and a range input would snap it). Used step 0.005.
- [spec-gap] "When the base rate is far from 0.5" is not quantified. The verdict appears whenever
  the model is right on no more learners than the baseline. At extreme base rates this also happens
  at full signal, so the message then adds that accuracy cannot show the signal (use Brier or AUC),
  instead of claiming the model has none.
- [decision] The first cohort uses seed 177: the first seed (searched in Python with the same
  generator) whose draw reproduces the chapter's counts, 127 of 200 correct and 141 of 200 right.
  Documented in the code and on index.md. Sliders re-evaluate the same random draws (smooth
  changes); only the button draws a new cohort (next seed).
- [decision] Bars use Okabe-Ito blue and orange; value labels are drawn in `afterDatasetsDraw`
  (per chartjs-guide) so tooltips cover them.
- [skill-gap] In the `bk-capture-screenshot` environment Chart.js did not resize its canvas after
  the flex container shrank (the caption text was filled in after the chart was built), so the
  x-axis overflowed onto the caption in the PNG although a normal Playwright run looked right.
  Fixed by filling the text before creating the chart and putting the canvas in an absolutely
  positioned wrapper. chartjs-guide.md only recommends `maintainAspectRatio`; it does not cover
  charts inside a fixed-height flex column.
- Layout review: fixed 2 (y-axis title clipped at 700 and 400 px, chart overflow in the capture);
  final capture clean.

## fidelity-calibration-curve-lab

```
Instructional Design Check:
- Bloom Level: Analyze (L4)
- Bloom Verb: diagnose
- Recommended Pattern: pattern finder (reliability curve + bin-count table) with diagnosis feedback
- Specification Alignment: modified (default bins 5 instead of 4; third scenario; diagnosis buttons)
- Rationale: diagnosing needs a visible curve, the counts that say which points to trust, and a
  way to check a diagnosis; scenario changes animate so learners can track each bin's movement.
```

- [decision] Default number of bins is 5, not 4. The chapter's four-row table uses edges
  0.4 / 0.6 / 0.8 ("below 0.4", ...), which are five equal-width bins with the empty 0.0-0.2 bin
  dropped. With 5 equal-width bins the lab reproduces the chapter's table exactly (65/25/8/102,
  0.332/0.400 ...); 4 equal-width bins (0.25 wide) would show different, non-chapter numbers.
- [decision] Added a third scenario, "true guess rate 0.20, model assumes 0.35". The objective asks
  learners to tell overconfident, underconfident and well calibrated apart, but the two specified
  scenarios only produce calibrated and overconfident curves. Verified with 50,000 simulated
  learners that it is underconfident in expectation (lowest bin 0.457 forecast vs 0.337 observed,
  0.757 vs 0.831). With 200 learners at seed 19 its pattern is noisy, and the feedback says so and
  suggests 1000 learners.
- [decision] Added three diagnosis buttons with feedback keyed to the known generating truth of each
  scenario; the spec had no check, and an Analyze objective needs one.
- [spec-gap] "Bins with fewer than ten learners are drawn with a dashed outline": Plotly markers
  cannot have dashed outlines. Implemented as pixel-sized `circle` shapes (`xsizemode/ysizemode:
  'pixel'`, anchored at the point) with `dash: 'dash'`, plus a lighter marker fill. The shapes are
  removed during the scenario animation and restored after it (they do not animate).
- [spec-gap] Cohort-size slider step not given; used 50. "Redraw cohort" advances the seed by one;
  seed 19 is labelled "the chapter's cohort". Cohort size N with seed 19 is the first N learners of
  the same random stream, which also reproduces the chapter's AUC-by-size numbers.
- [spec-gap] Point size "proportional to the number of learners": area proportional (diameter
  10 + 34 * sqrt(n / max n)).
- [skill-gap] plotly-guide.md targets f(x) function plots (template `script.js`, slider along a
  curve); nothing on data-driven scatter plots, `Plotly.animate` transitions, pixel-anchored shapes
  or `scaleanchor`. With `scaleanchor` on one axis only, Plotly widened the x range to -0.2..1.3 at
  400 px; both axes need `constrain: 'domain'`. Its advice of breakpoint plot heights (400/300/250)
  does not fit a fixed-height iframe; used a flex layout with an absolutely positioned plot div.
- [skill-gap] A two-line Plotly title (`<br>` + small span) was clipped at the top at 400 px even
  with `yref: 'container'`; moved the second line to a paper-anchored annotation.
- Layout review: fixed 3 (wrapped bin labels in the table, x range widened at 400 px, clipped title
  at 400 px) before the final capture; final capture clean apart from Plotly's overlapping "0" tick
  labels at the origin (cosmetic, left as is).

## fidelity-auc-pair-explorer

```
Instructional Design Check:
- Bloom Level: Understand (L2)
- Bloom Verb: explain
- Recommended Pattern: step-through (one pair per click) with concrete data visible, plus a linked
  second representation (ROC) and a convergence plot
- Specification Alignment: aligned
- Rationale: an "explain" objective needs the learner to see concrete pairs and counts rather than
  continuous animation; single pair draws are the step-through, and the 100-pair button and the
  running-fraction plot connect the counts to the area. Nothing animates on its own.
```

- [spec-gap] The generator of "model signal strength" is unspecified. Used a binormal score model:
  24 correct / 16 incorrect learners (base rate 0.6, close to the chapter's 0.635), score = z +/-
  delta/2 with delta = 1.516 x signal, forecast = sigmoid(logit 0.6 + score). D = 1.516 puts the
  expected AUC at 0.74 for the default signal 0.6. Seed 6 (PyRandom, reproducible in Python) was
  chosen because it gives 0.742 at 0.6 (0.833 at 1.0).
- [decision] "At signal strength 0 ... the readout shows about 0.5": the seeded normal draws are
  generated as +z/-z pairs within each group, so at signal 0 both groups have identical, symmetric
  score sets and the AUC is exactly 0.500 (a plain 40-learner random draw would show 0.4-0.6).
- [spec-gap] "Regenerated when the signal slider moves" is read as recomputing the 40 forecasts from
  the same seeded draws (the learners stay the same, the separation changes), and the pair tally
  restarts because the model changed.
- [spec-gap] Pair counts, 24 x 16 = 384 pairs, and the convergence plot (running fraction vs pairs
  drawn, AUC as a dashed target) were not specified; the plot makes "converge visibly" concrete.
- [decision] Forecasts are rank scores, not calibrated probabilities; index.md says AUC ignores
  calibration. Correct = Okabe-Ito bluish green circles, incorrect = orange squares (shape cue).
- [decision] Added a hover readout on each dot (forecast and outcome), not in the spec.
- Layout review: fixed 4 during development (strip caption overflowing, clipped "last pair"
  sentence and prompt at 700 px, ROC axis title colliding with tick labels at 400 px, clipped AUC
  readout) and 1 after the first capture (10-11 px labels raised to 11-12 px). Final capture clean.

## fidelity-claim-sorter

```
Instructional Design Check:
- Bloom Level: Evaluate (L5)
- Bloom Verb: classify (the objective adds "justify ... by pointing to the evidence")
- Recommended Pattern: sorting into category zones with per-card explanations and evidence hints
- Specification Alignment: aligned
- Rationale: learners judge each sentence against the criterion "observed and repeatable?"; the hint
  on a wrong drop names the missing evidence, which is the justification step of the objective.
```

- [spec-gap] Only four of the "about ten" cards were given. Wrote six more from Chapters 18-20
  (ADR-006 BKT choice, transfer items in the protocol, baseline 0.635 on the synthetic cohort,
  the July 2026 browser-verified retry statements, per-learner partitioning, predicting-first
  diagnosticity with the chapter's hypothetical counts, trusting dashboard percentages). Balance:
  4 measured, 3 designed, 3 hoped for. Each card has an explanation and a card-specific hint.
- [spec-gap] "Check all" is redundant with immediate per-drop feedback (wrong drops bounce back, so
  every placed card is already correct). Implemented it as a progress summary: correct placements,
  cards left with their numbers, first-try accuracy and attempts.
- [spec-gap] "Select a card and press a zone button": with a stack, the selected card is always the
  top card, so the zone buttons act on it. Placed chips can be clicked to re-read explanations.
- [decision] Stack of cards (one visible) rather than all ten laid out, because ten wrapped sentences
  do not fit the drawing region at 400-800 px.
- [decision] Zone colors are Okabe-Ito blue / orange / reddish purple with text labels; correct chips
  are bluish green; the top card's border turns vermillion after a wrong drop.
- [skill-gap] concept-classifier-guide.md (the route for "classify") covers only the
  multiple-choice-with-mascot pattern from data.json; the spec asks for drag-to-zone with a
  keyboard fallback, so this was built from p5-guide.md (same finding as batch 10).
- [skill-gap] p5's `text(str, x, y, w, h)` wraps but does not report the wrapped height, so stacked
  wrapped paragraphs overlapped in the feedback panel; wrote a small `drawWrapped()` that returns
  the next y. The p5 guide has no pattern for variable-height wrapped text in panels.
- Layout review: fixed 3 during development (wrapped status line overlapping the quote, title
  clipped at 400 and 700 px, counter colliding with "attempts"); final capture clean.

## lrs-architecture-explorer

```
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: differentiate
- Recommended Pattern: network explorer with information panel, status filter and a placement quiz
- Specification Alignment: aligned (quiz interpretation and panel placement noted below)
- Rationale: differentiating planes and statuses needs every component visible in its band with its
  status, a way to strip away the designed parts, and a self-test that requires placing each
  component without color cues.
```

- [spec-gap] "A 'Quiz me' button hides the labels and asks the learner to drag each component into its
  plane" is ambiguous (hiding the component names would make the task impossible). Implemented:
  status colors, legend and arrows are hidden; one component at a time waits in an orange tray above
  the bands and is dragged into a band (plane labels stay visible); plane buttons in the panel are a
  keyboard alternative. Wrong drops return the node with the chosen plane's description and the
  component's role. Textbooks stay put as context.
- [spec-gap] The spec does not say which plane the event stream belongs to. Placed it in Ingestion,
  following "the ingestion plane accepts statements and puts them on a durable queue"; the identity
  service, summarizer and reconciler go in Processing; the vault in Storage.
- [spec-gap] Only the main statement path had edges. Added edges from the chapter text so no node
  floats: vault -> identity service -> processors (salt), ClickHouse and Neo4j -> analytics API ->
  dashboards. Each edge has a "what travels" tooltip.
- [spec-gap] The vault and the dashboards are not in the spec's color list. Vault = designed;
  dashboards = designed with the status note "prototype Dash apps over a seeded graph; production
  dashboards designed, not built" (Chapter 20's table).
- [decision] Panel placement: the network always fills the container width and the information
  panel is always below it (three columns from 600 px up, stacked below 600 px), rather than beside
  it on wide screens, because a side panel would push labels below 11 px at 700-800 px.
- [decision] "Node labels shrink but never below 11 pixels": the view is fitted to the band bounding
  box and the node font is raised to ceil(11.5 / scale). Below 600 px the bands are re-laid out
  with at most two nodes per row and single-line labels, and layout, scale and font are iterated
  until they agree (about 20 px font at scale 0.58, i.e. 11.6 px on screen at 400 px).
- [decision] Data lives in data.json as the spec requires, so the sim needs HTTP. Under file:// it
  shows an explanatory message in the graph area instead of throwing; the file:// iframe tester
  still passes because all controls are HTML. Verified over HTTP (screenshot, hide-designed filter
  leaves textbooks, gateway, stream, ClickHouse, Neo4j with 2 edges; quiz drag and buttons work).
- [decision] Status colors are Okabe-Ito bluish green (built) and yellow (files exist) plus light
  gray with a dashed border (designed), so status is also carried by the border style.
- [skill-gap] vis-network-guide.md has no pattern for drawing background bands/regions
  (`beforeDrawing` with canvas coordinates), for enforcing a minimum rendered label size, or for
  drag-to-region quizzes; its right-panel template does not suit a 12-node full-width diagram.
- Layout review: fixed 3 during development (three-row toolbar, panel text clipped, overlapping
  nodes at 400 px) and 1 after testing the quiz (tray caption overlapping the tray node). Final
  capture clean; some edge crossings remain around Summarizer/Reconciler (acceptable).

## Final status

| sim-id | library | CANVAS_HEIGHT | validator | Playwright | layout review |
|---|---|---|---|---|---|
| attempt-order-swap-lab | p5.js | 600 | 100 | PASS | clean (1 fix pre-capture) |
| prerequisite-propagation-explorer | vis-network | 640 | 100 | PASS | fixed 3 |
| fidelity-held-out-split-explorer | p5.js | 540 | 100 | PASS | fixed 4 |
| fidelity-accuracy-base-rate-lab | Chart.js | 520 | 100 | PASS | fixed 2 |
| fidelity-calibration-curve-lab | Plotly | 620 | 100 | PASS | fixed 3, cosmetic residue (origin "0" ticks) |
| fidelity-auc-pair-explorer | p5.js | 580 | 100 | PASS | fixed 5 |
| fidelity-claim-sorter | p5.js | 580 | 100 | PASS | fixed 3 |
| lrs-architecture-explorer | vis-network | 660 | 100 | PASS | fixed 4, minor edge crossings |

No console errors over HTTP at 700 and 400 px (only the ad-hoc server's /favicon.ico 404).
`sync-iframe-heights.py --sim` changed no chapter for any of the eight (the chapters do not embed
them yet); the only chapter diff in the tree, docs/chapters/01-what-is-a-microsim/index.md, was
already modified before this batch started.
