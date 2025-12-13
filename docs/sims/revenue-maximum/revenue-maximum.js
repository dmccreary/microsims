// Revenue Maximum MicroSim
// Two-panel display showing supply/demand curve and revenue curve
// Left panel: Price vs Quantity (demand curve)
// Right panel: Price vs Revenue (parabolic revenue curve)

// Canvas dimensions - responsive width
let canvasWidth = 800;
let drawHeight = 400;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 30;
let sliderLeftMargin = 70;
let labelValueMargin = 90;

// Panel dimensions (calculated in updateCanvasSize)
let panelWidth;
let panelGap = 20;

let priceSlider;
let demandCurve;
let maxPrice = 200;
let maxQuantity = 200;
let price = 100;
let quantity = 100;

// Revenue calculation
let revenue = 0;
let maxRevenue = 10000; // maxPrice/2 * maxQuantity/2 = 100 * 100 = 10000

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  textSize(16);

  // Create a slider element for price adjustment
  priceSlider = createSlider(0, maxPrice, price);
  priceSlider.position(labelValueMargin, drawHeight + 15);
  priceSlider.size(canvasWidth - labelValueMargin - 170);

  // Define the demand curve as a function
  demandCurve = (p) => maxQuantity - p;

  describe('Two-panel display showing demand curve and revenue curve with interactive price slider', LABEL);
}

function draw() {
  // Update values based on slider
  price = priceSlider.value();
  quantity = demandCurve(price);
  revenue = price * quantity;

  // Calculate panel width
  panelWidth = (canvasWidth - panelGap - 2 * margin) / 2;

  // Draw backgrounds
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Draw left panel (Demand Curve)
  drawDemandPanel();

  // Draw right panel (Revenue Curve)
  drawRevenuePanel();

  // Draw control area labels
  noStroke();
  fill(0);
  textSize(16);
  text(`Price: ${price}`, 10, drawHeight + 30);
  text(`Quantity: ${quantity}`, canvasWidth - 140, drawHeight + 30);
}

function drawDemandPanel() {
  let leftMargin = margin;
  let rightEdge = margin + panelWidth;
  let plotWidth = panelWidth;
  let plotHeight = drawHeight - 2 * margin;

  // Draw axes
  stroke(0);
  strokeWeight(1);
  // Y-axis
  line(leftMargin, margin, leftMargin, drawHeight - margin);
  // X-axis
  line(leftMargin, drawHeight - margin, rightEdge, drawHeight - margin);

  // Axis labels
  noStroke();
  fill('black');
  textSize(14);
  text('Price', leftMargin - 25, margin - 5);
  text('Quantity', rightEdge - 50, drawHeight - margin + 25);

  // Title
  textSize(16);
  text('Demand Curve', leftMargin + panelWidth / 2 - 50, margin);

  // Draw the demand curve (diagonal line)
  stroke(255, 0, 0);
  strokeWeight(3);
  line(leftMargin, margin, rightEdge, drawHeight - margin);

  // Calculate point position
  let x = map(quantity, 0, maxQuantity, leftMargin, rightEdge);
  let y = map(price, 0, maxPrice, drawHeight - margin, margin);

  // Draw guide lines
  stroke('silver');
  strokeWeight(1);
  line(leftMargin, y, x, y);
  line(x, y, x, drawHeight - margin);

  // Draw shaded revenue rectangle
  fill(173, 216, 230, 100); // Light blue with transparency
  noStroke();
  rect(leftMargin, y, x - leftMargin, drawHeight - margin - y);

  // Draw points
  fill(0, 0, 255);
  noStroke();
  circle(x, y, 10);

  fill(0);
  circle(leftMargin, y, 8);
  circle(x, drawHeight - margin, 8);
}

function drawRevenuePanel() {
  let leftMargin = margin + panelWidth + panelGap;
  let rightEdge = leftMargin + panelWidth;
  let plotWidth = panelWidth;
  let plotHeight = drawHeight - 2 * margin;

  // Draw axes
  stroke(0);
  strokeWeight(1);
  // Y-axis
  line(leftMargin, margin, leftMargin, drawHeight - margin);
  // X-axis
  line(leftMargin, drawHeight - margin, rightEdge, drawHeight - margin);

  // Axis labels
  noStroke();
  fill('black');
  textSize(14);
  text('Revenue', leftMargin - 25, margin - 5);
  text('Price', rightEdge - 30, drawHeight - margin + 25);

  // Title
  textSize(16);
  text('Revenue Curve', leftMargin + panelWidth / 2 - 55, margin);

  // Scale factor so peak is at 80% of chart height
  let revenueScale = maxRevenue / 0.8;

  // Draw the revenue curve (parabola: revenue = price * (maxQuantity - price))
  stroke(0, 150, 0);
  strokeWeight(3);
  noFill();
  beginShape();
  for (let p = 0; p <= maxPrice; p += 2) {
    let rev = p * (maxQuantity - p);
    let px = map(p, 0, maxPrice, leftMargin, rightEdge);
    let py = map(rev, 0, revenueScale, drawHeight - margin, margin);
    vertex(px, py);
  }
  endShape();

  // Draw vertical line at current price
  let currentX = map(price, 0, maxPrice, leftMargin, rightEdge);
  let currentY = map(revenue, 0, revenueScale, drawHeight - margin, margin);

  // Guide lines
  stroke('silver');
  strokeWeight(1);
  line(leftMargin, currentY, currentX, currentY);
  line(currentX, currentY, currentX, drawHeight - margin);

  // Draw current point on revenue curve
  fill(0, 150, 0);
  noStroke();
  circle(currentX, currentY, 12);

  // Draw points on axes
  fill(0);
  circle(leftMargin, currentY, 8);
  circle(currentX, drawHeight - margin, 8);

  // Draw maximum revenue point indicator
  let maxRevenuePrice = maxPrice / 2;
  let maxRevX = map(maxRevenuePrice, 0, maxPrice, leftMargin, rightEdge);
  let maxRevY = map(maxRevenue, 0, revenueScale, drawHeight - margin, margin);

  stroke('orange');
  strokeWeight(2);
  line(maxRevX, maxRevY, maxRevX, drawHeight - margin);

  fill('orange');
  noStroke();
  textSize(12);
  text('Max', maxRevX - 12, drawHeight - margin + 15);

  // Display revenue value in upper right of this panel
  fill(0);
  textSize(18);
  textAlign(RIGHT, TOP);
  text(`Revenue = ${revenue}`, rightEdge - 5, margin + 40);
  textAlign(LEFT, BASELINE);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);

  // Update slider position and size
  priceSlider.position(labelValueMargin, drawHeight + 15);
  priceSlider.size(canvasWidth - labelValueMargin - 170);

  redraw();
}

function updateCanvasSize() {
  // Get container width for responsive design
  let container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
  }
  // Minimum width for two panels
  if (canvasWidth < 500) {
    canvasWidth = 500;
  }
  canvasHeight = drawHeight + controlHeight;
  panelWidth = (canvasWidth - panelGap - 2 * margin) / 2;
}
