# Chapter 11 Quiz: Maps, Networks, and Timeline Visualizations

Test your understanding of specialized visualization libraries for geographic, network, and temporal data.

**Instructions:** Select the best answer for each question. After answering, click "Show Answer" to check your response and read the explanation.

---

#### 1. What is a "force-directed layout" in network visualization?

<div class="upper-alpha" markdown>
1. A layout where the user manually positions each node
2. A physics simulation where nodes repel and edges attract like springs
3. A layout that forces all nodes into a grid
4. A layout that only works with directed graphs
</div>

??? question "Show Answer"
    The correct answer is **B**. Force-directed layout treats the graph as a physical system where nodes repel each other like charged particles and edges attract connected nodes like springs. The system reaches equilibrium when forces balance, producing aesthetically pleasing layouts.

    **Concept Tested:** Forced Directed Layout

    **Bloom's Level:** Understand

---

#### 2. What library is commonly used for creating interactive network graphs in JavaScript?

<div class="upper-alpha" markdown>
1. Chart.js
2. Mermaid.js
3. vis-network
4. Leaflet.js
</div>

??? question "Show Answer"
    The correct answer is **C**. vis-network (part of the vis.js ecosystem) is a JavaScript library that brings GraphViz-style layout algorithms to the browser. It supports multiple layout algorithms, interactive manipulation, node styling, and physics simulation.

    **Concept Tested:** vis-network Library

    **Bloom's Level:** Remember

---

#### 3. What does Leaflet.js specialize in?

<div class="upper-alpha" markdown>
1. Network graph visualization
2. Interactive geographic maps
3. Timeline creation
4. Bar and pie charts
</div>

??? question "Show Answer"
    The correct answer is **B**. Leaflet.js is a lightweight, open-source library for creating interactive geographic maps. It supports markers, polygons, circles, polylines, and popups, and uses OpenStreetMap tiles for free map data.

    **Concept Tested:** Leaflet.js, Geographic Maps

    **Bloom's Level:** Remember

---

#### 4. What are the two main components of a network graph?

<div class="upper-alpha" markdown>
1. Axes and data points
2. Nodes and edges
3. Rows and columns
4. Headers and footers
</div>

??? question "Show Answer"
    The correct answer is **B**. Network graphs consist of nodes (entities or concepts shown as shapes) and edges (relationships between nodes shown as lines connecting them). Labels, weights, and groups provide additional information.

    **Concept Tested:** Network Graphs

    **Bloom's Level:** Remember

---

#### 5. What is the purpose of "graph node coloring" in network visualization?

<div class="upper-alpha" markdown>
1. Making the graph more decorative
2. Encoding additional information such as category, status, or value
3. Reducing file size
4. Improving animation speed
</div>

??? question "Show Answer"
    The correct answer is **B**. Graph node coloring uses color to encode additional information about nodes—such as department (category), active/inactive (status), or risk level (value). This adds a visual dimension to the data without cluttering the graph.

    **Concept Tested:** Graph Node Coloring

    **Bloom's Level:** Understand

---

#### 6. What is a causal loop diagram used to visualize?

<div class="upper-alpha" markdown>
1. Geographic locations
2. Feedback systems with positive and negative relationships
3. Project timelines
4. File directory structures
</div>

??? question "Show Answer"
    The correct answer is **B**. Causal loop diagrams visualize feedback systems, showing how variables influence each other with positive (+) or negative (-) relationships. They identify reinforcing loops (amplifying feedback) and balancing loops (stabilizing feedback).

    **Concept Tested:** Causal Loop Diagrams

    **Bloom's Level:** Understand

---

#### 7. What map tile data does Leaflet.js commonly use for free, license-free mapping?

<div class="upper-alpha" markdown>
1. Google Maps
2. OpenStreetMap (OpenMaps)
3. Bing Maps
4. Apple Maps
</div>

??? question "Show Answer"
    The correct answer is **B**. OpenStreetMap (often called OpenMaps) provides free map tiles without API keys or usage limits for basic tiles. This makes it ideal for educational MicroSims where licensing costs would be prohibitive.

    **Concept Tested:** OpenMaps Data, Leaflet JS Library

    **Bloom's Level:** Remember

---

#### 8. What is vis-timeline used for?

<div class="upper-alpha" markdown>
1. Creating network graphs
2. Creating interactive maps
3. Creating interactive timelines with events and durations
4. Creating pie charts
</div>

??? question "Show Answer"
    The correct answer is **C**. Vis-Timeline (part of vis.js) creates interactive timelines displaying events across time. It supports point events, durations/ranges, groups (parallel tracks), backgrounds, and interactive zooming/panning.

    **Concept Tested:** Vis-Timeline, Timeline Visualization

    **Bloom's Level:** Remember

---

#### 9. What does a "hierarchical" layout in vis-network produce?

<div class="upper-alpha" markdown>
1. A circular arrangement of nodes
2. A tree-like structure with levels (like an org chart)
3. A random scattering of nodes
4. A force-balanced arrangement
</div>

??? question "Show Answer"
    The correct answer is **B**. Hierarchical layout arranges nodes in levels, producing tree-like structures ideal for organizational charts, reporting structures, and any data with parent-child relationships. Direction can be top-down (UD), left-right (LR), etc.

    **Concept Tested:** Graph Layout Algorithms, Org Chart Example

    **Bloom's Level:** Understand

---

#### 10. What is the difference between a "point" event and a "duration" event in a timeline?

<div class="upper-alpha" markdown>
1. Point events are larger; duration events are smaller
2. Point events represent a single moment; duration events span a time range
3. Point events are interactive; duration events are static
4. There is no difference
</div>

??? question "Show Answer"
    The correct answer is **B**. A point event represents a single moment in time (just a start date), while a duration event spans a time range (both start and end dates). Duration events show as bars on the timeline while points show as markers.

    **Concept Tested:** Event Lists, Durations

    **Bloom's Level:** Understand

---

#### 11. What does a sequence diagram show?

<div class="upper-alpha" markdown>
1. Geographic locations over time
2. Interactions between entities over time
3. Hierarchical relationships
4. Parts of a whole
</div>

??? question "Show Answer"
    The correct answer is **B**. Sequence diagrams show interactions between entities (participants) over time. They're ideal for API call flows, user interactions, protocol documentation, and system architecture, showing the order and flow of messages.

    **Concept Tested:** Sequence Diagrams

    **Bloom's Level:** Remember

---

#### 12. When should you consider using a "heavyweight" library like ReactFlow instead of vis-network?

<div class="upper-alpha" markdown>
1. When creating simple educational demos
2. When building production apps with complex interaction patterns
3. When you need the smallest file size
4. When you only need static diagrams
</div>

??? question "Show Answer"
    The correct answer is **B**. Heavyweight libraries like ReactFlow are appropriate when building production applications with complex interaction patterns, React/Vue integration needs, professional-grade features, and long-term maintenance requirements. For simple educational MicroSims, lightweight libraries like vis-network are usually better.

    **Concept Tested:** Heavyweight Libraries, ReactFlow

    **Bloom's Level:** Analyze

---

## Quiz Summary

**Concepts Tested:**

| Concept | Questions |
|---------|-----------|
| Forced Directed Layout | 1 |
| vis-network Library | 2 |
| Leaflet.js | 3 |
| Geographic Maps | 3 |
| Network Graphs | 4 |
| Graph Node Coloring | 5 |
| Causal Loop Diagrams | 6 |
| OpenMaps Data | 7 |
| Leaflet JS Library | 7 |
| Vis-Timeline | 8 |
| Timeline Visualization | 8 |
| Graph Layout Algorithms | 9 |
| Org Chart Example | 9 |
| Event Lists | 10 |
| Durations | 10 |
| Sequence Diagrams | 11 |
| Heavyweight Libraries | 12 |
| ReactFlow | 12 |

**Bloom's Taxonomy Distribution:**

- Remember: 5 questions (42%)
- Understand: 5 questions (42%)
- Analyze: 2 questions (17%)
