---
title: PRIMM Semantic Wave Explorer
description: Relate each PRIMM stage (Predict, Run, Investigate, Modify, Make) to a point on a semantic wave between concrete and abstract, then place bouncing-ball lesson activities on the stage where each belongs.
image: /sims/primm-semantic-wave-explorer/primm-semantic-wave-explorer.png
og:image: /sims/primm-semantic-wave-explorer/primm-semantic-wave-explorer.png
twitter:image: /sims/primm-semantic-wave-explorer/primm-semantic-wave-explorer.png
social:
   cards: false
quality_score: 100
---

# PRIMM Semantic Wave Explorer

<iframe src="main.html" height="562px" width="100%" scrolling="no"></iframe>

[Run the PRIMM Semantic Wave Explorer Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

**PRIMM** is a five-stage lesson sequence: Predict, Run, Investigate, Modify, Make. Learners
predict what a simulation will do, run it and compare, investigate why the outcome occurred,
modify parameters or code, and finally make a new variation of their own. **Semantic waves**
describe how a good explanation moves between the abstract and the concrete: a MicroSim unpacks
an abstract idea into a tangible interaction, and the lesson then repacks it into a general
statement that transfers.

A PRIMM sequence traces such a wave. The prediction is abstract, running the sim is concrete,
investigating climbs back toward the general rule, modifying is hands-on again, and making
applies the rule in a new setting. This explorer draws that wave as a smooth curve through five
points. The heights are illustrative, and the sim says so on screen; the shape, with Predict
and Investigate above Run, is the point.

Press a stage button to highlight its point and read a two-sentence description with one
bouncing-ball activity. Then choose a lesson activity from the dropdown and drag its card onto
the stage where it belongs. A correct placement turns the stage green and explains why; an
incorrect one names the stage the activity most resembles and gives the reason.

**Learning objective:** The learner will relate each PRIMM stage to a point on a semantic wave
and identify which stage a given lesson activity belongs to.

**Bloom's taxonomy level:** Analyze (verb: *relate*)

## How to Use

1. Press each of the five stage buttons in order and read where each sits between concrete and
   abstract.
2. Choose an activity in **Lesson activity**. A card appears at the top of the drawing.
3. Drag the card onto a stage. With the keyboard, choose the activity and then press the stage
   button instead.
4. Read the feedback. If the placement was wrong, try again.
5. Place all six activities, then press **Reset** and try to do it with no mistakes.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/primm-semantic-wave-explorer/main.html"
        height="562px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development).

### Duration

15 minutes

### Prerequisites

- Active learning and scaffolding (Chapter 24)
- The Bouncing Ball Gravity Lab from Chapter 1, or any simple simulation

### Activities

1. **Trace the wave (3 min):** Step through the five stages. For each, say in one sentence why
   it sits high or low.
2. **Place the activities (5 min):** Place all six sample activities. Note the two that are
   easiest to confuse and why.
3. **Design your own (5 min):** Write one activity for each PRIMM stage for a MicroSim you
   teach with. Swap with a partner and have them place each one.
4. **Discuss (2 min):** Which stage does your current lesson skip, and what happens to the wave
   if it does?

### Assessment

- The learner places a new activity on the correct PRIMM stage and explains the choice using
  "concrete" and "abstract".
- The learner explains why Investigate climbs back toward the abstract after Run.
- The learner identifies a lesson that stays flat (only concrete or only abstract) and proposes
  an activity that completes the wave.

## References

1. [PRIMM Portal](https://primmportal.com/) - Support for teaching programming in school with
   the Predict, Run, Investigate, Modify, Make sequence.
2. [Legitimation Code Theory](https://legitimationcodetheory.com/) - LCT Centre. The framework
   in which semantic waves (semantic gravity and density) are defined.
3. [Active learning](https://en.wikipedia.org/wiki/Active_learning) - Wikipedia. The broader
   family of methods PRIMM belongs to.
4. [p5.js reference: createSelect](https://p5js.org/reference/p5/createSelect/) - p5.js. The
   control used for the activity dropdown.
