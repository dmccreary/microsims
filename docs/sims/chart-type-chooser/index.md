---
title: Chart Type Chooser
description: Choose bar, line or pie for a stated data question, check the choice against a fit rule, and compare the same data drawn in the two alternative chart types.
image: /sims/chart-type-chooser/chart-type-chooser.png
og:image: /sims/chart-type-chooser/chart-type-chooser.png
twitter:image: /sims/chart-type-chooser/chart-type-chooser.png
social:
   cards: false
quality_score: 100
---

# Chart Type Chooser

<iframe src="main.html" height="452px" width="100%" scrolling="no"></iframe>

[Run the Chart Type Chooser MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Choosing a chart type is a decision about the relationship you want the learner to see. This MicroSim gives you three small built-in datasets, each paired with a data question, and asks you to pick the chart type that answers the question best:

- **Library shares (%)**: five category shares that add up to 100 percent.
- **Learners by week**: one value measured at six ordered time points.
- **Minutes per sim type**: eight categories with unrelated values.

After you press **Check my choice**, a green or amber message explains why the type fits or does not fit, and a side note quotes the fit rule, such as "pie: parts of a whole, six slices or fewer". The chart is one Chart.js object that is destroyed and rebuilt whenever you change the type, so you can immediately see the same numbers as a bar, line or pie chart. All values are invented for illustration.

**Learning objective (Bloom level: Apply; verb: select):** The learner will select the chart type that best fits a stated data question, then check the choice against the same data drawn in two alternative types.

## How to Use

1. Choose a dataset from the **Dataset** dropdown and read the data question above the chart.
2. Pick **Bar**, **Line** or **Pie** under **Chart type**. The chart redraws at once.
3. Press **Check my choice**. A green message means the type fits the question; an amber message explains what the type hides or distorts and names the better choice.
4. Switch to the other two types. The side note tracks which types you have drawn for the current dataset, so you can confirm that you compared all three.
5. Hover any bar, point or slice to see its label and value in a tooltip.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/chart-type-chooser/main.html"
        height="452px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development).

### Duration

15 minutes

### Prerequisites

- Familiarity with bar, line and pie charts as a reader of charts.
- The Chapter 7 idea that a chart configuration has three parts: `type`, `data` and `options`.

### Activities

1. **Predict (3 min):** For each of the three data questions, write down the chart type you expect to fit before touching the controls.
2. **Select and check (7 min):** Work through the three datasets. For each one, select your predicted type, press **Check my choice**, then draw the data in the other two types and note what each alternative hides.
3. **Explain (5 min):** In pairs, state the fit rule for each type in your own words, and describe one real dataset from your own teaching where a pie chart would mislead.

### Assessment

- Given a new data question (for example, "What share of quiz attempts ended in each outcome?"), the learner names the best chart type and quotes the matching fit rule.
- The learner explains why a line chart is a poor choice for unordered categories and why a pie chart with eight slices is hard to read.

## References

1. [Chart.js Documentation](https://www.chartjs.org/docs/latest/) - Official documentation for the Chart.js library used in this MicroSim.
2. [Chart.js Bar Chart](https://www.chartjs.org/docs/latest/charts/bar.html) - Configuration reference for bar charts.
3. [Chart.js Line Chart](https://www.chartjs.org/docs/latest/charts/line.html) - Configuration reference for line charts.
4. [Chart.js Doughnut and Pie Charts](https://www.chartjs.org/docs/latest/charts/doughnut.html) - Configuration reference for pie charts.
5. [Pie chart - Wikipedia](https://en.wikipedia.org/wiki/Pie_chart) - Background on pie charts and the difficulty of comparing slice angles.
