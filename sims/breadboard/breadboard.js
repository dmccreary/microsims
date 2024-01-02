canvasWidth = 730;
drawHeight = 400;
canvasHeight = 430;
sliderLeftMargin = 110;

function preload() {
    breadboard_img = loadImage('./breadboard-background.png');
  }

function setup() {
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-container');
    textSize(16);

    mySlider = createSlider(0, 100, 50, 1);
    mySlider.position(sliderLeftMargin, drawHeight + 12);
    mySlider.style('width', canvasWidth -  sliderLeftMargin - 20 + 'px');
 

}

function draw() {
    // make the background drawing region light gray
    fill(245);
    rect(0,0,canvasWidth, canvasWidth);
    // make the background of the controls white
    fill('white')
    rect(0,drawHeight,canvasWidth, canvasHeight-drawHeight);

    // Place the image at 00
    image(breadboard_img, 0, 0);
    
    // get the updated slider value
    val = mySlider.value();

    text("MySlider: ", val, 10, drawHeight + 10)
}