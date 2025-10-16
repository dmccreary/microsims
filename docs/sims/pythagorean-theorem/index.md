---
title: Pythagorean Theorem MicroSim
description: "A MicroSim that visually demonstrates the Pythagorean Theorem by showing how the sum of the squares of the sides are are equal to square of hypotenuse.
image: /sims/pythagorean-theorem/pythagorean-theorem.png
og:image: /sims/pythagorean-theorem/pythagorean-theorem.png
twitter:image: /sims/pythagorean-theorem/pythagorean-theorem.png
social:
   cards: false
---
# Pythagorean Theorem MicroSim

<iframe src="main.html" height="470px" scrolling="no"></iframe>

[Run the Pythagorean Theorem Fullscreen](main.html){ .md-button .md-button--primary }
<br/>
[Edit this Pythagorean Theorem Using the p5.js Editor](https://editor.p5js.org/dmccreary/sketches/dJq4nTXE4)

Add the following to your website to include this MicroSim in your course:

```html
<iframe src="http://dmccreary.github.io/microsims/sims/pythagorean-theorem/main.html" height="470px" scrolling="no"></iframe>
```


This MicroSim demonstrates the Pythagorean Theorem, one of the most famous theorems in geometry.  Note that when you adjust the sliders you change the lengths of two shorter
sides of the right triangle.  Note that the sum of the squares of sides `a` and `b` will always
equal the square of side `c`.

## Description of the Pythagorean Theorem MicroSim

- **Side Length Sliders**
    - Adjust Length of Side `a` (base): *Slider*
    - Adjust Length of Side `b` (height): *Slider*
- **Show Squares Button**
    -   Toggle display of squares on each side: *Button*
-   **Calculate Hypotenuse Button**
    -   Computes and displays the length of the hypotenuse `c`: *Button*
-   **Reset Button**
    -   Resets side lengths to default values: *Button*



## Sample Prompt

!!! prompt
    Create a p5.js sketch of showing a visualization of the Pythagorean theorem.  Follow the rules for a width-responsive MicroSim.

    1. Draw a right triangle in the center of the sketch canvas.
    2. Create two sliders that adjust the length of side a (base) and height (b)
    3. Create a toggle button that shows squares made of up sides a, b and c
    4. Show the length of a, b and the length of the hypotenuse C
    5. Add a reset button that resets the lengths to the default button.
    7. Place the equation c² = a² + b² as a title in the upper right
    8. Display the lengths of a, b and c and their squares in the upper left

