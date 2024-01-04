canvasWidth = 400;
canvasHeight = 300;

function setup() {
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-container');
    background(240);
    textSize(16);
    drawResistor(220, 30, 50, 100, 40, 'h'); // Test with a horizontal resistor
    drawResistor(330, 150, 50, 100, 40, 'h'); // Test with a horizontal resistor
    drawResistor(1200, 270, 50, 100, 40, 'h'); // Test with a horizontal resistor
  
    drawResistor(4700, 50, 150, 40, 100, 'v'); // Vertical resistor
    drawResistor(10000, 150, 150, 40, 100, 'v'); // Vertical resistor
    drawResistor(100000, 250, 150, 40, 100, 'v');
    drawResistor(1000000, 350, 150, 40, 100, 'v'); 
  
  }
  
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
    fill('tan'); // brown color for the body
    rect(x, y, w, h);
    
    if (orientation === 'h') {
      drawBandsHorizontal(x, y, w, h, firstBand, secondBand, multiplier);
      xt = x+w/3; // x for text
      yt = y - 5;
    } else if (orientation === 'v') {
      drawBandsVertical(x, y, w, h, firstBand, secondBand, multiplier);
      xt = x - 40; // x for text
      yt = y + h/2;
    }
    
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
  
  // Add any additional setup or draw functions as needed
  