let inputA = false;
let inputB = false;
let buttonA, buttonB;

function setup() {
  const canvas = createCanvas(400, 400);
  canvas.parent('canvas-container');
  
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
  
  // Compute AND and OR outputs
  let andOutput = inputA && inputB;
  let orOutput = inputA || inputB;
  
  // Draw output wires
  strokeWeight(5);
  stroke(andOutput ? 'red' : 'black');
  line(220, 50, 300, 50);
  
  stroke(orOutput ? 'red' : 'black');
  line(220, 150, 300, 150);
}

function toggleA() {
  inputA = !inputA;
}

function toggleB() {
  inputB = !inputB;
}
