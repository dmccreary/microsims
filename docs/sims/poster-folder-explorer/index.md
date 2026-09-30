---
title: Poster Folder Explorer
description: Explore the folder layout of a poster collection, including the shared overlay library and one poster folder's five files, and practice choosing the file to edit for a given symptom.
image: /sims/poster-folder-explorer/poster-folder-explorer.png
og:image: /sims/poster-folder-explorer/poster-folder-explorer.png
twitter:image: /sims/poster-folder-explorer/poster-folder-explorer.png
social:
   cards: false
quality_score: 100
---

# Poster Folder Explorer

<iframe src="main.html" height="562px" width="100%" scrolling="no"></iframe>

[Run the Poster Folder Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

The **poster folder convention** gives every comparison poster its own folder with the same set
of files, and the **shared overlay library** keeps the engine files in one folder that every
overlay page loads. This explorer draws that layout as a tree, using the STEM Robots
repository described in Chapter 10:

- `docs/posters/` at the root, with the landing page `index.md`
- `shared-libs/`, holding `grid-diagram.js`, `grid-overlay.css`, `diagram.js` and `style.css`
- one poster folder, `robot-kits/`, holding `index.md`, `main.html`, `data.json`,
  `robot-kits-infographic.png` and `image-prompt.md`

Solid gray lines show which folder contains which file. Three dashed orange arrows show how the
files depend on each other at run time: `main.html` **loads** the shared library,
`main.html` **fetches** `data.json`, and `data.json` **names** the PNG. Hover an arrow to see
exactly what passes along it.

Click any folder or file to read a two-sentence description of its role and one problem that
editing it would fix. **Fix it** mode turns this around: it shows a symptom, such as "The page
shows a broken-image icon where the poster should be," and you click the file you would edit.
Several symptoms separate a fault in one poster (edit that poster's `main.html` or `data.json`)
from a fault on every poster at once (edit the shared engine).

**Learning objective:** The learner will describe the role of each file in a poster folder and
of the shared overlay library, and will identify which file to edit to fix a given problem.

**Bloom's taxonomy level:** Understand (verb: *describe*)

## How to Use

1. Click each file in `robot-kits/` and read its role. Then click the four files in
   `shared-libs/`. Note which two a grid poster actually loads.
2. Hover the three dashed arrows to see what each one carries.
3. Press **Fix it**. Read the symptom and click the file you would edit. A wrong pick names the
   file you chose and lets you try again; a right pick explains why. Press **Next symptom** to
   continue through six symptoms.
4. Press **Explore** to return to the file roles.

When the page is narrower than 600 pixels, the information panel moves below the tree.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/poster-folder-explorer/main.html"
        height="562px"
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

- The Poster Folder Convention and Shared Overlay Library sections of Chapter 10
- The grid overlay data file fields (`image`, `zones`, `quiz`) from Chapter 10

### Activities

1. **Describe (5 min):** For each file in `robot-kits/`, write one sentence that states its job
   without using its file extension. Check your sentences against the panel.
2. **Trace (3 min):** Follow the dashed arrows and explain what happens to the page if
   `data.json` names `robot-kits.png` but the file on disk is `robot-kits-infographic.png`.
3. **Fix it (5 min):** Complete one round of six symptoms and record your first-try score.

### Assessment

- First-try score in Fix it mode.
- Given a symptom that appears on every poster and one that appears on a single poster, the
  learner names the file to edit for each and explains the difference.
- The learner describes why a shared library speeds up bug fixes and what risk it adds.

## References

1. [Directory (computing) - Wikipedia](https://en.wikipedia.org/wiki/Directory_(computing)) -
   Background on folders and the tree structure of a file system.
2. [Path (computing) - Wikipedia](https://en.wikipedia.org/wiki/Path_(computing)) - Relative
   paths such as `../shared-libs/grid-diagram.js`, which main.html uses to reach the shared
   library.
3. [vis-network documentation](https://visjs.github.io/vis-network/docs/network/) - The network
   library used to draw the folder tree and its dependency arrows.
