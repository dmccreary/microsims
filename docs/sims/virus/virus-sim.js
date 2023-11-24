let vertices = [];
let numVertices = 100
let edges = [];
// default r
let r = 0.05;
let simulationRunning = false;
let buttons = {};
let sliderR;
let simSteps = 0;
let simulationStatus = 'Ready'
let initalInfectedCount = 3;
let currentInfectedCount = initalInfectedCount;

function setup() {
  createCanvas(800, 600);

  // Create vertices
  for (let i = 0; i < numVertices; i++) {
    vertices.push(new Vertex(random(width - 10) + 5, random(height-30) + 5, i < initalInfectedCount ? true : false));
  }

  // Create edges
  for (let v of vertices) {
    while (v.edges.length < 3) {
      let other = random(vertices);
      if (other !== v && !v.edges.includes(other) && other.edges.length < 6) {
        v.edges.push(other);
        other.edges.push(v);
        edges.push([v, other]);
      }
    }
  }

  // Create control elements
  buttons.start = createButton('Start');
  buttons.start.mousePressed(() => simulationRunning = true);

  buttons.stop = createButton('Stop');
  buttons.stop.mousePressed(() => simulationRunning = false);

  buttons.step = createButton('Step');
  buttons.step.mousePressed(stepSimulation);

  buttons.reset = createButton('Reset');
  buttons.reset.mousePressed(resetSimulation);

  let sliderR = createSlider(0, .4, r, 0.01);
  sliderR.style('width', '340px');
  sliderR.input(() => r = sliderR.value());
}

function draw() {
  background(245);
  
  // Draw edges
  stroke(0);
  for (let [v1, v2] of edges) {
    line(v1.x, v1.y, v2.x, v2.y);
  }

  // Draw vertices
  tmp = 0
  for (let v of vertices) {
    v.draw();
    if (v.infected == 1) {
      tmp += 1;
    }
  currentInfectedCount = tmp
  }

  // Run simulation
  if (simulationRunning) {
    stepSimulation();
  }
  
  // display sim statistics
  fill('white)');
  rect(0,height-25, 400, 25);
  fill(0);
  textSize(16);
  text('r: ' + r + '   Steps: ' + simSteps + '   Infected: ' + currentInfectedCount + '   Status: ' + simulationStatus, 10, height-10);
}

function stepSimulation() {
  // are we done?
  if (currentInfectedCount >= numVertices) {
    simulationStatus = 'Finished'
  }
  else {
     for (let v of vertices) {
        v.step();
      }
   simSteps += 1; 
  }
}

function resetSimulation() {
  for (let v of vertices) {
    v.reset();
  }
  simulationRunning = false;
  currentInfectedCount = initalInfectedCount
  simSteps = 0
  simulationStatus = 'Ready'
}

class Vertex {
  constructor(x, y, infected = false) {
    this.x = x;
    this.y = y;
    this.infected = infected;
    this.edges = [];
    this.initialState = infected;
  }

  draw() {
    fill(this.infected ? color(255, 0, 0) : color(0, 255, 0));
    ellipse(this.x, this.y, 20, 20);
  }

  step() {
    if (!this.infected) {
      for (let v of this.edges) {
        if (v.infected && random() < r) {
          this.infected = true;
          break;
        }
      }
    }
  }

  reset() {
    this.infected = this.initialState;
  }
}
