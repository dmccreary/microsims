canvasWidth = 400;
drawHeight = 275;
canvasHeight = 320;

function drawResistor(resistance, x, y, w, h, orientation) {
    // Color coding for the resistor bands
    const colors = {
    '0': 'black', // black
    '1': 'brown', // brown
    '2': 'red', // red
    '3': 'orange',
    '4': 'yellow',
    '5': 'green',
    '6': 'blue',
    '7': 'purple',
    '8': 'gray',
    '9': 'white'
    };
  

    // Calculate the color bands from the resistance value
    let digits = ("" + resistance).split('').map(Number);
    let firstBand = colors[digits[0].toString()];
    let secondBand = colors[digits[1].toString()];
    // Calculate the multiplier based on the number of zeros after the first two digits
    let numberOfZeros = digits.length - 2;
    let multiplier = colors[numberOfZeros.toString()];
  
    // Draw the resistor body based on orientation

    if (orientation === 'h') {
      // black wire under
      stroke(0);
      strokeWeight(5);
      line(x+w/2,y+h/2,x+w,y+h)
      noStroke();
      fill('tan'); // brown color for the body
      rect(x, y, w, h);
      drawBandsHorizontal(x, y, w, h, firstBand, secondBand, multiplier);
      xt = x+w/3; // x for text
      yt = y - 5;
    } else if (orientation === 'v') {
       stroke(0);
       strokeWeight(5);
       line(x+w/2, y-20, x+w/2, y+h+20);
       noStroke();
       fill('tan'); // brown color for the body
       rect(x, y, w, h);
       drawBandsVertical(x, y, w, h, firstBand, secondBand, multiplier);
       xt = x - 40; // x for text
       yt = y + h/2;
    } else {
      console.log("Error in resistor orientation.  Must be the letter 'h' or 'v'.")
    }
    
    // background of text white
    fill('white');
    noStroke();
    rect(xt-2,yt-12,34,14);
    fill(0);
    addPeriod = '';
    if (numberOfZeros == 1) {thirdSymbol = "0"};
    if (numberOfZeros == 2) {addPeriod = "."; thirdSymbol = "K";};
    if (numberOfZeros == 3) {thirdSymbol = "K"};
    if (numberOfZeros == 4) {thirdSymbol = "0K"};
    if (numberOfZeros == 5) {thirdSymbol = "M"};
    text(str(digits[0]) + addPeriod + str(digits[1]) + thirdSymbol, xt, yt);
  }
  
  function drawBandsHorizontal(x, y, w, h, firstBand, secondBand, multiplier) {
    let bandWidth = w / 10;
    fill(firstBand);
    rect(x + 2 * bandWidth, y, bandWidth, h);
    fill(secondBand);
    rect(x + 4 * bandWidth, y, bandWidth, h);
    fill(multiplier);
    rect(x + 6 * bandWidth, y, bandWidth, h);
  }
  
  function drawBandsVertical(x, y, w, h, firstBand, secondBand, multiplier) {
    let bandHeight = h / 10;
    fill(firstBand);
    rect(x, y + 2 * bandHeight, w, bandHeight);
    fill(secondBand);
    rect(x, y + 4 * bandHeight, w, bandHeight);
    fill(multiplier);
    rect(x, y + 6 * bandHeight, w, bandHeight);
  }  

  function drawPushButton(x, y, size, color) {
    // 12mm X 12mm button on breadboard with a width of 404
    bc = size / 2 // button center
  
    // Button style - use a rect with rounded corners
    fill('darkgray');
    noStroke();
    rect(x, y, size, size, 5);
  
    // Draw the circle red if we have a press in our circle
    if (dist(mouseX, mouseY, x+bc, y+bc) < bc && mouseIsPressed)
      fill('lightgray');
    else
      fill(color);
    
    // Draw the circle
    circle(x+bc, y+bc, size);
    
    if (dist(mouseX, mouseY, x+bc, y+bc) < bc && mouseIsPressed)
      return 1;
    else
      return 0;
  }

// 5mm LED top view
function drawLED(x, y, w, h, color, state) {
  // wire
  stroke('black');
  strokeWeight(5);
  line(x, y, x+w, y+h);
  // LED
  if (state)
     fill(color);
  else fill('black');
  strokeWeight(1);
  circle(x+(w/2), y+(h/2),20);
}
  
function preload() {
    breadboard_img = loadImage('./breadboard-horiz-small.png');
  }

function setup() {
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-container');
    textSize(16);
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
  
    // need to return state
    rs = drawPushButton(123, 109, 48, 'red');
    gs = drawPushButton(189, 109, 48, 'green');
    bs = drawPushButton(251, 109, 48, 'blue');
  
    // vertical leds
    drawLED(124+7, 20, 4, 45, 'red', rs);
    drawLED(186+7, 20, 3, 45, 'green', gs);
    drawLED(248+7, 19, 3, 45, 'blue', bs);

    // ohms, x, y, w, h
    drawResistor(220, 123+30, 180, 13, 50, 'v');
    drawResistor(220, 186+30, 180, 13, 50, 'v');
    drawResistor(220, 251+30, 180, 13, 50, 'v');
    
    fill(0);
    text("rs=" + rs + " gs=" + gs + " bs= " + bs, 10, drawHeight + 30);
}