# Showcase MicroSim Shortlist

**Date:** 2026-10-01
**Source data:** `../search-microsims/docs/search/microsims-data.json` (3,764 MicroSims in 90 repositories)
**Purpose:** candidates for the 30 "showcase" MicroSims that best show how a MicroSim explains a complex concept

## How the shortlist was built

1. Dropped the 760 entries marked `scaffold` and kept the 2,255 implemented p5.js sims. The Mermaid, vis-network, Chart.js and timeline entries were scanned by title only, because most are static diagrams or data displays rather than concept simulations.
2. Read the title and description of every remaining candidate and kept the ones where the concept is hard to explain in static text and the interaction shows cause and effect.
3. Loaded each of the 143 shortlisted sims in headless Chromium from the live GitHub Pages site and recorded the HTTP status, whether a canvas was drawn, and any console errors. 129 loaded cleanly; 14 did not.
4. Looked at a screenshot of the initial state of 44 of them. No controls were operated, so "OK" means the sim loads and draws, not that every control works.

The shortlist has 143 entries, not 130; the earlier "about 130" was an estimate.

**Legend:** ★ = one of the 30 picks. "Seen" = initial screenshot reviewed.

## The 30 picks

| # | MicroSim | Repository | What it makes visible |
|---|----------|------------|-----------------------|
| 1 | [Secant Lines Approaching Tangent Line](https://dmccreary.github.io/calculus/sims/secant-to-tangent/) | calculus | The derivative as a limit: shrink h and the secant line turns into the tangent. |
| 2 | [Pythagorean Theorem MicroSim](https://dmccreary.github.io/microsims/microsims-old/pythagorean-theorem/) | microsims | Squares drawn on the three sides show the two smaller areas adding up to the largest. |
| 3 | [Euler's Formula Explorer](https://dmccreary.github.io/signal-processing/sims/euler-formula-explorer/) | signal-processing | A point circling the unit circle draws cos and sin at the same time, which is Euler's formula. |
| 4 | [Eigenvector Transformation Visualization](https://dmccreary.github.io/linear-algebra/sims/eigenvector-transformation/) | linear-algebra | Eigenvectors are the directions a transformation does not turn; every other vector visibly rotates. |
| 5 | [SVD Image Compression](https://dmccreary.github.io/linear-algebra/sims/svd-image-compression/) | linear-algebra | Rebuild an image from its first k singular values and watch the error image fade. |
| 6 | [Central Limit Theorem Demonstration](https://dmccreary.github.io/statistics-course/sims/clt-demonstration/) | statistics-course | Sample means from a skewed population pile up into a bell curve. |
| 7 | [Confidence Level Simulator](https://dmccreary.github.io/statistics-course/sims/confidence-level-simulator/) | statistics-course | Generate many intervals and count how many capture the true value: what "95% confident" means. |
| 8 | [Doppler Effect Simulation](https://dmccreary.github.io/intro-to-physics-course/sims/doppler-effect/) | intro-to-physics-course | Wavefronts bunch up ahead of a moving source and stretch out behind it. |
| 9 | [Driven Oscillator Interactive MicroSim](https://dmccreary.github.io/intro-to-physics-course/sims/driven-oscillator/) | intro-to-physics-course | Sweep the driving frequency through the natural frequency and the amplitude peaks: resonance. |
| 10 | [Quantum Tunneling Probability Explorer](https://dmccreary.github.io/semiconductor-physics-course/sims/quantum-tunneling-explorer/) | semiconductor-physics-course | A wave function leaks through a barrier; width and height set the transmission probability. |
| 11 | [Le Chatelier's Principle Explorer](https://dmccreary.github.io/chemistry/sims/le-chatelier-explorer/) | chemistry | Stress the Haber equilibrium (concentration, pressure, temperature) and watch it shift. |
| 12 | [Galvanic Cell Visualizer](https://dmccreary.github.io/chemistry/sims/galvanic-cell-visualizer/) | chemistry | Electron flow, salt-bridge ions and the Nernst potential in one animated cell. |
| 13 | [Predator-Prey Population Dynamics](https://dmccreary.github.io/ecology/sims/predator-prey/) | ecology | Lotka-Volterra cycles with animated animals above a live population graph. |
| 14 | [Genetic Drift Simulator](https://dmccreary.github.io/biology/sims/genetic-drift/) | biology | Allele frequencies wander at random, and small populations fix or lose alleles fastest. |
| 15 | [Operon Regulation Simulator](https://dmccreary.github.io/biology/sims/operon-regulation/) | biology | Gene regulation as switch logic: repressor, inducer and operator states turn the operon on and off. |
| 16 | [Bathtub](https://dmccreary.github.io/microsims/microsims-old/bathtub/) | microsims | A stock, an inflow and an outflow: the level changes with the net flow, not the inflow. |
| 17 | [COVID-19 SEIR Wave Simulator](https://dmccreary.github.io/public-health/sims/covid-seir/) | public-health | Transmission rate, vaccination and variants produce epidemic waves from a compartment model. |
| 18 | [Revenue Maximum](https://dmccreary.github.io/microsims/microsims-old/revenue-maximum/) | microsims | Revenue is a rectangle under the demand curve; the linked chart shows where it peaks. |
| 19 | [Tragedy of the Commons Simulator](https://dmccreary.github.io/economics-course/sims/tragedy-commons/) | economics-course | Each fisher acts sensibly and the shared stock still collapses. |
| 20 | [Maze Solver](https://dmccreary.github.io/microsims/microsims-old/maze-solver/) | microsims | Breadth-first search floods a generated maze and leaves the shortest path. |
| 21 | [Sorting Algorithm Race](https://dmccreary.github.io/automating-instructional-design/sims/sorting-algorithm-race/) | automating-instructional-design | Four sorting algorithms race on the same array, making growth rates visible. |
| 22 | [Recursive Call Stack Visualizer](https://dmccreary.github.io/computer-science/sims/recursive-call-stack/) | computer-science | Stack frames build up and unwind in step with the highlighted line of code. |
| 23 | [Gradient Descent Interactive Visualizer](https://dmccreary.github.io/linear-algebra/sims/gradient-descent/) | linear-algebra | A path walks down a loss surface; the learning rate decides whether it converges or overshoots. |
| 24 | [Attention Mechanism Step-by-Step](https://dmccreary.github.io/linear-algebra/sims/attention-mechanism/) | linear-algebra | Query, key and value projections computed step by step into attention weights. |
| 25 | [Adversarial Example Explorer](https://dmccreary.github.io/cybersecurity/sims/adversarial-example-explorer/) | cybersecurity | A perturbation too small to see flips the classifier from one digit to another. |
| 26 | [AI Fairness Trade-offs Explorer](https://dmccreary.github.io/ethics-course/sims/ai-fairness-tradeoffs/) | ethics-course | With different base rates, the fairness metrics cannot all be satisfied at once. |
| 27 | [H Bridge](https://dmccreary.github.io/microsims/microsims-old/h-bridge/) | microsims | Four switches steer current through a motor in either direction; the wrong pair shorts the supply. |
| 28 | [Interactive Feedback Loop Simulator](https://dmccreary.github.io/control-systems/sims/feedback-loop-simulator/) | control-systems | Controller gain and plant time constant shape the closed-loop step response. |
| 29 | [Arms Race Dynamics — The Security Dilemma Loop](https://dmccreary.github.io/us-history/sims/arms-race-dynamics/) | us-history | The security dilemma as a reinforcing loop, with a treaty acting as the balancing loop. |
| 30 | [Inoculation Theory Visualizer](https://dmccreary.github.io/public-health/sims/inoculation-theory-sim/) | public-health | Misinformation spreads through two populations, one prebunked and one not. |

## Sims on the shortlist that did not load cleanly

| MicroSim | Repository | Problem |
|----------|------------|---------|
| [Local Linearity Zoom](https://dmccreary.github.io/calculus/sims/local-linearity/) | calculus | JavaScript error: `Unexpected identifier 'placement'` |
| [Galton Board](https://dmccreary.github.io/microsims/microsims-old/galton-board/) | microsims | Not found at the expected `main.html` URL |
| [Osmosis and Water Potential Simulator](https://dmccreary.github.io/biology/sims/osmosis-simulator/) | biology | JavaScript error: `Missing initializer in const declaration` |
| [Prisoners Dilemma](https://dmccreary.github.io/microsims/microsims-old/prisoners-dilemma/) | microsims | Not found at the expected `main.html` URL |
| [PageRank](https://dmccreary.github.io/graph-algorithms/sims/page-rank/) | graph-algorithms | Not found at the expected `main.html` URL |
| [Force Directed Graph Layout](https://dmccreary.github.io/graph-algorithms/sims/force/) | graph-algorithms | Not found at the expected `main.html` URL |
| [Breadth First Search](https://dmccreary.github.io/graph-algorithms/sims/bfs/) | graph-algorithms | Not found at the expected `main.html` URL |
| [Kalman Filter Visualizer](https://dmccreary.github.io/linear-algebra/sims/kalman-filter/) | linear-algebra | JavaScript error: `Cannot read properties of undefined (reading 'value')` |
| [Autoregressive MicroSim](https://dmccreary.github.io/Digital-Transformation-with-AI-Spring-2026/sims/autoregressive/) | Digital-Transformation-with-AI-Spring-2026 | Not found at the expected `main.html` URL |
| [Bias-Variance Dartboard](https://dmccreary.github.io/data-science-course/sims/bias-variance-dartboard/) | data-science-course | JavaScript error: `Failed to load resource: the server responded with a status of 404 ()` |
| [Self-Attention Visualization](https://dmccreary.github.io/Digital-Transformation-with-AI-Spring-2026/sims/self-attention-visualization/) | Digital-Transformation-with-AI-Spring-2026 | Not found at the expected `main.html` URL |
| [Setup and Hold Time Explorer](https://dmccreary.github.io/intelligent-textbook-ee2301/sims/setup-hold-metastability-explorer/) | intelligent-textbook-ee2301 | Not found at the expected `main.html` URL |
| [Moore vs Mealy Machine Comparison](https://dmccreary.github.io/intelligent-textbook-ee2301/sims/moore-mealy-comparison/) | intelligent-textbook-ee2301 | Not found at the expected `main.html` URL |
| [Flip Flop MicroSim](https://dmccreary.github.io/digital-electronics/sims/flip-flop/) | digital-electronics | JavaScript error: `drawNAND is not defined` |

The 404 entries may be published at a different path, or the repository may not have a GitHub Pages site; only the `sims/<name>/main.html` path was tried (`microsims-old/<name>/main.html` for this repository).

## Full shortlist by subject

### Mathematics (22)

| Pick | MicroSim | Repository | Load check | Seen | Description from the search index |
|------|----------|------------|------------|------|-----------------------------------|
| ★ | [Eigenvector Transformation Visualization](https://dmccreary.github.io/linear-algebra/sims/eigenvector-transformation/) | linear-algebra | OK | yes | Interactive visualization demonstrating how eigenvectors maintain their direction under linear transformation while other vectors change direction. |
| ★ | [Euler's Formula Explorer](https://dmccreary.github.io/signal-processing/sims/euler-formula-explorer/) | signal-processing | OK | yes | Interactive visualization demonstrating Euler's formula e^(iθ) = cos(θ) + i·sin(θ) with synchronized unit circle rotation and sine/cosine wave traces. |
| ★ | [Pythagorean Theorem MicroSim](https://dmccreary.github.io/microsims/microsims-old/pythagorean-theorem/) | microsims | OK |  | A MicroSim that visually demonstrates the Pythagorean Theorem by showing how the sum of the squares of the sides are are equal to square of hypotenuse. |
| ★ | [SVD Image Compression](https://dmccreary.github.io/linear-algebra/sims/svd-image-compression/) | linear-algebra | OK | yes | Interactive demonstration of image compression using truncated SVD |
| ★ | [Secant Lines Approaching Tangent Line](https://dmccreary.github.io/calculus/sims/secant-to-tangent/) | calculus | OK | yes | Interactive visualization showing how secant lines approach the tangent line as h approaches 0, demonstrating the limit definition of the derivative for f(x) = x^2 |
|  | [Accumulation Function Explorer](https://dmccreary.github.io/calculus/sims/accumulation-function/) | calculus | OK |  | Visualizes how the accumulation function F(x) = integral from a to x of f(t) dt grows as x moves, showing the relationship between integrand and accumulated area. |
|  | [Convolution](https://dmccreary.github.io/signal-processing/sims/convolution/) | signal-processing | OK |  | Interactive visualization demonstrating convolution as a measure of overlap between functions using a sliding square function over a stationary triangle. |
|  | [FTC Connection Visualization](https://dmccreary.github.io/calculus/sims/ftc-connection/) | calculus | OK | yes | Shows how FTC Part 1 and Part 2 are two sides of the same relationship, demonstrating that differentiation and integration are inverse operations. |
|  | [Gimbal Lock Demonstration](https://dmccreary.github.io/linear-algebra/sims/gimbal-lock-demo/) | linear-algebra | OK | yes | Interactive demonstration of gimbal lock using a physical gimbal mechanism with three nested rings showing loss of degree of freedom. |
|  | [Koch Snowflake](https://dmccreary.github.io/geometry-course/sims/koch-snowflake/) | geometry-course | OK |  | An interactive MicroSim demonstrating the Koch snowflake fractal with adjustable recursion depth and size controls. |
|  | [Linear Transformation Fundamentals Visualizer](https://dmccreary.github.io/linear-algebra/sims/linear-transform-basics/) | linear-algebra | OK |  | Interactive visualization showing how linear transformations preserve grid structure and are determined by where basis vectors map. |
|  | [Local Linearity Zoom](https://dmccreary.github.io/calculus/sims/local-linearity/) | calculus | JavaScript error: `Unexpected identifier 'placement'` |  | Demonstrate how curves appear linear when zoomed in sufficiently, illustrating tangent approximation |
|  | [Product Rule Visualizer](https://dmccreary.github.io/calculus/sims/product-rule-viz/) | calculus | OK |  | Illustrate the product rule geometrically using the area interpretation |
|  | [Pythagorean Theorem](https://dmccreary.github.io/geometry-course/sims/pythagorean-theorem/) | geometry-course | OK |  | An interactive MicroSim demonstrating the Pythagorean theorem (a² + b² = c²) with adjustable triangle sides and visual proof using squares. |
|  | [SVD Compression Visualizer](https://dmccreary.github.io/linear-algebra/sims/svd-compression-visualizer/) | linear-algebra | OK |  | Interactive demonstration of image compression using truncated Singular Value Decomposition with quality metrics and singular value visualization. |
|  | [SVD Geometric Interpretation](https://dmccreary.github.io/linear-algebra/sims/svd-geometry/) | linear-algebra | OK |  | Visualize SVD as a sequence of rotation-scaling-rotation transformations on the unit circle |
|  | [Sine and Cosine Circle](https://dmccreary.github.io/geometry-course/sims/sine-and-cosine-circle/) | geometry-course | OK |  | An interactive MicroSim demonstrating how sine and cosine values relate to a point moving around the unit circle, with corresponding graph visualization. |
|  | [Sum Formula Geometric Proof](https://dmccreary.github.io/pre-calc/sims/sum-formula-proof/) | pre-calc | OK |  | (boilerplate description in the search index) |
|  | [Transformation Composition Visualizer](https://dmccreary.github.io/linear-algebra/sims/transform-composition/) | linear-algebra | OK |  | Demonstrate that the order of transformations matters by comparing T then S versus S then T side by side. |
|  | [Unit Circle to Sine Graph Animation](https://dmccreary.github.io/pre-calc/sims/circle-to-sine-graph/) | pre-calc | OK |  | (boilerplate description in the search index) |
|  | [Wave Sums and Fourier Synthesis](https://dmccreary.github.io/microsims/microsims-old/wave-sums/) | microsims | OK |  | Interactive demonstration of wave superposition showing how complex waveforms are created by adding simple sine waves - fundamental to understanding Fourier analysis... |
|  | [ln(x) as Area Under 1/t](https://dmccreary.github.io/calculus/sims/ln-as-area/) | calculus | OK |  | Interactive visualization showing the natural logarithm as the accumulated area under the curve y = 1/t from t = 1 to t = x |

### Statistics (11)

| Pick | MicroSim | Repository | Load check | Seen | Description from the search index |
|------|----------|------------|------------|------|-----------------------------------|
| ★ | [Central Limit Theorem Demonstration](https://dmccreary.github.io/statistics-course/sims/clt-demonstration/) | statistics-course | OK | yes | Interactive visualization demonstrating the Central Limit Theorem by showing how sampling distributions of means become approximately normal regardless of the... |
| ★ | [Confidence Level Simulator](https://dmccreary.github.io/statistics-course/sims/confidence-level-simulator/) | statistics-course | OK | yes | Interactive simulation demonstrating the true meaning of confidence level by generating many confidence intervals and showing that approximately C% of C% confidence... |
|  | [Bayesian Diagnostic Reasoning MicroSim](https://dmccreary.github.io/modeling-healthcare-data/sims/bayesian-diagnostic-reasoning/) | modeling-healthcare-data | OK |  | (boilerplate description in the search index) |
|  | [Bell Curve Emergence](https://dmccreary.github.io/data-science-course/sims/bell-curve/) | data-science-course | OK |  | Interactive simulation demonstrating how a bell curve emerges from the Central Limit Theorem when sampling from various distributions |
|  | [Confidence Interval Visualizer](https://dmccreary.github.io/ecology/sims/confidence-interval-viz/) | ecology | OK |  | Interactive simulation where students draw repeated samples from a fish population to build intuition about confidence intervals, margin of error, and sample size effects |
|  | [Galton Board](https://dmccreary.github.io/microsims/microsims-old/galton-board/) | microsims | Not found at the expected `main.html` URL |  | (boilerplate description in the search index) |
|  | [Least Squares](https://dmccreary.github.io/microsims/microsims-old/least-squares/) | microsims | OK |  | (boilerplate description in the search index) |
|  | [Least Squares MicroSim](https://dmccreary.github.io/data-science-course/sims/least-squares/) | data-science-course | OK |  | An interactive simulation demonstrating how the least-squares algorithm works, with sliders for controlling slope and intercept to minimize squared residuals |
|  | [Mean as Balance Point](https://dmccreary.github.io/statistics-course/sims/mean-balance-point/) | statistics-course | OK |  | Interactive visualization demonstrating that the mean represents the balance point of a distribution. Students can drag data points and observe how the mean shifts in... |
|  | [P-Value Visualizer](https://dmccreary.github.io/statistics-course/sims/p-value-visualizer/) | statistics-course | OK |  | Interactive visualization of p-values as shaded areas under the standard normal distribution. Students can adjust z-scores and toggle between one-sided and two-sided... |
|  | [Type I and Type II Error Visualizer](https://dmccreary.github.io/statistics-course/sims/type-error-visualizer/) | statistics-course | OK | yes | Interactive simulation demonstrating Type I (false positive) and Type II (false negative) errors in hypothesis testing. Students toggle between true and false null... |

### Physics (15)

| Pick | MicroSim | Repository | Load check | Seen | Description from the search index |
|------|----------|------------|------------|------|-----------------------------------|
| ★ | [Doppler Effect Simulation](https://dmccreary.github.io/intro-to-physics-course/sims/doppler-effect/) | intro-to-physics-course | OK | yes | An interactive MicroSim demonstrating how source motion affects observed frequency through wavefront compression and expansion. Shows wavefront behavior for... |
| ★ | [Driven Oscillator Interactive MicroSim](https://dmccreary.github.io/intro-to-physics-course/sims/driven-oscillator/) | intro-to-physics-course | OK | yes | Interactive simulation showing how a driven oscillator responds to different driving frequencies, demonstrating resonance when the driving frequency matches the... |
| ★ | [Quantum Tunneling Probability Explorer](https://dmccreary.github.io/semiconductor-physics-course/sims/quantum-tunneling-explorer/) | semiconductor-physics-course | OK | yes | Students will calculate the tunnel probability through a rectangular barrier and evaluate (Evaluate, L5) how barrier width and height affect tunneling in... |
|  | [Brownian Motion](https://dmccreary.github.io/microsims/microsims-old/brownian-motion/) | microsims | OK |  | Interactive simulation demonstrating Brownian motion - the random movement of gas molecules within a confined chamber. Features controls for temperature, molecule... |
|  | [Capacitor Charging and Discharging](https://dmccreary.github.io/intro-to-physics-course/sims/capacitor-charging-discharging/) | intro-to-physics-course | OK |  | Interactive simulation showing how capacitors store and release energy in RC circuits, demonstrating exponential charging and discharging behavior with adjustable... |
|  | [Electric Field Lines Visualization](https://dmccreary.github.io/intro-to-physics-course/sims/electric-field-lines/) | intro-to-physics-course | OK |  | Interactive simulation visualizing electric field patterns around point charges. Users can adjust charge magnitudes, drag charges to reposition them, and observe how... |
|  | [Exoplanet Transit Detection](https://dmccreary.github.io/intro-to-physics-course/sims/exoplanet/) | intro-to-physics-course | OK |  | Interactive simulation demonstrating how astronomers detect exoplanets using the transit method, showing brightness dips as a planet passes in front of its star with... |
|  | [Gravitational Attractor](https://dmccreary.github.io/intro-to-physics-course/sims/gravitational-attractor/) | intro-to-physics-course | OK |  | Interactive simulation demonstrating gravitational attraction between particles and a central attractor, featuring collision physics, path tracing, and orbital... |
|  | [Multistage Rocket Efficiency](https://dmccreary.github.io/intro-to-physics-course/sims/multistage-rocket/) | intro-to-physics-course | OK |  | Interactive simulation demonstrating why multistage rockets are more efficient than single-stage rockets. Shows stage separation and the advantage of discarding empty... |
|  | [P-N Junction Voltage Explorer](https://dmccreary.github.io/semiconductor-physics-course/sims/pn-junction/) | semiconductor-physics-course | OK | yes | Interactive simulation of a silicon p-n junction under bias. A voltage slider sweeps from -5 V reverse bias to +0.75 V forward bias while the depletion region, fixed... |
|  | [Roller Coaster Energy](https://dmccreary.github.io/intro-to-physics-course/sims/roller-coaster-energy/) | intro-to-physics-course | OK |  | Interactive simulation showing energy transformations in a roller coaster. Demonstrates conservation of mechanical energy with PE to KE conversions. |
|  | [Rotational Inertia Race](https://dmccreary.github.io/intro-to-physics-course/sims/rotational-inertia-race/) | intro-to-physics-course | OK | yes | Interactive simulation racing objects with different moments of inertia down an incline. Demonstrates why solid spheres beat hollow spheres and cylinders. |
|  | [Standing Waves](https://dmccreary.github.io/intro-to-physics-course/sims/standing-waves/) | intro-to-physics-course | OK |  | Interactive simulation showing standing wave patterns with nodes and antinodes. Adjust frequency to observe different harmonic modes on a string. |
|  | [Temperature and Pressure](https://dmccreary.github.io/microsims/microsims-old/temp-and-pressure/) | microsims | OK |  | Interactive simulation demonstrating the relationship between temperature, molecular motion, and gas pressure with visual ice/fire indicators and dual temperature... |
|  | [Wave Interference](https://dmccreary.github.io/intro-to-physics-course/sims/wave-interference/) | intro-to-physics-course | OK |  | Interactive simulation demonstrating constructive and destructive wave interference. Shows how waves superpose based on their relative phases. |

### Chemistry (6)

| Pick | MicroSim | Repository | Load check | Seen | Description from the search index |
|------|----------|------------|------------|------|-----------------------------------|
| ★ | [Galvanic Cell Visualizer](https://dmccreary.github.io/chemistry/sims/galvanic-cell-visualizer/) | chemistry | OK | yes | Animated galvanic cell diagram with salt-bridge ions, electron flow, and Nernst-calculated potentials tied to live cell notation. |
| ★ | [Le Chatelier's Principle Explorer](https://dmccreary.github.io/chemistry/sims/le-chatelier-explorer/) | chemistry | OK | yes | Interactively apply concentration, pressure/volume, temperature, inert-gas, and catalyst stresses to the Haber equilibrium while monitoring particles, bar charts, and... |
|  | [Dissolution Equilibrium Visualizer](https://dmccreary.github.io/chemistry/sims/dissolution-equilibrium-visualizer/) | chemistry | OK |  | Animate sparingly soluble salts dissolving, track the ion product Q vs Ksp, and demonstrate the common-ion effect with responsive controls. |
|  | [Ideal Gas Law Interactive Simulator](https://dmccreary.github.io/chemistry/sims/ideal-gas-law-simulator/) | chemistry | OK | yes | Piston-and-particles animation that lets students adjust P, V, T, and n while solving PV = nRT for any variable. |
|  | [Microstate Visualizer](https://dmccreary.github.io/chemistry/sims/microstate-visualizer/) | chemistry | OK |  | Interactive particle distribution showing microstate counts, probabilities, and entropy as particles occupy two halves of a container. |
|  | [VSEPR Molecular Geometry Builder](https://dmccreary.github.io/chemistry/sims/vsepr-geometry-builder/) | chemistry | OK |  | Interactive VSEPR model that animates electron/molecular geometries as electron groups and lone pairs change. |

### Biology and ecology (13)

| Pick | MicroSim | Repository | Load check | Seen | Description from the search index |
|------|----------|------------|------------|------|-----------------------------------|
| ★ | [Genetic Drift Simulator](https://dmccreary.github.io/biology/sims/genetic-drift/) | biology | OK | yes | (boilerplate description in the search index) |
| ★ | [Operon Regulation Simulator](https://dmccreary.github.io/biology/sims/operon-regulation/) | biology | OK | yes | (boilerplate description in the search index) |
| ★ | [Predator-Prey Population Dynamics](https://dmccreary.github.io/ecology/sims/predator-prey/) | ecology | OK | yes | Interactive MicroSim modeling Lotka-Volterra predator-prey oscillations with an animated meadow and real-time population graphs. |
|  | [Cancer Mutation Simulator](https://dmccreary.github.io/biology/sims/cancer-mutation-simulator/) | biology | OK | yes | Interactive MicroSim demonstrating the multi-hit model of colorectal cancer showing how 6 sequential mutations in proto-oncogenes and tumor suppressor genes... |
|  | [Emergence Simulator](https://dmccreary.github.io/ecology/sims/emergence-simulator/) | ecology | OK | yes | Interactive flocking simulation demonstrating how complex system-level patterns emerge from simple individual rules using the boids algorithm |
|  | [Greenhouse Effect Energy Balance](https://dmccreary.github.io/ecology/sims/greenhouse-effect/) | ecology | OK |  | Adjust CO2 and methane concentrations to see how greenhouse gases trap infrared radiation and raise Earth's surface temperature. |
|  | [Habitat Fragmentation Simulator](https://dmccreary.github.io/ecology/sims/habitat-fragmentation/) | ecology | OK |  | Convert habitat cells to developed land and observe how fragmentation reduces populations, creates edge effects, and isolates wildlife. |
|  | [Island Biogeography Simulator](https://dmccreary.github.io/ecology/sims/island-biogeography/) | ecology | OK |  | Interactive p5.js simulation demonstrating how island size and distance from mainland affect species richness through immigration and extinction dynamics |
|  | [Osmosis and Water Potential Simulator](https://dmccreary.github.io/biology/sims/osmosis-simulator/) | biology | JavaScript error: `Missing initializer in const declaration` |  | Interactive MicroSim that visualizes how solute potential, pressure potential, temperature, and tonicity drive osmotic water movement. |
|  | [PCR Amplification Step-Through Simulator](https://dmccreary.github.io/forensic-science/sims/pcr-amplification-simulator/) | forensic-science | OK |  | Step through one cycle of the polymerase chain reaction — Denaturation (94°C), Annealing (60°C), and Extension (72°C) — and watch the DNA transform at each stage. A... |
|  | [Resilience Ball-in-Basin Model](https://dmccreary.github.io/ecology/sims/resilience-basin/) | ecology | OK |  | Interactive MicroSim demonstrating ecosystem resilience and regime shifts using the ball-in-basin metaphor with adjustable disturbance and resilience. |
|  | [Tipping Points Explorer](https://dmccreary.github.io/ecology/sims/tipping-points/) | ecology | OK | yes | Interactive stability landscape showing how increasing global temperature triggers successive climate tipping points with nonlinear system responses and hysteresis |
|  | [cAMP Signaling Cascade](https://dmccreary.github.io/biology/sims/camp-signaling-cascade/) | biology | OK |  | Interactive step-through MicroSim of the GPCR-cAMP-PKA signal transduction pathway with amplification counter and PDE signal termination |

### Systems dynamics and public health (8)

| Pick | MicroSim | Repository | Load check | Seen | Description from the search index |
|------|----------|------------|------------|------|-----------------------------------|
| ★ | [Bathtub](https://dmccreary.github.io/microsims/microsims-old/bathtub/) | microsims | OK |  | (boilerplate description in the search index) |
| ★ | [COVID-19 SEIR Wave Simulator](https://dmccreary.github.io/public-health/sims/covid-seir/) | public-health | OK | yes | Interactive SEIR compartmental model for COVID-19 with controls for transmission rate, vaccination coverage, variant R0, and waning immunity. Overlays Delta vs... |
|  | [Feedback Loop Explorer](https://dmccreary.github.io/ecology/sims/feedback-loop-explorer/) | ecology | OK |  | Side-by-side animated comparison of reinforcing and balancing feedback loops with real-time graphs across multiple ecological scenarios |
|  | [ICU Surge Capacity Model](https://dmccreary.github.io/public-health/sims/icu-surge-capacity/) | public-health | OK |  | Interactive stock-and-flow simulation of ICU bed occupancy that lets students adjust admission rate, length of stay, baseline ICU beds, and surge-capacity expansions... |
|  | [Interactive Stock and Flow Sandbox](https://dmccreary.github.io/ecology/sims/stock-flow-sandbox/) | ecology | OK |  | Hands-on simulation where students manipulate inflow and outflow rates to explore accumulation, depletion, and dynamic equilibrium in ecological systems |
|  | [Reinforcing vs Balancing Loop Simulator](https://dmccreary.github.io/infographics/sims/reinforcing-vs-balancing/) | infographics | OK |  | Side-by-side comparison of reinforcing and balancing feedback loops with causal loop diagrams and animated time-series graphs. |
|  | [Stock-and-Flow Bathtub Model](https://dmccreary.github.io/public-health/sims/bathtub-model/) | public-health | OK |  | Interactive bathtub analogy illustrating stock-and-flow dynamics with an epidemic context — the stock of infected individuals is the water level, β controls the... |
|  | [Virus Spread Simulation](https://dmccreary.github.io/microsims/microsims-old/virus/) | microsims | OK |  | Interactive network simulation demonstrating how viruses spread through a population. Features adjustable infection probability and visualizes epidemic dynamics... |

### Economics and finance (8)

| Pick | MicroSim | Repository | Load check | Seen | Description from the search index |
|------|----------|------------|------------|------|-----------------------------------|
| ★ | [Revenue Maximum](https://dmccreary.github.io/microsims/microsims-old/revenue-maximum/) | microsims | OK |  | Two-panel interactive simulation showing the relationship between price, quantity demanded, and total revenue, demonstrating where maximum revenue occurs on the... |
| ★ | [Tragedy of the Commons Simulator](https://dmccreary.github.io/economics-course/sims/tragedy-commons/) | economics-course | OK | yes | (boilerplate description in the search index) |
|  | [Active vs Indexed Fund Comparison](https://dmccreary.github.io/personal-finance/sims/active-vs-indexed/) | personal-finance | OK |  | Interactive simulation comparing investment growth between actively managed funds with fees and zero-fee index funds over time, demonstrating the compounding impact... |
|  | [Fractional Reserve Money Multiplier](https://dmccreary.github.io/economics-course/sims/money-multiplier/) | economics-course | OK |  | (boilerplate description in the search index) |
|  | [Prisoners Dilemma](https://dmccreary.github.io/microsims/microsims-old/prisoners-dilemma/) | microsims | Not found at the expected `main.html` URL |  | (boilerplate description in the search index) |
|  | [Profit Maximum](https://dmccreary.github.io/microsims/microsims-old/profit-maximum/) | microsims | OK |  | Interactive simulation demonstrating why profit-maximizing price differs from revenue-maximizing price when production costs are considered. Shows overlaid revenue... |
|  | [Supply And Demand](https://dmccreary.github.io/microsims/microsims-old/supply-and-demand/) | microsims | OK |  | (boilerplate description in the search index) |
|  | [Tax Incidence Explorer](https://dmccreary.github.io/economics-course/sims/tax-incidence-explorer/) | economics-course | OK | yes | (boilerplate description in the search index) |

### Computer science and algorithms (15)

| Pick | MicroSim | Repository | Load check | Seen | Description from the search index |
|------|----------|------------|------------|------|-----------------------------------|
| ★ | [Maze Solver](https://dmccreary.github.io/microsims/microsims-old/maze-solver/) | microsims | OK |  | (boilerplate description in the search index) |
| ★ | [Recursive Call Stack Visualizer](https://dmccreary.github.io/computer-science/sims/recursive-call-stack/) | computer-science | OK | yes | (boilerplate description in the search index) |
| ★ | [Sorting Algorithm Race](https://dmccreary.github.io/automating-instructional-design/sims/sorting-algorithm-race/) | automating-instructional-design | OK | yes | Interactive MicroSim comparing the efficiency of four sorting algorithms (Bubble Sort, Selection Sort, Insertion Sort, and Quick Sort) racing to sort identical... |
|  | [A* Graph Search Algorithm](https://dmccreary.github.io/microsims/microsims-old/a-star/) | microsims | OK |  | (no description in the search index) |
|  | [Breadth First Search](https://dmccreary.github.io/graph-algorithms/sims/bfs/) | graph-algorithms | Not found at the expected `main.html` URL |  | Interactive visualization of the Breadth-First Search (BFS) graph traversal algorithm. Demonstrates how BFS explores a graph level by level, visiting all neighbors of... |
|  | [Congestion Control Phases and Algorithms](https://dmccreary.github.io/networking/sims/tcp-congestion-control-comparison/) | networking | OK |  | (boilerplate description in the search index) |
|  | [Conway's Game of Life](https://dmccreary.github.io/microsims/microsims-old/conway-game-of-life/) | microsims | OK |  | (no description in the search index) |
|  | [Distance-Vector vs. Link-State Convergence](https://dmccreary.github.io/networking/sims/dv-vs-ls-convergence/) | networking | OK | yes | (boilerplate description in the search index) |
|  | [Force Directed Graph Layout](https://dmccreary.github.io/graph-algorithms/sims/force/) | graph-algorithms | Not found at the expected `main.html` URL |  | Interactive simulation of force-directed graph placement algorithm. Demonstrates how physical simulation with attractive and repulsive forces creates visually... |
|  | [Inverted Index Visualizer](https://dmccreary.github.io/search-microsims/sims/inverted-index-viz/) | search-microsims | OK |  | Interactive visualization showing how inverted indexes enable fast search by mapping terms to document IDs |
|  | [Minimum Spanning Tree Algorithm Visualizer](https://dmccreary.github.io/intro-to-graph/sims/minimum-spanning-tree/) | intro-to-graph | OK |  | Interactive visualization demonstrating Kruskal's and Prim's algorithms for finding minimum spanning trees in weighted graphs. Students can step through algorithm... |
|  | [PageRank](https://dmccreary.github.io/graph-algorithms/sims/page-rank/) | graph-algorithms | Not found at the expected `main.html` URL |  | Interactive visualization of Google's PageRank algorithm showing iterative calculation of node importance in directed graphs. Node sizes update to reflect their... |
|  | [Path Planning Visualizer](https://dmccreary.github.io/linear-algebra/sims/path-planning/) | linear-algebra | OK |  | Interactive comparison of path planning algorithms (A*, Dijkstra, RRT) showing exploration patterns, path quality, and performance metrics. |
|  | [TLS Handshake and Chain of Trust](https://dmccreary.github.io/information-systems/sims/tls-handshake-chain-of-trust/) | information-systems | OK |  | Step-through TLS 1.3 handshake with certificate chain panel and MITM/expired failure modes. |
|  | [Write Skew Under Read Committed](https://dmccreary.github.io/information-systems/sims/write-skew-read-committed/) | information-systems | OK | yes | Step-through of two concurrent transactions causing write-skew under Read Committed, with Serializable replay. |

### AI and machine learning (17)

| Pick | MicroSim | Repository | Load check | Seen | Description from the search index |
|------|----------|------------|------------|------|-----------------------------------|
| ★ | [AI Fairness Trade-offs Explorer](https://dmccreary.github.io/ethics-course/sims/ai-fairness-tradeoffs/) | ethics-course | OK | yes | Interactive p5.js simulation exploring the impossibility theorem in algorithmic fairness - demonstrating why demographic parity, equalized odds, and predictive parity... |
| ★ | [Adversarial Example Explorer](https://dmccreary.github.io/cybersecurity/sims/adversarial-example-explorer/) | cybersecurity | OK | yes | Interactive p5.js MicroSim that lets students add an imperceptible Fast Gradient Sign Method (FGSM) perturbation to a hand-drawn digit and watch a classifier's... |
| ★ | [Attention Mechanism Step-by-Step](https://dmccreary.github.io/linear-algebra/sims/attention-mechanism/) | linear-algebra | OK | yes | Interactive visualization showing how transformer attention computes weighted combinations through QKV projections |
| ★ | [Gradient Descent Interactive Visualizer](https://dmccreary.github.io/linear-algebra/sims/gradient-descent/) | linear-algebra | OK | yes | Visualize how gradient descent optimization navigates loss surfaces and how learning rate affects convergence behavior. |
|  | [Autoregressive MicroSim](https://dmccreary.github.io/Digital-Transformation-with-AI-Spring-2026/sims/autoregressive/) | Digital-Transformation-with-AI-Spring-2026 | Not found at the expected `main.html` URL |  | Interactive simulation showing how autoregressive language models predict the next token from a sequence of words using a neural network visualization. |
|  | [Backpropagation](https://dmccreary.github.io/linear-algebra/sims/backpropagation/) | linear-algebra | OK | yes | Step-by-step visualization of backpropagation showing how gradients flow backward through a neural network via the chain rule. |
|  | [Bias-Variance Dartboard](https://dmccreary.github.io/data-science-course/sims/bias-variance-dartboard/) | data-science-course | JavaScript error: `Failed to load resource: the server responded with a status of 404 ()` |  | (boilerplate description in the search index) |
|  | [Convolution Visualizer](https://dmccreary.github.io/linear-algebra/sims/convolution-visualizer/) | linear-algebra | OK |  | Step-by-step visualization of image convolution showing how kernels slide across images to compute filtered outputs. Features multiple kernel types and animated... |
|  | [Kalman Filter Visualizer](https://dmccreary.github.io/linear-algebra/sims/kalman-filter/) | linear-algebra | JavaScript error: `Cannot read properties of undefined (reading 'value')` | yes | Interactive visualization of the Kalman filter showing the predict-update cycle, uncertainty propagation, and the effects of process and measurement noise on state... |
|  | [Learning Rate Effect on Convergence](https://dmccreary.github.io/linear-algebra/sims/learning-rate-effect/) | linear-algebra | OK |  | Interactive side-by-side comparison showing how different learning rates affect gradient descent optimization, demonstrating convergence, oscillation, and divergence... |
|  | [LoRA Low-Rank Adaptation Visualizer](https://dmccreary.github.io/linear-algebra/sims/lora-visualizer/) | linear-algebra | OK |  | Interactive visualization of LoRA showing how low-rank matrices enable parameter-efficient fine-tuning of large models |
|  | [PCA Step-by-Step Visualizer](https://dmccreary.github.io/linear-algebra/sims/pca-explorer/) | linear-algebra | OK | yes | Interactive visualization demonstrating Principal Component Analysis step by step, from raw data through centering, eigenvector computation, and projection to lower... |
|  | [Perceptron Decision Boundary](https://dmccreary.github.io/linear-algebra/sims/perceptron-decision-boundary/) | linear-algebra | OK |  | Interactive visualization showing how perceptron weights and bias define a linear decision boundary for binary classification. |
|  | [RAG MicroSim](https://dmccreary.github.io/conversational-ai/sims/rag-microsim/) | conversational-ai | OK | yes | An interactive p5.js simulator that runs the three RAG steps - retrieval, augmentation, and generation - on a mini document corpus you can query. |
|  | [Regularization Geometry Visualizer](https://dmccreary.github.io/linear-algebra/sims/regularization-geometry/) | linear-algebra | OK |  | Interactive visualization showing how L1 and L2 regularization constrain model weights geometrically, demonstrating why L1 regularization produces sparse solutions... |
|  | [Self-Attention Visualization](https://dmccreary.github.io/Digital-Transformation-with-AI-Spring-2026/sims/self-attention-visualization/) | Digital-Transformation-with-AI-Spring-2026 | Not found at the expected `main.html` URL |  | Interactive visualization of how tokens attend to other tokens in transformer self-attention mechanisms |
|  | [Vector Index Comparison](https://dmccreary.github.io/conversational-ai/sims/vector-index-comparison/) | conversational-ai | OK |  | Interactive p5.js panels showing how Flat, IVF, and HNSW vector indexes organize data for fast similarity search, with a comparison table covering speed, accuracy,... |

### Engineering and electronics (11)

| Pick | MicroSim | Repository | Load check | Seen | Description from the search index |
|------|----------|------------|------------|------|-----------------------------------|
| ★ | [H Bridge](https://dmccreary.github.io/microsims/microsims-old/h-bridge/) | microsims | OK |  | (boilerplate description in the search index) |
| ★ | [Interactive Feedback Loop Simulator](https://dmccreary.github.io/control-systems/sims/feedback-loop-simulator/) | control-systems | OK | yes | Interactive simulation demonstrating how proportional controller gain K and plant time constant τ affect closed-loop step response. Students observe real-time changes... |
|  | [555 Timer](https://dmccreary.github.io/microsims/microsims-old/555-timer/) | microsims | OK |  | Interactive simulation of the 555 timer IC demonstrating astable (oscillator) and monostable (one-shot) modes with accurate RC timing formulas, real-time waveform... |
|  | [Arithmetic Logic Unit (ALU)](https://dmccreary.github.io/microsims/microsims-old/alu/) | microsims | OK |  | Interactive simulation demonstrating how an ALU performs arithmetic and logical operations on binary data, the fundamental computational component in all CPUs. |
|  | [Flip Flop MicroSim](https://dmccreary.github.io/digital-electronics/sims/flip-flop/) | digital-electronics | JavaScript error: `drawNAND is not defined` |  | Interactive simulation demonstrating SR flip-flop behavior using NAND gates, showing how digital memory circuits store binary states through cross-coupled feedback. |
|  | [Moore vs Mealy Machine Comparison](https://dmccreary.github.io/intelligent-textbook-ee2301/sims/moore-mealy-comparison/) | intelligent-textbook-ee2301 | Not found at the expected `main.html` URL |  | Side-by-side comparison of Moore and Mealy state machines implementing a 101 sequence detector |
|  | [Open-Loop vs Closed-Loop Comparison](https://dmccreary.github.io/control-systems/sims/open-vs-closed-loop/) | control-systems | OK |  | Interactive side-by-side comparison demonstrating how feedback control enables superior disturbance rejection compared to open-loop systems. Students apply... |
|  | [Setup and Hold Time Explorer](https://dmccreary.github.io/intelligent-textbook-ee2301/sims/setup-hold-metastability-explorer/) | intelligent-textbook-ee2301 | Not found at the expected `main.html` URL |  | Interactive timing diagram showing setup time, hold time, and metastability in flip-flops with draggable data transition |
|  | [Shift Register](https://dmccreary.github.io/clocks-and-watches/sims/shift-register/) | clocks-and-watches | OK |  | Interactive p5.js simulation of a 74HC594 shift register demonstrating serial-to-parallel data conversion with clock and latch control signals. |
|  | [Thévenin Equivalent Circuit](https://dmccreary.github.io/circuits/sims/thevenin-concept/) | circuits | OK | yes | 5-stage interactive MicroSim demonstrating Thévenin's theorem: replacing a complex circuit with a voltage source in series with a resistance that behaves identically... |
|  | [Water Flow Analogy MicroSim](https://dmccreary.github.io/circuits/sims/water-flow-analogy/) | circuits | OK |  | Interactive simulation comparing water flow in pipes to electric current in wires, demonstrating voltage-pressure and current-flow rate analogies |

### Security and privacy (5)

| Pick | MicroSim | Repository | Load check | Seen | Description from the search index |
|------|----------|------------|------------|------|-----------------------------------|
|  | [Coverage-Guided Fuzzer Loop](https://dmccreary.github.io/cybersecurity/sims/fuzzer-coverage-loop/) | cybersecurity | OK |  | An animated simulation of how a coverage-guided fuzzer explores a target program's basic blocks over time, reaching the deep bug block far faster than pure random... |
|  | [DDoS Mitigation Explorer](https://dmccreary.github.io/cybersecurity/sims/ddos-mitigation-explorer/) | cybersecurity | OK |  | Interactive p5.js simulation of DDoS attack and defense. Adjust botnet size, attack rate, attack type, and amplification reflector, then toggle BCP38 ingress... |
|  | [Differential Privacy Noise Mechanism Explorer](https://dmccreary.github.io/context-graph/sims/differential-privacy-explorer/) | context-graph | OK |  | Learners can demonstrate how adjusting the epsilon privacy budget changes the trade-off between result accuracy and individual privacy protection. |
|  | [Password Cracking Cost](https://dmccreary.github.io/cybersecurity/sims/password-cracking-cost/) | cybersecurity | OK | yes | Interactive p5.js calculator showing how the choice of password hash (raw SHA-256, salt, bcrypt, Argon2id), attacker hardware, and database size change the time and... |
|  | [Vulnerability Sandbox MicroSim](https://dmccreary.github.io/cybersecurity/sims/vuln-sandbox/) | cybersecurity | OK |  | Interactive p5.js sandbox that sends the same attacker payload to a vulnerable and a fixed implementation of the same web endpoint, side by side, so students can see... |

### Social science and history (6)

| Pick | MicroSim | Repository | Load check | Seen | Description from the search index |
|------|----------|------------|------------|------|-----------------------------------|
| ★ | [Arms Race Dynamics — The Security Dilemma Loop](https://dmccreary.github.io/us-history/sims/arms-race-dynamics/) | us-history | OK | yes | Students model the security dilemma feedback loop that drives arms races, identify the reinforcing loops at work, and evaluate what conditions could break the loop... |
| ★ | [Inoculation Theory Visualizer](https://dmccreary.github.io/public-health/sims/inoculation-theory-sim/) | public-health | OK | yes | Side-by-side population simulation comparing misinformation spread in a population with no prebunking against a population where ~65% have been prebunked... |
|  | [Constitutional Structure — Checks and Balances Explorer](https://dmccreary.github.io/us-history/sims/checks-and-balances-explorer/) | us-history | OK |  | Students explain how checks and balances distribute power among the three branches and give at least two examples of checks being exercised in American history. |
|  | [Depression Causes — Interacting Feedback Loops](https://dmccreary.github.io/us-history/sims/depression-feedback-loops/) | us-history | OK |  | Students diagram the reinforcing feedback loops that amplified the 1929 crash into a decade-long depression, identifying which loops the New Deal attempted to break... |
|  | [Perceived Versus Actual Norms Simulator](https://dmccreary.github.io/health-education/sims/perceived-vs-actual-norms/) | health-education | OK | yes | Students predict, then reveal the gap between perceived social norms and actual survey-measured behavior, and explain why closing that gap changes individual behavior. |
|  | [US State Quality of Life Index Map](https://dmccreary.github.io/microsims/microsims-old/us-state-quality-map/) | microsims | OK (Leaflet map, no p5 canvas) |  | Interactive choropleth map grading all 50 US states on 8 quality of life metrics including income, education, health, crime, and housing costs. |

### Early literacy, learning design and search (6)

| Pick | MicroSim | Repository | Load check | Seen | Description from the search index |
|------|----------|------------|------------|------|-----------------------------------|
|  | [Cognitive Load Balance Explorer](https://dmccreary.github.io/infographics/sims/cognitive-load-explorer/) | infographics | OK |  | Interactive visualization showing how three types of cognitive load (intrinsic, extraneous, germane) compete for limited working memory capacity, and how design... |
|  | [Color Blindness Simulator](https://dmccreary.github.io/automating-instructional-design/sims/color-blindness-simulator/) | automating-instructional-design | OK |  | Interactive simulation to test MicroSim color schemes under simulated color vision deficiencies including deuteranopia, protanopia, tritanopia, and monochromacy. |
|  | [Model Comparison Tool - Physics Models](https://dmccreary.github.io/automating-instructional-design/sims/model-comparison-tool/) | automating-instructional-design | OK |  | Interactive MicroSim for comparing multiple physics models (Impetus, Common Sense, Newtonian) against various test cases. Students observe side-by-side predictions... |
|  | [Precision-Recall Trade-off Explorer](https://dmccreary.github.io/search-microsims/sims/precision-recall-explorer/) | search-microsims | OK |  | Interactive Venn diagram visualization demonstrating how search specificity affects precision and recall metrics with real-time calculation |
|  | [Sound Slider](https://dmccreary.github.io/reading-for-kindergarten/sims/sound-slider/) | reading-for-kindergarten | OK |  | Drag a slider to blend sounds into words, giving children kinesthetic control over the blending process and making abstract phonics concepts concrete. |
|  | [Word Machine](https://dmccreary.github.io/reading-for-kindergarten/sims/word-machine/) | reading-for-kindergarten | OK |  | A fun factory-themed MicroSim where children load sounds into a machine and watch gears spin as the sounds blend into a word, making phonics concrete and engaging. |

