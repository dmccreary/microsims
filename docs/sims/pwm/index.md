### Pulse-Width Modulation

![PWM](./../../img/pwm.png)

Pulse-width modulation is the way that microcontrollers send a precise signal to a 
device such as a motor controller.  This simulation models an old CRT oscilloscope display
with a bright green line on a black background.

[Pulse-Width Modulation](./pwm.html){ .md-button .md-button--primary }

## Prompt

```linenums="0"
Generate a p5.js sketch file of a simulation of a static pulse width
   modulation (PWM) waveform on a 600x300 canvas.
Add a range control slider to adjust the Duty Cycle of the waveform.
Make the default Duty Cycle be 50%.
The min should be 0% and the max should be 100%.
Place the range control slider at the bottom of the canvas.
Make sure the range control slider has a width of 400px using the style attribute.
At the end of the draw() function add a text() function that displays the label
   and value of the duty cycle.
```