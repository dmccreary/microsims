// 555 Timer Simulation using p5.js
// Two-column layout: Circuit/LED on left, Logic Analyzer on right
// Demonstrates both Astable and Monostable modes with accurate timing formulas

// Canvas dimensions
let canvasWidth = 580;
let drawHeight = 400;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let sliderLeftMargin = 130;

// Layout
let leftColWidth;
let rightColX;
let rightColWidth;

// Components
let r1Slider, r2Slider, capacitanceSlider;
let modeButton;
let triggerButton;
let isAstableMode = true;
let ledState = false;
let lastTriggerTime = 0;
let monostableTriggered = false;
let monostablePulseEnd = 0;

// Logic analyzer data
let analyzerData = [];
let analyzerStartTime = 0;
let timeWindowMs = 5000; // 5 second window
const SAMPLE_INTERVAL = 10; // Sample every 10ms
let lastSampleTime = 0;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));
    textSize(16);

    analyzerStartTime = millis();
    createControls();

    describe('555 Timer simulation with logic analyzer display showing LED blinking and waveform in astable and monostable modes', LABEL);
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    canvasWidth = container ? container.offsetWidth : 580;
    canvasWidth = max(canvasWidth, 500);

    // Calculate column widths
    leftColWidth = min(220, canvasWidth * 0.4);
    rightColX = leftColWidth + margin;
    rightColWidth = canvasWidth - rightColX - margin;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    updateControlPositions();
}

function createControls() {
    r1Slider = createSlider(1, 100, 10, 1);
    r1Slider.parent(document.querySelector('main'));

    r2Slider = createSlider(1, 100, 47, 1);
    r2Slider.parent(document.querySelector('main'));

    capacitanceSlider = createSlider(1, 100, 10, 1);
    capacitanceSlider.parent(document.querySelector('main'));

    modeButton = createButton('Switch to Monostable');
    modeButton.parent(document.querySelector('main'));
    modeButton.mousePressed(toggleMode);

    triggerButton = createButton('Trigger');
    triggerButton.parent(document.querySelector('main'));
    triggerButton.mousePressed(triggerMonostable);

    updateControlPositions();
}

function updateControlPositions() {
    let sliderWidth = canvasWidth - sliderLeftMargin - margin;
    let yBase = drawHeight + 10;

    r1Slider.position(sliderLeftMargin, yBase);
    r1Slider.size(sliderWidth);

    r2Slider.position(sliderLeftMargin, yBase + 26);
    r2Slider.size(sliderWidth);

    capacitanceSlider.position(sliderLeftMargin, yBase + 52);
    capacitanceSlider.size(sliderWidth);

    modeButton.position(margin, yBase + 78);
    modeButton.size(145, 22);

    triggerButton.position(margin + 155, yBase + 78);
    triggerButton.size(70, 22);

    updateModeUI();
}

function updateModeUI() {
    if (isAstableMode) {
        r2Slider.show();
        triggerButton.hide();
        modeButton.html('Switch to Monostable');
    } else {
        r2Slider.hide();
        triggerButton.show();
        modeButton.html('Switch to Astable');
    }
}

function toggleMode() {
    isAstableMode = !isAstableMode;
    analyzerData = [];
    analyzerStartTime = millis();
    ledState = false;
    monostableTriggered = false;
    lastTriggerTime = millis();
    updateModeUI();
}

function triggerMonostable() {
    if (!isAstableMode && !monostableTriggered) {
        monostableTriggered = true;
        ledState = true;
        let R = r1Slider.value() * 1000;
        let C = capacitanceSlider.value() / 1000000;
        let pulseWidth = 1.1 * R * C * 1000;
        monostablePulseEnd = millis() + pulseWidth;
    }
}

function draw() {
    // Drawing area
    fill('aliceblue');
    stroke('silver');
    strokeWeight(2);
    rect(0, 0, canvasWidth, drawHeight);

    // Control area
    fill('white');
    noStroke();
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Title
    fill('black');
    noStroke();
    textSize(18);
    textAlign(CENTER, CENTER);
    let modeText = isAstableMode ? 'Astable (Oscillator)' : 'Monostable (One-Shot)';
    text('555 Timer: ' + modeText, canvasWidth / 2, 18);

    // Update LED state
    updateLED();

    // Sample for logic analyzer
    sampleAnalyzer();

    // Draw left column (circuit + LED)
    drawLeftColumn();

    // Draw right column (logic analyzer)
    drawLogicAnalyzer();

    // Draw slider labels
    drawSliderLabels();
}

function drawLeftColumn() {
    // Left column background
    fill(250);
    stroke('silver');
    strokeWeight(1);
    rect(margin, 38, leftColWidth - margin, drawHeight - 48, 5);

    // Draw 555 chip
    draw555Chip();

    // Draw LED
    drawLED();

    // Draw timing info below LED
    drawTimingInfo();
}

function draw555Chip() {
    let chipX = margin + (leftColWidth - margin) / 2;
    let chipY = 100;
    let chipW = 80;
    let chipH = 65;

    // Chip body
    fill(30);
    stroke(60);
    strokeWeight(2);
    rectMode(CENTER);
    rect(chipX, chipY, chipW, chipH, 3);

    // Notch
    fill(50);
    noStroke();
    arc(chipX, chipY - chipH/2, 12, 12, 0, PI);

    // Pin labels - left side
    fill(255);
    textSize(7);
    let pinNames = ['GND', 'TRIG', 'OUT', 'RST'];
    for (let i = 0; i < 4; i++) {
        let py = chipY - chipH/2 + 12 + i * 14;
        fill(200, 180, 100);
        noStroke();
        rect(chipX - chipW/2 - 6, py, 10, 5);
        fill(255);
        textAlign(LEFT, CENTER);
        textSize(6);
        text(pinNames[i], chipX - chipW/2 + 6, py);
    }

    // Pin labels - right side
    pinNames = ['VCC', 'DIS', 'THR', 'CTL'];
    for (let i = 0; i < 4; i++) {
        let py = chipY - chipH/2 + 12 + i * 14;
        fill(200, 180, 100);
        noStroke();
        rect(chipX + chipW/2 + 6, py, 10, 5);
        fill(255);
        textAlign(RIGHT, CENTER);
        textSize(6);
        text(pinNames[i], chipX + chipW/2 - 6, py);
    }

    // 555 label
    fill(255);
    textSize(11);
    textAlign(CENTER, CENTER);
    text('NE555', chipX, chipY + 18);

    rectMode(CORNER);

    // R1 symbol
    drawResistor(chipX - 55, chipY - 15, 'R1');

    // R2 symbol (astable only)
    if (isAstableMode) {
        drawResistor(chipX - 55, chipY + 20, 'R2');
    }

    // Capacitor symbol
    drawCapacitor(chipX + 55, chipY + 5, 'C');
}

function drawResistor(x, y, label) {
    stroke(0);
    strokeWeight(1);
    line(x, y - 10, x, y - 5);
    line(x, y + 5, x, y + 10);

    noFill();
    beginShape();
    vertex(x, y - 5);
    for (let i = 0; i < 3; i++) {
        vertex(x + (i % 2 === 0 ? 4 : -4), y - 3 + i * 3);
    }
    vertex(x, y + 5);
    endShape();

    noStroke();
    fill(0);
    textSize(7);
    textAlign(CENTER, CENTER);
    text(label, x - 10, y);
}

function drawCapacitor(x, y, label) {
    stroke(0);
    strokeWeight(1);
    line(x, y - 10, x, y - 3);
    line(x, y + 3, x, y + 10);
    line(x - 5, y - 3, x + 5, y - 3);
    noFill();
    arc(x, y + 6, 10, 6, PI, TWO_PI);

    noStroke();
    fill(0);
    textSize(7);
    textAlign(CENTER, CENTER);
    text(label, x + 10, y);
}

function drawLED() {
    let ledX = margin + (leftColWidth - margin) / 2;
    let ledY = 195;

    // LED label
    fill(80);
    noStroke();
    textSize(9);
    textAlign(CENTER, CENTER);
    text('OUTPUT', ledX, ledY - 22);

    // Glow effect
    if (ledState) {
        noStroke();
        for (let r = 30; r > 0; r -= 4) {
            fill(255, 0, 0, map(r, 0, 30, 80, 5));
            ellipse(ledX, ledY, r, r);
        }
    }

    // LED body
    fill(ledState ? color(255, 0, 0) : color(80, 40, 40));
    stroke(60);
    strokeWeight(1);
    ellipse(ledX, ledY, 22, 22);

    // Highlight
    noStroke();
    fill(255, 255, 255, ledState ? 140 : 40);
    ellipse(ledX - 4, ledY - 4, 5, 5);

    // Status
    fill(0);
    textSize(10);
    text(ledState ? 'ON' : 'OFF', ledX, ledY + 20);
}

function drawTimingInfo() {
    let R1 = r1Slider.value();
    let R2 = r2Slider.value();
    let C = capacitanceSlider.value();
    let R1_ohm = R1 * 1000;
    let R2_ohm = R2 * 1000;
    let C_farad = C / 1000000;

    let infoY = 235;
    let infoX = margin + 10;
    let infoW = leftColWidth - margin - 20;

    fill(240);
    stroke('silver');
    strokeWeight(1);
    rect(infoX, infoY, infoW, isAstableMode ? 70 : 50, 3);

    fill(0);
    noStroke();
    textSize(8);
    textAlign(LEFT, CENTER);

    if (isAstableMode) {
        let tHigh = 0.693 * (R1_ohm + R2_ohm) * C_farad * 1000;
        let tLow = 0.693 * R2_ohm * C_farad * 1000;
        let period = tHigh + tLow;
        let frequency = 1000 / period;
        let dutyCycle = (tHigh / period) * 100;

        text('T_high: ' + tHigh.toFixed(0) + ' ms', infoX + 5, infoY + 12);
        text('T_low: ' + tLow.toFixed(0) + ' ms', infoX + 5, infoY + 26);
        text('Period: ' + period.toFixed(0) + ' ms', infoX + 5, infoY + 40);
        text('Freq: ' + frequency.toFixed(2) + ' Hz', infoX + 5, infoY + 54);
        textAlign(CENTER, CENTER);
        text('Duty: ' + dutyCycle.toFixed(0) + '%', infoX + infoW/2, infoY + 64);
    } else {
        let pulseWidth = 1.1 * R1_ohm * C_farad * 1000;
        text('Pulse: ' + pulseWidth.toFixed(0) + ' ms', infoX + 5, infoY + 15);
        text('t = 1.1 × R × C', infoX + 5, infoY + 32);
        if (!monostableTriggered) {
            fill(100);
            text('Press Trigger', infoX + 5, infoY + 45);
        }
    }

    // Formula at bottom of left column
    fill(60);
    textSize(7);
    textAlign(CENTER, CENTER);
    if (isAstableMode) {
        text('T = 0.693(R1+2R2)C', margin + (leftColWidth-margin)/2, drawHeight - 25);
        text('f = 1.44/((R1+2R2)C)', margin + (leftColWidth-margin)/2, drawHeight - 14);
    } else {
        text('t = 1.1 × R × C', margin + (leftColWidth-margin)/2, drawHeight - 18);
    }
}

function sampleAnalyzer() {
    let currentTime = millis();

    if (currentTime - lastSampleTime >= SAMPLE_INTERVAL) {
        let relativeTime = currentTime - analyzerStartTime;
        analyzerData.push({
            time: relativeTime,
            state: ledState ? 1 : 0
        });
        lastSampleTime = currentTime;

        // Remove old samples outside window
        while (analyzerData.length > 0 &&
               analyzerData[0].time < relativeTime - timeWindowMs) {
            analyzerData.shift();
        }
    }
}

function drawLogicAnalyzer() {
    let anaX = rightColX;
    let anaY = 38;
    let anaW = rightColWidth;
    let anaH = drawHeight - 48;

    // Background
    fill(20);
    stroke('silver');
    strokeWeight(1);
    rect(anaX, anaY, anaW, anaH, 5);

    // Title
    fill(0, 255, 0);
    noStroke();
    textSize(11);
    textAlign(LEFT, CENTER);
    text('Logic Analyzer - Output (Pin 3)', anaX + 10, anaY + 15);

    // Waveform area
    let waveX = anaX + 50;
    let waveY = anaY + 35;
    let waveW = anaW - 60;
    let waveH = anaH - 100;

    // Grid background
    fill(30);
    stroke(50);
    strokeWeight(1);
    rect(waveX, waveY, waveW, waveH);

    // Draw time grid lines and labels
    drawTimeGrid(waveX, waveY, waveW, waveH);

    // Draw HIGH/LOW labels
    fill(100);
    textSize(9);
    textAlign(RIGHT, CENTER);
    text('HIGH', waveX - 5, waveY + 15);
    text('LOW', waveX - 5, waveY + waveH - 15);

    // Draw voltage scale
    fill(80);
    textSize(8);
    text('5V', waveX - 5, waveY + 5);
    text('0V', waveX - 5, waveY + waveH - 5);

    // Draw waveform
    if (analyzerData.length > 1) {
        let currentTime = millis() - analyzerStartTime;
        let windowStart = max(0, currentTime - timeWindowMs);

        stroke(0, 255, 0);
        strokeWeight(2);
        noFill();

        let highY = waveY + 20;
        let lowY = waveY + waveH - 20;

        beginShape();
        let prevX = null;
        let prevY = null;

        for (let i = 0; i < analyzerData.length; i++) {
            let sample = analyzerData[i];
            let x = map(sample.time, windowStart, windowStart + timeWindowMs, waveX, waveX + waveW);
            let y = sample.state === 1 ? highY : lowY;

            if (x >= waveX && x <= waveX + waveW) {
                // Draw vertical transition line for square wave
                if (prevX !== null && prevY !== null && prevY !== y) {
                    vertex(x, prevY);
                }
                vertex(x, y);
                prevX = x;
                prevY = y;
            }
        }
        endShape();
    }

    // Draw current time marker
    stroke(255, 100, 0);
    strokeWeight(1);
    let markerX = waveX + waveW - 2;
    line(markerX, waveY, markerX, waveY + waveH);

    // Time window info
    fill(150);
    noStroke();
    textSize(9);
    textAlign(CENTER, CENTER);
    text('Time Window: ' + (timeWindowMs/1000).toFixed(1) + 's', anaX + anaW/2, anaY + anaH - 35);

    // Current state indicator
    fill(ledState ? color(0, 255, 0) : color(100));
    textSize(10);
    text('Current: ' + (ledState ? 'HIGH' : 'LOW'), anaX + anaW/2, anaY + anaH - 18);
}

function drawTimeGrid(x, y, w, h) {
    let currentTime = millis() - analyzerStartTime;
    let windowStart = max(0, currentTime - timeWindowMs);

    // Vertical grid lines (time divisions)
    stroke(50);
    strokeWeight(1);

    let numDivisions = 10;
    let msPerDiv = timeWindowMs / numDivisions;

    fill(80);
    textSize(8);
    textAlign(CENTER, TOP);

    for (let i = 0; i <= numDivisions; i++) {
        let divX = x + (w * i / numDivisions);

        // Grid line
        stroke(i === numDivisions ? color(255, 100, 0, 100) : color(50));
        line(divX, y, divX, y + h);

        // Time label
        let timeAtDiv = windowStart + (i * msPerDiv);
        noStroke();
        fill(80);
        if (i % 2 === 0) {
            let labelText;
            if (timeAtDiv >= 1000) {
                labelText = (timeAtDiv / 1000).toFixed(1) + 's';
            } else {
                labelText = timeAtDiv.toFixed(0) + 'ms';
            }
            text(labelText, divX, y + h + 3);
        }
    }

    // Horizontal grid lines
    stroke(50);
    line(x, y + h/2, x + w, y + h/2);

    // Division label
    fill(100);
    textSize(8);
    textAlign(LEFT, CENTER);
    text((msPerDiv).toFixed(0) + 'ms/div', x + 5, y + h + 15);
}

function updateLED() {
    let currentTime = millis();

    if (isAstableMode) {
        let R1 = r1Slider.value() * 1000;
        let R2 = r2Slider.value() * 1000;
        let C = capacitanceSlider.value() / 1000000;

        let tHigh = 0.693 * (R1 + R2) * C * 1000;
        let tLow = 0.693 * R2 * C * 1000;

        let currentPeriod = ledState ? tHigh : tLow;
        if (currentTime > lastTriggerTime + currentPeriod) {
            ledState = !ledState;
            lastTriggerTime = currentTime;
        }
    } else {
        if (monostableTriggered) {
            if (currentTime >= monostablePulseEnd) {
                ledState = false;
                monostableTriggered = false;
            }
        }
    }
}

function drawSliderLabels() {
    fill('black');
    noStroke();
    textSize(11);
    textAlign(RIGHT, CENTER);
    let yBase = drawHeight + 10;

    let r1Label = isAstableMode ? 'R1: ' : 'R: ';
    text(r1Label + r1Slider.value() + ' k\u03A9', sliderLeftMargin - 8, yBase + 8);

    if (isAstableMode) {
        text('R2: ' + r2Slider.value() + ' k\u03A9', sliderLeftMargin - 8, yBase + 34);
        text('C: ' + capacitanceSlider.value() + ' \u00B5F', sliderLeftMargin - 8, yBase + 60);
    } else {
        text('C: ' + capacitanceSlider.value() + ' \u00B5F', sliderLeftMargin - 8, yBase + 34);
        capacitanceSlider.position(sliderLeftMargin, yBase + 26);
    }
}
