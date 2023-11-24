# Recursion Tree

![Recursion Tree Icon](icon.png)

Recursion trees are ideal ways to demonstrate recursive programming.
In a recursive program, a function calls itself repeatedly.
The result is often a beautiful complex image generated from
a very small program.

## Prompt

```linenums="0"
Generate a single file p5.js sketch on a 400x400 canvas.
Generate a drawing of a tree that uses recursion.
Add a slider that changes the angle between the branches of the tree.
```

## Response

```js
let angleSlider;

function setup() {
  const canvas = createCanvas(400, 400);
  canvas.parent('canvas-container');
  angleSlider = createSlider(0, TWO_PI, PI / 4, 0.01);
  angleSlider.position(10, height + 10);
}

function draw() {
  background(255);
  stroke(0);
  translate(width / 2, height);
  drawBranch(100);
}

function drawBranch(len) {
  line(0, 0, 0, -len);
  translate(0, -len);

  if (len > 4) {
    push();
    rotate(angleSlider.value());
    drawBranch(len * 0.67);
    pop();

    push();
    rotate(-angleSlider.value());
    drawBranch(len * 0.67);
    pop();
  }
}
```