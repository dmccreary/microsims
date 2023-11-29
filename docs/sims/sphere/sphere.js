
function setup() {
    createCanvas(710, 400, WEBGL);
    describe('A 3D example with a bouncing sphere covered in a grid of white and orange squares without strokes.');
  }
  
  let x, y, z;
  let xspeed, yspeed, zspeed;
  let diameter = 50;
  let radius = diameter / 2;
  let canvasWidth = 600;
  let canvasHeight = 400;

  function setup() {
    const canvas = createCanvas(canvasWidth, canvasHeight, WEBGL);
    canvas.parent('canvas-container');
    x = 0;
    y = 0;
    z = 0;
    xspeed = 2;
    yspeed = 2.3;
    zspeed = 1.7;
  }
  
  function draw() {
    background(200);
  
    // Update the position of the sphere
    x += xspeed;
    y += yspeed;
    z += zspeed;
  
    // Check for bouncing
    if (x > width/2 - radius || x < -width/2 + radius) {
      xspeed *= -1;
    }
    if (y > height/2 - radius || y < -height/2 + radius) {
      yspeed *= -1;
    }
    if (z > 200 - radius || z < -200 + radius) {
      zspeed *= -1;
    }
  
    // Draw the sphere with a texture
    push();
    translate(x, y, z);
    texture(createGridTexture());
    sphere(diameter);
    pop();
  }
  
  function createGridTexture() {
    let texSize = 200;
    let texture = createGraphics(texSize, texSize);
    noStroke();
    for (let i = 0; i < texSize; i += 20) {
      for (let j = 0; j < texSize; j += 20) {
        texture.fill((i + j) % 40 === 0 ? 'white' : 'orange');
        texture.rect(i, j, 20, 20);
      }
    }
    return texture;
  }
  