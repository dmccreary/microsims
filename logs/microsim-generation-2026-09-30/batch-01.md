# Batch 01 gap notes

Sims: bouncing-ball-gravity-lab, microsim-family-tree, microsims-milestones-timeline,
ai-generation-pipeline, microsim-technology-stack, author-to-learner-workflow,
which-kind-of-object-classifier, microsim-directory-explorer.

## Batch-wide findings

- [skill-gap] `test-iframe-heights.py` (TESTER) calls `p.chromium.launch(headless=True)` with no
  fallback. On this machine Playwright 1.63's bundled Chromium is not installed
  (`~/Library/Caches/ms-playwright/` holds only `ms-playwright-go`), so the tester crashes with
  "Executable doesn't exist". `bk-capture-screenshot` already falls back to
  `channel="chrome"`; the tester should do the same. Workaround used (no ibook-skills edit):
  `scratchpad/b01_tester.py` monkeypatches `BrowserType.launch` to retry with `channel="chrome"`
  and then `runpy`-runs the tester unchanged.
- [skill-gap] `sync-iframe-heights.py` rewrites iframe tags inside fenced code blocks. Running
  `--sim bouncing-ball-gravity-lab` changed two *worked examples*, not embeds:
  ch01 line ~541 (a ```markdown example, 452 -> 502) and ch12 line ~186 (a ```html example whose
  surrounding text says drawHeight 400 + controlHeight 50 = 450 -> iframe 452; the tool made it
  502, contradicting the text). I restored the ch12 line to its original 452px (exact one-line
  revert) and left the ch01 change (502 is the correct height for this sim). The script should
  skip fenced code blocks, or at least `--dry-run` should list them separately.
- [spec-gap] ch12's worked example says the Bouncing Ball Gravity Lab has `// CANVAS_HEIGHT: 450`
  (400 + 50), but the ch01 spec for the same sim requires a 100 px control region (400 + 100 =
  500). The sim follows the spec (500 / iframe 502), so ch12's example no longer describes the
  real sim. Orchestrator: either rename the ch12 example to a hypothetical sim or update it.
- [skill-gap] p5.js version drift: the scaffold (`shared.LIBRARY_CDNS`) pins p5@1.11.10, the p5
  guide's template says p5@2.3.2 in one place and cdnjs p5 1.7.0 in its "HTML Structure"
  section, the concept-classifier guide says 2.3.2 with `async setup()`, and the chapter text
  teaches p5@2.3.2. Per the brief I kept the scaffold's 1.11.10.
- [skill-gap] Mermaid version: the scaffold loads `mermaid@10` (a floating major, not a pin),
  while the mermaid guide and its templates use `mermaid@11` ESM. The book's own "Pin the
  Version" warning requires an exact version. I pinned to `mermaid@10.9.8` (what `@10`
  resolves to today) so the scaffold's major version is kept but the address is exact.
- [skill-gap] `validate-sims.py` only finds `educational` / `pedagogical` at the top level or
  directly inside `dublinCore`. A metadata.json that follows the book's own nested schema
  (`microsim.educational`, as ch02 teaches) loses 10 points. I kept the scaffold's flat layout
  (all fields at top level, plus `search`, `userInterface`, top-level `canvasHeight`).
- [skill-gap] The p5 guide's "Animation Control for Iframe Embedding (REQUIRED)" rule (advance
  animation only while the mouse is over the canvas) conflicts with p5 DOM controls: moving the
  pointer onto a Start button fires the canvas `mouseOut`, so the sim would freeze the moment
  the learner reaches for a control. Not applied to the bouncing ball (see decision below).

## bouncing-ball-gravity-lab

```
Instructional Design Check:
- Bloom Level: Understand
- Bloom Verb: explain
- Recommended Pattern: predict-then-test gate on two parameter sliders, with concrete readouts
  (height, speed, bounces, first-bounce peak as % of drop) and the two model rules shown
- Specification Alignment: aligned (animation kept; it is the phenomenon being explained and
  the prediction gate supplies the "predict before observing" step)
- Rationale: the spec's Predict-first checkbox is exactly the step-through safeguard the skill
  recommends for Understand; the motion itself is the evidence the learner explains.
```

- [spec-gap] "Higher, lower, or the same" compared to what was not defined. Chose: the first
  bounce peak of the next drop vs. the first bounce peak with the settings before the change,
  with a 3% tolerance for "same". Both are drawn as dashed lines.
- [spec-gap] Where the three answer buttons live was not specified; the p5 standard forbids
  controls in the drawing region. Chose: while a prediction is pending, Higher/Lower/Same
  replace Start/Drop Again in control row 1, and the question appears in a panel in the
  drawing region.
- [spec-gap] "Reveals the answer after the next drop" - chose: answering resets the ball to the
  top; the reveal happens when the ball reaches the top of its first bounce, with a one-line
  explanation (bounciness² rule; gravity changes speed, not height).
- [spec-gap] Stop threshold "a small threshold" - chose rebound speed < 0.6 px/frame.
- [spec-gap] Readout units unspecified - pixels and pixels per frame (matches the chapter's code).
- [decision] Integrated each frame exactly for constant acceleration (with the exact time of
  impact inside the frame) instead of plain Euler, so the measured first bounce is exactly
  bounciness² x drop height for every gravity. With naive Euler, gravity would change the
  bounce height by a few percent and the "same" answer would be wrong for a numerical reason.
- [decision] Did not gate animation on mouse-over (see batch-wide note); the sim starts paused
  and only runs after Start / Drop Again.
- [decision] Added a small "The model" box showing both update rules with live slider values
  (hidden automatically when a long result message needs the room) to support "explain".
- [decision] Layout: ball column on the left, readout/prediction panel on the right; the panel
  text wraps with a measured word-wrap helper so it fits at 400 px.

## microsim-family-tree

```
Instructional Design Check:
- Bloom Level: Understand
- Bloom Verb: classify
- Recommended Pattern: click-to-inspect network with definition + positive example + near miss,
  plus a placement quiz with property-specific feedback
- Specification Alignment: aligned (small layout adaptations below)
- Rationale: near misses isolate the single distinguishing property of each level; the quiz makes
  the learner apply that property to unseen examples, with feedback naming the missing property.
```

- [spec-gap] "Four boxes arranged left to right" with three long arrow labels does not fit a
  ~410 px-wide network area (the right panel takes 290 px of a 700 px iframe): a straight row
  scales text to ~9 px. Chose a left-to-right descending staircase (x step 100, y step 135) so
  each arrow label sits in the gap between two boxes.
- [spec-gap] Quiz size and example pool unspecified. Chose a pool of 8 examples (2 per level);
  each round draws one per level (4 items, shuffled); score = correct / attempts plus
  first-try count.
- [spec-gap] "Hides the labels" - chose to hide node labels only ("?"), keeping the arrow labels
  so the learner classifies by the distinguishing property (the objective). Colors stay.
- [spec-gap] Wrong-answer feedback content unspecified. Chose: if the learner picks a level that is
  too specific, name the first property the example lacks; if too general, name the next
  property it also has.
- [decision] Narrow layout (<600 px, panel below): the flatter staircase has no room for arrow
  labels, so they move into the hover tooltips (quiz hint text adapts) and the definition shows
  only its first sentence.
- [decision] vis-network navigation buttons (required by the vis-network guide) are shown in
  the wide layout only; in the 200 px-tall narrow network they covered the bottom boxes.
- [decision] Preselected the MicroSim node so the panel is informative on load.
- [skill-gap] vis-network edge `font.vadjust` moves the label text but not its `background`
  box, so the edge line shows through the text. Worth a line in the vis-network guide's pitfalls
  (the visual checklist 5.2 recommends a y-offset for horizontal edges, which triggers this).
- [skill-gap] vis-network guide template `main-template.html` has no `<main>` element and loads
  an unpinned `https://unpkg.com/vis-network/...`; both contradict the validator and the
  "pin the version" rule. I used the scaffold's jsDelivr vis-network@9.1.9 plus its CSS.

## microsims-milestones-timeline

```
Instructional Design Check:
- Bloom Level: Remember
- Bloom Verb: identify
- Recommended Pattern: timeline explorer with click-to-read details and a sequence number
  ("milestone 4 of 6") to support ordering
- Specification Alignment: modified (wheel zoom only in fullscreen; short box labels)
- Rationale: identifying and ordering events needs the events laid out on a true time axis with
  their dates visible; zoom reveals the tight September 2026 cluster.
```

- [spec-gap] Descriptions ("two-sentence description") were not provided. Wrote them from the
  chapter's own text (MicroSims 1.0 history, H-Bridge showcase description, v1.0 tag). For the
  two paper drafts the chapter gives only labels, so their descriptions stay general and do not
  claim paper content.
- [spec-gap] Month-only dates (2025-10, 2025-11) - placed on the 15th and displayed as
  "October 2025" / "November 2025". Day dates placed at noon so they sit under their day tick.
- [spec-gap] Theme for "H-Bridge showcase MicroSim created" not given (book / paper / tools).
  Chose Tools.
- [decision] Spec asks for mouse-wheel zoom; the skill forbids wheel capture in embedded sims.
  Wheel zoom is enabled only when main.html is not in an iframe (fullscreen); in the iframe,
  + Zoom / − Zoom / Fit all / Earlier / Later buttons zoom and pan, drag still pans, and a
  capture-phase wheel listener keeps vertical wheel scrolling on the page. Zoom centers on the
  selected milestone so the three events of 26-30 Sep 2026 can be separated.
- [decision] Box text uses short labels ("Paper draft v0.02"); the full spec label appears in
  the hover tooltip and the details panel (long labels overflowed the axis at 400-700 px).
- [decision] fitAll() pads the window by labelHalf x span / (width - 2 x labelHalf) instead of
  the guide's fixed "2 years", so edge labels are not clipped at any width.
- [skill-gap] Timeline guide Step 2 says the data lives in `timeline.json` and is fetched, but
  the TESTER loads sims over `file://`, where fetch of local JSON fails; data is embedded in
  the .js instead. The guide's template main.html also lacks `<main>` and uses unpkg (the
  scaffold uses jsDelivr).

## ai-generation-pipeline

```
Instructional Design Check:
- Bloom Level: Understand
- Bloom Verb: explain
- Recommended Pattern: static flowchart with click-to-reveal definition + example per node,
  hover highlighting of in/out arrows, and a clickable feedback loop
- Specification Alignment: aligned
- Rationale: explaining roles needs each component's definition next to where it sits in the
  flow; hover highlighting shows the agent is the hub; the dashed loop carries the testing lesson.
```

- [spec-gap] Node definitions and examples were not given; wrote them from the chapter's
  Generative AI / LLM / Prompt / AI Skill / AI Agent sections.
- [spec-gap] The spec says the feedback arrow's "infobox explains why generated code must be
  tested", but Mermaid has no click directive for edges. Added a JS click handler on the dashed
  path (with a transparent 18 px hit path) and on its label.
- [decision] Layout follows the spec (infobox below the diagram), not the mermaid guide's default
  2/3 + 1/3 side panel.
- [decision] The Mermaid source lives in the .js (rendered with `mermaid.render` +
  `bindFunctions`) rather than inline in main.html, so the .js is the single source of truth.
  Below 560 px the diagram re-renders top-to-bottom so node text stays readable.
- [skill-gap] Mermaid 10 nests a `span.edgeLabel` inside each `g.edgeLabel`, so the obvious
  selector `.edgeLabels .edgeLabel` returns two elements per edge and breaks index mapping to
  `path.flowchart-link`; use `.edgeLabels > g.edgeLabel`. The guide's hover code only covers
  nodes; a note on edge ids/classes (`L-A-B-0`, `LS-A LE-B`) would help.
- [skill-gap] The mermaid guide's templates use `mermaid@11` ESM `import` with `startOnLoad`,
  while the scaffold loads the `mermaid@10` UMD build; click callbacks need
  `securityLevel: 'loose'`, which the guide never mentions.
- [residue] Below ~450 px the diagram (even top-to-bottom) scales node text to about 10 px.

## microsim-technology-stack

```
Instructional Design Check:
- Bloom Level: Understand
- Bloom Verb: describe
- Recommended Pattern: clickable layered infographic with role, code sample, dependency hover,
  and a "Break it" failure preview (no animation)
- Specification Alignment: aligned
- Rationale: describing each layer's contribution is easiest to check by removing it; the
  preview makes each contribution concrete (unstyled, empty, error, or no simulation).
```

- [spec-gap] "The browser shown as a frame around the top" - chose a browser window frame
  around the five in-browser layers, with the CDN outside it and an arrow "delivers p5.js over
  the internet" into the library layer.
- [spec-gap] "Layers it depends on" not defined. Chose direct dependencies: iframe -> HTML5;
  CSS -> HTML5; JavaScript -> HTML5, library; library -> HTML5, CDN; HTML5 and CDN -> none.
- [spec-gap] What each broken state looks like was only sketched ("unstyled or blank"). Chose:
  no iframe = chapter text with no simulation; no HTML5 = 404 box; no CSS = serif, no
  background/border, default margin; no JavaScript = only the "Back to Lesson Plan" link;
  no library = blank + "ReferenceError: createCanvas is not defined"; no CDN = failed GET plus
  the same ReferenceError.
- [spec-gap] Canvas height unspecified; chose drawHeight 510 + controlHeight 50 = 560 so the
  narrow (<600 px) stacked layout fits.
- [decision] Selecting a different layer restores a broken one (one experiment at a time).
  JavaScript is preselected so the panel is filled on load.
- [decision] In the narrow layout the preview replaces the code sample while a layer is broken
  (not enough height for both).
- [decision] `textFont('serif'/'monospace')` is used only inside the mock preview and code box to
  depict unstyled pages and code; the sim resets to 'sans-serif'. The skill's "do not call
  textFont()" rule has no exception for this kind of depiction.

## author-to-learner-workflow

```
Instructional Design Check:
- Bloom Level: Understand
- Bloom Verb: summarize
- Recommended Pattern: static top-to-bottom workflow with click-to-reveal command/tool and
  failure mode per step, arrow-hover artifact tooltips, and a phase color key
- Specification Alignment: aligned
- Rationale: summarizing a path needs the whole sequence visible at once; per-step detail on
  demand keeps the diagram uncluttered while supporting the summary.
```

- [spec-gap] Commands, tools, failure modes and arrow artifacts were not listed; wrote them from
  the chapter's Publishing section (mkdocs serve, git add/commit/push, mkdocs gh-deploy,
  GitHub Pages, relative-path rule, iframe height, CDN offline).
- [spec-gap] The spec's order puts "Push to GitHub" before "mkdocs gh-deploy builds the site", but
  gh-deploy builds from the local working copy, not from what was pushed. Kept the spec's order
  and made the Push->Deploy tooltip say so ("gh-deploy builds from your local copy").
- [spec-gap] Info panel position unspecified; used the mermaid guide's side panel (58% diagram /
  42% panel), moving below the diagram under 560 px. Added a phase color key (authoring,
  version control, publishing, learner), which the spec did not ask for.
- [decision] Arrow hover uses transparent 22 px-wide cloned paths (Mermaid edges have no hover
  or click directive) and a custom tooltip div.
- [decision] Skipped the guide's "Y-follow" info card: the panel content starts at the top and is
  fully visible at 600 px.
- [residue] Below ~560 px the 7-step diagram shares the height with the panel, so node text
  scales to about 9-10 px.

## which-kind-of-object-classifier

```
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: distinguish
- Recommended Pattern: drag-to-bin sorting with property-based corrective feedback and a
  first-try score
- Specification Alignment: aligned
- Rationale: distinguishing four nested categories requires the learner to find the one
  property that separates neighbors; feedback names that property instead of just "wrong".
```

- [spec-gap] Only four of the twelve cards were given; wrote the other eight (three per
  category) consistent with the chapter's examples.
- [spec-gap] "Shows the property that the example is missing" only makes sense when the learner
  over-classifies. For an under-classification (e.g. an instrumented MicroSim dropped into
  MicroSim) the feedback names the extra property the example has instead.
- [spec-gap] Whether Next is available before a correct placement was unspecified. Chose: Next is
  disabled until the card is placed correctly; after 12 cards a summary shows first-try
  accuracy and Next becomes Shuffle.
- [spec-gap] Canvas height unspecified; chose drawHeight 440 + controlHeight 50 = 490.
- [decision] Added keys 1-4 as a keyboard alternative to dragging (accessibility), and a small
  property reminder and tally in each bin.
- [skill-gap] Routing: the spec is a drag-and-drop sorter, but the concept-classifier guide (the
  route for "classify / sort") describes a multiple-choice quiz with hints, a mascot, a
  `data.json` loaded with `await loadJSON()` in p5 2.x `async setup()`. None of that fits
  p5 1.11.10 or drag-to-bin, so this was built from the p5 guide. The concept-classifier guide
  could mention a drag-to-bin variant. Also, its "Template Files" section says the templates are
  in "this skill's `assets/concept-classifier/` directory" while the SKILL.md routing text points
  to `assets/templates/` for the other guides; it took a directory listing to find them.
- [skill-gap] validate-sims.py's p5 "manual hit-testing" heuristic would flag any canvas-drawn
  interactive target (cards, layers) if the sim had no createButton; both p5 sims in this batch
  pass only because they also have one builtin button. Drag targets and clickable diagram
  regions are legitimate canvas interactions, not "manually drawn controls".

## microsim-directory-explorer

```
Instructional Design Check:
- Bloom Level: Understand
- Bloom Verb: explain (and predict which file to edit)
- Recommended Pattern: click-to-inspect file tree (contains / who reads it / typical change)
  plus a "Which file?" prediction quiz with explanatory feedback
- Specification Alignment: modified (file names stay visible in the quiz)
- Rationale: predicting the file to edit is the transfer task; the quiz must test file roles,
  not memory of box colors.
```

- [decision] The spec says "Which file?" hides the labels. With the file names hidden, the task
  becomes remembering which color is which file, which does not test the objective. The quiz
  keeps the file names visible and instead hides the one-sentence job tooltips, so the learner
  must recall each file's role.
- [spec-gap] Only two change requests were given; wrote 12 (2-3 per file). A round is 6 requests:
  one per file plus one extra, shuffled. Score = correct / attempts, plus first-try count.
- [spec-gap] "Add a learning objective" (a spec example) is ambiguous: objectives appear in both
  metadata.json and index.md's lesson plan. Reworded to "Add a learning objective that catalog
  searches can filter on" (metadata.json).
- [spec-gap] Behavior when the learner clicks the root folder in the quiz was not specified;
  it gives a hint without counting an attempt.
- [decision] Five children in one row do not fit the ~430 px network area at a readable size,
  so the files sit on two staggered rows (main.html, index.md, h-bridge.png above;
  h-bridge.js, metadata.json below). The tree is still root-on-top with plain edges and physics
  off. Node labels use Arial rather than monospace to save width.
- [decision] Navigation buttons shown only in the wide layout (as in the family tree).
