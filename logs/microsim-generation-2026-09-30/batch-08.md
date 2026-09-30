# Batch 08 gap notes

Sims: height-resolution-order-tracer, iframe-resize-message-stepper, quality-score-calculator,
layout-defect-catalog-explorer, iframe-height-test-simulator, review-fix-cycle-simulator,
quality-chain-workflow, audit-baseline-explorer (chapters 12 and 13).

All eight score 100 in validate-sims.py and PASS test-iframe-heights.py (through the Chrome shim).
`sync-iframe-heights.py --sim <id>` changed nothing in any chapter: no chapter embeds these sims yet,
and chapters 12/13 were byte-identical (md5) before and after. The only fenced-code iframe in ch 12
(line ~186) points at bouncing-ball-gravity-lab, not at a batch-08 sim.

## Batch-wide findings

- [skill-gap] **Chapter 13 vs. skill vs. template on the CANVAS_HEIGHT comment form.** Ch 13 line 341
  ("The Comment Format Trap") tells readers to write `// CANVAS_HEIGHT = N` because the tester reads only
  the equals form; SKILL.md Step 4.4 and this brief mandate `// CANVAS_HEIGHT: N`; the p5 template
  `assets/templates/p5/bouncing-ball.js` itself uses `// CANVAS_HEIGHT = 430`. Three sources, two
  answers. I followed the brief (colon). Pick one form everywhere, or fix the tester regex (known) and
  then change the chapter text.
- [skill-gap] **Two different repair rules for a tester FAIL.** SKILL.md Step 6C: "Update the
  CANVAS_HEIGHT comment to the suggested height minus 10" (720 for a 730 suggestion, so iframe 722).
  Ch 13's worked example: set the iframe to the suggested height (730, i.e. CANVAS_HEIGHT 728). The
  quality-chain-workflow trace follows the chapter.
- [skill-gap] **`describe(text, LABEL)` renders visible text below the canvas.** The p5 guide, template
  and CLAUDE.md all use LABEL. It adds a visible `<div><p>` under the canvas (hidden in the iframe, but
  visible in fullscreen) and makes the tester's measured content height ~100-200 px taller than
  CANVAS_HEIGHT (e.g. 738 vs 610). Harmless to PASS/FAIL, but it inflates the tester's suggested height
  on a FAIL whenever the colon comment form is used. Consider the default FALLBACK mode.
- [skill-gap] **p5 1.11 DOM labels are innerHTML.** `createCheckbox('<main> element')` silently creates a
  second `<main>` element in the page (caught in quality-score-calculator). Labels containing `<`, `>` or
  `&` must be escaped; the p5 guide should say so, especially for MicroSims about HTML.
- [skill-gap] **DOM controls over canvas drawings.** Several specs put checkboxes inside the drawing
  region (rubric list, "checkboxes on each file element"), which the p5 guide forbids, and canvas-drawn
  tooltips/overlays then sit *under* the DOM elements. I had to move hover help into a side panel and
  hide the list controls while a canvas overlay is open. The p5 guide has no advice on DOM/canvas z-order.
- [skill-gap] **Mermaid edges cannot take a click directive.** Mermaid supports `click` only on nodes;
  specs keep asking for "a click directive on every node and every edge". Implemented (as batch 01 did)
  by attaching listeners after render to a wide transparent clone of each `path.flowchart-link`
  (Mermaid 10 classes `LS-<from> LE-<to>`) and to its `.edgeLabel`. The mermaid guide should document
  this pattern, and the spec template should stop promising edge click directives.
- [skill-gap] **validate-sims.py quirk worth documenting.** `_check_p5_conventions` gives all 5 points
  when main.html is missing ("benefit of the doubt"), so an empty folder scores 5, and adding a bare
  main.html to a p5 folder with no script is a net 0 change (+5 file, -5 p5 conventions). Ch 13's rubric
  table does not mention this; the calculator models it.
- [skill-gap] **test-iframe-heights.py reads any `*.js`, sync reads only `<sim-id>.js`.** The tester's
  `extract_canvas_height` globs every .js file in the folder; the sync tool reads only `<sim-id>.js`.
  A helper .js with a stale comment would give the two tools different declared heights.
- [skill-gap] **bk-capture-screenshot is port-safe, not load-safe.** Running 8 captures in parallel
  (while other agents also captured) made the Mermaid capture time out at Playwright's 30 s screenshot
  limit; a solo retry worked. The brief's "safe to run in parallel" should say "in small numbers".

## height-resolution-order-tracer

```
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: examine
- Recommended Pattern: rule explorer with predict-then-trace (set inputs, click the predicted winner, press Trace)
- Specification Alignment: aligned (the short Trace animation shows the search order; it is on demand, not continuous)
- Rationale: analyzing a priority rule needs the learner to vary which sources exist and commit to a winner before seeing it; the stepwise highlight makes the stop-at-first-value rule visible.
```

- [spec-gap] Preset contents were not defined. Chose: p5 sketch = comment 450 + variables 400+50 (they
  agree); Mermaid = metadata 480 only, no script file; Legacy = main.html comment 500 only, no script;
  Variables only; No height anywhere. The script file appears in the tree only when source 1 or 4 is on.
- [spec-gap] How the learner predicts was unspecified: click a source box (or the result panel for
  "unresolved"); the result states whether the prediction was right.
- [spec-gap] Tooltip wording invented; for source 2 it mentions that `--write-metadata` would overwrite
  the stale value (true of the real script).
- [spec-gap] Invented a stale `height="402px"` in index.md so "iframes left untouched" and the rewrite
  are both visible in the tree.
- [spec-gap] No canvas size given: drawHeight 430 + controlHeight 180 = 610 (5 control rows).
- [decision] "Checkboxes on each file element" would put DOM controls in the drawing region; I kept the
  checkboxes and number fields in the control region and made each tree line clickable to toggle the
  same source.
- [decision] Source 4 is drawHeight + controlHeight only (spec: "400 plus 50"); the script's graphHeight,
  canvasHeight-variable and createCanvas() fallbacks are described in metadata limitations, not modeled.

## iframe-resize-message-stepper

```
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: differentiate
- Recommended Pattern: step-through (Next/Back) with visible numbers, three modes compared on the same content
- Specification Alignment: aligned
- Rationale: the learner must compare three outcomes for the same callout; stepping keeps each protocol step and each pixel value visible, which continuous animation would hide.
```

- [spec-gap] No numbers given. Used the pinning reference's infobox heights 110 / 140 / 240 px (jump
  130 px), image area 200, control row 44, default attribute 402px (so the long callout clips in Fixed
  mode and the medium one does not).
- [spec-gap] Interaction between steps and callout changes undefined. Chose: before step 5 the callout
  only changes the child; after step 5 an unpinned runtime child re-reports (a new message, as a
  ResizeObserver would) and the iframe follows if the listener is on; a pinned child's height does not
  change, so no message. Mode, listener and allowance changes reset to step 1.
- [spec-gap] Fixed-height mode steps 2-5 are shown as "skipped: no height reporter".
- [spec-gap] "Iframe border allowance" mapped to the `+ 30` in diagram.js's `scrollHeight + 30` (the
  chapter's p5 snippet uses +10).
- [decision] Below 700 px the panels stack inside the same fixed height by shrinking the miniatures;
  usable but cramped at 420 px.

## quality-score-calculator

```
Instructional Design Check:
- Bloom Level: Apply
- Bloom Verb: calculate
- Recommended Pattern: calculator with presets, visible arithmetic and a "cheapest fix" check
- Specification Alignment: aligned
- Rationale: calculating a score means applying the rubric's weights and gates; ticking checks with the per-group arithmetic shown lets the learner verify each step and then search for the largest gain.
```

- [spec-gap] "About 20" checkboxes: 19 rubric checks plus a "Not a p5.js MicroSim" toggle (the chapter
  says other libraries receive all 5 points).
- [spec-gap] The spec and chapter table omit the script's gates; implemented them from validate-sims.py
  (schema/main need main.html, metadata sections need metadata.json, p5 points free without main.html).
  Consequence: Blank folder scores 5, not 0.
- [spec-gap] "Cheapest fix" = largest single gain; ties are all highlighted. For Bouncing Ball three
  checks tie at +5 (educational, description, References); the chapter's example names only the
  description section. The suggestion also reports the fewest fixes to reach 85 (greedy).
- [spec-gap] A-star's library was not stated; it must be p5.js with all conventions to total 74.
- [spec-gap] Show gate line default on (not specified).
- [decision] The rubric checkboxes sit in the drawing region (required by the spec's layout); hover help
  goes to a panel (wide) or the readout strip (narrow) because canvas tooltips would be hidden under the
  DOM checkboxes; native title tooltips added too.
- [decision] drawHeight 540 at every width so the one-column narrow layout (<500 px) fits.

## layout-defect-catalog-explorer

```
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: distinguish
- Recommended Pattern: defect finder (click to flag) with classification feedback and a family filter
- Specification Alignment: modified (defect list; see decisions)
- Rationale: distinguishing defect types requires searching a realistic rendering and getting immediate feedback on both the location and the family; Apply repair shows cause and effect.
```

- [spec-gap] Internal conflict: "eight defects taken from the table (the eight symptoms)" but the mock
  must show "pale text on aliceblue", which is not one of the table's eight, and the table's "drawing
  area is white, not aliceblue" cannot coexist with pale text on aliceblue.
- [decision] The eight = seven table symptoms + low-contrast pale text (checklist 1.4); dropped
  "drawing area white" (4.1). The objective names low color contrast, so 1.4 is essential.
- [spec-gap] Mapping the eight to the three filter families was invented: Clipped content = row labels,
  title under panel, painted-over heading; Hidden control = slider past edge, slider label on track,
  overlapping buttons; Color contrast = halo, pale text.
- [spec-gap] "Title missing or white sliver" realized as a legend heading painted over by its own
  background rectangle (the title is already used for the panel collision).
- [spec-gap] Wrong-flag hint texts invented, chosen by region (JSON panel, column headers, sliders,
  empty control strip).
- [decision] With a family filter, other defects are drawn repaired and are not clickable; the counter
  reads "Found n of 8 (k shown)".

## iframe-height-test-simulator

```
Instructional Design Check:
- Bloom Level: Apply
- Bloom Verb: calculate
- Recommended Pattern: parameter sliders with predict-then-run; per-element inequality on click
- Specification Alignment: aligned
- Rationale: applying the pass rule and the suggestion formula to changing numbers is an Apply task; results appear only after Run test, so the learner calculates first and then checks.
```

- [spec-gap] Element positions were not given. Invented: canvas 0-260, sliders with bottoms 286 / 316
  / 346, Start 398, Reset bottom = the Content height slider (400-800), so Reset is always the lowest.
- [spec-gap] Default declared value not given: 520 (so the suggestion differs from the measured one).
- [decision] Any slider/field change marks results stale until Run test is pressed again (predict
  first). The canvas row shows "measured only" (the tester never fails canvases). On PASS the panel says
  the tester repeats the current height rather than hiding the line entirely.
- [decision] The declared value is displayed as `// CANVAS_HEIGHT = N` with a note that the tester reads
  only the equals form (matches the real regex and ch 13).

## review-fix-cycle-simulator

```
Instructional Design Check:
- Bloom Level: Evaluate
- Bloom Verb: judge
- Recommended Pattern: choice evaluation under a 3-cycle budget, with an explained report
- Specification Alignment: aligned (one added control, see decision)
- Rationale: judging patches needs consequences the learner can see (fixed / new defect / no change) and a scored, explained report; the cycle lock forces the stop-and-report decision.
```

- [spec-gap] Patch texts, which new defect each over-broad patch creates, and how those new defects are
  patched were not specified. Invented: over-broad patches create 2.2 slider label on track, 4.1
  borders gone or 3.3 panel overflow; each of those has its own three patches, whose over-broad option
  re-breaks a seeded defect.
- [spec-gap] How a defect is "selected" was unspecified. Added a Defect dropdown (FAIL items only) and
  made strip items clickable. [decision] one extra control beyond the spec.
- [spec-gap] "Scores the run" had no formula. The report gives final state (clean/partial/unfixed),
  defects fixed, new defects, cycles used, remaining FAILs, a per-cycle explanation and a judgment of
  the stopping decision; no single number.
- [spec-gap] The "unchecked" strip state is shown as a short re-walk after each re-capture.
- [decision] Patch order in the menu is mixed per defect so the correct patch is not always first.

## quality-chain-workflow

```
Instructional Design Check:
- Bloom Level: Understand
- Bloom Verb: explain
- Recommended Pattern: clickable flowchart plus step-through trace (Next step), no continuous animation
- Specification Alignment: modified (trace is stepped, not animated)
- Rationale: explaining an ordered process with a feedback loop is best supported by concrete per-step text the learner can read at their own pace.
```

- [spec-gap] "A click directive on every edge" is not possible in Mermaid; edges get post-render
  listeners (see batch-wide note).
- [spec-gap] Edge labels invented (score, PNG, reviewed, results, pass, fail, re-capture, third cycle
  reached); edge infobox texts written from ch 13.
- [spec-gap] The failure trace uses ch 13's predator-prey numbers (697 / 720 / 730); the score of 88 is
  explicitly hypothetical ("say the MicroSim scores 88").
- [decision] Mermaid pinned to 10.9.8 (scaffold had floating `mermaid@10`), matching batch 01.

## audit-baseline-explorer

```
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: examine
- Recommended Pattern: linked charts with drill-down (click a grade, filter the issues) and a metric switch
- Specification Alignment: aligned (one added filter option)
- Rationale: examining which issues hold MicroSims below A needs filtering by grade and comparing frequency with weighted cost.
```

- [spec-gap] The spec gives issue totals but not the per-grade counts needed for "clicking a grade bar
  filters the issue chart". Tallied them from the per-MicroSim issue lists in TODO.md's audit section;
  they reproduce every spec total (110/76/74/73/68/60/54/43), the grade counts and the 60.6 mean.
- [spec-gap] Rubric points for "No main.html" ambiguous: used 10 (file 5 + schema 3 + main 2); the
  tooltip note says a p5 folder may lose its 5 free p5 points.
- [spec-gap] Layout conflict: "grade chart above the issue chart" vs "the two charts stack under 600".
  Chose: grade chart beside the info panel, issue chart full width below (≥600); everything stacked
  below 600.
- [spec-gap] The spec's eight issues omit three more frequent ones in the same audit (missing iframe
  50, social images 45, fullscreen link 44); noted in metadata limitations.
- [decision] Added a "Below A (B, C, D)" filter (directly serves the objective) and colored issue bars by
  rubric points (10/5/3) with a legend.
