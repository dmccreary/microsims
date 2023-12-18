// RLC series circuit parameters

let R = 15.0; // Resistance in ohms
let L = 0.01; // Inductance in henrys
let C = 100e-6; // Capacitance in farads
let angularFrequency = 120 * PI; // Omega, derived from 60 Hz source
let time = 0; // Initialize time
let dt = 1 / 60; // Time increment for 60Hz

// Variables for plotting the chart
let currentValues = [];
let maxValues = 300; // Number of values to display in the chart

function setup() {
  createCanvas(800, 600);
  noFill();
}

function draw() {
  background(220);
  
  // Update time
  time += dt;
  
  // Calculate current in the circuit
  let current = sin(angularFrequency * time) / sqrt(R * R + pow((angularFrequency * L - 1 / (angularFrequency * C)), 2));
  
  // Add current value to array for plotting
  currentValues.push(current);
  if (currentValues.length > maxValues) {
    currentValues.splice(0, 1); // Remove the oldest value
  }
  
  // Plot current vs. time chart
  stroke(0);
  beginShape();
  for (let i = 0; i < currentValues.length; i++) {
    let x = map(i, 0, currentValues.length - 1, 0, width);
    let y = map(currentValues[i], -1, 1, height * 0.75, height * 0.25);
    vertex(x, y);
  }
  endShape();
  
  // Display circuit parameters
  textSize(16);
  fill(0);
  noStroke();
  text(`R: ${R}Ω, L: ${L}H, C: ${C}F`, 20, 20);
  text(`Current: ${current.toFixed(3)}A`, 20, 40);
  
  // Draw RLC circuit components visually
  drawCircuit();
}

function drawCircuit() {
  stroke(0);
  // Draw resistor
  line(50, 300, 150, 300);
  // Draw inductor
  line(150, 290, 250, 290);
  line(150, 310, 250, 310);
  // Draw capacitor
  line(250, 290, 250, 310);
  line(270, 290, 270, 310);
  // Connect to source
  line(50, 300, 50, 350);
  ellipse(50, 350, 20, 20);
  // Draw ground
  line(270, 300, 270, 350);
  line(260, 350, 280, 350);
}

