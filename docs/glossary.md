# Glossary of High-Level Concepts in Generating MicroSims

This glossary focuses on high-level concepts related to creating high-quality simulations and user interfaces using the p5.js framework.

## Terms and Definitions

#### Accessibility**

Making simulations and UIs usable by people with a wide range of abilities.

#### Animation**

Creating motion and shape change, often through frame-by-frame updates.
Animations with speed controls are a core element to good user experience design.

#### Canvas

The area where all the drawing in p5.js takes place.  Setting up
the correct canvas dimensions with a clear area for drawing
and an area for simulation controls is foundational for simulations and good user experience design.

#### Link Preview

The image, title and description of a web page when the link is posted to a social media or video chat.
We use mkdocs material for this site so we use the configuration provided by the material plugin.

* [Material Social Cards Plugin Docs](https://squidfunk.github.io/mkdocs-material/setup/setting-up-social-cards/)
* [YouTube Tutorial](https://www.youtube.com/watch?v=4OjnOc6ftJ8)


#### Event Handling

Responding to user actions like mouse clicks, key presses, or touch events for interactivity.

#### Vector Graphics

Scalable graphics for rendering shapes, essential for simulations and UI elements.

#### Interactivity**

Involves user input and system feedback, from simple clicks to complex gestures.

#### User Experience (UX) Design**

Designing interfaces and simulations that are easy, intuitive, and enjoyable to use.

#### Rendering

How graphics are drawn on the canvas, including 2D and WEBGL (3D) in p5.js.
Many of the lastest features of p5.js focus on allowing simulations to
create complex simulations with fast rendering speed using the WebGL
3D libraries.

#### Responsive Design**

Techniques ensuring simulations and UIs work well on various devices and screen sizes.

#### Smart Board

An interactive whiteboard, also known as an interactive board or smart board,
is a large interactive display board in the form factor of a whiteboard.
In many classrooms, an instructor can stand at the front of a classroom
and move sliders below a simulation to control the simulation.

For effective use of smart boards, we use a minimum text size of 16 for control labels and values.

#### Simulation Fidelity

The degree to which a simulation replicates real-world processes or systems.

#### Slider

A user interface control that allows a simulation parameter to vary from a minimum to a maximum value.
Sliders have a default value and a value for incrementing the range.

A slider is also called a "Range Control Slider", but in our examples we will just use the shorthand "slider".

#### Social Page Metadata

Data 

```
---
title:
description:
image:
---
```

#### Performance Optimization

Techniques to make simulations and interfaces run smoothly, including code optimization.

#### Prototyping

Creating a preliminary model of a simulation or UI for exploring ideas and testing UX.

#### State Management

Tracking and updating the status of different elements and interactions in the system.
Many simulations use a mode variable to controls the state of a simulation.
Examples of states include Running, Stopped and Step instructions.

#### User Testing

Evaluating a simulation or interface by testing it with real users for feedback.

#### Interaction Design

Designing interactive digital products with logical and thought-out behaviors.

### URLlib

The Python library we use to generate social cards.

We use urllib3=1.26.6

#### WebGL
We Graphics Language (WebGL) is the name of the standard list of commands for drawing within web browsers.

This glossary aims to provide a foundational understanding for effectively using the p5.js framework in creating high-quality simulations and user interfaces.
