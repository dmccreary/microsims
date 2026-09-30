// Spinning 3D Shapes MicroSim
// Demonstrates p5.js WEBGL capabilities for 3D graphics
// Learning objective: Introduce 3D coordinate concepts and WebGL rendering

let angle = 0;
let rotationSpeed = 0.02;
let lightIntensity = 150;
let colorScheme = 0;
let stars = [];
const NUM_STARS = 100;

// Color schemes for cycling through
const colorSchemes = [
  { torus: [180, 70, 90], name: 'Teal' },
  { torus: [280, 70, 90], name: 'Purple' },
  { torus: [30, 80, 95], name: 'Orange' },
  { torus: [120, 60, 85], name: 'Green' },
  { torus: [340, 70, 90], name: 'Pink' }
];

function setup() {
  const canvas = createCanvas(400, 400, WEBGL);
  canvas.parent(document.querySelector('main'));
  colorMode(HSB, 360, 100, 100);

  // Initialize background stars
  for (let i = 0; i < NUM_STARS; i++) {
    stars.push({
      x: random(-400, 400),
      y: random(-400, 400),
      z: random(-400, 400),
      size: random(1, 3)
    });
  }

  describe('A 3D animation showing a central rotating torus with orbiting spheres, boxes, and cones. Mouse controls rotation speed and lighting. Click to change colors.', LABEL);
}

function draw() {
  // Gradient background - deep purple to dark blue
  background(260, 80, 15);

  // Map mouse position to controls
  // Mouse X controls rotation speed (0.005 to 0.05)
  rotationSpeed = map(mouseX, 0, width, 0.005, 0.05);
  // Mouse Y controls lighting intensity (50 to 255)
  lightIntensity = map(mouseY, 0, height, 255, 50);

  // Draw background stars
  push();
  noStroke();
  for (let star of stars) {
    push();
    translate(star.x, star.y, star.z);
    fill(60, 10, 100); // Pale yellow stars
    sphere(star.size);
    pop();
  }
  pop();

  // Lighting setup
  ambientLight(60);
  directionalLight(0, 0, lightIntensity, 0, 0, -1);
  pointLight(255, 255, 255, 0, -200, 100);

  // Enable orbit control for camera dragging
  orbitControl();

  // Get current color scheme
  let currentColors = colorSchemes[colorScheme];

  // Central torus (donut shape)
  push();
  rotateY(angle);
  rotateX(angle * 0.3);
  fill(currentColors.torus[0], currentColors.torus[1], currentColors.torus[2]);
  specularMaterial(100);
  torus(80, 30, 24, 16);
  pop();

  // Orbiting shapes - 5 different shapes at different orbits

  // Orbiting sphere 1
  push();
  rotateY(angle * 0.8);
  translate(130, 0, 0);
  rotateX(angle * 2);
  rotateZ(angle * 1.5);
  fill(0, 80, 90); // Red
  specularMaterial(50);
  sphere(18);
  pop();

  // Orbiting box 2
  push();
  rotateY(-angle * 0.6);
  rotateX(PI / 6);
  translate(160, 0, 0);
  rotateY(angle * 2.5);
  rotateX(angle * 1.8);
  fill(60, 80, 90); // Yellow
  specularMaterial(50);
  box(25);
  pop();

  // Orbiting cone 3
  push();
  rotateY(angle * 1.0);
  rotateZ(PI / 4);
  translate(140, 0, 0);
  rotateX(angle * 2);
  fill(120, 70, 85); // Green
  specularMaterial(50);
  cone(15, 30);
  pop();

  // Orbiting sphere 4
  push();
  rotateY(-angle * 0.5);
  rotateX(-PI / 5);
  translate(180, 0, 0);
  rotateZ(angle * 3);
  fill(200, 80, 90); // Cyan
  specularMaterial(50);
  sphere(12);
  pop();

  // Orbiting box 5 (smaller, faster)
  push();
  rotateY(angle * 1.2);
  rotateZ(-PI / 3);
  translate(110, 0, 0);
  rotateX(angle * 4);
  rotateY(angle * 3);
  fill(300, 70, 90); // Magenta
  specularMaterial(50);
  box(15);
  pop();

  // Update rotation angle
  angle += rotationSpeed;
}

function mousePressed() {
  // Cycle through color schemes on click
  colorScheme = (colorScheme + 1) % colorSchemes.length;
}

function windowResized() {
  // Keep canvas square for best 3D viewing
  resizeCanvas(400, 400);
}
