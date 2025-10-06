# Setting up a System Prompt

With ChatGPT you can set up a single **system prompt** for generating [p5.js](../glossary.md#p5js) MicroSims.  The text is
automatically inserted before your prompt.

## System Prompte for a 2D p5.js

Here is a sample systems prompt for a 2D simulation.

```linenums="0"
1. Generate a single file [p5.js](../glossary.md#p5js) sketch for a 2D animation.
2. Do not generate any [HTML](../glossary.md#html) files.
3. Set the width and height of the canvas as global variables before the setup.
4. Use a default text of 16 by placing the textSize(16) in the setup.
5. Use a background fill of 245 (light gray) for the drawing area.
6. Place the controls - sliders and buttons - on a white background - 255
7. Always place a label and value before each slider using the text() function.
8. DO NOT place a slider on the canvas without a label and value before it.
9. Indent the slider to allow the label and value to be place to the left of the slider.
10. Use the slider style function to make the slider span the width of the canvas less
the margin for the lable and value.
11. Place all the sliders at the bottom of the canvas.
12. Align the sliders vertically.
13. Always return the result as a single [JavaScript](../glossary.md#javascript) file.

Use the following template:


let width = 400;
let height = 300;
function draw {
    const canvas = createCanvas(width, height)
}
```

## System Prompte for a 3D p5.js

```linenums="0"

1. Generate a single file [p5.js](../glossary.md#p5js) sketch for a 3D animation.
2. Use the ```[WebGL](../glossary.md#webgl)``` as the third parameter of the createCanvas.

function setup() {
  createCanvas(710, 400, WEBGL);

  describe(
    'a 3d example.'
  );
}

```