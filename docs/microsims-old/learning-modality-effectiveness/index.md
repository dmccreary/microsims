---
title: Learning Modality Effectiveness
description: Interactive horizontal bar chart showing knowledge retention rates across different learning modalities, demonstrating why interactive simulations produce superior learning outcomes.
---

# Learning Modality Effectiveness

This chart visualizes the dramatic difference in knowledge retention across different learning modalities, from passive reading to active interactive simulations with prediction.

<iframe src="main.html" width="100%" height="520" scrolling="no"></iframe>

[View Fullscreen](main.html){ .md-button .md-button--primary }

## Overview

Educational research consistently shows that active learning methods significantly outperform passive approaches. This visualization presents retention data across six learning modalities:

- **Passive methods** (gray): Reading text and watching videos show the lowest retention rates
- **Semi-active methods** (light blue): Static diagrams and animations improve engagement
- **Active methods** (blue/gold): Interactive simulations dramatically increase retention, especially when students predict outcomes before manipulating variables

The **"active learning threshold"** at 50% marks the boundary where students transition from passive consumption to active engagement with material.

## Features

### Interactive Elements
- Hover tooltips showing exact retention percentages
- Animated bar growth on page load
- Annotations highlighting key insights

### Visual Design
- Color-coded by learning modality type
- MicroSim approaches highlighted with bracket annotation
- Clear axis labels and professional typography

## Customization Guide

### Changing the Data

Edit the `data` array in `main.html`:

```javascript
const data = [15, 25, 35, 45, 75, 90];
```

### Adjusting Colors

Modify the `backgroundColors` array:

```javascript
const backgroundColors = [
    '#666666',  // Reading - dark gray
    '#777777',  // Video - medium gray
    '#87CEEB',  // Diagrams - light blue
    '#6BB3D9',  // Animations - darker light blue
    '#4169E1',  // Interactive - royal blue
    '#FFD700'   // With prediction - gold
];
```

### Modifying Annotations

Adjust the threshold line position:

```javascript
thresholdLine: {
    type: 'line',
    xMin: 50,  // Change this value
    xMax: 50,
    // ...
}
```

## Technical Details

- **Library**: Chart.js 4.4.0 with Annotation plugin
- **Chart Type**: Horizontal bar chart (`indexAxis: 'y'`)
- **Browser Compatibility**: All modern browsers
- **Responsive**: Yes, adapts to container width

## References

- Hake, R. R. (1998). Interactive-engagement versus traditional methods
- Freeman, S., et al. (2014). Active learning increases student performance in STEM
- Chi, M. T., & Wylie, R. (2014). The ICAP Framework
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
