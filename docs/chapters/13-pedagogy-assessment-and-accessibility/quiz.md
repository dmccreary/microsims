# Chapter 13 Quiz: Pedagogy, Assessment, and Accessibility

Test your understanding of cognitive load theory, PRIMM methodology, formative assessment, and accessibility standards for inclusive MicroSim design.

**Instructions:** Select the best answer for each question. After answering, click "Show Answer" to check your response and read the explanation.

---

#### 1. What are the three types of cognitive load identified by John Sweller?

<div class="upper-alpha" markdown>
1. Visual, auditory, kinesthetic
2. Intrinsic, extraneous, germane
3. Short-term, working, long-term
4. Simple, moderate, complex
</div>

??? question "Show Answer"
    The correct answer is **B**. John Sweller's cognitive load theory identifies three types: intrinsic load (inherent complexity of the material), extraneous load (unnecessary complexity from poor design), and germane load (productive effort devoted to building mental models).

    **Concept Tested:** Cognitive Load Theory, Intrinsic Load, Extraneous Load, Germane Load

    **Bloom's Level:** Remember

---

#### 2. Which type of cognitive load should MicroSim designers minimize?

<div class="upper-alpha" markdown>
1. Intrinsic load
2. Germane load
3. Extraneous load
4. Total load
</div>

??? question "Show Answer"
    The correct answer is **C**. Extraneous load is cognitive effort wasted on things that don't contribute to learning—unclear labels, cluttered interfaces, unnecessary features. Designers should minimize extraneous load while maximizing germane load (productive learning effort).

    **Concept Tested:** Extraneous Load

    **Bloom's Level:** Understand

---

#### 3. What does PRIMM stand for?

<div class="upper-alpha" markdown>
1. Preview, Read, Interpret, Make, Modify
2. Predict, Run, Investigate, Modify, Make
3. Practice, Repeat, Implement, Memorize, Master
4. Plan, Research, Implement, Monitor, Maintain
</div>

??? question "Show Answer"
    The correct answer is **B**. PRIMM (Predict-Run-Investigate-Modify-Make) is a pedagogical framework developed by Sue Sentance for teaching programming concepts. Each phase builds on the previous one, moving from passive observation to active creation.

    **Concept Tested:** PRIMM Methodology

    **Bloom's Level:** Remember

---

#### 4. What is the purpose of the Predict phase in PRIMM methodology?

<div class="upper-alpha" markdown>
1. To test students' existing knowledge
2. To activate prior knowledge and create cognitive engagement
3. To save time by skipping demonstrations
4. To allow students to guess randomly
</div>

??? question "Show Answer"
    The correct answer is **B**. The Predict phase activates students' prior knowledge and creates cognitive engagement. When predictions are wrong, students experience productive confusion that motivates learning. This phase sets up meaningful observation in the Run phase.

    **Concept Tested:** Predict Phase

    **Bloom's Level:** Understand

---

#### 5. What distinguishes guided exploration from open exploration?

<div class="upper-alpha" markdown>
1. Guided exploration uses more colors
2. Guided exploration provides structure and specific tasks; open exploration allows student-directed discovery
3. Guided exploration is for advanced students only
4. There is no meaningful difference
</div>

??? question "Show Answer"
    The correct answer is **B**. Guided exploration provides structure with specific tasks, predetermined sequences, and clear success criteria. Open exploration offers freedom with no preset objectives, student-directed discovery, and multiple valid outcomes. The choice depends on learning objectives and students' prior knowledge.

    **Concept Tested:** Guided Exploration, Open Exploration

    **Bloom's Level:** Understand

---

#### 6. What is the purpose of the p5.js describe() function?

<div class="upper-alpha" markdown>
1. To add comments to the code
2. To provide screen reader support by adding an accessible description to the canvas
3. To describe the simulation in the documentation
4. To create popup tooltips
</div>

??? question "Show Answer"
    The correct answer is **B**. The `describe()` function provides screen reader support by adding an accessible description to your canvas. It should be specific, include instructions for interaction, and can be updated dynamically as the simulation state changes.

    **Concept Tested:** describe() Function, Screen Reader Support

    **Bloom's Level:** Remember

---

#### 7. According to WCAG guidelines, what is the minimum contrast ratio for normal text?

<div class="upper-alpha" markdown>
1. 2:1
2. 3:1
3. 4.5:1
4. 7:1
</div>

??? question "Show Answer"
    The correct answer is **C**. WCAG 2.1 guidelines specify a minimum contrast ratio of 4.5:1 for normal text. Large text (18pt+) requires 3:1, and UI components require 3:1. Never rely on color alone to convey information.

    **Concept Tested:** Color Contrast, WCAG Guidelines

    **Bloom's Level:** Remember

---

#### 8. What type of MicroSim is most appropriate for the Remember level of Bloom's Taxonomy?

<div class="upper-alpha" markdown>
1. Model editor sandbox
2. Physics simulator with equations
3. Flashcard quiz or matching game
4. Causal loop diagram explorer
</div>

??? question "Show Answer"
    The correct answer is **C**. Flash card MicroSims and matching games target the Remember level by using spaced repetition and immediate feedback to help students memorize facts, definitions, and associations through active recall practice.

    **Concept Tested:** Flash Card MicroSim, Formative Assessment

    **Bloom's Level:** Understand

---

#### 9. A MicroSim has 12 sliders, rainbow gradient backgrounds, and technical abbreviations for labels. What problem does this create?

<div class="upper-alpha" markdown>
1. Increased intrinsic load
2. Increased extraneous load
3. Increased germane load
4. Decreased accessibility
</div>

??? question "Show Answer"
    The correct answer is **B**. Excessive controls, decorative visual elements, and unclear labels all increase extraneous cognitive load—effort wasted on things that don't contribute to learning. This leaves less working memory capacity for building understanding.

    **Concept Tested:** Extraneous Load, Cognitive Load Theory

    **Bloom's Level:** Apply

---

#### 10. What does "scaffolding" mean in educational design?

<div class="upper-alpha" markdown>
1. Building the visual framework of a MicroSim
2. Temporary support structures that help learners, which fade as competence grows
3. Adding permanent help text to all screens
4. Creating multiple versions for different skill levels
</div>

??? question "Show Answer"
    The correct answer is **B**. Scaffolding refers to temporary support structures that help learners accomplish tasks they couldn't complete independently. As learners gain competence, scaffolds are gradually removed (faded). The key is making scaffolds removable, not permanent.

    **Concept Tested:** Scaffolding Strategies

    **Bloom's Level:** Understand

---

#### 11. What is educational equity in the context of MicroSim design?

<div class="upper-alpha" markdown>
1. Giving all students the same MicroSim
2. Designing for students with limited bandwidth, older devices, and varied circumstances
3. Using the same color scheme everywhere
4. Making all MicroSims the same difficulty
</div>

??? question "Show Answer"
    The correct answer is **B**. Educational equity means ensuring all students can access resources regardless of circumstances—including limited internet bandwidth, older computers, shared devices, and intermittent connectivity. This requires low-bandwidth design and graceful degradation for older devices.

    **Concept Tested:** Educational Equity, Low-Bandwidth Design, Older Device Support

    **Bloom's Level:** Understand

---

#### 12. You need to design a MicroSim for students new to a complex topic. Which approach is most appropriate?

<div class="upper-alpha" markdown>
1. Open exploration with no guidance
2. Guided exploration with structured tasks and clear feedback
3. Maximum interactivity with all parameters adjustable
4. Static diagrams only
</div>

??? question "Show Answer"
    The correct answer is **B**. For students new to a topic, guided exploration is most appropriate. It provides structure through specific tasks, predetermined sequences, and clear success criteria. Open exploration works better for students with prior knowledge who can benefit from student-directed discovery.

    **Concept Tested:** Guided Exploration, Scaffolding Strategies

    **Bloom's Level:** Apply

---

## Quiz Summary

**Concepts Tested:**

| Concept | Questions |
|---------|-----------|
| Cognitive Load Theory | 1, 9 |
| Intrinsic Load | 1 |
| Extraneous Load | 1, 2, 9 |
| Germane Load | 1 |
| PRIMM Methodology | 3 |
| Predict Phase | 4 |
| Guided Exploration | 5, 12 |
| Open Exploration | 5 |
| describe() Function | 6 |
| Screen Reader Support | 6 |
| Color Contrast | 7 |
| WCAG Guidelines | 7 |
| Flash Card MicroSim | 8 |
| Formative Assessment | 8 |
| Scaffolding Strategies | 10, 12 |
| Educational Equity | 11 |
| Low-Bandwidth Design | 11 |
| Older Device Support | 11 |

**Bloom's Taxonomy Distribution:**

- Remember: 4 questions (33%)
- Understand: 6 questions (50%)
- Apply: 2 questions (17%)

