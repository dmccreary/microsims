# Micro Simulations for Education

A MicroSim or Micro-Simulation is a simple animation or simulation program that is quickly generated to help teachers explain concepts to students.  They are
designed to be generated from a brief description of a problem using generative
AI tools such as ChatGPT.

The term **MicroSim** was coined by [Val Lockhart](https://www.linkedin.com/in/valockhart/) in the summer of 2023 while she was working with generative AI.  She found that both teachers and students could generate useful simulations using [p5.js](https://p5js.org/) with little or no training.

## Background on the Processing Language

p5.js is a modern version of the [Processing](https://processing.org/) language.

Processing is a flexible software system and a language for learning how to code within the context of animation. It was developed by Casey Reas and Ben Fry, who were then graduate students at the MIT Media Lab. The project began in 2001 and was officially launched in 2003.  Because of its widespread adoption by the open-source community, it is now supported by the [Processing Foundation](https://processingfoundation.org/).

The key ideas behind Processing include:

1. **Accessibility for Beginners:** Processing was designed to serve as the first programming language for artists and designers. It simplifies many aspects of programming and graphics, making it more accessible and less intimidating for beginners.

2. **Focus on Visual Output:** The language is geared towards creating visual output, which is appealing to artists and designers. This visual focus makes programming more engaging and understandable for those who are more visually oriented.

3. **Educational Tool:** Processing is widely used as a teaching tool in universities and schools. Its simplicity and immediate visual feedback make it an excellent resource for teaching the fundamentals of programming and digital art.  Immediate visual feedback is a key feature in helping students to learn to code.

4. **Open Source and Community Driven:** Processing is open-source, meaning that it's free to use and modify. This has led to a large, active community of users who contribute to its development and share their work, further enriching the tool's capabilities and resources.

5. **Extensibility and Libraries** Processing is not just a language but also an integrated development environment (IDE). It supports extensibility through libraries, allowing users to expand its capabilities. These libraries can be used for a wide range of applications, from computer vision to 3D graphics, contributing to its versatility in creating simulations.

6. **Ease of Creating Simulations:** Processing simplifies the process of programming graphical simulations. Its straightforward syntax and rich set of drawing functions allow users to quickly prototype and visualize complex systems. This ease of use in creating interactive graphics and simulations is one of its most appealing aspects for artists, designers, and educators.

Overall, Processing stands out for its focus on the arts and design, its ease of use, and its strong community support, all of which contribute to its popularity for creating simulations and visual arts projects.

## The MicroSim Registry

One of our goals on this site is to create a library of MicroSims that can be used to fine-tune a generative AI application.  We have found that new [GPTs](https://openai.com/blog/introducing-gpts) will create higher-quality simulations if they are trained with a high-quality training set.  This reflects the fact that although there are tens of thousands of sample p5.js animations, many of them are created by first-time programmers.

* [Bouncing Ball](./sims/bouncing-ball/)
* [String Harmonics](./sims/string-harmonics.md)