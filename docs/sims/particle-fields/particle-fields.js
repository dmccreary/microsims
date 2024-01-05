// Particle simulation with sliders
let canvasWidth = 600;
let drawHeight = 400;
let canvasHeight = 460;
let particleColor = 100;
let lineColor = 150;

// this class describes the properties of a single particle.
class Particle {
// setting the co-ordinates, radius and the
// speed of a particle in both the co-ordinates axes.
  constructor(){
    this.x = random(0,width);
    this.y = random(0,drawHeight);
    this.r = random(4,12);
    this.xSpeed = random(-2,2);
    this.ySpeed = random(-1,1.5);
  }

// creation of a particle.
  createParticle() {
    noStroke();
    fill(particleColor, 255, 255);
    circle(this.x,this.y,this.r);
  }

// setting the particle in motion.
  moveParticle() {
    if(this.x < 0 || this.x > width)
      this.xSpeed*=-1;
    if(this.y < 0 || this.y > drawHeight)
      this.ySpeed*=-1;
    this.x+=this.xSpeed;
    this.y+=this.ySpeed;
  }

// this function creates the connections(lines)
// between particles which are less than a certain distance apart
  joinParticles(particles) {
    particles.forEach(element =>{
      let dis = dist(this.x,this.y,element.x,element.y);
      if(dis<85) {
        stroke(lineColor, 255, 255);
        line(this.x,this.y,element.x,element.y);
      }
    });
  }
}

// an array to add multiple particles
let particles = [];

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  colorMode(HSB, 255);
  textSize(16);
  
  for(let i = 0;i<width/10;i++){
    particles.push(new Particle());
  }
  
  colorParticleSlider = createSlider(0, 255, 150, 1);
  colorParticleSlider.position(10, drawHeight + 30);
  colorParticleSlider.size(canvasWidth/2 - 15);
  
  colorLineSlider = createSlider(0, 255, 100, 1);
  colorLineSlider.position(canvasWidth/2 + 20, drawHeight + 30);
  colorLineSlider.size(canvasWidth/2 - 15);
}

function draw() {
  fill('black');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, canvasHeight-drawHeight);
  
    // update values from the sliders
  particleColor =  colorParticleSlider.value();
  lineColor = colorLineSlider.value()
  
  for(let i = 0;i<particles.length;i++) {
    particles[i].createParticle();
    particles[i].moveParticle();
    particles[i].joinParticles(particles.slice(i));
  }
  
  fill('black');
  noStroke();
  text('Particle Color:' + particleColor, 10, drawHeight + 20);
  text('Line Color:' + lineColor, canvasWidth/2 + 25, drawHeight + 20);
}
