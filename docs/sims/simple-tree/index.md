---
title: Simple Tree
description: This MicroSim teaches us how to use recursion to draw a tree. We draw a branch, and at the end of each branch, we draw two more branches that are at different angles and are a bit shorter and narro...
quality_score: 67
social:
   cards: false
---
# Simple Tree

<iframe src="main.html" height="450px" scrolling="no"></iframe>

<!--
![Image Name](./image.png){ width="400" }
-->

[Run the Simple Tree MicroSim](./main.html){.md-button .md-button--primary}
[Edit this MicroSim](https://editor.p5js.org/dmccreary/sketches/iNg7Y7pp8)

## Sample iframe

```html
<iframe src="https://dmccreary.github.io/microsims/sims/name/main.html" height="400"  scrolling="no"></iframe>
```

## About this MicroSim

This MicroSim teaches us how to use recursion to draw a tree.
We draw a branch, and at the end of each branch, we draw two more branches
that are at different angles and are a bit shorter and narrower.

!!! prompt
    For the program simple-tree.js in this project, please write a lesson plan for high-school students.  Focus on teaching the concept of recursion using metaphors of trees and nature.  Discussion the structure of recursive algorithms and how the algorithms call themselves but must know when to stop.  The lesson should
    last about 50 minutes.

## Response

## Recursion through Nature: A Lesson Plan for High School Students

### Lesson Overview

**Title:** Understanding Recursion through Tree Growth<br/>
**Grade Level:** High School (Grades 9-12)<br/>
**Duration:** 50-minute lesson<br/>
**Materials:** Computers with p5.js environment and simple-tree.js file loaded

### Learning Objectives
By the end of this lesson, students will be able to:
1. Explain the concept of recursion using tree growth as a metaphor
2. Identify the base case and recursive case in a recursive algorithm
3. Trace through the execution of a simple recursive function
4. Modify parameters in the simple-tree.js program to create different tree structures

### Introduction
5 minutes

Begin by showing students a variety of tree images and the simple-tree.js simulation. Ask:

- What patterns do you notice in how trees branch out?
- How might we describe the structure of a tree mathematically?

Introduce the concept: "Today we'll explore recursion - a powerful programming concept where a function calls itself. In nature, trees are perfect examples of recursive structures."

### Key Concepts 
10 minutes

#### Recursion Explained

- **Definition:** A process where a function calls itself to solve smaller instances of the same problem
- **Real-world examples:** Trees, nested dolls, mirrors facing each other, fractal patterns in nature

#### Two Essential Components
1. **Base Case:** The condition that stops the recursion (when to stop)
2. **Recursive Case:** The function calling itself with modified parameters (how to continue)

### Tree Metaphor

Connect the abstract concept to the concrete visual:

- Each branch of a tree can be seen as a smaller tree
- The trunk divides into branches, which divide into smaller branches, and so on
- The recursive pattern ends at the tips with leaves (base case).  In our example we draw a leaf at the tip of each branch.

### Code Exploration
15 minutes

Examine the ```branch(len, depth)``` function of the simple-tree.js code:

```javascript
function branch(len, depth) {
  if (depth == 0) {
    // Draw a leaf at the tip
    fill(34, 139, 34);
    noStroke();
    ellipse(0, 0, 10, 15);
    return;
  }
  
  // make the branches get thinner as we get deeper
  strokeWeight(map(depth, 0, 10, 1, 20));
  stroke(139, 69, 19); // Brown color for branches

  // the branch
  line(0, 0, 0, -len);
  // move to the end of the branch
  translate(0, -len);

  push();
    // rotate clockwise
    rotate(PI / 6);
    branch(len * branchShrink, depth - 1);
  pop();

  push();
    // rotate counter clockwise
    rotate(-PI / 6);
    branch(len * branchShrink, depth - 1);
  pop();
}
```

Notice the following:

- **Base case:** `if (depth == 0)` - when we've reached the maximum depth, draw a leaf and stop.  Note that we start with depth high and count down in this version.
- **Recursive cases:** Two calls to `branch()` that draw branching limbs with reduced size
- **Shrink Branch Length:** - we calling the next branch with the current branch length multiplied by ```branchShrink``` which is ```0.7```.  This means that each branch is only 70% as long as the previous branch.
- **Branch Context:** Notice the ```push()``` and ```pop()``` function that keep the drawing context isolated in each branch.
- **Branch Rotation:** Notice that we are rotating by ```PI / 6```.  There are 180 degrees in PI so that is 180/6 or 30 degrees.
- **Control Parameters:** `depth` determines how many times to branch, while `len` and `branchShrink` control size of the next branch.

### Interactive Exploration
10 minutes

1. Adjust the depth slider in the simulation to see how it affects the tree
2. Predict what would happen without a base case (infinite recursion)
3. Consider what would happen with different branch angles or shrink rates

### Conclusion and Connection

- **Summarize:** Recursion is a powerful pattern that breaks complex problems into simpler versions of the same problem
- **Connect to other concepts:** Fractals, divide-and-conquer algorithms, nested data structures
- **Natural wisdom:** Trees evolved this recursive structure because it's efficient for gathering sunlight and withstanding environmental forces

### Extension Activity

Modify the code to create your own creative recursive patterns by:

- Changing the branching angle
- Modifying the base case to draw different leaf shapes or colors
- Adding randomness to create more natural-looking trees
- Creating seasonal variations (autumn colors, snow-covered branches)

### Assessment

Ask students to:

1. Trace the execution of the `branch()` function with a depth of 2
2. Identify another natural structure that exhibits recursive patterns
3. Explain what would happen if we removed the base case from the algorithm

This lesson leverages visual learning and natural metaphors to make the abstract concept of recursion concrete and engaging for high school students.