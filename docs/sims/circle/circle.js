// draw a circle and use a slider to change the radius
canvasWidth = 400;
drawHeight = 400;
canvasHeight = 430;
sliderLeftMargin = 110;

function setup() {
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-container');
    textSize(16);

    radiusSlider = createSlider(0, 200, 60, 1);
    // position 20 up from the bottom
    radiusSlider.position(sliderLeftMargin, drawHeight + 12);
    radiusSlider.style('width', canvasWidth -  sliderLeftMargin - 20 + 'px');
  }
  
  function draw() {
    fill(245);
    rect(0, 0, canvasWidth, drawHeight);
    fill('white');
    rect(0, drawHeight, canvasWidth, canvasHeight - drawHeight);

    let radius = radiusSlider.value();
    fill('blue');
    circle(width/2, drawHeight/2, radius*2);
    fill('black');
    text('Radius: ' + radius, 10, drawHeight + 20);
  }