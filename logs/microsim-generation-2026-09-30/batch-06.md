# Batch 06 gap notes

Sims: loop-polarity-tracer, feedback-behavior-lab, diagram-readability-repair-bench,
timeline-item-date-explorer, marker-popup-tile-map, choropleth-threshold-lab,
callout-overlay-anatomy-explorer, prompt-text-rule-checker.

Helpers (scratchpad, not in the project): `b06_check.py` (HTTP server + Playwright/Chrome at
two widths, console errors, content height, scripted clicks/screenshots), `b06_meta.py`
(writes metadata.json in the flat layout the validator scores).

## Batch-wide findings

- [skill-gap] `validate-sims.py` gave the untouched generator scaffold 95/100 (grade A) before
  any `.js`, lesson plan, objective or reference existed ("TODO" text everywhere, High School
  Geometry audience). The rubric only checks that sections/fields exist, so the "score >= 85"
  gate in the definition of done is met by the scaffold itself and says nothing about the sim.
  Suggest: fail on "TODO" strings, on an index.md with no `<sim-id>.js`/data file behind the
  iframe, and on learningObjectives equal to the scaffold placeholder.
- [skill-gap] `describe(text, LABEL)` (the pattern every p5 template uses) appends a
  *visible* label `<div id="defaultCanvas0_Label">` under the canvas inside `<main>`,
  so `main` is ~70-110px taller than CANVAS_HEIGHT. It is clipped by the iframe, so harmless
  in the book, but it shows in fullscreen `main.html` under the canvas and it makes any
  "measure the content height" approach (skill Step 4.4 rule 6) over-report for p5 sims.
  The guide should say to use FALLBACK, or to measure the canvas, not `main`.
- [process] The three fetch-based sims (timeline, marker map, choropleth) PASS the TESTER only in
  their file:// error state (known issue). Their real heights were measured over HTTP with
  `b06_check.py` at 400, 600, 700 and 800 px wide; CANVAS_HEIGHT is the maximum content height
  across those widths, and narrow layouts shrink the map/timeline to stay inside it.
- [process] Leaflet sims need the network at view time (tiles; the choropleth also fetches the
  template's us-states.json). Screenshots used a 5 s delay so tiles finish loading.

## feedback-behavior-lab

```
Instructional Design Check:
- Bloom Level: Understand
- Bloom Verb: compare
- Recommended Pattern: side-by-side curves driven by sliders, with a predict-then-observe gate
  after each slider change and a faint "previous settings" ghost for comparison
- Specification Alignment: aligned (animation kept: the step-by-step growth IS the behavior
  being compared; the Predict-first gate supplies the predict-before-observe step)
- Rationale: comparing two time behaviors needs both curves on one axis plus a before/after
  reference; the caption states the concrete per-step increments (rate x value vs rate x gap)
```

- [spec-gap] "Rise faster, slower or the same" had no reference point. Chose: the rise over the
  first 10 steps (x[10] - x[0]) compared with the settings in effect before the change, with a
  2% tolerance for "same". Revealed automatically when the new run reaches step 10.
- [spec-gap] Run length, animation speed and vertical scale unspecified. Chose 50 steps, one
  step every 4 frames (~3 s per run), and a y-axis from 0 to 2 x goal so the goal line always
  sits at mid-height; the reinforcing curve is clipped at the top with an "R off chart" marker
  (a log axis would hide the very curvature learners are comparing).
- [spec-gap] Colors not given. Used the chapter's own convention (reinforcing red, balancing
  green, from the loop-type table) and added shape (circles vs squares) and letter labels
  (R, B) so color is not the only cue.
- [spec-gap] Default state of "Predict first" unspecified. Chose checked, so the first slider
  change already asks for a prediction; the first run after load is the baseline.
- [decision] Added a faint dashed "previous settings" copy of both curves (not in the spec) so
  the faster/slower/same judgment is visible, and a running "Correct so far" tally.
- [decision] Prediction buttons need two extra control rows (controlHeight 220 = 6 rows), which
  stay empty with a hint when no prediction is pending; CANVAS_HEIGHT 650. On screens under
  ~480px the in-chart panel is hidden and its text goes into the caption.
- [decision] Kept the default paused, empty chart on load (MicroSim standard), so the
  gallery screenshot shows axes, legend and goal line but only the start point.

## loop-polarity-tracer

```
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: examine
- Recommended Pattern: network explorer with a step-through trace (one link per press, running
  negative-link counter) and a commit-before-reveal classification, plus a what-if sign flip
- Specification Alignment: aligned
- Rationale: examining a loop means decomposing it link by link; the counter makes the parity
  rule concrete, and flipping signs lets the learner test the rule rather than memorize it
```

- [spec-gap] The spec names the loops "Loop A" and "Loop B"; "B" collides with the B marker
  for balancing (and Loop B *is* balancing, Loop A reinforcing), which would give the answer
  away. Named them "Learning loop" and "Goal loop".
- [spec-gap] Only one link reason is given ("More practice, more mastery") and no node
  descriptions. Wrote all five one-sentence descriptions and six reasons from the chapter's
  worked examples.
- [spec-gap] "Before the final step" read as: after two of the three links are highlighted,
  the learner must choose Reinforcing/Balancing; the answer reveals the final link and the
  full count.
- [decision] Loop markers start as grey "?" and are revealed by tracing that loop; otherwise the
  standard R/B markers show the answer the trace asks for. Flip-a-sign mode reveals both.
- [decision] "Flip a sign ... change one link's polarity": any link can be flipped (flipped
  links are dashed) with a Restore button, so learners can also see that two flips in one loop
  cancel out.
- [decision] The causal-loop JSON is embedded at the top of the .js rather than fetched: the
  guide's shared infrastructure (docs/sims/cld-viewer, cld-inline.js) does not exist in this
  project and fetch fails under the TESTER's file:// load.
- [decision] Under 600px the details panel moves below the diagram and the diagram shrinks
  (400 -> 232px) so the total height, and the fixed iframe, stays the same.
- [skill-gap] causal-loop-guide.md only covers multi-loop *articles* (cld-inline.js, cld-viewer,
  article markdown, nav) and says "do not embed diagrams as iframes", while this book's specs ask
  for a single CLD MicroSim in docs/sims/<id>/ embedded by iframe with custom interactions. There
  is no single-sim recipe (the SKILL.md routing table sends every CLD here).
- [skill-gap] The guide's renderer (`cld-inline.js`) uses edge `font.align: 'middle'`, which
  rotates the label along the edge. A red "−" rotated along a diagonal red edge merges with the
  line and disappears (it did here); `align: 'horizontal'` with a white stroke fixes it.
- [skill-gap] Version drift: `cld-inline.js` pins vis-network@10.0.1 (unpkg), the scaffold
  pins 9.1.9 (jsDelivr), vis-network-guide.md uses an unpinned unpkg URL. Kept 9.1.9.
- [skill-gap] cld-layout-templates.md coordinates (±250 world units) fit at ~0.5 scale in a
  400px-wide iframe, shrinking 16px node labels to ~8px. Tightened to ±180; the templates should
  note the target container width.

## diagram-readability-repair-bench

```
Instructional Design Check:
- Bloom Level: Evaluate
- Bloom Verb: critique
- Recommended Pattern: rubric tool - click-to-name flaw finder against a 7-item checklist with
  status lights, plus repairs whose effect (+/- standards) is reported after each one
- Specification Alignment: aligned (added an explicit effect model so "in order of effect"
  can be judged and fed back)
- Rationale: critique needs criteria (the chapter's seven standards) and feedback; making the
  repairs interact gives the learner an ordering decision to justify, not just five buttons
```

- [spec-gap] The spec lists seven standards but only five repair buttons and never says how the
  other two (Interaction, Layout) become met. Chose, from the chapter text: shortening labels
  moves detail into hover text and removes the notes overlay (Interaction); splitting relieves
  crowding (Layout).
- [spec-gap] "Applying fixes in order of effect" is not operationalized. Chose an explicit
  model: split and shorten fix two standards each; enlarging fonts while labels are still long
  makes text overflow and breaks Layout. Each repair reports "+n (standards)" and the final
  message grades the order.
- [spec-gap] "Clicking a flaw ... names the violated standard" when most elements carry several
  flaws. Each node has one designed primary flaw (pale text, very long label, red/green fill,
  or tiny text); a second click after a repair names the next remaining flaw. The notes
  overlay maps to Interaction, crossing branch arrows to Layout, empty background to Size.
- [spec-gap] Diagram content not given. Used the chapter's own subject: the 20 steps of
  building and publishing a MicroSim, with the chapter's example short labels ("Draft the
  specification", "Run automated checks").
- [spec-gap] Status-light states unspecified. Chose grey = not checked, red = violation found
  by the learner, green = met. Before/After changes both the diagram and the lights/score.
- [decision] After the split the two diagrams (8 and 12 nodes) are shown one at a time with a
  "Show part 2" button; side by side they would not fit at 16 px.
- [decision] Narrow screens (< 600 px) use hand-placed three-column layouts and a two-column
  checklist below the diagram; drawHeight grew to 540 (CANVAS_HEIGHT 655) so the 12-node part
  still fits 16 px labels at 400 px wide.
- [skill-gap] The p5 guide's fixed-x button placement (`position(80, ...)`) breaks when a
  button's label changes length at runtime (here "Enlarge fonts" -> "✓ Enlarge fonts");
  buttons overlapped. Laid rows out from `elt.offsetWidth`. The guide could show this pattern.

## timeline-item-date-explorer

```
Instructional Design Check:
- Bloom Level: Apply
- Bloom Verb: use
- Recommended Pattern: data-to-display explorer - the selected event's JSON (month and group
  highlighted) and its new Date(...) call shown beside the rendered item, plus a month edit
  field and a bug toggle as practice
- Specification Alignment: aligned
- Rationale: "use the JSON format" requires seeing the format and changing a value in it;
  showing the conversion call makes the off-by-one visible instead of magical
```

- [spec-gap] Which event the month field edits ("one event's month") was not said. Chose the
  selected event; "Midterm MicroSim lab" is pre-selected on load so the panel is never empty.
- [spec-gap] Event content, dates and group names not given beyond "fictional course schedule".
  Wrote eight events for a fictional "MicroSims 101" course (2025-2027) in three groups
  (Planning, Teaching, Assessment): two year-only, three year-and-month, three full dates.
- [spec-gap] No detail-panel layout given. Split it into two cards: formatted event and the raw
  JSON with the `month`/`group` values highlighted plus the `new Date(y, m, d)` call.
- [spec-gap] Behavior of month 12 with the bug on (rolls into January of the next year) is not
  mentioned; kept it and called it out in the caption, since it is a real consequence.
- [decision] Used the template's `className`-per-group coloring and filter buttons, not
  vis-timeline's `groups` rows, matching the chapter's description of "Timeline grouping".
- [decision] Under 600px the timeline shrinks from 300 to 180px and the detail cards stack, so
  the total height stays at CANVAS_HEIGHT 650 at 400px wide.
- [skill-gap] The standalone vis-timeline build injects its CSS at runtime, after the page's
  style.css, so the guide's un-`!important` item color rules lose to the default yellow
  `.vis-selected` background (white text on #FFF785 - unreadable). Needed `!important`.
- [skill-gap] With stacked box items, vis-timeline draws each item's connector line above other
  items' boxes, so lines strike through labels. Fixed with `.vis-item.vis-line {z-index:0}` /
  `.vis-box {z-index:1}`; worth adding to the guide's "critical CSS".
- [skill-gap] timeline-guide.md's edge-clipping fix pads the window by a fixed number of years;
  the padding needed depends on pixel width (half a label ~100 px). At 400px wide the fixed pad
  clipped the first and last labels. Used pad = h*span/(W-2h).
- [tool-bug] `validate-sims.py` pairs code fences with a regex that breaks when a non-html
  fenced block (here a ```json example in "About") precedes the embed block: it captures the
  prose between the fences and misses the iframe example (-5, "missing copy-paste iframe
  example"). Left the JSON example in place (score still >= 85).

## marker-popup-tile-map

```
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: distinguish
- Recommended Pattern: isolate-one-variable explorer - three independent controls (layer
  control, category toggle / swap, marker click) plus an info panel that names the state of
  all three layers after every change
- Specification Alignment: aligned
- Rationale: distinguishing roles means seeing that changing one layer leaves the other two
  untouched; the info panel and caption make "what changed / what did not" explicit
```

- [spec-gap] Place, markers, categories and descriptions left to the author. Chose Minneapolis,
  Minnesota (seven well-known museums and parks, coordinates rounded to 4 decimals from memory
  of their published locations) in two categories, Museum and Park.
- [spec-gap] "Recolors marker labels" implies labeled markers; the template has none. Added
  permanent Leaflet tooltips as labels, with a per-marker `labelDirection` field in data.json
  to keep neighbors from overlapping.
- [spec-gap] Which marker is swapped, and what the learner should see, not given. Swapped Mill
  City Museum: [-93.2571, 44.9789] is an impossible latitude, so Leaflet's projection clamps it
  to the bottom edge of the world map (south of Africa); the map re-fits to show both.
- [spec-gap] The info panel and the layer control both default to the top-right corner. Kept
  the info panel top right (spec) and moved the layer control to the bottom left, expanded on
  wide screens and collapsed to the layers button under 600px.
- [decision] The spec names `script.js`; the brief's convention (`<sim-id>.js` with the
  CANVAS_HEIGHT comment) was used instead. Same for the choropleth.
- [decision] Tile URLs: OpenStreetMap without the deprecated `{s}` subdomains, OpenTopoMap, and
  Esri World Imagery (note its `{z}/{y}/{x}` order), all three from map-guide.md.
- [skill-gap] map-guide.md's template puts every control in the corners but has no guidance for
  keeping markers clear of them; with an info panel top right, labels were hidden. Used
  `fitBounds` with `paddingTopLeft`/`paddingBottomRight` sized to the controls.
- [skill-gap] The map template CSS uses `font-family: ... 'Segoe UI' ...` in body, which the skill
  forbids for p5 (`textFont('Segoe UI')`); harmless as a CSS fallback but inconsistent. Not used.

## choropleth-threshold-lab

```
Instructional Design Check:
- Bloom Level: Evaluate
- Bloom Verb: judge
- Recommended Pattern: parameter sliders + presets on a choropleth, plus an explicit judgment
  prompt (revealed/hidden for each of two designed patterns) with count-based feedback
- Specification Alignment: modified (added the judgment prompt and Check feedback)
- Rationale: the skill's Bloom table marks "no feedback mechanisms" as inappropriate for
  Evaluate; the spec had sliders and readouts but no place for the learner's judgment
```

- [spec-gap] "A GeoJSON boundary file of regions" - which regions was not said. Used the map
  template's own default, the public us-states.json (PublicaMundi/MappingAPI on
  raw.githubusercontent.com, CORS-enabled), fetched at load as the chapter describes. I could
  not vendor it locally without downloading a file (needs user approval), so the map needs the
  network, like its tiles. Suggest vendoring a copy into the sim folder.
- [spec-gap] The placeholder data had to contain patterns to judge, but none were specified.
  Designed two: a south-north gradient (values from latitude, 10-70) and a seven-state Great
  Lakes cluster (77-86) rising west to east. Each preset reveals one and hides the other.
- [spec-gap] "Cluster near 80" preset values not given. Chose 76, 79, 82, 85. "Equal
  intervals" computed from the data min/max (10..86 -> 25, 40, 56, 71).
- [spec-gap] "Kept in increasing order" - push or clamp? Chose clamp: a slider stops one unit
  from its neighbor. Moving a slider switches the preset menu to "Custom".
- [spec-gap] "Readout counts how many regions fall in each class" - placed the counts in the
  legend next to each class range.
- [decision] Added the judgment row (two revealed/hidden selects + Check). "Revealed" is judged
  by a stated heuristic: a pattern's regions must span at least 3 of the 5 classes.
- [decision] Kept the template's red-orange-yellow-green palette because the chapter describes
  it; it is not color-blind safe, so the info panel and legend always name the class number
  and range. A ColorBrewer sequential palette would be better; flagging for the author.
- [decision] Map height 420 (wide), 380 (600-719px) and 240 (<600px) so the content stays within
  CANVAS_HEIGHT 700 at every width from 400 to 800 px; feedback box has a fixed min-height so
  the "Back to Lesson Plan" link never peeks into the iframe.

## callout-overlay-anatomy-explorer

```
Instructional Design Check:
- Bloom Level: Understand
- Bloom Verb: explain
- Recommended Pattern: linked views (rendered overlay beside its JSON) with change-one-field
  sliders and a field-to-screen mapping panel; hint quiz as a check
- Specification Alignment: aligned (no continuous animation; everything responds to the
  learner's hover, click or slider)
- Rationale: to explain what a field does, the learner must see the field value and its
  on-screen effect at the same moment; the live JSON rewrite makes that link concrete
```

- [spec-gap] Routing: the spec's Type is "infographic" (SKILL.md routes "diagram overlay,
  callout labels, anatomy" to infographic-overlay-guide.md / diagram.js), but the library field
  says p5.js and the spec asks for p5 shapes, sliders and describe(). Followed the spec (p5) and
  mirrored the callout engine's visuals (numbered markers, leader lines, label column, info box).
- [spec-gap] Label placement not specified; the two-column layout (picture | JSON) leaves no
  "side panel". Put a label column between the picture and the JSON, inside the left column.
- [spec-gap] Radius units: the chapter says "relative units, typically 3 to 6" without a
  formula. Used marker radius = max(9 px, radius% x picture width x 0.9).
- [spec-gap] What quiz mode does to the JSON is not said; the JSON's label, hint and description
  strings would give the answers away, so they show "?" during the quiz. x/y sliders are
  disabled during the quiz.
- [decision] Added a "How each field appears" panel (field -> on-screen element) under the info
  box on wide screens; it highlights the field that just changed.
- [decision] Under 600px the columns stack and the JSON panel shows only the selected callout's
  block ("... 3 more callouts"), since all four blocks cannot fit in the fixed height.
- [decision] The JSON uses `textFont('monospace')` for the code panel only (not Segoe UI);
  long strings are truncated with an ellipsis and the full text appears in the info box.
- [decision] Kept `# Title` in index.md per the brief. Note that chapter 10 says overlay-engine
  MicroSims should omit the H1 because the engine renders its own title; that rule targets
  diagram.js overlays, not this p5 explainer.

## prompt-text-rule-checker

```
Instructional Design Check:
- Bloom Level: Evaluate
- Bloom Verb: judge
- Recommended Pattern: sorting/judgment activity with immediate feedback, one-sentence
  explanation per item and a worked rewrite for risky items
- Specification Alignment: aligned (rewrite moved into the control region, see decision)
- Rationale: judging needs criteria and feedback; tricky "safe" lines (numbers that describe
  the file, the Critical Rule itself) and tricky "risky" lines (a labeled-diagram style) force
  reasoning instead of keyword matching
```

- [spec-gap] "The line turns green or red" does not say whether color means correct/incorrect
  or safe/risky. Chose correct = green, incorrect = red, plus a ✓/✗ badge naming the true class
  (safe or risky), so color is never the only signal.
- [spec-gap] Only 3 example lines given; wrote 16 (8 safe, 8 risky) from the chapter's prompt
  template sections (Critical Rule, Image Specifications, What to Draw, Layout Notes), each with
  a one-sentence explanation and, for risky lines, a safe rewrite.
- [spec-gap] Re-judging not addressed. Each line can be judged once per run (so "correct out of
  attempts" is meaningful); "New prompt" draws and shuffles a new draft.
- [spec-gap] "Justify the judgment" has no mechanism in the spec's interactions. The sim gives the
  justification after the judgment; the How to Use and Lesson Plan ask learners to state their
  reason before pressing a button. An in-sim reason picker would make justification measurable.
- [decision] "A Rewrite button on each risky line" would put controls inside the drawing region,
  which the p5 guide forbids. Used one "Show rewrite" button in the control region that acts on
  the selected, already-judged risky line.
- [decision] Explanations appear in a panel under the list rather than inside each row, so rows
  stay one or two lines tall. The list font auto-fits from 16 px down to 12 px so 10 lines (8
  under 600 px) always fit the fixed height ("row height scales with the container width").
