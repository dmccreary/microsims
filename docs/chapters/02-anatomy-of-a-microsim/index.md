---
title: Anatomy of a MicroSim
description: Takes a MicroSim apart into its directory, files, regions and metadata so you can read, modify and package any MicroSim you meet.
generated_by: claude skill chapter-content-generator
date: 2026-09-30 10:13:16
version: 1.10
---

# Anatomy of a MicroSim

## Summary

Takes a MicroSim apart into its files, regions and metadata so students can read, modify and package any MicroSim they meet.

Students learn the directory convention, the HTML wrapper, the JavaScript file, the documentation page and the metadata file, and how the draw and control regions fix a MicroSim's height. After it, they can start from the template and explain each part.

## Concepts Covered

This chapter covers the following 12 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| MicroSim Directory | 347 |
| main.html | 22 |
| MicroSim JavaScript File | 98 |
| index.md Documentation Page | 26 |
| metadata.json | 193 |
| Draw Region | 54 |
| Control Region | 33 |
| Canvas Height Constant | 16 |
| Page Front Matter | 3 |
| Preview Image | 1 |
| Pinned Library Version | 4 |
| MicroSim Template | 7 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: What Is a MicroSim](../01-what-is-a-microsim/index.md)

---


## Welcome

!!! mascot-welcome "Open the Hood"
    ![Bounce waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Every MicroSim you will ever meet is built from the same handful of parts, and once you can name them you can fix, restyle or repackage any of them in minutes. By the end of this chapter you will be able to start from a blank directory and explain what every file is for. Let's bounce it around!

Chapter 1 defined a MicroSim as a small, described, embeddable interactive simulation. This chapter takes one apart. We use a real MicroSim as our specimen throughout: the H-Bridge Circuit from the STEM Robots textbook, which lets a learner click four knife switches to send current through a motor in either direction. It is a good specimen because it follows the current MicroSims 2.0 conventions, and we contrast it with the older Bouncing Ball MicroSim from version 1.0 where the two differ. The electronics do not matter here. What matters is the container: the files, the regions of the drawing and the metadata that make the simulation findable and safe to embed.

## The MicroSim Directory

A **MicroSim directory** is the single folder that holds everything belonging to one MicroSim. In a MkDocs textbook it lives at `docs/sims/<sim-id>/`, where the folder name, called the *sim-id*, is written in kebab-case: lowercase letters and dashes only, such as `h-bridge` or `bouncing-ball`. The name is not decoration. The same string becomes part of the published URL, the value the metadata file uses to identify the MicroSim, and the key that batch tools use to find it. Rename the folder and you change all three.

The convention exists so that both people and programs can find every part of a MicroSim without a search. Listing the H-Bridge directory shows five files:

```text
docs/sims/h-bridge/
    h-bridge.js      the p5.js sketch: all behavior and drawing
    h-bridge.png     the preview image
    index.md         the documentation page
    main.html        the HTML wrapper that loads the library and the sketch
    metadata.json    the machine-readable description
```

The microsim-generator skill lists the same layout in its shared standards: a `main.html` visualization file, an `index.md` documentation page, supporting `.js` or `.css` files, and a `metadata.json` file. Each file has one job, and each job is different from the others. The table below summarizes the five roles. We define each file in the sections that follow, so treat this table as a map to return to.

| File | Who reads it | What it answers |
|------|--------------|-----------------|
| `main.html` | The browser | Which library to load, and which script to run |
| `<sim-id>.js` | The browser | What the MicroSim draws and how it responds |
| `index.md` | Readers and MkDocs | How do I use this, and how do I embed it? |
| `metadata.json` | Search tools and validators | What is this, who is it for, and how is it built? |
| `<sim-id>.png` | Gallery pages and social previews | What does it look like at a glance? |

A **worked example** shows why the convention pays off. Suppose you want to embed the H-Bridge in a chapter of your own textbook. Because the directory is named `h-bridge`, the address of the running simulation is predictable: from a chapter file the iframe path is `../../sims/h-bridge/main.html`, as the generator skill prescribes. Paths inside a chapter must always be relative, never absolute, because an absolute path like `/sims/h-bridge/main.html` breaks when a site is published under a subdirectory on GitHub Pages. The identifier inside its metadata, `https://dmccreary.github.io/stem-robots/sims/h-bridge/`, ends in the same folder name. A batch tool that must update the height of every embedded MicroSim can match the pattern `sims/<id>/main.html` in any page and know exactly which folder to consult. One name, used consistently, lets the whole toolchain work without configuration.

!!! mascot-thinking "One Name, Four Jobs"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Notice that the folder name is the URL, the identifier and the lookup key all at once. Think of it like a mailing address: change it and everything that pointed at the old one goes missing.

The directory is also how AI skills scaffold new work. The microsim-generator skill's scaffold step creates the directory and writes `main.html`, `index.md` and `metadata.json` from templates, skips any directory that already exists, and then leaves the agent to write only the JavaScript file. Chapter 5 explains that workflow, and Chapter 14 scales it to whole batches. For now, the point is that the convention is what makes such automation possible.

The diagram below lets you explore a MicroSim directory interactively. Before you use it, recall the five files defined above and the fact that a MicroSim directory sits inside `docs/sims/` of a MkDocs book.

#### Diagram: MicroSim Directory Explorer

<iframe src="../../sims/microsim-directory-explorer/main.html" width="100%" height="502px" scrolling="no"></iframe>

[Run the MicroSim Directory Explorer MicroSim Fullscreen](../../sims/microsim-directory-explorer/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>MicroSim Directory Explorer</summary>
Type: diagram
**sim-id:** microsim-directory-explorer<br/>
**Library:** vis-network<br/>
**Status:** Specified

Learning objective (Bloom level: Understand; verb: explain): The learner will explain the role of each file in a MicroSim directory and predict which file to edit to make a given change.

Nodes and edges: a tree with a root node `docs/sims/h-bridge/` and five child nodes, one per file: `main.html` (orange), `h-bridge.js` (steel blue), `index.md` (green), `metadata.json` (purple) and `h-bridge.png` (gray). Node shapes are boxes with the filename as the label. Edges are plain lines from the root to each file. Layout is a fixed hierarchical layout with the root at the top and physics disabled.

Interactions: hovering a node shows a tooltip with its one-sentence job. Clicking a node opens an information panel on the right with three parts: what the file contains, who reads it, and one change a person would make there. A "Which file?" button hides the labels and shows a change request such as "Make the slider start at 0.5" or "Add a learning objective", and the learner clicks the file to edit. The score shows correct picks out of attempts.

Responsive design: the network re-fits to the container width on window resize, and the information panel moves below the tree when the width is under 600 pixels.

Implementation: vis-network with fixed hierarchical positions and click and hover handlers on the nodes.
</details>

## The HTML Wrapper: main.html

The file **main.html** is the HTML wrapper that a browser opens to run the MicroSim. It is short on purpose. It declares the page, loads a JavaScript library from a content delivery network (CDN, the hosted copies described in Chapter 1), loads the MicroSim's own script, and provides an empty `<main>` element that the script fills. It contains no simulation logic at all, which keeps every MicroSim's wrapper nearly identical and easy to generate.

Two lines deserve attention before we read the file. The first is a `<meta name="schema">` tag whose content is the URI `https://dmccreary.github.io/intelligent-textbooks/ns/microsim/v1`. The generator skill requires it in every MicroSim HTML file so that MicroSims can be counted and discovered across GitHub by code search. The second is the `<main>` element. The sketch attaches its canvas inside `<main>` and measures the element's width to stay responsive, as we see later in this chapter.

Here is the complete `main.html` of the H-Bridge MicroSim.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="schema" content="https://dmccreary.github.io/intelligent-textbooks/ns/microsim/v1">
    <title>H-Bridge Circuit MicroSim using p5.js 2.3.4</title>
    <script src="https://cdn.jsdelivr.net/npm/p5@2.3.4/lib/p5.js"></script>
    <style>
        body {
            margin: 0px;
            padding: 0px;
            font-family: Arial, Helvetica, sans-serif;
        }
    </style>
    <script src="h-bridge.js"></script>
</head>
<body>
    <main></main>
    <br/>
    <a href=".">Back to Documentation</a>
</body>
</html>
```

Read it top to bottom. The `viewport` tag tells phones to use the device width. The `title` names the MicroSim and the library version. The first `script` line loads p5.js from a CDN, and the second loads the sketch from the same directory by relative name. The `style` block removes the default page margin so the canvas touches the edges of the iframe that will hold it. The final link returns to the documentation page, which sits in the same directory as `main.html`.

The old Bouncing Ball wrapper from MicroSims 1.0 is a useful contrast. It has the same two script lines, with the library pinned to the older release 1.11.10, but it lacks both the `viewport` tag and the schema tag, and its back link reads "Back to Bouncing Ball Lesson Plan". Both wrappers work in a browser. Only the newer one is discoverable by the code-search scheme.

## Pinned Library Version

A **pinned library version** is a library address that names one exact release, so the same code runs the same way every time. In the wrapper above, `p5@2.3.4` in the script address pins p5.js to release 2.3.4. Without the version, or with one that floats, the CDN could serve a newer release than the one the sketch was tested against, and a working MicroSim could change behavior or break the day the library updates.

The version number appears in three places in the H-Bridge directory: the script address in `main.html`, the `<title>` text, and the `dependencies` entry of `metadata.json`, which reads `p5.js 2.3.4 (jsDelivr CDN)`. Keeping the three in agreement lets a person or a tool see the library version without running the MicroSim. It also gives a maintainer a precise place to start when a newer library release is worth testing. Chapter 1 noted that a generative model may write code for an outdated library version, so the pinned version is also the standard against which generated code should be checked.

!!! mascot-warning "Do Not Float the Version"
    ![Bounce giving a warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Copying a script address from an old example can silently give you a different library release than your sketch expects. Always keep the full version in the address, and update the title and metadata in the same edit.

## The MicroSim JavaScript File

The **MicroSim JavaScript file** is the sketch that holds all of a MicroSim's behavior: what it draws, how it responds to the learner, and how it resizes. It is named `<sim-id>.js`, so the H-Bridge's is `h-bridge.js`, and it is the only file in the directory that contains real simulation logic. When you ask an AI skill for a MicroSim, this is the file the model writes. Everything else is scaffolding around it.

A p5.js sketch follows a fixed reading order that the repository's style guide states: global variables, then `setup()`, then `draw()`, then helper functions, then event handlers. Three terms are needed before we read the code. `setup()` is a function p5.js calls once when the page loads, and it creates the canvas, the rectangular drawing surface. `draw()` is called again and again, many times per second, to repaint the canvas. An *event handler* is a function that p5.js calls when something happens, such as `windowResized()`, which runs when the browser window changes size.

The first lines of the H-Bridge sketch set up the numbers that describe its layout. Three of them matter most. `drawHeight` is the height in pixels of the region where the simulation is drawn, `controlHeight` is the height of the strip below it that holds the controls, and `canvasHeight` is their sum. We explain these regions fully in the next sections. The comment on line 2, `CANVAS_HEIGHT`, is a declaration for tools, and we return to it shortly.

```javascript
// H-Bridge Circuit MicroSim
// CANVAS_HEIGHT: 530
let canvasWidth = 400;          // replaced by the container width
let drawHeight = 480;           // drawing region - no controls in here
let controlHeight = 50;         // control region - one row of buttons
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;
```

The width starts at a placeholder of 400 because the real width is not known until the page exists. The sketch measures it and replaces the value. That measurement, and the response to a window resize, come from two short functions that appear in the sketch. The function `updateCanvasSize()` reads the current width of the `<main>` element and stores it, and `windowResized()` calls it and then resizes the canvas to match.

```javascript
function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  // ... buttons and the describe() text are created here
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.floor(container.getBoundingClientRect().width);
  }
}
```

Trace the flow once. On load, `setup()` measures the width, creates a canvas of that width and the fixed `canvasHeight`, and attaches it inside `<main>`. When the window changes size, `windowResized()` measures again and resizes only the width, since the height is a constant. Width follows the container, and height stays fixed. That pairing is what the book calls a width-responsive MicroSim, and Chapter 12 examines it in depth. The `describe()` call inside `setup()` supplies a text description of the canvas for screen readers, which Chapter 24 returns to under accessibility.

The table below summarizes what each named part of the sketch is responsible for.

| Part of the sketch | Runs | Responsibility |
|--------------------|------|----------------|
| Global variables | Once, at load | Region heights, margins, colors, simulation state |
| `setup()` | Once | Create the canvas and controls, attach them to `<main>` |
| `draw()` | Repeatedly | Paint both regions and advance the animation |
| `windowResized()` | On resize | Re-measure the width and resize the canvas |
| Helper functions | When called | Geometry, drawing pieces, rule checks such as short-circuit detection |

A **worked example** shows how a maintainer uses this structure. A teacher asks for a taller drawing area so a projected circuit is easier to read. The maintainer changes `drawHeight` from 480 to 540. Because `canvasHeight` is computed from it, the canvas grows automatically. But the declaration comment and the iframe that embeds the MicroSim must also change, or the taller canvas will be clipped. The sections on the canvas height constant explain how to keep those in step.

!!! mascot-tip "Change One Number, Then Grep"
    ![Bounce giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    After you edit a region height, recompute the total and search the directory for the old one. In the H-Bridge the total 530 appears in the script comment and the metadata, and 532 appears in the page's iframe.

## The Two Regions: Draw and Control

Every MicroSim canvas is divided into two stacked rectangles, and the standard fixes their roles. The **draw region** is the upper rectangle where the simulation itself is rendered: shapes, animation, labels and readouts. The style guide colors it `aliceblue` and outlines it in `silver`. The sketch's own comment states the rule for it: do not place controls such as buttons or sliders in the drawing region. Keeping the region free of controls means learners always know where to look for the model and where to look for the knobs.

The **control region** is the lower rectangle that holds the user-interface controls: sliders, buttons, checkboxes, their labels and their current values. It is white with the same silver outline. Its height depends on what it contains. The Bouncing Ball sketch's comment suggests 30 pixels for each slider, so its single speed slider gets `controlHeight = 30`. The H-Bridge has one row of three buttons and a status label, so it uses 50. A sketch with several sliders needs proportionally more, and the generator skill's own example uses a 115-pixel control region.

The excerpt below is the code in `draw()` that paints the two regions. It sets the outline color and weight, then fills and draws each rectangle. The first rectangle starts at the top and is `drawHeight` tall. The second starts exactly at `drawHeight` and is `controlHeight` tall, so the two fit together with no gap.

```javascript
stroke('silver');
strokeWeight(1);
fill('aliceblue');
rect(0, 0, canvasWidth, drawHeight);
fill('white');
rect(0, drawHeight, canvasWidth, controlHeight);
```

Controls are positioned relative to `drawHeight`, not with fixed numbers. The H-Bridge's `positionControls()` places each button at `drawHeight + 10`, ten pixels into the control region. If `drawHeight` changes, the buttons move with it. Some MicroSims add a third region, a chart or graph panel, and its height is called `graphHeight`. The generator skill's predator-prey example uses a drawing height of 400, a graph height of 180 and a control height of 115.

The diagram below lets you build a canvas by changing region heights. Before using it, remember two facts from this section: the two regions stack vertically, and their heights add up to the canvas height.

#### Diagram: Canvas Height Calculator

<iframe src="../../sims/canvas-height-calculator/main.html" width="100%" height="662px" scrolling="no"></iframe>

[Run the Canvas Height Calculator MicroSim Fullscreen](../../sims/canvas-height-calculator/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Canvas Height Calculator</summary>
Type: microsim
**sim-id:** canvas-height-calculator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Apply; verb: calculate): The learner will calculate the canvas height and the iframe height for a MicroSim from its region heights, and will detect when an iframe is too short to show the controls.

Layout: a drawing region above a control region, following the standard MicroSim layout. The drawing region is aliceblue and the control region is white, separated by a silver line.

Visual elements: on the left, a scaled stacked rectangle showing a draw region and a control region with labeled heights; on the right, a rounded frame representing an iframe whose height can differ from the canvas. Below the drawing, a readout shows "canvasHeight = drawHeight + controlHeight" filled in with the current numbers, and "iframe height = CANVAS_HEIGHT + 2" filled in as well.

Controls:

- Slider "drawHeight" from 200 to 700 in steps of 10, default 480
- Slider "controlHeight" from 30 to 150 in steps of 5, default 50
- Slider "graphHeight" from 0 to 250 in steps of 10, default 0
- Slider "iframe height" from 200 to 900 in steps of 2, default 532
- Button "Set iframe correctly" that snaps the iframe height to the calculated value, and a checkbox "Show H-Bridge numbers" that loads 480, 50, 0 and 532

Behavior: when the iframe height is smaller than the calculated value, the bottom of the canvas is clipped in the picture, the clipped controls turn red, and a message says how many pixels are hidden. When the iframe is equal to or taller than the calculated value, the message says the MicroSim fits. The calculated value is always the sum of the three heights plus 2.

Responsive design: the drawing scales to the container width on window resize while heights in pixels stay proportional, and the sliders resize with the container.

Implementation: p5.js with the standard drawHeight and controlHeight variables, a windowResized function, and describe() text for screen readers.
</details>

### Why Controls at the Bottom?

The control region sits below the draw region because of something a teacher told us. Early in MicroSim testing, one teacher explained that their school runs MicroSims on Smartboards, the large interactive whiteboards at the front of a classroom that a teacher operates by touch. When the controls were on the sides, teachers had to reach over the canvas to use them, and the reach blocked the students' view of the drawing area. Putting the control region on top moved the drawing area down the board, and the teachers did not like that either, because students in the back of the room could not see the drawing area clearly. The best layout for schools that use Smartboards was the control region below the canvas, where the teacher's hand stays under the drawing instead of in front of it. That layout became a standard early in MicroSim testing and has stuck ever since.

## The Canvas Height Constant

The **canvas height constant** is the single number, written `CANVAS_HEIGHT`, that records the full rendered height of a MicroSim in pixels: the draw region plus the control region plus any graph panel or legend. It exists for a practical reason. A MicroSim is shown inside an iframe, and an iframe does not resize itself to fit its content. If the iframe is shorter than the MicroSim, the bottom is cut off, usually the controls. If it is much taller, the page shows wasted blank space. Every place that embeds the MicroSim needs the right height, and the constant is where that height is declared once.

The rule that turns the constant into an iframe height is simple: `iframe height = CANVAS_HEIGHT + 2`, where the extra two pixels account for the iframe border. The canvas-height strategy document applies this rule identically on the MicroSim's own documentation page and on every chapter page that embeds it, so a MicroSim is never a different height in two places.

The H-Bridge shows the rule in action. Its sketch declares `// CANVAS_HEIGHT: 530`, which equals `drawHeight` 480 plus `controlHeight` 50. The iframe in its documentation page is therefore 532 pixels tall, and the metadata records the same canvas height of 530.

Where is the constant stored? The strategy document lists four sources, and tools read the first one that has a value.

| Priority | Source | Used by |
|----------|--------|---------|
| 1 | A `// CANVAS_HEIGHT: <n>` comment in the first lines of `<sim-id>.js` | Any MicroSim with a script, the primary home |
| 2 | A `"canvasHeight": <n>` field in `metadata.json` | MicroSims with no script, such as pure diagram pages |
| 3 | A `<!-- CANVAS_HEIGHT: <n> -->` comment in `main.html` | Older MicroSims, kept for compatibility |
| 4 | The computed sum `drawHeight + controlHeight (+ graphHeight)` | Last resort, and the comment is then written back to the script |

Three rules govern the comment. It must appear within the first ten lines of the script, its value must be a plain integer with no `px` suffix, and it must be updated whenever a height-related value changes. A hand-typed height in an iframe tag is never the source of truth. It is derived, and the synchronization script overwrites it.

That script, `sync-iframe-heights.py` in the microsim-utils skill, reads each MicroSim's constant and rewrites every embedding iframe under `docs/`. Its flags include `--project-dir`, `--dry-run`, `--verbose` and `--write-metadata`. Running with `--dry-run --verbose` first reports what would change without writing anything. Chapter 12 covers the script and the runtime alternative in detail.

!!! mascot-warning "The Template Height Trap"
    ![Bounce giving a warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    The repository's `responsive-template.js` sets `drawHeight` to 400 and `controlHeight` to 50 but creates the canvas from a separate `containerHeight` of 400, so the 50-pixel control region is cut off. Always create the canvas from `canvasHeight`, as the H-Bridge does.

## The Documentation Page: index.md

The **index.md documentation page** is the Markdown page that presents the MicroSim inside the textbook site. MkDocs turns it into the web page a reader sees at the MicroSim's address. It has two jobs. It runs the MicroSim by embedding `main.html` in an iframe, and it explains the MicroSim to a teacher or student: what it shows, how to use it, and how to teach with it.

A standard page is built from a fixed sequence of parts, which the standardization checklist in the microsim-utils skill enumerates. First comes a block of front matter, defined in the next section. Then a level 1 heading with the title, then the iframe that runs the MicroSim, then a copy-and-paste iframe snippet that other people can place on their own sites, then a fullscreen button. After those come a description section, a lesson plan with objectives, audience, prerequisites, activities and assessment, and a references section.

The H-Bridge page shows the embedding parts. The page's own iframe uses a relative path and a height taken from the constant, while the snippet offered for copying uses the full published address, because a visitor's site cannot resolve a relative path into your repository.

```html
<iframe src="main.html" width="100%" height="532px" scrolling="no"></iframe>
```

The attribute `width="100%"` lets the iframe take the width of the page, which is what the width-responsive sketch measures. The attribute `scrolling="no"` prevents a scrollbar inside the iframe, since the height was set to fit exactly. The standardization skill also asks that iframes not carry a `frameborder` attribute, because the site's stylesheet styles all iframes. The fullscreen button is a plain Markdown link decorated with MkDocs Material classes: `[Run the H-Bridge Circuit MicroSim Fullscreen](main.html){ .md-button .md-button--primary }`.

The standardization skill turns this checklist into a scored rubric. It awards points for each present element: for example, 10 points for `main.html`, 10 for the iframe, 10 for `metadata.json`, 20 for the Dublin Core fields, and 10 for a lesson plan, with the full rubric totaling 100. The resulting number is written to the page's front matter as `quality_score`. The skill suggests that a MicroSim scoring 85 or above can be left alone. Those point values are the skill's own weights, a checklist for consistency and not a measure of how well anyone learns from the MicroSim.

## Page Front Matter and the Preview Image

**Page front matter** is the block of YAML, a simple key-and-value text format, delimited by lines of three dashes at the very top of `index.md`. MkDocs reads it as data about the page rather than as text to display. The site uses it for the page title, the description shown in search results, and the social preview. This chapter's own first lines are an example. The H-Bridge page carries these fields:

```yaml
---
title: "H-Bridge Circuit"
description: "Click the four knife switches of an H-bridge, ..."
quality_score: 95
image: /sims/h-bridge/h-bridge.png
og:image: /sims/h-bridge/h-bridge.png
twitter:image: /sims/h-bridge/h-bridge.png
social:
   cards: false
status: implemented
---
```

The `title` and `description` name the page. The three image fields point to the preview image, and `quality_score` records the rubric result. The `social: cards: false` setting appears in the repository's examples and is configured by the site's social-card handling, which this chapter does not cover. The `status` field is a lifecycle marker, here `implemented`.

The **preview image** is a screenshot of the running MicroSim, saved as `<sim-id>.png` in the MicroSim directory. Three front matter fields reference it, always with the path pattern `/sims/NAME/NAME.png` where NAME is the sim-id. It serves two purposes: it is the image shown when the page is shared on social media, and it is the picture the gallery generator scales down to a 128 by 128 pixel thumbnail for the gallery page.

The microsim-utils skill captures the image with a headless browser using `~/.local/bin/bk-capture-screenshot <microsim-directory-path> [delay-seconds] [height]`. The delay gives the sketch time to render, and the height argument should equal the iframe height so the screenshot matches what readers see.

There is one crucial distinction to keep straight. The standardization skill separates two kinds of metadata: the YAML header in `index.md`, which supports the site and social previews, and the Dublin Core metadata, which lives only in `metadata.json`. It states plainly that Dublin Core fields never go in the YAML header.

!!! mascot-thinking "Two Kinds of Metadata"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Think of the front matter as the label on the box, written for the website, and metadata.json as the catalog card, written for search tools. They describe the same MicroSim to two different audiences, so they must not be merged.

## The Metadata File: metadata.json

The file **metadata.json** is the machine-readable description of a MicroSim, structured so that programs can search, filter, validate and compare MicroSims without running them. It is the most information-dense file in the directory. Recall from Chapter 1 that a learning object without a description works, but only for someone who already knows it exists. This file is the description.

The structure is defined by a JSON Schema in the repository, `src/microsim-schema/microsim-schema.json`. A schema is a formal specification of which fields a JSON document must and may contain. Everything sits under a top-level `microsim` object with five required sections and three optional ones. The table below summarizes them with the fields the schema requires, after which we look at a real file.

| Section | Required? | Required fields | What it describes |
|---------|-----------|-----------------|-------------------|
| `dublinCore` | Yes | title, creator, subject, description, date, type, format, rights | Standard resource description |
| `search` | Yes | tags, visualizationType | How to find it |
| `educational` | Yes | gradeLevel, subjectArea, topic, learningObjectives | Who it is for and what it teaches |
| `technical` | Yes | framework, canvasDimensions | How it is built |
| `userInterface` | Yes | controls | What the learner can operate |
| `simulation`, `analytics`, `usage` | No | none | Model details, event collection, classroom use |

Dublin Core is a small, widely used vocabulary for describing any resource, with fields such as title, creator and rights. The other sections extend it for teaching and searching. The optional `analytics` section is reserved for the event collection that Chapters 16 and 17 design. As of this writing, no learner data has been collected through MicroSims, so treat that section as a plan, not a record.

The following excerpt is abridged from the H-Bridge file. It keeps real values and drops the keys not shown, so it shows the shape of all five required sections.

```json
{
  "microsim": {
    "dublinCore": {
      "title": "H-Bridge Circuit",
      "creator": ["Dan McCreary"],
      "subject": ["H-Bridge", "DC Motors", "Robotics"],
      "type": "Interactive Simulation",
      "format": "text/html",
      "identifier": "https://dmccreary.github.io/stem-robots/sims/h-bridge/",
      "language": "en",
      "rights": "CC BY-NC-SA 4.0"
    },
    "search": {
      "tags": ["h-bridge", "motor driver", "short circuit"],
      "visualizationType": ["simulation", "animation", "diagram"]
    },
    "educational": {
      "gradeLevel": ["8", "9", "10", "11", "12"],
      "learningObjectives": [
        "Explain how closing diagonally opposite switches sets the direction of current through a DC motor."
      ],
      "bloomsTaxonomy": ["Understand", "Apply", "Analyze"]
    },
    "technical": {
      "framework": "p5.js",
      "canvasDimensions": { "width": 700, "height": 530, "responsive": true },
      "dependencies": ["p5.js 2.3.4 (jsDelivr CDN)"]
    },
    "userInterface": {
      "controls": [
        { "id": "forwardButton", "type": "button", "label": "Forward" }
      ]
    }
  }
}
```

A **worked example** shows how the file is used. A teacher searches a catalog for "grade 9 simulations where the learner analyzes a circuit". A tool can filter on `gradeLevel`, on `bloomsTaxonomy` containing Analyze, and on `tags`, and it never opens `main.html`. The same file tells a maintainer that the MicroSim depends on p5.js 2.3.4 and that its canvas is 530 pixels tall.

To check a file against the schema, the repository provides `src/microsim-schema/validate.py`, run as `python validate.py path/to/metadata.json`. It requires the Python `jsonschema` package and exits with status 0 when every file is valid. Chapter 15 develops metadata into search and reuse, so here the goal is only to read one.

Not every MicroSim in the repository follows this layout. The older Bouncing Ball and template `metadata.json` files list their fields flat, without the `microsim` wrapper and its sections. They contain Dublin Core fields but not the nested structure the current schema and validator expect.

!!! mascot-encourage "It Is a Long File"
    ![Bounce encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    A metadata file with dozens of fields looks daunting the first time. You have already read files longer than this one, so start with the five required sections and let the AI skill fill in the rest.

## The MicroSim Template

The **MicroSim template** is the starter directory an author copies to begin a new MicroSim by hand. In this repository it is `docs/sims/template/`. It contains a `main.html`, an `index.md`, a `metadata.json`, and several sketch files: `sketch.js`, `responsive-template.js`, an empty `resize-width.js`, and a local test page `00-template-local.html`. All contain placeholder values such as the title "Title" and the description "Description."

The CLAUDE.md steps for a new simulation say to copy the template, create `docs/sims/{sim-name}/`, add the required files, add metadata, add a navigation entry to `mkdocs.yml`, regenerate the gallery, and validate. Those steps are correct in outline, but the template directory has aged, and a **worked example** of using it shows why you should inspect what you copy. `sketch.js` begins with a Git merge-conflict marker on line 1 and a divider marker on line 44, so two versions of the sketch are interleaved, and one of them declares `function setup {` without parentheses. It will not run as it stands. The template's `metadata.json` uses the older flat layout, and `responsive-template.js` has the height mismatch noted earlier.

Two lessons follow. First, in MicroSims 2.0 the preferred starting point is not a hand copy but the scaffold step of the generator skill, which writes fresh `main.html`, `index.md` and `metadata.json` files from current templates. Second, a mature MicroSim like the H-Bridge is a better reference than the template for what a finished directory should look like. Use the template to see the file list and the placeholder pattern, and use a current showcase to see the conventions applied.

## Auditing a MicroSim Directory

We can now combine every part into one inspection routine. Given an unfamiliar MicroSim directory, an experienced maintainer checks these items in about a minute.

- The folder name is kebab-case and matches the name used in the page's iframe path.
- `main.html` has the schema tag, the viewport tag, a pinned library address and a script line that names the sketch.
- The sketch declares `CANVAS_HEIGHT` in its first lines, equal to `drawHeight + controlHeight`, and creates the canvas from `canvasHeight`.
- The drawing region has no controls, and controls are positioned relative to `drawHeight`.
- `index.md` has front matter with image fields, an iframe at the constant plus 2, a fullscreen button, and a lesson plan.
- `metadata.json` validates against the schema and its `canvasDimensions` and `dependencies` agree with the sketch and the wrapper.
- The preview image exists at the path the front matter names.

Try this routine on the interactive audit below. Before you begin, review the failure modes covered in this chapter: a floating library version, a height mismatch, a missing schema tag, and Dublin Core fields in the wrong place.

#### Diagram: MicroSim Directory Audit

<iframe src="../../sims/microsim-directory-audit/main.html" width="100%" height="562px" scrolling="no"></iframe>

[Run the MicroSim Directory Audit MicroSim Fullscreen](../../sims/microsim-directory-audit/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>MicroSim Directory Audit</summary>
Type: microsim
**sim-id:** microsim-directory-audit<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Evaluate; verb: critique): The learner will critique a MicroSim directory by finding planted defects and judging which ones would break embedding, discovery or display.

Layout: a drawing region above a control region. The drawing region shows a file tree on the left and a viewer pane on the right that displays the selected file's text. The control region holds the buttons.

Data: three sample directories, each with three to five planted defects drawn from this chapter: a script address with no version, a `CANVAS_HEIGHT` comment that does not equal drawHeight plus controlHeight, an iframe height that is not the constant plus 2, a missing schema meta tag, a missing preview image, a folder name with an uppercase letter, and Dublin Core fields placed in the front matter.

Interactions: the learner clicks a file to read it and clicks a line to flag it as a defect. The "Check audit" button marks each flag correct or a false alarm, lists the defects still missing, and for each found defect shows a one-sentence explanation of what would go wrong. A "Severity" dropdown on each flag lets the learner rate it as cosmetic, discovery, display or breaks-embedding, and the checker compares the rating to the rubric.

Behavior: the score shows defects found, false alarms and rating accuracy. "Next directory" loads the next sample in a shuffled order.

Responsive design: the file tree and viewer pane stack vertically when the width is under 600 pixels, and text wraps inside the viewer on window resize.

Implementation: p5.js with mouse click handlers, a data array of sample files with planted defects, and describe() text for screen readers.
</details>

## Chapter Summary

!!! mascot-celebration "You Can Read Any MicroSim"
    ![Bounce celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now open any MicroSim directory and say what its five files do, how its draw and control regions fix the canvas height, and how the constant, the iframe and the metadata must agree. That is the skill that every later chapter builds on.

The key ideas of this chapter are:

- A MicroSim directory at `docs/sims/<sim-id>/` holds every part of one MicroSim, and its kebab-case name is the URL, the identifier and the lookup key.
- `main.html` is a short wrapper that loads a pinned library version and the sketch, and it carries the schema tag that makes MicroSims discoverable.
- The MicroSim JavaScript file holds all behavior, in the order of globals, `setup()`, `draw()`, helpers and event handlers, and it keeps width responsive while height stays fixed.
- The draw region holds the simulation and no controls, the control region holds the controls, and their heights sum to the canvas height.
- The canvas height constant `CANVAS_HEIGHT` is declared once, and the iframe height is that constant plus 2.
- `index.md` documents and embeds the MicroSim, its page front matter serves the site, and its preview image is a `<sim-id>.png` screenshot.
- `metadata.json` holds Dublin Core and educational, technical and interface metadata under a `microsim` object, validated against a schema, and it is separate from the front matter.
- The template directory is a starting point that should be inspected before use, and the generator's scaffold step is the preferred route.

The next chapter turns from the parts of a MicroSim to its purpose, and shows how to write learning objectives with Bloom's Taxonomy so every MicroSim you build has a measurable goal.
