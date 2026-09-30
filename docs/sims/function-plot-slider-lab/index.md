---
title: Function Plot Slider Lab
description: Move a marker along sin(x), cos(x), x squared or a Gaussian curve with a slider, read x and f(x), and mark every x where the curve reaches a target output.
image: /sims/function-plot-slider-lab/function-plot-slider-lab.png
og:image: /sims/function-plot-slider-lab/function-plot-slider-lab.png
twitter:image: /sims/function-plot-slider-lab/function-plot-slider-lab.png
social:
   cards: false
quality_score: 100
---

# Function Plot Slider Lab

<iframe src="main.html" height="542px" width="100%" scrolling="no"></iframe>

[Run the Function Plot Slider Lab MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A function plot is drawn by sampling: the script evaluates \( f(x) \) at 500 evenly spaced x values between -6.28 and 6.28 (about \( -2\pi \) to \( 2\pi \)) and joins the results with a line. A second trace, a single red marker, sits on the curve at the x value chosen with the slider, and a readout above the plot reports x and \( f(x) \). The y range is padded by 10 percent of the curve's span beyond its extreme values, so the curve never touches the frame.

You can switch among four functions: \( \sin(x) \), \( \cos(x) \), \( x^2 \) and \( e^{-x^2} \). The tooltip teaches rather than merely reports: hovering the curve at a special point shows text such as "x = 1.571, f(x) = 1.000 (maximum of sin)". The exact special points (maxima, minima and zeros inside the domain) are added to the 500 samples so that these tooltips show exact values. The **Show matches** button finds every x in the domain where the curve reaches a target y, including points where the curve only touches the target, such as \( \sin(x) = 1 \), and marks them with green diamonds.

**Learning objective (Bloom level: Apply; verb: locate):** The learner will locate the x values where a chosen function reaches a given output, by moving a marker along the curve and reading the tooltip.

## How to Use

1. Choose a function from the **Function** dropdown.
2. Drag the **x** slider, or focus it and use the arrow keys for steps of 0.01, to move the red marker. Watch the readout above the plot.
3. Type a value in **Target y** and move the marker until the readout shows that value. Record each x you find.
4. Press **Show matches** to check your answers: every matching x is marked with a green diamond and listed below the plot. A dashed line shows the target level.
5. Change the function. The slider keeps its position, the curve is redrawn, and any shown matches are recomputed for the new curve. Press **Clear** to remove the matches.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/function-plot-slider-lab/main.html"
        height="542px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development).

### Duration

15 to 20 minutes

### Prerequisites

- The idea of a function \( f(x) \) and its graph.
- Basic familiarity with \( \sin \), \( \cos \), squares and exponentials (no calculus required).

### Activities

1. **Locate by hand (6 min):** With \( \sin(x) \), set Target y to 0.5. Use only the slider and readout to find every x where \( \sin(x) = 0.5 \). Predict how many matches the domain contains before you start.
2. **Check with matches (3 min):** Press **Show matches** and compare the marked x values with yours. Explain why there are two matches in each period.
3. **Compare functions (6 min):** Keep Target y at 0.5 and switch to \( \cos(x) \), \( x^2 \) and \( e^{-x^2} \). For each, record the number of matches and explain the difference using the shape of the curve.
4. **Edge cases (3 min):** Try Target y = 1 for \( \sin(x) \) (the curve touches without crossing) and Target y = 50 for \( x^2 \) (no match in the domain). Explain each result.

### Assessment

- Given a function and a target output, the learner locates all matching x values in the domain to within 0.01.
- The learner explains why \( x^2 = 4 \) has two solutions, \( e^{-x^2} = 2 \) has none, and \( \sin(x) = 1 \) has solutions where the curve only touches the target.

## References

1. [Plotly JavaScript Open Source Graphing Library](https://plotly.com/javascript/) - Official documentation for Plotly.js.
2. [Plotly Hover Text and Formatting](https://plotly.com/javascript/hover-text-and-formatting/) - How `hovertemplate` and `customdata` produce custom tooltips.
3. [Plotly Line Charts](https://plotly.com/javascript/line-charts/) - Reference for line traces.
4. [Sine and cosine - Wikipedia](https://en.wikipedia.org/wiki/Sine_and_cosine) - Background on the periodic functions plotted here.
5. [Gaussian function - Wikipedia](https://en.wikipedia.org/wiki/Gaussian_function) - Background on the bell-shaped curve \( e^{-x^2} \).
