// 555 Timer Simulation using p5.js
// Users can adjust resistance and capacitance to see the effect on the LED blinking rate

// Canvas dimensions
let canvasWidth = 450;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 130;

// Components
let resistanceSlider, capacitanceSlider;
let ledState = false;
let lastTriggerTime = 0;
let waveform = [];

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));
    textSize(16);

    createSliders();

    describe('555 Timer simulation showing LED blinking and waveform based on RC values', LABEL);
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    canvasWidth = container ? container.offsetWidth : 450;
    canvasWidth = max(canvasWidth, 350); // Minimum width
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    updateSliderPositions();
}

function createSliders() {
    // Resistance slider
    resistanceSlider = createSlider(1, 100, 50, 1);
    resistanceSlider.parent(document.querySelector('main'));

    // Capacitance slider
    capacitanceSlider = createSlider(1, 100, 50, 1);
    capacitanceSlider.parent(document.querySelector('main'));

    updateSliderPositions();
}

function updateSliderPositions() {
    let sliderWidth = canvasWidth - sliderLeftMargin - margin;

    resistanceSlider.position(sliderLeftMargin, drawHeight + 20);
    resistanceSlider.size(sliderWidth);

    capacitanceSlider.position(sliderLeftMargin, drawHeight + 50);
    capacitanceSlider.size(sliderWidth);
}

function draw() {
    // Drawing area
    fill('aliceblue');
    stroke('silver');
    strokeWeight(2);
    rect(0, 0, canvasWidth, drawHeight);

    // Control area
    fill('white');
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Title
    fill('black');
    noStroke();
    textSize(24);
    textAlign(CENTER, CENTER);
    text('555 Timer Simulation', canvasWidth / 2, 25);

    // Draw circuit diagram area
    drawCircuitArea();

    // Draw the waveform
    drawWaveform();

    // Update and draw LED
    updateLED();
    drawLED();

    // Draw frequency info
    drawFrequencyInfo();

    // Draw slider labels
    drawSliderLabels();
}

function drawCircuitArea() {
    // Circuit diagram background
    fill(250);
    stroke('silver');
    strokeWeight(1);
    rect(margin, 50, canvasWidth - 2 * margin, 100, 5);

    // Label
    fill(100);
    noStroke();
    textSize(12);
    textAlign(CENTER, CENTER);
    text('555 Timer Circuit', canvasWidth / 2, 60);

    // Draw simplified 555 chip
    fill(50);
    rectMode(CENTER);
    rect(canvasWidth / 2, 105, 60, 40, 3);
    fill(255);
    textSize(10);
    text('555', canvasWidth / 2, 105);
    rectMode(CORNER);

    // Draw resistor symbol
    stroke(0);
    strokeWeight(2);
    let rx = canvasWidth / 2 - 80;
    line(rx, 85, rx, 95);
    // Zigzag
    for (let i = 0; i < 4; i++) {
        line(rx + (i % 2 === 0 ? -5 : 5), 95 + i * 5, rx + (i % 2 === 0 ? 5 : -5), 100 + i * 5);
    }
    line(rx, 115, rx, 125);
    noStroke();
    fill(0);
    textSize(10);
    text('R', rx, 135);

    // Draw capacitor symbol
    stroke(0);
    strokeWeight(2);
    let cx = canvasWidth / 2 + 80;
    line(cx, 85, cx, 100);
    line(cx - 10, 100, cx + 10, 100);
    line(cx - 10, 108, cx + 10, 108);
    line(cx, 108, cx, 125);
    noStroke();
    fill(0);
    textSize(10);
    text('C', cx, 135);
}

function drawWaveform() {
    // Waveform area background
    fill(255);
    stroke('silver');
    strokeWeight(1);
    let waveY = 160;
    let waveHeight = 80;
    rect(margin, waveY, canvasWidth - 2 * margin, waveHeight, 5);

    // Waveform label
    fill(100);
    noStroke();
    textSize(12);
    textAlign(LEFT, CENTER);
    text('Output Waveform', margin + 10, waveY + 12);

    // Draw waveform
    stroke(0, 100, 255);
    strokeWeight(2);
    noFill();
    beginShape();
    let waveWidth = canvasWidth - 2 * margin - 10;
    for (let i = 0; i < waveform.length; i++) {
        let x = map(i, 0, waveform.length, margin + 5, margin + waveWidth);
        let y = map(waveform[i], 0, 1, waveY + waveHeight - 15, waveY + 25);
        vertex(x, y);
    }
    endShape();

    // Update waveform data
    if (frameCount % 2 === 0) {
        waveform.push(ledState ? 1 : 0);
        if (waveform.length > waveWidth) {
            waveform.splice(0, 1);
        }
    }
}

function updateLED() {
    let currentTime = millis();
    let period = resistanceSlider.value() * capacitanceSlider.value();
    let thresholdTime = lastTriggerTime + period;
    if (currentTime > thresholdTime) {
        ledState = !ledState;
        lastTriggerTime = currentTime;
    }
}

function drawLED() {
    // LED area
    let ledX = canvasWidth / 2;
    let ledY = 300;

    // LED label
    fill(100);
    noStroke();
    textSize(12);
    textAlign(CENTER, CENTER);
    text('LED Output', ledX, ledY - 35);

    // LED glow effect when on
    if (ledState) {
        noStroke();
        for (let r = 40; r > 0; r -= 5) {
            fill(255, 0, 0, map(r, 0, 40, 100, 10));
            ellipse(ledX, ledY, r, r);
        }
    }

    // LED body
    fill(ledState ? color(255, 0, 0) : color(100, 50, 50));
    stroke(100);
    strokeWeight(1);
    ellipse(ledX, ledY, 30, 30);

    // LED highlight
    noStroke();
    fill(255, 255, 255, ledState ? 150 : 50);
    ellipse(ledX - 5, ledY - 5, 8, 8);

    // Status text
    fill(0);
    textSize(14);
    text(ledState ? 'ON' : 'OFF', ledX, ledY + 30);
}

function drawFrequencyInfo() {
    let period = resistanceSlider.value() * capacitanceSlider.value();
    let frequency = 1000 / (2 * period); // Hz (approximate)

    fill(0);
    noStroke();
    textSize(14);
    textAlign(CENTER, CENTER);
    text('Period: ' + period.toFixed(0) + ' ms | Frequency: ' + frequency.toFixed(1) + ' Hz', canvasWidth / 2, 360);
}

function drawSliderLabels() {
    fill('black');
    noStroke();
    textSize(14);
    textAlign(RIGHT, CENTER);

    // Resistance label
    text('R: ' + resistanceSlider.value() + ' kΩ', sliderLeftMargin - 10, drawHeight + 28);

    // Capacitance label
    text('C: ' + capacitanceSlider.value() + ' µF', sliderLeftMargin - 10, drawHeight + 58);
}
