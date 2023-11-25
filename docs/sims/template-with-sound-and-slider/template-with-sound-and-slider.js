// p5.js template for a demo with a title, option to enable sound, 
// and a slider with label/info

// Base class for the demo
class DemoTemplate {
  constructor(title, sliderLabel) {
    this.title = title;
    this.sliderLabel = sliderLabel;
    this.isSoundOn = false;
    this.speakerIconX = 400; // X position of the speaker icon
    this.speakerIconY = 40;  // Y position of the speaker icon
    this.oscillator = new p5.Oscillator('sine');
  }

  setup() {
    createCanvas(500, 300);
    background(255);
    this.oscillator.amp(0); // Initial volume is 0
    this.oscillator.start();
  }

  draw() {
    background(255);
    noStroke();
    fill(0);
    this.createSlider();
    this.displayTitle();
    this.displaySliderValue();
    this.drawSpeakerIcon();

    this.customContent(); // Call to custom content method
  }

  createSlider() {
    let sliderY = height - 40;
    this.slider = createSlider(0, 100, 50);
    this.slider.position(10, sliderY);
    this.slider.style('width', '480px');
  }

  displayTitle() {
    textAlign(CENTER);
    textSize(20);
    text(this.title, width / 2, 45);
  }

  displaySliderValue() {
    let sliderY = height - 40;
    textAlign(LEFT);
    textSize(12);
    text(this.sliderLabel + ": " + this.slider.value(), 10, sliderY - 10);
  }

  drawSpeakerIcon() {
    let speakerIconX = width - 50;
    ellipse(speakerIconX, this.speakerIconY, 10, 10); // Speaker dot
    stroke(0);
    noFill();
    ellipse(speakerIconX, this.speakerIconY, 24, 24); // Outer circles
    ellipse(speakerIconX, this.speakerIconY, 30, 30);
    textSize(12);
    fill(0);
    noStroke();
    text(this.isSoundOn ? "Turn sound off" : "Turn sound on", speakerIconX - 40, this.speakerIconY + 30);
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

  // Method for custom content
  // PLACE ALL CONTENT WITHIN THIS METHOD
  customContent() {
    // add custom demo code here
    // ---------------------------------------
    // Example:
    // fill(255, 0, 0);
    // ellipse(100, 100, 50, 50);
    // ---------------------------------------
  }
}

// Utilize the DemoTemplate class
let demo;

function setup() {
  demo = new DemoTemplate('Your Title Here', 'Slider Info');
  demo.setup();
}

function draw() {
  demo.draw();
}

function mousePressed() {
  demo.mousePressed(mouseX, mouseY);
}
