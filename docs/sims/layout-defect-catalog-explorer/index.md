---
title: Layout Defect Catalog Explorer
description: Find eight seeded layout defects in a mock MicroSim and match each to its visual checklist item, likely cause and repair.
image: /sims/layout-defect-catalog-explorer/layout-defect-catalog-explorer.png
og:image: /sims/layout-defect-catalog-explorer/layout-defect-catalog-explorer.png
twitter:image: /sims/layout-defect-catalog-explorer/layout-defect-catalog-explorer.png
social:
   cards: false
quality_score: 100
---

# Layout Defect Catalog Explorer

<iframe src="main.html" height="542px" width="100%" scrolling="no"></iframe>

[Run the Layout Defect Catalog Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A **layout defect** is a rendering fault that makes content unreadable or unusable even though the code runs without error. The mock MicroSim on the left was drawn with eight of them, taken from the fixes table in Chapter 13 and the layout reviewer's visual checklist:

- **Clipped content**: row labels cut off at the left edge (1.1, 3.5), a title that runs under the side panel (3.1), a legend heading painted over by its own background (3.2).
- **Hidden control**: a slider running past the right edge (2.1), a slider label overlapping its track (2.2), two overlapping buttons (2.3).
- **Color contrast**: black-haloed text from a leftover `stroke()` (1.3), and pale khaki text on aliceblue (1.4).

Click anything that looks wrong. A correct flag draws a green outline and opens a card with the defect, its checklist item, the likely cause and the repair; a wrong flag draws a red outline and gives a hint. The checklist panel on the right marks each item you have matched. **Apply repair** redraws the mock with the selected defect fixed, so you can see exactly what the repair changes.

**Learning objective:** The learner will distinguish clipped content, hidden controls and low color contrast in a rendered MicroSim, and will match each defect to its checklist item and its usual repair.

**Bloom level:** Analyze. **Bloom verb:** distinguish.

## How to Use

1. Scan the mock MicroSim edge by edge: the left edge of the grid, the title, the controls, the text colors.
2. Click a region you think is a defect. Read the card, then press **Apply repair** to see the fix.
3. Use **Defect family** to show only clipped content, hidden controls or color contrast defects.
4. The counter shows how many of the 8 you have found. Press **Reveal** to outline the rest, or **Reset** to start over.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/layout-defect-catalog-explorer/main.html"
        height="542px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development).

### Duration

15 minutes

### Prerequisites

- The standard MicroSim layout: aliceblue drawing region, white control region (Chapter 2)
- Layout defects and the fixes table (Chapter 13)

### Activities

1. **Hunt (6 min):** Find as many defects as you can without Reveal. For each, say its family before you click.
2. **Match (5 min):** For every card, cover the Repair line and predict the fix from the cause. Then Apply repair.
3. **Directed look (2 min):** Choose one family in the filter and look only for that kind of defect. Discuss why a directed question finds more than "does this look right?"
4. **Transfer (2 min):** Open one of your own MicroSims and check the eight items against it.

### Assessment

- The learner finds at least six of the eight defects without Reveal.
- The learner sorts each defect into clipped content, hidden control or color contrast and names its checklist item.
- Exit question: "Every letter of a label has a dark outline. What is the cause and the one-line repair?"

## References

1. [Chapter 13: Quality Assurance and Automated Layout Review](../../chapters/13-quality-assurance-and-automated-layout-review/index.md) — layout defects, clipped content, hidden controls, color contrast and the fixes table.
2. [Understanding WCAG 2.1: Contrast (Minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html) — the 4.5 to 1 contrast ratio for body text.
3. [p5.js noStroke() reference](https://p5js.org/reference/p5/noStroke/) — the call that prevents haloed text.
4. [p5.js textWidth() reference](https://p5js.org/reference/p5/textWidth/) — measuring a label to reserve enough offset.
