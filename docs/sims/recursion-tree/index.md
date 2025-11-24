---
title: Recursion Tree
description: An interactive MicroSim demonstrating recursion tree.
quality_score: 67
image: /sims/recursion-tree/tree-v1.png
og:image: /sims/recursion-tree/tree-v1.png
twitter:image: /sims/recursion-tree/tree-v1.png
social:
   cards: false
---
# Recursion Tree

<iframe src="main.html" height="470px" scrolling="no"></iframe>

Recursion trees are ideal ways to demonstrate recursive programming.
In a recursive program, a function calls itself repeatedly.
The result is often a beautiful complex image generated from
a very small program.

[Run Recursion Tree MicroSim](./main.html){ .md-button .md-button--primary }
[Edit the MicroSim](https://editor.p5js.org/dmccreary/sketches/6p_xSPRi7)

## Prompt

!!! prompt
  Generate a single file p5.js sketch on a 400x400 canvas.
  Generate a drawing of a tree that uses recursion.
  Add a slider that changes the angle between the branches of the tree.

## Response

Creating a p5.js sketch that draws a recursive tree with a slider to adjust the angle between branches involves a few key steps. Here's a basic outline of the code:

1. Setup the Canvas: Initialize a 400x400 canvas using createCanvas(400, 400) in the setup() function.
2. Create a Slider: Create a slider for the branch angle using createSlider() and position it on the canvas.
3. Draw the Tree: Use a recursive function to draw the tree in the draw() function. The angle between branches will be controlled by the slider's value.
4. Recursive Function: The recursive function will draw a line for the branch and then call itself twice to draw the two smaller branches at the specified angle.


```js
let angleSlider;

function setup() {
  const canvas = createCanvas(400, 400);
  canvas.parent('canvas-container');
  angleSlider = createSlider(0, TWO_PI, PI / 4, 0.01);
  angleSlider.position(10, height + 10);
}

function draw() {
  background('aliceblue');
  stroke(0);
  translate(width / 2, height);
  drawBranch(100);
}

function drawBranch(len) {
  // draw branch from center up to len
  line(0, 0, 0, -len);
  // move up to end
  translate(0, -len);

  // if we have a long len
  if (len > 4) {
    push();
      // rotate coordinate system clockwise
      rotate(angleSlider.value());
      drawBranch(len * 0.67);
    pop();

    push();
      // rotate coordinate system counter clockwise
      rotate(-angleSlider.value());
      drawBranch(len * 0.67);
    pop();
  }
}
```

In this code:

angleSlider is a global variable to hold the slider.
In setup(), the canvas is created, and the slider is initialized.
draw() continuously updates the canvas, translating the origin to the bottom center and then drawing the tree.
drawBranch(len) is the recursive function. It draws a line, then moves to the end of that line. If the branch is long enough, it draws two smaller branches at angles determined by the slider.
This code provides a basic recursive tree. You can enhance it with more features like changing the color, stroke weight, or the number of branches.

## References

* [Google Gemini Demo](https://www.youtube.com/watch?v=NHLnjWTEZps)
* [p5.js Examples](https://editor.p5js.org/p5/sketches/Simulate:_Recursive_Tree)