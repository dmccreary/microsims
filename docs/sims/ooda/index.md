---
title: OODA Loop
description: An interactive simulation of the OODA Loop (Observe, Orient, Decide, Act) decision-making cycle, demonstrating how speed through the loop provides competitive advantage.
image: /sims/ooda/ooda.png
og:image: /sims/ooda/ooda.png
twitter:image: /sims/ooda/ooda.png
social:
   cards: false
---

# OODA Loop

<iframe src="main.html" height="560px" scrolling="no"></iframe>

[Run the OODA Loop MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## Embedding in Your Website

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/ooda/main.html" height="560px" scrolling="no"></iframe>
```

## Description

The OODA Loop is a decision-making model developed by United States Air Force Colonel John Boyd. The acronym OODA stands for **Observe, Orient, Decide, Act**. This framework describes the cycle that individuals and organizations go through when making decisions, particularly in competitive or rapidly changing environments.

This MicroSim visualizes two agents (Blue Agent and Red Agent) progressing through their respective OODA loops at different speeds. The key insight demonstrated is that **the agent who can complete the cycle faster gains a significant competitive advantage** by being able to make more decisions and adapt more quickly than their opponent.

### The Four Phases

1. **Observe**: Gathering information about the current situation from the environment, competitors, and available data sources.

2. **Orient**: Analyzing and synthesizing the observed information within the context of previous experiences, mental models, and cultural traditions. Boyd emphasized that this is the most important phase.

3. **Decide**: Evaluating options and choosing the most appropriate course of action based on the orientation.

4. **Act**: Implementing the chosen decision and executing the strategy.

After acting, the cycle repeats as the outcomes of actions become new observations.

### Key Concepts

- **Speed Advantage**: Completing the OODA loop faster than an opponent allows you to "get inside" their decision cycle, making their decisions based on outdated information.

- **Iterative Process**: The loop is continuous and cyclical. Each action creates new situations to observe.

- **Agility Over Power**: Boyd concluded that success depends on the ability to rapidly adapt and make fast decisions, regardless of technical advantages.

- **Application Domains**: Originally developed for military strategy, the OODA loop is now widely used in business, cybersecurity, law enforcement, management, and competitive sports.

## Controls

- **Agent 1 Speed Slider**: Adjust the speed at which the blue agent progresses through their OODA loop (0.2 to 3.0)
- **Agent 2 Speed Slider**: Adjust the speed at which the red agent progresses through their OODA loop (0.2 to 3.0)
- **Start/Pause Button**: Begin or pause the simulation
- **Reset Button**: Reset both agents to the beginning and clear cycle counters
- **Cycle Counters**: Track how many complete OODA loops each agent has completed

## Lesson Plan

### Learning Objectives

After using this MicroSim, students will be able to:

1. Define the four phases of the OODA loop (Observe, Orient, Decide, Act)
2. Explain why decision-making speed provides competitive advantage
3. Understand the iterative and cyclical nature of decision-making
4. Apply OODA loop concepts to real-world scenarios in business, strategy, and personal decision-making

### Grade Level

High School (9-12), Undergraduate, Graduate

### Subject Areas

- Business Strategy
- Management
- Military Science
- Decision Science
- Systems Thinking
- Cybersecurity
- Competitive Analysis

### Instructional Activities

#### Activity 1: Equal Speed Comparison (5 minutes)
1. Set both agents to the same speed (e.g., 1.5)
2. Press Start and observe for 30 seconds
3. **Discussion**: When speeds are equal, neither agent gains an advantage

#### Activity 2: Speed Advantage (5 minutes)
1. Set Agent 1 speed to 2.5 and Agent 2 speed to 1.0
2. Press Start and observe the cycle counters
3. **Discussion**: Agent 1 completes significantly more decision cycles. In a competitive scenario, Agent 1 would be making decisions based on current information while Agent 2 is still working with outdated data.

#### Activity 3: Real-World Application (10 minutes)
Discuss how the OODA loop applies to:
- **Business**: Companies that can observe market trends, orient their strategy, decide on products, and act faster than competitors
- **Sports**: Athletes who can observe opponents' movements, orient their position, decide on tactics, and act more quickly
- **Cybersecurity**: Security teams that can observe threats, orient their defenses, decide on responses, and act faster than attackers
- **Personal Decision-Making**: How breaking down decisions into these four phases can improve decision quality

#### Activity 4: Identifying Bottlenecks (10 minutes)
1. Discuss which phase typically takes the longest in various scenarios
2. Boyd emphasized that **Orient** is often the most time-consuming but critical phase
3. Brainstorm strategies to speed up each phase without sacrificing decision quality:
   - **Observe**: Better data collection systems, automation
   - **Orient**: Training, experience, mental models, avoiding analysis paralysis
   - **Decide**: Clear decision-making frameworks, delegation of authority
   - **Act**: Efficient execution processes, empowered teams

### Assessment Questions

1. What does OODA stand for?
2. Who developed the OODA loop framework?
3. Why does completing the OODA loop faster provide a competitive advantage?
4. Which phase did John Boyd emphasize as most important? Why?
5. Give an example of how the OODA loop applies to a business scenario.
6. How does the OODA loop demonstrate the concept of "agility over raw power"?

### Extensions

- **Research Project**: Investigate how John Boyd developed the OODA loop concept from aerial combat observations
- **Case Study Analysis**: Analyze a business success or failure through the lens of OODA loop speed
- **Simulation Modification**: Challenge advanced students to modify the code to add obstacles or interruptions to specific phases
- **Comparative Analysis**: Compare the OODA loop to other decision-making frameworks (e.g., PDCA cycle, Design Thinking)

### Prerequisites

- Basic understanding of decision-making processes
- Familiarity with competitive strategy concepts (helpful but not required)

### Duration

15-30 minutes for core activities; can be extended with discussion and research projects

## Technical Details

- **Framework**: p5.js
- **Canvas Size**: 800×620 pixels (width-responsive)
- **Visualization**: Two circular loops divided into four color-coded segments representing the OODA phases
- **Animation**: Markers move around each loop at user-controlled speeds
- **Metrics**: Cycle counters track completed decision cycles for each agent

## References

1. Boyd, J. R. (1976). "Destruction and Creation." U.S. Army Command and General Staff College.
2. Osinga, F. P. B. (2007). "Science, Strategy and War: The Strategic Theory of John Boyd." Routledge.
3. Richards, C. (2012). "Certain to Win: The Strategy of John Boyd, Applied to Business." Xlibris Corporation.
4. Coram, R. (2002). "Boyd: The Fighter Pilot Who Changed the Art of War." Little, Brown and Company.

## Historical Context

Colonel John Boyd (1927-1997) was a United States Air Force fighter pilot and military strategist. He developed the OODA loop concept in the 1960s based on his observations of aerial combat in the Korean War. Boyd noticed that American F-86 pilots had a much better kill ratio than pilots of the Soviet MiG-15, despite the MiG-15 being technically superior in many respects. He attributed this to the F-86's better visibility and hydraulic controls, which allowed pilots to observe and act more quickly, getting inside the enemy's decision cycle.

Boyd's work became foundational in military strategy and has since been applied to numerous fields including business, sports, law enforcement, and cybersecurity. His emphasis on speed, agility, and adaptability over raw power has influenced strategic thinking worldwide.

## Note for Educators

**Screenshot Reminder**: To create high-quality social media previews, please capture a screenshot of this MicroSim and save it as `ooda.png` in the `/docs/sims/ooda/` directory. The recommended size is 1200×630 pixels for optimal display in social media sharing.

## License

This MicroSim is released under the Creative Commons Attribution 4.0 International License (CC BY 4.0).
