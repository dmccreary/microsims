# Batch 07 gap notes

Sims: percentage-zone-calibrator, comparison-poster-explorer, poster-folder-explorer,
verified-poster-pipeline-explorer, claim-bucket-sorter, docker-lab-run-flow,
classifier-scenario-builder, width-responsive-breakpoint-lab.

## Batch-wide findings

- [skill-gap] `validate-sims.py` `_check_index_md` finds code blocks with
  `r'```(?:html)?\s*\n(.*?)\n```'`. A fenced block with any other info string (```` ```json ````,
  ```` ```yaml ````) before the embed block does not match as an opener, so its *closing* fence is
  taken as an opener and every later pair is misaligned. The copy-paste iframe block is then never
  seen and the sim loses 5 points ("missing copy-paste iframe example") even though the block is
  there. Hit on classifier-scenario-builder (a ```` ```json ```` data.json sample in About). Workaround:
  replaced the JSON sample with a field table. Fix: match ```` ```[\w-]*\s*\n ````.
- [skill-gap] vis-network guide: `network.fit()` fits node boxes only. Curved edges, their labels,
  and anything drawn in `beforeDrawing`/`afterDrawing` (the "reusable on their own" bracket) are
  ignored, so they were clipped at narrow widths. Needed either an invisible padding node
  (verified-poster-pipeline-explorer) or a manual `moveTo({scale})` from the known diagram extent
  (docker-lab-run-flow). The guide's Graph Positioning section should say this.
- [skill-gap] vis-network guide/template assume a 100vh network with an absolutely positioned
  280 px right panel. All three vis-network specs in this batch instead ask for "panel moves below
  the network under 600 px" inside a fixed-height iframe. There is no template for a fixed total
  height with a flex row that becomes a column; I reused batch-01's `#app` flex pattern. The
  guide also mandates `navigationButtons: true`, but the buttons overlap nodes at narrow widths
  and eat the bottom ~60 px; I turn them off under 600 px and shift the view up on wide layouts.
- [skill-gap] visual-checklist 5.2 only covers the horizontal-edge label offset bug. The common
  vis-network defect here was edge labels on short edges between adjacent boxes being wider than
  the gap and drawn under/over the boxes (docker-lab-run-flow). Worth a checklist item: "edge
  label wider than the gap between its nodes".
- [skill-gap] `test-iframe-heights.py` opens `main.html` via `file://`, so a p5 sketch that loads
  `data.json` (claim-bucket-sorter) cannot load its data under the tester. It still PASSES because
  controls are created in `setup()` before the data arrives, but a sketch that builds controls
  after loading data would fail spuriously. `bk-capture-screenshot` serves over HTTP, so the
  screenshot is fine. The p5 guide should also note that a p5.js-editor copy needs data.json
  uploaded next to the sketch.
- [skill-gap] p5 guide/CLAUDE.md pattern `describe(text, LABEL)` renders the description as
  visible text under the canvas, so `<main>` is ~55 px taller than CANVAS_HEIGHT on every p5 sim
  (hidden inside the fixed iframe, visible on the fullscreen page). Kept LABEL for consistency
  with the project convention; FALLBACK would avoid it.
- [skill-gap] p5 guide rule "no UI controls in the drawing region" cannot hold for Create-level
  builder specs ("a form on the left ... live preview on the right"). classifier-scenario-builder
  places its seven DOM inputs in the drawing region; only the action buttons sit below drawHeight.
- sync-iframe-heights.py: ran `--sim` for all eight; it updated 0 own-index and 0 embed iframes,
  and `git diff -- docs/chapters` is unchanged from the pre-run baseline (only the pre-existing
  ch01 modification). None of the eight sims is embedded in a chapter yet (Step 5 is central), so
  the fenced-code-block rewrite risk will surface only when Step 5 + sync run centrally.
- All eight main.html files load the right library (p5@1.11.10 for the five p5 sims;
  vis-network@9.1.9 plus its CSS for the three vis-network sims). No JS console errors or failed
  requests at 760 px (checked with a Playwright page.on('pageerror'/'response'/'requestfailed')).

## percentage-zone-calibrator

```
Instructional Design Check:
- Bloom Level: Apply
- Bloom Verb: calculate
- Recommended Pattern: direct manipulation with a live worked calculation, plus practice (target
  matching) and a click-test predictor
- Specification Alignment: aligned
- Rationale: the readout shows pixels ÷ picture size × 100 for each edge, so dragging produces a
  worked example; hiding percentages turns it into a calculation exercise with instant checking.
```

- [spec-gap] Placeholder poster aspect not given: chose 4:3 (the chapter's 1200 × 900 overlay
  size) with the three columns at the chapter's 2-34 / 34-67 / 67-98 × 12-90 zones.
- [spec-gap] Default zone not given: chose the chapter's first-column example (2, 12, 34, 90).
- [spec-gap] "Target practice ... then reports the error" did not say when the check happens:
  the button toggles Target practice → Check match → New target. Targets are whole numbers,
  x1 4-45, y1 6-40, width ≥ 18, height ≥ 25.
- [spec-gap] "Show percentages" scope unclear: off hides the handle labels and the computed
  percentage in the readout while keeping the pixel division visible, so learners can calculate.
- [spec-gap] Resize slider range not given: 50-100 % of the available picture width.
- [spec-gap] JSON shape for "Copy JSON": `{id, label, x1, y1, x2, y2}` rounded to one decimal;
  also written to the clipboard when the browser allows (usually blocked in an iframe).
- [decision] Added a "Reset zone" button (not in spec) so the worked example can be restored.
- [decision] Pixel values in the readout are rounded to whole pixels, so a hand calculation can
  differ in the last decimal; stated on the page.
- Layout review: 2 cycles (narrow readout overflowed the panel; narrow JSON/target lines wrapped
  badly). Clean after fixes.

## comparison-poster-explorer

```
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: compare
- Recommended Pattern: explore-then-quiz across parallel columns (comparison tool)
- Specification Alignment: aligned (first-try scoring added)
- Rationale: the poster prints only titles, prices and taglines, so answering the which-column
  questions requires opening and comparing the columns' facts.
```

- [spec-gap] Which facts to use: took 5 per column, paraphrased/shortened from the STEM Robots
  `docs/posters/robot-kits/data.json` (e.g. "Display: none" for Base Bot comes from the chapter's
  excerpt, not the real file). Quiz = the file's own five questions and explanations.
- [spec-gap] What the poster itself prints was unspecified beyond titles: chose title bar, column
  title, price badge (~$18/~$21/~$24), a robot drawing (wifi arcs / OLED screen) and a tagline.
- [spec-gap] Colors: named-color approximations crimson / teal / rebeccapurple for the file's
  #C7164E / #1389A6 / #6A3FB5 (the guide requires named colors).
- [spec-gap] Poster aspect/height not given: width follows the container (max 900), height
  min(290, 0.62 × width); panel below at all widths as specified.
- [decision] Score counts first-try correct answers ("First-try correct: n of m") instead of the
  grid engine's correct-only count, because the chapter criticizes that the engine's score cannot
  distinguish instant from fifth-try answers.
- Layout review: 2 cycles (wifi arcs overlapped the price badge; zone-edge labels covered the
  robot). Clean after fixes; residue: large empty panel in the default Explore state (panel
  shows the engine-style "click a column" prompt).

## poster-folder-explorer

```
Instructional Design Check:
- Bloom Level: Understand
- Bloom Verb: describe
- Recommended Pattern: network explorer with click-to-inspect and a symptom-to-file quiz
- Specification Alignment: aligned
- Rationale: roles are read on demand, and "Fix it" checks understanding by asking which file a
  symptom points to, separating one-poster from every-poster faults.
```

- [spec-gap] Tree orientation not given: used a left-to-right tree (root, folders, files) because
  nine leaf files do not fit side by side in an iframe.
- [spec-gap] Number and wording of Fix-it symptoms not given: wrote 9, a round draws 6.
- [spec-gap] Node colors by file type invented (folder, Markdown, HTML, JSON, image, shared
  engine) with a legend.
- [decision] "main.html loads shared-libs" arrow points at the shared-libs/ folder; its tooltip
  names the two files a grid poster actually links (grid-overlay.css and grid-diagram.js), as in
  the real STEM Robots robot-kits/main.html. diagram.js/style.css roles say grid posters do not
  load them.
- Layout review: 2 cycles (the "loads" label hidden under a leaf box; narrow Fix-it panel cut off
  the Next button). Residue: at 390 px the tree text is ~9 px (a 13-node tall tree in a 390 ×
  300 area).

## verified-poster-pipeline-explorer

```
Instructional Design Check:
- Bloom Level: Understand
- Bloom Verb: sequence
- Recommended Pattern: step explorer with predict-then-reveal, plus a shuffled ordering quiz
- Specification Alignment: modified (quiz added; skip toggle implemented as a select)
- Rationale: "What goes wrong if skipped?" is answered behind a reveal button to prompt
  prediction; the Sequence quiz shuffles unnumbered steps into a 3 × 3 grid so order cannot be
  read from position, then asks for the checkpoint and the only image-model step.
```

- [spec-gap] A left-to-right chain of nine nodes is unreadable at iframe widths: wrapped it like
  lines of text (steps 1-4, 5-8, 9), which also lets the "reusable on their own" bracket sit over
  one row.
- [spec-gap] Files per step not all given: step 2 and step 4 write no file of their own (source
  records go into the report; step 4 approves 02-verification-report.md); step 8 writes
  sources.md; step 9 writes data.json + main.html, per the verified-infographic guide.
- [spec-gap] Skip failures for steps other than 3 were invented from the guide's principles and
  anti-patterns.
- [decision] "Skip a step toggle" became a select ("(none)", "1 Claim plan" ... "9 Overlay"),
  because a toggle needs a target step.
- [decision] Added a Sequence quiz (not in spec) so the "sequence" objective is assessed.
- Layout review: 3 cycles (nodes too small with 4 × 160 spacing; retry-loop curve and label
  collided with the 8→9 edge; bracket clipped at narrow width because fit() ignores it). Clean
  after fixes.

## claim-bucket-sorter

```
Instructional Design Check:
- Bloom Level: Evaluate
- Bloom Verb: classify
- Recommended Pattern: drag-to-bucket sorting with immediate rule-based feedback and a hint cost
- Specification Alignment: aligned
- Rationale: each record forces a judgment from the passage plus the source type, and the
  feedback names the deciding rule, so the learner justifies rather than guesses.
```

- [spec-gap] The 12 records were invented: 3 per bucket, built around the chapter's traps
  (meta-source citation, top-of-range, pooled meta-analysis estimate that *is* VERIFIED,
  qualitative claim that cannot be VERIFIED, peer-reviewed source that contradicts the claim,
  marketing page, blog with unnamed studies). Numbers are labeled invented on every card.
- [spec-gap] Scoring values not given: 10 per correct sort, 5 with "Show rule" (mirrors the
  classifier guide's pointsCorrect / pointsWithHint).
- [spec-gap] What "Show rule" reveals before sorting was undefined (the rule text itself names
  the bucket): each record has a `hint` (the deciding question) shown by Show rule, and a `rule`
  shown as feedback.
- [spec-gap] "Summary lists missed records by pattern": each record carries a `pattern` field;
  misses are grouped under it.
- [spec-gap] Side panel at narrow widths unspecified: hidden under 700 px, with short
  definitions inside each bucket instead; 2 × 2 buckets under 500 px as specified.
- [decision] Keys 1-4 also sort the card (keyboard access for a drag interaction).
- Layout review: 2 cycles (REJECTED definition truncated in the side panel; summary lines ran
  off the canvas at 390 px). Clean after fixes.

## docker-lab-run-flow

```
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: diagnose
- Recommended Pattern: symptom-first diagnosis (click the broken part), then reveal cause and fix
- Specification Alignment: modified (Diagnose first + Mystery mode, two extra failures)
- Rationale: showing the red node immediately would turn diagnosis into reading; with Diagnose
  first on (default) the learner infers the broken part from the symptom alone.
```

- [spec-gap] Five nodes but four arrow labels: mapped them to the real docker-lab.js round trip
  (Run clicked, code sent, container started, text returned [container → docker-lab.js, dashed],
  output displayed [docker-lab.js → output area]); tooltips give the mechanics.
- [spec-gap] Symptoms and fixes for "script missing from mkdocs.yml" and "input()" were not
  given: used "ReferenceError: runDocker is not defined" / add js/docker-lab.js to
  extra_javascript, and "EOFError: EOF when reading a line" / replace input() with a value,
  consistent with docker-lab.js's error handling in the skill's assets.
- [spec-gap] Panel placement not specified: below the diagram at all widths (a row of five needs
  the full width).
- [decision] Added two failures (starter imports numpy; Run calls runDocker('2') in a lab whose
  IDs end in -1) and a "Mystery: symptom only" option, so learners must separate two "nothing
  happens" symptoms. The spec listed three failures.
- [decision] "Diagnose first" checkbox (default on) delays the red node until the learner clicks
  the broken part; unchecked gives the spec's immediate reveal.
- Layout review: 3 cycles (short-edge labels hidden under boxes; column curves clipped; narrow
  toolbar wrapped to three rows). Residue: at 390 px the column is ~10 px text.

## classifier-scenario-builder

```
Instructional Design Check:
- Bloom Level: Create
- Bloom Verb: write
- Recommended Pattern: builder with live preview, automatic checks and a play-test mode
- Specification Alignment: aligned (human-judgment check made explicit)
- Rationale: learners author all seven fields, see the learner view update as they type, and
  test the card; the "exactly one defensible option" part cannot be string-checked, so it is a
  prompted self-check with a checkbox.
```

- [spec-gap] Thresholds for "option far longer than the others" undefined: flagged when an option
  is > 1.8 × the mean length of the others and at least 12 characters longer.
- [spec-gap] "Hint repeats the answer" undefined: flagged when the hint contains the answer or
  ≥ 60 % of the answer's words of 4+ letters.
- [spec-gap] "Correct answer missing from the options" cannot happen when options are built from
  correctAnswer + distractors; implemented as "correctAnswer empty, or repeated by a distractor"
  plus a duplicate-distractor check.
- [spec-gap] Starting content not specified: a "Start from" select loads the chapter's symmetry
  fabrication example (default), a flawed draft with three planted problems, or a blank form.
- [spec-gap] Canvas height: stacking form and preview under 700 px forces a tall fixed height
  (835); wide layouts use the extra space for the quality report and JSON panels.
- [decision] Added the "Only one option is defensible (I checked)" checkbox, the fifth check.
- Layout review: 2 cycles (quality report overflowed; narrow try-mode feedback had no room).
  Clean after fixes.

## width-responsive-breakpoint-lab

```
Instructional Design Check:
- Bloom Level: Apply
- Bloom Verb: demonstrate
- Recommended Pattern: parameter exploration with independent mechanism toggles and diagnostic
  readouts
- Specification Alignment: aligned
- Rationale: the learner predicts what breaks, then confirms it by toggling windowResized and
  slider resizing separately while dragging the container edge.
```

- [spec-gap] How a 280-900 px container fits inside a narrower canvas was not specified: the
  miniature is scaled horizontally (screen px per mini px = available width / 900) and kept 1:1
  vertically; mini text shrinks to a 10 px floor and button labels drop when they cannot fit.
- [spec-gap] Mini sketch constants invented: sliderLeftMargin 110, right margin 25, buttons at
  x 10/80/150, ball at canvasWidth / 2.
- [spec-gap] Behavior when re-enabling a checkbox: it takes effect on the next resize (as in a
  real sketch), and the note says so.
- [spec-gap] "Undershoot" had no marker in the spec; reported in the notes as "N px short" (the
  red outline marks only overflow, as specified).
- Layout review: 1 cycle, clean at 760 and 390 px.
