// p5.js sketch test
/// <reference types="p5/global" />

let drawHeight = 400;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;

function setup() {
  const canvas = createCanvas(select('main').width, canvasHeight);
  canvas.parent(document.querySelector('main'));
}

function draw() {
  // draw the backgrounds of the two regions and add a thin gray border
  fill('aliceblue');
  stroke('silver');
  rect(0, 0, width, drawHeight);
  // control region background is white
  fill('white');
  rect(0, drawHeight, width, controlHeight);

  // Title centered at the top
  fill('black');
  noStroke();
  textSize(24);
  textAlign(CENTER, TOP);
  text('This is the Title for my width-responsive p5.js Sketch', width / 2, margin);

  // Draw the object here
  fill('green');
  circle(width / 2, drawHeight / 2, 50);

  // control labels
  fill('black');
  textSize(16);
  textAlign(LEFT, TOP);
  text("This is the area for controls in a width-responsive sketch.", margin, drawHeight + 5);
}

function windowResized() {
  resizeCanvas(select('main').width, canvasHeight);
}
