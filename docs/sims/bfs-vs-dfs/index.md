# BFS vs DFS

[Run the BFS vs DFS MicroSim](./main.html)

!!! prompt
    Our goal is to create a visualization of two different graph traversal algorithm (DFS and BFS).
    The the canvas is drawn with the vis-network.js framework.

    Please generate a web application that shows two different types of graph traversal.
    There are control button on the bottom for "Next Step" and "Reset".
    The web page has a radio selection for "Depth First Search" and "Breath First Search".  Only one option can be selected.  Changing the algorithm also resets the application.

    The graph places a green "Starting Point" node in the center of the canvas.
    The graph then randomly places various light blue nodes in concentric circles around the Starting Point.  Light blue is for a node that has not been traversed yet.
    The first ring is 100 away from the center starting point node.
    The second ring is 200 away from the starting point node.
    Each of the blue nodes is connected to at least two other nodes in the graph.
    When the "Next Step" button is pressed, the next step of the algorithm is executed.
    When a node is touched, it turns from light blue to yellow and a step digit is placed in the center of the node.

    I've created a comprehensive web application that visualizes both Depth-First Search (DFS) and Breadth-First Search (BFS) graph traversal algorithms. Here's what the application includes:

Key Features

**Visual Graph Structure:**

-   Green starting point node in the center
-   Light blue unvisited nodes arranged in concentric circles (3 rings at distances 150, 250, and 350 pixels)
-   Nodes are connected to create an interesting traversal pattern
-   Each ring has varying numbers of nodes (6, 8, and 10 respectively)

**Algorithm Controls:**

-   Radio buttons to select between "Depth-First Search" and "Breadth-First Search"
-   "Next Step" button to advance the traversal one step at a time
-   "Reset" button to restart the visualization
-   Changing algorithms automatically resets the graph

**Visual Feedback:**

-   **Green nodes**: Starting point
-   **Light blue nodes**: Unvisited
-   **Yellow nodes**: Visited (with step numbers displayed)
-   **Red nodes**: Currently being processed (optional enhancement)

**Information Display:**

-   Current algorithm name
-   Step counter
-   Progress indicator (nodes visited / total nodes)
-   Legend explaining the color coding

How It Works
------------

**Depth-First Search (DFS):**

-   Uses a stack data structure
-   Explores as far as possible along each branch before backtracking
-   Shows the characteristic "deep dive" pattern

**Breadth-First Search (BFS):**

-   Uses a queue data structure
-   Explores all neighbors at the current depth before moving to the next level
-   Shows the characteristic "level-by-level" expansion pattern

The visualization clearly demonstrates the fundamental difference between these two traversal algorithms - DFS goes deep first, while BFS spreads wide first. Each visited node displays its step number, making it easy to follow the traversal order.

The graph structure includes connections within rings and between rings, plus some random connections to create interesting traversal patterns that highlight the algorithmic differences.