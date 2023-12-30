# Battery Circuit

<figure markdown>
  ![Circuit](./circuits.png){ width="400" }
  <figcaption>See animated current when the circuit is turned on.</figcaption>
</figure>


[Battery Circuit Demo](./battery-circuit.html){ .md-button .md-button--primary }

In this lesson, we will create an animation of a circuit that includes:

1. A battery
2. An on/off switch
3. A resistor
4. An LED
5. Wires that connect the components in a series loop

We will use the [Animated Wire](./wire-animate.md) demo that we did in a prior lab.

We will break the problem down into ChatGPT prompts that animate and test individual components.
We will then concatenate the components into a main animation file.

This is the most complex program we have generated so far.  It requires us
to first use ChatGPT to create several functions:

1. A drawBattery function that draws the positive and negative parts of a battery
2. A drawSwitch function that will toggle on or off
3. A resistor function that draws a resistor zig-zag symbol
4. An LED function that is black in the off state and red in the on state
5. An animate wire function that animates the flow of current (see the previous example)

Once we have functions for all these components, we can then assemble them together in
an entire simulation.  You will find that ChatGPT will not usually get the the layout
wrong and you will need to adjust the positions of the wires.

## References

* [Paul Falstad's Web-based circuit simulator](https://www.falstad.com/circuit/)
* [Circuit JS 1](https://github.com/sharpie7/circuitjs1) - open source JavaScript based circuit simulator.