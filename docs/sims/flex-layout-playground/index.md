---
title: Flex Layout Playground
description: An interactive MicroSim for experimenting with CSS flexbox properties and seeing immediate visual results to build intuition for layout vocabulary.
image: /sims/flex-layout-playground/flex-layout-playground.png
og:image: /sims/flex-layout-playground/flex-layout-playground.png
twitter:image: /sims/flex-layout-playground/flex-layout-playground.png
social:
   cards: false
---

# Flex Layout Playground

<iframe src="main.html" height="472px" width="100%" scrolling="no"></iframe>

[Run the Flex Layout Playground MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

The Flex Layout Playground allows learners to experiment with CSS flexbox properties and see immediate visual results. By manipulating controls and observing how colored boxes rearrange themselves, students build intuition for layout vocabulary rather than memorizing abstract definitions.

## How to Use

### Controls

1. **Direction** - Changes `flex-direction`:
    - `row`: Items flow left to right (default)
    - `row-reverse`: Items flow right to left
    - `column`: Items flow top to bottom
    - `column-reverse`: Items flow bottom to top

2. **Justify** - Changes `justify-content` (main axis alignment):
    - `flex-start`: Items packed at the start
    - `flex-end`: Items packed at the end
    - `center`: Items centered
    - `space-between`: Equal space between items
    - `space-around`: Equal space around items
    - `space-evenly`: Equal space between and around items

3. **Align** - Changes `align-items` (cross axis alignment):
    - `flex-start`: Items aligned to start
    - `flex-end`: Items aligned to end
    - `center`: Items centered
    - `stretch`: Items stretch to fill container
    - `baseline`: Items aligned by text baseline

4. **Wrap** - Toggles `flex-wrap`:
    - Unchecked: `nowrap` (all items on one line)
    - Checked: `wrap` (items wrap to new lines)

5. **Gap** - Adjusts spacing between items (0-30px)

6. **Add Item / Remove** - Add or remove flex items (1-6 items)

7. **Copy CSS** - Copies the current CSS code to clipboard

### CSS Panel

The dark panel in the upper right shows the CSS code that would produce the current layout. This updates in real-time as you change settings.

## Embedding This MicroSim

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/flex-layout-playground/main.html" height="502px" scrolling="no"></iframe>
```

## Learning Objectives

After using this MicroSim, learners will be able to:

1. **Identify** how `flex-direction` controls the main axis orientation
2. **Predict** how `justify-content` distributes items along the main axis
3. **Explain** the difference between `align-items` options
4. **Apply** appropriate flexbox properties to achieve desired layouts
5. **Translate** visual layouts into CSS code

## Suggested Activities

### Activity 1: Explore Each Property
Change one property at a time while keeping others at default. Observe and describe what happens.

### Activity 2: Recreate Layouts
Try to recreate these common layouts:
- Navigation bar (items spread across)
- Centered content (both axes)
- Sidebar layout (column direction)

### Activity 3: Predict and Test
Before changing a property, predict what will happen. Then test your prediction.

### Activity 4: CSS Translation
Look at the CSS panel and try to describe what each property does in your own words.

## Key Concepts

### Main Axis vs Cross Axis

- **Main Axis**: The primary direction items flow (`flex-direction`)
- **Cross Axis**: Perpendicular to the main axis
- `justify-content` works on the main axis
- `align-items` works on the cross axis

### Space Distribution

- `space-between`: No space at edges, equal space between
- `space-around`: Half space at edges, full space between
- `space-evenly`: Equal space everywhere

## Lesson Plan

### Grade Level
High School (9-12) or introductory web development courses

### Prerequisites
- Basic understanding of HTML
- Familiarity with CSS syntax

### Duration
15-20 minutes for guided exploration

### Procedure

1. **Introduction (3 min)**: Explain that flexbox is a CSS layout system for arranging items in rows or columns.

2. **Guided Exploration (7 min)**: Walk through each property as a class, predicting outcomes before testing.

3. **Independent Practice (5 min)**: Students experiment freely and note observations.

4. **Discussion (5 min)**: Share discoveries and discuss real-world applications.

### Assessment
Ask students to describe what CSS properties they would use to:
- Center a button horizontally and vertically
- Create a navigation bar with evenly spaced links
- Stack cards vertically with gaps between them
