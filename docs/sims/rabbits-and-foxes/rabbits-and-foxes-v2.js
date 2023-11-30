let startButton, stopButton, resetButton;
let foxSlider, rabbitSlider;

let foxes = [];
let rabbits = [];

let width = 800;
let height = 600;

function setup() {
  createCanvas(width, height);

  startButton = createButton("Start");
  startButton.mousePressed(startSimulation);

  stopButton = createButton("Stop");
  stopButton.mousePressed(stopSimulation);

  resetButton = createButton("Reset");
  resetButton.mousePressed(resetSimulation);

  foxSlider = createSlider(1, 20, 10);
  foxSlider.position(width/2 - 100, 10);

  rabbitSlider = createSlider(1, 50, 20);
  rabbitSlider.position(width/2 + 100, 10);
}

function draw() {
  background(220);

  // Update foxes
  for (let i = 0; i < foxes.length; i++) {
    foxes[i].update();
    foxes[i].display();

    // Check for collisions with rabbits
    for (let j = 0; j < rabbits.length; j++) {
      if (foxes[i].isColliding(rabbits[j])) {
        // Fox eats rabbit
        rabbits.splice(j, 1);
        break;
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
        rabbits.push(new Rabbit());
        break;
      }
    }
  }
}

function startSimulation() {
  // Reset simulation
  foxes = [];
  rabbits = [];

  // Create initial population
  for (let i = 0; i < foxSlider.value(); i++) {
    foxes.push(new Fox());
  }
  for (let i = 0; i < rabbitSlider.value(); i++) {
    rabbits.push(new Rabbit());
  }
}

function stopSimulation() {
  // Stop simulation by clearing the arrays
  foxes = [];
  rabbits = [];
}

function resetSimulation() {
  // Reset simulation to initial state
  stopSimulation();
  startSimulation();
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
    fill(255, 0, 0);
    ellipse(this.x, this.y, this.size, this.size);
  }

  isColliding(rabbit) {
    let distance = dist(this.x, this.y, rabbit.x, rabbit.y);
    return distance < this.size/2 + rabbit.size/2;
  }
}

class Rabbit {
  constructor() {
    this.x = random(width);
    this.y = random(height);
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
    fill(0, 0, 255);
    ellipse(this.x, this.y, this.size, this.size);
  }

  isColliding(otherRabbit) {
    let distance = dist(this.x, this.y, otherRabbit.x, otherRabbit.y);
    return distance < this.size/2 + otherRabbit.size/2;
  }
}
