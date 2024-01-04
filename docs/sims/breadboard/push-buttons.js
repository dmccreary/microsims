canvasWidth = 404;
drawHeight = 275;
canvasHeight = 320;

function preload() {
    breadboard_img = loadImage('./breadboard-horiz-small.png');
}

function setup() {
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-container');
    textSize(16);
}

function drawPushButton(x, y, size, color) {
  // 12mm X 12mm button on breadboard with a width of 404
  bc = size / 2 // button center

  // Button style - use a rect with rounded corners
  fill('darkgray');
  rect(x, y, size, size, 5);

  // Draw the circle red if we have a press in our circle
  if (dist(mouseX, mouseY, x+bc, y+bc) < bc && mouseIsPressed)
    fill('lightgray');
  else
    fill(color);
  
  // Draw the circle
  circle(x+bc, y+bc, size);
}

function draw() {
  // make the background drawing region light gray
  fill(245);
  rect(0,0,canvasWidth, canvasWidth);
  
  // make the background of the controls white
  fill('white')
  rect(0,drawHeight,canvasWidth, canvasHeight-drawHeight);

  // Place the image at (0,0)
  image(breadboard_img, 0, 0);
  drawPushButton(123, 109, 48, 'red');
  drawPushButton(189, 109, 48, 'green');
  drawPushButton(251, 109, 48, 'blue');
}