---
title: Learning Objectives and Bloom's Taxonomy
description: Teaches how to write measurable learning objectives, classify them with Bloom's 2001 Taxonomy, and apply cognitive load theory and the instructional design checkpoint before any MicroSim code is written.
generated_by: claude skill chapter-content-generator
date: 2026-09-30 10:16:41
version: 1.10
---

# Learning Objectives and Bloom's Taxonomy

## Summary

Shows how to state measurable learning objectives, classify them with Bloom's 2001 Taxonomy, and apply cognitive load theory and the instructional design checkpoint before writing any code.

The chapter connects concepts and objectives to the learning graph, then asks two design questions before generation: does the learner predict first, and what does animation add. After it, students can write an objective that a MicroSim can be built, and later measured, against.

## Concepts Covered

This chapter covers the following 25 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| Course Description | 46 |
| Concept | 3316 |
| Learning Graph | 45 |
| Concept Dependency | 13 |
| Learning Objective | 3094 |
| Measurable Objective | 902 |
| Learning Outcome | 1 |
| Bloom's Taxonomy | 1317 |
| Remember Level | 6 |
| Understand Level | 1 |
| Apply Level | 6 |
| Analyze Level | 5 |
| Evaluate Level | 4 |
| Create Level | 3 |
| Bloom Verb | 635 |
| Objective Classification | 631 |
| Cognitive Load Theory | 16 |
| Intrinsic Load | 3 |
| Extraneous Load | 3 |
| Germane Load | 1 |
| Instructional Design Checkpoint | 7 |
| Predict-First Design | 2 |
| Purpose of Animation | 1 |
| Interaction Pattern | 541 |
| Formative Assessment | 158 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: What Is a MicroSim](../01-what-is-a-microsim/index.md)

---

## Welcome

!!! mascot-welcome "Aim Before You Build"
    ![Bounce waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    A MicroSim without a clear target is a pretty toy, and a MicroSim with a measurable target is something you can check, improve and later instrument. By the end of this chapter you will be able to write an objective that an AI can build from and a learner's clicks can be judged against. Let's bounce it around!

Chapter 1 defined a MicroSim and Chapter 2 took one apart. Neither chapter asked the question that comes before any code: what, exactly, should the learner be able to do after using it? This chapter answers that question in four steps. We start with the unit of knowledge that an objective is about, the concept, and with the learning graph that organizes concepts. We then define learning objectives and make them measurable. We classify them with Bloom's 2001 Taxonomy so that each objective points toward a suitable kind of interaction. Finally we apply cognitive load theory and the instructional design checkpoint, a short set of questions that a MicroSim design must survive before generation begins.

The chapter matters for the book's central question. The course asks how well the events a MicroSim emits predict whether a learner has mastered a concept. A prediction of mastery only makes sense if the concept and the expected performance are stated first. Everything in this chapter is therefore groundwork for the evidence chapters in the second half of the book.

## Concepts and the Learning Graph

### Course Description

A **course description** is a structured document that states a course's title, audience, prerequisites, topics covered, topics excluded, and learning outcomes. It is the specification for the whole course, in the same way that a MicroSim specification is the source for one simulation. In this book the course description lives at `docs/course-description.md`. It names the audience (teachers, instructional designers, learning-technology developers and analytics practitioners), lists 21 topics, and states its learning outcomes in the form of Bloom's Taxonomy.

The course description matters to an intelligent textbook because software reads it. The book's learning graph was generated from it: an AI system extracted the concept list from the description, and the dependencies between concepts were then added and checked. A vague course description produces a vague graph, and a vague graph produces a book whose structure cannot be trusted. The project's own description was scored 98 out of 100 by the course-description-analyzer skill (version 0.04) before graph generation, and the assessment report is stored beside the graph in `docs/learning-graph/course-description-assessment.md`.

A **worked example** shows the format. The description's Learning Outcomes section is a list of 35 statements, grouped under six headings named after Bloom's levels. One of them reads "Name the six levels of Bloom's 2001 Taxonomy and the verbs associated with each." Note that this outcome begins with a verb, names an observable act, and sits under the Remember heading. Those three features, which we develop over the rest of this chapter, are what make an outcome usable by software and by a teacher.

### Concept

A **concept** is a named unit of knowledge that is small enough to be defined in a sentence and assessed on its own. "Bloom Verb" is a concept in this book. "Object-oriented programming" is too large to be one concept, because a learner could understand half of it, so a graph would split it into several. The test is whether you can imagine a learner who has mastered this concept while not yet having mastered its neighbor.

Concepts differ from learning objects, which Chapter 1 defined. A learning object is a *container* for instruction, such as a diagram, a video or a MicroSim. A concept is the *knowledge* that the container is meant to build. One MicroSim may address one concept or a small cluster, and one concept may be taught by several MicroSims. Keeping the two ideas apart is what lets a textbook say "these three MicroSims all teach the concept Routing Score," and later say "this learner's mastery of Routing Score is uncertain."

The concept is the most heavily depended-upon idea in this chapter, and the learning graph confirms it. The book's graph assigns each concept a Concept Impact Score, which is 1 plus the sum of the scores of the concepts that depend on it directly. Concept scores 3316, the third highest of the 462 concepts. The reason is structural: nearly everything downstream, including learning objectives, mastery and the events in the LRS chapters, hangs from it.

!!! mascot-thinking "One Concept, Many Containers"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Think of a concept as the thing that stays put while the MicroSims around it come and go. When you later ask whether a learner has mastered something, you are asking about the concept, and the MicroSim is only the place you looked.

### Learning Graph

A **learning graph** is a directed acyclic graph in which every node is a concept and every edge records that one concept depends on another. "Acyclic" means that following the edges can never lead back to where you started, because a concept cannot be a prerequisite of itself, however indirectly. The graph gives an intelligent textbook three things: a valid teaching order, a way to find the prerequisites a struggling learner may be missing, and a set of concept identifiers that later chapters attach evidence to.

This book's learning graph has 462 concepts and 716 dependency edges, grouped into 15 taxonomy categories. Its metadata is in `docs/learning-graph/learning-graph.json`, and the 26 chapters were assigned from it. Six concepts have no prerequisites at all: Interactive Simulation, Learning Object, Generative AI, MkDocs, Git Version Control and HTML5. These are the foundations of the book, and Chapter 1 covers all six.

The graph is the worked example that runs through this chapter, because this chapter's own 25 concepts are nodes in it. Learning Graph appears in the taxonomy category named OBJ, and its own row in the graph's CSV file is `39,Learning Graph,38|37,OBJ`. We explain that row in the next section.

### Concept Dependency

A **concept dependency** is a statement that a learner needs one concept before another, so that the second concept cannot be well understood without the first. The book records dependencies in the direction *from the dependent concept to its prerequisite*. In the CSV row above, the columns are the concept's identifier (39), its label (Learning Graph), a pipe-separated list of the identifiers it depends on (38 and 37), and its taxonomy category. Identifier 38 is Concept and 37 is Course Description. Read aloud, the row says "a learning graph depends on concepts and on the course description it was made from."

The direction is a convention chosen because standard graph algorithms for ordering and cycle detection expect it. Some systems draw the opposite direction, from prerequisite to enabled concept. Mixing the two silently reverses every dependency, so chapter-generation tools check the direction before using the graph: the concepts with no prerequisites must be simple introductory ones, and in this book they are the six foundations listed above.

The following diagram lets you trace dependencies among the concepts of this chapter. Before you use it, note the three terms it shows. A *prerequisite* is a concept the selected concept depends on. A *dependent* is a concept that depends on the selected one. A *Concept Impact Score* is the recursive importance measure defined above.

#### Diagram: Objectives Neighborhood of the Learning Graph

<iframe src="../../sims/objectives-graph-neighborhood/main.html" width="100%" height="604px" scrolling="no"></iframe>

[Run the Objectives Neighborhood of the Learning Graph MicroSim Fullscreen](../../sims/objectives-graph-neighborhood/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Objectives Neighborhood of the Learning Graph</summary>
Type: diagram
**sim-id:** objectives-graph-neighborhood<br/>
**Library:** vis-network<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: differentiate): The learner will differentiate the prerequisites of a concept from its dependents by exploring a small neighborhood of the book's learning graph, and will explain why a concept with many dependents deserves more careful teaching.

Data: the 26 concepts of taxonomy category OBJ plus their direct prerequisites and dependents, read from `docs/learning-graph/learning-graph.json` at load time. Node size is proportional to the logarithm of the Concept Impact Score. Edges point from dependent to prerequisite, and an arrowhead at the prerequisite end is labeled "depends on" in the legend.

Interactions: clicking a node highlights its direct prerequisites in green and its direct dependents in orange, and opens an information panel that shows the concept's definition, its Concept Impact Score, and its two lists. Hovering a node shows a tooltip with the score. A toggle "Show transitive dependents" extends the orange highlight to every concept that depends on the selected one through any path. A "Check me" button hides the highlight and asks the learner to click every prerequisite of a randomly chosen concept, then scores the answer.

Layout: the network fills the left two thirds, with the information panel on the right. Physics is disabled and nodes use a stored left-to-right layout so that prerequisites sit to the left.

Responsive design: the network re-fits to the container width on every window resize, and the information panel moves below the network when the width is under 600 pixels.

Implementation: vis-network with nodes and edges loaded from the learning graph JSON file, and click, hover and toggle handlers as described.
</details>

## Learning Objectives

### Learning Objective

A **learning objective** is a statement of what a learner will be able to do after an instructional experience, written from the learner's point of view. It has three parts: an actor (the learner), an action that can be performed, and a subject matter, which is a concept. Every MicroSim in this book must carry one, because the objective is what tells an AI what to build and tells a reviewer whether the result succeeded.

The learning objective is second only to Concept in this chapter's dependency structure. It ranks fourth of the 462 concepts in the graph, with a Concept Impact Score of 3094, and it has seven direct dependents in the graph, including Measurable Objective, Bloom's Taxonomy, Formative Assessment and the Specification Block that Chapter 5 uses to instruct AI skills. The reason is that everything that follows a design decision, from generation to evidence, refers back to the objective.

An objective differs from a topic. "Gravity" is a topic. "Explain how gravity changes a falling ball's motion" is an objective, because it says what the learner does with the topic. An objective also differs from an activity. "Move the gravity slider" describes what the learner does with the tool. It is a step toward an objective, not the objective itself.

### Learning Outcome

A **learning outcome** is what a learner can actually do after instruction, as observed in their performance, whereas an objective is what the designer intends. The distinction is small but real. The designer writes the objective in advance, and the outcome is discovered afterward through assessment. In this book, the difference is the difference between a design and a measurement, and later chapters rely on it: the xAPI events describe outcomes as they happen, and the objective is the yardstick they are compared with. Some authors use the two words interchangeably, and the course description itself uses "Learning Outcomes" as the heading for its intended competencies. We use the narrower sense only when the difference matters.

### Measurable Objective

A **measurable objective** is a learning objective whose success can be decided by observing something the learner does, under stated conditions and against a stated standard. The verbs "understand," "know," "appreciate" and "be aware of" fail this test, because no observation distinguishes a learner who understands from one who does not. The verbs "explain," "calculate," "classify" and "design" pass it, because each names an act whose result a reviewer, a quiz or a program can inspect.

Measurability is what connects this chapter to the rest of the book. A program can only judge an interaction as evidence of mastery if it knows what performance counts. An objective such as "the learner will understand gravity" gives an event stream nothing to be compared with. An objective such as "the learner will predict whether the ball's second bounce is higher or lower after gravity increases, correctly on three of four trials" does.

A **worked example** shows the repair of a weak objective. Suppose a designer starts from the phrase "Students will understand bouncing balls." We improve it in three steps:

1. Replace the unobservable verb "understand" with an observable one. The designer wants the learner to give reasons, so "explain" fits: "Students will explain how bouncing balls move."
2. Name the concept precisely, so the objective can be attached to a node in the learning graph: "Students will explain how gravity and bounciness change a ball's motion."
3. State the condition and the standard, so that success is decidable: "After using the simulation, students will explain, in one sentence for each of two sliders, how changing that slider alters the ball's height on the next bounce."

The final objective still names an actor, an action, a concept and a way to check. It is also the objective that Chapter 1's Bouncing Ball Gravity Lab specification was written toward, in slightly shorter form. The specification says "The learner will explain how changing gravity and bounciness changes the motion of a falling ball, by predicting an outcome and then testing it."

!!! mascot-tip "The Quiz-Item Test"
    ![Bounce giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Before you accept an objective, try to write one quiz question that would show whether it was met. If you cannot write the question, the verb is not observable yet, so swap it for one you could grade.


Before you rewrite objectives yourself, the next specification gives you a place to practice. Its terms are the ones defined above: an *actor*, an *action*, a *concept*, and a *condition and standard*.

#### Diagram: Objective Rewriter Workbench

<iframe src="../../sims/objective-rewriter-workbench/main.html" width="100%" height="597px" scrolling="no"></iframe>

[Run the Objective Rewriter Workbench MicroSim Fullscreen](../../sims/objective-rewriter-workbench/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Objective Rewriter Workbench</summary>
Type: microsim
**sim-id:** objective-rewriter-workbench<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Apply; verb: use): The learner will use the actor, action, concept and condition-and-standard checklist to repair a weak learning objective until every part is present and the verb is observable.

Layout: a drawing region above a control region, following the standard MicroSim layout. The drawing region shows the current objective as a sentence split into four colored slots (actor, action, concept, condition and standard). An empty slot is drawn with a dashed outline and a red label. The control region holds the controls.

Data: eight weak objectives, for example "Students will understand bouncing balls", "Learners will know the parts of a MicroSim" and "Students will be aware of xAPI". Each has a stored model repair and a list of acceptable observable verbs.

Controls:

- Button "Next weak objective" that loads the next of the eight
- A dropdown of 24 verbs, each labeled with its Bloom level, that replaces the action slot
- A text field for the concept slot, which turns green when it matches a concept label from the learning graph and amber otherwise
- Buttons "Add condition" and "Add standard" that open short pick-lists of conditions and standards
- Button "Check" that scores the repair and shows the stored model repair beside the learner's version

Interactions: hovering a slot shows a one-sentence explanation of what the slot requires. Choosing an unobservable verb such as "understand" flashes the action slot and shows the message "No observation separates a learner who does this from one who does not."

Responsive design: the canvas width follows the container width on every window resize, slots wrap onto a second line below 500 pixels, and the controls remain visible at 400 pixels wide.

Implementation: p5.js with createSelect, createInput and createButton controls positioned relative to drawHeight, and a describe() call for accessibility.
</details>

## Bloom's Taxonomy and the Six Levels

### Bloom's Taxonomy

**Bloom's Taxonomy** is a framework for classifying learning objectives by the kind of thinking they demand of the learner. It began with a 1956 classification by Benjamin Bloom and colleagues and was revised in 2001 by Lorin Anderson, David Krathwohl and colleagues. This book uses the 2001 revision, which names its six levels with verbs: Remember, Understand, Apply, Analyze, Evaluate and Create. The revision also placed Create, the production of something new, above Evaluate.

The levels run from simpler to more complex cognitive processes. It is safe to treat the order as a guide to difficulty, but it is not a rigid staircase. A learner can often apply a procedure they cannot yet explain, and a beginner can sometimes evaluate a simple case correctly. What the taxonomy gives a designer is a vocabulary for saying *which kind of thinking* an objective requires, and therefore which kind of MicroSim could practice it.

The taxonomy is at the center of this chapter for a practical reason. It ranks ninth of the 462 concepts in the graph, with a Concept Impact Score of 1317, because Bloom Verb, Objective Classification and the educational metadata of a MicroSim all depend on it directly. The course description also follows it: its 35 learning outcomes are grouped under six headings, one per level, with six outcomes each except Create, which has five.

The table below summarizes the six levels. It previews terms that the next six subsections define one at a time, so read it as a map of what is coming and return to it afterward. Each example is an outcome from this book's course description, abridged where noted.

| Level | The learner... | Example outcome from this book (abridged) |
|---|---|---|
| Remember | recalls facts and terms | Name the six levels of Bloom's 2001 Taxonomy |
| Understand | explains or interprets an idea | Explain why one concept identifier per statement matters for mastery estimation |
| Apply | uses knowledge in a new situation | Use an AI skill to generate a MicroSim of the type recommended by the routing rubric |
| Analyze | breaks a whole into parts and relates them | Break a learning objective into concepts |
| Evaluate | judges against criteria | Judge a MicroSim against its stated learning objective |
| Create | produces something new | Design an original MicroSim that pairs an interaction pattern with a measurable learning objective |

#### Diagram: Bloom Level Ladder

<iframe src="../../sims/bloom-level-ladder/main.html" width="100%" height="522px" scrolling="no"></iframe>

[Run the Bloom Level Ladder MicroSim Fullscreen](../../sims/bloom-level-ladder/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Bloom Level Ladder</summary>
Type: infographic
**sim-id:** bloom-level-ladder<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Understand; verb: summarize): The learner will summarize what each of the six Bloom levels asks of a learner and name one kind of MicroSim interaction that suits it.

Layout: six horizontal bars stacked like a ladder, with Remember at the bottom and Create at the top, each in a different color. The drawing region is aliceblue and the control region is white.

Interactions: hovering a bar shows a tooltip with the level's one-line definition. Clicking a bar opens a panel on the right listing that level's eight action verbs from the canonical verb list, one example outcome from the course description, and one example interaction pattern. A "Compare two levels" mode lets the learner click two bars and shows their verb lists side by side with the overlapping verbs highlighted in yellow.

Controls: a checkbox "Show verbs on bars", a button "Random level quiz" that shows a verb and asks which level it belongs to, and a score counter.

Responsive design: the ladder re-scales to the container width on every window resize, and the panel moves under the ladder below 600 pixels.

Implementation: p5.js with rectangles, mouse hit testing and a DOM panel, plus a describe() call for accessibility.
</details>

### Remember Level

The **Remember level** covers objectives in which the learner retrieves a fact, term or list from memory. Typical verbs are define, list, recall, identify, name, recognize, locate and describe. The performance is exact: the learner either produces the right item or does not.

A **worked example** turns a course outcome into a testable item. The outcome "State the four parameters of a Bayesian knowledge tracing model" becomes the question "Name the four parameters", with the acceptable answers initial knowledge, learning, guess and slip. Notice that the verb, the quantity (four) and the scoring rule are all present. Remember-level objectives suit flash cards, matching, labeling and ordering tasks, because those tasks demand exact retrieval and give immediate right-or-wrong feedback. Recall is essential, but it is a weak indicator of deeper mastery, so a MicroSim designed only at this level should say so.

### Understand Level

The **Understand level** covers objectives in which the learner builds meaning: explaining, summarizing, interpreting, classifying, comparing or inferring. The learner must say something in their own words or apply a category to a new example, so a memorized phrase is not enough.

Understand-level objectives are the most common source of weak wording, because the level's name is also the most overused verb. "Understand gravity" fails the measurability test, while "explain how gravity changes a ball's motion" passes it and sits at exactly this level. The interaction patterns that work here show concrete data and let the learner predict outcomes, which the instructional design checkpoint later in this chapter makes precise.

### Apply Level

The **Apply level** covers objectives in which the learner uses a known procedure or idea in a situation they have not seen before. Typical verbs are use, execute, implement, solve, demonstrate and calculate. The new situation is the point. If the learner meets the very example they were taught, they are recalling and not applying.

A **worked example** comes from the course description: "Use an AI skill to generate a MicroSim of the type recommended by the routing rubric." The learner is given a new learning objective, consults the rubric of Chapter 4, and runs the skill of Chapter 5. Success can be checked by inspecting the MicroSim produced. Apply-level objectives suit parameter explorers, calculators and scenario simulators, in which the learner sets inputs and gets a result they had to predict or produce.

### Analyze Level

The **Analyze level** covers objectives in which the learner breaks a whole into parts and works out how the parts relate. Typical verbs are differentiate, organize, attribute, examine, deconstruct and distinguish, and compare and contrast also appear here. Analysis differs from understanding because the learner must find structure that was not handed to them.

The course description gives a worked example that this chapter itself practices: "Break a learning objective into concepts and decide which MicroSim interactions provide evidence for each." Take the objective from earlier, "explain how gravity and bounciness change a ball's motion." It breaks into at least two concepts, gravity as a downward acceleration and bounciness as retained speed, and each suggests a different observable interaction. The learner who does this is analyzing. Network explorers, comparison matrices and pattern finders suit this level, because they let the learner see relationships directly.

### Evaluate Level

The **Evaluate level** covers objectives in which the learner makes a judgment against stated criteria and defends it. Typical verbs are judge, critique, assess, justify, prioritize, recommend, validate and defend. Without criteria, a judgment is only an opinion, so an Evaluate-level objective must supply or ask for the criteria. The course description's outcome "Judge a MicroSim against the quality score and against its stated learning objective" supplies both. Sorting, ranking and rubric-rating activities suit this level, and they must give feedback on the reasons, not only on the final choice.

### Create Level

The **Create level** covers objectives in which the learner produces something new by combining elements: design, construct, develop, formulate, compose, produce, invent and generate. The product cannot be graded as right or wrong in the same way as lower levels, so a rubric is needed. The outcome "Design an original MicroSim that pairs an interaction pattern with a measurable learning objective and a plan for the evidence it will produce" is the book's capstone in one sentence. Builders, editors and canvas tools suit this level, and they should leave the learner free to choose, instead of pouring their work into a rigid template.

!!! mascot-thinking "Level Names Are Not Verbs to Copy"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Notice that the level named Understand is not a good verb for an objective, even though it names a real kind of thinking. You write the objective with a verb that shows the thinking, such as explain or classify, and let the level be the label you attach afterward.

## Bloom Verbs and Objective Classification

### Bloom Verb

A **Bloom verb** is the action verb that opens a learning objective and signals which Bloom level the objective aims at. Verbs are useful because they are the most visible part of an objective, and because they can be listed. The book's canonical list gives eight verbs for each level.

| Level | Bloom verbs |
|---|---|
| Remember | list, define, recall, identify, name, recognize, locate, describe |
| Understand | explain, summarize, interpret, classify, compare, contrast, exemplify, infer |
| Apply | use, execute, implement, solve, demonstrate, calculate, apply, practice |
| Analyze | differentiate, organize, attribute, compare, contrast, examine, deconstruct, distinguish |
| Evaluate | judge, critique, assess, justify, prioritize, recommend, validate, defend |
| Create | design, construct, develop, formulate, compose, produce, invent, generate |

Two features of the table deserve attention. First, the verbs "compare" and "contrast" appear at both Understand and Analyze. Second, the book's fuller guidance for writing questions lists still more verbs, such as describe, identify and recognize, under Understand as well as Remember. The lists are aids to memory, not a dictionary that assigns each word to one level.

A **worked example** shows how one concept can be taught at every level by changing the verb and the task. The concept is bounciness, defined in Chapter 1 as the fraction of speed a ball keeps after hitting the floor.

| Level | Verb | Objective about bounciness |
|---|---|---|
| Remember | define | Define bounciness as the fraction of speed a ball keeps after a bounce |
| Understand | explain | Explain why a ball with lower bounciness reaches a lower height on its next bounce |
| Apply | predict | Predict the next bounce height when the learner is given a new bounciness value |
| Analyze | differentiate | Differentiate the effects of gravity and of bounciness on how quickly the bounces die away |
| Evaluate | justify | Justify whether the slider range of 0.3 to 0.95 suits the intended learners |
| Create | design | Design a new simulation that lets a learner discover how bounciness affects bounce height |

Notice that the concept never changes while the demand on the learner grows. Each row could be assessed differently, and each suggests a different MicroSim. The Remember row needs a flash card, the Apply row a parameter explorer, and the Create row a builder. This mapping from level to interaction is the subject of the Interaction Pattern section later in this chapter.

!!! mascot-warning "A Verb Is a Clue, Not a Verdict"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Watch out for classifying an objective by its first word alone. The same verb can sit at two levels, so check what the learner must actually do, and if two levels seem right, choose the more demanding one the task truly requires.

### Objective Classification

**Objective classification** is the practice of assigning each learning objective to one Bloom level. In this book it is a design step with a purpose: the level chosen determines which interaction patterns are appropriate, how the objective is assessed, and later which events count as evidence. A classification that is wrong quietly sends the design in the wrong direction.

Because verbs overlap, classification needs a procedure. The following three-step procedure is the one this book uses.

1. Find the verb and note the level or levels it suggests.
2. Ask what the learner must do with the content: retrieve it, construct meaning from it, use it in a new case, take it apart, judge it against criteria, or produce something new.
3. If two levels remain plausible, choose the level of the most demanding process that the task truly requires, and record the reason.

The objective classification concept ranks close behind Bloom Verb in the graph, with a Concept Impact Score of 631, because the interaction pattern of every MicroSim depends on it directly. In the graph it depends on three prerequisites: Bloom's Taxonomy, Learning Objective and Bloom Verb.

A **worked example** applies the procedure to four outcomes from the course description. The last one is deliberately hard.

| Outcome (abridged) | Verb suggests | The learner must | Classification |
|---|---|---|---|
| List the MicroSim types in the catalog and the library each uses | Remember | Retrieve a list | Remember |
| Summarize the differences between the full LRS and LRS-Lite | Understand | Restate differences in their own words | Understand |
| Search the MicroSim index for an existing example and reuse or adapt it | Apply | Use a tool on a new need | Apply |
| Distinguish claims that have been measured from those that are only designed or hoped for | Analyze | Judge each claim against evidence criteria | Evaluate |

The course description places the last outcome under Evaluate, although "distinguish" appears in the Analyze verb list. The reasoning is that the learner does more than separate parts. They must judge the strength of evidence behind each claim, and judgment against criteria is the Evaluate process. A reasonable reviewer could argue for Analyze, which is exactly why step 3 asks you to record the reason. Classification is a design judgment with a paper trail, not a lookup.

The sorter below lets you practice on a larger set, with feedback that explains each answer instead of only marking it right or wrong.

#### Diagram: Bloom Objective Sorter

<iframe src="../../sims/bloom-objective-sorter/main.html" width="100%" height="562px" scrolling="no"></iframe>

[Run the Bloom Objective Sorter MicroSim Fullscreen](../../sims/bloom-objective-sorter/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Bloom Objective Sorter</summary>
Type: microsim
**sim-id:** bloom-objective-sorter<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Apply; verb: demonstrate): The learner will demonstrate the three-step objective classification procedure by sorting real course-description outcomes into the six Bloom levels and giving a reason for each placement.

Layout: an objective card at the top of the drawing region and six labeled bins (Remember through Create) in two rows of three below it. The control region holds the buttons and score.

Data: 24 outcomes taken from `docs/course-description.md`, four per level, each stored with its official level, a rationale sentence, and a flag "ambiguous" for cases such as the "Distinguish claims..." outcome.

Interactions: the learner drags the card into a bin or clicks a bin. After the drop, the sim shows the verb highlighted in the sentence, the official level, and the rationale. For ambiguous cards the sim accepts the neighboring level as "defensible" and asks the learner to choose one of two written reasons. A step-through mode reveals the three procedure steps one at a time before the drop.

Controls: buttons "Next card" and "Restart", a checkbox "Show the procedure", and a score line showing correct, defensible and missed placements.

Responsive design: the canvas width follows the container width on every window resize, the bins re-flow to two columns under 500 pixels, and all controls remain visible at 400 pixels wide.

Implementation: p5.js drag-and-drop with a describe() call for accessibility, following the concept-classifier pattern used elsewhere in the book.
</details>

## Interaction Patterns and Formative Assessment

### Interaction Pattern

An **interaction pattern** is a reusable way in which a learner acts on a MicroSim and receives feedback, such as flipping a card, moving a slider, sorting items into bins, clicking a node, or arranging blocks. Patterns matter because they determine what a learner can *do* inside the simulation, and therefore what a learner's actions can reveal about their thinking.

The link to Bloom's Taxonomy is direct. An objective at one level is served by some patterns and undermined by others. A Remember-level objective served by an elaborate simulation wastes the learner's attention, while a Create-level objective served by a flash card cannot be achieved at all. The instructional design checkpoint of the book's generation skill contains a table that makes the match explicit, and the table below reproduces its content.

| Bloom level | Appropriate patterns | Inappropriate patterns |
|---|---|---|
| Remember | Flashcards, matching, labeling | Complex simulations |
| Understand | Step-through worked examples, concrete data visibility | Continuous animation, particle effects |
| Apply | Parameter sliders, calculators, practice problems | Passive viewing only |
| Analyze | Network explorers, comparison tools, pattern finders | Pre-computed results |
| Evaluate | Sorting and ranking activities, rubric tools | No feedback mechanisms |
| Create | Builders, editors, canvas tools | Rigid templates |

This is where objective classification pays off. Interaction Pattern has a Concept Impact Score of 541 and depends on Objective Classification and on Interactive Simulation in the learning graph. Chapter 4 extends the idea: its routing rubric maps an objective to a MicroSim *type* and library, and the interaction pattern is one of the inputs to that decision.

A **worked example** uses the bounciness objectives from earlier. For the Understand objective "explain why a ball with lower bounciness reaches a lower height on its next bounce," the table recommends a step-through with concrete data. A design might show one bounce at a time, with the speed before and after the bounce written as numbers, and a Next button that advances one step. For the Apply objective "predict the next bounce height for a new bounciness value," the table recommends parameter sliders and practice problems. The design might give a slider, hide the result, ask for the learner's estimate, and only then show the bounce.

There is a second reason to care. Each pattern produces a different kind of event when instrumented, and Chapter 16 develops which events count as evidence. A flip of a flash card says little about understanding. A predicted value compared with the actual value says much more. Choosing the pattern is therefore the first decision that shapes the evidence a MicroSim can ever produce.

#### Diagram: Bloom-to-Pattern Matrix

<iframe src="../../sims/bloom-to-pattern-matrix/main.html" width="100%" height="642px" scrolling="no"></iframe>

[Run the Bloom-to-Pattern Matrix MicroSim Fullscreen](../../sims/bloom-to-pattern-matrix/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Bloom-to-Pattern Matrix</summary>
Type: infographic
**sim-id:** bloom-to-pattern-matrix<br/>
**Library:** Custom HTML table with JavaScript<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: differentiate): The learner will differentiate appropriate from inappropriate interaction patterns for each Bloom level and explain why a mismatched pattern fails.

Layout: a grid with six rows (Bloom levels) and three columns (appropriate patterns, inappropriate patterns, example MicroSim from this book). Each cell holds clickable chips, green for appropriate and red for inappropriate.

Interactions: clicking a chip opens a detail panel with a one-paragraph explanation, a small sketch of the pattern, and the reason it suits or fails the level. Hovering a row highlights it and shows the level's verb list in a tooltip. A "Mismatch detective" mode shows a short MicroSim description, such as "a particle animation that plays continuously to teach an explanation", and asks the learner to click the row and chip it violates.

Controls: buttons "Reset", "Mismatch detective" and "Show answers", and a running score.

Responsive design: the grid collapses to a stacked list of six cards under 600 pixels, and the detail panel moves below the grid. All content re-fits on window resize.

Implementation: HTML table generated from a JSON array, with click and hover handlers and no external library.
</details>

### Formative Assessment

A **formative assessment** is a check of understanding made *during* learning, whose purpose is to guide the next step for the learner and the designer, not to assign a grade. A short quiz after a MicroSim, a prediction the learner commits to before a run, and a sorting task are all formative assessments. They differ from summative assessments, such as a final exam, which certify what was learned at the end.

The concept is important in this book. It ranks well above the average concept in the graph, with a Concept Impact Score of 158, and it depends directly on Learning Objective. Three later concepts depend directly on it: Quiz Mode, Assessment Evidence and Held-Out Assessment. The last one names the assessment used in Chapter 19 to test whether xAPI events predict mastery, so formative assessment is the bridge between this chapter's design questions and the book's evaluation question.

The dependency on the learning objective is the key idea. A formative assessment item is only meaningful if it targets a stated objective at the intended level. An item that checks recall cannot tell you whether an Apply objective was met. A **worked example** makes this concrete. For the Apply objective "predict the next bounce height for a new bounciness value," a well-aligned formative item is a prediction task with a numerical answer and a tolerance. A poorly aligned item is the multiple-choice question "What is bounciness?", which checks only Remember.

Formative assessment is also where a MicroSim can generate its own evidence. If the simulation asks for a prediction and records the answer along with the actual outcome, that record is a formative assessment as well as an interaction. Whether such records actually predict a later measure of mastery is the central research question of the book. As of this writing no learner data has been collected through MicroSims 2.0, so the relationship is a hypothesis, and Chapters 18 and 19 describe how it would be tested.

!!! mascot-tip "Design the Check Before the Activity"
    ![Bounce giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    When you write an objective, write the formative item beside it in the same sitting. If the item does not match the verb, one of the two is wrong, and it is far cheaper to fix a sentence now than a finished MicroSim later.

## Cognitive Load and the Instructional Design Checkpoint

### Cognitive Load Theory

**Cognitive load theory**, developed by John Sweller and colleagues, holds that a learner's working memory, the small mental workspace used to hold and manipulate information, is severely limited, and that instruction works best when it does not overload that workspace. The theory has a practical consequence for MicroSim designers. Every slider, label, animation and sentence competes for the same limited attention, so each element must justify what it costs.

The theory distinguishes three kinds of load, which we define next. The Educational MicroSims Design Framework in this project's paper builds its interface conventions on all three: consistent control placement, predictable interaction, and the removal of decoration that does not serve the objective.

A **worked example** shows why the distinction matters. Suppose two designers build a simulation for the same objective, "explain how gravity and bounciness change a ball's motion." Designer A gives the learner two sliders, a labeled readout, and a start button. Designer B gives twelve sliders that include air drag, ball mass and floor friction, adds a glowing particle trail, and puts the instructions in a paragraph beside the canvas. Designer B's simulation is richer, but the learner must decide which of twelve controls matter, look back and forth between the paragraph and the drawing, and ignore the particles. Most of that effort has nothing to do with gravity or bounciness. Designer A leaves the learner's attention for the concept.

### Intrinsic Load

**Intrinsic load** is the load imposed by the difficulty of the material itself, determined by how many elements the learner must hold in mind at once and how much they interact. Explaining bounce height requires holding two interacting quantities, gravity and bounciness, so its intrinsic load is moderate. Adding air drag would raise it. A designer cannot remove intrinsic load without changing the concept, but can manage it by splitting a concept into stages, by matching parameter ranges to the learner's expertise, and by introducing one variable at a time.

### Extraneous Load

**Extraneous load** is the load caused by the way information is presented, when that load does not contribute to learning. Decorative effects, inconsistent control positions, unclear labels and text that sits far from the diagram it describes all add extraneous load. This is the kind of load a designer can and should reduce, and the paper's framework does so through a fixed layout with all controls in one region below the drawing.

!!! mascot-warning "Decoration Is Not Free"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A common trap is adding a particle trail or a sound because AI makes it cheap to generate. Every extra effect spends the learner's attention, so keep it only if you can say what it teaches, and otherwise delete it.

### Germane Load

**Germane load** is the effort a learner spends on building and organizing knowledge, the mental work of making sense of the material. It is the load that a designer wants to *encourage*. The paper's framework promotes it through analogies, real-world connections, and consistency across simulations. A prediction prompt is another example: asking the learner to commit to an answer before the result appears invites exactly this effort.

A caution is appropriate. Some researchers have questioned whether germane load is a separate kind of load, arguing that it is better seen as the portion of intrinsic load that a learner successfully devotes to the task. We use the three-part vocabulary because it is a useful design checklist, and we do not claim that the three loads can be measured separately from a MicroSim's event stream.

The table below summarizes the three loads for a MicroSim designer.

| Load | Source | Designer's stance | Example lever |
|---|---|---|---|
| Intrinsic | The concept itself | Manage | Introduce one variable at a time |
| Extraneous | The presentation | Reduce | Keep controls in one region, remove decoration |
| Germane | The learner's sense-making | Encourage | Ask for a prediction before the result |

#### Diagram: Cognitive Load Balance Lab

<iframe src="../../sims/cognitive-load-balance-lab/main.html" width="100%" height="627px" scrolling="no"></iframe>

[Run the Cognitive Load Balance Lab MicroSim Fullscreen](../../sims/cognitive-load-balance-lab/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Cognitive Load Balance Lab</summary>
Type: microsim
**sim-id:** cognitive-load-balance-lab<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: differentiate): The learner will differentiate the design features that add intrinsic, extraneous and germane load by toggling features on a mock MicroSim and observing a qualitative load gauge.

Layout: the drawing region shows a small mock of a bouncing-ball MicroSim on the left and a stacked horizontal bar on the right with three segments labeled Intrinsic, Extraneous and Germane, plus a marker for a "comfortable capacity" line. The control region holds the feature toggles.

Controls:

- Slider "Number of variables" from 1 to 6, default 2 (raises intrinsic load)
- Checkboxes "Decorative particle trail", "Sound effects" and "Instructions far from the drawing" (each raises extraneous load)
- Checkboxes "Prediction prompt before each run" and "Ask for a one-sentence explanation" (each raises germane load)
- Button "Reset to Designer A" and button "Set to Designer B" that load the two designs from the worked example

Behavior: the bar segments are computed from fixed illustrative weights, and a caption states that the gauge is a teaching illustration and not a measurement of any real learner. When the total passes the capacity line, the bar turns amber and a message names the largest extraneous contributor.

Responsive design: the canvas width follows the container width on every window resize, the mock and the bar stack vertically under 500 pixels, and all controls remain visible at 400 pixels wide.

Implementation: p5.js with createSlider and createCheckbox controls positioned relative to drawHeight, and a describe() call for accessibility.
</details>

### Instructional Design Checkpoint

The **instructional design checkpoint** is a mandatory short review that the MicroSim generation skill performs before it writes any JavaScript. It has three parts. The skill extracts the objective's Bloom level, Bloom verb and full statement from the specification. It matches the level to an interaction pattern using the table shown earlier. Then it answers four questions:

1. What specific data must the learner see? The answer must be concrete, such as the array of words after tokenizing a sentence, and not a vague phrase such as animated particles.
2. Does the learner need to predict before observing? If so, a step-through with Next and Previous buttons is used and continuous animation is not.
3. What does animation add that static arrows do not? If the answer is not clear, animation is not used.
4. Is continuous animation appropriate for this Bloom level? For an Understand objective with the verb "explain" the skill treats it as almost always inappropriate, while for an Apply objective with real-time feedback it is often appropriate.

If a specification asks for animation on an Understand objective, the skill flags a possible instructional design issue, recommends a step-through, and asks the author whether to proceed with the step-through instead. It then records its decision in a short block naming the Bloom level, the Bloom verb, the recommended pattern, whether the specification was aligned or modified, and the rationale. The checkpoint depends directly on Objective Classification and Cognitive Load Theory, and it has a Concept Impact Score of 7.

A **worked example** uses the Bouncing Ball Gravity Lab specified in Chapter 1 as a test case. The illustration below is the chapter author's application of the checkpoint to that specification, and not a record of an actual generation run.

```text
Instructional Design Check:
- Bloom Level: Understand
- Bloom Verb: explain
- Recommended Pattern: step-through with concrete data, gated by a prediction
- Specification Alignment: partly aligned; the ball animates continuously
- Rationale: an "explain" objective is served by seeing the numbers change
  one bounce at a time; the Predict-first option already in the specification
  helps, but the continuous fall lets the learner watch without predicting.
```

Notice how the answers to the four questions produce that decision. Question 1 is met, because the specification includes a readout of height and speed. Question 2 is answered yes, because the objective says "by predicting an outcome and then testing it." Question 3 has a partial answer: motion over time is the phenomenon, so some animation is defensible. Question 4 raises the flag. The likely remedy is a "Next bounce" step mode that advances one bounce, shows the speed before and after as numbers, and keeps the continuous animation as an optional view. The point of the checkpoint is that this conversation happens before code exists.

!!! mascot-tip "Answer Question 3 in Writing"
    ![Bounce giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    If you cannot finish the sentence "the animation shows ___, which an arrow cannot," remove the animation. Writing the sentence down takes one minute and often saves an hour of effects nobody needed.

### Predict-First Design

**Predict-first design** is the practice of asking the learner to commit to a prediction before the MicroSim reveals what happens. The learner sees the setup, states or selects an expected outcome, and only then runs the simulation. The comparison between the prediction and the result is where much of the learning takes place, because a wrong prediction exposes a mistaken mental model that passive watching would leave hidden.

The idea has a home in the project's design framework. The framework describes the PRIMM method (Predict, Run, Investigate, Modify, Make) as the pattern behind each MicroSim's lesson plan, which begins with the learner predicting what will happen. Chapter 24 returns to PRIMM in its treatment of pedagogy. For the checkpoint, the practical rule is the one above: if the learner must predict, use a step-through and hold back the result until the prediction is recorded. The "Predict first" checkbox in Chapter 1's bouncing-ball specification is an example.

Predict-first also has a second role in this book. A recorded prediction and the actual outcome form a pair that a program can compare, which makes the prediction a candidate piece of evidence about mastery. We treat that as a design hypothesis, since no MicroSim has yet produced learner data to test it.

### Purpose of Animation

The **purpose of animation** is the specific instructional job that a moving element does, stated in a sentence. It is the answer to checkpoint question 3, and it is where extraneous load usually enters a design. An animation earns its place when the concept itself involves change over time or a sequence in which order matters, and when static arrows or labels cannot carry that information. A ball's height falling and rising is such a case. A sparkle when a button is clicked is not.

A short **worked example** applies the test to two proposed animations in a MicroSim about a network of concepts. Proposal 1 draws a pulse moving along an edge from prerequisite to dependent, to show the order in which a learner should study concepts. The purpose is stated clearly, and a static arrow shows direction but not order, so the animation passes. Proposal 2 makes every node bounce gently at all times. No sentence explains what that shows, and it competes with the reader's attention, so it fails and should be removed.

The project's design framework also describes a *semantic wave*, in which MicroSims unpack an abstract idea into a concrete interactive experience and then repack it into a general understanding. Animation that supports the concrete phase can help, but animation that never leads back to the abstract idea leaves the learner at the bottom of the wave. Chapter 24 covers semantic waves in detail.

#### Diagram: Instructional Design Checkpoint Navigator

<iframe src="../../sims/design-checkpoint-navigator/main.html" width="100%" height="682px" scrolling="no"></iframe>

[Run the Instructional Design Checkpoint Navigator MicroSim Fullscreen](../../sims/design-checkpoint-navigator/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Instructional Design Checkpoint Navigator</summary>
Type: workflow
**sim-id:** design-checkpoint-navigator<br/>
**Library:** Mermaid with a click directive on every node<br/>
**Status:** Specified

Learning objective (Bloom level: Apply; verb: execute): The learner will execute the instructional design checkpoint on a supplied MicroSim specification, reaching a recorded decision about interaction pattern, prediction and animation.

Nodes: Extract objective, Identify Bloom level and verb, Match interaction pattern, Q1 Data the learner must see, Q2 Must the learner predict first, Use step-through with Next and Previous, Q3 What animation adds, Remove animation, Q4 Animation suitable for this level, Flag and recommend step-through, Record the decision. Edges are labeled yes or no where the flow branches.

Interactions: every node has a click directive that opens an information panel with the node's definition and one example. A "Try a specification" mode loads one of four sample specifications and asks the learner to click through the path they would take, then compares the path with the recommended one and displays the completed decision block.

Responsive design: the diagram scales to the container width on every window resize, and the information panel moves below the diagram under 600 pixels.

Implementation: Mermaid flowchart with click callbacks that populate the information panel, and a small JavaScript quiz layer for the sample specifications.
</details>

## Putting the Chapter to Work

The pieces in this chapter form a single sequence, and it is worth stating that sequence plainly before we close. A designer starts from a **concept** in the learning graph, writes a measurable **learning objective** for it, classifies the objective by Bloom level using its **verb** and the task, and chooses an **interaction pattern** that suits the level. The designer then runs the **checkpoint**: how much load will this design impose, does the learner predict first, and does each animation have a purpose. Only then is the specification handed to a generation skill, and only then is a **formative assessment** written to check whether the objective was met.

The order is deliberate. Each step narrows the next one, so an error at the top costs the most. A vague objective yields an arbitrary pattern, and an arbitrary pattern yields a MicroSim whose events cannot be interpreted. Later chapters keep returning to this chain: Chapter 4 routes an objective to a MicroSim type, Chapter 5 turns the design into a specification for AI skills, and Chapters 16 through 19 ask what evidence the finished MicroSim produces about the concept.

!!! mascot-celebration "Objective, Level and Checkpoint Handled"
    ![Bounce celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now turn a vague topic into a measurable objective, classify it by Bloom level and verb, choose an interaction pattern for it, and run the instructional design checkpoint before any code exists. That is the groundwork every evidence question later in the book stands on.

## Chapter Summary

- A **course description** is the source document for the book, and its learning outcomes are grouped by the six Bloom levels. The learning graph was generated from it.
- A **concept** is a named unit of knowledge small enough to define and assess on its own. A **learning graph** is a directed acyclic graph of concepts, and a **concept dependency** points from a dependent concept to its prerequisite.
- A **learning objective** states what a learner will be able to do, with an actor, an action and a concept. A **measurable objective** uses an observable verb and a way to check success. A **learning outcome** is what the learner actually does, observed afterward.
- **Bloom's Taxonomy** (2001) has six levels: Remember, Understand, Apply, Analyze, Evaluate and Create. A **Bloom verb** is a clue to the level, but verbs overlap, so **objective classification** must consider the task as well and record a reason.
- The **interaction pattern** must match the Bloom level. Flash cards suit Remember, step-throughs suit Understand, sliders suit Apply, explorers suit Analyze, sorting suits Evaluate, and builders suit Create.
- **Cognitive load theory** separates intrinsic load (the material), extraneous load (the presentation) and germane load (sense-making). Managing the first, reducing the second and encouraging the third is a useful design checklist.
- The **instructional design checkpoint** asks what data the learner must see, whether the learner predicts first, what animation adds, and whether continuous animation suits the level. **Predict-first design** and a stated **purpose of animation** are its two most consequential answers.
- A **formative assessment** should target a stated objective at its intended level. Whether the events a MicroSim emits predict mastery is still a hypothesis, because no learner data has been collected yet.

With a measurable, classified objective in hand, the next question is which kind of MicroSim can serve it best, which Chapter 4 answers through the type catalog and the routing rubric.
