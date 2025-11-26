# Chapter 2 Quiz: Web Development Essentials

Test your understanding of web development vocabulary and concepts essential for MicroSim development and effective AI collaboration.

**Instructions:** Select the best answer for each question. After answering, click "Show Answer" to check your response and read the explanation.

---

#### 1. What are the three core technologies that make up every webpage?

<div class="upper-alpha" markdown>
1. Python, Java, and C++
2. HTML, CSS, and JavaScript
3. Git, GitHub, and VS Code
4. Chrome, Firefox, and Safari
</div>

??? question "Show Answer"
    The correct answer is **B**. Every webpage is built from HTML (structure and content), CSS (appearance and styling), and JavaScript (behavior and interactivity). These three technologies work together in harmony to create complete web experiences.

    **Concept Tested:** HTML Fundamentals, CSS Basics, JavaScript Basics

    **Bloom's Level:** Remember

---

#### 2. What is the primary purpose of HTML in web development?

<div class="upper-alpha" markdown>
1. Creating animations and interactive behaviors
2. Controlling colors, fonts, and spacing
3. Providing structure and content organization
4. Managing version control for projects
</div>

??? question "Show Answer"
    The correct answer is **C**. HTML (HyperText Markup Language) provides the structure of web pages, defining what elements exist and how they are organized. It is like the skeleton that gives shape to a body.

    **Concept Tested:** HTML Fundamentals

    **Bloom's Level:** Remember

---

#### 3. In CSS, what is the difference between margin and padding?

<div class="upper-alpha" markdown>
1. Margin is for text; padding is for images
2. Margin pushes other elements away; padding pushes content inward
3. Margin is measured in pixels; padding uses percentages
4. Margin applies to the border; padding applies to the background
</div>

??? question "Show Answer"
    The correct answer is **B**. Margin creates space outside an element (pushing other elements away), while padding creates space inside an element (pushing content inward from the border). If you want space between two buttons, use margin. If you want space between a button's edge and its text, use padding.

    **Concept Tested:** CSS Basics

    **Bloom's Level:** Understand

---

#### 4. Which HTML element is used to embed a MicroSim within a textbook page?

<div class="upper-alpha" markdown>
1. `<div>`
2. `<canvas>`
3. `<iframe>`
4. `<script>`
</div>

??? question "Show Answer"
    The correct answer is **C**. The `<iframe>` element creates a window into another webpage, which is how MicroSims appear inside textbook pages. It allows embedding one complete webpage inside another.

    **Concept Tested:** HTML Fundamentals

    **Bloom's Level:** Remember

---

#### 5. What is the purpose of browser Developer Tools (DevTools)?

<div class="upper-alpha" markdown>
1. To create new JavaScript code automatically
2. To inspect HTML, modify CSS, and debug JavaScript
3. To host websites on the internet
4. To convert images to different formats
</div>

??? question "Show Answer"
    The correct answer is **B**. Developer Tools are built into every modern browser and allow you to inspect HTML structure, view and modify CSS styles, debug JavaScript, and monitor network activity. They transform debugging from guesswork to systematic problem-solving.

    **Concept Tested:** Developer Tools

    **Bloom's Level:** Understand

---

#### 6. When a slider in your MicroSim doesn't affect the simulation, which vocabulary should you use in your AI prompt?

<div class="upper-alpha" markdown>
1. margin, padding, position
2. slider.value(), .input(), callback, event handler
3. createElement, appendChild, innerHTML
4. git commit, git push, merge
</div>

??? question "Show Answer"
    The correct answer is **B**. When a slider doesn't affect anything, the issue is typically that the slider's value isn't being read properly. You should ask AI about `slider.value()`, `.input()` callbacks, and event handlers. A common fix is to read `slider.value()` inside `draw()` rather than just once in `setup()`.

    **Concept Tested:** JavaScript Basics

    **Bloom's Level:** Apply

---

#### 7. What does a Git "commit" represent?

<div class="upper-alpha" markdown>
1. Deleting files from your project
2. A snapshot of your project at a specific point in time
3. Uploading files to a web server
4. Running code in the browser
</div>

??? question "Show Answer"
    The correct answer is **B**. A commit is a snapshot of your project at a specific point in time, with a message describing what changed. Commits create a complete history of your project's evolution, allowing you to return to any previous version.

    **Concept Tested:** Git

    **Bloom's Level:** Remember

---

#### 8. Why is vocabulary described as a "superpower" for MicroSim development?

<div class="upper-alpha" markdown>
1. It allows you to memorize all programming syntax
2. It enables precise communication with AI tools that handle technical details
3. It replaces the need for testing your code
4. It automatically generates complete MicroSims
</div>

??? question "Show Answer"
    The correct answer is **B**. Knowing the right vocabulary enables precise communication with AI tools, allowing you to describe any visual problem, positioning issue, or functionality gap clearly. AI then handles the technical implementation details while you focus on the educational design.

    **Concept Tested:** JavaScript Basics

    **Bloom's Level:** Understand

---

#### 9. What is the CSS property "z-index" used for?

<div class="upper-alpha" markdown>
1. Setting the horizontal position of an element
2. Controlling the stacking order of overlapping elements
3. Adjusting the zoom level of the page
4. Defining the font size for text
</div>

??? question "Show Answer"
    The correct answer is **B**. The z-index property controls the stacking order of overlapping elements. Elements with higher z-index values appear on top of elements with lower values. This is crucial when elements overlap incorrectly in your MicroSim.

    **Concept Tested:** CSS Basics

    **Bloom's Level:** Remember

---

#### 10. A console error shows "ReferenceError: ballX is not defined". What does this error mean?

<div class="upper-alpha" markdown>
1. The variable ballX has the wrong value
2. The variable ballX is being used before it was declared
3. The ballX object is missing a property
4. The function ballX failed to execute
</div>

??? question "Show Answer"
    The correct answer is **B**. A ReferenceError with "is not defined" indicates that you're trying to use a variable before it has been declared. You need to declare the variable (using `let`, `const`, or `var`) before you can use it.

    **Concept Tested:** JavaScript Basics

    **Bloom's Level:** Understand

---

#### 11. You need to center several control buttons horizontally. Which CSS approach should you request?

<div class="upper-alpha" markdown>
1. position: absolute with left: 50%
2. display: flex with justify-content: center
3. margin-top: auto
4. text-align: center on the buttons
</div>

??? question "Show Answer"
    The correct answer is **B**. Flexbox with `display: flex` and `justify-content: center` is the modern, reliable way to center elements horizontally. This approach handles multiple items and spacing cleanly, without the complexity of absolute positioning calculations.

    **Concept Tested:** CSS Basics

    **Bloom's Level:** Apply

---

#### 12. How does GitHub Pages benefit MicroSim development?

<div class="upper-alpha" markdown>
1. It provides free code editing in the browser
2. It automatically hosts your site publicly after you push changes
3. It converts JavaScript to Python for compatibility
4. It generates AI-powered simulations automatically
</div>

??? question "Show Answer"
    The correct answer is **B**. GitHub Pages provides free web hosting that automatically deploys your site when you push changes to GitHub. This means you can edit locally, commit and push, and within minutes your updated MicroSims are live at a public URL for students to access.

    **Concept Tested:** GitHub

    **Bloom's Level:** Analyze

---

## Quiz Summary

**Concepts Tested:**

| Concept | Questions |
|---------|-----------|
| HTML Fundamentals | 1, 2, 4 |
| CSS Basics | 1, 3, 9, 11 |
| JavaScript Basics | 1, 6, 8, 10 |
| Developer Tools | 5 |
| Git | 7 |
| GitHub | 12 |

**Bloom's Taxonomy Distribution:**

- Remember: 5 questions (42%)
- Understand: 4 questions (33%)
- Apply: 2 questions (17%)
- Analyze: 1 question (8%)
