---
title: MicroSim Technology Stack
description: Click each layer of a running MicroSim (iframe, HTML5, CSS, JavaScript, a JavaScript library and a CDN) to see its role and code, then break it to see what the learner would get without it.
image: /sims/microsim-technology-stack/microsim-technology-stack.png
og:image: /sims/microsim-technology-stack/microsim-technology-stack.png
twitter:image: /sims/microsim-technology-stack/microsim-technology-stack.png
social:
   cards: false
quality_score: 100
---

# MicroSim Technology Stack

<iframe src="main.html" height="562px" width="100%" scrolling="no"></iframe>

[Run the MicroSim Technology Stack Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A MicroSim is a small web page, and six technologies work together to put it in front of a
learner. This diagram stacks them from the bottom up:

| Layer | What it contributes |
|---|---|
| CDN | Delivers a pinned copy of the library from a server near the learner |
| JavaScript library | Ready-made functions for drawing and controls, such as p5.js |
| JavaScript | The model and the behavior: updating, reading controls, redrawing |
| CSS | The appearance: margins, fonts, colors and borders |
| HTML5 | The structure: main.html, its script tags and the empty main element |
| iframe | The window that shows main.html inside a chapter or any other page |

A browser frame surrounds the five layers that run in the learner's browser; the CDN sits
outside it and an arrow shows it delivering the library. Clicking a layer fills the panel with
a one-sentence role, a three-line code sample, the layers it depends on, and what breaks if the
layer is missing. The **Break it** button removes the selected layer, and a small preview shows
what the learner would see: an unstyled page without CSS, an empty page without JavaScript, an
error without the library or the CDN, and no simulation at all without the iframe.

**Learning objective:** The learner will describe what HTML5, CSS, JavaScript, a JavaScript
library, a CDN, and an iframe each contribute to a running MicroSim.

**Bloom's taxonomy level:** Understand (verb: *describe*)

## How to Use

1. The panel starts on **JavaScript**. Read its role, its code sample and the preview.
2. Hover over any layer. The layers it depends on get a gold outline and a "needed" tag.
3. Click a layer to show its details in the panel.
4. Press **Break it** to remove the selected layer and watch the preview change. Press
   **Restore** (or click another layer) to put it back.
5. Break each layer in turn and describe the difference in one sentence.

When the page is narrower than 600 pixels, the panel moves below the stack and the preview
appears in place of the code sample while a layer is broken.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/microsim-technology-stack/main.html"
        height="562px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development). No programming experience
is assumed.

### Duration

15 minutes

### Prerequisites

- The web foundations section of Chapter 1 (HTML5, CSS, JavaScript, libraries, CDNs and
  iframes)

### Activities

1. **Tour (4 min):** Click each of the six layers from the bottom up and read the role and the
   code sample.
2. **Break and describe (6 min):** Break each layer in turn. For each, write one sentence of
   the form "Without ___, the learner sees ___ because ___."
3. **Group the failures (3 min):** Which two layers produce the same symptom when they are
   missing? (The library and the CDN: the sketch cannot call createCanvas.) Which layer's
   absence leaves the MicroSim working but different? (CSS.)
4. **Troubleshoot (2 min):** A colleague reports that a MicroSim is blank only when the
   classroom is offline. Which layer do you suspect?

### Assessment

- The learner describes the contribution of all six layers in their own words.
- Given a symptom (blank page, unstyled page, missing simulation, console error), the learner
  names the missing layer.
- The learner explains why the library and the CDN fail in the same way.

## References

1. [HTML5](https://en.wikipedia.org/wiki/HTML5) - Wikipedia. The markup language that gives a
   page its structure.
2. [CSS](https://en.wikipedia.org/wiki/CSS) - Wikipedia. The style sheet language that controls
   appearance.
3. [Content delivery network](https://en.wikipedia.org/wiki/Content_delivery_network) -
   Wikipedia. How libraries are delivered from servers near the reader.
4. [The iframe element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) -
   MDN Web Docs. The element that embeds one page in another.
5. [p5.js reference](https://p5js.org/reference/) - p5.js. The library whose functions the
   JavaScript layer calls.
