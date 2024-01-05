# Resize Demo

<figure markdown>
   ![Image Name](./image.png){ width="400" }
   <figcaption>Figure caption.</figcaption>
</figure>

[Link to Resize Demo](./resize-test.html){ .md-button .md-button--primary }

## About this MicroSim

This MicroSim teaches us go into full-screen and back.

```js
// resize test
rsz = 20; // resize button size

function setup() {
    // initial 600 wide and 400 high
    const canvas = createCanvas(600, 400);
    var mainElement = document.querySelector('main');
    canvas.parent(mainElement);
    textSize(16);
}

// draw the "toggle full screen" icon in the lower right corner
function drawResize() {
  wR = width-rsz; // with less resize button width
  hR = height-rsz; // height less resize button width
  fill('white');
  rect(wR,hR,rsz,rsz);
  stroke('black')
  
  line(wR+4, hR+4, wR+4, hR+8); // ul v
  line(wR+4, hR+4, wR+8, hR+4); // ul h

  line(width-4, hR+4, width-8, hR+4); // ur v
  line(width-4, hR+4, width-4, hR+8); // ur h
  
  line(wR+4, height-4, wR+4, height-8); // ll v
  line(wR+4, height-4, wR+8, height-4); // ll h
  
  line(width-4, height-4, width-4, height-8); // lr v
  line(width-4, height-4, width-8, height-4); // lr h
}

function draw() {
  background('lightgray');
  drawResize(); // draw the full screen toggle
  fill('black')
  noStroke();
  text("Window Width: " + str(windowWidth), 10, 20)
  text("Window Height: " + str(windowHeight), 10, 50)
}

// If the mouse is pressed in the resize box, toggle full-screen mode.
function mousePressed() {
  if (mouseX > width-rsz && mouseX < width && mouseY > height-rsz && mouseY < height) {
    // get the current value (0,1)
    let fs = fullscreen();
    // toggle the value
    fullscreen(!fs);
  }
}

// this works down to w=500 and h=254
function windowResized() {
  // console.log('windowResized', windowWidth, windowWidth);
  resizeCanvas(windowWidth-20, windowHeight-35);
}
```