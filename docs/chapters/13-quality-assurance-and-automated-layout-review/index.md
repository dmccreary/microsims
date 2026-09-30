---
title: Quality Assurance and Automated Layout Review
description: Shows how the 100-point quality score, Playwright tests, screenshots and vision-based layout review catch layout and quality defects before readers do.
generated_by: claude skill chapter-content-generator
date: 2026-09-30 10:55:03
version: 1.10
---

# Quality Assurance and Automated Layout Review

## Summary

Covers the quality score, Playwright tests, screenshots and vision-based layout review that catch layout and quality defects before readers do.

Students learn the 100-point rubric, layout defects, control-visibility and iframe-height tests, and the fix-cycle rules. After it, they can run the full quality chain and pass the quality gate.

## Concepts Covered

This chapter covers the following 21 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| 100-Point Rubric | 14 |
| Headless Browser | 26 |
| Screenshot Capture | 10 |
| Layout Defect | 19 |
| Clipped Content | 1 |
| Hidden Control | 7 |
| Cross-Browser Check | 1 |
| Color Contrast | 2 |
| Quality Score | 13 |
| Quality Grade | 6 |
| Validation Script | 6 |
| Playwright | 14 |
| Visual Checklist | 10 |
| Control Visibility Test | 6 |
| Iframe Height Test | 6 |
| Quality Gate | 5 |
| Standards Hardening | 1 |
| Layout Review | 9 |
| Vision-Based Review | 8 |
| Fix Cycle Limit | 3 |
| Smallest Patch Rule | 2 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: What Is a MicroSim](../01-what-is-a-microsim/index.md)
- [Chapter 2: Anatomy of a MicroSim](../02-anatomy-of-a-microsim/index.md)
- [Chapter 9: Timelines and Maps](../09-timelines-and-maps/index.md)
- [Chapter 12: Width-Responsive Design and Iframe Heights](../12-width-responsive-design-and-iframe-heights/index.md)

---

## Welcome

!!! mascot-welcome "A Second Pair of Eyes"
    ![Bounce waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    A MicroSim that looks perfect on your laptop can hide its Start button, clip its labels, or squeeze its sliders off the edge of a phone. This chapter gives you automated eyes: a 100-point score, a real browser, and a vision model that read the page before a learner does. Let's bounce it around! By the end you will be able to run the whole quality chain and tell when a MicroSim has passed.

Chapter 12 showed how a MicroSim follows its container width and how its iframe height is declared and synchronized. That chapter told you how the layout is supposed to work. This chapter asks a different question: how do you know that it does? A MicroSim is code that draws pixels, and code that runs without errors can still draw a Start button below the visible edge of its frame. Reading the code will not reveal that, and neither will opening the page once on the author's own monitor.

The book has a second reason to care. A learner cannot use a control they cannot see, so a hidden slider produces no interaction, and an instrumented MicroSim with a hidden slider produces no evidence about that interaction. The MicroSims 2.0 plan states this reasoning directly: a broken layout hides controls and corrupts the stream, so quality assurance is a data-quality control. That is a design argument, not a measured result, because no learner data have been collected through these MicroSims yet.

We use one toolkit throughout: the `microsim-utils` skill from the ibook-skills project, together with the audit of this repository's own MicroSims recorded in its `TODO.md`. The chain has four kinds of check, and each catches what the others miss:

- A **structural** check counts required files, metadata fields and documentation sections, and turns them into a score.
- A **capture** step renders the MicroSim in a real browser and saves an image.
- A **visual** check inspects that image against a written checklist and patches the source.
- A **geometric** check measures whether every control fits inside the iframe.

We start with the structural check, because its vocabulary carries through the rest of the chapter.

## Scoring Quality

### Quality Score

A **quality score** is an integer from 0 to 100 that summarizes how completely a MicroSim meets the project's file, metadata and documentation standards. The standardization guide says the score is written into the `quality_score` field in the YAML header of the MicroSim's `index.md`, the same header that supplies the social preview fields. Chapter 2 separated that header from the Dublin Core metadata, which lives only in `metadata.json`; the two must never be mixed.

Be precise about what the score measures. It counts the presence of things: a screenshot file, a References heading, a schema tag. It does not run the simulation, judge the physics, or ask whether a learner understood anything. A MicroSim can score 92 and still have a confusing interaction, which is why a score is one gate among several and never the whole of quality.

### 100-Point Rubric

The **100-point rubric** is the table of checks that the quality score adds up. The audit in this repository used the `validate-sims.py` script, and its rubric awards points in seven groups. Two terms need a definition first. The *schema meta tag* is the `<meta name="schema" ...>` line in `main.html` that identifies the metadata schema (Chapter 2 introduced it). The *educational* and *pedagogical* sections are named blocks inside `metadata.json` that describe the learning purpose of the MicroSim.

| Group | Points | How the points are earned |
|---|---|---|
| `main.html` | 10 | File exists (5), has the schema meta tag (3), has a `main` element (2) |
| `metadata.json` | 30 | File present (10); core fields title, description, creator, date and subject, with 10 points if at most one is missing and 5 if two or three are; an educational section (5); a pedagogical section (5) |
| `index.md` structure | 35 | Level 1 title (2), YAML title and description (3), YAML social images (5), an iframe with `src="main.html"` (10), a fullscreen link (5), a copy-paste iframe example in a code block (5), a description or about section (5) |
| Screenshot | 5 | A PNG exists in the folder, other than `favicon.png` or `icon.png` |
| Lesson plan | 10 | A level 2 heading that reads Lesson Plan |
| References | 5 | A level 2 heading that reads References |
| p5.js conventions | 5 | For p5.js MicroSims: `updateCanvasSize` used (2), built-in controls rather than hand-drawn ones (2), canvas parented to the `main` element (1). Other libraries receive all 5 |

The groups sum to 100: 10 + 30 + 35 + 5 + 10 + 5 + 5. Notice how much weight falls on documentation and metadata rather than on rendering. Sixty-five of the 100 points come from `metadata.json` and `index.md`, and only the p5.js group looks at code at all.

A **worked example** uses the Bouncing Ball MicroSim from version 1.0, which the audit scored at 82. Its issues are the missing schema meta tag (3 points lost), the missing educational section (5), the missing description section (5) and the missing References section (5). Subtracting 3 + 5 + 5 + 5 = 18 from 100 gives 82, and the validator's per-group scores agree: `main.html` 7, `metadata.json` 25, `index.md` 30, screenshot 5, lesson plan 10, references 0 and p5.js conventions 5. The arithmetic also shows where the cheapest gains are. Adding a description section alone raises the score by 5, to 87.

!!! mascot-warning "Two Rubrics, One Total"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    The standardization guide's own scoring table and the audit script split the 100 points differently: the guide checks nine Dublin Core fields, while the script checks five and adds educational and pedagogical sections. A score is only comparable with scores from the same script, so record which one produced it and re-run that same one after every change.

### Validation Script

A **validation script** is a program that applies the rubric to every MicroSim folder and reports a score. In this book that is `validate-sims.py`, kept in the `src/microsim-utils` folder of the ibook-skills repository. It reads each folder under `docs/sims/`, applies the seven checks, and prints one line per MicroSim.

Before the commands, here are the flags they use. `--project-dir` names the project root, the folder that contains `docs/sims/`. `--sim` restricts the run to one MicroSim by folder name. `--verbose` prints the list of issues under each score. `--format json` prints machine-readable results instead of a table, and `--output` writes the results to a JSON file. The `--min-score` flag shows only MicroSims at or above a given score.

```bash
# Score one MicroSim and list what is missing
python3 validate-sims.py --project-dir . --sim bouncing-ball --verbose

# Score every MicroSim and save the results as JSON
python3 validate-sims.py --project-dir . --output scores.json
```

Each JSON record holds the folder name (`sim_id`), the total `score`, the points per group under `categories`, and the list of `issues`. Running the script over all 116 MicroSim folders in this repository while this chapter was written reproduced the audit's mean of 60.6.

One property of the script matters for automation: it always exits normally, whatever the scores are. The `--min-score` flag filters what is displayed, but nothing fails a build. If you want a hard threshold, you must read the JSON yourself, as the short script below does. It loads the saved results and prints every MicroSim under 85, lowest score first.

```python
import json

with open("scores.json") as f:
    results = json.load(f)

below = sorted((r["score"], r["sim_id"]) for r in results if r["score"] < 85)
for score, sim_id in below:
    print(score, sim_id)
```

### Quality Grade

A **quality grade** is a letter that names a band of the quality score, so that a reader of a report can see at a glance how much work a MicroSim needs. The script uses four bands: A for 85 and above, B for 70 to 84, C for 50 to 69, and D below 50. The audit's `TODO.md` attaches a recommended action to each band.

| Grade | Score band | Recommended action in the audit | MicroSims in the 2026-09-30 audit |
|---|---|---|---|
| A | 85 and above | Confirm and carry over when a chapter adopts it | 18 |
| B | 70 to 84 | Close to the bar; fix the listed issues | 27 |
| C | 50 to 69 | Substantial work; rebuild from a specification if cheaper | 30 |
| D | Under 50 | Likely rebuild or drop | 41 |

Those counts are a measured result for this repository: 116 MicroSims, a mean score of 60.6, and roughly 16, 23, 26 and 35 percent in grades A to D. The highest score anywhere is 92. Every one of the 73 MicroSims that have a `main.html` lacks the schema meta tag, and 110 lack the educational section, which is why the best v1.0 MicroSims stop at 92 rather than 100. Forty-three folders have no `main.html` at all.

#### Diagram: Quality Score Calculator

<details markdown="1">
<summary>Quality Score Calculator</summary>
Type: microsim
**sim-id:** quality-score-calculator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Apply; verb: calculate): The learner will calculate the quality score and grade of a MicroSim by ticking which rubric checks it satisfies, and will identify the cheapest change that reaches the 85 threshold.

Layout: a drawing region above a control region, using the standard MicroSim layout. The drawing region holds a list of the rubric checks grouped under the seven group headings, each row showing its point value, and on the right a large score readout, a horizontal bar from 0 to 100 with tick marks at 50, 70 and 85, and a grade letter colored by band.

Controls:

- One checkbox per rubric check (about 20), pre-grouped by heading. Ticking a check adds its points; the metadata group implements the 10, 5 or 0 rule with a dropdown "Core fields missing" (0-1, 2-3, 4-5).
- Dropdown "Load example" with three presets: "Bouncing Ball (score 82)", "A-star (score 74)" and "Blank folder".
- Button "Suggest cheapest fix", which highlights the unticked check with the most points and shows the score it would produce.
- Checkbox "Show gate line", which draws the 85 threshold and states whether the MicroSim would pass the carried-over gate on score alone.

Interactions: hovering a row shows what the validator looks for (for example, "level 2 heading named Description, About, Overview, How to Use or Introduction"). Clicking the grade letter shows the band table and the audit's recommended action.

Data: the rubric weights from the table above; the Bouncing Ball preset leaves the schema tag, educational section, description section and References section unticked; the A-star preset leaves unticked the schema tag, educational section, social images, YAML title and description and copy-paste iframe example, and sets core fields missing to 2-3.

Responsive design: the canvas width follows the container width on every window resize; at widths under 500 pixels the rubric list wraps to one column and the score readout moves above it. Include a describe() call for accessibility.

Implementation: p5.js with createCheckbox, createSelect and createButton controls positioned relative to the drawing height, and a CANVAS_HEIGHT comment for the height sync tool.
</details>

### Quality Gate

A **quality gate** is a pass-or-fail threshold that a MicroSim must clear before it enters the book. The word "gate" matters: unlike a report, a gate stops something. The MicroSims 2.0 plan sets two bars. A MicroSim carried over from version 1.0 must reach a score of 85, be width-responsive, and have a correct iframe height. A new or regenerated MicroSim must score at least 70, and every MicroSim must pass the iframe-height and control-visibility tests described later in this chapter. The plan adds a further check for MicroSims that emit xAPI statements, which later chapters take up.

The standardization guide adds a courtesy that saves effort: if a MicroSim's header already records a `quality_score` of 85 or more, skip the rest of the standardization steps and spend the tokens on new work. A gate has this shape because no single tool sees everything. The score checks documents, the iframe test checks geometry, and the layout review checks appearance.

A **worked example** applies the gate to Bouncing Ball. At 82 it fails the 85 bar for a carried-over MicroSim. Adding a description section lifts it to 87, which clears the score. That is not yet a pass: the gate also demands width responsiveness and a correct iframe height, so the MicroSim still has to run the height test. If it cannot be raised past the bar, the plan leaves it out of the book; it remains in git at the `v1.0` tag.

### Standards Hardening

**Standards hardening** is this book's name for the work of raising an existing MicroSim to the project's standards, so that it can pass the gate. The standardization guide defines the workflow. Run the checklist, write the failures as a TODO list, ask the author to approve the changes, implement them, validate again, and report the score before and after.

Three rules from the guide keep hardening safe. Never remove or overwrite an author's content without confirmation. Keep Dublin Core metadata out of the YAML header and inside `metadata.json`. Add a blank line before every list, because MkDocs will not render the list otherwise. The audit follows the same spirit at project level: it does not upgrade everything, only the MicroSims that a chapter actually adopts.

!!! mascot-tip "Score Before You Patch"
    ![Bounce giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Read the `--verbose` issue list first and sort it by points, not by order. Fixing a 10-point item takes the same effort as a 3-point one, so start with the largest and re-run the same script after each edit.

## The Machinery: Headless Browsers and Playwright

The score never opens the MicroSim. Everything else in this chapter does, and it does so through a program-controlled browser.

### Headless Browser

A **headless browser** is a full web browser that runs without a visible window, controlled by a program rather than a person. It still loads the page, runs the JavaScript, lays out the elements and paints the pixels; it simply does not show them on a screen. Because it does all the real work, what it produces is what a learner's browser would produce, and a program can then take a picture of it or measure where each element landed.

### Playwright

**Playwright** is an automation library that drives a headless browser from code. In this toolkit it is used from Python and drives Chromium, the open-source engine behind Chrome, through Chromium's DevTools protocol. Two commands install it:

```bash
pip install playwright
playwright install chromium
```

Two utilities depend on Playwright: the screenshot script and the iframe height tester. The screenshot guide gives reasons for choosing it over launching Chrome directly. Playwright can set an exact viewport before the page loads, which matters because Chrome's own screenshot mode on macOS starts the page about 87 pixels shorter and resizes only at capture time, so layouts that use `100vh` or size themselves once in `setup()` came out wrong. It can also enable software WebGL so that 3D p5.js sketches render instead of showing blank rectangles, print uncaught JavaScript errors, and run without a display on a build server.

### Screenshot Capture

**Screenshot capture** is the step that renders a MicroSim in the headless browser and saves it as a PNG. Chapter 2 introduced that image as the preview and social card; here it becomes evidence for review. The command is `bk-capture-screenshot`, which takes the MicroSim folder, an optional delay in seconds and an optional height:

```bash
~/.local/bin/bk-capture-screenshot docs/sims/org-chart 3 600
```

The delay gives the sketch time to draw; the default is 3 seconds, and complex visualizations need longer. The height should equal the iframe height declared in the MicroSim's `index.md`, so the picture shows exactly what readers see. The viewport is 800 pixels wide, close to the MkDocs Material content column. The script serves the folder from a temporary web server on `127.0.0.1` instead of opening it as a `file://` address, because headless Chromium blocks `fetch()` of local files and any MicroSim that loads a `data.json` would otherwise render empty. The image is saved as `{microsim-name}.png` in the folder. This example, with `org-chart` and 600 pixels, is the one the screenshot guide itself uses.

A blank screenshot is a defect in the capture, not necessarily in the MicroSim. The layout guide's first suggestion is to raise the delay from 3 to 5 seconds; if the image is still blank, open the MicroSim in a real browser and read the console for a JavaScript error.

### Cross-Browser Check

A **cross-browser check** loads the same MicroSim in more than one browser engine, for example Chromium, Firefox and WebKit, and compares the results. Both scripts in this toolkit launch Chromium only, so this chapter's checks tell you how the MicroSim behaves in Chromium and nothing more. The risk is real: Chapter 8 reported the generation guide's claim that Chrome and Firefox both silently fail to paint some vis-network instances when a page holds many iframes. We report that as the guide states it and have not reproduced it. Playwright can also drive Firefox and WebKit, so a cross-browser step could be added to the scripts, but that extension is a design idea and is not built.

| Fact | Screenshot capture | Iframe height test |
|---|---|---|
| Script | `bk-capture-screenshot` | `test-iframe-heights.py` |
| Viewport width | 800 pixels | 700 pixels |
| Viewport height | The height argument (default 600) | The iframe height in `index.md`, or the `--height` value |
| Output | A PNG in the MicroSim folder | PASS or FAIL per MicroSim, with a suggested height |
| Engine | Chromium | Chromium |

Note that the two widths differ. A MicroSim that fits at 700 pixels may still be judged from a screenshot at 800, and the difference explains why a responsive MicroSim can look right in one tool and be flagged by the other.

## Layout Defects

### Layout Defect

A **layout defect** is a rendering fault in which the arrangement of visible elements makes content unreadable or unusable even though the code runs without error. The MicroSim is doing what its code says; what the code says is wrong for the space available. Layout defects are the failures a learner sees first and an error console never reports.

The layout reviewer's checklist names defects in six families: text legibility, the control region, the drawing region, color and hierarchy, library-specific elements and sanity checks. Three defects deserve their own definitions because they account for most of the fixes in the toolkit.

**Clipped content** is text or a control that is partly cut off by the canvas edge, a panel border or the iframe boundary. The guide's example is a row label that reads `mpletion: true` because the leading letters fell outside the canvas. A **hidden control** is an interactive element that is not fully visible or reachable, such as a button below the bottom edge of an iframe whose scrolling is turned off. Clipped content is often merely ugly; a hidden control is worse, because the learner cannot operate the MicroSim at all.

**Color contrast** is the difference in brightness between text and the color behind it. The checklist asks that body text look at least 4.5 to 1, judged by eye, and Chapter 8 tied that figure to the WCAG AA standard. Examples of failure are light gray text on a white panel or pale yellow text on the `aliceblue` drawing area.

Each defect family has a usual cause and a usual repair. The table below summarizes the common ones from the fixes catalog, using the checklist's item numbers.

| Symptom | Checklist item | Likely cause | Repair |
|---|---|---|---|
| Row label cut off at the left edge | 1.1, 3.5 | The reserved offset is smaller than the label width | Raise the offset to at least `textWidth(longestLabel) + 8` |
| Black halo around every letter (p5.js) | 1.3 | A `stroke()` was still active when `text()` ran | Call `noStroke()` just before `text()` |
| Slider runs past the right edge (p5.js) | 2.1 | `size()` was set in `setup()` but not in `windowResized()` | Resize every slider on resize with the same formula |
| Slider label overlaps the track | 2.2 | `sliderLeftMargin` is smaller than the longest label | Widen it to clear the longest label by 10 pixels |
| Buttons overlap | 2.3 | Two buttons share an `x` position | Compute each `x` from the running total of widths |
| Title missing or a white sliver | 3.2 | A background rectangle was drawn after the title | Draw the title after all background shapes |
| Title collides with a right panel | 3.1 | The title is centered on the whole canvas | Left-align it or center it over the left panel |
| Drawing area is white, not `aliceblue` | 4.1 | The `fill('aliceblue')` call was omitted | Set fill and stroke before the drawing-area rectangle |

The guide gives a worked number for the first row: for 13-point text and a label such as `completion: false`, about 96 pixels wide, an offset of 110 is a safe value.

!!! mascot-thinking "Why the Halo Happens"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Notice that p5.js keeps its drawing state, including the stroke, until you change it, so one forgotten `noStroke()` affects every later `text()` call. Think of the stroke as a paint-brush that stays wet: check what you last did with it before you write.

#### Diagram: Layout Defect Catalog Explorer

<details markdown="1">
<summary>Layout Defect Catalog Explorer</summary>
Type: microsim
**sim-id:** layout-defect-catalog-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: distinguish): The learner will distinguish clipped content, hidden controls and low color contrast in a rendered MicroSim, and will match each defect to its checklist item and its usual repair.

Layout: a drawing region showing a deliberately flawed mock MicroSim at the left two thirds (a 2 by 2 grid whose row labels are cut off, a title overlapping a side panel, black-haloed text, pale text on aliceblue, and a slider running past the right edge), with a checklist panel on the right listing the checklist families. A control region below holds the buttons.

Controls:

- Click any suspicious region of the mock MicroSim to flag it. A correct flag draws a green outline and opens a card with the defect name, the checklist item number, the likely cause and the repair; a wrong flag draws a red outline with a hint.
- Buttons "Apply repair" (fixes the currently selected defect and redraws the mock without it) and "Reset".
- Dropdown "Defect family" that filters which defects are visible: All, Clipped content, Hidden control, Color contrast.
- A counter "Found n of 8" and a "Reveal" button that outlines everything not yet found.

Data: eight defects taken from the table above (the eight symptoms), each with an item number, cause and repair text.

Responsive design: the canvas width follows the container width on every window resize; the mock MicroSim is drawn proportionally and the checklist panel drops below it under 600 pixels wide. Include a describe() call.

Implementation: p5.js drawing the mock with rectangles and text, hit-testing flagged regions by bounding box, with createButton and createSelect controls positioned relative to the drawing height.
</details>



## Automated Geometry: Height and Visibility Tests

Chapter 12 introduced the `CANVAS_HEIGHT` comment, the sync tool that copies `CANVAS_HEIGHT + 2` into every iframe, and the fact that the tester `test-iframe-heights.py` checks the result. This section opens that tester and separates the two questions it answers.

### Control Visibility Test

A **control visibility test** asks, for each interactive element in a MicroSim, whether the whole element lies inside the visible frame. The unit of measurement is the element's *bounding box*, the smallest rectangle that contains it, which the browser reports as a `top` and a `bottom` in pixels. The test loads `main.html` in a viewport whose height equals the declared iframe height, waits for the page to settle, and compares each bounding box to that height.

The script looks for buttons, range sliders, checkboxes, text and number inputs, select menus and textareas, and it also measures canvases. It skips elements with zero height. A control is *visible* when its bottom edge is no lower than the iframe height plus a tolerance of 5 pixels. Canvases are measured but never reported as failures, because a canvas is the drawing surface rather than a control. The test therefore catches any **hidden control** whose bottom edge falls below the frame.

### Iframe Height Test

An **iframe height test** asks the same question of the whole MicroSim rather than of one control: is the declared iframe height enough? It compares the height written in the MicroSim's `index.md` with the height the content needs, and when a control fails it proposes a better number. Both tests are one run of one script, and the difference is the level of the answer. Visibility is a verdict per element; height is a verdict per MicroSim, plus a recommendation.

Before the commands, the options: `--sims-dir` names the folder holding the MicroSim folders, `--sim` tests one MicroSim, `--height` overrides the height in every `index.md` (useful for asking "would 530 work?"), and `--report` writes a Markdown table to a file. Playwright is required, as installed above.

```bash
# Test every MicroSim at its declared iframe height
python3 test-iframe-heights.py --sims-dir docs/sims

# Test one MicroSim
python3 test-iframe-heights.py --sims-dir docs/sims --sim energy-pyramid

# Ask what happens at a different height, and save a report
python3 test-iframe-heights.py --sims-dir docs/sims --height 530 --report report.md
```

The script prints one line per MicroSim. This sample output comes from the skill's own guide, and shows the columns you will read:

```text
MicroSim                    | Iframe Height | Content Height | Status | Suggested Height
----------------------------|---------------|----------------|--------|------------------
energy-pyramid              |           532 |            528 | PASS   |              532
predator-prey               |           697 |            720 | FAIL   |              730
```

Here is how those numbers are made. The script measures the *content height* as the lowest bottom edge of any element inside the `main` element (or the page body). If the MicroSim's JavaScript file declares `// CANVAS_HEIGHT = N`, that declared value replaces the measurement, because responsive MicroSims can measure taller at the test width than they render in the book. On a failure the suggested height is the content height plus a 10-pixel safety margin, rounded up to the next multiple of 10. On a pass, it simply repeats the current height. The script exits with status 1 if any MicroSim fails or cannot load, so, unlike the validation script, it can stop a build.

A **worked example** follows the predator-prey row. The iframe is 697 pixels tall, and the content measures 720. Some control's bottom edge is beyond 697 + 5 = 702, so the status is FAIL. The suggestion is 720 + 10 = 730, already a multiple of 10. The repair is to set 730 in the MicroSim's `index.md` and in every chapter that embeds it, update the `CANVAS_HEIGHT` comment, and run the sync tool so that all embeds agree.

!!! mascot-warning "The Comment Format Trap"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    The sync tool accepts `// CANVAS_HEIGHT: 402` or `// CANVAS_HEIGHT = 402`, but the tester reads only the equals form and otherwise falls back to measuring the page. Write the equals form, which both tools understand, and the two will never disagree about the declared height.

The tests have limits worth knowing. They check only the bottom edge, so a control pushed past the right edge is not detected. They measure boxes, not appearance, so overlapping buttons or unreadable text pass without comment. They run in Chromium at 700 pixels wide. And they are only as good as the wait: the script loads the page until the network is idle and then waits 2 more seconds, so a MicroSim that builds its controls later than that can pass wrongly. Those gaps are why a second, visual check follows.

#### Diagram: Iframe Height Test Simulator

<details markdown="1">
<summary>Iframe Height Test Simulator</summary>
Type: microsim
**sim-id:** iframe-height-test-simulator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Apply; verb: calculate): The learner will apply the control visibility and iframe height tests to a mock MicroSim by choosing an iframe height, and will calculate the suggested height from the content height.

Layout: a drawing region showing a mock MicroSim inside a bordered iframe frame whose bottom edge moves with the height slider. Inside are a canvas, three sliders and two buttons at fixed positions, each with a small label showing its bottom edge in pixels. A results panel on the right lists PASS or FAIL for each control, the status of the whole MicroSim, the content height, and the suggested height.

Controls:

- Slider "Iframe height" from 300 to 800 pixels in steps of 1, default 500.
- Slider "Content height" from 400 to 800 pixels, default 528, which moves the lowest control.
- Slider "Tolerance" from 0 to 20 pixels, default 5.
- Checkbox "Declared CANVAS_HEIGHT" with a numeric field; when on, the suggestion uses the declared value instead of the measured content height.
- Button "Run test", which animates a scan line from top to bottom and marks each control PASS or FAIL.

Behavior: a control passes when its bottom is at most the iframe height plus the tolerance. The suggested height is the content height (or declared value) plus 10, rounded up to the next multiple of 10, shown only on FAIL. Clicking any control shows its bounding box and the inequality that decided its status.

Responsive design: the canvas width follows the container width on every window resize; the results panel drops below the frame under 600 pixels wide. Include a describe() call.

Implementation: p5.js with createSlider, createCheckbox and createButton controls positioned relative to the drawing height, and a CANVAS_HEIGHT comment for the height sync tool.
</details>

## Layout Review

### Layout Review

A **layout review** is the visual counterpart to the geometric tests: someone looks at the rendered MicroSim, judges whether the layout is right, and fixes what is wrong. The layout reviewer guide gives the reason: a geometric check catches "the slider got cut off at the bottom" but not "the row label says `mpletion: false`", nor a title that overlaps a JSON panel, nor an ugly outline on every letter. Those defects are obvious to a person, and to a vision model, looking at a picture.

The guide's workflow has ten steps, which fall into four movements. First it resolves the target MicroSim and the source file it will patch. Second, it reads the iframe height from `index.md` and captures a screenshot at exactly that height. Third it reads the image and walks the checklist item by item, diagnoses each failure and patches the source. Finally it re-captures and re-checks, stops after three cycles, and reports. The report names the library and files touched, each defect with quoted evidence, each edit, the final state (clean, partial or unfixed) and the model version that did the looking.

### Visual Checklist

A **visual checklist** is a written list of the known ways a layout can be wrong, which the reviewer must answer one by one. The guide's checklist has 29 items in six sections, and each item gets one of three answers: PASS, FAIL or N/A (not applicable, such as a grid item for a MicroSim with no grid). For every FAIL the reviewer writes what the defect is, where it sits, and the evidence, meaning what is actually visible.

| Section | Focus | Items |
|---|---|---|
| 1. Text legibility | Clipped text, residual strokes, low contrast, text too small | 5 |
| 2. Control region | Sliders and buttons past the edge, overlaps, alignment, boundaries | 7 |
| 3. Drawing region | Title position, draw order, panel overflow, axes, highlights | 6 |
| 4. Color and hierarchy | Background fills, readable color coding, one dominant color | 4 |
| 5. Library-specific | Mermaid titles, vis-network edge labels, chart legends, map attribution | 4 |
| 6. Sanity checks | It renders, no error banner, height matches the iframe | 3 |

Two entries reach beyond appearance. Item 5.4 says a Leaflet map without its OpenStreetMap attribution is a license violation and not merely a layout defect, so a checklist can protect a MicroSim's legal standing as well as its looks. And item 6.1 exists because a blank image usually means a capture problem, not a broken MicroSim.

### Vision-Based Review

A **vision-based review** is a layout review performed by a multimodal AI model that reads the screenshot directly as an image. In the toolkit the model opens the PNG file and sees pixels much as a person would, judging legibility, contrast, alignment, overlap and clipping, with no text extraction or image-processing library in between. The guide notes that the result depends on the model in use, so it asks the reviewer to record the model version in the report.

!!! mascot-thinking "Why a Checklist Beats a Glance"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    The guide is candid that a vision model is not deterministic: what it flags depends on what it is looking for. Ask "does this look right?" and it may miss a clipped label; ask "is the left edge clipped?" and it reliably finds one. The checklist turns one vague question into 29 pointed ones.

Honesty requires a caveat. The guide describes the review but reports no measured detection rate, so we do not know how many real defects a vision review misses or how often it invents one. Treat its verdict as that of a careful reviewer who can be wrong. That is another reason to keep the geometric tests, which give the same answer every time.

### Smallest Patch Rule

The **smallest patch rule** says to make the smallest change that resolves the defect. The reviewer looks up each failure in the fixes catalog, edits only the source file identified at the start (usually the `.js` file, but `main.html` for Mermaid and inline-configured MicroSims, or a data file for data defects) and does not redesign anything. The rule exists because a broad edit can fix one defect and create three. It also draws two boundaries: a defect that comes from iframe height is handed to the tester and the sync tool, and a MicroSim whose `index.md` says `status: approved` is skipped, because approved MicroSims are locked against incidental edits.

### Fix Cycle Limit

The **fix cycle limit** is the rule that a review stops after three review-and-patch cycles. One cycle is: capture, walk the checklist, patch, re-capture. If the third re-capture still shows failures, the reviewer stops and reports what remains. The guide's reasoning is that repeated tweaking usually means the design has a deeper problem that needs human judgment, and that surfacing this is better than quietly producing something subtly worse.

A **worked example** contrasts two ways of spending the cycles on the guide's sample defect, row labels that read `mpletion: true` because the reserved offset is too small. In the disciplined path, cycle 1 diagnoses the offset, raises it to the fixes catalog's suggested 110 for a label about 96 pixels wide, re-captures, and finds the labels whole, so one cycle is enough. In the ratcheting path, the reviewer nudges the offset 60, 110, 160, 200 without asking why the picture is not changing. The guide names exactly that sequence as the thing to avoid: the lever may be the wrong one, so re-read the source around the suspect area for an unrelated cause.

!!! mascot-warning "Do Not Ratchet a Number"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    If a fix does not work, resist widening the same value again. A parameter that keeps growing without changing the picture is pointing at a different cause, such as a `stroke()` still active or a rectangle drawn in the wrong order. Stop, reread the surrounding code, and count the cycle you just used.

#### Diagram: Review and Fix Cycle Simulator

<details markdown="1">
<summary>Review and Fix Cycle Simulator</summary>
Type: microsim
**sim-id:** review-fix-cycle-simulator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Evaluate; verb: judge): The learner will judge whether each proposed patch follows the smallest patch rule and decide when the fix cycle limit requires stopping and reporting.

Layout: a drawing region split in two. The left half shows a mock screenshot of a MicroSim with up to three seeded defects (a clipped row label, a residual text stroke and a title overlapping a panel). The right half shows a cycle tracker with three numbered boxes, a checklist strip with items PASS, FAIL or unchecked, and a log of edits. A control region sits below.

Controls:

- Dropdown "Choose a patch" listing three candidate patches for the selected defect: the smallest correct patch, an over-broad patch that also changes an unrelated value, and a patch aimed at the wrong cause.
- Button "Apply patch and re-capture", which redraws the mock screenshot with the effect of the chosen patch and consumes one cycle.
- Button "Stop and report", and a "Reset".
- Checkbox "Show hint from the fixes catalog".

Behavior: the smallest correct patch clears its defect and introduces nothing; the over-broad patch clears the defect and creates a new one; the wrong-cause patch changes nothing visible. After three cycles the simulator locks and requires "Stop and report". The final panel scores the run on defects fixed, new defects introduced and cycles used, and explains each choice.

Responsive design: the canvas width follows the container width on every window resize; the two halves stack vertically under 600 pixels wide. Include a describe() call.

Implementation: p5.js with createSelect, createButton and createCheckbox controls positioned relative to the drawing height, and a CANVAS_HEIGHT comment for the height sync tool.
</details>

## Running the Whole Chain

The toolkit's guides list two orders for the checks. The routing summary for a new MicroSim runs the score first, then the screenshot, the layout review, the height test and the index page. Yet the layout reviewer advises running the height test first when the only problem is clipped controls, because the tester gives a precise suggested height where a review gives only an impression. This book's recommendation, which the skill does not itself state, is to follow the first order and then repeat the height test as the last step, since a layout patch can move a control.

The chain, with the commands from this chapter, is as follows:

1. Score the MicroSim with the validation script and fix the largest missing items.
2. Capture a screenshot at the iframe height.
3. Walk the visual checklist against the image and apply smallest patches, up to three cycles.
4. Run the iframe height test, including the control visibility check, and correct the height.
5. Apply the quality gate: score, responsiveness, height and visibility must all pass.

The chain becomes economical when you connect it to the plan. The 2026-09-30 audit found 18 MicroSims already at grade A, and the plan does not upgrade the other 98 in bulk. When a chapter adopts a MicroSim, that MicroSim goes through the chain and its entry in `TODO.md` is ticked off. The diagram below shows the decision points, including where a failure sends the MicroSim back and where the cycle limit hands it to a person.

#### Diagram: Quality Chain Workflow

<details markdown="1">
<summary>Quality Chain Workflow</summary>
Type: workflow
**sim-id:** quality-chain-workflow<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Learning objective (Bloom level: Understand; verb: explain): The learner will explain the order of the quality chain, what each step checks, and what happens after a failure.

Diagram: a top-to-bottom Mermaid flowchart with these nodes: "Validate score", "Capture screenshot", "Layout review", "Iframe height test", "Quality gate", "Patch source", "Stop and escalate to a person", and "Carry into the book". Edges run in the order above; "Quality gate" branches to "Carry into the book" on pass and to "Patch source" on fail; "Patch source" returns to "Capture screenshot"; "Layout review" branches to "Stop and escalate to a person" after the third cycle.

Interactions: every node and every edge has a click directive that opens an infobox beside the diagram. Node infoboxes give the definition, the tool and command, and the chapter section; edge infoboxes explain the condition (for example, "score below 85" or "third cycle reached"). Hovering a node shows a one-line tooltip. A "Trace a failure" button highlights the path taken by a MicroSim that fails the height test.

Responsive design: the diagram scales to the container width on every window resize and the infobox moves below the diagram under 600 pixels wide.

Implementation: Mermaid flowchart with click callbacks bound to a small JavaScript infobox, following the standard MicroSim layout.
</details>

Finally, separate what is measured, built and only hoped for. **Measured:** the audit's 116 scores, their mean of 60.6 and the grade counts, reproduced by re-running the validator. **Built and working:** the validation script, the screenshot script, the height tester, the sync tool and the layout reviewer's checklist and fixes catalog. **Designed but not built:** cross-browser runs, a gate that fails a build on score, and closed-loop generation in which the quality chain runs inside the generator (a direction Chapter 26 discusses). **Hoped for:** that fewer layout defects will mean cleaner evidence in the xAPI stream. No test in this chapter can show that, because that stream has not yet been collected.

#### Diagram: Audit Baseline Explorer

<details markdown="1">
<summary>Audit Baseline Explorer</summary>
Type: chart
**sim-id:** audit-baseline-explorer<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: examine): The learner will examine the 2026-09-30 audit of 116 MicroSims and identify which rubric issues most often hold MicroSims below the grade A bar.

Layout: a bar chart of MicroSims per grade (A 18, B 27, C 30, D 41) above a second horizontal bar chart of issue frequency, using the standard region layout with a control region below.

Data: grade counts as above; issue counts across the audit are missing educational section 110, missing Lesson Plan section 76, missing References section 74, missing schema meta tag 73, missing copy-paste iframe example 68, missing description or about section 60, missing screenshot 54 and no main.html 43.

Interactions: clicking a grade bar filters the issue chart to that grade and shows the recommended action from the audit; hovering an issue bar shows its rubric points and the score gained by fixing it. A dropdown switches the issue chart between counts and total points lost, computed as count times the rubric points for that check.

Responsive design: both charts follow the container width on every window resize, and the two charts stack under 600 pixels wide. Include accessible text alternatives for each chart.

Implementation: Chart.js bar charts with click and hover handlers, loading the counts from an inline JSON object that cites the audit date.
</details>

!!! mascot-tip "Run the Cheap Checks First"
    ![Bounce giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    The score takes seconds and needs no browser, so run it first and across everything. Save the slower browser steps for MicroSims that already clear it, so you are not screenshotting a folder with no `main.html`.

## Chapter Summary

- The **quality score** is a 0 to 100 count of files, metadata and documentation; the **100-point rubric** puts 65 points on `metadata.json` and `index.md`, and the score measures presence, not learning value.
- `validate-sims.py` is the **validation script**; it always exits normally, so a hard threshold needs your own check of its JSON output.
- **Quality grades** A to D mean 85 and above, 70 to 84, 50 to 69 and below 50; the audit of 116 MicroSims found a mean of 60.6 and 18, 27, 30 and 41 in grades A to D.
- The **quality gate** combines score, width responsiveness, iframe height and control visibility; **standards hardening** is the work of raising a MicroSim to pass it.
- A **headless browser** driven by **Playwright** supports **screenshot capture** and the height tests, though only in Chromium, so a **cross-browser check** is not yet built.
- **Layout defects** include **clipped content**, **hidden controls** and poor **color contrast**; the fixes catalog maps each symptom to a repair.
- The **control visibility test** and **iframe height test** are geometric checks in one script that suggests a height and can fail a build; they see only the bottom edge.
- A **layout review** walks a 29-item **visual checklist** with a **vision-based review**, applying the **smallest patch rule** within a **fix cycle limit** of three.

!!! mascot-celebration "Quality Chain Complete"
    ![Bounce celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now score a MicroSim against the 100-point rubric, capture it in a headless browser, find clipped and hidden controls with the height test, and review a layout with the checklist inside the three-cycle limit. That is the full quality chain, and it is one of the harder skills in the book.

Chapter 14 takes these checks to scale, where a batch of MicroSims generated from specifications must pass the same chain without a person opening each one.
