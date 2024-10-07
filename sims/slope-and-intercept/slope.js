let canvasWidth = 400;
let drawAreaHeight = 400;
let canvasHeight = 450;
let controlHeight = 70;

let slopeSlider;
let interceptSlider;

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  // canvas.parent('canvas-container');
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(16);

  slopeSlider = createSlider(-1, 1, .5, 0.01);
  slopeSlider.position(115, drawAreaHeight + 10);
  slopeSlider.size(canvasWidth - 120);

  interceptSlider = createSlider(0, 400, 100, 1);
  interceptSlider.position(115, drawAreaHeight + 30);
  interceptSlider.size(canvasWidth - 120);

}

function draw() {
  noStroke();
  fill("aliceblue");  // DodgerBlue background
  rect(0, 0, canvasWidth, drawAreaHeight)
  
  // Draw the background in a light tan color
  fill('cornsilk')
  stroke(1);
  strokeWeight(1);
  rect(0, drawAreaHeight, canvasWidth, controlHeight)

  stroke('black');
  strokeWeight(1);
  let slopeValue = slopeSlider.value();
  let interceptValue = interceptSlider.value();
  fill('black');
  strokeWeight(1);
  text('Slope: ' + slopeValue, 5, drawAreaHeight + 18);
  text('Intercept: ' + interceptValue, 5, drawAreaHeight + 38);
  
  drawGrid();
  
  // Drawing blue line
  stroke('blue');
  strokeWeight(4);

  line(0, 400 - interceptValue, width, 400 - interceptValue - slopeValue * width);
}

function drawGrid() {
  // Drawing grid
  // stroke('gray');
  for(let i = 0; i <= canvasWidth; i += 50){
    if(i % 100 === 0){
      strokeWeight(1);
      line(i, 0, i, drawAreaHeight);
      line(0, i, canvasWidth, i);
    } else {
      strokeWeight(1);
      drawingContext.setLineDash([5, 15]);
      line(i, 0, i, drawAreaHeight);
      line(0, i, canvasWidth, i);
      drawingContext.setLineDash([]);
    }
  }
}