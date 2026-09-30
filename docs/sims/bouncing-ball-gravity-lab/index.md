---
title: Bouncing Ball Gravity Lab
description: Predict, then test, how the gravity and bounciness sliders change a falling ball's motion and the height of its first bounce.
image: /sims/bouncing-ball-gravity-lab/bouncing-ball-gravity-lab.png
og:image: /sims/bouncing-ball-gravity-lab/bouncing-ball-gravity-lab.png
twitter:image: /sims/bouncing-ball-gravity-lab/bouncing-ball-gravity-lab.png
social:
   cards: false
quality_score: 100
---

# Bouncing Ball Gravity Lab

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Bouncing Ball Gravity Lab MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This lab is the "hello world" of interactive simulation: one ball, one floor, and two rules.
Every frame, gravity is added to the ball's downward speed and the speed moves the ball.
When the ball reaches the floor, its speed is reversed and multiplied by the bounciness, so
it keeps only a fraction of its speed. A readout panel shows the ball's height, its speed in
pixels per frame, the number of bounces, and the height of the first bounce as a percentage
of the drop. Dashed lines mark the drop height and the first bounce peak, and a faint dotted
trail shows the last 40 positions of the ball.

With **Predict first** turned on, the lab will not let you simply watch. Each time you change
a slider, it pauses and asks whether the next bounce will be higher, lower, or the same.
After you answer, the next drop reveals the result and explains it. The comparison is
surprising for many learners: gravity changes how fast the ball falls and rebounds, but not
how high it bounces, because each bounce keeps bounciness² of the height.

**Learning objective:** The learner will explain how changing gravity and bounciness changes
the motion of a falling ball, by predicting an outcome and then testing it.

**Bloom's taxonomy level:** Understand (verb: *explain*)

## How to Use

1. Press **Start** to drop the ball. Watch the readout and the dashed line that marks the
   first bounce peak.
2. Move the **Gravity** or **Bounciness** slider. With **Predict first** checked, the lab
   pauses and asks for your prediction.
3. Choose **Higher**, **Lower** or **Same**, then press **Start** or **Drop Again**.
4. When the ball reaches the top of its first bounce, the panel tells you whether you were
   right and why. The purple dashed line shows the bounce before your change.
5. Uncheck **Predict first** to explore freely; the sliders then change the motion
   immediately.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/bouncing-ball-gravity-lab/main.html"
        height="502px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development). No physics background
is assumed.

### Duration

15 minutes

### Prerequisites

- The idea of a variable that changes over time (height, speed)
- The definition of an interactive simulation: a model plus immediate interaction

### Activities

1. **Predict (3 min):** Before touching the lab, write down what you expect to happen to the
   first bounce if gravity is doubled. Then write down what you expect if bounciness drops
   from 0.80 to 0.60.
2. **Test (5 min):** Use the lab with **Predict first** on. Change one slider at a time and
   record your prediction and the result for at least four changes, including one gravity
   change and one bounciness change.
3. **Explain (5 min):** In pairs, explain why doubling gravity made the ball move faster but
   left the first bounce at the same height. Use the two rules shown in the panel under
   "The model" in your explanation.
4. **Connect (2 min):** Discuss which learner actions in this lab would count as evidence of
   understanding if the lab were instrumented (for example, a correct prediction on the
   first try versus random slider movement).

### Assessment

- The learner correctly predicts the direction of change for a new bounciness value.
- The learner explains in one or two sentences why a change in gravity does not change the
  bounce height, referring to the fraction of speed kept at the floor.
- The learner can state what the bounciness value represents (the fraction of speed kept
  after each bounce).

## References

1. [Coefficient of restitution](https://en.wikipedia.org/wiki/Coefficient_of_restitution) -
   Wikipedia. The physics name for "bounciness": the ratio of rebound speed to impact speed.
2. [Free fall](https://en.wikipedia.org/wiki/Free_fall) - Wikipedia. Motion under constant
   gravitational acceleration, the model used between bounces.
3. [p5.js createSlider() reference](https://p5js.org/reference/p5/createSlider/) - p5.js.
   The built-in slider control used for gravity and bounciness.
4. [PhET Interactive Simulations](https://phet.colorado.edu/) - University of Colorado
   Boulder. A large library of research-based science simulations.
