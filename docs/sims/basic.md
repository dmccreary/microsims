# Basic MicroSims

Although we have over 100 MicroSims to demonstrate, we've selected these basic examples to showcase the range of capabilities available for generating high-quality interactive simulations that can have a big impact on your students.

These examples progress from simple animations to more complex visualizations, demonstrating different features and use cases.

## Summary Table

| MicroSim | Primary Feature | Library |
|----------|-----------------|---------|
| [Bouncing Ball](#bouncing-ball) | Animation + Controls | p5.js |
| [Temperature & Pressure](#temperature-and-pressure) | Particle Physics | p5.js |
| [Sine Wave](#sine-wave) | Math Visualization | p5.js |
| [String Harmonics](#sound-example-string-harmonics) | Sound Output | p5.js + p5.sound |
| [FFT Microphone](#microphone-example-fft-frequency-visualization) | Audio Input | p5.js + p5.sound |
| [Learning Modality](#chart-example-learning-modality-effectiveness) | Bar Chart | Chart.js |
| [Global Impact](#map-example-global-impact) | Interactive Map | Leaflet.js |
| [MicroSim Growth](#causal-loop-diagram-microsim-growth) | Causal Loop Diagram | vis-network |
| [Creation Workflow](#workflow-example-microsim-creation) | Flowchart | Mermaid.js |
| [Fractal Tree](#fractal-tree) | Recursive Graphics | p5.js |
| [Conway's Game of Life](#conways-game-of-life) | Cellular Automata | p5.js |
| [Neural Network](#neural-network) | ML Architecture | p5.js |

## Core Examples

### Bouncing Ball

**The "Hello World!" of MicroSims**

Our simplest example demonstrates the essential elements of a width-responsive MicroSim: animated graphics with user interaction. A ball bounces within the drawing region while a slider in the control area adjusts the speed.
<iframe src="/microsims/sims/bouncing-ball/main.html" width="100%" height="450px" scrolling="no"></iframe>
[Go to the Bouncing Ball MicroSim Page](./bouncing-ball/index.md)

**Key Features:** Animation, slider control, responsive design, start/pause button

### Temperature and Pressure

**Physics simulation with visual feedback**

This MicroSim demonstrates the relationship between temperature, molecular motion, and gas pressure. As temperature increases, atoms move faster and collide with container walls more frequently. Features a unique ice/fire visual indicator showing phase transitions at 0°C.

<iframe src="/microsims/sims/temp-and-pressure/main.html" width="100%" height="482px" scrolling="no"></iframe>
[Go to the Temperature and Pressure MicroSim Page](./temp-and-pressure/index.md){ .md-button .md-button--primary }

**Key Features:** Particle simulation, temperature slider (-50°C to 100°C), Celsius/Fahrenheit toggle, real-time pressure measurement, color-coded atoms

### Sine Wave

**Interactive function visualization**

A static sine wave displayed on a Cartesian coordinate grid with three sliders controlling amplitude, period, and phase. Students can explore how each parameter affects the wave shape.

<iframe src="/microsims/sims/sine-wave/main.html" width="100%" height="482px" scrolling="no"></iframe>
[Go to the Sine Wave MicroSim Page](./sine-wave/index.md)

**Key Features:** Multiple sliders, coordinate system, mathematical visualization

## Specialized Features

### Sound Example: String Harmonics

**Audio output with p5.sound library**

Demonstrates string harmonics with an animated vibrating string. When "Enable Sound" is checked, an oscillator plays a tone that matches the visual frequency. Adjust the frequency slider to hear and see harmonics from 1 to 16.

<iframe src="/microsims/sims/string-harmonics/main.html" width="100%" height="200px" scrolling="no"></iframe>
[Go to the String Harmonics MicroSim Page](./string-harmonics/index.md)

**Key Features:** Sound generation, checkbox control, oscillator, frequency visualization

### Microphone Example: FFT Frequency Visualization

**Audio input with real-time analysis**

Captures microphone input and displays a real-time frequency spectrum using Fast Fourier Transform (FFT). Color-coded bars show low frequencies (blue) to high frequencies (red), with peak frequency detection.

<iframe src="/microsims/sims/fft-mic/main.html" width="100%" height="450px" scrolling="no"></iframe>
[Go to the FFT Microphone MicroSim Page](./fft-mic/index.md)

**Key Features:** Microphone input, FFT analysis, frequency spectrum, start/stop control

## Visualization Types

### Chart Example: Learning Modality Effectiveness

**Interactive bar chart with Chart.js**

A horizontal bar chart visualizing knowledge retention rates across different learning modalities. Demonstrates why interactive simulations produce superior learning outcomes compared to passive methods like reading or watching videos.  Note that you can hover over each bar to have the MicroSim display an explanation of each modality.
In order to be classified as an educational MicroSim there **MUST** be some interactivity with the user.
Hovertext is a good example since we can log hovertext events to predict understanding.

<iframe src="/microsims/sims/learning-modality-effectiveness/main.html" width="100%" height="470px" scrolling="no"></iframe>
[Go to the Learning Modality Effectiveness MicroSim Page](./learning-modality-effectiveness/index.md)

**Key Features:** Chart.js integration, hover tooltips, animated bar growth, annotations


### Map Example: Global Impact

**Interactive world map with Leaflet.js**

An animated infographic map showing how MicroSims spread globally, connecting teachers and students through open educational resources. Watch knowledge flow from creators to libraries to schools worldwide.

<iframe src="/microsims/sims/global-impact/main.html" width="100%" height="600px" scrolling="no"></iframe>
[Go to the Global Impact MicroSim Page](./global-impact/index.md)

**Key Features:** Leaflet.js map, animated connections, time slider, statistics panel, zoom/pan

### Causal Loop Diagram: MicroSim Growth

**Systems thinking visualization with vis-network**

An interactive causal loop diagram showing reinforcing feedback loops in the MicroSim and intelligent textbook ecosystem. Hover over the nodes and edges to explore how MicroSims, Intelligent Textbooks, and Teacher Awareness create a virtuous cycle of growth.

<iframe src="/microsims/sims/microsim-growth/main.html" width="100%" height="550px" scrolling="no"></iframe>
[Go to the MicroSim Growth MicroSim Page](./microsim-growth/index.md)

**Key Features:** vis-network library, interactive nodes/edges, feedback loop indicators

## Process Documentation

### Workflow Example: MicroSim Creation

**Mermaid flowchart diagram**

An interactive workflow diagram illustrating the complete process teachers follow when creating MicroSims with AI assistance. Shows how learning objectives transform into working simulations in minutes rather than months.
Note that every element in the Mermaid diagram has a hovertext that appears when a user hovers
over the item.  Hover tooltips are **REQUIRED** feature of all static diagrams like Mermaid so that we
can add code to log interactive events with the xAPI interface that can be monitored for recommending future actions by students.

<iframe src="/microsims/sims/microsim-creation-workflow/main.html" width="100%" height="650px" scrolling="no"></iframe>
[Go to the MicroSim Creation Workflow MicroSim Page](./microsim-creation-workflow/index.md)

**Key Features:** Mermaid.js flowchart, color-coded steps, decision points

## Additional Notable Examples

### Fractal Tree

**Recursive graphics and mathematical beauty**

An interactive fractal tree demonstrating recursion and self-similarity. Adjust branch angles and depth to create different tree patterns.  Note that these simple interactive MicroSims help students visualize complex concepts like recursion and fractals.

<iframe src="/microsims/sims/fractal-tree/main.html" width="100%" height="574px" scrolling="no"></iframe>
[Go to the Fractal Tree MicroSim Page](./fractal-tree/index.md)

**Key Features:** Simple p5.js, Recursive graphics, adjustable branch angles and depth

### Conway's Game of Life

**Cellular automata simulation**

The classic cellular automaton demonstrating emergent behavior from simple rules. Watch patterns evolve, stabilize, or oscillate based on initial configurations.

<iframe src="/microsims/sims/conway-game-of-life/main.html" width="100%" height="450px" scrolling="no"></iframe>
[Go to the Conway's Game of Life MicroSim Page](./conway-game-of-life/index.md)

**Key Features:** Cellular automata, emergent behavior, pattern evolution

### Neural Network

**Machine learning visualization**

Visual representation of a neural network showing nodes, layers, and connections. Helps students understand the basic architecture of a deep neural network including weights and biases and to be able to understand how model parameters are counted.

<iframe src="/microsims/sims/neural-network/main.html" width="100%" height="480px" scrolling="no"></iframe>
[Go to the Neural Network MicroSim Page](./neural-network/index.md)

**Key Features:** Neural network architecture, nodes, layers, connections

## Next Steps

1. **Try the examples** - Click through each MicroSim to see them in action
2. **View the source** - Each MicroSim has a link to edit in the p5.js editor
3. **Explore the gallery** - Browse all 100+ MicroSims in our [Gallery](./gallery.md)
4. **Create your own** - Follow our [Getting Started Guide](../setup/index.md)
