---
title: Bloom's Taxonomy and Learning Objectives
description: Use Bloom's Taxonomy to match MicroSim types with specific learning objectives
generated_by: claude skill chapter-content-generator
date: 2025-01-25 18:00:00
version: 0.03
---

# Bloom's Taxonomy and Learning Objectives

## Summary

This chapter introduces Bloom's 2001 Taxonomy as a framework for designing educationally effective MicroSims. You will learn about the six cognitive levels: Remember, Understand, Apply, Analyze, Evaluate, and Create, and how each level suggests different types of interactive simulations. The chapter covers learning objectives, cognitive levels, the taxonomy pyramid, and objective classification techniques. Most importantly, you will learn MicroSim type selection strategies to match simulations with specific learning goals.

## Concepts Covered

This chapter covers the following 12 concepts from the learning graph:

1. Bloom's Taxonomy
2. Remember Level
3. Understand Level
4. Apply Level
5. Analyze Level
6. Evaluate Level
7. Create Level
8. Learning Objectives
9. Cognitive Levels
10. Taxonomy Pyramid
11. Objective Classification
12. MicroSim Type Selection

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Educational MicroSims](../01-intro-to-educational-microsims/index.md)

---

## The Problem: Infinite Variety, No Map

You've been asked to create a MicroSim. You have a learning objective in front of you: "Students will understand the relationship between voltage and current in a circuit." What kind of MicroSim should you build?

A flashcard quiz? An interactive circuit simulator? A drag-and-drop matching game? A data visualization? A construction sandbox where students build their own circuits?

Here's the challenge: there are **huge variations** in learning objectives. Some ask students to memorize facts. Others demand deep analysis. Some require creative synthesis. Without some guidance, it would be nearly impossible to consistently pick the right type of MicroSim for a given learning objective. You'd be guessing, and your guesses would sometimes miss the mark entirely.

That's where **Bloom's Taxonomy** comes in.

!!! tip "The Power of Classification"
    Bloom's Taxonomy serves as a map—a way to classify any learning objective and then match it to a specific type of MicroSim that's been proven effective for that cognitive level. No more guessing. Just systematic design.

## What Are Learning Objectives?

**Learning objectives** are precise statements describing what students should be able to do after instruction. They're the foundation of educational design—without clear objectives, you can't measure success or design effective learning experiences.

Well-written learning objectives share these characteristics:

- **Observable:** Describes visible behavior ("calculate," "identify," "construct")
- **Measurable:** Can be assessed through demonstration or testing
- **Specific:** Focuses on one skill or concept at a time
- **Achievable:** Realistic within the instructional context
- **Aligned:** Connects to broader course or curriculum goals

### Anatomy of a Learning Objective

Every learning objective contains three components:

| Component | Description | Example |
|-----------|-------------|---------|
| **Action verb** | What the student will do | "Calculate," "Explain," "Design" |
| **Content** | The subject matter | "the velocity of a projectile" |
| **Conditions** | Context or constraints | "given initial angle and speed" |

**Complete example:** "Students will be able to **calculate** (verb) **the velocity of a projectile** (content) **given initial angle and speed** (conditions)."

The action verb is the key to classification. Different verbs indicate different cognitive levels, which in turn suggest different MicroSim types.

## Bloom's Taxonomy: A Brief History

In 1956, educational psychologist Benjamin Bloom led a committee that created a classification system for educational objectives. The original taxonomy identified six levels of cognitive complexity, from simple recall to complex evaluation.

In 2001, a group led by Lorin Anderson (a former student of Bloom) revised the taxonomy. The update made several important changes:

- Changed category names from nouns to verbs (action-oriented)
- Swapped the top two levels (Create moved above Evaluate)
- Added a second dimension for knowledge types
- Made the framework more practical for classroom use

The **2001 Revised Bloom's Taxonomy** is what we use today for designing MicroSims.

#### Diagram: Bloom's Taxonomy Timeline

<details markdown="1">
    <summary>Bloom's Taxonomy Historical Timeline</summary>
    Type: timeline

    Purpose: Show the evolution of Bloom's Taxonomy from 1956 to modern applications (Bloom: Remember, Understand)

    Time period: 1950-2025

    Orientation: Horizontal

    Events:
    - 1956: Benjamin Bloom publishes original "Taxonomy of Educational Objectives"
      - Six levels: Knowledge, Comprehension, Application, Analysis, Synthesis, Evaluation
      - Noun-based categories
    - 1960s-1990s: Taxonomy becomes standard in curriculum design worldwide
    - 2001: Anderson & Krathwohl publish revised taxonomy
      - Changes to verb-based: Remember, Understand, Apply, Analyze, Evaluate, Create
      - Reorders top levels (Create becomes highest)
      - Adds knowledge dimension
    - 2010s: Digital learning adaptations emerge
      - "Bloom's Digital Taxonomy" maps digital activities to levels
    - 2020s: AI and MicroSim integration
      - Taxonomy guides adaptive learning systems
      - MicroSim type selection based on cognitive levels

    Visual style: Horizontal timeline with alternating above/below placement

    Color coding:
    - 1956 original: blue
    - 2001 revision: green
    - Modern applications: orange

    Interactive features:
    - Hover to see detailed description
    - Click to expand with comparison of original vs. revised

    Implementation: vis-timeline or custom SVG
</details>

## The Taxonomy Pyramid

The **taxonomy pyramid** visualizes Bloom's six cognitive levels arranged from lower-order thinking skills (base) to higher-order thinking skills (apex). Each level builds on the ones below it.

```
        ┌───────────┐
        │  CREATE   │  ← Highest complexity
        ├───────────┤
        │ EVALUATE  │
        ├───────────┤
        │  ANALYZE  │
        ├───────────┤
        │   APPLY   │
        ├───────────┤
        │UNDERSTAND │
        ├───────────┤
        │ REMEMBER  │  ← Foundation
        └───────────┘
```

### Lower-Order vs. Higher-Order Thinking

| Category | Levels | Characteristics |
|----------|--------|-----------------|
| **Lower-Order Thinking Skills (LOTS)** | Remember, Understand | Foundation skills; recall and comprehension |
| **Higher-Order Thinking Skills (HOTS)** | Apply, Analyze, Evaluate, Create | Complex reasoning; requires LOTS as prerequisites |

Students must build competence at lower levels before succeeding at higher levels. You can't analyze what you don't understand, and you can't understand what you don't remember.

#### Diagram: Interactive Bloom's Pyramid

<details markdown="1">
    <summary>Interactive Bloom's Taxonomy Pyramid</summary>
    Type: microsim

    Learning objective: Allow students to explore the six cognitive levels of Bloom's Taxonomy through an interactive pyramid (Bloom: Understand)

    Canvas layout:
    - Drawing area: 500x400 pixels
    - Control area: 50 pixels

    Visual elements:
    - Pyramid with six stacked sections
    - Each section labeled with level name
    - Sections colored in gradient (cool to warm, bottom to top):
      - Remember: light blue
      - Understand: blue-green
      - Apply: green
      - Analyze: yellow
      - Evaluate: orange
      - Create: red/pink

    Interactive features:
    - Hover over any level to highlight it and show:
      - Level name and definition
      - Key action verbs
      - Example learning objective
      - Suggested MicroSim types
    - Click on level to "lock" the info panel
    - Toggle button: "Show Verbs" displays all action verbs on pyramid

    Level information displayed:
    - Remember: "Recall facts, terms, basic concepts"
      - Verbs: list, define, name, identify, recall
      - MicroSims: Flashcards, Sorters, Matching games
    - Understand: "Explain ideas, interpret meaning"
      - Verbs: explain, describe, summarize, classify
      - MicroSims: Concept visualizations, Animated explanations
    - Apply: "Use knowledge to solve problems"
      - Verbs: calculate, demonstrate, solve, use
      - MicroSims: Simulators, Problem solvers, Calculators
    - Analyze: "Examine relationships, compare components"
      - Verbs: compare, contrast, differentiate, examine
      - MicroSims: Data explorers, Network graphs, Comparison tools
    - Evaluate: "Make judgments, justify decisions"
      - Verbs: judge, assess, critique, justify
      - MicroSims: Rubric tools, Decision analyzers, Evaluation frameworks
    - Create: "Produce original work, design solutions"
      - Verbs: design, construct, develop, compose
      - MicroSims: Model editors, Sandbox environments, Design tools

    Behavior:
    - Info panel appears to right of pyramid
    - Smooth transitions between levels
    - Current level remains highlighted while info displayed

    Color scheme:
    - Pyramid: gradient from blue (bottom) to red (top)
    - Selected level: white border glow
    - Background: light gray

    Implementation: p5.js with polygon drawing and hover detection
</details>

## Cognitive Levels: The Six Categories

Let's examine each **cognitive level** in detail, including its definition, characteristic action verbs, and the types of MicroSims that work best for learning objectives at that level.

### Remember Level (L1)

The **Remember level** involves retrieving relevant knowledge from long-term memory. This is the foundation of all learning—students must first recall facts before they can work with them.

**Definition:** Recall facts, terms, basic concepts, and answers without necessarily understanding their meaning.

**Action verbs:**

- define, list, name, identify, recall
- recognize, label, repeat, state, match
- memorize, duplicate, reproduce

**Example objectives:**

- "List the six levels of Bloom's Taxonomy"
- "Identify the parts of a cell from a diagram"
- "Name the elements in the first row of the periodic table"

**Best MicroSim types for Remember:**

| MicroSim Type | Description | Why It Works |
|---------------|-------------|--------------|
| **Flashcard Quiz** | Digital cards with question/answer pairs | Repetition reinforces memory |
| **Matching Game** | Connect terms to definitions | Active recall practice |
| **Sorter** | Drag items into correct categories | Engages motor memory |
| **Multiple Choice Quiz** | Select correct answer from options | Tests recognition |
| **Fill-in-the-Blank** | Complete sentences with correct terms | Tests recall |

```javascript
// Simple flashcard MicroSim pattern
let cards = [
  { front: "Remember", back: "Recall facts and basic concepts" },
  { front: "Understand", back: "Explain ideas and interpret meaning" },
  // ... more cards
];

function displayCard(index) {
  // Show front, click to reveal back
  if (showingBack) {
    text(cards[index].back, width/2, height/2);
  } else {
    text(cards[index].front, width/2, height/2);
  }
}
```

### Understand Level (L2)

The **Understand level** involves constructing meaning from instructional messages. Students demonstrate comprehension by explaining, summarizing, or interpreting information.

**Definition:** Explain ideas or concepts, demonstrating comprehension by summarizing, paraphrasing, or classifying information.

**Action verbs:**

- explain, describe, summarize, paraphrase
- classify, compare, interpret, discuss
- predict, translate, illustrate, extend

**Example objectives:**

- "Explain how photosynthesis converts light to energy"
- "Describe the relationship between supply and demand"
- "Summarize the main events of World War II"

**Best MicroSim types for Understand:**

| MicroSim Type | Description | Why It Works |
|---------------|-------------|--------------|
| **Animated Explanation** | Visual walkthrough of a process | Shows relationships over time |
| **Concept Visualization** | Interactive diagram of a concept | Makes abstract concrete |
| **Process Flowchart** | Step-by-step visual of a sequence | Clarifies cause and effect |
| **Comparative Display** | Side-by-side visualizations | Highlights similarities/differences |
| **Interactive Timeline** | Chronological event display | Shows historical relationships |

### Apply Level (L3)

The **Apply level** involves using acquired knowledge to solve problems in new or familiar situations. Students demonstrate application by executing procedures or implementing solutions.

**Definition:** Use knowledge, facts, techniques, and rules to solve problems, complete tasks, or address new situations.

**Action verbs:**

- apply, use, solve, demonstrate, calculate
- implement, execute, perform, practice
- operate, illustrate, complete, show

**Example objectives:**

- "Calculate the acceleration of a falling object given mass and force"
- "Apply the quadratic formula to solve equations"
- "Use Ohm's Law to determine current in a circuit"

**Best MicroSim types for Apply:**

| MicroSim Type | Description | Why It Works |
|---------------|-------------|--------------|
| **Calculator/Solver** | Input values, see computed results | Practices procedure application |
| **Simulator** | Manipulate parameters, observe outcomes | Safe experimentation |
| **Virtual Lab** | Interactive experiments | Hands-on application |
| **Problem Generator** | Generates practice problems | Repetition with variety |
| **Step-by-Step Solver** | Shows work for each step | Models procedure |

#### Diagram: Apply Level Circuit Simulator

<details markdown="1">
    <summary>Ohm's Law Circuit Simulator</summary>
    Type: microsim

    Learning objective: Allow students to apply Ohm's Law (V=IR) by manipulating circuit parameters and observing results (Bloom: Apply)

    Canvas layout:
    - Drawing area: 500x350 pixels
    - Control area: 50 pixels

    Visual elements:
    - Simple circuit diagram with:
      - Battery (voltage source)
      - Resistor (with resistance value)
      - Ammeter showing current
      - Voltmeter across resistor
    - Animated electron flow (dots moving through wire)
    - Flow speed indicates current magnitude

    Interactive controls:
    - Slider: Voltage (1-12V, default 6V)
    - Slider: Resistance (1-100Ω, default 10Ω)
    - Current calculated automatically: I = V/R

    Displays:
    - Voltage: [value] V
    - Resistance: [value] Ω
    - Current: [calculated] A
    - Formula reminder: V = I × R

    Behavior:
    - Adjusting voltage or resistance recalculates current instantly
    - Electron animation speed matches current value
    - Higher current = faster dots, brighter ammeter display
    - Very low current = slow dots, dim display

    Educational emphasis:
    - Students adjust inputs, observe outputs
    - Direct application of formula
    - Immediate feedback on calculations

    Color scheme:
    - Wire: dark gray
    - Electrons: yellow dots
    - Battery: green (+) and red (-)
    - Resistor: orange bands
    - Ammeter: blue display

    Implementation: p5.js with slider controls
</details>

### Analyze Level (L4)

The **Analyze level** involves breaking information into components, determining relationships, and identifying organizational principles. Students examine how parts relate to the whole.

**Definition:** Break down information into parts, examine relationships between components, and identify patterns or organizational structures.

**Action verbs:**

- analyze, compare, contrast, differentiate
- distinguish, examine, investigate, categorize
- organize, attribute, deconstruct, outline

**Example objectives:**

- "Compare and contrast the economic systems of capitalism and socialism"
- "Analyze the factors that led to the French Revolution"
- "Examine the relationship between predator and prey populations"

**Best MicroSim types for Analyze:**

| MicroSim Type | Description | Why It Works |
|---------------|-------------|--------------|
| **Network Graph** | Nodes and edges showing relationships | Visualizes complex connections |
| **Data Explorer** | Filter and sort datasets | Reveals patterns |
| **Comparison Tool** | Side-by-side analysis interface | Structured comparison |
| **Causal Loop Diagram** | Shows feedback relationships | Systems thinking |
| **Dependency Mapper** | Shows what affects what | Cause-effect analysis |

#### Diagram: Analyze Level Network Explorer

<details markdown="1">
    <summary>Concept Relationship Network Explorer</summary>
    Type: microsim

    Learning objective: Enable students to analyze relationships between concepts by exploring an interactive network graph (Bloom: Analyze)

    Canvas layout:
    - Drawing area: 600x400 pixels
    - Control area: 50 pixels

    Visual elements:
    - Force-directed network graph
    - Nodes representing concepts (circles)
    - Edges representing relationships (lines)
    - Node size indicates importance (connections)
    - Edge thickness indicates relationship strength

    Sample data (Food Web):
    - Nodes: Sun, Plants, Herbivores, Carnivores, Decomposers
    - Edges: Sun→Plants (energy), Plants→Herbivores (food), etc.

    Interactive features:
    - Click and drag nodes to rearrange
    - Hover over node: highlight all connected nodes
    - Click node: show info panel with details
    - Click edge: show relationship description
    - Zoom: mouse wheel
    - Pan: drag background

    Controls:
    - Dropdown: Select dataset (Food Web, Solar System, Government Branches)
    - Toggle: "Show Labels"
    - Toggle: "Show Strength"
    - Button: "Reset Layout"

    Behavior:
    - Physics-based layout keeps graph organized
    - Connected nodes pulled together
    - Unconnected nodes pushed apart
    - Students discover relationships through exploration

    Analysis prompts (shown in corner):
    - "Which node has the most connections?"
    - "What would happen if this node were removed?"
    - "Are there any isolated nodes?"

    Color scheme:
    - Nodes: colored by category
    - Edges: gray, highlighted edges in gold
    - Selected node: white border glow

    Implementation: p5.js or vis-network
</details>

### Evaluate Level (L5)

The **Evaluate level** involves making judgments based on criteria and standards. Students assess, critique, and justify decisions using evidence and reasoning.

**Definition:** Make judgments about information, ideas, or solutions based on set criteria or standards, requiring critical thinking and justification.

**Action verbs:**

- evaluate, judge, assess, critique, justify
- argue, defend, support, rate, prioritize
- recommend, conclude, appraise, validate

**Example objectives:**

- "Evaluate the effectiveness of different renewable energy sources"
- "Critique the experimental design of a scientific study"
- "Judge the validity of arguments in a persuasive essay"

**Best MicroSim types for Evaluate:**

| MicroSim Type | Description | Why It Works |
|---------------|-------------|--------------|
| **Rubric Evaluator** | Apply criteria to assess work | Structured judgment |
| **Decision Matrix** | Score options against criteria | Systematic comparison |
| **Argument Analyzer** | Evaluate logical structure | Critical thinking |
| **Quality Scorer** | Rate items on multiple dimensions | Multi-criteria assessment |
| **Pros/Cons Weigher** | Balance tradeoffs | Reasoned judgment |

### Create Level (L6)

The **Create level** involves putting elements together to form a coherent whole or producing original work. This is the highest cognitive level—students generate new ideas, products, or solutions.

**Definition:** Produce new or original work by combining elements, designing solutions, or constructing models that didn't exist before.

**Action verbs:**

- create, design, construct, develop, compose
- generate, produce, invent, formulate, plan
- build, assemble, devise, author, synthesize

**Example objectives:**

- "Design an experiment to test a hypothesis"
- "Construct a model of a sustainable city"
- "Create an original algorithm to solve a problem"

**Best MicroSim types for Create:**

| MicroSim Type | Description | Why It Works |
|---------------|-------------|--------------|
| **Model Editor** | Build and test custom models | Open-ended construction |
| **Sandbox Environment** | Free-form experimentation space | Unrestricted creativity |
| **Design Tool** | Create with constraints | Guided creation |
| **Composition Interface** | Combine elements into wholes | Synthesis practice |
| **Simulation Builder** | Create simulations of systems | Meta-level understanding |

#### Diagram: Create Level Model Editor

<details markdown="1">
    <summary>Ecosystem Model Editor</summary>
    Type: microsim

    Learning objective: Enable students to create their own ecosystem model by adding species and relationships, then simulating population dynamics (Bloom: Create)

    Canvas layout:
    - Left side (400px): Model canvas
    - Right side (200px): Toolbox and controls
    - Control area: 80 pixels

    Visual elements:
    Model canvas:
    - Background representing environment
    - Species shown as icons (drag from toolbox)
    - Relationship arrows drawn between species
    - Population counts displayed on each species

    Toolbox:
    - Species palette: Sun, Plant, Herbivore, Carnivore, Decomposer
    - Relationship types: Eats, Competes, Symbiosis
    - Delete tool (eraser)

    Controls:
    - Button: "Simulate" (runs population model for 100 generations)
    - Button: "Reset"
    - Button: "Save Model"
    - Slider: "Simulation Speed"
    - Chart: Population over time (appears during simulation)

    Interaction modes:
    1. Build mode (default):
       - Drag species from toolbox to canvas
       - Click species, then another to create relationship
       - Click relationship to set type
    2. Simulate mode:
       - Model runs population dynamics
       - Species icons grow/shrink based on population
       - Chart updates in real-time
       - Extinct species fade out

    Behavior:
    - Simple predator-prey equations govern populations
    - Students see consequences of their design
    - Unbalanced ecosystems crash or explode
    - Students iterate to create stable systems

    Educational emphasis:
    - Creation is open-ended
    - Immediate feedback on design choices
    - Systems thinking through experimentation

    Validation:
    - System checks for:
      - At least one energy source (Sun/Plants)
      - At least one consumer
      - Connected food web

    Color scheme:
    - Sun: yellow
    - Plants: green
    - Herbivores: brown
    - Carnivores: red
    - Decomposers: purple
    - Arrows: gray with directional heads

    Implementation: p5.js with graph data structure
</details>

## Objective Classification

**Objective classification** is the process of determining which Bloom's level a learning objective targets. This skill is essential for MicroSim designers—you must correctly classify objectives to select appropriate MicroSim types.

### Classification Process

1. **Identify the action verb** in the learning objective
2. **Match the verb** to a Bloom's level using the verb lists
3. **Consider the context** (some verbs appear at multiple levels)
4. **Verify alignment** between expected student behavior and level description

### Verb Ambiguity

Some verbs can indicate different levels depending on context:

| Verb | Lower Level Usage | Higher Level Usage |
|------|------------------|-------------------|
| **Identify** | "Identify the parts of a cell" (Remember) | "Identify the cause of failure" (Analyze) |
| **Describe** | "Describe what you see" (Understand) | "Describe how you would improve it" (Create) |
| **Explain** | "Explain the concept" (Understand) | "Explain why your solution works" (Evaluate) |

When in doubt, look at what the student must actually **do** to demonstrate achievement. If they're recalling, it's Remember. If they're generating something new, it's Create.

### Classification Practice

Classify these learning objectives:

| Objective | Your Classification |
|-----------|---------------------|
| "Define the term 'ecosystem'" | Remember (recall definition) |
| "Explain how ecosystems maintain balance" | Understand (explain concept) |
| "Use food web data to predict population changes" | Apply (use knowledge to solve) |
| "Compare two ecosystems and identify differences" | Analyze (compare components) |
| "Evaluate the sustainability of an ecosystem" | Evaluate (judge against criteria) |
| "Design a self-sustaining ecosystem model" | Create (produce original work) |

## MicroSim Type Selection

**MicroSim type selection** is the practical application of Bloom's Taxonomy to educational technology design. Once you've classified a learning objective, you can select MicroSim types that have proven effective for that cognitive level.

### The Selection Matrix

This comprehensive matrix maps Bloom's levels to recommended MicroSim types:

| Level | Primary MicroSim Types | Secondary Types | Avoid |
|-------|----------------------|-----------------|-------|
| **Remember** | Flashcards, Sorters, Matching | Multiple choice, Fill-blank | Open-ended sims |
| **Understand** | Animated explanations, Concept maps | Process flows, Timelines | Creation tools |
| **Apply** | Simulators, Calculators, Virtual labs | Problem generators | Purely passive displays |
| **Analyze** | Network graphs, Data explorers | Comparison tools, Causal diagrams | Simple visualizations |
| **Evaluate** | Rubric tools, Decision matrices | Argument analyzers | Drill and practice |
| **Create** | Model editors, Sandboxes | Design tools, Builders | Closed-ended quizzes |

### Selection Guidelines

1. **Match complexity:** Higher-level objectives need more open-ended MicroSims
2. **Provide scaffolding:** Include support for prerequisite skills within higher-level sims
3. **Enable demonstration:** The MicroSim must let students show the required behavior
4. **Allow failure:** Effective learning often requires trying, failing, and iterating
5. **Measure outcomes:** Build in assessment mechanisms appropriate to the level

### Common Selection Mistakes

| Mistake | Problem | Solution |
|---------|---------|----------|
| Using flashcards for Apply | Flashcards test memory, not application | Use a simulator or problem solver |
| Using open sandbox for Remember | Too unstructured for basic recall | Use constrained matching or sorting |
| Using multiple choice for Create | Can't produce original work via selection | Use model editor or composition tool |
| Skipping prerequisite levels | Students lack foundation for higher tasks | Include Remember/Understand elements first |

#### Diagram: MicroSim Selection Flowchart

<details markdown="1">
    <summary>MicroSim Type Selection Decision Flowchart</summary>
    Type: diagram

    Purpose: Guide MicroSim designers through the process of selecting appropriate MicroSim types for learning objectives (Bloom: Apply)

    Layout: Top-down decision flowchart

    Starting point:
    - "Start: Learning Objective"

    First decision:
    - "What is the action verb?"
    - Branches to verb categories

    Level identification nodes:
    - "Define, List, Name, Recall" → Remember
    - "Explain, Describe, Summarize, Classify" → Understand
    - "Apply, Calculate, Use, Solve, Demonstrate" → Apply
    - "Analyze, Compare, Differentiate, Examine" → Analyze
    - "Evaluate, Judge, Assess, Critique, Justify" → Evaluate
    - "Create, Design, Construct, Develop, Compose" → Create

    MicroSim recommendations (terminal nodes):
    - Remember → "Flashcards, Sorters, Matching Games"
    - Understand → "Animated Explanations, Concept Visualizations"
    - Apply → "Simulators, Calculators, Virtual Labs"
    - Analyze → "Network Graphs, Data Explorers, Comparison Tools"
    - Evaluate → "Rubric Tools, Decision Matrices"
    - Create → "Model Editors, Sandbox Environments"

    Visual style:
    - Rounded rectangles for processes
    - Diamonds for decisions
    - Rectangles with rounded corners for MicroSim types
    - Color coding by level (matching pyramid colors)

    Annotations:
    - "Check context if verb is ambiguous"
    - "Include scaffolding for higher levels"

    Color scheme:
    - Remember path: blue
    - Understand path: teal
    - Apply path: green
    - Analyze path: yellow
    - Evaluate path: orange
    - Create path: red/pink

    Implementation: Mermaid.js or custom SVG
</details>

## Putting It All Together: A Design Workflow

Here's the complete workflow for designing MicroSims using Bloom's Taxonomy:

1. **Receive the learning objective**
   - "Students will analyze the factors affecting reaction rate"

2. **Identify the action verb**
   - "analyze" → indicates Analyze level

3. **Verify the classification**
   - Does "analyze factors affecting" match the Analyze level definition?
   - Yes: "Break down information, examine relationships"

4. **Select appropriate MicroSim types**
   - Primary: Data explorer, Comparison tool
   - Consider: Network graph showing factor relationships

5. **Design with scaffolding**
   - Include Remember elements (factor definitions)
   - Include Understand elements (factor explanations)
   - Main focus: Analysis features (filter, compare, examine relationships)

6. **Build and test**
   - Can students demonstrate analysis with this MicroSim?
   - Is there meaningful exploration possible?
   - Can outcomes be measured?

### Example: Complete Design Process

**Objective:** "Students will apply the ideal gas law to calculate pressure changes"

**Classification:**
- Action verb: "apply," "calculate"
- Level: Apply (L3)
- Verification: Using formula to solve problems = Apply

**MicroSim Selection:**
- Primary type: Simulator/Calculator
- Features needed: Input fields for variables, calculated output, visual feedback

**Scaffolding:**
- Remember: Display formula (PV = nRT) on screen
- Understand: Show gas particle animation that responds to parameter changes
- Apply: Let students manipulate P, V, n, T and see calculations

**Design specification:**

| Feature | Implementation |
|---------|---------------|
| Inputs | Sliders for V, n, T |
| Output | Calculated P with units |
| Visualization | Animated particles (faster at higher T, compressed at lower V) |
| Assessment | Problem mode: Given V, n, T, predict P before revealing |

## Key Takeaways

You've learned how to use Bloom's Taxonomy as a systematic framework for MicroSim design:

1. **Learning objectives** are precise statements describing observable, measurable student behaviors.

2. **Bloom's Taxonomy** provides six cognitive levels from Remember (L1) to Create (L6).

3. The **taxonomy pyramid** shows how higher-order thinking builds on lower-order foundations.

4. **Remember level** (L1) involves recalling facts—use flashcards, sorters, matching games.

5. **Understand level** (L2) involves explaining concepts—use animated explanations, visualizations.

6. **Apply level** (L3) involves using knowledge—use simulators, calculators, virtual labs.

7. **Analyze level** (L4) involves examining relationships—use network graphs, data explorers.

8. **Evaluate level** (L5) involves making judgments—use rubric tools, decision matrices.

9. **Create level** (L6) involves producing original work—use model editors, sandboxes.

10. **Objective classification** matches action verbs to appropriate Bloom's levels.

11. **MicroSim type selection** matches classified objectives to effective simulation types.

12. The complete workflow: Classify → Select → Scaffold → Build → Test.

??? question "Challenge: Classify and Select"
    Take three learning objectives from a course you're familiar with. Classify each using Bloom's Taxonomy, then select appropriate MicroSim types for each. Consider what scaffolding would be needed for higher-level objectives.

## Next Steps

You now have a systematic framework for matching MicroSim types to learning objectives. No more guessing! In the next chapter, we'll explore **animation and physics simulations**, learning how to bring your MicroSims to life with realistic motion, bouncing, gravity, and other physical behaviors.

Remember: Bloom's Taxonomy isn't just academic theory—it's a practical map that guides every design decision. When in doubt, ask: "What level of thinking does this objective require?" Then let the answer guide your MicroSim selection.

## References

- Anderson, L. W., & Krathwohl, D. R. (2001). *A Taxonomy for Learning, Teaching, and Assessing*. Longman.
- Bloom, B. S. (1956). *Taxonomy of Educational Objectives, Handbook I: Cognitive Domain*. David McKay.
- [Bloom's Taxonomy - Vanderbilt University](https://cft.vanderbilt.edu/guides-sub-pages/blooms-taxonomy/) - Comprehensive overview
- [Revised Bloom's Taxonomy Action Verbs](https://www.apu.edu/live_data/files/333/blooms_taxonomy_action_verbs.pdf) - Verb lists by level
- Churches, A. (2008). *Bloom's Digital Taxonomy* - Technology integration guide
