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

A 7-segment display consists of seven LED or LCD segments arranged in a figure-8 pattern. By selectively turning segments on or off, any digit from 0-9 can be displayed. Each segment is traditionally labeled with letters a-g.

### MicroSim Features

- **Realistic Segment Shape**: Each segment is drawn as an elongated hexagon with pointed ends, matching real 7-segment display hardware
- **Segment Status Panel**: The left panel shows real-time ON/OFF status for each segment with color-coded indicators
- **Labeled Segments**: White letters (a-g) are centered on each segment for easy identification
- **Color-Coded Segments**: Each segment has a unique color to help visualize the mapping:
    - **a** (top) - Dark Red
    - **b** (upper right) - Dark Orange
    - **c** (lower right) - Dark Gold
    - **d** (bottom) - Dark Green
    - **e** (lower left) - Dark Blue
    - **f** (upper left) - Dark Purple
    - **g** (middle) - Dark Pink
- **Scalable Display**: The Size slider adjusts both segment size and label font size proportionally

### How to Use

1. **Digit Slider**: Select which digit (0-9) to display and observe which segments turn on
2. **Size Slider**: Adjust the size of the display - labels scale automatically
3. **Segment Status Panel**: Watch the left panel to see which segments (a-g) are ON or OFF for the current digit

## Lesson Plan

### Learning Objectives

By the end of this lesson, students will be able to:

1. Identify the seven segments of a 7-segment display and their standard labels (a-g)
2. Determine which segments must be active to display each digit 0-9
3. Understand how binary states (on/off) combine to create visual representations
4. Create a segment mapping table showing the binary pattern for each digit
5. Recognize applications of 7-segment displays in everyday devices

### Target Audience

- Middle school students (grades 6-8)
- High school electronics/computer science students
- Introductory digital electronics courses

### Prerequisites

- Basic understanding of binary (on/off) states
- Familiarity with LED concepts

### Suggested Activities

#### Activity 1: Segment Mapping Table (10-15 minutes)

Have students use the MicroSim to complete a segment mapping table:

| Digit | a | b | c | d | e | f | g |
|-------|---|---|---|---|---|---|---|
| 0 | ? | ? | ? | ? | ? | ? | ? |
| 1 | ? | ? | ? | ? | ? | ? | ? |
| ... | | | | | | | |

Students should cycle through digits 0-9 using the slider and record which segments are ON (1) or OFF (0) by watching the Segment Status panel.

#### Activity 2: Pattern Analysis (10 minutes)

Using their completed table, students answer:

- Which segment is ON most frequently? (Answer: segments a, b, c, d are ON for 8 digits)
- Which segment is ON least frequently? (Answer: segment g is ON for only 5 digits)
- Which digit uses the most segments? (Answer: 8 uses all 7)
- Which digit uses the fewest segments? (Answer: 1 uses only 2)

#### Activity 3: Hexadecimal Extension (15 minutes)

Challenge students to design segment patterns for hexadecimal digits A-F:

- A: segments a, b, c, e, f, g
- b: segments c, d, e, f, g (lowercase to distinguish from 8)
- C: segments a, d, e, f
- d: segments b, c, d, e, g (lowercase to distinguish from 0)
- E: segments a, d, e, f, g
- F: segments a, e, f, g

#### Activity 4: Real-World Scavenger Hunt (Homework)

Have students find and photograph 7-segment displays in their environment:

- Digital clocks and watches
- Microwave ovens and appliances
- Gas station price signs
- Elevator floor indicators
- Scientific calculators

### Assessment

1. **Quick Quiz**: Given a segment pattern (e.g., "a, b, c, d, g are ON"), identify the digit
2. **Reverse Engineering**: Given a digit, list which segments must be ON
3. **Binary Representation**: Write the 7-bit binary code for each digit (e.g., digit 0 = 1111110)
4. **Design Challenge**: Create a segment pattern for a letter not covered in class

## References

1. [Seven-segment display - Wikipedia](https://en.wikipedia.org/wiki/Seven-segment_display) - Comprehensive overview of 7-segment display history, technology, and applications
2. [How Seven Segment Display Works](https://www.electronics-tutorials.ws/blog/7-segment-display-tutorial.html) - Electronics Tutorials - Detailed technical explanation with circuit diagrams
3. [p5.js Reference](https://p5js.org/reference/) - Documentation for the p5.js library used in this simulation
