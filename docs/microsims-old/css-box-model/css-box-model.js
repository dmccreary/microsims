// CSS Box Model Interactive MicroSim
// Helps learners understand how margin, border, padding, and content interact

// Canvas dimensions
let canvasWidth = 550;
let drawHeight = 380;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 120;
let defaultTextSize = 16;

// Sliders
let marginSlider, borderSlider, paddingSlider, contentSlider;

// Default values
let boxMargin = 20;
let boxBorder = 3;
let boxPadding = 15;
let contentWidth = 120;

// Colors matching DevTools
const marginColor = '#FFCC80';      // Orange
const borderColor = '#333333';       // Dark gray
const paddingColor = '#C8E6C9';      // Light green
const contentColor = '#BBDEFB';      // Light blue

// Hover state
let hoveredLayer = null;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  // Create sliders
  let sliderY = drawHeight + 15;
  let sliderSpacing = 25;

  marginSlider = createSlider(0, 50, 20, 1);
  marginSlider.style('width', (canvasWidth - sliderLeftMargin - margin) + 'px');

  borderSlider = createSlider(0, 20, 3, 1);
  borderSlider.style('width', (canvasWidth - sliderLeftMargin - margin) + 'px');

  paddingSlider = createSlider(0, 50, 15, 1);
  paddingSlider.style('width', (canvasWidth - sliderLeftMargin - margin) + 'px');

  contentSlider = createSlider(50, 200, 120, 1);
  contentSlider.style('width', (canvasWidth - sliderLeftMargin - margin) + 'px');

  // Position sliders below canvas
  repositionSliders();

  describe('Interactive CSS Box Model visualization showing how margin, border, padding, and content determine element size', LABEL);
}

function draw() {
  updateCanvasSize();

  // Get current values
  boxMargin = marginSlider.value();
  boxBorder = borderSlider.value();
  boxPadding = paddingSlider.value();
  contentWidth = contentSlider.value();

  // Calculate total width
  let totalWidth = contentWidth + (boxPadding * 2) + (boxBorder * 2) + (boxMargin * 2);

  // Drawing area
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area
  fill('white');
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  textSize(24);
  textAlign(CENTER, TOP);
  noStroke();
  text('CSS Box Model', canvasWidth / 2, 10);

  // Calculate box positions (centered in drawing area)
  let centerX = canvasWidth / 2;
  let centerY = drawHeight / 2 + 20;

  // Determine hovered layer
  hoveredLayer = getHoveredLayer(centerX, centerY);

  // Draw the box model layers (from outside in)
  drawBoxModel(centerX, centerY);

  // Draw dimension labels
  drawDimensionLabels(centerX, centerY);

  // Draw legend
  drawLegend();

  // Draw total width calculation
  drawCalculation(totalWidth);

  // Draw control labels
  drawControlLabels();

  // Draw tooltip if hovering
  if (hoveredLayer) {
    drawTooltip();
  }
}

function drawBoxModel(cx, cy) {
  let halfContent = contentWidth / 2;
  let halfPadding = halfContent + boxPadding;
  let halfBorder = halfPadding + boxBorder;
  let halfMargin = halfBorder + boxMargin;

  // Use same proportions for height (square-ish content)
  let contentHeight = contentWidth * 0.6;
  let halfContentH = contentHeight / 2;
  let halfPaddingH = halfContentH + boxPadding;
  let halfBorderH = halfPaddingH + boxBorder;
  let halfMarginH = halfBorderH + boxMargin;

  // Margin area (dashed orange outline)
  stroke(marginColor);
  strokeWeight(2);
  drawingContext.setLineDash([5, 5]);
  noFill();
  if (hoveredLayer === 'margin') {
    fill(255, 204, 128, 100);
  }
  rect(cx - halfMargin, cy - halfMarginH, halfMargin * 2, halfMarginH * 2);
  drawingContext.setLineDash([]);

  // Border area (solid dark gray)
  stroke(borderColor);
  strokeWeight(boxBorder > 0 ? boxBorder : 1);
  if (hoveredLayer === 'border') {
    fill(51, 51, 51, 150);
  } else {
    fill(borderColor);
  }
  rect(cx - halfBorder, cy - halfBorderH, halfBorder * 2, halfBorderH * 2);

  // Padding area (light green)
  noStroke();
  if (hoveredLayer === 'padding') {
    fill(200, 230, 201, 255);
  } else {
    fill(paddingColor);
  }
  rect(cx - halfPadding, cy - halfPaddingH, halfPadding * 2, halfPaddingH * 2);

  // Content area (light blue)
  if (hoveredLayer === 'content') {
    fill(187, 222, 251, 255);
    stroke('#1976D2');
    strokeWeight(2);
  } else {
    fill(contentColor);
    noStroke();
  }
  rect(cx - halfContent, cy - halfContentH, contentWidth, contentHeight);

  // Content label
  fill('#1565C0');
  textSize(14);
  textAlign(CENTER, CENTER);
  noStroke();
  text('Content', cx, cy);
  text(contentWidth + ' × ' + int(contentHeight), cx, cy + 18);
}

function drawDimensionLabels(cx, cy) {
  let halfContent = contentWidth / 2;
  let contentHeight = contentWidth * 0.6;
  let halfContentH = contentHeight / 2;

  textSize(12);
  textAlign(CENTER, CENTER);
  fill('#333');
  noStroke();

  // Margin label (top)
  if (boxMargin > 0) {
    let marginY = cy - halfContentH - boxPadding - boxBorder - boxMargin / 2;
    fill('#E65100');
    text(boxMargin + 'px', cx, marginY);
  }

  // Border label (show on right side)
  if (boxBorder > 0) {
    let borderX = cx + halfContent + boxPadding + boxBorder / 2;
    push();
    translate(borderX, cy);
    rotate(HALF_PI);
    fill('#333');
    text(boxBorder + 'px', 0, 0);
    pop();
  }

  // Padding label (show on left side)
  if (boxPadding > 0) {
    let paddingX = cx - halfContent - boxPadding / 2;
    fill('#2E7D32');
    text(boxPadding + 'px', paddingX, cy);
  }
}

function drawLegend() {
  let legendX = 15;
  let legendY = 50;
  let boxSize = 16;
  let spacing = 22;

  textSize(12);
  textAlign(LEFT, CENTER);

  // Legend background
  fill(255, 255, 255, 230);
  stroke(200);
  strokeWeight(1);
  rect(legendX - 5, legendY - 10, 95, spacing * 4 + 10, 5);

  // Margin
  noStroke();
  fill(marginColor);
  rect(legendX, legendY, boxSize, boxSize);
  fill('#333');
  text('Margin', legendX + boxSize + 8, legendY + boxSize / 2);

  // Border
  fill(borderColor);
  rect(legendX, legendY + spacing, boxSize, boxSize);
  fill('#333');
  text('Border', legendX + boxSize + 8, legendY + spacing + boxSize / 2);

  // Padding
  fill(paddingColor);
  rect(legendX, legendY + spacing * 2, boxSize, boxSize);
  fill('#333');
  text('Padding', legendX + boxSize + 8, legendY + spacing * 2 + boxSize / 2);

  // Content
  fill(contentColor);
  rect(legendX, legendY + spacing * 3, boxSize, boxSize);
  fill('#333');
  text('Content', legendX + boxSize + 8, legendY + spacing * 3 + boxSize / 2);
}

function drawCalculation(totalWidth) {
  let calcY = drawHeight - 35;

  // Background
  fill(255, 255, 255, 240);
  stroke(200);
  strokeWeight(1);
  rect(canvasWidth / 2 - 220, calcY - 15, 440, 45, 5);

  // Formula
  textSize(13);
  textAlign(CENTER, TOP);
  noStroke();
  fill('#333');
  text('Total Width = content + (padding × 2) + (border × 2) + (margin × 2)', canvasWidth / 2, calcY - 10);

  // Values
  textSize(14);
  fill('#1565C0');
  let formula = contentWidth + ' + (' + boxPadding + ' × 2) + (' + boxBorder + ' × 2) + (' + boxMargin + ' × 2) = ';
  text(formula + totalWidth + 'px', canvasWidth / 2, calcY + 10);
}

function drawControlLabels() {
  textSize(14);
  textAlign(LEFT, CENTER);
  fill('#333');
  noStroke();

  let labelX = 10;
  let sliderY = drawHeight + 15;
  let sliderSpacing = 25;

  // Margin
  fill('#E65100');
  text('Margin: ' + boxMargin + 'px', labelX, sliderY + 8);

  // Border
  fill('#333');
  text('Border: ' + boxBorder + 'px', labelX, sliderY + sliderSpacing + 8);

  // Padding
  fill('#2E7D32');
  text('Padding: ' + boxPadding + 'px', labelX, sliderY + sliderSpacing * 2 + 8);

  // Content
  fill('#1565C0');
  text('Content: ' + contentWidth + 'px', labelX, sliderY + sliderSpacing * 3 + 8);
}

function getHoveredLayer(cx, cy) {
  let halfContent = contentWidth / 2;
  let contentHeight = contentWidth * 0.6;
  let halfContentH = contentHeight / 2;
  let halfPadding = halfContent + boxPadding;
  let halfPaddingH = halfContentH + boxPadding;
  let halfBorder = halfPadding + boxBorder;
  let halfBorderH = halfPaddingH + boxBorder;
  let halfMargin = halfBorder + boxMargin;
  let halfMarginH = halfBorderH + boxMargin;

  // Check from inside out
  if (mouseX >= cx - halfContent && mouseX <= cx + halfContent &&
      mouseY >= cy - halfContentH && mouseY <= cy + halfContentH) {
    return 'content';
  }
  if (mouseX >= cx - halfPadding && mouseX <= cx + halfPadding &&
      mouseY >= cy - halfPaddingH && mouseY <= cy + halfPaddingH) {
    return 'padding';
  }
  if (mouseX >= cx - halfBorder && mouseX <= cx + halfBorder &&
      mouseY >= cy - halfBorderH && mouseY <= cy + halfBorderH) {
    return 'border';
  }
  if (mouseX >= cx - halfMargin && mouseX <= cx + halfMargin &&
      mouseY >= cy - halfMarginH && mouseY <= cy + halfMarginH) {
    return 'margin';
  }
  return null;
}

function drawTooltip() {
  let tooltipText = '';
  let tooltipColor = '#333';

  switch(hoveredLayer) {
    case 'margin':
      tooltipText = 'margin: ' + boxMargin + 'px';
      tooltipColor = '#E65100';
      break;
    case 'border':
      tooltipText = 'border-width: ' + boxBorder + 'px';
      tooltipColor = '#333';
      break;
    case 'padding':
      tooltipText = 'padding: ' + boxPadding + 'px';
      tooltipColor = '#2E7D32';
      break;
    case 'content':
      tooltipText = 'width: ' + contentWidth + 'px';
      tooltipColor = '#1565C0';
      break;
  }

  if (tooltipText && mouseY < drawHeight) {
    let tw = textWidth(tooltipText) + 16;
    let tx = constrain(mouseX + 15, 0, canvasWidth - tw);
    let ty = constrain(mouseY - 25, 0, drawHeight - 25);

    fill(50, 50, 50, 230);
    noStroke();
    rect(tx, ty, tw, 22, 4);

    fill(255);
    textSize(12);
    textAlign(LEFT, CENTER);
    text(tooltipText, tx + 8, ty + 11);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  repositionSliders();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;

    // Resize sliders
    if (typeof marginSlider !== 'undefined') {
      let sliderWidth = canvasWidth - sliderLeftMargin - margin;
      marginSlider.style('width', sliderWidth + 'px');
      borderSlider.style('width', sliderWidth + 'px');
      paddingSlider.style('width', sliderWidth + 'px');
      contentSlider.style('width', sliderWidth + 'px');
    }
  }
}

function repositionSliders() {
  // Get the canvas position
  const canvas = document.querySelector('main canvas');
  if (!canvas) return;

  const canvasRect = canvas.getBoundingClientRect();
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

  let sliderY = canvasRect.top + scrollTop + drawHeight + 15;
  let sliderX = canvasRect.left + scrollLeft + sliderLeftMargin;
  let sliderSpacing = 25;

  marginSlider.position(sliderX, sliderY);
  borderSlider.position(sliderX, sliderY + sliderSpacing);
  paddingSlider.position(sliderX, sliderY + sliderSpacing * 2);
  contentSlider.position(sliderX, sliderY + sliderSpacing * 3);
}
