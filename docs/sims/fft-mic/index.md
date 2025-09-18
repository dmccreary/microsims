# FFT Microphone Sounds Visualization


[P5JS Editor ](https://editor.p5js.org/dmccreary/sketches/ZYGLml9Fs)

Here is a FFT Microphone Visualizer MicroSim that follows the standard responsive design template. Here are the key features:

Key Features
------------

**Audio Analysis**: Uses p5.js AudioIn and FFT objects to capture and analyze microphone input in real-time, displaying frequency spectrum data as colorful bars.

**Start/Stop Control**: Native button in the control region that allows users to start/stop audio recording without clearing the display - when stopped, the last spectrum remains visible.

**Responsive Design**: Follows the standard MicroSim layout with separate drawing and control regions that adapt to different screen sizes.

**Visual Feedback**:

-   Color-coded frequency bars (blue for low frequencies, red for high frequencies)
-   Real-time frequency and amplitude scaling
-   Peak frequency detection and display
-   Status indicators showing recording state

**Educational Value**: Students can observe how different sounds (voice, music, noise) create different frequency patterns, helping them understand concepts like:

-   Frequency analysis and Fourier transforms
-   Audio signal processing
-   Harmonic content in different sounds
-   Real-time data visualization

Usage Instructions
------------------

1.  Click "Start" to begin microphone input (browser will request permission)
2.  Make sounds near the microphone to see the frequency spectrum
3.  Click "Stop" to pause recording (spectrum remains visible)
4.  Click "Start" again to resume recording

The visualization shows frequency on the x-axis (0 to ~22kHz) and amplitude on the y-axis, with the peak frequency displayed in the control area. This provides an excellent hands-on way to explore audio signal processing concepts.