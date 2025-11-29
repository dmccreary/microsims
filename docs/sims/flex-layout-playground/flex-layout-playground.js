// Flex Layout Playground MicroSim
// Allows learners to experiment with flexbox properties and see immediate visual results

// Canvas dimensions
let canvasWidth = 550;
let drawHeight = 350;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let sliderLeftMargin = 80;
let defaultTextSize = 14;

// Flex container properties
let flexDirection = 'row';
let justifyContent = 'flex-start';
let alignItems = 'stretch';
let flexWrap = 'nowrap';
let gap = 10;

// Flex items
let items = [];
let numItems = 6;
let itemColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB347', '#87CEEB', '#98D8C8', '#F7DC6F'];

// UI elements
let directionSelect, justifySelect, alignSelect, wrapCheckbox, gapSlider;
let addButton, removeButton, copyButton;

// Animation
let targetPositions = [];
let currentPositions = [];
let animationSpeed = 0.15;

// Container dimensions
let containerX, containerY, containerW, containerH;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Initialize items with different sizes
  initializeItems();

  // Create UI controls
  createControls();

  describe('Interactive flexbox playground showing a container with colored boxes that respond to flexbox property changes', LABEL);
}

function initializeItems() {
  items = [];
  for (let i = 0; i < numItems; i++) {
    items.push({
      width: random(40, 80),
      height: random(40, 80),
      color: itemColors[i % itemColors.length],
      label: (i + 1).toString()
    });
  }
  calculatePositions();
}

function createControls() {
  let controlY = drawHeight + 10;
  let col1X = 10;
  let col2X = 200;
  let col3X = 370;

  // Column 1: Direction and Justify
  // Direction dropdown
  directionSelect = createSelect();
  directionSelect.position(col1X + 55, controlY);
  directionSelect.option('row');
  directionSelect.option('row-reverse');
  directionSelect.option('column');
  directionSelect.option('column-reverse');
  directionSelect.selected('row');
  directionSelect.changed(() => {
    flexDirection = directionSelect.value();
    calculatePositions();
  });
  directionSelect.style('font-size', '12px');

  // Justify dropdown
  justifySelect = createSelect();
  justifySelect.position(col1X + 55, controlY + 28);
  justifySelect.option('flex-start');
  justifySelect.option('flex-end');
  justifySelect.option('center');
  justifySelect.option('space-between');
  justifySelect.option('space-around');
  justifySelect.option('space-evenly');
  justifySelect.selected('flex-start');
  justifySelect.changed(() => {
    justifyContent = justifySelect.value();
    calculatePositions();
  });
  justifySelect.style('font-size', '12px');

  // Column 2: Align and Wrap
  // Align dropdown
  alignSelect = createSelect();
  alignSelect.position(col2X + 40, controlY);
  alignSelect.option('flex-start');
  alignSelect.option('flex-end');
  alignSelect.option('center');
  alignSelect.option('stretch');
  alignSelect.option('baseline');
  alignSelect.selected('stretch');
  alignSelect.changed(() => {
    alignItems = alignSelect.value();
    calculatePositions();
  });
  alignSelect.style('font-size', '12px');

  // Wrap checkbox
  wrapCheckbox = createCheckbox(' wrap', false);
  wrapCheckbox.position(col2X + 40, controlY + 28);
  wrapCheckbox.changed(() => {
    flexWrap = wrapCheckbox.checked() ? 'wrap' : 'nowrap';
    calculatePositions();
  });
  wrapCheckbox.style('font-size', '12px');

  // Gap slider
  gapSlider = createSlider(0, 50, 10, 1);
  gapSlider.position(sliderLeftMargin, controlY + 56);
  gapSlider.size(250);
  gapSlider.input(() => {
    gap = gapSlider.value();
    calculatePositions();
  });

  // Column 3: Buttons
  addButton = createButton('+ Add Item');
  addButton.position(col3X, controlY);
  addButton.mousePressed(addItem);
  addButton.style('font-size', '12px');
  addButton.style('padding', '4px 8px');

  removeButton = createButton('- Remove');
  removeButton.position(col3X, controlY + 30);
  removeButton.mousePressed(removeFlexItem);
  removeButton.style('font-size', '12px');
  removeButton.style('padding', '4px 8px');

  copyButton = createButton('Copy CSS');
  copyButton.position(col3X, controlY + 60);
  copyButton.mousePressed(copyCSS);
  copyButton.style('font-size', '12px');
  copyButton.style('padding', '4px 8px');
}

function addItem() {
  if (items.length < 20) {
    items.push({
      width: random(40, 80),
      height: random(40, 80),
      color: itemColors[items.length % itemColors.length],
      label: (items.length + 1).toString()
    });
    calculatePositions();
  }
}

function removeFlexItem() {
  if (items.length > 1) {
    items.pop();
    targetPositions.pop();
    currentPositions.pop();
    calculatePositions();
  }
}

function copyCSS() {
  let css = generateCSS();
  navigator.clipboard.writeText(css).then(() => {
    // Visual feedback
    copyButton.html('Copied!');
    setTimeout(() => copyButton.html('Copy CSS'), 1500);
  });
}

function generateCSS() {
  return `.container {
  display: flex;
  flex-direction: ${flexDirection};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  flex-wrap: ${flexWrap};
  gap: ${gap}px;
}`;
}

function calculatePositions() {
  targetPositions = [];

  // Container bounds
  containerX = margin + 10;
  containerY = 40;
  containerW = canvasWidth - margin * 2 - 20;
  containerH = drawHeight - 60;

  let isRow = flexDirection === 'row' || flexDirection === 'row-reverse';
  let isReverse = flexDirection === 'row-reverse' || flexDirection === 'column-reverse';

  let mainAxisSize = isRow ? containerW : containerH;
  let crossAxisSize = isRow ? containerH : containerW;

  // Group items into lines (for wrap support)
  let lines = [];
  let currentLine = [];
  let currentLineSize = 0;

  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let itemMainSize = isRow ? item.width : item.height;

    // Check if item fits on current line
    let sizeWithGap = currentLine.length > 0 ? itemMainSize + gap : itemMainSize;

    if (flexWrap === 'wrap' && currentLineSize + sizeWithGap > mainAxisSize && currentLine.length > 0) {
      // Start new line
      lines.push(currentLine);
      currentLine = [{ item: item, index: i }];
      currentLineSize = itemMainSize;
    } else {
      currentLine.push({ item: item, index: i });
      currentLineSize += sizeWithGap;
    }
  }
  // Push last line
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  // Calculate line heights for cross-axis positioning
  let lineHeights = [];
  for (let line of lines) {
    let maxCross = 0;
    for (let entry of line) {
      let itemCrossSize = isRow ? entry.item.height : entry.item.width;
      maxCross = max(maxCross, itemCrossSize);
    }
    lineHeights.push(maxCross);
  }

  let totalCrossSize = lineHeights.reduce((a, b) => a + b, 0) + gap * (lines.length - 1);

  // Position items line by line
  let crossOffset = 0;

  // For single line with stretch, use full cross axis
  if (lines.length === 1 && alignItems === 'stretch') {
    crossOffset = 0;
  }

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    let line = lines[lineIdx];
    let lineHeight = lineHeights[lineIdx];

    // Calculate total main size for this line
    let lineTotalMainSize = 0;
    for (let entry of line) {
      lineTotalMainSize += isRow ? entry.item.width : entry.item.height;
    }
    lineTotalMainSize += gap * (line.length - 1);

    // Get main axis positions for this line
    let mainPositions = calculateMainAxisPositionsForLine(line, lineTotalMainSize, mainAxisSize, isRow);

    // Position each item in the line
    for (let i = 0; i < line.length; i++) {
      let entry = line[i];
      let item = entry.item;
      let idx = entry.index;

      let itemCrossSize = isRow ? item.height : item.width;

      // Handle stretch - stretch to line height (or full height if single line)
      let displayCrossSize = itemCrossSize;
      let lineCrossSize = lines.length === 1 ? crossAxisSize : lineHeight;
      if (alignItems === 'stretch') {
        displayCrossSize = lineCrossSize;
      }

      // Calculate cross position within line
      let crossPosInLine = calculateCrossAxisPositionInLine(itemCrossSize, displayCrossSize, lineCrossSize);

      // Apply reverse if needed
      let mainIdx = isReverse ? line.length - 1 - i : i;
      let mainPos = mainPositions[mainIdx];

      let pos;
      if (isRow) {
        pos = {
          x: containerX + mainPos,
          y: containerY + crossOffset + crossPosInLine,
          w: item.width,
          h: displayCrossSize
        };
      } else {
        pos = {
          x: containerX + crossOffset + crossPosInLine,
          y: containerY + mainPos,
          w: displayCrossSize,
          h: item.height
        };
      }

      targetPositions[idx] = pos;
    }

    crossOffset += lineHeight + gap;
  }

  // Initialize current positions if needed
  if (currentPositions.length !== targetPositions.length) {
    currentPositions = JSON.parse(JSON.stringify(targetPositions));
  }
}

function calculateMainAxisPositionsForLine(line, totalSize, axisSize, isRow) {
  let positions = [];
  let count = line.length;

  // Calculate available space
  let availableSpace = axisSize - totalSize;

  let currentPos = 0;

  switch (justifyContent) {
    case 'flex-start':
      currentPos = 0;
      break;
    case 'flex-end':
      currentPos = availableSpace;
      break;
    case 'center':
      currentPos = availableSpace / 2;
      break;
    case 'space-between':
      currentPos = 0;
      break;
    case 'space-around':
      currentPos = count > 0 ? availableSpace / (count * 2) : 0;
      break;
    case 'space-evenly':
      currentPos = count > 0 ? availableSpace / (count + 1) : 0;
      break;
  }

  for (let i = 0; i < count; i++) {
    positions.push(currentPos);

    let itemSize = isRow ? line[i].item.width : line[i].item.height;

    switch (justifyContent) {
      case 'flex-start':
      case 'flex-end':
      case 'center':
        currentPos += itemSize + gap;
        break;
      case 'space-between':
        if (count > 1) {
          currentPos += itemSize + availableSpace / (count - 1);
        } else {
          currentPos += itemSize;
        }
        break;
      case 'space-around':
        currentPos += itemSize + availableSpace / count;
        break;
      case 'space-evenly':
        currentPos += itemSize + availableSpace / (count + 1);
        break;
    }
  }

  return positions;
}

function calculateCrossAxisPositionInLine(itemSize, displaySize, lineSize) {
  switch (alignItems) {
    case 'flex-start':
      return 0;
    case 'flex-end':
      return lineSize - itemSize;
    case 'center':
    case 'baseline':
      return (lineSize - itemSize) / 2;
    case 'stretch':
      return 0;
    default:
      return 0;
  }
}

function draw() {
  updateCanvasSize();

  // Drawing area
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textSize(20);
  textAlign(CENTER, TOP);
  text('Flex Layout Playground', canvasWidth / 2, 8);

  // Draw flex container
  drawFlexContainer();

  // Animate items
  animateItems();

  // Draw items
  drawItems();

  // Draw CSS panel
  drawCSSPanel();

  // Draw control labels
  drawControlLabels();
}

function drawFlexContainer() {
  // Container background
  fill(255, 255, 255, 200);
  stroke('#666');
  strokeWeight(2);
  rect(containerX, containerY, containerW, containerH, 5);

  // Container label
  fill('#666');
  noStroke();
  textSize(10);
  textAlign(LEFT, TOP);
  text('.container', containerX + 5, containerY + 3);

  // Draw direction arrow
  drawDirectionIndicator();
}

function drawDirectionIndicator() {
  let arrowX, arrowY, angle;
  let arrowLen = 30;

  switch (flexDirection) {
    case 'row':
      arrowX = containerX + containerW / 2 - arrowLen / 2;
      arrowY = containerY + containerH - 15;
      angle = 0;
      break;
    case 'row-reverse':
      arrowX = containerX + containerW / 2 + arrowLen / 2;
      arrowY = containerY + containerH - 15;
      angle = PI;
      break;
    case 'column':
      arrowX = containerX + containerW - 15;
      arrowY = containerY + containerH / 2 - arrowLen / 2;
      angle = HALF_PI;
      break;
    case 'column-reverse':
      arrowX = containerX + containerW - 15;
      arrowY = containerY + containerH / 2 + arrowLen / 2;
      angle = -HALF_PI;
      break;
  }

  push();
  translate(arrowX, arrowY);
  rotate(angle);
  stroke('#999');
  strokeWeight(2);
  line(0, 0, arrowLen, 0);
  fill('#999');
  noStroke();
  triangle(arrowLen, 0, arrowLen - 8, -4, arrowLen - 8, 4);
  pop();
}

function animateItems() {
  for (let i = 0; i < currentPositions.length; i++) {
    if (targetPositions[i]) {
      currentPositions[i].x = lerp(currentPositions[i].x, targetPositions[i].x, animationSpeed);
      currentPositions[i].y = lerp(currentPositions[i].y, targetPositions[i].y, animationSpeed);
      currentPositions[i].w = lerp(currentPositions[i].w, targetPositions[i].w, animationSpeed);
      currentPositions[i].h = lerp(currentPositions[i].h, targetPositions[i].h, animationSpeed);
    }
  }
}

function drawItems() {
  for (let i = 0; i < items.length; i++) {
    let pos = currentPositions[i];
    if (!pos) continue;

    // Item shadow
    fill(0, 0, 0, 30);
    noStroke();
    rect(pos.x + 3, pos.y + 3, pos.w, pos.h, 5);

    // Item box
    fill(items[i].color);
    stroke('#333');
    strokeWeight(1);
    rect(pos.x, pos.y, pos.w, pos.h, 5);

    // Item label
    fill('white');
    stroke('#333');
    strokeWeight(2);
    textSize(18);
    textAlign(CENTER, CENTER);
    text(items[i].label, pos.x + pos.w / 2, pos.y + pos.h / 2);
    noStroke();
  }
}

function drawCSSPanel() {
  // CSS panel background - positioned in lower right of control area
  let panelW = 170;
  let panelH = 110;
  let panelX = canvasWidth - panelW - 10;
  let panelY = drawHeight + 5;

  fill(40, 44, 52, 240);
  stroke('#666');
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 5);

  // CSS title
  fill('#98C379');
  noStroke();
  textSize(10);
  textAlign(LEFT, TOP);
  text('.container {', panelX + 8, panelY + 8);

  // CSS properties
  fill('#ABB2BF');
  textSize(9);
  let lineY = panelY + 22;
  let lineHeight = 12;

  fill('#E06C75');
  text('  display', panelX + 8, lineY);
  fill('#ABB2BF');
  text(': ', panelX + 55, lineY);
  fill('#E5C07B');
  text('flex;', panelX + 60, lineY);

  lineY += lineHeight;
  fill('#E06C75');
  text('  flex-direction', panelX + 8, lineY);
  fill('#ABB2BF');
  text(': ', panelX + 85, lineY);
  fill('#98C379');
  text(flexDirection + ';', panelX + 90, lineY);

  lineY += lineHeight;
  fill('#E06C75');
  text('  justify-content', panelX + 8, lineY);
  fill('#ABB2BF');
  text(': ', panelX + 90, lineY);
  fill('#98C379');
  text(justifyContent + ';', panelX + 95, lineY);

  lineY += lineHeight;
  fill('#E06C75');
  text('  align-items', panelX + 8, lineY);
  fill('#ABB2BF');
  text(': ', panelX + 70, lineY);
  fill('#98C379');
  text(alignItems + ';', panelX + 75, lineY);

  lineY += lineHeight;
  fill('#E06C75');
  text('  flex-wrap', panelX + 8, lineY);
  fill('#ABB2BF');
  text(': ', panelX + 62, lineY);
  fill('#98C379');
  text(flexWrap + ';', panelX + 67, lineY);

  lineY += lineHeight;
  fill('#E06C75');
  text('  gap', panelX + 8, lineY);
  fill('#ABB2BF');
  text(': ', panelX + 30, lineY);
  fill('#D19A66');
  text(gap + 'px;', panelX + 35, lineY);

  lineY += lineHeight;
  fill('#98C379');
  text('}', panelX + 8, lineY);
}

function drawControlLabels() {
  fill('black');
  noStroke();
  textSize(11);
  textAlign(LEFT, CENTER);

  let controlY = drawHeight + 10;
  let col1X = 10;
  let col2X = 200;

  // Column 1 labels
  text('Direction:', col1X, controlY + 10);
  text('Justify:', col1X, controlY + 38);

  // Column 2 labels
  text('Align:', col2X, controlY + 10);
  text('Gap: ' + gap + 'px', margin, controlY + 66);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  calculatePositions();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = max(500, container.offsetWidth);

    // Update container dimensions
    containerW = canvasWidth - margin * 2 - 20;

    // Recalculate positions with new dimensions
    if (items.length > 0) {
      calculatePositions();
    }
  }
}
