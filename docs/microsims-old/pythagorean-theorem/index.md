---
title: Pythagorean Theorem MicroSim
description: A MicroSim that visually demonstrates the Pythagorean Theorem by showing that the areas of the squares on the two shorter sides of a right triangle add up to the area of the square on the hypotenuse.
image: /microsims-old/pythagorean-theorem/pythagorean-theorem.png
og:image: /microsims-old/pythagorean-theorem/pythagorean-theorem.png
twitter:image: /microsims-old/pythagorean-theorem/pythagorean-theorem.png
social:
   cards: false
quality_score: 100
---
# Pythagorean Theorem MicroSim

<iframe src="main.html" height="462px" width="100%" scrolling="no"></iframe>

[Run the Pythagorean Theorem MicroSim Fullscreen](main.html){ .md-button .md-button--primary }
<br/>
[Edit this Pythagorean Theorem MicroSim Using the p5.js Editor](https://editor.p5js.org/dmccreary/sketches/dJq4nTXE4)

Copy this iframe to your website:

```html
<iframe src="https://dmccreary.github.io/microsims/microsims-old/pythagorean-theorem/main.html" height="462px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

This MicroSim demonstrates the Pythagorean Theorem, one of the most famous theorems in geometry.
A **right triangle** has one 90° corner. The two sides that meet at that corner are the **legs**,
labeled `a` and `b`. The side across from the corner is the **hypotenuse**, labeled `c`. It is
always the longest side.

The theorem says that the squares of the two legs add up to the square of the hypotenuse:

```
a² + b² = c²
```

When you adjust the sliders you change the lengths of the two legs, and the MicroSim calculates
the hypotenuse. The sum of the squares of sides `a` and `b` always equals the square of side `c`.

!!! mascot-warning "Lengths Don't Add!"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A common trap is to think that c = a + b. With both sliders at 100, side c is 141.42, not 200. The *areas* add, so square each leg first, add the two squares, and then take the square root.

The word "square" in the theorem is meant literally. The value a² is the area of a square whose
sides are each `a` long. Press **Show Squares** and the MicroSim draws a square on each side
of the triangle. The green square and the blue square together cover exactly as much area as
the pink square.

### The Readout Panel

The panel has one row for each side and a bottom line that adds the two smaller areas.
With the squares shown, a colored box in each row matches the color of that side's square.

| Row | Length | Area of the square |
|-----|--------|--------------------|
| a (green) | Set by the **Side a** slider | a² |
| b (blue) | Set by the **Side b** slider | b² |
| c (pink) | Calculated as √(a² + b²) | c², which is a² + b² |

Side `c` is rounded to two decimal places, so squaring the number on the screen can miss by a
little. With both sliders at 100, the panel shows c = 141.42 and c² = 20,000, but a calculator
gives 141.42 × 141.42 = 19,999.62. The value of c² on the panel is exact because it is
calculated as a² + b².

### Controls

- **Show Squares / Hide Squares** button: shows or hides the square on each side
- **Reset** button: returns both side lengths to 100
- **Side a** slider: the length of the horizontal leg, from 50 to 130
- **Side b** slider: the length of the vertical leg, from 50 to 130

## How to Use

1. Move the **Side a** slider. The right-angle corner stays in place, the base of the triangle
   gets longer or shorter, and side `c` changes with it.
2. Move the **Side b** slider to change the height of the triangle.
3. Compare the lengths in the panel. Side `c` is always longer than either leg and always
   shorter than a + b.
4. Press **Show Squares**. Read the bottom line of the panel: the first two areas always add
   up to the third.
5. Set **Side a** to 60 and **Side b** to 80. Side `c` is exactly 100, with no decimal places.
   Three whole numbers that fit the theorem are called a **Pythagorean triple**.
6. Press **Reset** to return both sides to 100.

## Lesson Plan

### Learning Objectives

After using this MicroSim, students will be able to:

1. **Explain** (Understand) why the areas of the squares on the two legs of a right triangle add
   up to the area of the square on the hypotenuse.
2. **Calculate** (Apply) the length of the hypotenuse from the lengths of the two legs.

### Audience

Middle school and high school students in a pre-algebra, algebra or geometry course.

### Duration

20 minutes

### Prerequisites

- The area of a square is its side length multiplied by itself
- Squares and square roots of whole numbers
- The parts of a right triangle: the right angle, the two legs and the hypotenuse

### Activities

1. **Predict (3 min):** Keep the squares hidden and both sliders at 100. Side `a` is about to
   grow from 100 to 130. Write down how much you think side `c` will grow. Then move the slider
   and compare the two changes.
2. **Test (5 min):** Press Show Squares. Pick three different pairs of slider settings and
   record a², b² and c² for each pair in a table. Write one sentence that is true for every
   row of your table.
3. **Hunt (7 min):** Sides of 60 and 80 give a hypotenuse of exactly 100. Find at least two
   more pairs of slider settings that make side `c` a whole number. Look for a pattern in the
   pairs you find.
4. **Explain (5 min):** Set both sliders to 50 and record side `c` and the three areas. Then set
   both sliders to 100. In pairs, explain why side `c` doubled but every area became four times
   as large.

### Assessment

- The learner states that a² + b² = c² is true at every slider setting and that a + b = c is not.
- The learner calculates the hypotenuse for a new pair of legs, such as 72 and 96, and then
  checks the answer of 120 with the MicroSim.
- The learner explains that doubling both legs doubles the hypotenuse and multiplies each area
  by four.

## Sample Prompt

This is the prompt that generated the first version of this MicroSim. The current version adds
the width-responsive layout, the readout panel and the labels on the squares.

!!! prompt
    Create a p5.js sketch of showing a visualization of the Pythagorean theorem.  Follow the rules for a width-responsive MicroSim.

    1. Draw a right triangle in the center of the sketch canvas.
    2. Create two sliders that adjust the length of side a (base) and height (b)
    3. Create a toggle button that shows squares made of up sides a, b and c
    4. Show the length of a, b and the length of the hypotenuse C
    5. Add a reset button that resets the lengths to the default button.
    7. Place the equation c² = a² + b² as a title in the upper right
    8. Display the lengths of a, b and c and their squares in the upper left

## References

1. [Pythagorean theorem](https://en.wikipedia.org/wiki/Pythagorean_theorem) - Wikipedia - The
   statement of the theorem, its history and several proofs, including the rearrangement proofs
   that use the same squares this MicroSim draws.
2. [Euclid's Elements, Book I, Proposition 47](https://mathcs.clarku.edu/~djoyce/java/elements/bookI/propI47.html) -
   David E. Joyce, Clark University - Euclid's proof, which starts from the figure in this
   MicroSim: a right triangle with a square on each side.
3. [Pythagorean triple](https://en.wikipedia.org/wiki/Pythagorean_triple) - Wikipedia - Whole-number
   solutions such as 3, 4, 5 and 5, 12, 13, which the **Hunt** activity finds as multiples
   such as 60, 80, 100.
4. [Pythagorean Theorem](https://www.cut-the-knot.org/pythagoras/) - Alexander Bogomolny - Cut the
   Knot - A large collection of proofs of the theorem, many with interactive illustrations.
5. [p5.js createSlider() reference](https://p5js.org/reference/p5/createSlider/) - p5.js - The
   built-in slider control used for the two side lengths.
