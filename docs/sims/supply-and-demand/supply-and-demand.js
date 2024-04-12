let canvasWidth = 400;
let drawHeight = 400;
let canvasHeight = 450;
let sliderLeftMargin = 120;
let margin = 30; // side around the plot
let priceSlider;
let demandCurve;
let maxPrice = 200;
let maxQuantity = 200;
let price = 100;
let quantity = 100;
let labelValueMargin = 140

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  // canvas.parent('canvas-container');
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(16);
  
  // Create a slider element for price adjustment
  priceSlider = createSlider(0, maxPrice, price);
  priceSlider.position(labelValueMargin, drawHeight + 5);
  priceSlider.size(canvasWidth - labelValueMargin - 20);
  
  // Define the demand curve as a function
  demandCurve = (p) => maxQuantity - p;
}

function draw() {
  // make the background drawing very light blue
  fill('aliceblue');
  rect(0, 0, canvasWidth, canvasWidth);
  // make the background of the controls white
  fill('white')
  rect(0, drawHeight, canvasWidth, canvasHeight-drawHeight);

  
  // Update quantity based on the current value of the price slider
  price = priceSlider.value();
  quantity = demandCurve(price);
  
  // Draw the axes
  stroke(0);
  strokeWeight(1);
  // Vertical Y-axis
  line(margin, margin, margin, drawHeight - margin); 
  
  // Horizontal X axis
  line(margin, drawHeight - margin, canvasWidth - margin, drawHeight - margin);
  strokeWeight(0);
  
  textSize(18);
  fill('black')
  text('Price', 10, 20); // Y-axis label
  text('Quantity Sold', canvasWidth - margin - 110, drawHeight - 10); // X-axis label
  
  // Draw the demand curve
  stroke(255, 0, 0);
  strokeWeight(3);
  line(margin, margin, drawHeight - margin, drawHeight - margin);
  
  // Draw a point on the demand curve based on current price and quantity
  fill(0, 0, 255);
  noStroke();
  x = map(quantity, 0, maxQuantity, margin, drawHeight - margin)
  y = map(price, 0, maxPrice, width - margin, margin)
  circle(x,y,10);
  
  stroke('silver');
  line(margin, y, x, y)
  line(x, y, x, drawHeight - margin)
  
  fill(0);
  noStroke();
  circle(
    margin, 
    map(price, 0, maxPrice, width - margin, margin), 10);
  
  circle(
    map(quantity, 0, maxQuantity, margin, drawHeight - margin), 
    drawHeight - margin, 10);
  
  // Text annotations
  noStroke();
  fill(0);
  textSize(16);
  // title
  text("Price and Demand Curve", 120, 30);
  text(`Input Price: ${price}`, 10, height - 30);
  text(`Quantity Sold: ${quantity}`, 10, height - 10);
  textSize(12);
  
  // instructions
  let keyMargin = 180;
  text(`Adjust price by moving the slider.`,     keyMargin, margin + 20);
  text(`Note that as the input (price) changes`, keyMargin, margin + 40);
  text(`    the quantity sold also changes.`,    keyMargin, margin + 60);
  text(`At high prices a low quantity is sold.`, keyMargin, margin + 80);
  text(`At low prices a high quantity is sold.`, keyMargin, margin + 100);
}