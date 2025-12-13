---
title: 7-Segment Display
description: An interactive MicroSim demonstrating how 7-segment displays work to show digits 0-9 using colored segments.
image: /sims/seven-segment-display/7-segment-display.png
og:image: /sims/seven-segment-display/7-segment-display.png
twitter:image: /sims/seven-segment-display/7-segment-display.png
quality_score: 85
social:
   cards: false
---
# 7-Segment Display

<iframe src="main.html" width="100%" height="470px" scrolling="no"></iframe>

Copy this iframe to your website:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/seven-segment-display/main.html" width="100%" height="470px"></iframe>
```

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }
[Edit in p5.js Editor](https://editor.p5js.org/){ .md-button .md-button--primary }

## Description

This MicroSim demonstrates how **seven-segment displays** work, the ubiquitous digital display technology found in digital clocks, calculators, microwave ovens, and countless electronic devices.

A 7-segment display consists of seven LED or LCD segments arranged in a figure-8 pattern. By selectively turning segments on or off, any digit from 0-9 can be displayed. Each segment is traditionally labeled with letters a-g:

- **Segment a** (top horizontal) - Red
- **Segment b** (upper right vertical) - Orange
- **Segment c** (lower right vertical) - Yellow
- **Segment d** (bottom horizontal) - Green
- **Segment e** (lower left vertical) - Blue
- **Segment f** (upper left vertical) - Purple
- **Segment g** (middle horizontal) - Pink

### How to Use

1. **Digit Slider**: Select which digit (0-9) to display
2. **Size Slider**: Adjust the size of the display

The colored segments help visualize which segments are active for each digit, making it easier to understand the segment mapping.

## Lesson Plan

### Learning Objectives

By the end of this lesson, students will be able to:

1. Identify the seven segments of a 7-segment display and their standard labels (a-g)
2. Determine which segments must be active to display each digit 0-9
3. Understand how binary states (on/off) combine to create visual representations
4. Recognize applications of 7-segment displays in everyday devices

### Target Audience

- Middle school students (grades 6-8)
- High school electronics/computer science students
- Introductory digital electronics courses

### Prerequisites

- Basic understanding of binary (on/off) states
- Familiarity with LED concepts

### Activities

1. **Segment Mapping Exercise**: Have students create a table showing which segments (a-g) are active for each digit 0-9
2. **Pattern Recognition**: Ask students to identify which segments are always on, always off, or vary across digits
3. **Design Challenge**: Challenge students to design segment patterns for letters A-F (hexadecimal display)
4. **Real-World Hunt**: Have students find and photograph 7-segment displays in their environment

### Assessment

- Quiz on segment labels and their positions
- Given a segment pattern, identify the displayed digit
- Design a segment pattern for a new character

## References

1. [Seven-segment display - Wikipedia](https://en.wikipedia.org/wiki/Seven-segment_display) - Comprehensive overview of 7-segment display history, technology, and applications
2. [How Seven Segment Display Works](https://www.electronics-tutorials.ws/blog/7-segment-display-tutorial.html) - Electronics Tutorials - Detailed technical explanation with circuit diagrams
3. [p5.js Reference](https://p5js.org/reference/) - Documentation for the p5.js library used in this simulation
