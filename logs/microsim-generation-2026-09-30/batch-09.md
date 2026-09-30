# Batch 09 gap notes

Sims: batch-generation-pipeline-stepper, sim-status-rule-explorer, nav-status-icon-legend,
metadata-section-explorer, faceted-filter-lab, reuse-threshold-explorer,
xapi-statement-field-explorer, activity-iri-builder.

Helpers (scratchpad, not in the project): `b09/check.py` (copy of b01_console.py: HTTP server +
Playwright/Chrome, console errors, scripted clicks and screenshots), `b09/meta.py` (writes the
flat metadata.json layout the validator scores, same shape as batch 01).

## Batch-wide findings

- [decision] Used `describe(text)` (FALLBACK) instead of the template's `describe(text, LABEL)`,
  so no visible label div is appended under the canvas (batch 06 already reported why).
- [decision] Kept the scaffold's p5@1.11.10 and vis-network@9.1.9 pins.

## batch-generation-pipeline-stepper

```
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: differentiate
- Recommended Pattern: step-through process explorer (Previous/Next + click) with actor color
  coding plus a text tag, and a detail panel that traces each input to the step that wrote it
- Specification Alignment: aligned
- Rationale: differentiating actors and tracing data flow needs every step's concrete inputs and
  outputs visible and comparable one at a time; no animation is needed.
```

- [spec-gap] The spec gives the eight step names only through the chapter list; the per-step
  utility names, reads and writes had to be assembled from the skill (Steps 1-9) and the chapter.
  Chose: step 6 = validate-sims.py + sync-iframe-heights.py + test-iframe-heights.py (reads
  main.html, index.md, metadata.json, .js, chapter index.md; writes index.md and chapter
  index.md); step 8 = bk-capture-screenshot (reads main.html + .js, writes <sim-id>.png).
- [spec-gap] Step 8 is mixed in reality: the screenshot is a shell script but the layout review
  is an agent-with-vision pass. The spec colors only step 4 orange, so step 8 is blue with a
  sentence saying the Chapter 13 review follows. Step 1's status derivation also reads
  docs/sims/ on re-runs; stated in the sentence, not drawn as an input.
- [spec-gap] "Show files toggles arrows" did not say which arrows. Chose: for the selected step
  only, green arcs from the steps that produced its inputs and purple arcs to the later steps
  that read its outputs (a file's producer = the latest earlier step that wrote it, so step 7
  reads index.md "from step 6", not step 2). Arc labels appear only in the wide layout.
- [spec-gap] Actor of the checkpoint (step 3) is not stated; the skill says the agent completes
  it. Labeled "Checkpoint - no script: a judgment recorded before coding", writes no file.
- [spec-gap] Canvas height not given. The 2-row layout below 600 px needs ~590 px of drawing
  region for step 6 (5 inputs); CANVAS_HEIGHT 640. The wide layout has spare room, used for a
  one-line summary of the division of labor.
- [decision] Added an italic actor tag (script / agent / checkpoint) inside every box so color
  is not the only cue, and left/right arrow keys as a keyboard alternative.
- Layout review: 2 cycles (first pass clipped two-line box labels at 400 px and let narrow-mode
  arcs cross row 2; fixed with a layout table per mode and same-row arcs above row 1 / below
  row 2). Final: clean; some unused white space inside the wide-layout panel.

## sim-status-rule-explorer

```
Instructional Design Check:
- Bloom Level: Apply
- Bloom Verb: predict
- Recommended Pattern: parameter controls + predict-then-reveal gate, with an ordered rule trace
  that marks the deciding rule
- Specification Alignment: modified (layout only; see decision)
- Rationale: predicting a rule-based outcome needs the inputs under the learner's control, the
  answer hidden until they commit, and the rule that fired shown afterwards.
```

- [decision] The spec puts "a control region on the left half" of the drawing. That conflicts
  with its own implementation line (controls positioned relative to drawHeight) and the p5
  standard (no controls in the drawing region). Controls are in the control region; the left
  half of the drawing holds a "What is on disk" file listing that mirrors them, the right half
  a "Rules, checked in order" trace. The strip spans the full width (five boxes in a row, the
  dashed reused box below), and wraps 3+2 below 600 px; the two panels stack below 600 px.
- [spec-gap] How the learner "chooses one of the six statuses" was not specified. Chose both a
  select next to the button and clicking a box in the strip. The button reads "Cancel" while a
  prediction is pending; changing a control after the reveal returns to live mode. Added a
  "Predictions: N of M correct" tally.
- [spec-gap] Impossible file states (main.html without its directory) were not addressed.
  Chose: checking main.html also checks the directory; unchecking the directory unchecks
  main.html. Line count and score stay settable at any time, as the script reads them
  independently.
- [spec-gap] The spec says "becoming implemented above 50 lines"; the chapter table says "more
  than 50". Verified against extract-sim-specs.py (`len(lines) > 50`, `score >= 70`): 50 lines
  stays scaffolded, a score of exactly 70 validates. The explanation says so at 50.
- [spec-gap] No sim name was given for the file listing; used the chapter's worked example
  `bouncing-ball-gravity-lab`.
- [skill-gap] At 400 px the "Spec says Status: Reused" checkbox label wrapped onto a second
  line; p5 checkbox labels inherit 16 px body text and the p5 guide has no advice on sizing
  DOM control labels for narrow widths. Fixed by setting 14 px below 480 px.
- Layout review: 2 cycles (narrow: explanation box overflowed and a checkbox label wrapped;
  fixed with a measured explanation height, drawHeight 530, 14 px labels). Final: clean.

## nav-status-icon-legend

```
Instructional Design Check:
- Bloom Level: Understand
- Bloom Verb: match
- Recommended Pattern: labeled legend with click-for-detail, then a matching quiz with
  immediate feedback (labels hidden, icons shuffled)
- Specification Alignment: aligned
- Rationale: matching symbols to meanings is supported by seeing each pairing once with
  concrete data (color, hex, shape, tooltip, lifecycle state) and then retrieving it unaided.
```

- [spec-gap] "Tooltip text exactly as it would appear in the nav" - the spec gives only
  summaries. Copied the exact strings from `~/projects/learning-record-store/mkdocs.yml`
  (`extra.status`) and the hex colors from its `docs/css/extra.css` (the instrumented tooltip
  also says "add ?xapi=teaching to the URL to see them").
- [spec-gap] The five sample MicroSim titles and their statuses were not given. Used five
  titles from this book with one status each, labeled "sample nav"; statuses are illustrative.
- [spec-gap] The spec's "related lifecycle state" mapping is only a proposal in the chapter
  (validated -> built or approved "depending on score"; who sets approved is undecided). The
  panel says "proposed mapping" for built and approved, and "not a batch state; set by
  sync-status.py --apply" for instrumented.
- [spec-gap] "Confirm the colors stay readable" had no criterion. Added a computed WCAG
  contrast ratio of the icon color against the current sidebar background with the 3:1
  non-text guideline. The dark background is an approximation of Material's slate scheme
  (rgb 30,33,41), not a value copied from Material's CSS.
- [spec-gap] Quiz length and prompts unspecified. Chose one question per status (5), each
  randomly asking by meaning or by lifecycle state; icons are shuffled among the titles and
  tooltips are disabled during the quiz so hovering cannot give the answer away.
- [decision] With nothing selected, the detail panel shows the full legend (icon, name,
  meaning), so the default view already teaches the mapping.
- Layout review: 2 cycles (narrow detail panel overflowed; switched to inline "Label: text"
  paragraphs and drawHeight 500; legend meanings wrapped instead of truncated). Final: clean.

## metadata-section-explorer

```
Instructional Design Check:
- Bloom Level: Understand
- Bloom Verb: classify
- Recommended Pattern: expandable network explorer with a detail panel (real field values),
  then a classify-by-clicking quiz with immediate feedback
- Specification Alignment: aligned (layout conflict resolved, see spec-gap)
- Rationale: classifying fields needs the real file's structure visible section by section,
  with required/optional marked, before the learner is asked to place fields unaided.
```

- [spec-gap] Conflicting infobox position: "infobox at the right" (interactions) vs "network
  canvas 700 x 450 with an infobox region below it" (layout) vs "moves below the canvas at
  widths under 500 px" (responsive). Chose: infobox to the right (36% width) at 500 px and
  wider, below the network under 500 px; toolbar 44 px + stage 454 px + border = 500
  (CANVAS_HEIGHT 500; stored in the .js comment).
- [spec-gap] "The H-Bridge metadata file" exists in two versions: ~/projects/stem-robots (the
  nested file Chapter 15 quotes) and this repo's docs/sims/h-bridge/metadata.json (an older
  flat file with invented values such as visualizationType "map"). Used the STEM Robots file,
  copied unchanged as data.json. Also copied the schema unchanged as microsim-schema.json,
  because src/ is not published by MkDocs and cannot be fetched at runtime. Both copies can
  drift from their sources; nothing re-syncs them.
- [spec-gap] The H-Bridge file has none of the optional sections, and many schema fields
  (duration, canvasDimensions, controls, misconceptions, deviceRequirements...) have no
  "description" for the hover tooltip. Chose: optional sections expand into their schema fields
  with "not present in the file"; missing descriptions read "The schema gives no description;
  it defines an object with ..." built from the schema's sub-properties.
- [spec-gap] Field layout on expansion unspecified, and physics is off after the first
  stabilization, so new nodes need computed positions. Chose one open section at a time,
  fields fanned over up to ~150 degrees away from the root on 1-3 alternating rings, then the
  view fits the section.
- [spec-gap] "Hide the section labels on field nodes" in the quiz: field nodes carry only the
  field name, so the quiz instead collapses everything and shows one neutral yellow field node
  with no edge; clicking a section draws a green or red edge from the correct section. 8 fields
  per round, drawn at random from the 40 H-Bridge fields in required sections.
- [spec-gap] "Node labels never fall below 12 px": vis-network scales fonts with zoom. Used
  17-18 px fonts and clamp the zoom to at least 0.72 after every fit.
- [skill-gap] vis-network-guide.md's main.html template loads `https://unpkg.com/vis-network/...`
  with no version (unpinned), while the scaffold pins vis-network@9.1.9 on jsDelivr. Kept the
  pin. The guide's template also has no schema meta tag and no `<main>` element, both of which
  the validator scores; its layout (full-height network with overlay panels) does not cover a
  side infobox or an HTML toolbar.
- [skill-gap] Data-driven vis sims (fetch of data.json) render only a "could not load" panel
  under file://, which is what test-iframe-heights.py loads, so its PASS only proves the HTML
  toolbar fits. Verified over HTTP separately (no console errors, expand/field/quiz clicks).
- Layout review: 2 cycles (first fan layout wrapped fields around past other sections; switched
  to capped fan + 3 rings; nav buttons scaled to 75% under 500 px). Residue: at 400 px an
  expanded 9-12 field section is larger than the 262 px network, so the lowest fields sit
  under the navigation buttons until the learner pans.

## faceted-filter-lab

```
Instructional Design Check:
- Bloom Level: Apply
- Bloom Verb: use (and predict)
- Recommended Pattern: hands-on faceted filter over real data with live counts, plus a
  predict-then-check gate that hides all counts until a number is committed
- Specification Alignment: aligned (layout proportions adjusted, see decision)
- Rationale: using facets is learned by doing it on a real, messy catalog; predicting OR-vs-AND
  counts before seeing them turns the toggle into a test of the rule, not a guess-and-look.
```

- [spec-gap] "Drawn at build time" had no procedure. Chose Python `random.sample` with seed
  2026 over the 3,764-record file on 2026-09-30; fields copied unchanged (plus `description`,
  which the spec's field list omits but its tooltip needs). Provenance is stored at the top of
  sample.json.
- [spec-gap] The raw facet values are unusable as chips (323 distinct subjects in the sample,
  14 framework spellings, 12 Bloom forms incl. lists, "Understand (L2)", "L4 (Analyze)", "TBD").
  Chose: normalize case, version suffixes and "(Ln)" labels at runtime; show the top 6
  subjects, top 5 frameworks and the six Bloom levels + TBD, each plus "(missing)". Values off
  the chips are still counted while their facet is unselected. Stated in index.md.
- [spec-gap] Chip-count semantics unspecified. Used ItemsJS-style counts: in OR mode, records
  matching the other facets that carry the value; in AND mode, records matching every facet
  (this one included) that carry it. Gray/unselectable when that count is 0 and the chip is
  not selected.
- [spec-gap] "Predict first ... types or selects an expected count": chose a number input that
  appears next to the button; counts, bar and list are hidden and chip clicks are refused until
  a number is typed; the next chip click or OR/AND flip reveals prediction, actual, previous
  count and difference.
- [decision] "Left third" for three chip columns was too narrow for real value names (e.g.
  "high school geometry 63"). Facets are stacked in the left 45% at >= 500 px and full width
  below 500 px, with the results panel under them, as the responsive rule asks.
- [decision] "Scrolling list of up to 12 titles": no wheel scrolling (it would capture page
  scroll inside the iframe); the list shows up to 12 titles alphabetically (fewer at 400 px)
  and "... and N more".
- [skill-gap] p5 guide has no pattern for canvas keyboard focus (tabindex, Tab trapping, focus
  ring) although this spec requires Tab/Space; implemented with a keydown listener on the
  canvas that lets Tab leave after the last chip.
- Layout review: 2 cycles (400 px list showed one title; chips shrunk to 22 px, drawHeight
  570). Final: clean; spare space under the facets at wide widths.

## reuse-threshold-explorer

```
Instructional Design Check:
- Bloom Level: Evaluate
- Bloom Verb: judge (and justify)
- Recommended Pattern: decision-rule explorer: two threshold sliders over documented evidence,
  a live error readout (missed reuse / false reuse) and the author's stated rationale
- Specification Alignment: aligned
- Rationale: judging a threshold needs the evidence, the consequence of each setting in named
  error types, and the cost argument side by side; the learner then defends a choice.
```

- [spec-gap] The spec says the readout should cover "misclassified" parts but not how to name
  them. Chose four error names: missed reuse (same concept below reuse), false reuse (related
  or absent at/above reuse), missed template (related below template), false template (absent
  at/above template), plus a headline "Missed reuse / False reuse" pair, which is the tradeoff
  the objective asks learners to justify.
- [spec-gap] Band boundary rules at equality were not stated. Used the README's wording:
  reuse if score >= reuse threshold, template if >= template threshold, else generate (so
  the 0.730 probe is reuse at a 0.73 threshold). Ranges are treated as continuous closed
  intervals; sentences say "from 0.73 to just under 0.75".
- [spec-gap] "Justify why a conservative threshold..." needs the author's reason, which is NOT
  in the README (the spec restricts data to the README). The reason is a comment in
  find-similar-templates.py ("a false-positive reuse ... costs more than regenerating"); it is
  shown as "Author's rationale (tool source)". The chapter paraphrases the same point.
- [spec-gap] How to keep reuse >= template was not specified. Chose: the slider being moved is
  clamped to the other one, with a 4-second note.
- [spec-gap] Default of the "Show misclassified" toggle unspecified; chose on, so the first view
  already shows that the Coulomb probe is sent to template at the defaults. Also note: at the
  defaults, the documented related range 0.53-0.59 falls in generate (a missed template) - a
  real consequence of the README's own numbers.
- [decision] Threshold labels sit above the shaded area (template label extends left of its
  line, reuse label right), so they never overlap each other or the range labels.
- Layout review: 3 cycles (subtitle mis-centered by p5's boxed text; threshold labels collided
  with the same-concept label; narrow readout hid the rationale; fixed and drawHeight 560).
  Final: clean; spare space in the wide readout panel.

## xapi-statement-field-explorer

```
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: differentiate
- Recommended Pattern: clickable annotated code (authentic statements) with part highlighting,
  per-line meaning, and a retrieval quiz with immediate feedback
- Specification Alignment: aligned
- Rationale: differentiating parts needs every line of a real statement visible and attributable
  to a part, then unaided retrieval ("which line says...") to check the distinction holds.
```

- [spec-gap] "Three built-in statements taken from this chapter's examples": only the answered
  statement is complete in the chapter. The slider statement omits actor, context and
  timestamp, and there is no experienced example at all. Chose: answered = the contract's
  reference statement + an `id`; interacted = the chapter's speed-slider statement with the
  omitted parts filled in (same learner, grouping, parent page, concept extension);
  experienced = a run on the same page with the required `duration` and the runtime's
  `run-ended-by` extension. The UUIDs, timestamps, run duration (PT1M25S), `run-ended-by`
  value ("pause") and concept slugs (`velocity`, `kinematics`) are invented illustrative
  values; index.md says so. Structure checked against xAPI 1.0.3 (Agent/account, verb id +
  display, Activity id/definition/type/name, result score/success/duration/extensions,
  context.contextActivities grouping/parent + extensions, ISO 8601 timestamp, UUID v4 id).
- [spec-gap] Long lines (IRIs up to ~110 characters) cannot fit two-thirds of a 700 px canvas.
  Chose: monospace 13/12 px, eliding the middle of the longest quoted string on a line
  ("https://dmccreary.gi...ok/lrs/v1.0.0"); the full line is shown in the panel on click. The
  account object is split over three lines so homePage and name are separate quiz targets.
- [spec-gap] Quiz size and targets unspecified. Wrote 7-10 prompts per statement, each keyed to
  one line; prompts do not repeat until exhausted; a "Next" button (not in the spec) advances.
  Score readout is in the panel during the quiz.
- [spec-gap] "Sliders and buttons remain visible at 400 px" although the spec has no slider.
- [skill-gap] The p5 guide says not to call textFont() unless required, but gives no pattern
  for when it is (a monospaced JSON view); used textFont('monospace') and reset to
  'sans-serif'. Also, a helper named `shorten` silently collided with p5's global `shorten()`
  (only a friendly-error console message); the guide could warn about p5 global names.
- Layout review: 3 cycles (string elision matched across quote boundaries; truncated panel
  text was drawn twice; legend line clipped at the panel edge and cut off at 400 px; fixed
  with quote-pair elision, a fit-count wrap and a two-column narrow legend, drawHeight 620).
  Final: clean.

## activity-iri-builder

```
Instructional Design Check:
- Bloom Level: Apply
- Bloom Verb: construct (and diagnose)
- Recommended Pattern: live builder (inputs -> segmented IRI) with click-for-rule segments,
  mistake injection, and a consequence preview (store grouping rows)
- Specification Alignment: aligned
- Rationale: constructing an identifier is practiced by assembling it from its rules; diagnosing
  errors needs each error's concrete consequence (two rows that never merge), not just a label.
```

- [spec-gap] The five sample paths were given only as examples. Chose sims/bouncing-ball/,
  chapters/01-what-is-a-microsim/, chapters/16-xapi-statements-and-evidence/,
  sims/metadata-section-explorer/, sims/nav-status-icon-legend/ (all exist in this book).
- [spec-gap] Default names for sub-activities unspecified: control "Speed Slider"
  (#speed-slider), node "Dublin Core" (#dublin-core), fixed-order question "3" (#q3),
  shuffled question "nucleus" (#q-nucleus), following the chapter's fragment table. Slugify =
  lowercase, non-alphanumerics to "-".
- [spec-gap] The spec does not say what the grouping preview contains. Chose one learner
  (student-0042) and one visit: 3 statements in one row when correct; with a mistake, 2
  statements under the runtime's correct IRI (pageIri()) and 1 under the hand-built wrong IRI,
  or, for the shuffled-position mistake, two loads landing in #q4 and #q2. Counts are
  illustrative.
- [spec-gap] Mistakes that need a particular sub-activity or loading place: choosing
  "zero-based question number" or "positional fragment" switches the sub-activity to the
  matching question kind; "uses main.html" and "local origin" switch "Loaded from" to the iframe
  payload / local preview, so the mistake reads as "copying the browser address". The correct
  IRI never depends on "Loaded from", as the spec requires. The local preview address is
  http://127.0.0.1:8000 + the path part of site_url (mkdocs serve behavior).
- [spec-gap] Object type shown for "none" is inferred from the path: sims/ -> MicroSim
  (activities/simulation), chapters/ -> Page (activities/lesson).
- [spec-gap] The spec lists createButton but no button; added "Reset" next to site_url.
- Layout review: 2 cycles (hint text overlapped the bold "Activity IRI" label because width was
  measured in the wrong font; long selects clip their text natively at 400 px). Final: clean;
  spare space in the grouping panel at wide widths.
