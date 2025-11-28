# Basic MicroSims

Although we have over 100 MicroSims to demonstrate, we've selected these basic examples to showcase the range of capabilities available for generating high-quality interactive simulations that can have a big impact on your students.

These examples progress from simple animations to more complex visualizations, demonstrating different features and use cases.


## Core Examples

### Bouncing Ball

**The "Hello World!" of MicroSims**

Our simplest example demonstrates the essential elements of a width-responsive MicroSim: animated graphics with user interaction. A ball bounces within the drawing region while a slider in the control area adjusts the speed.

[View Bouncing Ball](./bouncing-ball/index.md){ .md-button .md-button--primary }

**Key Features:** Animation, slider control, responsive design, start/pause button


### Temperature and Pressure

**Physics simulation with visual feedback**

This MicroSim demonstrates the relationship between temperature, molecular motion, and gas pressure. As temperature increases, atoms move faster and collide with container walls more frequently. Features a unique ice/fire visual indicator showing phase transitions at 0°C.

[View Temperature and Pressure](./temp-and-pressure/index.md){ .md-button .md-button--primary }

**Key Features:** Particle simulation, temperature slider (-50°C to 100°C), Celsius/Fahrenheit toggle, real-time pressure measurement, color-coded atoms


### Sine Wave

**Interactive function visualization**

A static sine wave displayed on a Cartesian coordinate grid with three sliders controlling amplitude, period, and phase. Students can explore how each parameter affects the wave shape.

[View Sine Wave](./sine-wave/index.md){ .md-button .md-button--primary }

**Key Features:** Multiple sliders, coordinate system, mathematical visualization


## Specialized Features

### Sound Example: String Harmonics

**Audio output with p5.sound library**

Demonstrates string harmonics with an animated vibrating string. When "Enable Sound" is checked, an oscillator plays a tone that matches the visual frequency. Adjust the frequency slider to hear and see harmonics from 1 to 16.

[View String Harmonics](./string-harmonics/index.md){ .md-button .md-button--primary }

**Key Features:** Sound generation, checkbox control, oscillator, frequency visualization


### Microphone Example: FFT Frequency Visualization

**Audio input with real-time analysis**

Captures microphone input and displays a real-time frequency spectrum using Fast Fourier Transform (FFT). Color-coded bars show low frequencies (blue) to high frequencies (red), with peak frequency detection.

[View FFT Microphone](./fft-mic/index.md){ .md-button .md-button--primary }

**Key Features:** Microphone input, FFT analysis, frequency spectrum, start/stop control


## Visualization Types

### Chart Example: Learning Modality Effectiveness

**Interactive bar chart with Chart.js**

A horizontal bar chart visualizing knowledge retention rates across different learning modalities. Demonstrates why interactive simulations produce superior learning outcomes compared to passive methods like reading or watching videos.

[View Learning Modality Effectiveness](./learning-modality-effectiveness/index.md){ .md-button .md-button--primary }

**Key Features:** Chart.js integration, hover tooltips, animated bar growth, annotations


### Map Example: Global Impact

**Interactive world map with Leaflet.js**

An animated infographic map showing how MicroSims spread globally, connecting teachers and students through open educational resources. Watch knowledge flow from creators to libraries to schools worldwide.

[View Global Impact](./global-impact/index.md){ .md-button .md-button--primary }

**Key Features:** Leaflet.js map, animated connections, time slider, statistics panel, zoom/pan


### Causal Loop Diagram: MicroSim Growth

**Systems thinking visualization with vis-network**

An interactive causal loop diagram showing reinforcing feedback loops in the MicroSim ecosystem. Click on nodes and edges to explore how MicroSims, Intelligent Textbooks, and Teacher Awareness create a virtuous cycle of growth.

[View MicroSim Growth](./microsim-growth/index.md){ .md-button .md-button--primary }

**Key Features:** vis-network library, interactive nodes/edges, feedback loop indicators

## Process Documentation

### Workflow Example: MicroSim Creation

**Mermaid flowchart diagram**

An interactive workflow diagram illustrating the complete process teachers follow when creating MicroSims with AI assistance. Shows how learning objectives transform into working simulations in minutes rather than months.

[View MicroSim Creation Workflow](./microsim-creation-workflow/index.md){ .md-button .md-button--primary }

**Key Features:** Mermaid.js flowchart, color-coded steps, decision points

## Additional Notable Examples

### Fractal Tree

**Recursive graphics and mathematical beauty**

An interactive fractal tree demonstrating recursion and self-similarity. Adjust branch angles and depth to create different tree patterns.

[View Fractal Tree](./fractal-tree/index.md){ .md-button .md-button--primary }


### Conway's Game of Life

**Cellular automata simulation**

The classic cellular automaton demonstrating emergent behavior from simple rules. Watch patterns evolve, stabilize, or oscillate based on initial configurations.

[View Conway's Game of Life](./conway-game-of-life/index.md){ .md-button .md-button--primary }

### Neural Network

**Machine learning visualization**

Visual representation of a neural network showing nodes, layers, and connections. Helps students understand the basic architecture of AI systems.

[View Neural Network](./neural-network/index.md){ .md-button .md-button--primary }


## Summary Table

| MicroSim | Primary Feature | Library |
|----------|-----------------|---------|
| Bouncing Ball | Animation + Controls | p5.js |
| Temperature & Pressure | Particle Physics | p5.js |
| Sine Wave | Math Visualization | p5.js |
| String Harmonics | Sound Output | p5.js + p5.sound |
| FFT Microphone | Audio Input | p5.js + p5.sound |
| Learning Modality | Bar Chart | Chart.js |
| Global Impact | Interactive Map | Leaflet.js |
| MicroSim Growth | Causal Loop Diagram | vis-network |
| Creation Workflow | Flowchart | Mermaid.js |

## Next Steps

1. **Try the examples** - Click through each MicroSim to see them in action
2. **View the source** - Each MicroSim has a link to edit in the p5.js editor
3. **Explore the gallery** - Browse all 100+ MicroSims in our [Gallery](./gallery.md)
4. **Create your own** - Follow our [Getting Started Guide](../setup/index.md)
