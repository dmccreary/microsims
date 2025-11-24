---
title: Wave Sums and Fourier Synthesis
description: Interactive demonstration of wave superposition showing how complex waveforms are created by adding simple sine waves - fundamental to understanding Fourier analysis and signal processing.
quality_score: 70
image: /sims/wave-sums/sum-of-waveforms.png
og:image: /sims/wave-sums/sum-of-waveforms.png
twitter:image: /sims/wave-sums/sum-of-waveforms.png
social:
   cards: false
---

# Wave Sums and Fourier Synthesis

<iframe src="main.html" width="100%" height="650px"></iframe>

[Run the Wave Sums MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/wave-sums/main.html" width="100%" height="650px"></iframe>
```

## Description

This MicroSim demonstrates **wave superposition** and the foundations of **Fourier synthesis** - the process of building complex waveforms from simple sine waves. This fundamental concept underlies signal processing, audio synthesis, image compression (JPEG), wireless communication, and the Fast Fourier Transform (FFT) algorithm.

### Key Features

- **Four Sine Waves**: Frequencies of 1, 2, 3, and 4 times the fundamental
- **Interactive Checkboxes**: Select which waves to include in the sum
- **Real-Time Synthesis**: See the sum waveform update instantly
- **Individual Wave Display**: Each component wave shown in its own box
- **Visual Clarity**: White waveforms on light background with clear labels
- **Harmonic Series**: Demonstrates the building blocks of complex sounds

### How It Works

The simulation displays four sine waves with different frequencies:

1. **Wave 1**: Frequency = 1 (fundamental frequency)
2. **Wave 2**: Frequency = 2 (first harmonic/octave)
3. **Wave 3**: Frequency = 3 (second harmonic)
4. **Wave 4**: Frequency = 4 (third harmonic)

**Superposition Principle**: When you check boxes to include waves, the simulation:
1. Calculates the amplitude at each point for selected waves
2. Adds the values together (sum = wave1 + wave2 + wave3 + wave4)
3. Displays the resulting waveform at the bottom

**Mathematical Process**:
```
y(t) = A₁sin(2πf₁t) + A₂sin(2πf₂t) + A₃sin(2πf₃t) + A₄sin(2πf₄t)
```

Where:
- A = amplitude (fixed at 30 pixels)
- f = frequency (1, 2, 3, or 4)
- t = time (horizontal position)

## Physics and Mathematics Concepts

This simulation illustrates fundamental concepts from wave physics and signal processing:

### 1. **Wave Superposition**
When multiple waves occupy the same space, they combine by adding their amplitudes at each point. This is a cornerstone principle in:
- Acoustics (musical instruments, room acoustics)
- Optics (interference patterns, holograms)
- Quantum mechanics (wave function superposition)
- Electrical engineering (signal mixing, radio transmission)

### 2. **Fourier Analysis**
**Jean-Baptiste Joseph Fourier** (1822) discovered that any periodic waveform can be decomposed into a sum of sine waves. This simulation demonstrates the reverse process - **Fourier synthesis** - building complex waves from simple components.

**Key Insight**: Complex signals (speech, music, images) can be represented as combinations of simple sine waves of different frequencies.

### 3. **Harmonic Series**
The frequencies (1, 2, 3, 4...) form a **harmonic series** - the basis of musical pitch:
- **Fundamental (f₁)**: Determines the perceived pitch
- **2nd Harmonic (2f₁)**: One octave higher
- **3rd Harmonic (3f₁)**: Perfect fifth above the octave
- **4th Harmonic (4f₁)**: Two octaves higher

Musical instruments produce rich tones by combining these harmonics in different proportions.

### 4. **Constructive and Destructive Interference**
Watch how waves combine:
- **Constructive Interference**: When peaks align, the sum is larger
- **Destructive Interference**: When peaks meet troughs, they cancel out
- **Complex Patterns**: Different phase relationships create intricate waveforms

## Educational Applications

### Learning Objectives

Students will be able to:

1. **Understand** the principle of wave superposition through visual demonstration
2. **Visualize** how complex waveforms emerge from simple sine wave combinations
3. **Analyze** the relationship between frequency components and resulting waveforms
4. **Connect** to Fourier analysis and signal processing applications
5. **Predict** how different wave combinations will interfere

### Prerequisites

- Basic trigonometry: sine function concept
- Understanding of waves: frequency, amplitude, period
- Introduction to periodicity
- Basic algebra: adding functions

### Classroom Activities

**Activity 1: Building Waveforms** (10 minutes)
- Start with only Wave 1 selected (fundamental)
- Add Wave 2 (octave), observe the change
- Add Wave 3, then Wave 4
- **Discussion**: How does each harmonic change the overall shape?

**Activity 2: Interference Patterns** (15 minutes)
- Select only Waves 1 and 2 (frequencies 1 and 2)
- Observe where they constructively interfere (peaks align)
- Observe where they destructively interfere (peaks cancel troughs)
- Count how many complete cycles appear
- **Discussion**: What determines where interference occurs?

**Activity 3: Sound Synthesis** (15 minutes)
- Explain that different instruments have different harmonic content
- Flute: mostly fundamental (Wave 1 only)
- Clarinet: odd harmonics (Waves 1 and 3)
- Violin: rich in all harmonics (all waves)
- **Discussion**: How do harmonics create timbre?

**Activity 4: Square Wave Approximation** (20 minutes)
- Select only odd harmonics (Waves 1 and 3)
- Explain that infinite odd harmonics create a perfect square wave
- This is the **Fourier series for a square wave**:
  ```
  y(t) = (4/π)[sin(t) + sin(3t)/3 + sin(5t)/5 + ...]
  ```
- **Discussion**: What would happen with more harmonics?

### Assessment Questions

1. **Comprehension**: What is the principle of superposition? Give an example.
2. **Application**: If you wanted to create a wave with period half that of Wave 1, which wave would you use?
3. **Analysis**: Why do Waves 1 and 2 together create a repeating pattern?
4. **Evaluation**: This simulation shows only 4 harmonics. How might the sum change with 10 or 100 harmonics?
5. **Synthesis**: Design a combination of frequencies to approximate a sawtooth wave.

## Connections to Real-World Applications

### Signal Processing

**Fast Fourier Transform (FFT)**:
- Converts signals from time domain → frequency domain
- Essential algorithm in digital signal processing
- Used in audio analysis, compression (MP3), and spectrum analyzers
- This simulation shows the reverse process (synthesis from frequency components)

**Applications**:
- **Audio**: MP3 compression, audio effects, synthesizers
- **Image Processing**: JPEG compression, image filtering, edge detection
- **Communications**: Cell phones, WiFi, radio modulation
- **Medical**: MRI imaging, EEG/ECG analysis
- **Astronomy**: Analyzing light spectra from stars

### Music and Acoustics

**Musical Instruments**:
- Each instrument has a unique harmonic signature (timbre)
- String instruments: strong fundamental + harmonics
- Brass: rich in all harmonics
- Flute: mostly fundamental, few harmonics
- This is why instruments sound different even at the same pitch

**Audio Synthesis**:
- **Additive Synthesis**: Building sounds by adding sine waves (this simulation!)
- **Subtractive Synthesis**: Start with rich waveform, filter out frequencies
- **Electronic Music**: Synthesizers use Fourier principles to create sounds

### Engineering Applications

**Electrical Engineering**:
- Analyzing AC circuits with multiple frequency components
- Radio transmission: carrier waves + signal modulation
- Power systems: harmonic distortion analysis

**Mechanical Engineering**:
- Vibration analysis in structures and machines
- Modal analysis (natural frequencies of structures)
- Noise cancellation (destructive interference)

## Technical Implementation

**Framework**: p5.js

**Key Algorithms**:
- Sine wave generation using `sin()` function with mapped angles
- Real-time array-based wave addition
- Checkbox-controlled conditional rendering

**Wave Parameters**:
- Amplitude: 30 pixels
- Frequencies: [1, 2, 3, 4] relative units
- Canvas: 400×600 pixels
- Each wave box: 360×80 pixels

**Rendering Process**:
```javascript
1. For each wave: calculate sin(2πft) at each pixel
2. Store values in array if checkbox selected
3. Add all selected wave arrays point-by-point
4. Draw sum waveform at bottom
```

## Extensions and Modifications

### Suggested Enhancements

1. **Amplitude Control**: Add sliders to adjust amplitude of each wave
2. **Phase Control**: Add phase shift sliders to demonstrate phase effects
3. **More Harmonics**: Extend to 8 or 16 waves for richer waveforms
4. **Square Wave Builder**: Add harmonics until approximating a square wave
5. **Audio Playback**: Use Web Audio API to play the synthesized waveform
6. **Frequency Spectrum**: Add a frequency domain graph (FFT visualization)
7. **Waveform Library**: Presets for sawtooth, square, triangle waves
8. **Envelope Control**: Add ADSR (Attack, Decay, Sustain, Release) controls
9. **Beat Frequencies**: Demonstrate beating with close frequencies (e.g., 1 and 1.1)

### Advanced Topics

- **Fourier Transform**: Mathematical derivation and computation
- **Discrete Fourier Transform (DFT)**: Digital signal processing version
- **Fast Fourier Transform (FFT)**: Efficient algorithm (O(n log n))
- **Window Functions**: Hanning, Hamming, Blackman windows
- **Spectrograms**: Time-frequency representations
- **Wavelet Analysis**: Alternative to Fourier analysis

## Historical Context

**Joseph Fourier** (1768-1830): French mathematician who discovered that any periodic function can be represented as a sum of sines and cosines. His work was initially controversial but became foundational to modern mathematics and engineering.

**Impact**: Fourier analysis revolutionized:
- Mathematics (functional analysis, partial differential equations)
- Physics (heat transfer, quantum mechanics, wave phenomena)
- Engineering (signal processing, control systems)
- Computer Science (algorithms, data compression)

## Standards Alignment

**Next Generation Science Standards (NGSS)**:
- HS-PS4-1: Use mathematical representations to describe waves
- HS-PS4-3: Evaluate questions about the advantages of digital vs. analog transmission

**Common Core Math**:
- HSF-TF.B.5: Model periodic phenomena with trigonometric functions
- HSF-IF.C.7: Graph trigonometric functions showing period, amplitude, and phase shift

**ISTE Standards for Students**:
- 5c: Break problems into component parts to facilitate problem-solving
- 5d: Understand how technology enables visualization of abstract concepts

## References

1. [Fourier Series - Khan Academy](https://www.khanacademy.org/science/electrical-engineering/ee-signals/ee-fourier-series/v/ee-fourier-series-intro)
2. [The Fast Fourier Transform (FFT)](https://www.algorithm-archive.org/contents/FFT/FFT.html) - Algorithm Archive
3. [Fourier Analysis Interactive](https://www.jezzamon.com/fourier/) - Visual explanation
4. [Sound Synthesis with Harmonics](https://www.acs.psu.edu/drussell/Demos/Fourier-Series/Fourier-Series.html) - Penn State Acoustics
5. [Understanding the FFT Algorithm](https://jakevdp.github.io/blog/2013/08/28/understanding-the-fft/) - Jake VanderPlas
6. [3Blue1Brown: But what is the Fourier Transform?](https://www.youtube.com/watch?v=spUNpyF58BY) - Video explanation

## Credits

Educational simulation demonstrating wave superposition and Fourier synthesis principles for STEM education.
