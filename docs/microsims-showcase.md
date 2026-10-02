---
title: MicroSims Showcase
description: Thirty MicroSims, drawn from 3,764 across 90 intelligent textbooks, that show how an interactive simulation explains a complex concept better than static text
---
# MicroSims Showcase

These thirty MicroSims come from across the family of intelligent textbooks, not only from this book. Each one was chosen because it explains something that a paragraph of text explains badly: a limit, a feedback loop, a random process, an algorithm in motion. If you want to show a colleague what a MicroSim is for, start here.

Every entry below links to the MicroSim, says what it does, and says why seeing it works better than reading about it.

## How We Picked These 30

The starting point was the [MicroSim search](https://dmccreary.github.io/search-microsims/) index, which on October 1, 2026 listed 3,764 MicroSims in 90 textbook repositories. We narrowed that collection in four steps.

1. **Remove what is not yet built.** We dropped the 760 entries marked `scaffold` and kept the 2,255 implemented p5.js simulations. Mermaid flowcharts, network diagrams, charts and timelines were scanned by title only, because most of them display information rather than simulate a concept.
2. **Read every candidate.** We read the title and description of each remaining MicroSim and kept 143 for a shortlist.
3. **Load every shortlisted MicroSim.** Each of the 143 was opened from its live site in a headless browser. We recorded whether the page loaded, whether it drew a canvas, and whether it raised a JavaScript error. 129 loaded cleanly and 14 did not.
4. **Balance the final list.** From the working MicroSims we chose 30 that cover eleven subject areas, so the list shows range and not just the subjects with the most simulations.

A MicroSim made the shortlist when it passed three tests:

- **The concept resists static text.** It involves change over time, many interacting parts, randomness, or a geometric idea hidden inside algebra.
- **The interaction shows cause and effect.** Moving a control changes what you see at once, so the learner can form a prediction and test it.
- **One idea is in focus.** The MicroSim teaches a single concept instead of surveying a topic.

Reference diagrams, infographics, flowcharts, classification quizzes and calculators were left out. Many of them are useful, but they organize information more than they explain a mechanism.

## The 30 at a Glance

| # | MicroSim | Subject | Textbook | What it makes visible |
|---|----------|---------|----------|-----------------------|
| [1](#secant-to-tangent) | [Secant Lines Approaching Tangent Line](https://dmccreary.github.io/calculus/sims/secant-to-tangent/) | Math | calculus | The derivative as a limit |
| [2](#pythagorean-theorem) | [Pythagorean Theorem](microsims-old/pythagorean-theorem/index.md) | Math | microsims | Areas of the squares on the three sides |
| [3](#euler-formula) | [Euler's Formula Explorer](https://dmccreary.github.io/signal-processing/sims/euler-formula-explorer/) | Math | signal-processing | Unit-circle rotation drawing cos and sin together |
| [4](#eigenvector-transformation) | [Eigenvector Transformation Visualization](https://dmccreary.github.io/linear-algebra/sims/eigenvector-transformation/) | Math | linear-algebra | The directions a transformation does not turn |
| [5](#svd-image-compression) | [SVD Image Compression](https://dmccreary.github.io/linear-algebra/sims/svd-image-compression/) | Math | linear-algebra | An image rebuilt from its first k singular values |
| [6](#central-limit-theorem) | [Central Limit Theorem Demonstration](https://dmccreary.github.io/statistics-course/sims/clt-demonstration/) | Statistics | statistics-course | Sample means of a skewed population forming a bell |
| [7](#confidence-level) | [Confidence Level Simulator](https://dmccreary.github.io/statistics-course/sims/confidence-level-simulator/) | Statistics | statistics-course | What "95% confident" means across many intervals |
| [8](#doppler-effect) | [Doppler Effect Simulation](https://dmccreary.github.io/intro-to-physics-course/sims/doppler-effect/) | Physics | intro-to-physics-course | Wavefront compression from a moving source |
| [9](#driven-oscillator) | [Driven Oscillator](https://dmccreary.github.io/intro-to-physics-course/sims/driven-oscillator/) | Physics | intro-to-physics-course | Resonance as driving frequency crosses natural frequency |
| [10](#quantum-tunneling) | [Quantum Tunneling Probability Explorer](https://dmccreary.github.io/semiconductor-physics-course/sims/quantum-tunneling-explorer/) | Physics | semiconductor-physics-course | A wave function passing through a barrier |
| [11](#le-chatelier) | [Le Chatelier's Principle Explorer](https://dmccreary.github.io/chemistry/sims/le-chatelier-explorer/) | Chemistry | chemistry | An equilibrium shifting under stress |
| [12](#galvanic-cell) | [Galvanic Cell Visualizer](https://dmccreary.github.io/chemistry/sims/galvanic-cell-visualizer/) | Chemistry | chemistry | Electron and ion flow with the Nernst potential |
| [13](#predator-prey) | [Predator-Prey Population Dynamics](https://dmccreary.github.io/ecology/sims/predator-prey/) | Biology | ecology | Lotka-Volterra cycles with animated agents |
| [14](#genetic-drift) | [Genetic Drift Simulator](https://dmccreary.github.io/biology/sims/genetic-drift/) | Biology | biology | Random allele-frequency change and population size |
| [15](#operon-regulation) | [Operon Regulation Simulator](https://dmccreary.github.io/biology/sims/operon-regulation/) | Biology | biology | Gene regulation as switch logic |
| [16](#bathtub) | [Bathtub Stock and Flow](microsims-old/bathtub/index.md) | Systems | microsims | Stocks and flows |
| [17](#covid-seir) | [COVID-19 SEIR Wave Simulator](https://dmccreary.github.io/public-health/sims/covid-seir/) | Systems | public-health | Epidemic waves from a compartment model |
| [18](#revenue-maximum) | [Revenue Maximum](microsims-old/revenue-maximum/index.md) | Economics | microsims | Revenue as a rectangle under the demand curve |
| [19](#tragedy-of-the-commons) | [Tragedy of the Commons Simulator](https://dmccreary.github.io/economics-course/sims/tragedy-commons/) | Economics | economics-course | Individual incentives collapsing a shared stock |
| [20](#maze-solver) | [Maze Solver](microsims-old/maze-solver/index.md) | Computer science | microsims | Breadth-first search finding the shortest path |
| [21](#sorting-algorithm-race) | [Sorting Algorithm Race](https://dmccreary.github.io/automating-instructional-design/sims/sorting-algorithm-race/) | Computer science | automating-instructional-design | Four algorithms racing on the same array |
| [22](#recursive-call-stack) | [Recursive Call Stack Visualizer](https://dmccreary.github.io/computer-science/sims/recursive-call-stack/) | Computer science | computer-science | Stack frames building and unwinding |
| [23](#gradient-descent) | [Gradient Descent Interactive Visualizer](https://dmccreary.github.io/linear-algebra/sims/gradient-descent/) | AI and machine learning | linear-algebra | Learning rate deciding convergence or overshoot |
| [24](#attention-mechanism) | [Attention Mechanism Step-by-Step](https://dmccreary.github.io/linear-algebra/sims/attention-mechanism/) | AI and machine learning | linear-algebra | Query, key and value steps in a transformer |
| [25](#adversarial-example) | [Adversarial Example Explorer](https://dmccreary.github.io/cybersecurity/sims/adversarial-example-explorer/) | AI and machine learning | cybersecurity | An invisible perturbation flipping a classifier |
| [26](#ai-fairness) | [AI Fairness Trade-offs Explorer](https://dmccreary.github.io/ethics-course/sims/ai-fairness-tradeoffs/) | AI and machine learning | ethics-course | Fairness metrics that cannot all hold at once |
| [27](#h-bridge) | [H-Bridge Circuit](microsims-old/h-bridge/index.md) | Engineering | microsims | Switch states steering motor current |
| [28](#feedback-loop) | [Interactive Feedback Loop Simulator](https://dmccreary.github.io/control-systems/sims/feedback-loop-simulator/) | Engineering | control-systems | Gain and time constant shaping a step response |
| [29](#arms-race) | [Arms Race Dynamics: The Security Dilemma Loop](https://dmccreary.github.io/us-history/sims/arms-race-dynamics/) | Social science | us-history | Reinforcing and balancing feedback loops |
| [30](#inoculation-theory) | [Inoculation Theory Visualizer](https://dmccreary.github.io/public-health/sims/inoculation-theory-sim/) | Social science | public-health | Misinformation spread with and without prebunking |

## 1. Secant Lines Approaching the Tangent Line { #secant-to-tangent }

[Run the MicroSim](https://dmccreary.github.io/calculus/sims/secant-to-tangent/){ .md-button } Mathematics, from the calculus textbook

**What it does.** The graph of f(x) = x² carries a point P and a second point a distance h away, joined by a secant line. One slider moves P and another sets h. A "Watch h approach 0" button shrinks h on its own while a readout compares the secant slope with the limit slope.

**Why seeing it beats reading it.** The limit definition of the derivative is a formula that students can evaluate without knowing what it describes. Here the secant line swings toward the tangent as h shrinks, and the slope readout settles on one number. The limit stops being a rule about symbols and becomes something you watch arrive.

## 2. Pythagorean Theorem { #pythagorean-theorem }

[Run the MicroSim](microsims-old/pythagorean-theorem/index.md){ .md-button } Mathematics, from this book

**What it does.** Two sliders set the legs of a right triangle. A Show Squares button draws a square on each of the three sides, and a readout lists each side length and each area.

**Why seeing it beats reading it.** Written as a² + b² = c², the theorem reads as a fact about lengths. The picture shows that it is a statement about areas: the two smaller squares together cover exactly as much as the large one. Changing a leg and watching all three squares resize makes the equation a property of the shape and not a formula to memorize.

## 3. Euler's Formula Explorer { #euler-formula }

[Run the MicroSim](https://dmccreary.github.io/signal-processing/sims/euler-formula-explorer/){ .md-button } Mathematics, from the signal-processing textbook

**What it does.** A vector rotates around the unit circle. Its projection on the real axis traces a cosine wave and its projection on the imaginary axis traces a sine wave, both drawn in step with the rotation. Sliders set the angle and the speed.

**Why seeing it beats reading it.** On paper, e^(iθ) = cos θ + i sin θ looks like three unrelated functions that happen to be equal. The animation shows one rotating point with two shadows. Sine and cosine turn out to be the same motion seen from two directions, a quarter turn apart, which is hard to convey with symbols alone.

## 4. Eigenvector Transformation Visualization { #eigenvector-transformation }

[Run the MicroSim](https://dmccreary.github.io/linear-algebra/sims/eigenvector-transformation/){ .md-button } Mathematics, from the linear-algebra textbook

**What it does.** The learner drags a vector around the plane and sees where a 2×2 matrix sends it. The matrix cells can be edited. The display reports whether the direction changed, announces when the vector is an eigenvector, and shows the scale factor.

**Why seeing it beats reading it.** The definition Av = λv says little to a student who has not yet seen what a matrix does to space. Dragging the vector until the output lines up with the input is a hunt with a clear result: most directions get turned, and a few special ones only stretch. That discovery is the meaning of the definition.

## 5. SVD Image Compression { #svd-image-compression }

[Run the MicroSim](https://dmccreary.github.io/linear-algebra/sims/svd-image-compression/){ .md-button } Mathematics, from the linear-algebra textbook

**What it does.** A test image appears beside its reconstruction from the first k singular values and an image of the error between them. A slider sets the rank k, a menu changes the pattern, and a chart shows the singular value spectrum. Readouts give the compression, error, variance captured and storage.

**Why seeing it beats reading it.** "A few singular values capture most of the information" is a claim students accept without feeling it. Sliding k from 1 upward shows a blurry image sharpen and the error image fade, while the spectrum shows why the first few values matter most. The trade between quality and storage is visible in one view.

## 6. Central Limit Theorem Demonstration { #central-limit-theorem }

[Run the MicroSim](https://dmccreary.github.io/statistics-course/sims/clt-demonstration/){ .md-button } Statistics, from the statistics-course textbook

**What it does.** The learner picks a population distribution and a sample size, then draws samples by the hundred or the thousand. A histogram of the sample means builds up under a normal curve overlay, and a panel compares the observed mean and standard deviation with the theoretical values.

**Why seeing it beats reading it.** The theorem's claim is surprising: averages from a lopsided population still form a bell. Stated in text it sounds like an assertion to be taken on trust. Watching the histogram fill in, and narrow as the sample size grows, turns the claim into an observation the learner made.

## 7. Confidence Level Simulator { #confidence-level }

[Run the MicroSim](https://dmccreary.github.io/statistics-course/sims/confidence-level-simulator/){ .md-button } Statistics, from the statistics-course textbook

**What it does.** A vertical line marks the true population proportion. Buttons generate 1, 10 or 100 confidence intervals, each drawn as a horizontal bar that either crosses the line or misses it. A tally shows intervals captured, intervals missed, and the capture rate against the expected rate.

**Why seeing it beats reading it.** The correct reading of "95% confident" is a sentence that students and many professionals get wrong: it describes how often the method works, not the chance that one interval is right. A stack of 100 intervals with about five missing the line shows that meaning directly. No rewording of the sentence does this as well.

## 8. Doppler Effect Simulation { #doppler-effect }

[Run the MicroSim](https://dmccreary.github.io/intro-to-physics-course/sims/doppler-effect/){ .md-button } Physics, from the intro-to-physics-course textbook

**What it does.** A sound source moves left or right while emitting circular wavefronts. Sliders set the source speed and source frequency. Readouts give the frequency heard by an observer ahead of the source and by one behind it.

**Why seeing it beats reading it.** The Doppler formula has a sign convention that students memorize and then misapply. In the animation each wavefront is a circle centered where the source was when it was emitted, so the circles crowd together ahead and spread out behind. The change in pitch follows from the spacing, and the formula becomes a description of the picture.

## 9. Driven Oscillator { #driven-oscillator }

[Run the MicroSim](https://dmccreary.github.io/intro-to-physics-course/sims/driven-oscillator/){ .md-button } Physics, from the intro-to-physics-course textbook

**What it does.** A mass on a spring is pushed by a periodic force. Sliders set the driving frequency, the driving force and the damping. The display plots displacement against time and reports the ratio of driving frequency to natural frequency, the steady-state amplitude and the phase lag.

**Why seeing it beats reading it.** Resonance is usually presented as a peak on an amplitude curve, which is a summary of an experiment the student never ran. Here the student runs it: nudge the driving frequency toward the natural frequency and the motion grows; add damping and the peak flattens. The curve in the textbook then means something.

## 10. Quantum Tunneling Probability Explorer { #quantum-tunneling }

[Run the MicroSim](https://dmccreary.github.io/semiconductor-physics-course/sims/quantum-tunneling-explorer/){ .md-button } Physics, from the semiconductor-physics-course textbook

**What it does.** A rectangular energy barrier sits in the path of a particle. Sliders set the barrier height, the barrier width and the particle energy. The wave function can be drawn across the barrier, and a panel reports the tunneling probability and which regime applies.

**Why seeing it beats reading it.** Tunneling contradicts everyday intuition, and the formula hides how sharply the probability depends on barrier width. The drawing shows the wave decaying inside the barrier and continuing, smaller, on the far side. Widening the barrier a little and watching the probability fall by orders of magnitude teaches the exponential dependence faster than the equation does.

## 11. Le Chatelier's Principle Explorer { #le-chatelier }

[Run the MicroSim](https://dmccreary.github.io/chemistry/sims/le-chatelier-explorer/){ .md-button } Chemistry, from the chemistry textbook

**What it does.** The Haber process runs in a particle view beside a bar chart of concentrations. Buttons add or remove a reactant or product, compress or expand the container, change the temperature, and add an inert gas or a catalyst. The reaction quotient Q is shown against the equilibrium constant K.

**Why seeing it beats reading it.** "The system shifts to oppose the stress" is easy to recite and easy to misapply, especially for inert gases and catalysts, which do not move the equilibrium at all. Applying each stress and watching Q jump away from K, then return, shows which changes matter and why. The exceptions are seen, not memorized.

## 12. Galvanic Cell Visualizer { #galvanic-cell }

[Run the MicroSim](https://dmccreary.github.io/chemistry/sims/galvanic-cell-visualizer/){ .md-button } Chemistry, from the chemistry textbook

**What it does.** Two half-cells are joined by a wire and a salt bridge. Electrons move through the wire and ions move through the bridge, with the cell notation, half-reactions and Nernst-calculated potential shown below. A menu picks the cell and a slider changes an ion concentration.

**Why seeing it beats reading it.** A working cell has several flows happening at once: electrons in the wire, ions in the bridge, and reactions at both electrodes. Prose has to describe them one after another, and students lose track of which way each goes. The animation shows them together, and the potential updates as the concentration changes.

## 13. Predator-Prey Population Dynamics { #predator-prey }

[Run the MicroSim](https://dmccreary.github.io/ecology/sims/predator-prey/){ .md-button } Biology, from the ecology textbook

**What it does.** Hares and lynx move around a meadow above a graph of both populations over time. Sliders set the birth rate, predation rate and death rate. Buttons add a disease or remove the predators.

**Why seeing it beats reading it.** The Lotka-Volterra model is a pair of coupled equations, and the fact that they produce cycles is not obvious from reading them. On screen the predator peak follows the prey peak, again and again, and the learner can see the delay that drives the cycle. Removing the predators shows what the equations imply without solving them.

## 14. Genetic Drift Simulator { #genetic-drift }

[Run the MicroSim](https://dmccreary.github.io/biology/sims/genetic-drift/){ .md-button } Biology, from the biology textbook

**What it does.** Several populations start with the same allele frequency and are followed across generations. Sliders set the population size, the starting frequency, the number of generations and the number of trials. A summary counts how many trials ended in fixation, in loss, or still drifting.

**Why seeing it beats reading it.** Drift is evolution by chance, and a description of chance has no shape. A set of lines that start together and wander apart gives it one. Changing the population size and running again shows the central result: small populations lose variation fast, while large ones barely move.

## 15. Operon Regulation Simulator { #operon-regulation }

[Run the MicroSim](https://dmccreary.github.io/biology/sims/operon-regulation/){ .md-button } Biology, from the biology textbook

**What it does.** A strip of DNA shows the promoter, operator and genes of the lac or trp operon. The learner changes the cell's conditions and sees whether the repressor binds, whether RNA polymerase is blocked, and whether the operon is on or off. A prompt asks for a prediction first.

**Why seeing it beats reading it.** Operon logic is written in double negatives: an inducer inactivates a repressor that would otherwise block transcription. Students follow each clause and still cannot say whether the genes are on. Seeing the repressor sit on the operator, or fall off it, replaces the chain of negations with a mechanism.

## 16. Bathtub Stock and Flow { #bathtub }

[Run the MicroSim](microsims-old/bathtub/index.md){ .md-button } Systems thinking, from this book

**What it does.** A source fills a bathtub and a drain empties it while a chart plots the water height over time. Sliders set the flows. A checkbox switches between a constant drain and a drain whose flow depends on the water height.

**Why seeing it beats reading it.** People routinely confuse a stock with its inflow, expecting the level to fall as soon as the tap is turned down. The tub shows the level still rising as long as more comes in than goes out. That one observation carries over to carbon in the atmosphere, debt, and inventory.

## 17. COVID-19 SEIR Wave Simulator { #covid-seir }

[Run the MicroSim](https://dmccreary.github.io/public-health/sims/covid-seir/){ .md-button } Systems thinking, from the public-health textbook

**What it does.** A compartment model plots the course of an epidemic. Sliders set the transmission rate, vaccination coverage, variant R₀ and waning immunity, with presets for the wild type, Delta and Omicron. A panel reports R₀, the herd immunity threshold, the peak infected fraction and the total ever infected.

**Why seeing it beats reading it.** Epidemics are nonlinear, so a small change in transmission produces a large change in the peak. That is hard to believe from a description and plain on the chart. Overlaying two variants at the same vaccination coverage shows why early single-scenario forecasts missed the later waves.

## 18. Revenue Maximum { #revenue-maximum }

[Run the MicroSim](microsims-old/revenue-maximum/index.md){ .md-button } Economics, from this book

**What it does.** Two linked charts share one price. On the left, a rectangle under a straight-line demand curve has the price as its height, the quantity sold as its width and the revenue as its area. On the right, the learner traces the revenue curve by changing the price with a slider, by dragging, or with an animated sweep.

**Why seeing it beats reading it.** Students expect a higher price to bring in more money. The rectangle shows the trade: as it grows taller it grows narrower, and its area peaks in the middle. Seeing revenue as an area that changes shape explains the parabola on the right before any algebra is done.

## 19. Tragedy of the Commons Simulator { #tragedy-of-the-commons }

[Run the MicroSim](https://dmccreary.github.io/economics-course/sims/tragedy-commons/){ .md-button } Economics, from the economics-course textbook

**What it does.** The learner shares a fishery with other fishers whose behavior can be set to conservative, moderate or aggressive. A slider sets the learner's own catch rate. Advancing a year at a time, or ten at once, plots the fish population and reports each year's reproduction, harvest and profit.

**Why seeing it beats reading it.** The tragedy of the commons is a story about a slow collapse that nobody intends. Read as a paragraph, it invites the reply that sensible people would simply stop. Playing it shows the pull of the larger catch each year and the population chart bending toward zero anyway.

## 20. Maze Solver { #maze-solver }

[Run the MicroSim](microsims-old/maze-solver/index.md){ .md-button } Computer science, from this book

**What it does.** A random maze is generated with depth-first search and then solved one step at a time with breadth-first search. Cells the search reaches turn pink and the shortest path turns yellow. A status line counts the cells explored and the cells on the path, and a slider sets the solving speed.

**Why seeing it beats reading it.** Pseudocode for breadth-first search describes a queue, which tells a beginner nothing about how the search behaves. On the maze it spreads outward like a flood, reaching every cell at one distance before any cell at the next. That picture explains why the first path found is the shortest.

## 21. Sorting Algorithm Race { #sorting-algorithm-race }

[Run the MicroSim](https://dmccreary.github.io/automating-instructional-design/sims/sorting-algorithm-race/){ .md-button } Computer science, from the automating-instructional-design textbook

**What it does.** Bubble sort, selection sort, insertion sort and quick sort each sort a copy of the same array, side by side. Sliders set the array size and the speed. Each lane counts its comparisons and swaps, and a winner is announced.

**Why seeing it beats reading it.** Big-O notation tells a student that one algorithm is O(n²) and another is O(n log n) without conveying how much that matters. In the race, quick sort finishes while the others are still working, and the gap widens as the array grows. The notation becomes a prediction the learner can check against the counters.

## 22. Recursive Call Stack Visualizer { #recursive-call-stack }

[Run the MicroSim](https://dmccreary.github.io/computer-science/sims/recursive-call-stack/){ .md-button } Computer science, from the computer-science textbook

**What it does.** A short recursive Python function is shown with its current line highlighted. The learner steps through it, or lets it play, while a call stack beside the code gains a frame for each call and loses one for each return. The base case and return values are marked.

**Why seeing it beats reading it.** Recursion confuses beginners because the same code is running at several depths at once, and the text of the function shows only one of them. The stack makes every pending call visible. Watching the frames pile up to the base case and then unwind with their return values answers the question students actually have: where does the answer come from?

## 23. Gradient Descent Interactive Visualizer { #gradient-descent }

[Run the MicroSim](https://dmccreary.github.io/linear-algebra/sims/gradient-descent/){ .md-button } AI and machine learning, from the linear-algebra textbook

**What it does.** The learner clicks a starting point on a loss surface and steps or runs gradient descent from there. A slider sets the learning rate and a menu switches between a quadratic bowl, the Rosenbrock function and a saddle point. A second chart plots loss against iteration, and a status line reports convergence or divergence.

**Why seeing it beats reading it.** The update rule is one line, and it hides everything that goes wrong in practice. Raising the learning rate until the path bounces across the valley and flies off shows divergence in a way no warning does. Switching surfaces shows why some problems are slow even when the rate is right.

## 24. Attention Mechanism Step-by-Step { #attention-mechanism }

[Run the MicroSim](https://dmccreary.github.io/linear-algebra/sims/attention-mechanism/){ .md-button } AI and machine learning, from the linear-algebra textbook

**What it does.** A short token sequence is carried through the stages of transformer attention: embeddings, the query, key and value projections, the scaled dot-product scores, the softmax weights, and the weighted sum of value vectors. One slider moves between stages and another picks which token is the query.

**Why seeing it beats reading it.** The attention formula packs five operations into one line of matrix notation. Readers who can parse it often still cannot say what each matrix is for. Taking the stages one at a time, with the numbers shown as colored grids, lets the learner follow a single token's query to the positions it attends to.

## 25. Adversarial Example Explorer { #adversarial-example }

[Run the MicroSim](https://dmccreary.github.io/cybersecurity/sims/adversarial-example-explorer/){ .md-button } AI and machine learning, from the cybersecurity textbook

**What it does.** A hand-drawn digit is shown beside a bar chart of a classifier's confidence in each digit class. A slider sets the size of a perturbation aimed at a chosen target class. A checkbox displays the perturbation alone, magnified ten times.

**Why seeing it beats reading it.** The claim that a change too small to see can make a classifier wrong sounds exaggerated until it happens in front of you. Here the digit still looks the same while the confidence bars swap. The magnified view of the perturbation shows how little was added.

## 26. AI Fairness Trade-offs Explorer { #ai-fairness }

[Run the MicroSim](https://dmccreary.github.io/ethics-course/sims/ai-fairness-tradeoffs/){ .md-button } AI and machine learning, from the ethics-course textbook

**What it does.** Two groups of people are scored by the same model, and a decision threshold divides each group. Sliders set the threshold and each group's base rate. A panel reports demographic parity, equalized odds and predictive parity.

**Why seeing it beats reading it.** That these fairness definitions cannot all be satisfied when base rates differ is a mathematical result, and in text it reads as a technicality. Moving the threshold to fix one metric and watching another one break makes the conflict concrete. The learner leaves knowing that choosing a fairness metric is a value judgment, not a tuning step.

## 27. H-Bridge Circuit { #h-bridge }

[Run the MicroSim](microsims-old/h-bridge/index.md){ .md-button } Engineering, from this book

**What it does.** Four knife switches surround a DC motor. The learner closes switches on the drawing, or presses Forward, Stop or Reverse, and current flows through the motor in green for forward or purple for reverse while the motor spins to match. Closing both switches on one side flashes the shorted wires red.

**Why seeing it beats reading it.** A truth table of four switches lists the legal states without showing why they work. Following the colored current from the positive rail, through the motor, to the negative rail shows why diagonal pairs reverse the direction. The short circuit is a mistake the learner can make safely and will not forget.

## 28. Interactive Feedback Loop Simulator { #feedback-loop }

[Run the MicroSim](https://dmccreary.github.io/control-systems/sims/feedback-loop-simulator/){ .md-button } Engineering, from the control-systems textbook

**What it does.** A proportional controller drives a first-order plant, and the step response is plotted against the reference. Sliders set the controller gain and the plant time constant. A panel computes the closed-loop time constant, the steady-state value, the steady-state error and the settling time.

**Why seeing it beats reading it.** A transfer function is a compact answer to a question students have not yet asked. Raising the gain and watching the response speed up, while the gap to the reference shrinks and never closes, shows what proportional control can and cannot do. The shaded error region makes the leftover error visible.

## 29. Arms Race Dynamics: The Security Dilemma Loop { #arms-race }

[Run the MicroSim](https://dmccreary.github.io/us-history/sims/arms-race-dynamics/){ .md-button } Social science, from the us-history textbook

**What it does.** A causal loop diagram of the security dilemma sits beside a chart of United States and Soviet arsenals from 1945 to 1991. The learner sets the threat sensitivity, runs the model, and can sign a treaty that cuts the arsenals. A menu switches between simulated and historical data.

**Why seeing it beats reading it.** A history text lists the events of the arms race in order, which makes the escalation look like a series of choices. The loop shows the structure underneath: each side's defense is the other side's threat. Running it produces runaway growth with no villain, and the treaty shows what a balancing loop does.

## 30. Inoculation Theory Visualizer { #inoculation-theory }

[Run the MicroSim](https://dmccreary.github.io/public-health/sims/inoculation-theory-sim/){ .md-button } Social science, from the public-health textbook

**What it does.** Two populations appear side by side: one with no preparation and one in which about 65% of people have been prebunked. The learner releases a piece of misinformation into both, can deploy a correction, and sets the spread rate. Counters track how many people were exposed, believed it, resisted it, or were reached by the correction.

**Why seeing it beats reading it.** The finding that warning people in advance works better than correcting them afterward is a comparison of two processes over time. A sentence can state the result but cannot show the difference in how the two spreads unfold. Running both at once does, and the correction arriving late in the unprepared group shows why debunking struggles.

## Notes on the Selection

**How far these were checked.** Each of the 30 loaded from its live site on October 1, 2026 with no JavaScript errors. We looked at a screenshot of the opening state of the 25 MicroSims from other textbooks. We did not operate every control, so a MicroSim on this list could still have a control that misbehaves.

**MicroSims left out because they did not load.** Fourteen of the 143 shortlisted MicroSims were set aside. Five raised JavaScript errors: Kalman Filter Visualizer, Local Linearity Zoom, Osmosis and Water Potential Simulator, Flip Flop, and Bias-Variance Dartboard. Nine were not found at the expected address. Several of these would be strong candidates once repaired.

**Showcase flags in this book.** Five of the six MicroSims already flagged `showcase` in this repository's metadata are on this list. The sixth, the US State Quality of Life Index Map, is a good example of a map MicroSim but displays data instead of explaining a mechanism.

**Thin descriptions in the search index.** Seven of the 30 have a placeholder description in the search index, such as "Interactive simulation for Bathtub". Bathtub, Maze Solver and H-Bridge already have full descriptions in this repository, so the index is out of date for those. Genetic Drift, Operon Regulation, Tragedy of the Commons and Recursive Call Stack still need descriptions and learning objectives written in their own repositories.

**This is one reader's list.** Another reviewer applying the same three tests would keep most of these and swap some. MicroSims that came close include Gimbal Lock Demonstration, Type I and Type II Error Visualizer, Rotational Inertia Race, Tipping Points Explorer, Tax Incidence Explorer, Backpropagation, PCA Step-by-Step Visualizer, and Password Cracking Cost.
