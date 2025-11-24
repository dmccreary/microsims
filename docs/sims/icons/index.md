---
title: Icons Demo
description: A MicroSim demonstrating clickable icons in the control region - Creative Commons license and fullscreen icons.
quality_score: 90
image: /sims/icons/icons.png
og:image: /sims/icons/icons.png
twitter:image: /sims/icons/icons.png
social:
   cards: false
---
# Icons Demo

<iframe src="main.html" height="432px" scrolling="no"></iframe>

[Run the Icons Demo MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

Place the following line in your website to include this in your course.

```html
<iframe src="https://dmccreary.github.io/microsims/sims/icons/main.html" height="432px" scrolling="no"></iframe>
```

This MicroSim demonstrates how to add clickable icons to the control region of a simulation.
In the lower right corner of the control area, you'll find two icons:

1. **Creative Commons icon (ⓒ)** - Click to open the license page in a new tab
2. **Fullscreen icon (⛶)** - Click to enter fullscreen mode

This pattern can be used in any MicroSim to provide quick access to licensing information,
fullscreen mode, or other functionality without cluttering the main interface.

## Implementation Notes

The icons are positioned in the lower right corner of the control region and use distance-based
click detection. The Creative Commons icon links to the `/license/` page, while the fullscreen
icon opens `main.html` in a new tab.

### Code Size Considerations

Adding the two clickable icons requires approximately **40 additional lines of code**:

- 6 lines for icon-related variables
- 1 line to call the `drawIcons()` function
- 18 lines for the `drawIcons()` function
- 19 lines for the `mousePressed()` function
- Additional spacing and comments

**To keep the JavaScript file size minimal, these icons can be omitted** from basic MicroSims.
They are most useful when you want to provide easy access to licensing information or
fullscreen functionality directly within the simulation interface.

## Lesson Plan

This demo shows how to enhance MicroSims with unobtrusive UI elements that provide
important functionality while maintaining a clean, educational interface.
