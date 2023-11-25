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

## Processing Code 
Provide the following to ChatGPT via upload or copy/paste, and prompt it to extend this p5.js script for the demo you have in mind:
```
// p5.js template for a demo with a title, option to enable sound, 
// and a slider with label/info

let oscillator;
let isSoundOn = false;
let slider, sliderY, sliderLabel, title;

let speakerIconX = 400; // initial X coordinate for speaker icon
let speakerIconY = 40;  // initial Y coordinate for speaker icon

function setup() {

  // Create canvas and set background color
  createCanvas(500, 300);
  background(255);

  // Initialize the oscillator
  oscillator = new p5.Oscillator('sine');
  oscillator.amp(0); // Volume set to 0 initially
  oscillator.start();
  
  // Title; replace with real content
  title = 'Your Title Here';
  // Slider label; replace with real content
  sliderLabel = 'Slider Info';
  
}

function draw() {
  // Clear canvas and set background
  background(255);
  noStroke();
  fill(0);

  // Create slider
  let sliderY = height - 40;
  slider = createSlider(0, 100, 50);
  slider.position(10, sliderY);
  slider.style('width', '480px');

  // Draw title
  textAlign(CENTER);
  textSize(20);
  // replace with real title
  text(title, width / 2, 45);

  // Draw Speaker Icon
  drawSpeakerIcon();

  // Display slider value
  textAlign(LEFT);
  textSize(12);
  text(sliderLabel + ": " + slider.value(), 10, sliderY-10);
}

function drawSpeakerIcon() {
  let speakerIconX = width-50; // X coordinate for speaker icon based on  canvas size

  // Speaker icon
  ellipse(speakerIconX, speakerIconY, 10, 10); // Filled dot

  stroke(0); // Black color for circles
  noFill();
  ellipse(speakerIconX, speakerIconY, 24, 24); // First concentric circle
  ellipse(speakerIconX, speakerIconY, 30, 30); // Second concentric circle
  
  textSize(12);
  
  if (!isSoundOn) {
    line(speakerIconX + 15, speakerIconY - 15, speakerIconX - 15, speakerIconY + 15);
    noStroke();
    fill(0);
    text("Turn sound on", speakerIconX - 5, speakerIconY + 25);
  } else {

  noStroke();
  fill(0);
    text("Turn sound off", speakerIconX - 5, speakerIconY + 25);
  }
}

function mousePressed() {  
let speakerIconX = width-40;
  // Toggle sound on speaker icon click
  if (mouseX > speakerIconX - 40 && mouseX < speakerIconX + 40 &&
      mouseY > speakerIconY - 40 && mouseY < speakerIconY + 40) {
    isSoundOn = !isSoundOn;
    oscillator.amp(isSoundOn ? 0.3 : 0, 0.5); // Smooth transition in volume
  }
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
