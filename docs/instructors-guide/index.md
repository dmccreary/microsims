---
title: Instructor's Guide
description: A guide for instructors teaching MicroSims 2.0, covering the course structure, a 16-week schedule, the MicroSims and their lesson plans, assessment, responsible use of learner data, licensing, customization and analytics.
---

# Instructor's Guide

This guide is for instructors who teach from *MicroSims 2.0: Generating, Instrumenting and Evaluating Interactive Learning Objects with AI*, whether as the full 16-week, 3-credit course described in the [Course Description](../course-description.md) or as a shorter professional development workshop for teachers. It explains how the book is organized, how to schedule and assess the course, how to use each feature in class, and how to make your own copy of the book. Technical terms are defined the first time they appear, so you do not need a programming background to read it.

## About This Intelligent Textbook

### What Is an Intelligent Textbook?

An **intelligent textbook** is a digital textbook that goes beyond static text and images. It adds interactive simulations, a searchable glossary, and a structured map of how the book's concepts depend on each other. The aim is a richer learning experience than a printed book can give.

### The Five Levels of Intelligent Textbooks

Digital textbooks can be placed on five levels according to how interactive and adaptive they are:

<iframe src="https://dmccreary.github.io/intelligent-textbooks/sims/book-levels/main.html" height="500px" width="100%" scrolling="no"
  style="overflow: hidden;"></iframe>

| Level | Name | Description | Example Features |
|-------|------|-------------|------------------|
| **Level 1** | Static Digital | A PDF or basic web version of a print textbook | Text and images only |
| **Level 2** | Interactive | Adds simulations, searchable glossaries and other interactive elements | MicroSims, concept search, learning graph |
| **Level 3** | Adaptive | Adjusts content based on each student's performance | Personalized learning paths |
| **Level 4** | AI-Assisted | Includes an AI tutor that answers student questions | Chatbot integration, automated feedback |
| **Level 5** | Fully Adaptive AI | Learns continuously from student interactions | Real-time content generation |

**This book is a Level 2 intelligent textbook.** It also teaches the groundwork for Level 3: Chapters 16 to 23 show how to instrument MicroSims so their events can estimate what a student has mastered. The book's own MicroSims do not yet send data to any store, so the book does not adapt to individual readers.

### What Makes This Book Different

- **One central question.** Every chapter is written around how well the event stream from a MicroSim predicts whether a student has mastered a concept. Students design, generate and check MicroSims with that question in mind.
- **An honesty rule.** The book separates what has been **measured** from what is **designed** and what is **hoped for**. Several chapters end with a "What Is Built, Designed and Hoped For" table. This is a skill you can teach and grade (see [Teaching the Honesty Rule](#teaching-the-honesty-rule)).
- **112 MicroSims built for this edition**, each with a lesson plan you can use in class.
- **A learning graph** of 462 concepts and 716 dependencies that shows which ideas must come before others.
- **Bounce**, a learning mascot who guides students through each chapter (see [Bounce: The Pedagogical Agent](#bounce-the-pedagogical-agent)).
- **Free and open.** The book is licensed under Creative Commons for non-commercial use.

## The Course at a Glance

| Item | Details |
|------|---------|
| Audience | Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development) |
| Length | 16 weeks, 3 semester hours |
| Prerequisites | Some programming (variables, loops, debugging) in JavaScript, Python or a similar language; basic use of a browser, text editor and command line |
| Not required | Prior experience with generative AI, xAPI, learning analytics or statistics |
| Size | 26 chapters, about 163,000 words, 462 concepts |

### Required Materials and Lab Setup

Students need the following before the first lab. Test the setup yourself on a lab machine before the term starts, because installation problems are the most common cause of a lost first week.

- **An AI tool that can run skills**, for example Claude Code. A **skill** is a packaged set of instructions that tells an AI agent how to do a task, such as generating a MicroSim of a given type.
- **A modern web browser** with developer tools (Chrome, Firefox, Edge or Safari).
- **A text editor or IDE** and a **command line** (Terminal on a Mac, PowerShell on Windows).
- **A free GitHub account** for version control and publishing.
- **Python 3 and Node.js** for the quality and instrumentation tools. Playwright, a tool that drives a browser automatically to test pages, is installed when the quality chapters need it.

### Assessment Weights

The course description sets these weights:

| Component | Weight | What Students Produce |
|-----------|--------|-----------------------|
| Weekly assignments | 35% | Generating, checking and instrumenting MicroSims |
| Midterm project | 20% | A set of MicroSims of at least three types, generated from specifications, passing the quality gate |
| Evaluation report | 15% | A measurement of the predictive fidelity of an event stream |
| Capstone project | 25% | An instrumented MicroSim portfolio with documentation and a mastery-prediction analysis |
| Participation and peer review | 5% | Class discussion and reviews of classmates' MicroSims |

## Using the Chapters

### How the Chapters Are Organized

The 26 chapters follow the life of a MicroSim. Each chapter introduces its concepts only after their prerequisites, so students should read the chapters in order.

| Chapters | Stage | Topics |
|----------|-------|--------|
| [1](../chapters/01-what-is-a-microsim/index.md)–[3](../chapters/03-learning-objectives-and-blooms-taxonomy/index.md) | Understand it | What a MicroSim is, its files, learning objectives and Bloom's Taxonomy |
| [4](../chapters/04-choosing-a-microsim-type/index.md)–[5](../chapters/05-generating-microsims-with-ai-skills/index.md) | Choose and generate it | The type catalog, routing rubric, and generating MicroSims with AI skills |
| [6](../chapters/06-p5js-microsims/index.md)–[11](../chapters/11-verified-posters-and-specialized-microsim-types/index.md) | Build it by type | p5.js; charts and plots; diagrams and networks; timelines and maps; image overlays and posters; verified posters and specialized types |
| [12](../chapters/12-width-responsive-design-and-iframe-heights/index.md)–[13](../chapters/13-quality-assurance-and-automated-layout-review/index.md) | Make it reliable | Width-responsive design, iframe heights, the quality score and automated layout review |
| [14](../chapters/14-batch-generation-from-specifications/index.md)–[15](../chapters/15-metadata-search-and-reuse/index.md) | Produce it at scale | Batch generation from specifications, metadata, search and reuse |
| [16](../chapters/16-xapi-statements-and-evidence/index.md)–[19](../chapters/19-evaluating-the-predictive-fidelity-of-the-xapi-stream/index.md) | Instrument it and predict mastery | xAPI statements, the xAPI runtime, knowledge tracing, and evaluating predictive fidelity |
| [20](../chapters/20-the-full-lrs-architecture-and-ingestion/index.md)–[23](../chapters/23-lrs-lite-sync-dashboards-and-choosing-full-or-lite/index.md) | Store and analyze the events | The full Learning Record Store and LRS-Lite, and how to choose between them |
| [24](../chapters/24-pedagogy-accessibility-and-ethics/index.md)–[26](../chapters/26-the-future-of-microsims/index.md) | Reflect and build | Pedagogy, accessibility and ethics; the capstone portfolio; the future of MicroSims |

### What Each Chapter Contains

Every chapter has the same parts, which makes it easy to plan a reading assignment:

1. **Summary.** A short paragraph on what the chapter covers and what students can do after it.
2. **Concepts Covered.** A table of the chapter's concepts from the learning graph, each with a **Concept Impact Score**: a number that grows with how many later concepts depend on this one, directly or indirectly. High scores mark foundational ideas that deserve extra class time.
3. **Prerequisites.** Links to the earlier chapters the reader needs.
4. **A welcome from Bounce**, the book's mascot.
5. **Main content.** Explanations, worked examples, tables and embedded MicroSims. Below each MicroSim is a **Diagram specification**, described in [MicroSim Specifications](#microsim-specifications).
6. **Mascot callouts** with key insights, tips, warnings about common mistakes, and encouragement on hard topics.
7. **Chapter Summary.** A bulleted list of the chapter's main points.

The chapters do not end with practice questions or quizzes. Use the lesson plans on each MicroSim's page and the weekly assignments below to give students practice.

### Suggested 16-Week Schedule

This schedule fits the 26 chapters into 16 weeks and places each major assessment after the chapters it depends on. Adjust it for your term length. Chapters vary in length, and the instrumentation chapters (16 to 19) are the densest.

| Week | Chapters | Assignment or Milestone |
|------|----------|-------------------------|
| 1 | 1 | Tour the [Showcase](../microsims-showcase.md); set up the lab tools |
| 2 | 2, 3 | Write measurable objectives for three concepts in a subject the student knows |
| 3 | 4, 5 | Generate a first MicroSim with an AI skill |
| 4 | 6 | Modify a p5.js MicroSim |
| 5 | 7, 8 | Generate a chart and a diagram MicroSim for the same objective and compare them |
| 6 | 9, 10 | Build a timeline, map or image-overlay MicroSim |
| 7 | 11, 12 | Make a MicroSim width-responsive and fix its iframe height |
| 8 | 13 | Run the quality tools on earlier work and fix what they report |
| 9 | 14 | **Midterm project due** |
| 10 | 15, 16 | Write metadata for the midterm MicroSims; **capstone proposal due** |
| 11 | 17 | Instrument one MicroSim with the xAPI runtime |
| 12 | 18, 19 | **Evaluation report assigned** |
| 13 | 20, 21 | Compare the full LRS's costs and features for a named school |
| 14 | 22, 23 | **Evaluation report due**; choose Full or Lite for the capstone |
| 15 | 24, 25 | Write the capstone data policy; peer review |
| 16 | 26 | **Capstone presentations** |

Assign the capstone proposal in Week 10, not Week 15. The [Chapter 25](../chapters/25-capstone-building-an-instrumented-microsim-portfolio/index.md) requirements (four to six MicroSims of at least three types, each scoring at least 70 on the validator, plus instrumentation, a usability test, a data policy and a fidelity report) take most of the second half of the term.

### Suggested Classroom Routine

- **Before class:** Assign the chapter as reading. Ask students to open every embedded MicroSim and write one question about it.
- **During class:** Project one MicroSim and ask students to predict what will happen before you change a control. Then use the MicroSim's lesson plan for a structured activity.
- **After class:** Assign a hands-on task that produces a MicroSim, a specification or a measurement, not just a written answer.

### A Shorter Professional Development Workshop

For a workshop of three or four sessions, use Chapters [1](../chapters/01-what-is-a-microsim/index.md), [3](../chapters/03-learning-objectives-and-blooms-taxonomy/index.md), [4](../chapters/04-choosing-a-microsim-type/index.md) and [5](../chapters/05-generating-microsims-with-ai-skills/index.md). Participants leave with one objective, one chosen MicroSim type and one generated MicroSim for their own subject. Add [Chapter 12](../chapters/12-width-responsive-design-and-iframe-heights/index.md) if they will embed MicroSims in their own course pages, and [Chapter 24](../chapters/24-pedagogy-accessibility-and-ethics/index.md) if they are considering collecting student data.

## Using the MicroSims

### What Is a MicroSim?

A **MicroSim** (short for "micro-simulation") is a small interactive learning object that runs in a web browser with no installation. Students move sliders, click buttons or drag items and see the result at once. In this book a MicroSim can be an animation, a chart, a diagram, a timeline, a map, an image with labeled hot spots, a sorting quiz or a runnable code lab.

MicroSims appear in the chapters inside **iframes**. An iframe is a window that shows one web page inside another. MicroSims load automatically when a student opens the chapter, and a **Fullscreen** button below each one opens it in its own tab.

### Where to Find Them

- **[MicroSims 2.0 by chapter](../sims/index.md)**: the 112 MicroSims built for this edition, grouped by the chapter that uses them.
- **[Showcase](../microsims-showcase.md)**: 31 MicroSims from across the family of intelligent textbooks, chosen because each explains something that text explains badly. It is a good first-day activity.
- **[Original MicroSims (1.0)](../microsims-old/index.md)**: the first edition's collection, mostly p5.js simulations of science, math and engineering topics.

### What Each MicroSim Page Contains

Every MicroSims 2.0 page has the same sections. The **Lesson Plan** is written for this course's audience and is ready to use:

| Section | What You Get |
|---------|--------------|
| About This MicroSim | What it shows and why |
| How to Use | What each control does |
| Iframe Embed Code | One line of HTML to place it on any web page |
| Lesson Plan | Audience, duration, prerequisites, timed activities and an assessment |
| References | Sources for further reading |

For example, the [Bloom Objective Sorter](../sims/bloom-objective-sorter/index.md) lesson plan is a 20-minute activity: the instructor models a classification procedure aloud, students sort twelve cards with the procedure shown and the rest without it, and the debrief discusses which verbs misled them. Its assessment is concrete: at least 20 of 24 outcomes placed at a defensible level.

### MicroSim Types and Libraries

Each MicroSim type uses a JavaScript **library**, a package of ready-made code. Most of the book's MicroSims use p5.js.

| Library | Good For | Examples in This Book |
|---------|----------|-----------------------|
| **p5.js** | Animation, physics, drag-and-drop and custom controls | [Bloom Objective Sorter](../sims/bloom-objective-sorter/index.md), [Coordinate System Explorer](../sims/p5-coordinate-system-explorer/index.md), [Evidence Threshold Lab](../sims/evidence-threshold-lab/index.md) |
| **Chart.js** | Bar, line and pie charts | [Chart Type Chooser](../sims/chart-type-chooser/index.md), [Capacity and Cost Explorer](../sims/capacity-cost-explorer/index.md) |
| **Plotly** | Function plots and charts with hover detail | [Function Plot Slider Lab](../sims/function-plot-slider-lab/index.md), [Calibration Curve Lab](../sims/fidelity-calibration-curve-lab/index.md) |
| **vis-network** | Networks and dependency graphs | [MicroSim Family Tree](../sims/microsim-family-tree/index.md), [Failure Boundary Explorer](../sims/failure-boundary-explorer/index.md) |
| **Mermaid** | Flowcharts and workflows | [AI Generation Pipeline](../sims/ai-generation-pipeline/index.md), [From Author to Learner](../sims/author-to-learner-workflow/index.md) |
| **vis-timeline** | Events over time | [MicroSims Milestones Timeline](../sims/microsims-milestones-timeline/index.md) |
| **Leaflet** | Maps | [Choropleth Threshold Lab](../sims/choropleth-threshold-lab/index.md), [Marker, Popup and Tile Source Map](../sims/marker-popup-tile-map/index.md) |

### Tips for Using MicroSims in Class

1. **Ask for a prediction first.** Before you move a control on the projector, have students say or write what they expect. The book's instructional design checkpoint ([Chapter 3](../chapters/03-learning-objectives-and-blooms-taxonomy/index.md)) is built on this habit.
2. **Then let students explore.** Give five to ten minutes on their own devices after the demonstration.
3. **Connect back to the text.** Each MicroSim sits next to the concept it illustrates. After exploring, have students reread that passage.
4. **Use MicroSims as critique material.** From [Chapter 13](../chapters/13-quality-assurance-and-automated-layout-review/index.md) on, ask students to judge a MicroSim against its stated objective, not just whether it works.
5. **Plan for connectivity.** Almost every MicroSim loads its library from the internet when it opens, so it needs a working connection even if you build the site on your own computer. Open the day's MicroSims on the classroom network before class.

!!! tip "Embed a MicroSim in Your Own Course Page"
    You can put any MicroSim on a page you control: a learning management
    system (LMS) such as Canvas or Moodle, a Google Site, or a plain HTML
    file. Copy the code from the MicroSim's **Iframe Embed Code** section.
    It looks like this:

    ```html
    <iframe src="https://dmccreary.github.io/microsims/sims/bloom-objective-sorter/main.html"
            height="562px"
            width="100%"
            scrolling="no"></iframe>
    ```

    Use the height given on each MicroSim's page. A height that is too
    small hides the controls at the bottom, which is the problem
    [Chapter 12](../chapters/12-width-responsive-design-and-iframe-heights/index.md)
    teaches students to prevent.

### MicroSim Specifications

Below each MicroSim in a chapter is a collapsible block labeled with the MicroSim's name. Click it to see the **specification**: the written description an AI skill used to generate the MicroSim. The chapters contain 113 of them. Each one states:

- the **learning objective**, with its Bloom level and verb
- the **layout**, **data** and **controls**
- the **default state** when the MicroSim loads
- the **responsive design** requirements and implementation notes

The specifications are teaching material in their own right. In Week 3 and again in Week 9, have students put a specification beside its finished MicroSim and find any place where the two differ. This prepares them to write their own specifications for the midterm.

## Assessment

### Grading the Major Projects

The book gives you measurable criteria you can grade against:

- **Quality gate.** New MicroSims must score at least **70** on the validator's 100-point quality score ([Chapter 13](../chapters/13-quality-assurance-and-automated-layout-review/index.md)). MicroSims carried over from the first edition are held to 85.
- **Type requirement.** The midterm and capstone both require at least three different MicroSim types.
- **Instrumentation check.** For the capstone, each MicroSim's xAPI instrumentation must pass the book's checking script ([Chapter 17](../chapters/17-instrumenting-microsims-with-the-xapi-runtime/index.md)).
- **Objective fit.** Ask whether each MicroSim's interaction matches the Bloom level of its objective. A tool score cannot judge this, so it needs your reading.
- **Claim labeling.** Grade whether each report labels its claims as measured, designed or hoped for.

### Bloom's Taxonomy in Your Own Assessments

Students learn Bloom's 2001 Taxonomy in [Chapter 3](../chapters/03-learning-objectives-and-blooms-taxonomy/index.md), and the course's own learning outcomes are written at all six levels. Use the same levels in your assignments so that the higher levels (Analyze, Evaluate, Create) are tested by projects and reports, and the lower levels by short checks.

| Level | Name | Example Assignment in This Course |
|-------|------|-----------------------------------|
| L1 | Remember | List the files of a MicroSim |
| L2 | Understand | Explain why hover-only interactions are not evidence |
| L3 | Apply | Generate a MicroSim of the type the routing rubric recommends |
| L4 | Analyze | Separate evidence from noise in a sample event stream |
| L5 | Evaluate | Judge a MicroSim against its objective and its quality score |
| L6 | Create | Design an instrumented MicroSim and a plan to test its predictions |

## Teaching the Honesty Rule

The book holds itself to one rule that students should also learn: **say what kind of claim you are making.**

| Kind of Claim | Meaning | Example from the Book |
|---------------|---------|-----------------------|
| **Measured** | Someone ran it and recorded the result | A retried quiz emitted three `answered` statements, checked in a browser |
| **Designed** | It is specified or built, but its effect has not been measured | Bayesian knowledge tracing as the mastery model |
| **Hoped for** | A goal or hypothesis | That real learners' event streams predict their later performance |

Two facts follow from this rule, and you should state them to your class early:

- **No learner data has been collected through MicroSims yet.** As of the repository status dated 2026-09-26 that the chapters cite, no MicroSim sends statements to a Learning Record Store. The book teaches how to evaluate predictions, not that they already work.
- **The status of the software changes.** Chapters 18 to 23 describe which parts of the Learning Record Store are built and which are only designed. Check the current state of the code before telling students a component is ready.

A good classroom routine: when a student presents a MicroSim or a report, ask "Is that measured, designed or hoped for?" Students quickly start asking it of each other and of published claims about educational technology.

## Teaching the xAPI and LRS Chapters Responsibly

### Key Terms

- **xAPI** (Experience API) is a standard format for recording learning events as short statements, such as "this learner answered question 3 correctly."
- An **LRS** (Learning Record Store) is a database built to store those statements.
- The **full LRS** in this book is a server-based design for many schools. **LRS-Lite** keeps each student's data in a small database in that student's own browser, with no server.

### Data for the Evaluation Report

The evaluation report asks students to measure how well an event stream predicts mastery. Because no real learner data exists yet, [Chapter 19](../chapters/19-evaluating-the-predictive-fidelity-of-the-xapi-stream/index.md) builds its worked example on a **synthetic cohort**: 200 simulated learners whose true mastery is known, so every score can be checked. Have students do the same. A synthetic cohort lets them practice accuracy, calibration and discrimination without touching anyone's personal data.

If you want students to collect real events, for example from classmates who try each other's MicroSims, take these steps first:

1. Get informed consent from every participant.
2. Use pseudonyms, never names or student ID numbers.
3. Keep only the events the data policy names, and delete the data at the end of the term.
4. Check with your institution's review board (IRB in the United States) before any results are shared outside the class.

### Privacy Laws to Know

Before anyone collects data that can identify a student, be aware of these rules:

- **FERPA** (Family Educational Rights and Privacy Act) is a U.S. federal law that protects student education records.
- **COPPA** (Children's Online Privacy Protection Act) is a U.S. federal law with added protections for children under 13.
- **State laws.** Many U.S. states have their own student privacy laws.
- **GDPR** (General Data Protection Regulation) is the European Union law that applies if any learners are in the EU.

[Chapter 24](../chapters/24-pedagogy-accessibility-and-ethics/index.md) covers privacy, equity and bias in prediction. This guide is not legal advice. Before using an instrumented MicroSim with real students, especially K-12 students, consult your school or district's data privacy officer.

## Using the Glossary

The [Glossary](../glossary.md) defines 670 terms, including every concept in the learning graph. Definitions follow the ISO 11179 standard, which means each is precise, concise, distinct from the others, and does not define a term using itself. Most entries also give an example.

Students can open the glossary from the navigation sidebar, search the page with Ctrl+F (Cmd+F on a Mac), or use the search bar at the top of any page.

Ways to use it in class:

- **Vocabulary preview.** Before a new chapter, have students look up the terms in its Concepts Covered table.
- **Write, then compare.** After reading, students write their own definition of a term and compare it with the glossary's.
- **Spot the circular definition.** Give students a few definitions that define a term with itself, and have them rewrite each one to the ISO 11179 standard. This practices the same skill they need when writing MicroSim metadata.

## Using the FAQ

The [FAQ](../faq.md) answers 71 common questions, grouped into categories such as Getting Started and Core Concepts. It was written for the first edition of this course, so it concentrates on p5.js and on generating MicroSims, and it does not yet cover the xAPI, knowledge-tracing and LRS chapters. Use it as homework support and discussion starters for Chapters 1 to 6.

## Using the Learning Graph

### What Is a Learning Graph?

A **learning graph** is a map of the course's concepts in which an arrow from one concept to another means "learn this first." It is a **directed acyclic graph** (DAG): the arrows have a direction, and following them never leads back to where you started. This book's graph has 462 concepts and 716 dependencies.

### How Instructors Can Use It

- **Check prerequisites.** Before teaching a concept, confirm that students have covered the concepts that point to it.
- **Find the gap.** When a student struggles, trace the concept back to its prerequisites to find the one that is missing.
- **Map your syllabus.** Compare the graph with your existing course to see what you already cover.
- **Focus class time.** Concepts with high Concept Impact Scores support many later concepts and repay extra time.

The interactive viewer is on the [Learning Graph](../learning-graph/index.md) page. The same section has the concept list, the concept taxonomy and quality reports on the glossary, FAQ and diagrams.

## Bounce: The Pedagogical Agent

### What Is a Pedagogical Agent?

A **pedagogical agent** is a character who appears throughout a textbook to guide students. Studies have found that such characters can make learners more engaged and more positive about what they are learning, an effect called the **persona effect**.

This book's agent is **Bounce**, a bright orange-red ball with sneakers and a blue headband, based on the classic bouncing-ball MicroSim. Bounce has no gender and is referred to as "Bounce" or *they*. Their catchphrase is "Let's bounce it around!"

### How Bounce Appears

Bounce appears in colored callout boxes called **admonitions**. There are seven kinds:

| Kind | Border Color | Purpose | Use Across the 26 Chapters |
|------|--------------|---------|----------------------------|
| Welcome | Blue | Opens the chapter | One per chapter |
| Thinking | Deep orange | Marks a key insight | 41 |
| Tip | Teal | Gives practical advice | 34 |
| Warning | Red | Flags a common mistake and how to avoid it | 49 |
| Encourage | Light blue | Supports students on a hard topic | 10 |
| Celebration | Purple | Closes the chapter | One per chapter |
| Neutral | Blue grey | General notes | 1 |

Bounce appears about seven times per chapter on average, never twice in a row, and less often in shorter chapters. Bounce does not appear in instructor-facing pages such as this guide.

### Tips for Instructors

- **Use the warnings as a checklist.** Bounce's warning callouts collect the mistakes students most often make. Before a lab, review that chapter's warnings with the class.
- **Use the thinking callouts as discussion prompts.** They mark the most important idea in each section.
- **Point struggling students to the encourage callouts.** They appear on the topics the book expects to be hardest.

## Using the References

The [References](../references.md) page lists p5.js resources, example collections and communities. In addition, each MicroSim page ends with its own References section.

Links on the web sometimes stop working when a page moves or is deleted. This is called **link rot**. If a link is broken, search for the title on the source site, or look for an archived copy on the [Wayback Machine](https://web.archive.org/). Please report broken links (see [Feedback](#feedback)).

## Feedback

### Reporting Problems and Suggestions

This book is an open-source project on **GitHub**, a website where people develop software and documents together. You can report a problem without knowing how to program.

A **GitHub Issue** is like a support ticket: a numbered report of a bug, a suggestion or a question that the author and others can discuss. To submit one:

1. Go to the book's repository: [dmccreary/microsims](https://github.com/dmccreary/microsims).
2. Click the **Issues** tab, then the green **New issue** button.
3. Give the issue a clear title, such as "Broken link on the Calibration Curve Lab page."
4. In the description, say which page has the problem, what you expected and what you saw, and your browser and device if relevant.
5. Click **Submit new issue**.

You need a free GitHub account to submit an issue. If you would rather not create one, use the [Contact](../contact.md) page.

Feedback that helps most:

- **Errors** in facts, code, spelling or formatting
- **Broken links**
- **MicroSim bugs**, such as a simulation that does not load, or controls that are cut off
- **Content suggestions**, such as a missing topic or a better example
- **Accessibility problems**, such as content that is hard to read or to use with a keyboard or screen reader

### Contributing Student MicroSims

Strong student MicroSims can be contributed back to the book. The [Submission Guidelines](../appendices/submission-guidelines.md) explain how, from a simple Issue with a link to the code to a full pull request.

## Understanding the License

### What Is a Creative Commons License?

A **license** says what others may do with a piece of work. A **Creative Commons (CC) license** is a standard, plain-language license widely used for educational content.

This book uses **CC BY-NC-SA 4.0**:

| Code | Full Name | Meaning |
|------|-----------|---------|
| **CC** | Creative Commons | A standard open license |
| **BY** | Attribution | You must credit the original author |
| **NC** | Non-Commercial | You may not use the material mainly to make money |
| **SA** | Share-Alike | If you change the material and share it, you must use the same license |
| **4.0** | Version 4.0 | The current version of the license |

### What You Can Do

- **Share** the book's link, or copy chapters for your students
- **Print** chapters for class use
- **Embed** the MicroSims in your own course pages
- **Change** the content: add examples, remove sections, reorder chapters
- **Translate** it into other languages
- **Build your own version** of the book based on this one

### What You Cannot Do

- **Sell** the book or charge students for access to it
- **Remove the credit** to the original author, Dan McCreary
- **Use a different license** for a changed version you share
- **Present it as your own work**

If you are unsure whether your use counts as commercial, such as a paid corporate training, contact the author before using it. For the full text, see the [Creative Commons License](../license.md) page.

## Customizing Your Own Copy

You can make your own version of this book, for example to add MicroSims for your subject or to fit your term. This section explains how.

### Key Technical Terms

- **Repository (repo):** the folder on GitHub that holds all of a project's files.
- **Git:** a tool that records every change to a set of files: what changed, when and by whom.
- **Fork:** a copy of a repository in your own GitHub account.
- **Clone:** a copy of a repository on your own computer.
- **Markdown:** a simple way to format plain text. `**bold**` makes **bold** text and `# Title` makes a heading.
- **MkDocs:** the program that turns the book's Markdown files into a website.
- **mkdocs.yml:** the settings file for the website. It sets the title, colors, navigation menu and features.

### Step 1: Create a GitHub Account

If you do not have one, create a free account at [github.com](https://github.com).

### Step 2: Fork or Clone the Repository

**Option A: Fork (easier, stays on GitHub)**

1. Go to [dmccreary/microsims](https://github.com/dmccreary/microsims).
2. Click **Fork** in the upper right.
3. A copy is created in your own account, where you can edit files in the browser.

**Option B: Clone (more control, works on your computer)**

1. Install Git from [git-scm.com](https://git-scm.com/).
2. Open a terminal and run:

```bash
git clone https://github.com/dmccreary/microsims.git
```

### Step 3: Make Changes

All content is in the `docs/` folder as Markdown (`.md`) files, which you can edit in any text editor. Chapters are in `docs/chapters/` and MicroSims in `docs/sims/`, one folder each.

The navigation menu is listed by hand in `mkdocs.yml`. When you add a page, add a line for it under `nav:` or it will not appear in the menu.

#### Changing the Title and Author

Open `mkdocs.yml` and edit these lines:

```yaml
site_name: Your Course Title
site_description: Your description here
site_author: Your Name
site_url: https://YOUR-USERNAME.github.io/microsims
```

#### Changing the Colors

This book uses the Material theme's default colors. To change them, add a `palette` section under `theme:` in `mkdocs.yml`:

```yaml
theme:
  name: material
  palette:
    primary: teal    # header and link color
    accent: orange   # highlight color
```

Available colors include red, pink, purple, deep purple, indigo, blue, light blue, cyan, teal, green, light green, lime, yellow, amber, orange, deep orange, brown, grey and blue grey.

#### Changing the Logo

The logo in the upper left is set by the `logo:` line under `theme:` in `mkdocs.yml`. It currently points to Bounce's welcome image, `img/mascot/welcome.png`. Point it to your own image in `docs/img/`.

### Step 4: Preview Your Changes

1. Install Python 3 from [python.org](https://python.org).
2. Install MkDocs and the Material theme, including the image tools this book's social-card plugin needs:

    ```bash
    pip install mkdocs "mkdocs-material[imaging]"
    ```

    The `[imaging]` extra needs the Cairo graphics library. If it will not install on your computer, delete the line `- social` under `plugins:` in `mkdocs.yml`. The book still builds; it only loses the preview images shown when a page is shared on social media.

3. In the project folder, start the preview server:

    ```bash
    cd microsims
    mkdocs serve
    ```

4. Open `http://127.0.0.1:8000/microsims/` in your browser.

The preview updates each time you save a file.

### Step 5: Publish Your Version

To publish your version as a free website on GitHub Pages, run:

```bash
mkdocs gh-deploy
```

This builds the site and publishes it at `https://YOUR-USERNAME.github.io/microsims/` within a few minutes.

## Customizing Your Analytics

### What Is Web Analytics?

**Web analytics** measures how visitors use a website: which pages they open, how long they stay and where they come from. For a course, it shows which chapters students read and which they skip.

### Google Analytics

This book uses **Google Analytics**, a free Google service, configured with the author's account. If you publish your own copy, replace it with yours so the visits are reported to you:

1. Sign in at [analytics.google.com](https://analytics.google.com/) with a Google account.
2. Create a **property**, Google's name for a website you track.
3. Copy the **Measurement ID**, which looks like `G-XXXXXXXXXX`.
4. In `mkdocs.yml`, replace the existing ID:

    ```yaml
    extra:
      analytics:
        provider: google
        property: G-YOUR-MEASUREMENT-ID
    ```

5. Publish the site again. Data starts to appear within 24 to 48 hours.

Google Analytics reports totals, not individual students. Reports show:

- which chapters and MicroSims are visited most and least
- how long visitors stay on each page
- what share of visitors use phones rather than computers
- what visitors type into the site's search bar

### Analytics Versus xAPI

Page-level analytics like this cannot tell you what a student knows. That is the job of the xAPI instrumentation taught in Chapters 16 to 23, which records individual interactions and can identify a learner. That makes it far more useful and far more sensitive. Follow the guidance in [Teaching the xAPI and LRS Chapters Responsibly](#teaching-the-xapi-and-lrs-chapters-responsibly) before using it with real students.
