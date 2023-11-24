let width = 400;
let height = 400;
let margin = 50; // side around the plot
let priceSlider;
let demandCurve;
let maxPrice = 200;
let maxQuantity = 200;
let price = 100;
let quantity = 100;
let labelValueMargin = 140

function setup() {
  const canvas = createCanvas(width, height);
  canvas.parent('canvas-container');
  textSize(16);
  
  // Create a slider element for price adjustment
  priceSlider = createSlider(0, maxPrice, price);
  priceSlider.position(labelValueMargin, height - 35);
  priceSlider.style('width', width - labelValueMargin - 20 + 'px');
  
  // Define the demand curve as a function
  demandCurve = (p) => maxQuantity - p;
}

function draw() {
  background(240);
  
  // Update quantity based on the current value of the price slider
  price = priceSlider.value();
  quantity = demandCurve(price);
  
  // Draw the axes
  stroke(0);
  strokeWeight(1);
  line(margin, margin, margin, height - margin); // Vertical Y-axis
  // Horizontal X axis
  line(margin, height - margin, width - margin, height - margin);
  strokeWeight(0);
  text('Price', 30, 40); // Y-axis label
  text('Quantity Sold', width - margin - 70, height - margin - 10); // X-axis label
  
  // Draw the demand curve
  stroke(255, 0, 0);
  strokeWeight(3);
  line(margin, margin, width - margin, height - margin);
  
  // Draw a point on the demand curve based on current price and quantity
  fill(0, 0, 255);
  noStroke();
  x = map(quantity, 0, maxQuantity, margin, height - margin)
  y = map(price, 0, maxPrice, width - margin, margin)
  circle(x,y,10);
  
  stroke('silver');
  line(margin, y, x, y)
  line(x, y, x, height - margin)
  
  fill(0);
  noStroke();
  circle(
    margin, 
    map(price, 0, maxPrice, width - margin, margin), 10);
  
  circle(
    map(quantity, 0, maxQuantity, margin, height - margin), 
    height - margin, 10);
  
  // Text annotations
  noStroke();
  fill(0);
  textSize(16);
  text("Price and Demand Curve", 120, 30);
  text(`Input Price: ${price}`, 10, height - 30);
  text(`Quantity Sold: ${quantity}`, 10, height - 10);
  textSize(12);
  
  // instructions
  let keyMargin = 180;
  text(`Adjust price by moving the slider.`,     keyMargin, margin);
  text(`Note that as the input (price) changes`, keyMargin, margin + 20);
  text(`    the quantity sold also changes.`,    keyMargin, margin + 40);
  text(`At high prices a low quantity is sold.`, keyMargin, margin + 60);
  text(`At low prices a high quantity is sold.`, keyMargin, margin + 80);
}