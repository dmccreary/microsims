// AC circut and current chart

let canvasWidth = 600;
let drawHeight = 250;
let canvasHeight = 300;
let running = false;
let time = 0;
let currentValues = [];
let buttonLeftMargin = 40;

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');

  textSize(16);
  
  const startButton = createButton('Start');
  startButton.position(buttonLeftMargin, drawHeight);
  startButton.mousePressed(() => running = true);

  const stopButton = createButton('Stop');
  stopButton.position(buttonLeftMargin + 60, drawHeight);
  stopButton.mousePressed(() => running = false);

  const resetButton = createButton('Reset');
  resetButton.position(buttonLeftMargin + 120, drawHeight);
  resetButton.mousePressed(resetSimulation);
}

function draw() {
  background(255);
  drawCircuit();
  drawChart();

  if (running) {
    time += deltaTime / 1000; // Convert milliseconds to seconds
    
    // Calculate the current using a simple sine wave function
    let current = 5 * sin(TWO_PI * time); // 5 V peak-to-peak with 1 Hz frequency
    
    currentValues.push(current);
    if (currentValues.length > 300) {
      currentValues.shift(); // Remove the oldest value to keep the array size fixed
    }
  }
}

function drawCircuit() {
  // Draw the circuit on the left side
  stroke(0);
  fill(245);
  // rect(0, 0, 270, 240);
  
  margin = 40;
  tr = 50; // top row
  cw = 180; // circuit width
  ch = 150; // circuit height
  
  // circut square
  rect(margin, margin, cw, ch);
  // line(margin, tr, margin, ch); // Connection to AC source
  
  // put in the wavy line as the icon
  fill('gray');
  circle(margin, ch/2+margin, 40); // AC source
  
  // top hline
  line(margin, margin, margin+cw, margin); // Connection to resistor
  
  // resister vertical line
  strokeWeight(10);
  line(margin+cw, margin*2, margin+cw, margin+ch-margin); // Resistor
  strokeWeight(1);
  
  fill(1);
  // line(140, 70, 160, 70); // Connection back to the circuit
  
  text("1 kHz", margin + 25, ch/2+margin)
  text("1K Ohm", cw - 30, ch/2+margin)
}

function drawChart() {
  // Draw the chart on the right side
  const chartWidth = 310;
  const chartHeight = 250;
  const xOffset = 260;
  const yOffset = 20;

  // Axes
  stroke(0);
  // hline
  line(xOffset, yOffset + chartHeight, xOffset + chartWidth, yOffset + chartHeight); // X axis
  
  // vline
  line(xOffset, yOffset+ 10, xOffset, yOffset + chartHeight); // Y axis
  
  // Axis Labels
  text('Current', xOffset, yOffset);
  text('Time', xOffset+chartHeight+10, yOffset + chartHeight+20);


  // Plot the current values
  noFill();
  beginShape();
  for (let i = 0; i < currentValues.length; i++) {
    let x = map(i, 0, currentValues.length - 1, xOffset, xOffset + chartWidth);
    let y = map(currentValues[i], -5, 5, yOffset + chartHeight, yOffset);
    vertex(x, y);
  }
  endShape();
}

function resetSimulation() {
  currentValues = [];
  time = 0;
  running = false;
}
