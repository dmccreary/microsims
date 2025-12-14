---
title: Larson Scanner
description: Interactive simulation of the iconic Larson Scanner effect - the sweeping red lights made famous by Cylon robots and KITT from Knight Rider.
image: larson-scanner.png
quality_score: 100
social:
    cards: false
---

# Larson Scanner

<iframe src="main.html" width="100%" height="130px" scrolling="no"></iframe>

```html
<iframe src="https://dmccreary.github.io/microsims/sims/larson-scanner/main.html" width="100%" height="150px" scrolling="no"></iframe>
```

[Run Larson Scanner Fullscreen](main.html){ .md-button .md-button--primary }

[Edit in p5.js Editor](https://editor.p5js.org/dmccreary/sketches/Q1MxIJZ3j)

## About This MicroSim

The [Larson Scanner](https://hackaday.com/tag/larson-scanner/) is named after Glen A. Larson, the creator of the TV shows *Battlestar Galactica* and *Knight Rider*. This distinctive sweeping light effect was used for:

- **Cylon robots** in Battlestar Galactica (1978)
- **KITT** - the intelligent car in Knight Rider (1982)

This MicroSim recreates the iconic effect with 12 red LEDs that sweep back and forth with a fading trail.

### How to Use

1. **Speed Slider**: Move right for faster animation, left for slower
2. Watch the red lights sweep left-to-right and back
3. Notice the fading trail effect on adjacent lights

### Technical Details

The effect creates visual persistence through:

- **Active light**: Full brightness (255 alpha)
- **Adjacent lights**: Medium fade (150 alpha)
- **Two positions away**: Dim (80 alpha)
- **Inactive lights**: Very dim (30 alpha)
- **Glow effect**: Larger semi-transparent circles behind the active light

## Lesson Plan

### Learning Objectives

1. Understand animation timing and frame-based updates
2. Learn about alpha transparency and visual persistence
3. Explore arrays and position calculations
4. Practice responsive design patterns

### Target Audience

- Middle school students (grades 6-8)
- High school programming classes
- Maker/electronics enthusiasts

### Prerequisites

- Basic understanding of loops and arrays
- Familiarity with coordinate systems
- Introduction to timing and animation concepts

### Activities

1. **Speed Exploration**: Experiment with the slider to find the most realistic scanner speed
2. **Count the Trail**: How many lights show the fading trail at any moment?
3. **Modify the Code**: Try changing the number of circles or fade levels
4. **Build It**: Create a physical Larson Scanner with LEDs and an Arduino

### Discussion Questions

1. Why does the fading trail make the animation look more realistic?
2. How would you modify this to have multiple scanners?
3. What other pop culture references use similar lighting effects?

### Extension Project

Build a physical Larson Scanner using:

- Arduino or Raspberry Pi Pico
- 12 red LEDs or NeoPixel strip
- Shift registers (74HC595) for LED control

## Sample Prompt

```linenums="0"
Create a p5.js sketch for a simulation of a Larson Scanner.
The project has a row of 12 red evenly spaced horizontal
circles that fade in and out like Cylon robot eyes.
A slider below the drawing area allows a user to control
the speed of the animation. Keep the background black
for contrast with the red lights.
```

## References

1. [Larson Scanner on Hackaday](https://hackaday.com/tag/larson-scanner/) - Hardware projects and tutorials
2. [Glen A. Larson on Wikipedia](https://en.wikipedia.org/wiki/Glen_A._Larson) - Creator of the original effect
3. [Knight Rider KITT](https://en.wikipedia.org/wiki/KITT) - The famous AI car with the scanner
4. [Arduino Larson Scanner Tutorial](https://www.instructables.com/Larson-Scanner/) - Build your own with LEDs
