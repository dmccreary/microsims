---
title: MicroSim Directory Explorer
description: Explore the five files in a MicroSim directory (main.html, the sketch, index.md, metadata.json and the preview image) and practice choosing which file to edit for a given change.
image: /sims/microsim-directory-explorer/microsim-directory-explorer.png
og:image: /sims/microsim-directory-explorer/microsim-directory-explorer.png
twitter:image: /sims/microsim-directory-explorer/microsim-directory-explorer.png
social:
   cards: false
quality_score: 100
---

# MicroSim Directory Explorer

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the MicroSim Directory Explorer Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Every MicroSim lives in one folder, `docs/sims/<sim-id>/`, and each file in that folder has one
job. This explorer shows the H-Bridge showcase MicroSim's directory as a tree: the folder
`docs/sims/h-bridge/` at the top and its five files below it.

| File | Its job |
|---|---|
| `main.html` | Loads the library and the sketch into a web page |
| `h-bridge.js` | Draws the MicroSim and makes it respond to the learner |
| `index.md` | Explains the MicroSim and embeds it in the textbook |
| `metadata.json` | Describes the MicroSim so search tools can find and filter it |
| `h-bridge.png` | Shows what the MicroSim looks like at a glance |

Hovering a file shows its one-sentence job. Clicking it shows three things in the panel: what
the file contains, who reads it, and one change a person would make there. The **Which file?**
mode turns this around: it shows a change request, such as "Make the slider start at 0.5" or
"Add a learning objective that catalog searches can filter on," and you click the file you
would edit.

**Learning objective:** The learner will explain the role of each file in a MicroSim directory
and predict which file to edit to make a given change.

**Bloom's taxonomy level:** Understand (verb: *explain*)

## How to Use

1. Hover each file to read its job, then click it to read what it contains, who reads it, and
   a typical change.
2. Click the folder at the top to see why its name matters.
3. Press **Which file?** to start a round of six change requests. Click the file you would
   edit. A wrong pick tells you what that file actually does; try again, then press **Next
   change**.
4. The score shows correct picks out of attempts. Press **Explore** to return to the details.

When the page is narrower than 600 pixels, the panel moves below the tree.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/microsim-directory-explorer/main.html"
        height="502px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development).

### Duration

10-15 minutes

### Prerequisites

- The MicroSim Directory section of Chapter 2
- The web foundations of Chapter 1 (HTML, JavaScript, iframes)

### Activities

1. **Explore (4 min):** Click all five files. For each one, write "who reads it" in one word
   (browser, reader, search tool, gallery).
2. **Predict (5 min):** Play one round of **Which file?**. Before each click, say your reason
   aloud or write it down.
3. **Explain (4 min):** Pick two files that are easy to confuse (for example, `index.md` and
   `metadata.json`, which both describe the MicroSim). Explain the difference in audience.
4. **Apply (2 min):** Open a MicroSim folder in this book and find the same five files.

### Assessment

- The learner states the job of each of the five files in one sentence.
- The learner picks the correct file for at least five of six change requests on the first
  try.
- The learner explains why a learning objective for search tools belongs in `metadata.json`,
  while the lesson plan text belongs in `index.md`.

## References

1. [MkDocs](https://www.mkdocs.org/) - The static site generator that turns `index.md` into a
   web page.
2. [JSON](https://en.wikipedia.org/wiki/JSON) - Wikipedia. The text format of `metadata.json`.
3. [Dublin Core](https://en.wikipedia.org/wiki/Dublin_Core) - Wikipedia. The metadata
   vocabulary behind the descriptive fields in `metadata.json`.
4. [vis-network documentation](https://visjs.github.io/vis-network/docs/network/) - vis.js.
   The library used to draw the directory tree.
