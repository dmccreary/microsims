---
title: Width-Responsive Design and Iframe Heights
description: Shows how a MicroSim follows its container width and how iframe heights are declared, synchronized, measured at runtime and tested so nothing is clipped.
generated_by: claude skill chapter-content-generator
date: 2026-09-30 10:49:20
version: 1.10
---

# Width-Responsive Design and Iframe Heights

## Summary

Explains how MicroSims adapt to any container width and how iframe heights are set, synchronized and tested so nothing is clipped or hidden.

Students learn container width detection, the CANVAS_HEIGHT convention, height resolution order and the auto-height protocol. After it, they can make a MicroSim responsive and embed it at the right height.

## Concepts Covered

This chapter covers the following 15 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| Width Responsiveness | 26 |
| Container Width Detection | 2 |
| windowResized Handler | 1 |
| Iframe Height | 12 |
| CANVAS_HEIGHT Comment | 3 |
| Height Resolution Order | 2 |
| Iframe Auto-Height Protocol | 2 |
| postMessage Resize | 1 |
| Height Sync Tool | 1 |
| Relative Iframe Path | 2 |
| Mobile Layout | 2 |
| Control Wrapping | 1 |
| Text Overflow | 2 |
| Fullscreen Mode | 1 |
| Overlay Height Pinning | 1 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: What Is a MicroSim](../01-what-is-a-microsim/index.md)
- [Chapter 2: Anatomy of a MicroSim](../02-anatomy-of-a-microsim/index.md)
- [Chapter 6: p5.js MicroSims](../06-p5js-microsims/index.md)
- [Chapter 10: Image Overlays and Comparison Posters](../10-image-overlays-and-comparison-posters/index.md)

---

## Welcome

!!! mascot-welcome "Fit Every Screen"
    ![Bounce waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    A MicroSim that looks perfect on your laptop and loses its sliders on a phone has failed the learner who needed it most. In this chapter you will learn to make a MicroSim follow its container and to embed it at exactly the right height, so nothing is clipped and nothing is hidden. Let's bounce it around!

Chapters 2 and 6 introduced two facts in passing: a sketch measures its container width, and an iframe needs a height that matches the MicroSim. This chapter turns those facts into a complete engineering practice. We begin with the width, because it is the property that the learner's device controls, and then move to the height, which the author must declare, synchronize, and sometimes measure while the page runs.

## Width Responsiveness

A MicroSim can be embedded in a narrow textbook column, a wide slide, a phone, or a classroom projector. The author cannot know in advance which. **Width responsiveness** is the design rule that a MicroSim's width follows the width of the element that contains it, while its height stays a fixed constant. It is one of the properties in the definition of a MicroSim from Chapter 1, and this chapter is where that property becomes concrete.

The rule sits between two alternatives. A *fixed-width* design hardcodes both dimensions, such as 400 by 450 pixels. It is the simplest to write, but it forces horizontal scrolling on a narrow screen and wastes space on a wide one. A *fully responsive* design lets both width and height adapt. The v1.0 book of this project argued that this is more complex to write and test, and that vertical adaptation is usually unnecessary for educational content. Width-responsive design keeps the useful half of each: the layout flexes horizontally, and the fixed height gives the embedding page a predictable number to reserve, which the second half of this chapter depends on.

The table below compares the three approaches. It summarizes the paragraph above.

| Approach | Width | Height | Main cost |
|---|---|---|---|
| Fixed-width | Hardcoded | Hardcoded | Scrolls or wastes space on other screens |
| Width-responsive | Follows the container | Fixed constant | Every control must be repositioned on resize |
| Fully responsive | Follows the container | Follows the container | More complex code and testing |

A **worked example** shows the practical difference. Suppose a sketch draws a slider labeled "Gravity" whose track is 300 pixels long, and a learner opens the page in a 320-pixel-wide phone column. With a fixed design, the track plus its label runs past the edge and the learner must scroll sideways to reach the end of the slider. With a width-responsive design, the track length is computed from the container width, for example as the container width minus the label margin minus a right margin, so at 320 pixels the track shrinks to fit. The learner sees the same controls in the same order. Only the widths changed.

Two mechanisms make this work, and the next two sections define them. The first is measuring the container; the second is reacting when it changes.

### Container Width Detection

**Container width detection** is the step in which the sketch reads the current pixel width of the element that will hold its canvas, rather than assuming a number. In the standard p5.js MicroSim this element is the `<main>` tag from Chapter 1, and the measurement happens in a helper named `updateCanvasSize()`. The helper stores the result in the global variable `canvasWidth`, and `setup()` calls it before creating the canvas, so the very first frame already has the right width.

```javascript
let canvasWidth = 400;   // placeholder until the real width is measured

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.floor(container.getBoundingClientRect().width);
  }
}
```

The function looks up the `<main>` element, asks the browser for its bounding rectangle, and keeps the width rounded down to a whole pixel. The `if` guard prevents an error if the element is missing. Chapter 2's H-Bridge sketch uses `getBoundingClientRect()`, and the template in Chapter 6 uses the container's `offsetWidth`. Both read the same laid-out width, and the project's style guide names only the pattern, not one call, so either is acceptable when used consistently.

### windowResized Handler

The **windowResized handler** is the function `windowResized()` that p5.js calls automatically whenever the browser window changes size. Detection alone is not enough, because the container can change after the first frame: a learner rotates a tablet, drags a browser edge, or opens a sidebar. The handler re-runs the measurement, resizes the canvas, and repositions every control.

```javascript
function windowResized() {
  updateCanvasSize();                                     // measure again
  resizeCanvas(canvasWidth, canvasHeight);                // width changes, height does not
  speedSlider.size(canvasWidth - sliderLeftMargin - margin);
}
```

The call `resizeCanvas(canvasWidth, canvasHeight)` passes the constant `canvasHeight` unchanged. The last line resizes a slider, and this line is the one authors forget. A p5.js slider is an ordinary HTML element laid over the page, so it does not shrink when the canvas does. The generator skill's fix list records the symptom, a slider that extends past the right edge, and its cause: the size was set in `setup()` and never updated. Every horizontal slider needs its own `size()` call in the handler, using the same formula throughout the sketch.

!!! mascot-warning "Sliders Do Not Follow the Canvas"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A canvas that resizes while its sliders and buttons stay put looks fine at one width and broken at every other. After you write `windowResized()`, list every control the sketch creates and confirm that each one is resized or repositioned inside it.

The following MicroSim lets you feel these two mechanisms working together. Before reading the specification, note its terms. A *breakpoint* here means a container width at which a layout rule changes, such as a row of buttons wrapping onto a second line. The *control row* is the strip below the drawing region that holds sliders and buttons.

#### Diagram: Width-Responsive Breakpoint Lab

<details markdown="1">
<summary>Width-Responsive Breakpoint Lab</summary>
Type: microsim
**sim-id:** width-responsive-breakpoint-lab<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Apply; verb: demonstrate): The learner will demonstrate how container width detection and the windowResized handler keep a MicroSim usable, by dragging a container edge and switching the handler and slider resizing on and off.

Layout: a drawing region above a control region, following the standard MicroSim layout, with a "container" frame drawn inside the region. The frame has a draggable right edge, and inside it a miniature MicroSim is drawn: a ball, a slider labeled "Gravity", and a row of three buttons. A readout above the frame shows "container width = N px" and "canvas width = M px".

Controls:

- Draggable frame edge: sets the container width from 280 to 900 pixels, default 600
- Checkbox "Call windowResized" (default on): when off, the miniature canvas keeps the width it measured at load
- Checkbox "Resize sliders in the handler" (default on): when off, the slider track keeps its old length
- Button "Reload page": re-runs setup and measures the container again
- Dropdown "Preset width": Phone 375, Tablet 768, Desktop 1024 (clamped to the maximum)

Behavior: with both checkboxes on, the miniature canvas and slider follow the frame and nothing is clipped. With the first checkbox off, the canvas stays at its load width, so it is clipped or leaves blank space when the frame changes. With only the second checkbox off, the canvas follows but the slider track overshoots or undershoots, and a red outline marks the overflow. Clicking any element of the miniature shows a one-sentence note naming the function responsible for its width.

Instructional rationale: parameter exploration fits an Apply objective because the learner must predict what breaks, then confirm it by toggling each mechanism independently.

Responsive design: the lab itself is width-responsive and follows the same pattern it teaches, with a fixed height constant and controls repositioned on window resize.

Implementation: p5.js with createCheckbox, createSelect and createButton controls positioned relative to drawHeight, mouse drag handling for the frame edge, and a describe() call.
</details>

### Mobile Layout

**Mobile layout** is the arrangement a MicroSim takes when its container is narrow, typically a phone column. Width responsiveness makes the canvas fit, but a narrow canvas exposes problems that a wide one hides: labels collide, buttons overrun the edge, and text no longer fits its panel. The v1.0 book suggested testing at three common widths, 375 pixels for a phone, 768 for a tablet and 1024 or more for a desktop, and setting a minimum width of about 300 pixels below which the layout is not required to work. Those figures are that book's recommendations, not fixed rules, and the automated tester later in this chapter uses its own single width.

Designing for the narrow case first is a practical habit. If the layout works at 375 pixels, it almost always works wider, because extra width only adds empty space. The next two sections cover the two failures that appear most often at that width.

### Control Wrapping

**Control wrapping** is the practice of moving buttons that no longer fit on one row onto a second row, so the control region grows taller instead of running past the right edge. The microsim-utils visual checklist lists "buttons extend past right edge" as a failure, and the fix list offers three remedies in order: shorten the labels, wrap to a second row by increasing `controlHeight` and placing the second row at a lower offset, or narrow each button with `size()`.

Wrapping changes the height, which is why it interacts with the second half of this chapter. If `controlHeight` grows from 50 to 85 pixels to hold a second row, then `canvasHeight`, `CANVAS_HEIGHT` and the iframe height all grow by 35 pixels, and all three must be updated together. A wrapped control row that is not reflected in the declared height is a clipped control row.

### Text Overflow

**Text overflow** is content that extends past the boundary of the box meant to hold it: a long title cut by the canvas edge, a slider label spilling into its track, or a description running past the bottom of an information panel. The checklist's first category is legibility, and its rule is that every visible text element shows complete characters with at least 2 pixels of padding from any boundary.

The p5.js cause is worth knowing. The library has no clipping, so text drawn outside a rectangle simply renders past it, with no scroll bar to warn you. The fix list recommends sizing an offset from the measured label, using at least `textWidth(longestLabel) + 8`, and, for panels, either enlarging the panel, truncating the text, or wrapping it. Narrow widths make every one of these worse, so text overflow is best tested at the narrowest supported width.

!!! mascot-tip "Test the Longest Label"
    ![Bounce giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Layouts are usually tested with short sample text. Put your longest label, title and description into the sketch at your narrowest width, because that is the combination most likely to spill.

## Iframe Height

The width problem is solved by the sketch itself. The height problem is different, because the sketch does not control the box it appears in. An **iframe height** is the pixel height of the iframe element that displays a MicroSim inside a page, and it is set by the embedding page, not by the MicroSim. An iframe does not resize itself to fit its content, as Chapter 1 noted. If the iframe is shorter than the MicroSim, the bottom of the simulation is cut off, and since controls live at the bottom, the learner loses the sliders. If it is taller, the page shows a band of wasted blank space.

The project's approach is to record one number per MicroSim, which Chapter 2 introduced, and derive every iframe from it. This section covers where the number lives, how tools find it, and how it reaches every page that embeds the MicroSim.

### CANVAS_HEIGHT Comment

The **CANVAS_HEIGHT comment** is a single line near the top of the sketch that declares the MicroSim's full rendered height in pixels, including the drawing region, the control region and any graph panel or legend. The line has a fixed form, `// CANVAS_HEIGHT: <n>`, with a plain integer and no `px` suffix. The generator skill requires it within the first ten lines, and the synchronization script scans the first fifteen. The rule that turns it into an iframe height is `iframe height = CANVAS_HEIGHT + 2`, where the two extra pixels cover the iframe border.

A **worked example** with new numbers: a sketch has `drawHeight` of 400 and `controlHeight` of 50, so `canvasHeight` is 450. The first lines of the file declare it, and the iframe is written with 452 pixels.

```javascript
// Bouncing Ball Gravity Lab
// CANVAS_HEIGHT: 450
let drawHeight = 400;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
```

```html
<iframe src="../../sims/bouncing-ball-gravity-lab/main.html" width="100%" height="452px" scrolling="no"></iframe>
```

The comment is redundant with the variables on purpose. The skill's guide says the comment is a redundant-but-authoritative declaration for tools, so that a script can read the height without executing the sketch. For libraries other than p5.js, the generator skill lists approximations built from parts, for example a Chart.js MicroSim's chart container plus its title, controls and legend, and it gives sample values, not universal ones. Treat those as starting estimates to be checked in a browser.

### Height Resolution Order

Not every MicroSim has a script. A Mermaid diagram or a Leaflet map may be built entirely in `main.html`. The **height resolution order** is the ranked list of places where a tool looks for a MicroSim's height, taking the first one that has a value. The list makes one number retrievable for every library type.

| Priority | Source | Typical MicroSim |
|---|---|---|
| 1 | `// CANVAS_HEIGHT: <n>` comment in the first lines of `<sim-id>.js` | Any MicroSim with a script |
| 2 | `"canvasHeight": <n>` in `metadata.json` | MicroSims with no script |
| 3 | `<!-- CANVAS_HEIGHT: <n> -->` comment in `main.html` | Older MicroSims, kept for compatibility |
| 4 | Computed `drawHeight + controlHeight` (plus `graphHeight`) from the script | Last resort |

If none of the four yields a value, the MicroSim is reported as unresolved and its iframes are left untouched. This is also how directories that are not MicroSims are skipped safely. When the fourth source is used, the script writes the computed value back into line 2 of the `.js` file as a comment, so the next run finds it at priority 1.

!!! mascot-thinking "One Number, Many Iframes"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Notice the shape of this design: the height is stored once, next to the code that determines it, and every iframe is derived. If you hand-type a height into a chapter page, you have created a second source of truth that will drift the next time the sketch changes.

Before you look at the next specification, note its terms. A *source* is one row of the table above. A *trace* means following the tool's search from priority 1 downward until it finds a value.

#### Diagram: Height Resolution Order Tracer

<details markdown="1">
<summary>Height Resolution Order Tracer</summary>
Type: microsim
**sim-id:** height-resolution-order-tracer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: examine): The learner will examine a MicroSim folder and determine which of the four height sources a synchronization tool would use, and what iframe height results.

Layout: on the left, a folder tree of one MicroSim with toggleable files; on the right, a four-row stack of source boxes numbered 1 to 4, and beneath it a result panel reading "CANVAS_HEIGHT = n, iframe = n + 2" or "unresolved: iframes left untouched".

Controls:

- Preset dropdown: "p5.js sketch with comment", "Mermaid diagram with metadata only", "Legacy HTML comment", "Sketch with variables only", "No height anywhere"
- Checkboxes on each file element: "// CANVAS_HEIGHT comment present", "metadata.json canvasHeight present", "main.html comment present", "drawHeight and controlHeight variables present"
- Number fields for each value, default 450, 480, 500 and 400 plus 50
- Button "Trace": animates a highlight down the four boxes and stops at the first one that has a value

Behavior: the highlight passes over empty sources in gray and stops on the first source with a value in green, and the result panel shows that value plus 2. When source 4 is used, a note appears saying the comment would be written back to line 2 of the script. When all four are empty, the panel turns amber. If two sources disagree, both are shown but only the higher-priority one is used, and a tooltip explains why.

Instructional rationale: analysis of a priority rule is best supported by letting the learner set the inputs and predict the winner before pressing Trace.

Responsive design: the folder tree and the source stack sit side by side above 600 pixels and stack vertically below it, and text wraps inside boxes on window resize.

Implementation: p5.js with createCheckbox, createSelect, createInput and createButton controls, and a describe() call.
</details>

### Height Sync Tool

The **height sync tool** is the Python script `sync-iframe-heights.py` in the microsim-utils skill. It reads each MicroSim's height using the resolution order and rewrites every iframe that displays the MicroSim to `CANVAS_HEIGHT + 2`. It writes the value with a `px` suffix. The scan walks every Markdown file under `docs/`, so it updates the MicroSim's own `index.md` and every chapter, guide or poster page that embeds it, and it recognizes an embed by a `sims/<id>/main.html` path in the `src`. The script's pattern looks for a `height` attribute in the tag, so an iframe with no height attribute is not rewritten.

The script has five flags, listed here before the commands that use them. `--project-dir` names the project root containing `mkdocs.yml`, and the script searches upward for it if omitted. `--sim` limits the run to one MicroSim by its id. `--dry-run` reports changes without writing files. `--verbose` prints the resolved height and source for every MicroSim. `--write-metadata` copies each resolved height into `metadata.json` as `canvasHeight`, which is additive and useful for backfilling MicroSims with no script.

```bash
# Preview: what would change, and where each height came from
python3 sync-iframe-heights.py --project-dir /path/to/project --dry-run --verbose

# Apply to every MicroSim
python3 sync-iframe-heights.py --project-dir /path/to/project

# Apply to one MicroSim
python3 sync-iframe-heights.py --project-dir /path/to/project --sim bouncing-ball-gravity-lab
```

Running the dry run first is a good habit, because the script rewrites many pages. The generator skill also warns about an older predecessor, `fix-iframe-heights.py`, which updated only the MicroSim's own page and left chapter embeds at stale heights, so the MicroSim looked right on its own page and clipped in the chapter.

A related tool checks the result in a real browser. The skill's `test-iframe-heights.py` uses Playwright, an automated-browser library, to load each `main.html` at the iframe height declared in `index.md`, check that buttons, sliders and other controls fit, and suggest a new height on failure. It uses a fixed viewport width of 700 pixels, chosen to match a typical MkDocs Material content column. One caution from reading both scripts: the tester looks for `// CANVAS_HEIGHT = N` with an equals sign, while the sync script accepts a colon or an equals sign. Writing the comment with a colon, as this chapter does, satisfies the sync script but the tester will not read it as the declared height and falls back to measuring the page. Chapter 13 covers the tester as part of quality assurance.

!!! mascot-warning "Sync After Every Height Change"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    If you change `drawHeight`, add a control row, or wrap buttons, the comment and the iframes are now wrong until you update the comment and rerun the sync tool. Get in the habit of running it with `--dry-run --verbose` after any layout edit.


### Relative Iframe Path

A **relative iframe path** is an iframe `src` written relative to the page that contains it, never as an absolute path beginning with a slash. The generator skill states the rule strongly: absolute paths such as `/sims/...` break on GitHub Pages, because a project site is served under a subdirectory, for example `/geometry-course/`, so a leading slash points at the wrong place. The relative form is correct wherever the site is mounted.

The correct value depends on where the embedding page sits. Chapter 2 introduced the folders; the table below applies them.

| Embedding page | Correct `src` |
|---|---|
| The MicroSim's own `docs/sims/<sim-id>/index.md` | `main.html` |
| A chapter at `docs/chapters/<chapter>/index.md` | `../../sims/<sim-id>/main.html` |

The sync tool recognizes both forms. A bare `main.html` counts as an embed only when the page sits directly inside a folder under `sims`, which is how the tool avoids rewriting unrelated iframes. The generator skill also provides a `--fix-paths` option in its insertion tool that converts absolute paths to relative ones.

## The Auto-Height Protocol

The build-time approach has a limit. Some MicroSims have a height that cannot be known until they run: a layout that reflows at narrow widths, or an information panel whose text changes as the learner clicks. For these, the project documents a second mechanism that measures at runtime.

### Iframe Auto-Height Protocol

The **iframe auto-height protocol** is a two-part agreement between a MicroSim inside an iframe (the child) and the page that embeds it (the parent). The child measures its own content height after it has laid out and sends the number to the parent. The parent finds the iframe that sent the message and sets that iframe's height. Neither side needs to know the other's code, only the message format, and the format is fixed: a message whose `type` is the literal string `microsim-resize` and whose `height` is a number of pixels. The guide warns that both sides must agree on the string, so it should not be changed without updating every participating MicroSim.

Because the two systems can coexist, the static height in the Markdown becomes the loading-state default, which is the height the iframe has in the moment between page load and the first message. The guide asks authors to always set a sensible `height` attribute anyway, typically the fully rendered height, and the runtime message then overrides it.

| System | When it runs | Source of the number | Best for |
|---|---|---|---|
| Height sync tool | At build or before a commit | `CANVAS_HEIGHT` from the resolution order | Any MicroSim with a knowable fixed height |
| Auto-height protocol | In the learner's browser | `document.body.scrollHeight` measured at runtime | Layouts that change height after load |

### postMessage Resize

**postMessage resize** is the browser feature that carries the message. `window.postMessage` is a standard browser method that lets a window send data to another window, including the page that contains it, without either reading the other's variables. Inside an iframe, `window.parent` refers to the embedding page, so the child can call `window.parent.postMessage(message, '*')`. The second argument is the target origin, and `'*'` means any origin. The guide justifies it because these books are typically deployed on one GitHub Pages origin, and it advises tightening the value to the real parent origin if a MicroSim is ever embedded across origins.

The child-side code for a p5.js sketch has three parts that the next paragraph explains. The guard `window.self === window.top` is true when the page is not inside an iframe, which is the case in fullscreen mode, so the function returns without sending anything. The measurement `document.body.scrollHeight` is the total height of the page content, and the guide adds 10 pixels of breathing room. The `setTimeout` of 50 milliseconds delays the call because p5.js appends controls to the page asynchronously, so measuring inside `setup()` could miss them.

```javascript
function reportHeightToParent() {
  if (window.self === window.top) return;          // not embedded, so nothing to report
  const height = document.body.scrollHeight + 10;  // small breathing room
  window.parent.postMessage({ type: 'microsim-resize', height: height }, '*');
}

function setup() {
  updateCanvasSize();
  // ... createCanvas, createButton, createSlider, etc. ...
  setTimeout(reportHeightToParent, 50);            // wait for layout to settle
}
```

The parent-side listener belongs at the top of the site-wide `docs/js/extra.js`, and it is written once per project. It ignores any message that lacks the right type or a positive numeric height, then compares each iframe's `contentWindow` with the message's `event.source` to find the sender.

```javascript
window.addEventListener("message", function (event) {
  const data = event.data;
  if (!data || data.type !== "microsim-resize") return;
  if (typeof data.height !== "number" || data.height <= 0) return;

  const iframes = document.querySelectorAll("iframe");
  for (const iframe of iframes) {
    if (iframe.contentWindow === event.source) {
      iframe.style.height = data.height + "px";
      iframe.setAttribute("height", data.height);
      break;
    }
  }
});
```

Matching by `event.source` is deliberate. A page may hold several MicroSims that share a base path, and comparing `contentWindow` is the only reliable identification, whereas `src` strings and names can be duplicated. The listener sets both the style and the attribute because some themes and plugins read one and some the other.

A note about this repository: as of this writing, this book's own `docs/js/extra.js` does not contain this listener, and the site configuration loads that file plus a math library. The protocol is therefore documented and used elsewhere, but a MicroSim in this book that posts the message would have no parent listener until one is added. Chapter 10 noted the same dependency for overlays.

Three further cautions come from the guide. The report fires once by default, so a MicroSim whose height changes later must call it again from the relevant event handler or observe the page with a `ResizeObserver`, a browser feature that reports size changes. An iframe with a `sandbox` attribute must include `allow-scripts` or the message is silently dropped. And the parent should validate the number, as the listener above does, instead of trusting it.

!!! mascot-thinking "A Conversation Between Two Windows"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Think of the iframe as a room with no windows onto the outside except a mail slot. The MicroSim cannot reach out and resize its own frame, so it drops a note through the slot, and the page decides what to do with it.

### Overlay Height Pinning

Chapter 10's overlay MicroSims have a special height problem. Their information box, called the infobox, swaps its text each time the learner clicks a callout, so the content height varies while the iframe height must not jump under the learner's cursor. **Overlay height pinning** is the design, described in the generator skill's reference on iframe height pinning, that solves this in three steps. First, find the callout with the longest text. Second, temporarily fill the infobox with that text and read the infobox's height. Third, set that height as the infobox's inline `min-height`, restore the original text, and post the page height plus 30 pixels to the parent.

The effect is that the infobox box keeps its worst-case size even when it holds only the short prompt, so every element below it stays in place and the iframe is a single constant height. The reference works through an example in which the controls would otherwise move 130 pixels between the shortest and tallest states. It also lists a constraint: the page order of layout, infobox, then controls must not be changed, and the pin must be cleared at the start of each remeasurement, or the iframe would never adjust after a window resize.

We should be precise about what exists. The reference is a design description. When we read the shared `diagram.js` in the skill repository, its `reportHeight()` method performs the worst-case measurement and posts `document.body.scrollHeight + 30`, and a `ResizeObserver` calls it again on layout changes, but we did not find the `min-height` pinning lines in that file. Chapter 10 made the same observation. Treat pinning as a documented design that a copy of the library may or may not yet implement, and verify your copy before relying on it.

The specification below lets a learner see why pinning matters. First, two terms: the *worst case* is the callout whose text produces the tallest infobox, and a *jump* is a change in the vertical position of the controls when the learner selects a different callout.

#### Diagram: Iframe Resize Message Stepper

<details markdown="1">
<summary>Iframe Resize Message Stepper</summary>
Type: microsim
**sim-id:** iframe-resize-message-stepper<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: differentiate): The learner will differentiate the outcomes of a fixed iframe height, a runtime resize message, and a pinned infobox, by stepping through the protocol and observing where the controls land.

Layout: two side-by-side panels. The left panel is labeled "Child (MicroSim)" and shows a miniature overlay with an image area, an infobox and a control row. The right panel is labeled "Parent (chapter page)" and shows the iframe as an outlined rectangle around the child, with a text panel below it that lists the messages received.

Controls:

- Button "Next step" and button "Back": advance through the protocol in this order: page loads with the default height attribute, the child measures scrollHeight, the child posts a microsim-resize message, the parent's listener compares event.source, the iframe height changes
- Dropdown "Callout": Short prompt, Medium description, Long description with tip
- Radio "Mode": Fixed height only, Runtime message without pinning, Runtime message with pinning
- Checkbox "Parent listener installed" (default on)
- Slider "Iframe border allowance" from 0 to 40 pixels, default 30

Behavior: in "Fixed height only", choosing a long callout clips the controls and a clipped-region marker appears. In "Runtime message without pinning", every callout change moves the controls and a readout shows the number of pixels they jumped. In "Runtime message with pinning", the controls stay at one position and a gray band shows the reserved whitespace. With the listener unchecked, the message list shows the message sent and a note "no listener: iframe height unchanged". Clicking the message shows its fields, type and height.

Instructional rationale: a step-through with visible values is appropriate for an Analyze objective because the learner must compare three outcomes for the same content, and continuous animation would hide the sequence.

Responsive design: the panels sit side by side above 700 pixels and stack vertically below it, and all text wraps on window resize.

Implementation: p5.js with createButton, createSelect, createRadio, createCheckbox and createSlider controls positioned relative to drawHeight, and a describe() call.
</details>

## Fullscreen Mode

The last concept completes the picture. **Fullscreen mode** is the case in which a MicroSim is opened directly in its own browser tab, at its own `main.html` address, instead of inside an iframe. Authors provide it with a fullscreen button, a plain Markdown link decorated with MkDocs Material classes and placed after the iframe: `[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }`. The standardization checklist in the microsim-utils skill checks for this button.

Fullscreen mode changes two things. There is no parent page, so `window.self === window.top` is true and the height reporter correctly does nothing, which is why every snippet in this chapter starts with that guard. The container is also the whole browser window, so a width-responsive sketch simply stretches to the window width, and this is the setting in which the generator skill allows mouse-wheel zoom on maps and networks, since there is no page around them to scroll. Inside the iframe, wheel scrolling must not be hijacked, and the skill's example is setting the Leaflet option `scrollWheelZoom` to false unless explicitly requested.

A **worked example** to close the chapter follows one MicroSim through every concept. An author adds a control row of five buttons, which wrap onto two rows at 375 pixels, so `controlHeight` grows from 50 to 85. The author updates the `// CANVAS_HEIGHT` comment from 450 to 485 and runs the sync tool with `--dry-run --verbose`, which resolves 485 from the comment at priority 1 and plans to rewrite the chapter's iframe from 452px to 487px. The author confirms the change, reruns without `--dry-run`, and checks that the `src` is still the relative `../../sims/<sim-id>/main.html`. Finally, the author opens the fullscreen link to confirm the MicroSim stretches to the window, and views the page at a narrow width to confirm nothing is clipped.

!!! mascot-celebration "Nothing Clipped"
    ![Bounce celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now make a MicroSim follow its container with container width detection and a windowResized handler, declare its height once with a CANVAS_HEIGHT comment, and keep every iframe correct with the height sync tool. That combination is what keeps the controls visible on every screen.

## Chapter Summary

The key ideas of this chapter are:

- Width responsiveness means the MicroSim's width follows its container while its height stays a fixed constant, which is simpler than full responsiveness and predictable for embedding pages.
- The sketch measures the container with `updateCanvasSize()` in `setup()` and again in `windowResized()`, which must also resize every slider and reposition every control.
- Narrow layouts expose mobile layout problems, solved by control wrapping and by fixing text overflow, and any added row of controls changes the declared height.
- An iframe does not resize itself, so the iframe height is derived from one declared number, `CANVAS_HEIGHT`, using the rule `iframe height = CANVAS_HEIGHT + 2`.
- Tools find that number by the height resolution order: script comment, `metadata.json`, HTML comment, then computed variables, and the height sync tool rewrites every embedding iframe.
- Iframe paths are relative, `main.html` from the MicroSim's own page and `../../sims/<sim-id>/main.html` from a chapter, never beginning with a slash.
- The iframe auto-height protocol lets a MicroSim send `{ type: 'microsim-resize', height }` with `postMessage`, and a parent listener matches `event.source` to resize the right iframe.
- Overlay height pinning is a documented design that fixes the infobox at its worst-case height so controls do not jump, and fullscreen mode is the case in which the height reporter does nothing.

The next chapter shows how to check all of this automatically, with quality scores, browser tests and layout review.
