---
title: Rainbow Color Picker
description: An interactive MicroSim showing a horizontal rainbow band with a slider to select colors and display RGB values.
image: /sims/rainbow-color-picker/rainbow-color-picker.png
og:image: /sims/rainbow-color-picker/rainbow-color-picker.png
twitter:image: /sims/rainbow-color-picker/rainbow-color-picker.png
social:
   cards: false
---

# Rainbow Color Picker

<iframe src="main.html" height="122px" width="100%" scrolling="no"></iframe>

[Run the Rainbow Color Picker MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This interactive simulation displays a horizontal rainbow band showing all colors of the visible spectrum, starting with red on the left and progressing through orange, yellow, green, cyan, blue, and violet on the right.

**Features:**

- **Rainbow Band**: A horizontal strip showing all hues from 0° to 360° in the HSB color model
- **Color Swatch**: A square in the control area showing the currently selected color
- **RGB Values**: Real-time display of Red, Green, and Blue values (0-255) for the selected color
- **Selection Indicator**: A thin black rectangle outline on the rainbow showing the current color position
- **Color Slider**: Drag to select any color along the rainbow spectrum

## Embedding This MicroSim

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/rainbow-color-picker/main.html" height="352px" scrolling="no"></iframe>
```

## How to Use

1. **Move the slider** in the control area to select different colors from the rainbow
2. **Observe the color swatch** on the left side of the control area to see your selected color
3. **Read the RGB values** displayed between the swatch and slider
4. **Notice the black rectangle** on the rainbow band indicating your current position

## Understanding Color Models

### HSB (Hue, Saturation, Brightness)

This MicroSim uses the HSB color model internally:

- **Hue** (0-360°): The color position on the color wheel/rainbow
  - 0° = Red
  - 60° = Yellow
  - 120° = Green
  - 180° = Cyan
  - 240° = Blue
  - 300° = Magenta
  - 360° = Red (wraps around)
- **Saturation** (0-100%): Color intensity (this MicroSim uses 100%)
- **Brightness** (0-100%): Light amount (this MicroSim uses 100%)

### RGB (Red, Green, Blue)

The displayed values show the RGB equivalent:

- Each component ranges from 0-255
- Pure red: R:255 G:0 B:0
- Pure green: R:0 G:255 B:0
- Pure blue: R:0 G:0 B:255

## Lesson Plan

### Learning Objectives

1. Understand the relationship between the visible light spectrum and digital color representation
2. Learn how colors transition smoothly in the rainbow (color wheel)
3. Explore the conversion between HSB and RGB color models
4. Identify the RGB values for primary and secondary colors

### Suggested Activities

1. **Find Primary Colors**: Move the slider to find pure red, green, and blue. Record their RGB values.

2. **Find Secondary Colors**: Locate yellow, cyan, and magenta. What RGB combinations create these colors?

3. **Color Mixing Prediction**: Before moving the slider, predict what RGB values you'll see for orange (between red and yellow).

4. **Pattern Recognition**: As you move through the rainbow, which RGB component increases while another decreases?

### Discussion Questions

- Why does the rainbow start and end with similar colors (red)?
- Why are there only 3 components in RGB when there are millions of colors?
- How is this digital rainbow different from a natural rainbow?

## Technical Notes

- The rainbow uses HSB color mode with full saturation and brightness
- Colors are drawn as 1-pixel-wide vertical strips for smooth gradients
- The slider maps linearly from hue 0° to 360°
