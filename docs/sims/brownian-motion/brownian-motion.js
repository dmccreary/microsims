let molecules = [];
let sliderTemp, sliderMol;

function setup() {
    const canvas = createCanvas(800, 400);
    canvas.parent('canvas-container');
    textSize(16);

    sliderTemp = createSlider(1, 10, 5);
    sliderTemp.style('width', '340px');

    sliderMol = createSlider(1, 100, 50);
    sliderMol.style('width', '340px');
    
    for (let i = 0; i < sliderMol.value(); i++) {
        molecules[i] = new Molecule();
    }
}

function draw() {
    // fill drawing area with very light blue background - MicroSim standard style
    fill('aliceblue');
    stroke('silver');
    strokeWeight(1);
    rect(0, 0, canvasWidth, drawHeight);

    // fill control area with a white background
    fill('white');
    rect(0, drawHeight, canvasWidth, canvasHeight-drawHeight); 
    
    // get the new speed from the UI
    speed = speedSlider.value();
    // uncomment to add a title to the simulation
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(32);
    text('Bouncing Ball Simulation', margin, canvasWidth/2);
    stroke();
    let temp = sliderTemp.value();
    let mol = sliderMol.value();
    fill('white');
    text('Temperature: ' + temp, 10, 390);
    text('Molecules: ' + mol, 350, 390);
    for (let i = 0; i < mol; i++) {
        if (i < molecules.length) {
            molecules[i].update();
            molecules[i].show();
            molecules[i].edges();
        } else {
            let m = new Molecule();
            molecules.push(m);
        }
    }
    while (molecules.length > mol) {
        molecules.pop();
    }
}

class Molecule {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.vel = p5.Vector.random2D();
    }

    update() {
        this.vel.setMag(sliderTemp.value());
        this.pos.add(this.vel);
    }

    edges() {
        if (this.pos.x > width || this.pos.x < 0) {
            this.vel.x *= -1;
        }
        if (this.pos.y > height || this.pos.y < 0) {
            this.vel.y *= -1;
        }
    }

    show() {
        noStroke();
        fill(255, 100);
        ellipse(this.pos.x, this.pos.y, 20);
    }
}
