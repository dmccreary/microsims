let digitSlider, sizeSlider;
let digitLabel, sizeLabel;

let segmentMapping = [
  [1, 1, 1, 1, 1, 1, 0], // 0
  [0, 1, 1, 0, 0, 0, 0], // 1
  [1, 1, 0, 1, 1, 0, 1], // 2
  [1, 1, 1, 1, 0, 0, 1], // 3
  [0, 1, 1, 0, 0, 1, 1], // 4
  [1, 0, 1, 1, 0, 1, 1], // 5
  [1, 0, 1, 1, 1, 1, 1], // 6
  [1, 1, 1, 0, 0, 0, 0], // 7
  [1, 1, 1, 1, 1, 1, 1], // 8
  [1, 1, 1, 1, 0, 1, 1]  // 9
];

function setup() {
  const canvas = createCanvas(600, 600);
  canvas.parent('canvas-container');
  // Slider to select digit (0 to 9)
  digitLabel = createDiv('Digit: ');
  digitLabel.position(10, 10);
  
  digitSlider = createSlider(0, 9, 8);
  digitSlider.position(80, 10);
  digitSlider.style('width', '250px')

  // Slider to adjust the size of the 7-segment display
  sizeLabel = createDiv('Size: ');
  sizeLabel.position(10, 40);
  
  sizeSlider = createSlider(10, 200, 90);
  sizeSlider.position(80, 40);
  sizeSlider.style('width', '250px')
}

function draw() {
  background(220);
  colorMode(RGB, 256);

  let digit = digitSlider.value();
  let sz = sizeSlider.value();
  
  // Update the labels with the current values
  digitLabel.html('Digit: ' + digit);
  sizeLabel.html('Size: ' + sz);

  drawDigit(digit, width / 3, height / 3, sz);
}

// x and y are the center of the digit
function drawDigit(digit, x, y, size) {
  textSize(16);
  let segmentOn = segmentMapping[digit];
  // black
  stroke(0);
  strokeWeight(20);
  
  // Horizontal segments
  let horizontal = [0, 3, 6];
  for (let i of horizontal) {
    if (segmentOn[i]) {
      if (i==0) yOffset = 0;
      if (i==3) yOffset = size*2;
      if (i==6) yOffset = size;
      if (i==0) stroke(255,0,0);
      if (i==3) stroke(0,255,0);
      if (i==6) stroke(245,180,200);
      line(x - size, y+yOffset-size, x + size, y+yOffset-size);
    }
  }

  // Vertical segments
  let vertical = [1, 2, 4, 5];
  for (let i of vertical) {
    if (segmentOn[i]) {
      if (i==1 || i==5) {startY = y-size; endY = y}
      if (i==2 || i==4) {startY = y;      endY = y + size;}
      if (i==4 || i==5) {xOffset = -size;}
      if (i==1 || i==2) {xOffset = +size;}
      xpos = x + xOffset;
      strokeWeight(20);
      if (i==1) stroke(255,170,0);
      if (i==2) stroke(255,255,0);
      if (i==4) stroke(0,0,255);
      if (i==5) stroke(200,0,200);
      line(xpos, startY, xpos, endY);
      
      // for debugging
      strokeWeight(0);
      text('i:' + i + ' vline: x: ' + x + '  xOffset:' + xOffset + ' xpos: ' + xpos + '  from y1: ' + startY + '  y2: ' + endY, 10, 360+i*40)
      text('i:' + i + ' startY:' + startY + '  endY:' + endY + '  xOffest:' + xOffset, 10, 380+i*40);

    }
  }
}
