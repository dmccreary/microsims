---
title: Pedagogy, Assessment, and Accessibility
description: Educational foundations, cognitive load theory, PRIMM methodology, formative assessment, and accessibility standards for inclusive MicroSim design
generated_by: claude skill chapter-content-generator
date: 2025-01-25
version: 0.03
---

# Pedagogy, Assessment, and Accessibility

## Summary

This chapter covers pedagogical foundations and accessibility standards for creating effective and inclusive MicroSims. You will learn cognitive load theory including extraneous, intrinsic, and germane load, Universal Design for Learning principles, and scaffolding strategies. The chapter introduces the PRIMM methodology (Predict-Run-Investigate-Modify-Make) and formative assessment techniques including quiz mode. You will also learn accessibility standards including the describe() function for screen readers, WCAG guidelines, color contrast requirements, keyboard navigation, and designing for educational equity with low-bandwidth and older device support.

## Concepts Covered

This chapter covers the following 29 concepts from the learning graph:

1. Cognitive Load Theory
2. Extraneous Load
3. Intrinsic Load
4. Germane Load
5. Universal Design Learning
6. Multiple Representations
7. Scaffolding Strategies
8. Guided Exploration
9. Open Exploration
10. PRIMM Methodology
11. Predict Phase
12. Run Phase
13. Investigate Phase
14. Modify Phase
15. Make Phase
16. Formative Assessment
17. Quiz Mode
18. Flash Card MicroSim
19. Sorter MicroSim
20. Model Editor
21. describe() Function
22. Screen Reader Support
23. Color Contrast
24. Keyboard Navigation
25. WCAG Guidelines
26. Accessible Design
27. Educational Equity
28. Low-Bandwidth Design
29. Older Device Support

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Educational MicroSims](../01-intro-to-educational-microsims/index.md)
- [Chapter 3: Getting Started with p5.js](../03-getting-started-with-p5js/index.md)
- [Chapter 9: Bloom's Taxonomy and Learning Objectives](../09-blooms-taxonomy-and-learning-objectives/index.md)
- [Chapter 10: Charts, Diagrams, and Infographics](../10-charts-diagrams-and-infographics/index.md)

---

## The Simplicity Question

You've learned to build MicroSims with p5.js, Chart.js, and vis-network. You can add sliders, buttons, dropdowns, and animation controls. But here's a question that every MicroSim designer faces: Should your simulation be clean and simple with just one slider controlling speed, or should you demonstrate your developer prowess by adding a dozen controls for every possible parameter?

The answer isn't about showing off technical skills. It's about understanding how students learn. In this chapter, we explore the science of learning—cognitive load theory, scaffolding strategies, and assessment integration—so you can make informed decisions about feature complexity. We'll discover that adding features isn't always helpful, and that sometimes a well-placed "Quiz Mode" can transform a passive animation into an active learning experience.

We'll also address a fundamental principle: MicroSims must work for everyone. Accessibility isn't an afterthought—it's a core design requirement that ensures students with disabilities, those on older devices, and learners in low-bandwidth environments can all benefit from interactive learning.

## Cognitive Load Theory

Cognitive load theory, developed by educational psychologist John Sweller in the 1980s, explains why some learning experiences feel overwhelming while others feel engaging. The theory is based on a simple fact: working memory has limited capacity. When we overload working memory, learning stops.

Understanding cognitive load directly impacts MicroSim design. Every slider, button, label, and animation consumes some of that precious working memory capacity. The question isn't "Can I add this feature?" but "Should I add this feature given what I'm trying to teach?"

Sweller identified three types of cognitive load:

| Load Type | Definition | MicroSim Implication |
|-----------|------------|----------------------|
| Intrinsic Load | Complexity inherent to the material itself | Can't eliminate, but can sequence appropriately |
| Extraneous Load | Unnecessary complexity from poor design | Minimize through good UI/UX design |
| Germane Load | Effort devoted to building mental models | Maximize through focused interactions |

### Intrinsic Load

Intrinsic load represents the inherent complexity of what you're teaching. Some concepts are simply more complex than others. Teaching projectile motion requires understanding angles, velocity, gravity, and time—that's intrinsic complexity you can't eliminate.

However, you can manage intrinsic load through sequencing. Instead of presenting all variables at once, introduce them gradually:

1. First: Show a ball falling with gravity only
2. Then: Add horizontal velocity
3. Next: Introduce launch angle
4. Finally: Allow all parameters to vary

This sequencing doesn't reduce intrinsic load—it distributes it over time so working memory isn't overwhelmed.

### Extraneous Load

Extraneous load is the villain of educational design. It's cognitive effort wasted on things that don't contribute to learning. Every unclear label, cluttered interface, and unnecessary feature adds extraneous load.

Consider two versions of the same physics MicroSim:

| Design Choice | High Extraneous Load | Low Extraneous Load |
|---------------|----------------------|---------------------|
| Controls | 12 sliders for all parameters | 3 sliders for key parameters |
| Labels | Technical abbreviations (v₀, θ, g) | Clear words (Initial Speed, Angle, Gravity) |
| Layout | Controls scattered randomly | Organized in logical groups |
| Animation | Trails, particles, lens flares | Clean trajectory line |
| Colors | Rainbow gradient background | Simple contrast colors |

The low extraneous load design isn't less powerful—it's more effective because students spend cognitive resources on physics, not on decoding the interface.

!!! tip "The Cognitive Load Test"
    Before adding a feature, ask: "Does this directly support the learning objective?" If the answer is no, the feature adds extraneous load. Remove it or hide it behind an "Advanced Options" panel.

### Germane Load

Germane load is productive cognitive effort—the mental work of building schemas, making connections, and constructing understanding. This is the load we want to maximize.

Interactive features that promote germane load include:

- **Prediction prompts**: "What do you think will happen when..."
- **Comparison tools**: Side-by-side parameter configurations
- **Explanation requests**: "Why did the ball land there?"
- **Connection highlights**: Linking variables to outcomes visually

The goal is to design MicroSims where most cognitive effort goes toward germane load—building understanding—rather than extraneous load—figuring out the interface.

#### Diagram: Cognitive Load Balance Visualization

<details markdown="1">
    <summary>Cognitive Load Balance Visualization</summary>
    Type: microsim

    Purpose: Help students visualize how different design choices affect the balance of cognitive load types, demonstrating why simpler interfaces often lead to better learning.

    Bloom Level: Understand, Analyze

    Learning Objectives:
    - Understand the relationship between interface complexity and cognitive load
    - Analyze how design choices shift load between extraneous and germane categories
    - Apply cognitive load principles to MicroSim design decisions

    Canvas Layout (700x500):
    - Drawing area (700x400): Stacked bar visualization
    - Control area (700x100): Sliders and indicators

    Visual Elements:
    - Horizontal stacked bar showing three load types:
      - Red section: Extraneous Load
      - Blue section: Intrinsic Load (fixed)
      - Green section: Germane Load
    - Total capacity line (working memory limit)
    - Warning indicator when total exceeds capacity
    - Design elements panel showing toggles

    Interactive Controls:
    - Slider: Number of visible controls (1-15)
    - Slider: Interface clarity (1-10)
    - Toggle: Show advanced options inline vs. hidden
    - Display: Current load percentages

    Behavior:
    - As controls increase, extraneous load grows
    - As clarity increases, extraneous load shrinks
    - When total exceeds capacity, "Learning Blocked" warning appears
    - Green (germane) load expands to fill remaining capacity
    - Intrinsic load remains constant

    Default Parameters:
    - Controls: 5
    - Clarity: 7
    - Inline options: Off

    Implementation: p5.js with animated bar transitions
</details>

## Universal Design for Learning

Universal Design for Learning (UDL) is a framework developed by CAST (Center for Applied Special Technology) that guides the creation of flexible learning experiences. UDL isn't about accommodating disabilities—it's about designing for the full range of human variability from the start.

UDL rests on three core principles:

| Principle | Description | MicroSim Application |
|-----------|-------------|----------------------|
| Multiple Means of Engagement | Different ways to motivate learners | Options, challenges, personalization |
| Multiple Means of Representation | Different ways to present information | Visual, textual, auditory explanations |
| Multiple Means of Action & Expression | Different ways for learners to demonstrate knowledge | Various input methods, output formats |

### Multiple Representations

The concept of multiple representations is central to effective MicroSims. Different students process information differently—some are visual learners, others prefer numerical data, and many benefit from seeing the same concept represented in multiple ways simultaneously.

A well-designed physics MicroSim might show:

- **Visual**: Animated ball trajectory
- **Graphical**: Position-time and velocity-time charts
- **Numerical**: Real-time values displayed
- **Symbolic**: Equations with current values substituted
- **Verbal**: Text description of what's happening

Not every MicroSim needs all five representations, but including at least two or three dramatically improves learning for diverse students.

```javascript
// Example: Multiple representations in draw()
function draw() {
  // Visual representation
  drawTrajectory();
  drawBall(ballX, ballY);

  // Numerical representation
  fill(0);
  text(`Position: (${ballX.toFixed(1)}, ${ballY.toFixed(1)})`, 20, 30);
  text(`Velocity: ${velocity.toFixed(2)} m/s`, 20, 50);

  // Graphical representation (sidebar chart)
  updatePositionGraph(ballX, ballY);

  // Symbolic representation
  text(`y = y₀ + v₀t - ½gt²`, 20, 70);
  text(`y = ${y0} + ${v0}(${time.toFixed(2)}) - 0.5(9.8)(${time.toFixed(2)}²)`, 20, 90);
}
```

### Scaffolding Strategies

Scaffolding refers to temporary support structures that help learners accomplish tasks they couldn't complete independently. As learners gain competence, scaffolds are gradually removed—a process called "fading."

MicroSims can implement scaffolding in several ways:

| Scaffolding Type | Description | Implementation |
|------------------|-------------|----------------|
| Procedural | Step-by-step guidance | Tutorial overlays, guided tours |
| Conceptual | Hints about what to notice | Highlight important elements |
| Strategic | Problem-solving approaches | Suggestion boxes, "Try this" prompts |
| Metacognitive | Reflection prompts | "Why do you think that happened?" |

The key is making scaffolds removable. A MicroSim that always holds the student's hand never develops independent thinking. Consider these approaches:

- **Progressive revelation**: Start with limited controls, unlock more as students demonstrate mastery
- **Hint systems**: Available on demand but not intrusive
- **Difficulty levels**: Beginner mode with scaffolds, Expert mode without
- **Self-paced fading**: Students choose when to remove supports

### Guided vs. Open Exploration

One of the most important design decisions is where to position your MicroSim on the guided-to-open exploration spectrum.

**Guided Exploration** provides structure:

- Specific tasks to complete
- Predetermined sequence
- Clear success criteria
- Immediate feedback

**Open Exploration** provides freedom:

- No preset objectives
- Student-directed discovery
- Multiple valid outcomes
- Emergent learning

Neither approach is universally better. The choice depends on your learning objectives and students' prior knowledge:

| Situation | Recommended Approach |
|-----------|----------------------|
| Students new to the topic | Guided exploration |
| Building foundational concepts | Guided with some freedom |
| Applying known concepts | Mix of guided and open |
| Deep conceptual understanding | Open with optional guidance |
| Creative application | Open exploration |

Most effective MicroSims offer both modes—a guided tutorial for beginners and a sandbox mode for exploration.

#### Diagram: Exploration Mode Selector

<details markdown="1">
    <summary>Exploration Mode Selector</summary>
    Type: diagram

    Purpose: Illustrate the spectrum from guided to open exploration and help designers choose appropriate scaffolding levels.

    Bloom Level: Understand

    Learning Objectives:
    - Understand the trade-offs between guided and open exploration
    - Identify appropriate exploration modes for different learning contexts

    Components:
    - Horizontal spectrum bar from "Fully Guided" to "Fully Open"
    - Five marked positions along spectrum:
      1. Tutorial Mode (far left)
      2. Guided Practice
      3. Scaffolded Exploration (center)
      4. Supported Sandbox
      5. Free Exploration (far right)
    - Below each position: characteristics list
    - Above spectrum: "Student Prior Knowledge" arrow (low to high)
    - Below spectrum: "Student Autonomy" arrow (low to high)

    Visual Style:
    - Gradient from blue (guided) to green (open)
    - Icons at each position (hand pointing → compass)
    - Dotted line showing "ideal progression" through modes

    Labels:
    - "Best for novices" near guided end
    - "Best for experts" near open end
    - "Adaptive scaffolding zone" in middle

    Implementation: SVG or p5.js static diagram
</details>

## The PRIMM Methodology

PRIMM (Predict-Run-Investigate-Modify-Make) is a pedagogical framework specifically designed for teaching programming concepts, developed by Sue Sentance and her colleagues. It's particularly relevant to MicroSim design because it provides a structured approach to interactive learning that maximizes engagement and understanding.

### The Five PRIMM Phases

| Phase | Student Activity | MicroSim Support |
|-------|------------------|------------------|
| **Predict** | Guess what will happen | Prediction input before running |
| **Run** | Execute and observe | Play/run button, animation |
| **Investigate** | Examine how it works | Code view, variable inspection |
| **Modify** | Make small changes | Parameter sliders, editable values |
| **Make** | Create something new | Sandbox mode, model editor |

#### Predict Phase

In the Predict phase, students form hypotheses before seeing results. This activates prior knowledge and creates cognitive engagement. When predictions are wrong, students experience productive confusion that motivates learning.

MicroSim implementation:

```javascript
// Before running simulation
let predictionMode = true;

function setup() {
  // Show prediction interface first
  showPredictionPrompt("Where will the ball land? Click to mark your prediction.");
}

function mouseClicked() {
  if (predictionMode) {
    predictionX = mouseX;
    drawPredictionMarker(predictionX);
    predictionMode = false;
    showRunButton();
  }
}

function showResults() {
  // Compare actual vs predicted
  let error = abs(actualLanding - predictionX);
  showFeedback(`Your prediction was ${error} pixels away!`);
}
```

#### Run Phase

The Run phase lets students observe the simulation in action. The key is making the execution visible and understandable—not just a flash of results.

Design considerations:

- Use appropriate animation speed (not too fast)
- Highlight key moments in the process
- Allow pause and replay
- Show intermediate states, not just final results

#### Investigate Phase

Investigation encourages students to explore how the simulation works. This might involve:

- Viewing the code structure
- Examining variable values in real-time
- Tracing execution step-by-step
- Identifying cause-effect relationships

A well-designed MicroSim includes an "Investigate" mode that exposes inner workings without overwhelming novices.

#### Modify Phase

Modification bridges understanding and creation. Students make small, targeted changes to existing code or parameters, observing how changes affect outcomes.

This phase is where sliders and controls shine—each adjustment is a modification experiment. The key is connecting modifications to conceptual understanding:

```javascript
// Show connection between slider and physics equation
function drawEquation() {
  // Display equation with current values highlighted
  fill(0);
  text("v = v₀ + at", 20, 50);
  fill(255, 0, 0); // Highlight modified value
  text(`v = ${initialVelocity} + (${acceleration})(${time.toFixed(2)})`, 20, 70);
  text(`v = ${(initialVelocity + acceleration * time).toFixed(2)} m/s`, 20, 90);
}
```

#### Make Phase

The Make phase represents the highest level of engagement—students create something new. This might be:

- Building a custom model from scratch
- Designing a challenge for peers
- Extending the simulation with new features
- Applying concepts to a novel problem

Not every MicroSim needs a Make phase, but those targeting higher Bloom's levels (Create) should include model editors or sandbox environments.

#### Diagram: PRIMM Cycle Interactive

<details markdown="1">
    <summary>PRIMM Cycle Interactive</summary>
    Type: microsim

    Purpose: Demonstrate the PRIMM methodology through an interactive cycle that students navigate, experiencing each phase with a simple physics concept.

    Bloom Level: Apply, Analyze

    Learning Objectives:
    - Experience each PRIMM phase firsthand
    - Understand how phases build on each other
    - Apply PRIMM structure to future learning activities

    Canvas Layout (750x550):
    - Center (400x400): Main simulation area
    - Right sidebar (150x400): Phase navigator
    - Bottom (750x150): Phase-specific controls and prompts

    Visual Elements:
    - Circular PRIMM diagram showing all 5 phases
    - Current phase highlighted with glow
    - Progress indicator (checkmarks for completed phases)
    - Central area changes based on active phase:
      - Predict: Input field and target area
      - Run: Animated simulation
      - Investigate: Code snippet with highlights
      - Modify: Parameter sliders
      - Make: Blank canvas with tools

    Interactive Controls:
    - Phase navigation buttons (can only advance, not skip)
    - Phase-specific controls:
      - Predict: Click to place marker
      - Run: Play/Pause/Replay buttons
      - Investigate: "Show Variables" toggle
      - Modify: 3 parameter sliders
      - Make: Drawing tools

    Behavior:
    - Must complete each phase before advancing
    - Predict: Record prediction before simulation runs
    - Run: Show animation, compare to prediction
    - Investigate: Highlight variables as they change
    - Modify: Allow parameter changes, observe effects
    - Make: Free-form creation mode

    Default Parameters:
    - Start in Predict phase
    - Simple projectile motion example
    - All phases locked initially

    Implementation: p5.js with state machine for phase management
</details>

## Formative Assessment

Formative assessment is evaluation conducted during learning to guide instruction and provide feedback—in contrast to summative assessment, which evaluates learning after instruction. MicroSims are naturally suited for formative assessment because they can track student interactions and provide immediate feedback.

### Types of Formative Assessment in MicroSims

| Assessment Type | Description | Example |
|-----------------|-------------|---------|
| Embedded Questions | Questions integrated into simulation | "Before continuing, what do you predict..." |
| Performance Tracking | Monitoring interaction patterns | Time spent, parameters tried, sequences |
| Check-Your-Understanding | Periodic knowledge checks | Multiple-choice after exploration |
| Reflection Prompts | Metacognitive questions | "What surprised you about this?" |

### Quiz Mode

Quiz Mode transforms a passive exploration into an active assessment experience. Instead of freely manipulating parameters, students must demonstrate understanding by achieving specific goals or answering embedded questions.

A well-designed Quiz Mode includes:

- **Clear objectives**: "Make the ball land in the target zone"
- **Limited attempts**: Creates stakes without excessive frustration
- **Immediate feedback**: Shows why attempts succeeded or failed
- **Progressive difficulty**: Starts easy, increases challenge
- **Score tracking**: Provides performance metrics

However, Quiz Mode adds complexity. Remember the cognitive load discussion—assessment features should support learning, not overwhelm the interface.

```javascript
let quizMode = false;
let targetZone = { x: 500, y: 300, radius: 30 };
let attempts = 0;
let maxAttempts = 3;

function toggleQuizMode() {
  quizMode = !quizMode;
  if (quizMode) {
    // Hide some controls to focus attention
    angleSlider.hide();
    // Show target
    showTarget = true;
    // Reset attempts
    attempts = 0;
  }
}

function checkSuccess() {
  let distance = dist(ballX, ballY, targetZone.x, targetZone.y);
  if (distance < targetZone.radius) {
    showSuccessMessage(`Great job! You hit the target in ${attempts} attempts!`);
    return true;
  }
  attempts++;
  if (attempts >= maxAttempts) {
    showHint("Try adjusting the power. Higher power means further distance.");
  }
  return false;
}
```

!!! warning "Quiz Mode Complexity"
    Adding Quiz Mode can push a MicroSim over the complexity edge. Consider offering Quiz Mode as an optional layer that students or instructors can enable, rather than building it into the core experience.

### Flash Card MicroSim

Flash card MicroSims target the Remember level of Bloom's Taxonomy. They use spaced repetition and immediate feedback to help students memorize facts, definitions, and associations.

Key design features:

- **Question display**: Clear, readable prompts
- **Response mechanism**: Click, type, or select answers
- **Immediate feedback**: Correct/incorrect indication
- **Spaced repetition**: Return to missed items more frequently
- **Progress tracking**: Show cards mastered vs. remaining

```javascript
// Flash card data structure
let flashCards = [
  { question: "What does HTML stand for?",
    answer: "HyperText Markup Language",
    timesCorrect: 0,
    nextReview: 0 },
  { question: "What is CSS used for?",
    answer: "Styling web pages",
    timesCorrect: 0,
    nextReview: 0 }
];

function selectNextCard() {
  // Prioritize cards due for review
  let dueCards = flashCards.filter(c => c.nextReview <= millis());
  if (dueCards.length > 0) {
    return random(dueCards);
  }
  return random(flashCards);
}

function recordAnswer(card, correct) {
  if (correct) {
    card.timesCorrect++;
    // Exponential backoff: review less frequently as mastery increases
    card.nextReview = millis() + (60000 * Math.pow(2, card.timesCorrect));
  } else {
    card.timesCorrect = Math.max(0, card.timesCorrect - 1);
    card.nextReview = millis() + 30000; // Review again soon
  }
}
```

### Sorter MicroSim

Sorter MicroSims ask students to categorize, sequence, or arrange items—testing understanding of relationships and classifications. They're effective for both Remember (recall categories) and Understand (explain why items belong together) levels.

Design considerations:

- **Drag-and-drop interface**: Intuitive interaction
- **Clear target zones**: Where items should go
- **Visual feedback**: Items snap into place or reject
- **Partial credit**: Acknowledge partially correct arrangements
- **Explanation prompts**: "Why did you place that item there?"

#### Diagram: Sorter MicroSim Template

<details markdown="1">
    <summary>Cognitive Load Sorter MicroSim</summary>
    Type: microsim

    Purpose: Students sort MicroSim design features into cognitive load categories (extraneous, intrinsic, germane), reinforcing understanding of cognitive load theory.

    Bloom Level: Understand, Analyze

    Learning Objectives:
    - Categorize design features by cognitive load type
    - Analyze why features contribute to specific load types
    - Apply cognitive load concepts to evaluate MicroSim designs

    Canvas Layout (800x500):
    - Left side (250x400): Item bank with draggable cards
    - Right side (500x400): Three drop zones (columns)
    - Bottom (800x100): Score and feedback area

    Visual Elements:
    - 12 draggable cards with design features:
      - "Rainbow gradient background" (extraneous)
      - "Clear axis labels" (reduces extraneous)
      - "Physics equations displayed" (intrinsic)
      - "Prediction prompt" (germane)
      - "Particle effects" (extraneous)
      - "Step-by-step tutorial" (germane)
      - "12 parameter sliders" (extraneous)
      - "Core concept animation" (intrinsic)
      - "Variable relationships table" (germane)
      - "Decorative borders" (extraneous)
      - "Multiple representations" (germane)
      - "Advanced math notation" (intrinsic)
    - Three labeled columns:
      - Red: "Extraneous Load"
      - Blue: "Intrinsic Load"
      - Green: "Germane Load"
    - Score display: X/12 correct

    Interactive Controls:
    - Drag cards to columns
    - "Check Answers" button
    - "Reset" button
    - "Show Explanations" toggle (after checking)

    Behavior:
    - Cards snap to columns when dropped
    - Correct placements glow green
    - Incorrect placements glow red and show correct category
    - Explanation tooltip on hover after checking

    Implementation: p5.js with drag-and-drop library or custom implementation
</details>

### Model Editor

Model editors represent the Create level of Bloom's Taxonomy—students construct their own simulations or models. This is the most complex assessment type but provides the deepest learning.

A model editor might allow students to:

- Define variables and their relationships
- Create visual representations
- Specify initial conditions
- Test their model against expected behavior
- Compare their model to expert models

## Accessibility Standards

Accessibility isn't optional—it's a fundamental requirement for educational technology. MicroSims must be usable by students with visual, auditory, motor, and cognitive disabilities. Beyond legal requirements, accessible design benefits everyone through clearer interfaces and more flexible interaction options.

### The describe() Function

The p5.js `describe()` function provides screen reader support by adding an accessible description to your canvas:

```javascript
function setup() {
  createCanvas(400, 400);
  describe('An interactive physics simulation showing projectile motion. ' +
           'A ball launches from the left side and follows a parabolic path ' +
           'based on the angle and power settings. Use the sliders below to ' +
           'adjust launch parameters.');
}
```

Best practices for `describe()`:

- **Be specific**: Describe what the simulation shows and does
- **Update dynamically**: Change description as state changes
- **Include instructions**: Tell users how to interact
- **Mention key outcomes**: What should users observe?

For dynamic updates, call `describe()` when significant changes occur:

```javascript
function updateDescription() {
  let state = isRunning ? "Animation is playing." : "Animation is paused.";
  let position = `Ball is at position (${ballX.toFixed(0)}, ${ballY.toFixed(0)}).`;
  describe(`Projectile motion simulation. ${state} ${position} ` +
           `Current angle: ${angle} degrees. Current power: ${power}.`);
}
```

### Screen Reader Support

Beyond `describe()`, comprehensive screen reader support includes:

| Element | Requirement | Implementation |
|---------|-------------|----------------|
| Controls | Labeled and focusable | Use p5.js DOM elements with labels |
| Values | Announced when changed | ARIA live regions |
| Instructions | Available before interaction | Text above canvas |
| Results | Announced clearly | Status updates |

Example of accessible slider creation:

```javascript
function setup() {
  // Create labeled slider
  let sliderLabel = createP('Launch Angle:');
  sliderLabel.attribute('id', 'angle-label');

  angleSlider = createSlider(0, 90, 45);
  angleSlider.attribute('aria-labelledby', 'angle-label');
  angleSlider.attribute('aria-valuemin', '0');
  angleSlider.attribute('aria-valuemax', '90');
  angleSlider.attribute('role', 'slider');

  // Value display with live region
  angleValue = createSpan('45°');
  angleValue.attribute('aria-live', 'polite');
}
```

### Color Contrast

Color contrast affects users with visual impairments and users viewing screens in bright environments. WCAG 2.1 guidelines specify minimum contrast ratios:

| Content Type | Minimum Ratio | Example |
|--------------|---------------|---------|
| Normal text | 4.5:1 | Black on white (21:1) ✓ |
| Large text (18pt+) | 3:1 | Dark gray on white (7:1) ✓ |
| UI components | 3:1 | Button borders, focus indicators |
| Graphical objects | 3:1 | Chart lines, data points |

Never rely on color alone to convey information. Use color plus another indicator:

```javascript
// Bad: Color alone indicates state
function drawStatus(isActive) {
  fill(isActive ? 'green' : 'red');
  ellipse(x, y, 20, 20);
}

// Good: Color plus shape/text
function drawStatus(isActive) {
  fill(isActive ? 'green' : 'red');
  if (isActive) {
    ellipse(x, y, 20, 20); // Circle for active
    text('✓', x, y);       // Checkmark
  } else {
    rect(x-10, y-10, 20, 20); // Square for inactive
    text('✗', x, y);          // X mark
  }
}
```

### Keyboard Navigation

All interactive elements must be operable via keyboard. This supports users who can't use a mouse, including those using screen readers, switch devices, or voice control.

Required keyboard functionality:

| Key | Action |
|-----|--------|
| Tab | Move focus to next interactive element |
| Shift+Tab | Move focus to previous element |
| Enter/Space | Activate buttons |
| Arrow keys | Adjust sliders, navigate options |
| Escape | Close dialogs, cancel operations |

```javascript
function keyPressed() {
  // Keyboard controls for simulation
  if (keyCode === ENTER || key === ' ') {
    toggleAnimation();
  }
  if (keyCode === LEFT_ARROW) {
    angleSlider.value(angleSlider.value() - 1);
    updateSimulation();
  }
  if (keyCode === RIGHT_ARROW) {
    angleSlider.value(angleSlider.value() + 1);
    updateSimulation();
  }
  if (keyCode === ESCAPE) {
    resetSimulation();
  }

  // Prevent default browser behavior
  return false;
}

function draw() {
  // Visual focus indicator
  if (document.activeElement === canvas.elt) {
    stroke(0, 100, 255);
    strokeWeight(3);
    noFill();
    rect(0, 0, width, height);
  }
}
```

### WCAG Guidelines

The Web Content Accessibility Guidelines (WCAG) provide the standard for web accessibility. MicroSims should target WCAG 2.1 Level AA compliance.

Key principles (POUR):

| Principle | Description | MicroSim Application |
|-----------|-------------|----------------------|
| **Perceivable** | Information must be presentable | Text alternatives, captions, contrast |
| **Operable** | Interface must be usable | Keyboard access, timing control, no seizures |
| **Understandable** | Content must be comprehensible | Clear language, predictable behavior |
| **Robust** | Content must work with assistive tech | Valid code, ARIA support |

### Accessible Design Checklist

Use this checklist when designing MicroSims:

**Visual Accessibility:**

- [ ] Text contrast ratio ≥ 4.5:1
- [ ] UI component contrast ≥ 3:1
- [ ] No information conveyed by color alone
- [ ] Text can scale without breaking layout
- [ ] describe() function provides canvas description

**Motor Accessibility:**

- [ ] All functions available via keyboard
- [ ] Focus indicators visible
- [ ] Click targets ≥ 44x44 pixels
- [ ] No time limits without extension options
- [ ] No rapid interaction requirements

**Cognitive Accessibility:**

- [ ] Clear, simple instructions
- [ ] Consistent navigation and layout
- [ ] Error prevention and recovery
- [ ] Progress indicators for multi-step processes
- [ ] Help available when needed

**Technical Accessibility:**

- [ ] Valid HTML structure
- [ ] ARIA labels where needed
- [ ] Works with screen readers
- [ ] No auto-playing media without controls

## Educational Equity

Educational equity means ensuring that all students have access to the resources they need to succeed, regardless of their circumstances. For MicroSims, this means designing for students who may have:

- Limited internet bandwidth
- Older computers or mobile devices
- Shared devices with limited storage
- Intermittent connectivity

### Low-Bandwidth Design

Many students access educational materials on mobile networks or in areas with limited internet infrastructure. Heavy MicroSims that assume broadband connections exclude these learners.

Strategies for low-bandwidth design:

| Strategy | Implementation | Impact |
|----------|----------------|--------|
| Minimize file size | Compress images, use efficient code | Faster loading |
| Lazy load resources | Load only what's needed | Reduced initial payload |
| Cache effectively | Use service workers | Works offline |
| Progressive enhancement | Core function without extras | Baseline accessibility |
| Offer quality options | Low/medium/high graphics | User choice |

```javascript
// Progressive enhancement: check connection speed
if (navigator.connection) {
  let effectiveType = navigator.connection.effectiveType;
  if (effectiveType === '2g' || effectiveType === 'slow-2g') {
    // Low bandwidth mode
    particleCount = 10;
    frameRate(15);
    useSimpleGraphics = true;
  } else if (effectiveType === '3g') {
    // Medium bandwidth
    particleCount = 50;
    frameRate(30);
    useSimpleGraphics = false;
  } else {
    // Full experience
    particleCount = 200;
    frameRate(60);
    useSimpleGraphics = false;
  }
}
```

### Older Device Support

Not all students have new computers or tablets. MicroSims should work on devices that are several years old.

Design considerations:

- **Avoid cutting-edge APIs**: Use widely-supported JavaScript features
- **Test on older browsers**: Safari, older Chrome versions
- **Optimize performance**: Reduce calculations, limit animations
- **Memory management**: Clean up resources, limit particle counts
- **Graceful degradation**: Basic function even without modern features

```javascript
// Check for feature support and adapt
let supportsWebGL = !!document.createElement('canvas').getContext('webgl');

function setup() {
  if (supportsWebGL && !oldDeviceDetected()) {
    // Use WEBGL renderer for better performance on modern devices
    createCanvas(800, 600, WEBGL);
  } else {
    // Fall back to 2D renderer
    createCanvas(800, 600);
    // Reduce complexity for older devices
    maxParticles = 50;
    frameRate(24);
  }
}

function oldDeviceDetected() {
  // Simple heuristic based on device memory
  if (navigator.deviceMemory && navigator.deviceMemory < 4) {
    return true;
  }
  // Check for older iOS devices
  let iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (iOS) {
    let match = navigator.userAgent.match(/OS (\d+)_/);
    if (match && parseInt(match[1]) < 13) {
      return true;
    }
  }
  return false;
}
```

#### Diagram: Device Support Testing Matrix

<details markdown="1">
    <summary>Device Support Testing Matrix</summary>
    Type: chart

    Purpose: Show the relationship between device age/capability and MicroSim feature availability, helping designers plan graceful degradation strategies.

    Chart Type: Stacked horizontal bar chart

    Bloom Level: Analyze

    Learning Objectives:
    - Understand which features work on which devices
    - Plan feature sets for different device tiers
    - Make informed decisions about minimum requirements

    X-axis: Feature availability (percentage)
    Y-axis: Device categories:
    - Modern desktop (2020+)
    - Mid-range desktop (2017-2019)
    - Older desktop (2014-2016)
    - Modern mobile (2020+)
    - Mid-range mobile (2017-2019)
    - Older mobile (2014-2016)
    - Budget tablet (any year)

    Data series (stacked):
    1. Core simulation (green) - Available on all
    2. Advanced graphics (blue) - Not on older devices
    3. Audio feedback (yellow) - Not on some mobile
    4. High particle count (orange) - Only modern
    5. WebGL effects (red) - Only modern desktop/mobile

    Annotations:
    - "Minimum viable" line at core simulation
    - "Recommended" line including advanced graphics
    - Callout: "Test on target devices, not just your development machine"

    Implementation: Chart.js horizontal stacked bar
</details>

## Putting It All Together

Effective MicroSim design requires balancing multiple considerations:

1. **Learning objectives**: What should students know or be able to do?
2. **Cognitive load**: Is the interface supporting or hindering learning?
3. **Scaffolding**: How much guidance is appropriate?
4. **Assessment**: How will you know if students learned?
5. **Accessibility**: Can all students access and use the MicroSim?
6. **Equity**: Does it work for students with limited resources?

These considerations aren't in conflict—they reinforce each other. A MicroSim with low extraneous cognitive load is also more accessible. Scaffolding that fades appropriately supports both novices and experts. Low-bandwidth design benefits all users with faster loading times.

### The Feature Decision Framework

When deciding whether to add a feature, ask these questions in order:

1. **Learning objective alignment**: Does this feature directly support what students should learn?
   - If no → Don't add it

2. **Cognitive load impact**: Does this increase extraneous load significantly?
   - If yes → Can it be simplified or hidden?

3. **Accessibility**: Can all students use this feature?
   - If no → Can it be made accessible?

4. **Performance**: Does this work on older devices and slow connections?
   - If no → Can it degrade gracefully?

5. **Value-added**: Is the learning benefit worth the added complexity?
   - If uncertain → Test with actual students

!!! question "Challenge: Evaluate a MicroSim Design"
    Find an existing MicroSim and evaluate it using the concepts from this chapter:

    1. Estimate the cognitive load balance (extraneous vs. germane)
    2. Identify the scaffolding approach (guided vs. open)
    3. Check accessibility (describe(), keyboard, contrast)
    4. Test on a mobile device or with throttled bandwidth
    5. Suggest three specific improvements based on your analysis

## Key Takeaways

- **Cognitive load theory** explains why simpler interfaces often produce better learning—minimize extraneous load to maximize germane load
- **Universal Design for Learning** promotes flexibility through multiple representations, engagement options, and expression methods
- **Scaffolding** should be present for novices but fade as learners gain competence—don't lock students into hand-holding
- **PRIMM methodology** (Predict-Run-Investigate-Modify-Make) provides a research-backed framework for interactive learning experiences
- **Quiz Mode** and formative assessment features add value but also complexity—offer them as optional layers
- **Accessibility** is a requirement, not an enhancement—use describe(), ensure keyboard navigation, meet contrast requirements
- **Educational equity** means designing for students with limited bandwidth and older devices—test your MicroSims under constrained conditions

Remember: The goal isn't to show off your coding skills with a dozen sliders and particle effects. The goal is to help students learn. Every design decision should serve that purpose.

## Next Steps

After completing this chapter, you should:

1. **Evaluate your existing MicroSims** using the cognitive load and accessibility frameworks
2. **Implement PRIMM structure** in at least one MicroSim by adding prediction prompts
3. **Test accessibility** using a screen reader and keyboard-only navigation
4. **Add Quiz Mode** to a MicroSim where assessment supports the learning objective
5. **Test on constrained devices** to ensure equity for all students

Continue to [Chapter 14: Prompt Engineering for MicroSims](../14-prompt-engineering-for-microsims/index.md) to learn techniques for generating MicroSims effectively with AI tools.

## References

1. Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. *Cognitive Science*, 12(2), 257-285.

2. CAST (2018). Universal Design for Learning Guidelines version 2.2. http://udlguidelines.cast.org

3. Sentance, S., & Waite, J. (2017). PRIMM: Exploring pedagogical approaches for teaching text-based programming in school. In *Proceedings of the 12th Workshop on Primary and Secondary Computing Education* (pp. 113-114).

4. W3C (2018). Web Content Accessibility Guidelines (WCAG) 2.1. https://www.w3.org/TR/WCAG21/

5. Mayer, R. E. (2009). *Multimedia learning* (2nd ed.). Cambridge University Press.

6. Clark, R. C., & Mayer, R. E. (2016). *E-learning and the science of instruction* (4th ed.). Wiley.

7. p5.js accessibility documentation. https://p5js.org/learn/accessibility.html
