---
title: 555 Timer
description: An interactive MicroSim demonstrating the 555 timer IC in astable and monostable modes with accurate RC timing formulas.
quality_score: 78
image: /sims/555-timer/555-timer.png
og:image: /sims/555-timer/555-timer.png
twitter:image: /sims/555-timer/555-timer.png
social:
   cards: false
---
# 555 Timer

<iframe src="main.html" height="520px" width="100%" scrolling="no"></iframe>

[Run the 555 Timer MicroSim](./main.html){ .md-button .md-button--primary }

[Edit the 555 Timer MicroSim](https://editor.p5js.org/dmccreary/sketches/mccfRwlmJ)

## About This Simulation

The 555 timer IC is one of the most popular and versatile integrated circuits ever made. Since its introduction in 1972, billions have been manufactured. This simulation lets you explore its two primary operating modes:

- **Astable Mode (Oscillator)**: Produces a continuous square wave output—perfect for blinking LEDs, generating tones, or creating clock signals
- **Monostable Mode (One-Shot)**: Produces a single pulse of precise duration when triggered—used for debouncing switches, creating time delays, or generating clean pulses

## Learning Objectives

After working with this simulation, you should be able to:

1. **Explain** how changing resistance and capacitance affects the timing period of a 555 circuit
2. **Calculate** the output frequency and duty cycle for astable mode using the formulas
3. **Predict** the pulse width in monostable mode given R and C values
4. **Compare** the behavior differences between astable and monostable modes
5. **Identify** the key pins on a 555 timer IC and their functions

## Key Concepts

### The RC Time Constant

The 555 timer's operation depends on the **RC time constant**—the time it takes for a capacitor to charge through a resistor. When a capacitor charges through a resistor:

- Higher resistance = slower charging = longer timing period
- Higher capacitance = more charge storage = longer timing period
- The relationship is multiplicative: doubling either R or C doubles the time

### Timing Formulas

**Astable Mode (Oscillator):**

$$T_{high} = 0.693 \times (R_1 + R_2) \times C$$

$$T_{low} = 0.693 \times R_2 \times C$$

$$f = \frac{1.44}{(R_1 + 2R_2) \times C}$$

**Monostable Mode (One-Shot):**

$$t = 1.1 \times R \times C$$

The 0.693 and 1.1 constants come from the natural logarithm relationships in capacitor charging (ln(2) ≈ 0.693).

## Things to Explore

Try these experiments to deepen your understanding:

### Astable Mode Experiments

1. **Doubling Test**: Set R1=10kΩ, R2=47kΩ, C=10µF. Note the frequency. Now double R2 to see how it affects frequency.

2. **Duty Cycle Challenge**: Can you create a 50% duty cycle? (Hint: It's not possible with the standard 555 circuit—why?)

3. **Audio Range**: Try to set the frequency to approximately 440 Hz (the musical note A). What R and C values work?

4. **Slow Blink**: Create a 1-second period (0.5 seconds on, 0.5 seconds off). Verify with the displayed calculations.

### Monostable Mode Experiments

1. **Precise Timing**: Set the values to create exactly a 1-second pulse. Verify by triggering and counting.

2. **Quick Response**: What's the shortest pulse you can reliably create with the available component values?

3. **Effect of Each Component**: Keep C constant at 50µF and vary R. Then keep R constant and vary C. Which has a more dramatic effect on the pulse width?

### Challenge Questions

- Why is the duty cycle in astable mode always greater than 50%?
- What would happen if R1 was set to zero in astable mode?
- In monostable mode, what happens if you trigger again before the pulse ends?

## Real-World Applications

The 555 timer appears in countless applications:

| Application | Mode | What It Does |
|------------|------|--------------|
| LED Flasher | Astable | Blinks indicator lights at a set rate |
| PWM Motor Control | Astable | Varies motor speed via duty cycle |
| Touch Switch | Monostable | Creates a timed output from momentary touch |
| Debounce Circuit | Monostable | Cleans up noisy mechanical switch signals |
| Missing Pulse Detector | Monostable | Monitors heartbeats, watchdog timers |
| Car Turn Signal | Astable | Flashes at ~1-2 Hz |
| Tone Generator | Astable | Creates audio frequencies for alarms, buzzers |
| Camera Flash Timer | Monostable | Controls flash duration |

## 555 Pin Functions

| Pin | Name | Function |
|-----|------|----------|
| 1 | GND | Ground (0V) |
| 2 | TRIG | Trigger input—starts timing when pulled LOW |
| 3 | OUT | Output—goes HIGH during timing |
| 4 | RESET | Resets timer when pulled LOW (usually tied to VCC) |
| 5 | CTRL | Control voltage—usually bypassed with 0.01µF capacitor |
| 6 | THRES | Threshold input—ends timing when voltage exceeds 2/3 VCC |
| 7 | DISCH | Discharge—internal transistor discharges external capacitor |
| 8 | VCC | Positive supply voltage (4.5V to 16V) |

## How the 555 Works Internally

The 555 contains:

- **Two comparators**: One monitors the threshold (pin 6), one monitors the trigger (pin 2)
- **An SR flip-flop**: Stores the current output state
- **A discharge transistor**: Rapidly drains the timing capacitor
- **A voltage divider**: Creates reference voltages at 1/3 and 2/3 of VCC

In astable mode, the capacitor continuously charges through R1+R2 and discharges through R2, creating the oscillation. The asymmetric charge/discharge paths explain why duty cycle is always >50%.

## Prompt Used to Generate This Simulation

```linenums="0"
Create a single file p5.js simulation of a 555 timer that supports
both astable (oscillator) and monostable (one-shot) modes.

Include:
- Mode toggle button to switch between astable and monostable
- Sliders for R1, R2 (astable only), and C with kΩ and µF units
- Accurate timing formulas: T_high = 0.693(R1+R2)C, T_low = 0.693(R2)C for astable
  and t = 1.1RC for monostable
- Realistic 8-pin DIP chip diagram showing all pin names
- Output waveform display with HIGH/LOW labels
- LED indicator that lights when output is HIGH
- Calculated timing values display (period, frequency, duty cycle)
- Trigger button for monostable mode
- Responsive canvas width with minimum 400px
- Standard MicroSim layout: aliceblue drawing area, white control area
```

## References

* [555 timer IC on Wikipedia](https://en.wikipedia.org/wiki/555_timer_IC)
* [Digikey 555-timer Calculator](https://www.digikey.com/en/resources/conversion-calculators/conversion-calculator-555-timer)
* [555 Circuit Simulator on Falstad](https://www.falstad.com/circuit/circuitjs.html) - allows you to change the resistor and capacitor in a simulator and see the frequency
* [Texas Instruments NE555 Datasheet](https://www.ti.com/lit/ds/symlink/ne555.pdf) - official manufacturer specifications
* [Electronics Tutorials: 555 Timer](https://www.electronics-tutorials.ws/waveforms/555_timer.html) - detailed theory explanation
