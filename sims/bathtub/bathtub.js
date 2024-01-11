let canvasWidth = 600;
let canvasHeight = 310;
let tubHeight = 200;
let tubWidth = 200;
let initialWaterHeight = tubHeight * .75; // 75% full
let sourceFlowRate = 0;
let drainFlowRate = 1;
let initialSourceFlowRate = 0;
let initialDrainFlowRate = .2;
let simulationRunning = false;
let Xmargin = 30;
let Ymargin = 30;

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  textSize(16);
  
  sourceSlider = createSlider(0, 2, initialSourceFlowRate, 0.1);
  sourceSlider.position(330, canvasHeight - 45);
  
  drainSlider = createSlider(0, 2, initialDrainFlowRate, 0.1);
  drainSlider.position(330, canvasHeight - 15);
  
  startButton = createButton('Start/Stop');
  startButton.position(10, canvasHeight - 40);
  startButton.mousePressed(toggleSimulation);
  
  resetButton = createButton('Reset');
  resetButton.position(100, canvasHeight- 40);
  resetButton.mousePressed(resetSimulation);
  
  // make sure we start with the default values
  resetSimulation();
}

function draw() {
  background(245);
  
  // get updates from the sliders
  sourceFlowRate = sourceSlider.value();
  drainFlowRate = drainSlider.value();
  
  drawBathtub(Xmargin, Ymargin,
              tubWidth, tubHeight, 
              waterHeight,
              sourceFlowRate, drainFlowRate);
  updateWaterHeight();
  drawChart();
  fill('black');
  noStroke();
  textAlign(RIGHT);
  text('Source Flow Rate:' + sourceFlowRate, 310, canvasHeight - 40);
  text('Drain Flow Rate:' + drainFlowRate, 310, canvasHeight - 10);
}

function drawBathtub(x,y,w,h,waterHeight,inFlow,outFlow) {
  // Bathtub
  stroke('black');
  strokeWeight(3);
  fill('darkgray');
  rect(x-2, y-2, w+4, h+4);
  // Water
  fill('cyan')
  noStroke();
  rect(x, y+h-waterHeight, w, waterHeight);
  // draw labels
  noStroke();
  fill('black')
  text(str(inFlow),x,y-10);
  text(str(outFlow),x+w+30,y+h);
}

// this is where we need to fix the formula to include non-linear behavior
function updateWaterHeight() {
  if (simulationRunning) {

    // fix this to make the rate of change higher for a tank that is fuller
    waterHeight += sourceFlowRate - drainFlowRate;
    waterHeight = constrain(waterHeight, 0, tubHeight);
    waterHeightHistory.push(waterHeight);
  }
}

function drawChart() {
  // Set up the axes
  let chartWidth = 300;
  let chartHeight = 200;
  let chartX = 300;
  let chartY = 230;
  
  // draw axis lines
  stroke('black');
  strokeWeight(2);
  // horizontal time axis
  line(chartX, chartY, chartX + chartWidth - 10, chartY);
  // vertical water height axis
  line(chartX, chartY, chartX, chartY - chartHeight);

  // draw the axis labels
  noStroke();
  text("Water Height", chartX+100, Ymargin);
  text("Time", canvasWidth - 20, chartY + 20);
   
  // Plot the water height vs time
  noFill();
  // draw a green line
  stroke(0, 255, 0);
  beginShape();
  for (let i = 0; i < waterHeightHistory.length; i++) {
    // first 200 points draw left to right
    if (waterHeightHistory.length < chartWidth) 
      x = map(i, 0, 199, chartX, chartX + chartWidth);
    else
      x = map(i, 0, waterHeightHistory.length - 1, chartX, chartX + chartWidth);
    let y = map(waterHeightHistory[i], 0, 200, chartY, chartY - chartHeight);
    // console.log(i, x,y);
    vertex(x, y);
  }
  endShape();
}

function toggleSimulation() {
  simulationRunning = !simulationRunning;
}

function resetSimulation() {
  waterHeight = initialWaterHeight;
  sourceFlowRate = initialSourceFlowRate;
  drainFlowRate = initialDrainFlowRate;
  waterHeightHistory = [];
}

let waterHeightHistory = [];

function mousePressed() {
  if (simulationRunning) {
    waterHeightHistory.push(waterHeight);
  }
}
