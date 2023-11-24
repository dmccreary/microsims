# Logic Gates

In this example, we will generate a graphical simulation of Boolean logic gates.
This example shows how both "AND" and "OR" gates work.  You can easily change the prompt to perform other operations such as "NOT", "NAND" and "NOR".

You will note that we are explicit on the horizontal line placement location.  Generative AI is not good at doing precise layout.

Prompt:

```linenums="0"
Create a single p5.js sketch using a 400x400 canvas.  
The sketch is a simulation of two simple logic gates, one "AND" and one "OR".
There are two input wires on the left.  
Label the inputs "A" and "B" using size 16 black text.
Draw input A as a horizontal line at y=50.
Draw input B as a horizontal line at y=150.
Have both input wires connect to both the "AND" and "OR" logic gates.  
The top gate is a Boolean "AND" operation.  
The bottom gate is a Boolean an "OR" operation.
Add two input toggle buttons on the left side to control the state of the inputs.
Initialize the initial states of the inputs to be off. 
When a wire is high, draw it in red.  
When a wire is at ground, draw it in black.
Place a label "AND" in size 16 point test on the "AND" gate.
Place a label "OR" in size 16 point text over the "AND" gate.
```

[Link to Simulation Demo](./logic-gates.html)

## Sample Code

```js
let inputA = false;
let inputB = false;
let buttonA, buttonB;

function setup() {
  createCanvas(400, 400);
  
  // Create input buttons for A and B
  buttonA = createButton('Toggle A');
  buttonA.position(10, 50);
  buttonA.mousePressed(toggleA);

  buttonB = createButton('Toggle B');
  buttonB.position(10, 150);
  buttonB.mousePressed(toggleB);
}

function draw() {
  background(220);
  textSize(24)
  
  // Draw the labels
  strokeWeight(0);
  fill('black');
  text('A', 30, 50);
  text('B', 30, 150);
  
  
  // Draw input wires
  strokeWeight(5)
  stroke(inputA ? 'red' : 'black');
  line(75, 50, 150, 50);
  line(75, 50, 150, 150);
  stroke(inputB ? 'red' : 'black');
  line(75, 150, 150, 150);
  line(75, 150, 150, 50);
  
  // Draw AND gate
  fill(255);
  stroke('black')
  beginShape();
  vertex(150, 20);
  vertex(200, 20);
  vertex(220, 50);
  vertex(200, 80);
  vertex(150, 80);
  endShape(CLOSE);
  
  strokeWeight(0);
  fill('black');
  textSize(24)
  text('AND', 155, 60);
  
  // Draw OR gate
  fill(255);
  strokeWeight(5);
  stroke('black')
  beginShape();
  vertex(150, 120);
  vertex(200, 120);
  vertex(220, 150);
  vertex(200, 180);
  vertex(150, 180);
  endShape(CLOSE);
  
  strokeWeight(0);
  fill('black');
  text('OR', 155, 160);
```