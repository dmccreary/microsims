# Chapter Generation: Items for Human Review

Collected from the per-chapter reports of the 2026-09-30 content generation run (chapters 2-26; chapter 1 was written earlier). Nothing here blocks the build. Each item is something a reviewer should verify or a defect the run found in a related repository.

## Cross-cutting status statements (re-check before release)

- No learner data has been collected through MicroSims. Every predictive-fidelity claim is a hypothesis with an evaluation method attached.
- As of `learning-record-store/TODO.md` (2026-09-26), no emitter POSTs statements to a store. Chapters 16-23 describe the gateway, Full LRS and LRS-Lite as designs with working pieces. Re-read that TODO before release, because the status may have moved.
- Chapter 20's build-status table was corrected to say prototype Dash dashboards exist over a seeded graph with synthetic data.
- Adapter verification statuses (Chapter 17, 26) come from the xAPI skill's SKILL.md dated 2026-09-26.

## Defects found in other repositories or tools (not fixed here)

- `docs/sims/template/sketch.js` in this repo has merge-conflict markers and `function setup {` without parentheses (Chapter 2).
- `docs/sims/template/responsive-template.js` creates the canvas from `containerHeight` (400) while the layout needs 450, clipping controls (Chapter 2).
- The metadata schema is at `src/microsim-schema/microsim-schema.json`, not `src/microsim-schema.json` as the plan and some docs say (Chapter 15).
- `sync-iframe-heights.py` reads a top-level `canvasHeight` key that the nested schema does not define (Chapter 2).
- `test-iframe-heights.py` accepts only `// CANVAS_HEIGHT = N`; `sync-iframe-heights.py` accepts a colon or an equals sign (Chapter 12).
- This repo's `docs/js/extra.js` has no `microsim-resize` listener (Chapter 12).
- Overlay iframe-height pinning is described in the guide but no `min-height` pinning code exists in either `diagram.js` copy (Chapters 10, 12).
- Grid overlay engine: a wrong quiz answer never changes the score; the quiz `explanation` field is not rendered; edit-mode Copy JSON omits `showLabels` and `palette`; the stem-robots copy of `diagram.js` reads `ap_tip` where the schema says `tip`; one poster's image filename differs between `data.json` and `index.md` (Chapter 10).
- `search-microsims` README numbers (45 MicroSims, 17 repositories) are stale; the data file has 3,764 records from 90 repositories (Chapter 15).
- The chapter-content-generator skill's search path (`~/Documents/ws/search-microsims`) does not exist on this machine, so no MicroSim reuse search was run. The xAPI skill also hard-codes `~/Documents/ws/learning-record-store`.
- Gateway: built code rejects unknown verbs while spec section 5.2 says they are accepted; rejected batches are logged, not written to the dead-letter topic (Chapter 20).

## Claims that came from general knowledge, not from repository sources

- Ch 3: the 1956 Bloom attribution, the 2001 revision authors, Sweller as originator of cognitive load theory, and the doubt some researchers have about germane load.
- Ch 4: the Roman Empire routing scores are illustrative; the "within about ten points is ambiguous" rule is a suggestion.
- Ch 5: `createRangeSlider` is an invented name used to illustrate a hallucinated API; the `#### Diagram:` versus `#### Drawing:` convention is a suggestion.
- Ch 6: standard p5 calls not shown in repo sources (`noLoop`, `frameRate`, `deltaTime`, `mouseDragged`, `p5.Vector` methods) and the `describe()` LABEL wording should be checked against p5 2.x. No code block was syntax-checked (node is not installed).
- Ch 8: a minimal Mermaid `sequenceDiagram` example and the `click` directive wording come from general knowledge.
- Ch 18: the descriptions of BKT as a two-state hidden Markov model, standard IRT, and deep knowledge tracing.
- Ch 24: the three UDL principles, keyboard-focusability and `keyPressed` behavior; hypotheses about keyboard users and shared devices.
- Ch 25: portfolio size, schedule, rubric weights and the worked example are assignment design, labeled as suggestions.

## Numbers and examples that are illustrative or synthetic

- Ch 7: all example chart data. Ch 12: example iframe heights. Ch 18-19: Chapter 19's metrics come from a synthetic cohort (200 learners, seed 19) and are labeled synthetic. Ch 21: the capacity worked example is the chapter author's arithmetic on the design's ratios. Ch 22: 42 statements per session and 300 statements in 60 seconds are derived. Ch 23: the Full-versus-Lite decision explorer rules are a heuristic.

## Length

Most chapters exceed the per-concept elaboration ceiling because the ceiling counts prose, while the word count here includes code blocks, tables and specification blocks. The floor was met everywhere. Specification blocks are the cheapest place to trim if a tighter book is wanted. The per-chapter validator also over-counts concepts when a chapter has extra two-column tables.

## Interactive element specifications

All chapters together specify 116 unique interactive elements (unique `sim-id` values), all `Status: Specified` except `graph-viewer` in Chapter 8, which embeds the existing local viewer and is marked `Reused`. They have not been generated. Generation, per the plan, runs through the batch pipeline in Chapter 14 and must reach the quality bar before release.
