# MicroSims 2.0: Plan for a New Version of This Textbook

*Draft for review. Prepared 2026-09-30. Revised after the decision to rewrite the book completely.*

!!! note "Decision: complete rewrite"
    MicroSims 2.0 is a from-scratch rewrite, not an in-place revision. The v1.0 book stays available to historians through git (tag `v1.0`, pushed; see §8). No chapter text from v1.0 is carried over by default; v1.0 pages are source material only.

## 1. Purpose and Summary

The current book ("MicroSims 1.0") was started in November 2023. It teaches how to build p5.js simulations with generative AI. Since then the practice of MicroSims has changed a lot. MicroSims 2.0 will retell the subject as it now exists:

> A MicroSim is a small, AI-generated, iframe-embeddable, width-responsive, *instrumented* interactive learning object. It is chosen from a wide family of types by matching a learning objective to an interaction pattern. It is generated in batches from specifications, checked by automated layout QA, found again by metadata search, and emits compact xAPI events that help predict concept mastery.

The v1.0 book treats p5.js as the whole subject. In v2.0, p5.js is one of about 17 generator types.

### Core thread: fidelity of the xAPI stream as a predictor of mastery

The organizing question of the whole book is: **how well does the xAPI event stream from a MicroSim predict whether a student has mastered a concept?** Every chapter is written to serve this question, and each says so in a short "Evidence and Prediction" section. The thread is:

| Where | What it contributes to prediction fidelity |
|---|---|
| Ch 3 (objectives) | A measurable objective per concept, so there is something to predict |
| Ch 4–5 (type and generation) | Choosing a type and interaction pattern for its **diagnostic value**, not only its appeal; the Instructional Design Checkpoint's "does the learner predict first?" gives a testable answer, not just exposure |
| Ch 6–11 (type chapters) | For each type, which interactions count as evidence and which are noise, in terms of the six evidence classes and the runtime's thresholds (hover under 600 ms, clicks under 250 ms, page dwell under 1 s do not count) |
| Ch 12–13 (responsive design and QA) | A broken layout hides controls and corrupts the stream, so QA is a data-quality control |
| Ch 14 (batch) | Consistent instrumentation at scale, so events are comparable across sims |
| Ch 15 (metadata and reuse) | The concept ID in each sim's metadata is what links events to a concept |
| Ch 16 (xAPI) | Evidence classes, why answers are never folded (attempt order matters to BKT), one concept ID per statement, and how Compact summaries lose or keep signal |
| Ch 17–18 (Full LRS and LRS-Lite) | Bayesian knowledge tracing on the full stream versus on compact summaries: what each preserves, and how much fidelity the Lite strategy trades for cost |
| Ch 19 (evaluation) | How to **measure** fidelity: correlation with held-out assessments, calibration of predicted mastery, discrimination (for example AUC), stability across sessions, and the guess and slip parameters |
| Ch 20 (capstone) | A measured predictive check on the student's own instrumented portfolio |
| Ch 21 (future) | How AI-generated sims can be designed for higher predictive value |

Two honesty rules apply throughout: the book reports what has been *measured* and separates it from what is *designed* or *hoped for*, and it does not claim predictive validity without student data. Today the runtime and back-end designs exist, but no learner data has been collected through them, so fidelity claims are stated as hypotheses with the evaluation method attached.

### Headline changes

| Theme | MicroSims 1.0 | MicroSims 2.0 |
|---|---|---|
| Scope | p5.js sketches | 17+ types across p5.js, Chart.js, Plotly, Mermaid, vis-network, vis-timeline, Leaflet, Venn, overlays, Docker labs and verified posters |
| Generation | One prompt, one sim, hand-tuned | Meta-skill routing, a mandatory instructional-design checkpoint, and batch pipelines driven by specs |
| Quality | Manual review; a checklist in `rules/` | Playwright and vision-based layout QA, a 100-point validator, iframe-height sync, and control-visibility tests |
| Assessment | Not covered | xAPI instrumentation with 3 verbs, evidence classes, compact mode and mastery prediction |
| Reuse | Faceted search described in theory | A 3,700-entry cross-book search index that the generator consults before building |
| Showcase quality | Basic sketches | Fully animated, richly documented sims such as H-Bridge |

## 2. Findings from the Survey

### 2.1 Current state of this repository

- **Age.** First commit 2023-11-21; last commit 2026-09-29. Some content is 2023–24 vintage: `docs/setup/*`, `sims/learning-graph-v1`, Circuits v2, `rules/cursor.md`, "Basic Microsims", `paper-steps`.
- **Sims.** 118 entries in `docs/sims/` (book-metrics says 115). About 88% of those with a `main.html` use p5.js. About 9 use vis-network, Chart.js, Leaflet, Mermaid or vis-timeline. p5 versions are mixed (CDN 1.11.10 in most, 1.9.0 in one, and old local copies in `docs/js/`). The generator skill now defaults to p5 2.3.2.
- **Chapters.** 14 chapters, each with `index.md` and `quiz.md`. Nothing covers xAPI, non-p5 generators beyond Chapters 10–11, batch generation, or automated QA. xAPI appears only in the FAQ, glossary, course description, a few chapter mentions, and `CLAUDE.md`. No sim contains xAPI code.
- **Metrics.** `book-metrics.json` was generated 2026-06-03 (242 concepts, 252 glossary terms, 71 FAQs, 182 quiz questions, 66 diagrams, 56 equations). It is stale.
- **Known defects to fix in Phase 0.**
  - `TODO.md` lists 5 sims that break under p5 2.x: `book-gen-workflow`, `breadboard`, `curve`, `flower-petal`, `temp-and-pressure`.
  - The nav entry `rules/ibook-skills/index.md` points at a directory that does not exist on disk. Verify with `mkdocs build`.
  - `docs/appendices/` does not exist yet; this file creates it.

### 2.2 The paper (`paper/`)

Title: *MicroSims: A Framework for AI-Generated, Scalable Educational Simulations with Universal Embedding and Adaptive Learning Support* (Lockhart, McCreary, Peterson). Versions v0.02–v0.06 exist. Gaps that v2.0 material can close:

- xAPI gets one paragraph (`08-workflow.tex` around line 130), a "not SCORM" note, and a generic "Learning Analytics Integration" subsection. It has no event schema, no verbs, and no link to mastery estimation.
- Library diversity is one paragraph in `06-architecture.tex`. `09-expected-benefits.tex` presents Leaflet, vis-timeline and causal-loop diagrams as *future* needs. They are now implemented.
- Overlays, comparison posters and verified posters are absent. Poster instrumentation is also a gap: the grid overlay's Explore and Quiz events are natural xAPI evidence (discrete inspection and assessment classes).
- The mapping from learning objective to type is conceptual only. The paper has no tables.
- Workflow is one educator prompting one sim. There is no batch pipeline, no Playwright QA and no validator.
- Reuse search is described but not implemented in the text.
- The "over 100 MicroSims" claim is unsubstantiated. The effectiveness data are borrowed from PhET and meta-analyses, not measured on MicroSims.
- Housekeeping: `main.tex` still says "Version 0.05"; `STATUS.md` and `README.md` are stale; there are TODOs in `10-discussion.tex` and `11-conclusion.tex`; related work is thin; there are 22 references, and there are no LLM-code-generation, knowledge-tracing or Playwright references.

### 2.3 Skills and tooling (in `~/projects/ibook-skills`)

- **`microsim-generator`** (1,055 lines). It is a meta-skill with keyword routing plus the scored rubric in `references/routing-criteria.md`. Its mandatory Step 3, the Instructional Design Checkpoint, matches Bloom level to interaction pattern. Interactive is the default output; a static image is produced only on explicit request. A batch pipeline runs Steps 0–9. The `sim-status.json` lifecycle is `specified → scaffolded → implemented → validated → deployed`.
- **`microsim-utils`**. It provides the quality validator (100-point rubric, grades A–D), iframe-height sync and Playwright-based height and control-visibility tests. It also provides a Claude-Vision layout reviewer (PASS/FAIL checklist, smallest patch, three-cycle limit), screenshots, icons, index generation and coverage reports.
- **`add-xapi-events-to-microsim`** (v0.2). It adds a thin 20–60 line adapter over a shared runtime. There are three verbs (`answered`, `experienced`, `interacted`), six evidence classes, and adapters for ten libraries. It has a compact mode that folds exposure evidence into one summary but never folds answers, because Bayesian knowledge tracing (BKT) reads attempt order.
- **`learning-record-store`** (`~/projects/learning-record-store`, now available locally; a 32-chapter book plus code). It holds the **real runtime and backend examples**:
  - **Client runtime**, in `docs/js/`: `lrs-xapi.js` (statement builder and IRIs), `lrs-lite-sim.js` (Compact mode, one summary per session), `lrs-sim.js` (the API sim authors use: `slider`, `item`, `button`, `runner`, `question`), `lrs-config.js` (one file per book: `siteUrl`, `textbookId`, `version`, `conceptPrefix`, and the `xapi: {compact, teaching}` policy), `quiz-xapi.js` and `xapi-json-viewer.js`. Policy precedence is defaults, then the book config, then the page, then the sim's `metadata.json`. A `?xapi=teaching|production|full|compact` URL switch overrides it for one visit.
  - **Full LRS backend** (`src/lrs/`, `deploy/docker-compose.yml`): an HTTP gateway (`POST /xapi/statements`, strict producer-contract validation, all-or-nothing batches), Redpanda (Kafka), ClickHouse, Neo4j and Postgres/Vault. Three dashboard apps (`dashboards/`: teacher, author and admin).
  - **LRS-Lite** (`docs/lrs-lite/index.md`): a serverless design where each student's compressed event stream lives in a 10 MB browser database that syncs through S3. It is sized at about 0.2 MB per student per semester and a few dollars a month.
  - **Specs**: `xapi-producer-contract-v1.md`, `lrs-spec-v1.md`, `lrs-design-v1.md`. Chapter 12 covers Bayesian knowledge tracing, and 26 of its sims are headless-Chromium tested (`make test-sims`).
  - **Status (from its `TODO.md`, 2026-09-26).** The runtime is complete and every emitter in that book uses it. The gateway accepts and validates POSTs, but **no emitter POSTs yet** (`lrs-xapi.js` has a `transport` seam and no network call by design), the stream processor that makes statements durable is not finished, and `lrs.statements` had 0 rows at that time. The skill's adapters for p5, Mermaid and others are verified there; Plotly, Leaflet, vis-network and p5 drags were not.
- **Showcase: H-Bridge** (`../stem-robots/docs/sims/h-bridge`). Flowing green and purple current dots, spinning motor arrows, red shoot-through flashing, four clickable switches, keyboard shortcuts, and animation that pauses when the mouse leaves. `quality_score: 95`, a rich `metadata.json` (Dublin Core plus search, educational and technical blocks), and a mascot warning callout.
- **Search.** `../search-microsims/docs/search/microsims-data.json` is 8.4 MB with 3,764 entries. Library mix: p5.js 1,430, vis-network 188, Mermaid about 189, Chart.js 81, vis-timeline 38, static SVG 21, Leaflet 12, and about 1,700 unlabeled.
- **Sibling books using the pipeline.** ibook-skills (101 sims), stem-robots (85), xapi-course (51, about 42 with xAPI), robot-faces (49), moving-rainbow (45), intelligent-textbooks (35), learning-micropython (30), and others.

### 2.4 Discrepancies to resolve before writing

These affect the accuracy of the plan and the future text:

1. **Comparison posters (resolved).** These are the grid-overlay posters in `../stem-robots/docs/posters/` (six posters: communication-protocols, distance-sensors, motor-control-methods, robot-control-modes, robot-kits, wireless-technologies). Each poster is a folder with a `*-infographic.png`, a `data.json`, a `main.html`, an `index.md` and (for most) an `image-prompt.md`. The pattern is:
   - An image model renders a side-by-side comparison poster from a verbatim-text prompt ("Render all text exactly verbatim... do not invent extra rows/columns/stats"). The prompt is stored in the `index.md` as a `!!! prompt` admonition.
   - `data.json` (`layout: "grid"`) defines one percentage-rectangle zone per column, with `label`, `color`, `summary` and a list of `facts`, plus a `quiz` array.
   - The shared `grid-diagram.js` and `grid-overlay.css` in `posters/shared-libs/` turn the image into **Explore** (click a column, see facts) and **Quiz Me** (which column fits this scenario?) modes. An edit-mode badge lets an author align zones.
   - Posters live under `docs/posters/`, not `docs/sims/`, with a card-grid `posters/index.md` and a standard iframe (`height="800"`).
   
   This is the same mechanism as the "verified-infographic" grid wrap in the generator skill. The plan now treats it as its own MicroSim type (see Chapter 10). Note the shared libs are copied per book, so a versioning and distribution decision is needed (Appendix H).
2. **Search path.** The data file is at `search-microsims/docs/search/`, not `docs/sims/search/`.
3. **xAPI: runtime exists, end-to-end transport does not.** The runtime and both modes (Compact and Full) are now available in `~/projects/learning-record-store` and can be studied and copied. But no emitter sends statements to a store yet: the client has a `transport` seam (`LRSLite.record()`) and no network call, and the backend's ingest path was unfinished at last check. Chapter text should say "instrumentation-ready, with a working runtime and a validating gateway" and must not claim end-to-end analytics until a POST path is proven. Re-check its `TODO.md` at writing time, because it may have moved.
4. **Hard-coded paths.** `SKILL.md` refers to `$HOME/Documents/ws/ibook-skills/...`, `$BK_HOME`, and `~/Documents/ws/learning-record-store` (now at `~/projects/learning-record-store`). The real path is `~/projects/ibook-skills`.
5. **Your message item 1 was cut off** after "shows this and the". I assumed it refers to the xAPI skill plus the xapi-course book. Please confirm.
6. **Item 9's path** (`../stem-robots/docs/sims/h-bridge`) is correct, but the sim was created 2026-09-29. Screenshots and metrics should be regenerated at publish time.

## 3. Additional Improvements Beyond Your List

Your 13 items are all confirmed by the survey (with the caveats above). I propose adding these as distinct topics:

14. **Instructional Design Checkpoint.** A mandatory gate before code. It asks whether the learner predicts first and what animation adds, and it flags animation at the Understand level. This is a pedagogical improvement, not only a technical one.
15. **Interactive-by-default and "forced interactivity" policy.** This is the basis for measurable evidence.
16. **Consistent metadata.** Dublin Core plus `search`, `educational` and `technical` blocks, a schema meta tag, `quality_score`, and `status: implemented|instrumented`.
17. **Verified statistics posters.** An eight-phase claim-plan, source-verification and render-audit pipeline. Phases 1–4 can give any sim cited data (`source_id` carried into the data file).
18. **Canvas-height strategy and iframe auto-height protocol.** A `// CANVAS_HEIGHT` comment plus the `microsim-resize` postMessage protocol.
19. **Standards hardening.** Relative iframe paths, `scrolling="no"`, no scroll hijacking, and no proprietary fonts.
20. **Status lifecycle and resumable batches.** `sim-status.json` lets a pipeline survive context exhaustion.
21. **Coverage and TODO reports.** Per-chapter diagram and MicroSim coverage, plus TODO JSON files from chapter specs.
22. **Concept-level linking.** Each sim maps to a learning-graph concept ID, which is what makes mastery estimation possible.
23. **Privacy and ethics.** The "aggregate events only, no per-student identifiable history" stance, and PII surface in xAPI statements.
24. **Accessibility.** `describe()`, contrast, keyboard operation (H-Bridge shows this), and UDL.
25. **Library and version hygiene.** The p5 2.x migration, pinned CDN versions, and a decision on local versus CDN copies.
26. **Mascot and callout conventions** (the "Sparky" warning admonition in H-Bridge).
27. **Portfolio scale.** Hundreds of sims across ten or more books. This creates a real dataset for evaluation.
28. **Skills as the delivery mechanism.** The book teaches the reader to use skills, not only to write prompts.

## 4. Proposed Structure of MicroSims 2.0

Because this is a complete rewrite, the structure is designed from the 2.0 definition, not from the 14 v1.0 chapters. The learning graph and course description are regenerated first (Phase 1), and the chapter list below is a **starting proposal** that the regenerated graph will confirm or reshape. Nothing here is tied to v1.0 URLs.

### 4.1 Proposed chapter map (all new)

The order follows the life of a MicroSim: understand it, choose it, generate it, check it, instrument it, reuse it, then scale it.

| # | Title | Key content |
|---|---|---|
| 1 | What Is a MicroSim? | The 2.0 definition, the role of MicroSims in intelligent textbooks, the 1.0-to-2.0 story, and a tour of showcase sims (H-Bridge and others) |
| 2 | Anatomy of a MicroSim | `main.html`, the JS file, `index.md`, `metadata.json`, iframe embedding, pinned CDN libraries, and the draw and control layout |
| 3 | Learning Objectives and Bloom's Taxonomy | Writing measurable objectives and the Instructional Design Checkpoint (predict first? what does animation add?) |
| 4 | Choosing a MicroSim Type | The type catalog, the routing rubric, and the objective-to-type mapping table |
| 5 | Generating MicroSims with AI Skills | The `microsim-generator` meta-skill, prompt and spec design, and single-sim generation |
| 6 | p5.js MicroSims | p5 2.x, animation, physics and showcase techniques (animated wires, flowing current) |
| 7 | Charts, Plots and Tables | Chart.js, Plotly, bubble charts, and comparison tables |
| 8 | Diagrams, Networks and Systems | Mermaid, vis-network, Venn, and causal-loop diagrams |
| 9 | Timelines and Maps | vis-timeline and Leaflet |
| 10 | Image Overlays, Grids and Comparison Posters | Point-marker callout overlays; the grid-overlay comparison poster (image-prompt design, `data.json` zones and quiz, Explore and Quiz modes, the `docs/posters/` convention); fact-verified posters |
| 11 | Runnable Labs and Other Specialized Types | Docker Python labs, concept-classifier sorting quizzes, and celebration effects |
| 12 | Width-Responsive Design and Iframe Heights | Responsive layout, `CANVAS_HEIGHT`, the auto-height protocol, and height sync |
| 13 | Quality Assurance and Automated Layout Review | Playwright, the 100-point validator, vision-based layout review, control-visibility tests, and the catalog of layout errors and fixes |
| 14 | Batch Generation from Specifications | Spec extraction from chapters, scaffolding, the `sim-status.json` lifecycle, resumable runs, and parallel workers |
| 15 | Metadata, Search and Reuse | Dublin Core plus search metadata, the cross-book search index, and reuse-before-build |
| 16 | Instrumenting MicroSims with xAPI | The producer side: the three verbs, evidence classes, the `lrs-sim.js` API and adapters, the producer contract, `lrs-config.js` per-book identity, concept mapping to the learning graph, Compact versus Full policy, and privacy |
| 17 | The Full LRS: Architecture for Scale | The complete server-side strategy: system context and multi-tenancy, the property-graph data model, the ingestion gateway (`POST /xapi/statements`, strict validation, all-or-nothing batches), the Kafka (Redpanda), ClickHouse and Neo4j pipeline, the twelve core LRS functions, summary vertices, Bayesian knowledge tracing, dashboards for teachers, authors and administrators, privacy and compliance, and cost (about $300–2,500/month for one server and about $10,300/month at full scale). Worked from `learning-record-store` (spec, design and `src/lrs/`). |
| 18 | LRS-Lite: The Serverless Compact Strategy | Why a pilot needs no always-on server (about 0.01 statements/second against a design for 10,000/second); measured data sizes (about 970 bytes per statement, about 0.2 MB per student per semester); producer-side summarization (one session summary per loss of focus, and answers never folded); the local data model in a 10 MB browser database; the storage meter and quota rules; multi-device sync and backup through S3 and why it converges; mastery estimation and dashboards in the browser; the few things that need a server; and cost (a few dollars a month). Ends with **choosing and migrating between Full and Lite**: a decision table, and how every Lite statement is a valid contract statement, so a school can move up without rewriting sims. |
| 19 | Pedagogy, Accessibility and Evaluation | UDL, cognitive load, PRIMM, keyboard access, and evaluating a MicroSim |
| 20 | Capstone: Building an Instrumented MicroSim Portfolio | An end-to-end project using the 2.0 pipeline, ending in either a Compact or a Full configuration, and a measured check of how well its event stream predicts mastery |
| 21 | The Future of MicroSims | **Short term (about one year):** verified adapters for every library, a proven POST path from sims to an LRS, closed-loop generation in which QA and vision review run inside the generator, richer showcase-quality animation as a standard, per-concept mastery dashboards for students and teachers, and shared sim libraries with reuse search across books. **Long term:** AI that generates super high-quality MicroSims that are both fun to use and better able to tell whether a student has mastered a concept: designing the interaction *for* diagnostic value, adapting difficulty and representation to the learner, generating probes that separate real understanding from guessing, and learning from aggregate xAPI data which sim designs give the most predictive evidence. Also the open problems (privacy, validity, equity, and evaluation) and what would make each prediction trustworthy. |

Each chapter keeps the `index.md` plus `quiz.md` pattern. The chapter count (21) is a proposal: it may drop if the learning graph shows that chapters 6–9 or 11 can be merged. Chapters 17 and 18 stay separate because the full LRS and LRS-Lite are the two deployment strategies the book must treat in detail.

### 4.2 New appendices (this folder, `docs/appendices/`)

- **A. MicroSim Type Catalog.** All 17+ types with library, guide, best Bloom levels, limits and an example.
- **B. Routing Rubric.** Condensed from `routing-criteria.md`, with a decision tree.
- **C. Metadata and Schema Reference.**
- **D. xAPI and LRS Quick Reference.** A Full versus Lite comparison table, verbs, object IDs, evidence classes, `lrs-config.js` keys, the policy precedence, and the `?xapi=` URL switch.
- **E. QA Tool Reference.** Every script with flags.
- **F. Showcase Gallery.** H-Bridge and others, each with a "why it works" annotation.
- **G. Migration Guide from 1.0.** p5 1.x to 2.x, and adding metadata and xAPI to old sims.
- **H. Skills Installation and Paths.**
- **This plan** stays here after the work is done, as a record.

### 4.2a Nav status icons (must be covered)

The new `mkdocs.yml` must describe and configure the **status icon shown next to each MicroSim in the nav bar**, and the book must explain it. This repo's current `mkdocs.yml` has no status configuration at all. The working pattern is in `~/projects/learning-record-store`:

- **Per-page value.** Each sim's `index.md` front matter sets `status: scaffold | built | implemented | instrumented | approved`.
- **The legend.** An `extra.status` block in `mkdocs.yml` gives each value its hover text (for example "Instrumented — the MicroSim emits xAPI events; add `?xapi=teaching` to the URL to see them").
- **The icons.** Community Material renders each status as an empty span painted by a CSS `mask-image`, driven by `--md-status--<name>` custom properties in `docs/css/extra.css`. **Do not** add `theme.icon.status`: it is Insiders-only, is silently ignored on community Material, and gives no build warning (the icons fall back to a generic "i" circle). The colors come from the `:after` background-color, not `color`.
- **Automation.** `add-xapi-events-to-microsim/scripts/sync-status.py --apply` sets `instrumented` on any sim that carries xAPI handling and, if the book lacks them, installs `assets/status-instrumented.css` and the `extra.status` entries. It leaves sign-off values such as `approved` alone.
- **Relationship to the batch lifecycle.** The nav status (`scaffold` to `approved`) is the reader-facing view. It should be aligned with the pipeline's `sim-status.json` lifecycle (`specified → scaffolded → implemented → validated → deployed`). The plan needs a defined mapping (for example `scaffolded` to `scaffold`, `implemented` to `implemented`, `validated` to `built` or `approved` by score, and instrumentation to `instrumented`) and a decision on who sets `approved`.

Where it is covered: the Phase 2 skeleton (`mkdocs.yml`, `extra.css` and a status legend), **Chapter 2** (anatomy: the `status` front-matter key), **Chapter 13** (QA: status is set from validation results), **Chapter 16** (`instrumented` and `sync-status.py`), **Appendix E** (the script reference), and **How We Built This Site**. A short legend page for readers should explain what each icon means.

### 4.3 Site pages to write (all fresh)

`index.md`, `about.md`, `course-description.md` (which drives the learning graph), `why/*`, `faq.md`, `glossary.md`, `references.md`, `how-we-built-this-site.md`, and the `rules/` pages. The `rules/ibook-skills` nav entry should be fixed or replaced.

## 5. Sim Portfolio Plan

In a complete rewrite, the sims are regenerated with the current pipeline, not patched. The 118 v1.0 sims are treated as a **candidate pool**, not as the book's contents.

1. **Write specs first.** Each new chapter carries `#### Diagram:` and `#### Drawing:` specification blocks, so `extract-sim-specs.py` can drive batch generation (see Chapter 14).
2. **Reuse before build.** For every spec, query the search index (§2.3) and the v1.0 pool. Record one of: reused as-is, adapted, or built new.
3. **Harvest v1.0 sims only if they reach the bar.** Decision: a v1.0 sim is reused only when its `validate-sims.py` score can be raised to **85 (grade A)**, it is width-responsive, and its iframe height is correct. If it cannot be raised that high, it is **not** in the new textbook, and it stays in git at the `v1.0` tag. The per-sim upgrade list is in [`TODO.md`](https://github.com/dmccreary/microsims/blob/main/TODO.md) (section "MicroSims 2.0: Per-Sim Quality Upgrades"), with each sim's score and its rubric issues. Upgrades are done **on demand**: when a new chapter's spec adopts a sim, we work through its checklist, re-score, and tick it off. Sims that no chapter adopts are not upgraded. The 2026-09-30 baseline is 116 sims scored, mean 60.6, with 18 at grade A, 27 at B, 30 at C and 41 at D.
4. **Regenerate the rest** from specs with the meta-skill, then run the full QA chain (scaffold, validate, height sync, Playwright height test, screenshot, layout review, nav update).
5. **Showcase set.** Build 4–6 sims in the H-Bridge style, one per major family (a physics animation, a chart explorer, a network, an overlay, and a comparison poster). The six stem-robots posters cover the poster family; add one or two posters on this book's own topics (for example the MicroSim types, or p5 vs Chart.js vs Plotly).
6. **xAPI pilot.** Instrument about 10 sims covering every evidence class and at least the p5, Chart.js and Mermaid adapters, using the `lrs-*.js` runtime and a generated `lrs-config.js`, and using the coordinator-plus-workers pattern proven on eight-hour-entrepreneur (20 sims).
7. **Quality bar.** Every new or regenerated sim scores at least B (70+); every carried-over v1.0 sim scores at least A (85). All sims pass the iframe-height and control-visibility tests and are width-responsive. Sims that carry xAPI instrumentation must also pass `check-xapi.py`.
8. **Metrics.** Regenerate `book-metrics.json` after the portfolio pass. The known p5 2.x breakages in `TODO.md` no longer need fixing in place: those five sims are only fixed if they are harvested.

## 6. Revising the Paper

Decision: **revise the paper in place** in `paper/`, on `main`, with no new paper directory. **The three co-authors (Valerie Lockhart, Dan McCreary and Troy A. Peterson) stay on the 2.0 paper.** The title stays as it is unless the authors agree on a change. Earlier versions stay available as the existing PDFs (v0.02–v0.06) and in git history. The revision is released as v0.07 (bump `main.tex`, which still says 0.05) and the title is updated to reflect the 2.0 framework only if the co-authors agree. Use `paper/sections/` as the working set.

| Section file | Change |
|---|---|
| `01-abstract.tex`, `abstract.txt` | Rewrite. Add the instrumentation, batch pipeline and type family. Fix the "enabling" grammar error. |
| `02-introduction.tex` | Update contributions. Replace the unsubstantiated "over 100" claim with measured counts from the portfolio. |
| `03-related-work.tex` | Expand. Add LLM code generation, xAPI and learning analytics, knowledge tracing, and automated UI testing. |
| `04-definition.tex` | Broaden the definition beyond p5. Add types, overlays and posters. Rewrite the SCORM/xAPI contrast. |
| `05-design-framework.tex` | Add the objective-to-type mapping **table**, the Instructional Design Checkpoint, and interaction patterns by Bloom level. |
| `06-architecture.tex` | Make it library-neutral. Add an xAPI instrumentation subsection and the postMessage height protocol. |
| `06-architecture.tex` (addition) | Add a subsection contrasting the full LRS and LRS-Lite as back-end strategies. |
| `07-metadata.tex` | Update the schema. Describe the implemented cross-book search index. Add the concept-ID link. |
| `08-workflow.tex` | Replace the single-prompt flow with the batch pipeline. Add automated QA (Playwright, vision review). |
| `09-expected-benefits.tex` | Trim. Stop presenting implemented libraries as future needs. Keep the literature-based benefits but label them clearly. |
| `10-discussion.tex`, `11-conclusion.tex` | Remove the TODOs. Add privacy, mastery prediction, limitations and future work. |
| `references.bib` | Grow from 22 toward the 50–80 target. |
| New figures/tables | Routing table, pipeline diagram, xAPI event flow, library distribution chart (from real data), QA before/after examples. |
| Core thread | Make the predictive fidelity of the xAPI stream a central theme of the paper (a dedicated section on evidence classes, compact versus full streams, and how to measure prediction), stated as a design and evaluation framework until learner data exist. |
| **Keep the v1.0 paper reproducible** | Add a "Rebuilding the v1.0 paper" section to `paper/README.md` (done; see below) so anyone can regenerate the paper as it stood at the `v1.0` tag. |
| Housekeeping | Bump the version in `main.tex` to 0.07 and save the built PDF as `microsims-v0.07.pdf` alongside the earlier ones. Refresh `STATUS.md`, `README.md` and `FIGURES-STATUS.md`. Rebuild the arXiv bundle. |

**Empirical evidence.** This is the main weakness. The paper needs something MicroSim-specific, and the data we can honestly produce are:

- Portfolio counts and type distribution (from the search index).
- Validator score distributions before and after the QA pipeline.
- Layout defects found and fixed per batch.
- Generation cost or time per sim.
- (If pilot data exist) xAPI event volume and any BKT trial.

We should not claim learning gains from MicroSims without student data. Learning-outcome claims should stay attributed to the literature.

**Co-authors.** The paper has three authors. The plan should let them decide who owns which sections.

**Rebuilding the v1.0 paper.** The paper at the `v1.0` tag is the last pre-2.0 version (its source says "Version 0.05" but its PDF is v0.06). To regenerate it without disturbing `main`:

```bash
git worktree add ../microsims-v1.0 v1.0
cd ../microsims-v1.0/paper
./build.sh            # needs tectonic: brew install tectonic
open main.pdf
cd ../../microsims && git worktree remove ../microsims-v1.0
```

The prebuilt PDFs `MicroSims-v0.02.pdf` through `microsims-v0.06.pdf` also stay in `paper/`. These instructions are also in `paper/README.md`.

## 7. Work Phases

| Phase | Scope | Main outputs |
|---|---|---|
| **0. Archive and prep** | Tag v1.0 (done and pushed), run the validator over the v1.0 sims for the harvest pool, and settle the open questions in §2.4 | The `v1.0` tag (done), a baseline report |
| **1. Foundations** | New course description, new learning graph (concepts, taxonomy, dependencies), and a confirmed chapter map | Course description, learning graph, chapter map |
| **2. Skeleton** | New `mkdocs.yml` (including the `extra.status` legend and the `--md-status--*` CSS for the nav status icons, §4.2a), an empty site with all chapters and appendices stubbed, and the spec blocks per chapter | A building skeleton |
| **3. Foundation chapters** | Chapters 1–5 and Appendices A and B | The concepts and the routing story |
| **4. Type chapters** | Chapters 6–11 | One chapter per type family, each with specs and sims |
| **5. Engineering chapters** | Chapters 12–18 and Appendices C–E | QA, batch, reuse, xAPI, the full LRS and LRS-Lite |
| **6. Pedagogy and capstone** | Chapters 19–21 and Appendices F–H | The closing chapters (including the future chapter) and reference material |
| **7. Sim portfolio** | Reuse search, harvest, batch generation, showcase sims, and the xAPI pilot (§5). Runs alongside phases 3–6 as chapter specs are written | Validated sims and screenshots |
| **8. Learning-graph artifacts** | Glossary, FAQ, quizzes, references, diagrams, and book metrics | Regenerated reports |
| **9. Paper revision** | The table in §6 | New PDF and arXiv bundle |
| **10. Release** | Full `mkdocs build`, link check, `gh-deploy`, announcement material | MicroSims 2.0 site |

Phases 3–6 (writing) and 7 (sims) can proceed in parallel once the skeleton exists. Paper work (Phase 9) can start after Phase 5 because it needs the pipeline text and portfolio numbers.

## 8. How the Work Would Be Done

The book teaches a skills-based workflow, so we should build it with the same workflow:

- Use the `book-chapter-generator`, `chapter-content-generator`, `glossary-generator`, `faq-generator`, `quiz-generator` and `reference-generator` skills for the text.
- Use `microsim-generator` and `microsim-utils` for the sims, in batch mode with `sim-status.json`.
- Use parallel subagents per chapter or per sim group, with a coordinator (the pattern proven on eight-hour-entrepreneur).
- Record generation logs in `logs/`, as v1.0 did (v1.0 logs stay in git history; the new logs start fresh).
- Keep `book-status.json` current so the dashboard shows progress.
- **Preserving v1.0 for historians.** The annotated tag `v1.0` (on commit `b1c4a9fe`) is created and pushed. Historians browse it at `https://github.com/dmccreary/microsims/tree/v1.0`. Appendix G links to it.
- **One branch: `main`.** The rewrite happens directly on `main`, in small commits, so there is no second branch to keep in sync. A `v2` branch is used only if a specific change needs isolation for quality (for example a large structural change that would leave `main` unable to build). I do not expect to need one.
- **Do not deploy mid-rewrite.** The live site is published by `mkdocs gh-deploy`, which builds from the working tree. While the book is half rewritten, use commit and push only, and run `gh-deploy` once at release (Phase 10). Your "publish" shorthand includes the deploy step, so during the rewrite I will treat "publish" as commit and push only and ask before deploying, unless you say otherwise.
- **Keep `main` building.** Each commit should pass `mkdocs build` so `main` is always in a good state. The skeleton phase (Phase 2) replaces the nav in one commit, and content is added chapter by chapter.
- **URLs.** The rewrite will break v1.0 chapter URLs on the live site (GitHub Pages serves only `main`'s last deploy). If old links matter, Appendix G can list a redirect table, or v1.0 can be deployed once to a `/v1/` path. This is a separate small decision (§11).

## 9. Alternatives Considered

The decision is made: **complete rewrite in this repository, on `main`, with v1.0 preserved by a git tag.**

| Option | Notes |
|---|---|
| **Complete rewrite in this repo, on `main` (chosen)** | Keeps the repository, the site URL, the GitHub Pages deployment and the full git history. v1.0 is recoverable at the pushed tag. No long-lived branch. |
| Rewrite on a `v2` branch | Isolates half-finished work, but adds merge and sync overhead. Not chosen unless a change needs it. |
| Rewrite in a new repo | Would split history and lose the site URL. Not chosen. |
| Evolve in place | Would leave p5-centric structure and mixed voice. Not chosen. |

## 10. Risks

- **xAPI overclaiming.** The runtime is real, but no emitter POSTs to a store yet and some adapters are unverified. The text must match reality, and Chapters 16–18 should be written last among the engineering chapters so it reflects the state of `learning-record-store` at that time.
- **Runtime distribution.** The `lrs-*.js` files are copied into each book, and `lrs-config.js` is per book. Decide how copies stay in sync (the `install-runtime.py --check` script exists for this). The same question applies to the poster shared libs.
- **Tooling paths.** The skills refer to paths that do not exist here. The book should use `~/projects/ibook-skills` or a stable environment variable.
- **Skills change quickly.** The book should describe the *concepts and contracts*, and link to the skills for details, so it does not go stale as quickly as v1.0 did.
- **Scale of the rewrite.** About 21 new chapters, 8 appendices, and a regenerated sim portfolio is large. The harvest step (§5) and batch pipeline keep the sim cost bounded, but the chapter text is entirely new writing.
- **Broken inbound links.** v1.0 URLs (search engines, other books that link to `microsims` pages) will 404 after release. Mitigate with a redirect list in Appendix G, and grep sibling repos for links to this site before release.
- **Losing good v1.0 material.** Some v1.0 explanations and sims are worth keeping. The harvest step and the `v1.0` tag mitigate this.
- **Paper evidence.** Without student data, the empirical contribution is limited to portfolio and QA metrics.
- **Privacy.** Any student data collection needs the aggregate-only policy and a clear statement in the book.

## 11. Decisions

**Resolved**

- Rewrite the book completely, on `main`, with no `v2` branch. The `v1.0` tag is created and pushed.
- The book gives detailed treatment of both the full LRS (Chapter 17) and LRS-Lite (Chapter 18).
- **The core focus of the entire book is the fidelity of the xAPI stream as a predictor of concept mastery** (see §1).
- The 21-chapter map is accepted, including the new Chapter 21, *The Future of MicroSims* (short-term ideas for the next year, and the long-term view of AI generating high-quality, fun MicroSims that predict mastery better).
- v1.0 sims are reused only if they can reach grade A (85); otherwise they are excluded. The per-sim upgrade checklist is in `TODO.md`.
- The paper is revised in place (v0.07) with the same three co-authors, and instructions for rebuilding the v1.0 paper are kept.
- Comparison posters are grid-overlay posters in the pattern of `stem-robots/docs/posters`, documented in Chapter 10.

**Resolved by default** (you asked me to use the defaults; say so if any is wrong)

- **Old links:** a redirect table in Appendix G, with no `/v1/` deployment.
- **xAPI status:** Chapters 16–18 describe the runtime, the gateway and LRS-Lite as designs with working pieces until a POST path is proven, and say plainly that no learner data have been collected yet.
- **Release gate:** grade B or better for new sims and A for carried-over v1.0 sims (see §5).
- **Showcase examples:** Appendix F includes sims and posters from stem-robots and xapi-course.
- **Your original item 1** (cut off) is read as the xAPI skill and the xapi-course book.

**Still open**

- None blocking. The paper title stays unless the authors decide otherwise.

## 12. Next Steps

1. Add the plan to `mkdocs.yml` (an "Appendices" nav section; it is not there yet).
2. Phase 1: a new course description and learning graph. The learning graph should treat mastery-prediction fidelity as a first-class concern (concepts for evidence, BKT, calibration, and so on), and confirm or reshape the 21-chapter map.
3. Phase 2: the skeleton (new nav, stubbed chapters, and spec blocks), in one commit on `main`. Commit and push only; no deploy until release.
4. Cover the nav status icons (§4.2a) in the skeleton and in the chapters listed there.
5. Work through the upgrade checklist in `TODO.md` as chapter specs adopt sims.
