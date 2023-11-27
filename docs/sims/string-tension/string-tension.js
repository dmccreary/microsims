// String Tension Demo
// contributed by Shawn McBurnie

class DemoTemplate {
  constructor(title, sliderLabel) {
    this.title = title;
    this.sliderLabel = sliderLabel;
    this.sliderRange = [1, 100]; // Default range for the slider
    this.isSoundOn = false;
    this.speakerIconX = 400; // X position of the speaker icon
    this.speakerIconY = 40;  // Y position of the speaker icon
    this.oscillator = new p5.Oscillator('sine');
    this.slider = null; // Initialize slider as null
  }


  setup() {
    const canvas = createCanvas(500, 300);
    canvas.parent('canvas-container');
    background(255);
    this.oscillator.amp(0); // Initial volume is 0
    this.oscillator.start();
    this.placeSlider(); // Create the slider in setup
    this.sliderLabel = `Slider Value: ${this.getSliderValue()}`; // Initialize the slider label
  }

  placeSlider() {
    if (!this.slider) {
      let sliderY = height - 40;
      this.slider = createSlider(this.sliderRange[0], this.sliderRange[1], 1, 1);
      this.slider.position(10, sliderY);
      this.slider.style('width', '480px');
    }
  }

  displayTitle() {
    textAlign(CENTER);
    textSize(20);
    text(this.title, width / 2, 45);
  }

  displaySliderValue() {
    noStroke();
    fill(0);
    let sliderY = height - 40;
    textAlign(LEFT);
    textSize(12);
    text(this.sliderLabel, 10, sliderY - 10); // Only display the label
  }

  drawSpeakerIcon() {
    let speakerIconX = width - 60;
    ellipse(speakerIconX, this.speakerIconY, 10, 10); // Speaker dot
    stroke(0);
    noFill();
    ellipse(speakerIconX, this.speakerIconY, 24, 24); // Outer circles
    ellipse(speakerIconX, this.speakerIconY, 30, 30);
    textSize(12);
    fill(0);
    noStroke();
    text(this.isSoundOn ? "Turn sound off" : "Turn sound on", speakerIconX - 5, this.speakerIconY + 30);
    if (!this.isSoundOn) {
      stroke(0);
      line(speakerIconX + 15, this.speakerIconY - 15, speakerIconX - 15, this.speakerIconY + 15);
    }
  }

  toggleSound() {
    this.isSoundOn = !this.isSoundOn;
    this.oscillator.amp(this.isSoundOn ? 0.3 : 0, 0.5); // Adjust volume with smooth transition
  }

  mousePressed(mx, my) {
    let speakerIconX = width - 50;
    if (mx > speakerIconX - 40 && mx < speakerIconX + 40 &&
        my > this.speakerIconY - 40 && my < this.speakerIconY + 40) {
      this.toggleSound();
    }
  }

  draw() {
    background(255);
    noStroke();
    fill(0);
    this.displayTitle();
    this.drawSpeakerIcon();
    this.setSliderLabel(`Slider Value: ${this.getSliderValue()}`);
    this.customContent(); // include the content
    this.displaySliderValue();
  }

  getSliderValue() {
   return this.slider.value();
  }

  getDemoTitle() {
    return this.title;
  }

  getSliderLabel() {
    return this.sliderLabel;
  }

  setSliderLabel(newLabel) {
    this.sliderLabel = newLabel;
  }

  setSliderRange(range) {
    this.sliderRange = range;
    if (this.slider) {
      this.slider.attribute('min', range[0]);
      this.slider.attribute('max', range[1]);
    }
  }

  getSliderRange() {
    return this.sliderRange;
  }

  // Method for custom content
  customContent() {
  // Drawing the string
  stroke(0);
  strokeWeight(2);
  let stringY = height / 2;
  let leftEndX = 10;
  let rightEndX = width - 10;

  // Draw small circles at the endpoints
  fill(0);
  ellipse(leftEndX, stringY, 10, 10);
  ellipse(rightEndX, stringY, 10, 10);

  // Animating the string as a standing wave
let nodes = this.getSliderValue() + 1;
  let amplitude = 25;
  let visualFrequency = 0.11 * (nodes-1); // Apply multiplier to visual frequency
  for (let x = leftEndX; x <= rightEndX; x++) {
    let proportion = (x - leftEndX) / (rightEndX - leftEndX);
    let angle = proportion * PI * (nodes - 1);
    let y = stringY + sin(angle) * amplitude * cos(frameCount * visualFrequency);
    point(x, y);
  }

  // Setting oscillator frequency
  let baseFreq = 110;
  this.oscillator.freq(baseFreq * nodes);

  // Updating the slider label
  let harmonicData = this.getHarmonicData(nodes);
  this.setSliderLabel(`Nodes: ${nodes - 2}, Harmonic: ${harmonicData.name} (${harmonicData.note} - ${harmonicData.interval}; ${baseFreq * nodes} Hz)`);
}

  // Additional method to get harmonic data based on nodes
  getHarmonicData(nodes) {
    const harmonics = [
  { name: "Fundamental", note: "A", interval: "Unison" },
  { name: "First Overtone", note: "A", interval: "Octave" },
  { name: "Second Overtone", note: "E", interval: "Perfect Fifth" },
  { name: "Third Overtone", note: "A", interval: "Octave" },
  { name: "Fourth Overtone", note: "C#", interval: "Major Third" },
  { name: "Fifth Overtone", note: "E", interval: "Perfect Fifth" },
  { name: "Sixth Overtone", note: "G", interval: "Minor Seventh" },
  { name: "Seventh Overtone", note: "G+", interval: "Minor Seventh+" }, // Microtone
  { name: "Eighth Overtone", note: "A", interval: "Octave" },
  { name: "Ninth Overtone", note: "B", interval: "Major Second" },
  { name: "Tenth Overtone", note: "C#", interval: "Major Third" },
  { name: "Eleventh Overtone", note: "D+", interval: "Perfect Fourth+" }, // Microtone
  { name: "Twelfth Overtone", note: "E", interval: "Perfect Fifth" },
  { name: "Thirteenth Overtone", note: "F", interval: "Minor Sixth" }, // Adjusted for clarity
  { name: "Fourteenth Overtone", note: "G-", interval: "Minor Seventh-" }, // Microtone
  { name: "Fifteenth Overtone", note: "G#", interval: "Major Seventh" }
];


    // Return the corresponding harmonic data
    return harmonics[nodes - 2] || { name: "Unknown", note: "N/A", interval: "N/A" };
  }
}

// Modify the setup function to set the appropriate slider range
function setup() {
  demo = new DemoTemplate('String Harmonics at 0.1% Speed');
  demo.setSliderRange([1, 16]); // Set the slider range from 1 to 16
  demo.setup();
}

function draw() {
  demo.draw();
}

function mousePressed() {
  demo.mousePressed(mouseX, mouseY);
}