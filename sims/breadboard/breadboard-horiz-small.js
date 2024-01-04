canvasWidth = 400;
drawHeight = 275;
canvasHeight = 320;

function preload() {
    breadboard_img = loadImage('./breadboard-horiz-small.png');
}

function setup() {
    const canvas = createCanvas(canvasWidth, canvasHeight);
}

function draw() {
    // make the background drawing region light gray
    fill(245);
    rect(0,0,canvasWidth, canvasWidth);
    // make the background of the controls white
    fill('white')
    rect(0,drawHeight,canvasWidth, canvasHeight-drawHeight);

    // Place the image at 00
    image(breadboard_img, 0, 0);

  // Button style - use a rect with rounded corners
  fill(0, 0, 255);
  rect(80, 80, 40, 40, 5);

  // Draw the circle red if we have a press in our circle
  if (dist(mouseX, mouseY, 100, 100) < 20 && mouseIsPressed)
    fill(255, 0, 0);
  else
    fill(200, 200, 200);
  
  // Draw the circle
  circle(100, 100, 38);
  
}