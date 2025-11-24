---
title: NeoPixel Simulation
description: This MicroSim teaches us how the NeoPixel works to convert a stream of rgb values into color setting for each pixel.
quality_score: 37
social:
   cards: false
---
# NeoPixel Simulation

<figure markdown>
   ![Image Name](./image.png){ width="400" }
   <figcaption>Figure caption.</figcaption>
</figure>

[Link to NeoPixel Demo](./neopixel.html){ .md-button .md-button--primary }

## About this MicroSim

This MicroSim teaches us how the NeoPixel works to convert a stream of rgb values
into color setting for each pixel.


```linenums="0"
Please create a single file p5.js sketch for downloading. 
Use a canvas variables of canvasWidth=600 and canvasHeight=200 as global variables.
The sketch is a simulation of how a NeoPixel works moving red, green and blue values through a data signal.
The sketch has a set of four rectangles moving from left to right.
The rectangles are 60 pixels wide and 20 pixels high.
Each rectangle has three circles within it.  One is red, one is blue and one is green. The circles have a radius of 10.
The values of the red, green and blue colors are randomly created from a range of 0 to 255.
As the rectangles reach a neopixel the first rectangle is pulled off and the rest continue on the data line.
A circle of radius 50 is used to represent the NeoPixel being shown in the center.  It will get the values of each rectangle as they pass above it.
Add buttons at the bottom of the canvas for start, step and stop and reset the simulation.
```