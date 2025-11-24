---
title: Koch Curve Fractal
description: Interactive demonstration of the Koch snowflake fractal using recursive subdivision with adjustable recursion depth to explore self-similarity and fractal geometry.
quality_score: 65
---

# Koch Curve Fractal

<iframe src="main.html" width="100%" height="450px"></iframe>

[Run the Koch Curve MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/koch/main.html" width="100%" height="450px"></iframe>
```

## Description

This MicroSim demonstrates the **Koch snowflake**, one of the earliest and most famous fractals in mathematics. The simulation uses recursive subdivision to create increasingly complex patterns from a simple line segment, illustrating fundamental concepts in fractal geometry and self-similarity.

### Key Features

- **Interactive Recursion Control**: Slider adjusts recursion depth from 0 to 6 levels
- **Real-Time Rendering**: Watch the fractal evolve as you adjust the recursion level
- **Classic Fractal Pattern**: Each line segment divides into four segments forming a triangular bump
- **Visual Clarity**: White lines on dark background for excellent visibility
- **Responsive Design**: 620×400 canvas optimized for viewing fractal details

### How It Works

The Koch curve transforms a straight line through recursive subdivision:

1. **Start**: Begin with a horizontal line segment
2. **Divide**: Split the line into three equal parts
3. **Add Peak**: Replace the middle third with two sides of an equilateral triangle
4. **Recurse**: Apply the same process to each of the four resulting segments
5. **Repeat**: Continue recursively for the selected number of levels

**Mathematical Process**:
- At recursion level 0: 1 line segment
- At recursion level 1: 4 line segments
- At recursion level 2: 16 line segments (4²)
- At recursion level n: 4ⁿ line segments

**Length Growth**:
- Each iteration increases the total length by a factor of 4/3
- After n iterations: Length = (4/3)ⁿ × original length
- As n → ∞, the length approaches infinity!

**Key Algorithm**: The recursive function divides each segment into four parts:
```javascript
function KochCurve(x1, y1, x2, y2, levels) {
    if (levels > 0) {
        // Calculate three division points plus peak
        // Recursively draw four sub-segments
    } else {
        // Base case: draw the line
    }
}
```

## Mathematical Concepts

This simulation illustrates fundamental concepts from fractal geometry:

### 1. **Self-Similarity**
The Koch curve exhibits perfect self-similarity - each part resembles the whole when magnified. Zooming into any section reveals the same triangular pattern.

### 2. **Fractal Dimension**
Unlike smooth curves (dimension 1) or filled areas (dimension 2), the Koch curve has a **fractal dimension** of approximately **1.2619**, calculated as:

```
D = log(4) / log(3) ≈ 1.2619
```

This means it's "more than a line but less than a plane."

### 3. **Infinite Perimeter, Finite Area**
When three Koch curves form a snowflake:
- The perimeter grows infinitely with each iteration
- The enclosed area converges to a finite value (8/5 of the original triangle)

### 4. **Recursive Algorithms**
The Koch curve demonstrates how simple recursive rules can generate complex patterns - a fundamental principle in:
- Computer science (recursive functions)
- Nature (tree branching, coastlines, snowflakes)
- Art (fractal-based designs)

## Educational Applications

### Learning Objectives

Students will be able to:

1. **Understand** how recursive processes generate complex patterns from simple rules
2. **Visualize** the concept of self-similarity in fractals
3. **Analyze** how fractal dimension differs from integer dimensions
4. **Calculate** the growth rate of segments and total length
5. **Connect** mathematical fractals to natural phenomena

### Prerequisites

- Basic geometry: lines, angles, triangles
- Understanding of recursion (helpful but not required)
- Exponents and exponential growth
- Basic trigonometry (for understanding the 60° angle)

### Classroom Activities

**Activity 1: Pattern Recognition** (10 minutes)
- Start at recursion level 0 (straight line)
- Increase one level at a time to level 3
- Have students predict the pattern at the next level
- **Discussion**: What stays the same? What changes?

**Activity 2: Counting Segments** (15 minutes)
- Record the number of line segments at each level (1, 4, 16, 64...)
- Create a table of recursion level vs. segment count
- Graph the exponential relationship
- **Discussion**: Why does this grow so quickly? What's the pattern?

**Activity 3: Length Calculation** (15 minutes)
- If the original line is 600 pixels, calculate length at each level
- Level 0: 600 pixels
- Level 1: 800 pixels (600 × 4/3)
- Level 2: 1067 pixels (600 × (4/3)²)
- **Discussion**: What happens to the length as we continue forever?

**Activity 4: Fractals in Nature** (10 minutes)
- Show images of real snowflakes, coastlines, ferns, trees
- Compare to the Koch curve pattern
- Identify self-similar patterns in nature
- **Discussion**: Why do natural objects form fractal patterns?

### Assessment Questions

1. **Comprehension**: Describe in your own words how the Koch curve is generated.
2. **Application**: If a Koch curve starts with length 300, what's the length after 4 iterations?
3. **Analysis**: Why is the fractal dimension 1.2619 instead of a whole number?
4. **Evaluation**: Is it possible to draw a "complete" Koch snowflake? Why or why not?
5. **Synthesis**: Design your own fractal rule that divides a line into segments.

## Connections to Real Mathematics

### Koch Snowflake

The Koch curve is typically used as one edge of the **Koch snowflake**:
- Start with an equilateral triangle
- Apply the Koch curve to each of the three sides
- Creates a six-pointed star-like shape
- Further iterations create increasingly complex snowflake patterns

### Applications

**Mathematics**:
- Study of continuous but non-differentiable functions
- Measure theory and fractal dimensions
- Limits and infinite series

**Computer Science**:
- Recursive algorithm design
- Computer graphics and procedural generation
- Complexity analysis (space and time)

**Natural Sciences**:
- Modeling coastlines (Richardson's coastline paradox)
- Snowflake formation and crystallography
- Branching patterns in plants and blood vessels

**Art and Design**:
- Fractal art and generative design
- Architectural patterns
- Textile and jewelry designs

## Technical Implementation

**Framework**: p5.js

**Key Algorithms**:
- Recursive subdivision with base case at level 0
- Geometric calculation of triangle peak using 60° angle
- Vector mathematics for segment division

**Recursion Depth**: 0-6 levels
- Level 6 generates 4⁶ = 4,096 line segments
- Higher levels may cause performance issues

**Canvas**: 620×400 pixels with translation for proper positioning

## Extensions and Modifications

### Suggested Enhancements

1. **Koch Snowflake**: Create three Koch curves arranged as a triangle
2. **Color Gradient**: Color segments by recursion depth
3. **Animation**: Automatically cycle through recursion levels
4. **Interactive Points**: Click to set start/end points of the curve
5. **Performance Counter**: Display number of line segments drawn
6. **Angle Variation**: Allow adjusting the 60° angle to create variations
7. **3D Version**: Extend to three dimensions (Koch surface)
8. **Other Fractals**: Compare with Sierpinski triangle, Dragon curve, Hilbert curve

### Advanced Topics

- **Mandelbrot Set**: Compare with other famous fractals
- **L-Systems**: Formal grammar approach to generating fractals
- **Iterated Function Systems**: Alternative fractal generation methods
- **Chaos Theory**: Connection between fractals and chaotic systems

## Historical Context

**Helge von Koch** (1904): Swedish mathematician who first described this curve as an example of a continuous curve without tangents - revolutionary for early 20th century mathematics.

**Significance**: The Koch curve helped establish **fractal geometry** as a field, later formalized by Benoit Mandelbrot in the 1970s.

## Standards Alignment

**Common Core Math**:
- HSG-SRT.B.5: Use geometric transformations to establish similarity
- HSF-BF.A.2: Write arithmetic and geometric sequences recursively
- HSF-IF.A.3: Recognize sequences as functions with domain integers

**Next Generation Science Standards (NGSS)**:
- MS-PS4-1: Use mathematical representations to describe patterns in nature
- HS-LS1-2: Develop and use models to illustrate hierarchical organization

## References

1. [Koch Snowflake - Wikipedia](https://en.wikipedia.org/wiki/Koch_snowflake)
2. [Fractal Dimension Explained](https://mathworld.wolfram.com/KochSnowflake.html) - Wolfram MathWorld
3. [The Beauty of Fractals](https://math.bu.edu/DYSYS/chaos-game/node6.html) - Boston University
4. [Nature of Code - Recursion](https://natureofcode.com/recursion/) - Daniel Shiffman
5. [Fractals in Nature](https://www.symmetrymagazine.org/article/fractals-in-nature) - Symmetry Magazine
