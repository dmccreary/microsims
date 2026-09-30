---
title: Nav Status Icon Legend
description: Match each MicroSim nav status icon and color to its tooltip, its meaning and the batch lifecycle state that usually produces it, with a matching quiz and a dark-mode contrast check.
image: /sims/nav-status-icon-legend/nav-status-icon-legend.png
og:image: /sims/nav-status-icon-legend/nav-status-icon-legend.png
twitter:image: /sims/nav-status-icon-legend/nav-status-icon-legend.png
social:
   cards: false
quality_score: 100
---

# Nav Status Icon Legend

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Nav Status Icon Legend MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Readers never see `sim-status.json`. What they see is a small colored icon beside each
MicroSim in the site navigation. This legend reproduces the five nav status icons used by the
sister book `learning-record-store`, with the colors from its `docs/css/extra.css` and the
tooltip text from the `extra.status` block of its `mkdocs.yml`:

| Status | Icon | Color | Tooltip in the nav |
|---|---|---|---|
| `scaffold` | filled circle | red `#d32f2f` | Scaffold — placeholder, not yet implemented |
| `built` | filled circle | orange `#f57c00` | Built — implementation complete, awaiting review |
| `implemented` | filled circle | blue `#1976d2` | Implemented — the MicroSim works |
| `instrumented` | broadcast signal | teal `#00897b` | Instrumented — the MicroSim emits xAPI events; add ?xapi=teaching to the URL to see them |
| `approved` | check circle | green `#388e3c` | Approved — tested and approved |

The mock sidebar lists five titles from this book. Their statuses are illustrative, chosen so
that each icon appears once. Selecting an icon shows its meaning and the batch lifecycle state
that usually produces it, using the mapping that Chapter 14 describes as this book's plan:
`scaffolded` gives `scaffold`, `implemented` gives `implemented`, `validated` gives `built` or
`approved` depending on score, and `instrumented` is set by `sync-status.py --apply` once a sim
carries xAPI handling. That mapping is a proposal; who sets `approved` is still an open
decision, and `sync-status.py` never overwrites it.

The panel also reports the contrast ratio of the icon color against the sidebar background.
Turn on **Dark mode** to check that the colors stay readable on a dark theme.

**Learning objective:** The learner will match each nav status icon and color to its meaning
and to the batch lifecycle state that usually produces it.

**Bloom's taxonomy level:** Understand (verb: *match*)

## How to Use

1. Hover over an icon to read the tooltip exactly as a reader would see it in the nav.
2. Click an icon (or press keys **1** to **5**) to fill the panel with its meaning, lifecycle
   state and contrast ratio. Before anything is selected, the panel shows the full legend.
3. Check **Dark mode** and compare the contrast ratios with the light sidebar.
4. Press **Quiz me**. The labels and tooltips disappear and the icons are shuffled among the
   titles. Click the icon that matches each description, then press **Next question**. The
   score counts correct first answers out of attempts.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/nav-status-icon-legend/main.html"
        height="552px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development).

### Duration

10 minutes

### Prerequisites

- The status lifecycle in Chapter 14 (`specified` through `deployed`)
- Page front matter in Material for MkDocs (a `status:` key in `index.md`)

### Activities

1. **Explore (3 min):** Hover every icon and read its tooltip, then click each one and read
   its lifecycle state.
2. **Quiz (4 min):** Complete one quiz round of five questions. Aim for five of five.
3. **Discuss (3 min):** Two icons share the `validated` lifecycle state. Explain what
   separates `built` from `approved`, and why a script should never overwrite `approved`.

### Assessment

- The learner scores at least four of five in a quiz round.
- Given a lifecycle state, the learner names the nav status a reader will see.
- The learner explains why the three shapes (circle, broadcast signal, check) help a reader
  who cannot tell the colors apart.

## References

1. [Material for MkDocs: Reference](https://squidfunk.github.io/mkdocs-material/reference/) -
   Official documentation; its section "Setting the page status" covers the `status` front
   matter key shown in the navigation.
2. [Contrast ratio (WCAG 2.1 Understanding: Non-text Contrast)](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html) -
   W3C. The 3:1 guideline for icons used in the contrast readout.
3. [Color blindness](https://en.wikipedia.org/wiki/Color_blindness) - Wikipedia. Why the
   icons differ in shape as well as color.
4. [CSS mask-image](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mask-image) - MDN. The
   CSS property that paints the status icon shapes in Material's nav.
