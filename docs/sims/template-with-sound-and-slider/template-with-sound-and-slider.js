// Base class for the p5.js demo with sound and slider
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

  // Method for custom content - place all content for the template here!
  customContent() {}
}

// Use the DemoTemplate class
let demo;

function setup() {
  demo = new DemoTemplate('Your Title');
  demo.setup();
}

function draw() {
  demo.draw();
}

function mousePressed() {
  demo.mousePressed(mouseX, mouseY);
}