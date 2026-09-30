---
title: Course Description for MicroSims 2.0
description: A detailed course description for MicroSims 2.0 - designing, generating, checking, instrumenting and evaluating AI-generated interactive MicroSims whose xAPI event streams predict concept mastery - including overview, topics covered and learning objectives in the format of the 2001 Bloom Taxonomy
quality_score: 98
---

# MicroSims 2.0: Generating, Instrumenting and Evaluating Interactive Learning Objects with AI

**Title:** MicroSims 2.0: Generating, Instrumenting and Evaluating Interactive Learning Objects with AI<br/>
**Audience:** Teachers, educators, instructional designers, learning-technology developers, and learning-analytics practitioners (college undergraduate and professional development)<br/>
**Course Length:** 16-week course<br/>
**Credits:** 3 semester hours<br/>
**Version:** 2.0. The original book (MicroSims 1.0) is preserved at the git tag `v1.0`.

## Prerequisites

Some familiarity with programming is helpful: variables, control flow, loops and debugging. Although most MicroSims are written in JavaScript, knowledge of Python or a similar language is adequate. Students should be comfortable using a web browser, a text editor and a command line at a basic level. No prior experience with generative AI tools, xAPI, learning analytics or statistics is required. The course introduces each as needed.

## Course Overview

A MicroSim is a small, AI-generated, iframe-embeddable, width-responsive, *instrumented* interactive learning object. Since the first version of this course, the practice of making MicroSims has changed. MicroSims are no longer only p5.js animations. They now include charts, plots, diagrams, networks, timelines, maps, image overlays, comparison posters, runnable code labs and more. They are chosen by matching a learning objective to an interaction pattern, generated in batches from specifications by AI skills, checked by automated layout and quality tools, found again through metadata search, and instrumented with xAPI so that every interaction becomes evidence about what a student knows.

This last point is the core of the course. **The central question is how well the xAPI event stream from a MicroSim predicts whether a student has mastered a concept.** Every topic in the course is taught with this question in mind: which interactions count as evidence, how a design choice raises or lowers the diagnostic value of an interaction, how events are linked to concepts in a learning graph, how compact and full event streams differ in what they preserve, and how to measure the fidelity of the resulting prediction. The course is honest about the limits of this claim. It separates what has been measured from what is designed or hoped for, and it teaches students to evaluate prediction quality rather than assume it.

Students learn to use AI skills and agents to generate and refine simulation code, but they also learn the pedagogy behind good MicroSims: matching Bloom's Taxonomy level to interaction, cognitive load, accessibility and Universal Design for Learning. They learn the engineering behind reliable ones: width-responsive layout, iframe height management, Playwright-based checks, a 100-point quality score, and vision-based layout review.

## Course Introduction

The course begins with what a MicroSim is and why it matters for an intelligent textbook, using a tour of showcase MicroSims (for example a fully animated H-Bridge circuit). Students then take a MicroSim apart (its HTML wrapper, JavaScript, documentation page and metadata) and learn how to state a measurable learning objective for each concept, because a concept must be defined before a student's mastery of it can be predicted.

Students then learn to choose a MicroSim type. A routing rubric maps a learning objective, and the kind of content behind it, to one of more than a dozen generator types. An instructional design checkpoint asks whether the learner predicts before seeing the answer and what animation adds. Students generate single MicroSims with AI skills and study each type family in turn.

The second half of the course turns to engineering and evidence: responsive design, automated quality assurance, batch generation from specifications, metadata and reuse search, xAPI instrumentation, and two strategies for storing and analyzing the events: the full Learning Record Store (LRS) built for scale, and LRS-Lite, a serverless compact design. The course closes with evaluation of predictive fidelity, a capstone portfolio, and a look at the future of MicroSims.

## Topics Covered

1. **What a MicroSim is**: definition, role in intelligent textbooks, and the difference between MicroSims 1.0 and 2.0
2. **Anatomy of a MicroSim**: `main.html`, JavaScript, `index.md`, `metadata.json`, iframe embedding, pinned libraries and the draw and control layout
3. **Learning objectives and Bloom's 2001 Taxonomy**, and the instructional design checkpoint
4. **Choosing a MicroSim type**: the type catalog, routing rubric and objective-to-type mapping
5. **Generating MicroSims with AI skills**: prompt and specification design
6. **p5.js MicroSims**: animation, physics and showcase-quality techniques
7. **Charts, plots and tables**: Chart.js, Plotly, bubble charts and comparison tables
8. **Diagrams, networks and systems**: Mermaid, vis-network, Venn and causal-loop diagrams
9. **Timelines and maps**: vis-timeline and Leaflet
10. **Image overlays, grids and comparison posters**, including fact-verified posters
11. **Runnable labs and other specialized types**: Docker Python labs, concept-classifier sorting quizzes and celebration effects
12. **Width-responsive design and iframe heights**
13. **Quality assurance and automated layout review**: Playwright, the quality score and vision review
14. **Batch generation from specifications**: spec extraction, scaffolding, status lifecycle and resumable runs
15. **Metadata, search and reuse**: Dublin Core and search metadata, and reuse-before-build
16. **Instrumenting MicroSims with xAPI**: verbs, evidence classes, the producer contract and concept mapping
17. **The full LRS**: architecture for scale, ingestion, storage, dashboards and Bayesian knowledge tracing
18. **LRS-Lite**: the serverless, compact strategy, and choosing between Full and Lite
19. **Pedagogy, accessibility and evaluation**, including how to measure the predictive fidelity of an event stream
20. **Capstone**: building an instrumented MicroSim portfolio
21. **The future of MicroSims**: near-term directions and the long-term prospect of AI-generated MicroSims that are both engaging and better predictors of mastery

## Topics Not Covered

- Writing a general-purpose programming course. JavaScript is taught only as needed for MicroSims.
- Training or fine-tuning large language models. The course uses existing AI tools and skills.
- Building a commercial learning management system (LMS) or a complete SCORM/cmi5 authoring tool. The course uses xAPI and mentions other standards only for comparison.
- Deep statistical or machine-learning theory beyond what is needed for knowledge tracing and evaluation of predictions.
- Three-dimensional, VR or game-engine simulations.
- Administering a school district's identity, roster and compliance systems in production. The course covers the design and the privacy principles, not the legal advice.
- Claims of proven learning gains. The course teaches how to evaluate learning and prediction, not to assume them.

## Learning Outcomes

After this course, students will be able to demonstrate the following competencies.

### Remember

- Define a MicroSim and list its files (`main.html`, the JavaScript file, `index.md`, `metadata.json`)
- Name the six levels of Bloom's 2001 Taxonomy and the verbs associated with each
- List the MicroSim types in the catalog and the library that each type uses
- Recall the three xAPI verbs used by MicroSims (`answered`, `experienced`, `interacted`) and the required fields for each
- Identify the six xAPI evidence classes and the thresholds below which an interaction is not evidence
- State the four parameters of a Bayesian knowledge tracing model (initial knowledge, learning, guess and slip)

### Understand

- Explain why an interactive MicroSim can teach more effectively than a static diagram, and when it cannot
- Describe how a learning objective's Bloom level guides the choice of interaction pattern
- Explain why one concept identifier per statement and the order of answer attempts matter for mastery estimation
- Describe how width-responsive design, iframe heights and control visibility affect both learning and data quality
- Summarize the differences between the full LRS and LRS-Lite in what each stores, what each preserves, and what each costs
- Explain what prediction fidelity means and why hover-only or very short interactions are excluded as evidence

### Apply

- Use an AI skill to generate a MicroSim of the type recommended by the routing rubric
- Write a specification block that a batch pipeline can turn into a working MicroSim
- Run the validation, height-sync, Playwright and layout-review tools and correct the defects they report
- Add xAPI instrumentation to an existing MicroSim and map each interaction to a concept in a learning graph
- Configure a book's identity and policy (Compact or Full) for xAPI
- Search the MicroSim index for an existing example and reuse or adapt it rather than building a new one

### Analyze

- Break a learning objective into concepts and decide which MicroSim interactions provide evidence for each
- Compare candidate MicroSim types for the same objective on diagnostic value, cognitive load and effort
- Diagnose layout, height and responsiveness defects from screenshots and test output
- Examine an xAPI event stream and separate real evidence from noise (accidental clicks, idle time and guessing)
- Contrast what a Compact summary and a Full stream each reveal about the same student session
- Trace how a change in a MicroSim's design changes the sequence of events that a knowledge-tracing model receives

### Evaluate

- Judge a MicroSim against the quality score and against its stated learning objective
- Critique a MicroSim's instrumentation for missing, redundant or misleading evidence
- Assess the predictive fidelity of an event stream by comparing predicted mastery with held-out assessment results (correlation, calibration and discrimination)
- Evaluate the trade-offs between the full LRS and LRS-Lite for a given school, class size, budget and privacy requirement
- Appraise the privacy and equity risks of collecting learner data, and decide what a MicroSim should not record
- Distinguish claims that have been measured from those that are only designed or hoped for

### Create

- Design an original MicroSim that pairs an interaction pattern with a measurable learning objective and a plan for the evidence it will produce
- Produce a batch of MicroSims from specifications that pass the quality gate and the automated layout checks
- Construct complete metadata and an xAPI configuration for a portfolio of MicroSims
- Build a capstone portfolio of instrumented MicroSims and report on how well its event stream predicts mastery of its target concepts
- Propose a design for a future AI-generated MicroSim that is both engaging and a better predictor of mastery, and state how the claim would be tested

## Assessment Methods

- Weekly assignments: generating, checking and instrumenting MicroSims (35%)
- Midterm project: a set of MicroSims of at least three different types, generated from specifications, passing the quality gate (20%)
- Evaluation report: measuring the predictive fidelity of an event stream (15%)
- Capstone project: an instrumented MicroSim portfolio with documentation and a mastery-prediction analysis (25%)
- Class participation and peer reviews (5%)

## Required Materials

- Access to a generative AI tool or agent that can run skills (for example Claude Code)
- A modern web browser with developer tools
- A text editor or integrated development environment, and a command line
- A GitHub account for version control and deployment
- Python 3 and Node.js for the quality and instrumentation tools (Playwright is installed as needed)

## Why This Course Matters

Interactive simulations are among the most effective ways to teach abstract ideas, but they have been too expensive to build for most teachers. AI now makes them cheap to produce, which creates a new problem: it is easy to generate many MicroSims and hard to know which ones work. Instrumentation answers that question. A MicroSim that emits well-designed events can tell a teacher, an author or an adaptive textbook whether a student has mastered a concept, and which of the book's own MicroSims are doing the teaching. This course prepares educators and developers to build that capability responsibly, with attention to quality, accessibility, equity and privacy.
