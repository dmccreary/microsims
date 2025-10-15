# Glossary of High-Level Concepts in Generating MicroSims

This glossary focuses on high-level concepts related to creating high-quality simulations and user interfaces using the p5.js framework.

## Terms and Definitions

#### Accessibility

Making simulations and UIs usable by people with a wide range of abilities.

#### Adaptive Learning

An educational method that uses computer algorithms to orchestrate the interaction with the learner and deliver customized resources and activities based on individual learning needs.

#### Algorithm

A step-by-step procedure or set of rules for solving a problem or completing a task. In programming, algorithms define how a computer should process information to achieve a desired outcome.

#### API

Application Programming Interface - a set of rules and protocols that allows different software applications to communicate with each other. APIs define how different parts of software can work together.

#### Animation

Creating motion and shape change, often through frame-by-frame updates.
Animations with speed controls are a core element to good user experience design.

#### Browser

A software application (like Chrome, Firefox, or Safari) that displays web pages and runs web applications. Modern browsers can run interactive simulations without requiring additional software.

#### Canvas

The area where all the drawing in p5.js takes place.  Setting up
the correct canvas dimensions with a clear area for drawing
and an area for simulation controls is foundational for simulations and good user experience design.

#### Clone

To create a local copy of a repository from a remote source like GitHub onto your computer. This allows you to work with the project files on your own machine.

#### Commit

To save a snapshot of changes made to files in a git repository, along with a message describing what was changed. Think of it as saving a version of your work with notes about what you did.

#### Controls Area

The designated region of a MicroSim interface where interactive elements like buttons and sliders are placed, typically at the bottom of the simulation.

#### CSS

Cascading Style Sheets - a language used to describe how HTML elements should look and be positioned on a web page. CSS controls colors, fonts, layouts, and visual styling.

#### Database

An organized collection of structured information or data, typically stored electronically and accessed through database management systems.

#### Deploy/Deployment

The process of making a software application available for use, typically by uploading it to a web server where others can access it online.

#### Directory

A folder or container used to organize files and other directories in a computer's file system. Also called a folder.

#### DOM

Document Object Model - a programming interface that represents the structure of a web page as a tree of objects that can be manipulated by JavaScript.

#### Drawing Area

The region of a MicroSim where the visual simulation or animation is displayed, separate from the controls area.

#### Dublin Core

A set of vocabulary terms used to describe digital resources for purposes of discovery and cataloging. Used in educational metadata to help organize and find learning materials.

#### Link Preview

The image, title and description of a web page when the link is posted to a social media or video chat.
We use mkdocs material for this site so we use the configuration provided by the material plugin.

* [Material Social Cards Plugin Docs](https://squidfunk.github.io/mkdocs-material/setup/setting-up-social-cards/)
* [YouTube Tutorial](https://www.youtube.com/watch?v=4OjnOc6ftJ8)


#### Event Handling

Responding to user actions like mouse clicks, key presses, or touch events for interactivity.

#### Extension

The suffix at the end of a filename (like .html, .js, .md) that indicates the file type or format.

#### File Path

The location of a file or folder in a computer's directory structure, showing the route through folders to reach the file.

#### Framework

A pre-written set of code that provides a foundation for building applications. Frameworks give developers a starting structure and common tools to work with.

#### Git

A version control system that tracks changes in files and helps coordinate work among multiple people on a project. Essential for collaborative software development.

#### GitHub

A web-based platform that hosts git repositories and provides collaboration tools for software development projects. Think of it as a social network for code.

#### HTML

HyperText Markup Language - the standard language for creating web pages. HTML defines the structure and content of web pages using elements called tags.

#### IDE

Integrated Development Environment - a software application that provides comprehensive facilities for software development, including a code editor, debugger, and build tools.

#### iframe

An HTML element that allows one web page to be embedded inside another web page, like a window within a window.

#### JavaScript

The programming language used to create interactive web pages and animations. JavaScript runs in web browsers and is what makes MicroSims interactive.

#### JSON

JavaScript Object Notation - a lightweight format for storing and transmitting data. JSON uses human-readable text to represent data objects consisting of key-value pairs.

#### Learning Analytics

The measurement, collection, analysis, and reporting of data about learners and their contexts for understanding and optimizing learning.

#### Library

A collection of pre-written code functions that developers can use in their programs. Libraries save time by providing ready-made solutions for common programming tasks.

#### LMS

Learning Management System - a software application or web-based technology used to plan, implement, and assess learning processes.

#### Local Storage

A web browser feature that allows websites to store data on a user's computer for later use.

#### Markdown

A lightweight markup language that uses simple text formatting to create formatted documents, widely used for documentation.

#### Metadata

Data that provides information about other data, such as the title, author, creation date, and description of a document or file.

#### MkDocs

A static site generator that builds websites from markdown files, commonly used for creating documentation websites.

#### Open Graph

A protocol that enables web pages to become rich social media objects, controlling how content appears when shared on social platforms.

#### p5.js

A JavaScript library designed to make programming visual art and animations accessible to beginners. It's based on the Processing language and is the primary tool used for creating MicroSims.

#### Pull Request

A method of submitting contributions to a project by requesting that changes from one branch be merged into another branch. Used for collaborative development.

#### Repository

A storage location for a software project, containing all the project files, documentation, and version history. Often hosted on platforms like GitHub.

#### SCORM

Sharable Content Object Reference Model - a set of technical standards for e-learning software products that ensures content can work across different learning management systems.

#### Server

A computer or software that provides services, data, or resources to other computers (clients) over a network.

#### Social Cards

Preview images and text that appear when links are shared on social media platforms.

#### Template

A pre-designed file or set of files that serves as a starting point for creating new content with a consistent structure.

#### Touch Events

User interactions on touch-screen devices like tablets and smartphones that software can detect and respond to.

#### UI/UX

User Interface/User Experience - referring to the design of user interfaces for software with a focus on maximizing usability and user experience.

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

#### Responsive Design

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

#### Smartboard



#### State Management

Tracking and updating the status of different elements and interactions in the system.
Many simulations use a mode variable to controls the state of a simulation.
Examples of states include Running, Stopped and Step instructions.

#### User Testing

Evaluating a simulation or interface by testing it with real users for feedback.

#### Interaction Design

Designing interactive digital products with logical and thought-out behaviors.

#### URLlib

The Python library we use to generate social cards.

We use urllib3=1.26.6

#### WebGL

Web Graphics Library (WebGL) is the name of the standard list of commands for drawing within web browsers.

#### xAPI

Experience API (also called Tin Can API) - a standard for tracking and recording learning experiences and activities in digital learning environments.

#### YAML

A human-readable data format often used for configuration files. YAML uses indentation and simple syntax to represent structured data, making it easier to read than JSON.

This glossary aims to provide a foundational understanding for effectively using the p5.js framework in creating high-quality simulations and user interfaces.
