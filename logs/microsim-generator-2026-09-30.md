# microsim-generator Improvement Report: Batch Run of 2026-09-30

Source notes: `logs/microsim-generation-2026-09-30/` (`central.md`, `batch-01.md` to `batch-14.md`, `followups.md`,
`AGENT-BRIEF.md`). All counts were computed from those notes: every `## <sim-id>` section was parsed and each tagged
bullet was hand-coded. Claims about the skill were checked against `~/.claude/skills/microsim-generator` (a symlink to
`~/projects/ibook-skills/skills/microsim-generator`) and the utility scripts. Findings are marked as follows:

- **Verified**: confirmed in the named file and line.
- **Agent-observed**: runtime library behavior an agent reported, not re-tested here.
- **Corrected**: the claim did not fully match the file; the corrected version is given.

## 1. Summary

### The run

The run built 112 MicroSims for *MicroSims 2.0*, covering chapters 1–26. Fourteen parallel agents each built eight sims
(batches 01–14).

| Libraries (spec `library` field) | Sims | Bloom levels (agents' Design Checks) | Sims |
|---|---|---|---|
| p5.js | 70 | Analyze | 37 |
| vis-network | 13 | Apply | 27 |
| Chart.js | 12 | Evaluate | 22 |
| Mermaid | 7 | Understand | 21 |
| Leaflet / Plotly / vis-timeline | 2 each | Create | 3 |
| venn.js / custom HTML-CSS-JS | 1 / 3 | Remember | 2 |

### Outcome

- **Build.** All 112 sims were built. Their `CANVAS_HEIGHT` values run from 435 to 835 px (median 602); 17 sims are
  700 px or taller.
- **Checks.** The notes report no tester failure and no validator score below 95. The tester only ran through a
  Chrome shim the agents wrote. The two sub-100 scores, 95 (timeline-item-date-explorer) and 97
  (star-rating-comparison-table), both come from validator bugs.
- **Gap notes.** There are 450 `[spec-gap]` bullets (the brief estimated about 418). Of these, 448 are about
  individual sims; every sim has 2–7 (mean 4.0). There are also 140 `[skill-gap]`/`[tool-bug]` bullets, many of them
  batch-wide or repeated, and 251 `[decision]` bullets across 107 sims.
- **Spec alignment.** Design Checks marked 20 sims "modified". A further 35 were "aligned" but noted an adjustment, so
  55 of 112 (49%) departed from the spec as written.

### Highest-value fixes, in priority order

1. **Parse the Bloom level and verb reliably.** `extract-sim-specs.py` labeled 109 of 112 sims "Create". Its fallback
   does a substring search of the whole spec, and every spec contains either "create" (as in `createSlider`, 56 specs)
   or "design" (from the "Responsive design:" paragraph, the other 56). Share one parser with
   `create-microsim-todo-json-files.py`, and add explicit `**Bloom level:**` and `**Bloom verb:**` lines to the
   chapter-content-generator spec template (sections 4.1 and 2.19).
2. **Expand the spec template** (section 2). Agents had to invent missing details: content values (91 sims), rules,
   thresholds and models (56), interaction semantics (53), narrow-width behavior (53), assessment mechanics (37) and
   canvas height (36). In addition, 34 specs contradicted themselves and 29 disagreed with their chapter, their cited
   sources or the library. New fields plus a spec lint would remove most of this guessing.
3. **Fix `test-iframe-heights.py`** (section 4.9). It needs a system-Chrome fallback, an HTTP server instead of
   `file://`, a regex that accepts the `:` form, runs at 400 and 700 px, and a content-overflow check. Today a PASS
   says nothing about narrow layouts or data-loading sims.
4. **Resolve "one fixed height, many widths"** (8 batches). Pick one design width. Document the p5 flow-layout helper
   that five batches each wrote on their own. Route DOM-layout sims to the existing postMessage protocol described in
   `microsim-utils/references/iframe-auto-height.md`.
5. **Make versions and the height comment single-sourced.** The pinned versions disagree: p5 1.11.10 vs 2.3.2,
   Chart.js 4.4.4 vs 4.4.0, Mermaid `@10` vs `@11`, Plotly 2.35.0 vs 2.27.0. The comment form also disagrees: `:` in
   SKILL.md and the sync tool, `=` in the p5 template, the tester and chapter 13. Let `shared.LIBRARY_CDNS` drive the
   scaffold, templates and guides.
6. **Stop the tools from damaging files.** `sync-iframe-heights.py` rewrites iframes inside fenced code (it broke a ch
   12 example). `update-mkdocs-nav.py` would flatten the curated nav. `add-iframes-to-chapter.py` plans duplicate
   iframes.
7. **Fill the guide holes that many agents hit.** `mermaid-guide.md` never mentions `click`, `securityLevel` or
   `bindFunctions`, although ch 4 requires a click directive on every node. The concept-classifier guide has no
   drag-to-bin variant; 7 sims needed one. The p5 guide needs: `describe()` without `LABEL`, the pause listener on
   `<main>`, a keyboard pattern, a color-blind-safe palette, and a data-loading pattern. The vis-network guide needs a
   fixed-height layout with a reserved navigation-button strip.
8. **Make `validate-sims.py` a real gate.** An untouched scaffold scores 95. The validator should fail on TODO
   placeholders and fix its nested-metadata, code-fence and library-detection bugs. It should also write
   `quality_score` to the frontmatter.

## 2. Specification Gaps → Proposed Spec-Template Fields

Every `[spec-gap]` bullet was hand-coded into one or more themes. "Sims" counts distinct sim-ids. The two batch-level
spec-gap bullets are assigned to the sim they describe. Figures in parentheses add the sims where the same gap appears
only as a `[decision]`.

| # | Theme | Bullets | Sims | Proposed field |
|---|---|---|---|---|
| 2.1 | Content and data values not supplied | 145 | 91 | `Data:` values or provenance |
| 2.2 | Rules, thresholds, models, ranges | 80 | 56 | `Model and rules:`; full control ranges |
| 2.3 | Interaction semantics | 66 | 53 | `Interactions:` event → effect → state |
| 2.4 | Assessment mechanics and feedback | 49 | 37 | `Assessment:` |
| 2.5 | Contradictions inside one spec | 38 | 34 | one `Layout:` authority; spec lint |
| 2.6 | Spec vs chapter, sources or library | 34 | 29 | `Chapter anchors:`; capability lint |
| 2.7 | Canvas height | 19 | 19 (36) | `Canvas:` |
| 2.8 | Narrow-width behavior | 19 | 19 (53) | `Narrow layout (400 px):` |
| 2.9 | Color mapping and meaning | 18 | 18 | `Color encoding:` |
| 2.10 | Labels, units, message text | 18 | 18 | `Labels and units:` |
| 2.11 | Defaults and reset | 18 | 18 | `Initial state:`, `Reset restores:` |
| 2.12 | Layout geometry and placement | 16 | 16 | single `Layout:` block |
| 2.13 | Source-of-truth pointers | 13 | 13 | `Sources:` |
| 2.14 | Objective not served by the interactions | 10 | 10 (25) | `Evidence of the objective:` |
| 2.15 | Controls placed in the drawing region | 2 | 10 (all tags) | rule + `Clickable content:` |
| 2.16 | Instrumentation | 1 | 1 (central: all) | `Instrumentation:` |
| 2.17 | Routing / Type / Library ambiguity | 2 | 2 (+5 free-text) | enumerated `Type` and `Library` |
| 2.18 | Accessibility requirement without a mechanism | 2 | 2 | `Accessibility:` |

### 2.1 Content and data values not supplied (91 sims)

This is the largest theme. Specs named the *kind* of content but not the content itself: datasets, card banks,
definitions, sample statements, places, presets. At least 22 sims asked for a bank of N items but supplied only 0–4
of them. Examples:

- **which-kind-of-object-classifier:** "Only four of the twelve cards were given"; the agent wrote the other eight.
- **type-routing-decision-tree:** the spec calls for "six described objectives" but gives none.
- **chart-type-chooser:** "no dataset values, labels, units or data questions"; the agent invented three datasets.
- **contract-violation-finder:** only the 10 violation kinds are given, not the 8 statements.
- **marker-popup-tile-map:** place and markers were "left to the author", and the coordinates were entered from memory
  (section 6.3).

**Proposed field:** `Data:` lists every value shown, *or* says "generate N items; K are given below; label them
illustrative". It also states provenance: synthetic (with seed), copied from a named path, or invented.

### 2.2 Rules, thresholds, models and ranges (56 sims)

Specs named a behavior but not its rule: stop thresholds and tolerances, inclusivity at boundaries, scoring formulas,
the model behind a slider, slider min/max/step, and degenerate cases. Examples:

- **evidence-threshold-lab:** the spec does not say whether a threshold is inclusive.
- **priority-matrix-bubble-explorer:** "The midpoint and boundary rule are not given".
- **fidelity-accuracy-base-rate-lab:** a "signal" slider has no model behind it; the agent derived a binormal
  forecaster.
- **bkt-parameter-lab:** `p_s = 0` divides by zero, and the spec does not say which estimate is compared with the
  threshold.

**Proposed field:** `Model and rules:` gives formulas, inclusivity (written as `>=`), tolerances, tie-breaks and
degenerate cases. Every control line carries `min–max, step, default, unit`.

### 2.3 Interaction semantics (53 sims)

Specs named an interaction but not its effect or the state that follows. Typical gaps: what a toggle toggles between,
what one "Step" advances, what happens to revealed answers when an input changes, and how the item a button acts on
is selected. Examples:

- **p5-sketch-lifecycle-explorer:** Step is "ambiguous between one statement per click and one frame per click".
- **timeline-item-date-explorer:** the spec does not say which event the month field edits.
- **tenant-pseudonym-explorer:** the spec does not say what changing the name or salt does after a derivation.
- **prerequisite-propagation-explorer:** "Toggle 'Threshold for mastered'" gives no values to toggle between.

**Proposed field:** `Interactions:` as a list of *event → effect → resulting state*, including what a change does
after a reveal.

### 2.4 Assessment mechanics and feedback (37 sims)

Specs asked for a quiz, a check or a score without giving the item count or draw, the attempt policy, the scoring
formula, the feedback text, or when the answer is revealed. Examples:

- **microsim-family-tree:** "Quiz size and example pool unspecified"; the wrong-answer feedback is also unspecified.
- **choose-the-type-challenge:** the scoring rule is unspecified.
- **generation-failure-mode-triage:** the retry policy is unspecified, and feedback was needed for up to 40
  case/wrong-mode pairs.
- **prompt-text-rule-checker:** the spec does not say whether an answer can be judged again.
- **fidelity-claim-sorter:** "Check all" is redundant with per-drop feedback.

**Proposed field:** `Assessment:` gives the pool size and items per round, the attempt rule, the score formula, the
feedback text (correct, incorrect, near-miss), when the answer is revealed, what is hidden during the quiz, and where
the justification is captured.

### 2.5 Contradictions inside one spec (34 sims)

The Layout, Controls, Interactions and Responsive paragraphs of a spec disagreed with each other, or its numbers
were inconsistent. Examples:

- **priority-matrix-bubble-explorer:** the list is "below the chart" in one paragraph, but moves below only "under 700
  pixels" in another.
- **metadata-section-explorer:** the infobox is given three different positions.
- **tenant-pseudonym-explorer:** Layout says drop-down; Controls says `createRadio`.
- **class-mastery-heatmap-reader:** the spec says light shading means low mastery, but the objective says dark columns
  mean struggle.
- **canvas-height-calculator:** a 200–900 slider with step 2 cannot show totals up to 1102, or odd totals.
- **fidelity-accuracy-base-rate-lab:** "step 0.01, default 0.635".
- **attempt-order-swap-lab:** "two rows of four tiles" versus a six-attempt preset.
- **layout-defect-catalog-explorer:** "defects from the table", yet one required defect is not in the table.

**Proposed fix:** one `Layout:` block owns all positions, and Responsive refers to it rather than restating it. A
spec lint checks that defaults sit on the step grid, that ranges cover computed values, that counts match the listed
items, and that every control named in Layout also appears in Controls.

### 2.6 Spec vs chapter, source files or library (29 sims)

- **Spec vs chapter.** choose-the-type-challenge asks for 12 type buttons, but ch 4 discusses 13 types.
  bouncing-ball-gravity-lab is 450 px in ch 12 but 500 px in its ch 1 spec. lite-semester-storage-estimator's model
  misses 3 of the chapter's 4 measured rows.
- **Spec vs the real system.** In guarded-call-runtime-toggle the unguarded call is said to "stop the ball", but in
  reality it throws in `setup()`. In gateway-request-simulator the chapter's §1 is `validation.py`'s §5.
- **Spec vs library capability.** quality-chain-workflow and ai-generation-pipeline ask for "a click directive on every
  edge", which Mermaid cannot do. In clickable-flowchart-anatomy, "Break it" cannot produce an error, because Mermaid
  11.4.1 parses the labels unquoted. fidelity-calibration-curve-lab asks for dashed Plotly marker outlines.
  prediction-trust-ladder needs a `<--` arrow, which Mermaid does not have.

**Proposed fix:** a `Chapter anchors:` field listing every number or claim the chapter prose makes about the sim, plus
a capability lint: no Mermaid edge clicks, no reverse arrows, no wheel zoom inside an iframe.

### 2.7 Canvas height (19 sims flagged; 36 chose a height)

Nineteen specs gave no height; 17 more sims record the chosen height only as a decision. The resulting heights run
435–835 px, and 17 sims are 700 px or taller, most of them sized by the 400 px stacked layout. Examples:

- **star-rating-comparison-table:** the spec's rule "60 px per row + 150 = 450" ignores two control rows; the sim
  needed 500.
- **choose-the-type-challenge:** the total is fixed at 700 and the control height is computed from the width.

**Proposed field:** `Canvas: CANVAS_HEIGHT <int> = drawHeight + controlHeight, sized for <400|700> px width`
(or `auto-height`).

### 2.8 Narrow-width behavior (19 sims flagged; 53 made narrow-layout decisions)

Specs said only "controls reachable at 400 px" or "panel moves below under 600 px", or described a layout that cannot
fit. Examples:

- **microsim-family-tree:** "Four boxes arranged left to right" gives about 9 px text.
- **objectives-graph-neighborhood:** 11 labeled columns are illegible.
- **verified-poster-pipeline-explorer:** a 9-node chain.
- **partition-key-simulator:** "Lane count adapts to the width" does not fit lanes that are stacked vertically.
- **gateway-request-simulator:** "collapses to a vertical list", although the steps are already a column.

**Proposed field:** `Narrow layout (400 px):` says what stacks, what hides or shortens, and the minimum font size.

### 2.9–2.12 Color, labels, defaults and geometry (16–18 sims each)

- **Color (18 sims).** prompt-text-rule-checker does not say whether "green or red" means correct/incorrect or
  safe/risky. chart-type-chooser: "Green vs amber was undefined". partition-key-simulator's one color per learner
  cannot be color-blind safe for 60 learners. bkt-parameter-lab, attempt-order-swap-lab, guess-resistance-lab and
  prerequisite-propagation-explorer asked for red/green, which conflicts with the brief's color-blind rule; agents
  substituted Okabe-Ito colors plus glyphs. Proposed field: `Color encoding:` names a palette (Okabe-Ito or
  ColorBrewer) and a redundant cue.
- **Labels and units (18 sims).** Missing readout units (bouncing-ball-gravity-lab), quadrant names
  (priority-matrix-bubble-explorer), badge meanings (star-rating-comparison-table) and error-type names
  (reuse-threshold-explorer). In loop-polarity-tracer the names "Loop A/B" give the answer away, because Loop B *is*
  the balancing loop. Proposed field: `Labels and units:`, including any strings that must appear verbatim.
- **Defaults and reset (18 sims; 13 more picked an informative default on their own).** Missing: the default of
  "Predict first" (batch-generation-workflow-stepper), the starting clause state (prompt-quality-workbench), what
  Reset restores (bkt-parameter-lab), the initial selection (prerequisite-propagation-explorer). The initial state is
  also the gallery screenshot: compact-session-folding-lab and two-browser-convergence-lab show empty columns because
  their specs require an empty start. Proposed field: `Initial state:` and `Reset restores:`.
- **Geometry (16 sims).** Missing: the detail-panel layout (timeline-item-date-explorer), panel placement
  (docker-lab-run-flow), element positions (iframe-height-test-simulator). In marker-popup-tile-map the info panel and
  the layer control both default to the top right. These are covered by the single `Layout:` block (section 2.5).

### 2.13 Source-of-truth pointers (13 sims)

Specs said "mirror X" or "use the design document" without a path, or pointed to files that exist in more than one
version. Examples:

- **gateway-request-simulator:** "mirror validation.py".
- **log-graph-compression-lab:** "the design document's estimates".
- **metadata-section-explorer:** two different H-Bridge metadata files exist.
- **faceted-filter-lab:** "drawn at build time", with no procedure given.
- **reuse-threshold-explorer:** the spec restricts data to the README, but the rationale lives in
  `find-similar-templates.py`.

**Proposed field:** `Sources:` gives each path or URL, what to take from it, and whether to copy it into the sim
folder. SKILL.md needs a matching rule (S11).

### 2.14 Objective not served by the interactions (10 sims; 25 sims added assessment)

The spec's controls could not produce the evidence its objective names. Examples:

- **star-rating-comparison-table:** there is no way to enter the "stated need".
- **p5-flowing-current-idle-pause:** no control chooses the "path".
- **prompt-text-rule-checker:** "justify" has no mechanism.
- **policy-precedence-resolver:** five layers but only three dropdowns.
- **accessibility-check-walkthrough:** two of the four checks could never fail.
- **guess-resistance-lab:** a single bar cannot compare designs.
- **clickable-flowchart-anatomy:** the objective says "four node shapes", but the diagram has three.

**Proposed field:** `Evidence of the objective:` names the learner action that demonstrates the verb and how the sim
checks it. The spec lint should also check that every noun in the objective has a matching control or display.

### 2.15 Controls placed in the drawing region (10 sims)

Nine specs placed controls where `p5-guide.md:244` forbids them:

- **choose-the-type-challenge:** "mouse events on custom buttons".
- **prompt-text-rule-checker:** a Rewrite button on each line.
- **microsim-directory-audit:** a Severity dropdown on each flag.
- **height-resolution-order-tracer:** checkboxes on each file.
- **sim-status-rule-explorer:** a "left half" control region.
- **compact-session-folding-lab:** controls in the left pane.
- **quality-score-calculator:** rubric checkboxes, which the agent kept in place.
- **classifier-scenario-builder:** a form.
- **objective-rewriter-workbench:** pick-list popups.

The tenth, **bouncing-ball-gravity-lab**, left the placement of its answer buttons open. Two more specs asked for
mouse-wheel zoom, which the skill forbids inside an iframe: microsims-milestones-timeline and
microsim-type-catalog-explorer.

**Proposed rule:** controls always live in the control region. A separate `Clickable content:` field lists the
on-canvas cards, nodes, cells and lines and what clicking each does. Create-level builders should explicitly allow form
inputs in the drawing region.

### 2.16–2.18 Instrumentation, routing and accessibility

- **Instrumentation (central finding; affects all 112 sims).** About 20 specs are *about* xAPI, but none says whether
  the sim should emit statements. generation-failure-mode-triage asked for "a single function so Chapter 17 can attach
  xAPI" but gave no verbs. Three sims log tooltip or infobox text to the console: policy-precedence-resolver,
  evidence-stream-to-prediction-pipeline and attempt-order-swap-lab. **Proposed field:**
  `Instrumentation: none | verbs, object IRIs, evidence class, concept ids`.
- **Routing (2 sims plus 5 free-text libraries).** callout-overlay-anatomy-explorer and
  evidence-stream-to-prediction-pipeline are `Type: infographic` with `Library: p5.js`, and the router sends
  "infographic" to the diagram.js guide. Five specs gave library values the scaffold does not know: "Custom HTML table
  with JavaScript", "HTML and JavaScript", "HTML and CSS", "Mermaid with a click directive on every node" and
  "venn.js". **Proposed rule:** make `Library` an enumeration that decides the route when present.
- **Accessibility (2 sims).** primm-semantic-wave-explorer requires keyboard reach for a drag interaction.
  accessibility-check-walkthrough asks for a focus ring on the canvas when Tab is pressed. Another 22 sims added
  keyboard access unasked. **Proposed field:** `Accessibility:` gives the keyboard path for each pointer action, plus
  the `describe()` text.

### 2.19 Bugs in the chapter-content-generator spec template (Verified)

- **Bloom levels.** `chapter-content-generator/references/content-element-types.md:289` says "one of six levels ...
  Remember, Understand, Analyze, Create", which omits Apply and Evaluate.
- **Bloom field format.** The template asks for a "Bloom Taxonomy" field, while this book writes
  `Learning objective (Bloom level: X; verb: Y):`. Neither form matches what `extract-sim-specs.py:55` parses.
- **Placeholder height.** The iframe placeholder hard-codes `height="500px"`.

### Proposed revised spec block

```markdown
#### Diagram: <Title Case Name>
<iframe src="../../sims/<sim-id>/main.html" width="100%" height="<CANVAS_HEIGHT+2>px" scrolling="no"></iframe>
<details markdown="1">
<summary><Title Case Name></summary>
Type: microsim | chart | diagram | network | timeline | map | table | venn | classifier | overlay
**sim-id:** <kebab-case-id><br/>
**Library:** p5.js | Chart.js | Plotly | Mermaid | vis-network | vis-timeline | Leaflet | venn.js | html<br/>
**Bloom level:** Analyze<br/>
**Bloom verb:** distinguish<br/>
**Status:** Specified

Learning objective: The learner will <verb> ...
Evidence of the objective: <learner action that demonstrates the verb; how the sim checks it>
Instructional rationale: <why this pattern fits; animation: none | learner-triggered | continuous (why)>

Data: <every value shown>  OR  Generate N items (K given below), label "illustrative"
Provenance: synthetic (seed S) | copied from <path/URL> | invented
Sources: <path or URL> — <what to take> — copy into sim folder: yes/no   (or: none)
Model and rules: <formulas; thresholds with >= or >; tolerances; tie-breaks; degenerate cases>

Canvas: CANVAS_HEIGHT <int> = drawHeight <int> + controlHeight <int>, sized for <400|700> px width
Layout (>= 600 px): <the only place that positions regions>
Narrow layout (400 px): <what stacks / hides / shortens; minimum font px>

Controls (control region only):
- Slider "<label>" <min>–<max>, step <s>, default <d>, unit <u>
- Button "<label>" → <effect>
- Select "<label>" [<options>], default <d>

Clickable content (drawing region): <cards / nodes / cells / lines> → <effect>; keyboard: <keys>
Interactions: <event> → <effect> → <resulting state>; changing inputs after a reveal does <...>
Initial state (also the screenshot): <what is selected / visible on load>
Reset restores: <...>

Assessment: none | pool N, K per round, shuffled; attempts <rule>; score <formula>;
  feedback: correct "<...>", incorrect names <...>, near-miss "<...>"; reveal <when>;
  hidden during quiz <labels, tooltips>; justification: in-sim picker | lesson plan
Color encoding: <variable> → <palette name> + redundant cue <glyph | shape | word>
Labels and units: <axis and readout units; verbatim strings>
Accessibility: <keyboard path for each pointer action>; describe(): "<text>"
Instrumentation: none | verbs <...>, object IRIs <...>, evidence class <...>, concept ids <...>
Chapter anchors: <numbers or claims the chapter prose states about this sim>
</details>
```

## 3. Skill and Guide Gaps

Items are deduplicated and grouped by file; "bNN" is the batch that raised each one. Known issues from the brief
appear once, marked (known).

### 3.1 SKILL.md

- **S1. The UTILS path is wrong (known).** Where: line 54 sets `$HOME/Documents/ws/ibook-skills/src/microsim-utils`,
  and the fallback on line 67 also misses. Fix: resolve the path from the skill's symlink target or `$BK_HOME`, and
  fail loudly if it is not found. Status: Verified.
- **S2. `$BK_HOME` is referenced but never set (known).** Where: lines 684, 753 and 805. Fix: derive it the same way
  as S1. Status: Verified.
- **S3. "Write ONLY the .js file" contradicts the guides.** Where: Step 4.3, lines 432–434. The Mermaid, vis-network,
  Venn, html-table, comparison-table and Chart.js guides all need `main.html` markup, `style.css` or `data.json`, and
  `chartjs-guide.md:88-96` lists no `.js` at all. Raised by: b02, b04, b05. Fix: "Write `<sim-id>.js`; adapt
  `main.html` as the guide requires, keeping the schema meta tag and `<main>`; embed data in the `.js` unless the spec
  requires a file." Status: Verified.
- **S4. The `CANVAS_HEIGHT` comment syntax differs across sources.** Where: Step 4.4 (line 449) requires
  `// CANVAS_HEIGHT: N`, but `assets/templates/p5/bouncing-ball.js:2` uses `=`. The tester reads only `=`, and ch 13
  (lines 347–349) tells readers to write `=`. Raised by: b02, b03, b05, b08. Fix: make the tester accept `[:=]`,
  standardize on the colon, and fix the template and ch 13. Status: Verified.
- **S5. The Step 6C repair rule conflicts with ch 13.** Where: line 710 says to use the "suggested height minus 10".
  The tester's suggestion is already content + 10, rounded up, and ch 13 sets the iframe to the suggestion. Raised by:
  b08. Fix: set `CANVAS_HEIGHT = suggested − 2`. Status: Verified.
- **S6. The per-library height table assumes a wide layout.** Where: lines 455–465 (for example "Chart.js ... 505"),
  but two stacked charts need 660–700 px. Raised by: b12. Fix: label the values as desktop-only and point to S7.
  Status: Verified.
- **S7. The skill never says which width a fixed height is designed for.** Raised by: central plus b03, b04, b05, b07,
  b10, b12, b13, b14. At least 20 sims report spare space at wide widths, and many DOM sims outgrow their iframe below
  600 px. Fix: declare 400 px as the design width, use the flow layout for p5 (P7), require `iframe-auto-height.md`
  for DOM sims, and test at two widths. Status: Verified. Neither SKILL.md nor `canvas-height-strategy.md` mentions
  width.
- **S8. Step 3.4 says "Ask user" and has no batch-mode rule.** Where: lines 235–240. The brief had to override this
  step. Raised by: b10 applied it; b05 and b13 checked it. Fix: in non-interactive runs, apply the step-through
  recommendation and record it in the Design Check. Status: Verified.
- **S9. Routing has four gaps.** Drag-to-bin: "classify / sort" routes to a guide that only covers multiple choice.
  Seven sorters were built from the p5 guide instead: which-kind-of-object-classifier, bloom-objective-sorter,
  three-verb-classifier, evidence-class-sorter, fidelity-claim-sorter, claim-bucket-sorter and
  primm-semantic-wave-explorer. Four batches raised this. Causal loops: every causal-loop diagram is sent to the
  multi-loop article workflow (b06). Type vs Library: `Type: infographic` with `Library: p5.js` is ambiguous (b06,
  b10). Sorting quizzes: "sorting quiz" matches no keyword (b03). Fix: route on `Library` when it is present, and add
  drag-to-bin and single-CLD routes. Status: Verified (routing table at lines 257–275).
- **S10. The `textFont()` rule has no exception for code panes.** Where: line 969. Six sims needed monospace for code,
  JSON or console panes. Raised by: b02, b04, b09. Fix: allow the generic `monospace` and `serif` families. Status:
  Verified.
- **S11. Nothing covers specs that cite external source files.** Raised by: b12, whose agents found the files in
  `~/projects/learning-record-store` by chance. Fix: add a rule to read `Sources:` and never invent the values it
  names. Status: Verified (the guidance is absent).
- **S12. Instrumentation is absent.** Where: "instrumented" appears only for posters and overlays (lines 320 and 418);
  xAPI is never mentioned. Raised by: central. Fix: add a step keyed to the spec's `Instrumentation:` field. Status:
  Verified.
- **S13. The template-folder list is incomplete (low severity).** Where: the concept-classifier templates live in
  `assets/concept-classifier/`, but line 1039 lists only `assets/templates/`. Raised by: b01, b03. Status: Verified.
- **S14. The "score ≥ 85" gate is meaningless.** Where: the rubric (lines 606–616) only checks that sections are
  present, so an untouched scaffold scores 95. Raised by: b06. Fix: see section 4.7. Status: Verified.
- **S15. Step 7 makes `update-mkdocs-nav.py` mandatory and says "Do NOT manually edit".** Where: lines 715–740. The
  tool flattens curated navs (section 4.8). Fix: make the step additive or optional. Status: Verified.
- **S16. Step 8 has no readiness hook and always captures the default state.** Raised by: b04, b08, b13. Fix: see
  section 4.10. Status: Verified.

### 3.2 p5-guide.md

- **P1. The p5 version conflicts with itself and with the scaffold.** Where: lines 590–591 and
  `assets/templates/p5/main-template.html:8` load p5@2.3.2. The "HTML Structure (REQUIRED)" section (lines 897–930)
  loads cdnjs 1.7.0 and adds `padding: 20px` and an `<h1>` inside `<main>`. The scaffold pins 1.11.10
  (`shared.py:127`), and ch 6 teaches 2.3.2. Raised by: b01, b02, b03, b04, b12. Status: Verified.
- **P2. `describe(text, LABEL)` renders visible text under the canvas (known).** Where: line 273, and `CLAUDE.md:57`.
  `<main>` ends up 55–200 px taller than the canvas, which inflates the tester's measurements. Raised by: b06, b07,
  b08 and b13 reported it; b09, b10 and b12 switched to `describe(text)`. Fix: use plain `describe(text)`, and add
  `main canvas { display: block; }` to remove a 4 px descender gap (b11). Status: Verified.
- **P3. The pause-when-idle pattern freezes the sim when the pointer reaches a control.** Where: lines 527–575 attach
  `canvas.mouseOver/mouseOut`. The controls are siblings of the canvas, so pointing at a slider pauses the sim. Raised
  by: b01, b12. Fix: listen for `mouseenter`/`mouseleave` on `<main>`, and exempt short learner-triggered animations.
  Status: Verified (pattern).
- **P4. Buttons don't respond to the keyboard.** Where: line 516 wires every button with `button.mousePressed()`. b03
  reports that this binds `mousedown` in p5 1.x, so Enter or Space does nothing. Fix: use `mouseClicked()`. Status:
  pattern Verified; behavior agent-observed.
- **P5. The guide has no pattern for loading data.** Where: nowhere in the guide; p5 2.x removed `preload()`, and
  `loadJSON` behaves differently in 1.x and 2.x. Raised by: b03, b04, b07. Fix: document `fetch()` in `setup()`, then
  `redraw()`, with a visible loading or error state. Note that the p5 editor needs `data.json` uploaded alongside the
  sketch, and that the tester needs HTTP. Status: Verified.
- **P6. The named-colors rule blocks color-blind-safe palettes.** Where: lines 236–237 say "Always use named colors
  ... Never use a hex representation", but no CSS named colors form a color-blind-safe palette. Seventeen sims used
  Okabe-Ito or ColorBrewer colors as RGB arrays. Raised by: b07, b10, b12. Fix: allow named palette constants. Status:
  Verified.
- **P7. The layout formulas assume a fixed number of control rows.** Where: lines 347–365. Raised by: b10, b11, b12,
  b13 and b14 each wrote the same helper. Fix: document the flow layout: measure each control after its first
  `position()` call, wrap controls into rows, then set `controlHeight = rows × h + pad` and
  `drawHeight = canvasHeight − controlHeight`. Status: Verified.
- **P8. Checkboxes and radios measure at full page width.** Where: `createCheckbox()` and `createRadio()` return block
  `<div>`s whose `offsetWidth` is the full page width until `.position()` is called. Raised by: b02, b10, b11, b13,
  b14. Fix: add this to "Common Bug Patterns" (line 745): position the element first, or use `inline-block` /
  `max-content`. Status: agent-observed; its absence from the guide is Verified.
- **P9. p5 globals silently shadow user names.** Where: user helpers named `nf()` (b03) and `shorten()` (b09), and a
  constant named `RIGHT` (b14), collided with p5 globals. Fix: list the reserved names. Status: agent-observed.
- **P10. The guide has no keyboard pattern for canvas content.** Where: keyboard support appears only in checklist
  lines 966 and 1098. Twenty-two sims added keyboard access anyway. Raised by: b09, b14. Fix: document the pattern:
  `tabindex="0"`, `keydown` handled on the canvas rather than the page, arrow keys plus Enter/Space, and Tab allowed
  to leave. Status: Verified.
- **P11. Clickable content is treated as drawn controls.** Where: lines 827–830 and the validator heuristic count
  clickable cards, lines and nodes as forbidden "drawn controls". Raised by: b01, b04, b14. Fix: define clickable
  content separately from controls. Status: Verified.
- **P12. The "no controls in the drawing region" rule (line 244) cannot hold for every spec.** Where: Create-level
  builders with forms, and checkbox lists. The guide also needs advice on DOM/canvas stacking order, because canvas
  tooltips render under DOM controls. Raised by: b07, b08. Status: Verified.
- **P13. Small layout helpers are missing (agent-observed).** `text(s, x, y, w, h)` does not report the wrapped height
  (b11). DOM labels need a smaller font below 480 px (b09). Rows mixing checkboxes and selects need alignment CSS
  (b14). DOM labels are raw HTML, so `<` and `>` must be escaped (known; b08).
- **P14. The `sliderLeftMargin` default disagrees (low severity).** Where: 140 in the guide (lines 259 and 473), 160
  in the template (`bouncing-ball.js:30`), 105 in `CLAUDE.md`. Raised by: b04. Status: Verified.
- **P15. A link is dead.** Where: line 631 links `https://p5js.org/migration-guide/`, which returned 404 on
  2026-09-30. Raised by: b04. Fix: link `https://github.com/processing/p5.js-compatibility` (returns 200). Status:
  Verified.
- **P16. The control budget is unrealistic.** Where: line 81 sets "Total controls 1-5", but real specs name 7 controls
  (p5-vector-particle-lab) or 12 (storage-meter-pressure-lab), and the guide gives no advice for that. Status:
  Verified.

### 3.3 chartjs-guide.md and bubble-guide.md

- **C1. The Chart.js pin differs from the scaffold.** Where: the guide pins `chart.js@4.4.0` (lines 106, 392 and 640,
  and template line 8); the scaffold pins 4.4.4 (`shared.py:130`). Agents split between the two, so the sims now
  differ. Raised by: b03, b04, b05, b12, b13. Status: Verified.
- **C2. A rule conflicts with workbench specs.** Where: line 11 says "Do not add any analysis or supporting
  documentation above or below the chart region", but workbench specs need readouts: routing-score-workbench,
  class-dashboard-load-estimator and lite-semester-storage-estimator. Raised by: b03, b13. Fix: limit the rule to
  prose. Status: Verified.
- **C3. The template doesn't match the page conventions.** Where: the template has no `<main>` and loads
  `chartjs-plugin-datalabels@2` without a full version pin (line 9). Step 3 lists no `.js` file. Raised by: b04.
  Status: Verified.
- **C4. The guide has no fixed-height layout pattern.** Where: the guide recommends `maintainAspectRatio: true` (lines
  381 and 584). A fixed iframe needs a fixed-height `#app`, a `position: relative; flex: 1` wrapper and
  `maintainAspectRatio: false`. Raised by: b11, b12. b11 also saw Chart.js fail to resize during screen capture
  (agent-observed). Status: Verified.
- **C5. The guide has no reference-line or accessible-table pattern (agent-observed).** Where: labels at line ends
  collided with bars, and an `.sr-only` `<table>` overflowed by 150 px, because `overflow: hidden` does not clip
  tables. Raised by: b14.
- **B1. Quadrant shading is drawn in the wrong hook.** Where: bubble-guide lines 121 and 345 shade in `afterDraw`,
  while chartjs-guide line 566 says to use `afterDatasetsDraw`. Shading drawn after the datasets tints the bubbles.
  Raised by: b05. Fix: shade in `beforeDatasetsDraw` and draw labels in `afterDatasetsDraw`. Status: Verified.
- **B2. The axis range and iframe height conflict with other rules.** Where: bubble-guide `min: -0.5, max: 10.5`
  (lines 120 and 328) produces half-integer ticks, which need an `afterBuildTicks` fix (agent-observed).
  `height="900"` (lines 174 and 280) conflicts with `CANVAS_HEIGHT` (Verified). Raised by: b05.

### 3.4 vis-network-guide.md

- **V1. The templates are unpinned and incomplete.** Where: the inline template (lines 317–330) and
  `assets/templates/vis-network/main-template.html:8` load an unpinned `unpkg.com/vis-network`, and neither has
  `<main>`. The navigation-button CSS (lines 940–941) is also unpinned. Raised by: b01, b02, b03, b09. Corrected: b09
  said the template lacks a schema meta tag. Only the inline template does; the asset template has it on line 6.
  Status: Verified.
- **V2. The mandatory `navigationButtons: true` covers nodes.** Where: lines 106, 174, 211, 283 and 713. At narrow
  widths the buttons cover nodes, and `fit()` doesn't reserve their strip (about 60 px). Raised by: 8 batches. Fix:
  allow hiding the buttons below 600 px, and add a fit helper that reserves the strip. Status: Verified.
- **V3. `fit()` ignores curved edges, edge labels and overlays drawn in `afterDrawing` (agent-observed).** Raised by:
  b07, b13. The fix was `moveTo()` with known bounds, or an invisible padding node.
- **V4. The guide assumes a full-page layout.** Where: `height: 100vh` (line 419) plus an absolute right panel. Specs
  keep asking for "panel below under 600 px" inside a fixed iframe. Raised by: b07, b09, b11, which reused b01's
  `#app` flex pattern. Fix: add that pattern to the guide. Status: Verified.
- **V5. Pitfalls to add (agent-observed).** `font.vadjust` moves an edge label's text but not its background (b01). A
  per-node `color` is lost to the group palette after `setOptions` (b05). The overlay legend hits the top node of a
  top-down hierarchy (b11). An edge label can be wider than the gap between its nodes (b07). There are no recipes for
  background bands, a minimum label size, or drag-to-region quizzes (b11).

### 3.5 mermaid-guide.md

- **M1. The click directive is undocumented.** Where: the guide's 1,024 lines contain no mention of "click",
  `securityLevel` or `bindFunctions`, although ch 4 requires a click directive on every node. Raised by: b01, b03,
  b05, b08, b14. They had to discover four requirements: `securityLevel: 'loose'`, a callback on `window`, a call to
  `bindFunctions(el)` after `mermaid.render()`, and `tabindex` plus `role=button` for keyboard access. Status:
  Verified.
- **M2. Edges cannot take clicks (agent-observed).** Where: seven sims needed clickable or hoverable edges. They added
  transparent wide clones of `path.flowchart-link`, found edges by their Mermaid 10 classes `LS-<from> LE-<to>`, and
  selected labels with `.edgeLabels > g.edgeLabel` (the looser `.edgeLabels .edgeLabel` returns two elements per
  edge). Raised by: b01, b05, b08. Fix: document this pattern, and remove edge click directives from the spec
  template.
- **M3. The Mermaid version is only pinned to a major release.** Where: the guide (lines 622–624) and template (lines
  9–11) import `mermaid@11` ESM with `startOnLoad`; the scaffold loads a floating `mermaid@10` UMD build
  (`shared.py:131`). Sims ended up on 10.9.8 or 11.4.1. Raised by: five batches. b05 also found ESM awkward for
  classic scripts that call `render` or `parse`. Fix: pin an exact UMD build. Status: Verified.
- **M4. `classDef` blocks interactive highlighting.** Where: the guide uses `classDef` throughout (lines 143–213). Its
  styles become inline styles that CSS highlight rules cannot override. Raised by: b03, b05. Fix: apply colors as CSS
  classes after rendering when nodes must be highlighted. Status: usage Verified; effect agent-observed.
- **M5. Syntax traps (agent-observed).** A label starting with "1. " renders "Unsupported markdown: list" (b03). There
  is no `<--` arrow, so use `flowchart BT` (b14). Long yes/no chains drift into a staircase; alternate the child order
  to avoid it (b03).
- **M6. The layout assumes a full page.** Where: a fixed 2/3 + 1/3 split with `height: 100vh` (lines 651 and 659) and
  a "Y-follow" card (lines 277 and 378). Nothing covers a fixed iframe with the panel moved below the diagram. Below
  600 px, node text still renders at 7–10 px in 7 Mermaid and vis-network sims. Raised by: b01, b03. Status: Verified.

### 3.6 Other generator guides

- **PL1–PL3. plotly-guide.md.** Scope: the guide is a function plotter (frontmatter
  `name: math-function-plotter-plotly`, lines 2–3). It has nothing on data scatter plots, `Plotly.animate`,
  pixel-anchored shapes, or `scaleanchor` with `constrain: 'domain'` (b11). Plot heights: breakpoint heights of
  400/300/250 px (line 115) conflict with a single `CANVAS_HEIGHT`. Version: the template pins 2.27.0; the scaffold
  pins 2.35.0 (`shared.py:132`) (b05). Status: Verified.
- **MP1–MP4. map-guide.md and its templates.** External data: `map/script.js:31` fetches `us-states.json` from
  `raw.githubusercontent.com` at runtime, which the brief forbids. Color: the choropleth palette runs red to green
  (#8B0000 to #1a5e1a, `script.js:38-42`), which is not color-blind safe. Markers: there is no advice on keeping
  markers clear of corner controls; b06 needed `fitBounds` padding. Font: `map/style.css:19` uses 'Segoe UI', as do
  the chartjs, plotly, venn, timeline and comparison-table templates. Raised by: b06. Status: Verified.
- **T1–T4. timeline-guide.md.** Data file: the guide says `timeline.json` "in TimelineJS format" (lines 74 and 80),
  but the template fetches `data.json` (`script.js:28`). Both fail under `file://` (b01). Padding: the template pads
  the date range by a fixed 3 years (`script.js:106`), which clips edge labels at 400 px. Use
  `pad = labelHalf × span / (W − 2·labelHalf)` instead (b01, b06). Template: there is no `<main>`, and the library
  loads from unpkg. CSS (agent-observed): item colors need `!important` to override the injected `.vis-selected`
  style, and connector lines need a `z-index` fix (b06). Status: Verified except the CSS item.
- **H1. html-table.md.** Where: the guide prescribes a fetched `script.js` + `data.json` (lines 42–43 and 131), Google
  Fonts Inter (lines 82 and 192), and a `100vh` overlay panel (line 264). It gives no `CANVAS_HEIGHT` guidance and no
  `file://` fallback. Raised by: b02, b05. Status: Verified.
- **CT1. comparison-table-guide.md.** Where: the `tr::after` CSS tooltips (`comparison-table/style.css:146, 168, 192`)
  are clipped by the `overflow-x: auto` wrapper that narrow widths need. The badge greens also fail contrast with
  white text (agent-observed). Raised by: b05. Fix: use a tooltip positioned with JavaScript. Status: Verified.
- **VN1–VN2. venn-guide.md.** Resize: the handler sizes the diagram by `min(600, innerWidth − 40)`
  (`venn/script.js:84`) with no height cap, so the diagram outgrew the iframe at 800 px (Verified). Layout object
  (agent-observed): `div.datum(sets).call(chart)` returns a selection, not the layout. Regions (agent-observed): exact
  regions need clip paths and masks (b05).
- **CC1. concept-classifier-guide.md.** Where: the guide covers only multiple choice with a mascot (lines 27 and 154).
  It loads `data.json` with `await loadJSON()` in `async setup()`, which only works in p5 2.x (line 269). There is no
  drag-to-bin variant, no keyboard alternative and no inline-data option. Seven sims needed drag-to-bin (S9). Status:
  Verified.
- **CL1. causal-loop-guide.md (raised by b06).** Where: the guide covers only multi-loop articles and forbids
  per-diagram iframes (line 52). `cld-inline.js` pins `vis-network@10.0.1` (line 14) and sets `font.align: 'middle'`
  (line 166), which hid a "−" label (agent-observed). The layout templates use about ±250 world units
  (`cld-layout-templates.md:66, 101`), too wide for a 400 px iframe. Status: Verified.

### 3.7 microsim-utils references

- **U1. visual-checklist.md section 5 has only four library items (5.1–5.4).** Missing items: Mermaid click
  affordance, vis-network navigation buttons covering nodes, edge labels wider than their gap, Chart.js plugin label
  collisions, unused space in the wide layout, and a narrow layout taller than the wide one. Also: item 5.3 ("legend
  present") fails a two-bar chart whose category labels already name the bars. Raised by: b03, b07, b13. Status:
  Verified.
- **U2. The existing auto-height protocol is never used.** Where: `canvas-height-strategy.md` defines a single
  `CANVAS_HEIGHT` but no design width. `iframe-auto-height.md` (the postMessage protocol) exists, but the generator
  never references it. Raised by: central. Status: Verified.
- **U3. The two skills disagree on which scaffolder comes next.** Where: microsim-utils `SKILL.md:204` calls
  `scaffold-microsims-from-todo.py` "the natural next step", but the generator expects the output of
  `generate-sim-scaffold.py` (section 4.4). Raised by: central. Status: Verified.

## 4. Utility-Script Bugs

Severity: **High** means it corrupts files, blocks the run or voids a gate. **Medium** means it misleads.
**Low** means it is cosmetic.

### 4.1 extract-sim-specs.py (src/microsim-utils) — High

- **Symptom:** it reports `bloom_level: "Create"` for 109 of 112 sims, never extracts `bloom_verb` from this book's
  format, and the lifecycle state `validated` can never be reached.
- **Root cause:** Bloom parsing. Line 55 matches only `Bloom...Taxonomy...Level:`, but this book writes
  `(Bloom level: X; verb: Y)`. The fallback `_infer_bloom_from_text` (lines 106–133) then does a substring search of
  the whole spec, checking "create" and "design" (both mapped to Create) before any other verb. Checked against the
  112 TODO specs, the first match is "create" in 56 (`createSlider`, `createButton`, ...) and "design" in the other 56
  ("Responsive design:" appears in 111 of the 112 specs). Lifecycle.
  `validated` is derived from a frontmatter `quality_score` (lines 320–328 and 377–386) that no tool ever writes. The
  scaffold writes `quality_score: 0` (`generate-sim-scaffold.py:87`).
- **Fix:** Move `extract_qualifier_bloom()` (`create-microsim-todo-json-files.py:102-123`) into `shared.py` and use it
  in both extractors. Accept `**Bloom level:**` and `**Bloom verb:**` lines. Infer the level only from the objective
  sentence, using whole words. Add `validate-sims.py --write-score`.

### 4.2 create-microsim-todo-json-files.py (skills/microsim-utils/scripts) — Medium, fixed locally

- **Symptom:** it could not read the book's Bloom qualifier.
- **Status:** patched during this run with `extract_qualifier_bloom` (lines 102–123, called at 214–230). The patch is
  **uncommitted**; `git diff --stat` shows +89 lines.
- **Fix:** commit it, then share the parser as described in 4.1.

### 4.3 generate-sim-scaffold.py (src/microsim-utils) — High

- **Symptoms and causes:** Hardcoded audience. The scaffold writes "9-12 (High School Geometry)" (line 120),
  `"subject": "High School Geometry"` (151), `"subjectArea": "Mathematics"` (156) and
  `"TODO: Add learning objectives"` (159), and drops the spec's objective, level and verb. Silent library fallback.
  Unknown `library` strings fall back to p5 without a warning (lines 28 and 48–50). Five libraries in this book did
  so; "venn.js" got p5 with no D3 or venn.js loaded. Pin drift. `shared.LIBRARY_CDNS` (`shared.py:126-133`) disagrees
  with the guides: Chart.js 4.4.4 vs 4.4.0, Plotly 2.35.0 vs 2.27.0, and an unpinned `mermaid@10`. Missing CSS.
  `LIBRARY_CSS` (lines 136–139) omits the vis-network CSS, so the navigation buttons have no icons (b03). Wrong
  defaults. `index.md` always gets `[Edit in the p5.js Editor]` (line 96) and a 450 px iframe, even for non-p5 sims.
  Old metadata layout. The metadata uses the flat layout, which ch 2 calls the older one.
- **Fix:** Read the audience from `mkdocs.yml` or the course description, and carry the spec's objective, level and
  verb through. Map library strings with a lookup and warn on fallback. Add the p5 editor link only for p5 sims. Make
  `LIBRARY_CDNS` the single version source, and add the vis-network CSS.

### 4.4 scaffold-microsims-from-todo.py (skills/microsim-utils/scripts) — Medium

- **Symptom:** its placeholder `main.html` has no library CDN, no schema meta tag and no `<main>`, and uses 'Segoe UI'
  (line 141). Its `index.md` embeds the full spec (lines 245–249).
- **Root cause:** it is a second scaffolder with a different output contract from 4.3.
- **Fix:** merge the two scaffolders, so that the validator-shaped files from 4.3 also carry the spec, and update the
  hand-off at microsim-utils `SKILL.md:204`.

### 4.5 add-iframes-to-chapter.py (src/microsim-utils) — Medium

- **Symptoms and causes:** Duplicate iframes. The script looks only 40 lines *below* the heading (lines 129–130) and
  stops at the first `<details>`, so it plans a duplicate for ch 8's graph-viewer, whose iframe sits above its
  heading. Reused specs. It doesn't skip `**Status:** Reused` or `**Source:**` specs; lines 32–35 cover only absolute
  URLs. Heights. `--fix-heights` reads a literal `createCanvas(w, N)` (lines 74–75), and the default height is 450 px.
  Scope. There is no `--sim` or `--exclude` option (lines 226–238).
- **Fix:** also check above the heading, skip Reused specs, insert a placeholder height and let
  `sync-iframe-heights.py` resolve it, and add `--sim` and `--exclude`.

### 4.6 sync-iframe-heights.py (src/microsim-utils; identical copy in skills/microsim-utils/scripts) — High

- **Symptom:** it rewrote iframes inside fenced code. Ch 12, around line 186: a teaching example ("400 + 50 = 450 →
  452 px") was changed to 502. It was reverted by hand. Ch 1, around line 541: 452 was changed to 502. That change was
  kept and is uncommitted.
- **Root cause:** `update_iframes_in_file()` (lines 248–273) applies `IFRAME_RE` to the whole file, code blocks
  included. The script also reads only `<sim-id>.js` (line 147), while the tester globs `*.js`.
- **Fix:** skip fenced and indented code, list any skipped matches under `--dry-run`, and share one height resolver
  with the tester.

### 4.7 validate-sims.py (src/microsim-utils) — High as a gate, Medium per bug

- **(a) Library detection (known).** `detect_library()` scans all of `main.html` (`shared.py:118-121`), although its
  docstring says it checks `<script>` sources. star-rating-comparison-table was scored as a p5 sim because its text
  mentions p5.js, and got 97.
- **(b) Code-fence pairing (known).** The fence regex on line 171 only opens on a bare or `html` fence, so a `json`
  fence earlier in the page throws off the pairing and the copy-paste iframe block is missed (−5).
  timeline-item-date-explorer scored 95 for this reason, and classifier-scenario-builder had to reword its page to
  avoid the bug. Fix: accept any info string on an opening fence.
- **(c) Nested metadata.** In the `"microsim"` branch (lines 85–108), `educational` and `pedagogical` are looked up
  inside `dublinCore`, so metadata that follows the schema loses 10 points (b01, b02).
- **(d) Presence-only rubric.** An untouched scaffold scores 95 (b06). `_check_p5_conventions` gives 5 points when
  `main.html` is missing ("benefit of doubt", line 227), so an empty folder scores 5 (b08).
- **(e) Hit-testing heuristic.** The check at lines 256–272 passes only because the sims happen to also call
  `createButton()` somewhere (b01, b04).
- **(f) Missing score.** The script never writes `quality_score`.
- **(g) Second rubric.** `skills/microsim-utils/scripts/calculate-quality-score.py` implements a different 100-point
  rubric, and has uncommitted edits.
- **Fix:** Fail on "TODO" placeholders, the High-School-Geometry defaults, or a missing `<sim-id>.js` or data file.
  Fix bugs (a)–(c). Add `--write-score`. Keep a single rubric.

### 4.8 update-mkdocs-nav.py (src/microsim-utils) — High (destructive)

- **Symptom:** the dry run reports "Would replace lines 71-205 (135 lines) with 228 lines". This would flatten the
  curated subgroups into one alphabetical list, yet Step 7 marks the tool as mandatory.
- **Root cause:** `update_mkdocs_yml()` (lines 102–171) replaces the whole `- MicroSims:` block.
- **Fix:** add an additive mode that appends new sims under a named or per-chapter subgroup, and refuse to flatten
  nested groups.

### 4.9 test-iframe-heights.py (skills/microsim-utils/scripts) — High

- **Symptoms and causes:** (1) **No browser fallback (known).** `p.chromium.launch(headless=True)` (line 252) has no
  fallback, although `bk-capture-screenshot` already has one (lines 183–186). Five batches wrote the same shim. (2)
  **`file://` loading.** It loads sims from `file://` (line 139), so sims that fetch data are tested in their error
  state. Ten batches worked around it. (3) **Comment regex (known).** The `CANVAS_HEIGHT` regex accepts only `=` (line
  112). (4) **One width.** It tests only at `VIEWPORT_WIDTH = 700` (line 30). None of the narrow-width defects found
  by b12 and b13 show up there. (5) **No overflow check.** Canvases are excluded from clipping (`tag != "canvas"`,
  line 170), and nothing checks content overflow, so a sim taller than its iframe still passes. (6) **All `.js`
  files.** It globs every `*.js` file (line 107). (7) **Inflated heights.** `describe(..., LABEL)` paragraphs inflate
  the heights it suggests.
- **Fix:** Reuse the screenshot script's launcher and HTTP server. Accept `[:=]`. Add `--widths 400,700`. Compare
  `main.scrollHeight` with the iframe height. Read only `<sim-id>.js`.

### 4.10 bk-capture-screenshot (ibook-skills/scripts) — Medium

- **Symptoms:** One capture shows a "Loading snippets..." frame (b04). A Mermaid capture timed out at 30 s when about
  8 captures ran in parallel (b08). It always captures the default state, so two gallery PNGs show empty columns
  (b13). Chart.js did not resize after a layout change (b11, agent-observed).
- **Root cause:** it waits for `load` plus a fixed delay (lines 191 and 194). Picking a free port makes it safe to run
  in parallel, but it does not wait for the sim to finish loading.
- **Fix:** wait for `window.microsimReady === true`, falling back to `networkidle`. Add a `?demo=1` or `--click` hook,
  and document a concurrency limit.

## 5. Instructional-Design Observations

### How often agents deviated from the spec, and why

Design Checks marked 20 sims "modified" and 35 more "aligned" with an adjustment, so 55 of 112 sims deviated. There are
251 `[decision]` bullets across 107 sims. The main reasons, counted by distinct sims:

| Reason | Sims | Examples |
|---|---|---|
| Narrow-layout adaptations | 37 | loop-polarity-tracer, timeline-item-date-explorer |
| Assessment or feedback added so the objective is actually checked | 25 | choropleth-threshold-lab, fidelity-calibration-curve-lab |
| Accessibility (keyboard, color-blind palettes, contrast) | 24 | roadmap-status-board, pii-surface-explorer |
| Explanatory support added (model box, legend, key) | 19 | bouncing-ball-gravity-lab, clickable-flowchart-anatomy |
| Informative initial state (preselect, pre-run) | 14 | microsim-family-tree, redelivery-idempotency-lab |
| Controls added beyond the spec | 13 | spec-block-anatomy-explorer, partition-key-simulator |
| Spec content changed (label, bins, direction, defect list) | 13 | layout-defect-catalog-explorer, class-mastery-heatmap-reader |
| Controls moved out of the drawing region | 7 | choose-the-type-challenge, compact-session-folding-lab |
| Wheel zoom or scroll capture disabled | 4 | microsims-milestones-timeline, faceted-filter-lab |

### Bloom levels and interaction patterns

- **Bloom levels.** No agent changed a spec's level; every Design Check agrees with the spec. The extractor's "Create"
  labels were simply wrong (section 4.1).
- **Step 3.4 (animation for Understand objectives)** fired for 5 sims: bouncing-ball-gravity-lab and
  feedback-behavior-lab kept their animation, because the motion is the phenomenon, and added a predict-first gate.
  quality-chain-workflow and evidence-stream-to-prediction-pipeline became step-throughs. p5-sketch-lifecycle-explorer
  was already stepped in its spec.
- **Evaluate and Analyze specs without a check.** The skill's own table rejects "no feedback" at the Evaluate level,
  yet several specs had none. Agents added judgment steps to choropleth-threshold-lab and
  fidelity-calibration-curve-lab and a sequence quiz to verified-poster-pipeline-explorer. For
  prompt-text-rule-checker, redelivery-idempotency-lab and capacity-cost-explorer they moved the justification into
  the lesson plan.
- **Quizzes that tested the wrong thing.** In microsim-directory-explorer, hiding file names would have tested color
  memory. In lrs-architecture-explorer, hiding the names made the task impossible. In class-mastery-heatmap-reader, one
  question tested only one of the two patterns in the objective. In roadmap-status-board, uniform draws made the quiz
  trivial, so the agent stratified them.
- **Default views that gave the answer away.** Agents hid these so predictions stayed honest: R/B markers
  (loop-polarity-tracer); the Filter tint (evidence-stream-to-prediction-pipeline); `.py` command names
  (batch-generation-workflow-stepper); the reference guideline (routing-score-workbench); checkbox group labels
  (cognitive-load-balance-lab); JSON strings during the quiz (callout-overlay-anatomy-explorer).
- **Missing contrasting cases.** Agents added the case the concept needs: a "No key" option (partition-key-simulator),
  without which both keys always come out in order; a 2.4 s dwell act (evidence-threshold-lab); an underconfident
  scenario (fidelity-calibration-curve-lab); a second defect per variant (accessibility-check-walkthrough).
- **Recurring additions worth making standard.** Predict-before-reveal appears in 28 sims. First-try scoring appears
  in 6. comparison-poster-explorer cites ch 10's critique of correct-only counts. Keyboard alternatives to dragging
  appear in 22. Justification appears in 13, captured three ways: reason chips, a choice of clarifying question, or a
  lesson-plan activity. The spec should say which one to use.
- **Layout-review residue.** At least 20 sims have spare space at wide widths. In 7 Mermaid and vis-network sims, text still renders
  at 7–10 px below 600 px. portfolio-rubric-self-check slider rows are about 18 px tall at 400 px, below the 44 px
  touch target that ch 24 specifies.

## 6. Items for the Book Author

### 6.1 Chapter text that disagrees with the built sims or tools

- **Ch 12 (around lines 175–186, 253 and 388).** The text treats bouncing-ball-gravity-lab as `CANVAS_HEIGHT` 450. The
  built sim is 500 (iframe 502), because the ch 1 spec asks for 100 px of controls. Either switch to a hypothetical
  sim-id or update the numbers. Separately, ch 1's fenced example (around line 541) was changed from 452 to 502, and
  that change is uncommitted.
- **Ch 13.** Lines 347–349 ("The Comment Format Trap") say to write `// CANVAS_HEIGHT = N`, but SKILL.md uses a colon.
  The worked example sets the iframe to the tester's suggestion, but SKILL.md Step 6C subtracts 10. The "cheapest fix"
  example names one section, but three checks tie at +5. The rubric table omits the script's gates (a blank folder
  scores 5).
- **Ch 6.** The text says the template loads p5.js 2.3.2, but the sims pin 1.11.10.
- **Ch 4.** choose-the-type-challenge asks for 12 type buttons, but the chapter lists 13 types (the agent merged the
  overlays). The chapter also requires a click directive on every Mermaid node, which the Mermaid guide does not
  support.
- **Ch 5.** clickable-flowchart-anatomy's end node is now "Publish (add to chapter)", but the chapter says "Publish".
  The table's curveVertex row ("rely on endShape(CLOSE)") only works for closed shapes.
- **Ch 12, iframe-resize-message-stepper.** The p5 snippet uses a `+ 10` border allowance; diagram.js uses `+ 30`.
- **Ch 16.** The slider statement omits actor, context and timestamp, and there is no `experienced` example.
  xapi-statement-field-explorer filled these in with values labeled illustrative.
- **Ch 17.** The chapter is right that an unguarded call means the sketch never draws. The spec's "stops the ball on
  slider move" is wrong.
- **Ch 19.** The cohort generator isn't published, and its rule "learning draw only while unmastered" changes every
  number: a variant gives base rate 0.605 and AUC 0.792. The four-row calibration table corresponds to five
  equal-width bins with the empty bin dropped. The spec said 4 bins; the sim defaults to 5.
- **Ch 20.** "10k × ~4 edges" gives 40,000, not the stated ~50,000 graph writes/s. The rule against a fragment IRI
  typed as a Page is §5 in `validation.py` but §1 in the chapter's table.
- **Ch 21.** Heatmap shading: the objective and the chapter say dark means struggle, but the spec's Layout paragraph
  and `teacher_app.py` say dark means high mastery. The sim uses dark = low (one function, `cellColor()`).
  failure-boundary-explorer: the spec says failures "before the line can lose data", but the chapter says only an
  unreachable Kafka can.
- **Ch 22.** The spec's storage model (× 980 B, / 10) misses 3 of 4 measured rows. The sim shows the measured rows for
  design cases.
- **Ch 24.** The chapter targets WCAG 2.1 AA; the brief said 2.2, and the page follows the chapter. The 44 px touch
  target is missed by portfolio-rubric-self-check at 400 px.
- **Ch 25.** roadmap-status-board's three labels do not cover the chapter's "Partly built" rows.

### 6.2 Decisions needed

1. **p5.js version.** Pin p5.js book-wide, at 1.11.10 or 2.3.2, and align ch 6, the guide, the templates and the
   scaffold.
2. **CDN versions.** Normalize them: Chart.js 4.4.0 vs 4.4.4 (the sims already differ), Mermaid 10.9.8 vs 11.4.1, and
   Plotly 2.27.0 vs 2.35.0.
3. **Height comment and repair rule.** Choose one `CANVAS_HEIGHT` comment form and one tester repair rule, then edit
   ch 13 to match.
4. **Heatmap shading.** Choose the shading direction for class-mastery-heatmap-reader.
5. **Choropleth.** For choropleth-threshold-lab, switch to a ColorBrewer sequential palette and vendor
   `us-states.json`. Vendoring needs a download, which requires your approval.
6. **Tall sims.** Decide whether to adopt postMessage auto-height for the 17 sims that are 700 px or taller. The
   tallest are classifier-scenario-builder (835), type-routing-decision-tree (820), contract-violation-finder (800)
   and pii-surface-explorer (790).
7. **Spec additions.** Accept or revert each of these (sim → addition): verified-poster-pipeline-explorer → a
   sequence quiz and a select for "skip a step"; docker-lab-run-flow → two extra failures, "Diagnose first" and a
   Mystery mode; comparison-poster-explorer → first-try scoring; classifier-scenario-builder → a defensibility
   checkbox; policy-precedence-resolver → a fourth dropdown; evidence-threshold-lab → a 2.4 s dwell act;
   evidence-stream-to-prediction-pipeline → a stepper; partition-key-simulator → a "No key" option;
   class-mastery-heatmap-reader → a second quiz question; suppression-threshold-lab → "Reveal all" and prediction
   buttons; fidelity-calibration-curve-lab → 5 bins, an underconfident scenario and diagnosis buttons;
   accessibility-check-walkthrough → a second defect per variant; pii-surface-explorer → `context.registration`, which
   is not in the book; prediction-trust-ladder → `flowchart BT` and two hypothetical claims;
   star-rating-comparison-table → a "Stated need" selector; layout-defect-catalog-explorer → a pale-text defect;
   microsim-directory-explorer → file names kept visible in the quiz.
8. **WCAG target.** Choose 2.1 AA or 2.2 AA.
9. **Slider rows.** Decide whether slider rows of about 18 px at 400 px are acceptable in portfolio-rubric-self-check.

### 6.3 Data provenance to review

- **Invented but labeled:** ratings in star-rating-comparison-table; theories and cells in clickable-detail-matrix;
  datasets in chart-type-chooser; models in class-dashboard-load-estimator and portfolio-milestone-planner; IDs and
  timestamps in xapi-statement-field-explorer; HLC values in two-browser-convergence-lab; two hypothetical claims in
  prediction-trust-ladder.
- **Needs checking:** marker-popup-tile-map coordinates were "rounded to 4 decimals from memory". Verify them.
  objectives-graph-neighborhood has 27 provisional definitions for concepts from other chapters.
- **Copies with no re-sync mechanism:** metadata-section-explorer copies the STEM Robots H-Bridge `metadata.json` and
  `microsim-schema.json`. faceted-filter-lab uses a 300-record sample (seed 2026, drawn on 2026-09-30).
- **Values read from other repositories and baked in:** From `~/projects/learning-record-store`: `validation.py`,
  `producer.py`, `lrs-design-v1.md`, `hardware-requirements.md`, `teacher_app.py`, `lrs-lite-sim.js` and the status
  tooltips in its `mkdocs.yml`. From `~/projects/stem-robots`: the poster `data.json`.
- **Derived values:** audit-baseline-explorer counts were tallied from `TODO.md`. The ch 19 numbers were reproduced
  with a JavaScript port of Python's Mersenne Twister (seed 19); fidelity-accuracy-base-rate-lab uses seed 177.
  bkt-parameter-lab was checked against ch 18.
- **Links to check:** bloom-to-pattern-matrix links to 12 other sims. Verify these resolve after the central iframe
  and nav steps.

### 6.4 External dependencies

- **Live network at view time:** choropleth-threshold-lab fetches `us-states.json` from `raw.githubusercontent.com`,
  and both Leaflet sims load tiles from OpenStreetMap, OpenTopoMap and Esri.
- **HTTP only:** sims that load `data.json` show "could not load" when opened from a file. Examples:
  lrs-architecture-explorer, metadata-section-explorer, faceted-filter-lab, clickable-detail-matrix, and the timeline
  and Leaflet sims. objectives-graph-neighborhood falls back to an embedded snapshot.
- **CDNs:** all libraries load from jsDelivr, unpkg or cdn.plot.ly, at the versions listed in 6.2.

### 6.5 Orchestrator bookkeeping

- **Chapter labels in the batch listing:** log-graph-compression-lab belongs to ch 20, not 21, and
  p5-2x-migration-mapper belongs to ch 5, not 6. The sims' metadata uses the correct chapters.
- **Uncommitted changes:** ch 1's fenced example (452 → 502) in this repository; in ibook-skills, the
  `create-microsim-todo-json-files.py` patch and the edits to `calculate-quality-score.py`.

## 7. p5.js 2.3.2 Migration Findings (added after the run)

All 70 new p5.js sims were switched from p5@1.11.10 to p5@2.3.2. Each sim was run headless under
both versions (load, canvas clicks and a drag, arrow/Enter/space/digit keys, every select option,
checkbox, radio and slider extreme, and every button twice), and the screenshots were pixel-diffed.
The p5 guide says 2.x is "largely backward compatible", and Chapter 6 names three breakages
(`preload()`, `curveVertex()`, `quadraticVertex()`). The run found more, and several are silent:

| 2.x change | Symptom | Sims hit | Fix applied |
|---|---|---|---|
| New global functions (`step`, `normalize`) and locked global names | Sketch never starts: "Cannot redefine property: step" | 5 | Renamed the sketch's function (`stepPipeline`, `stepSimulation`, `normalizeRecord`, `logEvent`) |
| `curveVertex()` removed | ReferenceError on load | 1 | `splineVertex()` plus `splineProperty('ends', EXCLUDE)`, which is pixel-identical to 1.x |
| Key constants are strings (`LEFT_ARROW === 'ArrowLeft'`) | `keyCode === LEFT_ARROW` silently never matches | 5 | Compare `key === 'ArrowLeft'` / `'Enter'` (works in 1.x and 2.x) |
| `textWidth()` returns tight ink bounds, ignoring leading and trailing spaces | Words drawn piece by piece run together ("Label:Built"); code views lose indentation | 69 use it; 3 visibly broken | `fontWidth()` everywhere (284 calls); equals 1.x `textWidth()` exactly |
| Boxed `text(s, x, y, w, h)` draws only whole lines that fit, with leading 1.275 × size (1.x: at least one line, 1.25 × size) | A one-line label in a 16 px box at 13 px vanishes | 3 | Box height 16 → 18 |
| `max()`/`min()` take two numbers or one array | FES warning (value still correct) | 9 | Array form `max([a, b, c])` |
| `redraw()` is asynchronous (returns a Promise) | Values computed in `draw()` are stale right after `redraw()` | 0 found (10 calls, none dependent) | None needed |
| FES name checker flags local variables named like p5 functions (`line`, `key`, `step`, `hue`, `scale`, …) | Console log "Function "line" … conflicts with a p5.js function" | 48 | Not changed (cosmetic; locals shadow only inside their function) |
| `mouseButton` is an object; `p5.Color.levels` removed; color `toString()` is hex | Would break comparisons and color math | 0 in the new sims | None needed |

Result: 70 of 70 load and pass the interaction pass with zero errors, validate at 100, and pass the
iframe tester. 37 sims differ from 1.x by under 0.1% of pixels. The 15 sims with the largest differences were
inspected side by side; what remains is random card order or anti-aliasing.

Proposed skill changes:

- **p5-guide.md:** replace "largely backward compatible" with the table above; default to `fontWidth()`
  for layout math; forbid global names that collide with p5 (`step`, `normalize`, `log`, `line`,
  `key`, …); use `key` names, not `keyCode` constants; size text boxes to `ceil(textLeading())` or larger.
- **Generator QA:** add a 1.x→2.x smoke test like the one used here: reroute the p5 CDN, capture
  `pageerror` and FES output, and hook `p5.prototype.text` to report boxed text that loses lines.
- **Chapter 6 (author):** the "three breakages" list is incomplete for sketches that measure text or
  read keys; the `textWidth()`/`fontWidth()` change is the one most likely to bite readers.
