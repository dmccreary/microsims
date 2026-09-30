# Batch 05 gap notes

Sims: chart-type-chooser, priority-matrix-bubble-explorer, function-plot-slider-lab,
star-rating-comparison-table, clickable-detail-matrix, clickable-flowchart-anatomy,
node-edge-data-explorer, set-overlap-explorer.

No spec in this batch asked for continuous animation, so the Step 3.4 "ask the user"
branch never triggered.

## Batch-wide skill gaps

- [skill-gap] TESTER `test-iframe-heights.py` calls `p.chromium.launch()` with no fallback. This machine has no Playwright-bundled Chromium (`~/Library/Caches/ms-playwright` does not exist), so the tester crashes with "Executable doesn't exist ... chrome-headless-shell". `bk-capture-screenshot` already falls back to `channel="chrome"`. I ran the unmodified tester through a shim that adds the same fallback: `scratchpad/b05_tester.py`.
- [skill-gap] The TESTER's `extract_canvas_height()` regex is `//\s*CANVAS_HEIGHT\s*=\s*(\d+)` (equals sign). SKILL.md Step 4.4 requires `// CANVAS_HEIGHT: <int>` (colon), so the tester never reads the declared height and always falls back to the measured content height for its suggestion.
- [skill-gap] The TESTER loads `main.html` as `file://`. Chromium blocks `fetch()` of file URLs, so any fetch-based sim (the html-table pattern, here clickable-detail-matrix) is tested with an empty table and an error message. Its PASS says nothing about the real content height. bk-capture-screenshot serves over HTTP and is fine.
- [skill-gap] `shared.detect_library()` (used by validate-sims.py) runs its regexes over the whole `main.html` text, not just `<script src>` as its docstring says. star-rating-comparison-table has "p5.js" in its table text, so it is scored as a p5.js sim and loses 3 points ("missing updateCanvasSize", "missing canvas.parent"). Final score is 97 instead of 100.
- [skill-gap] The scaffold's CDN versions do not match the guides or the specs: Chart.js 4.4.4 in the scaffold vs 4.4.0 in chartjs-guide, bubble-guide and both specs; Plotly 2.35.0 vs 2.27.0 in plotly-guide, the spec and the chapter text; Mermaid `mermaid@10` UMD (major-only pin) vs `mermaid@11` ESM in mermaid-guide and its template. I used the guide/spec versions: Chart.js 4.4.0, Plotly 2.27.0, Mermaid pinned to 11.4.1 (UMD build). For "venn.js" the scaffold loaded p5.js with no D3 or venn.js at all (same root cause as the known p5 default).
- [skill-gap] SKILL.md Step 4.3 says "Write ONLY the .js file", but the mermaid, vis-network, venn, html-table and comparison-table guides all need structural markup in main.html plus a style.css (and data.json for html-table). The brief allows main.html edits; the skill text contradicts its own guides.
- [skill-gap] Fixed iframe heights vs responsive layouts: every guide asks for wrapping controls or stacking panels below 500–700px, but the iframe height is a single number. All 8 sims are correct at the 700px chapter width that the tester uses, but they grow taller than their iframe below about 600px (measured at 400px: 470–720px). No guide says how to budget for this.

## chart-type-chooser

```
Instructional Design Check:
- Bloom Level: Apply
- Bloom Verb: select
- Recommended Pattern: practice problem with immediate feedback, then comparison of alternatives
- Specification Alignment: aligned
- Rationale: the learner commits to a type, gets a verdict that quotes the fit rule, then redraws the same data in the other two types, so the choice is applied and checked, not just viewed
```

- [spec-gap] The spec gives no dataset values, labels, units or data questions. I invented three with a stated question each: Library shares (%) (p5.js 45, Chart.js 20, vis-network 15, Mermaid 12, Plotly 8); Learners by week (120, 150, 185, 170, 210, 240); Minutes per sim type (8 categories, 2.6–7.4 min). All are labeled "invented for illustration".
- [spec-gap] Only the pie fit rule is quoted. I wrote "bar: compare values across discrete categories" and "line: change over an ordered, continuous quantity such as time".
- [spec-gap] Green vs amber was undefined. Only the best type per dataset is green; the other two get amber, graded as "Workable, but not the best fit" or "Poor fit", each with a reason and the best-fit rule.
- [spec-gap] No chart height was given. I used a fixed 320px chart, CANVAS_HEIGHT 450.
- [decision] Added a "Drawn for this dataset: ✓ Bar ○ Line ○ Pie" tracker and a prompt to switch types after checking. The spec has no mechanism for the objective's "check the choice against ... two alternative types" beyond the radio buttons.
- [decision] The side note moves under the chart below 560px. The spec only specified control wrapping at 500px.

## priority-matrix-bubble-explorer

```
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: compare
- Recommended Pattern: comparison tool with manipulable data (select, move, observe quadrant change, explain)
- Specification Alignment: aligned
- Rationale: learners compare items on three variables and move them across midpoints; a "Why" line and the live quadrant list make the classification rule explicit
```

- [spec-gap] Items, scores, counts and statuses are not given. I used 8 MicroSim types consistent with the chapter's worked example (Bar Charts, Function Plots, Physics Sims, Network Maps, Timelines, Venn Diagrams, Map Explorers, 3D Models), with statuses Planned / In progress / Proposed.
- [spec-gap] The midpoint and boundary rule are not given. I used midpoint 5, with "high" meaning > 5, so a score of exactly 5 counts as low. The rule is shown in the UI.
- [spec-gap] Quadrant names are not given. I used Quick Wins, Major Projects, Fill-ins and Money Pits.
- [spec-gap] The mapping from "Bubble scale 1 to 3" to radius is not given. I used minR = 4×scale and maxR = 15×scale, so the default scale of 2 gives the guide's 8–30 px. Step 0.5. The Effort and Impact sliders run 0–10 in steps of 0.5, and Bar Charts is preselected.
- [spec-gap] The spec contradicts itself on the list's position: Layout says "A list below the chart", but Responsive says it "moves below the chart at all widths under 700 pixels". I put it beside the chart at ≥700px and below it under 700px.
- [skill-gap] bubble-guide says to draw quadrant shading in `afterDraw`, while chartjs-guide says to use `afterDatasetsDraw` so tooltips stay on top. Shading drawn after the datasets tints the bubbles, so neither guide is right for shading.
- [decision] One plugin draws the shading in `beforeDatasetsDraw` and the quadrant and item labels in `afterDatasetsDraw` (the hook the spec names).
- [skill-gap] With the guide's recommended `min: -0.5, max: 10.5`, Chart.js puts ticks at -0.5, 0.5, 1.5 and so on. The guide's example shows no tick labels at all, and I needed an `afterBuildTicks` callback to get integer ticks 0–10. The guide also recommends iframe `height="900"`, which conflicts with the fixed-height rules.
- [decision] Aspect ratio is fixed at 1.3, and the chart width is capped at 460px so the height stays constant at ≥700px. Layout review found the controls clipped at 800px before this cap.
- [decision] Added item name labels, dashed midpoint lines, a "Why" explanation line and a quadrant flash to support "identify ... and why". Moved Physics Sims to (6, 8.5) so its label no longer collides with the "Major Projects" label (layout review fix).

## function-plot-slider-lab

```
Instructional Design Check:
- Bloom Level: Apply
- Bloom Verb: locate
- Recommended Pattern: parameter slider with real-time readout plus a self-check (Show matches)
- Specification Alignment: aligned
- Rationale: the learner moves the marker to find x values for a target output, then checks the answer against computed matches
```

- [spec-gap] Target y default, tangent behavior and no-match behavior are not given. I default to 0.5. Touch points such as sin(x) = 1 are found by a ternary search on |f − t|, and a no-match message reports the function's range in the domain (for example x² = 50).
- [spec-gap] Which points get tooltip notes is not given. I annotated maxima, minima and zeros inside the domain.
- [spec-gap] "Narrow screens" is not defined. I used window width < 600px for the 300px plot height.
- [decision] Added the exact special points (up to 7) to the 500 even samples so the tooltip reads exactly "x = 1.571, f(x) = 1.000 (maximum of sin)". Otherwise the nearest sample would be x = 1.574.
- [decision] The y range is padded by 10% of the span. The guide's `min*1.1, max*1.1` gives no padding when the minimum is 0, as for x² and e^(−x²).
- [decision] Added a Clear button. Changing the function recomputes shown matches. Ticks are at multiples of π/2.

## star-rating-comparison-table

```
Instructional Design Check:
- Bloom Level: Evaluate
- Bloom Verb: judge
- Recommended Pattern: weighted ranking against stated criteria, with justification
- Specification Alignment: modified (added a "Stated need" selector)
- Rationale: judging "which item best fits a stated need" requires a need to judge against; weights make the criteria explicit and sorting shows how rankings depend on them
```

- [spec-gap] The five items are unnamed. I used the book's five libraries (Mermaid, Chart.js, Plotly.js, vis-network, p5.js). Ratings are chosen so the winner changes with the weights (ease-heavy: Mermaid; balanced: Chart.js; interactivity-heavy: p5.js). The table and source line state that all ratings are invented.
- [spec-gap] The objective names a "stated need", but the spec provides no way to state one. [decision] Added a "Stated need" dropdown with 3 needs.
- [spec-gap] Formula and display for the weighted score are not given. I used the normalized weighted mean on the 1–5 scale in a new "Weighted score" column, with a star on the top score. When both weights are 0 the column shows "—".
- [spec-gap] "When sorting is on" is not defined. Sort by weighted score turns sort mode on (aria-pressed), weight changes re-sort live, and Reset order turns it off.
- [spec-gap] Badge meanings are not given. I used learning difficulty: Easy (productive within an afternoon), Medium (a few days of practice), Hard (needs programming experience).
- [spec-gap] The spec's height rule, 60 px per row + 150 = 450, ignores the two rows of controls. The measured need was 500 (iframe 502).
- [skill-gap] comparison-table-guide's pure-CSS `tr::after` tooltips are clipped by the `overflow-x: auto` wrapper that the spec requires below 600px.
- [decision] Switched to one JS-positioned tooltip, still shown below the first row. Rows are focusable, so keyboard users get the tooltip too.
- [decision] Darkened the badge colors from the template (#22c55e and similar) so white badge text has enough contrast. The star colors follow the template exactly.

## clickable-detail-matrix

```
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: differentiate
- Recommended Pattern: comparison matrix with progressive disclosure and a predict-first mode
- Specification Alignment: aligned
- Rationale: short summaries force comparison across rows and columns; the panel supplies the reasoning; "Random cell" asks for a prediction before revealing the explanation
```

- [spec-gap] Theory names, dimensions and all 16 cells (value, emphasis, description, example) are invented. Theories: Pathfinder Theory, Echo Practice Model, Circle Dialogue Approach, Tuned Challenge Model. Dimensions: Learner's role, Role of the MicroSim, Evidence of learning, Feedback timing. Emphasis counts: 4 high, 3 medium, 3 low, 2 balanced, 4 unique (one unique per row).
- [spec-gap] Emphasis labels have no definitions in the spec or in html-table.md (only colors). I wrote definitions for the legend and data.json.
- [spec-gap] The prediction flow is unspecified. I show 5 emphasis buttons, hide the table tints while the learner predicts, give right/wrong feedback, and keep a running score.
- [skill-gap] html-table.md loads data with `fetch` and offers no file:// guidance, so opening main.html directly shows nothing.
- [decision] Added a visible error message when data.json cannot be fetched.
- [decision] The panel is 350px wide. Below 600px it becomes a bottom sheet (max 78vh). Focus returns to the originating cell, including after Random cell.

## clickable-flowchart-anatomy

```
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: differentiate
- Recommended Pattern: inspection explorer (click/hover every part) with a deliberate break-and-repair
- Specification Alignment: modified (one label changed so "Break it" produces a real error; shape key added)
- Rationale: each part of the diagram reveals its shape, role, source line and style class, so learners separate shape, edge, label and class; the real parse error shows why quoting rules exist
```

- [spec-gap] The objective says "the four node shapes", but the specified diagram uses only three distinct shapes (rounded twice, rectangle, diamond).
- [decision] Added a "Four node shapes" key strip below the diagram that includes the circle connector, with clickable syntax and role for each shape.
- [spec-gap] Mermaid 11.4.1 parses all four spec labels fine without quotes (`Draft[AI drafts the MicroSim]`, `Check{Meets the objective?}`, `Start(Learning objective written)`, `Done(Publish)`); I tested this with `mermaid.parse`. So "Break it" cannot produce a parse error as specified.
- [decision] The end label is now "Publish (add to chapter)". Removing its quotes gives a real error, "Parse error on line 5: ... got 'PS'", which the panel shows and explains. The chapter text still says "Publish", so the central step may want to align it.
- [decision] The diamond label renders as `Meets the<br/>objective?` (same words) to keep the diagram about 435px tall with 16px fonts.
- [decision] Clicking an unlabeled arrow also shows edge info. Invisible 14px-wide hit paths make the arrows clickable, which covers "the roles of edges".
- [skill-gap] mermaid-guide and its template cover hover only. The chapter's rule "every node must have a click directive" needs `securityLevel: 'loose'`, a global callback, and `bindFunctions(container)` after `mermaid.render()`, none of which is documented.
- [skill-gap] Mermaid writes classDef colors as inline `!important` styles, so CSS stroke overrides for hover highlighting do not work. I used a `filter: drop-shadow` glow instead.
- [skill-gap] The guide's ESM `import` in a module script makes it awkward for the sim's own classic script to call `mermaid.render` and `mermaid.parse`. I used the UMD `dist/mermaid.min.js` build.

## node-edge-data-explorer

```
Instructional Design Check:
- Bloom Level: Apply
- Bloom Verb: implement
- Recommended Pattern: builder/editor with immediate visual feedback and a live JSON view
- Specification Alignment: aligned
- Rationale: every edit (add node, connect, swap, drag, layout) is reflected at once in both the drawing and the node/edge JSON
```

- [spec-gap] The spec lists 8 nodes but no edges or positions. I defined these edges: Flowchart→Mermaid Library "is drawn with"; Concept Map→vis-network "is drawn with"; Causal Loop Diagram→vis-network "is drawn with"; Causal Loop Diagram→Concept Map "is a kind of"; vis-network→Network Layout "computes"; vis-network→Node Selection Event "raises"; Venn Diagram→Concept Map "is an alternative to"; Network Layout→Concept Map "arranges".
- [decision] "Causal Loop Diagram is a kind of Concept Map" is debatable. It is the only way to use the spec's example label "is a kind of" among these eight nodes.
- [spec-gap] How Connect picks its label is not given. The learner chooses the relationship from a dropdown of 8 before clicking the source and target nodes. New nodes go into preset open slots.
- [spec-gap] Physics parameters are not given, nor what switching back to "fixed" restores. I used barnesHut, and switching back restores every stored x/y.
- [decision] `dragNodes` is enabled in the iframe, against the guide's interaction matrix. Dragging does not hijack page scroll, and it updates the stored x/y shown in the JSON, which is itself data editing.
- [skill-gap] vis-network-guide's template sets per-node `color`. Nodes that also carry a `group` field lose those colors to vis-network's default group palette after `setOptions` (seen when toggling physics). I moved the colors into `options.groups`.
- [skill-gap] The guide's pan-after-fit recipe does not keep bottom-row nodes clear of the navigation buttons. Layout review found the ↑ button covering "Mermaid Library" at 800px.
- [decision] Replaced the guide's recipe with a custom `fitView()` that reserves a 60px band at the bottom of the canvas.
- [decision] Horizontal-edge label bug (checklist 5.2): the line ran through "is a kind of". I tilted that edge (y -145 → -130) and gave edge labels a white background.

## set-overlap-explorer

```
Instructional Design Check:
- Bloom Level: Understand
- Bloom Verb: classify
- Recommended Pattern: classification with immediate feedback and a one-sentence reason (no animation)
- Specification Alignment: aligned
- Rationale: hover definitions and click examples build the categories; Classify mode checks whether the learner can place new cases in the right region
```

- [spec-gap] Invented content: set labels ("Ordered process (Flowchart)", "Labeled relationships (Concept Map)", "Feedback (Causal Loop)"), all 7 definitions, 14 region examples, and 6 classify items with their reasons. The items cover 6 of the 7 regions; "ordered process + labeled relationships" has examples only.
- [spec-gap] Set sizes are not given. I used symbolic sizes of 12 per set, 4 per pair and 1.8 for the triple.
- [skill-gap] venn.js draws each set as a whole circle, so exact regions (for example "Process only") cannot be highlighted from its paths. The venn guide does not cover this.
- [decision] Built exact region highlights with nested clip paths and masks. Hit-testing relies on venn.js's own path stacking.
- [skill-gap] The venn template calls `div.datum(sets).call(chart)`, which returns the d3 selection, not the layout. Circle positions require `chart(selection)`.
- [skill-gap] The venn template's resize handler sizes the diagram from `window.innerWidth − 40` with no height cap. The diagram then outgrows a fixed iframe on wide screens: layout review found the circles clipped at 800px.
- [decision] Capped the diagram at 418×360.
- [skill-gap] The venn template CSS uses 'Segoe UI' in its font stack. I used Arial/Helvetica.
- Residue: the Venn regions are SVG paths and cannot be reached with the keyboard.
