# Chapters

This textbook is organized into 26 chapters covering 462 concepts.

## Chapter Overview

1. [What Is a MicroSim](01-what-is-a-microsim/index.md) - Defines a MicroSim, explains its role in an intelligent textbook, and introduces the web and AI foundations that the rest of the book builds on.
2. [Anatomy of a MicroSim](02-anatomy-of-a-microsim/index.md) - Takes a MicroSim apart into its files, regions and metadata so students can read, modify and package any MicroSim they meet.
3. [Learning Objectives and Bloom's Taxonomy](03-learning-objectives-and-blooms-taxonomy/index.md) - Shows how to state measurable learning objectives, classify them with Bloom's 2001 Taxonomy, and apply cognitive load theory and the instructional design checkpoint before writing any code.
4. [Choosing a MicroSim Type](04-choosing-a-microsim-type/index.md) - Presents the catalog of MicroSim types and the routing rubric that maps a learning objective to the type and library best suited to it.
5. [Generating MicroSims with AI Skills](05-generating-microsims-with-ai-skills/index.md) - Explains how AI skills and agents generate MicroSims from prompts and specifications, and how to refine, review and debug the results.
6. [p5.js MicroSims](06-p5js-microsims/index.md) - Teaches the p5.js sketch structure, drawing, animation, physics and controls that power the most flexible MicroSim type, including showcase-quality animation.
7. [Charts, Plots and Tables](07-charts-plots-and-tables/index.md) - Covers Chart.js, Plotly and HTML tables for showing quantitative data, comparisons and mathematical functions in interactive form.
8. [Diagrams, Networks and Systems](08-diagrams-networks-and-systems/index.md) - Covers Mermaid diagrams, vis-network graphs, Venn diagrams and causal-loop diagrams for showing processes, relationships and feedback systems.
9. [Timelines and Maps](09-timelines-and-maps/index.md) - Covers vis-timeline and Leaflet for presenting events over time and data over geography.
10. [Image Overlays and Comparison Posters](10-image-overlays-and-comparison-posters/index.md) - Explains how to turn an AI-generated image into an interactive MicroSim with callout labels, hover zones, and grid-overlay comparison posters with Explore and Quiz modes.
11. [Verified Posters and Specialized MicroSim Types](11-verified-posters-and-specialized-microsim-types/index.md) - Covers fact-verified posters, in which every numeric claim is checked against a cited source, and the specialized types of runnable labs, sorting quizzes, flash cards and builders.
12. [Width-Responsive Design and Iframe Heights](12-width-responsive-design-and-iframe-heights/index.md) - Explains how MicroSims adapt to any container width and how iframe heights are set, synchronized and tested so nothing is clipped or hidden.
13. [Quality Assurance and Automated Layout Review](13-quality-assurance-and-automated-layout-review/index.md) - Covers the quality score, Playwright tests, screenshots and vision-based layout review that catch layout and quality defects before readers do.
14. [Batch Generation from Specifications](14-batch-generation-from-specifications/index.md) - Shows how to generate many MicroSims from chapter specifications with status tracking, resumable pipelines and parallel workers.
15. [Metadata, Search and Reuse](15-metadata-search-and-reuse/index.md) - Covers the metadata that describes each MicroSim, the search index built from it, and the reuse-before-build practice that keeps a library of MicroSims from duplicating itself.
16. [xAPI Statements and Evidence](16-xapi-statements-and-evidence/index.md) - Introduces xAPI statements, the three MicroSim verbs, the producer contract, and the evidence classes that separate meaningful interaction from noise.
17. [Instrumenting MicroSims with the xAPI Runtime](17-instrumenting-microsims-with-the-xapi-runtime/index.md) - Shows how to add xAPI reporting to a MicroSim using the shared runtime, its handles and library adapters, and how to map interactions to concepts.
18. [Mastery Prediction and Knowledge Tracing](18-mastery-prediction-and-knowledge-tracing/index.md) - Explains how an evidence stream becomes a prediction of concept mastery, using Bayesian knowledge tracing and its guess, slip and learning parameters.
19. [Evaluating the Predictive Fidelity of the xAPI Stream](19-evaluating-the-predictive-fidelity-of-the-xapi-stream/index.md) - Teaches how to measure how well the xAPI stream predicts mastery, using held-out assessments, calibration, discrimination and honest reporting of limits.
20. [The Full LRS: Architecture and Ingestion](20-the-full-lrs-architecture-and-ingestion/index.md) - Describes the full Learning Record Store built for scale: multi-tenancy, pseudonymous identity, the graph data model and the ingestion pipeline.
21. [The Full LRS: Dashboards, Operations and Compliance](21-the-full-lrs-dashboards-operations-and-compliance/index.md) - Covers what the full LRS delivers and costs: teacher, author and admin dashboards, experiments, capacity and cost models, deployment, failure modes and compliance.
22. [LRS-Lite: Compact Summaries and Browser Storage](22-lrs-lite-compact-summaries-and-browser-storage/index.md) - Introduces LRS-Lite, the serverless strategy in which each MicroSim summarizes its own session and each student's data lives in a small browser database.
23. [LRS-Lite: Sync, Dashboards and Choosing Full or Lite](23-lrs-lite-sync-dashboards-and-choosing-full-or-lite/index.md) - Covers multi-device sync and backup for LRS-Lite, browser-side dashboards, and how to choose between the full LRS and LRS-Lite and migrate between them.
24. [Pedagogy, Accessibility and Ethics](24-pedagogy-accessibility-and-ethics/index.md) - Covers the pedagogical, accessibility, equity and ethical foundations for MicroSims that collect learner data, including Universal Design for Learning, privacy and bias in prediction.
25. [Capstone: Building an Instrumented MicroSim Portfolio](25-capstone-building-an-instrumented-microsim-portfolio/index.md) - Guides students through building an instrumented MicroSim portfolio and reporting how well its event stream predicts mastery of its target concepts.
26. [The Future of MicroSims](26-the-future-of-microsims/index.md) - Looks ahead: near-term work over the next year, and the long-term prospect of AI generating MicroSims that are fun to use and better able to predict whether a student has mastered a concept.

## How to Use This Textbook

The chapters follow the life of a MicroSim: understand it (1-3), choose and generate it (4-5), build it by type (6-11), make it responsive and check its quality (12-13), produce it at scale and describe it (14-15), instrument it and predict mastery from its events (16-19), store and analyze the events with a full LRS or LRS-Lite (20-23), and finish with pedagogy, a capstone and the future (24-26). Dependencies are respected: every concept is introduced in a chapter at or after the chapters that introduce its prerequisites.

---

**Note:** Each chapter includes a list of concepts covered. Complete the prerequisite chapters before moving to advanced ones.
