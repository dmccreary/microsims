// Rainbow Color Picker MicroSim
// Displays a horizontal rainbow band with a slider to select colors
// Shows RGB values and current color swatch

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 70;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let sliderLeftMargin = 190;
let defaultTextSize = 16;

// Rainbow and color selection
let colorSlider;
let selectedHue = 0;
let rainbowY = 10;       // Y position of rainbow band
let rainbowHeight = 50;  // Height of rainbow band

// Color swatch dimensions
let swatchX = 10;
let swatchY;
let swatchSize = 35;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    colorMode(HSB, 360, 100, 100);

    // Create color slider (0-360 for hue)
    colorSlider = createSlider(0, 360, 150, 1);
    colorSlider.position(sliderLeftMargin, drawHeight + 15);
    colorSlider.size(canvasWidth - sliderLeftMargin - margin);

    swatchY = drawHeight + 8;

    describe('Rainbow color picker with horizontal rainbow band and slider to select colors. Displays RGB values and color swatch.', LABEL);
}

function draw() {
    updateCanvasSize();

    // Drawing area background
    colorMode(RGB);
    fill(240, 248, 255); // aliceblue
    stroke(192, 192, 192); // silver
    strokeWeight(1);
    rect(0, 0, canvasWidth, drawHeight);

    // Control area background
    fill('white');
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Title
    fill(0);
    noStroke();
    textSize(24);
    textAlign(CENTER, TOP);
    text('Rainbow Color Picker', canvasWidth / 2, 10);

    // Draw rainbow band
    drawRainbow();

    // Get current slider value
    selectedHue = colorSlider.value();

    // Draw selection indicator on rainbow
    drawSelectionIndicator();

    // Draw color swatch and RGB values in control area
    drawControlArea();
}

function drawRainbow() {
    colorMode(HSB, 360, 100, 100);
    noStroke();

    // Draw rainbow as vertical strips
    let rainbowWidth = canvasWidth - 2 * margin;
    for (let x = 0; x < rainbowWidth; x++) {
        let hue = map(x, 0, rainbowWidth, 0, 360);
        fill(hue, 100, 100);
        rect(margin + x, rainbowY, 1, rainbowHeight);
    }

    // Draw border around rainbow
    colorMode(RGB);
    noFill();
    stroke(100);
    strokeWeight(2);
    rect(margin, rainbowY, rainbowWidth, rainbowHeight);
}

function drawSelectionIndicator() {
    // Calculate x position based on selected hue
    let rainbowWidth = canvasWidth - 2 * margin;
    let indicatorX = map(selectedHue, 0, 360, margin, margin + rainbowWidth);

    // Draw thin black rectangle outline over current color
    colorMode(RGB);
    noFill();
    stroke(0);
    strokeWeight(2);
    let indicatorWidth = 10;
    rect(indicatorX - indicatorWidth / 2, rainbowY, indicatorWidth, rainbowHeight);
}

function drawControlArea() {
    colorMode(HSB, 360, 100, 100);

    // Get RGB values for current hue
    let c = color(selectedHue, 100, 100);
    colorMode(RGB);
    let r = Math.round(red(c));
    let g = Math.round(green(c));
    let b = Math.round(blue(c));

    // Draw color swatch with border
    fill(c);
    stroke(0);
    strokeWeight(1);
    rect(swatchX, swatchY, swatchSize, swatchSize);

    // Draw RGB values
    fill(0);
    noStroke();
    textSize(defaultTextSize);
    textAlign(LEFT, CENTER);
    let textX = swatchX + swatchSize + 10;
    let textY = drawHeight + controlHeight / 2;
    text('R:' + r + ' G:' + g + ' B:' + b, textX, textY);
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) {
        canvasWidth = container.offsetWidth;
        if (typeof colorSlider !== 'undefined') {
            colorSlider.size(canvasWidth - sliderLeftMargin - margin);
        }
    }
}
