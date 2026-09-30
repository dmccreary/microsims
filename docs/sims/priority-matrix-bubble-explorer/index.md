---
title: Priority Matrix Bubble Explorer
description: Compare eight candidate MicroSim types by impact, effort and count on a Chart.js bubble chart, move items across the quadrant midpoints, and see which quadrant each item occupies and why.
image: /sims/priority-matrix-bubble-explorer/priority-matrix-bubble-explorer.png
og:image: /sims/priority-matrix-bubble-explorer/priority-matrix-bubble-explorer.png
twitter:image: /sims/priority-matrix-bubble-explorer/priority-matrix-bubble-explorer.png
social:
   cards: false
quality_score: 100
---

# Priority Matrix Bubble Explorer

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Priority Matrix Bubble Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A priority matrix is a bubble chart whose axes are decision criteria. Here a team is deciding which MicroSim types to build first. Each of eight invented candidate types has an **effort** score (x axis), an **impact** score (y axis), a **count** of planned MicroSims that would use it (bubble size) and a **status** (bubble color). The dashed midpoint lines at 5 divide the plane into four quadrants:

- **Quick Wins**: impact above 5, effort 5 or less.
- **Major Projects**: impact above 5, effort above 5.
- **Fill-ins**: impact 5 or less, effort 5 or less.
- **Money Pits**: impact 5 or less, effort above 5.

A custom Chart.js plugin shades the quadrants at low opacity and draws the quadrant and item labels in the `afterDatasetsDraw` hook, so tooltips always paint on top. Bubble radius is scaled linearly between a minimum and maximum radius, and the axes run from -0.5 to 10.5 so that bubbles near an edge are not clipped. All items and scores are invented for illustration.

**Learning objective (Bloom level: Analyze; verb: compare):** The learner will compare candidate items by impact, effort and frequency, and identify which quadrant each item occupies and why.

## How to Use

1. Hover any bubble to see its name, effort, impact, count and status.
2. Click a bubble to select it. The selected bubble gets a heavy black outline and its name appears above the sliders.
3. Drag the **Effort** and **Impact** sliders to move the selected item. When it crosses a midpoint, the quadrant list updates at once, the two affected quadrants flash, and the **Why** line explains the new placement.
4. Drag **Bubble scale** from 1 to 3 to change the minimum and maximum radius. Notice how a larger scale exaggerates differences in count, because readers judge area, not radius.
5. Uncheck **Show quadrant labels** to test whether you can still name each quadrant, then press **Reset** to restore the original data.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/priority-matrix-bubble-explorer/main.html"
        height="502px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development).

### Duration

20 minutes

### Prerequisites

- Reading a scatter plot with two numeric axes.
- The Chapter 7 description of bubble data as `{ x, y, r }` objects.

### Activities

1. **Read the matrix (5 min):** Hover each bubble and record its effort, impact and count. Identify the item you would build first and state which quadrant rule puts it there.
2. **Compare pairs (8 min):** Compare Function Plots with Network Maps, and Timelines with Map Explorers. For each pair, explain which criterion separates them and whether bubble size should change the decision.
3. **Stress-test the midpoint (5 min):** Select Timelines and raise its impact from 4.0 to 5.0 and then 5.5. Explain why 5.0 stays in Fill-ins while 5.5 moves to Quick Wins, and discuss whether a hard cut-off at 5 is a sensible rule.
4. **Reflect (2 min):** Set Bubble scale to 3 and describe how the larger bubbles could mislead a reader about the counts.

### Assessment

- Given an item's effort and impact, the learner names its quadrant and justifies it with the midpoint rule.
- The learner compares two items on all three variables and argues which should be built first.
- The learner explains why bubble area, not radius, is what readers perceive.

## References

1. [Chart.js Bubble Chart](https://www.chartjs.org/docs/latest/charts/bubble.html) - Configuration reference for the bubble chart type used here.
2. [Chart.js Plugins](https://www.chartjs.org/docs/latest/developers/plugins.html) - How plugin hooks such as `beforeDatasetsDraw` and `afterDatasetsDraw` work.
3. [Chart.js Documentation](https://www.chartjs.org/docs/latest/) - Official documentation for the Chart.js library.
4. [Bubble chart - Wikipedia](https://en.wikipedia.org/wiki/Bubble_chart) - Background on encoding a third variable as bubble size.
5. [Scatter plot - Wikipedia](https://en.wikipedia.org/wiki/Scatter_plot) - Background on plotting items by two numeric variables.
