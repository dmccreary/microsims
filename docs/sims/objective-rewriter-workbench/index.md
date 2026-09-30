---
title: Objective Rewriter Workbench
description: Repair eight weak learning objectives by filling the actor, action, concept, and condition-and-standard slots, choosing an observable verb and a learning-graph concept, then compare your repair with a model.
image: /sims/objective-rewriter-workbench/objective-rewriter-workbench.png
og:image: /sims/objective-rewriter-workbench/objective-rewriter-workbench.png
twitter:image: /sims/objective-rewriter-workbench/objective-rewriter-workbench.png
social:
   cards: false
quality_score: 100
---

# Objective Rewriter Workbench

<iframe src="main.html" height="597px" width="100%" scrolling="no"></iframe>

[Run the Objective Rewriter Workbench Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A learning objective names an actor, an action and a concept, and a measurable objective adds a condition and a standard so that success can be decided by observation. Weak objectives usually fail in predictable ways: the verb is "understand" or "know", the concept is a vague topic, and nothing says under what circumstances or how well the learner must perform. This workbench splits each weak objective into four colored slots so that the missing and unobservable parts are visible at a glance, and lets you repair them one slot at a time.

**Learning objective:** The learner will use the actor, action, concept and condition-and-standard checklist to repair a weak learning objective until every part is present and the verb is observable.

**Bloom level:** Apply. **Bloom verb:** use.

The eight weak objectives include the chapter's own example, "Students will understand bouncing balls", along with objectives about MicroSim files, xAPI, cognitive load, Bloom's Taxonomy, iframe heights, interaction patterns and the quality tools. Each has a stored model repair.

## How to Use

1. Read the weak objective at the top. Empty slots have a dashed red outline, and an unobservable verb is marked in red. Hover over any slot to see what that slot requires.
2. Choose a verb from the **action verb** dropdown. Each verb is labeled with its Bloom level. If you choose an unobservable verb such as "understand", the action slot flashes and a warning explains why it fails.
3. Edit the **Concept** field. It turns green when it matches a concept label from the book's learning graph and amber otherwise. Start typing to see matching concept labels as suggestions.
4. Press **Add condition** and **Add standard** to open short pick-lists and choose one of each.
5. Press **Check** to score your repair out of five parts and see the stored model repair beside your version. If your verb is observable but aims at a different Bloom level than the model, the feedback says so.
6. Press **Next weak objective** to move on to the next of the eight.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/objective-rewriter-workbench/main.html"
        height="597px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers and learning-technology developers who write objectives for MicroSims or courses (college undergraduate or professional development).

### Duration

15 to 20 minutes.

### Prerequisites

- The definitions of learning objective and measurable objective (Chapter 3)
- The Bloom verb table from Chapter 3

### Activities

1. **Worked example (4 min):** Repair "Students will understand bouncing balls" together, following the chapter's three steps: replace the verb, name the concept precisely, and add a condition and a standard.
2. **Independent repairs (8 min):** Learners repair at least four more objectives, pressing **Check** only after all four slots are filled.
3. **Compare with the model (4 min):** For one objective where the learner's verb differs from the model's, pairs discuss whether their verb changes the Bloom level and whether that change is intended.
4. **Quiz-item test (4 min):** For one repaired objective, each learner writes a single quiz question that would show whether the objective was met.

### Assessment

- The learner produces repairs that score five of five parts on at least four of the eight objectives.
- For one repair, the learner writes a quiz question that matches the chosen verb, which shows that the verb is observable.

## References

1. [Chapter 3: Learning Objectives and Bloom's Taxonomy](../../chapters/03-learning-objectives-and-blooms-taxonomy/index.md) - learning objectives, measurable objectives and the Bloom verb table.
2. [Bloom's taxonomy](https://en.wikipedia.org/wiki/Bloom%27s_taxonomy) - Wikipedia overview of the original and revised taxonomy.
3. [Educational aims and objectives](https://en.wikipedia.org/wiki/Educational_aims_and_objectives) - Wikipedia article on writing instructional objectives.
4. [p5.js reference: createSelect()](https://p5js.org/reference/p5/createSelect/) - the dropdown control used for the verbs and pick-lists.
