# Batch 14 gap notes

Sims: accessibility-check-walkthrough, pii-surface-explorer, prediction-fairness-explorer,
portfolio-milestone-planner, portfolio-rubric-self-check, roadmap-status-board,
guess-resistance-lab, prediction-trust-ladder.

## Batch-wide findings

- [skill-gap] p5-guide.md assumes a fixed `drawHeight` and a fixed number of control rows, but
  several of these specs name more controls than fit in one row at 400 px (the brief's narrow
  test width) while fitting in one or two rows at 700 px. With a single fixed iframe height the
  guide gives no pattern for this. I used a small "flow layout" helper: controls are placed left
  to right and wrap, `controlHeight = rows * 38 + 12`, and `drawHeight = canvasHeight -
  controlHeight`, so `canvasHeight` (and CANVAS_HEIGHT) stays constant at every width while the
  drawing region gives up the height the extra control rows need. The guide's rule
  "CANVAS_HEIGHT = drawHeight + controlHeight" still holds at every width.
- [skill-gap] p5-guide.md never mentions keyboard access for canvas-drawn clickable content
  (cards, bars, fields), although Chapter 24 of this very book says a canvas click handler has
  no keyboard equivalent unless you write one, and warns that a page-level `keyPressed()` can
  hijack scrolling. The pattern I used in the canvas-click sims of this batch: give the canvas
  `tabindex="0"`, listen for `keydown` on the canvas element only (never the page), move a
  visible selection with the arrow keys, activate with Enter/Space, and let Tab leave the
  canvas so focus is never trapped. The validator's "manual hit-testing" heuristic is satisfied
  because builtin controls are also present.
- [skill-gap] p5 `createCheckbox()` and `createSelect()` produce elements with different
  vertical metrics, so a row of `[label + select] [checkbox] [checkbox]` positioned at the same
  `y` looks misaligned by 3-5 px. Fixed with a CSS class (`height: 30px; display: flex;
  align-items: center`) on those elements. The guide shows no CSS for control rows.
- [spec-gap] Chapter 24 names WCAG **2.1** level AA as the book's target; the batch
  instructions mentioned WCAG 2.2 AA. I followed the chapter text (2.1 AA) and noted in the
  accessibility sim that the four success criteria it exercises are unchanged in 2.2.

## accessibility-check-walkthrough

```
Instructional Design Check:
- Bloom Level: Evaluate
- Bloom Verb: judge
- Recommended Pattern: rubric/checklist evaluation of a hands-on mock, with feedback on each verdict
- Specification Alignment: modified (variants A and B each carry a second defect; see decision)
- Rationale: judging requires operating the mock with the keyboard and reading the description,
  then committing to a verdict that is compared with the built-in answer and explained.
```

- [decision] The spec gives variant A a pointer-only canvas control and variant B a hidden
  focus indicator, and says C passes all four checks. Read literally, checks 3 (text
  alternative) and 4 (no color-only meaning) would pass in every variant, so the "Show
  description" toggle would never reveal a defect and "always Pass" would score well on two of
  four checks. I added a second built-in defect to A (a vague description, "Interactive
  sketch.") and to B (a status light that uses red versus green with no word). C still passes
  all four. A and B each fail two checks.
- [spec-gap] The mock's two controls, its task and its status were unspecified. Chose a
  Gravity slider (0.1-2.0, default 0.5), a Drop button, the task "set Gravity to 1.0, then press
  Drop", and a Ready/Falling/Landed status light.
- [spec-gap] "Four pass/fail buttons, one per check": implemented as one button per check that
  switches Pass/Fail on each press (label shows `?` until judged; the aria-label says "not
  judged"). Changing a verdict hides the revealed answers for that variant.
- [spec-gap] "Lights the focus ring when the learner presses Tab": the canvas is a Tab stop;
  while it has focus, Tab/Shift+Tab move a simulated focus between the mock's controls, and Tab
  past the last mock control leaves the canvas (no keyboard trap). I did not move focus
  automatically when Keyboard only is switched on (that would be an unannounced change of
  context); the mock tells the learner to click it once or Shift+Tab to it.
- [decision] "Show description" hides the mock picture and shows only the text a screen
  reader would read, which is the chapter's test ("read the describe() text without looking at
  the canvas").
- [spec-gap] Feedback for matches was unspecified: matches are marked "match"; mismatches and
  unjudged checks show the answer and a one-sentence reason. The same result is announced in an
  aria-live region.
- [decision] CANVAS_HEIGHT 700 (iframe 702). The checklist moves below the mock under 600 px as
  specified; 700 px is the smallest height at which the worst case (four explanations at 400 px
  wide) still fits inside the checklist panel.

## pii-surface-explorer

```
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: classify
- Recommended Pattern: classification with graded feedback (match / defensible / mismatch) and a reason per field
- Specification Alignment: aligned
- Rationale: learners must take the statement apart field by field and decide what exposes or
  protects each one; the amber "defensible" state rewards reasoning rather than one key.
```

- [spec-gap] "Two context fields" are not in the chapter's illustrative statement (it has no
  context). Chose `context.contextActivities.grouping` (the textbook version the Chapter 16
  producer contract requires on every statement; No PII risk) and `context.registration` (an
  xAPI attempt UUID; Pseudonymous). Registration is not mentioned anywhere in the book, but
  without it no field's correct class would be "Pseudonymous" and that button would be a pure
  distractor. The sim and index.md say the context fields were added for the exercise.
- [spec-gap] The answer key and the "defensible" alternatives were unspecified. Chose:
  homePage = No PII risk (alt Direct identifier); account.name = Direct identifier (alt
  Pseudonymous; Chapter 16 says homePage + name "identify one person"); verb.id, object.id,
  grouping = No PII risk (no alt); result.success = No PII risk (alt Pseudonymous);
  result.response = Uncontrolled free text (alt Direct identifier); registration = Pseudonymous
  (alt No PII risk). Each has a one-sentence reason; mismatches also name the chapter's class.
- [spec-gap] The storage risk lists were unspecified beyond "shared-device risk for LRS-Lite".
  Full LRS: pseudonymous student_key and separate vault (designed, not built; Ch 20), <10
  suppression and audit (designed, not built; Ch 21/24), raw statement keeps result.response
  (Ch 20 says the raw column replaces only the actor). LRS-Lite: shared browser profile (Ch 24),
  eviction / Chromebook wipe (Ch 22), sync copy in object storage (Ch 23).
- [spec-gap] Behavior after a class is changed post-check was unspecified: the field's color
  clears until "Check my answers" is pressed again (prevents pure trial-and-error coloring).
- [decision] Colors are Okabe-Ito-derived tints with a symbol and a word in each box (check /
  tilde / cross; Match / Defensible / Mismatch) so the verdict never relies on green versus red.
- [decision] Keyboard access added (not in the spec): the statement is a Tab stop; arrow keys
  move the selection and keys 1-4 assign a class.
- [decision] "Truncate with a tooltip": values are truncated with an ellipsis and a hover
  tooltip shows the full value; the reason panel also shows the full value of a truncated,
  selected field (hover does not exist on touch screens).
- [decision] CANVAS_HEIGHT 790 so the worst case (a long reason and the LRS-Lite list at 400 px
  wide, three control rows) fits; at 700+ px there is about 80 px of spare aliceblue at the
  bottom.

## prediction-fairness-explorer

```
Instructional Design Check:
- Bloom Level: Evaluate
- Bloom Verb: critique
- Recommended Pattern: disaggregation chart with scenario comparison and a verdict message
- Specification Alignment: aligned
- Rationale: critiquing a pooled summary requires seeing each group's error beside the pooled
  line and being told, in words, when the summary hides a gap or when suppression hides a group.
```

- [spec-gap] "One pair of bars per group" did not say what the pair is, while the data line
  mentions a single "prediction error" per group. Chose the two directions of error:
  under-estimated (predicted "not yet", passed a held-out check) and over-estimated (predicted
  "mastered", failed). This keeps the chapter's "mis-estimated ... in a consistent direction"
  visible, and the keyboard hypothesis (less hover evidence read as less understanding)
  appears as under-estimation. Pooled lines are drawn for both measures.
- [spec-gap] The synthetic numbers were unspecified. Chose counts (so each rate is an honest
  fraction): Even error 150/40/30 learners; Hidden gap 170/24/36 with keyboard 9 of 24 (37.5%)
  under-estimated against a pooled 25/230 (10.9%); Small group 180/40/12 with shared device 5 of
  12 (41.7%) under-estimated, suppressed once the threshold exceeds 12. Group sizes are chosen
  so that only the Small group scenario is affected by the 5-20 threshold range.
- [spec-gap] The gap rule for the message was unspecified: a visible group 10 or more
  percentage points above the pooled rate for either measure is flagged.
- [decision] The suppression message adds that the pooled lines still count the hidden
  learners, so subtraction could recover them (Chapter 25's complementary suppression).
- [decision] Default scenario is Hidden gap (the most instructive first view); Reset returns
  to it with threshold 10 and pooled lines on.
- [decision] Pooled values are labeled in a key box at the top-left of the plot (Pointer users
  never reach it) instead of at the end of each line, where the labels covered the Shared
  device bars.
- [skill-gap] chartjs-guide.md has no pattern for a reference line (pooled average, target,
  threshold). The obvious approach, labels at the right end of each line, collides with the
  last category's bars; a key box or legend entries is needed. The guide also gives no
  pattern for the data-table fallback the spec asks for; a `table` inside an `.sr-only` class
  caused 150 px of horizontal overflow at 400 px because `overflow: hidden` does not apply to
  table elements. Wrapping the table in an `.sr-only` div fixed it.

## portfolio-milestone-planner

```
Instructional Design Check:
- Bloom Level: Create
- Bloom Verb: design
- Recommended Pattern: builder/planner: parameter sliders drive a Gantt schedule with live risk feedback
- Specification Alignment: aligned
- Rationale: designing a schedule means trying constraint combinations and seeing immediately
  which gates fall past the deadline; clicking a bar ties each bar to its deliverable and gate.
```

- [spec-gap] The effort model was unspecified ("stretches or shrinks the bars"). Chose linear
  illustrative estimates calibrated to reproduce the chapter's 8-week suggestion at the
  defaults: generate 0.4 wk/MicroSim, instrument 0.2 wk/MicroSim, test and review 0.25 + 0.15
  per participant + 0.06 per MicroSim; the other four stages fixed at 1 week. The sim and page
  say they are not measured effort data.
- [spec-gap] Scheduling rule unspecified: stages run strictly one after another (the chapter
  says each stage feeds the next); no overlap, no compression of fixed stages.
- [spec-gap] "Bars that no longer fit": a bar is amber when it ends after `Weeks available`.
  I also mark Test and review amber when participants < 3, because the brief asks for "3 or
  more test participants"; this is a gate risk that is not about time, which serves the "which
  gates put the schedule at risk" half of the objective.
- [spec-gap] "Eight week columns": the grid shows `Weeks available` columns plus shaded overflow
  columns when the plan runs long, with a dashed deadline line. Labels shorten from "Week 3" to
  "Wk 3" to "3" as columns narrow (spec: rotate or abbreviate).
- [decision] Amber bars also get a dashed outline and "!" so risk is not shown by color alone.
  The "Specify and generate" bar is selected on load so the panel is not empty. Keyboard access
  added (Tab to the chart, arrow keys select bars).
- [decision] Controls: three sliders in three rows with Reset at the right of row 1; under 620
  px Reset moves to a fourth row and the drawing region shrinks (constant CANVAS_HEIGHT 680).

## portfolio-rubric-self-check

```
Instructional Design Check:
- Bloom Level: Evaluate
- Bloom Verb: assess
- Recommended Pattern: rubric tool: per-criterion rating sliders, live stacked bars, a suggestion, and a written justification
- Specification Alignment: aligned
- Rationale: assessing against criteria needs the "full credit means" text at hand (tooltip),
  immediate feedback on points, and a place to justify the priority rather than accept it.
```

- [spec-gap] Slider step unspecified: 5 percent (0-100, default 50).
- [spec-gap] "Largest points still available" ties were unspecified: the first criterion in
  rubric order wins and the message names the tied criteria. At 100 percent everywhere no
  criterion is suggested and the message asks the learner to re-check the ratings.
- [spec-gap] Whether the reason text box should persist was unspecified. It is kept in the page
  only (no storage), so nothing a learner types leaves the page or survives a reload.
- [decision] The suggestion message adds one sentence ("Points are one reason; also ask which
  fix other criteria depend on") so the tool does not teach that the largest remaining points
  is always the right first fix; the objective asks the learner to justify the choice.
- [decision] Layout: chart left and sliders right above 640 px; below 640 px the sliders stack
  under the chart as one compact line each (short labels such as "Usability/review (15)"), and
  the chart shrinks to keep the fixed 620 px height. At 400 px the slider rows are only about
  18 px tall, below the 44 px touch-target size Chapter 24 names as a design target.

## roadmap-status-board

```
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: distinguish
- Recommended Pattern: explorer of labeled cards with a detail panel, label filters and a labeling quiz
- Specification Alignment: aligned (quiz sampling and "partly built" mapping decided here)
- Rationale: distinguishing evidence status requires reading each item's source and test; the
  quiz hides the labels so the learner must recall the evidence, not the color.
```

- [spec-gap] The spec's three labels do not cover the chapter's own table, which labels
  verified adapters and shared sim libraries "Partly built" and the POST path "Designed, partly
  built". Chose: the first two are Built (checked, working code exists for part of each), the
  POST path is Designed; all three cards say "(partly built)" and the panel quotes the
  chapter's wording. The quiz scores against the primary label.
- [spec-gap] The spec does not say which label the four open problem areas carry or which lane
  they sit in. Put them in the long-term lane as Hoped for, following the chapter's statement
  that Hoped for "is the label for everything in the long-term half of the chapter"; their
  source reads "No source: speculative".
- [spec-gap] Required tests for the four open problems are not stated in the chapter; each card
  derives one from the recorded problem (e.g. privacy: show that subtraction across
  aggregate-only reports cannot reveal an individual). Long-term idea tests are taken from the
  chapter text. No dates are invented; the near-term horizon is "about one year".
- [decision] "Five random cards": the quiz draws three near-term and two long-term cards, since
  nine of the fourteen cards are Hoped for and a uniform draw would usually be trivial.
- [decision] Built cards use a darker steel blue (rgb 40,90,140) instead of CSS steelblue,
  because white text on steelblue is only 4.1:1 (below WCAG AA 4.5:1). The label word is
  printed on every card and hoped-for cards keep the dashed border, so color is not the only
  cue. Labels are hidden during the quiz, including in the hover tooltip.
- [decision] Keyboard access added: the board is a Tab stop, arrow keys move the selection, and
  B/D/H answer quiz cards.
- [decision] CANVAS_HEIGHT 760: at 400 px the two-column lanes (3 + 5 rows) plus the panel below
  them need about 700 px of drawing region; at 700+ px the lanes sit beside the panel and about
  100 px of the left column is spare (it holds the label definitions).

## guess-resistance-lab

```
Instructional Design Check:
- Bloom Level: Apply
- Bloom Verb: compare
- Recommended Pattern: parameter sliders with a live formula bar chart, a single-run animation and a 1000-run histogram
- Specification Alignment: aligned
- Rationale: comparing designs means changing options, chaining and retry and seeing both the
  exact probability and simulated guessers; the short attempt animation shows the sequence that
  distinguishes a guesser, which a static number cannot.
```

- [spec-gap] With chained items the spec's "picks uniformly at random among the options not yet
  tried" is ambiguous. Chose the chapter table's model: feedback is for the whole chain, so a
  retry is a new combination, and success is guaranteed within options^chained attempts (the
  table's "Two chained four-option items ... 16"). Per-item retry would guarantee success
  within options x chained attempts instead; the page states the assumption.
- [spec-gap] "The bar chart ... for the current design": a single bar cannot compare designs,
  so the chart shows the current design beside the chapter's three reference designs (1 in 4,
  1 in 6, 1 in 16). I drew it as horizontal bars (0-50 percent) because vertical bar labels
  collided at 400 px. At 700+ px the chapter's comparison table is also drawn, with a row for
  the current design.
- [spec-gap] Histogram with retry off: every guesser uses one attempt, so it is drawn as one
  stacked bar (successes / failures) with counts. With retry on, attempts are binned into at
  most 24 bins (up to 1728 attempts for 12 options x 3 items). The 1000-guesser run samples the
  success position uniformly on 1..K, which is exactly the distribution of guessing without
  replacement (commented in the code); the single guesser is simulated combination by
  combination.
- [spec-gap] Long attempt sequences (hundreds of attempts) are compressed in the strip: first
  attempts, an ellipsis, the final attempt, and a count of hidden wrong attempts. The animation
  speeds up so any sequence finishes in about three seconds.
- [decision] Red/green squares from the spec are Okabe-Ito vermillion and bluish green, each
  with a cross or check mark.
- [skill-gap] Naming a color constant `RIGHT` (or `LEFT`, `CENTER`, `TOP`, `BOTTOM`) silently
  shadows the p5 global of the same name: `textAlign(RIGHT, ...)` then receives an RGB array
  and Chrome logs "is not a valid enum value of type CanvasTextAlign" every frame, with text
  drawn left-aligned. Same family as the known `nf()` collision; p5-guide.md could list the
  p5 constant names to avoid.
- [skill-gap] A p5 `createCheckbox()` div is a block element until `.position()` makes it
  absolute, so measuring `elt.offsetWidth` for a flow layout before the first `.position()` call
  returns the full page width and wraps every following control onto a new row. Fixed with
  `width: max-content` on the control class. Not covered by the guide.

## prediction-trust-ladder

```
Instructional Design Check:
- Bloom Level: Evaluate
- Bloom Verb: judge
- Recommended Pattern: clickable evidence hierarchy with an infobox, plus a claim-placement quiz with explanatory feedback
- Specification Alignment: modified (flowchart direction BT instead of TD; compact node labels under 600 px)
- Rationale: judging trust requires comparing a claim with explicit rung requirements; placing a
  claim and getting the reason (and the next test) builds the habit of asking "which rung?".
```

- [decision] The spec asks for `flowchart TD` with upward arrows. Mermaid 10.9.8 rejects `A <--
  B` ("Lexical error ... Unrecognized text"), and TD with `R1 --> R2` puts the bottom rung at the
  top. Used `flowchart BT` with `R1 --> R2 --> ... --> R5`, which gives the intended picture
  (Hoped for at the bottom, arrows pointing up). Mermaid pinned to exactly 10.9.8.
- [spec-gap] "One example claim from this book" per rung: the book has no claim on the top two
  rungs (the chapter says they are empty), so their infobox says so instead of inventing one.
  The six "Place this claim" claims include two marked "(Hypothetical)" so the quiz covers every
  rung: a capstone pilot from one class (Measured once) and a three-semester, group-compared,
  audited result (Replicated and audited). The Bayesian knowledge tracing claim is placed at
  Designed (the chapter says only "the lowest rungs"); picking Hoped for is reported as "one
  rung off" with the reason.
- [spec-gap] Rung colors: grey (dashed border), amber, light blue, a darker steel blue
  (#2f6690) and green (#1f7a4d), both with white text above 5:1 contrast. Colors are applied by
  CSS classes after rendering (not `classDef`) so highlight states can override them.
- [decision] Under 600 px the ladder is re-rendered with name-only nodes, because the full
  two-line nodes scaled to about 8 px text when the infobox moved below the diagram. The
  descriptions remain in the infobox.
- [decision] Rungs are keyboard-operable (tabindex, role=button, Enter/Space) and correct and
  wrong placements differ by outline style (solid black versus dashed vermillion), not color
  alone.
- [skill-gap] mermaid-guide.md does not warn that Mermaid has no one-directional reverse arrow
  (`<--`), so "TD with upward arrows" specs need BT; nor does it show the `click` directive
  (already reported by batch 05) or keyboard access for clickable nodes.

## Final status (all eight)

- Validator 100, tester PASS, no console errors at 700 px and 400 px (HTTP), no horizontal
  overflow at 400 px, for all eight sims. No chapter files touched (sync reported 0 embeds).
- Layout review residue (cosmetic, not fixed): at 700-800 px, pii-surface-explorer,
  roadmap-status-board and guess-resistance-lab have 80-150 px of empty aliceblue in one column,
  because their fixed height is sized for the 400 px stacked layout. portfolio-rubric-self-check
  slider rows are about 18 px tall at 400 px.
- accessibility-check-walkthrough: controls use 13 px text under 440 px so the first control row
  fits at 400 px (otherwise a fourth control row squeezed the checklist).
