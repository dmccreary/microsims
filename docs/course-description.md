# Course Description on Creating MicroSims with Generative AI

**Title:** Creating Educational MicroSims with Generative AI
**Audience:** Teachers, Educators and Instructors
**Course Length:** 14-week course taught to undergraduate students

## Prerequisites

Some knowledge of programming is helpful.  Students should be
familiar with basic concepts such as variables, control flow, loops
and debugging techniques.  Although many MicroSims are written
with JavaScript, knowledge of Python or other similar programming language is adequate.

## Course Overview

This 14-week course teaches students how to us generative AI to create educational interactive
web-based simulations for the purpose of helping students master concepts.  Although most
generative AI programs can easily create simple animations, these animations are
often not useful at teaching concepts.  This course takes a student step-by-step
through the process of designing and implementing MicroSims that help students
reach their educational goals.  

## Introduction

We begin with the basic bouncing-ball MicroSim
written in p5.js.  We use AI to generate the code and then do a walkthrough
of the major sections of the program, global variables, `setup()` and `draw()`
functions.  We then add controls to allow the student to start/stop and
pause the simulation and change the speed.

We then demonstrate how other simulations such as projectile motion can be simulated
by adding variables such as angle and power.  We then describe the standard layout of a MicroSim and describe the drawing region and the control region of a MicroSim.
Students are then encouraged to explore the generation of simulations on their
own using tools such as ChatGPT, Claude or other LLM tools.

## From Learning Objective to MicroSim

We then take a look at the problem of how to generate the right MicroSim
for a specific learning objective.  We create a scenario where an AI
agent is building a customized textbook for a class, a project or an
individual student.  After it generates a learning graph and partitions
the graph into chapters, it is time to generate the content.  As
content is being generated there are opportunities for the agent to
insert diagrams, charts and even small in-line simulations to help
a student with a learning objective.  But how do we design a MicroSim
for the many types of learning objectives?  This is where we turn
to methods of classifying learning objectives into categories.  
These categories will give us insights into what microsim to use.

### Bloom's 2001 Taxonomy

We first cover the most common way to classify learning objectives
For this we use the 2001 Bloom taxonomy.  We go into a quick
background of how the original Bloom taxonomy was created and
how it was refined in 2001.  The six categories of learning objectives
are: 

L1: Remember (recall facts) - bottom level of a pyramid
L2: Understand (explain concepts)
L3: Apply (use knowledge to solve a problem)
L4: Analyze (examine relationships, connect concepts)
L5: Evaluate (judge value)
L5: Create (design new solutions) - top level of a pyramid

What we find is that when objectives are at specific level, the
types of MicroSims we use are different from the MicroSims we
used at other levels.  For example getting students to
recall facts (L1) might use a flash-card game with rewards and
repetition based rules based on reinforcement learning theory.
On the other hand, a Create a solution might involve the
user constructing a small model and checking that the model
follows the concepts learned in the course.

Once we select a learning objective we can classify it in
one of the levels of Blooms taxonomy.  That then guides us
on the types of interactive simulations that would be the
most effective.

## Objective MicroSim Skill Matching

Although there are many types of MicroSims, in practice
we will only need about a dozen types for a typical high-school
course such as algebra, geometry, physics or history.  Here
is a list of the general MicroSim types we will be using
in this course:

- A Processing Level 5 or P5.js Microsim - the most flexible 
- A process diagram, workflow or flow chart using the Mermaid.js library
- A chart such as a bar chart, pie chart, line chart etc using ChartJS
- A timeline of events
- A geographic map
- A network graph diagram or a causal loop diagram
- Graphing an equation

Our role is to generate a clear description of a learning objective and match
it to one of these MicroSims.

## Specialized MicroSims

There are specific courses that also need specific types of MicroSims.
- A chemistry or biology course needs tools for visualizing chemical bonds and molecules in three dimensions.
- A circuits course needs to be able to simulate the flow of electrons in wires
and electrical circuits
- A geology course needs to view both maps as well as layer diagrams of the earth's crust

Many of these specialized MicroSims need specialized JavaScript libraries.  We will
be demonstrating examples of these MicroSims in this course.

## Managing MicroSim Metadata

One of the key ways that generative AI can be successful at creating
new MicroSims is if it has a large library of working MicroSims
that are already classified based on subject, Bloom level and JavaScript
library used.  Generative AI can often begin with a working MicroSim
and make small modifications such as adding a new slider control
or removing controls.  The key to this process is to have a precise
and standardized way to describe each MicroSim.  A database of MicroSims
can then be put into a faceted search system where only MicroSims
that meet specific criteria can be returned as search results.
We used the phase "you can reuse what you can't find" as a way
to focus on good metadata and search.

## Challenges with Generating Layouts

One of the largest challenges in using generative AI is to appreciate
the fact the LLMs don't have a world model of a user interface.  They
are designed to predict the next token of text.  They can't "see"
a user interface layout and move components around to avoid overlaps
of buttons, labels, values, titles and drawings.

## Challenges of iframe Styling

By default, many examples of drawing tools decorate their drawings
with fancy borders with rounded corners and gradient shading margins.
Although this is pleasing in a stand-alone MicroSim, it is not
appropriate when you place the MicroSim on a white page of an
intelligent textbook.  We need to be aggressive at building
precise rules in skill files to make sure that only the required elements
are used in creating a focused MicroSim with minimal external distractions.

## Responsive Design

MicroSims are designed to be placed directly in a textbook
page or a full screen display.  Adapting MicroSims to
respond to changes in container width takes special care
when elements are place on a canvas.  Instead of absolute
coordinate positions, relative sizes are used.  For
example, instead of placing a title at (x=200, y=50)
we would place the title at (x=canvasWidth/2, y=margin)
to keep the title centered at the top of the MicroSim.

## Grouping Elements

In order to make it easy for AI tools (and humans) to
move groups of drawing elements around together, we
often design our MicroSims using push(), translate() and pop()
functions.  This allows many elements to be moved together
just by adding x and y offsets to the translate() function.

## The Interaction Mandate

By definition, all MicroSims are interactive.  They are
never static drawings or free running animations.  
They require the user to interact, even
if this is only a short hover over an item or starting and
stopping an animation.  This is critical for us to be
able to monitor user behavior and create customized learning
paths to understand what actions will help a student learn.
We look at tools for monitoring user behavior from
basic site analytics like GitHub pages to highly detailed
logging of mouse movement, hovers events and user
clicking on controls like buttons and sliders.
Our goal is to design MicroSims that provide easy
to implement hooks for monitoring user behavior.
We also look at JavaScript functions for 
sending xAPI event streams to remote learning
record stores (LRS) systems.
It is out-of-scope of this course to discuss
the privacy and security concerns of storing
student records other than to say that
this data is highly regulated by government
agencies in both the US and the EU.

## Accessibility Standards

To make our MicroSims accessible to wide audience
we use best practices such as using the describe()
function to describe what each MicroSim does.
This additional data is used by screen readers to
help users with vision impairment.

## MicroSim Packaging

1. index.md - metadata, iframe, documentation and lesson plan
2. main.html - small html holder for iframe sourcing
3. style.css - used to ensure a minimalistic iframe style is preferred
4. script.js - must be runnable directly in the P5.js editor
5. data.json - any data that can be easily manipulated by a genAI tool
6. metadata.json - metadata on the MicroSim

## MicroSim Metadata Standards

Dublin Core
Additional Metadata for Supporting Search
Learning Objective Metadata
The MicroSim JSON Schema

## Testing and Quality

We have created a 100-point quality score for each MicroSim

See the microsim-standardization skill file: 
https://github.com/dmccreary/claude-skills/tree/main/skills/microsim-standardization

The score for each MicroSim is stored in the yml metadata

```markdown
---
title: My MicroSim
description: A short description of the MicroSim
quality_score: 85
---
```

## Social Image Previews

```markdown
---
title: My MicroSim
description: A short description of the MicroSim
image: /sims/name/name.png
og:image /sims/name/name.png
quality_score: 85
---
```

## Pedagogical Topics

### Cognitive Load Theory
How to design MicroSims that minimize extraneous cognitive load

### Universal Design for Learning (UDL)
Multiple means of engagement, representation, and expression
### Scaffolding Strategies
How much guidance vs. open exploration to provide
### Assessment Integration
Designing formative assessments within MicroSims
Adding a Quiz Mode to MicroSims

### PRIMM Methodology
The Predict-Run-Investigate-Modify-Make framework mentioned in the paper

## Bloom Taxonomy Strategies

### Remember
Flash card MicroSim
Sorter MicroSim

### Create
Model Editor

## Missing AI/Prompt Engineering Topics

### Rules Files & Skills Development

### How to create effective rules files for AI systems (mentioned
  briefly but not detailed)

### Iterative Refinement Techniques

Specific strategies for debugging and refining AI-generated code
Using Claude Code
Using p5.js previews
Using the mkdocs serve to preview
Tricks for autosaving VS Code on change in focus

## Prompt Engineering Best Practices

Writing effective prompts for different types of MicroSims
Building a new MicroSim from scratch
Make a copy of a MicroSim
Examples of prompts that use skills

!!! quote
    Use the map-generator skill to create a map of Africa


## Integration Topics

iFrame Integration
How to embed MicroSims in any web page
How to embed a MicroSim in a mkdocs markdown page
How to embed a MicroSim in a HTML slide deck

## Professional Topics

### Licensing & Copyright
 Creative Commons licensing, attribution requirements
 Adding the fullscreen and copyright links to each microsim - a 44 line penalty
Collaboration Workflows - Working in teams, peer review processes
  20. User Testing & Feedback - How to conduct usability studies with actual students
  21. Educational Equity Considerations - Designing for low-bandwidth environments, older devices

  The course has good 
