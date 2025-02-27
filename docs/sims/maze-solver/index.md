# Maze Solver

<iframe src="main.html" width="400px" height="470px" scrolling="no"></iframe>

<!--
![Image Name](./image.png){ width="400" }
-->

[Run the Maze Solver MicroSim](./template.html){ .md-button .md-button--primary }
[Edit this MicroSim](https://editor.p5js.org/dmccreary/sketches/UvmgsjQuZ)

## Sample iframe

```html
<iframe src="https://dmccreary.github.io/microsims/sims/maze-solver/main.html" 
   width="400px" height="400" scrolling="no"></iframe>
```

### Lesson Plan Prompt for a High-School Classroom

!!! prompt
   Based on the maze-solver-sketch.js file in this project, please generate a lesson plan for a high school student.  Describe how the maze is generated and solved using a depth-first-search algorithm.  Give pointers at using the MicroSim including how to move the speed to 0 to stop the solving process.

## Lesson Plan

**Title:** Maze Solver MicroSim: DFS Maze Generation and BFS Solving

### Introduction

The Maze Solver MicroSim is an interactive tool to help you visualize both maze generation and maze solving algorithms. This simulation creates mazes using Depth-First Search (DFS) and solves them using Breadth-First Search (BFS). By interacting with the simulation, you'll gain a better understanding of these fundamental computer science algorithms.

### How the Maze is Generated: Depth-First Search (DFS)

The maze is created using a technique called "Depth-First Search with backtracking" which works like this:

1.  Start at the top-left cell and mark it as visited
2.  The algorithm then:
    -   Looks for unvisited neighboring cells
    -   Randomly chooses one of these neighbors
    -   Removes the wall between the current cell and the chosen neighbor
    -   Moves to that neighbor and marks it as visited
    -   Adds the previous cell to a "stack" (like a trail of breadcrumbs)
3.  If there are no unvisited neighbors:
    -   The algorithm "backtracks" by popping a cell from the stack
    -   Continues the process from this new position
4.  The algorithm completes when every cell has been visited

This creates a "perfect maze" - one with no loops and exactly one path between any two points.

### How the Maze is Solved: Breadth-First Search (BFS)

Once you press the "Solve" button, the simulation uses Breadth-First Search to find the shortest path from start to end:

1.  The solver starts at the top-left cell (green)
2.  It explores all possible neighboring cells by:
    -   Checking all four directions (up, right, down, left)
    -   Only moving through paths without walls
    -   Marking visited cells in pink
3.  BFS explores cells in "waves" moving outward from the start
4.  When the algorithm reaches the end cell (red), it traces back the path
5.  The final solution path is highlighted in yellow

BFS guarantees finding the shortest possible path through the maze.

### Using the MicroSim


#### Controls

-   **Solve Speed Slider**: Controls how quickly the solving animation runs
    -   Move it to the right for faster solving
    -   Move it all the way to the left (0) to pause the solving process
    -   Move it right again to continue from where you paused
-   **Solve Button** (Green): Begins the solving process
    -   Changes to a "Reset" button (Red) while solving or after solution is found
-   **New Maze Button** (Blue): Generates a completely new random maze

#### Experiment Ideas

1.  Generate several different mazes and observe the patterns
2.  Pause the solving process (speed = 0) midway to analyze the BFS search pattern
3.  Compare how quickly different mazes can be solved
4.  Look for the areas that the algorithm explores but that don't become part of the final path

### Key Computer Science Concepts

1.  **Graph Traversal**: Both DFS and BFS are fundamental ways to explore connected structures (graphs)
2.  **Randomized Algorithms**: The maze generator uses randomness to create unique mazes each time
3.  **Backtracking**: The DFS algorithm uses backtracking to explore all possible paths
4.  **Queue vs. Stack**: The maze generator uses a stack (Last-In-First-Out) while the solver uses a queue (First-In-First-Out)
5.  **Path Finding**: BFS is optimal for finding the shortest path in an unweighted graph

!!! Challenge
   1.  Why does BFS guarantee the shortest path while DFS doesn't?
   2.  What changes would you make to use DFS instead of BFS for solving?
   3.  How might you modify the code to create mazes with multiple possible solutions?
   4.  Can you think of real-world applications that use these same algorithms?

Understanding these maze algorithms provides excellent preparation for studying more advanced topics in computer science, including artificial intelligence, network routing, and game development.