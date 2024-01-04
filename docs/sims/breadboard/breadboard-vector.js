let canvasWidth = 400;
let canvasHeight = 280;

// apply to both power rail and center columns
let tie_size = 5;
let tie_spacing = 12.2;

let power_rail_height = 50;
let power_rail_rows = 2;
let power_rail_left_margin = 30;
let num_groups = 5;
let group_ties = 5;
let group_spacing = 49;

// Central columns
let colums_left_margin = 23;
let colums_y_offset = 66;
let coluns_y_offset2 = 156;
let num_columns = 30;
let central_trough_height = 20;

function preload() {
    breadboard_img = loadImage('./breadboard-horiz-small.png');
}

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');

  background(235);
  
  // Place the image at 00
  //image(breadboard_img, 0, 5);
  
  drawPowerRails();
  drawCenterColumnTies();
  drawCenterTrough();
  drawColumnNumbers(62, RIGHT);
  drawColumnNumbers(213, LEFT);
  drawRowLetters(66, -387, 'a  b  c  d  e');
  drawRowLetters(156, -387, 'f   g  h   i   j');
  drawRowLetters(66, -13, 'a  b  c  d  e');
  drawRowLetters(156, -13, 'f   g  h   i   j');
  noLoop();
}

function draw() {
    // No continuous drawing needed
}

function drawRowLetters(x, y, myStr) {
  push();
  rotate(PI / 2);
  fill('darkgray')
  textSize(11);
  text(myStr, x, y);
  pop();
}

function hline(x,y,w) {
  line(x,y,x+w,y) 
}

function drawCenterTrough() {
  fill('lightgray')
  rect(0, canvasHeight / 2 - 6, canvasWidth, 10);
}

function drawColumnNumbers(vertical_offset, align) {
  push();
  rotate(PI / 2);
  fill('darkgray')
  textSize(8);
  textAlign(align);
  for(let i = 1; i <= 30; i++) {
    text(str(i), vertical_offset, -391 + 12.28*i);
  }
  pop();
}

// draw five groupings of five
function drawPowerRailTies(yOffset) {
  noStroke();
  fill('black');
  for (let group = 0; group < num_groups; group++) {
    for (let tie = 0; tie < group_ties; tie++) {
      
      rect(power_rail_left_margin+group * (group_ties * tie_size + group_spacing) + tie * tie_spacing, yOffset, tie_size, tie_size)
    }
  }
}

function drawPowerRails() {
  drawPosNeg(15,13);
  drawPosNeg(canvasWidth - 9,13);
  // Drawing the top power rail
  // top red line
  strokeWeight(3);
  stroke('red');
  hline(power_rail_left_margin, 12, 
        canvasWidth - power_rail_left_margin*2+9)
  
  // draw the ties within the top power rail
  drawPowerRailTies(21);
  drawPowerRailTies(32);
  
  // bottom black line on the top rail
  stroke('black');
  hline(power_rail_left_margin, 43, 
        canvasWidth -power_rail_left_margin*2+9)
  
  
  // Drawing the bottom power rail
  
  drawPosNeg(15,canvasHeight - 47);
  drawPosNeg(canvasWidth - 9,canvasHeight - 47);
  // top red line
  strokeWeight(3);
  stroke('red');
  hline(power_rail_left_margin, canvasHeight - 50, 
        canvasWidth - power_rail_left_margin*2 + 9)
  
  drawPowerRailTies(canvasHeight-40);
  drawPowerRailTies(canvasHeight-27);
  
  // bottom black line
  stroke('black');
  hline(power_rail_left_margin, canvasHeight - 15, 
        canvasWidth -power_rail_left_margin*2 + 9)
}

function drawPosNeg(x,y) {
  len = 4;
  dist_to_neg = 30;
  strokeWeight(2);
  // positive
  stroke('red');
  line(x-len,y,x+len,y);
  line(x,y-len,x,y+len);
  // netative
  stroke('black');
  line(x,y-len+dist_to_neg,x,y+len+dist_to_neg);
}

function drawCenterColumnTies() {
  let cols = num_columns;
  let startX = colums_left_margin;
  let startY = colums_y_offset;
  let gap = 12.26; // gap between columns

  let rows = 5;

  // Drawing the ties
  noStroke();
  fill(0);
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      // Top section ties
      rect(startX + col * gap, startY + row * gap, tie_size, tie_size);

      // Bottom section ties
      rect(startX + col * gap, coluns_y_offset2 + row * gap, tie_size, tie_size);
    }
  }
}

// Save this code and run it in the p5.js Web Editor: https://editor.p5js.org/
