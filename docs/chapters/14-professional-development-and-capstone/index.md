---
title: Professional Development and Capstone
description: Professional skills for MicroSim integration, licensing, collaboration workflows, portfolio development, and capstone project completion
generated_by: claude skill chapter-content-generator
date: 2025-01-25
version: 0.03
---

# Professional Development and Capstone

## Summary

This chapter covers professional skills for integrating and sharing MicroSims, culminating in your capstone project. You will learn iframe integration techniques for embedding MicroSims in MkDocs pages and HTML slide decks, plus styling considerations for minimal borders. The chapter covers Creative Commons licensing including CC BY-NC-SA attribution requirements, and adding fullscreen and copyright icons. You will learn collaboration workflows, peer review processes, user testing, and usability studies. The chapter concludes with portfolio development, understanding concept dependencies through learning graphs, and completing your capstone project with evaluation criteria.

## Concepts Covered

This chapter covers the following 24 concepts from the learning graph:

1. p5.js Editor Preview
2. mkdocs serve
3. Live Preview
4. iframe Integration
5. MkDocs Embedding
6. HTML Slide Embedding
7. iframe Styling
8. Minimal Borders
9. Creative Commons
10. Attribution License
11. CC BY-NC-SA
12. Fullscreen Icon
13. Copyright Icon
14. Collaboration Workflow
15. Peer Review
16. User Testing
17. Usability Studies
18. Portfolio Development
19. Diversity of MicroSims
20. Learning Graph
21. Concept Dependencies
22. Capstone Project
23. Project Evaluation
24. Working in Teams

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: Web Development Essentials](../02-web-development-essentials/index.md)
- [Chapter 6: MicroSim Architecture and Layout](../06-microsim-architecture-and-layout/index.md)
- [Chapter 8: Responsive Design Techniques](../08-responsive-design-techniques/index.md)
- [Chapter 12: Metadata, Packaging, and Quality](../12-metadata-packaging-and-quality/index.md)

---

## Beyond the Cowboy Programmer

There's a romantic image in software development: the lone programmer, headphones on, solving problems in isolation. The "cowboy coder" who rides solo and relies on individual brilliance.

But here's the reality: the greatest interactive intelligent textbooks—the ones filled with beautiful, pedagogically sound MicroSims—won't be built by individuals working alone. They'll be created by teams of people collaborating to build libraries of MicroSims that are robust, reusable, and easily customized by both humans and intelligent agents.

This chapter is about professional practice. You'll learn to integrate your MicroSims into real-world contexts—embedding them in documentation sites and slide presentations. You'll understand licensing so your work can be properly shared and attributed. And most importantly, you'll learn to work in teams, contributing to collaborative projects where the whole becomes greater than the sum of its parts.

Even if you work independently, professional habits matter. Something as simple as running `git pull` before writing code can save hours of merge conflict headaches. These habits will serve you throughout your career.

## Preview and Testing Tools

Before integrating MicroSims into production environments, you need efficient ways to preview and test them during development. Professional workflow depends on fast feedback loops.

### p5.js Editor Preview

The p5.js web editor at [editor.p5js.org](https://editor.p5js.org) provides instant preview capabilities. It's the fastest way to test code changes during initial development.

Key features for development:

| Feature | Benefit |
|---------|---------|
| Auto-run | See changes immediately |
| Console panel | Debug with console.log() |
| File management | Organize multi-file projects |
| Sketch sharing | Generate URLs for collaboration |
| Account sync | Access sketches from any device |

Best practices for p5.js Editor development:

- **Test in isolation first**: Verify core functionality before integration
- **Use the console**: Add temporary console.log() statements for debugging
- **Check mobile preview**: Use the editor's mobile preview mode
- **Export regularly**: Download your sketch.js to local development

```javascript
// Development debugging pattern
function draw() {
  // Temporary debugging - remove before integration
  if (frameCount % 60 === 0) {
    console.log('Ball position:', ballX, ballY);
    console.log('Velocity:', vx, vy);
  }

  // Production code
  background(240);
  drawBall();
}
```

### mkdocs serve

For MicroSims destined for MkDocs-based intelligent textbooks, `mkdocs serve` provides live local preview:

```bash
# Start local development server
mkdocs serve

# Server starts at http://127.0.0.1:8000
# Changes to markdown files trigger automatic reload
```

The `mkdocs serve` workflow:

1. Edit your MicroSim files (script.js, index.md)
2. Save changes
3. Browser automatically refreshes
4. See integrated result immediately

This creates a tight feedback loop where you can iterate rapidly on both code and documentation.

### Live Preview

Live preview refers to any setup where changes appear immediately without manual refresh. Professional developers configure their environments for maximum feedback speed.

Options for live preview:

| Tool | Use Case | Refresh Method |
|------|----------|----------------|
| p5.js Editor | Initial development | Auto-run on save |
| mkdocs serve | Documentation integration | File watcher |
| VS Code Live Server | Standalone HTML testing | Browser sync |
| Browser DevTools | CSS/styling tweaks | Hot reload |

Configure VS Code for automatic save on focus change:

```json
// settings.json
{
  "files.autoSave": "onFocusChange"
}
```

This means every time you switch from editor to browser, your changes are saved and the preview updates—eliminating the manual save step.

## iframe Integration

MicroSims become truly useful when embedded in context—within textbook pages, documentation, or presentations. The iframe element is the standard mechanism for this embedding.

### Basic iframe Structure

```html
<iframe
  src="./sims/bouncing-ball/main.html"
  width="100%"
  height="450"
  style="border: none; margin: 0; padding: 0;"
  title="Bouncing Ball Simulation"
  loading="lazy"
></iframe>
```

Essential iframe attributes:

| Attribute | Purpose | Recommendation |
|-----------|---------|----------------|
| `src` | Path to MicroSim HTML | Relative paths preferred |
| `width` | Horizontal size | Use `100%` for responsive |
| `height` | Vertical size | Fixed height in pixels |
| `style` | CSS styling | Remove borders, margins |
| `title` | Accessibility label | Describe the content |
| `loading` | Load behavior | `lazy` for performance |

### MkDocs Embedding

When embedding MicroSims in MkDocs markdown files, you have two options:

**Option 1: Direct HTML in Markdown**

```markdown
## Try the Simulation

Experiment with the bouncing ball simulation below:

<iframe
  src="../sims/bouncing-ball/main.html"
  width="100%"
  height="450"
  style="border: none;"
  title="Bouncing Ball Simulation">
</iframe>
```

**Option 2: Using the MkDocs iframe extension (if available)**

```markdown
## Try the Simulation

![type:video](../sims/bouncing-ball/main.html)
```

Path considerations for MkDocs:

```
docs/
├── chapters/
│   └── 05-physics/
│       └── index.md          # Your chapter page
└── sims/
    └── bouncing-ball/
        └── main.html         # MicroSim to embed
```

From the chapter index.md, the relative path to the MicroSim would be:
```
../../sims/bouncing-ball/main.html
```

### HTML Slide Embedding

MicroSims can enhance presentations created with HTML slide frameworks like Reveal.js, Remark, or Google Slides (via iframe).

**Reveal.js Integration:**

```html
<section>
  <h2>Interactive Demonstration</h2>
  <iframe
    src="sims/projectile-motion/main.html"
    width="800"
    height="500"
    style="border: none;"
    data-autoplay>
  </iframe>
  <aside class="notes">
    Let students explore before explaining the physics.
  </aside>
</section>
```

**Google Slides via Web Publishing:**

1. Host your MicroSim on GitHub Pages or similar
2. In Google Slides: Insert → Web page
3. Paste the public URL
4. Resize to fit your slide

Presentation tips:

- **Test beforehand**: Ensure MicroSims load on presentation hardware
- **Have a backup**: Screenshots in case of connectivity issues
- **Plan interaction time**: Allow students to experiment
- **Consider attention**: Pause or hide MicroSims when not in use

### iframe Styling

The default iframe appearance includes a border that disrupts page flow. Professional integration requires careful styling.

```css
/* Reset default iframe styling */
iframe.microsim {
  border: none;
  margin: 0;
  padding: 0;
  display: block;
  background-color: transparent;
}

/* Optional: subtle shadow for definition */
iframe.microsim-shadowed {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}
```

### Minimal Borders

The principle of minimal borders extends to the MicroSim itself. When a MicroSim appears in an iframe on a white page, decorative borders and backgrounds create visual noise.

**Inside main.html:**

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      overflow: hidden;
      background: transparent;
    }
    main {
      display: flex;
      justify-content: center;
    }
  </style>
</head>
<body>
  <main></main>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
  <script src="script.js"></script>
</body>
</html>
```

**Inside script.js:**

```javascript
function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Use transparent or page-matching background
  // Avoid thick borders or decorative frames
}

function draw() {
  // Use 'aliceblue' for drawing area - subtle, not white
  background('aliceblue');

  // Minimal visual chrome
  // No gradient borders, no shadows unless functionally needed
}
```

The goal: your MicroSim should feel like a natural part of the page, not a foreign element inserted into it.

#### Diagram: iframe Integration Architecture

<details markdown="1">
    <summary>iframe Integration Architecture</summary>
    Type: diagram

    Purpose: Show the relationship between host page, iframe, and MicroSim components, illustrating how styling flows across boundaries.

    Bloom Level: Understand

    Learning Objectives:
    - Understand the iframe isolation model
    - Identify where styles are applied at each level
    - Apply styling strategies for seamless integration

    Components:
    - Host Page (outer container):
      - Page styles (fonts, colors)
      - iframe element with inline styles
    - iframe Boundary (dashed line):
      - Security isolation indicator
      - "Styles don't cross this boundary" label
    - MicroSim Content (inner container):
      - main.html styles
      - Canvas element
      - p5.js DOM elements

    Connections:
    - Arrow from "src attribute" to MicroSim content
    - Arrow showing "iframe styles apply to frame only"
    - Arrow showing "MicroSim styles are self-contained"

    Visual Style:
    - Nested rectangles showing containment
    - Dashed line for security boundary
    - Color-coded regions (blue for host, green for MicroSim)

    Labels:
    - "border: none removes frame"
    - "background: transparent shows page behind"
    - "Responsive width, fixed height"

    Implementation: SVG or Mermaid diagram
</details>

## Licensing and Attribution

When you create a MicroSim, you're creating intellectual property. How others can use, share, and build upon your work depends on the license you choose.

### Creative Commons

Creative Commons (CC) licenses provide standardized ways to share creative works. For educational MicroSims, CC licenses enable broad use while protecting creator rights.

CC license components:

| Component | Symbol | Meaning |
|-----------|--------|---------|
| Attribution | BY | Credit the creator |
| ShareAlike | SA | Derivatives use same license |
| NonCommercial | NC | No commercial use |
| NoDerivatives | ND | No modifications allowed |

### CC BY-NC-SA License

For educational MicroSims, **CC BY-NC-SA** (Attribution-NonCommercial-ShareAlike) is often ideal:

- **BY**: Users must credit you
- **NC**: Prevents commercial exploitation without permission
- **SA**: Improvements must be shared under same terms

This creates a virtuous cycle: anyone can use and improve your MicroSim for education, but they must share their improvements back to the community.

```markdown
<!-- License notice in index.md -->

## License

This MicroSim is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).

You are free to:
- **Share** — copy and redistribute the material
- **Adapt** — remix, transform, and build upon the material

Under the following terms:
- **Attribution** — Credit the original creator
- **NonCommercial** — Not for commercial purposes
- **ShareAlike** — Distribute adaptations under the same license
```

### Attribution License Requirements

When using CC-licensed MicroSims, proper attribution includes:

1. **Creator name**: Who made the original
2. **Title**: Name of the MicroSim
3. **Source URL**: Where to find the original
4. **License**: Which CC license applies
5. **Changes**: Note if you modified it

Example attribution:

```markdown
"Projectile Motion Simulator" by Jane Doe,
available at https://example.com/sims/projectile,
is licensed under CC BY-NC-SA 4.0.
Modified to add wind resistance parameter.
```

### Fullscreen and Copyright Icons

Professional MicroSims include visual indicators for licensing and functionality. Standard practice includes two icons in the lower-right corner:

**Fullscreen icon**: Allows users to expand the MicroSim for better viewing

```javascript
// Add fullscreen button
function setup() {
  // ... canvas setup ...

  // Create fullscreen button
  let fullscreenBtn = createButton('⛶');
  fullscreenBtn.position(width - 40, height - 40);
  fullscreenBtn.mousePressed(toggleFullscreen);
  fullscreenBtn.attribute('title', 'Toggle fullscreen');
}

function toggleFullscreen() {
  let fs = fullscreen();
  fullscreen(!fs);
}
```

**Copyright icon**: Links to license information

```javascript
// Add license link
function setup() {
  // ... canvas setup ...

  // Create license link
  let licenseLink = createA(
    'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    'ⓒ',
    '_blank'
  );
  licenseLink.position(width - 70, height - 40);
  licenseLink.attribute('title', 'CC BY-NC-SA 4.0 License');
}
```

Standard icon positioning:

```
┌────────────────────────────────┐
│                                │
│       Drawing Region           │
│                                │
├────────────────────────────────┤
│  Control Region          ⓒ ⛶  │
└────────────────────────────────┘
```

## Collaboration Workflows

Real-world MicroSim development happens in teams. Whether you're contributing to an open-source textbook or building curriculum with colleagues, collaboration skills are essential.

### Working in Teams

Successful team collaboration requires:

| Practice | Description | Benefit |
|----------|-------------|---------|
| Clear ownership | Each MicroSim has a primary developer | Accountability |
| Shared standards | Common coding conventions | Consistency |
| Regular communication | Stand-ups, async updates | Alignment |
| Documented decisions | Why we chose this approach | Institutional knowledge |

Team structure for a MicroSim library:

- **Lead developer**: Overall architecture, quality standards
- **Subject matter experts**: Ensure pedagogical accuracy
- **MicroSim developers**: Build individual simulations
- **Reviewers**: Provide feedback on code and content
- **Testers**: Verify functionality across devices

### Git Workflow

Version control with Git is non-negotiable for team projects. Even when working alone, Git habits prevent disasters and enable collaboration later.

**The golden rule: Always pull before you push.**

```bash
# Start of every work session
cd microsims
git pull origin main

# Make changes, test them
# ... edit files ...

# Commit with meaningful message
git add docs/sims/new-microsim/
git commit -m "Add projectile motion MicroSim with angle/power controls"

# Pull again before pushing (in case others pushed)
git pull origin main

# Push your changes
git push origin main
```

**Branching strategy for larger teams:**

```bash
# Create feature branch for new MicroSim
git checkout -b feature/projectile-motion

# Do your work, commit regularly
git add .
git commit -m "Initial projectile motion implementation"

# Keep branch updated with main
git fetch origin
git rebase origin/main

# When ready, create pull request
git push -u origin feature/projectile-motion
# Then create PR on GitHub
```

!!! tip "The Pull Request Habit"
    Even if you have direct push access, use pull requests for significant changes. The review process catches bugs, improves code quality, and keeps the team informed about what's changing.

### Peer Review

Peer review improves quality through fresh perspectives. For MicroSims, review covers both code and pedagogy.

**Code review checklist:**

- [ ] Follows project coding conventions
- [ ] Variables and functions have clear names
- [ ] No console.log() statements left in production code
- [ ] Responsive design works at different widths
- [ ] describe() function provides accessibility
- [ ] No hardcoded values that should be parameters

**Pedagogical review checklist:**

- [ ] Learning objective is clear
- [ ] Cognitive load is appropriate
- [ ] Controls are intuitive
- [ ] Feedback helps understanding
- [ ] Edge cases don't confuse learners

**Review process:**

1. Developer creates pull request with description
2. Reviewer examines code, tests MicroSim
3. Reviewer leaves comments and suggestions
4. Developer addresses feedback
5. Reviewer approves
6. Merge to main branch

#### Diagram: Collaboration Workflow

<details markdown="1">
    <summary>Team Collaboration Workflow</summary>
    Type: workflow

    Purpose: Illustrate the complete workflow from task assignment through review to deployment, showing how team members interact at each stage.

    Bloom Level: Understand, Apply

    Learning Objectives:
    - Understand the stages of collaborative MicroSim development
    - Apply Git branching and PR strategies
    - Implement peer review practices

    Visual Style: Swimlane diagram with four lanes

    Swimlanes:
    1. **Project Lead**
    2. **Developer**
    3. **Reviewer**
    4. **Repository**

    Steps:
    1. Project Lead: "Assign MicroSim task"
       Hover: "Task includes learning objective, subject, and deadline"

    2. Developer: "git pull main"
       Hover: "Always start with latest code"

    3. Developer: "Create feature branch"
       Hover: "git checkout -b feature/microsim-name"

    4. Developer: "Develop and test"
       Hover: "Use p5.js editor, mkdocs serve"

    5. Developer: "Commit changes"
       Hover: "Clear commit messages, regular commits"

    6. Developer: "Push branch, create PR"
       Hover: "Include description, screenshots"

    7. Repository: "Run automated checks"
       Hover: "Linting, build verification"

    8. Reviewer: "Review code and pedagogy"
       Hover: "Use checklists, leave constructive comments"

    9. Decision: "Approved?"
       Yes → Step 10
       No → Developer: "Address feedback" → Step 6

    10. Reviewer: "Approve PR"

    11. Developer: "Merge to main"
        Hover: "Squash commits for clean history"

    12. Repository: "Deploy to staging"
        Hover: "Automatic deployment on merge"

    13. Project Lead: "Verify and announce"

    Color coding:
    - Blue: Development activities
    - Yellow: Review activities
    - Green: Approval/completion
    - Red: Decision points

    Implementation: Mermaid or vis-network diagram
</details>

### User Testing

User testing reveals how real students interact with your MicroSim. What seems obvious to you as the developer may confuse actual users.

Testing methods:

| Method | Description | When to Use |
|--------|-------------|-------------|
| Think-aloud | Users verbalize thoughts while using | Early development |
| Task-based | Users complete specific tasks | Feature validation |
| A/B testing | Compare two versions | Optimization |
| Analytics | Track usage patterns | Post-deployment |

**Conducting a think-aloud session:**

1. Recruit 3-5 representative users
2. Give them a task: "Find out how angle affects distance"
3. Ask them to say what they're thinking as they work
4. Don't help or explain—observe and note
5. Ask follow-up questions after

Things to watch for:

- Where do users hesitate?
- What do they try that doesn't work?
- What do they miss?
- What surprises them?

### Usability Studies

Usability studies are more formal than quick user tests. They produce actionable data about your MicroSim's effectiveness.

**Usability metrics:**

| Metric | How to Measure |
|--------|----------------|
| Task completion rate | Percentage who complete the goal |
| Time on task | Seconds to accomplish objective |
| Error rate | Number of mistakes before success |
| Satisfaction | Post-task survey (1-5 scale) |
| Learning gain | Pre/post concept test scores |

**Running a usability study:**

1. **Define objectives**: What questions do you want answered?
2. **Create tasks**: Specific, measurable activities
3. **Recruit participants**: 5-8 users for qualitative data
4. **Prepare materials**: Task scripts, observation forms
5. **Conduct sessions**: Consistent procedure for each
6. **Analyze results**: Look for patterns, not outliers
7. **Report findings**: Prioritized list of issues
8. **Iterate**: Fix issues, test again

## Portfolio Development

Your portfolio demonstrates your skills to employers, collaborators, and the educational community. A strong MicroSim portfolio shows both technical ability and pedagogical understanding.

### What to Include

A professional MicroSim portfolio contains:

1. **Showcase MicroSims** (3-5 best examples)
   - Fully functional and polished
   - Range of complexity levels
   - Different subject areas if possible

2. **Documentation for each**
   - Learning objectives
   - Target audience
   - Design decisions
   - Code highlights

3. **Technical demonstrations**
   - Responsive design examples
   - Accessibility implementations
   - Performance optimizations

4. **Collaborative contributions**
   - Pull requests to open-source projects
   - Code reviews you've conducted
   - Issues you've identified and resolved

### Diversity of MicroSims

A diverse portfolio demonstrates versatility:

| Dimension | Show Range |
|-----------|------------|
| Subject areas | Physics, math, biology, history |
| Complexity | Simple animations to model editors |
| Bloom levels | Remember through Create |
| Libraries | p5.js, Chart.js, vis-network |
| Interaction types | Sliders, drag-drop, quiz modes |

Don't just build five versions of bouncing ball. Challenge yourself with different visualization types and pedagogical approaches.

### Portfolio Presentation

Options for presenting your portfolio:

**GitHub Pages site:**

```
portfolio/
├── index.html          # Portfolio homepage
├── style.css           # Portfolio styling
├── sims/
│   ├── projectile/     # MicroSim 1
│   ├── sorting/        # MicroSim 2
│   └── genetics/       # MicroSim 3
└── about.html          # Your background
```

**Portfolio page structure:**

- Brief introduction (who you are, what you do)
- Featured MicroSims with live embeds
- Technical skills demonstrated
- Links to source code
- Contact information

## Learning Graphs and Concept Dependencies

Understanding how concepts relate helps you build better MicroSims and organize comprehensive learning experiences.

### Learning Graph

A learning graph represents concepts as nodes and dependencies as edges. Before you can understand concept B, you need to understand concept A.

```
[Variables] → [Functions] → [Animation Loop]
                    ↓
            [Event Handlers] → [Interactive Controls]
```

Learning graphs help you:

- **Sequence content**: Teach prerequisites first
- **Identify gaps**: What's missing from the curriculum
- **Plan MicroSims**: Which concepts need interactive support
- **Assess readiness**: What students should know before starting

### Concept Dependencies

When designing a MicroSim, identify its concept dependencies:

**Example: Projectile Motion MicroSim**

| Concept | Depends On |
|---------|------------|
| Projectile motion | Gravity, velocity, angles |
| Interactive visualization | p5.js basics, event handling |
| Parameter controls | DOM elements, slider creation |
| Real-time graphing | Coordinate systems, arrays |

If your target audience hasn't learned trigonometry, a MicroSim requiring angle calculations needs scaffolding or simplification.

#### Diagram: MicroSim Concept Dependency Graph

<details markdown="1">
    <summary>MicroSim Concept Dependency Graph</summary>
    Type: graph-model

    Purpose: Visualize how foundational concepts connect to advanced MicroSim capabilities, helping developers understand what prerequisite knowledge students need.

    Bloom Level: Analyze

    Learning Objectives:
    - Understand concept dependency relationships
    - Identify prerequisites for MicroSim topics
    - Plan learning sequences for curriculum development

    Node types:
    1. Foundational concepts (green circles)
       - Variables, Functions, Loops
       - HTML/CSS basics
       - Basic math (arithmetic)

    2. Intermediate concepts (blue circles)
       - p5.js setup/draw
       - Event handling
       - DOM manipulation
       - Algebra, trigonometry

    3. Advanced concepts (purple circles)
       - Responsive design
       - Complex animations
       - Data visualization
       - Physics simulation

    4. MicroSim types (orange squares)
       - Simple animation
       - Interactive controls
       - Quiz mode
       - Model editor

    Edge types:
    - "requires" (solid arrow): Hard prerequisite
    - "enhances" (dashed arrow): Helpful but not required

    Sample relationships:
    - Variables → Functions → p5.js setup/draw
    - Event handling → Interactive controls
    - Algebra + trigonometry → Physics simulation
    - All intermediate → Responsive design

    Layout: Hierarchical, foundational at bottom

    Interactive features:
    - Click node to highlight all prerequisites
    - Hover for concept description
    - Filter by category

    Implementation: vis-network with hierarchical layout
</details>

## Capstone Project

Your capstone project demonstrates mastery of the skills developed throughout this course. It's not just another MicroSim—it's a comprehensive project that showcases your abilities.

### Capstone Requirements

A successful capstone includes:

**Technical requirements:**

- [ ] Original MicroSim design (not a copy of course examples)
- [ ] Responsive layout working at multiple widths
- [ ] Accessible design with describe(), keyboard support
- [ ] Clean code following project conventions
- [ ] Complete documentation in index.md

**Pedagogical requirements:**

- [ ] Clear learning objective aligned with Bloom's Taxonomy
- [ ] Appropriate cognitive load (not overwhelming)
- [ ] Meaningful interactivity (not decoration)
- [ ] Feedback that supports learning

**Professional requirements:**

- [ ] Version controlled with Git (meaningful commits)
- [ ] Licensed appropriately (CC BY-NC-SA recommended)
- [ ] Tested on multiple devices
- [ ] Peer reviewed by classmate

### Project Evaluation

Capstone projects are evaluated on multiple dimensions:

| Category | Weight | Criteria |
|----------|--------|----------|
| Technical execution | 25% | Code quality, responsiveness, performance |
| Pedagogical design | 30% | Learning objective clarity, appropriate interaction, feedback |
| Documentation | 15% | Metadata completeness, clear explanations |
| Accessibility | 15% | Screen reader support, keyboard navigation, contrast |
| Professionalism | 15% | Git history, licensing, peer review participation |

**Scoring rubric (excerpt):**

| Criterion | Excellent (4) | Good (3) | Adequate (2) | Needs Work (1) |
|-----------|---------------|----------|--------------|----------------|
| Learning objective | Precisely defined, measurable | Clear but could be more specific | Vague or overly broad | Missing or inappropriate |
| Interactivity | Meaningful, enhances understanding | Functional, supports learning | Present but superficial | Minimal or confusing |
| Code quality | Clean, well-documented, efficient | Readable, few issues | Works but messy | Hard to understand |
| Accessibility | Full compliance | Most features accessible | Basic accessibility | Significant barriers |

### Capstone Timeline

| Week | Milestone |
|------|-----------|
| 1 | Proposal: Learning objective, target audience, concept dependencies |
| 2 | Design: Sketches, control specifications, assessment strategy |
| 3-4 | Development: Core functionality, iteration based on testing |
| 5 | Documentation: Complete metadata, user instructions, code comments |
| 6 | Review: Peer review, revision, final testing |
| 7 | Presentation: Demonstrate to class, explain design decisions |

#### Diagram: Capstone Project Rubric Evaluator

<details markdown="1">
    <summary>Capstone Rubric Evaluator MicroSim</summary>
    Type: microsim

    Purpose: Allow students to self-evaluate their capstone projects against the rubric criteria, generating scores and identifying areas for improvement.

    Bloom Level: Evaluate

    Learning Objectives:
    - Apply evaluation criteria to own work
    - Identify strengths and weaknesses in project
    - Prioritize improvements based on rubric weights

    Canvas Layout (800x600):
    - Left panel (300x500): Rubric criteria with radio buttons
    - Right panel (450x500): Score visualization and feedback
    - Bottom (800x100): Total score and grade

    Visual Elements:
    - 5 category sections matching evaluation rubric
    - Each section has 4 radio buttons (1-4 scale)
    - Radar chart showing scores by category
    - Progress bar for total score
    - Grade indicator (A/B/C/D/F)
    - Personalized feedback text

    Categories and Weights:
    1. Technical Execution (25%): 4 sub-criteria
    2. Pedagogical Design (30%): 4 sub-criteria
    3. Documentation (15%): 3 sub-criteria
    4. Accessibility (15%): 4 sub-criteria
    5. Professionalism (15%): 3 sub-criteria

    Interactive Controls:
    - Radio buttons for each criterion
    - "Calculate Score" button
    - "View Feedback" toggle
    - "Export Report" button (generates markdown)

    Behavior:
    - Scores update in real-time as selections change
    - Radar chart reflects category strengths
    - Lowest-scoring areas highlighted
    - Feedback provides specific improvement suggestions

    Default Parameters:
    - All criteria start unselected
    - Requires completing all sections before calculating

    Implementation: p5.js with DOM elements for radio buttons, Chart.js for radar
</details>

## Building Something Greater

Throughout this course, you've progressed from understanding basic p5.js sketches to designing pedagogically sound, accessible, professionally documented MicroSims. You've learned technical skills—responsive design, Chart.js, vis-network—and professional practices—Git workflows, peer review, user testing.

But the most important lesson is this: the future of educational technology isn't built by individuals working alone. The greatest intelligent textbooks will emerge from communities of practice—teachers, developers, designers, and students collaborating to build and share knowledge.

When you contribute a well-crafted MicroSim to an open-source project, you're not just writing code. You're adding to humanity's collective educational resources. Your simulation might help a student in another country understand physics. Your documentation might guide another developer toward better practices. Your review comments might shape how the next contributor approaches their work.

That's the real capstone: becoming part of a community that builds together.

!!! question "Final Challenge: Contribute to a MicroSim Library"
    After completing your capstone project:

    1. Identify an open-source MicroSim collection that accepts contributions
    2. Review their contribution guidelines and coding standards
    3. Find a gap—a concept that needs a MicroSim, or an existing one that needs improvement
    4. Submit a pull request with your contribution
    5. Respond constructively to reviewer feedback

    This isn't a graded assignment. It's an invitation to join the community.

## Key Takeaways

- **Professional workflow** depends on fast feedback loops—use p5.js editor, mkdocs serve, and live preview for rapid iteration
- **iframe integration** requires attention to styling—minimal borders, transparent backgrounds, responsive widths
- **Creative Commons licensing** (especially CC BY-NC-SA) enables sharing while protecting creator rights
- **Team collaboration** multiplies what's possible—use Git workflows, peer review, and clear communication
- **User testing** reveals what actual students experience—watch them use your MicroSim without helping
- **Portfolio diversity** demonstrates versatility—show range across subjects, libraries, and interaction types
- **Learning graphs** reveal concept dependencies—understand what students need to know before your MicroSim helps them
- **The capstone project** synthesizes everything—technical skill, pedagogical design, documentation, and professionalism

Remember: `git pull` before you start. Review others' work as you'd want yours reviewed. Build for the community, not just yourself.

## Next Steps

Congratulations on completing this course! Your next steps:

1. **Finish your capstone project** using the timeline and rubric provided
2. **Build your portfolio** with your best MicroSims
3. **Contribute to open source** by sharing your work with educational communities
4. **Keep learning** as libraries and best practices evolve
5. **Teach others** what you've learned—the best way to solidify knowledge

The MicroSim ecosystem grows with every contribution. Make yours count.

## References

1. GitHub. (2024). Git Handbook. https://guides.github.com/introduction/git-handbook/

2. Creative Commons. (2024). About CC Licenses. https://creativecommons.org/share-your-work/cclicenses/

3. MkDocs. (2024). MkDocs Documentation. https://www.mkdocs.org/

4. Nielsen, J. (2000). Why You Only Need to Test with 5 Users. Nielsen Norman Group.

5. Reveal.js. (2024). The HTML Presentation Framework. https://revealjs.com/

6. p5.js. (2024). Get Started. https://p5js.org/get-started/

7. Atlassian. (2024). Git Feature Branch Workflow. https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow
