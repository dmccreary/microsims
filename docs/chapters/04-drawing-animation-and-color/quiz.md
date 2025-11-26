# Chapter 4 Quiz: Drawing, Animation, and Color

Test your understanding of drawing primitives, text rendering, and color theory for creating vibrant MicroSims.

**Instructions:** Select the best answer for each question. After answering, click "Show Answer" to check your response and read the explanation.

---

#### 1. What is the reference point for the rect() function by default?

<div class="upper-alpha" markdown>
1. Center of the rectangle
2. Top-left corner of the rectangle
3. Bottom-right corner of the rectangle
4. Middle of the left edge
</div>

??? question "Show Answer"
    The correct answer is **B**. By default, `rect()` uses the top-left corner as the reference point. The x and y parameters specify where this corner is located. You can change this behavior with `rectMode(CENTER)` to draw from the center instead.

    **Concept Tested:** rect()

    **Bloom's Level:** Remember

---

#### 2. How does ellipse() differ from rect() in its default reference point?

<div class="upper-alpha" markdown>
1. Both use the top-left corner
2. Both use the center
3. ellipse() uses the center; rect() uses the top-left corner
4. ellipse() uses the bottom-right; rect() uses the top-left
</div>

??? question "Show Answer"
    The correct answer is **C**. The `ellipse()` function draws from the center by default, while `rect()` draws from the top-left corner. This means ellipse(100, 100, 50, 50) places the center at (100, 100), whereas rect(100, 100, 50, 50) places the top-left corner at that position.

    **Concept Tested:** ellipse(), rect()

    **Bloom's Level:** Understand

---

#### 3. What does the stroke() function control?

<div class="upper-alpha" markdown>
1. The interior color of shapes
2. The background color of the canvas
3. The outline color of shapes and lines
4. The text font size
</div>

??? question "Show Answer"
    The correct answer is **C**. The `stroke()` function sets the color for lines and shape outlines. Every shape has two color components: fill (interior) set by `fill()`, and stroke (outline) set by `stroke()`.

    **Concept Tested:** stroke()

    **Bloom's Level:** Remember

---

#### 4. What parameters does the line() function require?

<div class="upper-alpha" markdown>
1. x, y, width, height
2. x1, y1, x2, y2
3. x, y, length, angle
4. centerX, centerY, radius
</div>

??? question "Show Answer"
    The correct answer is **B**. The `line()` function takes four parameters: x1, y1 for the starting point coordinates, and x2, y2 for the ending point coordinates. It draws a straight line between these two points.

    **Concept Tested:** line()

    **Bloom's Level:** Remember

---

#### 5. Which function would you use to remove the outline from shapes?

<div class="upper-alpha" markdown>
1. noFill()
2. strokeWeight(0)
3. noStroke()
4. stroke(transparent)
</div>

??? question "Show Answer"
    The correct answer is **C**. The `noStroke()` function removes the outline from shapes entirely. While `strokeWeight(0)` might seem logical, `noStroke()` is the proper and more efficient way to disable outlines.

    **Concept Tested:** stroke()

    **Bloom's Level:** Remember

---

#### 6. What values does textAlign() accept for horizontal alignment?

<div class="upper-alpha" markdown>
1. START, MIDDLE, END
2. LEFT, CENTER, RIGHT
3. BEGIN, MIDDLE, FINISH
4. LEADING, CENTER, TRAILING
</div>

??? question "Show Answer"
    The correct answer is **B**. The `textAlign()` function accepts LEFT, CENTER, and RIGHT for horizontal alignment. LEFT means text starts at the x position, CENTER means text is centered on x, and RIGHT means text ends at the x position.

    **Concept Tested:** textAlign()

    **Bloom's Level:** Remember

---

#### 7. In HSB color mode, what does a Hue value of 0 represent?

<div class="upper-alpha" markdown>
1. Black
2. White
3. Red
4. Blue
</div>

??? question "Show Answer"
    The correct answer is **C**. In HSB (Hue, Saturation, Brightness), the Hue value represents position on the color wheel measured in degrees. Hue 0 (and 360) represents red, 120 is green, and 240 is blue. This makes HSB ideal for creating rainbow effects.

    **Concept Tested:** Color Theory

    **Bloom's Level:** Remember

---

#### 8. What is the "painter's algorithm" in shape rendering?

<div class="upper-alpha" markdown>
1. Shapes are rendered alphabetically by name
2. Shapes are rendered in the order they are drawn, with later shapes on top
3. Shapes are sorted by size before rendering
4. Shapes are rendered based on their color brightness
</div>

??? question "Show Answer"
    The correct answer is **B**. The painter's algorithm means that shapes are rendered in the order you draw them, like layers of paint. Later drawing commands paint over earlier ones. This is why you must draw background elements first and foreground elements last.

    **Concept Tested:** Shape Rendering

    **Bloom's Level:** Understand

---

#### 9. To create a rainbow gradient using HSB mode, what approach should you use?

<div class="upper-alpha" markdown>
1. Create separate RGB values for each color
2. Loop through Hue values from 0 to 360
3. Manually specify each color of the rainbow
4. Use the rainbow() built-in function
</div>

??? question "Show Answer"
    The correct answer is **B**. In HSB color mode, creating a rainbow is simple: just loop through Hue values from 0 to 360 while keeping Saturation and Brightness at full values (100). Each hue value directly corresponds to a position on the color wheel.

    **Concept Tested:** Color Theory

    **Bloom's Level:** Apply

---

#### 10. What is the correct order of parameters for the text() function?

<div class="upper-alpha" markdown>
1. text(x, y, string)
2. text(string, x, y)
3. text(string, width, height)
4. text(font, string, x, y)
</div>

??? question "Show Answer"
    The correct answer is **B**. The `text()` function takes the string to display first, followed by the x and y coordinates: `text(string, x, y)`. An optional extended form `text(string, x, y, maxWidth, maxHeight)` adds text box bounds.

    **Concept Tested:** text()

    **Bloom's Level:** Remember

---

#### 11. What type of color harmony uses colors that are adjacent on the color wheel?

<div class="upper-alpha" markdown>
1. Complementary
2. Triadic
3. Analogous
4. Split-complementary
</div>

??? question "Show Answer"
    The correct answer is **C**. Analogous color harmony uses colors that are next to each other on the color wheel. This creates a harmonious, natural-feeling palette. Complementary colors are opposite, triadic colors are equally spaced (120° apart), and split-complementary uses the two colors adjacent to the complement.

    **Concept Tested:** Color Theory

    **Bloom's Level:** Understand

---

#### 12. You want to create a button with a shadow effect. Which element should you draw first?

<div class="upper-alpha" markdown>
1. The button text
2. The shadow layer
3. The button body
4. The button border
</div>

??? question "Show Answer"
    The correct answer is **B**. Due to the painter's algorithm, you must draw background elements first. The shadow should be drawn before the button body so the button appears on top of the shadow. Then draw the button body, and finally the text on top of everything.

    **Concept Tested:** Shape Rendering, Drawing Primitives

    **Bloom's Level:** Apply

---

## Quiz Summary

**Concepts Tested:**

| Concept | Questions |
|---------|-----------|
| rect() | 1, 2 |
| ellipse() | 2 |
| stroke() | 3, 5 |
| line() | 4 |
| text() | 10 |
| textSize() | - |
| textAlign() | 6 |
| Drawing Primitives | 12 |
| Shape Rendering | 8, 12 |
| Color Theory | 7, 9, 11 |

**Bloom's Taxonomy Distribution:**

- Remember: 7 questions (58%)
- Understand: 3 questions (25%)
- Apply: 2 questions (17%)
