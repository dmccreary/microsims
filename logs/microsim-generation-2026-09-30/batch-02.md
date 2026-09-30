# Gap notes: batch 02

Sims: canvas-height-calculator, microsim-directory-audit, objectives-graph-neighborhood,
objective-rewriter-workbench, bloom-level-ladder, bloom-objective-sorter,
bloom-to-pattern-matrix, cognitive-load-balance-lab.

## Batch-wide notes (apply to every sim below)

- [skill-gap] `test-iframe-heights.py` (TESTER) crashes on this machine: it calls
  `p.chromium.launch()` with no fallback, and Playwright's bundled
  `chromium_headless_shell-1243` is not installed. `bk-capture-screenshot` already falls back
  to `channel="chrome"`; the tester does not. I ran the tester unchanged through a scratch
  wrapper (`scratchpad/b02/run-tester.py`) that retries `launch()` with `channel='chrome'` only
  when the executable is missing. Suggest adding the same fallback to the tester.
- [skill-gap] TESTER loads `main.html` as `file://`, so any sim that `fetch()`es a data file
  (html-table guide's `data.json`, vis-network template `data.json`, concept-classifier
  `loadJSON('data.json')`) renders empty under the tester, while `bk-capture-screenshot`
  serves over http. The guides recommend external `data.json`, the tester cannot load it. I
  embedded data in the `.js` files (with a fetch + embedded fallback for the one sim whose spec
  requires loading `learning-graph.json`).
- [skill-gap] p5 version conflict: `p5-guide.md` says the default is p5.js 2.3.2 (and its
  own "HTML Structure (REQUIRED)" section still shows cdnjs p5 1.7.0 with `padding: 20px` and an
  `<h1>` inside `<main>`, which contradicts the iframe rules a few sections earlier); the
  concept-classifier template uses p5 2.3.2 with `async setup()`/`await loadJSON`; the scaffold
  pins p5 1.11.10. Per the brief I kept 1.11.10 and wrote 1.x-compatible code (no async setup).
- [skill-gap] `assets/templates/p5/bouncing-ball.js` declares `// CANVAS_HEIGHT = 430` (equals
  sign) while SKILL.md Step 4.4 requires `// CANVAS_HEIGHT: <int>`; copying the template
  verbatim would give sync-iframe-heights.py nothing to parse.
- [skill-gap] metadata layout: the scaffold writes a flat `metadata.json`, which Chapter 2 of
  this very book calls the older layout (the current schema nests everything under
  `microsim.dublinCore/educational/technical/userInterface`). `validate-sims.py` scores the nested
  layout wrongly: in its `"microsim"` branch it looks for `educational`/`pedagogical` inside
  `dublinCore` instead of beside it, so a schema-correct file loses 10 points. I kept the flat
  scaffold layout (enriched with userInterface/simulation/pedagogical and a top-level
  `canvasHeight`) so the validator and sync tool read it.
- [skill-gap] The generator's shared "Quality Checklist" forbids `textFont()` unless required;
  sims that show code or file text need a monospace font. I used `textFont('monospace')` only
  for code panes (microsim-directory-audit) and noted it there.

## canvas-height-calculator

```
Instructional Design Check:
- Bloom Level: Apply
- Bloom Verb: calculate
- Recommended Pattern: parameter sliders + calculator readout with a predict-then-check prompt
- Specification Alignment: aligned (two small control-range changes, see [decision])
- Rationale: an Apply/calculate objective needs the learner to set new inputs and produce a
  number; the readout and the red clipping picture give immediate feedback on that number,
  and "Set iframe correctly" is the check step.
```

- [spec-gap] The spec's iframe slider (200-900, step 2) cannot represent the calculated value
  in two cases the spec's own ranges allow: sums above 898 (max is 700+150+250+2 = 1102) and odd
  totals (controlHeight moves in steps of 5, so e.g. 480+55+0+2 = 537). "Set iframe correctly"
  could not snap exactly.
- [decision] iframe-height slider runs 200-1110 in steps of 1 so the snap button always lands on
  CANVAS_HEIGHT + 2. Everything else matches the spec's ranges and defaults.
- [spec-gap] Checkbox "Show H-Bridge numbers" behaviour on uncheck and after a slider move was
  unspecified. Chose: checking loads 480/50/0/532; moving any slider away from those values
  unchecks it; unchecking does nothing else.
- [spec-gap] Colors for the graph region, the scale of the pictures and what "fits" message to
  show when the iframe is taller were not given. Chose lemonchiffon for graph, one shared scale
  (picture height 206 px for max(needed, iframe)) so the two pictures are comparable, and a
  third state "fits, with N px of blank space".
- [spec-gap] Canvas height not given. drawHeight 480 + controlHeight 180 (1 button row + 4
  slider rows) = CANVAS_HEIGHT 660, iframe 662.
- [decision] Added a grey "Practice: ... work out the new iframe height yourself, then press Set
  iframe correctly" prompt in the readout panel (drawn only when there is room) because the
  readout otherwise always shows the answer, which weakens an Apply objective.
- Layout review: 1 cycle; readout/caption overlap and left-label collisions at narrow widths
  fixed before the final capture; final screenshot clean.

## microsim-directory-audit

```
Instructional Design Check:
- Bloom Level: Evaluate
- Bloom Verb: critique
- Recommended Pattern: rubric-rating activity with explanatory feedback (flag, rate, check)
- Specification Alignment: aligned (per-flag severity uses one shared dropdown, see [decision])
- Rationale: critique needs criteria; the four-level severity rubric supplies them, and the
  checker gives feedback on the reasons (one-sentence consequence per defect), not just hits.
```

- [spec-gap] The spec lists seven defect types but no sample content. I wrote three directories
  (Pendulum-Period 4 defects, ohms-law-explorer 3, wave-interference 4) covering all seven types,
  plus plausible correct distractor lines (pinned p5@1.11.10, iframe = constant + 2, etc.).
- [spec-gap] No severity rubric was given ("compares the rating to the rubric"). I wrote one:
  cosmetic = untidy but works; discovery = search/gallery/previews can't find or show it;
  display = runs but shows the wrong thing or hides part of itself; breaks embedding = the
  iframe/link fails. Assignments: uppercase folder = breaks embedding; unpinned or floating
  version = display; iframe too short / constant too small = display; iframe too tall /
  constant too big = cosmetic; missing schema tag, missing PNG, Dublin Core in front matter =
  discovery. None of the seven listed defect types is naturally "cosmetic", so I used the
  too-tall variants to make that rating meaningful.
- [spec-gap] "Click a line to flag it" cannot flag something that is absent (missing schema tag,
  missing preview image). Decision: the learner flags the line where it belongs (the head block)
  or the line that points to it (front-matter image lines); each defect accepts a small set of
  anchor lines.
- [decision] "A Severity dropdown on each flag" is implemented as one p5 `createSelect` in the
  control region that edits the active (orange-outlined) flag; every flag stores and displays its
  own rating at the right end of its line. Per-line DOM selects inside a canvas viewer would
  break the control-region convention and the wrap/scroll layout.
- [decision] The viewer scrolls with the mouse wheel / arrow keys only when its content
  overflows (narrow widths and the report), and `mouseWheel` returns false only in that case,
  so page scrolling is not hijacked otherwise.
- [decision] Code text uses `textFont('monospace')` at 13 px (below the 16 px guideline) so that
  HTML lines fit; everything else is sans-serif 14-20 px.
- [spec-gap] Scoring details unspecified: duplicate flags on one defect count once and are not
  false alarms; an unrated flag counts as a wrong rating; ratings accuracy is out of defects
  found. The number of planted defects is shown only after checking.
- Layout review: 2 cycles at 400 px (score line overflow, report wording) fixed; final 800 px
  screenshot clean. The default view (directory listing) leaves the viewer mostly empty in the
  preview image; left as is because the audit logically starts from the listing.

## objectives-graph-neighborhood

```
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: differentiate
- Recommended Pattern: network explorer with highlight + self-check quiz (Check me)
- Specification Alignment: modified (layout/label deviations below)
- Rationale: differentiating prerequisites from dependents needs the structure visible and
  colour-coded by relationship; Check me turns exploration into evidence with feedback.
```

- [spec-gap] "Definition" per concept: `learning-graph.json` stores only id/label/group/cis and
  `docs/glossary.md` belongs to an older book (242 terms, few of these concepts). I wrote 57
  one-sentence definitions from the Chapter 3 text; the 27 other-chapter definitions are my own
  provisional wording and should be checked against those chapters when they are final.
- [spec-gap] The spec's "direct prerequisites and dependents" neighborhood is 57 concepts; with
  edges among the outside concepts included, the longest prerequisite chain is 11 columns
  (Learning Object -> ... -> Type Routing -> Objective-to-Type Mapping -> Interactive-by-Default
  Policy). At the spec's 2/3-width network (about 520 px in an 800 px column) 11 labelled
  columns are illegible.
- [decision] Only edges that touch an OBJ concept are shown (69 edges); edges between two
  outside concepts are dropped, which brings the layout to 9 columns. The panel notes that
  outside concepts show only their links to this chapter.
- [decision] The 27 outside dependents are drawn as unlabeled gray dots (name on hover and in
  the panel lists); the 26 OBJ concepts and the 4 outside prerequisites are labeled. Labels at
  16 graph units render at about 12 px after fit.
- [decision] "Stored left-to-right layout": OBJ/foundation nodes hand-placed on columns
  (prerequisites always left); outside dots placed by a small greedy script that avoids label
  boxes (script kept in scratchpad/b02/layout.py, output baked into STORED_POSITIONS). Nodes that
  appear in a future graph without a stored position get a computed fallback position.
- [decision] Data is fetched from `../../learning-graph/learning-graph.json` at load, as the
  spec asks, with an embedded snapshot fallback; the header shows which source is in use. The
  fetch fails under file:// (TESTER) and succeeds over http (screenshot, mkdocs).
- [decision] Starts with Learning Objective selected so the green/orange highlight is visible
  in the preview and before any click (progressive disclosure); clicking empty space clears it.
- [spec-gap] Check me scoring unspecified: an attempt counts as correct only if the picks equal
  the prerequisite set exactly; wrong picks turn pink, correct prerequisites green; target
  concept drawn at least 12 px so small-score targets are visible.
- [skill-gap] vis-network guide's template loads the unpinned `unpkg.com/vis-network/...` in its
  main.html sample, contradicting the pinned-version rule; the scaffold pins 9.1.9 on jsDelivr,
  which I kept, and added the matching pinned CSS for the navigation-button icons (guide
  pitfall #2).
- [skill-gap] vis-network guide says navigation buttons are mandatory; at 400 px they cover a
  large part of a 300 px-tall network. Kept them (guide rule), noted as residue.
- Layout review: 5 render cycles during development (label collisions, legend wrap, nav-button
  overlap, narrow toolbar). Residue: labels are about 12 px (at the checklist floor); a few
  labels sit close to edges in the dense middle columns.

## objective-rewriter-workbench

```
Instructional Design Check:
- Bloom Level: Apply
- Bloom Verb: use
- Recommended Pattern: practice problems in a slot editor with a checker and a model answer
- Specification Alignment: aligned
- Rationale: "use the checklist" is procedure application; each weak objective is a new case,
  the slots make the checklist visible, and Check gives part-by-part feedback plus a model.
```

- [spec-gap] Only three of the eight weak objectives were given. I wrote five more (cognitive
  load, Bloom's Taxonomy, iframe heights, interaction patterns, quality tools), each with an
  actor, a weak verb, a vague concept, a model repair and an acceptable-verb list. Model repairs
  deliberately use learning-graph labels (MicroSim Directory, xAPI Statement, Iframe Height ...).
- [spec-gap] The 24 verbs were not listed. Chose 20 observable verbs from the chapter's canonical
  table (3-4 per level, plus "predict" for Apply from the bounciness table) and 4 unobservable
  ones (understand, know, appreciate, be aware of) labeled "(not observable)".
- [spec-gap] Concept "matches a concept label" is ambiguous (exact vs substring). Chose: exact
  match (case-insensitive, leading article ignored) for any label, or containment of a
  multi-word label; single-word labels such as "Concept" or "Verb" only match exactly, so "the
  concept of gravity" stays amber. Added an HTML datalist of all 462 labels for suggestions.
- [spec-gap] Condition and standard pick-list contents and the scoring rule were unspecified. Four
  generic conditions and four standards; score out of 5 (actor, observable verb, graph concept,
  condition, standard), plus a note when the verb is observable but differs from the model's
  level.
- [spec-gap] Some weak verbs in the data ("learn about", "be familiar with", "know how to use")
  are not in the dropdown; they are treated as unobservable in the initial state.
- [decision] Pick-lists open as a p5 `createSelect` in a fourth control row (hidden until a button
  is pressed) rather than a popup inside the drawing region.
- Layout review: 2 cycles at 400 px (comparison panels overflowed, feedback overlapped title)
  fixed with measured text heights; final 800 px screenshot clean. Residue: at 800 px the two
  comparison panels have unused space because the fixed height is sized for the 400 px stack.

## bloom-level-ladder

```
Instructional Design Check:
- Bloom Level: Understand
- Bloom Verb: summarize
- Recommended Pattern: concrete data visibility (click-to-reveal infographic) + self-check quiz
- Specification Alignment: aligned (no animation requested; none added)
- Rationale: summarizing needs every level's definition, verbs, example outcome and pattern
  visible and comparable; the quiz and compare mode give low-stakes checks without animation.
```

- [spec-gap] "One example interaction pattern" and "one example outcome" per level were not
  given. Patterns come from the chapter's appropriate-patterns table; outcomes are verbatim
  course-description outcomes (for Understand I used "Describe how a learning objective's Bloom
  level guides the choice of interaction pattern" instead of the chapter table's example because
  it ties the level to patterns).
- [spec-gap] How "Compare two levels" is entered was unspecified. Implemented as a third control
  (checkbox "Compare two levels"); clicking a third bar replaces the oldest selection. Only
  Understand/Analyze share verbs in the canonical list (compare, contrast), and the panel says so
  when there is no overlap.
- [spec-gap] Quiz rules unspecified: verbs are drawn from the 46 unique canonical verbs; for a
  verb listed at two levels either level counts as correct and the feedback explains the overlap.
- [decision] Details panel is a real DOM div (`createDiv`, aria-live) as the spec says, positioned
  over the right of the drawing region (below the ladder under 600 px) so screen readers can read
  it; the ladder, hover tooltip and quiz marks are canvas-drawn.
- [decision] Starts with Analyze selected so the panel shows real content before any click.
- Layout review: 1 cycle (panel text overflow at 800 px fixed by 14 px panel font); final
  screenshot clean.

## bloom-objective-sorter

```
Instructional Design Check:
- Bloom Level: Apply
- Bloom Verb: demonstrate
- Recommended Pattern: sorting practice with explanatory feedback + optional step-through of the procedure
- Specification Alignment: aligned
- Rationale: demonstrating a procedure needs repeated new cases (24 real outcomes) with feedback
  on the reason, and a scaffold (step-through) that can be removed for independent practice.
```

- [spec-gap] The course description has 35 outcomes (6 per level, 5 for Create); the spec asks
  for 4 per level but not which. I chose 24 verbatim outcomes, including the chapter's worked
  examples and verb-misleading cases ("Describe ..." is Understand though "describe" is a
  Remember verb; "State ..." has no table verb).
- [spec-gap] Only one ambiguous outcome was named. I flagged four, each with an adjacent
  alternative level: Distinguish claims (Evaluate, alt Analyze), Contrast Compact vs Full
  (Analyze, alt Understand), Compare candidate types (Analyze, alt Evaluate), Run the tools and
  correct defects (Apply, alt Analyze). "Neighboring level" was read as the adjacent level.
- [spec-gap] The "two written reasons" and their scoring were unspecified. Each ambiguous card has
  one reason arguing for the official level and one for the alternative; a neighbor placement is
  "defensible" only when the chosen reason supports it, otherwise it is "missed". An official
  placement is always correct; the feedback notes which level the chosen reason argues for.
- [spec-gap] How the step-through advances was unspecified (no "Next step" control listed).
  Decision: clicking the procedure panel reveals the next step; step hints are card-specific
  (levels the verb suggests; what the learner must do) and never state the answer.
- [decision] Reason choices are drawn as clickable boxes in the drawing region (answer options,
  like the concept-classifier template) rather than DOM buttons; "Next card" stays disabled until
  the card is placed (and a reason chosen for ambiguous cards).
- [skill-gap] concept-classifier-guide.md (which this spec points to) describes a 4-option
  multiple-choice quiz with a mascot and `data.json`, not drag-and-drop bins; there is no
  drag-and-drop pattern anywhere in the guides, so the drag code is custom.
- Layout review: 1 cycle (bold verb overlapping the next word; result marks overlapping bin
  labels at 400 px) fixed; final screenshot clean.

## bloom-to-pattern-matrix

```
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: differentiate
- Recommended Pattern: comparison matrix with detail panel + diagnostic quiz (Mismatch detective)
- Specification Alignment: aligned
- Rationale: differentiating needs every level's fitting and failing patterns side by side with
  reasons; the detective mode hides the colours so the learner must do the differentiation.
```

- [skill-gap] Routing: the spec's library "Custom HTML table with JavaScript" routed to
  `references/html-table.md` as instructed, but `generate-sim-scaffold.py` scaffolded this sim's
  `main.html` with the p5.js 1.11.10 CDN tag and an empty `<main>` (it treats any unknown library
  as p5). I replaced it with a no-library HTML page (kept schema meta and `<main>`).
- [skill-gap] html-table.md prescribes `script.js` + `data.json` + a Google Fonts (Inter) link and a
  sliding overlay panel with `height: 100vh`. I used `<sim-id>.js` (needed for the CANVAS_HEIGHT
  comment and sync tool), embedded the JSON array in the script (TESTER uses file://), no web
  font, and an in-layout detail panel because a 100vh overlay would cover the grid inside a
  fixed-height iframe. The guide also has no CANVAS_HEIGHT guidance for this layout.
- [spec-gap] Chip contents came from the chapter's table (3 good + 1 bad per level at most);
  the spec gave no explanation text, sketches, example MicroSims or detective cases. I wrote 23
  explanations/reasons, 23 small inline SVG sketches, 12 example chips pointing to planned sims
  of the right Bloom level from docs/sims/TODO (links go to ../<sim-id>/ and will 404 until those
  sims are built), and 7 detective cases.
- [spec-gap] Mismatch detective would be trivial if the chips kept their green/red colours and
  columns. Decision: in detective mode the colours are neutral and each row's good and bad chips
  are merged alphabetically into one cell; "Show answers" restores them (a revealed answer counts
  as an attempt). "Mismatch detective" becomes "Next case" while the mode is on.
- [spec-gap] Height not given: 640 px so that all six rows fit without internal scrolling at
  700 px and wider; under 600 px the rows become six stacked cards in a 330 px scroll area with
  the detail panel below (as specified).
- Layout review: 2 cycles (rows 5-6 below the fold; detective-mode header mismatch) fixed;
  final screenshot clean.

## cognitive-load-balance-lab

```
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: differentiate
- Recommended Pattern: comparison tool (feature toggles + gauge) with a predict-then-toggle routine
- Specification Alignment: aligned (mock drawn statically, no animation)
- Rationale: differentiating load types needs each feature's effect isolated and attributed to a
  segment; toggling one feature at a time and reading the breakdown list does exactly that.
  A moving ball would add the very extraneous load the lab is about, so the mock is static.
```

- [spec-gap] "Fixed illustrative weights" were not given. Chose capacity 100; intrinsic by
  variables 10/22/36/52/70/90 (super-linear, since variables interact); particle trail +18,
  sound +12, distant instructions +15 (extraneous); prediction prompt +12, one-sentence
  explanation +10 (germane). Weights are listed in metadata.json.
- [spec-gap] Designer A/B presets are described only in prose ("two sliders ... start button";
  "twelve sliders ... particle trail ... instructions in a paragraph beside the canvas"). Chose
  A = 2 variables + prediction prompt (under capacity, total 34); B = 6 variables (the slider max;
  the chapter says twelve) + particle trail + distant instructions (total 123). Adding the
  prediction prompt to A is my choice, so A shows some germane load.
- [spec-gap] What "the bar turns amber" means was open. Chose an amber frame and track, an
  amber "Load gauge: over capacity" heading and message; segment colours are kept so the three
  loads stay distinguishable. When over capacity with no extraneous load, the message suggests
  managing intrinsic load instead of naming a contributor.
- [decision] Checkboxes are listed without group labels (and in an order that packs into rows)
  so the controls do not give away which load each feature adds; the learner discovers it from
  the gauge. Checkbox divs are set to `display:inline-block` because p5's checkbox wrapper is a
  full-width block, which made `offsetWidth`-based row flow put every checkbox on its own row
  and push the buttons past the canvas bottom (found in the first render).
- [spec-gap] At 400 px the five long spec labels need 4 rows plus slider and button rows, so
  controlHeight is 215; at 800 px about 90 px of the control region is unused.
- Layout review: 2 cycles (buttons clipped at 400 px; amber overlay muddied segment colours)
  fixed. Residue: mock-MicroSim labels are 11 px (intentional miniature), spare space in the
  control region at wide widths.

## Batch summary

All 8 sims: validator 100, TESTER PASS (via the Chrome-fallback wrapper), screenshot captured,
no JS errors over http. Under file:// the vis-network sim logs the expected CORS error for the
learning-graph fetch and falls back to its embedded snapshot. `sync-iframe-heights.py` updated
0 chapter embeds because the chapters do not embed these sims yet (central Step 5 will add them;
heights to use: 662, 562, 604, 597, 522, 562, 642, 627).
