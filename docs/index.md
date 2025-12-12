---
title: MicroSims for Education
description: An intelligent textbook full of resources that teach you how to create and manage MicroSims for your classrooms.
image: /img/cover.png
og:image: /img/cover.png
hide:
  toc
---
<style>
.md-content__inner h1 {display: none !important;}
</style>

# Micro Simulations for Education

![MicroSim Banner](./img/cover.png){ width="500px" }

Welcome to the MicroSims for Education website.

!!! Announcement
    Our paper on MicroSims is now available on the ArXiv server:
    [MicroSims: A Framework for AI-Generated, Scalable Educational Simulations with Universal Embedding and Adaptive Learning Support](https://arxiv.org/abs/2511.19864)

A MicroSim (or Micro-Simulation) is a simple interactive simulation program that can be quickly generated using AI to help teachers explain concepts to students.  MicroSims can be imbedded in [Intelligent Textbook](./glossary.md#intelligent-textbook) or any website that allows you to add an [`iframe`](./glossary.md#iframe-integration) element.

MicroSims generators use a framework of rules (skills) that turn a brief descriptive text of a simulation into a shareable learning asset.  MicroSims are unique for three reasons:

1. **AI-Assisted Generation** - Standardized [design patterns](glossary.md#design-pattern) that enable educators to create custom simulations
  from natural language descriptions
2. **Universal Embedding** - Iframe-based architecture that works seamlessly across any website, interactive
  textbook, or digital learning platform.  Any web page can include a MicroSim with just a single HTML `iframe` element
3. **Transparent, Modifiable Code** - No black boxes. Educators can customize simulations to match specific
  curriculum needs.  With a single click you can be editing a MicroSim in a web-based editor.  A [creative commons license](license.md)
  allows most teachers to use MicroSims in your classrooms without paying license fees.

The term **MicroSim** was coined by [Valerie Lockhart](https://www.linkedin.com/in/valockhart/) in the summer of 2023 while she was working with generative AI.  She found that both teachers and students could the powerful [p5.js](./glossary.md#p5js) JavaScript library to created simulations with little or no training.
Valerie has been working since early 2023 to introduce generative AI to schools and classrooms.

## The MicroSim Metadata and a MicroSim Registry

One of our goals on this site is to create a library of MicroSims that can be search and a specific can be quickly modified generative AI application.
However, we also know that users cannot reused what they cannot find.  So therefore we have created a detailed [JSON Schema](https://github.com/dmccreary/microsims/blob/main/src/microsim-schema/microsim-schema.json) for describing a MicroSim.  By providing a link to this
schema in your prompt you will find tha generative AI tools create high-quality metadata for each MicroSim.  Creating an official
MicroSim registry with advanced faceted search similar to the Hugging Face model search is on our roadmap.

## How to Use This Site

We provide both a search and navigation system to help you find some MicroSims.

Here are some sample MicroSims from this site and others to get you started:

* [Bouncing Ball](./sims/bouncing-ball/index.md) - our classic "Hello World" demo to get started
* [Projectile Motion](./sims/projectile-motion/) - simulating firing a ball from a canon
* [String Harmonics](./sims/string-harmonics/index.md) - one version includes the use of sound
* [3D Sphere](./sims/sphere/index.md) - demonstrates the use of the 3D rendering libraries in p5.js
* [Expression Explorer](https://dmccreary.github.io/algebra-1/sims/expression-explorer/) - allows user to understand various components of equations
* [Spectrum From Microphone](https://dmccreary.github.io/signal-processing/sims/fft-mic/) - allows a user to talk into their microphone and see the frequency spectrum
* [Stock Market Returns](https://dmccreary.github.io/personal-finance/sims/stock-market-returns/) - shows a vertical bar chart with hover for US stock market returns over the last 30 years
* [Euler's Formula](https://dmccreary.github.io/signal-processing/sims/euler-formula-explorer/) - allows the user to see how Euler's formula connects exponential functions with trigonometric functions
* [Conway's Game of Life](./sims/conway-game-of-life/) - a demonstration of cellular automaton using the famous Conway's Game of Life algorithm
* [Book Build Workflow](https://dmccreary.github.io/claude-skills/sims/book-build-workflow/) - a Mermaid.js diagram of the steps to build an intelligent textbook with MicroSims using Claude Code Skills