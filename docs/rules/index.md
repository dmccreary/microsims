# MicroSim Rules

Modern agentic IDEs such as [Cursor](https://www.cursor.com/) work best
when they are given precise rules to follow.  These rules can also be stored
in your OpenAI "Projects" area and the Anthropic Claude Project.

Here are some examples of rules:

1. **p5.js editor rules** - make sure your MicroSim works without changes in the p5.js editor
2. **Responsive rules** - what to do when the screen is resized
3. **Layout rules** - how to place controls under the drawing area
4. **Title rules** - how to place the title of a MicroSim centered at the top of the MicroSim
5. **Slider Rules** - make sure that a label and value are placed to the left of all sliders in the control area
6. **Accessibility Rules** - rules to make the MicroSim easier to use with screen readers using the describe() function at the end of the setup()

You are welcome to create your own rules.  To get started we have provided a set of [standard rules](standard-rules.md) that have been tested with high-school teachers that use smartboards and want their controls placed at the bottom of the MicroSim.

Note that many of the rules are designed so that the MicroSim can be easily be added to any web page with a single `<iframe>` HTML element.