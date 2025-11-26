# Chapter 6 Quiz: MicroSim Architecture and Layout

Test your understanding of MicroSim structural organization, canvas dimensions, and layout patterns for professional-looking simulations.

**Instructions:** Select the best answer for each question. After answering, click "Show Answer" to check your response and read the explanation.

---

#### 1. What are the two main regions in standard MicroSim architecture?

<div class="upper-alpha" markdown>
1. Header region and footer region
2. Drawing region and control region
3. Left panel and right panel
4. Canvas region and code region
</div>

??? question "Show Answer"
    The correct answer is **B**. Standard MicroSim architecture divides the canvas into two distinct regions: the Drawing Region (where visualizations appear) and the Control Region (where sliders, buttons, and labels reside). This separation creates visual hierarchy and consistent user expectations.

    **Concept Tested:** MicroSim Architecture, Drawing Region, Control Region

    **Bloom's Level:** Remember

---

#### 2. What is the typical background color for the drawing region?

<div class="upper-alpha" markdown>
1. Pure white (255, 255, 255)
2. Light gray (200, 200, 200)
3. Alice blue (240, 248, 255)
4. Sky blue (135, 206, 235)
</div>

??? question "Show Answer"
    The correct answer is **C**. Alice blue (240, 248, 255) is the standard background color for the drawing region. It provides gentle contrast without distraction, creating a professional appearance while being easy on the eyes.

    **Concept Tested:** Drawing Region

    **Bloom's Level:** Remember

---

#### 3. How is canvasHeight typically calculated in a MicroSim?

<div class="upper-alpha" markdown>
1. canvasHeight = drawHeight - controlHeight
2. canvasHeight = drawHeight * controlHeight
3. canvasHeight = drawHeight + controlHeight
4. canvasHeight = drawHeight / 2
</div>

??? question "Show Answer"
    The correct answer is **C**. Canvas height is calculated as `canvasHeight = drawHeight + controlHeight`. The total canvas combines the visualization area and control area to create the complete MicroSim surface.

    **Concept Tested:** Canvas Height, Draw Height, Control Height

    **Bloom's Level:** Remember

---

#### 4. Why do professional MicroSims use named dimension variables instead of magic numbers?

<div class="upper-alpha" markdown>
1. They make the code run faster
2. They make code readable, maintainable, and self-documenting
3. They are required by p5.js
4. They reduce file size
</div>

??? question "Show Answer"
    The correct answer is **B**. Named variables like `canvasWidth`, `drawHeight`, and `margin` make code readable and self-documenting. Code like `rect(0, drawHeight, canvasWidth, controlHeight)` clearly shows intent, while `rect(0, 400, 400, 50)` is cryptic.

    **Concept Tested:** Canvas Width, Canvas Height

    **Bloom's Level:** Understand

---

#### 5. What is the purpose of the margin variable?

<div class="upper-alpha" markdown>
1. To set the canvas border width
2. To create spacing between content and canvas edges
3. To define the control region height
4. To set the slider width
</div>

??? question "Show Answer"
    The correct answer is **B**. The margin variable defines spacing between content and canvas edges, creating visual breathing room. Margins prevent elements from touching edges, making simulations feel polished and professional rather than cramped.

    **Concept Tested:** Margin Variable

    **Bloom's Level:** Understand

---

#### 6. When should you use a two-column layout?

<div class="upper-alpha" markdown>
1. When you have only one control
2. When you need side-by-side visualization and data display
3. When the canvas is narrow
4. When creating mobile-only designs
</div>

??? question "Show Answer"
    The correct answer is **B**. The two-column layout is ideal when you need to show two related views simultaneously—like a main visualization paired with a graph, before/after comparisons, or a simulation with a data panel.

    **Concept Tested:** Two-Column Layout

    **Bloom's Level:** Apply

---

#### 7. What pattern enables working in local coordinates for multi-column layouts?

<div class="upper-alpha" markdown>
1. save() and restore()
2. push(), translate(), and pop()
3. beginShape() and endShape()
4. loadPixels() and updatePixels()
</div>

??? question "Show Answer"
    The correct answer is **B**. The `push()`, `translate()`, and `pop()` pattern enables working in local coordinates. After `translate(leftColumnWidth, 0)`, all drawing happens relative to the new origin, making multi-column layouts much easier to code.

    **Concept Tested:** Two-Column Layout

    **Bloom's Level:** Remember

---

#### 8. What is the key difference between fixed and responsive layouts?

<div class="upper-alpha" markdown>
1. Fixed layouts use more colors
2. Responsive layouts adapt to container width; fixed layouts maintain constant dimensions
3. Fixed layouts require more code
4. Responsive layouts only work on mobile
</div>

??? question "Show Answer"
    The correct answer is **B**. Fixed layouts maintain constant dimensions regardless of browser window size, while responsive layouts adapt to available container width. Responsive layouts use `windowResized()` and `updateCanvasSize()` functions.

    **Concept Tested:** Fixed Layout, Responsive Layout

    **Bloom's Level:** Understand

---

#### 9. Which function must be implemented for a responsive layout to work?

<div class="upper-alpha" markdown>
1. setup() only
2. draw() only
3. windowResized()
4. mousePressed()
</div>

??? question "Show Answer"
    The correct answer is **C**. Responsive layouts require the `windowResized()` function to detect when the container size changes. This function typically calls `updateCanvasSize()` and `resizeCanvas()` to adapt the MicroSim to the new dimensions.

    **Concept Tested:** Responsive Layout

    **Bloom's Level:** Remember

---

#### 10. In a responsive layout, how should slider width be calculated?

<div class="upper-alpha" markdown>
1. A fixed value like 200 pixels
2. Relative to canvasWidth, such as `canvasWidth - sliderLeftMargin - margin`
3. Always 50% of the screen
4. Based on the number of sliders
</div>

??? question "Show Answer"
    The correct answer is **B**. Slider width should be calculated relative to canvasWidth so it adapts when the container resizes. A formula like `canvasWidth - sliderLeftMargin - margin` ensures the slider stretches appropriately while respecting spacing.

    **Concept Tested:** Responsive Layout

    **Bloom's Level:** Apply

---

#### 11. What is the standard layout pattern best used for?

<div class="upper-alpha" markdown>
1. Complex multi-view simulations
2. Simple simulations with 1-3 controls in narrow containers
3. Print-only designs
4. Two-column comparisons
</div>

??? question "Show Answer"
    The correct answer is **B**. The standard layout is the default choice for simple simulations with single visualizations and 1-3 controls. It works well in narrow containers (under 500px), for mobile-friendly designs, and quick prototypes.

    **Concept Tested:** Standard Layout

    **Bloom's Level:** Understand

---

#### 12. What must you remember to do when the canvas resizes in a responsive layout?

<div class="upper-alpha" markdown>
1. Recreate all sliders from scratch
2. Reposition and resize control elements like sliders
3. Change the background color
4. Reset all simulation variables
</div>

??? question "Show Answer"
    The correct answer is **B**. When the canvas resizes, you must reposition and resize control elements like sliders. Calling `repositionControls()` in `windowResized()` ensures sliders update their position and size to match the new canvas dimensions.

    **Concept Tested:** Responsive Layout

    **Bloom's Level:** Apply

---

## Quiz Summary

**Concepts Tested:**

| Concept | Questions |
|---------|-----------|
| MicroSim Architecture | 1 |
| Drawing Region | 1, 2 |
| Control Region | 1 |
| Canvas Width | 4 |
| Canvas Height | 3, 4 |
| Draw Height | 3 |
| Control Height | 3 |
| Margin Variable | 5 |
| Standard Layout | 11 |
| Two-Column Layout | 6, 7 |
| Fixed Layout | 8 |
| Responsive Layout | 8, 9, 10, 12 |

**Bloom's Taxonomy Distribution:**

- Remember: 4 questions (33%)
- Understand: 4 questions (33%)
- Apply: 4 questions (33%)
