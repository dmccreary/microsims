# A* Graph Search Algorithm

<iframe src="main.html" width="100%" height="520px" scrolling="no" style="border: 1px solid silver;"></iframe>

[Run the A* Algorithm in Full Screen](main.html){ .md-button .md-button--primary }

## About This MicroSim

The **A\* (A-star) algorithm** is one of the most widely used pathfinding algorithms in computer science. It finds the shortest path between two points by intelligently exploring the most promising routes first.

### How to Use

1. **Start** - Initialize the algorithm and take the first step
2. **Step** - Manually advance the algorithm one step at a time
3. **Run/Pause** - Automatically run the algorithm (~1 step per second)
4. **Reset** - Clear the search and start over with the same graph
5. **New Graph** - Generate a new random graph

### Color Legend

| Color | Meaning |
|-------|---------|
| **Green (S)** | Start node |
| **Red (G)** | Goal node |
| **Blue** | Open set - nodes waiting to be explored |
| **Gray** | Closed set - nodes already visited |
| **Yellow** | Current node being evaluated |
| **Bright Green** | Final path from start to goal |

## How A* Works

A* combines the best features of **Dijkstra's algorithm** (guaranteed shortest path) and **Greedy Best-First Search** (fast exploration toward the goal).

### The Key Formula

For each node, A* calculates:

$$f(n) = g(n) + h(n)$$

Where:

- **f(n)** = Total estimated cost of path through node n
- **g(n)** = Actual cost from start to node n
- **h(n)** = Heuristic estimate from node n to goal

### Algorithm Steps

1. Add the start node to the **open set**
2. Pick the node with the lowest **f-score** from the open set
3. If it's the goal, reconstruct and return the path
4. Move the current node to the **closed set**
5. For each neighbor of the current node:
    - Skip if already in closed set
    - Calculate tentative g-score
    - If neighbor not in open set, add it
    - If this path is better, update the path
6. Repeat until goal is found or open set is empty

### Why A* is Optimal

The heuristic function h(n) must be **admissible** (never overestimates the true cost). This simulation uses **Euclidean distance** as the heuristic, which is admissible for geometric graphs because straight-line distance is always ≤ actual path distance.

## Lesson Plan

### Grade Level
9-12 (High School) or introductory college computer science

### Duration
45-60 minutes

### Learning Objectives

By the end of this lesson, students will be able to:

1. Explain the difference between uninformed and informed search algorithms
2. Describe how A* uses heuristics to guide its search
3. Identify the components of the A* cost function (g, h, and f)
4. Trace through A* execution on a simple graph
5. Recognize real-world applications of pathfinding algorithms

### Prerequisites

- Basic understanding of graphs (nodes and edges)
- Familiarity with the concept of algorithms
- Optional: exposure to Dijkstra's algorithm

### Materials Needed

- This MicroSim
- Whiteboard or projector
- Optional: graph paper for manual exercises

### Lesson Outline

#### Introduction (10 minutes)

1. **Hook**: Ask students how GPS navigation finds the fastest route
2. **Discussion**: What makes finding a path "hard"? (many possible routes, need to find the best one)
3. **Introduce vocabulary**: graph, node, edge, path, heuristic

#### Exploration (15 minutes)

1. **Demo the MicroSim**: Show A* finding a path using "Run"
2. **Step-by-step walkthrough**: Use "Step" button to show:
    - How the open set (blue) expands from start
    - How the algorithm chooses which node to explore next
    - How visited nodes (gray) are never re-explored
    - How the final path (green) is reconstructed

3. **Generate multiple graphs**: Show how A* adapts to different configurations

#### Concept Development (15 minutes)

1. **Compare to simpler approaches**:
    - **Breadth-First Search**: Explores equally in all directions (inefficient)
    - **Greedy Best-First**: Always moves toward goal (can miss shorter paths)
    - **A***: Balances actual distance traveled with estimated remaining distance

2. **The f = g + h formula**:
    - Draw a simple example on the board
    - Calculate f-scores for 2-3 candidate nodes
    - Show why the lowest f-score node is chosen

3. **Admissibility**: Why the heuristic must not overestimate

#### Practice (10 minutes)

1. **Predict and verify**: Before clicking "Step", have students predict which node will be explored next
2. **Manual trace**: Give students a small graph (5-6 nodes) to trace A* by hand
3. **Discussion**: When might A* explore many nodes? When might it find the path quickly?

#### Wrap-up (5 minutes)

1. **Real-world applications**:
    - GPS and mapping (Google Maps, Waze)
    - Video game AI (enemy pathfinding)
    - Robotics (robot navigation)
    - Network routing

2. **Extensions to explore**:
    - What happens with obstacles/walls?
    - Different heuristics (Manhattan distance for grids)
    - Weighted edges (roads with different speeds)

### Assessment Ideas

**Formative**:

- Observation during MicroSim exploration
- Predictions about next node to explore

**Summative**:

- Trace A* on a given graph (show open set, closed set, f-scores)
- Short answer: Explain why A* is faster than exploring every possible path
- Compare/contrast: How does A* differ from Dijkstra's algorithm?

### Differentiation

**For struggling students**:

- Focus on the visual intuition (blue expands toward red)
- Use smaller graphs (fewer nodes)
- Emphasize the "explorer looking for treasure" metaphor

**For advanced students**:

- Implement A* in code
- Explore different heuristics and their effects
- Investigate A* variants (D*, Jump Point Search)

### Standards Alignment

**CSTA K-12 Computer Science Standards**:

- 3A-AP-13: Create prototypes that use algorithms to solve computational problems
- 3B-AP-11: Evaluate algorithms in terms of their efficiency, correctness, and clarity

**Common Core Math**:

- HSF.IF.B.4: Interpret key features of graphs
- HSG.MG.A.3: Apply geometric methods to solve design problems

## References

- Hart, P. E., Nilsson, N. J., & Raphael, B. (1968). A Formal Basis for the Heuristic Determination of Minimum Cost Paths. *IEEE Transactions on Systems Science and Cybernetics*, 4(2), 100-107.
- Russell, S., & Norvig, P. (2020). *Artificial Intelligence: A Modern Approach* (4th ed.). Pearson. Chapter 3: Solving Problems by Searching.
- [Red Blob Games: Introduction to A*](https://www.redblobgames.com/pathfinding/a-star/introduction.html) - Excellent interactive tutorial

## Source Code

- [a-star.js](a-star.js)
