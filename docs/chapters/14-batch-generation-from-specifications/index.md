---
title: Batch Generation from Specifications
description: Shows how to turn the specification blocks in a chapter into many MicroSims with extraction, scaffolding, status tracking, resumable runs and parallel workers.
generated_by: claude skill chapter-content-generator
date: 2026-09-30 11:01:12
version: 1.10
---

# Batch Generation from Specifications

## Summary

Shows how to generate many MicroSims from chapter specifications with status tracking, resumable pipelines and parallel workers.

Students learn specification extraction, scaffolding, the status lifecycle and the coordinator pattern, plus nav status icons and cost. After it, they can run a batch from a chapter's specs.

## Concepts Covered

This chapter covers the following 14 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| Batch Generation | 23 |
| Spec Extraction | 10 |
| Specification JSON | 8 |
| Scaffold Generation | 5 |
| Status Lifecycle | 5 |
| Sim Status File | 2 |
| Resumable Pipeline | 1 |
| Parallel Workers | 2 |
| Coordinator Pattern | 1 |
| Chapter Diagram Coverage | 1 |
| Navigation Update | 3 |
| Iframe Insertion | 1 |
| Nav Status Icon | 2 |
| Generation Cost | 1 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: What Is a MicroSim](../01-what-is-a-microsim/index.md)
- [Chapter 2: Anatomy of a MicroSim](../02-anatomy-of-a-microsim/index.md)
- [Chapter 5: Generating MicroSims with AI Skills](../05-generating-microsims-with-ai-skills/index.md)
- [Chapter 12: Width-Responsive Design and Iframe Heights](../12-width-responsive-design-and-iframe-heights/index.md)

---

## Welcome

!!! mascot-welcome "One Chapter, Many Simulations"
    ![Bounce waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Writing one MicroSim by hand is fun; writing thirty is a job for a pipeline. This chapter shows you how a chapter full of specifications becomes a folder full of working simulations, with a status board that always tells you what is left. Let's bounce it around!

Every chapter in this book carries specification blocks, the collapsible sections that describe a MicroSim before it exists. Chapter 5 showed how a single specification becomes a single MicroSim through an AI skill. This chapter scales that idea up. We follow the batch workflow defined in the `microsim-generator` skill, look at what each of its Python utilities does, and see how the work is tracked, resumed and divided among several workers.

## Batch Generation: The Whole Pipeline

**Batch generation** is the practice of producing every MicroSim specified in a chapter (or a whole book) in one organized run, rather than by hand-crafting each one in a separate conversation. The `microsim-generator` skill defines it as a fixed sequence of steps. Deterministic steps, such as parsing text or creating folders, are done by small Python scripts. The one creative step, writing each simulation's JavaScript file, is done by the AI agent.

That division is the central idea. A script never guesses and never tires, so it should do everything that has one correct answer. An agent is good at judgment and code, so it should do only what needs them. The skill's own summary states the payoff: the utilities are estimated to save about 430,000 tokens per batch run, and the README of the utilities gives per-script estimates such as about 150,000 tokens for scaffolding. These are the skill authors' estimates, not measurements made for this book.

The batch route in the skill runs in this order:

1. Extract the specifications from a chapter into a JSON file and a status file.
2. Scaffold a directory for each specification.
3. Pass an instructional design checkpoint for each MicroSim.
4. Write the `.js` file for each MicroSim (the agent's creative work).
5. Insert and fix the iframes in the chapter.
6. Validate quality, synchronize iframe heights and test control visibility.
7. Update the site navigation.
8. Capture a screenshot and run a visual layout review.

Steps 6 to 8 belong to the quality chain covered in [Chapter 13](../13-quality-assurance-and-automated-layout-review/index.md), and step 3 applies the objective-to-interaction matching from [Chapter 3](../03-learning-objectives-and-blooms-taxonomy/index.md). This chapter concentrates on steps 1, 2, 5 and 7, plus the bookkeeping that ties them together. The diagram below lets you step through the sequence and see which stages a script handles and which the agent handles.

#### Diagram: Batch Generation Pipeline Stepper

<iframe src="../../sims/batch-generation-pipeline-stepper/main.html" width="100%" height="642px" scrolling="no"></iframe>

[Run the Batch Generation Pipeline Stepper MicroSim Fullscreen](../../sims/batch-generation-pipeline-stepper/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Batch Generation Pipeline Stepper</summary>
Type: microsim
**sim-id:** batch-generation-pipeline-stepper<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: differentiate): The learner will differentiate the steps that a Python utility performs from the step that the AI agent performs, and will trace what each step reads and writes.

Layout: a horizontal row of eight rounded boxes, one per pipeline step, above a white detail panel and a control region. Script steps are drawn in blue, the agent step (write the .js file) in orange, and the instructional design checkpoint in gray. The drawing region is aliceblue and the control region is white.

Data: for each step, the utility name (for example extract-sim-specs.py), the files it reads, the files it writes, and one plain-language sentence saying what it does. The content comes from the batch steps listed in this chapter.

Controls:

- Buttons "Previous" and "Next" move a highlight through the eight steps
- Clicking any box selects that step directly
- Checkbox "Show files" toggles arrows for the files each step reads and writes
- Hovering a box shows a tooltip with the step's purpose

Behavior: the selected step is outlined in bold and its detail panel lists inputs, outputs and the actor (script or agent). A counter reads "Step N of 8". Files written by earlier steps appear as small document icons in the panel of later steps that read them.

Responsive design: the canvas width follows the container width on every window resize, boxes wrap to two rows below 600 pixels, and the controls remain visible at 400 pixels wide.

Implementation: p5.js with createButton and createCheckbox controls positioned relative to drawHeight. Include a describe() call for accessibility.
</details>

## Spec Extraction and Specification JSON

The pipeline begins by reading the chapter itself. **Spec extraction** is the step that scans a chapter's Markdown for specification blocks and turns each into a structured record, so no one has to parse the prose by hand. It is performed by `extract-sim-specs.py`, which looks for level-four headings that begin with `#### Diagram:` or `#### Drawing:` and reads the collapsible details block that follows each one.

Three flags matter most. The `--project-dir` flag names the textbook's root (the folder containing `mkdocs.yml`) and is auto-detected if omitted. The `--chapter` flag limits the scan to one chapter directory. The `--output` flag writes the specifications to a file, and `--status-file` additionally writes a status file, described later in this chapter.

The output is the **specification JSON**: a JSON array with one object per specification. Each object has twelve fields, listed in the utilities' README: `sim_id`, `title`, `summary`, `heading_type`, `chapter`, `element_type`, `bloom_level`, `library`, `iframe_src`, `iframe_height`, `spec_text` and `status`. The `sim_id` is taken from the explicit `**sim-id:**` line if there is one, then from an existing iframe path, and otherwise from a kebab-case version of the heading. The `library` comes from the `**Library:**` line, or from the `Implementation:` line if that is missing. The `spec_text` field holds the entire details block, so the later steps can hand the full specification to the agent.

A worked example makes this concrete. Chapter 1 of this book contains seven specification blocks. Running the extractor against it on 2026-09-30 produced a JSON array of seven objects. Its first object was the Bouncing Ball Gravity Lab, and its fields were as follows (the long `spec_text` is shortened here):

```json
{
  "sim_id": "bouncing-ball-gravity-lab",
  "title": "Bouncing Ball Gravity Lab",
  "summary": "Bouncing Ball Gravity Lab",
  "heading_type": "Diagram",
  "chapter": "01-what-is-a-microsim",
  "element_type": "microsim",
  "bloom_level": "Create",
  "library": "p5.js",
  "iframe_src": "",
  "iframe_height": "",
  "status": "Specified",
  "spec_text": "(the full details block, omitted here)"
}
```

The command that produced it was:

```bash
python3 extract-sim-specs.py \
    --project-dir /Users/dan/projects/microsims \
    --chapter 01-what-is-a-microsim \
    --output ch01-specs.json \
    --verbose
```

Look closely at the `bloom_level` value. The specification says the objective's Bloom level is Understand with the verb explain, yet the extractor reported Create.

!!! mascot-warning "Extracted Bloom Levels Are Guesses"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    When a spec has no field the extractor recognizes, it guesses the Bloom level by scanning for keywords, and `createSlider` and `createButton` in the spec text matched the word "create". Always read `bloom_level` in the JSON before trusting it, and add a `Bloom Taxonomy Level:` line to the spec instead of editing the JSON.

This behavior comes from `_infer_bloom_from_text`, a best-effort keyword list that is checked in a fixed order with the Create verbs first. The lesson generalizes: extraction is only as good as the regular expressions behind it, so a batch run should begin by reading the specification JSON and confirming that every `sim_id`, `library` and `bloom_level` is what the author intended.

The `create-microsim-todo-json-files.py` utility offers a second, per-sim form of the same idea. It writes one JSON file per unimplemented specification into `docs/sims/TODO/`, skipping any `sim-id` that already has a `main.html`. Its records carry a `diagram_name`, a `learning_objective` and a `completion_status`, which suits handing a single specification to a single worker.

## Scaffold Generation

**Scaffold generation** is the step that creates the boilerplate files for each specified MicroSim, so the agent only has to write the simulation logic. The script `generate-sim-scaffold.py` reads the specification JSON and, for each `sim_id`, creates a directory `docs/sims/<sim-id>/` containing three files: `main.html`, `index.md` and `metadata.json`.

The three files have distinct jobs. The `main.html` file loads the correct library from a CDN (a content delivery network, a public server that hosts shared code libraries), includes a `<main>` element and the schema meta tag, and loads `<sim-id>.js`. The `index.md` file holds the documentation page: front matter, an iframe, a fullscreen link and a lesson plan skeleton. The `metadata.json` file holds the Dublin Core and educational metadata that Chapter 15 develops. The `--spec-file` flag is required; `--sim-id` restricts the run to one MicroSim; `--dry-run` prints what would be created; and `--force` overwrites existing files.

A short worked example shows the safe way to run it. Start with a dry run for one MicroSim, inspect the plan, then run it for real:

```bash
python3 generate-sim-scaffold.py --spec-file ch01-specs.json \
    --sim-id bouncing-ball-gravity-lab --dry-run
python3 generate-sim-scaffold.py --spec-file ch01-specs.json \
    --project-dir /Users/dan/projects/microsims --verbose
```

By default the scaffolder skips any directory that already exists. That rule protects finished work, but it also means a half-built sim (with `main.html` and a `.js` file but no `index.md`) is skipped as well. The skill's remedy is `--force`, which the skill describes as safe because the scaffold never writes the `.js` file, where the creative work lives.

!!! mascot-warning "Scaffolds Contain Placeholders"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    The generated `index.md` is full of `TODO` lines, and the templates in the script default to generic values such as a high school geometry lesson. Treat a scaffold as a starting form, and fill in the description, the learning objectives and the metadata for your own subject before the sim is called done.

## The Status Lifecycle and the Sim Status File

A batch touches dozens of MicroSims at different stages, so the pipeline needs a way to say where each one stands. The **status lifecycle** is the ordered set of states a MicroSim passes through on its way from an idea to a published page. The utilities define five: `specified`, `scaffolded`, `implemented`, `validated` and `deployed`. A sixth value, `reused`, sits outside the sequence and marks a MicroSim that the chapter embeds from another book, which is treated as complete.

The **sim status file**, usually named `sim-status.json`, records the current state of every MicroSim. It is created by adding `--status-file` to the extraction command. Each entry holds a `sim_id`, `title`, `chapter`, `bloom_level`, `library`, `status`, `has_iframe` and `quality_score`.

The important design choice is that the status is not typed in by a person. `extract-sim-specs.py` derives it from the files on disk each time it runs, using the rules in the table below. The table summarizes rules that the paragraphs above have introduced, and the checks are cumulative from top to bottom.

| Status | How the script detects it |
|--------|---------------------------|
| `specified` | A specification exists in a chapter but no sim directory does |
| `scaffolded` | The directory has `main.html` but no substantive JavaScript |
| `implemented` | A `.js` file with more than 50 lines exists |
| `validated` | The sim is implemented and the `quality_score` in `index.md` front matter is 70 or higher |
| `deployed` | The sim is validated and the chapter has an iframe for it |
| `reused` | The spec's `**Status:**` line says Reused |

A **resumable pipeline** follows directly from this design. Because status is recomputed from the file system, a run that stops halfway leaves an accurate record of its own progress. A new session, with a fresh context window, re-runs the extractor, reads the status file, skips everything at `implemented` or later, and continues with the sims still at `specified` or `scaffolded`. Nothing depends on the previous conversation's memory. The skill documents exactly this recovery procedure for the case where a batch fills the context window mid-chapter.

Let us apply the rules to a sim. Suppose `bouncing-ball-gravity-lab` has a directory with `main.html`, a 120-line `.js` file, a `quality_score` of 62 and an iframe in Chapter 1. The `.js` file makes it `implemented`. The score of 62 is below 70, so it never becomes `validated`, and because `deployed` requires validation, it stays `implemented` despite the iframe. Raising the score to 78 promotes it to `deployed` on the next run.

The next specification lets you experiment with those rules.

#### Diagram: Sim Status Rule Explorer

<iframe src="../../sims/sim-status-rule-explorer/main.html" width="100%" height="707px" scrolling="no"></iframe>

[Run the Sim Status Rule Explorer MicroSim Fullscreen](../../sims/sim-status-rule-explorer/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Sim Status Rule Explorer</summary>
Type: microsim
**sim-id:** sim-status-rule-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Apply; verb: predict): The learner will predict the status that the extraction script assigns to a MicroSim given the state of its files, and will explain which rule produced the result.

Layout: a control region on the left half and a lifecycle strip on the right half. The strip shows six labeled boxes in a row: specified, scaffolded, implemented, validated, deployed, plus a separate reused box below. The current status box is filled and the others are outlined.

Controls:

- Checkbox "Sim directory exists" (default off)
- Checkbox "main.html exists" (default off)
- Slider "Lines in the .js file" from 0 to 300 in steps of 10, default 0
- Slider "Quality score" from 0 to 100 in steps of 1, default 0
- Checkbox "Chapter has an iframe" (default off)
- Checkbox "Spec says Status: Reused" (default off)
- Button "Predict first" hides the result until the learner chooses one of the six statuses, then reveals the true status and the rule that fired

Behavior: apply the detection rules from this chapter in order. Reused overrides everything. Without a directory the result is specified. Without main.html the result stays specified. With main.html the result is scaffolded, becoming implemented above 50 lines of JavaScript, validated at a score of 70 or above, and deployed when an iframe is also present. Show a one-line explanation such as "Score 62 is below 70, so not validated".

Responsive design: the canvas width follows the container width on every window resize, the two halves stack vertically below 600 pixels, and sliders shrink to fit while remaining visible at 400 pixels wide.

Implementation: p5.js with createSlider, createCheckbox and createButton controls positioned relative to drawHeight. Include a describe() call for accessibility.
</details>

!!! mascot-thinking "The Files Are the Truth"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Notice why this pipeline survives interruptions: the status file is a report about the file system, never the other way around. Think of it like a scoreboard that a referee recounts from the field each time, instead of a tally someone might forget to update.

## Iframe Insertion and Navigation Update

Once the JavaScript exists, the chapter must actually show the MicroSim. **Iframe insertion** is the step that adds an `<iframe>` embed to the chapter for every specification that lacks one. The script `add-iframes-to-chapter.py` finds each `#### Diagram:` or `#### Drawing:` heading, looks ahead a limited number of lines for an existing iframe, and if none is found, inserts an iframe and a fullscreen link just before the details block. The inserted tag is a relative path of the form `../../sims/<sim-id>/main.html` with `width="100%"`, `scrolling="no"` and a height of 450 pixels by default. Relative paths matter because an absolute `/sims/...` path breaks when the site is served from a subdirectory on GitHub Pages.

Two flags refine the run. The `--fix-heights` flag reads each sim's `.js` file for its canvas height and sets the iframe to that height plus 2 pixels for the border. The `--fix-paths` flag rewrites absolute `/sims/` paths into relative ones. The `--chapter` flag selects one chapter and `--all` processes every chapter, while `--dry-run` previews the edits. Chapter 12 explains the `CANVAS_HEIGHT` convention and the sync utility that keeps heights correct across every page that embeds a sim, so use that utility for the final heights and treat this script's height fix as a first pass.

The second bookkeeping step is the **navigation update**. The script `update-mkdocs-nav.py` scans `docs/sims/` for directories that contain an `index.md`, reads each display title (from front matter, then the first heading, then the folder name), and replaces the whole `- MicroSims:` section of `mkdocs.yml` with an alphabetical list. It accepts `--project-dir`, `--dry-run` and `--verbose`, and is idempotent, meaning that running it twice gives the same result as running it once.

!!! mascot-tip "Dry-Run Before You Rewrite"
    ![Bounce giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Both the iframe script and the nav script rewrite files you care about, and the nav script replaces the entire MicroSims section, so a hand-edited entry there will vanish. Run each with `--dry-run --verbose` first, read the plan, and commit your working tree beforehand so `git diff` can show exactly what changed.

The batch also needs a view of coverage across chapters. **Chapter diagram coverage** is a report of every diagram and MicroSim specified in each chapter, with its status, type and Bloom level, so an author can see which chapters are thin on interactive elements and which specifications are still unbuilt. The `microsim-utils` skill generates it with `diagram-report.py`, which writes two pages into `docs/learning-graph/`: `diagram-table.md`, a table view, and `diagram-details.md`, a per-chapter detailed view. The report estimates a difficulty rating from the number of controls, so treat it as a planning aid rather than a measurement.

## Nav Status Icons

The status file serves the pipeline, but readers see status in a different place. A **nav status icon** is a small colored icon displayed beside a page's entry in the site's navigation bar, showing at a glance how finished that MicroSim is. Material for MkDocs supports it through a `status` value in each page's front matter, and a sim's `index.md` might contain `status: implemented`, the same key that Chapter 2 introduced.

Three pieces make the icons appear on the community edition of Material for MkDocs, and the sister project `learning-record-store` shows all three working. First, each page sets `status:` in its front matter. Second, an `extra.status` block in `mkdocs.yml` maps each value to its hover text. Third, `docs/css/extra.css` paints the icons: Material renders each status as an empty span, and a CSS `mask-image` driven by a custom property named `--md-status--<name>` supplies the shape.

That project's `mkdocs.yml` uses these five values, with their tooltip text summarized here: `scaffold` (placeholder, not yet implemented), `built` (complete, awaiting review), `implemented` (the MicroSim works), `instrumented` (it emits xAPI events) and `approved` (tested and approved). Its stylesheet colors them red, orange, blue, teal and green respectively, and pins a darker shade on hover.

!!! mascot-warning "Do Not Set theme.icon.status"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    It is tempting to configure the icons under `theme.icon.status`, but that key is an Insiders-only feature and community Material ignores it silently, so the icons fall back to a generic circled "i" with no build warning. Define the `--md-status--<name>` variables in `extra.css` instead, and set the color on the `:after` rule, because the SVG is applied as a mask.

The nav status is the reader's view, and the batch lifecycle is the pipeline's view, so the two need a mapping. This book's plan proposes one but leaves the details open: `scaffolded` corresponds to `scaffold`, `implemented` to `implemented`, `validated` to `built` or `approved` depending on score, and instrumentation to `instrumented`, with a decision still needed on who sets `approved`. The `sync-status.py` script from the `add-xapi-events-to-microsim` skill already automates one row of it. With `--apply` it sets `status: instrumented` on any sim that carries xAPI handling, and it never overwrites a human sign-off such as `approved`. Chapter 16 covers that step. As of this writing, this repository's `mkdocs.yml` and `extra.css` do not yet contain the status configuration; the plan schedules it for the site skeleton.

#### Diagram: Nav Status Icon Legend

<iframe src="../../sims/nav-status-icon-legend/main.html" width="100%" height="552px" scrolling="no"></iframe>

[Run the Nav Status Icon Legend MicroSim Fullscreen](../../sims/nav-status-icon-legend/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Nav Status Icon Legend</summary>
Type: infographic
**sim-id:** nav-status-icon-legend<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Understand; verb: match): The learner will match each nav status icon and color to its meaning and to the batch lifecycle state that usually produces it.

Layout: a mock navigation sidebar on the left listing five sample MicroSim titles, each with a colored status icon, and a detail panel on the right. The drawing region is aliceblue and the control region is white.

Data: five statuses with color and meaning: scaffold (red, filled circle, placeholder not yet implemented), built (orange, filled circle, awaiting review), implemented (blue, filled circle, the MicroSim works), instrumented (teal, broadcast signal, emits xAPI events), approved (green, check circle, tested and approved).

Controls:

- Hovering an icon shows its tooltip text exactly as it would appear in the nav
- Clicking an icon selects it and fills the detail panel with the meaning and the related lifecycle state
- Button "Quiz me" hides the labels and asks the learner to click the icon that means a given description, then scores the answer
- Toggle "Dark mode" switches the mock sidebar between light and dark backgrounds to confirm the colors stay readable

Responsive design: the canvas width follows the container width on every window resize, the detail panel moves below the sidebar under 600 pixels, and all controls remain visible at 400 pixels wide.

Implementation: p5.js with createButton and createCheckbox controls positioned relative to drawHeight. Include a describe() call for accessibility.
</details>

## Parallel Workers and the Coordinator Pattern

A single agent working through a long list of sims sequentially is reliable but slow, and the `microsim-generator` skill defaults to sequential execution unless the user asks for parallel execution. When the batch is large, **parallel workers** are several AI agents that each build a separate subset of the MicroSims at the same time. Splitting works because each MicroSim lives in its own directory, so two workers rarely edit the same file.

Files that are shared, however, need one owner. The **coordinator pattern** assigns one agent, the coordinator, all the per-book steps that must happen once and in a fixed order, while the workers do the per-sim steps. The `add-xapi-events-to-microsim` skill describes the split as it was used on the 20 sims of the `eight-hour-entrepreneur` book on 2026-09-26. The coordinator installs the shared runtime before any worker starts, wires and verifies one sim by hand as a reference, and at the end syncs status, runs the whole-book checks and does `mkdocs build --strict`. Workers do the steps for their own sims only and must not touch `mkdocs.yml`, `extra.css`, shared `docs/js/` files, chapter files, `status:` values or git. The coordinator also relays discoveries between workers, since a fix found by one often applies to another's sims.

Applied to batch generation, the same split gives a sensible plan. The coordinator runs `extract-sim-specs.py` and `generate-sim-scaffold.py` once, hands each worker a group of `sim_id` values (grouping by library keeps each worker's context focused), and afterward runs the iframe, height, navigation and screenshot steps that touch shared files. This mapping is our design suggestion built from the two skills; the batch-generation skill itself has been documented for sequential runs, and the parallel split has been documented for the xAPI wiring task.

## Generation Cost

**Generation cost** is the total resource a batch consumes: agent tokens (the units in which a language model's input and output are counted and billed), elapsed time, and the human minutes spent reviewing. The utilities exist to cut the first of these, because a script that parses specifications spends no tokens on work an agent would otherwise repeat for every sim. The README's estimates, cited earlier, are the only figures the source material gives, and they are design estimates rather than logged results.

Parallel workers trade cost against time. They can shorten the elapsed time of a large batch, but the `chapter-content-generator` skill warns that parallel execution carries a substantial token penalty, and it cites about 38 percent additional tokens for chapter text. That figure concerns text generation and has not been measured for MicroSim batches, so parallelism is worth it only when wall-clock time matters more than the bill. The plan for this book lists generation cost or time per sim as an empirical figure to collect from the portfolio pass, and it does not yet exist. Until then, treat any per-sim cost as unmeasured.

!!! mascot-celebration "Batch Pipeline Mastered"
    ![Bounce celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now take a chapter's specifications through extraction, scaffolding, status tracking, iframe insertion and navigation update, and you know how to split the work between a coordinator and its workers. That is a full batch run, and it is one of the harder skills in this book.

## Chapter Summary

- **Batch generation** turns a chapter's specifications into MicroSims in one run, with scripts doing every deterministic step and the agent writing only the `.js` files.
- **Spec extraction** with `extract-sim-specs.py` produces the **specification JSON**, one object per `#### Diagram:` block, and its inferred Bloom levels should be checked by eye.
- **Scaffold generation** creates `main.html`, `index.md` and `metadata.json` for each sim, skips existing directories unless `--force` is used, and leaves `TODO` placeholders to fill.
- The **status lifecycle** (`specified`, `scaffolded`, `implemented`, `validated`, `deployed`, plus `reused`) is recomputed from the file system into the **sim status file**, which makes the pipeline **resumable**.
- **Iframe insertion** and the **navigation update** wire the finished sims into the chapters and the site, and both should be dry-run first.
- **Chapter diagram coverage** reports show which chapters have unbuilt or thin interactive elements.
- A **nav status icon** needs three parts on community Material: front matter `status`, an `extra.status` legend and CSS mask variables, never `theme.icon.status`.
- **Parallel workers** build sims side by side while a **coordinator** owns the shared files. **Generation cost** figures for MicroSims are still unmeasured.

The next chapter turns from producing MicroSims to describing them, showing how metadata makes a growing portfolio searchable and reusable.
