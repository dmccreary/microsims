# Batch 04 gap notes

Sims: prompt-quality-workbench, generation-failure-mode-triage, p5-2x-migration-mapper,
p5-sketch-lifecycle-explorer, p5-coordinate-system-explorer, p5-vector-particle-lab,
p5-flowing-current-idle-pause, chart-configuration-anatomy-explorer.

## Batch-wide findings

- (Known issue, now in the brief) Playwright's bundled Chromium is missing, so the tester crashes. Before the
  shared `tester-chrome-shim.py` appeared I used an equivalent wrapper (`scratchpad/b04/run_tester.py`);
  sims 7-8 and the final re-run used the shared shim. Results were identical.
- [skill-gap] **Tester loads `file://` URLs** (`test-iframe-heights.py` line 139) while
  `bk-capture-screenshot` deliberately serves over HTTP because Chromium blocks `fetch()` of `file://`.
  Any sim whose spec requires "data stored in a JSON file in the sim folder" (3 of my 8) therefore
  never loads its data under the tester; controls created after the data arrives are invisible to it,
  so a PASS says nothing about them. I created every always-present control in `setup()` and verified
  data-dependent controls with my own HTTP-served Playwright harness (`scratchpad/b04/check.py`).
- [skill-gap] **p5.js version pins disagree.** The scaffold writes `p5@1.11.10`; the p5 guide, its
  `main-template.html` and Chapter 6 ("the generator skill's main.html template loads p5.js 2.3.2")
  say 2.3.2; the p5 guide's own "HTML Structure (REQUIRED)" section shows yet a third shell
  (cdnjs p5 1.7.0, body padding 20px, an `<h1>` inside `<main>`) that contradicts its template.
  Every other sim in this repo uses 1.11.10, so I kept the scaffold pin and wrote all sketches to run
  on both 1.x and 2.x (no `preload()`, data loaded with `fetch()` in `setup()`), and put the version
  in the `<title>` as Chapter 2 advises.
- [skill-gap] **Chart.js pin mismatch.** The scaffold writes `chart.js@4.4.4`; the Chart.js guide,
  Chapter 7 and the spec all say 4.4.0. I used 4.4.0 (see the chart sim below).
- [skill-gap] The p5 guide says "sliderLeftMargin ... Default value: 140px" in one place, the template
  uses 160, the CLAUDE.md example 105; harmless but each sim has to re-derive it.
- [skill-gap] **Dead link in the p5 guide.** `references/p5-guide.md` ("P5.js Version Updates") links the
  "[migration guide](https://p5js.org/migration-guide/)", which returns HTTP 404. The live resources
  are https://github.com/processing/p5.js-compatibility and the 2.x reference pages
  (https://p5js.org/reference/p5/splineVertex/, .../bezierOrder/). I verified every reference URL in my
  index.md files with curl before using it.
- [skill-gap] **bk-capture-screenshot has no "sim is ready" hook.** It waits for `load` plus a fixed
  delay. One capture of p5-2x-migration-mapper showed the pre-data "Loading snippets..." frame even
  though the dropdown had already been filled from data.json (so the fetch had finished); an immediate
  re-capture was correct. Probably CPU contention from parallel agents delaying requestAnimationFrame.
  A `window.microsimReady = true` convention (or waiting for `networkidle`, as the tester does) would
  make captures deterministic. I also call `redraw()` right after data loads.
- [skill-gap] **No pattern for loading a data file in p5.js.** Three specs require "data stored in a JSON
  file in the sim folder", but the p5 guide gives no loading pattern, `preload()` is gone in 2.x, and
  `loadJSON` returns a promise in 2.x but an object in 1.x. I used plain `fetch()` in `setup()` with a
  visible "Loading..." / error message. The guide's rule that sketches run unmodified in the p5.js editor
  then needs a note: upload data.json alongside the sketch (said in each index.md).
- [skill-gap] **Fixed iframe height vs. "stack below N px" specs.** Four of my specs ask panels to stack
  on narrow screens, but the iframe height is fixed, so drawHeight must fit the tall stacked layout and
  the wide layout carries empty space (visible in the prompt-quality-workbench and migration-mapper
  screenshots). The guides do not say which width to design the height for, or suggest alternatives
  (compact narrow mode, overlays, internal scrolling). I sized for 400 px and used overlays/compaction.

## prompt-quality-workbench

```
Instructional Design Check:
- Bloom Level: Evaluate (L5)
- Bloom Verb: critique
- Recommended Pattern: rubric-style critique tool (toggle a clause, see which decisions and risks open up)
- Specification Alignment: aligned (small additions below)
- Rationale: critiquing a prompt means judging what it leaves open; toggling clauses and seeing the open decisions ranked by risk for a concrete request gives immediate, criterion-based feedback.
```

- [spec-gap] The three Scenario requests were not given. I used: easy "bouncing ball with a speed slider", medium "pendulum period explorer" (the chapter's own worked example, default), hard "projectile lab with a live chart of range against angle".
- [spec-gap] "Different difficulty" had no observable effect in the spec. I made each scenario carry a per-decision risk level (HIGH/MED/LOW) so the same open decision matters more for a harder request; the panel sorts by risk and names a "Close first" decision.
- [spec-gap] The failure-mode table in Chapter 5 has no mode that fits "points to the specification", "limits the output files" or "gives a tie-breaking rule". I added two chapter-derived modes and cited their sections in data.json: "Unrequested extra files" (the "Name the Output You Do Not Want" tip) and "Spec and sim disagree" (Iterative Refinement). Decision-to-failure links are my own mapping; the panel footnote marks them as a heuristic.
- [spec-gap] Starting clause state unspecified. Default: skill, spec and layout on; version pin, output files and tie-break off (three open decisions), and Reset returns there.
- [spec-gap] "Assembled prompt text" location unspecified: the card stack *is* the assembled prompt (request card plus clause cards with the scenario's sim-id filled in), with a word/clause count line under the title.
- [decision] Clicking a card also toggles its clause (kept in sync with the checkbox), in addition to the six required checkboxes.
- [decision] Three control rows (115 px) so the checkboxes can wrap at 400 px as specified; at wide widths the third row holds a one-line prompt for the learner.
- [spec-gap] Canvas height not given; drawHeight 540 is driven by the narrow stacked layout with all six decisions open.

## generation-failure-mode-triage

```
Instructional Design Check:
- Bloom Level: Analyze (L4)
- Bloom Verb: distinguish
- Recommended Pattern: case-based classification with contrastive feedback
- Specification Alignment: aligned
- Rationale: distinguishing modes needs evidence (symptom, picture, console) and feedback that names what separates the chosen mode from the right one, not just right/wrong.
```

- [spec-gap] The eight cases, console messages and the case-to-mode split were not given. I wrote two cases each for hallucinated API and version drift (one throwing, one silent: the bezierVertex drift case has a clean console) and one for each layout mode. Console text is simulated in Chrome's format.
- [spec-gap] "Explains what evidence would have distinguished the two modes" needs text for up to 40 case/wrong-mode pairs. I wrote hand-made `confusions` entries for the most tempting wrong pick per case and fall back to a generated sentence from each mode's `tell` field.
- [spec-gap] Retry policy unspecified: after one Check the answer is revealed (right card green, wrong pick red); the score counts correct first tries only. Case order is fixed for the first round, then shuffled.
- [spec-gap] "Logged through a single function so Chapter 17 can attach xAPI" - no event names or payload given. `logInteraction(verb, extra)` appends to `interactionLog` and dispatches a `microsim-interaction` CustomEvent; verbs viewed-case, opened-console, selected, answered. The brief's central note on missing instrumentation specs applies here too.
- [decision] Under 600 px the Check feedback overlays the thumbnail (there is no room below the cards at a fixed iframe height); it clears on Next case.
- [decision] Monospace `textFont('monospace')` for the simulated console only (the guide says not to call textFont unless the design needs it; a console does).

## p5-2x-migration-mapper

```
Instructional Design Check:
- Bloom Level: Apply (L3)
- Bloom Verb: use
- Recommended Pattern: worked-example completion (flag, choose a replacement, compare with the reference)
- Specification Alignment: aligned
- Rationale: applying a rule table to new code is practice with immediate feedback that quotes the rule; the reveal lets learners compare their own version with the correct one.
```

- [spec-gap] Snippets and the three candidates per call were not given; I wrote them from the Chapter 5 table and checked the 2.x forms against the live p5.js reference (bezierVertex one point per call, bezierOrder(2) inside beginShape(), splineVertex passes through all points and closes with endShape(CLOSE)).
- [spec-gap] The table's curveVertex row says "rely on endShape(CLOSE)", which only makes sense for a closed shape, so the curveVertex snippet is a closed blob with repeated anchors.
- [spec-gap] "Result panel ... each line clickable" had no stated behavior for the result panel; clicking a line there reopens the choices.
- [spec-gap] The migration table covers four calls but the spec asks for one legacy call per snippet; the chapter lists five affected MicroSims, which the feedback names per snippet.
- [spec-gap] The objective JSON lists chapter 5, the batch assignment said chapter 6. The spec block lives in Chapter 5; metadata uses 05-generating-microsims-with-ai-skills.
- [decision] Long code lines soft-wrap after a comma (continuation rows have no line number) instead of truncating, so the numbers stay visible at 700 px; panels size to their content.
- [decision] Added a "Converted: n of 4" counter and, once flagged, the matching migration-table row as a quote under the panels.
- [skill-gap] Canvas-drawn clickable code lines and candidate boxes are "drawn controls" in spirit; the guide forbids drawn controls but gives no pattern for clickable content (cards, lines) that are not controls. The validator only checks that some builtin control exists.

## p5-sketch-lifecycle-explorer

```
Instructional Design Check:
- Bloom Level: Understand (L2)
- Bloom Verb: explain
- Recommended Pattern: step-through with concrete data visible (counters, highlighted statement)
- Specification Alignment: aligned (the spec already chose a slowed, steppable loop, default paused)
- Rationale: learners predict the next frame, then see each statement execute in order; continuous animation is only available at the learner's chosen frame rate.
```

- [spec-gap] The "five draw() steps" were not listed. I used the chapter's five-step drawing order applied to the ball sketch: background(), drawGrid(), title text(), ballY += 8 + circle(), label text().
- [spec-gap] "Step ... advances the highlighted step through the list": ambiguous between one statement per click and one frame per click. Step runs one whole draw() call and sweeps the highlight through the five statements (180 ms each) while the sketch canvas builds up statement by statement.
- [spec-gap] Ball speed and what happens at the bottom unspecified: 8 px per draw() call, wraps to the top (setup() is not re-run).
- [decision] The sketch's canvas is an offscreen `createGraphics` buffer so skipped backgrounds really accumulate (the label smears too, which the caption mentions). On load the buffer is empty with "setup() created this canvas. draw() has not run yet."
- [decision] Three control rows so the two long checkbox labels can stack at narrow widths; at wide widths row 3 holds a tip.

## p5-coordinate-system-explorer

```
Instructional Design Check:
- Bloom Level: Apply (L3)
- Bloom Verb: calculate
- Recommended Pattern: practice problems with immediate worked feedback (calculate, click, see the filled-in map() call)
- Specification Alignment: aligned
- Rationale: the learner computes y = map(h, 0, max, drawHeight, 0) before clicking; the reveal shows the correct point, a meter ruler and the arithmetic, and diagnoses the classic missing-flip error.
```

- [spec-gap] The challenge example only gives a height, not an x position. I added "on the dashed line x = N" (a multiple of 50) so each target is a single point.
- [spec-gap] Accuracy threshold unspecified: 12 px counts as correct. Heights are whole meters from 1 to max - 1.
- [spec-gap] drawHeight unspecified; I used 400 so the arithmetic is clean (40 px per meter on the default 0-10 scale), matching the chapter's worked example.
- [spec-gap] Where the marker coordinates are "listed" is unspecified: an info panel lists the last four; each marker is also labeled on the grid.
- [spec-gap] Default of "Show origin and axes directions" unspecified; I start it checked because it states the objective's key fact (y grows down) on first view.
- [decision] Added feedback that detects the unflipped answer (click near map(h, 0, max, 0, drawHeight)) and says the flip is missing, and a challenges-correct counter.
- [decision] The pointer readout is shown only after canvas mouseOver: p5's mouseX/mouseY start at 0, so an always-on readout sat at the origin before the pointer arrived (visible in headless screenshots).
- [decision] Info panel placement moves away from the target (and from the origin arrows) so it never hides the answer.

## p5-vector-particle-lab

```
Instructional Design Check:
- Bloom Level: Analyze (L4)
- Bloom Verb: distinguish
- Recommended Pattern: comparison tool - change one parameter, observe which labeled arrow or readout changes
- Specification Alignment: aligned (additions below)
- Rationale: distinguishing position, velocity and acceleration needs all three visible and separately labeled; distinguishing detection from response needs a state where one happens without the other (overlap while paused).
```

- [spec-gap] The spec names green (velocity) and red (gravity) arrows but no position vector, although the objective lists position. I added a gray dashed position arrow from the origin (0, 0) and a legend.
- [spec-gap] Collision response unspecified. The ball reflects its velocity about the contact normal keeping the Bounciness fraction and is pushed out of overlap; the readout prints Detection and Response on separate lines. Detection runs even while paused ("Response: none yet (paused)"), which makes the distinction observable.
- [spec-gap] Arrow scales, ball sizes, particle speeds and life were not given: velocity 10 px per unit, gravity 60 px per unit (0.5 -> 30 px), particle life 90 frames, launch velocity (+-2, -9 to -13). Particles also bounce on the floor so Bounciness matters in Fountain mode.
- [spec-gap] "A mode switch at the top of the controls" - control type unspecified; I used `createRadio` (One ball / Fountain).
- [spec-gap] Seven controls exceed the p5 guide's 1-5 control budget; kept all because the spec lists them. Spawn rate is dimmed in One ball mode.
- [decision] At narrow widths "Show vectors" shares the Spawn rate row (four rows of controls fit at 400 px).
- [decision] The control region is repainted after the scene so long arrows near the floor cannot spill into it.

## p5-flowing-current-idle-pause

```
Instructional Design Check:
- Bloom Level: Create (L6)
- Bloom Verb: design
- Recommended Pattern: builder/design lab with live measurements (step counter, lap time, dot count)
- Specification Alignment: aligned (one objective term interpreted, see below)
- Rationale: designing an animation means choosing parameters and judging the result; the counter and readout make the effect of each choice, and of pause-when-idle, measurable rather than impressionistic.
```

- [spec-gap] The objective says the learner chooses a "path", but no control changes the path. I interpreted path choice as direction along the loop (Reverse direction), as in the H-Bridge's forward and reverse paths, and did not add a path selector.
- [spec-gap] Interaction of Start with pause-when-idle was ambiguous ("with it on, the dots move only while the pointer is over the sim"). I used advancing = running AND (pause-when-idle off OR pointer over the sim); the readout names the reason when not advancing ("press Start" or "pointer is outside the sim").
- [spec-gap] Direction semantics unspecified: forward dots leave the battery's + terminal (conventional current, clockwise). When reversed the battery symbol flips too, so the long plate stays at the terminal the current leaves.
- [spec-gap] Loop geometry unspecified: corners at 14% and 86% of the width, battery on the left wire, lamp radius 26 on the right wire.
- [decision] Added a design readout (path length, dot count, lap time at 60 fps) and "Pointer over sim: yes/no" to support the Create objective; a tap sets the pointer flag on touch screens, as the chapter describes for the H-Bridge.
- [decision] Battery and Lamp labels sit inside the loop so they are not clipped at 400 px.

## chart-configuration-anatomy-explorer

```
Instructional Design Check:
- Bloom Level: Understand (L2)
- Bloom Verb: explain
- Recommended Pattern: concrete data visibility - the configuration text and the chart side by side, one control per block, with hover mapping between them
- Specification Alignment: aligned
- Rationale: explaining which part controls which feature needs both the concrete object and its rendering visible at once; every edit is a single, observable cause and effect, with no animation needed.
```

- [spec-gap] Dataset values, labels and colors unspecified. I used "MicroSim sessions per day", labels Mon-Fri, Section A [12, 19, 8, 15, 10] in five named blues, and Add dataset appends Section B [9, 14, 11, 17, 6] in five named oranges (per-element color arrays so pie slices are distinguishable without changing the data block when the type changes).
- [spec-gap] "Hovering a block highlights the chart features it controls" - which features was left open. type outlines the plot area; data activates every bar/point/slice and outlines the category labels (x axis, or legend for pie); options outlines the legend, the title and the canvas. Blocks are also keyboard-focusable with the same effect.
- [spec-gap] "Responsive" off has no visible effect until a resize; I made it visible by giving the non-responsive canvas a fixed 300 x 200 size.
- [spec-gap] Break it: which label to remove and what to say. It removes the last label. Verified in the browser: for bar and line the fifth value gets x = NaN and is not drawn; for pie the fifth slice is drawn but has no legend entry. The mismatch caption states exactly that.
- [spec-gap] Canvas height unspecified; 660 px was needed so the code panel does not scroll at the 700 px tester width with one dataset.
- [decision] Chart.js 4.4.0 (spec, guide and chapter) instead of the scaffold's 4.4.4; `options` also carries `maintainAspectRatio: false` and a chart title, and the tooltip callbacks are summarized as a `// + tooltip callbacks` comment rather than printed.
- [decision] No y-axis title: `options.scales.y` makes Chart.js draw a linear axis behind a pie chart (verified), and a type-dependent scales entry would break "the dropdown rewrites the type block only".
- [decision] Type and Responsive changes destroy and rebuild the chart from the configuration object; value, dataset and legend edits mutate `chart.data`/`chart.options` and call `chart.update()`.
- [skill-gap] The Chart.js guide's `main-template.html` has no `<main>` element (the validator awards points for it and the brief requires it) and loads `chartjs-plugin-datalabels@2` without a pinned minor version; its Step 3 lists `style.css` but no `.js` file, while SKILL.md Step 4.3 says to write only the `.js`.
- [residue] With two datasets, or below 600 px, the configuration panel scrolls inside the fixed-height iframe.
