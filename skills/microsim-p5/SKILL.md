---
name: microsim-p5
description: Create an educational MicroSim using the p5.js JavaScript library.  Each MicroSim is a directory located in the /docs/sims folder.  It has a main.html file that can be referenced with an iframe.  The main.html file imports the main JavaScript code to run the educational MicroSim.
---
# Educational MicroSim Creation Skill for P5.js

## Overview

This skill guides the creation of Educational MicroSims using the p5.js JavaScript library.  MicroSims are lightweight, interactive educational simulations designed for browser-based learning. MicroSims occupy a unique position at the intersection of **Simplicity** (focused scope, transparent code), **Accessibility** (browser-native, universal embedding), and **AI Generation** (standardized patterns, prompt-compatible design).

This MicroSim is designed to create all the required files for running your MicroSim on your website.
We assume that the website has a folder called /docs/sims that each MicroSim will be placed in.
The p5.js file is also designed to that it can be tested by pasting the JavaScript directly
into the p5.js editor site at https://editor.p5js.org/.

## Purpose

Educational MicroSims transform abstract concepts into visual interactive, manipulable experiences that enable students to learn through exploration and experimentation. Each MicroSim addresses specific learning objectives while maintaining the pedagogical rigor and technical quality necessary for educational deployment.

MicroSims are designed to be referenced by an iframe on an existing website or quickly added to a website or intelligent textbook created with mkdocs.  Because MicroSims have strict rules for controls, they can generate xAPI (eXperience API IEEE 9274.1.1-2023) calls so that interaction events in JSON format can be added to a LRS learning Record Store IEEE 1484.20-2024.

## Development Process

### Step 1: Educational Requirements Specification

Before generating code, articulate the educational purpose:

1. **Subject Area and Topic**: What specific concept does this simulation teach?
2. **Grade Level**: Elementary (K-5), Middle School (6-8), High School (9-12), or Undergraduate
3. **Learning Objectives**: What should students understand after using this simulation? (Align with Bloom's Taxonomy: Remember, Understand, Apply, Analyze, Evaluate, Create)
4. **Duration**: Typical engagement time (5-15 minutes recommended)
5. **Prerequisites**: What knowledge must students have before using this?
6. **Assessment Opportunities**: How can educators verify learning?

This information will be stored in a the Dublin Core area of file called metadata.json

### Step 2: MicroSim Implementation with p5.js

Generate a self-contained, interactive p5.js simulation following the standardized MicroSim architecture.  
The program is width responsive.

#### Folder Structure
Each MicroSim is contained in a folder within the /docs/sims directory.  The folder name is $MICROSIM_NAME

```
/docs/sims/$MICROSIM_NAME # container folder for MicroSim
/docs/sims/$MICROSIM_NAME/index.md # main index markdown for each MicroSim containing the iframe and documentation
/docs/sims/$MICROSIM_NAME/main.html # main HTML5 file containing the p5.js CDN link and importing the p5.js JavaScript
/docs/sims/$MICROSIM_NAME/$MICROSIM_NAME.js # All the p5.js JavaScript
/docs/sims/$MICROSIM_NAME/metadata.json # JSON file with Dublin core metadata and description of controls
```

1. A new folder will be created in the `/docs/sims` area.  The folder name contains only lower case letters and dashes.  This will be the MICROSIM_NAME
2. An `index.md` file will be generated in the folder that describes the MicroSim and contains in iframe reference to the `main.html` file
3. A small `main.html` file will contain the title, link to the p5.js library from the CDN and include the MICROSIM_NAME.js file.  The `main.html` file must contain a `main` HTML element within the body.
4. A file called `metadata.json` will be created that conforms to the schema at /src/microsim-schema/microsim-schema.json.  This will contain the Dublin core elements such as title, subject, author, publication date etc.  This file is use so that
faceted search engines can find this MicroSim

## Technical Architecture Standards

### Canvas Structure (REQUIRED)

Every MicroSim must have two regions:

1. A top drawing region with a fixed height called drawHeight.  No user interface controls are placed in the drawing region.
2. A user interface controls region below the drawing region that contains buttons and sliders with a fixed height called controlHeight.

The width of the canvas is resized according to the container.  It is set initially, but reset in the draw loop.

You can use this layout pattern:

```javascript
// Canvas dimensions - REQUIRED structure
let canvasWidth = 400;              // Initial width (responsive)
let drawHeight = 400;                // Drawing/simulation area height
let controlHeight = 50;              // Controls area height
let canvasHeight = drawHeight + controlHeight;
let margin = 25;                     // Margin for visual elements
let sliderLeftMargin = 105;          // Left margin for slider positioning.  This is the sum of the horizontal size of the largest label and value.
let defaultTextSize = 16;            // Base text size

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Create sliders and controls here
  // Position controls relative to drawHeight

  describe('Educational description for screen readers', LABEL);
}

function draw() {
  // Drawing area (light blue background)
  fill('aliceblue');
  rect(0, 0, width, drawHeight);

  // Control area (white background)
  fill('white');
  rect(0, drawHeight, width, controlHeight);

  // Place the title in the top center of the canvas
  fill('black');
  textSize(36); // larger font for the title
  textAlign(CENTER, TOP);
  noStroke();
  text('Title of MicroSim', canvasWidth/2, margin);
  // return default setting to avoid bugs in the main drawing code
  stroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);

  // main drawing code here

  // Draw control labels and values here in the controls areal

}
```

### Responsive Design (REQUIRED)

Implement horizontal responsiveness for embedding in various platforms:

```javascript
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
    // Reposition all controls to match new width
    // all horizontal sliders much be resized when the container size changes
    if (typeof speedSlider !== 'undefined') {
      // update the size of the slider
      speedSlider.size(canvasWidth - sliderLeftMargin - margin);
    }
  }
}
```

### Visual Design Standards

**Color Scheme**:
- Drawing area background: `'aliceblue'`
- Control area background: `'white'`
- Borders: `'silver'`, 1px width
- Interactive elements: Use high-contrast, colorblind-safe colors

**Typography**:

Try to avoid using any text smaller than 16pt.  We want the MicroSim text to be
readable from the back of the classroom.

- Default title size: 36px
- Default text size: 16px
- Control labels: Bold, positioned consistently in the control region
- Value displays: Show current parameter values

### Control Patterns

**Horizontal Sliders In Control Region** (for continuous parameters):

Sliders are create with min, max, default and step parameters.
They are then placed below the draw height and X over at the sliderLeftMargin.
The width of the slider is controlled by the size method and spans the width of the canvas less the sliderLeftMargin - 15;

```javascript
speedSlider = createSlider(0, 20, 3, 0.1);
speedSlider.position(sliderLeftMargin, drawHeight + 15);
speedSlider.size(canvasWidth - sliderLeftMargin - 15);
speedSlider.input(resetSimulation);
```

Do no use the `style` method to change the width of a slider.  Only use the `size' method.

All sliders must have their size recalculated if the container width changes.

**Buttons** (for discrete actions):
```javascript
startButton = createButton(isRunning ? 'Pause' : 'Start');
startButton.position(10, drawHeight + 15);
startButton.mousePressed(toggleSimulation);
```

**Checkboxes** (for toggle options):
```javascript
showGridCheckbox = createCheckbox('Show Grid', false);
showGridCheckbox.position(10, drawHeight + 15);
```

## main.html

Our goal is to maintain full compatibility with the p5.js editor.  JavaScript code generated should
always be paste directly into the p5.js editing tool.  This tool uses a standard main.html file that contains a '<main></main>` element that holds our canvas.  Here is the main.html template that we recommend using:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Bouncing Ball MicroSim using P5.js 1.11.10</title>
    <script src="https://cdn.jsdelivr.net/npm/p5@1.11.10/lib/p5.js"></script>
    <style>
        body {
            margin: 0px;
            padding: 0px;
            font-family: Arial, Helvetica, sans-serif;
        }
    </style>
    <!-- Put your script file name here -->
    <script src="bouncing-ball.js"></script>
</head>
<body>
    <main></main>
    <br/>
    <a href=".">Back to Lesson Plan</a>
</body>
</html>
```

### Customizing the main.html File

The following items must be modified in each main.html file:

1. The pathname to the JavaScript file should be modified to use the name of the JavaScript file in the MicroSim directory.
2. The title element in the body must be modified for each MicroSim.

Note that for label placement in the control area, we set both the margin and padding to be 0.  We do not use a separate CSS file.  This keeps our code simpler.

Note that this template uses the jsdelivr.net CDN to get the main p5.js library.  The version number
is hard coded in this path.  If bugs are found one suggestion is to verify that this library is
the current one used in the p5.js editor.

## Metadata Generation

The MicroSim metadata is stored within the MicroSim folder in a file called `metadata.json`.  The
structure of this file is governed by a JSON schema file located at /src/microsim-schema/microsim-schema.json.


## Educational Design Principles

### 1. Focused Scope
Each MicroSim addresses ONE specific learning objective. Do not attempt to teach an entire topic—focus on a single concept, relationship, or phenomenon that benefits from interactive exploration.

### 2. Immediate Feedback
Students must see the effects of their parameter changes instantly. The simulation should update in real-time as sliders move or buttons are clicked.

### 3. Transparent Implementation
Code should be readable and well-commented so educators and advanced students can understand the underlying model. Include comments explaining:
- Mathematical equations being modeled
- Physical principles being demonstrated
- Assumptions and simplifications made

### 4. Progressive Complexity
Start with simple defaults that demonstrate the core concept. Allow students to increase complexity through parameter manipulation.

### 5. Cognitive Load Management
- Minimize extraneous cognitive load: Keep interface clean and uncluttered
- Optimize germane cognitive load: Focus attention on the educational concept
- Support intrinsic complexity: Provide scaffolding for difficult concepts

## Example Learning Objectives by Domain

### Physics & Engineering
- Demonstrate relationship between force, mass, and acceleration
- Visualize wave interference patterns
- Explore conservation of energy in colliding objects
- Show effects of gravity on projectile motion

### Chemistry & Molecular Science
- Visualize molecular bonding and bond angles
- Demonstrate gas laws (pressure, volume, temperature relationships)
- Show chemical equilibrium and Le Chatelier's principle
- Illustrate phase changes at molecular level

### Biology & Life Sciences
- Model population dynamics and predator-prey relationships
- Simulate genetic inheritance patterns
- Demonstrate cell division processes
- Explore ecosystem energy flow

### Mathematics & Computer Science
- Explore function transformations (translations, dilations, reflections)
- Visualize geometric constructions and proofs
- Demonstrate probability distributions
- Show algorithmic behavior (sorting, searching, recursion)

### Systems Thinking
- Model feedback loops and causal relationships
- Demonstrate stock-and-flow dynamics
- Show emergent behavior in complex systems
- Explore sensitivity to initial conditions

## HTML Structure (REQUIRED)

Every MicroSim must be a self-contained HTML file following this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MicroSim: [Concept Name]</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f5f5f5;
    }
    main {
      max-width: 800px;
      margin: 0 auto;
    }
    h1 {
      text-align: center;
      color: #333;
    }
  </style>
</head>
<body>
  <main>
    <h1>[Simulation Title]</h1>
  </main>
  <script>
    // MicroSim code here following standardized architecture
  </script>
</body>
</html>
```

## Metadata Requirements

For each MicroSim, generate comprehensive metadata following the Educational MicroSim Metadata Schema:

### Dublin Core Elements
- **Title**: Clear, descriptive name
- **Creator**: Author(s) name
- **Subject**: Subject area(s) covered
- **Description**: 2-3 sentence summary
- **Date**: Creation date (YYYY-MM-DD)
- **Type**: "Interactive Simulation"
- **Format**: "text/html"
- **Language**: "en" (or appropriate language code)
- **Rights**: License information (e.g., "CC BY 4.0")

### Educational Metadata
- **Grade Level**: Target age/grade range
- **Subject Area**: Primary subject (Mathematics, Science, etc.)
- **Topic**: Specific topic within subject
- **Learning Objectives**: Bullet list of objectives
- **Bloom's Taxonomy Levels**: Which cognitive levels are addressed
- **Duration**: Estimated engagement time
- **Prerequisites**: Required prior knowledge

### Technical Metadata
- **Framework**: "p5.js"
- **Canvas Dimensions**: "400×450" (initial)
- **Responsive**: "Width-responsive"
- **Dependencies**: "p5.js CDN"
- **Accessibility**: Features included (keyboard nav, screen reader support)

### User Interface Metadata
- **Controls**: List of sliders, buttons, checkboxes with descriptions
- **Parameters**: Each parameter's range, default, purpose

### Simulation Model
- **Model Type**: Type of simulation (physics-based, mathematical, agent-based, etc.)
- **Variables**: List of key variables
- **Equations**: Mathematical equations used (if applicable)
- **Assumptions**: Simplifications made for educational purposes
- **Limitations**: What the model does NOT accurately represent

## Quality Standards

Every MicroSim must meet these criteria:

### Functionality
- ✅ Runs without errors in modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Responsive design adapts to different container widths
- ✅ Controls respond immediately to user input
- ✅ Simulation resets cleanly without page reload

### Educational Quality
- ✅ Addresses specific learning objectives
- ✅ Provides meaningful interaction (not just animation)
- ✅ Includes educational context (titles, labels, instructions)
- ✅ Accurate representation of underlying concept (within stated limitations)

### Code Quality
- ✅ Follows standardized MicroSim architecture
- ✅ Well-commented and readable
- ✅ Uses meaningful variable names
- ✅ Includes `describe()` function for accessibility

### Visual Design
- ✅ Clean, uncluttered interface
- ✅ Consistent color scheme (aliceblue/white/silver)
- ✅ High contrast for readability
- ✅ Professional appearance suitable for classroom use

## Common Patterns and Examples

### Pattern 1: Parameter Exploration
Students manipulate sliders to see effects on system behavior.
**Example**: Adjust gravity and initial velocity to explore projectile motion.

### Pattern 2: Comparative Visualization
Show two scenarios side-by-side for comparison.
**Example**: Compare sorting algorithms (bubble sort vs. quicksort).

### Pattern 3: System Evolution
Observe how a system changes over time, with play/pause/reset controls.
**Example**: Population growth with birth/death rates.

### Pattern 4: Interactive Construction
Students build or modify structures to understand relationships.
**Example**: Construct geometric shapes to explore area/perimeter relationships.

### Pattern 5: Data Visualization
Transform abstract data into visual representations students can manipulate.
**Example**: Interactive histogram showing probability distributions.

## Workflow Integration

### For Educators Creating MicroSims:
1. Identify specific learning objective
2. Describe desired simulation in natural language
3. AI generates initial implementation following these standards
4. Educator previews and requests refinements
5. Metadata generated automatically
6. Deploy to learning management system via iframe

### For Students Extending MicroSims:
1. Start with existing MicroSim
2. Modify parameters or add features
3. Observe how changes affect behavior
4. Document observations and learning

## Deployment Considerations

### iframe Embedding (Universal Deployment)
MicroSims are designed to be embedded anywhere with a single HTML line:

```html
<iframe src="microsim-file.html"
        width="100%"
        height="470"
        frameborder="0"
        title="Educational MicroSim">
</iframe>
```

### Learning Management System Integration
- Compatible with Canvas, Blackboard, Moodle, Google Classroom
- No server-side requirements
- Works in restricted network environments
- Mobile-friendly for tablets and smartphones

### xAPI Integration (Optional)
For learning analytics, MicroSims can emit xAPI statements:
- Button clicks, slider adjustments
- Time spent on task
- Parameter exploration patterns
- Performance on embedded assessments

## Pedagogical Context

### Research Foundation
Educational simulations demonstrate consistent benefits:
- 15-25% improvement in conceptual understanding
- 30-40% reduction in time to mastery
- 25-35% increase in student engagement

### Effective Use Strategies
- **Guided Exploration**: Provide 2-3 open-ended questions to focus investigation
- **Predict-Test-Observe**: Have students predict before manipulating
- **Collaborative Learning**: Pairs/groups discuss observations
- **Scaffolded Challenge**: Progress from simple to complex parameter spaces

### Common Pitfalls to Avoid
- ❌ Too many controls (cognitive overload)
- ❌ Unclear cause-and-effect relationships
- ❌ Animation without interactivity
- ❌ Over-simplification that creates misconceptions
- ❌ Inaccessible interface (poor contrast, no keyboard support)

## Example MicroSim: Bouncing Ball (Physics)

### Educational Purpose
Demonstrate effects of gravity and elasticity on projectile motion, illustrating energy conservation and loss.

### Learning Objectives
- Understand relationship between gravitational acceleration and trajectory
- Observe energy loss in non-elastic collisions
- Apply physics concepts to predict behavior

### Implementation Highlights
```javascript
// Core physics model
velocity.y += gravity; // Acceleration due to gravity
position.add(velocity);

// Collision detection and response
if (position.y >= height - radius) {
  position.y = height - radius;
  velocity.y *= -elasticity; // Energy loss on bounce
}
```

### Controls Provided
- Gravity slider (0-2 m/s², default: 0.5)
- Elasticity slider (0-1, default: 0.7)
- Start/Pause button
- Reset button

This example demonstrates all core MicroSim principles: focused scope, transparent physics, immediate feedback, and clean interface.

## Continuous Improvement

### Iteration Based on Use
- Collect feedback from educators and students
- Observe which parameters students explore most
- Identify common misconceptions revealed by interactions
- Refine based on actual classroom use

### AI-Assisted Refinement
After initial generation, iteratively improve through prompts like:
- "Add a slider to control [parameter]"
- "Show the current velocity value"
- "Include a graph showing energy over time"
- "Add a grid to help students measure distances"

## Conclusion

Educational MicroSims represent a powerful convergence of pedagogical effectiveness, technical accessibility, and AI-generation capability. By following these standards, any educational concept that benefits from interactive exploration can be transformed into a high-quality, embeddable, reusable learning tool.

The key is maintaining focus: one concept, clear interactions, immediate feedback, transparent implementation. Each MicroSim should feel carefully crafted, pedagogically sound, and ready for deployment in real educational contexts.

---

**For Anthropic Claude Code**: When creating MicroSims, always reference the comprehensive rules in `.cursor/rules/microsims.mdc` and follow the metadata schema in `src/microsim-schema.json`. Each MicroSim should feel like a polished educational tool developed by expert instructional designers and developers working at the top of their field.
