# Creating Educational MicroSims with Generative AI

**Title:** Creating Educational MicroSims with Generative AI
**Audience:** Teachers, Educators, and Instructional Designers
**Course Length:** 14-week undergraduate course
**Credits:** 3 semester hours

## Prerequisites

Some knowledge of programming is helpful. Students should be familiar with basic concepts such as variables, control flow, loops, and debugging techniques. Although many MicroSims are written in JavaScript, knowledge of Python or another similar programming language is adequate. No prior experience with generative AI tools is required.

## Course Overview

This 14-week course teaches students how to use generative AI to create educational interactive web-based simulations (MicroSims) designed to help learners master concepts. While generative AI programs can easily create simple animations, these animations are often ineffective for teaching concepts without careful pedagogical design. This course takes students step-by-step through the process of designing and implementing MicroSims that support meaningful learning outcomes.

Students will learn to leverage AI tools such as ChatGPT, Claude, and other large language models to generate, refine, and debug simulation code. The course emphasizes both technical skills and pedagogical principles, ensuring that resulting simulations are educationally effective, accessible, and engaging.

## Course Introduction

The course begins with the classic bouncing-ball MicroSim written in p5.js. Students use AI to generate the initial code and then perform a detailed walkthrough of the program's major sections: global variables, the `setup()` function, and the `draw()` function. Students then add interactive controls to allow users to start, stop, and pause the simulation, as well as adjust parameters like speed.

Building on this foundation, students explore more complex simulations such as projectile motion by introducing variables for angle and power. The course establishes a standard MicroSim layout consisting of a drawing region and a control region, providing a consistent user experience across all simulations. Students are then encouraged to explore the generation of simulations on their own using tools such as ChatGPT, Claude, or other LLM tools.

## From Learning Objective to MicroSim

We then take a look at the problem of how to generate the right MicroSim for a specific learning objective. We create a scenario where an AI agent is building a customized textbook for a class, a project, or an individual student. After it generates a learning graph and partitions the graph into chapters, it is time to generate the content. As content is being generated there are opportunities for the agent to insert diagrams, charts, and even small in-line simulations to help a student with a learning objective. But how do we design a MicroSim for the many types of learning objectives? This is where we turn to methods of classifying learning objectives into categories. These categories will give us insights into what MicroSim to use.

### Bloom's 2001 Taxonomy

We first cover the most common way to classify learning objectives. For this we use the 2001 Bloom taxonomy. We go into a quick background of how the original Bloom taxonomy was created and how it was refined in 2001. The six categories of learning objectives are:

- **L1: Remember** (recall facts) - bottom level of a pyramid
- **L2: Understand** (explain concepts)
- **L3: Apply** (use knowledge to solve a problem)
- **L4: Analyze** (examine relationships, connect concepts)
- **L5: Evaluate** (judge value)
- **L6: Create** (design new solutions) - top level of a pyramid

What we find is that when objectives are at a specific level, the types of MicroSims we use are different from the MicroSims we use at other levels. For example, getting students to recall facts (L1) might use a flash-card game with rewards and repetition based on reinforcement learning theory. On the other hand, a Create-level objective might involve the user constructing a small model and checking that the model follows the concepts learned in the course.

Once we select a learning objective we can classify it in one of the levels of Bloom's taxonomy. That then guides us on the types of interactive simulations that would be the most effective.

## Objective MicroSim Skill Matching

Although there are many types of MicroSims, in practice we will only need about a dozen types for a typical high-school course such as algebra, geometry, physics, or history. Here is a list of the general MicroSim types we will be using in this course:

- A Processing Level 5 or p5.js MicroSim - the most flexible
- A process diagram, workflow, or flowchart using the Mermaid.js library
- A chart such as a bar chart, pie chart, line chart, etc. using Chart.js
- A timeline of events
- A geographic map
- A network graph diagram or a causal loop diagram
- Graphing an equation

Our role is to generate a clear description of a learning objective and match it to one of these MicroSims.

## Specialized MicroSims

There are specific courses that also need specific types of MicroSims:

- A chemistry or biology course needs tools for visualizing chemical bonds and molecules in three dimensions
- A circuits course needs to be able to simulate the flow of electrons in wires and electrical circuits
- A geology course needs to view both maps as well as layer diagrams of the earth's crust

Many of these specialized MicroSims need specialized JavaScript libraries. We will be demonstrating examples of these MicroSims in this course.

## Managing MicroSim Metadata

One of the key ways that generative AI can be successful at creating new MicroSims is if it has a large library of working MicroSims that are already classified based on subject, Bloom level, and JavaScript library used. Generative AI can often begin with a working MicroSim and make small modifications such as adding a new slider control or removing controls. The key to this process is to have a precise and standardized way to describe each MicroSim. A database of MicroSims can then be put into a faceted search system where only MicroSims that meet specific criteria can be returned as search results. We use the phrase "you can't reuse what you can't find" as a way to focus on good metadata and search.

## Challenges with Generating Layouts

One of the largest challenges in using generative AI is to appreciate the fact that LLMs don't have a world model of a user interface. They are designed to predict the next token of text. They can't "see" a user interface layout and move components around to avoid overlaps of buttons, labels, values, titles, and drawings.

## Challenges of iframe Styling

By default, many examples of drawing tools decorate their drawings with fancy borders with rounded corners and gradient shading margins. Although this is pleasing in a stand-alone MicroSim, it is not appropriate when you place the MicroSim on a white page of an intelligent textbook. We need to be aggressive at building precise rules in skill files to make sure that only the required elements are used in creating a focused MicroSim with minimal external distractions.

## Responsive Design

MicroSims are designed to be placed directly in a textbook page or a full screen display. Adapting MicroSims to respond to changes in container width takes special care when elements are placed on a canvas. Instead of absolute coordinate positions, relative sizes are used. For example, instead of placing a title at `(x=200, y=50)` we would place the title at `(x=canvasWidth/2, y=margin)` to keep the title centered at the top of the MicroSim.

## Grouping Elements

In order to make it easy for AI tools (and humans) to move groups of drawing elements around together, we often design our MicroSims using `push()`, `translate()`, and `pop()` functions. This allows many elements to be moved together just by adding x and y offsets to the `translate()` function.

## The Interaction Mandate

By definition, all MicroSims are interactive. They are never static drawings or free-running animations. They require the user to interact, even if this is only a short hover over an item or starting and stopping an animation. This is critical for us to be able to monitor user behavior and create customized learning paths to understand what actions will help a student learn.

We look at tools for monitoring user behavior from basic site analytics like GitHub Pages to highly detailed logging of mouse movement, hover events, and user clicking on controls like buttons and sliders. Our goal is to design MicroSims that provide easy-to-implement hooks for monitoring user behavior. We also look at JavaScript functions for sending xAPI event streams to remote learning record stores (LRS) systems.

It is out-of-scope of this course to discuss the privacy and security concerns of storing student records other than to say that this data is highly regulated by government agencies in both the US and the EU.

## Accessibility Standards

To make our MicroSims accessible to a wide audience we use best practices such as using the `describe()` function to describe what each MicroSim does. This additional data is used by screen readers to help users with vision impairment.

## MicroSim Packaging

Each MicroSim directory contains the following files:

1. **index.md** - metadata, iframe, documentation, and lesson plan
2. **main.html** - small HTML holder for iframe sourcing
3. **style.css** - used to ensure a minimalistic iframe style is preferred
4. **script.js** - must be runnable directly in the p5.js editor
5. **data.json** - any data that can be easily manipulated by a genAI tool
6. **metadata.json** - metadata on the MicroSim

## MicroSim Metadata Standards

- Dublin Core
- Additional Metadata for Supporting Search
- Learning Objective Metadata
- The MicroSim JSON Schema

## Testing and Quality

We have created a 100-point quality score for each MicroSim.

See the microsim-standardization skill file:
[https://github.com/dmccreary/claude-skills/tree/main/skills/microsim-standardization](https://github.com/dmccreary/claude-skills/tree/main/skills/microsim-standardization)

The score for each MicroSim is stored in the YAML metadata:

```yaml
---
title: My MicroSim
description: A short description of the MicroSim
quality_score: 85
---
```

## Social Image Previews

```yaml
---
title: My MicroSim
description: A short description of the MicroSim
image: /sims/name/name.png
og:image: /sims/name/name.png
quality_score: 85
---
```

## Pedagogical Topics

### Cognitive Load Theory

How to design MicroSims that minimize extraneous cognitive load.

### Universal Design for Learning (UDL)

Multiple means of engagement, representation, and expression.

### Scaffolding Strategies

How much guidance vs. open exploration to provide.

### Assessment Integration

Designing formative assessments within MicroSims. Adding a Quiz Mode to MicroSims.

### PRIMM Methodology

The Predict-Run-Investigate-Modify-Make framework for teaching programming concepts.

## Bloom Taxonomy Strategies

### Remember

- Flash card MicroSim
- Sorter MicroSim

### Create

- Model Editor

## AI and Prompt Engineering Topics

### Rules Files and Skills Development

How to create effective rules files for AI systems.

### Iterative Refinement Techniques

Specific strategies for debugging and refining AI-generated code:

- Using Claude Code
- Using p5.js previews
- Using `mkdocs serve` to preview
- Tricks for autosaving VS Code on change in focus

### Prompt Engineering Best Practices

Writing effective prompts for different types of MicroSims:

- Building a new MicroSim from scratch
- Making a copy of a MicroSim
- Examples of prompts that use skills

!!! quote
    Use the map-generator skill to create a map of Africa

## Integration Topics

### iframe Integration

- How to embed MicroSims in any web page
- How to embed a MicroSim in an MkDocs markdown page
- How to embed a MicroSim in an HTML slide deck

## Professional Topics

### Licensing and Copyright

- Creative Commons licensing, attribution requirements
- Adding the fullscreen and copyright links to each MicroSim

### Collaboration Workflows

Working in teams, peer review processes.

### User Testing and Feedback

How to conduct usability studies with actual students.

### Educational Equity Considerations

Designing for low-bandwidth environments and older devices.

## Learning Objectives

Upon successful completion of this course, students will be able to:

### Remember

- Identify the core components of a p5.js sketch: `setup()`, `draw()`, and global variables
- List the elements of the standard MicroSim layout (drawing region, control region)
- Recall Dublin Core metadata fields used for educational resource documentation
- Name the six levels of Bloom's 2001 Taxonomy

### Understand

- Explain how generative AI tools can accelerate simulation development
- Describe the pedagogical principles that make simulations effective for learning
- Interpret p5.js code structure and execution flow
- Summarize best practices for accessible and responsive design
- Discuss how Bloom's Taxonomy levels guide MicroSim selection

### Apply

- Use generative AI to produce functional p5.js simulation code
- Implement standard MicroSim layout patterns with drawing and control regions
- Create interactive controls (sliders, buttons) that modify simulation parameters
- Apply responsive design techniques to ensure simulations work across screen sizes
- Match learning objectives to appropriate MicroSim types

### Analyze

- Compare different prompting strategies for generating simulation code
- Differentiate between effective and ineffective educational simulations
- Debug AI-generated code by identifying logical and syntactical errors
- Examine how simulation parameters affect learning outcomes
- Categorize MicroSims by Bloom's Taxonomy level and subject area

### Evaluate

- Assess the educational effectiveness of a MicroSim against stated learning objectives
- Critique AI-generated code for efficiency, readability, and best practices
- Judge the accessibility and usability of interactive simulations
- Appraise the appropriateness of simulations for specific grade levels and subjects
- Apply the 100-point quality score rubric to evaluate MicroSims

### Create

- Design original MicroSims that address specific learning objectives
- Construct comprehensive metadata documentation for simulations
- Develop iterative prompts that guide AI toward producing high-quality code
- Produce a portfolio of educational simulations demonstrating mastery of course concepts
- Author effective rules files and skills for AI-assisted development

## Assessment Methods

- Weekly coding assignments (40%)
- Midterm project: Multi-component simulation (20%)
- Capstone project: Original educational MicroSim with documentation (30%)
- Class participation and peer reviews (10%)

## Required Materials

- Access to a generative AI tool (ChatGPT, Claude, or equivalent)
- Modern web browser with developer tools
- Text editor or integrated development environment
- GitHub account for version control and deployment
