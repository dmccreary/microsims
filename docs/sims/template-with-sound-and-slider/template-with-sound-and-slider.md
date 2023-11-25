# P5.js demo template with title, sound toggle, and slider

Contributed by [Shawn McBurnie](https://www.linkedin.com/in/shawnmcburnie/).

![Template with Sound and Slider](./../img/template-with-sound-and-slider.png)


* [Template with Sound and Slider](./template-with-sound-and-slider.html)

## Prompt #1

```linenums="0"
Please generate a p5.js base template, with the following attributes:
- A canvas on a white background, 500x300
- A sine wave oscillator, initialized at volume 0
- A simple but recognizable speaker icon set to occupy the upper right corner (but with its coordinates easily changed via variables for X and Y); it should have a line through the speaker initially and the visible and clickable label "Turn sound on"; on click, it should toggle volume between 0 and 0.3, and when the sound is on, remove the diagonal line and change the text to "Turn sound off"
- A title across the top of the canvas, inset 10px on all sides
- A slider at the bottom set up to occupy the full percentile width of the canvas, minus 10px at each side
- A slider status label above the slider, with placeholder text "Slider Info", inset 10px left and right
```

## P5.js Code 
Provide the following (which has been iteratively refined for ease of use) to ChatGPT via upload or copy/paste, and prompt it to use `customContent` in this p5.js script for the demo you have in mind:
```
// p5.js template for a demo with a title, option to enable sound, 
// and a slider with label/info

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
    createCanvas(500, 300);
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
  demo = new DemoTemplate('String Harmonics');
  demo.setup();
}

function draw() {
  demo.draw();
}

function mousePressed() {
  demo.mousePressed(mouseX, mouseY);
}

```

## Prompt #2
```linenums="0"
Please make a brief guide on what this template could be used for in K-12 STEM education, organized by lowest to highest grade, with fun and engagement as a priority.
```

## Response

### Kindergarten to Grade 2: Exploring Shapes and Colors
- **Activity:** Use the canvas to teach basic shapes and colors. The speaker icon can play different sounds when different shapes are clicked.
- **Educational Focus:** Recognition of shapes, colors, and association with sounds.
- **Engagement:** Interactive sound responses when shapes are clicked, keeping young students engaged and curious.

### Grades 3 to 5: Introduction to Sound and Waves
- **Activity:** Modify the sine wave oscillator to visually display sound waves on the canvas. Use the slider to change the frequency and amplitude of the waves.
- **Educational Focus:** Understanding the basics of sound waves, frequency, and amplitude.
- **Engagement:** Real-time visual representation of sound waves that change with slider adjustments, making abstract concepts more tangible.

### Grades 6 to 8: Basic Coding and Interactive Art
- **Activity:** Students can modify the code to change the shape and behavior of the speaker icon, or create interactive art that responds to the slider's position.
- **Educational Focus:** Introduction to coding principles, creativity in digital art.
- **Engagement:** Hands-on coding experience and the instant visual result of their code, fostering creativity and problem-solving skills.

### Grades 9 to 10: Exploring Physics and Mathematics
- **Activity:** Advanced manipulation of the sine wave properties, such as creating harmonics, to demonstrate wave interference and resonance.
- **Educational Focus:** Deeper understanding of wave physics, harmonics, and mathematical concepts in waveforms.
- **Engagement:** Interactive experimentation with wave properties, making complex physics concepts more accessible and intriguing.

### Grades 11 to 12: Advanced Coding and Signal Processing
- **Activity:** Use the template to delve into signal processing concepts, like Fourier transforms, by adding functionality to decompose complex waves into sine waves.
- **Educational Focus:** Advanced coding skills, signal processing, and mathematical analysis.
- **Engagement:** Hands-on experience with real-world applications of mathematics and coding in signal processing, encouraging exploration and deeper learning.

#### General Tips for All Levels:
- **Customization:** Allow students to personalize their projects, fostering a sense of ownership and creativity.
- **Collaboration:** Encourage group projects to promote teamwork and collaborative problem-solving.
- **Challenges and Rewards:** Introduce challenges or competitions related to the activities to increase engagement and motivation.
