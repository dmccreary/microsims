# Chapter 7 Quiz: User Interface Controls and Events

Test your understanding of sliders, buttons, event handlers, and the patterns for controlling MicroSim animations.

**Instructions:** Select the best answer for each question. After answering, click "Show Answer" to check your response and read the explanation.

---

#### 1. What are the four parameters of the createSlider() function?

<div class="upper-alpha" markdown>
1. x, y, width, height
2. min, max, default, step
3. label, value, range, callback
4. start, end, current, increment
</div>

??? question "Show Answer"
    The correct answer is **B**. The `createSlider()` function takes min (minimum value), max (maximum value), default (starting value), and an optional step (increment size). For example: `createSlider(1, 10, 5, 0.5)` creates a slider ranging from 1 to 10, starting at 5, with 0.5 increments.

    **Concept Tested:** createSlider()

    **Bloom's Level:** Remember

---

#### 2. How do you get the current value from a slider?

<div class="upper-alpha" markdown>
1. slider.getValue()
2. slider.value()
3. slider.current
4. slider.read()
</div>

??? question "Show Answer"
    The correct answer is **B**. The `.value()` method returns the current value of a slider. You typically call this in the draw() function to get real-time values as the user adjusts the slider.

    **Concept Tested:** Slider Control

    **Bloom's Level:** Remember

---

#### 3. What is the purpose of the isRunning state pattern?

<div class="upper-alpha" markdown>
1. To measure animation speed
2. To control whether the animation updates or stays frozen
3. To track the number of frames drawn
4. To store slider values
</div>

??? question "Show Answer"
    The correct answer is **B**. The isRunning state is a boolean variable that controls whether your animation is active. When isRunning is true, physics and positions update; when false, the simulation freezes while still drawing the current state.

    **Concept Tested:** isRunning State

    **Bloom's Level:** Understand

---

#### 4. What happens when mousePressed() is called?

<div class="upper-alpha" markdown>
1. It runs continuously while the mouse button is held
2. It runs once when the user clicks
3. It runs when the mouse moves
4. It runs when the mouse button is released
</div>

??? question "Show Answer"
    The correct answer is **B**. The `mousePressed()` function runs exactly once when the user clicks the mouse button. For continuous action while dragging, use `mouseDragged()`. For detecting release, use `mouseReleased()`.

    **Concept Tested:** mousePressed()

    **Bloom's Level:** Remember

---

#### 5. How do you attach a callback function to a button?

<div class="upper-alpha" markdown>
1. button.onClick(function)
2. button.mousePressed(function)
3. button.callback(function)
4. button.trigger(function)
</div>

??? question "Show Answer"
    The correct answer is **B**. In p5.js, you use `button.mousePressed(callbackFunction)` to specify what happens when the button is clicked. The callback function runs once each time the button is pressed.

    **Concept Tested:** createButton(), Event Handlers

    **Bloom's Level:** Remember

---

#### 6. What is the difference between the Pause and Stop buttons?

<div class="upper-alpha" markdown>
1. They are identical in function
2. Pause freezes the animation in place; Stop halts and typically resets
3. Stop only affects sound; Pause affects visuals
4. Pause is for sliders; Stop is for buttons
</div>

??? question "Show Answer"
    The correct answer is **B**. The Pause button freezes the animation without resetting—users can resume from the same position. The Stop button halts the animation completely and typically resets values to the initial state.

    **Concept Tested:** Pause Button, Stop Button

    **Bloom's Level:** Understand

---

#### 7. Which variable provides the current horizontal mouse position?

<div class="upper-alpha" markdown>
1. mouse.x
2. mousePosition.x
3. mouseX
4. cursorX
</div>

??? question "Show Answer"
    The correct answer is **C**. p5.js provides `mouseX` and `mouseY` as built-in variables that always contain the current cursor position relative to the canvas. These update automatically every frame.

    **Concept Tested:** Mouse Events

    **Bloom's Level:** Remember

---

#### 8. What pattern should you use to detect if the user clicked on a circle?

<div class="upper-alpha" markdown>
1. Check if mouseX equals circle.x and mouseY equals circle.y
2. Use dist(mouseX, mouseY, circle.x, circle.y) < circle.radius
3. Use circle.clicked() method
4. Compare mouse position to canvas center
</div>

??? question "Show Answer"
    The correct answer is **B**. To detect if a click is on a circle, calculate the distance between the mouse position and the circle center using `dist()`, then check if it's less than the circle's radius. This correctly handles clicks anywhere inside the circle.

    **Concept Tested:** Mouse Events, Input Handling

    **Bloom's Level:** Apply

---

#### 9. Which key code constant represents the spacebar?

<div class="upper-alpha" markdown>
1. SPACE
2. SPACEBAR
3. 32
4. Both A and C (either works)
</div>

??? question "Show Answer"
    The correct answer is **D**. You can use either the numeric key code `32` or check if `key === ' '` (space character). There is no predefined SPACE constant, but checking `key === ' '` or `keyCode === 32` both work for detecting spacebar presses.

    **Concept Tested:** keyPressed(), Keyboard Events

    **Bloom's Level:** Remember

---

#### 10. What is the purpose of the Reset button in a MicroSim?

<div class="upper-alpha" markdown>
1. To exit the simulation
2. To save the current state
3. To return all variables and controls to their default values
4. To change the canvas size
</div>

??? question "Show Answer"
    The correct answer is **C**. The Reset button returns all simulation variables to their initial values and optionally resets sliders to their defaults. It allows users to start fresh without reloading the page.

    **Concept Tested:** Reset Button

    **Bloom's Level:** Understand

---

#### 11. What is a "speed multiplier" pattern used for?

<div class="upper-alpha" markdown>
1. To make the canvas resize faster
2. To allow users to adjust animation speed via a slider
3. To double the frame rate
4. To increase download speed
</div>

??? question "Show Answer"
    The correct answer is **B**. The speed multiplier pattern uses a slider value to scale all velocity calculations. For example, `ball.x += ball.vx * speedMultiplier` allows users to slow down or speed up the animation by adjusting the slider.

    **Concept Tested:** Speed Control

    **Bloom's Level:** Understand

---

#### 12. You want to toggle animation with the spacebar and reset with 'R'. Which code structure is correct?

<div class="upper-alpha" markdown>
1. Use mousePressed() for both actions
2. Use keyPressed() with if statements checking key values
3. Create buttons for each action
4. Use a slider to select the action
</div>

??? question "Show Answer"
    The correct answer is **B**. Keyboard shortcuts are implemented in the `keyPressed()` function using conditional statements: `if (key === ' ') { toggleRunning(); }` and `if (key === 'r' || key === 'R') { resetSimulation(); }`.

    **Concept Tested:** keyPressed(), Animation Control

    **Bloom's Level:** Apply

---

## Quiz Summary

**Concepts Tested:**

| Concept | Questions |
|---------|-----------|
| createSlider() | 1 |
| Slider Control | 2 |
| isRunning State | 3 |
| mousePressed() | 4 |
| createButton() | 5 |
| Event Handlers | 5 |
| Pause Button | 6 |
| Stop Button | 6 |
| Mouse Events | 7, 8 |
| Input Handling | 8 |
| keyPressed() | 9, 12 |
| Keyboard Events | 9 |
| Reset Button | 10 |
| Speed Control | 11 |
| Animation Control | 12 |

**Bloom's Taxonomy Distribution:**

- Remember: 6 questions (50%)
- Understand: 4 questions (33%)
- Apply: 2 questions (17%)
