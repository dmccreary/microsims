// Pulse Wave Modulation (PWM) simulation
// Made to render like an old oscilloscope - lime green on black
let dutyCycleSlider;
let dutyCycle = 0.5; // Initialize to 50%
let cycles = 6;
let waveHeight = height/3

function setup() {
  const canvas = createCanvas(600, 200);
  canvas.parent('canvas-container');
  
  dutyCycleSlider = createSlider(0, 1, 0.5, 0.01); // Range from 0 to 1, default value 0.5, step size 0.01
  dutyCycleSlider.style('width', '400px'); // Set width of slider
  dutyCycleSlider.position(150, height - 45); // Position slider
}

function draw() {
  background('black');
  
  // Update duty cycle
  dutyCycle = dutyCycleSlider.value();
  
  // Set stroke for waveform
  stroke('limegreen');
  // disable the fill in the waveform
  noFill();
  // make the line be double wide
  strokeWeight(2);
  
  // Generate PWM waveform
  beginShape();
  for (let x = 0; x < width; x++) {
    // Map x to time period of waveform
    let t = map(x, 0, width, 0, TWO_PI * cycles);
    
    // Calculate value of waveform at this point in time
    // Draw high if in duty cycle, low otherwise
    let y = (sin(t) > 2 * dutyCycle - 1) ? 
        2*height/3 : height/3; 
    
    // Add vertex to waveform
    vertex(x, y);
  }
  endShape();
  
  // Display duty cycle
  fill('white');
  noStroke();
  textSize(16);
  // Display duty cycle as percentage
  text("Duty Cycle: " + nf(dutyCycle*100, 0, 0) + "%", 20, height - 30); 
}
