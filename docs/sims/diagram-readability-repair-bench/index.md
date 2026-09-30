---
title: Readability Repair Bench
description: Critique a cluttered 20-step flowchart against seven diagram readability standards, name each flaw, and repair the diagram with five fixes applied in order of effect.
image: /sims/diagram-readability-repair-bench/diagram-readability-repair-bench.png
og:image: /sims/diagram-readability-repair-bench/diagram-readability-repair-bench.png
twitter:image: /sims/diagram-readability-repair-bench/diagram-readability-repair-bench.png
social:
   cards: false
quality_score: 0
---

# Readability Repair Bench

<iframe src="main.html" height="657px" width="100%" scrolling="no"></iframe>

[Run the Readability Repair Bench MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The bench opens with a deliberately bad flowchart: the twenty steps of building and publishing
a MicroSim, drawn with 9-pixel text, labels of eight to eighteen words, pale yellow text on
white, a notes box that covers part of the diagram, branch arrows that cut across other boxes,
and red and green boxes whose meaning is carried by color alone. Beside it is a checklist of
the seven readability standards from Chapter 8, each with a status light:

| Standard | Rule used by the bench |
|---|---|
| Text size | Node text at least 16 pixels |
| Contrast | Text contrast at least 4.5:1 (WCAG AA) |
| Label length | Two to five words per node |
| Size | About 15 nodes or fewer per diagram |
| Color use | Color paired with a symbol or label |
| Interaction | Hover text on nodes; panels beside the diagram, not on top of it |
| Layout | Room to read, and no arrows crossing other boxes |

Your first job is critique. Click anything that looks wrong: a box, a crossing arrow, the notes
box or the empty background. The bench names the standard that element violates and turns
its light red. Your second job is repair. Five buttons each apply one fix, and the message box
reports the effect of each fix as a count of standards gained or lost.

The fixes interact, which is why their order matters. Splitting the diagram and shortening
the labels each satisfy two standards, because a split relieves the crowding and short labels
move the detail into hover text. Enlarging the fonts first, while the labels are still long,
makes the text spill out of its boxes, so the gain is smaller than it looks. When all five
fixes are in, the bench summarizes your order and its effects. The **Show Before** button
switches back to the original at any time for comparison.

**Learning objective:** The learner will critique a cluttered diagram against the readability
standards and repair it by applying fixes in order of effect.

**Bloom's taxonomy level:** Evaluate (verb: *critique*)

## How to Use

1. Study the diagram for a minute before touching anything. Predict which standards it breaks.
2. Click the flaws you see. Each click names one violated standard and lights it red. Click a
   node again after a repair to find any flaw that remains on it.
3. Decide on an order for the five repairs, then apply them with **Enlarge fonts**, **Shorten
   labels**, **Fix contrast**, **Split into two** and **Add symbols**. Read the effect after each.
4. After the split, use **Show part 2** to see the second diagram, and hover over a node to read
   the hover text that replaced its long label.
5. Use **Show Before** to compare the original with your repaired version, and **Reset** to try
   a different order.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/diagram-readability-repair-bench/main.html"
        height="657px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development).

### Duration

20 minutes

### Prerequisites

- The readability standards table in Chapter 8, "Making Diagrams Readable"
- Basic flowchart notation: steps, decisions and arrows (Chapter 8, "Mermaid: Diagrams from Text")

### Activities

1. **Critique (6 min):** Working alone, find at least one flaw for each of the seven standards
   by clicking the diagram. Record the element you clicked and the standard it broke.
2. **Plan (3 min):** Before repairing, rank the five fixes by how many standards you expect each
   to satisfy, and write down your planned order.
3. **Repair (5 min):** Apply the fixes in your planned order. Note any fix whose effect was
   smaller or larger than you expected.
4. **Compare (6 min):** In pairs, compare orders and the final summaries. Explain why enlarging
   fonts before shortening labels gains less, and relate the result to a diagram you have made.

### Assessment

- The learner identifies a violation of each of the seven standards in the original diagram
  and names the standard correctly.
- The learner justifies a repair order in terms of effect: fixes that satisfy more standards,
  or that make later fixes possible, come first.
- Given a new diagram, the learner lists its most important readability problem and the fix
  with the largest effect.

## References

1. [Web Content Accessibility Guidelines (WCAG) 2.1, Contrast (Minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html) -
   W3C. The source of the 4.5:1 contrast ratio used by the Contrast standard.
2. [Color blindness](https://en.wikipedia.org/wiki/Color_blindness) - Wikipedia. Why red and
   green alone cannot carry meaning for many readers.
3. [Flowchart](https://en.wikipedia.org/wiki/Flowchart) - Wikipedia. Standard flowchart symbols
   and conventions for steps and decisions.
4. [Cognitive load](https://en.wikipedia.org/wiki/Cognitive_load) - Wikipedia. Why crowded,
   hard-to-decode diagrams spend the learner's effort on the drawing instead of the content.
