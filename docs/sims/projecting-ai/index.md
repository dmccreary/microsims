---
title: Projecting AI Task Completion to 2030
description: Interactive visualization showing exponential growth of AI task completion capabilities from 2019 to 2030, with time on the horizontal axis and projected horizons based on 7-month doubling time
image: /sims/projecting-ai/projecting-ai.png
og:image: /sims/projecting-ai/projecting-ai.png
---

# Projecting AI Task Completion to 2030

An interactive visualization showing the exponential growth of AI task completion capabilities from 2019 to 2030, with time on the horizontal axis and task completion horizons projected into the future.

<iframe src="./main.html" width="100%" height="550"></iframe>

[Run the MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

To use this interactive chart on any website simply copy this line of HTML into your web page:
```html
<iframe src="https://dmccreary.github.io/tracking-ai-course/sims/projecting-ai/main.html" width="100%" height="588"></iframe>
```

This MicroSim extends the analysis from [METR.org's research](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/) by projecting AI capabilities forward to 2030 based on the observed exponential growth pattern.

## Overview

This MicroSim visualizes **how AI task completion capabilities are projected to evolve over time**, showing:

- **Historical data** from 2019-2025 showing actual AI model performance
- **Time on the horizontal axis** (year) for easy temporal understanding
- **Task completion horizons on the vertical axis** (in minutes/hours/days)
- **Exponential trend line** projecting capabilities to 2030 based on 7-month doubling time

The visualization demonstrates that AI's ability to complete longer tasks is growing exponentially, with capabilities roughly doubling every 7 months according to METR's research.

## Key Insights

### Exponential Growth Pattern
The data reveals a clear exponential trend with a **doubling time of approximately 7 months**. This means:
- Every 7 months, AI models can reliably complete tasks twice as long
- By 2030, if this trend continues, models could work on tasks lasting days or weeks
- This growth rate is faster than many other technology trends

### What the Projection Means
If the 7-month doubling time continues:
- **2026**: Models could reliably work on tasks lasting 10-20+ hours
- **2028**: Tasks lasting multiple days become feasible
- **2030**: Week-long autonomous task completion may be possible

**Important caveat**: Exponential trends don't continue forever. Physical limits, diminishing returns, or fundamental barriers could slow this growth.

## Interactive Features

### Time Axis (Horizontal)
- **X-axis shows years** from 2019 to 2030
- Actual model data points are shown as colored dots
- Easy to see the temporal progression of AI capabilities

### Scale Toggle
- **Linear Scale**: Shows absolute differences in capabilities
- **Log Scale**: Better visualizes the exponential growth pattern and makes it easier to compare models across the full range

### Success Probability Toggle
- **50% Success**: Time horizon where a model has 50% chance of completing a task
- **80% Success**: More conservative metric requiring 80% success probability (typically shorter horizons)

### Trend Line Toggle
- **Show/Hide** the exponential trend line
- Trend line extends to 2030 based on the 7-month doubling time
- Helps visualize where AI capabilities might be heading

### Hover Tooltips
Hover over any data point to see:
- Model name
- Time horizon in minutes, hours, and days
- Release date
- Success probability level

### Color Coding
- **Green points**: Frontier models (state-of-the-art)
- **Gray points**: Non-frontier models
- **Blue dashed line**: Exponential trend projection

## Understanding the Projection

### The 7-Month Doubling Time
Based on METR's analysis, AI task completion capabilities have been doubling approximately every 7 months. This is calculated from:
- Historical model performance from 2019-2025
- Consistent pattern across different model families
- Both 50% and 80% success probability metrics

### How the Trend Line Works
The projection uses an exponential formula:
```
Future Capability = Current Capability × 2^(months_elapsed / 7)
```

For example, starting from GPT-5's 8,239 minutes (137 hours) at 50% success:
- **7 months later (March 2026)**: ~16,500 minutes (275 hours / 11.5 days)
- **14 months later (October 2026)**: ~33,000 minutes (550 hours / 23 days)
- **By 2030**: Potentially 100,000+ minutes (1,700+ hours / 70+ days)

### Limitations and Caveats

**This is a projection, not a prediction.** Several factors could slow or stop this trend:

1. **Fundamental limits**: Tasks requiring real-world feedback may hit physical time constraints
2. **Diminishing returns**: As tasks get longer, new bottlenecks may emerge
3. **Measurement challenges**: Defining and measuring very long tasks becomes harder
4. **Economic factors**: The cost of running models for days/weeks may be prohibitive
5. **Reliability requirements**: Longer tasks may require entirely new approaches to ensure robustness

## Model Data

### Frontier Models (Green)
The most capable models at their time of release:
- **GPT-5**: 8,239 min / 137 hrs (50%) — Latest projected frontier model
- **Grok-4**: 6,605 min / 110 hrs (50%)
- **o3**: 5,531 min / 92 hrs (50%)
- **Claude 3.7 Sonnet**: 3,254 min / 54 hrs (50%)
- Earlier models: o1-elicited, Claude 3.5 variants, GPT-4 family, GPT-3.5, GPT-2

### Non-Frontier Models (Gray)
Other capable models:
- **Claude Sonnet 4.5**: 6,798 min / 113 hrs (50%)
- **Claude 4.1 Opus**: 6,330 min / 106 hrs (50%)
- Plus DeepSeek, Gemini, Qwen, and other model families

## Use Cases

This visualization is valuable for:

### Strategic Planning
- **Technology roadmapping**: Understand when AI might handle multi-day tasks
- **Resource allocation**: Plan for infrastructure to support longer-running AI agents
- **Capability planning**: Anticipate what tasks AI could automate in coming years

### Education & Communication
- **Illustrating exponential growth**: Clear visual of how quickly AI capabilities are advancing
- **Setting expectations**: Help stakeholders understand the pace of AI development
- **Trend analysis**: Compare AI progress to other technological trends

### Research & Analysis
- **Identifying patterns**: Spot deviations from the exponential trend
- **Model comparison**: See how different model families stack up over time
- **Future scenarios**: Explore implications of continued exponential growth

## Customization Guide

### Modifying the Data

To update with new models, edit the `modelData` object in `script.js`:

```javascript
const modelData = {
    frontier: [
        {
            name: 'Model Name',
            horizon50: 100.0,  // 50% success time in minutes
            horizon80: 20.0,   // 80% success time in minutes
            date: '2025-MM-DD' // Release date (YYYY-MM-DD format)
        }
    ]
};
```

### Adjusting the Trend Line

To change the doubling time assumption, modify `doublingTimeMonths` in `script.js`:

```javascript
const doublingTimeMonths = 7;  // Change this value
```

### Extending the Time Range

To project beyond 2030, update the `endDate` in the `calculateTrendLine()` function:

```javascript
const endDate = new Date('2035-12-31');  // Extend to 2035
```

And update the X-axis maximum:

```javascript
max: new Date('2035-12-31').getTime()
```

## Technical Details

- **Library**: Chart.js 4.4.0 with date-fns adapter for time series
- **Chart Type**: Scatter plot with optional trend line overlay
- **Data Points**: 30 AI models from 2019-2025
- **Projection**: Exponential trend to 2030 based on 7-month doubling time
- **Time Range**: 2019-2030 (12 years)
- **Data Source**: [METR Research (March 2025)](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/)
- **Interactive Controls**: Scale toggle (linear/log), Success probability (50%/80%), Trend line (show/hide)
- **Browser Compatibility**: All modern browsers supporting Chart.js and ES6
- **Responsive**: Adapts to container width with mobile optimizations

## Interpretation Guide

### Reading the Chart

1. **X-axis (Horizontal)**: Shows time progression from 2019 to 2030
2. **Y-axis (Vertical)**: Task completion time horizon (minutes/hours/days)
3. **Actual data points**: Show real model performance (2019-2025)
4. **Dashed trend line**: Projects future capabilities based on historical growth
5. **Higher on chart**: Models can work on longer tasks

### Using Different Views

**Linear scale** is best for:
- Understanding absolute capability differences
- Seeing the scale of recent improvements
- Comparing models released close together in time

**Log scale** is best for:
- Visualizing the exponential growth pattern
- Comparing models across the full time range
- Identifying consistent doubling patterns

### Comparing Success Probabilities

- **50% horizon**: More optimistic, shows what's theoretically possible
- **80% horizon**: More conservative, shows reliable capability
- The gap between them indicates model consistency/reliability

## Real-World Implications

### What These Time Horizons Mean

**Current capabilities (2025)**:
- 100-500 minutes: Complex analysis, report generation, multi-step research
- 1,000-2,000 minutes (16-33 hours): Overnight project work, extensive code development
- 8,000+ minutes (130+ hours / 5+ days): Multi-day research projects, complex system design

**Projected capabilities (2030)**:
- If trends continue: 50,000-100,000+ minutes (35-70+ days)
- Potential applications: Month-long research initiatives, complex product development, extensive autonomous projects
- New challenges: Reliability, cost, real-world interaction needs

### Questions to Consider

1. **Will the trend continue?** What might cause it to slow or stop?
2. **What bottlenecks emerge** as tasks stretch to days or weeks?
3. **How do we measure success** for such extended tasks?
4. **What safeguards are needed** for AI working autonomously for weeks?
5. **What economic value** comes from AI handling month-long tasks?

## References

- [METR: Measuring AI Ability to Complete Long Tasks (March 2025)](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
- [Chart.js Time Series](https://www.chartjs.org/docs/latest/axes/cartesian/time.html)
- [Exponential Growth and Moore's Law](https://en.wikipedia.org/wiki/Moore%27s_law)

## About This MicroSim

This MicroSim reimagines METR's task completion horizon chart with a temporal perspective, making it easy to see how AI capabilities have evolved and where they might be heading. By placing time on the horizontal axis and extending the exponential trend to 2030, it helps viewers understand both the historical trajectory and potential future of AI task completion capabilities.

The 7-month doubling time, if sustained, would represent one of the fastest capability growth rates in any technology domain. Understanding this trajectory is crucial for strategic planning, risk assessment, and opportunity identification in an AI-enabled future.
