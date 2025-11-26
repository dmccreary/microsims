# Micro Simulations for Education

![MicroSim Banner](./img/cover.png)

Welcome to the MicroSims for Education website.

!!! Announcement
    Our paper on MicroSims is now available on the ArXiv server:
    [MicroSims: A Framework for AI-Generated, Scalable Educational Simulations with Universal Embedding and Adaptive Learning Support](https://arxiv.org/abs/2511.19864)

A MicroSim (or Micro-Simulation) is a simple interactive simulation program that can be quickly generated using generative AI to help teachers explain concepts to students.  MicroSims can be imbedded in [](./glossary.md#intelligent-textbook)

MicroSims can use a framework of rules and best practices and [20 Design Patterns](./rules/design-patterns.md) to turn a brief descriptive text into a shareable learning asset.  MicroSims are unique for three reasons:

1. **AI-Assisted Generation** - Standardized [design patterns](glossary.md#design-pattern) that enable educators to create custom simulations
  from natural language descriptions
2. **Universal Embedding** - Iframe-based architecture that works seamlessly across any LMS, interactive
  textbook, or digital learning platform.  Any web page can include a MicroSim with just a single HTML `iframe` element
3. **Transparent, Modifiable Code** - No black boxes. Educators can customize simulations to match specific
  curriculum needs.  With a single click you can be editing a MicroSim in a web-based editor.  A [creative commons license](license.md)
  allows most teachers to use MicroSims in your classrooms without paying license fees.

The term **MicroSim** was coined by [Val Lockhart](https://www.linkedin.com/in/valockhart/) in the summer of 2023 while she was working with generative AI.  She found that both teachers and students could generate useful [p5.js](./glossary.md#p5js) simulations using GPT-4 with little or no training.

## The MicroSim Metadata and a MicroSim Registry

One of our goals on this site is to create a library of MicroSims that can be search and a specific can be quickly modified generative AI application.
However, we also know that users cannot reused what they cannot find.  So therefore we have created a detailed [JSON Schema](https://github.com/dmccreary/microsims/blob/main/src/microsim-schema/microsim-schema.json) for describing a MicroSim.  By providing a link to this
schema in your prompt you will find tha generative AI tools create high-quality metadata for each MicroSim.  Creating an official
MicroSim registry with advanced faceted search similar to the Hugging Face model search is on our roadmap.

## How to Use This Site

We provide both a search and navigation system to reach the MicroSims.

Here are some samples to get you started:

* [Bouncing Ball](./sims/bouncing-ball/index.md) - our classic "Hello World" demo to get started
* [String Harmonics](./sims/string-harmonics/index.md) - one version includes the use of sound.
* [3D Sphere](./sims/sphere/index.md) - demonstrates the use of the 3D libraries