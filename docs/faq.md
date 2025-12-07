# Creating Educational MicroSims with Generative AI - FAQ

This FAQ provides answers to frequently asked questions about the course, MicroSim development, and related technologies. Questions are organized by category and aligned with Bloom's Taxonomy cognitive levels.

**Total Questions:** 87

---

## Getting Started

### What is this course about?

This 14-week undergraduate course teaches you how to use generative AI to create educational interactive web-based simulations called MicroSims. You'll learn to leverage AI tools like ChatGPT and Claude to generate, refine, and debug simulation code while applying pedagogical principles to ensure your simulations are educationally effective, accessible, and engaging.

See [Course Description](course-description.md) for complete details.

### Who is this course designed for?

This course is designed for teachers, educators, and instructional designers who want to create interactive learning experiences. You don't need to be a professional programmer—basic familiarity with programming concepts like variables, loops, and functions is helpful, and knowledge of any programming language (Python, JavaScript, etc.) is adequate.

### What are the prerequisites for this course?

Some programming knowledge is helpful. You should be familiar with basic concepts such as variables, control flow, loops, and debugging techniques. Although MicroSims are written in JavaScript using p5.js, knowledge of Python or another similar programming language is adequate. No prior experience with generative AI tools is required.

### What is a MicroSim?

A **MicroSim** (Micro Simulation) is a small, focused, interactive web-based simulation designed to help learners understand a specific concept. Unlike comprehensive simulation software, MicroSims embrace purposeful simplicity, targeting one learning objective at a time with clarity and precision. They run in any modern browser without installation.

**Example:** A bouncing ball simulation teaching concepts of gravity and energy conservation.

See [Glossary: MicroSim Definition](glossary.md#microsim-definition)

### What makes MicroSims different from other educational software?

MicroSims are unique because they combine five key characteristics: (1) **Small and focused**—each addresses a single concept, (2) **Interactive**—users manipulate parameters and see immediate results, (3) **Web-based**—runs in any browser without installation, (4) **Embeddable**—easily placed in textbooks and course materials, and (5) **AI-friendly**—structured for rapid generation by generative AI tools.

### What tools and materials do I need for this course?

You need: (1) Access to a generative AI tool like ChatGPT or Claude, (2) A modern web browser with developer tools, (3) A text editor or IDE (VS Code recommended), and (4) A GitHub account for version control and deployment. All required software is free.

### How long does it take to create a MicroSim?

With AI assistance, basic MicroSims can be created in minutes to hours rather than weeks or months. The AI generates initial code from your description, and you iterate through 2-4 refinement cycles to polish the result. Complex MicroSims with multiple features may take longer but still dramatically less than traditional development.

### What JavaScript library do MicroSims use?

Most MicroSims in this course use **p5.js**, a JavaScript library designed to make creative coding accessible to beginners. p5.js provides simple functions for drawing shapes, handling animations, and creating interactive controls. It's based on the Processing language and is ideal for educational visualizations.

See [Glossary: p5.js Library](glossary.md#p5js-library)

### Can I use MicroSims in my own classroom?

Yes! MicroSims are designed for classroom use and can be embedded directly in course materials, learning management systems, or websites using simple iframe code. Most MicroSims in this course are released under Creative Commons licenses that allow educational reuse with attribution.

### How do I preview MicroSims while developing them?

You can test MicroSims in several ways: (1) Use the online p5.js editor at editor.p5js.org for immediate feedback, (2) Run `mkdocs serve` to preview your documentation site locally, or (3) Open the HTML file directly in a browser. The p5.js editor is particularly useful for quick iterations.

---

## Core Concepts

### What is p5.js and why do we use it?

**p5.js** is a JavaScript library that makes creative coding accessible with simple functions for drawing, animation, and interaction. We use it because it has a gentle learning curve, works in all browsers, has excellent documentation, and integrates well with AI code generation. The `setup()` and `draw()` functions provide a clear structure for simulations.

**Example:** `createCanvas(400, 450)` creates a 400×450 pixel drawing surface.

### What are the main parts of a p5.js sketch?

Every p5.js sketch has three main parts: (1) **Global variables** declared at the top to store canvas dimensions, simulation parameters, and UI references, (2) **The setup() function** that runs once to initialize the canvas and controls, and (3) **The draw() function** that runs continuously (~60 times per second) to update and render the simulation.

### What is the standard MicroSim layout?

The standard MicroSim layout divides the canvas into two regions: (1) A **drawing region** at the top (typically 400×400 pixels) with an aliceblue background where the simulation visualization appears, and (2) A **control region** at the bottom (typically 50 pixels) with a white background where sliders, buttons, and labels are placed.

### How does the draw() function create animation?

The `draw()` function executes approximately 60 times per second in a continuous loop. Each time it runs, it clears the canvas with `background()`, updates object positions based on physics or user input, and redraws everything. This rapid sequence of slightly different images creates the illusion of smooth animation.

### What is Bloom's Taxonomy and why does it matter for MicroSims?

**Bloom's Taxonomy** is a hierarchical framework classifying educational learning objectives into six cognitive levels: Remember, Understand, Apply, Analyze, Evaluate, and Create. It matters for MicroSims because different cognitive levels require different types of simulations. Flashcards work for Remember; simulators work for Apply; model editors work for Create.

See [Chapter 9: Bloom's Taxonomy](chapters/09-blooms-taxonomy-and-learning-objectives/index.md)

### What are the six levels of Bloom's Taxonomy?

The six levels from lowest to highest are: (1) **Remember**—recall facts and basic concepts, (2) **Understand**—explain ideas and interpret meaning, (3) **Apply**—use knowledge to solve problems, (4) **Analyze**—examine relationships and compare components, (5) **Evaluate**—make judgments based on criteria, and (6) **Create**—produce original work.

### How do I match a MicroSim type to a learning objective?

First, identify the action verb in your learning objective (calculate, explain, design, etc.). Match the verb to a Bloom's level using standard verb lists. Then select MicroSim types proven effective for that level. For example, "Calculate velocity" (Apply level) suggests a simulator or calculator MicroSim.

### What is a Learning Graph?

A **Learning Graph** is a directed graph representing concepts and their prerequisite relationships within a knowledge domain. It shows which concepts must be understood before learning new ones. Learning graphs guide the sequence of instruction and help AI systems recommend personalized learning paths.

**Example:** A graph showing that "Variables" must be learned before "Functions."

### What is Cognitive Load Theory?

**Cognitive Load Theory** describes how mental processing capacity limits affect learning. It distinguishes three types of load: (1) **Intrinsic load**—inherent complexity of the material, (2) **Extraneous load**—cognitive burden from poor design, and (3) **Germane load**—effort spent building understanding. Good MicroSims minimize extraneous load.

### What is the PRIMM methodology?

**PRIMM** stands for Predict-Run-Investigate-Modify-Make, a pedagogical framework for teaching programming. Students first predict what code will do, then run it to check, investigate the structure, modify it to observe changes, and finally make their own version. PRIMM is excellent for scaffolding MicroSim learning.

### What is Dublin Core metadata?

**Dublin Core** is an ISO standard set of vocabulary terms for describing digital resources. For MicroSims, Dublin Core fields include title, creator, subject, description, date, type, format, language, and rights. This metadata makes MicroSims discoverable and reusable through search systems.

### What is responsive design in MicroSims?

**Responsive design** ensures MicroSims adapt to different container sizes and screen widths. Instead of fixed pixel positions, responsive MicroSims use relative calculations like `canvasWidth/2` for centering. The `windowResized()` function detects size changes and adjusts the layout accordingly.

### What are the different types of MicroSims?

Common MicroSim types include: p5.js animations (most flexible), Mermaid.js diagrams (flowcharts, workflows), Chart.js visualizations (bar, line, pie charts), timeline visualizations, geographic maps (Leaflet.js), network graphs (vis-network), and equation plotters. Each type serves different learning objectives.

### What is the difference between the drawing region and control region?

The **drawing region** is the main area where simulation graphics, animations, and visualizations appear. It typically has an aliceblue background. The **control region** is the area for interactive elements like sliders, buttons, and value displays. It typically has a white background and sits below the drawing region.

### How do sliders work in p5.js?

Sliders are created with `createSlider(min, max, default, step)` and positioned with `slider.position(x, y)`. In the `draw()` function, read the current value with `slider.value()`. Sliders allow users to adjust parameters in real-time and see immediate effects on the simulation.

**Example:** `speedSlider = createSlider(1, 60, 30);` creates a slider from 1 to 60 with default 30.

### What is the describe() function for?

The `describe()` function is a p5.js accessibility feature that provides text descriptions of canvas content for screen readers. Including `describe('Description of what the simulation shows', LABEL)` in your setup() function helps visually impaired users understand your MicroSim.

### What are the standard canvas dimensions?

The standard MicroSim canvas is 400 pixels wide with a 400-pixel drawing region and 50-pixel control region (450 pixels total height). However, responsive designs adjust the width to match the container while keeping the height fixed. Always define `canvasWidth`, `drawHeight`, and `controlHeight` as separate variables.

---

## Technical Details

### How do I embed a MicroSim in a web page?

Use an HTML iframe element: `<iframe src="path/to/main.html" width="100%" height="450" style="border: none;"></iframe>`. The `border: none` style removes the default iframe border for seamless integration. In MkDocs, place this directly in your markdown file.

### What files make up a complete MicroSim package?

A complete MicroSim directory contains: (1) **index.md**—documentation with metadata and iframe embed, (2) **main.html**—HTML wrapper for iframe sourcing, (3) **style.css**—minimal styles for clean embedding, (4) **script.js**—the p5.js sketch code, (5) **data.json**—configurable data (optional), and (6) **metadata.json**—Dublin Core metadata.

### What is the MicroSim quality score?

The **quality score** is a 100-point rating system assessing MicroSim completeness, functionality, and adherence to standards. Points are awarded for categories like responsive design, accessibility, documentation, metadata, code quality, and educational effectiveness. Scores are stored in the YAML frontmatter of index.md.

### How do I make a MicroSim responsive to width changes?

Implement the `windowResized()` function to detect size changes, then call `resizeCanvas(newWidth, canvasHeight)`. Create an `updateCanvasSize()` function that reads the container width with `document.querySelector('main').offsetWidth`. Recalculate all position-dependent elements when the canvas resizes.

### What is YAML frontmatter?

**YAML frontmatter** is metadata in YAML format at the beginning of markdown files, delimited by triple dashes (`---`). For MicroSims, frontmatter includes title, description, quality_score, and optional social sharing fields. This data is used by MkDocs and search systems.

```yaml
---
title: Bouncing Ball
description: Interactive physics simulation
quality_score: 85
---
```

### How do push(), translate(), and pop() work together?

These functions manage coordinate system transformations: `push()` saves current drawing settings, `translate(x, y)` moves the origin to a new position, and `pop()` restores the original settings. This technique lets you group and move related elements together by changing just the translate values.

### What is the difference between setup() and draw()?

`setup()` runs exactly once when your sketch starts—use it to create the canvas, initialize variables, and set up controls. `draw()` runs continuously (about 60 times per second)—use it to update positions, apply physics, check conditions, and render graphics. Never create sliders or buttons in draw().

### How do I add a Start/Pause button?

Create a button with `createButton('Pause')` in setup(), position it, and add a click handler. Use an `isRunning` boolean variable. In the click handler, toggle `isRunning` and update the button text. In draw(), wrap your update code in `if (isRunning) { ... }` to respect the state.

### What color values can I use in p5.js?

p5.js accepts colors in multiple formats: named colors ('red', 'aliceblue'), RGB values `fill(255, 0, 0)`, RGBA with transparency `fill(255, 0, 0, 128)`, hex strings `fill('#FF0000')`, and grayscale `fill(128)`. For MicroSims, use 'aliceblue' for drawing regions and 'white' for control regions.

### How do I handle mouse clicks in a MicroSim?

Use the `mousePressed()` function, which p5.js calls automatically when the mouse is clicked. Check `mouseX` and `mouseY` to determine where the click occurred. Use conditionals to respond differently based on click location, such as `if (mouseY < drawHeight) { resetBall(); }`.

### What is JSON Schema and how is it used for MicroSims?

**JSON Schema** defines the required structure and validation rules for MicroSim metadata files. The schema in `src/microsim-schema.json` specifies required Dublin Core fields, educational metadata, technical specifications, and UI control definitions. Use validation tools to ensure your metadata.json files comply.

### How do I debug a MicroSim that isn't working?

Open browser developer tools (F12), check the Console tab for error messages. Use `console.log()` to print variable values during execution. Temporarily add visual markers to verify positions. For AI-assisted debugging, copy the exact error message and relevant code, then describe expected vs. actual behavior.

### What is the difference between a fixed layout and responsive layout?

A **fixed layout** uses static pixel dimensions that never change regardless of container size—simple but may not fit all screens. A **responsive layout** adapts width to the container while maintaining usable proportions, requiring `windowResized()` and relative positioning calculations.

### How do I set up MkDocs for MicroSim documentation?

Install MkDocs and the Material theme with `pip install mkdocs mkdocs-material`. Create a `mkdocs.yml` configuration file with navigation structure. Place MicroSim directories in `docs/sims/`. Run `mkdocs serve` for local preview or `mkdocs gh-deploy` to publish to GitHub Pages.

---

## Common Challenges

### Why does my MicroSim show a blank canvas?

Common causes: (1) Missing or incorrect `createCanvas()` call in setup(), (2) Error in code preventing execution—check browser console, (3) Canvas created but nothing drawn in draw(), (4) Background color matching shape color (both white), or (5) Shapes drawn outside visible canvas area (check coordinates).

### Why don't my sliders affect the simulation?

Make sure you're reading the slider value in draw() with `slider.value()`, not just once in setup(). The value must be read each frame to respond to changes. Also verify the variable storing the value is actually used in your calculations—check for typos in variable names.

### Why is my animation too fast or too slow?

Animation speed depends on how much you change position each frame. Multiply your velocity by a small factor (0.1-0.5) to slow down, or increase values to speed up. You can also use `frameRate(30)` to reduce frame rate, but slider-controlled speed is more flexible.

### Why do my labels and controls overlap?

The AI cannot "see" your layout—it predicts positions based on patterns. Verify coordinates in your code: control region starts at `drawHeight`, so position elements at `drawHeight + 15` or similar. Use consistent spacing and check that labels don't exceed their allocated width.

### How do I fix "undefined is not a function" errors?

This usually means a typo in a function name or calling a function that doesn't exist in p5.js. Check spelling carefully. Common mistakes: `createSlider` not `createslider`, `background` not `setBackground`, `circle` not `drawCircle`. Verify against p5.js documentation.

### Why does my ball pass through walls instead of bouncing?

Check your boundary conditions: the comparison might use wrong operators or coordinates. For a ball with diameter 40, the right wall check should be `if (ballX > width - 20)` not `if (ballX > width)`. Also ensure you're reversing velocity (`velocityX = -velocityX`) and repositioning the ball inside the boundary.

### Why do I get different results when I re-prompt the AI?

LLMs are probabilistic—the same prompt can produce different outputs. For consistency: use detailed, specific prompts with explicit requirements; save successful prompts as templates; include examples of desired output; and use rules files to establish standards.

### How do I handle AI hallucinations in code?

AI may invent non-existent functions or use incorrect syntax. Always test generated code immediately. Verify unfamiliar function calls against p5.js documentation. Be skeptical of "convenient" features you haven't seen before. Cross-reference with working examples from this course.

### Why doesn't my MicroSim work in the p5.js editor but works locally?

The p5.js web editor has slightly different behavior than standalone p5.js. Check for: DOM element selections that work differently, file path references, or external resource loading. Ensure your code doesn't rely on specific HTML structure beyond what p5.js provides.

### How do I fix performance issues with slow animations?

Reduce computational work in draw(): move calculations outside loops when possible, avoid creating new objects every frame, simplify complex shapes, reduce particle counts in simulations. Use `noStroke()` when strokes aren't needed. Consider lowering frameRate for non-critical animations.

---

## Best Practices

### How should I structure my p5.js code?

Follow this order: (1) Global variables at top, (2) setup() function for initialization, (3) draw() function for rendering, (4) Helper functions for specific tasks, (5) Event handlers (mousePressed, keyPressed, etc.). Use descriptive function names and add comments explaining complex logic.

### What naming conventions should I use for variables?

Use camelCase for all variables. Standard names include: `canvasWidth`, `drawHeight`, `controlHeight`, `canvasHeight`, `margin` for dimensions; `speedSlider`, `gravitySlider` for controls; `isRunning` for state; `ballX`, `velocityY` for physics. Descriptive names make code self-documenting.

### How do I write effective AI prompts for MicroSims?

Include: (1) Purpose—what concept this teaches, (2) Canvas layout with specific dimensions and colors, (3) Visual elements—list every shape and label, (4) Interactive controls with ranges and defaults, (5) Behavior—what happens when controls change, and (6) Code standards to follow.

### How many sliders should a MicroSim have?

Aim for 1-3 sliders focusing on the key parameters students should explore. Too many controls create cognitive overload and distract from the learning objective. Each slider should have a clear, observable effect on the simulation. Label all sliders with their current values.

### How do I design accessible MicroSims?

Include `describe()` for screen readers, ensure sufficient color contrast (WCAG 2.1 AA), support keyboard navigation where possible, use minimum 16px text size for readability on smart boards, and provide visual feedback for all interactions. Test with accessibility tools.

### When should I use a p5.js MicroSim vs. other libraries?

Use p5.js for custom animations, physics simulations, and creative visualizations. Use Chart.js for data charts (bar, line, pie). Use Mermaid.js for flowcharts and diagrams. Use Leaflet.js for geographic maps. Use vis-network for network graphs. Match the library to your visualization type.

### How should I organize my MicroSim directories?

Each MicroSim gets its own directory in `docs/sims/` named with kebab-case (e.g., `bouncing-ball`). Include all required files: index.md, main.html, style.css, script.js. Use consistent naming—if the directory is `bouncing-ball`, files should reference `bouncing-ball.js`. Add a preview image with the same base name.

### How do I document a MicroSim properly?

The index.md should include: YAML frontmatter with title, description, and quality_score; an iframe embed of the simulation; a description of what it demonstrates; instructions for use; educational context explaining the concept; and technical notes for developers. Include Dublin Core metadata in metadata.json.

### What's the best way to iterate with AI when refining code?

Be specific about what needs to change—reference line numbers if possible, describe expected vs. actual behavior clearly, ask for explanations not just fixes, test each change before requesting more. Keep conversations focused; start fresh if context becomes confused.

### How do I ensure my MicroSims work on different devices?

Implement responsive width using `windowResized()` and `updateCanvasSize()`. Test in multiple browsers. Avoid hover-dependent interactions (they don't work on touch devices). Keep file sizes small for slow connections. Test on mobile devices if possible—many classrooms use tablets.

---

## Advanced Topics

### How do I use Claude Code for MicroSim development?

Claude Code is a CLI tool that integrates Claude directly into your development workflow. Instead of copying code back and forth, Claude Code can read and write files directly. Say "Read sketch.js and add a reset button" and it will understand your existing code and make integrated changes.

### What are rules files and how do I create them?

**Rules files** provide consistent context to AI about your project's standards. Create a markdown file with sections for canvas standards, variable naming, code structure, control placement, and required elements. Reference this file at the start of AI conversations or include it in your project.

### How do I create a MicroSim skill for AI assistants?

A skill packages a reusable workflow with: (1) Purpose statement describing what it accomplishes, (2) Required inputs the AI needs, (3) Prompt template that reliably produces good output, (4) Output format specification, (5) Quality checks to verify results, and (6) Common refinement patterns.

### How do I implement the push/translate/pop pattern for grouped elements?

Wrap related drawing commands between `push()` and `pop()`. After `push()`, use `translate(x, y)` to set the group's origin. Draw elements relative to (0,0). The `pop()` restores the original coordinate system. This lets you move entire groups by changing just the translate values.

```javascript
push();
translate(chartX, chartY);
// Draw chart elements relative to (0, 0)
rect(0, 0, chartWidth, chartHeight);
pop();
```

### How do I add xAPI tracking to a MicroSim?

**xAPI** (Experience API) tracks learning activities. Import an xAPI library, configure your Learning Record Store (LRS) endpoint, then send statements when meaningful events occur (simulation started, parameter changed, quiz answered). Each statement includes actor, verb, object, and result.

### How can I create MicroSims that work offline?

Host all required libraries locally instead of using CDN links. Include p5.js, fonts, and any other dependencies in your project. Use service workers for progressive web app functionality if needed. Keep file sizes minimal for efficient caching.

### How do I implement quiz mode in a MicroSim?

Add a state variable for mode (`exploration` vs `quiz`). In quiz mode, generate problems with known answers, accept user input, compare to correct answer, and provide feedback. Track score across multiple problems. Consider using the Sorter or Flash Card MicroSim patterns for structured quizzes.

### How do I create a two-column layout MicroSim?

Divide the drawing region into two areas using coordinate translation. The left side shows the main simulation, the right side shows a related visualization (often a chart). Use `push()`, `translate()`, `pop()` to manage each column's coordinate system. Calculate widths based on total canvas width.

### What's the best approach for complex physics simulations?

Break physics into discrete steps: apply forces to calculate acceleration, add acceleration to velocity, add velocity to position. Handle collisions by detecting boundary crossings and reversing velocities. Use energy loss factors (multiply by 0.9 on bounce) for realistic damping. Consider using a physics library for complex scenarios.

### How do I contribute MicroSims to shared libraries?

Follow the standard packaging structure with all required files and metadata. Ensure your MicroSim meets quality standards (score 80+). Test thoroughly across browsers. Include clear documentation and appropriate Creative Commons licensing. Submit via pull request to the repository, following contribution guidelines.

---

*This FAQ was generated from the course content following the FAQ Generator skill workflow. Last updated: 2025-11-25*
