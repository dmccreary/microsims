---
title: FFT Butterfly MicroSim
description: An interactive MicroSim demonstrating fft butterfly microsim.
quality_score: 62
social:
   cards: false
---
# FFT Butterfly MicroSim

<iframe src="main.html" height="550" scrolling="no"></iframe>

<!--
![Image Name](./image.png){ width="400" }
-->

[Run the FFT Butterfly MicroSim](main.html){ .md-button .md-button--primary }
[Edit this MicroSim](https://editor.p5js.org/dmccreary/sketches/K-BDjmSQF)

## Sample iframe

```html
<iframe src="https://dmccreary.github.io/spectrum-analyzer/sims/name/main.html" height="550"  scrolling="no"></iframe>
```

## FFT Butterfly Algorithm: A Step-by-Step Guide

Here's how to use the FFT Butterfly MicroSim to understand this important algorithm in signal processing:

### Getting Started

1. **Launch the MicroSim**: When you first open the simulation, you'll see a series of circles arranged in columns - this is the "butterfly" network that gives the FFT algorithm its name.

2. **Understanding the Layout**:
   - The leftmost column (orange circles) represents your input data
   - The rightmost column (green circles) shows the final FFT outputs
   - The intermediate columns (blue circles) show how data moves through the calculation stages

3. **Click "Start"**: This begins the animation showing how data flows through the FFT process.

### Walking Through the FFT

1. **Select an FFT Size**: Use the radio buttons to choose between 4, 8, 16, or 32 points.
   - Start with a small size (4 or 8) to easily see the pattern
   - Larger sizes show how the algorithm scales efficiently

2. **Step Through the Stages**:
   - After clicking "Start", the button changes to "Next Step"
   - Each click advances to the next stage of the FFT
   - Watch how the connecting lines show data movement between stages

3. **Observe the Pattern**: Notice how data points that are far apart in the input are brought together in later stages.

### Understanding What You're Seeing

#### The Key Insights

1. **The Divide-and-Conquer Approach**:

- The FFT breaks down a complex calculation into simpler pieces
- At each stage, you're combining results from previous calculations
- This recursive structure is what makes FFT so efficient

2. **The Butterfly Pattern**:

- Notice how data moves in a characteristic "X" pattern (like butterfly wings)
- This pattern shows how one input affects multiple outputs
- The pattern repeats at different scales across the diagram

3. **Bit Reversal**:

- Notice the final ordering of outputs - they're in "bit-reversed" order
- This is a key insight into how the FFT achieves its efficiency
- Numbers that are far apart in natural ordering become adjacent in bit-reversed ordering

### Why This Matters

The FFT algorithm reduces the computational complexity of analyzing signals from O(n²) to O(n log n), which makes real-time signal processing possible for:

- Audio processing and music applications
- Image and video compression
- Wireless communications
- Medical imaging
- Radar and sonar systems

### Experimenting with the MicroSim

1. **Compare Different Sizes**: Try switching between different FFT sizes to see how the pattern scales
   - How does the number of stages relate to the FFT size?
   - How does the complexity grow as you double the size?

2. **Trace Individual Points**: Follow a single data point (numbered circle) through the entire process
   - Where does input point 0 end up?
   - Which inputs contribute to output point 3?

3. **Reset and Repeat**: Click "Reset" to restart the visualization with the same settings

### The Big Picture

The butterfly pattern visualized in this MicroSim represents the heart of what makes the FFT algorithm revolutionary. By reorganizing the calculation in this specific way, the algorithm:

1. Eliminates redundant calculations
2. Reuses intermediate results efficiently
3. Transforms a quadratic-time problem into a linearithmic-time solution

Understanding this pattern gives you insight into not just signal processing, but a fundamental approach to algorithm design that appears across computer science.

When you can visualize how the FFT reorganizes data through the butterfly structure, you gain an intuitive understanding of how clever mathematical insights can dramatically improve computational efficiency.