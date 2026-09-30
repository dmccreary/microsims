---
title: Generating MicroSims with AI Skills
description: Shows how the MicroSim generator skill turns specification blocks and prompts into working MicroSims, and how to refine, review and debug the results.
generated_by: claude skill chapter-content-generator
date: 2026-09-30 10:29:03
version: 1.10
---

# Generating MicroSims with AI Skills

## Summary

Explains how AI skills and agents generate MicroSims from prompts and specifications, and how to refine, review and debug the results.

The chapter covers the generator skill, specification blocks, prompt design, iterative refinement and the failure modes of AI-written code such as hallucinated APIs and library drift. After it, students can generate and repair a MicroSim reliably.

## Concepts Covered

This chapter covers the following 24 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| MicroSim Generator Skill | 73 |
| Skill Reference Guide | 1 |
| Skill Template Asset | 1 |
| Specification Block | 47 |
| Diagram Specification | 12 |
| Drawing Specification | 11 |
| Prompt Design | 12 |
| System Prompt | 2 |
| Rules File | 1 |
| Iterative Refinement | 4 |
| Claude Code | 9 |
| Debugging AI Code | 2 |
| Code Review of AI Output | 1 |
| Skill Invocation | 8 |
| Agent Workflow | 6 |
| Human in the Loop | 1 |
| Generation Log | 2 |
| Hallucinated API | 5 |
| Library Version Drift | 3 |
| p5.js 2.x Migration | 2 |
| Reproducible Generation | 1 |
| Generation Failure Mode | 1 |
| Token Cost | 2 |
| p5.js Web Editor | 1 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: What Is a MicroSim](../01-what-is-a-microsim/index.md)
- [Chapter 2: Anatomy of a MicroSim](../02-anatomy-of-a-microsim/index.md)
- [Chapter 3: Learning Objectives and Bloom's Taxonomy](../03-learning-objectives-and-blooms-taxonomy/index.md)
- [Chapter 4: Choosing a MicroSim Type](../04-choosing-a-microsim-type/index.md)

---

## Welcome

!!! mascot-welcome "From Idea to Working MicroSim"
    ![Bounce waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Up to now you have learned what a MicroSim is, what it is made of, what it should teach and which type fits. This chapter is where you actually make one, and where you learn to fix the odd mistakes your AI partner will make along the way. Let's bounce it around!

The earlier chapters gave you a design vocabulary. This chapter turns that vocabulary into a working procedure: you write a precise specification, hand it to an AI agent that carries a generator skill, inspect what comes back, and repair it. We begin with the skill itself, then look at the agent that runs it and the specification it reads. We then turn to the prompts that steer the agent, the loop of refinement that follows, and the specific ways in which AI-written code fails. The chapter closes with the bookkeeping that makes generation repeatable and affordable.

## The Generator Skill

Chapter 1 defined an AI skill as a packaged set of instructions and reference material that an AI agent loads to perform a specialized task. The **MicroSim Generator Skill** is the skill this book relies on to create MicroSims. It lives in the `ibook-skills` repository as the `microsim-generator` skill, and its own description calls it a meta-skill: it does not know how to draw every kind of MicroSim itself, but it routes a request to the specialized generator that does. The routing step is the one you studied in Chapter 4. The skill states that it consolidates 17 individual generator skills into one entry point, and it adds six Python utilities that automate the repetitive parts of a batch run, such as parsing specifications and scaffolding directories.

A skill is not one file but a small folder with three kinds of parts, and the names matter because you will refer to them when you debug or extend the skill.

- The **entry file**, `SKILL.md`, holds the skill's name, its description and the numbered procedure the agent follows.
- A **skill reference guide** is a document in the skill's `references/` folder that teaches the agent how to build one family of MicroSims. The p5.js guide, `p5-guide.md`, runs to 1,238 lines and covers layout formulas, control patterns and common bugs. Other guides cover charts, timelines, maps and the remaining types.
- A **skill template asset** is a working example file in the skill's `assets/` folder that the agent copies structurally. For p5.js, the templates folder holds `bouncing-ball.js`, `main-template.html`, `index-template.md` and `metadata-template.json`. The p5.js guide marks reading these files as required before generating any p5.js MicroSim and tells the agent to copy the structural patterns of `bouncing-ball.js` exactly.

Reference guides and template assets do different jobs. A guide states rules in prose, and a template shows those rules working in code. Together they push the agent toward the layout and naming conventions you met in Chapter 2, such as `canvasWidth`, `drawHeight` and `controlHeight`, instead of letting it invent a new structure each time. The table below summarizes the parts.

| Part | Where it lives | What it gives the agent | Example |
|---|---|---|---|
| Entry file | `SKILL.md` | The procedure and the routing table | Steps 0 to 9 of the batch workflow |
| Reference guide | `references/` | Rules and patterns for one MicroSim family | `p5-guide.md`, `chartjs-guide.md` |
| Template asset | `assets/templates/` | Working code to copy structurally | `bouncing-ball.js`, `main-template.html` |
| Utility scripts | The `microsim-utils` folder | Deterministic batch steps | `extract-sim-specs.py` |

A **worked example** shows the parts cooperating. Suppose you ask for a custom simulation of a swinging pendulum. The entry file's routing table matches trigger words such as "simulation" and "physics" to the p5.js guide. The agent loads that guide and the p5.js templates, and only then writes `pendulum.js` in the standard structure. The Chart.js, map and timeline guides are never read, which keeps the agent's working context small. The interactive diagram below lets you trace this path for other requests.

#### Diagram: Generator Skill Anatomy Explorer

<details markdown="1">
<summary>Generator Skill Anatomy Explorer</summary>
Type: microsim
**sim-id:** generator-skill-anatomy-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: differentiate): The learner will differentiate the entry file, reference guides, template assets and utility scripts of the generator skill by tracing which parts an agent reads for a given request.

Layout: a drawing region above a control region. The drawing region shows a folder tree with four labeled boxes: SKILL.md, references, assets/templates and microsim-utils scripts, each connected by a line to a box labeled "Agent working context" on the right.

Controls: a dropdown "Request" with six sample requests (a bouncing ball simulation, a bar chart of survey results, a timeline of Unix history, a map of trade routes, a concept dependency network, a sorting quiz). A button "Trace" and a button "Reset".

Interactions: choosing a request and pressing Trace highlights the path the agent follows, in order: SKILL.md routing table, then the one matching guide, then the matching templates, then the utilities used. Boxes that are not read stay grey. Hovering a box shows a tooltip that says what it contains. Clicking a highlighted box opens a panel with one sentence explaining why the agent needs it for this request. A counter shows how many of the skill's guides were loaded out of the total shown.

Data: the request-to-guide mapping is taken from the routing table in the skill's SKILL.md file; the number of template files is read from a small JSON data file in the sim folder.

Responsive design: the canvas width follows the container width on every window resize, the folder tree stacks vertically below 500 pixels, and controls stay inside the control region at 400 pixels wide.

Implementation: p5.js with createSelect and createButton controls positioned relative to drawHeight, a describe() call for accessibility, and mouse hover and click handling on the boxes.
</details>

## Claude Code and Skill Invocation

**Claude Code** is a command-line tool, run from a terminal, that lets Claude act as a software agent inside your project directory: it can read files, write files and run commands there. The generator skill was designed to run in it. The p5.js guide recommends starting Claude Code from the root of your repository checkout, the directory that contains both a `.git` folder and the `mkdocs.yml` file, and it tells the agent to warn you if either is missing because the automatic installation steps may then fail.

**Skill invocation** is the act of asking the agent to use a named skill for a task, so that the skill's instructions are loaded into the agent's context. The prompts recorded in this repository's `docs/prompts` folder show the plain-language form. One reads, in part, "Use the microsim-p5 skill to create a new microsim called 'ooda'", followed by the topic. The recorded transcript then shows Claude Code reporting that the skill is running. You name the skill, the MicroSim's directory name and the subject, and the agent does the rest.

A **worked example** is that recorded OODA-loop session, which came from an earlier generator skill named `microsim-p5`. It shows an agent workflow in miniature. The agent first tried to fetch a Wikipedia article and received a 403 error, so it fell back to a web search for background. It then invoked the skill, created a directory under `docs/sims`, and wrote a JavaScript file and a `main.html` file. Notice that the transcript's `main.html` pins p5.js version 1.11.10, whereas the current template pins 2.3.2. That difference is a small, real instance of a problem we treat later in this chapter.

Naming the skill is the reliable route, because it removes guesswork about which instructions the agent should follow. If you simply say "make me a simulation," the agent may write code from general knowledge and skip the conventions in the guides and templates.

## The Agent Workflow

Chapter 1 defined an AI agent as a language-model-based program that can plan, use tools and act toward a goal. An **agent workflow** is the ordered sequence of steps such an agent follows to complete one job, mixing its own judgment with tool calls. For MicroSim generation, the skill's batch workflow is the workflow of record. Before reading the list, note two terms. A *scaffold* is the set of boilerplate files created for a new MicroSim, namely `main.html`, `index.md` and `metadata.json`. A *lifecycle state* is a label recording how far a MicroSim has progressed: specified, scaffolded, implemented, validated or deployed.

The skill's batch route for a whole chapter runs in these steps.

1. Extract every specification in the chapter into a JSON file with `extract-sim-specs.py`, along with a status file that records each MicroSim's lifecycle state.
2. Scaffold each MicroSim directory with `generate-sim-scaffold.py`.
3. Run the instructional design checkpoint, which matches the interaction pattern to the objective's Bloom level.
4. Write the JavaScript file, the one creative step, using the matched reference guide.
5. Insert iframe embeds into the chapter with `add-iframes-to-chapter.py`.
6. Score quality with `validate-sims.py`, sync iframe heights with `sync-iframe-heights.py`, and check that controls stay visible with `test-iframe-heights.py`.
7. Update the site navigation with `update-mkdocs-nav.py`.
8. Capture a screenshot and run a visual layout review, with at most three review-and-patch cycles.

The design principle is a division of labor. Deterministic work, such as creating directories and calculating iframe heights, is done by scripts that give the same answer every time. The agent's language model is reserved for the step that needs creativity, writing the sketch. The skill itself states that after scaffolding "the agent ONLY writes .js files," and it estimates that the utilities save about 430,000 tokens per batch run. That figure is the skill's own estimate, not a measurement we made.

#### Diagram: Batch Generation Workflow Stepper

<details markdown="1">
<summary>Batch Generation Workflow Stepper</summary>
Type: microsim
**sim-id:** batch-generation-workflow-stepper<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Understand; verb: explain): The learner will explain what each step of the batch generation workflow does and why it is done by a script or by the agent.

Layout: a horizontal row of eight numbered step boxes in the drawing region, one per step of the workflow listed above, with an arrow between boxes. Boxes done by a script are steel blue, the one creative step is orange, and the human checkpoints are green. A detail panel sits below the row.

Controls: buttons "Previous" and "Next" to step through the workflow, a button "Reset", and a checkbox "Predict first". With Predict first on, the sim hides the step's actor and asks "Script, agent or human?" with three buttons before revealing the answer.

Interactions: clicking any box selects it and fills the detail panel with the command or action, its input file, its output file, and the lifecycle state it produces. Hovering a box shows a tooltip with a one-line purpose. A small lifecycle bar at the top advances from specified to deployed as steps complete.

Data: step names, tools and lifecycle states come from the generator skill's batch workflow as described in this chapter.

Responsive design: the canvas width follows the container width on every window resize, the step row wraps into two rows below 600 pixels, and the buttons stay inside the control region at 400 pixels wide.

Implementation: p5.js with createButton and createCheckbox controls positioned relative to drawHeight, and a describe() call for accessibility.
</details>

### Human in the Loop

The phrase **human in the loop** describes a design in which a person reviews or decides at defined points of an automated process, rather than only at the start and the end. The generator skill builds in several such points. In its instructional design checkpoint, if a specification asks for animation on an objective whose verb is "explain," the skill tells the agent to flag the mismatch, recommend a step-through design and ask you whether to proceed. When a request could match several generators, the skill tells the agent to score the top three and present the options to you. The visual layout review stops after three cycles and reports what remains, instead of tweaking without end.

These are points where your judgment carries something the agent lacks: knowledge of your learners and your course. An agent can check whether a slider sits inside the control region. It cannot decide whether the slider helps a particular student notice the concept, so keep that decision for yourself.

!!! mascot-thinking "The Agent Does Not Own the Objective"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Think of the agent as a fast builder and yourself as the architect. The builder can follow the plan to the millimeter, but only the architect knows what the building is for. Every checkpoint in the workflow is a place where the plan can be corrected before it is built.

### Generation Log

A **generation log** is a written record, kept with the MicroSim, of how it was produced: the specification it came from, the skill and library versions in use, the prompts you gave, the decisions you made and the checks it passed. The skill already produces two pieces of such a record. The status file tracks each MicroSim's lifecycle state, and the instructional design checkpoint asks the agent to write a short "Instructional Design Check" naming the Bloom level, the recommended pattern and the rationale. This repository also keeps a log per chapter under `logs/` with start and end timestamps.

The generation log we recommend below is our own suggested format, not one the skill produces. Every field is something you can fill in without guessing, and the bracketed values are placeholders to replace with what your tool reports.

```yaml
sim-id: pendulum-period-explorer
generated: [date and time]
spec-source: docs/chapters/[chapter]/index.md, block "Pendulum Period Explorer"
skill: microsim-generator, version 1.0
library-pin: p5.js 2.3.2
model-and-tool: [model name and tool version as reported by the tool]
prompt: "Use the microsim-generator skill to create the MicroSim
  specified in the block with sim-id pendulum-period-explorer."
human-decisions:
  - Kept the step-through pattern instead of continuous animation.
checks-run:
  - validate-sims.py: [score]
  - test-iframe-heights.py: [pass or fail]
```

The value of the log appears months later, when a MicroSim misbehaves after a library upgrade and you need to know what it was generated against. The next sections build the pieces that a log records, starting with the specification.

## The Specification Block

Each MicroSim in this book begins as a **specification block**: a structured passage in a chapter's markdown file that describes one interactive element completely enough for a person or an agent to build it without further explanation. You have already seen many of them, in Chapters 1 to 4, in the collapsible blocks headed `#### Diagram:`. Chapter 2 described the MicroSim directory the skill creates, and Chapter 3 described how to write the objective that drives it. The specification block is where those two ideas meet: it is the contract between the author and the generator.

A specification block has a fixed skeleton. Before we look at an example, define the fields it contains.

- The **heading** is a line that begins `#### Diagram:` or `#### Drawing:` followed by a title. Tools find blocks by this line.
- The **type** names the kind of element, such as microsim or diagram.
- The **sim-id** is the kebab-case name that becomes the MicroSim's directory name under `docs/sims`. It must be unique across the whole book.
- The **library** names the JavaScript library, for example p5.js or vis-network, which the routing decision of Chapter 4 selects.
- The **status** records the lifecycle state. New specifications are marked Specified.
- The **learning objective** states a Bloom level and verb, as in Chapter 3.
- The **body** describes layout, controls, data, interactions and responsive behavior, and ends with an implementation line.

The extraction script reads exactly these fields. According to its documentation, `extract-sim-specs.py` parses both kinds of heading, pulls out the details block, the sim identifiers, the Bloom levels and the library hints, and can write a status file. The command takes the options `--project-dir`, `--chapter`, `--output`, `--status-file` and `--verbose`. Because the fields are machine-readable, a chapter's specifications can be processed as a batch, a topic Chapter 14 develops.

A **worked example** follows. It shows the fields, without its heading line, for a new MicroSim about the period of a pendulum. Read the annotations after each field name as your checklist for writing your own.

```text
Type: microsim
sim-id: pendulum-period-explorer          (unique, kebab-case)
Library: p5.js                            (from routing)
Status: Specified

Learning objective (Bloom level: Apply; verb: predict): The learner will
predict how the period of a pendulum changes when length changes, then
test the prediction.

Layout: drawing region above a control region; canvas 400 wide by 450 high.
Controls: slider "Length" 0.2 to 2.0 in steps of 0.1; button "Release".
Behavior: on release, the bob swings; a readout shows the measured period.
Responsive design: canvas width follows the container on resize.
Implementation: p5.js, createSlider positioned relative to drawHeight.
```

Two habits separate strong specifications from weak ones. First, state the objective with a measurable verb, because the skill's instructional design checkpoint reads the Bloom level to choose the interaction pattern. Second, give exact numbers for ranges, defaults and sizes, because every number you omit is a decision the agent will make for you.

### Diagram Specification and Drawing Specification

A **diagram specification** is a specification block introduced by a `#### Diagram:` heading. In this book it is the general form: every interactive element, whether a p5.js simulation, a network or a chart, is specified under that heading. A **drawing specification** is a specification block introduced by a `#### Drawing:` heading. The extraction script recognizes both headings in the same way, and the project's MicroSims 2.0 plan tells authors to write both kinds so that batch generation can find them.

We should be candid about a gap: the skill's documentation does not define a behavioral difference between the two. Our suggestion, which is a convention and not a rule of the tools, is to reserve `#### Drawing:` for elements that are mainly illustrations or labeled pictures and to use `#### Diagram:` for everything else. Whatever you choose, use it consistently, because a heading that neither pattern matches will not be extracted at all.

#### Diagram: Specification Block Anatomy Explorer

<details markdown="1">
<summary>Specification Block Anatomy Explorer</summary>
Type: microsim
**sim-id:** spec-block-anatomy-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: deconstruct): The learner will deconstruct a specification block into its fields and identify which field a given generation defect traces back to.

Layout: the drawing region shows a specification block as a stack of labeled bands: heading, type, sim-id, library, status, learning objective, body and implementation. A panel on the right shows what a tool extracts from the highlighted band.

Controls: a dropdown "Example spec" offering three specifications (one complete, one missing a Bloom verb, one with no numeric ranges), a button "Extract", and a checkbox "Show defects".

Interactions: hovering a band shows a tooltip defining the field. Clicking Extract runs a simulated extraction and fills the panel with the fields a parser would find, marking missing fields in red. With Show defects on, the learner is asked, for a described generated defect such as "slider range not what I wanted," to click the band that caused it, and the sim confirms or explains.

Data: the three example specifications are stored in a JSON file in the sim folder.

Responsive design: the canvas width follows the container width on every window resize, and the panel moves below the stack under 600 pixels.

Implementation: p5.js with createSelect, createButton and createCheckbox controls positioned relative to drawHeight, and a describe() call.
</details>

## Prompt Design

Chapter 1 defined a prompt as the text you give a language model to steer its output. **Prompt design** is the deliberate structuring of that text so that the output meets your needs on the first try, or fails in ways that are easy to diagnose. In a skill-based workflow you write far fewer long prompts than in a chat, because the specification block carries the detail. The prompt becomes a short instruction that names the skill and points to the specification. Prompt design still matters, however, for the times you work outside a specification, such as a quick experiment in the p5.js editor or a targeted repair.

The earlier prompts kept in this repository's `docs/prompts` folder show the structure that works. The basic prompt asks for a p5.js sketch, says to generate only the sketch file and not the HTML file, and then describes the simulation. The refined prompts add the layout: two regions, a drawing area at the top and a control area at the bottom, with all drawing in the first and all controls in the second, followed by lists of the controls and a description of the behavior. The responsive version adds a pointer to a template file. Notice the pattern: each layer of the prompt removes one decision from the model.

A **worked example** contrasts two prompts for the same MicroSim. The first is vague: "Make a simulation about pendulums." The second is structured:

```text
Use the microsim-generator skill to create the MicroSim specified in the
block with sim-id pendulum-period-explorer in
docs/chapters/[chapter]/index.md. Use the pinned library version in the
skill's main.html template. Generate only the JavaScript file; the scaffold
already exists. If the specification and the skill's conventions conflict,
stop and ask me.
```

The second prompt names the skill, the specification, the library version, the scope of output and the tie-breaking rule. Each clause closes off a way for the agent to go wrong. The vague prompt leaves the layout, the controls, the range of every slider and the library version to chance.

!!! mascot-tip "Name the Output You Do Not Want"
    ![Bounce giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Add one clause that says what to leave out, such as "do not generate the HTML file." Models tend to be helpful by doing extra work, and extra files are extra things for you to review.

### System Prompt and Rules File

A **system prompt** is a block of standing instructions supplied to the model before any user request, which shapes every response in the session. You do not type it each time. In Claude Code, the closest thing you control is the project instruction file. This repository's `CLAUDE.md` is an example: it lists development commands, the standard layout variables and the canvas creation pattern, and it is loaded so the agent starts each session already knowing them.

A **rules file** is a file of standing rules for code generation that lives in the repository and is applied to matching files. The repository's `.cursor/rules/microsims.mdc` is one. Its header describes it as rules for generating educational MicroSims based on p5.js, gives a file pattern for JavaScript files and sets `alwaysApply: false`, so it attaches when it matches rather than in every session. Its body tells the generator to always use p5.js unless told otherwise, to make sure the code works in the p5.js editor without changes, and to add a `describe()` call at the end of `setup()`.

The three sources of instructions, plus your own request, differ in when they act. The table below summarizes it. Read it after the definitions above, as a comparison, not an introduction.

| Instruction source | Scope | Loaded when | Use it for |
|---|---|---|---|
| System prompt or project instruction file | Every request in the project | The session starts | Layout variables, code style, standing commands |
| Rules file | Files that match a pattern | A matching file is in play | Rules specific to one kind of file |
| Skill | One family of tasks | The skill is invoked | Procedures, guides and templates |
| Prompt | One request | You send it | The specific MicroSim and its specification |

The rule of thumb that follows is to put a constraint at the widest scope where it is always true. The "no HTML file" instruction from the last tip belongs in a prompt, because it applies to one request. The rule that every canvas is parented to the `main` element belongs in the project instructions or a rules file, because it applies to every MicroSim.

#### Diagram: Prompt Quality Workbench

<details markdown="1">
<summary>Prompt Quality Workbench</summary>
Type: microsim
**sim-id:** prompt-quality-workbench<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Evaluate; verb: critique): The learner will critique a prompt by identifying which decisions it leaves to the model and which failure modes those open decisions make more likely.

Layout: the drawing region shows a prompt built from six togglable clauses stacked as cards: names the skill, points to the specification, pins the library version, limits the output files, states the layout, and gives a tie-breaking rule. Beside them is a panel titled "Decisions left to the model".

Controls: six checkboxes, one per clause, a button "Reset", and a dropdown "Scenario" with three requests of different difficulty.

Interactions: toggling a clause updates the assembled prompt text and the panel. The panel lists each decision the model must now make itself, for example "which library version" when the pin clause is off. Beside each open decision the panel names the failure mode from this chapter it makes more likely, such as library version drift. This is a teaching heuristic, and the panel says so in a footnote. Hovering a card shows an example of the clause.

Data: the clauses, open decisions and linked failure modes are stored in a JSON file in the sim folder.

Responsive design: the canvas width follows the container width on every window resize, the panel moves below the cards under 600 pixels, and checkboxes wrap to a second row at 400 pixels wide.

Implementation: p5.js with createCheckbox, createSelect and createButton controls positioned relative to drawHeight, and a describe() call.
</details>

## Iterative Refinement

The first output of a generation is rarely the last. **Iterative refinement** is the practice of improving a MicroSim through repeated cycles of test, observe and modify, where each cycle sends one targeted change request back to the agent. The p5.js guide gives sample refinement prompts, such as "Add a slider to control the parameter," "Show the current velocity value" and "Add a grid to help students measure distances." Each of them is small, specific and testable.

The cycle has four beats. First, run the MicroSim and compare what you see with the learning objective, not with your memory of what you asked for. Second, write down one difference. Third, describe that one difference to the agent, together with what must not change. Fourth, run it again. A **worked example** with the pendulum shows the rhythm in three rounds.

1. Round 1 result: the pendulum swings, but the period readout has six decimal places. Prompt: "Show the period with two decimal places. Change nothing else."
2. Round 2 result: the readout is right, but the slider label overlaps the slider at narrow widths. Prompt: "The Length label overlaps the slider below 500 pixels wide. Move the label left of the slider and keep the slider width rule."
3. Round 3 result: correct at all widths, but learners cannot tell which length produced which period. Prompt: "Keep a table of the last five releases with length and measured period."

Notice that the third round changes the design, not merely the code. That is a signal to go back to the specification and update it too, so that the block and the MicroSim never disagree.

!!! mascot-tip "One Change Per Round"
    ![Bounce giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Ask for a single change and name the variable or control it touches. If two changes arrive together and something breaks, you will not know which request caused it.

## Where Generated Code Goes Wrong

AI-written code fails in patterns, not at random. A **generation failure mode** is a recurring, nameable way in which generated MicroSim code goes wrong, described by its symptom and its usual cause. Naming the pattern is useful because it turns a vague complaint, "it looks broken," into a question you can answer: which failure mode is this? The p5.js guide catalogs several of them as "common bug patterns," and this chapter adds two that arise from the way language models work.

The table below lists the failure modes we cover. We define the two library-related ones in the following sections, and the layout ones were introduced in Chapter 2, so treat the table as a summary for later use.

| Failure mode | Typical symptom | Usual cause | First repair |
|---|---|---|---|
| Hallucinated API | Console error about an unknown function | The model wrote a call that the library does not have | Check the name in the library's reference |
| Library version drift | Code that once worked now errors or draws differently | Code and library versions no longer match | Compare the pin with the code's assumptions |
| Control in drawing area | A slider or button floats over the drawing | A hard-coded y position | Position relative to `drawHeight` |
| Non-responsive canvas | Canvas stays one width when the window resizes | A hard-coded width and no `updateCanvasSize()` | Restore the standard resize pattern |
| Wrong iframe height | Controls are clipped in the chapter | Iframe height differs from canvas height plus 2 | Run the height sync utility |
| Text with an outline | Labels look fuzzy or heavy | A stroke was still active when text was drawn | Call `noStroke()` before `text()` |

#### Diagram: Generation Failure Mode Triage

<details markdown="1">
<summary>Generation Failure Mode Triage</summary>
Type: microsim
**sim-id:** generation-failure-mode-triage<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: distinguish): The learner will distinguish generation failure modes by matching a described symptom to its most likely cause and first repair.

Layout: the drawing region shows a defective MicroSim thumbnail on the left (drawn by the sketch, with the defect visible) and six failure-mode cards on the right. The control region holds the controls.

Controls: a button "Next case" that loads one of eight defective-MicroSim cases, a button "Show console" that reveals a simulated browser console message for the case, and a button "Check" that confirms the learner's selected card.

Interactions: the learner reads the symptom, optionally opens the console message, clicks the failure-mode card they think applies and presses Check. The sim answers with the cause and the first repair and, for wrong choices, explains what evidence would have distinguished the two modes. Hovering a card shows its definition. A score line counts correct first tries.

Data: the eight cases, console messages and answers are stored in a JSON file in the sim folder; every case is drawn from the failure modes in the table above.

Responsive design: the canvas width follows the container width on every window resize, the cards move below the thumbnail under 600 pixels, and the three buttons stay visible at 400 pixels wide.

Implementation: p5.js with createButton controls positioned relative to drawHeight, a describe() call for accessibility, and interaction events logged through a single function so Chapter 17 can attach xAPI statements to it.
</details>

### Hallucinated API

A **hallucinated API** is a call to a function, method or option that does not exist in the library, written by the model because it looks plausible. Language models generate the text that best fits the pattern of their training material and your prompt; they do not consult a list of what a library contains. A function name that follows the library's naming habits can therefore appear in the output as confidently as a real one.

The symptom is usually an error in the browser console reporting that something is not a function, or a control that silently does nothing. The defense is a habit rather than a tool: for any call you do not recognize, check the name against the library's reference documentation. The p5.js guide links to the reference pages for the controls it recommends, `createButton`, `createSlider`, `createSelect`, `createCheckbox` and `createInput`, for exactly this purpose.

A **worked example** with an invented name shows the routine. Suppose generated code contains `createRangeSlider(0, 10, 5)`, a name we made up for this illustration. First, search the p5.js reference for the name. Finding nothing, conclude that the model has confused `createSlider`, which does exist, with a plausible variant. Second, replace it with the documented call and its documented arguments. Third, tell the agent what you found, so the next round does not reintroduce the mistake: "p5.js has no createRangeSlider. Use createSlider(min, max, value, step)."

!!! mascot-warning "Confident Does Not Mean Correct"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Watch out for fluent code that runs partway and then stalls: a nonexistent function often fails only when the line executes. Look up any unfamiliar function name in the library's reference before you debug anything else, and paste the exact console message into your next prompt.

### Library Version Drift

**Library version drift** is the growing mismatch between the library release that code was written for and the release it actually runs on, which turns once-correct calls into errors or changed behavior. It is a close cousin of the hallucinated API with one important difference: the drifted call did exist, in another release. Chapter 2 introduced the pinned library version, the exact release named in the script address of `main.html`, as the anchor against which generated code should be checked. Drift is what happens when the pin, the code and the tools in use stop agreeing.

Drift has several sources. The model may write in the style of an older release. The pin in `main.html` may be older than the template's current default. The p5.js Web Editor, which we meet below, may run a different release than your pin. This repository shows the second source in real files. The recorded OODA session pinned p5.js 1.11.10, while the skill's current template pins 2.3.2.

Three practices reduce drift. State the pinned version in your prompt so the model writes for it. Keep the version in `main.html`, in the page title and in `metadata.json` in agreement, as Chapter 2 advised. And when you change a pin, test every MicroSim that uses it, which is why a migration is a project and not a one-line edit.

### p5.js 2.x Migration

The **p5.js 2.x migration** is the work of updating existing p5.js MicroSims so they run correctly on p5.js release 2.x, the major version that the skill's templates now default to. The p5.js guide describes 2.x as largely backward compatible with 1.x sketches that use global mode, but it also says to consult the official migration guide if a sketch misbehaves after the upgrade. This repository's `TODO.md` records a static scan dated 2026-09-05 that found five MicroSims using v1-only calls, out of the many in `docs/sims`. Those findings are the best available example of what migration involves, so we use them.

Before reading the table, define the calls involved. `preload()` is a special function in v1 that runs before `setup()` to load images and other files. A *Bezier curve* call such as `bezierVertex()` adds a curved segment to a shape you are drawing between `beginShape()` and `endShape()`. `curveVertex()` adds a smooth curve through points, and `quadraticVertex()` adds a curve with one control point. The table summarizes the audit's findings.

| v1 call found | What v2 does, per the audit | Affected MicroSims |
|---|---|---|
| `preload()` | Removed. Load files inside `async function setup()` with `await` before `createCanvas()` | breadboard (four sketch files) |
| Multi-control-point `bezierVertex(...)` | Takes one control point per call. Chain several calls; use `bezierOrder()` for a quadratic curve | book-gen-workflow, temp-and-pressure |
| `curveVertex(...)` | Renamed `splineVertex()` with changed anchor-point rules; drop the duplicated first and last anchors and rely on `endShape(CLOSE)` | curve |
| `quadraticVertex(...)` | Folded into `bezierVertex()`; use `bezierOrder(2)` and single-control-point calls | flower-petal |

The most mechanical change is `preload()`. In v1, a sketch loads a file before setup runs. In v2 the loading moves into an asynchronous setup, as sketched below. The file name is a placeholder for whatever your sketch loads.

```javascript
// p5.js 1.x style: removed in 2.x
let boardImage;
function preload() {
  boardImage = loadImage('board.png');
}

// p5.js 2.x style: load inside an async setup, then create the canvas
let boardImage;
async function setup() {
  boardImage = await loadImage('board.png');
  createCanvas(canvasWidth, canvasHeight);
}
```

The migration sequence follows from the audit. Fix the five listed MicroSims first, as the TODO says to do before bumping any pin past 1.x. Then change the pin in `main.html`, the title and `metadata.json` together. Finally, rerun the validation, height and layout checks from the workflow, because a MicroSim that runs without errors can still draw differently.

#### Diagram: p5.js 2.x Migration Mapper

<details markdown="1">
<summary>p5.js 2.x Migration Mapper</summary>
Type: microsim
**sim-id:** p5-2x-migration-mapper<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Apply; verb: use): The learner will use the migration table to convert a short p5.js 1.x snippet into its 2.x form and identify which call in it is no longer valid.

Layout: the drawing region shows a code panel on the left with a 1.x snippet and a result panel on the right for the learner's 2.x version, each line clickable. A row of four call chips (preload, bezierVertex, curveVertex, quadraticVertex) runs across the top.

Controls: a dropdown "Snippet" with four snippets, each using one legacy call; a button "Flag legacy calls"; a button "Show 2.x form"; and a button "Reset".

Interactions: clicking Flag legacy calls highlights the lines that use a v1-only call and names the call. Clicking a highlighted line offers three candidate replacements, and the learner picks one. The sim confirms or explains the choice by quoting the migration guidance in this chapter, then Show 2.x form reveals the corrected snippet. Hovering a chip shows the one-line rule for that call.

Data: snippets and replacements are stored in a JSON file in the sim folder and must match the migration table in this chapter.

Responsive design: the canvas width follows the container width on every window resize, the two panels stack vertically below 600 pixels, and buttons remain visible at 400 pixels wide.

Implementation: p5.js with createSelect and createButton controls positioned relative to drawHeight, and a describe() call.
</details>

## Debugging AI Code

**Debugging AI code** is the systematic process of finding and fixing faults in code that an AI wrote, using the same evidence you would use for human-written code but with extra suspicion for the specific failure modes above. The process has five moves.

1. Reproduce the fault by opening the MicroSim's `main.html` in a browser, or by pasting the sketch into the p5.js editor, and note exactly what happens.
2. Read the browser's developer console for the first error message, because later errors are often consequences of the first.
3. Classify the fault against the failure-mode table: hallucinated call, version drift, layout defect or logic error.
4. Repair the smallest thing that explains the fault, by hand or by giving the agent the exact message and the surrounding lines.
5. Retest at several widths, then record the cause in the generation log.

A **worked example** comes straight from the p5.js guide. Suppose the canvas fails to appear and the console reports a null error. The generated code contains the following pair of lines. The reason is that the string form of `parent()` looks for an element with the id "main", and our `main.html` template deliberately has a `main` element with no id.

```javascript
// Fails: the string form searches for an element whose id is "main"
const canvas = createCanvas(canvasWidth, canvasHeight);
canvas.parent('main');

// Works: select the <main> element by its tag name
const canvas = createCanvas(canvasWidth, canvasHeight);
canvas.parent(document.querySelector('main'));
```

The repair is one line, and the follow-up is to add it to your project instructions so that no future generation repeats it. This is the pattern for every fault: fix it once in the code and once in the standing instructions.

### The p5.js Web Editor

The **p5.js Web Editor** is the free in-browser editor at editor.p5js.org where you can paste a sketch and run it immediately. The p5.js guide says the skill's JavaScript is designed to run there without changes, which is why every MicroSim keeps its canvas inside a `main` element, the same element the editor's own page provides. This makes the editor the fastest place to reproduce a fault and to try a fix before you touch the repository.

Use it with one caution taken from the guide: the editor may not run the same p5.js release as your pin, so a sketch that works there may still drift on your site. Compare the editor's library version with the one in `main.html` before you conclude the code is correct.

## Code Review of AI Output

**Code review of AI output** is a human inspection of generated code against a checklist before it is accepted, even when it runs. Running is a low bar: a MicroSim can execute without errors and still hide controls, break at narrow widths or teach the wrong thing. The p5.js guide supplies a post-generation validation checklist that doubles as a review list. Its structural checks include:

- `canvasHeight` equals `drawHeight + controlHeight`.
- The iframe height in `index.md` equals the canvas height plus 2.
- The first line of `setup()` calls `updateCanvasSize()`.
- A `windowResized()` function exists and calls `resizeCanvas()`.
- A `describe()` call is present for accessibility.
- The canvas is parented with `document.querySelector('main')`.

Its control checks confirm that every control sits below `drawHeight` and that every slider is resized in `windowResized()`. Its code quality checks include calling `noStroke()` before text and using the standard variable names. The guide also proposes a quick mental test at 400, 800 and 1200 pixels wide.

Add two checks that only a person can make. First, does the MicroSim serve the learning objective in the specification, or has the agent quietly changed the design? Second, does the interaction pattern fit the Bloom level, for instance a step-through for an "explain" objective rather than a continuous animation? Chapter 13 automates many of the mechanical checks; the judgment checks stay with you.

!!! mascot-encourage "Reviewing Code You Did Not Write"
    ![Bounce encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    Reading generated code you could not have written yourself can feel like a lot. You already checked specifications against objectives in Chapter 3, so start there: run the checklist above one row at a time, and look up any line you do not recognize before moving on.

## Reproducible Generation and Token Cost

**Reproducible generation** is the property that a MicroSim's origin is recorded well enough that someone else, or you next year, can regenerate it or explain why it looks the way it does. Be careful about what this promises. Language models do not guarantee the same output twice from the same prompt, so we should not assume that rerunning a generation yields identical code. What you can make reproducible is the set of inputs and the checks: the specification block, the skill and version, the library pin, the prompt and the validation results. Those are exactly the fields of the generation log shown earlier. The committed JavaScript file is the artifact of record, and the log explains how it got there.

**Token cost** is the amount of model text, counted in tokens, that a generation reads and writes, which drives the time and money it consumes. A *token* is a small piece of text, often part of a word, that a language model processes as a unit. Cost grows with everything the agent reads, including the entry file, a matched guide and the templates, and with everything it writes. We give no prices here because they change and vary by provider.

The skill contains several design choices that control cost. It loads only the guide matched to your request, and the p5.js guide alone is 1,238 lines, so loading every guide for every request would be wasteful. It moves deterministic work into scripts, which the skill estimates saves about 430,000 tokens per batch run. And its companion chapter-writing skill warns that running chapters in parallel uses about 38 percent more tokens than running them one at a time, which is why this book generates chapters sequentially. Both figures are the skills' own statements, not our measurements.

!!! mascot-thinking "Inputs Are the Reproducible Part"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Think of a generation like a bounce: you cannot promise the exact landing spot, but you can record the height, the angle and the floor. Record the specification, versions and prompt, and every later question about a MicroSim starts from evidence.

## Putting the Chapter to Work

The steps below pull the chapter together into one procedure that you can run on any new MicroSim idea. The chapters that follow fill in the type-specific details.

1. Write the learning objective with a Bloom level and verb, and route it to a type (Chapters 3 and 4).
2. Write a specification block under a `#### Diagram:` heading with a unique sim-id, a library and exact numbers.
3. Invoke the generator skill by name in Claude Code, pointing to the specification, the pinned library version and the output you want.
4. Run the checkpoints and utilities: extraction, scaffold, validation, height sync and layout review.
5. Review the code against the checklist, and reproduce any fault in the p5.js Web Editor.
6. Refine one change at a time, updating the specification whenever the design changes.
7. Record a generation log entry and commit the MicroSim.

Try it on a small idea of your own, such as a MicroSim that lets a learner change one quantity and watch one result. If a step fails, the failure-mode table tells you where to look first.

!!! mascot-celebration "You Can Now Generate and Repair a MicroSim"
    ![Bounce celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You just learned to write a specification block, steer the generator skill with a precise prompt, refine one change at a time, and diagnose hallucinated calls and library drift. That is the whole loop from idea to a MicroSim you can trust.

## Chapter Summary

- The MicroSim generator skill is a meta-skill made of an entry file, reference guides, template assets and utility scripts. It routes a request to one specialized guide and templates, keeping the agent's context small.
- Claude Code runs the skill. Skill invocation means naming the skill, the MicroSim and the subject in the request.
- An agent workflow splits work between scripts, which do deterministic steps, and the agent, which writes the sketch. Humans stay in the loop at design checkpoints, ambiguity and review.
- A specification block is the contract between author and generator. Diagram and drawing specifications differ only by heading, and both can be extracted by tool.
- Prompt design removes decisions from the model. Standing rules belong in a system prompt or rules file, procedures in the skill and one-off details in the prompt.
- Iterative refinement changes one thing per round, and design changes go back into the specification.
- Generation failure modes include hallucinated APIs and library version drift. The p5.js 2.x migration is a concrete example, with `preload()`, Bezier calls and `curveVertex()` among the changes.
- Debugging AI code means reproducing, reading the console, classifying, repairing the smallest cause and recording it. The p5.js Web Editor is the fastest place to reproduce, but its library version may differ from yours.
- Code review of AI output uses the guide's checklist plus two human checks: objective fit and interaction pattern.
- Reproducible generation records inputs in a generation log instead of promising identical output, and token cost is managed by loading only what is needed and using scripts for deterministic work.

Chapter 6 takes the p5.js type you have been generating and studies its code in depth, so that you can read and adjust what the agent writes.
