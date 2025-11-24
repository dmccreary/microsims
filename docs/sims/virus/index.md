---
title: Virus Spread Simulation
description: An interactive network simulation demonstrating how viruses spread through a population with adjustable infection probability and network connections.
quality_score: 75
image: /sims/virus/virus.png
og:image: /sims/virus/virus.png
twitter:image: /sims/virus/virus.png
social:
   cards: false
---

# Virus Spread Simulation

<iframe src="main.html" width="100%" height="650px"></iframe>

[Run the Virus Spread MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/virus/main.html" width="100%" height="650px"></iframe>
```

## Description

This MicroSim demonstrates **virus spread through a network**, modeling how infectious diseases propagate through a population. The simulation represents 100 individuals as nodes (vertices) in a network, connected by edges representing social contacts or proximity relationships.

### Key Features

- **Network Visualization**: 100 nodes representing individuals, connected by social/contact edges
- **Color-Coded Status**: Green nodes are healthy, red nodes are infected
- **Infection Dynamics**: Virus spreads along network edges based on probability
- **Interactive Controls**: Start, stop, step through simulation, or reset to initial state
- **Adjustable Parameters**: Control infection probability (r) from 0 to 0.4
- **Real-Time Statistics**: Track infection rate (r), simulation steps, infected count, and status

### How It Works

The simulation starts with **3 initially infected individuals** (red nodes) in a population of 100. Each person has 3-6 social connections to others in the network, shown as black lines.

During each simulation step:
1. Infected individuals (red) can spread the virus to their connected neighbors
2. The probability of transmission is controlled by the **r slider** (0 to 0.4)
3. Once infected, individuals remain infected (representing acute infectious period)
4. The simulation continues until all individuals are infected or you stop it

The **r parameter** represents the **transmission probability** - the likelihood that contact with an infected person will result in infection. Higher values of r lead to faster, more widespread infection.

### Network Structure

- **Vertices (Nodes)**: 100 individuals randomly positioned
- **Edges (Connections)**: Each person has 3-6 connections to others
- **Initial Infected**: 3 individuals start infected
- **Graph Type**: Random graph with degree constraints

## Controls

- **Start Button**: Begin continuous simulation
- **Stop Button**: Pause the simulation
- **Step Button**: Advance simulation by one step
- **Reset Button**: Return to initial state (3 infected)
- **r Slider**: Adjust infection probability (0.0 to 0.4)

## Educational Applications

### Learning Objectives

Students will be able to:

1. Understand how network structure affects disease spread
2. Explain the role of transmission probability in epidemic dynamics
3. Observe how exponential growth occurs in infection spread
4. Analyze the relationship between network connectivity and epidemic severity
5. Connect to real-world concepts like R₀ (basic reproduction number)

### Physics and Mathematics Concepts

- **Network Theory**: Graph structures, connectivity, degree distribution
- **Probability**: Transmission probability, stochastic processes
- **Exponential Growth**: Early-stage epidemic dynamics
- **Epidemiology**: SIR models, disease transmission, contact networks
- **Agent-Based Modeling**: Individual-level simulation approaches

### Classroom Activities

**Activity 1: Infection Probability Exploration** (10 minutes)
- Set r to different values (0.05, 0.1, 0.2, 0.4)
- Run simulation multiple times at each setting
- Record how many steps it takes to infect everyone
- **Discussion**: How does transmission probability affect epidemic speed?

**Activity 2: Network Effects** (15 minutes)
- Observe how infection spreads along network edges
- Identify "superspreader" nodes with many connections
- Notice how network structure creates infection pathways
- **Discussion**: Why do some diseases spread faster than others?

**Activity 3: Real-World Connections** (10 minutes)
- Compare to COVID-19, flu, or other infectious diseases
- Discuss social distancing as "edge removal"
- Consider vaccination as reducing r
- **Discussion**: How do public health interventions work?

### Assessment Questions

1. What happens when you increase the r parameter? Why?
2. Why does the simulation eventually reach "Finished" status?
3. How would the simulation change if people had fewer connections?
4. What real-world factors does the r parameter represent?
5. How could you modify this to show recovery or vaccination?

### Extensions

- Add recovery: Infected nodes turn green again after time
- Implement vaccination: Some nodes immune from start
- Add edge removal: Social distancing reduces connections
- Track infection waves over time with a graph
- Add different infection states (susceptible, infected, recovered)
- Implement quarantine: Infected nodes lose connections

## Technical Implementation

**Framework**: p5.js

**Key Algorithms**:
- Random graph generation with degree constraints
- Stochastic infection spread based on probability
- Agent-based modeling with individual state tracking

**Data Structure**: Graph with vertices (agents) and edges (contacts)

## Connections to Real Epidemiology

This simulation demonstrates fundamental concepts from **network epidemiology**:

- **Contact Networks**: Real disease spread follows social contact patterns
- **R₀ (Basic Reproduction Number)**: Related to r and network degree
- **Threshold Effects**: Below certain r values, epidemics may not spread
- **Network Interventions**: Reducing connections (social distancing) slows spread
- **Targeted Interventions**: Protecting highly-connected individuals has outsized impact

## References

1. [Network-based models of infectious disease spread](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7094090/) - NIH overview of epidemic modeling
2. [Epidemic Spreading in Real Networks](https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.86.3200) - Physical Review Letters research
3. [Centers for Disease Control - Epidemiology Principles](https://www.cdc.gov/csels/dsepd/ss1978/index.html)
4. [Network Science - Chapter 10: Spreading Phenomena](http://networksciencebook.com/chapter/10) - Albert-László Barabási
