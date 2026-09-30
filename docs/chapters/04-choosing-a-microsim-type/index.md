---
title: Choosing a MicroSim Type
description: Presents the catalog of MicroSim types and the routing rubric that maps a learning objective to the type and library best suited to it.
generated_by: claude skill chapter-content-generator
date: 2026-09-30 10:21:29
version: 1.10
---

# Choosing a MicroSim Type

## Summary

Presents the catalog of MicroSim types and the routing rubric that maps a learning objective to the type and library best suited to it.

Students learn keyword routing, routing scores and ambiguity, the interactive-by-default policy, and when reuse beats building. After it, they can justify the choice of a type for any objective.

## Concepts Covered

This chapter covers the following 23 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| MicroSim Type Catalog | 317 |
| Type Routing | 82 |
| Routing Rubric | 3 |
| Keyword Routing | 2 |
| Routing Score | 2 |
| Routing Ambiguity | 1 |
| Objective-to-Type Mapping | 3 |
| Interactive-by-Default Policy | 2 |
| Static Image Exception | 1 |
| Reuse Versus Build Decision | 4 |
| p5.js Type | 58 |
| Chart.js Type | 17 |
| Plotly Type | 4 |
| Mermaid Type | 6 |
| vis-network Type | 26 |
| vis-timeline Type | 5 |
| Leaflet Map Type | 10 |
| Venn Diagram Type | 2 |
| Causal Loop Diagram Type | 9 |
| Comparison Table Type | 20 |
| Image Overlay Type | 76 |
| Grid Overlay Poster Type | 32 |
| Verified Poster Type | 7 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: What Is a MicroSim](../01-what-is-a-microsim/index.md)
- [Chapter 3: Learning Objectives and Bloom's Taxonomy](../03-learning-objectives-and-blooms-taxonomy/index.md)

---

## Welcome

!!! mascot-welcome "Pick the Right Tool First"
    ![Bounce waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    A well-written objective can still be wasted on the wrong kind of MicroSim, and a bar chart cannot teach what a network graph shows at a glance. By the end of this chapter you will be able to look at any objective and defend, in a sentence or two, which type and library should teach it. Let's bounce it around!

Chapter 3 taught you to state an objective and classify it by Bloom level. This chapter takes the next step: given a finished objective, decide *what kind of MicroSim* should carry it. The decision matters because each type is built on a different library with different strengths. A choice made carelessly here costs hours later, when a generated MicroSim fights its own library. We begin with the catalog of types, then the routing process that selects among them, then each type in turn, and finally the question of whether to build anything at all.

## The MicroSim Type Catalog

Before we can choose among types, we need a working definition of *type*. A **MicroSim type** is a family of MicroSims that share a rendering library, a data format, and a characteristic interaction style. All Chart.js MicroSims, for example, describe their content as datasets and respond to hovering and legend clicks, while all Leaflet MicroSims describe their content as coordinates and respond to panning and zooming.

The **MicroSim Type Catalog** is the book's list of these families, together with the situations each one serves. It comes from the generator skill introduced in Chapter 1. That skill describes itself as consolidating 17 individual generator skills into one entry point, and each generator has a *guide*, a reference file that tells the agent how to build that family. The catalog in this chapter groups those guides by the kind of thing the learner needs to see.

The table below summarizes the primary generators listed in the skill's "Available Generators" table. We define each type properly in later sections, so read this one as a map of the territory.

| Family | Types in the catalog | Library | What the learner sees |
|---|---|---|---|
| Custom simulation | p5.js, celebration effects | p5.js | Animated models with sliders and buttons |
| Quantitative data | Chart.js, bubble chart, Plotly | Chart.js, Plotly | Charts and function plots |
| Structure and process | Mermaid, vis-network, Venn, causal loop | Mermaid, vis-network, custom | Diagrams, networks, sets, feedback loops |
| Time and place | vis-timeline, Leaflet | vis-timeline, Leaflet | Events on a time axis, markers on a map |
| Comparison | Comparison table, HTML matrix table | Custom HTML | Rated or expandable side-by-side tables |
| Image-based | Infographic overlay (callout and grid) | Custom (`diagram.js`, `grid-diagram.js`) | An illustration with interactive labels or zones |
| Assessment and labs | Concept classifier, Docker Python lab | p5.js, custom | Sorting quizzes and runnable code |
| Verified facts | Verified poster | Text verification, then image | A static poster whose numbers are all cited |

A **worked example** shows the catalog in use. Suppose you must teach "the difference between a reinforcing and a balancing feedback loop." Scan the table for the row whose "what the learner sees" matches: feedback loops appear in the structure and process family, under causal loop. You have narrowed a universe of possibilities to one guide in a single step, before considering any detail. The catalog does not choose for you when two families both fit, and the next sections supply the method for those cases.

The diagram below lets you explore the catalog. First note two terms it uses. A *library* is the prewritten JavaScript code a type is built on, as defined in Chapter 1. A *guide* is the skill's reference file for one type, which the agent reads before writing code.

#### Diagram: MicroSim Type Catalog Explorer

<iframe src="../../sims/microsim-type-catalog-explorer/main.html" width="100%" height="662px" scrolling="no"></iframe>

[Run the MicroSim Type Catalog Explorer MicroSim Fullscreen](../../sims/microsim-type-catalog-explorer/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>MicroSim Type Catalog Explorer</summary>
Type: graph-model
**sim-id:** microsim-type-catalog-explorer<br/>
**Library:** vis-network<br/>
**Status:** Specified

Learning objective (Bloom level: Remember; verb: identify): The learner will identify the library, the typical data, and one suitable objective for each MicroSim type in the catalog.

Nodes and edges: a central node "MicroSim Type Catalog" connected to eight family nodes (Custom simulation, Quantitative data, Structure and process, Time and place, Comparison, Image-based, Assessment and labs, Verified facts). Each family node connects to its type nodes, for example Quantitative data to Chart.js Type and Plotly Type. Family nodes use one color each, and type nodes use a lighter tint of their family color.

Interactions: hovering a type node shows its library name in a tooltip. Clicking a type node opens an information panel with a one-sentence definition, the data it needs, an example objective, and a near-miss objective that belongs to a different type. Nodes can be dragged, and the mouse wheel zooms. A "Quiz me" button hides the labels of the type nodes and shows one example objective at a time, asking the learner to click the node that fits.

Responsive design: the network re-fits to the container width on window resize, and the information panel moves below the network when the width is under 600 pixels.

Implementation: vis-network with a hierarchical layout and click and hover event handlers.
</details>

## Routing: From Objective to Type

The catalog says what exists. **Type Routing** is the process of selecting, for one objective, the single type and library that should teach it. The generator skill performs routing as the first part of its implementation step: it "analyzes the request and matches a generator," then loads that generator's guide. Routing is a decision, and like any decision it can be made well or badly, quickly or slowly. The rest of this section breaks it into named parts so that you can do it deliberately.

Type routing proceeds in four moves, which we will examine one at a time:

1. Restate the objective by its Bloom level and verb (Chapter 3).
2. Match the objective to a data shape and interaction pattern, which is the *mapping* step.
3. Check trigger words and score the candidate types against a rubric.
4. If two candidates tie, resolve the ambiguity, and if the winner is a static image, apply the interactivity policy.

Before we look at the decision tree that captures moves two through four, define its vocabulary. A *data shape* is the form the content takes: dated events, coordinates, nodes and edges, numbers in categories, functions of one variable, sets, and so on. The skill's decision tree asks a sequence of yes-or-no questions about data shape and stops at the first "yes."

#### Diagram: Type Routing Decision Tree

<iframe src="../../sims/type-routing-decision-tree/main.html" width="100%" height="822px" scrolling="no"></iframe>

[Run the Type Routing Decision Tree MicroSim Fullscreen](../../sims/type-routing-decision-tree/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Type Routing Decision Tree</summary>
Type: workflow
**sim-id:** type-routing-decision-tree<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Learning objective (Bloom level: Apply; verb: use): The learner will use the routing questions to select the correct MicroSim type for six described objectives.

Diagram: a top-to-bottom flowchart of yes-or-no questions taken from the generator skill's decision tree, in this order: numeric claims that must be verified; dates or a timeline; geographic coordinates; a mathematical function; nodes and edges; a flowchart or process; sets with overlaps; a priority matrix; a standard chart; a comparison table; a sorting quiz; a labeled illustration; runnable Python; otherwise a custom simulation. Each "yes" branch ends in a leaf naming the type and library.

Interactions: every node has a click directive that opens an infobox with a one-sentence explanation and one example objective that answers yes at that question. A "Try an objective" panel shows a sample objective and lets the learner click the path they would follow, and the diagram highlights the path the skill's tree would follow and compares the two.

Responsive design: the diagram scales to the container width, node text wraps at narrow widths, and the infobox moves below the diagram under 600 pixels.

Implementation: Mermaid flowchart with a click callback on every node that fills the infobox.
</details>

### Objective-to-Type Mapping

**Objective-to-Type Mapping** is the step that connects the *verb and level* of an objective to an interaction pattern, and the interaction pattern to a family of types. Chapter 3 gave you the first half: a Remember objective suits flashcards, matching or labeling; an Understand objective suits step-through worked examples; an Apply objective suits sliders and calculators; an Analyze objective suits network explorers and comparison tools; an Evaluate objective suits sorting and ranking; and a Create objective suits builders. This chapter supplies the second half, from pattern to type.

A **worked example** joins the halves. Take the objective "Analyze the prerequisite relationships among five concepts." The Bloom level and verb point to a network explorer, and a network explorer is what the vis-network type provides. Change the verb: "Remember the names of the parts of a cell." Now the pattern is labeling, and the image overlay type, with its hover labels and quiz mode, fits better than any diagram library. The same subject matter routes to different types because the objectives differ.

The table below summarizes the mapping for the common cases. It reinforces what we have just discussed and is not an exhaustive rule.

| Objective (level and verb) | Interaction pattern | Likely type |
|---|---|---|
| Remember: label the parts | Label the diagram, hover to identify | Image overlay |
| Understand: explain how the parameter changes the output | Step-through or slider exploration | p5.js, or Plotly for a function |
| Apply: calculate with different inputs | Parameter sliders | p5.js, Plotly |
| Analyze: examine relationships | Network explorer | vis-network |
| Analyze: compare items on criteria | Comparison tool | Comparison table |
| Evaluate: classify scenarios | Sorting quiz | Concept classifier (Chapter 11) |
| Create: build a model | Builder or editor | p5.js or a specialized builder (Chapter 11) |

!!! mascot-thinking "Verb First, Library Second"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Notice that nobody asked "which library do I like?" The verb in the objective names what the learner does, and the type is simply the container built for that action. Start from the action and the library nearly chooses itself.

### Keyword Routing

**Keyword routing** is the fastest form of routing: scan the request for trigger words that are associated with one type. The generator skill keeps a quick-reference table pairing keyword groups with guides. For example, "timeline, dates, chronological, events, history, schedule, milestones" points to the timeline guide, and "map, geographic, coordinates, latitude, longitude, locations, markers" points to the map guide. Keyword routing is cheap and usually right, which is why it comes first.

Its weakness is that keywords are properties of *words*, not of *objectives*. The word "interactive" appears in the trigger list for the p5.js guide, yet nearly every MicroSim is interactive, so the word carries no information. Words such as "graph," "diagram," "map," and "table" each name more than one type. Treat a keyword match as a hypothesis to be confirmed, not a verdict.

A **worked example** uses a request the skill itself cites: "Create a graph of our project dependencies." The word "graph" suggests a chart, but "dependencies" is a trigger for the vis-network guide, and a dependency structure is nodes and edges. Keyword routing lands on vis-network with a caveat: the skill's own note says to confirm whether the user meant a chart. The next sections show how to make that confirmation systematic.

### Routing Rubric and Routing Score

The **routing rubric** is the scoring scheme that turns a fuzzy judgment into a comparable number. The generator skill's routing criteria file scores each candidate generator on a scale from 0 to 100 and defines five bands. Each generator has its own guidelines for what earns a high or low score, such as "Score 90-100 if the specification explicitly requests one of the supported chart types" for Chart.js.

A **routing score** is the number a candidate type receives when the rubric is applied to one objective. The bands are worth memorizing because they turn a number into an action:

| Score range | Meaning | Action |
|---|---|---|
| 90-100 | Perfect match, a primary use case | Choose it |
| 70-89 | Strong match, minor limitations | Choose it and note the limitations |
| 50-69 | Moderate match, could work but not optimal | Keep it as a fallback |
| 30-49 | Weak match, needs workarounds | Avoid unless nothing else fits |
| 0-29 | Poor match | Do not use |

Be clear about who assigns the scores. In the skill, the *agent* (or you, reading the same criteria) judges each candidate against the descriptions in the criteria file. The numbers are structured judgments, not the output of a formula. The rubric also asks for at least one score of 70 or higher among the top candidates, and for a spread of scores, since a list where everything scores 50 tells you nothing.

A **worked example** shows the rubric applied. The objective is "Explain how the Roman Empire expanded around the Mediterranean between 100 BC and AD 117." The scores below are our illustrative judgments, not values produced by the skill.

| Candidate | Illustrative score | Reason |
|---|---|---|
| Leaflet map | 80 | Geographic locations are central, though dates matter too |
| vis-timeline | 70 | Dated events, but geography is the point of the objective |
| p5.js | 40 | Could animate the spread, but a standard library would be simpler |
| Chart.js | 15 | The content is not a quantity in categories |

Here the top two are close, which leads to the next concept.

### Routing Ambiguity

**Routing ambiguity** is the situation in which two or more candidate types earn similar routing scores, so that the rubric alone cannot settle the choice. The skill's instruction for this case is explicit: read the routing criteria, score the top three candidates, present the options with reasons, and let the user choose. In the Roman Empire example, a map and a timeline are both defensible, and only the author knows whether "where" or "when" is the main point.

The skill does not fix a numeric margin that counts as a tie. A practical rule for this book, which is our suggestion and not part of the skill, is to treat candidates within about ten points as ambiguous and to resolve them with one clarifying question about the objective. Here the question is "Should the learner be able to see the spread over time, or the place where each event happened?" A learner who must see both may need a map with a time slider, which leads to a custom p5.js or Leaflet design, or to two MicroSims side by side.

The skill also lists terms that trigger clarification on their own:

- "graph" means a chart (Chart.js) or a network (vis-network).
- "diagram" means structural (Mermaid), network (vis-network), or custom (p5.js).
- "map" means geographic (Leaflet) or a concept map (vis-network).
- "table" means star ratings (comparison table) or clickable cells with detail panels (HTML matrix table).

!!! mascot-tip "Ask One Question"
    ![Bounce giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    When two types tie, do not average them and do not flip a coin. Ask the single question whose answer separates them, such as "what does the learner change or click?", and write the answer into the objective so the next reader does not have to ask again.
    
The calculator below lets you practice with the rubric before we survey the types in detail.

#### Diagram: Routing Score Workbench

<iframe src="../../sims/routing-score-workbench/main.html" width="100%" height="682px" scrolling="no"></iframe>

[Run the Routing Score Workbench MicroSim Fullscreen](../../sims/routing-score-workbench/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Routing Score Workbench</summary>
Type: chart
**sim-id:** routing-score-workbench<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Learning objective (Bloom level: Evaluate; verb: justify): The learner will justify a type choice by assigning rubric scores to competing types for a described objective and explaining any routing ambiguity.

Data: a bank of at least eight objectives, each with three to four candidate types. Each candidate has a hidden reference score band (for example 70-89) written by the author of the bank, and these bands are teaching examples, not output of the generator skill.

Chart type and layout: a horizontal bar chart with one bar per candidate type, an x-axis of 0 to 100 with the five rubric bands shaded behind the bars, and the objective shown above the chart.

Controls: one slider per candidate (0 to 100, step 5, default 50), a "Reveal reference bands" button, a "Next objective" button, and a checkbox "Show ambiguity warning" that is on by default.

Interactions: dragging a slider updates its bar and the band label. When the top two bars are within 10 points, a banner reads "Routing ambiguity: ask a clarifying question" and lists two candidate questions to choose from. Hovering a bar shows the guideline text that supports that candidate. After "Reveal reference bands" the chart overlays the reference bands and reports how many of the learner's scores fell in the reference band.

Responsive design: the chart re-fits to the container width on window resize, and sliders stack below the chart under 600 pixels.

Implementation: Chart.js bar chart with the annotation drawn by a custom plugin, plus standard HTML range inputs.
</details>

### Interactive-by-Default Policy and Static Image Exception

The **Interactive-by-Default Policy** is the generator skill's standing rule that every MicroSim deliverable must be interactive unless a person explicitly asks for something else. In the skill's words, the library never generates a static image as a deliverable unless the user specifically requests one. The reason given is measurement: a flat image emits no interaction events, so it says nothing about whether readers understood it, and the library aims for textbooks whose interactive elements can report what learners do (Chapter 1). Whether those events truly predict mastery is a hypothesis, tested in Chapters 18 and 19. The policy is a design commitment, taken so the data can exist at all.

The policy has practical consequences for routing. When a request could be served by a flat poster or by an interactive graphic, route to the interactive one. The skill gives an example: a request for "an infographic about how much water each food crop takes to grow" is not a request for a PNG, so the right response is to verify the numbers and build a Chart.js MicroSim, not to render a poster.

The **Static Image Exception** is the narrow case in which a static image is allowed: the user has *specifically* asked for a poster, image, or PNG. Even then the image is not the end of the work. The skill requires that a verified poster be wrapped in an interactive overlay afterward, so that its regions can produce interaction events. The exception permits the static picture, and the policy still governs the deliverable.

A **worked example** shows the decision. A teacher writes: "Make a printable poster comparing LED and incandescent lighting with real numbers." The word "poster" and the request for a printable image satisfy the exception, and the numbers require verification, so the route is the verified poster (described later in this chapter), followed by a grid overlay. Change the request to "make an infographic comparing LED and incandescent lighting" and the exception does not apply, so the route becomes a verified claim set rendered by an interactive type.

## The Types in Detail

We now walk through the types themselves. For each, we state what it is for, what it needs as input, and where it is weak, drawing on the routing criteria and the type's guide. Chapters 6 through 11 teach how to build each one, so here we care only about recognizing when it is the right choice.

### p5.js Type

The **p5.js Type** covers MicroSims drawn on a canvas with the p5.js library, which provides drawing functions, an animation loop, and interface controls. It is the most flexible type and the default for anything that behaves like a physical or abstract *system*: a bouncing ball, a pendulum, a queue, a particle field. The routing criteria describe it as suited to custom animations, physics, and unique interactions that no standard library provides, with very high interactivity.

That flexibility has a price, which the criteria state plainly: it takes more development time, and it is not optimized for standard charts or diagrams. A rule of thumb follows. Choose p5.js when the learner must *change a parameter and watch a model respond*, and choose another type when a library already draws the picture you need.

A **worked example** contrasts two requests. "Show how gravity and bounciness change a ball's motion" needs a model, an animation loop, and two sliders, so it is a p5.js MicroSim (it is the lab from Chapter 1). "Show enrollment by year for five schools" needs only bars, so building it in p5.js would mean re-creating axes and tooltips that Chart.js already provides. The first would score around 90 for p5.js and the second below 30.

### Chart.js Type

The **Chart.js Type** covers standard statistical charts built with the Chart.js library. The routing criteria list bar (vertical and horizontal), line, pie, doughnut, radar, polar area, scatter, and bubble charts. Interactivity is medium: hover tooltips, legend toggling, and responsive resizing. The guide set also contains a dedicated bubble-chart guide, built on Chart.js, for priority matrices such as impact versus effort.

Choose it when the content is numbers in categories or over time and the learner needs to compare values. It is a weak choice for timelines, networks, or continuous mathematical functions, which have dedicated types. A **worked example**: an objective "Compare the number of MicroSims by type across three books" gives a bar chart with one bar per type. Adding a toggle for each book uses the legend-toggling behavior at no extra cost. Chapter 7 covers configuration and datasets.

### Plotly Type

The **Plotly Type** covers plots of mathematical functions using the Plotly library. Its trigger words are "function," "f(x)," "equation," "sine," "polynomial," and "calculus," and its interactivity is high: sliders that move points along a curve, coordinate tooltips, zoom, and pan. It suits calculus, physics equations, and engineering functions. It is a poor fit for discrete or categorical data, where Chart.js is simpler. For example, an objective to "explain how the amplitude and frequency of a sine wave change its graph" routes here, because the content is a continuous function with two parameters that sliders can vary.

### Comparison Table Type

The **Comparison Table Type** covers side-by-side comparisons of several items across several criteria. The library has two guides. The comparison-table guide produces tables with 1 to 5 star ratings, difficulty badges, logos, and hover tooltips, for 3 to 8 items and 1 to 4 rating columns. The HTML matrix guide produces tables whose cells open a sliding detail panel, for grids the criteria file describes as best at 4 to 8 rows by 3 to 6 columns.

The choice between the two turns on how much explanation each cell needs. If a cell is a rating or a short value, use star ratings. If each cell needs a paragraph and an example, use the matrix with detail panels. The skill's ambiguity note for "table" asks exactly this question.

A **worked example**: comparing five charting libraries on "ease of learning" and "interactivity" needs two rated columns and a one-line description, so it is a star-rating comparison table. Comparing four learning theories across six dimensions, where each cell needs an explanation and an example, is an HTML matrix. When the compared values are real-world measurements, the values must also be sourced, which links to the verified poster discussion below and to Chapter 7.

### Mermaid Type

The **Mermaid Type** covers diagrams generated from a short text description by the Mermaid library. The criteria list flowcharts, state diagrams, sequence diagrams, entity-relationship diagrams, class diagrams, user journeys, and block diagrams. The text-based source makes them easy to write and revise, which suits documentation.

Mermaid is also the type with the *lowest* built-in interactivity, rated low to medium, and it notes that shape sizes may not scale responsively. This book's rule follows from that weakness: a Mermaid diagram is acceptable only when every node has a click directive that reveals an explanation, since a diagram without one is a static image. The routing consequence is that Mermaid wins for *process and sequence* content and loses to vis-network when the learner must drag, explore, or filter.

A **worked example**: "Describe the steps of a change-approval process" is a flowchart with decisions, so Mermaid scores high. "Explore which of 200 concepts depend on this one" needs dragging, zooming, and highlighting of neighbors, so Mermaid scores low and vis-network wins. Chapter 8 covers the syntax and click directives.

### vis-network Type

The **vis-network Type** covers interactive graphs of nodes and edges built with the vis-network library. It is rated very high for interactivity, offering physics-based layout, dragging, zoom, click-for-details, and hover tooltips. It suits concept maps, dependency graphs, learning graphs, knowledge maps, and system diagrams where relationships are the content. The criteria warn that it becomes overwhelming with too many nodes and is not ideal for strict hierarchies, where Mermaid is simpler.

The routing signal is *relationships as the subject*. An objective that says "identify," "trace," or "explore" connections among entities points here. A **worked example**: the objective "Analyze which concepts must be learned before Instrumented MicroSim" needs nodes for concepts and directed edges for dependency, a click on a node that shows its definition, and a highlight of prerequisites. Each feature comes with the library. Note that this chapter's own catalog explorer is specified as a vis-network MicroSim for exactly that reason.

### Causal Loop Diagram Type

The **Causal Loop Diagram Type** covers diagrams of feedback in a system. A *causal loop diagram* (CLD) shows variables joined by arrows in which one variable increases or decreases another, and it marks closed cycles as *reinforcing* loops, which amplify change, or *balancing* loops, which resist it. Chapter 8 teaches how to draw and read them. The type is built on vis-network and is triggered by words such as "causal," "feedback," "reinforcing," "balancing," and "systems thinking."

Its guide is specific about one implementation trap that affects routing. The diagrams are rendered inline by a shared script rather than one iframe per diagram, because, according to the guide, browsers silently stop rendering past about five or six iframes on one page. So when a page needs several loops, CLD is the right type and a pile of separate MicroSims is not.

The routing test is polarity: if the objective needs the learner to see *loop polarity* and not just connections, choose CLD. If it only needs connections, a general vis-network graph scores higher and is simpler. For example, "Explain why adding more capacity can increase traffic" is a reinforcing loop and routes to CLD, while "List the systems that connect to the billing service" is a plain network.

### Venn Diagram Type

The **Venn Diagram Type** covers overlapping sets, drawn as two to four circles with hover tooltips that define each region. It is rated medium for interactivity, and the guide notes that the underlying library is not actively maintained, so it should be used with caution. Choose it only when *overlap* is the point, such as "distinguish what artificial intelligence, machine learning, and data science share." For anything with more than four sets, or relationships richer than overlap, use vis-network.

### vis-timeline Type

The **vis-timeline Type** covers events and periods arranged on a zoomable time axis using the vis-timeline library. It is rated high for interactivity: zoom, pan, click for detail, and category filtering. It requires dates. The criteria say to score it below 50 when a sequence has no specific dates, because then a numbered list or a flowchart does the job better.

A **worked example**: "Identify the milestones between MicroSims 1.0 and 2.0 and order them in time" has dated events, an ordering verb, and a need to reveal detail, which is the timeline in Chapter 1. The same milestones without dates would be a process, and Mermaid would fit better. Chapter 9 covers items, groups, and dates.

### Leaflet Map Type

The **Leaflet Map Type** covers interactive maps built with the Leaflet library, using geographic coordinates or place names. It is rated very high for interactivity: zoom, pan, click markers for popups, toggle layers, and cluster dense markers. Two practical points from the guide matter for routing and for embedding. Base maps come from tile providers with their own usage policies, and a map embedded in a page should not capture the mouse wheel by default, because that hijacks page scrolling. The skill's shared standards say to disable scroll-wheel zoom unless it is explicitly requested.

The routing signal is that *location itself carries meaning*. If the objective would work equally well with a list of place names, a map may be overkill, as the criteria note. For example, "Locate the major shipping routes of the Hanseatic League" needs coordinates and routes, so Leaflet fits, while "List the countries in the European Union" does not need a map at all. Chapter 9 covers markers, popups, and tile sources.

!!! mascot-warning "Look-Alike Types"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A concept map is not a geographic map, and a graph is not always a chart. The words match, so a keyword alone sends people to the wrong library. Before you commit, say what the learner will *click* and what each click will *reveal*, and check that the type provides it.

### Image Overlay Type

The **Image Overlay Type** turns an illustration into an interactive MicroSim by placing clickable or hoverable labels over it. The library produces an *annotation-free* image, meaning it contains no text at all, using a text-to-image model, and a shared script draws the labels at run time from a data file. Because the words live in the data file and not in the pixels, the labels can be corrected, translated, and measured. The skill describes the resulting modes: *explore*, where hovering reveals information; *quiz*, where the learner identifies structures; and *edit*, where an instructor adjusts marker positions.

There are two engines under this type, chosen by the shape of the image. A **callout** overlay places numbered point markers with leader lines on specific structures, which suits anatomy, cell diagrams, and labeled components. A **grid** overlay places large rectangular zones, which suits comparison posters, and we treat it as its own type below.

The routing rule is where the words live. If the picture needs *names attached to parts*, use an overlay. If the picture must carry text and numbers that could be wrong, that is the verified poster instead. The skill's own contrast is that an anatomy diagram is an overlay, while an office-design poster with percentages is verified. An image overlay is also a weak choice when the visual could be drawn natively with p5.js, Chart.js, or Mermaid and has no background image, because a native drawing is cheaper and text stays editable.

A **worked example**: the objective "Identify the parts of a moss sporophyte" needs an illustration with labeled structures and a quiz, and it is the skill's own anatomy example, so route to a callout overlay. Chapter 10 teaches the data file and the image prompt.

### Grid Overlay Poster Type

The **Grid Overlay Poster Type** is the rectangular-zone form of the image overlay, designed for posters and side-by-side comparisons. Its data file lists *zones*, each a rectangle given by percentage coordinates from the top-left corner of the image (`x1`, `y1`, `x2`, `y2`), along with a summary, a list of facts, and a color. The file may also list quiz questions that ask which zone answers a question. A setting called `showLabels` controls whether a label chip appears inside each zone, and it is turned off when the image already prints its own column titles.

Why percentages? A zone stored as a percentage of the image stays aligned when the image scales to a narrow phone or a wide monitor, which supports width-responsive design (Chapter 12).

A **worked example** makes it concrete. A three-column poster compares three data-storage approaches. The data file defines three zones, each covering one column from the top of the column to the bottom, with a summary and three facts. A learner hovering over the middle column sees its facts, and a quiz question asks "Which column describes the approach with the most flexible schema?" and expects a click in the correct zone. The type is chosen because the *regions* of the image are the units of learning.

### Verified Poster Type

The **Verified Poster Type** is the route for static posters whose factual content must survive scrutiny. It differs from every other type in this chapter in that its output is a static image plus an audit trail in a `docs/posters/<slug>/` folder, not a MicroSim folder. Its guiding rule is that no claim reaches the image until it has a verified source. The guide's motivation is a cautionary observation from one session: in generating a poster on biophilic design, the guide reports that 8 of 10 numeric claims were unsupported by the sources cited, and 2 of 5 citations were fictional or misattributed. That is one observed session, cited by the guide, and not a general error rate.

Two standing policies gate the route. It is used only when a static poster was specifically requested (the static image exception), and any poster that is rendered is then wrapped in a grid overlay so that it can generate interaction events. The verification phases (claim plan, source discovery, per-claim verification, and a verification report) are reusable on their own: when an interactive MicroSim must carry real-world numbers, such as a chart of published measurements, run those phases first and carry each source identifier into the MicroSim's data file. Chapter 11 walks through the whole workflow.

A **worked example** distinguishes the cases. "A chart of enrollment figures I typed in" carries illustrative numbers and is a Chart.js MicroSim with no verification pipeline. "A printable poster of LED lighting efficiency statistics" carries empirical claims that could be wrong and was specifically requested as an image, so it is a verified poster wrapped in a grid overlay.

## Reuse Versus Build

The **Reuse Versus Build Decision** is the choice, made before routing to a new type, between embedding an existing MicroSim and generating a new one. Chapter 1 noted that MicroSims are learning objects, and the point of a learning object is reuse. Hundreds of MicroSims already exist across the author's textbooks, and the chapter-generation skill describes a catalog search that compares a new objective against them.

That skill's procedure turns the comparison into a three-way rule, based on a similarity score between your objective description and an existing MicroSim. We report the skill's thresholds as stated in the skill; they are its design and we have not tested them independently:

| Similarity score | Recommendation | What you do |
|---|---|---|
| 0.75 or higher | Reuse | Embed the existing MicroSim with an iframe and mark its status as Reused |
| 0.60 to below 0.75 | Template | Generate a new MicroSim, starting from the closest existing code |
| Below 0.60 | Generate | Specify and generate a new MicroSim |

Two cautions apply even to a high score. First, check that the existing MicroSim's grade level and subject fit your book, since a graduate-level simulation is wrong for a middle-school course. Second, a score that says "similar topic" does not say "same objective." A MicroSim about ball motion that asks learners to *label* forces cannot serve your objective to *predict* a bounce height. Compare the Bloom verb and the interaction pattern, not only the subject.

A **worked example**: you need a MicroSim to "explain how gravity changes a bounce." A search returns a bouncing-ball MicroSim with gravity and bounciness sliders, scoring above the reuse threshold. You confirm its level and its predict-first behavior, embed it with an iframe, and record it as reused, so it is never scaffolded or implemented again. If the search instead returned a pendulum lab at 0.65, you would build a new bounce lab and borrow the pendulum's slider layout as a template. Chapter 15 covers how metadata makes such a search possible.

!!! mascot-tip "Search Before You Specify"
    ![Bounce giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Before writing a new specification, write its one-sentence objective and search with that sentence. A ten-second search that finds a good match saves the generation, the testing, and the debugging.

## Practicing the Whole Process

We can now put routing, scoring, and the types together. The final MicroSim of this chapter presents objectives and asks you to choose the type and defend the choice, which is the skill the chapter's Summary promised.

#### Diagram: Choose the Type Challenge

<iframe src="../../sims/choose-the-type-challenge/main.html" width="100%" height="702px" scrolling="no"></iframe>

[Run the Choose the Type Challenge MicroSim Fullscreen](../../sims/choose-the-type-challenge/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Choose the Type Challenge</summary>
Type: microsim
**sim-id:** choose-the-type-challenge<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Evaluate; verb: justify): The learner will justify the choice of a MicroSim type for a given objective by selecting a type and a reason, and will recognize when routing is ambiguous or when reuse is preferable.

Layout: a drawing region above a control region. The top of the drawing region shows an objective card with the Bloom level and verb highlighted. Below it are 12 type buttons in a grid, one for each type discussed in this chapter, and a row of reason chips.

Data: at least 15 objective cards, each with a correct type, an acceptable alternative (or none), a reason, and a flag for whether it is ambiguous. Examples include "Analyze the prerequisites of one concept" (vis-network), "Explain how amplitude changes a sine wave" (Plotly), and "Identify the parts of a moss sporophyte" (image overlay). At least three cards are ambiguous and at least two describe an existing MicroSim that should be reused.

Controls: a type button set, reason chips ("data shape," "verb and level," "keyword," "existing MicroSim"), a "Not sure: ask a question" button, and "Next" and "Reset" buttons.

Interactions: choosing a type and a reason gives immediate feedback with the reference reasoning. On ambiguous cards, the "Not sure" button is the correct response and reveals the clarifying question. A running score shows correct choices out of attempts, and a summary at the end lists the types the learner most often confused.

Responsive design: the type-button grid reflows from four columns to two under 600 pixels, and the canvas width follows the container on window resize.

Implementation: p5.js with mouse events on custom buttons, a JSON array of cards, and a describe() call for screen readers.
</details>

!!! mascot-celebration "You Can Route an Objective"
    ![Bounce celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now take an objective, score the candidate types against the routing rubric, resolve a tie with one clarifying question, and decide whether to reuse a MicroSim or build one. That decision skill saves work in every chapter that follows.

## Chapter Summary

The key ideas of this chapter are:

- The MicroSim type catalog groups the generator skill's 17 primary generators into families such as custom simulations, quantitative data, structure and process, time and place, comparison, image-based, assessment, and verified facts.
- Type routing selects one type for one objective: restate the objective by Bloom level and verb, map it to an interaction pattern and data shape, score the candidates, and resolve ties.
- Objective-to-type mapping starts from the verb, so the action the learner performs names the type.
- Keyword routing is fast and usually right, but words such as "graph," "diagram," "map," and "table" are ambiguous and need confirmation.
- The routing rubric scores each candidate from 0 to 100 in five bands, and the scores are structured judgments, not outputs of a formula. Routing ambiguity arises when top scores are close, and one clarifying question resolves it.
- The interactive-by-default policy forbids static deliverables unless a person specifically asks for one, and the static image exception allows a static poster that must then be wrapped in an interactive overlay.
- p5.js suits custom models, Chart.js suits standard charts, Plotly suits function plots, Mermaid suits processes (with click directives), vis-network suits relationships, and causal loop diagrams suit feedback polarity.
- Venn diagrams suit overlaps among two to four sets, vis-timeline needs dates, and Leaflet needs coordinates and should not hijack page scrolling.
- Comparison tables come in a star-rating form and an expandable-matrix form; image overlays attach labels to an image through a data file; grid overlay posters use percentage rectangles; verified posters require every number to have a cited source.
- The reuse versus build decision compares a new objective against existing MicroSims, and a high similarity score still requires checking the level, subject, and interaction pattern.

The next chapter shows how AI skills and agents turn a chosen type and a specification into a working MicroSim.
