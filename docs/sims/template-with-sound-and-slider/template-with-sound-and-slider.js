// template with sound and slider
// contributed by Shawn McBurnie
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
