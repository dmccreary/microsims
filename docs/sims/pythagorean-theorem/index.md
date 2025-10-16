# Pythagorean Theorem MicroSim

![](pythagorean-theorem.png)

[Run the Pythagorean Theorem MicroSim](./pythagorean-theorem.html){ .md-button .md-button--primary }
[Edit the MicroSim](https://editor.p5js.org/dmccreary/sketches/vmutQF9Qi)

[Version 1 of Pythagorean Theorem MicroSim](./v1.html)

This MicroSim demonstrates the Pythagorean Theorem, one of the most famous theorems in geometry.
Using the ChatGPT o1-preview and a good MicroSim template it was easy for us
to generate this demo.

## Description of the Pythagorean Theorem MicroSim

-   **Side Length Sliders**
    -   Adjust Length of Side `a` (base): *Slider*
    -   Adjust Length of Side `b` (height): *Slider*
-   **Show Squares Button**
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

