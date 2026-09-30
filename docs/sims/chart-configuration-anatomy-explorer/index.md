---
title: Chart Configuration Anatomy Explorer
description: Edit a live Chart.js configuration shown as color-coded type, data and options blocks, and see which block controls each visible feature of the chart.
image: /sims/chart-configuration-anatomy-explorer/chart-configuration-anatomy-explorer.png
og:image: /sims/chart-configuration-anatomy-explorer/chart-configuration-anatomy-explorer.png
twitter:image: /sims/chart-configuration-anatomy-explorer/chart-configuration-anatomy-explorer.png
social:
   cards: false
quality_score: 100
---

# Chart Configuration Anatomy Explorer

<iframe src="main.html" height="662px" width="100%" scrolling="no"></iframe>

[Run the Chart Configuration Anatomy Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Every Chart.js chart is created from one JavaScript object, the chart configuration, with three top-level parts: `type` names the kind of chart, `data` holds the labels and datasets, and `options` holds settings for behavior and appearance. This MicroSim puts that object on the left, split into three color-coded blocks, and the chart it produces on the right.

Each control rewrites exactly one block, and the block flashes when it changes. The **Chart type** dropdown rewrites only the `type` block. The value fields and **Add dataset** rewrite the `data` block. **Responsive** and **Legend position** rewrite the `options` block. Hovering a block outlines the chart features it controls, and hovering any bar, point or slice shows a tooltip naming the configuration path that produced it, for example `data.datasets[0].data[1] = 19`. **Break it** removes one label so you can see what happens when `labels` and a dataset's `data` no longer match.

**Learning objective:** The learner will explain which part of a chart configuration (type, data or options) controls each visible feature of a chart, by editing values and observing the result.

**Bloom level:** Understand (L2). **Bloom verb:** explain.

## How to Use

1. Hover each colored block on the left. The **type** block outlines the plot area, the **data** block highlights every bar and outlines the category labels, and the **options** block outlines the legend and the canvas. The caption under the chart explains each one.
2. Hover a bar, point or slice. The tooltip names the configuration path of its label, its value and its color.
3. Change **Chart type** to line and then pie. Only the `type` block changes, yet the chart is rebuilt from the whole object.
4. Edit a value in **First dataset values**. The `data` block updates and the chart calls `chart.update()`.
5. Change **Legend position**, then uncheck **Responsive** to see the canvas keep a fixed 300 by 200 size.
6. Press **Add dataset** to append a second dataset with its own label and colors, and **Break it** to remove the last label. Read the mismatch message, then press **Fix it**. **Reset** restores the starting configuration.

On narrow screens the two panels stack and the configuration panel scrolls.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/chart-configuration-anatomy-explorer/main.html"
        height="662px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers and learning-technology developers who build or review Chart.js MicroSims (college undergraduate or professional development).

### Duration

10-15 minutes

### Prerequisites

- The Chart.js: Configuration and Datasets section of Chapter 7
- Reading a JavaScript object literal with nested arrays and objects

### Activities

1. **Map the blocks (3 min):** Hover each block and list two chart features it controls. Check your list against the tooltips on the chart.
2. **One control, one block (4 min):** Use each control once. For each, write which block changed and which parts of the chart changed.
3. **Break and diagnose (4 min):** Press Break it with a bar chart and again with a pie chart. Explain why the bar chart drops the fifth value while the pie draws an unlabeled slice.
4. **Explain to a colleague (3 min):** In two or three sentences, explain the recipe-card idea from Chapter 7: `type` names the dish, `data` lists the ingredients and `options` sets the oven.

### Assessment

- Given a chart feature (legend position, bar height, category name, slice color, chart kind), the learner names the configuration part and path that controls it.
- The learner explains why a labels/values mismatch is a `data` problem and predicts its visible effect for a bar and a pie chart.
- The learner explains what `responsive: true` changes and why a slider that edits data must call `chart.update()`.

## References

1. [Chart.js documentation](https://www.chartjs.org/docs/latest/) - Official documentation for Chart.js 4.
2. [Chart.js configuration](https://www.chartjs.org/docs/latest/configuration/) - The type, data and options structure.
3. [Chart.js data structures](https://www.chartjs.org/docs/latest/general/data-structures.html) - How labels and dataset values pair up.
4. [Chart.js legend configuration](https://www.chartjs.org/docs/latest/configuration/legend.html) - The legend position option.
5. [Chart.js responsive charts](https://www.chartjs.org/docs/latest/configuration/responsive.html) - How `responsive` and `maintainAspectRatio` size the canvas.
6. [Chart.js updating charts](https://www.chartjs.org/docs/latest/developers/updates.html) - Why edits must be followed by `chart.update()`.
