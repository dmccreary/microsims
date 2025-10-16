---
title: Flower Petal Designer
description: A MicroSim for designing flowers.
image: /sims/flower-petal/flower-petal.png
og:image: /sims/name/flower-petal.png
twitter:image: /sims/name/flower-petal.png
social:
   cards: false
---
# Flower Petal Designer

<iframe src="main.html" height="610px" scrolling="no"></iframe>

<!--
![Image Name](./image.png){ width="400" }
-->

[Run the MicroSim](main.html){ .md-button .md-button--primary }
[Edit this MicroSim](https://editor.p5js.org/dmccreary/sketches/dJq4nTXE4)

## Sample iframe

```html
<iframe src="https://dmccreary.github.io/microsims/sims/flower-petal/main.html" height="610px"  scrolling="no"></iframe>
```

## User Guide

### Overview

The Flower Petal Designer is an interactive MicroSim that allows you to create custom flower designs by adjusting geometric parameters and colors. This educational tool demonstrates the mathematical principles behind creating organic shapes using quadratic Bézier curves and helps students understand how simple geometric transformations can create complex, natural-looking patterns.

### Controls

The simulator provides six interactive sliders that control different aspects of your flower design:

#### Geometric Controls

**Number of Petals (3-20)**
- Controls how many petals are arranged radially around the flower's center
- Default: 6 petals
- Lower values create simpler flowers (like trilliums)
- Higher values create more complex, daisy-like flowers
- Each petal is rotated by 360°/n where n is the number of petals

**Petal Length (20-200)**
- Controls how far the tip of each petal extends from the center
- Default: 130 pixels
- Shorter lengths create compact, button-like flowers
- Longer lengths create elongated, dramatic petals
- Also affects the size of the center circle (40% of petal length)

**Control Point X (0-150)**
- Controls the horizontal curviness of the petal edges
- Default: 40
- Value of 0 creates straight, triangular petals
- Higher values create wider, more rounded petals
- This is the x-coordinate of the quadratic Bézier curve control point

**Control Point Y (0-200)**
- Controls the vertical depth and shape of the petal curve
- Default: 75
- Lower values create shallow curves near the base
- Higher values create deeper curves extending toward the tip
- This is the y-coordinate of the quadratic Bézier curve control point

#### Color Controls

**Petal Color (Hue: 0-360)**
- Controls the hue (color) of the flower petals
- Default: 300° (magenta/purple)
- Uses HSB color model where 0° = Red, 120° = Green, 240° = Blue
- Popular flower colors:
    - Red/Pink: 0-30°
    - Orange: 30-60°
    - Yellow: 60-90°
    - Blue: 180-240°
    - Purple: 270-330°
- Saturation: 75%, Brightness: 85% (fixed for vibrant petals)

**Center Color (Hue: 0-360)**
- Controls the hue of the flower's center circle
- Default: 60° (yellow)
- Same hue range as petal color (0-360°)
- Saturation: 60%, Brightness: 95% (fixed for lighter center)
- Creates realistic contrast between petals and center

### Visual Feedback

The simulation displays several visual elements to help you understand the geometry:

- **Control Points**: Small black circles show the position of the Bézier curve control points
- **Guide Lines**: Thin black lines connect the center, control points, and petal tips
- **Center Circle**: A contrasting center circle that scales with petal length
- **Code Display**: At the bottom, see the function call that would generate your current flower design

### How It Works

The Flower Petal Designer uses **quadratic Bézier curves** to create each petal:

1. Each petal starts at the center (0, 0)
2. The curve extends to the petal tip (0, petalLength)
3. The control point (ctrlX, ctrlY) determines the curve's shape
4. A second curve mirrors back to create a symmetrical petal
5. The entire petal shape is rotated around the center for each petal count

**Mathematical Formula:**
For a flower with n petals, each petal is rotated by an angle of 360°/n degrees using p5.js's `rotate()` function in DEGREES mode.

### Educational Applications

#### Mathematics (Grades 6-12)
- **Geometry**: Understand rotation, symmetry, and radial patterns
- **Trigonometry**: See how angles divide a circle (360°/n)
- **Algebra**: Explore coordinate systems and Bézier curve equations
- **Functions**: Observe how parameter changes affect outputs

#### Art & Design (Grades 4-12)
- **Color Theory**: Experiment with the HSB color model
- **Pattern Design**: Create repeating radial patterns
- **Digital Art**: Understand how computer graphics create organic shapes
- **Botanical Drawing**: Study the structure of actual flowers

#### Computer Science (Grades 8-12)
- **Parametric Design**: See how parameters control complex shapes
- **Graphics Programming**: Understand coordinate transformations
- **Functions**: Observe how one function can be called with different parameters
- **Iterative Processes**: See how loops create repetition

### Suggested Activities

1. **Flower Species Study**: Try to recreate real flowers (roses, daisies, sunflowers) by adjusting parameters
2. **Color Harmony**: Explore complementary colors (opposite on color wheel: 180° apart)
3. **Pattern Analysis**: Keep petal count constant and vary control points to see shape changes
4. **Code Challenge**: Use the displayed code to recreate your flower in the p5.js editor
5. **Math Connection**: Calculate the rotation angle for different petal counts (360°/n)
6. **Design Challenge**: Create the most symmetrical, beautiful, or unusual flower you can

### Tips for Best Results

- **Realistic Flowers**: Use 5-8 petals with moderate control points (30-60)
- **Abstract Designs**: Use high petal counts (15-20) with extreme control points
- **Contrast**: Choose colors that are at least 60° apart on the color wheel
- **Symmetry**: The simulation automatically ensures perfect radial symmetry
- **Experimentation**: Try extreme values - you might discover unexpected beautiful patterns!

### Technical Notes

- The simulation uses p5.js's `quadraticVertex()` function to create smooth curves
- Colors are generated using HSB (Hue, Saturation, Brightness) color mode for intuitive color selection
- The canvas is fully responsive and will adapt to your screen width
- All geometric calculations are performed in real-time as you adjust sliders

### Related Concepts

- **Bézier Curves**: Mathematical curves used in computer graphics and vector art
- **Radial Symmetry**: A type of symmetry found in nature (flowers, starfish, snowflakes)
- **HSB Color Model**: An alternative to RGB that's more intuitive for color selection
- **Parametric Design**: Using parameters to control the generation of forms
- **Rotational Transformations**: Mathematical operations that rotate objects around a point

