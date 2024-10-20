// MicroSim Template
// canvas regions setup
// let canvasWidth = 750;
let drawHeight = 335;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let aspectRatio = 1.91; // Open Graph standard
let canvasWidth = canvasHeight * aspectRatio;
let margin = 50;

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(16);
  
  // create a new slider at th bottom of the canvas
  mySlider = createSlider(0, 300, 150, 1);
  mySlider.position(120, drawHeight + 23);
  mySlider.size(canvasWidth - 3*margin); 
}

function draw() {
  // background of drawing region
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);

  // background of controls
  fill('whitegray');
  rect(0, drawHeight, canvasWidth, controlHeight);
  
  // get the updated slider value
  radius = mySlider.value();
  
  // custom drawing here
  fill('blue');
  circle(canvasWidth/2, drawHeight/2, radius);
  
  // add the slider label and value in control area
  fill('black');
  text("Radius:"+radius, 15, drawHeight + 30)
}