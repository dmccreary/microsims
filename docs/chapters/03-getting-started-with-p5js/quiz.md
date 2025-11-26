# Chapter 3 Quiz: Getting Started with p5.js

Test your understanding of the p5.js library, canvas coordinates, the animation loop, and essential functions for creating MicroSims.

**Instructions:** Select the best answer for each question. After answering, click "Show Answer" to check your response and read the explanation.

---

#### 1. What is the origin point (0, 0) in the p5.js coordinate system?

<div class="upper-alpha" markdown>
1. Center of the canvas
2. Bottom-left corner
3. Top-left corner
4. Top-right corner
</div>

??? question "Show Answer"
    The correct answer is **C**. In p5.js, the origin (0, 0) is at the top-left corner of the canvas. X values increase as you move right, and Y values increase as you move down. This differs from standard mathematical graphs where the origin is often at the center or bottom-left.

    **Concept Tested:** Coordinate System

    **Bloom's Level:** Remember

---

#### 2. What is the purpose of the setup() function in p5.js?

<div class="upper-alpha" markdown>
1. It runs repeatedly to create animation
2. It runs once when the program starts to initialize the sketch
3. It handles mouse click events
4. It controls the frame rate
</div>

??? question "Show Answer"
    The correct answer is **B**. The `setup()` function runs exactly once when your program starts. It's used for initialization tasks like creating the canvas, setting initial positions, loading resources, and configuring the sketch environment.

    **Concept Tested:** setup() Function

    **Bloom's Level:** Remember

---

#### 3. How often does the draw() function execute by default in p5.js?

<div class="upper-alpha" markdown>
1. Once when the program starts
2. Only when the user clicks
3. Approximately 60 times per second
4. Every 100 milliseconds
</div>

??? question "Show Answer"
    The correct answer is **C**. The `draw()` function runs in an animation loop approximately 60 times per second by default. This frame rate creates smooth animations by rapidly updating the canvas, similar to how movies create the illusion of movement.

    **Concept Tested:** Frame Rate, Animation Loop

    **Bloom's Level:** Remember

---

#### 4. In the RGB color model, what color does (0, 255, 0) represent?

<div class="upper-alpha" markdown>
1. Red
2. Blue
3. Green
4. Yellow
</div>

??? question "Show Answer"
    The correct answer is **C**. In RGB, the three values represent Red, Green, and Blue channels respectively, each ranging from 0 to 255. With (0, 255, 0), red is off, green is at maximum, and blue is off, resulting in pure green.

    **Concept Tested:** RGB Color Model

    **Bloom's Level:** Remember

---

#### 5. What is the difference between global and local variables?

<div class="upper-alpha" markdown>
1. Global variables are faster; local variables are slower
2. Global variables can be accessed anywhere; local variables only exist within their function
3. Global variables store numbers; local variables store text
4. Global variables are automatically updated; local variables must be changed manually
</div>

??? question "Show Answer"
    The correct answer is **B**. Global variables are declared outside of any function and can be accessed from anywhere in your code. Local variables are declared inside a function and only exist within that function's scope. Global variables are essential for MicroSims because they persist between draw() calls, enabling animation.

    **Concept Tested:** Global Variables, Local Variables

    **Bloom's Level:** Understand

---

#### 6. What does the createCanvas() function do?

<div class="upper-alpha" markdown>
1. Draws a rectangle on the screen
2. Creates the HTML canvas element for p5.js to draw on
3. Clears the canvas with a background color
4. Loads an image from a file
</div>

??? question "Show Answer"
    The correct answer is **B**. The `createCanvas(width, height)` function creates an HTML canvas element of the specified dimensions. This canvas serves as the digital drawing surface where all p5.js graphics are rendered.

    **Concept Tested:** createCanvas(), Canvas Element

    **Bloom's Level:** Remember

---

#### 7. Why would you call background() at the beginning of the draw() function?

<div class="upper-alpha" markdown>
1. To make the animation slower
2. To clear the previous frame and prevent trails from moving objects
3. To load a background image
4. To set the canvas size
</div>

??? question "Show Answer"
    The correct answer is **B**. Calling `background()` at the start of `draw()` clears the canvas with the specified color before drawing the new frame. Without this, moving objects would leave trails as previous frames remain visible beneath new drawings.

    **Concept Tested:** background()

    **Bloom's Level:** Understand

---

#### 8. What is a pixel?

<div class="upper-alpha" markdown>
1. A JavaScript library for graphics
2. A type of color value
3. The smallest addressable point on a canvas that can display a single color
4. A function for drawing circles
</div>

??? question "Show Answer"
    The correct answer is **C**. A pixel (short for "picture element") is the smallest addressable point on your canvas. Each pixel has a specific location defined by its coordinates and can display one color at any given moment. Canvas dimensions are measured in pixels.

    **Concept Tested:** Pixels

    **Bloom's Level:** Remember

---

#### 9. A circle drawn at position (200, 100) on a 400x400 canvas appears where?

<div class="upper-alpha" markdown>
1. In the center of the canvas
2. In the upper half, horizontally centered
3. In the lower half, on the left side
4. In the bottom-right corner
</div>

??? question "Show Answer"
    The correct answer is **B**. With (0,0) at the top-left, x=200 places the circle horizontally at the center (halfway across 400 pixels). With y=100, the circle is positioned relatively close to the top (only 100 pixels down out of 400), placing it in the upper half of the canvas.

    **Concept Tested:** Coordinate System

    **Bloom's Level:** Apply

---

#### 10. What does the fill() function control?

<div class="upper-alpha" markdown>
1. The canvas background color
2. The outline color of shapes
3. The interior color of shapes drawn afterward
4. The text font style
</div>

??? question "Show Answer"
    The correct answer is **C**. The `fill()` function sets the color used to fill the interior of shapes drawn after it is called. It continues to apply to all subsequent shapes until fill() is called again with a different color, or noFill() is used.

    **Concept Tested:** fill()

    **Bloom's Level:** Remember

---

#### 11. Which institution has been the primary home and supporter of p5.js development since 2013?

<div class="upper-alpha" markdown>
1. MIT Media Lab
2. Stanford University
3. NYU ITP (Interactive Telecommunications Program)
4. Google Creative Lab
</div>

??? question "Show Answer"
    The correct answer is **C**. NYU's Interactive Telecommunications Program (ITP) has been the primary institutional home for p5.js since Lauren McCarthy began its development there in 2013. NYU ITP provides funding, community support, and resources for the project's ongoing development.

    **Concept Tested:** p5.js Library

    **Bloom's Level:** Remember

---

#### 12. To create a smooth animation where a ball moves across the screen, which approach should you use?

<div class="upper-alpha" markdown>
1. Put all movement code in setup() since it runs first
2. Store position in a local variable inside draw()
3. Store position in a global variable and update it in draw()
4. Create a new canvas for each position
</div>

??? question "Show Answer"
    The correct answer is **C**. Animation requires storing position in a global variable so the value persists between draw() calls. Each time draw() executes, you update the global position variable slightly, and the repeated calls (60 times per second) create the illusion of smooth movement.

    **Concept Tested:** Global Variables, Animation Loop, draw() Function

    **Bloom's Level:** Apply

---

## Quiz Summary

**Concepts Tested:**

| Concept | Questions |
|---------|-----------|
| Coordinate System | 1, 9 |
| setup() Function | 2 |
| draw() Function | 3, 12 |
| Frame Rate | 3 |
| Animation Loop | 3, 12 |
| RGB Color Model | 4 |
| Global Variables | 5, 12 |
| Local Variables | 5 |
| createCanvas() | 6 |
| Canvas Element | 6 |
| background() | 7 |
| Pixels | 8 |
| fill() | 10 |
| p5.js Library | 11 |

**Bloom's Taxonomy Distribution:**

- Remember: 7 questions (58%)
- Understand: 2 questions (17%)
- Apply: 3 questions (25%)
