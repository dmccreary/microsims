let startButton, stopButton, resetButton;
let foxSlider, rabbitSlider;

let foxes = [];
let rabbits = [];
let initRabbitCount = 20;
let initFoxCount = 5;
let mode = 0; // 0=off, 1=step, 2=run
let steps = 0;

let width = 800;
let height = 500;

function setup() {
  const canvas = createCanvas(width, height);
  canvas.parent('canvas-container');

  startButton = createButton("Start");
  startButton.mousePressed(startSimulation);

  stepButton = createButton("Step");
  stepButton.mousePressed(stepSimulation);

  stopButton = createButton("Stop");
  stopButton.mousePressed(stopSimulation);

  resetButton = createButton("Reset");
  resetButton.mousePressed(resetSimulation);

  foxSlider = createSlider(1, 20, initFoxCount);
  foxSlider.position(width/2 + 100, height - 25);

  rabbitSlider = createSlider(1, 50, initRabbitCount);
  rabbitSlider.position(width/2 - 100, height - 25);
}

function draw() {
  background(245);
  initRabbitCount = rabbitSlider.value();
  initFoxCount = foxSlider.value()

  // Update foxes
  for (let i = 0; i < foxes.length; i++) {
    foxes[i].update();
    foxes[i].display();

    if (mode===1) {
      // Check for collisions with rabbits
      for (let j = 0; j < rabbits.length; j++) {
        if (foxes[i].isColliding(rabbits[j])) {
          // Fox eats rabbit
          rabbits.splice(j, 1);
          break;
        }
      }
    }
  }

  // Update rabbits
  for (let i = 0; i < rabbits.length; i++) {
    rabbits[i].update();
    rabbits[i].display();

    // Check for collisions with other rabbits
    for (let j = i + 1; j < rabbits.length; j++) {
      if (rabbits[i].isColliding(rabbits[j])) {
        // Rabbits reproduce
        // rabbits.push(new Rabbit(rabbits[i].x, rabbits[i].y));
        break;
      }
    }
  }

  fill(0);
  text("Rabbits:" + initRabbitCount, width/2 - 100, height-35)
  text("Foxes:" + initFoxCount, width/2 + 100, height-35, )
}

function startSimulation() {
  // Reset simulation
  foxes = [];
  rabbits = [];
  mode = 1;

  // Create initial population
  for (let i = 0; i < foxSlider.value(); i++) {
    foxes.push(new Fox());
  }
  for (let i = 0; i < rabbitSlider.value(); i++) {
    rabbits.push(new Rabbit(random(width), random(height)));
  }
}

function stepSimulation() {
  mode = 1;
  steps = steps + 1;
}

// stop to view canvas
function stopSimulation() {
  mode = 0;
}

function resetSimulation() {
  // Reset simulation to initial state
  stopSimulation();
  foxes = [];
  rabbits = [];
}

class Fox {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = 20;
    this.vx = random(-3, 3);
    this.vy = random(-3, 3);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off walls
    if (this.x < 0) this.vx *= -1;
    else if (this.x > width) this.vx *= -1;
    if (this.y < 0) this.vy *= -1;
    else if (this.y > height) this.vy *= -1;
  }

  display() {
    fill(255, 128, 0);
    circle(this.x, this.y, this.size);
  }

  isColliding(rabbit) {
    let distance = dist(this.x, this.y, rabbit.x, rabbit.y);
    return distance < this.size/2 + rabbit.size/2;
  }
}

class Rabbit {
  constructor(nx,ny) {
    this.x = nx; //random(width);
    this.y = ny; // random(height);
    this.size = 10;
    this.vx = random(-2, 2);
    this.vy = random(-2, 2);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off walls
    if (this.x < 0) {
      this.vx *= -1;
      this.x = 0;
    } else if (this.x > width) {
      this.vx *= -1;
      this.x = width;
    }

    if (this.y < 0) {
      this.vy *= -1;
      this.y = 0;
    } else if (this.y > height) {
      this.vy *= -1;
      this.y = height;
    }
  }

  display() {
    fill('silver');
    circle(this.x, this.y, this.size);
  }

  // if rabbits collide
  isColliding(otherRabbit) {
    let distance = dist(this.x, this.y, otherRabbit.x, otherRabbit.y);
    return distance < this.size/2 + otherRabbit.size/2;
  }
}
