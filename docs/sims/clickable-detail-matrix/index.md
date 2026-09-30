---
title: Clickable Detail Matrix
description: Differentiate four invented learning theories across four dimensions by reading each cell's summary, predicting its emphasis, and opening a slide-in panel with its explanation and example.
image: /sims/clickable-detail-matrix/clickable-detail-matrix.png
og:image: /sims/clickable-detail-matrix/clickable-detail-matrix.png
twitter:image: /sims/clickable-detail-matrix/clickable-detail-matrix.png
social:
   cards: false
quality_score: 100
---

# Clickable Detail Matrix

<iframe src="main.html" height="437px" width="100%" scrolling="no"></iframe>

[Run the Clickable Detail Matrix MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A comparison table can hold only a short value in each cell. The clickable detail matrix keeps each cell short and moves the explanation into a panel that slides in when you click. Rows are four **invented** learning theories (Pathfinder Theory, Echo Practice Model, Circle Dialogue Approach and Tuned Challenge Model), and columns are four dimensions: the learner's role, the role of the MicroSim, the evidence of learning, and feedback timing. The theories are simplified composites made up for this exercise, not published theories.

Each cell carries four fields in `data.json`: a short `value`, an `emphasis` label that sets the cell tint, a `description` and an `example`. The script reads the file with `fetch`, builds the table, and gives every cell a click listener that calls `showDetail`. The emphasis labels mean:

- **high**: the central concern of the theory on this dimension.
- **medium**: important, but secondary.
- **low**: given little weight.
- **balanced**: two concerns weighted equally.
- **unique**: a feature no other theory in the table has (also marked with a dashed border).

**Learning objective (Bloom level: Analyze; verb: differentiate):** The learner will differentiate several items across several dimensions by reading each cell's summary and then opening its explanation and example.

## How to Use

1. Read down one column to compare the four theories on a single dimension, then read across one row to see a single theory's profile.
2. Click any cell (or tab to it and press Enter) to open the detail panel with the row name, column name, emphasis, description and example. Close it with the **×** button, a click on the darkened overlay, or the Escape key; focus returns to the cell you opened.
3. Turn off **Show emphasis colors** to remove the tints and test whether the summaries alone let you tell the theories apart.
4. Press **Random cell**. The panel shows only the summary and asks you to predict the cell's emphasis before revealing the explanation. Your running score appears next to the button.

On screens narrower than 600 pixels, the panel becomes a bottom sheet and the table scrolls sideways inside its box.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/clickable-detail-matrix/main.html"
        height="437px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development).

### Duration

20 minutes

### Prerequisites

- Reading a comparison table.
- The Chapter 7 description of the clickable-table pattern (`data.json`, `style.css`, a script and a small `main.html`).

### Activities

1. **Summaries only (5 min):** Turn off the emphasis colors. For each column, decide which theory treats that dimension as most central, using only the cell summaries.
2. **Predict and check (8 min):** Press **Random cell** at least six times. Before each answer, say why you chose the emphasis. Record your score.
3. **Differentiate (5 min):** Pick two theories that look similar in one column (for example, Echo Practice Model and Tuned Challenge Model under Feedback timing) and use the panels to explain the difference in one sentence.
4. **Extend the data (2 min, optional):** Sketch the four cells for a fifth theory of your own, with a value, emphasis, description and example for each.

### Assessment

- The learner names the dimension on which two theories differ most and cites the descriptions that show it.
- The learner predicts the emphasis of an unseen cell from its summary with a stated reason, and scores at least four of six on Random cell.

## References

1. [MDN: Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) - How the table data is loaded from `data.json`.
2. [MDN: The table element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table) - Semantics of HTML tables.
3. [WAI-ARIA Authoring Practices: Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) - Keyboard and focus behavior for the detail panel.
4. [Learning theory (education) - Wikipedia](https://en.wikipedia.org/wiki/Learning_theory_(education)) - Background on real learning theories, for contrast with the invented ones here.
