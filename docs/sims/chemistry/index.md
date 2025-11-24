---
title: Kinetic Molecular Theory
description: An interactive chemistry simulation demonstrating the relationship between molecular motion and temperature using Box2D physics to model gas particles in a container.
quality_score: 70
image: /sims/chemistry/chemistry.png
og:image: /sims/chemistry/chemistry.png
twitter:image: /sims/chemistry/chemistry.png
social:
   cards: false
---

# Kinetic Molecular Theory

<iframe src="main.html" width="100%" height="400px"></iframe>

[Run the Kinetic Molecular Theory MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/chemistry/main.html" width="100%" height="400px"></iframe>
```

## Description

This MicroSim demonstrates the **kinetic molecular theory of gases**, showing how temperature relates to molecular motion at the microscopic level. Gas particles bounce around in a confined chamber following realistic physics, and the simulation calculates and graphs the relationship between molecular velocity and temperature in real-time.

### Key Features

- **Realistic Physics**: Uses Box2D physics engine for accurate particle collisions
- **Particle Chamber**: Left panel shows gas molecules bouncing in a container
- **Temperature Graph**: Right panel displays temperature (T) over time
- **Dynamic Particle Generation**: System adds particles randomly up to 100 molecules
- **RMS Velocity Calculation**: Computes root-mean-square velocity as temperature proxy
- **Real-Time Visualization**: Watch molecular motion and temperature changes simultaneously

### How It Works

The simulation creates gas particles (small circles) that:
1. Bounce elastically off chamber walls
2. Collide with each other following physics laws
3. Move with varying velocities representing thermal motion
4. Generate temperature data based on average kinetic energy

**Temperature Calculation**: The simulation computes the **root-mean-square (RMS) velocity** of all particles, which directly relates to temperature in kinetic theory:

```
T ∝ ½m⟨v²⟩
```

Where:
- T = temperature
- m = particle mass
- ⟨v²⟩ = mean square velocity (average of velocity squared)

The orange graph on the right shows how this temperature changes over time as the system evolves.

## Chemistry Concepts

This simulation illustrates fundamental concepts from kinetic molecular theory:

### 1. **Temperature and Molecular Motion**
Temperature is a measure of average molecular kinetic energy. Faster-moving molecules correspond to higher temperatures.

### 2. **Gas Particles in Motion**
Gas molecules are in constant, random motion, colliding with container walls and each other.

### 3. **Elastic Collisions**
Particle collisions conserve kinetic energy (no energy lost to heat in ideal gases).

### 4. **Pressure from Collisions**
Gas pressure arises from particles colliding with container walls (not directly visualized but implicit).

### 5. **Statistical Mechanics**
Temperature emerges from statistical averaging of many molecular velocities.

## Educational Applications

### Learning Objectives

Students will be able to:

1. **Understand** the relationship between molecular motion and temperature
2. **Visualize** how gas molecules behave at the microscopic level
3. **Analyze** how RMS velocity relates to temperature
4. **Connect** macroscopic properties (temperature) to microscopic motion
5. **Apply** kinetic theory concepts to explain gas behavior

### Prerequisites

- Basic chemistry: atoms, molecules, states of matter
- Understanding of temperature concept
- Introduction to kinetic energy
- Basic physics: velocity, collisions

### Classroom Activities

**Activity 1: Temperature Observation** (10 minutes)
- Watch the simulation for 2-3 minutes
- Observe the temperature graph
- Note how particle motion correlates with graph changes
- **Discussion**: What causes temperature fluctuations?

**Activity 2: Molecular Speed Analysis** (15 minutes)
- Observe individual particle speeds
- Notice the distribution of fast and slow particles
- Watch how collisions redistribute energy
- **Discussion**: Do all molecules move at the same speed? Why or why not?

**Activity 3: Energy Transfer** (10 minutes)
- Track how fast particles slow down after collisions
- Observe how slow particles speed up
- Note the energy exchange between particles
- **Discussion**: How does energy distribute among molecules?

### Assessment Questions

1. **Comprehension**: What does the temperature (T) graph represent in terms of molecular motion?
2. **Application**: If temperature increased, what would happen to particle speeds?
3. **Analysis**: Why does the RMS velocity better represent temperature than average velocity?
4. **Evaluation**: How does this simulation simplify real gas behavior? What's missing?
5. **Synthesis**: How would adding more particles affect the temperature graph?

## Connections to Real Chemistry

### Kinetic Molecular Theory Postulates

This simulation demonstrates several key postulates:

1. ✅ **Gases consist of particles in constant motion** - Visible in the particle chamber
2. ✅ **Particle collisions are elastic** - Energy is conserved in collisions
3. ✅ **Average kinetic energy is proportional to temperature** - Shown by RMS calculation
4. ⚠️ **Particles occupy negligible volume** - Simplified (particles have size here)
5. ⚠️ **No intermolecular forces** - Simplified (Box2D has some repulsion)

### Real-World Applications

- **Temperature measurement**: Understanding what thermometers actually measure
- **Gas laws**: Foundation for understanding PV=nRT
- **Atmospheric science**: Modeling air molecule behavior
- **Chemical reactions**: Collision theory and reaction rates
- **Material properties**: Why gases expand when heated

## Technical Implementation

**Physics Engine**: Box2D (accurate collision detection and response)

**Framework**: p5.js for visualization

**Key Algorithms**:
- Random particle generation (up to 100 particles)
- RMS velocity calculation: `√(Σv²/N)`
- Real-time graphing with moving time window
- Elastic collision physics from Box2D

**Data Visualization**:
- Left panel: Particle simulation (320×360 px)
- Right panel: Temperature vs. time graph (250×200 px)
- Orange line: RMS velocity (temperature proxy)

## Extensions and Modifications

### Suggested Enhancements

1. **Add temperature control**: Slider to heat/cool the system
2. **Variable particle count**: Control number of molecules
3. **Particle size variation**: Different molecular weights
4. **Pressure measurement**: Display wall collision frequency
5. **Maxwell-Boltzmann distribution**: Histogram of particle speeds
6. **Volume control**: Adjustable container size (Boyle's Law)
7. **Partition removal**: Demonstrate gas diffusion

### Advanced Topics

- **Degrees of freedom**: Extend to 3D simulation
- **Non-ideal gases**: Add intermolecular forces
- **Phase changes**: Cool system to show condensation
- **Chemical reactions**: Particles combine/separate

## Standards Alignment

**Next Generation Science Standards (NGSS)**:
- MS-PS1-4: Develop a model that predicts and describes changes in particle motion
- HS-PS1-3: Plan and conduct an investigation of properties of substances
- HS-PS3-2: Develop and use models to illustrate energy at macroscopic and atomic scales

**Common Core Math**:
- HSS-ID.A.2: Use statistics appropriate to the data distribution
- HSF-IF.B.4: Interpret key features of graphs representing relationships

## Credits

Original code by **Chris Orban**, based on "The Nature of Code" by **Daniel Shiffman**

## References

1. [Kinetic Molecular Theory - Khan Academy](https://www.khanacademy.org/science/chemistry/gases-and-kinetic-molecular-theory)
2. [The Nature of Code - Box2D Physics](https://natureofcode.com/box2d/)
3. [PhET: Gas Properties Simulation](https://phet.colorado.edu/en/simulations/gas-properties)
4. [Maxwell-Boltzmann Distribution](https://chem.libretexts.org/Bookshelves/Physical_and_Theoretical_Chemistry_Textbook_Maps/Supplemental_Modules_(Physical_and_Theoretical_Chemistry)/Kinetic_Theory/The_Kinetic_Molecular_Theory_Postulates)
