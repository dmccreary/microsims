---
title: What Is a MicroSim
description: Defines a MicroSim, its role in an intelligent textbook, and the AI, web and publishing foundations behind it.
generated_by: claude skill chapter-content-generator
date: 2026-09-30 10:07:26
version: 1.10
---

# What Is a MicroSim

## Summary

Defines a MicroSim, explains its role in an intelligent textbook, and introduces the web and AI foundations that the rest of the book builds on.

This chapter contrasts MicroSims 1.0 with MicroSims 2.0 and tours showcase examples. After it, students can explain what a MicroSim is, what makes one instrumented, and which technologies are involved.

## Concepts Covered

This chapter covers the following 24 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| Interactive Simulation | 3475 |
| Learning Object | 6272 |
| Generative AI | 143 |
| Large Language Model | 127 |
| AI Skill | 82 |
| AI Agent | 16 |
| Prompt | 13 |
| MkDocs | 438 |
| Git Version Control | 3 |
| HTML5 | 482 |
| CSS | 30 |
| JavaScript | 409 |
| JavaScript Library | 182 |
| CDN | 5 |
| iframe Embedding | 38 |
| Open Educational Resource | 4 |
| Creative Commons License | 3 |
| MicroSim | 2927 |
| Intelligent Textbook | 47 |
| MicroSims 1.0 | 16 |
| MicroSims 2.0 | 15 |
| Instrumented MicroSim | 2197 |
| Showcase MicroSim | 2 |
| GitHub Pages | 1 |

## Prerequisites

This chapter assumes only the prerequisites listed in the [course description](../../course-description.md).

---

## Welcome

!!! mascot-welcome "Hi, I'm Bounce!"
    ![Bounce waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    I'm Bounce, a rubber ball who is curious about everything and who treats every mistake as just another bounce. Let's bounce it around! I'll show up in each chapter to do six specific jobs, and nothing else:

    1. When a chapter opens, I tell you why it matters and what you will be able to build.
    2. When an idea deserves a pause, I help you think about why it works.
    3. When there is a shortcut worth knowing, I pass along a tip.
    4. When there is a trap that catches most newcomers, I warn you and show the way out.
    5. When a passage is genuinely hard, I encourage you and suggest a way forward.
    6. When you finish, I celebrate the specific thing you just learned.

    If I am not doing one of those six things, I am not in the chapter.

This book teaches you to create, check, and instrument small interactive simulations called MicroSims, and it teaches you to ask a hard question about them: *how well does what a learner does inside a MicroSim predict whether that learner has mastered a concept?* This first chapter gives you the vocabulary and the technical foundations you need before we tackle that question. We start from the idea of a learning object, narrow to interactive simulations, define a MicroSim precisely, and then survey the artificial intelligence, web, and publishing technologies that make MicroSims cheap to build and easy to share.

## Learning Objects and the Case for Interaction

Every textbook is built from smaller pieces of instructional content. A **learning object** is a self-contained, reusable unit of instructional content that addresses a specific learning goal and can be described, found, and reused independently of the course it was first written for. A diagram with a caption, a five-minute video, a quiz, and a worked example can all be learning objects. What matters is that the unit stands on its own, carries enough description (metadata) to be located, and can be dropped into a new context without being rewritten.

The idea matters for this book because MicroSims are learning objects. Treating them that way from the start explains many design decisions you will meet later: why every MicroSim has a metadata file, why we search for an existing MicroSim before building a new one, and why a MicroSim must work when embedded in someone else's page.

A **worked example** shows what "described" means in practice. Suppose a teacher wants to find a simulation about bouncing balls. A learning object about that topic might carry a short description like the one below, written in JSON, a plain-text format that programs can read easily. A search tool can match on any of these fields, and a teacher can tell at a glance whether the object fits their course.

```json
{
  "title": "Bouncing Ball Gravity Lab",
  "subject": ["Physics", "Kinematics"],
  "gradeLevel": "College introductory",
  "learningObjective": "Explain how gravity and bounciness change a ball's motion",
  "format": "text/html",
  "license": "CC BY-NC-SA 4.0"
}
```

Without such a description, the learning object still works, but only someone who already knows it exists can use it. With the description, it becomes discoverable, which is the first step toward reuse. Chapter 15 develops this idea into a full metadata standard and a search index.

Learning objects come in a spectrum of interactivity. The table below organizes that spectrum. We define each row in the paragraphs that follow, so treat the table as a summary that you can return to.

| Kind of learning object | What the learner does | Feedback to the learner | Example |
|---|---|---|---|
| Static text or image | Reads or looks | None | A labeled cross-section of a cell |
| Video or animation | Watches | None, and the pace is fixed | A recorded physics lecture |
| Quiz item | Answers | Correct or incorrect | A multiple-choice question |
| Interactive simulation | Changes inputs and observes | Immediate visual response | A pendulum whose length you can change |

The last row is the focus of this chapter, and it deserves a careful definition.

### Interactive Simulation

An **interactive simulation** is a computer model of a system that the learner can manipulate, where the system's behavior changes visibly and immediately in response to the learner's actions. Two properties define it. First, there is a *model*: rules, however simple, that determine how the system behaves, such as gravity pulling a ball downward. Second, there is *interaction*: the learner controls one or more inputs, such as a slider for gravity, and sees the outcome without waiting.

This combination is what separates a simulation from an animation. An animation shows one outcome. A simulation lets you ask "what if?" and get an answer. Educational researchers have argued for decades that this kind of exploration helps learners build accurate mental models of physical and abstract systems, and large simulation libraries such as PhET have shown that many students will voluntarily experiment with them. We should be honest about the limits of that evidence, though. Studies of simulations show gains under many conditions, but the gains depend heavily on the design of the activity around the simulation, not merely on its presence.

A **worked example** makes the distinction concrete. Consider the goal "explain how gravity affects a falling ball." An animation shows a ball dropping and bouncing. A simulation gives the learner a gravity slider and a bounciness slider. Set gravity high and the ball falls fast and rebounds low. Set it low and the ball floats. Ask the learner to predict what happens before moving the slider, and you have turned a passive picture into an experiment. The next diagram lets you try exactly this.

!!! mascot-thinking "Feedback Is the Point"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Think of the difference between watching someone ride a bike and riding one yourself. The simulation earns its place only if the learner's action changes what they see, so ask of every design: what does the interaction let the learner *find out* that a picture could not?

Before you look at the first specification below, note the terms it uses. A *slider* is a control that sets a numeric value along a range. *Gravity* here means a constant downward acceleration applied to the ball on each animation frame. *Bounciness* is the fraction of speed the ball keeps after hitting the floor.

#### Diagram: Bouncing Ball Gravity Lab

<iframe src="../../sims/bouncing-ball-gravity-lab/main.html" width="100%" height="502px" scrolling="no"></iframe>

[Run the Bouncing Ball Gravity Lab MicroSim Fullscreen](../../sims/bouncing-ball-gravity-lab/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Bouncing Ball Gravity Lab</summary>
Type: microsim
**sim-id:** bouncing-ball-gravity-lab<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Understand; verb: explain): The learner will explain how changing gravity and bounciness changes the motion of a falling ball, by predicting an outcome and then testing it.

Layout: a drawing region above a control region, following the standard MicroSim layout. The drawing region is aliceblue with a white floor line near the bottom. The control region is white, separated by a silver line.

Visual elements: one orange-red ball of radius 20 pixels that starts at the top and falls under gravity, a horizontal floor, a faint dotted trail of the last 40 ball positions, and a small text readout showing the current height and speed.

Controls:

- Slider "Gravity" from 0.1 to 2.0 in steps of 0.1, default 0.8
- Slider "Bounciness" from 0.3 to 0.95 in steps of 0.05, default 0.8
- Button "Start / Pause", and button "Drop Again" that resets the ball to the top
- Checkbox "Predict first" (default on). When on, the sim pauses after each slider change and asks "Will the ball bounce higher, lower, or the same?" with three buttons, then reveals the answer after the next drop

Behavior: on each frame, add gravity to the vertical speed, move the ball, and when the ball reaches the floor, reverse its speed multiplied by bounciness. Stop the bounce when the speed is below a small threshold.

Responsive design: the canvas width follows the container width on every window resize. Sliders and buttons must remain visible at 400 pixels wide, and the canvas height is a fixed constant of 400 plus a 100 pixel control region.

Implementation: p5.js with createSlider and createButton controls positioned relative to the drawing height. Include a describe() call for accessibility.
</details>

### The Limits of Simulation

Simulations are not automatically better than other learning objects. A poorly designed simulation can overload a learner with controls, hide the underlying rule, or reward random clicking. We return to these design questions in Chapter 3, where cognitive load theory and Bloom's taxonomy guide the choice of interaction. For now, keep the two defining properties, a model and immediate interaction, as your test for whether something is truly an interactive simulation.

## What a MicroSim Is

We can now define the central object of this book. A **MicroSim** is a small, self-contained, AI-generated interactive simulation that runs in a web browser, embeds in any web page through an iframe, adapts to the width of its container, and carries metadata that lets it be found, reused, and, in this version of the book, instrumented to report what learners do. Each part of that definition does work:

- **Small:** a MicroSim teaches one concept or a tightly related few, not an entire course.
- **Self-contained:** it needs nothing but a browser, so it works offline from the author's laptop and online from a school district's server alike.
- **AI-generated:** a large language model writes most of the code from a specification, which is what makes producing many MicroSims affordable.
- **Embeddable:** any page can include it with a single HTML tag.
- **Width-responsive:** it fits phones, tablets, and wide monitors without separate versions.
- **Described:** its metadata makes it findable and usable as a learning object.

A **worked example** shows how the definition sorts real things. A YouTube video of a bouncing ball is not a MicroSim because it is not interactive. A large physics application with hundreds of controls is not a MicroSim because it is not small and does not embed in a page. A single-file simulation with two sliders, a Start button, and a metadata file, built from a prompt and embedded in a chapter, is a MicroSim.

Size deserves a further word, because it is the property authors most often violate. A small simulation is cheaper to generate, easier for an AI to get right, quicker to test, and lighter on the learner's attention. When a design starts to need many screens, several concepts, and a long manual, that is a signal to split it into several MicroSims that each teach one idea. The checklist below turns the definition into questions you can ask of any candidate.

| Question | If the answer is no |
|---|---|
| Does it teach one concept or a tightly related few? | Split it into several MicroSims |
| Does the learner change something and see an immediate result? | It is an animation or a diagram, not a simulation |
| Does it run in a browser with no installation? | It cannot be embedded in a typical page |
| Can it be included with one iframe tag? | It is not universally embeddable |
| Does it fit both a phone and a wide monitor? | It is not width-responsive |
| Does a metadata file describe it? | It cannot be found or reused reliably |

The following diagram lets you explore how the four kinds of object we have discussed nest inside one another. Click any node to see its definition and the property that distinguishes it from the layer above.

#### Diagram: MicroSim Family Tree

<iframe src="../../sims/microsim-family-tree/main.html" width="100%" height="522px" scrolling="no"></iframe>

[Run the MicroSim Family Tree MicroSim Fullscreen](../../sims/microsim-family-tree/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>MicroSim Family Tree</summary>
Type: diagram
**sim-id:** microsim-family-tree<br/>
**Library:** vis-network<br/>
**Status:** Specified

Learning objective (Bloom level: Understand; verb: classify): The learner will classify an example as a learning object, an interactive simulation, a MicroSim, or an instrumented MicroSim, by identifying the property that distinguishes each level.

Nodes and edges: four boxes arranged left to right, with arrows pointing from each to the one it specializes: Learning Object (steel blue) to Interactive Simulation (green) to MicroSim (orange) to Instrumented MicroSim (crimson). Each arrow carries the label "adds" followed by the new property: "a model and immediate interaction", "small, embeddable, described, AI-generated", and "reports evidence through xAPI".

Interactions: clicking a node opens an information panel on the right with a two-sentence definition, one positive example, and one near-miss example that fails the definition. Hovering an arrow shows the property in a tooltip. A "Quiz me" button hides the labels and asks the learner to place four unlabeled examples onto the correct node.

Responsive design: the network re-fits to the container width on window resize, and the information panel moves below the network when the width is under 600 pixels.

Implementation: vis-network with fixed left-to-right positions and physics disabled.
</details>

### Where MicroSims Live: The Intelligent Textbook

An **intelligent textbook** is a textbook whose content is structured so software can reason about it. It has a machine-readable graph of concepts and their dependencies, content organized around those concepts, and interactive elements that can report what learners do. The intelligent textbook is the setting in which MicroSims live. A learning graph, which you will meet in Chapter 3, tells the textbook which concepts exist and which ones depend on which. MicroSims give the textbook things for learners to do. The events that instrumented MicroSims report give the textbook evidence about what each learner has understood.

This is why the book you are reading is itself an intelligent textbook. Its 26 chapters are assigned from a learning graph of 462 concepts, and the MicroSims embedded in them are the interactive layer.

### MicroSims 1.0 and MicroSims 2.0

The first version of this book, which we call **MicroSims 1.0**, began in November 2023 as a course on using generative AI to create p5.js simulations. Its central observation was that AI systems could produce working simulations from a good prompt, and that a fixed layout with a drawing region and a control region made the results consistent. Most of the roughly 115 MicroSims in that book were p5.js sketches.

**MicroSims 2.0**, the version you are reading, is a complete rewrite. It reflects several changes that accumulated over the following years:

- MicroSims now come in many types, built with many libraries, chosen by matching a learning objective to an interaction pattern.
- AI generation is organized as skills, batch pipelines, and specifications instead of one-off prompts.
- Automated checks catch layout errors that human review used to miss.
- MicroSims can report what learners do through xAPI, so a MicroSim becomes a source of evidence and not only a teaching tool.

The table below contrasts the two versions. It summarizes points we develop through the rest of the book.

| Aspect | MicroSims 1.0 | MicroSims 2.0 |
|---|---|---|
| Main subject | Creating p5.js simulations with AI | Generating, instrumenting, and evaluating many kinds of MicroSims |
| Libraries | Almost entirely p5.js | p5.js, Chart.js, Plotly, Mermaid, vis-network, vis-timeline, Leaflet, and specialized types |
| Generation | A prompt per simulation | AI skills, specifications, and batch pipelines |
| Quality checks | Manual review and a checklist | Automated quality score, browser tests, and layout review |
| Learner data | None | xAPI events and mastery prediction |

The original book remains available in the project's version history under the tag `v1.0`, for anyone who wants to see how the approach began.

The timeline below places these milestones in order. Each item opens a short description when you click it.

#### Diagram: MicroSims Milestones Timeline

<iframe src="../../sims/microsims-milestones-timeline/main.html" width="100%" height="582px" scrolling="no"></iframe>

[Run the MicroSims Milestones Timeline MicroSim Fullscreen](../../sims/microsims-milestones-timeline/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>MicroSims Milestones Timeline</summary>
Type: timeline
**sim-id:** microsims-milestones-timeline<br/>
**Library:** vis-timeline<br/>
**Status:** Specified

Learning objective (Bloom level: Remember; verb: identify): The learner will identify the major milestones between MicroSims 1.0 and MicroSims 2.0 and order them in time.

Data: point events with these dates and labels, taken from the project history: 2023-11-04 "MicroSim Term Coined" (link: https://dmccreary.medium.com/micro-simulations-for-education-6989eae8d85d); 2023-11-21 "First commit of MicroSims 1.0"; 2024-12-03 "First commit of the intelligent-textbooks project"; 2025-02-24 "Anthropic introduces Claude Code"; 2025-03-17 "First use of Claude Code"; 2025-10 "First arXiv-style paper draft (v0.02)"; 2025-10-16 "Anthropic introduces Agent Skills"; 2025-11 "Paper draft v0.06"; 2025-12-10 "First MicroSim generator skill"; 2026-09-26 "Skill for adding xAPI events to a MicroSim (v0.2)"; 2026-09-30 "Tag v1.0 marks the original book; the rewrite begins".

Interactions: clicking an event opens a panel with a two-sentence description. A mouse wheel zooms the time axis, and dragging pans it. A "Group by" toggle switches between grouping by theme (book, paper, tools) and a single track.

Responsive design: the timeline resizes with its container on window resize.

Implementation: vis-timeline with a DataSet of items and groups.
</details>

### Showcase MicroSims

A **showcase MicroSim** is an especially polished MicroSim that demonstrates what the medium can do. The H-Bridge simulation created in the STEM Robots book is an example. It animates current flowing through the wires of a motor-control circuit, spins the motor, flashes a warning when the switches create a short circuit, and lets the learner operate four clickable switches or use keyboard shortcuts. We use showcase MicroSims throughout the book as targets for quality, not as typical output.

## The Artificial Intelligence Behind Generation

MicroSims are affordable because AI systems write most of their code. This section defines the pieces of that machinery so that later chapters can use the terms without pause.

### Generative AI

**Generative AI** is a class of machine-learning systems that produce new content, such as text, images, audio, or program code, from a description of what is wanted. The systems learn statistical patterns from very large collections of examples, and they generate output one piece at a time by predicting what should come next. For MicroSims, the content that matters is program code and documentation.

Generative AI is a powerful assistant and an unreliable authority. It produces fluent output whether or not the output is correct, so everything it writes must be checked. The whole of Chapter 13 is about how to check MicroSims automatically, and the reason is this point.

A **worked example** shows the strength and the weakness together. Ask a generative model for "a bouncing ball simulation" and it returns working code in seconds. Look closely and you may find that the ball sinks through the floor at high gravity, or the controls vanish when the window is narrow. The model gave you a strong first draft, and testing found the defects.

The table below sorts what generative AI does well and badly for our purposes. It summarizes the paragraph above.

| Strength | Weakness |
|---|---|
| Writes a complete first draft quickly | May invent functions or options that do not exist |
| Follows a clear specification closely | Guesses when the specification is vague |
| Explains and refactors its own code | Cannot see the rendered page unless given a tool to do so |
| Adapts the same idea to a new library | May use an outdated library version |

### Large Language Model

A **large language model (LLM)** is the kind of generative AI that works with text and code. It is a neural network trained on a very large body of text so that, given some text, it predicts the most likely continuation. Because program code is text, the same model that answers questions can write JavaScript. The names of specific models change quickly, so this book teaches concepts that hold across them.

Models do not read words the way people do. They read *tokens*, which are short pieces of text, often a word or part of a word, and both the context window and the price of using a model are measured in tokens. A page of code may cost a few thousand tokens, so a design that asks the model to look at the whole project for every small change wastes both money and attention.

Two properties of an LLM shape how we use it. The first is the **context window**: the amount of text the model can consider at once, including your instructions, any files you provide, and its own reply. When the context fills, earlier material is dropped or summarized, which is why our batch pipelines record their progress in files that a fresh session can reload. The second is that an LLM is **non-deterministic**: the same prompt can produce different code on different runs. That is why we test the output, and why later chapters treat reproducibility as a design goal.

A **worked example** illustrates context. Suppose you paste a 3,000-line project into a model and ask for a change. The model may lose track of the first files by the time it reaches the last. Splitting the task so that each request needs only one small file and one clear specification is a workaround you will use again and again.

### Prompt

A **prompt** is the text you give a language model to tell it what to do. A good prompt names the goal, the audience, the constraints, and the form of the output. A weak prompt names only a topic and leaves the model to guess the rest.

Compare two prompts for the same MicroSim.

| Weak prompt | Stronger prompt |
|---|---|
| "Make a physics simulation." | "Create a p5.js MicroSim for a college physics course that lets learners change gravity and bounciness of a ball and predict the result before dropping it. Use a drawing region above a control region and make the canvas width follow the window." |

The stronger prompt states a library, an audience, controls, a learning behavior, and a layout constraint. Each detail removes one guess the model would otherwise make.

!!! mascot-tip "Ask for What They Should Learn"
    ![Bounce giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Start your prompt with the learning objective, not the picture. "Help learners predict how gravity changes a bounce" gets you better controls than "draw a ball."

### AI Skill

A **skill** is a packaged set of instructions, reference guides, and templates that an AI agent loads when a task matches, so the agent does the task the same careful way each time instead of improvising. Where a prompt is one request, a skill is reusable expertise. The MicroSim generator used with this book is a skill: it contains rules for choosing among MicroSim types, templates for each library, and a checklist of quality standards.

Skills matter because they move knowledge out of your head and out of any single conversation into a shared, versioned file. Two people who invoke the same skill get output that follows the same conventions. When the conventions improve, everyone who invokes the skill benefits.

Concretely, a skill is a folder of ordinary files. The main file, `SKILL.md`, begins with a short description that tells the agent when the skill applies, followed by step-by-step instructions. Beside it sit reference guides for specific cases and template files the agent copies and fills in.

```text
microsim-generator/
  SKILL.md                 instructions and the rules for choosing a type
  references/              one guide per MicroSim type
  assets/templates/        starter files for each library
```

Because these are plain files, you can read them, version them in Git, and improve them like any other part of a project.

A **worked example** shows a skill in use. Instead of writing a long prompt every time, an author can write a short request such as "Use the microsim-generator skill to create a timeline of the Apollo missions." The skill selects a timeline library, loads the timeline template, follows the layout rules, writes the files, and records the metadata. The author supplied only the topic. The skill supplied the method.

The diagram below shows how a prompt, a language model, a skill, and an agent fit together. First we define the last term in the picture.

### AI Agent

An **AI agent** is a program built around a language model that can take actions, such as reading files, writing files, running commands, and using tools, in a loop until a task is finished. A chat window answers a question and stops. An agent keeps going: it drafts code, runs it, reads the error, and fixes the code. Agents are what make batch generation possible, because one coordinating agent can hand specifications to worker agents and collect their results.

With prompt, model, skill, and agent defined, the next diagram brings them together. Click each box to see what it contributes.

#### Diagram: AI Generation Pipeline

<iframe src="../../sims/ai-generation-pipeline/main.html" width="100%" height="502px" scrolling="no"></iframe>

[Run the AI Generation Pipeline MicroSim Fullscreen](../../sims/ai-generation-pipeline/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>AI Generation Pipeline</summary>
Type: diagram
**sim-id:** ai-generation-pipeline<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Learning objective (Bloom level: Understand; verb: explain): The learner will explain the role of a prompt, a large language model, a skill, and an agent in generating a MicroSim.

Diagram: a left-to-right flowchart with these nodes: "Author writes a prompt or request", "AI agent", "Skill (instructions, guides, templates)", "Large language model", "MicroSim files (HTML, JavaScript, metadata)", and "Automated checks". Arrows: author to agent; agent to skill ("loads"); agent to model ("asks"); model to agent ("code"); agent to files ("writes"); files to checks; checks back to agent ("errors to fix").

Interactions: every node has a click directive that opens an infobox with a plain-language definition and one example. Hovering a node highlights the arrows in and out of it. The feedback arrow from checks to agent is drawn dashed and its infobox explains why generated code must be tested.

Responsive design: the diagram scales to the container width, and node text wraps at narrow widths.

Implementation: Mermaid flowchart with click callbacks that show the infobox below the diagram.
</details>

### Reading the Pipeline

Follow one request through the pipeline. The author asks for a MicroSim. The agent reads the request and loads the skill, which tells it which files to create and which conventions to follow. The agent sends a specification to the model, receives code, writes it into files, and runs the automated checks. If a check fails, the error goes back to the model and the loop repeats. When the checks pass, the MicroSim is ready for the author's review. The author remains in the loop at both ends: writing the request and approving the result.

## The Web Foundations of a MicroSim

A MicroSim is a small web page. To read, change, or debug one, you need a working knowledge of the technologies a web page is made from. This section defines them in the order they build on each other.

!!! mascot-encourage "Alphabet Soup Is Normal"
    ![Bounce encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    If HTML, CSS, JavaScript, and CDN all blur together on the first read, that is completely normal. You have already learned harder things, and you will not write most of this code by hand, so aim to recognize each piece and know what it is for.

### HTML5

**HTML5** (HyperText Markup Language, version 5) is the standard language for describing the structure and content of a web page. It uses *tags*, which are names in angle brackets, to mark up text and to embed other things: headings, paragraphs, images, buttons, and the containers where a simulation draws itself. HTML says *what is on the page*. It does not say how the page looks or behaves.

Every MicroSim has a file called `main.html`. Its job is small: load the libraries, create a place for the simulation to draw, and load the simulation's JavaScript. Before we read a sample, note three tags. The `<script>` tag loads a JavaScript file. The `<main>` tag marks the main content area of the page. The `<meta>` tag records information about the page, such as the character set, that the browser uses but the reader does not see.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Bouncing Ball</title>
  <script src="https://cdn.jsdelivr.net/npm/p5@2.3.2/lib/p5.js"></script>
</head>
<body>
  <main></main>
  <script src="bouncing-ball.js"></script>
</body>
</html>
```

Read this from the top. The first line declares the document type. The `<head>` section holds information about the page and loads the p5.js library. The `<body>` section holds what appears on the page: an empty `<main>` area where the sketch will place its canvas, and a script tag that loads the simulation's own code. That is the entire structure of most MicroSims.

HTML5 also carries information that is invisible to sighted readers but essential to others. The `lang="en"` attribute tells a screen reader which language to pronounce, and descriptive text supplied by the simulation, which p5.js provides through a `describe()` call, gives assistive technology something to announce about a canvas that would otherwise be a silent picture. Accessibility begins in the structure of the page, and Chapter 24 returns to it.

The table below summarizes the tags used in this file and their roles.

| Tag | Role in a MicroSim |
|---|---|
| `<head>` | Holds the page title and loads libraries |
| `<script src="...">` | Loads JavaScript from a file or from a library address |
| `<main>` | Marks where the simulation draws itself |
| `<body>` | Holds everything the reader sees |

### CSS

**CSS** (Cascading Style Sheets) is the language that controls the appearance of HTML elements: colors, fonts, spacing, and layout. Where HTML says what is on the page, CSS says how it looks. A CSS *rule* has a selector that picks which elements it applies to, and a list of properties to set.

```css
main {
  background-color: aliceblue;
  border: 1px solid silver;
}
```

This rule selects the `<main>` element and gives it a pale blue background and a thin silver border. In this book's standard MicroSim layout, the drawing region is aliceblue and the control region is white, separated by a silver border, so this small rule is the visual convention in miniature. CSS also decides how a layout responds to different screen widths, which is the subject of Chapter 12.

### JavaScript

**JavaScript** is the programming language that runs inside web browsers and makes pages interactive. It is where a simulation's model lives: the rules that move the ball, the code that reads a slider, and the code that redraws the picture many times per second. If HTML is the structure and CSS is the appearance, JavaScript is the behavior.

Before reading the next example, learn its key ideas. A *variable* stores a value, such as the ball's height. A *function* is a named block of code that can be run when needed. The p5.js library, which we discuss next, calls a function named `draw` about sixty times per second, and each call redraws the picture.

```javascript
let y = 50;        // the ball's height from the top, in pixels
let speed = 0;     // downward speed, in pixels per frame
let gravity = 0.8; // how much speed is added each frame

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background('aliceblue');
  speed = speed + gravity;   // gravity increases the speed
  y = y + speed;             // the speed moves the ball
  if (y > height - 20) {     // the ball has hit the floor
    y = height - 20;
    speed = -speed * 0.8;    // reverse direction and lose some energy
  }
  fill('orangered');
  circle(200, y, 40);
}
```

The three variables describe the state of the system. The `setup` function runs once and creates the canvas. The `draw` function runs repeatedly. Each time, it adds gravity to the speed, moves the ball by the speed, checks whether the ball has reached the floor, and if so reverses the speed while keeping 80 percent of it. That last multiplication is the "bounciness" parameter from our earlier lab. You have just read a complete simulation of falling and bouncing in fourteen lines.

The **worked example** above also shows why simulations are powerful teaching tools. The rules of the model are visible in the code, and every parameter, such as `gravity` and `0.8`, is a candidate for a slider.

### JavaScript Library

A **JavaScript library** is a collection of prewritten code that a program can load and reuse, so that developers do not rebuild common capabilities from scratch. The bouncing-ball example calls `createCanvas`, `background`, `fill`, and `circle`. None of those are built into JavaScript. They come from p5.js, a library for drawing and interaction. MicroSims use different libraries for different jobs:

| Library | What it provides | Typical MicroSim |
|---|---|---|
| p5.js | Drawing, animation, and controls | Physics and custom simulations |
| Chart.js | Bar, line, pie, and other charts | Data explorers |
| Plotly | Scientific and mathematical plots | Function plotters |
| Mermaid | Flowcharts and diagrams from text | Process diagrams |
| vis-network | Interactive graphs of nodes and edges | Concept maps |
| vis-timeline | Timelines you can zoom and pan | Historical sequences |
| Leaflet | Interactive maps | Geographic data |

A **worked example** shows how much a library saves. Drawing a bar chart with only the browser's built-in tools takes hundreds of lines to compute scales, draw axes, and place labels. With Chart.js, the author describes the chart and the library does the drawing. Before the code, note its three parts: `type` chooses the kind of chart, `labels` names the bars, and `data` supplies their heights.

```javascript
new Chart(document.getElementById('chart'), {
  type: 'bar',
  data: {
    labels: ['p5.js', 'Chart.js', 'Mermaid'],
    datasets: [{ label: 'Sims built', data: [60, 8, 12] }]
  }
});
```

The numbers here are placeholders to show the shape of the call. The point is that the author states *what* the chart contains and the library decides *how* to draw it.

We use this table to preview the type families that Chapters 4 through 11 cover in depth. The point for now is that choosing a library is choosing a set of ready-made capabilities, and that the right choice depends on what the learner needs to see.

!!! mascot-warning "Pin the Version"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A library changes over time, and a sketch written for an older version can break under a newer one. Write the exact version number into the address, as in `p5@2.3.2`, and you avoid the surprise that your MicroSim worked yesterday and fails today.

### CDN

A **content delivery network (CDN)** is a network of servers that hosts files and delivers them from a location near the reader. MicroSims use CDNs to load libraries: instead of copying p5.js into every project, the page points to its address on a CDN, and the browser downloads it. The address in our earlier example, `https://cdn.jsdelivr.net/npm/p5@2.3.2/lib/p5.js`, names a CDN host, the library, an exact version, and the file.

The convenience has a cost that matters for classrooms. A MicroSim that loads its library from a CDN needs an internet connection the first time, and it depends on the CDN staying available. We accept those trade-offs for most books, and Chapter 2 discusses when a local copy is better.

### iframe Embedding

An **iframe** is an HTML element that displays one web page inside another. An author who wants to include a MicroSim in a chapter does not paste its code into the chapter. Instead, the chapter contains a single tag that points to the MicroSim's page, and the browser shows that page in a rectangular window.

```html
<iframe src="main.html" width="100%" height="452" scrolling="no"></iframe>
```

The `src` says which page to show. The `width` of 100 percent makes the frame fill its container, which is what lets a MicroSim adapt to different screens. The `height` is fixed in pixels, and it must match the MicroSim's own height or the bottom of the simulation is cut off. The `scrolling="no"` turns off scroll bars so that the frame does not scroll inside the page.

This one tag is why MicroSims are *universally embeddable*. The same MicroSim can appear in a MkDocs book, a school learning management system, a slide deck, or a blog post, because every one of those can display an iframe. The embedding page never has to understand the MicroSim's code.

A **worked example** shows the failure that the height rule prevents. A MicroSim with a 400-pixel drawing region and a 50-pixel control region needs an iframe about 452 pixels tall. If the author sets the height to 400, the sliders sit below the visible edge and the learner can never reach them. Chapter 12 shows how tools measure and fix this automatically.

The diagram below shows the technology stack from the bottom to the top. Click any layer to see what it adds.

#### Diagram: MicroSim Technology Stack

<iframe src="../../sims/microsim-technology-stack/main.html" width="100%" height="562px" scrolling="no"></iframe>

[Run the MicroSim Technology Stack MicroSim Fullscreen](../../sims/microsim-technology-stack/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>MicroSim Technology Stack</summary>
Type: infographic
**sim-id:** microsim-technology-stack<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Understand; verb: describe): The learner will describe what HTML5, CSS, JavaScript, a JavaScript library, a CDN, and an iframe each contribute to a running MicroSim.

Layout: a vertical stack of six labeled layers, drawn as rounded rectangles of different colors, with the browser shown as a frame around the top. From bottom to top: CDN (delivers the library), JavaScript library, JavaScript (the model and behavior), CSS (appearance), HTML5 (structure), and iframe (the window into the hosting page).

Interactions: clicking a layer expands a panel to the right with a one-sentence role, a three-line code sample, and one thing that breaks if the layer is missing. Hovering a layer highlights the layers it depends on. A "Break it" button removes the selected layer and shows what the simulated MicroSim would look like without it (for example, unstyled or blank).

Responsive design: layers stretch to the container width, and the detail panel moves below the stack under 600 pixels.

Implementation: p5.js with rectangular hit regions and a text panel drawn on the canvas.
</details>

## Publishing: From Files to a Live Book

A MicroSim is only useful once learners can reach it. The remaining technologies in this chapter turn a folder of files into a live book.

### MkDocs

**MkDocs** is a static site generator for documentation: a program that reads a folder of Markdown text files and a configuration file and produces a complete website of plain HTML pages. This book uses MkDocs with the Material theme, which adds navigation, search, admonition boxes such as the mascot's, and a clean responsive design. *Markdown* is a lightweight text format in which a pound sign starts a heading and asterisks make text bold, so authors write text without HTML tags.

Two files matter most. The `mkdocs.yml` file holds the site title, the theme, and the navigation menu. The `docs` folder holds the Markdown pages and each MicroSim's folder. A fragment of the navigation setting shows how a chapter appears in the menu.

```yaml
nav:
  - Chapters:
    - List of Chapters: chapters/index.md
    - "1. What Is a MicroSim": chapters/01-what-is-a-microsim/index.md
```

Each line pairs a menu label with the path of a Markdown file. To preview the site while writing, run `mkdocs serve`, which builds the pages and serves them on your own computer at a local address, updating the display as you save changes. To produce the finished site, run `mkdocs build`.

Markdown is deliberately plain. The lines below produce a heading, a bold phrase, a bulleted list, and an embedded MicroSim, and they are all that an author writes.

```markdown
## The Bouncing Ball

Set **gravity** and predict the result.

- Move the slider
- Press Drop Again

<iframe src="../../sims/bouncing-ball-gravity-lab/main.html" width="100%" height="502px"></iframe>
```

A **worked example** follows a chapter through MkDocs. You write `index.md` in a chapter folder. MkDocs converts its Markdown to HTML, applies the theme, adds it to the navigation menu, and builds a search index. The MicroSim iframe in the page then loads `main.html` from the MicroSim's own folder. You wrote text, and MkDocs produced a website.

The next diagram traces the whole path from an author's files to a learner's browser.

#### Diagram: From Author to Learner

<iframe src="../../sims/author-to-learner-workflow/main.html" width="100%" height="602px" scrolling="no"></iframe>

[Run the From Author to Learner MicroSim Fullscreen](../../sims/author-to-learner-workflow/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>From Author to Learner</summary>
Type: workflow
**sim-id:** author-to-learner-workflow<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Learning objective (Bloom level: Understand; verb: summarize): The learner will summarize the path a MicroSim takes from an author's files to a learner's browser.

Diagram: a top-to-bottom flowchart. Author writes files (Markdown, HTML, JavaScript) to Local preview with mkdocs serve to Commit to Git to Push to the GitHub repository to mkdocs gh-deploy builds the site to GitHub Pages serves the pages to Learner's browser loads the page, the iframe, and the library from a CDN.

Interactions: every step has a click directive that opens an infobox naming the command or tool used and what could go wrong at that step. Hovering the arrow between steps shows the artifact passed along (for example "HTML pages" or "commit").

Responsive design: the diagram scales to the container width, and long labels wrap.

Implementation: Mermaid flowchart with click callbacks.
</details>

### Git Version Control

**Git** is a version control system: software that records every change to a set of files, so that you can see what changed, undo a mistake, and work with others without overwriting their edits. Each saved snapshot is called a *commit*, and it carries a message explaining why the change was made. The basic cycle is to stage the files you changed, commit them, and push the commits to a shared copy of the repository.

```bash
git add docs/chapters/01-what-is-a-microsim/index.md
git commit -m "Write Chapter 1 content"
git push
```

Git is also how this book keeps its history. The original MicroSims 1.0 book is preserved as a tagged version, so a reader can always return to it.

### GitHub Pages

**GitHub Pages** is a hosting service that publishes a repository's static website on the web at no cost for public projects. The command `mkdocs gh-deploy` builds the site and pushes the result to a special branch that GitHub Pages serves. After a deploy, anyone with the address can read the book and run its MicroSims, with no server for the author to maintain.

### Open Educational Resources and Creative Commons

An **open educational resource (OER)** is teaching and learning material that is free to use and, in most cases, free to adapt and share under an open license. OERs lower the cost of education, and they let teachers customize materials for their own students.

A **Creative Commons license** is a standard public license that lets an author state, in a simple way, what others may do with a work. This book uses CC BY-NC-SA 4.0, which means that others may copy and adapt the work if they give credit (BY), do not use it commercially (NC), and share their adaptations under the same terms (SA). Because MicroSims are small and self-contained, licensing them clearly is what lets a teacher in one school reuse a simulation built in another.

## Instrumented MicroSims: Simulations That Report Evidence

We arrive at the idea that most distinguishes this book from its first edition. An **instrumented MicroSim** is a MicroSim that records meaningful learner interactions, such as changing a control, running a simulation, or answering a question, and reports them as small structured events in a standard format called xAPI, without changing how the MicroSim behaves for the learner. *Instrumented* is the engineering word for "fitted with sensors."

Why bother? Because an intelligent textbook needs to know whether learning is happening, and completion checkboxes and page views say little. If a learner moves the gravity slider through a wide range, predicts an outcome, and answers a related question correctly on the first attempt, that sequence is evidence about their understanding. A stream of such events, tied to the concepts in the learning graph, could allow software to estimate which concepts a learner has mastered. That estimate, and how well it can be trusted, is the central question of this book.

A **worked example** shows the kind of events involved. A learner opens the gravity lab and works through it:

| Step | What the learner does | What kind of event it is |
|---|---|---|
| 1 | Reads the page for several seconds | Experienced (time spent) |
| 2 | Moves the gravity slider from 0.8 to 1.6 and stops | Interacted (a control changed) |
| 3 | Predicts "lower" and answers | Answered (with correct or incorrect) |
| 4 | Presses Drop Again three times | Experienced (a run of the simulation) |

Later chapters explain which of these count as real evidence and which are noise, such as an accidental click that lasts a fraction of a second.

!!! mascot-thinking "Evidence, Not Proof"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Every bounce leaves evidence, but evidence is not proof. A learner can change a slider by accident, or guess an answer correctly, so the goal is to combine many small signals and be honest about how far they can be trusted.

We should also be candid about where the field stands. The runtime that produces these events exists, and designs for storing and analyzing them exist. This book has not yet collected data from real learners, so its claims about prediction are hypotheses with an evaluation method attached, not established results. Chapters 18 and 19 show how to test those hypotheses.

Now test your grasp of the four kinds of object in this chapter with the classifier below.

#### Diagram: Which Kind of Object Is It?

<iframe src="../../sims/which-kind-of-object-classifier/main.html" width="100%" height="492px" scrolling="no"></iframe>

[Run the Which Kind of Object Is It? MicroSim Fullscreen](../../sims/which-kind-of-object-classifier/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Which Kind of Object Is It?</summary>
Type: microsim
**sim-id:** which-kind-of-object-classifier<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: distinguish): The learner will distinguish learning objects, interactive simulations, MicroSims, and instrumented MicroSims by sorting example descriptions into the correct category.

Layout: four labeled bins across the bottom of the drawing region (Learning Object, Interactive Simulation, MicroSim, Instrumented MicroSim) and a card in the center that shows one example description at a time. The control region holds a Next button and a score readout.

Data: at least twelve cards, three per category, such as "A five-minute video on photosynthesis", "A pendulum whose length you can change, in a desktop application", "A two-slider ball simulation embedded in a chapter with a metadata file", and "The same simulation that also sends slider and answer events to a record store".

Interactions: the learner drags a card to a bin. A correct placement turns the bin green and shows a one-sentence explanation. An incorrect placement shakes the card and shows the property that the example is missing. The score shows correct answers out of attempts, and cards are shuffled on each run.

Responsive design: bin widths and card size scale with the container width on window resize, and text wraps inside cards.

Implementation: p5.js with mouse drag events and describe() text for screen readers.
</details>

## Putting It All Together

We can now trace one MicroSim through everything in this chapter. An author states a learning objective and writes a prompt. An AI agent loads a skill, asks a language model for code, and writes an HTML file, a JavaScript file that uses a library from a CDN, and a metadata file. The simulation is a MicroSim because it is small, interactive, embeddable, and described. The author previews it with MkDocs, commits it with Git, and deploys it to GitHub Pages. Readers see it through an iframe in a chapter of an intelligent textbook. If it is instrumented, it also reports events that flow toward a record store. Each part of that story has a chapter of its own later in the book.

## Chapter Summary

!!! mascot-celebration "You Have the Vocabulary"
    ![Bounce celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now tell a learning object from an interactive simulation, a MicroSim, and an instrumented MicroSim, and you know how AI and web technologies combine to produce them. That foundation carries you into every chapter ahead.

The key ideas of this chapter are:

- A learning object is a reusable unit of instruction, and an interactive simulation is a learning object with a model and immediate interaction.
- A MicroSim is a small, AI-generated, embeddable, width-responsive, described interactive simulation, and an instrumented MicroSim also reports learner events through xAPI.
- Generative AI, large language models, prompts, skills, and agents form the machinery that generates MicroSims, and every generated result must be tested.
- HTML5, CSS, and JavaScript make up a web page; libraries add capabilities; CDNs deliver them; iframes embed a MicroSim in any page.
- MkDocs, Git, and GitHub Pages turn files into a published book, and open licenses let others reuse the work.
- The central question of this book is how well the events from MicroSims predict concept mastery, and honest evaluation of that question comes later.

The next chapter opens a MicroSim and examines its files, regions, and metadata in detail.
