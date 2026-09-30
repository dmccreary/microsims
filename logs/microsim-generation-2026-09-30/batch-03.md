# Batch 03 gap notes

Sims: design-checkpoint-navigator, microsim-type-catalog-explorer, type-routing-decision-tree,
routing-score-workbench, choose-the-type-challenge, generator-skill-anatomy-explorer,
batch-generation-workflow-stepper, spec-block-anatomy-explorer.

## Batch-wide findings

- [skill-gap] `test-iframe-heights.py` (TESTER) calls `p.chromium.launch(headless=True)` with no fallback. On this
  machine Playwright's bundled `chromium_headless_shell-1243` is not installed, so the tester crashes before
  testing anything. `bk-capture-screenshot` already falls back to `channel="chrome"`; the tester should too.
  Workaround used (no edits to ibook-skills): `scratchpad/b03_tester.py` monkeypatches `BrowserType.launch`
  to retry with `channel="chrome"` and then `runpy`-runs the unchanged tester.
- [skill-gap] TESTER loads sims as `file://` URLs. Chromium blocks `fetch()`/XHR of `file://`, so any sim that
  loads a `data.json` (the vis-network template does; two of my p5 sims do because their specs require a JSON
  file) renders without its data during the test. The screenshot script documents exactly this problem and
  switched to a local HTTP server; the tester did not. It still passes such sims because it only measures
  control rectangles, which hides the failure.
- [skill-gap] TESTER's `extract_canvas_height()` matches `// CANVAS_HEIGHT = N` (equals sign), but SKILL.md
  Step 4.4 mandates `// CANVAS_HEIGHT: N` (colon). The declared height is therefore never found and the tester
  always falls back to measuring content. (`bouncing-ball.js` in the p5 templates also uses `=`; the SKILL.md
  and the sync script use `:`.)
- [skill-gap] p5-guide.md shows `button.mousePressed(fn)` for every button. In p5 1.x that binds `mousedown`,
  so a keyboard user who tabs to the button and presses Enter/Space triggers nothing — the guide's own
  accessibility checklist asks for keyboard support. I used `mouseClicked()` (binds `click`, which keyboard
  activation fires). The guide should recommend it.
- [skill-gap] Version conflict: the scaffold pins p5.js 1.11.10 while p5-guide.md / templates pin 2.3.2 and the
  concept-classifier guide says loading must use `async setup()` because 2.x removed `preload()`. I kept the
  scaffold pin (brief: keep scaffold versions) and avoided `preload()`/`loadJSON()` entirely, loading JSON with
  plain `fetch()` in `setup()`, which behaves the same on 1.x and 2.x.
- [skill-gap] Lifecycle states: `validated` is derived by `extract-sim-specs.py` from a `quality_score` in
  index.md frontmatter, but `validate-sims.py` only prints scores and never writes `quality_score`. Nothing in the
  pipeline sets it, so no sim can reach `validated`/`deployed` unless someone copies the score by hand (I did,
  per the brief).

## batch-generation-workflow-stepper

```text
Instructional Design Check:
- Bloom Level: Understand
- Bloom Verb: explain
- Recommended Pattern: step-through with concrete data (Next/Previous), optional predict-first gate
- Specification Alignment: aligned (spec already asks for a step-through and a Predict first mode)
- Rationale: an "explain" objective is served by seeing each step's real command, input, output and
  lifecycle state one at a time; predicting the actor before the reveal makes the learner commit to an
  explanation. No animation is needed — nothing in the concept changes continuously.
```

- [spec-gap] "The eight steps listed above" name several tools per step (step 6 has three scripts, step 8 has a
  script plus agent review). The spec says scripts are steel blue, the creative step orange and "the human
  checkpoints" green but does not say which steps are human checkpoints. I chose step 3 (instructional design
  checkpoint — the agent asks the author on a mismatch) and step 8 (layout review — stops after three cycles and
  reports residue to a person), matching the chapter's "Human in the Loop" section.
- [spec-gap] Lifecycle bar: the spec says it "advances from specified to deployed as steps complete" but gives no
  step-to-state mapping. I followed `extract-sim-specs.py`'s actual rules: 1 specified, 2 scaffolded,
  4 implemented (.js > 50 lines), 6 validated and — because step 5 already inserted the chapter iframe —
  deployed; steps 3, 5, 7 and 8 leave the recorded state unchanged. The detail panel says so.
- [spec-gap] Default of "Predict first" not given; chose off so the default view demonstrates the workflow
  without interaction (p5 guide "progressive disclosure").
- [spec-gap] In Predict first mode the command line gives the answer away (a `.py` name means "script"), so the
  sim also hides "Command or action" and "Why this actor" until the prediction is made.
- [spec-gap] No canvas height given. Chose drawHeight 540 + controlHeight 80 = 620. The height is set by the
  narrow (<600 px, two-row) layout; at desktop widths the detail panel has ~120 px of spare space. The panel
  auto-shrinks its font from 15 px to 12 px when the text would overflow.
- [decision] Added a color legend and printed the actor word ("script"/"agent"/"human") in each box so the
  encoding does not rely on color alone (p5 guide accessibility checklist); not in the spec.
- [decision] On narrow screens the "Purpose" line is dropped from the panel once the actor is revealed (it is
  still in the hover tooltip) so the panel fits.

## generator-skill-anatomy-explorer

```text
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: differentiate
- Recommended Pattern: explorer — trace a request, compare traces across requests, click for why
- Specification Alignment: aligned
- Rationale: differentiating the four parts requires comparing what changes between requests (guide,
  template folder) with what never changes (SKILL.md, utilities); a trace-and-compare explorer makes that
  contrast visible, and click-for-why makes the learner attend to each part's role.
```

- [spec-gap] "A counter shows how many of the skill's guides were loaded out of the total shown" — the spec does
  not say how many guides to show. I show all 17 real guides (16 `*-guide.md` + `html-table.md`) as small squares;
  the counter reads "Guides loaded: 1 of 17". Grey squares are the spec's "boxes that are not read".
- [spec-gap] "The utilities used" is not defined per request. Every single-MicroSim request uses the Step 1B route,
  so all six requests run the same four scripts (scaffold, validate, sync heights, nav); extract-sim-specs.py and
  add-iframes-to-chapter.py stay grey as chapter-batch-only. The why-panel says this.
- [spec-gap] The spec's six requests assume the routing *table* covers them, but "a sorting quiz" matches no keyword
  in the table (closest trigger is "sort scenarios"); it is routed by the decision-tree question "Students classify
  scenarios into categories (sorting quiz)?". The why-panel for SKILL.md explains this for that request.
- [spec-gap] The folder tree puts the utilities under the skill, but the scripts live in a separate folder
  (`ibook-skills/src/microsim-utils`). The tree draws that branch dashed and labels it "(separate folder)". The
  concept-classifier templates live in `assets/concept-classifier/`, not `assets/templates/`; shown as a dashed square.
- [spec-gap] Layout/height not specified. Chose drawHeight 480 + controlHeight 80 = 560 (two control rows so the
  Request select and the buttons fit at 400 px). Under 500 px the tree stacks full-width and the why panel replaces
  the context box while open.
- [spec-gap] data.json contents: the spec only says "the number of template files". I stored each template folder's
  path and file list (count = list length) as read from the skill on 2026-09-30. Guide line counts and trigger words
  are constants in the JS (taken from SKILL.md / `wc -l`).
- [decision] Opens with request 1 already traced so the default view demonstrates the idea without interaction
  (p5 guide "progressive disclosure") and the gallery screenshot is informative; changing the request clears the trace.
- [decision] Used `fetch('data.json')` inside setup() rather than p5 `loadJSON`/`preload` (1.x vs 2.x difference).
  If the file cannot be read (p5 editor without the file, file:// URL) the template box shows
  "data.json could not be loaded" instead of hanging.
- [skill-gap] Defining a helper named `nf()` silently collides with p5's global `nf()` (p5 re-binds its globals over
  user functions in global mode, no warning). The p5 guide's "common bug patterns" could list reserved global names.

## spec-block-anatomy-explorer

```text
Instructional Design Check:
- Bloom Level: Analyze
- Bloom Verb: deconstruct
- Recommended Pattern: explorer with a diagnostic quiz — break the block into bands, extract, then trace
  defects back to bands
- Specification Alignment: aligned (one control added, see below)
- Rationale: deconstructing means seeing the parts and what each one decides; the simulated extraction makes
  the parts concrete, and tracing a defect back to its band tests whether the learner knows each field's job.
```

- [spec-gap] The three example specifications are described only by their flaw. I wrote them: (1) the chapter's
  Pendulum Period Explorer with an added default; (2) "Bounce Height Explainer", objective with a level but no
  verb and the non-measurable "understand"; (3) "Sine Wave Amplitude Lab" (Plotly) whose Controls sentence has
  no numbers. Stored in data.json.
- [spec-gap] The spec gives one defect example ("slider range not what I wanted") but no defect bank, no count and
  no rule for which defect appears. I wrote eight defects, one per band, each with an explanation and a hint; each
  example spec opens on the defect its flaw would cause (example 1 opens on the heading defect).
- [spec-gap] "Fields a parser would find" is not defined. I mirrored `extract-sim-specs.py` field names
  (heading_type, title, element_type, sim_id, library, status, bloom_level, bloom_verb, objective, spec_text) and
  added `numeric_values` (digits/ranges found in the body) so example 3's flaw can show up in red — the real
  extractor does not check for numbers.
- [spec-gap] What the panel shows for the "highlighted band" vs. after Extract was ambiguous. Chosen: the panel lists
  all extracted fields; clicking a band highlights that band's rows; on narrow screens (or when the defect card
  takes the room) it lists only the clicked band's rows.
- [spec-gap] Canvas height not given: drawHeight 530 + controlHeight 80 = 610. Under 600 px the bands collapse to
  one truncated line each so the stack plus panel fit; the full text is only visible at wider widths.
- [decision] Added a "Next defect" button (shown only when Show defects is on). The spec lists only a select, an
  Extract button and a checkbox, which leaves no way to move to another defect without toggling.
- [decision] Example 1 opens already extracted so the default view shows the parser output (and the screenshot is
  informative); switching examples clears the extraction so the learner predicts before pressing Extract.

## choose-the-type-challenge

```text
Instructional Design Check:
- Bloom Level: Evaluate
- Bloom Verb: justify
- Recommended Pattern: judging/sorting with a required justification (type + reason) and immediate feedback
- Specification Alignment: modified (controls moved out of the drawing region; see decisions)
- Rationale: "justify" needs a choice plus a stated reason; pairing each type with one of four reasons and
  scoring both makes the learner defend the choice, and the Not-sure response rewards recognizing when no
  single type can be defended without a clarifying question.
```

- [spec-gap] "12 type buttons, one for each type discussed in this chapter" — Chapter 4 discusses 13 types
  (p5.js, Chart.js, Plotly, Mermaid, vis-network, causal loop, Venn, vis-timeline, Leaflet, comparison table,
  image overlay, grid overlay poster, verified poster). I kept 12 by merging the callout and grid overlays into one
  "Image overlay" button (the chapter calls the grid overlay "the rectangular-zone form of the image overlay").
- [spec-gap] Card bank: spec gives three example objectives. I wrote 19 cards (15 unambiguous, 4 ambiguous, 2 reuse,
  plus one reuse *trap* — a topic match whose verb differs, taken from the chapter's "label forces vs predict a
  bounce" caution). Answers reuse the chapter's worked examples wherever one exists.
- [spec-gap] Scoring rule unspecified ("correct choices out of attempts"). Chosen: a card is correct when the type
  is the reference or the listed alternative AND the reason is one of the card's accepted reasons; on ambiguous
  cards only "Not sure" is correct. One scored attempt per card (the answer locks).
- [spec-gap] "Types most often confused" was undefined. Summary lists unordered type pairs (reference vs chosen)
  plus "Built X when a question was needed" for ambiguous cards, top five by count.
- [spec-gap] Canvas height not given. Total fixed at 700; because the button grid reflows from 4 to 2 columns,
  controlHeight is computed from the width (190 px wide, ~318 px under 600) and drawHeight = 700 - controlHeight.
- [decision] Spec places the type buttons and reason chips in the drawing region and asks for "mouse events on custom
  buttons". The p5 guide and the validator forbid drawn controls ("never draw controls with rect() + mouse
  hit-testing") and forbid controls in the drawing region. I read "custom buttons" as custom-labeled built-in
  buttons: all 19 are `createButton()` elements in the control region (keyboard-accessible, validator-clean); only
  the objective card and feedback are drawn on the canvas.
- [decision] Added a "The four reasons" definitions panel beside the feedback at widths >= 600 (fills space the
  narrow layout needs, and makes the reason chips interpretable). Not in the spec.

## design-checkpoint-navigator

```text
Instructional Design Check:
- Bloom Level: Apply
- Bloom Verb: execute
- Recommended Pattern: procedure practice on worked cases — click the path for a supplied spec, then compare
  with the recommended path and see the completed decision block
- Specification Alignment: aligned
- Rationale: "execute" means carrying out the procedure on a new case; clicking one's own path through the
  four questions and getting a step-level comparison is the Apply-level analogue of a practice problem with
  feedback. No animation is used.
```

- [skill-gap] The scaffold wired this sim's main.html to **p5.js** (library string "Mermaid with a click directive
  on every node" was unrecognized — known issue). Rewrote main.html for Mermaid.
- [skill-gap] mermaid-guide.md pins `mermaid@11` (major only, ESM import) while the scaffold for the other Mermaid
  sim pins `mermaid@10/dist/mermaid.min.js`; neither is an exact pin. I used the exact UMD build
  `mermaid@11.4.1/dist/mermaid.min.js` (the guide's major).
- [skill-gap] mermaid-guide.md never shows Mermaid's own `click` directive, even though Chapter 4's rule is "a Mermaid
  diagram is acceptable only when every node has a click directive". Needed facts I had to discover: the directive
  requires `securityLevel: 'loose'`; with `mermaid.render()` you must call the returned `bindFunctions(el)` or the
  clicks do nothing; the callback must be a global (`window.nodeClick`).
- [skill-gap] `classDef` styles are written as inline `style` attributes, so CSS highlight classes (path
  highlighting, selection) cannot override them even with `!important`. Node colors had to move from `classDef`
  into page CSS keyed by classes the script adds after rendering. The guide's classDef-everywhere advice conflicts
  with any interactive highlighting.
- [skill-gap] The guide's layout (fixed 2/3 + 1/3, `height: 100vh`, "Y-follow" hover card) does not address a fixed
  iframe height with a panel that must move *below* the diagram under 600 px. I size the diagram with
  `max-height` from the declared CANVAS_HEIGHT and shrink the panel font (14 to 11 px) until it fits, because the
  guide forbids scrollable panels.
- [spec-gap] Node definitions, examples and the four sample specifications (with paths and decision blocks) were not
  given. Samples: the chapter's Bouncing Ball Gravity Lab worked example plus three I wrote so that each sample takes
  a different route (Q2 no/Q3 no -> remove; Q3 yes/Q4 yes -> record; Q3 yes/Q4 no -> flag).
- [spec-gap] Branch semantics: the spec lists "Q3 What animation adds" but asks for yes/no edge labels. Relabeled the
  node "Q3 Can you say what animation adds?" so yes/no reads naturally; "Use step-through" continues to Q3 (the
  chapter's worked example answers all four questions even after Q2 = yes).
- [spec-gap] "Compares the path" scoring unspecified: position-by-position match count plus an explanation of the
  first step where the paths part (from each sample's per-question reasons).
- [decision] Used Mermaid's hover tooltip from the click directive for a one-line hint and the side panel for
  click details, instead of the guide's hover-driven panel (the spec asks for click).
- [decision] Canvas height 680 (toolbar + diagram at 62 % width). Residue: under 600 px the diagram is capped at half
  the height, so node text renders at about 8 px and the panel at 11 px; readable in fullscreen, small on phones.

## type-routing-decision-tree

```text
Instructional Design Check:
- Bloom Level: Apply
- Bloom Verb: use
- Recommended Pattern: procedure practice — route a supplied objective through the ordered questions, then
  compare the learner's path with the tree's path, with reasons for each "no"
- Specification Alignment: aligned
- Rationale: "use the routing questions" is applying an ordered procedure to new cases; one click at the
  stopping question forces the learner to have answered every question above it, and the highlighted
  comparison shows exactly where their routing diverged. No animation.
```

- [skill-gap] Mermaid 11 treats a label that starts with "1. " as a Markdown ordered list and renders
  "Unsupported markdown: list" in the node. Numbered question labels had to become "Q1 ...". Not mentioned in
  mermaid-guide.md's list of characters that break labels.
- [skill-gap] A 14-question yes/no chain in dagre drifts into a diagonal staircase (1,600-1,900 px wide) because each
  question centers over its two children. The guide has no advice for long decision chains. Fix used: alternate
  which child is declared first on odd/even questions so the chain zig-zags around a center line (540 px wide).
  (Row subgraphs with `direction LR` also give a straight column but cost ~1,250-1,550 px of height.)
- [spec-gap] The spec's question list differs from the skill's actual decision tree: the tree also asks about
  matrix comparisons with detail panels (html-table) and celebration/particle effects, and puts the priority matrix
  before the standard chart (matches). I followed the spec's 13 questions; the comparison-table leaf mentions the
  matrix variant, and celebration effects are omitted. Recorded in metadata limitations.
- [spec-gap] The spec says "six described objectives" but gives none. I wrote six whose first "yes" lands at
  different depths (Q2, Q3, Q4, Q5, Q9, and the all-"no" custom p5.js leaf), each with reasons for the deciding
  questions.
- [spec-gap] "Click the path they would follow" — a path in an ordered first-yes tree is fully determined by the
  stopping question, so one click on a question (or its leaf) selects the whole path; the learner's and the tree's
  paths are then highlighted together.
- [spec-gap] Leaf libraries not given for some types; chose Venn = venn.js, comparison table = custom HTML, image
  overlay = diagram.js, Python lab = Docker, verified claims = "verify claims first: verified poster route" (the
  leaf note explains the interactive-by-default policy).
- [decision] "Node text wraps at narrow widths": re-wrapping Mermaid text at a narrower wrappingWidth makes the tree
  taller, not smaller, so the diagram simply scales. Canvas height 820 (the tree is ~1,016 px tall at natural size).
  Residue: under 600 px the diagram gets 62 % of the height and node text renders at about 8 px; the infobox drops
  the node details in Try mode to fit.

## microsim-type-catalog-explorer

```text
Instructional Design Check:
- Bloom Level: Remember
- Bloom Verb: identify
- Recommended Pattern: explorer for exposure (hover = library, click = definition/data/example) plus a
  flashcard-style matching quiz for retrieval practice
- Specification Alignment: aligned (one deviation on wheel zoom, see below)
- Rationale: identifying library, data and an example objective per type is recall; seeing each type in its
  color-coded family supports encoding, and "Quiz me" (labels hidden, click the type for an objective) is
  retrieval practice with immediate feedback.
```

- [spec-gap] The spec lists the eight families but only two example types. The type list came from the chapter's
  catalog table, expanded to 18 type nodes (p5.js, celebration effects; Chart.js, bubble chart, Plotly; Mermaid,
  vis-network, Venn, causal loop; vis-timeline, Leaflet; comparison table, HTML matrix; image overlay, grid overlay
  poster; concept classifier, Docker Python lab; verified poster). Definitions, data needs, example and near-miss
  objectives were written from Chapter 4's per-type sections.
- [spec-gap] Quiz details unspecified: 18 questions (one per type, shuffled), score shown, the answer revealed with a
  green outline (wrong click in red), labels re-hidden for the next question; hover tooltips are switched off in
  quiz mode because they would reveal the library.
- [decision] The spec says "the mouse wheel zooms"; vis-network-guide.md says wheel zoom and drag-to-pan must be off
  inside an iframe (scroll hijacking) and on only when standalone. I followed the guide: wheel zoom and view
  dragging work in fullscreen; in the iframe the navigation buttons zoom and pan. Node dragging is on everywhere.
- [decision] The spec asks for "a hierarchical layout". vis-network's hierarchical LR layout placed the two-line family
  boxes "Image-based" / "Assessment and labs" / "Verified facts" on top of each other, and nodeSpacing large enough to
  separate them shrank the text to about 10 px. I compute the tree positions myself (three fixed columns, types in
  rows with a gap between families, each family centered on its types, physics off) — still a left-to-right hierarchy.
- [skill-gap] vis-network-guide.md's `fit()` guidance ignores the navigation buttons it makes mandatory: with
  `navigationButtons: true` the bottom ~60 px of the canvas holds buttons that cover nodes after `fit()`. I fit to the
  nodes' bounding boxes with a reserved bottom strip. The guide's own afterDrawing pan (+80/+20) does not solve this.
- [skill-gap] The guide's template uses unpinned `unpkg.com/vis-network/...`; the scaffold pins 9.1.9 on jsDelivr but
  omits the CSS file the guide says is needed for navigation-button icons. Added the pinned
  `vis-network@9.1.9/styles/vis-network.min.css`.
- [decision] Canvas height 660 (toolbar + 620 px network at 62 % width) so type labels render at ~13 px at 800 px wide.
  Residue: under 600 px the network gets 58 % of the height and labels render at ~7 px; fullscreen is readable.

## routing-score-workbench

```text
Instructional Design Check:
- Bloom Level: Evaluate
- Bloom Verb: justify
- Recommended Pattern: rubric scoring with criteria visible, then calibration against reference bands
- Specification Alignment: aligned (two small deviations, see below)
- Rationale: justifying a type choice means applying explicit criteria and defending a ranking; sliders over
  shaded rubric bands make every judgment a visible number, hovering shows the criterion text for the band
  chosen, the ambiguity prompt asks for the one question that would separate close candidates, and the reveal
  gives calibration feedback without claiming a single right number.
```

- [spec-gap] Bank content: the spec asks for "at least eight objectives, each with three to four candidate types" with
  author-written reference bands but supplies none. I wrote ten (the chapter's Roman Empire example, the skill's
  "graph of our project dependencies" example, and eight others), with reference bands, a good and a weak clarifying
  question each, and a one-line reference note. Three are genuinely ambiguous (map vs timeline, network vs chart,
  choropleth map vs line chart).
- [spec-gap] "Hovering a bar shows the guideline text that supports that candidate" — showing the guideline for the
  reference band would give the answer away. I show the routing-criteria.md guideline for the band the learner's
  current score is in (so dragging the slider lets them read what each band means for that generator) and add the
  reference-band guideline only after "Reveal reference bands". Guideline strings are quoted from routing-criteria.md;
  where that file has no text for a band (causal-loop 70-89 and 30-49, verified 50-69) the tooltip says so.
- [spec-gap] "Lists two candidate questions to choose from" — no rule for which is better. Each objective has one
  question that separates the candidates and one that does not; choosing gives feedback explaining why.
- [spec-gap] Canvas height not given. 680: at desktop widths the chart takes ~400 px and a fixed 172 px feedback
  area; under 600 px the sliders stack below a ~180 px chart and the reference result moves onto each slider's
  value line.
- [decision] With every slider at the default 50, the top two are "within 10 points" at load, so a literal reading
  shows the ambiguity banner before the learner has done anything. The banner appears only after the first slider
  move; before that the feedback area gives instructions.
- [decision] Band labels are drawn by the same custom plugin that shades the bands (Chart.js has no built-in band
  shading); annotations use `afterDatasetsDraw`, as chartjs-guide.md advises, so tooltips stay on top.
- [skill-gap] chartjs-guide.md pins `chart.js@4.4.0` in its text and template while the scaffold pins 4.4.4; kept
  4.4.4 (scaffold). The guide also says "Do not add any analysis or supporting documentation above or below the chart
  region", which conflicts with this spec's objective card, sliders and banner; the guide has no pattern for a
  chart-plus-controls workbench inside a fixed-height iframe.

## Layout review summary (Step 9)

| sim-id | review result |
|---|---|
| design-checkpoint-navigator | clean at 800 px; residue: node text ~8 px and panel 11 px under 600 px |
| microsim-type-catalog-explorer | fixed 2 (nav buttons covering nodes; crowded family boxes / 10 px labels); residue: ~7 px labels under 600 px |
| type-routing-decision-tree | fixed 1 (edge labels ~11 px, widened diagram column); residue: ~8 px text under 600 px |
| routing-score-workbench | fixed 1 ("Perfect" band label overflowing its band) |
| choose-the-type-challenge | clean |
| generator-skill-anatomy-explorer | fixed 1 (link line drawn over order badge 3) |
| batch-generation-workflow-stepper | clean (about 120 px of unused panel space at desktop widths, reserved for the two-row narrow layout) |
| spec-block-anatomy-explorer | clean (band text truncated to one line under 600 px by design) |

- [skill-gap] visual-checklist.md section 5 has no items for Mermaid click affordance, vis-network navigation-button
  overlap, or Chart.js custom-plugin label collisions — all three came up here. It also has no guidance for sims
  whose narrow layout legitimately needs more height than the wide one inside a single fixed iframe height (every
  sim in this batch with a "moves below under 600 px" rule hit this).
