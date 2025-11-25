# Micro Simulations for Education

![MicroSim Banner](./img/cover.png)

Welcome to the MicroSims for Education website.

A MicroSim (or Micro-Simulation) is a simple animation or simulation program that is quickly generated using generative AI to help teachers explain concepts to students.  MicroSims are
designed to be generated from a brief description of a problem using generative
AI tools such as ChatGPT.

The term **MicroSim** was coined by [Val Lockhart](https://www.linkedin.com/in/valockhart/) in the summer of 2023 while she was working with generative AI.  She found that both teachers and students could generate useful [p5.js](./glossary.md#p5js) simulations using GPT-4 with little or no training.

## System Prompt Limitations

Although you can create a [System Prompt](./setup/02-system-prompt.md) that puts many best practices in the context window of ChatGPT, it is not an ideal solution.
A better process is building a customized GPT on
curated examples that have a high-quality interface with good user experience design reviews.  This is one of the objectives
of this website.

## The MicroSim Registry

One of our goals on this site is to create a library of MicroSims that can be used to fine-tune a generative AI application.  We have found that new [GPTs](https://openai.com/blog/introducing-gpts) will create higher-quality simulations if they are trained with a high-quality training set.  This reflects the fact that although there are tens of thousands of sample [JavaScript](./glossary.md#javascript) animations, many of them are created by first-time programmers.

Although it is easy for a non-programmer to use generative AI to create a new MicroSim, it is more difficult to find high-quality MicroSims that have been peer-reviewed by senior software developers and user experience designers.  These MicroSims have some of the following qualities:

1. Clearly labeled controls with values.  We discourage the use of mouse actions that are unlabeled.
2. Controls that are placed at the bottom of the simulation.  This encourages [smartboard](./glossary.md#smartboard) use in classrooms.
3. Controls aligned for visual aesthetics
4. A machine-readable ([YAML](./glossary.md#yaml)) description of the MicroSim including subject, topic and [UI](./glossary.md#uiux) controls.

## How to Use This Site

We provide both a search and navigation system to reach the MicroSims.

Here are some samples to get you started:

* [Bouncing Ball](./sims/bouncing-ball/index.md) - our classic "Hello World" demo to get started
* [String Harmonics](./sims/string-harmonics/index.md) - one version includes the use of sound.
* [3D Sphere](./sims/sphere/index.md) - demonstrates the use of the 3D libraries