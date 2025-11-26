# Chapter 8 Quiz: Responsive Design Techniques

Test your understanding of creating MicroSims that adapt gracefully to different screen sizes and container widths.

**Instructions:** Select the best answer for each question. After answering, click "Show Answer" to check your response and read the explanation.

---

#### 1. When does the windowResized() function get called?

<div class="upper-alpha" markdown>
1. Once when the page loads
2. Automatically when the browser window changes size
3. Only when you call it manually
4. Every frame in the draw loop
</div>

??? question "Show Answer"
    The correct answer is **B**. The `windowResized()` function is a p5.js event handler that fires automatically whenever the browser window changes size. This is your hook for triggering responsive adjustments to the canvas and controls.

    **Concept Tested:** windowResized()

    **Bloom's Level:** Remember

---

#### 2. What is the purpose of the updateCanvasSize() function?

<div class="upper-alpha" markdown>
1. To animate canvas transitions
2. To centralize all canvas dimension calculations
3. To create new canvases
4. To delete old canvases
</div>

??? question "Show Answer"
    The correct answer is **B**. The `updateCanvasSize()` function is a custom helper that centralizes all canvas dimension calculations, including getting container width, applying constraints, and calculating dependent values like margins and font sizes.

    **Concept Tested:** updateCanvasSize()

    **Bloom's Level:** Understand

---

#### 3. What is the difference between fixed and relative positioning?

<div class="upper-alpha" markdown>
1. Fixed uses pixels; relative uses percentages of canvas dimensions
2. Fixed is faster; relative is slower
3. Fixed works on mobile; relative works on desktop
4. Fixed uses JavaScript; relative uses CSS
</div>

??? question "Show Answer"
    The correct answer is **A**. Fixed positioning uses absolute pixel values like `text("Title", 200, 30)`, which breaks when dimensions change. Relative positioning uses proportions like `text("Title", width/2, margin)`, which adapts to any canvas size.

    **Concept Tested:** Relative Positioning

    **Bloom's Level:** Understand

---

#### 4. What does the translate() function do?

<div class="upper-alpha" markdown>
1. Moves an individual shape
2. Shifts the entire coordinate system to a new origin
3. Translates text to another language
4. Converts pixels to percentages
</div>

??? question "Show Answer"
    The correct answer is **B**. The `translate(x, y)` function shifts the entire coordinate system so that (0, 0) is now at what was (x, y). All subsequent drawing commands use coordinates relative to this new origin.

    **Concept Tested:** translate() Function, Coordinate Translation

    **Bloom's Level:** Remember

---

#### 5. What do push() and pop() save and restore?

<div class="upper-alpha" markdown>
1. Only fill and stroke colors
2. The transformation matrix and all style settings
3. Slider positions
4. Canvas size
</div>

??? question "Show Answer"
    The correct answer is **B**. The `push()` function saves the current transformation matrix (translate, rotate, scale), fill color, stroke color, stroke weight, text size, alignment, font, tint, and blend mode. Calling `pop()` restores all of these to their previous values.

    **Concept Tested:** push() Function, pop() Function

    **Bloom's Level:** Remember

---

#### 6. What is the "container width" in responsive design?

<div class="upper-alpha" markdown>
1. The width of the browser window
2. The width available to your MicroSim in its embedding context
3. The width of all elements combined
4. A fixed value of 400 pixels
</div>

??? question "Show Answer"
    The correct answer is **B**. Container width refers to the actual width available to your MicroSim in its embedding context. When embedded in an iframe within a textbook page, this may be narrower than the browser window.

    **Concept Tested:** Container Width

    **Bloom's Level:** Understand

---

#### 7. To center a title at any canvas width, what code should you use?

<div class="upper-alpha" markdown>
1. text("Title", 200, 30)
2. text("Title", width / 2, margin)
3. text("Title", center, top)
4. text("Title", 0, 0)
</div>

??? question "Show Answer"
    The correct answer is **B**. Using `width / 2` for the x-coordinate ensures the text is always centered horizontally, regardless of canvas width. Combined with `textAlign(CENTER)`, this creates truly responsive centering.

    **Concept Tested:** Relative Positioning

    **Bloom's Level:** Apply

---

#### 8. What is "dynamic scaling" in responsive design?

<div class="upper-alpha" markdown>
1. Scaling only images
2. Adjusting element sizes proportionally to canvas dimensions
3. Increasing animation speed
4. Changing colors based on width
</div>

??? question "Show Answer"
    The correct answer is **B**. Dynamic scaling means adjusting element sizes (text, shapes, margins) proportionally to canvas dimensions. For example, `titleSize = map(canvasWidth, 300, 1200, 18, 36)` scales title size from 18px to 36px as width increases.

    **Concept Tested:** Dynamic Scaling

    **Bloom's Level:** Understand

---

#### 9. What is the purpose of the push()/translate()/pop() pattern?

<div class="upper-alpha" markdown>
1. To save memory
2. To create isolated coordinate contexts for drawing groups
3. To increase frame rate
4. To add animations
</div>

??? question "Show Answer"
    The correct answer is **B**. The push/translate/pop pattern creates an isolated coordinate context. You can translate to a group's origin, draw using simple local coordinates, then pop to restore the original coordinate system—keeping groups modular and independent.

    **Concept Tested:** Element Grouping, Coordinate Translation

    **Bloom's Level:** Understand

---

#### 10. What must you remember to do when the canvas resizes?

<div class="upper-alpha" markdown>
1. Only redraw the background
2. Reposition and resize control elements like sliders
3. Delete all shapes
4. Change the frame rate
</div>

??? question "Show Answer"
    The correct answer is **B**. When the canvas resizes, you must reposition and resize control elements (sliders, buttons). Call a `repositionControls()` function in `windowResized()` to update slider positions and widths based on the new canvas dimensions.

    **Concept Tested:** Responsive Width

    **Bloom's Level:** Remember

---

#### 11. What is the "reference width pattern" for scaling?

<div class="upper-alpha" markdown>
1. Using 1920px as the only supported width
2. Designing at a baseline width and scaling all values proportionally from it
3. Making all elements the same width
4. Using CSS media queries
</div>

??? question "Show Answer"
    The correct answer is **B**. The reference width pattern involves designing your MicroSim at a "reference width" (commonly 600px), then scaling all values proportionally: `scaleFactor = canvasWidth / REFERENCE_WIDTH`. This ensures consistent proportions at any size.

    **Concept Tested:** Dynamic Scaling

    **Bloom's Level:** Understand

---

#### 12. A MicroSim looks correct at 600px width but breaks at 300px. What is the likely problem?

<div class="upper-alpha" markdown>
1. The frame rate is too low
2. Elements are using fixed pixel positions instead of relative positioning
3. The colors are wrong
4. The canvas is too tall
</div>

??? question "Show Answer"
    The correct answer is **B**. When a MicroSim breaks at different widths, the most common cause is using fixed pixel positions (like `text("Title", 300, 30)`) instead of relative positioning (like `text("Title", width/2, margin)`). Fixed values don't adapt when dimensions change.

    **Concept Tested:** Relative Positioning, Responsive Width

    **Bloom's Level:** Analyze

---

## Quiz Summary

**Concepts Tested:**

| Concept | Questions |
|---------|-----------|
| windowResized() | 1 |
| updateCanvasSize() | 2 |
| Relative Positioning | 3, 7, 12 |
| translate() Function | 4 |
| push() Function | 5 |
| pop() Function | 5 |
| Container Width | 6 |
| Dynamic Scaling | 8, 11 |
| Element Grouping | 9 |
| Coordinate Translation | 4, 9 |
| Responsive Width | 10, 12 |

**Bloom's Taxonomy Distribution:**

- Remember: 3 questions (25%)
- Understand: 6 questions (50%)
- Apply: 1 question (8%)
- Analyze: 2 questions (17%)
