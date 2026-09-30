---
title: Node and Edge Data Explorer
description: Build a small concept map in vis-network by adding nodes, connecting them with labeled relationships and swapping edge directions, while a data panel shows the JSON behind each node and edge.
image: /sims/node-edge-data-explorer/node-edge-data-explorer.png
og:image: /sims/node-edge-data-explorer/node-edge-data-explorer.png
twitter:image: /sims/node-edge-data-explorer/node-edge-data-explorer.png
social:
   cards: false
quality_score: 100
---

# Node and Edge Data Explorer

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Node and Edge Data Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A good network MicroSim is mostly a good data file. This concept map of eight Chapter 8 concepts (Flowchart, Concept Map, Venn Diagram, Mermaid Library, vis-network Library, Network Layout, Node Selection Event and Causal Loop Diagram) is drawn by vis-network from two `vis.DataSet` objects. Each node has an `id`, a `label`, a `group` that sets its color, and fixed `x` and `y` positions measured from the canvas center. Each edge has an `id`, a `from`, a `to` and a relationship `label` such as "is drawn with" or "is a kind of", and its arrow points from `from` to `to`.

When you click a node, a `selectNode` handler highlights its connected edges in orange and shows the node's data as JSON in the panel on the right, along with a readable list of its relationships. Clicking an edge shows the edge's JSON. Every change you make (a new node, a new edge, a swapped direction, a dragged position) appears in the data at once, so you can see exactly how data and drawing correspond.

As the vis-network guide requires for embedded diagrams, mouse-wheel zoom and drag-to-pan are turned off inside the iframe and the navigation buttons replace them. The vis-network stylesheet is loaded so the button icons appear.

**Learning objective (Bloom level: Apply; verb: implement):** The learner will implement a small concept map by editing node and edge data and observing how each change alters the drawn network.

## How to Use

1. Click a node to select it: its connected edges turn orange and its JSON appears on the right. Hover an edge to read its relationship.
2. Type a concept in **New concept** and press **Add node**. The new node appears in purple with no edges.
3. Choose a relationship in the dropdown, press **Connect**, then click the source node (the `from` end) and the target node (the `to` end). The new edge is selected and its JSON shown.
4. With an edge selected, press **Swap direction** to exchange `from` and `to`, and decide whether the sentence still makes sense.
5. Drag a node in the fixed layout to change its stored `x` and `y`.
6. Switch **Layout** to **physics** to let the forces place the nodes, then back to **fixed** to return every node to its stored position. Press **Reset** to restore the original map.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/node-edge-data-explorer/main.html"
        height="502px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development).

### Duration

20 minutes

### Prerequisites

- The vocabulary of graphs: nodes, edges and directed edges.
- The Chapter 8 description of node and edge data (`id`, `label`, `x`, `y`, `from`, `to`).

### Activities

1. **Read the data (5 min):** Click three nodes and three edges. For each edge, write the sentence it encodes, for example "Flowchart is drawn with Mermaid Library", and check it against the JSON `from` and `to`.
2. **Implement an extension (8 min):** Add the nodes "Sequence Diagram" and "Learning Graph Viewer". Connect Sequence Diagram to Mermaid Library with "is drawn with" and Learning Graph Viewer to vis-network Library with "is drawn with". Record the JSON of each new edge.
3. **Direction matters (3 min):** Swap the direction of "Causal Loop Diagram is a kind of Concept Map" and explain why the reversed sentence is false.
4. **Compare layouts (4 min):** Switch between fixed and physics layouts. Describe one advantage of each for a small teaching diagram and for a graph with hundreds of nodes.

### Assessment

- Given a sentence such as "Venn Diagram is an alternative to Flowchart", the learner adds the edge with the correct `from`, `to` and `label`.
- The learner explains why fixed positions give every learner the same picture and when a physics layout is the better choice.

## References

1. [vis-network Documentation](https://visjs.github.io/vis-network/docs/network/) - Official reference for vis-network options, events and methods.
2. [vis-network Nodes Options](https://visjs.github.io/vis-network/docs/network/nodes.html) - Node properties such as `label`, `group`, `x` and `y`.
3. [vis-network Edges Options](https://visjs.github.io/vis-network/docs/network/edges.html) - Edge properties such as `from`, `to`, `label` and `arrows`.
4. [vis-network Physics Options](https://visjs.github.io/vis-network/docs/network/physics.html) - The force-directed layout used in physics mode.
5. [Concept map - Wikipedia](https://en.wikipedia.org/wiki/Concept_map) - Background on concept maps with labeled relationships.
