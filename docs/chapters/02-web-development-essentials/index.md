---
title: Web Development Essentials
description: Essential web technologies and vocabulary for effective AI collaboration in MicroSim development.
generated_by: claude skill chapter-content-generator
date: 2025-11-25 15:00:00
version: 0.03
---
# Web Development Essentials

## Summary

This chapter covers the essential web technologies required to build and deploy MicroSims. You will learn the fundamentals of HTML for structuring web pages, CSS for styling, and JavaScript as the programming language that powers interactive simulations. The chapter also introduces the development environment including web browsers, developer tools, text editors, and version control systems like Git and GitHub for managing your code.

## Concepts Covered

This chapter covers the following 9 concepts from the learning graph:

1. JavaScript Basics
2. HTML Fundamentals
3. CSS Basics
4. Web Browser
5. Developer Tools
6. Text Editor
7. Version Control
8. Git
9. GitHub

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Educational MicroSims](../01-intro-to-educational-microsims/index.md)

---

## The Liberating Truth: You Don't Need to Be an Expert

Here is the best news you will hear in this entire course: **you do not need to become a web development expert to create amazing MicroSims**. You do not need to memorize syntax, master complex frameworks, or spend years learning the intricacies of browser rendering engines. What you need is something far more accessible and genuinely empowering—the vocabulary to communicate precisely with AI tools.

This distinction changes everything. In the past, creating interactive educational simulations required either deep technical expertise or expensive development resources. Today, with generative AI as your collaborator, the barrier has shifted from *knowing how to code* to *knowing how to describe what you want*. And that shift opens doors for educators everywhere.

Think of it like visiting a foreign country. You do not need to be fluent in the local language to navigate successfully. But knowing key phrases—how to ask for directions, order food, request help—transforms your experience from frustrating guesswork to confident exploration. Web development vocabulary works exactly the same way when collaborating with AI.

When your MicroSim has a button appearing in the wrong location, knowing whether to ask about "margin," "padding," "position," or "transform" determines whether you get an immediate solution or a confusing back-and-forth. When text overlaps with your simulation, understanding the difference between "z-index" and "overflow" helps you describe the problem precisely. This chapter gives you that vocabulary—not to make you a programmer, but to make you an effective communicator with AI tools that handle the technical details.

!!! tip "Your New Superpower"
    The vocabulary you learn in this chapter is your superpower. With the right words, you can describe any visual problem, any positioning issue, any functionality gap—and AI will help you solve it. You are learning to speak a language that unlocks unlimited creative possibilities.

## The Three Languages of the Web

Every MicroSim you create, and indeed every webpage you have ever visited, is built from three complementary technologies working in harmony. Understanding what each one does—and when to reference each in your prompts—is the foundation of effective AI collaboration.

| Technology | Purpose | What to Ask AI About |
|------------|---------|---------------------|
| **HTML** | Structure and content | Adding elements, organizing layout, embedding iframes |
| **CSS** | Appearance and styling | Colors, fonts, spacing, positioning, responsive design |
| **JavaScript** | Behavior and interactivity | Animation, user interaction, calculations, p5.js code |

When something goes wrong in your MicroSim, identifying which technology controls the problematic aspect helps you ask better questions. A slider in the wrong position? That is likely CSS or JavaScript canvas coordinates. Text not appearing? Could be HTML structure or JavaScript drawing commands. Animation too fast? Definitely JavaScript. This mental model of "which language handles what" is surprisingly powerful.

#### Diagram: The Three Languages Working Together

<details markdown="1">
    <summary>The Three Languages Working Together</summary>
    Type: diagram

    Bloom Taxonomy: Understand

    Learning Objective: Help learners understand how HTML, CSS, and JavaScript each contribute to a complete MicroSim and when to reference each technology

    Purpose: Show the relationship and responsibilities of web technologies

    Layout: Three overlapping circles (Venn diagram style) with center intersection

    Components:

    HTML circle (blue, left):
    - Title: "HTML - Structure"
    - Contains: "Elements", "Canvas container", "Iframe wrapper", "Document organization"
    - Icon: Building blocks

    CSS circle (green, right):
    - Title: "CSS - Style"
    - Contains: "Colors", "Layout", "Spacing", "Fonts", "Positioning"
    - Icon: Paint palette

    JavaScript circle (orange, bottom):
    - Title: "JavaScript - Behavior"
    - Contains: "Animation", "Interaction", "p5.js", "Logic", "Events"
    - Icon: Lightning bolt

    Overlap areas:
    - HTML + CSS: "Styled elements"
    - HTML + JavaScript: "DOM manipulation"
    - CSS + JavaScript: "Dynamic styling"
    - Center (all three): "Complete MicroSim"

    Connecting arrows with labels:
    - HTML → CSS: "CSS selects and styles HTML elements"
    - HTML → JavaScript: "JavaScript creates and manipulates HTML"
    - CSS ↔ JavaScript: "JavaScript can modify CSS; CSS affects canvas"

    Example callouts around the diagram:
    - Near HTML: "<canvas id='sim'>"
    - Near CSS: "width: 100%; border: none;"
    - Near JavaScript: "createCanvas(400, 450)"

    Color scheme: Blue (#4A90D9), Green (#5CB85C), Orange (#F0AD4E)

    Interactive features:
    - Hover over each circle to highlight its responsibilities
    - Click center to see how all three combine

    Implementation: SVG with CSS hover effects or p5.js interactive diagram
</details>

The beautiful thing about this three-language system is that you do not need to master any of them. You need to recognize them, understand their roles, and use their vocabulary when asking AI for help. That is a much more achievable goal—and one you will accomplish by the end of this chapter.

## HTML Fundamentals: The Skeleton of Your MicroSim

**HTML** (HyperText Markup Language) provides the structure of web pages. It defines what elements exist and how they are organized—like the skeleton that gives shape to a body. When you embed a MicroSim in a textbook page, HTML creates the container that holds it.

The wonderful news is that you will rarely write HTML from scratch for MicroSims. AI handles that work. But recognizing HTML helps you understand what you are looking at when troubleshooting and communicate changes effectively.

### HTML Elements You Will Encounter

HTML uses "tags" enclosed in angle brackets to define elements. Most elements have an opening tag and a closing tag:

```html
<div>This content is inside a div element</div>
<p>This is a paragraph element</p>
<h1>This is a heading element</h1>
```

The elements most relevant to MicroSims include:

- **`<div>`** — A generic container for grouping content (vocabulary: "wrapper," "container," "div")
- **`<canvas>`** — The drawing surface where p5.js renders all graphics
- **`<iframe>`** — Embeds one webpage inside another (how MicroSims appear in textbooks)
- **`<script>`** — Contains or links to JavaScript code
- **`<style>`** — Contains CSS styling rules
- **`<button>`** — Creates clickable buttons (though p5.js often creates its own)
- **`<input>`** — Creates form inputs like text fields

### The HTML Document Structure

Every HTML document follows a standard structure. You do not need to memorize this, but recognizing it helps you understand AI-generated code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My MicroSim</title>
    <style>
        /* CSS goes here */
    </style>
</head>
<body>
    <!-- Visible content goes here -->
    <main></main>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
    <script src="sketch.js"></script>
</body>
</html>
```

**Key HTML vocabulary for AI prompts:**

| What You Want | Vocabulary to Use |
|---------------|-------------------|
| Add something to the page info | "Add to the head section" |
| Add visible content | "Add to the body" |
| Group elements together | "Wrap in a div" or "Create a container" |
| Include the graphics library | "Add the p5.js script before my code" |
| Make it work on phones | "Set the viewport meta tag" |

### Embedding MicroSims with Iframes

The `<iframe>` element is how MicroSims appear inside textbook pages—it creates a window into another webpage. Understanding iframe attributes helps you request specific embedding behaviors:

```html
<iframe src="sims/pendulum/main.html"
        width="100%"
        height="450"
        style="border: none;"
        title="Pendulum simulation demonstrating period and length">
</iframe>
```

**Iframe vocabulary for AI prompts:**

| Attribute | What It Controls | Example Request |
|-----------|-----------------|-----------------|
| `src` | Which MicroSim to show | "Change the iframe src to point to the new location" |
| `width` | Horizontal size | "Make the iframe width 100% of its container" |
| `height` | Vertical size | "Set the iframe height to 500 pixels" |
| `style` | Appearance | "Remove the iframe border" |
| `title` | Accessibility label | "Add a descriptive title for screen readers" |

## CSS Basics: Making Things Look Right

**CSS** (Cascading Style Sheets) controls how HTML elements appear—their colors, sizes, positions, and spacing. When elements in your MicroSim are not where you want them or do not look right, CSS vocabulary is almost always what you need.

This is where precise vocabulary becomes genuinely powerful. The difference between knowing to ask about "margin" versus "padding" can save you thirty minutes of frustrating trial and error. CSS has its own logic, and once you understand the key concepts, you can describe virtually any visual problem to AI.

### CSS Syntax: Selectors, Properties, and Values

CSS rules follow a consistent, predictable pattern:

```css
selector {
    property: value;
    another-property: another-value;
}
```

The **selector** identifies which elements to style. The **property** specifies what aspect to change. The **value** defines the new setting.

```css
/* Style all paragraph elements */
p {
    color: navy;
    font-size: 16px;
}

/* Style elements with class="control-region" */
.control-region {
    background-color: white;
    padding: 10px;
}

/* Style the element with id="main-canvas" */
#main-canvas {
    border: 1px solid silver;
}
```

**Selector vocabulary for AI prompts:**

- "Style all divs" → element selector (`div`)
- "Style elements with the class 'controls'" → class selector (`.controls`)
- "Style the element with ID 'canvas-container'" → ID selector (`#canvas-container`)
- "Style the canvas inside the main element" → descendant selector (`main canvas`)

### The Box Model: Your Secret Weapon for Layout Problems

Every HTML element is a rectangular box with four layers that affect spacing. This is called the **box model**, and understanding it is genuinely transformative for fixing layout problems. Most positioning issues come down to these four properties.

#### Diagram: CSS Box Model Interactive

<details markdown="1">
    <summary>CSS Box Model Interactive</summary>
    Type: microsim

    Bloom Taxonomy: Understand

    Learning Objective: Help learners viscerally understand how margin, border, padding, and content interact to determine element size and spacing

    Canvas layout (550x500px):
    - Drawing region (550x380px): Interactive box model visualization
    - Control region (550x120px): Sliders and calculated values

    Visual elements in drawing region:
    - Nested rectangles showing the four layers:
        - Outermost: Margin area (transparent with orange dashed outline, labeled)
        - Next: Border (solid line, thickness varies)
        - Next: Padding area (light blue fill)
        - Center: Content area (darker blue fill with "Content" text)
    - Dimension labels showing current pixel values on each side
    - Arrows indicating each layer with color-coded labels
    - Total width calculation displayed prominently

    Interactive controls:
    - Slider: Margin (0-50px) with current value display
    - Slider: Border width (0-20px) with current value display
    - Slider: Padding (0-50px) with current value display
    - Slider: Content width (50-200px) with current value display
    - Live calculation: "Total width = content + (padding × 2) + (border × 2) + (margin × 2)"

    Default parameters:
    - Margin: 20px
    - Border: 3px
    - Padding: 15px
    - Content: 120px

    Behavior:
    - Adjusting any slider immediately updates visualization
    - Total width recalculates in real-time
    - Hovering over each region highlights it and shows tooltip with property name
    - Color coding matches common DevTools representations

    Color scheme:
    - Margin: Orange (#FFCC80) with dashed border
    - Border: Dark gray (#333)
    - Padding: Light green (#C8E6C9)
    - Content: Light blue (#BBDEFB)

    Educational purpose: Demonstrate why elements take up more space than their content width, making "why is there extra space?" questions easy to diagnose

    Implementation: p5.js with standard MicroSim layout
</details>

**Box model vocabulary for AI prompts:**

| Term | What It Controls | When to Say It |
|------|-----------------|----------------|
| `margin` | Space **outside** the element | "Add space between this element and others" |
| `padding` | Space **inside** the element | "Add space between the border and the content" |
| `border` | The visible edge | "Add a silver border around the canvas" |
| `width`/`height` | Content area size | "Make the container 400 pixels wide" |

The difference between margin and padding confuses many beginners, but there is a simple rule: **margin pushes other elements away; padding pushes content inward**. If you want space between two buttons, use margin. If you want space between a button's edge and its text, use padding.

### Positioning: The Key to Placing Elements Exactly Where You Want Them

CSS positioning is where vocabulary becomes absolutely critical. There are several positioning schemes, each with different behaviors. Using the wrong term leads AI down the wrong path.

```css
/* Static (default) - flows normally in document */
.element { position: static; }

/* Relative - offset from normal position */
.element {
    position: relative;
    top: 10px;    /* Move down 10px from where it would be */
    left: 20px;   /* Move right 20px from where it would be */
}

/* Absolute - positioned relative to nearest positioned ancestor */
.element {
    position: absolute;
    top: 0;       /* At the top of its container */
    right: 0;     /* At the right of its container */
}

/* Fixed - positioned relative to viewport, stays during scroll */
.element {
    position: fixed;
    bottom: 10px;
    right: 10px;
}
```

**Positioning vocabulary for AI prompts:**

| What You Want | What to Say |
|---------------|-------------|
| Button in corner of canvas | "Position absolute, top 0, right 0, inside the canvas container" |
| Keep controls visible when scrolling | "Position fixed at the bottom" |
| Move label slightly down | "Position relative with top 10px" |
| Center horizontally | "margin: 0 auto" or "use flexbox with justify-content center" |

### Flexbox: Modern Layout Made Delightfully Simple

**Flexbox** is a CSS layout system that makes centering and distributing elements straightforward. Before flexbox, centering things in CSS was notoriously difficult. Now it is trivially easy—if you know the vocabulary.

```css
.control-region {
    display: flex;                    /* Enable flexbox */
    justify-content: space-between;   /* Distribute horizontally */
    align-items: center;              /* Center vertically */
    gap: 10px;                        /* Space between items */
}
```

**Flexbox vocabulary for AI prompts:**

| What You Want | What to Say |
|---------------|-------------|
| Center everything | "display flex, justify-content center, align-items center" |
| Spread items evenly | "display flex, justify-content space-between" |
| Stack vertically | "display flex, flex-direction column" |
| Add space between items | "gap 15px" or "add gap between flex items" |

#### Diagram: Flexbox Layout Playground

<details markdown="1">
    <summary>Flexbox Layout Playground</summary>
    Type: microsim

    Bloom Taxonomy: Apply

    Learning Objective: Allow learners to experiment with flexbox properties and see immediate visual results, building intuition for layout vocabulary

    Canvas layout (600x500px):
    - Drawing region (600x350px): Visual demonstration of flexbox container with items
    - Control region (600x150px): Dropdowns and controls

    Visual elements in drawing region:
    - A container rectangle (the flex container) with visible border
    - 3-5 child boxes (flex items) of different sizes inside
    - Each child box labeled with a number
    - Visual indicators showing the effect of current settings
    - Arrows or spacing indicators showing distribution

    Interactive controls:
    - Dropdown: flex-direction (row, row-reverse, column, column-reverse)
    - Dropdown: justify-content (flex-start, flex-end, center, space-between, space-around, space-evenly)
    - Dropdown: align-items (flex-start, flex-end, center, stretch, baseline)
    - Slider: gap (0-30px)
    - Checkbox: flex-wrap (wrap / nowrap)
    - Button: Add item / Remove item

    Default parameters:
    - flex-direction: row
    - justify-content: flex-start
    - align-items: stretch
    - gap: 10px
    - 4 items

    Display panel showing:
    - Current CSS code that would produce this layout
    - Copy button to copy the CSS

    Behavior:
    - Changing any control immediately updates the visual
    - Items animate smoothly to new positions
    - CSS code panel updates in real-time
    - Tooltips explain each property on hover

    Educational purpose: Build intuition for flexbox by allowing experimentation, so learners can discover what each property does rather than memorizing definitions

    Implementation: p5.js with DOM elements for controls, or HTML/CSS with JavaScript
</details>

### Common CSS Properties Reference

Here are the properties you will reference most often. You do not need to memorize these—bookmark this page and refer back when crafting prompts:

| Property | Purpose | Example Values |
|----------|---------|---------------|
| `background-color` | Fill color | `white`, `aliceblue`, `#f0f0f0`, `rgb(240,240,240)` |
| `color` | Text color | `navy`, `#333333`, `rgb(50,50,50)` |
| `font-size` | Text size | `16px`, `1.2em`, `14pt` |
| `font-family` | Typeface | `Arial`, `monospace`, `sans-serif` |
| `width` / `height` | Dimensions | `400px`, `100%`, `auto`, `50vw` |
| `margin` | Outside spacing | `10px`, `0 auto`, `10px 20px 10px 20px` |
| `padding` | Inside spacing | `15px`, `10px 20px` |
| `border` | Edge styling | `1px solid silver`, `2px dashed blue`, `none` |
| `display` | Layout mode | `block`, `flex`, `none`, `inline-block` |
| `position` | Positioning scheme | `static`, `relative`, `absolute`, `fixed` |
| `overflow` | Content overflow | `hidden`, `scroll`, `auto`, `visible` |
| `z-index` | Stacking order | `1`, `10`, `100` (higher = on top) |

## JavaScript Basics: Bringing MicroSims to Life

**JavaScript** is the programming language that makes web pages interactive. Every MicroSim relies on JavaScript—specifically the p5.js library—to create animations, respond to user input, and perform calculations. Chapter 1 introduced programming fundamentals; this section focuses on JavaScript-specific vocabulary you need for effective AI communication.

The encouraging truth: you do not need to write JavaScript from scratch. You need to recognize it, understand its structure, and use its vocabulary when asking AI to create or modify functionality. That is a much more achievable goal.

### Variables and Data Types

JavaScript variables are declared using `let`, `const`, or `var`:

```javascript
let speed = 5;              // Can be changed later
const GRAVITY = 9.8;        // Cannot be changed (constant)
var oldStyle = "legacy";    // Older syntax, still works
```

JavaScript has several data types you will encounter:

```javascript
// Numbers - for calculations and positions
let count = 42;
let velocity = 3.14;

// Strings - for text and labels
let title = "Bouncing Ball";
let label = 'Speed:';

// Booleans - for true/false states
let isRunning = true;
let isPaused = false;

// Arrays - for lists of things
let colors = ['red', 'green', 'blue'];
let positions = [100, 200, 150];

// Objects - for structured data with properties
let ball = {
    x: 200,
    y: 100,
    radius: 15,
    color: 'steelblue'
};
```

**JavaScript vocabulary for AI prompts:**

- "Store the slider value in a variable"
- "Create an array of particle objects"
- "Use a constant for the maximum speed"
- "Access the ball's x property" → `ball.x`
- "Check if isRunning is true"

### Functions: Bundled Actions

Functions group code for reuse. JavaScript offers several syntax styles—do not worry about memorizing them, just recognize them:

```javascript
// Function declaration - the most common form
function updatePosition() {
    x += velocity;
}

// Function with parameters and return value
function calculateDistance(x1, y1, x2, y2) {
    return sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2));
}

// Arrow function - compact modern syntax
const double = (n) => n * 2;

// Callback function - passed to another function
button.mousePressed(() => {
    isRunning = !isRunning;
});
```

**Function vocabulary for AI prompts:**

- "Create a function that resets the simulation"
- "Add a callback for when the button is clicked"
- "Make the function return the calculated value"
- "Pass the slider value as a parameter"

### Event Handling: Responding to Users

JavaScript responds to user actions through events. In MicroSims, you will encounter:

```javascript
// p5.js built-in event functions
function mousePressed() {
    // Runs when mouse button is pressed anywhere on canvas
}

function keyPressed() {
    if (key === ' ') {
        isRunning = !isRunning;  // Space bar toggles pause
    }
}

function mouseDragged() {
    // Runs continuously while mouse moves with button held
}

// DOM element events - for sliders, buttons, etc.
slider.input(() => {
    speed = slider.value();
});

button.mousePressed(() => {
    resetSimulation();
});
```

**Event vocabulary for AI prompts:**

- "Run this code when the user clicks the canvas"
- "Detect when the spacebar is pressed"
- "Update the display whenever the slider changes"
- "Trigger reset when the button is clicked"
- "Call this function on mouse drag"

### The p5.js Connection

The p5.js library provides JavaScript functions specifically for creative coding and simulations. Here are the p5.js concepts you will reference most often:

```javascript
// Creating UI elements
let slider = createSlider(0, 100, 50);    // min, max, default
let button = createButton('Start');
let checkbox = createCheckbox('Show grid', false);

// Positioning UI elements
slider.position(120, drawHeight + 15);
slider.size(200);

// Drawing shapes
circle(x, y, diameter);
rect(x, y, width, height);
line(x1, y1, x2, y2);
ellipse(x, y, width, height);
triangle(x1, y1, x2, y2, x3, y3);

// Colors and styles
fill('steelblue');        // Inside color
stroke('navy');           // Outline color
noFill();                 // Transparent inside
noStroke();               // No outline
strokeWeight(2);          // Outline thickness

// Text
textSize(16);
textAlign(CENTER, CENTER);
text('Hello', x, y);
```

#### Diagram: p5.js Function Quick Reference

<details markdown="1">
    <summary>p5.js Function Quick Reference</summary>
    Type: infographic

    Bloom Taxonomy: Remember

    Learning Objective: Provide a visual quick-reference for commonly used p5.js functions, organized by category for easy lookup when crafting AI prompts

    Purpose: Reduce cognitive load by organizing p5.js vocabulary into memorable categories

    Layout: Grid of 6 color-coded cards, each representing a function category

    Card 1 - Canvas & Setup (Blue #4A90D9):
    - createCanvas(width, height)
    - background(color)
    - resizeCanvas(width, height)
    - describe(text) - accessibility
    - frameRate(fps)

    Card 2 - Shapes (Green #5CB85C):
    - circle(x, y, diameter)
    - rect(x, y, width, height)
    - ellipse(x, y, width, height)
    - line(x1, y1, x2, y2)
    - triangle(x1, y1, x2, y2, x3, y3)
    - arc(x, y, w, h, start, stop)

    Card 3 - Colors & Styles (Orange #F0AD4E):
    - fill(color)
    - stroke(color)
    - noFill()
    - noStroke()
    - strokeWeight(pixels)
    - background(color)

    Card 4 - Text (Purple #9B59B6):
    - text(string, x, y)
    - textSize(pixels)
    - textAlign(horizontal, vertical)
    - textFont(font)

    Card 5 - UI Controls (Red #E74C3C):
    - createSlider(min, max, value, step)
    - createButton(label)
    - createCheckbox(label, checked)
    - createSelect()
    - element.position(x, y)
    - element.size(width)

    Card 6 - Transforms (Teal #1ABC9C):
    - push() / pop()
    - translate(x, y)
    - rotate(angle)
    - scale(factor)

    Interactive features:
    - Hover over any function to see parameter details
    - Click function to copy to clipboard
    - Search/filter box to find functions

    Visual style:
    - Card-based grid with rounded corners
    - Consistent iconography per category
    - Monospace font for function names
    - Color-coded borders matching category

    Implementation: HTML/CSS grid with JavaScript hover effects
</details>

## Development Tools: Your MicroSim Workshop

Creating MicroSims requires more than understanding languages—you need tools to write, test, and manage your code. The good news is that these tools are free, powerful, and designed to help you succeed.

### Web Browsers: More Than Just Viewing

A **web browser** is both where your MicroSims run and where you debug them. Modern browsers include powerful built-in development tools that professionals use every day.

The major browsers for development:

- **Google Chrome** — Most popular, excellent developer tools, extensive documentation
- **Mozilla Firefox** — Strong privacy focus, equally good developer tools
- **Microsoft Edge** — Chrome-based, well-integrated with Windows
- **Safari** — Required for testing on Apple devices

For MicroSim development, Chrome is recommended due to its ubiquitous developer tools and the abundance of tutorials available. However, your MicroSims should work in all modern browsers—always test in more than one.

### Developer Tools: Your Debugging Superpower

**Developer Tools** (often called DevTools or F12 tools) are built into every modern browser. They let you inspect HTML structure, view and modify CSS styles, debug JavaScript, and monitor what is happening behind the scenes. Learning to use DevTools transforms debugging from guesswork to systematic problem-solving.

**To open Developer Tools:**

- **Windows/Linux:** Press `F12` or `Ctrl+Shift+I`
- **Mac:** Press `Cmd+Option+I`
- **Any platform:** Right-click anywhere and select "Inspect"

The most useful DevTools panels for MicroSim development:

| Panel | What It Does | When to Use It |
|-------|--------------|----------------|
| **Elements** | Shows HTML structure and CSS styles | Finding why elements are positioned wrong |
| **Console** | Shows JavaScript output and errors | Seeing error messages and debug output |
| **Sources** | Shows JavaScript files | Setting breakpoints, stepping through code |
| **Network** | Shows file loading | Checking if scripts and resources load |

#### Diagram: Browser Developer Tools Walkthrough

<details markdown="1">
    <summary>Browser Developer Tools Walkthrough</summary>
    Type: microsim

    Bloom Taxonomy: Apply

    Learning Objective: Familiarize learners with browser developer tools through an interactive simulation that mimics the DevTools interface, reducing intimidation

    Canvas layout (850x550px):
    - Left panel (500x550px): Simulated webpage with a simple MicroSim
    - Right panel (350x550px): Simulated DevTools interface

    Visual elements in webpage panel:
    - A simple bouncing ball MicroSim running
    - HTML elements with visible boundaries when hovered
    - Intentional visual "bug" (element positioned incorrectly)
    - Click targets that interact with DevTools panel

    Visual elements in DevTools panel:
    - Tab bar: Elements | Console | Sources
    - Elements view: Simplified HTML tree with expandable nodes
    - Styles panel: CSS properties for selected element
    - Console view: Shows console.log output and any errors

    Interactive walkthrough (guided tour):
    1. "Click on the canvas to select it" → highlights in Elements panel
    2. "Look at the Styles panel to see its CSS"
    3. "Find the 'overflow: hidden' property causing clipping"
    4. "Click the checkbox to disable it and see the fix"

    Challenge mode (after tutorial):
    - Present a visual bug
    - User must find and fix it using simulated DevTools
    - Provide hints if stuck

    Elements panel features:
    - Click element in tree → highlights on page
    - Click element on page → selects in tree
    - Expandable/collapsible nodes

    Styles panel features:
    - Checkboxes to enable/disable properties
    - Editable values (click to change)
    - Crossed-out overridden styles

    Console panel features:
    - Shows console.log messages from the simulation
    - Error messages appear in red
    - Clickable links to source locations

    Educational purpose: Build confidence with DevTools in a safe, guided environment before using real browser tools

    Implementation: p5.js with custom UI panels mimicking Chrome DevTools appearance
</details>

**DevTools vocabulary for AI prompts:**

- "The console shows an error about undefined variable"
- "When I inspect the element, I see the margin is being overridden"
- "The network tab shows the script is not loading (404 error)"
- "In the Elements panel, I can see the CSS is not being applied"

### The Console: Your Communication Channel

The browser console is where you see JavaScript output and errors. Learning to read console messages accelerates debugging significantly—and helps you describe problems precisely to AI.

```javascript
// Output messages to console
console.log('Ball position:', x, y);           // General information (gray)
console.warn('Speed is very high:', speed);     // Warning (yellow)
console.error('Cannot divide by zero');         // Error (red)

// Check the type of a variable
console.log(typeof speed);  // "number"
console.log(typeof title);  // "string"
```

**Common console errors and what they mean:**

| Error Message | Likely Cause | How to Describe It |
|--------------|--------------|-------------------|
| `ReferenceError: x is not defined` | Using variable before declaring it | "The variable isn't declared yet" |
| `TypeError: Cannot read property of undefined` | Accessing property of non-existent object | "The object doesn't exist when I try to use it" |
| `SyntaxError: Unexpected token` | Typo in code | "There's a syntax error—maybe missing bracket or quote" |

### Text Editors: Where You Write Code

A **text editor** is the application where you write and edit code. While you could use Notepad, specialized code editors provide features that make development faster and catch errors before you run your code.

**Recommended text editors for MicroSim development:**

- **Visual Studio Code (VS Code)** — Free, powerful, enormous extension library (recommended)
- **Sublime Text** — Fast, lightweight, elegant
- **Cursor** — AI-enhanced editor built on VS Code
- **p5.js Web Editor** — Browser-based, no installation, great for quick experiments

**VS Code is recommended** for most developers due to:

- **Syntax highlighting** — Code is color-coded by type, making it easier to read
- **Auto-completion** — Suggests completions as you type
- **Error detection** — Highlights problems before you run code
- **Integrated terminal** — Run commands without switching windows
- **Git integration** — Version control built right in
- **Live Server extension** — Preview MicroSims with auto-refresh on save

**Text editor vocabulary for AI prompts:**

- "Enable auto-save in VS Code"
- "Install the Live Server extension"
- "The editor shows a syntax error on line 45"
- "Format the code to fix indentation"

### The p5.js Web Editor: Instant Gratification

For learning and quick experiments, the **p5.js Web Editor** (editor.p5js.org) provides an excellent zero-setup environment:

- **No installation required** — Works entirely in your browser
- **Instant preview** — See results as you type
- **Easy sharing** — Share your work via URL
- **Built-in examples** — Learn from working code
- **Auto-save** — Your work is preserved automatically

When asking AI to create a MicroSim, you can specify: "Make sure this code works in the p5.js web editor without modification." This ensures the generated code is self-contained and immediately testable.

## Version Control: Your Safety Net and Time Machine

**Version control** is a system for tracking changes to files over time. It lets you save snapshots of your work, experiment safely knowing you can undo anything, and collaborate with others without chaos. For MicroSim development, version control is your safety net.

### Why Version Control Matters

Without version control, you might:

- Accidentally delete working code with no way to recover
- Lose track of what changes you made and why
- Create files named `simulation_final_v2_REAL_final.js`
- Struggle to collaborate with others on the same project
- Have no backup if your computer fails

With version control, you can:

- Return to any previous version of your work instantly
- Experiment freely, knowing you can always undo
- See exactly what changed between versions
- Collaborate without overwriting each other's work
- Maintain a complete history of your project's evolution

### Git: The Industry Standard

**Git** is the most widely used version control system in the world. Created by Linus Torvalds (who also created Linux), Git tracks changes to files in a "repository" and allows multiple people to work on the same project simultaneously.

**Key Git concepts:**

- **Repository (repo)** — A folder tracked by Git, containing your project and its complete history
- **Commit** — A snapshot of your project at a specific point in time, with a message describing what changed
- **Branch** — A parallel version of your project for experimenting without affecting the main code
- **Merge** — Combining changes from different branches back together
- **Clone** — Creating a local copy of a remote repository
- **Push** — Sending your local commits to a remote repository
- **Pull** — Getting updates from a remote repository to your local copy

#### Diagram: Git Workflow Visualization

<details markdown="1">
    <summary>Git Workflow Visualization</summary>
    Type: workflow

    Bloom Taxonomy: Understand

    Learning Objective: Visualize the typical Git workflow for MicroSim development, showing how code moves between working directory, staging, local repository, and remote

    Visual style: Horizontal flowchart with icons and bidirectional arrows

    Main flow (left to right):

    1. "Working Directory" (folder icon)
       - Your local files where you edit code
       - Color: Light blue
       - Hover: "The actual files on your computer that you edit"

    2. Arrow: "git add" →

    3. "Staging Area" (clipboard icon)
       - Files prepared for the next commit
       - Color: Light orange
       - Hover: "A holding area for changes you want to include in the next snapshot"

    4. Arrow: "git commit" →

    5. "Local Repository" (database icon)
       - Committed snapshots stored on your machine
       - Color: Light green
       - Hover: "The complete history of your project, stored locally"

    6. Arrow: "git push" →

    7. "Remote Repository" (cloud icon with GitHub logo)
       - Shared repository on GitHub
       - Color: Light purple
       - Hover: "Your project hosted online, accessible to collaborators"

    Reverse flow (dashed arrows):
    - "git pull" arrow from Remote → Local
    - "git checkout" arrow from Local → Working Directory
    - "git stash" arrow from Working → temporary storage

    Branch visualization (below main flow):
    - Main branch shown as horizontal line
    - Feature branch diverging and later merging back
    - Labels: "main", "feature/add-slider"
    - Commit dots along each branch

    Color coding:
    - Blue: Local operations
    - Green: Repository states
    - Purple: Remote operations
    - Orange: Staging/transition

    Interactive elements:
    - Hover over each stage for detailed explanation
    - Click on arrows to see example commands

    Implementation: SVG with CSS hover effects or Mermaid.js
</details>

### Essential Git Commands

You do not need to memorize these commands—AI can help you use them. But knowing what they do helps you ask for the right thing:

```bash
# Initialize a new repository
git init

# See what files have changed
git status

# Stage files for commit
git add sketch.js          # Add specific file
git add .                  # Add all changed files

# Save a snapshot with descriptive message
git commit -m "Add slider to control ball speed"

# See commit history
git log --oneline

# Connect to a remote repository
git remote add origin https://github.com/username/microsims.git

# Send commits to remote
git push origin main

# Get updates from remote
git pull origin main

# Create and switch to a new branch
git checkout -b feature/new-control

# Switch to existing branch
git checkout main

# Merge another branch into current
git merge feature/new-control
```

**Git vocabulary for AI prompts:**

- "How do I undo my last commit?"
- "Create a new branch for this feature"
- "I have merge conflicts—how do I resolve them?"
- "Push my changes to the remote repository"
- "Show me the differences between my version and the remote"

### GitHub: Your MicroSim Home on the Web

**GitHub** is a web platform that hosts Git repositories and adds powerful collaboration features. For MicroSim development, GitHub provides:

- **Free hosting** for unlimited public repositories
- **GitHub Pages** — Free web hosting for your MicroSim sites (this is huge!)
- **Issue tracking** — Manage bugs and feature requests
- **Pull requests** — Propose and review changes collaboratively
- **Actions** — Automated testing and deployment

The MicroSims in this course are hosted on GitHub and deployed via GitHub Pages. This workflow is remarkably simple:

1. Edit MicroSim code locally
2. Commit and push to GitHub
3. GitHub Pages automatically deploys the updated site
4. Students access your MicroSims at a public URL

#### Diagram: GitHub Pages Deployment Workflow

<details markdown="1">
    <summary>GitHub Pages Deployment Workflow</summary>
    Type: workflow

    Bloom Taxonomy: Understand

    Learning Objective: Show how MicroSims get from local development to public website via GitHub Pages, demystifying deployment

    Visual style: Horizontal flow with icons and time indicators

    Steps:

    1. Start: "Edit MicroSim Locally"
       Icon: VS Code editor
       Hover: "Modify code in your text editor"
       Color: Blue

    2. Process: "Test in Browser"
       Icon: Browser window with play button
       Hover: "Preview with Live Server or open HTML directly"
       Color: Blue

    3. Process: "Stage and Commit"
       Icon: Checkpoint/save icon
       Hover: "git add . && git commit -m 'message'"
       Color: Orange

    4. Process: "Push to GitHub"
       Icon: Upload arrow to cloud
       Hover: "git push origin main"
       Color: Orange

    5. Process: "GitHub Actions Runs"
       Icon: Gear/automation
       Hover: "Automated build process runs (MkDocs, etc.)"
       Color: Purple
       Note: "Automatic - no action needed"

    6. Process: "Deploy to GitHub Pages"
       Icon: Rocket launching
       Hover: "Built site published to gh-pages branch"
       Color: Purple
       Note: "Automatic - no action needed"

    7. End: "Live MicroSim Site!"
       Icon: Globe with checkmark
       Hover: "Accessible at username.github.io/repo"
       Color: Green
       Celebration indicator

    Time annotation:
    - "Your work: 2 minutes" spanning steps 1-4
    - "Automatic: 1-2 minutes" spanning steps 5-7

    Total time callout: "From edit to live: under 5 minutes!"

    Color coding legend:
    - Blue: Local development
    - Orange: Git operations
    - Purple: GitHub automation
    - Green: Public result

    Implementation: Mermaid.js or custom SVG with animations
</details>

**GitHub vocabulary for AI prompts:**

- "Create a new repository on GitHub"
- "Set up GitHub Pages for this repository"
- "Clone the repository to my local machine"
- "Create a pull request with my changes"
- "The GitHub Actions workflow is failing—what's wrong?"

## Putting Vocabulary into Practice: Your Secret Weapon

The entire purpose of this chapter is to give you the vocabulary for effective AI communication. Let us see how this vocabulary transforms your ability to solve problems and get exactly what you want.

### Before: Vague Requests That Lead Nowhere

Without proper vocabulary, requests to AI sound like:

> "The slider is in the wrong place. Fix it."

> "The text is messed up. Make it look better."

> "Something is broken. Help."

These vague requests force AI to guess what you mean, leading to frustrating exchanges where you get something other than what you wanted.

### After: Precise Requests That Get Results

With vocabulary from this chapter, the same problems become clear, actionable requests:

> "The slider is positioned using absolute coordinates but appears outside the canvas. Position it relative to drawHeight in the control region, with left margin of 120 pixels."

> "The label text is overlapping with the slider. Add a left margin of 10 pixels to the slider, and set the label's textAlign to LEFT so it doesn't overflow into the slider space."

> "The console shows 'speedSlider is not defined' on line 45. I'm accessing the slider before it's created in setup(). Either move the slider creation earlier, or access slider.value() inside the draw() function instead of globally."

The difference is night and day. Precise vocabulary leads to precise solutions.

#### Diagram: Vocabulary-Driven Problem Solving

<details markdown="1">
    <summary>Vocabulary-Driven Problem Solving</summary>
    Type: chart

    Chart type: Comparison table with visual indicators

    Bloom Taxonomy: Apply

    Learning Objective: Show how vocabulary transforms vague problems into actionable AI prompts, building confidence in problem description

    Purpose: Provide a reference showing symptom → vocabulary → example prompt

    Format: Three-column table with icons

    Column headers:
    - What You See (with eye icon)
    - Vocabulary to Use (with lightbulb icon)
    - Example AI Prompt (with chat bubble icon)

    Rows:

    1. Element in wrong position
       - margin, padding, position, absolute, relative, top, left, right, bottom
       - "Change the button from position absolute to relative, and add top margin of 10px"

    2. Elements overlapping
       - z-index, overflow, position, stacking context
       - "Increase the z-index of the canvas to render it above the control div"

    3. Text too small or too large
       - font-size, textSize(), px, em
       - "Set textSize(14) in draw() before rendering the labels"

    4. Colors wrong or invisible
       - fill(), stroke(), background, color, hex, rgb, noFill(), noStroke()
       - "Add fill('black') before the text() call—currently text color matches background"

    5. Animation choppy or inconsistent
       - frameRate(), deltaTime, frameCount
       - "Multiply velocity by deltaTime to make animation frame-rate independent"

    6. Slider doesn't affect anything
       - slider.value(), .input(), callback, event handler
       - "Read slider.value() inside draw(), not just once in setup()"

    7. Code doesn't run at all
       - console error, undefined, syntax error, ReferenceError
       - "Console shows 'ball is undefined'—declare ball variable before setup()"

    8. Elements cut off or hidden
       - overflow, clip, boundary check
       - "Set overflow: visible on the container, or check canvas boundary calculations"

    Visual styling:
    - Alternating row colors for readability
    - Icon for each symptom type
    - Monospace font for vocabulary terms
    - Copy button for each example prompt

    Implementation: Styled HTML table or markdown table with CSS
</details>

### Practice: Translating Problems to Prompts

Here is a quick exercise to practice your new vocabulary. For each problem, write an AI prompt using appropriate technical terms:

**Problem 1:** "The ball disappears off the edge and never comes back"

**Your improved prompt:** _____

**Problem 2:** "I can't see the text labels anywhere"

**Your improved prompt:** _____

**Problem 3:** "The Reset button doesn't do anything when I click it"

**Your improved prompt:** _____

??? note "Sample Answers (Click to Reveal)"
    **Problem 1:** "Add boundary checking in the updateBall function: when ballX exceeds canvasWidth minus the ball radius, reverse velocityX and clamp ballX to stay within bounds. Same for ballY with canvasHeight."

    **Problem 2:** "The text might be invisible for several reasons: check if fill() is set before text() calls (text uses fill color, not stroke). Also verify textSize is set to something visible like 14, and that the x,y coordinates place text within the canvas bounds."

    **Problem 3:** "The button needs a mousePressed callback. Add: resetButton.mousePressed(resetSimulation); after creating the button, where resetSimulation is a function that sets ball position and velocity back to initial values."

## Summary

This chapter equipped you with the vocabulary for effective AI collaboration in MicroSim development—not to make you a web development expert, but to make you a confident communicator who can get exactly what you need.

**HTML fundamentals**: Structure web pages using elements like `<div>`, `<canvas>`, and `<iframe>`. Recognize document structure and embedding patterns.

**CSS basics**: Control appearance with selectors, properties, and values. Master the box model vocabulary (margin, padding, border) and positioning terms (relative, absolute, fixed, flexbox).

**JavaScript basics**: Recognize syntax for variables, functions, and events. Understand how p5.js extends JavaScript for creative coding.

**Development tools**: Use web browsers and Developer Tools to inspect and debug. Choose a text editor like VS Code for efficient coding. Leverage the p5.js Web Editor for instant experimentation.

**Version control with Git and GitHub**: Track changes safely, collaborate effectively, and deploy MicroSims to the web via GitHub Pages.

The key insight: **You don't need to memorize syntax—you need to know the right words.** When you can describe a layout problem using terms like "margin," "padding," "z-index," and "flexbox," AI becomes a powerful partner that handles the technical details while you focus on creating educational experiences.

## Key Takeaways

- You do NOT need to be a web development expert—you need vocabulary for effective AI communication
- HTML provides structure, CSS provides style, JavaScript provides behavior
- The CSS box model (margin, padding, border, content) explains most spacing and positioning issues
- Precise problem descriptions using technical vocabulary lead to immediate, correct AI solutions
- Browser Developer Tools let you inspect elements and see exactly what CSS is applied
- Git tracks your changes; GitHub hosts your code and deploys your sites automatically
- When something looks wrong, first identify which technology controls it (HTML, CSS, or JavaScript)
- The p5.js Web Editor provides instant feedback—perfect for testing AI-generated code
- Your vocabulary is your superpower: the right words unlock unlimited creative possibilities

You are now equipped to communicate with AI tools at a professional level. The simulations you will create are limited only by your imagination—the technical barriers have fallen. Let us build something amazing.
