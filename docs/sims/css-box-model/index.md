---
title: CSS Box Model
description: An interactive MicroSim that helps learners understand how margin, border, padding, and content interact to determine element size and spacing in CSS.
image: /sims/css-box-model/css-box-model.png
og:image: /sims/css-box-model/css-box-model.png
twitter:image: /sims/css-box-model/css-box-model.png
social:
   cards: false
---

# CSS Box Model Interactive

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the CSS Box Model MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit the CSS Box Model MicroSim in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This interactive visualization helps you understand one of the most fundamental concepts in CSS: the **Box Model**. Every HTML element is essentially a box with four layers:

1. **Content** - The actual content of the element (text, images, etc.)
2. **Padding** - Space between the content and the border
3. **Border** - A line around the padding (can have various widths and styles)
4. **Margin** - Space outside the border that separates this element from others

## Why This Matters

Have you ever wondered why an element takes up more space than you expected? The answer is usually the box model. When you set `width: 100px` on an element, that's just the content width. The actual space the element occupies is:

**Total Width = content + (padding × 2) + (border × 2) + (margin × 2)**

## How to Use

- Adjust the **Margin** slider to see how spacing outside the element changes
- Adjust the **Border** slider to change the border thickness
- Adjust the **Padding** slider to add space between content and border
- Adjust the **Content** slider to resize the inner content area
- **Hover** over any region to see a tooltip with the CSS property name
- Watch the **Total Width calculation** update in real-time

## Embedding This MicroSim

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/css-box-model/main.html"
        height="502px"
        scrolling="no">
</iframe>
```

## Color Coding

The colors match common browser DevTools representations:

| Layer | Color | CSS Property |
|-------|-------|--------------|
| Margin | Orange | `margin` |
| Border | Dark Gray | `border-width` |
| Padding | Light Green | `padding` |
| Content | Light Blue | `width` / `height` |

## Learning Objectives

After using this MicroSim, you should be able to:

- Explain the four components of the CSS box model
- Calculate the total space an element occupies given its CSS properties
- Debug "extra space" issues in web layouts
- Understand why `box-sizing: border-box` is often preferred

## Related CSS Concepts

### box-sizing Property

By default (`box-sizing: content-box`), width/height only set the content size. Many developers prefer:

```css
* {
  box-sizing: border-box;
}
```

This makes width/height include padding and border, making layouts more predictable.

### Lesson Plan

**Duration**: 10-15 minutes

1. **Predict** (2 min): Ask students to guess how wide a `<div>` with `width: 100px; padding: 20px; border: 5px solid black; margin: 10px;` would actually be.

2. **Explore** (5 min): Have students adjust sliders to match those values and verify their prediction.

3. **Discover** (5 min): Challenge students to create a box that takes up exactly 200px total width, then 300px.

4. **Reflect** (3 min): Discuss why understanding the box model prevents common CSS frustrations.

## References

- [MDN: The Box Model](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model)
- [CSS-Tricks: The CSS Box Model](https://css-tricks.com/the-css-box-model/)
