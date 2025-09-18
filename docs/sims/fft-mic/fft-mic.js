// FFT Microphone Visualizer MicroSim
// Canvas dimensions
let canvasWidth = 500;
let drawHeight = 400;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 80;
let defaultTextSize = 16;

// Global variables for responsive design
let containerWidth; // calculated by container upon resize
let containerHeight = canvasHeight; // fixed height on page

// Audio variables
let mic;
let fft;
let spectrum;
let started = false;
let isListening = false;

// UI Controls
let startStopButton;
let maxFreqSlider;

// Visualization parameters
// must be a 2^N - try 128, 256, 512, 1024 etc.
let binCount = 512;
let maxDisplayFreq = 8000; // Default max frequency to display

function setup() {
  // Create a canvas to match the parent container's size
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  
  // Create microphone input and FFT analyzer
  mic = new p5.AudioIn();
  fft = new p5.FFT(0.8, binCount);
  fft.setInput(mic);
  
  // Create start/stop button
  startStopButton = createButton('Start');
  startStopButton.position(20, drawHeight + 15);
  startStopButton.mousePressed(toggleAudio);
  
  // Create max frequency slider (2kHz to 24kHz)
  maxFreqSlider = createSlider(2000, 24000, 8000, 500);
  maxFreqSlider.position(sliderLeftMargin, drawHeight + 7);
  maxFreqSlider.size(containerWidth - 150);
  
  describe('FFT Microphone Visualizer showing real-time frequency analysis of microphone input with start/stop control.', LABEL);
}

function draw() {
  // Draw area
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  
  // Controls area
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);
  
  // Update max frequency from slider
  maxDisplayFreq = maxFreqSlider.value();
  
  // Title
  fill('black');
  noStroke();
  textSize(24);
  textAlign(CENTER, TOP);
  text("FFT Microphone Visualizer", canvasWidth/2, margin/2);
  
  if (started && isListening) {
    // Get FFT analysis
    spectrum = fft.analyze();
    
    // Draw the frequency spectrum
    drawSpectrum();
    
    // Draw frequency labels
    drawFrequencyLabels();
    
  } else if (started && !isListening) {
    // Audio is initialized but stopped - keep last spectrum visible
    if (spectrum) {
      drawSpectrum();
      drawFrequencyLabels();
    }
    
    // Show status
    fill('red');
    noStroke();
    textSize(16);
    textAlign(CENTER, TOP);
    // text("Audio Stopped - Click Start to Resume", canvasWidth/2, drawHeight - 60);
    
  } else {
    // Not started yet
    fill('gray');
    noStroke();
    textSize(18);
    textAlign(CENTER, CENTER);
    text("Click Start to begin microphone analysis", canvasWidth/2, drawHeight/2);
  }
  
  // Draw control labels
  drawControlLabels();
}

function drawSpectrum() {
  // Sample frequency (assuming 44.1kHz sample rate)
  let sampleRate = 44100;
  let nyquist = sampleRate / 2;
  
  // Calculate how many bins to display based on maxDisplayFreq
  let maxBin = Math.floor((maxDisplayFreq / nyquist) * spectrum.length);
  maxBin = Math.min(maxBin, spectrum.length);
  
  let barWidth = (canvasWidth - 2 * margin) / maxBin;
  
  // Draw spectrum bars
  noStroke();
  for (let i = 0; i < maxBin; i++) {
    let amplitude = spectrum[i];
    let barHeight = map(amplitude, 0, 255, 0, drawHeight - 80);
    
    // Color based on frequency range within displayed range
    let hue = map(i, 0, maxBin, 240, 0); // Blue to red
    colorMode(HSB);
    fill(hue, 80, 90);
    
    let x = margin + i * barWidth;
    let y = drawHeight - 60 - barHeight;
    
    rect(x, y, barWidth - 1, barHeight);
  }
  
  // Reset to RGB color mode
  colorMode(RGB);
  
  // Draw amplitude scale
  stroke('black');
  strokeWeight(1);
  line(margin, drawHeight - 60, canvasWidth - margin, drawHeight - 60);
  
  // Amplitude labels
  fill('black');
  noStroke();
  textSize(12);
  textAlign(LEFT, CENTER);
  text("0", 5, drawHeight - 60);
  text("Max", 5, margin + 50);
}

function drawFrequencyLabels() {
  fill('black');
  noStroke();
  textSize(12);
  textAlign(CENTER, TOP);
  
  // Draw frequency markers based on current max frequency
  let numLabels = 6;
  for (let i = 0; i <= numLabels; i++) {
    let freq = map(i, 0, numLabels, 0, maxDisplayFreq);
    let x = map(i, 0, numLabels, margin, canvasWidth - margin);
    
    // Draw tick mark
    stroke('black');
    line(x, drawHeight - 60, x, drawHeight - 55);
    
    // Draw frequency label
    noStroke();
    if (freq >= 1000) {
      text((freq/1000).toFixed(1) + "k", x, drawHeight - 50);
    } else {
      text(freq.toFixed(0), x, drawHeight - 50);
    }
  }
  
  // Frequency axis label
  textAlign(CENTER, TOP);
  textSize(14);
  text("Frequency (Hz)", canvasWidth/2, drawHeight - 35);
}

function drawControlLabels() {
  fill('black');
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  
  text(`Max Freq: ${(maxDisplayFreq/1000).toFixed(1)}k Hz`, 100, drawHeight + 35);
}

function getPeakFrequency() {
  if (!spectrum) return "N/A";
  
  // Only look at the displayed frequency range
  let sampleRate = 44100;
  let nyquist = sampleRate / 2;
  let maxBin = Math.floor((maxDisplayFreq / nyquist) * spectrum.length);
  maxBin = Math.min(maxBin, spectrum.length);
  
  let maxIndex = 0;
  let maxValue = 0;
  
  for (let i = 0; i < maxBin; i++) {
    if (spectrum[i] > maxValue) {
      maxValue = spectrum[i];
      maxIndex = i;
    }
  }
  
  // Convert bin index to frequency
  let frequency = (maxIndex * sampleRate) / (2 * spectrum.length);
  
  if (frequency >= 1000) {
    return (frequency/1000).toFixed(1) + " kHz";
  } else {
    return frequency.toFixed(0) + " Hz";
  }
}

function toggleAudio() {
  if (!started) {
    // First time starting
    mic.start();
    started = true;
    isListening = true;
    startStopButton.html('Stop');
    userStartAudio();
  } else if (isListening) {
    // Currently listening, stop
    isListening = false;
    startStopButton.html('Start');
  } else {
    // Currently stopped, start listening again
    isListening = true;
    startStopButton.html('Stop');
  }
}

function windowResized() {
  // Update canvas size when the container resizes
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  
  // Resize the slider to match the new canvasWidth
  maxFreqSlider.size(containerWidth - 200);
  
  redraw();
}

function updateCanvasSize() {
  // Get the exact dimensions of the container
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);  // Avoid fractional pixels
  canvasWidth = containerWidth;
}