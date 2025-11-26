---
title: Metadata, Packaging, and Quality
description: Learn standards for documenting, packaging, and validating professional MicroSims
generated_by: claude skill chapter-content-generator
date: 2025-01-25 19:30:00
version: 0.03
---

# Metadata, Packaging, and Quality

## Summary

This chapter covers the standards and practices for documenting and packaging MicroSims for reuse and discovery. You will learn Dublin Core metadata standards including title, creator, subject, and description fields, along with JSON Schema validation and YAML frontmatter formatting. The chapter details the MicroSim packaging structure with index.md, main.html, style.css, script.js, data.json, and metadata.json files. You will learn the 100-point quality rubric for evaluating MicroSims and techniques for validation, plus social media optimization with Open Graph tags.

## Concepts Covered

This chapter covers the following 20 concepts from the learning graph:

1. Dublin Core Metadata
2. Metadata Standards
3. Title Metadata
4. Creator Metadata
5. Subject Metadata
6. Description Metadata
7. JSON Schema
8. YAML Frontmatter
9. MicroSim Packaging
10. index.md File
11. main.html File
12. style.css File
13. script.js File
14. data.json File
15. metadata.json File
16. Quality Score
17. 100-Point Rubric
18. MicroSim Validation
19. Social Image Preview
20. Open Graph Tags

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: Web Development Essentials](../02-web-development-essentials/index.md)
- [Chapter 6: MicroSim Architecture and Layout](../06-microsim-architecture-and-layout/index.md)

---

## Tying a Bow Around Your MicroSim

Creating the JavaScript program and the main.html file are the core of any MicroSim. But to be truly useful—to be shareable, discoverable, and maintainable—we need to wrap these files up in a pretty and consistent package and **tie a bow around it**.

Think of it this way: you've baked a delicious cake (your MicroSim). Now you need to put it in a proper box, add a label so people know what's inside, and make it presentable enough that others want to open it.

How can others tell you've used care in creating your MicroSim? How do they know it's worth their time? We present a consistent **quality metric** so that users know exactly what they're getting. These quality rules also serve as hints—a roadmap for what you can do to meet and exceed the expectations of your users.

!!! tip "The Professional Touch"
    The difference between amateur and professional work isn't just the code—it's the presentation. Well-documented, properly packaged MicroSims signal quality before users even run them.

## Metadata Standards: Describing Your Work

**Metadata** is data about data—information that describes your MicroSim so others can find it, understand it, and decide whether to use it. **Metadata standards** provide consistent vocabulary and structure for this description.

### Why Metadata Matters

| Without Metadata | With Metadata |
|-----------------|---------------|
| "What is this?" | Clear title and description |
| "Who made this?" | Creator attribution |
| "Is this relevant?" | Subject classification |
| "When was this updated?" | Date information |
| "Can I reuse this?" | License and rights |

## Dublin Core Metadata

**Dublin Core** is the most widely used metadata standard for describing digital resources. Originally developed for library cataloging, it provides 15 core elements that apply perfectly to educational MicroSims.

### The Dublin Core Elements

| Element | Purpose | MicroSim Example |
|---------|---------|------------------|
| **Title** | Name of the resource | "Bouncing Ball Physics Simulator" |
| **Creator** | Author or organization | "Jane Smith", "Physics Department" |
| **Subject** | Topic or keywords | "Physics", "Kinematics", "Motion" |
| **Description** | Summary of content | "Interactive simulation of ball physics with adjustable gravity" |
| **Publisher** | Entity making it available | "Central High School" |
| **Contributor** | Secondary contributors | "John Doe (testing)", "AI Assistant (code review)" |
| **Date** | Creation or modification date | "2024-03-15" |
| **Type** | Nature of resource | "InteractiveResource", "Software" |
| **Format** | File format | "text/html", "application/javascript" |
| **Identifier** | Unique identifier | "microsim-bouncing-ball-v2" |
| **Source** | Related resource | "Based on Khan Academy physics module" |
| **Language** | Language of content | "en" (English) |
| **Relation** | Related resources | "Part of Physics Simulation Collection" |
| **Coverage** | Scope (spatial/temporal) | "Grade 9-12 Physics curriculum" |
| **Rights** | Copyright/license | "CC BY-SA 4.0" |

### Core Four: Essential Metadata

For MicroSims, four elements are essential:

## Title Metadata

**Title metadata** should be clear, descriptive, and unique:

```yaml
title: "Bouncing Ball Physics Simulator"
```

**Title Best Practices:**

- Be specific: "Ohm's Law Calculator" not "Electronics Sim"
- Include the subject area: "Pendulum Motion Visualizer"
- Avoid generic names: "My MicroSim" or "Test 1"
- Keep it concise: 5-10 words maximum

## Creator Metadata

**Creator metadata** identifies who made the MicroSim:

```yaml
creator:
  - name: "Jane Smith"
    role: "Primary Author"
  - name: "Claude AI"
    role: "Code Assistant"
```

**Creator Options:**

| Format | Example | When to Use |
|--------|---------|-------------|
| Single string | `"Jane Smith"` | Solo creator |
| Array of strings | `["Jane Smith", "John Doe"]` | Multiple creators |
| Array of objects | See above | When roles matter |

## Subject Metadata

**Subject metadata** enables discovery through classification:

```yaml
subject:
  - "Physics"
  - "Kinematics"
  - "Projectile Motion"
  - "STEM Education"
```

**Subject Guidelines:**

- Use hierarchical terms (broad to specific)
- Include curriculum standards if applicable
- Add keywords users might search for
- Limit to 5-10 relevant terms

## Description Metadata

**Description metadata** explains what the MicroSim does:

```yaml
description: |
  This interactive simulation demonstrates projectile motion physics.
  Users can adjust initial velocity, launch angle, and gravity to observe
  how these parameters affect trajectory. Includes real-time graphing
  of position, velocity, and acceleration.
```

**Description Components:**

1. What it does (one sentence)
2. Key features (interactive elements)
3. Educational value (what users learn)
4. Target audience (optional)

## YAML Frontmatter

**YAML frontmatter** places metadata at the top of Markdown files, making it both human-readable and machine-parseable.

### Frontmatter Syntax

```yaml
---
title: "Projectile Motion Simulator"
creator: "Physics Department"
subject: ["Physics", "Kinematics"]
description: "Interactive projectile motion with adjustable parameters"
date: "2024-03-15"
version: "1.2.0"
license: "CC BY-SA 4.0"
---

# Projectile Motion Simulator

Content begins here...
```

### Frontmatter Rules

- Start and end with `---` (three dashes)
- Use consistent indentation (2 spaces)
- Quote strings with special characters
- Use `|` for multi-line text
- Arrays can use `[]` or `-` bullets

### Extended MicroSim Frontmatter

```yaml
---
microsim:
  dublinCore:
    title: "Projectile Motion Simulator"
    creator: ["Jane Smith", "Claude AI"]
    subject: ["Physics", "Kinematics", "Projectile Motion"]
    description: "Interactive simulation of projectile motion physics"
    date: "2024-03-15"
    type: "InteractiveResource"
    format: "text/html"
    language: "en"
    rights: "CC BY-SA 4.0"

  educational:
    gradeLevel: "9-12"
    bloomLevel: "Apply"
    learningObjectives:
      - "Calculate projectile trajectory given initial conditions"
      - "Analyze the effect of gravity on motion"

  technical:
    framework: "p5.js"
    canvasWidth: 600
    canvasHeight: 400
    responsive: true
---
```

## JSON Schema for Validation

**JSON Schema** defines the structure and validation rules for metadata. It ensures your metadata is complete and correctly formatted.

### What JSON Schema Provides

| Feature | Benefit |
|---------|---------|
| **Structure definition** | Documents required fields |
| **Type checking** | Ensures correct data types |
| **Validation** | Catches errors before publishing |
| **Documentation** | Self-describing format |

### MicroSim Metadata Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "MicroSim Metadata Schema",
  "type": "object",
  "required": ["dublinCore", "educational", "technical"],
  "properties": {
    "dublinCore": {
      "type": "object",
      "required": ["title", "creator", "subject", "description"],
      "properties": {
        "title": {
          "type": "string",
          "minLength": 5,
          "maxLength": 100
        },
        "creator": {
          "oneOf": [
            { "type": "string" },
            { "type": "array", "items": { "type": "string" }}
          ]
        },
        "subject": {
          "type": "array",
          "items": { "type": "string" },
          "minItems": 1
        },
        "description": {
          "type": "string",
          "minLength": 20,
          "maxLength": 500
        },
        "date": {
          "type": "string",
          "format": "date"
        }
      }
    },
    "educational": {
      "type": "object",
      "properties": {
        "gradeLevel": { "type": "string" },
        "bloomLevel": {
          "enum": ["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"]
        }
      }
    },
    "technical": {
      "type": "object",
      "properties": {
        "framework": { "type": "string" },
        "canvasWidth": { "type": "integer", "minimum": 200 },
        "canvasHeight": { "type": "integer", "minimum": 200 }
      }
    }
  }
}
```

### Validating Metadata

```javascript
// Using Ajv (Another JSON Schema Validator)
const Ajv = require('ajv');
const ajv = new Ajv();

const validate = ajv.compile(schema);
const valid = validate(metadata);

if (!valid) {
    console.log('Validation errors:', validate.errors);
}
```

## MicroSim Packaging

**MicroSim packaging** is the standard directory structure that makes MicroSims portable, maintainable, and consistent.

### Standard Package Structure

```
my-microsim/
├── index.md           # Documentation and frontmatter
├── main.html          # Standalone HTML version
├── style.css          # Styles (optional)
├── script.js          # p5.js sketch
├── data.json          # Data files (optional)
├── metadata.json      # Machine-readable metadata
├── preview.png        # Social media preview image
└── README.md          # Quick start guide (optional)
```

### File Purposes

## index.md File

The **index.md file** is the primary documentation entry point:

```markdown
---
# YAML frontmatter with metadata
---

# Projectile Motion Simulator

## Overview

Brief description of what this MicroSim does...

## How to Use

1. Adjust the angle slider...
2. Set initial velocity...
3. Click "Launch" to fire...

## Learning Objectives

- Understand how angle affects range
- Observe the effect of gravity
- Predict landing position

## Embedding

Use this iframe code:

\`\`\`html
<iframe src="main.html" width="600" height="450"></iframe>
\`\`\`

## Credits

Created by Jane Smith, 2024
```

## main.html File

The **main.html file** is the standalone, runnable version:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Projectile Motion Simulator</title>

    <!-- Open Graph tags for social sharing -->
    <meta property="og:title" content="Projectile Motion Simulator">
    <meta property="og:description" content="Interactive physics simulation">
    <meta property="og:image" content="preview.png">

    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <main>
        <!-- p5.js canvas will be inserted here -->
    </main>
    <script src="script.js"></script>
</body>
</html>
```

## style.css File

The **style.css file** provides consistent styling:

```css
/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #f5f5f5;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

main {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    overflow: hidden;
}

/* Control region styling */
.controls {
    background: #fafafa;
    padding: 10px;
    border-top: 1px solid #eee;
}

.slider-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 5px 0;
}

.slider-label {
    width: 80px;
    font-size: 14px;
}
```

## script.js File

The **script.js file** contains the p5.js sketch:

```javascript
// Projectile Motion Simulator
// Author: Jane Smith
// Date: 2024-03-15
// License: CC BY-SA 4.0

// Canvas dimensions
let canvasWidth = 600;
let drawHeight = 350;
let controlHeight = 50;

// Physics variables
let projectile;
let gravity = 0.2;
let isLaunched = false;

// Controls
let angleSlider;
let velocitySlider;

function setup() {
    const canvas = createCanvas(canvasWidth, drawHeight + controlHeight);
    canvas.parent(document.querySelector('main'));

    // Create controls
    angleSlider = createSlider(15, 75, 45, 1);
    angleSlider.position(100, drawHeight + 15);

    velocitySlider = createSlider(5, 20, 10, 0.5);
    velocitySlider.position(350, drawHeight + 15);

    resetProjectile();

    describe('Projectile motion simulator with adjustable angle and velocity', LABEL);
}

function draw() {
    // Drawing region
    background(240, 248, 255);

    // Update and draw projectile
    if (isLaunched) {
        updateProjectile();
    }
    drawProjectile();

    // Control region
    fill(255);
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Labels
    fill(0);
    textSize(14);
    text('Angle: ' + angleSlider.value() + '°', 20, drawHeight + 25);
    text('Velocity: ' + velocitySlider.value(), 270, drawHeight + 25);
}

// Additional functions...
```

## data.json File

The **data.json file** stores configuration or content data:

```json
{
    "presets": [
        {
            "name": "Moon Gravity",
            "gravity": 0.03,
            "description": "Simulate lunar conditions"
        },
        {
            "name": "Earth Gravity",
            "gravity": 0.2,
            "description": "Standard Earth gravity"
        },
        {
            "name": "Jupiter Gravity",
            "gravity": 0.5,
            "description": "High gravity environment"
        }
    ],
    "defaultSettings": {
        "angle": 45,
        "velocity": 10,
        "showTrajectory": true
    }
}
```

## metadata.json File

The **metadata.json file** provides machine-readable metadata:

```json
{
    "$schema": "./microsim-schema.json",
    "dublinCore": {
        "title": "Projectile Motion Simulator",
        "creator": ["Jane Smith"],
        "subject": ["Physics", "Kinematics", "Projectile Motion"],
        "description": "Interactive simulation demonstrating projectile motion physics with adjustable launch angle and initial velocity.",
        "date": "2024-03-15",
        "type": "InteractiveResource",
        "format": "text/html",
        "language": "en",
        "rights": "CC BY-SA 4.0"
    },
    "educational": {
        "gradeLevel": "9-12",
        "subjectArea": "Physics",
        "bloomLevel": "Apply",
        "learningObjectives": [
            "Calculate projectile trajectory given initial conditions",
            "Analyze the relationship between launch angle and range",
            "Predict landing position based on parameters"
        ]
    },
    "technical": {
        "framework": "p5.js",
        "version": "1.9.0",
        "canvasWidth": 600,
        "canvasHeight": 400,
        "responsive": true,
        "dependencies": []
    },
    "userInterface": {
        "controls": [
            {
                "type": "slider",
                "label": "Launch Angle",
                "min": 15,
                "max": 75,
                "default": 45,
                "unit": "degrees"
            },
            {
                "type": "slider",
                "label": "Initial Velocity",
                "min": 5,
                "max": 20,
                "default": 10,
                "unit": "m/s"
            },
            {
                "type": "button",
                "label": "Launch",
                "action": "start"
            }
        ]
    }
}
```

## Quality Score and the 100-Point Rubric

The **quality score** provides an objective measure of MicroSim completeness and professionalism. The **100-point rubric** breaks this into specific, measurable criteria.

### Why Quality Scoring?

- Provides clear expectations
- Guides improvement efforts
- Enables comparison between MicroSims
- Signals professionalism to users

### The 100-Point MicroSim Rubric

#### Documentation (25 points)

| Criterion | Points | Requirements |
|-----------|--------|--------------|
| **Title & Description** | 5 | Clear, descriptive title; comprehensive description |
| **Learning Objectives** | 5 | Specific, measurable objectives aligned to Bloom's |
| **Usage Instructions** | 5 | Step-by-step guide for users |
| **Embedding Guide** | 5 | Iframe code and integration instructions |
| **Credits & License** | 5 | Creator attribution; clear license statement |

#### Metadata (20 points)

| Criterion | Points | Requirements |
|-----------|--------|--------------|
| **Dublin Core** | 8 | All required fields (title, creator, subject, description) |
| **Educational Metadata** | 6 | Grade level, Bloom level, learning objectives |
| **Technical Metadata** | 6 | Framework, dimensions, dependencies |

#### Code Quality (25 points)

| Criterion | Points | Requirements |
|-----------|--------|--------------|
| **Structure** | 5 | Follows standard layout (setup, draw, helpers) |
| **Comments** | 5 | Header comment, function documentation |
| **Naming** | 5 | Clear, consistent variable/function names |
| **Accessibility** | 5 | describe() function, keyboard support |
| **Error Handling** | 5 | Graceful handling of edge cases |

#### User Experience (20 points)

| Criterion | Points | Requirements |
|-----------|--------|--------------|
| **Responsiveness** | 5 | Works at multiple widths (300-1200px) |
| **Controls** | 5 | Intuitive, well-labeled controls |
| **Visual Design** | 5 | Consistent colors, clean layout |
| **Performance** | 5 | Smooth animation, no lag |

#### Packaging (10 points)

| Criterion | Points | Requirements |
|-----------|--------|--------------|
| **File Structure** | 4 | All required files present |
| **Preview Image** | 3 | 1200x630px social preview |
| **Validation** | 3 | Passes JSON Schema validation |

### Scoring Interpretation

| Score | Rating | Meaning |
|-------|--------|---------|
| 90-100 | Excellent | Publication-ready, exemplary work |
| 80-89 | Good | Minor improvements needed |
| 70-79 | Acceptable | Functional but needs polish |
| 60-69 | Needs Work | Missing important elements |
| Below 60 | Incomplete | Significant gaps to address |

#### Diagram: Quality Rubric Scorecard

<details markdown="1">
    <summary>Interactive Quality Rubric Evaluator</summary>
    Type: microsim

    Learning objective: Evaluate MicroSim quality using the 100-point rubric (Bloom: Evaluate)

    Canvas layout:
    - Evaluation area: 600x500 pixels
    - Summary area: 80 pixels

    Visual elements:
    - Five collapsible sections (one per rubric category)
    - Checkbox/slider for each criterion
    - Running total display
    - Progress bar
    - Rating badge (Excellent/Good/etc.)

    Categories:
    1. Documentation (25 pts)
       - Title & Description (0-5)
       - Learning Objectives (0-5)
       - Usage Instructions (0-5)
       - Embedding Guide (0-5)
       - Credits & License (0-5)

    2. Metadata (20 pts)
       - Dublin Core (0-8)
       - Educational (0-6)
       - Technical (0-6)

    3. Code Quality (25 pts)
       - Structure (0-5)
       - Comments (0-5)
       - Naming (0-5)
       - Accessibility (0-5)
       - Error Handling (0-5)

    4. User Experience (20 pts)
       - Responsiveness (0-5)
       - Controls (0-5)
       - Visual Design (0-5)
       - Performance (0-5)

    5. Packaging (10 pts)
       - File Structure (0-4)
       - Preview Image (0-3)
       - Validation (0-3)

    Interactive controls:
    - Sliders for each criterion
    - "Reset All" button
    - "Export Report" button
    - "Load Preset" dropdown

    Behavior:
    - Score updates in real-time
    - Progress bar fills as score increases
    - Rating badge changes color based on score
    - Export generates markdown report

    Educational emphasis:
    - Teaches evaluation criteria
    - Provides self-assessment tool
    - Generates improvement checklist

    Color scheme:
    - Excellent (90+): green
    - Good (80-89): blue
    - Acceptable (70-79): yellow
    - Needs Work (60-69): orange
    - Incomplete (<60): red

    Implementation: p5.js with section collapsing
</details>

## MicroSim Validation

**MicroSim validation** ensures your package meets all requirements before publishing.

### Validation Checklist

```markdown
## Pre-Publication Validation Checklist

### Files
- [ ] index.md exists and has frontmatter
- [ ] main.html runs standalone in browser
- [ ] script.js follows coding standards
- [ ] metadata.json passes schema validation
- [ ] preview.png is 1200x630 pixels

### Metadata
- [ ] Title is descriptive (5-100 characters)
- [ ] Creator(s) identified
- [ ] At least 3 subject keywords
- [ ] Description is 20-500 characters
- [ ] Date is in YYYY-MM-DD format
- [ ] License is specified

### Functionality
- [ ] MicroSim loads without errors
- [ ] All controls are functional
- [ ] Responsive at 400px, 800px, 1200px widths
- [ ] No console errors or warnings
- [ ] describe() function provides accessibility label

### Educational
- [ ] Learning objectives are specific
- [ ] Bloom level is appropriate
- [ ] Grade level is indicated
- [ ] Usage instructions are clear
```

### Automated Validation Script

```javascript
// validate-microsim.js
const fs = require('fs');
const Ajv = require('ajv');
const path = require('path');

function validateMicrosim(directory) {
    const results = {
        passed: [],
        failed: [],
        score: 0
    };

    // Check required files
    const requiredFiles = ['index.md', 'main.html', 'script.js', 'metadata.json'];
    for (const file of requiredFiles) {
        const filePath = path.join(directory, file);
        if (fs.existsSync(filePath)) {
            results.passed.push(`✓ ${file} exists`);
            results.score += 2;
        } else {
            results.failed.push(`✗ ${file} missing`);
        }
    }

    // Validate metadata.json against schema
    const metadataPath = path.join(directory, 'metadata.json');
    if (fs.existsSync(metadataPath)) {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        const schema = require('./microsim-schema.json');
        const ajv = new Ajv();
        const valid = ajv.validate(schema, metadata);

        if (valid) {
            results.passed.push('✓ metadata.json validates against schema');
            results.score += 10;
        } else {
            results.failed.push('✗ metadata.json validation errors:');
            ajv.errors.forEach(err => {
                results.failed.push(`  - ${err.instancePath}: ${err.message}`);
            });
        }
    }

    return results;
}

// Usage
const results = validateMicrosim('./my-microsim');
console.log('Validation Results:');
console.log('Passed:', results.passed.join('\n'));
console.log('Failed:', results.failed.join('\n'));
console.log('Score:', results.score);
```

## Social Media Optimization

Making your MicroSim shareable on social media requires proper image previews and metadata.

## Social Image Preview

The **social image preview** appears when your MicroSim is shared on Twitter, Facebook, LinkedIn, or other platforms.

### Image Requirements

| Platform | Size | Aspect Ratio |
|----------|------|--------------|
| Twitter | 1200×675px | 16:9 |
| Facebook | 1200×630px | 1.91:1 |
| LinkedIn | 1200×627px | 1.91:1 |
| Universal | **1200×630px** | 1.91:1 |

### Creating Preview Images

1. **Screenshot approach:** Capture the MicroSim at an interesting state
2. **Designed graphic:** Create branded image with title overlay
3. **Automated:** Generate from canvas using `canvas.toDataURL()`

```javascript
// Auto-generate preview image
function savePreview() {
    // Set up a good visual state
    resetSimulation();
    runForFrames(60);  // Let it run a bit

    // Save the canvas
    saveCanvas('preview', 'png');
}
```

### Preview Image Best Practices

- Show the MicroSim in action (not static state)
- Include the title as text overlay
- Use high contrast for visibility at small sizes
- Avoid text smaller than 24px
- Test at thumbnail size (200×105px)

## Open Graph Tags

**Open Graph tags** tell social platforms how to display your content.

### Essential Open Graph Tags

```html
<head>
    <!-- Basic metadata -->
    <meta property="og:title" content="Projectile Motion Simulator">
    <meta property="og:description" content="Interactive physics simulation with adjustable parameters">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://example.com/sims/projectile-motion/">

    <!-- Image -->
    <meta property="og:image" content="https://example.com/sims/projectile-motion/preview.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Screenshot of projectile motion simulator">

    <!-- Twitter-specific -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Projectile Motion Simulator">
    <meta name="twitter:description" content="Interactive physics simulation">
    <meta name="twitter:image" content="https://example.com/sims/projectile-motion/preview.png">
</head>
```

### Testing Open Graph Tags

Use these tools to verify your tags work correctly:

- **Facebook Sharing Debugger:** developers.facebook.com/tools/debug
- **Twitter Card Validator:** cards-dev.twitter.com/validator
- **LinkedIn Post Inspector:** linkedin.com/post-inspector

## Complete Packaging Example

Here's a complete, properly packaged MicroSim:

### Directory Structure

```
projectile-motion/
├── index.md
├── main.html
├── style.css
├── script.js
├── metadata.json
├── preview.png
└── README.md
```

### Full index.md

```markdown
---
title: "Projectile Motion Simulator"
description: "Interactive physics simulation demonstrating projectile motion"
author: "Jane Smith"
date: "2024-03-15"
license: "CC BY-SA 4.0"
---

# Projectile Motion Simulator

An interactive simulation for exploring projectile motion physics.

## Demo

<iframe src="main.html" width="100%" height="450" frameborder="0"></iframe>

## Learning Objectives

After using this simulation, students will be able to:

1. Predict how launch angle affects projectile range
2. Calculate time of flight given initial velocity
3. Explain the independence of horizontal and vertical motion

## How to Use

1. **Set the angle** using the first slider (15° to 75°)
2. **Set the velocity** using the second slider (5 to 20 m/s)
3. **Click Launch** to fire the projectile
4. **Click Reset** to try different parameters

## Embedding

Copy this code to embed in your course:

\`\`\`html
<iframe
    src="https://example.com/sims/projectile-motion/main.html"
    width="600"
    height="450"
    frameborder="0"
    title="Projectile Motion Simulator">
</iframe>
\`\`\`

## Technical Details

- **Framework:** p5.js 1.9.0
- **Canvas Size:** 600×400 pixels (responsive width)
- **Browser Support:** Chrome, Firefox, Safari, Edge

## Credits

- Created by Jane Smith
- Code review by Claude AI
- Based on standard physics curriculum

## License

This work is licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
```

## Key Takeaways

You've learned to package MicroSims professionally:

1. **Metadata standards** provide vocabulary for describing educational resources.

2. **Dublin Core** offers 15 elements; focus on title, creator, subject, and description.

3. **YAML frontmatter** places metadata at the top of Markdown files.

4. **JSON Schema** validates metadata structure and completeness.

5. **MicroSim packaging** uses a standard directory structure with six core files.

6. **index.md** provides human-readable documentation with embedded frontmatter.

7. **main.html** is the standalone, runnable version with Open Graph tags.

8. **metadata.json** provides machine-readable metadata for automation.

9. The **100-point rubric** evaluates Documentation, Metadata, Code, UX, and Packaging.

10. **Quality scores** range from Incomplete (<60) to Excellent (90-100).

11. **Validation** ensures all requirements are met before publishing.

12. **Social preview images** should be 1200×630px for universal compatibility.

13. **Open Graph tags** control how MicroSims appear when shared on social media.

14. Proper packaging signals professionalism and builds user trust.

??? question "Challenge: Package and Score"
    Take a MicroSim you've created and package it according to the standards in this chapter. Create all required files, add complete metadata, and generate a preview image. Then use the 100-point rubric to score your work. What areas need improvement?

## Next Steps

You now know how to wrap your MicroSims in professional packaging that signals quality and enables discovery. Your work can be found, understood, and reused by others. In the next chapter, we'll explore **accessibility and internationalization**, ensuring your MicroSims work for all learners regardless of ability or language.

Remember: the bow on the package matters. Users judge quality by presentation before they ever run your code. Make that first impression count.

## References

- [Dublin Core Metadata Initiative](https://www.dublincore.org/) - Official Dublin Core documentation
- [JSON Schema](https://json-schema.org/) - Schema specification and validators
- [Open Graph Protocol](https://ogp.me/) - Open Graph tag reference
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards) - Twitter sharing documentation
- [Creative Commons](https://creativecommons.org/licenses/) - License options for educational content
