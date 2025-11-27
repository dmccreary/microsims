---
title: MicroSim Layout Architecture
description: An interactive diagram showing the standard two-region MicroSim architecture with labeled dimensions for the Drawing Region and Control Region.
image: /sims/microsim-layout/microsim-layout.png
og:image: /sims/microsim-layout/microsim-layout.png
twitter:image: /sims/microsim-layout/microsim-layout.png
social:
   cards: false
---

# MicroSim Layout Architecture

<iframe src="main.html" height="452px" width="100%" scrolling="no"></iframe>

[Run the MicroSim Layout Fullscreen](./main.html){ .md-button .md-button--primary }<br/>
[Edit the MicroSim on the P5.js editor](https://editor.p5js.org/dmccreary/sketches/yWAZVJsJi)

## About This Diagram

This interactive diagram illustrates the **standard two-region architecture** used by all MicroSims in this collection. Understanding this layout pattern is essential for creating consistent, professional educational simulations.

## Key Concepts

### Canvas Structure

Every MicroSim canvas is divided into two distinct regions:

1. **Drawing Region** (top) - Where the visualization/simulation appears
2. **Control Region** (bottom) - Where user interface controls are placed

### Standard Dimensions

```javascript
let canvasWidth = 400;              // Initial width (responsive)
let drawHeight = 400;               // Drawing/simulation area height
let controlHeight = 50;             // Controls area height
let canvasHeight = drawHeight + controlHeight;  // Total: 450px
let margin = 25;                    // Margin for visual elements
```

### Color Scheme

| Region | Background Color | Purpose |
|--------|-----------------|---------|
| Drawing Region | Alice Blue (`#F0F8FF`) | Provides a soft, non-distracting background for visualizations |
| Control Region | White (`#FFFFFF`) | Clean background for UI controls |
| Borders | Silver | Subtle separation between regions |

### Design Principles

- **Separation of Concerns**: Visualization and controls are always in separate regions
- **Consistent Margins**: 25px margins keep content away from edges
- **Responsive Width**: Canvas adapts horizontally while maintaining fixed height
- **Non-Scrolling**: MicroSims fit within their iframe without scrollbars

## Embedding This MicroSim

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/microsim-layout/main.html" height="452px" scrolling="no"></iframe>
```

## Learning Objectives

After studying this diagram, students will be able to:

1. **Remember** the standard canvas dimension variables used in MicroSims
2. **Understand** the purpose of separating drawing and control regions
3. **Apply** this layout pattern when creating new MicroSims

## Related Topics

- [Getting Started with MicroSims](../../setup/index.md)
- [Bouncing Ball](../bouncing-ball/index.md) - A basic example using this layout
- [Template MicroSim](../template/index.md) - Start here when creating new simulations

## References

- [p5.js Reference](https://p5js.org/reference/)
- [MicroSim Design Guidelines](../../rules/index.md)
