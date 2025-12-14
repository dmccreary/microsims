// Profit Maximum MicroSim
// Two-panel display showing demand curve with profit rectangle and overlaid revenue/profit curves
// Demonstrates that profit-maximizing price differs from revenue-maximizing price

// Canvas dimensions - responsive width
let canvasWidth = 800;
let drawHeight = 400;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let margin = 30;
let sliderLeftMargin = 140;

// Panel dimensions (calculated in updateCanvasSize)
let panelWidth;
let panelGap = 20;

// Sliders and controls
let priceSlider;
let marginalCostSlider;
let showRevenueCheckbox;

// Economic parameters
let maxPrice = 200;
let maxQuantity = 200;
let price = 100;
let marginalCost = 30;

// Calculated values
let quantity = 0;
let revenue = 0;
let totalCost = 0;
let profit = 0;
let maxRevenue = 10000;
let revenueMaxPrice = 100;
let profitMaxPrice = 115;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    var mainElement = document.querySelector('main');
    canvas.parent(mainElement);

    textSize(16);

    // Create price slider
    priceSlider = createSlider(0, maxPrice, price);
    priceSlider.position(sliderLeftMargin, drawHeight + 12);
    priceSlider.size(canvasWidth - sliderLeftMargin - 20);

    // Create marginal cost slider
    marginalCostSlider = createSlider(0, 80, marginalCost);
    marginalCostSlider.position(sliderLeftMargin, drawHeight + 42);
    marginalCostSlider.size(canvasWidth - sliderLeftMargin - 20);

    // Create checkbox for showing revenue curve
    showRevenueCheckbox = createCheckbox(' Show Revenue Curve', true);
    showRevenueCheckbox.position(10, drawHeight + 65);
    showRevenueCheckbox.style('font-size', '14px');

    // Demand function: Q = maxQuantity - P
    describe('Two-panel profit maximization display showing demand curve with profit rectangle and overlaid revenue/profit curves', LABEL);
}

function draw() {
    // Update values from sliders
    price = priceSlider.value();
    marginalCost = marginalCostSlider.value();

    // Calculate economic values
    quantity = maxQuantity - price;
    revenue = price * quantity;
    totalCost = marginalCost * quantity;
    profit = revenue - totalCost;

    // Calculate optimal prices
    revenueMaxPrice = maxPrice / 2; // Always 100
    profitMaxPrice = (maxPrice + marginalCost) / 2; // 100 + MC/2

    // Calculate panel width
    panelWidth = (canvasWidth - panelGap - 2 * margin) / 2;

    // Draw backgrounds
    stroke('silver');
    strokeWeight(1);
    fill('aliceblue');
    rect(0, 0, canvasWidth, drawHeight);
    fill('white');
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Draw left panel (Demand Curve with Profit Rectangle)
    drawDemandPanel();

    // Draw right panel (Revenue and Profit Curves)
    drawCurvesPanel();

    // Draw control area labels
    noStroke();
    fill(0);
    textSize(14);
    textAlign(LEFT, CENTER);
    text('Price: $' + price, 10, drawHeight + 24);
    text('Marginal Cost: $' + marginalCost, 10, drawHeight + 54);
}

function drawDemandPanel() {
    let leftMargin = margin;
    let rightEdge = margin + panelWidth;
    let plotHeight = drawHeight - 2 * margin;

    // Draw axes
    stroke(0);
    strokeWeight(1);
    line(leftMargin, margin, leftMargin, drawHeight - margin);
    line(leftMargin, drawHeight - margin, rightEdge, drawHeight - margin);

    // Axis labels
    noStroke();
    fill('black');
    textSize(14);
    textAlign(LEFT, TOP);
    text('Price', leftMargin - 5, margin - 20);
    textAlign(RIGHT, TOP);
    text('Quantity', rightEdge, drawHeight - margin + 5);

    // Title
    textSize(16);
    textAlign(CENTER, TOP);
    text('Demand Curve', leftMargin + panelWidth / 2, 5);

    // Draw the demand curve (diagonal line)
    stroke(100, 100, 100);
    strokeWeight(2);
    line(leftMargin, margin, rightEdge, drawHeight - margin);

    // Calculate point position
    let x = map(quantity, 0, maxQuantity, leftMargin, rightEdge);
    let y = map(price, 0, maxPrice, drawHeight - margin, margin);
    let mcY = map(marginalCost, 0, maxPrice, drawHeight - margin, margin);

    // Draw marginal cost line (horizontal dashed)
    stroke(200, 100, 0);
    strokeWeight(1);
    drawingContext.setLineDash([5, 5]);
    line(leftMargin, mcY, rightEdge, mcY);
    drawingContext.setLineDash([]);

    // Label for MC line
    noStroke();
    fill(200, 100, 0);
    textSize(12);
    textAlign(LEFT, CENTER);
    text('MC=$' + marginalCost, rightEdge - 55, mcY - 10);

    // Draw profit/loss rectangle
    // Height is from MC to Price, Width is from 0 to Quantity
    if (price > marginalCost && quantity > 0) {
        // Profit - green
        fill(0, 180, 0, 80);
        stroke(0, 150, 0);
        strokeWeight(1);
        rect(leftMargin, y, x - leftMargin, mcY - y);
    } else if (price < marginalCost && quantity > 0) {
        // Loss - red
        fill(220, 0, 0, 80);
        stroke(180, 0, 0);
        strokeWeight(1);
        rect(leftMargin, mcY, x - leftMargin, y - mcY);
    }

    // Draw guide lines
    stroke('silver');
    strokeWeight(1);
    line(leftMargin, y, x, y);
    line(x, y, x, drawHeight - margin);

    // Draw current point on demand curve
    fill(0, 0, 200);
    noStroke();
    circle(x, y, 12);

    // Draw points on axes
    fill(0);
    circle(leftMargin, y, 8);
    circle(x, drawHeight - margin, 8);

    // Show profit value
    textSize(14);
    textAlign(CENTER, TOP);
    if (profit >= 0) {
        fill(0, 150, 0);
        text('Profit = $' + profit, leftMargin + panelWidth / 2, margin + 25);
    } else {
        fill(200, 0, 0);
        text('Loss = $' + Math.abs(profit), leftMargin + panelWidth / 2, margin + 25);
    }
}

function drawCurvesPanel() {
    let leftMargin = margin + panelWidth + panelGap;
    let rightEdge = leftMargin + panelWidth;
    let plotHeight = drawHeight - 2 * margin;

    // Draw axes
    stroke(0);
    strokeWeight(1);
    line(leftMargin, margin, leftMargin, drawHeight - margin);
    line(leftMargin, drawHeight - margin, rightEdge, drawHeight - margin);

    // Axis labels
    noStroke();
    fill('black');
    textSize(14);
    textAlign(LEFT, TOP);
    text('$', leftMargin - 15, margin - 20);
    textAlign(RIGHT, TOP);
    text('Price', rightEdge, drawHeight - margin + 5);

    // Title
    textSize(16);
    textAlign(CENTER, TOP);
    text('Revenue vs Profit', leftMargin + panelWidth / 2, 5);

    // Scale factor for curves
    let maxValue = maxRevenue * 1.1;

    // Calculate min and max profit for current MC
    // Min profit occurs at price=0: (0 - MC) * maxQuantity = -MC * 200
    let minProfitValue = -marginalCost * maxQuantity;
    // Max profit occurs at profitMaxPrice
    let maxProfitValue = (profitMaxPrice - marginalCost) * (maxQuantity - profitMaxPrice);

    // Use same top scale as revenue (maxValue) so curves align when MC=0
    // Extend bottom to accommodate negative profits
    let profitMin = Math.min(minProfitValue, 0);
    let profitMax = maxValue;  // Same as revenue scale top

    // Draw revenue curve (blue) if checkbox is checked
    if (showRevenueCheckbox.checked()) {
        stroke(0, 100, 255);
        strokeWeight(2);
        noFill();
        beginShape();
        for (let p = 0; p <= maxPrice; p += 2) {
            let rev = p * (maxQuantity - p);
            let px = map(p, 0, maxPrice, leftMargin, rightEdge);
            let py = map(rev, 0, maxValue, drawHeight - margin, margin);
            vertex(px, py);
        }
        endShape();

        // Draw vertical line at revenue max
        stroke(0, 100, 255, 150);
        strokeWeight(1);
        drawingContext.setLineDash([3, 3]);
        let revMaxX = map(revenueMaxPrice, 0, maxPrice, leftMargin, rightEdge);
        let revMaxY = map(maxRevenue, 0, maxValue, drawHeight - margin, margin);
        line(revMaxX, revMaxY, revMaxX, drawHeight - margin);
        drawingContext.setLineDash([]);

        // Labels - move as a group
        push();
        translate(0, -40)
            noStroke();
            fill(0, 100, 255);
            textSize(11);
            textAlign(CENTER, TOP);
            text('Rev Max', revMaxX, drawHeight - margin + 5);
            text('P=$' + revenueMaxPrice, revMaxX, drawHeight - margin + 17);
        pop();
    }

    // Draw profit curve (green)
    stroke(0, 150, 0);
    strokeWeight(3);
    noFill();
    beginShape();
    for (let p = 0; p <= maxPrice; p += 2) {
        let q = maxQuantity - p;
        let prof = (p - marginalCost) * q;
        let px = map(p, 0, maxPrice, leftMargin, rightEdge);
        let py = map(prof, profitMin, profitMax, drawHeight - margin, margin);
        vertex(px, py);
    }
    endShape();

    // Draw vertical line at profit max
    stroke(0, 150, 0, 150);
    strokeWeight(2);
    drawingContext.setLineDash([3, 3]);
    let profMaxX = map(profitMaxPrice, 0, maxPrice, leftMargin, rightEdge);
    let profMaxY = map(maxProfitValue, profitMin, profitMax, drawHeight - margin, margin);
    line(profMaxX, profMaxY, profMaxX, drawHeight - margin);
    drawingContext.setLineDash([]);

    // Label for profit max
    noStroke();
    fill(0, 150, 0);
    textSize(11);
    textAlign(CENTER, TOP);
    text('Profit Max', profMaxX, drawHeight - margin + 5);
    text('P=$' + Math.round(profitMaxPrice), profMaxX, drawHeight - margin + 17);

    // Draw zero line
    stroke(150);
    strokeWeight(1);
    let zeroY = map(0, profitMin, profitMax, drawHeight - margin, margin);
    line(leftMargin, zeroY, rightEdge, zeroY);

    // Draw current position on profit curve
    let currentX = map(price, 0, maxPrice, leftMargin, rightEdge);
    let currentY = map(profit, profitMin, profitMax, drawHeight - margin, margin);

    // Current point
    fill(0, 150, 0);
    noStroke();
    circle(currentX, currentY, 14);

    // Draw current point on revenue curve if visible
    if (showRevenueCheckbox.checked()) {
        let revY = map(revenue, 0, maxValue, drawHeight - margin, margin);
        fill(0, 100, 255);
        circle(currentX, revY, 10);
    }

    // Legend
    textSize(12);
    textAlign(LEFT, CENTER);
    push();
       translate(0, -30);
    if (showRevenueCheckbox.checked()) {
        fill(0, 100, 255);
        text('Revenue = $' + revenue, leftMargin + 10, margin + 30);
    }

    if (profit >= 0) {
        fill(0, 150, 0);
        text('Profit = $' + profit, leftMargin + 10, margin + 48);
    } else {
        fill(200, 0, 0);
        text('Loss = $' + Math.abs(profit), leftMargin + 10, margin + 48);
    }

    // Show the key insight
    textSize(11);
    fill(100);
    textAlign(RIGHT, TOP);
    let gap = Math.round(profitMaxPrice - revenueMaxPrice);
    if (gap > 0) {
        text('Profit max is $' + gap + ' higher than revenue max', rightEdge - 5, margin + 40);
    }
    pop();
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);

    // Update slider positions and sizes
    priceSlider.position(sliderLeftMargin, drawHeight + 12);
    priceSlider.size(canvasWidth - sliderLeftMargin - 20);
    marginalCostSlider.position(sliderLeftMargin, drawHeight + 42);
    marginalCostSlider.size(canvasWidth - sliderLeftMargin - 20);

    redraw();
}

function updateCanvasSize() {
    let container = document.querySelector('main');
    if (container) {
        canvasWidth = container.offsetWidth;
    }
    if (canvasWidth < 500) {
        canvasWidth = 500;
    }
    canvasHeight = drawHeight + controlHeight;
    panelWidth = (canvasWidth - panelGap - 2 * margin) / 2;
}
