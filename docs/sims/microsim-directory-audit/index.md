---
title: MicroSim Directory Audit
description: Audit three sample MicroSim directories, flag the planted defects line by line, rate each one from cosmetic to breaks-embedding, and check your audit against a rubric.
image: /sims/microsim-directory-audit/microsim-directory-audit.png
og:image: /sims/microsim-directory-audit/microsim-directory-audit.png
twitter:image: /sims/microsim-directory-audit/microsim-directory-audit.png
social:
   cards: false
quality_score: 100
---

# MicroSim Directory Audit

<iframe src="main.html" height="562px" width="100%" scrolling="no"></iframe>

[Run the MicroSim Directory Audit Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

An experienced maintainer can inspect an unfamiliar MicroSim directory in about a minute. This MicroSim gives you three sample directories to practice on. Each one hides three or four defects taken from Chapter 2: a script address with no pinned version, a `CANVAS_HEIGHT` comment that does not equal `drawHeight + controlHeight`, an iframe height that is not the constant plus 2, a missing schema meta tag, a missing preview image, a folder name with uppercase letters, and Dublin Core fields placed in the page front matter. Finding a defect is only half of the audit. You also judge how much harm it does, using a four-level severity rubric.

**Learning objective:** The learner will critique a MicroSim directory by finding planted defects and judging which ones would break embedding, discovery or display.

**Bloom level:** Evaluate. **Bloom verb:** critique.

| Severity | Meaning |
|----------|---------|
| cosmetic | Looks untidy, but everything works and can be found |
| discovery | Search tools, the gallery or social previews cannot find or show the MicroSim |
| display | It runs, but shows the wrong thing or hides part of itself |
| breaks embedding | The iframe or link that embeds the MicroSim fails to load it |

The same kind of defect can earn different ratings. An iframe that is 28 pixels too tall only leaves blank space, while one that is 100 pixels too short hides the controls.

## How to Use

1. Click a file in the tree to open it in the viewer. The folder at the top of the tree opens the directory listing.
2. Click a line to flag it as a defect. The flagged line turns yellow and is outlined in orange while it is the active flag.
3. Choose a rating in the **Severity of flag** dropdown. Every flag carries its own rating, shown at the right end of its line. Click a different flag to rate it, or click the active flag again to remove it.
4. If something is missing, such as a tag or a file, flag the line where it belongs or the line that points to it.
5. Press **Check audit**. The audit report lists the defects you found with a one-sentence explanation of what would go wrong, your false alarms, the defects still missing, and whether each rating matches the rubric. Flags turn green (defect) or red (false alarm), and missed defects are outlined in red.
6. Press **Next directory** to audit the next sample. The three samples come in a shuffled order.

When a file or the report is longer than the viewer, scroll inside the viewer with the mouse wheel or the arrow keys.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/microsim-directory-audit/main.html"
        height="562px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers and learning-technology developers who maintain or review MicroSims (college undergraduate or professional development).

### Duration

20 minutes.

### Prerequisites

- The five files of a MicroSim directory and what each one is for (Chapter 2)
- The canvas height constant and the rule iframe height = `CANVAS_HEIGHT + 2`
- The difference between page front matter and `metadata.json`

### Activities

1. **Review the checklist (3 min):** Read the seven-item audit routine at the end of Chapter 2 aloud.
2. **Solo audit (8 min):** Each learner audits the first directory, rating every flag before pressing **Check audit**.
3. **Compare ratings (5 min):** In pairs, learners compare any flag they rated differently from the rubric and argue for their rating. Which defects would a reader notice first, and which would only a search tool notice?
4. **Second directory (4 min):** Learners audit a second directory and try to beat their first score on false alarms and rating accuracy.

### Assessment

- The learner finds at least three of the planted defects in a directory with no more than one false alarm.
- For each defect found, the learner gives a rating that matches the rubric or defends a different rating with a concrete consequence, such as "the controls are hidden" or "the gallery shows no thumbnail".

## References

1. [Chapter 2: Anatomy of a MicroSim](../../chapters/02-anatomy-of-a-microsim/index.md) - the directory, the wrapper, the canvas height constant, front matter and metadata.
2. [Dublin Core Metadata Element Set](https://www.dublincore.org/specifications/dublin-core/dces/) - the fields that belong in `metadata.json`.
3. [jsDelivr: npm packages](https://www.jsdelivr.com/documentation) - how a version number in a CDN address pins a library release.
4. [The Inline Frame element (iframe)](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) - MDN Web Docs reference for iframe height.
