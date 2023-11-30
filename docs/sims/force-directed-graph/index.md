# Force Directed Graph

[Forced Directed Graph Demo](./force-directed-graph.html){ .md-button .md-button--primary }

## Sample Prompt

```linenums="0"
Create a simulation of a force-directed graph placement algorithm.
Generate a single file p5.js sketch on a 500x400 canvas.
Set global variables for the width and height of the canvas.
The algorithm will move the position of vertices of a connected
   based on a force-directed graph placement mode.
For the initial state,  place 20 vertices on random locations on a 500x400 canvas. 
Make the vertices be rendered by a circle with a radius of 10.
Connect each vertex to 3 other vertices using bidirectional links.
Add a controls to incrementally step through the algorithm.
Add buttons for a single Step, 10 Steps, 100 Steps and 1,000 Steps at the bottom of canvas.
Display the number of steps, and the total movement of the verticies in
each step.
```



## Sample Response

Note that this response needed several passes.

```javascript
// Global variables
let vertices = [];
let totalVertices = 20;
let totalSteps = 0;
let canvasWidth = 500;
let canvasHeight = 400;
let vertexRadius = 10;
let totalMovement = 0; // To track total net movement
let repulsiveForce = 500;
let springLength = 100;
let springStrength = 0.005;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  textSize(16);
  background(245);

  // Initialize vertices
  for (let i = 0; i < totalVertices; i++) {
    let v = {
      x: random(vertexRadius, width - vertexRadius),
      y: random(vertexRadius, height - vertexRadius),
      edges: [],
      prevX: 0,
      prevY: 0
    };
    v.prevX = v.x; // Store initial position
    v.prevY = v.y;
    vertices.push(v);
  }

  // Create edges
  for (let i = 0; i < vertices.length; i++) {
    while (vertices[i].edges.length < 3) {
      let neighbor = floor(random(totalVertices));
      if (neighbor !== i && !vertices[i].edges.includes(neighbor)) {
        vertices[i].edges.push(neighbor);
        vertices[neighbor].edges.push(i); // Bidirectional link
      }
    }
  }

  // Button for 'Next' step
  let nextButton = createButton('Next');
  nextButton.position(10, height + 10);
  nextButton.mousePressed(() => performSteps(1));

  // Button for '10 Steps'
  let tenStepsButton = createButton('10 Steps');
  tenStepsButton.position(60, height + 10);
  tenStepsButton.mousePressed(() => performSteps(10));
  
  // Button for '100 Steps'
  let hundredStepsButton = createButton('100 Steps');
  hundredStepsButton.position(140, height + 10);
  hundredStepsButton.mousePressed(() => performSteps(100));
  
  // Button for '1000 Steps'
  let thousandStepsButton = createButton('1000 Steps');
  thousandStepsButton.position(230, height + 10);
  thousandStepsButton.mousePressed(() => performSteps(1000));
}

function draw() {
  background(245);
  drawVertices();
  drawEdges();
  displayTotalSteps();
  displayTotalMovement();
}

function drawVertices() {
  fill('blue');
  for (let vertex of vertices) {
    ellipse(vertex.x, vertex.y, vertexRadius * 2, vertexRadius * 2);
  }
}

function drawEdges() {
  stroke(0);
  for (let i = 0; i < vertices.length; i++) {
    for (let edge of vertices[i].edges) {
      line(vertices[i].x, vertices[i].y, vertices[edge].x, vertices[edge].y);
    }
  }
}

function performSteps(steps) {
  for (let i = 0; i < steps; i++) {
    nextStep();
  }
}

function nextStep() {
  totalSteps = totalSteps + 1;

  // Calculate repulsive forces
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      let dx = vertices[i].x - vertices[j].x;
      let dy = vertices[i].y - vertices[j].y;
      let distance = sqrt(dx * dx + dy * dy);
      let force = repulsiveForce / (distance * distance);
      let forceX = force * dx / distance;
      let forceY = force * dy / distance;

      vertices[i].x += forceX;
      vertices[i].y += forceY;
      vertices[j].x -= forceX;
      vertices[j].y -= forceY;
    }
  }

  // Calculate attractive forces along edges
  for (let vertex of vertices) {
    for (let edge of vertex.edges) {
      let dx = vertex.x - vertices[edge].x;
      let dy = vertex.y - vertices[edge].y;
      let distance = sqrt(dx * dx + dy * dy);
      let force = (distance - springLength) * springStrength;

      let forceX = force * dx / distance;
      let forceY = force * dy / distance;

      vertex.x -= forceX;
      vertex.y -= forceY;
      vertices[edge].x += forceX;
      vertices[edge].y += forceY;
    }
  }

  // Update total net movement
  totalMovement = 0;
  for (let vertex of vertices) {
    let dx = vertex.x - vertex.prevX;
    let dy = vertex.y - vertex.prevY;
    totalMovement += sqrt(dx * dx + dy * dy);
    vertex.prevX = vertex.x;
    vertex.prevY = vertex.y;
  }
}

function displayTotalSteps() {
  fill(0);
  noStroke();
  textAlign(LEFT, BOTTOM);
  text(`Steps: ${totalSteps}`, 10, height - 10);
}

function displayTotalMovement() {
  fill(0);
  noStroke();
  textAlign(RIGHT, BOTTOM);
  text(`Total Step Movement: ${totalMovement.toFixed(2)}`, width - 10, height - 10);
}

```