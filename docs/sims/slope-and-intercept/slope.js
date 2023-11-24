let slopeSlider;
let interceptSlider;

function setup() {
  createCanvas(400, 400);
  slopeSlider = createSlider(-1, 1, .5, 0.01);
  slopeSlider.position(95, 10);
  slopeSlider.style('width', '310px');

  interceptSlider = createSlider(0, 400, 100, 1);
  interceptSlider.position(95, 30);
  interceptSlider.style('width', '310px');
}

function draw() {
  background(250);
  stroke('black');
  strokeWeight(1);
  let slopeValue = slopeSlider.value();
  let interceptValue = interceptSlider.value();
  text('Slope: ' + slopeValue, 5, 15);
  text('Intercept: ' + interceptValue, 5, 35);
  
  // Drawing grid

  for(let i = 0; i <= width; i += 50){
    if(i % 100 === 0){
      strokeWeight(1);
      line(i, 0, i, height);
      line(0, i, width, i);
    } else {
      strokeWeight(1);
      drawingContext.setLineDash([5, 15]);
      line(i, 0, i, height);
      line(0, i, width, i);
      drawingContext.setLineDash([]);
    }
  }
  
  // Drawing blue line
  stroke('blue');
  strokeWeight(4);

  line(0, 400 - interceptValue, width, 400 - interceptValue - slopeValue * width);
}
