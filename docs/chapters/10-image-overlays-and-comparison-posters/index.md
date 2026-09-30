---
title: Image Overlays and Comparison Posters
description: Shows how to turn an AI-generated image into an interactive MicroSim with callout labels, hover zones, and grid-overlay comparison posters that have Explore and Quiz modes.
generated_by: claude skill chapter-content-generator
date: 2026-09-30 10:43:16
version: 1.10
---

# Image Overlays and Comparison Posters

## Summary

Explains how to turn an AI-generated image into an interactive MicroSim with callout labels, hover zones, and grid-overlay comparison posters with Explore and Quiz modes.

Students learn image prompts that keep text out of the picture, overlay data files, percentage-rectangle zones and the poster folder convention. After it, they can build a comparison poster from a data file.

## Concepts Covered

This chapter covers the following 20 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| Image Overlay | 42 |
| Callout Label | 2 |
| Hover Zone | 6 |
| Point-Marker Overlay | 1 |
| Overlay Data File | 3 |
| Overlay Image Prompt | 5 |
| Text-Free Image Rule | 1 |
| Grid Overlay | 24 |
| Comparison Poster | 17 |
| Poster Column Zone | 5 |
| Percentage Rectangle Zone | 2 |
| Explore Mode | 2 |
| Quiz Mode | 3 |
| Zone Summary and Facts | 2 |
| Edit Mode Alignment | 1 |
| Verbatim Text Prompt | 3 |
| Image Model Generation | 2 |
| Poster Folder Convention | 2 |
| Shared Overlay Library | 1 |
| Poster Quiz Question | 1 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 3: Learning Objectives and Bloom's Taxonomy](../03-learning-objectives-and-blooms-taxonomy/index.md)
- [Chapter 4: Choosing a MicroSim Type](../04-choosing-a-microsim-type/index.md)
- [Chapter 5: Generating MicroSims with AI Skills](../05-generating-microsims-with-ai-skills/index.md)
- [Chapter 6: p5.js MicroSims](../06-p5js-microsims/index.md)

---

## Welcome

!!! mascot-welcome "One Picture, Many Questions"
    ![Bounce waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    A good illustration is worth a thousand words, but a flat picture cannot tell you whether anyone understood it. In this chapter you will turn a single AI-generated image into a MicroSim that answers when learners hover, click, and quiz themselves. Let's bounce it around!

Chapters 6 through 9 built MicroSims out of code that draws shapes, charts, graphs and maps. This chapter takes the opposite route. We start from a finished picture, made by an image model, and add a thin layer of interaction on top of it. The result costs far less effort than drawing the same scene in code, and it still gives every region of the picture a name, a description and a place in a quiz.

We cover two engines. The first labels small structures with numbered markers, as in an anatomy diagram. The second divides a whole poster into large rectangular zones, as in a side-by-side comparison. Both read their content from a data file, both expect an image with carefully controlled text, and both let an author calibrate positions with a built-in edit mode.

## Turning a Picture into a MicroSim

An **image overlay** is an interactive layer of markers, zones and text panels drawn on top of a static image, so that regions of the image respond to hovering and clicking. The image supplies the visual content. The overlay supplies the names, the explanations and the interaction. Neither works alone: the image is silent, and the overlay has nothing to point at.

A **worked example** shows the division of labor. Suppose you want learners to study the parts of a plant cell. You ask an image model for an illustration of a cell with no writing on it. You then describe each structure in a data file: its name, its position in the picture, and a two-sentence explanation. The overlay engine draws a numbered marker on each structure and shows the explanation when the learner hovers over it. If a teacher later spots an error in the description of the nucleus, the fix is one edit in the data file, and the image never has to be regenerated.

That last point is the main economic argument for overlays. Text baked into pixels cannot be corrected without producing a new image, and image models make small lettering mistakes. Text held in a data file can be corrected, translated and searched. The overlay guide in the ibook-skills library also gives a measurement argument: a flat image produces no interaction events, while an overlay turns each hover, click and quiz attempt into something that could be counted. We should be precise about the current state. The two engine files we examine in this chapter contain no xAPI calls, so today they display interaction and do not record it. Chapter 17 shows how instrumentation is added.

!!! mascot-thinking "Separate the Picture from the Words"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Notice the design pattern hiding in this chapter: keep the part that is expensive to change (pixels) free of the part that changes often (words). Once you see that split, every rule about prompts and data files follows from it.

### Two Engines: Callout Overlays and Grid Overlays

Before we go deeper, we need names for the two engines. In the callout engine, the author marks a *point* on a structure, and the engine draws a numbered circle there, a line to a label, and an information box. In the grid engine, the author marks a *rectangle* on the image, and the engine makes the whole rectangle respond. The choice depends on the shape of the thing being labeled, as the table below summarizes.

| Question | Callout engine | Grid engine |
|---|---|---|
| What does the author mark? | A point on a small structure | A rectangle over a large region |
| Typical image | Anatomy, hardware internals, labeled components | Comparison poster with columns |
| Data list in the file | `callouts[]` with `x` and `y` | `zones[]` with `x1`, `y1`, `x2`, `y2` |
| Script and style files | `diagram.js` and `style.css` | `grid-diagram.js` and `grid-overlay.css` |
| Text in the image | None, not even a title | Printed column titles are expected |

The overlay guide gives a simple rule of thumb: use a callout overlay when small numbered markers should point at specific structures, and use a grid overlay when large rectangular hover zones make more sense. We treat the callout engine first because its vocabulary carries over to the grid engine.

## The Callout Engine

### Callout Labels and Point Markers

A **callout label** is the text that names a marked structure, shown in a label panel beside the image and connected to the structure by a leader line, which is a thin line from the marker to its label. A **point-marker overlay** is an overlay whose interaction points are single locations on the image, each drawn as a small numbered circle. The number links the circle to its label, so a learner can move from a structure in the picture to its name and back.

Each marker has a position given as percentages of the image size. The value `x` runs from 0 at the left edge to 100 at the right edge, and `y` runs from 0 at the top edge to 100 at the bottom edge. Percentages matter because the image is displayed at different sizes on a phone and on a wide monitor, and a marker at 40 percent across stays on the same structure at every size.

### Hover Zones

A **hover zone** is a region of the display that reacts when the pointer enters it, by highlighting itself and revealing information. In the callout engine, the marker and its label row are both hover zones: moving the pointer onto either one highlights the marker and its leader line and fills the information box below the image. In the grid engine, the hover zone is the entire rectangle. Hovering is a low-effort action, so it suits exploration, but touch screens have no hover, which is why a click or tap on the same target shows the same information.

### The Overlay Data File

An **overlay data file** is a JSON file, named `data.json`, that holds everything the overlay engine needs: the image filename, the title, the layout, and one entry per marker or zone. JSON, as Chapter 1 noted, is a plain-text format that programs read easily. Before reading the sample, note the fields it uses. The `label` is the structure's name. The `hint` describes what the structure looks like without naming it, and quiz mode uses it. The `description` is the explanation shown on hover. The `color` is a hex color for the marker, and `radius` sets the marker size in relative units, typically 3 to 6.

```json
{
  "title": "Animal Cell",
  "orientation": "landscape",
  "image": "animal-cell.png",
  "callouts": [
    {
      "id": 1,
      "label": "Nucleus",
      "x": 40.2,
      "y": 16.1,
      "radius": 5,
      "color": "#8E44AD",
      "hint": "Large round purple structure near the center of the cell.",
      "description": "The control center of the cell, enclosed by a double-membrane nuclear envelope with pores. Contains DNA organized into chromosomes."
    }
  ]
}
```

This excerpt, adapted from the schema reference in the overlay guide, holds a single callout. The engine reads the file when the page loads, draws one marker at 40.2 percent across and 16.1 percent down, and fills the label panel and information box from the text fields. Adding a second structure means appending another object to the list with the next `id`, since identifiers are sequential integers starting at 1.

Two further top-level fields are worth knowing. The `layout` field chooses where labels go: `side-panel` puts the image on the left and labels on the right and is the default, `top-bottom` puts labels above and below a wide image, and `dual-panel` puts labels on both sides for diagrams with twelve or more callouts. The `showNumbers` field turns the numbers in the markers on or off. The guide recommends keeping markers at least 5 to 8 percentage points apart so that they do not overlap.

!!! mascot-warning "Check Which Tip Field Your Engine Reads"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    The schema reference names the optional extra-detail field `tip`, but the older copy of `diagram.js` in the STEM Robots repository reads a field named `ap_tip`. If your tips never appear, search your copy of the engine for the field name and match your data file to it, or update the engine to the current version.

The following specification lets learners see how a data file becomes an interactive picture. Every term it uses has been defined above.

#### Diagram: Callout Overlay Anatomy Explorer

<iframe src="../../sims/callout-overlay-anatomy-explorer/main.html" width="100%" height="622px" scrolling="no"></iframe>

[Run the Callout Overlay Anatomy Explorer MicroSim Fullscreen](../../sims/callout-overlay-anatomy-explorer/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Callout Overlay Anatomy Explorer</summary>
Type: infographic
**sim-id:** callout-overlay-anatomy-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Understand; verb: explain): The learner will explain how each field of an overlay data file (position, label, hint, description) appears in the rendered overlay, by changing one field and observing the effect.

Layout: a two-column drawing region. The left column shows a simple flat-color illustration of a cell drawn with p5.js shapes (no text in the picture) with four numbered markers. The right column shows the data file as syntax-colored JSON text with the selected callout highlighted. A white control region below holds the mode buttons.

Data: four callouts (nucleus, cell membrane, mitochondrion, ribosome) with x and y percentages, colors, hints and one-sentence descriptions, using the same field names as the schema.

Interactions: hovering a marker highlights its leader line and the matching JSON block and shows its description in an information box. Sliders labeled "x" and "y" move the selected marker, and the JSON text updates live so the learner sees percentages change. A "Resize picture" slider scales the drawing region from 50 to 100 percent of its width, and the markers stay on the same structures, demonstrating why percentages are used. A "Quiz" button hides the labels and shows each hint in turn; the learner clicks the marker that matches.

Responsive design: the two columns stack vertically when the container is narrower than 600 pixels, and all marker positions are recomputed from percentages on every window resize.

Implementation: p5.js with mouseMoved and mousePressed handlers, createSlider controls positioned relative to the drawing height, and a describe() call summarizing the current selection.
</details>

## Making the Image: Prompts and Rules

### The Text-Free Image Rule

The **text-free image rule** says that an image intended for a callout overlay must contain no text of any kind: no labels, no numbers, no arrows, no callout lines, and no title. The overlay engine draws every word and mark at runtime. Any lettering already in the picture would collide with the engine's markers and would duplicate the title, which the engine renders as a heading from the `title` field of the data file.

The rule exists because image models add text whether or not you ask for it, and the title is the most common intruder. If the generated image comes back with a title, a stray label, or garbled pseudo-letters, the guide's instruction is to regenerate it. The same rule has a matching duty on the documentation page: the `index.md` for the MicroSim uses the front matter `title` field only and does not add its own top-level heading, because the engine's heading inside the iframe would then appear twice.

### The Overlay Image Prompt

An **overlay image prompt** is the instruction text given to an image model to produce the picture for an overlay, written to a file named `image-prompt.md` in the MicroSim's folder. The overlay guide supplies a template with four parts. A *critical rule* section states the text-free image rule at the top. An *image specifications* section gives the format, pixel dimensions (typically 1200 by 900 for landscape), background color and art style. A *what to draw* section describes each structure with its position and appearance. A *layout notes* section reserves space so that markers will fit cleanly.

The guide gives four habits that make prompts work. Be specific about colors, and use hex codes. Describe each position in words and in percentages, such as "centered at 35 percent from the left and 25 percent from the top". Describe each structure independently so the model can render it without ambiguity. Repeat the no-text rule at the top and again in the layout notes, because models frequently add labels anyway.

A **worked example** for the cell diagram follows. It is a short sketch of the template's structure, not a complete prompt.

```markdown
# Animal Cell — Image Generation Prompt

## Critical Rule
This image must contain absolutely no text, labels, arrows, callout
lines, or numbers, and no title or heading of any kind.

## Image Specifications
- Format: PNG, 1200 x 900 px (landscape, 4:3)
- Background: clean white (#FFFFFF)
- Style: flat scientific illustration for a college textbook

## What to Draw
A cross-section of an animal cell filling most of the frame.

### 1. Nucleus
Position: centered at 40% from the left, 16% from the top.
Visual: large round purple structure with a darker double outline.

## Layout Notes
Leave at least 8% of the width between neighboring structures.
Repeat: no text anywhere in the image.
```

Read the sketch from the top. The critical rule comes first so that it cannot be missed. The specification lines fix the size and style so that the image proportions match the data file. The numbered structure gives the model a position that corresponds to the `x` and `y` values you will later write in the data file, which makes the first placement of markers a good guess.

!!! mascot-tip "Write the Percentages Twice"
    ![Bounce giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Use the same percentages in the image prompt and in your first draft of `data.json`. The markers will start close to the right structures, and calibration becomes a nudge instead of a hunt.

### Image Model Generation

**Image model generation** is the step in which a text-to-image model turns the prompt into a picture file. The workflow around it is manual and short. You copy the prompt into an image tool, save the resulting PNG in the MicroSim's folder under the exact filename that `data.json` names, and open the page to see the overlay appear. In the STEM Robots posters, the image-prompt files tell the author to copy the prompt into an image tool such as ChatGPT, DALL-E 3, Gemini Imagen 3 or a similar model and to save the output under a fixed filename. Model names and capabilities change quickly, so treat those tools as examples and not as requirements.

Because generation is a separate manual step, a filename mismatch is the most common failure. The image field in `data.json` is case-sensitive and must match the file on disk. The STEM Robots repository shows how easily this happens: its motor-control poster's `data.json` and image file use the name `motor-control-infographic.png`, while its `index.md` and `image-prompt.md` refer to `motor-control-methods-infographic.png`. Following the instructions on that page literally would save the file under a name the overlay does not load.

!!! mascot-warning "Name the File Once"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A picture saved under a slightly different name shows up as a broken image, and the cause is easy to miss. Copy the filename from `data.json` into the prompt file's instructions, and search the folder for the old name before you publish.

### Edit Mode Alignment

Model output never lands exactly where the prompt said. **Edit mode alignment** is the calibration step in which the author opens the overlay with `?edit=true` appended to the page address, drags markers or zone corners onto the correct places in the actual image, and copies the resulting coordinates back into the data file. The guide's calibration workflow is four steps: open the page in edit mode, drag each marker, click Copy JSON, and replace the coordinates in `data.json`.

The grid engine's edit mode gives each zone four draggable corner handles instead of one draggable marker, and it prints the live percentages as you drag. One detail from the engine's code deserves attention. The JSON it copies contains the title, image, layout, zones and quiz, but it omits `showLabels` and `palette`. Pasting the copied text over the whole file would silently drop those two fields, so replace only the `zones` array, as the guide instructs.

Here is a summary of the whole callout workflow so far.

| Step | Author action | Output |
|---|---|---|
| 1 | Write the overlay image prompt | `image-prompt.md` |
| 2 | Generate the picture and save it | PNG named in `data.json` |
| 3 | Draft the overlay data file with estimated percentages | `data.json` |
| 4 | Open `main.html?edit=true`, drag, and copy | Calibrated coordinates |
| 5 | Paste the coordinates back and reload | Working overlay |

The next specification tests whether a learner can spot prompt text that would break the overlay.

#### Diagram: Prompt Text Rule Checker

<iframe src="../../sims/prompt-text-rule-checker/main.html" width="100%" height="602px" scrolling="no"></iframe>

[Run the Prompt Text Rule Checker MicroSim Fullscreen](../../sims/prompt-text-rule-checker/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Prompt Text Rule Checker</summary>
Type: microsim
**sim-id:** prompt-text-rule-checker<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Evaluate; verb: judge): The learner will judge whether a line of an image prompt is safe for a callout overlay or violates the text-free image rule, and will justify the judgment.

Layout: a drawing region showing a draft image prompt as a list of eight to ten lines, one per row, above a control region with buttons "Keeps image text-free" and "Risks text in image".

Data: at least twelve prompt lines, half safe (for example "Background: clean white") and half risky (for example "Add the title Animal Cell across the top", "Label each organelle with its name", "Draw arrows pointing to the nucleus"). Each line has a one-sentence explanation of why it is safe or risky.

Interactions: the learner clicks a line and then a judgment button. The line turns green or red and its explanation appears. A "Rewrite" button on each risky line shows a safe replacement. A score readout shows correct judgments out of attempts, and the lines are shuffled on each run.

Responsive design: line text wraps inside its row, and row height and button size scale with the container width on window resize.

Implementation: p5.js with mousePressed hit testing on rows, a describe() call, and lines stored in an array of objects.
</details>

## Grid Overlays and Comparison Posters

The callout engine suits small structures. Many teaching images are different: they compare two or three things side by side, with a column for each. For those, we switch engines.

### Grid Overlay

A **grid overlay** is an image overlay whose interactive regions are large rectangles, called zones, drawn over the image and defined in a data file, so that each region of a poster responds to hover, click and quiz questions. The grid engine is a script named `grid-diagram.js` with a style sheet named `grid-overlay.css`. Unlike the callout engine, it does not use an `img` tag in the page template. The script creates the image and the transparent zone layer itself, using the filename in `data.json`.

### Percentage Rectangle Zones

A **percentage rectangle zone** is a rectangular region defined by four numbers, each a percentage of the image size: `x1` and `y1` for the top-left corner and `x2` and `y2` for the bottom-right corner. Percentages again make the zone independent of display size. A zone from 2 to 34 percent across and 12 to 90 percent down covers the same part of the picture whether the poster is shown at 400 or 1400 pixels wide.

Here is a **worked example** using the STEM Robots kit-comparison poster. Its zones are the three columns. Each spans vertically from 12 to 90 percent, which skips the printed title bar above the columns and the footer below. Horizontally the columns run from 2 to 34, 34 to 67, and 67 to 98 percent. Each zone's width is its right edge minus its left edge, so the first is 32 percentage points wide. If an author later regenerates the poster with slightly different margins, only these numbers need adjusting.

Calculation is easy to practice, so the next specification lets learners drag a rectangle and see the numbers.

#### Diagram: Percentage Zone Calibrator

<iframe src="../../sims/percentage-zone-calibrator/main.html" width="100%" height="537px" scrolling="no"></iframe>

[Run the Percentage Zone Calibrator MicroSim Fullscreen](../../sims/percentage-zone-calibrator/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Percentage Zone Calibrator</summary>
Type: microsim
**sim-id:** percentage-zone-calibrator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Apply; verb: calculate): The learner will calculate the x1, y1, x2 and y2 percentages of a rectangle drawn over an image and predict whether a given click falls inside it.

Layout: a drawing region containing a placeholder poster image (three colored columns drawn with p5.js shapes) and one translucent rectangle with four draggable corner handles. A white control region below holds a readout and buttons.

Controls: dragging a corner handle resizes the rectangle. A "Show percentages" checkbox (default on) prints x1, y1, x2 and y2 to one decimal place beside the handles. A "Copy JSON" button shows the zone object as JSON text in a panel. A "Target practice" button shows a random target rectangle and asks the learner to match it within two percentage points, then reports the error for each edge. A "Click test" toggle lets the learner click anywhere on the picture and reports whether the click is inside the zone.

Behavior: all coordinates are stored as percentages and converted to pixels on each draw, so a "Resize picture" slider that changes the drawing width leaves the percentages unchanged.

Responsive design: the drawing region width follows the container width on window resize, handle sizes stay at least 24 pixels for touch, and the readout wraps under the picture below 600 pixels.

Implementation: p5.js with pointer-based dragging, createSlider and createCheckbox controls, and a describe() call reporting the current percentages.
</details>

### Poster Column Zones and the Comparison Poster

A **comparison poster** is an infographic that sets two or three items side by side in parallel columns, with the same attributes listed down each column, so that the reader can compare them row by row. The STEM Robots repository contains six of them: I2C versus SPI, distance sensors, motor control methods, robot control modes, robot kits, and wireless technologies. A **poster column zone** is a zone that covers one column of such a poster, so that hovering or clicking anywhere in the column selects that item.

The poster's structure dictates the zone layout. Three equal columns give three zones that touch at their edges, and two columns give two zones with a small gap, as the I2C versus SPI poster does with edges at 4 to 49 and 51 to 96 percent. The overlay guide lists 2 to 6 zones as the practical range.

Text works differently on a comparison poster than on a callout image. The guide's grid rules require the columns to have visible titles built into the illustration, because the overlay's optional chip labels are hidden by default. That is why the grid overlay's data file has a `showLabels` field. Leave it `false` when the image prints its own titles, so the chip does not overlap them, and set it `true` only for an image with no printed titles.

This raises a question about the text-free image rule. The rule protects the callout engine, whose markers and labels need clear space. A grid overlay draws no markers on the image, so the poster's own text is welcome, and it is the reason the poster is useful as a printed classroom display. The two rules are consistent once you ask what the overlay draws and where.

!!! mascot-thinking "Two Rules, One Question"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Text-free for callouts and text-rich for posters can look like a contradiction. It is not: ask what the overlay itself will draw on the picture, and leave that space clear.

### Verbatim Text Prompts

Because a comparison poster prints text, the image prompt for it needs a different discipline. A **verbatim text prompt** is an image prompt that tells the model to render every word and number exactly as written, and it supplies the complete text of each title, badge, row label and value. The STEM Robots prompts open with an instruction to render all text exactly verbatim, and to avoid substituting numbers, paraphrasing labels, or inventing extra rows, columns or statistics. Where a cell says "None", the prompt tells the model to print that word exactly.

The prompts then spell out each column: the header, an accent color as a hex code, a price badge, an illustration described in words, and every attribute row in the form label, then value. In the robot-kits poster, for instance, the three columns are colored raspberry red, teal blue and deep purple, with price badges of about 18, 21 and 24 dollars. The illustration descriptions are specific: a top view of a two-wheeled robot, with a sensor module at the front, a wireless symbol above the board, or a small screen on top.

Verbatim prompting does not guarantee accuracy. It shifts the risk from the model's imagination to the author's spec, which is where you can check it. The motor-control prompt file in the repository contains a section headed as verification notes, marked "do not include in image", that records which sources the specs were checked against and which corrections were applied. For example, the notes record that the motor driver is the MX1508 and not another chip, so that the specs printed on the poster and shown in the overlay agree. Chapter 11 develops this into a full fact-verification pipeline.

The poster's numbers and the overlay's `facts` must also agree. Both derive from the same specification, so change them together, or the printed column will contradict the panel that opens when the learner clicks it.

### Zone Summary and Facts

Each zone in the grid data file carries two kinds of text. The **zone summary and facts** pair consists of a one-line `summary`, shown in italics under the zone's label, and a `facts` array whose entries appear as bullet points in the detail panel. The summary is what a learner reads first, so it should say what makes this column different from its neighbors. The facts hold the details.

Here is an excerpt of one zone from the robot-kits poster. The `id` is a unique kebab-case name that quiz questions refer to. The `color` sets the zone's border and hover highlight, and it matches the column's accent color in the image.

```json
{
  "id": "base-bot",
  "label": "Base Bot",
  "color": "#C7164E",
  "x1": 2, "y1": 12, "x2": 34, "y2": 90,
  "summary": "The core kit — motors, chassis, and a time-of-flight sensor",
  "facts": [
    "Total cost: ~$18 (the most affordable entry point)",
    "Display: none",
    "Best for: first-time robot builders; collision avoidance labs"
  ]
}
```

The file shortens the real zone, which carries eleven facts. The overlay guide suggests 3 to 6 facts per zone, and the real posters carry more, eleven or twelve per column in the robot-kits file. Longer fact lists give the detail panel more to teach, but the panel grows taller with them. Choose the length by how much the learner needs after the poster's own printed rows, and cut facts that only repeat those rows.

The full data file has the fields shown in the table below, all of which we have now met.

| Field | Level | Purpose |
|---|---|---|
| `title` | top | Image alt text |
| `image` | top | Filename of the poster image |
| `layout` | top | Must be `"grid"` |
| `showLabels` | top | Show chip labels inside zones |
| `palette` | top | Colors for the quiz celebration |
| `zones[]` | top | The rectangles, each with `id`, `label`, `color`, coordinates, `summary`, `facts` |
| `quiz[]` | top | Questions, each with `question`, `correct_zone`, `explanation` |

The next diagram brings the poster, its zones and its two modes together.

#### Diagram: Comparison Poster Explorer

<iframe src="../../sims/comparison-poster-explorer/main.html" width="100%" height="642px" scrolling="no"></iframe>

[Run the Comparison Poster Explorer MicroSim Fullscreen](../../sims/comparison-poster-explorer/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Comparison Poster Explorer</summary>
Type: infographic
**sim-id:** comparison-poster-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: compare): The learner will compare three items across the same attributes by exploring the columns of a poster, and will identify which column matches a described property.

Layout: a wide poster area with three flat-color columns (raspberry red, teal blue, deep purple) drawn with p5.js shapes and printed column titles "Base Bot", "WiFi Bot" and "Display Bot", above a detail panel and a control region with Explore and Quiz Me buttons.

Data: three poster column zones with edges at 2 to 34, 34 to 67 and 67 to 98 percent across and 12 to 90 percent down, each with a summary and at least four facts taken from the STEM Robots robot-kits data file (for example the approximate costs of 18, 21 and 24 dollars, wireless in the WiFi Bot, and the OLED screen in the Display Bot).

Interactions: in Explore mode, hovering a column highlights it and clicking opens its summary and facts in the panel. In Quiz Me mode, a question appears and the learner clicks the matching column; a wrong click shows which column was clicked and lets the learner try again, and a right click shows a confirmation. A "Show zone edges" checkbox reveals the four percentage values of each zone.

Responsive design: the poster and panel scale to the container width on window resize, and the panel moves below the poster at all widths.

Implementation: p5.js with rectangular hit testing from percentage zones, createButton controls, and a describe() call.
</details>

## Explore Mode and Quiz Mode

Both engines offer the same two learner modes, and the grid engine's code shows exactly how they behave.

**Explore mode** is the default mode, in which the learner hovers over zones to highlight them and clicks a zone to read its details. In the grid engine, hovering adds a highlight class to the zone, and a click fills the detail panel with the zone's label, summary and facts and marks the zone active. Before any click, the panel shows a prompt inviting the learner to click a column. In the callout engine, hovering a marker or its label row shows the description in the information box, and a click does the same.

**Quiz mode** is the mode in which the labels are hidden or the zones dimmed, a question is posed, and the learner must click the correct target. In the grid engine, selecting Quiz Me shuffles the questions, dims all zones, resets a score readout, and shows the first question above the poster. A correct click reveals that zone and opens a "Correct!" panel with an OK button to continue. An incorrect click flashes the wrong zone and displays a brief "try again" message that names the zone clicked. In the callout engine, the quiz replaces each marker's number with a question mark and asks the learner to click the structure named in the prompt.

### Poster Quiz Questions

A **poster quiz question** is a question stored in the `quiz` list of the data file, consisting of the question text, the `id` of the zone that answers it, and an optional explanation. The structure limits the question type: every question is a "which column?" question with exactly one correct zone. That fits the lowest Bloom levels well, where the learner identifies which item has a property, and it fits comparison, where the answer depends on distinguishing the columns.

A **worked example** from the robot-kits file shows a well-formed question. It asks which kit lets the learner drive the robot from a phone browser without a USB cable, and its correct zone is `wifi-bot`. Each of the file's five questions targets one distinguishing property, and the answers are spread so that each zone is correct at least once. The Base Bot answers the question about the lowest price, the WiFi Bot answers two questions, and the Display Bot answers two.

Three habits make such questions work. Base each question on one fact that is true of exactly one column, so that the answer is unambiguous. Cover every zone, so a learner cannot pass by guessing the same column each time. Write the `explanation` even though it is optional, because the schema marks it as reserved and the engine does not yet display it, so it currently documents the intended feedback for authors and for a later engine version.

One consequence of the code deserves a careful reading, because it affects how much you can learn from a quiz. In the grid engine, a wrong click does not change the score, and the learner can keep clicking until the right zone is found. The score counts only correct answers, so the completion message will always report every question as correctly identified. The engine displays engagement and gives feedback, but the score alone does not distinguish a learner who answered instantly from one who needed five tries. Recording each attempt would need instrumentation, which is the subject of Chapter 17.

## Building a Poster Collection

### The Poster Folder Convention

The **poster folder convention** is the file layout in which every comparison poster lives in its own folder, containing the same set of files. In the STEM Robots repository, each folder under `docs/posters/` contains an `index.md` documentation page, a `main.html` page that hosts the overlay, a `data.json` file, the poster PNG, and, in four of the six folders, a separate `image-prompt.md` file. All six `index.md` pages also carry the prompt in a section headed Image Prompt. A landing page, `docs/posters/index.md`, shows all posters as a grid of cards, each with a thumbnail, a title link and a one-sentence description.

The poster's `index.md` follows its own pattern. Its front matter carries a title, a description, image paths for social sharing, and `hide: toc`. The body states the audience and the chapter the poster supports, embeds the overlay in an iframe pointing at `main.html` with `width="100%"` and a fallback `height="800"`, and adds an About section. A section headed Image Prompt holds the prompt in a `!!! prompt` admonition, so a reader can copy it into an image tool.

Here is the layout for one poster, using a placeholder name.

```text
docs/posters/
  index.md                     landing page with a card for each poster
  shared-libs/                 engine scripts and styles used by every poster
  robot-kits/
    index.md                   documentation page with the iframe
    main.html                  overlay page that loads the shared libraries
    data.json                  image name, zones, quiz
    robot-kits-infographic.png the generated poster
    image-prompt.md            the prompt that produced the poster
```

Reading from the bottom, the prompt file records how the picture was made, the PNG is the picture, `data.json` describes the zones, and `main.html` loads the engine. The `index.md` wraps them for the site, and the landing page lists it. Chapter 15 returns to metadata and discovery for whole collections.

### The Shared Overlay Library

The **shared overlay library** is the set of engine files kept in one folder and loaded by every overlay page, instead of being copied into each poster or MicroSim folder. The overlay guide names four required files: `diagram.js`, `style.css`, `grid-diagram.js` and `grid-overlay.css`. In the STEM Robots repository they live in `docs/posters/shared-libs/`, alongside a template page and a second copy of the callout engine, and each poster's `main.html` references them with paths of the form `../shared-libs/grid-overlay.css`. In a book that keeps overlays under `docs/sims/`, the guide places the same folder at `docs/sims/shared-libs/`.

Sharing has two advantages: a bug fix in one file reaches every poster, and each poster folder stays small. It also has a cost, which is drift between copies. The guide tells authors to check that the project's copy matches the skill's bundled version. A comparison for this chapter found that the grid engine in the STEM Robots repository is identical to the bundled one, while its `diagram.js` differs, which explains the `ap_tip` field noted earlier. Compare your copies with a diff before you debug a mysterious behavior.

The last structural detail is height. An iframe has a fixed height, but an overlay's detail panel changes height when the learner clicks a zone with many facts. The grid engine sends the page's scroll height plus 30 pixels to the parent page in a `postMessage` event of type `microsim-resize` after each zone opens or question appears, and the parent page needs a listener that resizes the iframe. The callout engine measures the tallest description so that the iframe fits the worst case. A separate design note in the guide describes pinning the information box to that height so the controls never jump, and it lists this as a constraint for future changes to `reportHeight()`. We did not find that pinning code in either copy of `diagram.js` that we searched, so treat the note as a design description and verify it in your copy. Chapter 12 covers iframe heights in full.

The final specification lets learners audit a poster folder.

#### Diagram: Poster Folder Explorer

<iframe src="../../sims/poster-folder-explorer/main.html" width="100%" height="562px" scrolling="no"></iframe>

[Run the Poster Folder Explorer MicroSim Fullscreen](../../sims/poster-folder-explorer/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Poster Folder Explorer</summary>
Type: diagram
**sim-id:** poster-folder-explorer<br/>
**Library:** vis-network<br/>
**Status:** Specified

Learning objective (Bloom level: Understand; verb: describe): The learner will describe the role of each file in a poster folder and of the shared overlay library, and will identify which file to edit to fix a given problem.

Nodes and edges: a tree with the folder "docs/posters/" at the top, children "index.md" (landing page), "shared-libs/" (with four child files: grid-diagram.js, grid-overlay.css, diagram.js, style.css) and one poster folder "robot-kits/" with children "index.md", "main.html", "data.json", "robot-kits-infographic.png" and "image-prompt.md". Dashed arrows show "main.html loads shared-libs", "main.html fetches data.json", and "data.json names the PNG".

Interactions: clicking any node opens an information panel with a two-sentence role and one problem that the file would fix ("Zone in the wrong place: edit data.json", "Broken image: check the filename in data.json"). Hovering an arrow shows what passes along it. A "Fix it" mode shows a symptom and asks the learner to click the file to edit.

Responsive design: the network re-fits to the container width on window resize, and the information panel moves below the network under 600 pixels.

Implementation: vis-network with fixed hierarchical positions, physics disabled, and click and hover event handlers.
</details>

## Putting It All Together

We can now follow one comparison poster from idea to classroom. The author writes a specification for three columns and checks its facts. A verbatim text prompt turns the specification into an image request, and the image model returns a PNG, which the author saves under the filename in `data.json`. The author drafts percentage rectangle zones from the prompt's layout, opens the page in edit mode to align the zones, and pastes only the `zones` array back. The zone summaries and facts, and a handful of poster quiz questions, come from the same specification. The folder follows the convention, the shared library supplies the engine, and an iframe places the result in a chapter. The learner then explores by hovering and clicking, and tests themselves with Quiz Me.

## Chapter Summary

!!! mascot-celebration "You Can Build a Poster"
    ![Bounce celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now turn a text-free image or a verbatim-text poster into an interactive MicroSim, from the overlay image prompt through the data file to zone calibration and quiz questions. That is a complete pipeline, and you did it without drawing a single pixel yourself.

The key ideas of this chapter are:

- An image overlay adds markers, zones and text panels to a static image, so the words live in a data file and the pixels stay unchanged.
- The callout engine marks points on small structures with numbered callout labels, while the grid engine marks large percentage rectangle zones over columns of a poster.
- The text-free image rule keeps callout images clear of any lettering, and an overlay image prompt states it first and repeats it.
- A comparison poster prints its own text, so its prompt is a verbatim text prompt whose facts must match the zone summaries and facts in the data file.
- Edit mode alignment, opened with `?edit=true`, calibrates zones or markers in the real image, and only the `zones` array should be pasted back.
- Explore mode shows details on hover and click, and quiz mode asks "which column?" questions from the data file, though the grid engine's score does not record wrong attempts.
- The poster folder convention and the shared overlay library keep collections consistent, but copies of the shared engine can drift and should be compared.

The next chapter extends this idea to posters whose numeric claims are checked against cited sources before any pixel is rendered, and to the other specialized MicroSim types.
