---
title: Diagrams, Networks and Systems
description: Shows how to build interactive Mermaid diagrams, vis-network graphs, Venn diagrams and causal loop diagrams that reveal processes, relationships and feedback.
generated_by: claude skill chapter-content-generator
date: 2026-09-30 10:37:41
version: 1.10
---

# Diagrams, Networks and Systems

## Summary

Covers Mermaid diagrams, vis-network graphs, Venn diagrams and causal-loop diagrams for showing processes, relationships and feedback systems.

Students learn the syntax rules and hover text for Mermaid, node and edge data for networks, and how to draw and read reinforcing and balancing loops. After it, they can build a readable diagram or network MicroSim.

## Concepts Covered

This chapter covers the following 19 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| Mermaid Library | 5 |
| Flowchart | 1 |
| Sequence Diagram | 1 |
| Mermaid Syntax Rules | 2 |
| Mermaid Hover Text | 1 |
| vis-network Library | 16 |
| Node and Edge Data | 11 |
| Network Layout | 3 |
| Concept Map | 1 |
| Graph Viewer | 1 |
| Node Selection Event | 1 |
| Venn Diagram | 1 |
| Causal Loop Diagram | 8 |
| Reinforcing Loop | 3 |
| Balancing Loop | 3 |
| Feedback Loop | 2 |
| System Dynamics | 1 |
| Polarity Link | 1 |
| Diagram Readability | 1 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: What Is a MicroSim](../01-what-is-a-microsim/index.md)
- [Chapter 3: Learning Objectives and Bloom's Taxonomy](../03-learning-objectives-and-blooms-taxonomy/index.md)
- [Chapter 4: Choosing a MicroSim Type](../04-choosing-a-microsim-type/index.md)

---

## Welcome

!!! mascot-welcome "Boxes, Arrows and Loops"
    ![Bounce waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Some ideas are about how things connect: steps in a process, prerequisites in a course, or a habit that feeds itself. Let's bounce it around! By the end of this chapter you will be able to build diagrams and network MicroSims that a learner can click, hover and reason about, instead of a picture they can only look at.

Charts and plots, the subject of the previous chapter, show quantities. This chapter is about *structure*: which things exist, what connects to what, and what happens when a chain of connections curls back on itself. Four families of MicroSim cover most of that ground. Mermaid diagrams draw processes from text. Network graphs show relationships among many items. Venn diagrams show what sets share. Causal loop diagrams show how feedback drives a system over time. Chapter 4 helped you choose among these types; here you learn to build and read each one.

## Mermaid: Diagrams from Text

The **Mermaid library** is a JavaScript library that turns a short block of plain text into a diagram drawn in the browser. The author writes a description such as "step A leads to step B" and Mermaid decides where to place each box and how to route each arrow. This is the cheapest way to make a process diagram, and it suits AI generation well, because a language model can write and revise a few lines of text far more reliably than it can position boxes by hand. In this book, Mermaid is the library of choice when the content is a process, a decision path or an interaction between actors.

Mermaid offers several diagram types, and two matter most for MicroSims. A **flowchart** is a diagram of a process in which boxes (nodes) represent steps or decisions and arrows (edges) show the order in which they happen. A **sequence diagram** shows messages passed between named participants over time, read from top to bottom. A flowchart answers "what are the steps?", and a sequence diagram answers "who says what to whom, and in what order?".

The MicroSim generator's Mermaid guide documents flowcharts in detail, so we build on them first. A flowchart begins with the word `flowchart` followed by a direction: `TD` for top-down, which the guide makes the default, or `LR` for left-to-right. Each node has an identifier, a shape given by the brackets around its label, and the label itself. Edges are drawn with arrows. Before reading the example, note the shapes the guide lists: rounded brackets mark a start or end, square brackets a process step, and curly braces a decision.

```text
flowchart TD
    Start("Learning objective written"):::startNode
    Draft["AI drafts the MicroSim"]:::processNode
    Check{"Meets the objective?"}:::decisionNode
    Done("Publish"):::endNode

    Start --> Draft --> Check
    Check -->|Yes| Done
    Check -->|No| Draft

    classDef startNode fill:#667eea,stroke:#333,stroke-width:2px,color:#fff,font-size:16px
    classDef processNode fill:#764ba2,stroke:#333,stroke-width:2px,color:#fff,font-size:16px
    classDef decisionNode fill:#f093fb,stroke:#333,stroke-width:2px,color:#333,font-size:16px
    classDef endNode fill:#4facfe,stroke:#333,stroke-width:2px,color:#fff,font-size:16px
```

Read the example from the top. The first line fixes the direction. The four node lines create a start, a process step, a decision and an end, each tagged with a style class through the `:::` suffix. The edge lines connect them, and the label `Yes` or `No` sits between the vertical bars on the two edges leaving the decision. The `No` edge loops back to the drafting step, which is how a flowchart shows iteration. The `classDef` lines at the end define the colors and the 16-pixel font size that the guide requires for readability.

A short **sequence diagram** looks different because its rows are messages, not boxes. The following sketch uses the standard Mermaid sequence syntax: `participant` declares an actor, and an arrow with a colon carries a message.

```text
sequenceDiagram
    participant L as Learner
    participant M as MicroSim
    L->>M: Move the gravity slider
    M-->>L: Redraw the ball path
```

The solid arrow is a request and the dashed arrow is a reply. Sequence diagrams are useful for explaining how a learner action and a system response alternate, which is exactly the pattern instrumented MicroSims record. The generator guides listed for this chapter cover flowcharts only, so the sequence syntax above comes from Mermaid's own conventions and you should check it against the Mermaid documentation before relying on it.

### Mermaid Syntax Rules

Mermaid is forgiving in some ways and strict in others, and a small mistake in a label can stop the whole diagram from rendering. The **Mermaid syntax rules** in the generator guide exist to prevent the most common failures. The rules are easier to apply once you know why each one exists: the parser treats several characters as part of its own grammar, so a label that contains them is misread as code.

| Rule | Why it exists |
|---|---|
| Wrap every label in double quotes | Labels with spaces or punctuation are otherwise misparsed |
| Use `<br/>` for a line break, never `\n` | Mermaid v11 does not interpret `\n` in labels by default |
| Avoid `$`, curly braces and backslash sequences inside labels | They collide with math rendering and with the decision-node syntax |
| Do not use lowercase `end` as a node identifier | It is a reserved word |
| Put `classDef` lines after the flowchart lines | Style declarations are applied to nodes already defined |
| Add `subGraphTitleMargin` when a `subgraph` has a title | Without it the title collides with the border and the first node |

!!! mascot-tip "Quote Every Label"
    ![Bounce giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Put double quotes around every label, even the ones that look safe. A label like "Test (unit)" breaks without them, and the error message rarely points at the label.

A **worked example** shows the rules at work. Suppose a first draft contains the node `Cost{Total $ spent}`. It fails for two reasons: the `$` may trigger math parsing, and the braces are read as a decision-node shape. The repaired line is `Cost["Total spent in dollars"]`, which quotes the label, spells out the symbol and uses square brackets for a plain process step. When an AI generator produces a broken diagram, check these rules first.

### Mermaid Hover Text

A diagram that only sits on the page is a picture. **Mermaid hover text** is the explanatory text that appears when a learner moves the pointer over a node, and it is what turns a Mermaid flowchart into an interactive MicroSim. The generator guide requires that every node have an entry, and it prefers a right-hand information panel over a floating tooltip so the text stays readable inside an iframe.

The mechanism is a JavaScript object that maps each node identifier to a short description. The identifiers in the object must match the identifiers in the Mermaid text exactly, which is why the earlier example used meaningful names such as `Draft` and `Check`.

```javascript
const tooltips = {
  Start: 'The objective states what the learner will be able to do.',
  Draft: 'The agent writes code from the specification.',
  Check: 'Automated checks and a human review decide if it is ready.',
  Done:  'The MicroSim is added to the chapter.'
};
```

The guide's script waits for Mermaid to finish drawing before attaching handlers, by polling until the SVG and its node elements exist, because a fixed delay fails unpredictably inside iframes. The guide's tooltip advice is to write one or two short sentences that explain the purpose of a step, not just repeat its label. This book's rule for Mermaid goes one step further: a Mermaid diagram is acceptable only when every node also has a `click` directive, so that touch users and keyboard users, who cannot hover, still reach the same explanation. Mermaid's `click` statement binds a node to a callback function, and the callback fills the same information panel.

#### Diagram: Clickable Flowchart Anatomy

<iframe src="../../sims/clickable-flowchart-anatomy/main.html" width="100%" height="522px" scrolling="no"></iframe>

[Run the Clickable Flowchart Anatomy MicroSim Fullscreen](../../sims/clickable-flowchart-anatomy/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Clickable Flowchart Anatomy</summary>
Type: diagram
**sim-id:** clickable-flowchart-anatomy<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: differentiate): The learner will differentiate the four node shapes of a flowchart and the roles of edges, labels and style classes by inspecting a small working diagram.

Diagram: the drafting flowchart from the text, drawn top-down in the left two thirds of the region: Learning objective written (rounded), AI drafts the MicroSim (rectangle), Meets the objective? (diamond), Publish (rounded). Edges: start to draft, draft to check, check to publish labeled Yes, check back to draft labeled No.

Interactions: every node has a click directive that fills an information panel in the right third with its shape name, its role and the Mermaid line that created it. Hovering a node highlights it and shows the same text. Clicking an edge label shows what a branch label means. A "Break it" toggle removes the quotes from one label and shows the resulting parse error message in the panel, and a second click restores it.

Responsive design: the diagram scales to the container width on window resize, the information panel moves below the diagram under 600 pixels, and fonts stay at least 16 pixels.

Implementation: Mermaid flowchart with classDef styles and click callbacks that write to the panel.
</details>

## Networks with vis-network

Flowcharts suit a process with a clear start and end. Many educational structures are not processes but webs: a concept map, a set of prerequisites, a social network. For those, we need a library that draws an arbitrary graph and lets the reader explore it. The **vis-network library** is a JavaScript library for drawing and interacting with networks of nodes joined by edges. It handles drawing, hit testing, selection, zooming and dragging, so the author supplies only data and options. It is the most heavily depended-on library in this chapter, because the learning graph viewer, the causal loop diagrams later in this chapter and several other MicroSim types all sit on top of it.

Before writing any code, we should settle the vocabulary. A *graph* here means a collection of *nodes* (the items) and *edges* (the connections between them). An edge is *directed* if it points from one node to another, and an arrow at one end shows the direction.

### Node and Edge Data

**Node and edge data** is the information you give vis-network to describe a graph. Each node needs a unique `id` and normally a `label`, which is the text shown. Each edge needs a `from` and a `to` that name node identifiers. The MicroSim generator's template goes further and stores fixed screen positions in each node as `x` and `y`, measured from a canvas center at `(0, 0)`, with negative `x` to the left and negative `y` upward. The template's data file has the shape `nodes` with `id`, `label`, `x`, `y`, and `edges` with `from`, `to`.

```javascript
const nodeData = [
  { id: 1, label: 'Flowchart', x: -300, y: -100 },
  { id: 2, label: 'Concept Map', x: -100, y: -100 },
  { id: 3, label: 'Venn Diagram', x: -300, y: 100 }
];
const edgeData = [
  { from: 1, to: 2 },
  { from: 3, to: 2 }
];
const nodes = new vis.DataSet(nodeData);
const edges = new vis.DataSet(edgeData);
const network = new vis.Network(container, { nodes, edges }, options);
```

The code creates a `DataSet` for each list, because a DataSet lets you update a single node later, for example to change its color when a learner selects it, without rebuilding the graph. The last line hands both DataSets and an `options` object to `vis.Network`, along with the page element named `container` in which to draw.

A **worked example** shows the value of rich node data. Because each node is an object, it can carry extra fields: a `group` that sets its color, a `title` for a tooltip, and any custom field the MicroSim needs. The learning graph viewer, which we meet shortly, stores a `group` per concept for the category color and computes a font size from each concept's Concept Impact Score. The lesson is that a good network MicroSim is mostly a good data file. The layout and interaction code changes little from one network to the next.

Two cautions apply. First, the causal loop diagram files described later in this chapter use a different vocabulary, `source` and `target` in place of `from` and `to`, and `position` objects in place of bare `x` and `y`, so data is not portable between the two formats without conversion. Second, edge direction carries meaning. In this book's learning graph, an edge points from a concept to a prerequisite it depends on, so an arrow reads "depends on". Decide what your arrows mean, and state it in the legend.

### Network Layout

A **network layout** is the rule that decides where each node appears on the canvas. There are two broad strategies. In a *physics* layout, the library simulates forces: nodes repel one another, edges act as springs, and the picture settles into an arrangement that tends to place connected nodes near each other. In a *fixed* layout, the author supplies the coordinates and nothing moves.

The generator guide's standard options choose the fixed strategy, with `physics: { enabled: false }` and `improvedLayout: false`, because fixed positions give "educational clarity": the diagram looks the same for every learner and every screenshot. The learning graph viewer takes the other strategy. It uses the `forceAtlas2Based` physics solver with a fixed random seed of 42, so its layout is reproducible, runs up to 1000 stabilization iterations, and switches physics off after five seconds so the picture stops moving. It turns physics on briefly while a node is being dragged. A large graph with hundreds of nodes is impractical to position by hand, so physics is the right choice there.

| Strategy | Best for | Trade-off |
|---|---|---|
| Fixed positions | Small diagrams with a deliberate reading order | The author must place every node |
| Physics layout | Large graphs whose structure is unknown in advance | Layout can differ between runs unless seeded, and it takes time to settle |

The guide also offers a practical tip for fixed layouts: place the graph on the left of the canvas if a control or information panel occupies the right, and adjust the camera after the first draw using the `afterDrawing` event, because vis-network re-centers the graph automatically when it initializes.

!!! mascot-warning "Mind the Scroll Wheel"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A network in an iframe that zooms on the mouse wheel steals the scroll from the page around it, so readers get stuck on your diagram. The guide's remedy is `zoomView: false` and `dragView: false` with `navigationButtons: true` when embedded, and mouse zoom only in fullscreen.

When you use `navigationButtons`, also load the vis-network stylesheet, because the standalone script build does not include the CSS for the button icons. Without it the buttons exist but are invisible.

### Concept Map

A **concept map** is a network diagram in which nodes are concepts and labeled edges state how they relate, such as "requires", "is a kind of" or "causes". Concept maps are among the most established tools for showing knowledge structure, and they are the natural fit for vis-network because the content is already nodes and edges. A concept map differs from a flowchart in that it has no start, no end and no implied sequence. It differs from a mind map in that edges carry meaning through their labels, not only through proximity.

A **worked example** builds one from this chapter. Take four concepts and two relationships: Flowchart is a kind of Diagram, Concept Map is a kind of Diagram, and a Concept Map is drawn with the vis-network library. Written as data, that is four nodes and three labeled edges. A learner who clicks the Concept Map node can then see its definition, its incoming and outgoing relationships, and a prompt such as "What relationship would connect a Venn Diagram to this map?". Asking learners to add their own nodes and relationships moves the activity from reading a map toward the Create level of Bloom's taxonomy, which Chapter 3 introduced.

### Graph Viewer

The **graph viewer** is this repository's own vis-network MicroSim, and it is a real, working example of the ideas above. It draws the book's learning graph, version 1.04 as displayed in its interface, from the file `learning-graph.json`. Its features, taken from its documentation and code, are:

- A search box that lists up to ten matching concepts and focuses the one you pick.
- Category checkboxes that show or hide groups of concepts, with live counts of visible nodes, visible edges and foundational concepts.
- Node sizes that follow the Concept Impact Score: font size runs from 12 to 22 points on a logarithmic scale, because the scores are heavy-tailed.
- Highlighting of a selected node and its connections.

The viewer's edges point from a concept to its prerequisites, so foundational concepts, which have no outgoing edges, are counted as those with no dependencies. Try it below, and locate the concepts of this chapter.

<iframe src="../../sims/graph-viewer/main.html" width="100%" height="600px" scrolling="no"></iframe>

[Run the Graph Viewer MicroSim fullscreen](../../sims/graph-viewer/main.html){ .md-button }

#### Diagram: Learning Graph Viewer

<details markdown="1">
<summary>Learning Graph Viewer (existing local MicroSim)</summary>
Type: microsim
**sim-id:** graph-viewer<br/>
**Library:** vis-network<br/>
**Status:** Reused<br/>
**Source:** ../../sims/graph-viewer/main.html<br/>
**Source Repo:** docs/sims/graph-viewer in this repository

Reused from this book's own sims directory. Learning objective (Bloom level: Analyze; verb: examine): The learner will examine the learning graph to find the prerequisites of a chosen concept and to distinguish foundational concepts from advanced ones.
</details>

One observation from the code is worth a reviewer's attention. The viewer sets `zoomView: true` and `dragView: true`, so the mouse wheel zooms inside its iframe, which is the behavior the vis-network guide advises against for embedded diagrams. The viewer was designed as a full-page tool with its own sidebar, and the trade-off is acceptable there, but a network embedded inline among paragraphs should follow the guide's stricter default.

### Node Selection Event

A **node selection event** is the notification that vis-network raises when a user clicks a node. You register a function for the event with `network.on`, and the function receives a `params` object whose `nodes` array holds the identifiers of the selected nodes. The graph viewer does exactly this, and its handler calls a function that fades every node that is not the selected node or one of its neighbors to 30 percent opacity for three seconds.

```javascript
network.on('selectNode', function (params) {
  if (params.nodes.length > 0) {
    showDetails(params.nodes[0]);   // fill the information panel
  }
});
```

Selection is the smallest useful interaction in a network MicroSim: it turns a static drawing into something that answers a question about the node the learner chose. It is also the natural place to record evidence. A selection event is a discrete, meaningful learner action, and Chapter 17 shows how such events can be turned into xAPI statements. As of this writing that reporting path is a design, not something the graph viewer does.

#### Diagram: Node and Edge Data Explorer

<iframe src="../../sims/node-edge-data-explorer/main.html" width="100%" height="502px" scrolling="no"></iframe>

[Run the Node and Edge Data Explorer MicroSim Fullscreen](../../sims/node-edge-data-explorer/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Node and Edge Data Explorer</summary>
Type: graph-model
**sim-id:** node-edge-data-explorer<br/>
**Library:** vis-network<br/>
**Status:** Specified

Learning objective (Bloom level: Apply; verb: implement): The learner will implement a small concept map by editing node and edge data and observing how each change alters the drawn network.

Layout: the network occupies the left two thirds with fixed node positions and physics disabled; a data panel on the right shows the JSON for the selected node or edge.

Data: eight concept nodes drawn from this chapter (Flowchart, Concept Map, Venn Diagram, Mermaid Library, vis-network Library, Network Layout, Node Selection Event, Causal Loop Diagram) with x and y positions, and eight edges labeled with relationships such as "is drawn with" and "is a kind of".

Interactions: clicking a node selects it, highlights its connected edges and shows its data; hovering an edge shows its relationship label. Controls: a text field and "Add node" button, a "Connect" mode in which the learner clicks two nodes to create an edge and chooses a relationship label, a "Swap direction" button for the selected edge, and a "Reset" button. A toggle switches between "fixed" and "physics" layout so the learner can compare them.

Responsive design: the network re-fits on window resize, the data panel moves below the network under 600 pixels, and navigation buttons replace mouse-wheel zoom.

Implementation: vis-network with DataSets for nodes and edges, network.on selectNode handlers, and navigationButtons enabled with the vis-network stylesheet loaded.
</details>

## Venn Diagrams

A **Venn diagram** shows sets as overlapping circles, so that the region where circles overlap represents what the sets share. The MicroSim generator's guide builds Venn diagrams with the venn.js library on top of D3, and it supports two to four sets. The data is a list of sets with sizes, plus a size for each intersection, and the guide's rule is that an intersection may not be larger than the smallest set that contains it.

```javascript
var sets = [
  {sets: ['Flowchart'], size: 100},
  {sets: ['Concept Map'], size: 100},
  {sets: ['Flowchart', 'Concept Map'], size: 30}
];
```

For a symbolic diagram like this one, the sizes are chosen to look balanced and do not measure anything. The educational value therefore does not come from the sizes. It comes from what a tooltip says. The guide insists on this: each set and each intersection should map to a short definition, ideally taken from the glossary, and the tooltip shows that definition in place of the numeric size. Here the intersection would read "Nodes joined by arrows". A **worked example** shows how a learner uses it: hovering over the overlap reveals what flowcharts and concept maps share, and hovering over each outer part reveals what is unique, namely a required order of steps for the flowchart and labeled relationships for the concept map.

Choose a Venn diagram when the learning goal is to classify or compare, and the answer is a set relationship. If the relationship is a flow, use a flowchart; if it is a web of many-to-many links, use a network.

#### Diagram: Set Overlap Explorer

<iframe src="../../sims/set-overlap-explorer/main.html" width="100%" height="442px" scrolling="no"></iframe>

[Run the Set Overlap Explorer MicroSim Fullscreen](../../sims/set-overlap-explorer/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Set Overlap Explorer</summary>
Type: microsim
**sim-id:** set-overlap-explorer<br/>
**Library:** venn.js<br/>
**Status:** Specified

Learning objective (Bloom level: Understand; verb: classify): The learner will classify example diagrams into the correct region of a three-circle Venn diagram of Flowchart, Concept Map and Causal Loop Diagram characteristics.

Data: three sets with the characteristics "shows an ordered process", "labels relationships between concepts" and "shows feedback", and seven regions, each with a one-sentence definition used in its tooltip instead of a numeric size.

Interactions: hovering a region shows its definition; clicking a region lists two example diagrams that belong there. A "Classify" mode presents six example diagram descriptions one at a time, and the learner clicks the region where each belongs, receiving immediate feedback and a one-sentence reason.

Responsive design: circles scale to the container width on window resize and tooltip text wraps at narrow widths.

Implementation: venn.js with D3, a definitions object keyed by sorted set names, and a click handler that scores the classification.
</details>

## Systems and Feedback

The remaining concepts address a different question. A flowchart shows what happens in order, and a network shows what connects. Neither shows how a system *behaves over time* when its parts affect each other. **System dynamics** is the field that studies how the structure of a system, its stocks, flows and feedback, produces its behavior over time. A *stock* is a quantity that accumulates, such as the number of skills a learner has mastered. A *flow* changes a stock, such as skills gained per week. The generator's causal loop schema uses the term stock the same way, marking the central accumulating variable of a diagram with the type `stock`.

The core building block of system dynamics is the feedback loop. A **feedback loop** is a closed chain of cause-and-effect relationships in which a change in one variable eventually returns to affect that same variable. Compare a chain, where A affects B and B affects C and the story ends, with a loop, where C then affects A again. Loops are what make systems surprising, because the effect of a change comes back changed.

!!! mascot-thinking "A Loop Is a Conversation"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Think of a loop as a variable talking to itself through other variables. The question to ask is never "what does A do to B?" alone, but "when the answer comes back around, does A get louder or quieter?"

Feedback loops come in two kinds, and the difference between them is the most important idea in this section. Before defining them, we need the notation that lets us tell them apart.

### Polarity Link

A **polarity link** is an arrow between two variables that also states the direction of the effect. A *positive* link means that a rise in the source variable pushes the target variable up, and a fall pushes it down. A *negative* link means that a rise in the source pushes the target down, and a fall pushes it up. In the generator's causal loop format, a positive link is drawn with a green plus sign and a negative link with a red minus sign, and the polarity is causal, not statistical: it answers "if the source goes up, what happens to the target?"

A **worked example** with two links from education. "Practice time to Mastery" is positive: more practice, more mastery. "Mastery to Gap between goal and mastery" is negative: as mastery rises, the gap to the learning goal shrinks. Note that the polarity says nothing about the size of the effect, and it says nothing about whether the effect is immediate; the schema records a separate optional delay field for that.

### Causal Loop Diagram

A **causal loop diagram** is a diagram of variables joined by polarity links, drawn so that its feedback loops are visible and labeled as reinforcing or balancing. It is the standard notation of system dynamics for communicating the *structure* of a system, before any numbers are attached. In the generator's format, a causal loop diagram is a vis-network drawing, so a reader can drag nodes, zoom and click a node or link to open its description.

The file format is a JSON document with four principal parts: `metadata`, `nodes`, `edges` and `loops`. Each node has an `id`, a `label`, a `position` and a `description`. Each edge has a `source`, a `target`, a `polarity` of `positive` or `negative`, and a description. Each loop has an `id` such as `R1` or `B1`, a `type`, and a `path` listing the nodes in traversal order, starting and ending at the same node. The renderer disables physics, so every node needs an explicit position, and the layout templates offer a three-node triangle and a four-node diamond for single loops.

A practical warning from the guide's list of footguns applies to any page with many diagrams: do not give every inline diagram its own iframe. The guide reports that Chrome and Firefox silently fail to paint vis-network instances somewhere around the fifth or sixth iframe on one page, with no error message, and its remedy is an inline renderer that draws all diagrams in one document and reserves iframes for the single fullscreen viewer. We report this as the guide states it; we have not independently reproduced the limit.

### Reinforcing Loop

A **reinforcing loop** is a feedback loop in which a change in any variable, after traveling around the loop, returns as a change in the same direction, so the original change is amplified. Growth feeds more growth, and decline feeds more decline. Reinforcing loops are labeled `R` with a number.

A **worked example** with a learner. Higher Mastery raises Confidence, more Confidence raises Practice time, and more Practice time raises Mastery. Every link is positive. Left alone, the loop drives Mastery upward at an accelerating pace, and it drives it downward just as quickly if it starts from low confidence. This is a plausible structure to draw as a hypothesis about a learner, not a measured result: this book has not yet gathered learner data that would show how strongly any such loop operates.

### Balancing Loop

A **balancing loop** is a feedback loop in which a change returns as an opposing change, so the loop pushes the system toward a goal or a limit. Balancing loops are labeled `B` with a number, and they are how a thermostat works: the further the room is below the target, the harder the heater runs.

A **worked example** in the same setting. A larger Gap between goal and mastery raises Study effort, Study effort raises Mastery, and Mastery lowers the Gap. Two links are positive and one is negative, so the loop pushes the gap toward zero and then stops pushing. The behavior is *goal-seeking*: fast change at first, slowing as the goal approaches.

There is a quick test for classifying any loop, and the generator's schema states it: count the negative links around the loop. An even count, including zero, makes a reinforcing loop, and an odd count makes a balancing loop.

!!! mascot-encourage "Tracing Loops Takes Practice"
    ![Bounce encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    If counting signs around a loop feels slippery at first, that is normal, because you are simulating a system in your head. You have already traced flowcharts, so trace one link at a time with your finger and count the minus signs aloud.

The table below sets the two loop types side by side. It summarizes what we have just defined.

| Feature | Reinforcing loop | Balancing loop |
|---|---|---|
| Label | R1, R2, ... | B1, B2, ... |
| Negative links around the loop | Even, including zero | Odd |
| Effect of a change | Amplified | Opposed |
| Typical behavior over time | Accelerating growth or decline | Movement toward a goal, then leveling off |
| Marker color in the generator's format | Red | Green |
| Learner example from this section | Mastery, Confidence, Practice time | Gap, Study effort, Mastery |

The behavior in the last row can be seen in a few lines of code. Before reading it, note the parameters: `x` is the stock, `rate` is how strongly the loop acts each step, and `goal` is the value a balancing loop pursues. In the reinforcing update the change is proportional to the current value, and in the balancing update it is proportional to the distance from the goal.

```javascript
let x = 10, rate = 0.1, goal = 100;

function stepReinforcing() { x = x + rate * x; }
function stepBalancing()   { x = x + rate * (goal - x); }
```

Run `stepReinforcing` repeatedly and `x` grows faster each step. Run `stepBalancing` repeatedly and `x` rises quickly at first and then flattens near 100, because the term `goal - x` shrinks as `x` approaches the goal. These two lines are a complete, if crude, system dynamics model, and they are a good candidate for a p5.js MicroSim in which the learner moves the `rate` and `goal` sliders.

#### Diagram: Loop Polarity Tracer

<iframe src="../../sims/loop-polarity-tracer/main.html" width="100%" height="514px" scrolling="no"></iframe>

[Run the Loop Polarity Tracer MicroSim Fullscreen](../../sims/loop-polarity-tracer/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Loop Polarity Tracer</summary>
Type: causal-loop-diagram
**sim-id:** loop-polarity-tracer<br/>
**Library:** vis-network<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: examine): The learner will examine a causal loop diagram, trace its polarity links, and determine whether the loop is reinforcing or balancing.

Data: two loops on one canvas with fixed positions and physics disabled. Loop A: Mastery, Confidence, Practice time, back to Mastery, all positive. Loop B: Gap between goal and mastery, Study effort, Mastery, with the link from Mastery to Gap negative. Mastery is shared, so the two loops touch.

Interactions: hovering or clicking a node shows its one-sentence description; clicking a link shows its polarity and reason (for example "More practice, more mastery"). A "Trace" button highlights one link at a time around a chosen loop while a counter shows the number of negative links so far. Before the final step, the learner chooses "Reinforcing" or "Balancing" and receives feedback that names the count. A "Flip a sign" mode lets the learner change one link's polarity and watch the loop label change between R and B.

Responsive design: the diagram re-fits to the container width on window resize, the details panel moves below the diagram under 600 pixels, and mouse-wheel zoom is disabled in favor of navigation buttons.

Implementation: vis-network with a JSON document in the causal loop schema (nodes, edges with polarity, loops with type and path), a click handler on nodes and edges, and green plus and red minus labels on the edges.
</details>

#### Diagram: Reinforcing and Balancing Behavior Lab

<iframe src="../../sims/feedback-behavior-lab/main.html" width="100%" height="652px" scrolling="no"></iframe>

[Run the Reinforcing and Balancing Behavior Lab MicroSim Fullscreen](../../sims/feedback-behavior-lab/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Reinforcing and Balancing Behavior Lab</summary>
Type: microsim
**sim-id:** feedback-behavior-lab<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Understand; verb: compare): The learner will compare the time behavior of a reinforcing loop and a balancing loop by changing the loop rate and the goal and observing the resulting curves.

Layout: a drawing region above a control region. The drawing region shows a line graph with time steps on the horizontal axis and the stock value on the vertical axis, with two colored curves, one per loop type, and a dashed horizontal line for the goal. The control region is white.

Controls: slider "Rate" from 0.01 to 0.3 in steps of 0.01, default 0.1; slider "Goal" from 50 to 200, default 100; slider "Start value" from 1 to 50, default 10; a Start / Pause button and a Reset button; a checkbox "Predict first" that pauses after each slider change and asks whether each curve will rise faster, slower or the same.

Behavior: each frame applies the two update rules from the chapter, x = x + rate * x for the reinforcing curve and x = x + rate * (goal - x) for the balancing curve. Hovering a point shows the step number and value. A caption explains the shape seen so far.

Responsive design: the canvas width follows the container width on window resize; sliders and buttons stay visible at 400 pixels wide.

Implementation: p5.js with createSlider and createButton controls positioned relative to the drawing height, and a describe() call for accessibility.
</details>

## Making Diagrams Readable

Every technique in this chapter can produce a diagram that is technically correct and still unusable. **Diagram readability** is the degree to which a learner can find, decode and remember what a diagram is trying to say without effort spent on the drawing itself. It matters more in a MicroSim than on paper, because a learner may see it on a phone, inside a narrow iframe, or with a screen reader.

The generator guides give concrete standards, and we collect them here. They are recommendations from those guides, not measured results, though they are consistent with the general guidance on accessible design that Chapter 24 develops.

| Concern | Standard from the generator guides |
|---|---|
| Text size | Minimum 16 pixel fonts on nodes and edge labels |
| Contrast | At least the WCAG AA ratio of 4.5:1 between text and its background |
| Label length | Two to five words per node |
| Size | If a Mermaid diagram exceeds about 15 nodes, split it into several diagrams |
| Color use | Use color consistently for meaning, such as green for success and red for errors, and keep one palette across related diagrams |
| Interaction | Every node has hover or click text; information panels beside the diagram are preferred to overlays that cover it |
| Layout | Fixed positions for small diagrams; overlays that do not consume layout space; navigation buttons instead of mouse-wheel zoom in embedded frames |

A **worked example** applies the table. A first-draft flowchart has 22 nodes, labels of eight words each, and pale yellow text on a white background. Applying the standards, the author splits it into a main flow of eight nodes and two detail diagrams, shortens labels to "Draft the specification" and "Run automated checks", and changes the text color to a dark shade that passes the contrast ratio. The information does not shrink, since the details move into hover text; only the reading effort does.

Color alone should not carry meaning, because some readers cannot distinguish the colors. The green plus and red minus of a polarity link avoid this problem in the generator's format by pairing the color with a symbol, and you should do likewise: add a shape, a symbol or a text label wherever a color encodes a category.

#### Diagram: Readability Repair Bench

<iframe src="../../sims/diagram-readability-repair-bench/main.html" width="100%" height="657px" scrolling="no"></iframe>

[Run the Readability Repair Bench MicroSim Fullscreen](../../sims/diagram-readability-repair-bench/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Readability Repair Bench</summary>
Type: microsim
**sim-id:** diagram-readability-repair-bench<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Evaluate; verb: critique): The learner will critique a cluttered diagram against the readability standards and repair it by applying fixes in order of effect.

Layout: the left two thirds show a deliberately flawed flowchart drawn in the canvas (small fonts, long labels, low-contrast text, 20 nodes, color-only meaning). The right third shows a checklist of the seven standards, each with a status light.

Interactions: clicking a flaw on the diagram names the violated standard and lights the matching checklist item. Buttons apply one repair each (enlarge fonts, shorten labels, fix contrast, split into two diagrams, add symbols to colors); each repair updates the diagram and the status lights. A "Score" readout shows how many standards are met, and a "Before / After" toggle compares the original and the repaired diagram.

Responsive design: the diagram and checklist scale to the container width on window resize, and the checklist moves below the diagram under 600 pixels.

Implementation: p5.js with hit regions on diagram elements, a state object holding the seven standard statuses, and describe() text for screen readers.
</details>

## Choosing Among the Four

You can now match a structure to a library. Use Mermaid when the content is an ordered process, a decision path or a message exchange. Use vis-network when the content is a set of items and relationships without an inherent order, and when learners should explore it. Use a Venn diagram when the question is what sets share. Use a causal loop diagram when the point is behavior over time driven by feedback. Chapter 4 gave a general routing method for these choices, and the table below shows the mapping in miniature.

| If the learner must understand... | Consider | Library |
|---|---|---|
| The steps of a procedure | Flowchart | Mermaid |
| Who sends what to whom | Sequence diagram | Mermaid |
| How concepts relate | Concept map or network | vis-network |
| What two or three categories share | Venn diagram | venn.js |
| Why a system grows, stalls or oscillates | Causal loop diagram | vis-network |

## Chapter Summary

!!! mascot-celebration "You Can Draw the Structure"
    ![Bounce celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now write a valid Mermaid flowchart with hover text, describe a graph as node and edge data, and classify a feedback loop as reinforcing or balancing by counting its negative polarity links. That is a complete toolkit for showing structure and feedback.

The key ideas of this chapter are:

- The Mermaid library turns text into flowcharts and sequence diagrams, its syntax rules prevent parse failures, and hover text or click directives on every node make a diagram interactive.
- The vis-network library draws graphs from node and edge data, and its layout can be fixed by the author or computed by physics; embedded networks should disable mouse-wheel zoom.
- A concept map labels the relationships among concepts, the graph viewer shows the whole learning graph with search, filters and importance-scaled nodes, and a node selection event is the basic hook for interaction.
- A Venn diagram compares sets, and its value comes from the definitions in its tooltips, not from the sizes.
- System dynamics explains behavior over time through feedback loops; polarity links show the direction of each effect, and counting negative links classifies a loop as reinforcing (even) or balancing (odd).
- Diagram readability depends on large text, sufficient contrast, short labels, limited size, consistent color plus symbols, and information available on hover or click.

The next chapter turns from structure to time and place, showing how timelines and maps present events and geographic data as interactive MicroSims.
