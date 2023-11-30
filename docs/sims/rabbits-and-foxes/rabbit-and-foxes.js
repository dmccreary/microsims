// Initialize the variables
let rabbits = [];
let foxes = [];
let rabbitSlider, foxSlider, resetButton;
let initialRabbits, initialFoxes;

function setup() {
  const canvas = createCanvas(800, 800);
  canvas.parent('canvas-container');
  rabbitSlider = createSlider(0, 100, 50);  // Slider for number of rabbits
  foxSlider = createSlider(0, 100, 25);  // Slider for number of foxes
  resetButton = createButton('Reset');  // Reset button
  resetButton.mousePressed(resetSim);
  resetSim();
}

function draw() {
  background(220);
  for (let rabbit of rabbits) {
    rabbit.move();
    rabbit.show();
  }
  for (let fox of foxes) {
    fox.move();
    fox.show();
  }
  // Check if fox catches rabbit
  for (let i = foxes.length - 1; i >= 0; i--) {
    for (let j = rabbits.length - 1; j >= 0; j--) {
      if (foxes[i].catches(rabbits[j])) {
        foxes[i].grow();
        rabbits.splice(j, 1);
      }
    }
  }
}

function resetSim() {
  initialRabbits = rabbitSlider.value();
  initialFoxes = foxSlider.value();
  rabbits = [];
  foxes = [];
  for (let i = 0; i < initialRabbits; i++) {
    rabbits[i] = new Rabbit(random(width), random(height));
  }
  for (let i = 0; i < initialFoxes; i++) {
    foxes[i] = new Fox(random(width), random(height));
  }
}

// Rabbit class
class Rabbit {
  constructor(x, y) {
    this.position = createVector(x, y);
  }

  move() {
    let velocity = p5.Vector.random2D();
    this.position.add(velocity);
  }

  show() {
    fill(0, 255, 0);  // Green color for rabbit
    ellipse(this.position.x, this.position.y, 10, 10);
  }
}

// Fox class
class Fox {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.size = 10;
  }

  move() {
    let velocity = p5.Vector.random2D();
    this.position.add(velocity);
  }

  show() {
    fill(255, 0, 0);  // Red color for fox
    ellipse(this.position.x, this.position.y, this.size, this.size);
  }

  catches(rabbit) {
    let d = dist(this.position.x, this.position.y, rabbit.position.x, rabbit.position.y);
    return (d < this.size / 2);
  }

  grow() {
    this.size += 1;
  }
}
