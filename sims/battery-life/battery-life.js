// Battery Life Calculator MicroSim
// Width-responsive version

let canvasWidth = 450;
let drawHeight = 210;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let labelWidth = 60;
let dropdownWidth = 180;
let sliderStartX = 270;

let batterySelect, deviceSelect;
let customCapacitySlider, customCurrentSlider;

// Battery data: name, capacity in mAh
const batteries = [
  { name: "CR2032 Coin Cell", capacity: 220 },
  { name: "2x AAA Alkaline", capacity: 2400 },
  { name: "4x AA Alkaline", capacity: 10000 },
  { name: "9V Battery", capacity: 550 },
  { name: "18650 LiPo Cell", capacity: 3000 },
  { name: "Power Pack 10,000mAh", capacity: 10000 },
  { name: "Custom", capacity: 0 }
];

// Device data: name, current in mA
const devices = [
  { name: "Dim Red LED", current: 2 },
  { name: "Bright White LED", current: 20 },
  { name: "30 RGB LED Strip (10%)", current: 180 },
  { name: "8x8 RGB Matrix (80%)", current: 1024 },
  { name: "Custom", current: 0 }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(16);

  // Create battery dropdown
  batterySelect = createSelect();
  batterySelect.position(labelWidth + 10, drawHeight + 10);
  batterySelect.size(dropdownWidth);
  for (let b of batteries) {
    batterySelect.option(b.name);
  }
  batterySelect.changed(updateDisplay);

  // Create device dropdown
  deviceSelect = createSelect();
  deviceSelect.position(labelWidth + 10, drawHeight + 42);
  deviceSelect.size(dropdownWidth);
  for (let d of devices) {
    deviceSelect.option(d.name);
  }
  deviceSelect.changed(updateDisplay);

  // Custom capacity slider - positioned to right of dropdown, always visible but grayed out
  customCapacitySlider = createSlider(100, 20000, 1000, 100);
  customCapacitySlider.position(sliderStartX, drawHeight + 12);
  customCapacitySlider.size(canvasWidth - sliderStartX - 90);
  customCapacitySlider.attribute('disabled', '');

  // Custom current slider - positioned to right of dropdown, always visible but grayed out
  customCurrentSlider = createSlider(1, 2000, 100, 1);
  customCurrentSlider.position(sliderStartX, drawHeight + 44);
  customCurrentSlider.size(canvasWidth - sliderStartX - 90);
  customCurrentSlider.attribute('disabled', '');
}

function updateCanvasSize() {
  const mainElement = document.querySelector('main');
  if (mainElement) {
    canvasWidth = mainElement.offsetWidth;
  }
  sliderStartX = Math.min(sliderStartX, canvasWidth * 0.45);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);

  // Reposition and resize sliders
  customCapacitySlider.position(sliderStartX, drawHeight + 12);
  customCapacitySlider.size(canvasWidth - sliderStartX - 90);
  customCurrentSlider.position(sliderStartX, drawHeight + 44);
  customCurrentSlider.size(canvasWidth - sliderStartX - 90);
}

function updateDisplay() {
  let batteryName = batterySelect.value();
  let deviceName = deviceSelect.value();

  // Enable/disable sliders based on "Custom" selection
  if (batteryName === "Custom") {
    customCapacitySlider.removeAttribute('disabled');
  } else {
    customCapacitySlider.attribute('disabled', '');
  }

  if (deviceName === "Custom") {
    customCurrentSlider.removeAttribute('disabled');
  } else {
    customCurrentSlider.attribute('disabled', '');
  }
}

function getCapacity() {
  let batteryName = batterySelect.value();
  if (batteryName === "Custom") {
    return customCapacitySlider.value();
  }
  for (let b of batteries) {
    if (b.name === batteryName) return b.capacity;
  }
  return 1000;
}

function getCurrent() {
  let deviceName = deviceSelect.value();
  if (deviceName === "Custom") {
    return customCurrentSlider.value();
  }
  for (let d of devices) {
    if (d.name === deviceName) return d.current;
  }
  return 10;
}

function draw() {
  // Drawing area
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  let capacity = getCapacity();
  let current = getCurrent();
  let hours = capacity / current;

  // Draw battery visualization
  drawBattery(capacity, current, hours);

  // Draw left side info (battery and device)
  drawLeftInfo(capacity, current);

  // Draw results on right side
  drawResults(capacity, current, hours);

  // Draw labels for controls
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(16);
  text("Battery:", 10, drawHeight + 22);
  text("Device:", 10, drawHeight + 54);

  // Draw slider value labels to the right of sliders
  let batteryName = batterySelect.value();
  let deviceName = deviceSelect.value();

  textAlign(LEFT, CENTER);
  textSize(12);

  if (batteryName === "Custom") {
    fill('black');
    text(customCapacitySlider.value() + " mAh", canvasWidth - 80, drawHeight + 22);
  } else {
    fill('gray');
    text(customCapacitySlider.value() + " mAh", canvasWidth - 80, drawHeight + 22);
  }

  if (deviceName === "Custom") {
    fill('black');
    text(customCurrentSlider.value() + " mA", canvasWidth - 80, drawHeight + 54);
  } else {
    fill('gray');
    text(customCurrentSlider.value() + " mA", canvasWidth - 80, drawHeight + 54);
  }
}

function drawBattery(capacity, current, hours) {
  let batteryW = 80;
  let batteryH = 140;
  let batteryX = canvasWidth / 2 - batteryW / 2;
  let batteryY = (drawHeight - batteryH) / 2;

  // Battery outline
  stroke('darkgray');
  strokeWeight(3);
  fill('white');
  rect(batteryX, batteryY, batteryW, batteryH, 5);

  // Battery terminal
  fill('darkgray');
  noStroke();
  rect(batteryX + batteryW/2 - 15, batteryY - 10, 30, 12, 3);

  // Battery fill based on time remaining visualization
  let fillPercent = min(1, hours / 100); // Scale: 100 hours = full visual
  let fillH = batteryH * fillPercent * 0.9;
  let fillColor = getColorForHours(hours);
  fill(fillColor);
  noStroke();
  rect(batteryX + 5, batteryY + batteryH - fillH - 5, batteryW - 10, fillH, 3);

  // Capacity label on battery
  fill('black');
  textAlign(CENTER, CENTER);
  textSize(14);
  text(capacity + " mAh", batteryX + batteryW/2, batteryY + batteryH/2);
}

function getColorForHours(hours) {
  if (hours < 1) return color(255, 50, 50);      // Red: less than 1 hour
  if (hours < 10) return color(255, 165, 0);     // Orange: 1-10 hours
  if (hours < 100) return color(255, 255, 0);    // Yellow: 10-100 hours
  if (hours < 1000) return color(100, 255, 100); // Green: 100-1000 hours
  return color(50, 200, 50);                      // Dark green: 1000+ hours
}

function drawLeftInfo(capacity, current) {
  let leftX = 15;
  let startY = 30;
  let lineHeight = 20;

  fill('black');
  textAlign(LEFT, TOP);

  // Battery info
  textSize(14);
  fill('darkblue');
  text("Battery:", leftX, startY);

  textSize(13);
  fill('black');
  let batteryName = batterySelect.value();
  if (batteryName === "Custom") {
    text("Custom", leftX, startY + lineHeight);
  } else {
    text(batteryName, leftX, startY + lineHeight);
  }
  text(capacity.toLocaleString() + " mAh", leftX, startY + lineHeight * 2);

  // Device info
  let deviceStartY = startY + lineHeight * 3.5;
  textSize(14);
  fill('darkblue');
  text("Device:", leftX, deviceStartY);

  textSize(13);
  fill('black');
  let deviceName = deviceSelect.value();
  if (deviceName === "Custom") {
    text("Custom", leftX, deviceStartY + lineHeight);
  } else {
    text(deviceName, leftX, deviceStartY + lineHeight);
  }
  text(current.toLocaleString() + " mA", leftX, deviceStartY + lineHeight * 2);
}

function drawResults(capacity, current, hours) {
  let rightX = canvasWidth / 2 + 80;
  let startY = 30;

  fill('darkblue');
  textAlign(LEFT, TOP);
  textSize(14);
  text("Battery Life:", rightX, startY);

  textSize(13);
  fill('black');
  let y = startY + 25;
  let lineHeight = 20;

  // Format time display
  if (hours < 1) {
    let minutes = hours * 60;
    text(minutes.toFixed(1) + " minutes", rightX, y);
  } else if (hours < 24) {
    text(hours.toFixed(1) + " hours", rightX, y);
  } else if (hours < 168) { // Less than a week
    let days = hours / 24;
    text(hours.toFixed(1) + " hours", rightX, y);
    y += lineHeight;
    text("(" + days.toFixed(1) + " days)", rightX, y);
  } else if (hours < 8760) { // Less than a year
    let days = hours / 24;
    let weeks = days / 7;
    text(days.toFixed(1) + " days", rightX, y);
    y += lineHeight;
    text("(" + weeks.toFixed(1) + " weeks)", rightX, y);
  } else {
    let days = hours / 24;
    let years = days / 365;
    text(days.toFixed(0) + " days", rightX, y);
    y += lineHeight;
    text("(" + years.toFixed(1) + " years)", rightX, y);
  }

  y += lineHeight + 15;
  textSize(11);
  fill('gray');
  text("Formula: Hours = mAh / mA", rightX, y);
  y += 16;
  text(capacity + " / " + current + " = " + hours.toFixed(2), rightX, y);
}
