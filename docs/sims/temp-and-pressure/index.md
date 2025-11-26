---
title: Temperature and Pressure
description: A MicroSim demonstrating the relationship between temperature, molecular motion, and gas pressure with visual ice/fire indicators.
quality_score: 95
image: /sims/temp-and-pressure/temp-and-pressure.png
og:image: /sims/temp-and-pressure/temp-and-pressure.png
twitter:image: /sims/temp-and-pressure/temp-and-pressure.png
social:
   cards: false
---

# Temperature and Pressure

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Temperature and Pressure MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## Description

This MicroSim demonstrates the **relationship between temperature, molecular motion, and gas pressure**. As temperature increases, atoms move faster and collide with container walls more frequently, resulting in higher pressure. The simulation includes a unique visual ice/fire indicator that shows the phase transition at 0°C.

### Key Features

- **Temperature Control**: Adjust temperature from -50°C to 100°C (or -58°F to 212°F)
- **Dual Temperature Scales**: Switch between Celsius and Fahrenheit with radio buttons
- **Ice/Fire Visualization**: Visual indicator showing ice cubes below 0°C and flames above 0°C
- **Pressure Indicator**: Real-time display of wall collisions per second (direct pressure measurement)
- **Start/Pause Control**: Freeze the simulation to examine molecular positions
- **Fixed Atom Count**: 100 atoms for consistent observations
- **Color-Coded Atoms**: Atoms change color from blue (cold) to red (hot) based on temperature

### Physics Concepts

This simulation illustrates several fundamental concepts from kinetic molecular theory:

1. **Temperature-Velocity Relationship**: Higher temperature causes faster molecular motion
2. **Pressure and Collisions**: Pressure is directly related to the frequency of wall collisions
3. **Kinetic Molecular Theory**: Temperature is a measure of average kinetic energy
4. **Phase Transitions**: Visual representation of the freezing point at 0°C (32°F)
5. **Gas Behavior**: Atoms exhibit continuous random motion characteristic of gases

## Embedding

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/temp-and-pressure/main.html" height="482px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Explain the relationship between temperature and molecular kinetic energy
2. Understand how increased molecular motion leads to higher pressure
3. Observe the effects of temperature on molecular speed
4. Connect microscopic molecular behavior to macroscopic properties (temperature and pressure)
5. Recognize the significance of 0°C as a phase transition point

### Classroom Activities

**Activity 1: Temperature and Motion** (10 minutes)
- Start the simulation at 20°C (room temperature)
- Gradually increase temperature to 100°C
- Observe and record changes in:
  - Molecular speed (visual observation)
  - Wall collision frequency (pressure indicator)
  - Atom color changes
- **Discussion**: How does temperature affect molecular motion? What is the relationship?

**Activity 2: Freezing Point Exploration** (10 minutes)
- Set temperature to 10°C and slowly decrease to -20°C
- Watch the ice/fire indicator transition at 0°C
- Observe molecular motion at very low temperatures
- **Discussion**: What happens at 0°C? Why does molecular motion slow down at low temperatures?

**Activity 3: Temperature and Pressure** (10 minutes)
- Record wall hits/second at various temperatures:
  - -30°C
  - 0°C
  - 25°C
  - 50°C
  - 100°C
- Create a graph of temperature vs. collision rate
- **Discussion**: What is the relationship between temperature and pressure? Why?

**Activity 4: Temperature Scale Conversion** (5 minutes)
- Switch between Celsius and Fahrenheit scales
- Note equivalent temperatures:
  - Freezing point: 0°C = 32°F
  - Room temperature: ~20°C = ~68°F
  - Boiling point: 100°C = 212°F
- **Discussion**: Why do we use different temperature scales?

### Assessment Questions

1. What happens to the speed of atoms when temperature increases? Explain using kinetic molecular theory.
2. Why does the collision rate (pressure) increase with temperature?
3. At what temperature does the ice/fire indicator change? What does this represent?
4. If you doubled the temperature from 25°C to 50°C, would the pressure double? Test and explain.
5. How would this simulation change if we could vary the number of atoms?
6. In a real gas, what other factors affect pressure besides temperature?

### Extensions

- Research the ideal gas law: **PV = nRT**
- Investigate how this relates to weather (air pressure and temperature)
- Explore absolute zero (-273.15°C) and its significance
- Connect to real-world applications (pressure cookers, car tires in summer/winter)
- Research Maxwell-Boltzmann distribution of molecular speeds

## Technical Notes

This MicroSim follows the standard MicroSim architecture:

- **Drawing Area**: 400px height with aliceblue background
  - Atom simulation chamber
  - Ice/Fire indicator region (50px)
- **Control Area**: 80px height with temperature slider, Start/Pause button, and temperature scale radio buttons
- **Responsive Design**: Adapts horizontally to container width
- **Framework**: Built with p5.js 1.11.10

### Special Features

- **Temperature Scale Conversion**: Automatic slider range adjustment when switching between Celsius and Fahrenheit
- **Dynamic Visualization**: Ice cubes appear below 0°C, flames appear above 0°C (more flames = hotter)
- **Color Gradient**: Atoms transition from blue (cold) to red (hot) based on temperature
- **Fixed Atom Count**: 100 atoms provide consistent observations without the complexity of variable particle density

## Sample Prompt

!!! prompt
    Create a MicroSim using the microsim-p5 skill that demonstrates the relationship between temperature and pressure. Show 100 atoms bouncing in a chamber with a temperature slider. Include an ice/fire visualization region that shows ice cubes below 0°C and flames above 0°C. Add radio buttons to switch between Celsius and Fahrenheit. Display a counter showing wall collision frequency as a pressure indicator. Include Start/Pause functionality.

## References

- Kinetic Molecular Theory of Gases (General Chemistry textbooks)
- Gay-Lussac's Law: P/T = constant (at constant volume and amount)
- Ideal Gas Law: PV = nRT
- Maxwell, J. C. (1860). "Illustrations of the dynamical theory of gases"
- Boltzmann, L. (1872). "Further studies on the thermal equilibrium of gas molecules"
