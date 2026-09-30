---
title: Triangle Type Explorer
description: An interactive MicroSim where students explore triangle classification by dragging vertices. Automatically classifies triangles by side length (Equilateral, Isosceles, Scalene) and angles (Acute, Right, Obtuse).
image: /sims/triangle-type/triangle-type.png
og:image: /sims/triangle-type/triangle-type.png
twitter:image: /sims/triangle-type/triangle-type.png
social:
  cards: false
---

# Triangle Type Explorer

<figure markdown>
   ![Triangle Type Explorer](./triangle-type.png){ width="400" }
   <figcaption>Resets to equilateral triangle.</figcaption>
</figure>

<iframe src="main.html" height="512" scrolling="no"></iframe>

[Run the Triangle Type Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
[Edit with p5.js Editor](https://editor.p5js.org/){ .md-button }

## Overview

The Triangle Type Explorer is an interactive educational simulation that helps middle and high school students understand triangle classification through hands-on exploration. By dragging the three vertices of a triangle, students can visually observe how side lengths and angles determine the triangle's classification.

The MicroSim provides real-time feedback, displaying:
- **Side-based classification**: Equilateral, Isosceles, or Scalene
- **Angle-based classification**: Acute, Right, or Obtuse
- **Combined classification**: For example, "Isosceles Right" or "Scalene Obtuse"
- **Precise measurements**: All side lengths and angles displayed in real-time

## How to Use

### Basic Interaction

1. **Start with the initial triangle** displayed on the canvas (equilateral)
2. **Click and drag** any of the three red vertices (labeled A, B, C) to reshape the triangle
3. **Watch the classification update** automatically as you adjust the triangle
4. **Observe the measurements** showing all side lengths and angles

### Navigation

- **Drag vertices** to any position within the drawing area
- **Press 'R'** or **click Reset** to return to the initial triangle configuration
- **Vertices snap to bounds** to prevent them from moving outside the canvas

### Keyboard Shortcuts

- **R key** - Reset triangle to initial position

## Learning Objectives

After using this MicroSim, students will be able to:

### Remember
- Recall the definitions of triangle types based on sides (Equilateral, Isosceles, Scalene)
- Recall the definitions of triangle types based on angles (Acute, Right, Obtuse)

### Understand
- Explain the properties that define each type of triangle
- Understand why certain combinations are possible or impossible
- Understand that angles in any triangle sum to 180°

### Apply
- Classify given triangles based on measurements
- Create specific triangle types using the simulation
- Use the measurements to verify triangle properties

### Analyze
- Determine how changing one vertex affects the triangle's classification
- Analyze the relationship between side lengths and angles
- Investigate which triangle types are most commonly found in nature and architecture

## Classroom Activities

### Activity 1: Triangle Type Creation Challenge

**Time**: 10 minutes | **Difficulty**: Medium

Students race to create specific triangle types:

1. Start the timer
2. Ask students to create one of each type:
   - An **Equilateral** triangle
   - An **Isosceles Right** triangle
   - A **Scalene Acute** triangle
   - An **Obtuse Isosceles** triangle
   - A **Right Scalene** triangle

3. Verify success by checking the displayed classification
4. Discuss which was easiest/hardest to create

**Discussion Questions:**
- Why is an Equilateral Right impossible?
- Can a scalene triangle be acute? Right? Obtuse?
- What's the relationship between being isosceles and the angles?

### Activity 2: Prediction and Verification

**Time**: 15 minutes | **Difficulty**: High

1. **Predict**: Without using the simulator, students draw a triangle they think is isosceles acute
2. **Verify**: Use the simulator to check their prediction
3. **Analyze**: If wrong, what did they misunderstand?
4. **Repeat** with different triangle types

This activity highlights the difference between what we see and what the measurements show.

### Activity 3: Constraint Investigation

**Time**: 12 minutes | **Difficulty**: Medium-High

Pose constraint questions:

- "Create a right triangle that is NOT isosceles. Is this possible?"
- "Create an isosceles triangle that is NOT acute. What types work?"
- "Create the 'most obtuse' triangle you can. What's the maximum obtuse angle?"
- "What happens if you try to make all three angles equal?"

Students explore and record findings, then discuss as a class.

### Activity 4: Real-World Triangle Hunting

**Time**: 20 minutes | **Difficulty**: Medium

1. Show students images of structures, buildings, and natural objects with triangles
2. Ask them to predict what type each triangle is
3. Use the simulator to create similar triangles
4. Classify the triangles and discuss why that type appears in that context

**Examples:**
- Bridge trusses (often isosceles or right triangles)
- Roof structures (often isosceles)
- Mountain/pyramid shapes (often acute or right triangles)
- Road signs (equilateral triangles)

## Mathematical Concepts

### Triangle Classification by Sides

| Type | Definition | Characteristics |
|------|-----------|-----------------|
| **Equilateral** | All three sides equal length | All angles are 60°, always acute |
| **Isosceles** | Exactly two sides equal length | Two angles are equal (base angles), can be acute, right, or obtuse |
| **Scalene** | All three sides different lengths | All angles are different, can be acute, right, or obtuse |

### Triangle Classification by Angles

| Type | Definition | Characteristics | All Angles |
|------|-----------|-----------------|------------|
| **Acute** | All angles less than 90° | Often appears in nature | < 90°, < 90°, < 90° |
| **Right** | One angle exactly 90° | Related to Pythagorean theorem | 90°, < 90°, < 90° |
| **Obtuse** | One angle greater than 90° | Less common in regular structures | > 90°, < 90°, < 90° |

### Mathematical Relationships

**Angle Sum Property:**
In any triangle, the three angles always sum to exactly 180°.

**Distance Formula** (used to calculate side lengths):
$$d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$

**Law of Cosines** (used to calculate angles):
$$\cos(A) = \frac{b^2 + c^2 - a^2}{2bc}$$

## Technical Details

### How the Simulator Calculates Classifications

**Side Classification Algorithm:**
1. Measure the distance between each pair of vertices
2. Sort the three distances
3. If the largest and smallest are nearly equal → Equilateral
4. Else if any two are nearly equal → Isosceles
5. Else → Scalene

**Angle Classification Algorithm:**
1. Calculate angles using the Law of Cosines
2. Check if any angle ≈ 90° → Right
3. Else if all angles < 90° → Acute
4. Else if any angle > 90° → Obtuse

**Tolerance Values:**
- Sides considered "equal" if within 5 pixels
- Angles considered "right" if within 5 degrees of 90°

### Implementation Standards

This MicroSim follows the educational MicroSim standards:
- **Responsive Design**: Adapts to different screen sizes and container widths
- **Real-Time Feedback**: Measurements update instantly as vertices move
- **Accessible**: High-contrast colors, large fonts (16pt minimum), screen reader support
- **Educator-Friendly**: Code is well-commented and can be modified in p5.js editor

## Common Misconceptions Addressed

This MicroSim helps address common student misconceptions:

1. **"All right triangles are isosceles"**
   → Students can create scalene right triangles, seeing they're perfectly valid

2. **"Obtuse triangles can't be isosceles"**
   → Students can create obtuse isosceles triangles, showing the concept is possible

3. **"If a triangle has one equal side, it's isosceles"**
   → By requiring exactly two equal sides, students see the distinction clearly

4. **"Triangle types are independent"**
   → By showing both classifications together, students see how they interact

5. **"You can make a triangle with any three measurements"**
   → As students drag, they observe the Triangle Inequality Theorem in action

## Standards Alignment

This MicroSim aligns with the following educational standards:

### Common Core State Standards (CCSS)
- **CCSS.MATH.CONTENT.7.G.A.2** - Draw triangles with given measurements
- **CCSS.MATH.CONTENT.7.G.A.3** - Understand the shape of a triangle and conditions for congruence
- **CCSS.MATH.CONTENT.HSG.CO.B.8** - Understand congruence in terms of rigid motions
- **CCSS.MATH.CONTENT.HSG.SRT.A.1** - Understand similarity in terms of similarity transformations

### National Council of Teachers of Mathematics (NCTM)
- **Geometry Standard**: Analyze characteristics and properties of two- and three-dimensional geometric shapes

## Pedagogical Strategies

### Effective Use Patterns

**Guided Exploration (Recommended for first use)**
1. Show the tool on a projector
2. Ask students to predict what will happen
3. Demonstrate by dragging vertices
4. Discuss observations as a class
5. Allow students to explore independently

**Hands-On Practice (After initial instruction)**
1. Provide specific triangle types to create
2. Have students verify their triangles match criteria
3. Record measurements in a table
4. Identify patterns and relationships

**Formative Assessment (Before formal assessment)**
1. Ask: "Create an Isosceles Acute triangle"
2. Observe whether students can do so
3. Ask follow-up: "What would happen if you moved that vertex?"
4. Assess understanding based on responses

### Scaffolding for Different Levels

**Beginner Level**
- Start with exploring one property at a time
- Focus on side-based classification first
- Use guided questions: "Can you make an equilateral triangle?"

**Intermediate Level**
- Combine side and angle classifications
- Pose constraint problems: "Make a right triangle that isn't isosceles"
- Connect to measurements: "What changes when you move vertex A?"

**Advanced Level**
- Challenge misconceptions: "Is an equilateral right triangle possible? Why?"
- Explore special triangles: "Can you make a 45-45-90 triangle?"
- Connect to trigonometry: "For a right triangle, what's the relationship between sin(30°) and the opposite side?"

## Extensions and Connections

### Mathematical Extensions

**Perimeter and Area**
- Calculate and display the perimeter of each triangle
- Display the area using Heron's formula
- Have students estimate before the calculation

**Triangle Inequality Theorem**
- Show what happens when vertices get too close together
- Display warning when triangle is nearly degenerate
- Explore the mathematical constraint: a + b > c

**Special Triangles**
- Highlight when a 30-60-90 triangle is created
- Identify and label 45-45-90 triangles
- Show the 3-4-5 Pythagorean triple

### Interdisciplinary Connections

**Physics & Engineering**
- Discuss why triangles are used in bridge construction
- Examine load distribution in triangular structures
- Explore stability and different triangle types

**Art & Architecture**
- Examine triangles in famous buildings and art
- Discuss aesthetic properties of different triangle types
- Create geometric art using controlled triangle types

**Trigonometry Preview**
- For right triangles, introduce sin, cos, tan
- Show how ratios depend on angles
- Connect to applications in navigation and surveying

## Troubleshooting and Support

### Common Issues

**Q: The classification doesn't match what I expect**
A: Check the measurements displayed. The simulator uses precise geometric calculations. You might be creating a different type than intended!

**Q: One vertex won't move**
A: Make sure you're clicking on the red circle (the vertex), not just near it. The clickable area is 20 pixels from the center.

**Q: The triangle looks right but the classification is wrong**
A: The tolerance for "equal" sides is 5 pixels. Very small differences in length create different classifications.

**Q: I want to modify the simulation**
A: All code can be edited in the p5.js editor (editor.p5js.org). Paste the entire contents of triangle-type-explorer.js into the editor, make changes, and save a new version!

## For Educators

### Assessment Ideas

**Formative Assessment**
- Can students create specific triangle types on command?
- Do they understand why certain combinations are impossible?
- Can they explain the classification rules?

**Summative Assessment**
- Have students create a portfolio of triangle examples
- Ask them to photograph real-world triangles and classify them
- Create a written explanation of triangle classification rules

**Self-Assessment**
- Students rate their confidence in classifying triangles
- They identify which triangle types are most challenging
- They set goals for triangle classification mastery

### Tips for Maximum Learning

1. **Start with exploration** - Let students play before teaching
2. **Use mathematical language** - Reinforce correct terminology
3. **Connect to visualization** - Use the tool to make abstract concepts concrete
4. **Challenge misconceptions** - Use the tool to directly refute false beliefs
5. **Make it social** - Have students discuss what they're observing
6. **Document learning** - Have students take notes and record observations
7. **Provide choice** - Let students explore at their own pace

## Learning Outcomes

After completing activities with this MicroSim, students should demonstrate:

- ✅ Ability to identify triangle types by side length
- ✅ Ability to identify triangle types by angle measure
- ✅ Understanding of the relationship between sides and angles
- ✅ Recognition of impossible combinations (e.g., Equilateral Right)
- ✅ Application of classification rules to real-world examples
- ✅ Understanding that angles in a triangle sum to 180°

## About This MicroSim

**Educational Framework:** Based on the MicroSim Framework for p5.js
**Target Grade Levels:** Middle School (Grades 6-8) and High School (Grades 9-10)
**Duration:** 10-15 minutes per activity
**Prerequisites:** Basic understanding of triangles, angles, and geometric measurement

## Feedback and Suggestions

If you have suggestions for improving this MicroSim or find errors in the mathematics or pedagogy, please open an issue on the project repository. Your feedback helps make educational tools better!

---

**Ready to explore triangles?** Click the "Run" button above and start dragging vertices to discover the world of triangle types!
