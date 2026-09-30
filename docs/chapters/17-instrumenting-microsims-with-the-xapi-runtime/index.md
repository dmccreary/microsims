---
title: Instrumenting MicroSims with the xAPI Runtime
description: Shows how to add xAPI reporting to a MicroSim with the shared runtime, its handles and adapters, concept mapping, policy precedence and the automated quality check.
generated_by: claude skill chapter-content-generator
date: 2026-09-30 11:12:22
version: 1.10
---

# Instrumenting MicroSims with the xAPI Runtime

## Summary

Shows how to add xAPI reporting to a MicroSim using the shared runtime, its handles and library adapters, and how to map interactions to concepts.

Students learn the config file, policy precedence, teaching mode, the instrumented status and the quality check. After it, they can instrument a MicroSim without changing how it behaves.

## Concepts Covered

This chapter covers the following 16 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| Poster Instrumentation | 1 |
| Sub-Activity Fragment | 1 |
| LRS Runtime Script | 25 |
| LRS Config File | 14 |
| Library Adapter | 4 |
| Slider Handle | 1 |
| Item Handle | 1 |
| Button Handle | 1 |
| Question Handle | 1 |
| Guarded Call | 1 |
| Concept Mapping | 10 |
| Teaching Mode | 2 |
| Policy Precedence | 11 |
| Instrumented Status | 1 |
| Statement Log Viewer | 1 |
| xAPI Quality Check | 1 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: What Is a MicroSim](../01-what-is-a-microsim/index.md)
- [Chapter 2: Anatomy of a MicroSim](../02-anatomy-of-a-microsim/index.md)
- [Chapter 3: Learning Objectives and Bloom's Taxonomy](../03-learning-objectives-and-blooms-taxonomy/index.md)
- [Chapter 10: Image Overlays and Comparison Posters](../10-image-overlays-and-comparison-posters/index.md)
- [Chapter 13: Quality Assurance and Automated Layout Review](../13-quality-assurance-and-automated-layout-review/index.md)
- [Chapter 14: Batch Generation from Specifications](../14-batch-generation-from-specifications/index.md)
- [Chapter 15: Metadata, Search and Reuse](../15-metadata-search-and-reuse/index.md)
- [Chapter 16: xAPI Statements and Evidence](../16-xapi-statements-and-evidence/index.md)

---

## Welcome

!!! mascot-welcome "From Reading Evidence to Producing It"
    ![Bounce waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Chapter 16 taught you to read xAPI statements; this chapter teaches you to make a MicroSim produce them, in a few dozen lines, without changing how it behaves. By the end you can take a working simulation, wire it to the shared runtime, and check the result with a script. Let's bounce it around!

Chapter 16 defined what counts as evidence: statements, three verbs, a producer contract and six evidence classes. This chapter is the practical counterpart. It follows the workflow of the `add-xapi-events-to-microsim` skill, which takes a MicroSim that already works and makes it report what a learner did. We start with the shared runtime and its configuration, then the handles a MicroSim calls, then the adapters, concept mapping and the tools that verify the work.

A note on status before we begin. The runtime described here exists and runs in the `learning-record-store` repository, and its four reference MicroSims emit statements today. However, as of that repository's `TODO.md` dated 2026-09-26, no emitter sends a statement to any store: the runtime keeps statements in memory and shows them in a panel, and the network transport is a designed seam that has not been built. Everything below is therefore about producing correct statements, which is built and tested, not about delivering them, which is not yet built.

## The LRS Runtime Script

Every instrumented MicroSim needs the same machinery: something to build contract-valid statements, something to decide between Full and Compact mode, and something to close open intervals when the learner leaves. Rewriting that in each MicroSim would create many slightly different implementations. The design instead uses one shared set of files, the **LRS runtime script**, meaning the small group of JavaScript files (`lrs-xapi.js`, `lrs-lite-sim.js`, `lrs-sim.js` and `xapi-json-viewer.js`, plus the stylesheet `lrs-xapi.css`) that every instrumented MicroSim loads. The files are identical in every textbook. The MicroSim's own code stays a thin mapping of roughly 20 to 60 lines, according to the skill, and is never a copy of the runtime.

Each file has one job. `lrs-xapi.js` builds every statement and enforces the producer contract from Chapter 16. `lrs-lite-sim.js` reads the policy, tracks sessions and detects focus loss. `lrs-sim.js` provides the API the MicroSim calls, `LRSSim`, and renders the optional teaching panel. `xapi-json-viewer.js` opens one statement in a formatted view.

Load order matters, because each file expects the ones before it. The block below sits in the MicroSim's `main.html`, before the MicroSim's own script, and paths are relative to `docs/sims/<name>/main.html`.

```html
<link rel="stylesheet" href="../../css/lrs-xapi.css">
<script src="../../js/lrs-config.js"></script>
<script src="../../js/lrs-xapi.js"></script>
<script src="../../js/lrs-lite-sim.js"></script>
<script src="../../js/lrs-sim.js"></script>
<script src="../../js/xapi-json-viewer.js"></script>
<script src="your-sim.js"></script>
```

The skill provides `install-runtime.py` to put these files in a book. Running `install-runtime.py --book . --check` reports files that are missing or that differ from the canonical copy, and running it without `--check` copies the missing ones. If a book's copy has drifted from the canonical one, the script reports the difference and refuses to overwrite it unless given `--force`, which the skill says to use only after asking the user. This protects a book that deliberately pins an older runtime.

!!! mascot-warning "Wrap Vendored Code, Never Edit It"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Do not edit the runtime files or a shared library file such as `shared-libs/diagram.js`; a fix in one book silently forks it from every other. Wrap the function or add a listener beside the original from your own script, and if the runtime truly lacks a feature, use `lrs.emit(spec)` or report the gap.

## The LRS Config File

A shared runtime still has to know whose statements it is building. That identity lives in the **LRS config file**, `docs/js/lrs-config.js`, one per textbook. It defines a global object, `window.LRS_CONFIG`, whose fields come straight from the file in the `learning-record-store` repository:

| Field | Meaning |
|-------|---------|
| `siteUrl` | The book's published address with a trailing slash; every activity IRI starts with it |
| `textbookId` and `version` | The textbook identity placed in each statement's grouping |
| `conceptPrefix` | The namespace for concept identifiers, explained under Concept Mapping below |
| `xapi` | The default policy for every MicroSim: `compact` and `teaching` |
| `quizzes` | The policy for chapter quiz pages, which have no metadata file of their own |

The file is loaded before the runtime, and `install-runtime.py` generates it from `mkdocs.yml` only when it is absent. It is never overwritten, because it is the book's identity. A wrong `siteUrl` mislabels every statement the book emits, so it deserves a check by a person when a book is first set up.

In the reference book the default policy is `xapi: { compact: true, teaching: false }`. In words: a MicroSim is silent to the learner, and when statements are eventually kept they are summarized one per session. Both settings are policy choices, not properties of any one MicroSim, and the next sections show how a single MicroSim overrides them.

## Policy Precedence

A policy has several places it can be set, so the runtime needs a rule for conflicts. **Policy precedence** is the fixed order in which those sources are consulted, from lowest to highest priority:

1. The runtime's built-in defaults.
2. The book's `lrs-config.js` `xapi` block.
3. The `policy` option a page passes to `LRSSim.create`.
4. The MicroSim's own `metadata.json` `xapi` block.
5. The URL switch `?xapi=`, which applies to one visit only.

The keys being resolved are `compact`, `teaching`, and three timers that end a session: `idleMs` (no input for that long while nothing is running), `offscreenMs` (the MicroSim mostly out of view) and `blurMs` (the frame without keyboard focus). The runtime's defaults for the timers are 90000, 10000 and 30000 milliseconds. Resolution is per key, so a `metadata.json` that sets only `teaching: true` leaves `compact` to whatever the layers below decided.

The reason for this layering is scope. A person can change one setting for an entire textbook in one file, change one MicroSim in its own metadata, and change a single visit by editing a URL, with no file touched. A worked example follows. Suppose the book's default is `compact: true, teaching: false`, and a MicroSim's `metadata.json` says `"compact": false, "teaching": true`. That MicroSim starts in Full mode with its panel showing, because layer 4 beats layer 2. A reader who opens the page with `?xapi=production` overrides layer 4 for that visit and hides the panel, because layer 5 is highest.

#### Diagram: Policy Precedence Resolver

<iframe src="../../sims/policy-precedence-resolver/main.html" width="100%" height="702px" scrolling="no"></iframe>

[Run the Policy Precedence Resolver MicroSim Fullscreen](../../sims/policy-precedence-resolver/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Policy Precedence Resolver</summary>
Type: microsim
**sim-id:** policy-precedence-resolver<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Apply; verb: determine): The learner will determine the final `compact` and `teaching` values for a MicroSim by applying the five policy layers in order, and will identify which layer supplied each value.

Layout: the drawing region shows five stacked horizontal bars, lowest priority at the bottom (runtime defaults) and highest at the top (URL switch). Each bar shows the two keys `compact` and `teaching` as small boxes reading true, false or "not set". To the right, a result box shows the resolved values. The control region is white below the drawing region.

Controls:

- Three dropdowns "Book config", "metadata.json" and "URL switch", each with choices for the two keys (not set, true, false, and for the URL the tokens teaching, production, full, compact)
- Button "Resolve" that animates a highlight from the bottom bar upward, overwriting the running value wherever a layer sets a key
- Button "Reset" that returns every layer to its starting state
- Checkbox "Show which layer won" that labels each resolved value with its source layer

Data: the runtime defaults are fixed at compact true and teaching false, matching the runtime. One preset button loads the worked example from the text.

Interactions: hovering a bar shows a tooltip naming the layer and its file. Every hover tooltip text is also written to the console as a log line so it can later feed an activity log.

Responsive design: the canvas width follows the container width on every window resize, the bars scale to the width, and the controls wrap onto a second row below 500 pixels.

Implementation: p5.js with createSelect and createButton controls positioned relative to the drawing height, and a describe() call for accessibility.
</details>

## Teaching Mode

Production MicroSims stay silent. **Teaching mode** is the policy state in which the runtime renders a panel beside the MicroSim showing the statements it emits, along with controls to switch between Full and Compact and a Simulate Done button that imitates the learner leaving. It is set by `teaching: true` in any policy layer, and it exists for MicroSims that exist to teach xAPI, and for a reader who wants to look under the hood.

The URL switch makes any instrumented MicroSim a teaching aid for one visit. Adding `?xapi=teaching` to the page that embeds the MicroSim turns the panel on, and by default the panel starts on Full mode. The tokens are `teaching`, `production`, `full` and `compact`, and they can be combined, as in `teaching,compact`. The runtime grows the embedding iframe to fit the panel.

One layout rule follows from this. A MicroSim whose container fills its frame (`100vh`, or `html` and `body` at 100 percent) grows with the iframe, so the runtime cannot make room for the panel. The runtime detects this, stops, and writes a console warning. The remedy is CSS that applies only while the panel exists, such as `body:has(> .xapi-panel) #network { height: 480px; }`, which costs nothing in production where no panel is present.

## The Statement Log Viewer

The teaching panel contains what this chapter calls the **statement log viewer**: a scrolling list with one line per statement, plus a `View Formatted JSON` button. Pressing the button, or a summary line, opens the most recent statement pretty-printed and colored in a new browser tab. The runtime file `xapi-json-viewer.js` builds that tab from a `Blob` held in memory, and its header states that it posts nothing. A new tab is used because a MicroSim sits in a fixed-height iframe, where a panel large enough for a statement of about sixty lines would be clipped or would force the iframe taller for everyone.

Lines that are not statements also appear in the log. A call to `lrs.note(msg)` writes a line explaining why something was deliberately not emitted, and the runtime writes "folded into the session summary" lines in Compact mode. These are teaching aids and vanish when teaching mode is off.

!!! mascot-thinking "Compare the Two Streams"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Do the same five slider steps in Full and then Compact and watch the log. Full shows every step; Compact shows nothing until the session ends, then one summary. Seeing what compaction keeps and what it drops is worth more than reading about it.

## Handles: Slider, Item, Button and Question

A MicroSim never constructs a statement itself. It calls `LRSSim.create(opts)` once, receives an instance (conventionally named `lrs`), and asks it for a **handle** for each object it wants to report on. A handle is a small object that knows one object's identifier, name and concept, and offers methods matching the evidence class from Chapter 16. Each handle takes a *fragment key*, the stable local name explained in Chapter 16 and formalized below, plus an options object with `name` and `concept`.

The four handles the chapter's concept list names map to four of the evidence classes:

| Handle | Evidence class | Methods | Typical source |
|--------|----------------|---------|----------------|
| **Slider handle**, `lrs.slider(key, o)` | Continuous parameter | `.input(v)`, `.settle(v)` | slider, zoom, numeric input |
| **Item handle**, `lrs.item(key, o)` | Discrete inspection | `.study(mode, ms)` | click, hover of at least 600 ms, pin, select |
| **Button handle**, `lrs.button(key, o)` | Discrete press | `.press(action)` | Reset, Start/Pause toggle, checkbox |
| **Question handle**, `lrs.question(key, o)` | Assessment | `.answer({success, ...})` | quiz item, checked prediction |

A fifth kind, the runner from `lrs.runner({onStop})`, brackets a Start/Pause interval, and the option `pageDwell: true` covers MicroSims with no Run control.

The slider handle needs the most explanation. Its options include `min`, `max`, `initial`, `round` and `deadband`. The deadband defaults to the range divided by 60, and `round` sets the decimal places reported, which should match what the learner sees. Feed `.input(v)` every raw input event, because the runtime counts direction reversals on raw values, and call `.settle(v)` when the learner lets go. The item handle's `.study(mode, ms)` does not apply the hover threshold for you, since only the MicroSim knows when a hover began, so the adapter compares the dwell against `LRSSim.HOVER_MS` (600 ms). The runtime also defines `LRSSim.MISCLICK_MS` (250) and `LRSSim.GLANCE_MS` (1000). The question handle's `.answer` requires a boolean `success`, without which the concept rollup counts no attempt, and it emits immediately in both modes, so every attempt, wrong ones included, is its own statement.

The smallest complete example is the bouncing-ball MicroSim. The excerpt below creates the instance, one handle of each of three kinds, and calls them from the existing Start/Pause function. The runner's `onStop` callback makes the ball actually stop whenever the runtime closes a run, for example when the tab is hidden.

```js
lrs = LRSSim.create({ name: 'Bouncing Ball Simulation', concept: CONCEPT_ID,
                      source: 'the Bouncing Ball MicroSim', mount: '#xapi-slot' });
speedEvidence = lrs.slider('speed-slider', { name: 'Speed Slider',
                           concept: SPEED_CONCEPT_ID, initial: speed, deadband: 1 });
startPause = lrs.button('start-pause-control', { name: 'Start/Pause Control',
                        concept: CONCEPT_ID });
run = lrs.runner({ onStop: () => setRunning(false) });

function toggleSimulation() {
  if (isRunning) { if (lrs) { startPause.press('pause'); run.stop('paused'); } setRunning(false); }
  else           { if (lrs) { startPause.press('start'); run.start(); }        setRunning(true); }
}
```

In that MicroSim the concept identifiers are the illustrative placeholders `motion` and `adjustable-speed`, which its own comments label as placeholders. A production MicroSim would use real identifiers from its book, as the Concept Mapping section describes.

## The Guarded Call

A teacher may paste a p5.js MicroSim into the p5.js web editor, where none of the runtime exists. An unprotected call such as `lrs.slider(...)` would throw a `ReferenceError` there, and the sketch would never draw. A **guarded call** is an instrumentation call wrapped in a test that the runtime is present, so the MicroSim runs unchanged, and silently, without it. The pattern in the excerpt above shows the idiom: the instance variable starts as `null`, is created only inside `if (window.LRSSim)`, and every use is written `if (lrs)`.

Two details recur in practice. Name the instance `lrs`, not `x`, since p5.js sketches often use `x` for a position. And do not call `LRS.conceptId(...)` at the top level of a sketch, because `LRS` also does not exist in the editor; call it inside the guarded block or inside a function. In a non-p5 script, the equivalent guard is `if (!window.LRSSim) return;` at the top.

!!! mascot-tip "Prove the Guard with a Script"
    ![Bounce giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Do not trust a read-through to catch a missing guard. Run `check-no-runtime.py --book . <sim-name>`, which blocks the five runtime files, loads the MicroSim, clicks its buttons and fails on any uncaught error.

#### Diagram: Guarded Call Runtime Toggle

<iframe src="../../sims/guarded-call-runtime-toggle/main.html" width="100%" height="722px" scrolling="no"></iframe>

[Run the Guarded Call Runtime Toggle MicroSim Fullscreen](../../sims/guarded-call-runtime-toggle/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Guarded Call Runtime Toggle</summary>
Type: microsim
**sim-id:** guarded-call-runtime-toggle<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: distinguish): The learner will distinguish a guarded from an unguarded instrumentation call by observing what each does when the runtime is present and when it is absent.

Layout: the drawing region is split in two. The left half shows a small bouncing ball sketch. The right half shows a code excerpt with one line highlighted and a status strip that reads "Runs" or "ReferenceError: LRSSim is not defined". The control region is white below.

Controls:

- Toggle "Runtime loaded" (on: the runtime is present; off: simulates the p5.js editor)
- Radio "Call style" with choices "Unguarded lrs.slider(...)" and "Guarded if (lrs) ..."
- Button "Move slider" that fires one simulated slider input

Behavior: with the runtime on, both styles run and a one-line log shows one statement recorded. With the runtime off, the guarded style still runs and records nothing, while the unguarded style stops the ball and shows the error in the status strip. A short caption explains which line caused the outcome.

Responsive design: the canvas width follows the container width on every window resize, and below 500 pixels the two halves stack vertically. Controls remain visible at 400 pixels wide.

Implementation: p5.js with createCheckbox, createRadio and createButton controls positioned relative to the drawing height, and a describe() call for accessibility.
</details>

## Library Adapters

MicroSims are built with different libraries, and each exposes its interactions differently. A p5.js slider fires a `.input` callback, a Mermaid node fires a DOM event, and a Chart.js point fires a library callback. A **library adapter** is a reference document in the skill that says, for one library or MicroSim shape, which student acts map to which handle, where to attach the hooks, and what traps to avoid. The skill ships adapters for p5.js with DOM controls, p5.js canvas hit-tests, Mermaid and plain HTML, image overlays, chapter quiz pages, Chart.js, vis-network, vis-timeline, Plotly and Leaflet.

The adapters have different confidence levels, and the skill labels them. The p5.js DOM controls, Mermaid, image overlay, quiz page and Chart.js adapters are marked verified, meaning a MicroSim in the reference book proved them. The vis-network, Plotly and Leaflet adapters are marked unverified, drafted from library documentation and not yet piloted, and vis-timeline is partly verified (item clicks, hovers and steps) with zoom and pan unverified. The skill's instruction for an unverified adapter is to follow it but check its claims against the real MicroSim and report corrections, so treat those three adapters as starting points.

The p5.js DOM adapter shows what one looks like. It lists each p5 control with its existing hook and the call to add: `createSlider` maps to `.input` and `.changed`, a Start/Pause button to a press plus a runner, a Reset button to a press, and a button that checks the student's choice to a question answer. It also records a trap that is easy to miss: p5 element hooks replace rather than chain. A second call to `slider.input(fn)` silently disconnects the MicroSim's own handler, so add the handle call inside the existing function, or attach a plain DOM listener beside it with `slider.elt.addEventListener`.

## Poster Instrumentation

Chapter 10 built image overlays and comparison posters: an image with numbered markers or zones, driven by a data file, with Explore and Quiz modes. **Poster instrumentation** is the application of the image-overlay adapter to such a MicroSim. The reference implementation is the animal-cell MicroSim, which the adapter marks as verified.

Three decisions shape it. First, the Explore and Quiz modes use two different objects for the same structure, `#nucleus` (an item) and `#q-nucleus` (a question), because an object's type belongs to the object and not to the mode. Both carry the same concept. Second, hover and click are one act in that MicroSim, since one function shows the infobox for both and there is no pin, so the adapter emits one inspection per visit. Click is what a touchscreen calls hover. Third, the quiz order is shuffled on every load, so the question key uses the target's name (`q-nucleus`) and never a position, and every attempt is emitted: wrong, wrong, right on one identifier is a sequence that mastery models can read, whereas emitting only the success would make a guesser look like an expert.

The shared library file in that MicroSim, `diagram.js`, is used by many MicroSims, so the instrumentation lives in a separate `xapi.js` loaded after it. That file wraps the MicroSim's `handleAnswer` method rather than editing it, and it keeps the concept map in itself instead of in the vendored data file, so that re-syncing the library cannot delete it.

## The Sub-Activity Fragment

Chapter 16 introduced the URL fragment that names a sub-activity, and instrumentation is where authors must choose those names. A **sub-activity fragment** is the part of an activity identifier after the `#`, such as `#speed-slider`, that names one control, node or question within a page. The handle's `key` becomes the fragment.

The naming test is the same as in Chapter 16: would an edit that does not change what the thing is change its name? The skill applies it in three ways. A button whose label toggles Start and Pause keeps one fragment, `#start-pause-control`, because the label changing does not change the control. A slider is named for the concept it evidences (`#frequency-slider`), and never by a position such as `#node-3` or `#q3` for anything whose order can change. In the animal-cell quiz, which reshuffles on each load, `#q1` would have meant a different question for each student.

## Concept Mapping

An identifier for the interaction is not enough; the statement must also say which concept it is evidence of. **Concept mapping** is the step of assigning each instrumented object the identifier of the learning-graph concept it evidences. The identifier has the form `{conceptPrefix}-{ConceptID}`, where the prefix comes from `lrs-config.js` and the number is the concept's `ConceptID` in `docs/learning-graph/learning-graph.csv`. The prefix exists because every book numbers its concepts from 1, so a bare `42` would collide across books. In code the skill says to write `LRS.conceptId(353)`, so the prefix follows the config, and to record full literal identifiers in `metadata.json`, which tools read without running the runtime.

The rules that matter most are these, all from the skill:

- Each statement carries exactly one concept. Choose what the interaction is evidence *for*: an amplitude slider is evidence of amplitude, not of the whole sine-wave topic.
- A run or page dwell takes the page-level concept passed to `LRSSim.create`.
- Several objects may share one concept, and Explore and Quiz objects for one structure should.
- If nothing genuinely matches, leave the concept unmapped and say so. A missing concept costs coverage, but a wrong one credits mastery of something the learner never touched.

The script `find-concepts.py --book . --sim docs/sims/<name>` proposes ranked candidates from the MicroSim's own metadata and labels, and it proposes only; a person or agent chooses. The result is recorded in the `metadata.json` block below, shown with the skill's example values.

```json
"xapi": {
  "concept": "learning-record-store-353",
  "objects": {
    "service-select": "learning-record-store-353",
    "q-kafka": "learning-record-store-334"
  }
}
```

Here the page and its generic controls carry concept 353, while the question `q-kafka` carries the concept it tests, 334. The checker verifies that emitted statements match this map, so the map and the code cannot drift apart unnoticed. The skill also says to check a question's answer key against the chapter text, because a key that contradicts the chapter marks every learner who learned the chapter as wrong.

!!! mascot-warning "The Nearest Label Is Not a Mapping"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    It is tempting to pick the closest-sounding concept when none fits, and the result is silent credit for the wrong skill. If the chapter or a sibling MicroSim's specification does not pair the object with a concept, leave it unmapped and report it.

## Instrumented Status

Once a MicroSim is wired, the book should record that fact so authors and reviewers can see which MicroSims report evidence. **Instrumented status** is the `status: instrumented` value in a MicroSim page's front matter, which the navigation shows as a teal signal icon. It means the capability is present: `main.html` loads `lrs-sim.js` and the MicroSim's code calls `LRSSim.create`. It says nothing about whether teaching mode is on. The script `sync-status.py --book .` reports what it would change, and adding `--apply` edits the front matter. It never overwrites a human `approved` sign-off, and it installs the icon's CSS and tooltip if the book lacks them. The skill adds one housekeeping step: if a book's `AGENTS.md` or `CLAUDE.md` lists the allowed status values, add `instrumented` there, or the next agent may "fix" it back to `built`.

## The xAPI Quality Check

Wiring can be wrong in ways a quick look will not reveal, so the skill ends with a script. The **xAPI quality check** is `check-xapi.py`, a headless-browser test that serves the book's `docs/`, embeds the MicroSim in an iframe as the book does, and checks statements against the producer contract in each mode. Its modes are `full`, `compact`, `production` and `url` (the last loads the production MicroSim with `?xapi=teaching` at its real iframe height). Its checks, as the skill lists them, include:

- only the three verbs appear;
- activity identifiers derive from the book's `siteUrl`, with no `main.html` and no localhost;
- grouping and concept identifiers are present and match the metadata map;
- Compact mode is silent until focus loss, then emits exactly one summary carrying `statements_represented`;
- answers pass through unfolded;
- production mode shows no teaching interface, and the console is clean.

It runs through Playwright, for example `uv run --with playwright==1.58.0 python check-xapi.py docs/sims/<name> --actions actions.json`. Generic driving sweeps sliders and clicks buttons, and an optional actions file (JSON) drives canvas clicks, hovers and keyboard input the generic pass cannot reach. Full mode must emit something for each evidence class wired, which is the check's positive control: a probe that counts zero before and zero after proves nothing if it cannot see a write.

!!! mascot-encourage "Your First Failing Check"
    ![Bounce encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    A first run of the checker often fails, and that is normal; the skill's pitfalls list exists because each item shipped as a bug at least once. Read the failing line, look it up in that list, fix one thing and run again.

The end-to-end sequence, from the skill's workflow, is: detect the library, inventory the interactions, classify each into an evidence class, map concepts, confirm the runtime is installed, wire the adapter, set the metadata block and status, re-measure the iframe height, and run the checks. The evidence claims of the whole design remain hypotheses: correct instrumentation makes a stream well formed, not predictive, and Chapters 18 and 19 test whether it predicts anything.

## Chapter Summary

- The **LRS runtime script** is a set of shared files, identical in every book; a MicroSim adds only a thin mapping of roughly 20 to 60 lines and never copies the runtime.
- The **LRS config file** `lrs-config.js` holds each book's identity (`siteUrl`, `textbookId`, `version`, `conceptPrefix`) and its default policy.
- **Policy precedence** runs from runtime defaults, through the book config and page option, to the MicroSim's `metadata.json`, with the `?xapi=` URL switch highest for one visit.
- **Teaching mode** shows the statement log, a Full/Compact switch and Simulate Done; the **statement log viewer** opens any statement formatted in a new tab.
- Slider, item, button and question **handles** report the evidence classes, and every call must be a **guarded call** so the MicroSim still runs in the p5.js editor.
- A **library adapter** says where to hook each library; the vis-network, Plotly and Leaflet adapters are unverified. **Poster instrumentation** uses separate Explore and Quiz objects and never edits the shared library.
- A **sub-activity fragment** is named for what the thing is, and **concept mapping** gives each object one concept or none, never a guess.
- **Instrumented status** marks the capability, and the **xAPI quality check** verifies Full, Compact, production and URL-switch behavior.

!!! mascot-celebration "You Can Instrument a MicroSim"
    ![Bounce celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now wire a MicroSim to the shared runtime with guarded handle calls, name its sub-activities by what they are, map each object to one concept, and verify the result with the quality check. Every bounce leaves evidence, and yours will now be well formed.

The next chapter takes the stream these MicroSims produce and asks the hard question: how can a sequence of events become an estimate of whether a learner has mastered a concept?

